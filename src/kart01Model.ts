// Application layer (DES-0001, ADR-0001): the Kart 01 with its pilot, transcribed from docs/kart-01/kart.js (the
// Cowork code, the source of the feature) with the same geometries, measures (MEDIDAS), colours (CORES) and arm
// kinematics. What changes is only what the draw-call budget asks: every solid piece shares one vertex-coloured
// material and the meshes of a group (or of an animated node) are merged into one; the decals keep their own
// materials and are painted by src/kart01Decals.ts. No DOM here: the model builds and measures in Node.
//
// Model frame (the Cowork frame): metres, Y up, kart front = -Z, pilot's right = +X, origin on the ground at the
// middle of the wheelbase. src/main.ts turns root by π around Y to enter the simulation frame (front +Z).
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

export const KART01_GROUP_NAMES = [
  'chassi', 'eixoTraseiro', 'rodaDianteiraEsq', 'rodaDianteiraDir', 'rodaTraseiraEsq', 'rodaTraseiraDir', 'nariz',
  'painelFrontal', 'sidepodEsq', 'sidepodDir', 'paraChoqueTraseiro', 'banco', 'direcao', 'pedais', 'motor',
] as const;
export const PILOT_GROUP_NAME = 'piloto';
export type Kart01GroupName = typeof KART01_GROUP_NAMES[number] | typeof PILOT_GROUP_NAME;
export type WheelName = 'rodaDianteiraEsq' | 'rodaDianteiraDir' | 'rodaTraseiraEsq' | 'rodaTraseiraDir';

// CORES of kart.js in #RRGGBB; carenagem, chassi, placa and macacao are the four colours of the kart sheet.
export const KART01_PALETTE = Object.freeze({
  carenagem: '#FF6A13', borracha: '#1E2024', chassi: '#2B2E34', bandeja: '#3A3E45', pneu: '#1A1B1F', aro: '#C5CAD1',
  cubo: '#3A3E45', banco: '#1E2024', volante: '#26292E', motor: '#5A6069', motorEscuro: '#33373D', escapamento: '#B9BEC6',
  placa: '#F4F3EF', macacao: '#2F55D4', luvas: '#1C1D21', capacete: '#F4F3EF', viseira: '#1A2233', disco: '#8A9099',
});
export const KART01_NUMBER = '01';
// MEDIDAS of kart.js.
export const KART01_WHEELBASE_M = 1.05;
export const FRONT_WHEEL_DIAMETER_M = 0.26;
export const REAR_WHEEL_DIAMETER_M = 0.28;
export const STEERING_WHEEL_RATIO = 2.2;

export function steeringWheelAngleRad(steerAngleRad: number): number {
  return STEERING_WHEEL_RATIO * steerAngleRad;
}

export type ArmNodes = { side: -1 | 1; shoulder: THREE.Vector3; upperArm: THREE.Object3D; forearm: THREE.Object3D; glove: THREE.Object3D };

export type Kart01Model = {
  root: THREE.Group;
  groups: Record<Kart01GroupName, THREE.Group>;
  wheels: Record<WheelName, { steer: THREE.Group; spin: THREE.Group; diameterM: number }>;
  steeringWheel: THREE.Group;
  arms: readonly [ArmNodes, ArmNodes];
  anchors: { bumperPlate: THREE.Mesh };
  materials: { body: THREE.MeshStandardMaterial; plate: THREE.MeshStandardMaterial; sidepod: THREE.MeshStandardMaterial };
  palette: typeof KART01_PALETTE;
};

// Steering wheel: centre, column tilt and radius (VOLANTE of kart.js).
const VOLANTE = { centro: new THREE.Vector3(0, 0.46, -0.18), inclinacao: -0.686, raio: 0.15, pegada: 0.1386 };
const ARM_UPPER_M = 0.285, ARM_LOWER_M = 0.27;
const UP = new THREE.Vector3(0, 1, 0);

// ---------------------------------------------------------------- geometry helpers of kart.js, unchanged

type Vec = THREE.Vector3 | readonly number[];
const v3 = (p: Vec): THREE.Vector3 => (p instanceof THREE.Vector3 ? p.clone() : new THREE.Vector3(p[0], p[1], p[2]));

function centralizarEixo(g: THREE.BufferGeometry, eixo: 'x' | 'y' | 'z'): THREE.BufferGeometry {
  g.computeBoundingBox();
  const b = g.boundingBox!;
  const t = new THREE.Vector3();
  t[eixo] = -(b.min[eixo] + b.max[eixo]) / 2;
  g.translate(t.x, t.y, t.z);
  return g;
}

function opcoesExtrusao(espessura: number, chanfro: number): THREE.ExtrudeGeometryOptions {
  const c = Math.max(0, Math.min(chanfro, espessura / 2 - 0.0005));
  return {
    depth: Math.max(0.0005, espessura - 2 * c),
    bevelEnabled: c > 0, bevelThickness: c, bevelSize: c, bevelOffset: -c, bevelSegments: 1, curveSegments: 1, steps: 1,
  };
}

// Side profile: points [z, y], extruded along X (width) and centred at x0.
function perfilLateral(pontos: readonly (readonly number[])[], largura: number, chanfro = 0.02, x0 = 0): THREE.BufferGeometry {
  const forma = new THREE.Shape(pontos.map(([z, y]) => new THREE.Vector2(z, y)));
  const g = new THREE.ExtrudeGeometry(forma, opcoesExtrusao(largura, chanfro));
  g.rotateY(-Math.PI / 2);
  centralizarEixo(g, 'x');
  if (x0) g.translate(x0, 0, 0);
  return g;
}

// Plan profile: points [x, z], extruded upwards from y0 to y1.
function perfilPlanta(pontos: readonly (readonly number[])[], y0: number, y1: number, chanfro = 0.02): THREE.BufferGeometry {
  const forma = new THREE.Shape(pontos.map(([x, z]) => new THREE.Vector2(x, -z)));
  const g = new THREE.ExtrudeGeometry(forma, opcoesExtrusao(y1 - y0, chanfro));
  g.rotateX(-Math.PI / 2);
  g.computeBoundingBox();
  g.translate(0, y0 - g.boundingBox!.min.y, 0);
  return g;
}

// Front profile: points [x, y], thickness along Z, centred.
function perfilFrontal(pontos: readonly (readonly number[])[], espessura: number, chanfro = 0.01): THREE.BufferGeometry {
  const forma = new THREE.Shape(pontos.map(([x, y]) => new THREE.Vector2(x, y)));
  const g = new THREE.ExtrudeGeometry(forma, opcoesExtrusao(espessura, chanfro));
  return centralizarEixo(g, 'z');
}

// Raises or lowers the top vertices (y >= yCorte) by a planar function of (x, z).
function inclinarTopo(g: THREE.BufferGeometry, yCorte: number, delta: (x: number, z: number) => number): THREE.BufferGeometry {
  const p = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    const y = p.getY(i);
    if (y >= yCorte) p.setY(i, y + delta(p.getX(i), p.getZ(i)));
  }
  p.needsUpdate = true;
  g.computeVertexNormals();
  g.computeBoundingBox();
  return g;
}

function retanguloChanfrado(w: number, h: number, c: number): number[][] {
  return [
    [-w / 2 + c, -h / 2], [w / 2 - c, -h / 2], [w / 2, -h / 2 + c], [w / 2, h / 2 - c],
    [w / 2 - c, h / 2], [-w / 2 + c, h / 2], [-w / 2, h / 2 - c], [-w / 2, -h / 2 + c],
  ];
}

// Box with every edge chamfered, centred at the origin (w = X, h = Y, d = Z).
function caixa(w: number, h: number, d: number, c = 0.01): THREE.BufferGeometry {
  c = Math.max(0.0005, Math.min(c, w / 2 - 0.001, h / 2 - 0.001, d / 2 - 0.001));
  return perfilLateral(retanguloChanfrado(d, h, c), w, c);
}

function cilindro(raio: number, comprimento: number, segs: number, eixo: 'x' | 'y' | 'z', raioTopo = raio): THREE.BufferGeometry {
  const g = new THREE.CylinderGeometry(raioTopo, raio, comprimento, segs, 1);
  if (eixo === 'x') g.rotateZ(-Math.PI / 2);
  if (eixo === 'z') g.rotateX(Math.PI / 2);
  return g;
}

// Paints every face of a non-indexed geometry (linear colours), as pintarFaces of kart.js.
function pintarFaces(g: THREE.BufferGeometry, corDaFace: (centro: THREE.Vector3) => string): THREE.BufferGeometry {
  g = g.index ? g.toNonIndexed() : g;
  const p = g.attributes.position as THREE.BufferAttribute;
  const cores = new Float32Array(p.count * 3);
  const c = new THREE.Color();
  const centro = new THREE.Vector3();
  for (let i = 0; i < p.count; i += 3) {
    centro.set(
      (p.getX(i) + p.getX(i + 1) + p.getX(i + 2)) / 3,
      (p.getY(i) + p.getY(i + 1) + p.getY(i + 2)) / 3,
      (p.getZ(i) + p.getZ(i + 1) + p.getZ(i + 2)) / 3,
    );
    c.set(corDaFace(centro));
    for (let k = 0; k < 3; k++) cores.set([c.r, c.g, c.b], (i + k) * 3);
  }
  g.setAttribute('color', new THREE.BufferAttribute(cores, 3));
  return g;
}

// ---------------------------------------------------------------- parts and merging (ADR-0001)

// A solid piece of the Cowork model: its geometry, its original colour and its transform inside the node that
// will hold the merged mesh. Pieces already painted per face (pintarFaces) carry their own colour attribute.
type Part = { geometry: THREE.BufferGeometry; color?: string; matrix: THREE.Matrix4 };

class Bucket {
  readonly parts: Part[] = [];
  constructor(readonly name: string) {}
  // A piece at a position and Euler rotation, as `no(malha(...), x, y, z, rx, ry, rz)` of kart.js.
  add(geometry: THREE.BufferGeometry, color: string | undefined, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, scale?: Vec): this {
    const matrix = new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(rx, ry, rz)), scale ? v3(scale) : new THREE.Vector3(1, 1, 1));
    this.parts.push({ geometry, color, matrix });
    return this;
  }
  // A unit cylinder stretched from a to b, as `tubo(a, b, raio, material, segs)` of kart.js (posicionarTubo).
  tubo(a: Vec, b: Vec, raio: number, color: string, segs = 6): this {
    const A = v3(a);
    const d = v3(b).sub(A);
    const L = d.length();
    const position = A.clone().addScaledVector(d, 0.5);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(UP, d.normalize());
    const matrix = new THREE.Matrix4().compose(position, quaternion, new THREE.Vector3(1, L, 1));
    this.parts.push({ geometry: new THREE.CylinderGeometry(raio, raio, 1, segs, 1), color, matrix });
    return this;
  }
  // A piece inside a transformed sub-group (the helmet of kart.js): the group's matrix composes with the piece's.
  addIn(groupMatrix: THREE.Matrix4, geometry: THREE.BufferGeometry, color: string | undefined, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0): this {
    const local = new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(rx, ry, rz)), new THREE.Vector3(1, 1, 1));
    this.parts.push({ geometry, color, matrix: groupMatrix.clone().multiply(local) });
    return this;
  }
}

// Merges the pieces of a bucket into one mesh of the body material: each geometry is made non-indexed (every
// triangle preserved), transformed into the node frame and coloured per vertex with the original colour.
function bake(bucket: Bucket, material: THREE.MeshStandardMaterial): THREE.Mesh {
  const color = new THREE.Color();
  const geometries = bucket.parts.map(part => {
    const g = part.geometry.index ? part.geometry.toNonIndexed() : part.geometry;
    g.applyMatrix4(part.matrix);
    if (!g.attributes.color) {
      color.set(part.color ?? '#FFFFFF');
      const count = g.attributes.position.count;
      const colors = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) colors.set([color.r, color.g, color.b], i * 3);
      g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    }
    return g;
  });
  const merged = mergeGeometries(geometries, false);
  for (const g of geometries) g.dispose();
  const mesh = new THREE.Mesh(merged ?? new THREE.BufferGeometry(), material);
  mesh.name = bucket.name;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function decalMaterial(color?: string): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    ...(color ? { color } : {}), transparent: true, roughness: 0.55,
    polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4,
  });
}

function decal(width: number, height: number, material: THREE.MeshStandardMaterial, name: string, x: number, y: number, z: number, ry = 0): THREE.Mesh {
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), material);
  mesh.name = name;
  mesh.position.set(x, y, z);
  mesh.rotation.y = ry;
  mesh.castShadow = false;
  mesh.receiveShadow = true;
  return mesh;
}

function group(name: string, parent: THREE.Object3D, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0): THREE.Group {
  const g = new THREE.Group();
  g.name = name;
  g.position.set(x, y, z);
  g.rotation.set(rx, ry, rz);
  parent.add(g);
  return g;
}

// ---------------------------------------------------------------- wheels

function buildWheel(raio: number, largura: number, lado: number, nome: string, C: typeof KART01_PALETTE, material: THREE.MeshStandardMaterial): { steer: THREE.Group; spin: THREE.Group } {
  const steer = new THREE.Group();
  steer.name = nome;
  const spin = group(nome + 'Giro', steer);
  const segs = 14;
  const rAro = raio * 0.6;
  const c = Math.min(raio * 0.2, largura * 0.24);
  const perfil = [
    [rAro * 1.02, -largura / 2 * 0.9], [raio - c, -largura / 2], [raio, -largura / 2 + c],
    [raio, largura / 2 - c], [raio - c, largura / 2], [rAro * 1.02, largura / 2 * 0.9],
  ].map(([r, y]) => new THREE.Vector2(r, y));
  const pneu = new THREE.LatheGeometry(perfil, segs);
  pneu.rotateZ(-Math.PI / 2);
  const b = new Bucket(nome + 'Malha');
  b.add(pneu, C.pneu);
  b.add(cilindro(rAro, largura * 0.84, segs, 'x'), C.aro);
  // Hub protruding on the outside, four bolts.
  b.add(cilindro(raio * 0.24, largura * 0.12, 8, 'x', raio * 0.19), C.cubo, lado * largura * 0.45, 0, 0, 0, 0, lado < 0 ? Math.PI : 0);
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    b.add(cilindro(raio * 0.045, largura * 0.06, 6, 'x'), C.cubo, lado * largura * 0.43, Math.sin(a) * rAro * 0.62, Math.cos(a) * rAro * 0.62);
  }
  spin.add(bake(b, material));
  return { steer, spin };
}

// ---------------------------------------------------------------- pilot

function helmetFaceColor(C: typeof KART01_PALETTE, r: number): (c: THREE.Vector3) => string {
  return c => {
    const phi = (Math.atan2(c.z, -c.x) + Math.PI * 2) % (Math.PI * 2);
    const perto = (alvo: number) => Math.abs(phi - alvo) < Math.PI / 12;
    const listra = perto(Math.PI / 2) || perto(Math.PI * 1.5);
    const filete = perto(Math.PI / 3) || perto(Math.PI * 2 / 3) || perto(Math.PI * 4 / 3) || perto(Math.PI * 5 / 3);
    if (c.y < -r * 0.5) return C.macacao;
    if (listra && c.y > -r * 0.2) return C.carenagem;
    if (filete && c.y > r * 0.25) return C.macacao;
    return C.capacete;
  };
}

function buildPilot(C: typeof KART01_PALETTE, material: THREE.MeshStandardMaterial): { piloto: THREE.Group; arms: [ArmNodes, ArmNodes] } {
  const piloto = new THREE.Group();
  piloto.name = PILOT_GROUP_NAME;
  const body = new Bucket('corpo');
  // Hip and torso with orange side stripes (pintarFaces).
  body.add(new THREE.CylinderGeometry(0.16, 0.155, 0.13, 8, 1, false, -Math.PI / 8), C.macacao, 0, 0.15, 0.2, 0, 0, 0, [1, 1, 0.78]);
  const tronco = pintarFaces(new THREE.CylinderGeometry(0.205, 0.165, 0.42, 8, 1, false, -Math.PI / 8), c =>
    Math.abs(c.x) > 0.15 && Math.abs(c.y) < 0.2 ? C.carenagem : C.macacao);
  body.add(tronco, undefined, 0, 0.386, 0.275, 0.19, 0, 0, [1, 1, 0.64]);
  body.add(cilindro(0.056, 0.1, 6, 'y'), C.luvas, 0, 0.635, 0.318, 0.19);
  // Helmet (criarCapacete): shell painted per face, visor, chin guard; the group is scaled (0.93, 1, 1.06).
  const r = 0.16;
  const helmetMatrix = new THREE.Matrix4().compose(new THREE.Vector3(0, 0.79, 0.312), new THREE.Quaternion().setFromEuler(new THREE.Euler(0.06, 0, 0)), new THREE.Vector3(0.93, 1, 1.06));
  body.addIn(helmetMatrix, pintarFaces(new THREE.SphereGeometry(r, 12, 9, Math.PI / 12), helmetFaceColor(C, r)), undefined);
  body.addIn(helmetMatrix, new THREE.SphereGeometry(r * 1.018, 5, 2, Math.PI * 13 / 12, Math.PI * 10 / 12, Math.PI / 3, Math.PI * 2 / 9), C.viseira);
  body.addIn(helmetMatrix, new THREE.SphereGeometry(r * 1.03, 5, 1, Math.PI * 13 / 12, Math.PI * 10 / 12, Math.PI * 5 / 9, Math.PI / 9), C.capacete);
  // Legs (static) and shoulders.
  for (const lado of [-1, 1]) {
    const qua = new THREE.Vector3(lado * 0.09, 0.13, 0.17);
    const joe = new THREE.Vector3(lado * 0.145, 0.27, -0.165);
    const tor = new THREE.Vector3(lado * 0.082, 0.13, -0.535);
    body.tubo(qua, joe, 0.078, C.macacao, 6);
    body.tubo(joe, tor, 0.062, C.macacao, 6);
    body.add(new THREE.SphereGeometry(0.072, 6, 4), C.macacao, joe.x, joe.y, joe.z);
    body.add(caixa(0.09, 0.1, 0.2, 0.026), C.luvas, lado * 0.082, 0.165, -0.585, 0.61);
    body.add(new THREE.SphereGeometry(0.072, 6, 4), C.macacao, lado * 0.19, 0.555, 0.3);
  }
  piloto.add(bake(body, material));
  // Arms: three rigid meshes each (upper arm with the elbow; forearm with the wrist; glove), placed per frame by
  // the kinematics of atualizarBracos. The lengths are constant: l1 for the upper arm, 0.84 l2 + 0.072 l2 for the forearm.
  const buildArm = (lado: -1 | 1): ArmNodes => {
    const l1 = ARM_UPPER_M, l2 = ARM_LOWER_M;
    const upper = new Bucket('bracoSup');
    upper.add(new THREE.CylinderGeometry(0.056, 0.056, 1, 6, 1), C.macacao, 0, l1 / 2, 0, 0, 0, 0, [1, l1, 1]);
    upper.add(new THREE.SphereGeometry(0.057, 6, 4), C.macacao, 0, l1, 0);
    const lower = new Bucket('antebraco');
    lower.add(new THREE.CylinderGeometry(0.048, 0.052, 1, 6, 1), C.macacao, 0, 0.42 * l2, 0, 0, 0, 0, [1, 0.84 * l2, 1]);
    lower.add(new THREE.CylinderGeometry(0.053, 0.053, 1, 6, 1), C.carenagem, 0, (0.84 + 0.036) * l2, 0, 0, 0, 0, [1, 0.072 * l2, 1]);
    const glove = new Bucket('luva');
    glove.add(caixa(0.078, 0.11, 0.088, 0.018), C.luvas);
    const upperArm = bake(upper, material), forearm = bake(lower, material), gloveMesh = bake(glove, material);
    piloto.add(upperArm, forearm, gloveMesh);
    return { side: lado, shoulder: new THREE.Vector3(lado * 0.19, 0.555, 0.3), upperArm, forearm, glove: gloveMesh };
  };
  return { piloto, arms: [buildArm(-1), buildArm(1)] };
}

const _e = new THREE.Euler();
const _q = new THREE.Quaternion();

// Hand position on the rim (kart coordinates) and the steering wheel orientation (maoNoVolante).
function maoNoVolante(lado: number, anguloVolante: number): { pos: THREE.Vector3; q: THREE.Quaternion } {
  _e.set(VOLANTE.inclinacao, 0, 0);
  _q.setFromEuler(_e);
  const giro = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), anguloVolante);
  const q = _q.clone().multiply(giro);
  const local = new THREE.Vector3(lado * VOLANTE.pegada, 0, 0.012);
  return { pos: local.applyQuaternion(q).add(VOLANTE.centro), q };
}

function resolverCotovelo(ombro: THREE.Vector3, mao: THREE.Vector3, l1: number, l2: number, dica: THREE.Vector3): THREE.Vector3 {
  const d = mao.clone().sub(ombro);
  const L = Math.min(d.length(), l1 + l2 - 1e-4);
  const dir = d.normalize();
  const a = (l1 * l1 - l2 * l2 + L * L) / (2 * L);
  const h = Math.sqrt(Math.max(0, l1 * l1 - a * a));
  const perp = dica.clone().addScaledVector(dir, -dica.dot(dir)).normalize();
  return ombro.clone().addScaledVector(dir, a).addScaledVector(perp, h);
}

function updateArms(arms: readonly ArmNodes[], anguloVolante: number): void {
  for (const b of arms) {
    const { pos, q } = maoNoVolante(b.side, anguloVolante);
    const dica = new THREE.Vector3(b.side * 0.65, -0.75, 0.1);
    const cotovelo = resolverCotovelo(b.shoulder, pos, ARM_UPPER_M, ARM_LOWER_M, dica);
    b.upperArm.position.copy(b.shoulder);
    b.upperArm.quaternion.setFromUnitVectors(UP, cotovelo.clone().sub(b.shoulder).normalize());
    b.forearm.position.copy(cotovelo);
    b.forearm.quaternion.setFromUnitVectors(UP, pos.clone().sub(cotovelo).normalize());
    b.glove.position.copy(pos);
    b.glove.quaternion.copy(q);
  }
}

// ---------------------------------------------------------------- kart

export function buildKart01Model(): Kart01Model {
  const C = KART01_PALETTE;
  const body = new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.6, metalness: 0.15 });
  const plate = decalMaterial(C.placa);
  const sidepod = decalMaterial();
  const root = new THREE.Group();
  root.name = 'kart';
  const groups = {} as Record<Kart01GroupName, THREE.Group>;
  const peca = (name: Kart01GroupName) => (groups[name] = group(name, root));

  // --- chassis: rails, cross members, floor tray, stub axles and steering rods
  const chassi = new Bucket('chassi');
  const yT = 0.045;
  const trilho = [[-0.15, yT, -0.78], [-0.3, yT, -0.48], [-0.35, yT, 0.3], [-0.35, yT, 0.66]];
  for (const s of [-1, 1]) {
    for (let i = 0; i < trilho.length - 1; i++) {
      const a = trilho[i], b = trilho[i + 1];
      chassi.tubo([Math.abs(a[0]) * s, a[1], a[2]], [Math.abs(b[0]) * s, b[1], b[2]], 0.016, C.chassi, 6);
    }
  }
  const travessas = [
    [[-0.15, yT, -0.78], [0.15, yT, -0.78]], [[-0.43, 0.06, -0.525], [0.43, 0.06, -0.525]],
    [[-0.33, yT, 0.1], [0.33, yT, 0.1]], [[-0.35, yT, 0.66], [0.35, yT, 0.66]],
    [[-0.3, 0.05, 0.66], [-0.3, 0.1, 0.7]], [[0.3, 0.05, 0.66], [0.3, 0.1, 0.7]],
    [[-0.15, yT, -0.78], [-0.26, 0.08, -0.87]], [[0.15, yT, -0.78], [0.26, 0.08, -0.87]],
  ];
  for (const [a, b] of travessas) chassi.tubo(a, b, 0.016, C.chassi);
  chassi.add(perfilPlanta([[-0.14, -0.76], [0.14, -0.76], [0.3, -0.46], [0.3, 0.14], [-0.3, 0.14], [-0.3, -0.46]], 0.026, 0.037, 0.004), C.bandeja);
  for (const s of [-1, 1]) {
    chassi.tubo([s * 0.43, 0.05, -0.525], [s * 0.43, 0.2, -0.525], 0.014, C.chassi, 6);
    chassi.tubo([s * 0.43, 0.13, -0.525], [s * 0.47, 0.13, -0.525], 0.012, C.cubo, 6);
    chassi.tubo([s * 0.04, 0.1, -0.6], [s * 0.4, 0.11, -0.49], 0.008, C.chassi, 5);
  }
  peca('chassi').add(bake(chassi, body));

  // --- rear axle
  const eixo = new Bucket('eixoTraseiro');
  eixo.tubo([-0.6, 0.14, 0.525], [0.6, 0.14, 0.525], 0.02, C.cubo, 8);
  for (const s of [-1, 1]) eixo.add(caixa(0.04, 0.12, 0.07, 0.008), C.chassi, s * 0.38, 0.1, 0.525);
  eixo.add(cilindro(0.085, 0.01, 14, 'x'), C.disco, -0.18, 0.14, 0.525);
  eixo.add(caixa(0.036, 0.05, 0.06, 0.006), C.carenagem, -0.18, 0.205, 0.475, -0.6);
  eixo.add(cilindro(0.075, 0.008, 16, 'x'), C.cubo, 0.225, 0.14, 0.525);
  peca('eixoTraseiro').add(bake(eixo, body));

  // --- wheels: the steer node sits at the wheel centre; the spin node is its child
  const defRodas: [WheelName, number, number, number, number, number][] = [
    ['rodaDianteiraEsq', -1, -0.5, -0.525, 0.13, 0.13], ['rodaDianteiraDir', 1, 0.5, -0.525, 0.13, 0.13],
    ['rodaTraseiraEsq', -1, -0.57, 0.525, 0.14, 0.19], ['rodaTraseiraDir', 1, 0.57, 0.525, 0.14, 0.19],
  ];
  const wheels = {} as Kart01Model['wheels'];
  for (const [nome, lado, x, z, raio, larg] of defRodas) {
    const p = peca(nome);
    const w = buildWheel(raio, larg, lado, nome + 'Malha', C, body);
    w.steer.position.set(x, raio, z);
    p.add(w.steer);
    wheels[nome] = { steer: w.steer, spin: w.spin, diameterM: raio * 2 };
  }

  // --- nose (front bumper)
  const nariz = new Bucket('nariz');
  const geoNariz = perfilPlanta([
    [-0.52, -0.975], [0.52, -0.975], [0.635, -0.93], [0.665, -0.84], [0.66, -0.75], [0.62, -0.705],
    [-0.62, -0.705], [-0.66, -0.75], [-0.665, -0.84], [-0.635, -0.93],
  ], 0.05, 0.21, 0.04);
  inclinarTopo(geoNariz, 0.21 - 0.041, (x, z) => -0.02 + (0.055 * (z + 0.975)) / 0.27);
  nariz.add(geoNariz, C.carenagem);
  nariz.add(perfilPlanta([[-0.5, -0.99], [0.5, -0.99], [0.56, -0.965], [-0.56, -0.965]], 0.04, 0.1, 0.012), C.borracha);
  peca('nariz').add(bake(nariz, body));

  // --- front panel with the number plate
  const painel = peca('painelFrontal');
  const suporte = group('suporte', painel, 0, 0.15, -0.735, 0.125);
  const painelBucket = new Bucket('painel');
  painelBucket.add(perfilFrontal([[-0.23, 0], [0.23, 0], [0.21, 0.24], [0.17, 0.285], [-0.17, 0.285], [-0.21, 0.24]], 0.024, 0.008), C.carenagem);
  suporte.add(bake(painelBucket, body));
  suporte.add(decal(0.25, 0.172, plate, 'placaNumero', 0, 0.158, -0.0135, Math.PI));

  // --- sidepods with the side sticker
  for (const [nome, s] of [['sidepodEsq', -1], ['sidepodDir', 1]] as const) {
    const p = peca(nome);
    const pts = [[0.3, -0.335], [0.6, -0.37], [0.69, -0.33], [0.71, -0.27], [0.71, 0.27], [0.685, 0.335], [0.3, 0.34]].map(([x, z]) => [x * s, z]);
    const geo = perfilPlanta(pts, 0.045, 0.25, 0.04);
    inclinarTopo(geo, 0.25 - 0.041, (x, z) => (0.025 * (z + 0.37)) / 0.71);
    const b = new Bucket('carenagem' + nome);
    b.add(geo, C.carenagem);
    p.add(bake(b, body));
    p.add(decal(0.47, 0.088, sidepod, 'adesivo', s * 0.7115, 0.148, -0.02, s * Math.PI / 2));
  }

  // --- rear bumper in U, with the rear plate
  const traseiro = peca('paraChoqueTraseiro');
  const traseiroBucket = new Bucket('carenagemTraseira');
  traseiroBucket.add(perfilPlanta([
    [-0.725, 0.56], [-0.675, 0.56], [-0.675, 0.69], [0.675, 0.69], [0.675, 0.56], [0.725, 0.56],
    [0.725, 0.87], [0.665, 0.935], [-0.665, 0.935], [-0.725, 0.87],
  ], 0.06, 0.25, 0.022), C.carenagem);
  traseiro.add(bake(traseiroBucket, body));
  const bumperPlate = decal(0.15, 0.103, plate, 'placaTraseira', 0, 0.15, 0.9365);
  traseiro.add(bumperPlate);

  // --- seat
  const banco = new Bucket('banco');
  banco.add(perfilLateral([[0, 0.045], [0.27, 0.035], [0.385, 0.12], [0.455, 0.48], [0.415, 0.49], [0.345, 0.15], [0.26, 0.075], [0, 0.085]], 0.4, 0.012), C.banco);
  for (const s of [-1, 1]) {
    banco.add(perfilLateral([[0.03, 0.08], [0.27, 0.07], [0.37, 0.16], [0.42, 0.4], [0.38, 0.42], [0.3, 0.22], [0.22, 0.17], [0.03, 0.14]], 0.03, 0.008, s * 0.185), C.banco);
    banco.tubo([s * 0.12, 0.38, 0.44], [s * 0.3, 0.06, 0.66], 0.008, C.chassi, 5);
  }
  peca('banco').add(bake(banco, body));

  // --- steering: column (static) and octagonal wheel (volanteGiro turns)
  const direcao = peca('direcao');
  const coluna = new Bucket('coluna');
  coluna.tubo([0, 0.1, -0.62], VOLANTE.centro, 0.016, C.cubo, 6);
  direcao.add(bake(coluna, body));
  const volante = group('volante', direcao, VOLANTE.centro.x, VOLANTE.centro.y, VOLANTE.centro.z, VOLANTE.inclinacao);
  const volanteGiro = group('volanteGiro', volante);
  const aro = new THREE.TorusGeometry(VOLANTE.raio, 0.017, 6, 8);
  aro.rotateZ(Math.PI / 8);
  const giro = new Bucket('volanteMalha');
  giro.add(aro, C.volante);
  for (const s of [-1, 1]) {
    giro.add(caixa(0.034, 0.095, 0.042, 0.008), C.borracha, s * VOLANTE.pegada, 0, 0);
    giro.add(caixa(0.095, 0.03, 0.012, 0.004), C.aro, s * 0.0875, 0, -0.006);
  }
  giro.add(caixa(0.03, 0.095, 0.012, 0.004), C.aro, 0, -0.0875, -0.006);
  giro.add(caixa(0.042, 0.034, 0.042, 0.006), C.carenagem, 0, VOLANTE.pegada, 0);
  giro.add(cilindro(0.046, 0.03, 8, 'z', 0.042), C.cubo, 0, 0, -0.012);
  giro.add(cilindro(0.026, 0.008, 8, 'z'), C.carenagem, 0, 0, 0.006);
  volanteGiro.add(bake(giro, body));

  // --- pedals
  const pedais = new Bucket('pedais');
  for (const s of [-1, 1]) {
    pedais.add(caixa(0.06, 0.012, 0.1, 0.004), C.aro, s * 0.082, 0.136, -0.642, 0.61);
    pedais.tubo([s * 0.08, 0.1, -0.63], [s * 0.08, 0.045, -0.6], 0.008, C.chassi, 5);
  }
  peca('pedais').add(bake(pedais, body));

  // --- engine (right side, rear), merged inside the motorBloco node
  const motor = peca('motor');
  const mg = group('motorBloco', motor, 0.325, 0, 0.52);
  const bloco = new Bucket('motorMalha');
  bloco.add(caixa(0.24, 0.016, 0.3, 0.004), C.chassi, 0, 0.17, 0);
  bloco.add(caixa(0.2, 0.17, 0.23, 0.02), C.motor, 0, 0.265, 0);
  bloco.add(caixa(0.12, 0.08, 0.08, 0.012), C.motor, -0.015, 0.39, -0.07);
  for (const y of [0.365, 0.39, 0.415]) bloco.add(caixa(0.15, 0.01, 0.105, 0.003), C.motor, -0.015, y, -0.07);
  bloco.add(caixa(0.2, 0.085, 0.13, 0.02), C.motorEscuro, 0, 0.395, 0.045);
  bloco.add(cilindro(0.022, 0.02, 8, 'y'), C.escapamento, 0.03, 0.447, 0.06);
  bloco.add(cilindro(0.075, 0.03, 10, 'x'), C.motorEscuro, 0.115, 0.27, 0);
  bloco.add(caixa(0.12, 0.11, 0.07, 0.015), C.borracha, -0.01, 0.3, -0.145);
  bloco.add(cilindro(0.045, 0.17, 10, 'x'), C.escapamento, 0, 0.33, 0.155);
  bloco.add(cilindro(0.016, 0.07, 8, 'z'), C.escapamento, 0.065, 0.33, 0.215);
  bloco.tubo([-0.03, 0.3, 0.1], [-0.03, 0.33, 0.145], 0.014, C.escapamento, 6);
  bloco.add(caixa(0.016, 0.17, 0.25, 0.006), C.borracha, -0.11, 0.17, 0.02);
  mg.add(bake(bloco, body));

  // --- pilot: a direct child of root, never of one of the 15 groups
  const { piloto, arms } = buildPilot(C, body);
  root.add(piloto);
  groups[PILOT_GROUP_NAME] = piloto;

  const model: Kart01Model = {
    root, groups, wheels, steeringWheel: volanteGiro, arms,
    anchors: { bumperPlate },
    materials: { body, plate, sidepod }, palette: C,
  };
  updateKart01Pose(model, { steerAngleRad: 0, wheelSpinRevs: { rodaDianteiraEsq: 0, rodaDianteiraDir: 0, rodaTraseiraEsq: 0, rodaTraseiraDir: 0 } });
  return model;
}

// Steers the front wheels, spins every wheel by its accumulated revolutions (the kart.js convention:
// giro.rotation.x = -distance / radius), turns the steering wheel and places the arms. Idempotent per pose.
export function updateKart01Pose(model: Kart01Model, pose: { steerAngleRad: number; wheelSpinRevs: Record<WheelName, number> }): void {
  model.wheels.rodaDianteiraEsq.steer.rotation.y = pose.steerAngleRad;
  model.wheels.rodaDianteiraDir.steer.rotation.y = pose.steerAngleRad;
  for (const name of Object.keys(model.wheels) as WheelName[]) model.wheels[name].spin.rotation.x = -2 * Math.PI * pose.wheelSpinRevs[name];
  const anguloVolante = steeringWheelAngleRad(pose.steerAngleRad);
  model.steeringWheel.rotation.z = anguloVolante;
  updateArms(model.arms, anguloVolante);
}
