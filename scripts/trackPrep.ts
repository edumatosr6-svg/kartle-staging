// trackPrep — pure library of the offline track preparation (DES-0010, ADR-0002, ADR-0006 of pista-kart-park).
// Track-data role, under scripts/: produces a schema-3 track file from a kartle-pista origin. Imports only the
// track-data modules of the client; no node:* module, no clock, no random. The program scripts/track-pipeline.ts
// does the file I/O; npm test proves the construction without writing anything.
import type { Line } from '../src/track';
import type { StartPosition, TrackDirection } from '../src/trackData';
import {
  BARRIER_HALF_WIDTH_M, beyondTrackEdgeM, buildTrackGeometry, classifySurface, closestOnSegment, lapMAtIndex, nearestOnCenterline, positionAtLapM,
  windingSumOf, type BarrierLine, type CurbSide, type CurbSpan, type TrackGeometry, type TrackPoint,
} from '../src/trackGeometry';

export const SMOOTH_WINDOW_M = 12;
export const SMOOTH_MAX_OFFSET_M = 0.295;
export const TARGET_LAP_LENGTH_M = 687.5;
export const LAP_LENGTH_TOLERANCE = 0.01;
export const SECTOR_TARGETS_M: readonly number[] = [201.6, 350.3, 529.9];
export const MARKER_TARGET_SPACING_M = 18;
export const MIN_LINE_SPACING_M = 2;
export const LINE_MARCH_STEP_M = 0.05;
export const CUT_DISTANCE_M = 3;
export const NEAR_SECTIONS_M: readonly (readonly [number, number])[] = [[371, 414], [580, 615]];
export const BARRIER_GAP_MAX_M = 6;
export const EDGE_SAMPLE_M = 0.25;
export const CURB_WIDTH_M = 1.0;
export const CURB_MIN_WIDTH_M = 0.3;
export const CURB_MIN_GRASS_M = 0.4;
export const OTHER_PART_LAP_M = 30;
const ROUND_M = 0.001;
const BARRIER_SEQUENCE_GAP_M = 1;
const GAP_MARCH_STEP_M = 0.01;
const LINE_END_TARGET_M = CUT_DISTANCE_M - 0.01;
const LINE_MARCH_MAX_M = 60;
const ORIGIN_FORMAT = 'kartle-pista';
const ORIGIN_VERSION = 1;
const ORIGIN_SENSE = 'anti-horario';
const SIDE_OF: Record<string, CurbSide> = { esquerda: 'LEFT', direita: 'RIGHT' };

export type OriginPoint = { x: number; y: number; widthM: number };
export type OriginCurb = { side: CurbSide; fromM: number; toM: number };
export type OriginTrack = { points: OriginPoint[]; curbs: OriginCurb[] };
export type Schema3File = {
  schemaVersion: 3; trackId: string; trackVersion: number; osmDerived: true; direction: TrackDirection;
  startPosition: StartPosition; finishLine: Line; sectorLimits: Line[]; markers: Line[];
  centerline: TrackPoint[]; curbs: CurbSpan[]; barriers: BarrierLine[];
};
export type ReducedCurb = { curbIndex: number; widthM: number; grassClearanceM: number };
export type PrepRecord = {
  smoothingWindowM: number; maxSmoothingOffsetM: number; lapLengthM: number;
  originOffsetM: { xM: number; zM: number }; curbWidthsM: number[]; reducedCurbs: ReducedCurb[];
};
export type PrepareOptions = { trackId: string; trackVersion: number };
type XZ = { x: number; z: number };

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const finite = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
export const round3 = (v: number): number => { const r = Math.round(v / ROUND_M) * ROUND_M; return Object.is(r, -0) ? 0 : Number(r.toFixed(3)); };

// The origin as the product owner delivered it: formato kartle-pista 1, anti-horario, start at index 0; nothing else is read.
export function readOriginTrack(json: unknown): OriginTrack | { error: string } {
  if (!isRecord(json)) return { error: 'origin: not an object' };
  if (json.formato !== ORIGIN_FORMAT) return { error: 'origin: formato is not kartle-pista' };
  if (json.versao !== ORIGIN_VERSION) return { error: 'origin: versao is not 1' };
  if (json.sentido !== ORIGIN_SENSE) return { error: 'origin: sentido is not anti-horario' };
  if (!isRecord(json.largada) || json.largada.indice !== 0) return { error: 'origin: largada.indice is not 0' };
  if (!Array.isArray(json.pontos) || json.pontos.length < 3) return { error: 'origin: pontos must have 3 or more entries' };
  const points: OriginPoint[] = [];
  for (let i = 0; i < json.pontos.length; i++) {
    const p = json.pontos[i];
    if (!Array.isArray(p) || p.length !== 3 || !finite(p[0]) || !finite(p[1]) || !finite(p[2]) || p[2] <= 0) return { error: `origin: ponto ${i} out of form` };
    points.push({ x: p[0], y: p[1], widthM: p[2] });
  }
  if (!Array.isArray(json.zebras)) return { error: 'origin: zebras must be a list' };
  const curbs: OriginCurb[] = [];
  for (let i = 0; i < json.zebras.length; i++) {
    const z = json.zebras[i];
    if (!isRecord(z) || typeof z.lado !== 'string' || !(z.lado in SIDE_OF) || !finite(z.de_m) || !finite(z.ate_m) || !(z.de_m < z.ate_m)) return { error: `origin: zebra ${i} out of form` };
    curbs.push({ side: SIDE_OF[z.lado], fromM: z.de_m, toM: z.ate_m });
  }
  return { points, curbs };
}

const polylineLength = (pts: readonly XZ[]) => {
  let l = 0;
  for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; l += Math.hypot(b.x - a.x, b.z - a.z); }
  return l;
};
const cumulativeOf = (pts: readonly XZ[]) => {
  const c: number[] = []; let l = 0;
  for (let i = 0; i < pts.length; i++) { c.push(l); const a = pts[i], b = pts[(i + 1) % pts.length]; l += Math.hypot(b.x - a.x, b.z - a.z); }
  return { cumulative: c, length: l };
};

// Step 2: one weighted average over the origin points within a 12 m lap-distance window (raised-cosine weights),
// then the 0.295 m clamp around the corresponding origin point; the length is re-measured on the rounded line.
function smooth(origin: readonly XZ[]): { points: XZ[]; maxOffsetM: number; lapLengthM: number } {
  const n = origin.length;
  const { cumulative, length } = cumulativeOf(origin);
  const half = SMOOTH_WINDOW_M / 2;
  const points: XZ[] = [];
  for (let i = 0; i < n; i++) {
    let sx = 0, sz = 0, sw = 0;
    for (let j = 0; j < n; j++) {
      const gap = Math.abs(cumulative[j] - cumulative[i]), delta = Math.min(gap, length - gap);
      if (delta > half) continue;
      const w = 0.5 * (1 + Math.cos(Math.PI * delta / half));
      sx += w * origin[j].x; sz += w * origin[j].z; sw += w;
    }
    let x = sx / sw, z = sz / sw;
    const dx = x - origin[i].x, dz = z - origin[i].z, r = Math.hypot(dx, dz);
    if (r > SMOOTH_MAX_OFFSET_M) { x = origin[i].x + dx / r * SMOOTH_MAX_OFFSET_M; z = origin[i].z + dz / r * SMOOTH_MAX_OFFSET_M; }
    points.push({ x: round3(x), z: round3(z) });
  }
  const maxOffsetM = Math.max(...points.map((p, i) => Math.hypot(p.x - origin[i].x, p.z - origin[i].z)));
  return { points, maxOffsetM, lapLengthM: polylineLength(points) };
}

// Fractional index of a lap distance on a closed polyline with the given cumulative distances.
function fractionalIndex(cumulative: readonly number[], length: number, m: number): { index: number; fraction: number } {
  const n = cumulative.length;
  const v = Math.max(0, Math.min(length, m));
  let index = 0;
  for (let i = 0; i < n; i++) if (cumulative[i] <= v) index = i; else break;
  const end = index + 1 < n ? cumulative[index + 1] : length;
  const seg = end - cumulative[index];
  return { index, fraction: seg > 0 ? Math.min(1, (v - cumulative[index]) / seg) : 0 };
}

const lapDeltaM = (a: number, b: number, L: number) => { const d = Math.abs(a - b) % L; return Math.min(d, L - d); };

// Transversal line at centerline point i (RULE-0002): from the track edge on each side, 0.05 m steps along the normal
// until the point lies CUT_DISTANCE_M beyond the track edge (the measure the cut uses), stopping at the last grass point
// before another part of the track or at a barrier crossing. from = left end, to = right end.
function transversalLine(g: TrackGeometry, i: number): Line {
  const n = g.normals[i];
  const lapM = g.cumulativeM[i];
  const endOn = (sign: 1 | -1): XZ => {
    const edge = sign === 1 ? g.leftEdge[i] : g.rightEdge[i];
    const side: CurbSide = sign === 1 ? 'LEFT' : 'RIGHT';
    const curb = g.curbs.find(c => c.side === side && c.fromLapM <= lapM && lapM <= c.toLapM);
    const start: XZ = curb ? { x: edge.x + sign * n.x * curb.widthM, z: edge.z + sign * n.z * curb.widthM } : edge;
    // On a bend, or where another part of the track lies ahead, the distance beyond the edge grows slower than the offset
    // along the normal; the march ends only at CUT_DISTANCE_M beyond the edge, at a barrier or at another part of the track.
    const maxSteps = Math.round(LINE_MARCH_MAX_M / LINE_MARCH_STEP_M);
    let previous = start;
    for (let s = 1; s <= maxSteps; s++) {
      const point: XZ = { x: start.x + sign * n.x * s * LINE_MARCH_STEP_M, z: start.z + sign * n.z * s * LINE_MARCH_STEP_M };
      if (classifySurface(g, point) !== 'grass') return previous;
      for (const seg of g.barrierSegments) {
        const hit = segmentCrossing(previous, point, seg.a, seg.b);
        if (hit) return hit;
      }
      if (beyondTrackEdgeM(g, point) >= CUT_DISTANCE_M) return refineEnd(g, previous, point);
      previous = point;
    }
    return previous;
  };
  const left = endOn(1), right = endOn(-1);
  return { fromXM: round3(left.x), fromZM: round3(left.z), toXM: round3(right.x), toZM: round3(right.z) };
}

// Between the last point under CUT_DISTANCE_M and the first at or over it, the point LINE_END_TARGET_M beyond the edge
// (bisection): the recorded end then stays within the tolerance of V11 after rounding to 0.001 m.
function refineEnd(g: TrackGeometry, inside: XZ, outside: XZ): XZ {
  let lo = inside, hi = outside;
  for (let k = 0; k < 20; k++) {
    const mid = { x: (lo.x + hi.x) / 2, z: (lo.z + hi.z) / 2 };
    if (beyondTrackEdgeM(g, mid) >= LINE_END_TARGET_M) hi = mid; else lo = mid;
  }
  return lo;
}
const orient = (a: XZ, b: XZ, c: XZ) => (b.x - a.x) * (c.z - a.z) - (b.z - a.z) * (c.x - a.x);
// Crossing point of segments pq and ab (touching counts), or undefined.
export function segmentCrossing(p: XZ, q: XZ, a: XZ, b: XZ): XZ | undefined {
  const d1 = orient(a, b, p), d2 = orient(a, b, q), d3 = orient(p, q, a), d4 = orient(p, q, b);
  if (d1 * d2 > 0 || d3 * d4 > 0) return undefined;
  if (d1 === d2) return closestOnSegment(a, b, p).distanceM === 0 ? p : undefined;
  const t = d1 / (d1 - d2);
  return { x: p.x + (q.x - p.x) * t, z: p.z + (q.z - p.z) * t };
}

export function prepareTrack(origin: OriginTrack, options: PrepareOptions): { file: Schema3File; prep: PrepRecord } | { error: string } {
  const n = origin.points.length;
  // 1. Conversion to the game axes: x east, z = -north, centred on the bounding box of the origin points.
  const xs = origin.points.map(p => p.x), ys = origin.points.map(p => p.y);
  const cx = round3((Math.min(...xs) + Math.max(...xs)) / 2), cy = round3((Math.min(...ys) + Math.max(...ys)) / 2);
  const originXZ: XZ[] = origin.points.map(p => ({ x: p.x - cx, z: -(p.y - cy) }));
  const originCumulative = cumulativeOf(originXZ);
  if (windingSumOf(originXZ.map(p => ({ xM: p.x, zM: p.z }))) >= 0) return { error: 'origin winds clockwise in the game plane; COUNTER_CLOCKWISE required' };
  // 2. Smoothing; the re-measured length must stay within 687.5 m +/- 1 % or nothing is written. 3. Widths copied.
  const smoothed = smooth(originXZ);
  const lengthTolM = TARGET_LAP_LENGTH_M * LAP_LENGTH_TOLERANCE;
  if (Math.abs(smoothed.lapLengthM - TARGET_LAP_LENGTH_M) > lengthTolM) {
    return { error: `smoothed lap length ${round3(smoothed.lapLengthM)} m outside ${TARGET_LAP_LENGTH_M - lengthTolM}-${TARGET_LAP_LENGTH_M + lengthTolM} m` };
  }
  const centerline: TrackPoint[] = smoothed.points.map((p, i) => ({ xM: p.x, zM: p.z, widthM: round3(origin.points[i].widthM) }));
  const base = buildTrackGeometry(centerline, [], []);
  const L = base.lapLengthM;
  // 4. Curbs by fractional index, the one crossing the start split in two; widths reduced by the grass clearance.
  const toLap = (m: number) => { const f = fractionalIndex(originCumulative.cumulative, originCumulative.length, m); return lapMAtIndex(base, f.index, f.fraction); };
  const spans: { side: CurbSide; fromLapM: number; toLapM: number }[] = [];
  for (const c of origin.curbs) {
    if (c.toM > originCumulative.length) {
      spans.push({ side: c.side, fromLapM: toLap(c.fromM), toLapM: L });
      spans.push({ side: c.side, fromLapM: 0, toLapM: toLap(c.toM - originCumulative.length) });
    } else spans.push({ side: c.side, fromLapM: toLap(c.fromM), toLapM: toLap(c.toM) });
  }
  const nominal = buildTrackGeometry(centerline, spans.map(s => ({ ...s, widthM: CURB_WIDTH_M })), []);
  const quadLapM = (g: TrackGeometry) => ({
    asphalt: g.asphaltQuads.map((_, i) => g.cumulativeM[i]),
    curb: g.curbQuads.map(q => { const near = nearestOnCenterline(g, q[0]); return lapMAtIndex(g, near.index, near.fraction); }),
  });
  const nominalLap = quadLapM(nominal);
  const reduced: ReducedCurb[] = [];
  const curbs: CurbSpan[] = spans.map((span, index) => {
    let clearance = Infinity;
    const samples = Math.max(2, Math.ceil((span.toLapM - span.fromLapM) / EDGE_SAMPLE_M) + 1);
    for (let s = 0; s < samples; s++) {
      const lapM = span.fromLapM + (span.toLapM - span.fromLapM) * s / (samples - 1);
      const at = positionAtLapM(nominal, lapM);
      const edge = span.side === 'LEFT' ? at.leftEdge : at.rightEdge;
      nominal.asphaltQuads.forEach((q, qi) => { if (lapDeltaM(nominalLap.asphalt[qi], lapM, L) > OTHER_PART_LAP_M) clearance = Math.min(clearance, quadDistance(q, edge)); });
      nominal.curbQuads.forEach((q, qi) => {
        if (nominal.curbQuadSpan[qi] !== index && lapDeltaM(nominalLap.curb[qi], lapM, L) > OTHER_PART_LAP_M) clearance = Math.min(clearance, quadDistance(q, edge));
      });
    }
    const widthM = round3(Math.min(CURB_WIDTH_M, clearance - CURB_MIN_GRASS_M));
    if (widthM < CURB_WIDTH_M) reduced.push({ curbIndex: index, widthM, grassClearanceM: round3(clearance) });
    return { side: span.side, fromLapM: round3(span.fromLapM), toLapM: round3(Math.min(span.toLapM, L)), widthM };
  });
  const tooNarrow = curbs.findIndex(c => c.widthM < CURB_MIN_WIDTH_M);
  if (tooNarrow >= 0) return { error: `curb ${tooNarrow}: width ${curbs[tooNarrow].widthM} m below ${CURB_MIN_WIDTH_M} m` };
  const withCurbs = buildTrackGeometry(centerline, curbs, []);
  // 5. Barriers between the near sections.
  const barriers = buildBarriers(withCurbs, originCumulative.cumulative);
  if ('error' in barriers) return barriers;
  const g = buildTrackGeometry(centerline, curbs, barriers.lines);
  // 6. Finish line and start. 7. Sector limits. 8. Markers.
  const p0 = g.centerline[0], p1 = g.centerline[1];
  const startPosition: StartPosition = { xM: round3((p0.xM + p1.xM) / 2), zM: round3((p0.zM + p1.zM) / 2), headingDeg: round3(Math.atan2(p1.xM - p0.xM, p1.zM - p0.zM) * 180 / Math.PI) };
  const limitIndices = SECTOR_TARGETS_M.map(target => {
    let best = 0;
    for (let i = 1; i < n; i++) if (Math.abs(originCumulative.cumulative[i] - target) < Math.abs(originCumulative.cumulative[best] - target)) best = i;
    return best;
  });
  const markerCount = Math.ceil(L / MARKER_TARGET_SPACING_M), spacing = L / markerCount;
  const reserved = [0, ...limitIndices];
  const clearOf = (i: number) => reserved.every(r => lapDeltaM(g.cumulativeM[i], g.cumulativeM[r], L) >= MIN_LINE_SPACING_M);
  const markerIndices: number[] = [];
  for (let k = 0; k < markerCount; k++) {
    const target = spacing / 2 + k * spacing;
    let best = 0;
    for (let i = 1; i < n; i++) if (Math.abs(g.cumulativeM[i] - target) < Math.abs(g.cumulativeM[best] - target)) best = i;
    if (!clearOf(best)) {
      let candidate: number | undefined;
      for (let d = 1; d < n && candidate === undefined; d++) {
        const after = (best + d) % n, before = (best - d + n) % n;
        const distAfter = lapDeltaM(g.cumulativeM[after], g.cumulativeM[best], L), distBefore = lapDeltaM(g.cumulativeM[before], g.cumulativeM[best], L);
        if (distBefore < distAfter && clearOf(before)) candidate = before;
        else if (clearOf(after)) candidate = after;
        else if (clearOf(before)) candidate = before;
      }
      best = candidate ?? best;
    }
    markerIndices.push(best);
  }
  const file: Schema3File = {
    schemaVersion: 3, trackId: options.trackId, trackVersion: options.trackVersion, osmDerived: true, direction: 'COUNTER_CLOCKWISE',
    startPosition, finishLine: transversalLine(g, 0),
    sectorLimits: limitIndices.map(i => transversalLine(g, i)), markers: markerIndices.map(i => transversalLine(g, i)),
    centerline, curbs, barriers: barriers.lines,
  };
  const prep: PrepRecord = {
    smoothingWindowM: SMOOTH_WINDOW_M, maxSmoothingOffsetM: round3(smoothed.maxOffsetM), lapLengthM: round3(L),
    originOffsetM: { xM: cx, zM: cy }, curbWidthsM: curbs.map(c => c.widthM), reducedCurbs: reduced,
  };
  return { file, prep };
}

function quadDistance(q: readonly XZ[], p: XZ): number {
  let best = Infinity;
  for (let i = 0, j = 3; i < 4; j = i++) best = Math.min(best, closestOnSegment(q[i], q[j], p).distanceM);
  return best;
}

// Step 5: edge samples of each near section facing the other; the barrier vertex is the middle of the grass part of
// the shortest segment to the other section's asphalt edge, for segments of BARRIER_GAP_MAX_M or less.
function buildBarriers(g: TrackGeometry, originCumulative: readonly number[]): { lines: BarrierLine[] } | { error: string } {
  const n = g.centerline.length;
  const indicesIn = (section: readonly [number, number]) => { const out: number[] = []; for (let i = 0; i < n; i++) if (originCumulative[i] >= section[0] && originCumulative[i] <= section[1]) out.push(i); return out; };
  const edgePolylines = (indices: number[]) => [indices.map(i => g.leftEdge[i]), indices.map(i => g.rightEdge[i])];
  // Pairs of samples at the same parameter on the left and the right edge, every EDGE_SAMPLE_M of the longer edge.
  const samplePairs = (indices: number[]) => {
    const [left, right] = edgePolylines(indices);
    const out: [XZ, XZ][] = [];
    for (let i = 0; i + 1 < left.length; i++) {
      const lenL = Math.hypot(left[i + 1].x - left[i].x, left[i + 1].z - left[i].z), lenR = Math.hypot(right[i + 1].x - right[i].x, right[i + 1].z - right[i].z);
      const count = Math.max(1, Math.ceil(Math.max(lenL, lenR) / EDGE_SAMPLE_M));
      for (let s = 0; s < count; s++) {
        const t = s / count;
        out.push([{ x: left[i].x + (left[i + 1].x - left[i].x) * t, z: left[i].z + (left[i + 1].z - left[i].z) * t }, { x: right[i].x + (right[i + 1].x - right[i].x) * t, z: right[i].z + (right[i + 1].z - right[i].z) * t }]);
      }
    }
    if (left.length) out.push([left[left.length - 1], right[right.length - 1]]);
    return out;
  };
  const nearestOnPolylines = (polylines: readonly (readonly XZ[])[], p: XZ) => {
    let best: { point: XZ; distanceM: number } | undefined;
    for (const line of polylines) for (let i = 0; i + 1 < line.length; i++) {
      const c = closestOnSegment(line[i], line[i + 1], p);
      if (!best || c.distanceM < best.distanceM) best = { point: c.point, distanceM: c.distanceM };
    }
    return best;
  };
  const first = indicesIn(NEAR_SECTIONS_M[0]), second = indicesIn(NEAR_SECTIONS_M[1]);
  if (first.length < 2 || second.length < 2) return { lines: [] };
  const vertices: { point: XZ; orderM: number }[] = [];
  const sweep = (from: number[], to: number[]) => {
    const target = edgePolylines(to);
    for (const [pLeft, pRight] of samplePairs(from)) {
      const qLeft = nearestOnPolylines(target, pLeft), qRight = nearestOnPolylines(target, pRight);
      if (!qLeft || !qRight) continue;
      // The facing edge is the one nearer the other part: the segment from the other edge would cross this part's asphalt.
      const [p, q] = qLeft.distanceM <= qRight.distanceM ? [pLeft, qLeft] : [pRight, qRight];
      if (q.distanceM > BARRIER_GAP_MAX_M || q.distanceM === 0) continue;
      const dir = { x: (q.point.x - p.x) / q.distanceM, z: (q.point.z - p.z) / q.distanceM };
      let exit: XZ | undefined, entry: XZ | undefined;
      const steps = Math.ceil(q.distanceM / GAP_MARCH_STEP_M);
      for (let s = 0; s <= steps; s++) {
        const point = { x: p.x + dir.x * Math.min(q.distanceM, s * GAP_MARCH_STEP_M), z: p.z + dir.z * Math.min(q.distanceM, s * GAP_MARCH_STEP_M) };
        const grass = classifySurface(g, point) === 'grass';
        if (grass && !exit) exit = point;
        if (grass) entry = point;
        else if (exit) break;
      }
      if (!exit || !entry) return { error: `barrier: no grass between the sections at (${round3(p.x)}, ${round3(p.z)})` };
      const grassM = Math.hypot(entry.x - exit.x, entry.z - exit.z);
      if (grassM < 2 * BARRIER_HALF_WIDTH_M) return { error: `barrier: grass gap ${round3(grassM)} m below ${2 * BARRIER_HALF_WIDTH_M} m at (${round3(p.x)}, ${round3(p.z)})` };
      const vertex = { x: (exit.x + entry.x) / 2, z: (exit.z + entry.z) / 2 };
      vertices.push({ point: vertex, orderM: orderOnFirst(vertex) });
    }
    return undefined;
  };
  // Lap distance of the nearest centerline point within the first section, used to order the vertices.
  const orderOnFirst = (p: XZ) => {
    let best = { distance: Infinity, lapM: 0 };
    for (const i of first) {
      const a = g.centerline[i], b = g.centerline[(i + 1) % n];
      const c = closestOnSegment({ x: a.xM, z: a.zM }, { x: b.xM, z: b.zM }, p);
      if (c.distanceM < best.distance) best = { distance: c.distanceM, lapM: lapMAtIndex(g, i, c.t) };
    }
    return best.lapM;
  };
  const failure = sweep(first, second) ?? sweep(second, first);
  if (failure) return failure;
  vertices.sort((a, b) => a.orderM - b.orderM || a.point.x - b.point.x || a.point.z - b.point.z);
  const lines: BarrierLine[] = [];
  let current: XZ[] = [];
  let lastOrder: number | undefined;
  for (const v of vertices) {
    if (lastOrder !== undefined && v.orderM - lastOrder > BARRIER_SEQUENCE_GAP_M) { if (current.length >= 2) lines.push(toBarrierLine(current)); current = []; }
    current.push(v.point);
    lastOrder = v.orderM;
  }
  if (current.length >= 2) lines.push(toBarrierLine(current));
  return { lines };
}

// Rounded vertices, consecutive duplicates (after rounding) removed.
function toBarrierLine(points: readonly XZ[]): BarrierLine {
  const out: { xM: number; zM: number }[] = [];
  for (const p of points) {
    const r = { xM: round3(p.x), zM: round3(p.z) };
    const last = out[out.length - 1];
    if (!last || last.xM !== r.xM || last.zM !== r.zM) out.push(r);
  }
  return { points: out };
}

// DM-0001 serialization: compact JSON on one line, newline-terminated, keys in the declared order, values already rounded.
export function serializeTrackFile(file: Schema3File): string {
  const line = (l: Line) => ({ fromXM: round3(l.fromXM), fromZM: round3(l.fromZM), toXM: round3(l.toXM), toZM: round3(l.toZM) });
  const ordered = {
    schemaVersion: file.schemaVersion, trackId: file.trackId, trackVersion: file.trackVersion, osmDerived: file.osmDerived, direction: file.direction,
    startPosition: { xM: round3(file.startPosition.xM), zM: round3(file.startPosition.zM), headingDeg: round3(file.startPosition.headingDeg) },
    finishLine: line(file.finishLine), sectorLimits: file.sectorLimits.map(line), markers: file.markers.map(line),
    centerline: file.centerline.map(p => ({ xM: round3(p.xM), zM: round3(p.zM), widthM: round3(p.widthM) })),
    curbs: file.curbs.map(c => ({ side: c.side, fromLapM: round3(c.fromLapM), toLapM: round3(c.toLapM), widthM: round3(c.widthM) })),
    barriers: file.barriers.map(b => ({ points: b.points.map(p => ({ xM: round3(p.xM), zM: round3(p.zM) })) })),
  };
  return JSON.stringify(ordered) + '\n';
}
