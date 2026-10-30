---
id: DES-0005
title: Tipos de volta, reposicionamento e resultado oficial — implementação
feature: race-lap-validation
stage: code
status: validated
version: 1.1.0
sources: [FEAT-0006, FEAT-0008, FEAT-0010, REQ-FEAT-0006-01, REQ-FEAT-0006-03, REQ-FEAT-0006-04, REQ-FEAT-0006-06, REQ-FEAT-0006-08, REQ-FEAT-0006-11, REQ-FEAT-0006-12, REQ-FEAT-0006-14, REQ-FEAT-0006-15, REQ-FEAT-0008-06, REQ-FEAT-0008-07, REQ-FEAT-0010-19, REQ-FEAT-0010-21, REQ-FEAT-0010-22, REQ-FEAT-0010-25]
---

# DES-0005 — Tipos de volta, reposicionamento e resultado oficial — implementação

`repositionKart`, `offeredLapKinds` (exportadas) e `buildResult` (interna) em `src/lap.ts`, camada simulação.

## Realização por requisito

| Requisito | Arquivo e símbolo |
|---|---|
| REQ-FEAT-0006-01, REQ-FEAT-0006-03 | `src/lap.ts` `repositionKart` (`OFFICIAL` em `RUNNING`: `invalidate(lap, 'REPOSITION')` sem mover o kart nem avançar `stepCount`) |
| REQ-FEAT-0006-04, REQ-FEAT-0006-06 | `src/lap.ts` `repositionKart` (`RECON`/`TRAINING`: kart recolocado no ponto mais próximo da linha central, rumo do segmento, velocidade 0; `validity`, `stepCount` e tempo inalterados; `offTrackSteps` 0; deslocamento avaliado por `evaluateDisplacement` com `toMs(stepCount)`) |
| REQ-FEAT-0006-08, REQ-FEAT-0006-11, REQ-FEAT-0008-07 | `src/lap.ts` `buildResult` (`official = lapKind OFFICIAL && validity VALID && trackStatus COMPLETE`) |
| REQ-FEAT-0006-12 | `src/lap.ts` `evaluateDisplacement` e `evaluateCut` (sem distinção por `lapKind`) |
| REQ-FEAT-0006-14 | `src/lap.ts` `repositionKart` (`LAP_ENDED` em `ENDED`; o `invalidReason` do primeiro fica) |
| REQ-FEAT-0006-15 | `src/lap.ts` `repositionKart` (`NOT_RUNNING` em `COUNTDOWN` e `PAUSED`) |
| REQ-FEAT-0008-06 | `src/lap.ts` `offeredLapKinds` (`INCOMPLETE` devolve só `TRAINING`; `COMPLETE` devolve `TRAINING` mais `challengeKinds`; demais, lista vazia); `startLap` rejeita `OFFICIAL` em `INCOMPLETE` com `OFFICIAL_NOT_AVAILABLE` |
| REQ-FEAT-0010-19 | `src/lap.ts` `repositionKart` (em `TRAINING`, como em `RECON`: recoloca o kart sem tocar `validity`, `invalidReason`, `lapSequenceCount` nem `lapStartMs`) |
| REQ-FEAT-0010-21, REQ-FEAT-0010-22 | `src/lap.ts` `complete` e `invalidate` (fase `ENDED` no passo do encerramento da volta oficial e de reconhecimento); `stepLap` devolve a mesma sessão em `ENDED` |
| REQ-FEAT-0010-25 | `src/lap.ts` `buildResult` (`official` falso fora de `OFFICIAL`, logo em todo resultado do treino) |

## Interface

`offeredLapKinds(reading, challengeKinds = [])` é chamada por `src/main.ts` (`renderOffer`) com lista vazia, pois o desafio
diário não existe ainda. `buildResult(session, finishMs?)` recebe o instante da chegada como segundo argumento ao
concluir uma volta válida (as fronteiras `b1..b3` ficam em `sectorBoundsMs` e `b4` só existe no resultado); por isso é
interna e não exportada.

## Rodada 2 (2026-10-30): treino de voltas seguidas (FEAT-0010)

`buildResult(session, finishMs?)` usa `b0 = lapStartMs`; monta `sectorMs` só com os 3 limites declarados e as três fronteiras registradas, e, só em `TRAINING`, `lapSequenceCount`, `lapStartMs`, `trainingLapMs` e `trainingSectorMs`.
