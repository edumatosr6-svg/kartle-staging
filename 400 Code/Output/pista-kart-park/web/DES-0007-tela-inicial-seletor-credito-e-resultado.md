---
id: DES-0007
title: Tela inicial com seletor e crédito, crédito no painel do resultado da volta do treino e nome da pista da sessão — implementação
feature: pista-kart-park
stage: code
status: validated
version: 1.3.0
sources: [SCR-0001, SCR-0002, FLOW-0001, FEAT-0001, FEAT-0003, FEAT-0006, REQ-FEAT-0001-01, REQ-FEAT-0001-02, REQ-FEAT-0001-03, REQ-FEAT-0001-04, REQ-FEAT-0001-11, REQ-FEAT-0001-13, REQ-FEAT-0001-14, REQ-FEAT-0003-09, REQ-FEAT-0003-14, REQ-FEAT-0006-01, REQ-FEAT-0006-02, REQ-FEAT-0006-03, REQ-FEAT-0006-04, REQ-FEAT-0006-05, REQ-FEAT-0006-06, REQ-FEAT-0006-07, REQ-FEAT-0006-08, REQ-FEAT-0006-09, REQ-FEAT-0006-10, REQ-FEAT-0006-11, REQ-FEAT-0006-12, REQ-FEAT-0006-13]
---

# DES-0007 — Tela inicial com seletor e crédito, crédito no resultado e nome da pista — implementação

Projeto: DES-0007 1.3.0 e ADR-0007 1.0.0 (rodada 4). Camada aplicação: `src/main.ts` (553 → 646 linhas na rodada 1; 670 na rodada 4), `index.html`, `src/style.css` (linha 8), `src/lapMessages.ts` (77 → 95
linhas na rodada 1, `MESSAGES` intacto por esta feature; 120 linhas na árvore da rodada 4, com o que `race-lap-validation` acrescentou), `src/rawImports.d.ts` novo. `src/main.ts` não decide regra: sessão, escolha e oferta vêm de
`src/trainingSession.ts`; crédito e rótulo de `creditFor`/`optionLabel`; validade e tempos de `src/lap.ts`. `startLap(` não é
chamado por `src/main.ts` (só `startTrainingLap`); "Circuito Aurora", "41,45" e "41.45" não aparecem em `index.html` nem em `src/main.ts`.

## Realização por requisito

| Requisito | Arquivo e símbolo |
|---|---|
| REQ-FEAT-0001-01; SCR-0001 | `index.html:19` `#track-selector` (`role="group"`, `aria-label="Pista"`); `src/main.ts` `renderOffer` (`:252-284`: dois `button type="button"` com `data-track-id`, texto `optionLabel(opção)`, `aria-pressed` na selecionada, `onclick` → `chooseTrack`) |
| REQ-FEAT-0001-02, -04 | `chooseTrack(OPENING_TRACK_ID)` na carga do módulo (`:669`); nenhuma leitura de escolha anterior |
| REQ-FEAT-0001-03 | nenhum `localStorage`, `sessionStorage`, IndexedDB ou cookie em `src/main.ts` (`tests/race-lap-validation-layering.test.ts` verde) |
| REQ-FEAT-0001-11 | `renderOffer` oferece `offeredLapKinds(reading, [])` só com sessão `READY` (`:276-283`), isto é, `TRAINING` |
| REQ-FEAT-0001-13 | o aviso `controlFallbackTouch` existente (`src/main.ts`, laço de quadros) e o seletor não dependem do sensor |
| REQ-FEAT-0001-14 | `renderOffer` com `FAILED`, `UNREADABLE` ou `UNSUPPORTED_SCHEMA`: `#track-status` = `trackDataError`, nenhuma oferta, os dois botões habilitados, crédito pelo catálogo (`:272-275`); `#track-status` = `loadingTrack` com `NO_SESSION`/`LOADING` (`:271`) |
| REQ-FEAT-0006-01 a -06, -12, -13 | `src/lapMessages.ts` `OSM_CREDIT` (`:105-109`: `© colaboradores do OpenStreetMap`, `licença ODbL`, `https://openstreetmap.org/copyright`); `src/main.ts` `renderCredit` (`:213-223`: `textContent`, `setAttribute` `href`/`target="_blank"`/`rel="noopener noreferrer"`, nunca `innerHTML`), chamado em `#track-credit` (`:267`, `creditFor` da entrada de `selectedTrackId`) e em `#lap-training-result-credit` (`:484`, `creditFor(selectedOption(result.trackId))`, o `trackId` do resultado exibido) — ADR-0007: no mesmo ramo em que `renderTrainingResult` redesenha o painel (resultado novo ou idioma novo); o redesenho (`:479-483`) remove só os elementos do resultado e os insere antes do contêiner do crédito, último filho do painel, que nunca é removido; com o painel oculto o crédito fica oculto com ele; `index.html:19` (`#track-credit`), `:26` (`#lap-training-result-credit` em `#lap-training-result`); `#lap-result-credit` retirado de `index.html` e `renderResult` não chama `renderCredit` (nenhum `lap-result-credit` em `src/` nem em `index.html`); o link do painel recebe `pointer-events:auto` (`src/style.css:8`) e abre outra aba; texto local, sem rede |
| REQ-FEAT-0006-10 | `creditFor` (`src/lapMessages.ts:113-115`): `OSM_CREDIT` só com `osmCredit` verdadeiro; `undefined` para a sintética e para entrada ausente |
| REQ-FEAT-0006-07, -08, -11 | `optionLabel` (`src/lapMessages.ts:118-120`): `Kart Park — São José dos Pinhais (traçado aproximado) · 687 m` e `Pista sintética`; `#track-name` (`index.html:17`) recebe `optionLabel` em `chooseTrack` (`src/main.ts:248`); nenhum desses textos passa por `message()`/`resolveLanguage` |
| REQ-FEAT-0006-09 | nenhum recorde nas telas; o melhor tempo exibido continua o registro da página de `dirigibilidade` |
| REQ-FEAT-0003-09, -14; SCR-0002; FEAT-0003 | o resultado de cada volta do treino é o painel `#lap-training-result` de `race-lap-validation` (`renderTrainingResult`, `:461-487`: validade, motivo "marcador pulado", tempo total, 4 setores, "não oficial"), sem mudança além do crédito; `renderResult` (`:488-516`) só exibe volta oficial e de reconhecimento e não tem crédito |
| FLOW-0001; FEAT-0001; FEAT-0006 | `chooseTrack` (`:225-250`): `selectTrainingTrack`, `training`/`lap` substituídos, avisos `track-data`, estado da zebra zerado, cena, caixa da câmera, `#track-name`, `renderBest`; `beginLap` (`:308-319`) por `startTrainingLap` com `{setupId, setupVersion}` no quarto argumento (`:309`, DES-0007 1.2.0); guarda de `renderOffer` por `lang:sessionState:selectedTrackId:trackDataStatus` (`:253-256`); o seletor é alcançado na abertura e depois de "encerrar treino" (`emitEndTraining`, `:203-209`, de `race-lap-validation`, mostra `#welcome`) |
| SCR-0001 (estilo) | `src/style.css:8` `.track-selector` (linha flexível; `aria-pressed=true` com a cor de `.primary`), `.track-credit a` (`#d5ef91`, sublinhado), `#lap-training-result-credit a{pointer-events:auto}` (rodada 4); o crédito usa `lap-chip` (tamanho mínimo e contraste já verificados) |

Visto em tela (`vite preview`): abertura na Kart Park com seletor, crédito, nome e oferta; troca para a sintética sem crédito;
volta de treino iniciada (rodada 1; o crédito no painel da rodada 4 não foi visto em tela por esta etapa). A prova por texto (`tests/pista-kart-park-screens.test.ts`) e os roteiros E2E são do estágio de testes.
