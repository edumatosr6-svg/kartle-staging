// TEST-0005 — speed and risk: 0-60 km/h, top speed, the grass of the synthetic track and the wall
// (strategy: speed, integration and contract, RULE-0002, API-0003, DES-0004).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { CIRCUIT, testPadLane } from '../src/physics';
import { toMs } from '../src/lapTiming';
import {
  BENCH_PARAMETERS, grassEntry, judge, makeInput, runBench, serialize, straight, wallApproach,
  type AccelerationRecord, type GrassLossRecord, type TopSpeedRecord, type WallContactRecord,
} from '../scripts/handlingBench';
import { ARCADE, byId, FINITE, FIFTY_KMH_MPS, INTEGER, measures, MODES, near, options, printRecords, trace } from './helpers/handling';

const LANE = testPadLane(BENCH_PARAMETERS.laneWidthM);
const SIXTY_KMH_MPS = 60 / 3.6;
const run = (mode: 'BINARY' | 'PROPORTIONAL') => ({
  acceleration: runBench('ACCELERATION', options(mode))[0] as AccelerationRecord,
  topSpeed: runBench('TOP_SPEED', options(mode))[0] as TopSpeedRecord,
  grass: runBench('GRASS_LOSS', options(mode)) as GrassLossRecord[],
  wall: runBench('WALL_CONTACT', options(mode))[0] as WallContactRecord,
});
const records = { BINARY: run('BINARY'), PROPORTIONAL: run('PROPORTIONAL') };
const full = (mode: 'BINARY' | 'PROPORTIONAL') => makeInput(mode, 1, 0, 0);

// The straight from rest with full throttle until the speed stops growing (120 flat steps), as the strategy fixes it.
function straightLine(mode: 'BINARY' | 'PROPORTIONAL') {
  let flat = 0, previous = 0, sixty: number | undefined;
  const tr = trace(straight(0), LANE, Math.round(BENCH_PARAMETERS.topSpeedWindowMs / 1000 * 120), () => full(mode), t => {
    if (sixty === undefined && t.speedMps >= SIXTY_KMH_MPS) sixty = t.simStepCount;
    flat = Math.abs(t.speedMps - previous) < 1e-6 ? flat + 1 : 0;
    previous = t.speedMps;
    return flat >= 120 && sixty !== undefined;
  });
  return { trace: tr, sixtyStep: sixty, final: tr.states[tr.states.length - 1] };
}

test('CHK-TEST-0005-01 from rest on the straight with full throttle the kart reaches 60 km/h within 2.5 s', (t) => {
  // AC-US-0004-01
  for (const mode of MODES) {
    const r = records[mode].acceleration;
    assert.ok(INTEGER(r.zeroToSixtyKmhMs) && r.zeroToSixtyKmhMs <= 2500, `AC-US-0004-01: ${mode}: zeroToSixtyKmhMs ${r.zeroToSixtyKmhMs} must be an integer at most 2500 ms`);
    assert.equal(r.driverMassKg, 75, `AC-US-0004-01: ${mode}: the driver must weigh 75 kg`);
    assert.equal(r.verdict, 'PASS', `AC-US-0004-01: ${mode}: ACCELERATION must be PASS`);
    const line = straightLine(mode);
    assert.ok(line.sixtyStep !== undefined, `AC-US-0004-01: ${mode}: the replayed straight must reach 60 km/h`);
    assert.equal(r.zeroToSixtyKmhMs, toMs(line.sixtyStep ?? 0), `AC-US-0004-01: ${mode}: the recorded time must be the first step at or above 60 km/h of the replayed straight`);
  }
  assert.equal(judge({ ...records.BINARY.acceleration, zeroToSixtyKmhMs: 2501 }).failReason, 'THRESHOLD_EXCEEDED', 'AC-US-0004-01: 2501 ms must be THRESHOLD_EXCEEDED');
  printRecords(t, [records.BINARY.acceleration, records.PROPORTIONAL.acceleration]);
});

test('CHK-TEST-0005-02 on the straight with full throttle the stabilized speed is at least 105 km/h', (t) => {
  // AC-US-0004-02
  for (const mode of MODES) {
    const r = records[mode].topSpeed;
    assert.ok(FINITE(r.topSpeedMps) && r.topSpeedMps >= 105 / 3.6, `AC-US-0004-02: ${mode}: topSpeedMps ${r.topSpeedMps} must be at least 105 km/h`);
    assert.equal(r.verdict, 'PASS', `AC-US-0004-02: ${mode}: TOP_SPEED must be PASS`);
    const line = straightLine(mode);
    assert.ok(near(r.topSpeedMps, line.final.speed, 1e-6), `AC-US-0004-02: ${mode}: the recorded top speed must be the stabilized speed of the replayed straight (${line.final.speed})`);
  }
  assert.equal(judge({ ...records.BINARY.topSpeed, topSpeedMps: 105 / 3.6 - 0.01 }).failReason, 'THRESHOLD_EXCEEDED', 'AC-US-0004-02: a top speed below 105 km/h must be THRESHOLD_EXCEEDED');
  printRecords(t, [records.BINARY.topSpeed, records.PROPORTIONAL.topSpeed]);
});

function grassRun(mode: 'BINARY' | 'PROPORTIONAL', entry: number) {
  return trace(grassEntry(entry), CIRCUIT, Math.round(BENCH_PARAMETERS.grassWindowMs / 1000 * 120), () => full(mode));
}

test('CHK-TEST-0005-03 entering the grass at the stabilized speed with full throttle, the speed after 1 s is at most 70 % of the entry speed', (t) => {
  // AC-US-0004-03
  for (const mode of MODES) {
    const r = records[mode].grass[0], top = records[mode].topSpeed;
    assert.ok(near(r.entrySpeedMps, top.topSpeedMps, 1e-9), `AC-US-0004-03: ${mode}: the first grass run must enter at the stabilized speed`);
    assert.ok(r.speedAfterOneSMps <= 0.7 * r.entrySpeedMps, `AC-US-0004-03: ${mode}: speedAfterOneSMps ${r.speedAfterOneSMps} must be at most 70 % of ${r.entrySpeedMps}`);
    assert.equal(r.verdict, 'PASS', `AC-US-0004-03: ${mode}: GRASS_LOSS must be PASS (${r.failReason ?? ''})`);
    const tr = grassRun(mode, r.entrySpeedMps);
    assert.equal(tr.telemetry.length, 120, `AC-US-0004-03: ${mode}: 1 s is 120 steps`);
    assert.ok(tr.telemetry.every(x => x.surface === 'GRASS' && !x.wallContact), `AC-US-0004-03: ${mode}: every step of the second must be on the grass without wall contact`);
    assert.ok(near(r.speedAfterOneSMps, tr.states[119].speed, 1e-9), `AC-US-0004-03: ${mode}: the recorded speed must be the speed after the 120th step of the replayed run`);
  }
  const inside = { ...records.BINARY.grass[0], entrySpeedMps: 30, speedAfterOneSMps: 20 };
  assert.equal(judge(inside).verdict, 'PASS', 'AC-US-0004-03: 20 m/s after entering at 30 m/s is PASS');
  assert.equal(judge(inside, 'THRESHOLD_EXCEEDED').failReason, 'THRESHOLD_EXCEEDED', 'AC-US-0004-03: a run whose precondition (grass held, no wall) was not met must be FAIL');
  assert.equal(judge({ ...inside, speedAfterOneSMps: 21.1 }).failReason, 'THRESHOLD_EXCEEDED', 'AC-US-0004-03: 21.1 m/s after 30 m/s exceeds 70 %');
  printRecords(t, [...records.BINARY.grass, ...records.PROPORTIONAL.grass]);
});

test('CHK-TEST-0005-04 entering the grass at 50 km/h with full throttle, the speed after 1 s is at most 70 % of 50 km/h, and the grass still slows the kart below 50 km/h', () => {
  // AC-US-0004-04
  for (const mode of MODES) {
    const r = records[mode].grass[1];
    assert.ok(near(r.entrySpeedMps, FIFTY_KMH_MPS), `AC-US-0004-04: ${mode}: the second grass run must enter at 50 km/h`);
    assert.ok(r.speedAfterOneSMps <= 0.7 * FIFTY_KMH_MPS, `AC-US-0004-04: ${mode}: speedAfterOneSMps ${r.speedAfterOneSMps} must be at most 70 % of 50 km/h`);
    assert.equal(r.verdict, 'PASS', `AC-US-0004-04: ${mode}: GRASS_LOSS at 50 km/h must be PASS`);
    const tr = grassRun(mode, FIFTY_KMH_MPS);
    assert.ok(tr.telemetry.every(x => x.surface === 'GRASS' && !x.wallContact), `AC-US-0004-04: ${mode}: every step of the second must be on the grass without wall contact`);
    assert.ok(near(r.speedAfterOneSMps, tr.states[119].speed, 1e-9), `AC-US-0004-04: ${mode}: the recorded speed must be that of the replayed run`);
    const slow = grassRun(mode, 30 / 3.6);
    assert.ok(slow.states[119].speed < 30 / 3.6, `AC-US-0004-04: ${mode}: below 50 km/h the grass still reduces the speed, without a fixed percentage`);
  }
});

test('CHK-TEST-0005-05 at every wall contact the speed on the step after the contact is below the speed on the step before it', (t) => {
  // AC-US-0004-05
  for (const mode of MODES) {
    const r = records[mode].wall;
    assert.ok(r.contacts.length > 0, `AC-US-0004-05: ${mode}: the wall run must contain at least one contact`);
    for (const [before, after] of r.contacts) assert.ok(after < before, `AC-US-0004-05: ${mode}: speed after the contact ${after} must be below the speed before ${before}`);
    assert.equal(r.verdict, 'PASS', `AC-US-0004-05: ${mode}: WALL_CONTACT must be PASS`);
    const tr = trace(wallApproach(), CIRCUIT, Math.round(BENCH_PARAMETERS.wallWindowMs / 1000 * 120), () => full(mode));
    const contacts: [number, number][] = [];
    for (let i = 1; i < tr.states.length - 1; i++) if (tr.telemetry[i].wallContact && tr.states[i - 1].speed > 0) contacts.push([tr.states[i - 1].speed, tr.states[i + 1].speed]);
    assert.equal(r.contacts.length, contacts.length, `AC-US-0004-05: ${mode}: the record must carry one pair per contact of the replayed run`);
    for (let i = 0; i < contacts.length; i++) assert.ok(near(r.contacts[i][0], contacts[i][0]) && near(r.contacts[i][1], contacts[i][1]), `AC-US-0004-05: ${mode}: contact ${i} must carry the speeds before and after of the replayed run`);
  }
  assert.equal(judge({ ...records.BINARY.wall, contacts: [] }).failReason, 'THRESHOLD_EXCEEDED', 'AC-US-0004-05: a run without contact must be FAIL');
  assert.equal(judge({ ...records.BINARY.wall, contacts: [[10, 9], [10, 10]] }).failReason, 'THRESHOLD_EXCEEDED', 'AC-US-0004-05: a contact that does not cost speed must be FAIL');
  printRecords(t, [records.BINARY.wall]);
});

test('CHK-TEST-0005-06 the output carries the four records of API-0003 with their environments, in m/s and ms, presented also in km/h and s', () => {
  // AC-US-0004-07
  for (const mode of MODES) {
    const { acceleration, topSpeed, grass, wall } = records[mode];
    for (const r of [acceleration, topSpeed]) assert.equal(r.benchEnvironment, 'TEST_PAD', `AC-US-0004-07: ${mode} ${r.benchId}: runs on the test pad`);
    for (const r of [...grass, wall]) assert.equal(r.benchEnvironment, 'SYNTHETIC_TRACK', `AC-US-0004-07: ${mode} ${r.benchId}: runs on the synthetic track`);
    for (const r of [acceleration, topSpeed, ...grass, wall]) {
      assert.equal(r.setupId, 'ARCADE_ASSISTIDO', `AC-US-0004-07: ${mode} ${r.benchId}: setupId`);
      assert.equal(r.setupVersion, ARCADE.setupVersion, `AC-US-0004-07: ${mode} ${r.benchId}: setupVersion`);
      assert.equal(r.inputMode, mode, `AC-US-0004-07: ${mode} ${r.benchId}: inputMode`);
    }
    assert.equal(grass.length, 2, `AC-US-0004-07: ${mode}: two grass runs, one per entry speed`);
    assert.ok(grass.every(g => FINITE(g.entrySpeedMps) && FINITE(g.speedAfterOneSMps)), `AC-US-0004-07: ${mode}: the grass records carry both speeds`);
    assert.ok(wall.contacts.every(p => p.length === 2 && FINITE(p[0]) && FINITE(p[1])), `AC-US-0004-07: ${mode}: the contacts are pairs of speeds`);
  }
  const text = serialize([records.BINARY.acceleration, records.BINARY.topSpeed, ...records.BINARY.grass, records.BINARY.wall], BENCH_PARAMETERS);
  assert.match(text, /zeroToSixtyKmhMs \d\.\d{3} s/, 'AC-US-0004-07: the 0-60 time must be presented in s');
  assert.match(text, /topSpeedMps \d+(\.\d+)? km\/h/, 'AC-US-0004-07: the top speed must be presented in km/h');
  assert.match(text, /speedAfterOneSMps \d+(\.\d+)? km\/h/, 'AC-US-0004-07: the speed after 1 s must be presented in km/h');
  assert.match(text, /contacts (\d+(\.\d+)?>\d+(\.\d+)? ?)+km\/h/, 'AC-US-0004-07: the contacts must be presented in km/h');
  const bench = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'scripts', 'physics-bench.ts'), 'utf8');
  for (const id of ['ACCELERATION', 'TOP_SPEED', 'GRASS_LOSS', 'WALL_CONTACT']) assert.ok(bench.includes(`'${id}'`), `AC-US-0004-07: bench:physics must run ${id}`);
  assert.match(bench, /console\.log\(serialize\(records, BENCH_PARAMETERS\)\)/, 'AC-US-0004-07: bench:physics must print the same serialization');
});

test('CHK-TEST-0005-07 the keyboard and the tilt forms give the same acceleration, top speed, grass loss and wall contacts', () => {
  // NFR-0003
  const b = records.BINARY, p = records.PROPORTIONAL;
  assert.deepEqual(measures(p.acceleration), measures(b.acceleration), 'NFR-0003: ACCELERATION must be the same in both forms');
  assert.deepEqual(measures(p.topSpeed), measures(b.topSpeed), 'NFR-0003: TOP_SPEED must be the same in both forms');
  assert.deepEqual(p.grass.map(measures), b.grass.map(measures), 'NFR-0003: GRASS_LOSS must be the same in both forms');
  assert.deepEqual(measures(p.wall), measures(b.wall), 'NFR-0003: WALL_CONTACT must be the same in both forms');
});
