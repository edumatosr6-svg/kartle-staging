// TEST-0008 — the curb feedback decided per step (RULE-0004): vibration pulses of 20 ms every 250 ms on web-mobile, the curb sound
// every 100 ms on web-desktop with the sound on, nothing without a wheel on the curb, nothing for a step already handled; the curb
// sound built from its own descriptor on a substitute AudioContext (strategy: feedback, unit and integration levels, DES-0009).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { getTrackContact, STEP } from '../src/physics';
import {
  CURB_PULSE_INTERVAL_STEPS, CURB_PULSE_MS, CURB_SOUND_REPEAT_STEPS, decideCurbFeedback, initialCurbFeedback, type CurbFeedbackInput, type CurbFeedbackState,
} from '../src/curbFeedback';
import { CURB_SOUND, ENGINE_SOUND, RaceAudio, REWARD_SOUND } from '../src/audio';
import { positionAtLapM } from '../src/trackGeometry';
import { kartParkGeometry } from './fixtures/kartParkFiles';
import { drive, kartParkPilot, lapDistanceOf, runCountdown, startKartParkLap } from './helpers/kartParkPilot';

const src = join(dirname(fileURLToPath(import.meta.url)), '..', 'src');
const stripComments = (text: string) => text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
const g = kartParkGeometry();
type Pair = { simStepCount: number; curbWheelCount: number };
const base: Omit<CurbFeedbackInput, 'simStepCount' | 'curbWheelCount'> = { channel: 'web-mobile', vibrationAvailable: true, soundOn: false };
// Runs the decision over a contact sequence and returns the steps with a pulse and the steps with a sound.
function record(pairs: Pair[], options: Partial<Omit<CurbFeedbackInput, 'simStepCount' | 'curbWheelCount'>> = {}): { pulses: number[]; sounds: number[]; state: CurbFeedbackState } {
  let state = initialCurbFeedback();
  const pulses: number[] = [], sounds: number[] = [];
  for (const p of pairs) {
    const d = decideCurbFeedback(state, { ...base, ...options, ...p });
    state = d.state;
    if (d.pulse) pulses.push(p.simStepCount);
    if (d.sound) sounds.push(p.simStepCount);
  }
  return { pulses, sounds, state };
}
const onCurb = (from: number, to: number, count = 1): Pair[] => Array.from({ length: to - from }, (_, i) => ({ simStepCount: from + i, curbWheelCount: count }));
const offCurb = (from: number, to: number): Pair[] => onCurb(from, to, 0);

// The contact sequence of a real curb run: the pilot rides the long right-hand curb at 7 m/s (as the lap suite does).
const realRun = (() => {
  const span = g.curbs.find(c => c.side === 'RIGHT' && c.toLapM - c.fromLapM > 24)!;
  const widthAt = (lapM: number) => g.centerline[positionAtLapM(g, lapM).index].widthM;
  let lap = runCountdown(startKartParkLap());
  const fast = kartParkPilot(g);
  let guard = 0;
  while (guard++ < 9000 && lapDistanceOf(g, lap.kart) < span.fromLapM - 12) lap = drive(lap, fast, 1).lap;
  const slow = kartParkPilot(g, { offsetM: m => m > span.fromLapM + 1 && m < span.toLapM - 1 ? -(widthAt(m) / 2 + 0.15) : 0, maxSpeedMps: 7 });
  const pairs: Pair[] = [];
  let steps = 0;
  while (steps++ < 3000 && lap.phase === 'RUNNING' && lapDistanceOf(g, lap.kart) < span.toLapM + 6) {
    lap = drive(lap, slow, 1, (_b, a) => { const c = getTrackContact(a.kart, a.environment, a.config); if (!('code' in c)) pairs.push({ simStepCount: c.simStepCount, curbWheelCount: c.curbWheelCount }); }).lap;
  }
  return pairs;
})();

test('CHK-TEST-0008-01 on web-mobile with vibration available, a wheel on the curb starts a 20 ms pulse every 30 steps, which is every 250 ms of simulated time', () => {
  // AC-US-0005-07
  assert.equal(CURB_PULSE_MS, 20, 'AC-US-0005-07: 20 ms pulses');
  assert.ok(Math.abs(CURB_PULSE_INTERVAL_STEPS * STEP - 0.25) <= 1e-12, `AC-US-0005-07: ${CURB_PULSE_INTERVAL_STEPS} steps are 250 ms (${CURB_PULSE_INTERVAL_STEPS * STEP * 1000} ms)`);
  const { pulses } = record(onCurb(0, 200));
  assert.deepEqual(pulses, [0, 30, 60, 90, 120, 150, 180], 'AC-US-0005-07: a pulse starts at the first curb step and every 30 steps while a wheel stays on the curb');
  const late = record([...offCurb(0, 17), ...onCurb(17, 100, 2)]);
  assert.deepEqual(late.pulses, [17, 47, 77], 'AC-US-0005-07: the first pulse starts in the first step with a wheel on the curb');
  const gaps = record(onCurb(0, 1200, 4)).pulses;
  assert.ok(gaps.every((s, i) => i === 0 || s - gaps[i - 1] === 30), 'AC-US-0005-07: every interval is exactly 30 steps');
});

test('CHK-TEST-0008-02 without a wheel on the curb no new pulse starts, and a step already handled (the lap paused) starts nothing', () => {
  // AC-US-0005-08
  assert.deepEqual(record(offCurb(0, 300)).pulses, [], 'AC-US-0005-08: no pulse without a wheel on the curb');
  const leaving = record([...onCurb(0, 10), ...offCurb(10, 100)]);
  assert.deepEqual(leaving.pulses, [0], 'AC-US-0005-08: after leaving the curb no new pulse starts, even past the interval');
  const back = record([...onCurb(0, 10), ...offCurb(10, 100), ...onCurb(100, 110)]);
  assert.deepEqual(back.pulses, [0, 100], 'AC-US-0005-08: back on the curb the pulses resume');
  // Paused: the step counter does not advance, so the same step is presented again and handled once.
  let state = initialCurbFeedback();
  const first = decideCurbFeedback(state, { ...base, simStepCount: 40, curbWheelCount: 1 });
  state = first.state;
  assert.equal(first.pulse, true, 'AC-US-0005-08: fixture: the step pulses');
  for (let i = 0; i < 50; i++) {
    const again = decideCurbFeedback(state, { ...base, simStepCount: 40, curbWheelCount: 1 });
    assert.equal(again.pulse, false, 'AC-US-0005-08: a step already handled starts no pulse');
    assert.equal(again.sound, false, 'AC-US-0005-08: nor a sound');
    assert.equal(again.state, state, 'AC-US-0005-08: and keeps the state');
  }
  const earlier = decideCurbFeedback(state, { ...base, simStepCount: 39, curbWheelCount: 1 });
  assert.equal(earlier.pulse, false, 'AC-US-0005-08: an earlier step starts nothing');
});

test('CHK-TEST-0008-03 on web-desktop with the sound on, a wheel on the curb repeats the curb sound every 12 steps (100 ms), and never vibrates', () => {
  // AC-US-0005-09
  assert.ok(Math.abs(CURB_SOUND_REPEAT_STEPS * STEP - 0.1) <= 1e-12, `AC-US-0005-09: ${CURB_SOUND_REPEAT_STEPS} steps are 100 ms`);
  const desktop = record(onCurb(0, 100), { channel: 'web-desktop', soundOn: true, vibrationAvailable: true });
  assert.deepEqual(desktop.sounds, [0, 12, 24, 36, 48, 60, 72, 84, 96], 'AC-US-0005-09: a repeat at the first curb step and every 12 steps');
  assert.deepEqual(desktop.pulses, [], 'REQ-FEAT-0005-16: no vibration pulse on web-desktop even with vibration available');
  const long = record(onCurb(0, 1200, 3), { channel: 'web-desktop', soundOn: true }).sounds;
  assert.equal(long.length, 100, 'AC-US-0005-09: 100 repeats in 1200 steps');
  assert.ok(long.every((s, i) => i === 0 || s - long[i - 1] === 12), 'AC-US-0005-09: every interval is exactly 12 steps');
});

test('CHK-TEST-0008-04 without a wheel on the curb no new repeat of the sound starts', () => {
  // AC-US-0005-10
  const options = { channel: 'web-desktop' as const, soundOn: true };
  assert.deepEqual(record(offCurb(0, 300), options).sounds, [], 'AC-US-0005-10: no sound without a wheel on the curb');
  assert.deepEqual(record([...onCurb(0, 5), ...offCurb(5, 100)], options).sounds, [0], 'AC-US-0005-10: after leaving the curb no new repeat starts');
  assert.deepEqual(record([...onCurb(0, 5), ...offCurb(5, 100), ...onCurb(100, 101)], options).sounds, [0, 100], 'AC-US-0005-10: back on the curb the sound resumes');
});

test('CHK-TEST-0008-05 with the sound off riding the curb produces no sound; on web-mobile the sound follows the same rule and a missing vibration only removes the pulses', () => {
  // AC-US-0005-11
  assert.deepEqual(record(onCurb(0, 300), { channel: 'web-desktop', soundOn: false }).sounds, [], 'AC-US-0005-11: sound off, no curb sound');
  const mobileSound = record(onCurb(0, 120), { channel: 'web-mobile', soundOn: true, vibrationAvailable: true });
  assert.deepEqual(mobileSound.sounds, [0, 12, 24, 36, 48, 60, 72, 84, 96, 108], 'REQ-FEAT-0005-17: on web-mobile with the sound on the repeats follow the same rule');
  assert.deepEqual(mobileSound.pulses, [0, 30, 60, 90], 'REQ-FEAT-0005-17: and the pulses too');
  const noVibration = record(onCurb(0, 120), { channel: 'web-mobile', soundOn: true, vibrationAvailable: false });
  assert.deepEqual(noVibration.pulses, [], 'REQ-FEAT-0005-19: no pulse without navigator.vibrate');
  assert.deepEqual(noVibration.sounds, mobileSound.sounds, 'REQ-FEAT-0005-19: the sound repeats are the same without vibration');
});

test('CHK-TEST-0008-06 over the contact sequence of a real curb run, every pulse and repeat starts with a wheel on the curb, at the declared intervals, several times', () => {
  // AC-US-0005-07, AC-US-0005-09
  const onCurbSteps = realRun.filter(p => p.curbWheelCount > 0).map(p => p.simStepCount);
  assert.ok(onCurbSteps.length >= 121, `fixture: the run rides the curb for ${onCurbSteps.length} steps`);
  assert.ok(realRun.every((p, i) => i === 0 || p.simStepCount === realRun[i - 1].simStepCount + 1), 'fixture: one contact per step, in order');
  const mobile = record(realRun, { channel: 'web-mobile', vibrationAvailable: true, soundOn: true });
  for (const s of mobile.pulses) assert.ok(onCurbSteps.includes(s), `AC-US-0005-07: the pulse at step ${s} starts with a wheel on the curb`);
  for (const s of mobile.sounds) assert.ok(onCurbSteps.includes(s), `AC-US-0005-09: the repeat at step ${s} starts with a wheel on the curb`);
  for (let i = 1; i < mobile.pulses.length; i++) assert.ok(mobile.pulses[i] - mobile.pulses[i - 1] >= 30, 'AC-US-0005-07: pulses at least 30 steps apart');
  for (let i = 1; i < mobile.sounds.length; i++) assert.ok(mobile.sounds[i] - mobile.sounds[i - 1] >= 12, 'AC-US-0005-09: repeats at least 12 steps apart');
  assert.ok(mobile.pulses.length >= 4, `AC-US-0005-07: several pulses during the run (${mobile.pulses.length})`);
  assert.ok(mobile.sounds.length >= 10, `AC-US-0005-09: several repeats during the run (${mobile.sounds.length})`);
  // A step on the curb more than 30 steps after the previous pulse always pulses: the longest run without a pulse is below 30.
  let since = -1;
  for (const p of realRun) {
    if (mobile.pulses.includes(p.simStepCount)) since = p.simStepCount;
    else if (p.curbWheelCount > 0 && since >= 0) assert.ok(p.simStepCount - since < 30, `AC-US-0005-07: step ${p.simStepCount} on the curb is ${p.simStepCount - since} steps after the last pulse without pulsing`);
  }
});

test('CHK-TEST-0008-07 the curb sound is a filtered noise burst unlike the engine (triangle) and the reward (sine), built only with the sound on', async () => {
  // AC-US-0005-12
  class Param { value = 0; setTargetAtTime() {} setValueAtTime() {} linearRampToValueAtTime() {} exponentialRampToValueAtTime() {} }
  type Node = { kind: string; type: string; frequency: Param; gain: Param; buffer?: unknown; onended?: unknown; connect: (n: unknown) => unknown; disconnect: () => void; start: () => void; stop: () => void };
  const created: Node[] = [];
  const node = (kind: string): Node => { const n: Node = { kind, type: '', frequency: new Param(), gain: new Param(), connect: x => x, disconnect() {}, start() {}, stop() {} }; created.push(n); return n; };
  class FakeContext {
    currentTime = 0; sampleRate = 48000; state = 'running'; destination = {};
    async resume() {}
    createOscillator() { return node('oscillator'); }
    createGain() { return node('gain'); }
    createBiquadFilter() { return node('filter'); }
    createBufferSource() { return node('buffer-source'); }
    createBuffer(_channels: number, samples: number) { return { samples, copyToChannel(data: Float32Array) { assert.equal(data.length, samples, 'AC-US-0005-12: the noise fills the buffer'); } }; }
  }
  const globals = globalThis as unknown as { AudioContext?: unknown };
  const previous = globals.AudioContext;
  globals.AudioContext = FakeContext;
  try {
    assert.notEqual(ENGINE_SOUND.source, CURB_SOUND.source, 'AC-US-0005-12: the curb source differs from the engine');
    assert.notEqual(REWARD_SOUND.source, CURB_SOUND.source, 'AC-US-0005-12: the curb source differs from the reward');
    assert.notEqual(ENGINE_SOUND.source, REWARD_SOUND.source, 'AC-US-0005-12: three different sources');
    assert.equal(CURB_SOUND.source, 'noise', 'AC-US-0005-12: the curb is the only noise source');
    const audio = new RaceAudio();
    audio.curb();
    assert.equal(created.length, 0, 'AC-US-0005-12: no node before the context exists');
    await audio.toggle();
    assert.ok(audio.soundOn(), 'AC-US-0005-12: sound on after the first toggle');
    const engine = created.filter(n => n.kind === 'oscillator');
    assert.equal(engine.length, 1, 'AC-US-0005-12: the engine is one oscillator');
    assert.equal(engine[0].type, ENGINE_SOUND.source, 'AC-US-0005-12: of the engine descriptor type');
    created.length = 0;
    audio.curb();
    assert.deepEqual(created.map(n => n.kind), ['buffer-source', 'filter', 'gain'], 'AC-US-0005-12: one curb repeat is a buffer source through a filter and a gain');
    assert.equal(created[1].type, 'lowpass', 'AC-US-0005-12: the filter is a low-pass');
    assert.equal(created[1].frequency.value, CURB_SOUND.lowpassHz, 'AC-US-0005-12: at the descriptor frequency');
    assert.equal(CURB_SOUND.lowpassHz, 160, 'AC-US-0005-12: 160 Hz');
    created.length = 0;
    audio.reward(2);
    assert.deepEqual(created.map(n => n.kind).sort(), ['gain', 'gain', 'gain', 'oscillator', 'oscillator', 'oscillator'], 'AC-US-0005-12: the reward is oscillators only');
    assert.ok(created.filter(n => n.kind === 'oscillator').every(n => n.type === REWARD_SOUND.source), 'AC-US-0005-12: of the reward descriptor type');
    assert.ok(created.every(n => n.kind !== 'buffer-source' && n.kind !== 'filter'), 'AC-US-0005-12: no other sound uses a buffer source or a filter');
    created.length = 0;
    await audio.toggle();
    assert.equal(audio.soundOn(), false, 'AC-US-0005-11: sound off after the second toggle');
    audio.curb();
    assert.equal(created.length, 0, 'AC-US-0005-11: no curb node with the sound off');
  } finally {
    if (previous === undefined) delete globals.AudioContext; else globals.AudioContext = previous;
  }
});

test('CHK-TEST-0008-08 the application plays the curb sound and vibrates only from the per-step decision inside the step loop', () => {
  // AC-US-0005-09, AC-US-0005-07
  const main = stripComments(readFileSync(join(src, 'main.ts'), 'utf8'));
  assert.equal(main.split('audio.curb(').length - 1, 1, 'AC-US-0005-09: audio.curb( is called in exactly one place');
  assert.match(main, /if \(feedback\.sound\) audio\.curb\(\);/, 'AC-US-0005-09: the call is guarded by the sound decision');
  assert.equal(main.split('navigator.vibrate(').length - 1, 1, 'AC-US-0005-07: navigator.vibrate( is called in exactly one place');
  assert.match(main, /if \(feedback\.pulse\) navigator\.vibrate\(CURB_PULSE_MS\);/, 'AC-US-0005-07: the call is guarded by the pulse decision with the 20 ms constant');
  assert.match(main, /const contact = getTrackContact\(lap\.kart, lap\.environment, lap\.config\);/, 'AC-US-0005-09: the contact is read from the lap after the step');
  assert.match(main, /lap = stepLap\(lap, input\);[\s\S]{0,600}decideCurbFeedback\(curbState, \{/, 'AC-US-0005-09: the decision follows stepLap inside the loop');
  assert.match(main, /channel: coarsePointer\.matches \? 'web-mobile' : 'web-desktop', vibrationAvailable, soundOn: audio\.soundOn\(\)/, 'AC-US-0005-07: channel, vibration and sound state are passed as the contract names them');
  assert.match(main, /const vibrationAvailable = typeof navigator\.vibrate === 'function';/, 'REQ-FEAT-0005-19: the vibration availability is detected, not assumed');
  assert.ok((main.match(/curbState = initialCurbFeedback\(\);/g) ?? []).length >= 2, 'AC-US-0005-08: the feedback state is reset per session and per lap');
});
