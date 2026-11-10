// TEST-0002 — the audio output over a substitute AudioContext and OfflineAudioContext (API-0002, DES-0003): the recordings
// decoded from the embedded `data:` text and played by looping buffer sources, the ramps scheduled on the gains, the
// sound command and its idempotency, and every way a recording or the audio output can be unavailable (strategy: sound,
// unit, integration and contract levels). No network and no clock: the substitute only records what it is asked.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { decodeRecordingDataUrl, findLoopBounds, LOOP_SILENCE_THRESHOLD, RaceAudio } from '../src/audio';
import type { SoundOutput, SoundReading } from '../src/soundOutput';
import {
  dataUrlOf, FAKE_BUFFER_SHAPE, fakeAudio, fakeSamples, gainOf, lastEvent, settle, sourcesOf, withAudioGlobals, type FakeAudio, type FakeNode,
} from './helpers/soundContext';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const engineBytes = new Uint8Array(readFileSync(join(root, 'src', 'assets', 'engine-loop.mp3')));
const tireBytes = new Uint8Array(readFileSync(join(root, 'src', 'assets', 'tire-screech.mp3')));
const RECORDINGS = { engineLoopDataUrl: dataUrlOf(engineBytes), tireScreechDataUrl: dataUrlOf(tireBytes) };
const OUTPUT_FIELDS = ['engineGainNorm', 'enginePitchRatio', 'engineSoundAvailable', 'engineSoundState', 'soundOn', 'tireGainNorm', 'tireSoundAvailable', 'tireSoundState'];
const TOLERANCE = 1e-9;
const sameBytes = (a: Uint8Array, b: Uint8Array) => a.length === b.length && Buffer.from(a).equals(Buffer.from(b));
const running = (patch: Partial<SoundReading> = {}): SoundReading => ({ nowMs: 0, lapPhase: 'RUNNING', simStepCount: 1, speedMps: 10, throttleNorm: 1, tireMarkingAsphalt: false, ...patch });
// The source that plays a given recording: the one whose buffer is the buffer the decoder gave for those bytes.
function voiceOf(audio: FakeAudio, bytes: Uint8Array): { source: FakeNode; gain: FakeNode } {
  const decoded = audio.decoded.find(d => sameBytes(d.bytes, bytes));
  const source = sourcesOf(audio).find(s => decoded?.buffer !== undefined && s.buffer === decoded.buffer);
  if (!source) throw new Error('fixture: no buffer source plays the buffer decoded from these bytes');
  return { source, gain: gainOf(source) };
}
// A RaceAudio with both recordings decoded and the sound turned on, over a fresh substitute.
async function playing(body: (audio: RaceAudio, fake: FakeAudio, warnings: unknown[][]) => void | Promise<void>, fake: FakeAudio = fakeAudio()) {
  await withAudioGlobals(fake, async warnings => {
    const audio = new RaceAudio();
    await audio.loadRecordings(RECORDINGS);
    audio.setSoundOn(true);
    await body(audio, fake, warnings);
  });
}
const withoutThrowing = (label: string, action: () => SoundOutput): SoundOutput => {
  let out: SoundOutput | undefined;
  assert.doesNotThrow(() => { out = action(); }, label);
  return out!;
};

test('CHK-TEST-0002-01 the loop bounds of a decoded recording are its first and last sample above the silence threshold, so the padding at both ends stays out of the repeat', () => {
  // AC-US-0003-01
  const shape = FAKE_BUFFER_SHAPE;
  const bounds = findLoopBounds(fakeSamples(), shape.sampleRateHz);
  assert.ok(Math.abs(bounds.loopStartS - shape.leadSilence / shape.sampleRateHz) <= TOLERANCE, `AC-US-0003-01: the loop starts at the first sounding sample (${bounds.loopStartS} s)`);
  assert.ok(Math.abs(bounds.loopEndS - (shape.leadSilence + shape.sound - 1) / shape.sampleRateHz) <= TOLERANCE, `AC-US-0003-01: the loop ends at the last sounding sample (${bounds.loopEndS} s)`);
  assert.ok(bounds.loopEndS > bounds.loopStartS, 'AC-US-0003-01: the loop has a positive length');
  // A sample below the threshold is silence; one above it, of either sign, is sound (32-bit samples: no value sits exactly on it).
  const edge = new Float32Array(100);
  edge[10] = LOOP_SILENCE_THRESHOLD / 2; edge[30] = LOOP_SILENCE_THRESHOLD * 2; edge[60] = -LOOP_SILENCE_THRESHOLD * 2; edge[80] = -LOOP_SILENCE_THRESHOLD / 2;
  const edgeBounds = findLoopBounds(edge, 100);
  assert.ok(Math.abs(edgeBounds.loopStartS - 0.30) <= TOLERANCE, `AC-US-0003-01: a sample below the threshold counts as silence (start ${edgeBounds.loopStartS} s)`);
  assert.ok(Math.abs(edgeBounds.loopEndS - 0.60) <= TOLERANCE, `AC-US-0003-01: a negative sample above the threshold in modulus counts as sound (end ${edgeBounds.loopEndS} s)`);
  const silent = findLoopBounds(new Float32Array(500), 1000);
  assert.ok(Math.abs(silent.loopStartS) <= TOLERANCE && Math.abs(silent.loopEndS - 0.5) <= TOLERANCE, 'AC-US-0003-01: without any sounding sample the bounds are the whole buffer');
  assert.ok(LOOP_SILENCE_THRESHOLD > 0 && LOOP_SILENCE_THRESHOLD < 0.01, `AC-US-0003-01: the threshold is a small fraction of full scale (${LOOP_SILENCE_THRESHOLD})`);
});

test('CHK-TEST-0002-02 the embedded text of a recording decodes to exactly the bytes of the file, and a text of another form or with a payload that is not base 64 gives no bytes', () => {
  // AC-US-0003-10
  const bytes = decodeRecordingDataUrl(dataUrlOf(engineBytes));
  assert.ok(bytes !== undefined && sameBytes(bytes, engineBytes), 'AC-US-0003-10: the data text of src/assets/engine-loop.mp3 decodes to the bytes of the file');
  const tire = decodeRecordingDataUrl(dataUrlOf(tireBytes));
  assert.ok(tire !== undefined && sameBytes(tire, tireBytes), 'AC-US-0004-06: the data text of src/assets/tire-screech.mp3 decodes to the bytes of the file');
  for (const text of ['', 'engine-loop.mp3', '/assets/engine-loop-abc123.mp3', 'https://example.invalid/engine-loop.mp3', 'data:audio/mpeg,plain', `base64,${Buffer.from(engineBytes.slice(0, 30)).toString('base64')}`]) {
    assert.equal(decodeRecordingDataUrl(text), undefined, `AC-US-0003-10: "${text.slice(0, 40)}" is not a base 64 data text and gives no bytes`);
  }
  for (const payload of ['@@@@', 'AAA*AAA=', 'AAAA AAAA', 'A===']) {
    assert.equal(decodeRecordingDataUrl(`data:audio/mpeg;base64,${payload}`), undefined, `AC-US-0003-10: the payload "${payload}" is not base 64 and gives no bytes`);
  }
  assert.equal(decodeRecordingDataUrl(undefined as unknown as string), undefined, 'AC-US-0003-10: a missing text gives no bytes and does not throw');
});

test('CHK-TEST-0002-03 a new audio output reads sound off, both sounds silent and gains 0, with exactly the 8 fields of the contract, and reading it changes nothing', async () => {
  // AC-US-0003-08
  await withAudioGlobals(fakeAudio(), () => {
    const audio = new RaceAudio();
    const out = audio.getSoundOutput();
    assert.deepEqual(Object.keys(out).sort(), OUTPUT_FIELDS, 'AC-US-0003-08: getSoundOutput has exactly the 8 fields of API-0002');
    assert.equal(out.soundOn, false, 'AC-US-0003-08: the sound is off when the game opens');
    assert.equal(out.engineSoundState, 'ENGINE_SILENT', 'AC-US-0003-08: the engine is silent when the game opens');
    assert.equal(out.tireSoundState, 'TIRE_SILENT', 'AC-US-0003-08: the tyre is silent when the game opens');
    assert.equal(out.engineGainNorm, 0, 'AC-US-0003-08: the engine gain is 0 when the game opens');
    assert.equal(out.tireGainNorm, 0, 'AC-US-0003-08: the tyre gain is 0 when the game opens');
    assert.deepEqual(audio.getSoundOutput(), out, 'AC-US-0003-08: reading again gives the same values');
    assert.equal(audio.soundOn(), false, 'AC-US-0003-08: the reading the curb sound uses is off as well');
    const on = audio.setSoundOn(true);
    assert.deepEqual(Object.keys(on).sort(), OUTPUT_FIELDS, 'AC-US-0003-08: setSoundOn answers with the same 8 fields');
    assert.deepEqual(audio.getSoundOutput(), on, 'AC-US-0003-08: setSoundOn answers what getSoundOutput reads after the request');
    assert.equal(new RaceAudio().getSoundOutput().soundOn, false, 'AC-US-0003-08: another audio output (a reload) opens off again');
  });
});

test('CHK-TEST-0002-04 the engine sound is the recording of src/assets/engine-loop.mp3: the decoder receives exactly its bytes and the engine source loops the buffer it gave, started once and never stopped', async () => {
  // AC-US-0003-10
  await playing((audio, fake) => {
    const decoded = fake.decoded.find(d => sameBytes(d.bytes, engineBytes));
    assert.ok(decoded, 'AC-US-0003-10: the decoder received exactly the bytes of src/assets/engine-loop.mp3');
    const { source } = voiceOf(fake, engineBytes);
    assert.equal(source.buffer, decoded.buffer, 'AC-US-0003-10: the engine source plays the buffer decoded from those bytes');
    assert.equal(source.loop, true, 'AC-US-0003-01: the engine source repeats');
    const bounds = findLoopBounds(fakeSamples(), FAKE_BUFFER_SHAPE.sampleRateHz);
    assert.ok(Math.abs(source.loopStart - bounds.loopStartS) <= TOLERANCE, `AC-US-0003-01: the repeat starts at the first sounding sample (${source.loopStart} s)`);
    assert.ok(Math.abs(source.loopEnd - bounds.loopEndS) <= TOLERANCE, `AC-US-0003-01: the repeat ends at the last sounding sample (${source.loopEnd} s)`);
    for (let i = 0; i < 50; i++) audio.refresh(running({ simStepCount: i + 1, nowMs: i * 8, lapPhase: i % 10 === 9 ? 'PAUSED' : 'RUNNING' }));
    assert.equal(source.startCount, 1, 'AC-US-0003-01: the engine source is started exactly once');
    assert.equal(source.stopCount, 0, 'AC-US-0003-01: the engine source is never stopped: silence is gain 0');
    assert.equal(sourcesOf(fake).length, 2, 'AC-US-0003-10: one source per recording, none more');
    assert.equal(fake.decoded.length, 2, 'AC-US-0003-10: each recording is decoded once');
  });
});

test('CHK-TEST-0002-05 no synthesized engine tone exists: turning the sound on and running a lap creates no oscillator and no filter', async () => {
  // AC-US-0003-10
  await playing((audio, fake) => {
    for (let i = 0; i < 120; i++) audio.refresh(running({ simStepCount: i + 1, nowMs: i * 8, speedMps: i / 4, throttleNorm: i % 2 }));
    assert.equal(audio.getSoundOutput().engineSoundState, 'ENGINE_PLAYING', 'AC-US-0003-10: fixture: the engine plays');
    assert.deepEqual(fake.created.filter(n => n.kind === 'oscillator').length, 0, 'AC-US-0003-10: no oscillator is created for the engine');
    assert.deepEqual(fake.created.filter(n => n.kind === 'filter').length, 0, 'AC-US-0003-10: no filter is created for the engine');
    assert.deepEqual(fake.created.map(n => n.kind).sort(), ['buffer-source', 'buffer-source', 'gain', 'gain'], 'AC-US-0003-10: the whole graph is two recordings, each behind its gain');
  });
});

test('CHK-TEST-0002-06 the tyre sound is the recording of src/assets/tire-screech.mp3: the decoder receives exactly its bytes and the tyre source loops the buffer it gave', async () => {
  // AC-US-0004-06
  await playing((_audio, fake) => {
    const decoded = fake.decoded.find(d => sameBytes(d.bytes, tireBytes));
    assert.ok(decoded, 'AC-US-0004-06: the decoder received exactly the bytes of src/assets/tire-screech.mp3');
    const tire = voiceOf(fake, tireBytes), engine = voiceOf(fake, engineBytes);
    assert.equal(tire.source.buffer, decoded.buffer, 'AC-US-0004-06: the tyre source plays the buffer decoded from those bytes');
    assert.notEqual(tire.source, engine.source, 'AC-US-0004-06: the tyre has its own source');
    assert.notEqual(tire.source.buffer, engine.source.buffer, 'AC-US-0004-06: and its own recording');
    assert.equal(tire.source.loop, true, 'AC-US-0004-01: the tyre source repeats while the kart marks');
    assert.equal(tire.source.startCount, 1, 'AC-US-0004-06: the tyre source is started once');
    assert.equal(tire.source.stopCount, 0, 'AC-US-0004-06: and never stopped');
  });
});

test('CHK-TEST-0002-07 when the lap runs with the sound on, the engine gain is ramped to a value above 0 within 50 ms, to exactly the gain the output reads', async () => {
  // AC-US-0003-01
  await playing((audio, fake) => {
    const { gain } = voiceOf(fake, engineBytes);
    assert.equal(gain.gain.value, 0, 'AC-US-0003-01: fixture: before the lap runs the engine gain is 0');
    fake.contexts[0].currentTime = 12.5;
    const out = audio.refresh(running({ throttleNorm: 0, speedMps: 0 }));
    const ramp = lastEvent(gain.gain);
    assert.equal(ramp?.kind, 'linearRampToValueAtTime', 'AC-US-0003-01: the last thing scheduled on the engine gain is a linear ramp');
    assert.ok(ramp!.value! > 0, `AC-US-0003-01: the ramp goes to a gain above 0 with the kart at rest and the throttle released (${ramp!.value})`);
    assert.ok(Math.abs(ramp!.value! - out.engineGainNorm) <= TOLERANCE, 'AC-US-0003-01: the ramp target is engineGainNorm of the output');
    const lengthMs = (ramp!.timeS - 12.5) * 1000;
    assert.ok(lengthMs > 0 && lengthMs <= 50, `AC-US-0003-01: the engine sounds within 50 ms (${lengthMs} ms)`);
    assert.ok(Math.abs(lengthMs - 10) <= 1e-6, `AC-US-0003-01: the rise takes the designed 10 ms (${lengthMs} ms)`);
    // The gain follows the throttle while playing, without ever being scheduled to 0.
    const before = gain.gain.events.length;
    fake.contexts[0].currentTime = 13;
    const pressed = audio.refresh(running({ simStepCount: 2, throttleNorm: 1, speedMps: 0 }));
    const scheduled = gain.gain.events.slice(before).filter(e => e.kind === 'linearRampToValueAtTime');
    assert.equal(scheduled.length, 1, 'AC-US-0003-03: a new throttle schedules one new ramp');
    assert.ok(Math.abs(scheduled[0].value! - pressed.engineGainNorm) <= TOLERANCE && pressed.engineGainNorm > out.engineGainNorm, 'AC-US-0003-03: to the louder gain of the pressed throttle');
  });
});

test('CHK-TEST-0002-08 the playback rate asked of the engine source is the pitch ratio of the output, higher at 20 m/s than at 5 m/s', async () => {
  // AC-US-0003-02
  await playing((audio, fake) => {
    const { source } = voiceOf(fake, engineBytes);
    const slow = audio.refresh(running({ simStepCount: 1, speedMps: 5 }));
    const slowRate = lastEvent(source.playbackRate);
    assert.ok(slowRate && Math.abs(slowRate.value! - slow.enginePitchRatio) <= TOLERANCE, `AC-US-0003-02: at 5 m/s the playback rate asked is the pitch ratio (${slowRate?.value} / ${slow.enginePitchRatio})`);
    const fast = audio.refresh(running({ simStepCount: 2, speedMps: 20 }));
    const fastRate = lastEvent(source.playbackRate);
    assert.ok(fastRate && Math.abs(fastRate.value! - fast.enginePitchRatio) <= TOLERANCE, `AC-US-0003-02: at 20 m/s the playback rate asked is the pitch ratio (${fastRate?.value} / ${fast.enginePitchRatio})`);
    assert.ok(fastRate!.value! > slowRate!.value!, `AC-US-0003-02: the rate asked at 20 m/s (${fastRate!.value}) is above the rate asked at 5 m/s (${slowRate!.value})`);
    assert.ok(slowRate!.value! > 0, 'AC-US-0003-02: the rate is above 0');
    const tire = voiceOf(fake, tireBytes);
    assert.equal(tire.source.playbackRate.events.length, 0, 'AC-US-0003-02: the speed changes the pitch of the engine only');
  });
});

test('CHK-TEST-0002-09 when the engine goes silent with the sound on, its gain is ramped to exactly 0 in 80 ms, inside the 200 ms deadline', async () => {
  // AC-US-0003-04
  await playing((audio, fake) => {
    const { gain } = voiceOf(fake, engineBytes);
    audio.refresh(running());
    fake.contexts[0].currentTime = 30;
    const out = audio.refresh(running({ lapPhase: 'PAUSED' }));
    assert.equal(out.engineGainNorm, 0, 'AC-US-0003-04: the output asks for gain 0 in the evaluation of the pause');
    const ramp = lastEvent(gain.gain);
    assert.equal(ramp?.kind, 'linearRampToValueAtTime', 'AC-US-0003-04: with the sound on the silence is a linear ramp');
    assert.equal(ramp!.value, 0, 'AC-US-0003-04: that reaches exactly 0');
    const lengthMs = (ramp!.timeS - 30) * 1000;
    assert.ok(lengthMs > 0 && lengthMs <= 200, `AC-US-0003-04: the engine is silent within 200 ms (${lengthMs} ms)`);
    assert.ok(Math.abs(lengthMs - 80) <= 1e-6, `AC-US-0003-04: the fall takes the designed 80 ms (${lengthMs} ms)`);
  });
});

test('CHK-TEST-0002-10 while the kart marks the asphalt the tyre gain is ramped above 0, and when it stops marking the gain is ramped to exactly 0 in 80 ms', async () => {
  // AC-US-0004-02
  await playing((audio, fake) => {
    const { gain } = voiceOf(fake, tireBytes);
    assert.equal(gain.gain.value, 0, 'AC-US-0004-01: fixture: the tyre gain is 0 before any mark');
    audio.refresh(running({ simStepCount: 1 }));
    assert.equal(gain.gain.events.filter(e => e.kind === 'linearRampToValueAtTime' && e.value! > 0).length, 0, 'AC-US-0004-04: rolling without a mark schedules no tyre sound');
    fake.contexts[0].currentTime = 4;
    const marking = audio.refresh(running({ simStepCount: 2, tireMarkingAsphalt: true }));
    const up = lastEvent(gain.gain);
    assert.equal(up?.kind, 'linearRampToValueAtTime', 'AC-US-0004-01: the mark schedules a ramp on the tyre gain');
    assert.ok(up!.value! > 0 && Math.abs(up!.value! - marking.tireGainNorm) <= TOLERANCE, `AC-US-0004-01: to the tyre gain of the output, above 0 (${up!.value})`);
    assert.ok((up!.timeS - 4) * 1000 <= 50, `AC-US-0004-01: the tyre sounds at once (${(up!.timeS - 4) * 1000} ms)`);
    fake.contexts[0].currentTime = 5;
    const stopped = audio.refresh(running({ simStepCount: 3, tireMarkingAsphalt: false }));
    assert.equal(stopped.tireGainNorm, 0, 'AC-US-0004-02: the output asks for tyre gain 0 in the evaluation of the first step without a mark');
    const down = lastEvent(gain.gain);
    assert.equal(down?.kind, 'linearRampToValueAtTime', 'AC-US-0004-02: with the sound on the silence is a linear ramp');
    assert.equal(down!.value, 0, 'AC-US-0004-02: that reaches exactly 0');
    const lengthMs = (down!.timeS - 5) * 1000;
    assert.ok(lengthMs > 0 && lengthMs <= 200, `AC-US-0004-02: the tyre is silent within 200 ms of the last mark (${lengthMs} ms)`);
    assert.ok(Math.abs(lengthMs - 80) <= 1e-6, `AC-US-0004-02: the fall takes the designed 80 ms (${lengthMs} ms)`);
  });
});

test('CHK-TEST-0002-11 turning the sound off during a slide cuts the tyre gain to 0 at the instant of the action, with no ramp', async () => {
  // AC-US-0004-05
  await playing((audio, fake) => {
    const { gain } = voiceOf(fake, tireBytes);
    audio.refresh(running({ tireMarkingAsphalt: true }));
    assert.equal(audio.getSoundOutput().tireSoundState, 'TIRE_PLAYING', 'AC-US-0004-05: fixture: the tyre plays');
    fake.contexts[0].currentTime = 9.25;
    const before = gain.gain.events.length;
    const out = audio.setSoundOn(false);
    assert.equal(out.tireSoundState, 'TIRE_SILENT', 'AC-US-0004-05: with the sound off the tyre is TIRE_SILENT');
    assert.equal(out.tireGainNorm, 0, 'AC-US-0004-05: and the gain asked is 0');
    const scheduled = gain.gain.events.slice(before);
    const cut = scheduled[scheduled.length - 1];
    assert.equal(cut?.kind, 'setValueAtTime', 'AC-US-0004-05: the last thing scheduled on the tyre gain is a value set, not a ramp');
    assert.equal(cut.value, 0, 'AC-US-0004-05: the value set is 0');
    assert.ok(Math.abs(cut.timeS - 9.25) <= TOLERANCE, `AC-US-0004-05: at the instant of the action (${cut.timeS} s)`);
    assert.equal(scheduled.filter(e => e.kind === 'linearRampToValueAtTime' || e.kind === 'setTargetAtTime' || e.kind === 'exponentialRampToValueAtTime').length, 0, 'AC-US-0004-05: no ramp is scheduled when the sound is turned off');
    // The slide goes on with the sound off: nothing is scheduled above 0.
    const afterCut = gain.gain.events.length;
    for (let i = 0; i < 30; i++) audio.refresh(running({ simStepCount: 10 + i, tireMarkingAsphalt: true }));
    assert.equal(gain.gain.events.slice(afterCut).filter(e => (e.value ?? 0) > 0).length, 0, 'AC-US-0004-05: while the sound is off the slide schedules no tyre sound');
  });
});

test('CHK-TEST-0002-12 the sound command carries the final state: a value that is not a boolean is ignored, and asking for the state the sound is already in creates, restarts and schedules nothing', async () => {
  // AC-US-0003-09
  {
    const fake = fakeAudio();
    await withAudioGlobals(fake, async () => {
      const audio = new RaceAudio();
      await audio.loadRecordings(RECORDINGS);
      for (const value of [undefined, null, 1, 0, 'true', 'false', {}, []]) {
        const out = withoutThrowing(`AC-US-0003-09: setSoundOn(${JSON.stringify(value)}) does not throw`, () => audio.setSoundOn(value as unknown as boolean));
        assert.equal(out.soundOn, false, `AC-US-0003-09: setSoundOn(${JSON.stringify(value)}) does not turn the sound on`);
      }
      assert.equal(fake.contexts.length, 0, 'AC-US-0003-09: an ignored request creates no audio context');
      audio.setSoundOn(true);
      audio.refresh(running({ tireMarkingAsphalt: true }));
      for (const value of [undefined, 0, 'false', null]) {
        assert.equal(audio.setSoundOn(value as unknown as boolean).soundOn, true, `AC-US-0003-09: setSoundOn(${JSON.stringify(value)}) does not turn the sound off`);
      }
      const nodes = fake.created.length, contexts = fake.contexts.length;
      const engine = voiceOf(fake, engineBytes), tire = voiceOf(fake, tireBytes);
      const events = () => engine.gain.gain.events.length + tire.gain.gain.events.length + engine.source.playbackRate.events.length;
      const scheduled = events();
      const first = audio.getSoundOutput();
      for (let i = 0; i < 5; i++) assert.deepEqual(audio.setSoundOn(true), first, 'AC-US-0003-09: asking again for sound on gives the same output');
      assert.equal(fake.created.length, nodes, 'AC-US-0003-09: repeating setSoundOn(true) creates no node');
      assert.equal(fake.contexts.length, contexts, 'AC-US-0003-09: nor another audio context');
      assert.equal(engine.source.startCount + tire.source.startCount, 2, 'AC-US-0003-09: nor restarts a source');
      assert.equal(events(), scheduled, 'AC-US-0003-09: nor schedules anything again');
      for (let i = 0; i < 5; i++) audio.refresh(running({ tireMarkingAsphalt: true }));
      assert.equal(events(), scheduled, 'AC-US-0003-09: the same reading presented again schedules nothing');
      // Two requests in a row: the last one decides.
      audio.setSoundOn(false);
      assert.equal(audio.setSoundOn(true).soundOn, true, 'AC-US-0003-09: off then on ends on');
      audio.setSoundOn(true);
      assert.equal(audio.setSoundOn(false).soundOn, false, 'AC-US-0003-09: on then off ends off');
      const off = audio.getSoundOutput(), offEvents = events();
      assert.deepEqual(audio.setSoundOn(false), off, 'AC-US-0003-09: asking again for sound off gives the same output');
      assert.equal(events(), offEvents, 'AC-US-0003-09: and schedules nothing');
      assert.equal(fake.created.length, nodes, 'AC-US-0003-09: turning off and on again creates no node');
    });
  }
});

test('CHK-TEST-0002-13 loading the recordings again decodes nothing again and builds no second source', async () => {
  // AC-US-0003-10
  await playing(async (audio, fake) => {
    const nodes = fake.created.length;
    await audio.loadRecordings(RECORDINGS);
    await audio.loadRecordings({ engineLoopDataUrl: dataUrlOf(tireBytes), tireScreechDataUrl: dataUrlOf(engineBytes) });
    assert.equal(fake.decoded.length, 2, 'AC-US-0003-10: a second load decodes nothing');
    assert.equal(fake.created.length, nodes, 'AC-US-0003-10: and builds no node');
    assert.equal(voiceOf(fake, engineBytes).source.startCount, 1, 'AC-US-0003-10: the engine source is not restarted');
  });
});

test('CHK-TEST-0002-14 turning the sound on before the decoding ended still plays the recording: the source is built when its decoding ends', async () => {
  // AC-US-0003-10
  const fake = fakeAudio();
  await withAudioGlobals(fake, async () => {
    const audio = new RaceAudio();
    const on = withoutThrowing('AC-US-0003-10: turning the sound on before the recordings are loaded does not throw', () => audio.setSoundOn(true));
    assert.equal(on.soundOn, true, 'AC-US-0003-10: the sound is on');
    assert.equal(on.engineSoundAvailable, false, 'AC-US-0003-10: the engine sound is not available before its decoding');
    assert.equal(audio.refresh(running()).engineGainNorm, 0, 'AC-US-0003-10: and no engine sound is asked meanwhile');
    assert.equal(sourcesOf(fake).length, 0, 'AC-US-0003-10: no source exists before the decoding');
    await audio.loadRecordings(RECORDINGS);
    const out = audio.getSoundOutput();
    assert.equal(out.engineSoundAvailable, true, 'AC-US-0003-10: after the decoding the engine sound is available');
    assert.equal(out.engineSoundState, 'ENGINE_PLAYING', 'AC-US-0003-10: and plays for the lap already running');
    const { source, gain } = voiceOf(fake, engineBytes);
    assert.equal(source.startCount, 1, 'AC-US-0003-10: the engine source was started');
    const ramp = lastEvent(gain.gain, 'linearRampToValueAtTime');
    assert.ok(ramp && ramp.value! > 0, 'AC-US-0003-10: and its gain was ramped above 0');
  });
});

// The four ways a recording can be unreadable and the two ways the browser can have no audio output (US-0003, abnormal
// case "Arquivo de som ausente, ilegível, ou navegador sem áudio"): the sound stays unavailable, nothing throws or rejects.
async function unavailable(label: string, fake: FakeAudio | undefined, globals: { AudioContext?: unknown; OfflineAudioContext?: unknown }, recordings: { engineLoopDataUrl: string; tireScreechDataUrl: string }, awaitLoad: boolean) {
  await withAudioGlobals(globals, async warnings => {
    const audio = new RaceAudio();
    const load = audio.loadRecordings(recordings);
    let rejected: unknown;
    load.catch(error => { rejected = error ?? new Error('rejected'); });
    if (awaitLoad) await load; else await settle();
    assert.equal(rejected, undefined, `AC-US-0003-10: ${label}: loadRecordings does not reject`);
    const on = withoutThrowing(`AC-US-0003-10: ${label}: setSoundOn(true) does not throw`, () => audio.setSoundOn(true));
    assert.equal(on.soundOn, true, `AC-US-0003-10: ${label}: the sound state changes as asked`);
    assert.equal(on.engineSoundAvailable, false, `AC-US-0003-10: ${label}: engineSoundAvailable is false`);
    let out = on;
    for (let i = 0; i < 20; i++) out = withoutThrowing(`AC-US-0003-10: ${label}: refresh does not throw`, () => audio.refresh(running({ simStepCount: i + 1, tireMarkingAsphalt: true })));
    assert.equal(out.engineSoundState, 'ENGINE_SILENT', `AC-US-0003-10: ${label}: the engine is ENGINE_SILENT with the lap running`);
    assert.equal(out.engineGainNorm, 0, `AC-US-0003-10: ${label}: the engine gain is 0`);
    assert.equal(withoutThrowing(`AC-US-0003-10: ${label}: setSoundOn(false) does not throw`, () => audio.setSoundOn(false)).soundOn, false, `AC-US-0003-10: ${label}: the sound can be turned off again`);
    if (fake) assert.equal(fake.created.filter(n => n.kind === 'buffer-source' && n.buffer !== undefined && fake.decoded.some(d => d.buffer === n.buffer && sameBytes(d.bytes, engineBytes))).length, 0, `AC-US-0003-10: ${label}: no source plays an engine recording`);
    // What is logged names the role and the reason, never the embedded text.
    for (const args of warnings) for (const arg of args) assert.ok(typeof arg !== 'string' || arg.length < 100, `AC-US-0003-10: ${label}: a warning never carries the embedded text`);
  });
}

test('CHK-TEST-0002-15 an embedded engine text that is not a base 64 data text leaves the engine sound unavailable and silent; nothing throws and the load does not reject', async () => {
  // AC-US-0003-10
  for (const text of ['/assets/engine-loop.mp3', 'data:audio/mpeg;base64,@@not-base-64@@', '']) {
    const fake = fakeAudio();
    await unavailable(`engine text "${text.slice(0, 30)}"`, fake, fake, { engineLoopDataUrl: text, tireScreechDataUrl: RECORDINGS.tireScreechDataUrl }, true);
    assert.equal(fake.decoded.filter(d => !sameBytes(d.bytes, tireBytes)).length, 0, 'AC-US-0003-10: nothing but the tyre recording reaches the decoder');
  }
  const fake = fakeAudio();
  await unavailable('no recordings argument', fake, fake, undefined as unknown as typeof RECORDINGS, true);
});

test('CHK-TEST-0002-16 engine bytes the decoder rejects leave the engine sound unavailable and silent; nothing throws and the load does not reject', async () => {
  // AC-US-0003-10
  const fake = fakeAudio({ decoder: bytes => sameBytes(bytes, engineBytes) ? 'reject' : 'ok' });
  await unavailable('decoder rejects the engine bytes', fake, fake, RECORDINGS, true);
  assert.ok(fake.decoded.some(d => sameBytes(d.bytes, engineBytes)), 'AC-US-0003-10: fixture: the decoder was given the engine bytes and rejected them');
});

test('CHK-TEST-0002-17 a decoding that never ends leaves the engine sound unavailable and silent, with no timer and no retry', async () => {
  // AC-US-0003-10
  const fake = fakeAudio({ decoder: 'never' });
  await unavailable('decoding never ends', fake, fake, RECORDINGS, false);
  assert.equal(fake.decoded.length, 2, 'AC-US-0003-10: each recording was given to the decoder once: there is no retry');
});

test('CHK-TEST-0002-18 without an offline decoder in the browser the engine sound is unavailable and silent; nothing throws and the load does not reject', async () => {
  // AC-US-0003-10
  const fake = fakeAudio();
  await unavailable('no OfflineAudioContext', fake, { AudioContext: fake.AudioContext }, RECORDINGS, true);
  assert.equal(fake.decoded.length, 0, 'AC-US-0003-10: fixture: nothing was decoded');
});

test('CHK-TEST-0002-19 without an audio output in the browser both sounds are unavailable, the sound state still changes as asked, and the reading the curb sound uses stays off', async () => {
  // AC-US-0003-10
  const decoderOnly = fakeAudio();
  await unavailable('no AudioContext', undefined, { OfflineAudioContext: decoderOnly.OfflineAudioContext }, RECORDINGS, true);
  await withAudioGlobals({ OfflineAudioContext: decoderOnly.OfflineAudioContext }, async () => {
    const audio = new RaceAudio();
    await audio.loadRecordings(RECORDINGS);
    const out = audio.setSoundOn(true);
    assert.equal(out.tireSoundAvailable, false, 'AC-US-0004-06: without an audio output tireSoundAvailable is false');
    assert.equal(audio.refresh(running({ tireMarkingAsphalt: true })).tireGainNorm, 0, 'AC-US-0004-06: and the tyre gain is 0 while the kart marks');
    assert.equal(audio.soundOn(), false, 'AC-US-0003-10: without a running audio context the curb sound reads sound off');
    assert.doesNotThrow(() => { audio.curb(); audio.reward(2); }, 'AC-US-0003-10: the curb sound and the reward do nothing and do not throw');
  });
  const throwing = fakeAudio({ contextThrows: true });
  await unavailable('the AudioContext constructor throws', throwing, throwing, RECORDINGS, true);
  assert.equal(throwing.created.length, 0, 'AC-US-0003-10: no node exists when the audio context could not be created');
});

test('CHK-TEST-0002-20 with only the tyre text malformed the tyre sound is unavailable and silent while the kart marks, and the engine plays', async () => {
  // AC-US-0004-06
  const fake = fakeAudio();
  await withAudioGlobals(fake, async () => {
    const audio = new RaceAudio();
    let rejected: unknown;
    await audio.loadRecordings({ engineLoopDataUrl: RECORDINGS.engineLoopDataUrl, tireScreechDataUrl: 'tire-screech.mp3' }).catch(error => { rejected = error ?? new Error('rejected'); });
    assert.equal(rejected, undefined, 'AC-US-0004-06: loadRecordings does not reject');
    const on = withoutThrowing('AC-US-0004-06: setSoundOn(true) does not throw', () => audio.setSoundOn(true));
    assert.equal(on.tireSoundAvailable, false, 'AC-US-0004-06: tireSoundAvailable is false');
    assert.equal(on.engineSoundAvailable, true, 'AC-US-0004-06: engineSoundAvailable is true');
    let out = on;
    for (let i = 0; i < 20; i++) out = audio.refresh(running({ simStepCount: i + 1, tireMarkingAsphalt: true }));
    assert.equal(out.tireSoundState, 'TIRE_SILENT', 'AC-US-0004-06: the tyre is TIRE_SILENT while the kart marks');
    assert.equal(out.tireGainNorm, 0, 'AC-US-0004-06: the tyre gain is 0');
    assert.equal(out.engineSoundState, 'ENGINE_PLAYING', 'AC-US-0004-06: the engine plays');
    assert.ok(out.engineGainNorm > 0, 'AC-US-0004-06: with a gain above 0');
    assert.equal(sourcesOf(fake).length, 1, 'AC-US-0004-06: only the engine has a source');
    assert.equal(voiceOf(fake, engineBytes).source.startCount, 1, 'AC-US-0004-06: and it was started');
  });
});
