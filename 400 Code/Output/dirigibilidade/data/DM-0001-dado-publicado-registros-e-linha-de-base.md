---
id: DM-0001
title: Dado publicado do acerto, registros de volta e replay, saída dos ensaios e linha de base — implementação
feature: dirigibilidade
stage: code
status: draft
version: 2.0.0
sources: [API-0002, API-0003, RULE-0002, RULE-0003, FEAT-0005, FEAT-0006, REQ-FEAT-0002-07, REQ-FEAT-0002-10, REQ-FEAT-0005-05, REQ-FEAT-0005-08, REQ-FEAT-0005-09, REQ-FEAT-0006-08, REQ-FEAT-0006-09, NFR-0004, NFR-0009]
---

# DM-0001 — Dado publicado do acerto, registros de volta e replay, saída dos ensaios e linha de base — implementação

Sem banco e sem armazenamento no navegador. As quatro formas de dado versionado:

| Forma | Onde | Situação |
|---|---|---|
| Dado publicado `PUBLISHED_SETUPS` (seção 1) | `src/physics.ts` `PUBLISHED_SETUPS` | existente; `ARCADE_ASSISTIDO` `arcade-assistido-v5` (`config` `ARCADE_ASSISTIDO_V5`, valores escolhidos na rodada 2; ver `01-implementation.md` desta rodada para o estado dos valores) com `previousSetupVersion` `arcade-assistido-v4` (`previousConfig` `ARCADE_KART`, intacto); `REALISTA_ALUGUEL_4T` `realista-aluguel-4t-v4` (`RENTAL_KART`, intacto) |
| `LapRecord` (seção 2) e `ReplayRecord` versão 1 (seção 3) | `src/setupRecords.ts` `LapRecord`, `ReplayRecord`, `REPLAY_FORMAT_VERSION`; `src/lap.ts` `LapRequest`, `LapSession`, `LapResult` | **alterado nesta rodada (M4)**: o `LapResult` de `race-lap-validation` carrega `setupId?` e `setupVersion?` copiados do pedido `startLap` sem interpretação (`src/lap.ts:23`, `:30-31`, `:54-55`, `:123-124`, `:278-279`), ausentes quando o pedido não os traz; `buildLapRecord` preenche só o que o resultado não traz (`src/setupRecords.ts:92-93`); `ReplayRecord` versão 1 inalterado |
| Saída dos ensaios (seção 4) | `scripts/handlingBench.ts` `BenchRecord` (união por `benchId`), `serialize` | alterado: sob API-0003 3.3.0, `v1Mps` presente em todo fim natural da varredura e, nos desfechos reprovados pela saída, só com patamar completo em subesterço; `offAsphaltStepCount` de `REFERENCE_CORNER` informativo com `THROTTLE_ZERO`, contando os passos fora da faixa na janela inteira (0 a 300); nenhum campo nem valor de enum acrescentado; parâmetros fora do contrato na linha `#` |
| Linha de base (seção 5) | `docs/physics.md`, bloco ` ```json handling-baseline ` | existente (M3, rodada 2): `entries` com `setupId`, `setupVersion`, `measuredAtUtc`, `runtimeId`, `parameters` e `records`; a entrada `arcade-assistido-v5` é refeita nesta rodada sob os vereditos de API-0003 3.3.0 (ver `01-implementation.md`); as entradas `arcade-assistido-v4` e `realista-aluguel-4t-v4` continuam válidas (ADR-0003, ADR-0004) |

## Realização por requisito

| Requisito | Arquivo e símbolo |
|---|---|
| REQ-FEAT-0002-07 | `scripts/handlingBench.ts` `sameSetting`, `baselineRecord`, `understeerBaselineRecord` (mesmo `benchId`, `benchEnvironment`, `inputMode`, variante, `arcRadiusM`, `laneWidthM`, `entrySpeedStepMps`; `plateauMs` e `plateauSpeedHoldMode` em `parameters`), `v1FromCompletePlateau` (V0 só de um `v1Mps` que é velocidade de patamar completo com `understeer` acima de 200 ms: `50 / 3.6` ou um par da lista acima de 200 ms; um `v1Mps` vindo do patamar interrompido não serve), `readBaseline`; `judge` (`BASELINE_MISSING` sem registro igual) |
| REQ-FEAT-0002-10 | `scripts/handlingBench.ts` `understeerOnset` (a varredura termina no primeiro passo fora da faixa; a velocidade nesse passo decide por `observed`; `v1Mps` definido em todo fim natural), `judge` |
| REQ-FEAT-0005-05 | `src/physics.ts` `PUBLISHED_SETUPS`; `src/lap.ts` `startLap`, `buildResult` (cópia dos dois campos); `src/setupRecords.ts` `buildLapRecord` (preenche só o que falta), `buildReplayRecord` |
| REQ-FEAT-0005-08 | `src/setupRecords.ts` `readReplay`, `resolveSetupRef` (forma anterior lida com `RESOLVED_FROM_ABSENCE`; versão maior é `UNSUPPORTED_FORMAT`, intacta); um `LapResult` sem os dois campos é resolvido na leitura, nunca em `src/lap.ts` |
| REQ-FEAT-0005-09 | `src/physics.ts` `ARCADE_KART` intacto como `previousConfig`; `ARCADE_ASSISTIDO_V5` registro novo |
| REQ-FEAT-0006-08 | `docs/physics.md` (entrada datada em prosa por `setupVersion` e bloco `handling-baseline` com `benchEnvironment`, `parameters` e os campos de API-0003 de todos os ensaios); `scripts/handlingBench.ts` `baselineEntry` |
| REQ-FEAT-0006-09 | `scripts/handlingBench.ts` `stepCost` (linha de base só com o mesmo `runtimeId`), `judge` (`BASELINE_MISSING`) |

## Plano de migração

| Passo | Estado | Reversão |
|---|---|---|
| M1 `PUBLISHED_SETUPS` | feito na rodada 1; valores de `ARCADE_ASSISTIDO_V5` escolhidos na rodada 2 (o identificador ainda não foi entregue) | remover a declaração |
| M2 `LapRecord`/`ReplayRecord` versão 1 | feito na rodada 1, mantido | remover os leitores |
| M3 bloco `handling-baseline` em `docs/physics.md` | feito na rodada 2; entrada `arcade-assistido-v5` refeita nesta rodada | apagar o bloco; a prosa permanece |
| M4 `setupId?`/`setupVersion?` em `LapRequest`, `LapSession` e `LapResult` (`src/lap.ts`), copiados do pedido; `buildLapRecord` preenche só o que o resultado não traz; os pedidos de volta desta feature (`src/main.ts:226`, `src/setupRecords.ts:112`, `scripts/handlingBench.ts:499`, `scripts/keyboard-lap.ts:26`) informam os dois campos | **feito nesta rodada** | remover os campos e as cópias; `buildLapRecord` volta a preencher sempre com o `setup` recebido; nenhum registro foi persistido com os campos vindos do resultado, nada a reverter |

Backfill: nenhum. Janela de compatibilidade: os campos novos são opcionais na leitura; um `LapResult` de volta iniciada sem eles
(testes de `race-lap-validation`, registros antigos) continua válido e é resolvido pelos padrões de `resolveSetupRef`; um registro
de linha de base sem `benchEnvironment` igual é ignorado por `sameSetting` em vez de lido errado.
