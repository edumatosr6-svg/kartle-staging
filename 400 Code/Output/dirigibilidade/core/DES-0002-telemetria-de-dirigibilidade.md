---
id: DES-0002
title: Telemetria de dirigibilidade por passo (API-0001) — implementação
feature: dirigibilidade
stage: code
status: validated
version: 2.0.0
sources: [API-0001, FLOW-0001, RULE-0001, RULE-0002, FEAT-0001, FEAT-0002, FEAT-0003, FEAT-0004, REQ-FEAT-0001-05, REQ-FEAT-0002-11, REQ-FEAT-0002-12, REQ-FEAT-0002-13, REQ-FEAT-0003-10, REQ-FEAT-0003-13, REQ-FEAT-0004-05, REQ-FEAT-0004-06, REQ-FEAT-0006-01, REQ-FEAT-0006-02]
---

# DES-0002 — Telemetria de dirigibilidade por passo (API-0001) — implementação

`src/physics.ts`, camada simulação, existente e alterado na rodada de código 5 (projeto DES-0002 2.0.0, API-0001 2.0.0):
`HandlingTelemetry` (`:424-429`) e `getHandlingTelemetry` (`:431-440`) perdem `driftActive` e ganham `positionXM`, `positionZM`,
`headingRad`, na ordem do contrato.

## Realização por requisito

| Requisito | Arquivo e símbolo |
|---|---|
| REQ-FEAT-0002-11, -12, -13 | `src/physics.ts:436` `getHandlingTelemetry` (`positionXM` = `state.x`, `positionZM` = `state.z`, `headingRad` = `state.heading`, acumulado sem redução a uma volta); lidos por `scripts/handlingBench.ts` `pathRadius`, `cornerTurn`, `exitOf` |
| REQ-FEAT-0003-13 | `src/physics.ts:424-429` `HandlingTelemetry` sem `driftActive`; `scripts/handlingBench.ts` `compareRuns` compara posição, velocidade, rumo, `handling` e derrapagem |
| REQ-FEAT-0001-05 | `getHandlingTelemetry` (`handling` por passo; `understeerStepCount` de `steerResponse`, informativo) |
| REQ-FEAT-0003-10 | `src/physics.ts` `isForcing`, `step` (`forcing` decidido na simulação e lido pela telemetria) |
| REQ-FEAT-0004-05 | `src/physics.ts` `integrate` (`wallContact` só no passo com `outgoing > 0`; nunca em `testPadArea`, sem paredes) |
| REQ-FEAT-0004-06 | `getHandlingTelemetry` (`speedMps`, `handling`); `src/main.ts:600` (leitura por quadro, DES-0005) |
| REQ-FEAT-0006-01, -02 | leitura pura do `State`; `src/physics.ts` sem `three`, DOM, `Date`, `performance`, `Math.random` |

## Interface

`getHandlingTelemetry(state: State | undefined, setup: SetupRef): HandlingTelemetry | { code: 'NO_STATE' }` — exatamente os campos de
API-0001 2.0.0: `simStepCount`, `setupId`, `setupVersion`, `positionXM`, `positionZM`, `headingRad`, `speedMps`, `handling`,
`sideslipRad` (módulo), `yawRateRadPerS` (com sinal), `surface` (`ASPHALT`/`GRASS`), `wallContact`, `forcing`. Estado ausente devolve
só o código, sem lançar.
