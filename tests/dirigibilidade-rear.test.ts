// TEST-0003 — the rear: normal driving never lets go over the test-pilot lap, the forced rear on the open pad recovers in
// 400 ms without spinning, the drift command changes nothing, and no situation goes faster than the top speed
// (strategy: rear, integration and contract, RULE-0001, RULE-0002, API-0003 4.0.1, DES-0004, DOMAIN/DEC-15, DOMAIN/DEC-16).
// The rules are judged on traces the test drives itself through the public operations, then compared with the records.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { initialManeuvers } from '../src/maneuvers';
import { getHandlingTelemetry, testPadArea, type HandlingTelemetry, type Input, type State } from '../src/physics';
import { getLapResult, startLap, stepLap } from '../src/lap';
import { COUNTDOWN_STEPS, toMs } from '../src/lapTiming';
import {
  BENCH_PARAMETERS, handlingBenchReport, judge, makeInput, MAX_LAP_STEPS, serialize, straight, testPilot,
  type DriftInertRecord, type InputMode, type NormalDrivingRecord, type RearRecoveryRecord, type SpeedCapRecord, type TopSpeedRecord,
} from '../scripts/handlingBench';
import { syntheticReading } from './fixtures/trackFiles';
import {
  ARCADE, ARCADE_CONFIG, byId, FIFTY_KMH_MPS, FINITE, INTEGER, isLoose, measures, MODES, options, printRecords, SETUP_REF, trace,
  untilFirstResult, type Trace,
} from './helpers/handling';

const AREA = testPadArea(BENCH_PARAMETERS.testAreaRadiusM);
const STRAIGHT_AREA = testPadArea(BENCH_PARAMETERS.straightTestAreaRadiusM);
const FORCING_STEPS = Math.round(BENCH_PARAMETERS.forcingWindowMs / 1000 * 120);
const RECOVERY_MAX_STEPS = Math.round(0.4 * 120);
const SIDES = [1, -1] as const;
const BENCHES = ['NORMAL_DRIVING', 'REAR_RECOVERY', 'DRIFT_INERT', 'SPEED_CAP', 'TOP_SPEED'] as const;
const reports = { BINARY: handlingBenchReport(options('BINARY'), BENCHES), PROPORTIONAL: handlingBenchReport(options('PROPORTIONAL'), BENCHES) };
const normalOf = (mode: InputMode) => byId<NormalDrivingRecord>(reports[mode], 'NORMAL_DRIVING');
const rearOf = (mode: InputMode, side: number) => byId<RearRecoveryRecord>(reports[mode], 'REAR_RECOVERY', r => (r as RearRecoveryRecord).steerInputNorm === side);
const inertOf = (mode: InputMode, env: 'TEST_PAD' | 'SYNTHETIC_TRACK') => byId<DriftInertRecord>(reports[mode], 'DRIFT_INERT', r => r.benchEnvironment === env);
const capOf = (mode: InputMode) => byId<SpeedCapRecord>(reports[mode], 'SPEED_CAP');
const topOf = (mode: InputMode) => byId<TopSpeedRecord>(reports[mode], 'TOP_SPEED');
const withDrift = (input: Input): Input => ({ ...input, drift: true });

// The test-pilot lap on the synthetic track, ended at the first result; `drift` holds the drift command from the first
// countdown step to the last step. Records every state after the countdown, and the whole Input sequence applied.
type Lap = { states: State[]; telemetry: HandlingTelemetry[]; sequence: Input[]; pilotSteps: number };
function pilotLap(drift = false): Lap {
  const reading = syntheticReading();
  if (reading.trackDataStatus !== 'COMPLETE') throw new Error('fixture: synthetic reading must be COMPLETE');
  const started = startLap(undefined, { lapKind: 'TRAINING', trackId: reading.trackId, trackVersion: reading.trackVersion, ...SETUP_REF }, reading, ARCADE_CONFIG);
  if (!started.ok) throw new Error(`fixture: startLap rejected: ${started.code}`);
  const map = (i: Input) => (drift ? withDrift(i) : i);
  const sequence: Input[] = [], states: State[] = [], telemetry: HandlingTelemetry[] = [];
  let lap = started.lap;
  for (let i = 0; i < COUNTDOWN_STEPS; i++) { const idle = map({ throttle: 0, brake: 0, steer: 0 }); lap = stepLap(lap, idle); sequence.push(idle); }
  const pilot = testPilot(ARCADE_CONFIG);
  const ended = untilFirstResult(lap, l => map(pilot(l)), MAX_LAP_STEPS, (l, input) => {
    sequence.push(input); states.push(l.kart); telemetry.push(getHandlingTelemetry(l.kart, SETUP_REF) as HandlingTelemetry);
  });
  if ('code' in getLapResult(ended.lap)) throw new Error('fixture: the test-pilot lap gave no result');
  return { states, telemetry, sequence, pilotSteps: ended.steps };
}
const LAP = pilotLap(false), LAP_DRIFT = pilotLap(true);

// forcingThenRelease(side, throttleAtRelease) of the strategy: throttle 1 and full steer from straight(16.7) until the
// rear lets go under the forcing condition or 360 steps; then steer 0 and the given throttle until the first grip or 360 steps.
type Forcing = { trace: Trace; released: boolean; releaseIndex: number; gripIndex: number };
function forcingThenRelease(mode: InputMode, side: number, throttleAtRelease: number, drift = false): Forcing {
  const forcing = makeInput(mode, 1, 0, side), release = makeInput(mode, throttleAtRelease, 0, 0);
  let releaseIndex = -1, gripIndex = -1;
  const tr = trace(straight(BENCH_PARAMETERS.forcingSpeedMps), AREA, 2 * FORCING_STEPS, (i) => {
    const input = releaseIndex < 0 ? forcing : release;
    return drift ? withDrift(input) : input;
  }, (t) => {
    if (t.surface === 'GRASS') return true;
    if (releaseIndex < 0) {
      if (t.forcing && isLoose(t.handling)) { releaseIndex = t.simStepCount; return false; }
      return t.simStepCount >= FORCING_STEPS;
    }
    if (t.handling === 'grip') { gripIndex = t.simStepCount; return true; }
    return t.simStepCount >= releaseIndex + FORCING_STEPS;
  });
  return { trace: tr, released: releaseIndex >= 0, releaseIndex, gripIndex };
}

test('CHK-TEST-0003-01 over every step of the test-pilot lap the telemetry never reports oversteer or sliding, and the record counts exactly those steps', (t) => {
  // AC-US-0003-01
  const loose = LAP.telemetry.filter(x => isLoose(x.handling)).length;
  assert.equal(loose, 0, `AC-US-0003-01: ${loose} steps of the test-pilot lap report oversteer or sliding; normal driving must have none`);
  assert.ok(LAP.pilotSteps > 1000, 'AC-US-0003-01: the lap must span more than a thousand steps');
  for (const mode of MODES) {
    const r = normalOf(mode);
    assert.equal(r.benchEnvironment, 'SYNTHETIC_TRACK', `AC-US-0003-01: ${mode}: NORMAL_DRIVING is the test-pilot lap on the synthetic track`);
    assert.equal(r.normalDrivingStepCount, LAP.pilotSteps, `AC-US-0003-01: ${mode}: normalDrivingStepCount must be every step of the lap up to its first result (${LAP.pilotSteps})`);
    assert.equal(r.oversteerOrSlidingStepCount, loose, `AC-US-0003-01: ${mode}: oversteerOrSlidingStepCount must be the count recomputed over the trace, forcing steps included`);
    assert.equal(r.verdict, 'PASS', `AC-US-0003-01: ${mode}: NORMAL_DRIVING must be PASS (${r.failReason ?? ''})`);
  }
  assert.equal(judge({ ...normalOf('BINARY'), oversteerOrSlidingStepCount: 1 }).failReason, 'THRESHOLD_EXCEEDED', 'AC-US-0003-01: one loose step in normal driving must be THRESHOLD_EXCEEDED');
  printRecords(t, [normalOf('BINARY'), normalOf('PROPORTIONAL')]);
});

test('CHK-TEST-0003-05 over every step of the test-pilot lap the sideslip never exceeds 0.65 rad, and the record carries that maximum', () => {
  // AC-US-0003-05
  const max = LAP.telemetry.reduce((m, x) => Math.max(m, x.sideslipRad), 0);
  assert.ok(max <= 0.65, `AC-US-0003-05: the largest sideslip of the lap is ${max} rad and must be at most 0.65 rad`);
  for (const mode of MODES) {
    const r = normalOf(mode);
    assert.equal(r.maxSideslipRad, max, `AC-US-0003-05: ${mode}: maxSideslipRad must be the maximum recomputed over the trace (${max})`);
  }
  assert.equal(judge({ ...normalOf('BINARY'), maxSideslipRad: 0.66 }).failReason, 'THRESHOLD_EXCEEDED', 'AC-US-0003-05: a sideslip of 0.66 rad in normal driving must be THRESHOLD_EXCEEDED');
  assert.equal(judge({ ...normalOf('BINARY'), maxSideslipRad: 0.65 }).verdict, 'PASS', 'AC-US-0003-05: exactly 0.65 rad must be PASS');
});

test('CHK-TEST-0003-03 after forcing the rear on the open pad, taking the steer to 0 brings grip back within 400 ms, with the throttle held or released; a rear that never lets go is reported, not failed', () => {
  // AC-US-0003-03
  for (const mode of MODES) for (const side of SIDES) {
    const r = rearOf(mode, side);
    for (const throttleAtRelease of [1, 0]) {
      const f = forcingThenRelease(mode, side, throttleAtRelease);
      assert.ok(f.trace.telemetry.every(x => x.surface === 'ASPHALT'), `AC-US-0003-03: ${mode} side ${side} throttle ${throttleAtRelease}: the run must stay inside the declared area`);
      if (f.released) {
        assert.ok(f.gripIndex > 0, `AC-US-0003-03: ${mode} side ${side} throttle ${throttleAtRelease}: grip must come back after the release`);
        const steps = f.gripIndex - f.releaseIndex;
        assert.ok(steps <= RECOVERY_MAX_STEPS, `AC-US-0003-03: ${mode} side ${side} throttle ${throttleAtRelease}: grip came back ${toMs(steps)} ms after the release; at most 400 ms`);
      } else {
        assert.ok(!f.trace.telemetry.some(x => x.forcing && isLoose(x.handling)), `AC-US-0003-03: ${mode} side ${side} throttle ${throttleAtRelease}: without a release no step may be loose under forcing`);
      }
      if (throttleAtRelease === 1) {
        assert.equal(r.rearReleased, f.released, `AC-US-0003-03: ${mode} side ${side}: rearReleased must say whether the rear let go in the trace`);
        if (f.released) assert.equal(r.recoveryMs, toMs(f.gripIndex - f.releaseIndex), `AC-US-0003-03: ${mode} side ${side}: recoveryMs must be the steps from the release to the first grip`);
        else assert.equal(r.forcingMs, toMs(FORCING_STEPS), `AC-US-0003-03: ${mode} side ${side}: without a release the forcing lasts the whole window`);
      }
    }
    assert.equal(r.offAsphaltStepCount, 0, `AC-US-0003-03: ${mode} side ${side}: no step off the declared area`);
    assert.equal(r.verdict, 'PASS', `AC-US-0003-03: ${mode} side ${side}: REAR_RECOVERY must be PASS (${r.failReason ?? ''})`);
  }
  const released: RearRecoveryRecord = { ...rearOf('BINARY', 1), rearReleased: true, forcingMs: 1200, gripReached: true, recoveryMs: 400, maxSideslipRad: 0.3 };
  assert.equal(judge(released).verdict, 'PASS', 'AC-US-0003-03: a recovery of exactly 400 ms must be PASS');
  assert.equal(judge({ ...released, recoveryMs: 404 }).failReason, 'THRESHOLD_EXCEEDED', 'AC-US-0003-03: a recovery of 404 ms must be THRESHOLD_EXCEEDED');
  const noGrip = { ...released, gripReached: false };
  delete (noGrip as Partial<RearRecoveryRecord>).recoveryMs;
  assert.equal(judge(noGrip).failReason, 'THRESHOLD_EXCEEDED', 'AC-US-0003-03: a release that never reaches grip must be THRESHOLD_EXCEEDED');
  const notReleased = { ...rearOf('BINARY', 1), rearReleased: false, forcingMs: 3000 };
  assert.equal(judge(notReleased).verdict, 'PASS', 'AC-US-0003-03: a rear that does not let go is PASS: no criterion requires it to');
  assert.equal(judge({ ...released, offAsphaltStepCount: 1, offAsphaltFirstStep: 50, offAsphaltFirstXM: 100.5, offAsphaltFirstZM: 1 }).failReason, 'TEST_AREA_EXCEEDED', 'AC-US-0003-03: leaving the declared area is TEST_AREA_EXCEEDED');
});

test('CHK-TEST-0003-04 during the recovery the sideslip never exceeds 0.65 rad: the kart does not spin', () => {
  // AC-US-0003-04
  for (const mode of MODES) for (const side of SIDES) {
    const r = rearOf(mode, side);
    for (const throttleAtRelease of [1, 0]) {
      const f = forcingThenRelease(mode, side, throttleAtRelease);
      const recovery = f.released ? f.trace.telemetry.filter(x => x.simStepCount > f.releaseIndex) : [];
      const max = recovery.reduce((m, x) => Math.max(m, x.sideslipRad), 0);
      assert.ok(max <= 0.65, `AC-US-0003-04: ${mode} side ${side} throttle ${throttleAtRelease}: sideslip ${max} rad during the recovery must be at most 0.65 rad`);
      if (throttleAtRelease === 1 && f.released) assert.ok(FINITE(r.maxSideslipRad) && Math.abs((r.maxSideslipRad ?? NaN) - max) <= 1e-9, `AC-US-0003-04: ${mode} side ${side}: maxSideslipRad must be the maximum over the recovery steps`);
    }
    if (!r.rearReleased) assert.ok(!('maxSideslipRad' in r) && !('gripReached' in r) && !('recoveryMs' in r), `AC-US-0003-04: ${mode} side ${side}: without a release the recovery fields are absent`);
  }
  const released: RearRecoveryRecord = { ...rearOf('BINARY', 1), rearReleased: true, forcingMs: 1200, gripReached: true, recoveryMs: 300, maxSideslipRad: 0.65 };
  assert.equal(judge(released).verdict, 'PASS', 'AC-US-0003-04: exactly 0.65 rad must be PASS');
  assert.equal(judge({ ...released, maxSideslipRad: 0.66 }).failReason, 'THRESHOLD_EXCEEDED', 'AC-US-0003-04: a sideslip of 0.66 rad must be THRESHOLD_EXCEEDED');
});

test('CHK-TEST-0003-09 the same Input sequence with the drift command held from the first to the last step gives the same state at every step: no charge, no mini-turbo, no boost', () => {
  // AC-US-0003-08
  assert.equal(LAP_DRIFT.sequence.length, LAP.sequence.length, 'AC-US-0003-08: the lap with the drift command must last as many steps');
  assert.ok(LAP_DRIFT.sequence.every(i => i.drift === true), 'AC-US-0003-08: the drift command must be held on every step of the lap');
  for (let i = 0; i < LAP.states.length; i++) {
    assert.deepEqual(LAP_DRIFT.states[i], LAP.states[i], `AC-US-0003-08: step ${i + 1} after the countdown: the state with the drift command must equal the state without it`);
  }
  assert.ok(LAP_DRIFT.states.every(s => JSON.stringify(s.maneuvers) === JSON.stringify(initialManeuvers())), 'AC-US-0003-08: no charge, combo, score or boost may ever build up in the state');
  for (const mode of MODES) for (const side of SIDES) {
    const plain = forcingThenRelease(mode, side, 1), held = forcingThenRelease(mode, side, 1, true);
    assert.deepEqual(held.trace.states, plain.trace.states, `AC-US-0003-08: ${mode} side ${side}: the forced rear with the drift command must give the same states`);
  }
  for (const mode of MODES) {
    const lap = inertOf(mode, 'SYNTHETIC_TRACK'), pad = inertOf(mode, 'TEST_PAD');
    assert.equal(lap.comparedStepCount, LAP.sequence.length, `AC-US-0003-08: ${mode}: the lap comparison must cover the whole sequence, countdown included (${LAP.sequence.length})`);
    assert.equal(pad.comparedStepCount, forcingThenRelease(mode, 1, 1).trace.inputs.length, `AC-US-0003-08: ${mode}: the pad comparison must cover the whole forcing sequence of side +1`);
    for (const r of [lap, pad]) {
      assert.equal(r.differingStepCount, 0, `AC-US-0003-08: ${mode} ${r.benchEnvironment}: no compared step may differ`);
      assert.equal(r.verdict, 'PASS', `AC-US-0003-08: ${mode} ${r.benchEnvironment}: DRIFT_INERT must be PASS`);
    }
  }
  assert.equal(judge({ ...inertOf('BINARY', 'SYNTHETIC_TRACK'), differingStepCount: 1, firstDifferingStep: 400 }).failReason, 'THRESHOLD_EXCEEDED', 'AC-US-0003-08: one differing step must be THRESHOLD_EXCEEDED');
});

test('CHK-TEST-0003-10 no bench that starts at or below the top speed, nor the test-pilot lap with the drift command held, ever goes faster than the top speed of the same setup', (t) => {
  // AC-US-0003-10
  let flat = 0, previous = 0;
  const line = trace(straight(0), STRAIGHT_AREA, Math.round(BENCH_PARAMETERS.topSpeedWindowMs / 1000 * 120), () => makeInput('BINARY', 1, 0, 0), x => {
    flat = Math.abs(x.speedMps - previous) < 1e-6 ? flat + 1 : 0; previous = x.speedMps;
    return flat >= 120 && x.speedMps >= 60 / 3.6;
  });
  const top = line.states[line.states.length - 1].speed;
  const lineDrift = trace(straight(0), STRAIGHT_AREA, line.states.length, () => withDrift(makeInput('BINARY', 1, 0, 0)));
  const maxOf = (states: readonly State[]) => states.reduce((m, s) => Math.max(m, s.speed), 0);
  assert.ok(maxOf(lineDrift.states) <= top, `AC-US-0003-10: the straight with the drift command held reached ${maxOf(lineDrift.states)} m/s, above the top speed ${top}`);
  assert.ok(maxOf(LAP_DRIFT.states) <= top, `AC-US-0003-10: the lap with the drift command held reached ${maxOf(LAP_DRIFT.states)} m/s, above the top speed ${top}`);
  const covered: State[][] = [line.states, LAP.states];
  for (const mode of MODES) for (const side of SIDES) {
    covered.push(forcingThenRelease(mode, side, 1).trace.states);
    covered.push(trace(straight(FIFTY_KMH_MPS), AREA, 372, () => makeInput(mode, 1, 0, side)).states);
    covered.push(trace(straight(FIFTY_KMH_MPS), AREA, 240, () => makeInput(mode, 0, 0, side)).states);
  }
  const observed = Math.max(...covered.map(maxOf));
  assert.ok(observed <= top, `AC-US-0003-10: the highest speed over the covered runs is ${observed} m/s and must not exceed the top speed ${top}`);
  for (const mode of MODES) {
    const r = capOf(mode);
    assert.equal(r.topSpeedMps, topOf(mode).topSpeedMps, `AC-US-0003-10: ${mode}: topSpeedMps must be the TOP_SPEED of the same run`);
    assert.ok(Math.abs((r.topSpeedMps ?? NaN) - top) <= 1e-9, `AC-US-0003-10: ${mode}: topSpeedMps must be the stabilized speed of the straight (${top})`);
    assert.ok(Math.abs(r.maxObservedSpeedMps - observed) <= 1e-9, `AC-US-0003-10: ${mode}: maxObservedSpeedMps ${r.maxObservedSpeedMps} must be the maximum recomputed over the covered runs (${observed})`);
    assert.ok(r.maxObservedSpeedMps <= (r.topSpeedMps ?? -Infinity), `AC-US-0003-10: ${mode}: maxObservedSpeedMps must not exceed topSpeedMps`);
    assert.equal(r.verdict, 'PASS', `AC-US-0003-10: ${mode}: SPEED_CAP must be PASS (${r.failReason ?? ''})`);
  }
  const cap = capOf('BINARY');
  assert.equal(judge({ ...cap, maxObservedSpeedMps: (cap.topSpeedMps ?? 0) + 0.01 }).failReason, 'THRESHOLD_EXCEEDED', 'AC-US-0003-10: a speed above the top speed must be THRESHOLD_EXCEEDED');
  const noTop = { ...cap } as SpeedCapRecord;
  delete noTop.topSpeedMps;
  assert.equal(judge(noTop).failReason, 'MEASUREMENT_MISSING', 'AC-US-0003-10: without the top speed of the same run the cap is MEASUREMENT_MISSING');
  printRecords(t, [capOf('BINARY'), capOf('PROPORTIONAL')]);
});

test('CHK-TEST-0003-07 the output carries the REAR_RECOVERY, NORMAL_DRIVING, DRIFT_INERT and SPEED_CAP records of API-0003 4.0.1 with their environments and units', (t) => {
  // AC-US-0003-07
  for (const mode of MODES) {
    for (const side of SIDES) {
      const r = rearOf(mode, side);
      assert.equal(r.benchEnvironment, 'TEST_PAD', `AC-US-0003-07: ${mode}: the recovery runs on the open test pad`);
      assert.equal(r.testAreaRadiusM, 100, `AC-US-0003-07: ${mode}: testAreaRadiusM must be the 100 m area of the open pad (test strategy)`);
      assert.equal(r.entrySpeedMps, BENCH_PARAMETERS.forcingSpeedMps, `AC-US-0003-07: ${mode}: entrySpeedMps must be the forcing speed`);
      assert.ok(r.entrySpeedMps > FIFTY_KMH_MPS, `AC-US-0003-07: ${mode}: the forcing starts above 50 km/h`);
      assert.equal(typeof r.rearReleased, 'boolean', `AC-US-0003-07: ${mode}: rearReleased must be a boolean`);
      assert.ok(INTEGER(r.forcingMs), `AC-US-0003-07: ${mode}: forcingMs must be an integer number of ms`);
      assert.equal('gripReached' in r, r.rearReleased, `AC-US-0003-07: ${mode}: gripReached exactly with a release`);
      assert.equal('maxSideslipRad' in r, r.rearReleased, `AC-US-0003-07: ${mode}: maxSideslipRad exactly with a release`);
      assert.equal('recoveryMs' in r, r.gripReached === true, `AC-US-0003-07: ${mode}: recoveryMs exactly with grip reached`);
      assert.equal(r.setupVersion, ARCADE.setupVersion, `AC-US-0003-07: ${mode}: setupVersion`);
    }
    const n = normalOf(mode);
    assert.equal(n.benchEnvironment, 'SYNTHETIC_TRACK', `AC-US-0003-07: ${mode}: one NORMAL_DRIVING record, on the synthetic track`);
    assert.equal(reports[mode].filter(r => r.benchId === 'NORMAL_DRIVING').length, 1, `AC-US-0003-07: ${mode}: exactly one NORMAL_DRIVING record`);
    assert.ok(!('excludedRecoveryStepCount' in n), `AC-US-0003-07: ${mode}: NORMAL_DRIVING carries no excludedRecoveryStepCount`);
    assert.ok(INTEGER(n.normalDrivingStepCount) && INTEGER(n.oversteerOrSlidingStepCount) && FINITE(n.maxSideslipRad), `AC-US-0003-07: ${mode}: the counts and the sideslip must be present`);
    assert.deepEqual(reports[mode].filter(r => r.benchId === 'DRIFT_INERT').map(r => r.benchEnvironment).sort(), ['SYNTHETIC_TRACK', 'TEST_PAD'], `AC-US-0003-07: ${mode}: two DRIFT_INERT records, one per compared sequence`);
    for (const env of ['TEST_PAD', 'SYNTHETIC_TRACK'] as const) {
      const d = inertOf(mode, env);
      assert.ok(INTEGER(d.comparedStepCount) && INTEGER(d.differingStepCount) && !('firstDifferingStep' in d), `AC-US-0003-07: ${mode} ${env}: DRIFT_INERT counts, and no first differing step without a difference`);
    }
    assert.equal(inertOf(mode, 'TEST_PAD').testAreaRadiusM, BENCH_PARAMETERS.testAreaRadiusM, `AC-US-0003-07: ${mode}: the pad DRIFT_INERT carries the area fields`);
    assert.ok(!('testAreaRadiusM' in inertOf(mode, 'SYNTHETIC_TRACK')), `AC-US-0003-07: ${mode}: the lap DRIFT_INERT carries no area field`);
    const c = capOf(mode);
    assert.ok(FINITE(c.maxObservedSpeedMps) && FINITE(c.topSpeedMps) && typeof c.maxObservedBenchId === 'string', `AC-US-0003-07: ${mode}: SPEED_CAP carries the observed maximum, its bench and the top speed`);
  }
  const text = serialize([rearOf('BINARY', 1), normalOf('BINARY'), inertOf('BINARY', 'SYNTHETIC_TRACK'), capOf('BINARY')], BENCH_PARAMETERS);
  assert.match(text, /"benchId":"REAR_RECOVERY".*"rearReleased":(true|false)/, 'AC-US-0003-07: the output must carry the recovery record');
  assert.match(text, /"benchId":"NORMAL_DRIVING".*"oversteerOrSlidingStepCount":\d+.*"maxSideslipRad":\d/, 'AC-US-0003-07: the output must carry the loose-step count and the sideslip of the lap');
  assert.match(text, /"benchId":"DRIFT_INERT".*"differingStepCount":\d+/, 'AC-US-0003-07: the output must carry the result of the comparison with and without the drift command');
  assert.match(text, /maxObservedSpeedMps \d+(\.\d+)? km\/h · topSpeedMps \d+(\.\d+)? km\/h/, 'AC-US-0003-07: the highest observed speed must be presented in km/h beside the top speed');
  printRecords(t, [rearOf('BINARY', 1), rearOf('BINARY', -1), inertOf('BINARY', 'TEST_PAD'), inertOf('BINARY', 'SYNTHETIC_TRACK')]);
});

test('CHK-TEST-0003-08 the keyboard and the tilt forms give the same recovery, normal driving, drift comparison and speed cap', () => {
  // NFR-0003
  for (const side of SIDES) assert.deepEqual(measures(rearOf('PROPORTIONAL', side)), measures(rearOf('BINARY', side)), `NFR-0003: side ${side}: BINARY and PROPORTIONAL recovery records must carry the same measures`);
  assert.deepEqual(measures(normalOf('PROPORTIONAL')), measures(normalOf('BINARY')), 'NFR-0003: the normal-driving records must carry the same measures');
  for (const env of ['TEST_PAD', 'SYNTHETIC_TRACK'] as const) assert.deepEqual(measures(inertOf('PROPORTIONAL', env)), measures(inertOf('BINARY', env)), `NFR-0003: ${env}: the drift comparisons must carry the same measures`);
  assert.deepEqual(measures(capOf('PROPORTIONAL')), measures(capOf('BINARY')), 'NFR-0003: the speed caps must carry the same measures');
  for (const mode of MODES) for (const r of reports[mode]) assert.equal(r.verdict, 'PASS', `NFR-0003: ${mode} ${r.benchId} ${r.benchEnvironment} must be PASS`);
});
