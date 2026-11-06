// track-pipeline — the offline track preparation program (DES-0010, DES-0011, DM-0002 of pista-kart-park), NOT part of
// the playable client. Application role (program in Node): `npm run track -- <prepare|verify|publish|promote> <trackId>
// <trackVersion> [--esri-decision <reference>]`. The only module of the preparation that reads the wall clock
// (stagedAtUtc, promotedAtUtc) and touches the disk; the libraries scripts/trackPrep.ts and scripts/trackChecks.ts are pure.
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { TRAINING_TRACKS } from '../src/trainingSession';
import { prepareReplicaTrack, readReplicaTrack, serializeTrackFile, type PrepRecord, type ReplicaPrepRecord, type Schema3File } from './trackPrep';
import { MAX_FILE_BYTES, verifyTrackFile } from './trackChecks';

const COMMANDS = ['prepare', 'verify', 'publish', 'promote'] as const;
type Command = typeof COMMANDS[number];
const TRACK_ID_RE = /^[a-z0-9-]{1,40}$/;
const TRACK_VERSION_RE = /^[1-9][0-9]{0,5}$/;
const CONTROL_RE = /[\u0000-\u001f\u007f-\u009f]/;
const ESRI_OPTION = '--esri-decision';
const ESRI_MAX_CHARS = 200;
const REGISTRY_VERSION = 1;
// Run from the repository root (`npm run track -- ...`): every path below is relative to it.
const ROOT = process.cwd();
const REGISTRY_FILE = 'tracks/registry.json';
// The origin of each published (trackId, trackVersion) and the SHA-256 it must have; another digest is refused without
// touching the origin. A frozen pair is published and is never prepared, verified or published again (ADR-0008).
type TrackOrigin = { file: string; sha256: string; method: 'SMOOTHED_ORIGIN' | 'REPLICA'; frozen?: true };
const TRACK_ORIGINS: Readonly<Record<string, Readonly<Record<number, TrackOrigin>>>> = Object.freeze({
  'kart-park': Object.freeze({
    1: Object.freeze({ file: 'tracks/sources/kart-park.json', sha256: '52c5adda4ce89bd23a00e04a10d7e12a28900dd4d56414f444e0a4795f2c5302', method: 'SMOOTHED_ORIGIN', frozen: true } as const),
    2: Object.freeze({ file: 'tracks/sources/kart-park-replica.json', sha256: 'eba665b6c700fe7a05cd89862ef74d93ce307e613393e34cf78b9c69b2caa24e', method: 'REPLICA' } as const),
  }),
});

type RegistryEntry = {
  trackId: string; trackVersion: number; file: string; sha256: string; fileBytes: number;
  publicationState: 'STAGING' | 'PRODUCTION'; stagedAtUtc: string; promotedAtUtc?: string; esriDecisionRef?: string;
  prep: ({ originFile: string; originSha256: string } & PrepRecord) | ({ originFile: string; originSha256: string } & ReplicaPrepRecord);
};
type Registry = { registryVersion: number; entries: RegistryEntry[] };
type Args = { command: Command; trackId: string; trackVersion: number; origin: TrackOrigin; esriDecision?: string };

const invalid = (name: string): never => { console.error(`argumento inválido: ${name}`); process.exit(1); };
const fail = (message: string): never => { console.error(message); process.exit(1); };

// Every argument validated before any file is read or written; the only disk consult is the existence of the origin.
function parseArgs(argv: string[]): Args {
  const [command, trackId, trackVersion, ...rest] = argv;
  if (!command || !(COMMANDS as readonly string[]).includes(command)) return invalid('comando');
  if (!trackId || !TRACK_ID_RE.test(trackId)) return invalid('trackId');
  if (!TRAINING_TRACKS.some(o => o.trackId === trackId)) return invalid('trackId');
  if (!trackVersion || !TRACK_VERSION_RE.test(trackVersion)) return invalid('trackVersion');
  const origin = Object.hasOwn(TRACK_ORIGINS, trackId) ? TRACK_ORIGINS[trackId][Number(trackVersion)] : undefined;
  if (!origin) return invalid('trackVersion');
  if (command !== 'promote' && origin.frozen) return fail(`recusado: ${trackId} ${trackVersion} é versão publicada e congelada`);
  if (!existsSync(join(ROOT, origin.file))) return invalid('trackVersion');
  let esriDecision: string | undefined;
  for (let i = 0; i < rest.length; i++) {
    if (rest[i] === ESRI_OPTION) {
      if (command !== 'promote' || esriDecision !== undefined || i + 1 >= rest.length) return invalid(ESRI_OPTION);
      const value = rest[i + 1].trim();
      if (value.length < 1 || value.length > ESRI_MAX_CHARS || CONTROL_RE.test(value)) return invalid(ESRI_OPTION);
      esriDecision = value;
      i++;
    } else return invalid(rest[i]);
  }
  if (command === 'promote' && esriDecision === undefined) return invalid(ESRI_OPTION);
  return { command: command as Command, trackId, trackVersion: Number(trackVersion), origin, esriDecision };
}

const sha256 = (bytes: Buffer | string) => createHash('sha256').update(bytes).digest('hex');
const publishedPath = (trackId: string, trackVersion: number) => `src/tracks/${trackId}-v${trackVersion}.json`;

// Temporary file in the same folder, then rename: a failure in the middle leaves the previous file intact.
function writeAtomic(relative: string, text: string): void {
  const target = join(ROOT, relative);
  mkdirSync(dirname(target), { recursive: true });
  const temporary = `${target}.tmp`;
  writeFileSync(temporary, text, 'utf8');
  renameSync(temporary, target);
}

function readRegistry(): Registry {
  const path = join(ROOT, REGISTRY_FILE);
  if (!existsSync(path)) return { registryVersion: REGISTRY_VERSION, entries: [] };
  let parsed: unknown;
  try { parsed = JSON.parse(readFileSync(path, 'utf8')); } catch { return fail(`recusado: ${REGISTRY_FILE} ilegível`); }
  if (typeof parsed !== 'object' || parsed === null || (parsed as Registry).registryVersion !== REGISTRY_VERSION || !Array.isArray((parsed as Registry).entries)) {
    return fail(`recusado: ${REGISTRY_FILE} de versão desconhecida`);
  }
  return parsed as Registry;
}
const writeRegistry = (registry: Registry) => writeAtomic(REGISTRY_FILE, JSON.stringify(registry, null, 2) + '\n');
const findEntry = (registry: Registry, trackId: string, trackVersion: number) => registry.entries.find(e => e.trackId === trackId && e.trackVersion === trackVersion);

function readOrigin(origin: TrackOrigin): { json: unknown; bytes: Buffer } {
  const bytes = readFileSync(join(ROOT, origin.file));
  if (sha256(bytes) !== origin.sha256) return fail(`recusado: origem ${origin.file} com resumo diferente do esperado`);
  let json: unknown;
  try { json = JSON.parse(bytes.toString('utf8')); } catch { return fail(`recusado: origem ${origin.file} não é JSON`); }
  return { json, bytes };
}

// Only the replica method is ever run: the version-1 (smoothed origin) preparation is frozen and refused by parseArgs.
function runPreparation(args: Args, json: unknown): { file: Schema3File; prep: ReplicaPrepRecord } {
  if (args.origin.method !== 'REPLICA') return fail(`recusado: ${args.trackId} ${args.trackVersion} é versão publicada e congelada`);
  const replica = readReplicaTrack(json);
  if ('error' in replica) return fail(`recusado: ${replica.error}`);
  const result = prepareReplicaTrack(replica, { trackId: args.trackId, trackVersion: args.trackVersion });
  if ('error' in result) return fail(`recusado: ${result.error}`);
  return result;
}

function prepare(args: Args): void {
  const registry = readRegistry();
  if (findEntry(registry, args.trackId, args.trackVersion)) return fail(`recusado: ${args.trackId} ${args.trackVersion} já está no registro; uma versão publicada nunca é regenerada`);
  const { json } = readOrigin(args.origin);
  const result = runPreparation(args, json);
  const text = serializeTrackFile(result.file);
  const path = publishedPath(args.trackId, args.trackVersion);
  writeAtomic(path, text);
  const reduced = result.prep.reducedCurbs.map(r => `${r.curbIndex}:${r.widthM}`).join(' ') || 'nenhuma';
  console.log(`PREPARED ${path} lapLengthM=${result.prep.lapLengthM} maxReplicaOffsetM=${result.prep.maxReplicaOffsetM} reducedCurbs=${reduced} bytes=${Buffer.byteLength(text)}`);
}

function verify(args: Args, quiet = false): { text: string; verified: boolean } {
  const path = join(ROOT, publishedPath(args.trackId, args.trackVersion));
  if (!existsSync(path)) return fail(`recusado: ${publishedPath(args.trackId, args.trackVersion)} não existe; execute prepare`);
  const text = readFileSync(path, 'utf8');
  const { json } = readOrigin(args.origin);
  const results = verifyTrackFile(text, json);
  const failed = results.filter(r => !r.pass);
  if (!quiet) for (const r of results) console.log(`${r.id} ${r.pass ? 'PASS' : 'FAIL'} ${r.detail}`);
  if (failed.length) { console.log(`REJECTED ${failed.map(r => r.id).join(' ')}`); return { text, verified: false }; }
  console.log('VERIFIED');
  return { text, verified: true };
}

function publish(args: Args): void {
  const { text, verified } = verify(args, true);
  if (!verified) return process.exit(1);
  const digest = sha256(text);
  const registry = readRegistry();
  const existing = findEntry(registry, args.trackId, args.trackVersion);
  if (existing) {
    if (existing.sha256 === digest) { console.log(`já registrado ${args.trackId} ${args.trackVersion} ${existing.publicationState}`); return; }
    return fail('recusado: trackVersion já publicado com outro conteúdo');
  }
  const { json, bytes } = readOrigin(args.origin);
  const result = runPreparation(args, json);
  if (serializeTrackFile(result.file) !== text) return fail('recusado: o arquivo publicado não é reproduzível pelo preparo');
  const fileBytes = Buffer.byteLength(text);
  if (fileBytes >= MAX_FILE_BYTES) return fail(`recusado: ${fileBytes} bytes`);
  registry.entries.push({
    trackId: args.trackId, trackVersion: args.trackVersion, file: publishedPath(args.trackId, args.trackVersion),
    sha256: digest, fileBytes, publicationState: 'STAGING', stagedAtUtc: new Date().toISOString(),
    prep: {
      method: result.prep.method, originFile: args.origin.file, originSha256: sha256(bytes), maxReplicaOffsetM: result.prep.maxReplicaOffsetM,
      lapLengthM: result.prep.lapLengthM, originOffsetM: result.prep.originOffsetM, curbWidthsM: result.prep.curbWidthsM, reducedCurbs: result.prep.reducedCurbs,
    },
  });
  writeRegistry(registry);
  console.log(`STAGING registrado ${args.trackId} ${args.trackVersion} sha256=${digest} bytes=${fileBytes}`);
}

function promote(args: Args): void {
  const registry = readRegistry();
  const entry = findEntry(registry, args.trackId, args.trackVersion);
  if (!entry) return fail(`recusado: ${args.trackId} ${args.trackVersion} não está no registro; execute publish`);
  if (entry.publicationState === 'PRODUCTION') { console.log(`já promovido ${args.trackId} ${args.trackVersion}`); return; }
  entry.publicationState = 'PRODUCTION';
  entry.promotedAtUtc = new Date().toISOString();
  entry.esriDecisionRef = args.esriDecision as string;
  writeRegistry(registry);
  console.log(`PRODUCTION registrado ${args.trackId} ${args.trackVersion}`);
}

const args = parseArgs(process.argv.slice(2));
if (args.command === 'prepare') prepare(args);
else if (args.command === 'verify') { if (!verify(args).verified) process.exit(1); }
else if (args.command === 'publish') publish(args);
else promote(args);
