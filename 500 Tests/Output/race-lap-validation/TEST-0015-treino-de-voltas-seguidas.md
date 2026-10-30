---
id: TEST-0015
title: Treino de voltas seguidas
feature: race-lap-validation
stage: test
status: validated
version: 1.0.0
sources: [AC-US-0007-06, AC-US-0010-01, AC-US-0010-02, AC-US-0010-03, AC-US-0010-04, AC-US-0010-05, AC-US-0010-06, AC-US-0010-07, AC-US-0010-08, AC-US-0010-09, AC-US-0010-10, AC-US-0010-11, AC-US-0010-12, AC-US-0010-13, AC-US-0010-14, AC-US-0010-15, AC-US-0010-17, AC-US-0010-18, AC-US-0010-19, AC-US-0010-20, AC-US-0010-21, AC-US-0010-22, AC-US-0010-23, AC-US-0010-24, AC-US-0010-25, AC-US-0010-26, AC-US-0010-27, NFR-0001, NFR-0009]
---

# TEST-0015 — Treino de voltas seguidas

| | |
|---|---|
| Arquivo | `tests/race-lap-validation-state.test.ts`, bloco `TEST-0015` no fim do arquivo (estratégia: `lap-training`; hospedado ali, ver `98-divergences.md`) |
| Nível | integração: `src/lap.ts` sobre `step` real e a pista sintética |
| Interface exercitada | `startLap`, `stepLap`, `pauseLap` (`PAUSE_BUTTON`), `resumeLap`, `repositionKart`, `endTraining`, `getLapState`, `getLapResult`, `listLapResults`; `describeLap`, `describeTrainingResult` |
| Fixtures | `syntheticReading()`; `withShortMarker(2)` com `autopilot(4)`; `withoutSectors()` (cópia do sintético sem `sectorLimits`, definida no bloco); corrida compartilhada de três voltas do `autopilot()` com uma pausa pelo botão no passo 5000; corte semeado (kart parado a `WIDTH / 2 + 5` m além da borda, `IDLE` por 121 passos); salto semeado depois do limite 1 para 5 segmentos além do limite 2; kart semeado 3 segmentos antes da chegada a 10 m/s; `THROTTLE` `{throttle: 1}` |
| Oráculos | chegada: `crossLine` da chegada sobre o deslocamento de cada passo, instante esperado `interpolateMs(k, f)`; corte: mais de 120 passos seguidos além de 3 m (`beyondEdgeM`) |

## Verificações

| Check | Decide | Teste | O que a faria falhar |
|---|---|---|---|
| CHK-TEST-0015-01 | AC-US-0010-01 | in training the next lap starts at the finish crossing instant that closed the previous one, with 0 ms difference | `lapStartMs` da volta seguinte diferente do instante do oráculo (prova: M01, M13, M22) |
| CHK-TEST-0015-02 | AC-US-0010-05 | each training lap time is its closing crossing instant minus its start: the green signal, then the previous crossing | `trainingLapMs` medido de outro início (M01) |
| CHK-TEST-0015-03 | AC-US-0010-06 | the training lap times add up to the simulation time from the green signal to the last crossing, with 0 ms difference | lacuna ou sobreposição entre voltas (M01) |
| CHK-TEST-0015-04 | AC-US-0010-20 | listLapResults grows by exactly one per forward finish crossing, numbered 1, 2, 3 without repetition | resultado faltante, repetido ou fora do passo do cruzamento (M13, M22) |
| CHK-TEST-0015-05 | AC-US-0010-04, AC-US-0010-14 | from the green signal on, through lap ends and a pause, the training never shows a countdown nor ends by itself | contagem de volta depois de uma chegada ou treino em `ENDED` sem `endTraining` (M02, M22) |
| CHK-TEST-0015-06 | AC-US-0010-12 | the best valid lap is absent before the first valid lap and then is the smallest valid lap time of the training | melhor volta ausente, antecipada ou diferente do mínimo do oráculo (M01) |
| CHK-TEST-0015-07 | AC-US-0010-25, AC-US-0010-24 | every training result is valid without a reason and not official | resultado de treino oficial (M11) |
| CHK-TEST-0015-08 | AC-US-0010-03 | a lap end at the finish does not stop the kart: one step after the crossing under full throttle the speed is above 0 | fim de volta que para o kart ou encerra o treino (M02, M22) |
| CHK-TEST-0015-09 | AC-US-0010-26 | each forward finish crossing closes at most one lap; reverse crossings close none | contramão fechando volta (M15) |
| CHK-TEST-0015-10 | AC-US-0010-07, AC-US-0010-08 | a training cut is marked at once with the reason CUT, the training keeps running and the kart keeps moving | corte que encerra a volta, atrasado ou sem motivo na tela (M03, M32) |
| CHK-TEST-0015-11 | AC-US-0010-09 | after a training cut no lap starts until the next forward finish crossing, and the next lap starts at its instant | volta nova antes da chegada ou corte revalidado (M03, M10) |
| CHK-TEST-0015-12 | AC-US-0010-10 | the finish crossing that makes a training lap a missed-marker lap also starts the next lap at that instant | chegada com marcador pulado que não inicia a volta seguinte no instante (M01, M22) |
| CHK-TEST-0015-13 | AC-US-0010-11 | the lap after an invalid training lap starts valid in progress: no reason, no marker, no sector | volta seguinte que herda a invalidação (M06) |
| CHK-TEST-0015-14 | AC-US-0010-13 | an invalid training lap shorter than the best valid lap does not change the best valid lap | melhor volta que conta volta inválida (M04) |
| CHK-TEST-0015-15 | AC-US-0010-14 | only a pause or the end of the training stops the steps: lap ends, a cut and a repositioning do not | passo suspenso por fim de volta, corte ou reposicionamento (M02, M03) |
| CHK-TEST-0015-16 | AC-US-0010-15 | the pause button suspends a training lap and its timer: on resume the lap time is the time of the pause | `PAUSE_BUTTON` recusado ou cronômetro que anda na pausa (M02) |
| CHK-TEST-0015-17 | AC-US-0010-17 | ending the training does not conclude the lap in progress: no result for it, in running, paused or countdown | `endTraining` que conclui a volta ou recusa a contagem (M07, M21) |
| CHK-TEST-0015-18 | AC-US-0010-18 | after ending the training no lap starts and nothing changes, and a second end is rejected with LAP_ENDED | resultado acrescentado no fim ou passos depois do fim (M07) |
| CHK-TEST-0015-19 | AC-US-0010-19 | repositioning in training neither invalidates a valid lap nor revalidates a cut lap: the state shown is the same | reposicionamento que muda validade ou motivo (M10) |
| CHK-TEST-0015-20 | AC-US-0007-06 | in a following training lap the lap time is the time since the crossing that started it, with repositionings in between | `elapsedMs` sem descontar `lapStartMs` ou com penalidade (M18) |
| CHK-TEST-0015-21 | AC-US-0010-21 | an official lap is unchanged: once ended by the finish or by a cut, no lap follows and no second result appears | volta oficial que segue depois do fim (M26) |
| CHK-TEST-0015-22 | AC-US-0010-22 | an official lap stops the kart at its end: the position does not change in the steps after it | kart que anda depois do fim da volta oficial (M17, M26) |
| CHK-TEST-0015-23 | AC-US-0010-23 | a training lap that did not cross a sector limit has null, shown as "—", in the sectors without time | setor sem tempo como 0 ou com outro texto (M12, M23) |
| CHK-TEST-0015-24 | AC-US-0010-02, AC-US-0010-24 | every training lap closed at the finish carries its total time and its validity with the reason, sectors declared or not | volta inválida sem `trainingLapMs` ou com outro motivo (M03, M10) |
| CHK-TEST-0015-25 | AC-US-0010-27 | on a track without declared sectors a training result carries only the total time and the validity | `trainingSectorMs` ou linha de setores numa pista sem setores (M09, M30) |
| CHK-TEST-0015-26 | AC-US-0010-09 | a training lap already cut that is cut again and skips a marker ends at the finish with the single reason CUT | segundo motivo substituindo `CUT` (M20) |
| CHK-TEST-0015-27 | AC-US-0010-12 | the best valid lap is not kept beyond its training: gone after the end and absent in a new training until its first valid lap | melhor volta mantida depois do fim ou contada de volta inválida (M04, M05) |
| CHK-TEST-0015-28 | NFR-0001, NFR-0009 | the same training inputs replayed from the same start give the same sessions, results and lap times | estado fora da sessão que muda o resultado entre execuções (M27) |

As verificações 09, 17, 26 e 27 também decidem, respectivamente, REQ-FEAT-0010-28, -30, -29 e -32 (linhas
"Requisitos sem critério próprio" da estratégia). As mutações Mnn estão no
changelog, rodada 5. A exibição na tela e nos dois canais (painel, botão, "encerrar treino", quadro seguinte) fica em
E2E-12 e E2E-13 (`98-divergences.md`).
