// TEST-0001 — steering response on the open test pad (testPadArea, 100 m) at 50 km/h held by the regulated throttle
// (strategy: steer-response, integration and contract, RULE-0002, API-0003 4.0.1, DES-0004).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { makeInput, judge, runBench, serialize, handlingBenchReport, THRESHOLDS, BENCH_PARAMETERS, type SteerResponseRecord } from '../scripts/handlingBench';
import { toMs } from '../src/lapTiming';
import { ARCADE, byId, FINITE, FIFTY_KMH_MPS, INTEGER, measures, MODES, near, options, printRecords } from './helpers/handling';

const records = { BINARY: runBench('STEER_RESPONSE', options('BINARY')), PROPORTIONAL: runBench('STEER_RESPONSE', options('PROPORTIONAL')) };
const side = (mode: keyof typeof records, steer: number) => byId<SteerResponseRecord>(records[mode], 'STEER_RESPONSE', r => (r as SteerResponseRecord).steerInputNorm === steer);
const FULL = [1, -1], PARTIAL = [0.5, -0.5];
const STEER_KEYS = ['benchEnvironment', 'setupId', 'setupVersion', 'inputMode', 'verdict', 'measuredAtUtc', 'baselineAvailable', 'benchId',
  'steerInputNorm', 'targetSpeedMps', 'speedHoldMode', 'speedHoldBandMps', 'speedMinMps', 'speedMaxMps', 'riseToNinetyPctMs', 'fallToTenPctMs',
  'settleWindowMs', 'steadyYawRateRadPerS', 'understeerStepCount', 'testAreaRadiusM', 'offAsphaltStepCount'].sort();
const speedHeld = (r: SteerResponseRecord) => r.speedMinMps >= r.targetSpeedMps - r.speedHoldBandMps && r.speedMaxMps <= r.targetSpeedMps + r.speedHoldBandMps;
// The verdict RULE-0002 gives from the two times and the speed band alone (AC-US-0001-05).
const ruleVerdict = (r: SteerResponseRecord) => !speedHeld(r) ? 'FAIL' : r.riseToNinetyPctMs <= THRESHOLDS.riseToNinetyPctMs && r.fallToTenPctMs <= THRESHOLDS.fallToTenPctMs ? 'PASS' : 'FAIL';

test('CHK-TEST-0001-01 the yaw rate reaches 90 % of its steady value within 180 ms of a full steer input at 50 km/h held, to either side', (t) => {
  // AC-US-0001-01
  for (const mode of MODES) for (const steer of FULL) {
    const r = side(mode, steer);
    assert.ok(speedHeld(r), `AC-US-0001-01: ${mode} steer ${steer}: the speed must stay within ${r.targetSpeedMps} ± ${r.speedHoldBandMps} m/s (observed ${r.speedMinMps}..${r.speedMaxMps})`);
    assert.ok(near(r.targetSpeedMps, FIFTY_KMH_MPS), `AC-US-0001-01: ${mode} steer ${steer}: the target speed must be 50 km/h`);
    assert.ok(r.riseToNinetyPctMs <= 180, `AC-US-0001-01: ${mode} steer ${steer}: riseToNinetyPctMs ${r.riseToNinetyPctMs} must be at most 180 ms`);
    assert.ok(r.steadyYawRateRadPerS > 0, `AC-US-0001-01: ${mode} steer ${steer}: the steady yaw rate must be positive in modulus`);
    assert.equal(r.verdict, 'PASS', `AC-US-0001-01: ${mode} steer ${steer}: the record must be PASS (${r.failReason ?? ''})`);
  }
  printRecords(t, [...records.BINARY, ...records.PROPORTIONAL]);
});

test('CHK-TEST-0001-02 the yaw rate falls to 10 % of its steady value within 250 ms of releasing a full steer input at 50 km/h held', () => {
  // AC-US-0001-02
  for (const mode of MODES) for (const steer of FULL) {
    const r = side(mode, steer);
    assert.ok(r.fallToTenPctMs <= 250, `AC-US-0001-02: ${mode} steer ${steer}: fallToTenPctMs ${r.fallToTenPctMs} must be at most 250 ms`);
    assert.ok(speedHeld(r), `AC-US-0001-02: ${mode} steer ${steer}: the speed must be held during the release`);
  }
});

test('CHK-TEST-0001-03 a partial tilt steer reaches 90 % of its own, smaller steady yaw rate within 180 ms at 50 km/h held', () => {
  // AC-US-0001-03
  for (const steer of PARTIAL) {
    const r = side('PROPORTIONAL', steer), full = side('PROPORTIONAL', Math.sign(steer));
    assert.ok(speedHeld(r), `AC-US-0001-03: steer ${steer}: the speed must stay within the band (observed ${r.speedMinMps}..${r.speedMaxMps})`);
    assert.ok(r.riseToNinetyPctMs <= 180, `AC-US-0001-03: steer ${steer}: riseToNinetyPctMs ${r.riseToNinetyPctMs} must be at most 180 ms`);
    assert.ok(r.steadyYawRateRadPerS > 0 && r.steadyYawRateRadPerS < full.steadyYawRateRadPerS, `AC-US-0001-03: steer ${steer}: the steady yaw rate ${r.steadyYawRateRadPerS} must be the regime of the partial steer, below the full one ${full.steadyYawRateRadPerS}`);
    assert.equal(r.verdict, 'PASS', `AC-US-0001-03: steer ${steer}: the record must be PASS (${r.failReason ?? ''})`);
  }
});

test('CHK-TEST-0001-04 releasing a partial tilt steer brings the yaw rate to 10 % of that regime within 250 ms at 50 km/h held', () => {
  // AC-US-0001-04
  for (const steer of PARTIAL) {
    const r = side('PROPORTIONAL', steer);
    assert.ok(r.fallToTenPctMs <= 250, `AC-US-0001-04: steer ${steer}: fallToTenPctMs ${r.fallToTenPctMs} must be at most 250 ms`);
  }
});

test('CHK-TEST-0001-05 the verdict depends only on the two measured times and the held speed, never on understeer steps', () => {
  // AC-US-0001-05
  for (const mode of MODES) for (const r of records[mode] as SteerResponseRecord[]) {
    assert.ok(INTEGER(r.understeerStepCount) && r.understeerStepCount >= 0, `AC-US-0001-05: understeerStepCount must be a non-negative integer`);
    assert.equal(r.verdict, ruleVerdict(r), `AC-US-0001-05: ${mode} steer ${r.steerInputNorm}: the verdict must equal the one recomputed from the times and the speed band alone`);
  }
  const base = side('BINARY', 1);
  const inside: SteerResponseRecord = { ...base, riseToNinetyPctMs: toMs(21), fallToTenPctMs: toMs(10), speedMinMps: base.targetSpeedMps - 0.1, speedMaxMps: base.targetSpeedMps + 0.1 };
  assert.equal(toMs(21), 175, 'AC-US-0001-05: 21 steps must be 175 ms');
  assert.equal(judge({ ...inside, understeerStepCount: 50 }).verdict, 'PASS', 'AC-US-0001-05: 50 understeer steps with the times inside the limits must still be PASS');
  assert.equal(judge({ ...inside, understeerStepCount: 0 }).verdict, 'PASS', 'AC-US-0001-05: 0 understeer steps with the times inside the limits must be PASS');
  assert.equal(judge({ ...inside, riseToNinetyPctMs: toMs(22) }).failReason, 'THRESHOLD_EXCEEDED', `AC-US-0001-05: a rise of 22 steps (${toMs(22)} ms) must be THRESHOLD_EXCEEDED`);
  assert.equal(judge({ ...inside, fallToTenPctMs: 251 }).failReason, 'THRESHOLD_EXCEEDED', 'AC-US-0001-05: a fall of 251 ms must be THRESHOLD_EXCEEDED');
});

test('CHK-TEST-0001-06 the output carries the steering-response record of API-0003 4.0.1 with its times, regime, speed range, settle window and the declared area, and leaving the area fails before any other reason', (t) => {
  // AC-US-0001-06
  for (const mode of MODES) for (const r of records[mode] as SteerResponseRecord[]) {
    assert.equal(r.benchId, 'STEER_RESPONSE', 'AC-US-0001-06: benchId');
    assert.equal(r.benchEnvironment, 'TEST_PAD', 'AC-US-0001-06: the steering response runs on the test pad');
    assert.equal(r.setupId, 'ARCADE_ASSISTIDO', 'AC-US-0001-06: setupId must be the Arcade assistido');
    assert.equal(r.setupVersion, ARCADE.setupVersion, 'AC-US-0001-06: setupVersion must be the published current version');
    assert.equal(r.inputMode, mode, 'AC-US-0001-06: inputMode must name the input form');
    for (const k of ['riseToNinetyPctMs', 'fallToTenPctMs', 'settleWindowMs'] as const) assert.ok(INTEGER(r[k]), `AC-US-0001-06: ${k} must be an integer number of ms`);
    for (const k of ['steadyYawRateRadPerS', 'speedMinMps', 'speedMaxMps', 'targetSpeedMps', 'speedHoldBandMps', 'steerInputNorm'] as const) assert.ok(FINITE(r[k]), `AC-US-0001-06: ${k} must be a finite number`);
    assert.equal(r.speedHoldMode, 'THROTTLE_REGULATED', 'AC-US-0001-06: the speed is held by the regulated throttle');
    assert.ok(!('throttleInputNorm' in r), 'AC-US-0001-06: throttleInputNorm is absent in THROTTLE_REGULATED');
    assert.equal(r.testAreaRadiusM, 100, 'AC-US-0001-06: testAreaRadiusM must be the 100 m area of the open pad (test strategy)');
    assert.equal(r.offAsphaltStepCount, 0, 'AC-US-0001-06: offAsphaltStepCount must be 0: the run stays inside the declared area');
    assert.ok(!('offAsphaltFirstStep' in r) && !('offAsphaltFirstXM' in r) && !('offAsphaltFirstZM' in r), 'AC-US-0001-06: no exit fields without an exit');
    assert.deepEqual(Object.keys(r).sort(), STEER_KEYS, `AC-US-0001-06: ${mode} steer ${r.steerInputNorm}: exactly the fields of API-0003 for STEER_RESPONSE plus those of the area, without throttleInputNorm`);
    assert.equal(r.settleWindowMs, BENCH_PARAMETERS.settleWindowMs, 'AC-US-0001-06: the settle window used for the regime must be the declared parameter');
    assert.ok(r.speedMinMps <= r.speedMaxMps, 'AC-US-0001-06: speedMinMps must not exceed speedMaxMps');
    assert.ok(r.verdict === 'PASS' ? !('failReason' in r) : typeof r.failReason === 'string', 'AC-US-0001-06: failReason only with FAIL');
  }
  const text = serialize(records.BINARY, BENCH_PARAMETERS);
  assert.match(text, /"benchId":"STEER_RESPONSE"/, 'AC-US-0001-06: the serialized output must contain the record');
  assert.match(text, /speedMinMps \d+(\.\d+)? km\/h/, 'AC-US-0001-06: the output must present the minimum speed in km/h');
  assert.match(text, /speedMaxMps \d+(\.\d+)? km\/h/, 'AC-US-0001-06: the output must present the maximum speed in km/h');
  assert.match(text, /riseToNinetyPctMs/, 'AC-US-0001-06: the output must name the rise time');
  const base = side('BINARY', 1);
  const notHeld = judge({ ...base, speedMaxMps: base.targetSpeedMps + 0.6 });
  assert.equal(notHeld.verdict, 'FAIL', 'AC-US-0001-06: a speed beyond the band must be FAIL');
  assert.equal(notHeld.failReason, 'SPEED_NOT_HELD', 'AC-US-0001-06: a speed beyond the band must be SPEED_NOT_HELD');
  assert.equal(judge({ ...base, speedMinMps: base.targetSpeedMps - 0.6 }).failReason, 'SPEED_NOT_HELD', 'AC-US-0001-06: a speed below the band must be SPEED_NOT_HELD');
  const exit = { offAsphaltStepCount: 1, offAsphaltFirstStep: 70, offAsphaltFirstXM: 99.9, offAsphaltFirstZM: 4.2 };
  const offArea = judge({ ...base, ...exit, speedMaxMps: base.targetSpeedMps + 0.6, riseToNinetyPctMs: 300 });
  assert.equal(offArea.verdict, 'FAIL', 'AC-US-0001-06: leaving the declared area must be FAIL');
  assert.equal(offArea.failReason, 'TEST_AREA_EXCEEDED', 'AC-US-0001-06: leaving the declared area must be TEST_AREA_EXCEEDED before SPEED_NOT_HELD or THRESHOLD_EXCEEDED');
  assert.deepEqual(handlingBenchReport(options('BINARY'), []), [], 'AC-US-0001-06: zero benches requested give zero records, never an implicit PASS');
  t.diagnostic(`STEER_RESPONSE records: ${records.BINARY.length} BINARY, ${records.PROPORTIONAL.length} PROPORTIONAL`);
});

test('CHK-TEST-0001-07 the keyboard and the tilt forms of the same full steer give the same measured response', () => {
  // NFR-0003
  for (const steer of FULL) {
    assert.deepEqual(measures(side('PROPORTIONAL', steer)), measures(side('BINARY', steer)), `NFR-0003: steer ${steer}: BINARY and PROPORTIONAL records must carry the same measures`);
    assert.equal(side('BINARY', steer).verdict, 'PASS', `NFR-0003: BINARY steer ${steer} must be PASS`);
    assert.equal(side('PROPORTIONAL', steer).verdict, 'PASS', `NFR-0003: PROPORTIONAL steer ${steer} must be PASS`);
  }
  assert.equal(records.BINARY.length, 2, 'NFR-0003: the keyboard form produces the two full sides only');
  assert.equal(records.PROPORTIONAL.length, 4, 'NFR-0003: the tilt form adds the two partial sides');
});

test('CHK-TEST-0001-08 the input forms saturate a steer beyond the range and the keyboard form is binary', () => {
  // AC-US-0001-01
  assert.deepEqual(makeInput('PROPORTIONAL', 1, 0, 1.7), { throttle: 1, brake: 0, steer: 1 }, 'AC-US-0001-01: a tilt steer beyond 1 must be saturated to 1');
  assert.deepEqual(makeInput('PROPORTIONAL', 1, 0, -3), { throttle: 1, brake: 0, steer: -1 }, 'AC-US-0001-01: a tilt steer beyond -1 must be saturated to -1');
  assert.deepEqual(makeInput('PROPORTIONAL', 0.3, 0.2, 0.5), { throttle: 0.3, brake: 0.2, steer: 0.5 }, 'AC-US-0001-01: the tilt form keeps a partial value');
  assert.deepEqual(makeInput('BINARY', 0.3, 0.2, 0.5), { throttle: 0, brake: 0, steer: 1 }, 'AC-US-0001-01: the keyboard form is binary: 0 or 1, and -1, 0 or 1');
  assert.deepEqual(makeInput('BINARY', 1, 1, -0.2), { throttle: 1, brake: 1, steer: -1 }, 'AC-US-0001-01: the keyboard form rounds to the key pressed');
  assert.deepEqual(makeInput('BINARY', 1, 0, 0, true), { throttle: 1, brake: 0, steer: 0, drift: true }, 'AC-US-0001-01: the drift flag is carried only when given');
});
