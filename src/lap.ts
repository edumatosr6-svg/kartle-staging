// Simulation layer: the lap state machine over the unchanged physics step (DES-0001, DES-0003, DES-0004,
// DES-0005, DM-0002, ADR-0002). Pure functions over an immutable LapSession; rejections are values.
import { CIRCUIT, initialState, STEP, step, trackEdgeDistanceM, type Environment, type Input, type KartConfig, type SetupId, type State } from './physics';
import { crossLine, nearest, track, WIDTH, type Line, type Point } from './track';
import { DEFAULT_CUT_DISTANCE_M, DEFAULT_CUT_DURATION_MS, type StartPosition, type TrackReading, type TrackVersion } from './trackData';
import { nearestOnCenterline } from './trackGeometry';
import { COUNTDOWN_MS, COUNTDOWN_STEPS, interpolateMs, isCutExceeded, toMs } from './lapTiming';

export type LapKind = 'OFFICIAL' | 'RECON' | 'TRAINING';
export type LapPhase = 'COUNTDOWN' | 'RUNNING' | 'PAUSED' | 'ENDED';
export type ResumePhase = 'COUNTDOWN' | 'RUNNING';
export type PauseCause = 'ESC_KEY' | 'FOCUS_LOST' | 'SENSOR_LOST' | 'PAUSE_BUTTON';
export type LapValidity = 'VALID' | 'INVALID';
export type InvalidReason = 'MISSED_MARKER' | 'CUT' | 'REPOSITION';
export type TrackStatus = 'COMPLETE' | 'INCOMPLETE';

export type LapLines = {
  finishLine?: Line;
  sectorLimits: readonly Line[];
  markers: readonly Line[];
  cutDistanceM: number;
  cutDurationMs: number;
};
export type LapRequest = { lapKind: LapKind; trackId: string; trackVersion: TrackVersion; challengeNumber?: number; setupId?: SetupId; setupVersion?: string };

export type LapSession = {
  lapKind: LapKind;
  trackId: string;
  trackVersion: TrackVersion;
  challengeNumber?: number;
  setupId?: SetupId;
  setupVersion?: string;
  trackStatus: TrackStatus;
  lines: LapLines;
  config: Readonly<KartConfig>;
  environment: Environment;
  phase: LapPhase;
  resumePhase?: ResumePhase;
  pauseCause?: PauseCause;
  validity: LapValidity;
  invalidReason?: InvalidReason;
  countdownSteps: number;
  stepCount: number;
  // Position of the lap in progress in the training sequence (1 outside training) and its start, from the green signal.
  lapSequenceCount: number;
  lapStartMs: number;
  markersPassedCount: number;
  // b1..b3 of the lap in progress; null is a limit left unregistered because a later one was registered first.
  sectorBoundsMs: readonly (number | null)[];
  offTrackSteps: number;
  kart: State;
  // In closing order: 0 or 1 item for OFFICIAL and RECON, 1 per lap closed on the finish line in training (ADR-0006).
  results: readonly LapResult[];
};

export type LapResult = {
  trackId: string;
  trackVersion: TrackVersion;
  challengeNumber?: number;
  setupId?: SetupId;
  setupVersion?: string;
  lapKind: LapKind;
  lapValidity: LapValidity;
  invalidReason?: InvalidReason;
  official: boolean;
  lapMs?: number;
  sectorMs?: number[];
  lapSequenceCount?: number;
  lapStartMs?: number;
  trainingLapMs?: number;
  trainingSectorMs?: (number | null)[];
};

export type LapStateView = {
  lapPhase: LapPhase;
  resumePhase?: ResumePhase;
  pauseCause?: PauseCause;
  lapKind: LapKind;
  lapValidity: LapValidity;
  invalidReason?: InvalidReason;
  countdownRemainingMs: number;
  elapsedMs: number;
  stepCount: number;
  completedSectorMs: number[];
  markersPassedCount: number;
  lapSequenceCount: number;
  lapStartMs: number;
  bestValidLapMs?: number;
  trackId: string;
  trackVersion: TrackVersion;
};

export type StartLapRejection = 'LAP_ALREADY_ACTIVE' | 'TRACK_DATA_UNREADABLE' | 'TRACK_SCHEMA_UNSUPPORTED' | 'OFFICIAL_NOT_AVAILABLE';
export type PauseLapRejection = 'NO_ACTIVE_LAP' | 'NOT_TRAINING' | 'LAP_ENDED' | 'ALREADY_PAUSED';
export type ResumeLapRejection = 'NO_ACTIVE_LAP' | 'LAP_ENDED' | 'NOT_PAUSED';
export type RepositionRejection = 'NO_ACTIVE_LAP' | 'LAP_ENDED' | 'NOT_RUNNING';
export type EndTrainingRejection = 'NO_ACTIVE_LAP' | 'NOT_TRAINING' | 'LAP_ENDED';
export type LapCommandResult<R extends string> = { ok: true; lap: LapSession } | { ok: false; code: R };

const reject = <R extends string>(code: R): LapCommandResult<R> => ({ ok: false, code });
const accept = <R extends string>(lap: LapSession): LapCommandResult<R> => ({ ok: true, lap });

// Each absent limit uses its own default, independently (REQ-FEAT-0008-04).
export function resolveCutLimits(reading: { cutDistanceM?: number; cutDurationMs?: number }): { distanceM: number; durationMs: number } {
  return {
    distanceM: reading.cutDistanceM !== undefined && Number.isFinite(reading.cutDistanceM) && reading.cutDistanceM > 0
      ? reading.cutDistanceM : DEFAULT_CUT_DISTANCE_M,
    durationMs: Number.isInteger(reading.cutDurationMs) && (reading.cutDurationMs as number) > 0
      ? (reading.cutDurationMs as number) : DEFAULT_CUT_DURATION_MS,
  };
}

export function startLap(
  current: LapSession | undefined, request: LapRequest, reading: TrackReading, config: KartConfig, environment: Environment = CIRCUIT,
): LapCommandResult<StartLapRejection> {
  if (current && current.phase !== 'ENDED') return reject('LAP_ALREADY_ACTIVE');
  if (reading.trackDataStatus === 'UNREADABLE') return reject('TRACK_DATA_UNREADABLE');
  if (reading.trackDataStatus === 'UNSUPPORTED_SCHEMA') return reject('TRACK_SCHEMA_UNSUPPORTED');
  // The data the request names must be the data that was read; no new code is created for a mismatch.
  if (request.trackId !== reading.trackId || request.trackVersion !== reading.trackVersion) return reject('TRACK_DATA_UNREADABLE');
  if (request.lapKind === 'OFFICIAL' && reading.trackDataStatus === 'INCOMPLETE') return reject('OFFICIAL_NOT_AVAILABLE');

  const cut = resolveCutLimits(reading);
  // INCOMPLETE: the declared lines when the reading declares direction and finish line, else none (ADR-0004, item 3).
  const declaresLines = reading.trackDataStatus === 'COMPLETE' || (reading.direction !== undefined && reading.finishLine !== undefined);
  const lines: LapLines = declaresLines
    ? { finishLine: reading.finishLine, sectorLimits: reading.sectorLimits ?? [], markers: reading.markers ?? [], cutDistanceM: cut.distanceM, cutDurationMs: cut.durationMs }
    : { sectorLimits: [], markers: [], cutDistanceM: cut.distanceM, cutDurationMs: cut.durationMs };
  const kart = kartAtStart(reading.startPosition);
  const lap: LapSession = {
    lapKind: request.lapKind,
    trackId: reading.trackId,
    trackVersion: reading.trackVersion,
    ...(request.challengeNumber !== undefined ? { challengeNumber: request.challengeNumber } : {}),
    // Copied from the request without interpretation, like challengeNumber (API-0002 1.1.0; FB-01 of dirigibilidade).
    ...(request.setupId !== undefined ? { setupId: request.setupId } : {}),
    ...(request.setupVersion !== undefined ? { setupVersion: request.setupVersion } : {}),
    trackStatus: reading.trackDataStatus,
    lines,
    config: Object.freeze({ ...config }),
    environment,
    phase: 'COUNTDOWN',
    validity: 'VALID',
    countdownSteps: 0,
    stepCount: 0,
    lapSequenceCount: 1,
    lapStartMs: 0,
    markersPassedCount: 0,
    sectorBoundsMs: [],
    offTrackSteps: 0,
    kart,
    results: [],
  };
  return accept(lap);
}

// The kart at rest on the declared start, or on the synthetic start without one (DES-0004 of pista-kart-park).
export function kartAtStart(start: StartPosition | undefined): State {
  return start ? { ...initialState(), x: start.xM, z: start.zM, heading: start.headingDeg * Math.PI / 180 } : initialState();
}

// Rejections in the precedence order of API-0002: the pause button exists only in training, in any phase.
export function pauseLap(lap: LapSession | undefined, cause: PauseCause): LapCommandResult<PauseLapRejection> {
  if (!lap) return reject('NO_ACTIVE_LAP');
  if (cause === 'PAUSE_BUTTON' && lap.lapKind !== 'TRAINING') return reject('NOT_TRAINING');
  if (lap.phase === 'ENDED') return reject('LAP_ENDED');
  if (lap.phase === 'PAUSED') return reject('ALREADY_PAUSED');
  return accept({ ...lap, phase: 'PAUSED', resumePhase: lap.phase, pauseCause: cause });
}

export function resumeLap(lap: LapSession | undefined): LapCommandResult<ResumeLapRejection> {
  if (!lap) return reject('NO_ACTIVE_LAP');
  if (lap.phase === 'ENDED') return reject('LAP_ENDED');
  if (lap.phase !== 'PAUSED') return reject('NOT_PAUSED');
  const { resumePhase, pauseCause: _cause, ...rest } = lap;
  return accept({ ...rest, phase: resumePhase ?? 'RUNNING' });
}

// Ends the training between two steps: the lap in progress gets no result and no lap starts after it (RULE-0005).
export function endTraining(lap: LapSession | undefined): LapCommandResult<EndTrainingRejection> {
  if (!lap) return reject('NO_ACTIVE_LAP');
  if (lap.lapKind !== 'TRAINING') return reject('NOT_TRAINING');
  if (lap.phase === 'ENDED') return reject('LAP_ENDED');
  const { resumePhase: _resume, pauseCause: _cause, ...rest } = lap;
  return accept({ ...rest, phase: 'ENDED' });
}

export function repositionKart(lap: LapSession | undefined): LapCommandResult<RepositionRejection> {
  if (!lap) return reject('NO_ACTIVE_LAP');
  if (lap.phase === 'ENDED') return reject('LAP_ENDED');
  if (lap.phase !== 'RUNNING') return reject('NOT_RUNNING');
  if (lap.lapKind === 'OFFICIAL') return accept(invalidate(lap, 'REPOSITION'));
  // Destination (ADR-0004): nearest centerline point, heading along the centerline in travel sense, speed 0.
  // The centerline is the one of the lap's track file when the environment carries it, else the synthetic one.
  const from: Point = { x: lap.kart.x, z: lap.kart.z };
  const destination = nearestOnTrack(lap.environment, from);
  const kart: State = { ...initialState(), x: destination.position.x, z: destination.position.z, heading: destination.headingRad, elapsed: lap.kart.elapsed };
  const moved: LapSession = { ...lap, kart, offTrackSteps: 0 };
  // Every displacement of the kart is evaluated for line crossings, this one at the instant of the request.
  return accept(evaluateDisplacement(moved, from, destination.position, () => toMs(lap.stepCount)));
}

function nearestOnTrack(environment: Environment, from: Point): { position: Point; headingRad: number } {
  if (environment.track) {
    const near = nearestOnCenterline(environment.track, from);
    return { position: near.position, headingRad: near.headingRad };
  }
  const near = nearest(from);
  const a = track[near.index], b = track[(near.index + 1) % track.length];
  return { position: near.position, headingRad: Math.atan2(b.x - a.x, b.z - a.z) };
}

export function stepLap(lap: LapSession, input: Input): LapSession {
  if (lap.phase === 'COUNTDOWN') {
    const countdownSteps = lap.countdownSteps + 1;
    if (countdownSteps >= COUNTDOWN_STEPS) return { ...lap, countdownSteps: COUNTDOWN_STEPS, phase: 'RUNNING', stepCount: 0 };
    return { ...lap, countdownSteps };
  }
  if (lap.phase !== 'RUNNING') return lap;
  const k = lap.stepCount;
  const next = step(lap.kart, input, STEP, lap.config, lap.environment);
  const advanced: LapSession = { ...lap, kart: next, stepCount: k + 1 };
  const crossed = evaluateDisplacement(advanced, lap.kart, next, fraction => interpolateMs(k, fraction));
  return crossed.phase === 'RUNNING' ? evaluateCut(crossed, next) : crossed;
}

export function getLapState(lap: LapSession | undefined): LapStateView | { code: 'NO_ACTIVE_LAP' } {
  if (!lap) return { code: 'NO_ACTIVE_LAP' };
  // Only an official or recon lap ends on its own result; an ended training keeps the time of the lap in progress.
  const endedOn = lap.phase === 'ENDED' && lap.lapKind !== 'TRAINING' ? lap.results[lap.results.length - 1] : undefined;
  const completedSectorMs = endedOn?.sectorMs ? [...endedOn.sectorMs] : completedSectors(lap);
  const elapsedMs = endedOn?.lapMs !== undefined ? endedOn.lapMs : toMs(lap.stepCount) - lap.lapStartMs;
  const bestValidLapMs = bestValidLap(lap);
  return {
    lapPhase: lap.phase,
    ...(lap.resumePhase !== undefined ? { resumePhase: lap.resumePhase } : {}),
    ...(lap.pauseCause !== undefined ? { pauseCause: lap.pauseCause } : {}),
    lapKind: lap.lapKind,
    lapValidity: lap.validity,
    ...(lap.invalidReason !== undefined ? { invalidReason: lap.invalidReason } : {}),
    countdownRemainingMs: COUNTDOWN_MS - toMs(lap.countdownSteps),
    elapsedMs,
    stepCount: lap.stepCount,
    completedSectorMs,
    markersPassedCount: lap.markersPassedCount,
    lapSequenceCount: lap.lapSequenceCount,
    lapStartMs: lap.lapStartMs,
    ...(bestValidLapMs !== undefined ? { bestValidLapMs } : {}),
    trackId: lap.trackId,
    trackVersion: lap.trackVersion,
  };
}

// Sector times of the lap in progress, b0 = lapStartMs, up to the first sector without both bounds.
function completedSectors(lap: LapSession): number[] {
  const times: number[] = [];
  let previous = lap.lapStartMs;
  for (const bound of lap.sectorBoundsMs) {
    if (bound === null) break;
    times.push(bound - previous);
    previous = bound;
  }
  return times;
}

// Derived on every read, never stored (ADR-0006): the smallest trainingLapMs among the VALID results of a training
// that is not ENDED.
function bestValidLap(lap: LapSession): number | undefined {
  if (lap.lapKind !== 'TRAINING' || lap.phase === 'ENDED') return undefined;
  let best: number | undefined;
  for (const r of lap.results) {
    if (r.lapValidity === 'VALID' && r.trainingLapMs !== undefined && (best === undefined || r.trainingLapMs < best)) best = r.trainingLapMs;
  }
  return best;
}

export function getLapResult(lap: LapSession | undefined): LapResult | { code: 'NO_RESULT' } {
  return lap?.results[lap.results.length - 1] ?? { code: 'NO_RESULT' };
}

export function listLapResults(lap: LapSession | undefined): { lapResults: LapResult[] } {
  return { lapResults: lap ? [...lap.results] : [] };
}

// COMPLETE offers TRAINING plus whatever the daily challenge defines; INCOMPLETE offers TRAINING only.
export function offeredLapKinds(reading: TrackReading, challengeKinds: readonly LapKind[] = []): LapKind[] {
  if (reading.trackDataStatus === 'COMPLETE') return [...new Set<LapKind>(['TRAINING', ...challengeKinds])];
  if (reading.trackDataStatus === 'INCOMPLETE') return ['TRAINING'];
  return [];
}

// Distance of the kart centre beyond the track edge, in metres; 0 on the track.
export function edgeDistanceM(point: Point): number {
  return Math.max(0, nearest(point).distance - WIDTH / 2);
}

// Marker, then sector limit, then finish, for one displacement from `from` to `to` (DES-0003).
function evaluateDisplacement(session: LapSession, from: Point, to: Point, instantMsAt: (fraction: number) => number): LapSession {
  let s = session;
  const nextMarker = s.lines.markers[s.markersPassedCount];
  if (nextMarker) {
    const c = crossLine(nextMarker, from, to);
    if (c && c.sense === 'FORWARD') s = { ...s, markersPassedCount: s.markersPassedCount + 1 };
  }
  // Candidates are the limits after the highest registered one; skipped positions stay unregistered (REQ-FEAT-0002-14).
  for (let j = s.sectorBoundsMs.length; j < s.lines.sectorLimits.length; j++) {
    const c = crossLine(s.lines.sectorLimits[j], from, to);
    if (c && c.sense === 'FORWARD') {
      const skipped = new Array<null>(j - s.sectorBoundsMs.length).fill(null);
      s = { ...s, sectorBoundsMs: [...s.sectorBoundsMs, ...skipped, instantMsAt(c.fraction)] };
      break;
    }
  }
  if (s.lines.finishLine) {
    const c = crossLine(s.lines.finishLine, from, to);
    if (c && c.sense === 'FORWARD') {
      const finishMs = instantMsAt(c.fraction);
      const allMarkers = s.markersPassedCount === s.lines.markers.length;
      if (s.lapKind !== 'TRAINING') s = allMarkers ? complete(s, finishMs) : invalidate(s, 'MISSED_MARKER');
      // A training lap already INVALID keeps its first reason (CUT); otherwise VALID with every marker, else MISSED_MARKER.
      else if (s.validity === 'INVALID') s = closeTrainingLap(s, finishMs, 'INVALID', s.invalidReason);
      else s = allMarkers ? closeTrainingLap(s, finishMs, 'VALID') : closeTrainingLap(s, finishMs, 'INVALID', 'MISSED_MARKER');
    }
  }
  return s;
}

// Cut accumulator after the line crossings of a RUNNING step (DES-0004); strict comparisons, integer time.
// The edge is the one of the lap's environment: the track file geometry (curbs included) or the synthetic track.
function evaluateCut(session: LapSession, kart: Point): LapSession {
  if (trackEdgeDistanceM(session.environment, kart) <= session.lines.cutDistanceM) {
    return session.offTrackSteps === 0 ? session : { ...session, offTrackSteps: 0 };
  }
  const offTrackSteps = session.offTrackSteps + 1;
  if (!isCutExceeded(offTrackSteps, session.lines.cutDurationMs)) return { ...session, offTrackSteps };
  if (session.lapKind !== 'TRAINING') return invalidate({ ...session, offTrackSteps }, 'CUT');
  // Training: the cut invalidates the lap in progress without ending it; a new cut on an INVALID lap changes nothing else.
  if (session.validity === 'INVALID') return { ...session, offTrackSteps };
  return { ...session, offTrackSteps, validity: 'INVALID', invalidReason: 'CUT' };
}

function complete(session: LapSession, finishMs: number): LapSession {
  const ended: LapSession = { ...session, phase: 'ENDED', validity: 'VALID' };
  return { ...ended, results: [...session.results, buildResult(ended, finishMs)] };
}

function invalidate(session: LapSession, reason: InvalidReason): LapSession {
  const ended: LapSession = { ...session, phase: 'ENDED', validity: 'INVALID', invalidReason: reason };
  return { ...ended, results: [...session.results, buildResult(ended)] };
}

// Closes the training lap in progress on the finish line and opens the next one at the same integer instant (DES-0003):
// the phase stays RUNNING, and stepCount, offTrackSteps and the kart are left as they are.
function closeTrainingLap(session: LapSession, finishMs: number, validity: LapValidity, reason?: InvalidReason): LapSession {
  const { invalidReason: _reason, ...open } = session;
  const closing: LapSession = { ...open, validity, ...(validity === 'INVALID' && reason !== undefined ? { invalidReason: reason } : {}) };
  return {
    ...open,
    results: [...session.results, buildResult(closing, finishMs)],
    lapSequenceCount: session.lapSequenceCount + 1,
    lapStartMs: finishMs,
    markersPassedCount: 0,
    sectorBoundsMs: [],
    validity: 'VALID',
  };
}

// The LapResult of the lap that ends (DM-0002), b0 = lapStartMs: official only with OFFICIAL, VALID and COMPLETE data.
function buildResult(session: LapSession, finishMs?: number): LapResult {
  const valid = session.validity === 'VALID';
  const result: LapResult = {
    trackId: session.trackId,
    trackVersion: session.trackVersion,
    ...(session.challengeNumber !== undefined ? { challengeNumber: session.challengeNumber } : {}),
    ...(session.setupId !== undefined ? { setupId: session.setupId } : {}),
    ...(session.setupVersion !== undefined ? { setupVersion: session.setupVersion } : {}),
    lapKind: session.lapKind,
    lapValidity: session.validity,
    ...(!valid && session.invalidReason !== undefined ? { invalidReason: session.invalidReason } : {}),
    official: session.lapKind === 'OFFICIAL' && valid && session.trackStatus === 'COMPLETE',
  };
  if (finishMs === undefined) return result;
  const b0 = session.lapStartMs;
  // Sector i is b(i) - b(i-1) when both bounds are registered, else null; only on a track declaring the 3 limits.
  const bounds = [b0, ...[0, 1, 2].map(i => session.sectorBoundsMs[i] ?? null), finishMs];
  const sectorTimes = session.lines.sectorLimits.length === 3
    ? [1, 2, 3, 4].map(i => { const a = bounds[i - 1], b = bounds[i]; return a === null || b === null ? null : b - a; })
    : undefined;
  if (valid) {
    result.lapMs = finishMs - b0;
    if (sectorTimes && sectorTimes.every(t => t !== null)) result.sectorMs = sectorTimes as number[];
  }
  if (session.lapKind === 'TRAINING') {
    result.lapSequenceCount = session.lapSequenceCount;
    result.lapStartMs = b0;
    result.trainingLapMs = finishMs - b0;
    if (sectorTimes) result.trainingSectorMs = sectorTimes;
  }
  return result;
}
