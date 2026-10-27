// TEST-0006 — the handling telemetry of API-0001 field by field: the pure reading of the state, the forcing condition,
// the surface, the wall contact (strategy: telemetry, contract, DES-0002, RULE-0001).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getHandlingTelemetry, initialState, isForcing, nearest, STEP, step, TEST_PAD, testPadArc, WIDTH, type Input, type State } from '../src/physics';
import { startLap, stepLap } from '../src/lap';
import { COUNTDOWN_STEPS } from '../src/lapTiming';
import { BENCH_PARAMETERS, straight, testPilot } from '../scripts/handlingBench';
import { syntheticReading } from './fixtures/trackFiles';
import { ARCADE_CONFIG, FIFTY_KMH_MPS, FINITE, INTEGER, SETUP_REF, trace } from './helpers/handling';

const TELEMETRY_KEYS = ['simStepCount', 'setupId', 'setupVersion', 'speedMps', 'handling', 'sideslipRad', 'yawRateRadPerS', 'surface', 'wallContact', 'forcing', 'driftActive'].sort();
const HANDLING = ['grip', 'understeer', 'oversteer', 'sliding'];
const keys = (o: object) => Object.keys(o).sort();
const forcingAfter = (speed: number, input: Input) => step(straight(speed), input, STEP, ARCADE_CONFIG, TEST_PAD).telemetry.forcing;

test('CHK-TEST-0006-01 the telemetry is a pure reading of the state with exactly the fields of API-0001, from the initial state through every step of a lap, and NO_STATE without a state', () => {
  // AC-US-0004-06
  const initial = getHandlingTelemetry(initialState(), SETUP_REF);
  assert.ok(!('code' in initial), 'AC-US-0004-06: the initial state must have a telemetry');
  if ('code' in initial) return;
  assert.deepEqual(keys(initial), TELEMETRY_KEYS, 'AC-US-0004-06: the telemetry must carry exactly the fields of API-0001');
  assert.deepEqual([initial.simStepCount, initial.speedMps, initial.handling, initial.surface, initial.wallContact, initial.forcing, initial.driftActive, initial.sideslipRad, initial.yawRateRadPerS], [0, 0, 'grip', 'ASPHALT', false, false, false, 0, 0], 'AC-US-0004-06: before the first step the kart is at rest, in grip, on the asphalt');
  assert.deepEqual({ setupId: initial.setupId, setupVersion: initial.setupVersion }, SETUP_REF, 'AC-US-0004-06: the setup identity is the one passed by whoever started the lap');
  assert.deepEqual(getHandlingTelemetry(undefined, SETUP_REF), { code: 'NO_STATE' }, 'AC-US-0004-06: without a state the reading answers only NO_STATE');
  const reading = syntheticReading();
  if (reading.trackDataStatus !== 'COMPLETE') throw new Error('fixture: synthetic reading must be COMPLETE');
  const started = startLap(undefined, { lapKind: 'TRAINING', trackId: reading.trackId, trackVersion: reading.trackVersion, ...SETUP_REF }, reading, ARCADE_CONFIG);
  if (!started.ok) throw new Error(`fixture: startLap rejected: ${started.code}`);
  let lap = started.lap;
  for (let i = 0; i < COUNTDOWN_STEPS; i++) lap = stepLap(lap, { throttle: 0, brake: 0, steer: 0 });
  const pilot = testPilot(ARCADE_CONFIG);
  let steps = 0;
  for (let i = 0; i < 6000 && lap.phase !== 'ENDED'; i++) {
    lap = stepLap(lap, pilot(lap));
    const t = getHandlingTelemetry(lap.kart, SETUP_REF);
    if ('code' in t) throw new Error('AC-US-0004-06: a running lap must have a telemetry at every step');
    assert.deepEqual(keys(t), TELEMETRY_KEYS, `AC-US-0004-06: step ${i}: exactly the fields of API-0001`);
    assert.ok(FINITE(t.speedMps) && t.speedMps >= 0, `AC-US-0004-06: step ${i}: speedMps must be a non-negative number`);
    assert.ok(HANDLING.includes(t.handling), `AC-US-0004-06: step ${i}: handling must be one of the four states`);
    assert.ok(FINITE(t.sideslipRad) && t.sideslipRad >= 0 && FINITE(t.yawRateRadPerS), `AC-US-0004-06: step ${i}: sideslipRad is a modulus and yawRateRadPerS a number`);
    assert.ok(INTEGER(t.simStepCount) && t.simStepCount === lap.stepCount, `AC-US-0004-06: step ${i}: simStepCount must be the step counter of the lap`);
    steps++;
  }
  assert.equal(lap.phase, 'ENDED', 'AC-US-0004-06: the test-pilot lap must end');
  assert.ok(steps > 1000, 'AC-US-0004-06: the lap must span more than a thousand steps');
});

test('CHK-TEST-0006-02 the forcing condition holds only with full throttle, full steer and more than 50 km/h at the start of the step; partial steer never forces', () => {
  // AC-US-0003-02
  const forcing: Input = { throttle: 1, brake: 0, steer: 1 };
  assert.equal(forcingAfter(13.88, forcing), false, 'AC-US-0003-02: at 13.88 m/s (below 50 km/h) the condition is false');
  assert.equal(forcingAfter(13.90, forcing), true, 'AC-US-0003-02: at 13.90 m/s (above 50 km/h) the condition is true');
  assert.equal(forcingAfter(FIFTY_KMH_MPS, forcing), false, 'AC-US-0003-02: at exactly 50 km/h the condition is false');
  assert.equal(forcingAfter(20, { ...forcing, steer: -1 }), true, 'AC-US-0003-02: full steer to the other side forces too');
  assert.equal(forcingAfter(20, { ...forcing, steer: 0.9 }), false, 'AC-US-0003-02: steer 0.9 never forces');
  assert.equal(forcingAfter(20, { ...forcing, steer: 1.5 }), true, 'AC-US-0003-02: a steer beyond the range is saturated to full');
  assert.equal(forcingAfter(20, { ...forcing, throttle: 0.99 }), false, 'AC-US-0003-02: throttle 0.99 never forces');
  assert.equal(forcingAfter(20, { ...forcing, throttle: 0 }), false, 'AC-US-0003-02: no throttle, no forcing');
  assert.equal(isForcing(straight(13.88), forcing), false, 'AC-US-0003-02: the public predicate agrees below 50 km/h');
  assert.equal(isForcing(straight(13.90), forcing), true, 'AC-US-0003-02: the public predicate agrees above 50 km/h');
  const partial = trace(straight(60 / 3.6), TEST_PAD, 240, () => ({ throttle: 1, brake: 0, steer: 0.9 }));
  assert.ok(partial.telemetry.every(t => !t.forcing), 'AC-US-0003-02: two seconds of steer 0.9 with full throttle at 60 km/h never force');
  assert.ok(partial.telemetry.every(t => t.handling === 'grip' || t.handling === 'understeer'), 'AC-US-0003-02: with partial steer the rear never lets go (E2E-03 rule)');
});

test('CHK-TEST-0006-03 wallContact is true only on the step of a contact: false when the kart rests against the wall and false everywhere on the test pad', () => {
  // AC-US-0004-05
  const s = initialState();
  const boundary = nearest(s);
  const limit = WIDTH / 2 + 8;
  const away = { x: Math.cos(s.heading), z: -Math.sin(s.heading) };
  const resting: State = { ...s, x: boundary.position.x + away.x * limit, z: boundary.position.z + away.z * limit };
  const idle: Input = { throttle: 0, brake: 0, steer: 0 };
  const after = step(resting, idle, STEP, ARCADE_CONFIG);
  const restingTelemetry = getHandlingTelemetry(after, SETUP_REF);
  assert.ok(!('code' in restingTelemetry) && restingTelemetry.wallContact === false, 'AC-US-0004-05: a kart at rest against the wall has no new contact');
  assert.equal(after.speed, 0, 'AC-US-0004-05: a kart at rest against the wall stays at rest');
  const pad = trace(straight(20), testPadArc(BENCH_PARAMETERS.arcRadiusM, BENCH_PARAMETERS.laneWidthM), 600, () => ({ throttle: 1, brake: 0, steer: 1 }));
  assert.ok(pad.telemetry.every(t => !t.wallContact), 'AC-US-0004-05: the test pad has no wall: wallContact is false on every step, off the lane included');
  assert.ok(pad.telemetry.some(t => t.surface === 'GRASS'), 'AC-US-0004-05: the run must leave the lane of the test pad to prove it');
});

test('CHK-TEST-0006-04 the surface of the telemetry follows the environment: asphalt, then grass, then asphalt again', () => {
  // AC-US-0004-06
  const boundary = { surfaceAt: (p: { x: number }) => p.x > 0 ? 'grass' as const : 'asphalt' as const, walls: false };
  const start: State = { ...initialState(), x: -3, z: 0, heading: Math.PI / 2, vx: 10, vz: 0, speed: 10 };
  const across = trace(start, boundary, 120, () => ({ throttle: 0.5, brake: 0, steer: 0 }));
  const surfaces = across.telemetry.map(t => t.surface);
  assert.equal(surfaces[0], 'ASPHALT', 'AC-US-0004-06: the kart starts on the asphalt');
  assert.ok(surfaces.includes('GRASS'), 'AC-US-0004-06: the kart must cross onto the grass');
  const firstGrass = surfaces.indexOf('GRASS');
  assert.ok(surfaces.slice(0, firstGrass).every(v => v === 'ASPHALT') && surfaces.slice(firstGrass).every(v => v === 'GRASS'), 'AC-US-0004-06: the surface changes once, at the boundary');
  assert.ok(across.states[firstGrass].x > 0 && across.states[firstGrass - 1].x <= 0, 'AC-US-0004-06: the change happens exactly when the kart crosses x = 0');
  const back = trace(across.states[across.states.length - 1], { surfaceAt: () => 'asphalt', walls: false }, 1, () => ({ throttle: 0, brake: 0, steer: 0 }));
  assert.equal(back.telemetry[0].surface, 'ASPHALT', 'AC-US-0004-06: back on the asphalt the surface reads ASPHALT');
});
