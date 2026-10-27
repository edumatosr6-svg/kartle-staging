// Optional synthesized feedback. No downloads; created only from a user gesture.
// Each sound builds its signal from its own descriptor (DES-0009 of pista-kart-park): the source type, the peak and the
// duration come from it, so two sounds with the same `source` would share a waveform; the curb is the only noise source.
export type SoundSignal = { source: 'noise' | 'triangle' | 'sine'; lowpassHz?: number; durationMs?: number; peakGain: number };
export const ENGINE_SOUND: Readonly<SoundSignal> = Object.freeze({ source: 'triangle', peakGain: 0.045 });
export const REWARD_SOUND: Readonly<SoundSignal> = Object.freeze({ source: 'sine', durationMs: 180, peakGain: 0.035 });
// Short, low noise (DOMAIN/DEC-11): white noise through a 160 Hz low-pass, 5 ms attack, exponential decay to 60 ms.
export const CURB_SOUND: Readonly<SoundSignal> = Object.freeze({ source: 'noise', lowpassHz: 160, durationMs: 60, peakGain: 0.05 });
const CURB_ATTACK_S = 0.005;
const ENGINE_GAIN_FLOOR = 0.025;

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

export class RaceAudio {
  private context?: AudioContext;
  private engine?: OscillatorNode;
  private gain?: GainNode;
  private noise?: AudioBuffer;
  enabled = false;
  async toggle() {
    if (!this.context) {
      this.context = new AudioContext();
      this.engine = this.context.createOscillator();
      this.engine.type = ENGINE_SOUND.source as OscillatorType;
      this.gain = this.context.createGain();
      this.gain.gain.value = 0;
      this.engine.connect(this.gain).connect(this.context.destination);
      this.engine.start();
    }
    await this.context.resume();
    this.enabled = !this.enabled;
    if (!this.enabled) this.gain!.gain.setTargetAtTime(0, this.context.currentTime, 0.03);
    return this.enabled;
  }
  // "Sound on" of the F-Spec: enabled by the player and the audio context running.
  soundOn(): boolean {
    return this.enabled && this.context?.state === 'running';
  }
  update(speed: number, throttle: number, active: boolean) {
    if (!this.context) return;
    const time = this.context.currentTime;
    this.engine!.frequency.setTargetAtTime(45 + speed * 6 + throttle * 12, time, 0.08);
    this.gain!.gain.setTargetAtTime(this.enabled && active ? Math.min(ENGINE_SOUND.peakGain, ENGINE_GAIN_FLOOR + throttle * (ENGINE_SOUND.peakGain - ENGINE_GAIN_FLOOR)) : 0, time, 0.04);
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
