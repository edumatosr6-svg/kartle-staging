// TEST-0010 — the drawing of the Kart Park built in Node: asphalt from the file edges, curb stripes on the declared side with
// their drawn relief, the edge lines inside the asphalt, the barrier as tyre stacks over its whole length with its face on the
// contact surface, grass in two tones by ground position, start line, minimap transform (strategy: scene, integration level,
// DES-0008 2.1.0; no renderer is created).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import type { Point } from '../src/track';
import { BARRIER_HALF_WIDTH_M, classifySurface, closestOnSegment, nearestOnCenterline, lapMAtIndex } from '../src/trackGeometry';
import {
  buildTrackScene, CURB_RELIEF_M, CURB_STRIPE_M, EDGE_LINE_WIDTH_M, GRASS_TONES, grassToneAt, minimapTransform, TYRE_HEIGHT_M, TYRE_RADIUS_M,
  TYRE_SPACING_M, TYRES_PER_STACK,
} from '../src/trackScene';
import { kartParkFile, kartParkGeometry } from './fixtures/kartParkFiles';
import { Seeded } from './helpers/seeded';

const g = kartParkGeometry();
const file = kartParkFile();
const scene = buildTrackScene(g);
const child = <T extends THREE.Object3D>(name: string): T => { const c = scene.getObjectByName(name); if (!c) throw new Error(`fixture: no ${name}`); return c as T; };
const near = (a: number, b: number, tol: number) => Math.abs(a - b) <= tol;
// Positions are float32 attributes and matrices: at |coordinate| < 128 m one ulp is 7.6e-6 m.
const FLOAT32_M = 1e-4;
// Height of the curb mesh base, DES-0008 (row `curbs`: asphalt-side vertices at CURB_Y = 0.035); not exported by the module.
const CURB_Y = 0.035;
// The 1e-6 m of the strategy for the edge-line width is below the float32 attribute resolution near 100 m (ulp 7.6e-6 m):
// the measure is taken at 2e-5 m (98-divergences.md).
const EDGE_TOLERANCE_M = 2e-5;
const REFERENCE_GRASS = '#68865b';
// sRGB hex of a colour attribute entry (three stores the linear working space; getHexString converts back to sRGB).
const hexAt = (attr: THREE.BufferAttribute | THREE.InterleavedBufferAttribute, i: number) => `#${new THREE.Color(attr.getX(i), attr.getY(i), attr.getZ(i)).getHexString()}`;
// WCAG 2 relative luminance computed by the test itself (strategy, "luminância WCAG 2 no teste").
function luminance(hex: string): number {
  const channel = (k: number) => { const c = parseInt(hex.slice(1 + 2 * k, 3 + 2 * k), 16) / 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * channel(0) + 0.7152 * channel(1) + 0.0722 * channel(2);
}
// Translation of every barrier instance (the stack centres, read from the instance matrices).
function stackCentres(): Point[] {
  const barriers = child<THREE.InstancedMesh>('barriers');
  const matrix = new THREE.Matrix4(), position = new THREE.Vector3(), quaternion = new THREE.Quaternion(), scale = new THREE.Vector3();
  const out: Point[] = [];
  for (let i = 0; i < barriers.count; i++) { barriers.getMatrixAt(i, matrix); matrix.decompose(position, quaternion, scale); out.push({ x: position.x, z: position.z }); }
  return out;
}
// Outline of one tyre seen from above, from the vertices of the stack geometry (the ring vertices, ordered by angle).
function tyreOutline(): Point[] {
  const position = child<THREE.InstancedMesh>('barriers').geometry.getAttribute('position');
  const seen = new Map<string, Point>();
  for (let i = 0; i < position.count; i++) {
    const p = { x: position.getX(i), z: position.getZ(i) };
    if (Math.hypot(p.x, p.z) > 0.5 * TYRE_RADIUS_M) seen.set(`${p.x.toFixed(6)},${p.z.toFixed(6)}`, p);
  }
  return [...seen.values()].sort((a, b) => Math.atan2(a.z, a.x) - Math.atan2(b.z, b.x));
}
const insideConvex = (poly: Point[], p: Point) => poly.every((a, i) => { const b = poly[(i + 1) % poly.length]; return (b.x - a.x) * (p.z - a.z) - (b.z - a.z) * (p.x - a.x) > 1e-12; });
// Uniform hash grid of points for nearest-neighbour queries.
function pointGrid(points: Point[], cell: number) {
  const cells = new Map<string, Point[]>();
  const key = (i: number, j: number) => `${i},${j}`;
  for (const p of points) { const k = key(Math.floor(p.x / cell), Math.floor(p.z / cell)); (cells.get(k) ?? cells.set(k, []).get(k)!).push(p); }
  return (p: Point, reach: number) => {
    let best = Infinity;
    const r = Math.ceil(reach / cell), ci = Math.floor(p.x / cell), cj = Math.floor(p.z / cell);
    for (let i = ci - r; i <= ci + r; i++) for (let j = cj - r; j <= cj + r; j++) for (const q of cells.get(key(i, j)) ?? []) best = Math.min(best, Math.hypot(q.x - p.x, q.z - p.z));
    return best;
  };
}
// Distance of a point to the barrier polylines (closestOnSegment over barrierSegments), pruned by a segment grid.
const distanceToBarrier = (() => {
  const cell = 0.25, cells = new Map<string, number[]>();
  g.barrierSegments.forEach((s, k) => {
    for (let i = Math.floor((Math.min(s.a.x, s.b.x) - 0.3) / cell); i <= Math.floor((Math.max(s.a.x, s.b.x) + 0.3) / cell); i++)
      for (let j = Math.floor((Math.min(s.a.z, s.b.z) - 0.3) / cell); j <= Math.floor((Math.max(s.a.z, s.b.z) + 0.3) / cell); j++) { const key = `${i},${j}`; (cells.get(key) ?? cells.set(key, []).get(key)!).push(k); }
  });
  return (p: Point) => {
    const list = cells.get(`${Math.floor(p.x / cell)},${Math.floor(p.z / cell)}`);
    if (!list) return Infinity;
    let best = Infinity;
    for (const k of list) best = Math.min(best, closestOnSegment(g.barrierSegments[k].a, g.barrierSegments[k].b, p).distanceM);
    return best;
  };
})();
// Distance of a point to the asphalt edges of the file (both polylines).
const edgeDistance = (p: Point) => {
  let best = Infinity;
  for (const e of [g.leftEdge, g.rightEdge]) for (let i = 0; i < e.length; i++) best = Math.min(best, closestOnSegment(e[i], e[(i + 1) % e.length], p).distanceM);
  return best;
};

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

test('CHK-TEST-0010-03 the barrier is drawn in its whole length: a tyre stack centred on every vertex of each barrier line and consecutive stacks at most TYRE_SPACING_M apart on each segment', () => {
  // AC-US-0004-06, AC-US-0007-09
  const barriers = child<THREE.InstancedMesh>('barriers');
  assert.ok(barriers instanceof THREE.InstancedMesh, 'AC-US-0007-09: the barrier is one instanced mesh of tyre stacks');
  const centres = stackCentres();
  assert.ok(centres.length > 0, 'AC-US-0004-06: the barrier has stacks');
  const declared = g.barrierSegments.reduce((sum, s) => sum + Math.hypot(s.b.x - s.a.x, s.b.z - s.a.z), 0);
  assert.ok(declared > 40, `AC-US-0004-06: the Kart Park barrier of the version 2 is tens of metres long (${declared.toFixed(3)} m)`);
  const problems: string[] = [];
  g.barriers.forEach((line, l) => {
    line.points.forEach((p, i) => {
      const d = Math.min(...centres.map(c => Math.hypot(c.x - p.xM, c.z - p.zM)));
      if (d > FLOAT32_M) problems.push(`line ${l} vertex ${i}: nearest stack centre ${d.toFixed(4)} m away`);
      const q = line.points[i + 1];
      if (!q) return;
      const a = { x: p.xM, z: p.zM }, b = { x: q.xM, z: q.zM }, len = Math.hypot(b.x - a.x, b.z - a.z);
      const along = centres.map(c => closestOnSegment(a, b, c)).filter(c => c.distanceM <= FLOAT32_M).map(c => c.t * len).sort((u, v) => u - v);
      const stops = [0, ...along, len];
      for (let k = 1; k < stops.length; k++) if (stops[k] - stops[k - 1] > TYRE_SPACING_M + FLOAT32_M) problems.push(`line ${l} segment ${i}: a gap of ${(stops[k] - stops[k - 1]).toFixed(4)} m between stacks`);
    });
  });
  const stray = centres.filter(c => !g.barrierSegments.some(s => closestOnSegment(s.a, s.b, c).distanceM <= FLOAT32_M)).length;
  assert.deepEqual(problems, [], `AC-US-0004-06: ${problems.length} places where the drawn barrier does not cover the declared line: ${problems.slice(0, 3).join('; ')}`);
  assert.equal(stray, 0, `AC-US-0004-06: every stack stands on a barrier line (${stray} off it)`);
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
  assert.deepEqual(scene.children.map(c => c.name), ['grass', 'asphalt', 'edge-lines', 'curbs', 'barriers', 'start-line'], 'AC-US-0002-08: the six parts of the drawing (DES-0008, REQ-FEAT-0008-24)');
  assert.equal(buildTrackScene.length, 1, 'REQ-FEAT-0008-24: the drawing takes the geometry and nothing else');
});

// Edge-line strips: the layout of DES-0008 (one strip per edge, left then right, outer vertex 2i and inner vertex 2i + 1 of
// each of the n + 1 rows), read back from the drawn attribute.
const edgeStrips = () => {
  const lines = child<THREE.Mesh>('edge-lines');
  const position = lines.geometry.getAttribute('position');
  const n = g.centerline.length;
  const at = (strip: number, row: number, inner: 0 | 1): Point => { const v = strip * 2 * (n + 1) + 2 * row + inner; return { x: position.getX(v), z: position.getZ(v) }; };
  return { lines, position, n, at };
};

test('CHK-TEST-0010-06 each asphalt edge carries one closed edge-line strip of 691 segments on the asphalt, from the edge itself, unbroken at the curbs and at the start line', () => {
  // AC-US-0007-01
  const { lines, position, n, at } = edgeStrips();
  assert.equal(n, 691, 'AC-US-0007-01: the published centerline of the version 2 has 691 points');
  assert.equal(position.count, 2 * 2 * (n + 1), `AC-US-0007-01: two strips of n + 1 rows of two vertices (${position.count})`);
  const problems: string[] = [];
  [g.leftEdge, g.rightEdge].forEach((edge, strip) => {
    for (let i = 0; i <= n; i++) {
      const o = at(strip, i, 0), e = edge[i % n];
      if (Math.hypot(o.x - e.x, o.z - e.z) > FLOAT32_M) problems.push(`strip ${strip} row ${i}: outer vertex off the edge`);
    }
    for (let i = 0; i < n; i++) {
      const quad = [at(strip, i, 0), at(strip, i, 1), at(strip, i + 1, 0), at(strip, i + 1, 1)];
      const centre = { x: quad.reduce((s, p) => s + p.x, 0) / 4, z: quad.reduce((s, p) => s + p.z, 0) / 4 };
      if (classifySurface(g, centre) !== 'asphalt') problems.push(`strip ${strip} segment ${i}: centre not on the asphalt`);
    }
  });
  // Every segment is drawn: triangles covering the four vertices of each segment of each strip, none spanning two segments.
  const index = lines.geometry.getIndex()!;
  const covered = new Map<number, Set<number>>();
  for (let t = 0; t < index.count; t += 3) {
    const vs = [index.getX(t), index.getX(t + 1), index.getX(t + 2)];
    const strip = Math.floor(Math.min(...vs) / (2 * (n + 1))), local = vs.map(v => v - strip * 2 * (n + 1));
    const seg = Math.floor(Math.min(...local) / 2);
    if (seg >= n || local.some(v => v < 2 * seg || v > 2 * seg + 3)) { problems.push(`triangle ${t / 3} spans two segments`); continue; }
    const k = strip * n + seg;
    const set = covered.get(k) ?? covered.set(k, new Set()).get(k)!;
    for (const v of local) set.add(v);
  }
  for (let k = 0; k < 2 * n; k++) if ((covered.get(k)?.size ?? 0) !== 4) problems.push(`strip ${Math.floor(k / n)} segment ${k % n} not drawn`);
  assert.deepEqual(problems, [], `AC-US-0007-01: ${problems.length} defects of the edge lines: ${problems.slice(0, 3).join('; ')}`);
  // The start line leaves the edge line free at point 0: every corner of its squares is on the asphalt and at least EDGE_LINE_WIDTH_M from both edges.
  const line = child<THREE.Group>('start-line');
  let closest = Infinity;
  for (const c of line.children) {
    const f = { x: Math.sin(c.rotation.y), z: Math.cos(c.rotation.y) }, side = { x: f.z, z: -f.x };
    for (const [u, v] of [[-0.55, -0.35], [0.55, -0.35], [0.55, 0.35], [-0.55, 0.35]]) {
      const p = { x: c.position.x + side.x * u + f.x * v, z: c.position.z + side.z * u + f.z * v };
      closest = Math.min(closest, classifySurface(g, p) === 'asphalt' ? edgeDistance(p) : -1);
    }
  }
  assert.ok(closest >= EDGE_LINE_WIDTH_M, `AC-US-0007-01: the start line must leave at least ${EDGE_LINE_WIDTH_M} m to each edge at point 0 (${closest.toFixed(3)} m)`);
});

test('CHK-TEST-0010-07 on every segment of both strips the inner side of the edge line runs 0.10 m from the edge segment, measured perpendicular to it', () => {
  // AC-US-0007-02
  const { n, at } = edgeStrips();
  assert.ok(near(EDGE_LINE_WIDTH_M, 0.10, 1e-12), `AC-US-0007-02: the edge line is 0.10 m wide (${EDGE_LINE_WIDTH_M})`);
  let worst = 0, where = '';
  [g.leftEdge, g.rightEdge].forEach((edge, strip) => {
    for (let i = 0; i < n; i++) {
      const a = edge[i], b = edge[(i + 1) % n], len = Math.hypot(b.x - a.x, b.z - a.z);
      for (const row of [i, i + 1]) {
        const p = at(strip, row, 1);
        const d = Math.abs((b.x - a.x) * (p.z - a.z) - (b.z - a.z) * (p.x - a.x)) / len;
        if (Math.abs(d - 0.10) > worst) { worst = Math.abs(d - 0.10); where = `strip ${strip} segment ${i} row ${row}: ${d.toFixed(6)} m`; }
      }
    }
  });
  assert.ok(worst <= EDGE_TOLERANCE_M, `AC-US-0007-02: the edge line must be 0.10 m wide on every segment (worst deviation ${worst.toExponential(2)} m at ${where})`);
});

// Curb stripes: four vertices each; the two nearer the centerline are the asphalt side.
const curbStripes = () => {
  const position = child<THREE.Mesh>('curbs').geometry.getAttribute('position');
  const stripes: { inner: number[]; outer: number[] }[] = [];
  for (let q = 0; q < position.count; q += 4) {
    const vs = [0, 1, 2, 3].map(k => ({ y: position.getY(q + k), d: nearestOnCenterline(g, { x: position.getX(q + k), z: position.getZ(q + k) }).distanceM }));
    const order = [...vs].sort((a, b) => a.d - b.d);
    stripes.push({ inner: order.slice(0, 2).map(v => v.y), outer: order.slice(2).map(v => v.y) });
  }
  return stripes;
};

test('CHK-TEST-0010-08 every curb stripe has height 0 m on its asphalt side: those vertices stay at the curb base CURB_Y', () => {
  // AC-US-0007-05
  const stripes = curbStripes();
  assert.ok(stripes.length > 0, 'AC-US-0007-05: the curbs are drawn');
  const off = stripes.flatMap(s => s.inner).filter(y => Math.abs(y - CURB_Y) > 1e-6).length;
  assert.equal(off, 0, `AC-US-0007-05: ${off} asphalt-side curb vertices are not at the base height ${CURB_Y} m`);
});

test('CHK-TEST-0010-09 every curb stripe rises to CURB_RELIEF_M on its outer side, more than 0 m and at most 0.05 m above the base', () => {
  // AC-US-0007-06
  assert.ok(CURB_RELIEF_M > 0 && CURB_RELIEF_M <= 0.05, `AC-US-0007-06: the relief must be in (0, 0.05] m (${CURB_RELIEF_M})`);
  const heights = curbStripes().flatMap(s => s.outer.map(y => y - CURB_Y));
  const off = heights.filter(h => Math.abs(h - CURB_RELIEF_M) > 1e-6 || h <= 0 || h > 0.05 + 1e-6).length;
  assert.equal(off, 0, `AC-US-0007-06: ${off} outer curb vertices are not ${CURB_RELIEF_M} m above the base (range ${Math.min(...heights).toFixed(4)}..${Math.max(...heights).toFixed(4)} m)`);
});

test('CHK-TEST-0010-10 the tyre stacks are black: every vertex colour of the stack geometry has each sRGB channel at most 0.17', () => {
  // AC-US-0007-09
  const color = child<THREE.InstancedMesh>('barriers').geometry.getAttribute('color');
  assert.ok(color && color.count > 0, 'AC-US-0007-09: the stacks are coloured per vertex');
  const lightest = Math.max(...Array.from({ length: color.count }, (_, i) => { const h = hexAt(color, i); return Math.max(...[1, 3, 5].map(k => parseInt(h.slice(k, k + 2), 16) / 255)); }));
  assert.ok(lightest <= 0.17, `AC-US-0007-09: the tyres must be black (lightest sRGB channel ${lightest.toFixed(3)})`);
});

test('CHK-TEST-0010-11 a tyre stack stands from the ground to 0.9 m: TYRES_PER_STACK tyres of TYRE_HEIGHT_M', () => {
  // AC-US-0007-10
  const geometry = child<THREE.InstancedMesh>('barriers').geometry;
  geometry.computeBoundingBox();
  const box = geometry.boundingBox!;
  assert.ok(near(box.min.y, 0, 1e-6), `AC-US-0007-10: the stack starts on the ground (${box.min.y})`);
  assert.ok(near(box.max.y, 0.9, 1e-6), `AC-US-0007-10: the stack is 0.9 m high (${box.max.y})`);
  assert.ok(near(TYRES_PER_STACK * TYRE_HEIGHT_M, 0.9, 1e-9), `AC-US-0007-10: ${TYRES_PER_STACK} tyres of ${TYRE_HEIGHT_M} m make 0.9 m`);
});

test('CHK-TEST-0010-12 on both sides of the barrier the drawn tyre face is within 0.05 m of the collision face of the file, measured both ways', () => {
  // AC-US-0007-11
  const STEP_M = 0.005;
  // Contact boundary: the parallels at BARRIER_HALF_WIDTH_M of each segment and the circle of that radius around each vertex
  // (1 degree apart), keeping the points at least BARRIER_HALF_WIDTH_M from the whole polyline.
  const contact: Point[] = [];
  const vertices = new Map<string, Point>();
  for (const s of g.barrierSegments) {
    const len = Math.hypot(s.b.x - s.a.x, s.b.z - s.a.z);
    vertices.set(`${s.a.x},${s.a.z}`, s.a); vertices.set(`${s.b.x},${s.b.z}`, s.b);
    if (len === 0) continue;
    const nx = -(s.b.z - s.a.z) / len, nz = (s.b.x - s.a.x) / len;
    for (let k = 0; k <= Math.floor(len / STEP_M); k++) for (const side of [1, -1]) {
      const t = k * STEP_M / len;
      contact.push({ x: s.a.x + (s.b.x - s.a.x) * t + side * nx * BARRIER_HALF_WIDTH_M, z: s.a.z + (s.b.z - s.a.z) * t + side * nz * BARRIER_HALF_WIDTH_M });
    }
  }
  for (const v of vertices.values()) for (let deg = 0; deg < 360; deg++) contact.push({ x: v.x + BARRIER_HALF_WIDTH_M * Math.cos(deg * Math.PI / 180), z: v.z + BARRIER_HALF_WIDTH_M * Math.sin(deg * Math.PI / 180) });
  const boundary = contact.filter(p => distanceToBarrier(p) >= BARRIER_HALF_WIDTH_M - 1e-9);
  // Drawn face: the sides of each tyre polygon (stack centre from its instance matrix, outline from the stack geometry),
  // sampled every STEP_M, keeping the points outside every other tyre polygon.
  const outline = tyreOutline();
  const centres = stackCentres();
  const polygons = centres.map(c => outline.map(p => ({ x: c.x + p.x, z: c.z + p.z })));
  const byCell = new Map<string, number[]>();
  centres.forEach((c, i) => { const k = `${Math.floor(c.x / 0.25)},${Math.floor(c.z / 0.25)}`; (byCell.get(k) ?? byCell.set(k, []).get(k)!).push(i); });
  const neighbours = (c: Point) => { const out: number[] = []; const ci = Math.floor(c.x / 0.25), cj = Math.floor(c.z / 0.25); for (let i = ci - 1; i <= ci + 1; i++) for (let j = cj - 1; j <= cj + 1; j++) out.push(...(byCell.get(`${i},${j}`) ?? [])); return out; };
  const face: Point[] = [];
  polygons.forEach((poly, i) => {
    const others = neighbours(centres[i]).filter(j => j !== i);
    poly.forEach((a, k) => {
      const b = poly[(k + 1) % poly.length], len = Math.hypot(b.x - a.x, b.z - a.z);
      for (let m = 0; m * STEP_M < len; m++) {
        const p = { x: a.x + (b.x - a.x) * m * STEP_M / len, z: a.z + (b.z - a.z) * m * STEP_M / len };
        if (!others.some(j => insideConvex(polygons[j], p))) face.push(p);
      }
    });
  });
  assert.ok(boundary.length > 1000 && face.length > 1000, `AC-US-0007-11: both boundaries are sampled (${boundary.length} contact, ${face.length} face points)`);
  const nearestFace = pointGrid(face, 0.05);
  const contactToFace = boundary.reduce((worst, p) => Math.max(worst, nearestFace(p, 0.15)), 0);
  const faceToContact = face.reduce((worst, p) => Math.max(worst, Math.abs(distanceToBarrier(p) - BARRIER_HALF_WIDTH_M)), 0);
  assert.ok(contactToFace <= 0.05, `AC-US-0007-11: every point of the collision face must be within 0.05 m of the drawn tyres (worst ${contactToFace.toFixed(4)} m)`);
  assert.ok(faceToContact <= 0.05, `AC-US-0007-11: every point of the drawn tyre face must be within 0.05 m of the collision face (worst ${faceToContact.toFixed(4)} m)`);
});

test('CHK-TEST-0010-13 no tyre of the barrier stands on the asphalt or on a curb: 24 points of the outer circle of every tyre are grass', () => {
  // AC-US-0007-12
  const wrong: string[] = [];
  stackCentres().forEach((c, i) => {
    for (let k = 0; k < 24; k++) {
      const p = { x: c.x + TYRE_RADIUS_M * Math.cos(k * Math.PI / 12), z: c.z + TYRE_RADIUS_M * Math.sin(k * Math.PI / 12) };
      const surface = classifySurface(g, p);
      if (surface !== 'grass') wrong.push(`stack ${i} point ${k} on ${surface}`);
    }
  });
  assert.ok(stackCentres().length > 0, 'AC-US-0007-12: the barrier has tyres');
  assert.deepEqual(wrong, [], `AC-US-0007-12: ${wrong.length} tyre points off the grass: ${wrong.slice(0, 3).join('; ')}`);
});

test('CHK-TEST-0010-14 the grass shows exactly the two green tones of GRASS_TONES', () => {
  // AC-US-0007-13
  const color = child<THREE.Mesh>('grass').geometry.getAttribute('color');
  const tones = new Set(Array.from({ length: color.count }, (_, i) => hexAt(color, i)));
  assert.deepEqual([...tones].sort(), [...GRASS_TONES].sort(), `AC-US-0007-13: the grass colours must be the two tones (${[...tones].join(', ')})`);
  for (const t of GRASS_TONES) {
    const [r, gr, b] = [1, 3, 5].map(k => parseInt(t.slice(k, k + 2), 16));
    assert.ok(gr > r && gr > b, `AC-US-0007-13: ${t} must be green (green channel above red and blue)`);
  }
});

test('CHK-TEST-0010-15 the grass tone of each ground position is a function of the position only: the same in two builds and the tone grassToneAt gives', () => {
  // AC-US-0007-14
  const grass = child<THREE.Mesh>('grass');
  const again = buildTrackScene(g).getObjectByName('grass') as THREE.Mesh;
  for (const name of ['position', 'color'] as const) {
    assert.deepEqual(Array.from(again.geometry.getAttribute(name).array), Array.from(grass.geometry.getAttribute(name).array), `AC-US-0007-14: the grass ${name} attribute must be equal number for number in two builds`);
  }
  const position = grass.geometry.getAttribute('position'), color = grass.geometry.getAttribute('color');
  // Stripes of four vertices: the extent and the colour of each.
  const stripes: { x0: number; x1: number; z0: number; z1: number; tone: string }[] = [];
  for (let q = 0; q < position.count; q += 4) {
    const xs = [0, 1, 2, 3].map(k => position.getX(q + k)), zs = [0, 1, 2, 3].map(k => position.getZ(q + k));
    stripes.push({ x0: Math.min(...xs), x1: Math.max(...xs), z0: Math.min(...zs), z1: Math.max(...zs), tone: hexAt(color, q) });
  }
  const wrong = stripes.filter(s => s.tone !== GRASS_TONES[grassToneAt((s.x0 + s.x1) / 2, (s.z0 + s.z1) / 2)]).length;
  assert.equal(wrong, 0, `AC-US-0007-14: ${wrong} grass stripes are not drawn in the tone of their position`);
  const seeded = new Seeded(20261103);
  const misses: string[] = [];
  for (let i = 0; i < 1000; i++) {
    const p = { x: -999 + 1998 * seeded.next(), z: -999 + 1998 * seeded.next() };
    const holder = stripes.find(s => p.x >= s.x0 && p.x < s.x1 && p.z >= s.z0 && p.z <= s.z1);
    if (!holder || holder.tone !== GRASS_TONES[grassToneAt(p.x, p.z)]) misses.push(`(${p.x.toFixed(2)}, ${p.z.toFixed(2)})`);
  }
  assert.deepEqual(misses, [], `AC-US-0007-14: ${misses.length} of 1000 seeded positions are drawn in a tone other than grassToneAt gives: ${misses.slice(0, 3).join('; ')}`);
});

test('CHK-TEST-0010-16 the WCAG 2 relative luminance of each grass tone differs from that of #68865b by 8 % to 20 % of it', () => {
  // AC-US-0007-20
  const reference = luminance(REFERENCE_GRASS);
  for (const t of GRASS_TONES) {
    const ratio = Math.abs(luminance(t) - reference) / reference;
    assert.ok(ratio >= 0.08 && ratio <= 0.20, `AC-US-0007-20: ${t} differs from ${REFERENCE_GRASS} by ${(100 * ratio).toFixed(1)} % of its luminance (8 % to 20 % required)`);
  }
  const color = child<THREE.Mesh>('grass').geometry.getAttribute('color');
  const drawn = new Set(Array.from({ length: color.count }, (_, i) => hexAt(color, i)));
  assert.deepEqual([...drawn].sort(), [...GRASS_TONES].sort(), 'AC-US-0007-20: the drawn grass colours, back in sRGB, are those tones');
});
