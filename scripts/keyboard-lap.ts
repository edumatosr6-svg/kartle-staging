// bench:handling — the handling bench program (DES-0004, ADR-0003, ADR-0004), NOT part of the playable client.
// Application layer: it only advances the simulation through the bench library and startLap/stepLap, and it is
// the one module of the feature that reads the wall clock (measuredAtUtc, meanStepCostUs) and node:os (runtimeId).
// Arguments: --previous (the previous Arcade version, to produce its baseline) and --realista (RENTAL_KART, idem).
import { performance } from 'node:perf_hooks';
import { cpus } from 'node:os';
import { PUBLISHED_SETUPS, type PublishedSetup } from '../src/physics';
import { getLapResult, startLap, stepLap } from '../src/lap';
import { COUNTDOWN_STEPS } from '../src/lapTiming';
import {
  BENCH_PARAMETERS, handlingBenchReport, loadBaselineText, MAX_LAP_STEPS, readBaseline, serialize, syntheticReading, testPilot,
  type BenchOptions, type BenchRecord, type InputMode,
} from './handlingBench';

// Machine and runtime identity for STEP_COST (ADR-0003, decision 4): never a host name or a user name.
function runtimeId(): string {
  return `${process.platform}-${process.arch}-node${process.versions.node}-${cpus()[0]?.model ?? 'cpu'}`;
}

// Mean wall-clock cost of one stepLap over the test-pilot lap, in microseconds; never a domain measure (I9).
function measureStepCost(setup: PublishedSetup, version: 'current' | 'previous'): { meanStepCostUs: number } {
  const config = { ...(version === 'previous' && setup.previousConfig ? setup.previousConfig : setup.config), driverMass: BENCH_PARAMETERS.driverMassKg };
  const reading = syntheticReading();
  if (reading.trackDataStatus !== 'COMPLETE') throw new Error(`synthetic track is ${reading.trackDataStatus}`);
  const setupVersion = version === 'previous' && setup.previousSetupVersion ? setup.previousSetupVersion : setup.setupVersion;
  const started = startLap(undefined, { lapKind: 'TRAINING', trackId: reading.trackId, trackVersion: reading.trackVersion, setupId: setup.setupId, setupVersion }, reading, config);
  if (!started.ok) throw new Error(`startLap rejected the synthetic track: ${started.code}`);
  let lap = started.lap;
  for (let i = 0; i < COUNTDOWN_STEPS; i++) lap = stepLap(lap, { throttle: 0, brake: 0, steer: 0 });
  const pilot = testPilot(config);
  let total = 0, steps = 0;
  // The same steps as TEST_PILOT_LAP: the lap ends at the first result, not at phase ENDED (DES-0004).
  for (let i = 0; i < MAX_LAP_STEPS && 'code' in getLapResult(lap); i++) {
    const input = pilot(lap);
    const before = performance.now();
    lap = stepLap(lap, input);
    total += performance.now() - before;
    steps++;
  }
  return { meanStepCostUs: steps > 0 ? total * 1000 / steps : 0 };
}

const args = process.argv.slice(2);
const previous = args.includes('--previous'), realista = args.includes('--realista');
const setup = realista ? PUBLISHED_SETUPS.REALISTA_ALUGUEL_4T : PUBLISHED_SETUPS.ARCADE_ASSISTIDO;
const version = previous ? 'previous' : 'current';
const id = runtimeId();
const measuredAtUtc = new Date().toISOString();
const stepCost = { ...measureStepCost(setup, version), runtimeId: id };
// A run that produces a baseline (--previous, --realista) is never judged against another baseline (ADR-0003).
const text = previous || realista ? '' : loadBaselineText();
const arcade = PUBLISHED_SETUPS.ARCADE_ASSISTIDO;
const baseline = text && arcade.previousSetupVersion ? readBaseline(text, 'ARCADE_ASSISTIDO', arcade.previousSetupVersion) : undefined;
const realistaBaseline = text ? readBaseline(text, 'REALISTA_ALUGUEL_4T', PUBLISHED_SETUPS.REALISTA_ALUGUEL_4T.setupVersion) : undefined;
const records: BenchRecord[] = [];
for (const inputMode of ['BINARY', 'PROPORTIONAL'] as const satisfies readonly InputMode[]) {
  const options: BenchOptions = {
    setup, version, inputMode, measuredAtUtc, stepCost,
    ...(baseline ? { baseline } : {}), ...(realistaBaseline ? { realistaBaseline } : {}),
  };
  records.push(...handlingBenchReport(options));
}
console.log(serialize(records, { ...BENCH_PARAMETERS, runtimeId: id }));
