// TEST-0010 — the drawing of the Kart Park built in Node: asphalt from the file edges, curb stripes on the declared side, one
// barrier instance per segment covering its whole length, start line, minimap transform (strategy: scene, integration level,
// DES-0008; no renderer is created).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { BARRIER_HALF_WIDTH_M, classifySurface, nearestOnCenterline, lapMAtIndex } from '../src/trackGeometry';
import { buildTrackScene, CURB_STRIPE_M, minimapTransform } from '../src/trackScene';
import { kartParkFile, kartParkGeometry } from './fixtures/kartParkFiles';

const g = kartParkGeometry();
const file = kartParkFile();
const scene = buildTrackScene(g);
const child = <T extends THREE.Object3D>(name: string): T => { const c = scene.getObjectByName(name); if (!c) throw new Error(`fixture: no ${name}`); return c as T; };
const near = (a: number, b: number, tol: number) => Math.abs(a - b) <= tol;

test('CHK-TEST-0010-01 the asphalt mesh is the ribbon between the left and right edges of the file geometry, vertex for vertex', () => {
  // AC-US-0002-08
  const asphalt = child<THREE.Mesh>('asphalt');
  const position = asphalt.geometry.getAttribute('position');
  const n = g.centerline.length;
  assert.equal(position.count, 2 * (n + 1), 'AC-US-0002-08: two vertices per point plus the closing row');
  let worst = 0;
  for (let i = 0; i <= n; i++) {
    const l = g.leftEdge[i % n], r = g.rightEdge[i % n];
    worst = Math.max(worst, Math.hypot(position.getX(2 * i) - l.x, position.getZ(2 * i) - l.z), Math.hypot(position.getX(2 * i + 1) - r.x, position.getZ(2 * i + 1) - r.z));
  }
  assert.ok(worst <= 1e-4, `AC-US-0002-08: the asphalt vertices are the file edges (worst ${worst.toExponential(1)} m, float32)`);
  assert.equal(asphalt.geometry.getIndex()!.count, 6 * n, 'AC-US-0002-08: two triangles per segment');
  assert.ok(asphalt.receiveShadow, 'AC-US-0002-08: the asphalt receives the shadow');
});

test('CHK-TEST-0010-02 every curb stripe is drawn on the side of the track its span declares, alternating two colours every metre', () => {
  // AC-US-0005-03
  const curbs = child<THREE.Mesh>('curbs');
  const position = curbs.geometry.getAttribute('position'), color = curbs.geometry.getAttribute('color');
  assert.ok(position.count >= 4 * Math.floor(g.curbs.reduce((s, c) => s + c.toLapM - c.fromLapM, 0) / CURB_STRIPE_M), 'AC-US-0005-03: at least one stripe per metre of curb');
  const wrongSide: string[] = [];
  const colours = new Set<string>();
  for (let q = 0; q < position.count; q += 4) {
    const centre = { x: 0, z: 0 };
    for (let k = 0; k < 4; k++) { centre.x += position.getX(q + k) / 4; centre.z += position.getZ(q + k) / 4; }
    colours.add([color.getX(q), color.getY(q), color.getZ(q)].map(v => v.toFixed(3)).join(','));
    const nearest = nearestOnCenterline(g, centre);
    const lapM = lapMAtIndex(g, nearest.index, nearest.fraction);
    const spans = g.curbs.filter(c => lapM >= c.fromLapM - 0.5 && lapM <= c.toLapM + 0.5);
    const normal = g.normals[nearest.index];
    const leftward = (centre.x - nearest.position.x) * normal.x + (centre.z - nearest.position.z) * normal.z;
    const side = leftward > 0 ? 'LEFT' : 'RIGHT';
    if (!spans.some(c => c.side === side)) wrongSide.push(`stripe at ${lapM.toFixed(1)} m drawn on the ${side}`);
    if (classifySurface(g, centre) !== 'curb') wrongSide.push(`stripe at ${lapM.toFixed(1)} m is not on a curb`);
  }
  assert.deepEqual(wrongSide, [], `AC-US-0005-03: ${wrongSide.length} stripes off their declared side: ${wrongSide.slice(0, 3).join('; ')}`);
  assert.equal(colours.size, 2, `AC-US-0005-03: two stripe colours (${colours.size})`);
  // Every span is drawn: at least one stripe centre projects into each declared lap stretch.
  const covered = new Set<number>();
  for (let q = 0; q < position.count; q += 4) {
    const centre = { x: (position.getX(q) + position.getX(q + 2)) / 2, z: (position.getZ(q) + position.getZ(q + 2)) / 2 };
    const nearest = nearestOnCenterline(g, centre);
    const lapM = lapMAtIndex(g, nearest.index, nearest.fraction);
    g.curbs.forEach((c, i) => { if (lapM >= c.fromLapM - 0.5 && lapM <= c.toLapM + 0.5) covered.add(i); });
  }
  assert.equal(covered.size, g.curbs.length, `AC-US-0005-03: every one of the ${g.curbs.length} spans is drawn (${covered.size})`);
});

test('CHK-TEST-0010-03 the barrier is drawn in its whole length: one instance per segment, centred on it, scaled to its length, 0.2 m thick', () => {
  // AC-US-0004-06
  const barriers = child<THREE.InstancedMesh>('barriers');
  assert.equal(barriers.count, g.barrierSegments.length, 'AC-US-0004-06: one instance per barrier segment');
  const matrix = new THREE.Matrix4(), position = new THREE.Vector3(), quaternion = new THREE.Quaternion(), scale = new THREE.Vector3();
  let drawn = 0, declared = 0, worst = 0;
  g.barrierSegments.forEach((s, i) => {
    barriers.getMatrixAt(i, matrix);
    matrix.decompose(position, quaternion, scale);
    const length = Math.hypot(s.b.x - s.a.x, s.b.z - s.a.z);
    declared += length; drawn += scale.z;
    worst = Math.max(worst, Math.hypot(position.x - (s.a.x + s.b.x) / 2, position.z - (s.a.z + s.b.z) / 2), Math.abs(scale.z - length));
    assert.ok(near(scale.x, 2 * BARRIER_HALF_WIDTH_M, 1e-6), `AC-US-0004-06: instance ${i} is 0.2 m thick`);
    assert.ok(scale.y > 0.5, `AC-US-0004-06: instance ${i} stands above the ground`);
  });
  assert.ok(near(drawn, declared, 1e-6), `AC-US-0004-06: the drawn length ${drawn.toFixed(3)} m equals the declared ${declared.toFixed(3)} m`);
  assert.ok(worst <= 1e-4, `AC-US-0004-06: every instance sits on its segment (worst ${worst.toExponential(1)} m, float32 matrices)`);
  assert.ok(declared > 50, 'AC-US-0004-06: the Kart Park barrier is tens of metres long');
  assert.ok(barriers.castShadow, 'AC-US-0004-06: the barrier casts a shadow');
});

test('CHK-TEST-0010-04 the start line is drawn across the asphalt at point 0, as wide as the track there', () => {
  // AC-US-0002-03
  const line = child<THREE.Group>('start-line');
  const p0 = { x: file.centerline[0].xM, z: file.centerline[0].zM };
  assert.ok(line.children.length >= 2, 'AC-US-0002-03: at least two squares');
  const across = line.children.map(c => Math.hypot(c.position.x - p0.x, c.position.z - p0.z));
  assert.ok(Math.max(...across) <= file.centerline[0].widthM / 2 + 1, 'AC-US-0002-03: the squares stay within the asphalt width at point 0');
  assert.equal(line.children.length, 2 * Math.max(1, Math.floor(file.centerline[0].widthM / 1.1)), 'AC-US-0002-03: columns by the width at point 0');
});

test('CHK-TEST-0010-05 the minimap transform fits the track box into the canvas with a margin', () => {
  // AC-US-0002-08
  const t = minimapTransform(g.bounds);
  const w = g.bounds.maxX - g.bounds.minX, h = g.bounds.maxZ - g.bounds.minZ;
  assert.ok(near(t.scale, Math.min(200 / w, 130 / h), 1e-12), 'AC-US-0002-08: the scale fits 200 x 130 px');
  for (const [x, z] of [[g.bounds.minX, g.bounds.minZ], [g.bounds.maxX, g.bounds.maxZ], [g.bounds.minX, g.bounds.maxZ], [g.bounds.maxX, g.bounds.minZ]]) {
    const px = x * t.scale + t.offsetX, py = z * t.scale + t.offsetY;
    assert.ok(px >= 10 - 1e-9 && px <= 210 + 1e-9 && py >= 10 - 1e-9 && py <= 140 + 1e-9, `AC-US-0002-08: the corner (${x.toFixed(1)}, ${z.toFixed(1)}) maps inside the canvas (${px.toFixed(1)}, ${py.toFixed(1)})`);
  }
  assert.deepEqual(scene.children.map(c => c.name), ['asphalt', 'curbs', 'barriers', 'start-line'], 'AC-US-0002-08: the four parts of the drawing');
});
