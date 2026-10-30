// TEST-0004 — the transversal contracts of the feature: the symbols src/main.ts gained and lost, the decals, the
// tyre-mark situation run as written in src/main.ts over driven sessions, the absence of the drift indicator and of the
// turbo jet, the declared dependencies, LAYERING, RENDER_NEUTRAL, SIM_CONTRACT, DETERMINISM and WHEEL_POSITIONS against the
// pre-feature baseline, BASELINE_MISSING, and API-0002 field by field (strategy: contract, DES-0004, DES-0005, DES-0006,
// DES-0007, DM-0001).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getHandlingTelemetry, PUBLISHED_SETUPS, STEP, wheelPositions, type Input } from '../src/physics';
import { buildKart01Model } from '../src/kart01Model';
import { syntheticReading } from './fixtures/trackFiles';
import { endTraining, getLapState, pauseLap, repositionKart, stepLap, type LapKind, type LapSession } from '../src/lap';
import { COUNTDOWN_STEPS } from '../src/lapTiming';
import { autopilot, completeLap, drive, runCountdown, seedLap, startSession } from './helpers/autopilot';
import {
  BASELINE_PATH, CHECK_IDS, countForbiddenImports, determinismCheck, expandRuns, importsOf, inputTypeLineOf, judgeModelCheck, layeringCheck, recordedFieldsOf,
  measureKart01Model, parseSimBaseline, readSimBaseline, renderNeutralCheck, serializeRecord, SIMULATION_FILES, simContractCheck, sourceText,
  stripComments, telemetryWheelPositionsCheck, tyreMarkRunner, wheelPositionsCheck, wheelSpinCheck, type CheckRecord, type SimBaseline,
  type TyreMarkRunner, type TyreMarkSegment,
} from './helpers/kart01Report';
import { getKartPose, simWheelGroundPositions, type KartPose } from '../src/kartPose';

const reading = syntheticReading();
const main = stripComments(sourceText('src/main.ts'));
const decals = stripComments(sourceText('src/kart01Decals.ts'));
const NEW_MODULES = ['src/kart01Model.ts', 'src/kart01Decals.ts', 'src/kartPose.ts', 'src/gameCamera.ts'];
const PURE_MODULES = ['src/kart01Model.ts', 'src/kartPose.ts', 'src/gameCamera.ts'];
const NETWORK_OR_STORAGE = ['fetch', 'XMLHttpRequest', 'WebSocket', 'localStorage', 'sessionStorage', 'indexedDB', 'navigator.sendBeacon'];
const DOM_CLOCK_RANDOM = ['document', 'window', 'Date', 'performance', 'Math.random', 'requestAnimationFrame', 'setTimeout', 'setInterval'];
const uses = (text: string, symbol: string) => new RegExp(`(^|[^\\w.$'"])${symbol.replace(/[.()/]/g, m => `\\${m}`)}(?![\\w$])`).test(text);

const baseline = readSimBaseline();
const layering = layeringCheck();
const simContract = simContractCheck(baseline);
const determinism = determinismCheck(baseline, reading);
const wheelPositionsRecord = wheelPositionsCheck(baseline, reading);
const referenceInputs = 'ok' in baseline ? expandRuns(baseline.baseline.referenceRuns[0].inputRuns) : [];
const referenceConfig = 'ok' in baseline ? { ...PUBLISHED_SETUPS[baseline.baseline.referenceRuns[0].setupId].config, driverMass: baseline.baseline.referenceRuns[0].driverMassKg } : undefined;
const renderNeutral = renderNeutralCheck(reading, referenceInputs, referenceConfig);
// The tyre marks over driven sessions (DES-0005): the published setup whose reference driving slides above both limits
// on the synthetic track; one frame of src/main.ts advances 0 to 3 steps, as the frame loop does.
const REALISTA = PUBLISHED_SETUPS.REALISTA_ALUGUEL_4T;
const realistaRef = { setupId: REALISTA.setupId, setupVersion: REALISTA.setupVersion };
const FRAME_STEPS = [1, 1, 1, 2, 1, 0, 1, 1, 3, 1, 1, 1];
const slideInput: Input = { throttle: 1, brake: 0, steer: 1, drift: true };
const near = (a: number, b: number, tol: number) => Math.abs(a - b) <= tol;
type GroundPoint = { xM: number; zM: number };
// The rear wheels by their place in wheelPositions (behind the reference point), left first, carried by the pose.
const rearOf = (lap: LapSession): GroundPoint[] => {
  const pose = getKartPose(lap.kart);
  if ('code' in pose) throw new Error(pose.code);
  const all = simWheelGroundPositions(pose, lap.config);
  return wheelPositions(lap.config).map((w, i) => ({ w, p: all[i] })).filter(({ w }) => w.forward < 0).sort((a, b) => b.w.left - a.w.left).map(({ p }) => p);
};
type SweepFrame = {
  steps: number; lapPhase: string; speedMps: number; sideslipRad: number; signedSideslipRad: number;
  segments: TyreMarkSegment[]; rear: GroundPoint[]; previousRear?: GroundPoint[];
};
function markSweep(): SweepFrame[] {
  const run = tyreMarkRunner(realistaRef);
  const controller = autopilot(0, REALISTA.config);
  let lap = runCountdown(startSession(reading, 'TRAINING', REALISTA.config));
  run(lap);
  let previousRear: GroundPoint[] | undefined;
  const frames: SweepFrame[] = [];
  for (let f = 0; lap.kart.stepCount < 6000; f++) {
    const steps = FRAME_STEPS[f % FRAME_STEPS.length];
    for (let k = 0; k < steps; k++) lap = stepLap(lap, controller(lap));
    const segments = run(lap);
    const t = getHandlingTelemetry(lap.kart, realistaRef);
    const state = getLapState(lap);
    if ('code' in t || 'code' in state) throw new Error('the driven lap has no state');
    const rear = rearOf(lap);
    frames.push({ steps, lapPhase: state.lapPhase, speedMps: t.speedMps, sideslipRad: t.sideslipRad, signedSideslipRad: lap.kart.telemetry.sideslip, segments, rear, previousRear });
    if (steps > 0) previousRear = rear;
  }
  return frames;
}
// Built inside the mark checks, so a change of shape of the block fails only them, with the runner message.
let sweepFrames: SweepFrame[] | undefined;
const lazySweep = (): SweepFrame[] => (sweepFrames ??= markSweep());
// The first driven step of a session of `lapKind` that slides above both limits: `prev` is the frame before it, `next`
// the step itself; `primed()` is a fresh frame loop that has already shown `prev`.
type SlidingPair = { prev: LapSession; next: LapSession; primed: () => TyreMarkRunner };
function slidingPair(lapKind: LapKind): SlidingPair {
  const controller = autopilot(0, REALISTA.config);
  let prev = runCountdown(startSession(reading, lapKind, REALISTA.config));
  for (let i = 0; i < 6000 && prev.phase === 'RUNNING'; i++) {
    const next = stepLap(prev, controller(prev));
    const t = getHandlingTelemetry(next.kart, realistaRef);
    if (!('code' in t) && next.phase === 'RUNNING' && t.speedMps > 6.2 && t.sideslipRad > 0.06) {
      const before = prev;
      return { prev: before, next, primed: () => { const run = tyreMarkRunner(realistaRef); run(before); return run; } };
    }
    prev = next;
  }
  throw new Error(`no sliding step in the ${lapKind} session`);
}
const altered = (patch: (b: SimBaseline) => unknown) => 'ok' in baseline ? parseSimBaseline(patch(JSON.parse(JSON.stringify(baseline.baseline)) as SimBaseline), reading) : baseline;

test('CHK-TEST-0004-01 the application draws the Kart 01 and no longer builds the provisional box kart', () => {
  // AC-US-0001-14
  assert.ok(!uses(main, 'CylinderGeometry(0.31'), 'AC-US-0001-14: the provisional wheel cylinder must be gone from src/main.ts');
  assert.ok(!uses(main, 'SphereGeometry(0.36'), 'AC-US-0001-14: the provisional helmet sphere must be gone from src/main.ts');
  assert.ok(!/helmet/i.test(main), 'AC-US-0001-14: no provisional helmet remains in src/main.ts');
  assert.ok(!/box\(\s*kart\b/.test(main), 'AC-US-0001-14: no box is applied to a provisional kart group');
  assert.match(main, /import \{[^}]*\bbuildKart01Model\b[^}]*\} from '\.\/kart01Model'/, 'AC-US-0001-14: src/main.ts must import buildKart01Model');
  assert.match(main, /import \{[^}]*\bpaintKart01Decals\b[^}]*\} from '\.\/kart01Decals'/, 'AC-US-0001-14: src/main.ts must import paintKart01Decals');
  assert.ok(uses(main, 'kartRoot'), 'AC-US-0001-14: src/main.ts must place the model under kartRoot');
  assert.match(main, /buildKart01Model\(\)/, 'AC-US-0001-14: src/main.ts must build the Kart 01');
});

test('CHK-TEST-0004-02 the sun follows the displayed kart and its shadow box covers the track', () => {
  // AC-US-0001-15
  assert.ok(uses(main, 'sun.target.position.set'), 'AC-US-0001-15: the sun target must follow the kart');
  assert.match(main, /sun\.shadow\.camera/, 'AC-US-0001-15: the shadow camera of the sun must be configured');
  assert.match(main, /shadow\.camera[\s\S]{0,80}left:\s*-60/, 'AC-US-0001-15: the shadow box must extend 60 m to the left');
  assert.match(main, /castShadow\s*=\s*true/, 'AC-US-0001-15: the application enables shadow casting');
});

test('CHK-TEST-0004-03 the number 01 is painted on the plate texture and the decals are painted at page load', () => {
  // AC-US-0001-16
  assert.match(decals, /fillText\([^)]*KART01_NUMBER/, 'AC-US-0001-16: src/kart01Decals.ts must write KART01_NUMBER with fillText');
  assert.match(decals, /import \{[^}]*\bKART01_NUMBER\b[^}]*\} from '\.\/kart01Model'/, 'AC-US-0001-16: the number comes from the model module');
  assert.match(main, /paintKart01Decals\(\s*kart01\s*\)/, 'AC-US-0001-16: src/main.ts must paint the decals of the built model');
});

test('CHK-TEST-0004-04 the tyre marks are laid by simulation step at the simulation wheel positions, never by a clock', () => {
  // AC-US-0005-01
  assert.ok(!uses(main, 'skidClock'), 'AC-US-0005-01: skidClock must be gone from src/main.ts');
  assert.ok(uses(main, 'lastSkidStepCount'), 'AC-US-0005-01: the marks must be paced by lastSkidStepCount');
  assert.ok(uses(main, 'simWheelGroundPositions'), 'AC-US-0005-01: the marks must come from simWheelGroundPositions');
  assert.match(main, /simWheelGroundPositions\(pose,\s*lap\.config\)\.slice\(2\)/, 'AC-US-0005-01: the rear two wheelPositions of the lap configuration are used');
});

test('CHK-TEST-0004-06 a new mark segment is laid under each rear tyre exactly in the frames with a new step, RUNNING, above 6 m/s and above 0.055 rad of sideslip', () => {
  // AC-US-0005-06
  const sweep = lazySweep();
  assert.ok(sweep.length > 4000, `AC-US-0005-06: the driven training gave ${sweep.length} frames`);
  for (const [i, frame] of sweep.entries()) {
    const expected = frame.steps > 0 && frame.lapPhase === 'RUNNING' && frame.speedMps > 6 && frame.sideslipRad > 0.055;
    const situation = `frame ${i} (${frame.steps} steps, ${frame.lapPhase}, ${frame.speedMps.toFixed(3)} m/s, ${frame.sideslipRad.toFixed(4)} rad)`;
    if (!expected) { assert.equal(frame.segments.length, 0, `AC-US-0005-06: ${situation} is outside the situation and lays no segment`); continue; }
    assert.equal(frame.segments.length, 2, `AC-US-0005-06: ${situation} lays one new segment under each rear tyre`);
    assert.ok(frame.previousRear, `AC-US-0005-06: ${situation} has a previous frame with a step`);
    if (!frame.previousRear) continue;
    for (const [side, wheel] of frame.rear.entries()) {
      const at = frame.segments.filter(s => near(s.toXM, wheel.xM, 1e-9) && near(s.toZM, wheel.zM, 1e-9));
      assert.equal(at.length, 1, `AC-US-0005-06: ${situation} ends exactly one segment under rear wheel ${side} (${wheel.xM.toFixed(3)}, ${wheel.zM.toFixed(3)})`);
      const from = frame.previousRear[side];
      assert.ok(near(at[0].fromXM, from.xM, 1e-9) && near(at[0].fromZM, from.zM, 1e-9), `AC-US-0005-06: ${situation} chains the segment of rear wheel ${side} from where it was in the previous frame`);
      assert.ok(at[0].heightM > 0 && at[0].heightM < 0.1, `AC-US-0005-06: ${situation} lays the segment on the ground (${at[0].heightM} m)`);
    }
  }
  // The driven frames reach both sides of each limit, and both sides of the slide.
  const stepped = sweep.filter(f => f.steps > 0 && f.lapPhase === 'RUNNING');
  const drawn = (f: SweepFrame) => f.segments.length > 0;
  const buckets: Record<string, number> = {
    'sideslip > 0.055 rad, 6 < speed <= 6.5 m/s, laid': stepped.filter(f => f.sideslipRad > 0.055 && f.speedMps > 6 && f.speedMps <= 6.5 && drawn(f)).length,
    'sideslip > 0.055 rad, 5.5 < speed <= 6 m/s, not laid': stepped.filter(f => f.sideslipRad > 0.055 && f.speedMps > 5.5 && f.speedMps <= 6 && !drawn(f)).length,
    'speed > 6 m/s, 0.055 < sideslip <= 0.06 rad, laid': stepped.filter(f => f.speedMps > 6 && f.sideslipRad > 0.055 && f.sideslipRad <= 0.06 && drawn(f)).length,
    'speed > 6 m/s, 0.05 < sideslip <= 0.055 rad, not laid': stepped.filter(f => f.speedMps > 6 && f.sideslipRad > 0.05 && f.sideslipRad <= 0.055 && !drawn(f)).length,
    'sliding to the left, laid': stepped.filter(f => f.signedSideslipRad > 0 && drawn(f)).length,
    'sliding to the right, laid': stepped.filter(f => f.signedSideslipRad < 0 && drawn(f)).length,
  };
  for (const [bucket, count] of Object.entries(buckets)) assert.ok(count > 0, `AC-US-0005-06: the driven training reaches the frames "${bucket}" (${count})`);
});

test('CHK-TEST-0004-07 the feature adds no runtime dependency: three 0.186 stays the only one and the new modules import only three and the project', () => {
  // NFR-0003
  const pkg = JSON.parse(sourceText('package.json')) as { dependencies: Record<string, string> };
  assert.deepEqual(Object.keys(pkg.dependencies), ['three'], 'NFR-0003: dependencies must be exactly [three]');
  assert.match(pkg.dependencies.three, /^\^0\.186/, 'NFR-0003: the declared three version must start with ^0.186');
  for (const file of NEW_MODULES) {
    for (const dep of importsOf(sourceText(file))) assert.ok(dep === 'three' || dep.startsWith('three/addons/') || dep.startsWith('./'), `NFR-0003: ${file} imports ${dep}, outside three and the project`);
  }
});

test('CHK-TEST-0004-08 the simulation imports nothing from the model, the camera or the effects of this feature', (t) => {
  // NFR-0005
  t.diagnostic(serializeRecord(layering));
  assert.equal(layering.checkedFileCount, 6, 'NFR-0005: the six simulation files are checked');
  assert.equal(layering.checkedFileCount, SIMULATION_FILES.length, 'NFR-0005: checkedFileCount is the size of the list');
  assert.equal(layering.forbiddenImportCount, 0, 'NFR-0005: no simulation file may import the feature modules');
  assert.equal(layering.verdict, 'PASS', 'NFR-0005: LAYERING must be PASS');
  assert.equal(countForbiddenImports("import { x } from './kartPose';\nimport { y } from './track';"), 1, 'NFR-0005: a simulation text importing ./kartPose counts one forbidden import');
  assert.equal(countForbiddenImports("import { x } from './gameCamera.js';"), 1, 'NFR-0005: the .js form counts too');
});

test('CHK-TEST-0004-09 the presentation changes nothing in the simulation: the reference lap with and without it ends in the same state', (t) => {
  // NFR-0005
  t.diagnostic(serializeRecord(renderNeutral));
  assert.ok(renderNeutral.checkStepCount > 1000, 'NFR-0005: the reference lap of the baseline is replayed');
  assert.equal(renderNeutral.differingFieldCount, 0, 'NFR-0005: no field of the session may differ with the presentation');
  assert.equal(renderNeutral.verdict, 'PASS', 'NFR-0005: RENDER_NEUTRAL must be PASS');
});

test('CHK-TEST-0004-10 the pure modules of the feature touch no DOM, clock or random, and no module of the feature uses the network or storage', () => {
  // NFR-0005
  for (const file of PURE_MODULES) {
    const text = stripComments(sourceText(file));
    for (const symbol of DOM_CLOCK_RANDOM) assert.ok(!uses(text, symbol), `NFR-0005: ${file} must not use ${symbol}`);
    for (const dep of importsOf(text)) assert.ok(!/\.\/(main|audio|kart01Decals)$/.test(dep), `NFR-0005: ${file} must not import an outer module (${dep})`);
  }
  for (const file of NEW_MODULES) {
    const text = stripComments(sourceText(file));
    for (const symbol of NETWORK_OR_STORAGE) assert.ok(!uses(text, symbol), `NFR-0005: ${file} must not use ${symbol}`);
  }
  for (const file of ['src/kartPose.ts', 'src/gameCamera.ts']) {
    for (const dep of importsOf(sourceText(file))) assert.ok(!/^three/.test(dep), `NFR-0005: ${file} must not import three (${dep})`);
  }
});

test('CHK-TEST-0004-11 the step contract is unchanged: same STEP, same Input fields and ranges, same simulation wheelbase and track', (t) => {
  // NFR-0006
  t.diagnostic(serializeRecord(simContract));
  assert.equal(simContract.verdict, 'PASS', 'NFR-0006: SIM_CONTRACT must be PASS');
  if (simContract.verdict !== 'PASS' || simContract.checkFailReason === 'BASELINE_MISSING') return;
  assert.equal(simContract.stepUnchanged, true, 'NFR-0006: STEP must be the one of the baseline');
  assert.equal(simContract.inputContractUnchanged, true, 'NFR-0006: the Input fields and ranges must be unchanged');
  assert.equal(simContract.simMeasuresUnchanged, true, 'NFR-0006: the simulation measures must be unchanged');
  assert.equal(simContract.simWheelbaseM, 1.04, 'NFR-0006: the simulation wheelbase stays 1.04 m');
  assert.equal(simContract.simTrackWidthM, 1.2, 'NFR-0006: the simulation track stays 1.20 m');
  assert.equal(STEP, 1 / 120, 'NFR-0006: STEP is 1 / 120');
  assert.equal(inputTypeLineOf(sourceText('src/physics.ts')), 'export type Input = { throttle: number; brake: number; steer: number; drift?: boolean };', 'NFR-0006: the Input line is literally unchanged');
});

test('CHK-TEST-0004-12 a baseline with another STEP, another Input line or another wheelbase makes SIM_CONTRACT CONTRACT_CHANGED', () => {
  // NFR-0006
  assert.ok('ok' in baseline, 'NFR-0006: the baseline fixture is readable');
  const changed = (patch: (b: SimBaseline) => void) => { const r = altered(b => { patch(b); return b; }); return simContractCheck(r); };
  const step = changed(b => { b.stepS = 1 / 60; });
  assert.equal(step.verdict === 'FAIL' && step.checkFailReason, 'CONTRACT_CHANGED', 'NFR-0006: a different STEP is CONTRACT_CHANGED');
  assert.equal('stepUnchanged' in step && step.stepUnchanged, false, 'NFR-0006: stepUnchanged is false');
  const line = changed(b => { b.inputTypeLine = 'export type Input = { throttle: number; brake: number; steer: number };'; });
  assert.equal('inputContractUnchanged' in line && line.inputContractUnchanged, false, 'NFR-0006: a different Input line makes inputContractUnchanged false');
  const wheelbase = changed(b => { b.simWheelbaseM = 1.05; });
  assert.equal('simMeasuresUnchanged' in wheelbase && wheelbase.simMeasuresUnchanged, false, 'NFR-0006: a different wheelbase makes simMeasuresUnchanged false');
  const physicsWithClamp = sourceText('src/physics.ts').replace('export type Input = {', 'export type Input = { turbo?: boolean;');
  const fields = simContractCheck(baseline, physicsWithClamp);
  assert.equal('inputContractUnchanged' in fields && fields.inputContractUnchanged, false, 'NFR-0006: a field added to Input is detected through the source line');
});

test('CHK-TEST-0004-13 the two reference laps of the baseline replay to the same lap time, sectors, validity and final state', (t) => {
  // NFR-0006
  t.diagnostic(serializeRecord(determinism));
  assert.equal(determinism.verdict, 'PASS', 'NFR-0006: DETERMINISM must be PASS');
  if (determinism.verdict !== 'PASS' || determinism.checkFailReason === 'BASELINE_MISSING') return;
  assert.equal(determinism.comparedRunCount, 2, 'NFR-0006: both published setups are compared');
  assert.equal(determinism.differingRunCount, 0, 'NFR-0006: no run may differ from the baseline');
  if ('ok' in baseline) for (const run of baseline.baseline.referenceRuns) assert.equal(run.lapValidity, 'VALID', `NFR-0006: the ${run.setupId} reference lap is valid`);
  // The final State is compared on the fields the baseline recorded (DM-0001, field by field): every recorded value still
  // decides, and a recorded field the simulation no longer has decides too; only a field the baseline never recorded is not compared.
  const kart = 'ok' in baseline ? baseline.baseline.referenceRuns[0].finalKart : undefined;
  const current = { ...kart, telemetry: { ...kart?.telemetry, addedLater: true } };
  assert.deepEqual(recordedFieldsOf(kart, current), kart, 'NFR-0006: a field the baseline never recorded is not compared');
  assert.notDeepEqual(recordedFieldsOf(kart, { ...current, telemetry: { ...current.telemetry, wallContact: undefined } }), kart, 'NFR-0006: a recorded field missing from the state differs');
  assert.notDeepEqual(recordedFieldsOf(kart, { ...current, telemetry: { ...current.telemetry, wheels: [] } }), kart, 'NFR-0006: a recorded array of another length differs');
  const movedX = determinismCheck(altered(b => { b.referenceRuns[0].finalKart.x += 0.01; return b; }), reading);
  assert.equal(movedX.verdict === 'FAIL' && movedX.checkFailReason, 'NON_DETERMINISTIC', 'NFR-0006: a recorded final x moved by 1 cm is NON_DETERMINISTIC');
  assert.equal('differingRunCount' in movedX && movedX.differingRunCount, 1, 'NFR-0006: exactly the altered run differs');
  const ghostField = determinismCheck(altered(b => { (b.referenceRuns[1].finalKart.telemetry as Record<string, unknown>).recordedButGone = true; return b; }), reading);
  assert.equal(ghostField.verdict === 'FAIL' && ghostField.checkFailReason, 'NON_DETERMINISTIC', 'NFR-0006: a recorded field the state does not carry is NON_DETERMINISTIC');
  assert.equal('differingRunCount' in ghostField && ghostField.differingRunCount, 1, 'NFR-0006: exactly the run with the recorded-only field differs');
});

test('CHK-TEST-0004-14 without a usable baseline the three comparisons are BASELINE_MISSING and nothing is compared', () => {
  // NFR-0006, NFR-0007
  const missing = readSimBaseline('tests/fixtures/does-not-exist.json');
  assert.deepEqual(missing, { code: 'BASELINE_MISSING' }, 'NFR-0006: a missing file is BASELINE_MISSING');
  assert.deepEqual(readSimBaseline('tests/fixtures/trackFiles.ts'), { code: 'BASELINE_MISSING' }, 'NFR-0006: a file that is not JSON is BASELINE_MISSING');
  assert.deepEqual(altered(b => ({ ...b, schemaVersion: 2 })), { code: 'BASELINE_MISSING' }, 'NFR-0006: schemaVersion 2 is BASELINE_MISSING');
  assert.deepEqual(altered(b => { b.referenceRuns[0].setupVersion = 'arcade-assistido-v4'; return b; }), { code: 'BASELINE_MISSING' }, 'NFR-0006: a baseline of another setup version is BASELINE_MISSING');
  assert.deepEqual(altered(b => ({ ...b, trackVersion: 99 })), { code: 'BASELINE_MISSING' }, 'NFR-0006: a baseline of another track version is BASELINE_MISSING');
  assert.ok('ok' in altered(b => b), 'NFR-0006: the unaltered copy is still read');
  for (const record of [simContractCheck(missing), determinismCheck(missing, reading), wheelPositionsCheck(missing, reading)]) {
    assert.equal(record.verdict, 'FAIL', `NFR-0006: ${record.checkId} without a baseline is FAIL`);
    assert.equal(record.verdict === 'FAIL' && record.checkFailReason, 'BASELINE_MISSING', `NFR-0006: ${record.checkId} without a baseline is BASELINE_MISSING`);
    assert.deepEqual(Object.keys(record).sort(), ['checkFailReason', 'checkId', 'verdict'], `NFR-0006: ${record.checkId} compares nothing without a baseline`);
  }
  assert.equal(BASELINE_PATH, 'tests/fixtures/kart01-sim-baseline.json', 'NFR-0006: the baseline is the versioned fixture');
});

test('CHK-TEST-0004-15 wheelPositions of both setups equal the baseline value for value, and one altered value is STATE_DIFFERS', (t) => {
  // NFR-0007
  t.diagnostic(serializeRecord(wheelPositionsRecord));
  assert.equal(wheelPositionsRecord.verdict, 'PASS', 'NFR-0007: WHEEL_POSITIONS must be PASS');
  if (wheelPositionsRecord.verdict !== 'PASS' || wheelPositionsRecord.checkFailReason === 'BASELINE_MISSING') return;
  assert.equal(wheelPositionsRecord.comparedValueCount, 16, 'NFR-0007: 16 values are compared (4 wheels x 2 x 2 setups)');
  assert.equal(wheelPositionsRecord.differingValueCount, 0, 'NFR-0007: no wheelPositions value may differ from the baseline');
  assert.ok(wheelPositionsRecord.checkStepCount > 0, 'NFR-0007: the steps of the reference runs are reported');
  const shifted = wheelPositionsCheck(altered(b => { b.wheelPositions.ARCADE_ASSISTIDO[2].leftM += 0.03; return b; }), reading);
  assert.equal(shifted.verdict === 'FAIL' && shifted.checkFailReason, 'STATE_DIFFERS', 'NFR-0007: a baseline value moved by 3 cm is STATE_DIFFERS');
  assert.equal('differingValueCount' in shifted && shifted.differingValueCount, 1, 'NFR-0007: exactly the moved value differs');
});

test('CHK-TEST-0004-16 every record of API-0002 carries its checkId, its verdict, its measured fields with the contract names, and a reason only on FAIL', () => {
  // NFR-0004, NFR-0005, NFR-0006, NFR-0007, AC-US-0002-02
  const model = buildKart01Model();
  const measures = measureKart01Model(model);
  const trace: { pose: KartPose; config: typeof PUBLISHED_SETUPS.ARCADE_ASSISTIDO.config }[] = [];
  completeLap(reading, 'OFFICIAL', autopilot(), (_b, after) => { if (trace.length < 50) { const p = getKartPose(after.kart); if (!('code' in p)) trace.push({ pose: p, config: after.config }); } });
  const records: CheckRecord[] = [
    judgeModelCheck('KART_DIMENSIONS', measures), judgeModelCheck('WHEELS_AND_TRACKS', measures), judgeModelCheck('PART_GROUPS', measures),
    judgeModelCheck('PART_COLORS', measures), judgeModelCheck('DRAW_COST', measures),
    wheelSpinCheck(10, 120), wheelSpinCheck(-10, 120), wheelSpinCheck(0, 120),
    layering, renderNeutral, simContract, determinism, wheelPositionsRecord, telemetryWheelPositionsCheck(trace),
  ];
  const isNumber = (v: unknown) => typeof v === 'number' && Number.isFinite(v);
  const isInteger = (v: unknown) => Number.isInteger(v);
  const isHex = (v: unknown) => typeof v === 'string' && /^#[0-9A-F]{6}$/.test(v);
  const FIELDS: Record<string, Record<string, (v: unknown) => boolean>> = {
    KART_DIMENSIONS: { bboxLengthM: isNumber, bboxWidthM: isNumber, wheelbaseM: isNumber },
    WHEELS_AND_TRACKS: { frontWheelDiametersM: v => Array.isArray(v) && v.length === 2 && v.every(isNumber), rearWheelDiametersM: v => Array.isArray(v) && v.length === 2 && v.every(isNumber), frontTrackM: isNumber, rearTrackM: isNumber },
    PART_GROUPS: { partGroups: v => Array.isArray(v) && v.every(g => typeof g.groupName === 'string' && isInteger(g.visibleTriangleCount) && (g.parentGroupName === undefined || typeof g.parentGroupName === 'string')), missingGroupNames: v => Array.isArray(v) && v.every(s => typeof s === 'string') },
    PART_COLORS: { kartColorHexes: v => Array.isArray(v) && v.every(isHex), chassisColorHexes: v => Array.isArray(v) && v.every(isHex), bumperPlateColorHex: isHex, suitColorHex: isHex },
    DRAW_COST: { meshCount: isInteger, drawCallCount: isInteger, triangleCount: isInteger },
    WHEEL_SPIN: { checkStepCount: v => isInteger(v) && (v as number) > 0, simulatedTimeMs: isNumber, rollingSpeedMps: isNumber, wheels: v => Array.isArray(v) && v.length === 4 && v.every(w => typeof w.groupName === 'string' && isNumber(w.diameterM) && isNumber(w.spinRevs) && isNumber(w.expectedSpinRevs)) },
    LAYERING: { checkedFileCount: v => isInteger(v) && (v as number) > 0, forbiddenImportCount: isInteger },
    RENDER_NEUTRAL: { checkStepCount: isInteger, differingFieldCount: isInteger },
    SIM_CONTRACT: { stepUnchanged: v => typeof v === 'boolean', inputContractUnchanged: v => typeof v === 'boolean', simMeasuresUnchanged: v => typeof v === 'boolean', simWheelbaseM: isNumber, simTrackWidthM: isNumber },
    DETERMINISM: { comparedRunCount: v => isInteger(v) && (v as number) > 0, differingRunCount: isInteger },
    WHEEL_POSITIONS: { checkStepCount: isInteger, comparedValueCount: isInteger, differingValueCount: isInteger },
    TELEMETRY_WHEEL_POSITIONS: { comparedStepCount: isInteger, differingValueCount: isInteger },
  };
  const seen = new Set<string>();
  for (const record of records) {
    const r = record as unknown as Record<string, unknown>;
    seen.add(record.checkId);
    assert.ok(CHECK_IDS.includes(record.checkId), `API-0002: ${record.checkId} is a checkId of the contract`);
    assert.ok(record.verdict === 'PASS' || record.verdict === 'FAIL', `API-0002: ${record.checkId} has a verdict`);
    if (record.verdict === 'PASS') assert.equal('checkFailReason' in r, false, `API-0002: ${record.checkId} carries no reason on PASS`);
    else assert.equal(typeof r.checkFailReason, 'string', `API-0002: ${record.checkId} carries a reason on FAIL`);
    for (const [field, check] of Object.entries(FIELDS[record.checkId])) assert.ok(check(r[field]), `API-0002: ${record.checkId}.${field} must be present with the contract type`);
    const extra = Object.keys(r).filter(k => !['checkId', 'verdict', 'checkFailReason', ...Object.keys(FIELDS[record.checkId])].includes(k));
    assert.deepEqual(extra, [], `API-0002: ${record.checkId} carries no field outside the contract`);
    const line = serializeRecord(record);
    assert.ok(!line.includes('\n'), `API-0002: ${record.checkId} serializes to one line`);
    assert.deepEqual(JSON.parse(line), JSON.parse(JSON.stringify(record)), `API-0002: ${record.checkId} round-trips through JSON`);
  }
  assert.deepEqual([...seen].sort(), [...CHECK_IDS].sort(), 'API-0002: all 12 checkIds are produced by the suites');
  assert.equal(records.filter(r => r.checkId === 'WHEEL_SPIN').length, 3, 'API-0002: WHEEL_SPIN has one record per speed tried');
  assert.equal(serializeRecord(judgeModelCheck('DRAW_COST', measureKart01Model(buildKart01Model()))), serializeRecord(judgeModelCheck('DRAW_COST', measures)), 'API-0002: running the same check twice gives the same record');
  assert.equal(serializeRecord(wheelSpinCheck(10, 120)), serializeRecord(wheelSpinCheck(10, 120)), 'API-0002: WHEEL_SPIN is idempotent');
});

test('CHK-TEST-0004-17 nothing but the Kart 01 model hangs from the displayed kart and no drift indicator exists in the scene or on the page', () => {
  // AC-US-0005-04
  const kartRootChildren = [...main.matchAll(/\bkartRoot\.add\(([^)]*)\)/g)].map(m => m[1].trim());
  assert.deepEqual(kartRootChildren, ['kart01.root'], 'AC-US-0005-04: the only object src/main.ts attaches to kartRoot is kart01.root');
  assert.ok(!/\bkart01\.[\w.]+\.add\(/.test(main), 'AC-US-0005-04: src/main.ts attaches nothing to a node of the model');
  const sceneChildren = [...main.matchAll(/\bscene\.add\(([^;]*)\);/g)].map(m => m[1].replace(/\(.*$/, '').trim());
  assert.deepEqual([...new Set(sceneChildren)].sort(), ['group', 'ground', 'kartRoot', 'new THREE.HemisphereLight', 'skidMarks', 'sun', 'sun.target', 'syntheticScene'].sort(),
    'AC-US-0005-04: the scene holds the lights, the ground, the tracks, the kart and the tyre marks only');
  assert.ok(!/\.drifting\b/.test(main), 'AC-US-0005-04: src/main.ts reads no drifting flag');
  assert.ok(!/\bmaneuvers\b/.test(main), 'AC-US-0005-04: src/main.ts reads no manoeuvre state');
  assert.ok(!/drift/i.test(sourceText('index.html')), 'AC-US-0005-04: the page has no drift element');
});

test('CHK-TEST-0004-18 no turbo smoke or flame exists: no jet, no exhaust outlet and nothing reading the boost', () => {
  // AC-US-0005-05
  for (const symbol of [/\bexhaust/i, /\bjet\b/i, /ConeGeometry/, /\bboost\b/i, /\bturbo/i]) assert.ok(!symbol.test(main), `AC-US-0005-05: src/main.ts has no ${symbol}`);
  const model = stripComments(sourceText('src/kart01Model.ts'));
  for (const symbol of [/exhaustOutlet/, /escapamentoSaida/]) assert.ok(!symbol.test(model), `AC-US-0005-05: src/kart01Model.ts has no ${symbol}`);
  assert.ok(!/turbo|boost/i.test(sourceText('index.html')), 'AC-US-0005-05: the page has no turbo element');
});

test('CHK-TEST-0004-19 at exactly 6 m/s, at exactly 0.055 rad either way, and in a frame without a new step, no mark segment is laid', () => {
  // AC-US-0005-07
  const pair = slidingPair('TRAINING');
  const telemetry = pair.next.kart.telemetry;
  const cases: [string, LapSession, number][] = [
    ['the driven sliding step', pair.next, 2],
    ['the same step at exactly 6 m/s', seedLap(pair.next, { kart: { speed: 6 } }), 0],
    ['the same step just above 6 m/s', seedLap(pair.next, { kart: { speed: 6 + 1e-6 } }), 2],
    ['the same step at exactly +0.055 rad', seedLap(pair.next, { kart: { telemetry: { ...telemetry, sideslip: 0.055 } } }), 0],
    ['the same step just beyond +0.055 rad', seedLap(pair.next, { kart: { telemetry: { ...telemetry, sideslip: 0.055 + 1e-6 } } }), 2],
    ['the same step at exactly -0.055 rad', seedLap(pair.next, { kart: { telemetry: { ...telemetry, sideslip: -0.055 } } }), 0],
    ['the same step just beyond -0.055 rad', seedLap(pair.next, { kart: { telemetry: { ...telemetry, sideslip: -0.055 - 1e-6 } } }), 2],
  ];
  for (const [label, lap, segments] of cases) {
    assert.equal(pair.primed()(lap).length, segments, `AC-US-0005-07: ${label} (${lap.kart.speed} m/s, ${lap.kart.telemetry.sideslip} rad) lays ${segments} segments`);
  }
  const run = pair.primed();
  assert.equal(run(pair.next).length, 2, 'AC-US-0005-07: the sliding step lays its two segments');
  for (let i = 0; i < 3; i++) assert.equal(run(pair.next).length, 0, `AC-US-0005-07: frame ${i + 1} after it, without a new step, lays no segment`);
});

test('CHK-TEST-0004-20 before the green signal, in the pause, after the lap ended and without a lap, no mark segment is laid whatever the step', () => {
  // AC-US-0005-07
  const run = tyreMarkRunner(realistaRef);
  assert.deepEqual(run(undefined), [], 'AC-US-0005-07: without a lap no segment is laid');
  let countdown = startSession(reading, 'OFFICIAL', REALISTA.config);
  for (let i = 0; i < COUNTDOWN_STEPS - 1; i++) {
    countdown = stepLap(countdown, slideInput);
    assert.equal(countdown.phase, 'COUNTDOWN', `AC-US-0005-07: countdown step ${i} is still the countdown`);
    assert.deepEqual(run(countdown), [], `AC-US-0005-07: countdown frame ${i}, with full throttle, full lock and the drift command, lays no segment`);
  }
  // A step that advanced and then the lap left RUNNING in the same frame: paused, ended by the player, ended by a
  // reposition of the official lap. The kart is sliding above both limits in each.
  const training = slidingPair('TRAINING'), official = slidingPair('OFFICIAL');
  // Without a lap src/main.ts shows the idle kart of the ready training (getKartPose(lap?.kart ?? idleKart)): a kart that
  // slides above both limits on a step the frame never saw still lays nothing.
  const idle = tyreMarkRunner(realistaRef, undefined, training.next.kart);
  assert.deepEqual(idle(undefined), [], 'AC-US-0005-07: without a lap, over the idle kart, no segment is laid');
  const paused = pauseLap(training.next, 'ESC_KEY'), ended = endTraining(training.next), repositioned = repositionKart(official.next);
  assert.ok(paused.ok && ended.ok && repositioned.ok, 'AC-US-0005-07: the lap commands were accepted');
  if (!paused.ok || !ended.ok || !repositioned.ok) return;
  const left: [string, SlidingPair, LapSession][] = [['paused', training, paused.lap], ['ended by the player', training, ended.lap], ['ended by a reposition', official, repositioned.lap]];
  for (const [label, pair, lap] of left) {
    const t = getHandlingTelemetry(lap.kart, realistaRef);
    assert.ok(!('code' in t) && t.speedMps > 6 && t.sideslipRad > 0.055 && lap.kart.stepCount > pair.prev.kart.stepCount, `AC-US-0005-07: the ${label} lap advanced a sliding step`);
    const frames = pair.primed();
    assert.deepEqual(frames(lap), [], `AC-US-0005-07: the frame of the step that was then ${label} lays no segment`);
    let after = lap;
    for (let i = 0; i < 3; i++) { after = stepLap(after, slideInput); assert.deepEqual(frames(after), [], `AC-US-0005-07: frame ${i + 1} ${label} lays no segment`); }
    assert.equal(after.kart.stepCount, lap.kart.stepCount, `AC-US-0005-07: the simulation did not advance ${label}`);
  }
  // An official lap ended by completion: the frames after the end, with the simulation stopped.
  const finished = drive(runCountdown(startSession(reading, 'OFFICIAL', REALISTA.config)), autopilot(0, REALISTA.config), 20000).lap;
  assert.equal(finished.phase, 'ENDED', 'AC-US-0005-07: the official lap ended on the finish line');
  const afterEnd = tyreMarkRunner(realistaRef);
  afterEnd(finished);
  let frozen = finished;
  for (let i = 0; i < 5; i++) { frozen = stepLap(frozen, slideInput); assert.deepEqual(afterEnd(frozen), [], `AC-US-0005-07: frame ${i + 1} after the official lap ended lays no segment`); }
  assert.equal(frozen.kart.stepCount, finished.kart.stepCount, 'AC-US-0005-07: the simulation is stopped after the official lap ended');
});
