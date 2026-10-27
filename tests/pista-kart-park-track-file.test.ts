// TEST-0001 — the published Kart Park file measured against the origin and against itself (strategy: track-file, file level,
// RULE-0002, DES-0010, DES-0011, DM-0001). Every fact is re-derived here from src/tracks/kart-park-v1.json and
// tracks/sources/kart-park.json; verifyTrackFile is then run as the program runs it, and derived copies prove each check can fail.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crossLine, sideOf, type Line, type Point } from '../src/track';
import { readTrackData } from '../src/trackData';
import { buildTrackGeometry, classifySurface, closestOnSegment, lapMAtIndex, type Quad, type TrackGeometry } from '../src/trackGeometry';
import { CHECK_IDS, MAX_FILE_BYTES, utf8Length, verifyTrackFile, type CheckId } from '../scripts/trackChecks';
import {
  corruptedText, kartParkFile, kartParkGeometry, kartParkText, originJson, registryJson, withBarrierVertexOnAsphalt, withCurbOnOtherSide,
  withOtherTrackId, withPointOffset, withRecordField, withSchema4, withShiftedCenterline, withTrackVersion2, withoutBarriers, withoutCurbs, withoutMarker,
  type KartParkFile,
} from './fixtures/kartParkFiles';

const file = kartParkFile();
const origin = originJson();
const g = kartParkGeometry();
const L = g.lapLengthM;
const n = file.centerline.length;
const round3 = (v: number) => Math.round(v * 1000) / 1000;
const near = (a: number, b: number, tol: number) => Math.abs(a - b) <= tol;

// The origin in the game axes, as RULE-0002 states it: x east, z = -north, centred on the bounding box, 0.001 m grid.
const originPts = origin.pontos;
const cx = round3((Math.min(...originPts.map(p => p[0])) + Math.max(...originPts.map(p => p[0]))) / 2);
const cy = round3((Math.min(...originPts.map(p => p[1])) + Math.max(...originPts.map(p => p[1]))) / 2);
const converted: Point[] = originPts.map(p => ({ x: p[0] - cx, z: -(p[1] - cy) }));
const originCumulative: number[] = [];
let originLength = 0;
for (let i = 0; i < converted.length; i++) {
  originCumulative.push(originLength);
  const a = converted[i], b = converted[(i + 1) % converted.length];
  originLength += Math.hypot(b.x - a.x, b.z - a.z);
}
// Lap distance on the published line of an origin lap distance, by fractional index (the correspondence is by index).
function publishedLapM(originM: number): number {
  const m = ((originM % originLength) + originLength) % originLength;
  let i = 0;
  while (i + 1 < originCumulative.length && originCumulative[i + 1] <= m) i++;
  const segment = (i + 1 < originCumulative.length ? originCumulative[i + 1] : originLength) - originCumulative[i];
  return lapMAtIndex(g, i, segment > 0 ? (m - originCumulative[i]) / segment : 0);
}
// Lap distance at which the closed centerline crosses a line, in the track sense; undefined unless exactly one crossing.
function crossingLapM(line: Line): number | undefined {
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const a = { x: file.centerline[i].xM, z: file.centerline[i].zM }, b = { x: file.centerline[(i + 1) % n].xM, z: file.centerline[(i + 1) % n].zM };
    const c = crossLine(line, a, b);
    if (c) out.push(c.sense === 'FORWARD' ? lapMAtIndex(g, i, c.fraction) : NaN);
  }
  return out.length === 1 && !Number.isNaN(out[0]) ? out[0] : undefined;
}
const segmentsIntersect = (p: Point, q: Point, a: Point, b: Point): boolean => {
  const o = (u: Point, v: Point, w: Point) => (v.x - u.x) * (w.z - u.z) - (v.z - u.z) * (w.x - u.x);
  return o(p, q, a) * o(p, q, b) < 0 && o(a, b, p) * o(a, b, q) < 0;
};
const distanceToQuad = (q: Quad, p: Point) => Math.min(...[0, 1, 2, 3].map(i => closestOnSegment(q[i], q[(i + 1) % 4], p).distanceM));
const quadsInLapRange = (geometry: TrackGeometry, fromM: number, toM: number) => geometry.asphaltQuads.filter((_, i) => geometry.cumulativeM[i] >= fromM && geometry.cumulativeM[i] <= toM);
const failedIds = (copy: KartParkFile | string): CheckId[] => verifyTrackFile(typeof copy === 'string' ? copy : JSON.stringify(copy) + '\n', origin).filter(r => !r.pass).map(r => r.id);

test('CHK-TEST-0001-01 the smoothed centerline is a closed lap of the origin points: the last point links back to point 0 without repeating it', () => {
  // AC-US-0002-01
  assert.ok(n >= 3, `AC-US-0002-01: the centerline must have at least 3 points (${n})`);
  assert.equal(n, originPts.length, `AC-US-0002-01: the published line must keep the ${originPts.length} origin points (${n})`);
  const first = file.centerline[0], last = file.centerline[n - 1];
  assert.ok(first.xM !== last.xM || first.zM !== last.zM, 'AC-US-0002-01: the last point must not repeat point 0');
  const closing = Math.hypot(first.xM - last.xM, first.zM - last.zM);
  assert.ok(closing > 0 && closing < 5, `AC-US-0002-01: the closing segment from the last point to point 0 must be a short real segment (${closing.toFixed(3)} m)`);
});

test('CHK-TEST-0001-02 the lap length re-measured on the published points is within 687.5 m +/- 1 % and is the one the registry records', () => {
  // AC-US-0002-02
  let measured = 0;
  for (let i = 0; i < n; i++) {
    const a = file.centerline[i], b = file.centerline[(i + 1) % n];
    measured += Math.hypot(b.xM - a.xM, b.zM - a.zM);
  }
  assert.ok(measured >= 680.625 && measured <= 694.375, `AC-US-0002-02: the measured lap ${measured.toFixed(3)} m must lie in [680.625, 694.375]`);
  assert.ok(near(measured, L, 1e-9), 'AC-US-0002-02: buildTrackGeometry must measure the same lap length as the file points');
  const entry = registryJson().entries.find(e => e.trackId === 'kart-park' && e.trackVersion === file.trackVersion) as { prep: { lapLengthM: number } } | undefined;
  assert.ok(entry, 'AC-US-0002-02: the registry must carry the published version');
  assert.ok(near(measured, entry!.prep.lapLengthM, 0.001), `AC-US-0002-02: the registry lapLengthM ${entry!.prep.lapLengthM} must be the measured ${measured.toFixed(3)} m`);
  assert.ok(!('lapLengthM' in file), 'AC-US-0002-02: the lap length is measured, never a key of the file (V18)');
});

test('CHK-TEST-0001-03 the start line and the finish line are the same transversal line at point 0, with the start just after it on the first segment', () => {
  // AC-US-0002-03, AC-US-0003-03
  const finishM = crossingLapM(file.finishLine);
  assert.ok(finishM !== undefined, 'AC-US-0002-03: the finish line must cross the centerline exactly once, in the track sense');
  assert.ok(Math.min(finishM!, L - finishM!) <= 0.01, `AC-US-0002-03: the finish line must cross at point 0 (crossing at ${finishM!.toFixed(3)} m of the lap)`);
  const p0 = { x: file.centerline[0].xM, z: file.centerline[0].zM }, p1 = { x: file.centerline[1].xM, z: file.centerline[1].zM };
  const start = { x: file.startPosition.xM, z: file.startPosition.zM };
  const onFirst = closestOnSegment(p0, p1, start);
  assert.ok(onFirst.distanceM <= 0.002 && onFirst.t > 0 && onFirst.t < 1, `AC-US-0003-03: the start must sit on the segment from point 0 to point 1 (distance ${onFirst.distanceM.toFixed(4)} m, t ${onFirst.t.toFixed(3)})`);
  assert.ok(sideOf(file.finishLine, start) > 0, 'AC-US-0003-03: the start must be on the side after the finish line');
  const segmentHeading = Math.atan2(p1.x - p0.x, p1.z - p0.z) * 180 / Math.PI;
  assert.ok(near(file.startPosition.headingDeg, segmentHeading, 0.001), `AC-US-0003-03: the start heading ${file.startPosition.headingDeg} must be the heading of the first segment (${segmentHeading.toFixed(3)})`);
});

test('CHK-TEST-0001-04 the centerline in the game axes winds anticlockwise seen from above, like the origin, and the file declares COUNTER_CLOCKWISE', () => {
  // AC-US-0002-04
  const signedArea = (pts: Point[]) => { let s = 0; for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; s += a.x * (-b.z) - b.x * (-a.z); } return s / 2; };
  const published = signedArea(file.centerline.map(p => ({ x: p.xM, z: p.zM })));
  const source = signedArea(converted);
  assert.ok(published > 0, `AC-US-0002-04: the signed area in the (east, north) plane must be positive, anticlockwise (${published.toFixed(1)} m2)`);
  assert.ok(source > 0, 'AC-US-0002-04: the converted origin must wind the same way (not mirrored)');
  assert.equal(file.direction, 'COUNTER_CLOCKWISE', 'AC-US-0002-04: the file must declare COUNTER_CLOCKWISE');
  assert.equal(origin.sentido, 'anti-horario', 'AC-US-0002-04: the origin declares anti-horario');
});

test('CHK-TEST-0001-05 every width is the width of the corresponding origin point, varying from 4.4 m to 10.8 m with no fixed value', () => {
  // AC-US-0002-05
  const mismatches = file.centerline.filter((p, i) => !near(p.widthM, round3(originPts[i][2]), 0.0005)).length;
  assert.equal(mismatches, 0, `AC-US-0002-05: ${mismatches} widths differ from the origin point of the same index`);
  const widths = file.centerline.map(p => p.widthM);
  const minW = Math.min(...widths), maxW = Math.max(...widths);
  assert.ok(near(Math.round(minW * 10) / 10, 4.4, 1e-9), `AC-US-0002-05: the narrowest asphalt must be 4.4 m at one decimal (${minW})`);
  assert.ok(near(Math.round(maxW * 10) / 10, 10.8, 1e-9), `AC-US-0002-05: the widest asphalt must be 10.8 m at one decimal (${maxW})`);
  assert.ok(new Set(widths).size > 10, `AC-US-0002-05: the width must vary point to point (${new Set(widths).size} distinct values)`);
});

test('CHK-TEST-0001-06 no published point is farther than 0.30 m from its origin point nor from the original polyline, and the registry records the largest offset', () => {
  // AC-US-0002-06
  let worstPoint = 0, worstIndex = -1, worstLine = 0;
  file.centerline.forEach((p, i) => {
    const d = Math.hypot(p.xM - converted[i].x, p.zM - converted[i].z);
    if (d > worstPoint) { worstPoint = d; worstIndex = i; }
    let toLine = Infinity;
    for (let k = 0; k < converted.length; k++) toLine = Math.min(toLine, closestOnSegment(converted[k], converted[(k + 1) % converted.length], { x: p.xM, z: p.zM }).distanceM);
    worstLine = Math.max(worstLine, toLine);
  });
  assert.ok(worstPoint <= 0.30, `AC-US-0002-06: point ${worstIndex} is ${worstPoint.toFixed(4)} m from its origin point, above 0.30 m`);
  assert.ok(worstLine <= 0.30, `AC-US-0002-06: a published point is ${worstLine.toFixed(4)} m from the original polyline, above 0.30 m`);
  assert.ok(worstPoint > 0.05, `AC-US-0002-06: the line must actually be smoothed (largest offset ${worstPoint.toFixed(4)} m)`);
  const entry = registryJson().entries.find(e => e.trackId === 'kart-park' && e.trackVersion === file.trackVersion) as { prep: { maxSmoothingOffsetM: number; smoothingWindowM: number } };
  assert.ok(near(entry.prep.maxSmoothingOffsetM, worstPoint, 0.001), `AC-US-0002-06: the registry maxSmoothingOffsetM ${entry.prep.maxSmoothingOffsetM} must be the measured ${worstPoint.toFixed(4)} m`);
  assert.equal(entry.prep.smoothingWindowM, 12, 'AC-US-0002-06: the registry must record the 12 m window of ADR-0006');
});

test('CHK-TEST-0001-07 the asphalt edges never cross themselves nor each other, including at the tightest hairpin near 218 m', () => {
  // AC-US-0002-07
  const edges: { name: string; pts: readonly Point[] }[] = [{ name: 'left', pts: g.leftEdge }, { name: 'right', pts: g.rightEdge }];
  const seg = (pts: readonly Point[], i: number) => [pts[i], pts[(i + 1) % n]] as const;
  for (const { name, pts } of edges) {
    for (let i = 0; i < n; i++) for (let k = i + 2; k < n; k++) {
      if (i === 0 && k === n - 1) continue;
      const [p, q] = seg(pts, i), [a, b] = seg(pts, k);
      assert.ok(!segmentsIntersect(p, q, a, b), `AC-US-0002-07: the ${name} edge crosses itself between segments ${i} and ${k}`);
    }
  }
  for (let i = 0; i < n; i++) for (let k = 0; k < n; k++) {
    const [p, q] = seg(g.leftEdge, i), [a, b] = seg(g.rightEdge, k);
    assert.ok(!segmentsIntersect(p, q, a, b), `AC-US-0002-07: the left edge segment ${i} crosses the right edge segment ${k}`);
  }
  // The hairpin: the smallest turning radius of the lap lies near 218 m and is about 6 m.
  let minRadius = Infinity, minAt = 0;
  for (let i = 0; i < n; i++) {
    const a = file.centerline[(i + n - 2) % n], b = file.centerline[i], c = file.centerline[(i + 2) % n];
    const ab = Math.hypot(b.xM - a.xM, b.zM - a.zM), bc = Math.hypot(c.xM - b.xM, c.zM - b.zM), ca = Math.hypot(c.xM - a.xM, c.zM - a.zM);
    const cross = Math.abs((b.xM - a.xM) * (c.zM - b.zM) - (b.zM - a.zM) * (c.xM - b.xM));
    if (cross === 0) continue;
    const radius = ab * bc * ca / (2 * cross);
    if (radius < minRadius) { minRadius = radius; minAt = g.cumulativeM[i]; }
  }
  assert.ok(minRadius >= 4 && minRadius <= 9, `AC-US-0002-07: the tightest radius must be about 6 m (${minRadius.toFixed(2)} m)`);
  assert.ok(minAt >= 195 && minAt <= 245, `AC-US-0002-07: the tightest hairpin must lie near 218 m of the lap (${minAt.toFixed(1)} m)`);
});

test('CHK-TEST-0001-08 the lap has 4 sectors: exactly 3 internal limits, each crossed once in the track sense and in lap order', () => {
  // AC-US-0003-01
  assert.equal(file.sectorLimits.length, 3, `AC-US-0003-01: 3 sector limits give 4 sectors (${file.sectorLimits.length})`);
  const crossings = file.sectorLimits.map(crossingLapM);
  assert.ok(crossings.every(c => c !== undefined), 'AC-US-0003-01: every limit must cross the centerline exactly once, in the track sense');
  for (let i = 1; i < crossings.length; i++) assert.ok((crossings[i] as number) > (crossings[i - 1] as number), `AC-US-0003-01: limit ${i + 1} must come after limit ${i}`);
});

test('CHK-TEST-0001-09 each internal limit crosses the centerline at the point whose original lap distance is nearest to 201.6, 350.3 and 529.9 m', () => {
  // AC-US-0003-02
  const targets = [201.6, 350.3, 529.9];
  targets.forEach((target, k) => {
    let best = 0;
    for (let i = 0; i < converted.length; i++) if (Math.abs(originCumulative[i] - target) < Math.abs(originCumulative[best] - target)) best = i;
    const crossing = crossingLapM(file.sectorLimits[k]);
    assert.ok(crossing !== undefined, `AC-US-0003-02: limit ${k + 1} must cross the centerline once`);
    assert.ok(near(crossing!, g.cumulativeM[best], 0.01), `AC-US-0003-02: limit ${k + 1} crosses at ${crossing!.toFixed(3)} m, but point ${best} (origin ${originCumulative[best].toFixed(1)} m, nearest to ${target} m) lies at ${g.cumulativeM[best].toFixed(3)} m`);
    // The limit lies on a link between corners: the curvature there is small.
    const a = file.centerline[(best + n - 3) % n], b = file.centerline[best], c = file.centerline[(best + 3) % n];
    const cross = Math.abs((b.xM - a.xM) * (c.zM - b.zM) - (b.zM - a.zM) * (c.xM - b.xM));
    const radius = Math.hypot(b.xM - a.xM, b.zM - a.zM) * Math.hypot(c.xM - b.xM, c.zM - b.zM) * Math.hypot(c.xM - a.xM, c.zM - a.zM) / (2 * Math.max(cross, 1e-12));
    assert.ok(radius > 15, `AC-US-0003-02: limit ${k + 1} must lie on a link between corners (radius ${radius.toFixed(1)} m)`);
  });
});

test('CHK-TEST-0001-10 consecutive markers are at most 25 m of lap apart, the last to the first included, each crossed once in the track sense', () => {
  // AC-US-0003-04
  const crossings = file.markers.map(crossingLapM);
  assert.ok(crossings.every(c => c !== undefined), 'AC-US-0003-04: every marker must cross the centerline exactly once, in the track sense');
  const arcs = crossings as number[];
  assert.ok(arcs.length >= Math.ceil(L / 25), `AC-US-0003-04: at least ${Math.ceil(L / 25)} markers are needed for 25 m spacing (${arcs.length})`);
  let maxGap = 0;
  for (let i = 0; i < arcs.length; i++) {
    const gap = i + 1 < arcs.length ? arcs[i + 1] - arcs[i] : L - arcs[i] + arcs[0];
    assert.ok(gap > 0, `AC-US-0003-04: markers must be in lap order (marker ${i + 1} to ${i + 2})`);
    maxGap = Math.max(maxGap, gap);
  }
  assert.ok(maxGap <= 25, `AC-US-0003-04: the largest marker spacing must be at most 25 m (${maxGap.toFixed(2)} m)`);
});

test('CHK-TEST-0001-11 a barrier separates the 371-414 m and 580-615 m stretches wherever their asphalt edges are 6 m or less apart', () => {
  // AC-US-0004-01
  // The stretches are the points whose original lap distance lies in 371-414 m and 580-615 m; their asphalt edges are sampled
  // every 0.25 m and each sample is paired with the closest point of the other stretch's edges. A pair 6 m or closer must be
  // separated by a barrier segment: crossed, or touched within 0.002 m (the 0.001 m grid of the file).
  const indicesOf = (from: number, to: number) => { const out: number[] = []; for (let i = 0; i < n; i++) if (originCumulative[i] >= from && originCumulative[i] <= to) out.push(i); return out; };
  const edgeSegmentsOf = (indices: number[]) => {
    const segs: { a: Point; b: Point }[] = [];
    for (const edge of [g.leftEdge, g.rightEdge]) for (let k = 0; k + 1 < indices.length; k++) segs.push({ a: edge[indices[k]], b: edge[indices[k + 1]] });
    return segs;
  };
  const samplesOf = (segs: { a: Point; b: Point }[]) => {
    const out: Point[] = [];
    for (const s of segs) { const len = Math.hypot(s.b.x - s.a.x, s.b.z - s.a.z); const c = Math.max(1, Math.ceil(len / 0.25)); for (let k = 0; k < c; k++) out.push({ x: s.a.x + (s.b.x - s.a.x) * k / c, z: s.a.z + (s.b.z - s.a.z) * k / c }); }
    if (segs.length) out.push(segs[segs.length - 1].b);
    return out;
  };
  const separated = (p: Point, q: Point) => g.barrierSegments.some(s => segmentsIntersect(p, q, s.a, s.b)
    || closestOnSegment(p, q, s.a).distanceM <= 0.002 || closestOnSegment(p, q, s.b).distanceM <= 0.002
    || closestOnSegment(s.a, s.b, p).distanceM <= 0.002 || closestOnSegment(s.a, s.b, q).distanceM <= 0.002);
  const sections = [edgeSegmentsOf(indicesOf(371, 414)), edgeSegmentsOf(indicesOf(580, 615))];
  assert.ok(sections[0].length > 40 && sections[1].length > 40, 'AC-US-0004-01: both stretches must be sampled');
  assert.ok(g.barrierSegments.length > 0, 'AC-US-0004-01: the file must declare a barrier');
  let closePairs = 0;
  const unseparated: string[] = [];
  for (const [from, to] of [[0, 1], [1, 0]]) {
    for (const p of samplesOf(sections[from])) {
      let best: Point | undefined, bestD = Infinity;
      for (const s of sections[to]) { const c = closestOnSegment(s.a, s.b, p); if (c.distanceM < bestD) { bestD = c.distanceM; best = c.point; } }
      if (!best || bestD > 6) continue;
      closePairs++;
      if (!separated(p, best)) unseparated.push(`(${p.x.toFixed(2)}, ${p.z.toFixed(2)}) ${bestD.toFixed(2)} m from the other stretch`);
    }
  }
  assert.ok(closePairs > 100, `AC-US-0004-01: the two stretches must come within 6 m of each other (${closePairs} close pairs)`);
  assert.deepEqual(unseparated, [], `AC-US-0004-01: ${unseparated.length} of ${closePairs} close pairs are not separated by a barrier: ${unseparated.slice(0, 3).join('; ')}`);
});

test('CHK-TEST-0001-12 no barrier stands where the grass between the stretches exceeds 6 m, and the 12-26 m shortcuts of curve 4 get none', () => {
  // AC-US-0004-02
  const first = quadsInLapRange(g, publishedLapM(360), publishedLapM(425)), second = quadsInLapRange(g, publishedLapM(570), publishedLapM(625));
  const nearest = (quads: Quad[], p: Point) => Math.min(...quads.map(q => distanceToQuad(q, p)));
  let worstSum = 0;
  for (const s of g.barrierSegments) {
    for (const v of [s.a, s.b, { x: (s.a.x + s.b.x) / 2, z: (s.a.z + s.b.z) / 2 }]) {
      const sum = nearest(first, v) + nearest(second, v);
      worstSum = Math.max(worstSum, sum);
    }
  }
  assert.ok(worstSum <= 6.01, `AC-US-0004-02: a barrier point stands where the asphalt-to-asphalt gap is ${worstSum.toFixed(3)} m, above 6 m`);
  const curve4 = quadsInLapRange(g, publishedLapM(140), publishedLapM(205));
  let minToCurve4 = Infinity;
  for (const s of g.barrierSegments) for (const v of [s.a, s.b]) minToCurve4 = Math.min(minToCurve4, nearest(curve4, v));
  assert.ok(minToCurve4 > 6, `AC-US-0004-02: no barrier may stand by the 147-200 m shortcut of curve 4 (nearest barrier vertex ${minToCurve4.toFixed(1)} m from it)`);
});

test('CHK-TEST-0001-13 no barrier point, vertex or sample, lies on the asphalt or the curb of either stretch; the contact surface stays off the track', () => {
  // AC-US-0004-03
  let onTrack = 0, minClearance = Infinity, samples = 0;
  for (const s of g.barrierSegments) {
    const length = Math.hypot(s.b.x - s.a.x, s.b.z - s.a.z);
    const count = Math.max(1, Math.ceil(length / 0.05));
    for (let k = 0; k <= count; k++) {
      const p = { x: s.a.x + (s.b.x - s.a.x) * k / count, z: s.a.z + (s.b.z - s.a.z) * k / count };
      samples++;
      if (classifySurface(g, p) !== 'grass') onTrack++;
      let d = Infinity;
      for (const q of g.asphaltQuads) d = Math.min(d, distanceToQuad(q, p));
      for (const q of g.curbQuads) d = Math.min(d, distanceToQuad(q, p));
      minClearance = Math.min(minClearance, d);
    }
  }
  assert.ok(samples > 400, 'AC-US-0004-03: the barrier must be sampled along its length');
  assert.equal(onTrack, 0, `AC-US-0004-03: ${onTrack} barrier points lie on the asphalt or a curb`);
  assert.ok(minClearance >= 0.1, `AC-US-0004-03: the 0.1 m contact surface must not reach the track (clearance ${minClearance.toFixed(3)} m)`);
});

test('CHK-TEST-0001-14 there are 34 curb spans: the 33 of the origin, with the one crossing the start split in two at the start line', () => {
  // AC-US-0005-01
  assert.equal(origin.zebras.length, 33, `AC-US-0005-01: the origin declares 33 curbs (${origin.zebras.length})`);
  assert.equal(file.curbs.length, 34, `AC-US-0005-01: the file must declare 34 spans (${file.curbs.length})`);
  const crossing = origin.zebras.filter(z => z.ate_m > origin.comprimento_m || z.ate_m > originLength + 0.001);
  assert.equal(crossing.length, 1, `AC-US-0005-01: exactly one origin curb crosses the start (${crossing.length})`);
  const endingAtLap = file.curbs.filter(c => near(c.toLapM, L, 0.001));
  const startingAtZero = file.curbs.filter(c => c.fromLapM === 0);
  assert.equal(endingAtLap.length, 1, `AC-US-0005-01: one span must end at the lap length (${endingAtLap.length})`);
  assert.equal(startingAtZero.length, 1, `AC-US-0005-01: one span must start at 0 (${startingAtZero.length})`);
  assert.equal(endingAtLap[0].side, startingAtZero[0].side, 'AC-US-0005-01: the two halves of the split curb keep its side');
  for (const c of file.curbs) assert.ok(c.fromLapM >= 0 && c.fromLapM < c.toLapM && c.toLapM <= L + 0.001, `AC-US-0005-01: span ${c.fromLapM}-${c.toLapM} must lie inside the lap without crossing point 0`);
});

test('CHK-TEST-0001-15 each span keeps the side and covers the lap stretch declared for it in the origin, mapped by fractional index', () => {
  // AC-US-0005-02
  const side: Record<string, 'LEFT' | 'RIGHT'> = { esquerda: 'LEFT', direita: 'RIGHT' };
  const unmatched: string[] = [];
  for (const z of origin.zebras) {
    const from = publishedLapM(z.de_m);
    const wraps = z.ate_m > originLength + 0.001;
    const to = wraps ? L : publishedLapM(z.ate_m);
    const hit = file.curbs.find(c => c.side === side[z.lado] && near(c.fromLapM, from, 0.01) && near(c.toLapM, to, 0.01));
    if (!hit) unmatched.push(`${z.lado} ${z.de_m}-${z.ate_m} -> ${from.toFixed(3)}-${to.toFixed(3)}`);
    if (wraps) {
      const tail = publishedLapM(z.ate_m - originLength);
      const second = file.curbs.find(c => c.side === side[z.lado] && c.fromLapM === 0 && near(c.toLapM, tail, 0.01));
      if (!second) unmatched.push(`${z.lado} 0-${tail.toFixed(3)} (after the start)`);
    }
  }
  assert.deepEqual(unmatched, [], `AC-US-0005-02: origin curbs without a matching span: ${unmatched.join('; ')}`);
  assert.ok(file.curbs.every(c => c.widthM > 0), 'AC-US-0005-02: every span must declare a positive width');
});

test('CHK-TEST-0001-16 the file carries exactly the declared keys and identity, and no record of the real track', () => {
  // AC-US-0006-09, NFR-0006
  assert.deepEqual(Object.keys(file), ['schemaVersion', 'trackId', 'trackVersion', 'osmDerived', 'direction', 'startPosition', 'finishLine', 'sectorLimits', 'markers', 'centerline', 'curbs', 'barriers'], 'NFR-0006: the keys must be the 12 of DM-0001 in order');
  assert.equal(file.schemaVersion, 3, 'NFR-0006: schemaVersion must be 3');
  assert.equal(file.trackId, 'kart-park', 'NFR-0006: trackId must be kart-park');
  assert.equal(file.trackVersion, 1, 'NFR-0006: the first published Kart Park is trackVersion 1');
  assert.equal(file.osmDerived, true, 'NFR-0006: the file declares the OpenStreetMap derivation');
  const text = kartParkText();
  for (const forbidden of ['41,45', '41.45', '41450', 'recorde', 'record', 'KARTPLAN']) assert.ok(!text.includes(forbidden), `AC-US-0006-09: the published file must not carry "${forbidden}"`);
  assert.ok(text.endsWith('\n') && text.indexOf('\n') === text.length - 1, 'NFR-0006: the file is one line, newline terminated (DM-0001)');
});

test('CHK-TEST-0001-17 the published file is smaller than 200 000 bytes as delivered', () => {
  // NFR-0001
  const bytes = utf8Length(kartParkText());
  assert.ok(bytes < 200_000, `NFR-0001: the file must be under 200 000 bytes (${bytes})`);
  assert.ok(bytes > 10_000, `NFR-0001: the file must be the real track (${bytes} bytes)`);
  assert.equal(MAX_FILE_BYTES, 200_000, 'NFR-0001: the program applies the same limit');
});

test('CHK-TEST-0001-18 verifyTrackFile passes V01 to V18 on the published file against the origin, twice with the same result', () => {
  // AC-US-0002-01, AC-US-0002-02, AC-US-0002-03, AC-US-0002-04, AC-US-0002-05, AC-US-0002-06, AC-US-0002-07, AC-US-0003-01, AC-US-0003-02, AC-US-0003-03, AC-US-0003-04, AC-US-0004-01, AC-US-0004-02, AC-US-0004-03, AC-US-0005-01, AC-US-0005-02, NFR-0001, NFR-0006
  const results = verifyTrackFile(kartParkText(), origin);
  assert.deepEqual(results.map(r => r.id), [...CHECK_IDS], 'the 18 checks must run in order');
  const failed = results.filter(r => !r.pass).map(r => `${r.id}: ${r.detail}`);
  assert.deepEqual(failed, [], `V01-V18 must pass on the published file: ${failed.join('; ')}`);
  assert.deepEqual(verifyTrackFile(kartParkText(), origin), results, 'two runs of the verification must give the same results');
  assert.equal(readTrackData(kartParkText()).trackDataStatus, 'COMPLETE', 'the published file reads COMPLETE');
});

test('CHK-TEST-0001-19 every verification can fail: a copy with one deviation fails the check named after it and nothing else that is sound', () => {
  // AC-US-0002-06, AC-US-0003-04, AC-US-0004-03, AC-US-0005-02, AC-US-0006-09, NFR-0006
  const expectations: [string, KartParkFile | string, CheckId[]][] = [
    ['point 400 moved 0.4 m along its normal (V01, V07)', withPointOffset(), ['V01', 'V07']],
    ['one marker removed (V10)', withoutMarker(), ['V10']],
    ['a curb on the other side (V12)', withCurbOnOtherSide(), ['V12']],
    ['a barrier vertex on the asphalt (V15)', withBarrierVertexOnAsphalt(), ['V15']],
    ['a record field (V18)', withRecordField(), ['V18']],
    ['trackVersion 2 with the same content (V16)', withTrackVersion2(), ['V16']],
    ['another trackId (V16)', withOtherTrackId(), ['V16']],
    ['no barriers (V13, V14)', withoutBarriers(), ['V13', 'V14']],
    ['no curbs (V12)', withoutCurbs(), ['V12']],
  ];
  for (const [label, copy, ids] of expectations) {
    const failed = failedIds(copy);
    for (const id of ids) assert.ok(failed.includes(id), `${label}: ${id} must fail (failed: ${failed.join(',') || 'none'})`);
    assert.ok(failed.length < CHECK_IDS.length, `${label}: the copy must still be readable so that only the deviation fails`);
  }
  assert.equal(failedIds(withSchema4()).length, CHECK_IDS.length, 'schemaVersion 4 fails every check');
  assert.equal(readTrackData(withShiftedCenterline()).trackDataStatus, 'INCOMPLETE', 'a centerline translated 0.4 m under its lines reads INCOMPLETE (C6) and verifies nothing');
  assert.equal(failedIds(withShiftedCenterline()).length, CHECK_IDS.length, 'a translated centerline fails every check');
  assert.equal(failedIds(corruptedText()).length, CHECK_IDS.length, 'a corrupted text fails every check');
  assert.equal(verifyTrackFile(kartParkText(), { pontos: 'x' }).filter(r => r.pass).length, 0, 'an unreadable origin fails every check');
});

test('CHK-TEST-0001-20 the derived geometry of the file keeps every curb quad on its declared side and every lap distance inside the lap', () => {
  // AC-US-0005-02
  assert.equal(g.curbQuadSpan.length, g.curbQuads.length, 'AC-US-0005-02: every curb quad belongs to a span');
  g.curbQuads.forEach((q, k) => {
    const span = g.curbs[g.curbQuadSpan[k]];
    const centre = { x: (q[0].x + q[1].x + q[2].x + q[3].x) / 4, z: (q[0].z + q[1].z + q[2].z + q[3].z) / 4 };
    let best = 0, bestD = Infinity;
    for (let i = 0; i < n; i++) { const d = Math.hypot(file.centerline[i].xM - centre.x, file.centerline[i].zM - centre.z); if (d < bestD) { bestD = d; best = i; } }
    const normal = g.normals[best];
    const leftward = (centre.x - file.centerline[best].xM) * normal.x + (centre.z - file.centerline[best].zM) * normal.z;
    assert.ok(span.side === 'LEFT' ? leftward > 0 : leftward < 0, `AC-US-0005-02: curb quad ${k} of the ${span.side} span ${span.fromLapM}-${span.toLapM} lies on the other side`);
    assert.ok(classifySurface(g, centre) === 'curb', `AC-US-0005-02: the centre of curb quad ${k} must classify as curb`);
  });
});
