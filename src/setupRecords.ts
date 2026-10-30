// Simulation layer: setup version, lap and replay records and comparability (DES-0003, DM-0001, ADR-0002, API-0002).
// Pure functions over immutable records; rejections are values. Imports physics, lap, lapTiming and trackData only.
import { PUBLISHED_SETUPS, type Input, type PublishedSetup, type SetupId, type SetupRef } from './physics';
import { getLapResult, startLap, stepLap, type LapKind, type LapResult, type LapSession, type StartLapRejection } from './lap';
import { COUNTDOWN_STEPS } from './lapTiming';
import type { TrackReading, TrackVersion } from './trackData';

export const MAX_REPLAY_TEXT_CHARS = 4_194_304;
export const MAX_REPLAY_INPUT_STEPS = 36_000;
export const REPLAY_FORMAT_VERSION = 1;
const DEFAULT_SETUP_ID: SetupId = 'ARCADE_ASSISTIDO';

export type SetupVersionSource = 'DECLARED' | 'RESOLVED_FROM_ABSENCE';
export type Comparability = 'COMPARABLE' | 'SETUP_VERSION_DIFFERS' | 'SETUP_DIFFERS' | 'TRACK_DIFFERS';
export type SetupVersionView = { setupId: SetupId; setupVersion: string; previousSetupVersion?: string };
export type ResolvedSetupRef = SetupRef & { setupVersionSource: SetupVersionSource };
export type LapRecord = LapResult & SetupRef;
export type ReplayRecord = {
  replayFormatVersion: number; trackId: string; trackVersion: TrackVersion; challengeNumber?: number;
  lapKind: LapKind; setupId: SetupId; setupVersion: string; inputs: Input[];
};
export type ReplayReading =
  | { replayStatus: 'READABLE'; trackId: string; trackVersion: TrackVersion; setupId: SetupId; setupVersion: string;
      setupVersionSource: SetupVersionSource; inputStepCount: number }
  | { replayStatus: 'UNREADABLE' } | { replayStatus: 'UNSUPPORTED_FORMAT' };
export type RecordIdentity = { trackId?: unknown; trackVersion?: unknown; setupId?: unknown; setupVersion?: unknown };
export type ReplayLapResult =
  | { ok: true; record: LapRecord; comparability: Comparability }
  | { ok: false; code: StartLapRejection | 'NO_RESULT' };

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const isSetupId = (v: unknown): v is SetupId => v === 'ARCADE_ASSISTIDO' || v === 'REALISTA_ALUGUEL_4T';
const isText = (v: unknown): v is string => typeof v === 'string' && v.length > 0;
const isPositiveInteger = (v: unknown): v is number => Number.isInteger(v) && (v as number) >= 1;
const isTrackVersion = (v: unknown): v is TrackVersion => isText(v) || isPositiveInteger(v);
const isFiniteNumber = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

// API-0002: the declared versions, copied from the published data without interpretation.
export function getSetupVersion(setupId: unknown): SetupVersionView | { code: 'UNKNOWN_SETUP' } {
  if (!isSetupId(setupId)) return { code: 'UNKNOWN_SETUP' };
  const s = PUBLISHED_SETUPS[setupId];
  return { setupId: s.setupId, setupVersion: s.setupVersion, ...(s.previousSetupVersion !== undefined ? { previousSetupVersion: s.previousSetupVersion } : {}) };
}

// RULE-0003: an absent setupId is the default before the feature; an absent version resolves to the previous one.
export function resolveSetupRef(partial: { setupId?: unknown; setupVersion?: unknown }): ResolvedSetupRef {
  const setupId: SetupId = isSetupId(partial.setupId) ? partial.setupId : DEFAULT_SETUP_ID;
  if (isText(partial.setupVersion)) return { setupId, setupVersion: partial.setupVersion, setupVersionSource: 'DECLARED' };
  const s = PUBLISHED_SETUPS[setupId];
  return { setupId, setupVersion: s.previousSetupVersion ?? s.setupVersion, setupVersionSource: 'RESOLVED_FROM_ABSENCE' };
}

// Checks 1 to 7 of DES-0003, in order; never throws, never mutates or discards `source`.
export function readReplay(source: unknown): ReplayReading {
  let file: unknown = source;
  if (typeof source === 'string') {
    if (source.length > MAX_REPLAY_TEXT_CHARS) return { replayStatus: 'UNREADABLE' };
    try { file = JSON.parse(source); } catch { return { replayStatus: 'UNREADABLE' }; }
  }
  if (!isRecord(file)) return { replayStatus: 'UNREADABLE' };
  const version = file.replayFormatVersion;
  if (version !== undefined) {
    if (!isPositiveInteger(version)) return { replayStatus: 'UNREADABLE' };
    if (version > REPLAY_FORMAT_VERSION) return { replayStatus: 'UNSUPPORTED_FORMAT' };
  }
  const { trackId, trackVersion, inputs } = file;
  if (!isText(trackId) || !isTrackVersion(trackVersion)) return { replayStatus: 'UNREADABLE' };
  if (!Array.isArray(inputs) || inputs.length === 0 || inputs.length > MAX_REPLAY_INPUT_STEPS) return { replayStatus: 'UNREADABLE' };
  for (const input of inputs as unknown[]) {
    if (!isRecord(input)) return { replayStatus: 'UNREADABLE' };
    if (!isFiniteNumber(input.throttle) || !isFiniteNumber(input.brake) || !isFiniteNumber(input.steer)) return { replayStatus: 'UNREADABLE' };
    if (input.drift !== undefined && typeof input.drift !== 'boolean') return { replayStatus: 'UNREADABLE' };
  }
  const ref = resolveSetupRef({ setupId: file.setupId, setupVersion: file.setupVersion });
  return { replayStatus: 'READABLE', trackId, trackVersion, ...ref, inputStepCount: inputs.length };
}

// RULE-0003 decision table, after resolving each side; strict equality on the track identity.
export function compareLapRecords(a: RecordIdentity, b: RecordIdentity): { comparability: Comparability } | { code: 'INCOMPLETE_RECORD' } {
  for (const r of [a, b]) {
    if (!isText(r.trackId) || !isTrackVersion(r.trackVersion)) return { code: 'INCOMPLETE_RECORD' };
  }
  if (a.trackId !== b.trackId || a.trackVersion !== b.trackVersion) return { comparability: 'TRACK_DIFFERS' };
  const ra = resolveSetupRef(a), rb = resolveSetupRef(b);
  if (ra.setupId !== rb.setupId) return { comparability: 'SETUP_DIFFERS' };
  if (ra.setupVersion !== rb.setupVersion) return { comparability: 'SETUP_VERSION_DIFFERS' };
  return { comparability: 'COMPARABLE' };
}

// DM-0001 section 2: the LapResult of race-lap-validation plus the setup identity, filling only what the result lacks;
// a lap started with the two fields (API-0002 1.1.0 of race-lap-validation) already carries them, so the copy is idempotent.
export function buildLapRecord(result: LapResult, setup: SetupRef): LapRecord {
  return { ...result, setupId: result.setupId ?? setup.setupId, setupVersion: result.setupVersion ?? setup.setupVersion };
}

// DM-0001 section 3: replay format version 1 from an ended session and its RUNNING inputs.
export function buildReplayRecord(lap: LapSession, inputs: readonly Input[], setup: SetupRef): ReplayRecord {
  return {
    replayFormatVersion: REPLAY_FORMAT_VERSION,
    trackId: lap.trackId, trackVersion: lap.trackVersion,
    ...(lap.challengeNumber !== undefined ? { challengeNumber: lap.challengeNumber } : {}),
    lapKind: lap.lapKind, setupId: setup.setupId, setupVersion: setup.setupVersion,
    inputs: inputs.map(i => ({ throttle: i.throttle, brake: i.brake, steer: i.steer, ...(i.drift !== undefined ? { drift: i.drift } : {}) })),
  };
}

// FLOW-0003: the replay is reproduced with the current setup; the time obtained is never the recorded one.
export function replayLap(record: ReplayRecord, reading: TrackReading, setup: PublishedSetup, driverMassKg = 75): ReplayLapResult {
  const request = {
    lapKind: record.lapKind, trackId: record.trackId, trackVersion: record.trackVersion,
    ...(record.challengeNumber !== undefined ? { challengeNumber: record.challengeNumber } : {}),
    setupId: setup.setupId, setupVersion: setup.setupVersion,
  };
  const started = startLap(undefined, request, reading, { ...setup.config, driverMass: driverMassKg });
  if (!started.ok) return { ok: false, code: started.code };
  let lap = started.lap;
  const idle: Input = { throttle: 0, brake: 0, steer: 0 };
  for (let i = 0; i < COUNTDOWN_STEPS; i++) lap = stepLap(lap, idle);
  // The reproduction ends at the first result, not at phase ENDED: a TRAINING lap gives its result while RUNNING (DES-0003).
  for (const input of record.inputs) {
    if (!('code' in getLapResult(lap))) break;
    lap = stepLap(lap, input);
  }
  const result = getLapResult(lap);
  if ('code' in result) return { ok: false, code: 'NO_RESULT' };
  const obtained = buildLapRecord(result, { setupId: setup.setupId, setupVersion: setup.setupVersion });
  const compared = compareLapRecords(record, obtained);
  // Both records carry trackId and trackVersion by construction, so INCOMPLETE_RECORD cannot occur here.
  return { ok: true, record: obtained, comparability: 'comparability' in compared ? compared.comparability : 'TRACK_DIFFERS' };
}
