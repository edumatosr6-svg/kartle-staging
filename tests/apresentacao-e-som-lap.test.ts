// TEST-0003 — the sound over real laps and the three `npm test` records (API-0002, API-0003, DES-0003, DES-0004): a whole
// lap with the reading of every step handed to the audio output, the pause, the result, the reposition, the sound turned
// off in the middle of a lap, a whole session without the player touching the sound control, the tyre sound over the
// frames in which the scene lays a mark, and SOUND_DETERMINISM, ASSETS_NEUTRAL and SIM_STATE_UNCHANGED (strategy: lap,
// integration level). The simulation is advanced by stepLap only; every instant is a count of steps.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PUBLISHED_SETUPS, STEP, type Input, type SetupRef } from '../src/physics';
import { endTraining, getLapState, pauseLap, repositionKart, resumeLap, stepLap, type LapSession } from '../src/lap';
import { RaceAudio } from '../src/audio';
import type { SoundOutput } from '../src/soundOutput';
import { syntheticReading } from './fixtures/trackFiles';
import { autopilot, startSession } from './helpers/autopilot';
import { IDLE, kartParkPilot, runCountdown, startKartParkLap } from './helpers/kartParkPilot';
import { tyreMarkRunner } from './helpers/kart01Report';
import { fakeAudio, gainOf, lastEvent, sourcesOf, withAudioGlobals, type FakeAudio, type FakeNode } from './helpers/soundContext';
import {
  assetsNeutralCheck, embeddedRecordings, frameReading, judgeTimes, KART_PARK_SETUP, readBaselineData, rearOnAsphalt, runKartParkLapWithSound,
  serializeRecord, simStateUnchangedCheck, soundDeterminismCheck, type SoundRun,
} from './helpers/soundReport';

const STEP_MS = STEP * 1000;
// The lap with the sound on is driven once and shared by the checks that read it.
let soundOnRun: Promise<SoundRun> | undefined;
const lapWithSoundOn = () => (soundOnRun ??= runKartParkLapWithSound('SOUND_ON'));

// A frame loop reduced to the sound: the lap, an audio output over the substitute, and a clock that counts steps.
type Rig = {
  fake: FakeAudio; audio: RaceAudio; lap: LapSession; setup: SetupRef; ticks: number; repositionAcceptedAtMs?: number;
  nowMs(): number;
  // The reading of the current frame handed to the audio output; `throttleNorm` is the one of the last advanced step.
  show(tireMarkingAsphalt?: boolean, nowMs?: number): SoundOutput;
  // One step under `input`, then the frame.
  step(input: Input, tireMarkingAsphalt?: boolean): SoundOutput;
  engine(): { source: FakeNode; gain: FakeNode };
  tire(): { source: FakeNode; gain: FakeNode };
};
async function withRig<T>(lap: LapSession, setup: SetupRef, soundOn: boolean, body: (rig: Rig) => T | Promise<T>): Promise<T> {
  const fake = fakeAudio();
  return withAudioGlobals(fake, async () => {
    const audio = new RaceAudio();
    await audio.loadRecordings(embeddedRecordings());
    if (soundOn) audio.setSoundOn(true);
    let throttleNorm = 0;
    const voice = (index: number) => { const source = sourcesOf(fake)[index]; if (!source) throw new Error('fixture: the source does not exist'); return { source, gain: gainOf(source) }; };
    const rig: Rig = {
      fake, audio, lap, setup, ticks: 0,
      nowMs() { return rig.ticks * STEP_MS; },
      show(tireMarkingAsphalt = false, nowMs = rig.nowMs()) {
        if (fake.contexts[0]) fake.contexts[0].currentTime = nowMs / 1000;
        return audio.refresh(frameReading(rig.lap, setup, { nowMs, throttleNorm, tireMarkingAsphalt, repositionAcceptedAtMs: rig.repositionAcceptedAtMs }));
      },
      step(input, tireMarkingAsphalt = false) {
        rig.lap = stepLap(rig.lap, input); rig.ticks++; throttleNorm = input.throttle;
        return rig.show(tireMarkingAsphalt);
      },
      // The engine recording is decoded and built first, the tyre second (the order of loadRecordings).
      engine: () => voice(0), tire: () => voice(1),
    };
    return body(rig);
  });
}
const phaseOf = (lap: LapSession) => { const s = getLapState(lap); return 'code' in s ? 'NONE' : s.lapPhase; };
const positiveRamps = (node: FakeNode, from = 0) => node.gain.events.slice(from).filter(e => e.kind !== 'cancelScheduledValues' && (e.value ?? 0) > 0);
// A Kart Park training lap already running, driven by the test pilot for `steps` steps.
async function runningKartPark<T>(steps: number, soundOn: boolean, body: (rig: Rig, pilot: (lap: LapSession) => Input) => T | Promise<T>): Promise<T> {
  const pilot = kartParkPilot();
  return withRig(runCountdown(startKartParkLap()), KART_PARK_SETUP, soundOn, rig => {
    for (let i = 0; i < steps; i++) rig.step(pilot(rig.lap));
    assert.equal(phaseOf(rig.lap), 'RUNNING', 'fixture: the lap is running');
    return body(rig, pilot);
  });
}

test('CHK-TEST-0003-01 over a whole lap of the Kart Park with the sound on, every step of the running lap asks for the engine with a gain above 0, and the engine source is never stopped nor faded to 0', async () => {
  // AC-US-0003-01
  const run = await lapWithSoundOn();
  assert.ok(run.times.lapMs !== undefined && run.outputs.length > 5000, `AC-US-0003-01: fixture: the pilot closes a lap (${run.times.lapMs} ms, ${run.outputs.length} steps)`);
  const runningSteps = run.outputs.filter(o => o.lapPhase === 'RUNNING');
  assert.equal(runningSteps.length, run.outputs.length, 'AC-US-0003-01: fixture: every driven step of the lap is RUNNING');
  const silent = run.outputs.findIndex(o => o.output.engineSoundState !== 'ENGINE_PLAYING' || !(o.output.engineGainNorm > 0));
  assert.equal(silent, -1, `AC-US-0003-01: no step of the running lap leaves the engine silent (step ${silent})`);
  const stopped = run.outputs.filter(o => o.output.engineGainNorm > 0 && o.output.engineGainNorm < 0.35 - 1e-9).length;
  assert.equal(stopped, 0, 'AC-US-0003-01: the engine gain never falls below the idle gain while the lap runs');
  const engine = sourcesOf(run.fake!)[0], gain = gainOf(engine);
  assert.equal(engine.loop, true, 'AC-US-0003-01: the engine source repeats');
  assert.equal(engine.startCount, 1, 'AC-US-0003-01: the engine source is started once for the whole lap');
  assert.equal(engine.stopCount, 0, 'AC-US-0003-01: and never stopped');
  // After the first rise nothing is scheduled at 0 again (before it, the ramp is anchored at the silence it starts from).
  const firstRise = gain.gain.events.findIndex(e => e.kind === 'linearRampToValueAtTime' && e.value! > 0);
  assert.ok(firstRise >= 0 && gain.gain.events[firstRise].timeS * 1000 <= 50, 'AC-US-0003-01: the engine gain rises within 50 ms of the first step of the lap');
  const toZero = gain.gain.events.slice(firstRise).filter(e => e.kind !== 'cancelScheduledValues' && e.value === 0);
  assert.equal(toZero.length, 0, 'AC-US-0003-01: nothing brings the engine gain to 0 during the lap: no gap of silence');
  assert.ok(run.outputs.some(o => o.output.enginePitchRatio > 1.4) && run.outputs.some(o => o.output.enginePitchRatio < 1.0), 'AC-US-0003-02: over the lap the pitch goes from low to high with the speed');
});

test('CHK-TEST-0003-02 pausing a running lap silences the engine in the first evaluation, with the gain ramped to 0 in 80 ms, and the engine is back when the lap is resumed', async () => {
  // AC-US-0003-04
  await runningKartPark(300, true, (rig, pilot) => {
    assert.equal(rig.audio.getSoundOutput().engineSoundState, 'ENGINE_PLAYING', 'AC-US-0003-04: fixture: the engine plays before the pause');
    const paused = pauseLap(rig.lap, 'PAUSE_BUTTON');
    assert.ok(paused.ok, 'AC-US-0003-04: fixture: the pause is accepted');
    rig.lap = paused.lap;
    const out = rig.show();
    assert.equal(out.engineSoundState, 'ENGINE_SILENT', 'AC-US-0003-04: the first evaluation with the lap paused is ENGINE_SILENT');
    assert.equal(out.engineGainNorm, 0, 'AC-US-0003-04: and asks for gain 0');
    const { gain } = rig.engine();
    const ramp = lastEvent(gain.gain);
    assert.equal(ramp?.kind, 'linearRampToValueAtTime', 'AC-US-0003-04: the silence is a linear ramp on the engine gain');
    assert.equal(ramp!.value, 0, 'AC-US-0003-04: that ends at exactly 0');
    const lengthMs = ramp!.timeS * 1000 - rig.nowMs();
    assert.ok(lengthMs > 0 && lengthMs < 200, `AC-US-0003-04: the engine is silent in less than 200 ms after the pause (${lengthMs} ms)`);
    assert.ok(Math.abs(lengthMs - 80) <= 1e-6, `AC-US-0003-04: 80 ms after the current time (${lengthMs} ms)`);
    const events = gain.gain.events.length;
    for (let i = 0; i < 60; i++) { rig.ticks++; assert.equal(rig.show().engineSoundState, 'ENGINE_SILENT', 'AC-US-0003-04: the engine stays silent while the lap is paused'); }
    assert.equal(positiveRamps(gain, events).length, 0, 'AC-US-0003-04: nothing schedules engine sound during the pause');
    const resumed = resumeLap(rig.lap);
    assert.ok(resumed.ok, 'AC-US-0003-04: fixture: the resume is accepted');
    rig.lap = resumed.lap;
    const back = rig.step(pilot(rig.lap));
    assert.equal(back.engineSoundState, 'ENGINE_PLAYING', 'AC-US-0003-01: with the lap running again the engine plays');
    const up = lastEvent(gain.gain);
    assert.ok(up?.kind === 'linearRampToValueAtTime' && up.value! > 0 && up.timeS * 1000 - rig.nowMs() <= 50, 'AC-US-0003-01: sounding again within 50 ms');
  });
});

test('CHK-TEST-0003-03 when the lap ends with its result the first evaluation silences the engine, with the gain ramped to 0 in 80 ms', async () => {
  // AC-US-0003-05
  const arcade = PUBLISHED_SETUPS.ARCADE_ASSISTIDO;
  const setup: SetupRef = { setupId: arcade.setupId, setupVersion: arcade.setupVersion };
  const config = { ...arcade.config, driverMass: 75 };
  const pilot = autopilot(0, config);
  await withRig(startSession(syntheticReading(), 'OFFICIAL', config), setup, true, rig => {
    let countdownFrames = 0;
    while (phaseOf(rig.lap) === 'COUNTDOWN') {
      const out = rig.step(IDLE);
      // The step that ends the countdown leaves the lap running.
      if (phaseOf(rig.lap) !== 'COUNTDOWN') break;
      countdownFrames++;
      assert.equal(out.engineSoundState, 'ENGINE_SILENT', 'AC-US-0003-01: the engine is silent during the countdown');
    }
    assert.ok(countdownFrames > 100, 'AC-US-0003-01: fixture: the countdown was evaluated');
    let before = rig.audio.getSoundOutput();
    for (let guard = 0; guard < 9000; guard++) {
      before = rig.audio.getSoundOutput();
      const out = rig.step(pilot(rig.lap));
      if (phaseOf(rig.lap) === 'ENDED') {
        assert.equal(before.engineSoundState, 'ENGINE_PLAYING', 'AC-US-0003-05: fixture: the engine plays in the last step of the lap');
        assert.equal(out.engineSoundState, 'ENGINE_SILENT', 'AC-US-0003-05: the first evaluation with the lap ended is ENGINE_SILENT');
        assert.equal(out.engineGainNorm, 0, 'AC-US-0003-05: and asks for gain 0');
        break;
      }
      assert.equal(out.engineSoundState, 'ENGINE_PLAYING', `AC-US-0003-01: the engine plays in step ${guard} of the running lap`);
    }
    assert.equal(phaseOf(rig.lap), 'ENDED', 'AC-US-0003-05: fixture: the pilot finishes the official lap');
    const { source, gain } = rig.engine();
    const ramp = lastEvent(gain.gain);
    assert.equal(ramp?.kind, 'linearRampToValueAtTime', 'AC-US-0003-05: the silence is a linear ramp on the engine gain');
    assert.equal(ramp!.value, 0, 'AC-US-0003-05: that ends at exactly 0');
    const lengthMs = ramp!.timeS * 1000 - rig.nowMs();
    assert.ok(lengthMs > 0 && lengthMs < 200, `AC-US-0003-05: the engine is silent in less than 200 ms after the result (${lengthMs} ms)`);
    assert.ok(Math.abs(lengthMs - 80) <= 1e-6, `AC-US-0003-05: 80 ms after the current time (${lengthMs} ms)`);
    assert.equal(source.stopCount, 0, 'AC-US-0003-05: the source is not stopped: silence is gain 0');
    for (let i = 0; i < 30; i++) { rig.ticks++; assert.equal(rig.show().engineGainNorm, 0, 'AC-US-0003-05: the engine stays silent on the result'); }
  });
  // A training ended by the player is ENDED as well.
  await runningKartPark(200, true, rig => {
    const ended = endTraining(rig.lap);
    assert.ok(ended.ok, 'AC-US-0003-05: fixture: the training is ended');
    rig.lap = ended.lap;
    const out = rig.show();
    assert.equal(out.engineSoundState, 'ENGINE_SILENT', 'AC-US-0003-05: a training ended is ENGINE_SILENT in the first evaluation');
    assert.equal(lastEvent(rig.engine().gain.gain)?.value, 0, 'AC-US-0003-05: with the engine gain ramped to 0');
  });
});

test('CHK-TEST-0003-04 an accepted reposition silences the engine at once with the gain ramped to 0 in 80 ms, keeps it silent up to 79 ms later, and at 80 ms the engine plays again', async () => {
  // AC-US-0003-06
  await runningKartPark(360, true, (rig, pilot) => {
    assert.equal(rig.audio.getSoundOutput().engineSoundState, 'ENGINE_PLAYING', 'AC-US-0003-06: fixture: the engine plays before the reposition');
    const moved = repositionKart(rig.lap);
    assert.ok(moved.ok, 'AC-US-0003-06: fixture: the reposition is accepted');
    rig.lap = moved.lap;
    assert.equal(phaseOf(rig.lap), 'RUNNING', 'AC-US-0003-06: fixture: the lap is still RUNNING after the reposition');
    const acceptedMs = rig.nowMs();
    rig.repositionAcceptedAtMs = acceptedMs;
    const out = rig.show();
    assert.equal(out.engineSoundState, 'ENGINE_SILENT', 'AC-US-0003-06: the evaluation at the instant of the accepted reposition is ENGINE_SILENT');
    assert.equal(out.engineGainNorm, 0, 'AC-US-0003-06: and asks for gain 0');
    const { gain } = rig.engine();
    const ramp = lastEvent(gain.gain);
    assert.equal(ramp?.kind, 'linearRampToValueAtTime', 'AC-US-0003-06: the silence is a linear ramp on the engine gain');
    assert.equal(ramp!.value, 0, 'AC-US-0003-06: that ends at exactly 0');
    const lengthMs = ramp!.timeS * 1000 - acceptedMs;
    assert.ok(lengthMs > 0 && lengthMs < 200, `AC-US-0003-06: the engine is silent in less than 200 ms after the reposition (${lengthMs} ms)`);
    assert.ok(Math.abs(lengthMs - 80) <= 1e-6, `AC-US-0003-06: 80 ms after the current time (${lengthMs} ms)`);
    // The lap goes on being stepped while the gain falls: a frame per millisecond, a step every 120th of a second.
    let stepsDone = 0;
    for (let ms = 1; ms <= 120; ms++) {
      while ((stepsDone + 1) * STEP_MS <= ms) { rig.lap = stepLap(rig.lap, pilot(rig.lap)); stepsDone++; }
      const frame = rig.show(false, acceptedMs + ms);
      if (ms < 80) assert.equal(frame.engineSoundState, 'ENGINE_SILENT', `AC-US-0003-06: ${ms} ms after the reposition the engine is still silent`);
      else {
        assert.equal(frame.engineSoundState, 'ENGINE_PLAYING', `AC-US-0003-06: ${ms} ms after the reposition the engine plays again`);
        assert.ok(frame.engineGainNorm > 0, `AC-US-0003-06: with a gain above 0 at ${ms} ms`);
      }
    }
    assert.ok(stepsDone >= 14, 'AC-US-0003-06: fixture: the lap advanced during the window');
    const back = [...gain.gain.events].reverse().find(e => e.kind === 'linearRampToValueAtTime' && e.value! > 0);
    assert.ok(back && back.timeS * 1000 >= acceptedMs + 80, `AC-US-0003-06: the engine gain rises again only after the 80 ms in which it reached 0 (${back ? back.timeS * 1000 - acceptedMs : 'never'} ms)`);
  });
});

test('CHK-TEST-0003-05 turning the sound off in the middle of a lap cuts the engine gain to 0 at the instant of the action, with no ramp, and no engine sound is asked while it stays off', async () => {
  // AC-US-0003-07
  await runningKartPark(500, true, (rig, pilot) => {
    const { source, gain } = rig.engine();
    assert.equal(rig.audio.getSoundOutput().engineSoundState, 'ENGINE_PLAYING', 'AC-US-0003-07: fixture: the engine plays');
    const before = gain.gain.events.length;
    const at = rig.fake.contexts[0].currentTime;
    const out = rig.audio.setSoundOn(false);
    assert.equal(out.soundOn, false, 'AC-US-0003-07: the sound is off');
    assert.equal(out.engineSoundState, 'ENGINE_SILENT', 'AC-US-0003-07: the engine is ENGINE_SILENT from the action');
    assert.equal(out.engineGainNorm, 0, 'AC-US-0003-07: and the gain asked is 0');
    const scheduled = gain.gain.events.slice(before);
    const cut = scheduled[scheduled.length - 1];
    assert.equal(cut?.kind, 'setValueAtTime', 'AC-US-0003-07: the last thing scheduled on the engine gain is a value set, not a ramp');
    assert.equal(cut.value, 0, 'AC-US-0003-07: the value set is 0');
    assert.ok(Math.abs(cut.timeS - at) <= 1e-9, `AC-US-0003-07: at the current time of the action (${cut.timeS} s, ${at} s)`);
    assert.equal(scheduled.filter(e => e.kind === 'linearRampToValueAtTime' || e.kind === 'setTargetAtTime' || e.kind === 'exponentialRampToValueAtTime').length, 0, 'AC-US-0003-07: no ramp is scheduled when the sound is turned off');
    const after = gain.gain.events.length;
    for (let i = 0; i < 600; i++) {
      const frame = rig.step(pilot(rig.lap));
      assert.equal(frame.engineSoundState, 'ENGINE_SILENT', 'AC-US-0003-07: with the sound off the engine stays silent while the lap runs');
      assert.equal(frame.engineGainNorm, 0, 'AC-US-0003-07: with gain 0');
    }
    assert.equal(positiveRamps(gain, after).length, 0, 'AC-US-0003-07: nothing schedules engine sound while the sound is off');
    assert.equal(source.stopCount, 0, 'AC-US-0003-07: the source is not stopped');
    assert.equal(rig.audio.setSoundOn(true).engineSoundState, 'ENGINE_PLAYING', 'AC-US-0003-01: turned on again in the middle of the lap, the engine plays from the action');
  });
});

test('CHK-TEST-0003-06 a whole session — countdown, lap, pause, resume, reposition, result — never turns the sound on by itself: only the sound command does', async () => {
  // AC-US-0003-09
  const arcade = PUBLISHED_SETUPS.ARCADE_ASSISTIDO;
  const setup: SetupRef = { setupId: arcade.setupId, setupVersion: arcade.setupVersion };
  const config = { ...arcade.config, driverMass: 75 };
  const pilot = autopilot(0, config);
  await withRig(startSession(syntheticReading(), 'OFFICIAL', config), setup, false, rig => {
    const seen = new Set<string>();
    const off = (out: SoundOutput, moment: string) => {
      seen.add(phaseOf(rig.lap));
      assert.equal(out.soundOn, false, `AC-US-0003-09: the sound is still off ${moment}`);
      assert.equal(out.engineGainNorm, 0, `AC-US-0003-09: no engine sound is asked ${moment}`);
      assert.equal(out.tireGainNorm, 0, `AC-US-0003-09: no tyre sound is asked ${moment}`);
    };
    off(rig.show(), 'when the session opens');
    for (let guard = 0; guard < 1000 && phaseOf(rig.lap) === 'COUNTDOWN'; guard++) off(rig.step(IDLE), 'during the countdown');
    for (let i = 0; i < 400; i++) off(rig.step(pilot(rig.lap), i % 7 === 0), 'while the lap runs');
    const paused = pauseLap(rig.lap, 'ESC_KEY');
    assert.ok(paused.ok, 'AC-US-0003-09: fixture: the pause is accepted');
    rig.lap = paused.lap; off(rig.show(), 'in the pause');
    const resumed = resumeLap(rig.lap);
    assert.ok(resumed.ok, 'AC-US-0003-09: fixture: the resume is accepted');
    rig.lap = resumed.lap; off(rig.show(), 'after the resume');
    for (let i = 0; i < 200; i++) off(rig.step(pilot(rig.lap)), 'while the resumed lap runs');
    const moved = repositionKart(rig.lap);
    assert.ok(moved.ok, 'AC-US-0003-09: fixture: the reposition is accepted');
    rig.lap = moved.lap; rig.repositionAcceptedAtMs = rig.nowMs(); off(rig.show(), 'at the reposition');
    for (let guard = 0; guard < 9000 && phaseOf(rig.lap) !== 'ENDED'; guard++) off(rig.step(pilot(rig.lap)), 'until the result');
    off(rig.show(), 'on the result');
    assert.deepEqual([...seen].sort(), ['COUNTDOWN', 'ENDED', 'PAUSED', 'RUNNING'], 'AC-US-0003-09: fixture: the session went through the countdown, the lap, the pause and the result');
    assert.equal(rig.audio.getSoundOutput().soundOn, false, 'AC-US-0003-09: the sound state read at the end is off');
    assert.equal(rig.fake.contexts.length, 0, 'AC-US-0003-09: no audio context was created without the action of the player');
    assert.equal(rig.fake.created.length, 0, 'AC-US-0003-09: and no node');
    assert.equal(rig.audio.setSoundOn(true).soundOn, true, 'AC-US-0003-09: the sound command turns it on');
    assert.equal(rig.audio.getSoundOutput().soundOn, true, 'AC-US-0003-09: and the state read afterwards is on');
  });
});

test('CHK-TEST-0003-07 a kart at rest in a running lap, advanced with a neutral input, never asks for the tyre sound', async () => {
  // AC-US-0004-03
  const marks = tyreMarkRunner(KART_PARK_SETUP);
  await withRig(runCountdown(startKartParkLap()), KART_PARK_SETUP, true, rig => {
    marks(rig.lap);
    let laid = 0, maxSpeed = 0;
    for (let i = 0; i < 600; i++) {
      rig.lap = stepLap(rig.lap, IDLE); rig.ticks++;
      const segments = marks(rig.lap).length;
      laid += segments;
      maxSpeed = Math.max(maxSpeed, rig.lap.kart.speed);
      const out = rig.show(segments > 0 && rearOnAsphalt(rig.lap));
      assert.equal(out.tireSoundState, 'TIRE_SILENT', `AC-US-0004-03: step ${i} at rest is TIRE_SILENT`);
      assert.equal(out.tireGainNorm, 0, `AC-US-0004-03: step ${i} at rest asks for tyre gain 0`);
    }
    assert.ok(maxSpeed < 0.05, `AC-US-0004-03: fixture: the kart stays at rest (${maxSpeed} m/s)`);
    assert.equal(laid, 0, 'AC-US-0004-03: fixture: the scene lays no mark at rest');
    assert.equal(phaseOf(rig.lap), 'RUNNING', 'AC-US-0004-03: fixture: the lap is running');
    assert.equal(positiveRamps(rig.tire().gain).length, 0, 'AC-US-0004-03: nothing was scheduled on the tyre gain above 0');
    assert.equal(rig.audio.getSoundOutput().engineSoundState, 'ENGINE_PLAYING', 'AC-US-0003-01: the engine plays with the kart at rest in the running lap');
  });
});

test('CHK-TEST-0003-08 over a driven training, the tyre plays exactly from the frames in which the scene lays a new mark with a rear wheel on the asphalt, and is silent in every other one', async () => {
  // AC-US-0004-01
  const realista = PUBLISHED_SETUPS.REALISTA_ALUGUEL_4T;
  const setup: SetupRef = { setupId: realista.setupId, setupVersion: realista.setupVersion };
  const pilot = autopilot(0, realista.config);
  const marks = tyreMarkRunner(setup);
  // Frames of 0 to 3 steps, as the frame clock gives them.
  const FRAME_STEPS = [1, 1, 2, 0, 1, 3, 0, 1];
  await withRig(runCountdown(startSession(syntheticReading(), 'TRAINING', realista.config)), setup, true, rig => {
    marks(rig.lap);
    const { gain } = rig.tire();
    let expected = false, playingFrames = 0, rollingSilentFrames = 0, starts = 0, stops = 0, heldFrames = 0, throttle = 0;
    for (let f = 0; rig.lap.kart.stepCount < 6000; f++) {
      const steps = FRAME_STEPS[f % FRAME_STEPS.length];
      for (let k = 0; k < steps; k++) { const input = pilot(rig.lap); rig.lap = stepLap(rig.lap, input); rig.ticks++; throttle = input.throttle; }
      const laid = marks(rig.lap).length > 0;
      const marking = laid && rearOnAsphalt(rig.lap);
      const was = expected;
      // RULE-0002: a new step decides; a frame without a new step keeps the last advanced step.
      if (steps > 0) expected = marking && phaseOf(rig.lap) === 'RUNNING';
      const events = gain.gain.events.length;
      if (rig.fake.contexts[0]) rig.fake.contexts[0].currentTime = rig.nowMs() / 1000;
      const out = rig.audio.refresh(frameReading(rig.lap, setup, { nowMs: rig.nowMs(), throttleNorm: throttle, tireMarkingAsphalt: marking }));
      const situation = `frame ${f} (${steps} steps, mark ${laid}, ${rig.lap.kart.speed.toFixed(2)} m/s)`;
      assert.equal(out.tireSoundState, expected ? 'TIRE_PLAYING' : 'TIRE_SILENT', `AC-US-0004-01: ${situation} is ${expected ? 'TIRE_PLAYING' : 'TIRE_SILENT'}`);
      if (expected) assert.ok(out.tireGainNorm > 0, `AC-US-0004-01: ${situation} asks for a tyre gain above 0`);
      else assert.equal(out.tireGainNorm, 0, `AC-US-0004-04: ${situation} asks for tyre gain 0`);
      const ramps = gain.gain.events.slice(events).filter(e => e.kind === 'linearRampToValueAtTime');
      if (expected && !was) {
        starts++;
        assert.ok(ramps.length === 1 && ramps[0].value! > 0 && ramps[0].timeS * 1000 - rig.nowMs() <= 50, `AC-US-0004-01: ${situation} ramps the tyre gain up at once`);
      } else if (!expected && was) {
        stops++;
        assert.ok(ramps.length === 1 && ramps[0].value === 0, `AC-US-0004-02: ${situation} ramps the tyre gain to exactly 0`);
        const lengthMs = ramps[0].timeS * 1000 - rig.nowMs();
        assert.ok(lengthMs > 0 && lengthMs < 200, `AC-US-0004-02: ${situation} is silent in less than 200 ms after the last mark (${lengthMs} ms)`);
      } else assert.equal(ramps.length, 0, `AC-US-0004-01: ${situation} schedules nothing on the tyre gain: the state did not change`);
      if (expected) playingFrames++;
      if (expected && steps === 0) heldFrames++;
      if (!expected && steps > 0 && rig.lap.kart.speed > 6) rollingSilentFrames++;
    }
    assert.ok(playingFrames >= 20, `AC-US-0004-01: the driven training reaches frames with the tyre playing (${playingFrames})`);
    assert.ok(heldFrames >= 1, `AC-US-0004-01: and frames without a new step in which it goes on playing (${heldFrames})`);
    assert.ok(starts >= 2 && stops >= 2, `AC-US-0004-02: several slides start and stop (${starts} starts, ${stops} stops)`);
    assert.ok(rollingSilentFrames >= 500, `AC-US-0004-04: and frames rolling above 6 m/s without a mark, silent (${rollingSilentFrames})`);
    assert.equal(rig.tire().source.stopCount, 0, 'AC-US-0004-01: the tyre source is never stopped: silence is gain 0');
  });
});

test('CHK-TEST-0003-09 SOUND_DETERMINISM: the same inputs from the same start give the same lap time and the same sector times with the sound on and with the sound off', async (t) => {
  // NFR-0004
  const on = await lapWithSoundOn();
  const record = await soundDeterminismCheck(on);
  t.diagnostic(serializeRecord(record));
  assert.equal(record.checkId, 'SOUND_DETERMINISM', 'NFR-0004: the record is SOUND_DETERMINISM');
  assert.equal(record.verdict, 'PASS', `NFR-0004: SOUND_DETERMINISM is PASS (${serializeRecord(record)})`);
  assert.equal(record.lapDeltaMs, 0, 'NFR-0004: the lap time differs by 0 ms');
  assert.equal(record.maxSectorDeltaMs, 0, 'NFR-0004: every sector differs by 0 ms');
  assert.ok(record.checkStepCount > 0 && record.checkStepCount === on.times.stepCount, `NFR-0004: both executions advanced the whole lap (${record.checkStepCount} steps)`);
  assert.equal(on.times.sectorMs?.length, 4, 'NFR-0004: fixture: the lap closes with its 4 sectors');
  assert.ok(on.outputs.every(o => o.output.soundOn) && on.outputs.some(o => o.output.engineGainNorm > 0), 'NFR-0004: fixture: the first execution really ran with the sound on and the engine asked');
  assert.ok(!('checkFailReason' in record), 'NFR-0004: a PASS record carries no reason');
});

test('CHK-TEST-0003-10 ASSETS_NEUTRAL: the same inputs give the same lap time and sector times with the sounds available and with no recording and no audio output at all', async (t) => {
  // NFR-0009
  const on = await lapWithSoundOn();
  const record = await assetsNeutralCheck(on);
  t.diagnostic(serializeRecord(record));
  assert.equal(record.checkId, 'ASSETS_NEUTRAL', 'NFR-0009: the record is ASSETS_NEUTRAL');
  assert.equal(record.verdict, 'PASS', `NFR-0009: ASSETS_NEUTRAL is PASS (${serializeRecord(record)})`);
  assert.equal(record.lapDeltaMs, 0, 'NFR-0009: the lap time differs by 0 ms');
  assert.equal(record.maxSectorDeltaMs, 0, 'NFR-0009: every sector differs by 0 ms');
  assert.ok(record.checkStepCount > 0, 'NFR-0009: the executions advanced steps');
  const without = await runKartParkLapWithSound('ASSETS_UNAVAILABLE', on.inputs);
  assert.ok(without.outputs.every(o => o.output.soundOn && !o.output.engineSoundAvailable && !o.output.tireSoundAvailable && o.output.engineGainNorm === 0),
    'NFR-0009: fixture: the second execution ran with the sound asked on and both recordings unavailable');
  assert.equal(without.times.lapMs, on.times.lapMs, 'NFR-0009: the lap closes with the same time without the sounds');
});

test('CHK-TEST-0003-11 SIM_STATE_UNCHANGED: the reference runs recorded before the feature replay to the same final state, field by field', (t) => {
  // NFR-0009
  const record = simStateUnchangedCheck();
  t.diagnostic(serializeRecord(record));
  assert.equal(record.checkId, 'SIM_STATE_UNCHANGED', 'NFR-0009: the record is SIM_STATE_UNCHANGED');
  assert.equal(record.verdict, 'PASS', `NFR-0009: SIM_STATE_UNCHANGED is PASS (${serializeRecord(record)})`);
  assert.equal(record.differingFieldCount, 0, 'NFR-0009: 0 fields added, removed or changed');
  assert.ok((record.checkStepCount ?? 0) > 5000, `NFR-0009: the reference runs advanced steps before the comparison (${record.checkStepCount})`);
  const baseline = readBaselineData() as { recordedAtUtc: string; referenceRuns: unknown[] };
  assert.ok(baseline.recordedAtUtc < '2026-11-10', `NFR-0009: the baseline was recorded before the feature (${baseline.recordedAtUtc})`);
  assert.ok(baseline.referenceRuns.length >= 2, 'NFR-0009: fixture: the baseline holds its reference runs');
});

test('CHK-TEST-0003-12 one field altered in a copy of the baseline is STATE_DIFFERS, a field added or removed counts, and without a usable baseline the record is BASELINE_MISSING', () => {
  // NFR-0009
  const copy = () => JSON.parse(JSON.stringify(readBaselineData())) as { schemaVersion: number; referenceRuns: { finalKart: Record<string, unknown>; setupVersion: string }[] };
  const altered = copy();
  altered.referenceRuns[0].finalKart.x = (altered.referenceRuns[0].finalKart.x as number) + 1e-9;
  const differs = simStateUnchangedCheck(altered);
  assert.equal(differs.verdict, 'FAIL', 'NFR-0009: one altered field is FAIL');
  assert.equal(differs.checkFailReason, 'STATE_DIFFERS', 'NFR-0009: with STATE_DIFFERS');
  assert.equal(differs.differingFieldCount, 1, 'NFR-0009: and exactly 1 differing field');
  const removed = copy();
  delete removed.referenceRuns[1].finalKart.speed;
  assert.equal(simStateUnchangedCheck(removed).differingFieldCount, 1, 'NFR-0009: a field the current state has and the baseline does not counts as added');
  const added = copy();
  added.referenceRuns[1].finalKart.soundGain = 0;
  const addedRecord = simStateUnchangedCheck(added);
  assert.equal(addedRecord.differingFieldCount, 1, 'NFR-0009: a field the baseline has and the current state does not counts as removed');
  assert.equal(addedRecord.checkFailReason, 'STATE_DIFFERS', 'NFR-0009: with STATE_DIFFERS');
  const otherSetup = copy();
  otherSetup.referenceRuns[0].setupVersion = 'arcade-assistido-v0';
  const otherSchema = copy();
  otherSchema.schemaVersion = 2;
  for (const [label, baseline] of [['a path that does not exist', readBaselineData('tests/fixtures/no-such-baseline.json')], ['an unreadable value', 'not a baseline'], ['another schema', otherSchema], ['another setup version', otherSetup], ['no reference run', { schemaVersion: 1, referenceRuns: [] }]] as const) {
    const record = simStateUnchangedCheck(baseline);
    assert.equal(record.verdict, 'FAIL', `NFR-0009: ${label} is FAIL`);
    assert.equal(record.checkFailReason, 'BASELINE_MISSING', `NFR-0009: ${label} is BASELINE_MISSING`);
    assert.deepEqual(Object.keys(record).sort(), ['checkFailReason', 'checkId', 'verdict'], `NFR-0009: ${label} carries the common fields only: nothing was compared`);
  }
});

test('CHK-TEST-0003-13 the time records carry exactly the fields of the contract: a reason only on FAIL, TIME_DIFFERS for any difference and LAP_NOT_COMPLETED when an execution closes no lap', async () => {
  // NFR-0004
  const on = await lapWithSoundOn();
  const pass = judgeTimes('SOUND_DETERMINISM', on.times, on.times);
  assert.deepEqual(Object.keys(pass).sort(), ['checkId', 'checkStepCount', 'lapDeltaMs', 'maxSectorDeltaMs', 'verdict'], 'NFR-0004: a PASS record has the common fields and the three measures, and no reason');
  const sim = simStateUnchangedCheck();
  assert.deepEqual(Object.keys(sim).sort(), ['checkId', 'checkStepCount', 'differingFieldCount', 'verdict'], 'NFR-0009: a PASS SIM_STATE_UNCHANGED has the common fields and the two measures, and no reason');
  const sectors = on.times.sectorMs!;
  const slowerSector = judgeTimes('ASSETS_NEUTRAL', on.times, { ...on.times, sectorMs: [sectors[0] + 3, sectors[1] - 3, ...sectors.slice(2)] });
  assert.equal(slowerSector.verdict, 'FAIL', 'NFR-0009: equal lap times with different sectors is FAIL');
  assert.equal(slowerSector.checkFailReason, 'TIME_DIFFERS', 'NFR-0009: with TIME_DIFFERS');
  assert.equal(slowerSector.lapDeltaMs, 0, 'NFR-0009: the lap delta is 0');
  assert.equal(slowerSector.maxSectorDeltaMs, 3, 'NFR-0009: and the largest sector delta is reported');
  const slowerLap = judgeTimes('SOUND_DETERMINISM', on.times, { ...on.times, lapMs: on.times.lapMs! + 1 });
  assert.equal(slowerLap.checkFailReason, 'TIME_DIFFERS', 'NFR-0004: a lap time 1 ms apart is TIME_DIFFERS');
  assert.equal(slowerLap.lapDeltaMs, 1, 'NFR-0004: with the delta reported');
  assert.deepEqual(Object.keys(slowerLap).sort(), ['checkFailReason', 'checkId', 'checkStepCount', 'lapDeltaMs', 'maxSectorDeltaMs', 'verdict'], 'NFR-0004: a FAIL record adds the reason to the fields of the record');
  // An execution that closes no lap: the recorded inputs cut short, the kart coasts to a stop before the finish.
  const cut = await runKartParkLapWithSound('SOUND_OFF', on.inputs.slice(0, 1500));
  assert.equal(cut.times.lapMs, undefined, 'NFR-0004: fixture: the cut execution closes no lap');
  const notCompleted = judgeTimes('SOUND_DETERMINISM', on.times, cut.times);
  assert.equal(notCompleted.verdict, 'FAIL', 'NFR-0004: an execution without a closed lap is FAIL');
  assert.equal(notCompleted.checkFailReason, 'LAP_NOT_COMPLETED', 'NFR-0004: with LAP_NOT_COMPLETED');
  assert.deepEqual(Object.keys(notCompleted).sort(), ['checkFailReason', 'checkId', 'checkStepCount', 'verdict'], 'NFR-0004: and the common fields and checkStepCount only');
  for (const record of [pass, sim, slowerSector, slowerLap, notCompleted]) {
    assert.deepEqual(JSON.parse(serializeRecord(record)), record, 'NFR-0004: a record is one JSON object on a line');
    assert.ok(!serializeRecord(record).includes('\n'), 'NFR-0004: without line breaks');
  }
});
