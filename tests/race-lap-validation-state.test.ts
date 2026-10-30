// TEST-0004 — the lap state machine over the real physics: countdown, start, timing, pause (strategy: lap-state, integration, DES-0001).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { WIDTH, type Input } from '../src/physics';
import {
  endTraining, getLapResult, getLapState, listLapResults, pauseLap, repositionKart, resumeLap, startLap, stepLap,
  type LapResult, type LapSession, type LapStateView,
} from '../src/lap';
import { COUNTDOWN_STEPS, interpolateMs, toMs } from '../src/lapTiming';
import { describeLap, describeTrainingResult } from '../src/lapMessages';
import { crossLine, type Line } from '../src/track';
import { readTrackData, type TrackReading } from '../src/trackData';
import { syntheticFile, syntheticReading, withShortMarker } from './fixtures/trackFiles';
import { autopilot, completeLap, constant, DRIVE_OUT, drive, IDLE, kartAt, MAX_LAP_STEPS, replay, runCountdown, seedLap, startSession, type Controller, type StepHook } from './helpers/autopilot';
import { beyondEdgeM, singleCrossing } from './helpers/geometry';
import { Seeded } from './helpers/seeded';

const reading = syntheticReading();
if (reading.trackDataStatus !== 'COMPLETE') throw new Error('fixture: synthetic reading must be COMPLETE');
const view = (lap: LapSession): LapStateView => getLapState(lap) as LapStateView;

test('CHK-TEST-0004-01 the countdown runs 360 steps from 3000 ms to 0 and then the lap is RUNNING', () => {
  // AC-US-0001-01
  let lap = startSession(reading);
  assert.equal(view(lap).lapPhase, 'COUNTDOWN', 'AC-US-0001-01: a started lap must begin in COUNTDOWN');
  assert.equal(view(lap).countdownRemainingMs, 3000, 'AC-US-0001-01: the countdown must start at 3000 ms');
  let previous = 3000;
  for (let i = 1; i < COUNTDOWN_STEPS; i++) {
    lap = stepLap(lap, IDLE);
    const remaining = view(lap).countdownRemainingMs;
    assert.equal(view(lap).lapPhase, 'COUNTDOWN', `AC-US-0001-01: step ${i} of the countdown must still be COUNTDOWN`);
    assert.ok(remaining < previous && remaining > 0, `AC-US-0001-01: countdown must decrease at step ${i} (${previous} -> ${remaining})`);
    previous = remaining;
  }
  lap = stepLap(lap, IDLE);
  assert.equal(view(lap).lapPhase, 'RUNNING', 'AC-US-0001-01: after 360 steps the lap must be RUNNING');
  assert.equal(view(lap).countdownRemainingMs, 0, 'AC-US-0001-01: countdown must read 0 at the green signal');
});

test('CHK-TEST-0004-02 the lap timer reads 0 during the whole countdown', () => {
  // AC-US-0001-04
  let lap = startSession(reading);
  for (let i = 0; i < COUNTDOWN_STEPS; i++) {
    assert.equal(view(lap).elapsedMs, 0, `AC-US-0001-04: elapsedMs must be 0 at countdown step ${i}`);
    lap = stepLap(lap, DRIVE_OUT);
  }
  assert.equal(view(lap).elapsedMs, 0, 'AC-US-0001-04: elapsedMs must be 0 at the green signal');
});

test('CHK-TEST-0004-03 after N steps from the green signal the lap time is N x STEP, with the kart before or after the finish line', () => {
  // AC-US-0001-05
  const started = runCountdown(startSession(reading));
  const finish = singleCrossing(reading.finishLine);
  for (const [label, kart] of [['before', kartAt(finish.index - 3)], ['after', kartAt(finish.index + 3)]] as const) {
    const seeded = seedLap(started, { kart });
    for (const n of [1, 100, 777]) {
      const { lap } = drive(seeded, constant(IDLE), n);
      assert.equal(view(lap).elapsedMs, toMs(n), `AC-US-0001-05: elapsedMs after ${n} steps with the kart ${label} the line must be ${toMs(n)}`);
    }
  }
  const moving = drive(started, constant(DRIVE_OUT), 200).lap;
  assert.equal(view(moving).elapsedMs, toMs(200), 'AC-US-0001-05: elapsedMs after 200 driven steps must be toMs(200)');
});

test('CHK-TEST-0004-04 full throttle during the countdown leaves the kart at speed 0 on the start position at the green signal', () => {
  // AC-US-0001-06
  const start = startSession(reading);
  const green = runCountdown(start, DRIVE_OUT);
  assert.equal(green.phase, 'RUNNING', 'AC-US-0001-06: the lap must be RUNNING at the green signal');
  assert.equal(green.kart.speed, 0, 'AC-US-0001-06: speed must be 0 m/s at the green signal after a jump start');
  assert.equal(green.kart.x, start.kart.x, 'AC-US-0001-06: x must equal the start position after a jump start');
  assert.equal(green.kart.z, start.kart.z, 'AC-US-0001-06: z must equal the start position after a jump start');
  assert.equal(green.kart.heading, start.kart.heading, 'AC-US-0001-06: heading must equal the start heading after a jump start');
});

test('CHK-TEST-0004-05 a jump start gives no invalidation reason: the lap is valid in progress at the green signal', () => {
  // AC-US-0001-07
  const green = runCountdown(startSession(reading), DRIVE_OUT);
  const v = view(green);
  assert.equal(v.lapValidity, 'VALID', 'AC-US-0001-07: lap must be VALID at the green signal after a jump start');
  assert.equal(v.invalidReason, undefined, 'AC-US-0001-07: no invalidReason after a jump start');
  assert.equal(describeLap(v, 'pt').stateText, 'válida em andamento', 'AC-US-0001-07: the screen state must read "válida em andamento"');
});

test('CHK-TEST-0004-06 the lap time after N steps is the same with and without throttle during the countdown', () => {
  // AC-US-0001-08
  const clean = drive(runCountdown(startSession(reading), IDLE), constant(DRIVE_OUT), 300).lap;
  const jumped = drive(runCountdown(startSession(reading), DRIVE_OUT), constant(DRIVE_OUT), 300).lap;
  assert.equal(view(jumped).elapsedMs, toMs(300), 'AC-US-0001-08: elapsedMs after a jump start must be N x STEP without penalty');
  assert.equal(view(jumped).elapsedMs, view(clean).elapsedMs, 'AC-US-0001-08: elapsedMs must not differ because of a jump start');
});

test('CHK-TEST-0004-07 the result of a complete lap carries the total time', () => {
  // AC-US-0002-02
  const { lap } = completeLap(reading);
  const result = getLapResult(lap);
  assert.ok('lapMs' in result, 'AC-US-0002-02: a valid lap must have a result with lapMs');
  assert.ok((result as { lapMs?: number }).lapMs! > 0, 'AC-US-0002-02: lapMs must be positive');
});

test('CHK-TEST-0004-08 the result of a complete lap carries exactly four sector times', () => {
  // AC-US-0002-03
  const { lap } = completeLap(reading);
  const result = getLapResult(lap) as { sectorMs?: number[] };
  assert.equal(result.sectorMs?.length, 4, 'AC-US-0002-03: a valid lap must carry 4 sector times');
});

test('CHK-TEST-0004-09 the four sector times add up to the total time with 0 ms difference, for the autopilot and for seeded offsets', () => {
  // AC-US-0002-05
  const rng = new Seeded(7);
  const offsets = Array.from({ length: 240 }, () => Math.round((rng.next() * 4 - 2) * 10) / 10);
  for (const [label, controller] of [['autopilot', autopilot()], ['seeded offsets', autopilot(i => offsets[i])]] as const) {
    const { lap } = completeLap(reading, 'OFFICIAL', controller);
    const result = getLapResult(lap) as { lapValidity?: string; lapMs?: number; sectorMs?: number[] };
    assert.equal(result.lapValidity, 'VALID', `AC-US-0002-05: the ${label} lap must be VALID for the sum to be judged`);
    const sum = result.sectorMs!.reduce((a, b) => a + b, 0);
    assert.equal(sum, result.lapMs, `AC-US-0002-05: ${label} sectors ${result.sectorMs} sum to ${sum}, lapMs is ${result.lapMs}`);
  }
});

test('CHK-TEST-0004-10 completed sector times appear one at a time, in order, during the lap', () => {
  // AC-US-0002-09
  let seen = 0;
  const { lap } = completeLap(reading, 'OFFICIAL', autopilot(), (before, after) => {
    const b = view(before).completedSectorMs, a = view(after).completedSectorMs;
    assert.ok(a.length === b.length || a.length === b.length + 1, `AC-US-0002-09: completed sectors went from ${b.length} to ${a.length} in one step`);
    for (let i = 0; i < b.length; i++) assert.equal(a[i], b[i], `AC-US-0002-09: sector ${i + 1} time changed after completion`);
    seen = Math.max(seen, a.length);
  });
  assert.equal(lap.validity, 'VALID', 'AC-US-0002-09: the lap must be valid for the sectors to be judged');
  assert.equal(seen, 4, 'AC-US-0002-09: the fourth sector time must be visible at the end of the lap');
});

test('CHK-TEST-0004-11 the result identifies the track and its version as read from the data', () => {
  // AC-US-0002-11
  const { lap } = completeLap(reading);
  const result = getLapResult(lap) as { trackId?: string; trackVersion?: unknown };
  assert.equal(result.trackId, 'synthetic', 'AC-US-0002-11: trackId must come from the track reading');
  assert.equal(result.trackVersion, 2, 'AC-US-0002-11: trackVersion must come from the track reading');
});

test('CHK-TEST-0004-12 pausing by the Esc key stops the lap timer until the lap is resumed', () => {
  // AC-US-0003-05
  const running = drive(runCountdown(startSession(reading)), autopilot(), 500).lap;
  const paused = pauseLap(running, 'ESC_KEY');
  assert.ok(paused.ok, 'AC-US-0003-05: pauseLap(ESC_KEY) must be accepted while RUNNING');
  let lap = paused.lap;
  const atPause = view(lap).elapsedMs;
  for (let i = 0; i < 240; i++) lap = stepLap(lap, DRIVE_OUT);
  assert.equal(view(lap).lapPhase, 'PAUSED', 'AC-US-0003-05: the lap must stay PAUSED');
  assert.equal(view(lap).pauseCause, 'ESC_KEY', 'AC-US-0003-05: the pause cause must be ESC_KEY');
  assert.equal(view(lap).elapsedMs, atPause, 'AC-US-0003-05: elapsedMs must not advance while paused');
});

test('CHK-TEST-0004-13 losing the tab focus pauses the lap and the timer shows the same value when it returns', () => {
  // AC-US-0003-06
  const running = drive(runCountdown(startSession(reading)), autopilot(), 500).lap;
  const paused = pauseLap(running, 'FOCUS_LOST');
  assert.ok(paused.ok, 'AC-US-0003-06: pauseLap(FOCUS_LOST) must be accepted');
  const atPause = view(running).elapsedMs;
  let lap = paused.lap;
  for (let i = 0; i < 1000; i++) lap = stepLap(lap, DRIVE_OUT);
  const resumed = resumeLap(lap);
  assert.ok(resumed.ok, 'AC-US-0003-06: resumeLap must be accepted after FOCUS_LOST');
  assert.equal(view(resumed.lap).elapsedMs, atPause, 'AC-US-0003-06: elapsedMs on return must equal the value at the focus loss');
  assert.equal(view(resumed.lap).lapPhase, 'RUNNING', 'AC-US-0003-06: the lap must be RUNNING again after resume');
});

test('CHK-TEST-0004-14 losing the tilt sensor pauses the lap and the timer stops advancing', () => {
  // AC-US-0003-07
  const running = drive(runCountdown(startSession(reading)), autopilot(), 500).lap;
  const paused = pauseLap(running, 'SENSOR_LOST');
  assert.ok(paused.ok, 'AC-US-0003-07: pauseLap(SENSOR_LOST) must be accepted');
  let lap = paused.lap;
  for (let i = 0; i < 300; i++) lap = stepLap(lap, DRIVE_OUT);
  assert.equal(view(lap).pauseCause, 'SENSOR_LOST', 'AC-US-0003-07: the pause cause must be SENSOR_LOST');
  assert.equal(view(lap).elapsedMs, view(running).elapsedMs, 'AC-US-0003-07: elapsedMs must not advance after the sensor loss');
});

test('CHK-TEST-0004-15 no step advances during the pause: the session is unchanged and the time on resume is the time of the pause', () => {
  // AC-US-0003-08
  const running = drive(runCountdown(startSession(reading)), autopilot(), 700).lap;
  const paused = pauseLap(running, 'ESC_KEY');
  assert.ok(paused.ok, 'AC-US-0003-08: pause must be accepted');
  const frozen = paused.lap;
  const after = stepLap(frozen, DRIVE_OUT);
  assert.equal(after, frozen, 'AC-US-0003-08: stepLap during the pause must return the same session');
  assert.equal(after.stepCount, running.stepCount, 'AC-US-0003-08: stepCount must not advance during the pause');
  assert.deepEqual(after.kart, running.kart, 'AC-US-0003-08: the kart state must not change during the pause');
  const resumed = resumeLap(after);
  assert.ok(resumed.ok, 'AC-US-0003-08: resume must be accepted');
  assert.equal(view(resumed.lap).elapsedMs, toMs(700), 'AC-US-0003-08: elapsedMs on resume must be the time of the pause instant');
});

test('CHK-TEST-0004-16 a paused and resumed official lap stays official and valid in progress', () => {
  // AC-US-0003-09
  const running = drive(runCountdown(startSession(reading)), autopilot(), 600).lap;
  const paused = pauseLap(running, 'ESC_KEY');
  assert.ok(paused.ok, 'AC-US-0003-09: pause must be accepted');
  const resumed = resumeLap(paused.lap);
  assert.ok(resumed.ok, 'AC-US-0003-09: resume must be accepted');
  const v = view(resumed.lap);
  assert.equal(v.lapKind, 'OFFICIAL', 'AC-US-0003-09: the lap must still be OFFICIAL after the pause');
  assert.equal(v.lapValidity, 'VALID', 'AC-US-0003-09: the lap must still be VALID after the pause');
  assert.equal(v.invalidReason, undefined, 'AC-US-0003-09: no invalidReason after the pause');
  const d = describeLap(v, 'pt');
  assert.equal(d.stateText, 'válida em andamento', 'AC-US-0003-09: the screen state must read "válida em andamento" after resume');
  assert.equal(d.pausedText, undefined, 'AC-US-0003-09: no paused text after resume');
});

test('CHK-TEST-0004-17 repeated pauses in the same lap each freeze the timer and the lap stays official', () => {
  // AC-US-0003-09 (abnormal case: repeated pauses)
  let lap = runCountdown(startSession(reading));
  const controller = autopilot();
  for (let round = 0; round < 3; round++) {
    lap = drive(lap, controller, 200).lap;
    const atPause = view(lap).elapsedMs;
    const p = pauseLap(lap, round === 1 ? 'FOCUS_LOST' : 'ESC_KEY');
    assert.ok(p.ok, `AC-US-0003-09: pause ${round + 1} must be accepted`);
    lap = p.lap;
    for (let i = 0; i < 50; i++) lap = stepLap(lap, DRIVE_OUT);
    assert.equal(view(lap).elapsedMs, atPause, `AC-US-0003-09: pause ${round + 1} must freeze elapsedMs`);
    const r = resumeLap(lap);
    assert.ok(r.ok, `AC-US-0003-09: resume ${round + 1} must be accepted`);
    lap = r.lap;
  }
  assert.equal(view(lap).lapKind, 'OFFICIAL', 'AC-US-0003-09: the lap must still be OFFICIAL after repeated pauses');
  assert.equal(view(lap).lapValidity, 'VALID', 'AC-US-0003-09: the lap must still be VALID after repeated pauses');
  assert.equal(view(lap).elapsedMs, toMs(600), 'AC-US-0003-09: elapsedMs must count only the 600 running steps');
});

test('CHK-TEST-0004-18 a pause during the countdown keeps the timer at 0 and resumes the countdown where it stopped', () => {
  // AC-US-0001-04 (abnormal case: pause or focus loss during the countdown)
  let lap = startSession(reading);
  for (let i = 0; i < 100; i++) lap = stepLap(lap, IDLE);
  const remaining = view(lap).countdownRemainingMs;
  const p = pauseLap(lap, 'FOCUS_LOST');
  assert.ok(p.ok, 'AC-US-0001-04: pause during the countdown must be accepted');
  lap = p.lap;
  for (let i = 0; i < 500; i++) lap = stepLap(lap, DRIVE_OUT);
  assert.equal(view(lap).elapsedMs, 0, 'AC-US-0001-04: elapsedMs must still be 0 while paused in the countdown');
  assert.equal(view(lap).countdownRemainingMs, remaining, 'AC-US-0001-04: the countdown must not advance while paused');
  assert.equal(view(lap).resumePhase, 'COUNTDOWN', 'AC-US-0001-04: the pause must resume into COUNTDOWN');
  const r = resumeLap(lap);
  assert.ok(r.ok, 'AC-US-0001-04: resume must be accepted');
  assert.equal(view(r.lap).lapPhase, 'COUNTDOWN', 'AC-US-0001-04: the lap must be back in COUNTDOWN after resume');
  assert.equal(view(r.lap).elapsedMs, 0, 'AC-US-0001-04: elapsedMs must be 0 after resuming the countdown');
});

test('CHK-TEST-0004-19 getLapState answers with a complete, well-typed view at every step from the green signal to the end', () => {
  // AC-US-0009-01
  let frames = 0;
  const { lap } = completeLap(reading, 'OFFICIAL', autopilot(), (_before, after) => {
    const v = getLapState(after);
    assert.ok(!('code' in v), 'AC-US-0009-01: getLapState must not answer NO_ACTIVE_LAP during the lap');
    const s = v as LapStateView;
    assert.ok(['RUNNING', 'ENDED'].includes(s.lapPhase), `AC-US-0009-01: unexpected phase ${s.lapPhase} during the lap`);
    assert.ok(['VALID', 'INVALID'].includes(s.lapValidity), 'AC-US-0009-01: lapValidity must be VALID or INVALID at every step');
    assert.ok(Number.isInteger(s.elapsedMs), 'AC-US-0009-01: elapsedMs must be an integer at every step');
    assert.ok(describeLap(s, 'pt').stateText.length > 0, 'AC-US-0009-01: the state text must be non-empty at every step');
    frames++;
  });
  assert.equal(lap.phase, 'ENDED', 'AC-US-0009-01: the lap must end');
  assert.ok(frames > 1000, 'AC-US-0009-01: the lap must have been observed over many steps');
});

// TEST-0015 — continuous training laps over the real physics (strategy: lap-training, integration, ADR-0006, DES-0001,
// DES-0003, DES-0004, DM-0002), hosted in this file (98-divergences.md: the area `training` cannot be a 15th file while
// CHK-TEST-0010-06 of dirigibilidade counts exactly 14 race-lap-validation suites). Every expected instant comes from the
// test's own finish oracle, never from the session. The block keeps its helpers out of the TEST-0004 checks above.
{
  const FINISH: Line = reading.finishLine;
  const FIN = singleCrossing(FINISH);
  const LIMIT_2 = singleCrossing(reading.sectorLimits[1]);
  const view = (lap: LapSession): LapStateView => getLapState(lap) as LapStateView;
  const results = (lap: LapSession): LapResult[] => listLapResults(lap).lapResults;
  const THROTTLE: Input = { throttle: 1, brake: 0, steer: 0 };
  const PARKED_BEYOND_M = WIDTH / 2 + 5;

  // withoutSectors() of the strategy: the synthetic file without sectorLimits, direction, finish and markers declared.
  function withoutSectors(): TrackReading { const f = syntheticFile(); delete f.sectorLimits; return readTrackData(f); }

  // Finish oracle: for every step, crossLine of the finish over the kart's displacement; each forward crossing gives the
  // step k, the fraction and the expected instant interpolateMs(k, f).
  type Crossing = { k: number; ms: number; after: LapSession };
  function finishOracle(line: Line = FINISH): { crossings: Crossing[]; hook: StepHook } {
    const crossings: Crossing[] = [];
    const hook: StepHook = (before, after) => {
      if (before.phase !== 'RUNNING') return;
      const c = crossLine(line, before.kart, after.kart);
      if (c?.sense === 'FORWARD') crossings.push({ k: before.stepCount, ms: interpolateMs(before.stepCount, c.fraction), after });
    };
    return { crossings, hook };
  }

  // Steps under the controller until `done` holds (or `max` steps), reporting every step to the hooks.
  function until(lap: LapSession, controller: Controller, done: (l: LapSession) => boolean, max: number, ...hooks: StepHook[]): LapSession {
    for (let i = 0; i < max && !done(lap); i++) {
      const input = controller(lap);
      const next = stepLap(lap, input);
      for (const h of hooks) h(lap, next, input);
      lap = next;
    }
    return lap;
  }

  const trainingAtGreen = (r: TrackReading = reading): LapSession => runCountdown(startSession(r, 'TRAINING'));

  // `n` calls of stepLap whatever the phase (drive() stops at ENDED, which would make an after-the-end check vacuous).
  function stepN(lap: LapSession, controller: Controller, n: number): LapSession {
    for (let i = 0; i < n; i++) lap = stepLap(lap, controller(lap));
    return lap;
  }

  // The shared run: a training on the synthetic track driven by autopilot() through three finish crossings and 300 steps
  // more, with one pause by the pause button (30 steps paused) in the middle of the second lap. Every view is recorded.
  type Run = { crossings: Crossing[]; views: LapStateView[]; counts: number[]; crossingSteps: Set<number>; end: LapSession; inputs: Input[]; pausedUnchanged: boolean; pausedElapsed: [number, number] };
  let shared: Run | undefined;
  function threeLaps(): Run {
    if (shared) return shared;
    const { crossings, hook } = finishOracle();
    const views: LapStateView[] = [], counts: number[] = [], inputs: Input[] = [];
    const record: StepHook = (_b, a, input) => { views.push(view(a)); counts.push(results(a).length); inputs.push(input); };
    const controller = autopilot();
    let lap = trainingAtGreen();
    let pausedUnchanged = true, pausedElapsed: [number, number] = [-1, -1];
    for (let i = 0; i < 4 * MAX_LAP_STEPS && crossings.length < 3; i++) {
      if (lap.stepCount === 5000 && lap.phase === 'RUNNING') {
        const p = pauseLap(lap, 'PAUSE_BUTTON');
        if (!p.ok) throw new Error(`fixture: the pause button was rejected with ${p.code}`);
        let paused = p.lap;
        for (let j = 0; j < 30; j++) { const n = stepLap(paused, THROTTLE); pausedUnchanged &&= n === paused; paused = n; views.push(view(paused)); counts.push(results(paused).length); }
        const r = resumeLap(paused);
        if (!r.ok) throw new Error(`fixture: resume was rejected with ${r.code}`);
        pausedElapsed = [view(lap).elapsedMs, view(r.lap).elapsedMs];
        lap = r.lap;
      }
      const input = controller(lap);
      const next = stepLap(lap, input);
      hook(lap, next, input); record(lap, next, input);
      lap = next;
    }
    for (let i = 0; i < 300; i++) { const input = controller(lap); const next = stepLap(lap, input); hook(lap, next, input); record(lap, next, input); lap = next; }
    shared = { crossings, views, counts, crossingSteps: new Set(crossings.map(c => c.k + 1)), end: lap, inputs, pausedUnchanged, pausedElapsed };
    return shared;
  }

  // A training on the green signal with the kart parked `PARKED_BEYOND_M` beyond the edge, held until the cut invalidates it.
  function seededCut(r: TrackReading = reading, base: LapSession = trainingAtGreen(r)): { cut: LapSession; cutStep: number } {
    let lap = seedLap(drive(base, autopilot(), 100).lap, { kart: kartAt(10, 0, -PARKED_BEYOND_M) });
    let run = 0, oracleStep = -1;
    lap = until(lap, constant(IDLE), l => l.validity === 'INVALID', 400, (_b, a) => {
      if (beyondEdgeM(a.kart) > 3) { run++; if (oracleStep < 0 && 25 * run > 3 * 1000) oracleStep = a.stepCount; } else run = 0;
    });
    if (lap.validity !== 'INVALID' || lap.stepCount !== oracleStep) throw new Error(`fixture: the seeded cut must invalidate at the oracle step ${oracleStep}, got ${lap.stepCount}`);
    return { cut: lap, cutStep: oracleStep };
  }

  // From a cut lap: reposition, then autopilot up to the next forward finish crossing; every step between is recorded.
  type CutToFinish = { cut: LapSession; between: LapSession[]; crossing: Crossing; closed: LapSession };
  let cutShared: CutToFinish | undefined;
  function cutToFinish(): CutToFinish {
    if (cutShared) return cutShared;
    const { cut } = seededCut();
    const moved = repositionKart(cut);
    if (!moved.ok) throw new Error(`fixture: reposition was rejected with ${moved.code}`);
    const { crossings, hook } = finishOracle();
    const between: LapSession[] = [moved.lap];
    const closed = until(moved.lap, autopilot(), () => crossings.length > 0, MAX_LAP_STEPS, hook, (_b, a) => { between.push(a); });
    if (crossings.length !== 1) throw new Error('fixture: the oracle must see the finish crossing after the cut');
    between.pop();
    cutShared = { cut, between, crossing: crossings[0], closed };
    return cutShared;
  }

  // A jump of the kart, after sector limit 1, to beyond limit 2 (skipping marker 2 and limit 2), then autopilot to the finish.
  let jumpShared: { lap: LapSession; crossing: Crossing } | undefined;
  function jumpPastLimit2(): { lap: LapSession; crossing: Crossing } {
    if (jumpShared) return jumpShared;
    const afterLimit1 = until(trainingAtGreen(), autopilot(), l => l.sectorBoundsMs.length === 1, MAX_LAP_STEPS);
    if (afterLimit1.markersPassedCount !== 1) throw new Error('fixture: only marker 1 must be passed before limit 1');
    const jumped = seedLap(afterLimit1, { kart: kartAt(LIMIT_2.index + 5) });
    const { crossings, hook } = finishOracle();
    const lap = until(jumped, autopilot(), () => crossings.length > 0, MAX_LAP_STEPS, hook);
    if (crossings.length !== 1) throw new Error('fixture: the oracle must see the finish crossing after the jump');
    jumpShared = { lap, crossing: crossings[0] };
    return jumpShared;
  }

  // A kart state moving at `speed` m/s along its heading (forward = (sin h, cos h), the convention of src/physics.ts).
  const moving = (kart: LapSession['kart'], speed: number): LapSession['kart'] =>
    ({ ...kart, vx: speed * Math.sin(kart.heading), vz: speed * Math.cos(kart.heading), speed });
  // A running training with the kart 3 segments before the finish, facing the track sense, at `speed`.
  const beforeFinish = (lap: LapSession, speed = 10): LapSession => seedLap(lap, { kart: moving(kartAt(FIN.index - 3), speed) });

  test('CHK-TEST-0015-01 in training the next lap starts at the finish crossing instant that closed the previous one, with 0 ms difference', () => {
    // AC-US-0010-01
    const { crossings } = threeLaps();
    assert.equal(crossings.length, 3, 'AC-US-0010-01: the oracle must see three forward finish crossings');
    crossings.forEach((c, i) => {
      const r = results(c.after)[i];
      assert.equal(c.after.phase, 'RUNNING', `AC-US-0010-01: the training must be RUNNING after crossing ${i + 1}`);
      assert.equal(view(c.after).lapStartMs, c.ms, `AC-US-0010-01: lapStartMs of lap ${i + 2} must be the crossing instant ${c.ms} ms, got ${view(c.after).lapStartMs}`);
      assert.equal(view(c.after).lapSequenceCount, i + 2, `AC-US-0010-01: lap ${i + 2} must be in progress after crossing ${i + 1}`);
      assert.equal(r.lapStartMs! + r.trainingLapMs!, c.ms, `AC-US-0010-01: lap ${i + 1} must end at ${c.ms} ms, the instant the next one starts`);
    });
  });

  test('CHK-TEST-0015-02 each training lap time is its closing crossing instant minus its start: the green signal, then the previous crossing', () => {
    // AC-US-0010-05
    const { crossings, end } = threeLaps();
    const rs = results(end);
    assert.equal(rs.length, 3, 'AC-US-0010-05: three results expected');
    rs.forEach((r, i) => {
      const startMs = i === 0 ? 0 : crossings[i - 1].ms;
      assert.equal(r.lapStartMs, startMs, `AC-US-0010-05: lap ${i + 1} must start at ${startMs} ms`);
      assert.ok(Number.isInteger(r.trainingLapMs), `AC-US-0010-05: trainingLapMs ${r.trainingLapMs} must be an integer number of ms`);
      assert.equal(r.trainingLapMs, crossings[i].ms - startMs, `AC-US-0010-05: lap ${i + 1} must last ${crossings[i].ms - startMs} ms, got ${r.trainingLapMs}`);
    });
  });

  test('CHK-TEST-0015-03 the training lap times add up to the simulation time from the green signal to the last crossing, with 0 ms difference', () => {
    // AC-US-0010-06
    const { crossings, end } = threeLaps();
    const sum = results(end).reduce((s, r) => s + r.trainingLapMs!, 0);
    const last = crossings[crossings.length - 1].ms;
    assert.equal(sum, last, `AC-US-0010-06: the sum of the lap times ${sum} must equal the last crossing instant ${last}`);
    assert.equal(view(end).lapStartMs, last, `AC-US-0010-06: the lap in progress must start at the last crossing instant ${last}`);
  });

  test('CHK-TEST-0015-04 listLapResults grows by exactly one per forward finish crossing, numbered 1, 2, 3 without repetition', () => {
    // AC-US-0010-20
    const { crossings, counts, crossingSteps, views, end } = threeLaps();
    const rs = results(end);
    assert.equal(rs.length, crossings.length, `AC-US-0010-20: one result per forward crossing, ${crossings.length} expected, got ${rs.length}`);
    assert.deepEqual(rs.map(r => r.lapSequenceCount), [1, 2, 3], 'AC-US-0010-20: lapSequenceCount must be 1, 2, 3');
    let previous = 0;
    counts.forEach((n, i) => {
      const step = views[i].stepCount, grew = n - previous;
      const atCrossing = crossingSteps.has(step) && views[i].lapPhase === 'RUNNING' && (i === 0 || views[i - 1].stepCount !== step);
      assert.equal(grew, atCrossing ? 1 : 0, `AC-US-0010-20: at step ${step} the results must grow by ${atCrossing ? 1 : 0}, grew by ${grew}`);
      previous = n;
    });
  });

  test('CHK-TEST-0015-05 from the green signal on, through lap ends and a pause, the training never shows a countdown nor ends by itself', () => {
    // AC-US-0010-04
    const { views, pausedUnchanged } = threeLaps();
    assert.ok(pausedUnchanged, 'AC-US-0010-04: no step may advance while paused');
    for (const v of views) {
      assert.notEqual(v.lapPhase, 'COUNTDOWN', `AC-US-0010-04: the countdown came back at step ${v.stepCount}`);
      assert.equal(v.countdownRemainingMs, 0, `AC-US-0010-04: countdownRemainingMs must stay 0 at step ${v.stepCount}`);
      assert.notEqual(v.lapPhase, 'ENDED', `AC-US-0010-14: the training ended by itself at step ${v.stepCount}`);
    }
    assert.ok(views.some(v => v.lapPhase === 'PAUSED'), 'AC-US-0010-04: the fixture must pause by the button');
  });

  test('CHK-TEST-0015-06 the best valid lap is absent before the first valid lap and then is the smallest valid lap time of the training', () => {
    // AC-US-0010-12
    const { crossings, views } = threeLaps();
    const lapMs = crossings.map((c, i) => c.ms - (i === 0 ? 0 : crossings[i - 1].ms));
    for (const v of views) {
      const done = crossings.filter(c => c.k + 1 <= v.stepCount).length;
      if (done === 0) assert.ok(!('bestValidLapMs' in v), `AC-US-0010-12: no best valid lap before the first one, step ${v.stepCount}`);
      else assert.equal(v.bestValidLapMs, Math.min(...lapMs.slice(0, done)), `AC-US-0010-12: after ${done} valid laps the best must be ${Math.min(...lapMs.slice(0, done))} at step ${v.stepCount}`);
    }
  });

  test('CHK-TEST-0015-07 every training result is valid without a reason and not official', () => {
    // AC-US-0010-25
    for (const r of results(threeLaps().end)) {
      assert.equal(r.lapKind, 'TRAINING', 'AC-US-0010-25: the result must be a training result');
      assert.equal(r.official, false, `AC-US-0010-25: training lap ${r.lapSequenceCount} must not be official`);
      assert.equal(r.lapValidity, 'VALID', `AC-US-0010-24: training lap ${r.lapSequenceCount} of the autopilot must be VALID`);
      assert.ok(!('invalidReason' in r), `AC-US-0010-24: a valid training lap must carry no reason (lap ${r.lapSequenceCount})`);
      assert.equal(describeTrainingResult(r, 'pt').unofficialText, 'não oficial', 'AC-US-0010-25: the result must read "não oficial"');
    }
  });

  test('CHK-TEST-0015-08 a lap end at the finish does not stop the kart: one step after the crossing under full throttle the speed is above 0', () => {
    // AC-US-0010-03
    const { crossings, hook } = finishOracle();
    const crossed = until(beforeFinish(trainingAtGreen()), constant(THROTTLE), () => crossings.length > 0, 120, hook);
    assert.equal(crossings.length, 1, 'AC-US-0010-03: the oracle must see the crossing');
    assert.equal(results(crossed).length, 1, 'AC-US-0010-03: the crossing must close the lap');
    const after = stepLap(crossed, THROTTLE);
    assert.equal(after.phase, 'RUNNING', 'AC-US-0010-03: the training must stay RUNNING after the lap end');
    assert.ok(after.kart.speed > 0, `AC-US-0010-03: the kart speed one step after the crossing must be above 0, got ${after.kart.speed}`);
  });

  test('CHK-TEST-0015-09 each forward finish crossing closes at most one lap; reverse crossings close none', () => {
    // AC-US-0010-26
    const { crossings, hook } = finishOracle();
    let lap = until(beforeFinish(trainingAtGreen()), constant(THROTTLE), () => crossings.length > 0, 120, hook);
    assert.equal(results(lap).length, 1, 'AC-US-0010-26: the crossing step must produce 1 result');
    lap = drive(lap, constant(THROTTLE), 60).lap;
    assert.equal(results(lap).length, 1, 'AC-US-0010-26: the steps after the line must produce no result');
    // Reverse: the kart past the line facing against the track sense, driven back across it (REQ-FEAT-0010-28).
    const seq = lap.lapSequenceCount;
    const reverse = finishOracle();
    let crossedBack = false;
    lap = until(seedLap(lap, { kart: moving(kartAt(FIN.index + 2, 0, 0, true), 8) }), constant(THROTTLE), () => crossedBack, 240, (b, a) => {
      const c = crossLine(FINISH, b.kart, a.kart); if (c && c.sense !== 'FORWARD') crossedBack = true; reverse.hook(b, a, THROTTLE);
    });
    assert.ok(crossedBack && reverse.crossings.length === 0, 'AC-US-0010-26: the fixture must cross the finish against the track sense only');
    assert.equal(results(lap).length, 1, 'AC-US-0010-26: a reverse crossing must produce no result');
    assert.equal(lap.lapSequenceCount, seq, 'AC-US-0010-26: a reverse crossing must not start a lap');
    assert.equal(lap.phase, 'RUNNING', 'AC-US-0010-26: a reverse crossing must not end the training');
    const again = finishOracle();
    lap = until(beforeFinish(lap), constant(THROTTLE), () => again.crossings.length > 0, 120, again.hook);
    assert.equal(results(lap).length, 2, 'AC-US-0010-26: the next forward crossing must produce exactly one more result');
  });

  test('CHK-TEST-0015-10 a training cut is marked at once with the reason CUT, the training keeps running and the kart keeps moving', () => {
    // AC-US-0010-07, AC-US-0010-08
    let run = 0, oracleStep = -1;
    const lap = until(trainingAtGreen(), constant(DRIVE_OUT), l => l.validity === 'INVALID', 3000, (_b, a) => {
      if (beyondEdgeM(a.kart) > 3) { run++; if (oracleStep < 0 && 25 * run > 3 * 1000) oracleStep = a.stepCount; } else run = 0;
    });
    assert.ok(oracleStep > 0, 'AC-US-0010-07: the cut oracle must see more than 1000 ms beyond 3 m');
    assert.equal(lap.stepCount, oracleStep, `AC-US-0010-07: the lap must be invalid at the oracle step ${oracleStep}, got ${lap.stepCount}`);
    assert.equal(view(lap).lapValidity, 'INVALID', 'AC-US-0010-07: the state must be INVALID at the cut step');
    assert.equal(view(lap).invalidReason, 'CUT', 'AC-US-0010-07: the reason must be CUT');
    assert.equal(view(lap).lapPhase, 'RUNNING', 'AC-US-0010-07: the training must not end at the cut');
    const shown = describeLap(view(lap), 'pt');
    assert.equal(shown.stateText, 'inválida', 'AC-US-0010-07: the state shown must be "inválida"');
    assert.equal(shown.reasonText, 'corte', 'AC-US-0010-07: the reason shown must be "corte"');
    assert.equal(results(lap).length, 0, 'AC-US-0010-07: the cut must not produce a result');
    const next = stepLap(lap, DRIVE_OUT);
    assert.ok(next.kart.speed > 0, `AC-US-0010-08: one step after the cut under full throttle the speed must be above 0, got ${next.kart.speed}`);
  });

  test('CHK-TEST-0015-11 after a training cut no lap starts until the next forward finish crossing, and the next lap starts at its instant', () => {
    // AC-US-0010-09
    const { cut, between, crossing, closed } = cutToFinish();
    assert.equal(view(cut).invalidReason, 'CUT', 'AC-US-0010-09: the fixture must be cut');
    for (const s of between) {
      assert.equal(s.lapSequenceCount, 1, `AC-US-0010-09: no lap may start between the cut and the crossing (step ${s.stepCount})`);
      assert.equal(results(s).length, 0, `AC-US-0010-09: no result may appear between the cut and the crossing (step ${s.stepCount})`);
      assert.equal(s.validity, 'INVALID', `AC-US-0010-09: the lap must stay INVALID until the crossing (step ${s.stepCount})`);
    }
    const rs = results(closed);
    assert.equal(rs.length, 1, 'AC-US-0010-09: the crossing must close the cut lap with one result');
    assert.equal(rs[0].lapValidity, 'INVALID', 'AC-US-0010-09: the closed lap must be INVALID');
    assert.equal(rs[0].invalidReason, 'CUT', 'AC-US-0010-09: the closed lap must carry the reason CUT');
    assert.equal(view(closed).lapStartMs, crossing.ms, `AC-US-0010-09: the next lap must start at the crossing instant ${crossing.ms}`);
    assert.equal(view(closed).lapSequenceCount, 2, 'AC-US-0010-09: lap 2 must be in progress');
  });

  test('CHK-TEST-0015-12 the finish crossing that makes a training lap a missed-marker lap also starts the next lap at that instant', () => {
    // AC-US-0010-10
    const short = readTrackData(withShortMarker(2));
    if (short.trackDataStatus !== 'COMPLETE') throw new Error('fixture: the short-marker file must be COMPLETE');
    const { crossings, hook } = finishOracle(short.finishLine);
    const lap = until(trainingAtGreen(short), autopilot(4), () => crossings.length > 0, MAX_LAP_STEPS, hook);
    const r = results(lap)[0];
    assert.equal(r?.lapValidity, 'INVALID', 'AC-US-0010-10: the lap that missed marker 2 must be INVALID');
    assert.equal(r.invalidReason, 'MISSED_MARKER', 'AC-US-0010-10: the reason must be MISSED_MARKER');
    assert.equal(lap.phase, 'RUNNING', 'AC-US-0010-10: the training must keep RUNNING');
    assert.equal(view(lap).lapStartMs, crossings[0].ms, `AC-US-0010-10: the next lap must start at the crossing instant ${crossings[0].ms}`);
    assert.equal(r.lapStartMs! + r.trainingLapMs!, crossings[0].ms, 'AC-US-0010-10: the invalid lap must end at the instant the next one starts');
  });

  test('CHK-TEST-0015-13 the lap after an invalid training lap starts valid in progress: no reason, no marker, no sector', () => {
    // AC-US-0010-11
    const short = readTrackData(withShortMarker(2));
    const missed = until(trainingAtGreen(short), autopilot(4), l => results(l).length > 0, MAX_LAP_STEPS);
    for (const [name, lap] of [['cut', cutToFinish().closed], ['missed marker', missed]] as const) {
      assert.equal(results(lap)[0]?.lapValidity, 'INVALID', `AC-US-0010-11: the ${name} fixture must close an INVALID lap`);
      const v = view(lap);
      assert.equal(v.lapValidity, 'VALID', `AC-US-0010-11: after the ${name} lap the new lap must be VALID`);
      assert.ok(!('invalidReason' in v), `AC-US-0010-11: after the ${name} lap the new lap must carry no reason`);
      assert.equal(v.markersPassedCount, 0, `AC-US-0010-11: after the ${name} lap no marker is passed yet`);
      assert.deepEqual(v.completedSectorMs, [], `AC-US-0010-11: after the ${name} lap no sector is completed yet`);
      const shown = describeLap(v, 'pt');
      assert.equal(shown.stateText, 'válida em andamento', `AC-US-0010-11: after the ${name} lap the screen must read "válida em andamento"`);
      assert.equal(shown.reasonText, undefined, `AC-US-0010-11: after the ${name} lap no reason may be shown`);
    }
  });

  test('CHK-TEST-0015-14 an invalid training lap shorter than the best valid lap does not change the best valid lap', () => {
    // AC-US-0010-13
    const first = threeLaps().crossings[0];
    const { crossings, hook } = finishOracle();
    const lap = until(beforeFinish(first.after), constant(THROTTLE), () => crossings.length > 0, 240, hook);
    const rs = results(lap);
    assert.equal(rs.length, 2, 'AC-US-0010-13: the jump must close lap 2');
    assert.equal(rs[1].lapValidity, 'INVALID', 'AC-US-0010-13: lap 2, which skipped every marker, must be INVALID');
    assert.ok(rs[1].trainingLapMs! < first.ms, `AC-US-0010-13: the fixture needs the invalid lap (${rs[1].trainingLapMs} ms) shorter than the valid one (${first.ms} ms)`);
    assert.equal(view(lap).bestValidLapMs, first.ms, `AC-US-0010-13: the best valid lap must stay ${first.ms} ms, got ${view(lap).bestValidLapMs}`);
  });

  test('CHK-TEST-0015-15 only a pause or the end of the training stops the steps: lap ends, a cut and a repositioning do not', () => {
    // AC-US-0010-14
    const short = readTrackData(withShortMarker(2));
    const running = drive(threeLaps().crossings[0].after, autopilot(), 200).lap;
    const moved = repositionKart(running);
    assert.ok(moved.ok, 'AC-US-0010-14: repositioning must be accepted in a running training');
    const states: [string, LapSession][] = [
      ['valid lap end', threeLaps().crossings[0].after],
      ['invalid lap end', until(trainingAtGreen(short), autopilot(4), l => results(l).length > 0, MAX_LAP_STEPS)],
      ['cut', seededCut().cut],
      ['repositioning', moved.lap],
    ];
    for (const [name, start] of states) {
      let lap = start;
      for (let i = 1; i <= 30; i++) {
        lap = stepLap(lap, IDLE);
        assert.equal(lap.stepCount, start.stepCount + i, `AC-US-0010-14: after the ${name}, step ${i} without a command must advance the simulation`);
        assert.equal(lap.phase, 'RUNNING', `AC-US-0010-14: after the ${name} the training must stay RUNNING`);
      }
    }
    const paused = pauseLap(running, 'PAUSE_BUTTON');
    assert.ok(paused.ok, 'AC-US-0010-14: the pause button must be accepted');
    assert.equal(stepLap(paused.lap, THROTTLE), paused.lap, 'AC-US-0010-14: a paused training must not advance');
    const ended = endTraining(running);
    assert.ok(ended.ok, 'AC-US-0010-14: endTraining must be accepted');
    assert.equal(stepLap(ended.lap, THROTTLE), ended.lap, 'AC-US-0010-14: an ended training must not advance');
  });

  test('CHK-TEST-0015-16 the pause button suspends a training lap and its timer: on resume the lap time is the time of the pause', () => {
    // AC-US-0010-15
    const running = drive(threeLaps().crossings[0].after, autopilot(), 300).lap;
    const p = pauseLap(running, 'PAUSE_BUTTON');
    assert.ok(p.ok, 'AC-US-0010-15: pauseLap with PAUSE_BUTTON must be accepted in a running training');
    assert.equal(view(p.lap).lapPhase, 'PAUSED', 'AC-US-0010-15: the training must be PAUSED');
    assert.equal(view(p.lap).pauseCause, 'PAUSE_BUTTON', 'AC-US-0010-15: the cause must be PAUSE_BUTTON');
    let paused = p.lap;
    for (let i = 0; i < 240; i++) paused = stepLap(paused, THROTTLE);
    assert.equal(paused, p.lap, 'AC-US-0010-15: no step may run while paused');
    const r = resumeLap(paused);
    assert.ok(r.ok, 'AC-US-0010-15: resume must be accepted');
    assert.equal(view(r.lap).elapsedMs, view(running).elapsedMs, `AC-US-0010-15: the lap time on resume must be ${view(running).elapsedMs} ms`);
    const { pausedElapsed } = threeLaps();
    assert.equal(pausedElapsed[1], pausedElapsed[0], 'AC-US-0010-15: the shared run must resume with the time of its pause');
  });

  test('CHK-TEST-0015-17 ending the training does not conclude the lap in progress: no result for it, in running, paused or countdown', () => {
    // AC-US-0010-17
    const { crossings } = threeLaps();
    const third = drive(crossings[1].after, autopilot(), 500).lap;
    const e = endTraining(third);
    assert.ok(e.ok, 'AC-US-0010-17: endTraining must be accepted with lap 3 in progress');
    const rs = results(e.lap);
    assert.equal(e.lap.phase, 'ENDED', 'AC-US-0010-17: the training must be ENDED');
    assert.equal(rs.length, 2, `AC-US-0010-17: only the two concluded laps may have results, got ${rs.length}`);
    assert.deepEqual(getLapResult(e.lap), rs[1], 'AC-US-0010-17: the last result must be the one of lap 2');
    assert.ok(!rs.some(r => r.lapSequenceCount === 3), 'AC-US-0010-17: the lap in progress must have no result');
    // REQ-FEAT-0010-30: also during a pause in the middle of a lap and during the countdown.
    const paused = pauseLap(third, 'PAUSE_BUTTON');
    assert.ok(paused.ok, 'AC-US-0010-17: the pause button must be accepted');
    const fromPause = endTraining(paused.lap);
    assert.ok(fromPause.ok && fromPause.lap.phase === 'ENDED' && results(fromPause.lap).length === 2, 'AC-US-0010-17: ending during a pause must end the training without a result for the lap in progress');
    const fromCountdown = endTraining(startSession(reading, 'TRAINING'));
    assert.ok(fromCountdown.ok && fromCountdown.lap.phase === 'ENDED' && results(fromCountdown.lap).length === 0, 'AC-US-0010-17: ending during the countdown must end the training without a result');
  });

  test('CHK-TEST-0015-18 after ending the training no lap starts and nothing changes, and a second end is rejected with LAP_ENDED', () => {
    // AC-US-0010-18
    const e = endTraining(drive(threeLaps().crossings[0].after, autopilot(), 400).lap);
    assert.ok(e.ok, 'AC-US-0010-18: endTraining must be accepted');
    let lap = e.lap;
    for (let i = 0; i < 600; i++) lap = stepLap(lap, THROTTLE);
    assert.deepEqual(lap, e.lap, 'AC-US-0010-18: 600 steps after the end must leave the session unchanged');
    assert.equal(view(lap).lapSequenceCount, view(e.lap).lapSequenceCount, 'AC-US-0010-18: no lap may start after the end');
    assert.equal(results(lap).length, 1, 'AC-US-0010-18: no result may appear after the end');
    assert.deepEqual(endTraining(lap), { ok: false, code: 'LAP_ENDED' }, 'AC-US-0010-18: a second endTraining must be rejected with LAP_ENDED');
  });

  test('CHK-TEST-0015-19 repositioning in training neither invalidates a valid lap nor revalidates a cut lap: the state shown is the same', () => {
    // AC-US-0010-19
    const valid = drive(threeLaps().crossings[0].after, autopilot(), 300).lap;
    const cut = seededCut().cut;
    for (const [name, lap] of [['valid', valid], ['cut', cut]] as const) {
      const r = repositionKart(lap);
      assert.ok(r.ok, `AC-US-0010-19: repositioning must be accepted in the ${name} training lap`);
      assert.equal(view(r.lap).lapValidity, view(lap).lapValidity, `AC-US-0010-19: repositioning must not change the validity of the ${name} lap`);
      assert.equal(view(r.lap).invalidReason, view(lap).invalidReason, `AC-US-0010-19: repositioning must not change the reason of the ${name} lap`);
      for (const lang of ['pt', 'en'] as const) assert.deepEqual(describeLap(view(r.lap), lang), describeLap(view(lap), lang), `AC-US-0010-19: the ${name} lap must read the same before and after repositioning (${lang})`);
    }
  });

  test('CHK-TEST-0015-20 in a following training lap the lap time is the time since the crossing that started it, with repositionings in between', () => {
    // AC-US-0007-06
    const first = threeLaps().crossings[0];
    let lap = first.after;
    const controller = autopilot();
    for (let block = 0; block < 4; block++) {
      lap = drive(lap, controller, 150, (_b, a) => {
        assert.equal(view(a).elapsedMs, toMs(a.stepCount) - first.ms, `AC-US-0007-06: at step ${a.stepCount} the lap time must be ${toMs(a.stepCount) - first.ms} ms`);
      }).lap;
      const r = repositionKart(lap);
      assert.ok(r.ok, 'AC-US-0007-06: repositioning must be accepted');
      lap = r.lap;
      assert.equal(view(lap).elapsedMs, toMs(lap.stepCount) - first.ms, 'AC-US-0007-06: repositioning must add no penalty to the lap time');
    }
    assert.equal(lap.lapSequenceCount, 2, 'AC-US-0007-06: the fixture must stay in lap 2');
  });

  test('CHK-TEST-0015-21 an official lap is unchanged: once ended by the finish or by a cut, no lap follows and no second result appears', () => {
    // AC-US-0010-21
    const completed = until(runCountdown(startSession(reading, 'OFFICIAL')), autopilot(), l => l.phase === 'ENDED', MAX_LAP_STEPS);
    const cut = until(runCountdown(startSession(reading, 'OFFICIAL')), constant(DRIVE_OUT), l => l.phase === 'ENDED', 3000);
    for (const [name, ended] of [['completed', completed], ['cut', cut]] as const) {
      assert.equal(ended.phase, 'ENDED', `AC-US-0010-21: the ${name} official lap must be ENDED`);
      let lap = stepN(ended, autopilot(), 600);
      lap = stepN(beforeFinish(lap), constant(THROTTLE), 120);
      assert.equal(lap.phase, 'ENDED', `AC-US-0010-21: the ${name} official lap must stay ENDED`);
      assert.equal(results(lap).length, 1, `AC-US-0010-21: the ${name} official lap must keep exactly one result`);
      assert.equal(view(lap).lapSequenceCount, 1, `AC-US-0010-21: no lap may start after the ${name} official lap`);
      assert.ok(!('lapSequenceCount' in results(lap)[0]) && !('trainingLapMs' in results(lap)[0]), `AC-US-0010-21: the ${name} official result must carry no training field`);
    }
  });

  test('CHK-TEST-0015-22 an official lap stops the kart at its end: the position does not change in the steps after it', () => {
    // AC-US-0010-22
    const completed = until(runCountdown(startSession(reading, 'OFFICIAL')), autopilot(), l => l.phase === 'ENDED', MAX_LAP_STEPS);
    const cut = until(runCountdown(startSession(reading, 'OFFICIAL')), constant(DRIVE_OUT), l => l.phase === 'ENDED', 3000);
    for (const [name, ended] of [['completed', completed], ['cut', cut]] as const) {
      assert.ok(ended.kart.speed > 0, `AC-US-0010-22: the fixture needs the kart moving when the ${name} lap ends`);
      const lap = stepN(ended, constant(THROTTLE), 600);
      assert.deepEqual(lap.kart, ended.kart, `AC-US-0010-22: the kart must not move after the ${name} official lap ended`);
    }
  });

  test('CHK-TEST-0015-23 a training lap that did not cross a sector limit has null, shown as "—", in the sectors without time', () => {
    // AC-US-0010-23
    const r = results(jumpPastLimit2().lap)[0];
    assert.ok(r, 'AC-US-0010-23: the jump lap must close at the finish');
    const s = r.trainingSectorMs;
    assert.equal(s?.length, 4, 'AC-US-0010-23: four sector positions expected');
    assert.ok(Number.isInteger(s![0]) && s![0]! > 0, `AC-US-0010-23: sector 1 must have a time, got ${s![0]}`);
    assert.equal(s![1], null, 'AC-US-0010-23: sector 2 (limit 2 not crossed) must have no time');
    assert.equal(s![2], null, 'AC-US-0010-23: sector 3 (limit 2 not crossed) must have no time');
    assert.ok(Number.isInteger(s![3]) && s![3]! > 0, `AC-US-0010-23: sector 4 must have a time, got ${s![3]}`);
    const texts = describeTrainingResult(r, 'pt').sectorTexts;
    assert.deepEqual([texts?.[1], texts?.[2]], ['—', '—'], 'AC-US-0010-23: the sectors without time must read "—"');
  });

  test('CHK-TEST-0015-24 every training lap closed at the finish carries its total time and its validity with the reason, sectors declared or not', () => {
    // AC-US-0010-02, AC-US-0010-24
    const jump = jumpPastLimit2();
    const plain = withoutSectors();
    const plainValid = until(trainingAtGreen(plain), autopilot(), l => results(l).length > 0, MAX_LAP_STEPS);
    const plainCutStart = repositionKart(seededCut(plain).cut);
    if (!plainCutStart.ok) throw new Error('fixture: reposition after the cut was rejected');
    const plainCut = until(plainCutStart.lap, autopilot(), l => results(l).length > 0, MAX_LAP_STEPS);
    const cases: [string, LapResult, 'VALID' | 'INVALID', string | undefined, number][] = [
      ['valid', results(threeLaps().end)[0], 'VALID', undefined, threeLaps().crossings[0].ms],
      ['cut', results(cutToFinish().closed)[0], 'INVALID', 'CUT', cutToFinish().crossing.ms],
      ['missed marker', results(jump.lap)[0], 'INVALID', 'MISSED_MARKER', jump.crossing.ms],
      ['valid, no sectors', results(plainValid)[0], 'VALID', undefined, -1],
      ['cut, no sectors', results(plainCut)[0], 'INVALID', 'CUT', -1],
    ];
    for (const [name, r, validity, reason, expectedMs] of cases) {
      assert.ok(r, `AC-US-0010-02: the ${name} lap must have a result`);
      assert.ok(Number.isInteger(r.trainingLapMs) && r.trainingLapMs! > 0, `AC-US-0010-02: the ${name} lap must carry its total time, got ${r.trainingLapMs}`);
      if (expectedMs >= 0) assert.equal(r.trainingLapMs, expectedMs, `AC-US-0010-02: the ${name} lap total must be ${expectedMs} ms`);
      assert.equal(r.lapValidity, validity, `AC-US-0010-24: the ${name} lap must be ${validity}`);
      assert.equal(r.invalidReason, reason, `AC-US-0010-24: the ${name} lap must carry the reason ${reason ?? 'none'}`);
    }
  });

  test('CHK-TEST-0015-25 on a track without declared sectors a training result carries only the total time and the validity', () => {
    // AC-US-0010-27
    const plain = withoutSectors();
    assert.equal(plain.trackDataStatus, 'INCOMPLETE', 'AC-US-0010-27: the fixture without sectors must be INCOMPLETE');
    const lap = until(trainingAtGreen(plain), autopilot(), l => results(l).length > 0, MAX_LAP_STEPS);
    const r = results(lap)[0];
    assert.ok(r && Number.isInteger(r.trainingLapMs), 'AC-US-0010-27: the lap must carry its total time');
    assert.ok(!('trainingSectorMs' in r), 'AC-US-0010-27: no training sector time may appear without declared sectors');
    assert.ok(!('sectorMs' in r), 'AC-US-0010-27: no sector time may appear without declared sectors');
    assert.deepEqual(view(lap).completedSectorMs, [], 'AC-US-0010-27: no completed sector may appear without declared sectors');
    assert.equal(describeTrainingResult(r, 'pt').sectorTexts, undefined, 'AC-US-0010-27: no sector line may be built without declared sectors');
  });

  test('CHK-TEST-0015-26 a training lap already cut that is cut again and skips a marker ends at the finish with the single reason CUT', () => {
    // AC-US-0010-09 (REQ-FEAT-0010-29)
    const moved = repositionKart(seededCut().cut);
    assert.ok(moved.ok, 'AC-US-0010-09: repositioning must be accepted after the cut');
    // Second cut: parked beyond the edge again for twice the cut duration, then a jump past marker 2.
    let run = 0, maxRun = 0;
    const parked = until(seedLap(moved.lap, { kart: kartAt(40, 0, -PARKED_BEYOND_M) }), constant(IDLE), () => false, 240, (_b, a) => {
      run = beyondEdgeM(a.kart) > 3 ? run + 1 : 0; maxRun = Math.max(maxRun, run);
    });
    assert.ok(25 * maxRun > 3 * 1000, 'AC-US-0010-09: the fixture must stay beyond 3 m for more than 1000 ms a second time');
    assert.equal(view(parked).invalidReason, 'CUT', 'AC-US-0010-09: the lap must stay CUT after a second cut');
    assert.equal(parked.phase, 'RUNNING', 'AC-US-0010-09: a second cut must not end the training');
    const m2 = singleCrossing(reading.markers[1]);
    const lap = until(seedLap(parked, { kart: kartAt(m2.index + 3) }), autopilot(), l => results(l).length > 0, MAX_LAP_STEPS);
    const r = results(lap)[0];
    assert.equal(r?.lapValidity, 'INVALID', 'AC-US-0010-09: the lap must close INVALID');
    assert.equal(r.invalidReason, 'CUT', `AC-US-0010-09: the first reason CUT must be the only one, got ${r.invalidReason}`);
  });

  test('CHK-TEST-0015-27 the best valid lap is not kept beyond its training: gone after the end and absent in a new training until its first valid lap', () => {
    // AC-US-0010-12 (REQ-FEAT-0010-32)
    const withBest = drive(threeLaps().crossings[0].after, autopilot(), 100).lap;
    assert.ok(view(withBest).bestValidLapMs !== undefined, 'AC-US-0010-12: the fixture must have a best valid lap');
    const e = endTraining(withBest);
    assert.ok(e.ok, 'AC-US-0010-12: endTraining must be accepted');
    assert.ok(!('bestValidLapMs' in view(e.lap)), 'AC-US-0010-12: the best valid lap must be gone after the end of the training');
    const again = startLap(e.lap, { lapKind: 'TRAINING', trackId: reading.trackId, trackVersion: reading.trackVersion }, reading, e.lap.config);
    assert.ok(again.ok, 'AC-US-0010-12: a new training must be accepted after the end');
    assert.ok(!('bestValidLapMs' in view(again.lap)), 'AC-US-0010-12: a new training must not show the previous best valid lap');
    assert.equal(results(again.lap).length, 0, 'AC-US-0010-12: a new training starts without results');
    // A first INVALID lap of the new training (a jump to just before the finish) still leaves no best valid lap.
    const { crossings, hook } = finishOracle();
    const firstInvalid = until(beforeFinish(runCountdown(again.lap)), constant(THROTTLE), () => crossings.length > 0, 240, hook);
    assert.equal(results(firstInvalid)[0]?.lapValidity, 'INVALID', 'AC-US-0010-12: the fixture must close an INVALID first lap');
    assert.ok(!('bestValidLapMs' in view(firstInvalid)), 'AC-US-0010-12: no best valid lap after only an invalid lap of the new training');
  });

  test('CHK-TEST-0015-28 the same training inputs replayed from the same start give the same sessions, results and lap times', () => {
    // NFR-0001, NFR-0009
    const { inputs, end } = threeLaps();
    const replayed = drive(trainingAtGreen(), replay(inputs), inputs.length).lap;
    // The shared run paused once; the pause changes no step, so the replay without it reaches the same step and state.
    assert.equal(replayed.stepCount, end.stepCount, 'NFR-0001: the replay must reach the same step');
    assert.deepEqual(replayed.kart, end.kart, 'NFR-0001: the replay must reach the same kart state');
    assert.deepEqual(results(replayed), results(end), 'NFR-0009: the replay must produce the same training results');
    assert.deepEqual(view(replayed), view(end), 'NFR-0009: the replay must produce the same lap state');
  });
}
