// TEST-0012 — the publication of the Kart Park: trackVersion 1, the registry digest and size, reproduction of the published file
// by the preparation, and the program's refusals (promote without the Esri decision, prepare of a registered version) run in a
// temporary copy of the tracks (strategy: publication, file level, DES-0010, DES-0011, DM-0002, ADR-0005).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { prepareTrack, readOriginTrack, serializeTrackFile, SMOOTH_WINDOW_M } from '../scripts/trackPrep';
import { MAX_FILE_BYTES } from '../scripts/trackChecks';
import { kartParkFile, kartParkGeometry, kartParkText, ORIGIN_PATH, originJson, PUBLISHED_PATH, registryJson, REGISTRY_PATH, ROOT } from './fixtures/kartParkFiles';

type Entry = {
  trackId: string; trackVersion: number; file: string; sha256: string; fileBytes: number; publicationState: string; stagedAtUtc: string;
  promotedAtUtc?: string; esriDecisionRef?: string;
  prep: { originFile: string; originSha256: string; smoothingWindowM: number; maxSmoothingOffsetM: number; lapLengthM: number; originOffsetM: { xM: number; zM: number }; curbWidthsM: number[]; reducedCurbs: unknown[] };
};
const sha256 = (bytes: Buffer | string) => createHash('sha256').update(bytes).digest('hex');
const registry = registryJson() as unknown as { registryVersion: number; entries: Entry[] };
const entry = registry.entries.find(e => e.trackId === 'kart-park' && e.trackVersion === 1);
const file = kartParkFile();
const near = (a: number, b: number, tol: number) => Math.abs(a - b) <= tol;
// The program run from a temporary copy of the tracks (its root is the working directory), never from the repository.
const TSX = join(ROOT, 'node_modules', 'tsx', 'dist', 'cli.mjs');
const PROGRAM = join(ROOT, 'scripts', 'track-pipeline.ts');
function sandbox(): string {
  const dir = mkdtempSync(join(tmpdir(), 'kartle-registry-'));
  mkdirSync(join(dir, 'tracks', 'sources'), { recursive: true });
  mkdirSync(join(dir, 'src', 'tracks'), { recursive: true });
  cpSync(ORIGIN_PATH, join(dir, 'tracks', 'sources', 'kart-park.json'));
  cpSync(REGISTRY_PATH, join(dir, 'tracks', 'registry.json'));
  cpSync(PUBLISHED_PATH, join(dir, 'src', 'tracks', 'kart-park-v1.json'));
  return dir;
}
const run = (cwd: string, ...args: string[]) => spawnSync(process.execPath, [TSX, PROGRAM, ...args], { cwd, encoding: 'utf8', timeout: 60000 });

test('CHK-TEST-0012-01 the Kart Park is published as trackVersion 1 and the registry records its digest, size, STAGING state and preparation facts', () => {
  // NFR-0006
  assert.equal(file.trackVersion, 1, 'NFR-0006: trackVersion 1 in the published file');
  assert.ok(entry, 'NFR-0006: the registry has the entry kart-park 1');
  if (!entry) return;
  assert.equal(registry.registryVersion, 1, 'NFR-0006: registryVersion 1');
  assert.equal(entry.file, 'src/tracks/kart-park-v1.json', 'NFR-0006: the entry names the published file');
  const bytes = readFileSync(PUBLISHED_PATH);
  assert.equal(entry.sha256, sha256(bytes), 'NFR-0006: the recorded digest is the digest of the published bytes (0 bytes changed since the publication)');
  assert.equal(entry.fileBytes, bytes.length, 'NFR-0006: the recorded size is the size of the file');
  assert.equal(entry.publicationState, 'STAGING', 'NFR-0012: the Kart Park is in STAGING');
  assert.ok(!('promotedAtUtc' in entry) && !('esriDecisionRef' in entry), 'NFR-0012: no promotion fields while in STAGING');
  assert.match(entry.stagedAtUtc, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/, 'NFR-0006: the staging instant is an ISO UTC date');
  assert.equal(entry.prep.originFile, 'tracks/sources/kart-park.json', 'NFR-0006: the origin file');
  assert.equal(entry.prep.originSha256, sha256(readFileSync(ORIGIN_PATH)), 'NFR-0006: the origin digest is the digest of the origin bytes');
  assert.equal(entry.prep.smoothingWindowM, SMOOTH_WINDOW_M, 'NFR-0006: the smoothing window of the preparation');
  assert.ok(near(entry.prep.lapLengthM, kartParkGeometry().lapLengthM, 0.001), 'NFR-0006: the recorded lap length is the measured one');
  assert.equal(entry.prep.curbWidthsM.length, file.curbs.length, 'NFR-0006: one curb width per span');
  assert.ok(entry.prep.curbWidthsM.every((w, i) => near(w, file.curbs[i].widthM, 1e-9)), 'NFR-0006: the recorded widths are the published ones');
});

test('CHK-TEST-0012-02 the (trackId, trackVersion) pairs of the registry are unique and the bundled Kart Park is the highest published version', () => {
  // NFR-0006
  const pairs = registry.entries.map(e => `${e.trackId}/${e.trackVersion}`);
  assert.equal(new Set(pairs).size, pairs.length, 'NFR-0006: no duplicated pair');
  const highest = Math.max(...registry.entries.filter(e => e.trackId === 'kart-park').map(e => e.trackVersion));
  assert.equal(highest, file.trackVersion, 'NFR-0006: the bundled file is the highest version');
  assert.match(readFileSync(join(ROOT, 'src', 'main.ts'), 'utf8'), new RegExp(`tracks/kart-park-v${highest}\\.json\\?raw`), 'NFR-0006: the application bundles that version');
  assert.ok(registry.entries.every(e => Number.isInteger(e.trackVersion) && e.trackVersion >= 1), 'NFR-0006: versions are positive integers');
});

test('CHK-TEST-0012-03 the preparation reproduces the published file byte for byte from the origin, with the preparation record of the registry', () => {
  // NFR-0006, AC-US-0002-06
  const origin = readOriginTrack(originJson());
  assert.ok(!('error' in origin), 'NFR-0006: the origin reads');
  if ('error' in origin) return;
  const result = prepareTrack(origin, { trackId: 'kart-park', trackVersion: 1 });
  assert.ok(!('error' in result), `NFR-0006: the preparation succeeds (${'error' in result ? result.error : ''})`);
  if ('error' in result) return;
  assert.equal(serializeTrackFile(result.file), kartParkText(), 'NFR-0006: the serialized preparation is the published text, byte for byte');
  assert.ok(entry, 'NFR-0006: the registry entry exists');
  if (!entry) return;
  assert.equal(result.prep.smoothingWindowM, entry.prep.smoothingWindowM, 'NFR-0006: the same window');
  assert.ok(near(result.prep.maxSmoothingOffsetM, entry.prep.maxSmoothingOffsetM, 1e-9), 'NFR-0006: the same largest offset');
  assert.ok(near(result.prep.lapLengthM, entry.prep.lapLengthM, 1e-9), 'NFR-0006: the same lap length');
  assert.deepEqual(result.prep.originOffsetM, entry.prep.originOffsetM, 'NFR-0006: the same origin offset');
  assert.deepEqual(result.prep.curbWidthsM, entry.prep.curbWidthsM, 'NFR-0006: the same curb widths');
  assert.deepEqual(result.prep.reducedCurbs, entry.prep.reducedCurbs, 'NFR-0006: the same reduced curbs');
  const other = prepareTrack(origin, { trackId: 'kart-park', trackVersion: 2 });
  assert.ok(!('error' in other) && serializeTrackFile(other.file) !== kartParkText(), 'NFR-0006: another version is another file (the comparison can fail)');
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
    const refused = run(dir, 'promote', 'kart-park', '1');
    assert.equal(refused.status, 1, `NFR-0012: promote without --esri-decision exits 1 (${refused.stderr})`);
    assert.match(refused.stderr, /argumento inválido: --esri-decision/, 'NFR-0012: the refusal names the missing decision');
    assert.equal(readFileSync(join(dir, 'tracks', 'registry.json'), 'utf8'), before, 'NFR-0012: the registry is untouched by the refusal');
    const empty = run(dir, 'promote', 'kart-park', '1', '--esri-decision', '   ');
    assert.equal(empty.status, 1, 'NFR-0012: an empty decision is refused');
    const promoted = run(dir, 'promote', 'kart-park', '1', '--esri-decision', 'DOMAIN/DEC-08 decisão de teste');
    assert.equal(promoted.status, 0, `NFR-0012: promote with a decision succeeds in the sandbox (${promoted.stderr})`);
    assert.match(promoted.stdout, /PRODUCTION registrado kart-park 1/, 'NFR-0012: the promotion is announced');
    const after = JSON.parse(readFileSync(join(dir, 'tracks', 'registry.json'), 'utf8')) as { entries: Entry[] };
    const e = after.entries.find(x => x.trackId === 'kart-park' && x.trackVersion === 1)!;
    assert.equal(e.publicationState, 'PRODUCTION', 'NFR-0012: PRODUCTION after the promotion');
    assert.equal(e.esriDecisionRef, 'DOMAIN/DEC-08 decisão de teste', 'NFR-0012: the decision reference is recorded');
    assert.match(e.promotedAtUtc ?? '', /^\d{4}-\d{2}-\d{2}T/, 'NFR-0012: the promotion instant is recorded');
    assert.equal(e.sha256, entry?.sha256, 'NFR-0012: the promotion changes no file digest');
    const again = run(dir, 'promote', 'kart-park', '1', '--esri-decision', 'outra');
    assert.equal(again.status, 0, 'NFR-0012: a repeated promotion is a no-op');
    assert.match(again.stdout, /já promovido/, 'NFR-0012: announced as already promoted');
    assert.equal(JSON.parse(readFileSync(join(dir, 'tracks', 'registry.json'), 'utf8')).entries[0].esriDecisionRef, 'DOMAIN/DEC-08 decisão de teste', 'NFR-0012: the first decision stays');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
  assert.equal(registryJson().entries[0].publicationState, 'STAGING', 'NFR-0012: the repository registry is still STAGING');
});

test('CHK-TEST-0012-05 the program verifies the published version, refuses to regenerate it, treats a second publish as already registered, and validates its arguments before touching a file', () => {
  // NFR-0006
  const dir = sandbox();
  try {
    const verified = run(dir, 'verify', 'kart-park', '1');
    assert.equal(verified.status, 0, `NFR-0006: verify exits 0 (${verified.stderr})`);
    assert.equal((verified.stdout.match(/^V\d{2} PASS /gm) ?? []).length, 18, 'NFR-0006: 18 PASS lines');
    assert.match(verified.stdout, /VERIFIED/, 'NFR-0006: VERIFIED');
    const publishedBefore = readFileSync(join(dir, 'src', 'tracks', 'kart-park-v1.json'));
    const regenerate = run(dir, 'prepare', 'kart-park', '1');
    assert.equal(regenerate.status, 1, 'NFR-0006: prepare of a registered version is refused');
    assert.match(regenerate.stderr, /já está no registro; uma versão publicada nunca é regenerada/, 'NFR-0006: the refusal says why');
    assert.ok(publishedBefore.equals(readFileSync(join(dir, 'src', 'tracks', 'kart-park-v1.json'))), 'NFR-0006: the published file is untouched');
    const republish = run(dir, 'publish', 'kart-park', '1');
    assert.equal(republish.status, 0, 'NFR-0006: a second publish of the same content is accepted');
    assert.match(republish.stdout, /já registrado kart-park 1 STAGING/, 'NFR-0006: and reported as already registered');
    for (const [args, name] of [[['verify', 'kart-park', '01'], 'trackVersion'], [['verify', 'synthetic', '1'], 'trackId'], [['verify', 'kart-park', '1', '--esri-decision', 'x'], '--esri-decision'], [['stage', 'kart-park', '1'], 'comando']] as const) {
      const r = run(dir, ...args);
      assert.equal(r.status, 1, `NFR-0006: ${args.join(' ')} is refused`);
      assert.match(r.stderr, new RegExp(`argumento inválido: ${name.replace('-', '\\-')}`), `NFR-0006: the refusal names ${name}`);
    }
    const prepared = run(dir, 'prepare', 'kart-park', '2');
    assert.equal(prepared.status, 0, `NFR-0006: a new version can be prepared (${prepared.stderr})`);
    assert.ok(existsSync(join(dir, 'src', 'tracks', 'kart-park-v2.json')), 'NFR-0006: the new version is written beside the published one');
    assert.ok(publishedBefore.equals(readFileSync(join(dir, 'src', 'tracks', 'kart-park-v1.json'))), 'NFR-0006: version 1 is still untouched');
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
