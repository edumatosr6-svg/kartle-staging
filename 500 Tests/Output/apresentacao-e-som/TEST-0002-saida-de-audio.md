---
id: TEST-0002
title: Saída de áudio — gravações decodificadas do texto embutido e tocadas em repetição, rampas agendadas, comando do som e som indisponível, sobre contextos de substituição
feature: apresentacao-e-som
stage: test
status: draft
version: 1.0.0
sources: [AC-US-0003-01, AC-US-0003-02, AC-US-0003-04, AC-US-0003-08, AC-US-0003-09, AC-US-0003-10, AC-US-0004-02, AC-US-0004-05, AC-US-0004-06]
---

# TEST-0002 — Saída de áudio

| | |
|---|---|
| Arquivo | `tests/apresentacao-e-som-sound.test.ts` (estratégia: unitário, integração e contrato de API-0002) |
| Nível | unitário (`findLoopBounds`, `decodeRecordingDataUrl`); integração (`RaceAudio` sobre `AudioContext` e `OfflineAudioContext` de substituição postos em `globalThis`); contrato (`getSoundOutput`, `setSoundOn`) |
| Interface exercitada | `RaceAudio` (`loadRecordings`, `setSoundOn`, `getSoundOutput`, `refresh`, `soundOn`, `curb`, `reward`), `findLoopBounds`, `decodeRecordingDataUrl`, `LOOP_SILENCE_THRESHOLD` (`src/audio.ts`) |
| Fixtures | `tests/helpers/soundContext.ts`: `fakeAudio` (registra cada nó criado e cada valor agendado em cada `AudioParam`; `currentTime` é campo que o teste escreve; decodificador nos modos `ok`, `reject` e `never`), `withAudioGlobals` (instala, restaura e recolhe `console.warn`), `dataUrlOf` (o texto `data:` em base 64 montado dos bytes de `src/assets/`, a forma que o Vite embute) |

Nenhum teste substitui nem chama a rede. O contexto de substituição não toca som: o que se afirma é o que foi pedido à saída de áudio — o que se ouve fica nos roteiros E2E-06 e E2E-07.

## Verificações

| Check | Decide | Teste | O que a faria falhar |
|---|---|---|---|
| CHK-TEST-0002-01 | AC-US-0003-01 | the loop bounds of a decoded recording are its first and last sample above the silence threshold, so the padding at both ends stays out of the repeat | limites que incluem o silêncio de borda; amostra abaixo do limiar contada como som; amostra negativa acima do limiar ignorada; buffer todo em silêncio sem os limites `0` e duração |
| CHK-TEST-0002-02 | AC-US-0003-10 | the embedded text of a recording decodes to exactly the bytes of the file, and a text of another form or with a payload that is not base 64 gives no bytes | bytes diferentes dos do arquivo; endereço, texto vazio ou `data:` sem base 64 aceitos; carga inválida aceita; exceção |
| CHK-TEST-0002-03 | AC-US-0003-08 | a new audio output reads sound off, both sounds silent and gains 0, with exactly the 8 fields of the contract, and reading it changes nothing | `soundOn` inicial verdadeiro; campo a mais ou a menos; leitura que muda estado; `setSoundOn` devolvendo outra forma |
| CHK-TEST-0002-04 | AC-US-0003-10 | the engine sound is the recording of src/assets/engine-loop.mp3: the decoder receives exactly its bytes and the engine source loops the buffer it gave, started once and never stopped | bytes entregues ao decodificador diferentes dos do arquivo; fonte com outro buffer; `loop` falso (M06); limites de repetição fora das bordas do som; segundo `start`; algum `stop`; terceira fonte ou segunda decodificação |
| CHK-TEST-0002-05 | AC-US-0003-10 | no synthesized engine tone exists: turning the sound on and running a lap creates no oscillator and no filter | oscilador ou filtro criado ao ligar o som ou ao rodar a volta (M08); grafo diferente de duas fontes de buffer com um ganho cada |
| CHK-TEST-0002-06 | AC-US-0004-06 | the tyre sound is the recording of src/assets/tire-screech.mp3: the decoder receives exactly its bytes and the tyre source loops the buffer it gave | bytes diferentes; pneu tocando o buffer do motor; `loop` falso (M06); `start` repetido; `stop` |
| CHK-TEST-0002-07 | AC-US-0003-01 | when the lap runs with the sound on, the engine gain is ramped to a value above 0 within 50 ms, to exactly the gain the output reads | rampa a 0 com o kart parado (M01); alvo diferente de `engineGainNorm`; subida acima de 50 ms ou diferente de 10 ms; acelerador novo sem rampa nova |
| CHK-TEST-0002-08 | AC-US-0003-02 | the playback rate asked of the engine source is the pitch ratio of the output, higher at 20 m/s than at 5 m/s | `playbackRate` pedida diferente de `enginePitchRatio`; taxa a 20 m/s não maior que a 5 m/s (M04); tom do pneu alterado pela velocidade |
| CHK-TEST-0002-09 | AC-US-0003-04 | when the engine goes silent with the sound on, its gain is ramped to exactly 0 in 80 ms, inside the 200 ms deadline | silêncio sem rampa linear; alvo diferente de 0; descida acima de 200 ms (M10: 250 ms) ou diferente de 80 ms |
| CHK-TEST-0002-10 | AC-US-0004-02 | while the kart marks the asphalt the tyre gain is ramped above 0, and when it stops marking the gain is ramped to exactly 0 in 80 ms | pneu agendado sem marca; subida ausente ou diferente de `tireGainNorm`; descida que não chega a 0 ou passa de 200 ms (M10) |
| CHK-TEST-0002-11 | AC-US-0004-05 | turning the sound off during a slide cuts the tyre gain to 0 at the instant of the action, with no ramp | rampa em vez de corte (M07); corte em outro instante; valor diferente de 0; som de pneu agendado com o som desligado |
| CHK-TEST-0002-12 | AC-US-0003-09 | the sound command carries the final state: a value that is not a boolean is ignored, and asking for the state the sound is already in creates, restarts and schedules nothing | `undefined`, `1` ou `'true'` ligando o som (M09) ou `0`, `null` desligando; contexto criado por pedido ignorado; nó, `start` ou agendamento novo ao repetir o pedido ou a leitura; ordem de dois pedidos não respeitada |
| CHK-TEST-0002-13 | AC-US-0003-10 | loading the recordings again decodes nothing again and builds no second source | segunda decodificação; nó novo; fonte reiniciada |
| CHK-TEST-0002-14 | AC-US-0003-10 | turning the sound on before the decoding ended still plays the recording: the source is built when its decoding ends | exceção ao ligar antes da carga; disponibilidade verdadeira antes de decodificar; fonte nunca criada depois; motor que não toca para a volta já em andamento |
| CHK-TEST-0002-15 | AC-US-0003-10 | an embedded engine text that is not a base 64 data text leaves the engine sound unavailable and silent; nothing throws and the load does not reject | `loadRecordings` rejeitando; `setSoundOn(true)` lançando; `soundOn` não mudando; disponibilidade verdadeira; ganho maior que 0; texto embutido num aviso |
| CHK-TEST-0002-16 | AC-US-0003-10 | engine bytes the decoder rejects leave the engine sound unavailable and silent; nothing throws and the load does not reject | rejeição do decodificador propagada (M11); o mesmo da -15 |
| CHK-TEST-0002-17 | AC-US-0003-10 | a decoding that never ends leaves the engine sound unavailable and silent, with no timer and no retry | disponibilidade verdadeira sem buffer; nova tentativa de decodificação; exceção |
| CHK-TEST-0002-18 | AC-US-0003-10 | without an offline decoder in the browser the engine sound is unavailable and silent; nothing throws and the load does not reject | exceção por `OfflineAudioContext` ausente; rejeição; disponibilidade verdadeira |
| CHK-TEST-0002-19 | AC-US-0003-10 | without an audio output in the browser both sounds are unavailable, the sound state still changes as asked, and the reading the curb sound uses stays off | exceção sem `AudioContext` ou com construtor que lança; `soundOn` não seguindo o pedido; disponibilidade verdadeira; `RaceAudio.soundOn()` verdadeiro sem contexto; `curb()` ou `reward()` lançando |
| CHK-TEST-0002-20 | AC-US-0004-06 | with only the tyre text malformed the tyre sound is unavailable and silent while the kart marks, and the engine plays | falha do pneu derrubando o motor; pneu disponível ou tocando; rejeição; segunda fonte criada |

"Tempo esgotado ao carregar o som na abertura" não tem caminho próprio (DES-0003): as gravações chegam com o JS. A decodificação que nunca termina (-17) é o caso alcançável. As verificações -15 a -19 decidem o caso anormal de US-0003 ("arquivo de som ausente, ilegível, ou navegador sem áudio"), e a -20 o de US-0004; estão registradas sob o critério de origem da gravação por ser o que a indisponibilidade nega.
