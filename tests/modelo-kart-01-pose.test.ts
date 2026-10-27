// TEST-0002 — the kart state read for display (API-0001), the wheel spin after a known number of steps (WHEEL_SPIN),
// the reference point of RULE-0003 and the telemetry wheel positions against wheelPositions (strategy: pose, DES-0002,
// DES-0006). Every time is a number of steps; the simulation is advanced with STEP through src/lap.ts.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { ARCADE_KART, wheelPositions, type KartConfig, type State } from '../src/physics';
import { pauseLap, repositionKart, stepLap } from '../src/lap';
import { toMs } from '../src/lapTiming';
import { buildKart01Model, KART01_WHEELBASE_M } from '../src/kart01Model';
import { advanceWheelSpin, getKartPose, initialWheelSpin, modelOffsetForwardM, rollingSpeedMps, simWheelGroundPositions, WHEEL_NAMES, type KartPose } from '../src/kartPose';
import { syntheticReading } from './fixtures/trackFiles';
import { autopilot, completeLap, drive, runCountdown, startSession } from './helpers/autopilot';
import { judgeWheelSpin, modelToWorld, moving, serializeRecord, telemetryWheelPositionsCheck, wheelSpinCheck, wheelWorldPoints } from './helpers/kart01Report';

const reading = syntheticReading();
const near = (a: number, b: number, tol: number) => Math.abs(a - b) <= tol;
const poseOf = (state: State): KartPose => { const p = getKartPose(state); if ('code' in p) throw new Error(p.code); return p; };
const SPEEDS = [10, -10, 0];
const STEPS = 120;
const spinRecords = SPEEDS.map(v => wheelSpinCheck(v, STEPS));

test('CHK-TEST-0002-01 the displayed steering angle is the steering the simulation reports, and no state gives NO_STATE', () => {
  // AC-US-0002-01
  for (const steering of [0, 0.2, -0.2]) {
    const state = { ...moving(10), steering };
    assert.equal(poseOf(state).steerAngleRad, state.steering, `AC-US-0002-01: steerAngleRad must be the simulation steering (${steering})`);
  }
  assert.deepEqual(getKartPose(undefined), { code: 'NO_STATE' }, 'AC-US-0002-01: without a state the pose is NO_STATE');
});

test('CHK-TEST-0002-02 after 120 steps at 10, -10 and 0 m/s each wheel spun exactly speed x time / (pi x diameter) revolutions, in the direction of travel', (t) => {
  // AC-US-0002-02
  for (const record of spinRecords) t.diagnostic(serializeRecord(record));
  assert.equal(spinRecords.length, 3, 'AC-US-0002-02: three speeds are tried');
  for (const record of spinRecords) {
    assert.equal(record.checkStepCount, STEPS, 'AC-US-0002-02: the known number of steps is 120');
    assert.equal(record.simulatedTimeMs, toMs(STEPS), 'AC-US-0002-02: the simulated time is 120 x STEP in ms');
    assert.equal(record.simulatedTimeMs, 1000, 'AC-US-0002-02: 120 steps are 1000 ms');
    assert.equal(record.wheels.length, 4, 'AC-US-0002-02: one entry per wheel');
    for (const w of record.wheels) {
      const expected = record.rollingSpeedMps * (record.simulatedTimeMs / 1000) / (Math.PI * w.diameterM);
      assert.equal(w.expectedSpinRevs, expected, `AC-US-0002-02: expectedSpinRevs of ${w.groupName} is the rolling rate times the time`);
      assert.equal(w.spinRevs, w.expectedSpinRevs, `AC-US-0002-02: ${w.groupName} must spin exactly the expected revolutions at ${record.rollingSpeedMps} m/s`);
      assert.equal(Math.sign(w.spinRevs), Math.sign(record.rollingSpeedMps), `AC-US-0002-02: ${w.groupName} spins in the direction of travel`);
    }
    assert.equal(record.verdict, 'PASS', `AC-US-0002-02: WHEEL_SPIN at ${record.rollingSpeedMps} m/s must be PASS`);
  }
  const front = spinRecords[0].wheels.filter(w => w.groupName.startsWith('rodaDianteira')), rear = spinRecords[0].wheels.filter(w => w.groupName.startsWith('rodaTraseira'));
  for (const w of front) assert.equal(w.diameterM, 0.26, 'AC-US-0002-02: the front wheels roll on 0.26 m');
  for (const w of rear) assert.equal(w.diameterM, 0.28, 'AC-US-0002-02: the rear wheels roll on 0.28 m');
  assert.ok(spinRecords.some(r => r.rollingSpeedMps > 0) && spinRecords.some(r => r.rollingSpeedMps === 0), 'AC-US-0002-02: a record with speed above 0 and one at 0 exist');
  assert.equal(rollingSpeedMps(moving(-10)), -10, 'AC-US-0002-02: reverse travel is a negative rolling speed');
});

test('CHK-TEST-0002-03 the spin advances only with the step counter: no step gives the same object, a counter that went back resets without spinning, and two frames equal one', () => {
  // AC-US-0002-02
  const spin0 = initialWheelSpin();
  const same = advanceWheelSpin(spin0, poseOf(moving(10, 0)));
  assert.equal(same, spin0, 'AC-US-0002-02: a frame without a new step returns the same spin object');
  const spun = advanceWheelSpin(spin0, poseOf(moving(10, 60)));
  assert.ok(spun.revs.rodaDianteiraEsq > 0, 'AC-US-0002-02: 60 steps at 10 m/s spin the wheel');
  const reset = advanceWheelSpin(spun, poseOf(moving(10, 5)));
  assert.equal(reset.simStepCount, 5, 'AC-US-0002-02: a counter that went backwards is adopted');
  assert.deepEqual(reset.revs, spun.revs, 'AC-US-0002-02: a counter that went backwards never spins the wheels');
  const twoFrames = advanceWheelSpin(advanceWheelSpin(spin0, poseOf(moving(10, 60))), poseOf(moving(10, 120)));
  const oneFrame = advanceWheelSpin(spin0, poseOf(moving(10, 120)));
  for (const name of WHEEL_NAMES) assert.equal(twoFrames.revs[name], oneFrame.revs[name], `AC-US-0002-02: two frames of 60 steps equal one of 120 for ${name}`);
  const flipped = judgeWheelSpin({ ...spinRecords[0], wheels: spinRecords[0].wheels.map(w => ({ ...w, spinRevs: -w.spinRevs })) });
  assert.equal(flipped.verdict === 'FAIL' && flipped.checkFailReason, 'SPIN_MISMATCH', 'AC-US-0002-02: a spin of the opposite sign is SPIN_MISMATCH');
  const off = judgeWheelSpin({ ...spinRecords[0], wheels: spinRecords[0].wheels.map((w, i) => ({ ...w, spinRevs: i === 2 ? w.spinRevs + 1e-9 : w.spinRevs })) });
  assert.equal(off.verdict, 'FAIL', 'AC-US-0002-02: a spin that differs in one wheel is FAIL');
});

test('CHK-TEST-0002-04 the pose carries the simulation position, and the reference offset puts the model axles within 6 mm of the simulation axles', () => {
  // AC-US-0002-05
  const state = { ...moving(5), x: 12.5, z: -3.25 };
  const pose = poseOf(state);
  assert.equal(pose.xM, state.x, 'AC-US-0002-05: xM is the simulation x');
  assert.equal(pose.zM, state.z, 'AC-US-0002-05: zM is the simulation z');
  assert.equal(pose.simStepCount, state.stepCount, 'AC-US-0002-05: simStepCount is the simulation step count');
  const offset = modelOffsetForwardM(ARCADE_KART.frontWeight, KART01_WHEELBASE_M);
  assert.ok(near(offset, 0.084, 1e-12), `AC-US-0002-05: the offset for frontWeight 0.42 and 1.05 m is 0.084 m (${offset})`);
  const sim = wheelPositions(ARCADE_KART);
  const modelFrontAxle = offset + KART01_WHEELBASE_M / 2, modelRearAxle = offset - KART01_WHEELBASE_M / 2;
  assert.equal(Math.round(Math.abs(modelFrontAxle - sim[0].forward) * 1000), 6, 'AC-US-0002-05: the model front axle is 0.006 m from the simulation front axle');
  assert.equal(Math.round(Math.abs(modelRearAxle - sim[2].forward) * 1000), 4, 'AC-US-0002-05: the model rear axle is 0.004 m from the simulation rear axle');
  assert.ok(near(modelOffsetForwardM(0.5, KART01_WHEELBASE_M), 0, 1e-12), 'AC-US-0002-05: a centred weight gives no offset');
});

test('CHK-TEST-0002-05 in a real session the pose after k steps is the state of step k, one step per frame, never an intermediate one', () => {
  // AC-US-0002-05
  const states: State[] = [];
  const { lap } = drive(runCountdown(startSession(reading)), autopilot(), 300, (_before, after) => states.push(after.kart));
  assert.equal(states.length, 300, 'AC-US-0002-05: 300 steps were applied');
  states.forEach((state, i) => {
    const pose = poseOf(state);
    assert.equal(pose.simStepCount, i + 1, `AC-US-0002-05: the frame after step ${i + 1} reports step ${i + 1}`);
    assert.equal(pose.xM, state.x, `AC-US-0002-05: xM at step ${i + 1} is the state x`);
    assert.equal(pose.zM, state.z, `AC-US-0002-05: zM at step ${i + 1} is the state z`);
    assert.equal(pose.headingRad, state.heading, `AC-US-0002-05: headingRad at step ${i + 1} is the state heading`);
  });
  assert.deepEqual(poseOf(lap.kart), poseOf(states[299]), 'AC-US-0002-05: the session pose is the pose of the last completed step');
  assert.ok(Math.hypot(states[299].x - states[0].x, states[299].z - states[0].z) > 1, 'AC-US-0002-05: the kart moved during the 300 steps');
});

test('CHK-TEST-0002-06 while paused the simulation does not advance: two frames give the same pose and the wheels do not spin', () => {
  // AC-US-0002-05
  const running = drive(runCountdown(startSession(reading)), autopilot(), 200).lap;
  const paused = pauseLap(running, 'ESC_KEY');
  assert.ok(paused.ok, 'AC-US-0002-05: the running lap can be paused');
  if (!paused.ok) return;
  const frame1 = stepLap(paused.lap, { throttle: 1, brake: 0, steer: 1 });
  const frame2 = stepLap(frame1, { throttle: 1, brake: 0, steer: 1 });
  assert.deepEqual(poseOf(frame2.kart), poseOf(frame1.kart), 'AC-US-0002-05: two paused frames give the same pose');
  assert.deepEqual(poseOf(frame1.kart), poseOf(running.kart), 'AC-US-0002-05: the paused pose is the last reported pose');
  const spin = advanceWheelSpin(initialWheelSpin(), poseOf(running.kart));
  assert.equal(advanceWheelSpin(spin, poseOf(frame2.kart)), spin, 'AC-US-0002-05: the wheels do not spin while paused');
});

test('CHK-TEST-0002-07 the first frame after a reposition shows the new position and heading, and the spin counter restarts without spinning', () => {
  // AC-US-0002-05, AC-US-0002-06
  const running = drive(runCountdown(startSession(reading, 'TRAINING')), autopilot(), 240).lap;
  const before = poseOf(running.kart);
  const spin = advanceWheelSpin(initialWheelSpin(), before);
  const moved = repositionKart(running);
  assert.ok(moved.ok, 'AC-US-0002-05: a training lap can be repositioned');
  if (!moved.ok) return;
  const after = poseOf(moved.lap.kart);
  assert.equal(after.xM, moved.lap.kart.x, 'AC-US-0002-05: the first reading is the new x');
  assert.equal(after.zM, moved.lap.kart.z, 'AC-US-0002-05: the first reading is the new z');
  assert.equal(after.headingRad, moved.lap.kart.heading, 'AC-US-0002-06: the first reading is the new heading');
  assert.ok(Math.hypot(after.xM - before.xM, after.zM - before.zM) > 0.01 || Math.abs(after.headingRad - before.headingRad) > 1e-6, 'AC-US-0002-05: the reposition moved or turned the kart');
  assert.equal(after.rollingSpeedMps, 0, 'AC-US-0002-05: the repositioned kart is at rest');
  const restarted = advanceWheelSpin(spin, after);
  assert.equal(restarted.simStepCount, after.simStepCount, 'AC-US-0002-05: the spin adopts the restarted counter');
  assert.deepEqual(restarted.revs, spin.revs, 'AC-US-0002-05: the restarted counter spins nothing');
});

test('CHK-TEST-0002-08 the displayed heading is the heading the simulation reports', () => {
  // AC-US-0002-06
  for (const heading of [0, 1.25, -2.5, Math.PI]) {
    const state = { ...moving(3), heading };
    assert.equal(poseOf(state).headingRad, heading, `AC-US-0002-06: headingRad must be the simulation heading (${heading})`);
  }
});

test('CHK-TEST-0002-09 the ground positions of the four simulation wheels are wheelPositions(config) carried by the pose, value for value', () => {
  // AC-US-0005-01
  const pose: KartPose = { simStepCount: 7, xM: 4.5, zM: -2.25, headingRad: 0.7, steerAngleRad: 0.1, rollingSpeedMps: 8 };
  const config: KartConfig = { ...ARCADE_KART, trackWidth: 1.3, wheelbase: 1.1 };
  const points = simWheelGroundPositions(pose, config);
  const direct = wheelWorldPoints(pose, config);
  assert.equal(points.length, 4, 'AC-US-0005-01: four wheel points');
  points.forEach((p, i) => {
    assert.equal(p.xM, direct[i].xM, `AC-US-0005-01: wheel ${i} xM is the transformed wheelPositions value`);
    assert.equal(p.zM, direct[i].zM, `AC-US-0005-01: wheel ${i} zM is the transformed wheelPositions value`);
  });
  const dx = points[0].xM - points[1].xM, dz = points[0].zM - points[1].zM;
  assert.ok(near(Math.hypot(dx, dz), config.trackWidth, 1e-12), 'AC-US-0005-01: the front points are one simulation track apart');
  const rearMid = { x: (points[2].xM + points[3].xM) / 2, z: (points[2].zM + points[3].zM) / 2 };
  assert.ok(near(Math.hypot(rearMid.x - pose.xM, rearMid.z - pose.zM), config.wheelbase * config.frontWeight, 1e-12), 'AC-US-0005-01: the rear axle is frontWeight x wheelbase behind the position');
});

test('CHK-TEST-0002-10 over a whole lap the telemetry wheel positions equal wheelPositions at every step, and the model rear wheels sit 3 cm inside them', (t) => {
  // NFR-0007, AC-US-0005-01
  const trace: { pose: KartPose; config: KartConfig }[] = [];
  const { lap } = completeLap(reading, 'OFFICIAL', autopilot(), (_before, after) => trace.push({ pose: poseOf(after.kart), config: after.config }));
  assert.equal(lap.phase, 'ENDED', 'NFR-0007: the reference lap completes');
  const record = telemetryWheelPositionsCheck(trace);
  t.diagnostic(serializeRecord(record));
  assert.equal(record.comparedStepCount, trace.length, 'NFR-0007: every step of the lap is compared');
  assert.ok(record.comparedStepCount > 1000, 'NFR-0007: a whole lap has more than 1000 steps');
  assert.equal(record.differingValueCount, 0, 'NFR-0007: the telemetry wheel positions must equal wheelPositions at every step');
  assert.equal(record.verdict, 'PASS', 'NFR-0007: TELEMETRY_WHEEL_POSITIONS must be PASS');
  const model = buildKart01Model();
  model.root.updateMatrixWorld(true);
  const rearCentres = (['rodaTraseiraEsq', 'rodaTraseiraDir'] as const).map(name => new THREE.Vector3().setFromMatrixPosition(model.wheels[name].steer.matrixWorld));
  for (let i = 0; i < trace.length; i += 97) {
    const { pose, config } = trace[i];
    const sim = simWheelGroundPositions(pose, config).slice(2);
    const toWorld = modelToWorld(pose, modelOffsetForwardM(config.frontWeight, KART01_WHEELBASE_M));
    const fwd = { x: Math.sin(pose.headingRad), z: Math.cos(pose.headingRad) }, left = { x: Math.cos(pose.headingRad), z: -Math.sin(pose.headingRad) };
    for (const centre of rearCentres) {
      const w = centre.clone().applyMatrix4(toWorld);
      const nearest = sim.reduce((best, p) => Math.hypot(p.xM - w.x, p.zM - w.z) < Math.hypot(best.xM - w.x, best.zM - w.z) ? p : best);
      const dx = nearest.xM - w.x, dz = nearest.zM - w.z;
      assert.equal(Math.round(Math.abs(dx * left.x + dz * left.z) * 100), 3, `NFR-0007: at step ${i} the model rear wheel is 0.03 m inside the simulation wheel point laterally`);
      assert.equal(Math.round(Math.abs(dx * fwd.x + dz * fwd.z) * 100), 0, `NFR-0007: at step ${i} the model rear wheel is within a centimetre of the simulation point forward`);
    }
  }
});
