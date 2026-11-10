// Optional sound feedback. No downloads; the audio context is created only from a user gesture.
// Each sound builds its signal from its own descriptor (DES-0009 of pista-kart-park): the source type, the peak and the
// duration come from it, so two sounds with the same `source` would share a waveform; the curb is the only noise source.
// The engine and the tyre play recordings that come inside the script (DES-0003 of apresentacao-e-som).
import {
  decideSoundOutput, initialSoundDecision, ENGINE_GAIN_FULL_NORM, SOUND_FADE_IN_MS, SOUND_FADE_OUT_MS,
  type SoundDecisionState, type SoundOutput, type SoundReading,
} from './soundOutput';

export type SoundSignal = { source: 'noise' | 'triangle' | 'sine' | 'recording'; lowpassHz?: number; durationMs?: number; peakGain: number };
export const ENGINE_SOUND: Readonly<SoundSignal> = Object.freeze({ source: 'recording', peakGain: ENGINE_GAIN_FULL_NORM });
export const REWARD_SOUND: Readonly<SoundSignal> = Object.freeze({ source: 'sine', durationMs: 180, peakGain: 0.035 });
// Short, low noise (DOMAIN/DEC-11): white noise through a 160 Hz low-pass, 5 ms attack, exponential decay to 60 ms.
export const CURB_SOUND: Readonly<SoundSignal> = Object.freeze({ source: 'noise', lowpassHz: 160, durationMs: 60, peakGain: 0.05 });
const CURB_ATTACK_S = 0.005;
// Below this amplitude (fraction of full scale) a sample counts as edge silence of a recording.
export const LOOP_SILENCE_THRESHOLD = 0.002;
const ENGINE_PITCH_TIME_CONSTANT_S = 0.08;
const RECORDING_DATA_URL = /^data:[^,]*;base64,([A-Za-z0-9+/]*={0,2})$/;

// Fixed-seed linear congruential generator: the noise buffer is the same in every page and every run (no Math.random).
function whiteNoise(samples: number): Float32Array<ArrayBuffer> {
  const out = new Float32Array(new ArrayBuffer(samples * 4));
  let seed = 0x2545f491;
  for (let i = 0; i < samples; i++) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    out[i] = seed / 0x80000000 - 1;
  }
  return out;
}

// The bytes of a `data:<type>;base64,<payload>` text, the form the bundler gives an inlined recording; undefined when the
// text has another form or the payload is not valid base 64. Reads nothing but its argument.
export function decodeRecordingDataUrl(dataUrl: string): Uint8Array<ArrayBuffer> | undefined {
  const match = typeof dataUrl === 'string' ? RECORDING_DATA_URL.exec(dataUrl) : null;
  if (!match || typeof atob !== 'function') return undefined;
  let binary: string;
  try { binary = atob(match[1]); } catch { return undefined; }
  const bytes = new Uint8Array(new ArrayBuffer(binary.length));
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

// The positions (s) of the first and of the last sample above the silence threshold: the encoder padding of a decoded
// recording stays out of the loop (ADR-0002). Without any such sample, the whole buffer.
export function findLoopBounds(samples: Float32Array, sampleRateHz: number): { loopStartS: number; loopEndS: number } {
  let first = 0, last = samples.length - 1;
  while (first < samples.length && Math.abs(samples[first]) <= LOOP_SILENCE_THRESHOLD) first++;
  if (first === samples.length) return { loopStartS: 0, loopEndS: samples.length / sampleRateHz };
  while (Math.abs(samples[last]) <= LOOP_SILENCE_THRESHOLD) last--;
  return { loopStartS: first / sampleRateHz, loopEndS: last / sampleRateHz };
}

type RecordingKey = 'engine' | 'tire';
const RECORDING_ROLE: Record<RecordingKey, string> = { engine: 'ENGINE_LOOP', tire: 'TIRE_SCREECH' };
type Recording = { buffer: AudioBuffer; loopStartS: number; loopEndS: number };
// A looping source behind a gain, started once and never stopped: silence is gain 0. `gainTarget` and `pitchRatio` are
// the last values scheduled; `rampEndS` is when the last gain ramp ends, in context time.
type Voice = { source: AudioBufferSourceNode; gain: GainNode; gainTarget: number; pitchRatio: number; rampEndS: number };

export class RaceAudio {
  private context?: AudioContext;
  private contextFailed = false;
  private noise?: AudioBuffer;
  private enabled = false;
  private decision: SoundDecisionState = initialSoundDecision();
  private reading: SoundReading = { nowMs: 0, speedMps: 0, throttleNorm: 0, tireMarkingAsphalt: false };
  private loads: Partial<Record<RecordingKey, Promise<void>>> = {};
  private recordings: Partial<Record<RecordingKey, Recording>> = {};
  private voices: Partial<Record<RecordingKey, Voice>> = {};
  // Decodes the two recordings that came inside the script, each on its own; never rejects and never asks the network.
  // A recording that fails stays absent until the page is reloaded: there is no retry and no deadline.
  async loadRecordings(recordings: { engineLoopDataUrl: string; tireScreechDataUrl: string }): Promise<void> {
    this.loads.engine ??= this.loadRecording('engine', recordings?.engineLoopDataUrl);
    this.loads.tire ??= this.loadRecording('tire', recordings?.tireScreechDataUrl);
    await Promise.all([this.loads.engine, this.loads.tire]);
  }
  private async loadRecording(key: RecordingKey, dataUrl: string): Promise<void> {
    try {
      if (typeof OfflineAudioContext !== 'function' || typeof atob !== 'function') { console.warn('sound-recording', RECORDING_ROLE[key], 'unsupported'); return; }
      const bytes = decodeRecordingDataUrl(dataUrl);
      if (!bytes) { console.warn('sound-recording', RECORDING_ROLE[key], 'decode'); return; }
      const buffer = await new OfflineAudioContext(1, 1, 44100).decodeAudioData(bytes.buffer);
      this.recordings[key] = { buffer, ...findLoopBounds(buffer.getChannelData(0), buffer.sampleRate) };
      // The player may have turned the sound on before the decoding ended: the graph of this recording is built now.
      this.buildVoice(key);
      this.apply();
    } catch { console.warn('sound-recording', RECORDING_ROLE[key], 'decode'); }
  }
  private buildVoice(key: RecordingKey) {
    const context = this.context, recording = this.recordings[key];
    if (!context || !recording || this.voices[key]) return;
    const source = context.createBufferSource(), gain = context.createGain();
    source.buffer = recording.buffer;
    source.loop = true;
    source.loopStart = recording.loopStartS;
    source.loopEnd = recording.loopEndS;
    gain.gain.value = 0;
    source.connect(gain).connect(context.destination);
    source.start();
    this.voices[key] = { source, gain, gainTarget: 0, pitchRatio: 1, rampEndS: 0 };
  }
  // Turns the sound on or off (API-0002): the request carries the final state, a non-boolean is ignored, nothing throws.
  // The first request to turn it on is the player's gesture and creates the audio context.
  setSoundOn(soundOn: boolean): SoundOutput {
    if (typeof soundOn !== 'boolean') return this.decision.output;
    if (soundOn) {
      if (!this.context && !this.contextFailed) {
        try {
          this.context = new AudioContext();
        } catch {
          this.contextFailed = true;
          console.warn('sound-output', 'audio-unavailable');
        }
        this.buildVoice('engine');
        this.buildVoice('tire');
      }
      // Not awaited; a rejection is absorbed and the control shows the chosen state.
      try { this.context?.resume().catch(() => {}); } catch { /* same */ }
    }
    this.enabled = soundOn;
    return this.apply();
  }
  // Pure reading of the last decided output; `soundOn` here is the state the player chose, which the control shows.
  getSoundOutput(): SoundOutput {
    return this.decision.output;
  }
  // "Sound on" of the F-Spec: enabled by the player and the audio context running.
  soundOn(): boolean {
    return this.enabled && this.context?.state === 'running';
  }
  // Decides the output for the reading of the frame and applies it to the nodes.
  refresh(reading: SoundReading): SoundOutput {
    this.reading = { ...reading };
    return this.apply();
  }
  private apply(): SoundOutput {
    const audioAvailable = typeof AudioContext === 'function' && !this.contextFailed;
    this.decision = decideSoundOutput(this.decision, {
      ...this.reading, soundOn: this.enabled,
      engineSoundAvailable: audioAvailable && this.recordings.engine !== undefined,
      tireSoundAvailable: audioAvailable && this.recordings.tire !== undefined,
    });
    const output = this.decision.output;
    if (this.context) {
      const time = this.context.currentTime, engine = this.voices.engine;
      if (engine && engine.pitchRatio !== output.enginePitchRatio) {
        engine.source.playbackRate.setTargetAtTime(output.enginePitchRatio, time, ENGINE_PITCH_TIME_CONSTANT_S);
        engine.pitchRatio = output.enginePitchRatio;
      }
      this.applyGain(engine, output.engineGainNorm, time);
      this.applyGain(this.voices.tire, output.tireGainNorm, time);
    }
    return output;
  }
  // Schedules only when the target changes: linear ramps of fixed length, which reach exactly 0; with the sound off the
  // gain is cut at once, a fade-out still running included.
  private applyGain(voice: Voice | undefined, target: number, time: number) {
    if (!voice) return;
    const param = voice.gain.gain;
    if (target === 0 && !this.enabled) {
      if (voice.gainTarget === 0 && time >= voice.rampEndS) return;
      param.cancelScheduledValues(time);
      param.setValueAtTime(0, time);
      voice.rampEndS = time;
    } else {
      if (voice.gainTarget === target) return;
      voice.rampEndS = time + (target > 0 ? SOUND_FADE_IN_MS : SOUND_FADE_OUT_MS) / 1000;
      param.cancelScheduledValues(time);
      param.setValueAtTime(param.value, time);
      param.linearRampToValueAtTime(target, voice.rampEndS);
    }
    voice.gainTarget = target;
  }
  reward(tier: number) {
    if (!this.context || !this.enabled) return;
    const context = this.context;
    const decayS = (REWARD_SOUND.durationMs ?? 180) / 1000;
    for (let i = 0; i < tier + 1; i++) {
      const tone = context.createOscillator(), gain = context.createGain();
      tone.type = REWARD_SOUND.source as OscillatorType;
      const start = context.currentTime + i * 0.07;
      tone.frequency.value = 440 * Math.pow(2, (i * 4 + 7) / 12);
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(REWARD_SOUND.peakGain, start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, start + decayS);
      tone.connect(gain).connect(context.destination);
      tone.start(start); tone.stop(start + decayS + 0.02);
      tone.onended = () => { tone.disconnect(); gain.disconnect(); };
    }
  }
  // One repeat of the curb sound, built from CURB_SOUND only; no node is created without a context or with sound off.
  curb() {
    if (!this.context || !this.enabled) return;
    const context = this.context;
    const durationS = (CURB_SOUND.durationMs ?? 60) / 1000;
    if (!this.noise) {
      const samples = Math.max(1, Math.round(context.sampleRate * durationS));
      this.noise = context.createBuffer(1, samples, context.sampleRate);
      this.noise.copyToChannel(whiteNoise(samples), 0);
    }
    const source = context.createBufferSource(), filter = context.createBiquadFilter(), gain = context.createGain();
    source.buffer = this.noise;
    filter.type = 'lowpass';
    filter.frequency.value = CURB_SOUND.lowpassHz ?? 160;
    const start = context.currentTime;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(CURB_SOUND.peakGain, start + CURB_ATTACK_S);
    gain.gain.exponentialRampToValueAtTime(0.001, start + durationS);
    source.connect(filter).connect(gain).connect(context.destination);
    source.start(start); source.stop(start + durationS);
    source.onended = () => { source.disconnect(); filter.disconnect(); gain.disconnect(); };
  }
}
