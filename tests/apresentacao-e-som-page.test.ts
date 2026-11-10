// TEST-0004 — the declarations of the page document and the text contracts of the application (API-0001, DES-0001,
// DES-0003): the icon, the home-screen icon and the link preview declared in index.html; the cover that no screen shows;
// the sound control that opens off and is the only caller of the sound command; the recordings imported inside the
// script; the frame reading composed after the tyre-mark block; no network API; the layers; the curb sound untouched
// (strategy: page, contract and text levels). src/main.ts is read as text: `npm test` does not load it.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { initialDownloadFiles } from '../scripts/assetBudget';
import { tyreMarkBlockOf } from './helpers/kart01Report';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (file: string) => readFileSync(join(root, file), 'utf8').replace(/\r\n/g, '\n');
const stripComments = (text: string) => text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
const code = (file: string) => stripComments(read(file));
const sha256 = (text: string) => createHash('sha256').update(text).digest('hex');
const count = (text: string, piece: string) => text.split(piece).length - 1;
const uses = (text: string, symbol: string) => new RegExp(`(^|[^\\w.$'"])${symbol.replace('.', '\\.')}(?![\\w$])`).test(text);
const importsOf = (text: string) => [...text.matchAll(/(?:from|import)\s+'([^']+)'/g)].map(m => m[1]);
function filesUnder(dir: string, extensions: string[]): string[] {
  const out: string[] = [];
  for (const name of readdirSync(join(root, dir)).sort()) {
    const relative = `${dir}/${name}`;
    if (statSync(join(root, relative)).isDirectory()) out.push(...filesUnder(relative, extensions));
    else if (extensions.some(e => name.endsWith(e))) out.push(relative);
  }
  return out;
}

// ---------------------------------------------------------------- the document as its elements
const html = read('index.html').replace(/<!--[\s\S]*?-->/g, '');
const head = /<head>([\s\S]*?)<\/head>/.exec(html)?.[1] ?? '';
const body = /<body>([\s\S]*?)<\/body>/.exec(html)?.[1] ?? '';
type Element = { tag: string; attributes: Record<string, string>; text: string; line: number };
function elements(fragment: string, tag: string): Element[] {
  const out: Element[] = [];
  for (const m of fragment.matchAll(new RegExp(`<${tag}\\b([^>]*)>`, 'gi'))) {
    const attributes: Record<string, string> = {};
    for (const a of m[1].matchAll(/([^\s"'<>/=]+)\s*=\s*"([^"]*)"/g)) attributes[a[1].toLowerCase()] = a[2];
    out.push({ tag, attributes, text: m[0], line: fragment.slice(0, m.index).split('\n').length });
  }
  return out;
}
const links = (rel: string) => elements(head, 'link').filter(e => (e.attributes.rel ?? '').split(/\s+/).includes(rel));
const metas = (property: string) => elements(head, 'meta').filter(e => e.attributes.property === property);
const ICON = '/src/assets/icon.png', COVER = '/src/assets/cover.jpg';
// The description registered in ADR-0003, choice 1.
const PREVIEW_DESCRIPTION = 'Corra contra o relógio em uma pista de kart e busque a sua melhor volta.';

test('CHK-TEST-0004-01 the page document declares the delivered icon as the page icon, once, in the head', () => {
  // AC-US-0001-01, AC-US-0001-02
  const icons = links('icon');
  assert.equal(icons.length, 1, `AC-US-0001-01: the document declares exactly one page icon (${icons.length})`);
  assert.equal(icons[0].attributes.href, ICON, 'AC-US-0001-01: the page icon points to the delivered icon, /src/assets/icon.png');
  assert.equal(icons[0].attributes.type, 'image/png', 'AC-US-0001-01: declared as a PNG image');
  assert.ok(existsSync(join(root, ICON.slice(1))), 'AC-US-0001-01: the declared file exists');
  assert.equal(elements(body, 'link').length, 0, 'AC-US-0001-02: the declaration is in the head, the same document for web-desktop and web-mobile');
  assert.ok(initialDownloadFiles(html).includes(ICON.slice(1)), 'AC-US-0001-02: the browser asks for the icon when the page opens');
});

test('CHK-TEST-0004-02 the page document declares the same delivered icon as the home-screen icon', () => {
  // AC-US-0001-03
  const touch = links('apple-touch-icon');
  assert.equal(touch.length, 1, `AC-US-0001-03: the document declares exactly one home-screen icon (${touch.length})`);
  assert.equal(touch[0].attributes.href, ICON, 'AC-US-0001-03: the home-screen icon points to the same delivered icon');
  assert.equal(touch[0].attributes.href, links('icon')[0]?.attributes.href, 'AC-US-0001-03: the tab and the shortcut show the same file');
});

test('CHK-TEST-0004-03 the page document declares the delivered cover as the link-preview image', () => {
  // AC-US-0002-01
  const images = metas('og:image');
  assert.equal(images.length, 1, `AC-US-0002-01: the document declares exactly one preview image (${images.length})`);
  assert.equal(images[0].attributes.content, COVER, 'AC-US-0002-01: the preview image points to the delivered cover, /src/assets/cover.jpg');
  assert.ok(existsSync(join(root, COVER.slice(1))), 'AC-US-0002-01: the declared file exists');
  assert.equal(elements(head, 'meta').filter(e => /^og:image:(width|height)$/.test(e.attributes.property ?? '')).length, 0, 'AC-US-0002-01: the document does not declare the size of the cover (API-0001)');
});

test('CHK-TEST-0004-04 the page document declares the preview title exactly "Kartle", next to the cover, and keeps the declarations it already had', () => {
  // AC-US-0002-03
  const titles = metas('og:title');
  assert.equal(titles.length, 1, `AC-US-0002-03: the document declares exactly one preview title (${titles.length})`);
  assert.equal(titles[0].attributes.content, 'Kartle', 'AC-US-0002-03: the preview title is exactly "Kartle"');
  const group = [titles[0], metas('og:description')[0], metas('og:image')[0]];
  assert.ok(group.every(e => e !== undefined), 'AC-US-0002-03: title, description and image are all declared');
  assert.deepEqual(group.map(e => e.line), [titles[0].line, titles[0].line + 1, titles[0].line + 2], 'AC-US-0002-03: the three preview declarations stand together, in consecutive lines');
  assert.match(head, /<title>Kartle — Entre na pista<\/title>/, 'AC-US-0002-03: the page title is unchanged');
  assert.match(head, /<meta name="description" content="Kartle: protótipo de kart no navegador\. Entre na pista e teste sua melhor volta\." \/>/, 'AC-US-0002-03: the page description is unchanged');
  assert.match(head, /<meta name="theme-color" content="#13241e" \/>/, 'AC-US-0002-03: the theme colour is unchanged');
});

test('CHK-TEST-0004-05 the page document declares a preview description of one sentence in Portuguese: the registered text, with a single full stop, at the end', () => {
  // AC-US-0002-04
  const descriptions = metas('og:description');
  assert.equal(descriptions.length, 1, `AC-US-0002-04: the document declares exactly one preview description (${descriptions.length})`);
  const text = descriptions[0].attributes.content;
  assert.equal(text, PREVIEW_DESCRIPTION, 'AC-US-0002-04: the description is the text registered in ADR-0003');
  assert.equal(count(text, '.'), 1, 'AC-US-0002-04: one full stop');
  assert.ok(text.endsWith('.'), 'AC-US-0002-04: at the end');
  assert.ok(!/[!?…;:\n]/.test(text), 'AC-US-0002-04: and no other end-of-sentence mark: one sentence');
  assert.ok(/^[A-ZÀ-Ý]/.test(text) && text.trim() === text && text.length > 20, 'AC-US-0002-04: a whole sentence, not a fragment');
  assert.ok(/\b(uma|sua|melhor|volta|pista|relógio)\b/.test(text), 'AC-US-0002-04: written in Portuguese');
});

test('CHK-TEST-0004-06 no screen of the game can show the cover: no script or stylesheet of the application names it, and the document names it only as the preview image and the preload', () => {
  // AC-US-0002-07
  const sources = filesUnder('src', ['.ts', '.css']);
  assert.ok(sources.includes('src/main.ts') && sources.includes('src/style.css'), 'AC-US-0002-07: fixture: the application scripts and its stylesheet are read');
  for (const file of sources) assert.ok(!/cover/i.test(read(file)), `AC-US-0002-07: ${file} must not contain "cover"`);
  assert.equal(count(html.toLowerCase(), 'cover'), 2, 'AC-US-0002-07: the document names the cover in exactly two places');
  assert.equal(metas('og:image')[0]?.attributes.content, COVER, 'AC-US-0002-07: one is the preview image');
  const preloads = links('preload').filter(e => e.attributes.href === COVER);
  assert.equal(preloads.length, 1, 'AC-US-0002-07: the other is the preload');
  assert.ok(!/cover/i.test(body), 'AC-US-0002-07: the body does not reference the cover');
  assert.equal(elements(body, 'img').length, 0, 'AC-US-0002-07: the body has no image element');
  assert.ok(!/background(-image)?\s*:[^;]*url\(/i.test(body), 'AC-US-0002-07: nor an inline background image');
  for (const file of sources) assert.ok(!/assets\/[\w-]+\.(jpg|jpeg|png)/i.test(read(file)), `AC-US-0002-07: ${file} must not reference an image of src/assets`);
});

test('CHK-TEST-0004-07 the page opens showing the sound off, and no module keeps the sound state in the browser storage', () => {
  // AC-US-0003-08
  const sound = elements(body, 'button').filter(e => e.attributes.id === 'sound');
  assert.equal(sound.length, 1, 'AC-US-0003-08: the document has one sound control, #sound');
  assert.equal(sound[0].attributes['aria-pressed'], 'false', 'AC-US-0003-08: the control opens not pressed');
  assert.match(body, /<button id="sound" aria-pressed="false">Som desligado<\/button>/, 'AC-US-0003-08: the control opens with the text "Som desligado"');
  for (const file of filesUnder('src', ['.ts'])) {
    const text = code(file);
    for (const storage of ['localStorage', 'sessionStorage', 'indexedDB', 'document.cookie']) assert.ok(!text.includes(storage), `AC-US-0003-08: ${file} must not use ${storage}: the sound state is not kept across a reload`);
  }
  const main = code('src/main.ts');
  assert.match(main, /\$\('sound'\)\.textContent = output\.soundOn \? 'Som ligado' : 'Som desligado';/, 'AC-US-0003-08: the control shows the state the sound command answered');
  assert.match(main, /\$\('sound'\)\.setAttribute\('aria-pressed', String\(output\.soundOn\)\);/, 'AC-US-0003-08: and its pressed state follows it');
});

test('CHK-TEST-0004-08 the only call of the sound command in the application is the handler of the sound control, and it asks for the final state', () => {
  // AC-US-0003-09
  const main = code('src/main.ts');
  assert.equal(count(main, 'setSoundOn('), 1, 'AC-US-0003-09: src/main.ts calls setSoundOn( in exactly one place');
  assert.match(main, /\$\('sound'\)\.onclick = \(\) => \{\s*const output = audio\.setSoundOn\(!audio\.getSoundOutput\(\)\.soundOn\);/, 'AC-US-0003-09: inside the click handler of #sound, asking for the opposite of the state read');
  for (const file of filesUnder('src', ['.ts'])) {
    if (file === 'src/main.ts') continue;
    const calls = count(code(file), 'setSoundOn(');
    assert.equal(calls, file === 'src/audio.ts' ? 1 : 0, `AC-US-0003-09: ${file} ${file === 'src/audio.ts' ? 'only declares setSoundOn' : 'does not call setSoundOn'}`);
  }
  assert.ok(!/\.toggle\(\)/.test(main), 'AC-US-0003-09: no "toggle" command is left: the request carries the final state');
  assert.ok(!/autoplay|soundOn\s*=\s*true|[?&]sound=/i.test(main), 'AC-US-0003-09: no setting or address parameter forces the sound on');
});

test('CHK-TEST-0004-09 the application imports the two recordings inside the script and hands them to the audio output, and the only oscillator left in the audio output is the reward', () => {
  // AC-US-0003-10, AC-US-0004-06
  const main = code('src/main.ts');
  assert.match(main, /^import engineLoopDataUrl from '\.\/assets\/engine-loop\.mp3\?inline';$/m, 'AC-US-0003-10: src/main.ts imports ./assets/engine-loop.mp3?inline statically');
  assert.match(main, /^import tireScreechDataUrl from '\.\/assets\/tire-screech\.mp3\?inline';$/m, 'AC-US-0004-06: src/main.ts imports ./assets/tire-screech.mp3?inline statically');
  assert.match(main, /const audio = new RaceAudio\(\);\s*void audio\.loadRecordings\(\{ engineLoopDataUrl, tireScreechDataUrl \}\);/, 'AC-US-0003-10: both values are handed to loadRecordings when the module is evaluated');
  assert.equal(count(main, 'loadRecordings('), 1, 'AC-US-0003-10: the recordings are loaded once');
  assert.equal(count(main, '.mp3'), 2, 'AC-US-0003-10: no other sound file is imported');
  const audio = code('src/audio.ts');
  const reward = /\n  reward\(tier: number\) \{[\s\S]*?\n  \}\n/.exec(audio)?.[0] ?? '';
  assert.equal(count(reward, 'createOscillator('), 1, 'AC-US-0003-10: fixture: the reward builds its tones with an oscillator');
  assert.equal(count(audio, 'createOscillator('), 1, 'AC-US-0003-10: src/audio.ts calls createOscillator only inside reward(): no synthesized engine tone');
  assert.equal(count(main, 'createOscillator'), 0, 'AC-US-0003-10: src/main.ts creates no oscillator');
  assert.ok(!/audio\.(update|toggle)\(/.test(main), 'AC-US-0003-10: the calls of the synthesized engine (update, toggle) are gone from src/main.ts');
});

test('CHK-TEST-0004-10 the sound of the frame is read after the tyre-mark block, from whether the block laid a new segment, and the block is the same text as before the feature and reads nothing from the audio', () => {
  // AC-US-0004-01
  const main = code('src/main.ts');
  const before = main.indexOf('const skidIndexBeforeMarks = skidIndex;');
  const block = main.indexOf("if ('code' in pose || pose.simStepCount < lastSkidStepCount) {");
  const laid = main.indexOf('laidSegment = skidIndex !== skidIndexBeforeMarks;');
  const refresh = main.indexOf('refreshSound(now);');
  assert.ok(before >= 0, 'AC-US-0004-01: skidIndex is read into skidIndexBeforeMarks');
  assert.ok(block > before, 'AC-US-0004-01: before the tyre-mark block');
  assert.ok(laid > block, 'AC-US-0004-01: laidSegment compares skidIndex after the block with the value before it');
  assert.ok(refresh > laid, 'AC-US-0004-01: refreshSound(now) is called after the block and after laidSegment');
  assert.equal(count(main, 'refreshSound(now);'), 1, 'AC-US-0004-01: once per frame');
  assert.equal(count(main, 'skidIndexBeforeMarks'), 2, 'AC-US-0004-01: skidIndexBeforeMarks is written once and read once');
  // The block of modelo-kart-01, found and transpiled by that feature's helper: the text recorded on commit 5a0dfb3,
  // the last one before this feature.
  const blockText = tyreMarkBlockOf(read('src/main.ts'));
  assert.equal(sha256(blockText), '1988d82df5310da088d5b6d533168f8321cc7eb83d9a547e43ffb0e5784ad5bb', 'AC-US-0004-01: the tyre-mark block is the same text as before the feature');
  assert.ok(main.slice(block, laid).includes('skidIndex = (skidIndex + 1) % 320;'), 'AC-US-0004-01: fixture: the block advances skidIndex where it lays a segment');
  assert.equal(count(main.slice(block, laid), 'skidIndex = '), 1, 'AC-US-0004-01: and nowhere else between the two readings');
  for (const word of ['audio', 'laidSegment', 'refreshSound', 'soundOn', 'SoundOutput']) assert.ok(!blockText.includes(word), `AC-US-0004-01: the block does not read "${word}": the mark is drawn with or without sound`);
  // DES-0003: an accepted pause, resume or reposition refreshes the sound at once; the reposition records its instant first.
  const bodyOf = (name: string) => { const from = main.indexOf(`function ${name}(`); return from < 0 ? '' : main.slice(from, main.indexOf('\n}\n', from)); };
  for (const name of ['emitPause', 'emitResume', 'emitReposition']) {
    const text = bodyOf(name);
    assert.ok(text.indexOf('if (!r.ok) return;') >= 0 && text.indexOf('refreshSound(') > text.indexOf('if (!r.ok) return;'), `AC-US-0004-01: ${name} refreshes the sound once the command is accepted`);
  }
  const reposition = bodyOf('emitReposition');
  assert.ok(reposition.indexOf('repositionAcceptedAtMs = performance.now()') >= 0 && reposition.indexOf('repositionAcceptedAtMs = performance.now()') < reposition.indexOf('refreshSound('), 'AC-US-0004-01: the reposition records its instant before refreshing the sound');
});

test('CHK-TEST-0004-11 the tyre reading handed to the sound is the conjunction of a new mark segment and a rear wheel on the asphalt, read from the track contact', () => {
  // AC-US-0004-04
  const main = code('src/main.ts');
  assert.match(main, /tireMarkingAsphalt: laidSegment && rearOnAsphalt,/, 'AC-US-0004-04: tireMarkingAsphalt is laidSegment && rearOnAsphalt');
  assert.equal(count(main, 'tireMarkingAsphalt'), 1, 'AC-US-0004-04: and is given in one place only');
  assert.match(main, /const rearContact = lap \? getTrackContact\(lap\.kart, lap\.environment, lap\.config\) : undefined;/, 'AC-US-0004-04: the contact is read with getTrackContact from the lap');
  assert.match(main, /const rearOnAsphalt = rearContact !== undefined && !\('code' in rearContact\)\s*&& \(rearContact\.wheelSurfaces\[2\] === 'ASPHALT' \|\| rearContact\.wheelSurfaces\[3\] === 'ASPHALT'\);/,
    'AC-US-0004-04: rearOnAsphalt is one of the rear wheels (2 and 3 of wheelSurfaces) on ASPHALT');
  assert.match(main, /simStepCount: 'code' in telemetry \? undefined : telemetry\.simStepCount,\s*speedMps: 'code' in telemetry \? 0 : telemetry\.speedMps,/, 'AC-US-0004-04: the step and the speed come from getHandlingTelemetry');
  assert.match(main, /lap = stepLap\(lap, input\);\s*stepThrottleNorm = input\.throttle;/, 'AC-US-0003-03: the throttle handed to the sound is the one of the Input of the last advanced step');
  const refreshSound = /function refreshSound\(nowMs: number\) \{[\s\S]*?\n\}\n/.exec(main)?.[0] ?? '';
  assert.ok(refreshSound.includes('audio.refresh(reading);'), 'AC-US-0004-04: fixture: refreshSound hands the reading to the audio output');
  for (const write of ['lap =', 'stepLap(', 'skidIndex =', 'lap.kart.']) assert.ok(!refreshSound.includes(write) || write === 'lap.kart.' && !/lap\.kart\.\w+\s*=[^=]/.test(refreshSound), `AC-US-0004-04: refreshSound only reads: it has no "${write}" write`);
  assert.ok(!/sideslip|speedMps\s*>|> 6\b|0\.055/.test(refreshSound), 'AC-US-0004-04: the sound repeats no slide threshold: it follows the mark the scene drew');
});

test('CHK-TEST-0004-12 neither the audio output nor the application asks the network for anything: no network API in their text, no dynamic import, no sound address in the document', () => {
  // NFR-0003
  for (const file of ['src/audio.ts', 'src/soundOutput.ts', 'src/main.ts']) {
    const text = code(file);
    for (const symbol of ['fetch', 'XMLHttpRequest', 'WebSocket', 'EventSource', 'navigator.sendBeacon', 'Audio', 'Image']) assert.ok(!uses(text, symbol), `NFR-0003: ${file} must not use ${symbol}`);
    assert.ok(!/<audio\b|createElement\(\s*['"](audio|img|link)['"]/.test(text), `NFR-0003: ${file} creates no element that would ask for a sound or an image`);
    assert.ok(!/import\(/.test(text), `NFR-0003: ${file} has no dynamic import`);
  }
  const main = code('src/main.ts');
  const mp3Imports = importsOf(main).filter(i => i.includes('.mp3'));
  assert.deepEqual(mp3Imports, ['./assets/engine-loop.mp3?inline', './assets/tire-screech.mp3?inline'], 'NFR-0003: the two recordings enter by static ?inline import, inside the script');
  assert.ok(!/\.mp3|\.ogg|\.wav|\.m4a/i.test(html), 'NFR-0003: index.html references no sound file');
  assert.ok(!/https?:\/\//.test(stripComments(read('src/audio.ts'))), 'NFR-0003: src/audio.ts names no address');
  assert.match(read('src/rawImports.d.ts'), /declare module '\*\.mp3\?inline' \{\s*const dataUrl: string;\s*export default dataUrl;\s*\}/, 'NFR-0003: the inlined recording is typed as a text, not as an address to fetch');
});

test('CHK-TEST-0004-13 the document makes the two images part of what the browser asks for when it opens — the page icon and the cover preload — and preloads no sound', () => {
  // NFR-0003
  const asked = initialDownloadFiles(html);
  assert.ok(asked.includes('src/assets/icon.png'), 'NFR-0003: the icon is asked for when the page opens');
  assert.ok(asked.includes('src/assets/cover.jpg'), 'NFR-0003: the cover is asked for when the page opens');
  const preloads = links('preload');
  assert.equal(preloads.length, 1, `NFR-0003: exactly one preload (${preloads.length})`);
  assert.equal(preloads[0].attributes.as, 'image', 'NFR-0003: of an image');
  assert.equal(preloads[0].attributes.href, COVER, 'NFR-0003: the cover');
  assert.equal(elements(head, 'link').filter(e => e.attributes.as === 'audio' || /\.(mp3|ogg|wav)/i.test(e.attributes.href ?? '')).length, 0, 'NFR-0003: no link of the document points to a sound');
  assert.ok(asked.some(file => file.endsWith('src/main.ts')), 'NFR-0003: the script that carries the recordings is asked for by the document');
  assert.equal(asked.filter(file => /^(https?:)?\/\//.test(file)).length, 0, 'NFR-0003: nothing is asked of another origin');
});

test('CHK-TEST-0004-14 no module of the simulation or of the track data imports the audio, the sound decision or the delivered files, and the sound decision is pure', () => {
  // NFR-0004, NFR-0009
  const roots = ['src/physics.ts', 'src/lap.ts', 'src/lapTiming.ts', 'src/track.ts', 'src/trackData.ts', 'src/trackGeometry.ts', 'src/trainingSession.ts', 'src/maneuvers.ts'];
  const seen = new Set(roots), queue = [...roots];
  while (queue.length > 0) {
    const file = queue.shift()!;
    for (const dep of importsOf(code(file))) {
      assert.ok(!/(^|\/)(audio|soundOutput)$/.test(dep) && !dep.includes('/assets/'), `NFR-0009: ${file} must not import ${dep}`);
      if (!/^\.\/[\w-]+$/.test(dep)) continue;
      const next = `src/${dep.slice(2)}.ts`;
      if (!seen.has(next) && existsSync(join(root, next))) { seen.add(next); queue.push(next); }
    }
  }
  assert.ok(seen.size >= roots.length, 'NFR-0009: fixture: the simulation modules were read');
  for (const file of filesUnder('src', ['.ts'])) {
    if (file === 'src/main.ts' || file === 'src/audio.ts') continue;
    assert.ok(!importsOf(code(file)).some(dep => /(^|\/)audio$/.test(dep)), `NFR-0004: ${file} must not import ./audio: only the application drives the audio output`);
    assert.ok(!importsOf(code(file)).some(dep => dep.includes('/assets/')), `NFR-0009: ${file} must not import a delivered file`);
  }
  const decision = code('src/soundOutput.ts');
  assert.deepEqual(importsOf(decision), ['./lap'], 'NFR-0004: the sound decision imports only ./lap');
  assert.match(decision, /import type \{ LapPhase \} from '\.\/lap';/, 'NFR-0004: and only a type of it');
  for (const symbol of ['document', 'window', 'performance', 'Date', 'Math.random', 'AudioContext', 'setTimeout', 'requestAnimationFrame']) assert.ok(!uses(decision, symbol), `NFR-0004: src/soundOutput.ts must not use ${symbol}`);
  const audio = code('src/audio.ts');
  assert.deepEqual(importsOf(audio), ['./soundOutput'], 'NFR-0009: the audio output imports only the sound decision: it cannot reach the lap or the simulation');
  for (const symbol of ['Math.random', 'Date', 'performance', 'setTimeout', 'setInterval']) assert.ok(!uses(audio, symbol), `NFR-0004: src/audio.ts must not use ${symbol}`);
});

test('CHK-TEST-0004-15 the curb sound of pista-kart-park is untouched: its descriptor, its noise, its curb() and the curb decision are the text recorded before the feature', () => {
  // NFR-0007
  // Recorded on commit 5a0dfb3 (the last one before the feature), line endings normalised to LF.
  const RECORDED = {
    whiteNoise: '07056cf02c082deabd423e8502105dc5db4bfec4212e08c99b0a0e38dcb0b172',
    CURB_SOUND: 'b8b19f02a13842b762ae4b134e891d7ea277e3feb9bd173ee80a8004cd9e1788',
    CURB_ATTACK_S: '791c9a6257fd08df0a507e122056a4704bfe184c2ba4f39709da8d74ebfe331f',
    curb: 'ae31738e45226d3ed66af762ad5e084822fda06c7f77e05ad68ce7fc27ce61d8',
    curbFeedback: '20b678d8cc2694ed73101c4f8e5eabc362f7724f535ba909661dffb0f3b83696',
  };
  const audio = read('src/audio.ts');
  const piece = (pattern: RegExp, name: string): string => { const m = pattern.exec(audio); assert.ok(m, `NFR-0007: src/audio.ts still has ${name}`); return m[0]; };
  assert.equal(sha256(piece(/function whiteNoise\([\s\S]*?\n}\n/, 'whiteNoise')), RECORDED.whiteNoise, 'NFR-0007: whiteNoise is the text of before the feature');
  assert.equal(sha256(piece(/export const CURB_SOUND[^\n]*\n/, 'CURB_SOUND')), RECORDED.CURB_SOUND, 'NFR-0007: CURB_SOUND is the text of before the feature');
  assert.equal(sha256(piece(/const CURB_ATTACK_S[^\n]*\n/, 'CURB_ATTACK_S')), RECORDED.CURB_ATTACK_S, 'NFR-0007: the curb attack is the text of before the feature');
  assert.equal(sha256(piece(/\n  curb\(\) \{[\s\S]*?\n  }\n/, 'curb()')), RECORDED.curb, 'NFR-0007: RaceAudio.curb() is the text of before the feature');
  assert.equal(sha256(read('src/curbFeedback.ts')), RECORDED.curbFeedback, 'NFR-0007: src/curbFeedback.ts is the text of before the feature');
  const main = code('src/main.ts');
  assert.match(main, /soundOn: audio\.soundOn\(\)/, 'NFR-0007: the curb decision still reads audio.soundOn()');
  assert.equal(count(main, 'audio.curb('), 1, 'NFR-0007: the curb sound is still played from one place');
  assert.equal(filesUnder('src', ['.mp3', '.ogg', '.wav', '.m4a']).sort().join(), 'src/assets/engine-loop.mp3,src/assets/tire-screech.mp3', 'NFR-0007: the application tree holds the two recordings and no sound file for the curb');
});
