// Deterministic pilot of the Kart Park (test strategy of pista-kart-park, "Fixtures", `kartParkPilot`): chases a point
// ahead on the centerline of the lap's own geometry by lap distance, proportional steer saturated in [-1, 1], binary
// throttle and brake by a target speed from the local curvature. An optional lateral offset by lap distance and an
// optional shortcut to a target point outside the track give the excursion, the curb and the cut fixtures. Pure function
// of the lap state and of its own step counter: the same lap replays to the same inputs (D-TS-04, D-TS-05).
import { ARCADE_ASSISTIDO_V5, STEP, step, type Environment, type Input, type KartConfig, type State } from '../../src/physics';
import { kartAtStart, listLapResults, startLap, stepLap, type LapResult, type LapSession } from '../../src/lap';
import { COUNTDOWN_STEPS } from '../../src/lapTiming';
import type { TrackReading } from '../../src/trackData';
import { lapMAtIndex, nearestOnCenterline, positionAtLapM, type TrackGeometry } from '../../src/trackGeometry';
import type { Point } from '../../src/track';
import { kartParkEnvironment, kartParkGeometry, kartParkReading } from '../fixtures/kartParkFiles';

export const IDLE: Input = { throttle: 0, brake: 0, steer: 0 };
export const PILOT_DECISION_STEPS = 6;
export const MAX_LAP_STEPS = 9000;
// The configuration the pilot was calibrated on, pinned to the literal Arcade assistido v5 and the 75 kg driver (FB-02 of
// dirigibilidade): the published setup moved to v6, the lap fixtures keep the round they were measured with, which does not
// change. The curb rule over the published setup is checked in the surface suite on PUBLISHED_SETUPS, whatever its version.
export const KART_PARK_CONFIG: KartConfig = { ...ARCADE_ASSISTIDO_V5, driverMass: 75 };

export type Controller = (lap: LapSession) => Input;
export type OffsetFn = (lapM: number) => number;
export type Shortcut = { fromLapM: number; toLapM: number };
export type PilotOptions = {
  // Lateral offset from the centerline in metres, positive to the left of travel, by lap distance.
  offsetM?: number | OffsetFn;
  // Between fromLapM and toLapM the pilot aims straight at the centerline point of toLapM (a cut across the grass).
  shortcut?: Shortcut;
  maxSpeedMps?: number;
  lateralBudgetMps2?: number;
  steerGain?: number;
};

const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

export function lapDistanceOf(g: TrackGeometry, p: Point): number {
  const near = nearestOnCenterline(g, p);
  return lapMAtIndex(g, near.index, near.fraction);
}

// Curvature of the centerline around lapM from three points 6 m apart (Menger curvature).
export function curvatureAt(g: TrackGeometry, lapM: number): number {
  const L = g.lapLengthM;
  const at = (m: number) => positionAtLapM(g, ((m % L) + L) % L).center;
  const a = at(lapM), b = at(lapM + 6), c = at(lapM + 12);
  const ab = Math.hypot(b.x - a.x, b.z - a.z), bc = Math.hypot(c.x - b.x, c.z - b.z), ca = Math.hypot(c.x - a.x, c.z - a.z);
  if (ab * bc * ca === 0) return 0;
  return 2 * Math.abs((b.x - a.x) * (c.z - b.z) - (b.z - a.z) * (c.x - b.x)) / (ab * bc * ca);
}

export function kartParkPilot(g: TrackGeometry = kartParkGeometry(), options: PilotOptions = {}): Controller {
  const offset: OffsetFn = typeof options.offsetM === 'function' ? options.offsetM : () => (options.offsetM as number | undefined) ?? 0;
  const maxSpeed = options.maxSpeedMps ?? 26;
  const budget = options.lateralBudgetMps2 ?? 9.5;
  const gain = options.steerGain ?? 2.5;
  const L = g.lapLengthM;
  let input: Input = { throttle: 1, brake: 0, steer: 0 };
  let tick = 0;
  let cutting = false;
  return (lap) => {
    const state = lap.kart;
    if (tick % PILOT_DECISION_STEPS === 0) {
      const lapM = lapDistanceOf(g, state);
      let target: Point;
      let targetSpeed: number;
      const s = options.shortcut;
      if (s && !cutting && lapM >= s.fromLapM && lapM < s.toLapM - 5) cutting = true;
      if (cutting && lapM >= s!.toLapM - 3 && lapM < s!.toLapM + 40) cutting = false;
      if (cutting) {
        target = positionAtLapM(g, s!.toLapM % L).center;
        targetSpeed = Math.min(maxSpeed, 9);
      } else {
        const ahead = Math.max(5, state.speed * 0.55);
        const aheadM = (lapM + ahead) % L;
        const at = positionAtLapM(g, aheadM);
        const o = offset(aheadM);
        target = { x: at.center.x + at.normal.x * o, z: at.center.z + at.normal.z * o };
        let curvature = 0;
        for (const base of [2, 8, 14, 20]) curvature = Math.max(curvature, curvatureAt(g, lapM + base));
        targetSpeed = Math.min(maxSpeed, Math.sqrt(budget / Math.max(curvature, 0.001)));
      }
      const desired = Math.atan2(target.x - state.x, target.z - state.z);
      const error = wrap(desired - state.heading);
      input = {
        throttle: state.speed < targetSpeed ? 1 : 0,
        brake: state.speed > targetSpeed + 1.5 ? 1 : 0,
        steer: clamp(-error * gain, -1, 1),
      };
    }
    tick++;
    return input;
  };
}

export function constant(input: Input): Controller { return () => input; }

// A TRAINING lap on the Kart Park through src/lap.ts directly (the session helper of trainingSession is tested apart).
export function startKartParkLap(reading: TrackReading = kartParkReading(), config: KartConfig = KART_PARK_CONFIG, environment: Environment = kartParkEnvironment()): LapSession {
  if (reading.trackDataStatus !== 'COMPLETE' && reading.trackDataStatus !== 'INCOMPLETE') throw new Error(`fixture reading is ${reading.trackDataStatus}`);
  const r = startLap(undefined, { lapKind: 'TRAINING', trackId: reading.trackId, trackVersion: reading.trackVersion }, reading, config, environment);
  if (!r.ok) throw new Error(`startLap rejected the Kart Park: ${r.code}`);
  return r.lap;
}

export function runCountdown(lap: LapSession, input: Input = IDLE): LapSession {
  for (let i = 0; i < COUNTDOWN_STEPS; i++) lap = stepLap(lap, input);
  return lap;
}

export type StepHook = (before: LapSession, after: LapSession, input: Input) => void;

// The results of the training read through the contract (listLapResults of race-lap-validation, ADR-0006 of that feature).
export function lapResults(lap: LapSession): LapResult[] { return listLapResults(lap).lapResults; }

// Advances at most `steps` steps and stops in the step where listLapResults grows (the end of a training lap, the next one
// already RUNNING) or where the phase is ENDED (only endTraining ends a TRAINING lap): test strategy, "drive".
export function drive(lap: LapSession, controller: Controller, steps: number, hook?: StepHook): { lap: LapSession; inputs: Input[] } {
  const inputs: Input[] = [];
  const closed = lapResults(lap).length;
  for (let i = 0; i < steps && lap.phase !== 'ENDED' && lapResults(lap).length === closed; i++) {
    const input = controller(lap);
    const next = stepLap(lap, input);
    inputs.push(input);
    hook?.(lap, next, input);
    lap = next;
  }
  return { lap, inputs };
}

export function replay(inputs: readonly Input[]): Controller {
  let i = 0;
  return () => inputs[i++] ?? IDLE;
}

// Countdown plus one training lap under the controller, up to the step where its result is listed.
export function completeKartParkLap(controller: Controller = kartParkPilot(), hook?: StepHook, reading: TrackReading = kartParkReading(), config: KartConfig = KART_PARK_CONFIG) {
  const started = runCountdown(startKartParkLap(reading, config));
  return drive(started, controller, MAX_LAP_STEPS, hook);
}

export function seedLap(lap: LapSession, patch: Partial<Omit<LapSession, 'kart'>> & { kart?: Partial<State> }): LapSession {
  const { kart, ...rest } = patch;
  return { ...lap, ...rest, kart: kart ? { ...lap.kart, ...kart } : lap.kart };
}

// A kart at rest at a lap distance of the Kart Park, shifted lateralM to the left of travel, facing travel (or reversed).
export function kartAtLapM(lapM: number, lateralM = 0, reverse = false, g: TrackGeometry = kartParkGeometry()): State {
  const at = positionAtLapM(g, lapM);
  const n = g.centerline.length;
  const a = g.centerline[at.index], b = g.centerline[(at.index + 1) % n];
  const heading = Math.atan2(b.xM - a.xM, b.zM - a.zM) + (reverse ? Math.PI : 0);
  return { ...kartAtStart(undefined), x: at.center.x + at.normal.x * lateralM, z: at.center.z + at.normal.z * lateralM, heading };
}

// A kart launched from a point with a heading and a speed along it (seededKart of the strategy).
export function seededKart(position: Point, headingRad: number, speedMps: number): State {
  const base = kartAtStart(undefined);
  return { ...base, x: position.x, z: position.z, heading: headingRad, vx: Math.sin(headingRad) * speedMps, vz: Math.cos(headingRad) * speedMps, speed: speedMps };
}

export function advance(state: State, input: Input, steps: number, config: KartConfig, environment: Environment, hook?: (s: State) => void): State {
  for (let i = 0; i < steps; i++) { state = step(state, input, STEP, config, environment); hook?.(state); }
  return state;
}
