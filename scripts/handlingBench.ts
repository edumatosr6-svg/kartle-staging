// Handling bench library (DES-0004, ADR-0003, ADR-0004, ADR-0005, API-0003, RULE-0002): the records of every handling
// bench, shared by npm test, bench:handling and bench:physics. Simulation layer in the tree role `scripts/`:
// advances the simulation with STEP only; never reads a clock, node:perf_hooks or node:os. Wall-clock values
// (measuredAtUtc, stepCost) come from the caller. node:fs is used only to read docs/physics.md and src/physics.ts.
import { readFileSync } from 'node:fs';
import {
  CIRCUIT, getHandlingTelemetry, initialState, PUBLISHED_SETUPS, SOLVER_SUBSTEPS, step, STEP, testPadArea,
  type Environment, type Handling, type HandlingTelemetry, type Input, type KartConfig, type PublishedSetup, type SetupId, type State,
} from '../src/physics';
import { getLapResult, getLapState, startLap, stepLap, type LapSession } from '../src/lap';
import { COUNTDOWN_STEPS, toMs } from '../src/lapTiming';
import { nearest, SYNTHETIC_TRACK_FILE, track, WIDTH } from '../src/track';
import { readTrackData } from '../src/trackData';
import { compareLapRecords, readReplay, resolveSetupRef } from '../src/setupRecords';

// ----------------------------------------------------------------------------- parameters and thresholds

// Bench parameters (ADR-0004, decision 2): fixed and reported, never thresholds and never game configuration.
export const BENCH_PARAMETERS = Object.freeze({
  targetSpeedMps: 50 / 3.6, speedHoldMode: 'THROTTLE_REGULATED' as const, speedHoldBandMps: 0.5,
  holdMs: 600, settleWindowMs: 200, steerInputNormPartial: 0.5,
  testAreaRadiusM: 100, straightTestAreaRadiusM: 1500, radiusWindowMs: 200,
  forcingSpeedMps: 16.7, forcingWindowMs: 3000,
  grassEntryIndex: 83, grassEntryOffsetM: 0.2, grassEntryAngleRad: 0.15, grassWindowMs: 1000,
  wallApproachRad: 0.6, wallWindowMs: 10000, topSpeedWindowMs: 60000,
  maxSpeedMps: 26, lateralBudgetMps2: 9.5, driverMassKg: 75, runCount: 2,
});
export const MAX_LAP_STEPS = 6000;
export const PILOT_DECISION_STEPS = 12;

// Thresholds of RULE-0002 4.0.1, compared in the unit of the measured field without rounding it.
export const THRESHOLDS = Object.freeze({
  riseToNinetyPctMs: 180, fallToTenPctMs: 250, pathRadiusM: 13, turnRad: Math.PI, turnWithinMs: 2000, radiusAtMs: 3000,
  recoveryMs: 400, maxSideslipRad: 0.65, zeroToSixtyKmhMs: 2500, topSpeedMinMps: 65 / 3.6, topSpeedMaxMps: 72 / 3.6,
  grassSpeedRatio: 0.70, lapTimeMs: 25000, stepCostRatio: 1.10,
});
// Start speeds of CORNER_RADIUS fixed by the criteria (AC-US-0002-07, -08): criterion values, not bench parameters.
export const CORNER_ENTRY_SPEEDS_MPS: readonly number[] = Object.freeze([50 / 3.6, 70 / 3.6]);
const SIXTY_KMH_MPS = 60 / 3.6;
const FIFTY_KMH_MPS = 50 / 3.6;
const msToSteps = (ms: number) => Math.round(ms / 1000 / STEP);

// ----------------------------------------------------------------------------- records (API-0003 4.0.1)

export type BenchId =
  | 'STEER_RESPONSE' | 'CORNER_RADIUS' | 'CORNER_TURN' | 'NORMAL_DRIVING' | 'REAR_RECOVERY' | 'DRIFT_INERT' | 'SPEED_CAP'
  | 'ACCELERATION' | 'TOP_SPEED' | 'GRASS_LOSS' | 'WALL_CONTACT' | 'DETERMINISM' | 'TEST_PILOT_LAP' | 'STEP_COST'
  | 'SETUP_VERSION' | 'STEP_CONTRACT' | 'REALISTA_UNCHANGED';
export type BenchEnvironment = 'TEST_PAD' | 'SYNTHETIC_TRACK';
export type InputMode = 'BINARY' | 'PROPORTIONAL';
export type Verdict = 'PASS' | 'FAIL';
export type FailReason = 'THRESHOLD_EXCEEDED' | 'BASELINE_MISSING' | 'OFF_ASPHALT' | 'NON_DETERMINISTIC' | 'CONTRACT_CHANGED'
  | 'SPEED_NOT_HELD' | 'MEASUREMENT_MISSING' | 'TEST_AREA_EXCEEDED';
export type SpeedHoldMode = 'THROTTLE_CONSTANT' | 'THROTTLE_REGULATED';
// What a bench saw in its trace and no field of API-0003 carries; the second argument of judge (only GRASS_LOSS).
export type Observed = 'THRESHOLD_EXCEEDED';

export type BenchCommon = {
  benchEnvironment: BenchEnvironment; setupId: SetupId; setupVersion: string; inputMode: InputMode;
  verdict: Verdict; failReason?: FailReason; measuredAtUtc: string; baselineAvailable: boolean;
};
type OffAsphalt = { offAsphaltStepCount: number; offAsphaltFirstStep?: number; offAsphaltFirstXM?: number; offAsphaltFirstZM?: number };
// The fields of every record with benchEnvironment TEST_PAD (API-0003, open test pad).
export type TestPadFields = OffAsphalt & { testAreaRadiusM: number };
export type SteerResponseRecord = BenchCommon & TestPadFields & { benchId: 'STEER_RESPONSE'; steerInputNorm: number; targetSpeedMps: number;
  speedHoldMode: SpeedHoldMode; throttleInputNorm?: number; speedHoldBandMps: number; speedMinMps: number; speedMaxMps: number;
  riseToNinetyPctMs: number; fallToTenPctMs: number; settleWindowMs: number; steadyYawRateRadPerS: number; understeerStepCount: number };
export type CornerRadiusRecord = BenchCommon & TestPadFields & { benchId: 'CORNER_RADIUS'; steerInputNorm: number; entrySpeedMps: number;
  radiusWindowMs: number; pathRadiusAt3sM?: number; speedAt3sMps: number; handlingAt3s: Handling; stoppedAtStep?: number };
export type CornerTurnRecord = BenchCommon & TestPadFields & { benchId: 'CORNER_TURN'; steerInputNorm: number; entrySpeedMps: number;
  turnAt2sRad: number; halfTurnReachedMs?: number; speedAt2sMps: number; stoppedAtStep?: number };
export type NormalDrivingRecord = BenchCommon & { benchId: 'NORMAL_DRIVING'; normalDrivingStepCount: number;
  oversteerOrSlidingStepCount: number; maxSideslipRad: number };
export type RearRecoveryRecord = BenchCommon & TestPadFields & { benchId: 'REAR_RECOVERY'; steerInputNorm: number; entrySpeedMps: number;
  rearReleased: boolean; forcingMs: number; gripReached?: boolean; recoveryMs?: number; maxSideslipRad?: number };
// The area fields exist only on the TEST_PAD sequence (the recovery); the lap sequence is SYNTHETIC_TRACK.
export type DriftInertRecord = BenchCommon & Partial<TestPadFields> & { benchId: 'DRIFT_INERT'; comparedStepCount: number;
  differingStepCount: number; firstDifferingStep?: number };
export type SpeedCapRecord = BenchCommon & { benchId: 'SPEED_CAP'; maxObservedSpeedMps: number; maxObservedBenchId: BenchId; topSpeedMps?: number };
export type AccelerationRecord = BenchCommon & TestPadFields & { benchId: 'ACCELERATION'; zeroToSixtyKmhMs: number; driverMassKg: number };
export type TopSpeedRecord = BenchCommon & TestPadFields & { benchId: 'TOP_SPEED'; topSpeedMps: number };
export type GrassLossRecord = BenchCommon & { benchId: 'GRASS_LOSS'; entrySpeedMps: number; speedAfterOneSMps: number };
export type WallContactRecord = BenchCommon & { benchId: 'WALL_CONTACT'; contacts: [number, number][] };
export type DeterminismRecord = BenchCommon & Partial<TestPadFields> & { benchId: 'DETERMINISM'; runCount: number; identical: boolean };
export type TestPilotLapRecord = BenchCommon & OffAsphalt & { benchId: 'TEST_PILOT_LAP'; lapTimeMs: number; sectorMs: number[]; baselineLapTimeMs?: number };
export type StepCostRecord = BenchCommon & { benchId: 'STEP_COST'; meanStepCostUs: number; baselineMeanStepCostUs?: number };
export type SetupVersionRecord = BenchCommon & { benchId: 'SETUP_VERSION'; declaredSetupVersion: string; previousSetupVersion: string;
  oldRecordsReadCount: number; oldRecordsReadOkCount: number };
export type StepContractRecord = BenchCommon & { benchId: 'STEP_CONTRACT'; stepUnchanged: boolean; solverRateUnchanged: boolean; inputFieldsUnchanged: boolean };
export type RealistaUnchangedRecord = BenchCommon & Partial<TestPadFields> & { benchId: 'REALISTA_UNCHANGED'; differingMeasureCount: number; arcadeAssistActiveCount: number };
export type BenchRecord =
  | SteerResponseRecord | CornerRadiusRecord | CornerTurnRecord | NormalDrivingRecord | RearRecoveryRecord | DriftInertRecord | SpeedCapRecord
  | AccelerationRecord | TopSpeedRecord | GrassLossRecord | WallContactRecord | DeterminismRecord | TestPilotLapRecord | StepCostRecord
  | SetupVersionRecord | StepContractRecord | RealistaUnchangedRecord;

export type Baseline = { setupId: SetupId; setupVersion: string; measuredAtUtc: string; runtimeId?: string; parameters?: Record<string, unknown>; records: BenchRecord[] };
export type BenchOptions = {
  setup: PublishedSetup; version: 'current' | 'previous'; inputMode: InputMode;
  baseline?: Baseline; realistaBaseline?: Baseline; oldRecords?: readonly unknown[]; measuredAtUtc: string;
  stepCost?: { meanStepCostUs: number; runtimeId: string };
};

// The suite order: record order, SPEED_CAP tie-break and the first exit of an aggregated TEST_PAD record.
export const SIMULATION_BENCHES: readonly BenchId[] = Object.freeze([
  'STEER_RESPONSE', 'CORNER_RADIUS', 'CORNER_TURN', 'NORMAL_DRIVING', 'REAR_RECOVERY', 'DRIFT_INERT', 'SPEED_CAP',
  'ACCELERATION', 'TOP_SPEED', 'GRASS_LOSS', 'WALL_CONTACT', 'DETERMINISM', 'TEST_PILOT_LAP',
]);
export const ALL_BENCHES: readonly BenchId[] = Object.freeze([...SIMULATION_BENCHES, 'STEP_COST', 'SETUP_VERSION', 'STEP_CONTRACT', 'REALISTA_UNCHANGED']);
const ENVIRONMENTS: readonly BenchEnvironment[] = Object.freeze(['TEST_PAD', 'SYNTHETIC_TRACK']);

// ----------------------------------------------------------------------------- environments and helpers

// The open test pad (DES-0001, ADR-0005): the curve area and the straight area, both centred on the start point.
export const padEnvironment: Environment = testPadArea(BENCH_PARAMETERS.testAreaRadiusM);
export const straightPadEnvironment: Environment = testPadArea(BENCH_PARAMETERS.straightTestAreaRadiusM);

export type Controller = (lap: LapSession) => Input;
type Trace = { inputs: Input[]; states: State[]; telemetry: HandlingTelemetry[] };
type Exit = { step: number; x: number; z: number };
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
const loose = (h: HandlingTelemetry['handling']) => h === 'oversteer' || h === 'sliding';
const setupConfig = (o: BenchOptions): KartConfig => ({ ...(o.version === 'previous' && o.setup.previousConfig ? o.setup.previousConfig : o.setup.config), driverMass: BENCH_PARAMETERS.driverMassKg });
const setupRef = (o: BenchOptions) => ({ setupId: o.setup.setupId, setupVersion: o.version === 'previous' && o.setup.previousSetupVersion ? o.setup.previousSetupVersion : o.setup.setupVersion });
const common = (o: BenchOptions, benchEnvironment: BenchEnvironment): BenchCommon =>
  ({ benchEnvironment, ...setupRef(o), inputMode: o.inputMode, verdict: 'PASS', measuredAtUtc: o.measuredAtUtc, baselineAvailable: false });
const telemetryOf = (s: State, o: BenchOptions): HandlingTelemetry => getHandlingTelemetry(s, setupRef(o)) as HandlingTelemetry;
const exitFields = (exit: Exit | undefined): OffAsphalt => exit
  ? { offAsphaltStepCount: 1, offAsphaltFirstStep: exit.step, offAsphaltFirstXM: exit.x, offAsphaltFirstZM: exit.z }
  : { offAsphaltStepCount: 0 };
const padFields = (radiusM: number, exit: Exit | undefined): TestPadFields => ({ testAreaRadiusM: radiusM, ...exitFields(exit) });
// The regulated throttle of ADR-0005, decision 2: 1 while the previous speed is below the target, else 0; binary by construction.
const regulated = (previousSpeedMps: number, targetMps: number) => previousSpeedMps < targetMps ? 1 : 0;
const wrapAngle = (a: number) => { let w = a; while (w > Math.PI) w -= 2 * Math.PI; while (w <= -Math.PI) w += 2 * Math.PI; return w; };

// Diagnostics that are not fields of API-0003 (the `#` presentation line): kept beside the record, never inside it.
const DIAGNOSTICS = new WeakMap<object, string[]>();
function withDiagnostics<T extends BenchRecord>(record: T, notes: readonly string[]): T {
  if (notes.length) DIAGNOSTICS.set(record, [...notes]);
  return record;
}
export const diagnosticsOf = (record: BenchRecord): readonly string[] => DIAGNOSTICS.get(record) ?? [];

// BINARY is the keyboard: 0/1 and -1/0/1; PROPORTIONAL is the tilt adapter: a continuous number saturated in range.
export function makeInput(mode: InputMode, throttle: number, brake: number, steer: number, drift?: boolean): Input {
  const input: Input = mode === 'BINARY'
    ? { throttle: Number(throttle >= 0.5), brake: Number(brake >= 0.5), steer: Math.sign(steer) }
    : { throttle: clamp(throttle, 0, 1), brake: clamp(brake, 0, 1), steer: clamp(steer, -1, 1) };
  if (drift !== undefined) input.drift = drift;
  return input;
}

// "Straight at V": the start point of every bench on the open test pad, centre of the declared area, heading +z.
export function straight(speedMps: number): State {
  return { ...initialState(), x: 0, z: 0, heading: 0, vx: 0, vz: speedMps, speed: speedMps };
}
// Entry on the grass of the synthetic track: beside the straightest stretch, on the side away from the origin,
// heading rotated outward by grassEntryAngleRad (positive yaw turns left; the body's left is +n at heading h).
export function grassEntry(speedMps: number): State {
  const i = BENCH_PARAMETERS.grassEntryIndex;
  const p = track[i], q = track[(i + 1) % track.length];
  const h = Math.atan2(q.x - p.x, q.z - p.z);
  const n = { x: Math.cos(h), z: -Math.sin(h) };
  const outward = n.x * p.x + n.z * p.z > 0 ? 1 : -1;
  const offset = WIDTH / 2 + BENCH_PARAMETERS.grassEntryOffsetM;
  const heading = h + outward * BENCH_PARAMETERS.grassEntryAngleRad;
  return {
    ...initialState(), x: p.x + outward * n.x * offset, z: p.z + outward * n.z * offset, heading,
    vx: speedMps * Math.sin(heading), vz: speedMps * Math.cos(heading), speed: speedMps,
  };
}
export function wallApproach(): State {
  const s = initialState();
  return { ...s, heading: s.heading + BENCH_PARAMETERS.wallApproachRad };
}

function advance(state: State, config: KartConfig, environment: Environment, o: BenchOptions, trace: Trace, input: Input): State {
  const next = step(state, input, STEP, config, environment);
  trace.inputs.push(input);
  trace.states.push(next);
  trace.telemetry.push(telemetryOf(next, o));
  return next;
}
const newTrace = (): Trace => ({ inputs: [], states: [], telemetry: [] });
const lastOf = (trace: Trace) => trace.telemetry[trace.telemetry.length - 1];
const exitOf = (t: HandlingTelemetry): Exit => ({ step: t.simStepCount, x: t.positionXM, z: t.positionZM });

function deepEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const ka = Object.keys(a as object), kb = Object.keys(b as object);
  if (ka.length !== kb.length) return false;
  for (const k of ka) if (!deepEqual((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k])) return false;
  return true;
}

// ----------------------------------------------------------------------------- the test pilot (ADR-0004)

// Binary commands decided every 12 steps (10 Hz) by look-ahead over the centerline; derived from the former
// scripts/keyboard-lap.ts, with maxSpeedMps and lateralBudgetMps2 as fixed bench parameters. The regression ruler:
// the same pilot for the baseline and for the new setup; it does not read the config it receives.
export function testPilot(config: KartConfig): Controller {
  let input: Input = { throttle: 1, brake: 0, steer: 0 };
  let tick = 0;
  const n = track.length;
  return (lap) => {
    const state = lap.kart;
    if (tick % PILOT_DECISION_STEPS === 0) {
      const location = nearest(state);
      const ahead = Math.max(3, Math.round(state.speed * 0.5));
      const target = track[(location.index + ahead) % n];
      let curvature = 0;
      for (const base of [3, 7, 11]) {
        const a = track[(location.index + base) % n], b = track[(location.index + base + 4) % n], c = track[(location.index + base + 8) % n];
        curvature = Math.max(curvature, 2 * Math.abs((b.x - a.x) * (c.z - b.z) - (b.z - a.z) * (c.x - b.x))
          / (Math.hypot(b.x - a.x, b.z - a.z) * Math.hypot(c.x - b.x, c.z - b.z) * Math.hypot(c.x - a.x, c.z - a.z)));
      }
      const targetSpeed = Math.min(BENCH_PARAMETERS.maxSpeedMps, Math.sqrt(BENCH_PARAMETERS.lateralBudgetMps2 / Math.max(curvature, 0.001)));
      const desired = Math.atan2(target.x - state.x, target.z - state.z);
      const error = Math.atan2(Math.sin(desired - state.heading), Math.cos(desired - state.heading));
      input = {
        throttle: state.speed < targetSpeed ? 1 : 0,
        brake: state.speed > targetSpeed + 1 ? 1 : 0,
        steer: Math.abs(error) > 0.07 ? -Math.sign(error) : 0,
      };
      void config;
    }
    tick++;
    return input;
  };
}

// ----------------------------------------------------------------------------- open test-pad benches

// STEER_RESPONSE: open pad, speed held at 50 km/h by the regulated throttle; phase A holds the steer for holdMs, phase B
// releases it. The verdict depends only on the two times with the speed held (API-0003, AC-US-0001-05). The run stops at
// the first step off the declared area; every required field is then measured over the executed steps (DES-0004).
function steerResponse(o: BenchOptions, steerInputNorm: number): { record: SteerResponseRecord; trace: Trace } {
  const config = setupConfig(o), trace = newTrace();
  const hold = msToSteps(BENCH_PARAMETERS.holdMs), settle = msToSteps(BENCH_PARAMETERS.settleWindowMs);
  const target = BENCH_PARAMETERS.targetSpeedMps;
  let state = straight(target), exit: Exit | undefined;
  let speedMin = Infinity, speedMax = -Infinity;
  for (let i = 0; i < hold; i++) {
    state = advance(state, config, padEnvironment, o, trace, makeInput(o.inputMode, regulated(state.speed, target), 0, steerInputNorm));
    const t = lastOf(trace);
    speedMin = Math.min(speedMin, t.speedMps); speedMax = Math.max(speedMax, t.speedMps);
    if (t.surface === 'GRASS') { exit = exitOf(t); break; }
  }
  const yaw = trace.telemetry.map(t => Math.abs(t.yawRateRadPerS));
  const window = yaw.slice(Math.max(0, yaw.length - settle));
  const steady = window.reduce((a, b) => a + b, 0) / window.length;
  let riseSteps = yaw.findIndex(y => y >= 0.9 * steady);
  riseSteps = riseSteps < 0 ? hold : riseSteps + 1;
  let fallSteps = hold;
  if (!exit) {
    for (let i = 0; i < hold; i++) {
      state = advance(state, config, padEnvironment, o, trace, makeInput(o.inputMode, regulated(state.speed, target), 0, 0));
      const t = lastOf(trace);
      if (t.surface === 'GRASS') { exit = exitOf(t); break; }
      if (Math.abs(t.yawRateRadPerS) <= 0.1 * steady) { fallSteps = i + 1; break; }
    }
  }
  const record: SteerResponseRecord = {
    ...common(o, 'TEST_PAD'), benchId: 'STEER_RESPONSE', steerInputNorm,
    targetSpeedMps: target, speedHoldMode: BENCH_PARAMETERS.speedHoldMode, speedHoldBandMps: BENCH_PARAMETERS.speedHoldBandMps,
    speedMinMps: speedMin, speedMaxMps: speedMax,
    riseToNinetyPctMs: toMs(riseSteps), fallToTenPctMs: toMs(fallSteps),
    settleWindowMs: BENCH_PARAMETERS.settleWindowMs, steadyYawRateRadPerS: steady,
    understeerStepCount: trace.telemetry.filter(t => t.handling === 'understeer').length,
    ...padFields(BENCH_PARAMETERS.testAreaRadiusM, exit),
  };
  return { record: judge(record), trace };
}

// Path radius around 3 s (RULE-0002, "Medidas da curva de referência"; DES-0004): over the window steps 349 to 372, the
// change of the direction of motion between consecutive displacements, along the mean of their lengths; radius = L / |Θ|.
// `positions[j]` is P_j (P_0 the start); only the executed steps enter. A straight path (|Θ| = 0) gives Number.MAX_VALUE.
function pathRadius(positions: readonly { x: number; z: number }[]): { radiusM: number; lengthM: number; turnRad: number } {
  const half = msToSteps(BENCH_PARAMETERS.radiusWindowMs / 2), centre = msToSteps(THRESHOLDS.radiusAtMs);
  let theta = 0, length = 0;
  for (let j = centre - half + 2; j <= centre + half && j < positions.length; j++) {
    const d1 = { x: positions[j - 1].x - positions[j - 2].x, z: positions[j - 1].z - positions[j - 2].z };
    const d2 = { x: positions[j].x - positions[j - 1].x, z: positions[j].z - positions[j - 1].z };
    const l1 = Math.hypot(d1.x, d1.z), l2 = Math.hypot(d2.x, d2.z);
    if (l1 === 0 || l2 === 0) continue;
    theta += wrapAngle(Math.atan2(d2.x, d2.z) - Math.atan2(d1.x, d1.z));
    length += (l1 + l2) / 2;
  }
  return { radiusM: theta === 0 ? Number.MAX_VALUE : length / Math.abs(theta), lengthM: length, turnRad: theta };
}

// CORNER_RADIUS: from the start speed, throttle 1 and full steer from step 1 (the start) to the end of the radius window
// (step 372), the stop before 3 s, or the exit of the declared area. Judged only by the path radius at 3 s.
function cornerRadius(o: BenchOptions, entrySpeedMps: number, steerInputNorm: number): { record: CornerRadiusRecord; trace: Trace } {
  const config = setupConfig(o), trace = newTrace();
  const at = msToSteps(THRESHOLDS.radiusAtMs), last = at + msToSteps(BENCH_PARAMETERS.radiusWindowMs / 2);
  const input = makeInput(o.inputMode, 1, 0, steerInputNorm);
  let state = straight(entrySpeedMps), exit: Exit | undefined, stoppedAtStep: number | undefined;
  const positions = [{ x: state.x, z: state.z }];
  for (let j = 1; j <= last; j++) {
    state = advance(state, config, padEnvironment, o, trace, input);
    const t = lastOf(trace);
    positions.push({ x: t.positionXM, z: t.positionZM });
    if (t.surface === 'GRASS') { exit = exitOf(t); break; }
    if (j < at && t.speedMps === 0) { stoppedAtStep = t.simStepCount; break; }
  }
  // The step of 3 s, or the step of the stop or of the exit when it came before.
  const atStep = trace.telemetry[Math.min(at, trace.telemetry.length) - 1];
  const radius = pathRadius(positions);
  const record: CornerRadiusRecord = {
    ...common(o, 'TEST_PAD'), benchId: 'CORNER_RADIUS', steerInputNorm, entrySpeedMps,
    radiusWindowMs: BENCH_PARAMETERS.radiusWindowMs,
    ...(stoppedAtStep === undefined ? { pathRadiusAt3sM: radius.radiusM } : {}),
    speedAt3sMps: stoppedAtStep === undefined ? atStep.speedMps : 0, handlingAt3s: atStep.handling,
    ...(stoppedAtStep !== undefined ? { stoppedAtStep } : {}),
    ...padFields(BENCH_PARAMETERS.testAreaRadiusM, exit),
  };
  const notes = stoppedAtStep === undefined ? [`L ${radius.lengthM.toFixed(3)} m · Θ ${radius.turnRad.toFixed(4)} rad`] : [];
  return { record: withDiagnostics(judge(record), notes), trace };
}

// CORNER_TURN: from 50 km/h, throttle 0 and full steer from step 1 to step 240 (2 s), the stop, or the exit of the
// declared area. Judged only by a turn of at least π rad reached within 2 s (or up to the stop).
function cornerTurn(o: BenchOptions, steerInputNorm: number): { record: CornerTurnRecord; trace: Trace } {
  const config = setupConfig(o), trace = newTrace();
  const within = msToSteps(THRESHOLDS.turnWithinMs);
  const input = makeInput(o.inputMode, 0, 0, steerInputNorm);
  let state = straight(FIFTY_KMH_MPS), exit: Exit | undefined, stoppedAtStep: number | undefined, halfTurnSteps: number | undefined;
  const heading0 = state.heading;
  for (let j = 1; j <= within; j++) {
    state = advance(state, config, padEnvironment, o, trace, input);
    const t = lastOf(trace);
    if (t.surface === 'GRASS') { exit = exitOf(t); break; }
    if (halfTurnSteps === undefined && Math.abs(t.headingRad - heading0) >= THRESHOLDS.turnRad) halfTurnSteps = j;
    if (j < within && t.speedMps === 0) { stoppedAtStep = t.simStepCount; break; }
  }
  const end = lastOf(trace);
  const record: CornerTurnRecord = {
    ...common(o, 'TEST_PAD'), benchId: 'CORNER_TURN', steerInputNorm, entrySpeedMps: FIFTY_KMH_MPS,
    turnAt2sRad: Math.abs(end.headingRad - heading0),
    ...(halfTurnSteps !== undefined ? { halfTurnReachedMs: toMs(halfTurnSteps) } : {}),
    speedAt2sMps: stoppedAtStep === undefined ? end.speedMps : 0,
    ...(stoppedAtStep !== undefined ? { stoppedAtStep } : {}),
    ...padFields(BENCH_PARAMETERS.testAreaRadiusM, exit),
  };
  return { record: judge(record), trace };
}

// REAR_RECOVERY: open pad at forcingSpeedMps, throttle 1 and full steer (the forcing condition) until the rear lets go or
// forcingWindowMs; only if it let go, steer 0 with the throttle held until the first grip or forcingWindowMs.
function rearRecovery(o: BenchOptions, steerInputNorm: number): { record: RearRecoveryRecord; trace: Trace } {
  const config = setupConfig(o), trace = newTrace();
  const window = msToSteps(BENCH_PARAMETERS.forcingWindowMs);
  let state = straight(BENCH_PARAMETERS.forcingSpeedMps);
  const forcing = makeInput(o.inputMode, 1, 0, steerInputNorm), release = makeInput(o.inputMode, 1, 0, 0);
  let rearReleased = false, forcingSteps = 0, exit: Exit | undefined;
  for (let i = 0; i < window; i++) {
    state = advance(state, config, padEnvironment, o, trace, forcing);
    forcingSteps++;
    const t = lastOf(trace);
    if (t.surface === 'GRASS') { exit = exitOf(t); break; }
    if (t.forcing && loose(t.handling)) { rearReleased = true; break; }
  }
  let gripReached = false, recoverySteps = 0, maxSideslipRad = 0;
  if (rearReleased) {
    for (let i = 1; i <= window; i++) {
      state = advance(state, config, padEnvironment, o, trace, release);
      const t = lastOf(trace);
      maxSideslipRad = Math.max(maxSideslipRad, t.sideslipRad);
      if (t.surface === 'GRASS') { exit = exitOf(t); break; }
      if (t.handling === 'grip') { gripReached = true; recoverySteps = i; break; }
    }
  }
  const record: RearRecoveryRecord = {
    ...common(o, 'TEST_PAD'), benchId: 'REAR_RECOVERY', steerInputNorm, entrySpeedMps: BENCH_PARAMETERS.forcingSpeedMps,
    rearReleased, forcingMs: toMs(forcingSteps),
    ...(rearReleased ? { gripReached, ...(gripReached ? { recoveryMs: toMs(recoverySteps) } : {}), maxSideslipRad } : {}),
    ...padFields(BENCH_PARAMETERS.testAreaRadiusM, exit),
  };
  return { record: withDiagnostics(judge(record), rearReleased ? [] : ['a traseira não soltou em forcingWindowMs']), trace };
}

// ACCELERATION and TOP_SPEED: the straight area from rest, throttle 1, until the speed stops growing.
function straightLine(o: BenchOptions): { acceleration: AccelerationRecord; topSpeed: TopSpeedRecord; trace: Trace; final: State } {
  const config = setupConfig(o), trace = newTrace();
  const full = makeInput(o.inputMode, 1, 0, 0);
  let state = straight(0), sixtySteps: number | undefined, flat = 0, exit: Exit | undefined;
  const limit = msToSteps(BENCH_PARAMETERS.topSpeedWindowMs);
  for (let i = 1; i <= limit; i++) {
    const before = state.speed;
    state = advance(state, config, straightPadEnvironment, o, trace, full);
    if (sixtySteps === undefined && state.speed >= SIXTY_KMH_MPS) sixtySteps = i;
    const t = lastOf(trace);
    if (t.surface === 'GRASS') { exit = exitOf(t); break; }
    flat = Math.abs(state.speed - before) < 1e-6 ? flat + 1 : 0;
    if (flat >= 120 && sixtySteps !== undefined) break;
  }
  const area = padFields(BENCH_PARAMETERS.straightTestAreaRadiusM, exit);
  const acceleration = judge<AccelerationRecord>({ ...common(o, 'TEST_PAD'), benchId: 'ACCELERATION', zeroToSixtyKmhMs: toMs(sixtySteps ?? limit), driverMassKg: BENCH_PARAMETERS.driverMassKg, ...area });
  const topSpeed = judge<TopSpeedRecord>({ ...common(o, 'TEST_PAD'), benchId: 'TOP_SPEED', topSpeedMps: state.speed, ...area });
  return { acceleration, topSpeed, trace, final: state };
}

// ----------------------------------------------------------------------------- synthetic-track benches

// GRASS_LOSS: 1 s on the grass of the synthetic track; the precondition (grass held, no wall) reaches judge as observed.
function grassLoss(o: BenchOptions, entrySpeedMps: number): { record: GrassLossRecord; trace: Trace } {
  const config = setupConfig(o), trace = newTrace();
  const full = makeInput(o.inputMode, 1, 0, 0);
  let state = grassEntry(entrySpeedMps), offGrass = 0, wall = 0;
  for (let i = 0; i < msToSteps(BENCH_PARAMETERS.grassWindowMs); i++) {
    state = advance(state, config, CIRCUIT, o, trace, full);
    const t = lastOf(trace);
    if (t.surface !== 'GRASS') offGrass++;
    if (t.wallContact) wall++;
  }
  const record: GrassLossRecord = { ...common(o, 'SYNTHETIC_TRACK'), benchId: 'GRASS_LOSS', entrySpeedMps, speedAfterOneSMps: state.speed };
  const observed: Observed | undefined = offGrass > 0 || wall > 0 ? 'THRESHOLD_EXCEEDED' : undefined;
  const notes = observed ? [`observed ${observed}: precondition not held (steps off grass ${offGrass}, wall contacts ${wall})`] : [];
  return { record: withDiagnostics(judge(record, observed), notes), trace };
}

function wallContact(o: BenchOptions): { record: WallContactRecord; trace: Trace } {
  const config = setupConfig(o), trace = newTrace();
  const full = makeInput(o.inputMode, 1, 0, 0);
  let state = wallApproach();
  for (let i = 0; i < msToSteps(BENCH_PARAMETERS.wallWindowMs); i++) state = advance(state, config, CIRCUIT, o, trace, full);
  const contacts: [number, number][] = [];
  for (let i = 1; i < trace.states.length - 1; i++) {
    if (trace.telemetry[i].wallContact && trace.states[i - 1].speed > 0) contacts.push([trace.states[i - 1].speed, trace.states[i + 1].speed]);
  }
  const record: WallContactRecord = { ...common(o, 'SYNTHETIC_TRACK'), benchId: 'WALL_CONTACT', contacts };
  return { record: judge(record), trace };
}

export function syntheticReading() { return readTrackData(SYNTHETIC_TRACK_FILE); }

function startSyntheticLap(o: BenchOptions, config: KartConfig): LapSession {
  const reading = syntheticReading();
  if (reading.trackDataStatus !== 'COMPLETE') throw new Error(`synthetic track is ${reading.trackDataStatus}`);
  const started = startLap(undefined, { lapKind: 'TRAINING', trackId: reading.trackId, trackVersion: reading.trackVersion, ...setupRef(o) }, reading, config);
  if (!started.ok) throw new Error(`startLap rejected the synthetic track: ${started.code}`);
  return started.lap;
}
// The lap ends at the first result getLapResult returns (the first lap completed or invalidated), never at phase ENDED,
// which the continuous training of race-lap-validation reaches only by endTraining (FB-01; DES-0004).
const hasLapResult = (lap: LapSession) => !('code' in getLapResult(lap));

// TEST_PILOT_LAP: a TRAINING lap on the synthetic track; a lap without a time reports the window ceiling (ADR-0004).
// `sequence` is the whole Input sequence applied by stepLap (the countdown steps and the pilot), replayed by DRIFT_INERT.
function testPilotLap(o: BenchOptions, controller?: Controller): { record: TestPilotLapRecord; trace: Trace; lap: LapSession; sequence: Input[] } {
  const config = setupConfig(o), trace = newTrace();
  let lap = startSyntheticLap(o, config);
  const idle: Input = { throttle: 0, brake: 0, steer: 0 };
  const sequence: Input[] = [];
  for (let i = 0; i < COUNTDOWN_STEPS; i++) { lap = stepLap(lap, idle); sequence.push(idle); }
  const pilot = controller ?? testPilot(config);
  let off = 0, exit: Exit | undefined;
  for (let i = 0; i < MAX_LAP_STEPS && !hasLapResult(lap); i++) {
    const input = pilot(lap);
    lap = stepLap(lap, input);
    sequence.push(input);
    trace.inputs.push(input);
    trace.states.push(lap.kart);
    const t = telemetryOf(lap.kart, o);
    trace.telemetry.push(t);
    if (t.surface === 'GRASS') { off++; exit ??= { step: lap.stepCount, x: lap.kart.x, z: lap.kart.z }; }
  }
  const result = getLapResult(lap), view = getLapState(lap);
  const ceiling = toMs(MAX_LAP_STEPS);
  const valid = 'code' in result || result.lapValidity !== 'VALID' || result.lapMs === undefined || result.sectorMs === undefined
    ? undefined : { lapMs: result.lapMs, sectorMs: result.sectorMs };
  const lapTimeMs = valid ? valid.lapMs : ceiling;
  const completed = valid ? [...valid.sectorMs] : ('code' in view ? [] : [...view.completedSectorMs]);
  const sectorMs = [...completed.slice(0, 4), ...Array.from({ length: Math.max(0, 4 - completed.length) }, () => ceiling)];
  const base = baselineRecord<TestPilotLapRecord>(o.baseline, 'TEST_PILOT_LAP', r => r.benchEnvironment === 'SYNTHETIC_TRACK' && r.inputMode === o.inputMode);
  const record: TestPilotLapRecord = {
    ...common(o, 'SYNTHETIC_TRACK'), benchId: 'TEST_PILOT_LAP', baselineAvailable: base !== undefined, lapTimeMs, sectorMs,
    offAsphaltStepCount: off, ...(exit ? { offAsphaltFirstStep: exit.step, offAsphaltFirstXM: exit.x, offAsphaltFirstZM: exit.z } : {}),
    ...(base !== undefined ? { baselineLapTimeMs: base.lapTimeMs } : {}),
  };
  const notes = [`lapValidity ${valid ? 'VALID' : 'code' in result ? 'NOT_ENDED' : 'INVALID'}`];
  return { record: withDiagnostics(judge(record), notes), trace, lap, sequence };
}

// ----------------------------------------------------------------------------- derived benches

// NORMAL_DRIVING: every RUNNING step of the TEST_PILOT_LAP trace of the same run, without exception (RULE-0001).
function normalDriving(o: BenchOptions, lap: Trace): NormalDrivingRecord {
  let bad = 0, maxSideslipRad = 0;
  for (const t of lap.telemetry) {
    if (loose(t.handling)) bad++;
    maxSideslipRad = Math.max(maxSideslipRad, t.sideslipRad);
  }
  return judge({ ...common(o, 'SYNTHETIC_TRACK'), benchId: 'NORMAL_DRIVING', normalDrivingStepCount: lap.telemetry.length, oversteerOrSlidingStepCount: bad, maxSideslipRad });
}

const withDrift = (input: Input): Input => ({ throttle: input.throttle, brake: input.brake, steer: input.steer, drift: true });
const withoutDrift = (input: Input): Input => ({ throttle: input.throttle, brake: input.brake, steer: input.steer });
const SAME_FIELDS = ['positionXM', 'positionZM', 'speedMps', 'headingRad', 'handling', 'sideslipRad'] as const;
// Compares two executions step by step; a step present in only one of them counts as differing (DES-0004).
function compareRuns(a: Trace, b: Trace): { comparedStepCount: number; differingStepCount: number; firstDifferingStep?: number } {
  const n = Math.max(a.telemetry.length, b.telemetry.length);
  let differing = 0, first: number | undefined;
  for (let i = 0; i < n; i++) {
    const x = a.telemetry[i], y = b.telemetry[i];
    if (!x || !y || SAME_FIELDS.some(k => x[k] !== y[k])) { differing++; first ??= i + 1; }
  }
  return { comparedStepCount: n, differingStepCount: differing, ...(first !== undefined ? { firstDifferingStep: first } : {}) };
}

// DRIFT_INERT, lap sequence: the TEST_PILOT_LAP Input sequence replayed by startLap/stepLap without and with drift: true.
function driftInertLap(o: BenchOptions, sequence: readonly Input[]): { record: DriftInertRecord; traces: Trace[] } {
  const config = setupConfig(o);
  const replay = (map: (i: Input) => Input): Trace => {
    const trace = newTrace();
    let lap = startSyntheticLap(o, config);
    for (const input of sequence) {
      const applied = map(input);
      lap = stepLap(lap, applied);
      trace.inputs.push(applied); trace.states.push(lap.kart); trace.telemetry.push(telemetryOf(lap.kart, o));
    }
    return trace;
  };
  const without = replay(withoutDrift), withCommand = replay(withDrift);
  const record = judge<DriftInertRecord>({ ...common(o, 'SYNTHETIC_TRACK'), benchId: 'DRIFT_INERT', ...compareRuns(without, withCommand) });
  return { record, traces: [without, withCommand] };
}

// DRIFT_INERT, recovery sequence: the Input sequence of REAR_RECOVERY side +1 replayed by step on the open pad, without and
// with drift: true; each run stops at its own exit; the area fields are those of the run with the command.
function driftInertRecovery(o: BenchOptions, sequence: readonly Input[]): { record: DriftInertRecord; traces: Trace[] } {
  const config = setupConfig(o);
  const replay = (map: (i: Input) => Input): { trace: Trace; exit?: Exit } => {
    const trace = newTrace();
    let state = straight(BENCH_PARAMETERS.forcingSpeedMps);
    for (const input of sequence) {
      state = advance(state, config, padEnvironment, o, trace, map(input));
      const t = lastOf(trace);
      if (t.surface === 'GRASS') return { trace, exit: exitOf(t) };
    }
    return { trace };
  };
  const without = replay(withoutDrift), withCommand = replay(withDrift);
  const record = judge<DriftInertRecord>({
    ...common(o, 'TEST_PAD'), benchId: 'DRIFT_INERT', ...compareRuns(without.trace, withCommand.trace),
    ...padFields(BENCH_PARAMETERS.testAreaRadiusM, withCommand.exit),
  });
  return { record, traces: [without.trace, withCommand.trace] };
}

// ----------------------------------------------------------------------------- suite and aggregates

// Every simulation bench once, with its traces grouped by environment and labelled by benchId; the building block of
// SPEED_CAP, DETERMINISM and REALISTA_UNCHANGED.
type Labelled = { benchId: BenchId; trace: Trace; startSpeedMps: number };
type Suite = { records: BenchRecord[]; traces: Record<BenchEnvironment, Labelled[]>; lap: LapSession };
const steerSides = (mode: InputMode) => mode === 'PROPORTIONAL' ? [1, -1, BENCH_PARAMETERS.steerInputNormPartial, -BENCH_PARAMETERS.steerInputNormPartial] : [1, -1];
const order = (id: BenchId) => SIMULATION_BENCHES.indexOf(id);
function runSuite(o: BenchOptions): Suite {
  const records: BenchRecord[] = [];
  const traces: Record<BenchEnvironment, Labelled[]> = { TEST_PAD: [], SYNTHETIC_TRACK: [] };
  const keep = (env: BenchEnvironment, benchId: BenchId, trace: Trace, startSpeedMps: number) => traces[env].push({ benchId, trace, startSpeedMps });
  for (const side of steerSides(o.inputMode)) { const r = steerResponse(o, side); records.push(r.record); keep('TEST_PAD', 'STEER_RESPONSE', r.trace, BENCH_PARAMETERS.targetSpeedMps); }
  for (const entry of CORNER_ENTRY_SPEEDS_MPS) for (const side of [1, -1]) { const r = cornerRadius(o, entry, side); records.push(r.record); keep('TEST_PAD', 'CORNER_RADIUS', r.trace, entry); }
  for (const side of [1, -1]) { const r = cornerTurn(o, side); records.push(r.record); keep('TEST_PAD', 'CORNER_TURN', r.trace, FIFTY_KMH_MPS); }
  const rear = [1, -1].map(side => rearRecovery(o, side));
  for (const r of rear) { records.push(r.record); keep('TEST_PAD', 'REAR_RECOVERY', r.trace, BENCH_PARAMETERS.forcingSpeedMps); }
  const line = straightLine(o); records.push(line.acceleration, line.topSpeed); keep('TEST_PAD', 'ACCELERATION', line.trace, 0);
  for (const entry of [line.final.speed, FIFTY_KMH_MPS]) { const r = grassLoss(o, entry); records.push(r.record); keep('SYNTHETIC_TRACK', 'GRASS_LOSS', r.trace, entry); }
  const wall = wallContact(o); records.push(wall.record); keep('SYNTHETIC_TRACK', 'WALL_CONTACT', wall.trace, 0);
  const lap = testPilotLap(o); records.push(lap.record); keep('SYNTHETIC_TRACK', 'TEST_PILOT_LAP', lap.trace, 0);
  records.push(normalDriving(o, lap.trace));
  const inertLap = driftInertLap(o, lap.sequence);
  const inertRecovery = driftInertRecovery(o, rear[0].trace.inputs);
  records.push(inertLap.record, inertRecovery.record);
  for (const t of inertLap.traces) keep('SYNTHETIC_TRACK', 'DRIFT_INERT', t, 0);
  for (const t of inertRecovery.traces) keep('TEST_PAD', 'DRIFT_INERT', t, BENCH_PARAMETERS.forcingSpeedMps);
  records.push(speedCap(o, traces, line.topSpeed));
  records.sort((a, b) => order(a.benchId) - order(b.benchId));
  return { records, traces, lap: lap.lap };
}

// SPEED_CAP: no step of its own; the highest speed after any step of the traces that start at or below topSpeedMps.
function speedCap(o: BenchOptions, traces: Record<BenchEnvironment, Labelled[]>, topSpeed: TopSpeedRecord | undefined): SpeedCapRecord {
  const top = topSpeed?.topSpeedMps;
  const covered = [...traces.TEST_PAD, ...traces.SYNTHETIC_TRACK]
    .filter(l => top === undefined || l.startSpeedMps <= top)
    .sort((a, b) => order(a.benchId) - order(b.benchId));
  let max = -Infinity, at: BenchId = 'STEER_RESPONSE';
  for (const l of covered) for (const t of l.trace.telemetry) if (t.speedMps > max) { max = t.speedMps; at = l.benchId; }
  return judge<SpeedCapRecord>({
    ...common(o, 'SYNTHETIC_TRACK'), benchId: 'SPEED_CAP', maxObservedSpeedMps: max === -Infinity ? 0 : max, maxObservedBenchId: at,
    ...(top !== undefined ? { topSpeedMps: top } : {}),
  });
}

// The area fields of an aggregated TEST_PAD record (DETERMINISM, REALISTA_UNCHANGED): the largest declared area, the sum of
// the exits, and the first exit of the first covered record, in suite order, that has one.
function aggregatedPadFields(records: readonly BenchRecord[]): TestPadFields {
  const pad = records.filter(r => r.benchEnvironment === 'TEST_PAD' && r.benchId !== 'DETERMINISM' && typeof (r as Partial<TestPadFields>).testAreaRadiusM === 'number') as (BenchRecord & TestPadFields)[];
  const first = pad.find(r => r.offAsphaltStepCount > 0);
  return {
    testAreaRadiusM: pad.reduce((m, r) => Math.max(m, r.testAreaRadiusM), 0),
    offAsphaltStepCount: pad.reduce((s, r) => s + r.offAsphaltStepCount, 0),
    ...(first ? { offAsphaltFirstStep: first.offAsphaltFirstStep, offAsphaltFirstXM: first.offAsphaltFirstXM, offAsphaltFirstZM: first.offAsphaltFirstZM } : {}),
  };
}

// DETERMINISM per environment: the benches of the environment (and the lap on the synthetic track) run runCount times.
function determinism(o: BenchOptions, first: Suite): DeterminismRecord[] {
  const identical: Record<BenchEnvironment, boolean> = { TEST_PAD: true, SYNTHETIC_TRACK: true };
  for (let run = 1; run < BENCH_PARAMETERS.runCount; run++) {
    const again = runSuite(o);
    for (const env of ENVIRONMENTS) {
      identical[env] &&= again.traces[env].length === first.traces[env].length
        && again.traces[env].every((t, i) => deepEqual(t.trace.states, first.traces[env][i].trace.states));
    }
    identical.SYNTHETIC_TRACK &&= deepEqual(getLapResult(again.lap), getLapResult(first.lap));
  }
  return ENVIRONMENTS.map(env => judge<DeterminismRecord>({
    ...common(o, env), benchId: 'DETERMINISM', runCount: BENCH_PARAMETERS.runCount, identical: identical[env],
    ...(env === 'TEST_PAD' ? aggregatedPadFields(first.records) : {}),
  }));
}

function stepCost(o: BenchOptions): StepCostRecord {
  if (!o.stepCost) throw new Error('STEP_COST needs options.stepCost measured by the bench program');
  const base = o.baseline && o.baseline.runtimeId === o.stepCost.runtimeId
    ? baselineRecord<StepCostRecord>(o.baseline, 'STEP_COST', r => r.inputMode === o.inputMode) : undefined;
  return judge({
    ...common(o, 'SYNTHETIC_TRACK'), benchId: 'STEP_COST', baselineAvailable: base !== undefined, meanStepCostUs: o.stepCost.meanStepCostUs,
    ...(base !== undefined ? { baselineMeanStepCostUs: base.meanStepCostUs } : {}),
  });
}

// Minimal old-shape records (no setupId, no setupVersion, no replayFormatVersion), used when the caller passes none.
export function builtInOldRecords(): unknown[] {
  return [
    { trackId: 'synthetic', trackVersion: 2, lapKind: 'TRAINING', inputs: [{ throttle: 1, brake: 0, steer: 0 }, { throttle: 1, brake: 0, steer: -1 }] },
    { trackId: 'synthetic', trackVersion: 2, lapKind: 'TRAINING', lapValidity: 'VALID', official: false, lapMs: 31400, sectorMs: [8000, 7800, 7600, 8000] },
  ];
}

function setupVersion(o: BenchOptions): SetupVersionRecord {
  const s = o.setup;
  const old = o.oldRecords ?? builtInOldRecords();
  let ok = 0;
  for (const r of old) {
    if (typeof r === 'object' && r !== null && 'inputs' in r) {
      const read = readReplay(r);
      if (read.replayStatus === 'READABLE' && read.setupVersionSource === 'RESOLVED_FROM_ABSENCE') ok++;
    } else if (typeof r === 'object' && r !== null) {
      const rec = r as { setupId?: unknown; setupVersion?: unknown; trackId?: unknown; trackVersion?: unknown };
      const compared = compareLapRecords(rec, rec);
      if (!('code' in compared) && resolveSetupRef(rec).setupVersionSource === 'RESOLVED_FROM_ABSENCE') ok++;
    }
  }
  return judge({
    ...common(o, 'SYNTHETIC_TRACK'), benchId: 'SETUP_VERSION', declaredSetupVersion: s.setupVersion, previousSetupVersion: s.previousSetupVersion ?? '',
    oldRecordsReadCount: old.length, oldRecordsReadOkCount: ok,
  });
}

const INPUT_LINE = "export type Input = { throttle: number; brake: number; steer: number; drift?: boolean };";
function stepContract(o: BenchOptions): StepContractRecord {
  let source = '';
  try { source = readFileSync(new URL('../src/physics.ts', import.meta.url), 'utf8'); } catch { source = ''; }
  return judge({
    ...common(o, 'SYNTHETIC_TRACK'), benchId: 'STEP_CONTRACT',
    stepUnchanged: 1 / STEP === 120,
    solverRateUnchanged: 120 * SOLVER_SUBSTEPS === 480 && /Math\.ceil\(dt \/ \(STEP \/ SOLVER_SUBSTEPS\)\)/.test(source),
    inputFieldsUnchanged: source.split('\n').some(l => l === INPUT_LINE),
  });
}

// Baseline resolution (DM-0001 section 5): same bench, environment, inputMode and variant (steerInputNorm and entrySpeedMps
// when the record has them). Never a record from another environment.
export function sameSetting(current: BenchRecord): (candidate: BenchRecord) => boolean {
  const c = current as Record<string, unknown>;
  return (r) => {
    const b = r as Record<string, unknown>;
    if (r.benchId !== current.benchId || r.benchEnvironment !== current.benchEnvironment || r.inputMode !== current.inputMode) return false;
    for (const k of ['steerInputNorm', 'entrySpeedMps']) {
      if (typeof c[k] === 'number' && !(typeof b[k] === 'number' && Math.abs((c[k] as number) - (b[k] as number)) < 1e-9)) return false;
    }
    return true;
  };
}
export function baselineRecord<T extends BenchRecord>(baseline: Baseline | undefined, benchId: BenchId, match: (r: BenchRecord) => boolean = () => true): T | undefined {
  return baseline?.records.find(r => r.benchId === benchId && match(r)) as T | undefined;
}

const MEASURE_EXCLUDED = new Set(['measuredAtUtc', 'meanStepCostUs']);
// Numeric, boolean and list fields that differ between a record and its baseline counterpart (same benchId,
// benchEnvironment, inputMode and variant); a missing counterpart counts once.
export function countDifferingMeasures(current: readonly BenchRecord[], baseline: readonly BenchRecord[]): number {
  let count = 0;
  for (const r of current) {
    const b = baseline.find(sameSetting(r));
    if (!b) { count++; continue; }
    for (const [k, v] of Object.entries(r)) {
      if (MEASURE_EXCLUDED.has(k)) continue;
      const w = (b as Record<string, unknown>)[k];
      if (typeof v === 'number' || typeof v === 'boolean' || Array.isArray(v)) { if (!deepEqual(v, w)) count++; }
    }
  }
  return count;
}

// REALISTA_UNCHANGED per environment: every bench of the environment with RENTAL_KART, in both input modes, compared
// record by record with the Realista entry; assists counted over the traces of the environment.
function realistaUnchanged(o: BenchOptions): RealistaUnchangedRecord[] {
  const realista = PUBLISHED_SETUPS.REALISTA_ALUGUEL_4T;
  const records: Record<BenchEnvironment, BenchRecord[]> = { TEST_PAD: [], SYNTHETIC_TRACK: [] };
  const assists: Record<BenchEnvironment, number> = { TEST_PAD: 0, SYNTHETIC_TRACK: 0 };
  for (const inputMode of ['BINARY', 'PROPORTIONAL'] as const) {
    const inner: BenchOptions = { setup: realista, version: 'current', inputMode, measuredAtUtc: o.measuredAtUtc };
    const suite = runSuite(inner);
    const det = determinism(inner, suite);
    for (const env of ENVIRONMENTS) {
      records[env].push(...suite.records.filter(r => r.benchEnvironment === env), ...det.filter(r => r.benchEnvironment === env));
      for (const l of suite.traces[env]) for (const s of l.trace.states) if (s.telemetry.assistActive) assists[env]++;
    }
  }
  const base = o.realistaBaseline;
  return ENVIRONMENTS.map(env => judge<RealistaUnchangedRecord>({
    ...common(o, env), benchId: 'REALISTA_UNCHANGED', baselineAvailable: base !== undefined,
    differingMeasureCount: base ? countDifferingMeasures(records[env], base.records.filter(r => r.benchEnvironment === env)) : 0,
    arcadeAssistActiveCount: assists[env],
    ...(env === 'TEST_PAD' ? aggregatedPadFields(records.TEST_PAD) : {}),
  }));
}

// ----------------------------------------------------------------------------- verdicts (single source)

// Recomputes verdict and failReason from the measured fields of a record and, only for GRASS_LOSS, from what the bench
// observed in its trace (RULE-0002, in the order of the verdict table of DES-0004), so that a test judges a synthetic
// record the same way the bench does. A TEST_PAD record that left its declared area fails first with TEST_AREA_EXCEEDED.
export function judge<T extends BenchRecord>(input: T, observed?: Observed): T {
  const r: T = { ...input };
  delete (r as { failReason?: FailReason }).failReason;
  let fail: FailReason | undefined;
  const area = (r as Partial<TestPadFields>).offAsphaltStepCount;
  if (r.benchEnvironment === 'TEST_PAD' && typeof area === 'number' && area > 0) fail = 'TEST_AREA_EXCEEDED';
  else switch (r.benchId) {
    case 'STEER_RESPONSE': {
      const low = r.targetSpeedMps - r.speedHoldBandMps, high = r.targetSpeedMps + r.speedHoldBandMps;
      if (r.speedMinMps < low || r.speedMaxMps > high) fail = 'SPEED_NOT_HELD';
      else if (r.riseToNinetyPctMs > THRESHOLDS.riseToNinetyPctMs || r.fallToTenPctMs > THRESHOLDS.fallToTenPctMs) fail = 'THRESHOLD_EXCEEDED';
      break;
    }
    case 'CORNER_RADIUS':
      // With the kart stopped the radius is not defined; the handling state never enters the verdict.
      if (r.stoppedAtStep !== undefined || r.pathRadiusAt3sM === undefined) fail = 'MEASUREMENT_MISSING';
      else if (r.pathRadiusAt3sM > THRESHOLDS.pathRadiusM) fail = 'THRESHOLD_EXCEEDED';
      break;
    case 'CORNER_TURN':
      if (r.halfTurnReachedMs === undefined || r.halfTurnReachedMs > THRESHOLDS.turnWithinMs) fail = 'THRESHOLD_EXCEEDED';
      break;
    case 'NORMAL_DRIVING':
      if (r.oversteerOrSlidingStepCount > 0 || r.maxSideslipRad > THRESHOLDS.maxSideslipRad) fail = 'THRESHOLD_EXCEEDED';
      break;
    case 'REAR_RECOVERY':
      // A rear that does not let go is not a failure: no criterion requires it to (REQ-FEAT-0003-17).
      if (r.rearReleased && (!r.gripReached || r.recoveryMs === undefined || r.recoveryMs > THRESHOLDS.recoveryMs
        || (r.maxSideslipRad ?? 0) > THRESHOLDS.maxSideslipRad)) fail = 'THRESHOLD_EXCEEDED';
      break;
    case 'DRIFT_INERT':
      if (r.differingStepCount > 0) fail = 'THRESHOLD_EXCEEDED';
      break;
    case 'SPEED_CAP':
      if (r.topSpeedMps === undefined) fail = 'MEASUREMENT_MISSING';
      else if (r.maxObservedSpeedMps > r.topSpeedMps) fail = 'THRESHOLD_EXCEEDED';
      break;
    case 'ACCELERATION':
      if (r.zeroToSixtyKmhMs > THRESHOLDS.zeroToSixtyKmhMs) fail = 'THRESHOLD_EXCEEDED';
      break;
    case 'TOP_SPEED':
      if (r.topSpeedMps < THRESHOLDS.topSpeedMinMps || r.topSpeedMps > THRESHOLDS.topSpeedMaxMps) fail = 'THRESHOLD_EXCEEDED';
      break;
    case 'GRASS_LOSS':
      if (observed === 'THRESHOLD_EXCEEDED' || r.speedAfterOneSMps > THRESHOLDS.grassSpeedRatio * r.entrySpeedMps) fail = 'THRESHOLD_EXCEEDED';
      break;
    case 'WALL_CONTACT':
      if (r.contacts.length === 0) fail = 'MEASUREMENT_MISSING';
      else if (r.contacts.some(([before, after]) => !(after < before))) fail = 'THRESHOLD_EXCEEDED';
      break;
    case 'DETERMINISM':
      if (!r.identical) fail = 'NON_DETERMINISTIC';
      break;
    case 'TEST_PILOT_LAP':
      if (r.offAsphaltStepCount > 0) fail = 'OFF_ASPHALT';
      else if (r.lapTimeMs > THRESHOLDS.lapTimeMs) fail = 'THRESHOLD_EXCEEDED';
      break;
    case 'STEP_COST':
      if (!r.baselineAvailable || r.baselineMeanStepCostUs === undefined) fail = 'BASELINE_MISSING';
      else if (r.meanStepCostUs > THRESHOLDS.stepCostRatio * r.baselineMeanStepCostUs) fail = 'THRESHOLD_EXCEEDED';
      break;
    case 'SETUP_VERSION':
      if (r.declaredSetupVersion === r.previousSetupVersion || r.oldRecordsReadOkCount !== r.oldRecordsReadCount) fail = 'THRESHOLD_EXCEEDED';
      break;
    case 'STEP_CONTRACT':
      if (!(r.stepUnchanged && r.solverRateUnchanged && r.inputFieldsUnchanged)) fail = 'CONTRACT_CHANGED';
      break;
    case 'REALISTA_UNCHANGED':
      if (!r.baselineAvailable) fail = 'BASELINE_MISSING';
      else if (r.differingMeasureCount !== 0 || r.arcadeAssistActiveCount !== 0) fail = 'CONTRACT_CHANGED';
      break;
  }
  r.verdict = fail ? 'FAIL' : 'PASS';
  if (fail) (r as { failReason?: FailReason }).failReason = fail;
  const notes = DIAGNOSTICS.get(input);
  if (notes) DIAGNOSTICS.set(r, notes);
  return r;
}

// ----------------------------------------------------------------------------- public entry points (API-0003)

// baselineAvailable of every record (API-0003): STEP_COST and REALISTA_UNCHANGED decide it themselves; the others have a
// record of the same bench, environment, inputMode and variant in the entry of the previous version. Informative only.
function withBaselineAvailable(records: readonly BenchRecord[], options: BenchOptions): BenchRecord[] {
  return records.map(r => {
    if (r.benchId === 'STEP_COST' || r.benchId === 'REALISTA_UNCHANGED') return r;
    const available = baselineRecord(options.baseline, r.benchId, sameSetting(r)) !== undefined;
    if (available === r.baselineAvailable) return r;
    const next = { ...r, baselineAvailable: available };
    const notes = DIAGNOSTICS.get(r);
    if (notes) DIAGNOSTICS.set(next, notes);
    return next;
  });
}

export function runBench(benchId: BenchId, options: BenchOptions): BenchRecord[] {
  switch (benchId) {
    case 'STEP_COST': return [stepCost(options)];
    case 'SETUP_VERSION': return [setupVersion(options)];
    case 'STEP_CONTRACT': return [stepContract(options)];
    case 'REALISTA_UNCHANGED': return realistaUnchanged(options);
    case 'ACCELERATION': return [straightLine(options).acceleration];
    case 'TOP_SPEED': return [straightLine(options).topSpeed];
    case 'GRASS_LOSS': { const line = straightLine(options); return [line.final.speed, FIFTY_KMH_MPS].map(e => grassLoss(options, e).record); }
    case 'WALL_CONTACT': return [wallContact(options).record];
    case 'DETERMINISM': return determinism(options, runSuite(options));
    default: return runSuite(options).records.filter(r => r.benchId === benchId);
  }
}

// All benches (or the requested ones) for one setup, version and input mode; STEP_COST only with options.stepCost.
// Zero benches requested gives an empty list, never an implicit PASS.
export function handlingBenchReport(options: BenchOptions, benchIds?: readonly BenchId[]): BenchRecord[] {
  const wanted = benchIds ?? ALL_BENCHES;
  const records: BenchRecord[] = [];
  const needsSuite = wanted.some(b => SIMULATION_BENCHES.includes(b));
  const suite = needsSuite ? runSuite(options) : undefined;
  for (const id of wanted) {
    if (id === 'STEP_COST' && !options.stepCost) continue;
    if (suite && id === 'DETERMINISM') records.push(...determinism(options, suite));
    else if (suite && SIMULATION_BENCHES.includes(id)) records.push(...suite.records.filter(r => r.benchId === id));
    else records.push(...runBench(id, options));
  }
  return withBaselineAvailable(records, options);
}

// The test-pilot lap under a different controller (a deliberately offset pilot in the tests).
export function testPilotLapWith(options: BenchOptions, controller: Controller): TestPilotLapRecord {
  return testPilotLap(options, controller).record;
}

// ----------------------------------------------------------------------------- baseline (DM-0001 section 5, ADR-0003)

const BLOCK_RE = /```json handling-baseline\s*\n([\s\S]*?)\n```/;
export function readBaseline(markdownText: string, setupId: SetupId, setupVersion: string, runtimeId?: string): Baseline | undefined {
  const m = BLOCK_RE.exec(markdownText);
  if (!m) return undefined;
  let parsed: unknown;
  try { parsed = JSON.parse(m[1]); } catch { return undefined; }
  if (typeof parsed !== 'object' || parsed === null || !Array.isArray((parsed as { entries?: unknown }).entries)) return undefined;
  const entries = (parsed as { entries: unknown[] }).entries;
  const hit = entries.find(e => typeof e === 'object' && e !== null
    && (e as Baseline).setupId === setupId && (e as Baseline).setupVersion === setupVersion
    && (runtimeId === undefined || (e as Baseline).runtimeId === runtimeId) && Array.isArray((e as Baseline).records));
  return hit as Baseline | undefined;
}

// Reads docs/physics.md relative to the repository root; '' when absent. The path is never printed.
export function loadBaselineText(): string {
  try { return readFileSync(new URL('../docs/physics.md', import.meta.url), 'utf8'); } catch { return ''; }
}

export function baselineEntry(records: readonly BenchRecord[], setupId: SetupId, setupVersion: string, measuredAtUtc: string, runtimeId?: string, parameters?: Record<string, unknown>): Baseline {
  return { setupId, setupVersion, measuredAtUtc, ...(runtimeId !== undefined ? { runtimeId } : {}), ...(parameters !== undefined ? { parameters } : {}), records: [...records] };
}

// ----------------------------------------------------------------------------- serialization (API-0003)

const kmh = (v: number) => +(v * 3.6).toFixed(2);
function presentation(r: BenchRecord): string | undefined {
  const parts: string[] = [];
  for (const [k, v] of Object.entries(r)) {
    if (k === 'zeroToSixtyKmhMs' && typeof v === 'number') parts.push(`${k} ${(v / 1000).toFixed(3)} s`);
    else if (k === 'turnAt2sRad' && typeof v === 'number') parts.push(`${k} ${(v * 180 / Math.PI).toFixed(1)}°`);
    else if (k.endsWith('Mps') && typeof v === 'number') parts.push(`${k} ${kmh(v)} km/h`);
    else if (k === 'contacts' && Array.isArray(v)) parts.push(`contacts ${(v as [number, number][]).map(([a, b]) => `${kmh(a)}>${kmh(b)}`).join(' ')} km/h`);
  }
  parts.push(...diagnosticsOf(r));
  return parts.length ? `# ${r.benchId} ${parts.join(' · ')}` : undefined;
}

export function serialize(records: readonly BenchRecord[], parameters: object): string {
  const lines = [`# ${JSON.stringify({ parameters })}`];
  for (const r of records) {
    lines.push(JSON.stringify(r));
    const p = presentation(r);
    if (p) lines.push(p);
  }
  return lines.join('\n');
}
