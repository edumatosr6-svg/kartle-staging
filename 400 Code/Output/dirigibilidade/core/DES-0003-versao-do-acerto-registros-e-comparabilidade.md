---
id: DES-0003
title: Versão do acerto, registros de volta e replay e comparabilidade (API-0002) — implementação
feature: dirigibilidade
stage: code
status: validated
version: 3.0.0
sources: [API-0002, RULE-0003, FLOW-0003, FEAT-0005, FEAT-0006, REQ-FEAT-0005-01, REQ-FEAT-0005-05, REQ-FEAT-0005-06, REQ-FEAT-0005-08, REQ-FEAT-0005-09, REQ-FEAT-0005-10, REQ-FEAT-0005-13, REQ-FEAT-0006-03]
---

# DES-0003 — Versão do acerto, registros de volta e replay e comparabilidade (API-0002) — implementação

`src/setupRecords.ts`, camada simulação, existente e alterado na rodada de código 5 (projeto DES-0003 2.1.1) num ponto: o fim da
reprodução em `replayLap` (`:120-123`) passa a ser o primeiro passo em que `getLapResult` devolve um resultado, em vez da fase
`ENDED` (FB-01 de `race-lap-validation`; hoje os dois instantes coincidem). A versão nova chega pelo dado publicado
(`PUBLISHED_SETUPS`, DES-0001). `src/lap.ts` não foi tocado nesta rodada (os campos `setupId?`/`setupVersion?` são da rodada 3).

## Realização por requisito

| Requisito | Arquivo e símbolo |
|---|---|
| REQ-FEAT-0005-01 | `src/setupRecords.ts:108` `replayLap` (reprodução passo a passo por `stepLap`; mesma sequência, mesmo `LapRecord`; termina no primeiro resultado, `:121`) |
| REQ-FEAT-0005-05 | `src/setupRecords.ts:92` `buildLapRecord` (preenche só o que o resultado não traz), `:97` `buildReplayRecord`; `src/physics.ts:106` `PUBLISHED_SETUPS` (`arcade-assistido-v6` ≠ `arcade-assistido-v4`) |
| REQ-FEAT-0005-06, -13 | `src/setupRecords.ts:79` `compareLapRecords` (tabela de RULE-0003; `arcade-assistido-v5` contra `arcade-assistido-v6` dá `SETUP_VERSION_DIFFERS`); a tela e o texto compartilhado só recebem o resultado (DES-0006) |
| REQ-FEAT-0005-08 | `src/setupRecords.ts:46` `resolveSetupRef` (`RESOLVED_FROM_ABSENCE`; `arcade-assistido-v5` declarada lida como `DECLARED`), `:54` `readReplay` |
| REQ-FEAT-0005-09 | `src/physics.ts` `ARCADE_KART`, `ARCADE_ASSISTIDO_V5` (intactos), `ARCADE_ASSISTIDO_V6`; `src/setupRecords.ts:39` `getSetupVersion` |
| REQ-FEAT-0005-10 | `src/setupRecords.ts:108-128` `replayLap` (pedido com o acerto corrente; um comando de drift gravado chega a `stepLap` e não tem efeito, DES-0001) |
| REQ-FEAT-0006-03 | `replayLap` (`step`, `STEP` e `Input` inalterados) |

## Interface

`getSetupVersion`, `resolveSetupRef`, `readReplay`, `compareLapRecords`, `buildLapRecord`, `buildReplayRecord` inalterados;
`replayLap(record, reading, setup, driverMassKg = 75)` com o laço `for (const input of record.inputs) { if (!('code' in
getLapResult(lap))) break; lap = stepLap(lap, input); }`. Rejeições são valores, nunca exceções. Nenhuma gravação.
