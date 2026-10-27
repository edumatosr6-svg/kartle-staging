// TEST-0010 — the transversal contracts: the fixed step, the cost baseline, docs/physics.md, the layers, the Realista
// preset and the untouched lap validation (strategy: contract, contract and unit, API-0003, DES-0001, DES-0004, DM-0001).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { ARCADE_ASSISTIDO_V5, ARCADE_KART, PUBLISHED_SETUPS, RENTAL_KART, SOLVER_SUBSTEPS, STEP } from '../src/physics';
import {
  ALL_BENCHES, BENCH_PARAMETERS, judge, loadBaselineText, readBaseline, runBench,
  type BenchRecord, type RealistaUnchangedRecord, type StepContractRecord, type StepCostRecord,
} from '../scripts/handlingBench';
import { BASELINE_RUNTIME_ID, baselineMarkdown } from './fixtures/records';
import { ARCADE, ARCADE_BASELINE, MODES, options, REALISTA, REALISTA_BASELINE } from './helpers/handling';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const stripComments = (text: string) => text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
const source = (file: string) => readFileSync(join(root, file), 'utf8');
const code = (file: string) => stripComments(source(file));
const uses = (text: string, symbol: string) => new RegExp(`(^|[^\\w.$'"])${symbol.replace(/[.()/]/g, m => `\\${m}`)}(?![\\w$])`).test(text);
const imports = (text: string) => [...text.matchAll(/from\s+'([^']+)'/g)].map(m => m[1]);
const stepContract = runBench('STEP_CONTRACT', options('BINARY'))[0] as StepContractRecord;

test('CHK-TEST-0010-01 the step, the solver rate and the Input fields are the same before and after the feature', () => {
  // AC-US-0005-06
  assert.equal(stepContract.stepUnchanged, true, 'AC-US-0005-06: STEP must be unchanged (1 / 120)');
  assert.equal(stepContract.solverRateUnchanged, true, 'AC-US-0005-06: the solver must still run at 480 Hz');
  assert.equal(stepContract.inputFieldsUnchanged, true, 'AC-US-0005-06: the Input fields must be unchanged');
  assert.equal(stepContract.verdict, 'PASS', 'AC-US-0005-06: STEP_CONTRACT must be PASS');
  assert.equal(1 / STEP, 120, 'AC-US-0005-06: 1 / STEP must be exactly 120');
  assert.equal(120 * SOLVER_SUBSTEPS, 480, 'AC-US-0005-06: STEP divided in SOLVER_SUBSTEPS must give 480 Hz');
  const physics = source('src/physics.ts');
  assert.ok(physics.split('\n').includes('export type Input = { throttle: number; brake: number; steer: number; drift?: boolean };'), 'AC-US-0005-06: the Input line must be literally unchanged');
  assert.match(physics, /export function step\(state: State, input: Input, dt = STEP, config: KartConfig = RENTAL_KART, environment: Environment = CIRCUIT\): State/, 'AC-US-0005-06: the signature of step must be unchanged');
  assert.equal(judge({ ...stepContract, inputFieldsUnchanged: false }).failReason, 'CONTRACT_CHANGED', 'AC-US-0005-06: a changed Input is CONTRACT_CHANGED');
});

test('CHK-TEST-0010-02 the step cost is judged only against a baseline of the same machine and runtime, at most 10 % above it', () => {
  // NFR-0002
  const text = baselineMarkdown('stepCost');
  assert.equal(readBaseline(text, ARCADE.setupId, ARCADE.previousSetupVersion ?? '', 'another-runtime'), undefined, 'NFR-0002: a baseline of another runtime is not read');
  const baseline = readBaseline(text, ARCADE.setupId, ARCADE.previousSetupVersion ?? '', BASELINE_RUNTIME_ID);
  assert.ok(baseline && baseline.runtimeId === BASELINE_RUNTIME_ID, 'NFR-0002: the baseline of the same runtime is read');
  const cost = (meanStepCostUs: number, runtimeId = BASELINE_RUNTIME_ID) => runBench('STEP_COST', options('BINARY', { baseline, stepCost: { meanStepCostUs, runtimeId } }))[0] as StepCostRecord;
  const within = cost(10);
  assert.equal(within.baselineAvailable, true, 'NFR-0002: the baseline must be found');
  assert.equal(within.baselineMeanStepCostUs, 10, 'NFR-0002: the baseline cost must be reported');
  assert.equal(within.verdict, 'PASS', 'NFR-0002: 10 µs against 10 µs is PASS');
  assert.equal(cost(10.9).verdict, 'PASS', 'NFR-0002: 10.9 µs against 10 µs (9 % above) is PASS');
  const above = cost(11.5);
  assert.equal(above.verdict, 'FAIL', 'NFR-0002: 11.5 µs against 10 µs is FAIL');
  assert.equal(above.failReason, 'THRESHOLD_EXCEEDED', 'NFR-0002: 11.5 µs against 10 µs is THRESHOLD_EXCEEDED');
  const other = cost(10, 'another-runtime');
  assert.equal(other.baselineAvailable, false, 'NFR-0002: another runtime has no baseline');
  assert.equal(other.failReason, 'BASELINE_MISSING', 'NFR-0002: another runtime is BASELINE_MISSING');
  assert.throws(() => runBench('STEP_COST', options('BINARY')), /stepCost/, 'NFR-0002: STEP_COST needs the cost measured by the bench program; the tests never read the clock');
  assert.equal(ARCADE_BASELINE?.runtimeId !== undefined, true, 'NFR-0002: the recorded baseline names its runtime');
});

test('CHK-TEST-0010-03 docs/physics.md carries a handling-baseline block with a dated entry per setup version, the sweep parameters and every record of API-0003 with its environment', () => {
  // NFR-0004
  const text = loadBaselineText();
  assert.match(text, /```json handling-baseline/, 'NFR-0004: the machine-readable block must be present');
  const versions = [[ARCADE.setupId, ARCADE.previousSetupVersion ?? ''], [ARCADE.setupId, ARCADE.setupVersion], [REALISTA.setupId, REALISTA.setupVersion]] as const;
  for (const [setupId, setupVersion] of versions) {
    const entry = readBaseline(text, setupId, setupVersion);
    assert.ok(entry, `NFR-0004: an entry for ${setupVersion} must be recorded`);
    if (!entry) continue;
    assert.match(entry.measuredAtUtc, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/, `NFR-0004: ${setupVersion}: measuredAtUtc must be a UTC date`);
    assert.equal(entry.parameters?.plateauMs, BENCH_PARAMETERS.plateauMs, `NFR-0004: ${setupVersion}: plateauMs must be recorded with the entry`);
    assert.equal(entry.parameters?.plateauSpeedHoldMode, BENCH_PARAMETERS.plateauSpeedHoldMode, `NFR-0004: ${setupVersion}: plateauSpeedHoldMode must be recorded with the entry`);
    for (const id of ALL_BENCHES) assert.ok(entry.records.some(r => r.benchId === id), `NFR-0004: ${setupVersion}: a ${id} record must be recorded`);
    for (const mode of MODES) assert.ok(entry.records.some(r => r.inputMode === mode), `NFR-0004: ${setupVersion}: records in ${mode}`);
    for (const r of entry.records) {
      const o = r as Record<string, unknown>;
      assert.ok(o.benchEnvironment === 'TEST_PAD' || o.benchEnvironment === 'SYNTHETIC_TRACK', `NFR-0004: ${setupVersion} ${r.benchId}: benchEnvironment must be recorded`);
      assert.ok(typeof o.verdict === 'string' && typeof o.setupVersion === 'string' && typeof o.baselineAvailable === 'boolean', `NFR-0004: ${setupVersion} ${r.benchId}: the common fields must be recorded`);
      if (r.benchId === 'STEER_RESPONSE') for (const k of ['speedHoldMode', 'speedHoldBandMps', 'speedMinMps', 'speedMaxMps', 'settleWindowMs']) assert.ok(k in o, `NFR-0004: ${setupVersion}: STEER_RESPONSE must record ${k}`);
      if (r.benchId === 'REFERENCE_CORNER' || r.benchId === 'UNDERSTEER_ONSET' || r.benchId === 'REAR_RECOVERY') for (const k of ['arcRadiusM', 'laneWidthM']) assert.ok(k in o, `NFR-0004: ${setupVersion}: ${r.benchId} must record ${k}`);
      if (r.benchId === 'UNDERSTEER_ONSET') assert.ok('entrySpeedStepMps' in o && 'maxUndersteerMsBySpeed' in o, `NFR-0004: ${setupVersion}: UNDERSTEER_ONSET must record the sweep step and the plateaus`);
      if (r.benchId === 'GRASS_LOSS' || r.benchId === 'WALL_CONTACT' || r.benchId === 'TEST_PILOT_LAP') assert.equal(o.benchEnvironment, 'SYNTHETIC_TRACK', `NFR-0004: ${setupVersion}: ${r.benchId} runs on the synthetic track`);
    }
  }
  assert.match(text, /\b2026-\d{2}-\d{2}\b/, 'NFR-0004: the prose must carry a dated entry');
});

test('CHK-TEST-0010-04 the simulation modules of the feature read no DOM, clock, random, perf hooks or os, and the application decides no driving rule', () => {
  // NFR-0005
  // The DOM globals as members (a local variable may be called `window`); the clock, the random and the timers as calls.
  const FORBIDDEN = ['document.', 'window.', 'Date', 'performance.', 'Math.random', 'requestAnimationFrame', 'setTimeout', 'setInterval', 'navigator.', 'localStorage', 'fetch('];
  for (const file of ['src/physics.ts', 'src/setupRecords.ts', 'scripts/handlingBench.ts', 'src/handlingMessages.ts']) {
    const text = code(file);
    for (const symbol of FORBIDDEN) assert.ok(!uses(text, symbol), `NFR-0005: ${file} must not use ${symbol}`);
    for (const dep of imports(text)) {
      assert.ok(!/^three/.test(dep) && !/node:(perf_hooks|os)$/.test(dep), `NFR-0005: ${file} must not import ${dep}`);
      assert.ok(!/\.\/(audio|main)$/.test(dep), `NFR-0005: ${file} must not import an outer layer (${dep})`);
    }
  }
  const main = code('src/main.ts');
  for (const literal of ['50 / 3.6', '13.88', '0.65']) assert.ok(!main.includes(literal), `NFR-0005: src/main.ts must not carry the rule literal ${literal}`);
  for (const symbol of ['KART_PRESETS', 'ARCADE_KART', 'ARCADE_ASSISTIDO_V5', 'RENTAL_KART', 'classifyHandlingSteps', 'testPadLane', 'testPadArc', 'isForcing']) assert.ok(!uses(main, symbol), `NFR-0005: src/main.ts must not use ${symbol}`);
  assert.ok(imports(main).includes('./physics') && uses(main, 'PUBLISHED_SETUPS'), 'NFR-0005: the application reads the published setups from the simulation');
  assert.equal(typeof document, 'undefined', 'NFR-0005: the benches run in npm test without a DOM');
  assert.equal(typeof window, 'undefined', 'NFR-0005: the benches run in npm test without a window');
});

test('CHK-TEST-0010-05 the Realista preset is unchanged: no differing measure against its baseline, no arcade assist active, no new optional field', () => {
  // NFR-0007
  const records = runBench('REALISTA_UNCHANGED', options('BINARY')) as RealistaUnchangedRecord[];
  assert.equal(records.length, 2, 'NFR-0007: one record per environment');
  for (const r of records) {
    assert.equal(r.baselineAvailable, true, `NFR-0007: ${r.benchEnvironment}: the Realista baseline must be recorded`);
    assert.equal(r.differingMeasureCount, 0, `NFR-0007: ${r.benchEnvironment}: no measure may differ from the baseline`);
    assert.equal(r.arcadeAssistActiveCount, 0, `NFR-0007: ${r.benchEnvironment}: no arcade assist may be active with the Realista`);
    assert.equal(r.verdict, 'PASS', `NFR-0007: ${r.benchEnvironment}: REALISTA_UNCHANGED must be PASS (${r.failReason ?? ''})`);
  }
  assert.equal(judge({ ...records[0], baselineAvailable: false }).failReason, 'BASELINE_MISSING', 'NFR-0007: without the baseline the bench is BASELINE_MISSING');
  assert.equal(judge({ ...records[0], differingMeasureCount: 1 }).failReason, 'CONTRACT_CHANGED', 'NFR-0007: one differing measure is CONTRACT_CHANGED');
  assert.equal(judge({ ...records[0], arcadeAssistActiveCount: 1 }).failReason, 'CONTRACT_CHANGED', 'NFR-0007: one active assist is CONTRACT_CHANGED');
  const OPTIONAL = ['steerApplyRatePerS', 'steerReturnRatePerS', 'assistLateralG', 'assistSteerAllowanceRad', 'yawTrackingGainPerS', 'yawCorrectGainPerS', 'slipDampingGainPerS', 'slipDampingCapG', 'forcingRearFrictionScale', 'grassSpeedLossPerS', 'forcingRampMps'];
  for (const k of OPTIONAL) {
    assert.ok(!(k in RENTAL_KART), `NFR-0007: RENTAL_KART must not declare ${k}`);
    assert.ok(!(k in ARCADE_KART), `NFR-0007: ARCADE_KART (the previous version) must not declare ${k}`);
  }
  assert.equal(RENTAL_KART.drivingAssists, false, 'NFR-0007: the Realista has no driving assists');
  assert.equal(PUBLISHED_SETUPS.REALISTA_ALUGUEL_4T.config, RENTAL_KART, 'NFR-0007: the published Realista is RENTAL_KART itself');
  assert.ok(!('previousSetupVersion' in PUBLISHED_SETUPS.REALISTA_ALUGUEL_4T), 'NFR-0007: the Realista declares no previous version: it did not change');
  assert.ok(Object.isFrozen(RENTAL_KART) && Object.isFrozen(ARCADE_KART) && Object.isFrozen(ARCADE_ASSISTIDO_V5) && Object.isFrozen(PUBLISHED_SETUPS), 'NFR-0007: the presets and the published data are frozen records');
  assert.equal(REALISTA_BASELINE?.records.length, ARCADE_BASELINE?.records.length, 'NFR-0007: the Realista baseline carries the same set of records as the Arcade one');
});

test('CHK-TEST-0010-06 the lap validation and the track data of race-lap-validation do not know the setup: no import of the records module, no test-pad, and the setup fields only copied', () => {
  // NFR-0008
  for (const file of ['src/lap.ts', 'src/track.ts', 'src/trackData.ts', 'src/lapTiming.ts']) {
    const text = code(file);
    assert.ok(!imports(text).some(d => /setupRecords|handlingBench|handlingMessages/.test(d)), `NFR-0008: ${file} must not import the modules of the feature`);
    for (const symbol of ['testPadLane', 'testPadArc', 'PUBLISHED_SETUPS', 'resolveSetupRef', 'compareLapRecords', 'ARCADE_ASSISTIDO_V5']) assert.ok(!uses(text, symbol), `NFR-0008: ${file} must not use ${symbol}`);
  }
  for (const file of ['src/track.ts', 'src/trackData.ts', 'src/lapTiming.ts']) assert.ok(!code(file).includes('setupVersion'), `NFR-0008: ${file} must not mention the setup version`);
  const lap = code('src/lap.ts');
  const mentions = lap.match(/setupVersion/g) ?? [];
  const declarations = lap.match(/setupVersion\?: string/g) ?? [];
  const copies = lap.match(/(request|session)\.setupVersion !== undefined \? \{ setupVersion: \1\.setupVersion \}/g) ?? [];
  assert.equal(copies.length, 2, 'NFR-0008: src/lap.ts copies the setup version from the request into the session and from the session into the result');
  assert.equal(mentions.length, declarations.length + 3 * copies.length, 'NFR-0008: in src/lap.ts the setup version appears only as an optional field and inside the two verbatim copies');
  assert.ok(!/setupVersion\s*(!==|===|!=(?!=)|==(?!=)|<|>)(?!\s*undefined\b)/.test(lap) && !/(===|!==|==|!=)\s*\w*\.setupVersion/.test(lap), 'NFR-0008: src/lap.ts never compares the setup version with anything but its absence');
  const suites = readdirSync(join(root, 'tests')).filter(f => /^race-lap-validation-.*\.test\.ts$/.test(f));
  assert.equal(suites.length, 14, 'NFR-0008: the 14 suites of race-lap-validation must still be in the tree and run by the same npm test');
  assert.match(source('tests/race-lap-validation-contract.test.ts'), /CHK-TEST-0012-02/, 'NFR-0008: CHK-TEST-0012-02 (result fields without the setup) must still be present');
});

test('CHK-TEST-0010-07 the records of API-0003 carry the common fields with their types, failReason only with FAIL, and every published setup is frozen', () => {
  // AC-US-0005-06
  const records: BenchRecord[] = [stepContract, ...runBench('SETUP_VERSION', options('PROPORTIONAL'))];
  for (const r of records) {
    assert.ok(['TEST_PAD', 'SYNTHETIC_TRACK'].includes(r.benchEnvironment), `${r.benchId}: benchEnvironment`);
    assert.ok(['ARCADE_ASSISTIDO', 'REALISTA_ALUGUEL_4T'].includes(r.setupId) && typeof r.setupVersion === 'string', `${r.benchId}: setupId and setupVersion`);
    assert.ok(['BINARY', 'PROPORTIONAL'].includes(r.inputMode) && ['PASS', 'FAIL'].includes(r.verdict), `${r.benchId}: inputMode and verdict`);
    assert.equal(r.measuredAtUtc, options('BINARY').measuredAtUtc, `${r.benchId}: measuredAtUtc comes from the caller, never from the clock`);
    assert.equal(typeof r.baselineAvailable, 'boolean', `${r.benchId}: baselineAvailable`);
    assert.equal('failReason' in r, r.verdict === 'FAIL', `${r.benchId}: failReason only with FAIL`);
  }
  assert.ok(Object.isFrozen(ALL_BENCHES) && Object.isFrozen(BENCH_PARAMETERS), 'AC-US-0005-06: the bench list and the parameters are frozen');
  assert.ok(ALL_BENCHES.length === 16 && new Set(ALL_BENCHES).size === 16, 'AC-US-0005-06: sixteen distinct benches');
});
