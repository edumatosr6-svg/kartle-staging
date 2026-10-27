---
id: TEST-0008
title: Retorno da zebra — pulsos de 20 ms a cada 30 passos em web-mobile, som a cada 12 passos em web-desktop, nada sem roda na zebra nem em passo já tratado, som da zebra distinto construído num AudioContext de substituição
feature: pista-kart-park
stage: test
status: draft
version: 1.0.0
sources: [AC-US-0005-07, AC-US-0005-08, AC-US-0005-09, AC-US-0005-10, AC-US-0005-11, AC-US-0005-12]
---

# TEST-0008 — Retorno da zebra

| | |
|---|---|
| Arquivo | `tests/pista-kart-park-feedback.test.ts` (estratégia: `feedback`) |
| Nível | unitário (`decideCurbFeedback` sobre sequências sintéticas de pares `(simStepCount, curbWheelCount)`), integração (a sequência de contato de uma volta real sobre a zebra direita de 25,2 m a 7 m/s; `RaceAudio` sobre uma classe `AudioContext` instalada em `globalThis` que registra cada nó criado) e texto (`src/main.ts` sem comentários) |
| Interface exercitada | `decideCurbFeedback`, `initialCurbFeedback`, `CURB_PULSE_MS`, `CURB_PULSE_INTERVAL_STEPS`, `CURB_SOUND_REPEAT_STEPS` (`src/curbFeedback.ts`); `RaceAudio`, `ENGINE_SOUND`, `REWARD_SOUND`, `CURB_SOUND` (`src/audio.ts`); `getTrackContact`, `STEP` |
| Fixtures | `onCurb(from, to, count)`/`offCurb`; `record(pairs, opções)`; `realRun` (pares lidos por `getTrackContact` a cada passo do trecho de zebra); `FakeContext` com `createOscillator`, `createGain`, `createBiquadFilter`, `createBufferSource`, `createBuffer`, `resume`, `state` `running`; restauração de `globalThis.AudioContext` no fim |

## Verificações

| Check | Decide | Teste | O que a faria falhar |
|---|---|---|---|
| CHK-TEST-0008-01 | AC-US-0005-07 | on web-mobile with vibration available, a wheel on the curb starts a 20 ms pulse every 30 steps, which is every 250 ms of simulated time | `CURB_PULSE_MS` ≠ 20, 30 × `STEP` ≠ 0,25 s, pulsos fora de {0, 30, 60, …} em 200 passos na zebra (mutação D), primeiro pulso fora do primeiro passo com roda na zebra, intervalo ≠ 30 em 1 200 passos |
| CHK-TEST-0008-02 | AC-US-0005-08 | without a wheel on the curb no new pulse starts, and a step already handled (the lap paused) starts nothing | pulso com `curbWheelCount` 0, pulso novo depois de sair da zebra, retorno à zebra sem pulso, mesmo `simStepCount` apresentado de novo com pulso, som ou estado novo, passo anterior com pulso |
| CHK-TEST-0008-03 | AC-US-0005-09 | on web-desktop with the sound on, a wheel on the curb repeats the curb sound every 12 steps (100 ms), and never vibrates | 12 × `STEP` ≠ 0,1 s, repetições fora de {0, 12, …, 96}, pulso em `web-desktop` com vibração disponível, ≠ 100 repetições em 1 200 passos, intervalo ≠ 12 |
| CHK-TEST-0008-04 | AC-US-0005-10 | without a wheel on the curb no new repeat of the sound starts | repetição com `curbWheelCount` 0, repetição nova depois de sair da zebra, retorno sem repetição |
| CHK-TEST-0008-05 | AC-US-0005-11 | with the sound off riding the curb produces no sound; on web-mobile the sound follows the same rule and a missing vibration only removes the pulses | repetição com `soundOn` falso, repetições/pulsos em `web-mobile` fora das regras (mutação D), pulso sem `navigator.vibrate`, repetições diferentes com e sem vibração (mutação J) |
| CHK-TEST-0008-06 | AC-US-0005-07, AC-US-0005-09 | over the contact sequence of a real curb run, every pulse and repeat starts with a wheel on the curb, at the declared intervals, several times | corrida com menos de 121 passos na zebra (mutação I), pares fora de ordem, pulso ou repetição num passo sem roda na zebra, intervalos abaixo de 30/12, menos de 4 pulsos ou 10 repetições, passo na zebra 30 ou mais passos depois do último pulso sem pulsar (mutação D) |
| CHK-TEST-0008-07 | AC-US-0005-12 | the curb sound is a filtered noise burst unlike the engine (triangle) and the reward (sine), built only with the sound on | descritores com a mesma `source`, zebra não `noise`, nó criado sem contexto, motor com ≠ 1 oscilador ou de outro tipo, `curb()` criando algo diferente de fonte de buffer + filtro `lowpass` em 160 Hz + ganho, recompensa com fonte de buffer ou filtro ou osciladores de outro tipo, `curb()` com som desligado criando nó, buffer de ruído com outro tamanho |
| CHK-TEST-0008-08 | AC-US-0005-09, AC-US-0005-07 | the application plays the curb sound and vibrates only from the per-step decision inside the step loop | `audio.curb(` ou `navigator.vibrate(` em mais de um lugar ou sem a guarda `feedback.sound`/`feedback.pulse`, contato lido de outro estado, decisão fora do laço após `stepLap`, canal/vibração/som passados com outros nomes, `vibrationAvailable` presumido, estado do retorno não zerado por sessão e por volta |
