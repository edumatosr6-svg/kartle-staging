---
title: Estratégia de testes — apresentação e som
feature: apresentacao-e-som
stage: dspec
status: validated
version: 1.1.0
sources: []
---

# Estratégia de testes

Prova é verificação determinística em `npm test` (`node:test` via `tsx`), sem relógio de parede, sem rede e
sem carregar `src/main.ts` (I9). O que só existe no navegador ou no aparelho — a aba, o atalho, a prévia, o
que se ouve, a rede, a taxa de quadros — é provado por roteiro registrado em
`docs/apresentacao-e-som-device-log.md`, com identificadores `E2E-nn`; uma execução em desktop não vale para
celular. O projeto não tem ferramenta de ponta a ponta e esta feature não acrescenta dependência: "web E2E" e
"mobile E2E" são esses roteiros, como nas outras features. Os testes ficam em
`tests/apresentacao-e-som-<área>.test.ts` e cada verificação nomeia o critério que verifica.

Nenhum teste usa configuração, ponto de entrada ou gancho criado só para testar. Os testes chegam ao
comportamento por: `decideSoundOutput` e `initialSoundDecision` (`src/soundOutput.ts`); `RaceAudio` e
`findLoopBounds` e `decodeRecordingDataUrl` (`src/audio.ts`) sobre `AudioContext` e `OfflineAudioContext` de
substituição postos em `globalThis`, como o teste da zebra já faz com `AudioContext`, e sobre textos `data:`
em base 64 que o teste monta dos bytes de `src/assets/` (a mesma forma que o Vite embute); nenhum teste
substitui nem chama a rede; `stepLap`, `getLapState`,
`getLapResult`, `repositionKart`, `pauseLap` (`src/lap.ts`) e `getHandlingTelemetry` (`src/physics.ts`); o
texto de `index.html` e dos arquivos de `src/`; os arquivos de `src/assets/` e `feature-assets.json`;
`measureAssetBudget`, `initialDownloadFiles`, `embeddedPayloads` e `readImageSize` (`scripts/assetBudget.ts`) sobre pastas `dist`
montadas pelo teste num diretório temporário; e estados de partida semeados com os ajudantes que já existem
(`tests/helpers/kartParkPilot.ts`).

## Níveis

| Nível | Onde roda | O que cobre |
|---|---|---|
| Unitário | `npm test` | `decideSoundOutput` linha a linha das duas tabelas; as constantes e as desigualdades; `findLoopBounds`; `decodeRecordingDataUrl` (texto válido, texto sem a forma `data:`, carga que não é base 64); `readImageSize`; `initialDownloadFiles`; `embeddedPayloads` |
| Integração | `npm test` | `RaceAudio` sobre o contexto de substituição (nós criados, rampas agendadas, repetição, nenhum oscilador de motor); `loadRecordings` com os textos embutidos (sucesso, texto malformado, bytes que o decodificador rejeita, decodificação que nunca termina, sem `OfflineAudioContext`); uma volta inteira com a leitura do quadro entregue ao som |
| Contrato de API | `npm test` | API-0001 no texto de `index.html` (as 5 declarações, valores exatos); API-0002 (`getSoundOutput` e `setSoundOn`: os 8 campos, sem campo a mais, idempotência); API-0003 (os 4 registros, campo a campo, e cada `checkFailReason`) |
| Arquivo | `npm test` | resumos de origem e de forma entregue contra `feature-assets.json`; cópia byte a byte dos sons; dimensões e proporção das imagens; tetos de bytes |
| Build | `npm run build && npm run check:assets` | o registro `ASSET_BUDGET` sobre o `dist/` real |
| Web E2E | roteiro registrado, `web-desktop`: Chrome, Edge, Firefox e Safari atuais; notebook de referência de RNF03 | aba, prévia, telas sem capa, som ouvido, rede, sem rede, 60 fps |
| Mobile E2E | roteiro registrado, `web-mobile`: Chrome no Android e Safari no iOS; celular intermediário de referência de RNF03 | aba, atalho, telas sem capa, som ouvido, rede, sem rede, 30 fps |

## Funcionalidade × nível

| Funcionalidade | Unitário | Integração | Contrato | Arquivo | Build | Web E2E | Mobile E2E | Motivo |
|---|---|---|---|---|---|---|---|---|
| FEAT-0001 | — | — | sim | sim | sim | sim | sim | a declaração e o arquivo são texto e bytes; a aba e o atalho só existem no navegador |
| FEAT-0002 | — | — | sim | sim | sim | sim | sim | o mesmo; a prévia só existe num serviço de prévia; "nenhuma tela mostra a capa" é provada no texto e percorrendo as telas |
| FEAT-0003 | sim | sim | sim | sim | — | sim | sim | a decisão é pura; a saída de áudio é verificável com contexto de substituição; o que se ouve, só no aparelho |
| FEAT-0004 | sim | sim | sim | sim | — | sim | sim | o mesmo; a ligação com a marca vista na tela, só no aparelho |
| FEAT-0005 | sim | sim | sim | sim | sim | sim | sim | registros em `npm test` e na medida do build; rede, sem rede e taxa de quadros, só no aparelho; licença, no registro de liberação |

## Roteiros registrados

| Id | Canal | Roteiro | Resultado esperado |
|---|---|---|---|
| E2E-01 | `web-desktop` | abrir o endereço de staging em cada navegador | a aba mostra o ícone do Kartle |
| E2E-02 | `web-mobile` | abrir o endereço de staging | a aba mostra o ícone |
| E2E-03 | `web-mobile` | "adicionar à tela de início" | o atalho mostra o ícone |
| E2E-04 | link compartilhado | colar o endereço de staging em ao menos dois aplicativos ou sites que montam prévia, nomeados | capa, título "Kartle" e a descrição; registra-se por serviço se a imagem apareceu |
| E2E-05 | ambos | percorrer tela inicial, início de volta, corrida, pausa e resultado | nenhuma mostra a capa |
| E2E-06 | ambos | abrir (som desligado); ligar; pilotar: parado, acelerando, a baixa e a alta velocidade; pausar; retomar; reposicionar; terminar a volta; desligar no meio de uma volta | motor de kart gravado, contínuo, sem buraco na repetição, mais agudo com velocidade, mais alto com acelerador; silêncio na pausa, no reposicionamento e no resultado; silêncio imediato ao desligar; nenhum tom sintetizado |
| E2E-07 | ambos | provocar deslizes com marca no asfalto, curtos e longos; rodar sem deslizar; parar; desligar no meio de um deslize | pneu cantando enquanto a marca aparece; silêncio logo depois; nenhum som parado, sem deslize ou com o som desligado |
| E2E-08 | ambos | registro de rede do navegador, da abertura até o fim de uma volta completa com o som ligado e ao menos um deslize | o ícone e a capa pedidos uma vez cada, na abertura; nenhum pedido com endereço de som em momento algum (as gravações vêm dentro do JS); 0 pedidos de som ou imagem depois de o jogo abrir |
| E2E-09 | ambos | desligar a rede do aparelho depois de o jogo abrir; volta completa com o som ligado e um deslize | motor e pneu tocam; 0 sons em falta |
| E2E-10 | `web-desktop`, notebook de referência | medir os quadros por segundo numa volta completa com o som ligado, motor tocando e ao menos um deslize com som de pneu | 60 fps sustentados |
| E2E-11 | `web-mobile`, celular de referência | o mesmo | 30 fps sustentados |
| E2E-12 | — | inspeção visual de `src/assets/icon.png` e `src/assets/cover.jpg`, com data, nome de quem inspecionou e o resumo de cada arquivo | 0 marcas, 0 logotipos, 0 textos de terceiros; 0 textos no ícone e na capa |
| E2E-13 | ambos | passar com roda na zebra, com o som ligado, com e sem deslize | o som da zebra como antes; pode tocar junto com o pneu |

E2E-14 (bloquear os dois endereços de som no navegador) foi retirado em 2026-11-10 e o identificador não é
reaproveitado: com as gravações embutidas no JS não existe endereço de som a bloquear, e criar um modo de
falha só para o roteiro seria superfície de teste. O caso de som indisponível é alcançado em `npm test`, na
integração de `loadRecordings` e no registro `ASSETS_NEUTRAL`.

## Como cada critério é alcançado

### FEAT-0001 — ícone

| Critério | Como o teste chega |
|---|---|
| AC-US-0001-01, AC-US-0001-02 | contrato: `index.html` tem `link[rel="icon"]` apontando para `/src/assets/icon.png`; build: `ASSET_BUDGET` acha o ícone em `dist/` e no download inicial; E2E-01 e E2E-02 |
| AC-US-0001-03 | contrato: `link[rel="apple-touch-icon"]` aponta para o mesmo arquivo; E2E-03 |
| AC-US-0001-04 | arquivo: `sourceSha256` de `ICON_IMAGE` é o resumo de `docs/art/icon.png`; `deliveredSha256` é o de `src/assets/icon.png`; `readImageSize` dá 192 × 192, proporção da origem; `transform` `RESIZE_REENCODE`; E2E-12 confere que a imagem é a mesma |
| AC-US-0001-05 | E2E-12 (0 textos no ícone); arquivo: o resumo inspecionado é o do registro de origem |

### FEAT-0002 — capa

| Critério | Como o teste chega |
|---|---|
| AC-US-0002-01 | contrato: `meta[property="og:image"]` aponta para `/src/assets/cover.jpg`; E2E-04 |
| AC-US-0002-02 | arquivo: `readImageSize` de `src/assets/cover.jpg` dá largura 1200 ou mais; build: `coverWidthPx` no `ASSET_BUDGET`; unidade: `COVER_TOO_NARROW` com uma capa de 1199 px montada pelo teste |
| AC-US-0002-03 | contrato: `og:title` com conteúdo exatamente `Kartle` |
| AC-US-0002-04 | contrato: `og:description` igual ao texto de ADR-0003, com um único ponto final, no fim, e nenhum outro sinal de fim de frase |
| AC-US-0002-05 | arquivo: resumos de origem e de forma entregue de `COVER_IMAGE`; 1200 × 670 preserva a proporção de 2752 × 1536; E2E-12 |
| AC-US-0002-06 | E2E-12 (0 textos na capa) |
| AC-US-0002-07 | contrato: nenhum arquivo `.ts` ou `.css` de `src/` contém `cover`; em `index.html` a capa aparece só em `og:image` e no `preload`, e o `<body>` não a referencia; E2E-05 |

### FEAT-0003 — motor

| Critério | Como o teste chega |
|---|---|
| AC-US-0003-01 | unidade: com `soundOn`, som disponível e `RUNNING`, toda avaliação dá `ENGINE_PLAYING` e ganho maior que 0, com `speedMps` 0 e acelerador solto inclusive; integração: uma volta inteira, avaliada a cada passo, sem nenhuma avaliação em `RUNNING` com ganho 0 fora da janela de reposicionamento; contexto de substituição: a fonte do motor tem `loop` verdadeiro, `loopStart` e `loopEnd` de `findLoopBounds`, um único `start` e nenhum `stop`, e a rampa de subida termina em 10 ms; `findLoopBounds` sobre amostras com silêncio nas duas pontas devolve as bordas do som; E2E-06 |
| AC-US-0003-02 | unidade: `enginePitchRatio` a 20 m/s maior que a 5 m/s com o mesmo `throttleNorm` (0 e 1), e estritamente crescente de 0 a 32 m/s; integração: a `playbackRate` pedida ao contexto de substituição é a razão; E2E-06 |
| AC-US-0003-03 | unidade: `engineGainNorm` com `throttleNorm` 1 maior que com 0, a 0, 5 e 20 m/s; E2E-06 |
| AC-US-0003-04 | integração: volta semeada em `RUNNING`, `pauseLap` aceito, leitura seguinte com `PAUSED`: `engineGainNorm` 0 e `ENGINE_SILENT` na primeira avaliação; no contexto de substituição a rampa agendada termina em 0, 80 ms depois de `currentTime` (menor que 200 ms); E2E-06 |
| AC-US-0003-05 | integração: a volta do piloto de teste até `ENDED`; na primeira avaliação com `ENDED`, ganho 0 e rampa de 80 ms; E2E-06 |
| AC-US-0003-06 | integração: `repositionKart` aceito numa volta de treino em `RUNNING`; avaliação com `repositionAcceptedAtMs` igual a `nowMs`: ganho 0, `ENGINE_SILENT`, rampa de 80 ms; avaliações com `nowMs` até 79 ms depois: ainda `ENGINE_SILENT`; a 80 ms: `ENGINE_PLAYING`; E2E-06 |
| AC-US-0003-07 | unidade: com `soundOn` falso, para cada `lapPhase` e sem volta, ganho 0 e `ENGINE_SILENT`; integração: `setSoundOn(false)` no meio de uma volta agenda `setValueAtTime(0, currentTime)`, sem rampa; E2E-06 |
| AC-US-0003-08 | contrato: `new RaceAudio().getSoundOutput()` dá `soundOn` falso, os dois estados em silêncio e ganhos 0; `index.html` traz o controle `#sound` com o texto "Som desligado" e `aria-pressed="false"`; nenhum arquivo de `src/` grava ou lê o estado do som em `localStorage` ou `sessionStorage`; E2E-06 (abrir e recarregar) |
| AC-US-0003-09 | integração: uma sessão inteira — contagem, volta, pausa, retomada, reposicionamento, resultado — com `refresh` a cada passo e sem `setSoundOn`: `soundOn` falso do começo ao fim; depois de `setSoundOn(true)`: verdadeiro; contrato: em `src/main.ts` a única chamada a `setSoundOn` está no manipulador de `#sound`; `setSoundOn` com `undefined`, `1` ou `'true'` não muda nada; repetir `setSoundOn(true)` não cria nó novo |
| AC-US-0003-10 | arquivo: `src/assets/engine-loop.mp3` é igual byte a byte a `docs/sfx/engine-loop.mp3`; integração: com o texto `data:` montado dos bytes de `src/assets/engine-loop.mp3`, o `OfflineAudioContext` de substituição recebe exatamente esses bytes e o buffer que ele devolve é o que a fonte do motor recebe; contrato: `src/main.ts` importa `./assets/engine-loop.mp3?inline` e entrega o valor a `loadRecordings`; build: `ASSET_BUDGET` acha no JS de `dist/` a carga embutida com o `deliveredSha256` de `ENGINE_LOOP`; depois de `setSoundOn(true)` nenhum nó `oscillator` foi criado; contrato: `src/audio.ts` só chama `createOscillator` dentro de `reward`; E2E-06 |
| Caso anormal de US-0003 (som indisponível) | integração: `loadRecordings` com texto que não é `data:` em base 64, com bytes que o decodificador de substituição rejeita, com decodificação que nunca termina e sem `OfflineAudioContext` em `globalThis`; `setSoundOn` sem `AudioContext` em `globalThis`; em todos: `engineSoundAvailable` falso, ganho 0, `setSoundOn(true)` não lança, `soundOn` passa a verdadeiro e `loadRecordings` não rejeita; registro `ASSETS_NEUTRAL` com `PASS`. "Tempo esgotado ao carregar o som na abertura" não tem caminho próprio: as gravações chegam com o JS, e sem o JS o jogo não abre ([DES-0003](web/DES-0003-saida-de-audio-gravacoes-e-controle-de-som.md)) |

### FEAT-0004 — pneu

| Critério | Como o teste chega |
|---|---|
| AC-US-0004-01 | unidade: com `tireMarkingAsphalt` verdadeiro num passo novo e `RUNNING`, `TIRE_PLAYING` e `tireGainNorm` maior que 0, e assim permanece nos quadros sem passo novo; integração: a fonte do pneu em repetição recebe a rampa de subida; contrato de texto (a composição fica em `src/main.ts`, que `npm test` não carrega, e por isso não é executada): em `src/main.ts`, `refreshSound` é chamado depois do bloco de marca e `tireMarkingAsphalt` é montado de `skidIndex` antes e depois do bloco e de `getTrackContact`; o bloco de marca extraído pelo ajudante de `modelo-kart-01` é o mesmo texto de antes; E2E-07 (a marca vista na tela) |
| AC-US-0004-02 | unidade: passo novo com `tireMarkingAsphalt` falso depois de um verdadeiro: ganho 0 e `TIRE_SILENT` nessa avaliação; `PAUSED` e `ENDED` com o último passo marcando: o mesmo; volta a marcar no passo seguinte: `TIRE_PLAYING` de novo; integração: a rampa agendada termina em 0 em 80 ms; E2E-07 |
| AC-US-0004-03 | unidade: `speedMps` 0 com `tireMarkingAsphalt` falso: ganho 0; integração: kart semeado parado numa volta em `RUNNING`, avançado com entrada neutra: nenhuma avaliação com `TIRE_PLAYING`; E2E-07 |
| AC-US-0004-04 | unidade: `tireMarkingAsphalt` falso a 20 m/s: ganho 0, e verdadeiro nas mesmas condições: `TIRE_PLAYING` — a decisão depende só desse campo, não da velocidade; contrato de texto: em `src/main.ts`, o valor entregue em `tireMarkingAsphalt` é a conjunção `laidSegment && rearOnAsphalt`, com `rearOnAsphalt` lido de `wheelSurfaces` de `getTrackContact` nos índices 2 e 3 contra `'ASPHALT'` — a composição não é executada por `npm test`, que não carrega `src/main.ts`; no aparelho, E2E-07 cobre as duas partes verdadeiras (deslize com marca no asfalto: canta) e nenhuma marca (rodar sem deslizar: silêncio); o nível declarado para a composição é contrato de texto mais roteiro registrado, não unidade |
| AC-US-0004-05 | unidade: `soundOn` falso com `tireMarkingAsphalt` verdadeiro: ganho 0 e `TIRE_SILENT`; integração: `setSoundOn(false)` durante `TIRE_PLAYING` agenda `setValueAtTime(0, currentTime)`; E2E-07 |
| AC-US-0004-06 | arquivo: `src/assets/tire-screech.mp3` é igual byte a byte a `docs/sfx/tire-screech.mp3`; integração: o buffer da fonte do pneu é o decodificado desses bytes, entregues pelo texto `data:` montado do arquivo; contrato: `src/main.ts` importa `./assets/tire-screech.mp3?inline`; build: `ASSET_BUDGET` acha no JS de `dist/` a carga embutida com o `deliveredSha256` de `TIRE_SCREECH`; E2E-07 |
| Caso anormal de US-0004 (som indisponível) | integração: só o texto embutido do pneu é malformado: `tireSoundAvailable` falso, `tireGainNorm` 0, e o motor toca; contrato: o bloco de marca de pneu de `src/main.ts` não lê nada de `audio` (a marca é desenhada com ou sem som); `ASSETS_NEUTRAL` com `PASS` |

### FEAT-0005 — transversais

| Critério | Como o teste chega |
|---|---|
| NFR-0001 | build: `initialDownloadBytes` abaixo de 3.000.000 no `ASSET_BUDGET` do `dist/` real; unidade: `INITIAL_DOWNLOAD_EXCEEDED` sobre uma pasta montada com um arquivo grande |
| NFR-0002 | build: `featureAssetBytes` de no máximo 300.000; arquivo: cada forma entregue dentro do seu teto de DM-0001; unidade: `BUDGET_EXCEEDED` |
| NFR-0003 (pedidos) | E2E-08, nos dois canais; contrato: o texto sem comentários de `src/audio.ts` e de `src/main.ts` não contém `fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource` nem `navigator.sendBeacon`, `src/main.ts` não contém `import(`, as duas gravações entram em `src/main.ts` por importação estática `?inline`, e `index.html` não referencia nenhum `.mp3`; as verificações validadas CHK-TEST-0011-02 (`pista-kart-park`) e CHK-TEST-0013-03 (`race-lap-validation`) passam sem mudança |
| NFR-0003 (4 de 4) | build: `assetCount` 4 e `assetsInInitialDownloadCount` 4, com as 2 imagens achadas como arquivo e as 2 gravações achadas embutidas no JS de entrada; contrato: `index.html` tem o `rel="icon"` e o `preload` da capa, e nenhum `preload` de som; unidade: `ASSET_MISSING` sobre pastas montadas sem uma imagem e sem uma gravação embutida, e `ASSET_NOT_IN_INITIAL_DOWNLOAD` sobre pastas sem o `preload` da capa e com uma gravação embutida num JS que `index.html` não manda buscar |
| NFR-0003 (sem rede) | E2E-09, nos dois canais |
| NFR-0004 | `SOUND_DETERMINISM` com `PASS`, `lapDeltaMs` 0 e `maxSectorDeltaMs` 0, sobre a volta do piloto de teste na Kart Park; contrato: nenhum módulo de simulação ou de dado de pista importa `./audio`, `./soundOutput` ou `./assets` |
| NFR-0005 | E2E-10 (notebook de referência) e E2E-11 (celular de referência), nomeados no registro |
| NFR-0006 | build: `newRuntimeDependencyCount` 0; arquivo: `dependencies` de `package.json` igual a `runtimeDependenciesBaseline`; unidade: `NEW_RUNTIME_DEPENDENCY` e `BASELINE_MISSING` |
| NFR-0007 (zebra) | `npm test` com a feature entregue: as verificações de `pista-kart-park` dos critérios 09 a 12 de US-0005 passam, CHK-TEST-0008-07 migrada como abaixo; contrato: `CURB_SOUND`, `curb()` e `whiteNoise` de `src/audio.ts` e `src/curbFeedback.ts` iguais ao texto anterior; E2E-13 |
| NFR-0007 (sem arquivo) | build: `curbSoundFileCount` 0; unidade: `CURB_SOUND_FILE_PRESENT` sobre uma pasta com um arquivo de som e sobre uma pasta com um terceiro som embutido no JS |
| NFR-0008 | E2E-12, com data e nome; arquivo: os resumos inspecionados são os de `feature-assets.json` |
| NFR-0009 (tempos) | `ASSETS_NEUTRAL` com `PASS` |
| NFR-0009 (estado) | `SIM_STATE_UNCHANGED` com `PASS` e `differingFieldCount` 0 contra `tests/fixtures/kart01-sim-baseline.json`; unidade: `STATE_DIFFERS` com um campo alterado na cópia da linha de base e `BASELINE_MISSING` com o caminho inexistente |
| NFR-0010 | registro de liberação da etapa de deploy, com a data da confirmação da licença anterior à da promoção; fora de `npm test`: é condição de liberação ([DES-0005](security/DES-0005-privacidade-rede-e-licenca.md)) |

Os registros de API-0003 são verificados também na forma: cada um com exatamente os campos do contrato,
`checkFailReason` só com `FAIL`, e um registro com `FAIL` quando a medida não pôde ser feita.

## Migração de verificação existente

A feature muda o que **uma** verificação de `pista-kart-park` afirma sobre o motor. Nenhuma verificação é
removida; a migração é feita pela etapa de testes desta feature e registrada no changelog dela.

A rota de entrega das gravações não migra verificação alguma (decisão do dono do produto, 2026-11-10):
CHK-TEST-0011-02 de `pista-kart-park` (`tests/pista-kart-park-layering.test.ts:58-66`) e CHK-TEST-0013-03 de
`race-lap-validation` (`tests/race-lap-validation-layering.test.ts:43-47`) continuam valendo como estão, não
são editadas pela etapa de testes desta feature, e o código entregue tem de passar nelas sem contorná-las
([ADR-0001](adr/ADR-0001-arquivos-versionados-e-pedidos-pelo-documento.md)). A tabela abaixo é a lista
completa do que migra.

| Verificação | Critério | O que afirma hoje (`tests/pista-kart-park-feedback.test.ts`) | O que passa a afirmar | O que não muda |
|---|---|---|---|---|
| CHK-TEST-0008-07 | AC-US-0005-12 e AC-US-0005-11 de `pista-kart-park` | `:165` e `:182` chamam `audio.toggle()`; `:167-169` afirmam que o motor é um oscilador do tipo `ENGINE_SOUND.source` | `audio.setSoundOn(true)` e `audio.setSoundOn(false)`; depois de ligar o som, nenhum nó `oscillator` e nenhum `filter` foi criado para o motor, e `ENGINE_SOUND.source` é `'recording'` | as três fontes diferentes entre si (`:158-160`), a zebra como única fonte `'noise'` (`:161`), a repetição da zebra como fonte de buffer por filtro passa-baixa de 160 Hz (`:172-175`), a recompensa só de osciladores (`:177-180`), nenhum nó da zebra com o som desligado (`:183-185`) |

O contexto de substituição dessa verificação não tem `decodeAudioData` nem gravação carregada: com
`loadRecordings` não chamado, `setSoundOn(true)` não cria fonte alguma, e a verificação continua vendo só os
nós da zebra e da recompensa.

## Pontos em aberto

Nenhum: todo critério tem caminho por semente, substituto, arquivo, medida do build ou roteiro registrado.
