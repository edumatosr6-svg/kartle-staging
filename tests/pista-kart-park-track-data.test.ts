// TEST-0002 — the schema-3 reading of the Kart Park and the geometry derived from it, used as declared (strategy: track-data and
// geometry, unit and contract levels, API-0001, DES-0001, DES-0002, DM-0001).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SYNTHETIC_TRACK_FILE } from '../src/track';
import { checkConsistencyV3, readTrackData, TRACK_SCHEMA_VERSION, type TrackReading } from '../src/trackData';
import {
  beyondTrackEdgeM, buildTrackGeometry, classifySurface, lapMAtIndex, nearestOnCenterline, positionAtLapM, windingSumOf,
} from '../src/trackGeometry';
import {
  corruptedText, kartParkFile, kartParkGeometry, kartParkText, withInvalidCurbSide, withOnePointBarrier, withReversedCenterline, withScaledCoordinates,
  withSchema4, withTextOsmDerived, withTwoPointCenterline, withZeroWidth, withoutBarriers, withoutCenterline, withoutCurbs,
} from './fixtures/kartParkFiles';

const file = kartParkFile();
const g = kartParkGeometry();
const n = file.centerline.length;
const near = (a: number, b: number, tol: number) => Math.abs(a - b) <= tol;
type Complete = Extract<TrackReading, { trackDataStatus: 'COMPLETE' }>;
const complete = (source: Parameters<typeof readTrackData>[0]): Complete => {
  const r = readTrackData(source);
  if (r.trackDataStatus !== 'COMPLETE') throw new Error(`fixture: expected COMPLETE, got ${r.trackDataStatus}`);
  return r;
};

test('CHK-TEST-0002-01 the reading of the published file carries the centerline, the widths, the curbs and the barriers of the file, value for value', () => {
  // AC-US-0002-08
  const r = complete(kartParkText());
  assert.equal(r.trackId, 'kart-park', 'AC-US-0002-08: trackId');
  assert.equal(r.trackVersion, 1, 'AC-US-0002-08: trackVersion');
  assert.deepEqual(r.centerline, file.centerline, 'AC-US-0002-08: the centerline must be the one of the file, point by point, no smoothing and no conversion');
  assert.deepEqual(r.curbs, file.curbs, 'AC-US-0002-08: the curbs must be the ones of the file');
  assert.deepEqual(r.barriers, file.barriers, 'AC-US-0002-08: the barriers must be the ones of the file');
  assert.equal(r.osmDerived, true, 'AC-US-0002-08: osmDerived must be read');
  assert.deepEqual({ ...r.startPosition }, file.startPosition, 'AC-US-0002-08: the start position must be the one of the file');
  assert.deepEqual(r.finishLine, file.finishLine, 'AC-US-0002-08: the finish line must be the one of the file');
  assert.deepEqual(r.sectorLimits, file.sectorLimits, 'AC-US-0002-08: the sector limits must be the ones of the file');
  assert.deepEqual(r.markers, file.markers, 'AC-US-0002-08: the markers must be the ones of the file');
  assert.equal(r.direction, 'COUNTER_CLOCKWISE', 'AC-US-0002-08: the direction must be read');
  assert.ok(!('cutDistanceM' in r) && !('cutDurationMs' in r), 'AC-US-0002-08: the Kart Park declares no cut limits, so the defaults apply');
});

test('CHK-TEST-0002-02 the geometry is built from the declared points: edges at half width along the neighbour normal, cumulative lap distance from the points', () => {
  // AC-US-0002-08
  assert.deepEqual([...g.centerline], file.centerline, 'AC-US-0002-08: the geometry keeps the declared points');
  let worstEdge = 0, cumulative = 0;
  for (let i = 0; i < n; i++) {
    const prev = file.centerline[(i + n - 1) % n], next = file.centerline[(i + 1) % n], p = file.centerline[i];
    const dx = next.xM - prev.xM, dz = next.zM - prev.zM, l = Math.hypot(dx, dz);
    const normal = { x: dz / l, z: -dx / l };
    const left = { x: p.xM + normal.x * p.widthM / 2, z: p.zM + normal.z * p.widthM / 2 };
    const right = { x: p.xM - normal.x * p.widthM / 2, z: p.zM - normal.z * p.widthM / 2 };
    worstEdge = Math.max(worstEdge, Math.hypot(left.x - g.leftEdge[i].x, left.z - g.leftEdge[i].z), Math.hypot(right.x - g.rightEdge[i].x, right.z - g.rightEdge[i].z));
    assert.ok(near(g.cumulativeM[i], cumulative, 1e-9), `AC-US-0002-08: cumulative lap distance at point ${i}`);
    cumulative += Math.hypot(next.xM - p.xM, next.zM - p.zM);
  }
  assert.ok(worstEdge <= 1e-9, `AC-US-0002-08: the edges must be the declared width around the line (worst ${worstEdge.toExponential(1)} m)`);
  assert.ok(near(g.lapLengthM, cumulative, 1e-9), 'AC-US-0002-08: the lap length is the sum of the declared segments');
  assert.equal(g.asphaltQuads.length, n, 'AC-US-0002-08: one asphalt quad per segment');
});

test('CHK-TEST-0002-03 the synthetic file still reads COMPLETE in schema 2, without geometry fields, while the reader is at schema 3', () => {
  // NFR-0006, AC-US-0002-08
  const r = readTrackData(SYNTHETIC_TRACK_FILE);
  assert.equal(r.trackDataStatus, 'COMPLETE', 'NFR-0006: the synthetic file must read COMPLETE as before');
  assert.equal(SYNTHETIC_TRACK_FILE.schemaVersion, 2, 'NFR-0006: the synthetic track stays in schema 2');
  assert.equal(TRACK_SCHEMA_VERSION, 3, 'NFR-0006: the reader knows schema 3');
  assert.ok(!('centerline' in r) && !('curbs' in r) && !('barriers' in r), 'NFR-0006: a schema-2 reading carries no geometry field');
});

test('CHK-TEST-0002-04 a schema-3 copy without a usable centerline, or with a curb, barrier or osmDerived out of form, reads UNREADABLE and stays intact', () => {
  // AC-US-0002-08, NFR-0006
  const copies: [string, () => Parameters<typeof readTrackData>[0]][] = [
    ['no centerline', withoutCenterline], ['2-point centerline', withTwoPointCenterline], ['a width 0', withZeroWidth],
    ['an invalid curb side', withInvalidCurbSide], ['a 1-point barrier', withOnePointBarrier], ['osmDerived as text', withTextOsmDerived], ['corrupted text', corruptedText],
  ];
  for (const [label, make] of copies) {
    const copy = make();
    const before = JSON.stringify(copy);
    assert.equal(readTrackData(copy).trackDataStatus, 'UNREADABLE', `AC-US-0002-08: ${label} must read UNREADABLE`);
    assert.equal(JSON.stringify(copy), before, `NFR-0006: the reader must not touch the ${label} copy`);
  }
  const unsupported = readTrackData(withSchema4());
  assert.equal(unsupported.trackDataStatus, 'UNSUPPORTED_SCHEMA', 'AC-US-0002-08: schemaVersion 4 must be UNSUPPORTED_SCHEMA');
  assert.equal((unsupported as { schemaVersion?: number }).schemaVersion, 4, 'AC-US-0002-08: the unsupported version is reported');
  assert.equal(kartParkText(), kartParkText(), 'NFR-0006: the published text is read in place and unchanged');
});

test('CHK-TEST-0002-05 curbs and barriers are optional with a neutral default: without them the file is still COMPLETE and the geometry has no curb and no obstacle', () => {
  // AC-US-0002-08
  const noCurbs = complete(withoutCurbs());
  assert.deepEqual(noCurbs.curbs, [], 'AC-US-0002-08: no curbs declared reads an empty list');
  const gNoCurbs = buildTrackGeometry(noCurbs.centerline!, noCurbs.curbs!, noCurbs.barriers!);
  assert.equal(gNoCurbs.curbQuads.length, 0, 'AC-US-0002-08: no curb quad without curbs');
  const noBarriers = complete(withoutBarriers());
  assert.deepEqual(noBarriers.barriers, [], 'AC-US-0002-08: no barriers declared reads an empty list');
  assert.equal(buildTrackGeometry(noBarriers.centerline!, noBarriers.curbs!, noBarriers.barriers!).barrierSegments.length, 0, 'AC-US-0002-08: no obstacle segment without barriers');
  assert.deepEqual(checkConsistencyV3(complete(kartParkText()), g), [], 'AC-US-0002-08: the published file passes C1 to C7 of schema 3');
  assert.ok(g.curbQuads.length > 34 && g.barrierSegments.length === file.barriers.reduce((s, b) => s + b.points.length - 1, 0), 'AC-US-0002-08: the published geometry has the declared curbs and barrier segments');
});

test('CHK-TEST-0002-06 a reversed or rescaled centerline under the same lines reads INCOMPLETE, naming the consistency check that fails', () => {
  // AC-US-0002-04, AC-US-0002-08
  const reversed = readTrackData(withReversedCenterline());
  assert.equal(reversed.trackDataStatus, 'INCOMPLETE', 'AC-US-0002-04: a centerline in the other sense is INCOMPLETE');
  const rr = reversed as Complete;
  const failed = checkConsistencyV3(rr, buildTrackGeometry(rr.centerline!, rr.curbs!, rr.barriers!));
  assert.ok(failed.includes('C1'), `AC-US-0002-04: C1 (direction against the winding) must fail (${failed.join(',')})`);
  assert.ok(windingSumOf(rr.centerline!) > 0 && windingSumOf(file.centerline) < 0, 'AC-US-0002-04: the winding sum changes sign with the sense');
  assert.equal(readTrackData(withScaledCoordinates()).trackDataStatus, 'INCOMPLETE', 'AC-US-0002-08: a rescaled centerline no longer matches its lines');
});

test('CHK-TEST-0002-07 the surface rule of the file geometry: asphalt inside the edges, curb on the declared strip, grass beyond, with the edge distance 0 on asphalt and curb', () => {
  // AC-US-0005-04, AC-US-0005-02
  const span = g.curbs.find(c => c.toLapM - c.fromLapM > 20)!;
  const lapM = (span.fromLapM + span.toLapM) / 2;
  const at = positionAtLapM(g, lapM);
  const sign = span.side === 'LEFT' ? 1 : -1;
  const edge = span.side === 'LEFT' ? at.leftEdge : at.rightEdge;
  const outward = (m: number) => ({ x: edge.x + sign * at.normal.x * m, z: edge.z + sign * at.normal.z * m });
  assert.equal(classifySurface(g, at.center), 'asphalt', 'AC-US-0005-04: the centerline point is asphalt');
  assert.equal(classifySurface(g, outward(-0.2)), 'asphalt', 'AC-US-0005-04: 0.2 m inside the edge is asphalt');
  assert.equal(classifySurface(g, outward(0.5)), 'curb', 'AC-US-0005-04: 0.5 m outside the edge on the curb strip is curb');
  assert.equal(classifySurface(g, outward(span.widthM + 0.5)), 'grass', 'AC-US-0005-04: beyond the curb strip is grass');
  assert.equal(beyondTrackEdgeM(g, outward(0.5)), 0, 'AC-US-0005-04: the edge distance is 0 on the curb');
  assert.equal(beyondTrackEdgeM(g, outward(-0.2)), 0, 'AC-US-0005-04: the edge distance is 0 on the asphalt');
  const beyond = beyondTrackEdgeM(g, outward(span.widthM + 1));
  assert.ok(near(beyond, 1, 0.05), `AC-US-0005-04: 1 m past the curb strip is about 1 m beyond the track edge (${beyond.toFixed(3)} m)`);
  const plain = g.curbs.every(c => !(lapM + 100 > c.fromLapM - 2 && lapM + 100 < c.toLapM + 2)) ? lapM + 100 : lapM + 150;
  const atPlain = positionAtLapM(g, plain % g.lapLengthM);
  const pastEdge = { x: atPlain.leftEdge.x + atPlain.normal.x, z: atPlain.leftEdge.z + atPlain.normal.z };
  const other = g.curbs.find(c => c.side === 'LEFT' && (plain % g.lapLengthM) >= c.fromLapM - 1 && (plain % g.lapLengthM) <= c.toLapM + 1);
  if (!other) {
    assert.equal(classifySurface(g, pastEdge), 'grass', 'AC-US-0005-04: 1 m past the edge where no curb is declared is grass');
    assert.ok(near(beyondTrackEdgeM(g, pastEdge), 1, 0.05), 'AC-US-0005-04: the edge distance there is about 1 m');
  }
});

test('CHK-TEST-0002-08 lap distance and position are inverse of each other along the declared line', () => {
  // AC-US-0002-08
  for (let k = 0; k < 40; k++) {
    const lapM = (k * 17.3) % g.lapLengthM;
    const at = positionAtLapM(g, lapM);
    const nearest = nearestOnCenterline(g, at.center);
    const back = lapMAtIndex(g, nearest.index, nearest.fraction);
    assert.ok(near(back, lapM, 1e-6) || near(Math.abs(back - lapM), g.lapLengthM, 1e-6), `AC-US-0002-08: lap distance ${lapM.toFixed(3)} m round-trips to ${back.toFixed(3)} m`);
    assert.ok(nearest.distanceM <= 1e-9, 'AC-US-0002-08: the position lies on the line');
  }
});
