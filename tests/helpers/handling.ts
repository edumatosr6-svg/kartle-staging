// Shared fixtures of the dirigibilidade suites (test strategy, "Fixtures"): bench options with a fixed measuredAtUtc
// (never the clock), the baselines read from docs/physics.md, and a trace runner over the public simulation operations
// so that a check recomputes a rule over its own trace instead of trusting the field the record reports.
import {
  ARCADE_ASSISTIDO_V5, getHandlingTelemetry, PUBLISHED_SETUPS, STEP, step,
  type Environment, type HandlingTelemetry, type Input, type KartConfig, type SetupRef, type State,
} from '../../src/physics';
import { toMs } from '../../src/lapTiming';
import {
  BENCH_PARAMETERS, loadBaselineText, readBaseline, serialize,
  type Baseline, type BenchId, type BenchOptions, type BenchRecord, type InputMode,
} from '../../scripts/handlingBench';

export const MEASURED_AT_UTC = '2026-10-27T00:00:00.000Z';
export const ARCADE = PUBLISHED_SETUPS.ARCADE_ASSISTIDO;
export const REALISTA = PUBLISHED_SETUPS.REALISTA_ALUGUEL_4T;
export const SETUP_REF: SetupRef = { setupId: ARCADE.setupId, setupVersion: ARCADE.setupVersion };
// The configuration the benches drive: the published Arcade assistido with the 75 kg driver of DOMAIN/DEC-05.
export const ARCADE_CONFIG: KartConfig = { ...ARCADE_ASSISTIDO_V5, driverMass: BENCH_PARAMETERS.driverMassKg };
export const MODES: readonly InputMode[] = ['BINARY', 'PROPORTIONAL'];
export const FIFTY_KMH_MPS = 50 / 3.6;
export const kmh = (mps: number) => mps * 3.6;
export const near = (a: number, b: number, tol = 1e-9) => Math.abs(a - b) <= tol;

const baselineText = loadBaselineText();
export const ARCADE_BASELINE: Baseline | undefined = ARCADE.previousSetupVersion
  ? readBaseline(baselineText, ARCADE.setupId, ARCADE.previousSetupVersion) : undefined;
export const REALISTA_BASELINE: Baseline | undefined = readBaseline(baselineText, REALISTA.setupId, REALISTA.setupVersion);

export function options(inputMode: InputMode, extra: Partial<BenchOptions> = {}): BenchOptions {
  return {
    setup: ARCADE, version: 'current', inputMode, measuredAtUtc: MEASURED_AT_UTC,
    ...(ARCADE_BASELINE ? { baseline: ARCADE_BASELINE } : {}),
    ...(REALISTA_BASELINE ? { realistaBaseline: REALISTA_BASELINE } : {}),
    ...extra,
  };
}

export type Trace = { inputs: Input[]; states: State[]; telemetry: HandlingTelemetry[] };

// Advances the simulation with STEP from `initial`, reading API-0001 after every step; `stopAfter` ends the trace once
// the step that satisfies it has been recorded (the bench stops the full-throttle corner at its first grass step).
export function trace(
  initial: State, environment: Environment, maxSteps: number, inputAt: (i: number, state: State) => Input,
  stopAfter?: (t: HandlingTelemetry) => boolean, config: KartConfig = ARCADE_CONFIG,
): Trace {
  const out: Trace = { inputs: [], states: [], telemetry: [] };
  let state = initial;
  for (let i = 0; i < maxSteps; i++) {
    const input = inputAt(i, state);
    state = step(state, input, STEP, config, environment);
    const t = getHandlingTelemetry(state, SETUP_REF) as HandlingTelemetry;
    out.inputs.push(input); out.states.push(state); out.telemetry.push(t);
    if (stopAfter?.(t)) break;
  }
  return out;
}

export const isLoose = (h: HandlingTelemetry['handling']) => h === 'oversteer' || h === 'sliding';

// Longest consecutive run of steps satisfying `predicate` among telemetry[0..until), in ms of simulated time.
export function longestRunMs(telemetry: readonly HandlingTelemetry[], predicate: (t: HandlingTelemetry) => boolean, until = telemetry.length): number {
  let run = 0, max = 0;
  for (let i = 0; i < Math.min(until, telemetry.length); i++) {
    run = predicate(telemetry[i]) ? run + 1 : 0;
    max = Math.max(max, run);
  }
  return toMs(max);
}

export function firstGrassIndex(telemetry: readonly HandlingTelemetry[]): number {
  return telemetry.findIndex(t => t.surface === 'GRASS');
}

export function byId<T extends BenchRecord>(records: readonly BenchRecord[], benchId: BenchId, match: (r: BenchRecord) => boolean = () => true): T {
  const hit = records.find(r => r.benchId === benchId && match(r));
  if (!hit) throw new Error(`fixture: no ${benchId} record matched`);
  return hit as T;
}

// The measured content of a record: everything but the input form and the date, for the parity of NFR-0003.
export function measures(record: BenchRecord): Record<string, unknown> {
  const { inputMode: _mode, measuredAtUtc: _at, ...rest } = record as Record<string, unknown> & { inputMode: unknown; measuredAtUtc: unknown };
  return rest;
}

// The serialized record and its presentation line, printed into the runner output (AC-US-000n-0n "a saída contém").
export function printRecords(context: { diagnostic(text: string): void }, records: readonly BenchRecord[]): void {
  for (const line of serialize(records, {}).split('\n').slice(1)) context.diagnostic(line);
}

export const INTEGER = (v: unknown) => Number.isInteger(v);
export const FINITE = (v: unknown) => typeof v === 'number' && Number.isFinite(v);
