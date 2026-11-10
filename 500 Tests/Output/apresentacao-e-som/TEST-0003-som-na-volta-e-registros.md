---
id: TEST-0003
title: Som sobre voltas reais e registros de npm test — volta inteira, pausa, resultado, reposicionamento, som desligado, sessão sem ação do Jogador, pneu sobre o bloco de marca, SOUND_DETERMINISM, ASSETS_NEUTRAL e SIM_STATE_UNCHANGED
feature: apresentacao-e-som
stage: test
status: draft
version: 1.0.0
sources: [AC-US-0003-01, AC-US-0003-04, AC-US-0003-05, AC-US-0003-06, AC-US-0003-07, AC-US-0003-09, AC-US-0004-01, AC-US-0004-03, NFR-0004, NFR-0009]
---

# TEST-0003 — Som na volta e registros

| | |
|---|---|
| Arquivo | `tests/apresentacao-e-som-lap.test.ts` (estratégia: integração; registros de API-0003) |
| Nível | integração: `RaceAudio` sobre o contexto de substituição, alimentado a cada passo com a leitura do quadro montada das operações públicas da volta e da simulação |
| Interface exercitada | `RaceAudio`; `stepLap`, `getLapState`, `pauseLap`, `resumeLap`, `repositionKart`, `endTraining` (`src/lap.ts`); `getHandlingTelemetry`, `getTrackContact` (`src/physics.ts`) |
| Fixtures | `tests/helpers/soundReport.ts`: `frameReading` (a `SoundReading` campo a campo como DES-0003 a descreve), `rearOnAsphalt`, `runKartParkLapWithSound`, `judgeTimes`, `soundDeterminismCheck`, `assetsNeutralCheck`, `simStateUnchangedCheck`, `serializeRecord`. Piloto e volta: `tests/helpers/kartParkPilot.ts` (Kart Park, treino) e `tests/helpers/autopilot.ts` (pista sintética, volta oficial até `ENDED`). Bloco de marca: `tyreMarkRunner` de `tests/helpers/kart01Report.ts`, que extrai e executa o bloco de `src/main.ts`. Linha de base: `tests/fixtures/kart01-sim-baseline.json` |

O relógio do quadro é contagem de passos (passos vezes `STEP`); nenhum relógio de parede é lido. A leitura do quadro é montada pelo ajudante, não por `src/main.ts`, que `npm test` não carrega: a composição de `src/main.ts` é conferida como texto em TEST-0004 e no aparelho em E2E-07.

## Verificações

| Check | Decide | Teste | O que a faria falhar |
|---|---|---|---|
| CHK-TEST-0003-01 | AC-US-0003-01 | over a whole lap of the Kart Park with the sound on, every step of the running lap asks for the engine with a gain above 0, and the engine source is never stopped nor faded to 0 | um passo em `RUNNING` com motor em silêncio ou ganho abaixo do de marcha lenta; fonte parada ou reiniciada; valor 0 agendado no ganho do motor depois da primeira subida; subida depois de 50 ms |
| CHK-TEST-0003-02 | AC-US-0003-04 | pausing a running lap silences the engine in the first evaluation, with the gain ramped to 0 in 80 ms, and the engine is back when the lap is resumed | motor tocando na primeira avaliação com `PAUSED` (M05); rampa que não termina em 0 ou termina a 200 ms ou mais (M10); som agendado durante a pausa; motor que não volta ao retomar |
| CHK-TEST-0003-03 | AC-US-0003-05 | when the lap ends with its result the first evaluation silences the engine, with the gain ramped to 0 in 80 ms | motor tocando na contagem (M05) ou calado em algum passo da volta; motor tocando na primeira avaliação com `ENDED`; rampa fora do prazo (M10); fonte parada; treino encerrado ainda tocando |
| CHK-TEST-0003-04 | AC-US-0003-06 | an accepted reposition silences the engine at once with the gain ramped to 0 in 80 ms, keeps it silent up to 79 ms later, and at 80 ms the engine plays again | motor tocando de 0 a 79 ms depois do reposicionamento aceito (M02); motor calado a 80 ms; rampa fora do prazo (M10); ganho subindo antes dos 80 ms |
| CHK-TEST-0003-05 | AC-US-0003-07 | turning the sound off in the middle of a lap cuts the engine gain to 0 at the instant of the action, with no ramp, and no engine sound is asked while it stays off | rampa em vez de corte (M07); corte fora de `currentTime`; ganho agendado acima de 0 com o som desligado; fonte parada; motor que não volta ao religar |
| CHK-TEST-0003-06 | AC-US-0003-09 | a whole session — countdown, lap, pause, resume, reposition, result — never turns the sound on by itself: only the sound command does | `soundOn` verdadeiro, ganho pedido, contexto de áudio ou nó criado em qualquer momento da sessão sem `setSoundOn`; `setSoundOn(true)` sem efeito |
| CHK-TEST-0003-07 | AC-US-0004-03 | a kart at rest in a running lap, advanced with a neutral input, never asks for the tyre sound | `TIRE_PLAYING` ou ganho de pneu agendado com o kart parado; motor calado com o kart parado em `RUNNING` |
| CHK-TEST-0003-08 | AC-US-0004-01 | over a driven training, the tyre plays exactly from the frames in which the scene lays a new mark with a rear wheel on the asphalt, and is silent in every other one | pneu calado num quadro em que o bloco desenhou trecho no asfalto; pneu tocando sem trecho novo; pneu calado num quadro sem passo novo depois de um trecho; rampa de descida fora do prazo (M10) ou reagendada sem mudança de estado; treino sem deslizes |
| CHK-TEST-0003-09 | NFR-0004 | SOUND_DETERMINISM: the same inputs from the same start give the same lap time and the same sector times with the sound on and with the sound off | tempo total ou algum setor diferente entre a execução com som ligado e a com som desligado; volta não completada; primeira execução sem som de fato ligado |
| CHK-TEST-0003-10 | NFR-0009 | ASSETS_NEUTRAL: the same inputs give the same lap time and sector times with the sounds available and with no recording and no audio output at all | tempo ou setor diferente sem as gravações e sem contexto de áudio; execução sem som com alguma gravação disponível |
| CHK-TEST-0003-11 | NFR-0009 | SIM_STATE_UNCHANGED: the reference runs recorded before the feature replay to the same final state, field by field | um campo do estado final acrescentado, retirado ou diferente em relação à linha de base de 2026-10-30 (M22: `x` deslocado em 1e-7 por passo) |
| CHK-TEST-0003-12 | NFR-0009 | one field altered in a copy of the baseline is STATE_DIFFERS, a field added or removed counts, and without a usable baseline the record is BASELINE_MISSING | diferença de 1e-9 num campo não contada; campo a mais ou a menos não contado; caminho inexistente, outro esquema ou outra versão de acerto dando `PASS` ou comparando algo |
| CHK-TEST-0003-13 | NFR-0004 | the time records carry exactly the fields of the contract: a reason only on FAIL, TIME_DIFFERS for any difference and LAP_NOT_COMPLETED when an execution closes no lap | campo fora do contrato; `checkFailReason` com `PASS`; setor diferente com total igual dando `PASS`; execução sem volta fechada sem `LAP_NOT_COMPLETED` |

SOUND_DETERMINISM e ASSETS_NEUTRAL comparam duas execuções da mesma sequência de entradas; como `RaceAudio` não recebe a sessão da volta, só a leitura, elas só reprovam se o som alterar a simulação por estado global. A garantia estrutural correspondente é a verificação -14 de TEST-0004 (nenhum módulo da simulação importa o som). Os três registros saem como diagnóstico de `npm test`, um objeto JSON por linha.
