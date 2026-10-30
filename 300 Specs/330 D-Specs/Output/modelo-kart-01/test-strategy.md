---
title: Estratégia de testes — modelo Kart 01 e câmera de jogo
feature: modelo-kart-01
stage: dspec
status: validated
version: 1.4.0
sources: []
---

# Estratégia de testes

Prova é verificação determinística em `npm test` (node:test via tsx), avançando a simulação com `STEP`,
nunca medida contra o relógio de parede (I9). O que depende de tela, de aparelho ou de orientação só se
prova em teste registrado, em `docs/kart-01/device-log.md` (**novo**, criado pela etapa de código no molde
de `docs/lap-validation-device-log.md`), e uma execução em desktop não vale para celular. O projeto não tem
ferramenta de teste de ponta a ponta e esta feature não acrescenta dependência: "web E2E" e "mobile E2E" são
o roteiro registrado abaixo, `E2E-nn`. Nenhum teste usa configuração, ponto de entrada ou gancho criado só
para testar: os testes chegam ao comportamento por `buildKart01Model`/`updateKart01Pose`
(`src/kart01Model.ts`), `getKartPose`/`advanceWheelSpin`/`simWheelGroundPositions`/`modelOffsetForwardM`
(`src/kartPose.ts`), `computeCameraView` e as funções que o compõem (`src/gameCamera.ts`), pelas operações
públicas da volta (`startLap`/`stepLap`/`pauseLap`/`resumeLap`/`repositionKart`/`getLapState`/`getLapResult`,
`src/lap.ts`), por estados colocados com `initialState()` espalhado (como `tests/physics.test.ts:5`) e pelos
helpers e fixtures existentes de `tests/`. A linha de base é dado gravado antes da feature
([DM-0001](data/DM-0001-linha-de-base-da-simulacao-e-registro-em-tela.md)), não configuração.

## Níveis

| Nível | Onde roda | O que cobre |
|---|---|---|
| Unitário | `npm test` | funções puras: `getKartPose`, `rollingSpeedMps`, `advanceWheelSpin`, `modelOffsetForwardM`, `simWheelGroundPositions`, `steeringWheelAngleRad`, `decideCameraMode`, `viewShapeOf`, `shapeVerticalFovDeg`, `horizontalFovDeg`, `raceChasePose`, `trackOverviewPose`, `fitOverviewHeightM`, `countdownDescentPose`, `judgeModelCheck`, `readSimBaseline`, `serializeRecord` |
| Integração | `npm test` | o modelo montado em Node (medidas, grupos, cores, custo, pose das peças); a câmera sobre sessões reais de `src/lap.ts` quadro a quadro; `WHEEL_SPIN`; `RENDER_NEUTRAL`; `DETERMINISM`, `WHEEL_POSITIONS`, `TELEMETRY_WHEEL_POSITIONS` contra a linha de base |
| Contrato | `npm test` | `tests/modelo-kart-01-contract.test.ts` e os registros de API-0002 campo a campo (nomes, unidades, campos condicionais); API-0001 e API-0003 campo a campo; `LAYERING`; `SIM_CONTRACT`; símbolos retirados de `src/main.ts`; dependências declaradas |
| Web E2E | roteiro registrado em Chrome, Edge, Firefox e Safari atuais, `web-desktop`, no notebook de referência | kart na tela, sombra, número 01, animação, câmera (visão geral, descida, corrida, fim da volta), efeitos, taxa de quadros |
| Mobile E2E | roteiro registrado no celular intermediário de referência, `web-mobile`, paisagem e retrato | o mesmo, com inclinação e toque; campo de visão em retrato; troca de orientação; taxa de quadros nas duas orientações |

## Fixtures e como chegar a cada estado

| Fixture | O que é | Estado a que dá acesso |
|---|---|---|
| `buildKart01Model()` em Node | o modelo montado, sem decalques pintados | medidas, grupos, cores, custo; nós `steer`/`spin`, `steeringWheel`, `arms`, `anchors` |
| `measureKart01Model(model)` e `judgeModelCheck` (`tests/helpers/kart01Report.ts`, **novo**) | a medida e o veredito de RULE-0001 | registros `KART_DIMENSIONS`, `WHEELS_AND_TRACKS`, `PART_GROUPS`, `PART_COLORS`, `DRAW_COST` |
| medidas sintéticas | objetos `Kart01Measures` construídos à mão com um valor fora (1,96 m; roda 0,27 m; grupo ausente; `piloto` com `parentGroupName`; cor `#FF6B13`; 31 chamadas; 5.127 triângulos) | cada `checkFailReason` da tabela de RULE-0001 e a ordem entre dois motivos |
| `moving(vMps, stepCount)` (local do teste) | `{...initialState(), vx: v × sin(heading), vz: v × cos(heading), speed: abs(v), stepCount}`; `v` negativo = ré | `rollingSpeedMps` com sinal; `WHEEL_SPIN` com 10, −10 e 0 m/s e 120 passos |
| `syntheticReading()` (`tests/fixtures/trackFiles.ts`, existente) | leitura `COMPLETE` da pista sintética | sessões reais para a câmera e as verificações |
| `startSession`, `runCountdown`, `drive`, `completeLap`, `autopilot`, `replay`, `seedLap`, `kartAt` (`tests/helpers/autopilot.ts`, existentes) | sessões em `COUNTDOWN`, `RUNNING`, `PAUSED`, `ENDED` por conclusão; volta de referência | todos os modos da câmera; `ENDED` válida; traço por passo |
| `repositionKart` sobre uma sessão `OFFICIAL` em `RUNNING` | `ENDED` por `REPOSITION` (`src/lap.ts:163`) | `ENDED` invalidada por reposicionamento; a câmera continua `RACE_CHASE` |
| `completeLap(reading, 'TRAINING')` seguido de `stepLap` com aceleração plena por 120 passos (`tests/helpers/autopilot.ts`, existente) | o fim de uma volta de treino pela API pública da volta e os quadros seguintes, com o encadeamento que `race-lap-validation` tiver (revisão 3, US-10) | a câmera do fim de uma volta de treino em diante; as marcas depois do fim de uma volta de treino |
| `LapStateView` construídas à mão a partir de `getLapState` de uma sessão real, trocando só `lapKind` (`OFFICIAL`, `RECON`, `TRAINING`) ou só `lapPhase` | o tipo e a fase da volta como únicos valores alterados | `decideCameraMode` e `computeCameraView` independentes do tipo da volta; `RACE_CHASE` em qualquer fase de volta ativa fora da contagem |
| `Input` com `drift` verdadeiro em trechos alternados e aceleração plena, passados a `stepLap` | os comandos que antes acionavam o drift e o turbo, enquanto o tipo `Input` os tiver | o campo de visão em todos os quadros, com qualquer comando |
| `startLap(lapEnded, …)` | nova volta a partir de `ENDED` (`src/lap.ts:98`) | o primeiro quadro da nova contagem na pose da visão geral |
| `pauseLap` durante a contagem (`PAUSED`, `resumePhase` `COUNTDOWN`) e em `RUNNING` | pausa real | descida parada; câmera parada; rodas sem giro |
| `trackBoundsOf(track, WIDTH / 2 + 1)` | limites da pista sintética | `TRACK_OVERVIEW` e `fitOverviewHeightM` |
| áreas de jogo | (1280, 720), (1000, 1000), (1200, 900), (900, 1200), (720, 1280) px | paisagem, quadrado, 4:3, 3:4 e 9:16; troca de forma entre dois quadros |
| `curve90(reading)` (local do teste) | `drive` com esterço `+1` constante a partir de `moving(50 / 3.6)` colocado por `seedLap` em `RUNNING`, até o rumo girar 90° | todos os quadros de uma curva de 90° a 50 km/h para a projeção do kart |
| modelo projetado | os cantos da caixa envolvente dos 15 grupos e o topo do capacete do modelo em Node, levados ao mundo pela pose e projetados pela câmera de `raceChasePose` com a matriz de projeção calculada em `tests/helpers/kart01Report.ts` | "kart inteiro no quadro" sem renderizar |
| `tests/fixtures/kart01-sim-baseline.json` (**novo**, gravado por `npm run baseline:kart01` antes da primeira mudança de código) | a linha de base de [DM-0001](data/DM-0001-linha-de-base-da-simulacao-e-registro-em-tela.md) | `SIM_CONTRACT`, `DETERMINISM`, `WHEEL_POSITIONS`; `BASELINE_MISSING` com uma cópia alterada (`schemaVersion` 2, `setupVersion` diferente, `trackVersion` diferente, arquivo ausente) |
| `boundsTrace(reading)` (local do teste) | traço `{pose, config}` por passo de uma volta de `completeLap` | `TELEMETRY_WHEEL_POSITIONS` e a comparação com os centros das rodas do modelo |
| `renderNeutralCheck(reading, inputs)` | duas execuções da mesma sequência, uma com a apresentação | `RENDER_NEUTRAL` |

## Funcionalidade por nível

| Funcionalidade | Unitário | Integração | Contrato | Web E2E | Mobile E2E | Razão |
|---|---|---|---|---|---|---|
| FEAT-0001 Kart 01 na pista | sim | sim | sim | E2E-01, E2E-02 | E2E-01, E2E-02 | medidas, grupos, cores e custo no modelo montado em Node; número 01, sombra e ausência do kart provisório exigem tela |
| FEAT-0002 kart reage aos comandos | sim | sim | sim | E2E-03 | E2E-03 | esterço, giro, volante e braços sobre o modelo em Node e `WHEEL_SPIN`; a tela confirma |
| FEAT-0003 câmera de jogo | sim | sim | sim | E2E-01, E2E-02, E2E-04 | E2E-01, E2E-02, E2E-04 | modos, poses e campo de visão sobre sessões reais; pista inteira e painel de resultado exigem tela |
| FEAT-0004 desempenho | sim | sim | sim | E2E-06 | E2E-06 | `DRAW_COST` sobre o modelo montado em Node (`model` (I)) e as medidas sintéticas de 31 chamadas e 5.127 triângulos (U), como na linha NFR-0004; os registros de API-0002 campo a campo (C); taxa de quadros só no aparelho de referência |
| FEAT-0005 efeitos presos ao kart | sim | sim | sim | E2E-05 | E2E-05 | ancoragem por `wheelPositions` em Node; ausência do jato, do nó do escapamento e de qualquer objeto preso ao kart além do modelo por contrato; onde as marcas aparecem e a ausência de drift e de turbo com qualquer comando exigem tela |
| FEAT-0006 transversais | sim | sim | sim | E2E-06 | — | camadas, neutralidade, contrato de passo e determinismo em Node; download medido no navegador |

## Roteiro registrado (web E2E e mobile E2E)

| Id | O que se faz e se registra | Canal |
|---|---|---|
| E2E-01 | abrir a pista: a visão geral mostra a pista inteira do alto, com o Kart 01 na largada (nunca caixas); iniciar uma volta: o primeiro quadro da contagem ainda mostra a visão geral, a câmera desce sem subir em nenhum quadro, e no `VERDE` está atrás do piloto; recarregar a página durante a contagem e durante a corrida: visão geral de novo, com o Kart 01; girar o celular na visão geral: pista inteira na nova forma | desktop e celular |
| E2E-02 | numa volta oficial, completar uma volta e também invalidar uma por reposicionamento (tecla R ou botão, quando oferecida; senão por corte): no fim da volta a simulação para e o kart fica congelado (rodas sem giro, nenhum trecho novo de marca), a câmera continua atrás do kart parado e o painel de resultado aparece sobre a cena sem movê-la; o kart não volta à visão geral enquanto o painel estiver na tela nem depois de "nova volta"; iniciar outra volta a partir do fim: primeiro quadro da contagem na visão geral. No treino, completar uma volta e seguir pilotando: a câmera continua atrás do piloto, acompanhando o kart em movimento, sem visão geral nem descida por causa do fim da volta. A sombra do kart está no chão junto a ele pela câmera de corrida; o número 01 é legível na placa traseira | desktop e celular |
| E2E-03 | em corrida: esterçar para os dois lados e ver as rodas dianteiras e o volante girarem para o mesmo lado, o volante mais; as mãos ficam no aro; acelerar e ver as rodas girarem; pausar (Esc, troca de aba; cobrir o sensor no celular) e ver kart, rodas, câmera e efeitos parados; reposicionar e ver kart e câmera na nova posição no quadro seguinte, sem deslizamento | desktop e celular |
| E2E-04 | em corrida, em paisagem e em retrato: o kart com o piloto inteiro no quadro numa curva de 90° a cerca de 50 km/h; apertar, tocar e inclinar com todos os comandos, inclusive os que antes acionavam o drift e o turbo (Espaço, botão de drift): o campo de visão não muda em nenhum quadro; trocar de orientação: a pose não muda e o campo de visão da nova forma vale no quadro seguinte | celular (as duas formas); desktop (janela mais alta que larga para o retrato) |
| E2E-05 | antes da largada (visão geral e contagem) e em corrida, com todos os comandos, inclusive os que antes acionavam o drift e o turbo: nenhuma indicação de drift junto ao Kart 01 e nenhuma fumaça ou chama saindo do escapamento, em nenhum quadro; sempre que o jogo desenha marcas de pneu, cada trecho novo nasce sob o pneu traseiro exibido do seu lado, também depois do fim de uma volta de treino; depois de um reposicionamento os trechos antigos ficam onde estavam e os novos saem da nova posição; na pausa e depois do fim da volta oficial, nenhum trecho novo | desktop e celular |
| E2E-06 | uma volta completa em corrida com a aba em primeiro plano e sem pausa, contando os quadros de cada segundo com as ferramentas de desempenho do navegador ou um trecho no console (nunca código do jogo): `fpsPerSecond` e `minFps` ≥ 60 no notebook de referência; ≥ 30 no celular de referência em paisagem e em retrato; numa primeira visita com cache vazio, os bytes comprimidos transferidos pela lista de rede < 3 MB | desktop e celular |

## Critérios de aceite: como o teste chega a cada um

`U` unitário, `I` integração, `C` contrato; arquivos em `tests/`, prefixo `modelo-kart-01-`.

| Critério | Teste e caminho |
|---|---|
| AC-US-0001-01 | `model` (I): `KART_DIMENSIONS` de `measureKart01Model(buildKart01Model())`: `bboxLengthM` em 1,93 ± 0,02 (esperado 1,925) e `verdict` `PASS`; `model` (U): medida sintética com 1,96 m dá `FAIL` `OUT_OF_TOLERANCE` |
| AC-US-0001-02 | idem: `bboxWidthM` em 1,45 ± 0,02 |
| AC-US-0001-03 | idem: `wheelbaseM` em 1,05 ± 0,02 |
| AC-US-0001-04 | `model` (I): `WHEELS_AND_TRACKS`: os dois `frontWheelDiametersM` (extensão em Z da geometria mesclada de cada roda no referencial do nó `spin`, DES-0001; esperado 0,26 exato) arredondados ao centímetro iguais a 0,26; (U): 0,27 dá `OUT_OF_TOLERANCE` |
| AC-US-0001-05 | idem: `rearWheelDiametersM` 0,28 |
| AC-US-0001-06 | idem: `frontTrackM` 1,00 |
| AC-US-0001-07 | idem: `rearTrackM` 1,14 |
| AC-US-0001-08 | `model` (I): `PART_GROUPS` com os 15 nomes presentes, cada um com `visibleTriangleCount` > 0, `missingGroupNames` vazia; (U): medida sem `motor` dá `GROUP_MISSING`; um modelo em que uma malha de grupo é removida antes da medida também dá `GROUP_MISSING` |
| AC-US-0001-09 | `model` (I): `piloto` presente com triângulos e sem `parentGroupName` (filho direto de `root`); (U): medida com `parentGroupName` `banco` dá `GROUP_NESTED`; ordem: sem `motor` e com `piloto` aninhado dá `GROUP_MISSING` |
| AC-US-0001-10 | `model` (I): `PART_COLORS`: `#FF6A13` em `kartColorHexes`; (U): sem ele, `COLOR_MISMATCH` |
| AC-US-0001-11 | idem: `#2B2E34` em `chassisColorHexes` |
| AC-US-0001-12 | idem: `bumperPlateColorHex` `#F4F3EF` (a `color` do material de `placaTraseira`, sem `map` em Node) |
| AC-US-0001-13 | idem: `suitColorHex` `#2F55D4` e presente nas cores do grupo `piloto` |
| AC-US-0001-14 | `contract` (C): `src/main.ts` não contém `boxGeo` aplicado a um grupo `kart`, `CylinderGeometry(0.31`, `SphereGeometry(0.36` nem `helmet`, importa `buildKart01Model` e `paintKart01Decals` e contém `kartRoot`; `model` (I): `buildKart01Model()` chamado duas vezes dá dois modelos com as mesmas medidas; E2E-01 e E2E-02 na tela, inclusive depois de recarga e de troca de orientação |
| AC-US-0001-15 | `model` (I): toda malha sólida de `root` tem `castShadow` verdadeiro e os decalques falso; `contract` (C): `src/main.ts` contém `sun.target.position.set` e `shadow.camera` com `left: -60`; E2E-02 na tela pela câmera de corrida |
| AC-US-0001-16 | `model` (I): a malha `placaTraseira` existe no grupo `paraChoqueTraseiro` com material `materials.plate`; `contract` (C): `src/kart01Decals.ts` contém `fillText` com `KART01_NUMBER` e `src/main.ts` chama `paintKart01Decals`; E2E-02 na tela (número legível) |
| AC-US-0002-01 | `pose` (U): `getKartPose(moving(…)).steerAngleRad === state.steering` com `steering` 0, 0,2 e −0,2; `model` (I): depois de `updateKart01Pose(model, {steerAngleRad: 0.2, …})` os nós `steer` de `rodaDianteiraEsq`/`Dir` têm `rotation.y` 0,2 e os traseiros 0; com 0, todos 0; E2E-03 na tela |
| AC-US-0002-02 | `pose` (I): três registros `WHEEL_SPIN` com `rollingSpeedMps` 10, −10 e 0 e `checkStepCount` 120 (`simulatedTimeMs` 1 000): nas quatro rodas `spinRevs === expectedSpinRevs` (10 / (π × 0,26) e 10 / (π × 0,28), com sinal; 0 a 0 m/s) e `verdict` `PASS`; (U): `advanceWheelSpin` com `delta` 0 devolve o mesmo objeto, com `delta` negativo reinicia o contador sem girar, e dois quadros de 60 passos dão o mesmo `spinRevs` que um de 120; um registro sintético com `spinRevs` de sinal trocado dá `SPIN_MISMATCH` |
| AC-US-0002-03 | `model` (U): `steeringWheelAngleRad(0) === 0`, sinal igual ao do argumento, módulo estritamente crescente numa sequência de 0 a 0,36 rad; (I): `steeringWheel.rotation.z` igual a `steeringWheelAngleRad(steerAngleRad)` depois de `updateKart01Pose`; E2E-03 na tela |
| AC-US-0002-04 | `model` (I): para `steerAngleRad` em {−0,36, −0,1, 0, 0,1, 0,36}, depois de `updateKart01Pose`, a posição de cada `glove` está a 0,1386 m do centro do volante no plano do aro (a distância `pegada` de `kart.js`) e o `upperArm` tem comprimento 0,285 m, o `forearm` 0,246 m; E2E-03 na tela |
| AC-US-0002-05 | `pose` (U): `getKartPose` dá `xM`, `zM` iguais a `x`, `z`; `modelOffsetForwardM(0.42, 1.05)` = 0,084 m, e com ele os eixos do modelo ficam a 0,004 m e 0,006 m dos de `wheelPositions(config)`; `model` (I): a caixa envolvente das quatro rodas tem `min.y` 0 (rodas no chão); `pose` (I): numa sessão real, `getKartPose(lap.kart)` depois de `k` passos é o estado do passo `k` (nenhum passo intermediário); depois de `pauseLap` dois quadros seguidos dão a mesma pose e `advanceWheelSpin` não gira; depois de `repositionKart` a primeira leitura é a nova posição e o novo rumo; E2E-03 na tela |
| AC-US-0002-06 | `pose` (U): `headingRad === state.heading`; `model` (I): a caixa do grupo `nariz` tem `max.z` do modelo negativo (frente em −Z) e a do `paraChoqueTraseiro` positivo, e com `root.rotation.y = π` o nariz fica em +Z do pai (a frente da simulação); E2E-03 |
| AC-US-0003-01 | `camera` (I): numa sessão em `RUNNING` (`drive` 300 passos) e nos quadros `ENDED` por conclusão (`completeLap`) e por reposicionamento: `cameraMode` `RACE_CHASE` e `cameraHeightM === 1.38` em todos os quadros; nenhum quadro `TRACK_OVERVIEW` |
| AC-US-0003-02 | idem: `hypot(cameraXM − xM, cameraZM − zM) ≈ 3.05` e `(cameraXM − xM, cameraZM − zM)` paralelo a `−(sin h, cos h)` |
| AC-US-0003-03 | idem: `aimHeightM === 0.30`, `(aimXM − xM, aimZM − zM) = 3.2 × (sin h, cos h)` |
| AC-US-0003-04 | `camera` (U): `viewShapeOf(1280, 720)` e `(1000, 1000)` dão `LANDSCAPE`; `shapeVerticalFovDeg('LANDSCAPE', a) === 62` para toda razão `a ≥ 1`; (I): numa sessão real com o fixture de `Input` com `drift` em trechos alternados e aceleração plena (velocidades de 0 a mais de 25 m/s), em (1280, 720), `verticalFovDeg === 62` em todos os quadros de `RACE_CHASE`; (C): `Object.keys` de toda `CameraView` devolvida, em qualquer modo, sem `baseVerticalFovDeg` nem `turboFovDeltaDeg`; `src/gameCamera.ts` e `src/main.ts` sem `turboActive`, `TURBO_FOV_DELTA_DEG`, `turboFovDeltaDeg` e `baseVerticalFovDeg`; `src/gameCamera.ts` não importa `src/maneuvers.ts` nem o tipo `Input`; a chamada de `computeCameraView` em `src/main.ts` passa exatamente `lapState`, `kartPose`, `viewWidthPx`, `viewHeightPx` e `trackBounds`; E2E-04 |
| AC-US-0003-05 | `camera` (U): `viewShapeOf(720, 1280)` dá `PORTRAIT`; (I): em (720, 1280) e (900, 1200), com o mesmo fixture de comandos de AC-US-0003-04, `horizontalFovDeg ≥ 60` (igual a 60 com 1e-9) em todos os quadros de `RACE_CHASE`; E2E-04 |
| AC-US-0003-06 | idem: `verticalFovDeg ≥ 62` (91,5° em 9:16; 75,2° em 3:4) em todos os quadros, com qualquer comando; troca de (1280, 720) para (720, 1280) entre dois quadros com a mesma pose: a pose não muda e o campo de visão é o da nova forma |
| AC-US-0003-07 | `camera` (I): em quadros consecutivos de `curve90`, `atan2(aimXM − cameraXM, aimZM − cameraZM)` muda exatamente o quanto `headingRad` muda (diferença angular normalizada, 1e-12); também entre o quadro anterior e o posterior a `repositionKart` |
| AC-US-0003-08 | `camera` (I): para todos os quadros de `curve90` em (1280, 720) e (720, 1280), os cantos da caixa dos 15 grupos e o topo do capacete do modelo em Node, levados ao mundo pela pose e projetados pela câmera de `raceChasePose`, ficam com `abs(x) ≤ 1` e `abs(y) ≤ 1` em coordenadas normalizadas; E2E-04 na tela |
| AC-US-0003-10 | `camera` (I): com `lapState` `NO_ACTIVE_LAP`, `cameraMode` `TRACK_OVERVIEW`, `simStepCount` ausente, e os quatro cantos de `trackBoundsOf(track, WIDTH / 2 + 1)` projetados dentro do quadro com margem ≥ 5 % nas cinco áreas de jogo; com `ENDED` de uma volta oficial (conclusão e reposicionamento) e depois do fim de uma volta de treino, nunca `TRACK_OVERVIEW`; E2E-01 |
| AC-US-0003-11 | `camera` (I): `startSession` e `stepLap` passo a passo pelos 360 passos da contagem, lendo `getLapState` e `computeCameraView` a cada passo: `cameraMode` `COUNTDOWN_DESCENT`; nos passos com `countdownRemainingMs ≥ 2900` a pose é igual à de `trackOverviewPose`; `cameraHeightM` nunca maior que no passo anterior e menor no último passo da contagem que no primeiro; com `pauseLap` no meio, dois quadros seguidos dão a mesma pose; depois de `resumeLap`, continua do mesmo ponto; E2E-01 |
| AC-US-0003-12 | `camera` (I): no primeiro quadro `RUNNING` (`countdownRemainingMs` 0), a pose é exatamente `raceChasePose(pose)` e `cameraMode` `RACE_CHASE`; o último quadro `COUNTDOWN` (8 ms) fica a menos de 0,01 m da pose de corrida (sem corte) |
| AC-US-0003-13 | numa sessão `OFFICIAL`: os caminhos de AC-US-0003-01 a -03 e -10 nos quadros `ENDED` (por conclusão e por reposicionamento, com o painel de resultado existente, `getLapResult` sem `code`; `simStepCount` e a pose iguais entre quadros consecutivos, porque a simulação está parada — INV-1 de `race-lap-validation`); `camera` (I): `startLap` aceito sobre a sessão `ENDED` → primeiro quadro `COUNTDOWN_DESCENT` com a pose da visão geral e o quadro anterior em `RACE_CHASE`; E2E-02 |
| AC-US-0003-14 | `camera` (U): para `LapStateView` iguais exceto em `lapKind` (`OFFICIAL`, `RECON`, `TRAINING`), `computeCameraView` dá objetos iguais campo a campo; `decideCameraMode` dá `RACE_CHASE` para `RUNNING`, `ENDED` e `PAUSED` com `resumePhase` `RUNNING`, em qualquer `lapKind`; numa sequência de poses em movimento com `lapKind` `TRAINING`, cada quadro é `raceChasePose` da pose desse quadro; (I): com o fixture `completeLap(reading, 'TRAINING')` seguido de 120 passos, do quadro em que a volta termina em diante, em cada quadro, `cameraMode` `RACE_CHASE`, pose igual a `raceChasePose(getKartPose(lap.kart))` e nunca `TRACK_OVERVIEW` nem `COUNTDOWN_DESCENT`; e `simStepCount`, `xM`, `zM` mudando entre quadros (kart em movimento) — esta última afirmação depende do código de `race-lap-validation` para voltas seguidas no treino e, enquanto ele não existe, falha pela divergência registrada em `98-divergences.md` (REQ-FEAT-0003-16), que não é afrouxada; (C): `src/gameCamera.ts` não contém `lapKind`; E2E-02 |
| AC-US-0004-01 | E2E-06 no notebook de referência nomeado: `minFps ≥ 60`, com `fpsPerSecond` registrado |
| AC-US-0004-02 | E2E-06 no celular intermediário de referência nomeado, paisagem e retrato: `minFps ≥ 30`; nenhuma execução em desktop usada como evidência |
| AC-US-0005-01 | `pose` (U): `simWheelGroundPositions(pose, config)` igual, valor a valor, à transformação de `wheelPositions(config)` pela pose; (I): `TELEMETRY_WHEEL_POSITIONS` sobre `boundsTrace` com `differingValueCount` 0, e os centros das rodas traseiras do modelo (levados ao mundo com `modelOffsetForwardM`) distam 0,03 m na lateral desses pontos; `contract` (C): `src/main.ts` não contém `skidClock` (os quatro usos de `0068a57` — `:141`, `:231` em `beginLap`, `:448-450`, `:472` — saem por [DES-0005](web/DES-0005-efeitos-presos-ao-kart.md)) e contém `lastSkidStepCount` e `simWheelGroundPositions`; (I): com o fixture `completeLap(reading, 'OFFICIAL')`, `simStepCount` igual em todos os quadros depois de `ENDED`, logo nenhum trecho novo (a cadência é por `simStepCount`); E2E-05 na tela (marca sob o pneu; trechos antigos parados; nenhum trecho na pausa nem depois do fim da volta oficial; trechos novos depois do fim de uma volta de treino) |
| AC-US-0005-04 | `contract` (C): em `src/main.ts`, o único objeto preso a `kartRoot` ou a um nó de `kart01` é `kart01.root` (`kartRoot.add(kart01.root)`), e os filhos que `src/main.ts` acrescenta à cena são a luz hemisférica, `sun`, `sun.target`, o chão, `syntheticScene`, `kartRoot`, `skidMarks` e as cenas de pista: nenhum objeto de indicação de drift; nenhum objeto da cena lê `maneuvers.drifting` além da condição de situação das marcas (a linha do `if` que precede `simWheelGroundPositions`); `model` (I): os descendentes de `buildKart01Model().root` são só os 16 grupos, os seus nós animáveis e as malhas de decalque; E2E-05 na tela, antes da largada e em corrida, com todos os comandos |
| AC-US-0005-05 | `contract` (C): `src/main.ts` não contém `exhaust`, `jet`, `ConeGeometry` nem `exhaustOutlet`, e nenhum objeto da cena lê `.boost`; `src/kart01Model.ts` não contém `exhaustOutlet` nem `escapamentoSaida`; `model` (I): `Object.keys(buildKart01Model().anchors)` é exatamente `['bumperPlate']` e nenhum descendente de `root` se chama `escapamentoSaida`; E2E-05 na tela, antes da largada e em corrida, com todos os comandos |

## Requisitos não funcionais

| NFR | Como é provado |
|---|---|
| NFR-0001 | E2E-06 com `fpsPerSecond` e `minFps` em `docs/kart-01/device-log.md`, por aparelho e orientação; a métrica do limite perdido é `minFps` |
| NFR-0002 | E2E-06: bytes comprimidos pela lista de transferências de rede numa primeira visita com cache vazio, < 3 MB, registrados no device log junto ao tamanho de `dist/assets/` do `npm run build` |
| NFR-0003 | `contract` (C): `package.json` declara exatamente `['three']` em `dependencies`, com versão iniciada por `^0.186`; nenhum módulo novo importa fora de `three`, `three/addons/…` e `./…` |
| NFR-0004 | `model` (I): `DRAW_COST` com `meshCount` 27, `drawCallCount ≤ 30` (27) e `triangleCount === 5128`, `verdict` `PASS`; (U): 31 dá `LIMIT_EXCEEDED`, 5.127 dá `SHAPE_CHANGED`, e com os dois, `LIMIT_EXCEEDED` |
| NFR-0005 | `contract` (C): `LAYERING` com `checkedFileCount` 6 e `forbiddenImportCount` 0; `RENDER_NEUTRAL` sobre a volta de referência com `differingFieldCount` 0; os módulos novos sem DOM, relógio e sorteio (lista de [DES-0007](security/DES-0007-privacidade-sem-rede-e-sem-persistencia.md)) |
| NFR-0006 | `contract` (C): `SIM_CONTRACT` com os três booleanos verdadeiros e `simWheelbaseM` 1,04, `simTrackWidthM` 1,20 (`inputContractUnchanged` cobre o conjunto de campos pela linha do tipo da linha de base e as faixas pela saturação de `step`: pares além/no limite com `State` igual, limite/dentro da faixa com `State` diferente e limite/junto ao limite (a 0,01) com `State` diferente — um limite movido para fora, ou para dentro de 0,01 ou mais, dá `false`; um movido para dentro de menos de 0,01 fica só para a diferença de 0 linhas abaixo, [DES-0006](web/DES-0006-verificacoes-de-npm-test-e-relatorio-do-modelo.md)); `DETERMINISM` com `comparedRunCount` 2 e `differingRunCount` 0; com o fixture ausente ou de `setupVersion` diferente, os dois dão `FAIL` `BASELINE_MISSING` sem comparar; a diferença do repositório nos três arquivos da simulação e nos presets (0 linhas) é registrada pelo manifesto da etapa de código |
| NFR-0007 | `pose` e `contract` (I): `WHEEL_POSITIONS` com `comparedValueCount` 16 e `differingValueCount` 0; `TELEMETRY_WHEEL_POSITIONS` com `differingValueCount` 0 em todos os passos; `BASELINE_MISSING` sem fixture |

## Verificações existentes

Nenhuma de outra feature é removida (conventions §17). As verificações desta feature que provavam os
critérios retirados no F-Spec 1.3 — a parcela de turbo do critério 09 de US-0003 em `tests/modelo-kart-01-camera.test.ts`,
o jato preso a `anchors.exhaustOutlet` do critério 02 de US-0005 em `tests/modelo-kart-01-contract.test.ts` e a posição
do nó em `tests/modelo-kart-01-model.test.ts`, e a condição de drift do critério 03 de US-0005 — saem com eles, como
API-0003 2.0.0 declara para os campos retirados, e no lugar ficam as verificações de ausência de AC-US-0003-04,
AC-US-0005-04 e AC-US-0005-05. `tests/race-lap-validation-layering.test.ts` continua valendo para os
módulos que lista; `tests/physics.test.ts`, `tests/maneuvers.test.ts` e os testes da `dirigibilidade` não
são tocados. O `autopilot` existente é usado só para gravar a linha de base; as verificações reproduzem os
`Input` gravados.
