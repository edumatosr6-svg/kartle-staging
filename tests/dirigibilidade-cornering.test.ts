// TEST-0002 — the reference corner (18 m arc of the test pad at 50 km/h) and the understeer-onset sweep
// (strategy: cornering, integration and unit by judge, RULE-0002, API-0003, DES-0004, DOMAIN/DEC-11..14).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { testPadArc, WIDTH } from '../src/physics';
import { toMs } from '../src/lapTiming';
import {
  arcEntry, BENCH_PARAMETERS, diagnosticsOf, judge, makeInput, readBaseline, runBench, serialize, THRESHOLDS,
  type ReferenceCornerRecord, type ThrottleCondition, type UndersteerOnsetRecord,
} from '../scripts/handlingBench';
import { baselineMarkdown, type BaselineVariant } from './fixtures/records';
import { ARCADE, byId, FIFTY_KMH_MPS, FINITE, firstGrassIndex, INTEGER, measures, MODES, near, options, printRecords, trace, type Trace } from './helpers/handling';

const ARC = testPadArc(BENCH_PARAMETERS.arcRadiusM, BENCH_PARAMETERS.laneWidthM);
const WINDOW_STEPS = Math.round(BENCH_PARAMETERS.cornerWindowMs / 1000 / (1 / 120));
const corner = { BINARY: runBench('REFERENCE_CORNER', options('BINARY')), PROPORTIONAL: runBench('REFERENCE_CORNER', options('PROPORTIONAL')) };
const onset = { BINARY: runBench('UNDERSTEER_ONSET', options('BINARY')), PROPORTIONAL: runBench('UNDERSTEER_ONSET', options('PROPORTIONAL')) };
const cornerOf = (mode: keyof typeof corner, c: ThrottleCondition) => byId<ReferenceCornerRecord>(corner[mode], 'REFERENCE_CORNER', r => (r as ReferenceCornerRecord).throttleCondition === c);
const onsetOf = (mode: keyof typeof onset) => byId<UndersteerOnsetRecord>(onset[mode], 'UNDERSTEER_ONSET');
const understeer = (t: { handling: string }) => t.handling === 'understeer';

// The reference corner replayed through the public simulation: steer +1 held, throttle 0 or 1 held, the whole window
// with throttle 0 and up to the first grass step with full throttle (the bench measures nothing off the asphalt there).
function cornerTrace(mode: 'BINARY' | 'PROPORTIONAL', c: ThrottleCondition): Trace {
  const input = makeInput(mode, c === 'THROTTLE_FULL' ? 1 : 0, 0, 1);
  return trace(arcEntry(FIFTY_KMH_MPS), ARC, WINDOW_STEPS, () => input, c === 'THROTTLE_FULL' ? t => t.surface === 'GRASS' : undefined);
}
const windowEnd = (tr: Trace) => { const g = firstGrassIndex(tr.telemetry); return g < 0 ? tr.telemetry.length : g; };
const diagnostic = (r: UndersteerOnsetRecord, key: string): number => {
  const hit = diagnosticsOf(r).find(d => d.startsWith(`${key} `));
  if (!hit) throw new Error(`fixture: diagnostic ${key} not present`);
  return Number(hit.slice(key.length + 1).split(' ')[0]);
};
const exitSpeedOf = (r: UndersteerOnsetRecord) => diagnostic(r, 'exitSpeedMps');
const interruptedPlateauOf = (r: UndersteerOnsetRecord) => diagnostic(r, 'interruptedPlateauSpeedMps');
const baselineOf = (variant: BaselineVariant) => readBaseline(baselineMarkdown(variant), ARCADE.setupId, ARCADE.previousSetupVersion ?? '');
const longestRunMs = (tr: Trace, until: number) => {
  let run = 0, max = 0;
  for (let i = 0; i < until; i++) { run = understeer(tr.telemetry[i]) ? run + 1 : 0; max = Math.max(max, run); }
  return toMs(max);
};

test('CHK-TEST-0002-01 at 50 km/h on the 18 m arc with full steer, understeer never lasts more than 200 ms consecutive, measured on the asphalt up to the first lane exit with throttle 0 and over the whole arc with full throttle', (t) => {
  // AC-US-0002-01
  for (const mode of MODES) {
    for (const c of ['THROTTLE_ZERO', 'THROTTLE_FULL'] as const) {
      const r = cornerOf(mode, c), tr = cornerTrace(mode, c);
      assert.ok(r.maxUndersteerMs <= 200, `AC-US-0002-01: ${mode} ${c}: maxUndersteerMs ${r.maxUndersteerMs} must be at most 200 ms`);
      assert.equal(r.verdict, 'PASS', `AC-US-0002-01: ${mode} ${c}: the record must be PASS (${r.failReason ?? ''})`);
      const expected = longestRunMs(tr, windowEnd(tr));
      assert.equal(r.maxUndersteerMs, expected, `AC-US-0002-01: ${mode} ${c}: maxUndersteerMs must be the longest understeer run over the asphalt steps before the first lane exit (${expected} ms)`);
      if (c === 'THROTTLE_ZERO') {
        assert.equal(tr.telemetry.length, WINDOW_STEPS, 'AC-US-0002-01: with throttle 0 the whole window is run wherever the kart is');
        const whole = longestRunMs(tr, tr.telemetry.length);
        assert.ok(whole >= r.maxUndersteerMs, 'AC-US-0002-01: the run over the whole trace, grass included, is never below the measured one');
        if (firstGrassIndex(tr.telemetry) >= 0) assert.ok(whole >= expected, 'AC-US-0002-01: grass steps after the exit never shorten the measured run');
      } else {
        assert.equal(r.maxUndersteerMs, longestRunMs(tr, tr.telemetry.length - (firstGrassIndex(tr.telemetry) >= 0 ? 1 : 0)), 'AC-US-0002-01: with full throttle the run covers every asphalt step of the arc');
      }
    }
  }
  const zero = cornerOf('BINARY', 'THROTTLE_ZERO');
  assert.equal(judge({ ...zero, maxUndersteerMs: 204 }).failReason, 'THRESHOLD_EXCEEDED', 'AC-US-0002-01: 204 ms of understeer with throttle 0 must be THRESHOLD_EXCEEDED');
  assert.equal(judge({ ...zero, maxUndersteerMs: 200 }).verdict, 'PASS', 'AC-US-0002-01: exactly 200 ms with throttle 0 must be PASS');
  printRecords(t, [...corner.BINARY, ...corner.PROPORTIONAL]);
});

test('CHK-TEST-0002-02 with full throttle the kart stays on the asphalt of the arc at every step, and a lane exit under throttle 0 is reported without failing', () => {
  // AC-US-0002-02
  for (const mode of MODES) {
    const full = cornerOf(mode, 'THROTTLE_FULL'), fullTrace = cornerTrace(mode, 'THROTTLE_FULL');
    assert.equal(full.offAsphaltStepCount, 0, `AC-US-0002-02: ${mode}: offAsphaltStepCount must be 0 with full throttle`);
    assert.ok(!('offAsphaltFirstStep' in full) && !('offAsphaltFirstXM' in full), `AC-US-0002-02: ${mode}: no exit fields without an exit`);
    assert.equal(fullTrace.telemetry.length, WINDOW_STEPS, `AC-US-0002-02: ${mode}: the full-throttle run must last the whole arc window`);
    assert.ok(fullTrace.telemetry.every(x => x.surface === 'ASPHALT'), `AC-US-0002-02: ${mode}: every step of the full-throttle arc must be on the asphalt`);
    const zero = cornerOf(mode, 'THROTTLE_ZERO'), zeroTrace = cornerTrace(mode, 'THROTTLE_ZERO');
    const grass = zeroTrace.telemetry.filter(x => x.surface === 'GRASS').length;
    assert.equal(zero.offAsphaltStepCount, grass, `AC-US-0002-02: ${mode}: offAsphaltStepCount with throttle 0 must count the grass steps of the window`);
    if (grass > 0) {
      const i = firstGrassIndex(zeroTrace.telemetry);
      assert.equal(zero.offAsphaltFirstStep, zeroTrace.telemetry[i].simStepCount, `AC-US-0002-02: ${mode}: offAsphaltFirstStep must be the first grass step`);
      assert.ok(near(zero.offAsphaltFirstXM ?? NaN, zeroTrace.states[i].x) && near(zero.offAsphaltFirstZM ?? NaN, zeroTrace.states[i].z), `AC-US-0002-02: ${mode}: the exit position must be the kart position at that step`);
      assert.equal(ARC.surfaceAt({ x: zero.offAsphaltFirstXM ?? 0, z: zero.offAsphaltFirstZM ?? 0 }), 'grass', `AC-US-0002-02: ${mode}: the reported exit position must lie off the lane`);
      assert.equal(zero.verdict, 'PASS', `AC-US-0002-02: ${mode}: the exit under throttle 0 must not fail the record`);
    }
  }
  const full = cornerOf('BINARY', 'THROTTLE_FULL'), zero = cornerOf('BINARY', 'THROTTLE_ZERO');
  const exit = { offAsphaltStepCount: 1, offAsphaltFirstStep: 120, offAsphaltFirstXM: 24.6, offAsphaltFirstZM: 3.1 };
  const fullOff = judge({ ...full, ...exit });
  assert.equal(fullOff.verdict, 'FAIL', 'AC-US-0002-02: one step off the lane with full throttle must be FAIL');
  assert.equal(fullOff.failReason, 'OFF_ASPHALT', 'AC-US-0002-02: one step off the lane with full throttle must be OFF_ASPHALT');
  const zeroOff = { ...zero, offAsphaltStepCount: 61, offAsphaltFirstStep: 240, offAsphaltFirstXM: 24.6, offAsphaltFirstZM: 3.1, maxUndersteerMs: 125 };
  assert.equal(judge(zeroOff).verdict, 'PASS', 'AC-US-0002-02: 61 steps off the lane with throttle 0 and 125 ms of understeer must be PASS');
  assert.equal(judge({ ...zeroOff, maxUndersteerMs: 204 }).failReason, 'THRESHOLD_EXCEEDED', 'AC-US-0002-02: with throttle 0 the only failure is the understeer threshold, never OFF_ASPHALT');
});

test('CHK-TEST-0002-03 the understeer onset speed of the new setup is at least 15 % above the baseline V0 read from docs/physics.md', (t) => {
  // AC-US-0002-03
  for (const mode of MODES) {
    const r = onsetOf(mode);
    assert.equal(r.baselineAvailable, true, `AC-US-0002-03: ${mode}: the baseline of the previous version must be available in docs/physics.md`);
    assert.ok(FINITE(r.v0Mps), `AC-US-0002-03: ${mode}: v0Mps must be present`);
    assert.ok(FINITE(r.v1Mps), `AC-US-0002-03: ${mode}: v1Mps must be present at the natural end of the sweep`);
    assert.ok((r.v1Mps ?? 0) >= 1.15 * (r.v0Mps ?? Infinity), `AC-US-0002-03: ${mode}: v1Mps ${r.v1Mps} must be at least 1.15 × v0Mps ${r.v0Mps}`);
    assert.equal(r.verdict, 'PASS', `AC-US-0002-03: ${mode}: the record must be PASS (${r.failReason ?? ''})`);
    const first = r.maxUndersteerMsBySpeed.find(([, ms]) => ms > 200);
    if (first) assert.ok(near(r.v1Mps ?? NaN, first[0]), `AC-US-0002-03: ${mode}: V1 must be the lowest complete plateau with understeer above 200 ms`);
    else {
      assert.ok(near(r.v1Mps ?? NaN, interruptedPlateauOf(r)), `AC-US-0002-03: ${mode}: without a complete plateau above 200 ms, V1 must be the held speed of the plateau interrupted by the exit`);
      assert.ok(diagnosticsOf(r).some(d => d.includes('sem início de subesterço até a saída da faixa')), `AC-US-0002-03: ${mode}: the presentation must say where V1 came from (DOMAIN/DEC-12)`);
    }
  }
  const base = onsetOf('BINARY');
  const synthetic = (patch: Partial<UndersteerOnsetRecord>): UndersteerOnsetRecord => ({
    ...base, baselineAvailable: true, v0Mps: FIFTY_KMH_MPS, offAsphaltStepCount: 1, offAsphaltFirstStep: 3000, offAsphaltFirstXM: 24.6, offAsphaltFirstZM: 0,
    maxUndersteerMsBySpeed: [[FIFTY_KMH_MPS + 0.5, 0], [FIFTY_KMH_MPS + 2.5, 0]], v1Mps: FIFTY_KMH_MPS + 2.5, ...patch,
  });
  assert.equal(judge(synthetic({})).verdict, 'PASS', 'AC-US-0002-03: V1 59.0 km/h from the interrupted plateau against V0 50 km/h must be PASS');
  assert.equal(judge(synthetic({ maxUndersteerMsBySpeed: [[FIFTY_KMH_MPS + 0.5, 0], [FIFTY_KMH_MPS + 2.5, 208]] })).verdict, 'PASS', 'AC-US-0002-03: V1 59.0 km/h from a complete plateau must be PASS');
  const low = judge(synthetic({ v1Mps: FIFTY_KMH_MPS + 2.0 }));
  assert.equal(low.failReason, 'THRESHOLD_EXCEEDED', 'AC-US-0002-03: V1 57.2 km/h, below 1.15 × 50 km/h, must be THRESHOLD_EXCEEDED');
  assert.throws(() => judge(synthetic({ v1Mps: undefined })), /v1Mps/, 'AC-US-0002-03: a natural end without v1Mps is malformed, never MEASUREMENT_MISSING');
  printRecords(t, [...onset.BINARY, ...onset.PROPORTIONAL]);
});

test('CHK-TEST-0002-04 V0 is taken only from a baseline of the same sweep whose V1 is the speed of a complete plateau with understeer', () => {
  // AC-US-0002-03
  const run = (variant: BaselineVariant) => runBench('UNDERSTEER_ONSET', options('BINARY', { baseline: baselineOf(variant) }))[0] as UndersteerOnsetRecord;
  const valid = run('valid');
  assert.equal(valid.baselineAvailable, true, 'AC-US-0002-03: a baseline whose V1 is 50 km/h with an empty list and MEASUREMENT_MISSING is accepted');
  assert.ok(near(valid.v0Mps ?? NaN, FIFTY_KMH_MPS), 'AC-US-0002-03: V0 must be the V1 of that baseline record');
  for (const variant of ['noV1', 'interruptedV1', 'noPlateauParameters'] as const) {
    const r = run(variant);
    assert.equal(r.baselineAvailable, false, `AC-US-0002-03: baseline ${variant} must not be accepted`);
    assert.ok(!('v0Mps' in r), `AC-US-0002-03: baseline ${variant} gives no v0Mps`);
    assert.equal(r.failReason, 'BASELINE_MISSING', `AC-US-0002-03: baseline ${variant} must be BASELINE_MISSING`);
  }
});

test('CHK-TEST-0002-05 above 50 km/h the loss of the front is progressive: the understeer of each complete plateau never decreases towards the next, faster plateau', () => {
  // AC-US-0002-04
  for (const mode of MODES) {
    const r = onsetOf(mode), list = r.maxUndersteerMsBySpeed;
    assert.ok(list.length >= 2, `AC-US-0002-04: ${mode}: at least two complete plateaus above 50 km/h must be measured (${list.length})`);
    for (let i = 0; i < list.length; i++) {
      const [speed, ms] = list[i];
      assert.ok(speed > FIFTY_KMH_MPS, `AC-US-0002-04: ${mode}: plateau ${i} at ${speed} m/s must be above 50 km/h`);
      assert.ok(INTEGER(ms) && ms >= 0, `AC-US-0002-04: ${mode}: plateau ${i} understeer must be an integer number of ms`);
      if (i > 0) {
        assert.ok(near(speed - list[i - 1][0], r.entrySpeedStepMps), `AC-US-0002-04: ${mode}: consecutive plateaus must be entrySpeedStepMps apart, in increasing order`);
        assert.ok(ms >= list[i - 1][1], `AC-US-0002-04: ${mode}: understeer ${ms} ms at plateau ${i} must not be below ${list[i - 1][1]} ms of the previous plateau`);
      }
    }
    const interrupted = interruptedPlateauOf(r);
    assert.ok(!list.some(([speed]) => near(speed, interrupted)), `AC-US-0002-04: ${mode}: the plateau interrupted by the exit is not in the list`);
  }
  assert.equal(BENCH_PARAMETERS.plateauMs > 0 && BENCH_PARAMETERS.plateauSpeedHoldMode === 'THROTTLE_REGULATED', true, 'AC-US-0002-04: the plateau duration and hold mode are declared parameters of the sweep');
  assert.match(serialize([], BENCH_PARAMETERS), /"plateauMs":\d+.*"plateauSpeedHoldMode":"THROTTLE_REGULATED"/, 'AC-US-0002-04: the parameters line of the output must carry plateauMs and plateauSpeedHoldMode');
  const base = onsetOf('BINARY');
  const two = (ms1: number, ms2: number): UndersteerOnsetRecord => ({
    ...base, baselineAvailable: true, v0Mps: FIFTY_KMH_MPS, v1Mps: FIFTY_KMH_MPS + 2.5, offAsphaltStepCount: 1, offAsphaltFirstStep: 3000, offAsphaltFirstXM: 24.6, offAsphaltFirstZM: 0,
    maxUndersteerMsBySpeed: [[FIFTY_KMH_MPS + 0.5, ms1], [FIFTY_KMH_MPS + 1.0, ms2]],
  });
  assert.equal(judge(two(50, 42)).failReason, 'THRESHOLD_EXCEEDED', 'AC-US-0002-04: a plateau with less understeer than the previous one must be THRESHOLD_EXCEEDED');
  assert.equal(judge(two(50, 50)).verdict, 'PASS', 'AC-US-0002-04: equal durations plateau to plateau must be PASS');
  assert.equal(judge(two(0, 300)).verdict, 'PASS', 'AC-US-0002-04: the comparison is plateau to plateau, never a running maximum');
});

test('CHK-TEST-0002-06 the output carries the two reference-corner records and the onset record of API-0003 with the arc radius, the lane width, the understeer durations, V0 and V1 in m/s and km/h', () => {
  // AC-US-0002-05
  for (const mode of MODES) {
    const rs = [cornerOf(mode, 'THROTTLE_ZERO'), cornerOf(mode, 'THROTTLE_FULL')];
    assert.equal(corner[mode].length, 2, `AC-US-0002-05: ${mode}: one REFERENCE_CORNER record per throttle condition`);
    for (const r of [...rs, onsetOf(mode)]) {
      assert.equal(r.benchEnvironment, 'TEST_PAD', `AC-US-0002-05: ${mode} ${r.benchId}: the corner runs on the test pad`);
      assert.equal(r.arcRadiusM, 18, `AC-US-0002-05: ${mode} ${r.benchId}: arcRadiusM must be 18`);
      assert.equal(r.laneWidthM, WIDTH, `AC-US-0002-05: ${mode} ${r.benchId}: laneWidthM must be the track width`);
      assert.equal(r.setupId, 'ARCADE_ASSISTIDO', `AC-US-0002-05: ${mode} ${r.benchId}: setupId`);
      assert.equal(r.setupVersion, ARCADE.setupVersion, `AC-US-0002-05: ${mode} ${r.benchId}: setupVersion`);
      assert.ok(INTEGER(r.offAsphaltStepCount), `AC-US-0002-05: ${mode} ${r.benchId}: offAsphaltStepCount must be an integer`);
    }
    for (const r of rs) {
      assert.ok(INTEGER(r.maxUndersteerMs), `AC-US-0002-05: ${mode} ${r.throttleCondition}: maxUndersteerMs must be an integer number of ms`);
      assert.ok(near(r.entrySpeedMps, FIFTY_KMH_MPS), `AC-US-0002-05: ${mode} ${r.throttleCondition}: entrySpeedMps must be 50 km/h`);
    }
    const o = onsetOf(mode);
    assert.ok(FINITE(o.v0Mps) && FINITE(o.v1Mps) && FINITE(o.entrySpeedStepMps), `AC-US-0002-05: ${mode}: v0Mps, v1Mps and entrySpeedStepMps must be numbers`);
    assert.ok(Array.isArray(o.maxUndersteerMsBySpeed) && o.maxUndersteerMsBySpeed.every(p => p.length === 2 && FINITE(p[0]) && INTEGER(p[1])), `AC-US-0002-05: ${mode}: maxUndersteerMsBySpeed must be pairs [plateauSpeedMps, maxUndersteerMs]`);
    assert.equal(o.offAsphaltStepCount, 1, `AC-US-0002-05: ${mode}: the sweep ends at its first step off the lane`);
    assert.ok(INTEGER(o.offAsphaltFirstStep) && FINITE(o.offAsphaltFirstXM) && FINITE(o.offAsphaltFirstZM), `AC-US-0002-05: ${mode}: the exit step and position must be reported`);
  }
  const text = serialize([...corner.BINARY, ...onset.BINARY], BENCH_PARAMETERS);
  assert.match(text, /v0Mps \d+(\.\d+)? km\/h/, 'AC-US-0002-05: V0 must be presented in km/h');
  assert.match(text, /v1Mps \d+(\.\d+)? km\/h/, 'AC-US-0002-05: V1 must be presented in km/h');
  assert.match(text, /maxUndersteerMsBySpeed \d+(\.\d+)?km\/h:\d+ms/, 'AC-US-0002-05: the plateaus must be presented in km/h and ms');
  assert.match(text, /"maxUndersteerMs":\d+/, 'AC-US-0002-05: the longest understeer must be in the record');
  for (const variant of ['noBlock', 'corrupt', 'otherEnvironment', 'otherArc'] as const) {
    const r = runBench('UNDERSTEER_ONSET', options('BINARY', { baseline: baselineOf(variant) }))[0] as UndersteerOnsetRecord;
    assert.equal(r.verdict, 'FAIL', `AC-US-0002-05: baseline ${variant} must give FAIL`);
    assert.equal(r.failReason, 'BASELINE_MISSING', `AC-US-0002-05: baseline ${variant} must give BASELINE_MISSING`);
    assert.ok(!('v0Mps' in r), `AC-US-0002-05: baseline ${variant} gives no v0Mps`);
  }
});

test('CHK-TEST-0002-07 the lane exit decides how the sweep ends: below 50 km/h it fails as OFF_ASPHALT, above it with fewer than two plateaus as MEASUREMENT_MISSING, and after two plateaus it is the natural end', () => {
  // AC-US-0002-06
  const base = onsetOf('BINARY');
  const pairs = (n: number): [number, number][] => Array.from({ length: n }, (_, i) => [FIFTY_KMH_MPS + (i + 1) * 0.5, 0]);
  const synthetic = (n: number, patch: Partial<UndersteerOnsetRecord> = {}): UndersteerOnsetRecord => {
    const r: UndersteerOnsetRecord = { ...base, baselineAvailable: true, v0Mps: FIFTY_KMH_MPS, v1Mps: FIFTY_KMH_MPS + 2.5, offAsphaltStepCount: 1, offAsphaltFirstStep: 100, offAsphaltFirstXM: 24.6, offAsphaltFirstZM: 0, maxUndersteerMsBySpeed: pairs(n), ...patch };
    for (const k of ['v1Mps', 'v0Mps'] as const) if (patch[k] === undefined && k in patch) delete r[k];
    return r;
  };
  for (const n of [0, 1, 2]) {
    for (const patch of [{}, { v1Mps: undefined }, { baselineAvailable: false, v0Mps: undefined }]) {
      const r = judge(synthetic(n, patch), 'OFF_ASPHALT');
      assert.equal(r.failReason, 'OFF_ASPHALT', `AC-US-0002-06: an exit below 50 km/h with ${n} plateaus (${JSON.stringify(patch)}) must be OFF_ASPHALT`);
    }
  }
  for (const n of [0, 1]) {
    assert.equal(judge(synthetic(n)).failReason, 'MEASUREMENT_MISSING', `AC-US-0002-06: an exit above 50 km/h with ${n} plateaus must be MEASUREMENT_MISSING`);
    assert.equal(judge(synthetic(n, { v1Mps: undefined })).failReason, 'MEASUREMENT_MISSING', `AC-US-0002-06: an exit above 50 km/h with ${n} plateaus and no V1 must be MEASUREMENT_MISSING`);
  }
  assert.equal(judge(synthetic(2)).verdict, 'PASS', 'AC-US-0002-06: the natural end after two plateaus with V1 sufficient must be PASS');
  assert.equal(judge(synthetic(2, { v1Mps: FIFTY_KMH_MPS + 2.0 })).failReason, 'THRESHOLD_EXCEEDED', 'AC-US-0002-06: the natural end with V1 insufficient must be THRESHOLD_EXCEEDED, never MEASUREMENT_MISSING');
  assert.throws(() => judge({ ...synthetic(2), offAsphaltStepCount: 0 }), /exit/, 'AC-US-0002-06: a sweep that never left the lane has no verdict');
  for (const mode of MODES) {
    const r = onsetOf(mode), exitSpeed = exitSpeedOf(r);
    assert.equal(r.offAsphaltStepCount, 1, `AC-US-0002-06: ${mode}: the sweep ends at the first step off the lane`);
    assert.equal(ARC.surfaceAt({ x: r.offAsphaltFirstXM ?? 0, z: r.offAsphaltFirstZM ?? 0 }), 'grass', `AC-US-0002-06: ${mode}: the exit position must lie off the lane`);
    assert.ok((r.offAsphaltFirstStep ?? 0) > (r.maxUndersteerMsBySpeed.length + 1) * Math.round(BENCH_PARAMETERS.plateauMs / 1000 * 120), `AC-US-0002-06: ${mode}: the exit step must come after the complete plateaus`);
    if (exitSpeed < FIFTY_KMH_MPS) assert.equal(r.failReason, 'OFF_ASPHALT', `AC-US-0002-06: ${mode}: exit at ${exitSpeed} m/s must be OFF_ASPHALT`);
    else if (r.maxUndersteerMsBySpeed.length < 2) assert.equal(r.failReason, 'MEASUREMENT_MISSING', `AC-US-0002-06: ${mode}: exit above 50 km/h before the second plateau must be MEASUREMENT_MISSING`);
    else {
      assert.ok(FINITE(r.v1Mps), `AC-US-0002-06: ${mode}: the natural end carries v1Mps`);
      assert.ok(r.failReason !== 'OFF_ASPHALT' && r.failReason !== 'MEASUREMENT_MISSING', `AC-US-0002-06: ${mode}: the natural end never fails because of the exit`);
    }
  }
});

test('CHK-TEST-0002-08 the keyboard and the tilt forms give the same corner and the same sweep, both passing', () => {
  // NFR-0003
  for (const c of ['THROTTLE_ZERO', 'THROTTLE_FULL'] as const) {
    assert.deepEqual(measures(cornerOf('PROPORTIONAL', c)), measures(cornerOf('BINARY', c)), `NFR-0003: ${c}: BINARY and PROPORTIONAL corner records must carry the same measures`);
  }
  assert.deepEqual(measures(onsetOf('PROPORTIONAL')), measures(onsetOf('BINARY')), 'NFR-0003: BINARY and PROPORTIONAL onset records must carry the same measures');
  for (const mode of MODES) for (const r of [...corner[mode], ...onset[mode]]) assert.equal(r.verdict, 'PASS', `NFR-0003: ${mode} ${r.benchId} must be PASS`);
  for (const mode of MODES) assert.deepEqual(makeInput(mode, 1, 0, 1), { throttle: 1, brake: 0, steer: 1 }, `NFR-0003: ${mode}: full throttle and full steer are the same Input in both forms`);
});
