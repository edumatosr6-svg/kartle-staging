// TEST-0003 — the curb as a surface of the simulation: 85 % grip per tyre, wheels on the curb are on the track, and the contact
// reading of API-0003; the visual finish of seed revision 2 leaves the surfaces alone: the edge line is asphalt and every grass
// tone is grass (strategy: surface, unit, integration and contract levels, RULE-0001, RULE-0006, DES-0003, ADR-0004).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  ARCADE_ASSISTIDO_V5, ARCADE_KART, CIRCUIT, CURB_GRIP_PC, getTrackContact, PUBLISHED_SETUPS, step, STEP, surfaceMu, TEST_PAD, tireForce, wheelPositions,
  type Environment, type KartConfig, type State, type Surface,
} from '../src/physics';
import { initialState } from '../src/physics';
import { classifySurface, closestOnSegment, positionAtLapM } from '../src/trackGeometry';
import { EDGE_LINE_WIDTH_M, grassToneAt } from '../src/trackScene';
import { kartParkEnvironment, kartParkGeometry } from './fixtures/kartParkFiles';
import { advance, KART_PARK_CONFIG, kartAtLapM, seededKart } from './helpers/kartParkPilot';
import { Seeded } from './helpers/seeded';

const g = kartParkGeometry();
const env = kartParkEnvironment();
const near = (a: number, b: number, tol: number) => Math.abs(a - b) <= tol;
// The four wheel positions of a state, computed by the test from wheelPositions and the heading (FL, FR, RL, RR).
const wheelsOf = (kart: State) => {
  const sin = Math.sin(kart.heading), cos = Math.cos(kart.heading);
  return wheelPositions(KART_PARK_CONFIG).map(p => ({ x: kart.x + p.forward * sin + p.left * cos, z: kart.z + p.forward * cos - p.left * sin }));
};
const edgeDistance = (p: { x: number; z: number }) => {
  let best = Infinity;
  for (const e of [g.leftEdge, g.rightEdge]) for (let i = 0; i < e.length; i++) best = Math.min(best, closestOnSegment(e[i], e[(i + 1) % e.length], p).distanceM);
  return best;
};
// Karts with the wheels of one side 0.05 m inside the asphalt edge (on the drawn edge line), at lap distances around the lap.
const onEdgeLine = (() => {
  const half = KART_PARK_CONFIG.trackWidth / 2;
  const out: { label: string; kart: State; lineWheels: number[] }[] = [];
  for (let lapM = 5; lapM < g.lapLengthM; lapM += 11) for (const side of ['LEFT', 'RIGHT'] as const) {
    const width = g.centerline[positionAtLapM(g, lapM).index].widthM;
    const sign = side === 'LEFT' ? 1 : -1;
    const lineWheels = side === 'LEFT' ? [0, 2] : [1, 3];
    // Signed distance inside the asphalt edge of the outermost wheel of the side; the kart is moved sideways until it is 0.05 m.
    const inside = (k: State) => Math.min(...lineWheels.map(w => { const p = wheelsOf(k)[w]; return (classifySurface(g, p) === 'asphalt' ? 1 : -1) * edgeDistance(p); }));
    let lateral = sign * (width / 2 - half - EDGE_LINE_WIDTH_M / 2);
    for (let i = 0; i < 8; i++) lateral += sign * (inside(kartAtLapM(lapM, lateral)) - EDGE_LINE_WIDTH_M / 2);
    const kart = kartAtLapM(lapM, lateral);
    // Kept where both wheels of the side stand on the line (where the edge curves under the wheelbase they cannot both be).
    if (lineWheels.every(w => { const p = wheelsOf(kart)[w]; return classifySurface(g, p) === 'asphalt' && edgeDistance(p) <= EDGE_LINE_WIDTH_M; })) out.push({ label: `${side} at ${lapM} m`, kart, lineWheels });
  }
  assert.ok(out.length >= 20, `fixture: at least 20 karts with the wheels of one side on the edge line (${out.length})`);
  return out;
})();
// Karts off the track, centred on a boundary between two grass stripes, wheels on both tones.
const onBothTones = (() => {
  const out: State[] = [];
  for (const [dx, dz] of [[40, 0], [-40, 0], [0, 40], [0, -40]]) {
    const x = 5 * Math.round(((dx > 0 ? g.bounds.maxX : dx < 0 ? g.bounds.minX : (g.bounds.minX + g.bounds.maxX) / 2) + dx) / 5);
    const z = (dz > 0 ? g.bounds.maxZ : dz < 0 ? g.bounds.minZ : (g.bounds.minZ + g.bounds.maxZ) / 2) + dz;
    out.push(seededKart({ x, z }, 0, 5));
  }
  return out;
})();
// The setups are read from PUBLISHED_SETUPS, whatever version is published (arcade-assistido-v6 since dirigibilidade, FB-02):
// the checks measure the curb rule (ratios to the asphalt of the same setup), never the numbers of one version. The literal v5
// the Kart Park pilot is calibrated on is measured too, after the published ones (configs.slice(0, 3) keeps the step check).
const published = (id: keyof typeof PUBLISHED_SETUPS) => `${id} ${PUBLISHED_SETUPS[id].setupVersion}`;
const configs: [string, KartConfig][] = [
  [published('ARCADE_ASSISTIDO'), PUBLISHED_SETUPS.ARCADE_ASSISTIDO.config], [published('REALISTA_ALUGUEL_4T'), PUBLISHED_SETUPS.REALISTA_ALUGUEL_4T.config], ['ARCADE_KART', ARCADE_KART],
  ['forcing rear scale', { ...PUBLISHED_SETUPS.ARCADE_ASSISTIDO.config, friction: PUBLISHED_SETUPS.ARCADE_ASSISTIDO.config.friction * 0.67 }],
  ['ARCADE_ASSISTIDO_V5 (Kart Park pilot)', ARCADE_ASSISTIDO_V5],
];
// A kart straddling the edge of a long curb: the wheels of the curb side `inM` metres onto the strip, the others on the asphalt.
function straddling(inM = 0.3): { kart: State; span: typeof g.curbs[number] } {
  const span = g.curbs.find(c => c.toLapM - c.fromLapM > 20)!;
  const lapM = (span.fromLapM + span.toLapM) / 2;
  const at = positionAtLapM(g, lapM);
  const half = KART_PARK_CONFIG.trackWidth / 2;
  const sign = span.side === 'LEFT' ? 1 : -1;
  const edge = span.side === 'LEFT' ? at.leftEdge : at.rightEdge;
  const centre = { x: edge.x - sign * at.normal.x * (half - inM), z: edge.z - sign * at.normal.z * (half - inM) };
  const base = kartAtLapM(lapM);
  return { kart: { ...base, x: centre.x, z: centre.z }, span };
}

test('CHK-TEST-0003-01 the tyre capacity on the curb is 85 % of the capacity of the same tyre on the asphalt, for every load, slip and published setup', () => {
  // AC-US-0005-06
  assert.equal(CURB_GRIP_PC, 0.85, 'AC-US-0005-06: the curb grip fraction is 0.85');
  for (const [label, config] of configs) {
    assert.ok(near(surfaceMu(config, 'curb') / surfaceMu(config, 'asphalt'), 0.85, 1e-12), `AC-US-0005-06: ${label}: the curb friction must be 0.85 of the asphalt friction`);
    for (const load of [200, 500, 800, 1200]) for (const slip of [0, 0.05, 0.2, -0.3]) for (const fx of [0, 300, -600]) {
      const asphalt = tireForce(load, slip, fx, config.frontStiffness, 'asphalt', config);
      const curb = tireForce(load, slip, fx, config.frontStiffness, 'curb', config);
      assert.ok(near(curb.capacity / asphalt.capacity, 0.85, 1e-12), `AC-US-0005-06: ${label}: capacity on the curb at load ${load}, slip ${slip}, fx ${fx} must be 0.85 of the asphalt (${(curb.capacity / asphalt.capacity).toFixed(6)})`);
      assert.ok(Math.hypot(curb.fx, curb.fy) <= curb.capacity + 1e-9, `AC-US-0005-06: ${label}: the curb force stays within its capacity`);
    }
    const grass = tireForce(500, 0.1, 0, config.frontStiffness, 'grass', config), asphalt = tireForce(500, 0.1, 0, config.frontStiffness, 'asphalt', config);
    assert.ok(near(grass.capacity / asphalt.capacity, config.grassFriction / config.friction, 1e-12), `AC-US-0005-06: ${label}: the grass rule is unchanged by the curb`);
  }
});

test('CHK-TEST-0003-02 stepping the simulation with every wheel on a curb gives each tyre 85 % of the capacity it has on the asphalt from the same state', () => {
  // AC-US-0005-06
  const curbPad: Environment = { surfaceAt: () => 'curb', walls: false };
  for (const [label, config] of configs.slice(0, 3)) {
    const start: State = { ...initialState(), x: 0, z: 0, heading: 0, vx: 0, vz: 12, speed: 12 };
    const input = { throttle: 1, brake: 0, steer: 1 };
    const onAsphalt = step(start, input, STEP, config, TEST_PAD), onCurb = step(start, input, STEP, config, curbPad);
    assert.equal(onCurb.telemetry.wheels.length, 4, `AC-US-0005-06: ${label}: four wheels are reported`);
    // The friction each wheel got, recovered from its reported capacity and load (capacity = mu x load x (550 / load)^loadSensitivity).
    const muOf = (w: { capacity: number; load: number }) => w.capacity / (w.load * Math.pow(550 / Math.max(w.load, 25), config.loadSensitivity));
    onCurb.telemetry.wheels.forEach((w, i) => {
      assert.equal(w.surface, 'curb', `AC-US-0005-06: ${label}: wheel ${i} is on the curb`);
      assert.ok(w.load > 0 && onAsphalt.telemetry.wheels[i].load > 0, `AC-US-0005-06: ${label}: wheel ${i} carries load`);
      assert.ok(near(muOf(w) / muOf(onAsphalt.telemetry.wheels[i]), 0.85, 1e-9), `AC-US-0005-06: ${label}: wheel ${i} friction on the curb must be 0.85 of the asphalt (${(muOf(w) / muOf(onAsphalt.telemetry.wheels[i])).toFixed(6)})`);
      assert.ok(near(w.capacity / onAsphalt.telemetry.wheels[i].capacity, 0.85, 0.01), `AC-US-0005-06: ${label}: wheel ${i} capacity on the curb is about 0.85 of the asphalt in the same step (${(w.capacity / onAsphalt.telemetry.wheels[i].capacity).toFixed(4)})`);
    });
    const turnedAsphalt = advance(start, input, 120, config, TEST_PAD), turnedCurb = advance(start, input, 120, config, curbPad);
    assert.ok(Math.abs(turnedCurb.yawRate) < Math.abs(turnedAsphalt.yawRate), `AC-US-0005-06: ${label}: a full-steer second on the curb turns less than on the asphalt (${turnedCurb.yawRate.toFixed(3)} vs ${turnedAsphalt.yawRate.toFixed(3)} rad/s)`);
    assert.equal(onCurb.telemetry.surface, 'curb', `AC-US-0005-06: ${label}: the telemetry surface reports the curb`);
  }
});

test('CHK-TEST-0003-03 a kart with the wheels of one side on the curb and the others on the asphalt reads CURB on those wheels, grip 0.85 there, and edge distance 0', () => {
  // AC-US-0005-04, AC-US-0005-06
  const { kart, span } = straddling();
  const contact = getTrackContact(kart, env, KART_PARK_CONFIG);
  assert.ok(!('code' in contact), 'AC-US-0005-04: a state gives a contact reading');
  if ('code' in contact) return;
  const curbIndices = span.side === 'LEFT' ? [0, 2] : [1, 3], asphaltIndices = span.side === 'LEFT' ? [1, 3] : [0, 2];
  for (const i of curbIndices) assert.equal(contact.wheelSurfaces[i], 'CURB', `AC-US-0005-04: wheel ${i} (${span.side} side) must be on the curb`);
  for (const i of asphaltIndices) assert.equal(contact.wheelSurfaces[i], 'ASPHALT', `AC-US-0005-04: wheel ${i} must be on the asphalt`);
  assert.equal(contact.curbWheelCount, 2, 'AC-US-0005-04: two wheels on the curb');
  for (const i of curbIndices) assert.ok(near(contact.wheelGripPc[i], 0.85, 1e-12), `AC-US-0005-06: wheel ${i} grip must be 0.85`);
  for (const i of asphaltIndices) assert.equal(contact.wheelGripPc[i], 1, `AC-US-0005-06: wheel ${i} grip must be 1`);
  assert.equal(contact.beyondTrackEdgeM, 0, 'AC-US-0005-04: a kart on asphalt and curb is not beyond the track edge');
  assert.equal(contact.barrierContact, false, 'AC-US-0005-04: no barrier contact');
  assert.equal(contact.simStepCount, kart.stepCount, 'AC-US-0005-04: the step counter is the state one');
  // The same kart driven straight for 30 steps stays off the grass and on the track (no exit).
  let s = kart, grassWheel = false, beyond = 0;
  for (let i = 0; i < 30; i++) {
    s = step(s, { throttle: 0.3, brake: 0, steer: 0 }, STEP, KART_PARK_CONFIG, env);
    const c = getTrackContact(s, env, KART_PARK_CONFIG);
    if ('code' in c) continue;
    grassWheel ||= c.wheelSurfaces.includes('GRASS');
    beyond = Math.max(beyond, c.beyondTrackEdgeM);
  }
  assert.equal(grassWheel, false, 'AC-US-0005-04: no wheel reaches the grass while straddling the curb');
  assert.equal(beyond, 0, 'AC-US-0005-04: the kart stays on the track (edge distance 0) while on the curb');
  assert.equal(s.telemetry.surface, 'asphalt', 'AC-US-0005-04: the centre of the kart is on the asphalt');
});

test('CHK-TEST-0003-04 the contact reading has exactly the fields of API-0003, NO_STATE without a state, and never CURB nor barrier contact on the synthetic track', () => {
  // AC-US-0005-04, AC-US-0005-06
  assert.deepEqual(getTrackContact(undefined, env, KART_PARK_CONFIG), { code: 'NO_STATE' }, 'API-0003: NO_STATE without a state');
  const contact = getTrackContact(kartAtLapM(50), env, KART_PARK_CONFIG);
  assert.deepEqual(Object.keys(contact).sort(), ['barrierContact', 'beyondTrackEdgeM', 'curbWheelCount', 'simStepCount', 'wheelGripPc', 'wheelSurfaces'], 'API-0003: exactly the six contract fields');
  if ('code' in contact) return;
  assert.equal(contact.wheelSurfaces.length, 4, 'API-0003: four wheel surfaces');
  assert.equal(contact.wheelGripPc.length, 4, 'API-0003: four grips');
  assert.ok(Number.isInteger(contact.curbWheelCount) && contact.curbWheelCount >= 0 && contact.curbWheelCount <= 4, 'API-0003: curbWheelCount is 0 to 4');
  const seeded = new Seeded(20261027);
  let s = initialState(), curb = 0, barrier = 0;
  for (let i = 0; i < 300; i++) {
    s = step(s, seeded.input(), STEP, ARCADE_KART, CIRCUIT);
    const c = getTrackContact(s, CIRCUIT, ARCADE_KART);
    if ('code' in c) continue;
    if (c.wheelSurfaces.includes('CURB') || c.curbWheelCount > 0) curb++;
    if (c.barrierContact) barrier++;
    for (let w = 0; w < 4; w++) {
      const expected = c.wheelSurfaces[w] === 'ASPHALT' ? 1 : ARCADE_KART.grassFriction / ARCADE_KART.friction;
      assert.ok(near(c.wheelGripPc[w], expected, 1e-12), `API-0003: the grass grip is the existing grass fraction (${c.wheelGripPc[w]})`);
    }
  }
  assert.equal(curb, 0, 'API-0003: the synthetic track has no curb');
  assert.equal(barrier, 0, 'API-0003: the synthetic track has no barrier');
});

test('CHK-TEST-0003-05 the wheel surfaces of the reading are the surfaces at the four wheel positions of the state, front-left first', () => {
  // AC-US-0005-04
  const { kart } = straddling(0.3);
  const contact = getTrackContact(kart, env, KART_PARK_CONFIG);
  if ('code' in contact) throw new Error('fixture: no contact');
  const sin = Math.sin(kart.heading), cos = Math.cos(kart.heading);
  const expected = wheelPositions(KART_PARK_CONFIG).map(p => env.surfaceAt({ x: kart.x + p.forward * sin + p.left * cos, z: kart.z + p.forward * cos - p.left * sin }));
  const label: Record<Surface, string> = { asphalt: 'ASPHALT', curb: 'CURB', grass: 'GRASS' };
  assert.deepEqual([...contact.wheelSurfaces], expected.map(s => label[s]), 'AC-US-0005-04: the reading reports the surface under each wheel in the order FL, FR, RL, RR');
  const offTrack = seededKart({ x: g.bounds.minX - 20, z: g.bounds.minZ - 20 }, 0, 0);
  const grass = getTrackContact(offTrack, env, KART_PARK_CONFIG);
  if ('code' in grass) throw new Error('fixture: no contact');
  assert.deepEqual([...grass.wheelSurfaces], ['GRASS', 'GRASS', 'GRASS', 'GRASS'], 'AC-US-0005-04: far from the track every wheel is on the grass');
  assert.ok(grass.beyondTrackEdgeM > 10, 'AC-US-0005-04: and the edge distance is large');
});

test('CHK-TEST-0003-06 the wheels on the drawn edge line, inside the asphalt edge, read ASPHALT with grip 1, as on the asphalt', () => {
  // AC-US-0007-03
  for (const { label, kart, lineWheels } of onEdgeLine) {
    const wheels = wheelsOf(kart);
    for (const w of lineWheels) {
      assert.ok(classifySurface(g, wheels[w]) === 'asphalt' && edgeDistance(wheels[w]) <= EDGE_LINE_WIDTH_M, `fixture: ${label}: wheel ${w} must stand on the edge line (${edgeDistance(wheels[w]).toFixed(3)} m from the edge)`);
    }
    const contact = getTrackContact(kart, env, KART_PARK_CONFIG);
    if ('code' in contact) throw new Error('fixture: no contact');
    for (const w of lineWheels) {
      assert.equal(contact.wheelSurfaces[w], 'ASPHALT', `AC-US-0007-03: ${label}: wheel ${w} on the edge line must read ASPHALT`);
      assert.equal(contact.wheelGripPc[w], 1, `AC-US-0007-03: ${label}: wheel ${w} on the edge line must have the asphalt grip 1 (${contact.wheelGripPc[w]})`);
    }
  }
});

test('CHK-TEST-0003-07 a kart with wheels on the edge line and none beyond the asphalt edge is not off the track', () => {
  // AC-US-0007-04
  for (const { label, kart } of onEdgeLine) {
    assert.ok(wheelsOf(kart).every(w => classifySurface(g, w) === 'asphalt'), `fixture: ${label}: no wheel beyond the asphalt edge`);
    const contact = getTrackContact(kart, env, KART_PARK_CONFIG);
    if ('code' in contact) throw new Error('fixture: no contact');
    assert.equal(contact.beyondTrackEdgeM, 0, `AC-US-0007-04: ${label}: the kart on the edge line must not be beyond the track edge (${contact.beyondTrackEdgeM} m)`);
  }
});

test('CHK-TEST-0003-08 a wheel on either grass tone has the grass grip, the same for every tone', () => {
  // AC-US-0007-15
  const grassGrip = KART_PARK_CONFIG.grassFriction / KART_PARK_CONFIG.friction;
  for (const kart of onBothTones) {
    const tones = new Set(wheelsOf(kart).map(w => grassToneAt(w.x, w.z)));
    assert.equal(tones.size, 2, `fixture: the wheels of the kart at (${kart.x}, ${kart.z}) stand on both grass tones`);
    const contact = getTrackContact(kart, env, KART_PARK_CONFIG);
    if ('code' in contact) throw new Error('fixture: no contact');
    for (let w = 0; w < 4; w++) assert.ok(near(contact.wheelGripPc[w], grassGrip, 1e-12), `AC-US-0007-15: wheel ${w} on tone ${grassToneAt(wheelsOf(kart)[w].x, wheelsOf(kart)[w].z)} must have the grass grip ${grassGrip} (${contact.wheelGripPc[w]})`);
  }
});

test('CHK-TEST-0003-09 a wheel on either grass tone reads GRASS, the same for every tone', () => {
  // AC-US-0007-21
  for (const kart of onBothTones) {
    const contact = getTrackContact(kart, env, KART_PARK_CONFIG);
    if ('code' in contact) throw new Error('fixture: no contact');
    assert.deepEqual([...contact.wheelSurfaces], ['GRASS', 'GRASS', 'GRASS', 'GRASS'], `AC-US-0007-21: every wheel of the kart at (${kart.x}, ${kart.z}), on both tones, must read GRASS`);
  }
});
