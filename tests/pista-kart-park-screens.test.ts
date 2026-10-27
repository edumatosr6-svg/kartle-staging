// TEST-0009 — the credit, the name and the length of the Kart Park on the two screens, and the selector: the pure rules of
// src/lapMessages.ts and the DOM strings src/main.ts and index.html emit (strategy: screens, unit and text levels, DES-0007,
// DES-0012, SCR-0001, SCR-0002).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { creditFor, MESSAGE_KEYS, message, optionLabel, OSM_CREDIT } from '../src/lapMessages';
import { TRAINING_TRACKS } from '../src/trainingSession';
import { kartParkText } from './fixtures/kartParkFiles';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const stripComments = (text: string) => text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
const main = stripComments(readFileSync(join(root, 'src', 'main.ts'), 'utf8'));
const html = readFileSync(join(root, 'index.html'), 'utf8');
const kartPark = TRAINING_TRACKS.find(o => o.trackId === 'kart-park')!;
const synthetic = TRAINING_TRACKS.find(o => o.trackId === 'synthetic')!;

test('CHK-TEST-0009-01 with the Kart Park selected the selector shows "© colaboradores do OpenStreetMap"', () => {
  // AC-US-0006-01
  const credit = creditFor(kartPark);
  assert.ok(credit, 'AC-US-0006-01: the Kart Park entry has a credit');
  assert.equal(credit!.text, '© colaboradores do OpenStreetMap', 'AC-US-0006-01: the credit text');
  assert.equal(credit, OSM_CREDIT, 'AC-US-0006-01: the one credit of the feature');
  assert.ok(Object.isFrozen(OSM_CREDIT), 'AC-US-0006-01: the credit is fixed');
  assert.match(main, /renderCredit\(\$\('track-credit'\), creditFor\(selectedOption\(view\.selectedTrackId\)\)\);/, 'AC-US-0006-01: the selector screen renders the credit of the selected entry');
  assert.match(main, /container\.append\(document\.createTextNode\(`\$\{credit\.text\} · \$\{credit\.license\} · `\), link\);/, 'AC-US-0006-01: the text and the licence are written as text nodes');
  assert.ok(html.includes('id="track-credit"'), 'AC-US-0006-01: index.html has the selector credit element');
});

test('CHK-TEST-0009-02 the credit carries the ODbL licence mention', () => {
  // AC-US-0006-02
  assert.ok(OSM_CREDIT.license.includes('ODbL'), `AC-US-0006-02: the licence mention names ODbL (${OSM_CREDIT.license})`);
  assert.equal(OSM_CREDIT.license, 'licença ODbL', 'AC-US-0006-02: the mention text');
});

test('CHK-TEST-0009-03 the credit link goes to openstreetmap.org/copyright and is the href of the anchor', () => {
  // AC-US-0006-03
  assert.equal(OSM_CREDIT.url, 'https://openstreetmap.org/copyright', 'AC-US-0006-03: the destination');
  assert.ok(new URL(OSM_CREDIT.url).host === 'openstreetmap.org' && new URL(OSM_CREDIT.url).pathname === '/copyright', 'AC-US-0006-03: host and path');
  assert.match(main, /link\.setAttribute\('href', credit\.url\);/, 'AC-US-0006-03: the anchor href is the credit url');
  assert.match(main, /link\.textContent = 'openstreetmap\.org\/copyright';/, 'AC-US-0006-03: the visible link text names the destination');
  assert.match(main, /link\.setAttribute\('rel', 'noopener noreferrer'\);/, 'AC-US-0006-03: the link opens safely');
});

test('CHK-TEST-0009-04 the result screen of a Kart Park lap shows the same credit, text, licence and link, chosen by the trackId of the result; the synthetic track shows none', () => {
  // AC-US-0006-04, AC-US-0006-05, AC-US-0006-06
  assert.match(main, /renderCredit\(\$\('lap-result-credit'\), creditFor\(selectedOption\(result\.trackId\)\)\);/, 'AC-US-0006-04: the result screen renders the credit of the result track');
  assert.ok(html.includes('id="lap-result-credit"'), 'AC-US-0006-04: index.html has the result credit element');
  assert.equal(main.split('function renderCredit(').length - 1, 1, 'AC-US-0006-05: one renderer for both screens (same text, licence and link)');
  assert.match(main, /if \(!credit\) \{ container\.classList\.add\('hidden'\); return; \}/, 'AC-US-0006-04: without a credit the element is hidden');
  assert.equal(creditFor(synthetic), undefined, 'AC-US-0006-04: the synthetic track has no credit');
  assert.equal(creditFor(undefined), undefined, 'AC-US-0006-04: an unknown entry has no credit');
  assert.match(html, /<div id="lap-result"[\s\S]*id="lap-result-credit"[\s\S]*<\/div>/, 'AC-US-0006-06: the credit sits inside the result panel');
});

test('CHK-TEST-0009-05 every screen names the Kart Park as "Kart Park — São José dos Pinhais (traçado aproximado)" through optionLabel, outside the message table', () => {
  // AC-US-0006-07
  assert.equal(optionLabel(kartPark), 'Kart Park — São José dos Pinhais (traçado aproximado) · 687 m', 'AC-US-0006-07: the label');
  assert.ok(optionLabel(kartPark).startsWith('Kart Park — São José dos Pinhais (traçado aproximado)'), 'AC-US-0006-07: the name');
  assert.match(main, /\$\('track-name'\)\.textContent = option \? optionLabel\(option\) : '';/, 'AC-US-0006-07: the track name element shows the label');
  assert.match(main, /button\.textContent = optionLabel\(option\);/, 'AC-US-0006-07: each selector button shows the label');
  assert.ok(!html.includes('Circuito Aurora'), 'AC-US-0006-07: the old fixed track name is gone from index.html');
  assert.ok(!MESSAGE_KEYS.some(k => message(k, 'pt').includes('Kart Park') || message(k, 'en').includes('Kart Park')), 'AC-US-0006-07: the name is not translated by the message table');
  assert.equal(optionLabel({ displayName: 'Pista sintética' }), 'Pista sintética', 'AC-US-0006-07: the synthetic label is the name alone');
});

test('CHK-TEST-0009-06 the label of the Kart Park ends with the 687 m length next to the name', () => {
  // AC-US-0006-08
  assert.ok(optionLabel(kartPark).endsWith(' · 687 m'), `AC-US-0006-08: the label ends with 687 m (${optionLabel(kartPark)})`);
  assert.equal(optionLabel({ displayName: 'X', displayLengthM: 1234 }), 'X · 1234 m', 'AC-US-0006-08: the length comes from the entry');
  assert.ok(!optionLabel(synthetic).includes(' · '), 'AC-US-0006-08: no length for an entry without one');
});

test('CHK-TEST-0009-07 no screen text, module or data of the game carries the 41.45 s record of the real track', () => {
  // AC-US-0006-09
  const files = ['index.html', 'src/main.ts', 'src/lapMessages.ts', 'src/trainingSession.ts', 'src/trackScene.ts', 'src/curbFeedback.ts', 'src/audio.ts'];
  for (const f of files) {
    const text = readFileSync(join(root, f), 'utf8');
    // "recorde" alone is the game's own copy ("o próximo recorde é seu"); the real-track record is the 41.45 s figure and its source.
    for (const needle of ['41,45', '41.45', '41450', '00:41', 'KARTPLAN', 'recorde:', 'recordeMs']) assert.ok(!text.includes(needle), `AC-US-0006-09: ${f} must not carry "${needle}"`);
  }
  for (const needle of ['41,45', '41.45', '41450', 'recorde', 'KARTPLAN']) assert.ok(!kartParkText().includes(needle), `AC-US-0006-09: the bundled track file must not carry "${needle}"`);
  assert.ok(!JSON.stringify(TRAINING_TRACKS).includes('41'), 'AC-US-0006-09: the catalogue has no 41');
});

test('CHK-TEST-0009-08 the opening screen builds one selector button per catalogue entry, marks the selected one, opens on the Kart Park and offers the training lap only', () => {
  // AC-US-0001-01, AC-US-0001-02
  assert.ok(html.includes('id="track-selector"'), 'AC-US-0001-01: index.html has the selector');
  assert.match(main, /selector\.replaceChildren\(\.\.\.view\.options\.map\(option => \{/, 'AC-US-0001-01: one button per option of getTrainingTrackOptions');
  assert.match(main, /button\.setAttribute\('aria-pressed', String\(option\.trackId === view\.selectedTrackId\)\);/, 'AC-US-0001-02: the selected option is marked');
  assert.match(main, /button\.onclick = \(\) => chooseTrack\(option\.trackId\);/, 'AC-US-0001-01: a click selects the track');
  assert.match(main, /^chooseTrack\(OPENING_TRACK_ID\);$/m, 'AC-US-0001-02: the page opens by choosing OPENING_TRACK_ID at the top level');
  assert.equal(main.split('chooseTrack(OPENING_TRACK_ID)').length - 1, 1, 'AC-US-0001-02: the opening choice is made once');
  assert.match(main, /for \(const kind of offeredLapKinds\(reading, \[\]\)\)/, 'AC-US-0001-05: the offer takes no challenge kinds: training only');
  assert.match(main, /const r = startTrainingLap\(training, lap, config, \{ setupId: setup\.setupId, setupVersion: setup\.setupVersion \}\);/, 'AC-US-0001-03: the lap starts through the training session');
  assert.match(main, /const TRACK_SOURCES: TrainingTrackSources = \{ 'kart-park': kartParkV1Text, synthetic: SYNTHETIC_TRACK_FILE \};/, 'AC-US-0001-01: both sources come bundled');
  assert.match(main, /import kartParkV1Text from '\.\/tracks\/kart-park-v1\.json\?raw';/, 'NFR-0004: the Kart Park file is bundled as text, not fetched');
});

test('CHK-TEST-0009-09 an invalid lap shows its reason in the result title, and the missed-marker reason reads "marcador pulado"', () => {
  // AC-US-0003-06
  assert.equal(message('reasonMissedMarker', 'pt'), 'marcador pulado', 'AC-US-0003-06: the Portuguese reason');
  assert.equal(message('reasonMissedMarker', 'en'), 'missed marker', 'AC-US-0003-06: the English reason');
  assert.match(main, /MISSED_MARKER: 'reasonMissedMarker', CUT: 'reasonCut', REPOSITION: 'reasonReposition'/, 'AC-US-0003-06: the reason keys are mapped');
  assert.match(main, /\$\('lap-result-title'\)\.textContent = reason \? `\$\{message\('lapStateInvalid', lang\)\} · \$\{reason\}` : message\('lapStateInvalid', lang\);/, 'AC-US-0003-06: the title shows the reason');
});

test('CHK-TEST-0009-10 a FAILED session shows the data error and offers no lap', () => {
  // AC-US-0001-03
  assert.match(main, /if \(view\.sessionState === 'FAILED' \|\| reading\.trackDataStatus === 'UNREADABLE' \|\| reading\.trackDataStatus === 'UNSUPPORTED_SCHEMA'\) \{\s*status\.textContent = message\('trackDataError', lang\);\s*return;\s*\}/, 'REQ-FEAT-0001-14: FAILED shows the error and returns before the offer');
  assert.match(main, /offer\.replaceChildren\(\);/, 'REQ-FEAT-0001-14: the offer is emptied first');
});
