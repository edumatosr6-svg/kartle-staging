---
id: DES-0002
title: Decisão do estado do som, do motor e do pneu — implementação
feature: apresentacao-e-som
stage: code
status: draft
version: 1.0.0
sources: [FEAT-0003, FEAT-0004, API-0002, RULE-0001, RULE-0002, REQ-FEAT-0003-01, REQ-FEAT-0003-02, REQ-FEAT-0003-03, REQ-FEAT-0003-04, REQ-FEAT-0003-05, REQ-FEAT-0003-06, REQ-FEAT-0003-07, REQ-FEAT-0003-08, REQ-FEAT-0003-09, REQ-FEAT-0003-12, REQ-FEAT-0004-01, REQ-FEAT-0004-02, REQ-FEAT-0004-03, REQ-FEAT-0004-04, REQ-FEAT-0004-05, REQ-FEAT-0004-07]
---

# DES-0002 — Decisão do estado do som, do motor e do pneu — implementação

`src/soundOutput.ts`, novo, aplicação pura (79 linhas): importa só o tipo `LapPhase` de `./lap` (`:3`); sem DOM, Web Audio, relógio
ou sorteio. Tipos `EngineSoundState`, `TireSoundState`, `SoundOutput` (os 8 campos de API-0002), `SoundReading`,
`SoundDecisionInput`, `SoundDecisionState` (`:5-20`), com os nomes e as formas do projeto.

## Realização por requisito

| Requisito | Arquivo e símbolo |
|---|---|
| REQ-FEAT-0003-01 | `decideSoundOutput` (`src/soundOutput.ts:46-79`): `enginePlaying` (`:63`) = som ligado, gravação disponível, `lapPhase` `RUNNING`, há `stepReading`, sem reposicionamento em execução; `engineGainNorm` = `ENGINE_GAIN_IDLE_NORM` 0,35 + 0,35 × `throttleNorm` (`:73`), maior que 0 com o kart parado |
| REQ-FEAT-0003-02 | `enginePitchRatio` (`:70-72`): 0,8 + 1,2 × min(`speedMps` / 32, 1), só pela velocidade; `ENGINE_PITCH_IDLE_RATIO`, `ENGINE_PITCH_TOP_RATIO`, `ENGINE_PITCH_TOP_SPEED_MPS` (`:22-25`); fora de `ENGINE_PLAYING` guarda o último valor, inicial 1 |
| REQ-FEAT-0003-03 | `ENGINE_GAIN_IDLE_NORM`, `ENGINE_GAIN_FULL_NORM` (`:26-27`); a intensidade só pelo acelerador (`:73`) |
| REQ-FEAT-0003-04, -05 | `lapPhase` diferente de `RUNNING` → `ENGINE_SILENT`, ganho 0 na mesma avaliação (`:63`, `:73`) |
| REQ-FEAT-0003-06 | `repositioning` (`:61-62`): `repositionAcceptedAtMs` presente, `nowMs` finito e `nowMs < repositionAcceptedAtMs + SOUND_FADE_OUT_MS` (80 ms, `:31`); função do instante, não de borda |
| REQ-FEAT-0003-07, REQ-FEAT-0004-05 | `soundOn` falso → os dois estados em silêncio, ganhos 0 (`:63-64`) |
| REQ-FEAT-0003-08, -09 | `initialSoundDecision` (`:33-41`): `soundOn` falso, `ENGINE_SILENT`, `TIRE_SILENT`, razão 1, ganhos 0; a função só copia o `soundOn` recebido, nunca o liga |
| REQ-FEAT-0003-12, REQ-FEAT-0004-07 | `engineSoundAvailable` ou `tireSoundAvailable` falso → silêncio do som correspondente (`:63-64`); a função não lança |
| REQ-FEAT-0004-01, -02, -03, -04 | `tirePlaying` (`:64-65`): há `stepReading` com `tireMarkingAsphalt`, e `lapPhase` presente e diferente de `PAUSED` e de `ENDED`; `tireGainNorm` = `TIRE_GAIN_NORM` 0,50 (`:28`, `:75`) ou 0; depende só desse campo, não da velocidade |

## Leitura do passo

`:47-58`: sem `simStepCount` não há `stepReading`; `simStepCount` diferente do guardado troca a leitura, com `speedMps` limitado a
0 ou mais (não finito vale 0), `throttleNorm` limitado a 0–1 (não finito vale 0) e `tireMarkingAsphalt` verdadeiro só com `true`;
`simStepCount` igual mantém a leitura e ignora os três valores. Quando nem a leitura nem campo algum da saída mudam, a função devolve
o próprio estado recebido (`:77`): a mesma entrada sobre o mesmo estado dá o mesmo estado.
