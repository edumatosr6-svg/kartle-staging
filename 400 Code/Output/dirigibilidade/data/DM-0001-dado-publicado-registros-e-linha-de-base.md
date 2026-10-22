---
id: DM-0001
title: Dado publicado do acerto, registros de volta e replay, saída dos ensaios e linha de base — implementação
feature: dirigibilidade
stage: code
status: draft
version: 1.0.0
sources: [API-0002, API-0003, RULE-0002, RULE-0003, FEAT-0005, FEAT-0006, REQ-FEAT-0002-07, REQ-FEAT-0002-10, REQ-FEAT-0005-05, REQ-FEAT-0005-08, REQ-FEAT-0005-09, REQ-FEAT-0006-08, REQ-FEAT-0006-09, NFR-0004, NFR-0009]
---

# DM-0001 — Dado publicado do acerto, registros de volta e replay, saída dos ensaios e linha de base — implementação

Sem banco e sem armazenamento no navegador. As quatro formas de dado versionado:

| Forma | Onde | Situação |
|---|---|---|
| Dado publicado `PUBLISHED_SETUPS` (seção 1) | `src/physics.ts` `PUBLISHED_SETUPS` | existente; `ARCADE_ASSISTIDO` `arcade-assistido-v5` (`config` `ARCADE_ASSISTIDO_V5`, retunado nesta rodada antes da primeira entrega sob esse identificador) com `previousSetupVersion` `arcade-assistido-v4` (`previousConfig` `ARCADE_KART`, intacto); `REALISTA_ALUGUEL_4T` `realista-aluguel-4t-v4` (`RENTAL_KART`, intacto) |
| `LapRecord` (seção 2) e `ReplayRecord` versão 1 (seção 3) | `src/setupRecords.ts` `LapRecord`, `ReplayRecord`, `REPLAY_FORMAT_VERSION` | existentes, mantidos (M2) |
| Saída dos ensaios (seção 4) | `scripts/handlingBench.ts` `BenchRecord` (união por `benchId`), `serialize` | alterado: `benchEnvironment` em todo registro; os campos da revisão 3 e de API-0003 3.1.0/3.2.0 (tabela de DES-0004); parâmetros fora do contrato na linha `#` |
| Linha de base (seção 5) | `docs/physics.md`, bloco ` ```json handling-baseline ` | **novo (M3)**: `entries` com `setupId`, `setupVersion`, `measuredAtUtc`, `runtimeId`, `parameters` (`BENCH_PARAMETERS` da execução mais `runtimeId`) e `records`, uma entrada para `arcade-assistido-v4` (`npm run bench:handling -- --previous`), uma para `realista-aluguel-4t-v4` (`--realista`) e uma para `arcade-assistido-v5` (sem argumento, julgada contra as duas anteriores) |

## Realização por requisito

| Requisito | Arquivo e símbolo |
|---|---|
| REQ-FEAT-0002-07 | `scripts/handlingBench.ts` `sameSetting`, `baselineRecord`, `understeerBaselineRecord` (mesmo `benchId`, `benchEnvironment`, `inputMode`, variante, `arcRadiusM`, `laneWidthM`, `entrySpeedStepMps`; `plateauMs` e `plateauSpeedHoldMode` em `parameters`; `v1Mps` presente), `readBaseline`; `judge` (`BASELINE_MISSING` sem registro igual) |
| REQ-FEAT-0002-10 | `scripts/handlingBench.ts` `understeerOnset` (a varredura termina no primeiro passo fora da faixa; a velocidade nesse passo decide por `observed`), `judge` |
| REQ-FEAT-0005-05 | `src/physics.ts` `PUBLISHED_SETUPS`; `src/setupRecords.ts` `buildLapRecord`, `buildReplayRecord` |
| REQ-FEAT-0005-08 | `src/setupRecords.ts` `readReplay`, `resolveSetupRef` (forma anterior lida com `RESOLVED_FROM_ABSENCE`; versão maior é `UNSUPPORTED_FORMAT`, intacta) |
| REQ-FEAT-0005-09 | `src/physics.ts` `ARCADE_KART` intacto como `previousConfig`; `ARCADE_ASSISTIDO_V5` registro novo |
| REQ-FEAT-0006-08 | `docs/physics.md` (entrada datada em prosa por `setupVersion` e bloco `handling-baseline` com `benchEnvironment`, `parameters` e os campos de API-0003 de todos os ensaios); `scripts/handlingBench.ts` `baselineEntry` |
| REQ-FEAT-0006-09 | `scripts/handlingBench.ts` `stepCost` (linha de base só com o mesmo `runtimeId`), `judge` (`BASELINE_MISSING`) |

## Plano de migração

| Passo | Estado | Reversão |
|---|---|---|
| M1 `PUBLISHED_SETUPS` | feito na rodada 1; os valores de `ARCADE_ASSISTIDO_V5` mudam nesta rodada (o identificador ainda não foi entregue) | remover a declaração |
| M2 `LapRecord`/`ReplayRecord` versão 1 | feito na rodada 1, mantido | remover os leitores |
| M3 bloco `handling-baseline` em `docs/physics.md` | **feito nesta rodada**, gerado a partir da saída de `npm run bench:handling` (`--previous`, `--realista`, corrente) | apagar o bloco; a prosa permanece |

Backfill: nenhum. Janela de compatibilidade: os campos novos são opcionais na leitura; um registro de linha de base sem
`benchEnvironment` igual é ignorado por `sameSetting` em vez de lido errado.
