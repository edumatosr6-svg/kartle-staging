---
id: TEST-0005
title: Volta na Kart Park — válida com o piloto da Kart Park, marcador pulado, corte pela borda do arquivo, atalho da curva 4, zebra como pista, chegada de novo, contramão, pausa e reposicionamento
feature: pista-kart-park
stage: test
status: draft
version: 1.0.0
sources: [AC-US-0003-05, AC-US-0003-06, AC-US-0003-07, AC-US-0003-08, AC-US-0003-09, AC-US-0003-10, AC-US-0003-11, AC-US-0005-05, AC-US-0001-06]
---

# TEST-0005 — Volta na Kart Park

| | |
|---|---|
| Arquivo | `tests/pista-kart-park-lap.test.ts` (estratégia: `lap`) |
| Nível | integração (`src/lap.ts` sobre `kartParkEnvironment()` com o acerto `ARCADE_ASSISTIDO` publicado e piloto de 75 kg; a volta de referência roda uma vez por arquivo e é partilhada; a sintética com `completeLap`/`autopilot` como comparação de forma) |
| Interface exercitada | `startLap`, `stepLap`, `getLapState`, `getLapResult`, `pauseLap`, `resumeLap`, `repositionKart` (`src/lap.ts`); `getTrackContact`; `toMs`; `describeLap`, `formatLapTime`, `message`; `crossLine`, `sideOf`; `nearestOnCenterline`, `positionAtLapM` |
| Fixtures | `tests/helpers/kartParkPilot.ts`: `kartParkPilot(g, {offsetM, shortcut, maxSpeedMps})` (persegue um ponto à frente na linha central por distância de volta, esterço proporcional saturado, acelerador/freio binários pela curvatura local), `completeKartParkLap`, `drive`, `runCountdown`, `seedLap`, `kartAtLapM(lapM, lateral, reverse)`, `lapDistanceOf`; excursão semeada 3,5 m além da borda a 12 m/s antes do marcador 11 por 100 passos ociosos e retorno à linha central depois dele; kart parado a 4 m e a 2 m além da borda esquerda em 105 m de volta; atalho `{fromLapM: 147, toLapM: 200}`; trecho de zebra direita de 25,2 m percorrido a 7 m/s com o centro 0,15 m além da borda; kart 2,5 m depois da chegada ao contrário a 5 m/s; pausa `FOCUS_LOST` no passo 1 500; kart 4 m fora em 250 m com `offTrackSteps` 50 |

## Verificações

| Check | Decide | Teste | O que a faria falhar |
|---|---|---|---|
| CHK-TEST-0005-01 | AC-US-0003-10 | the Kart Park pilot passes every marker in order and crosses the finish without a cut: the lap ends VALID | volta não `ENDED`, `INVALID`, razão presente, `markersPassedCount` ≠ número de marcadores do arquivo, contador de corte acima de 120 em algum passo, `trackId` ≠ `kart-park`, passos fora de 3 000–9 000 (mutação C: a borda sintética invalida a volta por corte) |
| CHK-TEST-0005-02 | AC-US-0003-11 | a valid lap on the Kart Park has a total time and 4 sector times that add up to it, as a valid lap on the synthetic track has | `lapMs` não inteiro positivo, `sectorMs` sem 4 valores inteiros positivos ou com soma ≠ `lapMs`, vista do estado com setores/total diferentes, formato não `m:ss.mmm`, `lapKind` ≠ `TRAINING`, `official` verdadeiro, campos do resultado diferentes dos da volta sintética válida, limites cruzados fora de ordem |
| CHK-TEST-0005-03 | AC-US-0003-05, AC-US-0003-06 | a lap that skips a marker, passing it 3.5 m beyond the edge for less than the cut window, ends INVALID with MISSED_MARKER at the finish | marcador contado apesar do kart além do alcance da linha, excursão fora da janela (0 ou > 120 passos > 3 m), kart sem passar a linha do marcador, volta terminando antes da chegada, `VALID`, razão ≠ `MISSED_MARKER`, `lapMs` presente, `describeLap` sem "marcador pulado"/"missed marker" ou diferente de `message('reasonMissedMarker')` |
| CHK-TEST-0005-04 | AC-US-0003-07 | standing more than 3 m beyond the edge of the Kart Park invalidates the lap by CUT in the 121st consecutive step | kart a 4 m com `beyondTrackEdgeM` fora de (3; 4,5), volta invalidada em 120 passos ou menos, contador ≠ 120, 121.º passo sem `ENDED`/`CUT`, `elapsedMs` ≠ `toMs(121)` |
| CHK-TEST-0005-05 | AC-US-0003-08 | up to 1000 ms beyond 3 m followed by a return to 3 m or less does not invalidate, and the count restarts | invalidação em 120 passos, contador não zerado pelo retorno a 2 m, segunda série de 120 passos invalidando, volta não `RUNNING`, 121.º passo sem `CUT` |
| CHK-TEST-0005-06 | AC-US-0003-09 | a lap that crosses the grass inside curve 4, leaving near 147 m and returning near 200 m, is invalid | menos de 21 passos com roda na grama entre 140 e 205 m de volta (atalho não executado), volta não `ENDED`, `VALID`, razão fora de {`CUT`, `MISSED_MARKER`}, todos os marcadores passados |
| CHK-TEST-0005-07 | AC-US-0005-05 | riding a curb for more than 1000 ms with no wheel beyond it is not a cut: the curb counts as track | menos de 121 passos seguidos com roda na zebra e nenhuma na grama, `beyondTrackEdgeM` > 0 em algum passo do trecho (mutação C: a borda sintética dá metros além e corte), volta não `RUNNING`, `INVALID`, `offTrackSteps` ≠ 0 |
| CHK-TEST-0005-08 | AC-US-0003-11 | crossing the finish again after the lap ended produces no second result and adds no time | `elapsedMs`, `stepCount`, resultado ou kart alterados por 600 passos de acelerador depois do fim |
| CHK-TEST-0005-09 | AC-US-0003-11 | crossing the finish of the Kart Park against the track sense does not end the lap and counts no marker | fixture sem cruzamento `REVERSE`, volta `ENDED`, resultado presente, marcador contado |
| CHK-TEST-0005-10 | AC-US-0003-11 | a pause freezes the Kart Park lap, the resume continues it, and the markers passed before the pause still count | menos de 3 marcadores antes da pausa, pausa recusada, `stepCount` ou kart alterados em 100 passos pausados, retomada recusada, volta não terminando `VALID` com todos os marcadores |
| CHK-TEST-0005-11 | AC-US-0001-06 | the reposition of a training lap on the Kart Park puts the kart on the nearest point of the file centerline, facing the travel sense, at rest | reposicionamento recusado, kart a mais de 1e-6 m da linha central da Kart Park (linha sintética: mutação que troque `nearestOnTrack`), rumo diferente do sentido de corrida, velocidade ≠ 0, `offTrackSteps` ≠ 0, volta `INVALID`, kart a mais de 2 m dos 250 m de volta |
| CHK-TEST-0005-12 | AC-US-0003-07 | the lap on the Kart Park uses the default cut limits of 3 m and 1000 ms and the lines of the file | `cutDistanceM` ≠ 3, `cutDurationMs` ≠ 1000, linhas da volta diferentes das do arquivo, `trackStatus` ≠ `COMPLETE`, número de entradas gravadas ≠ passos da volta de referência |
