---
id: DES-0003
title: Cruzamentos, marcadores, setores e chegada — implementação
feature: race-lap-validation
stage: code
status: validated
version: 1.1.0
sources: [FEAT-0002, FEAT-0004, FEAT-0006, FEAT-0009, FEAT-0010, REQ-FEAT-0002-01, REQ-FEAT-0002-10, REQ-FEAT-0002-12, REQ-FEAT-0002-13, REQ-FEAT-0002-14, REQ-FEAT-0004-01, REQ-FEAT-0004-02, REQ-FEAT-0004-03, REQ-FEAT-0004-04, REQ-FEAT-0004-05, REQ-FEAT-0004-06, REQ-FEAT-0004-07, REQ-FEAT-0004-09, REQ-FEAT-0004-10, REQ-FEAT-0004-11, REQ-FEAT-0004-12, REQ-FEAT-0004-13, REQ-FEAT-0006-13, REQ-FEAT-0009-01, REQ-FEAT-0010-02, REQ-FEAT-0010-03, REQ-FEAT-0010-09, REQ-FEAT-0010-10, REQ-FEAT-0010-11, REQ-FEAT-0010-23, REQ-FEAT-0010-24, REQ-FEAT-0010-26, REQ-FEAT-0010-27, REQ-FEAT-0010-28, REQ-FEAT-0010-29]
---

# DES-0003 — Cruzamentos, marcadores, setores e chegada — implementação

Primitivas geométricas em `src/track.ts` (camada dado de pista): `Line`, `sideOf(line, point)` e `crossLine(line, from,
to)`. Avaliação por passo em `src/lap.ts` (função interna `evaluateDisplacement`), camada simulação.

## Realização por requisito

| Requisito | Arquivo e símbolo |
|---|---|
| REQ-FEAT-0002-01, REQ-FEAT-0002-13 | `src/lap.ts` `evaluateDisplacement` (chegada `FORWARD` com `markersPassedCount` igual ao total) e `complete` |
| REQ-FEAT-0002-10, REQ-FEAT-0002-14 | `src/lap.ts` `evaluateDisplacement` (só o limite de índice `sectorBoundsMs.length + 1`, só `FORWARD`, instante por `instantMsAt`) |
| REQ-FEAT-0002-12, REQ-FEAT-0004-13 | `src/lap.ts` `stepLap` (`ENDED` devolve a sessão; nenhum segundo resultado) |
| REQ-FEAT-0004-01, -02, -05, -06 | `src/lap.ts` `evaluateDisplacement` (chegada `FORWARD` com marcadores faltando) e `invalidate(s, 'MISSED_MARKER')`; `src/track.ts` `SYNTHETIC_TRACK_FILE.markers` |
| REQ-FEAT-0004-03 | `src/lap.ts` `buildResult` (sem `lapMs` nem `sectorMs` com `INVALID`) |
| REQ-FEAT-0004-04 | `src/lap.ts` `invalidReason` `MISSED_MARKER`; texto em `src/lapMessages.ts` `describeLap` |
| REQ-FEAT-0004-07 | `src/lap.ts` `invalidate` (fase `ENDED` no passo da chegada; `stepCount` congela) |
| REQ-FEAT-0004-09, REQ-FEAT-0004-10, REQ-FEAT-0006-13 | `src/lap.ts` `evaluateDisplacement` (cruzamento `REVERSE` da chegada ignorado; a fase segue `RUNNING`, sem resultado) |
| REQ-FEAT-0004-11, REQ-FEAT-0004-12 | `src/lap.ts` `evaluateDisplacement` (só o marcador de índice `markersPassedCount + 1`, só `FORWARD`) |
| REQ-FEAT-0009-01 | `src/track.ts` `crossLine` e `src/lap.ts` `evaluateDisplacement` (nenhuma regra na renderização) |
| REQ-FEAT-0010-02, REQ-FEAT-0010-24 | `src/lap.ts` `closeTrainingLap` → `buildResult` (resultado de cada volta com `trainingLapMs`, `lapSequenceCount`, `lapStartMs` e `trainingSectorMs` com `null` nos setores sem as duas fronteiras) |
| REQ-FEAT-0010-03 | `src/lap.ts` `closeTrainingLap` (fase `RUNNING`; `stepCount`, `offTrackSteps` e `kart` intocados) |
| REQ-FEAT-0010-09, REQ-FEAT-0010-10 | `src/lap.ts` `evaluateDisplacement`, ramo `TRAINING` da chegada `FORWARD` (`VALID` com todos os marcadores, senão `INVALID` com `MISSED_MARKER`) |
| REQ-FEAT-0010-11 | `src/lap.ts` `closeTrainingLap` (volta seguinte com `validity` `VALID`, sem `invalidReason`, `markersPassedCount` 0 e `sectorBoundsMs` vazia) |
| REQ-FEAT-0010-23 | `src/lap.ts` `evaluateDisplacement` (candidatos depois do limite registrado mais alto; posições saltadas ficam `null`); `buildResult` (`trainingSectorMs` com `null`) |
| REQ-FEAT-0010-26 | `src/lap.ts` `evaluateDisplacement` (o cruzamento é avaliado só no passo em que ocorre; o deslocamento que fecha a volta não é reavaliado para a seguinte) |
| REQ-FEAT-0010-27 | `src/lap.ts` `startLap` (`declaresLines`: leitura `INCOMPLETE` que declara `direction` e `finishLine` usa as linhas declaradas); `buildResult` (nenhum campo de setor sem os 3 limites declarados) |
| REQ-FEAT-0010-28 | `src/lap.ts` `evaluateDisplacement` (chegada `REVERSE` ignorada em todo tipo de volta) |
| REQ-FEAT-0010-29 | `src/lap.ts` `evaluateDisplacement` (volta de treino já `INVALID` fecha com o motivo que tinha, `CUT`, sem segundo motivo) |

## Interface

`crossLine` devolve `null` ou `{sense, fraction}`: `FORWARD` quando `sideOf(from) < 0` e `sideOf(to) >= 0`, `REVERSE`
quando `sideOf(from) > 0` e `sideOf(to) <= 0`; `fraction = |side(from)| / |side(to) - side(from)|` em (0, 1]; o ponto de
cruzamento tem de cair no segmento (parâmetro de 0 a 1). Ordem no passo: marcador, limite de setor, chegada, depois o corte
(ADR-0004, item 1). Só as linhas de uma leitura `COMPLETE` entram em `LapSession.lines`; em `INCOMPLETE` as listas são
vazias e `finishLine` é ausente, de modo que o passo ignora marcadores, setores e chegada.

## Rodada 2 (2026-10-30): treino de voltas seguidas (FEAT-0010)

Nova função interna `closeTrainingLap(session, finishMs, validity, reason?)`. O registro de limite de setor testa, em ordem, os limites depois do mais alto registrado (REQ-FEAT-0002-14), em todo tipo de volta: numa volta que cruza os limites em ordem o efeito é o de antes.
