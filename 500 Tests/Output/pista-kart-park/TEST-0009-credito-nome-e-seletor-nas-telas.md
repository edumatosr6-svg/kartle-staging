---
id: TEST-0009
title: Crédito, nome, comprimento e seletor nas telas — regras puras de src/lapMessages.ts e os textos de DOM que src/main.ts e index.html emitem
feature: pista-kart-park
stage: test
status: draft
version: 1.0.0
sources: [AC-US-0006-01, AC-US-0006-02, AC-US-0006-03, AC-US-0006-04, AC-US-0006-05, AC-US-0006-06, AC-US-0006-07, AC-US-0006-08, AC-US-0006-09, AC-US-0001-01, AC-US-0001-02, AC-US-0001-03, AC-US-0003-06, NFR-0005]
---

# TEST-0009 — Crédito, nome, comprimento e seletor nas telas

| | |
|---|---|
| Arquivo | `tests/pista-kart-park-screens.test.ts` (estratégia: `screens`) |
| Nível | unitário (`creditFor`, `optionLabel`, `OSM_CREDIT`, `message`) e texto (`src/main.ts` sem comentários e `index.html` lidos com `node:fs`, como o irmão `modelo-kart-01` faz com os símbolos de `main.ts`); o que a tela mostra de fato fica para o roteiro registrado (`98-divergences.md`) |
| Interface exercitada | `creditFor`, `optionLabel`, `OSM_CREDIT`, `message`, `MESSAGE_KEYS` (`src/lapMessages.ts`); `TRAINING_TRACKS` |
| Fixtures | entradas `kart-park` e `synthetic` do catálogo; entrada `{displayName: 'X', displayLengthM: 1234}`; o texto publicado da pista |

## Verificações

| Check | Decide | Teste | O que a faria falhar |
|---|---|---|---|
| CHK-TEST-0009-01 | AC-US-0006-01 | with the Kart Park selected the selector shows "© colaboradores do OpenStreetMap" | `creditFor(kart-park)` ausente ou com outro texto, crédito não congelado, `renderCredit($('track-credit'), creditFor(selectedOption(view.selectedTrackId)))` ausente de `main.ts`, texto e licença não escritos como nós de texto, `#track-credit` ausente de `index.html` |
| CHK-TEST-0009-02 | AC-US-0006-02 | the credit carries the ODbL licence mention | `license` sem `ODbL` ou diferente de "licença ODbL" |
| CHK-TEST-0009-03 | AC-US-0006-03 | the credit link goes to openstreetmap.org/copyright and is the href of the anchor | `url` diferente de `https://openstreetmap.org/copyright` (mutação F), `href` não ligado a `credit.url`, texto visível do link diferente, `rel` sem `noopener noreferrer` |
| CHK-TEST-0009-04 | AC-US-0006-04, AC-US-0006-05, AC-US-0006-06 | the result screen of a Kart Park lap shows the same credit, text, licence and link, chosen by the trackId of the result; the synthetic track shows none | `renderCredit($('lap-result-credit'), creditFor(selectedOption(result.trackId)))` ausente, `#lap-result-credit` ausente ou fora do painel de resultado, mais de um `renderCredit`, elemento não escondido sem crédito, `creditFor(synthetic)` ou `creditFor(undefined)` definidos |
| CHK-TEST-0009-05 | AC-US-0006-07 | every screen names the Kart Park as "Kart Park — São José dos Pinhais (traçado aproximado)" through optionLabel, outside the message table | rótulo diferente, `#track-name` ou os botões não recebendo `optionLabel`, "Circuito Aurora" de volta em `index.html`, "Kart Park" numa mensagem traduzida, rótulo sintético com comprimento |
| CHK-TEST-0009-06 | AC-US-0006-08 | the label of the Kart Park ends with the 687 m length next to the name | rótulo sem " · 687 m" no fim, comprimento não vindo da entrada, separador presente sem comprimento |
| CHK-TEST-0009-07 | AC-US-0006-09 | no screen text, module or data of the game carries the 41.45 s record of the real track | `41,45`, `41.45`, `41450`, `00:41`, `KARTPLAN`, `recorde:` ou `recordeMs` em `index.html`, `main.ts`, `lapMessages.ts`, `trainingSession.ts`, `trackScene.ts`, `curbFeedback.ts` ou `audio.ts`; `recorde` ou o valor no arquivo empacotado; `41` no catálogo |
| CHK-TEST-0009-08 | AC-US-0001-01, AC-US-0001-02, AC-US-0001-03 | the opening screen builds one selector button per catalogue entry, marks the selected one, opens on the Kart Park and offers the training lap only | `#track-selector` ausente, botões não construídos de `view.options`, `aria-pressed` não ligado a `selectedTrackId`, clique sem `chooseTrack`, `chooseTrack(OPENING_TRACK_ID)` ausente do nível superior ou chamado mais de uma vez, oferta com tipos de desafio, `startTrainingLap` sem o acerto, fontes não empacotadas, arquivo não importado como `?raw` |
| CHK-TEST-0009-09 | AC-US-0003-06 | an invalid lap shows its reason in the result title, and the missed-marker reason reads "marcador pulado" | `message('reasonMissedMarker', 'pt')` ≠ "marcador pulado" (en ≠ "missed marker"), mapa de razões alterado, título do resultado sem a razão |
| CHK-TEST-0009-10 | AC-US-0001-03 | a FAILED session shows the data error and offers no lap | ramo `FAILED`/`UNREADABLE`/`UNSUPPORTED_SCHEMA` sem `trackDataError` ou sem `return` antes da oferta, oferta não esvaziada |
