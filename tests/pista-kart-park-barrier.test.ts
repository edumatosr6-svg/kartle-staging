// TEST-0004 — the barrier of the Kart Park in the simulation: the only obstacle of the file environment, impassable at every speed,
// with the response of the existing wall (strategy: barrier, integration level, RULE-0001, DES-0003, ADR-0003).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getTrackContact, step, STEP, WIDTH, type Environment, type State } from '../src/physics';
import { nearest, track, type Point } from '../src/track';
import { buildTrackGeometry, nearestBarrier, type Segment, type TrackGeometry } from '../src/trackGeometry';
import { kartParkEnvironment, kartParkFile, kartParkGeometry, kartParkReading, withoutBarriers } from './fixtures/kartParkFiles';
import { KART_PARK_CONFIG, kartAtLapM, seededKart } from './helpers/kartParkPilot';
import { readTrackData } from '../src/trackData';
import { Seeded } from './helpers/seeded';

const g = kartParkGeometry();
const env = kartParkEnvironment();
const config = KART_PARK_CONFIG;
const file = kartParkFile();
const DRIVE = { throttle: 1, brake: 0, steer: 0 };
const COAST = { throttle: 0, brake: 0, steer: 0 };
const wrap = (v: number) => Math.atan2(Math.sin(v), Math.cos(v));
const orientation = (u: Point, v: Point, w: Point) => (v.x - u.x) * (w.z - u.z) - (v.z - u.z) * (w.x - u.x);
// Own crossing oracle: a displacement crosses a segment when the two pairs of endpoints lie on opposite sides.
const crossings = (segments: readonly Segment[], from: Point, to: Point) =>
  segments.filter(s => orientation(from, to, s.a) * orientation(from, to, s.b) < 0 && orientation(s.a, s.b, from) * orientation(s.a, s.b, to) < 0).length;
// Segment 217 of the published barrier: its midpoint, unit normal and tangent (the launch frame); a vertex for the vertex aims.
const SEGMENT = 217;
const seg = g.barrierSegments[SEGMENT];
const segLength = Math.hypot(seg.b.x - seg.a.x, seg.b.z - seg.a.z);
const segNormal = { x: (seg.b.z - seg.a.z) / segLength, z: -(seg.b.x - seg.a.x) / segLength };
const segMid = { x: (seg.a.x + seg.b.x) / 2, z: (seg.a.z + seg.b.z) / 2 };
// A kart `distance` metres from `target` along `normal` (times side), heading at `deg` degrees to the normal, aimed at the target.
function launch(target: Point, normal: Point, side: 1 | -1, deg: number, distance: number, speed: number): State {
  const n = { x: side * normal.x, z: side * normal.z }, t = { x: -n.z, z: n.x };
  const back = distance / Math.tan(deg * Math.PI / 180);
  const start = { x: target.x + n.x * distance - t.x * back, z: target.z + n.z * distance - t.z * back };
  return seededKart(start, Math.atan2(target.x - start.x, target.z - start.z), speed);
}
type Launch = { label: string; crossed: number; contacts: number; speedBefore: number; speedAfter: number };
function run(aim: 'midpoint' | 'vertex', side: 1 | -1, speed: number, deg: number, steps = 240): Launch {
  const target = aim === 'midpoint' ? segMid : { x: file.barriers[0].points[SEGMENT].xM, z: file.barriers[0].points[SEGMENT].zM };
  let s = launch(target, segNormal, side, deg, 4, speed);
  let crossed = 0, contacts = 0, speedBefore = -1, speedAfter = -1;
  for (let i = 0; i < steps; i++) {
    const prev = s;
    s = step(s, DRIVE, STEP, config, env);
    crossed += crossings(g.barrierSegments, prev, s);
    if (s.telemetry.barrierContact) { contacts++; if (speedBefore < 0) { speedBefore = prev.speed; speedAfter = s.speed; } }
  }
  return { label: `${aim} aim, side ${side}, ${speed} m/s, ${deg} deg`, crossed, contacts, speedBefore, speedAfter };
}

test('CHK-TEST-0004-01 the Kart Park environment has no wall derived from the centerline: the barriers of the file are its only obstacles', () => {
  // AC-US-0004-02
  assert.equal(env.walls, false, 'AC-US-0004-02: walls must be off in the file environment');
  assert.equal(env.track, g, 'AC-US-0004-02: the environment carries the file geometry');
  assert.equal(g.barrierSegments.length, file.barriers.reduce((s, b) => s + b.points.length - 1, 0), 'AC-US-0004-02: one obstacle segment per barrier edge of the file');
  // Driven 30 m away from the track into the open grass, past where the synthetic wall would stand, nothing stops the kart.
  const at = kartAtLapM(105, 0);
  let s: State = seededKart({ x: at.x, z: at.z }, at.heading + Math.PI / 2, 15);
  const start = { x: s.x, z: s.z };
  let wall = 0, barrier = 0;
  for (let i = 0; i < 1500; i++) { s = step(s, DRIVE, STEP, config, env); wall += s.telemetry.wallContact ? 1 : 0; barrier += s.telemetry.barrierTouching ? 1 : 0; }
  const travelled = Math.hypot(s.x - start.x, s.z - start.z);
  assert.ok(travelled > WIDTH / 2 + 8 + 5, `AC-US-0004-02: the kart must drive past the distance of the synthetic wall (${travelled.toFixed(1)} m)`);
  assert.equal(wall, 0, 'AC-US-0004-02: no wall contact in the file environment');
  assert.equal(barrier, 0, 'AC-US-0004-02: no barrier contact away from the barrier');
});

test('CHK-TEST-0004-02 a kart driven against the barrier from either side, at every speed the kart reaches and at 90 or 30 degrees, never ends a step on the other side', () => {
  // AC-US-0004-04
  const results: Launch[] = [];
  for (const aim of ['midpoint', 'vertex'] as const) for (const side of [1, -1] as const) for (const speed of [5, 10, 20, 30, 34.5]) for (const deg of [90, 30]) results.push(run(aim, side, speed, deg));
  const crossed = results.filter(r => r.crossed > 0).map(r => r.label);
  assert.deepEqual(crossed, [], `AC-US-0004-04: the kart crossed the barrier in: ${crossed.join('; ')}`);
  const noContact = results.filter(r => r.contacts === 0).map(r => r.label);
  assert.deepEqual(noContact, [], `AC-US-0004-04: launches that never touched the barrier (fixture): ${noContact.join('; ')}`);
  for (const r of results) assert.ok(r.speedAfter < r.speedBefore, `AC-US-0004-04: ${r.label}: the contact must take speed away (${r.speedBefore.toFixed(2)} -> ${r.speedAfter.toFixed(2)} m/s)`);
});

test('CHK-TEST-0004-03 the barrier also holds at 60 and 200 m/s, the speeds DES-0003 names beyond the reach of the kart', () => {
  // AC-US-0004-04
  const results: Launch[] = [];
  for (const side of [1, -1] as const) for (const speed of [60, 200]) for (const deg of [90, 30]) results.push(run('midpoint', side, speed, deg, 120));
  const crossed = results.filter(r => r.crossed > 0).map(r => `${r.label} (crossings ${r.crossed}, contacts ${r.contacts})`);
  assert.deepEqual(crossed, [], `AC-US-0004-04: the kart crossed the barrier in: ${crossed.join('; ')}`);
});

test('CHK-TEST-0004-04 after a collision with a barrier line the kart has the position and velocity it has after the same collision with the existing wall, step by step', () => {
  // AC-US-0004-05
  // A straight barrier in the grass of the Kart Park file (its centerline and curbs, the barrier replaced) against the synthetic wall
  // at a straight stretch; both obstacles seen in their own local frame (normal towards the kart, tangent along the obstacle).
  const reading = kartParkReading();
  if (reading.trackDataStatus !== 'COMPLETE' || !reading.centerline) throw new Error('fixture: reading');
  const line = { points: [{ xM: g.bounds.maxX + 30, zM: -10 }, { xM: g.bounds.maxX + 30, zM: 10 }] };
  const straight: TrackGeometry = buildTrackGeometry(reading.centerline, reading.curbs ?? [], [line]);
  const barrierEnv: Environment = { surfaceAt: () => 'grass', walls: false, track: straight };
  const wallEnv: Environment = { surfaceAt: () => 'grass', walls: true };
  const b = straight.barrierSegments[0], bl = Math.hypot(b.b.x - b.a.x, b.b.z - b.a.z);
  const bNormal = { x: (b.b.z - b.a.z) / bl, z: -(b.b.x - b.a.x) / bl }, bMid = { x: (b.a.x + b.b.x) / 2, z: (b.a.z + b.b.z) / 2 };
  const wi = 95, wa = track[wi], wb = track[wi + 1], wl = Math.hypot(wb.x - wa.x, wb.z - wa.z);
  const wNormal0 = { x: (wb.z - wa.z) / wl, z: -(wb.x - wa.x) / wl }, wMid = { x: (wa.x + wb.x) / 2, z: (wa.z + wb.z) / 2 };
  const outward = wNormal0.x * wMid.x + wNormal0.z * wMid.z > 0 ? 1 : -1;
  const wallPoint = { x: wMid.x + outward * wNormal0.x * (WIDTH / 2 + 8), z: wMid.z + outward * wNormal0.z * (WIDTH / 2 + 8) };
  const wNormal = { x: -outward * wNormal0.x, z: -outward * wNormal0.z };
  assert.equal(nearest(wallPoint).index, wi, 'AC-US-0004-05: the wall point lies in front of the chosen straight stretch');
  const local = (s: State, origin: Point, n: Point) => {
    const t = { x: -n.z, z: n.x }, dx = s.x - origin.x, dz = s.z - origin.z;
    return [dx * n.x + dz * n.z, dx * t.x + dz * t.z, s.vx * n.x + s.vz * n.z, s.vx * t.x + s.vz * t.z, s.yawRate, wrap(s.heading - Math.atan2(n.x, n.z)), s.speed];
  };
  let compared = 0;
  for (const side of [1, -1] as const) for (const deg of [90, 60, 45, 30]) for (const speed of [10, 20, 30]) {
    const n = { x: side * bNormal.x, z: side * bNormal.z };
    const bSurface = { x: bMid.x + n.x * 0.1, z: bMid.z + n.z * 0.1 };
    let sb = launch(bSurface, bNormal, side, deg, 3, speed), sw = launch(wallPoint, wNormal, 1, deg, 3, speed);
    let cb = -1, cw = -1;
    const label = `side ${side}, ${deg} deg, ${speed} m/s`;
    for (let i = 0; i < 160; i++) {
      sb = step(sb, COAST, STEP, config, barrierEnv); sw = step(sw, COAST, STEP, config, wallEnv);
      if (cb < 0 && sb.telemetry.barrierContact) cb = i;
      if (cw < 0 && sw.telemetry.wallContact) cw = i;
      if (cb < 0 || cw < 0) continue;
      const k = i - Math.max(cb, cw);
      if (k > 60 || (deg !== 90 && k > 10)) continue;
      const lb = local(sb, bSurface, n), lw = local(sw, wallPoint, wNormal);
      const names = ['normal position', 'tangent position', 'normal velocity', 'tangent velocity', 'yaw rate', 'heading', 'speed'];
      lb.forEach((v, j) => {
        const d = j === 5 ? Math.abs(wrap(v - lw[j])) : Math.abs(v - lw[j]);
        assert.ok(d <= 1e-9, `AC-US-0004-05: ${label}: ${names[j]} differs by ${d.toExponential(2)} at step +${k} after the contact (barrier ${lb[j].toFixed(6)}, wall ${lw[j].toFixed(6)})`);
      });
      compared++;
    }
    assert.ok(cb >= 0 && cw >= 0, `AC-US-0004-05: ${label}: both collisions must happen (barrier step ${cb}, wall step ${cw})`);
    assert.ok(Math.abs(cb - cw) <= 1, `AC-US-0004-05: ${label}: the collisions must happen at the same step (${cb} vs ${cw})`);
  }
  assert.ok(compared >= 24 * 10, `AC-US-0004-05: enough steps compared (${compared})`);
});

test('CHK-TEST-0004-05 barrierContact is true only in the step the touching begins, barrierTouching while it lasts, and the contact reading mirrors it', () => {
  // AC-US-0004-05
  let s = launch(segMid, segNormal, 1, 90, 4, 20);
  const contactSteps: number[] = [], touchingSteps: number[] = [];
  for (let i = 0; i < 240; i++) {
    s = step(s, COAST, STEP, config, env);
    if (s.telemetry.barrierContact) contactSteps.push(i);
    if (s.telemetry.barrierTouching) touchingSteps.push(i);
    const c = getTrackContact(s, env, config);
    assert.ok(!('code' in c) && c.barrierContact === s.telemetry.barrierContact, `AC-US-0004-05: the contact reading mirrors barrierContact at step ${i}`);
    if (s.telemetry.barrierContact) assert.ok(s.telemetry.barrierTouching, `AC-US-0004-05: contact implies touching at step ${i}`);
  }
  assert.ok(contactSteps.length >= 1, 'AC-US-0004-05: the launch must touch the barrier');
  for (const c of contactSteps) assert.ok(!touchingSteps.includes(c - 1), `AC-US-0004-05: contact at step ${c} must begin a touching episode`);
  const episodes = touchingSteps.filter((t, i) => i === 0 || touchingSteps[i - 1] !== t - 1).length;
  assert.equal(contactSteps.length, episodes, `AC-US-0004-05: one contact per touching episode (${contactSteps.length} contacts, ${episodes} episodes)`);
  assert.equal(seededKart({ x: 0, z: 0 }, 0, 0).telemetry.barrierContact, false, 'AC-US-0004-05: no contact in the initial state');
});

test('CHK-TEST-0004-06 a copy of the file without barriers gives an environment where a seeded 2000-step run never touches a barrier and never throws', () => {
  // AC-US-0004-02
  const r = readTrackData(withoutBarriers());
  if (r.trackDataStatus !== 'COMPLETE' || !r.centerline) throw new Error('fixture: copy without barriers must be COMPLETE');
  const bare = buildTrackGeometry(r.centerline, r.curbs ?? [], r.barriers ?? []);
  const bareEnv: Environment = { surfaceAt: p => env.surfaceAt(p), walls: false, track: bare };
  assert.equal(bare.barrierSegments.length, 0, 'AC-US-0004-02: no obstacle segment');
  assert.equal(nearestBarrier(bare, { x: 0, z: 0 }), undefined, 'AC-US-0004-02: no nearest barrier');
  const seeded = new Seeded(20261027);
  let s = kartAtLapM(0);
  for (let i = 0; i < 2000; i++) {
    s = step(s, seeded.input(), STEP, config, bareEnv);
    assert.equal(s.telemetry.barrierTouching, false, `AC-US-0004-02: no touching at step ${i}`);
    assert.equal(s.telemetry.barrierContact, false, `AC-US-0004-02: no contact at step ${i}`);
  }
  assert.ok(Number.isFinite(s.x) && Number.isFinite(s.z), 'AC-US-0004-02: the run stays finite');
});
