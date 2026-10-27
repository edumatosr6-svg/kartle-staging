// Kart Park fixtures (test strategy of pista-kart-park, "Fixtures"): the published file and the origin are read in
// place, never copied; every derived copy is a new object with one deviation, named after what it breaks. The
// published file is never mutated (I3). Synthetic data only: nothing here comes from a player (D-TS-06).
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import type { Line } from '../../src/track';
import { readTrackData, type TrackReading } from '../../src/trackData';
import { buildTrackGeometry, type TrackGeometry } from '../../src/trackGeometry';
import { trackEnvironment, type Environment } from '../../src/physics';

export type KartParkPoint = { xM: number; zM: number; widthM: number };
export type KartParkCurb = { side: 'LEFT' | 'RIGHT'; fromLapM: number; toLapM: number; widthM: number };
export type KartParkFile = {
  schemaVersion: number; trackId: string; trackVersion: number; osmDerived: boolean; direction: string;
  startPosition: { xM: number; zM: number; headingDeg: number };
  finishLine: Line; sectorLimits: Line[]; markers: Line[];
  centerline: KartParkPoint[]; curbs: KartParkCurb[]; barriers: { points: { xM: number; zM: number }[] }[];
  [extra: string]: unknown;
};
export type OriginJson = {
  formato: string; versao: number; id: string; sentido: string; comprimento_m: number;
  pontos: [number, number, number][]; zebras: { lado: string; de_m: number; ate_m: number }[];
  [extra: string]: unknown;
};

const here = dirname(fileURLToPath(import.meta.url));
export const ROOT = join(here, '..', '..');
export const PUBLISHED_PATH = join(ROOT, 'src', 'tracks', 'kart-park-v1.json');
export const ORIGIN_PATH = join(ROOT, 'tracks', 'sources', 'kart-park.json');
export const REGISTRY_PATH = join(ROOT, 'tracks', 'registry.json');

let publishedText: string | undefined;
let originText: string | undefined;
export function kartParkText(): string { return publishedText ??= readFileSync(PUBLISHED_PATH, 'utf8'); }
export function originText_(): string { return originText ??= readFileSync(ORIGIN_PATH, 'utf8'); }
export function kartParkFile(): KartParkFile { return JSON.parse(kartParkText()) as KartParkFile; }
export function originJson(): OriginJson { return JSON.parse(originText_()) as OriginJson; }
export function registryJson(): { registryVersion: number; entries: Record<string, unknown>[] } {
  return JSON.parse(readFileSync(REGISTRY_PATH, 'utf8')) as { registryVersion: number; entries: Record<string, unknown>[] };
}

export function kartParkReading(): TrackReading { return readTrackData(kartParkText()); }

// The geometry and the environment of the published file, built once per process and shared read-only (frozen).
let geometry: TrackGeometry | undefined;
export function kartParkGeometry(): TrackGeometry {
  if (geometry) return geometry;
  const r = kartParkReading();
  if (r.trackDataStatus !== 'COMPLETE' || !r.centerline) throw new Error(`fixture: the Kart Park reading must be COMPLETE (${r.trackDataStatus})`);
  return geometry = buildTrackGeometry(r.centerline, r.curbs ?? [], r.barriers ?? []);
}
// One environment per process: the same object (and the same surfaceAt closure) in every lap, so sessions compare deepEqual.
let environment: Environment | undefined;
export function kartParkEnvironment(): Environment { return environment ??= trackEnvironment(kartParkGeometry()); }

// --- derived copies, one deviation each (new objects every call) ---

export function withoutCenterline(): KartParkFile { const f = kartParkFile(); delete (f as Partial<KartParkFile>).centerline; return f; }
export function withTwoPointCenterline(): KartParkFile { const f = kartParkFile(); f.centerline = f.centerline.slice(0, 2); return f; }
export function withZeroWidth(index = 10): KartParkFile { const f = kartParkFile(); f.centerline[index] = { ...f.centerline[index], widthM: 0 }; return f; }
export function withInvalidCurbSide(): KartParkFile { const f = kartParkFile(); f.curbs[0] = { ...f.curbs[0], side: 'MIDDLE' as 'LEFT' }; return f; }
export function withOnePointBarrier(): KartParkFile { const f = kartParkFile(); f.barriers = [{ points: f.barriers[0].points.slice(0, 1) }]; return f; }
export function withoutBarriers(): KartParkFile { const f = kartParkFile(); f.barriers = []; return f; }
export function withoutCurbs(): KartParkFile { const f = kartParkFile(); f.curbs = []; return f; }
export function withTextOsmDerived(): KartParkFile { const f = kartParkFile(); f.osmDerived = 'sim' as unknown as boolean; return f; }
export function withSchema4(): KartParkFile { return { ...kartParkFile(), schemaVersion: 4 }; }
export function corruptedText(): string { return kartParkText().slice(0, 500); }
// One point moved 0.4 m along its normal, away from its origin point (V01 and V07 bound of 0.30 m); still readable.
export function withPointOffset(index = 400, metres = 0.4): KartParkFile {
  const f = kartParkFile();
  const normal = kartParkGeometry().normals[index];
  f.centerline[index] = {
    ...f.centerline[index],
    xM: Number((f.centerline[index].xM + normal.x * metres).toFixed(3)), zM: Number((f.centerline[index].zM + normal.z * metres).toFixed(3)),
  };
  return f;
}
// The whole centerline translated 0.4 m east: every point leaves its origin point by 0.4 m, the lap length is kept.
export function withShiftedCenterline(metres = 0.4): KartParkFile {
  const f = kartParkFile();
  f.centerline = f.centerline.map(p => ({ ...p, xM: Number((p.xM + metres).toFixed(3)) }));
  return f;
}
export function withScaledCoordinates(factor = 1.02): KartParkFile {
  const f = kartParkFile();
  f.centerline = f.centerline.map(p => ({ ...p, xM: Number((p.xM * factor).toFixed(3)), zM: Number((p.zM * factor).toFixed(3)) }));
  return f;
}
export function withReversedCenterline(): KartParkFile {
  const f = kartParkFile();
  f.centerline = [f.centerline[0], ...f.centerline.slice(1).reverse()];
  return f;
}
export function withoutMarker(index = 20): KartParkFile { const f = kartParkFile(); f.markers = f.markers.filter((_, i) => i !== index); return f; }
export function withCurbOnOtherSide(index = 3): KartParkFile {
  const f = kartParkFile();
  f.curbs[index] = { ...f.curbs[index], side: f.curbs[index].side === 'LEFT' ? 'RIGHT' : 'LEFT' };
  return f;
}
// The first barrier vertex moved onto the asphalt of the nearest centerline point.
export function withBarrierVertexOnAsphalt(): KartParkFile {
  const f = kartParkFile();
  const v = f.barriers[0].points[0];
  let best = f.centerline[0], bestD = Infinity;
  for (const p of f.centerline) { const d = Math.hypot(p.xM - v.xM, p.zM - v.zM); if (d < bestD) { bestD = d; best = p; } }
  f.barriers[0].points[0] = { xM: best.xM, zM: best.zM };
  return f;
}
export function withRecordField(): KartParkFile { return { ...kartParkFile(), recordeMs: 41450 }; }
export function withTrackVersion2(): KartParkFile { return { ...kartParkFile(), trackVersion: 2 }; }
export function withOtherTrackId(): KartParkFile { return { ...kartParkFile(), trackId: 'other-park' }; }
