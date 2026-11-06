// trackChecks — pure library of the checks V01 to V20 of RULE-0002 2.0.0 over a generated track file and the replica it
// was prepared from (DES-0011 2.0.0 of pista-kart-park). Track-data role, under scripts/. Imports only the track-data
// modules of the client and never scripts/trackPrep.ts: it reads the replica with its own code to judge the preparation
// instead of repeating it. The version 1 is judged by its registered digest, not here.
// No node:* module: the program and the tests read the files and compute the SHA-256.
import { sideOf, type Line, type Point } from '../src/track';
import { readTrackData, type Schema3Fields, type TrackReading } from '../src/trackData';
import {
  beyondTrackEdgeM, buildTrackGeometry, classifySurface, closestOnSegment,
} from '../src/trackGeometry';

export type CheckId = 'V01' | 'V02' | 'V03' | 'V04' | 'V05' | 'V06' | 'V07' | 'V08' | 'V09' | 'V10' | 'V11' | 'V12' | 'V13' | 'V14' | 'V15' | 'V16' | 'V17' | 'V18' | 'V19' | 'V20';
export type CheckResult = { id: CheckId; pass: boolean; detail: string };
export const CHECK_IDS: readonly CheckId[] = ['V01', 'V02', 'V03', 'V04', 'V05', 'V06', 'V07', 'V08', 'V09', 'V10', 'V11', 'V12', 'V13', 'V14', 'V15', 'V16', 'V17', 'V18', 'V19', 'V20'];

export const MAX_FILE_BYTES = 200_000;
const MAX_OFFSET_M = 0.10;
const LAP_MIN_M = 683.793, LAP_MAX_M = 697.607;
const POINT_TOLERANCE_M = 0.002;
const VALUE_TOLERANCE = 0.0005;
const PARALLEL_SINE = 0.001;
const SECTOR_TARGETS_M = [204.9, 354.9, 534.7];
const MARKER_MAX_SPACING_M = 25;
const LINE_SAMPLE_M = 0.05;
const CUT_DISTANCE_M = 3;
const CUT_TOLERANCE_M = 0.001;
const END_SHORT_M = 2.95, END_LOOKAHEAD_M = 0.06;
const NEAR_SECTIONS_M: readonly (readonly [number, number])[] = [[368.5, 406.5], [594.5, 624.5]];
const BARRIER_GAP_MAX_M = 6;
const EDGE_SAMPLE_M = 0.25;
const TOUCH_TOLERANCE_M = 0.002;
const EXPECTED_CURBS = 22;
const EXPECTED_WIDTH_M = 7.0;
const EXPECTED_IDENTITY = { schemaVersion: 3, trackId: 'kart-park', trackVersion: 2, osmDerived: true };
const SIDE_OF: Record<string, 'LEFT' | 'RIGHT'> = { esquerda: 'LEFT', direita: 'RIGHT' };
const ALLOWED_KEYS: Record<string, readonly string[]> = {
  '': ['schemaVersion', 'trackId', 'trackVersion', 'osmDerived', 'direction', 'startPosition', 'finishLine', 'sectorLimits', 'markers', 'centerline', 'curbs', 'barriers'],
  startPosition: ['xM', 'zM', 'headingDeg'],
  line: ['fromXM', 'fromZM', 'toXM', 'toZM'],
  centerline: ['xM', 'zM', 'widthM'],
  curbs: ['side', 'fromLapM', 'toLapM', 'widthM'],
  barriers: ['points'],
  barrierPoint: ['xM', 'zM'],
};

type Replica = { points: Point[]; curbs: { side: 'LEFT' | 'RIGHT'; fromM: number; toM: number }[]; straights: { fromM: number; lengthM: number }[] };
const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const finite = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

// The replica in the game axes (RULE-0002 2.0.0): x east, z = -north, with the replica's own origin (the start line),
// not rounded; its curbs and its `reta` elements by the replica's lap distances.
function readReplica(json: unknown): Replica | undefined {
  if (!isRecord(json) || !Array.isArray(json.pontos) || !Array.isArray(json.zebras) || !Array.isArray(json.elementos)) return undefined;
  const raw = json.pontos as unknown[];
  if (raw.length < 3 || !raw.every(p => Array.isArray(p) && p.length === 3 && p.every(finite))) return undefined;
  const points = (raw as [number, number, number][]).map(p => ({ x: p[0], z: -p[1] }));
  const curbs: Replica['curbs'] = [];
  for (const z of json.zebras as unknown[]) {
    if (!isRecord(z) || typeof z.lado !== 'string' || !(z.lado in SIDE_OF) || !finite(z.de_m) || !finite(z.ate_m)) return undefined;
    curbs.push({ side: SIDE_OF[z.lado], fromM: z.de_m, toM: z.ate_m });
  }
  const straights: Replica['straights'] = [];
  for (const e of json.elementos as unknown[]) {
    if (!isRecord(e) || typeof e.tipo !== 'string' || !finite(e.de_m) || !finite(e.comprimento_m)) return undefined;
    if (e.tipo === 'reta') straights.push({ fromM: e.de_m, lengthM: e.comprimento_m });
  }
  return { points, curbs, straights };
}

const distanceToClosedPolyline = (pts: readonly Point[], p: Point) => {
  let best = Infinity;
  for (let i = 0; i < pts.length; i++) best = Math.min(best, closestOnSegment(pts[i], pts[(i + 1) % pts.length], p).distanceM);
  return best;
};
const orient = (a: Point, b: Point, c: Point) => (b.x - a.x) * (c.z - a.z) - (b.z - a.z) * (c.x - a.x);
const segmentsCross = (p: Point, q: Point, a: Point, b: Point) => {
  const d1 = orient(a, b, p), d2 = orient(a, b, q), d3 = orient(p, q, a), d4 = orient(p, q, b);
  if (d1 * d2 > 0 || d3 * d4 > 0) return false;
  if (d1 === 0 && d2 === 0) return closestOnSegment(a, b, p).distanceM === 0 || closestOnSegment(a, b, q).distanceM === 0 || closestOnSegment(p, q, a).distanceM === 0 || closestOnSegment(p, q, b).distanceM === 0;
  return true;
};
// Crossing, or touching within the rounding of the recorded coordinates (half a unit of 0.001 m on each coordinate).
const segmentsTouch = (p: Point, q: Point, a: Point, b: Point) => segmentsCross(p, q, a, b)
  || Math.min(closestOnSegment(a, b, p).distanceM, closestOnSegment(a, b, q).distanceM, closestOnSegment(p, q, a).distanceM, closestOnSegment(p, q, b).distanceM) <= TOUCH_TOLERANCE_M;
const lineDirection = (l: Line) => { const dx = l.toXM - l.fromXM, dz = l.toZM - l.fromZM, len = Math.hypot(dx, dz); return { x: dx / len, z: dz / len, len }; };
const lineDistanceTo = (l: Line, p: Point) => closestOnSegment({ x: l.fromXM, z: l.fromZM }, { x: l.toXM, z: l.toZM }, p).distanceM;
// Parallel to the normal and oriented from the left end to the right end: the direction is -normal.
const lineAlongNormal = (l: Line, normal: Point) => { const d = lineDirection(l); return Math.abs(d.x * normal.z - d.z * normal.x) <= PARALLEL_SINE && d.x * normal.x + d.z * normal.z < 0; };

// Keys of the object and of every nested object, against DM-0001; returns the first unexpected key path, or undefined.
function unexpectedKey(file: Record<string, unknown>): string | undefined {
  const check = (obj: unknown, allowed: readonly string[], path: string): string | undefined => {
    if (!isRecord(obj)) return `${path}: not an object`;
    for (const key of Object.keys(obj)) if (!allowed.includes(key)) return `${path}.${key}`;
    return undefined;
  };
  const top = check(file, ALLOWED_KEYS[''], 'file');
  if (top) return top;
  const sp = check(file.startPosition, ALLOWED_KEYS.startPosition, 'startPosition');
  if (sp) return sp;
  const fl = check(file.finishLine, ALLOWED_KEYS.line, 'finishLine');
  if (fl) return fl;
  for (const [name, list] of [['sectorLimits', file.sectorLimits], ['markers', file.markers]] as const) {
    if (!Array.isArray(list)) return `${name}: not a list`;
    for (let i = 0; i < list.length; i++) { const r = check(list[i], ALLOWED_KEYS.line, `${name}[${i}]`); if (r) return r; }
  }
  for (const [name, key] of [['centerline', 'centerline'], ['curbs', 'curbs'], ['barriers', 'barriers']] as const) {
    const list = file[name];
    if (!Array.isArray(list)) return `${name}: not a list`;
    for (let i = 0; i < list.length; i++) {
      const r = check(list[i], ALLOWED_KEYS[key], `${name}[${i}]`);
      if (r) return r;
      if (name === 'barriers') {
        const points = (list[i] as Record<string, unknown>).points;
        if (!Array.isArray(points)) return `barriers[${i}].points: not a list`;
        for (let k = 0; k < points.length; k++) { const rp = check(points[k], ALLOWED_KEYS.barrierPoint, `barriers[${i}].points[${k}]`); if (rp) return rp; }
      }
    }
  }
  return undefined;
}

// V01 to V20, all of them, always in the same order; `detail` carries identifiers and measures only. An unreadable file
// fails every check; an unreadable replica fails the checks that read it (V01, V07, V12, V19).
export function verifyTrackFile(text: string, replicaJson: unknown): CheckResult[] {
  const reading = readTrackData(text);
  const replica = readReplica(replicaJson);
  let raw: Record<string, unknown> | undefined;
  try { const parsed: unknown = JSON.parse(text); raw = isRecord(parsed) ? parsed : undefined; } catch { raw = undefined; }
  if (!(reading.trackDataStatus === 'COMPLETE' && reading.centerline && reading.curbs && reading.barriers) || !raw) {
    const detail = !raw ? 'file: not a JSON object' : `reading: ${reading.trackDataStatus}`;
    return CHECK_IDS.map(id => ({ id, pass: false, detail }));
  }
  const replicaUnreadable = 'replica: out of form';
  const file = reading as Extract<TrackReading, { trackDataStatus: 'COMPLETE' }> & Schema3Fields;
  const g = buildTrackGeometry(file.centerline, file.curbs, file.barriers);
  const asphaltOnly = buildTrackGeometry(file.centerline, [], []);
  const n = g.centerline.length, L = g.lapLengthM;
  const P = (i: number): Point => ({ x: g.centerline[i].xM, z: g.centerline[i].zM });
  const results: CheckResult[] = [];
  const push = (id: CheckId, pass: boolean, detail: string) => results.push({ id, pass, detail });

  // V01: point 0 within 0.10 m of point 0 of the replica.
  if (!replica) push('V01', false, replicaUnreadable);
  else {
    const d = Math.hypot(g.centerline[0].xM - replica.points[0].x, g.centerline[0].zM - replica.points[0].z);
    push('V01', d <= MAX_OFFSET_M, `point 0 offset ${d.toFixed(4)} m`);
  }
  // V02
  push('V02', n >= 3 && (g.centerline[n - 1].xM !== g.centerline[0].xM || g.centerline[n - 1].zM !== g.centerline[0].zM), `points ${n}`);
  // V03
  push('V03', L >= LAP_MIN_M && L <= LAP_MAX_M, `lapLengthM ${L.toFixed(3)}`);
  // V04: finish line at P0 along n0, left to right; start on segment 0-1, after the finish, heading of the segment.
  {
    const finish = file.finishLine, start = file.startPosition;
    const nearFinish = lineDistanceTo(finish, P(0)) <= POINT_TOLERANCE_M && lineAlongNormal(finish, g.normals[0]);
    const seg = closestOnSegment(P(0), P(1 % n), { x: start.xM, z: start.zM });
    const heading = Math.atan2(g.centerline[1 % n].xM - g.centerline[0].xM, g.centerline[1 % n].zM - g.centerline[0].zM) * 180 / Math.PI;
    const startOk = seg.distanceM <= POINT_TOLERANCE_M && seg.t < 1 && sideOf(finish, { x: start.xM, z: start.zM }) > 0 && Math.abs(start.headingDeg - heading) <= VALUE_TOLERANCE;
    push('V04', nearFinish && startOk, `finish at P0 ${nearFinish}; start t ${seg.t.toFixed(3)} d ${seg.distanceM.toFixed(4)} heading ${start.headingDeg} vs ${heading.toFixed(3)}`);
  }
  // V05: positive signed area in the (x, -z) plane, direction COUNTER_CLOCKWISE.
  {
    let s = 0;
    for (let i = 0; i < n; i++) { const a = P(i), b = P((i + 1) % n); s += a.x * (-b.z) - b.x * (-a.z); }
    push('V05', s > 0 && file.direction === 'COUNTER_CLOCKWISE', `signed area ${s.toFixed(1)} m2; direction ${file.direction}`);
  }
  // V06: every width equal to 7.0 m.
  {
    const wrong = g.centerline.findIndex(p => Math.abs(p.widthM - EXPECTED_WIDTH_M) > VALUE_TOLERANCE);
    push('V06', wrong < 0, wrong < 0 ? `all ${n} widths ${EXPECTED_WIDTH_M} m` : `point ${wrong} width ${g.centerline[wrong].widthM} m`);
  }
  // V07: every generated point within 0.10 m of the closed replica polyline.
  if (!replica) push('V07', false, replicaUnreadable);
  else {
    let worst = 0;
    for (let i = 0; i < n; i++) worst = Math.max(worst, distanceToClosedPolyline(replica.points, P(i)));
    push('V07', worst <= MAX_OFFSET_M, `max distance to the replica polyline ${worst.toFixed(4)} m`);
  }
  // V08: the two edges closed, without self-intersection and without intersection between them.
  {
    const segs = (edge: readonly Point[]) => edge.map((p, i) => ({ a: p, b: edge[(i + 1) % edge.length] }));
    const left = segs(g.leftEdge), right = segs(g.rightEdge);
    let bad: string | undefined;
    const selfCross = (s: { a: Point; b: Point }[], name: string) => {
      for (let i = 0; i < s.length && !bad; i++) for (let j = i + 2; j < s.length; j++) {
        if (i === 0 && j === s.length - 1) continue;
        if (segmentsCross(s[i].a, s[i].b, s[j].a, s[j].b)) { bad = `${name} ${i} x ${j}`; break; }
      }
    };
    selfCross(left, 'left'); selfCross(right, 'right');
    for (let i = 0; i < left.length && !bad; i++) for (let j = 0; j < right.length; j++) if (segmentsCross(left[i].a, left[i].b, right[j].a, right[j].b)) { bad = `left ${i} x right ${j}`; break; }
    push('V08', bad === undefined, bad ?? 'edges free of intersections');
  }
  // V09: 3 limits, in order, each through the point nearest its target by the lap distance d, along its normal.
  const limitIndices = SECTOR_TARGETS_M.map(t => { let best = 0; for (let i = 1; i < n; i++) if (Math.abs(g.cumulativeM[i] - t) < Math.abs(g.cumulativeM[best] - t)) best = i; return best; });
  {
    const limits = file.sectorLimits;
    const ok = limits.length === 3 && limits.every((l, k) => lineDistanceTo(l, P(limitIndices[k])) <= POINT_TOLERANCE_M && lineAlongNormal(l, g.normals[limitIndices[k]]));
    push('V09', ok, `limit points ${limitIndices.join(', ')}; lap m ${limitIndices.map(i => g.cumulativeM[i].toFixed(1)).join(', ')}`);
  }
  // V10: each marker through a centerline point along its normal; increasing; not point 0 nor a limit point; spacing <= 25 m.
  {
    const markerIndices = file.markers.map(m => { let best = -1; for (let i = 0; i < n; i++) if (lineDistanceTo(m, P(i)) <= POINT_TOLERANCE_M && lineAlongNormal(m, g.normals[i])) { best = i; break; } return best; });
    let ok = markerIndices.every(i => i >= 0 && i !== 0 && !limitIndices.includes(i));
    for (let k = 1; k < markerIndices.length; k++) if (markerIndices[k] <= markerIndices[k - 1]) ok = false;
    let maxGap = 0;
    for (let k = 0; k < markerIndices.length; k++) {
      const a = g.cumulativeM[markerIndices[k]], b = g.cumulativeM[markerIndices[(k + 1) % markerIndices.length]];
      maxGap = Math.max(maxGap, k + 1 < markerIndices.length ? b - a : L - a + b);
    }
    if (markerIndices.length === 0 || maxGap > MARKER_MAX_SPACING_M) ok = false;
    push('V10', ok, `markers ${markerIndices.length}; max spacing ${maxGap.toFixed(2)} m; points ${markerIndices.join(',')}`);
  }
  // V11: every line crosses the track edge to edge, ends at most 3 m beyond the track edge, and a short end is stopped by
  // the track, by a barrier crossing or lies on the barrier; the samples beyond the origin edge are grass.
  {
    const lines: [string, Line][] = [['finish', file.finishLine], ...file.sectorLimits.map((l, k) => [`limit ${k}`, l] as [string, Line]), ...file.markers.map((l, k) => [`marker ${k}`, l] as [string, Line])];
    let bad: string | undefined;
    for (const [name, line] of lines) {
      const d = lineDirection(line);
      const from = { x: line.fromXM, z: line.fromZM }, to = { x: line.toXM, z: line.toZM };
      const count = Math.max(1, Math.ceil(d.len / LINE_SAMPLE_M));
      const classes: string[] = [];
      for (let s = 0; s <= count; s++) { const t = Math.min(1, s * LINE_SAMPLE_M / d.len); classes.push(classifySurface(g, { x: from.x + d.x * t * d.len, z: from.z + d.z * t * d.len })); }
      const first = classes.findIndex(c => c !== 'grass'), last = classes.length - 1 - [...classes].reverse().findIndex(c => c !== 'grass');
      const contiguous = first > 0 && last < classes.length - 1 && classes.slice(first, last + 1).every(c => c !== 'grass');
      if (!contiguous) { bad = `${name}: does not cross the track edge to edge`; break; }
      for (const [end, outward] of [[from, { x: -d.x, z: -d.z }], [to, { x: d.x, z: d.z }]] as const) {
        const beyond = beyondTrackEdgeM(g, end);
        if (beyond > CUT_DISTANCE_M + CUT_TOLERANCE_M) { bad = `${name}: end ${beyond.toFixed(3)} m beyond the track edge`; break; }
        if (beyond < END_SHORT_M) {
          const ahead = { x: end.x + outward.x * END_LOOKAHEAD_M, z: end.z + outward.z * END_LOOKAHEAD_M };
          const onBarrier = g.barrierSegments.some(b => closestOnSegment(b.a, b.b, end).distanceM <= CUT_TOLERANCE_M);
          const crossesBarrier = g.barrierSegments.some(b => segmentsTouch(end, ahead, b.a, b.b));
          let trackAhead = false;
          for (let s = 1; s <= Math.ceil(END_LOOKAHEAD_M / LINE_SAMPLE_M); s++) {
            const t = Math.min(END_LOOKAHEAD_M, s * LINE_SAMPLE_M);
            if (classifySurface(g, { x: end.x + outward.x * t, z: end.z + outward.z * t }) !== 'grass') trackAhead = true;
          }
          if (!onBarrier && !crossesBarrier && !trackAhead) { bad = `${name}: end ${beyond.toFixed(3)} m beyond the edge without track or barrier ahead`; break; }
        }
      }
      if (bad) break;
    }
    push('V11', bad === undefined, bad ?? `${lines.length} lines cross edge to edge within ${CUT_DISTANCE_M} m`);
  }
  // V12: 22 spans, in the order of the replica curbs: same side, fromLapM = de_m, toLapM = ate_m, width above 0.
  if (!replica) push('V12', false, replicaUnreadable);
  else {
    const spans = file.curbs;
    const mismatch = spans.findIndex((s, k) => {
      const c = replica.curbs[k];
      return !c || s.side !== c.side || Math.abs(s.fromLapM - c.fromM) > VALUE_TOLERANCE || Math.abs(s.toLapM - c.toM) > VALUE_TOLERANCE || !(s.widthM > 0);
    });
    const ok = spans.length === EXPECTED_CURBS && replica.curbs.length === EXPECTED_CURBS && mismatch < 0;
    push('V12', ok, `spans ${spans.length}; replica curbs ${replica.curbs.length}${mismatch >= 0 ? `; span ${mismatch} differs` : ''}`);
  }
  // Shared by V13 to V15: the near sections by the lap distance d of the centerline.
  const sectionIndices = NEAR_SECTIONS_M.map(([a, b]) => { const out: number[] = []; for (let i = 0; i < n; i++) if (g.cumulativeM[i] >= a && g.cumulativeM[i] <= b) out.push(i); return out; });
  const edgeSegments = (indices: number[]) => {
    const segs: { a: Point; b: Point }[] = [];
    for (const edge of [g.leftEdge, g.rightEdge]) for (let k = 0; k + 1 < indices.length; k++) segs.push({ a: edge[indices[k]], b: edge[indices[k + 1]] });
    return segs;
  };
  const sampleSegments = (segs: { a: Point; b: Point }[]) => {
    const out: Point[] = [];
    for (const s of segs) { const len = Math.hypot(s.b.x - s.a.x, s.b.z - s.a.z); const c = Math.max(1, Math.ceil(len / EDGE_SAMPLE_M)); for (let k = 0; k < c; k++) out.push({ x: s.a.x + (s.b.x - s.a.x) * k / c, z: s.a.z + (s.b.z - s.a.z) * k / c }); }
    if (segs.length) out.push(segs[segs.length - 1].b);
    return out;
  };
  // DES-0010 2.1.0 step 5, the single edge-sampling definition: each edge alone, plus its own last endpoint.
  const edgeSamples = (indices: number[]) => [g.leftEdge, g.rightEdge].flatMap(edge => {
    const segs: { a: Point; b: Point }[] = [];
    for (let k = 0; k + 1 < indices.length; k++) segs.push({ a: edge[indices[k]], b: edge[indices[k + 1]] });
    return sampleSegments(segs);
  });
  const nearestOn = (segs: { a: Point; b: Point }[], p: Point) => { let best = { point: p, distanceM: Infinity }; for (const s of segs) { const c = closestOnSegment(s.a, s.b, p); if (c.distanceM < best.distanceM) best = { point: c.point, distanceM: c.distanceM }; } return best; };
  const asphaltDistance = (indices: number[], p: Point) => { let best = Infinity; for (const i of indices) best = Math.min(best, pointToQuad(asphaltOnly.asphaltQuads[i], p)); return best; };
  // V13: every close pair of edge samples between the sections is separated by a barrier segment.
  {
    let bad: string | undefined, pairs = 0;
    for (const [from, to] of [[0, 1], [1, 0]]) {
      const target = edgeSegments(sectionIndices[to]);
      for (const p of edgeSamples(sectionIndices[from])) {
        const q = nearestOn(target, p);
        if (q.distanceM > BARRIER_GAP_MAX_M) continue;
        pairs++;
        if (!g.barrierSegments.some(b => segmentsTouch(p, q.point, b.a, b.b))) { bad = `sample at (${p.x.toFixed(2)}, ${p.z.toFixed(2)}) ${q.distanceM.toFixed(2)} m from the other section without a barrier`; break; }
      }
      if (bad) break;
    }
    push('V13', bad === undefined, bad ?? `${pairs} close pairs, all separated by a barrier`);
  }
  // V14: every barrier vertex and 0.25 m sample lies within 6 m of asphalt-to-asphalt between the sections.
  {
    let worst = 0;
    const points: Point[] = [];
    for (const s of g.barrierSegments) { points.push(s.a); for (const p of sampleSegments([s])) points.push(p); points.push(s.b); }
    for (const p of points) worst = Math.max(worst, asphaltDistance(sectionIndices[0], p) + asphaltDistance(sectionIndices[1], p));
    push('V14', g.barrierSegments.length > 0 && worst <= BARRIER_GAP_MAX_M, `${g.barrierSegments.length} segments; max summed distance ${worst.toFixed(3)} m`);
  }
  // V15: no vertex inside the asphalt; no segment crosses an asphalt edge.
  {
    let bad: string | undefined;
    g.barriers.forEach((b, bi) => b.points.forEach((p, pi) => { if (!bad && classifySurface(asphaltOnly, { x: p.xM, z: p.zM }) === 'asphalt') bad = `barrier ${bi} vertex ${pi} inside the asphalt`; }));
    const edges = [...g.leftEdge.map((p, i) => ({ a: p, b: g.leftEdge[(i + 1) % n] })), ...g.rightEdge.map((p, i) => ({ a: p, b: g.rightEdge[(i + 1) % n] }))];
    g.barrierSegments.forEach((s, si) => { if (!bad && edges.some(e => segmentsCross(s.a, s.b, e.a, e.b))) bad = `barrier segment ${si} crosses an asphalt edge`; });
    push('V15', bad === undefined, bad ?? 'barriers on the grass');
  }
  // V16: identity, no cut limits declared.
  {
    const ok = raw.schemaVersion === EXPECTED_IDENTITY.schemaVersion && raw.trackId === EXPECTED_IDENTITY.trackId && raw.trackVersion === EXPECTED_IDENTITY.trackVersion
      && raw.osmDerived === EXPECTED_IDENTITY.osmDerived && raw.cutDistanceM === undefined && raw.cutDurationMs === undefined;
    push('V16', ok, `schemaVersion ${String(raw.schemaVersion)}, trackId ${String(raw.trackId)}, trackVersion ${String(raw.trackVersion)}, osmDerived ${String(raw.osmDerived)}`);
  }
  // V17: file bytes and the length of the text as a string literal in the bundle.
  {
    const bytes = utf8Length(text), literal = JSON.stringify(text).length;
    push('V17', bytes < MAX_FILE_BYTES && literal < MAX_FILE_BYTES, `bytes ${bytes}; literal ${literal}`);
  }
  // V18: exactly the keys of DM-0001, at every level.
  {
    const extra = unexpectedKey(raw);
    push('V18', extra === undefined, extra ?? 'keys as declared');
  }
  // V19: each sector-limit point of V09 lies within a `reta` element of the replica.
  if (!replica) push('V19', false, replicaUnreadable);
  else {
    const outside = limitIndices.filter(i => !replica.straights.some(e => e.fromM <= g.cumulativeM[i] && g.cumulativeM[i] <= e.fromM + e.lengthM));
    push('V19', outside.length === 0, outside.length ? `limit points outside a straight: ${outside.join(', ')}` : `limit points ${limitIndices.join(', ')} on straights`);
  }
  // V20: every curb span within 0 <= fromLapM < toLapM <= lapLengthM (upper bound with half a unit of the last place).
  {
    const bad = file.curbs.findIndex(c => !(c.fromLapM >= 0 && c.fromLapM < c.toLapM && c.toLapM <= L + VALUE_TOLERANCE));
    push('V20', bad < 0, bad < 0 ? `${file.curbs.length} spans within 0-${L.toFixed(3)} m` : `span ${bad} ${file.curbs[bad].fromLapM}-${file.curbs[bad].toLapM} m`);
  }
  return results;
}

function pointToQuad(q: readonly Point[], p: Point): number {
  if (q.length === 4) {
    let inside = false;
    for (let i = 0, j = 3; i < 4; j = i++) {
      const a = q[i], b = q[j];
      if ((a.z > p.z) !== (b.z > p.z) && p.x < a.x + (p.z - a.z) * (b.x - a.x) / (b.z - a.z)) inside = !inside;
    }
    if (inside) return 0;
  }
  let best = Infinity;
  for (let i = 0, j = q.length - 1; i < q.length; j = i++) best = Math.min(best, closestOnSegment(q[i], q[j], p).distanceM);
  return best;
}

// UTF-8 byte length without node:buffer (the library imports no node:* module).
export function utf8Length(text: string): number {
  let bytes = 0;
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    if (c < 0x80) bytes += 1;
    else if (c < 0x800) bytes += 2;
    else if (c >= 0xd800 && c <= 0xdbff) { bytes += 4; i++; }
    else bytes += 3;
  }
  return bytes;
}
