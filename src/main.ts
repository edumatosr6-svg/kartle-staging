import * as THREE from 'three';
import { initialState, nearest, track, WIDTH, PUBLISHED_SETUPS, getHandlingTelemetry, getTrackContact, type PublishedSetup, type SetupRef } from './physics';
import { buildLapRecord, compareLapRecords, type LapRecord } from './setupRecords';
import { formatSharedText, shareLabel } from './handlingMessages';
import { RaceAudio } from './audio';
import { SYNTHETIC_TRACK_FILE } from './track';
import type { TrackReading } from './trackData';
import type { TrackGeometry } from './trackGeometry';
import { endTraining, getLapResult, getLapState, listLapResults, offeredLapKinds, pauseLap, repositionKart, resumeLap, stepLap, type LapKind, type LapResult, type LapSession, type LapStateView, type PauseCause } from './lap';
import { advanceClock } from './frameClock';
import { creditFor, describeLap, describeTrainingResult, formatLapTime, greenSignalVisible, message, optionLabel, resolveLanguage, type Language, type MessageKey } from './lapMessages';
// The published Kart Park file, bundled as text (ADR-0002 of pista-kart-park): no request between the choice and the lap.
import kartParkV1Text from './tracks/kart-park-v1.json?raw';
import { getTrainingTrackOptions, initialTrainingSession, OPENING_TRACK_ID, selectTrainingTrack, startTrainingLap, trainingIdleKart, type TrainingSession, type TrainingTrackId, type TrainingTrackSources } from './trainingSession';
import { buildTrackScene, minimapTransform } from './trackScene';
import { CURB_PULSE_MS, decideCurbFeedback, initialCurbFeedback, type CurbFeedbackState } from './curbFeedback';
import { buildKart01Model, updateKart01Pose, KART01_WHEELBASE_M } from './kart01Model';
import { paintKart01Decals } from './kart01Decals';
import { getKartPose, advanceWheelSpin, initialWheelSpin, modelOffsetForwardM, simWheelGroundPositions } from './kartPose';
import { computeCameraView, trackBoundsOf, type CameraView, type TrackBounds } from './gameCamera';
import './style.css';

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const host = $('scene');
const scene = new THREE.Scene();
scene.background = new THREE.Color('#607e59');
scene.fog = new THREE.Fog('#607e59', 160, 350);
const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 500);
let renderer: THREE.WebGLRenderer;
try {
  renderer = new THREE.WebGLRenderer({ antialias: true });
} catch {
  $('welcome').innerHTML = '<h2>Não foi possível abrir o jogo.</h2><p>Seu navegador precisa de WebGL. Tente ativar a aceleração gráfica.</p>';
  throw new Error('WebGL unavailable');
}
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
host.appendChild(renderer.domElement);
scene.add(new THREE.HemisphereLight('#fff9dc', '#35543e', 2.5));
const sun = new THREE.DirectionalLight('#fff0cc', 3);
sun.position.set(45, 100, 60);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
// The shadow box follows the displayed kart (±60 m, 2048 texels: 5.9 cm per texel), so the kart keeps its shadow on any track (DES-0004).
Object.assign(sun.shadow.camera, { left: -60, right: 60, top: 60, bottom: -60 });
sun.shadow.camera.updateProjectionMatrix();
sun.shadow.bias = -0.001;
scene.add(sun);
scene.add(sun.target);

const material = (color: string) => new THREE.MeshStandardMaterial({ color, roughness: 0.9 });
const ground = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), material('#68865b'));
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);
// The synthetic track scene, the same objects as before this feature, grouped so the session can show or hide it (DES-0008).
const syntheticScene = new THREE.Group();
syntheticScene.name = 'synthetic';
scene.add(syntheticScene);

function ribbon(inner: number, outer: number, color: string, y: number) {
  const vertices: number[] = [];
  const indices: number[] = [];
  for (let i = 0; i <= track.length; i++) {
    const p = track[i % track.length];
    const a = track[(i + track.length - 1) % track.length], b = track[(i + 1) % track.length];
    const dx = b.x - a.x, dz = b.z - a.z, length = Math.hypot(dx, dz);
    for (const width of [inner, outer]) vertices.push(p.x + dz / length * width, y, p.z - dx / length * width);
    if (i < track.length) { const k = i * 2; indices.push(k, k + 2, k + 1, k + 1, k + 2, k + 3); }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  const mat = material(color);
  mat.side = THREE.DoubleSide;
  const mesh = new THREE.Mesh(geometry, mat);
  mesh.receiveShadow = true;
  syntheticScene.add(mesh);
}
ribbon(-WIDTH / 2 - 1, WIDTH / 2 + 1, '#e8e2cb', 0.015);
ribbon(-WIDTH / 2, WIDTH / 2, '#434d48', 0.03);

const boxGeo = new THREE.BoxGeometry(1, 1, 1);
function box(parent: THREE.Object3D, size: number[], position: number[], color: string) {
  const mesh = new THREE.Mesh(boxGeo, material(color));
  mesh.scale.set(size[0], size[1], size[2]);
  mesh.position.set(position[0], position[1], position[2]);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}
for (let i = 0; i < track.length; i++) {
  const p = track[i], b = track[(i + 1) % track.length];
  const angle = Math.atan2(b.x - p.x, b.z - p.z);
  if (i % 2 === 0) {
    for (const side of [-1, 1]) {
      const curb = box(syntheticScene, [0.85, 0.12, Math.hypot(b.x - p.x, b.z - p.z) * 1.8], [p.x + Math.cos(angle) * side * 5.9, 0.07, p.z - Math.sin(angle) * side * 5.9], i % 4 === 0 ? '#e39173' : '#f0e9d5');
      curb.rotation.y = angle;
    }
  }
  if (i % 4 === 0) {
    const barrier = box(syntheticScene, [1.1, 0.8, 2.6], [p.x + Math.cos(angle) * 14.1, 0.4, p.z - Math.sin(angle) * 14.1], i % 8 ? '#e6dfc9' : '#3e594b');
    barrier.rotation.y = angle;
  }
}
const start = initialState();
const line = new THREE.Group();
line.position.set(start.x, 0.055, start.z);
line.rotation.y = start.heading;
for (let x = 0; x < 10; x++) for (let z = 0; z < 2; z++) box(line, [1.1, 0.02, 0.7], [(x - 4.5) * 1.1, 0, z * 0.7], (x + z) % 2 ? '#eff0df' : '#25362f');
syntheticScene.add(line);

// Deterministic scenery placement, clear of the driveable course.
for (let i = 0; i < 90; i++) {
  const x = Math.sin(i * 127.1) * 130, z = Math.cos(i * 71.7) * 100;
  if (nearest({ x, z }).distance < 21 || Math.hypot(x, z) < 22) continue;
  const tree = new THREE.Group();
  tree.position.set(x, 0, z);
  box(tree, [0.55, 3, 0.55], [0, 1.5, 0], '#76674a');
  const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(3 + i % 3, 0), material(i % 2 ? '#46694d' : '#879c5b'));
  crown.position.y = 5;
  crown.castShadow = true;
  tree.add(crown);
  syntheticScene.add(tree);
}
// The current setup comes from the published data (DES-0007, ADR-0001); there is no path to the previous version.
let setup: PublishedSetup = PUBLISHED_SETUPS.ARCADE_ASSISTIDO;
// The Kart 01 (DES-0001, DES-0004): built once per page, decals painted once; kart01.root turned by π so the model
// front (-Z) faces the simulation front (+Z). kartRoot lives in the simulation frame (front +Z, left +X).
const kart01 = buildKart01Model();
paintKart01Decals(kart01);
kart01.root.rotation.y = Math.PI;
const kartRoot = new THREE.Group();
kartRoot.add(kart01.root);
scene.add(kartRoot);

const skidMarks = new THREE.InstancedMesh(new THREE.BoxGeometry(0.19, 0.012, 1), new THREE.MeshBasicMaterial({ color: '#202b28', transparent: true, opacity: 0.38 }), 320);
skidMarks.count = 0;
skidMarks.frustumCulled = false;
scene.add(skidMarks);
const skidTransform = new THREE.Object3D();
let skidIndex = 0, lastSkidStepCount = 0;
let previousSkids: THREE.Vector3[] = [];
const audio = new RaceAudio();

// Lap state: the simulation (src/lap.ts) is the single source; this layer only forwards commands and reads views.
let lap: LapSession | undefined;
let config = { ...setup.config, driverMass: 75 };
// The setup identity of the lap, fixed with its config in beginLap and read by the HUD and the lap record (DES-0002).
let setupRef: SetupRef = { setupId: setup.setupId, setupVersion: setup.setupVersion };
// Training session (DES-0005, DES-0007 of pista-kart-park): the track data of each catalogue entry comes bundled; the
// session, its reading and its environment are replaced only by what selectTrainingTrack returns. Nothing is stored.
const TRACK_SOURCES: TrainingTrackSources = { 'kart-park': kartParkV1Text, synthetic: SYNTHETIC_TRACK_FILE };
let training: TrainingSession = initialTrainingSession();
let reading: TrackReading = { trackDataStatus: 'UNREADABLE' };
// The overview fits these bounds: the file geometry of the session's track, or the outer ribbon of the synthetic track;
// undefined without a ready session, which means no scene (DES-0003 of modelo-kart-01).
let trackBounds: TrackBounds | undefined;
let trackGeometry: TrackGeometry | undefined;
const trackScenes: Partial<Record<TrainingTrackId, THREE.Group>> = {};
// Curb feedback state (DES-0009): reset on every training start and every session (the simStepCount restarts at 0), never
// at the end of a training lap, where the kart and its simStepCount go on.
let curbState: CurbFeedbackState = initialCurbFeedback();
const vibrationAvailable = typeof navigator.vibrate === 'function';
// Display state of the feature: wheel spin by simStepCount and the camera of the current frame (DES-0002, DES-0004).
let spin = initialWheelSpin();
let cameraView: CameraView | undefined;
let started = false, accumulatorS = 0, last = performance.now();
// Lap records of the page (DES-0006, DM-0001 section 2): the last ended lap and the best comparable one; nothing persisted.
let lastRecord: LapRecord | undefined, bestRecord: LapRecord | undefined;
const keys = new Set<string>();
const touch = new Set<string>();
let tilt = false, neutral: number | null = null, tiltSteer = 0;
// Wall clock of the adapter only: decides when to emit SENSOR_LOST, never the lap time (ADR-0005).
const SENSOR_SILENCE_MS = 500;
let lastOrientationAtMs = performance.now();
const coarsePointer = matchMedia('(pointer: coarse)');
let touchFallback = false;
let notificationUntil = 0;
let lang: Language = resolveLanguage(navigator.language);
const phase = () => lap?.phase;
const lapActive = () => { const p = phase(); return p === 'COUNTDOWN' || p === 'RUNNING' || p === 'PAUSED'; };
function notify(text: string, duration = 3500) { $('message').textContent = text; notificationUntil = performance.now() + duration; }
function emitPause(cause: PauseCause) {
  const r = pauseLap(lap, cause);
  if (!r.ok) return;
  lap = r.lap; keys.clear(); touch.clear(); accumulatorS = 0;
}
function emitResume() {
  const r = resumeLap(lap);
  if (!r.ok) return;
  lap = r.lap; accumulatorS = 0; lastOrientationAtMs = performance.now();
}
function emitReposition() {
  const r = repositionKart(lap);
  if (r.ok) lap = r.lap;
}
// Ends the training and goes back to the offer, without the result screen; the simulation gives no result to the lap in
// progress (DES-0007, DES-0009). A rejection (NOT_TRAINING, LAP_ENDED) does nothing.
function emitEndTraining() {
  const r = endTraining(lap);
  if (!r.ok) return;
  lap = r.lap; accumulatorS = 0; keys.clear(); touch.clear();
  $('lap-training-result').classList.add('hidden');
  $('welcome').classList.remove('hidden');
}
const OFFER_KEY: Record<LapKind, MessageKey> = { TRAINING: 'startTraining', OFFICIAL: 'startOfficial', RECON: 'startRecon' };
const selectedOption = (trackId: string) => getTrainingTrackOptions(training).options.find(o => o.trackId === trackId);
// The credit line, identical in both screens: text, licence mention and link built with textContent and setAttribute (DES-0007).
function renderCredit(container: HTMLElement, credit: ReturnType<typeof creditFor>) {
  container.replaceChildren();
  if (!credit) { container.classList.add('hidden'); return; }
  const link = document.createElement('a');
  link.setAttribute('href', credit.url);
  link.setAttribute('target', '_blank');
  link.setAttribute('rel', 'noopener noreferrer');
  link.textContent = 'openstreetmap.org/copyright';
  container.append(document.createTextNode(`${credit.text} · ${credit.license} · `), link);
  container.classList.remove('hidden');
}
// Selecting a track ends the session and discards its lap (RULE-0003); the scene and the minimap follow the session (DES-0008).
function chooseTrack(trackId: string) {
  const r = selectTrainingTrack(training, lap, trackId, TRACK_SOURCES);
  if (!r.ok && r.code === 'UNKNOWN_TRACK') return;
  training = r.session; lap = r.lap;
  reading = training.reading ?? { trackDataStatus: 'UNREADABLE' };
  if (reading.trackDataStatus === 'UNREADABLE') console.warn('track-data', 'UNREADABLE');
  else if (reading.trackDataStatus === 'UNSUPPORTED_SCHEMA') console.warn('track-data', 'UNSUPPORTED_SCHEMA', reading.schemaVersion);
  else if (reading.trackDataStatus === 'INCOMPLETE') console.warn('track-data', 'INCOMPLETE', reading.trackId, reading.trackVersion);
  curbState = initialCurbFeedback();
  resultLang = undefined; handledResults = 0; shownTrainingResultKey = '';
  skidMarks.count = 0; skidIndex = 0; previousSkids = [];
  const ready = training.sessionState === 'READY';
  trackGeometry = training.environment?.track;
  syntheticScene.visible = ready && !trackGeometry;
  for (const group of Object.values(trackScenes)) if (group) group.visible = false;
  if (ready && trackGeometry) {
    const id = training.selectedTrackId;
    let group = trackScenes[id];
    if (!group) { group = buildTrackScene(trackGeometry); trackScenes[id] = group; scene.add(group); }
    group.visible = true;
    trackBounds = { minXM: trackGeometry.bounds.minX, maxXM: trackGeometry.bounds.maxX, minZM: trackGeometry.bounds.minZ, maxZM: trackGeometry.bounds.maxZ };
  } else trackBounds = ready ? trackBoundsOf(track, WIDTH / 2 + 1) : undefined;
  const option = selectedOption(training.selectedTrackId);
  $('track-name').textContent = option ? optionLabel(option) : '';
  renderBest();
}
let offerKey: string | undefined;
function renderOffer() {
  const view = getTrainingTrackOptions(training);
  const key = `${lang}:${view.sessionState}:${view.selectedTrackId}:${view.trackDataStatus ?? ''}`;
  if (offerKey === key) return;
  offerKey = key;
  const selector = $('track-selector');
  selector.replaceChildren(...view.options.map(option => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.trackId = option.trackId;
    button.textContent = optionLabel(option);
    button.setAttribute('aria-pressed', String(option.trackId === view.selectedTrackId));
    button.onclick = () => chooseTrack(option.trackId);
    return button;
  }));
  renderCredit($('track-credit'), creditFor(selectedOption(view.selectedTrackId)));
  const status = $('track-status');
  const offer = $('lap-offer');
  offer.replaceChildren();
  if (view.sessionState === 'NO_SESSION' || view.sessionState === 'LOADING') { status.textContent = message('loadingTrack', lang); return; }
  if (view.sessionState === 'FAILED' || reading.trackDataStatus === 'UNREADABLE' || reading.trackDataStatus === 'UNSUPPORTED_SCHEMA') {
    status.textContent = message('trackDataError', lang);
    return;
  }
  status.textContent = reading.trackId;
  // A training session offers TRAINING only (REQ-FEAT-0001-11): the challenge kinds are another feature's.
  for (const kind of offeredLapKinds(reading, [])) {
    const button = document.createElement('button');
    button.className = 'primary';
    button.textContent = message(OFFER_KEY[kind], lang);
    button.onclick = () => beginLap();
    offer.appendChild(button);
  }
}
// One new lap result (DES-0006): reads neither the phase nor the trigger, which is race-lap-validation's, so it serves the
// official, the recon and each training lap alike; the same result handled twice gives the same records.
function recordLapResult(result: LapResult) {
  lastRecord = buildLapRecord(result, setupRef);
  if (lastRecord.lapValidity === 'VALID' && lastRecord.lapMs !== undefined) {
    if (!bestRecord || bestRecord.lapMs === undefined) bestRecord = lastRecord;
    else {
      const compared = compareLapRecords(bestRecord, lastRecord);
      if ('code' in compared) console.warn('lap-record', compared.code);
      else if (compared.comparability === 'COMPARABLE' && lastRecord.lapMs < bestRecord.lapMs) bestRecord = lastRecord;
    }
  }
  renderBest();
}
// The best time is shown only when it is COMPARABLE with the current setup on the current track (RULE-0003, SCR-0002).
function renderBest() {
  const el = $('best');
  if (!bestRecord || bestRecord.lapMs === undefined || (reading.trackDataStatus !== 'COMPLETE' && reading.trackDataStatus !== 'INCOMPLETE')) { el.textContent = '—'; return; }
  const compared = compareLapRecords(bestRecord, { trackId: reading.trackId, trackVersion: reading.trackVersion, setupId: setup.setupId, setupVersion: setup.setupVersion });
  if ('code' in compared) { console.warn('lap-record', compared.code); el.textContent = '—'; return; }
  el.textContent = compared.comparability === 'COMPARABLE' ? formatLapTime(bestRecord.lapMs) : '—';
}
function beginLap() {
  const r = startTrainingLap(training, lap, config, { setupId: setup.setupId, setupVersion: setup.setupVersion });
  if (!r.ok) return;
  setupRef = { setupId: setup.setupId, setupVersion: setup.setupVersion };
  curbState = initialCurbFeedback();
  lap = r.lap; started = true; accumulatorS = 0; keys.clear(); touch.clear();
  touchFallback = coarsePointer.matches && !tilt;
  skidMarks.count = 0; skidIndex = 0; previousSkids = [];
  resultLang = undefined; handledResults = 0; shownTrainingResultKey = '';
  $('welcome').classList.add('hidden');
  $('lap-result').classList.add('hidden');
}
$('driver-mass').oninput = e => {
  const mass = Number((e.target as HTMLInputElement).value);
  $('mass-value').textContent = `${mass} kg`;
  $('total-mass').textContent = `${mass + config.kartMass} kg`;
};
$('driver-mass').onchange = e => {
  config = { ...config, driverMass: Number((e.target as HTMLInputElement).value) };
  bestRecord = undefined; renderBest();
  notify('Peso atualizado. Vale na próxima volta.');
};
// The two values of the <select> map to the published setups; no option for the previous version (DES-0007).
const SETUP_BY_PRESET = { arcade: 'ARCADE_ASSISTIDO', rental: 'REALISTA_ALUGUEL_4T' } as const;
$('handling-preset').onchange = e => {
  const preset = (e.target as HTMLSelectElement).value as keyof typeof SETUP_BY_PRESET;
  if (!(preset in SETUP_BY_PRESET)) return;
  setup = PUBLISHED_SETUPS[SETUP_BY_PRESET[preset]];
  config = { ...setup.config, driverMass: config.driverMass };
  setupRef = { setupId: setup.setupId, setupVersion: setup.setupVersion };
  bestRecord = undefined; renderBest();
  $('preset-label').textContent = preset === 'arcade' ? 'ARCADE ASSISTIDO · TREINO LIVRE' : 'ALUGUEL 4T · TREINO LIVRE';
  $('assist-description').textContent = preset === 'arcade'
    ? 'Direção progressiva, freio equilibrado e ajuda para conter rodadas. Você escolhe a trajetória.'
    : 'Sem assistências de direção ou estabilidade. Frenagem traseira e maior exigência nas curvas.';
  notify(`${preset === 'arcade' ? 'Arcade' : 'Realista'} selecionado. Vale na próxima volta.`);
};
$('sound').onclick = async () => {
  try {
    const enabled = await audio.toggle();
    $('sound').textContent = enabled ? 'Som ligado' : 'Som desligado';
    $('sound').setAttribute('aria-pressed', String(enabled));
  } catch { notify('Áudio indisponível neste navegador.'); }
};
$('reset').onclick = emitReposition;
// Resumes a paused lap; in a training in COUNTDOWN or RUNNING it is the pause button (REQ-FEAT-0010-15).
$('pause').onclick = () => { if (phase() === 'PAUSED') emitResume(); else emitPause('PAUSE_BUTTON'); };
$('lap-end-training').onclick = emitEndTraining;
$('lap-new-lap').onclick = () => { $('lap-result').classList.add('hidden'); $('welcome').classList.remove('hidden'); };
// Share the last record through the Web Share API, or the clipboard; a failure only notifies and changes no record.
$('lap-share').onclick = async () => {
  if (!lastRecord) return;
  const text = formatSharedText(lastRecord, lang);
  try {
    if (navigator.share) await navigator.share({ text });
    else await navigator.clipboard.writeText(text);
  } catch { notify(lang === 'pt' ? 'Não foi possível compartilhar.' : 'Could not share.'); }
};
document.addEventListener('keydown', e => {
  if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement || e.target instanceof HTMLTextAreaElement || (e.target instanceof HTMLElement && e.target.isContentEditable)) return;
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();
  keys.add(e.key.toLowerCase());
  if (!e.repeat && e.key.toLowerCase() === 'r') emitReposition();
  if (!e.repeat && e.key === 'Escape') { if (phase() === 'PAUSED') emitResume(); else emitPause('ESC_KEY'); }
});
document.addEventListener('keyup', e => keys.delete(e.key.toLowerCase()));
// Losing focus pauses; regaining it never resumes (RULE-0002).
window.addEventListener('blur', () => { keys.clear(); touch.clear(); emitPause('FOCUS_LOST'); });
document.addEventListener('visibilitychange', () => { if (document.hidden) emitPause('FOCUS_LOST'); });
for (const button of document.querySelectorAll<HTMLButtonElement>('[data-control]')) {
  const control = button.dataset.control!;
  button.onpointerdown = e => { e.preventDefault(); button.setPointerCapture(e.pointerId); touch.add(control); };
  button.onpointerup = button.onpointercancel = button.onlostpointercapture = () => touch.delete(control);
}
$('tilt').onclick = async () => {
  if (tilt) { tilt = false; neutral = null; $('tilt').textContent = 'Ativar inclinação'; return; }
  if (!window.isSecureContext || !('DeviceOrientationEvent' in window)) { notify('Inclinação indisponível. Use os botões de direção.'); return; }
  try {
    const event = DeviceOrientationEvent as typeof DeviceOrientationEvent & { requestPermission?: () => Promise<string> };
    if (event.requestPermission && await event.requestPermission() !== 'granted') throw new Error('denied');
    neutral = null; tilt = true; lastOrientationAtMs = performance.now();
    $('tilt').textContent = 'Desativar inclinação';
    notify('Segure o celular na posição de dirigir.');
  } catch { notify('Permissão não concedida. Use os botões.'); }
};
window.addEventListener('deviceorientation', e => {
  if (!tilt || e.gamma === null || e.beta === null) return;
  lastOrientationAtMs = performance.now();
  const angle = screen.orientation?.angle ?? 0;
  const value = Math.abs(angle) === 90 ? e.beta * (angle === 90 ? 1 : -1) : e.gamma;
  if (neutral === null) { neutral = value; notify('Inclinação calibrada. Acelere pelo botão.'); }
  const delta = value - neutral;
  tiltSteer = Math.abs(delta) < 3 ? 0 : THREE.MathUtils.clamp(delta / 25, -1, 1);
});
screen.orientation?.addEventListener('change', () => { neutral = null; tiltSteer = 0; });
const mini = $('minimap') as unknown as HTMLCanvasElement;
const ctx = mini.getContext('2d')!;
// The centerline of the session's track: the file geometry fitted into the canvas, or the synthetic track with its
// literal transform (* 1.1 + 110, * 1.1 + 75); without a ready session the canvas is only cleared (DES-0008).
function minimap() {
  ctx.clearRect(0, 0, 220, 150);
  if (training.sessionState !== 'READY') return;
  const t = trackGeometry ? minimapTransform(trackGeometry.bounds) : { scale: 1.1, offsetX: 110, offsetY: 75 };
  const points = trackGeometry ? trackGeometry.centerline.map(p => ({ x: p.xM, z: p.zM })) : track;
  ctx.lineWidth = 9; ctx.strokeStyle = '#e5ecd54d'; ctx.lineJoin = 'round';
  ctx.beginPath();
  points.forEach((p, i) => { const x = p.x * t.scale + t.offsetX, y = p.z * t.scale + t.offsetY; if (!i) ctx.moveTo(x, y); else ctx.lineTo(x, y); });
  ctx.closePath(); ctx.stroke();
  const kartState = lap?.kart ?? trainingIdleKart(training);
  if (!kartState) return;
  ctx.fillStyle = '#def39a'; ctx.beginPath(); ctx.arc(kartState.x * t.scale + t.offsetX, kartState.z * t.scale + t.offsetY, 5, 0, Math.PI * 2); ctx.fill();
}
// HUD and result screens: they display what the simulation reports and decide nothing (I2).
let shownStateText = '', shownSectorsKey = '', resultLang: Language | undefined, shownTrainingResultKey = '';
// How many items of listLapResults were already handled: each new result is recorded once (DES-0007).
let handledResults = 0;
function renderHud() {
  const view = getLapState(lap);
  const countdown = $('lap-countdown'), state = $('lap-state'), paused = $('lap-paused'), sectors = $('lap-sectors');
  if ('code' in view) {
    for (const el of [countdown, state, paused, sectors, $('lap-best-valid'), $('lap-training-result')]) el.classList.add('hidden');
    $('timer').textContent = formatLapTime(0);
    return;
  }
  const d = describeLap(view, lang);
  if (d.countdownText) { countdown.textContent = d.countdownText; countdown.classList.remove('hidden'); }
  else if (greenSignalVisible(view)) { countdown.textContent = message('countdownGreenSignal', lang); countdown.classList.remove('hidden'); }
  else countdown.classList.add('hidden');
  const stateText = d.reasonText ? `${d.stateText} · ${d.reasonText}` : d.stateText;
  if (stateText !== shownStateText) { shownStateText = stateText; state.textContent = stateText; }
  state.dataset.validity = view.lapValidity;
  state.classList.remove('hidden');
  paused.classList.toggle('hidden', !d.pausedText);
  if (d.pausedText) paused.textContent = d.pausedText;
  const sectorsKey = `${lang}:${view.completedSectorMs.join(',')}`;
  if (sectorsKey !== shownSectorsKey) {
    shownSectorsKey = sectorsKey;
    sectors.replaceChildren(...view.completedSectorMs.map((ms, i) => {
      const li = document.createElement('li');
      li.className = 'lap-chip';
      li.textContent = `${message('sectorLabel', lang)} ${i + 1} ${formatLapTime(ms)}`;
      return li;
    }));
  }
  sectors.classList.toggle('hidden', view.completedSectorMs.length === 0);
  $('timer').textContent = formatLapTime(view.elapsedMs);
  const best = $('lap-best-valid');
  best.classList.toggle('hidden', view.bestValidLapMs === undefined);
  if (view.bestValidLapMs !== undefined) best.textContent = `${message('bestValidLap', lang)} ${formatLapTime(view.bestValidLapMs)}`;
  renderTrainingResult(view);
}
// The result of the latest training lap, beside the lap in progress and without stopping the kart, until the next result
// or the end of the training (ADR-0004, item 5); rebuilt only when that result or the language changes.
function renderTrainingResult(view: LapStateView) {
  const panel = $('lap-training-result');
  const result = getLapResult(lap);
  if (view.lapKind !== 'TRAINING' || view.lapPhase === 'ENDED' || 'code' in result) { panel.classList.add('hidden'); shownTrainingResultKey = ''; return; }
  const key = `${lang}:${result.lapSequenceCount}`;
  if (key !== shownTrainingResultKey) {
    shownTrainingResultKey = key;
    const d = describeTrainingResult(result, lang);
    const chip = (tag: 'p' | 'li', text: string) => { const el = document.createElement(tag); el.className = 'lap-chip'; el.textContent = text; return el; };
    const items: HTMLElement[] = [
      chip('p', d.reasonText ? `${d.validityText} · ${d.reasonText}` : d.validityText),
      chip('p', `${message('totalLabel', lang)} ${d.totalText}${d.unofficialText ? ` · ${d.unofficialText}` : ''}`),
    ];
    if (d.sectorTexts) {
      const list = document.createElement('ul');
      list.replaceChildren(...d.sectorTexts.map((text, i) => chip('li', `${message('sectorLabel', lang)} ${i + 1} ${text}`)));
      items.push(list);
    }
    panel.dataset.validity = result.lapValidity;
    // The redraw keeps the credit container, the panel's last child (ADR-0007): only the result elements are replaced.
    const credit = $('lap-training-result-credit');
    for (const child of [...panel.children]) if (child !== credit) child.remove();
    credit.before(...items);
    renderCredit($('lap-training-result-credit'), creditFor(selectedOption(result.trackId)));
  }
  panel.classList.remove('hidden');
}
function renderResult() {
  const result = getLapResult(lap);
  const panel = $('lap-result');
  if ('code' in result) { panel.classList.add('hidden'); return; }
  if (resultLang === lang) return;
  resultLang = lang;
  panel.dataset.validity = result.lapValidity;
  const total = $('lap-result-total'), list = $('lap-result-sectors');
  if (result.lapValidity === 'VALID' && result.lapMs !== undefined && result.sectorMs) {
    $('lap-result-title').textContent = message('lapResultValid', lang);
    total.textContent = `${message('totalLabel', lang)} ${formatLapTime(result.lapMs)}${result.official ? '' : ` · ${message('lapUnofficial', lang)}`}`;
    list.replaceChildren(...result.sectorMs.map((ms, i) => {
      const li = document.createElement('li');
      li.className = 'lap-chip';
      li.textContent = `${message('sectorLabel', lang)} ${i + 1} ${formatLapTime(ms)}`;
      return li;
    }));
    total.classList.remove('hidden');
  } else {
    const reasonKey: Record<NonNullable<typeof result.invalidReason>, MessageKey> = { MISSED_MARKER: 'reasonMissedMarker', CUT: 'reasonCut', REPOSITION: 'reasonReposition' };
    const reason = result.invalidReason ? message(reasonKey[result.invalidReason], lang) : undefined;
    $('lap-result-title').textContent = reason ? `${message('lapStateInvalid', lang)} · ${reason}` : message('lapStateInvalid', lang);
    total.textContent = ''; total.classList.add('hidden');
    list.replaceChildren();
  }
  $('lap-new-lap').textContent = message('newLap', lang);
  $('lap-share').textContent = shareLabel(lang);
  panel.classList.remove('hidden');
}
new ResizeObserver(() => {
  renderer.setSize(host.clientWidth, host.clientHeight);
}).observe(host);
// Writes the camera of the frame (API-0003) to the Three.js camera: position, aim, vertical fov, aspect and a far plane that holds the overview.
function applyCameraView(target: THREE.PerspectiveCamera, view: CameraView): void {
  target.position.set(view.cameraXM, view.cameraHeightM, view.cameraZM);
  target.up.set(0, 1, 0);
  target.lookAt(view.aimXM, view.aimHeightM, view.aimZM);
  target.fov = view.verticalFovDeg;
  target.aspect = view.viewWidthPx / view.viewHeightPx;
  target.far = Math.max(500, 3 * view.cameraHeightM);
  target.updateProjectionMatrix();
}
function frame(now: number) {
  requestAnimationFrame(frame);
  const dt = Math.min((now - last) / 1000, 0.1); last = now;
  lang = resolveLanguage(navigator.language);
  if (tilt && lap && (lap.phase === 'COUNTDOWN' || lap.phase === 'RUNNING') && now - lastOrientationAtMs > SENSOR_SILENCE_MS) emitPause('SENSOR_LOST');
  if (lap && (lap.phase === 'COUNTDOWN' || lap.phase === 'RUNNING')) {
    const left = keys.has('a') || keys.has('arrowleft') || touch.has('left');
    const right = keys.has('d') || keys.has('arrowright') || touch.has('right');
    const input = {
      throttle: +(keys.has('w') || keys.has('arrowup') || touch.has('throttle')),
      brake: +(keys.has('s') || keys.has('arrowdown') || touch.has('brake')),
      steer: left || right ? Number(right) - Number(left) : tilt ? tiltSteer : 0,
      drift: keys.has(' '),
    };
    const clock = advanceClock(accumulatorS, dt);
    accumulatorS = clock.accumulatorS;
    for (let i = 0; i < clock.steps && lap.phase !== 'ENDED'; i++) {
      lap = stepLap(lap, input);
      // Curb feedback (RULE-0004, DES-0009): decided per advanced step from the contact reading, never from wall time.
      const contact = getTrackContact(lap.kart, lap.environment, lap.config);
      if (!('code' in contact)) {
        const feedback = decideCurbFeedback(curbState, {
          simStepCount: contact.simStepCount, curbWheelCount: contact.curbWheelCount,
          channel: coarsePointer.matches ? 'web-mobile' : 'web-desktop', vibrationAvailable, soundOn: audio.soundOn(),
        });
        curbState = feedback.state;
        if (feedback.pulse) navigator.vibrate(CURB_PULSE_MS);
        if (feedback.sound) audio.curb();
      }
    }
  }
  // Without a ready session there is no kart to display (DES-0007); the HUD readouts fall back to a kart at rest.
  const idleKart = trainingIdleKart(training);
  const state = lap?.kart ?? idleKart ?? initialState();
  const running = lap?.phase === 'RUNNING';
  // Every new result is handled once, in order: each training lap closed on the finish line, or the end of an official or
  // recon lap (DES-0007); a result never changes once produced.
  const lapResults = listLapResults(lap).lapResults;
  for (; handledResults < lapResults.length; handledResults++) recordLapResult(lapResults[handledResults]);
  // The displayed kart is the state of the last completed step (API-0001); nothing is interpolated or estimated.
  const pose = getKartPose(lap?.kart ?? idleKart);
  if ('code' in pose) kartRoot.visible = false;
  else {
    kartRoot.visible = true;
    kartRoot.position.set(pose.xM, 0, pose.zM); kartRoot.rotation.y = pose.headingRad;
    // The reference point of RULE-0003 sits at (xM, zM): the model mid-wheelbase is offset ahead by the frontWeight fraction.
    kart01.root.position.z = modelOffsetForwardM((lap?.config ?? config).frontWeight, KART01_WHEELBASE_M);
    spin = advanceWheelSpin(spin, pose);
    updateKart01Pose(kart01, { steerAngleRad: pose.steerAngleRad, wheelSpinRevs: spin.revs });
    sun.position.set(pose.xM + 45, 100, pose.zM + 60);
    sun.target.position.set(pose.xM, 0, pose.zM);
  }
  audio.update(state.speed, state.throttle, running);
  // Tyre-mark situation (DES-0005, RULE-0003), read once per frame from the last completed step: a new step, RUNNING,
  // speedMps > 6 and sideslipRad > 0.055. A counter that went backwards (new lap, reposition) restarts the chain
  // without moving the marks already drawn; a frame without a new step draws nothing.
  if ('code' in pose || pose.simStepCount < lastSkidStepCount) {
    previousSkids = [];
    if (!('code' in pose)) lastSkidStepCount = pose.simStepCount;
  } else if (pose.simStepCount > lastSkidStepCount) {
    lastSkidStepCount = pose.simStepCount;
    const skidLapState = getLapState(lap);
    if (!lap || 'code' in skidLapState || skidLapState.lapPhase !== 'RUNNING') previousSkids = [];
    else {
      // The rear simulation wheel positions of the lap's frozen config, carried by the pose: never the model's wheel centres (NFR-0007).
      const rear = simWheelGroundPositions(pose, lap.config).slice(2).map(p => new THREE.Vector3(p.xM, 0.055, p.zM));
      const skidTelemetry = getHandlingTelemetry(lap.kart, setupRef);
      if (!('code' in skidTelemetry) && skidTelemetry.speedMps > 6 && skidTelemetry.sideslipRad > 0.055) {
        rear.forEach((p, i) => {
          const previous = previousSkids[i];
          if (!previous) return;
          skidTransform.position.copy(p).add(previous).multiplyScalar(0.5);
          skidTransform.rotation.y = Math.atan2(p.x - previous.x, p.z - previous.z);
          skidTransform.scale.set(1, 1, p.distanceTo(previous));
          skidTransform.updateMatrix();
          skidMarks.setMatrixAt(skidIndex, skidTransform.matrix);
          skidIndex = (skidIndex + 1) % 320;
          skidMarks.count = Math.min(320, skidMarks.count + 1);
        });
        skidMarks.instanceMatrix.needsUpdate = true;
      }
      previousSkids = rear;
    }
  }
  // The camera is a pure function of the frame (ADR-0002): lap state, pose and play-area shape read this frame.
  const viewWidthPx = host.clientWidth, viewHeightPx = host.clientHeight;
  if (viewWidthPx > 0 && viewHeightPx > 0) {
    const view = computeCameraView({
      lapState: getLapState(lap), kartPose: pose, viewWidthPx, viewHeightPx, trackBounds,
    });
    cameraView = 'code' in view ? undefined : view;
    if (cameraView) applyCameraView(camera, cameraView);
  }
  renderHud();
  // The result screen is only for an official or recon lap; an ended training goes back to the offer (DES-0010).
  if (lap?.phase === 'ENDED' && lap.lapKind !== 'TRAINING') renderResult();
  renderOffer();
  const active = lapActive();
  ($('driver-mass') as HTMLInputElement).disabled = active;
  ($('handling-preset') as HTMLSelectElement).disabled = active;
  const pauseButton = $('pause');
  const inTraining = lap?.lapKind === 'TRAINING';
  const pauseOffered = inTraining && (lap?.phase === 'COUNTDOWN' || lap?.phase === 'RUNNING');
  pauseButton.classList.toggle('hidden', lap?.phase !== 'PAUSED' && !pauseOffered);
  pauseButton.textContent = lap?.phase === 'PAUSED' ? `▶ ${message('resumeLap', lang)}` : `❚❚ ${message('pauseAction', lang)}`;
  const endTrainingButton = $('lap-end-training');
  endTrainingButton.classList.toggle('hidden', !(inTraining && active));
  endTrainingButton.textContent = message('endTrainingAction', lang);
  const fallback = $('lap-control-fallback');
  const showFallback = active ? touchFallback : coarsePointer.matches && !tilt;
  fallback.classList.toggle('hidden', !showFallback);
  if (showFallback) fallback.textContent = message('controlFallbackTouch', lang);
  // Speed and handling state come from the telemetry contract (DES-0005, API-0001); NO_STATE leaves both empty.
  const telemetry = getHandlingTelemetry(state, setupRef);
  const labels = { grip: 'Aderência', understeer: 'Saindo de frente', oversteer: 'Saindo de traseira', sliding: 'Derrapando' };
  if ('code' in telemetry) { $('speed').textContent = ''; $('handling').textContent = ''; }
  else {
    $('speed').textContent = Math.round(telemetry.speedMps * 3.6).toString();
    $('handling').textContent = labels[telemetry.handling];
    $('handling').dataset.state = telemetry.handling;
  }
  const t = state.telemetry;
  $('lateral-g').textContent = `${Math.abs(t.lateralG).toFixed(2)} g`;
  $('longitudinal-g').textContent = `${t.longitudinalG >= 0 ? '+' : ''}${t.longitudinalG.toFixed(2)} g`;
  $('front-slip').textContent = `${(t.frontSlip * 180 / Math.PI).toFixed(1)}°`;
  $('rear-slip').textContent = `${(t.rearSlip * 180 / Math.PI).toFixed(1)}°`;
  for (let i = 0; i < 4; i++) {
    const wheel = t.wheels[i];
    const load = wheel?.load ?? (config.kartMass + config.driverMass) * 9.81 * (i < 2 ? config.frontWeight : 1 - config.frontWeight) / 2;
    $(`load-${i}`).style.setProperty('--load', `${Math.min(100, load / ((config.kartMass + config.driverMass) * 9.81) * 200)}%`);
    $(`load-${i}`).textContent = `${Math.round(load)} N`;
    $(`load-${i}`).classList.toggle('saturated', (wheel?.utilization ?? 0) > 1);
  }
  if (now > notificationUntil) $('message').textContent = '';
  minimap();
  // Without a camera of the frame (no track loaded) nothing is drawn: no scene and no provisional kart (SCR-0001).
  if (cameraView) renderer.render(scene, camera); else renderer.clear();
}
// The game always opens on the Kart Park (REQ-FEAT-0001-02): no stored choice is read (ADR-0005).
chooseTrack(OPENING_TRACK_ID);
requestAnimationFrame(frame);
