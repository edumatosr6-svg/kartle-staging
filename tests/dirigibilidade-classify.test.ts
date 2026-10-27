// TEST-0004 — the step classes of RULE-0001 over hand-written sequences, no physics (strategy: classify, unit, DES-0001).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { classifyHandlingSteps, RECOVERY_MAX_STEPS, STEP, type Handling, type HandlingTelemetry, type Input } from '../src/physics';
import { SETUP_REF } from './helpers/handling';

type Step = { input: Input; telemetry: HandlingTelemetry };
const input = (steer: number, throttle = 1): Input => ({ throttle, brake: 0, steer });
function tel(k: number, handling: Handling, forcing = false, driftActive = false): HandlingTelemetry {
  return { simStepCount: k + 1, ...SETUP_REF, speedMps: 17, handling, sideslipRad: 0.1, yawRateRadPerS: 0.5, surface: 'ASPHALT', wallContact: false, forcing, driftActive };
}
const at = (k: number, steer: number, handling: Handling, forcing = false, driftActive = false): Step => ({ input: input(steer), telemetry: tel(k, handling, forcing, driftActive) });

// Forcing with the rear loose for `forcingSteps`, released at step `forcingSteps`, grip at `gripAt` (or never).
function releaseSequence(forcingSteps: number, gripAt: number | undefined, length: number, afterRelease: (k: number) => number = () => 0): Step[] {
  const steps: Step[] = [];
  for (let k = 0; k < length; k++) {
    if (k < forcingSteps) steps.push(at(k, 1, 'oversteer', true));
    else steps.push(at(k, afterRelease(k), gripAt !== undefined && k >= gripAt ? 'grip' : 'oversteer', false));
  }
  return steps;
}

test('CHK-TEST-0004-01 a step under the forcing condition is FORCING, a drift step is DRIFT and a plain step is NORMAL', () => {
  // AC-US-0003-02
  const classes = classifyHandlingSteps([at(0, 1, 'oversteer', true), at(1, 0.7, 'sliding', false, true), at(2, 0.3, 'grip'), at(3, 1, 'grip', true, true)]);
  assert.deepEqual(classes, ['FORCING', 'DRIFT', 'NORMAL', 'DRIFT'], 'AC-US-0003-02: forcing, drift and plain steps must be classified as FORCING, DRIFT and NORMAL, drift first');
  assert.deepEqual(classifyHandlingSteps([]), [], 'AC-US-0003-02: an empty sequence has no class');
});

test('CHK-TEST-0004-02 the release of a full steer under forcing with the rear loose opens a recovery that ends at the first grip, inclusive', () => {
  // AC-US-0003-02
  const classes = classifyHandlingSteps(releaseSequence(5, 10, 14));
  assert.deepEqual(classes.slice(0, 5), Array(5).fill('FORCING'), 'AC-US-0003-02: the forcing steps are FORCING');
  assert.deepEqual(classes.slice(5, 11), Array(6).fill('RECOVERY'), 'AC-US-0003-02: the release step through the first grip, inclusive, are RECOVERY');
  assert.deepEqual(classes.slice(11), Array(3).fill('NORMAL'), 'AC-US-0003-02: the steps after the first grip are NORMAL');
});

test('CHK-TEST-0004-03 a recovery that never reaches grip lasts 48 steps (400 ms); the 49th step without grip is NORMAL and fails as loose normal driving', () => {
  // AC-US-0003-02
  assert.equal(RECOVERY_MAX_STEPS, Math.round(0.4 / STEP), 'AC-US-0003-02: the recovery ceiling must be 400 ms in steps');
  const classes = classifyHandlingSteps(releaseSequence(3, undefined, 3 + 60));
  assert.deepEqual(classes.slice(3, 3 + 48), Array(48).fill('RECOVERY'), 'AC-US-0003-02: 48 steps after the release are RECOVERY');
  assert.equal(classes[3 + 48], 'NORMAL', 'AC-US-0003-02: the 49th step without grip is NORMAL');
  assert.deepEqual(classes.slice(3 + 48), Array(12).fill('NORMAL'), 'AC-US-0003-02: every later step without grip is NORMAL');
  const late = classifyHandlingSteps(releaseSequence(3, 3 + 59, 3 + 60));
  assert.equal(late[3 + 59], 'NORMAL', 'AC-US-0003-02: a grip after the ceiling does not reopen the recovery');
});

test('CHK-TEST-0004-04 a forcing step inside a recovery ends it; the steps that follow are classified afresh', () => {
  // AC-US-0003-02
  const steps = releaseSequence(3, undefined, 12);
  steps[6] = at(6, 1, 'oversteer', true);
  steps[7] = at(7, 0.5, 'oversteer');
  const classes = classifyHandlingSteps(steps);
  assert.deepEqual(classes.slice(3, 6), Array(3).fill('RECOVERY'), 'AC-US-0003-02: the recovery runs until the steer is reapplied');
  assert.equal(classes[6], 'FORCING', 'AC-US-0003-02: the reapplied full steer under forcing is FORCING');
  assert.equal(classes[7], 'NORMAL', 'AC-US-0003-02: a partial steer after the forcing step is not a release and the old recovery is over');
  assert.deepEqual(classes.slice(8), Array(4).fill('NORMAL'), 'AC-US-0003-02: no recovery survives the forcing step');
});

test('CHK-TEST-0004-05 only a full steer taken to 0 from a forcing step with the rear loose opens a recovery', () => {
  // AC-US-0003-02
  const partial = classifyHandlingSteps([at(0, 0.9, 'oversteer', false), at(1, 0, 'oversteer'), at(2, 0, 'grip')]);
  assert.deepEqual(partial, ['NORMAL', 'NORMAL', 'NORMAL'], 'AC-US-0003-02: a partial steer never forces and its release opens no recovery');
  const inGrip = classifyHandlingSteps([at(0, 1, 'grip', true), at(1, 0, 'oversteer'), at(2, 0, 'grip')]);
  assert.deepEqual(inGrip, ['FORCING', 'NORMAL', 'NORMAL'], 'AC-US-0003-02: a release from forcing in grip opens no recovery');
  const reduced = classifyHandlingSteps([at(0, 1, 'oversteer', true), at(1, 0.5, 'oversteer'), at(2, 0.5, 'grip')]);
  assert.deepEqual(reduced, ['FORCING', 'NORMAL', 'NORMAL'], 'AC-US-0003-02: a steer reduced to 0.5 instead of 0 is not a release');
  const other = classifyHandlingSteps([at(0, -1, 'sliding', true), at(1, 0, 'sliding'), at(2, 0, 'grip')]);
  assert.deepEqual(other, ['FORCING', 'RECOVERY', 'RECOVERY'], 'AC-US-0003-02: the release from -1 with sliding opens a recovery too');
});

test('CHK-TEST-0004-06 the class of a step depends only on the sequence before it, in simStepCount order: the same sequence classified twice gives the same classes', () => {
  // AC-US-0003-02
  const steps = releaseSequence(4, 9, 20);
  const first = classifyHandlingSteps(steps), second = classifyHandlingSteps(steps);
  assert.deepEqual(second, first, 'AC-US-0003-02: classification must be a pure function of the sequence');
  const prefix = classifyHandlingSteps(steps.slice(0, 12));
  assert.deepEqual(first.slice(0, 12), prefix, 'AC-US-0003-02: the class of a step must not depend on the steps after it');
  assert.equal(steps.length, first.length, 'AC-US-0003-02: one class per step');
});
