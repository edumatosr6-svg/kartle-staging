---
id: DES-0002
title: Telemetria de dirigibilidade por passo (API-0001) — implementação
feature: dirigibilidade
stage: code
status: draft
version: 1.0.0
sources: [API-0001, FLOW-0001, RULE-0001, FEAT-0001, FEAT-0002, FEAT-0003, FEAT-0004, REQ-FEAT-0001-05, REQ-FEAT-0003-03, REQ-FEAT-0003-10, REQ-FEAT-0004-05, REQ-FEAT-0004-06, REQ-FEAT-0006-01, REQ-FEAT-0006-02]
---

# DES-0002 — Telemetria de dirigibilidade por passo (API-0001) — implementação

`src/physics.ts`, camada simulação, existente desde a rodada de código 1 e mantido como o projeto manda: `getHandlingTelemetry`
não mudou; o valor inicial de `surface` continua o literal `'asphalt'` de `emptyTelemetry`, mapeado para `ASPHALT`.

## Realização por requisito

| Requisito | Arquivo e símbolo |
|---|---|
| REQ-FEAT-0001-05 | `src/physics.ts` `getHandlingTelemetry` (`handling` por passo, de onde `scripts/handlingBench.ts` `steerResponse` conta `understeerStepCount` sem alterar o veredito) |
| REQ-FEAT-0003-03 | `src/physics.ts` `getHandlingTelemetry` (`forcing` e `driftActive` por passo, lidos por `classifyHandlingSteps`) |
| REQ-FEAT-0003-10 | `src/physics.ts` `isForcing`, `step` (a condição de forçar é calculada uma vez por passo na simulação), `classifyHandlingSteps` |
| REQ-FEAT-0004-05 | `src/physics.ts` `integrate` (`wallContact` verdadeiro só no passo com `outgoing > 0`), `getHandlingTelemetry` |
| REQ-FEAT-0004-06 | `src/physics.ts` `getHandlingTelemetry` (`speedMps`, `handling`); `src/main.ts` `frame` (leitura por quadro, DES-0005) |
| REQ-FEAT-0006-01 | `src/physics.ts` `getHandlingTelemetry` (leitura pura do `State`; nenhuma regra fora da simulação) |
| REQ-FEAT-0006-02 | `src/physics.ts` (sem `three`, DOM, `Date`, `performance`, `Math.random`; afirmado por `tests/race-lap-validation-layering.test.ts`) |

## Interface

`getHandlingTelemetry(state: State | undefined, setup: SetupRef): HandlingTelemetry | { code: 'NO_STATE' }` — exatamente os onze campos de
API-0001: `simStepCount` (`state.stepCount`), `setupId`, `setupVersion`, `speedMps`, `handling`, `sideslipRad` (módulo), `yawRateRadPerS`
(com sinal), `surface` (`ASPHALT`/`GRASS`), `wallContact`, `forcing`, `driftActive`. Estado ausente devolve só o código, sem lançar.
Idempotência: leitura pura; repetir a chamada sobre o mesmo `state` devolve o mesmo valor.
