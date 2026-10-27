---
id: TEST-0011
title: Camadas e invariantes — simulação sem renderizador, DOM, relógio, sorteio, rede ou armazenamento; regra de tela fora da sessão; contrato de passo; pista sintética dos ensaios; dependências
feature: pista-kart-park
stage: test
status: validated
version: 1.0.0
sources: [NFR-0004, NFR-0005, NFR-0007, NFR-0008, NFR-0009, NFR-0010]
---

# TEST-0011 — Camadas e invariantes

| | |
|---|---|
| Arquivo | `tests/pista-kart-park-layering.test.ts` (estratégia: `layering`) |
| Nível | texto (módulos lidos com `node:fs`, comentários retirados, como `tests/race-lap-validation-layering.test.ts`) e integração (`testPilotLapWith` com `testPilot` na pista sintética) |
| Interface exercitada | textos de `src/trackGeometry.ts`, `src/trackData.ts`, `src/physics.ts`, `src/lap.ts`, `src/trainingSession.ts`, `src/track.ts`, `src/maneuvers.ts`, `src/lapTiming.ts`, `src/curbFeedback.ts`, `src/lapMessages.ts`, `src/trackScene.ts`, `src/audio.ts`, `src/main.ts`, `scripts/trackPrep.ts`, `scripts/trackChecks.ts`, `scripts/track-pipeline.ts`, `package.json`, dos testes e benches das outras features e das suítes desta; `testPilot`, `testPilotLapWith` (`scripts/handlingBench.ts`); `options`, `ARCADE_CONFIG` (`tests/helpers/handling.ts`) |
| Fixtures | listas `SIMULATION`, `APPLICATION_PURE`, `PREPARATION`, `FEATURE_MODULES`, `NETWORK_OR_STORAGE`, `DOM_CLOCK_RANDOM`; expressão de renderização montada por partes para que o próprio arquivo não a satisfaça |

## Verificações

| Check | Decide | Teste | O que a faria falhar |
|---|---|---|---|
| CHK-TEST-0011-01 | NFR-0007 | the simulation and track-data modules import nothing from three, the audio or the application, and use no DOM, clock or random | importação de `three`, `./audio`, `./main`, `./trackScene` ou `node:*` num módulo de simulação, aplicação pura ou preparo; `document`, `window`, `Date`, `performance`, `Math.random`, `requestAnimationFrame`, `setTimeout`, `setInterval` ou `navigator` neles; `trainingSession.ts` importando fora da simulação; `trackGeometry.ts` importando fora de `./track`; `curbFeedback.ts` importando valor de `./physics`; `lapMessages.ts` importando valor de `./lap` |
| CHK-TEST-0011-02 | NFR-0004 | no module of the feature, the application included, uses the network or the browser storage; the Kart Park comes bundled | `fetch`, `XMLHttpRequest`, `WebSocket`, `localStorage`, `sessionStorage`, `indexedDB`, `navigator.sendBeacon` ou `EventSource` em qualquer módulo da feature, arquivo da pista não importado como `?raw`, `import(` dinâmico em `main.ts`, `src/tracks/kart-park-v1.json` ausente |
| CHK-TEST-0011-03 | NFR-0005 | the session knows no credit text, no licence and no label separator: the screen rule lives in src/lapMessages.ts | `openstreetmap`, `OpenStreetMap`, `ODbL`, `' · '` ou `©` em `trainingSession.ts`; `OSM_CREDIT`, `creditFor` ou `optionLabel` fora de `lapMessages.ts`; crédito passando pela tabela de mensagens |
| CHK-TEST-0011-04 | NFR-0008 | the step contract is unchanged: STEP 1/120, the Input fields, the step signature, and no Input field for the curb | `STEP` ≠ `1 / 120`, tipo `Input` ou assinatura de `step` alterados, `SOLVER_SUBSTEPS` ≠ 4, campo de `Input` com `curb`/`surface`/`barrier`, `Surface` sem `curb`, `Environment` sem `track?` |
| CHK-TEST-0011-05 | NFR-0009 | the synthetic track stays the track of the other features: none of their tests or benches names the Kart Park, and the test-pilot lap still passes on it | `'kart-park'`, `kartPark`, `trainingSession`, `trackEnvironment`, `kart-park-v1` ou `tracks/kart-park` no código (sem comentários) de algum teste de `race-lap-validation`, `dirigibilidade`, `modelo-kart-01`, `physics`, `maneuvers`, dos benches ou dos helpers/fixtures existentes; `TEST_PILOT_LAP` fora da `SYNTHETIC_TRACK`, `FAIL` ou com passo fora do asfalto |
| CHK-TEST-0011-06 | NFR-0010 | the feature adds no runtime dependency: three stays the only one and the dev dependencies are unchanged | `dependencies` ≠ {`three`}, `devDependencies` ≠ {`@types/three`, `tsx`, `typescript`, `vite`}, módulo da feature importando pacote fora de `.`, `three`, `node:`; script `track` diferente |
| CHK-TEST-0011-07 | NFR-0007 | no check of this feature needs the renderer: the suites import three only to build geometry in Node, and the scene module creates no renderer | suíte desta feature fora de `scene` importando `three`, `new THREE.WebGLRenderer`, `requestAnimationFrame(` ou `document.getElementById/createElement/body` numa suíte ou em `trackScene.ts`, `document`/`window` em `trackScene.ts` |
