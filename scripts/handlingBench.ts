// Handling bench library (DES-0004, ADR-0003, ADR-0004, ADR-0005, API-0003, RULE-0002): the records of every handling
// bench, shared by npm test, bench:handling and bench:physics. Simulation layer in the tree role `scripts/`:
// advances the simulation with STEP only; never reads a clock, node:perf_hooks or node:os. Wall-clock values
// (measuredAtUtc, stepCost) come from the caller. node:fs is used only to read docs/physics.md and src/physics.ts.
import { readFileSync } from 'node:fs';
import {
  CIRCUIT, classifyHandlingSteps, getHandlingTelemetry, initialState, PUBLISHED_SETUPS, SOLVER_SUBSTEPS, step, STEP, TEST_PAD,
  testPadArc, testPadLane,
  type Environment, type HandlingTelemetry, type Input, type KartConfig, type PublishedSetup, type SetupId, type State,
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
  laneWidthM: WIDTH, arcRadiusM: 18, cornerWindowMs: 2500,
  entrySpeedStepMps: 0.5, plateauMs: 1000, plateauSpeedHoldMode: 'THROTTLE_REGULATED' as const, entrySpeedMaxMps: 25,
  forcingSpeedMps: 16.7, forcingWindowMs: 3000,
  grassEntryIndex: 83, grassEntryOffsetM: 0.2, grassEntryAngleRad: 0.15, grassWindowMs: 1000,
  wallApproachRad: 0.6, wallWindowMs: 10000, topSpeedWindowMs: 60000,
  maxSpeedMps: 26, lateralBudgetMps2: 9.5, driverMassKg: 75, runCount: 2,
});
export const MAX_LAP_STEPS = 6000;
export const PILOT_DECISION_STEPS = 12;

// Thresholds of RULE-0002 (DOMAIN/REF-02), compared in the unit of the measured field without rounding it.
export const THRESHOLDS = Object.freeze({
  riseToNinetyPctMs: 180, fallToTenPctMs: 250, maxUndersteerMs: 200, recoveryMs: 400, maxSideslipRad: 0.65,
  zeroToSixtyKmhMs: 2500, topSpeedMps: 105 / 3.6, grassSpeedRatio: 0.70, lapTimeMs: 25000,
  understeerOnsetRatio: 1.15, stepCostRatio: 1.10,
});
const SIXTY_KMH_MPS = 60 / 3.6;
const FIFTY_KMH_MPS = 50 / 3.6;
const msToSteps = (ms: number) => Math.round(ms / 1000 / STEP);

// ----------------------------------------------------------------------------- records (API-0003)

export type BenchId =
  | 'STEER_RESPONSE' | 'REFERENCE_CORNER' | 'UNDERSTEER_ONSET' | 'NORMAL_DRIVING' | 'REAR_RECOVERY' | 'DRIFT_MANEUVER'
  | 'ACCELERATION' | 'TOP_SPEED' | 'GRASS_LOSS' | 'WALL_CONTACT' | 'DETERMINISM' | 'TEST_PILOT_LAP' | 'STEP_COST'
  | 'SETUP_VERSION' | 'STEP_CONTRACT' | 'REALISTA_UNCHANGED';
export type BenchEnvironment = 'TEST_PAD' | 'SYNTHETIC_TRACK';
export type InputMode = 'BINARY' | 'PROPORTIONAL';
export type Verdict = 'PASS' | 'FAIL';
export type FailReason = 'THRESHOLD_EXCEEDED' | 'BASELINE_MISSING' | 'OFF_ASPHALT' | 'NON_DETERMINISTIC' | 'CONTRACT_CHANGED'
  | 'SPEED_NOT_HELD' | 'MEASUREMENT_MISSING';
export type ThrottleCondition = 'THROTTLE_ZERO' | 'THROTTLE_FULL';
export type SpeedHoldMode = 'THROTTLE_CONSTANT' | 'THROTTLE_REGULATED';
// What a bench saw in its trace and no field of API-0003 carries; the second argument of judge (ADR-0004, decision 3).
export type Observed = 'OFF_ASPHALT' | 'THRESHOLD_EXCEEDED';

export type BenchCommon = {
  benchEnvironment: BenchEnvironment; setupId: SetupId; setupVersion: string; inputMode: InputMode;
  verdict: Verdict; failReason?: FailReason; measuredAtUtc: string; baselineAvailable: boolean;
};
type OffAsphalt = { offAsphaltStepCount: number; offAsphaltFirstStep?: number; offAsphaltFirstXM?: number; offAsphaltFirstZM?: number };
type ArcGeometry = { arcRadiusM: number; laneWidthM: number };
export type SteerResponseRecord = BenchCommon & { benchId: 'STEER_RESPONSE'; steerInputNorm: number; targetSpeedMps: number;
  speedHoldMode: SpeedHoldMode; throttleInputNorm?: number; speedHoldBandMps: number; speedMinMps: number; speedMaxMps: number;
  riseToNinetyPctMs: number; fallToTenPctMs: number; settleWindowMs: number; steadyYawRateRadPerS: number; understeerStepCount: number };
export type ReferenceCornerRecord = BenchCommon & ArcGeometry & OffAsphalt & { benchId: 'REFERENCE_CORNER'; throttleCondition: ThrottleCondition;
  maxUndersteerMs: number; entrySpeedMps: number };
export type UndersteerOnsetRecord = BenchCommon & ArcGeometry & OffAsphalt & { benchId: 'UNDERSTEER_ONSET'; v0Mps?: number; v1Mps?: number;
  entrySpeedStepMps: number; maxUndersteerMsBySpeed: [number, number][] };
export type NormalDrivingRecord = BenchCommon & { benchId: 'NORMAL_DRIVING'; normalDrivingStepCount: number; excludedRecoveryStepCount: number;
  oversteerOrSlidingStepCount: number; maxSideslipRad: number };
export type RearRecoveryRecord = BenchCommon & ArcGeometry & OffAsphalt & { benchId: 'REAR_RECOVERY'; gripReached: boolean; recoveryMs?: number;
  maxSideslipRad: number };
export type DriftManeuverRecord = BenchCommon & { benchId: 'DRIFT_MANEUVER'; driftScorePoints: number };
export type AccelerationRecord = BenchCommon & { benchId: 'ACCELERATION'; zeroToSixtyKmhMs: number; driverMassKg: number };
export type TopSpeedRecord = BenchCommon & { benchId: 'TOP_SPEED'; topSpeedMps: number };
export type GrassLossRecord = BenchCommon & { benchId: 'GRASS_LOSS'; entrySpeedMps: number; speedAfterOneSMps: number };
export type WallContactRecord = BenchCommon & { benchId: 'WALL_CONTACT'; contacts: [number, number][] };
export type DeterminismRecord = BenchCommon & { benchId: 'DETERMINISM'; runCount: number; identical: boolean };
export type TestPilotLapRecord = BenchCommon & OffAsphalt & { benchId: 'TEST_PILOT_LAP'; lapTimeMs: number; sectorMs: number[]; baselineLapTimeMs?: number };
export type StepCostRecord = BenchCommon & { benchId: 'STEP_COST'; meanStepCostUs: number; baselineMeanStepCostUs?: number };
export type SetupVersionRecord = BenchCommon & { benchId: 'SETUP_VERSION'; declaredSetupVersion: string; previousSetupVersion: string;
  oldRecordsReadCount: number; oldRecordsReadOkCount: number };
export type StepContractRecord = BenchCommon & { benchId: 'STEP_CONTRACT'; stepUnchanged: boolean; solverRateUnchanged: boolean; inputFieldsUnchanged: boolean };
export type RealistaUnchangedRecord = BenchCommon & { benchId: 'REALISTA_UNCHANGED'; differingMeasureCount: number; arcadeAssistActiveCount: number };
export type BenchRecord =
  | SteerResponseRecord | ReferenceCornerRecord | UndersteerOnsetRecord | NormalDrivingRecord | RearRecoveryRecord | DriftManeuverRecord
  | AccelerationRecord | TopSpeedRecord | GrassLossRecord | WallContactRecord | DeterminismRecord | TestPilotLapRecord | StepCostRecord
  | SetupVersionRecord | StepContractRecord | RealistaUnchangedRecord;

export type Baseline = { setupId: SetupId; setupVersion: string; measuredAtUtc: string; runtimeId?: string; parameters?: Record<string, unknown>; records: BenchRecord[] };
export type BenchOptions = {
  setup: PublishedSetup; version: 'current' | 'previous'; inputMode: InputMode;
  baseline?: Baseline; realistaBaseline?: Baseline; oldRecords?: readonly unknown[]; measuredAtUtc: string;
  stepCost?: { meanStepCostUs: number; runtimeId: string };
};

export const SIMULATION_BENCHES: readonly BenchId[] = Object.freeze([
  'STEER_RESPONSE', 'REFERENCE_CORNER', 'UNDERSTEER_ONSET', 'NORMAL_DRIVING', 'REAR_RECOVERY', 'DRIFT_MANEUVER',
  'ACCELERATION', 'TOP_SPEED', 'GRASS_LOSS', 'WALL_CONTACT', 'DETERMINISM', 'TEST_PILOT_LAP',
]);
export const ALL_BENCHES: readonly BenchId[] = Object.freeze([...SIMULATION_BENCHES, 'STEP_COST', 'SETUP_VERSION', 'STEP_CONTRACT', 'REALISTA_UNCHANGED']);
const ENVIRONMENTS: readonly BenchEnvironment[] = Object.freeze(['TEST_PAD', 'SYNTHETIC_TRACK']);

// ----------------------------------------------------------------------------- environments and helpers

export const laneEnvironment: Environment = testPadLane(BENCH_PARAMETERS.laneWidthM);
export const arcEnvironment: Environment = testPadArc(BENCH_PARAMETERS.arcRadiusM, BENCH_PARAMETERS.laneWidthM);

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
const arcGeometry = (): ArcGeometry => ({ arcRadiusM: BENCH_PARAMETERS.arcRadiusM, laneWidthM: BENCH_PARAMETERS.laneWidthM });
// The regulated throttle of ADR-0005, decision 2: 1 while the previous speed is below the target, else 0; binary by construction.
const regulated = (previousSpeedMps: number, targetMps: number) => previousSpeedMps < targetMps ? 1 : 0;

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

// "Straight at V": the fixture of tests/physics.test.ts:5, on the axis of the lane of testPadLane.
export function straight(speedMps: number): State {
  return { ...initialState(), x: 0, z: 0, heading: 0, vx: 0, vz: speedMps, speed: speedMps };
}
// Entry of the arc: tangent to the ring at (arcRadiusM, 0), centre to the right of the kart, so steer +1 turns inward.
export function arcEntry(speedMps: number): State {
  return { ...initialState(), x: BENCH_PARAMETERS.arcRadiusM, z: 0, heading: 0, vx: 0, vz: speedMps, speed: speedMps };
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

// ----------------------------------------------------------------------------- test-pad benches

// STEER_RESPONSE: straight lane, speed held at 50 km/h by the regulated throttle; phase A holds the steer for holdMs,
// phase B releases it. The verdict depends only on the two times with the speed held (API-0003, AC-US-0001-05).
function steerResponse(o: BenchOptions, steerInputNorm: number): { record: SteerResponseRecord; trace: Trace } {
  const config = setupConfig(o), trace = newTrace();
  const hold = msToSteps(BENCH_PARAMETERS.holdMs), settle = msToSteps(BENCH_PARAMETERS.settleWindowMs);
  const target = BENCH_PARAMETERS.targetSpeedMps;
  let state = straight(target);
  let speedMin = Infinity, speedMax = -Infinity;
  for (let i = 0; i < hold; i++) {
    state = advance(state, config, laneEnvironment, o, trace, makeInput(o.inputMode, regulated(state.speed, target), 0, steerInputNorm));
    const v = lastOf(trace).speedMps;
    speedMin = Math.min(speedMin, v); speedMax = Math.max(speedMax, v);
  }
  const yaw = trace.telemetry.map(t => Math.abs(t.yawRateRadPerS));
  const steady = yaw.slice(hold - settle).reduce((a, b) => a + b, 0) / settle;
  let riseSteps = yaw.findIndex(y => y >= 0.9 * steady);
  riseSteps = riseSteps < 0 ? hold : riseSteps + 1;
  let fallSteps = hold;
  for (let i = 0; i < hold; i++) {
    state = advance(state, config, laneEnvironment, o, trace, makeInput(o.inputMode, regulated(state.speed, target), 0, 0));
    if (Math.abs(lastOf(trace).yawRateRadPerS) <= 0.1 * steady) { fallSteps = i + 1; break; }
  }
  const record: SteerResponseRecord = {
    ...common(o, 'TEST_PAD'), benchId: 'STEER_RESPONSE', steerInputNorm,
    targetSpeedMps: target, speedHoldMode: BENCH_PARAMETERS.speedHoldMode, speedHoldBandMps: BENCH_PARAMETERS.speedHoldBandMps,
    speedMinMps: speedMin, speedMaxMps: speedMax,
    riseToNinetyPctMs: toMs(riseSteps), fallToTenPctMs: toMs(fallSteps),
    settleWindowMs: BENCH_PARAMETERS.settleWindowMs, steadyYawRateRadPerS: steady,
    understeerStepCount: trace.telemetry.filter(t => t.handling === 'understeer').length,
  };
  return { record: judge(record), trace };
}

// REFERENCE_CORNER: the 18 m arc at 50 km/h, steer +1 held, throttle 0 or 1 held; stops at the first step off the lane.
function referenceCornerBench(o: BenchOptions, throttleCondition: ThrottleCondition): { record: ReferenceCornerRecord; trace: Trace } {
  const config = setupConfig(o), trace = newTrace();
  const input = makeInput(o.inputMode, throttleCondition === 'THROTTLE_FULL' ? 1 : 0, 0, 1);
  let state = arcEntry(FIFTY_KMH_MPS), run = 0, maxRun = 0, bad = 0, exit: Exit | undefined;
  for (let i = 0; i < msToSteps(BENCH_PARAMETERS.cornerWindowMs); i++) {
    state = advance(state, config, arcEnvironment, o, trace, input);
    const t = lastOf(trace);
    if (t.surface === 'GRASS') { exit = { step: t.simStepCount, x: state.x, z: state.z }; break; }
    run = t.handling === 'understeer' ? run + 1 : 0;
    maxRun = Math.max(maxRun, run);
    if (loose(t.handling)) bad++;
  }
  const record: ReferenceCornerRecord = {
    ...common(o, 'TEST_PAD'), benchId: 'REFERENCE_CORNER', throttleCondition, ...arcGeometry(),
    maxUndersteerMs: toMs(maxRun), ...exitFields(exit), entrySpeedMps: FIFTY_KMH_MPS,
  };
  const notes = throttleCondition === 'THROTTLE_FULL' ? [`oversteerOrSlidingStepCount ${bad}`] : [];
  const observed: Observed | undefined = throttleCondition === 'THROTTLE_FULL' && bad > 0 ? 'THRESHOLD_EXCEEDED' : undefined;
  if (observed) notes.push(`observed ${observed}: oversteer/sliding steps with full throttle`);
  return { record: withDiagnostics(judge(record, observed), notes), trace };
}

// Baseline resolution (DM-0001 section 5, ADR-0003 decision 3): same bench, environment, inputMode, variant and
// geometry; the caller adds what its bench needs. Never a record from another environment or another arc.
export function sameSetting(current: BenchRecord): (candidate: BenchRecord) => boolean {
  const c = current as Record<string, unknown>;
  return (r) => {
    const b = r as Record<string, unknown>;
    if (r.benchId !== current.benchId || r.benchEnvironment !== current.benchEnvironment || r.inputMode !== current.inputMode) return false;
    for (const k of ['throttleCondition', 'steerInputNorm']) if (c[k] !== b[k]) return false;
    for (const k of ['arcRadiusM', 'laneWidthM', 'entrySpeedStepMps', 'entrySpeedMps']) {
      if (typeof c[k] === 'number' && !(typeof b[k] === 'number' && Math.abs((c[k] as number) - (b[k] as number)) < 1e-9)) return false;
    }
    return true;
  };
}
export function baselineRecord<T extends BenchRecord>(baseline: Baseline | undefined, benchId: BenchId, match: (r: BenchRecord) => boolean = () => true): T | undefined {
  return baseline?.records.find(r => r.benchId === benchId && match(r)) as T | undefined;
}
// The UNDERSTEER_ONSET baseline is the same plateau sweep (plateauMs and plateauSpeedHoldMode in the entry's parameters)
// with V1 measured, whatever verdict the baseline run gave it (ADR-0003, decision 2).
function understeerBaselineRecord(baseline: Baseline | undefined, current: UndersteerOnsetRecord): UndersteerOnsetRecord | undefined {
  const p = baseline?.parameters;
  if (!p || p.plateauMs !== BENCH_PARAMETERS.plateauMs || p.plateauSpeedHoldMode !== BENCH_PARAMETERS.plateauSpeedHoldMode) return undefined;
  const same = sameSetting(current);
  return baselineRecord<UndersteerOnsetRecord>(baseline, 'UNDERSTEER_ONSET', r => same(r) && typeof (r as UndersteerOnsetRecord).v1Mps === 'number');
}

// UNDERSTEER_ONSET (ADR-0004, decision 8): one continuous run on the ring, steer +1 held, plateaus of held speed from
// 50 km/h in steps of entrySpeedStepMps; each plateau climbs to its target and holds it for plateauMs; the sweep ends at
// the first step off the lane, and the speed at that step decides (RULE-0002, "Fim da varredura"). The two results
// RULE-0002 does not decide make this throw instead of emitting a record.
function understeerOnset(o: BenchOptions): { record: UndersteerOnsetRecord; trace: Trace } {
  const config = setupConfig(o), trace = newTrace();
  const plateauSteps = msToSteps(BENCH_PARAMETERS.plateauMs), climbLimit = msToSteps(BENCH_PARAMETERS.topSpeedWindowMs);
  let state = arcEntry(FIFTY_KMH_MPS);
  let k = 0, target = FIFTY_KMH_MPS, holding = true, held = 0, run = 0, maxRun = 0, climbSteps = 0, flat = 0;
  const bySpeed: [number, number][] = [];
  let v1: number | undefined, completed = 0, exit: Exit | undefined, exitSpeed = 0;
  for (;;) {
    const before = state.speed;
    state = advance(state, config, arcEnvironment, o, trace, makeInput(o.inputMode, regulated(before, target), 0, 1));
    const t = lastOf(trace);
    if (t.surface === 'GRASS') { exit = { step: t.simStepCount, x: state.x, z: state.z }; exitSpeed = t.speedMps; break; }
    if (!holding) {
      climbSteps++;
      flat = Math.abs(t.speedMps - before) < 1e-6 ? flat + 1 : 0;
      if (flat >= 120 || climbSteps > climbLimit) throw new Error('UNDERSTEER_ONSET: sweep ended without leaving the lane (climb did not reach the target)');
      if (t.speedMps >= target) { holding = true; held = 0; run = 0; maxRun = 0; }
    }
    if (holding) {
      run = t.handling === 'understeer' ? run + 1 : 0;
      maxRun = Math.max(maxRun, run);
      held++;
      if (held >= plateauSteps) {
        const ms = toMs(maxRun);
        completed++;
        if (k >= 1) bySpeed.push([target, ms]);
        if (v1 === undefined && ms > THRESHOLDS.maxUndersteerMs) v1 = target;
        k++; target = FIFTY_KMH_MPS + k * BENCH_PARAMETERS.entrySpeedStepMps;
        if (target > BENCH_PARAMETERS.entrySpeedMaxMps) throw new Error('UNDERSTEER_ONSET: sweep ended without leaving the lane (last plateau completed)');
        holding = false; climbSteps = 0; flat = 0;
      }
    }
  }
  if (exitSpeed === FIFTY_KMH_MPS) throw new Error('UNDERSTEER_ONSET: lane left at exactly 50 km/h');
  const partial: UndersteerOnsetRecord = {
    ...common(o, 'TEST_PAD'), benchId: 'UNDERSTEER_ONSET', ...arcGeometry(),
    entrySpeedStepMps: BENCH_PARAMETERS.entrySpeedStepMps, maxUndersteerMsBySpeed: bySpeed, ...exitFields(exit),
    ...(v1 !== undefined ? { v1Mps: v1 } : {}),
  };
  const base = understeerBaselineRecord(o.baseline, partial);
  const record: UndersteerOnsetRecord = {
    ...partial, baselineAvailable: base !== undefined,
    ...(base !== undefined && base.v1Mps !== undefined ? { v0Mps: base.v1Mps } : {}),
  };
  const observed: Observed | undefined = exitSpeed < FIFTY_KMH_MPS ? 'OFF_ASPHALT' : undefined;
  const notes = [
    `exitSpeedMps ${exitSpeed} (${kmh(exitSpeed)} km/h)`, `interruptedPlateauSpeedMps ${target} (${kmh(target)} km/h)`,
    `completePlateauCount ${completed}`, `v1Measured ${v1 !== undefined}`,
  ];
  if (observed) notes.push(`observed ${observed}: lane left below 50 km/h`);
  return { record: withDiagnostics(judge(record, observed), notes), trace };
}

// REAR_RECOVERY: the arc at 60 km/h, throttle 1 and steer +1 until the rear lets go, then steer 0 with the throttle held.
function rearRecovery(o: BenchOptions): { record: RearRecoveryRecord; trace: Trace } {
  const config = setupConfig(o), trace = newTrace();
  const window = msToSteps(BENCH_PARAMETERS.forcingWindowMs);
  let state = arcEntry(BENCH_PARAMETERS.forcingSpeedMps);
  const forcing = makeInput(o.inputMode, 1, 0, 1), release = makeInput(o.inputMode, 1, 0, 0);
  let loosened = false, exit: Exit | undefined;
  for (let i = 0; i < window; i++) {
    state = advance(state, config, arcEnvironment, o, trace, forcing);
    const t = lastOf(trace);
    if (t.surface === 'GRASS') { exit = { step: t.simStepCount, x: state.x, z: state.z }; break; }
    if (loose(t.handling)) { loosened = true; break; }
  }
  let gripReached = false, recoverySteps = 0, maxSideslipRad = 0;
  if (loosened) {
    for (let i = 1; i <= window; i++) {
      state = advance(state, config, arcEnvironment, o, trace, release);
      const t = lastOf(trace);
      if (t.surface === 'GRASS') { exit = { step: t.simStepCount, x: state.x, z: state.z }; break; }
      maxSideslipRad = Math.max(maxSideslipRad, t.sideslipRad);
      if (t.handling === 'grip') { gripReached = true; recoverySteps = i; break; }
    }
  }
  const record: RearRecoveryRecord = {
    ...common(o, 'TEST_PAD'), benchId: 'REAR_RECOVERY', ...arcGeometry(), gripReached,
    ...(gripReached ? { recoveryMs: toMs(recoverySteps) } : {}), maxSideslipRad, ...exitFields(exit),
  };
  return { record: withDiagnostics(judge(record), loosened ? [] : ['rear did not let go within forcingWindowMs']), trace };
}

// DRIFT_MANEUVER: the scenario of tests/maneuvers.test.ts with the current setup, on the unbounded asphalt.
function driftManeuver(o: BenchOptions): { record: DriftManeuverRecord; trace: Trace } {
  const config = setupConfig(o), trace = newTrace();
  let state = straight(12);
  for (let i = 0; i < 240; i++) state = advance(state, config, TEST_PAD, o, trace, { throttle: 1, brake: 0, steer: 0.7, drift: true });
  for (let i = 0; i < 120; i++) state = advance(state, config, TEST_PAD, o, trace, { throttle: 1, brake: 0, steer: 0 });
  const record: DriftManeuverRecord = { ...common(o, 'TEST_PAD'), benchId: 'DRIFT_MANEUVER', driftScorePoints: state.maneuvers.score };
  return { record: judge(record), trace };
}

// ACCELERATION and TOP_SPEED: the straight lane from rest, throttle 1, until the speed stops growing.
function straightLine(o: BenchOptions): { acceleration: AccelerationRecord; topSpeed: TopSpeedRecord; trace: Trace; final: State } {
  const config = setupConfig(o), trace = newTrace();
  const full = makeInput(o.inputMode, 1, 0, 0);
  let state = straight(0), sixtySteps: number | undefined, flat = 0;
  const limit = msToSteps(BENCH_PARAMETERS.topSpeedWindowMs);
  for (let i = 1; i <= limit; i++) {
    const before = state.speed;
    state = advance(state, config, laneEnvironment, o, trace, full);
    if (sixtySteps === undefined && state.speed >= SIXTY_KMH_MPS) sixtySteps = i;
    flat = Math.abs(state.speed - before) < 1e-6 ? flat + 1 : 0;
    if (flat >= 120 && sixtySteps !== undefined) break;
  }
  const acceleration = judge<AccelerationRecord>({ ...common(o, 'TEST_PAD'), benchId: 'ACCELERATION', zeroToSixtyKmhMs: toMs(sixtySteps ?? limit), driverMassKg: BENCH_PARAMETERS.driverMassKg });
  const topSpeed = judge<TopSpeedRecord>({ ...common(o, 'TEST_PAD'), benchId: 'TOP_SPEED', topSpeedMps: state.speed });
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

// TEST_PILOT_LAP: a TRAINING lap on the synthetic track; a lap without a time reports the window ceiling (ADR-0004).
function testPilotLap(o: BenchOptions, controller?: Controller): { record: TestPilotLapRecord; trace: Trace; lap: LapSession } {
  const config = setupConfig(o), trace = newTrace();
  const reading = syntheticReading();
  if (reading.trackDataStatus !== 'COMPLETE') throw new Error(`synthetic track is ${reading.trackDataStatus}`);
  const started = startLap(undefined, { lapKind: 'TRAINING', trackId: reading.trackId, trackVersion: reading.trackVersion }, reading, config);
  if (!started.ok) throw new Error(`startLap rejected the synthetic track: ${started.code}`);
  let lap = started.lap;
  const idle: Input = { throttle: 0, brake: 0, steer: 0 };
  for (let i = 0; i < COUNTDOWN_STEPS; i++) lap = stepLap(lap, idle);
  const pilot = controller ?? testPilot(config);
  let off = 0, exit: Exit | undefined;
  for (let i = 0; i < MAX_LAP_STEPS && lap.phase !== 'ENDED'; i++) {
    const input = pilot(lap);
    lap = stepLap(lap, input);
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
  const notes = [`lapValidity ${valid ? 'VALID' : lap.phase === 'ENDED' ? 'INVALID' : 'NOT_ENDED'}`];
  return { record: withDiagnostics(judge(record), notes), trace, lap };
}

// ----------------------------------------------------------------------------- suite and aggregates

// Every simulation bench once, with its traces grouped by environment; the building block of NORMAL_DRIVING,
// DETERMINISM and REALISTA_UNCHANGED.
type Suite = { records: BenchRecord[]; traces: Record<BenchEnvironment, Trace[]>; normal: Record<BenchEnvironment, Trace[]>; lap: LapSession };
const steerSides = (mode: InputMode) => mode === 'PROPORTIONAL' ? [1, -1, BENCH_PARAMETERS.steerInputNormPartial, -BENCH_PARAMETERS.steerInputNormPartial] : [1, -1];
function runSuite(o: BenchOptions): Suite {
  const records: BenchRecord[] = [];
  const traces: Record<BenchEnvironment, Trace[]> = { TEST_PAD: [], SYNTHETIC_TRACK: [] };
  const normal: Record<BenchEnvironment, Trace[]> = { TEST_PAD: [], SYNTHETIC_TRACK: [] };
  for (const side of steerSides(o.inputMode)) { const r = steerResponse(o, side); records.push(r.record); traces.TEST_PAD.push(r.trace); }
  for (const c of ['THROTTLE_ZERO', 'THROTTLE_FULL'] as const) { const r = referenceCornerBench(o, c); records.push(r.record); traces.TEST_PAD.push(r.trace); normal.TEST_PAD.push(r.trace); }
  const onset = understeerOnset(o); records.push(onset.record); traces.TEST_PAD.push(onset.trace); normal.TEST_PAD.push(onset.trace);
  const rear = rearRecovery(o); records.push(rear.record); traces.TEST_PAD.push(rear.trace); normal.TEST_PAD.push(rear.trace);
  const drift = driftManeuver(o); records.push(drift.record); traces.TEST_PAD.push(drift.trace);
  const line = straightLine(o); records.push(line.acceleration, line.topSpeed); traces.TEST_PAD.push(line.trace);
  for (const entry of [line.final.speed, FIFTY_KMH_MPS]) { const r = grassLoss(o, entry); records.push(r.record); traces.SYNTHETIC_TRACK.push(r.trace); }
  const wall = wallContact(o); records.push(wall.record); traces.SYNTHETIC_TRACK.push(wall.trace);
  const lap = testPilotLap(o); records.push(lap.record); traces.SYNTHETIC_TRACK.push(lap.trace); normal.SYNTHETIC_TRACK.push(lap.trace);
  return { records, traces, normal, lap: lap.lap };
}

// NORMAL_DRIVING per environment: the steps of class NORMAL on the asphalt (classifyHandlingSteps, RULE-0001);
// RECOVERY steps on the asphalt are counted and excluded; FORCING and DRIFT steps enter no count.
function normalDriving(o: BenchOptions, env: BenchEnvironment, suite: Suite): NormalDrivingRecord {
  let count = 0, excluded = 0, bad = 0, maxSideslipRad = 0;
  for (const trace of suite.normal[env]) {
    const classes = classifyHandlingSteps(trace.inputs.map((input, i) => ({ input, telemetry: trace.telemetry[i] })));
    for (let i = 0; i < classes.length; i++) {
      const t = trace.telemetry[i];
      if (t.surface !== 'ASPHALT') continue;
      if (classes[i] === 'RECOVERY') { excluded++; continue; }
      if (classes[i] !== 'NORMAL') continue;
      count++;
      if (loose(t.handling)) bad++;
      maxSideslipRad = Math.max(maxSideslipRad, t.sideslipRad);
    }
  }
  return judge({ ...common(o, env), benchId: 'NORMAL_DRIVING', normalDrivingStepCount: count, excludedRecoveryStepCount: excluded, oversteerOrSlidingStepCount: bad, maxSideslipRad });
}

// DETERMINISM per environment: the benches of the environment (and the lap on the synthetic track) run runCount times.
function determinism(o: BenchOptions, first: Suite): DeterminismRecord[] {
  const identical: Record<BenchEnvironment, boolean> = { TEST_PAD: true, SYNTHETIC_TRACK: true };
  for (let run = 1; run < BENCH_PARAMETERS.runCount; run++) {
    const again = runSuite(o);
    for (const env of ENVIRONMENTS) {
      identical[env] &&= again.traces[env].length === first.traces[env].length
        && again.traces[env].every((t, i) => deepEqual(t.states, first.traces[env][i].states));
    }
    identical.SYNTHETIC_TRACK &&= deepEqual(getLapResult(again.lap), getLapResult(first.lap));
  }
  return ENVIRONMENTS.map(env => judge<DeterminismRecord>({ ...common(o, env), benchId: 'DETERMINISM', runCount: BENCH_PARAMETERS.runCount, identical: identical[env] }));
}

function stepCost(o: BenchOptions): StepCostRecord {
  if (!o.stepCost) throw new Error('STEP_COST needs options.stepCost measured by the bench program');
  const base = o.baseline && o.baseline.runtimeId === o.stepCost.runtimeId
    ? baselineRecord<StepCostRecord>(o.baseline, 'STEP_COST', r => r.inputMode === o.inputMode) : undefined;
  return judge({
    ...common(o, 'TEST_PAD'), benchId: 'STEP_COST', baselineAvailable: base !== undefined, meanStepCostUs: o.stepCost.meanStepCostUs,
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
    ...common(o, 'TEST_PAD'), benchId: 'SETUP_VERSION', declaredSetupVersion: s.setupVersion, previousSetupVersion: s.previousSetupVersion ?? '',
    oldRecordsReadCount: old.length, oldRecordsReadOkCount: ok,
  });
}

const INPUT_LINE = "export type Input = { throttle: number; brake: number; steer: number; drift?: boolean };";
function stepContract(o: BenchOptions): StepContractRecord {
  let source = '';
  try { source = readFileSync(new URL('../src/physics.ts', import.meta.url), 'utf8'); } catch { source = ''; }
  return judge({
    ...common(o, 'TEST_PAD'), benchId: 'STEP_CONTRACT',
    stepUnchanged: 1 / STEP === 120,
    solverRateUnchanged: 120 * SOLVER_SUBSTEPS === 480 && /Math\.ceil\(dt \/ \(STEP \/ SOLVER_SUBSTEPS\)\)/.test(source),
    inputFieldsUnchanged: source.split('\n').some(l => l === INPUT_LINE),
  });
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
      records[env].push(...suite.records.filter(r => r.benchEnvironment === env), normalDriving(inner, env, suite), ...det.filter(r => r.benchEnvironment === env));
      for (const t of suite.traces[env]) for (const s of t.states) if (s.telemetry.assistActive) assists[env]++;
    }
  }
  const base = o.realistaBaseline;
  return ENVIRONMENTS.map(env => judge<RealistaUnchangedRecord>({
    ...common(o, env), benchId: 'REALISTA_UNCHANGED', baselineAvailable: base !== undefined,
    differingMeasureCount: base ? countDifferingMeasures(records[env], base.records.filter(r => r.benchEnvironment === env)) : 0,
    arcadeAssistActiveCount: assists[env],
  }));
}

// ----------------------------------------------------------------------------- verdicts (single source)

// Recomputes verdict and failReason from the measured fields of a record and from what the bench observed in its
// trace (RULE-0002, in the order of the verdict table of DES-0004), so that a test judges a synthetic record the
// same way the bench does. Without `observed`, the verdict comes from the fields only.
export function judge<T extends BenchRecord>(input: T, observed?: Observed): T {
  const r: T = { ...input };
  delete (r as { failReason?: FailReason }).failReason;
  let fail: FailReason | undefined;
  switch (r.benchId) {
    case 'STEER_RESPONSE': {
      const low = r.targetSpeedMps - r.speedHoldBandMps, high = r.targetSpeedMps + r.speedHoldBandMps;
      if (r.speedMinMps < low || r.speedMaxMps > high) fail = 'SPEED_NOT_HELD';
      else if (r.riseToNinetyPctMs > THRESHOLDS.riseToNinetyPctMs || r.fallToTenPctMs > THRESHOLDS.fallToTenPctMs) fail = 'THRESHOLD_EXCEEDED';
      break;
    }
    case 'REFERENCE_CORNER':
      if (r.offAsphaltStepCount > 0) fail = 'OFF_ASPHALT';
      else if (r.maxUndersteerMs > THRESHOLDS.maxUndersteerMs || (r.throttleCondition === 'THROTTLE_FULL' && observed === 'THRESHOLD_EXCEEDED')) fail = 'THRESHOLD_EXCEEDED';
      break;
    case 'UNDERSTEER_ONSET':
      // A sweep that never left the lane is a result RULE-0002 does not decide (ADR-0004, decision 8).
      if (!(r.offAsphaltStepCount > 0)) throw new Error('UNDERSTEER_ONSET: record without a lane exit has no verdict');
      if (observed === 'OFF_ASPHALT') fail = 'OFF_ASPHALT';
      else if (r.maxUndersteerMsBySpeed.length < 2) fail = 'MEASUREMENT_MISSING';
      else if (!r.baselineAvailable || r.v0Mps === undefined) fail = 'BASELINE_MISSING';
      else if (r.v1Mps === undefined) fail = 'MEASUREMENT_MISSING';
      else if (r.v1Mps < THRESHOLDS.understeerOnsetRatio * r.v0Mps
        || r.maxUndersteerMsBySpeed.some(([, ms], i, a) => i > 0 && ms < a[i - 1][1])) fail = 'THRESHOLD_EXCEEDED';
      break;
    case 'NORMAL_DRIVING':
      if (r.oversteerOrSlidingStepCount > 0 || r.maxSideslipRad > THRESHOLDS.maxSideslipRad) fail = 'THRESHOLD_EXCEEDED';
      break;
    case 'REAR_RECOVERY':
      if (r.offAsphaltStepCount > 0) fail = 'OFF_ASPHALT';
      else if (!r.gripReached || r.recoveryMs === undefined || r.recoveryMs > THRESHOLDS.recoveryMs || r.maxSideslipRad > THRESHOLDS.maxSideslipRad) fail = 'THRESHOLD_EXCEEDED';
      break;
    case 'DRIFT_MANEUVER':
      if (!(r.driftScorePoints > 0)) fail = 'THRESHOLD_EXCEEDED';
      break;
    case 'ACCELERATION':
      if (r.zeroToSixtyKmhMs > THRESHOLDS.zeroToSixtyKmhMs) fail = 'THRESHOLD_EXCEEDED';
      break;
    case 'TOP_SPEED':
      if (r.topSpeedMps < THRESHOLDS.topSpeedMps) fail = 'THRESHOLD_EXCEEDED';
      break;
    case 'GRASS_LOSS':
      if (observed === 'THRESHOLD_EXCEEDED' || r.speedAfterOneSMps > THRESHOLDS.grassSpeedRatio * r.entrySpeedMps) fail = 'THRESHOLD_EXCEEDED';
      break;
    case 'WALL_CONTACT':
      if (r.contacts.length === 0 || r.contacts.some(([before, after]) => !(after < before))) fail = 'THRESHOLD_EXCEEDED';
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

export function runBench(benchId: BenchId, options: BenchOptions): BenchRecord[] {
  switch (benchId) {
    case 'STEER_RESPONSE': return steerSides(options.inputMode).map(s => steerResponse(options, s).record);
    case 'REFERENCE_CORNER': return (['THROTTLE_ZERO', 'THROTTLE_FULL'] as const).map(c => referenceCornerBench(options, c).record);
    case 'UNDERSTEER_ONSET': return [understeerOnset(options).record];
    case 'NORMAL_DRIVING': { const suite = runSuite(options); return ENVIRONMENTS.map(env => normalDriving(options, env, suite)); }
    case 'REAR_RECOVERY': return [rearRecovery(options).record];
    case 'DRIFT_MANEUVER': return [driftManeuver(options).record];
    case 'ACCELERATION': return [straightLine(options).acceleration];
    case 'TOP_SPEED': return [straightLine(options).topSpeed];
    case 'GRASS_LOSS': { const line = straightLine(options); return [line.final.speed, FIFTY_KMH_MPS].map(e => grassLoss(options, e).record); }
    case 'WALL_CONTACT': return [wallContact(options).record];
    case 'DETERMINISM': return determinism(options, runSuite(options));
    case 'TEST_PILOT_LAP': return [testPilotLap(options).record];
    case 'STEP_COST': return [stepCost(options)];
    case 'SETUP_VERSION': return [setupVersion(options)];
    case 'STEP_CONTRACT': return [stepContract(options)];
    case 'REALISTA_UNCHANGED': return realistaUnchanged(options);
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
    if (suite && id === 'NORMAL_DRIVING') records.push(...ENVIRONMENTS.map(env => normalDriving(options, env, suite)));
    else if (suite && id === 'DETERMINISM') records.push(...determinism(options, suite));
    else if (suite && SIMULATION_BENCHES.includes(id)) records.push(...suite.records.filter(r => r.benchId === id));
    else records.push(...runBench(id, options));
  }
  return records;
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
    else if (k.endsWith('Mps') && typeof v === 'number') parts.push(`${k} ${kmh(v)} km/h`);
    else if (k === 'contacts' && Array.isArray(v)) parts.push(`contacts ${(v as [number, number][]).map(([a, b]) => `${kmh(a)}>${kmh(b)}`).join(' ')} km/h`);
    else if (k === 'maxUndersteerMsBySpeed' && Array.isArray(v)) parts.push(`maxUndersteerMsBySpeed ${(v as [number, number][]).map(([s, ms]) => `${kmh(s)}km/h:${ms}ms`).join(' ')}`);
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
