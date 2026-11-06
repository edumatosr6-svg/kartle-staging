// TEST-0006 — determinism on the Kart Park: the same inputs from the same state give the same lap time, sectors and state; on
// the version 2, the same with and without the visual finish built (NFR-0013 2.0.0); and on the version 1, the same as the
// simulation of before seed revision 2, recorded in tests/fixtures/kartParkRev1Trace.json, which shows the simulation has not
// changed since (strategy 2.0.0: determinism, integration level, DES-0006, NFR-0003, NFR-0013, I8).
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getTrackContact, step, STEP, wheelPositions, type Input, type State } from '../src/physics';
import { getLapResult, getLapState, stepLap, type LapResult, type LapSession } from '../src/lap';
import { buildTrackGeometry, classifySurface, closestOnSegment, type TrackGeometry } from '../src/trackGeometry';
import { readTrackData } from '../src/trackData';
import { trackEnvironment } from '../src/physics';
import { buildTrackScene, EDGE_LINE_WIDTH_M } from '../src/trackScene';
import { startTrainingLap, selectTrainingTrack, initialTrainingSession } from '../src/trainingSession';
import { SYNTHETIC_TRACK_FILE } from '../src/track';
import { kartParkEnvironment, kartParkGeometry, kartParkText, kartParkV1Text } from './fixtures/kartParkFiles';
import { completeKartParkLap, drive, kartAtLapM, kartParkPilot, KART_PARK_CONFIG, lapDistanceOf, lapResults, replay, runCountdown, startKartParkLap } from './helpers/kartParkPilot';
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
// over the Kart Park version 1, never regenerated from newer code. Each sequence is replayed here with the current code from
// the same start on the same file, the frozen version 1 (kartParkV1Text, strategy 2.0.0).
const v1Reading = readTrackData(kartParkV1Text());
if (v1Reading.trackDataStatus !== 'COMPLETE' || !v1Reading.centerline) throw new Error('fixture: the version-1 file must read COMPLETE');
const gV1: TrackGeometry = buildTrackGeometry(v1Reading.centerline, v1Reading.curbs ?? [], v1Reading.barriers ?? []);
const envV1 = trackEnvironment(gV1);
type TraceSequence = { name: string; inputs: [number, number, number][]; states: [number, number, number, number][]; laps: { lapMs: number; sectorMs: number[] }[] };
const trace = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'fixtures', 'kartParkRev1Trace.json'), 'utf8')) as { recordedFromCommit: string; sequences: TraceSequence[] };
const sequence = (name: string) => { const q = trace.sequences.find(s => s.name === name); if (!q) throw new Error(`fixture: no sequence ${name}`); return q; };
const asInput = ([throttle, brake, steer]: [number, number, number]): Input => ({ throttle, brake, steer });
// Replays a lap sequence from runCountdown(startKartParkLap()) with its recorded inputs, step by step.
function replayLap(q: TraceSequence): { lap: LapSession; kart: State[]; laps: LapSession[] } {
  let lap = runCountdown(startKartParkLap(v1Reading, KART_PARK_CONFIG, envV1));
  const kart: State[] = [], laps: LapSession[] = [];
  for (const input of q.inputs) { lap = stepLap(lap, asInput(input)); kart.push(lap.kart); laps.push(lap); }
  return { lap, kart, laps };
}
function replaySeeded(q: TraceSequence): State[] {
  let s = kartAtLapM(0, 0, false, gV1);
  return q.inputs.map(input => (s = step(s, asInput(input), STEP, KART_PARK_CONFIG, envV1)));
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

test('CHK-TEST-0006-05 every sequence of the revision-1 trace, replayed on the version 1, gives step by step the same kart position, heading and speed as before revision 2', () => {
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
    for (const e of [gV1.leftEdge, gV1.rightEdge]) for (let i = 0; i < e.length; i++) best = Math.min(best, closestOnSegment(e[i], e[(i + 1) % e.length], p).distanceM);
    return best;
  };
  let edgeLine = 0, curb = 0, barrier = 0;
  for (const lap of replayed.offset.laps) {
    const k = lap.kart, sin = Math.sin(k.heading), cos = Math.cos(k.heading);
    const wheels = wheelPositions(KART_PARK_CONFIG).map(p => ({ x: k.x + p.forward * sin + p.left * cos, z: k.z + p.forward * cos - p.left * sin }));
    if (wheels.some(w => classifySurface(gV1, w) === 'asphalt' && edgeDistance(w) <= EDGE_LINE_WIDTH_M)) edgeLine++;
    const c = getTrackContact(k, lap.environment, lap.config);
    if ('code' in c) continue;
    if (c.curbWheelCount > 0) curb++;
    if (c.barrierContact) barrier++;
  }
  assert.ok(edgeLine > 0, `NFR-0013: the sequence has a step with a wheel on the edge line, inside the asphalt edge (${edgeLine})`);
  assert.ok(curb > 0, `AC-US-0007-07: the sequence has a step with a wheel on a curb (${curb})`);
  assert.ok(barrier > 0, `NFR-0013: the sequence has a step with barrier contact (${barrier})`);
});

// NFR-0013 2.0.0 on the version 2 (strategy, "execuções com e sem o acabamento"): each sequence is advanced twice in the same
// process, first with no scene built, then with buildTrackScene(geometry) built before the first step and again every 120 steps;
// the trace per step and per lap is kept here. The second run replays the inputs recorded in the first, never the pilot.
type Run = { states: [number, number, number, number][]; laps: { lapMs?: number; sectorMs?: number[]; lapValidity: string }[]; contacts: { edgeLine: number; curb: number; barrier: number } };
const v2EdgeDistance = (p: { x: number; z: number }) => {
  let best = Infinity;
  for (const e of [g.leftEdge, g.rightEdge]) for (let i = 0; i < e.length; i++) best = Math.min(best, closestOnSegment(e[i], e[(i + 1) % e.length], p).distanceM);
  return best;
};
function contactsOf(lap: LapSession, counts: Run['contacts']) {
  const k = lap.kart, sin = Math.sin(k.heading), cos = Math.cos(k.heading);
  const wheels = wheelPositions(KART_PARK_CONFIG).map(p => ({ x: k.x + p.forward * sin + p.left * cos, z: k.z + p.forward * cos - p.left * sin }));
  if (wheels.some(w => classifySurface(g, w) === 'asphalt' && v2EdgeDistance(w) <= EDGE_LINE_WIDTH_M)) counts.edgeLine++;
  const c = getTrackContact(k, lap.environment, lap.config);
  if ('code' in c) return;
  if (c.curbWheelCount > 0) counts.curb++;
  if (c.barrierContact) counts.barrier++;
}
// One lap sequence on the version 2 from runCountdown(startKartParkLap()), with the finish built or not; a recorded input list
// replays it, a controller drives it (and its inputs are returned for the second run).
function runLapSequence(source: { inputs: Input[] } | { controller: (lap: LapSession) => Input; maxSteps: number; stopAfterBarrierSteps?: number }, withFinish: boolean, measure = false): Run & { inputs: Input[] } {
  if (withFinish) buildTrackScene(g);
  let lap = runCountdown(startKartParkLap());
  const states: Run['states'] = [], inputs: Input[] = [];
  const contacts = { edgeLine: 0, curb: 0, barrier: 0 };
  let sinceBarrier = -1;
  const total = 'inputs' in source ? source.inputs.length : source.maxSteps;
  for (let i = 0; i < total; i++) {
    if (withFinish && i > 0 && i % 120 === 0) buildTrackScene(g);
    const input = 'inputs' in source ? source.inputs[i] : source.controller(lap);
    lap = stepLap(lap, input);
    inputs.push(input);
    states.push([lap.kart.x, lap.kart.z, lap.kart.heading, lap.kart.speed]);
    if (measure) contactsOf(lap, contacts);
    if (!('inputs' in source)) {
      if (sinceBarrier < 0 && measure && contacts.barrier > 0) sinceBarrier = 0;
      if (sinceBarrier >= 0 && ++sinceBarrier > (source.stopAfterBarrierSteps ?? Infinity)) break;
      if (source.stopAfterBarrierSteps === undefined && lapResults(lap).length > 0) break;
    }
  }
  const laps = lapResults(lap).map(r => ({ lapMs: r.lapMs, sectorMs: r.sectorMs, lapValidity: r.lapValidity }));
  return { states, laps, contacts, inputs };
}
function runSeeded(withFinish: boolean): Run {
  if (withFinish) buildTrackScene(g);
  const seeded = new Seeded(20261106);
  let s = kartAtLapM(0);
  const states: Run['states'] = [];
  for (let i = 0; i < 2000; i++) {
    if (withFinish && i > 0 && i % 120 === 0) buildTrackScene(g);
    s = step(s, seeded.input(), STEP, KART_PARK_CONFIG, kartParkEnvironment());
    states.push([s.x, s.z, s.heading, s.speed]);
  }
  return { states, laps: [], contacts: { edgeLine: 0, curb: 0, barrier: 0 } };
}
// The offset pilot (recalibrated on the version 2): the kart centre over the first curb longer than 15 m after 60 m, the left
// wheels on the edge line along the 314.3-369.2 m straight of the replica (320-360 m), then a cut across the grass from 385 m
// towards 605 m into the barrier between the two near stretches; the sequence stops 360 steps after the first barrier contact.
const firstLongCurb = g.curbs.find(c => c.fromLapM > 60 && c.toLapM - c.fromLapM > 15)!;
const halfWidth = g.centerline[0].widthM / 2;
const offsetPilot = kartParkPilot(g, {
  offsetM: m => m > firstLongCurb.fromLapM + 1 && m < firstLongCurb.toLapM - 1 ? (firstLongCurb.side === 'LEFT' ? 1 : -1) * (halfWidth + 0.15)
    : m > 320 && m < 360 ? halfWidth - KART_PARK_CONFIG.trackWidth / 2 - EDGE_LINE_WIDTH_M / 2 : 0,
  shortcut: { fromLapM: 385, toLapM: 605 },
  maxSpeedMps: 14,
});
const withoutFinish = {
  valid: runLapSequence({ controller: kartParkPilot(g), maxSteps: 9000 }, false),
  offset: runLapSequence({ controller: offsetPilot, maxSteps: 9000, stopAfterBarrierSteps: 360 }, false, true),
  seeded: runSeeded(false),
};
const withFinishBuilt = {
  valid: runLapSequence({ inputs: withoutFinish.valid.inputs }, true),
  offset: runLapSequence({ inputs: withoutFinish.offset.inputs }, true, true),
  seeded: runSeeded(true),
};
const firstStepDifference = (a: Run['states'], b: Run['states']) => {
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const x = a[i], y = b[i];
    if (!x || !y || x[0] !== y[0] || x[1] !== y[1] || x[2] !== y[2] || x[3] !== y[3]) return `step ${i}: without ${JSON.stringify(x)}, with ${JSON.stringify(y)}`;
  }
  return undefined;
};

test('CHK-TEST-0006-08 on the version 2, each of the three sequences gives in every step the same kart position, heading and speed with and without the visual finish built', () => {
  // AC-US-0007-07, NFR-0013
  for (const name of ['valid', 'offset', 'seeded'] as const) {
    const a = withoutFinish[name].states, b = withFinishBuilt[name].states;
    assert.ok(a.length >= 2000, `fixture: ${name} runs at least 2000 steps (${a.length})`);
    assert.equal(b.length, a.length, `NFR-0013: ${name}: the two runs have the same number of steps`);
    assert.equal(firstStepDifference(a, b), undefined, `NFR-0013: ${name}: the kart must follow the same trajectory with the finish built`);
  }
  assert.ok(new Set(withoutFinish.offset.states.map(s => s.join())).size > 1000, 'fixture: the offset sequence moves');
});

test('CHK-TEST-0006-09 on the version 2, the valid lap gives the same total time to the millisecond and the same 4 sector times with and without the visual finish built', () => {
  // NFR-0013
  const a = withoutFinish.valid.laps, b = withFinishBuilt.valid.laps;
  assert.equal(a.length, 1, `fixture: the pilot completes the lap on the version 2 (${a.length})`);
  assert.equal(a[0].lapValidity, 'VALID', 'fixture: the compared lap is VALID');
  assert.equal(b.length, 1, 'NFR-0013: the lap is completed at the same step with the finish built');
  assert.equal(b[0].lapMs, a[0].lapMs, `NFR-0013: lapMs must be identical with and without the finish (${b[0].lapMs} vs ${a[0].lapMs})`);
  assert.equal(a[0].sectorMs?.length, 4, 'NFR-0013: four sectors compared');
  assert.deepEqual(b[0].sectorMs, a[0].sectorMs, 'NFR-0013: the 4 sector times must be identical one by one');
  assert.deepEqual(withFinishBuilt.offset.laps, withoutFinish.offset.laps, 'NFR-0013: the offset sequence lists the same results');
});

test('CHK-TEST-0006-10 on the version 2, the offset sequence compared with and without the finish crosses the edge line, rides a curb and hits the barrier', () => {
  // NFR-0013, AC-US-0007-07
  for (const [label, run] of [['without', withoutFinish.offset], ['with', withFinishBuilt.offset]] as const) {
    assert.ok(run.contacts.edgeLine > 0, `NFR-0013: ${label} the finish: a step with a wheel on the edge line, inside the asphalt edge (${run.contacts.edgeLine})`);
    assert.ok(run.contacts.curb > 0, `AC-US-0007-07: ${label} the finish: a step with a wheel on a curb (${run.contacts.curb})`);
    assert.ok(run.contacts.barrier > 0, `NFR-0013: ${label} the finish: a step with barrier contact (${run.contacts.barrier})`);
  }
  assert.deepEqual(withFinishBuilt.offset.contacts, withoutFinish.offset.contacts, 'NFR-0013: the same contacts in the same number of steps');
  const lastLapM = lapDistanceOf(g, { x: withoutFinish.offset.states.at(-1)![0], z: withoutFinish.offset.states.at(-1)![1] });
  assert.ok(lastLapM > 360 && lastLapM < 640, `fixture: the offset sequence ends between the two near stretches (${lastLapM.toFixed(1)} m)`);
});
