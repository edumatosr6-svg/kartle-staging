// TEST-0011 — the layers and invariants of the feature: the simulation and the track data touch no renderer, DOM, clock, random,
// network or storage; the screen rule stays out of the session; the step contract is unchanged; the synthetic track remains the
// track of the other features' benches; no runtime dependency was added (strategy: layering, text level, DES-0006, DES-0012).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { testPilot, testPilotLapWith } from '../scripts/handlingBench';
import { ARCADE_CONFIG, options } from './helpers/handling';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'src');
const stripComments = (text: string) => text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
const code = (file: string) => stripComments(readFileSync(join(root, file), 'utf8'));
const imports = (text: string) => [...text.matchAll(/from\s+'([^']+)'/g)].map(m => m[1]);
const uses = (text: string, symbol: string) => new RegExp(`(^|[^\\w.$'"])${symbol.replace('.', '\\.')}(?![\\w$])`).test(text);
// The simulation is the modules of the feature plus every src module they reach through their imports, found by the import
// graph rather than named (FB-01 of dirigibilidade): a module the step stops importing leaves the list with no edit here.
const SIMULATION_ROOTS = ['src/trackGeometry.ts', 'src/trackData.ts', 'src/physics.ts', 'src/lap.ts', 'src/trainingSession.ts', 'src/track.ts', 'src/lapTiming.ts'];
function reachedBy(roots: readonly string[]): string[] {
  const seen = new Set(roots);
  const queue = [...roots];
  while (queue.length > 0) {
    const file = queue.shift()!;
    for (const dep of imports(code(file))) {
      if (!/^\.\/[\w-]+$/.test(dep)) continue;
      const next = `${file.slice(0, file.lastIndexOf('/') + 1)}${dep.slice(2)}.ts`;
      if (!seen.has(next) && existsSync(join(root, next))) { seen.add(next); queue.push(next); }
    }
  }
  return [...seen];
}
const SIMULATION = reachedBy(SIMULATION_ROOTS);
const APPLICATION_PURE = ['src/curbFeedback.ts', 'src/lapMessages.ts'];
const PREPARATION = ['scripts/trackPrep.ts', 'scripts/trackChecks.ts'];
const FEATURE_MODULES = [...SIMULATION, ...APPLICATION_PURE, 'src/trackScene.ts', 'src/audio.ts', 'src/main.ts', ...PREPARATION, 'scripts/track-pipeline.ts'];
const NETWORK_OR_STORAGE = ['fetch', 'XMLHttpRequest', 'WebSocket', 'localStorage', 'sessionStorage', 'indexedDB', 'navigator.sendBeacon', 'EventSource'];
const DOM_CLOCK_RANDOM = ['document', 'window', 'Date', 'performance', 'Math.random', 'requestAnimationFrame', 'setTimeout', 'setInterval', 'navigator'];

test('CHK-TEST-0011-01 the simulation and track-data modules import nothing from three, the audio or the application, and use no DOM, clock or random', () => {
  // NFR-0007
  for (const file of [...SIMULATION, ...APPLICATION_PURE, ...PREPARATION]) {
    const text = code(file);
    for (const dep of imports(text)) {
      assert.ok(!/^three/.test(dep), `NFR-0007: ${file} must not import three (${dep})`);
      assert.ok(!/\.\/(audio|main|trackScene)$/.test(dep), `NFR-0007: ${file} must not import an outer layer (${dep})`);
      assert.ok(!/^node:/.test(dep) || file === 'scripts/track-pipeline.ts', `NFR-0007: ${file} must not import a node module (${dep})`);
    }
    for (const symbol of DOM_CLOCK_RANDOM) assert.ok(!uses(text, symbol), `NFR-0007: ${file} must not use ${symbol}`);
  }
  for (const dep of imports(code('src/trainingSession.ts'))) assert.ok(/^\.\/(physics|lap|trackData|trackGeometry)$/.test(dep), `NFR-0007: trainingSession.ts imports only the simulation (${dep})`);
  for (const dep of imports(code('src/trackGeometry.ts'))) assert.ok(/^\.\/track$/.test(dep), `NFR-0007: trackGeometry.ts imports only src/track.ts (${dep})`);
  assert.match(readFileSync(join(src, 'curbFeedback.ts'), 'utf8'), /import type \{ TrackContact \} from '\.\/physics';/, 'NFR-0007: curbFeedback.ts imports a type only');
  assert.match(readFileSync(join(src, 'lapMessages.ts'), 'utf8'), /import type \{[^}]*\} from '\.\/lap'/, 'NFR-0007: lapMessages.ts still imports ./lap as types only');
});

test('CHK-TEST-0011-02 no module of the feature, the application included, uses the network or the browser storage; the Kart Park comes bundled', () => {
  // NFR-0004
  for (const file of FEATURE_MODULES) {
    const text = code(file);
    for (const symbol of NETWORK_OR_STORAGE) assert.ok(!uses(text, symbol), `NFR-0004: ${file} must not use ${symbol}`);
  }
  assert.match(code('src/main.ts'), /from '\.\/tracks\/kart-park-v1\.json\?raw'/, 'NFR-0004: the track file is imported as bundled text');
  assert.ok(!/import\(/.test(code('src/main.ts')), 'NFR-0004: no dynamic import at run time');
  assert.ok(readdirSync(join(src, 'tracks')).includes('kart-park-v1.json'), 'NFR-0004: the published file lives in the bundle tree');
});

test('CHK-TEST-0011-03 the session knows no credit text, no licence and no label separator: the screen rule lives in src/lapMessages.ts', () => {
  // NFR-0005
  const session = readFileSync(join(src, 'trainingSession.ts'), 'utf8');
  for (const needle of ['openstreetmap', 'OpenStreetMap', 'ODbL', "' · '", '©']) assert.ok(!session.includes(needle), `NFR-0005: trainingSession.ts must not contain ${needle}`);
  const messages = code('src/lapMessages.ts');
  assert.match(messages, /export const OSM_CREDIT = Object\.freeze\(\{/, 'NFR-0005: the credit is declared in lapMessages.ts');
  assert.match(messages, /export function creditFor\(/, 'NFR-0005: the screen rule of the credit is in lapMessages.ts');
  assert.match(messages, /export function optionLabel\(/, 'NFR-0005: the label rule is in lapMessages.ts');
  assert.ok(!/MESSAGES\[[^\]]*\]\.(pt|en)\s*=|OSM_CREDIT.*message\(/.test(messages), 'NFR-0005: the credit does not go through the message table');
});

test('CHK-TEST-0011-04 the step contract is unchanged: STEP 1/120, the Input fields, the step signature, and no Input field for the curb', () => {
  // NFR-0008
  const physics = readFileSync(join(src, 'physics.ts'), 'utf8');
  assert.match(physics, /export const STEP = 1 \/ 120;/, 'NFR-0008: STEP is 1 / 120');
  assert.match(physics, /export type Input = \{ throttle: number; brake: number; steer: number; drift\?: boolean \};/, 'NFR-0008: the Input type is unchanged');
  assert.match(physics, /export function step\(state: State, input: Input, dt = STEP, config: KartConfig = RENTAL_KART, environment: Environment = CIRCUIT\): State/, 'NFR-0008: the step signature is unchanged');
  assert.match(physics, /export const SOLVER_SUBSTEPS = 4;/, 'NFR-0008: the solver rate is unchanged');
  const inputLine = physics.match(/export type Input = \{[^}]*\}/)![0];
  assert.ok(!/curb|surface|barrier/i.test(inputLine), 'NFR-0008: the curb enters as surface data, never as an Input field');
  assert.match(physics, /export type Surface = 'asphalt' \| 'curb' \| 'grass';/, 'NFR-0008: the curb is a surface');
  assert.match(physics, /export type Environment = \{ surfaceAt: \(point: Point\) => Surface; walls: boolean; track\?: TrackGeometry \};/, 'NFR-0008: the track geometry is environment data');
});

test('CHK-TEST-0011-05 the synthetic track stays the track of the other features: none of their tests or benches names the Kart Park, and the test-pilot lap still passes on it', () => {
  // NFR-0009
  const tests = readdirSync(join(root, 'tests')).filter(f => /^(race-lap-validation|dirigibilidade|modelo-kart-01)-.*\.test\.ts$/.test(f) || f === 'physics.test.ts' || f === 'maneuvers.test.ts');
  assert.ok(tests.length >= 20, `NFR-0009: the other features' suites are present (${tests.length})`);
  const files = [...tests.map(f => join('tests', f)), 'scripts/keyboard-lap.ts', 'scripts/physics-bench.ts', 'scripts/handlingBench.ts', 'scripts/kart01-baseline.ts', 'tests/helpers/autopilot.ts', 'tests/helpers/handling.ts', 'tests/fixtures/records.ts', 'tests/fixtures/trackFiles.ts'];
  for (const file of files) {
    // Comments may cite the feature by name (e.g. "ADR-0001 of pista-kart-park"); the code must not use the track.
    const text = code(file);
    for (const needle of ["'kart-park'", 'kartPark', 'trainingSession', 'trackEnvironment', 'kart-park-v1', 'tracks/kart-park']) assert.ok(!text.includes(needle), `NFR-0009: ${file} must not use the Kart Park (${needle})`);
  }
  const lap = testPilotLapWith(options('BINARY'), testPilot(ARCADE_CONFIG));
  assert.equal(lap.benchEnvironment, 'SYNTHETIC_TRACK', 'NFR-0009: the test-pilot lap runs on the synthetic track');
  assert.equal(lap.verdict, 'PASS', `NFR-0009: the test-pilot lap still passes (${lap.failReason ?? ''})`);
  assert.equal(lap.offAsphaltStepCount, 0, 'NFR-0009: with no step off the asphalt');
});

test('CHK-TEST-0011-06 the feature adds no runtime dependency: three stays the only one and the dev dependencies are unchanged', () => {
  // NFR-0010
  const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')) as { dependencies: Record<string, string>; devDependencies: Record<string, string>; scripts: Record<string, string> };
  assert.deepEqual(Object.keys(pkg.dependencies), ['three'], `NFR-0010: dependencies must be three only (${Object.keys(pkg.dependencies).join(', ')})`);
  assert.deepEqual(Object.keys(pkg.devDependencies).sort(), ['@types/three', 'tsx', 'typescript', 'vite'], 'NFR-0010: the dev dependencies are unchanged');
  for (const file of FEATURE_MODULES) for (const dep of imports(code(file))) {
    assert.ok(/^(\.|three|node:)/.test(dep), `NFR-0010: ${file} imports only the project, three or node (${dep})`);
  }
  assert.equal(pkg.scripts.track, 'tsx scripts/track-pipeline.ts', 'NFR-0010: the preparation runs with the existing tooling');
});

test('CHK-TEST-0011-07 no check of this feature needs the renderer: the suites import three only to build geometry in Node, and the scene module creates no renderer', () => {
  // NFR-0007
  const suites = readdirSync(join(root, 'tests')).filter(f => /^pista-kart-park-.*\.test\.ts$/.test(f));
  assert.ok(suites.length >= 10, `NFR-0007: the feature suites are present (${suites.length})`);
  // The forbidden calls, assembled so that this file's own text does not match them.
  const rendering = new RegExp(['new THREE\\.WebGL' + 'Renderer', 'requestAnimation' + 'Frame\\(', 'document\\.(getElementById|createElement|body)'].join('|'));
  for (const f of suites) {
    const text = code(join('tests', f));
    if (f !== 'pista-kart-park-scene.test.ts') assert.ok(!imports(text).some(d => /^three/.test(d)), `NFR-0007: ${f} must not import three`);
    assert.ok(!rendering.test(text), `NFR-0007: ${f} must not render`);
  }
  const scene = code('src/trackScene.ts');
  assert.ok(!rendering.test(scene) && !uses(scene, 'document') && !uses(scene, 'window'), 'NFR-0007: trackScene.ts builds geometry only');
});
