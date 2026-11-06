// TEST-0012 — the publication of the Kart Park: the version 2 prepared from the replica beside the frozen version 1, the registry
// digests and sizes, reproduction of both published files by the preparation, the immutability the rollback relies on, and the
// program's refusals (promote without the Esri decision, prepare of a registered version, any command on the frozen version 1)
// run in a temporary copy of the tracks (strategy: publication, file level, DES-0010, DES-0011, DM-0001, DM-0002, ADR-0005, ADR-0008).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { prepareReplicaTrack, prepareTrack, readOriginTrack, readReplicaTrack, serializeTrackFile, SMOOTH_WINDOW_M } from '../scripts/trackPrep';
import { MAX_FILE_BYTES } from '../scripts/trackChecks';
import { TRAINING_TRACKS } from '../src/trainingSession';
import {
  kartParkFile, kartParkGeometry, kartParkText, kartParkV1Text, ORIGIN_PATH, originJson, PUBLISHED_PATH, PUBLISHED_V1_PATH, registryJson, REGISTRY_PATH,
  REPLICA_PATH, replicaJson, ROOT,
} from './fixtures/kartParkFiles';

type Entry = {
  trackId: string; trackVersion: number; file: string; sha256: string; fileBytes: number; publicationState: string; stagedAtUtc: string;
  promotedAtUtc?: string; esriDecisionRef?: string;
  prep: {
    method?: string; originFile: string; originSha256: string; smoothingWindowM?: number; maxSmoothingOffsetM?: number; maxReplicaOffsetM?: number;
    lapLengthM: number; originOffsetM: { xM: number; zM: number }; curbWidthsM: number[]; reducedCurbs: unknown[];
  };
};
const sha256 = (bytes: Buffer | string) => createHash('sha256').update(bytes).digest('hex');
const registry = registryJson() as unknown as { registryVersion: number; entries: Entry[] };
const entry = registry.entries.find(e => e.trackId === 'kart-park' && e.trackVersion === 2);
const entryV1 = registry.entries.find(e => e.trackId === 'kart-park' && e.trackVersion === 1);
const file = kartParkFile();
const near = (a: number, b: number, tol: number) => Math.abs(a - b) <= tol;
// The two registry entries as they were published, written here literally (tracks/registry.json at 2026-10-27 and at 06582f8,
// 2026-11-06), so that a regenerated or rewritten registry cannot carry a changed file or entry with it.
const PUBLISHED_V1_SHA256 = '04ce5e510410e297764c047739422b07d46290c70eade1c1fb5bb7d120f057b1';
const PUBLISHED_V2_SHA256 = 'c79f14cbd49f3a7f19d2d1b50d14512b02525f6af7ecaaf850959c1395c4d20a';
const REPLICA_SHA256 = 'eba665b6c700fe7a05cd89862ef74d93ce307e613393e34cf78b9c69b2caa24e';
const ENTRY_V1: Entry = {
  trackId: 'kart-park', trackVersion: 1, file: 'src/tracks/kart-park-v1.json', sha256: PUBLISHED_V1_SHA256, fileBytes: 43013, publicationState: 'STAGING',
  stagedAtUtc: '2026-10-27T21:58:06.132Z',
  prep: {
    originFile: 'tracks/sources/kart-park.json', originSha256: '52c5adda4ce89bd23a00e04a10d7e12a28900dd4d56414f444e0a4795f2c5302', smoothingWindowM: 12,
    maxSmoothingOffsetM: 0.295, lapLengthM: 682.116, originOffsetM: { xM: 26.625, zM: 5.49 }, curbWidthsM: Array(34).fill(1), reducedCurbs: [],
  },
};
const ENTRY_V2: Entry = {
  trackId: 'kart-park', trackVersion: 2, file: 'src/tracks/kart-park-v2.json', sha256: PUBLISHED_V2_SHA256, fileBytes: 36585, publicationState: 'STAGING',
  stagedAtUtc: '2026-11-06T18:58:23.192Z',
  prep: {
    method: 'REPLICA', originFile: 'tracks/sources/kart-park-replica.json', originSha256: REPLICA_SHA256, maxReplicaOffsetM: 0, lapLengthM: 690.674,
    originOffsetM: { xM: 0, zM: 0 }, curbWidthsM: Array(22).fill(1), reducedCurbs: [],
  },
};
// The program run from a temporary copy of the tracks (its root is the working directory), never from the repository.
const TSX = join(ROOT, 'node_modules', 'tsx', 'dist', 'cli.mjs');
const PROGRAM = join(ROOT, 'scripts', 'track-pipeline.ts');
function sandbox(): string {
  const dir = mkdtempSync(join(tmpdir(), 'kartle-registry-'));
  mkdirSync(join(dir, 'tracks', 'sources'), { recursive: true });
  mkdirSync(join(dir, 'src', 'tracks'), { recursive: true });
  cpSync(ORIGIN_PATH, join(dir, 'tracks', 'sources', 'kart-park.json'));
  cpSync(REPLICA_PATH, join(dir, 'tracks', 'sources', 'kart-park-replica.json'));
  cpSync(REGISTRY_PATH, join(dir, 'tracks', 'registry.json'));
  cpSync(PUBLISHED_V1_PATH, join(dir, 'src', 'tracks', 'kart-park-v1.json'));
  cpSync(PUBLISHED_PATH, join(dir, 'src', 'tracks', 'kart-park-v2.json'));
  return dir;
}
const run = (cwd: string, ...args: string[]) => spawnSync(process.execPath, [TSX, PROGRAM, ...args], { cwd, encoding: 'utf8', timeout: 60000 });
const snapshot = (dir: string) => ['tracks/registry.json', 'src/tracks/kart-park-v1.json', 'src/tracks/kart-park-v2.json'].map(f => readFileSync(join(dir, f)).toString('base64')).join('|');

test('CHK-TEST-0012-01 the Kart Park version 2 is published and the registry records its digest, size, STAGING state and the facts of its preparation from the replica', () => {
  // NFR-0006
  assert.equal(file.trackVersion, 2, 'NFR-0006: trackVersion 2 in the bundled file');
  assert.ok(entry, 'NFR-0006: the registry has the entry kart-park 2');
  if (!entry) return;
  assert.equal(registry.registryVersion, 1, 'NFR-0006: registryVersion 1');
  assert.equal(entry.file, 'src/tracks/kart-park-v2.json', 'NFR-0006: the entry names the published file of the version 2');
  const bytes = readFileSync(PUBLISHED_PATH);
  assert.equal(entry.sha256, sha256(bytes), 'NFR-0006: the recorded digest is the digest of the published bytes');
  assert.equal(entry.fileBytes, bytes.length, 'NFR-0006: the recorded size is the size of the file');
  assert.equal(entry.publicationState, 'STAGING', 'NFR-0012: the version 2 is in STAGING');
  assert.ok(!('promotedAtUtc' in entry) && !('esriDecisionRef' in entry), 'NFR-0012: no promotion fields while in STAGING');
  assert.match(entry.stagedAtUtc, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/, 'NFR-0006: the staging instant is an ISO UTC date');
  assert.equal(entry.prep.method, 'REPLICA', 'NFR-0006: prepared from the replica');
  assert.equal(entry.prep.originFile, 'tracks/sources/kart-park-replica.json', 'NFR-0006: the origin file is the replica');
  assert.equal(entry.prep.originSha256, sha256(readFileSync(REPLICA_PATH)), 'NFR-0006: the origin digest is the digest of the replica bytes');
  assert.ok(!('smoothingWindowM' in entry.prep), 'NFR-0006: the version 2 is not smoothed');
  assert.ok(near(entry.prep.lapLengthM, kartParkGeometry().lapLengthM, 0.001), 'NFR-0006: the recorded lap length is the measured one');
  assert.equal(entry.prep.curbWidthsM.length, file.curbs.length, 'NFR-0006: one curb width per span');
  assert.ok(entry.prep.curbWidthsM.every((w, i) => near(w, file.curbs[i].widthM, 1e-9)), 'NFR-0006: the recorded widths are the published ones');
});

test('CHK-TEST-0012-02 the (trackId, trackVersion) pairs of the registry are unique and the bundled Kart Park is the highest published version, the one the catalogue declares', () => {
  // NFR-0006
  const pairs = registry.entries.map(e => `${e.trackId}/${e.trackVersion}`);
  assert.equal(new Set(pairs).size, pairs.length, 'NFR-0006: no duplicated pair');
  const versions = registry.entries.filter(e => e.trackId === 'kart-park').map(e => e.trackVersion);
  assert.deepEqual(versions, [1, 2], 'NFR-0006: the version 2 is added after the version 1, which stays');
  const highest = Math.max(...versions);
  assert.equal(highest, file.trackVersion, 'NFR-0006: the bundled file is the highest version');
  assert.equal(TRAINING_TRACKS.find(o => o.trackId === 'kart-park')?.trackVersion, highest, 'NFR-0006: the catalogue entry declares that version');
  assert.match(readFileSync(join(ROOT, 'src', 'main.ts'), 'utf8'), new RegExp(`tracks/kart-park-v${highest}\\.json\\?raw`), 'NFR-0006: the application bundles that version');
  assert.ok(registry.entries.every(e => Number.isInteger(e.trackVersion) && e.trackVersion >= 1), 'NFR-0006: versions are positive integers');
});

test('CHK-TEST-0012-03 the preparation reproduces both published files byte for byte, the version 2 from the replica and the version 1 from its origin, with the registry records', () => {
  // NFR-0006, AC-US-0002-06
  const replica = readReplicaTrack(replicaJson());
  assert.ok(!('error' in replica), 'NFR-0006: the replica reads');
  if ('error' in replica) return;
  const v2 = prepareReplicaTrack(replica, { trackId: 'kart-park', trackVersion: 2 });
  assert.ok(!('error' in v2), `NFR-0006: the preparation of the version 2 succeeds (${'error' in v2 ? v2.error : ''})`);
  if ('error' in v2) return;
  assert.equal(serializeTrackFile(v2.file), kartParkText(), 'NFR-0006: the serialized preparation of the replica is the published version 2, byte for byte');
  assert.ok(entry, 'NFR-0006: the registry entry 2 exists');
  if (!entry) return;
  assert.equal(v2.prep.method, entry.prep.method, 'NFR-0006: the same method');
  assert.ok(near(v2.prep.maxReplicaOffsetM, entry.prep.maxReplicaOffsetM ?? NaN, 1e-9), 'NFR-0006: the same largest offset from the replica');
  assert.ok(near(v2.prep.lapLengthM, entry.prep.lapLengthM, 1e-9), 'NFR-0006: the same lap length');
  assert.deepEqual(v2.prep.originOffsetM, entry.prep.originOffsetM, 'NFR-0006: the same origin offset');
  assert.deepEqual(v2.prep.curbWidthsM, entry.prep.curbWidthsM, 'NFR-0006: the same curb widths');
  assert.deepEqual(v2.prep.reducedCurbs, entry.prep.reducedCurbs, 'NFR-0006: the same reduced curbs');
  const other = prepareReplicaTrack(replica, { trackId: 'kart-park', trackVersion: 3 });
  assert.ok(!('error' in other) && serializeTrackFile(other.file) !== kartParkText(), 'NFR-0006: another version is another file (the comparison can fail)');
  // The frozen version 1 (REQ-FEAT-0002-20, -21): its preparation still reproduces its published bytes.
  const origin = readOriginTrack(originJson());
  assert.ok(!('error' in origin), 'NFR-0014: the version-1 origin reads');
  if ('error' in origin) return;
  const v1 = prepareTrack(origin, { trackId: 'kart-park', trackVersion: 1 });
  assert.ok(!('error' in v1), 'NFR-0014: the frozen preparation of the version 1 succeeds');
  if ('error' in v1) return;
  assert.equal(serializeTrackFile(v1.file), kartParkV1Text(), 'NFR-0014: the frozen preparation reproduces the version-1 file byte for byte');
  assert.equal(v1.prep.smoothingWindowM, SMOOTH_WINDOW_M, 'NFR-0014: with its 12 m window');
  assert.ok(entryV1 && near(v1.prep.lapLengthM, entryV1.prep.lapLengthM, 1e-9), 'NFR-0014: and its recorded lap length');
});

test('CHK-TEST-0012-04 no production entry exists without a recorded Esri decision, and the program refuses to promote without one', () => {
  // NFR-0012
  for (const e of registry.entries) {
    if (e.publicationState !== 'PRODUCTION') continue;
    assert.ok(typeof e.esriDecisionRef === 'string' && e.esriDecisionRef.length > 0, `NFR-0012: ${e.trackId} ${e.trackVersion} in PRODUCTION must carry esriDecisionRef`);
    assert.ok(typeof e.promotedAtUtc === 'string', `NFR-0012: ${e.trackId} ${e.trackVersion} in PRODUCTION must carry promotedAtUtc`);
  }
  const dir = sandbox();
  try {
    const before = readFileSync(join(dir, 'tracks', 'registry.json'), 'utf8');
    for (const version of ['1', '2']) {
      const refused = run(dir, 'promote', 'kart-park', version);
      assert.equal(refused.status, 1, `NFR-0012: promote ${version} without --esri-decision exits 1 (${refused.stderr})`);
      assert.match(refused.stderr, /argumento inválido: --esri-decision/, 'NFR-0012: the refusal names the missing decision');
    }
    assert.equal(readFileSync(join(dir, 'tracks', 'registry.json'), 'utf8'), before, 'NFR-0012: the registry is untouched by the refusals');
    const empty = run(dir, 'promote', 'kart-park', '2', '--esri-decision', '   ');
    assert.equal(empty.status, 1, 'NFR-0012: an empty decision is refused');
    const promoted = run(dir, 'promote', 'kart-park', '2', '--esri-decision', 'DOMAIN/DEC-08 decisão de teste');
    assert.equal(promoted.status, 0, `NFR-0012: promote with a decision succeeds in the sandbox (${promoted.stderr})`);
    assert.match(promoted.stdout, /PRODUCTION registrado kart-park 2/, 'NFR-0012: the promotion is announced');
    const after = JSON.parse(readFileSync(join(dir, 'tracks', 'registry.json'), 'utf8')) as { entries: Entry[] };
    const e = after.entries.find(x => x.trackId === 'kart-park' && x.trackVersion === 2)!;
    assert.equal(e.publicationState, 'PRODUCTION', 'NFR-0012: PRODUCTION after the promotion');
    assert.equal(e.esriDecisionRef, 'DOMAIN/DEC-08 decisão de teste', 'NFR-0012: the decision reference is recorded');
    assert.match(e.promotedAtUtc ?? '', /^\d{4}-\d{2}-\d{2}T/, 'NFR-0012: the promotion instant is recorded');
    assert.equal(e.sha256, entry?.sha256, 'NFR-0012: the promotion changes no file digest');
    assert.deepEqual(after.entries.find(x => x.trackVersion === 1), entryV1, 'NFR-0012: the promotion of the version 2 leaves the entry 1 as it was');
    const again = run(dir, 'promote', 'kart-park', '2', '--esri-decision', 'outra');
    assert.equal(again.status, 0, 'NFR-0012: a repeated promotion is a no-op');
    assert.match(again.stdout, /já promovido/, 'NFR-0012: announced as already promoted');
    const final = JSON.parse(readFileSync(join(dir, 'tracks', 'registry.json'), 'utf8')) as { entries: Entry[] };
    assert.equal(final.entries.find(x => x.trackVersion === 2)!.esriDecisionRef, 'DOMAIN/DEC-08 decisão de teste', 'NFR-0012: the first decision stays');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
  assert.ok(registryJson().entries.every(x => x.publicationState === 'STAGING'), 'NFR-0012: the repository registry is still all STAGING');
});

test('CHK-TEST-0012-05 the program verifies the published version 2, refuses to regenerate it, treats a second publish as already registered, prepares it again only when unregistered, and validates its arguments before touching a file', () => {
  // NFR-0006
  const dir = sandbox();
  try {
    const verified = run(dir, 'verify', 'kart-park', '2');
    assert.equal(verified.status, 0, `NFR-0006: verify exits 0 (${verified.stderr})`);
    assert.equal((verified.stdout.match(/^V\d{2} PASS /gm) ?? []).length, 20, 'NFR-0006: 20 PASS lines');
    assert.match(verified.stdout, /VERIFIED/, 'NFR-0006: VERIFIED');
    const before = snapshot(dir);
    const regenerate = run(dir, 'prepare', 'kart-park', '2');
    assert.equal(regenerate.status, 1, 'NFR-0006: prepare of a registered version is refused');
    assert.match(regenerate.stderr, /já está no registro; uma versão publicada nunca é regenerada/, 'NFR-0006: the refusal says why');
    assert.equal(snapshot(dir), before, 'NFR-0006: the published files and the registry are untouched');
    const republish = run(dir, 'publish', 'kart-park', '2');
    assert.equal(republish.status, 0, 'NFR-0006: a second publish of the same content is accepted');
    assert.match(republish.stdout, /já registrado kart-park 2 STAGING/, 'NFR-0006: and reported as already registered');
    for (const [args, name] of [[['verify', 'kart-park', '02'], 'trackVersion'], [['verify', 'kart-park', '3'], 'trackVersion'], [['verify', 'synthetic', '2'], 'trackVersion'], [['verify', 'moon', '2'], 'trackId'], [['verify', 'Kart-Park', '2'], 'trackId'], [['verify', 'kart-park', '2', '--esri-decision', 'x'], '--esri-decision'], [['stage', 'kart-park', '2'], 'comando']] as const) {
      const r = run(dir, ...args);
      assert.equal(r.status, 1, `NFR-0006: ${args.join(' ')} is refused`);
      assert.match(r.stderr, new RegExp(`argumento inválido: ${name.replace('-', '\\-')}`), `NFR-0006: the refusal names ${name}`);
    }
    assert.equal(snapshot(dir), before, 'NFR-0006: the refused arguments touched no file');
    // Unregistered (the entry 2 and its file taken out of the sandbox), the version 2 is prepared again beside the version 1.
    const reg = JSON.parse(readFileSync(join(dir, 'tracks', 'registry.json'), 'utf8')) as { registryVersion: number; entries: Entry[] };
    writeFileSync(join(dir, 'tracks', 'registry.json'), JSON.stringify({ ...reg, entries: reg.entries.filter(e => e.trackVersion !== 2) }, null, 2) + '\n');
    rmSync(join(dir, 'src', 'tracks', 'kart-park-v2.json'));
    const prepared = run(dir, 'prepare', 'kart-park', '2');
    assert.equal(prepared.status, 0, `NFR-0006: an unregistered version can be prepared (${prepared.stderr})`);
    assert.ok(existsSync(join(dir, 'src', 'tracks', 'kart-park-v2.json')), 'NFR-0006: the new version is written beside the published one');
    assert.equal(readFileSync(join(dir, 'src', 'tracks', 'kart-park-v2.json'), 'utf8'), kartParkText(), 'NFR-0006: the program prepares the published version 2 byte for byte');
    assert.equal(sha256(readFileSync(join(dir, 'src', 'tracks', 'kart-park-v1.json'))), PUBLISHED_V1_SHA256, 'NFR-0014: version 1 is still untouched');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('CHK-TEST-0012-06 the published size is below the 200 000 byte limit the registry and the program apply', () => {
  // NFR-0001
  assert.ok(entry && entry.fileBytes < MAX_FILE_BYTES, `NFR-0001: fileBytes ${entry?.fileBytes} below ${MAX_FILE_BYTES}`);
  assert.ok(Buffer.byteLength(kartParkText()) < 200_000, 'NFR-0001: measured below 200 000 bytes');
  assert.match(readFileSync(PROGRAM, 'utf8'), /if \(fileBytes >= MAX_FILE_BYTES\) return fail/, 'NFR-0001: publish refuses a file at the limit');
});

test('CHK-TEST-0012-07 after revision 3 the published Kart Park version 1 is byte for byte its publication: the recorded digest, trackVersion 1, its entry intact and the entry 2 added after it', () => {
  // NFR-0014
  const kartParkEntries = registry.entries.filter(e => e.trackId === 'kart-park');
  assert.deepEqual(kartParkEntries.map(e => e.trackVersion), [1, 2], 'NFR-0014: the entry 1 stays and the entry 2 is added after it');
  assert.deepEqual(kartParkEntries[0], ENTRY_V1, 'NFR-0014: the entry 1 is the one of its publication, field for field');
  assert.ok(existsSync(PUBLISHED_V1_PATH), 'NFR-0014: the version-1 file is still in the repository');
  assert.equal(sha256(readFileSync(PUBLISHED_V1_PATH)), PUBLISHED_V1_SHA256, 'NFR-0014: the version-1 file must be byte for byte its publication (0 bytes changed)');
  assert.equal((JSON.parse(kartParkV1Text()) as { trackVersion: number; trackId: string }).trackVersion, 1, 'NFR-0014: the version-1 file keeps trackVersion 1');
  assert.equal((JSON.parse(kartParkV1Text()) as { trackVersion: number; trackId: string }).trackId, 'kart-park', 'NFR-0014: with the trackId of the Kart Park');
});

test('CHK-TEST-0012-08 the program refuses to prepare, verify or publish the frozen version 1 without touching a file, and every registered track file is byte-exact under .gitattributes', () => {
  // NFR-0014 (REQ-FEAT-0002-20, -21)
  const dir = sandbox();
  try {
    const before = snapshot(dir);
    for (const command of ['prepare', 'verify', 'publish']) {
      const r = run(dir, command, 'kart-park', '1');
      assert.equal(r.status, 1, `NFR-0014: ${command} kart-park 1 is refused (${r.stdout})`);
      assert.match(r.stderr, /recusado: kart-park 1 é versão publicada e congelada/, `NFR-0014: ${command} names the frozen version`);
    }
    assert.equal(snapshot(dir), before, 'NFR-0014: the refusals touched no file');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
  // Each published file and each origin of the registry matches a -text rule, so no checkout rewrites its bytes.
  const rules = readFileSync(join(ROOT, '.gitattributes'), 'utf8').split(/\r?\n/).map(l => l.trim()).filter(l => /\s-text(\s|$)/.test(l)).map(l => l.split(/\s+/)[0]);
  const matches = (path: string, glob: string) => new RegExp(`^${glob.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '[^/]*')}$`).test(path);
  for (const e of registry.entries) {
    for (const path of [e.file, e.prep.originFile, 'tracks/registry.json']) assert.ok(rules.some(r => matches(path, r)), `NFR-0014: ${path} must match a -text rule of .gitattributes (${rules.join(', ')})`);
  }
  assert.ok(!rules.some(r => matches('src/main.ts', r)), 'NFR-0014: the rule is not a catch-all (the check can fail)');
});

test('CHK-TEST-0012-09 the files a rollback keeps are intact: both published versions, the replica and both registry entries, as recorded at their publication', () => {
  // NFR-0006, NFR-0014 (DM-0001 and DM-0002 2.0.1, "Teste da reversão")
  // Independent of the catalogue and of the import of src/main.ts, the two things the rollback of revision 3 changes back.
  assert.equal(sha256(readFileSync(PUBLISHED_V1_PATH)), PUBLISHED_V1_SHA256, 'NFR-0014: src/tracks/kart-park-v1.json keeps the digest of the entry 1');
  assert.equal(sha256(readFileSync(PUBLISHED_PATH)), PUBLISHED_V2_SHA256, 'NFR-0006: src/tracks/kart-park-v2.json keeps the digest of the entry 2');
  assert.equal(sha256(readFileSync(REPLICA_PATH)), REPLICA_SHA256, 'NFR-0006: tracks/sources/kart-park-replica.json keeps the prep.originSha256 of the entry 2');
  const entries = registry.entries.filter(e => e.trackId === 'kart-park');
  assert.deepEqual(entries.find(e => e.trackVersion === 1), ENTRY_V1, 'NFR-0014: the entry 1 is equal field for field');
  assert.deepEqual(entries.find(e => e.trackVersion === 2), ENTRY_V2, 'NFR-0006: the entry 2 is equal field for field');
  assert.equal(entries.length, 2, 'NFR-0006: no Kart Park entry is removed or added');
});
