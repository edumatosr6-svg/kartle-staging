// TEST-0008 — the setup version, the records and their comparability (strategy: setup-version, unit and integration,
// DES-0003, DM-0001, RULE-0003, API-0002).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ARCADE_ASSISTIDO_V5, ARCADE_ASSISTIDO_V6, ARCADE_KART, type Input } from '../src/physics';
import { getLapResult, startLap, stepLap } from '../src/lap';
import { COUNTDOWN_STEPS } from '../src/lapTiming';
import {
  buildLapRecord, compareLapRecords, getSetupVersion, MAX_REPLAY_INPUT_STEPS, MAX_REPLAY_TEXT_CHARS, readReplay, replayLap, resolveSetupRef,
} from '../src/setupRecords';
import { runBench, type SetupVersionRecord } from '../scripts/handlingBench';
import { syntheticReading } from './fixtures/trackFiles';
import {
  corruptReplay, futureReplay, incompleteResult, newReplay, newResult, oldReplay, oldResult, oversizedReplay, oversizedReplayText,
  SUPERSEDED_SETUP_VERSION, SYNTHETIC_IDENTITY, v4Replay, v5Replay,
} from './fixtures/records';
import { autopilot } from './helpers/autopilot';
import { ARCADE, ARCADE_CONFIG, options, REALISTA, SETUP_REF, untilFirstResult } from './helpers/handling';

const reading = syntheticReading();
if (reading.trackDataStatus !== 'COMPLETE') throw new Error('fixture: synthetic reading must be COMPLETE');
const previousVersion = ARCADE.previousSetupVersion ?? '';
const IDLE: Input = { throttle: 0, brake: 0, steer: 0 };

test('CHK-TEST-0008-01 the published Arcade setup declares a version different from the previous one, and replays of the two versions are told apart by that field', () => {
  // AC-US-0005-04
  const view = getSetupVersion('ARCADE_ASSISTIDO');
  assert.ok(!('code' in view), 'AC-US-0005-04: the Arcade setup must be known');
  if ('code' in view) return;
  assert.ok(typeof view.previousSetupVersion === 'string' && view.previousSetupVersion.length > 0, 'AC-US-0005-04: the previous version must be declared');
  assert.notEqual(view.setupVersion, view.previousSetupVersion, 'AC-US-0005-04: the current version must differ from the previous one');
  assert.equal(view.setupVersion, ARCADE.setupVersion, 'AC-US-0005-04: the view copies the published data');
  assert.deepEqual(getSetupVersion('OUTRO'), { code: 'UNKNOWN_SETUP' }, 'AC-US-0005-04: an unknown setup is rejected with its code');
  assert.equal(view.setupVersion, 'arcade-assistido-v6', 'AC-US-0005-04: the published Arcade is arcade-assistido-v6 (DOMAIN/DEC-15)');
  assert.equal(view.previousSetupVersion, 'arcade-assistido-v4', 'AC-US-0005-04: the previous version is the one before the feature');
  const readings = [readReplay(v4Replay()), readReplay(v5Replay()), readReplay(newReplay())];
  assert.ok(readings.every(r => r.replayStatus === 'READABLE'), 'AC-US-0005-04: the three replays must be readable');
  const versions = readings.map(r => (r.replayStatus === 'READABLE' ? r.setupVersion : ''));
  assert.deepEqual(versions, [previousVersion, SUPERSEDED_SETUP_VERSION, ARCADE.setupVersion], 'AC-US-0005-04: each replay declares its own version');
  assert.equal(new Set(versions).size, 3, 'AC-US-0005-04: the three replays must carry three different versions');
  assert.ok(readings.every(r => r.replayStatus === 'READABLE' && r.setupVersionSource === 'DECLARED'), 'AC-US-0005-04: a declared version is read as DECLARED');
  assert.equal(ARCADE.config, ARCADE_ASSISTIDO_V6, 'AC-US-0005-04: the published configuration is the v6 record');
  const changed = Object.keys(ARCADE_ASSISTIDO_V6).filter(k => (ARCADE_ASSISTIDO_V6 as Record<string, unknown>)[k] !== (ARCADE_ASSISTIDO_V5 as Record<string, unknown>)[k]);
  assert.equal(changed.length, 5, `AC-US-0005-04: v6 must differ from v5 in exactly the five fields of DOMAIN/DEC-15 (differs in ${changed.join(', ')})`);
  assert.deepEqual(Object.keys(ARCADE_ASSISTIDO_V6).sort(), Object.keys(ARCADE_ASSISTIDO_V5).sort(), 'AC-US-0005-04: v6 declares no field v5 does not');
  const record = runBench('SETUP_VERSION', options('BINARY', { oldRecords: [oldReplay(), oldResult()] }))[0] as SetupVersionRecord;
  assert.equal(record.verdict, 'PASS', 'AC-US-0005-04: SETUP_VERSION must be PASS');
  assert.notEqual(record.declaredSetupVersion, record.previousSetupVersion, 'AC-US-0005-04: the record declares two different versions');
  assert.equal(record.declaredSetupVersion, ARCADE.setupVersion, 'AC-US-0005-04: declaredSetupVersion is the published current version');
});

test('CHK-TEST-0008-02 a lap started with the setup fields returns them copied in its result, one started without them has no such fields, and the record builder fills only what the result lacks', () => {
  // AC-US-0005-04
  const request = { lapKind: 'TRAINING' as const, ...SYNTHETIC_IDENTITY };
  const complete = (withSetup: boolean) => {
    const started = startLap(undefined, { ...request, ...(withSetup ? SETUP_REF : {}) }, reading, ARCADE_CONFIG);
    if (!started.ok) throw new Error(`fixture: startLap rejected: ${started.code}`);
    let lap = started.lap;
    for (let i = 0; i < COUNTDOWN_STEPS; i++) lap = stepLap(lap, IDLE);
    lap = untilFirstResult(lap, autopilot(0, ARCADE_CONFIG), 6000).lap;
    return getLapResult(lap);
  };
  const withFields = complete(true), without = complete(false);
  assert.ok(!('code' in withFields) && !('code' in without), 'AC-US-0005-04: both laps must end with a result');
  if ('code' in withFields || 'code' in without) return;
  assert.equal(withFields.setupId, SETUP_REF.setupId, 'AC-US-0005-04: setupId must be copied from the request');
  assert.equal(withFields.setupVersion, SETUP_REF.setupVersion, 'AC-US-0005-04: setupVersion must be copied from the request');
  assert.ok(!('setupId' in without) && !('setupVersion' in without), 'AC-US-0005-04: without the fields in the request the result has none');
  assert.deepEqual({ lapMs: without.lapMs, sectorMs: without.sectorMs, lapValidity: without.lapValidity }, { lapMs: withFields.lapMs, sectorMs: withFields.sectorMs, lapValidity: withFields.lapValidity }, 'AC-US-0005-04: the fields never change the lap itself');
  const copied = buildLapRecord(newResult(), { setupId: 'REALISTA_ALUGUEL_4T', setupVersion: 'other-version' });
  assert.deepEqual(copied, newResult(), 'AC-US-0005-04: a result that already carries the fields is copied unchanged');
  const filled = buildLapRecord(oldResult(), SETUP_REF);
  assert.deepEqual({ setupId: filled.setupId, setupVersion: filled.setupVersion }, SETUP_REF, 'AC-US-0005-04: a result without the fields receives them from the setup reference');
  assert.deepEqual({ ...filled, setupId: undefined, setupVersion: undefined }, { ...oldResult(), setupId: undefined, setupVersion: undefined }, 'AC-US-0005-04: nothing else of the result changes');
  const replayed = replayLap(newReplay(), reading, ARCADE);
  assert.ok(replayed.ok, 'AC-US-0005-04: the current replay must reproduce');
  if (replayed.ok) assert.equal(replayed.record.setupVersion, ARCADE.setupVersion, 'AC-US-0005-04: the reproduced record carries the current version from the result');
});

test('CHK-TEST-0008-03 two records are comparable only on the same track, setup and version; a previous-version replay reproduced today is SETUP_VERSION_DIFFERS', () => {
  // AC-US-0005-05
  const a = { ...SYNTHETIC_IDENTITY, ...SETUP_REF };
  assert.deepEqual(compareLapRecords(a, { ...a }), { comparability: 'COMPARABLE' }, 'AC-US-0005-05: same track, setup and version: COMPARABLE');
  assert.deepEqual(compareLapRecords(a, { ...a, setupVersion: previousVersion }), { comparability: 'SETUP_VERSION_DIFFERS' }, 'AC-US-0005-05: another version: SETUP_VERSION_DIFFERS');
  assert.deepEqual(compareLapRecords({ ...a, setupVersion: SUPERSEDED_SETUP_VERSION }, a), { comparability: 'SETUP_VERSION_DIFFERS' }, 'AC-US-0005-05: a v5 record against a v6 one: SETUP_VERSION_DIFFERS');
  assert.deepEqual(compareLapRecords(a, { ...a, setupId: 'REALISTA_ALUGUEL_4T', setupVersion: REALISTA.setupVersion }), { comparability: 'SETUP_DIFFERS' }, 'AC-US-0005-05: another setup: SETUP_DIFFERS');
  assert.deepEqual(compareLapRecords(a, { ...a, trackVersion: 99 }), { comparability: 'TRACK_DIFFERS' }, 'AC-US-0005-05: another track version: TRACK_DIFFERS');
  assert.deepEqual(compareLapRecords(a, { ...a, trackId: 'outra' }), { comparability: 'TRACK_DIFFERS' }, 'AC-US-0005-05: another track: TRACK_DIFFERS');
  assert.deepEqual(compareLapRecords(a, incompleteResult()), { code: 'INCOMPLETE_RECORD' }, 'AC-US-0005-05: a record without trackVersion is INCOMPLETE_RECORD');
  assert.deepEqual(compareLapRecords(oldResult(), a), { comparability: 'SETUP_VERSION_DIFFERS' }, 'AC-US-0005-05: a result without the fields resolves to the previous version and is not comparable with the current one');
  assert.deepEqual(compareLapRecords(oldResult(), { ...SYNTHETIC_IDENTITY, setupVersion: previousVersion }), { comparability: 'COMPARABLE' }, 'AC-US-0005-05: two previous-version records are comparable with each other');
  // The previous replay is an official v4 lap: with the v4 configuration it reproduces its own valid lap and is comparable
  // with its recording; with the current setup it gives a result that is never comparable with the recording (abnormal case
  // of US-0005), ending at its first result (test strategy: never NO_RESULT for a lap that ends).
  const v4Setup = { ...ARCADE, setupVersion: previousVersion, config: ARCADE_KART };
  const own = replayLap(v4Replay(), reading, v4Setup);
  assert.ok(own.ok && own.comparability === 'COMPARABLE' && own.record.lapValidity === 'VALID', `AC-US-0005-05: the previous replay must reproduce its own valid lap with the previous configuration (got ${JSON.stringify(own.ok ? { comparability: own.comparability, lapValidity: own.record.lapValidity } : own)})`);
  const replayed = replayLap(v4Replay(), reading, ARCADE);
  assert.ok(replayed.ok, `AC-US-0005-05: the previous replay must reproduce with the current setup up to a result (got ${JSON.stringify(replayed.ok ? 'ok' : replayed)})`);
  if (!replayed.ok || !own.ok) return;
  assert.equal(replayed.comparability, 'SETUP_VERSION_DIFFERS', 'AC-US-0005-05: the reproduced previous replay is never comparable with its recording');
  assert.equal(replayed.record.setupVersion, ARCADE.setupVersion, 'AC-US-0005-05: the reproduced record carries the current setup version, not the recorded one');
  assert.notDeepEqual({ lapValidity: replayed.record.lapValidity, lapMs: replayed.record.lapMs }, { lapValidity: own.record.lapValidity, lapMs: own.record.lapMs }, 'AC-US-0005-05: the result obtained with the current setup is not the recorded one');
});

test('CHK-TEST-0008-04 the same replay reproduced twice gives the same lap record and the same final state', () => {
  // AC-US-0005-01
  const first = replayLap(newReplay(), reading, ARCADE), second = replayLap(newReplay(), reading, ARCADE);
  assert.ok(first.ok && second.ok, 'AC-US-0005-01: both reproductions must end with a record');
  if (!first.ok || !second.ok) return;
  assert.deepEqual(second.record, first.record, 'AC-US-0005-01: the two records (lapMs and sectorMs included) must be identical');
  assert.equal(first.record.lapValidity, 'VALID', 'AC-US-0005-01: the test-pilot replay must be a valid lap');
  assert.equal(first.record.sectorMs?.length, 4, 'AC-US-0005-01: four sector times');
  const final = () => {
    const started = startLap(undefined, { lapKind: 'TRAINING', ...SYNTHETIC_IDENTITY, ...SETUP_REF }, reading, ARCADE_CONFIG);
    if (!started.ok) throw new Error('fixture');
    let lap = started.lap;
    for (let i = 0; i < COUNTDOWN_STEPS; i++) lap = stepLap(lap, IDLE);
    const inputs = newReplay().inputs;
    return untilFirstResult(lap, l => inputs[l.stepCount], inputs.length).lap;
  };
  assert.deepEqual(final(), final(), 'AC-US-0005-01: the final session, kart state included, must be identical');
});

test('CHK-TEST-0008-05 a replay of the previous version is still read and reproduced step by step with the current setup', () => {
  // AC-US-0005-06
  const replay = v4Replay();
  assert.equal(readReplay(replay).replayStatus, 'READABLE', 'AC-US-0005-06: the previous replay must be READABLE');
  const started = startLap(undefined, { lapKind: replay.lapKind, trackId: replay.trackId, trackVersion: replay.trackVersion, ...SETUP_REF }, reading, ARCADE_CONFIG);
  assert.ok(started.ok, 'AC-US-0005-06: the previous replay must start a lap on its track');
  if (!started.ok) return;
  let lap = started.lap, applied = 0;
  for (let i = 0; i < COUNTDOWN_STEPS; i++) lap = stepLap(lap, IDLE);
  const ended = untilFirstResult(lap, l => replay.inputs[l.stepCount], replay.inputs.length);
  lap = ended.lap; applied = ended.steps;
  assert.ok(applied > 0 && applied <= replay.inputs.length, 'AC-US-0005-06: the reproduction applies recorded inputs only');
  assert.ok(!('code' in getLapResult(lap)), 'AC-US-0005-06: the previous replay must be reproduced up to its first result with the current setup');
  assert.equal(lap.stepCount, applied, 'AC-US-0005-06: one step per input, the contract of the step unchanged');
  assert.ok(replay.inputs.every(i => [0, 1].includes(i.throttle) && [0, 1].includes(i.brake) && [-1, 0, 1].includes(i.steer)), 'AC-US-0005-06: the previous inputs have the same fields and ranges');
});

test('CHK-TEST-0008-06 records of the previous version are read as resolved from absence, an unsupported format and unreadable texts are refused without touching the input', () => {
  // NFR-0009
  const old = readReplay(oldReplay());
  assert.equal(old.replayStatus, 'READABLE', 'NFR-0009: a replay without setup fields is READABLE');
  if (old.replayStatus === 'READABLE') {
    assert.equal(old.setupVersionSource, 'RESOLVED_FROM_ABSENCE', 'NFR-0009: the version of an old replay is resolved from its absence');
    assert.equal(old.setupVersion, previousVersion, 'NFR-0009: an old replay is marked with the previous version');
    assert.equal(old.setupId, 'ARCADE_ASSISTIDO', 'NFR-0009: an old replay belongs to the Arcade setup');
    assert.equal(old.inputStepCount, oldReplay().inputs.length, 'NFR-0009: the reading counts the inputs');
  }
  const resolved = resolveSetupRef(oldResult());
  assert.deepEqual(resolved, { setupId: 'ARCADE_ASSISTIDO', setupVersion: previousVersion, setupVersionSource: 'RESOLVED_FROM_ABSENCE' }, 'NFR-0009: an old result resolves to the previous Arcade version');
  const future = futureReplay(), snapshot = JSON.parse(JSON.stringify(future));
  assert.deepEqual(readReplay(future), { replayStatus: 'UNSUPPORTED_FORMAT' }, 'NFR-0009: a later format version is UNSUPPORTED_FORMAT');
  assert.deepEqual(future, snapshot, 'NFR-0009: the refused object is left untouched');
  assert.deepEqual(readReplay(corruptReplay()), { replayStatus: 'UNREADABLE' }, 'NFR-0009: an invalid text is UNREADABLE');
  assert.deepEqual(readReplay(oversizedReplay()), { replayStatus: 'UNREADABLE' }, 'NFR-0009: more inputs than the ceiling is UNREADABLE without reading any element');
  assert.ok(oversizedReplayText().length > MAX_REPLAY_TEXT_CHARS, 'NFR-0009: the oversized text exceeds the ceiling');
  assert.deepEqual(readReplay(oversizedReplayText()), { replayStatus: 'UNREADABLE' }, 'NFR-0009: a text above the ceiling is UNREADABLE');
  assert.deepEqual(readReplay({ ...oldReplay(), inputs: [] }), { replayStatus: 'UNREADABLE' }, 'NFR-0009: a replay without inputs is UNREADABLE');
  assert.deepEqual(readReplay({ ...oldReplay(), inputs: [{ throttle: 1, brake: 0 }] }), { replayStatus: 'UNREADABLE' }, 'NFR-0009: an input without steer is UNREADABLE');
  assert.ok(MAX_REPLAY_INPUT_STEPS > 0, 'NFR-0009: the input ceiling is declared');
  const record = runBench('SETUP_VERSION', options('BINARY', { oldRecords: [oldReplay(), oldResult()] }))[0] as SetupVersionRecord;
  assert.equal(record.oldRecordsReadCount, 2, 'NFR-0009: two old records read');
  assert.equal(record.oldRecordsReadOkCount, record.oldRecordsReadCount, 'NFR-0009: every old record must be read without error');
  const bad = runBench('SETUP_VERSION', options('BINARY', { oldRecords: [oldReplay(), { ...oldReplay(), inputs: [] }] }))[0] as SetupVersionRecord;
  assert.equal(bad.oldRecordsReadOkCount, 1, 'NFR-0009: an unreadable old record is counted as not read');
  assert.equal(bad.failReason, 'THRESHOLD_EXCEEDED', 'NFR-0009: an old record that cannot be read fails the bench');
});

test('CHK-TEST-0008-07 the setup reference resolves an absent setup to the Arcade and an absent version to the previous one, and keeps a declared one', () => {
  // NFR-0009
  assert.deepEqual(resolveSetupRef({}), { setupId: 'ARCADE_ASSISTIDO', setupVersion: previousVersion, setupVersionSource: 'RESOLVED_FROM_ABSENCE' }, 'NFR-0009: nothing declared resolves to the previous Arcade version');
  assert.deepEqual(resolveSetupRef({ setupId: 'ARCADE_ASSISTIDO', setupVersion: 'x-1' }), { setupId: 'ARCADE_ASSISTIDO', setupVersion: 'x-1', setupVersionSource: 'DECLARED' }, 'NFR-0009: a declared version is kept verbatim');
  assert.deepEqual(resolveSetupRef({ setupId: 'REALISTA_ALUGUEL_4T' }), { setupId: 'REALISTA_ALUGUEL_4T', setupVersion: REALISTA.setupVersion, setupVersionSource: 'RESOLVED_FROM_ABSENCE' }, 'NFR-0009: the Realista has no previous version and resolves to its own');
  assert.equal(resolveSetupRef({ setupId: 'DESCONHECIDO' }).setupId, 'ARCADE_ASSISTIDO', 'NFR-0009: an unknown setup id is the default of the time before the feature');
  assert.equal(resolveSetupRef({ setupVersion: '' }).setupVersionSource, 'RESOLVED_FROM_ABSENCE', 'NFR-0009: an empty version counts as absent');
  assert.notEqual(ARCADE_KART, ARCADE.config, 'NFR-0009: the previous configuration is not the current one');
  assert.equal(ARCADE.previousConfig, ARCADE_KART, 'NFR-0009: the previous configuration is still published, unedited');
});

test('CHK-TEST-0008-08 a replay of the superseded round recorded with the drift command held reproduces exactly as the same replay without the command', () => {
  // AC-US-0003-08
  const held = v5Replay();
  assert.ok(held.inputs.some(i => i.drift === true) && held.inputs.some(i => i.drift !== true), 'AC-US-0003-08: the fixture holds the drift command in part of the inputs');
  const without = { ...held, inputs: held.inputs.map(({ throttle, brake, steer }) => ({ throttle, brake, steer })) };
  const a = replayLap(held, reading, ARCADE), b = replayLap(without, reading, ARCADE);
  assert.ok(a.ok && b.ok, 'AC-US-0003-08: both reproductions must give a result');
  if (!a.ok || !b.ok) return;
  assert.deepEqual(a.record, b.record, 'AC-US-0003-08: the lap record (time, sectors, validity) must be the same with and without the drift command');
  assert.equal(a.record.lapValidity, 'VALID', 'AC-US-0003-08: the reproduced lap is a valid lap');
  assert.equal(a.comparability, 'SETUP_VERSION_DIFFERS', 'AC-US-0003-08: a v5 replay reproduced with v6 is never comparable with its recording');
});
