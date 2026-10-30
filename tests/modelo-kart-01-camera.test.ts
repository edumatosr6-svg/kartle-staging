// TEST-0003 — the game camera (API-0003, RULE-0002) over real sessions of src/lap.ts frame by frame: the race pose, the
// field of view per shape of the play area (no turbo field any more), the overview before the countdown, the descent
// during it, the kart inside the frame in a 90-degree curve, the camera behind the frozen kart after an official lap ends
// and behind the moving kart after a training lap ends (strategy: camera, DES-0003, DES-0006). Pure math: no renderer, the model only for the projected corners.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { ARCADE_KART, PUBLISHED_SETUPS, track, WIDTH, type Input, type State } from '../src/physics';
import { getLapResult, getLapState, listLapResults, pauseLap, repositionKart, resumeLap, startLap, stepLap, type LapKind, type LapSession, type LapStateView } from '../src/lap';
import { COUNTDOWN_MS, COUNTDOWN_STEPS } from '../src/lapTiming';
import {
  computeCameraView, decideCameraMode, horizontalFovDeg, raceChasePose, shapeVerticalFovDeg, trackBoundsOf, trackOverviewPose, viewShapeOf,
  type CameraPose, type CameraView,
} from '../src/gameCamera';
import { getKartPose, modelOffsetForwardM, type KartPose } from '../src/kartPose';
import { buildKart01Model, KART01_WHEELBASE_M } from '../src/kart01Model';
import { syntheticReading } from './fixtures/trackFiles';
import { autopilot, completeLap, drive, IDLE, runCountdown, seedLap, startSession } from './helpers/autopilot';
import { modelExtremePoints, modelToWorld, moving, projectPoint, sourceText, stripComments } from './helpers/kart01Report';

const reading = syntheticReading();
const bounds = trackBoundsOf(track, WIDTH / 2 + 1);
const LANDSCAPE = [1280, 720] as const, SQUARE = [1000, 1000] as const, FOUR_THREE = [1200, 900] as const, THREE_FOUR = [900, 1200] as const, PORTRAIT = [720, 1280] as const;
const AREAS = [LANDSCAPE, SQUARE, FOUR_THREE, THREE_FOUR, PORTRAIT] as const;
type Area = readonly [number, number];
const near = (a: number, b: number, tol: number) => Math.abs(a - b) <= tol;
const wrap = (rad: number) => Math.atan2(Math.sin(rad), Math.cos(rad));
const poseOf = (state: State): KartPose => { const p = getKartPose(state); if ('code' in p) throw new Error(p.code); return p; };
const viewOf = (lap: LapSession | undefined, area: Area = LANDSCAPE): CameraView => {
  const view = computeCameraView({ lapState: getLapState(lap), kartPose: lap ? getKartPose(lap.kart) : { code: 'NO_STATE' }, viewWidthPx: area[0], viewHeightPx: area[1], trackBounds: bounds });
  if ('code' in view) throw new Error(view.code);
  return view;
};
const viewOfPose = (lapState: LapStateView | { code: 'NO_ACTIVE_LAP' }, pose: KartPose, area: Area): CameraView => {
  const view = computeCameraView({ lapState, kartPose: pose, viewWidthPx: area[0], viewHeightPx: area[1], trackBounds: bounds });
  if ('code' in view) throw new Error(view.code);
  return view;
};
const cameraPoseOf = (v: CameraView): CameraPose => ({ cameraXM: v.cameraXM, cameraZM: v.cameraZM, cameraHeightM: v.cameraHeightM, aimXM: v.aimXM, aimZM: v.aimZM, aimHeightM: v.aimHeightM });
const aimDirection = (v: CameraView) => Math.atan2(v.aimXM - v.cameraXM, v.aimZM - v.cameraZM);
type Frame = { lap: LapSession; pose: KartPose; view: CameraView };

// Sessions: 300 running steps, a lap ended by completion, a lap ended by reposition (three frames each, the simulation
// stopped), and the 90-degree curve at 50 km/h.
const running: Frame[] = [];
drive(runCountdown(startSession(reading)), autopilot(), 300, (_b, after) => running.push({ lap: after, pose: poseOf(after.kart), view: viewOf(after) }));
const endedFrames = (lap: LapSession): Frame[] => {
  const frames: Frame[] = [];
  for (let i = 0; i < 3; i++) { frames.push({ lap, pose: poseOf(lap.kart), view: viewOf(lap) }); lap = stepLap(lap, { throttle: 1, brake: 0, steer: 1 }); }
  return frames;
};
const completed = completeLap(reading, 'OFFICIAL', autopilot()).lap;
const repositionedResult = repositionKart(drive(runCountdown(startSession(reading)), autopilot(), 100).lap);
const repositioned = repositionedResult.ok ? repositionedResult.lap : undefined;
const endedByCompletion = endedFrames(completed);
const endedByReposition = repositioned ? endedFrames(repositioned) : [];
const raceFrames = [...running, ...endedByCompletion, ...endedByReposition];

function curve90(): Frame[] {
  const started = runCountdown(startSession(reading, 'TRAINING', PUBLISHED_SETUPS.ARCADE_ASSISTIDO.config));
  const v = 50 / 3.6;
  let lap = seedLap(started, { kart: { vx: v * Math.sin(started.kart.heading), vz: v * Math.cos(started.kart.heading), speed: v } });
  const h0 = lap.kart.heading;
  const frames: Frame[] = [];
  for (let i = 0; i < 2000 && lap.phase === 'RUNNING'; i++) {
    lap = stepLap(lap, { throttle: 1, brake: 0, steer: 1 });
    frames.push({ lap, pose: poseOf(lap.kart), view: viewOf(lap) });
    if (Math.abs(wrap(lap.kart.heading - h0)) >= Math.PI / 2) break;
  }
  return frames;
}
const curve = curve90();

test('CHK-TEST-0003-01 in every race frame, running or ended, the camera is 1.38 m above the ground in RACE_CHASE', () => {
  // AC-US-0003-01
  assert.equal(running.length, 300, 'AC-US-0003-01: 300 running frames were collected');
  assert.ok(endedByReposition.length === 3, 'AC-US-0003-01: the reposition ended the official lap');
  for (const { view } of raceFrames) {
    assert.equal(view.cameraMode, 'RACE_CHASE', 'AC-US-0003-01: a race frame is RACE_CHASE');
    assert.equal(view.cameraHeightM, 1.38, 'AC-US-0003-01: the camera height must be 1.38 m');
  }
  assert.ok(raceFrames.every(f => f.view.cameraMode !== 'TRACK_OVERVIEW'), 'AC-US-0003-01: no race frame is the overview');
});

test('CHK-TEST-0003-02 in every race frame the camera is 3.05 m behind the kart position, measured on the ground along the heading', () => {
  // AC-US-0003-02
  for (const { pose, view } of raceFrames) {
    const dx = view.cameraXM - pose.xM, dz = view.cameraZM - pose.zM;
    assert.ok(near(Math.hypot(dx, dz), 3.05, 1e-9), `AC-US-0003-02: the camera must be 3.05 m from the kart on the ground (${Math.hypot(dx, dz)})`);
    assert.ok(near(dx, -3.05 * Math.sin(pose.headingRad), 1e-9) && near(dz, -3.05 * Math.cos(pose.headingRad), 1e-9), 'AC-US-0003-02: the camera must sit opposite the heading');
  }
});

test('CHK-TEST-0003-03 in every race frame the camera aims 3.2 m ahead of the kart along the heading, 0.30 m above the ground', () => {
  // AC-US-0003-03
  for (const { pose, view } of raceFrames) {
    assert.equal(view.aimHeightM, 0.30, 'AC-US-0003-03: the aim height must be 0.30 m');
    assert.ok(near(view.aimXM - pose.xM, 3.2 * Math.sin(pose.headingRad), 1e-9) && near(view.aimZM - pose.zM, 3.2 * Math.cos(pose.headingRad), 1e-9), 'AC-US-0003-03: the aim must be 3.2 m ahead along the heading');
  }
});

test('CHK-TEST-0003-04 in landscape the vertical field of view is 62 degrees at any speed and with any command, and no view carries a turbo field', () => {
  // AC-US-0003-04
  assert.equal(viewShapeOf(1280, 720), 'LANDSCAPE', 'AC-US-0003-04: 1280 x 720 is landscape');
  assert.equal(viewShapeOf(1000, 1000), 'LANDSCAPE', 'AC-US-0003-04: a square play area follows the landscape rule');
  const lapState = getLapState(running[0].lap);
  for (const v of [0, 25]) {
    for (const area of [LANDSCAPE, SQUARE, FOUR_THREE]) {
      const view = viewOfPose(lapState, poseOf(moving(v)), area);
      assert.equal(view.verticalFovDeg, 62, `AC-US-0003-04: vertical FOV must be 62 degrees at ${v} m/s in ${area.join('x')}`);
      assert.ok(near(view.horizontalFovDeg, horizontalFovDeg(62, area[0] / area[1]), 1e-9), 'AC-US-0003-04: the horizontal FOV follows from 62 degrees and the aspect');
    }
  }
  for (const aspect of [1, 16 / 9, 21 / 9]) assert.equal(shapeVerticalFovDeg('LANDSCAPE', aspect), 62, `AC-US-0003-04: a landscape of aspect ${aspect.toFixed(3)} keeps 62 degrees`);
  // A real session driven with full throttle and the drift command in alternate stretches (the commands that used to
  // fire the drift and the turbo), from rest to the top speed of the published setup (25 m/s is reached only by the
  // moving(25) pose above: arcade-assistido-v6 tops out near 16 m/s on the synthetic track).
  const commands = (i: number): Input => ({ throttle: 1, brake: 0, steer: 0, drift: Math.floor(i / 60) % 2 === 1 });
  let lap = runCountdown(startSession(reading, 'TRAINING', PUBLISHED_SETUPS.ARCADE_ASSISTIDO.config));
  let topSpeedMps = 0;
  const views: CameraView[] = [viewOf(undefined), viewOf(startSession(reading))];
  for (let i = 0; i < 1500 && lap.phase === 'RUNNING'; i++) {
    lap = stepLap(lap, commands(i));
    const view = viewOf(lap);
    topSpeedMps = Math.max(topSpeedMps, lap.kart.speed);
    assert.equal(view.verticalFovDeg, 62, `AC-US-0003-04: step ${i} (${lap.kart.speed.toFixed(1)} m/s, drift command ${commands(i).drift}) keeps 62 degrees`);
    views.push(view);
  }
  assert.ok(topSpeedMps > 15, `AC-US-0003-04: the session reached the top speed of the setup on the straight, more than 15 m/s (${topSpeedMps.toFixed(1)})`);
  for (const view of views) {
    assert.ok(!('baseVerticalFovDeg' in view) && !('turboFovDeltaDeg' in view), `AC-US-0003-04: a ${view.cameraMode} view carries no baseVerticalFovDeg nor turboFovDeltaDeg`);
  }
});

test('CHK-TEST-0003-05 in portrait the horizontal field of view is at least 60 degrees', () => {
  // AC-US-0003-05
  assert.equal(viewShapeOf(720, 1280), 'PORTRAIT', 'AC-US-0003-05: 720 x 1280 is portrait');
  assert.equal(viewShapeOf(900, 1200), 'PORTRAIT', 'AC-US-0003-05: 900 x 1200 is portrait');
  const lapState = getLapState(running[0].lap);
  for (const area of [PORTRAIT, THREE_FOUR]) {
    const view = viewOfPose(lapState, running[10].pose, area);
    assert.ok(view.horizontalFovDeg >= 60 - 1e-9, `AC-US-0003-05: horizontal FOV must be at least 60 degrees in ${area.join('x')} (${view.horizontalFovDeg})`);
    assert.ok(near(view.horizontalFovDeg, 60, 1e-9), `AC-US-0003-05: the smallest portrait field gives exactly 60 degrees horizontally in ${area.join('x')}`);
  }
});

test('CHK-TEST-0003-06 in portrait the vertical field of view never falls below 62 degrees, and a shape change applies in the next frame without moving the pose', () => {
  // AC-US-0003-06
  const lapState = getLapState(running[0].lap);
  const pose = running[10].pose;
  const portrait = viewOfPose(lapState, pose, PORTRAIT), threeFour = viewOfPose(lapState, pose, THREE_FOUR);
  assert.ok(portrait.verticalFovDeg >= 62, `AC-US-0003-06: 9:16 vertical FOV must be at least 62 degrees (${portrait.verticalFovDeg})`);
  assert.ok(threeFour.verticalFovDeg >= 62, `AC-US-0003-06: 3:4 vertical FOV must be at least 62 degrees (${threeFour.verticalFovDeg})`);
  assert.equal(Math.round(portrait.verticalFovDeg * 10), 915, 'AC-US-0003-06: 9:16 gives 91.5 degrees vertically');
  assert.equal(Math.round(threeFour.verticalFovDeg * 10), 752, 'AC-US-0003-06: 3:4 gives 75.2 degrees vertically');
  const landscape = viewOfPose(lapState, pose, LANDSCAPE);
  assert.deepEqual(cameraPoseOf(portrait), cameraPoseOf(landscape), 'AC-US-0003-06: the race pose does not change with the shape');
  assert.equal(portrait.viewShape, 'PORTRAIT', 'AC-US-0003-06: the frame after the change carries the new shape');
  assert.notEqual(portrait.verticalFovDeg, landscape.verticalFovDeg, 'AC-US-0003-06: the field of view is the one of the new shape');
  assert.ok(shapeVerticalFovDeg('PORTRAIT', 0.99) >= 62, 'AC-US-0003-06: a barely portrait area still keeps 62 degrees');
});

test('CHK-TEST-0003-07 between consecutive frames the aim direction turns exactly as much as the kart heading, in a curve and across a reposition', () => {
  // AC-US-0003-07
  assert.ok(curve.length > 10, 'AC-US-0003-07: the curve has frames');
  for (let i = 1; i < curve.length; i++) {
    const dAim = wrap(aimDirection(curve[i].view) - aimDirection(curve[i - 1].view));
    const dHeading = wrap(curve[i].pose.headingRad - curve[i - 1].pose.headingRad);
    assert.ok(near(dAim, dHeading, 1e-12), `AC-US-0003-07: at curve frame ${i} the aim must turn by the heading change (${dAim} vs ${dHeading})`);
  }
  assert.ok(Math.abs(wrap(curve[curve.length - 1].pose.headingRad - curve[0].pose.headingRad)) > 1, 'AC-US-0003-07: the heading really turned during the curve');
  const before = drive(runCountdown(startSession(reading, 'TRAINING')), autopilot(), 240).lap;
  const moved = repositionKart(before);
  assert.ok(moved.ok, 'AC-US-0003-07: the training lap can be repositioned');
  if (!moved.ok) return;
  const dAim = wrap(aimDirection(viewOf(moved.lap)) - aimDirection(viewOf(before)));
  const dHeading = wrap(moved.lap.kart.heading - before.kart.heading);
  assert.ok(near(dAim, dHeading, 1e-12), 'AC-US-0003-07: across a reposition the aim turns exactly by the heading change');
});

test('CHK-TEST-0003-08 in a 90-degree curve at 50 km/h the whole kart with the pilot stays inside the frame, in landscape and in portrait', () => {
  // AC-US-0003-08
  const model = buildKart01Model();
  const points = modelExtremePoints(model);
  assert.equal(points.length, 9, 'AC-US-0003-08: eight box corners and the helmet top are projected');
  assert.ok(curve.some(f => f.pose.rollingSpeedMps * 3.6 >= 50), 'AC-US-0003-08: the curve is driven at 50 km/h');
  const offset = modelOffsetForwardM(PUBLISHED_SETUPS.ARCADE_ASSISTIDO.config.frontWeight, KART01_WHEELBASE_M);
  for (const area of [LANDSCAPE, PORTRAIT]) {
    for (const [i, frame] of curve.entries()) {
      const view = viewOfPose(getLapState(frame.lap), frame.pose, area);
      const toWorld = modelToWorld(frame.pose, offset);
      for (const point of points) {
        const ndc = projectPoint(view, point.clone().applyMatrix4(toWorld));
        assert.ok(Math.abs(ndc.x) <= 1 && Math.abs(ndc.y) <= 1 && ndc.z < 1, `AC-US-0003-08: curve frame ${i} in ${area.join('x')} must show the whole kart (${ndc.x.toFixed(3)}, ${ndc.y.toFixed(3)})`);
      }
    }
  }
});

test('CHK-TEST-0003-10 before the countdown the camera shows the whole track from above, in every shape of the play area, and never after the lap ended', () => {
  // AC-US-0003-10
  for (const area of AREAS) {
    const view = viewOf(undefined, area);
    assert.equal(view.cameraMode, 'TRACK_OVERVIEW', `AC-US-0003-10: without an active lap the mode is TRACK_OVERVIEW in ${area.join('x')}`);
    assert.equal(view.simStepCount, undefined, 'AC-US-0003-10: the overview carries no simulation step');
    assert.ok(view.cameraHeightM >= 20, 'AC-US-0003-10: the overview is seen from above');
    for (const x of [bounds.minXM, bounds.maxXM]) for (const z of [bounds.minZM, bounds.maxZM]) {
      const ndc = projectPoint(view, new THREE.Vector3(x, 0, z));
      assert.ok(Math.abs(ndc.x) <= 0.9 && Math.abs(ndc.y) <= 0.9 && ndc.z < 1, `AC-US-0003-10: the track corner (${x}, ${z}) must be inside the frame with a 5 % margin in ${area.join('x')} (${ndc.x.toFixed(3)}, ${ndc.y.toFixed(3)})`);
    }
  }
  for (const { view } of [...endedByCompletion, ...endedByReposition]) assert.notEqual(view.cameraMode, 'TRACK_OVERVIEW', 'AC-US-0003-10: an ended lap never shows the overview');
  assert.deepEqual(computeCameraView({ lapState: { code: 'NO_ACTIVE_LAP' }, kartPose: { code: 'NO_STATE' }, viewWidthPx: 1280, viewHeightPx: 720, trackBounds: undefined }), { code: 'NO_SCENE' }, 'AC-US-0003-10: without a track there is no scene to show');
});

test('CHK-TEST-0003-11 during the countdown the camera holds the overview and then descends without ever rising, stopping while paused', () => {
  // AC-US-0003-11
  let lap = startSession(reading);
  const overview = cameraPoseOf(viewOf(undefined));
  const heights: number[] = [];
  let overviewFrames = 0;
  for (let i = 0; i < COUNTDOWN_STEPS; i++) {
    const state = getLapState(lap);
    assert.ok(!('code' in state) && state.lapPhase === 'COUNTDOWN', `AC-US-0003-11: step ${i} is still the countdown`);
    const view = viewOf(lap);
    assert.equal(view.cameraMode, 'COUNTDOWN_DESCENT', `AC-US-0003-11: countdown step ${i} is COUNTDOWN_DESCENT`);
    if (!('code' in state) && state.countdownRemainingMs >= 2900) { assert.deepEqual(cameraPoseOf(view), overview, `AC-US-0003-11: with ${state.countdownRemainingMs} ms remaining the pose is the overview`); overviewFrames++; }
    if (heights.length) assert.ok(view.cameraHeightM <= heights[heights.length - 1] + 1e-12, `AC-US-0003-11: the camera must not rise at countdown step ${i}`);
    heights.push(view.cameraHeightM);
    if (i === 180) {
      const paused = pauseLap(lap, 'FOCUS_LOST');
      assert.ok(paused.ok, 'AC-US-0003-11: the countdown can be paused');
      if (!paused.ok) return;
      const frozen1 = stepLap(paused.lap, IDLE), frozen2 = stepLap(frozen1, IDLE);
      assert.equal(viewOf(frozen1).cameraMode, 'COUNTDOWN_DESCENT', 'AC-US-0003-11: a paused countdown keeps the descent mode');
      assert.deepEqual(cameraPoseOf(viewOf(frozen2)), cameraPoseOf(viewOf(frozen1)), 'AC-US-0003-11: two paused frames give the same pose');
      assert.deepEqual(cameraPoseOf(viewOf(frozen1)), cameraPoseOf(view), 'AC-US-0003-11: the pause holds the pose of the last countdown step');
      const resumed = resumeLap(frozen2);
      assert.ok(resumed.ok, 'AC-US-0003-11: the countdown resumes');
      if (!resumed.ok) return;
      lap = resumed.lap;
      assert.deepEqual(cameraPoseOf(viewOf(lap)), cameraPoseOf(view), 'AC-US-0003-11: after resuming the descent continues from the same point');
    }
    lap = stepLap(lap, IDLE);
  }
  assert.ok(overviewFrames >= 10, `AC-US-0003-11: the first 100 ms of the countdown hold the overview (${overviewFrames} frames)`);
  assert.ok(heights[heights.length - 1] < heights[0], 'AC-US-0003-11: the camera is lower at the end of the countdown than at its start');
  assert.equal(lap.phase, 'RUNNING', 'AC-US-0003-11: the countdown ended in RUNNING');
});

test('CHK-TEST-0003-12 at the green signal the camera is already in the race pose, and the last countdown frame is within a centimetre of it', () => {
  // AC-US-0003-12
  let lap = startSession(reading);
  let lastCountdown: CameraView | undefined;
  while (lap.phase === 'COUNTDOWN') { lastCountdown = viewOf(lap); lap = stepLap(lap, IDLE); }
  const green = getLapState(lap);
  assert.ok(!('code' in green) && green.lapPhase === 'RUNNING' && green.countdownRemainingMs === 0, 'AC-US-0003-12: the first running frame has no countdown left');
  const view = viewOf(lap);
  assert.equal(view.cameraMode, 'RACE_CHASE', 'AC-US-0003-12: the green frame is RACE_CHASE');
  assert.deepEqual(cameraPoseOf(view), raceChasePose(poseOf(lap.kart)), 'AC-US-0003-12: the green frame pose is exactly the race pose');
  assert.equal(view.cameraHeightM, 1.38, 'AC-US-0003-12: 1.38 m above the ground at the green signal');
  assert.ok(lastCountdown, 'AC-US-0003-12: a last countdown frame exists');
  if (!lastCountdown) return;
  const gap = Math.hypot(lastCountdown.cameraXM - view.cameraXM, lastCountdown.cameraZM - view.cameraZM, lastCountdown.cameraHeightM - view.cameraHeightM);
  assert.ok(gap < 0.01, `AC-US-0003-12: the last countdown frame is within 0.01 m of the race pose (${gap})`);
  assert.equal(lastCountdown.cameraMode, 'COUNTDOWN_DESCENT', 'AC-US-0003-12: the frame before the green is still the descent');
});

test('CHK-TEST-0003-13 after the lap ends, by completion or by reposition, the camera stays in the race pose behind the frozen kart until a new countdown starts', () => {
  // AC-US-0003-13
  for (const [label, frames, lap] of [['completion', endedByCompletion, completed], ['reposition', endedByReposition, repositioned]] as const) {
    assert.ok(lap && lap.phase === 'ENDED', `AC-US-0003-13: the lap ended by ${label}`);
    if (!lap) return;
    assert.ok(!('code' in getLapResult(lap)), `AC-US-0003-13: the result panel of the ${label} lap exists`);
    for (const { pose, view } of frames) {
      assert.equal(view.cameraMode, 'RACE_CHASE', `AC-US-0003-13: an ended-by-${label} frame is RACE_CHASE`);
      assert.deepEqual(cameraPoseOf(view), raceChasePose(pose), `AC-US-0003-13: the camera keeps the race pose relative to the frozen kart (${label})`);
    }
    for (let i = 1; i < frames.length; i++) {
      assert.equal(frames[i].view.simStepCount, frames[i - 1].view.simStepCount, `AC-US-0003-13: the simulation does not advance after ${label}`);
      assert.deepEqual(cameraPoseOf(frames[i].view), cameraPoseOf(frames[i - 1].view), `AC-US-0003-13: the camera does not move after ${label}`);
      assert.deepEqual(frames[i].pose, frames[i - 1].pose, `AC-US-0003-13: the kart is frozen after ${label}`);
    }
  }
  assert.equal(repositioned?.validity, 'INVALID', 'AC-US-0003-13: the reposition invalidated the official lap');
  const next = startLap(completed, { lapKind: 'OFFICIAL', trackId: reading.trackId, trackVersion: reading.trackVersion }, reading, ARCADE_KART);
  assert.ok(next.ok, 'AC-US-0003-13: a new lap starts from the ended one');
  if (!next.ok) return;
  const first = viewOf(next.lap);
  assert.equal(first.cameraMode, 'COUNTDOWN_DESCENT', 'AC-US-0003-13: the first frame of the new countdown is the descent');
  assert.deepEqual(cameraPoseOf(first), trackOverviewPose(bounds, 'LANDSCAPE', 1280 / 720), 'AC-US-0003-13: the first frame of the new countdown is at the overview pose');
  assert.equal(viewOf(completed).cameraMode, 'RACE_CHASE', 'AC-US-0003-13: the frame before the new countdown was still RACE_CHASE');
  assert.ok(Math.abs(COUNTDOWN_MS - 3000) < 1, 'AC-US-0003-13: the countdown the game already has is 3 s');
});

test('CHK-TEST-0003-14 the camera mode follows the lap phase: overview only without a lap, descent only during the countdown, chase otherwise', () => {
  // AC-US-0003-10, AC-US-0003-13
  const base = getLapState(running[0].lap);
  if ('code' in base) throw new Error(base.code);
  assert.equal(decideCameraMode({ code: 'NO_ACTIVE_LAP' }), 'TRACK_OVERVIEW', 'AC-US-0003-10: no lap gives the overview');
  assert.equal(decideCameraMode({ ...base, lapPhase: 'COUNTDOWN' }), 'COUNTDOWN_DESCENT', 'AC-US-0003-10: the countdown gives the descent');
  assert.equal(decideCameraMode({ ...base, lapPhase: 'PAUSED', resumePhase: 'COUNTDOWN' }), 'COUNTDOWN_DESCENT', 'AC-US-0003-10: a paused countdown keeps the descent');
  assert.equal(decideCameraMode({ ...base, lapPhase: 'RUNNING' }), 'RACE_CHASE', 'AC-US-0003-10: running gives the chase');
  assert.equal(decideCameraMode({ ...base, lapPhase: 'PAUSED', resumePhase: 'RUNNING' }), 'RACE_CHASE', 'AC-US-0003-10: a paused race keeps the chase');
  assert.equal(decideCameraMode({ ...base, lapPhase: 'ENDED' }), 'RACE_CHASE', 'AC-US-0003-13: an ended lap keeps the chase, never the overview');
});

test('CHK-TEST-0003-15 the camera does not depend on the lap kind: a training lap gets the chase pose of the kart in every frame, as an official one', () => {
  // AC-US-0003-14
  const base = getLapState(running[0].lap);
  if ('code' in base) throw new Error(base.code);
  const kinds: readonly LapKind[] = ['OFFICIAL', 'RECON', 'TRAINING'];
  // Every phase of a lap, with the mode RULE-0002 gives it whatever the kind: the descent only during the countdown.
  const phases = [
    { phase: { lapPhase: 'COUNTDOWN', countdownRemainingMs: 1500 }, mode: 'COUNTDOWN_DESCENT' },
    { phase: { lapPhase: 'PAUSED', resumePhase: 'COUNTDOWN', countdownRemainingMs: 2950 }, mode: 'COUNTDOWN_DESCENT' },
    { phase: { lapPhase: 'RUNNING' }, mode: 'RACE_CHASE' },
    { phase: { lapPhase: 'PAUSED', resumePhase: 'RUNNING' }, mode: 'RACE_CHASE' },
    { phase: { lapPhase: 'ENDED' }, mode: 'RACE_CHASE' },
  ] as const;
  for (const { phase, mode } of phases) {
    for (const area of [LANDSCAPE, PORTRAIT]) {
      const [official, ...others] = kinds.map(lapKind => viewOfPose({ ...base, ...phase, lapKind }, running[40].pose, area));
      for (const other of others) assert.deepEqual(other, official, `AC-US-0003-14: a ${phase.lapPhase} view in ${area.join('x')} is the same field by field for every lap kind`);
    }
    for (const lapKind of kinds) {
      assert.equal(decideCameraMode({ ...base, lapKind, ...phase }), mode, `AC-US-0003-14: ${lapKind} ${phase.lapPhase}${'resumePhase' in phase ? ` (from ${phase.resumePhase})` : ''} is ${mode}`);
    }
  }
  // A real training countdown frame by frame: the same descent as the official one, step for step.
  let trainingLap = startSession(reading, 'TRAINING'), officialLap = startSession(reading, 'OFFICIAL');
  for (let i = 0; i < COUNTDOWN_STEPS; i++) {
    const trainingView = viewOf(trainingLap), officialView = viewOf(officialLap);
    assert.equal(trainingView.cameraMode, 'COUNTDOWN_DESCENT', `AC-US-0003-14: training countdown step ${i} is COUNTDOWN_DESCENT`);
    assert.deepEqual(trainingView, officialView, `AC-US-0003-14: training countdown step ${i} gives the view of the official countdown`);
    trainingLap = stepLap(trainingLap, IDLE); officialLap = stepLap(officialLap, IDLE);
  }
  const trainingState: LapStateView = { ...base, lapKind: 'TRAINING' };
  for (const [i, { pose }] of running.entries()) {
    const view = viewOfPose(trainingState, pose, LANDSCAPE);
    assert.equal(view.cameraMode, 'RACE_CHASE', `AC-US-0003-14: training frame ${i} is RACE_CHASE`);
    assert.deepEqual(cameraPoseOf(view), raceChasePose(pose), `AC-US-0003-14: training frame ${i} is the chase pose of the kart of that frame`);
  }
});

// A training driven by the reference controller until two laps close on the finish line (the second one invalidated by a
// cut: the kart is steered off the track until the lap is INVALID, then repositioned on the centerline), then 120 more
// steps at full throttle; one frame per step.
type TrainingFrame = Frame & { closedLaps: number; repositioned: boolean };
function continuousTraining(): TrainingFrame[] {
  const config = PUBLISHED_SETUPS.ARCADE_ASSISTIDO.config;
  const controller = autopilot(0, config);
  let lap = runCountdown(startSession(reading, 'TRAINING', config));
  const frames: TrainingFrame[] = [];
  const push = (repositioned = false) => frames.push({ lap, pose: poseOf(lap.kart), view: viewOf(lap), closedLaps: listLapResults(lap).lapResults.length, repositioned });
  let repositionedOnce = false, afterLastClose = -1;
  for (let i = 0; i < 20000 && lap.phase === 'RUNNING'; i++) {
    const closed = listLapResults(lap).lapResults.length;
    if (closed === 1 && !repositionedOnce && lap.markersPassedCount >= 1) {
      for (let j = 0; j < 1200 && lap.validity === 'VALID'; j++) { lap = stepLap(lap, { throttle: 1, brake: 0, steer: 1 }); push(); }
      const moved = repositionKart(lap);
      if (!moved.ok) throw new Error(moved.code);
      lap = moved.lap; repositionedOnce = true; push(true); continue;
    }
    lap = stepLap(lap, afterLastClose >= 0 ? { throttle: 1, brake: 0, steer: 0 } : controller(lap));
    push();
    if (afterLastClose < 0 && listLapResults(lap).lapResults.length === 2) afterLastClose = 0;
    else if (afterLastClose >= 0 && ++afterLastClose >= 120) break;
  }
  return frames;
}
const training = continuousTraining();

test('CHK-TEST-0003-16 after a training lap ends, valid or invalidated, the camera stays in the chase pose behind the kart, which keeps moving', () => {
  // AC-US-0003-14
  const results = listLapResults(training[training.length - 1].lap).lapResults;
  assert.equal(results.length, 2, 'AC-US-0003-14: two training laps closed on the finish line');
  assert.deepEqual(results.map(r => [r.lapValidity, r.invalidReason]), [['VALID', undefined], ['INVALID', 'CUT']], 'AC-US-0003-14: the first lap closed valid and the second invalidated by the cut');
  assert.ok(training.some(f => f.repositioned), 'AC-US-0003-14: the kart was repositioned during the second lap');
  const firstEnd = training.findIndex(f => f.closedLaps >= 1);
  const secondEnd = training.findIndex(f => f.closedLaps >= 2);
  assert.ok(firstEnd > 0 && secondEnd > firstEnd, 'AC-US-0003-14: the frames where each lap ended were found');
  assert.ok(training.length - secondEnd > 120, `AC-US-0003-14: 120 frames were driven after the second lap ended (${training.length - secondEnd - 1})`);
  for (let i = firstEnd; i < training.length; i++) {
    const { lap, pose, view } = training[i];
    assert.equal(lap.phase, 'RUNNING', `AC-US-0003-14: frame ${i} after a training lap end is still RUNNING`);
    assert.equal(view.cameraMode, 'RACE_CHASE', `AC-US-0003-14: frame ${i} after a training lap end is RACE_CHASE, never the overview nor the descent`);
    assert.deepEqual(cameraPoseOf(view), raceChasePose(poseOf(lap.kart)), `AC-US-0003-14: frame ${i} is the chase pose of the kart the simulation reports`);
    assert.equal(view.simStepCount, pose.simStepCount, `AC-US-0003-14: frame ${i} carries the step of its kart`);
    const previous = training[i - 1];
    assert.notEqual(view.simStepCount, previous.view.simStepCount, `AC-US-0003-14: the simulation advanced between frames ${i - 1} and ${i}`);
    if (lap.kart.speed > 0) assert.ok(pose.xM !== previous.pose.xM || pose.zM !== previous.pose.zM, `AC-US-0003-14: the kart reported at ${lap.kart.speed.toFixed(2)} m/s moved between frames ${i - 1} and ${i}`);
  }
  for (const [label, end] of [['valid', firstEnd], ['invalidated', secondEnd]] as const) {
    const from = training[end].pose, to = training[end + 120].pose;
    const travelled = Math.hypot(to.xM - from.xM, to.zM - from.zM);
    assert.ok(travelled > 5, `AC-US-0003-14: in the 120 frames after the ${label} lap ended the kart kept moving (${travelled.toFixed(1)} m)`);
  }
});

test('CHK-TEST-0003-17 the camera takes no turbo and no command: no turbo field or constant in the camera or the application, no manoeuvre or Input import, and the frame call passes exactly the five inputs', () => {
  // AC-US-0003-04
  const camera = stripComments(sourceText('src/gameCamera.ts')), main = stripComments(sourceText('src/main.ts'));
  for (const symbol of ['turboActive', 'TURBO_FOV_DELTA_DEG', 'turboFovDeltaDeg', 'baseVerticalFovDeg']) {
    assert.ok(!new RegExp(`\\b${symbol}\\b`).test(camera), `AC-US-0003-04: src/gameCamera.ts has no ${symbol}`);
    assert.ok(!new RegExp(`\\b${symbol}\\b`).test(main), `AC-US-0003-04: src/main.ts has no ${symbol}`);
  }
  const imports = [...camera.matchAll(/import\s+(?:type\s+)?\{([^}]*)\}\s+from\s+'([^']+)'/g)];
  assert.ok(!imports.some(m => /maneuvers$/.test(m[2])), 'AC-US-0003-04: src/gameCamera.ts does not import src/maneuvers.ts');
  assert.ok(!imports.some(m => m[1].split(',').map(n => n.replace(/^\s*type\s+/, '').trim()).includes('Input')), 'AC-US-0003-04: src/gameCamera.ts does not import the Input type');
  const calls = [...main.matchAll(/computeCameraView\(\s*\{([^}]*)\}\s*\)/g)];
  assert.equal(calls.length, 1, 'AC-US-0003-04: src/main.ts calls computeCameraView once per frame, in one place');
  const keys = calls[0][1].split(',').map(part => part.split(':')[0].trim()).filter(Boolean).sort();
  assert.deepEqual(keys, ['kartPose', 'lapState', 'trackBounds', 'viewHeightPx', 'viewWidthPx'], 'AC-US-0003-04: the frame passes exactly lapState, kartPose, viewWidthPx, viewHeightPx and trackBounds');
});

test('CHK-TEST-0003-18 the camera module never reads the lap kind', () => {
  // AC-US-0003-14
  assert.ok(!/\blapKind\b/.test(stripComments(sourceText('src/gameCamera.ts'))), 'AC-US-0003-14: src/gameCamera.ts reads no lapKind');
});
