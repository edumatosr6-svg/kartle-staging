// Application layer: the Three.js group of a schema-3 track and the minimap transform (DES-0008 of pista-kart-park).
// Draws the declared geometry only; no track rule is decided here. No DOM: it builds geometry in Node too.
import * as THREE from 'three';
import type { Point } from './track';
import { BARRIER_HALF_WIDTH_M, type Bounds, type TrackGeometry } from './trackGeometry';

// Length of each red or white stripe of a curb, in metres of lap distance (ADR-0006).
export const CURB_STRIPE_M = 1;
// Visual finish of RULE-0006 (seed revision 2), in game-world metres; drawing only, the simulation reads none of it.
export const EDGE_LINE_WIDTH_M = 0.10;
export const CURB_RELIEF_M = 0.04;
// The tyre row is as thick as the barrier contact surface of ADR-0003, so no tyre reaches past it.
export const TYRE_RADIUS_M = BARRIER_HALF_WIDTH_M;
export const TYRE_SEGMENTS = 12;
export const TYRE_HEIGHT_M = 0.18;
export const TYRES_PER_STACK = 5;
export const TYRE_SPACING_M = 0.12;
export const GRASS_STRIPE_M = 5;
export const GRASS_TONES = ['#6e8f60', '#627d56'] as const;
const ASPHALT_COLOR = '#434d48';
const EDGE_LINE_COLOR = '#f2f2ec';
const CURB_COLORS = ['#c8423b', '#f0e9d5'];
const TYRE_COLORS = ['#1b1b1b', '#2a2a2a'];
const START_LINE_COLORS = ['#eff0df', '#25362f'];
const GRASS_Y = 0, ASPHALT_Y = 0.03, EDGE_LINE_Y = 0.033, CURB_Y = 0.035, START_LINE_Y = 0.055;
// The same 2,000 x 2,000 m square as the ground plane of src/main.ts.
const GRASS_HALF_SIZE_M = 1000;
const MINIMAP_W = 220, MINIMAP_H = 150, MINIMAP_FIT_W = 200, MINIMAP_FIT_H = 130;

const standard = (color: string) => new THREE.MeshStandardMaterial({ color, roughness: 0.9 });

// Index in GRASS_TONES of the grass tone at a ground position: stripes of GRASS_STRIPE_M along x, a function of position only.
export function grassToneAt(xM: number, zM: number): 0 | 1 {
  void zM;
  return (((Math.floor(xM / GRASS_STRIPE_M) % 2) + 2) % 2) as 0 | 1;
}

function grassMesh(): THREE.Mesh {
  const vertices: number[] = [], colors: number[] = [], normals: number[] = [], indices: number[] = [];
  const tones = GRASS_TONES.map(t => new THREE.Color(t));
  const stripes = Math.round(2 * GRASS_HALF_SIZE_M / GRASS_STRIPE_M);
  for (let s = 0; s < stripes; s++) {
    const x0 = -GRASS_HALF_SIZE_M + s * GRASS_STRIPE_M, x1 = x0 + GRASS_STRIPE_M;
    const c = tones[grassToneAt(x0, 0)];
    const base = vertices.length / 3;
    for (const [x, z] of [[x0, -GRASS_HALF_SIZE_M], [x1, -GRASS_HALF_SIZE_M], [x1, GRASS_HALF_SIZE_M], [x0, GRASS_HALF_SIZE_M]]) {
      vertices.push(x, GRASS_Y, z); colors.push(c.r, c.g, c.b); normals.push(0, 1, 0);
    }
    indices.push(base, base + 3, base + 1, base + 1, base + 3, base + 2);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9 }));
  mesh.name = 'grass';
  mesh.receiveShadow = true;
  return mesh;
}

function asphaltMesh(g: TrackGeometry): THREE.Mesh {
  const n = g.centerline.length;
  const vertices: number[] = [], indices: number[] = [];
  for (let i = 0; i <= n; i++) {
    const l = g.leftEdge[i % n], r = g.rightEdge[i % n];
    vertices.push(l.x, ASPHALT_Y, l.z, r.x, ASPHALT_Y, r.z);
    if (i < n) { const k = i * 2; indices.push(k, k + 2, k + 1, k + 1, k + 2, k + 3); }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  const material = standard(ASPHALT_COLOR);
  material.side = THREE.DoubleSide;
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = 'asphalt';
  mesh.receiveShadow = true;
  return mesh;
}

// Unit normal of segment a->b pointing to the side of `toward` (the centerline, i.e. into the asphalt).
function inwardNormal(a: Point, b: Point, toward: Point): Point {
  const dx = b.x - a.x, dz = b.z - a.z, l = Math.hypot(dx, dz) || 1;
  const n = { x: -dz / l, z: dx / l };
  const side = n.x * (toward.x - (a.x + b.x) / 2) + n.z * (toward.z - (a.z + b.z) / 2);
  return side < 0 ? { x: -n.x, z: -n.z } : n;
}

// One closed strip per asphalt edge; each inner segment runs parallel to its edge segment, EDGE_LINE_WIDTH_M inside it.
function edgeLinesMesh(g: TrackGeometry): THREE.Mesh {
  const n = g.centerline.length;
  const center = (i: number): Point => { const p = g.centerline[(i + n) % n]; return { x: p.xM, z: p.zM }; };
  const mid = (i: number): Point => { const a = center(i), b = center(i + 1); return { x: (a.x + b.x) / 2, z: (a.z + b.z) / 2 }; };
  const vertices: number[] = [], indices: number[] = [];
  for (const edge of [g.leftEdge, g.rightEdge]) {
    const at = (i: number) => edge[(i + n) % n];
    const base = vertices.length / 3;
    for (let i = 0; i <= n; i++) {
      const p = at(i);
      const before = inwardNormal(at(i - 1), p, mid(i - 1)), after = inwardNormal(p, at(i + 1), mid(i));
      // Bisector m scaled by width / cos(theta / 2), written as (na + nb) * width / (1 + na . nb).
      const k = EDGE_LINE_WIDTH_M / (1 + before.x * after.x + before.z * after.z);
      vertices.push(p.x, EDGE_LINE_Y, p.z, p.x + (before.x + after.x) * k, EDGE_LINE_Y, p.z + (before.z + after.z) * k);
      if (i < n) { const v = base + i * 2; indices.push(v, v + 2, v + 1, v + 1, v + 2, v + 3); }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  const material = standard(EDGE_LINE_COLOR);
  material.side = THREE.DoubleSide;
  material.polygonOffset = true;
  material.polygonOffsetFactor = -1;
  material.polygonOffsetUnits = -1;
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = 'edge-lines';
  mesh.receiveShadow = true;
  return mesh;
}

// Each curb quad is split every CURB_STRIPE_M of lap distance; the stripe colour alternates from the span's fromLapM.
function curbsMesh(g: TrackGeometry): THREE.Mesh {
  const vertices: number[] = [], colors: number[] = [], indices: number[] = [];
  const colorA = new THREE.Color(CURB_COLORS[0]), colorB = new THREE.Color(CURB_COLORS[1]);
  const spanStartM: number[] = [];
  g.curbQuads.forEach((quad, k) => {
    const spanIndex = g.curbQuadSpan[k];
    const span = g.curbs[spanIndex];
    const [e0, e1, o1, o0] = quad;
    const quadLengthM = Math.hypot(e1.x - e0.x, e1.z - e0.z);
    // Lap distance at the start of this quad: the span start plus the lengths of the quads before it in the same span.
    const startM = spanStartM[spanIndex] ?? 0;
    spanStartM[spanIndex] = startM + quadLengthM;
    const pieces = Math.max(1, Math.ceil(quadLengthM / CURB_STRIPE_M - 1e-9));
    for (let s = 0; s < pieces; s++) {
      const t0 = Math.min(1, s * CURB_STRIPE_M / quadLengthM), t1 = Math.min(1, (s + 1) * CURB_STRIPE_M / quadLengthM);
      const stripe = Math.floor((span.fromLapM + startM + t0 * quadLengthM - span.fromLapM) / CURB_STRIPE_M);
      const c = stripe % 2 === 0 ? colorA : colorB;
      const corners = [
        [e0.x + (e1.x - e0.x) * t0, e0.z + (e1.z - e0.z) * t0], [e0.x + (e1.x - e0.x) * t1, e0.z + (e1.z - e0.z) * t1],
        [o0.x + (o1.x - o0.x) * t1, o0.z + (o1.z - o0.z) * t1], [o0.x + (o1.x - o0.x) * t0, o0.z + (o1.z - o0.z) * t0],
      ];
      const base = vertices.length / 3;
      // Asphalt-side corners at CURB_Y, outer corners raised by CURB_RELIEF_M: each stripe is a ramp.
      corners.forEach(([x, z], v) => { vertices.push(x, v < 2 ? CURB_Y : CURB_Y + CURB_RELIEF_M, z); colors.push(c.r, c.g, c.b); });
      indices.push(base, base + 1, base + 2, base, base + 2, base + 3);
    }
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  const material = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = 'curbs';
  mesh.receiveShadow = true;
  return mesh;
}

// One stack: TYRES_PER_STACK open cylinders from y 0 to the stack height, plus the cap of the top tyre.
function tyreStackGeometry(): THREE.BufferGeometry {
  const vertices: number[] = [], normals: number[] = [], colors: number[] = [], indices: number[] = [];
  const tones = TYRE_COLORS.map(t => new THREE.Color(t));
  const angle = (j: number) => (j % TYRE_SEGMENTS) * 2 * Math.PI / TYRE_SEGMENTS;
  for (let t = 0; t < TYRES_PER_STACK; t++) {
    const c = tones[t % 2], y0 = t * TYRE_HEIGHT_M, y1 = y0 + TYRE_HEIGHT_M;
    const base = vertices.length / 3;
    for (let j = 0; j < TYRE_SEGMENTS; j++) {
      const s = Math.sin(angle(j)), k = Math.cos(angle(j));
      for (const y of [y0, y1]) { vertices.push(TYRE_RADIUS_M * s, y, TYRE_RADIUS_M * k); normals.push(s, 0, k); colors.push(c.r, c.g, c.b); }
    }
    for (let j = 0; j < TYRE_SEGMENTS; j++) {
      const b0 = base + 2 * j, t0 = b0 + 1, b1 = base + 2 * ((j + 1) % TYRE_SEGMENTS), t1 = b1 + 1;
      indices.push(b0, b1, t1, b0, t1, t0);
    }
  }
  const top = TYRES_PER_STACK * TYRE_HEIGHT_M, c = tones[(TYRES_PER_STACK - 1) % 2];
  const center = vertices.length / 3;
  vertices.push(0, top, 0); normals.push(0, 1, 0); colors.push(c.r, c.g, c.b);
  for (let j = 0; j < TYRE_SEGMENTS; j++) {
    vertices.push(TYRE_RADIUS_M * Math.sin(angle(j)), top, TYRE_RADIUS_M * Math.cos(angle(j))); normals.push(0, 1, 0); colors.push(c.r, c.g, c.b);
    indices.push(center, center + 1 + j, center + 1 + (j + 1) % TYRE_SEGMENTS);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  return geometry;
}

// A stack on every vertex of each barrier polyline, and between them so two consecutive stacks are at most TYRE_SPACING_M apart.
function tyreStackCentres(g: TrackGeometry): Point[] {
  const centres: Point[] = [];
  for (const line of g.barriers) {
    line.points.forEach((p, i) => {
      centres.push({ x: p.xM, z: p.zM });
      const q = line.points[i + 1];
      if (!q) return;
      const l = Math.hypot(q.xM - p.xM, q.zM - p.zM), m = Math.ceil(l / TYRE_SPACING_M);
      for (let j = 1; j < m; j++) centres.push({ x: p.xM + (q.xM - p.xM) * j / m, z: p.zM + (q.zM - p.zM) * j / m });
    });
  }
  return centres;
}

function barriersMesh(g: TrackGeometry): THREE.InstancedMesh {
  const centres = tyreStackCentres(g);
  const material = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9 });
  const mesh = new THREE.InstancedMesh(tyreStackGeometry(), material, Math.max(centres.length, 1));
  mesh.count = centres.length;
  mesh.name = 'barriers';
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  // Translation only: every tyre polygon keeps the geometry's orientation.
  const matrix = new THREE.Matrix4();
  centres.forEach((p, i) => mesh.setMatrixAt(i, matrix.makeTranslation(p.x, 0, p.z)));
  mesh.instanceMatrix.needsUpdate = true;
  return mesh;
}

// Alternating 1.1 x 0.7 m squares across the asphalt at point 0, along its normal, like the synthetic start line.
function startLine(g: TrackGeometry): THREE.Group {
  const group = new THREE.Group();
  group.name = 'start-line';
  const p = g.centerline[0], n = g.normals[0];
  const width = p.widthM;
  const columns = Math.max(1, Math.floor(width / 1.1));
  const heading = Math.atan2(g.centerline[1 % g.centerline.length].xM - p.xM, g.centerline[1 % g.centerline.length].zM - p.zM);
  const box = new THREE.BoxGeometry(1, 1, 1);
  const materials = START_LINE_COLORS.map(standard);
  for (let x = 0; x < columns; x++) for (let z = 0; z < 2; z++) {
    const mesh = new THREE.Mesh(box, materials[(x + z) % 2]);
    const across = (x - (columns - 1) / 2) * 1.1;
    const along = z * 0.7;
    const forward = { x: Math.sin(heading), z: Math.cos(heading) };
    mesh.position.set(p.xM + n.x * across + forward.x * along, START_LINE_Y, p.zM + n.z * across + forward.z * along);
    mesh.rotation.y = heading;
    mesh.scale.set(1.1, 0.02, 0.7);
    mesh.receiveShadow = true;
    group.add(mesh);
  }
  return group;
}

export function buildTrackScene(geometry: TrackGeometry): THREE.Group {
  const group = new THREE.Group();
  group.name = 'track';
  group.add(grassMesh(), asphaltMesh(geometry), edgeLinesMesh(geometry), curbsMesh(geometry), barriersMesh(geometry), startLine(geometry));
  return group;
}

// Fits the track box into 200 x 130 px, centred in the 220 x 150 px canvas; scale in px/m, offsets in px.
export function minimapTransform(bounds: Bounds): { scale: number; offsetX: number; offsetY: number } {
  const w = Math.max(bounds.maxX - bounds.minX, 1e-9), h = Math.max(bounds.maxZ - bounds.minZ, 1e-9);
  const scale = Math.min(MINIMAP_FIT_W / w, MINIMAP_FIT_H / h);
  const cx = (bounds.minX + bounds.maxX) / 2, cz = (bounds.minZ + bounds.maxZ) / 2;
  return { scale, offsetX: MINIMAP_W / 2 - cx * scale, offsetY: MINIMAP_H / 2 - cz * scale };
}
