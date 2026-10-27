// Application layer, pure (DES-0002): the kart state read for display (API-0001), the rolling speed with sign,
// the accumulated wheel spin by simStepCount and the simulation wheel positions in the world.
// Reads src/physics.ts only; no DOM, no three, no clock. The simulation never imports this module.
import { bodyVelocity, STEP, wheelPositions, type KartConfig, type State } from './physics';
import type { WheelName } from './kart01Model';

// API-0001, field by field.
export type KartPose = {
  simStepCount: number;
  xM: number;
  zM: number;
  headingRad: number;
  steerAngleRad: number;
  rollingSpeedMps: number;
};

// The kart speed with a negative sign when the body moves backwards along its heading; 0 at rest.
export function rollingSpeedMps(state: State): number {
  const { u } = bodyVelocity(state);
  return u >= 0 ? state.speed : -state.speed;
}

export function getKartPose(state: State | undefined): KartPose | { code: 'NO_STATE' } {
  if (!state) return { code: 'NO_STATE' };
  return {
    simStepCount: state.stepCount,
    xM: state.x,
    zM: state.z,
    headingRad: state.heading,
    // The steering angle the simulation keeps saturated at its limit; positive to the left (simulation convention).
    steerAngleRad: state.steering,
    rollingSpeedMps: rollingSpeedMps(state),
  };
}

export const WHEEL_NAMES: readonly WheelName[] = ['rodaDianteiraEsq', 'rodaDianteiraDir', 'rodaTraseiraEsq', 'rodaTraseiraDir'];

export const WHEEL_DIAMETERS_M: Readonly<Record<WheelName, number>> = Object.freeze({
  rodaDianteiraEsq: 0.26, rodaDianteiraDir: 0.26, rodaTraseiraEsq: 0.28, rodaTraseiraDir: 0.28,
});

export type WheelSpinState = { simStepCount: number; revs: Record<WheelName, number> };

export function initialWheelSpin(): WheelSpinState {
  return { simStepCount: 0, revs: { rodaDianteiraEsq: 0, rodaDianteiraDir: 0, rodaTraseiraEsq: 0, rodaTraseiraDir: 0 } };
}

// Spin advances only when simStepCount advanced, by the rolling speed of the last step over the simulated time
// between the two frames (RULE-0003). A counter that went backwards (new lap, reposition) resets the sequence
// without spinning: a step of a previous counter is never applied again.
export function advanceWheelSpin(spin: WheelSpinState, pose: KartPose): WheelSpinState {
  const delta = pose.simStepCount - spin.simStepCount;
  if (delta === 0) return spin;
  if (delta < 0) return { simStepCount: pose.simStepCount, revs: spin.revs };
  const distanceM = pose.rollingSpeedMps * (delta * STEP);
  const revs = { ...spin.revs };
  for (const name of WHEEL_NAMES) revs[name] += distanceM / (Math.PI * WHEEL_DIAMETERS_M[name]);
  return { simStepCount: pose.simStepCount, revs };
}

// How far ahead of the simulation position the middle of the model wheelbase sits, along the heading: the
// simulation position is at the fraction frontWeight of its wheelbase from the rear axle (wheelPositions), and
// the model reference point is the same fraction of the model wheelbase from its rear axle (RULE-0003).
export function modelOffsetForwardM(frontWeight: number, modelWheelbaseM: number): number {
  return modelWheelbaseM * (0.5 - frontWeight);
}

// The four wheelPositions(config) carried by the pose, in wheelPositions order; the source of the tyre marks
// and of TELEMETRY_WHEEL_POSITIONS. Never the model's wheel centres.
export function simWheelGroundPositions(pose: KartPose, config: KartConfig): readonly { xM: number; zM: number }[] {
  const s = Math.sin(pose.headingRad), c = Math.cos(pose.headingRad);
  return wheelPositions(config).map(p => ({
    xM: pose.xM + p.forward * s + p.left * c,
    zM: pose.zM + p.forward * c - p.left * s,
  }));
}
