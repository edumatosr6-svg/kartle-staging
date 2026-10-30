---
id: DM-0001
title: Dado publicado do acerto, registros de volta e replay, saída dos ensaios e linha de base — implementação
feature: dirigibilidade
stage: code
status: validated
version: 3.0.0
sources: [API-0002, API-0003, RULE-0002, RULE-0003, FEAT-0005, FEAT-0006, REQ-FEAT-0002-06, REQ-FEAT-0005-05, REQ-FEAT-0005-08, REQ-FEAT-0005-09, REQ-FEAT-0006-08, REQ-FEAT-0006-09, NFR-0004, NFR-0009]
---

# DM-0001 — Dado publicado, registros, saída dos ensaios e linha de base — implementação

Sem banco nem armazenamento no navegador. Passos de migração do projeto (DM-0001 3.0.1) executados nesta rodada:

| Passo | Onde | Reversão |
|---|---|---|
| M5 | `src/physics.ts:92-95` (`ARCADE_ASSISTIDO_V6`) e `:106-107` (`PUBLISHED_SETUPS.ARCADE_ASSISTIDO` em `arcade-assistido-v6`; `previousSetupVersion` e `previousConfig` inalterados) | voltar `PUBLISHED_SETUPS.ARCADE_ASSISTIDO` a `arcade-assistido-v5`/`ARCADE_ASSISTIDO_V5` e remover o literal; nada persistido carrega a versão |
| M6 | `docs/physics.md`, bloco ` ```json handling-baseline `: entradas `arcade-assistido-v4` e `realista-aluguel-4t-v4` medidas de novo em 2026-10-30 com os ensaios de API-0003 4.0.1 (56 registros cada) e substituídas na mesma chave; `arcade-assistido-v6` acrescentada (56 registros, 2026-10-30T13:55Z); `arcade-assistido-v5` mantida (46 registros, histórico); uma entrada por (`setupId`, `setupVersion`, `runtimeId`); prosa datada `## Dirigibilidade — Arcade assistido v6` antes do bloco | restaurar o bloco anterior pelo controle de versão; a prosa de 2026-10-22 e 2026-10-27 não foi apagada |

## Realização por requisito

| Requisito | Arquivo e símbolo |
|---|---|
| REQ-FEAT-0005-05, -09 | `src/physics.ts` `PUBLISHED_SETUPS`, `ARCADE_ASSISTIDO_V6`, `ARCADE_ASSISTIDO_V5`, `ARCADE_KART` |
| REQ-FEAT-0005-08, NFR-0009 | `src/setupRecords.ts` `LapRecord`, `ReplayRecord`, `resolveSetupRef`, `readReplay` (inalterados; os campos de treino de `LapResult` 1.2.0 de `race-lap-validation` ainda não existem na árvore — `98-divergences.md`, linha R) |
| REQ-FEAT-0002-06 | `scripts/handlingBench.ts` `BenchRecord` (campos de API-0003 4.0.1, `TestPadFields` em todo registro `TEST_PAD`) e `serialize` |
| REQ-FEAT-0006-08, NFR-0004 | `docs/physics.md` (prosa datada e bloco); `scripts/handlingBench.ts` `baselineEntry`, `readBaseline` |
| REQ-FEAT-0006-09 | `scripts/handlingBench.ts` `stepCost` (entrada da `previousSetupVersion` com o mesmo `runtimeId`) |
