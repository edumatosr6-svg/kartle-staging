// TEST-0006 — the handling telemetry of API-0001 2.0.0 field by field: the pure reading of the state (position and heading
// included, no drift field), the forcing condition, the surface, the wall contact, and the drift command that changes
// nothing in the bench sequences (strategy: telemetry, contract and integration, DES-0001, DES-0002, RULE-0001).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { initialManeuvers } from '../src/maneuvers';
import { getHandlingTelemetry, initialState, isForcing, nearest, STEP, step, TEST_PAD, testPadArea, WIDTH, type Input, type State } from '../src/physics';
import { getLapResult, startLap, stepLap } from '../src/lap';
import { COUNTDOWN_STEPS } from '../src/lapTiming';
import { BENCH_PARAMETERS, makeInput, straight, testPilot, type InputMode } from '../scripts/handlingBench';
import { syntheticReading } from './fixtures/trackFiles';
import { ARCADE_CONFIG, FIFTY_KMH_MPS, FINITE, INTEGER, MODES, SETUP_REF, trace, untilFirstResult } from './helpers/handling';

const TELEMETRY_KEYS = ['simStepCount', 'setupId', 'setupVersion', 'positionXM', 'positionZM', 'headingRad', 'speedMps', 'handling', 'sideslipRad', 'yawRateRadPerS', 'surface', 'wallContact', 'forcing'].sort();
const HANDLING = ['grip', 'understeer', 'oversteer', 'sliding'];
const keys = (o: object) => Object.keys(o).sort();
const forcingAfter = (speed: number, input: Input) => step(straight(speed), input, STEP, ARCADE_CONFIG, TEST_PAD).telemetry.forcing;

test('CHK-TEST-0006-01 the telemetry is a pure reading of the state with exactly the fields of API-0001, position and heading included and no drift field, from the initial state through every step of a lap up to its first result, and NO_STATE without a state', () => {
  // AC-US-0004-06
  const initial = getHandlingTelemetry(initialState(), SETUP_REF);
  assert.ok(!('code' in initial), 'AC-US-0004-06: the initial state must have a telemetry');
  if ('code' in initial) return;
  assert.deepEqual(keys(initial), TELEMETRY_KEYS, 'AC-US-0004-06: the telemetry must carry exactly the fields of API-0001');
  assert.deepEqual([initial.simStepCount, initial.speedMps, initial.handling, initial.surface, initial.wallContact, initial.forcing, initial.sideslipRad, initial.yawRateRadPerS], [0, 0, 'grip', 'ASPHALT', false, false, 0, 0], 'AC-US-0004-06: before the first step the kart is at rest, in grip, on the asphalt');
  assert.deepEqual([initial.positionXM, initial.positionZM, initial.headingRad], [initialState().x, initialState().z, initialState().heading], 'AC-US-0004-06: position and heading are those of the state');
  assert.deepEqual({ setupId: initial.setupId, setupVersion: initial.setupVersion }, SETUP_REF, 'AC-US-0004-06: the setup identity is the one passed by whoever started the lap');
  assert.deepEqual(getHandlingTelemetry(undefined, SETUP_REF), { code: 'NO_STATE' }, 'AC-US-0004-06: without a state the reading answers only NO_STATE');
  const reading = syntheticReading();
  if (reading.trackDataStatus !== 'COMPLETE') throw new Error('fixture: synthetic reading must be COMPLETE');
  const started = startLap(undefined, { lapKind: 'TRAINING', trackId: reading.trackId, trackVersion: reading.trackVersion, ...SETUP_REF }, reading, ARCADE_CONFIG);
  if (!started.ok) throw new Error(`fixture: startLap rejected: ${started.code}`);
  let lap = started.lap;
  for (let i = 0; i < COUNTDOWN_STEPS; i++) lap = stepLap(lap, { throttle: 0, brake: 0, steer: 0 });
  const pilot = testPilot(ARCADE_CONFIG);
  let i = 0;
  const ended = untilFirstResult(lap, pilot, 6000, (current) => {
    const t = getHandlingTelemetry(current.kart, SETUP_REF);
    if ('code' in t) throw new Error('AC-US-0004-06: a running lap must have a telemetry at every step');
    assert.deepEqual(keys(t), TELEMETRY_KEYS, `AC-US-0004-06: step ${i}: exactly the fields of API-0001`);
    assert.ok(FINITE(t.speedMps) && t.speedMps >= 0, `AC-US-0004-06: step ${i}: speedMps must be a non-negative number`);
    assert.ok(HANDLING.includes(t.handling), `AC-US-0004-06: step ${i}: handling must be one of the four states`);
    assert.ok(FINITE(t.sideslipRad) && t.sideslipRad >= 0 && FINITE(t.yawRateRadPerS), `AC-US-0004-06: step ${i}: sideslipRad is a modulus and yawRateRadPerS a number`);
    assert.ok(INTEGER(t.simStepCount) && t.simStepCount === current.stepCount, `AC-US-0004-06: step ${i}: simStepCount must be the step counter of the lap`);
    assert.deepEqual([t.positionXM, t.positionZM, t.headingRad], [current.kart.x, current.kart.z, current.kart.heading], `AC-US-0004-06: step ${i}: position and heading must be those of the state`);
    i++;
  });
  assert.ok(!('code' in getLapResult(ended.lap)), 'AC-US-0004-06: the test-pilot lap must give its first result');
  assert.ok(ended.steps > 1000, 'AC-US-0004-06: the lap must span more than a thousand steps');
});

test('CHK-TEST-0006-02 the forcing condition holds only with full throttle, full steer and more than 50 km/h at the start of the step; partial steer never forces', () => {
  // AC-US-0003-03
  const forcing: Input = { throttle: 1, brake: 0, steer: 1 };
  assert.equal(forcingAfter(13.88, forcing), false, 'AC-US-0003-03: at 13.88 m/s (below 50 km/h) the condition is false');
  assert.equal(forcingAfter(13.90, forcing), true, 'AC-US-0003-03: at 13.90 m/s (above 50 km/h) the condition is true');
  assert.equal(forcingAfter(FIFTY_KMH_MPS, forcing), false, 'AC-US-0003-03: at exactly 50 km/h the condition is false');
  assert.equal(forcingAfter(20, { ...forcing, steer: -1 }), true, 'AC-US-0003-03: full steer to the other side forces too');
  assert.equal(forcingAfter(20, { ...forcing, steer: 0.9 }), false, 'AC-US-0003-03: steer 0.9 never forces');
  assert.equal(forcingAfter(20, { ...forcing, steer: 1.5 }), true, 'AC-US-0003-03: a steer beyond the range is saturated to full');
  assert.equal(forcingAfter(20, { ...forcing, throttle: 0.99 }), false, 'AC-US-0003-03: throttle 0.99 never forces');
  assert.equal(forcingAfter(20, { ...forcing, throttle: 0 }), false, 'AC-US-0003-03: no throttle, no forcing');
  assert.equal(isForcing(straight(13.88), forcing), false, 'AC-US-0003-03: the public predicate agrees below 50 km/h');
  assert.equal(isForcing(straight(13.90), forcing), true, 'AC-US-0003-03: the public predicate agrees above 50 km/h');
  const partial = trace(straight(60 / 3.6), TEST_PAD, 240, () => ({ throttle: 1, brake: 0, steer: 0.9 }));
  assert.ok(partial.telemetry.every(t => !t.forcing), 'AC-US-0003-03: two seconds of steer 0.9 with full throttle at 60 km/h never force');
  assert.ok(partial.telemetry.every(t => t.handling === 'grip' || t.handling === 'understeer'), 'AC-US-0003-03: with partial steer the rear never lets go (E2E-03 rule)');
});

test('CHK-TEST-0006-03 wallContact is true only on the step of a contact: false when the kart rests against the wall and false everywhere on the open test pad, off the declared area included', () => {
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
  const pad = trace(straight(20), testPadArea(1), 600, () => ({ throttle: 1, brake: 0, steer: 1 }));
  assert.ok(pad.telemetry.every(t => !t.wallContact), 'AC-US-0004-05: the open test pad has no wall: wallContact is false on every step, off the area included');
  const firstOff = pad.telemetry.findIndex(t => t.surface === 'GRASS');
  assert.ok(firstOff >= 0 && firstOff < 12, `AC-US-0004-05: the run must leave a 1 m area within a few steps to prove it (first step off: ${firstOff})`);
  assert.ok(pad.telemetry.slice(0, firstOff).every(t => t.surface === 'ASPHALT'), 'AC-US-0004-05: inside the area the surface reads ASPHALT');
  assert.ok(Math.hypot(pad.states[firstOff].x, pad.states[firstOff].z) > 1, 'AC-US-0004-05: the first GRASS step lies outside the 1 m disc');
  const wide = trace(straight(20), testPadArea(BENCH_PARAMETERS.testAreaRadiusM), 600, () => ({ throttle: 1, brake: 0, steer: 1 }));
  assert.ok(wide.telemetry.every(t => !t.wallContact && t.surface === 'ASPHALT'), 'AC-US-0004-05: inside the declared bench area the full-steer run stays on asphalt with no wall');
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

// The bench sequences of STEER_RESPONSE (regulated throttle), CORNER_RADIUS and CORNER_TURN, replayed with the same Input
// and with the drift command held on every step: the state must be identical at every step.
function benchSequence(mode: InputMode, kind: 'STEER_RESPONSE' | 'CORNER_RADIUS' | 'CORNER_TURN', side: number, drift: boolean): State[] {
  const area = testPadArea(BENCH_PARAMETERS.testAreaRadiusM);
  const held = (i: Input): Input => (drift ? { ...i, drift: true } : i);
  if (kind === 'STEER_RESPONSE') {
    return trace(straight(FIFTY_KMH_MPS), area, 144, (i, s) => held(makeInput(mode, s.speed < FIFTY_KMH_MPS ? 1 : 0, 0, i < 72 ? side : 0))).states;
  }
  if (kind === 'CORNER_RADIUS') return trace(straight(70 / 3.6), area, 372, () => held(makeInput(mode, 1, 0, side))).states;
  return trace(straight(FIFTY_KMH_MPS), area, 240, () => held(makeInput(mode, 0, 0, side))).states;
}

test('CHK-TEST-0006-05 the steering, radius and turn sequences give the same state at every step with the drift command held, and the maneuver state never leaves its initial value', () => {
  // AC-US-0003-08
  for (const mode of MODES) for (const kind of ['STEER_RESPONSE', 'CORNER_RADIUS', 'CORNER_TURN'] as const) for (const side of [1, -1]) {
    const plain = benchSequence(mode, kind, side, false), held = benchSequence(mode, kind, side, true);
    assert.equal(held.length, plain.length, `AC-US-0003-08: ${mode} ${kind} side ${side}: both runs must last the same number of steps`);
    for (let i = 0; i < plain.length; i++) assert.deepEqual(held[i], plain[i], `AC-US-0003-08: ${mode} ${kind} side ${side}: step ${i + 1}: the drift command changed the state`);
    assert.ok(held.every(s => JSON.stringify(s.maneuvers) === JSON.stringify(initialManeuvers())), `AC-US-0003-08: ${mode} ${kind} side ${side}: no drift charge, combo, score or boost may build up`);
  }
});
