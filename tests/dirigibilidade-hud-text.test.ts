// TEST-0007 — the HUD text table, the result screen and the shared text, without a DOM: one time, no setup version, no
// drift, turbo, charge, combo or score anywhere (strategy: hud-text, unit and contract, DES-0005, DES-0006, SCR-0002 1.2,
// DOMAIN/DEC-15, DOMAIN/DEC-16).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { formatSharedText, shareLabel } from '../src/handlingMessages';
import { formatLapTime, message, MESSAGE_KEYS } from '../src/lapMessages';
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

// ----------------------------------------------------------------------- AC-US-0003-12 to -15: the screens outside the lap
// The checks read what the page serves — the visible text and the accessible names of index.html, the CSS-generated text and
// the language table the application writes into the page — never the names of variables. index.html is the single page of
// both channels (web-desktop and web-mobile); the media queries of src/style.css only show or hide its elements.

// What a screen must not mention or offer (AC-US-0003-12 to -15): the drift command (the key or a control), drift charge,
// turbo, mini-turbo, boost, combo or drift score.
// The tyre load ("Carga nos pneus") and the driving style picker ("Estilo de pilotagem") of the setup panel are not drift
// content, so only the drift charge and the style points are named.
const OFF_SCREEN = /drift|turbo|impulso|boost|carga d[eo] drift|charge|combo|pontos|points|score|estilo de drift|pontos de estilo|espa[cç]o|\bspace\b|entre de lado|saia voando/i;
// The element whose opening tag matches `open`, up to its own closing tag (nested tags of the same name balanced).
function element(page: string, open: RegExp): string {
  const start = page.search(open);
  if (start < 0) return '';
  const name = /^<([a-z0-9]+)/i.exec(page.slice(start))?.[1] ?? '';
  const tags = new RegExp(`<(/?)${name}\\b[^>]*>`, 'gi');
  tags.lastIndex = start;
  let depth = 0;
  for (let m = tags.exec(page); m; m = tags.exec(page)) {
    depth += m[1] ? -1 : 1;
    if (depth === 0) return page.slice(start, m.index + m[0].length);
  }
  return page.slice(start);
}
// The text a fragment serves: its text nodes and the accessible names and hints of its elements.
function servedText(fragment: string): string {
  const body = fragment.replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, ' ');
  const names = [...body.matchAll(/\b(aria-label|title|alt|placeholder|value)="([^"]*)"/gi)].map(m => m[2]);
  return [...names, body.replace(/<[^>]*>/g, ' ')].join(' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}
const stringLiterals = (text: string) => [...text.replace(/\/\/[^\n]*/g, '').matchAll(/'[^'\n]*'|"[^"\n]*"|`[^`]*`/g)].map(m => m[0].slice(1, -1));
const cssGeneratedText = [...css.matchAll(/content\s*:\s*(['"])(.*?)\1/g)].map(m => m[2]).join(' ');
const languageTable = (['pt', 'en'] as const).flatMap(lang => MESSAGE_KEYS.map(key => ({ lang, key, text: message(key, lang) })));

test('CHK-TEST-0007-07 the welcome screen, in both channels, mentions and offers no drift, turbo, boost, combo or score, and still carries the track choice and the lap offer', () => {
  // AC-US-0003-12
  const welcome = element(html, /<[a-z]+[^>]*\bid="welcome"/i);
  assert.ok(welcome.length > 0, 'AC-US-0003-12: the welcome screen (#welcome) must be found in index.html');
  for (const id of ['track-selector', 'track-credit', 'track-status', 'lap-offer']) assert.ok(welcome.includes(`id="${id}"`), `AC-US-0003-12: the welcome screen must still carry #${id}`);
  assert.doesNotMatch(servedText(welcome), OFF_SCREEN, `AC-US-0003-12: the welcome screen must not mention or offer the drift or the turbo ("${servedText(welcome)}")`);
  assert.doesNotMatch(servedText(html), OFF_SCREEN, 'AC-US-0003-12: no text or accessible name served by index.html mentions the drift, its key, its charge, the turbo, a combo or a score');
  assert.doesNotMatch(html, /drift|turbo|impulso|combo|espa[cç]o/i, 'AC-US-0003-12: index.html carries no drift, turbo, boost, combo or Space content in any text, attribute or name');
  assert.doesNotMatch(cssGeneratedText, OFF_SCREEN, 'AC-US-0003-12: src/style.css generates no drift or turbo text');
  for (const { lang, key, text } of languageTable) assert.doesNotMatch(text, /drift|turbo|impulso|mini-?turbo|boost|combo/i, `AC-US-0003-12 (${lang}): the message ${key} written into the screens must not mention the drift or the turbo ("${text}")`);
});

test('CHK-TEST-0007-08 the toolbar hint shows only the driving keys, with the hint "Dirigir", and nothing that mentions or offers the drift or the turbo', () => {
  // AC-US-0003-13
  const toolbar = element(html, /<[a-z]+[^>]*\bclass="[^"]*\btoolbar\b/i);
  assert.ok(toolbar.length > 0, 'AC-US-0003-13: the toolbar must be found in index.html');
  const hint = element(toolbar, /<[a-z]+[^>]*\bclass="[^"]*\bcontrol-hint\b/i);
  assert.equal(servedText(hint), 'Dirigir', 'AC-US-0003-13: the toolbar hint reads exactly "Dirigir"');
  const keys = [...toolbar.matchAll(/<([a-z]+)[^>]*\bclass="[^"]*\bkey\b[^"]*"[^>]*>([\s\S]*?)<\/\1>/gi)].map(m => servedText(m[2]));
  assert.ok(keys.length > 0, 'AC-US-0003-13: the toolbar hint shows its keys');
  for (const key of keys) assert.ok(['W', 'A', 'S', 'D', '←', '→', '↑', '↓'].includes(key), `AC-US-0003-13: the toolbar hint shows only driving keys, not "${key}"`);
  assert.doesNotMatch(servedText(toolbar), OFF_SCREEN, `AC-US-0003-13: the toolbar must not mention or offer the drift or the turbo ("${servedText(toolbar)}")`);
});

test('CHK-TEST-0007-09 there is no maneuver guide teaching the drift or the turbo, in the page, its style or the application', () => {
  // AC-US-0003-14
  const GUIDE = /maneuver-guide|maneuver guide|como fazer drift|how to drift|guia de manobras/i;
  assert.doesNotMatch(html, GUIDE, 'AC-US-0003-14: index.html must carry no maneuver guide');
  assert.ok(!css.includes('.maneuver-guide'), 'AC-US-0003-14: src/style.css must not style a maneuver guide');
  for (const text of stringLiterals(main)) assert.doesNotMatch(text, GUIDE, `AC-US-0003-14: src/main.ts must not write a maneuver guide ('${text}')`);
  for (const { lang, key, text } of languageTable) assert.doesNotMatch(text, /manobra|maneuver/i, `AC-US-0003-14 (${lang}): the message ${key} must not be a maneuver guide ("${text}")`);
});

test('CHK-TEST-0007-10 on mobile the touch controls are exactly left, right, brake and throttle: no "Drift" button nor any control for the drift or a turbo', () => {
  // AC-US-0003-15
  const groups = html.match(/\bclass="[^"]*\btouch-controls\b/g) ?? [];
  assert.equal(groups.length, 1, 'AC-US-0003-15: one set of touch controls serves the active sensor and the touch fallback (DES-0007)');
  const pad = element(html, /<[a-z]+[^>]*\bclass="[^"]*\btouch-controls\b/i);
  const controls = [...pad.matchAll(/\bdata-control="([^"]*)"/g)].map(m => m[1]);
  assert.deepEqual([...controls].sort(), ['brake', 'left', 'right', 'throttle'], `AC-US-0003-15: the touch controls are exactly left, right, brake and throttle (got ${controls.join(', ')})`);
  const everywhere = [...html.matchAll(/\bdata-control="([^"]*)"/g)].map(m => m[1]);
  assert.deepEqual(everywhere, controls, 'AC-US-0003-15: no touch control lives outside the touch-control pad');
  assert.doesNotMatch(servedText(pad), OFF_SCREEN, `AC-US-0003-15: no touch control is labelled for the drift or a turbo ("${servedText(pad)}")`);
  assert.ok(!/data-control\s*=\s*["']?(drift|turbo)/i.test(css), 'AC-US-0003-15: src/style.css must not style a drift or turbo touch control');
  for (const text of stringLiterals(main)) assert.ok(!/^(drift|turbo|boost)$/i.test(text) && !/data-control\s*=\s*["']?(drift|turbo)/i.test(text), `AC-US-0003-15: src/main.ts must not name a drift or turbo touch control ('${text}')`);
});
