---
title: Divergências — apresentação e som (estágio de código)
feature: apresentacao-e-som
stage: code
status: draft
version: 1.0.0
sources: []
---

# Divergências

Registro contra `300 Specs/330 D-Specs/Output/apresentacao-e-som/98-divergences.md` 1.0.0 (projeto validado em
`dspec-validation-20261110-1755`; base: a árvore de `5a0dfb3`). As 16 linhas do projeto, na ordem dele, cada uma `resolved` com o
`arquivo:linha` desta rodada ou `open` com a etapa devedora. Caminhos relativos à raiz do repositório.

| # | Requisito | O que exige | Etapa devedora | Item de projeto | Estado | Resolução |
|---|---|---|---|---|---|---|
| 1 | REQ-FEAT-0001-01, -02, -03, -04 | ícone de página e do atalho declarados, vindos de `docs/art/icon.png`, sem texto | código | DES-0001, DM-0001 | resolved | `index.html:9` (`rel="icon"`), `:10` (`rel="apple-touch-icon"`); `src/assets/icon.png` (192 × 192, 36.674 bytes); `src/assets/feature-assets.json` (`ICON_IMAGE`). A ausência de texto é conferida pela inspeção E2E-12 (linha 15) |
| 2 | REQ-FEAT-0002-01, -02, -03, -04, -05, -06 | capa de 1200 px ou mais, título "Kartle" e descrição de uma frase como prévia | código | DES-0001, DM-0001 | resolved | `index.html:11` (`og:title`), `:12` (`og:description`), `:13` (`og:image`); `src/assets/cover.jpg` (1200 × 670, 72.701 bytes); `feature-assets.json` (`COVER_IMAGE`) |
| 3 | REQ-FEAT-0003-10, -11 | o motor é a gravação; nenhum tom sintetizado de motor | código | DES-0003, ADR-0002 | resolved | `src/audio.ts:11` (`ENGINE_SOUND` `'recording'`), `:73-89` (`loadRecordings`, `loadRecording`), `:90-102` (`buildVoice`: fonte de buffer em repetição); o oscilador do motor saiu, `createOscillator` só em `:180` (`reward`); `src/main.ts:9`, `:153` |
| 4 | REQ-FEAT-0003-04, -05 | `engineGainNorm` 0 em até 200 ms depois de pausa e de resultado | código | DES-0002, DES-0003 | resolved | `src/soundOutput.ts:63`, `:73` (ganho 0 na avaliação fora de `RUNNING`); `src/audio.ts:166-171` (rampa linear até 0 em 80 ms); `src/main.ts:202` (pausa aceita), `:652` (quadro em que `ENDED` nasce) |
| 5 | REQ-FEAT-0003-06 | motor ao silêncio em até 200 ms depois de um `repositionKart` aceito | código | DES-0002, DES-0003, ADR-0003 | resolved | `src/main.ts:210-217` (`emitReposition` guarda `repositionAcceptedAtMs` e avalia na hora); `src/soundOutput.ts:61-62` (janela de 80 ms) |
| 6 | REQ-FEAT-0003-07 | nenhum som de motor a partir da ação que desliga o som | código | DES-0003 | resolved | `src/audio.ts:161-165` (`cancelScheduledValues(t)`, `setValueAtTime(0, t)`) |
| 7 | REQ-FEAT-0003-02, -03 | `enginePitchRatio` e `engineGainNorm` com as duas desigualdades | código | DES-0002, DES-0003 | resolved | `src/soundOutput.ts:22-27`, `:70-73`; `src/audio.ts:125-127` (`getSoundOutput`), `:147-150` (`playbackRate`) |
| 8 | REQ-FEAT-0003-09 (`setSoundOn`) | o pedido carrega o estado final e é idempotente | código | DES-0003 | resolved | `src/audio.ts:105-123` (`setSoundOn`; `toggle()` retirado); `src/main.ts:383` |
| 9 | REQ-FEAT-0003-12 | sem áudio, `setSoundOn` muda `soundOn` como pedido, nenhum som toca, nenhum aviso é acrescentado | código | DES-0003 | resolved | `src/audio.ts:109-114` (construtor que lança → `contextFailed`, só `console.warn`), `:138-143` (disponibilidade falsa); `src/main.ts:382-386` (sem `try`, sem `notify`) |
| 10 | REQ-FEAT-0004-01, -02, -03, -04, -05, -06, -07 | som de pneu da gravação enquanto o kart marca o asfalto, silêncio em até 200 ms | código | DES-0002, DES-0003, ADR-0003 | resolved | `src/soundOutput.ts:64-65`, `:74-75`; `src/audio.ts:152` (ganho do pneu); `src/main.ts:10`, `:617`, `:651-652` (`laidSegment` de `skidIndex` antes e depois do bloco), `:222-225` (`rearOnAsphalt`), `:230` |
| 11 | REQ-FEAT-0005-02, -04 | os 4 arquivos entregues, no máximo 300.000 bytes, todos no download inicial | código | DES-0001, DM-0001, ADR-0001 | resolved | `src/assets/` (224.762 bytes nos 4); `index.html:9`, `:14`; `src/main.ts:9-10`; medida do build: `assetCount` 4, `assetsInInitialDownloadCount` 4. As 4 origens de `docs/` continuam sem versão até o commit da entrega, que esta etapa não faz |
| 12 | REQ-FEAT-0005-01, -02, -04, -10, -12 (`ASSET_BUDGET`) | registro da medida do build | código | DES-0004 | resolved | `scripts/assetBudget.ts:125-191` (`measureAssetBudget`), `scripts/asset-budget.ts`, `package.json:14`; `npm run build && npm run check:assets`: `PASS` |
| 13 | REQ-FEAT-0005-06, -07, -14, -15 (registros de `npm test`) | `SOUND_DETERMINISM`, `ASSETS_NEUTRAL`, `SIM_STATE_UNCHANGED` | testes | DES-0004 | open | nenhum código devido por esta etapa: `tests/apresentacao-e-som-*.test.ts` e `tests/helpers/soundReport.ts` são do estágio de testes |
| 14 | REQ-FEAT-0005-11 | os ensaios da zebra de `pista-kart-park` passam com a feature entregue | testes | DES-0003, test-strategy.md | open | nenhuma linha da zebra mudou. `npm test`: 476/477; a reprovada é CHK-TEST-0008-07 (`tests/pista-kart-park-feedback.test.ts:165`, `audio.toggle is not a function`), que o estágio de testes migra pela tabela de `test-strategy.md`; não editada aqui |
| 15 | REQ-FEAT-0005-03, -05, -08, -09, -13 | registros em aparelho: rede, sem rede, 60 fps, 30 fps, inspeção visual | testes | DES-0004, DES-0005 | open | nenhum código devido: `docs/apresentacao-e-som-device-log.md` é escrito pela etapa de testes, por pessoas |
| 16 | REQ-FEAT-0005-16 | nenhuma promoção para produção antes da confirmação da licença | deploy | DES-0005 | open | condição de liberação; `LICENSE_PENDING` |

Requisitos que a árvore já satisfazia e que esta rodada mantém: REQ-FEAT-0003-08 (`src/audio.ts:65`, `index.html:40`),
REQ-FEAT-0002-07 (a capa só em `index.html:13-14`), REQ-FEAT-0005-10 (`package.json` só com `three`), REQ-FEAT-0005-12 (nenhum
arquivo de som em `dist/`).
