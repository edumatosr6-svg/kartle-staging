---
id: TEST-0004
title: Página e contratos de texto — as 5 declarações de index.html, a capa fora das telas, o controle de som, as gravações importadas, a leitura do quadro depois do bloco de marca, nenhuma API de rede, as camadas e a zebra intocada
feature: apresentacao-e-som
stage: test
status: draft
version: 1.0.0
sources: [AC-US-0001-01, AC-US-0001-02, AC-US-0001-03, AC-US-0002-01, AC-US-0002-03, AC-US-0002-04, AC-US-0002-07, AC-US-0003-08, AC-US-0003-09, AC-US-0003-10, AC-US-0004-01, AC-US-0004-04, AC-US-0004-06, NFR-0003, NFR-0004, NFR-0007, NFR-0009]
---

# TEST-0004 — Página e contratos de texto

| | |
|---|---|
| Arquivo | `tests/apresentacao-e-som-page.test.ts` (estratégia: contrato de API-0001 e contratos de texto) |
| Nível | contrato e texto: `index.html` lido como elementos; `src/main.ts`, `src/audio.ts` e `src/soundOutput.ts` lidos como texto sem comentários. `npm test` não carrega `src/main.ts` |
| Interface exercitada | o texto de `index.html` e dos arquivos de `src/`; `initialDownloadFiles` (`scripts/assetBudget.ts`); `tyreMarkBlockOf` (`tests/helpers/kart01Report.ts`) |
| Fixtures | os resumos SHA-256 do bloco de marca de pneu, de `whiteNoise`, de `CURB_SOUND`, do ataque da zebra, de `RaceAudio.curb()` e de `src/curbFeedback.ts`, gravados sobre o commit `5a0dfb3` (o último antes da feature), com fim de linha normalizado; o texto da descrição registrado em ADR-0003 |

A aba, o atalho, a prévia e a marca vista na tela só existem no navegador: os roteiros E2E-01 a E2E-05 e E2E-07 os cobrem. O que este registro decide é o que o documento declara e o que o texto do código garante.

## Verificações

| Check | Decide | Teste | O que a faria falhar |
|---|---|---|---|
| CHK-TEST-0004-01 | AC-US-0001-01, AC-US-0001-02 | the page document declares the delivered icon as the page icon, once, in the head | nenhum ou mais de um `rel="icon"`; endereço diferente de `/src/assets/icon.png`; tipo diferente de PNG; arquivo ausente; declaração fora do `head`; ícone fora do que o documento pede ao abrir |
| CHK-TEST-0004-02 | AC-US-0001-03 | the page document declares the same delivered icon as the home-screen icon | `apple-touch-icon` ausente, duplicado ou apontando para outro arquivo |
| CHK-TEST-0004-03 | AC-US-0002-01 | the page document declares the delivered cover as the link-preview image | `og:image` ausente, duplicado ou com outro endereço; arquivo ausente; largura declarada no documento |
| CHK-TEST-0004-04 | AC-US-0002-03 | the page document declares the preview title exactly "Kartle", next to the cover, and keeps the declarations it already had | `og:title` diferente de `Kartle` (M13); as três declarações de prévia fora de linhas consecutivas; `title`, `description` ou `theme-color` alterados |
| CHK-TEST-0004-05 | AC-US-0002-04 | the page document declares a preview description of one sentence in Portuguese: the registered text, with a single full stop, at the end | texto diferente do de ADR-0003; mais de um ponto final; outro sinal de fim de frase; fragmento |
| CHK-TEST-0004-06 | AC-US-0002-07 | no screen of the game can show the cover: no script or stylesheet of the application names it, and the document names it only as the preview image and the preload | `cover` em algum `.ts` ou `.css` de `src/`; terceira referência à capa em `index.html` (ou uma só, M14); referência no `body`; elemento de imagem ou fundo no `body`; imagem de `src/assets` referida por script |
| CHK-TEST-0004-07 | AC-US-0003-08 | the page opens showing the sound off, and no module keeps the sound state in the browser storage | `#sound` ausente, com `aria-pressed` diferente de `false` ou com outro texto; `localStorage`, `sessionStorage`, `indexedDB` ou `document.cookie` em `src/`; rótulo que não segue a resposta de `setSoundOn` |
| CHK-TEST-0004-08 | AC-US-0003-09 | the only call of the sound command in the application is the handler of the sound control, and it asks for the final state | segunda chamada a `setSoundOn` em `src/main.ts` (M16) ou em outro módulo; chamada fora do manipulador de `#sound`; `toggle()` restante; parâmetro que force o som |
| CHK-TEST-0004-09 | AC-US-0003-10, AC-US-0004-06 | the application imports the two recordings inside the script and hands them to the audio output, and the only oscillator left in the audio output is the reward | importação `?inline` ausente ou dinâmica; valores não entregues a `loadRecordings`; terceiro `.mp3`; `createOscillator` fora de `reward()` (M08); `audio.update(` ou `audio.toggle(` restantes |
| CHK-TEST-0004-10 | AC-US-0004-01 | the sound of the frame is read after the tyre-mark block, from whether the block laid a new segment, and the block is the same text as before the feature and reads nothing from the audio | `refreshSound` antes do bloco; `skidIndex` lido depois do bloco; bloco de marca com texto diferente do de antes da feature; bloco lendo `audio`; pausa, retomada ou reposicionamento aceitos sem `refreshSound` (M16); instante do reposicionamento guardado depois |
| CHK-TEST-0004-11 | AC-US-0004-04 | the tyre reading handed to the sound is the conjunction of a new mark segment and a rear wheel on the asphalt, read from the track contact | `tireMarkingAsphalt` sem `rearOnAsphalt` (M15) ou sem `laidSegment`; rodas diferentes de 2 e 3; superfície diferente de `'ASPHALT'`; limiar de deslize repetido na leitura do som; `refreshSound` escrevendo na volta |
| CHK-TEST-0004-12 | NFR-0003 | neither the audio output nor the application asks the network for anything: no network API in their text, no dynamic import, no sound address in the document | `fetch` (M12), `XMLHttpRequest`, `WebSocket`, `EventSource`, `navigator.sendBeacon`, `Audio` ou `Image` em `src/audio.ts`, `src/soundOutput.ts` ou `src/main.ts`; `import(`; gravação importada sem `?inline`; `.mp3` em `index.html` |
| CHK-TEST-0004-13 | NFR-0003 | the document makes the two images part of what the browser asks for when it opens — the page icon and the cover preload — and preloads no sound | `preload` da capa ausente (M14) ou de outro tipo; `preload` de som; ícone ou capa fora do que o documento pede ao abrir; pedido a outra origem |
| CHK-TEST-0004-14 | NFR-0004, NFR-0009 | no module of the simulation or of the track data imports the audio, the sound decision or the delivered files, and the sound decision is pure | `./audio`, `./soundOutput` ou `./assets` importado por um módulo da simulação (M17) ou por outro módulo que não `src/main.ts`; `src/soundOutput.ts` importando algo além do tipo `LapPhase` ou usando DOM, relógio ou sorteio; `src/audio.ts` alcançando a volta |
| CHK-TEST-0004-15 | NFR-0007 | the curb sound of pista-kart-park is untouched: its descriptor, its noise, its curb() and the curb decision are the text recorded before the feature | qualquer caractere mudado em `whiteNoise`, `CURB_SOUND`, no ataque, em `RaceAudio.curb()` ou em `src/curbFeedback.ts`; leitura `audio.soundOn()` da zebra retirada; arquivo de som da zebra em `src/` |

As duas verificações validadas de rede e armazenamento que a estratégia manda não migrar — a de `tests/pista-kart-park-layering.test.ts` e a de `tests/race-lap-validation-layering.test.ts` — continuam valendo sem mudança e passam com o código entregue; a verificação -12 deste registro acrescenta `src/soundOutput.ts` e os nomes `Audio` e `Image`. Os critérios 09 a 12 de US-0005 de `pista-kart-park` (NFR-0007) continuam decididos pelas verificações do retorno da zebra daquela feature (`tests/pista-kart-park-feedback.test.ts`), com a sétima migrada como o changelog registra.
