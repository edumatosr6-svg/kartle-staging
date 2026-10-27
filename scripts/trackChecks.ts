// trackChecks — pure library of the checks V01 to V18 of RULE-0002 over a generated track file and its origin
// (DES-0011 of pista-kart-park). Track-data role, under scripts/. Imports only the track-data modules of the client and
// never scripts/trackPrep.ts: it reads the origin with its own code to judge the preparation instead of repeating it.
// No node:* module: the program and the tests read the files and compute the SHA-256.
import { sideOf, type Line, type Point } from '../src/track';
import { readTrackData, type Schema3Fields, type TrackReading } from '../src/trackData';
import {
  beyondTrackEdgeM, buildTrackGeometry, classifySurface, closestOnSegment, lapMAtIndex,
} from '../src/trackGeometry';

export type CheckId = 'V01' | 'V02' | 'V03' | 'V04' | 'V05' | 'V06' | 'V07' | 'V08' | 'V09' | 'V10' | 'V11' | 'V12' | 'V13' | 'V14' | 'V15' | 'V16' | 'V17' | 'V18';
export type CheckResult = { id: CheckId; pass: boolean; detail: string };
export const CHECK_IDS: readonly CheckId[] = ['V01', 'V02', 'V03', 'V04', 'V05', 'V06', 'V07', 'V08', 'V09', 'V10', 'V11', 'V12', 'V13', 'V14', 'V15', 'V16', 'V17', 'V18'];

export const MAX_FILE_BYTES = 200_000;
const MAX_OFFSET_M = 0.30;
const LAP_MIN_M = 680.625, LAP_MAX_M = 694.375;
const POINT_TOLERANCE_M = 0.002;
const VALUE_TOLERANCE = 0.0005;
const PARALLEL_SINE = 0.001;
const SECTOR_TARGETS_M = [201.6, 350.3, 529.9];
const MARKER_MAX_SPACING_M = 25;
const LINE_SAMPLE_M = 0.05;
const CUT_DISTANCE_M = 3;
const CUT_TOLERANCE_M = 0.001;
const END_SHORT_M = 2.95, END_LOOKAHEAD_M = 0.06;
const NEAR_SECTIONS_M: readonly (readonly [number, number])[] = [[371, 414], [580, 615]];
const BARRIER_GAP_MAX_M = 6;
const EDGE_SAMPLE_M = 0.25;
const TOUCH_TOLERANCE_M = 0.002;
const EXPECTED_CURBS = 34;
const EXPECTED_ORIGIN_POINTS = 684;
const WIDTH_MIN_1DP = 4.4, WIDTH_MAX_1DP = 10.8;
const EXPECTED_IDENTITY = { schemaVersion: 3, trackId: 'kart-park', trackVersion: 1, osmDerived: true };
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

type Origin = { points: Point[]; widths: number[]; curbs: { side: 'LEFT' | 'RIGHT'; fromM: number; toM: number }[]; cumulative: number[]; length: number };
const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const round3 = (v: number) => Math.round(v * 1000) / 1000;

// The origin in the game axes (RULE-0002): x east, z = -north, centred on the bounding box, rounded to 0.001 m.
function readOrigin(json: unknown): Origin | undefined {
  if (!isRecord(json) || !Array.isArray(json.pontos) || !Array.isArray(json.zebras)) return undefined;
  const raw = json.pontos as unknown[];
  if (!raw.every(p => Array.isArray(p) && p.length === 3 && p.every(v => typeof v === 'number' && Number.isFinite(v)))) return undefined;
  const pts = raw as [number, number, number][];
  const cx = round3((Math.min(...pts.map(p => p[0])) + Math.max(...pts.map(p => p[0]))) / 2);
  const cy = round3((Math.min(...pts.map(p => p[1])) + Math.max(...pts.map(p => p[1]))) / 2);
  const points = pts.map(p => ({ x: p[0] - cx, z: -(p[1] - cy) }));
  const cumulative: number[] = []; let length = 0;
  for (let i = 0; i < points.length; i++) { cumulative.push(length); const a = points[i], b = points[(i + 1) % points.length]; length += Math.hypot(b.x - a.x, b.z - a.z); }
  const curbs: Origin['curbs'] = [];
  for (const z of json.zebras as unknown[]) {
    if (!isRecord(z) || typeof z.lado !== 'string' || !(z.lado in SIDE_OF) || typeof z.de_m !== 'number' || typeof z.ate_m !== 'number') return undefined;
    curbs.push({ side: SIDE_OF[z.lado], fromM: z.de_m, toM: z.ate_m });
  }
  return { points, widths: pts.map(p => p[2]), curbs, cumulative, length };
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
const fractionalIndex = (cumulative: readonly number[], length: number, m: number) => {
  const v = Math.max(0, Math.min(length, m));
  let index = 0;
  for (let i = 0; i < cumulative.length; i++) if (cumulative[i] <= v) index = i; else break;
  const end = index + 1 < cumulative.length ? cumulative[index + 1] : length;
  const seg = end - cumulative[index];
  return { index, fraction: seg > 0 ? Math.min(1, (v - cumulative[index]) / seg) : 0 };
};
const lapDelta = (a: number, b: number, L: number) => { const d = Math.abs(a - b) % L; return Math.min(d, L - d); };

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

// V01 to V18, all of them, always in the same order; `detail` carries identifiers and measures only.
export function verifyTrackFile(text: string, originJson: unknown): CheckResult[] {
  const reading = readTrackData(text);
  const origin = readOrigin(originJson);
  let raw: Record<string, unknown> | undefined;
  try { const parsed: unknown = JSON.parse(text); raw = isRecord(parsed) ? parsed : undefined; } catch { raw = undefined; }
  if (!(reading.trackDataStatus === 'COMPLETE' && reading.centerline && reading.curbs && reading.barriers) || !origin || !raw) {
    const detail = !origin ? 'origin: out of form' : !raw ? 'file: not a JSON object' : `reading: ${reading.trackDataStatus}`;
    return CHECK_IDS.map(id => ({ id, pass: false, detail }));
  }
  const file = reading as Extract<TrackReading, { trackDataStatus: 'COMPLETE' }> & Schema3Fields;
  const g = buildTrackGeometry(file.centerline, file.curbs, file.barriers);
  const asphaltOnly = buildTrackGeometry(file.centerline, [], []);
  const n = g.centerline.length, L = g.lapLengthM;
  const P = (i: number): Point => ({ x: g.centerline[i].xM, z: g.centerline[i].zM });
  const results: CheckResult[] = [];
  const push = (id: CheckId, pass: boolean, detail: string) => results.push({ id, pass, detail });

  // V01: same count as the origin; point i generated within 0.30 m of point i of the origin.
  {
    let worst = 0, worstIndex = -1;
    for (let i = 0; i < Math.min(n, origin.points.length); i++) {
      const d = Math.hypot(g.centerline[i].xM - origin.points[i].x, g.centerline[i].zM - origin.points[i].z);
      if (d > worst) { worst = d; worstIndex = i; }
    }
    push('V01', n === origin.points.length && origin.points.length === EXPECTED_ORIGIN_POINTS && worst <= MAX_OFFSET_M, `points ${n}/${origin.points.length}; max offset ${worst.toFixed(4)} m at ${worstIndex}`);
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
  // V06: widths equal to the origin; min 4.4 and max 10.8 at one decimal.
  {
    let equal = n === origin.widths.length, min = Infinity, max = -Infinity;
    for (let i = 0; i < n; i++) { const w = g.centerline[i].widthM; if (Math.abs(w - (origin.widths[i] ?? NaN)) > VALUE_TOLERANCE) equal = false; min = Math.min(min, w); max = Math.max(max, w); }
    const min1 = Math.round(min * 10) / 10, max1 = Math.round(max * 10) / 10;
    push('V06', equal && min1 === WIDTH_MIN_1DP && max1 === WIDTH_MAX_1DP, `widths equal ${equal}; min ${min1} max ${max1}`);
  }
  // V07: every generated point within 0.30 m of the original closed polyline.
  {
    let worst = 0;
    for (let i = 0; i < n; i++) worst = Math.max(worst, distanceToClosedPolyline(origin.points, P(i)));
    push('V07', worst <= MAX_OFFSET_M, `max distance to the original polyline ${worst.toFixed(4)} m`);
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
  // V09: 3 limits, in order, each through the point nearest its target by the original lap distance, along its normal.
  const limitIndices = SECTOR_TARGETS_M.map(t => { let best = 0; for (let i = 1; i < n; i++) if (Math.abs(origin.cumulative[i] - t) < Math.abs(origin.cumulative[best] - t)) best = i; return best; });
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
  // V12: 34 spans matching the origin curbs by fractional index; the one crossing the start split in two.
  {
    const expected: { side: 'LEFT' | 'RIGHT'; fromLapM: number; toLapM: number }[] = [];
    const corr = (m: number) => { const f = fractionalIndex(origin.cumulative, origin.length, m); return lapMAtIndex(g, f.index, f.fraction); };
    for (const c of origin.curbs) {
      if (c.toM > origin.length) { expected.push({ side: c.side, fromLapM: corr(c.fromM), toLapM: L }); expected.push({ side: c.side, fromLapM: 0, toLapM: corr(c.toM - origin.length) }); }
      else expected.push({ side: c.side, fromLapM: corr(c.fromM), toLapM: corr(c.toM) });
    }
    const spans = file.curbs;
    const matched = expected.every(e => spans.some(s => s.side === e.side && Math.abs(s.fromLapM - e.fromLapM) <= VALUE_TOLERANCE && Math.abs(s.toLapM - e.toLapM) <= VALUE_TOLERANCE));
    const wellFormed = spans.every(s => s.fromLapM < s.toLapM && s.widthM > 0);
    push('V12', spans.length === EXPECTED_CURBS && expected.length === EXPECTED_CURBS && matched && wellFormed, `spans ${spans.length}; expected ${expected.length}; matched ${matched}`);
  }
  // Shared by V13 to V15: the near sections by the original lap distance.
  const sectionIndices = NEAR_SECTIONS_M.map(([a, b]) => { const out: number[] = []; for (let i = 0; i < n; i++) if (origin.cumulative[i] >= a && origin.cumulative[i] <= b) out.push(i); return out; });
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
  const nearestOn = (segs: { a: Point; b: Point }[], p: Point) => { let best = { point: p, distanceM: Infinity }; for (const s of segs) { const c = closestOnSegment(s.a, s.b, p); if (c.distanceM < best.distanceM) best = { point: c.point, distanceM: c.distanceM }; } return best; };
  const asphaltDistance = (indices: number[], p: Point) => { let best = Infinity; for (const i of indices) best = Math.min(best, pointToQuad(asphaltOnly.asphaltQuads[i], p)); return best; };
  // V13: every close pair of edge samples between the sections is separated by a barrier segment.
  {
    let bad: string | undefined, pairs = 0;
    for (const [from, to] of [[0, 1], [1, 0]]) {
      const target = edgeSegments(sectionIndices[to]);
      for (const p of sampleSegments(edgeSegments(sectionIndices[from]))) {
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
