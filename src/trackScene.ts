// Application layer: the Three.js group of a schema-3 track and the minimap transform (DES-0008 of pista-kart-park).
// Draws the declared geometry only; no track rule is decided here. No DOM: it builds geometry in Node too.
import * as THREE from 'three';
import { BARRIER_HALF_WIDTH_M, type Bounds, type TrackGeometry } from './trackGeometry';

// Length of each red or white stripe of a curb, in metres of lap distance (ADR-0006).
export const CURB_STRIPE_M = 1;
const ASPHALT_COLOR = '#434d48';
const CURB_COLORS = ['#c8423b', '#f0e9d5'];
const BARRIER_COLOR = '#e6dfc9';
const BARRIER_HEIGHT_M = 0.9;
const START_LINE_COLORS = ['#eff0df', '#25362f'];
const ASPHALT_Y = 0.03, CURB_Y = 0.035, START_LINE_Y = 0.055;
const MINIMAP_W = 220, MINIMAP_H = 150, MINIMAP_FIT_W = 200, MINIMAP_FIT_H = 130;

const standard = (color: string) => new THREE.MeshStandardMaterial({ color, roughness: 0.9 });

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
      for (const [x, z] of corners) { vertices.push(x, CURB_Y, z); colors.push(c.r, c.g, c.b); }
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

function barriersMesh(g: TrackGeometry): THREE.InstancedMesh {
  const count = g.barrierSegments.length;
  const mesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), standard(BARRIER_COLOR), Math.max(count, 1));
  mesh.count = count;
  mesh.name = 'barriers';
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  const transform = new THREE.Object3D();
  g.barrierSegments.forEach((s, i) => {
    const lengthM = Math.hypot(s.b.x - s.a.x, s.b.z - s.a.z);
    transform.position.set((s.a.x + s.b.x) / 2, BARRIER_HEIGHT_M / 2, (s.a.z + s.b.z) / 2);
    transform.rotation.set(0, Math.atan2(s.b.x - s.a.x, s.b.z - s.a.z), 0);
    transform.scale.set(2 * BARRIER_HALF_WIDTH_M, BARRIER_HEIGHT_M, lengthM);
    transform.updateMatrix();
    mesh.setMatrixAt(i, transform.matrix);
  });
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
  group.add(asphaltMesh(geometry), curbsMesh(geometry), barriersMesh(geometry), startLine(geometry));
  return group;
}

// Fits the track box into 200 x 130 px, centred in the 220 x 150 px canvas; scale in px/m, offsets in px.
export function minimapTransform(bounds: Bounds): { scale: number; offsetX: number; offsetY: number } {
  const w = Math.max(bounds.maxX - bounds.minX, 1e-9), h = Math.max(bounds.maxZ - bounds.minZ, 1e-9);
  const scale = Math.min(MINIMAP_FIT_W / w, MINIMAP_FIT_H / h);
  const cx = (bounds.minX + bounds.maxX) / 2, cz = (bounds.minZ + bounds.maxZ) / 2;
  return { scale, offsetX: MINIMAP_W / 2 - cx * scale, offsetY: MINIMAP_H / 2 - cz * scale };
}
