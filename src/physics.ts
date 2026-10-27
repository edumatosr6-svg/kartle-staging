import { nearest, track, WIDTH, type Point } from './track';
import { advanceManeuvers, cancelManeuver, initialManeuvers, type Maneuvers } from './maneuvers';
export { nearest, track, WIDTH, LapTracker } from './track';
import { BARRIER_HALF_WIDTH_M, BARRIER_TOUCH_TOLERANCE_M, beyondTrackEdgeM, classifySurface, closestOnSegment, nearestBarrier, type TrackGeometry } from './trackGeometry';

export const STEP = 1 / 120;
export const GRAVITY = 9.81;
export const PHYSICS_VERSION = 'rental-4t-v4';
export type Input = { throttle: number; brake: number; steer: number; drift?: boolean };
// 'curb' exists only in an environment with a track that declares curbs (ADR-0004 of pista-kart-park).
export type Surface = 'asphalt' | 'curb' | 'grass';
// Fraction of the asphalt grip of the same tyre on a curb (RULE-0001 of pista-kart-park, DOMAIN/DEC-05).
export const CURB_GRIP_PC = 0.85;
export type Handling = 'grip' | 'understeer' | 'oversteer' | 'sliding';
export type Wheel = {
  load: number; slipAngle: number; utilization: number;
  longitudinalForce: number; lateralForce: number; capacity: number;
  steerAngle: number; surface: Surface;
};
// Per-step telemetry (DES-0001): forcing, surface, wallContact and assistActive are read by API-0001.
export type Telemetry = {
  wheels: Wheel[]; longitudinalG: number; lateralG: number;
  frontSlip: number; rearSlip: number; sideslip: number; handling: Handling;
  forcing: boolean; surface: Surface; wallContact: boolean; assistActive: boolean;
  // Barrier of a schema-3 track (DES-0003 of pista-kart-park): touching at the end of the step, and the step of entering contact.
  barrierTouching: boolean; barrierContact: boolean;
};
export type State = Point & {
  heading: number; vx: number; vz: number; yawRate: number;
  speed: number; elapsed: number; steering: number; throttle: number; brake: number;
  ax: number; ay: number; telemetry: Telemetry;
  maneuvers: Maneuvers;
  stepCount: number;
};
// The optional fields are read only inside the drivingAssists branch; absent, each one is the literal the
// code used before this feature, so RENTAL_KART and ARCADE_KART (which do not declare them) behave as before.
export type KartConfig = {
  kartMass: number; driverMass: number; wheelbase: number; trackWidth: number;
  frontWeight: number; cgHeight: number; yawRadius: number;
  enginePower: number; transmissionEfficiency: number; driveForce: number;
  governorSpeed: number; brakeForce: number; engineBrake: number;
  friction: number; grassFriction: number; loadSensitivity: number;
  frontStiffness: number; rearStiffness: number;
  maxSteer: number; steerRate: number; axleScrub: number; throttleRate: number;
  drivingAssists: boolean;
  steerApplyRatePerS?: number; steerReturnRatePerS?: number;
  assistLateralG?: number; assistSteerAllowanceRad?: number;
  yawTrackingGainPerS?: number; yawCorrectGainPerS?: number;
  slipDampingGainPerS?: number; slipDampingCapG?: number;
  forcingRearFrictionScale?: number; grassSpeedLossPerS?: number;
  forcingRampMps?: number;
};
// Only kart mass (RT10/GX270) and engine power (GX270) are sourced specs.
// Other values are calibration assumptions; see docs/physics.md.
export const RENTAL_KART: Readonly<KartConfig> = Object.freeze({
  kartMass: 153, driverMass: 75, wheelbase: 1.04, trackWidth: 1.2,
  frontWeight: 0.42, cgHeight: 0.28, yawRadius: 0.48,
  enginePower: 6300, transmissionEfficiency: 0.86, driveForce: 650,
  governorSpeed: 20, brakeForce: 2100, engineBrake: 65,
  friction: 0.95, grassFriction: 0.38, loadSensitivity: 0.12,
  frontStiffness: 11, rearStiffness: 13,
  maxSteer: 0.40, steerRate: 1.35, axleScrub: 5, throttleRate: 3,
  drivingAssists: false,
});
// Gameplay tune, intentionally above the rental engine specification.
// Same mass and tire model, with explicitly arcade stability/steering assists.
export const ARCADE_KART: Readonly<KartConfig> = Object.freeze({
  ...RENTAL_KART,
  enginePower: 10000, driveForce: 1000, governorSpeed: 23,
  throttleRate: 5, engineBrake: 40,
  friction: 1.10, rearStiffness: 14.5, brakeForce: 1900,
  steerRate: 1.8, maxSteer: 0.36, axleScrub: 3.5,
  drivingAssists: true,
});
export const KART_PRESETS = { arcade: ARCADE_KART, rental: RENTAL_KART } as const;
// Arcade assistido v5 (DES-0001, ADR-0001): a new record; ARCADE_KART stays as the previous version.
// Values chosen by the handling benches of DES-0004 against the thresholds of RULE-0002 (docs/physics.md, 2026-10-22):
// enginePower shapes the drive above 50 km/h so the full-throttle corner holds the lane while 0-60 km/h stays under 2.5 s.
export const ARCADE_ASSISTIDO_V5: Readonly<KartConfig> = Object.freeze({
  ...ARCADE_KART,
  enginePower: 26500, driveForce: 2420, governorSpeed: 31.5, throttleRate: 8,
  friction: 1.57, frontStiffness: 23, rearStiffness: 22, maxSteer: 0.36,
  steerApplyRatePerS: 14, steerReturnRatePerS: 24,
  assistLateralG: 1.48, assistSteerAllowanceRad: 0.004,
  yawTrackingGainPerS: 5.8, yawCorrectGainPerS: 33,
  slipDampingGainPerS: 18, slipDampingCapG: 0.8,
  forcingRearFrictionScale: 0.67, grassSpeedLossPerS: 0.7,
  forcingRampMps: 2.4,
});
export const SOLVER_SUBSTEPS = 4;
export type SetupId = 'ARCADE_ASSISTIDO' | 'REALISTA_ALUGUEL_4T';
export type SetupRef = { setupId: SetupId; setupVersion: string };
export type PublishedSetup = {
  setupId: SetupId; setupVersion: string; previousSetupVersion?: string;
  config: Readonly<KartConfig>; previousConfig?: Readonly<KartConfig>;
};
// Published setup data (DM-0001, section 1): one frozen record per setupId; no key to pick the previous version.
export const PUBLISHED_SETUPS: Readonly<Record<SetupId, PublishedSetup>> = Object.freeze({
  ARCADE_ASSISTIDO: Object.freeze({
    setupId: 'ARCADE_ASSISTIDO' as const, setupVersion: 'arcade-assistido-v5', previousSetupVersion: 'arcade-assistido-v4',
    config: ARCADE_ASSISTIDO_V5, previousConfig: ARCADE_KART,
  }),
  REALISTA_ALUGUEL_4T: Object.freeze({
    setupId: 'REALISTA_ALUGUEL_4T' as const, setupVersion: 'realista-aluguel-4t-v4', config: RENTAL_KART,
  }),
});
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
const approach = (v: number, target: number, change: number) => v + clamp(target - v, -change, change);
const emptyTelemetry = (): Telemetry => ({
  wheels: [], longitudinalG: 0, lateralG: 0, frontSlip: 0, rearSlip: 0, sideslip: 0, handling: 'grip',
  forcing: false, surface: 'asphalt', wallContact: false, assistActive: false,
  barrierTouching: false, barrierContact: false,
});
export function initialState(): State {
  return {
    ...track[0], heading: Math.atan2(track[1].x - track[0].x, track[1].z - track[0].z),
    vx: 0, vz: 0, yawRate: 0, speed: 0, elapsed: 0,
    steering: 0, throttle: 0, brake: 0, ax: 0, ay: 0, telemetry: emptyTelemetry(), maneuvers: initialManeuvers(),
    stepCount: 0,
  };
}
// The forcing condition of RULE-0001 (DOMAIN/DEC-02): full throttle, full steer and more than 50 km/h at the
// start of the step. The literal lives here only; partial steer never satisfies it.
const FORCING_SPEED_MPS = 50 / 3.6;
export function isForcing(state: State, input: Input): boolean {
  return clamp(input.throttle, 0, 1) >= 1 && Math.abs(clamp(input.steer, -1, 1)) >= 1 && state.speed > FORCING_SPEED_MPS;
}
// Body: forward u, left v, positive yaw turns left.
// World forward = (sin(h), cos(h)); world left = (cos(h), -sin(h)).
export function bodyVelocity(state: State) {
  const s = Math.sin(state.heading), c = Math.cos(state.heading);
  return { u: state.vx * s + state.vz * c, v: state.vx * c - state.vz * s };
}
export function wheelPositions(config: KartConfig) {
  const a = config.wheelbase * (1 - config.frontWeight), b = config.wheelbase * config.frontWeight;
  return [
    { forward: a, left: config.trackWidth / 2 }, { forward: a, left: -config.trackWidth / 2 },
    { forward: -b, left: config.trackWidth / 2 }, { forward: -b, left: -config.trackWidth / 2 },
  ];
}
export function wheelLoads(config: KartConfig, ax: number, ay: number) {
  const mass = config.kartMass + config.driverMass, weight = mass * GRAVITY;
  const front = clamp(weight * config.frontWeight - mass * ax * config.cgHeight / config.wheelbase, 0, weight);
  const rear = weight - front;
  // Algebraic load transfer: positive ay loads right tires, no suspension travel.
  const transfer = mass * ay * config.cgHeight / config.trackWidth;
  const frontTransfer = clamp(transfer * config.frontWeight, -front / 2, front / 2);
  const rearTransfer = clamp(transfer * (1 - config.frontWeight), -rear / 2, rear / 2);
  return [front / 2 - frontTransfer, front / 2 + frontTransfer, rear / 2 - rearTransfer, rear / 2 + rearTransfer];
}
// Friction coefficient of a tyre by surface: the curb gives CURB_GRIP_PC of the (already scaled) asphalt friction.
export function surfaceMu(config: KartConfig, surface: Surface): number {
  return surface === 'grass' ? config.grassFriction : surface === 'curb' ? config.friction * CURB_GRIP_PC : config.friction;
}
export function tireForce(load: number, slip: number, requestedFx: number, stiffness: number, surface: Surface, config: KartConfig) {
  if (load <= 0) return { fx: 0, fy: 0, capacity: 0, utilization: 0 };
  const mu = surfaceMu(config, surface);
  const capacity = mu * load * Math.pow(550 / Math.max(load, 25), config.loadSensitivity);
  const requestedFy = -stiffness * load * slip;
  const demand = Math.hypot(requestedFx, requestedFy), utilization = demand / capacity;
  // Brush-inspired combined envelope, progressive saturation and sliding drop.
  const sliding = 1 - 0.18 * (1 - Math.exp(-Math.max(0, utilization - 1) * 0.65));
  const force = capacity * Math.tanh(utilization) * sliding;
  const scale = demand > 0 ? force / demand : 0;
  return { fx: requestedFx * scale, fy: requestedFy * scale, capacity, utilization };
}
function handling(front: number, rear: number, sideslip: number, speed: number): Handling {
  if (speed < 3) return 'grip';
  if (Math.abs(sideslip) > 0.65) return 'sliding';
  if (rear > 0.09 && rear > front * 1.03) return 'oversteer';
  if (front > 0.09 && front > rear * 1.2) return 'understeer';
  if (front > 0.2 && rear > 0.2) return 'sliding';
  return 'grip';
}
// `track` is present only for a schema-3 track (DES-0003 of pista-kart-park); absent, nothing of the step changes.
export type Environment = { surfaceAt: (point: Point) => Surface; walls: boolean; track?: TrackGeometry };
export const CIRCUIT: Environment = { surfaceAt: p => nearest(p).distance > WIDTH / 2 ? 'grass' : 'asphalt', walls: true };
// Environment of a track declared in its file: surfaces from the file geometry, no wall derived from the centerline
// (REQ-FEAT-0004-04 of pista-kart-park); the only obstacles are the barriers of the file.
export function trackEnvironment(geometry: TrackGeometry): Environment {
  return { surfaceAt: p => classifySurface(geometry, p), walls: false, track: geometry };
}
// Distance of a point beyond the track edge, in metres, 0 on the track: the file geometry with `track`, otherwise the
// expression of edgeDistanceM of src/lap.ts over the synthetic track.
export function trackEdgeDistanceM(environment: Environment, point: Point): number {
  return environment.track ? beyondTrackEdgeM(environment.track, point) : Math.max(0, nearest(point).distance - WIDTH / 2);
}
export const TEST_PAD: Environment = { surfaceAt: () => 'asphalt', walls: false };
// Test pad of the handling benches (DES-0001, ADR-0005): a straight lane along z and a ring of radius arcRadiusM,
// both laneWidthM wide, without walls; outside the lane the surface is 'grass' in the sense of "off the asphalt".
// Not track data: no trackId, lines, sectors or markers. A non-positive width or radius gives an all-grass pad.
export function testPadLane(laneWidthM: number): Environment {
  return { surfaceAt: p => laneWidthM > 0 && Math.abs(p.x) <= laneWidthM / 2 ? 'asphalt' : 'grass', walls: false };
}
export function testPadArc(arcRadiusM: number, laneWidthM: number): Environment {
  return {
    surfaceAt: p => arcRadiusM > 0 && laneWidthM > 0 && Math.abs(Math.hypot(p.x, p.z) - arcRadiusM) <= laneWidthM / 2 ? 'asphalt' : 'grass',
    walls: false,
  };
}

export function steeringLimit(speed: number, config: KartConfig) {
  if (!config.drivingAssists) return config.maxSteer;
  // A digital key requests a controllable turn, not full mechanical steering.
  // Small slip allowance accounts for tire compliance; no knowledge of the track.
  const lateralG = config.assistLateralG ?? config.friction;
  const allowance = config.assistSteerAllowanceRad ?? 0.045;
  return Math.min(config.maxSteer,
    Math.atan(config.wheelbase * lateralG * GRAVITY / Math.max(speed * speed, 1)) + allowance);
}

// Fraction of the forcing rear-friction scale that applies at this speed (DES-0001): a ramp of forcingRampMps
// above 50 km/h; 1 (the step as built before the field existed) when the field is 0 or absent.
function forcingRampFraction(speed: number, config: KartConfig): number {
  const ramp = config.forcingRampMps ?? 0;
  return ramp > 0 ? clamp((speed - FORCING_SPEED_MPS) / ramp, 0, 1) : 1;
}

function integrate(state: State, input: Input, dt: number, config: KartConfig, environment: Environment, forcing: boolean, forcingRamp: number): State {
  const mass = config.kartMass + config.driverMass, inertia = mass * config.yawRadius ** 2;
  const { u, v } = bodyVelocity(state);
  const sin = Math.sin(state.heading), cos = Math.cos(state.heading);
  const drifting = config.drivingAssists && state.maneuvers.drifting;
  const boosting = config.drivingAssists && state.maneuvers.boost > 0;
  const limit = Math.min(config.maxSteer, steeringLimit(state.speed, config) * (drifting ? 1.2 : 1));
  const targetSteer = -clamp(input.steer, -1, 1) * limit;
  const returning = Math.abs(targetSteer) < 0.001 || Math.sign(targetSteer) !== Math.sign(state.steering);
  const steerRate = config.drivingAssists
    ? limit * (returning ? (config.steerReturnRatePerS ?? 10) : (config.steerApplyRatePerS ?? 5)) : config.steerRate;
  const forcingScale = config.drivingAssists && forcing ? 1 + ((config.forcingRearFrictionScale ?? 1) - 1) * forcingRamp : 1;
  const rearFrictionScale = (drifting ? 0.86 : 1) * forcingScale;
  let assistActive = false, wallContact = false, barrierHit = false;
  const steering = approach(state.steering, targetSteer, steerRate * dt);
  const throttle = approach(state.throttle, clamp(input.throttle, 0, 1), config.throttleRate * dt);
  const brake = approach(state.brake, clamp(input.brake, 0, 1), 6 * dt);
  const loads = wheelLoads(config, state.ax, state.ay);
  const positions = wheelPositions(config);
  const governor = clamp((config.governorSpeed + (boosting ? 3 : 0) - Math.abs(u)) / 1.5, 0, 1);
  // Brake/throttle interlock; single-ratio clutch and governor approximation.
  const drive = throttle * (1 - brake) * governor * Math.min(config.driveForce, config.enginePower * config.transmissionEfficiency / Math.max(Math.abs(u), 1));
  const coastBrake = (1 - throttle) * config.engineBrake * clamp(Math.abs(u) / 3, 0, 1);
  let fx = -0.42 * u * Math.abs(u), fy = 0, moment = 0;
  const wheels: Wheel[] = positions.map((p, i) => {
    const front = i < 2;
    const delta = front && Math.abs(steering) > 1e-5
      ? Math.atan(config.wheelbase / (config.wheelbase / Math.tan(steering) - p.left)) : 0;
    const cs = Math.cos(delta), sn = Math.sin(delta);
    const localU = u - state.yawRate * p.left, localV = v + state.yawRate * p.forward;
    const tireU = localU * cs + localV * sn, tireV = -localU * sn + localV * cs;
    const slip = Math.atan2(tireV, Math.max(Math.abs(tireU), 2));
    const point = { x: state.x + p.forward * sin + p.left * cos, z: state.z + p.forward * cos - p.left * sin };
    const surface = environment.surfaceAt(point);
    const rolling = (surface === 'grass' ? 0.18 : 0.018) * loads[i] * Math.tanh(tireU / 0.5);
    // Common rear-axle speed: opposing tire scrub resists yaw, less as inner unloads.
    const scrub = front ? 0 : config.axleScrub * loads[i] * (u - localU) / Math.max(Math.abs(u), 2);
    // Arcade brake assist distributes braking to both axles and reserves lateral grip.
    // Rental keeps its original rear-only braking.
    const brakeShare = config.drivingAssists ? (front ? 0.4 : 0.6) / 2 : (front ? 0 : 0.5);
    const brakeDemand = brake * config.brakeForce * brakeShare;
    const mu = surfaceMu(config, surface);
    const braking = config.drivingAssists ? Math.min(brakeDemand, loads[i] * mu * 0.65) : brakeDemand;
    const requestedFx = -rolling - braking * Math.tanh(tireU / 0.5)
      + (front ? 0 : drive / 2 - coastBrake / 2 * Math.tanh(tireU / 0.5) + scrub);
    const tireConfig = rearFrictionScale !== 1 && !front ? { ...config, friction: config.friction * rearFrictionScale } : config;
    const force = tireForce(loads[i], slip, requestedFx, front ? config.frontStiffness : config.rearStiffness, surface, tireConfig);
    const bodyFx = force.fx * cs - force.fy * sn, bodyFy = force.fx * sn + force.fy * cs;
    fx += bodyFx; fy += bodyFy;
    moment += p.forward * bodyFy - p.left * bodyFx;
    return { load: loads[i], slipAngle: slip, utilization: force.utilization,
      longitudinalForce: force.fx, lateralForce: force.fy, capacity: force.capacity, steerAngle: delta, surface };
  });
  if (config.drivingAssists && state.speed > 0.5) {
    assistActive = true;
    const asphaltFraction = wheels.filter(w => w.surface === 'asphalt').length / 4;
    const curbFraction = wheels.filter(w => w.surface === 'curb').length / 4;
    const grassFraction = wheels.filter(w => w.surface === 'grass').length / 4;
    // Without a curb the added term is exactly 0 and k / 4 is exact, so the synthetic track keeps the same bits (ADR-0004).
    const mu = config.grassFriction + (config.friction - config.grassFriction) * asphaltFraction + (CURB_GRIP_PC * config.friction - config.grassFriction) * curbFraction;
    // Arcade lateral damping removes excess sliding, while retaining small tire slip.
    const allowedSlipVelocity = Math.abs(u) * (drifting ? 0.18 : 0.035);
    const excessV = Math.sign(v) * Math.max(0, Math.abs(v) - allowedSlipVelocity);
    const slipCap = mass * mu * GRAVITY * (config.slipDampingCapG ?? 0.45);
    fy -= clamp(mass * excessV * (config.slipDampingGainPerS ?? 4), -slipCap, slipCap);
    // Only arrest excess yaw; never steer toward a track waypoint or boost turn-in.
    const intendedYaw = clamp(u * Math.tan(steering) / config.wheelbase,
      -mu * GRAVITY * 0.85 / Math.max(Math.abs(u), 2), mu * GRAVITY * 0.85 / Math.max(Math.abs(u), 2));
    const yawCeiling = Math.abs(intendedYaw) + 0.04;
    const correcting = Math.abs(input.steer) < 0.01 || state.yawRate * intendedYaw < 0;
    const excessYaw = correcting ? state.yawRate
      : Math.sign(state.yawRate) * Math.max(0, Math.abs(state.yawRate) - yawCeiling);
    moment -= inertia * excessYaw * (drifting ? 5 : (config.yawCorrectGainPerS ?? 9));
    if (drifting) {
      // Intentional, bounded arcade rotation aid. Player chooses turn direction.
      moment += clamp(inertia * (intendedYaw - state.yawRate) * 4, -140, 140);
    } else if ((config.yawTrackingGainPerS ?? 0) > 0) {
      // Bounded yaw tracking toward the steering intent (DES-0001); absent, the term does not exist.
      moment += clamp(inertia * (intendedYaw - state.yawRate) * (config.yawTrackingGainPerS ?? 0), -140, 140);
    }
    // Grass speed loss proportional to the fraction of wheels on the grass (DES-0001).
    if ((config.grassSpeedLossPerS ?? 0) > 0) fx -= mass * u * (config.grassSpeedLossPerS ?? 0) * grassFraction;
    if (boosting) fx += mass * (2.2 + state.maneuvers.boostTier * 0.4) * governor * throttle;
  }
  const ax = fx / mass, ay = fy / mass;
  let vx = state.vx + (ax * sin + ay * cos) * dt;
  let vz = state.vz + (ax * cos - ay * sin) * dt;
  let yawRate = state.yawRate + moment / inertia * dt;
  // Static rest constraint, shared by both presets.
  if (Math.hypot(vx, vz) < 0.04 && throttle < 0.01 && Math.abs(yawRate) < 0.04) { vx = vz = yawRate = 0; }
  const heading = state.heading + yawRate * dt;
  const next: State = {
    x: state.x + vx * dt, z: state.z + vz * dt, vx, vz, heading, yawRate,
    speed: Math.hypot(vx, vz), elapsed: state.elapsed + dt, steering, throttle, brake,
    ax: state.ax + (ax - state.ax) * (1 - Math.exp(-dt / 0.06)),
    ay: state.ay + (ay - state.ay) * (1 - Math.exp(-dt / 0.06)),
    telemetry: emptyTelemetry(),
    maneuvers: state.maneuvers,
    stepCount: state.stepCount,
  };
  const frontSlip = (Math.abs(wheels[0].slipAngle) + Math.abs(wheels[1].slipAngle)) / 2;
  const rearSlip = (Math.abs(wheels[2].slipAngle) + Math.abs(wheels[3].slipAngle)) / 2;
  const sideslip = Math.atan2(v, Math.max(Math.abs(u), 0.5));
  // Classified on the speed before the wall contact, exactly as before this feature.
  const label = handling(frontSlip, rearSlip, sideslip, next.speed);
  if (environment.walls) {
    const boundary = nearest(next), limit = WIDTH / 2 + 8;
    if (boundary.distance > limit) {
      const nx = (next.x - boundary.position.x) / boundary.distance, nz = (next.z - boundary.position.z) / boundary.distance;
      next.x = boundary.position.x + nx * limit; next.z = boundary.position.z + nz * limit;
      const outgoing = next.vx * nx + next.vz * nz;
      if (outgoing > 0) {
        next.vx -= outgoing * 1.12 * nx; next.vz -= outgoing * 1.12 * nz;
        next.yawRate *= 0.65;
        next.maneuvers = cancelManeuver(next.maneuvers);
        wallContact = true;
      }
      next.speed = Math.hypot(next.vx, next.vz);
    }
  }
  // Barrier block (ADR-0003 of pista-kart-park), only with a track and in the file order of its segments: contact on the
  // substep trajectory, else by proximity; the response is the wall's, with the normal pointing at the barrier.
  if (environment.track && environment.track.barrierSegments.length > 0) {
    const start: Point = { x: state.x, z: state.z };
    for (const seg of environment.track.barrierSegments) {
      const contact = barrierContactPoint(seg.a, seg.b, start, next);
      if (!contact) continue;
      next.x = contact.q.x + contact.m.x * BARRIER_HALF_WIDTH_M; next.z = contact.q.z + contact.m.z * BARRIER_HALF_WIDTH_M;
      const nx = -contact.m.x, nz = -contact.m.z;
      const outgoing = next.vx * nx + next.vz * nz;
      if (outgoing > 0) {
        next.vx -= outgoing * 1.12 * nx; next.vz -= outgoing * 1.12 * nz;
        next.yawRate *= 0.65;
        next.maneuvers = cancelManeuver(next.maneuvers);
        barrierHit = true;
      }
      next.speed = Math.hypot(next.vx, next.vz);
    }
  }
  next.telemetry = { wheels, longitudinalG: ax / GRAVITY, lateralG: ay / GRAVITY,
    frontSlip, rearSlip, sideslip, handling: label,
    forcing, surface: environment.surfaceAt(next), wallContact, assistActive, barrierTouching: barrierHit, barrierContact: false };
  return next;
}
// Sign of c relative to the directed segment ab (left positive).
const orientation = (a: Point, b: Point, c: Point) => (b.x - a.x) * (c.z - a.z) - (b.z - a.z) * (c.x - a.x);
// Contact of the substep trajectory s -> e with barrier segment ab: the crossing point on s's side (step 1), or the
// closest point when e lies within the contact surface (step 2); `m` is the unit normal pointing away from the barrier.
function barrierContactPoint(a: Point, b: Point, s: Point, e: Point): { q: Point; m: Point } | undefined {
  const lengthAB = Math.hypot(b.x - a.x, b.z - a.z);
  if (lengthAB === 0) return undefined;
  const leftOfAB: Point = { x: (b.z - a.z) / lengthAB, z: -(b.x - a.x) / lengthAB };
  const sSide = orientation(a, b, s);
  const startSideNormal: Point = sSide >= 0 ? leftOfAB : { x: -leftOfAB.x, z: -leftOfAB.z };
  const eSide = orientation(a, b, e);
  const aSide = orientation(s, e, a), bSide = orientation(s, e, b);
  if (sSide * eSide < 0 && aSide * bSide < 0) {
    const fraction = Math.abs(sSide) / Math.abs(eSide - sSide);
    return { q: { x: s.x + (e.x - s.x) * fraction, z: s.z + (e.z - s.z) * fraction }, m: startSideNormal };
  }
  const near = closestOnSegment(a, b, e);
  if (near.distanceM >= BARRIER_HALF_WIDTH_M) return undefined;
  if (near.distanceM === 0) return { q: near.point, m: startSideNormal };
  return { q: near.point, m: { x: (e.x - near.point.x) / near.distanceM, z: (e.z - near.point.z) / near.distanceM } };
}
export function step(state: State, input: Input, dt = STEP, config: KartConfig = RENTAL_KART, environment: Environment = CIRCUIT): State {
  if (!Number.isFinite(dt) || dt <= 0 || dt > 0.1) throw new RangeError('Physics dt must be in (0, 0.1].');
  const count = Math.ceil(dt / (STEP / SOLVER_SUBSTEPS));
  const sin = Math.sin(state.heading), cos = Math.cos(state.heading);
  // On the road: no wheel on the grass (a curb counts as track for the drift, RULE-0001 of pista-kart-park).
  const onRoad = wheelPositions(config).every(p => environment.surfaceAt({
    x: state.x + p.forward * sin + p.left * cos, z: state.z + p.forward * cos - p.left * sin,
  }) !== 'grass');
  // Forcing and its ramp are decided once per call, on the state at the start of the step (RULE-0001).
  const forcing = isForcing(state, input);
  const forcingRamp = forcingRampFraction(state.speed, config);
  let next = { ...state, maneuvers: advanceManeuvers(state.maneuvers, {
    enabled: config.drivingAssists, held: !!input.drift, steer: input.steer,
    throttle: input.throttle, brake: input.brake, speed: state.speed,
    slip: state.telemetry.sideslip, yaw: state.yawRate, onRoad,
  }, dt) };
  let wallContact = false, assistActive = false, barrierHit = false;
  for (let i = 0; i < count; i++) {
    next = integrate(next, input, dt / count, config, environment, forcing, forcingRamp);
    wallContact ||= next.telemetry.wallContact;
    assistActive ||= next.telemetry.assistActive;
    barrierHit ||= next.telemetry.barrierTouching;
  }
  // Touching: a barrier response in some substep, or the centre ending the step within the contact surface plus the
  // tolerance; nothing is consulted without a track or without barriers. Contact is the step touching begins.
  const barrierTouching = barrierHit || (environment.track !== undefined && environment.track.barrierSegments.length > 0
    && (nearestBarrier(environment.track, next)?.distanceM ?? Infinity) <= BARRIER_HALF_WIDTH_M + BARRIER_TOUCH_TOLERANCE_M);
  const barrierContact = barrierTouching && !state.telemetry.barrierTouching;
  next.telemetry = { ...next.telemetry, wallContact, assistActive, barrierTouching, barrierContact };
  next.stepCount = state.stepCount + 1;
  if (next.telemetry.wheels.some(w => w.surface === 'grass')) next.maneuvers = cancelManeuver(next.maneuvers);
  return next;
}
export type WheelSurface = 'ASPHALT' | 'CURB' | 'GRASS';
export type TrackContact = {
  simStepCount: number; wheelSurfaces: [WheelSurface, WheelSurface, WheelSurface, WheelSurface];
  curbWheelCount: number; wheelGripPc: [number, number, number, number]; beyondTrackEdgeM: number; barrierContact: boolean;
};
const WHEEL_SURFACE_LABEL: Record<Surface, WheelSurface> = { asphalt: 'ASPHALT', curb: 'CURB', grass: 'GRASS' };
// API-0003 of pista-kart-park (DES-0003): a pure reading of the state at the end of its step; the wheel surfaces are
// those of the wheel positions the next step will start from, by the wheel-position formula of integrate.
export function getTrackContact(state: State | undefined, environment: Environment, config: KartConfig): TrackContact | { code: 'NO_STATE' } {
  if (!state) return { code: 'NO_STATE' };
  const sin = Math.sin(state.heading), cos = Math.cos(state.heading);
  const surfaces = wheelPositions(config).map(p => environment.surfaceAt({
    x: state.x + p.forward * sin + p.left * cos, z: state.z + p.forward * cos - p.left * sin,
  }));
  const grip = (surface: Surface) => surface === 'asphalt' ? 1 : surface === 'curb' ? CURB_GRIP_PC : config.grassFriction / config.friction;
  return {
    simStepCount: state.stepCount,
    wheelSurfaces: surfaces.map(s => WHEEL_SURFACE_LABEL[s]) as TrackContact['wheelSurfaces'],
    curbWheelCount: surfaces.filter(s => s === 'curb').length,
    wheelGripPc: surfaces.map(grip) as TrackContact['wheelGripPc'],
    beyondTrackEdgeM: trackEdgeDistanceM(environment, state),
    barrierContact: state.telemetry.barrierContact === true,
  };
}
export type HandlingTelemetry = {
  simStepCount: number; setupId: SetupId; setupVersion: string;
  speedMps: number; handling: Handling; sideslipRad: number; yawRateRadPerS: number;
  surface: 'ASPHALT' | 'GRASS'; wallContact: boolean; forcing: boolean; driftActive: boolean;
};
// API-0001 (DES-0002): a pure reading of the state; the setup identity is passed by whoever started the lap.
export function getHandlingTelemetry(state: State | undefined, setup: SetupRef): HandlingTelemetry | { code: 'NO_STATE' } {
  if (!state) return { code: 'NO_STATE' };
  const t = state.telemetry;
  return {
    simStepCount: state.stepCount, setupId: setup.setupId, setupVersion: setup.setupVersion,
    speedMps: state.speed, handling: t.handling, sideslipRad: Math.abs(t.sideslip), yawRateRadPerS: state.yawRate,
    surface: t.surface === 'grass' ? 'GRASS' : 'ASPHALT', wallContact: t.wallContact, forcing: t.forcing,
    driftActive: state.maneuvers.drifting,
  };
}
// Step classes of RULE-0001 (DES-0001): decided here, in the simulation, from the Input applied in each step and
// the telemetry after it, in simStepCount order; the bench library only calls this.
export type StepClass = 'NORMAL' | 'FORCING' | 'DRIFT' | 'RECOVERY';
export const RECOVERY_MAX_STEPS = Math.round(0.4 / STEP);
const loose = (h: Handling) => h === 'oversteer' || h === 'sliding';
export function classifyHandlingSteps(steps: readonly { input: Input; telemetry: HandlingTelemetry }[]): StepClass[] {
  const classes: StepClass[] = [];
  let release = -1;
  for (let k = 0; k < steps.length; k++) {
    const { input, telemetry } = steps[k];
    if (telemetry.driftActive) { classes.push('DRIFT'); release = -1; continue; }
    if (telemetry.forcing) { classes.push('FORCING'); release = -1; continue; }
    const previous = k > 0 ? steps[k - 1] : undefined;
    if (previous && Math.abs(clamp(previous.input.steer, -1, 1)) >= 1 && input.steer === 0
      && previous.telemetry.forcing && loose(previous.telemetry.handling)) release = k;
    if (release >= 0 && k - release + 1 <= RECOVERY_MAX_STEPS) {
      classes.push('RECOVERY');
      if (telemetry.handling === 'grip') release = -1;
      continue;
    }
    release = -1;
    classes.push('NORMAL');
  }
  return classes;
}
