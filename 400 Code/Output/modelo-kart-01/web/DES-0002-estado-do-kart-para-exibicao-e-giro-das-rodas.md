---
id: DES-0002
title: Estado do kart para exibição (API-0001), velocidade de rolamento, giro das rodas e ponto de referência — implementação
feature: modelo-kart-01
stage: code
status: validated
version: 1.0.0
sources: [API-0001, RULE-0003, FEAT-0002, FEAT-0005, FLOW-0001, REQ-FEAT-0002-01, REQ-FEAT-0002-02, REQ-FEAT-0002-05, REQ-FEAT-0002-06, REQ-FEAT-0002-07, REQ-FEAT-0002-08, REQ-FEAT-0002-09, REQ-FEAT-0005-01, REQ-FEAT-0005-06, NFR-0005, NFR-0006, NFR-0007]
---

# DES-0002 — Estado do kart para exibição, velocidade de rolamento, giro das rodas e ponto de referência — implementação

`src/kartPose.ts` (novo, camada aplicação, puro: sem DOM, sem `three`, sem relógio). Importa de `src/physics.ts` `wheelPositions`,
`bodyVelocity`, `STEP` e os tipos `State`, `KartConfig`; de `src/kart01Model.ts` só o tipo `WheelName` (`import type`, apagado na
execução). Nenhum módulo da simulação o importa.

## Realização por requisito

| Requisito | Arquivo e símbolo |
|---|---|
| API-0001 | `src/kartPose.ts` `KartPose` (`simStepCount`, `xM`, `zM`, `headingRad`, `steerAngleRad`, `rollingSpeedMps`), `getKartPose(state)` (`simStepCount = state.stepCount`, `xM = state.x`, `zM = state.z`, `headingRad = state.heading`, `steerAngleRad = state.steering`; `undefined` → `{ code: 'NO_STATE' }` sem lançar) |
| REQ-FEAT-0002-01 | `src/kartPose.ts` `getKartPose` (`steerAngleRad` é o esterço único da simulação, positivo para a esquerda; não o ângulo por roda da telemetria) |
| REQ-FEAT-0002-02 | `src/kartPose.ts` `rollingSpeedMps` (`state.speed` com sinal de `bodyVelocity(state).u`), `WHEEL_DIAMETERS_M` (0,26/0,28), `WheelSpinState`, `initialWheelSpin`, `advanceWheelSpin` (`delta = pose.simStepCount − spin.simStepCount`; `delta > 0`: `revs += rollingSpeedMps × delta × STEP / (π × d)`; `delta === 0`: inalterado; `delta < 0`: contador novo sem girar) |
| REQ-FEAT-0002-05, -06 | `src/kartPose.ts` `modelOffsetForwardM(frontWeight, modelWheelbaseM)` = `modelWheelbaseM × (0,5 − frontWeight)` (0,084 m com 0,42 e 1,05); aplicado por `src/main.ts` `frame` (`kart01.root.position.z`, `kartRoot.rotation.y = headingRad`) |
| REQ-FEAT-0002-07, -08, -09 | `src/main.ts` `frame` (`const state = lap?.kart ?? idleKart` depois do laço de `stepLap`; `getKartPose(state)` lê o último passo; na pausa `simStepCount` não avança e `advanceWheelSpin` devolve o mesmo `spin`; no reposicionamento o `kart` novo nasce com `stepCount` 0 e o contador reinicia sem quadro intermediário) |
| REQ-FEAT-0005-01, -06; NFR-0007 | `src/kartPose.ts` `simWheelGroundPositions(pose, config)` (os quatro `wheelPositions(config)` levados por `xM`, `zM`, `headingRad` com a transformação de `src/physics.ts:229`; nunca os centros das rodas do modelo); lido por `src/main.ts` `frame` para as marcas |
| NFR-0005, NFR-0006 | leituras puras; nenhum campo acrescentado a `State`; `stepLap` continua o único ponto de escrita na simulação (`src/main.ts` `frame`) |

## Interface entregue

`KartPose`, `getKartPose`, `rollingSpeedMps`, `WHEEL_NAMES`, `WHEEL_DIAMETERS_M`, `WheelSpinState`, `initialWheelSpin`,
`advanceWheelSpin`, `modelOffsetForwardM`, `simWheelGroundPositions`. Diferença conhecida (RULE-0003, `DOMAIN/DEC-02`): as posições
traseiras de `wheelPositions` ficam 0,03 m para fora do centro das rodas traseiras exibidas (bitola 1,20 m contra 1,14 m) e a no máximo
0,01 m dos eixos do modelo ao longo do rumo; a marca de 0,19 m fica sob o pneu de 0,19 m.
