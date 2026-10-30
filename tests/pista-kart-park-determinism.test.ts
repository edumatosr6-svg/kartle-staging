// TEST-0006 — determinism on the Kart Park: the same inputs from the same state give the same lap time, sectors and state
// (strategy: determinism, integration level, DES-0006, NFR-0003, I8).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { step, STEP, type State } from '../src/physics';
import { getLapResult, getLapState, type LapResult, type LapSession } from '../src/lap';
import { startTrainingLap, selectTrainingTrack, initialTrainingSession } from '../src/trainingSession';
import { SYNTHETIC_TRACK_FILE } from '../src/track';
import { kartParkEnvironment, kartParkGeometry, kartParkText } from './fixtures/kartParkFiles';
import { completeKartParkLap, drive, kartAtLapM, kartParkPilot, KART_PARK_CONFIG, lapResults, replay, runCountdown } from './helpers/kartParkPilot';
import { Seeded } from './helpers/seeded';

const g = kartParkGeometry();
const result = (lap: LapSession) => getLapResult(lap) as LapResult;
const first = completeKartParkLap(kartParkPilot(g));
const second = completeKartParkLap(kartParkPilot(g));

test('CHK-TEST-0006-01 two laps of the Kart Park pilot with the same input sequence give the same lap time to the millisecond and the same 4 sector times', () => {
  // NFR-0003
  assert.deepEqual(first.inputs, second.inputs, 'NFR-0003: the pilot replays the same input sequence');
  assert.equal(result(first.lap).lapValidity, 'VALID', 'NFR-0003: the reference lap is valid');
  assert.equal(result(first.lap).lapMs, result(second.lap).lapMs, `NFR-0003: lapMs must be identical (${result(first.lap).lapMs} vs ${result(second.lap).lapMs})`);
  assert.deepEqual(result(first.lap).sectorMs, result(second.lap).sectorMs, 'NFR-0003: the 4 sector times must be identical one by one');
  assert.equal(result(first.lap).sectorMs?.length, 4, 'NFR-0003: four sectors compared');
});

test('CHK-TEST-0006-02 the whole session, kart included, is deepEqual after the two laps', () => {
  // NFR-0003
  assert.deepEqual(first.lap, second.lap, 'NFR-0003: the sessions must be deepEqual (phase, counters, kart, result)');
  assert.deepEqual(getLapState(first.lap), getLapState(second.lap), 'NFR-0003: the state views are equal');
});

test('CHK-TEST-0006-03 replaying the recorded inputs step by step, without the pilot, reproduces the same lap; one input changed does not', () => {
  // NFR-0003
  const viaSession = () => { const s = selectTrainingTrack(initialTrainingSession(), undefined, 'kart-park', { 'kart-park': kartParkText(), synthetic: SYNTHETIC_TRACK_FILE }); if (!s.ok) throw new Error('fixture'); const l = startTrainingLap(s.session, undefined, KART_PARK_CONFIG); if (!l.ok) throw new Error('fixture'); return l.lap; };
  // The replay is padded with idle steps; the training goes on after the finish, so the comparison is taken where listLapResults grows.
  const replayed = drive(runCountdown(viaSession()), replay(first.inputs), first.inputs.length + 10);
  assert.equal(replayed.inputs.length, first.inputs.length, `NFR-0003: the replayed lap closes at the same step as the pilot's (${replayed.inputs.length} vs ${first.inputs.length})`);
  assert.deepEqual(lapResults(replayed.lap), lapResults(first.lap), 'NFR-0003: the replay through the training session lists the same results');
  assert.equal(result(replayed.lap).lapMs, result(first.lap).lapMs, 'NFR-0003: the replay through the training session gives the same lapMs');
  assert.deepEqual(result(replayed.lap).sectorMs, result(first.lap).sectorMs, 'NFR-0003: and the same sectors');
  assert.deepEqual(replayed.lap.kart, first.lap.kart, 'NFR-0003: and the same kart at the finish');
  const altered = first.inputs.map((input, i) => i === 600 ? { ...input, steer: input.steer === 0 ? 1 : 0, throttle: 0, brake: 1 } : input);
  const changed = drive(runCountdown(viaSession()), replay(altered), altered.length + 10);
  assert.notDeepEqual(changed.lap.kart, first.lap.kart, 'NFR-0003: a different input at step 600 changes the lap (the comparison can fail)');
});

test('CHK-TEST-0006-04 a seeded 2000-step input sequence from the Kart Park start gives deepEqual states in two runs', () => {
  // NFR-0003
  const run = (): State[] => {
    const seeded = new Seeded(20261027);
    const out: State[] = [];
    let s = kartAtLapM(0);
    for (let i = 0; i < 2000; i++) { s = step(s, seeded.input(), STEP, KART_PARK_CONFIG, kartParkEnvironment()); out.push(s); }
    return out;
  };
  const a = run(), b = run();
  assert.equal(a.length, 2000, 'NFR-0003: 2000 steps');
  for (let i = 0; i < a.length; i++) assert.deepEqual(a[i], b[i], `NFR-0003: step ${i} differs between the two runs`);
  assert.ok(a.some(s => s.telemetry.wheels.some(w => w.surface === 'curb')) || a.some(s => s.telemetry.surface === 'grass'), 'NFR-0003: the seeded run touches more than the asphalt');
});
