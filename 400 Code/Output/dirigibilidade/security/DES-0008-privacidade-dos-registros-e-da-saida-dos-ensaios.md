---
id: DES-0008
title: Privacidade dos registros, do texto compartilhado e da saída dos ensaios — implementação
feature: dirigibilidade
stage: code
status: validated
version: 1.1.0
sources: [API-0001, API-0002, API-0003, FEAT-0003, FEAT-0005, FEAT-0006, REQ-FEAT-0003-15, REQ-FEAT-0005-06, REQ-FEAT-0005-08, REQ-FEAT-0005-13, REQ-FEAT-0006-02, REQ-FEAT-0006-08, NFR-0004, NFR-0009]
---

# DES-0008 — Privacidade dos registros, do texto compartilhado e da saída dos ensaios — implementação

Restrição obedecida por DES-0003, DES-0004 e DES-0006; nenhum módulo novo.

## Realização por requisito

| Requisito | Arquivo e símbolo |
|---|---|
| REQ-FEAT-0003-15, REQ-FEAT-0005-06, -13 | `src/handlingMessages.ts:9` `formatSharedText` (só `trackId`, `trackVersion` e o tempo ou o estado; sem `setupVersion`, sem conteúdo de drift ou turbo, sem dado de aparelho, idioma, data ou nome) |
| REQ-FEAT-0005-08, NFR-0009 | `src/setupRecords.ts` `readReplay` (tipo, forma, faixa e tamanho verificados antes de ler elementos; sem `eval`) |
| REQ-FEAT-0006-02 | `src/setupRecords.ts`, `src/handlingMessages.ts`, `scripts/handlingBench.ts` (sem `fetch`, armazenamento do navegador, `os.hostname`, `os.userInfo`); `readBaseline` (`JSON.parse` em `try`), `stepContract` (texto de `src/physics.ts` só comparado por linha) |
| REQ-FEAT-0006-08, NFR-0004 | `scripts/keyboard-lap.ts:16-18` `runtimeId` (`platform-arch-nodeX-modelo da CPU`); `scripts/handlingBench.ts` `serialize` (identificadores, campos de API-0003, parâmetros; nunca caminho de arquivo) |

Segredos: nenhum; nenhum valor é lido do ambiente.
