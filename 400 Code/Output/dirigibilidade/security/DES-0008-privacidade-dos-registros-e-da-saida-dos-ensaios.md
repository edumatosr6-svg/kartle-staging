---
id: DES-0008
title: Privacidade dos registros, do texto compartilhado e da saída dos ensaios — implementação
feature: dirigibilidade
stage: code
status: validated
version: 1.0.0
sources: [API-0001, API-0002, API-0003, FEAT-0005, FEAT-0006, REQ-FEAT-0005-06, REQ-FEAT-0005-08, REQ-FEAT-0006-02, REQ-FEAT-0006-08, NFR-0004, NFR-0009]
---

# DES-0008 — Privacidade dos registros, do texto compartilhado e da saída dos ensaios — implementação

Restrição obedecida por DES-0003, DES-0004 e DES-0006; nenhum módulo novo.

## Realização por requisito

| Requisito | Arquivo e símbolo |
|---|---|
| REQ-FEAT-0005-06 | `src/handlingMessages.ts` `formatSharedText` (só `trackId`, `trackVersion`, tempo ou estado e `setupVersion` de `LapRecord`; nenhum campo de aparelho, idioma, data ou nome) |
| REQ-FEAT-0005-08 | `src/setupRecords.ts` `readReplay` (tipo, forma, faixa e tamanho verificados; texto acima de `MAX_REPLAY_TEXT_CHARS` e `inputs` acima de `MAX_REPLAY_INPUT_STEPS` são `UNREADABLE` antes de ler qualquer elemento; sem `eval`) |
| REQ-FEAT-0006-02 | `src/setupRecords.ts`, `src/handlingMessages.ts`, `scripts/handlingBench.ts` (sem `fetch`, `XMLHttpRequest`, `WebSocket`, `localStorage`, `sessionStorage`, `indexedDB`, `navigator.sendBeacon`, `os.hostname`, `os.userInfo`); `scripts/handlingBench.ts` `readBaseline` (`JSON.parse` em `try`; só os campos nomeados), `stepContract` (texto de `src/physics.ts` lido só para comparar linhas) |
| REQ-FEAT-0006-08 | `scripts/keyboard-lap.ts` `runtimeId` (`platform-arch-nodeX-modelo da CPU`, sem `os.hostname()` nem `os.userInfo()`); `scripts/handlingBench.ts` `serialize` (identificadores, campos de API-0003, parâmetros; nunca caminho de arquivo); `loadBaselineText` (o caminho nunca é impresso) |

## Pontos de verificação

| Fronteira | Onde | O que atravessa |
|---|---|---|
| Web Share / área de transferência | `src/main.ts` `#lap-share` `onclick` | `formatSharedText(lastRecord, lang)` |
| `readReplay(source)` | `src/setupRecords.ts` | objeto ou texto de origem não confiável, validado antes de qualquer leitura de elemento |
| `docs/physics.md` → `readBaseline` | `scripts/handlingBench.ts` | JSON do bloco `handling-baseline`, em `try`; registro sem `benchEnvironment` igual é ignorado |
| `BenchOptions.oldRecords` | `scripts/handlingBench.ts` `setupVersion` | passam por `readReplay`/`compareLapRecords` |
| stdout dos benches | `scripts/keyboard-lap.ts`, `scripts/physics-bench.ts` | registros, parâmetros e `runtimeId`; `console.warn` em `src/main.ts` só com códigos (`lap-record`/`INCOMPLETE_RECORD`) |

Segredos: nenhum; nenhum valor é lido do ambiente.
