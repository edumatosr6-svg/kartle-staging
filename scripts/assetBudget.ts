// assetBudget — the measure of the build of apresentacao-e-som (DES-0004, API-0003 `ASSET_BUDGET`), NOT part of the
// playable client: no module of src/ imports it. Reads a built `dist`, the origin record of the feature's files and
// package.json; reads no network and no clock, and writes nothing.
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';
import { gzipSync } from 'node:zlib';

export type AssetBudgetFailReason =
  | 'BASELINE_MISSING' | 'ASSET_MISSING' | 'ASSET_NOT_IN_INITIAL_DOWNLOAD' | 'BUDGET_EXCEEDED'
  | 'INITIAL_DOWNLOAD_EXCEEDED' | 'COVER_TOO_NARROW' | 'CURB_SOUND_FILE_PRESENT' | 'NEW_RUNTIME_DEPENDENCY';
export type AssetBudgetRecord = {
  checkId: 'ASSET_BUDGET'; verdict: 'PASS' | 'FAIL'; checkFailReason?: AssetBudgetFailReason;
  initialDownloadBytes: number; featureAssetBytes: number; assetCount: number;
  assetsInInitialDownloadCount: number; coverWidthPx: number; curbSoundFileCount: number;
  newRuntimeDependencyCount: number;
};

export const FEATURE_ASSET_COUNT = 4;
export const FEATURE_ASSET_BUDGET_BYTES = 300_000;
// "3 MB" read as 3,000,000 bytes, the stricter of the two readings (ADR-0003).
export const INITIAL_DOWNLOAD_LIMIT_BYTES = 3_000_000;
export const COVER_MIN_WIDTH_PX = 1200;
const AUDIO_EXTENSIONS = ['.mp3', '.ogg', '.oga', '.wav', '.m4a', '.aac', '.flac', '.opus', '.weba'];
// What the browser fetches by itself when the document opens; apple-touch-icon and og:image are not fetched then.
const INITIAL_LINK_RELS = ['stylesheet', 'modulepreload', 'icon', 'preload'];
const SOUND_ROLES = ['ENGINE_LOOP', 'TIRE_SCREECH'];

// Width and height from the header of a PNG (IHDR) or of a JPEG (start-of-frame marker); undefined for anything else.
export function readImageSize(bytes: Uint8Array): { widthPx: number; heightPx: number } | undefined {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (bytes.length >= 24 && PNG_SIGNATURE.every((b, i) => bytes[i] === b)) {
    if (String.fromCharCode(bytes[12], bytes[13], bytes[14], bytes[15]) !== 'IHDR') return undefined;
    return { widthPx: view.getUint32(16), heightPx: view.getUint32(20) };
  }
  if (bytes.length >= 4 && bytes[0] === 0xff && bytes[1] === 0xd8) {
    let at = 2;
    while (at + 4 <= bytes.length) {
      if (bytes[at] !== 0xff) return undefined;
      const marker = bytes[at + 1];
      if (marker === 0xff) { at++; continue; }
      // Markers without a length: restart markers, start and end of image, TEM.
      if ((marker >= 0xd0 && marker <= 0xd9) || marker === 0x01) { at += 2; continue; }
      const length = view.getUint16(at + 2);
      const startOfFrame = marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
      if (startOfFrame) {
        if (at + 9 > bytes.length) return undefined;
        return { widthPx: view.getUint16(at + 7), heightPx: view.getUint16(at + 5) };
      }
      // Start of scan: the entropy-coded data follows, and no frame header was found before it.
      if (marker === 0xda || length < 2) return undefined;
      at += 2 + length;
    }
  }
  return undefined;
}

const attributesOf = (tag: string): Record<string, string> => {
  const attributes: Record<string, string> = {};
  for (const m of tag.matchAll(/([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g)) {
    const name = m[1].toLowerCase();
    if (!(name in attributes)) attributes[name] = m[2] ?? m[3] ?? m[4] ?? '';
  }
  return attributes;
};

// The files of the same origin the document asks for when it opens: `script[src]` and `link[href]` with rel stylesheet,
// modulepreload, icon or preload. Each once, in document order, as a path without the leading slash, the query and the
// fragment; an address of another origin (with a scheme or `//`) and a `data:` address are not files of the publication.
export function initialDownloadFiles(indexHtml: string): string[] {
  const files: string[] = [];
  const html = indexHtml.replace(/<!--[\s\S]*?-->/g, '');
  for (const m of html.matchAll(/<(script|link)\b([^>]*)>/gi)) {
    const attributes = attributesOf(m[2]);
    let address: string | undefined;
    if (m[1].toLowerCase() === 'script') address = attributes.src;
    else if ((attributes.rel ?? '').toLowerCase().split(/\s+/).some(rel => INITIAL_LINK_RELS.includes(rel))) address = attributes.href;
    if (!address || /^([a-z][a-z0-9+.-]*:|\/\/)/i.test(address)) continue;
    const path = address.replace(/[?#].*$/, '').replace(/^(\.?\/)+/, '');
    if (path && !files.includes(path)) files.push(path);
  }
  return files;
}

// Every `data:<type>;base64,<payload>` literal in the text of a script, with its type and the decoded bytes.
export function embeddedPayloads(jsText: string): { mimeType: string; bytes: Uint8Array }[] {
  const payloads: { mimeType: string; bytes: Uint8Array }[] = [];
  for (const m of jsText.matchAll(/data:([a-zA-Z0-9.+-]+\/[a-zA-Z0-9.+-]+)(?:;[a-zA-Z0-9.+=-]+)*?;base64,([A-Za-z0-9+/]+={0,2})/g)) {
    payloads.push({ mimeType: m[1].toLowerCase(), bytes: new Uint8Array(Buffer.from(m[2], 'base64')) });
  }
  return payloads;
}

const sha256 = (bytes: Uint8Array) => createHash('sha256').update(bytes).digest('hex');

function filesUnder(dir: string, prefix = ''): string[] {
  const files: string[] = [];
  for (const name of readdirSync(dir).sort()) {
    const relative = prefix ? `${prefix}/${name}` : name;
    if (statSync(join(dir, name)).isDirectory()) files.push(...filesUnder(join(dir, name), relative));
    else files.push(relative);
  }
  return files;
}

type OriginRecord = { assets: { assetRole: string; deliveredSha256: string }[]; runtimeDependenciesBaseline: string[] };
function readOriginRecord(recordPath: string): OriginRecord | undefined {
  try {
    const record = JSON.parse(readFileSync(recordPath, 'utf8')) as Partial<OriginRecord>;
    if (!Array.isArray(record.runtimeDependenciesBaseline) || !record.runtimeDependenciesBaseline.every(name => typeof name === 'string')) return undefined;
    if (!Array.isArray(record.assets) || !record.assets.every(a => a && typeof a.assetRole === 'string' && typeof a.deliveredSha256 === 'string')) return undefined;
    return record as OriginRecord;
  } catch { return undefined; }
}
function readRuntimeDependencies(packageJsonPath: string): string[] | undefined {
  try {
    const dependencies = (JSON.parse(readFileSync(packageJsonPath, 'utf8')) as { dependencies?: unknown }).dependencies ?? {};
    return typeof dependencies === 'object' && dependencies !== null ? Object.keys(dependencies) : undefined;
  } catch { return undefined; }
}

// The `ASSET_BUDGET` record of a built `dist`. A measure that cannot be made gives a FAIL record, never an absent one; a
// count that could not be measured is 0. The first reason found, in the order of DES-0004, is the one reported.
export function measureAssetBudget(paths: { distDir: string; recordPath: string; packageJsonPath: string }): AssetBudgetRecord {
  const record = readOriginRecord(paths.recordPath);
  const dependencies = readRuntimeDependencies(paths.packageJsonPath);
  const distFiles = existsSync(paths.distDir) && statSync(paths.distDir).isDirectory() ? filesUnder(paths.distDir) : [];
  const bytesOf = new Map(distFiles.map(file => [file, new Uint8Array(readFileSync(join(paths.distDir, file)))] as const));

  // The initial download: the document and what it asks for. An address that carries the publication base (`vite build
  // --base=/name/`) names the dist file its trailing segments spell.
  const initial = new Set<string>();
  const indexHtml = bytesOf.get('index.html');
  if (indexHtml) {
    initial.add('index.html');
    for (const asked of initialDownloadFiles(Buffer.from(indexHtml).toString('utf8'))) {
      const segments = asked.split('/');
      for (let from = 0; from < segments.length; from++) {
        const candidate = segments.slice(from).join('/');
        if (bytesOf.has(candidate)) { initial.add(candidate); break; }
      }
    }
  }
  let initialDownloadBytes = 0;
  for (const file of initial) initialDownloadBytes += gzipSync(bytesOf.get(file)!, { level: 9 }).length;

  // Each delivered form, found by its digest: as a file of dist, or as a payload embedded in a script of dist.
  type Found = { file: string; bytes: Uint8Array };
  const found = new Map<string, Found>();
  const fileDigests = new Map(distFiles.map(file => [file, sha256(bytesOf.get(file)!)] as const));
  const scriptPayloads = distFiles.filter(file => extname(file).toLowerCase() === '.js').flatMap(file =>
    embeddedPayloads(Buffer.from(bytesOf.get(file)!).toString('utf8')).map(payload => ({ file, ...payload, digest: sha256(payload.bytes) })));
  for (const asset of record?.assets ?? []) {
    if (found.has(asset.assetRole)) continue;
    const digest = asset.deliveredSha256.toLowerCase();
    const asFile = distFiles.find(file => fileDigests.get(file) === digest);
    const embedded = scriptPayloads.find(payload => payload.digest === digest);
    if (asFile) found.set(asset.assetRole, { file: asFile, bytes: bytesOf.get(asFile)! });
    else if (embedded) found.set(asset.assetRole, { file: embedded.file, bytes: embedded.bytes });
  }
  const assetCount = found.size;
  const assetsInInitialDownloadCount = [...found.values()].filter(f => initial.has(f.file)).length;
  const featureAssetBytes = [...found.values()].reduce((sum, f) => sum + f.bytes.length, 0);
  const cover = found.get('COVER_IMAGE');
  const coverWidthPx = (cover && readImageSize(cover.bytes)?.widthPx) || 0;

  // Every sound besides the two recordings counts, delivered as a file or embedded: the feature admits only the two.
  const soundDigests = new Set((record?.assets ?? []).filter(a => SOUND_ROLES.includes(a.assetRole)).map(a => a.deliveredSha256.toLowerCase()));
  const curbSoundFileCount = !record ? 0 :
    distFiles.filter(file => AUDIO_EXTENSIONS.includes(extname(file).toLowerCase()) && !soundDigests.has(fileDigests.get(file)!)).length
    + scriptPayloads.filter(payload => payload.mimeType.startsWith('audio/') && !soundDigests.has(payload.digest)).length;

  const newRuntimeDependencyCount = record && dependencies ? dependencies.filter(name => !record.runtimeDependenciesBaseline.includes(name)).length : 0;

  const checkFailReason: AssetBudgetFailReason | undefined =
    !record || !dependencies ? 'BASELINE_MISSING'
    : assetCount !== FEATURE_ASSET_COUNT ? 'ASSET_MISSING'
    : assetsInInitialDownloadCount < FEATURE_ASSET_COUNT ? 'ASSET_NOT_IN_INITIAL_DOWNLOAD'
    : featureAssetBytes > FEATURE_ASSET_BUDGET_BYTES ? 'BUDGET_EXCEEDED'
    : initialDownloadBytes >= INITIAL_DOWNLOAD_LIMIT_BYTES ? 'INITIAL_DOWNLOAD_EXCEEDED'
    : coverWidthPx < COVER_MIN_WIDTH_PX ? 'COVER_TOO_NARROW'
    : curbSoundFileCount > 0 ? 'CURB_SOUND_FILE_PRESENT'
    : newRuntimeDependencyCount > 0 ? 'NEW_RUNTIME_DEPENDENCY'
    : undefined;
  return {
    checkId: 'ASSET_BUDGET', verdict: checkFailReason ? 'FAIL' : 'PASS', ...(checkFailReason ? { checkFailReason } : {}),
    initialDownloadBytes, featureAssetBytes, assetCount, assetsInInitialDownloadCount, coverWidthPx, curbSoundFileCount,
    newRuntimeDependencyCount,
  };
}
