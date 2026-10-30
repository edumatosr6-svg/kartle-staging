---
id: TEST-0006
title: Determinismo na Kart Park — mesma sequência de entradas, mesmo tempo, mesmos setores e mesmo estado; reprodução pela sessão de treino
feature: pista-kart-park
stage: test
status: validated
version: 1.1.0
sources: [NFR-0003]
---

# TEST-0006 — Determinismo na Kart Park

| | |
|---|---|
| Arquivo | `tests/pista-kart-park-determinism.test.ts` (estratégia: `determinism`) |
| Nível | integração (duas voltas completas do piloto da Kart Park, uma reprodução das entradas gravadas pela sessão de treino, uma reprodução com uma entrada alterada, duas execuções de 2 000 passos semeados com `step`) |
| Interface exercitada | `step`, `STEP`; `getLapResult`, `getLapState`, `listLapResults` (por `lapResults`); `initialTrainingSession`, `selectTrainingTrack`, `startTrainingLap`; `kartParkEnvironment()` |
| Fixtures | `completeKartParkLap(kartParkPilot(g))` duas vezes, cada uma até o passo em que `listLapResults` cresce (o treino continua depois da chegada); `replay(inputs)` sobre uma volta aberta por `startTrainingLap`, com 10 passos ociosos de folga que `drive` não usa porque para no fechamento; `inputs` com o passo 600 trocado; `Seeded(20261027)` a partir de `kartAtLapM(0)` |

## Verificações

| Check | Decide | Teste | O que a faria falhar |
|---|---|---|---|
| CHK-TEST-0006-01 | NFR-0003 | two laps of the Kart Park pilot with the same input sequence give the same lap time to the millisecond and the same 4 sector times | sequências de `Input` diferentes entre as duas voltas, volta de referência inválida (mutação C), `lapMs` diferentes, `sectorMs` diferentes em qualquer valor ou sem 4 valores |
| CHK-TEST-0006-02 | NFR-0003 | the whole session, kart included, is deepEqual after the two laps | qualquer campo de `LapSession` (fase, contadores, `kart` inteiro com telemetria e manobras, resultado) diferente entre as duas execuções; vistas de estado diferentes |
| CHK-TEST-0006-03 | NFR-0003 | replaying the recorded inputs step by step, without the pilot, reproduces the same lap; one input changed does not | reprodução pela sessão de treino fechando a volta noutro passo, com `listLapResults`, `lapMs`, `sectorMs` ou kart na chegada diferentes dos do piloto (mutação M7: a sessão pilota outra massa); reprodução com o passo 600 alterado dando o mesmo kart (a comparação não poderia falhar) |
| CHK-TEST-0006-04 | NFR-0003 | a seeded 2000-step input sequence from the Kart Park start gives deepEqual states in two runs | estado de algum dos 2 000 passos diferente entre as duas execuções (relógio, sorteio ou ordem de segmentos variável), execução que nunca sai do asfalto |
