// TEST-0007 — the training session and the track catalogue of API-0002: the two options, the Kart Park at the opening, the lap
// of the chosen track, the switch that resets the kart and discards the lap, and the failure codes (strategy: session, unit,
// integration and contract levels, RULE-0003, DES-0005, DM-0002).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CIRCUIT, initialState } from '../src/physics';
import { getLapResult, getLapState, kartAtStart, offeredLapKinds, pauseLap, type LapSession } from '../src/lap';
import { SYNTHETIC_TRACK_FILE } from '../src/track';
import {
  getTrainingTrackOptions, initialTrainingSession, OPENING_TRACK_ID, selectTrainingTrack, startTrainingLap, TRAINING_TRACKS, trainingIdleKart,
  type TrainingSession, type TrainingTrackSources,
} from '../src/trainingSession';
import { corruptedText, kartParkFile, kartParkGeometry, kartParkText, withSchema4 } from './fixtures/kartParkFiles';
import { drive, IDLE, kartAtLapM, kartParkPilot, KART_PARK_CONFIG, runCountdown, seedLap, constant } from './helpers/kartParkPilot';

const sources: TrainingTrackSources = { 'kart-park': kartParkText(), synthetic: SYNTHETIC_TRACK_FILE };
const file = kartParkFile();
const near = (a: number, b: number, tol: number) => Math.abs(a - b) <= tol;
function ready(trackId: 'kart-park' | 'synthetic', from: TrainingSession = initialTrainingSession(), lap?: LapSession): TrainingSession {
  const r = selectTrainingTrack(from, lap, trackId, sources);
  if (!r.ok) throw new Error(`fixture: selection of ${trackId} failed with ${r.code}`);
  return r.session;
}
function lapOf(session: TrainingSession, lap?: LapSession): LapSession {
  const r = startTrainingLap(session, lap, KART_PARK_CONFIG);
  if (!r.ok) throw new Error(`fixture: startTrainingLap rejected with ${r.code}`);
  return r.lap;
}

test('CHK-TEST-0007-01 the catalogue offers exactly two options, the Kart Park and the synthetic track, with the contract fields and nothing else', () => {
  // AC-US-0001-01
  const view = getTrainingTrackOptions(initialTrainingSession());
  assert.deepEqual(view.options.map(o => o.trackId), ['kart-park', 'synthetic'], 'AC-US-0001-01: two options, Kart Park first');
  assert.deepEqual(Object.keys(view.options[0]).sort(), ['displayLengthM', 'displayName', 'osmCredit', 'trackId'], 'AC-US-0001-01: the Kart Park entry has the four contract fields');
  assert.deepEqual(Object.keys(view.options[1]).sort(), ['displayName', 'osmCredit', 'trackId'], 'AC-US-0001-01: the synthetic entry has no display length');
  assert.deepEqual(Object.keys(view).sort(), ['options', 'selectedTrackId', 'sessionState'], 'AC-US-0001-01: no data status before a session');
  assert.equal(view.sessionState, 'NO_SESSION', 'AC-US-0001-01: no session at the start');
  assert.ok(Object.isFrozen(TRAINING_TRACKS) && TRAINING_TRACKS.every(o => Object.isFrozen(o)), 'AC-US-0001-01: the catalogue is fixed');
  assert.ok(!JSON.stringify(TRAINING_TRACKS).match(/record|recorde|41[.,]45/i), 'AC-US-0006-09: no record in the catalogue');
});

test('CHK-TEST-0007-02 at the opening the selected track is the Kart Park, and selecting it loads the published file: READY, COMPLETE, version 1, kart on its start', () => {
  // AC-US-0001-02
  assert.equal(initialTrainingSession().selectedTrackId, 'kart-park', 'AC-US-0001-02: the opening selection is the Kart Park');
  assert.equal(OPENING_TRACK_ID, 'kart-park', 'AC-US-0001-02: OPENING_TRACK_ID');
  const r = selectTrainingTrack(initialTrainingSession(), undefined, OPENING_TRACK_ID, sources);
  assert.ok(r.ok, 'AC-US-0001-02: the opening selection succeeds');
  if (!r.ok) return;
  assert.deepEqual(r.response, { sessionState: 'READY', trackId: 'kart-park', trackVersion: 1, trackDataStatus: 'COMPLETE' }, 'AC-US-0001-02: the response of API-0002');
  assert.equal(r.lap, undefined, 'AC-US-0001-02: no lap after a selection');
  assert.equal(getTrainingTrackOptions(r.session).selectedTrackId, 'kart-park', 'AC-US-0001-02: the catalogue shows the Kart Park selected');
  assert.equal(getTrainingTrackOptions(r.session).trackDataStatus, 'COMPLETE', 'AC-US-0001-02: the data status with READY');
  assert.ok(r.session.environment?.track === undefined || r.session.environment.track.centerline.length === file.centerline.length, 'AC-US-0001-02: the environment is the file geometry');
  assert.equal(r.session.environment?.walls, false, 'AC-US-0001-02: no synthetic wall on the Kart Park');
  const kart = trainingIdleKart(r.session)!;
  assert.ok(near(kart.x, file.startPosition.xM, 1e-9) && near(kart.z, file.startPosition.zM, 1e-9), 'AC-US-0001-02: the idle kart stands on the start of the file');
  assert.ok(near(kart.heading, file.startPosition.headingDeg * Math.PI / 180, 1e-9), 'AC-US-0001-02: with the heading of the file');
  assert.equal(kart.speed, 0, 'AC-US-0001-02: at rest');
});

test('CHK-TEST-0007-03 a training lap started on the Kart Park session has the trackId of the Kart Park and runs on its environment', () => {
  // AC-US-0001-03
  const session = ready('kart-park');
  const lap = lapOf(session);
  const view = getLapState(lap);
  assert.ok(!('code' in view), 'AC-US-0001-03: the lap exists');
  if ('code' in view) return;
  assert.equal(view.trackId, 'kart-park', 'AC-US-0001-03: trackId of the Kart Park');
  assert.equal(view.trackVersion, 1, 'AC-US-0001-03: trackVersion 1');
  assert.equal(view.lapKind, 'TRAINING', 'AC-US-0001-03: TRAINING');
  assert.equal(lap.environment, session.environment, 'AC-US-0001-03: the lap runs on the session environment');
  assert.ok(lap.environment.track !== undefined && lap.environment.walls === false, 'AC-US-0001-03: the file geometry, no wall');
  assert.deepEqual(lap.kart, session.startKart, 'AC-US-0001-03: the lap starts from the session start kart');
});

test('CHK-TEST-0007-04 a training lap started on the synthetic session has the trackId of the synthetic track and runs on the synthetic circuit', () => {
  // AC-US-0001-04
  const session = ready('synthetic');
  assert.equal(session.environment, CIRCUIT, 'AC-US-0001-04: the synthetic environment');
  const lap = lapOf(session);
  const view = getLapState(lap);
  if ('code' in view) throw new Error('fixture');
  assert.equal(view.trackId, 'synthetic', 'AC-US-0001-04: trackId of the synthetic track');
  assert.equal(view.trackVersion, SYNTHETIC_TRACK_FILE.trackVersion, 'AC-US-0001-04: the synthetic version');
  assert.equal(lap.environment.walls, true, 'AC-US-0001-04: the synthetic wall');
  assert.equal(lap.environment.track, undefined, 'AC-US-0001-04: no file geometry');
  assert.deepEqual(trainingIdleKart(session), kartAtStart(SYNTHETIC_TRACK_FILE.startPosition), 'AC-US-0001-04: the synthetic start of the synthetic file');
});

test('CHK-TEST-0007-05 every lap of a session is TRAINING without a challenge number and never official, completed, invalidated or discarded, on both tracks', () => {
  // AC-US-0001-05
  const results: ReturnType<typeof getLapResult>[] = [];
  for (const trackId of ['kart-park', 'synthetic'] as const) {
    const session = ready(trackId);
    const completed = trackId === 'kart-park'
      ? drive(runCountdown(lapOf(session)), kartParkPilot(kartParkGeometry()), 9000).lap
      : drive(runCountdown(lapOf(session)), constant(IDLE), 10).lap;
    assert.equal(completed.lapKind, 'TRAINING', `AC-US-0001-05: ${trackId}: the lap is TRAINING`);
    assert.equal(completed.challengeNumber, undefined, `AC-US-0001-05: ${trackId}: no challenge number`);
    results.push(getLapResult(completed));
    const far = trackId === 'kart-park' ? kartAtLapM(105, 8) : { ...initialState(), x: 400, z: 400 };
    const invalidated = drive(seedLap(runCountdown(lapOf(session)), { kart: far }), constant(IDLE), 200).lap;
    assert.equal(invalidated.phase, 'ENDED', `AC-US-0001-05: ${trackId}: the far kart is cut`);
    results.push(getLapResult(invalidated));
    const running = drive(runCountdown(lapOf(session)), constant(IDLE), 5).lap;
    const switched = selectTrainingTrack(session, running, trackId === 'kart-park' ? 'synthetic' : 'kart-park', sources);
    assert.ok(switched.ok && switched.lap === undefined, `AC-US-0001-05: ${trackId}: the switch discards the running lap`);
    results.push(getLapResult(running));
  }
  for (const r of results) {
    if ('code' in r) { assert.equal(r.code, 'NO_RESULT', 'AC-US-0001-05: a discarded lap has no result'); continue; }
    assert.equal(r.lapKind, 'TRAINING', 'AC-US-0001-05: TRAINING result');
    assert.equal(r.official, false, 'AC-US-0001-05: never official');
    assert.ok(!('challengeNumber' in r), 'AC-US-0001-05: no challenge number in the result');
  }
  assert.ok(results.some(r => !('code' in r) && r.lapValidity === 'VALID'), 'AC-US-0001-05: a completed lap was judged');
  assert.ok(results.some(r => !('code' in r) && r.lapValidity === 'INVALID'), 'AC-US-0001-05: an invalidated lap was judged');
});

test('CHK-TEST-0007-06 after a switch the session kart stands on the start of the chosen track, at rest, and the idle kart is that one', () => {
  // AC-US-0001-06
  let session = ready('kart-park');
  session = ready('synthetic', session);
  const syntheticStart = SYNTHETIC_TRACK_FILE.startPosition;
  assert.deepEqual(session.startKart, kartAtStart(syntheticStart), 'AC-US-0001-06: the synthetic start after the switch');
  assert.ok(near(session.startKart!.x, syntheticStart.xM, 1e-9) && near(session.startKart!.z, syntheticStart.zM, 1e-9), 'AC-US-0001-06: on the synthetic start position');
  session = ready('kart-park', session);
  const kart = session.startKart!;
  assert.ok(near(kart.x, file.startPosition.xM, 1e-9) && near(kart.z, file.startPosition.zM, 1e-9) && near(kart.heading, file.startPosition.headingDeg * Math.PI / 180, 1e-9), 'AC-US-0001-06: the Kart Park start after the switch back');
  assert.equal(kart.speed, 0, 'AC-US-0001-06: at rest');
  assert.equal(kart.stepCount, 0, 'AC-US-0001-06: a fresh state');
  assert.equal(trainingIdleKart(session), session.startKart, 'AC-US-0001-06: the idle kart is the start kart');
  assert.equal(trainingIdleKart(initialTrainingSession()), undefined, 'AC-US-0001-06: no kart without a session');
});

test('CHK-TEST-0007-07 switching track with a lap in COUNTDOWN, RUNNING or PAUSED discards it: no active lap and no result', () => {
  // AC-US-0001-07
  const session = ready('kart-park');
  const countdown = lapOf(session);
  const running = drive(runCountdown(lapOf(session)), constant(IDLE), 100).lap;
  const pausedResult = pauseLap(running, 'ESC_KEY');
  if (!pausedResult.ok) throw new Error('fixture: pause');
  for (const [phase, lap] of [['COUNTDOWN', countdown], ['RUNNING', running], ['PAUSED', pausedResult.lap]] as const) {
    assert.equal(lap.phase, phase, `AC-US-0001-07: fixture in ${phase}`);
    const r = selectTrainingTrack(session, lap, 'synthetic', sources);
    assert.ok(r.ok, `AC-US-0001-07: the switch from ${phase} succeeds`);
    if (!r.ok) return;
    assert.equal(r.lap, undefined, `AC-US-0001-07: no lap after the switch from ${phase}`);
    assert.deepEqual(getLapState(r.lap), { code: 'NO_ACTIVE_LAP' }, `AC-US-0001-07: NO_ACTIVE_LAP from ${phase}`);
    assert.deepEqual(getLapResult(r.lap), { code: 'NO_RESULT' }, `AC-US-0001-07: no result from ${phase}`);
    assert.equal(r.session.selectedTrackId, 'synthetic', `AC-US-0001-07: the new track is selected from ${phase}`);
  }
});

test('CHK-TEST-0007-08 selecting the READY track again changes nothing and keeps the lap; an unknown track is refused without touching the session', () => {
  // AC-US-0001-07
  const session = ready('kart-park');
  const lap = drive(runCountdown(lapOf(session)), constant(IDLE), 10).lap;
  const same = selectTrainingTrack(session, lap, 'kart-park', sources);
  assert.ok(same.ok, 'API-0002: the same track is accepted');
  if (!same.ok) return;
  assert.equal(same.session, session, 'API-0002: the session object is kept');
  assert.equal(same.lap, lap, 'API-0002: the lap is kept');
  assert.deepEqual(same.response, { sessionState: 'READY', trackId: 'kart-park', trackVersion: 1, trackDataStatus: 'COMPLETE' }, 'API-0002: the READY response');
  const unknown = selectTrainingTrack(session, lap, 'moon', sources);
  assert.deepEqual(unknown, { ok: false, code: 'UNKNOWN_TRACK', session, lap }, 'API-0002: UNKNOWN_TRACK keeps session and lap');
});

test('CHK-TEST-0007-09 an unreadable or unsupported Kart Park source gives a FAILED session with the code of API-0002, no lap, and no training lap can start', () => {
  // AC-US-0001-03
  const broken = selectTrainingTrack(initialTrainingSession(), undefined, 'kart-park', { 'kart-park': corruptedText(), synthetic: SYNTHETIC_TRACK_FILE });
  assert.ok(!broken.ok, 'REQ-FEAT-0001-14: a corrupted source fails');
  if (broken.ok) return;
  assert.equal(broken.code, 'TRACK_DATA_UNREADABLE', 'REQ-FEAT-0001-14: TRACK_DATA_UNREADABLE');
  assert.deepEqual(broken.response, { sessionState: 'FAILED', trackId: 'kart-park', trackDataStatus: 'UNREADABLE' }, 'REQ-FEAT-0001-14: the FAILED response');
  assert.equal(broken.lap, undefined, 'REQ-FEAT-0001-14: no lap');
  assert.equal(getTrainingTrackOptions(broken.session).trackDataStatus, 'UNREADABLE', 'REQ-FEAT-0001-14: the catalogue reports the status with FAILED');
  assert.deepEqual(startTrainingLap(broken.session, undefined, KART_PARK_CONFIG), { ok: false, code: 'TRACK_DATA_UNREADABLE' }, 'REQ-FEAT-0001-14: no training lap on a FAILED session');
  const unsupported = selectTrainingTrack(initialTrainingSession(), undefined, 'kart-park', { 'kart-park': withSchema4(), synthetic: SYNTHETIC_TRACK_FILE });
  assert.ok(!unsupported.ok && unsupported.code === 'TRACK_SCHEMA_UNSUPPORTED', 'REQ-FEAT-0001-14: schema 4 is TRACK_SCHEMA_UNSUPPORTED');
  if (unsupported.ok) return;
  assert.deepEqual(unsupported.response, { sessionState: 'FAILED', trackId: 'kart-park', trackDataStatus: 'UNSUPPORTED_SCHEMA' }, 'REQ-FEAT-0001-14: the FAILED response for the schema');
  const otherId = selectTrainingTrack(initialTrainingSession(), undefined, 'kart-park', { 'kart-park': { ...file, trackId: 'other' }, synthetic: SYNTHETIC_TRACK_FILE });
  assert.ok(!otherId.ok && otherId.code === 'TRACK_DATA_UNREADABLE', 'REQ-FEAT-0001-14: a file of another trackId is unreadable for the Kart Park');
  assert.deepEqual(startTrainingLap(initialTrainingSession(), undefined, KART_PARK_CONFIG), { ok: false, code: 'TRACK_DATA_UNREADABLE' }, 'REQ-FEAT-0001-14: no lap without a session');
});

test('CHK-TEST-0007-10 a training session offers the training lap only, and a second start while a lap is active is refused', () => {
  // AC-US-0001-05
  const session = ready('kart-park');
  assert.deepEqual(offeredLapKinds(session.reading!, []), ['TRAINING'], 'AC-US-0001-05: the training lap is the only offer of the session');
  const lap = lapOf(session);
  assert.deepEqual(startTrainingLap(session, lap, KART_PARK_CONFIG), { ok: false, code: 'LAP_ALREADY_ACTIVE' }, 'AC-US-0001-05: no second lap while one is active');
  const withSetup = startTrainingLap(session, undefined, KART_PARK_CONFIG, { setupId: 'ARCADE_ASSISTIDO', setupVersion: 'arcade-assistido-v5' });
  assert.ok(withSetup.ok && withSetup.lap.setupId === 'ARCADE_ASSISTIDO' && withSetup.lap.setupVersion === 'arcade-assistido-v5', 'AC-US-0001-05: the setup is copied into the lap as given');
  assert.ok(lap.setupId === undefined && lap.setupVersion === undefined, 'AC-US-0001-05: no setup fields without a setup');
});

test('CHK-TEST-0007-11 the catalogue names the Kart Park as the real track, with 687 m fixed by the product and not derived from the smoothed length', () => {
  // AC-US-0006-07, AC-US-0006-08
  const option = TRAINING_TRACKS.find(o => o.trackId === 'kart-park')!;
  assert.equal(option.displayName, 'Kart Park — São José dos Pinhais (traçado aproximado)', 'AC-US-0006-07: the display name');
  assert.equal(option.displayLengthM, 687, 'AC-US-0006-08: 687 m');
  assert.notEqual(Math.round(kartParkGeometry().lapLengthM), 687, `AC-US-0006-08: the smoothed lap (${kartParkGeometry().lapLengthM.toFixed(3)} m) is not what the label shows`);
  assert.equal(option.osmCredit, true, 'AC-US-0006-07: the Kart Park declares the OSM credit');
  const synthetic = TRAINING_TRACKS.find(o => o.trackId === 'synthetic')!;
  assert.equal(synthetic.displayName, 'Pista sintética', 'AC-US-0006-07: the synthetic name');
  assert.equal(synthetic.osmCredit, false, 'AC-US-0006-07: no credit for the synthetic track');
});
