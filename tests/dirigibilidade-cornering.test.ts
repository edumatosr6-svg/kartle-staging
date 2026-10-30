// TEST-0002 — the curve on the open test pad: path radius 3 s after a full-throttle, full-steer start from 50 and from
// 70 km/h, and the half turn within 2 s with throttle 0 (strategy: cornering, integration and contract, RULE-0002,
// API-0003 4.0.1, DES-0004, DOMAIN/DEC-15, DOMAIN/DEC-16). Every threshold is judged on a trace the test drives itself
// through step/getHandlingTelemetry on testPadArea, then compared with the record of the bench library.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { STEP, testPadArea } from '../src/physics';
import { toMs } from '../src/lapTiming';
import {
  BENCH_PARAMETERS, judge, makeInput, runBench, serialize, straight,
  type BenchRecord, type CornerRadiusRecord, type CornerTurnRecord, type InputMode,
} from '../scripts/handlingBench';
import { ARCADE, byId, FIFTY_KMH_MPS, FINITE, INTEGER, measures, MODES, near, options, printRecords, trace, type Trace } from './helpers/handling';

const SEVENTY_KMH_MPS = 70 / 3.6;
const AREA = testPadArea(BENCH_PARAMETERS.testAreaRadiusM);
const steps = (ms: number) => Math.round(ms / 1000 / STEP);
const AT_3S = steps(3000), HALF_WINDOW = steps(BENCH_PARAMETERS.radiusWindowMs / 2), AT_2S = steps(2000);
const SIDES = [1, -1] as const;
const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

const radius = { BINARY: runBench('CORNER_RADIUS', options('BINARY')), PROPORTIONAL: runBench('CORNER_RADIUS', options('PROPORTIONAL')) };
const turn = { BINARY: runBench('CORNER_TURN', options('BINARY')), PROPORTIONAL: runBench('CORNER_TURN', options('PROPORTIONAL')) };
const radiusOf = (mode: InputMode, entry: number, side: number) => byId<CornerRadiusRecord>(radius[mode], 'CORNER_RADIUS',
  r => near((r as CornerRadiusRecord).entrySpeedMps, entry) && (r as CornerRadiusRecord).steerInputNorm === side);
const turnOf = (mode: InputMode, side: number) => byId<CornerTurnRecord>(turn[mode], 'CORNER_TURN', r => (r as CornerTurnRecord).steerInputNorm === side);

// The start of AC-US-0002-07/-08: straight at the entry speed, throttle 1 and full steer from the first step to the end of
// the radius window (step 372).
const radiusTrace = (mode: InputMode, entry: number, side: number): Trace => {
  const input = makeInput(mode, 1, 0, side);
  return trace(straight(entry), AREA, AT_3S + HALF_WINDOW, () => input);
};
// The start of AC-US-0002-09: straight at 50 km/h, throttle 0 and full steer for 2 s (240 steps).
const turnTrace = (mode: InputMode, side: number): Trace => {
  const input = makeInput(mode, 0, 0, side);
  return trace(straight(FIFTY_KMH_MPS), AREA, AT_2S, () => input);
};

// DES-0004 definition over positions: P_0 the start, P_j after step j; window steps 349 to 372; Θ the sum of the direction
// changes between consecutive displacements, L the sum of the mean displacement lengths; radius L / |Θ|.
function positionRadius(tr: Trace): number {
  const P = [{ x: 0, z: 0 }, ...tr.states.map(s => ({ x: s.x, z: s.z }))];
  let theta = 0, length = 0;
  for (let j = AT_3S - HALF_WINDOW + 2; j <= AT_3S + HALF_WINDOW; j++) {
    const d1 = { x: P[j - 1].x - P[j - 2].x, z: P[j - 1].z - P[j - 2].z }, d2 = { x: P[j].x - P[j - 1].x, z: P[j].z - P[j - 1].z };
    const l1 = Math.hypot(d1.x, d1.z), l2 = Math.hypot(d2.x, d2.z);
    if (l1 === 0 || l2 === 0) continue;
    theta += wrap(Math.atan2(d2.x, d2.z) - Math.atan2(d1.x, d1.z));
    length += (l1 + l2) / 2;
  }
  return length / Math.abs(theta);
}
// RULE-0002 definition read from the velocity instead of the positions: the mean speed over the window divided by the rate
// of change of the direction of the velocity vector. Independent of the bench code; agrees with it within a few percent.
function velocityRadius(tr: Trace): number {
  const window = tr.states.slice(AT_3S - HALF_WINDOW - 1, AT_3S + HALF_WINDOW);
  let change = 0;
  for (let i = 1; i < window.length; i++) change += wrap(Math.atan2(window[i].vx, window[i].vz) - Math.atan2(window[i - 1].vx, window[i - 1].vz));
  const meanSpeed = window.reduce((a, s) => a + Math.hypot(s.vx, s.vz), 0) / window.length;
  return meanSpeed / (Math.abs(change) / ((window.length - 1) * STEP));
}
// The accumulated turn of the kart, step by step, unwrapped: never read from the bench.
function turnProfile(tr: Trace): number[] {
  const out: number[] = [];
  let previous = 0, total = 0;
  for (const s of tr.states) { total += wrap(s.heading - previous); previous = s.heading; out.push(total); }
  return out;
}

function checkRadius(entry: number, criterion: string): void {
  for (const mode of MODES) for (const side of SIDES) {
    const tr = radiusTrace(mode, entry, side), r = radiusOf(mode, entry, side);
    assert.equal(tr.telemetry.length, AT_3S + HALF_WINDOW, `${criterion}: ${mode} side ${side}: the start must be driven to the end of the radius window`);
    assert.ok(tr.telemetry.every(t => t.surface === 'ASPHALT'), `${criterion}: ${mode} side ${side}: the kart must stay inside the declared area of ${BENCH_PARAMETERS.testAreaRadiusM} m`);
    assert.ok(tr.telemetry.every(t => t.speedMps > 0), `${criterion}: ${mode} side ${side}: the kart must not stop before 3 s`);
    const measured = velocityRadius(tr);
    assert.ok(measured <= 13, `${criterion}: ${mode} side ${side}: the path radius 3 s after the start, measured from the velocity, is ${measured.toFixed(3)} m and must be at most 13 m`);
    const byPositions = positionRadius(tr);
    assert.ok(byPositions <= 13, `${criterion}: ${mode} side ${side}: the path radius over the positions of steps 349-372 is ${byPositions.toFixed(3)} m and must be at most 13 m`);
    assert.ok(Math.abs(byPositions - measured) <= 0.05 * measured, `${criterion}: ${mode} side ${side}: the two readings of the radius must agree within 5 % (${byPositions} vs ${measured})`);
    assert.ok(near(r.pathRadiusAt3sM ?? NaN, byPositions, 1e-9), `${criterion}: ${mode} side ${side}: pathRadiusAt3sM ${r.pathRadiusAt3sM} must be the radius recomputed over the trace positions (${byPositions})`);
    assert.equal(r.offAsphaltStepCount, 0, `${criterion}: ${mode} side ${side}: no step off the declared area`);
    assert.equal(r.verdict, 'PASS', `${criterion}: ${mode} side ${side}: CORNER_RADIUS must be PASS (${r.failReason ?? ''})`);
    // The handling state never enters the verdict (REQ-FEAT-0002-14).
    for (const handlingAt3s of ['grip', 'understeer', 'oversteer', 'sliding'] as const) {
      assert.equal(judge({ ...r, handlingAt3s }).verdict, r.verdict, `${criterion}: ${mode} side ${side}: handlingAt3s ${handlingAt3s} must not change the verdict`);
    }
  }
  const base = radiusOf('BINARY', entry, 1);
  assert.equal(judge({ ...base, pathRadiusAt3sM: 13.0 }).verdict, 'PASS', `${criterion}: exactly 13.0 m must be PASS`);
  assert.equal(judge({ ...base, pathRadiusAt3sM: 13.01 }).failReason, 'THRESHOLD_EXCEEDED', `${criterion}: 13.01 m must be THRESHOLD_EXCEEDED`);
}

test('CHK-TEST-0002-09 from 50 km/h with full throttle and full steer held, the path radius 3 s after the start is at most 13 m, to either side, in both input forms', (t) => {
  // AC-US-0002-07
  checkRadius(FIFTY_KMH_MPS, 'AC-US-0002-07');
  printRecords(t, radius.BINARY.filter(r => near((r as CornerRadiusRecord).entrySpeedMps, FIFTY_KMH_MPS)));
});

test('CHK-TEST-0002-10 from 70 km/h with full throttle and full steer held, the path radius 3 s after the start is at most 13 m: the kart sheds speed instead of opening the line', (t) => {
  // AC-US-0002-08
  checkRadius(SEVENTY_KMH_MPS, 'AC-US-0002-08');
  for (const mode of MODES) for (const side of SIDES) {
    const tr = radiusTrace(mode, SEVENTY_KMH_MPS, side);
    assert.ok(tr.states[AT_3S - 1].speed < SEVENTY_KMH_MPS, `AC-US-0002-08: ${mode} side ${side}: the speed 3 s after the start (${tr.states[AT_3S - 1].speed} m/s) must be below the 70 km/h of the start`);
  }
  printRecords(t, radius.BINARY.filter(r => near((r as CornerRadiusRecord).entrySpeedMps, SEVENTY_KMH_MPS)));
});

test('CHK-TEST-0002-11 from 50 km/h with throttle 0 and full steer held, the kart turns at least 180° within 2 s of the start, to either side', (t) => {
  // AC-US-0002-09
  for (const mode of MODES) for (const side of SIDES) {
    const tr = turnTrace(mode, side), r = turnOf(mode, side), profile = turnProfile(tr);
    assert.ok(tr.telemetry.every(x => x.surface === 'ASPHALT' && x.speedMps > 0), `AC-US-0002-09: ${mode} side ${side}: the kart must stay moving inside the declared area`);
    const half = profile.findIndex(a => Math.abs(a) >= Math.PI);
    assert.ok(half >= 0, `AC-US-0002-09: ${mode} side ${side}: the kart must turn 180° within 2 s (reached ${(Math.abs(profile[profile.length - 1]) * 180 / Math.PI).toFixed(1)}°)`);
    assert.ok(toMs(half + 1) <= 2000, `AC-US-0002-09: ${mode} side ${side}: 180° reached at ${toMs(half + 1)} ms must be within 2000 ms`);
    assert.equal(r.halfTurnReachedMs, toMs(half + 1), `AC-US-0002-09: ${mode} side ${side}: halfTurnReachedMs must be the first step of the trace with a turn of at least π rad`);
    assert.ok(near(r.turnAt2sRad, Math.abs(profile[AT_2S - 1]), 1e-9), `AC-US-0002-09: ${mode} side ${side}: turnAt2sRad ${r.turnAt2sRad} must be the turn at step 240 of the trace (${Math.abs(profile[AT_2S - 1])})`);
    assert.ok(near(r.speedAt2sMps, tr.states[AT_2S - 1].speed, 1e-9), `AC-US-0002-09: ${mode} side ${side}: speedAt2sMps must be the speed at step 240`);
    assert.equal(r.verdict, 'PASS', `AC-US-0002-09: ${mode} side ${side}: CORNER_TURN must be PASS (${r.failReason ?? ''})`);
  }
  for (const mode of MODES) {
    const left = turnProfile(turnTrace(mode, 1)), right = turnProfile(turnTrace(mode, -1));
    assert.equal(Math.sign(left[AT_2S - 1]), -Math.sign(right[AT_2S - 1]), `AC-US-0002-09: ${mode}: the two sides must turn the kart in opposite directions`);
  }
  const base = turnOf('BINARY', 1);
  assert.equal(judge({ ...base, halfTurnReachedMs: 2000 }).verdict, 'PASS', 'AC-US-0002-09: 180° at exactly 2000 ms must be PASS');
  assert.equal(judge({ ...base, halfTurnReachedMs: 2009 }).failReason, 'THRESHOLD_EXCEEDED', 'AC-US-0002-09: 180° at 2009 ms must be THRESHOLD_EXCEEDED');
  const short = { ...base, turnAt2sRad: 3.0 } as CornerTurnRecord;
  delete short.halfTurnReachedMs;
  assert.equal(judge(short).failReason, 'THRESHOLD_EXCEEDED', 'AC-US-0002-09: a turn of 3.0 rad (under 180°) at 2 s must be THRESHOLD_EXCEEDED');
  assert.equal(judge({ ...short, stoppedAtStep: 200, speedAt2sMps: 0 }).failReason, 'THRESHOLD_EXCEEDED', 'AC-US-0002-09: a kart stopped at step 200 with 3.0 rad must be THRESHOLD_EXCEEDED');
  printRecords(t, [...turn.BINARY, ...turn.PROPORTIONAL]);
});

test('CHK-TEST-0002-06 the output carries, per input form, four CORNER_RADIUS and two CORNER_TURN records of API-0003 4.0.1 with the area fields, the speeds in km/h and the turn in degrees, and no retired corner bench', () => {
  // AC-US-0002-05
  const RADIUS_KEYS = ['benchEnvironment', 'setupId', 'setupVersion', 'inputMode', 'verdict', 'measuredAtUtc', 'baselineAvailable', 'benchId',
    'steerInputNorm', 'entrySpeedMps', 'radiusWindowMs', 'pathRadiusAt3sM', 'speedAt3sMps', 'handlingAt3s', 'testAreaRadiusM', 'offAsphaltStepCount'].sort();
  const TURN_KEYS = ['benchEnvironment', 'setupId', 'setupVersion', 'inputMode', 'verdict', 'measuredAtUtc', 'baselineAvailable', 'benchId',
    'steerInputNorm', 'entrySpeedMps', 'turnAt2sRad', 'halfTurnReachedMs', 'speedAt2sMps', 'testAreaRadiusM', 'offAsphaltStepCount'].sort();
  for (const mode of MODES) {
    assert.equal(radius[mode].length, 4, `AC-US-0002-05: ${mode}: four CORNER_RADIUS records (two start speeds × two sides)`);
    assert.equal(turn[mode].length, 2, `AC-US-0002-05: ${mode}: two CORNER_TURN records (two sides)`);
    for (const entry of [FIFTY_KMH_MPS, SEVENTY_KMH_MPS]) for (const side of SIDES) {
      const r = radiusOf(mode, entry, side), tr = radiusTrace(mode, entry, side);
      assert.deepEqual(Object.keys(r).sort(), RADIUS_KEYS, `AC-US-0002-05: ${mode} ${entry} side ${side}: CORNER_RADIUS must carry exactly the fields of API-0003 for a run that did not stop`);
      assert.equal(r.benchEnvironment, 'TEST_PAD', `AC-US-0002-05: ${mode}: CORNER_RADIUS runs on the open test pad`);
      assert.equal(r.radiusWindowMs, 200, `AC-US-0002-05: ${mode}: radiusWindowMs must be 200`);
      assert.equal(r.testAreaRadiusM, 100, `AC-US-0002-05: ${mode}: testAreaRadiusM must be the 100 m area of the open pad (test strategy)`);
      assert.ok(near(r.speedAt3sMps, tr.states[AT_3S - 1].speed, 1e-9), `AC-US-0002-05: ${mode} ${entry} side ${side}: speedAt3sMps must be the speed at step 360 of the trace`);
      assert.equal(r.handlingAt3s, tr.telemetry[AT_3S - 1].handling, `AC-US-0002-05: ${mode} ${entry} side ${side}: handlingAt3s must be the handling at step 360 of the trace`);
      assert.equal(r.setupVersion, ARCADE.setupVersion, `AC-US-0002-05: ${mode}: setupVersion must be the published one`);
    }
    for (const side of SIDES) {
      const r = turnOf(mode, side);
      assert.deepEqual(Object.keys(r).sort(), TURN_KEYS, `AC-US-0002-05: ${mode} side ${side}: CORNER_TURN must carry exactly the fields of API-0003 for a run that did not stop`);
      assert.ok(near(r.entrySpeedMps, FIFTY_KMH_MPS) && INTEGER(r.halfTurnReachedMs) && FINITE(r.turnAt2sRad), `AC-US-0002-05: ${mode} side ${side}: entry speed, half-turn instant and turn must be present`);
    }
  }
  const all: BenchRecord[] = [...radius.BINARY, ...turn.BINARY];
  assert.ok(!all.some(r => ['REFERENCE_CORNER', 'UNDERSTEER_ONSET'].includes(r.benchId as string)), 'AC-US-0002-05: no retired corner bench may appear in the output');
  const text = serialize(all, BENCH_PARAMETERS);
  assert.match(text, /entrySpeedMps 50 km\/h/, 'AC-US-0002-05: the 50 km/h start must be presented in km/h');
  assert.match(text, /entrySpeedMps 70 km\/h/, 'AC-US-0002-05: the 70 km/h start must be presented in km/h');
  assert.match(text, /speedAt3sMps \d+(\.\d+)? km\/h/, 'AC-US-0002-05: the speed at 3 s must be presented in km/h');
  assert.match(text, /"pathRadiusAt3sM":\d+(\.\d+)?/, 'AC-US-0002-05: the path radius must be in the record, in m');
  assert.match(text, /turnAt2sRad \d+(\.\d)?°/, 'AC-US-0002-05: the turn at 2 s must be presented in degrees');
  assert.match(text, /speedAt2sMps \d+(\.\d+)? km\/h/, 'AC-US-0002-05: the speed at 2 s must be presented in km/h');
  assert.match(text, /"halfTurnReachedMs":\d+/, 'AC-US-0002-05: the instant of the half turn must be in the record, in ms');
  const base = radiusOf('BINARY', FIFTY_KMH_MPS, 1);
  const stopped = { ...base, stoppedAtStep: 300, speedAt3sMps: 0 } as CornerRadiusRecord;
  delete stopped.pathRadiusAt3sM;
  assert.equal(judge(stopped).failReason, 'MEASUREMENT_MISSING', 'AC-US-0002-05: a CORNER_RADIUS stopped before 3 s has no radius and is MEASUREMENT_MISSING');
  const exit = { offAsphaltStepCount: 1, offAsphaltFirstStep: 200, offAsphaltFirstXM: 100.2, offAsphaltFirstZM: 0 };
  assert.equal(judge({ ...base, ...exit }).failReason, 'TEST_AREA_EXCEEDED', 'AC-US-0002-05: a CORNER_RADIUS that left the area is TEST_AREA_EXCEEDED');
  assert.equal(judge({ ...turnOf('BINARY', 1), ...exit }).failReason, 'TEST_AREA_EXCEEDED', 'AC-US-0002-05: a CORNER_TURN that left the area is TEST_AREA_EXCEEDED');
});

test('CHK-TEST-0002-08 the keyboard and the tilt forms give the same radius and the same turn, both passing', () => {
  // NFR-0003
  for (const entry of [FIFTY_KMH_MPS, SEVENTY_KMH_MPS]) for (const side of SIDES) {
    assert.deepEqual(measures(radiusOf('PROPORTIONAL', entry, side)), measures(radiusOf('BINARY', entry, side)), `NFR-0003: CORNER_RADIUS ${entry} side ${side}: BINARY and PROPORTIONAL must carry the same measures`);
  }
  for (const side of SIDES) assert.deepEqual(measures(turnOf('PROPORTIONAL', side)), measures(turnOf('BINARY', side)), `NFR-0003: CORNER_TURN side ${side}: BINARY and PROPORTIONAL must carry the same measures`);
  for (const mode of MODES) for (const r of [...radius[mode], ...turn[mode]]) assert.equal(r.verdict, 'PASS', `NFR-0003: ${mode} ${r.benchId} must be PASS`);
  for (const mode of MODES) {
    assert.deepEqual(makeInput(mode, 1, 0, 1), { throttle: 1, brake: 0, steer: 1 }, `NFR-0003: ${mode}: full throttle and full steer are the same Input in both forms`);
    assert.deepEqual(makeInput(mode, 0, 0, -1), { throttle: 0, brake: 0, steer: -1 }, `NFR-0003: ${mode}: throttle 0 and full steer are the same Input in both forms`);
  }
});
