// Simulation layer: the training session of RULE-0003 and the training catalogue of API-0002 (DES-0005, DM-0002 of
// pista-kart-park). Pure functions over an immutable TrainingSession; nothing is read from or written to the browser.
// No credit text, no screen rule, no label formatting here: those live in src/lapMessages.ts (application).
import { CIRCUIT, trackEnvironment, type Environment, type KartConfig, type SetupRef, type State } from './physics';
import { kartAtStart, startLap, type LapCommandResult, type LapSession, type StartLapRejection } from './lap';
import { readTrackData, type TrackDataSource, type TrackDataStatus, type TrackReading, type TrackVersion } from './trackData';
import { buildTrackGeometry } from './trackGeometry';

export type TrainingTrackId = 'kart-park' | 'synthetic';
export type TrainingTrackOption = { trackId: TrainingTrackId; displayName: string; displayLengthM?: number; osmCredit: boolean };
// The fixed catalogue (REQ-FEAT-0001-01): no record field, no configuration to change the opening track (ADR-0005).
export const TRAINING_TRACKS: readonly TrainingTrackOption[] = Object.freeze([
  Object.freeze({ trackId: 'kart-park' as const, displayName: 'Kart Park — São José dos Pinhais (traçado aproximado)', displayLengthM: 687, osmCredit: true }),
  Object.freeze({ trackId: 'synthetic' as const, displayName: 'Pista sintética', osmCredit: false }),
]);
export const OPENING_TRACK_ID: TrainingTrackId = 'kart-park';

export type SessionState = 'NO_SESSION' | 'LOADING' | 'READY' | 'FAILED';
export type TrainingSession = {
  sessionState: SessionState;
  selectedTrackId: TrainingTrackId;
  reading?: TrackReading;
  environment?: Environment;
  startKart?: State;
};
export type TrainingTrackSources = Readonly<Record<TrainingTrackId, TrackDataSource>>;
export type TrainingTrackOptions = {
  options: readonly TrainingTrackOption[]; selectedTrackId: TrainingTrackId; sessionState: SessionState; trackDataStatus?: TrackDataStatus;
};
export type SelectTrainingTrackResponse =
  | { sessionState: 'READY'; trackId: string; trackVersion: TrackVersion; trackDataStatus: 'COMPLETE' | 'INCOMPLETE' }
  | { sessionState: 'FAILED'; trackId: string; trackDataStatus: 'UNREADABLE' | 'UNSUPPORTED_SCHEMA' };
export type SelectTrainingTrackResult =
  | { ok: true; session: TrainingSession; lap: LapSession | undefined; response: SelectTrainingTrackResponse }
  | { ok: false; code: 'UNKNOWN_TRACK'; session: TrainingSession; lap: LapSession | undefined }
  | { ok: false; code: 'TRACK_DATA_UNREADABLE' | 'TRACK_SCHEMA_UNSUPPORTED'; session: TrainingSession; lap: undefined; response: SelectTrainingTrackResponse };

const isTrainingTrackId = (v: string): v is TrainingTrackId => TRAINING_TRACKS.some(o => o.trackId === v);

export function initialTrainingSession(): TrainingSession {
  return { sessionState: 'NO_SESSION', selectedTrackId: OPENING_TRACK_ID };
}

// API-0002: always both entries; the data status only with READY or FAILED.
export function getTrainingTrackOptions(session: TrainingSession): TrainingTrackOptions {
  const status = session.reading?.trackDataStatus;
  return {
    options: TRAINING_TRACKS, selectedTrackId: session.selectedTrackId, sessionState: session.sessionState,
    ...((session.sessionState === 'READY' || session.sessionState === 'FAILED') && status ? { trackDataStatus: status } : {}),
  };
}

// RULE-0003: a selection ends the current session and discards its lap, whatever the lap phase; the same READY track is
// a no-op. The data comes bundled, so LOADING lasts the call and the reading is synchronous.
export function selectTrainingTrack(session: TrainingSession, lap: LapSession | undefined, trackId: string, sources: TrainingTrackSources): SelectTrainingTrackResult {
  if (!isTrainingTrackId(trackId)) return { ok: false, code: 'UNKNOWN_TRACK', session, lap };
  if (session.sessionState === 'READY' && session.selectedTrackId === trackId && session.reading
    && (session.reading.trackDataStatus === 'COMPLETE' || session.reading.trackDataStatus === 'INCOMPLETE')) {
    const r = session.reading;
    return { ok: true, session, lap, response: { sessionState: 'READY', trackId: r.trackId, trackVersion: r.trackVersion, trackDataStatus: r.trackDataStatus } };
  }
  const reading = readTrackData(sources[trackId]);
  if (reading.trackDataStatus === 'UNSUPPORTED_SCHEMA') {
    const failed: TrainingSession = { sessionState: 'FAILED', selectedTrackId: trackId, reading };
    return { ok: false, code: 'TRACK_SCHEMA_UNSUPPORTED', session: failed, lap: undefined, response: { sessionState: 'FAILED', trackId, trackDataStatus: 'UNSUPPORTED_SCHEMA' } };
  }
  if (reading.trackDataStatus === 'UNREADABLE' || reading.trackId !== trackId) {
    const failed: TrainingSession = { sessionState: 'FAILED', selectedTrackId: trackId, reading: { trackDataStatus: 'UNREADABLE' } };
    return { ok: false, code: 'TRACK_DATA_UNREADABLE', session: failed, lap: undefined, response: { sessionState: 'FAILED', trackId, trackDataStatus: 'UNREADABLE' } };
  }
  // A schema-3 reading carries its geometry; a schema-2 reading is the synthetic circuit.
  const environment = reading.centerline
    ? trackEnvironment(buildTrackGeometry(reading.centerline, reading.curbs ?? [], reading.barriers ?? []))
    : CIRCUIT;
  const ready: TrainingSession = { sessionState: 'READY', selectedTrackId: trackId, reading, environment, startKart: kartAtStart(reading.startPosition) };
  return { ok: true, session: ready, lap: undefined, response: { sessionState: 'READY', trackId: reading.trackId, trackVersion: reading.trackVersion, trackDataStatus: reading.trackDataStatus } };
}

// Every lap of a session is TRAINING, never with a challengeNumber, keyed on the session's trackId and trackVersion.
// `setup` is copied into the request without interpretation, as the application did before this feature.
export function startTrainingLap(session: TrainingSession, lap: LapSession | undefined, config: KartConfig, setup?: SetupRef): LapCommandResult<StartLapRejection> {
  const reading = session.sessionState === 'READY' ? session.reading : undefined;
  if (!reading || !session.environment || reading.trackDataStatus === 'UNREADABLE' || reading.trackDataStatus === 'UNSUPPORTED_SCHEMA') {
    return { ok: false, code: 'TRACK_DATA_UNREADABLE' };
  }
  return startLap(lap, {
    lapKind: 'TRAINING', trackId: reading.trackId, trackVersion: reading.trackVersion,
    ...(setup ? { setupId: setup.setupId, setupVersion: setup.setupVersion } : {}),
  }, reading, config, session.environment);
}

export function trainingIdleKart(session: TrainingSession): State | undefined {
  return session.sessionState === 'READY' ? session.startKart : undefined;
}
