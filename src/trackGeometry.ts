// Track-data layer: the geometry declared by a schema-3 track file (DES-0002, RULE-0001, RULE-0002).
// Pure: no DOM, no clock, no random; imports only src/track.ts. Used as declared: nothing is smoothed,
// resampled or converted here; the derived shapes (edges, quads, grid) are built from the file and never stored.
import { crossLine, type Line, type Point } from './track';

export type TrackPoint = { xM: number; zM: number; widthM: number };
export type CurbSide = 'LEFT' | 'RIGHT';
export type CurbSpan = { side: CurbSide; fromLapM: number; toLapM: number; widthM: number };
export type BarrierLine = { points: { xM: number; zM: number }[] };
export type TrackSurface = 'asphalt' | 'curb' | 'grass';
export type Quad = readonly [Point, Point, Point, Point];
export type Segment = { a: Point; b: Point };
export type Bounds = { minX: number; maxX: number; minZ: number; maxZ: number };

export const GRID_CELL_M = 8;
// Contact surface of a barrier: 0.1 m to each side of its line (ADR-0003); 0.2 m thick, also in the drawing.
export const BARRIER_HALF_WIDTH_M = 0.1;
export const BARRIER_TOUCH_TOLERANCE_M = 0.01;
const ON_EDGE_EPSILON_M = 1e-9;

export type TrackGrid = {
  readonly originX: number; readonly originZ: number;
  readonly columns: number; readonly rows: number;
  // Per cell: indices of the quads whose bounding box touches it, asphalt and curb kept apart.
  readonly asphaltCells: readonly (readonly number[])[];
  readonly curbCells: readonly (readonly number[])[];
};

export type TrackGeometry = {
  readonly centerline: readonly TrackPoint[];
  readonly curbs: readonly CurbSpan[];
  readonly barriers: readonly BarrierLine[];
  readonly lapLengthM: number;
  readonly cumulativeM: readonly number[];
  readonly normals: readonly Point[];
  readonly leftEdge: readonly Point[];
  readonly rightEdge: readonly Point[];
  readonly asphaltQuads: readonly Quad[];
  // Curb quads along the lap, in span order; curbQuadSpan[k] is the index in `curbs` of the span quad k belongs to.
  readonly curbQuads: readonly Quad[];
  readonly curbQuadSpan: readonly number[];
  readonly barrierSegments: readonly Segment[];
  readonly bounds: Bounds;
  readonly grid: TrackGrid;
};

export type CenterlineNearest = { index: number; fraction: number; position: Point; distanceM: number; headingRad: number };
export type LapPosition = { index: number; fraction: number; center: Point; normal: Point; leftEdge: Point; rightEdge: Point };
export type BarrierNearest = { distanceM: number; point: Point; segment: number };

const pointOf = (p: TrackPoint | { xM: number; zM: number }): Point => ({ x: p.xM, z: p.zM });
const sub = (a: Point, b: Point): Point => ({ x: a.x - b.x, z: a.z - b.z });
const lerp = (a: Point, b: Point, f: number): Point => ({ x: a.x + (b.x - a.x) * f, z: a.z + (b.z - a.z) * f });
const length = (p: Point) => Math.hypot(p.x, p.z);

// Closest point of segment ab to p, with the parameter along ab clamped to [0, 1].
export function closestOnSegment(a: Point, b: Point, p: Point): { point: Point; t: number; distanceM: number } {
  const dx = b.x - a.x, dz = b.z - a.z;
  const l2 = dx * dx + dz * dz;
  const t = l2 > 0 ? Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.z - a.z) * dz) / l2)) : 0;
  const point = { x: a.x + t * dx, z: a.z + t * dz };
  return { point, t, distanceM: Math.hypot(p.x - point.x, p.z - point.z) };
}

// Left normal of a direction (the "left" of src/physics.ts: world left = (cos h, -sin h) for forward (sin h, cos h)).
function leftNormalOf(d: Point): Point | undefined {
  const l = length(d);
  if (l === 0) return undefined;
  return { x: d.z / l, z: -d.x / l };
}

function normalsOf(points: readonly Point[]): Point[] {
  const n = points.length;
  const normals: Point[] = [];
  for (let i = 0; i < n; i++) {
    const prev = points[(i + n - 1) % n], next = points[(i + 1) % n];
    // Neighbour difference; a zero difference (prev equals next) falls back to the segment, then to the previous normal.
    const normal = leftNormalOf(sub(next, prev)) ?? leftNormalOf(sub(next, points[i])) ?? normals[i - 1] ?? { x: 0, z: 1 };
    normals.push(normal);
  }
  return normals;
}

// Point inside a convex-or-not quadrilateral by the crossing-number test; a point on the boundary counts as inside.
export function pointInQuad(q: Quad, p: Point): boolean {
  let inside = false;
  for (let i = 0, j = 3; i < 4; j = i++) {
    const a = q[i], b = q[j];
    if (closestOnSegment(a, b, p).distanceM <= ON_EDGE_EPSILON_M) return true;
    if ((a.z > p.z) !== (b.z > p.z)) {
      const x = a.x + (p.z - a.z) * (b.x - a.x) / (b.z - a.z);
      if (p.x < x) inside = !inside;
    }
  }
  return inside;
}

function distanceToQuad(q: Quad, p: Point): number {
  let best = Infinity;
  for (let i = 0, j = 3; i < 4; j = i++) best = Math.min(best, closestOnSegment(q[i], q[j], p).distanceM);
  return best;
}

function quadBounds(q: Quad): Bounds {
  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
  for (const v of q) { minX = Math.min(minX, v.x); maxX = Math.max(maxX, v.x); minZ = Math.min(minZ, v.z); maxZ = Math.max(maxZ, v.z); }
  return { minX, maxX, minZ, maxZ };
}

function findSegment(cumulativeM: readonly number[], lapLengthM: number, lapM: number): { index: number; fraction: number } {
  const n = cumulativeM.length;
  const m = Math.max(0, Math.min(lapLengthM, lapM));
  let index = 0;
  let lo = 0, hi = n - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (cumulativeM[mid] <= m) { index = mid; lo = mid + 1; } else hi = mid - 1;
  }
  const end = index + 1 < n ? cumulativeM[index + 1] : lapLengthM;
  const segment = end - cumulativeM[index];
  const fraction = segment > 0 ? Math.min(1, (m - cumulativeM[index]) / segment) : 0;
  return { index, fraction };
}

function positionAt(g: Pick<TrackGeometry, 'centerline' | 'cumulativeM' | 'lapLengthM' | 'normals' | 'leftEdge' | 'rightEdge'>, lapM: number): LapPosition {
  const { index, fraction } = findSegment(g.cumulativeM, g.lapLengthM, lapM);
  const n = g.centerline.length, next = (index + 1) % n;
  return {
    index, fraction,
    center: lerp(pointOf(g.centerline[index]), pointOf(g.centerline[next]), fraction),
    normal: lerp(g.normals[index], g.normals[next], fraction),
    leftEdge: lerp(g.leftEdge[index], g.leftEdge[next], fraction),
    rightEdge: lerp(g.rightEdge[index], g.rightEdge[next], fraction),
  };
}

// Builds the derived shapes of RULE-0001/RULE-0002 from inputs the reader already validated; never throws for them.
export function buildTrackGeometry(centerline: TrackPoint[], curbs: CurbSpan[], barriers: BarrierLine[]): TrackGeometry {
  const points = centerline.map(p => Object.freeze({ xM: p.xM, zM: p.zM, widthM: p.widthM }));
  const n = points.length;
  const xz = points.map(pointOf);
  const normals = normalsOf(xz);
  const cumulativeM: number[] = [];
  let lapLengthM = 0;
  for (let i = 0; i < n; i++) {
    cumulativeM.push(lapLengthM);
    lapLengthM += length(sub(xz[(i + 1) % n], xz[i]));
  }
  const leftEdge = xz.map((p, i) => ({ x: p.x + normals[i].x * points[i].widthM / 2, z: p.z + normals[i].z * points[i].widthM / 2 }));
  const rightEdge = xz.map((p, i) => ({ x: p.x - normals[i].x * points[i].widthM / 2, z: p.z - normals[i].z * points[i].widthM / 2 }));
  const asphaltQuads: Quad[] = [];
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    asphaltQuads.push([leftEdge[i], leftEdge[j], rightEdge[j], rightEdge[i]]);
  }
  const partial = { centerline: points, cumulativeM, lapLengthM, normals, leftEdge, rightEdge };
  const curbSpans = curbs.map(c => Object.freeze({ side: c.side, fromLapM: c.fromLapM, toLapM: c.toLapM, widthM: c.widthM }));
  const curbQuads: Quad[] = [], curbQuadSpan: number[] = [];
  curbSpans.forEach((span, spanIndex) => {
    const to = Math.min(span.toLapM, lapLengthM);
    const breaks: number[] = [span.fromLapM];
    for (let i = 0; i < n; i++) if (cumulativeM[i] > span.fromLapM && cumulativeM[i] < to) breaks.push(cumulativeM[i]);
    breaks.push(to);
    const sign = span.side === 'LEFT' ? 1 : -1;
    const rail = breaks.map(lapM => {
      const at = positionAt(partial, lapM);
      const edge = span.side === 'LEFT' ? at.leftEdge : at.rightEdge;
      const outer = { x: edge.x + sign * at.normal.x * span.widthM, z: edge.z + sign * at.normal.z * span.widthM };
      return { edge, outer };
    });
    for (let k = 0; k + 1 < rail.length; k++) { curbQuads.push([rail[k].edge, rail[k + 1].edge, rail[k + 1].outer, rail[k].outer]); curbQuadSpan.push(spanIndex); }
  });
  const barrierLines = barriers.map(b => Object.freeze({ points: b.points.map(p => Object.freeze({ xM: p.xM, zM: p.zM })) }));
  const barrierSegments: Segment[] = [];
  for (const b of barrierLines) for (let i = 0; i + 1 < b.points.length; i++) barrierSegments.push({ a: pointOf(b.points[i]), b: pointOf(b.points[i + 1]) });

  let bounds: Bounds = { minX: Infinity, maxX: -Infinity, minZ: Infinity, maxZ: -Infinity };
  const widen = (b: Bounds) => { bounds = { minX: Math.min(bounds.minX, b.minX), maxX: Math.max(bounds.maxX, b.maxX), minZ: Math.min(bounds.minZ, b.minZ), maxZ: Math.max(bounds.maxZ, b.maxZ) }; };
  for (const q of asphaltQuads) widen(quadBounds(q));
  for (const q of curbQuads) widen(quadBounds(q));
  for (const s of barrierSegments) widen({ minX: Math.min(s.a.x, s.b.x), maxX: Math.max(s.a.x, s.b.x), minZ: Math.min(s.a.z, s.b.z), maxZ: Math.max(s.a.z, s.b.z) });

  const columns = Math.max(1, Math.ceil((bounds.maxX - bounds.minX) / GRID_CELL_M)), rows = Math.max(1, Math.ceil((bounds.maxZ - bounds.minZ) / GRID_CELL_M));
  const asphaltCells: number[][] = Array.from({ length: columns * rows }, () => []);
  const curbCells: number[][] = Array.from({ length: columns * rows }, () => []);
  const register = (cells: number[][], index: number, b: Bounds) => {
    const c0 = Math.max(0, Math.floor((b.minX - bounds.minX) / GRID_CELL_M)), c1 = Math.min(columns - 1, Math.floor((b.maxX - bounds.minX) / GRID_CELL_M));
    const r0 = Math.max(0, Math.floor((b.minZ - bounds.minZ) / GRID_CELL_M)), r1 = Math.min(rows - 1, Math.floor((b.maxZ - bounds.minZ) / GRID_CELL_M));
    for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) cells[r * columns + c].push(index);
  };
  asphaltQuads.forEach((q, i) => register(asphaltCells, i, quadBounds(q)));
  curbQuads.forEach((q, i) => register(curbCells, i, quadBounds(q)));
  const grid: TrackGrid = Object.freeze({
    originX: bounds.minX, originZ: bounds.minZ, columns, rows,
    asphaltCells: Object.freeze(asphaltCells.map(c => Object.freeze(c))),
    curbCells: Object.freeze(curbCells.map(c => Object.freeze(c))),
  });
  const geometry: TrackGeometry = {
    centerline: Object.freeze(points), curbs: Object.freeze(curbSpans), barriers: Object.freeze(barrierLines),
    lapLengthM, cumulativeM: Object.freeze(cumulativeM), normals: Object.freeze(normals.map(p => Object.freeze(p))),
    leftEdge: Object.freeze(leftEdge.map(p => Object.freeze(p))), rightEdge: Object.freeze(rightEdge.map(p => Object.freeze(p))),
    asphaltQuads: Object.freeze(asphaltQuads.map(q => Object.freeze(q))),
    curbQuads: Object.freeze(curbQuads.map(q => Object.freeze(q))), curbQuadSpan: Object.freeze(curbQuadSpan),
    barrierSegments: Object.freeze(barrierSegments.map(s => Object.freeze(s))),
    bounds: Object.freeze(bounds), grid,
  };
  return Object.freeze(geometry);
}

function cellOf(g: TrackGeometry, p: Point): number | undefined {
  const { bounds, grid } = g;
  if (p.x < bounds.minX || p.x > bounds.maxX || p.z < bounds.minZ || p.z > bounds.maxZ) return undefined;
  const c = Math.min(grid.columns - 1, Math.floor((p.x - grid.originX) / GRID_CELL_M));
  const r = Math.min(grid.rows - 1, Math.floor((p.z - grid.originZ) / GRID_CELL_M));
  return r * grid.columns + c;
}

// Precedence of RULE-0001: asphalt, then curb, then grass. The grid only prunes candidates.
export function classifySurface(g: TrackGeometry, p: Point): TrackSurface {
  const cell = cellOf(g, p);
  if (cell === undefined) return 'grass';
  for (const i of g.grid.asphaltCells[cell]) if (pointInQuad(g.asphaltQuads[i], p)) return 'asphalt';
  for (const i of g.grid.curbCells[cell]) if (pointInQuad(g.curbQuads[i], p)) return 'curb';
  return 'grass';
}

// 0 on the asphalt or a curb; otherwise the exact distance to the nearest asphalt or curb quad (the track edge).
export function beyondTrackEdgeM(g: TrackGeometry, p: Point): number {
  if (classifySurface(g, p) !== 'grass') return 0;
  let best = Infinity;
  for (const q of g.asphaltQuads) best = Math.min(best, distanceToQuad(q, p));
  for (const q of g.curbQuads) best = Math.min(best, distanceToQuad(q, p));
  return best;
}

export function nearestOnCenterline(g: TrackGeometry, p: Point): CenterlineNearest {
  const n = g.centerline.length;
  let best: CenterlineNearest = { index: 0, fraction: 0, position: pointOf(g.centerline[0]), distanceM: Infinity, headingRad: 0 };
  for (let i = 0; i < n; i++) {
    const a = pointOf(g.centerline[i]), b = pointOf(g.centerline[(i + 1) % n]);
    const c = closestOnSegment(a, b, p);
    if (c.distanceM < best.distanceM) best = { index: i, fraction: c.t, position: c.point, distanceM: c.distanceM, headingRad: Math.atan2(b.x - a.x, b.z - a.z) };
  }
  return best;
}

export function lapMAtIndex(g: TrackGeometry, index: number, fraction: number): number {
  const n = g.centerline.length;
  const i = ((index % n) + n) % n;
  const end = i + 1 < n ? g.cumulativeM[i + 1] : g.lapLengthM;
  return g.cumulativeM[i] + fraction * (end - g.cumulativeM[i]);
}

export function positionAtLapM(g: TrackGeometry, lapM: number): LapPosition {
  return positionAt(g, lapM);
}

export function nearestBarrier(g: TrackGeometry, p: Point): BarrierNearest | undefined {
  let best: BarrierNearest | undefined;
  g.barrierSegments.forEach((s, i) => {
    const c = closestOnSegment(s.a, s.b, p);
    if (!best || c.distanceM < best.distanceM) best = { distanceM: c.distanceM, point: c.point, segment: i };
  });
  return best;
}

// Crossings of the closed centerline with a line, in index order, with the lap distance of each (shared by the
// schema-3 consistency checks and the offline checks).
export function centerlineCrossings(g: TrackGeometry, line: Line): { lapM: number; point: Point; forward: boolean; index: number }[] {
  const n = g.centerline.length;
  const out: { lapM: number; point: Point; forward: boolean; index: number }[] = [];
  for (let i = 0; i < n; i++) {
    const a = pointOf(g.centerline[i]), b = pointOf(g.centerline[(i + 1) % n]);
    const c = crossLine(line, a, b);
    if (!c) continue;
    out.push({ lapM: lapMAtIndex(g, i, c.fraction), point: lerp(a, b, c.fraction), forward: c.sense === 'FORWARD', index: i });
  }
  return out;
}

// Signed sum of x_i * z_(i+1) - x_(i+1) * z_i over the closed centerline (C1 v3): > 0 CLOCKWISE, < 0 COUNTER_CLOCKWISE.
export function windingSumOf(centerline: readonly { xM: number; zM: number }[]): number {
  let s = 0;
  for (let i = 0; i < centerline.length; i++) {
    const a = centerline[i], b = centerline[(i + 1) % centerline.length];
    s += a.xM * b.zM - b.xM * a.zM;
  }
  return s;
}
