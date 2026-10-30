---
id: DM-0002
title: Estado e resultado da volta em memória — implementação
feature: race-lap-validation
stage: code
status: validated
version: 1.1.0
sources: [FEAT-0001, FEAT-0002, FEAT-0003, FEAT-0010, REQ-FEAT-0001-05, REQ-FEAT-0002-04, REQ-FEAT-0002-11, REQ-FEAT-0003-08, REQ-FEAT-0010-01, REQ-FEAT-0010-05, REQ-FEAT-0010-06, REQ-FEAT-0010-12, REQ-FEAT-0010-20]
---

# DM-0002 — Estado e resultado da volta em memória — implementação

Tipos `LapSession`, `LapResult` e `LapStateView` em `src/lap.ts`. A sessão é imutável: cada comando ou passo devolve um
objeto novo; nada é gravado em `localStorage`, `sessionStorage` ou IndexedDB.

## Realização por requisito

| Requisito | Arquivo e símbolo |
|---|---|
| REQ-FEAT-0001-05 | `src/lap.ts` `LapSession.stepCount` (avança só em `RUNNING`, em `stepLap`); `getLapState` deriva `elapsedMs = toMs(stepCount) - lapStartMs` (`lapStartMs` 0 fora do treino) |
| REQ-FEAT-0002-04 | `src/lap.ts` `LapResult.lapMs`, `LapResult.sectorMs` (inteiros em ms, montados por `buildResult`) |
| REQ-FEAT-0002-11 | `src/lap.ts` `LapResult.trackId`, `LapResult.trackVersion` (copiados da leitura em `startLap`) |
| REQ-FEAT-0003-08 | `src/lap.ts` `stepLap` devolve a própria sessão em `PAUSED`; nenhum contador muda |
| REQ-FEAT-0010-01 | `src/lap.ts` `LapSession.lapStartMs` (0 ao iniciar; `finishMs` da volta anterior em `closeTrainingLap`) |
| REQ-FEAT-0010-05 | `src/lap.ts` `LapResult.trainingLapMs` (`b4 - b0`, também com `INVALID`) |
| REQ-FEAT-0010-06 | `src/lap.ts` `LapResult.lapStartMs` e `trainingLapMs` encadeados (INV-10) |
| REQ-FEAT-0010-12 | `src/lap.ts` `LapStateView.bestValidLapMs` (`bestValidLap`: menor `trainingLapMs` dos resultados `VALID`, só no treino fora de `ENDED`) |
| REQ-FEAT-0010-20 | `src/lap.ts` `LapSession.results` (lista em ordem de encerramento; `lapSequenceCount` de cada item de 1 em diante) |

## Campos

`LapSession` carrega os campos da tabela de DM-0002 (`lapKind`, `trackId`, `trackVersion`, `challengeNumber?`,
`trackStatus`, `lines`, `config` congelado, `phase`, `resumePhase?`, `pauseCause?`, `validity`, `invalidReason?`,
`countdownSteps`, `stepCount`, `lapSequenceCount`, `lapStartMs`, `markersPassedCount`, `sectorBoundsMs`, `offTrackSteps`, `kart`, `results`) e mais um campo
`environment` (`Environment` da física), que guarda o parâmetro `environment` de `startLap` para que `stepLap(lap, input)`
chame `step` com ele, como DES-0001 exige; é o `CIRCUIT` por padrão e não muda na sessão (INV-4). Os campos opcionais são
omitidos quando ausentes (INV-2), de modo que `getLapResult` devolve exatamente as chaves de API-0001.

Derivados em `getLapState`: `countdownRemainingMs = 3000 - toMs(countdownSteps)`; `elapsedMs` e `completedSectorMs` como na
seção da rodada 2.

## Rodada 2 (2026-10-30): treino de voltas seguidas (FEAT-0010)

Campos novos: `LapSession.lapSequenceCount`, `LapSession.lapStartMs`, `LapSession.results` (no lugar de `result`), `sectorBoundsMs` com posições `null`; `LapResult.lapSequenceCount`, `lapStartMs`, `trainingLapMs`, `trainingSectorMs` (só em `TRAINING`); `LapStateView.lapSequenceCount`, `lapStartMs`, `bestValidLapMs?`. Derivados em `getLapState`: `elapsedMs = toMs(stepCount) - lapStartMs` (o `lapMs` do resultado só no `ENDED` de uma volta oficial ou de reconhecimento válida) e `completedSectorMs` desde `b0 = lapStartMs` até o primeiro setor sem as duas fronteiras. Nenhum leitor fora de `src/lap.ts` lia o campo `result`.
