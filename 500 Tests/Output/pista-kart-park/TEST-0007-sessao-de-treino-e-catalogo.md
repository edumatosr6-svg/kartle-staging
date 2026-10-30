---
id: TEST-0007
title: Sessão de treino e catálogo de pistas — API-0002 campo a campo, Kart Park na abertura, volta da pista escolhida, troca que descarta a volta e reposiciona o kart, códigos de falha
feature: pista-kart-park
stage: test
status: validated
version: 1.1.0
sources: [AC-US-0001-01, AC-US-0001-02, AC-US-0001-03, AC-US-0001-04, AC-US-0001-05, AC-US-0001-06, AC-US-0001-07, AC-US-0006-07, AC-US-0006-08, AC-US-0006-09]
---

# TEST-0007 — Sessão de treino e catálogo de pistas

| | |
|---|---|
| Arquivo | `tests/pista-kart-park-session.test.ts` (estratégia: `session`) |
| Nível | unitário e contrato (`getTrainingTrackOptions`, `selectTrainingTrack`, `startTrainingLap`, `trainingIdleKart`, `TRAINING_TRACKS`, `OPENING_TRACK_ID` campo a campo) e integração (voltas do treino concluídas, cortadas e com marcador pulado nas duas pistas, cada uma lida como item de `listLapResults`; treino descartado pela troca e encerrado por `endTraining`; troca com volta em `COUNTDOWN`, `RUNNING` e `PAUSED`) |
| Interface exercitada | `src/trainingSession.ts` inteiro; `getLapState`, `getLapResult`, `listLapResults`, `endTraining`, `offeredLapKinds`, `pauseLap`, `kartAtStart`; `CIRCUIT`, `initialState`; `SYNTHETIC_TRACK_FILE` |
| Fixtures | fontes `{'kart-park': kartParkText(), synthetic: SYNTHETIC_TRACK_FILE}`; fontes com o texto da Kart Park corrompido, com `schemaVersion` 4 e com outro `trackId`; `kartParkPilot` para a volta completa; kart semeado a 8 m da linha central em 105 m (corte) e a (400, 400) na sintética; kart a 8 m/s 6 m antes da chegada da Kart Park e em (75, −14) rumo 0 na sintética (cruzamento da chegada sem marcadores, e fechamento da volta cortada); `pauseLap(..., 'ESC_KEY')` |

## Verificações

| Check | Decide | Teste | O que a faria falhar |
|---|---|---|---|
| CHK-TEST-0007-01 | AC-US-0001-01, AC-US-0006-09 | the catalogue offers exactly two options, the Kart Park and the synthetic track, with the contract fields and nothing else | opções diferentes de [`kart-park`, `synthetic`], campo a mais ou a menos numa entrada, `trackDataStatus` presente sem sessão, estado inicial ≠ `NO_SESSION`, catálogo não congelado, recorde no catálogo |
| CHK-TEST-0007-02 | AC-US-0001-02 | at the opening the selected track is the Kart Park, and selecting it loads the published file: READY, COMPLETE, version 1, kart on its start | `selectedTrackId` inicial ou `OPENING_TRACK_ID` ≠ `kart-park` (mutação E), resposta diferente de `{READY, kart-park, 1, COMPLETE}`, volta presente, `walls` verdadeiro, kart ocioso fora da largada do arquivo ou em movimento |
| CHK-TEST-0007-03 | AC-US-0001-03 | a training lap started on the Kart Park session has the trackId of the Kart Park and runs on its environment | `trackId` ≠ `kart-park`, `trackVersion` ≠ 1, `lapKind` ≠ `TRAINING`, ambiente da volta diferente do da sessão, sem `track` ou com muro, kart inicial ≠ `startKart` |
| CHK-TEST-0007-04 | AC-US-0001-04 | a training lap started on the synthetic session has the trackId of the synthetic track and runs on the synthetic circuit | ambiente ≠ `CIRCUIT`, `trackId` ≠ `synthetic`, versão diferente da do arquivo sintético, sem muro, com `track`, kart ocioso diferente de `kartAtStart` da largada sintética |
| CHK-TEST-0007-05 | AC-US-0001-05 | every lap result of a training session is TRAINING without a challenge number and never official, completed, cut or with a missed marker, and a discarded or ended training adds none, on both tracks | `lapKind` ≠ `TRAINING`, `challengeNumber` presente, `official` verdadeiro, volta completa sem item `VALID` ou com a fase ≠ `RUNNING` (mutação M2), corte terminando a volta (mutação M1) ou com item antes da chegada, volta cortada sem item `CUT` na chegada seguinte (mutação M5), volta sem marcadores com item `VALID` (mutação M4), volta em andamento com item, troca que não descarta a volta, `endTraining` sem `ENDED` ou com item novo (mutação M6), menos de 5 itens julgados |
| CHK-TEST-0007-06 | AC-US-0001-06 | after a switch the session kart stands on the start of the chosen track, at rest, and the idle kart is that one | `startKart` fora da largada da pista escolhida depois de cada troca, velocidade ≠ 0, `stepCount` ≠ 0, `trainingIdleKart` ≠ `startKart`, kart sem sessão |
| CHK-TEST-0007-07 | AC-US-0001-07 | switching track with a lap in COUNTDOWN, RUNNING or PAUSED discards it: no active lap and no result | troca recusada, volta devolvida (mutação K), `getLapState` ≠ `NO_ACTIVE_LAP`, `getLapResult` ≠ `NO_RESULT`, pista nova não selecionada |
| CHK-TEST-0007-08 | AC-US-0001-07 | selecting the READY track again changes nothing and keeps the lap; an unknown track is refused without touching the session | mesma pista devolvendo outra sessão ou descartando a volta, resposta diferente da `READY`, `moon` aceito ou alterando sessão/volta |
| CHK-TEST-0007-09 | AC-US-0001-03 | an unreadable or unsupported Kart Park source gives a FAILED session with the code of API-0002, no lap, and no training lap can start | texto corrompido sem `TRACK_DATA_UNREADABLE`/`FAILED`/`UNREADABLE`, volta presente, catálogo sem o status, `startTrainingLap` aceitando a sessão `FAILED` ou a inexistente, `schemaVersion` 4 sem `TRACK_SCHEMA_UNSUPPORTED`, arquivo de outro `trackId` aceito |
| CHK-TEST-0007-10 | AC-US-0001-05 | a training session offers the training lap only, and a second start while a lap is active is refused | `offeredLapKinds` ≠ [`TRAINING`], segunda volta aceita, acerto não copiado para `setupId`/`setupVersion` ou presente sem ser dado |
| CHK-TEST-0007-11 | AC-US-0006-07, AC-US-0006-08 | the catalogue names the Kart Park as the real track, with 687 m fixed by the product and not derived from the smoothed length | `displayName` ≠ "Kart Park — São José dos Pinhais (traçado aproximado)", `displayLengthM` ≠ 687, comprimento suavizado arredondando para 687 (rótulo derivado do arquivo), `osmCredit` trocado, nome sintético diferente |
