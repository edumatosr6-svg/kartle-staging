---
id: DES-0003
title: Câmera de jogo (API-0003) — modos, pose de corrida, visão geral, descida, forma da área de jogo e campo de visão — implementação
feature: modelo-kart-01
stage: code
status: validated
version: 2.0.0
sources: [API-0003, RULE-0002, FEAT-0003, FLOW-0001, FLOW-0002, SCR-0001, REQ-FEAT-0003-01, REQ-FEAT-0003-02, REQ-FEAT-0003-03, REQ-FEAT-0003-04, REQ-FEAT-0003-05, REQ-FEAT-0003-06, REQ-FEAT-0003-07, REQ-FEAT-0003-08, REQ-FEAT-0003-09, REQ-FEAT-0003-11, REQ-FEAT-0003-12, REQ-FEAT-0003-13, REQ-FEAT-0003-14, REQ-FEAT-0003-15, REQ-FEAT-0003-16, REQ-FEAT-0003-17]
---

# DES-0003 — Câmera de jogo (API-0003) — implementação

`src/gameCamera.ts` (novo, camada aplicação, puro: sem DOM, sem `three`, sem relógio). Importa `COUNTDOWN_MS` de `src/lapTiming.ts` e
os tipos `LapStateView` (`src/lap.ts`) e `KartPose` (`src/kartPose.ts`). `computeCameraView` realiza a operação `getCameraView` de
API-0003; nenhum símbolo `getCameraView` existe. A projeção da visão geral usa a mesma base de `lookAt` do Three.js (frente, direita =
frente × `up`, cima), escrita sem `three`.

## Realização por requisito

| Requisito | Arquivo e símbolo |
|---|---|
| API-0003 | `src/gameCamera.ts` `CameraView` (exatamente os campos de API-0003 2.0.0; `simStepCount` ausente sem estado; os dois campos retirados não existem no tipo nem no objeto devolvido), `CameraFrameInputs`, `computeCameraView` (`NO_SCENE` sem `trackBounds`) |
| REQ-FEAT-0003-01, -02, -03, -08, -13 | `src/gameCamera.ts` `RACE_CHASE_HEIGHT_M` 1,38, `RACE_CHASE_BACK_M` 3,05, `RACE_CHASE_AIM_AHEAD_M` 3,2, `RACE_CHASE_AIM_HEIGHT_M` 0,30, `raceChasePose(pose)` (câmera em `(xM − 3,05 sin h, 1,38, zM − 3,05 cos h)`, mira em `(xM + 3,2 sin h, 0,30, zM + 3,2 cos h)`; função só da pose, sem suavização, atraso nem corte) |
| REQ-FEAT-0003-04, -15 | `src/gameCamera.ts` `viewShapeOf` (`LANDSCAPE` se largura ≥ altura); `src/main.ts` `frame` (largura e altura lidas em cada quadro; `applyCameraView` escreve `aspect`) |
| REQ-FEAT-0003-05, -06, -07, -17 | `src/gameCamera.ts` `shapeVerticalFovDeg` (`:79`, mesmo corpo da antiga `baseVerticalFovDeg`; paisagem 62°; retrato `max(62°, 2·atan(tan 30° ÷ aspecto))`), `horizontalFovDeg`; medido: 3:4 → 75,2°, 9:16 → 91,5°; `computeCameraView` dá `verticalFovDeg = base` em todos os modos (`:169`, `:175`, `:177`), sem parcela de turbo nem de velocidade; `CameraFrameInputs` (`:33`) sem `turboActive`: só `lapState`, `kartPose`, `viewWidthPx`, `viewHeightPx`, `trackBounds` |
| REQ-FEAT-0003-09 | consequência de `raceChasePose` (câmera presa à posição e ao rumo; o kart ocupa sempre a mesma região do quadro); visto em tela com o kart esterçando |
| REQ-FEAT-0003-16 | `src/gameCamera.ts` `decideCameraMode` (`:68`: lê só `lapPhase` e `resumePhase`, nunca `lapKind`; toda fase de volta ativa fora da contagem → `RACE_CHASE`), com a pose que a simulação informa: parada depois do `ENDED` da volta oficial, em movimento depois do fim de uma volta de treino |
| REQ-FEAT-0003-11 | `src/gameCamera.ts` `decideCameraMode` (`NO_ACTIVE_LAP` → `TRACK_OVERVIEW`; `COUNTDOWN` ou `PAUSED` com `resumePhase` `COUNTDOWN` → `COUNTDOWN_DESCENT`; `RUNNING`, `PAUSED` sem `resumePhase` `COUNTDOWN` ou `ENDED` → `RACE_CHASE`), `TrackBounds`, `trackBoundsOf(points, halfWidthM)`, `OVERVIEW_TILT_DEG` 10, `OVERVIEW_MARGIN` 0,05, `OVERVIEW_MIN_HEIGHT_M` 20, `fitOverviewHeightM` (altura inteira mínima com os quatro cantos dentro de |ndc| ≤ 0,9; teto 5 000 m), `trackOverviewPose`; medido na pista sintética: 16:9 → 104 m, 4:3 → 121 m, 1:1 → 158 m, 3:4 e 9:16 → 164 m |
| REQ-FEAT-0003-12, -14 | `src/gameCamera.ts` `DESCENT_HOLD_MS` 100, `countdownDescentPose(overview, chase, countdownRemainingMs)` (`s` retido 100 ms, `e = s²(3 − 2s)` monótono; `PAUSED` com a contagem parada dá a mesma pose; `countdownRemainingMs` 0 dá exatamente `chase`) |
| RULE-0002, FLOW-0001, FLOW-0002 | `src/gameCamera.ts` `computeCameraView` (reavaliação por quadro do estado da volta; `NO_STATE` → `TRACK_OVERVIEW` sem `simStepCount`); `src/main.ts` `frame` (`lapState = getLapState(lap)`, `kartPose = pose`) |
| SCR-0001 | nenhum texto, controle ou elemento de HUD acrescentado; `src/main.ts` `frame` não desenha a cena sem `cameraView` |

## Interface entregue

`CameraMode`, `ViewShape`, `CameraView`, `CameraPose`, `TrackBounds`, `CameraFrameInputs`, `trackBoundsOf`, `decideCameraMode`,
`viewShapeOf`, `shapeVerticalFovDeg`, `horizontalFovDeg`, `RACE_CHASE_*`, `raceChasePose`, `OVERVIEW_*`,
`fitOverviewHeightM`, `trackOverviewPose`, `DESCENT_HOLD_MS`, `countdownDescentPose`, `computeCameraView`. Sem estado; `camera.far`
passa a `max(500, 3 × altura)` em `src/main.ts` `applyCameraView` (ADR-0002). Retirados na rodada 3 (I3, ausência como ponto de
rejeição): `TURBO_FOV_DELTA_DEG`, `turboActive`, `CameraView.baseVerticalFovDeg`, `CameraView.turboFovDeltaDeg` e o nome
`baseVerticalFovDeg`; nenhum deles aparece em `src/gameCamera.ts` nem em `src/main.ts`.
