---
id: DES-0009
title: Retorno da zebra — vibração em web-mobile e som em web-desktop — implementação
feature: pista-kart-park
stage: code
status: draft
version: 1.0.0
sources: [RULE-0004, SCR-0003, FLOW-0002, FEAT-0005, REQ-FEAT-0005-10, REQ-FEAT-0005-11, REQ-FEAT-0005-12, REQ-FEAT-0005-13, REQ-FEAT-0005-14, REQ-FEAT-0005-15, REQ-FEAT-0005-16, REQ-FEAT-0005-17, REQ-FEAT-0005-18, REQ-FEAT-0005-19]
---

# DES-0009 — Retorno da zebra — implementação

`src/curbFeedback.ts`, aplicação pura, novo (37 linhas; importa só o tipo `TrackContact`); `src/audio.ts` alterado (44 → 93
linhas); `src/main.ts` no laço de passos (`:507-517`). O retorno nunca volta para a simulação.

## Realização por requisito

| Requisito | Arquivo e símbolo |
|---|---|
| REQ-FEAT-0005-10, -11; RULE-0004 | `src/curbFeedback.ts` `CURB_PULSE_MS` 20, `CURB_PULSE_INTERVAL_STEPS` 30 (`:5-7`); `decideCurbFeedback` (`:23-36`): `pulse` só com `web-mobile`, vibração disponível, `curbWheelCount > 0` e 30 passos desde o último início; `lastHandledStep` deduplica; `src/main.ts:515` `navigator.vibrate(CURB_PULSE_MS)` |
| REQ-FEAT-0005-12, -13, -14, -17 | `CURB_SOUND_REPEAT_STEPS` 12 (`:9`); `sound` só com `soundOn`, `curbWheelCount > 0` e 12 passos desde a última repetição, nos dois canais (`:27-28`); `src/main.ts:516` `audio.curb()`; `RaceAudio.soundOn()` (`src/audio.ts:45-47`: `enabled` e contexto `running`) |
| REQ-FEAT-0005-15 | `src/audio.ts` `SoundSignal`, `ENGINE_SOUND` (`triangle`, 0,045), `REWARD_SOUND` (`sine`, 180 ms, 0,035), `CURB_SOUND` (`noise`, 160 Hz, 60 ms, 0,05) (`:4-8`); `toggle` e `update` constroem o motor de `ENGINE_SOUND` (`:29-53`), `reward` de `REWARD_SOUND` (`:54-70`), `curb` de `CURB_SOUND` (`:72-92`: fonte de buffer com ruído branco de semente fixa `whiteNoise` `:13-21`, filtro `lowpass` 160 Hz, ataque 5 ms até 0,05, queda exponencial até 60 ms; nenhum nó sem contexto ou com `enabled` falso); só `curb()` cria fonte de buffer e filtro; `audio.curb(` aparece em `src/main.ts` só no laço de passos |
| REQ-FEAT-0005-16 | `channel` = `web-mobile` só quando `coarsePointer.matches` (`src/main.ts:512`); em `web-desktop` `pulse` é falso por construção |
| REQ-FEAT-0005-18 | a decisão roda só depois de `stepLap` ter avançado um passo (`:506-508`); com a volta suspensa `simStepCount` não avança e `lastHandledStep` barra a repetição |
| REQ-FEAT-0005-19 | `vibrationAvailable = typeof navigator.vibrate === 'function'` (`:178`); o retorno `false` de `vibrate` é ignorado; nada é exibido |
| SCR-0003; FLOW-0002; FEAT-0005 | estado zerado em `chooseTrack` (`:235`) e em `beginLap` (`:300`); nenhuma configuração além do controle `#sound` existente |

As provas com a sequência de contato gravada e com o `AudioContext` de substituição (`tests/pista-kart-park-feedback.test.ts`) e a
prova auditiva E2E-04 são do estágio de testes.
