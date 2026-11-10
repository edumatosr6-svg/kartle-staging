// Application layer, pure: the decision of the sound state, the engine sound and the tyre sound (DES-0002 of
// apresentacao-e-som; RULE-0001, RULE-0002, API-0002). No DOM, no Web Audio, no clock (the instant is an argument), no random.
import type { LapPhase } from './lap';

export type EngineSoundState = 'ENGINE_SILENT' | 'ENGINE_PLAYING';
export type TireSoundState = 'TIRE_SILENT' | 'TIRE_PLAYING';
export type SoundOutput = {
  soundOn: boolean; engineSoundAvailable: boolean; tireSoundAvailable: boolean;
  engineSoundState: EngineSoundState; enginePitchRatio: number; engineGainNorm: number;
  tireSoundState: TireSoundState; tireGainNorm: number;
};
export type SoundReading = {
  nowMs: number; lapPhase?: LapPhase; repositionAcceptedAtMs?: number;
  simStepCount?: number; speedMps: number; throttleNorm: number; tireMarkingAsphalt: boolean;
};
export type SoundDecisionInput = SoundReading & { soundOn: boolean; engineSoundAvailable: boolean; tireSoundAvailable: boolean };
export type SoundDecisionState = {
  output: SoundOutput;
  stepReading?: { simStepCount: number; speedMps: number; throttleNorm: number; tireMarkingAsphalt: boolean };
};

export const ENGINE_PITCH_IDLE_RATIO = 0.8;
export const ENGINE_PITCH_TOP_RATIO = 2.0;
// Above every published governorSpeed of src/physics.ts.
export const ENGINE_PITCH_TOP_SPEED_MPS = 32;
export const ENGINE_GAIN_IDLE_NORM = 0.35;
export const ENGINE_GAIN_FULL_NORM = 0.70;
export const TIRE_GAIN_NORM = 0.50;
export const SOUND_FADE_IN_MS = 10;
// Also the silence window after an accepted reposition: the engine comes back only after the gain reached 0.
export const SOUND_FADE_OUT_MS = 80;

export function initialSoundDecision(): SoundDecisionState {
  return {
    output: {
      soundOn: false, engineSoundAvailable: false, tireSoundAvailable: false,
      engineSoundState: 'ENGINE_SILENT', enginePitchRatio: 1, engineGainNorm: 0,
      tireSoundState: 'TIRE_SILENT', tireGainNorm: 0,
    },
  };
}

const OUTPUT_FIELDS = ['soundOn', 'engineSoundAvailable', 'tireSoundAvailable', 'engineSoundState', 'enginePitchRatio', 'engineGainNorm', 'tireSoundState', 'tireGainNorm'] as const;

// Never throws and never rejects: an out-of-range reading is limited. The same input over the same state gives the same state.
export function decideSoundOutput(state: SoundDecisionState, input: SoundDecisionInput): SoundDecisionState {
  // A step already read keeps its reading: a frame without a new step and a repeated reading change nothing.
  let stepReading = state.stepReading;
  if (input.simStepCount === undefined) stepReading = undefined;
  else if (!stepReading || stepReading.simStepCount !== input.simStepCount) {
    stepReading = {
      simStepCount: input.simStepCount,
      speedMps: Number.isFinite(input.speedMps) ? Math.max(0, input.speedMps) : 0,
      throttleNorm: Number.isFinite(input.throttleNorm) ? Math.min(1, Math.max(0, input.throttleNorm)) : 0,
      tireMarkingAsphalt: input.tireMarkingAsphalt === true,
    };
  }
  const soundOn = input.soundOn === true;
  const engineSoundAvailable = input.engineSoundAvailable === true, tireSoundAvailable = input.tireSoundAvailable === true;
  // A function of the current instant, not of an edge: evaluating again at the same instant gives the same answer.
  const repositioning = input.repositionAcceptedAtMs !== undefined && Number.isFinite(input.nowMs)
    && input.nowMs < input.repositionAcceptedAtMs + SOUND_FADE_OUT_MS;
  const enginePlaying = soundOn && engineSoundAvailable && input.lapPhase === 'RUNNING' && stepReading !== undefined && !repositioning;
  const tirePlaying = soundOn && tireSoundAvailable && stepReading !== undefined && stepReading.tireMarkingAsphalt
    && input.lapPhase !== undefined && input.lapPhase !== 'PAUSED' && input.lapPhase !== 'ENDED';
  const output: SoundOutput = {
    soundOn, engineSoundAvailable, tireSoundAvailable,
    engineSoundState: enginePlaying ? 'ENGINE_PLAYING' : 'ENGINE_SILENT',
    // The pitch follows the speed only and the gain the throttle only; a silent engine keeps the last pitch.
    enginePitchRatio: enginePlaying && stepReading
      ? ENGINE_PITCH_IDLE_RATIO + (ENGINE_PITCH_TOP_RATIO - ENGINE_PITCH_IDLE_RATIO) * Math.min(stepReading.speedMps / ENGINE_PITCH_TOP_SPEED_MPS, 1)
      : state.output.enginePitchRatio,
    engineGainNorm: enginePlaying && stepReading ? ENGINE_GAIN_IDLE_NORM + (ENGINE_GAIN_FULL_NORM - ENGINE_GAIN_IDLE_NORM) * stepReading.throttleNorm : 0,
    tireSoundState: tirePlaying ? 'TIRE_PLAYING' : 'TIRE_SILENT',
    tireGainNorm: tirePlaying ? TIRE_GAIN_NORM : 0,
  };
  if (stepReading === state.stepReading && OUTPUT_FIELDS.every(field => output[field] === state.output[field])) return state;
  return stepReading ? { output, stepReading } : { output };
}
