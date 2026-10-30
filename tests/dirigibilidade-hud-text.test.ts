// TEST-0007 — the HUD text table, the result screen and the shared text, without a DOM: one time, no setup version, no
// drift, turbo, charge, combo or score anywhere (strategy: hud-text, unit and contract, DES-0005, DES-0006, SCR-0002 1.2,
// DOMAIN/DEC-15, DOMAIN/DEC-16).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { formatSharedText, shareLabel } from '../src/handlingMessages';
import { formatLapTime, message } from '../src/lapMessages';
import type { LapRecord } from '../src/setupRecords';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const main = readFileSync(join(root, 'src', 'main.ts'), 'utf8');
const html = readFileSync(join(root, 'index.html'), 'utf8');
const css = readFileSync(join(root, 'src', 'style.css'), 'utf8');
const TIME = /\d+:\d{2}\.\d{3}/g;
const record = (patch: Partial<LapRecord> = {}): LapRecord => ({
  trackId: 'synthetic', trackVersion: 2, lapKind: 'TRAINING', lapValidity: 'VALID', official: false, lapMs: 83456, sectorMs: [20000, 21000, 21000, 21456],
  setupId: 'ARCADE_ASSISTIDO', setupVersion: 'fixture-setup-9.9.9', ...patch,
});

test('CHK-TEST-0007-01 the HUD has a speed element in km/h and a handling element with a non-empty text for each of the four states', () => {
  // AC-US-0004-06
  assert.match(html, /id="speed"/, 'AC-US-0004-06: index.html must carry the speed element');
  assert.match(html, /id="handling"/, 'AC-US-0004-06: index.html must carry the handling element');
  const table = main.match(/const labels = \{([^}]*)\}/);
  assert.ok(table, 'AC-US-0004-06: main.ts must carry the label table of the handling states');
  const labels = Object.fromEntries([...(table?.[1] ?? '').matchAll(/(\w+):\s*'([^']*)'/g)].map(m => [m[1], m[2]]));
  for (const state of ['grip', 'understeer', 'oversteer', 'sliding']) assert.ok(typeof labels[state] === 'string' && labels[state].trim().length > 0, `AC-US-0004-06: the label of ${state} must be a non-empty text`);
  assert.equal(new Set(Object.values(labels)).size, 4, 'AC-US-0004-06: the four states must have four distinct texts');
  assert.match(main, /\$\('speed'\)\.textContent = Math\.round\(telemetry\.speedMps \* 3\.6\)\.toString\(\)/, 'AC-US-0004-06: the speed element must show speedMps converted to km/h');
  assert.match(main, /\$\('handling'\)\.textContent = labels\[telemetry\.handling\]/, 'AC-US-0004-06: the handling element must show the label of the telemetry state');
  assert.match(main, /getHandlingTelemetry\(state, setupRef\)/, 'AC-US-0004-06: the HUD must read the state through API-0001');
});

// Records of two setup versions, comparable or not with each other: the shared text of any of them is one lap, one time.
const VERSIONS = ['arcade-assistido-v4', 'arcade-assistido-v5', 'arcade-assistido-v6', 'fixture-setup-9.9.9'];
const sharedTexts = (lang: 'pt' | 'en') => VERSIONS.flatMap(setupVersion => [
  { setupVersion, valid: true, text: formatSharedText(record({ setupVersion }), lang) },
  { setupVersion, valid: false, text: formatSharedText(record({ setupVersion, lapValidity: 'INVALID', invalidReason: 'CUT', lapMs: undefined, sectorMs: undefined }), lang) },
]);

test('CHK-TEST-0007-02 the shared text carries exactly the game, the track, its version and one time or the invalid state: never the setup version, a second time nor a difference', () => {
  // AC-US-0005-07
  for (const lang of ['pt', 'en'] as const) {
    for (const { setupVersion, valid, text } of sharedTexts(lang)) {
      const expected = `Kartle · synthetic v2 · ${valid ? formatLapTime(83456) : message('lapStateInvalid', lang)}`;
      assert.equal(text, expected, `AC-US-0005-07 (${lang}, ${setupVersion}, ${valid ? 'valid' : 'invalid'}): the shared text must be exactly the game, the track, its version and ${valid ? 'the lap time' : 'the invalid state'}`);
      assert.ok(!text.includes(setupVersion), `AC-US-0005-07 (${lang}): the shared text must not carry the setup version ${setupVersion}`);
      assert.equal((text.match(TIME) ?? []).length, valid ? 1 : 0, `AC-US-0005-07 (${lang}): the shared text must carry ${valid ? 'exactly one time' : 'no time'}`);
      assert.ok(!/[+-]\d+:\d{2}/.test(text) && !/Δ|diff/i.test(text), `AC-US-0005-07 (${lang}): the shared text must carry no difference`);
    }
    const a = formatSharedText(record({ setupVersion: 'arcade-assistido-v5', lapMs: 70000 }), lang), b = formatSharedText(record({ setupVersion: 'arcade-assistido-v6', lapMs: 70000 }), lang);
    assert.equal(a, b, `AC-US-0005-07 (${lang}): two laps of different setup versions are shared as two independent texts, neither naming the other`);
  }
});

test('CHK-TEST-0007-03 the result screen carries the share control with a label in each language and no setup-version element', () => {
  // AC-US-0005-05
  assert.ok(shareLabel('pt').length > 0 && shareLabel('en').length > 0, 'AC-US-0005-05: the share label must be a non-empty text in pt and en');
  assert.notEqual(shareLabel('pt'), shareLabel('en'), 'AC-US-0005-05: the share label must follow the language');
  assert.match(html, /id="lap-share"/, 'AC-US-0005-05: the result screen must carry the share control');
  assert.doesNotMatch(html, /lap-result-setup/, 'AC-US-0005-05: the result screen must not carry a setup-version element');
  assert.doesNotMatch(main, /lap-result-setup|setup\.setupVersion\s*\)?\s*;?\s*\$\('lap-result/, 'AC-US-0005-05: the application must not write the setup version on the result screen');
});

test('CHK-TEST-0007-04 the application shows a best time only when the records are COMPARABLE and clears it when the setup changes', () => {
  // AC-US-0005-05
  assert.match(main, /compareLapRecords\(bestRecord, \{ trackId: reading\.trackId, trackVersion: reading\.trackVersion, setupId: setup\.setupId, setupVersion: setup\.setupVersion \}\)/, 'AC-US-0005-05: the best time must be compared with the current track and setup');
  assert.match(main, /compared\.comparability === 'COMPARABLE' \? formatLapTime\(bestRecord\.lapMs\) : '—'/, 'AC-US-0005-05: a best time that is not COMPARABLE must be shown as —');
  assert.match(main, /setup = PUBLISHED_SETUPS\[SETUP_BY_PRESET\[preset\]\];[\s\S]{0,200}bestRecord = undefined; renderBest\(\);/, 'AC-US-0005-05: changing the setup must clear the best record');
  assert.match(main, /compared\.comparability === 'COMPARABLE' && lastRecord\.lapMs < bestRecord\.lapMs\) bestRecord = lastRecord/, 'AC-US-0005-05: a new lap replaces the best only when COMPARABLE and faster');
  assert.ok(!/lapMs\s*-\s*bestRecord\.lapMs|bestRecord\.lapMs\s*-\s*lastRecord\.lapMs/.test(main), 'AC-US-0005-05: the application never computes a difference between two times');
});

test('CHK-TEST-0007-05 the shared text of any result, valid or invalid, in either language, carries no drift, turbo, boost, charge, combo, style or score content', () => {
  // AC-US-0003-11
  const FORBIDDEN = /drift|turbo|impulso|boost|carga|charg|combo|estilo|style|pontos|points|score/i;
  for (const lang of ['pt', 'en'] as const) for (const { setupVersion, valid, text } of sharedTexts(lang)) {
    assert.doesNotMatch(text, FORBIDDEN, `AC-US-0003-11 (${lang}, ${setupVersion}, ${valid ? 'valid' : 'invalid'}): the shared text "${text}" must carry no drift, turbo, charge, combo or score content`);
    const words = text.split(' · ');
    assert.equal(words.length, 3, `AC-US-0003-11 (${lang}): the shared text has three parts and nothing else`);
  }
});

test('CHK-TEST-0007-06 the HUD and the result screen carry no drift meter, turbo label, style score, combo or boost element, and the application never draws one', () => {
  // AC-US-0003-09
  for (const id of ['style-score', 'combo', 'drift-hud', 'drift-meter', 'drift-label', 'drift-help', 'lap-result-setup']) {
    assert.ok(!new RegExp(`(id|class)="[^"]*\\b${id}\\b`).test(html), `AC-US-0003-09: index.html must not carry the element ${id}`);
    assert.ok(!main.includes(`'${id}'`) && !main.includes(`"${id}"`) && !main.includes(`#${id}`), `AC-US-0003-09: src/main.ts must not address the element ${id}`);
  }
  assert.ok(!/\bchargeTier\b/.test(main), 'AC-US-0003-09: src/main.ts must not read a drift charge tier');
  assert.ok(!/from\s+'\.\/maneuvers'/.test(main), 'AC-US-0003-09: src/main.ts must not import the maneuvers module');
  assert.ok(!/\.(score|combo|chain|charge|awards)\b/.test(main.replace(/\/\/[^\n]*/g, '')), 'AC-US-0003-09: src/main.ts must not read a drift score, combo, chain, charge or award');
  const literals = [...main.replace(/\/\/[^\n]*/g, '').matchAll(/'[^'\n]*'|"[^"\n]*"|`[^`]*`/g)].map(m => m[0]);
  for (const text of literals) assert.doesNotMatch(text, /turbo|carregando drift|drift (charge|score)|pontos de estilo|style points|combo|mini-?turbo/i, `AC-US-0003-09: src/main.ts must carry no turbo, drift-charge, combo or style-points text (${text})`);
  for (const selector of ['.drift-hud', '.drift-meter', '.style-score', '.boosting']) assert.ok(!css.includes(selector), `AC-US-0003-09: src/style.css must not style ${selector}`);
  const result = html.match(/<div id="lap-result"[\s\S]*?<\/div>/)?.[0] ?? '';
  assert.ok(result.length > 0, 'AC-US-0003-09: the result screen must be found in index.html');
  assert.doesNotMatch(result, /drift|turbo|combo|estilo|score/i, 'AC-US-0003-09: the result screen must carry no drift, turbo, combo or score content');
});
