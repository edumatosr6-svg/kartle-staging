// Record fixtures of the dirigibilidade suites (test strategy, "Fixtures", `tests/fixtures/records.ts`): replays and
// results of the previous version (no setup fields), of the current version, unsupported, unreadable, oversized and
// incomplete; and handling-baseline markdown texts, one deviation each. Synthetic data only (D-TS-06); every call
// builds a new object, nothing is shared or mutated.
import { ARCADE_KART, type Input, type SetupRef } from '../../src/physics';
import { getLapResult, startLap, stepLap, type LapResult, type LapSession } from '../../src/lap';
import { COUNTDOWN_STEPS } from '../../src/lapTiming';
import {
  buildReplayRecord, MAX_REPLAY_INPUT_STEPS, MAX_REPLAY_TEXT_CHARS, REPLAY_FORMAT_VERSION, type LapRecord, type ReplayRecord,
} from '../../src/setupRecords';
import {
  baselineEntry, BENCH_PARAMETERS, testPilot, type Baseline, type BenchRecord, type InputMode, type UndersteerOnsetRecord,
} from '../../scripts/handlingBench';
import { syntheticReading } from './trackFiles';
import { autopilot } from '../helpers/autopilot';
import { ARCADE, ARCADE_CONFIG, FIFTY_KMH_MPS, MEASURED_AT_UTC, SETUP_REF } from '../helpers/handling';

const reading = syntheticReading();
if (reading.trackDataStatus !== 'COMPLETE') throw new Error('fixture: synthetic reading must be COMPLETE');
export const SYNTHETIC_IDENTITY = { trackId: reading.trackId, trackVersion: reading.trackVersion };
const MAX_LAP_STEPS = 6000;
const IDLE: Input = { throttle: 0, brake: 0, steer: 0 };

type Recorded = { lap: LapSession; inputs: Input[] };
function recordLap(controller: (lap: LapSession) => Input, config: Parameters<typeof startLap>[3], setup?: SetupRef): Recorded {
  const started = startLap(undefined, { lapKind: 'TRAINING', ...SYNTHETIC_IDENTITY, ...(setup ?? {}) }, reading, config);
  if (!started.ok) throw new Error(`fixture: startLap rejected the synthetic track: ${started.code}`);
  let lap = started.lap;
  for (let i = 0; i < COUNTDOWN_STEPS; i++) lap = stepLap(lap, IDLE);
  const inputs: Input[] = [];
  for (let i = 0; i < MAX_LAP_STEPS && lap.phase !== 'ENDED'; i++) {
    const input = controller(lap);
    inputs.push(input);
    lap = stepLap(lap, input);
  }
  if (lap.phase !== 'ENDED') throw new Error('fixture: the recorded lap did not end');
  return { lap, inputs };
}

// Laps recorded once per process: the test-pilot lap with the current Arcade (setup fields in the request) and an
// autopilot lap with the previous Arcade configuration (ARCADE_KART), whose inputs belong to the previous version.
let current: Recorded | undefined, previous: Recorded | undefined;
const currentLap = () => (current ??= recordLap(testPilot(ARCADE_CONFIG), ARCADE_CONFIG, SETUP_REF));
const previousLap = () => (previous ??= recordLap(autopilot(0, ARCADE_KART), { ...ARCADE_KART, driverMass: BENCH_PARAMETERS.driverMassKg }));
const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v)) as T;

// A replay written before the feature: no replayFormatVersion, no setupId, no setupVersion.
export function oldReplay(): { trackId: string; trackVersion: string | number; lapKind: 'TRAINING'; inputs: Input[] } {
  return { ...SYNTHETIC_IDENTITY, lapKind: 'TRAINING', inputs: clone(previousLap().inputs) };
}
// A result written before the feature: the LapResult of race-lap-validation without the setup fields.
export function oldResult(): LapResult {
  const r = getLapResult(previousLap().lap);
  if ('code' in r) throw new Error('fixture: the previous lap has no result');
  const { setupId: _id, setupVersion: _version, ...rest } = r;
  return clone(rest);
}
export function newReplay(): ReplayRecord {
  const { lap, inputs } = currentLap();
  return clone(buildReplayRecord(lap, inputs, SETUP_REF));
}
// The result as getLapResult returns it for a lap started with the two fields (API-0002 1.1.0 of race-lap-validation).
export function newResult(): LapRecord {
  const r = getLapResult(currentLap().lap);
  if ('code' in r || r.setupId === undefined || r.setupVersion === undefined) throw new Error('fixture: the current lap must carry the setup fields');
  return clone(r as LapRecord);
}
export function v4Replay(): ReplayRecord {
  if (!ARCADE.previousSetupVersion) throw new Error('fixture: the Arcade setup must declare a previous version');
  return { ...newReplay(), setupVersion: ARCADE.previousSetupVersion, inputs: clone(previousLap().inputs) };
}
export function futureReplay(): ReplayRecord { return { ...newReplay(), replayFormatVersion: REPLAY_FORMAT_VERSION + 1 }; }
export function corruptReplay(): string { return '{"trackId": "synthetic", "inputs": [ not json'; }
// MAX_REPLAY_INPUT_STEPS + 1 elements, each of which throws when read: a reader that touches one element fails loudly.
export function oversizedReplay(): { trackId: string; trackVersion: string | number; inputs: Input[] } {
  const inputs = new Proxy([] as Input[], {
    get(target, property, receiver) {
      if (property === 'length') return MAX_REPLAY_INPUT_STEPS + 1;
      if (typeof property === 'string' && /^\d+$/.test(property)) throw new Error('fixture: an element of the oversized replay was read');
      if (property === Symbol.iterator) throw new Error('fixture: the oversized replay was iterated');
      return Reflect.get(target, property, receiver);
    },
  });
  return { ...SYNTHETIC_IDENTITY, inputs };
}
// A valid JSON text one character above the ceiling.
export function oversizedReplayText(): string {
  const head = `{"trackId":"${SYNTHETIC_IDENTITY.trackId}","trackVersion":${JSON.stringify(SYNTHETIC_IDENTITY.trackVersion)},"inputs":[{"throttle":1,"brake":0,"steer":0}],"pad":"`;
  const tail = '"}';
  return head + 'x'.repeat(MAX_REPLAY_TEXT_CHARS + 1 - head.length - tail.length) + tail;
}
export function incompleteResult(): Omit<LapRecord, 'trackVersion'> {
  const { trackVersion: _v, ...rest } = newResult();
  return rest;
}

// ----------------------------------------------------------------------------- handling-baseline markdown texts

export const BASELINE_RUNTIME_ID = 'fixture-platform-fixture-cpu';
const PLATEAU_PARAMETERS = { plateauMs: BENCH_PARAMETERS.plateauMs, plateauSpeedHoldMode: BENCH_PARAMETERS.plateauSpeedHoldMode };
const exit = { offAsphaltStepCount: 1, offAsphaltFirstStep: 1, offAsphaltFirstXM: 24.5, offAsphaltFirstZM: 0 };

// The UNDERSTEER_ONSET record of the previous version as its bench emits it: V1 at 50 km/h (plateau 0 understeered),
// no complete plateau above 50 km/h, and the sweep ended by the exit before the second one (MEASUREMENT_MISSING).
function onsetRecord(inputMode: InputMode, patch: Partial<UndersteerOnsetRecord> = {}, geometry: { arcRadiusM: number; laneWidthM: number } = { arcRadiusM: BENCH_PARAMETERS.arcRadiusM, laneWidthM: BENCH_PARAMETERS.laneWidthM }): UndersteerOnsetRecord {
  return {
    benchEnvironment: 'TEST_PAD', setupId: ARCADE.setupId, setupVersion: ARCADE.previousSetupVersion ?? '', inputMode,
    verdict: 'FAIL', failReason: 'MEASUREMENT_MISSING', measuredAtUtc: MEASURED_AT_UTC, baselineAvailable: false,
    benchId: 'UNDERSTEER_ONSET', ...geometry, v1Mps: FIFTY_KMH_MPS, entrySpeedStepMps: BENCH_PARAMETERS.entrySpeedStepMps,
    maxUndersteerMsBySpeed: [], ...exit, ...patch,
  };
}
function stepCostRecord(inputMode: InputMode, meanStepCostUs: number): BenchRecord {
  return {
    benchEnvironment: 'TEST_PAD', setupId: ARCADE.setupId, setupVersion: ARCADE.previousSetupVersion ?? '', inputMode,
    verdict: 'FAIL', failReason: 'BASELINE_MISSING', measuredAtUtc: MEASURED_AT_UTC, baselineAvailable: false,
    benchId: 'STEP_COST', meanStepCostUs,
  };
}
function markdown(entries: readonly Baseline[]): string {
  const lines = entries.map(e => JSON.stringify(e)).join(',\n');
  return `# Física\n\nTexto antes do bloco.\n\n\`\`\`json handling-baseline\n{"entries": [\n${lines}\n]}\n\`\`\`\n\nTexto depois do bloco.\n`;
}
const entry = (records: BenchRecord[], parameters: Record<string, unknown> | undefined = PLATEAU_PARAMETERS, runtimeId?: string) =>
  baselineEntry(records, ARCADE.setupId, ARCADE.previousSetupVersion ?? '', MEASURED_AT_UTC, runtimeId, parameters);
const bothModes = (make: (mode: InputMode) => BenchRecord) => (['BINARY', 'PROPORTIONAL'] as const).map(make);

export type BaselineVariant =
  | 'valid' | 'noBlock' | 'corrupt' | 'otherEnvironment' | 'otherArc' | 'noV1' | 'interruptedV1' | 'noPlateauParameters' | 'stepCost';
// `stepCost` carries a runtimeId and a STEP_COST record of 10 µs in both modes (NFR-0002).
export function baselineMarkdown(variant: BaselineVariant): string {
  switch (variant) {
    case 'valid': return markdown([entry(bothModes(m => onsetRecord(m)))]);
    case 'noBlock': return '# Física\n\nNenhum bloco legível por máquina aqui.\n';
    case 'corrupt': return '# Física\n\n```json handling-baseline\n{"entries": [ not json\n```\n';
    case 'otherEnvironment': return markdown([entry(bothModes(m => onsetRecord(m, { benchEnvironment: 'SYNTHETIC_TRACK' })))]);
    case 'otherArc': return markdown([entry(bothModes(m => onsetRecord(m, {}, { arcRadiusM: 24, laneWidthM: BENCH_PARAMETERS.laneWidthM })))]);
    case 'noV1': return markdown([entry(bothModes(m => { const r = onsetRecord(m); delete r.v1Mps; return r; }))]);
    // V1 above every plateau of the list and no pair above 200 ms: a baseline that never understeered (DOMAIN/DEC-12).
    case 'interruptedV1': return markdown([entry(bothModes(m => onsetRecord(m, {
      verdict: 'PASS', failReason: undefined, v1Mps: FIFTY_KMH_MPS + 4 * BENCH_PARAMETERS.entrySpeedStepMps,
      maxUndersteerMsBySpeed: [[FIFTY_KMH_MPS + BENCH_PARAMETERS.entrySpeedStepMps, 0], [FIFTY_KMH_MPS + 2 * BENCH_PARAMETERS.entrySpeedStepMps, 0], [FIFTY_KMH_MPS + 3 * BENCH_PARAMETERS.entrySpeedStepMps, 0]],
    })))]);
    case 'noPlateauParameters': return markdown([entry(bothModes(m => onsetRecord(m)), { targetSpeedMps: FIFTY_KMH_MPS })]);
    case 'stepCost': return markdown([entry(bothModes(m => stepCostRecord(m, 10)), { ...PLATEAU_PARAMETERS, runtimeId: BASELINE_RUNTIME_ID }, BASELINE_RUNTIME_ID)]);
  }
}
