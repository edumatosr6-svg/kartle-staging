---
id: DES-0004
title: Integração da cena em src/main.ts — Kart 01 na cena, sombra que acompanha o kart, câmera aplicada por quadro e taxa de quadros — implementação
feature: modelo-kart-01
stage: code
status: validated
version: 1.0.0
sources: [FLOW-0001, FLOW-0002, SCR-0001, FEAT-0001, FEAT-0002, FEAT-0003, FEAT-0004, FEAT-0006, REQ-FEAT-0001-01, REQ-FEAT-0001-15, REQ-FEAT-0001-16, REQ-FEAT-0001-17, REQ-FEAT-0002-01, REQ-FEAT-0002-02, REQ-FEAT-0002-05, REQ-FEAT-0002-06, REQ-FEAT-0002-07, REQ-FEAT-0002-08, REQ-FEAT-0002-09, REQ-FEAT-0003-01, REQ-FEAT-0003-04, REQ-FEAT-0003-11, REQ-FEAT-0003-15, REQ-FEAT-0004-01, REQ-FEAT-0004-02, REQ-FEAT-0004-05, REQ-FEAT-0006-01, NFR-0001, NFR-0002]
---

# DES-0004 — Integração da cena em `src/main.ts` — implementação

`src/main.ts`, camada aplicação, alterado (540 → 553 linhas); os adaptadores de controle, o HUD, o resultado, o minimapa e o áudio não
mudam. `index.html`, `src/style.css` e `src/audio.ts` inalterados (SCR-0001). Os trechos retirados: kart de caixas (`box(kart, …)`,
`helmet`, cilindros de raio 0,31 em `wheelPositions`), `camera.position.set(125, 130, 145)`/`lookAt`, `cameraTarget` e a perseguição
com `lerp`, `targetFov` com termo de velocidade e `lerp`, o laço `wheels[i]` com `rotateY(state.speed * dt / 0.31)`, os dois jatos
presos ao kart de caixas, `skidClock`. `let setup` da `dirigibilidade` fica.

## Realização por requisito

| Requisito | Arquivo e símbolo |
|---|---|
| REQ-FEAT-0001-01, -17 | `src/main.ts` `kart01 = buildKart01Model()` e `kartRoot` (`:124-129`: montado uma vez por página antes do primeiro quadro; recarga ou troca de orientação não remontam); `frame` (`kartRoot.visible` só com pose) |
| REQ-FEAT-0001-15 | `src/main.ts` `paintKart01Decals(kart01)` (`:125`, uma vez depois da montagem) |
| REQ-FEAT-0001-16 | `src/main.ts` `sun.shadow.camera` (`left: -60, right: 60, top: 60, bottom: -60`, `updateProjectionMatrix`, `:41-42`), `scene.add(sun.target)` (`:45`), `frame` (`sun.position.set(xM + 45, 100, zM + 60)`, `sun.target.position.set(xM, 0, zM)`, `:459-460`); mapa de sombra 2048 × 2048 mantido (5,9 cm por texel) |
| REQ-FEAT-0002-01, -02 | `src/main.ts` `frame` (`spin = advanceWheelSpin(spin, pose)`; `updateKart01Pose(kart01, { steerAngleRad: pose.steerAngleRad, wheelSpinRevs: spin.revs })`, `:457-458`; nada gira por `dt`) |
| REQ-FEAT-0002-05, -06 | `src/main.ts` `frame` (`kartRoot.position.set(pose.xM, 0, pose.zM)`, `kartRoot.rotation.y = pose.headingRad`, `kart01.root.position.z = modelOffsetForwardM((lap?.config ?? config).frontWeight, KART01_WHEELBASE_M)`, `:454-456`); `kart01.root.rotation.y = Math.PI` (`:126`) leva a frente do modelo (−Z) à frente da simulação (+Z) |
| REQ-FEAT-0002-07, -08, -09 | `src/main.ts` `frame` (`const state = lap?.kart ?? idleKart` depois do laço de passos, `:431`; `const pose = getKartPose(state)`, `:450`; um quadro sem passo novo reescreve os mesmos valores) |
| REQ-FEAT-0003-01, -04, -11, -15 | `src/main.ts` `applyCameraView(target, view)` (`:396-404`: posição, `up` +Y, `lookAt`, `fov` vertical, `aspect` = largura ÷ altura, `far` = max(500, 3 × altura), `updateProjectionMatrix`), `frame` (`host.clientWidth`/`clientHeight` lidos no quadro; só com os dois > 0 `computeCameraView({ lapState: getLapState(lap), kartPose: pose, viewWidthPx, viewHeightPx, turboActive, trackBounds })`; `NO_SCENE` deixa `cameraView` indefinida, `:490-499`), `ResizeObserver` só com `renderer.setSize` (`:392-394`), `trackBounds = trackBoundsOf(track, WIDTH / 2 + 1)` com leitura `COMPLETE`/`INCOMPLETE` (`:162`) |
| REQ-FEAT-0004-01, -02, -05; NFR-0001 | `src/main.ts` (27 chamadas do kart mais a passagem de sombra das 23 malhas sólidas; `setPixelRatio(min(devicePixelRatio, 2))` mantido; nenhum ajuste de qualidade exposto); a taxa de quadros nos aparelhos de referência é registrada em `docs/kart-01/device-log.md` (molde criado; medição humana pendente) |
| REQ-FEAT-0006-01; NFR-0002 | `npx vite build`: `dist/assets/index-D0RarhFV.js` 631 352 bytes + `index-dgojskay.css` 11 407 bytes = 642 759 bytes sem compressão (gzip 165 033 + 3 244), nenhum recurso novo |
| SCR-0001, FLOW-0001, FLOW-0002 | `src/main.ts` `frame` (`if (cameraView) renderer.render(scene, camera); else renderer.clear()`, `:551`: sem pista carregada nenhuma cena e nenhum kart provisório; `started` só para o HUD, `:530`); `beginLap` (`:232`, sem `skidClock`; o resto inalterado), `emitReposition` e `#lap-new-lap` inalterados: em `ENDED` a simulação para, o kart congela e a câmera segue em `RACE_CHASE` atrás dele |

## Estado local novo

`kart01`, `kartRoot`, `trackBounds` (uma vez), `spin` (`initialWheelSpin()`), `cameraView` (indefinida até a primeira calculada),
`lastSkidStepCount` (DES-0005). Registro em log: só os `console.warn` existentes e `kart01-decals`.
