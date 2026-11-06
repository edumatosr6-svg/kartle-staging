// TEST-0001 — the published Kart Park version 2 measured against the replica and against itself (strategy: track-file, file
// level, RULE-0002 2.0.0, DES-0010, DES-0011, DM-0001). Every fact is re-derived here from src/tracks/kart-park-v2.json and
// tracks/sources/kart-park-replica.json by the test's own code; verifyTrackFile is then run as the program runs it, and derived
// copies prove each check can fail. The version 1 is judged by its recorded digest in the publication suite.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crossLine, sideOf, type Line, type Point } from '../src/track';
import { readTrackData } from '../src/trackData';
import { classifySurface, closestOnSegment, lapMAtIndex, type Quad } from '../src/trackGeometry';
import { CHECK_IDS, MAX_FILE_BYTES, utf8Length, verifyTrackFile, type CheckId } from '../scripts/trackChecks';
import {
  corruptedText, kartParkFile, kartParkGeometry, kartParkText, registryJson, replicaJson, withBarrierVertexOnAsphalt, withCurbOnOtherSide,
  withCurbPastLap, withOtherTrackId, withPointOffset, withRecordField, withReversedCenterline, withScaledCoordinates, withSchema4, withSectorLimitAt,
  withShiftedCenterline, withTrackVersion1, withWidth, withoutBarriers, withoutCurbs, withoutMarker, type KartParkFile,
} from './fixtures/kartParkFiles';

const file = kartParkFile();
const replica = replicaJson();
const g = kartParkGeometry();
const L = g.lapLengthM;
const n = file.centerline.length;
const near = (a: number, b: number, tol: number) => Math.abs(a - b) <= tol;

// The replica in the game axes, as RULE-0002 2.0.0 states it: (x, y) with y north is (x, -y), with the replica's own origin.
const replicaPts: Point[] = replica.pontos.map(p => ({ x: p[0], z: -p[1] }));
const R0 = replicaPts[0];
const distanceToReplica = (p: Point) => { let best = Infinity; for (let k = 0; k < replicaPts.length; k++) best = Math.min(best, closestOnSegment(replicaPts[k], replicaPts[(k + 1) % replicaPts.length], p).distanceM); return best; };
const P = (i: number): Point => ({ x: file.centerline[i].xM, z: file.centerline[i].zM });
// The lap distance d(i) re-measured here on the file points (RULE-0002: from point 0, segment by segment).
const d: number[] = [];
{ let acc = 0; for (let i = 0; i < n; i++) { d.push(acc); acc += Math.hypot(P((i + 1) % n).x - P(i).x, P((i + 1) % n).z - P(i).z); } }
const nearestIndex = (target: number) => { let best = 0; for (let i = 1; i < n; i++) if (Math.abs(d[i] - target) < Math.abs(d[best] - target)) best = i; return best; };
// Lap distance at which the closed centerline crosses a line, in the track sense; undefined unless exactly one crossing.
function crossingLapM(line: Line): number | undefined {
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const c = crossLine(line, P(i), P((i + 1) % n));
    if (c) out.push(c.sense === 'FORWARD' ? lapMAtIndex(g, i, c.fraction) : NaN);
  }
  return out.length === 1 && !Number.isNaN(out[0]) ? out[0] : undefined;
}
const segmentsIntersect = (p: Point, q: Point, a: Point, b: Point): boolean => {
  const o = (u: Point, v: Point, w: Point) => (v.x - u.x) * (w.z - u.z) - (v.z - u.z) * (w.x - u.x);
  return o(p, q, a) * o(p, q, b) < 0 && o(a, b, p) * o(a, b, q) < 0;
};
const distanceToQuad = (q: Quad, p: Point) => Math.min(...[0, 1, 2, 3].map(i => closestOnSegment(q[i], q[(i + 1) % 4], p).distanceM));
const insideQuad = (q: Quad, p: Point) => { let inside = false; for (let i = 0, j = 3; i < 4; j = i++) { const a = q[i], b = q[j]; if ((a.z > p.z) !== (b.z > p.z) && p.x < a.x + (p.z - a.z) * (b.x - a.x) / (b.z - a.z)) inside = !inside; } return inside; };
const asphaltDistance = (indices: number[], p: Point) => Math.min(...indices.map(i => insideQuad(g.asphaltQuads[i], p) ? 0 : distanceToQuad(g.asphaltQuads[i], p)));
// The two near stretches of RULE-0002 2.0.0, by d: T1 = 368.5-406.5 m, T2 = 594.5-624.5 m.
const T1 = [368.5, 406.5], T2 = [594.5, 624.5];
const indicesOf = ([from, to]: number[]) => { const out: number[] = []; for (let i = 0; i < n; i++) if (d[i] >= from && d[i] <= to) out.push(i); return out; };
const circumradius = (i: number, k = 3) => {
  const a = P((i + n - k) % n), b = P(i), c = P((i + k) % n);
  const cross = Math.abs((b.x - a.x) * (c.z - b.z) - (b.z - a.z) * (c.x - b.x));
  return cross === 0 ? Infinity : Math.hypot(b.x - a.x, b.z - a.z) * Math.hypot(c.x - b.x, c.z - b.z) * Math.hypot(c.x - a.x, c.z - a.z) / (2 * cross);
};
const versionEntry = () => registryJson().entries.find(e => e.trackId === 'kart-park' && e.trackVersion === file.trackVersion) as
  { prep: { lapLengthM: number; maxReplicaOffsetM: number; method: string } } | undefined;
const failedIds = (copy: KartParkFile | string, replicaCopy: unknown = replica): CheckId[] =>
  verifyTrackFile(typeof copy === 'string' ? copy : JSON.stringify(copy) + '\n', replicaCopy).filter(r => !r.pass).map(r => r.id);

test('CHK-TEST-0001-01 the centerline is a closed lap of the 691 replica points: the last point links back to point 0 without repeating it', () => {
  // AC-US-0002-01
  assert.ok(n >= 3, `AC-US-0002-01: the centerline must have at least 3 points (${n})`);
  assert.equal(n, replicaPts.length, `AC-US-0002-01: the published line must keep the ${replicaPts.length} replica points (${n})`);
  const first = file.centerline[0], last = file.centerline[n - 1];
  assert.ok(first.xM !== last.xM || first.zM !== last.zM, 'AC-US-0002-01: the last point must not repeat point 0');
  const closing = Math.hypot(first.xM - last.xM, first.zM - last.zM);
  assert.ok(closing > 0 && closing < 2, `AC-US-0002-01: the closing segment from the last point to point 0 must be a short real segment (${closing.toFixed(3)} m)`);
});

test('CHK-TEST-0001-02 the lap length re-measured on the published points is within 690.7 m +/- 1 % and is the one the registry records', () => {
  // AC-US-0002-02
  const measured = d[n - 1] + Math.hypot(P(0).x - P(n - 1).x, P(0).z - P(n - 1).z);
  assert.ok(measured >= 683.793 && measured <= 697.607, `AC-US-0002-02: the measured lap ${measured.toFixed(3)} m must lie in [683.793, 697.607]`);
  assert.ok(near(measured, L, 1e-9), 'AC-US-0002-02: buildTrackGeometry must measure the same lap length as the file points');
  const entry = versionEntry();
  assert.ok(entry, 'AC-US-0002-02: the registry must carry the published version 2');
  assert.ok(near(measured, entry!.prep.lapLengthM, 0.001), `AC-US-0002-02: the registry lapLengthM ${entry!.prep.lapLengthM} must be the measured ${measured.toFixed(3)} m`);
  assert.ok(!('lapLengthM' in file), 'AC-US-0002-02: the lap length is measured, never a key of the file (V18)');
});

test('CHK-TEST-0001-03 the start line and the finish line are the transversal line at point 0, the start of the replica within 0.10 m, with the start just after it on the first segment', () => {
  // AC-US-0002-03, AC-US-0003-03 (and REQ-FEAT-0002-19, V01)
  const toR0 = Math.hypot(P(0).x - R0.x, P(0).z - R0.z);
  assert.ok(toR0 <= 0.10, `AC-US-0002-03: point 0 must be at most 0.10 m from point 0 of the replica (${toR0.toFixed(4)} m)`);
  assert.equal((replica.largada as { indice: number }).indice, 0, 'AC-US-0002-03: the replica starts at its own point 0');
  const finishM = crossingLapM(file.finishLine);
  assert.ok(finishM !== undefined, 'AC-US-0002-03: the finish line must cross the centerline exactly once, in the track sense');
  assert.ok(Math.min(finishM!, L - finishM!) <= 0.01, `AC-US-0002-03: the finish line must cross at point 0 (crossing at ${finishM!.toFixed(3)} m of the lap)`);
  const start = { x: file.startPosition.xM, z: file.startPosition.zM };
  const onFirst = closestOnSegment(P(0), P(1), start);
  assert.ok(onFirst.distanceM <= 0.002 && onFirst.t > 0 && onFirst.t < 1, `AC-US-0003-03: the start must sit on the segment from point 0 to point 1 (distance ${onFirst.distanceM.toFixed(4)} m, t ${onFirst.t.toFixed(3)})`);
  assert.ok(sideOf(file.finishLine, start) > 0, 'AC-US-0003-03: the start must be on the side after the finish line');
  const segmentHeading = Math.atan2(P(1).x - P(0).x, P(1).z - P(0).z) * 180 / Math.PI;
  assert.ok(near(file.startPosition.headingDeg, segmentHeading, 0.001), `AC-US-0003-03: the start heading ${file.startPosition.headingDeg} must be the heading of the first segment (${segmentHeading.toFixed(3)})`);
});

test('CHK-TEST-0001-04 the centerline in the game axes winds anticlockwise seen from above, like the replica, and the file declares COUNTER_CLOCKWISE', () => {
  // AC-US-0002-04
  const signedArea = (pts: Point[]) => { let s = 0; for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; s += a.x * (-b.z) - b.x * (-a.z); } return s / 2; };
  const published = signedArea(file.centerline.map(p => ({ x: p.xM, z: p.zM })));
  const source = signedArea(replicaPts);
  assert.ok(published > 0, `AC-US-0002-04: the signed area in the (east, north) plane must be positive, anticlockwise (${published.toFixed(1)} m2)`);
  assert.ok(source > 0, 'AC-US-0002-04: the replica converted by (x, -y) must wind the same way (not mirrored)');
  assert.ok(near(published, source, 0.01 * source), `AC-US-0002-04: the published area ${published.toFixed(1)} m2 must be the replica area ${source.toFixed(1)} m2 (same axes, same origin)`);
  assert.equal(file.direction, 'COUNTER_CLOCKWISE', 'AC-US-0002-04: the file must declare COUNTER_CLOCKWISE');
  assert.equal(replica.sentido, 'anti-horario', 'AC-US-0002-04: the replica declares anti-horario');
});

test('CHK-TEST-0001-05 every width is 7.0 m, the width of the replica', () => {
  // AC-US-0002-05
  const off = file.centerline.map((p, i) => [i, p.widthM] as const).filter(([, w]) => !near(w, 7.0, 0.0005));
  assert.deepEqual(off, [], `AC-US-0002-05: every point must have widthM 7.0 (${off.length} differ, first ${JSON.stringify(off[0])})`);
  assert.ok(replica.pontos.every(p => p[2] === 7), 'AC-US-0002-05: the replica declares 7 m at every point');
});

test('CHK-TEST-0001-06 no published point is farther than 0.10 m from the replica centerline in the game axes, and the registry records the largest offset', () => {
  // AC-US-0002-06
  let worst = 0, worstIndex = -1;
  for (let i = 0; i < n; i++) { const dist = distanceToReplica(P(i)); if (dist > worst) { worst = dist; worstIndex = i; } }
  assert.ok(worst <= 0.10, `AC-US-0002-06: point ${worstIndex} is ${worst.toFixed(4)} m from the replica centerline, above 0.10 m`);
  const entry = versionEntry();
  assert.equal(entry?.prep.method, 'REPLICA', 'AC-US-0002-06: the registry records the preparation from the replica');
  assert.ok(near(entry!.prep.maxReplicaOffsetM, worst, 0.001), `AC-US-0002-06: the registry maxReplicaOffsetM ${entry!.prep.maxReplicaOffsetM} must be the measured ${worst.toFixed(4)} m`);
});

test('CHK-TEST-0001-07 the asphalt edges never cross themselves nor each other, including at the tightest corner, radius 8.8 m near 216 m', () => {
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
  // The tightest corner: the smallest radius of the lap (circumradius over 3 points either side) is the 8.8 m arc of the replica.
  let minRadius = Infinity, minAt = 0;
  for (let i = 0; i < n; i++) { const r = circumradius(i); if (r < minRadius) { minRadius = r; minAt = d[i]; } }
  const arc = replica.elementos.find(e => e.raio_m === 8.8);
  assert.ok(arc && near(arc.de_m, 216, 0.5), 'AC-US-0002-07: the replica declares the 8.8 m arc from 216 m');
  assert.ok(near(minRadius, 8.8, 0.5), `AC-US-0002-07: the tightest radius must be about 8.8 m (${minRadius.toFixed(2)} m)`);
  assert.ok(minAt >= arc!.de_m && minAt <= arc!.de_m + arc!.comprimento_m, `AC-US-0002-07: the tightest corner must lie on the 8.8 m arc, ${arc!.de_m}-${(arc!.de_m + arc!.comprimento_m).toFixed(1)} m (${minAt.toFixed(1)} m)`);
});

test('CHK-TEST-0001-08 the lap has 4 sectors: exactly 3 internal limits, each crossed once in the track sense and in lap order', () => {
  // AC-US-0003-01
  assert.equal(file.sectorLimits.length, 3, `AC-US-0003-01: 3 sector limits give 4 sectors (${file.sectorLimits.length})`);
  const crossings = file.sectorLimits.map(crossingLapM);
  assert.ok(crossings.every(c => c !== undefined), 'AC-US-0003-01: every limit must cross the centerline exactly once, in the track sense');
  for (let i = 1; i < crossings.length; i++) assert.ok((crossings[i] as number) > (crossings[i - 1] as number), `AC-US-0003-01: limit ${i + 1} must come after limit ${i}`);
});

test('CHK-TEST-0001-09 each internal limit crosses the centerline at the point whose lap distance from point 0 is nearest to 204.9, 354.9 and 534.7 m', () => {
  // AC-US-0003-02
  [204.9, 354.9, 534.7].forEach((target, k) => {
    const best = nearestIndex(target);
    const crossing = crossingLapM(file.sectorLimits[k]);
    assert.ok(crossing !== undefined, `AC-US-0003-02: limit ${k + 1} must cross the centerline once`);
    assert.ok(near(crossing!, d[best], 0.01), `AC-US-0003-02: limit ${k + 1} crosses at ${crossing!.toFixed(3)} m, but point ${best}, nearest to ${target} m, lies at ${d[best].toFixed(3)} m`);
    assert.ok(Math.abs(d[best] - target) <= 1, `AC-US-0003-02: point ${best} must lie within the 1 m point spacing of ${target} m (${d[best].toFixed(3)} m)`);
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

test('CHK-TEST-0001-11 a barrier separates the 368.5-406.5 m and 594.5-624.5 m stretches wherever their asphalt edges are 6 m or less apart', () => {
  // AC-US-0004-01
  // Each asphalt edge of a stretch, alone, is sampled every 0.25 m of its own length plus its last point; each sample is paired
  // with the closest point of the other stretch's edges. A pair 6 m or closer must be separated by a barrier segment: crossed,
  // or touched within 0.002 m (the 0.001 m grid of the file).
  const edgeSegmentsOf = (indices: number[]) => [g.leftEdge, g.rightEdge].map(edge => { const segs: { a: Point; b: Point }[] = []; for (let k = 0; k + 1 < indices.length; k++) segs.push({ a: edge[indices[k]], b: edge[indices[k + 1]] }); return segs; });
  const samplesOf = (segs: { a: Point; b: Point }[]) => {
    const out: Point[] = [];
    for (const s of segs) { const len = Math.hypot(s.b.x - s.a.x, s.b.z - s.a.z); const c = Math.max(1, Math.ceil(len / 0.25)); for (let k = 0; k < c; k++) out.push({ x: s.a.x + (s.b.x - s.a.x) * k / c, z: s.a.z + (s.b.z - s.a.z) * k / c }); }
    if (segs.length) out.push(segs[segs.length - 1].b);
    return out;
  };
  const separated = (p: Point, q: Point) => g.barrierSegments.some(s => segmentsIntersect(p, q, s.a, s.b)
    || closestOnSegment(p, q, s.a).distanceM <= 0.002 || closestOnSegment(p, q, s.b).distanceM <= 0.002
    || closestOnSegment(s.a, s.b, p).distanceM <= 0.002 || closestOnSegment(s.a, s.b, q).distanceM <= 0.002);
  const sections = [edgeSegmentsOf(indicesOf(T1)), edgeSegmentsOf(indicesOf(T2))];
  assert.ok(sections.every(s => s[0].length > 25), 'AC-US-0004-01: both stretches must be sampled');
  assert.ok(g.barrierSegments.length > 0, 'AC-US-0004-01: the file must declare a barrier');
  let closePairs = 0;
  const unseparated: string[] = [];
  for (const [from, to] of [[0, 1], [1, 0]]) {
    const target = sections[to].flat();
    for (const edge of sections[from]) for (const p of samplesOf(edge)) {
      let best: Point | undefined, bestD = Infinity;
      for (const s of target) { const c = closestOnSegment(s.a, s.b, p); if (c.distanceM < bestD) { bestD = c.distanceM; best = c.point; } }
      if (!best || bestD > 6) continue;
      closePairs++;
      if (!separated(p, best)) unseparated.push(`(${p.x.toFixed(2)}, ${p.z.toFixed(2)}) ${bestD.toFixed(2)} m from the other stretch`);
    }
  }
  assert.ok(closePairs > 100, `AC-US-0004-01: the two stretches must come within 6 m of each other (${closePairs} close pairs)`);
  assert.deepEqual(unseparated, [], `AC-US-0004-01: ${unseparated.length} of ${closePairs} close pairs are not separated by a barrier: ${unseparated.slice(0, 3).join('; ')}`);
});

test('CHK-TEST-0001-12 no barrier stands where the grass between the two stretches exceeds 6 m', () => {
  // AC-US-0004-02
  const first = indicesOf(T1), second = indicesOf(T2);
  let worstSum = 0, points = 0;
  for (const s of g.barrierSegments) {
    const len = Math.hypot(s.b.x - s.a.x, s.b.z - s.a.z), c = Math.max(1, Math.ceil(len / 0.25));
    for (let k = 0; k <= c; k++) {
      const v = { x: s.a.x + (s.b.x - s.a.x) * k / c, z: s.a.z + (s.b.z - s.a.z) * k / c };
      worstSum = Math.max(worstSum, asphaltDistance(first, v) + asphaltDistance(second, v));
      points++;
    }
  }
  assert.ok(points > 200, `AC-US-0004-02: the barrier must be sampled along its length (${points} points)`);
  assert.ok(worstSum <= 6.002, `AC-US-0004-02: a barrier point stands where the asphalt-to-asphalt gap is ${worstSum.toFixed(3)} m, above 6 m`);
});

test('CHK-TEST-0001-13 no barrier point, vertex or sample, lies on the asphalt or the curb; every one is at least 0.2 m from the track edge', () => {
  // AC-US-0004-03, AC-US-0007-12
  let onTrack = 0, minClearance = Infinity, samples = 0;
  for (const s of g.barrierSegments) {
    const length = Math.hypot(s.b.x - s.a.x, s.b.z - s.a.z);
    const count = Math.max(1, Math.ceil(length / 0.05));
    for (let k = 0; k <= count; k++) {
      const p = { x: s.a.x + (s.b.x - s.a.x) * k / count, z: s.a.z + (s.b.z - s.a.z) * k / count };
      samples++;
      if (classifySurface(g, p) !== 'grass') onTrack++;
      let dist = Infinity;
      for (const q of g.asphaltQuads) dist = Math.min(dist, distanceToQuad(q, p));
      for (const q of g.curbQuads) dist = Math.min(dist, distanceToQuad(q, p));
      minClearance = Math.min(minClearance, dist);
    }
  }
  assert.ok(samples > 400, 'AC-US-0004-03: the barrier must be sampled along its length');
  assert.equal(onTrack, 0, `AC-US-0004-03: ${onTrack} barrier points lie on the asphalt or a curb`);
  assert.ok(minClearance >= 0.2 - 0.0005, `AC-US-0007-12: every barrier point must be at least 0.2 m from the track edge (clearance ${minClearance.toFixed(4)} m)`);
});

test('CHK-TEST-0001-14 there are 22 curb spans, the 22 of the replica, each starting before it ends', () => {
  // AC-US-0005-01
  assert.equal(replica.zebras.length, 22, `AC-US-0005-01: the replica declares 22 curbs (${replica.zebras.length})`);
  assert.equal(file.curbs.length, 22, `AC-US-0005-01: the file must declare 22 spans (${file.curbs.length})`);
  assert.ok(file.curbs.every(c => c.fromLapM < c.toLapM), 'AC-US-0005-01: each span starts before it ends');
});

test('CHK-TEST-0001-15 each span keeps the side and the lap stretch the replica declares for it, one to one in the replica order', () => {
  // AC-US-0005-02
  const side: Record<string, 'LEFT' | 'RIGHT'> = { esquerda: 'LEFT', direita: 'RIGHT' };
  const unmatched = replica.zebras.map((z, k) => [z, file.curbs[k]] as const)
    .filter(([z, c]) => !c || c.side !== side[z.lado] || !near(c.fromLapM, z.de_m, 0.0005) || !near(c.toLapM, z.ate_m, 0.0005))
    .map(([z, c]) => `${z.lado} ${z.de_m}-${z.ate_m} vs ${c ? `${c.side} ${c.fromLapM}-${c.toLapM}` : 'none'}`);
  assert.deepEqual(unmatched, [], `AC-US-0005-02: replica curbs without a matching span: ${unmatched.join('; ')}`);
  assert.ok(file.curbs.every(c => c.widthM > 0), 'AC-US-0005-02: every span must declare a positive width');
});

test('CHK-TEST-0001-16 the file carries exactly the declared keys and identity, trackVersion 2, and no record of the real track', () => {
  // AC-US-0006-09, NFR-0006
  assert.deepEqual(Object.keys(file), ['schemaVersion', 'trackId', 'trackVersion', 'osmDerived', 'direction', 'startPosition', 'finishLine', 'sectorLimits', 'markers', 'centerline', 'curbs', 'barriers'], 'NFR-0006: the keys must be the 12 of DM-0001 in order');
  assert.equal(file.schemaVersion, 3, 'NFR-0006: schemaVersion must be 3');
  assert.equal(file.trackId, 'kart-park', 'NFR-0006: trackId must be kart-park');
  assert.equal(file.trackVersion, 2, 'NFR-0006: the replica is published as trackVersion 2');
  assert.equal(file.osmDerived, true, 'NFR-0006: the file declares the OpenStreetMap derivation');
  const text = kartParkText();
  for (const forbidden of ['41,45', '41.45', '41450', 'recorde', 'record', 'KARTPLAN', 'oficial']) assert.ok(!text.includes(forbidden), `AC-US-0006-09: the published file must not carry "${forbidden}"`);
  assert.ok(text.endsWith('\n') && text.indexOf('\n') === text.length - 1, 'NFR-0006: the file is one line, newline terminated (DM-0001)');
});

test('CHK-TEST-0001-17 the published file is smaller than 200 000 bytes as delivered', () => {
  // NFR-0001
  const bytes = utf8Length(kartParkText());
  assert.ok(bytes < 200_000, `NFR-0001: the file must be under 200 000 bytes (${bytes})`);
  assert.ok(bytes > 10_000, `NFR-0001: the file must be the real track (${bytes} bytes)`);
  assert.equal(MAX_FILE_BYTES, 200_000, 'NFR-0001: the program applies the same limit');
});

test('CHK-TEST-0001-18 verifyTrackFile passes V01 to V20 on the published file against the replica, twice with the same result', () => {
  // AC-US-0002-01, AC-US-0002-02, AC-US-0002-03, AC-US-0002-04, AC-US-0002-05, AC-US-0002-06, AC-US-0002-07, AC-US-0003-01, AC-US-0003-02, AC-US-0003-03, AC-US-0003-04, AC-US-0003-12, AC-US-0004-01, AC-US-0004-02, AC-US-0004-03, AC-US-0005-01, AC-US-0005-02, AC-US-0005-13, NFR-0001, NFR-0006
  const results = verifyTrackFile(kartParkText(), replica);
  assert.equal(CHECK_IDS.length, 20, 'RULE-0002 2.0.0: V01 to V20');
  assert.deepEqual(results.map(r => r.id), [...CHECK_IDS], 'the 20 checks must run in order');
  const failed = results.filter(r => !r.pass).map(r => `${r.id}: ${r.detail}`);
  assert.deepEqual(failed, [], `V01-V20 must pass on the published file: ${failed.join('; ')}`);
  assert.deepEqual(verifyTrackFile(kartParkText(), replica), results, 'two runs of the verification must give the same results');
  assert.equal(readTrackData(kartParkText()).trackDataStatus, 'COMPLETE', 'the published file reads COMPLETE');
});

test('CHK-TEST-0001-19 every verification can fail: a copy with one deviation fails the check named after it and nothing else that is sound', () => {
  // AC-US-0002-03, AC-US-0002-05, AC-US-0002-06, AC-US-0003-02, AC-US-0003-04, AC-US-0003-12, AC-US-0004-03, AC-US-0005-02, AC-US-0005-13, AC-US-0006-09, NFR-0006
  const limitPoint = nearestIndex(204.9);
  // The transversal line of the marker nearest 222.5 m, inside the 8.8 m arc of the replica (216-229.1 m), taken out of the
  // markers (a line declared twice reads INCOMPLETE) and made the first limit.
  const arcMarker = file.markers.reduce((best, m, k) => Math.abs(crossingLapM(m)! - 222.5) < Math.abs(crossingLapM(file.markers[best])! - 222.5) ? k : best, 0);
  assert.ok(Math.abs(crossingLapM(file.markers[arcMarker])! - 222.5) < 6.6, 'fixture: a marker lies on the 8.8 m arc');
  const limitOnArc = withSectorLimitAt(0, { ...file.markers[arcMarker] });
  limitOnArc.markers = limitOnArc.markers.filter((_, k) => k !== arcMarker);
  const expectations: [string, KartParkFile | string, CheckId[]][] = [
    ['point 0 moved 0.2 m along its normal (V01)', withPointOffset(0, 0.2), ['V01']],
    ['point 400 moved 0.2 m along its normal (V07)', withPointOffset(400, 0.2), ['V07']],
    ['one width 6.9 m (V06)', withWidth(10, 6.9), ['V06']],
    ['one marker removed (V10)', withoutMarker(), ['V10']],
    ['a curb on the other side (V12)', withCurbOnOtherSide(), ['V12']],
    ['the last curb 0.0008 m past the lap length, across the start (V20)', withCurbPastLap(), ['V20']],
    ['the first sector limit moved onto the 8.8 m arc (V09)', limitOnArc, ['V09']],
    ['a barrier vertex on the asphalt (V15)', withBarrierVertexOnAsphalt(), ['V15']],
    ['a record field (V18)', withRecordField(), ['V18']],
    ['trackVersion 1 with the same content (V16)', withTrackVersion1(), ['V16']],
    ['another trackId (V16)', withOtherTrackId(), ['V16']],
    ['no barriers (V13, V14)', withoutBarriers(), ['V13', 'V14']],
    ['no curbs (V12)', withoutCurbs(), ['V12']],
  ];
  for (const [label, copy, ids] of expectations) {
    const failed = failedIds(copy);
    for (const id of ids) assert.ok(failed.includes(id), `${label}: ${id} must fail (failed: ${failed.join(',') || 'none'})`);
    assert.ok(failed.length < CHECK_IDS.length, `${label}: the copy must still be readable so that only the deviation fails`);
  }
  for (const [label, copy] of [['coordinates scaled by 1.02', withScaledCoordinates()], ['order reversed', withReversedCenterline()]] as const) {
    assert.ok(failedIds(copy).length > 0, `AC-US-0002-06: ${label} must fail a check`);
  }
  // V19 alone: the replica element holding the first limit retyped as an arc; the published file is unchanged.
  const arcReplica = replicaJson();
  const holding = arcReplica.elementos.find(e => e.tipo === 'reta' && e.de_m <= d[limitPoint] && d[limitPoint] <= e.de_m + e.comprimento_m);
  assert.ok(holding, 'AC-US-0003-12: the first limit point lies on a straight of the replica');
  holding!.tipo = 'esquerda';
  assert.deepEqual(failedIds(kartParkText(), arcReplica), ['V19'], 'AC-US-0003-12: a limit point off a straight fails V19 and nothing else');
  assert.equal(failedIds(withCurbPastLap(21, 5)).length, CHECK_IDS.length, 'AC-US-0005-13: a curb 5 m past the lap is refused by the reading and fails every check');
  assert.equal(failedIds(withSchema4()).length, CHECK_IDS.length, 'schemaVersion 4 fails every check');
  assert.equal(readTrackData(withShiftedCenterline()).trackDataStatus, 'INCOMPLETE', 'a centerline translated 0.4 m under its lines reads INCOMPLETE (C6) and verifies nothing');
  assert.equal(failedIds(withShiftedCenterline()).length, CHECK_IDS.length, 'a translated centerline fails every check');
  assert.equal(failedIds(corruptedText()).length, CHECK_IDS.length, 'a corrupted text fails every check');
  assert.deepEqual(failedIds(kartParkText(), { pontos: 'x' }).sort(), ['V01', 'V07', 'V12', 'V19'], 'an unreadable replica fails the checks that read it');
});

test('CHK-TEST-0001-20 the derived geometry of the file keeps every curb quad on its declared side and every lap distance inside the lap', () => {
  // AC-US-0005-02
  assert.equal(g.curbQuadSpan.length, g.curbQuads.length, 'AC-US-0005-02: every curb quad belongs to a span');
  g.curbQuads.forEach((q, k) => {
    const span = g.curbs[g.curbQuadSpan[k]];
    const centre = { x: (q[0].x + q[1].x + q[2].x + q[3].x) / 4, z: (q[0].z + q[1].z + q[2].z + q[3].z) / 4 };
    let best = 0, bestD = Infinity;
    for (let i = 0; i < n; i++) { const dist = Math.hypot(file.centerline[i].xM - centre.x, file.centerline[i].zM - centre.z); if (dist < bestD) { bestD = dist; best = i; } }
    const normal = g.normals[best];
    const leftward = (centre.x - file.centerline[best].xM) * normal.x + (centre.z - file.centerline[best].zM) * normal.z;
    assert.ok(span.side === 'LEFT' ? leftward > 0 : leftward < 0, `AC-US-0005-02: curb quad ${k} of the ${span.side} span ${span.fromLapM}-${span.toLapM} lies on the other side`);
    assert.ok(classifySurface(g, centre) === 'curb', `AC-US-0005-02: the centre of curb quad ${k} must classify as curb`);
  });
});

test('CHK-TEST-0001-21 each internal sector limit lies inside a straight element of the replica', () => {
  // AC-US-0003-12
  const straights = replica.elementos.filter(e => e.tipo === 'reta');
  assert.ok(straights.length > 5, `AC-US-0003-12: the replica declares its straights (${straights.length})`);
  file.sectorLimits.forEach((line, k) => {
    const at = crossingLapM(line);
    assert.ok(at !== undefined, `AC-US-0003-12: limit ${k + 1} must cross the centerline once`);
    const on = straights.find(e => e.de_m <= at! && at! <= e.de_m + e.comprimento_m);
    assert.ok(on, `AC-US-0003-12: limit ${k + 1} at ${at!.toFixed(3)} m must lie inside a "reta" element of the replica`);
    const r = circumradius(nearestIndex(at!));
    assert.ok(r > 50, `AC-US-0003-12: limit ${k + 1} lies where the published line runs straight (radius ${r.toFixed(1)} m)`);
  });
});

test('CHK-TEST-0001-22 no curb span crosses the start line: every span lies within 0 <= fromLapM < toLapM <= the lap length', () => {
  // AC-US-0005-13
  const bad = file.curbs.filter(c => !(c.fromLapM >= 0 && c.fromLapM < c.toLapM && c.toLapM <= L + 0.0005));
  assert.deepEqual(bad, [], `AC-US-0005-13: spans crossing the start line: ${JSON.stringify(bad)}`);
  // Nor does one curb run on across point 0 as two spans of the same side meeting there.
  const atEnd = file.curbs.filter(c => near(c.toLapM, L, 0.01)), atStart = file.curbs.filter(c => c.fromLapM === 0);
  assert.ok(!atEnd.some(e => atStart.some(s => s.side === e.side)), 'AC-US-0005-13: no curb runs on across the start line split in two');
});
