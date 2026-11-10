// TEST-0001 — the decision of the sound state, the engine sound and the tyre sound (RULE-0001, RULE-0002, API-0002): the two
// decision tables row by row, the pitch and gain inequalities, the reposition window, the reading of a step taken once
// (strategy: decision, unit level, DES-0002). Pure: no audio context, no clock — the instant is an argument.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { LapPhase } from '../src/lap';
import {
  decideSoundOutput, initialSoundDecision,
  ENGINE_GAIN_FULL_NORM, ENGINE_GAIN_IDLE_NORM, ENGINE_PITCH_IDLE_RATIO, ENGINE_PITCH_TOP_RATIO, ENGINE_PITCH_TOP_SPEED_MPS,
  SOUND_FADE_IN_MS, SOUND_FADE_OUT_MS, TIRE_GAIN_NORM,
  type SoundDecisionInput, type SoundDecisionState, type SoundOutput,
} from '../src/soundOutput';

const TOLERANCE = 1e-12;
const PHASES: (LapPhase | undefined)[] = [undefined, 'COUNTDOWN', 'RUNNING', 'PAUSED', 'ENDED'];
// Sound on, both recordings available, a lap in progress, the kart at rest with the throttle released.
const base: SoundDecisionInput = {
  soundOn: true, engineSoundAvailable: true, tireSoundAvailable: true,
  nowMs: 0, lapPhase: 'RUNNING', simStepCount: 1, speedMps: 0, throttleNorm: 0, tireMarkingAsphalt: false,
};
const one = (patch: Partial<SoundDecisionInput>): SoundOutput => decideSoundOutput(initialSoundDecision(), { ...base, ...patch }).output;
// Folds a sequence of frame readings, each over the state the previous one left, and gives every output.
function sequence(patches: Partial<SoundDecisionInput>[]): SoundOutput[] {
  let state: SoundDecisionState = initialSoundDecision();
  return patches.map(patch => { state = decideSoundOutput(state, { ...base, ...patch }); return state.output; });
}

test('CHK-TEST-0001-01 with the sound on, the recording available and the lap running, every reading gives the engine playing with a gain above 0, the kart at rest with the throttle released included', () => {
  // AC-US-0003-01
  for (const speedMps of [0, 0.5, 5, 12, 20, 32, 40]) {
    for (const throttleNorm of [0, 0.25, 1]) {
      const out = one({ speedMps, throttleNorm });
      const at = `${speedMps} m/s, throttle ${throttleNorm}`;
      assert.equal(out.engineSoundState, 'ENGINE_PLAYING', `AC-US-0003-01: sound on and lap running at ${at} is ENGINE_PLAYING`);
      assert.ok(out.engineGainNorm > 0, `AC-US-0003-01: the engine gain at ${at} is above 0 (${out.engineGainNorm})`);
      assert.ok(out.engineGainNorm <= 1, `AC-US-0003-01: the engine gain at ${at} is a fraction of 0 to 1 (${out.engineGainNorm})`);
    }
  }
  const lap = sequence(Array.from({ length: 600 }, (_, i) => ({ simStepCount: i + 1, nowMs: i * 8, speedMps: i % 50 === 0 ? 0 : i / 20, throttleNorm: i % 3 === 0 ? 0 : 1 })));
  const silent = lap.findIndex(o => o.engineSoundState !== 'ENGINE_PLAYING' || !(o.engineGainNorm > 0));
  assert.equal(silent, -1, `AC-US-0003-01: no evaluation of a running lap leaves the engine silent (evaluation ${silent})`);
});

test('CHK-TEST-0001-02 with the same throttle the engine pitch at 20 m/s is higher than at 5 m/s, and it rises strictly with the speed from 0 to 32 m/s', () => {
  // AC-US-0003-02
  for (const throttleNorm of [0, 1]) {
    const slow = one({ speedMps: 5, throttleNorm }).enginePitchRatio, fast = one({ speedMps: 20, throttleNorm }).enginePitchRatio;
    assert.ok(fast > slow, `AC-US-0003-02: with throttle ${throttleNorm} the pitch at 20 m/s (${fast}) is above the pitch at 5 m/s (${slow})`);
  }
  let previous = 0;
  for (let speedMps = 0; speedMps <= 32; speedMps++) {
    const ratio = one({ speedMps, throttleNorm: 0.5 }).enginePitchRatio;
    assert.ok(ratio > previous, `AC-US-0003-02: the pitch at ${speedMps} m/s (${ratio}) is above the pitch at ${speedMps - 1} m/s (${previous}) and above 0`);
    previous = ratio;
  }
  assert.ok(Math.abs(one({ speedMps: 5 }).enginePitchRatio - 0.9875) <= TOLERANCE, 'AC-US-0003-02: the pitch ratio at 5 m/s is 0.9875 (DES-0002)');
  assert.ok(Math.abs(one({ speedMps: 20 }).enginePitchRatio - 1.55) <= TOLERANCE, 'AC-US-0003-02: the pitch ratio at 20 m/s is 1.55 (DES-0002)');
});

test('CHK-TEST-0001-03 at the same speed the engine gain with the throttle pressed is above the gain with the throttle released', () => {
  // AC-US-0003-03
  for (const speedMps of [0, 5, 20]) {
    const released = one({ speedMps, throttleNorm: 0 }).engineGainNorm, pressed = one({ speedMps, throttleNorm: 1 }).engineGainNorm;
    assert.ok(pressed > released, `AC-US-0003-03: at ${speedMps} m/s the gain with the throttle pressed (${pressed}) is above the gain released (${released})`);
    assert.ok(released > 0, `AC-US-0003-03: at ${speedMps} m/s the engine still sounds with the throttle released (${released})`);
  }
  let previous = 0;
  for (const throttleNorm of [0, 0.25, 0.5, 0.75, 1]) {
    const gain = one({ speedMps: 12, throttleNorm }).engineGainNorm;
    assert.ok(gain > previous, `AC-US-0003-03: the gain rises with the throttle (${gain} at ${throttleNorm}, ${previous} before)`);
    previous = gain;
  }
});

test('CHK-TEST-0001-04 the first evaluation after the lap is paused gives the engine silent with gain 0', () => {
  // AC-US-0003-04
  const out = sequence([{ simStepCount: 10, speedMps: 18, throttleNorm: 1 }, { simStepCount: 10, speedMps: 18, throttleNorm: 1, lapPhase: 'PAUSED' }]);
  assert.equal(out[0].engineSoundState, 'ENGINE_PLAYING', 'AC-US-0003-04: fixture: the engine plays before the pause');
  assert.equal(out[1].engineSoundState, 'ENGINE_SILENT', 'AC-US-0003-04: the first evaluation with PAUSED is ENGINE_SILENT');
  assert.equal(out[1].engineGainNorm, 0, 'AC-US-0003-04: and asks for gain 0');
});

test('CHK-TEST-0001-05 the first evaluation after the lap ended gives the engine silent with gain 0', () => {
  // AC-US-0003-05
  const out = sequence([{ simStepCount: 10, speedMps: 18, throttleNorm: 1 }, { simStepCount: 11, speedMps: 18, throttleNorm: 1, lapPhase: 'ENDED' }]);
  assert.equal(out[0].engineSoundState, 'ENGINE_PLAYING', 'AC-US-0003-05: fixture: the engine plays before the result');
  assert.equal(out[1].engineSoundState, 'ENGINE_SILENT', 'AC-US-0003-05: the first evaluation with ENDED is ENGINE_SILENT');
  assert.equal(out[1].engineGainNorm, 0, 'AC-US-0003-05: and asks for gain 0');
});

test('CHK-TEST-0001-06 an accepted reposition silences the engine at once and for the 80 ms of the fade-out, and the engine is back at 80 ms', () => {
  // AC-US-0003-06
  const accepted = 5000;
  const frames: Partial<SoundDecisionInput>[] = [{ simStepCount: 400, speedMps: 15, throttleNorm: 1, nowMs: accepted - 8 }];
  for (let ms = 0; ms <= 100; ms++) frames.push({ simStepCount: 0, speedMps: 0, throttleNorm: 1, nowMs: accepted + ms, repositionAcceptedAtMs: accepted });
  const out = sequence(frames);
  assert.equal(out[0].engineSoundState, 'ENGINE_PLAYING', 'AC-US-0003-06: fixture: the engine plays before the reposition');
  assert.equal(out[1].engineSoundState, 'ENGINE_SILENT', 'AC-US-0003-06: the evaluation at the instant of the accepted reposition is ENGINE_SILENT');
  assert.equal(out[1].engineGainNorm, 0, 'AC-US-0003-06: and asks for gain 0');
  for (let ms = 0; ms < 80; ms++) assert.equal(out[1 + ms].engineSoundState, 'ENGINE_SILENT', `AC-US-0003-06: ${ms} ms after the reposition the engine is still silent`);
  for (let ms = 80; ms <= 100; ms++) {
    assert.equal(out[1 + ms].engineSoundState, 'ENGINE_PLAYING', `AC-US-0003-06: ${ms} ms after the reposition, with the lap running, the engine plays again`);
    assert.ok(out[1 + ms].engineGainNorm > 0, `AC-US-0003-06: with a gain above 0 at ${ms} ms`);
  }
  assert.ok(SOUND_FADE_OUT_MS <= 200, `AC-US-0003-06: the silence window (${SOUND_FADE_OUT_MS} ms) is the fade-out, inside the 200 ms deadline`);
  // A function of the current instant, not of an edge: the same instant evaluated again gives the same answer.
  const again = sequence([frames[0], frames[1], frames[1], frames[1]]);
  assert.deepEqual(again[3], again[1], 'AC-US-0003-06: the same instant evaluated again gives the same output');
});

test('CHK-TEST-0001-07 with the sound off the engine is silent with gain 0 in every lap phase and without a lap', () => {
  // AC-US-0003-07
  for (const lapPhase of PHASES) {
    for (const speedMps of [0, 20]) {
      const out = one({ soundOn: false, lapPhase, speedMps, throttleNorm: 1 });
      assert.equal(out.engineSoundState, 'ENGINE_SILENT', `AC-US-0003-07: sound off, ${lapPhase ?? 'no lap'}, ${speedMps} m/s is ENGINE_SILENT`);
      assert.equal(out.engineGainNorm, 0, `AC-US-0003-07: sound off, ${lapPhase ?? 'no lap'}, ${speedMps} m/s asks for gain 0`);
      assert.equal(out.soundOn, false, 'AC-US-0003-07: the output says the sound is off');
    }
  }
  const off = sequence([{ simStepCount: 7, speedMps: 20, throttleNorm: 1 }, { simStepCount: 8, speedMps: 20, throttleNorm: 1, soundOn: false }]);
  assert.equal(off[0].engineSoundState, 'ENGINE_PLAYING', 'AC-US-0003-07: fixture: the engine plays before the sound is turned off');
  assert.equal(off[1].engineGainNorm, 0, 'AC-US-0003-07: turned off in the middle of a lap, the gain asked is 0 in that evaluation');
});

test('CHK-TEST-0001-08 before the lap runs (countdown, no lap) the engine is silent even with the sound on', () => {
  // AC-US-0003-01
  for (const lapPhase of [undefined, 'COUNTDOWN'] as const) {
    const out = one({ lapPhase, speedMps: 0, throttleNorm: 1 });
    assert.equal(out.engineSoundState, 'ENGINE_SILENT', `AC-US-0003-01: ${lapPhase ?? 'no lap'} is not a lap in progress: ENGINE_SILENT (RULE-0001 row 5)`);
    assert.equal(out.engineGainNorm, 0, `AC-US-0003-01: ${lapPhase ?? 'no lap'} asks for gain 0`);
  }
  const started = sequence([{ lapPhase: 'COUNTDOWN', simStepCount: 0 }, { lapPhase: 'RUNNING', simStepCount: 1 }]);
  assert.equal(started[1].engineSoundState, 'ENGINE_PLAYING', 'AC-US-0003-01: the first evaluation with the lap running is ENGINE_PLAYING');
});

test('CHK-TEST-0001-09 an unavailable engine recording keeps the engine silent with the sound on, and does not silence the tyre', () => {
  // AC-US-0003-10
  for (const lapPhase of PHASES) {
    const out = one({ engineSoundAvailable: false, lapPhase, speedMps: 20, throttleNorm: 1 });
    assert.equal(out.engineSoundState, 'ENGINE_SILENT', `AC-US-0003-10: without the recording, ${lapPhase ?? 'no lap'} is ENGINE_SILENT (RULE-0001 row 2)`);
    assert.equal(out.engineGainNorm, 0, `AC-US-0003-10: without the recording, ${lapPhase ?? 'no lap'} asks for gain 0`);
    assert.equal(out.engineSoundAvailable, false, 'AC-US-0003-10: the output says the engine sound is unavailable');
    assert.equal(out.soundOn, true, 'AC-US-0003-10: the sound state stays the one chosen');
  }
  const tyre = one({ engineSoundAvailable: false, speedMps: 20, tireMarkingAsphalt: true });
  assert.equal(tyre.tireSoundState, 'TIRE_PLAYING', 'AC-US-0003-10: the tyre sound follows its own availability');
});

test('CHK-TEST-0001-10 with the sound on, the tyre plays while the last advanced step marks the asphalt, frames without a new step included', () => {
  // AC-US-0004-01
  const out = sequence([
    { simStepCount: 20, speedMps: 14, tireMarkingAsphalt: false },
    { simStepCount: 21, speedMps: 14, tireMarkingAsphalt: true },
    // Frames without a new step: the block of marks drew nothing, the reading of the frame says false, the step is the same.
    { simStepCount: 21, speedMps: 14, tireMarkingAsphalt: false },
    { simStepCount: 21, speedMps: 0, tireMarkingAsphalt: false },
    { simStepCount: 22, speedMps: 14, tireMarkingAsphalt: true },
  ]);
  assert.equal(out[0].tireSoundState, 'TIRE_SILENT', 'AC-US-0004-01: fixture: silent before the mark');
  for (const i of [1, 2, 3, 4]) {
    assert.equal(out[i].tireSoundState, 'TIRE_PLAYING', `AC-US-0004-01: evaluation ${i} is TIRE_PLAYING while the last advanced step marks the asphalt`);
    assert.ok(out[i].tireGainNorm > 0 && out[i].tireGainNorm <= 1, `AC-US-0004-01: evaluation ${i} asks for a tyre gain above 0 (${out[i].tireGainNorm})`);
  }
});

test('CHK-TEST-0001-11 the tyre goes silent with gain 0 in the evaluation of the first step that no longer marks, in the pause and in the result, and plays again when the kart marks again', () => {
  // AC-US-0004-02
  const out = sequence([
    { simStepCount: 30, speedMps: 14, tireMarkingAsphalt: true },
    { simStepCount: 31, speedMps: 14, tireMarkingAsphalt: false },
    { simStepCount: 32, speedMps: 14, tireMarkingAsphalt: true },
  ]);
  assert.equal(out[0].tireSoundState, 'TIRE_PLAYING', 'AC-US-0004-02: fixture: the tyre plays while marking');
  assert.equal(out[1].tireSoundState, 'TIRE_SILENT', 'AC-US-0004-02: the first step that no longer marks is TIRE_SILENT');
  assert.equal(out[1].tireGainNorm, 0, 'AC-US-0004-02: and asks for gain 0 in that evaluation');
  assert.equal(out[2].tireSoundState, 'TIRE_PLAYING', 'AC-US-0004-02: marking again in the next step, the tyre plays again');
  for (const lapPhase of ['PAUSED', 'ENDED'] as const) {
    const stopped = sequence([{ simStepCount: 40, speedMps: 14, tireMarkingAsphalt: true }, { simStepCount: 40, speedMps: 14, tireMarkingAsphalt: true, lapPhase }]);
    assert.equal(stopped[0].tireSoundState, 'TIRE_PLAYING', `AC-US-0004-02: fixture: marking before ${lapPhase}`);
    assert.equal(stopped[1].tireSoundState, 'TIRE_SILENT', `AC-US-0004-02: with ${lapPhase} and the last step marking, the tyre is TIRE_SILENT`);
    assert.equal(stopped[1].tireGainNorm, 0, `AC-US-0004-02: with ${lapPhase} the gain asked is 0`);
  }
  assert.ok(SOUND_FADE_OUT_MS <= 200, `AC-US-0004-02: the fade-out (${SOUND_FADE_OUT_MS} ms) is inside the 200 ms deadline`);
});

test('CHK-TEST-0001-12 with the kart at rest and no mark, no tyre sound is asked', () => {
  // AC-US-0004-03
  for (const lapPhase of PHASES) {
    const out = one({ lapPhase, speedMps: 0, throttleNorm: 0, tireMarkingAsphalt: false });
    assert.equal(out.tireSoundState, 'TIRE_SILENT', `AC-US-0004-03: at rest, ${lapPhase ?? 'no lap'} is TIRE_SILENT`);
    assert.equal(out.tireGainNorm, 0, `AC-US-0004-03: at rest, ${lapPhase ?? 'no lap'} asks for tyre gain 0`);
  }
  const rest = sequence(Array.from({ length: 240 }, (_, i) => ({ simStepCount: i + 1, speedMps: 0, throttleNorm: 0, tireMarkingAsphalt: false })));
  assert.ok(rest.every(o => o.tireSoundState === 'TIRE_SILENT' && o.tireGainNorm === 0), 'AC-US-0004-03: two seconds at rest never ask for the tyre sound');
});

test('CHK-TEST-0001-13 rolling without a mark on the asphalt asks for no tyre sound at any speed: the decision follows the mark, not the speed', () => {
  // AC-US-0004-04
  for (const speedMps of [0.5, 5, 20, 30]) {
    const rolling = one({ speedMps, throttleNorm: 1, tireMarkingAsphalt: false });
    assert.equal(rolling.tireSoundState, 'TIRE_SILENT', `AC-US-0004-04: at ${speedMps} m/s without a mark the tyre is TIRE_SILENT`);
    assert.equal(rolling.tireGainNorm, 0, `AC-US-0004-04: at ${speedMps} m/s without a mark the tyre gain is 0`);
    const marking = one({ speedMps, throttleNorm: 1, tireMarkingAsphalt: true });
    assert.equal(marking.tireSoundState, 'TIRE_PLAYING', `AC-US-0004-04: at the same ${speedMps} m/s with the mark the tyre is TIRE_PLAYING`);
  }
});

test('CHK-TEST-0001-14 with the sound off no tyre sound is asked even while the kart marks the asphalt', () => {
  // AC-US-0004-05
  for (const lapPhase of PHASES) {
    const out = one({ soundOn: false, lapPhase, speedMps: 20, tireMarkingAsphalt: true });
    assert.equal(out.tireSoundState, 'TIRE_SILENT', `AC-US-0004-05: sound off, ${lapPhase ?? 'no lap'}, marking is TIRE_SILENT`);
    assert.equal(out.tireGainNorm, 0, `AC-US-0004-05: sound off, ${lapPhase ?? 'no lap'}, marking asks for tyre gain 0`);
  }
  const off = sequence([{ simStepCount: 50, speedMps: 20, tireMarkingAsphalt: true }, { simStepCount: 51, speedMps: 20, tireMarkingAsphalt: true, soundOn: false }]);
  assert.equal(off[0].tireSoundState, 'TIRE_PLAYING', 'AC-US-0004-05: fixture: the tyre plays before the sound is turned off');
  assert.equal(off[1].tireGainNorm, 0, 'AC-US-0004-05: turned off in the middle of a slide, the tyre gain asked is 0 in that evaluation');
});

test('CHK-TEST-0001-15 an unavailable tyre recording keeps the tyre silent while the kart marks, and the engine plays', () => {
  // AC-US-0004-06
  const out = one({ tireSoundAvailable: false, speedMps: 20, throttleNorm: 1, tireMarkingAsphalt: true });
  assert.equal(out.tireSoundState, 'TIRE_SILENT', 'AC-US-0004-06: without the tyre recording the tyre is TIRE_SILENT (RULE-0002 row 2)');
  assert.equal(out.tireGainNorm, 0, 'AC-US-0004-06: without the tyre recording the tyre gain is 0');
  assert.equal(out.tireSoundAvailable, false, 'AC-US-0004-06: the output says the tyre sound is unavailable');
  assert.equal(out.engineSoundState, 'ENGINE_PLAYING', 'AC-US-0004-06: the engine follows its own availability');
});

test('CHK-TEST-0001-16 before any lap and before the sound is turned on, the decision has the 8 fields of the contract with the sound off, both sounds silent and gains 0', () => {
  // AC-US-0003-08
  const out = initialSoundDecision().output;
  assert.deepEqual(Object.keys(out).sort(), ['engineGainNorm', 'enginePitchRatio', 'engineSoundAvailable', 'engineSoundState', 'soundOn', 'tireGainNorm', 'tireSoundAvailable', 'tireSoundState'],
    'AC-US-0003-08: the output has exactly the 8 fields of API-0002');
  assert.equal(out.soundOn, false, 'AC-US-0003-08: the sound opens off');
  assert.equal(out.engineSoundState, 'ENGINE_SILENT', 'AC-US-0003-08: the engine opens silent');
  assert.equal(out.tireSoundState, 'TIRE_SILENT', 'AC-US-0003-08: the tyre opens silent');
  assert.equal(out.engineGainNorm, 0, 'AC-US-0003-08: the engine gain opens at 0');
  assert.equal(out.tireGainNorm, 0, 'AC-US-0003-08: the tyre gain opens at 0');
  assert.ok(out.enginePitchRatio > 0, `AC-US-0003-08: the pitch ratio is above 0 (${out.enginePitchRatio})`);
  const decided = one({});
  assert.deepEqual(Object.keys(decided).sort(), Object.keys(out).sort(), 'AC-US-0003-08: a decided output has the same 8 fields, none more');
});

test('CHK-TEST-0001-17 a step is read once: the same step read again changes nothing, several steps between two frames use the last, and a silent engine keeps its last pitch', () => {
  // AC-US-0003-02
  let state = decideSoundOutput(initialSoundDecision(), { ...base, simStepCount: 60, speedMps: 20, throttleNorm: 1, tireMarkingAsphalt: true });
  const first = state.output;
  // The same step presented again with other values (a frame without a new step, a repeated reading).
  const repeated = decideSoundOutput(state, { ...base, simStepCount: 60, speedMps: 3, throttleNorm: 0, tireMarkingAsphalt: false });
  assert.deepEqual(repeated.output, first, 'AC-US-0003-02: the same simStepCount read twice gives the same pitch, gain and tyre state');
  const same = decideSoundOutput(state, { ...base, simStepCount: 60, speedMps: 20, throttleNorm: 1, tireMarkingAsphalt: true });
  assert.deepEqual(same, state, 'AC-US-0003-02: the same input over the same state gives the same state');
  // Several steps between two frames: only the last one is read.
  state = decideSoundOutput(state, { ...base, simStepCount: 64, speedMps: 5, throttleNorm: 0 });
  assert.ok(Math.abs(state.output.enginePitchRatio - one({ speedMps: 5 }).enginePitchRatio) <= TOLERANCE, 'AC-US-0003-02: after several steps the pitch is the one of the last step');
  const paused = decideSoundOutput(state, { ...base, simStepCount: 64, speedMps: 5, throttleNorm: 0, lapPhase: 'PAUSED' });
  assert.ok(Math.abs(paused.output.enginePitchRatio - state.output.enginePitchRatio) <= TOLERANCE, 'AC-US-0003-02: a silent engine keeps the last pitch ratio');
  // A counter that went backwards (reposition, new lap) is a new step.
  const back = decideSoundOutput(state, { ...base, simStepCount: 0, speedMps: 0, throttleNorm: 1 });
  assert.ok(back.output.engineGainNorm > state.output.engineGainNorm, 'AC-US-0003-02: a smaller simStepCount is read as a new step');
});

test('CHK-TEST-0001-18 a reading out of range is limited and never throws: the gains stay fractions of 0 to 1 and the pitch stays above 0', () => {
  // AC-US-0003-03
  const odd: Partial<SoundDecisionInput>[] = [
    { speedMps: -10 }, { speedMps: Number.NaN }, { speedMps: Number.POSITIVE_INFINITY }, { speedMps: 500 },
    { throttleNorm: -3 }, { throttleNorm: 7 }, { throttleNorm: Number.NaN }, { nowMs: Number.NaN, repositionAcceptedAtMs: 0 },
  ];
  for (const patch of odd) {
    let out: SoundOutput | undefined;
    assert.doesNotThrow(() => { out = one(patch); }, `AC-US-0003-03: ${JSON.stringify(patch)} does not throw`);
    assert.ok(out!.engineGainNorm >= 0 && out!.engineGainNorm <= 1, `AC-US-0003-03: ${JSON.stringify(patch)} keeps the engine gain in 0 to 1 (${out!.engineGainNorm})`);
    assert.ok(Number.isFinite(out!.enginePitchRatio) && out!.enginePitchRatio > 0, `AC-US-0003-03: ${JSON.stringify(patch)} keeps the pitch finite and above 0 (${out!.enginePitchRatio})`);
  }
  assert.ok(Math.abs(one({ throttleNorm: 7 }).engineGainNorm - one({ throttleNorm: 1 }).engineGainNorm) <= TOLERANCE, 'AC-US-0003-03: a throttle above 1 counts as fully pressed');
  assert.ok(Math.abs(one({ speedMps: -10 }).enginePitchRatio - one({ speedMps: 0 }).enginePitchRatio) <= TOLERANCE, 'AC-US-0003-03: a negative speed counts as at rest');
  assert.ok(Math.abs(one({ speedMps: 500 }).enginePitchRatio - one({ speedMps: 32 }).enginePitchRatio) <= TOLERANCE, 'AC-US-0003-03: above the reference speed the pitch stays at the top ratio');
});

test('CHK-TEST-0001-19 the published constants of the decision are the designed ones and the fades fit the deadlines of the criteria', () => {
  // AC-US-0003-01
  const near = (value: number, expected: number, name: string) => assert.ok(Math.abs(value - expected) <= TOLERANCE, `AC-US-0003-01: ${name} is ${expected} (${value})`);
  near(ENGINE_PITCH_IDLE_RATIO, 0.8, 'ENGINE_PITCH_IDLE_RATIO');
  near(ENGINE_PITCH_TOP_RATIO, 2.0, 'ENGINE_PITCH_TOP_RATIO');
  near(ENGINE_PITCH_TOP_SPEED_MPS, 32, 'ENGINE_PITCH_TOP_SPEED_MPS');
  near(ENGINE_GAIN_IDLE_NORM, 0.35, 'ENGINE_GAIN_IDLE_NORM');
  near(ENGINE_GAIN_FULL_NORM, 0.70, 'ENGINE_GAIN_FULL_NORM');
  near(TIRE_GAIN_NORM, 0.50, 'TIRE_GAIN_NORM');
  assert.equal(SOUND_FADE_IN_MS, 10, 'AC-US-0003-01: the fade-in is 10 ms');
  assert.equal(SOUND_FADE_OUT_MS, 80, 'AC-US-0003-04: the fade-out is 80 ms');
  assert.ok(SOUND_FADE_IN_MS <= 50, 'AC-US-0003-01: the engine sounds within 50 ms of the row starting to hold');
  assert.ok(SOUND_FADE_OUT_MS <= 200, 'AC-US-0003-04: the engine is silent within 200 ms');
  near(one({ throttleNorm: 0 }).engineGainNorm, 0.35, 'the gain with the throttle released');
  near(one({ throttleNorm: 1 }).engineGainNorm, 0.70, 'the gain with the throttle pressed');
  near(one({ speedMps: 20, tireMarkingAsphalt: true }).tireGainNorm, 0.50, 'the tyre gain');
});
