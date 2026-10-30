// TEST-0001 — the assembled Kart 01 measured in Node: dimensions, wheels and tracks, the 16 groups, the sheet colours, the
// draw cost, the animated nodes (steer, spin, steering wheel, arms) and the anchors (strategy: model, DES-0001, DES-0006,
// RULE-0001, API-0002). The model is built without decals: nothing here touches the DOM.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { buildKart01Model, KART01_GROUP_NAMES, PILOT_GROUP_NAME, steeringWheelAngleRad, updateKart01Pose, type WheelName } from '../src/kart01Model';
import {
  boxOf, DRAW_CALL_LIMIT, EXPECTED_GROUP_NAMES, EXPECTED_TRIANGLE_COUNT, judgeModelCheck, measureKart01Model, pilotColorHexes,
  serializeRecord, SHEET_COLORS, toCm, type Kart01Measures,
} from './helpers/kart01Report';

const model = buildKart01Model();
const measures = measureKart01Model(model);
const WHEELS: readonly WheelName[] = ['rodaDianteiraEsq', 'rodaDianteiraDir', 'rodaTraseiraEsq', 'rodaTraseiraDir'];
const FRONT: readonly WheelName[] = ['rodaDianteiraEsq', 'rodaDianteiraDir'];
const REAR: readonly WheelName[] = ['rodaTraseiraEsq', 'rodaTraseiraDir'];
const near = (a: number, b: number, tol: number) => Math.abs(a - b) <= tol;
const restSpin = { rodaDianteiraEsq: 0, rodaDianteiraDir: 0, rodaTraseiraEsq: 0, rodaTraseiraDir: 0 };
const meshesOf = (o: THREE.Object3D): THREE.Mesh[] => { const out: THREE.Mesh[] = []; o.traverse(x => { if ((x as THREE.Mesh).isMesh) out.push(x as THREE.Mesh); }); return out; };

// Synthetic measures built by hand (never from the model): the nominal values of the sheet, one deviation per check.
const nominal = (): Kart01Measures => ({
  bboxLengthM: 1.93, bboxWidthM: 1.45, wheelbaseM: 1.05,
  frontWheelDiametersM: [0.26, 0.26], rearWheelDiametersM: [0.28, 0.28], frontTrackM: 1.00, rearTrackM: 1.14,
  partGroups: EXPECTED_GROUP_NAMES.map(groupName => ({ groupName, visibleTriangleCount: 1 })), missingGroupNames: [],
  kartColorHexes: ['#FF6A13', '#2B2E34', '#F4F3EF'], chassisColorHexes: ['#2B2E34'], bumperPlateColorHex: '#F4F3EF', suitColorHex: '#2F55D4',
  meshCount: 27, drawCallCount: 27, triangleCount: 5128,
});
const withoutGroup = (m: Kart01Measures, name: string): Kart01Measures => ({ ...m, partGroups: m.partGroups.filter(g => g.groupName !== name), missingGroupNames: [...m.missingGroupNames, name] });
const withPilotUnder = (m: Kart01Measures, parentGroupName: string): Kart01Measures => ({ ...m, partGroups: m.partGroups.map(g => g.groupName === PILOT_GROUP_NAME ? { ...g, parentGroupName } : g) });

test('CHK-TEST-0001-01 the assembled kart measures 1.93 m long, 1.45 m wide and 1.05 m between the axles, within 2 cm', (t) => {
  // AC-US-0001-01, AC-US-0001-02, AC-US-0001-03
  const record = judgeModelCheck('KART_DIMENSIONS', measures);
  t.diagnostic(serializeRecord(record));
  assert.ok(near(record.bboxLengthM, 1.93, 0.02), `AC-US-0001-01: the bounding-box length must be 1.93 m ± 0.02 (measured ${record.bboxLengthM})`);
  assert.ok(near(record.bboxWidthM, 1.45, 0.02), `AC-US-0001-02: the bounding-box width must be 1.45 m ± 0.02 (measured ${record.bboxWidthM})`);
  assert.ok(near(record.wheelbaseM, 1.05, 0.02), `AC-US-0001-03: the wheelbase must be 1.05 m ± 0.02 (measured ${record.wheelbaseM})`);
  assert.equal(record.verdict, 'PASS', 'AC-US-0001-01: KART_DIMENSIONS must be PASS');
});

test('CHK-TEST-0001-02 a dimension outside the 2 cm tolerance is judged OUT_OF_TOLERANCE, never rounded in', () => {
  // AC-US-0001-01, AC-US-0001-02, AC-US-0001-03
  assert.equal(judgeModelCheck('KART_DIMENSIONS', nominal()).verdict, 'PASS', 'AC-US-0001-01: the nominal measures are PASS');
  const long = judgeModelCheck('KART_DIMENSIONS', { ...nominal(), bboxLengthM: 1.96 });
  assert.equal(long.verdict, 'FAIL', 'AC-US-0001-01: 1.96 m is outside 1.93 ± 0.02');
  assert.equal(long.verdict === 'FAIL' && long.checkFailReason, 'OUT_OF_TOLERANCE', 'AC-US-0001-01: the reason must be OUT_OF_TOLERANCE');
  assert.equal(judgeModelCheck('KART_DIMENSIONS', { ...nominal(), bboxWidthM: 1.48 }).verdict, 'FAIL', 'AC-US-0001-02: 1.48 m is outside 1.45 ± 0.02');
  assert.equal(judgeModelCheck('KART_DIMENSIONS', { ...nominal(), wheelbaseM: 1.08 }).verdict, 'FAIL', 'AC-US-0001-03: 1.08 m is outside 1.05 ± 0.02');
  assert.equal(judgeModelCheck('KART_DIMENSIONS', { ...nominal(), bboxLengthM: 1.95 }).verdict, 'PASS', 'AC-US-0001-01: 1.95 m is on the tolerance edge and PASS');
});

test('CHK-TEST-0001-03 the front wheels measure 0.26 m, the rear 0.28 m, and the tracks 1.00 m and 1.14 m, to the centimetre', (t) => {
  // AC-US-0001-04, AC-US-0001-05, AC-US-0001-06, AC-US-0001-07
  const record = judgeModelCheck('WHEELS_AND_TRACKS', measures);
  t.diagnostic(serializeRecord(record));
  for (const d of record.frontWheelDiametersM) assert.equal(toCm(d), 26, `AC-US-0001-04: each front wheel must be 0.26 m to the centimetre (measured ${d})`);
  for (const d of record.rearWheelDiametersM) assert.equal(toCm(d), 28, `AC-US-0001-05: each rear wheel must be 0.28 m to the centimetre (measured ${d})`);
  assert.equal(toCm(record.frontTrackM), 100, `AC-US-0001-06: the front track must be 1.00 m to the centimetre (measured ${record.frontTrackM})`);
  assert.equal(toCm(record.rearTrackM), 114, `AC-US-0001-07: the rear track must be 1.14 m to the centimetre (measured ${record.rearTrackM})`);
  assert.equal(record.verdict, 'PASS', 'AC-US-0001-04: WHEELS_AND_TRACKS must be PASS');
  for (const name of WHEELS) assert.ok(meshesOf(model.wheels[name].spin).length > 0, `AC-US-0001-04: the spin node of ${name} must carry the wheel geometry`);
});

test('CHK-TEST-0001-04 a wheel or a track that differs to the centimetre is judged OUT_OF_TOLERANCE', () => {
  // AC-US-0001-04, AC-US-0001-05, AC-US-0001-06, AC-US-0001-07
  const wheel = judgeModelCheck('WHEELS_AND_TRACKS', { ...nominal(), frontWheelDiametersM: [0.26, 0.27] });
  assert.equal(wheel.verdict, 'FAIL', 'AC-US-0001-04: a 0.27 m front wheel is FAIL');
  assert.equal(wheel.verdict === 'FAIL' && wheel.checkFailReason, 'OUT_OF_TOLERANCE', 'AC-US-0001-04: the reason must be OUT_OF_TOLERANCE');
  assert.equal(judgeModelCheck('WHEELS_AND_TRACKS', { ...nominal(), rearWheelDiametersM: [0.27, 0.28] }).verdict, 'FAIL', 'AC-US-0001-05: a 0.27 m rear wheel is FAIL');
  assert.equal(judgeModelCheck('WHEELS_AND_TRACKS', { ...nominal(), frontTrackM: 1.01 }).verdict, 'FAIL', 'AC-US-0001-06: a 1.01 m front track is FAIL');
  assert.equal(judgeModelCheck('WHEELS_AND_TRACKS', { ...nominal(), rearTrackM: 1.13 }).verdict, 'FAIL', 'AC-US-0001-07: a 1.13 m rear track is FAIL');
  assert.equal(judgeModelCheck('WHEELS_AND_TRACKS', { ...nominal(), frontWheelDiametersM: [0.264, 0.256] }).verdict, 'PASS', 'AC-US-0001-04: 0.264 and 0.256 round to 0.26 and are PASS');
  assert.equal(judgeModelCheck('WHEELS_AND_TRACKS', { ...nominal(), frontWheelDiametersM: [0.266, 0.26] }).verdict, 'FAIL', 'AC-US-0001-04: 0.266 rounds to 0.27 and is FAIL');
});

test('CHK-TEST-0001-05 the 15 part groups and the pilot are present with visible geometry, the pilot outside every part group', (t) => {
  // AC-US-0001-08, AC-US-0001-09
  const record = judgeModelCheck('PART_GROUPS', measures);
  t.diagnostic(serializeRecord(record));
  for (const name of KART01_GROUP_NAMES) {
    const entry = record.partGroups.find(g => g.groupName === name);
    assert.ok(entry && entry.visibleTriangleCount > 0, `AC-US-0001-08: group ${name} must exist with visible geometry`);
  }
  assert.deepEqual(record.missingGroupNames, [], 'AC-US-0001-08: no expected group may be missing');
  const pilot = record.partGroups.find(g => g.groupName === PILOT_GROUP_NAME);
  assert.ok(pilot && pilot.visibleTriangleCount > 0, 'AC-US-0001-09: the piloto group must exist with visible geometry');
  assert.equal(pilot?.parentGroupName, undefined, 'AC-US-0001-09: piloto must not be inside any of the 15 part groups');
  assert.equal(model.groups.piloto.parent, model.root, 'AC-US-0001-09: piloto must be a direct child of the model root');
  assert.equal(record.partGroups.length, 16, 'AC-US-0001-08: exactly 16 named groups are reported');
  assert.equal(record.verdict, 'PASS', 'AC-US-0001-08: PART_GROUPS must be PASS');
});

test('CHK-TEST-0001-06 an emptied group is GROUP_MISSING, a nested pilot is GROUP_NESTED, and missing wins over nested', () => {
  // AC-US-0001-08, AC-US-0001-09
  const missing = judgeModelCheck('PART_GROUPS', withoutGroup(nominal(), 'motor'));
  assert.equal(missing.verdict === 'FAIL' && missing.checkFailReason, 'GROUP_MISSING', 'AC-US-0001-08: a missing motor is GROUP_MISSING');
  const nested = judgeModelCheck('PART_GROUPS', withPilotUnder(nominal(), 'banco'));
  assert.equal(nested.verdict === 'FAIL' && nested.checkFailReason, 'GROUP_NESTED', 'AC-US-0001-09: a pilot under banco is GROUP_NESTED');
  const both = judgeModelCheck('PART_GROUPS', withPilotUnder(withoutGroup(nominal(), 'motor'), 'banco'));
  assert.equal(both.verdict === 'FAIL' && both.checkFailReason, 'GROUP_MISSING', 'AC-US-0001-08: with both conditions the first of the table, GROUP_MISSING, is reported');
  const emptied = buildKart01Model();
  emptied.groups.pedais.clear();
  const emptiedRecord = judgeModelCheck('PART_GROUPS', measureKart01Model(emptied));
  assert.ok(emptiedRecord.missingGroupNames.includes('pedais'), 'AC-US-0001-08: a model whose pedais mesh was removed reports pedais missing');
  assert.equal(emptiedRecord.verdict === 'FAIL' && emptiedRecord.checkFailReason, 'GROUP_MISSING', 'AC-US-0001-08: that model is GROUP_MISSING');
  const reparented = buildKart01Model();
  reparented.groups.banco.add(reparented.groups.piloto);
  const reparentedRecord = judgeModelCheck('PART_GROUPS', measureKart01Model(reparented));
  assert.equal(reparentedRecord.partGroups.find(g => g.groupName === PILOT_GROUP_NAME)?.parentGroupName, 'banco', 'AC-US-0001-09: a pilot moved under banco reports banco as its parent group');
  assert.equal(reparentedRecord.verdict === 'FAIL' && reparentedRecord.checkFailReason, 'GROUP_NESTED', 'AC-US-0001-09: that model is GROUP_NESTED');
});

test('CHK-TEST-0001-07 the kart uses Kartle orange, the chassis graphite, the bumper plate white and the pilot suit blue, as the sheet names them', (t) => {
  // AC-US-0001-10, AC-US-0001-11, AC-US-0001-12, AC-US-0001-13
  const record = judgeModelCheck('PART_COLORS', measures);
  t.diagnostic(serializeRecord(record));
  assert.ok(record.kartColorHexes.includes(SHEET_COLORS.kart), `AC-US-0001-10: ${SHEET_COLORS.kart} must be among the kart colours (${record.kartColorHexes.join(', ')})`);
  assert.ok(record.chassisColorHexes.includes(SHEET_COLORS.chassis), `AC-US-0001-11: ${SHEET_COLORS.chassis} must be among the chassi colours (${record.chassisColorHexes.join(', ')})`);
  assert.equal(record.bumperPlateColorHex, SHEET_COLORS.bumperPlate, 'AC-US-0001-12: the bumper plate must be #F4F3EF');
  assert.equal(record.suitColorHex, SHEET_COLORS.suit, 'AC-US-0001-13: the suit must be #2F55D4');
  assert.ok(pilotColorHexes(model).includes(SHEET_COLORS.suit), 'AC-US-0001-13: the suit blue must be painted on the piloto group');
  assert.equal(record.verdict, 'PASS', 'AC-US-0001-10: PART_COLORS must be PASS');
});

test('CHK-TEST-0001-08 a colour that is absent or differs from the sheet is COLOR_MISMATCH', () => {
  // AC-US-0001-10, AC-US-0001-11, AC-US-0001-12, AC-US-0001-13
  assert.equal(judgeModelCheck('PART_COLORS', nominal()).verdict, 'PASS', 'AC-US-0001-10: the nominal colours are PASS');
  const orange = judgeModelCheck('PART_COLORS', { ...nominal(), kartColorHexes: ['#FF6B13', '#2B2E34'] });
  assert.equal(orange.verdict === 'FAIL' && orange.checkFailReason, 'COLOR_MISMATCH', 'AC-US-0001-10: #FF6B13 in place of #FF6A13 is COLOR_MISMATCH');
  assert.equal(judgeModelCheck('PART_COLORS', { ...nominal(), chassisColorHexes: ['#3A3E45'] }).verdict, 'FAIL', 'AC-US-0001-11: a chassi without #2B2E34 is FAIL');
  assert.equal(judgeModelCheck('PART_COLORS', { ...nominal(), bumperPlateColorHex: '#FFFFFF' }).verdict, 'FAIL', 'AC-US-0001-12: a white plate of another hex is FAIL');
  assert.equal(judgeModelCheck('PART_COLORS', { ...nominal(), suitColorHex: '#2F55D5' }).verdict, 'FAIL', 'AC-US-0001-13: a suit one step off is FAIL');
});

test('CHK-TEST-0001-09 the kart with the pilot costs at most 30 draw calls and keeps the 5128 triangles of the source', (t) => {
  // NFR-0004
  const record = judgeModelCheck('DRAW_COST', measures);
  t.diagnostic(serializeRecord(record));
  assert.ok(record.drawCallCount <= DRAW_CALL_LIMIT, `NFR-0004: the draw calls must be at most 30 (counted ${record.drawCallCount})`);
  assert.equal(record.triangleCount, EXPECTED_TRIANGLE_COUNT, 'NFR-0004: the grouping must keep 5128 triangles');
  assert.equal(record.meshCount, 27, 'NFR-0004: the grouped model has 27 meshes');
  assert.equal(record.drawCallCount, 27, 'NFR-0004: one material per mesh, 27 draw calls');
  assert.equal(record.verdict, 'PASS', 'NFR-0004: DRAW_COST must be PASS');
});

test('CHK-TEST-0001-10 31 draw calls is LIMIT_EXCEEDED, 5127 triangles is SHAPE_CHANGED, and the limit is reported first', () => {
  // NFR-0004
  const calls = judgeModelCheck('DRAW_COST', { ...nominal(), drawCallCount: 31 });
  assert.equal(calls.verdict === 'FAIL' && calls.checkFailReason, 'LIMIT_EXCEEDED', 'NFR-0004: 31 draw calls is LIMIT_EXCEEDED');
  assert.equal(judgeModelCheck('DRAW_COST', { ...nominal(), drawCallCount: 30 }).verdict, 'PASS', 'NFR-0004: 30 draw calls is PASS');
  const shape = judgeModelCheck('DRAW_COST', { ...nominal(), triangleCount: 5127 });
  assert.equal(shape.verdict === 'FAIL' && shape.checkFailReason, 'SHAPE_CHANGED', 'NFR-0004: 5127 triangles is SHAPE_CHANGED');
  const both = judgeModelCheck('DRAW_COST', { ...nominal(), drawCallCount: 31, triangleCount: 5127 });
  assert.equal(both.verdict === 'FAIL' && both.checkFailReason, 'LIMIT_EXCEEDED', 'NFR-0004: with both conditions LIMIT_EXCEEDED is reported first');
});

test('CHK-TEST-0001-11 building the model twice gives the same Kart 01, with the same measures, groups and colours', () => {
  // AC-US-0001-14
  const again = measureKart01Model(buildKart01Model());
  assert.deepEqual(again, measures, 'AC-US-0001-14: every page build must assemble the same Kart 01');
  assert.equal(model.root.name, 'kart', 'AC-US-0001-14: the displayed root is the Kart 01 root');
  assert.equal(Object.keys(model.groups).length, 16, 'AC-US-0001-14: the model exposes the 16 named groups');
});

test('CHK-TEST-0001-12 every solid mesh of the kart casts a shadow and the decals do not', () => {
  // AC-US-0001-15
  const meshes = meshesOf(model.root);
  const solids = meshes.filter(m => m.material === model.materials.body);
  const decals = meshes.filter(m => m.material !== model.materials.body);
  assert.ok(solids.length >= 16, 'AC-US-0001-15: the solid meshes of the 16 groups must exist');
  assert.ok(decals.length >= 1, 'AC-US-0001-15: the decal meshes must exist');
  for (const m of solids) assert.equal(m.castShadow, true, `AC-US-0001-15: solid mesh ${m.name} must cast a shadow`);
  for (const m of solids) assert.equal(m.receiveShadow, true, `AC-US-0001-15: solid mesh ${m.name} must receive shadow`);
  for (const m of decals) assert.equal(m.castShadow, false, `AC-US-0001-15: decal ${m.name} must not cast a shadow`);
});

test('CHK-TEST-0001-13 the rear bumper carries the plate mesh with the plate material, the anchor the number is painted on', () => {
  // AC-US-0001-16
  const plate = meshesOf(model.groups.paraChoqueTraseiro).find(m => m.name === 'placaTraseira');
  assert.ok(plate, 'AC-US-0001-16: the mesh placaTraseira must exist in paraChoqueTraseiro');
  assert.equal(plate?.material, model.materials.plate, 'AC-US-0001-16: placaTraseira must use materials.plate');
  assert.equal(model.anchors.bumperPlate, plate, 'AC-US-0001-16: anchors.bumperPlate must be the placaTraseira mesh');
  assert.equal('#' + model.materials.plate.color.getHexString().toUpperCase(), SHEET_COLORS.bumperPlate, 'AC-US-0001-16: the plate material is the sheet white');
});

test('CHK-TEST-0001-14 the two front wheels turn about their vertical axis by the steering angle and the rear wheels do not', () => {
  // AC-US-0002-01
  const fresh = buildKart01Model();
  for (const steer of [0.2, 0, -0.2]) {
    updateKart01Pose(fresh, { steerAngleRad: steer, wheelSpinRevs: restSpin });
    for (const name of FRONT) assert.ok(near(fresh.wheels[name].steer.rotation.y, steer, 1e-12), `AC-US-0002-01: ${name} must be turned by ${steer} rad`);
    for (const name of REAR) assert.ok(near(fresh.wheels[name].steer.rotation.y, 0, 1e-12), `AC-US-0002-01: ${name} must not steer`);
    for (const name of FRONT) assert.ok(near(fresh.wheels[name].steer.rotation.x, 0, 1e-12) && near(fresh.wheels[name].steer.rotation.z, 0, 1e-12), `AC-US-0002-01: ${name} turns about the vertical axis only`);
  }
});

test('CHK-TEST-0001-15 the steering wheel is centred at zero, turns to the side of the steer and more for a larger steer', () => {
  // AC-US-0002-03
  assert.equal(steeringWheelAngleRad(0), 0, 'AC-US-0002-03: steer 0 centres the wheel');
  let previous = 0;
  for (const steer of [0.05, 0.1, 0.2, 0.3, 0.36]) {
    const angle = steeringWheelAngleRad(steer);
    assert.ok(angle > previous, `AC-US-0002-03: the wheel angle must grow with the steer (${steer})`);
    assert.ok(near(steeringWheelAngleRad(-steer), -angle, 1e-12), `AC-US-0002-03: the wheel turns to the other side for -${steer}`);
    previous = angle;
  }
  const fresh = buildKart01Model();
  for (const steer of [-0.36, -0.1, 0, 0.1, 0.36]) {
    updateKart01Pose(fresh, { steerAngleRad: steer, wheelSpinRevs: restSpin });
    assert.ok(near(fresh.steeringWheel.rotation.z, steeringWheelAngleRad(steer), 1e-12), `AC-US-0002-03: the displayed wheel must turn by steeringWheelAngleRad(${steer})`);
  }
});

test('CHK-TEST-0001-16 both hands stay on the rim of the steering wheel at every wheel angle, with rigid arm segments', () => {
  // AC-US-0002-04
  const fresh = buildKart01Model();
  const wheelNode = fresh.steeringWheel.parent!;
  wheelNode.updateWorldMatrix(true, false);
  const centre = new THREE.Vector3().setFromMatrixPosition(wheelNode.matrixWorld);
  const axis = new THREE.Vector3(0, 0, 1).applyQuaternion(new THREE.Quaternion().setFromRotationMatrix(wheelNode.matrixWorld)).normalize();
  for (const steer of [-0.36, -0.1, 0, 0.1, 0.36]) {
    updateKart01Pose(fresh, { steerAngleRad: steer, wheelSpinRevs: restSpin });
    for (const arm of fresh.arms) {
      const d = arm.glove.position.clone().sub(centre);
      const out = d.dot(axis);
      const onRim = d.clone().addScaledVector(axis, -out).length();
      assert.ok(near(onRim, 0.1386, 1e-6), `AC-US-0002-04: the ${arm.side < 0 ? 'left' : 'right'} glove must sit 0.1386 m from the wheel centre in the rim plane at steer ${steer} (${onRim})`);
      assert.ok(Math.abs(out) <= 0.0125, `AC-US-0002-04: the glove must stay on the rim plane at steer ${steer} (${out} m off)`);
      assert.ok(near(arm.forearm.position.clone().sub(arm.upperArm.position).length(), 0.285, 1e-6), `AC-US-0002-04: the upper arm must keep 0.285 m at steer ${steer}`);
      assert.ok(near(arm.glove.position.clone().sub(arm.forearm.position).length(), 0.27, 1e-6), `AC-US-0002-04: the forearm must reach the hand without stretching at steer ${steer}`);
      const forearm = (arm.forearm as THREE.Mesh).geometry;
      forearm.computeBoundingBox();
      assert.equal(Math.round((forearm.boundingBox!.max.y - forearm.boundingBox!.min.y) * 1000), 246, 'AC-US-0002-04: the forearm mesh is 0.246 m long');
    }
  }
});

test('CHK-TEST-0001-17 the four wheels rest on the ground: the bottom of their bounding box is at 0 m to the centimetre', (t) => {
  // AC-US-0002-05
  const box = boxOf(WHEELS.map(name => model.groups[name]));
  t.diagnostic(`wheels bounding box min.y ${box.min.y} m (14-segment lathe; RULE-0001 tolerance, to the centimetre)`);
  assert.equal(toCm(box.min.y), 0, `AC-US-0002-05: the wheels must touch the ground (min.y ${box.min.y})`);
  assert.ok(box.min.y >= 0, 'AC-US-0002-05: no wheel goes below the ground');
  for (const name of WHEELS) assert.ok(near(model.wheels[name].steer.position.y, model.wheels[name].diameterM / 2, 1e-12), `AC-US-0002-05: the centre of ${name} sits one radius above the ground`);
});

test('CHK-TEST-0001-18 the nose is at the model front (-Z), the rear bumper behind, and the root turned by pi puts the nose at +Z of the simulation', () => {
  // AC-US-0002-06
  const nose = boxOf([model.groups.nariz]), bumper = boxOf([model.groups.paraChoqueTraseiro]);
  assert.ok(nose.max.z < 0, `AC-US-0002-06: the nose box must be in -Z of the model (max.z ${nose.max.z})`);
  assert.ok(bumper.min.z > 0, `AC-US-0002-06: the rear bumper box must be in +Z of the model (min.z ${bumper.min.z})`);
  const turned = buildKart01Model();
  turned.root.rotation.y = Math.PI;
  turned.root.updateMatrixWorld(true);
  const noseTurned = new THREE.Box3().setFromObject(turned.groups.nariz, true);
  assert.ok(noseTurned.min.z > 0, `AC-US-0002-06: with the root turned by pi the nose is at +Z, the simulation front (min.z ${noseTurned.min.z})`);
});

test('CHK-TEST-0001-20 the kart root holds only the 15 part groups and the pilot: no drift indicator hangs from the model', () => {
  // AC-US-0005-04
  const groups = new Set<THREE.Object3D>(Object.values(model.groups));
  assert.equal(groups.size, 16, 'AC-US-0005-04: the model has the 15 part groups and the pilot');
  assert.equal(model.root.children.length, 16, `AC-US-0005-04: the root has exactly 16 children (${model.root.children.map(c => c.name).join(', ')})`);
  for (const child of model.root.children) assert.ok(groups.has(child), `AC-US-0005-04: ${child.name || child.type} under the root is a part group or the pilot`);
  assert.equal(meshesOf(model.root).length, measures.meshCount, 'AC-US-0005-04: every mesh under the root is one of the meshes DRAW_COST counts in the groups');
  const fresh = buildKart01Model();
  updateKart01Pose(fresh, { steerAngleRad: 0.36, wheelSpinRevs: { ...restSpin, rodaTraseiraEsq: 3, rodaTraseiraDir: 3 } });
  assert.equal(meshesOf(fresh.root).length, measures.meshCount, 'AC-US-0005-04: posing the kart in a full-lock slide adds no object to the model');
});

test('CHK-TEST-0001-21 the model has no exhaust outlet: bumperPlate is its only anchor and no node is the exhaust tip', () => {
  // AC-US-0005-05
  assert.deepEqual(Object.keys(model.anchors), ['bumperPlate'], 'AC-US-0005-05: bumperPlate is the only anchor of the model');
  const names: string[] = [];
  model.root.traverse(o => { names.push(o.name); });
  assert.ok(!names.includes('escapamentoSaida'), 'AC-US-0005-05: no node of the model is the exhaust outlet escapamentoSaida');
  assert.ok(!('exhaustOutlet' in model.anchors), 'AC-US-0005-05: the model carries no exhaustOutlet anchor');
});
