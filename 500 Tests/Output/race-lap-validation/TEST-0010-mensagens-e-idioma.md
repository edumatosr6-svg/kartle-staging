---
id: TEST-0010
title: Textos de estado e motivo, idioma e formato de tempo
feature: race-lap-validation
stage: test
status: validated
version: 1.1.0
sources: [AC-US-0001-02, AC-US-0001-03, AC-US-0001-04, AC-US-0001-07, AC-US-0002-06, AC-US-0003-09, AC-US-0004-04, AC-US-0006-05, AC-US-0007-02, AC-US-0007-05, AC-US-0008-01, AC-US-0009-02, AC-US-0009-03, AC-US-0009-04, AC-US-0009-05, AC-US-0009-06, AC-US-0009-07, AC-US-0010-02, AC-US-0010-04, AC-US-0010-07, AC-US-0010-11, AC-US-0010-12, AC-US-0010-15, AC-US-0010-16, AC-US-0010-23, AC-US-0010-24, AC-US-0010-25, AC-US-0010-27, NFR-0006, NFR-0007]
---

# TEST-0010 — Textos de estado e motivo, idioma e formato de tempo

| | |
|---|---|
| Arquivo | `tests/race-lap-validation-messages.test.ts` (estratégia: `lap-messages`) |
| Nível | unitário |
| Interface exercitada | `describeLap`, `describeTrainingResult`, `greenSignalVisible`, `formatLapTime`, `formatSectorTime`, `resolveLanguage`, `message`, `MESSAGE_KEYS` de `src/lapMessages.ts` |
| Fixtures | `LapStateView` literal por combinação de fase, validade e motivo (com `lapSequenceCount` e `lapStartMs` de API-0001 1.2.0); `LapResult` literal de treino (`trainingResult`) com valores de exemplo; etiquetas de idioma literais; textos esperados da tabela de DES-0008 1.1.0 |

## Verificações

| Check | Decide | Teste | O que a faria falhar |
|---|---|---|---|
| CHK-TEST-0010-01 | AC-US-0001-02 | each countdown value is a text numeral 3, 2 or 1 for the whole second it covers | numeral ausente ou arredondado para baixo (0 ou 2 em 2001 ms) |
| CHK-TEST-0010-02 | AC-US-0001-03 | the green signal is shown as text on the first running frame, in both languages | sinal verde só por cor ou invisível no primeiro quadro |
| CHK-TEST-0010-03 | AC-US-0001-04 | the timer shown during the countdown is 0:00.000 | formato diferente para zero |
| CHK-TEST-0010-04 | AC-US-0001-07 | a valid running lap is described as valid in progress, with no reason | texto diferente ou motivo exibido em volta válida |
| CHK-TEST-0010-05 | AC-US-0002-06 | times are shown as m:ss.mmm with three decimals and no rounding | arredondamento ou zeros à esquerda nos minutos |
| CHK-TEST-0010-06 | AC-US-0004-04 | a lap invalid by marker shows the reason "marcador pulado" | texto do motivo diferente |
| CHK-TEST-0010-07 | AC-US-0006-05 | a lap invalid by cut shows the reason "corte" | texto do motivo diferente |
| CHK-TEST-0010-08 | AC-US-0007-02 | a lap invalid by repositioning shows the reason "reposicionamento" | texto do motivo diferente |
| CHK-TEST-0010-09 | AC-US-0007-05 | a recon or training lap that stays valid shows no reason text | motivo exibido sem invalidação |
| CHK-TEST-0010-10 | AC-US-0008-01 | a recon or training result is identified in text as not official | texto "não oficial" ausente |
| CHK-TEST-0010-11 | AC-US-0009-02 | while the lap has no invalidation reason the state reads "válida em andamento" | estado diferente em `PAUSED` ou em inglês |
| CHK-TEST-0010-12 | AC-US-0009-03 | an invalid lap reads "inválida" with its reason, for every reason | motivo sem mapeamento |
| CHK-TEST-0010-13 | AC-US-0009-04 | every state and reason is conveyed by a non-empty text | estado comunicado só por cor |
| CHK-TEST-0010-14 | AC-US-0009-05 | a Portuguese browser language gives Portuguese state and reason | `pt-BR` resolvido para inglês |
| CHK-TEST-0010-15 | AC-US-0009-06 | an English browser language gives English state and reason | `en-US` resolvido para outro idioma |
| CHK-TEST-0010-16 | AC-US-0009-07 | a browser language other than Portuguese or English, or none, gives English | padrão diferente de inglês ou exceção com `undefined` |
| CHK-TEST-0010-17 | NFR-0007 | all twenty-four message keys exist with a non-empty text in both languages | chave sem tradução, número de chaves diferente das 24 de DES-0008 1.1.0 ou falta de `pauseAction`, `endTrainingAction`, `bestValidLap`, `sectorNoTime` (prova: M24) |
| CHK-TEST-0010-18 | AC-US-0003-09 | the paused text is shown only while paused and the state after resume is the state of the pause | texto de pausa que persiste ou estado alterado pela pausa |
| CHK-TEST-0010-19 | AC-US-0010-02, AC-US-0010-24, AC-US-0010-25 | a training result reads its total time, "válida" or "inválida" with the reason, and "não oficial", in both languages | tempo total, validade, motivo ou "não oficial" ausente ou com outro texto (prova: M29) |
| CHK-TEST-0010-20 | AC-US-0010-23 | a sector without time in a training result reads "—" and the others m:ss.mmm | setor sem tempo com outro texto (prova: M12, M24) |
| CHK-TEST-0010-21 | AC-US-0010-27 | a training result without sector times builds no sector line, only the total time and the validity | linha de setores montada sem `trainingSectorMs` (prova: M30) |
| CHK-TEST-0010-22 | AC-US-0010-04 | a training past its first second shows no countdown and no green signal, in any lap and in the pause | contagem ou sinal verde no início de cada volta do treino (prova: M31) |
| CHK-TEST-0010-23 | AC-US-0010-07, AC-US-0010-11 | a training lap reads "inválida · corte" once cut and "válida em andamento" when the next lap starts | motivo omitido no treino ou estado diferente na volta seguinte (prova: M32) |
| CHK-TEST-0010-24 | AC-US-0010-12, AC-US-0010-15, AC-US-0010-16 | the training labels read "pausar", "encerrar treino" and "melhor volta válida", and their English texts | rótulo diferente da tabela de DES-0008 ou sem tradução (prova: M25) |

A verificação 13 é a parte de `npm test` de NFR-0006 (estado por texto); a escala de cinza fica em E2E-09.
