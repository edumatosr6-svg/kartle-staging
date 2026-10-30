// TEST-0009 — the test-pilot lap on the synthetic track and the determinism of every bench
// (strategy: test-pilot, integration and contract, RULE-0002, API-0003, DES-0004, ADR-0004).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CIRCUIT } from '../src/physics';
import {
  handlingBenchReport, judge, runBench, SIMULATION_BENCHES, testPilotLapWith, THRESHOLDS,
  type BenchId, type DeterminismRecord, type TestPilotLapRecord,
} from '../scripts/handlingBench';
import { autopilot } from './helpers/autopilot';
import { ARCADE, ARCADE_CONFIG, byId, INTEGER, measures, MODES, options, printRecords } from './helpers/handling';

const BENCHES = ['TEST_PILOT_LAP', 'DETERMINISM'] as const;
const reports = { BINARY: handlingBenchReport(options('BINARY'), BENCHES), PROPORTIONAL: handlingBenchReport(options('PROPORTIONAL'), BENCHES) };
const lapOf = (mode: keyof typeof reports) => byId<TestPilotLapRecord>(reports[mode], 'TEST_PILOT_LAP');
const determinismOf = (mode: keyof typeof reports, env: 'TEST_PAD' | 'SYNTHETIC_TRACK') => byId<DeterminismRecord>(reports[mode], 'DETERMINISM', r => r.benchEnvironment === env);
const CEILING_MS = 50000;

test('CHK-TEST-0009-01 the test pilot completes the synthetic lap with zero steps off the asphalt, and a pilot driven 8 m beside the line fails as OFF_ASPHALT with the step and position of its first exit', (t) => {
  // AC-US-0005-02
  for (const mode of MODES) {
    const r = lapOf(mode);
    assert.equal(r.benchEnvironment, 'SYNTHETIC_TRACK', `AC-US-0005-02: ${mode}: the test-pilot lap runs on the synthetic track`);
    assert.equal(r.offAsphaltStepCount, 0, `AC-US-0005-02: ${mode}: offAsphaltStepCount must be 0`);
    assert.ok(!('offAsphaltFirstStep' in r), `AC-US-0005-02: ${mode}: no exit fields without an exit`);
    assert.equal(r.verdict, 'PASS', `AC-US-0005-02: ${mode}: TEST_PILOT_LAP must be PASS (${r.failReason ?? ''})`);
  }
  const offset = testPilotLapWith(options('BINARY'), autopilot(8, ARCADE_CONFIG));
  assert.equal(offset.verdict, 'FAIL', 'AC-US-0005-02: a pilot 8 m beside the line must fail');
  assert.equal(offset.failReason, 'OFF_ASPHALT', 'AC-US-0005-02: a pilot 8 m beside the line must be OFF_ASPHALT');
  assert.ok(offset.offAsphaltStepCount > 0 && INTEGER(offset.offAsphaltFirstStep), 'AC-US-0005-02: the exit step must be reported');
  assert.equal(CIRCUIT.surfaceAt({ x: offset.offAsphaltFirstXM ?? 0, z: offset.offAsphaltFirstZM ?? 0 }), 'grass', 'AC-US-0005-02: the reported exit position must be on the grass of the synthetic track');
  printRecords(t, [lapOf('BINARY'), lapOf('PROPORTIONAL'), offset]);
});

test('CHK-TEST-0009-02 the test-pilot lap takes at most 25 s of simulated time and is faster than the recorded baseline', () => {
  // AC-US-0005-03
  for (const mode of MODES) {
    const r = lapOf(mode);
    assert.ok(INTEGER(r.lapTimeMs) && r.lapTimeMs <= 25000, `AC-US-0005-03: ${mode}: lapTimeMs ${r.lapTimeMs} must be an integer at most 25000 ms`);
    assert.equal(r.baselineAvailable, true, `AC-US-0005-03: ${mode}: the baseline lap must be recorded in docs/physics.md`);
    assert.ok(INTEGER(r.baselineLapTimeMs), `AC-US-0005-03: ${mode}: baselineLapTimeMs must be present with the baseline`);
    assert.ok(r.lapTimeMs < (r.baselineLapTimeMs ?? 0), `AC-US-0005-03: ${mode}: lapTimeMs ${r.lapTimeMs} must be below the baseline ${r.baselineLapTimeMs}`);
  }
  assert.equal(THRESHOLDS.lapTimeMs, 25000, 'AC-US-0005-03: the threshold is 25 s');
  assert.equal(judge({ ...lapOf('BINARY'), lapTimeMs: 25001 }).failReason, 'THRESHOLD_EXCEEDED', 'AC-US-0005-03: 25001 ms must be THRESHOLD_EXCEEDED');
  assert.equal(judge({ ...lapOf('BINARY'), lapTimeMs: 25000 }).verdict, 'PASS', 'AC-US-0005-03: exactly 25000 ms must be PASS');
});

test('CHK-TEST-0009-03 every test-pilot record carries exactly four integer sector times; a valid lap sums them to the lap time and a lap that never ends reports the window ceiling', () => {
  // AC-US-0005-03
  for (const mode of MODES) {
    const r = lapOf(mode);
    assert.equal(r.sectorMs.length, 4, `AC-US-0005-03: ${mode}: four sector times`);
    assert.ok(r.sectorMs.every(INTEGER), `AC-US-0005-03: ${mode}: integer sector times`);
    assert.equal(r.sectorMs.reduce((a, b) => a + b, 0), r.lapTimeMs, `AC-US-0005-03: ${mode}: the sectors of a valid lap must sum to the lap time`);
  }
  const idle = testPilotLapWith(options('BINARY'), () => ({ throttle: 0, brake: 0, steer: 0 }));
  assert.equal(idle.lapTimeMs, CEILING_MS, 'AC-US-0005-03: a lap that never ends reports the ceiling of the window');
  assert.deepEqual(idle.sectorMs, [CEILING_MS, CEILING_MS, CEILING_MS, CEILING_MS], 'AC-US-0005-03: no sector completed: four ceilings');
  assert.equal(idle.failReason, 'THRESHOLD_EXCEEDED', 'AC-US-0005-03: a lap at the ceiling fails the threshold');
  const offset = testPilotLapWith(options('BINARY'), autopilot(8, ARCADE_CONFIG));
  assert.ok(offset.sectorMs.length === 4 && offset.sectorMs.every(INTEGER), 'AC-US-0005-03: the offset pilot record also carries four integers');
});

test('CHK-TEST-0009-04 every bench run twice gives identical states in both environments, and a run that differs is NON_DETERMINISTIC', () => {
  // AC-US-0005-01
  for (const mode of MODES) for (const env of ['TEST_PAD', 'SYNTHETIC_TRACK'] as const) {
    const r = determinismOf(mode, env);
    assert.ok(r.runCount >= 2, `AC-US-0005-01: ${mode} ${env}: at least two runs`);
    assert.equal(r.identical, true, `AC-US-0005-01: ${mode} ${env}: the runs must be identical`);
    assert.equal(r.verdict, 'PASS', `AC-US-0005-01: ${mode} ${env}: DETERMINISM must be PASS`);
  }
  const differing = judge({ ...determinismOf('BINARY', 'TEST_PAD'), identical: false });
  assert.equal(differing.verdict, 'FAIL', 'AC-US-0005-01: runs that differ must be FAIL');
  assert.equal(differing.failReason, 'NON_DETERMINISTIC', 'AC-US-0005-01: runs that differ must be NON_DETERMINISTIC');
});

// The variants of each simulation bench in the keyboard form (API-0003 4.0.1, RULE-0002): two sides of the steering response,
// two start speeds × two sides of the radius, two sides of the turn and of the recovery, two compared sequences of the
// drift command, two grass entries, and one record for each of the others.
const BINARY_VARIANTS: Partial<Record<BenchId, number>> = {
  STEER_RESPONSE: 2, CORNER_RADIUS: 4, CORNER_TURN: 2, NORMAL_DRIVING: 1, REAR_RECOVERY: 2, DRIFT_INERT: 2, SPEED_CAP: 1,
  ACCELERATION: 1, TOP_SPEED: 1, GRASS_LOSS: 2, WALL_CONTACT: 1, TEST_PILOT_LAP: 1,
};

test('CHK-TEST-0009-05 the whole set of simulation benches produces the same records on a second run', () => {
  // NFR-0001
  const ids: BenchId[] = SIMULATION_BENCHES.filter(id => id !== 'DETERMINISM');
  const first = handlingBenchReport(options('BINARY'), ids), second = handlingBenchReport(options('BINARY'), ids);
  for (const id of ids) assert.equal(first.filter(r => r.benchId === id).length, BINARY_VARIANTS[id], `NFR-0001: ${id} must give one record per variant (${BINARY_VARIANTS[id]})`);
  assert.equal(first.length, Object.values(BINARY_VARIANTS).reduce((a, b) => a + (b ?? 0), 0), 'NFR-0001: no record beyond the declared variants');
  assert.deepEqual(second, first, 'NFR-0001: the records of two runs must be identical, measuredAtUtc included');
  assert.deepEqual(runBench('TEST_PILOT_LAP', options('PROPORTIONAL')), runBench('TEST_PILOT_LAP', options('PROPORTIONAL')), 'NFR-0001: the lap record must be identical across runs');
});

test('CHK-TEST-0009-06 the keyboard and the tilt forms give the same lap time and sector times', () => {
  // NFR-0003
  assert.deepEqual(measures(lapOf('PROPORTIONAL')), measures(lapOf('BINARY')), 'NFR-0003: BINARY and PROPORTIONAL lap records must carry the same measures');
  assert.equal(lapOf('BINARY').setupVersion, ARCADE.setupVersion, 'NFR-0003: the lap is recorded under the current version');
});
