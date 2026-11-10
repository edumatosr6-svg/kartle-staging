// TEST-0005 — the delivered files and the measure of the build (RULE-0003, DM-0001, API-0003 `ASSET_BUDGET`, DES-0004):
// each delivered form against its origin and the origin record, the sounds copied byte for byte, the sizes and the
// proportion of the images, the byte ceilings, and `measureAssetBudget` over `dist` folders mounted by the test in a
// temporary directory — the passing one and one per failure reason (strategy: assets, file and unit levels). The record
// of the real build comes from `npm run build && npm run check:assets`, outside `npm test`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { embeddedPayloads, initialDownloadFiles, measureAssetBudget, readImageSize, type AssetBudgetRecord } from '../scripts/assetBudget';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const bytesOf = (file: string) => new Uint8Array(readFileSync(join(root, file)));
const sha256 = (bytes: Uint8Array) => createHash('sha256').update(bytes).digest('hex');
type Asset = {
  assetRole: string; sourcePath: string; sourceSha256: string; deliveredPath: string; deliveredSha256: string;
  deliveredBytes: number; transform: string; widthPx?: number; heightPx?: number;
};
type OriginRecord = { schemaVersion: number; assets: Asset[]; runtimeDependenciesBaseline: string[] };
const RECORD_PATH = 'src/assets/feature-assets.json';
const record = JSON.parse(readFileSync(join(root, RECORD_PATH), 'utf8')) as OriginRecord;
const asset = (role: string): Asset => { const a = record.assets.find(x => x.assetRole === role); if (!a) throw new Error(`fixture: the origin record has no ${role}`); return a; };
// The byte ceiling of each delivered form (DM-0001).
const CEILING: Record<string, number> = { ICON_IMAGE: 45_000, COVER_IMAGE: 100_000, ENGINE_LOOP: 70_998, TIRE_SCREECH: 44_389 };
const dataUrl = (bytes: Uint8Array, mimeType = 'audio/mpeg') => `data:${mimeType};base64,${Buffer.from(bytes).toString('base64')}`;

// The origin, the delivered form and the record line of one file, as RULE-0003 names them.
function provenance(role: string, criterion: string, sourcePath: string, deliveredPath: string, transform: string) {
  const a = asset(role);
  assert.equal(a.sourcePath, sourcePath, `${criterion}: the origin of ${role} is ${sourcePath}`);
  assert.equal(a.deliveredPath, deliveredPath, `${criterion}: the delivered form of ${role} is ${deliveredPath}`);
  const source = bytesOf(sourcePath), delivered = bytesOf(deliveredPath);
  assert.equal(a.sourceSha256, sha256(source), `${criterion}: the recorded origin digest of ${role} is the digest of ${sourcePath}`);
  assert.equal(a.deliveredSha256, sha256(delivered), `${criterion}: the recorded delivered digest of ${role} is the digest of ${deliveredPath}`);
  assert.equal(a.deliveredBytes, delivered.length, `${criterion}: the recorded size of ${role} is the size of ${deliveredPath}`);
  assert.equal(a.transform, transform, `${criterion}: ${role} is derived by ${transform}`);
  return { a, source, delivered };
}

test('CHK-TEST-0005-01 the delivered icon is derived from docs/art/icon.png: the recorded digests are those of the two files, 192 × 192 in the square proportion of the origin', () => {
  // AC-US-0001-04
  const { a, source, delivered } = provenance('ICON_IMAGE', 'AC-US-0001-04', 'docs/art/icon.png', 'src/assets/icon.png', 'RESIZE_REENCODE');
  const size = readImageSize(delivered), origin = readImageSize(source);
  assert.deepEqual(size, { widthPx: 192, heightPx: 192 }, 'AC-US-0001-04: the delivered icon is a 192 × 192 image');
  assert.deepEqual([a.widthPx, a.heightPx], [192, 192], 'AC-US-0001-04: as the record says');
  assert.ok(origin !== undefined && origin.widthPx === origin.heightPx, `AC-US-0001-04: the origin is square (${origin?.widthPx} × ${origin?.heightPx}), so nothing was cropped`);
  assert.deepEqual([...delivered.slice(0, 8)], [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], 'AC-US-0001-04: the delivered icon is a PNG file');
  assert.equal(delivered[25], 2, 'AC-US-0001-04: RGB without an alpha channel: the icon is opaque');
  assert.ok(delivered.length <= CEILING.ICON_IMAGE, `AC-US-0001-04: the delivered icon fits its ceiling (${delivered.length} bytes)`);
});

test('CHK-TEST-0005-02 the delivered cover is derived from docs/art/cover.png: the recorded digests are those of the two files, and 1200 × 670 keeps the proportion of the origin', () => {
  // AC-US-0002-05
  const { a, source, delivered } = provenance('COVER_IMAGE', 'AC-US-0002-05', 'docs/art/cover.png', 'src/assets/cover.jpg', 'RESIZE_REENCODE');
  const size = readImageSize(delivered), origin = readImageSize(source);
  assert.deepEqual(size, { widthPx: 1200, heightPx: 670 }, 'AC-US-0002-05: the delivered cover is a 1200 × 670 image');
  assert.deepEqual([a.widthPx, a.heightPx], [1200, 670], 'AC-US-0002-05: as the record says');
  assert.deepEqual(origin, { widthPx: 2752, heightPx: 1536 }, 'AC-US-0002-05: the origin is the 2752 × 1536 image');
  assert.equal(size!.heightPx, Math.round(origin!.heightPx * size!.widthPx / origin!.widthPx), 'AC-US-0002-05: the height is the origin proportion at 1200 px, rounded: nothing was cropped');
  assert.deepEqual([delivered[0], delivered[1]], [0xff, 0xd8], 'AC-US-0002-05: the delivered cover is a JPEG file');
  assert.ok(delivered.length <= CEILING.COVER_IMAGE, `AC-US-0002-05: the delivered cover fits its ceiling (${delivered.length} bytes)`);
});

test('CHK-TEST-0005-03 the engine recording delivered is docs/sfx/engine-loop.mp3 byte for byte', () => {
  // AC-US-0003-10
  const { source, delivered } = provenance('ENGINE_LOOP', 'AC-US-0003-10', 'docs/sfx/engine-loop.mp3', 'src/assets/engine-loop.mp3', 'COPY');
  assert.equal(delivered.length, source.length, 'AC-US-0003-10: the same size as the origin');
  assert.ok(Buffer.from(delivered).equals(Buffer.from(source)), 'AC-US-0003-10: src/assets/engine-loop.mp3 equals docs/sfx/engine-loop.mp3 byte for byte');
  assert.equal(asset('ENGINE_LOOP').deliveredSha256, asset('ENGINE_LOOP').sourceSha256, 'AC-US-0003-10: a copy has the digest of its origin');
  assert.equal(delivered.length, CEILING.ENGINE_LOOP, 'AC-US-0003-10: 70,998 bytes, the size of the recording the product owner heard');
});

test('CHK-TEST-0005-04 the tyre recording delivered is docs/sfx/tire-screech.mp3 byte for byte', () => {
  // AC-US-0004-06
  const { source, delivered } = provenance('TIRE_SCREECH', 'AC-US-0004-06', 'docs/sfx/tire-screech.mp3', 'src/assets/tire-screech.mp3', 'COPY');
  assert.equal(delivered.length, source.length, 'AC-US-0004-06: the same size as the origin');
  assert.ok(Buffer.from(delivered).equals(Buffer.from(source)), 'AC-US-0004-06: src/assets/tire-screech.mp3 equals docs/sfx/tire-screech.mp3 byte for byte');
  assert.equal(asset('TIRE_SCREECH').deliveredSha256, asset('TIRE_SCREECH').sourceSha256, 'AC-US-0004-06: a copy has the digest of its origin');
  assert.equal(delivered.length, CEILING.TIRE_SCREECH, 'AC-US-0004-06: 44,389 bytes, the size of the recording the product owner heard');
  assert.ok(!Buffer.from(delivered).equals(Buffer.from(bytesOf('src/assets/engine-loop.mp3'))), 'AC-US-0004-06: and it is not the engine recording');
});

test('CHK-TEST-0005-05 the origin record names exactly the 4 files of the feature, one per role, with the digests the visual inspection has to quote', () => {
  // NFR-0008
  assert.equal(record.schemaVersion, 1, 'NFR-0008: the origin record is schema 1');
  assert.deepEqual(record.assets.map(a => a.assetRole).sort(), ['COVER_IMAGE', 'ENGINE_LOOP', 'ICON_IMAGE', 'TIRE_SCREECH'], 'NFR-0008: exactly the 4 roles, each once');
  for (const a of record.assets) {
    assert.match(a.sourceSha256, /^[0-9a-f]{64}$/, `NFR-0008: ${a.assetRole} has a SHA-256 origin digest`);
    assert.match(a.deliveredSha256, /^[0-9a-f]{64}$/, `NFR-0008: ${a.assetRole} has a SHA-256 delivered digest`);
    assert.equal(a.deliveredSha256, sha256(bytesOf(a.deliveredPath)), `NFR-0008: the digest to quote for ${a.assetRole} is the one of the file delivered today`);
    assert.ok(a.deliveredPath.startsWith('src/assets/'), `NFR-0008: ${a.assetRole} is delivered from src/assets/`);
  }
  const images = record.assets.filter(a => a.widthPx !== undefined || a.heightPx !== undefined).map(a => a.assetRole).sort();
  assert.deepEqual(images, ['COVER_IMAGE', 'ICON_IMAGE'], 'NFR-0008: the 2 images to inspect are the cover and the icon');
  assert.deepEqual(Object.keys(record).sort(), ['assets', 'runtimeDependenciesBaseline', 'schemaVersion'], 'NFR-0008: the record carries no inspection result: that is written by people in the device log');
});

// ---------------------------------------------------------------- dist folders mounted by the test

const icon = bytesOf('src/assets/icon.png'), cover = bytesOf('src/assets/cover.jpg');
const engine = bytesOf('src/assets/engine-loop.mp3'), tire = bytesOf('src/assets/tire-screech.mp3');
// A JPEG reduced to its frame header: enough for a reader of the size, with the width and height asked.
const jpegOf = (widthPx: number, heightPx: number) => new Uint8Array([0xff, 0xd8, 0xff, 0xc0, 0x00, 0x0b, 0x08, heightPx >> 8, heightPx & 0xff, widthPx >> 8, widthPx & 0xff, 0x01, 0x01, 0x11, 0x00, 0xff, 0xd9]);
// Bytes that gzip cannot shrink (a fixed-seed generator: the same in every run).
function noise(length: number): Uint8Array {
  const out = new Uint8Array(length);
  let seed = 0x9e3779b9;
  for (let i = 0; i < length; i++) { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; out[i] = seed >>> 24; }
  return out;
}
type Dist = {
  files: Record<string, Uint8Array | string>;
  record?: OriginRecord | string | null;
  packageJson?: object | string | null;
};
const HEAD_LINKS = {
  script: '<script type="module" crossorigin src="/assets/index-a1b2c3.js"></script>',
  style: '<link rel="stylesheet" crossorigin href="/assets/index-d4e5f6.css">',
  icon: '<link rel="icon" type="image/png" sizes="192x192" href="/assets/icon-aa11.png" />',
  touch: '<link rel="apple-touch-icon" sizes="192x192" href="/assets/icon-aa11.png" />',
  preview: '<meta property="og:image" content="/assets/cover-bb22.jpg" />',
  preload: '<link rel="preload" as="image" href="/assets/cover-bb22.jpg" />',
};
const indexHtml = (links: Partial<typeof HEAD_LINKS> = HEAD_LINKS) => `<!doctype html><html><head>${Object.values(links).join('')}</head><body><div id="app"></div></body></html>`;
const entryJs = (...recordings: Uint8Array[]) => `const game=1;${recordings.map((r, i) => `const r${i}="${dataUrl(r)}";`).join('')}export{game};`;
// What a build of the feature delivers: the document, the entry script with the two recordings inside, the stylesheet and
// the two images as files with a digest in the name.
const goodDist = (): Dist => ({
  files: {
    'index.html': indexHtml(), 'assets/index-a1b2c3.js': entryJs(engine, tire), 'assets/index-d4e5f6.css': 'body{margin:0}',
    'assets/icon-aa11.png': icon, 'assets/cover-bb22.jpg': cover,
  },
});
const PACKAGE_JSON = { name: 'kartle', dependencies: { three: '^0.186.1' }, devDependencies: { vite: '^8.3.4' } };
function measure(dist: Dist): AssetBudgetRecord {
  const dir = mkdtempSync(join(tmpdir(), 'kartle-asset-budget-'));
  try {
    const distDir = join(dir, 'dist');
    for (const [name, content] of Object.entries(dist.files)) {
      mkdirSync(dirname(join(distDir, name)), { recursive: true });
      writeFileSync(join(distDir, name), content);
    }
    const recordPath = join(dir, 'feature-assets.json'), packageJsonPath = join(dir, 'package.json');
    const given = dist.record === undefined ? record : dist.record;
    if (given !== null) writeFileSync(recordPath, typeof given === 'string' ? given : JSON.stringify(given));
    const pkg = dist.packageJson === undefined ? PACKAGE_JSON : dist.packageJson;
    if (pkg !== null) writeFileSync(packageJsonPath, typeof pkg === 'string' ? pkg : JSON.stringify(pkg));
    return measureAssetBudget({ distDir, recordPath, packageJsonPath });
  } finally { rmSync(dir, { recursive: true, force: true }); }
}
const withAsset = (role: string, bytes: Uint8Array): OriginRecord => ({ ...record, assets: record.assets.map(a => a.assetRole === role ? { ...a, deliveredSha256: sha256(bytes), deliveredBytes: bytes.length } : a) });
const fails = (measured: AssetBudgetRecord, reason: string, criterion: string, situation: string) => {
  assert.equal(measured.verdict, 'FAIL', `${criterion}: ${situation} is FAIL`);
  assert.equal(measured.checkFailReason, reason, `${criterion}: ${situation} is ${reason}`);
};
const RECORD_FIELDS = ['assetCount', 'assetsInInitialDownloadCount', 'checkId', 'coverWidthPx', 'curbSoundFileCount', 'featureAssetBytes', 'initialDownloadBytes', 'newRuntimeDependencyCount', 'verdict'];

test('CHK-TEST-0005-06 the delivered cover is 1200 px wide or more, and a build whose cover is 1199 px wide is COVER_TOO_NARROW', () => {
  // AC-US-0002-02
  const size = readImageSize(cover);
  assert.ok(size !== undefined && size.widthPx >= 1200, `AC-US-0002-02: src/assets/cover.jpg is 1200 px wide or more (${size?.widthPx} px)`);
  assert.equal(measure(goodDist()).coverWidthPx, size!.widthPx, 'AC-US-0002-02: the measure reads the width of the cover it found in the build');
  const narrow = jpegOf(1199, 669), exact = jpegOf(1200, 670);
  const tooNarrow = measure({ files: { ...goodDist().files, 'assets/cover-bb22.jpg': narrow }, record: withAsset('COVER_IMAGE', narrow) });
  fails(tooNarrow, 'COVER_TOO_NARROW', 'AC-US-0002-02', 'a cover of 1199 px');
  assert.equal(tooNarrow.coverWidthPx, 1199, 'AC-US-0002-02: with the width measured');
  const atLimit = measure({ files: { ...goodDist().files, 'assets/cover-bb22.jpg': exact }, record: withAsset('COVER_IMAGE', exact) });
  assert.equal(atLimit.verdict, 'PASS', 'AC-US-0002-02: a cover of exactly 1200 px passes');
  const unreadable = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  const noHeader = measure({ files: { ...goodDist().files, 'assets/cover-bb22.jpg': unreadable }, record: withAsset('COVER_IMAGE', unreadable) });
  fails(noHeader, 'COVER_TOO_NARROW', 'AC-US-0002-02', 'a cover whose header cannot be read');
  assert.equal(noHeader.coverWidthPx, 0, 'AC-US-0002-02: with width 0');
});

test('CHK-TEST-0005-07 the size of an image is read from the header of a PNG and of a JPEG, baseline or progressive, and anything else has no size', () => {
  // AC-US-0002-02
  const png = (w: number, h: number) => new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 13, 0x49, 0x48, 0x44, 0x52, w >>> 24, (w >> 16) & 255, (w >> 8) & 255, w & 255, h >>> 24, (h >> 16) & 255, (h >> 8) & 255, h & 255, 8, 2, 0, 0, 0]);
  assert.deepEqual(readImageSize(png(2752, 1536)), { widthPx: 2752, heightPx: 1536 }, 'AC-US-0002-02: a PNG header gives width and height');
  assert.deepEqual(readImageSize(png(70000, 3)), { widthPx: 70000, heightPx: 3 }, 'AC-US-0002-02: a width above 65,535 is read whole');
  assert.deepEqual(readImageSize(jpegOf(1200, 670)), { widthPx: 1200, heightPx: 670 }, 'AC-US-0002-02: a JPEG frame header gives width and height, not swapped');
  const progressive = jpegOf(1199, 640); progressive[3] = 0xc2;
  assert.deepEqual(readImageSize(progressive), { widthPx: 1199, heightPx: 640 }, 'AC-US-0002-02: a progressive JPEG too');
  // An application segment before the frame header is skipped, and a Huffman table (0xC4) is not a frame header.
  const withSegments = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x04, 0x4a, 0x46, 0xff, 0xc4, 0x00, 0x04, 0x12, 0x34, ...jpegOf(1300, 700).slice(2)]);
  assert.deepEqual(readImageSize(withSegments), { widthPx: 1300, heightPx: 700 }, 'AC-US-0002-02: the segments before the frame header are skipped');
  for (const [label, bytes] of [['an empty file', new Uint8Array(0)], ['a sound file', engine.slice(0, 64)], ['a text', new TextEncoder().encode('<svg width="1200">')], ['a JPEG cut before its frame header', jpegOf(1200, 670).slice(0, 6)], ['a PNG without IHDR', png(1200, 670).map((b, i) => i === 12 ? 0x58 : b)]] as const) {
    assert.equal(readImageSize(bytes), undefined, `AC-US-0002-02: ${label} has no size`);
  }
});

test('CHK-TEST-0005-08 each delivered form fits its ceiling and the 4 sum at most 300,000 bytes; a build whose 4 files sum more is BUDGET_EXCEEDED', () => {
  // NFR-0002
  let sum = 0;
  for (const a of record.assets) {
    const size = bytesOf(a.deliveredPath).length;
    sum += size;
    assert.ok(size <= CEILING[a.assetRole], `NFR-0002: ${a.assetRole} is at most ${CEILING[a.assetRole]} bytes (${size})`);
  }
  assert.ok(sum <= 300_000, `NFR-0002: the 4 delivered files sum at most 300,000 bytes (${sum})`);
  const good = measure(goodDist());
  assert.equal(good.featureAssetBytes, sum, 'NFR-0002: the measure sums the bytes of the 4 delivered forms: the 2 files and the 2 decoded payloads, not their base 64 text');
  // A recording grown until the sum is 300,001 bytes, and one byte less.
  const grown = (total: number) => { const big = noise(total - (sum - engine.length)); big.set(engine.slice(0, 16)); return big; };
  const over = grown(300_001), atLimit = grown(300_000);
  const exceeded = measure({ files: { ...goodDist().files, 'assets/index-a1b2c3.js': entryJs(over, tire) }, record: withAsset('ENGINE_LOOP', over) });
  fails(exceeded, 'BUDGET_EXCEEDED', 'NFR-0002', 'a sum of 300,001 bytes');
  assert.equal(exceeded.featureAssetBytes, 300_001, 'NFR-0002: with the sum measured');
  const allowed = measure({ files: { ...goodDist().files, 'assets/index-a1b2c3.js': entryJs(atLimit, tire) }, record: withAsset('ENGINE_LOOP', atLimit) });
  assert.equal(allowed.verdict, 'PASS', 'NFR-0002: a sum of exactly 300,000 bytes passes');
  assert.equal(allowed.featureAssetBytes, 300_000, 'NFR-0002: with the sum measured');
});

test('CHK-TEST-0005-09 the initial download is the gzip of the document and of every file it asks for when it opens, and 3,000,000 bytes or more is INITIAL_DOWNLOAD_EXCEEDED', () => {
  // NFR-0001
  const good = measure(goodDist());
  assert.equal(good.verdict, 'PASS', `NFR-0001: a build of the feature passes (${JSON.stringify(good)})`);
  assert.ok(good.initialDownloadBytes > good.featureAssetBytes * 0.9 && good.initialDownloadBytes < 3_000_000, `NFR-0001: the 4 files weigh in the initial download, below 3,000,000 bytes (${good.initialDownloadBytes})`);
  // A file the document does not ask for does not count; one it asks for does.
  const stray = measure({ files: { ...goodDist().files, 'assets/unused-zz99.bin': noise(3_200_000) } });
  assert.equal(stray.verdict, 'PASS', 'NFR-0001: a file the document does not ask for is not in the initial download');
  assert.equal(stray.initialDownloadBytes, good.initialDownloadBytes, 'NFR-0001: and does not change the measure');
  const heavy = `${entryJs(engine, tire)}/*${Buffer.from(noise(3_300_000)).toString('base64')}*/`;
  const exceeded = measure({ files: { ...goodDist().files, 'assets/index-a1b2c3.js': heavy } });
  fails(exceeded, 'INITIAL_DOWNLOAD_EXCEEDED', 'NFR-0001', 'an entry script that brings the download to 3,000,000 bytes or more');
  assert.ok(exceeded.initialDownloadBytes >= 3_000_000, `NFR-0001: with the bytes measured (${exceeded.initialDownloadBytes})`);
  assert.equal(exceeded.featureAssetBytes, good.featureAssetBytes, 'NFR-0001: the weight of the 4 files is another measure and did not change');
  // Counted compressed: text that gzip shrinks weighs what it weighs compressed.
  const padded = measure({ files: { ...goodDist().files, 'assets/index-d4e5f6.css': 'a{color:red}'.repeat(400_000) } });
  assert.equal(padded.verdict, 'PASS', 'NFR-0001: 4.8 MB of repeated text compress far below the limit');
  assert.ok(padded.initialDownloadBytes < good.initialDownloadBytes + 100_000, `NFR-0001: the bytes are counted compressed (${padded.initialDownloadBytes})`);
});

test('CHK-TEST-0005-10 a build of the feature delivers 4 of 4 files inside the initial download: the 2 images as files the document asks for and the 2 recordings inside the entry script', () => {
  // NFR-0003
  const good = measure(goodDist());
  assert.equal(good.verdict, 'PASS', `NFR-0003: a build of the feature passes (${JSON.stringify(good)})`);
  assert.equal(good.assetCount, 4, 'NFR-0003: the 4 delivered forms are found');
  assert.equal(good.assetsInInitialDownloadCount, 4, 'NFR-0003: the 4 are inside the initial download');
  const noSound = Object.keys(goodDist().files).filter(name => /\.(mp3|ogg|wav)$/.test(name));
  assert.equal(noSound.length, 0, 'NFR-0003: fixture: the recordings are not files of the build: they have no address to ask for');
  // A publication under a base path names the same files.
  const based = goodDist();
  based.files['index.html'] = indexHtml().replaceAll('"/assets/', '"/kartle-staging/assets/');
  const basedRecord = measure(based);
  assert.equal(basedRecord.assetsInInitialDownloadCount, 4, 'NFR-0003: with the publication under a base path the 4 are still found in the initial download');
  assert.equal(basedRecord.initialDownloadBytes > 0 && basedRecord.verdict, 'PASS', 'NFR-0003: and the build passes');
});

test('CHK-TEST-0005-11 a build without one image or without one recording inside a script is ASSET_MISSING', () => {
  // NFR-0003
  const { 'assets/icon-aa11.png': _icon, ...withoutIcon } = goodDist().files;
  const noIcon = measure({ files: withoutIcon });
  fails(noIcon, 'ASSET_MISSING', 'NFR-0003', 'a build without the icon');
  assert.equal(noIcon.assetCount, 3, 'NFR-0003: with 3 files found');
  const { 'assets/cover-bb22.jpg': _cover, ...withoutCover } = goodDist().files;
  const noCover = measure({ files: withoutCover });
  fails(noCover, 'ASSET_MISSING', 'NFR-0003', 'a build without the cover');
  assert.equal(noCover.coverWidthPx, 0, 'NFR-0003: and no cover width to read');
  const noTire = measure({ files: { ...goodDist().files, 'assets/index-a1b2c3.js': entryJs(engine) } });
  fails(noTire, 'ASSET_MISSING', 'NFR-0003', 'a build without the tyre recording in any script');
  assert.equal(noTire.assetCount, 3, 'NFR-0003: with 3 files found');
  const altered = engine.slice(); altered[altered.length - 1] ^= 1;
  const otherEngine = measure({ files: { ...goodDist().files, 'assets/index-a1b2c3.js': entryJs(altered, tire) } });
  assert.equal(otherEngine.checkFailReason, 'ASSET_MISSING', 'NFR-0003: a recording that differs by one bit from the delivered form is not the delivered form');
  const empty = measure({ files: {} });
  fails(empty, 'ASSET_MISSING', 'NFR-0003', 'a build that does not exist');
  assert.equal(empty.assetCount, 0, 'NFR-0003: with 0 files found');
  assert.deepEqual(Object.keys(empty).sort(), [...RECORD_FIELDS, 'checkFailReason'].sort(), 'NFR-0003: the measure that cannot be made still gives the whole record, with FAIL');
});

test('CHK-TEST-0005-12 a build whose document does not ask for the cover, or whose recording sits in a script the document does not ask for, is ASSET_NOT_IN_INITIAL_DOWNLOAD', () => {
  // NFR-0003
  const { preload: _preload, ...withoutPreload } = HEAD_LINKS;
  const noPreload = measure({ files: { ...goodDist().files, 'index.html': indexHtml(withoutPreload) } });
  fails(noPreload, 'ASSET_NOT_IN_INITIAL_DOWNLOAD', 'NFR-0003', 'a document without the preload of the cover');
  assert.equal(noPreload.assetCount, 4, 'NFR-0003: the 4 files are in the build');
  assert.equal(noPreload.assetsInInitialDownloadCount, 3, 'NFR-0003: but only 3 in the initial download: the preview declaration alone is not asked for by the browser');
  const { icon: _iconLink, ...withoutIconLink } = HEAD_LINKS;
  const noIconLink = measure({ files: { ...goodDist().files, 'index.html': indexHtml(withoutIconLink) } });
  fails(noIconLink, 'ASSET_NOT_IN_INITIAL_DOWNLOAD', 'NFR-0003', 'a document with the home-screen icon only');
  assert.equal(noIconLink.assetsInInitialDownloadCount, 3, 'NFR-0003: the home-screen declaration alone is not asked for when the page opens');
  const lazy = measure({ files: { ...goodDist().files, 'assets/index-a1b2c3.js': entryJs(engine), 'assets/lazy-c7d8.js': entryJs(tire) } });
  fails(lazy, 'ASSET_NOT_IN_INITIAL_DOWNLOAD', 'NFR-0003', 'a recording inside a script the document does not ask for');
  assert.equal(lazy.assetCount, 4, 'NFR-0003: the 4 files are in the build');
  assert.equal(lazy.assetsInInitialDownloadCount, 3, 'NFR-0003: but only 3 in the initial download');
});

test('CHK-TEST-0005-13 the files the document asks for when it opens are its scripts and its stylesheet, modulepreload, icon and preload links of the same origin, each once', () => {
  // NFR-0003
  const html = `<!doctype html><html><head>
    <!-- <link rel="preload" href="/assets/commented.jpg"> -->
    <script type="module" src="/assets/index-a1.js?v=3#top"></script>
    <link rel="stylesheet" href="./assets/index-b2.css">
    <link rel="modulepreload" href="/assets/vendor-c3.js">
    <link rel="icon" type="image/png" href="/assets/icon-d4.png">
    <link rel="apple-touch-icon" href="/assets/touch-e5.png">
    <meta property="og:image" content="/assets/cover-f6.jpg">
    <link rel="preload" as="image" href='/assets/cover-f6.jpg'>
    <link rel="preload" as="image" href="/assets/cover-f6.jpg">
    <link rel="canonical" href="/assets/canonical.html">
    <link rel="icon" href="data:image/png;base64,AAAA">
    <link rel="stylesheet" href="https://fonts.example.invalid/font.css">
    <script src="//cdn.example.invalid/lib.js"></script>
    <script>const inline = "/assets/not-a-file.js";</script>
  </head><body><img src="/assets/body-image.png"></body></html>`;
  assert.deepEqual(initialDownloadFiles(html), ['assets/index-a1.js', 'assets/index-b2.css', 'assets/vendor-c3.js', 'assets/icon-d4.png', 'assets/cover-f6.jpg'],
    'NFR-0003: script[src] and link[href] with rel stylesheet, modulepreload, icon or preload, of the same origin, in document order, each once, without query or fragment');
  assert.deepEqual(initialDownloadFiles('<html><head></head><body></body></html>'), [], 'NFR-0003: a document that asks for nothing gives no file');
});

test('CHK-TEST-0005-14 the payloads embedded in a script are every base 64 data literal of its text, with its type and its decoded bytes', () => {
  // NFR-0003
  const js = `const a="${dataUrl(engine)}",b='${dataUrl(tire, 'audio/mpeg')}';const c=\`${dataUrl(icon, 'image/png')}\`;const d="data:text/plain,not-base-64";const e="/assets/engine-loop.mp3";`;
  const payloads = embeddedPayloads(js);
  assert.equal(payloads.length, 3, `NFR-0003: the three base 64 literals are found, and nothing else (${payloads.length})`);
  assert.deepEqual(payloads.map(p => p.mimeType), ['audio/mpeg', 'audio/mpeg', 'image/png'], 'NFR-0003: each with its type, in the order of the text');
  assert.ok(Buffer.from(payloads[0].bytes).equals(Buffer.from(engine)), 'NFR-0003: the first decodes to the bytes of the engine recording');
  assert.ok(Buffer.from(payloads[1].bytes).equals(Buffer.from(tire)), 'NFR-0003: the second to the bytes of the tyre recording');
  assert.ok(Buffer.from(payloads[2].bytes).equals(Buffer.from(icon)), 'NFR-0003: the third to the bytes of the icon');
  assert.deepEqual(embeddedPayloads('const game = 1; const url = "/assets/x.mp3";'), [], 'NFR-0003: a script without a data literal gives an empty list');
  assert.equal(embeddedPayloads('x="data:AUDIO/MPEG;base64,AAAA"')[0]?.mimeType, 'audio/mpeg', 'NFR-0003: the type is given in lower case');
});

test('CHK-TEST-0005-15 a build of the feature delivers no sound for the curb: any audio file, or a third sound inside a script, is CURB_SOUND_FILE_PRESENT', () => {
  // NFR-0007
  assert.equal(measure(goodDist()).curbSoundFileCount, 0, 'NFR-0007: a build of the feature has 0 curb sound files');
  const curb = noise(900);
  for (const name of ['assets/curb-11aa.mp3', 'assets/curb-11aa.ogg', 'assets/curb-11aa.wav', 'sfx/CURB.M4A']) {
    const withFile = measure({ files: { ...goodDist().files, [name]: curb } });
    fails(withFile, 'CURB_SOUND_FILE_PRESENT', 'NFR-0007', `a build with the sound file ${name}`);
    assert.equal(withFile.curbSoundFileCount, 1, `NFR-0007: ${name} counts as 1 sound file`);
  }
  const embedded = measure({ files: { ...goodDist().files, 'assets/index-a1b2c3.js': `${entryJs(engine, tire)}const curb="${dataUrl(curb, 'audio/ogg')}";` } });
  fails(embedded, 'CURB_SOUND_FILE_PRESENT', 'NFR-0007', 'a build with a third sound inside the script');
  assert.equal(embedded.curbSoundFileCount, 1, 'NFR-0007: the embedded sound counts as 1');
  // The two recordings as files (not embedded) are found but are not curb sounds; an embedded image is not a sound.
  const image = measure({ files: { ...goodDist().files, 'assets/index-a1b2c3.js': `${entryJs(engine, tire)}const dot="${dataUrl(noise(64), 'image/png')}";` } });
  assert.equal(image.curbSoundFileCount, 0, 'NFR-0007: an embedded image is not a sound');
  assert.equal(image.verdict, 'PASS', 'NFR-0007: and the build passes');
});

test('CHK-TEST-0005-16 the feature adds no runtime dependency: package.json lists the baseline, and one more name is NEW_RUNTIME_DEPENDENCY', () => {
  // NFR-0006
  const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')) as { dependencies?: Record<string, string> };
  assert.deepEqual(record.runtimeDependenciesBaseline, ['three'], 'NFR-0006: the baseline before the feature is three alone');
  assert.deepEqual(Object.keys(pkg.dependencies ?? {}).sort(), [...record.runtimeDependenciesBaseline].sort(), 'NFR-0006: the dependencies of package.json are exactly the baseline');
  const good = measure(goodDist());
  assert.equal(good.newRuntimeDependencyCount, 0, 'NFR-0006: a build of the feature has 0 new runtime dependencies');
  const added = measure({ ...goodDist(), packageJson: { ...PACKAGE_JSON, dependencies: { three: '^0.186.1', howler: '^2.2.4', 'audio-decode': '^2.0.0' } } });
  fails(added, 'NEW_RUNTIME_DEPENDENCY', 'NFR-0006', 'a package.json with two more dependencies');
  assert.equal(added.newRuntimeDependencyCount, 2, 'NFR-0006: with the 2 counted');
  const devOnly = measure({ ...goodDist(), packageJson: { ...PACKAGE_JSON, devDependencies: { vite: '^8.3.4', sharp: '^0.34.0' } } });
  assert.equal(devOnly.verdict, 'PASS', 'NFR-0006: a development dependency is not a runtime dependency');
  const removed = measure({ ...goodDist(), packageJson: { name: 'kartle' } });
  assert.equal(removed.newRuntimeDependencyCount, 0, 'NFR-0006: fewer dependencies than the baseline is not a new one');
});

test('CHK-TEST-0005-17 without the origin record, without its dependency baseline or without a readable package.json the measure is BASELINE_MISSING, never a PASS', () => {
  // NFR-0006
  const { runtimeDependenciesBaseline: _baseline, ...withoutBaseline } = record;
  const cases: [string, Dist][] = [
    ['no origin record', { ...goodDist(), record: null }],
    ['an origin record that is not JSON', { ...goodDist(), record: '{ not json' }],
    ['an origin record without runtimeDependenciesBaseline', { ...goodDist(), record: withoutBaseline as OriginRecord }],
    ['no package.json', { ...goodDist(), packageJson: null }],
    ['a package.json that is not JSON', { ...goodDist(), packageJson: 'dependencies: three' }],
  ];
  for (const [label, dist] of cases) {
    const measured = measure(dist);
    fails(measured, 'BASELINE_MISSING', 'NFR-0006', label);
    assert.equal(measured.checkId, 'ASSET_BUDGET', `NFR-0006: ${label} still gives the ASSET_BUDGET record`);
  }
});

test('CHK-TEST-0005-18 the ASSET_BUDGET record carries exactly the fields of the contract, a reason only on FAIL, and the first reason found in the designed order', () => {
  // NFR-0001
  const good = measure(goodDist());
  assert.deepEqual(Object.keys(good).sort(), RECORD_FIELDS, 'NFR-0001: a PASS record has the 2 common fields and the 7 measures, and no reason');
  assert.equal(good.checkId, 'ASSET_BUDGET', 'NFR-0001: the record is ASSET_BUDGET');
  for (const field of RECORD_FIELDS.filter(f => f !== 'checkId' && f !== 'verdict')) assert.ok(Number.isInteger(good[field as keyof AssetBudgetRecord]), `NFR-0001: ${field} is an integer`);
  assert.deepEqual(measure(goodDist()), good, 'NFR-0001: measuring the same build again gives the same record');
  assert.deepEqual(JSON.parse(JSON.stringify(good)), good, 'NFR-0001: the record is one JSON object');
  // Several things wrong at once: the reason reported is the first of the order of DES-0004.
  const narrow = jpegOf(1100, 614), curb = noise(500);
  const everything = (): Dist => ({
    files: { ...goodDist().files, 'assets/cover-bb22.jpg': narrow, 'assets/curb-11aa.mp3': curb, 'assets/index-a1b2c3.js': `${entryJs(engine, tire)}/*${Buffer.from(noise(3_300_000)).toString('base64')}*/` },
    record: withAsset('COVER_IMAGE', narrow), packageJson: { dependencies: { three: '1', extra: '1' } },
  });
  const all = measure(everything());
  fails(all, 'INITIAL_DOWNLOAD_EXCEEDED', 'NFR-0001', 'a heavy download with a narrow cover, a curb sound file and a new dependency');
  assert.deepEqual(Object.keys(all).sort(), [...RECORD_FIELDS, 'checkFailReason'].sort(), 'NFR-0001: a FAIL record adds the reason to the fields of the record');
  assert.deepEqual([all.coverWidthPx, all.curbSoundFileCount, all.newRuntimeDependencyCount], [1100, 1, 1], 'NFR-0001: and still reports every measure');
  const light = everything(); light.files['assets/index-a1b2c3.js'] = entryJs(engine, tire);
  assert.equal(measure(light).checkFailReason, 'COVER_TOO_NARROW', 'NFR-0001: without the heavy download the next reason is the narrow cover');
  light.files['assets/cover-bb22.jpg'] = cover; light.record = record;
  assert.equal(measure(light).checkFailReason, 'CURB_SOUND_FILE_PRESENT', 'NFR-0001: then the curb sound file');
  delete light.files['assets/curb-11aa.mp3'];
  assert.equal(measure(light).checkFailReason, 'NEW_RUNTIME_DEPENDENCY', 'NFR-0001: then the new dependency');
  delete light.files['assets/icon-aa11.png'];
  assert.equal(measure({ ...light, record: null }).checkFailReason, 'BASELINE_MISSING', 'NFR-0001: a missing baseline comes before a missing file');
  assert.equal(measure(light).checkFailReason, 'ASSET_MISSING', 'NFR-0001: and a missing file before every weight');
});
