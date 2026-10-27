// Application layer, pure (DES-0003, ADR-0002): the game camera as a function of the lap state, the kart pose,
// the shape of the play area and the turbo state. computeCameraView realizes the getCameraView operation of
// API-0003. No DOM, no three, no clock; src/main.ts applies the result to the Three.js camera every frame.
import { COUNTDOWN_MS } from './lapTiming';
import type { LapStateView } from './lap';
import type { KartPose } from './kartPose';

export type CameraMode = 'TRACK_OVERVIEW' | 'COUNTDOWN_DESCENT' | 'RACE_CHASE';
export type ViewShape = 'LANDSCAPE' | 'PORTRAIT';

// API-0003, field by field. baseVerticalFovDeg and turboFovDeltaDeg exist only in RACE_CHASE.
export type CameraView = {
  cameraMode: CameraMode;
  simStepCount?: number;
  viewShape: ViewShape;
  viewWidthPx: number;
  viewHeightPx: number;
  cameraXM: number;
  cameraZM: number;
  cameraHeightM: number;
  aimXM: number;
  aimZM: number;
  aimHeightM: number;
  verticalFovDeg: number;
  horizontalFovDeg: number;
  baseVerticalFovDeg?: number;
  turboFovDeltaDeg?: number;
};

export type CameraPose = { cameraXM: number; cameraZM: number; cameraHeightM: number; aimXM: number; aimZM: number; aimHeightM: number };

// A rectangle, in the track frame, that contains the whole track.
export type TrackBounds = { minXM: number; maxXM: number; minZM: number; maxZM: number };

export type CameraFrameInputs = {
  lapState: LapStateView | { code: 'NO_ACTIVE_LAP' };
  kartPose: KartPose | { code: 'NO_STATE' };
  viewWidthPx: number;
  viewHeightPx: number;
  turboActive: boolean;
  trackBounds: TrackBounds | undefined;
};

export const RACE_CHASE_HEIGHT_M = 1.38;
export const RACE_CHASE_BACK_M = 3.05;
export const RACE_CHASE_AIM_AHEAD_M = 3.2;
export const RACE_CHASE_AIM_HEIGHT_M = 0.30;
export const TURBO_FOV_DELTA_DEG = 4;
export const OVERVIEW_TILT_DEG = 10;
export const OVERVIEW_MARGIN = 0.05;
export const OVERVIEW_MIN_HEIGHT_M = 20;
const OVERVIEW_MAX_HEIGHT_M = 5000;
// Equal to MAX_FRAME_S × 1000 of src/frameClock.ts: the first drawn frame of the countdown is always the overview pose.
export const DESCENT_HOLD_MS = 100;
const LANDSCAPE_VERTICAL_FOV_DEG = 62;
const PORTRAIT_MIN_HORIZONTAL_FOV_DEG = 60;

const DEG = Math.PI / 180;
const toDeg = (rad: number) => rad / DEG;

// Any list of points (the synthetic track, or a loaded one), widened by the half width on every side.
export function trackBoundsOf(points: readonly { x: number; z: number }[], halfWidthM: number): TrackBounds {
  let minXM = Infinity, maxXM = -Infinity, minZM = Infinity, maxZM = -Infinity;
  for (const p of points) {
    minXM = Math.min(minXM, p.x); maxXM = Math.max(maxXM, p.x);
    minZM = Math.min(minZM, p.z); maxZM = Math.max(maxZM, p.z);
  }
  return { minXM: minXM - halfWidthM, maxXM: maxXM + halfWidthM, minZM: minZM - halfWidthM, maxZM: maxZM + halfWidthM };
}

// RULE-0002, modes: the overview exists only without an active lap; ENDED stays in RACE_CHASE behind the frozen kart.
export function decideCameraMode(lapState: LapStateView | { code: 'NO_ACTIVE_LAP' }): CameraMode {
  if ('code' in lapState) return 'TRACK_OVERVIEW';
  if (lapState.lapPhase === 'COUNTDOWN' || (lapState.lapPhase === 'PAUSED' && lapState.resumePhase === 'COUNTDOWN')) return 'COUNTDOWN_DESCENT';
  return 'RACE_CHASE';
}

export function viewShapeOf(viewWidthPx: number, viewHeightPx: number): ViewShape {
  return viewWidthPx >= viewHeightPx ? 'LANDSCAPE' : 'PORTRAIT';
}

// Landscape: 62°. Portrait: the smallest vertical field that gives 60° horizontally, never below 62° (DOMAIN/DEC-03).
export function baseVerticalFovDeg(shape: ViewShape, aspect: number): number {
  if (shape === 'LANDSCAPE') return LANDSCAPE_VERTICAL_FOV_DEG;
  const forHorizontal = toDeg(2 * Math.atan(Math.tan(PORTRAIT_MIN_HORIZONTAL_FOV_DEG / 2 * DEG) / aspect));
  return Math.max(LANDSCAPE_VERTICAL_FOV_DEG, forHorizontal);
}

export function horizontalFovDeg(verticalFovDeg: number, aspect: number): number {
  return toDeg(2 * Math.atan(Math.tan(verticalFovDeg / 2 * DEG) * aspect));
}

// The race camera of the kart sheet, tied to the heading: the simulation heading points to (sin h, cos h).
export function raceChasePose(pose: KartPose): CameraPose {
  const s = Math.sin(pose.headingRad), c = Math.cos(pose.headingRad);
  return {
    cameraXM: pose.xM - RACE_CHASE_BACK_M * s, cameraZM: pose.zM - RACE_CHASE_BACK_M * c, cameraHeightM: RACE_CHASE_HEIGHT_M,
    aimXM: pose.xM + RACE_CHASE_AIM_AHEAD_M * s, aimZM: pose.zM + RACE_CHASE_AIM_AHEAD_M * c, aimHeightM: RACE_CHASE_AIM_HEIGHT_M,
  };
}

type Vec3 = readonly [number, number, number];
const sub = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: Vec3, b: Vec3): Vec3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const normalize = (a: Vec3): Vec3 => { const l = Math.hypot(a[0], a[1], a[2]); return [a[0] / l, a[1] / l, a[2] / l]; };

// True when every corner of the bounds projects inside the frame with the margin, for a camera at `eye` aiming
// at `target` with up +Y (the same basis as Three.js lookAt) and the given vertical field and aspect.
function cornersFit(bounds: TrackBounds, eye: Vec3, target: Vec3, verticalFovDeg: number, aspect: number): boolean {
  const forward = normalize(sub(target, eye));
  const right = normalize(cross(forward, [0, 1, 0]));
  const up = cross(right, forward);
  const tanV = Math.tan(verticalFovDeg / 2 * DEG), tanH = tanV * aspect;
  const limit = 1 - 2 * OVERVIEW_MARGIN;
  for (const x of [bounds.minXM, bounds.maxXM]) {
    for (const z of [bounds.minZM, bounds.maxZM]) {
      const d = sub([x, 0, z], eye);
      const depth = dot(d, forward);
      if (depth <= 0) return false;
      if (Math.abs(dot(d, right) / (depth * tanH)) > limit) return false;
      if (Math.abs(dot(d, up) / (depth * tanV)) > limit) return false;
    }
  }
  return true;
}

function overviewEye(bounds: TrackBounds, heightM: number): { eye: Vec3; target: Vec3 } {
  const cx = (bounds.minXM + bounds.maxXM) / 2, cz = (bounds.minZM + bounds.maxZM) / 2;
  return { eye: [cx, heightM, cz + heightM * Math.tan(OVERVIEW_TILT_DEG * DEG)], target: [cx, 0, cz] };
}

// The smallest integer height from 20 m at which the four corners fit with 5 % margin; 5 000 m when none does.
export function fitOverviewHeightM(bounds: TrackBounds, verticalFovDeg: number, aspect: number): number {
  for (let h = OVERVIEW_MIN_HEIGHT_M; h < OVERVIEW_MAX_HEIGHT_M; h++) {
    const { eye, target } = overviewEye(bounds, h);
    if (cornersFit(bounds, eye, target, verticalFovDeg, aspect)) return h;
  }
  return OVERVIEW_MAX_HEIGHT_M;
}

export function trackOverviewPose(bounds: TrackBounds, shape: ViewShape, aspect: number): CameraPose {
  const h = fitOverviewHeightM(bounds, baseVerticalFovDeg(shape, aspect), aspect);
  const { eye, target } = overviewEye(bounds, h);
  return { cameraXM: eye[0], cameraZM: eye[2], cameraHeightM: eye[1], aimXM: target[0], aimZM: target[2], aimHeightM: target[1] };
}

// Smoothstep from the overview to the chase pose, a function of countdownRemainingMs only, held for the first
// DESCENT_HOLD_MS: monotone, so the camera height never rises during the countdown.
export function countdownDescentPose(overview: CameraPose, chase: CameraPose, countdownRemainingMs: number): CameraPose {
  const s = Math.min(1, Math.max(0, (COUNTDOWN_MS - countdownRemainingMs - DESCENT_HOLD_MS) / (COUNTDOWN_MS - DESCENT_HOLD_MS)));
  const e = s * s * (3 - 2 * s);
  const mix = (a: number, b: number) => a + (b - a) * e;
  return {
    cameraXM: mix(overview.cameraXM, chase.cameraXM), cameraZM: mix(overview.cameraZM, chase.cameraZM), cameraHeightM: mix(overview.cameraHeightM, chase.cameraHeightM),
    aimXM: mix(overview.aimXM, chase.aimXM), aimZM: mix(overview.aimZM, chase.aimZM), aimHeightM: mix(overview.aimHeightM, chase.aimHeightM),
  };
}

// Realizes getCameraView of API-0003 over the inputs of the frame that src/main.ts reads.
export function computeCameraView(inputs: CameraFrameInputs): CameraView | { code: 'NO_SCENE' } {
  if (!inputs.trackBounds) return { code: 'NO_SCENE' };
  const { viewWidthPx, viewHeightPx } = inputs;
  const shape = viewShapeOf(viewWidthPx, viewHeightPx);
  const aspect = viewWidthPx / viewHeightPx;
  const base = baseVerticalFovDeg(shape, aspect);
  // Without a simulation state there is no lap (every LapSession has a kart): overview, no step count.
  const hasState = !('code' in inputs.kartPose);
  const mode = hasState ? decideCameraMode(inputs.lapState) : 'TRACK_OVERVIEW';
  const common = { viewShape: shape, viewWidthPx, viewHeightPx, ...(hasState ? { simStepCount: (inputs.kartPose as KartPose).simStepCount } : {}) };
  if (mode === 'TRACK_OVERVIEW') {
    const pose = trackOverviewPose(inputs.trackBounds, shape, aspect);
    return { cameraMode: mode, ...common, ...pose, verticalFovDeg: base, horizontalFovDeg: horizontalFovDeg(base, aspect) };
  }
  const kartPose = inputs.kartPose as KartPose;
  if (mode === 'COUNTDOWN_DESCENT') {
    const remaining = 'code' in inputs.lapState ? COUNTDOWN_MS : inputs.lapState.countdownRemainingMs;
    const pose = countdownDescentPose(trackOverviewPose(inputs.trackBounds, shape, aspect), raceChasePose(kartPose), remaining);
    return { cameraMode: mode, ...common, ...pose, verticalFovDeg: base, horizontalFovDeg: horizontalFovDeg(base, aspect) };
  }
  const turboFovDeltaDeg = inputs.turboActive ? TURBO_FOV_DELTA_DEG : 0;
  const verticalFovDeg = base + turboFovDeltaDeg;
  return {
    cameraMode: mode, ...common, ...raceChasePose(kartPose),
    verticalFovDeg, horizontalFovDeg: horizontalFovDeg(verticalFovDeg, aspect), baseVerticalFovDeg: base, turboFovDeltaDeg,
  };
}
