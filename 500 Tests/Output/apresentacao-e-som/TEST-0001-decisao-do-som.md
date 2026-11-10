---
id: TEST-0001
title: Decisão do som — as tabelas de RULE-0001 e RULE-0002 linha a linha, as desigualdades de tom e de intensidade, a janela do reposicionamento e a leitura única do passo
feature: apresentacao-e-som
stage: test
status: draft
version: 1.0.0
sources: [AC-US-0003-01, AC-US-0003-02, AC-US-0003-03, AC-US-0003-04, AC-US-0003-05, AC-US-0003-06, AC-US-0003-07, AC-US-0003-08, AC-US-0003-10, AC-US-0004-01, AC-US-0004-02, AC-US-0004-03, AC-US-0004-04, AC-US-0004-05, AC-US-0004-06]
---

# TEST-0001 — Decisão do som

| | |
|---|---|
| Arquivo | `tests/apresentacao-e-som-decision.test.ts` (estratégia: unitário) |
| Nível | unitário: `decideSoundOutput` sobre leituras escritas no teste; sem contexto de áudio e sem relógio (o instante é argumento) |
| Interface exercitada | `decideSoundOutput`, `initialSoundDecision` e as 8 constantes exportadas de `src/soundOutput.ts` |
| Fixtures | `base` (som ligado, as duas gravações disponíveis, `RUNNING`, kart parado, acelerador solto); `one(patch)` decide uma leitura sobre o estado inicial; `sequence(patches)` encadeia leituras, cada uma sobre o estado que a anterior deixou |

Os valores esperados vêm das tabelas de RULE-0001 e RULE-0002 e dos números de DES-0002 (0,9875 e 1,55 de tom; 0,35, 0,70 e 0,50 de ganho; 10 e 80 ms); nenhum é lido do que a função devolve para depois ser afirmado. Comparações de fração usam tolerância de 1e-12.

## Verificações

| Check | Decide | Teste | O que a faria falhar |
|---|---|---|---|
| CHK-TEST-0001-01 | AC-US-0003-01 | with the sound on, the recording available and the lap running, every reading gives the engine playing with a gain above 0, the kart at rest with the throttle released included | ganho 0 ou `ENGINE_SILENT` com a volta em `RUNNING` em qualquer velocidade ou acelerador (mutação M01: ganho de marcha lenta 0); ganho acima de 1; uma avaliação em silêncio em 600 passos |
| CHK-TEST-0001-02 | AC-US-0003-02 | with the same throttle the engine pitch at 20 m/s is higher than at 5 m/s, and it rises strictly with the speed from 0 to 32 m/s | tom que não cresce com a velocidade, tom ligado ao acelerador (M04), razão menor ou igual a 0, valores diferentes de 0,9875 e 1,55 |
| CHK-TEST-0001-03 | AC-US-0003-03 | at the same speed the engine gain with the throttle pressed is above the gain with the throttle released | ganho igual ou menor com o acelerador pressionado a 0, 5 ou 20 m/s; ganho 0 com o acelerador solto (M01); ganho que não cresce com o acelerador |
| CHK-TEST-0001-04 | AC-US-0003-04 | the first evaluation after the lap is paused gives the engine silent with gain 0 | `ENGINE_PLAYING` ou ganho maior que 0 na primeira avaliação com `PAUSED` (M05) |
| CHK-TEST-0001-05 | AC-US-0003-05 | the first evaluation after the lap ended gives the engine silent with gain 0 | `ENGINE_PLAYING` ou ganho maior que 0 na primeira avaliação com `ENDED` |
| CHK-TEST-0001-06 | AC-US-0003-06 | an accepted reposition silences the engine at once and for the 80 ms of the fade-out, and the engine is back at 80 ms | motor tocando no instante do reposicionamento aceito ou em qualquer milissegundo de 0 a 79 (M02: janela retirada); motor ainda em silêncio de 80 a 100 ms; janela maior que 200 ms; resposta diferente ao reavaliar o mesmo instante |
| CHK-TEST-0001-07 | AC-US-0003-07 | with the sound off the engine is silent with gain 0 in every lap phase and without a lap | ganho maior que 0 ou `ENGINE_PLAYING` com `soundOn` falso em alguma fase; ganho que não vai a 0 na avaliação em que o som é desligado |
| CHK-TEST-0001-08 | AC-US-0003-01 | before the lap runs (countdown, no lap) the engine is silent even with the sound on | motor tocando em `COUNTDOWN` ou sem volta (M05); motor em silêncio na primeira avaliação em `RUNNING` |
| CHK-TEST-0001-09 | AC-US-0003-10 | an unavailable engine recording keeps the engine silent with the sound on, and does not silence the tyre | ganho ou `ENGINE_PLAYING` com `engineSoundAvailable` falso; `soundOn` alterado pela indisponibilidade; pneu calado pela falta do motor |
| CHK-TEST-0001-10 | AC-US-0004-01 | with the sound on, the tyre plays while the last advanced step marks the asphalt, frames without a new step included | `TIRE_SILENT` ou ganho 0 com o último passo marcando; pneu calado num quadro sem passo novo; ganho fora de 0 a 1 |
| CHK-TEST-0001-11 | AC-US-0004-02 | the tyre goes silent with gain 0 in the evaluation of the first step that no longer marks, in the pause and in the result, and plays again when the kart marks again | pneu tocando no primeiro passo sem marca; pneu tocando em `PAUSED` ou `ENDED` (M03); pneu que não volta ao marcar de novo; descida maior que 200 ms |
| CHK-TEST-0001-12 | AC-US-0004-03 | with the kart at rest and no mark, no tyre sound is asked | `TIRE_PLAYING` ou ganho maior que 0 com o kart parado em alguma fase ou em 240 passos |
| CHK-TEST-0001-13 | AC-US-0004-04 | rolling without a mark on the asphalt asks for no tyre sound at any speed: the decision follows the mark, not the speed | pneu ligado à velocidade (toca sem marca a 20 ou 30 m/s) ou calado com marca nas mesmas velocidades |
| CHK-TEST-0001-14 | AC-US-0004-05 | with the sound off no tyre sound is asked even while the kart marks the asphalt | ganho ou `TIRE_PLAYING` com `soundOn` falso e marca, em alguma fase; ganho que não vai a 0 ao desligar no meio do deslize |
| CHK-TEST-0001-15 | AC-US-0004-06 | an unavailable tyre recording keeps the tyre silent while the kart marks, and the engine plays | pneu tocando com `tireSoundAvailable` falso; motor calado pela falta do pneu |
| CHK-TEST-0001-16 | AC-US-0003-08 | before any lap and before the sound is turned on, the decision has the 8 fields of the contract with the sound off, both sounds silent and gains 0 | campo a mais ou a menos que os 8 de API-0002; `soundOn` inicial verdadeiro; ganho inicial diferente de 0; estado inicial tocando; razão de tom menor ou igual a 0 |
| CHK-TEST-0001-17 | AC-US-0003-02 | a step is read once: the same step read again changes nothing, several steps between two frames use the last, and a silent engine keeps its last pitch | o mesmo `simStepCount` relido mudando tom, ganho ou pneu; estado diferente para a mesma entrada; tom do motor em silêncio zerado; contador menor não lido como passo novo |
| CHK-TEST-0001-18 | AC-US-0003-03 | a reading out of range is limited and never throws: the gains stay fractions of 0 to 1 and the pitch stays above 0 | exceção com velocidade negativa, infinita ou não numérica, acelerador fora de 0 a 1 ou instante não numérico; ganho fora de 0 a 1; tom não finito |
| CHK-TEST-0001-19 | AC-US-0003-01 | the published constants of the decision are the designed ones and the fades fit the deadlines of the criteria | constante diferente de DES-0002 (M01); subida acima de 50 ms; descida acima de 200 ms |

O caso anormal "arquivo de som ausente, ilegível, ou navegador sem áudio" de US-0003 e de US-0004 é decidido aqui nas verificações -09 e -15 (linha 2 das duas tabelas) e, sobre a saída de áudio, em TEST-0002. As mutações citadas estão em `reports/mutation-trials-20261110.txt`.
