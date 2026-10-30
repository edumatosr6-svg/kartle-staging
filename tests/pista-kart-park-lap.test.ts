// TEST-0005 — the training lap of src/lap.ts on the Kart Park, each lap read from the growth of listLapResults: a valid lap with the Kart Park pilot, the missed marker, the cut rule over the
// file edge, the shortcut of curve 4, the curb as track, and the finish, reverse and pause cases as on the synthetic track
// (strategy: lap, integration level, DES-0004, RULE-0001, RULE-0003 of race-lap-validation).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getTrackContact, type Input } from '../src/physics';
import { getLapResult, getLapState, listLapResults, pauseLap, repositionKart, resumeLap, stepLap, type LapResult, type LapSession, type LapStateView } from '../src/lap';
import { toMs } from '../src/lapTiming';
import { describeTrainingResult, formatLapTime, message } from '../src/lapMessages';
import { crossLine, sideOf } from '../src/track';
import { nearestOnCenterline, positionAtLapM } from '../src/trackGeometry';
import { kartParkFile, kartParkGeometry } from './fixtures/kartParkFiles';
import { syntheticReading } from './fixtures/trackFiles';
import { autopilot, completeLap } from './helpers/autopilot';
import {
  completeKartParkLap, constant, drive, IDLE, kartAtLapM, kartParkPilot, lapDistanceOf, lapResults, runCountdown, seedLap, startKartParkLap, type StepHook,
} from './helpers/kartParkPilot';

const g = kartParkGeometry();
const file = kartParkFile();
const view = (lap: LapSession): LapStateView => getLapState(lap) as LapStateView;
const result = (lap: LapSession): Partial<LapResult> & { code?: string } => getLapResult(lap) as Partial<LapResult> & { code?: string };
const contactOf = (lap: LapSession) => { const c = getTrackContact(lap.kart, lap.environment, lap.config); if ('code' in c) throw new Error('fixture: no contact'); return c; };
const widthAt = (lapM: number) => g.centerline[positionAtLapM(g, lapM).index].widthM;
// Lap distance at which a line of the file is crossed by the centerline (the test's own crossing).
const lineLapM = (line: typeof file.markers[number]) => {
  const n = g.centerline.length;
  for (let i = 0; i < n; i++) {
    const a = { x: g.centerline[i].xM, z: g.centerline[i].zM }, b = { x: g.centerline[(i + 1) % n].xM, z: g.centerline[(i + 1) % n].zM };
    const c = crossLine(line, a, b);
    if (c && c.sense === 'FORWARD') return g.cumulativeM[i] + c.fraction * (((i + 1 < n ? g.cumulativeM[i + 1] : g.lapLengthM)) - g.cumulativeM[i]);
  }
  throw new Error('fixture: line not crossed');
};

// The reference lap, once per file: the pilot on the centerline up to the step where listLapResults grows (the training goes
// on), with a trace of the cut counter and the edge distance, and the session just before the closing step (markers, bounds).
const reference = (() => {
  let maxOffTrackSteps = 0, maxBeyond = 0;
  let closing: LapSession | undefined;
  const hook: StepHook = (b, a) => {
    maxOffTrackSteps = Math.max(maxOffTrackSteps, a.offTrackSteps); maxBeyond = Math.max(maxBeyond, contactOf(a).beyondTrackEdgeM);
    if (lapResults(a).length > lapResults(b).length) closing = b;
  };
  const { lap, inputs } = completeKartParkLap(kartParkPilot(g), hook);
  if (!closing) throw new Error('fixture: the reference lap did not close');
  return { lap, inputs, maxOffTrackSteps, maxBeyond, closing };
})();

test('CHK-TEST-0005-01 the Kart Park pilot passes every marker in order and crosses the finish without a cut: the new item of listLapResults is VALID and the next lap starts at that instant', () => {
  // AC-US-0003-10
  const { lap, maxOffTrackSteps, closing } = reference;
  const items = lapResults(lap);
  assert.equal(items.length, 1, `AC-US-0003-10: the finish crossing must add exactly one item to listLapResults (${items.length})`);
  const r = items[0];
  assert.equal(r.lapValidity, 'VALID', `AC-US-0003-10: the lap must be VALID (${r.invalidReason ?? 'no reason'})`);
  assert.equal(r.invalidReason, undefined, 'AC-US-0003-10: a valid lap carries no reason');
  assert.equal(closing.markersPassedCount, file.markers.length, `AC-US-0003-10: every marker must be passed before the finish (${closing.markersPassedCount}/${file.markers.length})`);
  assert.ok(maxOffTrackSteps <= 120, `AC-US-0003-10: the pilot never exceeded the cut window (${maxOffTrackSteps} steps)`);
  assert.equal(r.trackId, 'kart-park', 'AC-US-0003-10: the lap is on the Kart Park');
  assert.equal(r.lapSequenceCount, 1, 'AC-US-0003-10: the item is the first lap of the training');
  assert.equal(lap.phase, 'RUNNING', 'AC-US-0003-10: the training goes on after the finish: the next lap is RUNNING');
  assert.equal(lap.lapSequenceCount, 2, 'AC-US-0003-10: the lap in progress is the second one');
  assert.equal(lap.lapStartMs, r.lapStartMs! + r.trainingLapMs!, 'AC-US-0003-10: the next lap starts at the instant the first one ended');
  assert.equal(view(lap).lapValidity, 'VALID', 'AC-US-0003-10: the next lap starts VALID');
  assert.equal(lap.markersPassedCount, 0, 'AC-US-0003-10: the next lap starts with no marker passed');
  assert.ok(lap.stepCount > 3000 && lap.stepCount < 9000, `AC-US-0003-10: the lap takes a plausible number of steps (${lap.stepCount})`);
});

test('CHK-TEST-0005-02 a valid lap on the Kart Park has a total time and 4 sector times that add up to it, as a valid lap on the synthetic track has', () => {
  // AC-US-0003-11
  const r = lapResults(reference.lap)[0];
  assert.ok(Number.isInteger(r.lapMs) && (r.lapMs as number) > 0, `AC-US-0003-11: lapMs must be a positive integer (${r.lapMs})`);
  assert.equal(r.sectorMs?.length, 4, 'AC-US-0003-11: four sector times');
  assert.equal(r.sectorMs!.reduce((s, v) => s + v, 0), r.lapMs, 'AC-US-0003-11: the sectors add up to the total');
  assert.ok(r.sectorMs!.every(v => Number.isInteger(v) && v > 0), 'AC-US-0003-11: every sector time is a positive integer');
  assert.equal(r.trainingLapMs, r.lapMs, 'AC-US-0003-11: trainingLapMs equals lapMs on a valid lap');
  assert.deepEqual(r.trainingSectorMs, r.sectorMs, 'AC-US-0003-11: trainingSectorMs equals sectorMs on a valid lap');
  assert.deepEqual(getLapResult(reference.lap), r, 'AC-US-0003-11: getLapResult answers the same item');
  assert.equal(view(reference.lap).bestValidLapMs, r.lapMs, 'AC-US-0003-11: the state view of the training shows the lap as its best valid lap');
  assert.match(formatLapTime(r.lapMs as number), /^\d+:\d{2}\.\d{3}$/, 'AC-US-0003-11: the total formats as m:ss.mmm');
  assert.equal(r.lapKind, 'TRAINING', 'AC-US-0003-11: a training lap');
  assert.equal(r.official, false, 'AC-US-0003-11: never official');
  const synthetic = listLapResults(completeLap(syntheticReading(), 'TRAINING', autopilot()).lap).lapResults[0];
  assert.equal(synthetic?.lapValidity, 'VALID', 'AC-US-0003-11: the synthetic reference lap is valid');
  assert.equal(synthetic.sectorMs?.length, 4, 'AC-US-0003-11: the synthetic lap has the same shape of result');
  assert.deepEqual(Object.keys(r).sort(), Object.keys(synthetic).sort(), 'AC-US-0003-11: the Kart Park result has the same fields as the synthetic one');
  // Each sector ends at the crossing of its limit: the limits are crossed in lap order and the bounds grow.
  const bounds = reference.closing.sectorBoundsMs as number[];
  assert.equal(bounds.length, 3, 'AC-US-0003-11: three limits crossed before the finish');
  for (let i = 1; i < 3; i++) assert.ok(bounds[i] > bounds[i - 1], 'AC-US-0003-11: limits crossed in order');
  assert.equal(r.sectorMs![0], bounds[0] - r.lapStartMs!, 'AC-US-0003-11: the first sector ends at the first limit');
});

test('CHK-TEST-0005-03 a lap that skips a marker, passing it 3.5 m beyond the edge for less than the cut window, gets an INVALID item with MISSED_MARKER at the finish', () => {
  // AC-US-0003-05
  const target = 10; // marker 11 (index 10) is skipped
  const markerM = lineLapM(file.markers[target]);
  let lap = runCountdown(startKartParkLap());
  const pilot = kartParkPilot(g);
  let guard = 0;
  while (guard++ < 9000 && lapDistanceOf(g, lap.kart) < markerM - 12) lap = drive(lap, pilot, 1).lap;
  assert.equal(lap.markersPassedCount, target, `AC-US-0003-05: ${target} markers passed before the excursion`);
  const outside = kartAtLapM(markerM - 3, widthAt(markerM - 3) / 2 + 3.5);
  const heading = outside.heading;
  assert.ok(sideOf(file.markers[target], outside) < 0, 'AC-US-0003-05: the excursion starts before the marker line');
  lap = seedLap(lap, { kart: { ...outside, elapsed: lap.kart.elapsed, vx: Math.sin(heading) * 12, vz: Math.cos(heading) * 12, speed: 12 } });
  let run = 0, longest = 0;
  lap = drive(lap, constant(IDLE), 100, (_b, a) => { if (contactOf(a).beyondTrackEdgeM > 3) { run++; longest = Math.max(longest, run); } else run = 0; }).lap;
  assert.ok(longest > 0 && longest <= 120, `AC-US-0003-05: the excursion beyond 3 m lasted ${longest} steps, within the cut window`);
  assert.ok(sideOf(file.markers[target], lap.kart) > 0, 'AC-US-0003-05: the kart passed the marker line while outside its reach');
  assert.equal(lap.markersPassedCount, target, 'AC-US-0003-05: the marker was not counted');
  assert.equal(lap.phase, 'RUNNING', 'AC-US-0003-05: the lap is still running after the excursion');
  assert.equal(view(lap).lapValidity, 'VALID', 'AC-US-0003-05: the excursion within the window did not cut the lap');
  const back = kartAtLapM(markerM + 8, 0);
  lap = seedLap(lap, { kart: { ...back, elapsed: lap.kart.elapsed } });
  lap = drive(lap, kartParkPilot(g), 9000).lap;
  const items = lapResults(lap);
  assert.equal(items.length, 1, `AC-US-0003-05: the finish crossing adds one item to listLapResults (${items.length})`);
  assert.equal(lap.phase, 'RUNNING', 'AC-US-0003-05: the training keeps running after the finish');
  const r = items[0];
  assert.equal(r.lapValidity, 'INVALID', 'AC-US-0003-05: the item must be INVALID');
  assert.equal(r.invalidReason, 'MISSED_MARKER', `AC-US-0003-05: the reason must be MISSED_MARKER (${r.invalidReason})`);
  assert.equal(r.lapMs, undefined, 'AC-US-0003-05: no lap time for an invalid lap');
  assert.equal(describeTrainingResult(r, 'pt').reasonText, 'marcador pulado', 'AC-US-0003-06: the screen reason is "marcador pulado"');
  assert.equal(describeTrainingResult(r, 'pt').reasonText, message('reasonMissedMarker', 'pt'), 'AC-US-0003-06: the reason comes from the message table');
  assert.equal(describeTrainingResult(r, 'en').reasonText, 'missed marker', 'AC-US-0003-06: the English reason');
});

test('CHK-TEST-0005-04 standing more than 3 m beyond the edge of the Kart Park invalidates the lap by CUT in the 121st consecutive step, and the lap goes on', () => {
  // AC-US-0003-07
  const started = runCountdown(startKartParkLap());
  const far = kartAtLapM(105, widthAt(105) / 2 + 4);
  let lap = seedLap(started, { kart: far });
  const beyond = contactOf(lap).beyondTrackEdgeM;
  assert.ok(beyond > 3 && beyond < 4.5, `AC-US-0003-07: the fixture stands about 4 m beyond the edge (${beyond.toFixed(2)} m)`);
  lap = drive(lap, constant(IDLE), 120).lap;
  assert.equal(view(lap).lapValidity, 'VALID', 'AC-US-0003-07: 120 steps (1000 ms) beyond 3 m do not invalidate yet');
  assert.equal(lap.offTrackSteps, 120, 'AC-US-0003-07: the cut counter counts the steps');
  lap = stepLap(lap, IDLE);
  assert.equal(view(lap).lapValidity, 'INVALID', 'AC-US-0003-07: the 121st step invalidates the lap');
  assert.equal(view(lap).invalidReason, 'CUT', 'AC-US-0003-07: the reason is CUT');
  assert.equal(lap.phase, 'RUNNING', 'AC-US-0003-07: the cut does not end a training lap');
  assert.equal(lapResults(lap).length, 0, 'AC-US-0003-07: listLapResults gains no item in the step of the cut');
  assert.equal(view(lap).elapsedMs, toMs(121), 'AC-US-0003-07: the cut happens in the 121st step');
  lap = drive(lap, constant(IDLE), 60).lap;
  assert.equal(lap.stepCount, 181, 'AC-US-0003-07: the lap keeps stepping after the cut');
  assert.equal(view(lap).invalidReason, 'CUT', 'AC-US-0003-07: the lap stays INVALID by CUT');
  assert.equal(lapResults(lap).length, 0, 'AC-US-0003-07: still no item before the finish');
});

test('CHK-TEST-0005-05 up to 1000 ms beyond 3 m followed by a return to 3 m or less does not invalidate, and the count restarts', () => {
  // AC-US-0003-08
  const started = runCountdown(startKartParkLap());
  const far = kartAtLapM(105, widthAt(105) / 2 + 4), nearEdge = kartAtLapM(105, widthAt(105) / 2 + 2);
  assert.ok(contactOf(seedLap(started, { kart: nearEdge })).beyondTrackEdgeM <= 3, 'AC-US-0003-08: the return fixture is within 3 m');
  let lap = drive(seedLap(started, { kart: far }), constant(IDLE), 120).lap;
  assert.equal(view(lap).lapValidity, 'VALID', 'AC-US-0003-08: exactly 1000 ms beyond 3 m must not invalidate');
  lap = drive(seedLap(lap, { kart: nearEdge }), constant(IDLE), 1).lap;
  assert.equal(lap.offTrackSteps, 0, 'AC-US-0003-08: the return resets the counter');
  lap = drive(seedLap(lap, { kart: far }), constant(IDLE), 120).lap;
  assert.equal(view(lap).lapValidity, 'VALID', 'AC-US-0003-08: a second 1000 ms after a return must not invalidate');
  assert.equal(lap.phase, 'RUNNING', 'AC-US-0003-08: the lap keeps running');
  lap = stepLap(lap, IDLE);
  assert.equal(view(lap).invalidReason, 'CUT', 'AC-US-0003-08: only the 121st consecutive step is the cut');
});

test('CHK-TEST-0005-06 a lap that crosses the grass inside curve 4, leaving near 147 m and returning near 200 m, gets an INVALID item at the next finish crossing', () => {
  // AC-US-0003-09
  let grassInside = 0;
  let closing: LapSession | undefined;
  const { lap } = completeKartParkLap(kartParkPilot(g, { shortcut: { fromLapM: 147, toLapM: 200 } }), (b, a) => {
    const c = contactOf(a);
    if (c.wheelSurfaces.includes('GRASS')) {
      const m = lapDistanceOf(g, a.kart);
      if (m > 140 && m < 205) grassInside++;
    }
    if (lapResults(a).length > lapResults(b).length) closing = b;
  });
  assert.ok(grassInside > 20, `AC-US-0003-09: the kart must cross the grass inside curve 4 (${grassInside} steps with a wheel on the grass between 140 and 205 m)`);
  const items = lapResults(lap);
  assert.equal(items.length, 1, `AC-US-0003-09: the next finish crossing adds one item to listLapResults (${items.length})`);
  assert.equal(lap.phase, 'RUNNING', 'AC-US-0003-09: the training keeps running');
  assert.equal(items[0].lapValidity, 'INVALID', 'AC-US-0003-09: the shortcut lap must be INVALID');
  assert.ok(['CUT', 'MISSED_MARKER'].includes(items[0].invalidReason ?? ''), `AC-US-0003-09: invalid by the cut or by a missed marker (${items[0].invalidReason})`);
  assert.ok(closing !== undefined && closing.markersPassedCount < file.markers.length, 'AC-US-0003-09: the shortcut skipped markers');
});

test('CHK-TEST-0005-07 riding a curb for more than 1000 ms with no wheel beyond it is not a cut: the curb counts as track', () => {
  // AC-US-0005-05
  const span = g.curbs.find(c => c.side === 'RIGHT' && c.toLapM - c.fromLapM > 24)!;
  const sign = span.side === 'LEFT' ? 1 : -1;
  let lap = runCountdown(startKartParkLap());
  const fast = kartParkPilot(g);
  let guard = 0;
  while (guard++ < 9000 && lapDistanceOf(g, lap.kart) < span.fromLapM - 12) lap = drive(lap, fast, 1).lap;
  const slow = kartParkPilot(g, { offsetM: m => m > span.fromLapM + 1 && m < span.toLapM - 1 ? sign * (widthAt(m) / 2 + 0.15) : 0, maxSpeedMps: 7 });
  let run = 0, longest = 0, beyond = 0, steps = 0;
  while (steps++ < 3000 && lap.phase === 'RUNNING' && lapDistanceOf(g, lap.kart) < span.toLapM + 6) {
    lap = drive(lap, slow, 1, (_b, a) => {
      const c = contactOf(a);
      beyond = Math.max(beyond, c.beyondTrackEdgeM);
      if (c.curbWheelCount > 0 && !c.wheelSurfaces.includes('GRASS')) { run++; longest = Math.max(longest, run); } else run = 0;
    }).lap;
  }
  assert.ok(longest >= 121, `AC-US-0005-05: the kart must ride the curb with no wheel on the grass for more than 120 consecutive steps (${longest})`);
  assert.equal(beyond, 0, `AC-US-0005-05: the kart centre never left the track while on the curb (max ${beyond.toFixed(3)} m)`);
  assert.equal(lap.phase, 'RUNNING', 'AC-US-0005-05: the lap is still running after the curb');
  assert.equal(view(lap).lapValidity, 'VALID', 'AC-US-0005-05: the lap is not invalidated');
  assert.equal(lap.offTrackSteps, 0, 'AC-US-0005-05: the cut counter stayed at 0 on the curb');
});

test('CHK-TEST-0005-08 crossing the finish again after a completed lap closes the next lap with its own result and leaves the first unchanged', () => {
  // AC-US-0003-11
  const first = lapResults(reference.lap)[0];
  const lap = drive(reference.lap, kartParkPilot(g), 9000).lap;
  const items = lapResults(lap);
  assert.equal(items.length, 2, `AC-US-0003-11: the second finish crossing adds exactly one item (${items.length})`);
  assert.deepEqual(items[0], first, 'AC-US-0003-11: the first result is unchanged');
  assert.equal(items[1].lapSequenceCount, 2, 'AC-US-0003-11: the new item is the second lap');
  assert.equal(items[1].lapStartMs, first.lapStartMs! + first.trainingLapMs!, 'AC-US-0003-11: the second lap starts where the first ended');
  assert.ok(Number.isInteger(items[1].trainingLapMs) && items[1].trainingLapMs! > 0, `AC-US-0003-11: the second lap has its own time (${items[1].trainingLapMs})`);
  assert.equal(lap.lapStartMs, items[1].lapStartMs! + items[1].trainingLapMs!, 'AC-US-0003-11: the third lap starts at the second finish');
  assert.equal(lap.lapSequenceCount, 3, 'AC-US-0003-11: the lap in progress is the third');
  assert.equal(lap.phase, 'RUNNING', 'AC-US-0003-11: the training keeps running');
});

test('CHK-TEST-0005-09 crossing the finish of the Kart Park against the track sense does not end the lap and counts no marker', () => {
  // AC-US-0003-11
  const started = runCountdown(startKartParkLap());
  const reversed = kartAtLapM(2.5, 0, true);
  const heading = reversed.heading;
  let lap = seedLap(started, { kart: { ...reversed, vx: Math.sin(heading) * 5, vz: Math.cos(heading) * 5, speed: 5 } });
  let crossedBack = false;
  lap = drive(lap, constant(IDLE), 120, (b, a) => { const c = crossLine(file.finishLine, b.kart, a.kart); if (c && c.sense === 'REVERSE') crossedBack = true; }).lap;
  assert.ok(crossedBack, 'AC-US-0003-11: the fixture crosses the finish line in reverse');
  assert.equal(lap.phase, 'RUNNING', 'AC-US-0003-11: a reverse crossing does not end the lap');
  assert.equal(result(lap).code, 'NO_RESULT', 'AC-US-0003-11: no result');
  assert.equal(lap.markersPassedCount, 0, 'AC-US-0003-11: no marker counted');
});

test('CHK-TEST-0005-10 a pause freezes the Kart Park lap, the resume continues it, and the markers passed before the pause still count', () => {
  // AC-US-0003-11
  let lap = runCountdown(startKartParkLap());
  const pilot = kartParkPilot(g);
  lap = drive(lap, pilot, 1500).lap;
  const passed = lap.markersPassedCount, steps = lap.stepCount;
  assert.ok(passed >= 3, `AC-US-0003-11: markers passed before the pause (${passed})`);
  const paused = pauseLap(lap, 'FOCUS_LOST');
  assert.ok(paused.ok, 'AC-US-0003-11: the lap can pause');
  if (!paused.ok) return;
  lap = paused.lap;
  assert.equal(view(lap).lapPhase, 'PAUSED', 'AC-US-0003-11: PAUSED');
  for (let i = 0; i < 100; i++) lap = stepLap(lap, { throttle: 1, brake: 0, steer: 0 });
  assert.equal(lap.stepCount, steps, 'AC-US-0003-11: no step while paused');
  assert.deepEqual(lap.kart, paused.lap.kart, 'AC-US-0003-11: the kart does not move while paused');
  const resumed = resumeLap(lap);
  assert.ok(resumed.ok, 'AC-US-0003-11: the lap can resume');
  if (!resumed.ok) return;
  assert.equal(resumed.lap.markersPassedCount, passed, 'AC-US-0003-11: the resume keeps the markers already passed');
  let closing: LapSession | undefined;
  lap = drive(resumed.lap, pilot, 9000, (b, a) => { if (lapResults(a).length > lapResults(b).length) closing = b; }).lap;
  const items = lapResults(lap);
  assert.equal(items.length, 1, `AC-US-0003-11: the finish after the resume adds one item (${items.length})`);
  assert.equal(items[0].lapValidity, 'VALID', `AC-US-0003-11: the lap is valid (${items[0].invalidReason ?? ''})`);
  assert.equal(closing?.markersPassedCount, file.markers.length, 'AC-US-0003-11: the markers before the pause counted');
  assert.equal(lap.phase, 'RUNNING', 'AC-US-0003-11: the training keeps running');
});

test('CHK-TEST-0005-11 the reposition of a training lap on the Kart Park puts the kart on the nearest point of the file centerline, facing the travel sense, at rest', () => {
  // AC-US-0001-06
  const started = runCountdown(startKartParkLap());
  const off = kartAtLapM(250, widthAt(250) / 2 + 4);
  let lap = seedLap(started, { kart: { ...off, vx: 3, vz: 3, speed: Math.hypot(3, 3) }, offTrackSteps: 50 });
  const r = repositionKart(lap);
  assert.ok(r.ok, 'AC-US-0001-06: the reposition is accepted while running');
  if (!r.ok) return;
  lap = r.lap;
  const near = nearestOnCenterline(g, lap.kart);
  assert.ok(near.distanceM <= 1e-6, `AC-US-0001-06: the kart is on the Kart Park centerline (${near.distanceM.toExponential(1)} m)`);
  assert.ok(Math.abs(Math.atan2(Math.sin(lap.kart.heading - near.headingRad), Math.cos(lap.kart.heading - near.headingRad))) <= 1e-9, 'AC-US-0001-06: the kart faces the travel sense');
  assert.equal(lap.kart.speed, 0, 'AC-US-0001-06: the kart is at rest');
  assert.equal(lap.offTrackSteps, 0, 'AC-US-0001-06: the cut counter is reset');
  assert.equal(view(lap).lapValidity, 'VALID', 'AC-US-0001-06: a training reposition does not invalidate');
  const lapM = lapDistanceOf(g, lap.kart);
  assert.ok(Math.abs(lapM - 250) < 2, `AC-US-0001-06: the kart is back near 250 m of the lap (${lapM.toFixed(1)} m)`);
});

test('CHK-TEST-0005-12 the lap on the Kart Park uses the default cut limits of 3 m and 1000 ms and the lines of the file', () => {
  // AC-US-0003-07
  const lap = startKartParkLap();
  assert.equal(lap.lines.cutDistanceM, 3, 'AC-US-0003-07: 3 m');
  assert.equal(lap.lines.cutDurationMs, 1000, 'AC-US-0003-07: 1000 ms');
  assert.deepEqual(lap.lines.finishLine, file.finishLine, 'AC-US-0003-07: the finish line of the file');
  assert.deepEqual([...lap.lines.markers], file.markers, 'AC-US-0003-07: the markers of the file');
  assert.deepEqual([...lap.lines.sectorLimits], file.sectorLimits, 'AC-US-0003-07: the sector limits of the file');
  assert.equal(lap.trackStatus, 'COMPLETE', 'AC-US-0003-07: the Kart Park is COMPLETE');
  const inputs: Input[] = reference.inputs;
  assert.ok(inputs.length === reference.lap.stepCount, 'AC-US-0003-07: one input per running step of the reference lap');
});
