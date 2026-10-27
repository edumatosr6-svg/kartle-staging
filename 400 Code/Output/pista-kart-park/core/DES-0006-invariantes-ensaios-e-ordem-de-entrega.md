---
id: DES-0006
title: Invariantes da simulação, contrato de passo, pista dos ensaios, dependências e ordem de entrega — implementação
feature: pista-kart-park
stage: code
status: draft
version: 1.0.0
sources: [FEAT-0007, FLOW-0002, REQ-FEAT-0007-03, REQ-FEAT-0007-04, REQ-FEAT-0007-06, REQ-FEAT-0007-07, REQ-FEAT-0007-08, REQ-FEAT-0007-09, REQ-FEAT-0007-10, REQ-FEAT-0007-11, REQ-FEAT-0007-12]
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
