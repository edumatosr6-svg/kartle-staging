---
id: DES-0008
title: HUD da volta, mensagens, idioma e legibilidade — implementação
feature: race-lap-validation
stage: code
status: validated
version: 1.1.0
sources: [FEAT-0001, FEAT-0002, FEAT-0004, FEAT-0005, FEAT-0006, FEAT-0007, FEAT-0010, REQ-FEAT-0001-02, REQ-FEAT-0001-03, REQ-FEAT-0001-04, REQ-FEAT-0001-09, REQ-FEAT-0001-10, REQ-FEAT-0002-06, REQ-FEAT-0002-09, REQ-FEAT-0004-04, REQ-FEAT-0004-08, REQ-FEAT-0005-05, REQ-FEAT-0005-08, REQ-FEAT-0006-02, REQ-FEAT-0006-05, REQ-FEAT-0007-01, REQ-FEAT-0007-02, REQ-FEAT-0007-03, REQ-FEAT-0007-04, REQ-FEAT-0007-05, REQ-FEAT-0007-06, REQ-FEAT-0007-07, REQ-FEAT-0007-08, REQ-FEAT-0007-09, REQ-FEAT-0007-10, REQ-FEAT-0007-11, REQ-FEAT-0007-12, REQ-FEAT-0007-13, REQ-FEAT-0007-14, REQ-FEAT-0010-02, REQ-FEAT-0010-04, REQ-FEAT-0010-07, REQ-FEAT-0010-11, REQ-FEAT-0010-12, REQ-FEAT-0010-13, REQ-FEAT-0010-15, REQ-FEAT-0010-16, REQ-FEAT-0010-19, REQ-FEAT-0010-23, REQ-FEAT-0010-24, REQ-FEAT-0010-25, REQ-FEAT-0010-27]
---

# DES-0008 — HUD da volta, mensagens, idioma e legibilidade — implementação

`src/lapMessages.ts` novo (camada aplicação, puro, importa só o tipo `LapStateView`); `index.html` e `src/style.css`
alterados; `renderHud` em `src/main.ts`.

## Realização por requisito

| Requisito | Arquivo e símbolo |
|---|---|
| REQ-FEAT-0001-02 | `src/lapMessages.ts` `describeLap` (`countdownText = ceil(countdownRemainingMs / 1000)`); `index.html` `#lap-countdown`; `src/main.ts` `renderHud` |
| REQ-FEAT-0001-03 | `src/lapMessages.ts` `greenSignalVisible` (`RUNNING` e `stepCount < 120`) e a chave `countdownGreenSignal`; `src/main.ts` `renderHud` |
| REQ-FEAT-0001-04 | `src/main.ts` `renderHud` (`#timer` = `formatLapTime(view.elapsedMs)`, 0 na contagem); `index.html` `#timer` inicial `0:00.000` |
| REQ-FEAT-0001-09, REQ-FEAT-0001-10 | `src/style.css` `--lap-countdown-size` 48px, `#lap-countdown` `font-size: max(var(--lap-countdown-size), 6vw)`, `--lap-text` sobre `--lap-chip-bg` (16,2:1) |
| REQ-FEAT-0002-06 | `src/lapMessages.ts` `formatLapTime` (`m:ss.mmm`, sem arredondar) |
| REQ-FEAT-0002-09 | `src/main.ts` `renderHud` (`#lap-sectors` com `sectorLabel` n e `formatLapTime(completedSectorMs[n-1])`) |
| REQ-FEAT-0004-04, REQ-FEAT-0005-05, REQ-FEAT-0006-02 | `src/lapMessages.ts` `describeLap` (`reasonText` por `invalidReason`) e as chaves `reasonMissedMarker`, `reasonCut`, `reasonReposition` |
| REQ-FEAT-0004-08, REQ-FEAT-0005-08, REQ-FEAT-0006-05 | `src/lapMessages.ts` `describeLap` (`lapStateValidInProgress` enquanto `lapValidity` é `VALID`, sem `reasonText`) |
| REQ-FEAT-0007-01, -02, -03, -14 | `src/main.ts` `renderHud` (lê `getLapState` a cada quadro; `#lap-state` com `stateText` e `reasonText`, atualizado só quando o texto muda, `data-validity` para a cor) |
| REQ-FEAT-0007-04, REQ-FEAT-0007-10 | `index.html` `#lap-state`, `#lap-countdown`, `#lap-paused` (texto em `role="status"`; a cor é adicional) |
| REQ-FEAT-0007-05, -06, -07, -11, -13 | `src/lapMessages.ts` `resolveLanguage`, `message`, `MESSAGES` (20 chaves em pt e en); `src/main.ts` laço de quadros (`lang = resolveLanguage(navigator.language)` a cada quadro) |
| REQ-FEAT-0007-08, REQ-FEAT-0007-09 | `src/style.css` `--lap-chip-bg`, `--lap-chip-invalid-bg` (10,3:1), `--lap-state-size` 16px, `.lap-chip` `font-size: max(var(--lap-state-size), 1rem)` com fundo opaco |
| REQ-FEAT-0007-12 | `src/main.ts` `renderHud` (`#lap-paused` com `pausedText`; o estado exibido é o da sessão, inalterado pela pausa) |
| REQ-FEAT-0010-02, REQ-FEAT-0010-24 | `src/lapMessages.ts` `describeTrainingResult`; `src/main.ts` `renderTrainingResult` (`#lap-training-result`: validade e motivo, tempo total e "não oficial", quatro setores) |
| REQ-FEAT-0010-04 | `src/lapMessages.ts` `describeLap` (`countdownText` só em `COUNTDOWN`) e `greenSignalVisible` (`stepCount < 120`, que não recomeça no treino) |
| REQ-FEAT-0010-07, REQ-FEAT-0010-11, REQ-FEAT-0010-19 | `src/main.ts` `renderHud` (`#lap-state` lê `lapValidity` e `invalidReason` de `getLapState` a cada quadro: "inválida · corte" depois da invalidação, "válida em andamento" no início de cada volta, inalterado pelo reposicionamento) |
| REQ-FEAT-0010-12, REQ-FEAT-0010-13 | `src/main.ts` `renderHud` (`#lap-best-valid` = `bestValidLap` + `formatLapTime(bestValidLapMs)`, visível só com o campo); `src/lapMessages.ts` chave `bestValidLap` |
| REQ-FEAT-0010-15, REQ-FEAT-0010-16 | `src/lapMessages.ts` chaves `pauseAction` e `endTrainingAction`; `src/main.ts` rótulos de `#pause` e `#lap-end-training` |
| REQ-FEAT-0010-23 | `src/lapMessages.ts` `formatSectorTime` (`null` dá `sectorNoTime`, "—") |
| REQ-FEAT-0010-25 | `src/lapMessages.ts` `describeTrainingResult` (`unofficialText` quando `official` é falso) |
| REQ-FEAT-0010-27 | `src/lapMessages.ts` `describeTrainingResult` (`sectorTexts` só com `trainingSectorMs`); `src/main.ts` `renderTrainingResult` (nenhuma lista de setores sem eles) |

## Elementos e fichas

`index.html`: `#lap-countdown`, `#lap-state`, `#lap-paused`, `#lap-sectors`, `#lap-control-fallback`, `#timer`
(existente), todos dentro de `.game-shell`. `src/style.css`, em `:root`: `--lap-text` `#ffffff`, `--lap-chip-bg`
`#13241e`, `--lap-chip-invalid-bg` `#7a1f12`, `--lap-countdown-size` `48px`, `--lap-state-size` `16px`. Os rótulos
pré-existentes da página permanecem em português.

## Rodada 2 (2026-10-30): treino de voltas seguidas (FEAT-0010)

Chaves novas: `pauseAction`, `endTrainingAction`, `bestValidLap`, `sectorNoTime` (24 no total); `startTraining` passou a "treino"/"training". Funções novas: `formatSectorTime`, `describeTrainingResult`. Elementos novos em `index.html`: `#lap-best-valid` e `#lap-training-result` (coluna direita, abaixo de `.timing`), estilos em `src/style.css` com as fichas existentes (`--lap-chip-bg`, `--lap-chip-invalid-bg`), sem propriedade de cor nova. O painel do resultado do treino é refeito só quando muda o `lapSequenceCount` do último resultado ou o idioma, e fica oculto fora do treino, em `ENDED` e sem resultado.
