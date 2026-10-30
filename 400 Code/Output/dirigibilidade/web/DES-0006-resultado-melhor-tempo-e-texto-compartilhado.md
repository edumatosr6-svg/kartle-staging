---
id: DES-0006
title: Resultado, melhor tempo só comparável e texto compartilhado, sem a versão do acerto nem o drift — implementação
feature: dirigibilidade
stage: code
status: validated
version: 2.0.0
sources: [SCR-0002, FLOW-0003, API-0002, FEAT-0003, FEAT-0005, REQ-FEAT-0003-14, REQ-FEAT-0003-15, REQ-FEAT-0005-05, REQ-FEAT-0005-06, REQ-FEAT-0005-08, REQ-FEAT-0005-10, REQ-FEAT-0005-13]
---

# DES-0006 — Resultado, melhor tempo e texto compartilhado — implementação

`src/handlingMessages.ts`, `src/main.ts` e `index.html`, camada aplicação, alterados na rodada de código 5 (projeto DES-0006 2.0.0).

## Realização por requisito

| Requisito | Arquivo e símbolo |
|---|---|
| REQ-FEAT-0003-15, REQ-FEAT-0005-13 | `src/handlingMessages.ts:9` `formatSharedText` (`Kartle · <trackId> v<trackVersion> · <tempo ou estado inválido>`; sai `· <setupVersion>`); `index.html` sem `#lap-result-setup`; `src/main.ts` `renderResult` (`:452`) sem a escrita da versão |
| REQ-FEAT-0003-14 | nenhum conteúdo de drift no resultado nem no texto compartilhado (`LapResult`/`LapRecord` sem campo de drift) |
| REQ-FEAT-0005-05, -06, -08 | `src/main.ts:289-300` `recordLapResult` (recebe um `LapResult`, não lê a fase: `buildLapRecord`, `bestRecord` só com `COMPARABLE` e tempo menor, `INCOMPLETE_RECORD` só como `console.warn` do código), `renderBest` (melhor tempo só `COMPARABLE` com o acerto corrente) |
| REQ-FEAT-0005-10 | nenhuma tela de replay nesta entrega (ADR-0002); `replayLap` em DES-0003 |

O gatilho do tratamento é de `race-lap-validation`: hoje a chegada da fase a `ENDED` (`src/main.ts:530-533`, chamando
`recordLapResult`); o gatilho "cada item novo de `listLapResults`" do D-Spec daquela feature depende de código que ainda não está na
árvore (`98-divergences.md`, linha R).
