// Track-data layer: reads and classifies a versioned track file (DM-0001, DES-0006; schema 3: DES-0001 and DM-0001 of
// pista-kart-park). Pure: no DOM, no clock, no random; imports only src/track.ts and src/trackGeometry.ts.
import { crossLine, nearest, sideOf, track, WIDTH, type Line, type Point } from './track';
import {
  buildTrackGeometry, centerlineCrossings as geometryCrossings, classifySurface, nearestOnCenterline, windingSumOf,
  type BarrierLine, type CurbSpan, type TrackGeometry, type TrackPoint,
} from './trackGeometry';
export type { BarrierLine, CurbSpan, TrackPoint } from './trackGeometry';

// The highest schema version this reader knows (ADR-0001 of pista-kart-park): 1, 2 and 3 are read; above is unsupported.
export const TRACK_SCHEMA_VERSION = 3;
const SCHEMA_WITH_GEOMETRY = 3;
const MIN_CENTERLINE_POINTS = 3;
const MIN_BARRIER_POINTS = 2;
const CURB_END_TOLERANCE_M = 0.001;
export const DEFAULT_CUT_DISTANCE_M = 3;
export const DEFAULT_CUT_DURATION_MS = 1000;
export const BARRIER_REACH_M = WIDTH / 2 + 9;
const MIN_LINE_LENGTH_M = 1;
const MIN_LINE_SPACING_M = 2;

export type TrackDirection = 'CLOCKWISE' | 'COUNTER_CLOCKWISE';
export type StartPosition = { xM: number; zM: number; headingDeg: number };
export type TrackVersion = string | number;
export type TrackDataStatus = 'COMPLETE' | 'INCOMPLETE' | 'UNSUPPORTED_SCHEMA' | 'UNREADABLE';
export type DeclaredTrack = {
  direction?: TrackDirection;
  startPosition?: StartPosition;
  finishLine?: Line;
  sectorLimits?: Line[];
  markers?: Line[];
  cutDistanceM?: number;
  cutDurationMs?: number;
};
export type CompleteTrack = Required<Pick<DeclaredTrack, 'direction' | 'startPosition' | 'finishLine' | 'sectorLimits' | 'markers'>>
  & Pick<DeclaredTrack, 'cutDistanceM' | 'cutDurationMs'>;
// The four fields of a schema-3 reading (API-0001 of pista-kart-park): present together, only in a schema-3 reading.
export type Schema3Fields = { centerline: TrackPoint[]; curbs: CurbSpan[]; barriers: BarrierLine[]; osmDerived: boolean };
export type TrackReading =
  | ({ trackDataStatus: 'COMPLETE'; trackId: string; trackVersion: TrackVersion } & CompleteTrack & Partial<Schema3Fields>)
  | ({ trackDataStatus: 'INCOMPLETE'; trackId: string; trackVersion: TrackVersion } & DeclaredTrack & Partial<Schema3Fields>)
  | { trackDataStatus: 'UNSUPPORTED_SCHEMA'; schemaVersion: number }
  | { trackDataStatus: 'UNREADABLE' };
export type TrackDataSource = string | object | null | undefined;

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const isFinite = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const isPositiveInteger = (v: unknown): v is number => Number.isInteger(v) && (v as number) >= 1;

function readLine(v: unknown): Line | undefined {
  if (!isRecord(v)) return undefined;
  const { fromXM, fromZM, toXM, toZM } = v;
  if (!isFinite(fromXM) || !isFinite(fromZM) || !isFinite(toXM) || !isFinite(toZM)) return undefined;
  if (Math.hypot(toXM - fromXM, toZM - fromZM) < MIN_LINE_LENGTH_M) return undefined;
  return { fromXM, fromZM, toXM, toZM };
}
function readLines(v: unknown, exactly?: number): Line[] | undefined {
  if (!Array.isArray(v)) return undefined;
  if (exactly !== undefined ? v.length !== exactly : v.length < 1) return undefined;
  const lines = v.map(readLine);
  return lines.every((l): l is Line => l !== undefined) ? lines : undefined;
}
const sameLine = (a: Line, b: Line) => a.fromXM === b.fromXM && a.fromZM === b.fromZM && a.toXM === b.toXM && a.toZM === b.toZM;

function readDeclared(file: Record<string, unknown>): { declared: DeclaredTrack; wellFormed: boolean } {
  const declared: DeclaredTrack = {};
  let wellFormed = true;
  const miss = () => { wellFormed = false; };

  if (file.direction === 'CLOCKWISE' || file.direction === 'COUNTER_CLOCKWISE') declared.direction = file.direction;
  else miss();
  const start = file.startPosition;
  if (isRecord(start) && isFinite(start.xM) && isFinite(start.zM) && isFinite(start.headingDeg)) {
    declared.startPosition = { xM: start.xM, zM: start.zM, headingDeg: start.headingDeg };
  } else miss();
  const finish = readLine(file.finishLine);
  if (finish) declared.finishLine = finish; else miss();
  const limits = readLines(file.sectorLimits, 3);
  if (limits) declared.sectorLimits = limits; else miss();
  const markers = readLines(file.markers);
  if (markers && !(limits && markers.some(m => limits.some(l => sameLine(m, l))))) declared.markers = markers;
  else miss();
  if (file.cutDistanceM !== undefined) {
    if (isFinite(file.cutDistanceM) && file.cutDistanceM > 0) declared.cutDistanceM = file.cutDistanceM; else miss();
  }
  if (file.cutDurationMs !== undefined) {
    if (isPositiveInteger(file.cutDurationMs)) declared.cutDurationMs = file.cutDurationMs; else miss();
  }
  return { declared, wellFormed };
}

const centerlineLengthOf = (points: TrackPoint[]) => {
  let l = 0;
  for (let i = 0; i < points.length; i++) {
    const a = points[i], b = points[(i + 1) % points.length];
    l += Math.hypot(b.xM - a.xM, b.zM - a.zM);
  }
  return l;
};
// Orders 6 and 7 of DM-0001 (schema 3): the geometry fields, copied into new objects; undefined when out of form.
function readSchema3Fields(file: Record<string, unknown>): Schema3Fields | undefined {
  const rawCenterline = file.centerline;
  if (!Array.isArray(rawCenterline) || rawCenterline.length < MIN_CENTERLINE_POINTS) return undefined;
  const centerline: TrackPoint[] = [];
  for (const p of rawCenterline) {
    if (!isRecord(p) || !isFinite(p.xM) || !isFinite(p.zM) || !isFinite(p.widthM) || p.widthM <= 0) return undefined;
    centerline.push({ xM: p.xM, zM: p.zM, widthM: p.widthM });
  }
  const lapLengthM = centerlineLengthOf(centerline);
  const curbs: CurbSpan[] = [];
  if (file.curbs !== undefined) {
    if (!Array.isArray(file.curbs)) return undefined;
    for (const c of file.curbs) {
      if (!isRecord(c) || (c.side !== 'LEFT' && c.side !== 'RIGHT') || !isFinite(c.fromLapM) || !isFinite(c.toLapM) || !isFinite(c.widthM)) return undefined;
      if (!(c.fromLapM >= 0 && c.fromLapM < c.toLapM && c.toLapM <= lapLengthM + CURB_END_TOLERANCE_M) || c.widthM <= 0) return undefined;
      curbs.push({ side: c.side, fromLapM: c.fromLapM, toLapM: c.toLapM, widthM: c.widthM });
    }
  }
  const barriers: BarrierLine[] = [];
  if (file.barriers !== undefined) {
    if (!Array.isArray(file.barriers)) return undefined;
    for (const b of file.barriers) {
      if (!isRecord(b) || !Array.isArray(b.points) || b.points.length < MIN_BARRIER_POINTS) return undefined;
      const points: { xM: number; zM: number }[] = [];
      for (const p of b.points) {
        if (!isRecord(p) || !isFinite(p.xM) || !isFinite(p.zM)) return undefined;
        points.push({ xM: p.xM, zM: p.zM });
      }
      barriers.push({ points });
    }
  }
  if (file.osmDerived !== undefined && typeof file.osmDerived !== 'boolean') return undefined;
  return { centerline, curbs, barriers, osmDerived: file.osmDerived === true };
}

// Classification order 1 to 9 of DM-0001, followed literally. Never throws, never mutates `source`.
export function readTrackData(source: TrackDataSource): TrackReading {
  let file: unknown = source;
  if (typeof source === 'string') {
    try { file = JSON.parse(source); } catch { return { trackDataStatus: 'UNREADABLE' }; }
  }
  if (!isRecord(file)) return { trackDataStatus: 'UNREADABLE' };
  const schemaVersion = file.schemaVersion;
  if (!isPositiveInteger(schemaVersion)) return { trackDataStatus: 'UNREADABLE' };
  if (schemaVersion > TRACK_SCHEMA_VERSION) return { trackDataStatus: 'UNSUPPORTED_SCHEMA', schemaVersion };
  const trackId = file.trackId, trackVersion = file.trackVersion;
  if (typeof trackId !== 'string' || trackId.length === 0) return { trackDataStatus: 'UNREADABLE' };
  if (!((typeof trackVersion === 'string' && trackVersion.length > 0) || isPositiveInteger(trackVersion))) {
    return { trackDataStatus: 'UNREADABLE' };
  }
  if (schemaVersion === 1) return { trackDataStatus: 'INCOMPLETE', trackId, trackVersion };
  if (schemaVersion === SCHEMA_WITH_GEOMETRY) {
    const fields = readSchema3Fields(file);
    if (!fields) return { trackDataStatus: 'UNREADABLE' };
    const geometry = buildTrackGeometry(fields.centerline, fields.curbs, fields.barriers);
    const { declared, wellFormed } = readDeclared(file);
    if (!wellFormed || checkConsistencyV3(declared, geometry).length > 0) {
      return { trackDataStatus: 'INCOMPLETE', trackId, trackVersion, ...declared, ...fields };
    }
    return { trackDataStatus: 'COMPLETE', trackId, trackVersion, ...(declared as CompleteTrack), ...fields };
  }
  // Schema 2: the path of race-lap-validation, over the synthetic geometry, unchanged.
  const { declared, wellFormed } = readDeclared(file);
  if (!wellFormed || checkConsistency(declared).length > 0) {
    return { trackDataStatus: 'INCOMPLETE', trackId, trackVersion, ...declared };
  }
  return { trackDataStatus: 'COMPLETE', trackId, trackVersion, ...(declared as CompleteTrack) };
}

// Centerline geometry shared by the checks: closed polyline in travel order (index order).
const segmentLength = (i: number) => {
  const a = track[i], b = track[(i + 1) % track.length];
  return Math.hypot(b.x - a.x, b.z - a.z);
};
const cumulative: number[] = [];
let centerlineLength = 0;
for (let i = 0; i < track.length; i++) { cumulative.push(centerlineLength); centerlineLength += segmentLength(i); }

type Crossing = { arcM: number; point: Point; forward: boolean };
function centerlineCrossings(line: Line): Crossing[] {
  const crossings: Crossing[] = [];
  for (let i = 0; i < track.length; i++) {
    const a = track[i], b = track[(i + 1) % track.length];
    const c = crossLine(line, a, b);
    if (!c) continue;
    const point = { x: a.x + (b.x - a.x) * c.fraction, z: a.z + (b.z - a.z) * c.fraction };
    crossings.push({ arcM: cumulative[i] + segmentLength(i) * c.fraction, point, forward: c.sense === 'FORWARD' });
  }
  return crossings;
}
const arcOfPoint = (p: Point) => {
  const n = nearest(p);
  return cumulative[n.index] + Math.hypot(n.position.x - track[n.index].x, n.position.z - track[n.index].z);
};
const windingSum = () => {
  let s = 0;
  for (let i = 0; i < track.length; i++) {
    const a = track[i], b = track[(i + 1) % track.length];
    s += a.x * b.z - b.x * a.z;
  }
  return s;
};

// C1 to C7 of DM-0001. Returns the identifiers of the failed checks; a check whose inputs are absent fails.
export function checkConsistency(declared: DeclaredTrack): string[] {
  const failed: string[] = [];
  const { direction, startPosition, finishLine, sectorLimits, markers } = declared;

  // C1: direction equals the winding of the centerline in index order.
  const s = windingSum();
  const winding: TrackDirection | undefined = s > 0 ? 'CLOCKWISE' : s < 0 ? 'COUNTER_CLOCKWISE' : undefined;
  if (!direction || direction !== winding) failed.push('C1');

  // C2: the closed centerline crosses each line exactly once, in the track sense.
  const named: { line: Line; barrier: boolean }[] = [];
  if (finishLine) named.push({ line: finishLine, barrier: true });
  for (const l of sectorLimits ?? []) named.push({ line: l, barrier: true });
  for (const l of markers ?? []) named.push({ line: l, barrier: false });
  const crossingOf = new Map<Line, Crossing>();
  let c2 = Boolean(finishLine && sectorLimits && markers);
  for (const { line } of named) {
    const crossings = centerlineCrossings(line);
    if (crossings.length === 1 && crossings[0].forward) crossingOf.set(line, crossings[0]);
    else c2 = false;
  }
  if (!c2) failed.push('C2');

  // C3: start within WIDTH / 2 of the centerline, heading within 90 degrees of the travel tangent.
  let startArc: number | undefined;
  if (startPosition) {
    const p = { x: startPosition.xM, z: startPosition.zM };
    const n = nearest(p);
    const a = track[n.index], b = track[(n.index + 1) % track.length];
    const tangent = Math.atan2(b.x - a.x, b.z - a.z);
    const heading = startPosition.headingDeg * Math.PI / 180;
    const diff = Math.atan2(Math.sin(heading - tangent), Math.cos(heading - tangent));
    if (n.distance <= WIDTH / 2 && Math.abs(diff) < Math.PI / 2) startArc = arcOfPoint(p);
  }
  if (startArc === undefined) failed.push('C3');

  // Arc positions measured from the start, in travel sense; only meaningful when C2 and C3 hold.
  const relative = (line: Line) => {
    const c = crossingOf.get(line);
    if (c === undefined || startArc === undefined) return undefined;
    return ((c.arcM - startArc) % centerlineLength + centerlineLength) % centerlineLength;
  };
  const markerArcs = (markers ?? []).map(relative);
  const limitArcs = (sectorLimits ?? []).map(relative);
  const finishArc = finishLine ? relative(finishLine) : undefined;
  const allKnown = finishArc !== undefined && markerArcs.every(a => a !== undefined) && limitArcs.every(a => a !== undefined)
    && markerArcs.length > 0 && limitArcs.length === 3;
  const increasing = (arcs: (number | undefined)[]) => arcs.every((a, i) => i === 0 || (a as number) > (arcs[i - 1] as number));

  // C4: markers in order, limits in order, finish after all of them.
  const c4 = allKnown && increasing(markerArcs) && increasing(limitArcs)
    && [...markerArcs, ...limitArcs].every(a => (a as number) < (finishArc as number));
  if (!c4) failed.push('C4');

  // C5: every limit has a marker before and a marker after it; the last marker precedes the finish.
  const c5 = allKnown && limitArcs.every(l => markerArcs.some(m => (m as number) < (l as number)) && markerArcs.some(m => (m as number) > (l as number)))
    && (markerArcs[markerArcs.length - 1] as number) < (finishArc as number);
  if (!c5) failed.push('C5');

  // C6: limits and finish reach at least BARRIER_REACH_M to each side of the centerline crossing.
  let c6 = Boolean(finishLine && sectorLimits);
  for (const { line, barrier } of named) {
    if (!barrier) continue;
    const c = crossingOf.get(line);
    if (!c) { c6 = false; continue; }
    const reachFrom = Math.hypot(c.point.x - line.fromXM, c.point.z - line.fromZM);
    const reachTo = Math.hypot(c.point.x - line.toXM, c.point.z - line.toZM);
    if (reachFrom < BARRIER_REACH_M || reachTo < BARRIER_REACH_M) c6 = false;
  }
  if (!c6) failed.push('C6');

  // C7: consecutive lines at least 2 m apart along the centerline; the start at least 2 m from every line.
  let c7 = allKnown;
  if (allKnown) {
    const arcs = [...markerArcs, ...limitArcs, finishArc].map(a => a as number).sort((a, b) => a - b);
    for (let i = 1; i < arcs.length; i++) if (arcs[i] - arcs[i - 1] < MIN_LINE_SPACING_M) c7 = false;
    for (const a of arcs) if (Math.min(a, centerlineLength - a) < MIN_LINE_SPACING_M) c7 = false;
  }
  if (!c7) failed.push('C7');

  return failed;
}

// C1 to C7 of schema 3 (DM-0001 of pista-kart-park): the same purposes as C1 to C7, over the geometry of the file
// itself, never over the synthetic track. Returns the identifiers of the failed checks; a check whose inputs are absent fails.
export function checkConsistencyV3(declared: DeclaredTrack, geometry: TrackGeometry): string[] {
  const failed: string[] = [];
  const { direction, startPosition, finishLine, sectorLimits, markers } = declared;
  const L = geometry.lapLengthM;

  // C1 v3: direction equals the winding of the declared centerline in index order.
  const s = windingSumOf(geometry.centerline);
  const winding: TrackDirection | undefined = s > 0 ? 'CLOCKWISE' : s < 0 ? 'COUNTER_CLOCKWISE' : undefined;
  if (!direction || direction !== winding) failed.push('C1');

  // C2 v3: the closed centerline crosses each line exactly once, in the track sense.
  const named: Line[] = [];
  if (finishLine) named.push(finishLine);
  for (const l of sectorLimits ?? []) named.push(l);
  for (const l of markers ?? []) named.push(l);
  const crossingOf = new Map<Line, number>();
  let c2 = Boolean(finishLine && sectorLimits && markers);
  for (const line of named) {
    const crossings = geometryCrossings(geometry, line);
    if (crossings.length === 1 && crossings[0].forward) crossingOf.set(line, crossings[0].lapM);
    else c2 = false;
  }
  if (!c2) failed.push('C2');

  // C3 v3: start on the track (not grass), heading within 90 degrees of the travel tangent of the nearest segment.
  let startArc: number | undefined;
  if (startPosition) {
    const p = { x: startPosition.xM, z: startPosition.zM };
    const near = nearestOnCenterline(geometry, p);
    const heading = startPosition.headingDeg * Math.PI / 180;
    const diff = Math.atan2(Math.sin(heading - near.headingRad), Math.cos(heading - near.headingRad));
    if (classifySurface(geometry, p) !== 'grass' && Math.abs(diff) < Math.PI / 2) {
      const at = geometry.centerline[near.index];
      startArc = geometry.cumulativeM[near.index] + Math.hypot(near.position.x - at.xM, near.position.z - at.zM);
    }
  }
  if (startArc === undefined) failed.push('C3');

  const relative = (line: Line) => {
    const c = crossingOf.get(line);
    if (c === undefined || startArc === undefined) return undefined;
    return ((c - startArc) % L + L) % L;
  };
  const markerArcs = (markers ?? []).map(relative);
  const limitArcs = (sectorLimits ?? []).map(relative);
  const finishArc = finishLine ? relative(finishLine) : undefined;
  const allKnown = finishArc !== undefined && markerArcs.every(a => a !== undefined) && limitArcs.every(a => a !== undefined)
    && markerArcs.length > 0 && limitArcs.length === 3;
  const increasing = (arcs: (number | undefined)[]) => arcs.every((a, i) => i === 0 || (a as number) > (arcs[i - 1] as number));

  // C4 v3: markers in order, limits in order, finish after all of them.
  const c4 = allKnown && increasing(markerArcs) && increasing(limitArcs)
    && [...markerArcs, ...limitArcs].every(a => (a as number) < (finishArc as number));
  if (!c4) failed.push('C4');

  // C5 v3: every limit has a marker before and after it; the last marker precedes the finish.
  const c5 = allKnown && limitArcs.every(l => markerArcs.some(m => (m as number) < (l as number)) && markerArcs.some(m => (m as number) > (l as number)))
    && (markerArcs[markerArcs.length - 1] as number) < (finishArc as number);
  if (!c5) failed.push('C5');

  // C6 v3: both ends of every line lie on the grass, so the line spans the track edge to edge (no wall in schema 3).
  let c6 = Boolean(finishLine && sectorLimits && markers);
  for (const line of named) {
    if (classifySurface(geometry, { x: line.fromXM, z: line.fromZM }) !== 'grass' || classifySurface(geometry, { x: line.toXM, z: line.toZM }) !== 'grass') c6 = false;
  }
  if (!c6) failed.push('C6');

  // C7 v3: consecutive lines at least 2 m apart; the start at least 2 m from every marker and limit, and on the
  // side after the finish line (the start sits about 0.5 m after it, so no distance to the finish is required).
  let c7 = allKnown && startPosition !== undefined && finishLine !== undefined
    && sideOf(finishLine, { x: startPosition.xM, z: startPosition.zM }) > 0;
  if (allKnown) {
    const arcs = [...markerArcs, ...limitArcs, finishArc].map(a => a as number).sort((a, b) => a - b);
    for (let i = 1; i < arcs.length; i++) if (arcs[i] - arcs[i - 1] < MIN_LINE_SPACING_M) c7 = false;
    for (const a of [...markerArcs, ...limitArcs].map(a => a as number)) if (Math.min(a, L - a) < MIN_LINE_SPACING_M) c7 = false;
  }
  if (!c7) failed.push('C7');

  return failed;
}
