// Measures, verdicts and serialization of the kartModelReport records (API-0002, DES-0006) for the modelo-kart-01
// suites: the assembled model measured in Node, the RULE-0001 decision table, the wheel spin after a known number of
// steps, the layering of the simulation, the neutrality of the presentation, the step contract, determinism and
// wheelPositions against the pre-feature baseline (DM-0001), and the telemetry wheel positions. Evidence only (I9):
// it reads the model and the simulation through their public operations; no module of src/ imports it. No clock,
// no random, no network: every time is toMs(steps) and every input comes from the fixture or from the test.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { isDeepStrictEqual } from 'node:util';
import * as THREE from 'three';
import {
  initialState, PUBLISHED_SETUPS, STEP, step, track, wheelPositions, WIDTH,
  type Input, type KartConfig, type SetupId, type State,
} from '../../src/physics';
import { getLapResult, getLapState, stepLap, type LapKind, type LapSession } from '../../src/lap';
import { toMs } from '../../src/lapTiming';
import type { TrackReading } from '../../src/trackData';
import {
  buildKart01Model, KART01_GROUP_NAMES, PILOT_GROUP_NAME, updateKart01Pose,
  type Kart01GroupName, type Kart01Model, type WheelName,
} from '../../src/kart01Model';
import { advanceWheelSpin, getKartPose, initialWheelSpin, simWheelGroundPositions, WHEEL_NAMES, type KartPose } from '../../src/kartPose';
import { computeCameraView, trackBoundsOf, type CameraView } from '../../src/gameCamera';
import { replay, runCountdown, startSession } from './autopilot';
import { syntheticReading } from '../fixtures/trackFiles';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const BASELINE_PATH = 'tests/fixtures/kart01-sim-baseline.json';

// ---------------------------------------------------------------- API-0002 types

export type CheckId =
  | 'KART_DIMENSIONS' | 'WHEELS_AND_TRACKS' | 'PART_GROUPS' | 'PART_COLORS' | 'DRAW_COST' | 'WHEEL_SPIN'
  | 'LAYERING' | 'RENDER_NEUTRAL' | 'SIM_CONTRACT' | 'DETERMINISM' | 'WHEEL_POSITIONS' | 'TELEMETRY_WHEEL_POSITIONS';
export type CheckFailReason =
  | 'OUT_OF_TOLERANCE' | 'GROUP_MISSING' | 'GROUP_NESTED' | 'COLOR_MISMATCH' | 'LIMIT_EXCEEDED' | 'SHAPE_CHANGED'
  | 'SPIN_MISMATCH' | 'FORBIDDEN_IMPORT' | 'STATE_DIFFERS' | 'CONTRACT_CHANGED' | 'NON_DETERMINISTIC' | 'BASELINE_MISSING';
export type Verdict = { verdict: 'PASS' } | { verdict: 'FAIL'; checkFailReason: CheckFailReason };

export type PartGroupEntry = { groupName: string; visibleTriangleCount: number; parentGroupName?: string };
export type WheelSpinEntry = { groupName: WheelName; diameterM: number; spinRevs: number; expectedSpinRevs: number };

export type KartDimensionsRecord = { checkId: 'KART_DIMENSIONS'; bboxLengthM: number; bboxWidthM: number; wheelbaseM: number } & Verdict;
export type WheelsAndTracksRecord = { checkId: 'WHEELS_AND_TRACKS'; frontWheelDiametersM: [number, number]; rearWheelDiametersM: [number, number]; frontTrackM: number; rearTrackM: number } & Verdict;
export type PartGroupsRecord = { checkId: 'PART_GROUPS'; partGroups: PartGroupEntry[]; missingGroupNames: string[] } & Verdict;
export type PartColorsRecord = { checkId: 'PART_COLORS'; kartColorHexes: string[]; chassisColorHexes: string[]; bumperPlateColorHex: string; suitColorHex: string } & Verdict;
export type DrawCostRecord = { checkId: 'DRAW_COST'; meshCount: number; drawCallCount: number; triangleCount: number } & Verdict;
export type WheelSpinRecord = { checkId: 'WHEEL_SPIN'; checkStepCount: number; simulatedTimeMs: number; rollingSpeedMps: number; wheels: WheelSpinEntry[] } & Verdict;
export type LayeringRecord = { checkId: 'LAYERING'; checkedFileCount: number; forbiddenImportCount: number } & Verdict;
export type RenderNeutralRecord = { checkId: 'RENDER_NEUTRAL'; checkStepCount: number; differingFieldCount: number } & Verdict;
export type SimContractRecord = { checkId: 'SIM_CONTRACT'; stepUnchanged: boolean; inputContractUnchanged: boolean; simMeasuresUnchanged: boolean; simWheelbaseM: number; simTrackWidthM: number } & Verdict;
export type DeterminismRecord = { checkId: 'DETERMINISM'; comparedRunCount: number; differingRunCount: number } & Verdict;
export type WheelPositionsRecord = { checkId: 'WHEEL_POSITIONS'; checkStepCount: number; comparedValueCount: number; differingValueCount: number } & Verdict;
export type TelemetryWheelPositionsRecord = { checkId: 'TELEMETRY_WHEEL_POSITIONS'; comparedStepCount: number; differingValueCount: number } & Verdict;
export type BaselineMissingRecord = { checkId: 'SIM_CONTRACT' | 'DETERMINISM' | 'WHEEL_POSITIONS'; verdict: 'FAIL'; checkFailReason: 'BASELINE_MISSING' };

export type CheckRecord =
  | KartDimensionsRecord | WheelsAndTracksRecord | PartGroupsRecord | PartColorsRecord | DrawCostRecord | WheelSpinRecord
  | LayeringRecord | RenderNeutralRecord | SimContractRecord | DeterminismRecord | WheelPositionsRecord
  | TelemetryWheelPositionsRecord | BaselineMissingRecord;

export const CHECK_IDS: readonly CheckId[] = [
  'KART_DIMENSIONS', 'WHEELS_AND_TRACKS', 'PART_GROUPS', 'PART_COLORS', 'DRAW_COST', 'WHEEL_SPIN',
  'LAYERING', 'RENDER_NEUTRAL', 'SIM_CONTRACT', 'DETERMINISM', 'WHEEL_POSITIONS', 'TELEMETRY_WHEEL_POSITIONS',
];

// ---------------------------------------------------------------- RULE-0001 constants (the kart sheet)

export const EXPECTED_BBOX_LENGTH_M = 1.93;
export const EXPECTED_BBOX_WIDTH_M = 1.45;
export const EXPECTED_WHEELBASE_M = 1.05;
export const DIMENSION_TOLERANCE_M = 0.02;
export const EXPECTED_FRONT_WHEEL_DIAMETER_M = 0.26;
export const EXPECTED_REAR_WHEEL_DIAMETER_M = 0.28;
export const EXPECTED_FRONT_TRACK_M = 1.00;
export const EXPECTED_REAR_TRACK_M = 1.14;
export const EXPECTED_GROUP_NAMES: readonly string[] = [...KART01_GROUP_NAMES, PILOT_GROUP_NAME];
export const SHEET_COLORS = Object.freeze({ kart: '#FF6A13', chassis: '#2B2E34', bumperPlate: '#F4F3EF', suit: '#2F55D4' });
export const DRAW_CALL_LIMIT = 30;
export const EXPECTED_TRIANGLE_COUNT = 5128;

// ---------------------------------------------------------------- measures of the assembled model

export type Kart01Measures = {
  bboxLengthM: number; bboxWidthM: number; wheelbaseM: number;
  frontWheelDiametersM: [number, number]; rearWheelDiametersM: [number, number];
  frontTrackM: number; rearTrackM: number;
  partGroups: PartGroupEntry[]; missingGroupNames: string[];
  kartColorHexes: string[]; chassisColorHexes: string[]; bumperPlateColorHex: string; suitColorHex: string;
  meshCount: number; drawCallCount: number; triangleCount: number;
};

const meshesUnder = (object: THREE.Object3D): THREE.Mesh[] => {
  const out: THREE.Mesh[] = [];
  object.traverse(o => { if ((o as THREE.Mesh).isMesh) out.push(o as THREE.Mesh); });
  return out;
};
const materialsOf = (mesh: THREE.Mesh): THREE.Material[] => Array.isArray(mesh.material) ? mesh.material : [mesh.material];
export const trianglesOf = (geometry: THREE.BufferGeometry): number => (geometry.index ? geometry.index.count : geometry.attributes.position.count) / 3;

// Bounding box of a set of objects in the model frame (root at the origin, no transform): the geometry of every
// mesh, transformed by its world matrix. `precise` so the box is of the vertices, not of the bounding spheres.
export function boxOf(objects: readonly THREE.Object3D[]): THREE.Box3 {
  const box = new THREE.Box3();
  for (const o of objects) { o.updateWorldMatrix(true, true); box.union(new THREE.Box3().setFromObject(o, true)); }
  return box;
}

// A linear vertex colour (the working colour space of three) as the #RRGGBB the sheet names, rounded to 8 bits.
export function linearToHex(r: number, g: number, b: number): string {
  return '#' + new THREE.Color().setRGB(r, g, b, THREE.LinearSRGBColorSpace).getHexString().toUpperCase();
}
const materialHex = (material: THREE.Material): string | undefined => {
  const color = (material as THREE.MeshStandardMaterial).color;
  return color ? '#' + color.getHexString().toUpperCase() : undefined;
};

// Every distinct colour of the meshes under the objects: the vertex colour attribute plus the material colour
// of a mesh without one (the decals).
export function colorHexesOf(objects: readonly THREE.Object3D[]): string[] {
  const hexes = new Set<string>();
  for (const o of objects) for (const mesh of meshesUnder(o)) {
    const color = mesh.geometry.attributes.color as THREE.BufferAttribute | undefined;
    if (color) for (let i = 0; i < color.count; i++) hexes.add(linearToHex(color.getX(i), color.getY(i), color.getZ(i)));
    else for (const m of materialsOf(mesh)) { const hex = materialHex(m); if (hex) hexes.add(hex); }
  }
  return [...hexes].sort();
}

// The nearest named group (one of the 16) that contains the object, if any.
function nearestNamedAncestor(object: THREE.Object3D): string | undefined {
  for (let p = object.parent; p; p = p.parent) if (EXPECTED_GROUP_NAMES.includes(p.name)) return p.name;
  return undefined;
}

// The Z extent of the merged wheel geometry in the local frame of the spin node (the rolling axle), DES-0001.
export function wheelDiameterM(model: Kart01Model, name: WheelName): number {
  const spin = model.wheels[name].spin;
  spin.updateWorldMatrix(true, true);
  const toSpin = spin.matrixWorld.clone().invert();
  const box = new THREE.Box3();
  for (const mesh of meshesUnder(spin)) {
    const g = mesh.geometry.clone().applyMatrix4(toSpin.clone().multiply(mesh.matrixWorld));
    g.computeBoundingBox();
    box.union(g.boundingBox!);
    g.dispose();
  }
  return box.max.z - box.min.z;
}

const worldPosition = (o: THREE.Object3D): THREE.Vector3 => { o.updateWorldMatrix(true, false); return new THREE.Vector3().setFromMatrixPosition(o.matrixWorld); };

export function measureKart01Model(model: Kart01Model): Kart01Measures {
  model.root.updateMatrixWorld(true);
  const parts = KART01_GROUP_NAMES.map(name => model.groups[name]);
  const kartBox = boxOf(parts);
  const centre = (name: WheelName) => worldPosition(model.wheels[name].steer);
  const fl = centre('rodaDianteiraEsq'), fr = centre('rodaDianteiraDir'), rl = centre('rodaTraseiraEsq'), rr = centre('rodaTraseiraDir');
  const partGroups: PartGroupEntry[] = [];
  for (const name of EXPECTED_GROUP_NAMES) {
    const group = model.groups[name as Kart01GroupName];
    if (!group) continue;
    const visibleTriangleCount = meshesUnder(group).filter(m => m.visible).reduce((n, m) => n + trianglesOf(m.geometry), 0);
    const parentGroupName = nearestNamedAncestor(group);
    partGroups.push({ groupName: name, visibleTriangleCount, ...(parentGroupName ? { parentGroupName } : {}) });
  }
  const missingGroupNames = EXPECTED_GROUP_NAMES.filter(name => !partGroups.some(g => g.groupName === name && g.visibleTriangleCount > 0));
  const meshes = meshesUnder(model.root);
  const plate = meshes.find(m => m.name === 'placaTraseira');
  return {
    bboxLengthM: kartBox.max.z - kartBox.min.z,
    bboxWidthM: kartBox.max.x - kartBox.min.x,
    wheelbaseM: Math.abs((rl.z + rr.z) / 2 - (fl.z + fr.z) / 2),
    frontWheelDiametersM: [wheelDiameterM(model, 'rodaDianteiraEsq'), wheelDiameterM(model, 'rodaDianteiraDir')],
    rearWheelDiametersM: [wheelDiameterM(model, 'rodaTraseiraEsq'), wheelDiameterM(model, 'rodaTraseiraDir')],
    frontTrackM: Math.abs(fr.x - fl.x),
    rearTrackM: Math.abs(rr.x - rl.x),
    partGroups, missingGroupNames,
    kartColorHexes: colorHexesOf(parts),
    chassisColorHexes: colorHexesOf([model.groups.chassi]),
    bumperPlateColorHex: plate ? (materialHex(materialsOf(plate)[0]) ?? '') : '',
    suitColorHex: model.palette.macacao.toUpperCase(),
    meshCount: meshes.length,
    drawCallCount: meshes.reduce((n, m) => n + materialsOf(m).length, 0),
    triangleCount: meshes.reduce((n, m) => n + trianglesOf(m.geometry), 0),
  };
}

// ---------------------------------------------------------------- RULE-0001 decision table

export const toCm = (m: number): number => Math.round(m * 100);
const withinTolerance = (value: number, expected: number) => Math.abs(value - expected) <= DIMENSION_TOLERANCE_M + 1e-12;
const fail = (checkFailReason: CheckFailReason): Verdict => ({ verdict: 'FAIL', checkFailReason });
const pass = (): Verdict => ({ verdict: 'PASS' });

export function judgeModelCheck(checkId: 'KART_DIMENSIONS', m: Kart01Measures): KartDimensionsRecord;
export function judgeModelCheck(checkId: 'WHEELS_AND_TRACKS', m: Kart01Measures): WheelsAndTracksRecord;
export function judgeModelCheck(checkId: 'PART_GROUPS', m: Kart01Measures): PartGroupsRecord;
export function judgeModelCheck(checkId: 'PART_COLORS', m: Kart01Measures): PartColorsRecord;
export function judgeModelCheck(checkId: 'DRAW_COST', m: Kart01Measures): DrawCostRecord;
export function judgeModelCheck(checkId: 'KART_DIMENSIONS' | 'WHEELS_AND_TRACKS' | 'PART_GROUPS' | 'PART_COLORS' | 'DRAW_COST', m: Kart01Measures): CheckRecord {
  switch (checkId) {
    case 'KART_DIMENSIONS': {
      const ok = withinTolerance(m.bboxLengthM, EXPECTED_BBOX_LENGTH_M) && withinTolerance(m.bboxWidthM, EXPECTED_BBOX_WIDTH_M) && withinTolerance(m.wheelbaseM, EXPECTED_WHEELBASE_M);
      return { checkId, bboxLengthM: m.bboxLengthM, bboxWidthM: m.bboxWidthM, wheelbaseM: m.wheelbaseM, ...(ok ? pass() : fail('OUT_OF_TOLERANCE')) };
    }
    case 'WHEELS_AND_TRACKS': {
      const ok = m.frontWheelDiametersM.every(d => toCm(d) === toCm(EXPECTED_FRONT_WHEEL_DIAMETER_M))
        && m.rearWheelDiametersM.every(d => toCm(d) === toCm(EXPECTED_REAR_WHEEL_DIAMETER_M))
        && toCm(m.frontTrackM) === toCm(EXPECTED_FRONT_TRACK_M) && toCm(m.rearTrackM) === toCm(EXPECTED_REAR_TRACK_M);
      return { checkId, frontWheelDiametersM: m.frontWheelDiametersM, rearWheelDiametersM: m.rearWheelDiametersM, frontTrackM: m.frontTrackM, rearTrackM: m.rearTrackM, ...(ok ? pass() : fail('OUT_OF_TOLERANCE')) };
    }
    case 'PART_GROUPS': {
      const pilot = m.partGroups.find(g => g.groupName === PILOT_GROUP_NAME);
      const verdict = m.missingGroupNames.length > 0 ? fail('GROUP_MISSING') : pilot?.parentGroupName ? fail('GROUP_NESTED') : pass();
      return { checkId, partGroups: m.partGroups, missingGroupNames: m.missingGroupNames, ...verdict };
    }
    case 'PART_COLORS': {
      const ok = m.kartColorHexes.includes(SHEET_COLORS.kart) && m.chassisColorHexes.includes(SHEET_COLORS.chassis)
        && m.bumperPlateColorHex === SHEET_COLORS.bumperPlate && m.suitColorHex === SHEET_COLORS.suit;
      return { checkId, kartColorHexes: m.kartColorHexes, chassisColorHexes: m.chassisColorHexes, bumperPlateColorHex: m.bumperPlateColorHex, suitColorHex: m.suitColorHex, ...(ok ? pass() : fail('COLOR_MISMATCH')) };
    }
    case 'DRAW_COST': {
      const verdict = m.drawCallCount > DRAW_CALL_LIMIT ? fail('LIMIT_EXCEEDED') : m.triangleCount !== EXPECTED_TRIANGLE_COUNT ? fail('SHAPE_CHANGED') : pass();
      return { checkId, meshCount: m.meshCount, drawCallCount: m.drawCallCount, triangleCount: m.triangleCount, ...verdict };
    }
  }
}

// The suit colour is judged where the sheet puts it: among the colours of the `piloto` group.
export function pilotColorHexes(model: Kart01Model): string[] { return colorHexesOf([model.groups.piloto]); }

// ---------------------------------------------------------------- WHEEL_SPIN

// A state moving at `vMps` along its heading (negative = reverse), after `stepCount` steps: the construction of
// tests/physics.test.ts:5 over initialState().
export function moving(vMps: number, stepCount = 0): State {
  const base = initialState();
  return { ...base, vx: vMps * Math.sin(base.heading), vz: vMps * Math.cos(base.heading), speed: Math.abs(vMps), stepCount };
}

export function judgeWheelSpin(fields: Omit<WheelSpinRecord, 'checkId' | 'verdict' | 'checkFailReason'>): WheelSpinRecord {
  const sign = Math.sign(fields.rollingSpeedMps);
  const ok = fields.wheels.length === 4 && fields.wheels.every(w => w.spinRevs === w.expectedSpinRevs && Math.sign(w.spinRevs) === sign);
  return { checkId: 'WHEEL_SPIN', ...fields, ...(ok ? pass() : fail('SPIN_MISMATCH')) };
}

// checkStepCount + 1 states at a constant rolling speed; the spin applied in one frame (delta = checkStepCount).
export function wheelSpinCheck(rollingSpeedMps: number, checkStepCount: number): WheelSpinRecord {
  const states = Array.from({ length: checkStepCount + 1 }, (_, k) => moving(rollingSpeedMps, k));
  const first = getKartPose(states[0]) as KartPose, last = getKartPose(states[checkStepCount]) as KartPose;
  const spin = advanceWheelSpin(advanceWheelSpin(initialWheelSpin(), first), last);
  const simulatedTimeMs = toMs(checkStepCount);
  const model = buildKart01Model();
  const wheels: WheelSpinEntry[] = WHEEL_NAMES.map(groupName => {
    const diameterM = model.wheels[groupName].diameterM;
    return { groupName, diameterM, spinRevs: spin.revs[groupName], expectedSpinRevs: last.rollingSpeedMps * simulatedTimeMs / 1000 / (Math.PI * diameterM) };
  });
  return judgeWheelSpin({ checkStepCount, simulatedTimeMs, rollingSpeedMps: last.rollingSpeedMps, wheels });
}

// ---------------------------------------------------------------- LAYERING

export const SIMULATION_FILES: readonly string[] = ['src/physics.ts', 'src/maneuvers.ts', 'src/track.ts', 'src/trackData.ts', 'src/lap.ts', 'src/lapTiming.ts'];
export const FEATURE_MODULES: readonly string[] = ['./kart01Model', './kart01Decals', './kartPose', './gameCamera'];
export const stripComments = (text: string): string => text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
export const importsOf = (text: string): string[] => [...stripComments(text).matchAll(/from\s+'([^']+)'/g)].map(m => m[1]);
export const sourceText = (relativePath: string): string => readFileSync(join(ROOT, relativePath), 'utf8');

export function countForbiddenImports(text: string): number {
  return importsOf(text).filter(dep => FEATURE_MODULES.some(m => dep === m || dep === m + '.js' || dep === m + '.ts')).length;
}

export function layeringCheck(): LayeringRecord {
  const forbiddenImportCount = SIMULATION_FILES.reduce((n, file) => n + countForbiddenImports(sourceText(file)), 0);
  return { checkId: 'LAYERING', checkedFileCount: SIMULATION_FILES.length, forbiddenImportCount, ...(forbiddenImportCount === 0 ? pass() : fail('FORBIDDEN_IMPORT')) };
}

// ---------------------------------------------------------------- RENDER_NEUTRAL

export const DEFAULT_VIEW = { viewWidthPx: 1280, viewHeightPx: 720 };

// Two runs of the same inputs from startSession + runCountdown: one only with stepLap; the other also doing, every
// step, what the presentation does (pose, spin, wheel positions, camera, model pose). The final sessions must agree.
export function renderNeutralCheck(reading: TrackReading, inputs: readonly Input[], config?: KartConfig): RenderNeutralRecord {
  const begin = () => runCountdown(startSession(reading, 'OFFICIAL', config));
  let plain = begin();
  for (const input of inputs) plain = stepLap(plain, input);
  const model = buildKart01Model();
  const trackBounds = trackBoundsOf(track, WIDTH / 2 + 1);
  let spin = initialWheelSpin();
  let rendered = begin();
  for (const input of inputs) {
    rendered = stepLap(rendered, input);
    const pose = getKartPose(rendered.kart);
    if ('code' in pose) continue;
    spin = advanceWheelSpin(spin, pose);
    simWheelGroundPositions(pose, rendered.config);
    computeCameraView({ lapState: getLapState(rendered), kartPose: pose, ...DEFAULT_VIEW, turboActive: rendered.kart.maneuvers.boost > 0, trackBounds });
    updateKart01Pose(model, { steerAngleRad: pose.steerAngleRad, wheelSpinRevs: spin.revs });
  }
  const keys = new Set([...Object.keys(plain), ...Object.keys(rendered)]) as Set<keyof LapSession>;
  let differingFieldCount = 0;
  for (const key of keys) if (!isDeepStrictEqual(plain[key], rendered[key])) differingFieldCount++;
  return { checkId: 'RENDER_NEUTRAL', checkStepCount: inputs.length, differingFieldCount, ...(differingFieldCount === 0 ? pass() : fail('STATE_DIFFERS')) };
}

// ---------------------------------------------------------------- the baseline (DM-0001)

export type InputRun = [count: number, throttle: number, brake: number, steer: number, drift: boolean];
export type ReferenceRun = {
  setupId: SetupId; setupVersion: string; lapKind: LapKind; driverMassKg: number;
  inputRuns: InputRun[]; checkStepCount: number; lapValidity: 'VALID' | 'INVALID'; lapMs?: number; sectorMs?: number[];
  finalKart: State;
};
export type SimBaseline = {
  schemaVersion: 1; recordedAtUtc: string; recordedOnCommit: string | null; stepS: number; inputTypeLine: string;
  simWheelbaseM: number; simTrackWidthM: number; trackId: string; trackVersion: string | number;
  wheelPositions: Record<string, { forwardM: number; leftM: number }[]>;
  referenceRuns: ReferenceRun[];
};
export type BaselineReading = { ok: true; baseline: SimBaseline } | { code: 'BASELINE_MISSING' };
export const BASELINE_MISSING: { code: 'BASELINE_MISSING' } = { code: 'BASELINE_MISSING' };

export function expandRuns(runs: readonly InputRun[]): Input[] {
  const inputs: Input[] = [];
  for (const [count, throttle, brake, steer, drift] of runs) for (let i = 0; i < count; i++) inputs.push({ throttle, brake, steer, drift });
  return inputs;
}

// The baseline as parsed data: BASELINE_MISSING when it is of another schema, another setup version or another
// track version than the current reading. Never estimates.
export function parseSimBaseline(data: unknown, reading: TrackReading = syntheticReading()): BaselineReading {
  if (!data || typeof data !== 'object') return BASELINE_MISSING;
  const b = data as SimBaseline;
  if (b.schemaVersion !== 1 || !Array.isArray(b.referenceRuns) || b.referenceRuns.length === 0) return BASELINE_MISSING;
  for (const run of b.referenceRuns) {
    const setup = PUBLISHED_SETUPS[run.setupId];
    if (!setup || setup.setupVersion !== run.setupVersion) return BASELINE_MISSING;
  }
  if (!('trackVersion' in reading) || String(reading.trackVersion) !== String(b.trackVersion)) return BASELINE_MISSING;
  return { ok: true, baseline: b };
}

export function readSimBaseline(path: string = BASELINE_PATH, reading: TrackReading = syntheticReading()): BaselineReading {
  let data: unknown;
  try { data = JSON.parse(readFileSync(join(ROOT, path), 'utf8')); } catch { return BASELINE_MISSING; }
  return parseSimBaseline(data, reading);
}

const baselineMissing = (checkId: BaselineMissingRecord['checkId']): BaselineMissingRecord => ({ checkId, verdict: 'FAIL', checkFailReason: 'BASELINE_MISSING' });

// ---------------------------------------------------------------- SIM_CONTRACT

const PROBE_STEPS = 120;
const CONSTANT = (patch: Partial<Input>): Input => ({ throttle: 0, brake: 0, steer: 0, ...patch });

function settle(config: KartConfig, input: Input): State {
  let state = initialState();
  for (let i = 0; i < PROBE_STEPS; i++) state = step(state, input, STEP, config);
  return state;
}

// The ranges of Input by the saturation of step: beyond the limit equals the limit; the limit differs from an
// inner value and from a value 0.01 inside it (the ranges of the baseline revision: throttle, brake in [0, 1];
// steer in [-1, 1]).
export function inputRangesUnchanged(config: KartConfig): boolean {
  const same = (a: Input, b: Input) => isDeepStrictEqual(settle(config, a), settle(config, b));
  const equalPairs: [Input, Input][] = [
    [CONSTANT({ throttle: 2 }), CONSTANT({ throttle: 1 })], [CONSTANT({ throttle: -1 }), CONSTANT({ throttle: 0 })],
    [CONSTANT({ brake: 2 }), CONSTANT({ brake: 1 })], [CONSTANT({ brake: -1 }), CONSTANT({ brake: 0 })],
    [CONSTANT({ steer: 3 }), CONSTANT({ steer: 1 })], [CONSTANT({ steer: -3 }), CONSTANT({ steer: -1 })],
  ];
  const differentPairs: [Input, Input][] = [
    [CONSTANT({ throttle: 1 }), CONSTANT({ throttle: 0.5 })], [CONSTANT({ brake: 1 }), CONSTANT({ brake: 0.5 })], [CONSTANT({ steer: 1 }), CONSTANT({ steer: 0.5 })],
    [CONSTANT({ throttle: 0.99 }), CONSTANT({ throttle: 1 })], [CONSTANT({ throttle: 0.01 }), CONSTANT({ throttle: 0 })],
    [CONSTANT({ brake: 0.99 }), CONSTANT({ brake: 1 })], [CONSTANT({ brake: 0.01 }), CONSTANT({ brake: 0 })],
    [CONSTANT({ steer: 0.99 }), CONSTANT({ steer: 1 })], [CONSTANT({ steer: -0.99 }), CONSTANT({ steer: -1 })],
  ];
  return equalPairs.every(([a, b]) => same(a, b)) && differentPairs.every(([a, b]) => !same(a, b));
}

export const inputTypeLineOf = (physicsText: string): string | undefined => physicsText.split('\n').map(l => l.trim()).find(l => l.startsWith('export type Input ='));

export function simContractCheck(reading: BaselineReading, physicsText: string = sourceText('src/physics.ts')): SimContractRecord | BaselineMissingRecord {
  if (!('ok' in reading)) return baselineMissing('SIM_CONTRACT');
  const { baseline } = reading;
  const setups = Object.values(PUBLISHED_SETUPS);
  const stepUnchanged = STEP === baseline.stepS;
  const inputContractUnchanged = inputTypeLineOf(physicsText) === baseline.inputTypeLine && setups.every(s => inputRangesUnchanged(s.config));
  const simWheelbaseM = setups[0].config.wheelbase, simTrackWidthM = setups[0].config.trackWidth;
  const simMeasuresUnchanged = setups.every(s => s.config.wheelbase === baseline.simWheelbaseM && s.config.trackWidth === baseline.simTrackWidthM);
  const ok = stepUnchanged && inputContractUnchanged && simMeasuresUnchanged;
  return { checkId: 'SIM_CONTRACT', stepUnchanged, inputContractUnchanged, simMeasuresUnchanged, simWheelbaseM, simTrackWidthM, ...(ok ? pass() : fail('CONTRACT_CHANGED')) };
}

// ---------------------------------------------------------------- DETERMINISM and WHEEL_POSITIONS

export type Replay = { run: ReferenceRun; lap: LapSession; inputs: Input[] };
const replays = new WeakMap<SimBaseline, Replay[]>();

// Every reference run replayed once per baseline object: countdown, then the recorded inputs through stepLap.
export function replayBaseline(baseline: SimBaseline, reading: TrackReading): Replay[] {
  const cached = replays.get(baseline);
  if (cached) return cached;
  const out = baseline.referenceRuns.map(run => {
    const config = { ...PUBLISHED_SETUPS[run.setupId].config, driverMass: run.driverMassKg };
    const inputs = expandRuns(run.inputRuns);
    let lap = runCountdown(startSession(reading, run.lapKind, config));
    const controller = replay(inputs);
    for (let i = 0; i < inputs.length; i++) lap = stepLap(lap, controller(lap));
    return { run, lap, inputs };
  });
  replays.set(baseline, out);
  return out;
}

const jsonClone = <T>(v: T): T => JSON.parse(JSON.stringify(v)) as T;

// The projection of `current` onto the fields the baseline recorded (DM-0001: finalKart compared field by field).
// Every recorded field is taken from `current` — missing there, it stays undefined and the comparison fails; a field
// `current` carries that the baseline never recorded (telemetry added by a later feature) is not compared, because the
// baseline holds no value for it. Arrays keep the length of `current`, so a longer or shorter array still differs.
const isPlainObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
export function recordedFieldsOf(recorded: unknown, current: unknown): unknown {
  if (Array.isArray(recorded)) return Array.isArray(current) ? current.map((item, i) => recordedFieldsOf(recorded[i], item)) : current;
  if (isPlainObject(recorded)) {
    if (!isPlainObject(current)) return current;
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(recorded)) out[key] = recordedFieldsOf(recorded[key], current[key]);
    return out;
  }
  return current;
}

export function runDiffers(replayed: Replay): boolean {
  const { run, lap } = replayed;
  const result = getLapResult(lap);
  const lapMs = 'code' in result ? undefined : result.lapMs;
  const sectorMs = 'code' in result ? undefined : result.sectorMs;
  return lap.validity !== run.lapValidity || lapMs !== run.lapMs || !isDeepStrictEqual(jsonClone(sectorMs), run.sectorMs)
    || !isDeepStrictEqual(recordedFieldsOf(run.finalKart, jsonClone(lap.kart)), run.finalKart);
}

export function determinismCheck(reading: BaselineReading, track: TrackReading = syntheticReading()): DeterminismRecord | BaselineMissingRecord {
  if (!('ok' in reading)) return baselineMissing('DETERMINISM');
  const runs = replayBaseline(reading.baseline, track);
  const differingRunCount = runs.filter(runDiffers).length;
  return { checkId: 'DETERMINISM', comparedRunCount: runs.length, differingRunCount, ...(differingRunCount === 0 ? pass() : fail('NON_DETERMINISTIC')) };
}

export function wheelPositionsCheck(reading: BaselineReading, track: TrackReading = syntheticReading()): WheelPositionsRecord | BaselineMissingRecord {
  if (!('ok' in reading)) return baselineMissing('WHEEL_POSITIONS');
  const { baseline } = reading;
  let comparedValueCount = 0, differingValueCount = 0, checkStepCount = 0;
  for (const { run, lap } of replayBaseline(baseline, track)) {
    checkStepCount += run.checkStepCount;
    const recorded = baseline.wheelPositions[run.setupId] ?? [];
    const current = wheelPositions(lap.config);
    for (let i = 0; i < 4; i++) {
      for (const [a, b] of [[current[i]?.forward, recorded[i]?.forwardM], [current[i]?.left, recorded[i]?.leftM]]) {
        comparedValueCount++;
        if (a !== b) differingValueCount++;
      }
    }
  }
  return { checkId: 'WHEEL_POSITIONS', checkStepCount, comparedValueCount, differingValueCount, ...(differingValueCount === 0 ? pass() : fail('STATE_DIFFERS')) };
}

// ---------------------------------------------------------------- TELEMETRY_WHEEL_POSITIONS

// The direct transformation of wheelPositions(config) by the pose: the formula of src/physics.ts:229.
export function wheelWorldPoints(pose: KartPose, config: KartConfig): { xM: number; zM: number }[] {
  const sin = Math.sin(pose.headingRad), cos = Math.cos(pose.headingRad);
  return wheelPositions(config).map(p => ({ xM: pose.xM + p.forward * sin + p.left * cos, zM: pose.zM + p.forward * cos - p.left * sin }));
}

export function telemetryWheelPositionsCheck(trace: readonly { pose: KartPose; config: KartConfig }[]): TelemetryWheelPositionsRecord {
  let differingValueCount = 0;
  for (const { pose, config } of trace) {
    const telemetry = simWheelGroundPositions(pose, config), direct = wheelWorldPoints(pose, config);
    for (let i = 0; i < 4; i++) {
      if (telemetry[i]?.xM !== direct[i].xM) differingValueCount++;
      if (telemetry[i]?.zM !== direct[i].zM) differingValueCount++;
    }
  }
  return { checkId: 'TELEMETRY_WHEEL_POSITIONS', comparedStepCount: trace.length, differingValueCount, ...(differingValueCount === 0 ? pass() : fail('STATE_DIFFERS')) };
}

// ---------------------------------------------------------------- projection (the kart inside the frame)

// The world transform src/main.ts gives the model: kartRoot at (xM, 0, zM) turned by the heading, the model root
// turned by π and moved forward by the reference offset (RULE-0003).
export function modelToWorld(pose: KartPose, offsetForwardM: number): THREE.Matrix4 {
  const kartRoot = new THREE.Matrix4().compose(new THREE.Vector3(pose.xM, 0, pose.zM), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), pose.headingRad), new THREE.Vector3(1, 1, 1));
  const root = new THREE.Matrix4().compose(new THREE.Vector3(0, 0, offsetForwardM), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI), new THREE.Vector3(1, 1, 1));
  return kartRoot.multiply(root);
}

// The eight corners of the box of the 15 part groups plus the top of the helmet, in the model frame.
export function modelExtremePoints(model: Kart01Model): THREE.Vector3[] {
  const box = boxOf(KART01_GROUP_NAMES.map(name => model.groups[name]));
  const pilot = boxOf([model.groups.piloto]);
  const points: THREE.Vector3[] = [];
  for (const x of [box.min.x, box.max.x]) for (const y of [box.min.y, box.max.y]) for (const z of [box.min.z, box.max.z]) points.push(new THREE.Vector3(x, y, z));
  points.push(new THREE.Vector3((pilot.min.x + pilot.max.x) / 2, pilot.max.y, (pilot.min.z + pilot.max.z) / 2));
  return points;
}

// Normalized device coordinates of a world point through the camera of a CameraView (perspective, up +Y, the
// basis of Three.js lookAt); z > 1 or < -1 means outside the depth range.
export function projectPoint(view: CameraView, world: THREE.Vector3): { x: number; y: number; z: number } {
  const camera = new THREE.PerspectiveCamera(view.verticalFovDeg, view.viewWidthPx / view.viewHeightPx, 0.1, 5000);
  camera.position.set(view.cameraXM, view.cameraHeightM, view.cameraZM);
  camera.up.set(0, 1, 0);
  camera.lookAt(view.aimXM, view.aimHeightM, view.aimZM);
  camera.updateMatrixWorld(true);
  camera.updateProjectionMatrix();
  const p = world.clone().project(camera);
  return { x: p.x, y: p.y, z: p.z };
}

// ---------------------------------------------------------------- serialization

export function serializeRecord(record: CheckRecord): string {
  return JSON.stringify(record);
}
