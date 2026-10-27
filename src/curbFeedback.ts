// Application layer, pure: the per-step decision of the curb feedback of RULE-0004 (DES-0009, DM-0002 of
// pista-kart-park). No DOM, no clock, no random: a function of simStepCount and curbWheelCount only.
import type { TrackContact } from './physics';

export const CURB_PULSE_MS = 20;
// 30 steps of STEP = 30 x 25/3 ms = 250 ms of simulated time, exactly.
export const CURB_PULSE_INTERVAL_STEPS = 30;
// 12 steps = 100 ms of simulated time (ADR-0006): one repeat per red-and-white stripe at about 10 m/s.
export const CURB_SOUND_REPEAT_STEPS = 12;

export type CurbFeedbackState = { lastHandledStep?: number; lastPulseStep?: number; lastSoundStep?: number };
export type CurbFeedbackChannel = 'web-desktop' | 'web-mobile';
export type CurbFeedbackInput = Pick<TrackContact, 'simStepCount' | 'curbWheelCount'> & {
  channel: CurbFeedbackChannel; vibrationAvailable: boolean; soundOn: boolean;
};
export type CurbFeedbackDecision = { state: CurbFeedbackState; pulse: boolean; sound: boolean };

export function initialCurbFeedback(): CurbFeedbackState {
  return {};
}

// A step already handled starts nothing and keeps the state; each new step is handled once, in increasing order.
export function decideCurbFeedback(state: CurbFeedbackState, input: CurbFeedbackInput): CurbFeedbackDecision {
  const { simStepCount, curbWheelCount } = input;
  if (state.lastHandledStep !== undefined && simStepCount <= state.lastHandledStep) return { state, pulse: false, sound: false };
  const onCurb = curbWheelCount > 0;
  const pulse = input.channel === 'web-mobile' && input.vibrationAvailable && onCurb
    && (state.lastPulseStep === undefined || simStepCount - state.lastPulseStep >= CURB_PULSE_INTERVAL_STEPS);
  const sound = input.soundOn && onCurb
    && (state.lastSoundStep === undefined || simStepCount - state.lastSoundStep >= CURB_SOUND_REPEAT_STEPS);
  const next: CurbFeedbackState = {
    lastHandledStep: simStepCount,
    ...(pulse ? { lastPulseStep: simStepCount } : state.lastPulseStep !== undefined ? { lastPulseStep: state.lastPulseStep } : {}),
    ...(sound ? { lastSoundStep: simStepCount } : state.lastSoundStep !== undefined ? { lastSoundStep: state.lastSoundStep } : {}),
  };
  return { state: next, pulse, sound };
}
