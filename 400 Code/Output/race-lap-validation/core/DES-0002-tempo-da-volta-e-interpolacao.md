---
id: DES-0002
title: Tempo da volta em passos e interpolação do cruzamento — implementação
feature: race-lap-validation
stage: code
status: validated
version: 1.1.0
sources: [FEAT-0001, FEAT-0002, FEAT-0003, FEAT-0010, REQ-FEAT-0001-01, REQ-FEAT-0001-05, REQ-FEAT-0001-08, REQ-FEAT-0002-04, REQ-FEAT-0002-05, REQ-FEAT-0002-07, REQ-FEAT-0002-08, REQ-FEAT-0003-01, REQ-FEAT-0003-02, REQ-FEAT-0003-11, REQ-FEAT-0010-01, REQ-FEAT-0010-05, REQ-FEAT-0010-06]
---

# DES-0002 — Tempo da volta em passos e interpolação do cruzamento — implementação

Módulo novo `src/lapTiming.ts`, camada simulação, funções puras sobre inteiros; importa só `STEP` de `src/physics.ts`
(`COUNTDOWN_STEPS` é derivado dele e vale 360).

## Realização por requisito

| Requisito | Arquivo e símbolo |
|---|---|
| REQ-FEAT-0001-01 | `src/lapTiming.ts` `COUNTDOWN_MS` = 3000, `COUNTDOWN_STEPS` = 360; `toMs(360)` = 3000 |
| REQ-FEAT-0001-05, REQ-FEAT-0001-08 | `src/lapTiming.ts` `toMs` (`Math.floor((25 * steps + 1) / 3)`); `src/lap.ts` `getLapState` (`elapsedMs = toMs(stepCount)`, sem penalidade) |
| REQ-FEAT-0002-04 | `src/lapTiming.ts` `toMs`, `interpolateMs` (resultados inteiros em ms) |
| REQ-FEAT-0002-05 | `src/lap.ts` `buildResult` (`sectorMs` = diferenças das fronteiras `b0` = 0, `b1..b3`, `b4`; a soma telescópica é `lapMs`) |
| REQ-FEAT-0002-07, REQ-FEAT-0002-08 | `src/lapTiming.ts` `interpolateMs` (limitado a `[toMs(k) + 1, toMs(k + 1) - 1]`; fração 1 dá `toMs(k + 1)`); `src/lap.ts` `stepLap` (`instantMsAt = fraction => interpolateMs(k, fraction)`) |
| REQ-FEAT-0003-01, REQ-FEAT-0003-02, REQ-FEAT-0003-11 | `src/lapTiming.ts` inteiro (só soma, subtração, multiplicação, divisão, `Math.floor`, `Math.round`, `Math.min`/`Math.max`); nenhum relógio nem sorteio |
| REQ-FEAT-0010-01 | `src/lap.ts` `closeTrainingLap` (`lapStartMs = finishMs`, sem nova conversão); `buildResult` (`b0 = lapStartMs`) |
| REQ-FEAT-0010-05 | `src/lap.ts` `buildResult` (`trainingLapMs = b4 - b0`; `lapMs = b4 - b0` com `VALID`); `getLapState` (`elapsedMs = toMs(stepCount) - lapStartMs`) |
| REQ-FEAT-0010-06 | `src/lap.ts` `closeTrainingLap` e `buildResult`: o `b4` de uma volta é o `b0` da seguinte, de modo que a soma dos `trainingLapMs` é o `lapStartMs` da volta em andamento (INV-10), só com inteiros |

## Interface

`COUNTDOWN_STEPS`, `COUNTDOWN_MS`, `toMs(steps)`, `interpolateMs(k, fraction)`, `isCutExceeded(offSteps, durationMs)`
(`25 * offSteps > 3 * durationMs`). Argumentos inteiros passam por `Math.max(0, Math.trunc(...))` sem lançar.

## Rodada 2 (2026-10-30): treino de voltas seguidas (FEAT-0010)

`src/lapTiming.ts` não mudou. As fronteiras de cada volta partem de `lapStartMs` em `buildResult` e em `completedSectors` (`src/lap.ts`); o tempo de setor só existe com as duas fronteiras registradas.
