---
id: DES-0006
title: Invariantes da simulação, contrato de passo, pista dos ensaios, dependências e ordem de entrega — implementação
feature: pista-kart-park
stage: code
status: validated
version: 1.2.0
sources: [FEAT-0007, FEAT-0008, FLOW-0002, REQ-FEAT-0007-03, REQ-FEAT-0007-04, REQ-FEAT-0007-06, REQ-FEAT-0007-07, REQ-FEAT-0007-08, REQ-FEAT-0007-09, REQ-FEAT-0007-10, REQ-FEAT-0007-11, REQ-FEAT-0007-12, REQ-FEAT-0008-08, REQ-FEAT-0008-25, REQ-FEAT-0008-26, REQ-FEAT-0008-27]
---

# DES-0006 — Invariantes, contrato de passo, pista dos ensaios, dependências e ordem de entrega — implementação

Restrição atravessando `src/trackGeometry.ts`, `src/trackData.ts`, `src/physics.ts`, `src/lap.ts`, `src/trainingSession.ts`,
`src/curbFeedback.ts` e `src/lapMessages.ts`; conferida nesta rodada por leitura dos arquivos e pelos portões; os registros em
`npm test` (`tests/pista-kart-park-layering.test.ts`, `-determinism.test.ts`) são do estágio de testes.

## Realização por requisito

| Requisito | Arquivo e símbolo |
|---|---|
| REQ-FEAT-0007-03, -04 | passo fixo `STEP` (`src/physics.ts:6`), tempo inteiro (`src/lapTiming.ts` inalterado), barreiras processadas na ordem do arquivo (`src/physics.ts:341`), geometria em ordem fixa (`src/trackGeometry.ts:138-216`); nenhum `Date`, `performance`, `Math.random` nos módulos de simulação e de dado de pista |
| REQ-FEAT-0007-06 | regras na simulação: `classifySurface`, `beyondTrackEdgeM` (`src/trackGeometry.ts:219-234`), `surfaceMu`, bloco da barreira, `trackEdgeDistanceM` (`src/physics.ts:152`, `:339`, `:185`), corte e linhas (`src/lap.ts:240-270`); `src/main.ts` só lê `getTrackContact` (`:508`), `getLapState`, `getLapResult`, `getTrainingTrackOptions` (`:213`, `:255`) |
| REQ-FEAT-0007-07 | as bibliotecas puras `scripts/trackPrep.ts` e `scripts/trackChecks.ts` (sem `node:*`) e os módulos `src/trainingSession.ts`, `src/curbFeedback.ts`, `src/trackScene.ts` carregam em Node sem DOM; o programa `scripts/track-pipeline.ts` é o único com `node:fs`/`node:path`/`node:crypto` e relógio |
| REQ-FEAT-0007-08, -09 | `export const STEP = 1 / 120;` (`src/physics.ts:6`), `Input` (`:9`), assinatura de `step` (`:384`) e a linha 3 literalmente como `tests/race-lap-validation-frozen.test.ts` afirma (verde); nenhum campo de `Input` novo; o efeito da zebra vem de `environment.surfaceAt` |
| REQ-FEAT-0007-10 | nenhum teste ou bench de `race-lap-validation`, `dirigibilidade` ou `modelo-kart-01` importa `src/tracks/kart-park-v1.json`, `src/trainingSession.ts` ou `trackEnvironment`; `bench:handling` 46/46 e `bench:physics` 10/10 `PASS` na pista sintética e no `TEST_PAD` |
| REQ-FEAT-0007-11 | `package.json`: `dependencies` só `three` `^0.186.1`; `devDependencies` inalteradas; script `track` novo |
| REQ-FEAT-0007-12 | árvore base `6ea3862` (`modelo-kart-01` validado), descendente de `b86b200` (`dirigibilidade` validado, `code-validation-20261027-1824`); o primeiro commit de código desta feature descende de `6ea3862` |
| FEAT-0007; FLOW-0002 | camadas: `src/trackGeometry.ts` importa só `./track`; `src/trackData.ts` `./track` e `./trackGeometry`; `src/physics.ts` `./track`, `./maneuvers`, `./trackGeometry`; `src/lap.ts` `./physics`, `./track`, `./trackData`, `./trackGeometry`, `./lapTiming`; `src/trainingSession.ts` `./physics`, `./lap`, `./trackData`, `./trackGeometry`; `src/curbFeedback.ts` só tipos de `./physics`; `src/lapMessages.ts` só tipos de `./lap`; `src/trackScene.ts` `three` e `./trackGeometry`; `src/trainingSession.ts` sem `openstreetmap`, `ODbL`, `' · '` |

Rodada 4 (DES-0006 1.1.0): `src/main.ts` lê `listLapResults` (`:567-568`, um registro por item novo, de `race-lap-validation`)
ao lado de `getTrackContact`, `getLapState` e `getLapResult`, sem decidir regra; a retirada de `src/maneuvers.ts` da lista de
simulação do teste de camada desta feature é do estágio de testes (`CHK-TEST-0011-01`); nenhum arquivo de código mudou por este item.

Rodada 5 (2026-11-03, DES-0006 1.2.0, seed `revision: 2`): a rodada altera só `src/trackScene.ts` e `src/main.ts` (aplicação,
DES-0008); nenhum módulo de simulação, `src/trackData.ts`, `src/trackGeometry.ts`, `src/curbFeedback.ts`, `src/audio.ts`,
`src/tracks/kart-park-v1.json` nem `tracks/registry.json` foi tocado (`git status` da rodada).

| Requisito | Arquivo e símbolo |
|---|---|
| REQ-FEAT-0008-08, -25, -26, -27 | simulação inalterada pelo acabamento: `BARRIER_HALF_WIDTH_M` (`src/trackGeometry.ts:17`), `CURB_GRIP_PC` (`src/physics.ts:13`) e `STEP` (`:6`) sem mudança; `src/trackScene.ts` é importado só por `src/main.ts:15`; as constantes `EDGE_LINE_WIDTH_M`, `CURB_RELIEF_M`, `TYRE_*` e `GRASS_*` existem só em `src/trackScene.ts:10-19`. O traço `tests/fixtures/kartParkRev1Trace.json` é do estágio de testes, gravado com a simulação do commit anterior ao código da revisão 2, `f926815` (esta rodada não faz commit e não toca a simulação) |
