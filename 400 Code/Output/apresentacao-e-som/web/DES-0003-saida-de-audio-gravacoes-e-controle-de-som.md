---
id: DES-0003
title: Saída de áudio — gravações do motor e do pneu e controle de som — implementação
feature: apresentacao-e-som
stage: code
status: draft
version: 1.0.0
sources: [FEAT-0003, FEAT-0004, FEAT-0005, API-0002, FLOW-0002, SCR-0001, REQ-FEAT-0003-01, REQ-FEAT-0003-02, REQ-FEAT-0003-03, REQ-FEAT-0003-04, REQ-FEAT-0003-05, REQ-FEAT-0003-06, REQ-FEAT-0003-07, REQ-FEAT-0003-08, REQ-FEAT-0003-09, REQ-FEAT-0003-10, REQ-FEAT-0003-11, REQ-FEAT-0003-12, REQ-FEAT-0004-01, REQ-FEAT-0004-02, REQ-FEAT-0004-05, REQ-FEAT-0004-06, REQ-FEAT-0004-07, REQ-FEAT-0005-03, REQ-FEAT-0005-04, REQ-FEAT-0005-05, REQ-FEAT-0005-11, REQ-FEAT-0005-12]
---

# DES-0003 — Saída de áudio e controle de som — implementação

`src/audio.ts` (alterado, 214 linhas), `src/main.ts` (alterado, 709 linhas), `src/rawImports.d.ts` (`:6-10`,
`declare module '*.mp3?inline'`). Nenhuma API de rede ou de armazenamento nos dois primeiros, por nenhum caminho; `src/main.ts` sem
`import(`.

## Realização por requisito

| Requisito | Arquivo e símbolo |
|---|---|
| REQ-FEAT-0003-10, REQ-FEAT-0004-06 | `src/main.ts:9-10` importações estáticas `./assets/engine-loop.mp3?inline` e `./assets/tire-screech.mp3?inline`; `:153` `void audio.loadRecordings({ engineLoopDataUrl, tireScreechDataUrl })`; `src/audio.ts` `decodeRecordingDataUrl` (`:34-42`, `atob`), `RaceAudio.loadRecordings` (`:73-77`) e `loadRecording` (`:78-89`): `new OfflineAudioContext(1, 1, 44100).decodeAudioData(bytes.buffer)`, `findLoopBounds` no canal 0, buffer e limites guardados |
| REQ-FEAT-0003-01 | `buildVoice` (`:90-102`): `AudioBufferSourceNode` com `loop`, `loopStart` e `loopEnd` de `findLoopBounds` (`:46-52`, `LOOP_SILENCE_THRESHOLD` 0,002 `:17`) → `GainNode` em 0 → `destination`, um `start()` e nenhum `stop()`; rampa de subida de `SOUND_FADE_IN_MS` em `applyGain` (`:158-174`) |
| REQ-FEAT-0003-02 | `apply` (`:137-155`): `playbackRate.setTargetAtTime(enginePitchRatio, t, 0.08)` só quando a razão muda |
| REQ-FEAT-0003-03, -04, -05, -06; REQ-FEAT-0004-01, -02 | `applyGain`: `cancelScheduledValues(t)`, `setValueAtTime(valor atual, t)`, `linearRampToValueAtTime(alvo, t + 10 ms ou 80 ms)`, só quando o alvo muda; `src/main.ts` `refreshSound` no quadro (`:652`) e na aceitação de pausa (`:202`), retomada (`:208`) e reposicionamento (`:216`, com `repositionAcceptedAtMs` em `:215`) |
| REQ-FEAT-0003-07, REQ-FEAT-0004-05 | `applyGain` com o som desligado (`:161-165`): `cancelScheduledValues(t)`, `setValueAtTime(0, t)` |
| REQ-FEAT-0003-08, -09 | `RaceAudio.enabled` privado, falso (`:65`); `setSoundOn` (`:105-123`) é o único que o muda, ignora o que não é booleano e devolve a saída; `getSoundOutput` (`:125-127`); `src/main.ts:382-386` é a única chamada: `audio.setSoundOn(!audio.getSoundOutput().soundOn)`, rótulo e `aria-pressed` de `output.soundOn`, sem `try` e sem aviso |
| REQ-FEAT-0003-11 | `ENGINE_SOUND` `{source: 'recording', peakGain: ENGINE_GAIN_FULL_NORM}` (`:11`); `SoundSignal.source` ganha `'recording'` (`:10`); `ENGINE_GAIN_FLOOR`, o oscilador do motor, `toggle()` e `update()` retirados; `createOscillator` só em `reward` (`:180`) |
| REQ-FEAT-0003-12, REQ-FEAT-0004-07 | `loadRecording`: sem `OfflineAudioContext` ou `atob` → aviso `unsupported`; texto malformado, bytes que não decodificam ou exceção → aviso `decode`; uma gravação não afeta a outra; `setSoundOn`: `new AudioContext()` que lança ou não existe → `contextFailed`, aviso `audio-unavailable`, `soundOn` muda como pedido; disponibilidade em `apply` (`:138-143`): buffer guardado, `AudioContext` existente e contexto não falho |
| REQ-FEAT-0005-03, -04, -05 | nenhum pedido: os bytes vêm do texto embutido; uma chamada repetida de `loadRecordings` devolve as mesmas promessas (`loads`, `:68`, `:74-75`), sem nova tentativa nem prazo |
| REQ-FEAT-0005-11, -12 | `CURB_SOUND` (`:14`), `CURB_ATTACK_S` (`:15`), `whiteNoise` (`:22-30`), `soundOn()` (`:129-131`), `reward` (`:175-191`) e `curb` (`:193-213`) com o mesmo texto de antes; `src/main.ts:589` (`soundOn: audio.soundOn()`) e `:593` (`audio.curb()`) inalteradas |

## `src/main.ts`

| Ponto | Linha |
|---|---|
| importa o tipo `SoundReading` e as duas gravações | `:6`, `:9-10` |
| `loadRecordings` na avaliação do módulo; `stepThrottleNorm`, `laidSegment`, `repositionAcceptedAtMs` | `:153`, `:157-158` |
| `emitPause`, `emitResume`, `emitReposition` chamam `refreshSound(performance.now())` quando o comando é aceito | `:198-217` |
| `refreshSound(nowMs)`: `getLapState`, `getHandlingTelemetry(lap?.kart, setupRef)`, `getTrackContact(lap.kart, lap.environment, lap.config)`; `rearOnAsphalt` pelos índices 2 e 3 de `wheelSurfaces` contra `'ASPHALT'`; `tireMarkingAsphalt: laidSegment && rearOnAsphalt` | `:219-233` |
| `stepThrottleNorm = 0` no início de uma volta (`beginLap`) | `:349` |
| `stepThrottleNorm = input.throttle` depois de cada `stepLap` | `:583` |
| `skidIndexBeforeMarks` antes do bloco de marca; `laidSegment = skidIndex !== skidIndexBeforeMarks` e `refreshSound(now)` depois dele | `:617`, `:651-652` |

O bloco de marca de pneu (`:618-648`) não recebeu linha alguma. `audio.update(...)` e a variável `running`, que só ele lia, saíram.

## Escolhas desta etapa dentro do projeto

- `laidSegment` é variável de módulo, escrita pelo quadro logo depois do bloco. `emitReposition` a põe em falso antes de avaliar:
  nesse instante nenhum bloco rodou, e o kart reposicionado volta com `simStepCount` 0, que é leitura nova; sem isso o valor do
  último quadro passaria por marca. Pausa e retomada não mudam `simStepCount`, e a decisão ignora o valor.
- `findLoopBounds` devolve a posição da primeira e a da última amostra audível, isto é, `índice / sampleRateHz` nas duas
  (a letra do projeto); sem amostra audível, `{0, amostras / sampleRateHz}`.
- `decodeRecordingDataUrl` aceita `data:<qualquer coisa sem vírgula>;base64,<carga>` com a carga só de caracteres de base 64 e até
  dois `=`; o resto decide `atob`. Devolve `Uint8Array<ArrayBuffer>`, subtipo do `Uint8Array` do projeto, porque `decodeAudioData`
  exige `ArrayBuffer`.
- Quando uma gravação termina de decodificar, a decisão é reavaliada com a última leitura (`apply`), para que
  `getSoundOutput()` mostre a disponibilidade nova sem esperar um quadro.
- Som desligado com uma descida de 80 ms ainda em curso: `applyGain` corta na hora (`rampEndS`, `:162`), embora o alvo já fosse
  0. É a linha "ganho para 0 com `soundOn` falso — silêncio a partir da ação" do projeto aplicada também a esse caso; com o ganho
  já assentado em 0, nada é agendado.
- `engineGainNorm` e `tireGainNorm` são entregues ao `GainNode` como estão (0,35 a 0,70 e 0,50). O volume percebido é do roteiro
  E2E-06.
