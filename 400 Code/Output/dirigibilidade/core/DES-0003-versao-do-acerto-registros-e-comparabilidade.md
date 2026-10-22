---
id: DES-0003
title: Versão do acerto, registros de volta e replay e comparabilidade (API-0002) — implementação
feature: dirigibilidade
stage: code
status: draft
version: 1.0.0
sources: [API-0002, RULE-0003, FLOW-0003, FEAT-0005, FEAT-0006, REQ-FEAT-0005-01, REQ-FEAT-0005-05, REQ-FEAT-0005-06, REQ-FEAT-0005-08, REQ-FEAT-0005-09, REQ-FEAT-0005-10, REQ-FEAT-0006-03]
---

# DES-0003 — Versão do acerto, registros de volta e replay e comparabilidade (API-0002) — implementação

`src/setupRecords.ts`, camada simulação, existente desde a rodada de código 1 e mantido sem mudança nesta rodada, como o projeto
manda. Importa só `src/physics.ts`, `src/lap.ts`, `src/lapTiming.ts` e tipos de `src/trackData.ts`.

## Realização por requisito

| Requisito | Arquivo e símbolo |
|---|---|
| REQ-FEAT-0005-01 | `src/setupRecords.ts` `replayLap` (reprodução passo a passo por `stepLap`, `COUNTDOWN_STEPS` nulos antes; mesma sequência, mesmo `LapRecord`) |
| REQ-FEAT-0005-05 | `src/setupRecords.ts` `buildLapRecord`, `buildReplayRecord` (`setupId` e `setupVersion` obrigatórios na gravação nova); `src/physics.ts` `PUBLISHED_SETUPS` (`arcade-assistido-v5` ≠ `arcade-assistido-v4`) |
| REQ-FEAT-0005-06 | `src/setupRecords.ts` `compareLapRecords` (tabela de RULE-0003; a tela só exibe `COMPARABLE`, DES-0006) |
| REQ-FEAT-0005-08 | `src/setupRecords.ts` `resolveSetupRef` (`RESOLVED_FROM_ABSENCE`), `readReplay` (verificações 1 a 7, nunca altera nem descarta `source`) |
| REQ-FEAT-0005-09 | `src/physics.ts` `ARCADE_KART` (intacto, `previousConfig`), `ARCADE_ASSISTIDO_V5` (registro novo), `PUBLISHED_SETUPS`; `src/setupRecords.ts` `getSetupVersion` |
| REQ-FEAT-0005-10 | `src/setupRecords.ts` `replayLap` (o `LapRecord` obtido leva o acerto corrente; `comparability` por `compareLapRecords`, `SETUP_VERSION_DIFFERS` para um replay de `arcade-assistido-v4`) |
| REQ-FEAT-0006-03 | `src/setupRecords.ts` `replayLap` (um replay anterior continua reproduzível porque `step`, `STEP` e `Input` não mudaram; `STEP_CONTRACT` em DES-0004) |

## Interface

`getSetupVersion`, `resolveSetupRef`, `readReplay` (tetos `MAX_REPLAY_TEXT_CHARS` 4 194 304 e `MAX_REPLAY_INPUT_STEPS` 36 000, verificados
antes de ler qualquer elemento), `compareLapRecords` (`TRACK_DIFFERS` → `SETUP_DIFFERS` → `SETUP_VERSION_DIFFERS` → `COMPARABLE`;
`INCOMPLETE_RECORD` sem `trackId`/`trackVersion`), `buildLapRecord`, `buildReplayRecord`, `replayLap`. Rejeições são valores, nunca
exceções. Nenhuma gravação: os registros vivem na memória da página e nos fixtures.
