---
id: TEST-0003
title: Câmera de jogo quadro a quadro sobre sessões reais — pose de corrida, campo de visão por forma, turbo, visão geral, descida e fim da volta
feature: modelo-kart-01
stage: test
status: validated
version: 1.0.0
sources: [AC-US-0003-01, AC-US-0003-02, AC-US-0003-03, AC-US-0003-04, AC-US-0003-05, AC-US-0003-06, AC-US-0003-07, AC-US-0003-08, AC-US-0003-09, AC-US-0003-10, AC-US-0003-11, AC-US-0003-12, AC-US-0003-13]
---

# TEST-0003 — Câmera de jogo quadro a quadro: pose de corrida, campo de visão, turbo, visão geral, descida e fim da volta

| | |
|---|---|
| Arquivo | `tests/modelo-kart-01-camera.test.ts` (estratégia: `camera`) |
| Nível | integração (`computeCameraView` sobre sessões reais de `src/lap.ts`, quadro a quadro, com `getLapState` e `getKartPose`; projeção dos cantos do modelo e da pista por uma `PerspectiveCamera` de Three em Node) e unitário (`viewShapeOf`, `baseVerticalFovDeg`, `horizontalFovDeg`, `raceChasePose`, `trackOverviewPose`, `decideCameraMode`) |
| Interface exercitada | `computeCameraView`, `decideCameraMode`, `viewShapeOf`, `baseVerticalFovDeg`, `horizontalFovDeg`, `raceChasePose`, `trackOverviewPose`, `trackBoundsOf` (`src/gameCamera.ts`); `startLap`, `stepLap`, `pauseLap`, `resumeLap`, `repositionKart`, `getLapState`, `getLapResult` (`src/lap.ts`); `getKartPose`, `modelOffsetForwardM` (`src/kartPose.ts`); `COUNTDOWN_MS`, `COUNTDOWN_STEPS` (`src/lapTiming.ts`); `buildKart01Model`, `KART01_WHEELBASE_M`; `modelExtremePoints`, `modelToWorld`, `projectPoint`, `moving` (`tests/helpers/kart01Report.ts`) |
| Fixtures | `syntheticReading()` e `trackBoundsOf(track, WIDTH / 2 + 1)`; áreas de jogo (1280, 720), (1000, 1000), (1200, 900), (900, 1200), (720, 1280); 300 quadros `RUNNING` (`autopilot`); `ENDED` por conclusão (`completeLap`) e por reposicionamento (`repositionKart` numa volta `OFFICIAL`), três quadros consecutivos cada; `curve90()` (volta `TRAINING` com o acerto `ARCADE_ASSISTIDO`, kart colocado a 50 km/h por `seedLap`, esterço `+1` até o rumo girar 90°); contagem regressiva passo a passo com `pauseLap` no passo 180 e `resumeLap`; `startLap` sobre a sessão `ENDED` |

## Verificações

| Check | Decide | Teste | O que a faria falhar |
|---|---|---|---|
| CHK-TEST-0003-01 | AC-US-0003-01 | in every race frame, running or ended, the camera is 1.38 m above the ground in RACE_CHASE | altura diferente de 1,38 m (mutação B: 1,5 m reprova esta verificação), modo que não seja `RACE_CHASE` em `RUNNING` ou `ENDED` (mutação C: `ENDED` → `TRACK_OVERVIEW`), reposicionamento que não termine a volta oficial |
| CHK-TEST-0003-02 | AC-US-0003-02 | in every race frame the camera is 3.05 m behind the kart position, measured on the ground along the heading | distância no chão diferente de 3,05 m, câmera fora da linha do rumo (atrás da direção do movimento, por exemplo), suavização que atrase a posição |
| CHK-TEST-0003-03 | AC-US-0003-03 | in every race frame the camera aims 3.2 m ahead of the kart along the heading, 0.30 m above the ground | mira a outra distância ou altura, mira presa ao movimento e não ao rumo |
| CHK-TEST-0003-04 | AC-US-0003-04 | in landscape without turbo the vertical field of view is 62 degrees at any speed | `viewShapeOf` que trate quadrado como retrato, campo vertical com termo de velocidade, base diferente de 62°, horizontal que não siga da vertical e do aspecto |
| CHK-TEST-0003-05 | AC-US-0003-05 | in portrait without turbo the horizontal field of view is at least 60 degrees | retrato com horizontal abaixo de 60° (vertical fixa em 62° em 9:16 daria 38°), ou acima de 60° em 9:16 e 3:4 (campo maior que o mínimo) |
| CHK-TEST-0003-06 | AC-US-0003-06 | in portrait the vertical field of view never falls below 62 degrees, and a shape change applies in the next frame without moving the pose | vertical abaixo de 62° em retrato, 91,5°/75,2° errados em 9:16/3:4, pose que mude com a forma, forma do quadro anterior mantida depois da troca |
| CHK-TEST-0003-07 | AC-US-0003-07 | between consecutive frames the aim direction turns exactly as much as the kart heading, in a curve and across a reposition | suavização ou atraso da visada (diferença angular ≠ mudança do rumo além de 1e-12), visada presa à direção do movimento, corte no reposicionamento |
| CHK-TEST-0003-08 | AC-US-0003-08 | in a 90-degree curve at 50 km/h the whole kart with the pilot stays inside the frame, in landscape and in portrait | câmera mais perto, mais baixa ou com campo menor que deixe um canto da caixa dos 15 grupos ou o topo do capacete fora do quadro em algum quadro da curva, nas duas formas (NDC fora de ±1) |
| CHK-TEST-0003-09 | AC-US-0003-09 | with the turbo active the vertical field of view opens by the 4 degrees of the existing effect over the base of the shape | `turboFovDeltaDeg` diferente de 4, delta com rampa ou termo de velocidade, base alterada pelo turbo, câmera movida pelo turbo, delta aplicado sobre a base antiga depois da troca de forma |
| CHK-TEST-0003-10 | AC-US-0003-10 | before the countdown the camera shows the whole track from above, in every shape of the play area, and never after the lap ended | modo diferente de `TRACK_OVERVIEW` sem volta, `simStepCount`/`baseVerticalFovDeg`/`turboFovDeltaDeg` presentes na visão geral, altura abaixo de 20 m, canto da pista fora da margem de 5 % em alguma das cinco áreas, `ENDED` em `TRACK_OVERVIEW` (mutação C), cena sem pista que não dê `NO_SCENE` |
| CHK-TEST-0003-11 | AC-US-0003-11 | during the countdown the camera holds the overview and then descends without ever rising, stopping while paused | modo diferente de `COUNTDOWN_DESCENT`, pose diferente da visão geral com ≥ 2 900 ms restantes, altura que suba em algum passo, altura final não menor que a inicial, pausa que continue a descida, retomada que salte |
| CHK-TEST-0003-12 | AC-US-0003-12 | at the green signal the camera is already in the race pose, and the last countdown frame is within a centimetre of it | primeiro quadro `RUNNING` fora de `raceChasePose(pose)` ou com altura ≠ 1,38 m (mutação B), último quadro da contagem a mais de 0,01 m da pose de corrida (corte no verde) |
| CHK-TEST-0003-13 | AC-US-0003-13 | after the lap ends, by completion or by reposition, the camera stays in the race pose behind the frozen kart until a new countdown starts | `ENDED` fora de `RACE_CHASE` (mutação C), pose diferente de `raceChasePose` do kart parado, `simStepCount` ou pose mudando entre quadros `ENDED`, resultado ausente, volta nova cujo primeiro quadro não esteja na visão geral, quadro anterior à nova contagem fora de `RACE_CHASE` |
| CHK-TEST-0003-14 | AC-US-0003-10, AC-US-0003-13 | the camera mode follows the lap phase: overview only without a lap, descent only during the countdown, chase otherwise | `decideCameraMode` com visão geral em `ENDED` (mutação C), descida em `RUNNING`, ou pausa que mude de modo em relação à fase retomada |
