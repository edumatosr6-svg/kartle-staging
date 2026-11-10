---
id: DES-0003
title: Saída de áudio — gravações do motor e do pneu e controle de som
feature: apresentacao-e-som
stage: dspec
status: validated
version: 1.1.0
sources: [FEAT-0003, FEAT-0004, FEAT-0005, API-0002, FLOW-0002, SCR-0001, REQ-FEAT-0003-01, REQ-FEAT-0003-02, REQ-FEAT-0003-03, REQ-FEAT-0003-04, REQ-FEAT-0003-05, REQ-FEAT-0003-06, REQ-FEAT-0003-07, REQ-FEAT-0003-08, REQ-FEAT-0003-09, REQ-FEAT-0003-10, REQ-FEAT-0003-11, REQ-FEAT-0003-12, REQ-FEAT-0004-01, REQ-FEAT-0004-02, REQ-FEAT-0004-05, REQ-FEAT-0004-06, REQ-FEAT-0004-07, REQ-FEAT-0005-03, REQ-FEAT-0005-04, REQ-FEAT-0005-05, REQ-FEAT-0005-11, REQ-FEAT-0005-12]
---

# DES-0003 — Saída de áudio: gravações do motor e do pneu e controle de som

## Realiza

- As operações `getSoundOutput` e `setSoundOn` de API-0002 e o controle de som de SCR-0001
  (REQ-FEAT-0003-07, -08, -09; AC-US-0003-07, -08, -09).
- O motor tocado da gravação `engine-loop.mp3`, sem silêncio maior que 50 ms, com o tom e a intensidade
  decididos em [DES-0002](DES-0002-decisao-do-estado-do-som-motor-e-pneu.md), e silenciado em até 200 ms
  (REQ-FEAT-0003-01 a -06, -10; AC-US-0003-01 a -06, -10).
- A retirada do tom sintetizado do motor (REQ-FEAT-0003-11).
- O pneu tocado da gravação `tire-screech.mp3` e silenciado em até 200 ms (REQ-FEAT-0004-01, -02, -05, -06;
  AC-US-0004-01, -02, -05, -06).
- Som ausente, ilegível ou navegador sem áudio: nenhum som, jogo igual (REQ-FEAT-0003-12, REQ-FEAT-0004-07).
- Nenhum pedido de rede depois de o jogo abrir e os sons tocando sem rede (REQ-FEAT-0005-03, -05): as duas
  gravações chegam embutidas no JS do download inicial e o código não faz pedido algum para buscá-las.
- As duas gravações dentro do download inicial, pela importação `?inline` de `src/main.ts`
  (REQ-FEAT-0005-04; as duas imagens são de [DES-0001](DES-0001-arquivos-entregues-e-declaracoes-da-pagina.md)).
- O som da zebra intocado e sem arquivo (REQ-FEAT-0005-11, -12).

## Posicionamento

Camada **aplicação**: `src/audio.ts` (alterado), `src/main.ts` (alterado), `src/rawImports.d.ts` (alterado).
Nenhum módulo novo: `RaceAudio` já é o dono da saída de áudio. Decisões de fundo:
[ADR-0001](../adr/ADR-0001-arquivos-versionados-e-pedidos-pelo-documento.md) (gravações embutidas no JS) e
[ADR-0002](../adr/ADR-0002-gravacoes-decodificadas-na-abertura-e-tocadas-por-web-audio.md).

## Interface

### `src/audio.ts`

| Símbolo | Assinatura | Descrição |
|---|---|---|
| `SoundSignal` | `{source: 'noise' \| 'triangle' \| 'sine' \| 'recording'; lowpassHz?: number; durationMs?: number; peakGain: number}` | `source` ganha `'recording'`: o sinal vem de uma gravação tocada por fonte de buffer |
| `ENGINE_SOUND` | `{source: 'recording', peakGain: ENGINE_GAIN_FULL_NORM}` | o motor deixa de ser `'triangle'` com pico 0,045 (`src/audio.ts:5`); `ENGINE_GAIN_FLOOR` (`:10`) é retirado |
| `REWARD_SOUND`, `CURB_SOUND`, `RaceAudio.reward()`, `RaceAudio.curb()`, `whiteNoise` | inalterados | nenhuma linha destes símbolos muda |
| `decodeRecordingDataUrl` | `(dataUrl: string) => Uint8Array \| undefined` | pura: os bytes de um texto `data:<tipo>;base64,<carga>`; `undefined` quando o texto não tem essa forma ou a carga não é base 64 válida. Usa `atob`; não lê rede |
| `LOOP_SILENCE_THRESHOLD` | `0.002` (amplitude, fração de fundo de escala) | abaixo disto uma amostra conta como silêncio de borda |
| `findLoopBounds` | `(samples: Float32Array, sampleRateHz: number) => {loopStartS: number; loopEndS: number}` (s) | pura: a posição da primeira e a da última amostra com módulo acima do limiar; sem nenhuma, `{0, duração}` |
| `RaceAudio.loadRecordings` | `(recordings: {engineLoopDataUrl: string; tireScreechDataUrl: string}) => Promise<void>` | decodifica as duas gravações embutidas, cada uma por conta própria; nunca rejeita; não faz pedido de rede |
| `RaceAudio.setSoundOn` | `(soundOn: boolean) => SoundOutput` | liga ou desliga; argumento que não é booleano é ignorado; devolve a saída depois do efeito; nunca lança |
| `RaceAudio.getSoundOutput` | `() => SoundOutput` | leitura pura da última saída decidida |
| `RaceAudio.refresh` | `(reading: SoundReading) => SoundOutput` | decide com `decideSoundOutput` e aplica aos nós; substitui `update(speed, throttle, active)` (`:48-53`) |
| `RaceAudio.soundOn` | `() => boolean` | inalterado (`:45-47`): ligado pelo Jogador **e** contexto de áudio rodando; é a leitura que o som da zebra já usa |
| `RaceAudio.toggle`, `RaceAudio.update`, campo público `enabled` | retirados | ver "Retirada", abaixo |

`getSoundOutput().soundOn` é o estado escolhido pelo Jogador, que é o que o controle mostra (SCR-0001). Com
áudio funcionando, os dois valores coincidem; num navegador sem saída de áudio, `getSoundOutput().soundOn`
segue o pedido (API-0002, Erros) e `RaceAudio.soundOn()` continua falso, de modo que nenhum som da zebra é
pedido — como hoje.

#### `loadRecordings`

Cada argumento é o texto `data:` em base 64 que o Vite pôs no JS para a importação `?inline` da gravação —
os bytes de `src/assets/engine-loop.mp3` e de `src/assets/tire-screech.mp3`, já em memória quando o módulo é
avaliado. Para cada gravação, sem que uma falha afete a outra:

1. `decodeRecordingDataUrl(dataUrl)`: os bytes da gravação. Nenhum pedido de rede: não há endereço a pedir.
2. `new OfflineAudioContext(1, 1, 44100).decodeAudioData(bytes.buffer)`.
3. `findLoopBounds` sobre o canal 0; o buffer e os limites ficam guardados.
4. Se o `AudioContext` já existe (o Jogador ligou o som antes de a decodificação terminar), o grafo dessa
   gravação é montado na hora.

Texto que não é `data:` em base 64, bytes que não decodificam, `atob` ou `OfflineAudioContext` inexistente:
a gravação fica ausente até a página ser recarregada. **Não há nova tentativa** e não há prazo: não existe
carregamento separado do JS. O caso "Tempo esgotado ao carregar o som na abertura" de FEAT-0003 coincide com
o JS não chegar, e então o jogo não abre (FLOW-0001); com o jogo aberto, as gravações já estão em memória.
Uma decodificação que nunca termina deixa a disponibilidade falsa, como um arquivo ausente, sem temporizador.

#### Nenhuma API de rede no texto do código

`src/audio.ts` e `src/main.ts` são lidos, como texto sem comentários, por duas verificações validadas que
este projeto não migra: CHK-TEST-0011-02 de `pista-kart-park` (`tests/pista-kart-park-layering.test.ts:58-66`,
sobre os dois arquivos) e CHK-TEST-0013-03 de `race-lap-validation`
(`tests/race-lap-validation-layering.test.ts:43-47`, sobre `src/main.ts`). Por isso:

- nenhum dos dois arquivos usa `fetch`, `XMLHttpRequest`, `WebSocket`, `localStorage`, `sessionStorage`,
  `indexedDB`, `navigator.sendBeacon` nem `EventSource` — nem por `globalThis`, `window` ou `self`, nem por
  nome montado em tempo de execução, nem por elemento `<audio>` ou `Audio` com endereço;
- nenhuma dessas palavras aparece solta no código dos dois arquivos, nem dentro de texto entre aspas (por
  exemplo num aviso de `console.warn`): a expressão das verificações lê o texto, não a chamada;
- `src/main.ts` não ganha `import(`: as duas gravações entram por importação estática, e
  `from './tracks/kart-park-v2.json?raw'` continua como está.

As duas verificações passam sem mudança, e passar nelas é condição de entrega deste item.

Disponibilidade: `engineSoundAvailable` é verdadeiro quando o buffer do motor existe, o navegador tem
`AudioContext` e a criação do contexto não falhou; o mesmo para `tireSoundAvailable`.

#### `setSoundOn`

- `soundOn` verdadeiro, primeira vez: cria o `AudioContext` (é o gesto do Jogador) e, para cada gravação
  disponível, o grafo `AudioBufferSourceNode` (`loop` verdadeiro, `loopStart` e `loopEnd` de
  `findLoopBounds`) → `GainNode` (ganho 0) → `destination`, e dá `start()` na fonte. Cada fonte é criada uma
  vez e nunca é parada: o silêncio é ganho 0, não fonte desligada. Se o construtor lançar, o contexto fica
  marcado como falho e as duas disponibilidades ficam falsas.
- `soundOn` verdadeiro, sempre: `context.resume()` sem esperar; a rejeição é absorvida.
- Guarda o estado, reavalia a decisão com a última leitura recebida e aplica a saída.
- Pedido para o estado em que o som já está: nada é criado, reiniciado nem reagendado.

Nenhum oscilador é criado para o motor em nenhum caminho (REQ-FEAT-0003-11); `createOscillator` continua
só em `reward()`.

#### Aplicação da saída aos nós

Só há agendamento quando o alvo muda em relação ao último aplicado.

| Mudança | Agendamento no `AudioParam` (t = `context.currentTime`) |
|---|---|
| `enginePitchRatio` | `playbackRate.setTargetAtTime(razão, t, 0.08)` na fonte do motor |
| ganho de 0 para maior que 0, ou entre dois valores maiores que 0 | `cancelScheduledValues(t)`, `setValueAtTime(valor atual, t)`, `linearRampToValueAtTime(alvo, t + SOUND_FADE_IN_MS / 1000)` |
| ganho para 0 com `soundOn` verdadeiro | o mesmo, com `linearRampToValueAtTime(0, t + SOUND_FADE_OUT_MS / 1000)` |
| ganho para 0 com `soundOn` falso | `cancelScheduledValues(t)`, `setValueAtTime(0, t)` — silêncio a partir da ação |

A rampa linear chega exatamente a 0; o `setTargetAtTime` de hoje (`:41`, `:52`) só se aproxima.

### `src/main.ts`

| Ponto | Hoje | Passa a ser |
|---|---|---|
| importações | — | estáticas: `engineLoopDataUrl` de `./assets/engine-loop.mp3?inline` e `tireScreechDataUrl` de `./assets/tire-screech.mp3?inline` |
| depois de `new RaceAudio()` (`:147`) | — | `void audio.loadRecordings({ engineLoopDataUrl, tireScreechDataUrl })`, na avaliação do módulo |
| controle `#sound` (`:347-353`) | `await audio.toggle()` dentro de `try`, com o aviso "Áudio indisponível neste navegador." no `catch` | `const output = audio.setSoundOn(!audio.getSoundOutput().soundOn)`; o rótulo ("Som ligado" ou "Som desligado") e `aria-pressed` vêm de `output.soundOn`; sem `try` e sem aviso, porque `setSoundOn` não lança e SCR-0001 não pede aviso |
| laço de passos (`:548-561`) | — | uma variável guarda `input.throttle` do `Input` entregue ao último `stepLap` |
| `audio.update(state.speed, state.throttle, running)` (`:584`) | antes do bloco de marca de pneu | retirado; no lugar, `refreshSound(now)` **depois** do bloco de marca de pneu (`:586-615`) |
| `emitPause` (`:187-191`), `emitResume`, `emitReposition` (`:197-200`) | — | quando o comando é aceito, `refreshSound(performance.now())`; em `emitReposition`, antes disso, guarda o instante como `repositionAcceptedAtMs` |
| leitura `audio.soundOn()` do som da zebra (`:555`) e `audio.curb()` (`:559`) | — | inalteradas |

`refreshSound(nowMs)` monta a `SoundReading` e chama `audio.refresh`:

| Campo | De onde vem |
|---|---|
| `lapPhase` | `getLapState(lap)`; ausente quando devolve um código |
| `simStepCount`, `speedMps` | `getHandlingTelemetry(lap.kart, setupRef)`; `simStepCount` ausente quando devolve um código |
| `throttleNorm` | a variável do laço de passos; 0 enquanto nenhum passo avançou na volta |
| `repositionAcceptedAtMs` | o instante guardado por `emitReposition` |
| `tireMarkingAsphalt` | `laidSegment && rearOnAsphalt`, abaixo |

Situação de marca de pneu, sem editar o bloco de `modelo-kart-01`:

- `laidSegment`: `skidIndex` lido logo antes do bloco é diferente de `skidIndex` lido logo depois. O bloco só
  avança `skidIndex` (`:608`) quando desenha um trecho novo; logo, `laidSegment` é verdadeiro exatamente nos
  quadros em que a cena desenhou marca — a situação de marca de pneu, vista na tela.
- `rearOnAsphalt`: `getTrackContact(lap.kart, lap.environment, lap.config)` devolve `wheelSurfaces` e ao menos
  uma das duas rodas traseiras (índices 2 e 3, a ordem de `wheelPositions`, `src/physics.ts:140-146`) está em
  `'ASPHALT'`.

O bloco não recebe nenhuma linha nova: o teste de `modelo-kart-01` que o extrai e executa (CHK-TEST-0004-06)
continua valendo sem mudança.

### `src/rawImports.d.ts`

Ganha `declare module '*.mp3?inline' { const dataUrl: string; export default dataUrl; }`. A declaração de
`*.json?raw` não muda.

## Prazos

| Requisito | Caminho | Pior caso |
|---|---|---|
| motor tocando em até 50 ms depois de ligar o som | `setSoundOn` aplica na própria ação | 10 ms |
| motor tocando em até 50 ms depois de a volta passar a `RUNNING` | a passagem acontece no laço de passos do quadro; `refreshSound` roda no mesmo quadro | 10 ms |
| motor de volta depois do reposicionamento | o primeiro quadro depois dos 80 ms | um quadro (33 ms a 30 fps) + 10 ms = 43 ms |
| nenhum silêncio maior que 50 ms na repetição | `loop` com `loopStart` e `loopEnd` nas bordas do som; a fonte nunca para | 0 ms de silêncio de borda |
| motor em silêncio em até 200 ms: pausa, reposicionamento | o comando aceito chama `refreshSound` na hora | 80 ms |
| motor em silêncio em até 200 ms: resultado | `ENDED` nasce no laço de passos; `refreshSound` no mesmo quadro | 80 ms |
| pneu em silêncio em até 200 ms | o passo fora da situação é lido no quadro que o avançou | 80 ms |
| som desligado | `setValueAtTime(0, t)` na ação | imediato |

## Colaboradores

- Chama: `decideSoundOutput` (`src/soundOutput.ts`), Web Audio e `atob`. Não chama a rede.
- É chamado por: `src/main.ts` (manipulador do controle, quadro, comandos de pausa, retomada e
  reposicionamento).
- `src/main.ts` lê `getLapState`, `getHandlingTelemetry`, `getTrackContact` e `skidIndex`; nunca chama
  `stepLap` por causa do som nem muda `lap`. Nenhum módulo da simulação importa `src/audio.ts` (I2).

## Estado e concorrência

O estado é o de [DM-0001](../data/DM-0001-registro-de-origem-dos-arquivos-e-estado-do-som.md), em memória.
`setSoundOn` carrega o estado final e é idempotente sem chave: repetir o pedido não cria nó, não reinicia
fonte e não reagenda ganho. `refresh` com a mesma leitura não agenda nada (o alvo não mudou). Dois comandos
em sequência valem pela ordem de chegada. `loadRecordings` é chamado uma vez; uma segunda chamada não
decodifica de novo o que já está guardado. O estado do som não é guardado no navegador, e recarregar a página o leva a
desligado. Nada aqui consome tentativa nem registra resultado.

## Comportamento em falha

| Falha | Comportamento | Log |
|---|---|---|
| gravação ilegível (texto embutido malformado ou bytes que não decodificam) ou navegador sem `OfflineAudioContext` | disponibilidade falsa; o som correspondente não toca; a volta, o tempo, os setores e a marca de pneu seguem iguais; sem nova tentativa | um `console.warn` por gravação, com o `assetRole` e o motivo (`decode`, `unsupported`); nunca o texto embutido nem conteúdo |
| navegador sem `AudioContext`, ou construtor que lança | as duas disponibilidades falsas; `setSoundOn` muda `soundOn` como pedido; o controle mostra o estado escolhido | um `console.warn` com `audio-unavailable` |
| `resume()` rejeitado | absorvido; o controle mostra o estado escolhido | nenhum |
| uma gravação decodifica e a outra não | cada som segue a sua disponibilidade | o aviso da que falhou |
| rede desligada depois de abrir | nenhum efeito: as gravações vieram no JS e os buffers estão em memória | — |

A métrica que mostraria o prazo de 50 ms ou de 200 ms sendo perdido é o instante final da rampa agendada
menos `currentTime`, lido no contexto de substituição dos testes
([test-strategy.md](../test-strategy.md)); a taxa de quadros com os sons tocando é medida no aparelho
([DES-0004](DES-0004-verificacoes-registros-e-medida-do-build.md)).

## Retirada

| Retirado | Ponto de rejeição | Substituto |
|---|---|---|
| tom sintetizado do motor: oscilador `triangle` (`src/audio.ts:32-36`) e a frequência por velocidade (`:51`) | nenhum caminho de `RaceAudio` cria oscilador fora de `reward()`; o teste da saída de áudio falha se um oscilador de motor aparecer | a fonte de buffer da gravação |
| `RaceAudio.toggle()` (`:29-43`) | o método deixa de existir; `tsc --noEmit` do build rejeita qualquer chamada restante | `setSoundOn(soundOn)` |
| `RaceAudio.update()` (`:48-53`) | idem | `refresh(reading)` |
| campo público `enabled` (`:28`) | passa a ser privado | `getSoundOutput().soundOn` |

Nenhum destes era contrato publicado (API-0002, Compatibilidade); não há leitor antigo a manter (I3).

## Feature flag

Nenhuma: o F-Spec declara "Configuração: Nenhuma" e proíbe configuração que force estado. O padrão é neutro:
o som abre desligado e só o Jogador o liga (I4).

## Pontos em aberto

Nenhum.
