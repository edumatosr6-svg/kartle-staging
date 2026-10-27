---
id: DES-0006
title: Resultado com a versão do acerto, melhor tempo comparável e texto compartilhado — implementação
feature: dirigibilidade
stage: code
status: draft
version: 1.1.0
sources: [SCR-0002, FLOW-0003, API-0002, FEAT-0005, REQ-FEAT-0005-05, REQ-FEAT-0005-06, REQ-FEAT-0005-08, REQ-FEAT-0005-10]
---

# DES-0006 — Resultado com a versão do acerto, melhor tempo comparável e texto compartilhado — implementação

Módulo `src/handlingMessages.ts` (camada aplicação, puro: importa `src/lapMessages.ts` e tipos de `src/setupRecords.ts`);
`src/main.ts` (registros da volta, melhor tempo, compartilhar); `index.html` (`#lap-result-setup` e `#lap-share` dentro de
`#lap-result`, com a classe `lap-chip` existente, sem CSS novo). Nenhum dos três muda nesta rodada (3, Mode C) por este item: só a
leitura de `buildLapRecord` (`src/main.ts:429`) muda de significado sob o FB-01 de `race-lap-validation` — como `beginLap` informa
`setupId` e `setupVersion` no pedido de `startLap` (DES-0007), o `result` já os carrega e `buildLapRecord` só os copia; o `setupRef`
é o recuo para um resultado sem os campos (DES-0003).

## Realização por requisito

| Requisito | Arquivo e símbolo |
|---|---|
| REQ-FEAT-0005-05 | `src/main.ts` `frame` (ao entrar em `ENDED`: `lastRecord = buildLapRecord(result, setupRef)`, `:429`, com o `result` já carregando os dois campos do pedido); `renderResult` (`#lap-result-setup` = `lastRecord.setupVersion`) |
| REQ-FEAT-0005-06 | `src/main.ts` `frame` (`bestRecord` só avança com `compareLapRecords(bestRecord, lastRecord)` `COMPARABLE` e tempo menor); `renderBest` (`#best` mostra o tempo só quando `COMPARABLE` com o acerto corrente na pista corrente, senão `—`); `src/handlingMessages.ts` `formatSharedText` (nunca um segundo tempo nem diferença) |
| REQ-FEAT-0005-08 | `src/main.ts` `frame`, `renderBest` (`INCOMPLETE_RECORD` → `console.warn('lap-record', code)`, nenhuma comparação, nenhum registro descartado) |
| REQ-FEAT-0005-10 | `src/main.ts` `renderBest` (um registro de outra `setupVersion` nunca é mostrado como melhor tempo); `src/setupRecords.ts` `replayLap` (DES-0003) |

## Interface

| Símbolo | Assinatura | Comportamento |
|---|---|---|
| `formatSharedText(record, lang)` | `(LapRecord, 'pt' \| 'en') => string` | `Kartle · <trackId> v<trackVersion> · <formatLapTime(lapMs)> · <setupVersion>`; volta inválida leva `lapStateInvalid` no lugar do tempo |
| `shareLabel(lang)` | `('pt' \| 'en') => string` | `compartilhar` / `share` |
| `#lap-share` `onclick` | `src/main.ts` | `navigator.share({ text })` quando existe, senão `navigator.clipboard.writeText(text)`, em `try`/`catch` com `notify` de falha; nenhum registro muda |

Estado local de `src/main.ts`: `lastRecord` e `bestRecord` (`LapRecord | undefined`), construídos uma vez por volta encerrada
(`lastPhase !== 'ENDED'`); trocar peso ou acerto zera `bestRecord` e chama `renderBest`. Nada é persistido.
