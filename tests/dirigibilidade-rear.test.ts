// TEST-0003 — the rear: normal driving never lets go, the forced rear recovers in 400 ms without spinning, the drift
// still scores (strategy: rear, integration and contract, RULE-0001, RULE-0002, API-0003, DES-0004).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { classifyHandlingSteps, testPadArc, WIDTH } from '../src/physics';
import {
  arcEntry, BENCH_PARAMETERS, handlingBenchReport, judge, makeInput, serialize,
  type DriftManeuverRecord, type NormalDrivingRecord, type RearRecoveryRecord, type ReferenceCornerRecord, type UndersteerOnsetRecord,
} from '../scripts/handlingBench';
import { ARCADE, byId, FINITE, FIFTY_KMH_MPS, INTEGER, isLoose, measures, MODES, options, printRecords, trace, type Trace } from './helpers/handling';

const ARC = testPadArc(BENCH_PARAMETERS.arcRadiusM, BENCH_PARAMETERS.laneWidthM);
const here = dirname(fileURLToPath(import.meta.url));
// One suite per input form: NORMAL_DRIVING aggregates the test-pad traces, so the records of the same run are read together.
const BENCHES = ['REFERENCE_CORNER', 'UNDERSTEER_ONSET', 'NORMAL_DRIVING', 'REAR_RECOVERY', 'DRIFT_MANEUVER'] as const;
const reports = { BINARY: handlingBenchReport(options('BINARY'), BENCHES), PROPORTIONAL: handlingBenchReport(options('PROPORTIONAL'), BENCHES) };
const normalOf = (mode: keyof typeof reports, env: 'TEST_PAD' | 'SYNTHETIC_TRACK') => byId<NormalDrivingRecord>(reports[mode], 'NORMAL_DRIVING', r => r.benchEnvironment === env);
const rearOf = (mode: keyof typeof reports) => byId<RearRecoveryRecord>(reports[mode], 'REAR_RECOVERY');
const driftOf = (mode: keyof typeof reports) => byId<DriftManeuverRecord>(reports[mode], 'DRIFT_MANEUVER');
const cornerOf = (mode: keyof typeof reports, c: 'THROTTLE_ZERO' | 'THROTTLE_FULL') => byId<ReferenceCornerRecord>(reports[mode], 'REFERENCE_CORNER', r => (r as ReferenceCornerRecord).throttleCondition === c);
const onsetOf = (mode: keyof typeof reports) => byId<UndersteerOnsetRecord>(reports[mode], 'UNDERSTEER_ONSET');
const WINDOW_STEPS = Math.round(BENCH_PARAMETERS.cornerWindowMs / 1000 * 120);
const FORCING_WINDOW_STEPS = Math.round(BENCH_PARAMETERS.forcingWindowMs / 1000 * 120);

// The forcing sequence of the strategy: full throttle and full steer on the arc above 50 km/h until the rear lets go,
// then steer 0 with the throttle held until the first grip; the whole thing through the public simulation.
function forcingSequence(mode: 'BINARY' | 'PROPORTIONAL'): { trace: Trace; release: number; grip: number } {
  const forcing = makeInput(mode, 1, 0, 1), released = makeInput(mode, 1, 0, 0);
  let release = -1;
  const tr = trace(arcEntry(BENCH_PARAMETERS.forcingSpeedMps), ARC, 2 * FORCING_WINDOW_STEPS, (i, state) => {
    if (release < 0 && i > 0 && isLoose(state.telemetry.handling)) release = i;
    return release < 0 ? forcing : released;
  }, t => release >= 0 && t.handling === 'grip');
  return { trace: tr, release, grip: tr.telemetry.length - 1 };
}
const cornerTrace = (mode: 'BINARY' | 'PROPORTIONAL', c: 'THROTTLE_ZERO' | 'THROTTLE_FULL') => {
  const input = makeInput(mode, c === 'THROTTLE_FULL' ? 1 : 0, 0, 1);
  return trace(arcEntry(FIFTY_KMH_MPS), ARC, WINDOW_STEPS, () => input, c === 'THROTTLE_FULL' ? t => t.surface === 'GRASS' : undefined);
};
const classes = (tr: Trace) => classifyHandlingSteps(tr.inputs.map((input, i) => ({ input, telemetry: tr.telemetry[i] })));

test('CHK-TEST-0003-01 in normal driving the telemetry never reports oversteer or sliding, and the full-throttle reference corner stays in grip or understeer at every step', (t) => {
  // AC-US-0003-01
  for (const mode of MODES) {
    for (const env of ['TEST_PAD', 'SYNTHETIC_TRACK'] as const) {
      const r = normalOf(mode, env);
      assert.equal(r.oversteerOrSlidingStepCount, 0, `AC-US-0003-01: ${mode} ${env}: oversteerOrSlidingStepCount must be 0 in normal driving`);
      assert.ok(r.normalDrivingStepCount > 0, `AC-US-0003-01: ${mode} ${env}: the aggregate must contain normal-driving steps`);
      assert.equal(r.verdict, 'PASS', `AC-US-0003-01: ${mode} ${env}: NORMAL_DRIVING must be PASS (${r.failReason ?? ''})`);
    }
    const tr = cornerTrace(mode, 'THROTTLE_FULL');
    assert.ok(tr.telemetry.every(x => x.handling === 'grip' || x.handling === 'understeer'), `AC-US-0003-01: ${mode}: the full-throttle corner must be grip or understeer at every step`);
  }
  printRecords(t, [...reports.BINARY, ...reports.PROPORTIONAL].filter(r => r.benchId === 'NORMAL_DRIVING'));
});

test('CHK-TEST-0003-02 oversteer and sliding occur only in steps of class FORCING, DRIFT or RECOVERY', () => {
  // AC-US-0003-02
  for (const mode of MODES) {
    const traces = [cornerTrace(mode, 'THROTTLE_ZERO'), cornerTrace(mode, 'THROTTLE_FULL'), forcingSequence(mode).trace];
    let loose = 0;
    for (const tr of traces) {
      const cls = classes(tr);
      for (let i = 0; i < cls.length; i++) {
        if (!isLoose(tr.telemetry[i].handling)) continue;
        loose++;
        assert.ok(cls[i] !== 'NORMAL', `AC-US-0003-02: ${mode}: step ${tr.telemetry[i].simStepCount} is ${tr.telemetry[i].handling} in class NORMAL`);
      }
    }
    assert.ok(loose > 0, `AC-US-0003-02: ${mode}: the forcing sequence must let the rear go at least once`);
  }
});

test('CHK-TEST-0003-03 with the rear loose under the forcing condition, releasing the steer brings the telemetry back to grip within 400 ms', () => {
  // AC-US-0003-03
  for (const mode of MODES) {
    const r = rearOf(mode);
    assert.equal(r.gripReached, true, `AC-US-0003-03: ${mode}: grip must be reached`);
    assert.ok(INTEGER(r.recoveryMs) && (r.recoveryMs ?? Infinity) <= 400, `AC-US-0003-03: ${mode}: recoveryMs ${r.recoveryMs} must be an integer at most 400 ms`);
    assert.equal(r.offAsphaltStepCount, 0, `AC-US-0003-03: ${mode}: the recovery must stay on the lane`);
    assert.equal(r.verdict, 'PASS', `AC-US-0003-03: ${mode}: REAR_RECOVERY must be PASS (${r.failReason ?? ''})`);
    const seq = forcingSequence(mode);
    assert.ok(seq.release > 0, `AC-US-0003-03: ${mode}: the forcing sequence must reach a loose rear before the release`);
    assert.ok(seq.trace.telemetry.every(x => x.surface === 'ASPHALT'), `AC-US-0003-03: ${mode}: no step of the sequence may leave the asphalt`);
    const steps = seq.grip - seq.release + 1;
    assert.ok(steps >= 1 && steps * (1000 / 120) <= 400 + 1e-9, `AC-US-0003-03: ${mode}: the replayed sequence must reach grip within 400 ms of the release (${steps} steps)`);
  }
  const base = rearOf('BINARY');
  const noGrip = judge({ ...base, gripReached: false, recoveryMs: undefined });
  assert.equal(noGrip.verdict, 'FAIL', 'AC-US-0003-03: a recovery that never reaches grip must be FAIL');
  assert.equal(noGrip.failReason, 'THRESHOLD_EXCEEDED', 'AC-US-0003-03: a recovery that never reaches grip must be THRESHOLD_EXCEEDED');
  assert.equal(judge({ ...base, recoveryMs: 404 }).failReason, 'THRESHOLD_EXCEEDED', 'AC-US-0003-03: a recovery of 404 ms must be THRESHOLD_EXCEEDED');
  assert.equal(judge({ ...base, recoveryMs: 400 }).verdict, 'PASS', 'AC-US-0003-03: a recovery of exactly 400 ms must be PASS');
  const off = judge({ ...base, offAsphaltStepCount: 1, offAsphaltFirstStep: 50, offAsphaltFirstXM: 24.6, offAsphaltFirstZM: 1 });
  assert.equal(off.failReason, 'OFF_ASPHALT', 'AC-US-0003-03: leaving the lane during the recovery must be OFF_ASPHALT');
});

test('CHK-TEST-0003-04 the sideslip never exceeds 0.65 rad during the recovery: the kart does not spin', () => {
  // AC-US-0003-04
  for (const mode of MODES) {
    const r = rearOf(mode);
    assert.ok(FINITE(r.maxSideslipRad) && r.maxSideslipRad <= 0.65, `AC-US-0003-04: ${mode}: maxSideslipRad ${r.maxSideslipRad} must be at most 0.65 rad`);
    const seq = forcingSequence(mode);
    for (let i = seq.release; i <= seq.grip; i++) assert.ok(seq.trace.telemetry[i].sideslipRad <= 0.65, `AC-US-0003-04: ${mode}: sideslip ${seq.trace.telemetry[i].sideslipRad} at step ${i} of the replayed recovery exceeds 0.65 rad`);
  }
  assert.equal(judge({ ...rearOf('BINARY'), maxSideslipRad: 0.66 }).failReason, 'THRESHOLD_EXCEEDED', 'AC-US-0003-04: a sideslip of 0.66 rad must be THRESHOLD_EXCEEDED');
});

test('CHK-TEST-0003-05 in normal driving the sideslip never exceeds 0.65 rad, and the recovery steps are excluded from the aggregate', () => {
  // AC-US-0003-05
  for (const mode of MODES) {
    for (const env of ['TEST_PAD', 'SYNTHETIC_TRACK'] as const) {
      const r = normalOf(mode, env);
      assert.ok(r.maxSideslipRad <= 0.65, `AC-US-0003-05: ${mode} ${env}: maxSideslipRad ${r.maxSideslipRad} must be at most 0.65 rad`);
      assert.ok(INTEGER(r.excludedRecoveryStepCount) && r.excludedRecoveryStepCount >= 0, `AC-US-0003-05: ${mode} ${env}: excludedRecoveryStepCount must be a non-negative integer`);
    }
    const pad = normalOf(mode, 'TEST_PAD');
    const seq = forcingSequence(mode), seqClasses = classes(seq.trace);
    const recovery = seqClasses.filter((c, i) => c === 'RECOVERY' && seq.trace.telemetry[i].surface === 'ASPHALT').length;
    assert.ok(recovery >= 1, `AC-US-0003-05: ${mode}: the replayed sequence must contain recovery steps`);
    assert.equal(pad.excludedRecoveryStepCount, recovery, `AC-US-0003-05: ${mode}: the excluded recovery steps of the test pad must be those of the recovery trace`);
    const normal = (tr: Trace) => classes(tr).filter((c, i) => c === 'NORMAL' && tr.telemetry[i].surface === 'ASPHALT').length;
    const known = normal(cornerTrace(mode, 'THROTTLE_ZERO')) + normal(cornerTrace(mode, 'THROTTLE_FULL')) + normal(seq.trace);
    const onsetAsphaltSteps = (onsetOf(mode).offAsphaltFirstStep ?? 1) - 1;
    assert.ok(pad.normalDrivingStepCount >= known && pad.normalDrivingStepCount <= known + onsetAsphaltSteps, `AC-US-0003-05: ${mode}: normalDrivingStepCount ${pad.normalDrivingStepCount} must be the NORMAL asphalt steps of the four traces (${known} known plus at most ${onsetAsphaltSteps} of the sweep), recovery excluded`);
  }
  assert.equal(judge({ ...normalOf('BINARY', 'TEST_PAD'), maxSideslipRad: 0.66 }).failReason, 'THRESHOLD_EXCEEDED', 'AC-US-0003-05: a sideslip of 0.66 rad in normal driving must be THRESHOLD_EXCEEDED');
  assert.equal(judge({ ...normalOf('BINARY', 'TEST_PAD'), oversteerOrSlidingStepCount: 1 }).failReason, 'THRESHOLD_EXCEEDED', 'AC-US-0003-05: one loose step in normal driving must be THRESHOLD_EXCEEDED');
});

test('CHK-TEST-0003-06 the drift maneuver of requirements/11 is still possible and still scores with the Arcade assistido', (t) => {
  // AC-US-0003-06
  for (const mode of MODES) {
    const r = driftOf(mode);
    assert.ok(r.driftScorePoints > 0, `AC-US-0003-06: ${mode}: driftScorePoints ${r.driftScorePoints} must be above 0`);
    assert.equal(r.verdict, 'PASS', `AC-US-0003-06: ${mode}: DRIFT_MANEUVER must be PASS`);
  }
  assert.equal(judge({ ...driftOf('BINARY'), driftScorePoints: 0 }).failReason, 'THRESHOLD_EXCEEDED', 'AC-US-0003-06: a drift that does not score must be THRESHOLD_EXCEEDED');
  const maneuvers = readFileSync(join(here, 'maneuvers.test.ts'), 'utf8');
  assert.match(maneuvers, /player-induced drift generates real lateral slip and a useful exit boost/, 'AC-US-0003-06: the existing drift check of requirements/11 must still be in the suite');
  assert.match(readFileSync(join(here, '..', 'package.json'), 'utf8'), /"test":\s*"tsx --test tests\/\*\.test\.ts"/, 'AC-US-0003-06: npm test must run every tests/*.test.ts file, the existing drift check included');
  printRecords(t, [driftOf('BINARY'), driftOf('PROPORTIONAL')]);
});

test('CHK-TEST-0003-07 the output carries the recovery and normal-driving records of API-0003 with the recovery time, the maximum sideslip and the loose-step count', (t) => {
  // AC-US-0003-07
  for (const mode of MODES) {
    const r = rearOf(mode);
    assert.equal(r.benchEnvironment, 'TEST_PAD', `AC-US-0003-07: ${mode}: the recovery runs on the test pad`);
    assert.equal(r.arcRadiusM, 18, `AC-US-0003-07: ${mode}: arcRadiusM`);
    assert.equal(r.laneWidthM, WIDTH, `AC-US-0003-07: ${mode}: laneWidthM`);
    assert.equal(typeof r.gripReached, 'boolean', `AC-US-0003-07: ${mode}: gripReached must be a boolean`);
    assert.equal('recoveryMs' in r, r.gripReached, `AC-US-0003-07: ${mode}: recoveryMs is present exactly when grip was reached`);
    assert.ok(FINITE(r.maxSideslipRad) && INTEGER(r.offAsphaltStepCount), `AC-US-0003-07: ${mode}: maxSideslipRad and offAsphaltStepCount must be present`);
    assert.equal(r.setupId, 'ARCADE_ASSISTIDO', `AC-US-0003-07: ${mode}: setupId`);
    assert.equal(r.setupVersion, ARCADE.setupVersion, `AC-US-0003-07: ${mode}: setupVersion`);
    for (const env of ['TEST_PAD', 'SYNTHETIC_TRACK'] as const) {
      const n = normalOf(mode, env);
      for (const k of ['normalDrivingStepCount', 'excludedRecoveryStepCount', 'oversteerOrSlidingStepCount'] as const) assert.ok(INTEGER(n[k]), `AC-US-0003-07: ${mode} ${env}: ${k} must be an integer`);
      assert.ok(FINITE(n.maxSideslipRad), `AC-US-0003-07: ${mode} ${env}: maxSideslipRad must be a number`);
      assert.equal(n.benchEnvironment, env, `AC-US-0003-07: ${mode}: one NORMAL_DRIVING record per environment`);
    }
  }
  const text = serialize([rearOf('BINARY'), normalOf('BINARY', 'TEST_PAD')], BENCH_PARAMETERS);
  assert.match(text, /"benchId":"REAR_RECOVERY".*"recoveryMs":\d+/, 'AC-US-0003-07: the output must carry the recovery time');
  assert.match(text, /"benchId":"NORMAL_DRIVING".*"oversteerOrSlidingStepCount":\d+/, 'AC-US-0003-07: the output must carry the loose-step count');
  printRecords(t, [rearOf('BINARY'), rearOf('PROPORTIONAL')]);
});

test('CHK-TEST-0003-08 the keyboard and the tilt forms give the same recovery and the same normal-driving aggregate', () => {
  // NFR-0003
  assert.deepEqual(measures(rearOf('PROPORTIONAL')), measures(rearOf('BINARY')), 'NFR-0003: BINARY and PROPORTIONAL recovery records must carry the same measures');
  for (const env of ['TEST_PAD', 'SYNTHETIC_TRACK'] as const) assert.deepEqual(measures(normalOf('PROPORTIONAL', env)), measures(normalOf('BINARY', env)), `NFR-0003: ${env}: BINARY and PROPORTIONAL normal-driving records must carry the same measures`);
  assert.deepEqual(measures(driftOf('PROPORTIONAL')), measures(driftOf('BINARY')), 'NFR-0003: BINARY and PROPORTIONAL drift records must carry the same measures');
  assert.deepEqual(measures(cornerOf('PROPORTIONAL', 'THROTTLE_FULL')), measures(cornerOf('BINARY', 'THROTTLE_FULL')), 'NFR-0003: the full-throttle corner is the same in both forms');
});
