---
id: DES-0003
title: Versão do acerto, registros de volta e replay e comparabilidade (API-0002) — implementação
feature: dirigibilidade
stage: code
status: validated
version: 2.0.0
sources: [API-0002, RULE-0003, FLOW-0003, FEAT-0005, FEAT-0006, REQ-FEAT-0005-01, REQ-FEAT-0005-05, REQ-FEAT-0005-06, REQ-FEAT-0005-08, REQ-FEAT-0005-09, REQ-FEAT-0005-10, REQ-FEAT-0006-03]
---

# DES-0003 — Versão do acerto, registros de volta e replay e comparabilidade (API-0002) — implementação

`src/setupRecords.ts`, camada simulação, existente desde a rodada de código 1 e **alterado nesta rodada (3, Mode C)** em
`buildLapRecord` e no pedido de `replayLap`, como o projeto 2.0.0 do item manda (FB-01 de `race-lap-validation`, aceito pelo
D-Spec na rodada 8). Importa só `src/physics.ts`, `src/lap.ts`, `src/lapTiming.ts` e tipos de `src/trackData.ts`.

`src/lap.ts`, camada simulação, módulo de `race-lap-validation`, **alterado nesta rodada só nos campos copiados** que o contrato
daquela feature já carrega (API-0001 e API-0002 1.1.0; DM-0002 e DES-0001 daquela feature): `LapRequest` (`:23`), `LapSession`
(`:30-31`) e `LapResult` (`:54-55`) ganham `setupId?: SetupId` e `setupVersion?: string`; `startLap` copia os dois do pedido para a
sessão como copia `challengeNumber` (`:123-124`), e `buildResult` copia-os da sessão para o resultado (`:278-279`) — presentes se e
só se o pedido os trouxe, sem verificação, regra de volta ou rejeição nova; `SetupId` entra como tipo pela importação de `./physics`
que já existia (`:3`). `src/lap.ts` continua sem importar `src/setupRecords.ts` e nunca resolve um campo ausente.

## Realização por requisito

| Requisito | Arquivo e símbolo |
|---|---|
| REQ-FEAT-0005-01 | `src/setupRecords.ts` `replayLap` (reprodução passo a passo por `stepLap`, `COUNTDOWN_STEPS` nulos antes; mesma sequência, mesmo `LapRecord`) |
| REQ-FEAT-0005-05 | `src/setupRecords.ts` `buildLapRecord` (`setupId: result.setupId ?? setup.setupId`, `setupVersion: result.setupVersion ?? setup.setupVersion`: preenche só o que o resultado não traz; cópia idempotente sobre um resultado que já os carrega), `buildReplayRecord` (`setupId` e `setupVersion` obrigatórios na gravação nova); `src/lap.ts` `startLap`, `buildResult` (os dois campos copiados do pedido ao resultado); `src/physics.ts` `PUBLISHED_SETUPS` (`arcade-assistido-v5` ≠ `arcade-assistido-v4`) |
| REQ-FEAT-0005-06 | `src/setupRecords.ts` `compareLapRecords` (tabela de RULE-0003; a tela só exibe `COMPARABLE`, DES-0006) |
| REQ-FEAT-0005-08 | `src/setupRecords.ts` `resolveSetupRef` (`RESOLVED_FROM_ABSENCE`), `readReplay` (verificações 1 a 7, nunca altera nem descarta `source`); um `LapResult` de volta iniciada sem os campos (testes de `race-lap-validation`, registros antigos) continua sem eles e é resolvido na leitura, nunca em `src/lap.ts` |
| REQ-FEAT-0005-09 | `src/physics.ts` `ARCADE_KART` (intacto, `previousConfig`), `ARCADE_ASSISTIDO_V5` (registro novo), `PUBLISHED_SETUPS`; `src/setupRecords.ts` `getSetupVersion` |
| REQ-FEAT-0005-10 | `src/setupRecords.ts` `replayLap` (o pedido de `startLap` leva `setupId` e `setupVersion` do acerto corrente, `:112`, de modo que o `LapResult` obtido já os carrega e `buildLapRecord` só os copia; `comparability` por `compareLapRecords`, `SETUP_VERSION_DIFFERS` para um replay de `arcade-assistido-v4`) |
| REQ-FEAT-0006-03 | `src/setupRecords.ts` `replayLap` (um replay anterior continua reproduzível porque `step`, `STEP` e `Input` não mudaram; `STEP_CONTRACT` em DES-0004) |

## Interface

`getSetupVersion`, `resolveSetupRef`, `readReplay` (tetos `MAX_REPLAY_TEXT_CHARS` 4 194 304 e `MAX_REPLAY_INPUT_STEPS` 36 000, verificados
antes de ler qualquer elemento), `compareLapRecords` (`TRACK_DIFFERS` → `SETUP_DIFFERS` → `SETUP_VERSION_DIFFERS` → `COMPARABLE`;
`INCOMPLETE_RECORD` sem `trackId`/`trackVersion`), `buildLapRecord` (`:92-93`, preenche só o que falta), `buildReplayRecord`,
`replayLap` (`:108-112`, pedido com os dois campos). Rejeições são valores, nunca exceções. Nenhuma gravação: os registros vivem
na memória da página e nos fixtures. Em `src/lap.ts`, `LapRequest`, `LapSession` e `LapResult` carregam `setupId?` e
`setupVersion?` copiados verbatim; `tests/race-lap-validation-contract.test.ts` (`CHK-TEST-0012-02`, campos exatos de
`getLapResult`) continua verde porque as suas voltas são iniciadas sem os dois campos.
