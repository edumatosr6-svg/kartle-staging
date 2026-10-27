---
id: TEST-0002
title: Estado do kart para exibição (API-0001), giro das rodas por passos conhecidos (WHEEL_SPIN), ponto de referência e posições das rodas da telemetria
feature: modelo-kart-01
stage: test
status: validated
version: 1.0.0
sources: [AC-US-0002-01, AC-US-0002-02, AC-US-0002-05, AC-US-0002-06, AC-US-0005-01, NFR-0007]
---

# TEST-0002 — Estado para exibição, giro das rodas, ponto de referência e posições das rodas da telemetria

| | |
|---|---|
| Arquivo | `tests/modelo-kart-01-pose.test.ts` (estratégia: `pose`) |
| Nível | unitário (`getKartPose`, `rollingSpeedMps`, `advanceWheelSpin`, `modelOffsetForwardM`, `simWheelGroundPositions` sobre estados colocados com `initialState()` espalhado) e integração (`WHEEL_SPIN` por `wheelSpinCheck`; sessões reais de `src/lap.ts` por `startSession`/`runCountdown`/`drive`/`pauseLap`/`repositionKart`/`completeLap`; `TELEMETRY_WHEEL_POSITIONS` sobre o traço de uma volta inteira) |
| Interface exercitada | `getKartPose`, `rollingSpeedMps`, `advanceWheelSpin`, `initialWheelSpin`, `modelOffsetForwardM`, `simWheelGroundPositions`, `WHEEL_NAMES` (`src/kartPose.ts`); `wheelPositions`, `ARCADE_KART` (`src/physics.ts`); `pauseLap`, `repositionKart`, `stepLap` (`src/lap.ts`); `toMs` (`src/lapTiming.ts`); `buildKart01Model`, `KART01_WHEELBASE_M` (`src/kart01Model.ts`); `wheelSpinCheck`, `judgeWheelSpin`, `telemetryWheelPositionsCheck`, `wheelWorldPoints`, `modelToWorld`, `moving` (`tests/helpers/kart01Report.ts`) |
| Fixtures | `moving(vMps, stepCount)` (estado a velocidade constante ao longo do rumo, `v` negativo = ré); três registros `WHEEL_SPIN` com 10, −10 e 0 m/s e 120 passos (1 000 ms); `syntheticReading()`; sessões `OFFICIAL` (300 passos com `autopilot`, pausa aos 200) e `TRAINING` (reposicionamento aos 240 passos); volta completa de `completeLap` com `hook` gravando `{pose, config}` por passo; registros sintéticos derivados dos reais com sinal trocado e com uma roda a 1e-9 |

## Verificações

| Check | Decide | Teste | O que a faria falhar |
|---|---|---|---|
| CHK-TEST-0002-01 | AC-US-0002-01 | the displayed steering angle is the steering the simulation reports, and no state gives NO_STATE | `getKartPose` devolvendo o `steer` bruto do `Input`, um ganho, ou um valor suavizado em vez de `state.steering`; estado ausente sem `NO_STATE` |
| CHK-TEST-0002-02 | AC-US-0002-02 | after 120 steps at 10, -10 and 0 m/s each wheel spun exactly speed x time / (pi x diameter) revolutions, in the direction of travel | giro sem sinal na ré (mutação G: `Math.abs(distanceM)` reprova esta verificação), diâmetro do modelo diferente do de `WHEEL_DIAMETERS_M` (mutação A), `simulatedTimeMs` que não seja `toMs(120)`, giro por roda com escorregamento, velocidade 0 que gire, registro sem `PASS` |
| CHK-TEST-0002-03 | AC-US-0002-02 | the spin advances only with the step counter: no step gives the same object, a counter that went back resets without spinning, and two frames equal one | `advanceWheelSpin` devolvendo um objeto novo sem passo, girando com `delta` negativo (passo de um contador anterior aplicado de novo), acumulando diferente em dois quadros de 60 e um de 120; `judgeWheelSpin` aceitando sinal trocado ou uma roda fora por 1e-9 |
| CHK-TEST-0002-04 | AC-US-0002-05 | the pose carries the simulation position, and the reference offset puts the model axles within 6 mm of the simulation axles | `xM`/`zM` estimados ou deslocados, `simStepCount` diferente de `stepCount`, `modelOffsetForwardM(0.42, 1.05)` diferente de 0,084 m, eixos do modelo a mais de 0,004/0,006 m dos de `wheelPositions` |
| CHK-TEST-0002-05 | AC-US-0002-05 | in a real session the pose after k steps is the state of step k, one step per frame, never an intermediate one | `simStepCount` saltando ou repetindo entre quadros, campos da pose diferentes dos do estado do passo, pose da sessão diferente da do último passo concluído |
| CHK-TEST-0002-06 | AC-US-0002-05 | while paused the simulation does not advance: two frames give the same pose and the wheels do not spin | `stepLap` avançando o kart em `PAUSED`, pose mudando entre dois quadros parados, `advanceWheelSpin` girando sem passo novo |
| CHK-TEST-0002-07 | AC-US-0002-05, AC-US-0002-06 | the first frame after a reposition shows the new position and heading, and the spin counter restarts without spinning | primeira leitura depois de `repositionKart` ainda na posição antiga ou numa intermediária, rumo antigo, velocidade residual, contador que recua girando as rodas |
| CHK-TEST-0002-08 | AC-US-0002-06 | the displayed heading is the heading the simulation reports | `headingRad` suavizado, normalizado de outro modo ou lido da direção do movimento em vez de `state.heading` |
| CHK-TEST-0002-09 | AC-US-0005-01 | the ground positions of the four simulation wheels are wheelPositions(config) carried by the pose, value for value | `simWheelGroundPositions` usando as rodas do modelo (bitola 1,14 m) ou outra fórmula de rotação, ordem das rodas trocada, eixo traseiro a outra distância |
| CHK-TEST-0002-10 | NFR-0007, AC-US-0005-01 | over a whole lap the telemetry wheel positions equal wheelPositions at every step, and the model rear wheels sit 3 cm inside them | `TELEMETRY_WHEEL_POSITIONS` com `differingValueCount` > 0 em algum passo (fonte das marcas trocada pelas rodas do modelo), volta que não completa, centros traseiros do modelo a outra distância lateral (≠ 3 cm) ou longitudinal (≥ 1 cm) dos pontos de `wheelPositions` |
