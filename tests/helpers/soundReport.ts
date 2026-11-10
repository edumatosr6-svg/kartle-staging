// The frame reading of the sound and the three `npm test` records of apresentacao-e-som (API-0003, DES-0004):
// SOUND_DETERMINISM, ASSETS_NEUTRAL and SIM_STATE_UNCHANGED. Evidence only (I9): it reads the lap and the simulation
// through their public operations and hands the reading of each step to a RaceAudio; no module of src/ imports it. No
// clock, no random, no network: every instant is toMs(steps) and every input comes from the test pilot or the baseline.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, isAbsolute, join } from 'node:path';
import { getHandlingTelemetry, getTrackContact, PUBLISHED_SETUPS, type Input, type SetupRef } from '../../src/physics';
import { getLapState, stepLap, type LapSession } from '../../src/lap';
import { toMs } from '../../src/lapTiming';
import { RaceAudio } from '../../src/audio';
import type { SoundOutput, SoundReading } from '../../src/soundOutput';
import { syntheticReading } from '../fixtures/trackFiles';
import { replay as replayInputs, runCountdown as runSyntheticCountdown, startSession } from './autopilot';
import { completeKartParkLap, kartParkPilot, lapResults, replay } from './kartParkPilot';
import { dataUrlOf, fakeAudio, withAudioGlobals, type FakeAudio } from './soundContext';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const SIM_BASELINE_PATH = 'tests/fixtures/kart01-sim-baseline.json';
// The identity the Kart Park fixtures run with (tests/helpers/kartParkPilot.ts pins the Arcade assistido v5).
export const KART_PARK_SETUP: SetupRef = { setupId: 'ARCADE_ASSISTIDO', setupVersion: 'arcade-assistido-v5' };

const assetBytes = (name: string) => new Uint8Array(readFileSync(join(ROOT, 'src', 'assets', name)));
// The two texts src/main.ts hands to loadRecordings, as the bundler builds them: the bytes of src/assets in base 64.
export const embeddedRecordings = () => ({ engineLoopDataUrl: dataUrlOf(assetBytes('engine-loop.mp3')), tireScreechDataUrl: dataUrlOf(assetBytes('tire-screech.mp3')) });

// At least one of the two rear wheels on the asphalt (ADR-0003 choice 7): wheels 2 and 3 of getTrackContact.
export function rearOnAsphalt(lap: LapSession): boolean {
  const contact = getTrackContact(lap.kart, lap.environment, lap.config);
  return !('code' in contact) && (contact.wheelSurfaces[2] === 'ASPHALT' || contact.wheelSurfaces[3] === 'ASPHALT');
}

// The reading of a frame for the sound, field by field from the public readings DES-0003 names: lapPhase of getLapState,
// simStepCount and speedMps of getHandlingTelemetry, the throttle of the Input given to the last advanced step.
export function frameReading(
  lap: LapSession | undefined, setup: SetupRef,
  frame: { nowMs: number; throttleNorm: number; tireMarkingAsphalt: boolean; repositionAcceptedAtMs?: number },
): SoundReading {
  const lapState = getLapState(lap);
  const telemetry = getHandlingTelemetry(lap?.kart, setup);
  return {
    nowMs: frame.nowMs, lapPhase: 'code' in lapState ? undefined : lapState.lapPhase,
    ...(frame.repositionAcceptedAtMs !== undefined ? { repositionAcceptedAtMs: frame.repositionAcceptedAtMs } : {}),
    simStepCount: 'code' in telemetry ? undefined : telemetry.simStepCount,
    speedMps: 'code' in telemetry ? 0 : telemetry.speedMps,
    throttleNorm: frame.throttleNorm, tireMarkingAsphalt: frame.tireMarkingAsphalt,
  };
}

// ---------------------------------------------------------------- API-0003 records

export type TimeFailReason = 'TIME_DIFFERS' | 'LAP_NOT_COMPLETED';
export type TimesRecord = {
  checkId: 'SOUND_DETERMINISM' | 'ASSETS_NEUTRAL'; verdict: 'PASS' | 'FAIL'; checkFailReason?: TimeFailReason;
  checkStepCount: number; lapDeltaMs?: number; maxSectorDeltaMs?: number;
};
export type SimStateRecord = {
  checkId: 'SIM_STATE_UNCHANGED'; verdict: 'PASS' | 'FAIL'; checkFailReason?: 'STATE_DIFFERS' | 'BASELINE_MISSING';
  checkStepCount?: number; differingFieldCount?: number;
};
export type SoundCheckRecord = TimesRecord | SimStateRecord;
export const serializeRecord = (record: SoundCheckRecord): string => JSON.stringify(record);

// What one execution of the input sequence gave: the steps advanced and, when the lap closed, its time and sectors.
export type LapTimes = { stepCount: number; lapMs?: number; sectorMs?: number[] };

// The verdict of comparing two executions of the same input sequence (API-0003): a lap not completed in either one is
// LAP_NOT_COMPLETED, with the common fields and checkStepCount only; any difference in the total or in a sector is
// TIME_DIFFERS.
export function judgeTimes(checkId: TimesRecord['checkId'], a: LapTimes, b: LapTimes): TimesRecord {
  const checkStepCount = Math.min(a.stepCount, b.stepCount);
  if (a.lapMs === undefined || b.lapMs === undefined || !a.sectorMs || !b.sectorMs) return { checkId, verdict: 'FAIL', checkFailReason: 'LAP_NOT_COMPLETED', checkStepCount };
  const lapDeltaMs = Math.abs(a.lapMs - b.lapMs);
  const sectors = Math.max(a.sectorMs.length, b.sectorMs.length);
  let maxSectorDeltaMs = 0;
  for (let i = 0; i < sectors; i++) {
    const x = a.sectorMs[i], y = b.sectorMs[i];
    // A sector present in one execution only differs by its whole time.
    maxSectorDeltaMs = Math.max(maxSectorDeltaMs, x === undefined || y === undefined ? Math.max(x ?? 0, y ?? 0, 1) : Math.abs(x - y));
  }
  const differs = lapDeltaMs !== 0 || maxSectorDeltaMs !== 0 || a.stepCount !== b.stepCount;
  return { checkId, verdict: differs ? 'FAIL' : 'PASS', ...(differs ? { checkFailReason: 'TIME_DIFFERS' as const } : {}), checkStepCount, lapDeltaMs, maxSectorDeltaMs };
}

export type SoundRunMode = 'SOUND_ON' | 'SOUND_OFF' | 'ASSETS_UNAVAILABLE';
export type SoundRun = { times: LapTimes; inputs: Input[]; outputs: { lapPhase: string; output: SoundOutput }[]; fake?: FakeAudio };

// One training lap of the Kart Park under `inputs` (or under the test pilot, whose inputs are then returned), with the
// reading of every step handed to a RaceAudio in the given mode:
// - SOUND_ON: substitute audio context, both recordings decoded, setSoundOn(true);
// - SOUND_OFF: the same, the sound never turned on;
// - ASSETS_UNAVAILABLE: no audio context and no decoder in the browser, texts that are not recordings, setSoundOn(true).
export async function runKartParkLapWithSound(mode: SoundRunMode, inputs?: readonly Input[]): Promise<SoundRun> {
  const fake = mode === 'ASSETS_UNAVAILABLE' ? undefined : fakeAudio();
  return withAudioGlobals(fake ?? {}, async () => {
    const audio = new RaceAudio();
    await audio.loadRecordings(mode === 'ASSETS_UNAVAILABLE' ? { engineLoopDataUrl: '', tireScreechDataUrl: '' } : embeddedRecordings());
    if (mode !== 'SOUND_OFF') audio.setSoundOn(true);
    const outputs: SoundRun['outputs'] = [];
    const { lap, inputs: given } = completeKartParkLap(inputs ? replay(inputs) : kartParkPilot(), (_before, after, input) => {
      const reading = frameReading(after, KART_PARK_SETUP, { nowMs: toMs(after.kart.stepCount), throttleNorm: input.throttle, tireMarkingAsphalt: false });
      if (fake) fake.contexts[0] && (fake.contexts[0].currentTime = reading.nowMs / 1000);
      outputs.push({ lapPhase: reading.lapPhase ?? 'NONE', output: audio.refresh(reading) });
    });
    const result = lapResults(lap)[0];
    const lapMs = result?.lapMs ?? result?.trainingLapMs;
    const sectors = result?.sectorMs ?? result?.trainingSectorMs;
    const sectorMs = sectors && sectors.every((s): s is number => typeof s === 'number') ? [...sectors] : undefined;
    return { times: { stepCount: given.length, lapMs, sectorMs }, inputs: given, outputs, fake };
  });
}

// SOUND_DETERMINISM (NFR-0004): the same input sequence, from the same initial state, with the sound on and off.
export async function soundDeterminismCheck(on?: SoundRun): Promise<TimesRecord> {
  const a = on ?? await runKartParkLapWithSound('SOUND_ON');
  const b = await runKartParkLapWithSound('SOUND_OFF', a.inputs);
  return judgeTimes('SOUND_DETERMINISM', a.times, b.times);
}
// ASSETS_NEUTRAL (NFR-0009): the same input sequence with the sounds available and with none of them available.
export async function assetsNeutralCheck(on?: SoundRun): Promise<TimesRecord> {
  const a = on ?? await runKartParkLapWithSound('SOUND_ON');
  const b = await runKartParkLapWithSound('ASSETS_UNAVAILABLE', a.inputs);
  return judgeTimes('ASSETS_NEUTRAL', a.times, b.times);
}

// ---------------------------------------------------------------- SIM_STATE_UNCHANGED

type InputRun = [count: number, throttle: number, brake: number, steer: number, drift: boolean];
type BaselineRun = { setupId: keyof typeof PUBLISHED_SETUPS; setupVersion: string; lapKind: 'OFFICIAL' | 'RECON' | 'TRAINING'; driverMassKg: number; inputRuns: InputRun[]; checkStepCount: number; finalKart: unknown };
type Baseline = { schemaVersion: number; referenceRuns: BaselineRun[] };

// Every leaf of a JSON value by its path.
function leaves(value: unknown, path: string, out: Map<string, unknown>): Map<string, unknown> {
  if (value !== null && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) out.set(path, Array.isArray(value) ? '[]' : '{}');
    for (const [key, child] of entries) leaves(child, path ? `${path}.${key}` : key, out);
  } else out.set(path, value);
  return out;
}
// Fields added, removed or with another value between the recorded state and the current one (API-0003).
export function differingFields(recorded: unknown, current: unknown): string[] {
  const a = leaves(JSON.parse(JSON.stringify(recorded)), '', new Map()), b = leaves(JSON.parse(JSON.stringify(current)), '', new Map());
  return [...new Set([...a.keys(), ...b.keys()])].filter(path => !a.has(path) || !b.has(path) || !Object.is(a.get(path), b.get(path)));
}

export function readBaselineData(path: string = SIM_BASELINE_PATH): unknown {
  try { return JSON.parse(readFileSync(isAbsolute(path) ? path : join(ROOT, path), 'utf8')); } catch { return undefined; }
}

// SIM_STATE_UNCHANGED (NFR-0009): the reference runs of the baseline recorded before the feature are replayed and the
// final state of the kart of each is compared with the recorded one, field by field. A baseline that is absent,
// unreadable, of another schema or recorded for a setup version that is no longer the published one is BASELINE_MISSING.
// Called with no argument it reads the baseline of the repository; an argument, `undefined` included, is the baseline.
export function simStateUnchangedCheck(...given: [baseline?: unknown]): SimStateRecord {
  const baseline = given.length === 0 ? readBaselineData() : given[0];
  const missing: SimStateRecord = { checkId: 'SIM_STATE_UNCHANGED', verdict: 'FAIL', checkFailReason: 'BASELINE_MISSING' };
  const b = baseline as Baseline | undefined;
  if (!b || typeof b !== 'object' || b.schemaVersion !== 1 || !Array.isArray(b.referenceRuns) || b.referenceRuns.length === 0) return missing;
  for (const run of b.referenceRuns) {
    const setup = PUBLISHED_SETUPS[run.setupId];
    if (!setup || setup.setupVersion !== run.setupVersion || !Array.isArray(run.inputRuns) || run.finalKart === undefined) return missing;
  }
  const reading = syntheticReading();
  let checkStepCount = 0, differingFieldCount = 0;
  for (const run of b.referenceRuns) {
    const inputs: Input[] = [];
    for (const [count, throttle, brake, steer, drift] of run.inputRuns) for (let i = 0; i < count; i++) inputs.push({ throttle, brake, steer, drift });
    let lap = runSyntheticCountdown(startSession(reading, run.lapKind, { ...PUBLISHED_SETUPS[run.setupId].config, driverMass: run.driverMassKg }));
    const controller = replayInputs(inputs);
    for (let i = 0; i < inputs.length; i++) lap = stepLap(lap, controller(lap));
    checkStepCount += inputs.length;
    differingFieldCount += differingFields(run.finalKart, lap.kart).length;
  }
  const differs = differingFieldCount > 0;
  return { checkId: 'SIM_STATE_UNCHANGED', verdict: differs ? 'FAIL' : 'PASS', ...(differs ? { checkFailReason: 'STATE_DIFFERS' as const } : {}), checkStepCount, differingFieldCount };
}
