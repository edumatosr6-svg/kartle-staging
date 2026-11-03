// TEST-0006 — determinism on the Kart Park: the same inputs from the same state give the same lap time, sectors and state; and
// the same as the simulation of before seed revision 2, recorded in tests/fixtures/kartParkRev1Trace.json (strategy:
// determinism, integration level, DES-0006, NFR-0003, NFR-0013, I8).
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getTrackContact, step, STEP, wheelPositions, type Input, type State } from '../src/physics';
import { getLapResult, getLapState, stepLap, type LapResult, type LapSession } from '../src/lap';
import { classifySurface, closestOnSegment } from '../src/trackGeometry';
import { EDGE_LINE_WIDTH_M } from '../src/trackScene';
import { startTrainingLap, selectTrainingTrack, initialTrainingSession } from '../src/trainingSession';
import { SYNTHETIC_TRACK_FILE } from '../src/track';
import { kartParkEnvironment, kartParkGeometry, kartParkText } from './fixtures/kartParkFiles';
import { completeKartParkLap, drive, kartAtLapM, kartParkPilot, KART_PARK_CONFIG, lapResults, replay, runCountdown, startKartParkLap } from './helpers/kartParkPilot';
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

// The revision-1 trace (data only): recorded once with the simulation of f926815, the commit before the seed-revision-2 code,
// never regenerated from newer code. Each sequence is replayed here with the current code from the same start.
type TraceSequence = { name: string; inputs: [number, number, number][]; states: [number, number, number, number][]; laps: { lapMs: number; sectorMs: number[] }[] };
const trace = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'fixtures', 'kartParkRev1Trace.json'), 'utf8')) as { recordedFromCommit: string; sequences: TraceSequence[] };
const sequence = (name: string) => { const q = trace.sequences.find(s => s.name === name); if (!q) throw new Error(`fixture: no sequence ${name}`); return q; };
const asInput = ([throttle, brake, steer]: [number, number, number]): Input => ({ throttle, brake, steer });
// Replays a lap sequence from runCountdown(startKartParkLap()) with its recorded inputs, step by step.
function replayLap(q: TraceSequence): { lap: LapSession; kart: State[]; laps: LapSession[] } {
  let lap = runCountdown(startKartParkLap());
  const kart: State[] = [], laps: LapSession[] = [];
  for (const input of q.inputs) { lap = stepLap(lap, asInput(input)); kart.push(lap.kart); laps.push(lap); }
  return { lap, kart, laps };
}
function replaySeeded(q: TraceSequence): State[] {
  let s = kartAtLapM(0);
  return q.inputs.map(input => (s = step(s, asInput(input), STEP, KART_PARK_CONFIG, kartParkEnvironment())));
}
// The first step where the replayed kart differs from the recorded one in x, z, heading or speed (exact: JSON keeps every double).
const firstDifference = (q: TraceSequence, kart: State[]) => {
  for (let i = 0; i < q.states.length; i++) {
    const [x, z, heading, speed] = q.states[i], k = kart[i];
    if (!k || k.x !== x || k.z !== z || k.heading !== heading || k.speed !== speed) return `step ${i}: recorded (${x}, ${z}, ${heading}, ${speed}), now ${k ? `(${k.x}, ${k.z}, ${k.heading}, ${k.speed})` : 'missing'}`;
  }
  return undefined;
};
const replayed = {
  valid: replayLap(sequence('pilot-valid-lap')),
  offset: replayLap(sequence('pilot-edge-curb-barrier')),
  seeded: replaySeeded(sequence('seeded-2000')),
};

test('CHK-TEST-0006-05 every sequence of the revision-1 trace gives, step by step, the same kart position, heading and speed as before revision 2', () => {
  // AC-US-0007-07, NFR-0013
  assert.equal(trace.recordedFromCommit, 'f926815c2177ebf5b315a5e17cfb9e2f044acf5a', 'NFR-0013: the trace was recorded with the simulation of the commit before the revision-2 code');
  assert.deepEqual(trace.sequences.map(q => q.name), ['pilot-valid-lap', 'pilot-edge-curb-barrier', 'seeded-2000'], 'NFR-0013: the three sequences of DES-0006');
  for (const [name, kart] of [['pilot-valid-lap', replayed.valid.kart], ['pilot-edge-curb-barrier', replayed.offset.kart], ['seeded-2000', replayed.seeded]] as const) {
    const q = sequence(name);
    assert.ok(q.states.length >= 2000 && q.states.length === q.inputs.length, `fixture: ${name} has one recorded state per input (${q.states.length})`);
    assert.equal(firstDifference(q, kart), undefined, `AC-US-0007-07: ${name}: the kart must follow the revision-1 trajectory in every step`);
  }
});

test('CHK-TEST-0006-06 the lap of the revision-1 trace gives the same total time to the millisecond and the same 4 sector times as before revision 2', () => {
  // NFR-0013
  const q = sequence('pilot-valid-lap');
  assert.equal(q.laps.length, 1, 'fixture: the recorded pilot lap was completed');
  const items = lapResults(replayed.valid.lap);
  assert.equal(items.length, 1, `NFR-0013: the replayed lap is completed at the same step (${items.length} results)`);
  assert.equal(items[0].lapValidity, 'VALID', 'NFR-0013: the compared lap is the VALID pilot lap');
  assert.equal(items[0].lapMs, q.laps[0].lapMs, `NFR-0013: lapMs must be identical to the revision-1 lap (${items[0].lapMs} vs ${q.laps[0].lapMs})`);
  assert.deepEqual(items[0].sectorMs, q.laps[0].sectorMs, 'NFR-0013: the 4 sector times must be identical one by one to the revision-1 lap');
  assert.equal(lapResults(replayed.offset.lap).length, sequence('pilot-edge-curb-barrier').laps.length, 'NFR-0013: the offset sequence completes as many laps as before');
});

test('CHK-TEST-0006-07 the offset sequence of the trace crosses the edge line, rides a curb and hits the barrier, so the comparison covers the three', () => {
  // NFR-0013, AC-US-0007-07
  const edgeDistance = (p: { x: number; z: number }) => {
    let best = Infinity;
    for (const e of [g.leftEdge, g.rightEdge]) for (let i = 0; i < e.length; i++) best = Math.min(best, closestOnSegment(e[i], e[(i + 1) % e.length], p).distanceM);
    return best;
  };
  let edgeLine = 0, curb = 0, barrier = 0;
  for (const lap of replayed.offset.laps) {
    const k = lap.kart, sin = Math.sin(k.heading), cos = Math.cos(k.heading);
    const wheels = wheelPositions(KART_PARK_CONFIG).map(p => ({ x: k.x + p.forward * sin + p.left * cos, z: k.z + p.forward * cos - p.left * sin }));
    if (wheels.some(w => classifySurface(g, w) === 'asphalt' && edgeDistance(w) <= EDGE_LINE_WIDTH_M)) edgeLine++;
    const c = getTrackContact(k, lap.environment, lap.config);
    if ('code' in c) continue;
    if (c.curbWheelCount > 0) curb++;
    if (c.barrierContact) barrier++;
  }
  assert.ok(edgeLine > 0, `NFR-0013: the sequence has a step with a wheel on the edge line, inside the asphalt edge (${edgeLine})`);
  assert.ok(curb > 0, `AC-US-0007-07: the sequence has a step with a wheel on a curb (${curb})`);
  assert.ok(barrier > 0, `NFR-0013: the sequence has a step with barrier contact (${barrier})`);
});
