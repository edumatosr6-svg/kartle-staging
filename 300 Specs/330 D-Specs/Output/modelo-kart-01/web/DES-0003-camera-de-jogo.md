---
id: DES-0003
title: Câmera de jogo (API-0003) — modos, pose de corrida, visão geral, descida, forma da área de jogo e campo de visão
feature: modelo-kart-01
stage: dspec
status: validated
version: 1.1.0
sources: [API-0003, RULE-0002, FEAT-0003, FLOW-0001, FLOW-0002, SCR-0001, REQ-FEAT-0003-01, REQ-FEAT-0003-02, REQ-FEAT-0003-03, REQ-FEAT-0003-04, REQ-FEAT-0003-05, REQ-FEAT-0003-06, REQ-FEAT-0003-07, REQ-FEAT-0003-08, REQ-FEAT-0003-09, REQ-FEAT-0003-10, REQ-FEAT-0003-11, REQ-FEAT-0003-12, REQ-FEAT-0003-13, REQ-FEAT-0003-14, REQ-FEAT-0003-15]
---

# DES-0003 — Câmera de jogo (API-0003)

## Realiza

Os 15 requisitos de FEAT-0003 e o contrato API-0003 campo a campo (a operação `getCameraView`, realizada por
`computeCameraView`): o modo da câmera decidido pela fase da volta, com `ENDED` em `RACE_CHASE` — simulação
parada e kart congelado, como hoje (INV-1 de `race-lap-validation`), só a câmera na pose de corrida em relação
ao kart parado — e a visão geral só sem volta ativa (REQ-FEAT-0003-01, -11; RULE-0002; `DOMAIN/DEC-06`, na
redação corrigida); a pose de corrida (1,38 m acima do chão, 3,05 m atrás, mira 3,2 m à frente a 0,30 m)
presa ao rumo, sem suavização, atraso nem corte (REQ-FEAT-0003-01 a -03, -08, -13); a forma da área de jogo
e as regras de campo de visão de paisagem e de retrato, com o efeito de turbo a partir da base da forma
corrente, aplicadas no quadro seguinte a uma troca de forma (REQ-FEAT-0003-04 a -07, -10, -15); o kart
inteiro no quadro numa curva de 90° a 50 km/h (REQ-FEAT-0003-09); a visão geral com a pista inteira no quadro
e a descida função só de `countdownRemainingMs` e da pose do kart (REQ-FEAT-0003-11, -12, -14). A aplicação
do resultado à câmera de Three.js e a leitura das entradas por quadro estão em
[DES-0004](DES-0004-integracao-da-cena-em-main-ts.md).

## Posicionamento

`src/gameCamera.ts`, camada **Aplicação**, **novo**, puro: sem DOM, sem `three`, sem relógio. Importa
`COUNTDOWN_MS` de `src/lapTiming.ts` e os tipos `LapStateView` (`src/lap.ts`) e `KartPose`
(`src/kartPose.ts`). Motivo de ser módulo próprio: a regra de câmera precisa ser verificada em `npm test`
quadro a quadro com `getLapState` real, e `src/main.ts` não carrega sem DOM; as decisões que
[ADR-0002](../adr/ADR-0002-camera-como-funcao-pura-do-quadro.md) registra (função pura, sem suavização)
exigem que a câmera seja calculável fora do laço de quadros.

## Interface

| Símbolo | Assinatura | Descrição |
|---|---|---|
| `CameraMode`, `ViewShape` | tipos | `'TRACK_OVERVIEW' \| 'COUNTDOWN_DESCENT' \| 'RACE_CHASE'`; `'LANDSCAPE' \| 'PORTRAIT'` |
| `CameraView` | tipo | exatamente os campos de API-0003: `cameraMode`; `simStepCount` (inteiro, passos; ausente sem estado de simulação); `viewShape`; `viewWidthPx`, `viewHeightPx` (inteiros, px); `cameraXM`, `cameraZM`, `cameraHeightM` (m); `aimXM`, `aimZM`, `aimHeightM` (m); `verticalFovDeg`, `horizontalFovDeg` (graus); `baseVerticalFovDeg`, `turboFovDeltaDeg` (graus; presentes só em `RACE_CHASE`, ausentes — não zerados — nos outros modos) |
| `TrackBounds` | tipo | `{ minXM, maxXM, minZM, maxZM }` (m): retângulo, no referencial da pista, que contém a pista inteira |
| `trackBoundsOf(points, halfWidthM)` | `(readonly { x: número; z: número }[] (m), número (m)) => TrackBounds` | mínimo e máximo de `x` e `z` dos pontos, estendidos de `halfWidthM` para cada lado; para a pista sintética, `track` de `src/track.ts` com `WIDTH / 2 + 1` (a faixa externa de `src/main.ts:66`); aceita qualquer lista de pontos, para a `pista-kart-park` fornecer os seus |
| `CameraFrameInputs` | tipo | `{ lapState: LapStateView \| { code: 'NO_ACTIVE_LAP' }; kartPose: KartPose \| { code: 'NO_STATE' }; viewWidthPx: inteiro > 0 (px); viewHeightPx: inteiro > 0 (px); turboActive: booleano; trackBounds: TrackBounds \| undefined }` |
| `decideCameraMode(lapState)` | `(LapStateView \| { code }) => CameraMode` | `NO_ACTIVE_LAP` → `TRACK_OVERVIEW`; `lapPhase` `COUNTDOWN`, ou `PAUSED` com `resumePhase` `COUNTDOWN` → `COUNTDOWN_DESCENT`; `RUNNING`, `PAUSED` com `resumePhase` `RUNNING` ou ausente (`src/lap.ts:146` retoma em `RUNNING`), ou `ENDED` → `RACE_CHASE` (tabela Modos de RULE-0002; em `ENDED` a simulação está parada e o kart congelado — INV-1 de `race-lap-validation` —, a pose não muda e a câmera é a mesma em cada quadro) |
| `viewShapeOf(viewWidthPx, viewHeightPx)` | `(px, px) => ViewShape` | `LANDSCAPE` se largura ≥ altura; `PORTRAIT` se altura > largura (RULE-0002, Forma da área de jogo) |
| `baseVerticalFovDeg(shape, aspect)` | `(ViewShape, adimensional = largura ÷ altura) => graus` | `LANDSCAPE`: 62. `PORTRAIT`: `max(62, graus(2 × atan(tan(30°) / aspect)))` — o menor campo de visão vertical que dá 60° na horizontal, nunca abaixo de 62° (`DOMAIN/DEC-03`; RULE-0002, tabela de campo de visão). Exemplos: 9:16 → 91,5°; 3:4 → 75,2°; 1:1 é paisagem |
| `horizontalFovDeg(verticalFovDeg, aspect)` | `(graus, adimensional) => graus` | `graus(2 × atan(tan(verticalFovDeg / 2) × aspect))`: o horizontal que resulta do vertical e da razão largura ÷ altura (API-0003) |
| `TURBO_FOV_DELTA_DEG` | `4` (graus) | a diferença que o efeito de turbo existente produz com o turbo ativo (`src/main.ts:483`, termo `tricks.boost > 0 ? 4 : 0`); `turboFovDeltaDeg` = 4 com `turboActive`, 0 sem |
| `RACE_CHASE_HEIGHT_M`, `RACE_CHASE_BACK_M`, `RACE_CHASE_AIM_AHEAD_M`, `RACE_CHASE_AIM_HEIGHT_M` | `1.38`, `3.05`, `3.2`, `0.30` (m) | a câmera de corrida da ficha |
| `raceChasePose(pose)` | `(KartPose) => CameraPose` | `CameraPose = { cameraXM, cameraZM, cameraHeightM, aimXM, aimZM, aimHeightM }` (m): câmera em `(xM − 3,05 × sin(headingRad), 1,38, zM − 3,05 × cos(headingRad))`; mira em `(xM + 3,2 × sin(headingRad), 0,30, zM + 3,2 × cos(headingRad))` — o rumo da simulação aponta para `(sin h, cos h)` no chão (`src/physics.ts:121-122`). Função só da pose do kart: a direção horizontal de mira é `headingRad`, logo muda exatamente o quanto o rumo muda, e um reposicionamento move a câmera na medida da nova posição e do novo rumo |
| `OVERVIEW_TILT_DEG`, `OVERVIEW_MARGIN`, `OVERVIEW_MIN_HEIGHT_M` | `10` (graus), `0.05` (fração do quadro), `20` (m) | inclinação da visão geral em relação à vertical; margem mínima entre a pista e a borda do quadro; altura mínima |
| `fitOverviewHeightM(bounds, verticalFovDeg, aspect)` | `(TrackBounds, graus, adimensional) => m` | a menor altura `H`, inteira em metros a partir de 20, tal que os quatro cantos de `bounds`, projetados pela câmera em `(cx, H, cz + H × tan(10°))` mirando `(cx, 0, cz)` com `up` `+Y`, caem dentro do quadro com margem de 5 % em cada borda (`|x| ≤ 0,9` e `|y| ≤ 0,9` em coordenadas normalizadas); `cx`, `cz` são o centro de `bounds`; busca linear limitada a 5 000 m; determinística |
| `trackOverviewPose(bounds, shape, aspect)` | `(TrackBounds, ViewShape, adimensional) => CameraPose` | câmera em `(cx, H, cz + H × tan(10°))` com `H = fitOverviewHeightM(bounds, baseVerticalFovDeg(shape, aspect), aspect)`; mira em `(cx, 0, cz)`: acima da pista, olhando para baixo, pista inteira no quadro na forma corrente (RULE-0002, Pose por modo). Pista sintética, 16:9: `H` ≈ 103 m; 9:16: ≈ 160 m |
| `DESCENT_HOLD_MS` | `100` (ms) | retenção da pose da visão geral no início da contagem; igual a `MAX_FRAME_S × 1000` de `src/frameClock.ts:5`, o máximo de tempo simulado que um quadro avança, de modo que o **primeiro quadro desenhado** da contagem (`countdownRemainingMs` entre 2 900 e 3 000 ms) está sempre na pose da visão geral (REQ-FEAT-0003-12) |
| `countdownDescentPose(overview, chase, countdownRemainingMs)` | `(CameraPose, CameraPose, ms) => CameraPose` | `s = clamp((COUNTDOWN_MS − countdownRemainingMs − DESCENT_HOLD_MS) / (COUNTDOWN_MS − DESCENT_HOLD_MS), 0, 1)`; `e = s² × (3 − 2s)`; cada coordenada da câmera e da mira é `overview + (chase − overview) × e`. `e` é monótono não decrescente em `s`, e `s` só cresce quando `countdownRemainingMs` diminui: a altura `cameraHeightM` nunca aumenta de um quadro para o seguinte e é menor no fim (`e` → 1, 1,38 m) que no início (`H` ≥ 20 m) (REQ-FEAT-0003-12); com a contagem parada (`PAUSED`), `countdownRemainingMs` não muda e a pose é a mesma (REQ-FEAT-0003-14); em `countdownRemainingMs` 0 a pose é exatamente `chase` |
| `computeCameraView(inputs)` | `(CameraFrameInputs) => CameraView \| { code: 'NO_SCENE' }` | **Realiza a operação `getCameraView` de API-0003** (resposta `CameraView` campo a campo; erro `NO_SCENE`). O nome difere porque a função é pura, num módulo sem DOM e sem relógio, que não tem "quadro corrente" para ler: as entradas do quadro — estado da volta, pose do kart, largura e altura da área de jogo, estado de turbo e limites da pista — são passadas explicitamente por `src/main.ts`, que é quem lê o quadro corrente ([DES-0004](DES-0004-integracao-da-cena-em-main-ts.md)); nenhum símbolo `getCameraView` existe. `trackBounds` ausente → `NO_SCENE`. Senão: `shape = viewShapeOf(...)`, `aspect = viewWidthPx / viewHeightPx`, `base = baseVerticalFovDeg(shape, aspect)`, `mode = decideCameraMode(lapState)`; com `kartPose` `NO_STATE` não existe volta (toda `LapSession` tem `kart`), logo `mode` é `TRACK_OVERVIEW` e `simStepCount` é ausente. `TRACK_OVERVIEW`: pose de `trackOverviewPose`, `verticalFovDeg = base`. `COUNTDOWN_DESCENT`: pose de `countdownDescentPose(trackOverviewPose(...), raceChasePose(kartPose), lapState.countdownRemainingMs)`, `verticalFovDeg = base`. `RACE_CHASE`: pose de `raceChasePose(kartPose)`, `baseVerticalFovDeg = base`, `turboFovDeltaDeg = turboActive ? 4 : 0`, `verticalFovDeg = base + turboFovDeltaDeg`. Em todos: `horizontalFovDeg = horizontalFovDeg(verticalFovDeg, aspect)`, `viewShape`, `viewWidthPx`, `viewHeightPx`, `simStepCount = kartPose.simStepCount` quando há estado |

O kart inteiro no quadro (REQ-FEAT-0003-09) é consequência da pose: em `RACE_CHASE` o kart ocupa sempre a
mesma região do quadro, porque a câmera está presa à posição e ao rumo e a simulação não inclina o kart. Com
o ponto de referência de [DES-0002](DES-0002-estado-do-kart-para-exibicao-e-giro-das-rodas.md): o eixo de
visada desce 9,8° (1,08 m em 6,25 m); o para-choque traseiro, a 2,03 m da câmera no chão, fica 24,4° abaixo
do eixo; o topo do capacete (0,97 m) fica 1,6° acima; o nariz fica 9,4° abaixo; a meia largura de 0,725 m a
2,03 m subtende 19,7°. Paisagem: meio campo vertical 31° ≥ 24,4° e meio campo horizontal ≥ 31° (aspecto 1) ≥
19,7°. Retrato: meio campo vertical ≥ 31° e meio campo horizontal ≥ 30° ≥ 19,7°. Com turbo só aumenta. Vale
em todos os quadros de qualquer curva, a qualquer velocidade.

## Colaboradores

Chamado por `src/main.ts` uma vez por quadro (`computeCameraView`) e por `tests/modelo-kart-01-camera.test.ts`
(com `getLapState` de `src/lap.ts` sobre sessões reais). Chama só `src/lapTiming.ts` (`COUNTDOWN_MS`).

## Estado e concorrência

Sem estado: `computeCameraView` é função pura das entradas do quadro. Idempotência (API-0003): repetir a
chamada com as mesmas entradas devolve o mesmo valor; em `RACE_CHASE` o mesmo `simStepCount`, a mesma forma e
o mesmo estado de turbo dão a mesma câmera — em `ENDED`, com a simulação parada (INV-1 de `race-lap-validation`),
`simStepCount` não avança e todo quadro repete a mesma câmera; em `COUNTDOWN_DESCENT` o mesmo `countdownRemainingMs` e a mesma
pose dão a mesma câmera. As transições de modo de RULE-0002 não têm contador próprio: são reavaliações por
quadro do estado da volta, cujos contadores (`countdownRemainingMs` só diminui; `simStepCount`) pertencem à
simulação; `startLap` repetido é rejeitado por `race-lap-validation` e não reinicia nada aqui.

## Comportamento em falha

- Pista não carregada (`UNREADABLE`, `UNSUPPORTED_SCHEMA`): `trackBounds` ausente → `NO_SCENE`, sem lançar;
  nenhuma cena é desenhada ([DES-0004](DES-0004-integracao-da-cena-em-main-ts.md)).
- `viewWidthPx` ou `viewHeightPx` não positivos: entrada inválida pelo contrato; `src/main.ts` não chama a
  função nesse quadro e mantém a câmera anterior (a área de jogo com 0 px não desenha nada).
- `fitOverviewHeightM` sem solução até 5 000 m (pista absurda): devolve 5 000 m e a pista pode não caber;
  `tests/modelo-kart-01-camera.test.ts` afirma que a pista sintética cabe em 16:9, 4:3, 1:1, 3:4 e 9:16.
- Sem rede, sem tempo-limite, sem escrita; nada é registrado em log.

## Observabilidade

A própria `CameraView` por quadro é o instrumento: os testes a leem campo a campo; o roteiro em tela
(E2E-02 a E2E-04 de `test-strategy.md`) confirma o que só a tela mostra (pista inteira, kart no quadro, painel
de resultado sem mover a câmera).

## Determinismo (D-DS-07)

Não é código de simulação; função pura sem relógio nem sorteio — a suavização por `dt` de
`src/main.ts:480` e `:485` é retirada por isso ([ADR-0002](../adr/ADR-0002-camera-como-funcao-pura-do-quadro.md)).
Prova: `tests/modelo-kart-01-camera.test.ts` percorre uma sessão real (`startSession`, `runCountdown`,
`drive`, pausa, reposicionamento, fim da volta, novo `startLap` em `ENDED`) e afirma o modo, a pose, a
monotonia da altura na descida, a continuidade no sinal verde e os campos de API-0003 em cada quadro.

## Feature flag

Nenhuma: o F-Spec proíbe escolha de câmera, ajuste de campo de visão e chave para a câmera alta em corrida
(FEAT-0003, Configuração); a câmera alta sobrevive como `TRACK_OVERVIEW`.

## Pontos em aberto

Nenhum.
