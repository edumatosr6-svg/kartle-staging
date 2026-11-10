// Substitute AudioContext and OfflineAudioContext for the apresentacao-e-som suites (test strategy, "contexto de
// substituição"): installed on globalThis as the curb suite of pista-kart-park already does with AudioContext. Every node
// created and every value scheduled on an AudioParam is recorded, so a check reads what was asked of the audio output.
// No clock: `currentTime` is a field the test sets. No network: the decoder only records the bytes it was given.
export type ParamEvent = {
  kind: 'setValueAtTime' | 'linearRampToValueAtTime' | 'exponentialRampToValueAtTime' | 'setTargetAtTime' | 'cancelScheduledValues';
  value?: number; timeS: number; timeConstantS?: number;
};
export class FakeParam {
  value: number;
  events: ParamEvent[] = [];
  constructor(value = 0) { this.value = value; }
  setValueAtTime(value: number, timeS: number) { this.events.push({ kind: 'setValueAtTime', value, timeS }); this.value = value; return this; }
  linearRampToValueAtTime(value: number, timeS: number) { this.events.push({ kind: 'linearRampToValueAtTime', value, timeS }); this.value = value; return this; }
  exponentialRampToValueAtTime(value: number, timeS: number) { this.events.push({ kind: 'exponentialRampToValueAtTime', value, timeS }); this.value = value; return this; }
  setTargetAtTime(value: number, timeS: number, timeConstantS: number) { this.events.push({ kind: 'setTargetAtTime', value, timeS, timeConstantS }); this.value = value; return this; }
  cancelScheduledValues(timeS: number) { this.events.push({ kind: 'cancelScheduledValues', timeS }); return this; }
}
export type FakeBuffer = { id: string; sampleRate: number; length: number; getChannelData(channel: number): Float32Array; copyToChannel?(data: Float32Array, channel: number): void };
export type FakeNode = {
  kind: 'oscillator' | 'gain' | 'filter' | 'buffer-source';
  type: string; frequency: FakeParam; gain: FakeParam; playbackRate: FakeParam;
  buffer?: unknown; loop: boolean; loopStart: number; loopEnd: number;
  startCount: number; stopCount: number; connectedTo: unknown[]; onended?: unknown;
  connect(target: unknown): unknown; disconnect(): void; start(): void; stop(): void;
};
export type FakeContextInstance = { currentTime: number; sampleRate: number; state: string; destination: object; resumeCount: number };
export type DecoderMode = 'ok' | 'reject' | 'never';
export type FakeAudio = {
  AudioContext: new () => FakeContextInstance;
  OfflineAudioContext: new (channels: number, length: number, sampleRate: number) => unknown;
  // Every node created by any context of this substitute, in creation order.
  created: FakeNode[];
  contexts: FakeContextInstance[];
  // Every decoding asked of the offline substitute: the bytes it received and, when it answered, the buffer it gave.
  decoded: { bytes: Uint8Array; buffer?: FakeBuffer }[];
};

// The decoded form the substitute gives: `leadSilence` samples of silence, `sound` samples at half scale, `tailSilence`
// samples of silence — the shape of a decoded MP3 with encoder padding at both ends.
export const FAKE_BUFFER_SHAPE = { sampleRateHz: 1000, leadSilence: 20, sound: 400, tailSilence: 30 };
export function fakeSamples(shape = FAKE_BUFFER_SHAPE): Float32Array {
  const samples = new Float32Array(shape.leadSilence + shape.sound + shape.tailSilence);
  for (let i = 0; i < shape.sound; i++) samples[shape.leadSilence + i] = i % 2 === 0 ? 0.5 : -0.5;
  return samples;
}

export function fakeAudio(options: { decoder?: DecoderMode | ((bytes: Uint8Array) => DecoderMode); contextThrows?: boolean; contextState?: string } = {}): FakeAudio {
  const created: FakeNode[] = [];
  const contexts: FakeContextInstance[] = [];
  const decoded: FakeAudio['decoded'] = [];
  const node = (kind: FakeNode['kind']): FakeNode => {
    const n: FakeNode = {
      kind, type: '', frequency: new FakeParam(), gain: new FakeParam(1), playbackRate: new FakeParam(1),
      loop: false, loopStart: 0, loopEnd: 0, startCount: 0, stopCount: 0, connectedTo: [],
      connect(target) { n.connectedTo.push(target); return target; }, disconnect() {},
      start() { n.startCount++; }, stop() { n.stopCount++; },
    };
    created.push(n);
    return n;
  };
  class Context implements FakeContextInstance {
    currentTime = 0; sampleRate = 48000; state = options.contextState ?? 'running'; destination = {}; resumeCount = 0;
    constructor() { if (options.contextThrows) throw new Error('substitute: no audio output'); contexts.push(this); }
    async resume() { this.resumeCount++; }
    createOscillator() { return node('oscillator'); }
    createGain() { return node('gain'); }
    createBiquadFilter() { return node('filter'); }
    createBufferSource() { return node('buffer-source'); }
    createBuffer(_channels: number, samples: number, sampleRate: number): FakeBuffer {
      const data = new Float32Array(samples);
      return { id: 'created', sampleRate, length: samples, getChannelData: () => data, copyToChannel(source: Float32Array) { data.set(source); } };
    }
  }
  class Offline {
    decodeAudioData(data: ArrayBuffer): Promise<FakeBuffer> {
      const bytes = new Uint8Array(data.slice(0));
      const entry: FakeAudio['decoded'][number] = { bytes };
      decoded.push(entry);
      const mode = typeof options.decoder === 'function' ? options.decoder(bytes) : options.decoder ?? 'ok';
      if (mode === 'reject') return Promise.reject(new Error('substitute: the bytes are not a recording'));
      if (mode === 'never') return new Promise<FakeBuffer>(() => {});
      const samples = fakeSamples();
      entry.buffer = { id: `decoded-${decoded.length}`, sampleRate: FAKE_BUFFER_SHAPE.sampleRateHz, length: samples.length, getChannelData: () => samples };
      return Promise.resolve(entry.buffer);
    }
  }
  return { AudioContext: Context, OfflineAudioContext: Offline, created, contexts, decoded };
}

type AudioGlobals = { AudioContext?: unknown; OfflineAudioContext?: unknown };
// Runs `body` with the given constructors on globalThis (an absent key removes the global) and with console.warn
// collected instead of printed; everything is put back afterwards, whatever happened.
export async function withAudioGlobals<T>(globals: AudioGlobals, body: (warnings: unknown[][]) => T | Promise<T>): Promise<T> {
  const g = globalThis as unknown as AudioGlobals;
  const previous = { AudioContext: g.AudioContext, OfflineAudioContext: g.OfflineAudioContext };
  const previousWarn = console.warn;
  const warnings: unknown[][] = [];
  const put = (key: keyof AudioGlobals, value: unknown) => { if (value === undefined) delete g[key]; else g[key] = value; };
  put('AudioContext', globals.AudioContext);
  put('OfflineAudioContext', globals.OfflineAudioContext);
  console.warn = (...args: unknown[]) => { warnings.push(args); };
  try { return await body(warnings); } finally {
    put('AudioContext', previous.AudioContext);
    put('OfflineAudioContext', previous.OfflineAudioContext);
    console.warn = previousWarn;
  }
}

// Lets every promise already settled run its continuations (the decoding of the substitute resolves at once).
export async function settle(): Promise<void> { for (let i = 0; i < 20; i++) await Promise.resolve(); }

// The text the bundler puts in the script for an inlined recording: `data:<type>;base64,<payload>`.
export const dataUrlOf = (bytes: Uint8Array, mimeType = 'audio/mpeg'): string => `data:${mimeType};base64,${Buffer.from(bytes).toString('base64')}`;

export const sourcesOf = (audio: FakeAudio): FakeNode[] => audio.created.filter(n => n.kind === 'buffer-source');
// The gain node a source was connected to.
export const gainOf = (source: FakeNode): FakeNode => source.connectedTo[0] as FakeNode;
export const lastEvent = (param: FakeParam, kind?: ParamEvent['kind']): ParamEvent | undefined =>
  [...param.events].reverse().find(e => kind === undefined || e.kind === kind);
