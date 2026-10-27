// TEST-0007 — the HUD text table and the shared text of the result screen, without a DOM
// (strategy: hud-text, unit, DES-0005, DES-0006, SCR-0002).
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

test('CHK-TEST-0007-02 the shared text carries the lap time and the setup version, never a second time nor a difference', () => {
  // AC-US-0005-05
  for (const lang of ['pt', 'en'] as const) {
    const text = formatSharedText(record(), lang);
    assert.ok(text.includes(formatLapTime(83456)), `AC-US-0005-05 (${lang}): the shared text must carry the lap time`);
    assert.ok(text.includes('fixture-setup-9.9.9'), `AC-US-0005-05 (${lang}): the shared text must carry the setup version`);
    assert.equal((text.match(TIME) ?? []).length, 1, `AC-US-0005-05 (${lang}): the shared text must carry exactly one time`);
    assert.ok(!/[+-]\d+:\d{2}/.test(text) && !/Δ|diff/i.test(text), `AC-US-0005-05 (${lang}): the shared text must carry no difference`);
    assert.ok(text.includes('synthetic') && text.includes('v2'), `AC-US-0005-05 (${lang}): the shared text must name the track and its version`);
    const invalid = formatSharedText(record({ lapValidity: 'INVALID', invalidReason: 'CUT', lapMs: undefined, sectorMs: undefined }), lang);
    assert.ok(invalid.includes(message('lapStateInvalid', lang)), `AC-US-0005-05 (${lang}): an invalid lap shares its state instead of a time`);
    assert.equal((invalid.match(TIME) ?? []).length, 0, `AC-US-0005-05 (${lang}): an invalid lap shares no time`);
    assert.ok(invalid.includes('fixture-setup-9.9.9'), `AC-US-0005-05 (${lang}): an invalid lap still carries the setup version`);
  }
});

test('CHK-TEST-0007-03 the share control has a label in each language', () => {
  // AC-US-0005-05
  assert.ok(shareLabel('pt').length > 0 && shareLabel('en').length > 0, 'AC-US-0005-05: the share label must be a non-empty text in pt and en');
  assert.notEqual(shareLabel('pt'), shareLabel('en'), 'AC-US-0005-05: the share label must follow the language');
  assert.match(html, /id="lap-share"/, 'AC-US-0005-05: the result screen must carry the share control');
  assert.match(html, /id="lap-result-setup"/, 'AC-US-0005-05: the result screen must carry the setup version element');
});

test('CHK-TEST-0007-04 the application shows a best time only when the records are COMPARABLE and clears it when the setup changes', () => {
  // AC-US-0005-05
  assert.match(main, /compareLapRecords\(bestRecord, \{ trackId: reading\.trackId, trackVersion: reading\.trackVersion, setupId: setup\.setupId, setupVersion: setup\.setupVersion \}\)/, 'AC-US-0005-05: the best time must be compared with the current track and setup');
  assert.match(main, /compared\.comparability === 'COMPARABLE' \? formatLapTime\(bestRecord\.lapMs\) : '—'/, 'AC-US-0005-05: a best time that is not COMPARABLE must be shown as —');
  assert.match(main, /setup = PUBLISHED_SETUPS\[SETUP_BY_PRESET\[preset\]\];[\s\S]{0,200}bestRecord = undefined; renderBest\(\);/, 'AC-US-0005-05: changing the setup must clear the best record');
  assert.match(main, /compared\.comparability === 'COMPARABLE' && lastRecord\.lapMs < bestRecord\.lapMs\) bestRecord = lastRecord/, 'AC-US-0005-05: a new lap replaces the best only when COMPARABLE and faster');
  assert.ok(!/lapMs\s*-\s*bestRecord\.lapMs|bestRecord\.lapMs\s*-\s*lastRecord\.lapMs/.test(main), 'AC-US-0005-05: the application never computes a difference between two times');
});
