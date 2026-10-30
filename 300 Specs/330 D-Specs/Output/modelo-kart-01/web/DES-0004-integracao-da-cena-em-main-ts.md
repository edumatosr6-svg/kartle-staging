---
id: DES-0004
title: Integração da cena em src/main.ts — Kart 01 na cena, sombra que acompanha o kart, câmera aplicada por quadro e taxa de quadros
feature: modelo-kart-01
stage: dspec
status: validated
version: 1.3.0
sources: [FLOW-0001, FLOW-0002, SCR-0001, FEAT-0001, FEAT-0002, FEAT-0003, FEAT-0004, FEAT-0006, REQ-FEAT-0001-01, REQ-FEAT-0001-15, REQ-FEAT-0001-16, REQ-FEAT-0001-17, REQ-FEAT-0002-01, REQ-FEAT-0002-02, REQ-FEAT-0002-05, REQ-FEAT-0002-06, REQ-FEAT-0002-07, REQ-FEAT-0002-08, REQ-FEAT-0002-09, REQ-FEAT-0003-01, REQ-FEAT-0003-04, REQ-FEAT-0003-11, REQ-FEAT-0003-15, REQ-FEAT-0003-16, REQ-FEAT-0003-17, REQ-FEAT-0004-01, REQ-FEAT-0004-02, REQ-FEAT-0004-05, REQ-FEAT-0006-01, NFR-0001, NFR-0002]
---

# DES-0004 — Integração da cena em `src/main.ts`

## Realiza

O quadro de exibição de FLOW-0001 e a largada de FLOW-0002 na aplicação: todo kart exibido é o Kart 01 e o
kart provisório não aparece em nenhum quadro, também depois de recarga ou troca de orientação
(REQ-FEAT-0001-01, -17); o número 01 e a sombra no chão junto ao kart (REQ-FEAT-0001-15, -16); o kart na
posição, no rumo, no esterço e no giro que a simulação informa, do último passo concluído, parado na pausa e
sem quadro intermediário no reposicionamento (REQ-FEAT-0002-01, -02, -05 a -09); a câmera de
[DES-0003](DES-0003-camera-de-jogo.md) aplicada em cada quadro com a forma da área de jogo lida nesse quadro,
também depois do fim da volta oficial e do fim de uma volta de treino, e chamada sem nenhuma entrada de comando
do Jogador ou de turbo, de modo que só o campo de visão de base da forma é aplicado (REQ-FEAT-0003-01, -04,
-11, -15, -16, -17); o orçamento de quadro de FEAT-0004 e o teste registrado nos aparelhos de
referência (REQ-FEAT-0004-01, -02, -05); o download abaixo de 3 MB sem recurso novo (REQ-FEAT-0006-01). Os
efeitos estão em [DES-0005](DES-0005-efeitos-presos-ao-kart.md).

## Posicionamento

`src/main.ts`, camada **Aplicação**, alterado (as linhas são as do commit `0068a57`, que já carrega as mudanças
da `dirigibilidade`; a etapa de código desta feature começa depois de aquela feature fechar o seu código —
[ADR-0003](../adr/ADR-0003-ordem-de-entrega-depois-da-dirigibilidade-e-sem-chave.md) — e reencontra cada
trecho pelo símbolo). Os adaptadores de controle continuam dentro dele, inalterados. `index.html` e
`src/style.css` não mudam: nenhum texto, controle ou elemento de HUD é acrescentado (SCR-0001). Nenhum módulo
novo neste item.

## Interface

| Trecho atual de `src/main.ts` | Mudança |
|---|---|
| `:1-12` importações | entram `buildKart01Model`, `updateKart01Pose`, `KART01_WHEELBASE_M` de `./kart01Model`; `paintKart01Decals` de `./kart01Decals`; `getKartPose`, `advanceWheelSpin`, `initialWheelSpin`, `modelOffsetForwardM`, `simWheelGroundPositions` de `./kartPose`; `computeCameraView`, `trackBoundsOf` e o tipo `CameraView` de `./gameCamera`. `wheelPositions` sai da importação de `./physics` (os seus dois usos, `:124` e `:451`, são retirados ou passam por `simWheelGroundPositions`) |
| `:19` `new THREE.PerspectiveCamera(48, 1, 0.1, 500)` | mantida; `fov`, `aspect` e `far` passam a ser escritos por quadro por `applyCameraView` |
| `:32-38` luz direcional `sun` e sombra | a luz e o mapa de sombra 2048 × 2048 ficam; os limites da câmera de sombra passam de ±120/±100 m fixos na origem a **±60 m em torno do kart exibido**: uma vez, na montagem da cena, a caixa `sun.shadow.camera` passa a `left` −60, `right` 60, `top` 60, `bottom` −60 (m), com a matriz de projeção atualizada, e `sun.target` entra na cena; por quadro, `sun.position` e `sun.target.position` acompanham o kart exibido (linha "luz por quadro" abaixo), com a mesma direção de luz de hoje. Motivo: a caixa fixa só cobre ±120 m da origem e deixaria o kart sem sombra numa pista maior (a `pista-kart-park`); 120 m em 2 048 texels dão 5,9 cm por texel, sombra nítida junto ao kart (REQ-FEAT-0001-16). A sombra de objetos a mais de 60 m do kart deixa de ser desenhada — aparência da sombra de outros objetos é lacuna deliberada do F-Spec |
| `:113-120` e `:123-134` kart provisório (`kart`, `box(...)`, `helmet`, `wheels`, cilindros de raio 0,31) | **retirados por inteiro** (I3: a aposentadoria é esta remoção; nenhum campo publicado o descrevia); `:121-122` — o comentário e `let setup: PublishedSetup = PUBLISHED_SETUPS.ARCADE_ASSISTIDO;`, da `dirigibilidade` — **ficam**: `setup` continua lido em `:158` (`config`), `:160` (`setupRef`), `:220` (`compareLapRecords`), `:228` (`beginLap`) e `:251-253` (troca de preset), e nenhum preset é tocado (REQ-FEAT-0006-06). Entra, uma vez por página e antes do primeiro quadro, nesta ordem: o modelo montado por `buildKart01Model()` ([DES-0001](DES-0001-modelo-kart-01-montagem-agrupamento-e-decalques.md)); os decalques pintados sobre ele por `paintKart01Decals`; `kart01.root` girado de π em torno de Y; um grupo novo `kartRoot`, filho da cena, que contém `kart01.root`. `kartRoot` vive no referencial da simulação (frente +Z, esquerda +X) e o giro de π põe a frente do modelo (−Z do modelo) na frente da simulação |
| `:136-142` marcas de pneu | mantidas; a lógica por quadro muda em [DES-0005](DES-0005-efeitos-presos-ao-kart.md) |
| `:143-151` jatos de escapamento | **retirados**: a versão 1.2.0 os trocava por um jato preso ao Kart 01; desde o F-Spec 1.3 nenhuma fumaça ou chama de turbo é exibida, e o jato da primeira rodada de código sai ([DES-0005](DES-0005-efeitos-presos-ao-kart.md); seção Revisão 1.3.0 abaixo) |
| `:156` `idleKart`, `:165` `started` | `idleKart` mantido: antes da primeira volta o kart exibido é `initialState()`, na largada, visto pela visão geral (FLOW-0002, passo 2). `started` fica só para o HUD (`:518`); a câmera não o lê mais |
| `:161-164` leitura da pista | acrescenta o estado local `trackBounds`, calculado uma vez depois da leitura: `trackBoundsOf(track, WIDTH / 2 + 1)` (a faixa externa de `:66`) quando `reading.trackDataStatus` é `COMPLETE` ou `INCOMPLETE`; indefinido com `UNREADABLE` ou `UNSUPPORTED_SCHEMA`, caso em que não há cena (`NO_SCENE`) |
| estado local novo | `spin`, o giro acumulado das rodas, iniciado por `initialWheelSpin()`; `cameraView`, a `CameraView` do quadro corrente, indefinida até a primeira calculada |
| `:391-394` `ResizeObserver` | continua a chamar `renderer.setSize(host.clientWidth, host.clientHeight)`; `camera.aspect` passa a ser escrito por quadro em `applyCameraView`, pela largura e altura lidas nesse quadro (REQ-FEAT-0003-15: a nova forma vale no quadro seguinte) |
| `:395-397` câmera inicial fixa em (125, 130, 145) e `cameraTarget` | **retirados**: a visão geral é `TRACK_OVERVIEW` de `computeCameraView` |
| `:424` `const state = lap?.kart ?? idleKart` | mantido; segue `const pose = getKartPose(state)` ([DES-0002](DES-0002-estado-do-kart-para-exibicao-e-giro-das-rodas.md)); o estado é o do último passo concluído no laço de `:412-423` (REQ-FEAT-0002-07) |
| `:442` `kart.position.set(state.x, 0, state.z); kart.rotation.y = state.heading` | `kartRoot` recebe a posição `(pose.xM, 0, pose.zM)` e a rotação em Y `pose.headingRad`; `kart01.root` recebe, em Z do pai, o deslocamento `modelOffsetForwardM((lap?.config ?? config).frontWeight, KART01_WHEELBASE_M)` — o ponto de referência de RULE-0003 fica em `(xM, zM)` e a base das rodas no chão (`y` 0); o eixo do para-choque ao nariz aponta em `headingRad` (REQ-FEAT-0002-05, -06). Com `NO_STATE` (não ocorre com `idleKart`): `kartRoot` fica invisível nesse quadro e nada é estimado |
| `:473-477` laço das rodas (`pivot.rotation.y = telemetry.wheels[i].steerAngle`; `mesh.rotateY(state.speed * dt / 0.31)` com `running`) | **retirado**. Entra, por quadro e depois da pose: `spin` avança por `advanceWheelSpin(spin, pose)` e o modelo recebe `updateKart01Pose(kart01, …)` com `steerAngleRad` = `pose.steerAngleRad` e `wheelSpinRevs` = `spin.revs` — esterço por `steerAngleRad`, giro por tempo simulado e `rollingSpeedMps` com sinal, nunca por `dt` (REQ-FEAT-0002-01, -02); na pausa `simStepCount` não avança e nada gira (REQ-FEAT-0002-08) |
| `:478-482` perseguição suavizada (`cameraTarget`, `lerp`, `lookAt` 9 m à frente) e `:483-487` `targetFov` com termo de velocidade, turbo e `lerp` | **retirados** ([ADR-0002](../adr/ADR-0002-camera-como-funcao-pura-do-quadro.md)). Entra, por quadro e depois da pose: leitura da largura e da altura da área de jogo (`host.clientWidth`, `host.clientHeight`); só com as duas maiores que 0, `computeCameraView` ([DES-0003](DES-0003-camera-de-jogo.md)) é chamada com exatamente cinco entradas: `lapState` = `getLapState(lap)`, `kartPose` = `pose`, `viewWidthPx` e `viewHeightPx` = a largura e a altura lidas nesse quadro, e `trackBounds` — sem termo de velocidade, sem condição de turbo e sem nenhum comando do Jogador (REQ-FEAT-0003-17); com `NO_SCENE`, `cameraView` fica indefinida; senão `cameraView` recebe o resultado e `applyCameraView(camera, cameraView)` é chamada. Com 0 px numa das dimensões, `cameraView` não muda nesse quadro |
| função local nova `applyCameraView(camera, view)` | `(THREE.PerspectiveCamera, CameraView) => void`, sem estado e sem retorno: escreve na câmera, nesta ordem, a posição a partir de `cameraXM`, `cameraHeightM`, `cameraZM`; `up` = +Y; a mira (`lookAt`) a partir de `aimXM`, `aimHeightM`, `aimZM`; `fov` = `verticalFovDeg` (o `fov` de `PerspectiveCamera` é o vertical em graus); `aspect` = `viewWidthPx` ÷ `viewHeightPx`; `far` = o maior entre 500 m e 3 × `cameraHeightM`, para que a pista inteira entre no volume de visão da visão geral; por fim a matriz de projeção é atualizada |
| luz por quadro | depois da pose: `sun.position` recebe `(pose.xM + 45, 100, pose.zM + 60)` e `sun.target.position` recebe `(pose.xM, 0, pose.zM)` (m) — a caixa de sombra de ±60 m acompanha o kart exibido |
| `:538` `renderer.render(scene, camera)` | a cena é desenhada só com `cameraView` definida; sem ela, o `renderer` só limpa o quadro — sem pista carregada nenhuma cena é desenhada e nenhum kart provisório aparece (SCR-0001, estados Carregando, Vazio e Erro) |
| `:224-235` `beginLap`, `:191-194` `emitReposition`, `:270` `#lap-new-lap` | `:231` (dentro de `beginLap`) perde a atribuição `skidClock = 0`: o símbolo `skidClock` sai de `src/main.ts` por [DES-0005](DES-0005-efeitos-presos-ao-kart.md), que lista os seus quatro usos em `0068a57` (`:141`, `:231`, `:448-450`, `:472`); `skidMarks.count = 0; skidIndex = 0; previousSkids = [];` ficam em `:231`, e `lastSkidStepCount` não é escrito ali: a nova volta cria um `kart` com `stepCount` 0 e a regra do contador que recua (DES-0005, linha `:472`) o reinicia no primeiro quadro da volta nova, como o contador de giro reinicia sozinho ([DES-0002](DES-0002-estado-do-kart-para-exibicao-e-giro-das-rodas.md)). O resto de `:224-235`, e `:191-194` e `:270` por inteiro, ficam inalterados: a nova volta e o reposicionamento criam um `kart` com `stepCount` 0; depois do fim da volta oficial a sessão continua `ENDED` até um novo `startLap`, com a simulação parada e o kart congelado, como hoje (INV-1 de `race-lap-validation`; `src/lap.ts:190`; o laço de passos de `src/main.ts:499` para em `ENDED`): `simStepCount` não avança, a pose lida é a mesma e a câmera continua em `RACE_CHASE` atrás do kart parado, também com `#welcome` visível de novo (RULE-0002: o que o Jogador faz até a próxima visão geral não é fixado). Depois do fim de uma volta de treino, o encadeamento das voltas é de `race-lap-validation` (revisão 3, US-10) e não é tocado aqui: a cena lê por quadro o `lap.kart` que a sessão tiver, e a câmera, decidida só pela fase e pela pose, segue o kart em movimento em `RACE_CHASE` sem nada nesta integração que dependa do tipo da volta (REQ-FEAT-0003-16) |

## Revisão 1.3.0 sobre a árvore corrente (F-Spec 1.3)

A tabela acima foi escrita sobre `0068a57` e a primeira rodada de código desta feature a realizou. Esta
revisão muda só o seguinte, nas linhas da árvore corrente:

| Trecho da árvore corrente de `src/main.ts` | Mudança |
|---|---|
| `:581-587` (comentário "… and the turbo condition"; chamada de `computeCameraView` com `turboActive: config.drivingAssists && !reducedMotion && tricks.boost > 0`) | a chave `turboActive` sai da chamada, que passa as cinco entradas da linha `:478-487` acima; o comentário deixa de citar o turbo. Nenhum comando do Jogador chega à câmera, e o campo de visão aplicado por `applyCameraView` é sempre o de base da forma (REQ-FEAT-0003-05 a -07, -17; [DES-0003](DES-0003-camera-de-jogo.md), Retirada) |
| `:150-157` e `:555-556` (jato de escapamento) | retirados por [DES-0005](DES-0005-efeitos-presos-ao-kart.md) |
| `:553` `const tricks = state.maneuvers` | fica: ainda é lido pela condição de situação das marcas (`:559`) e pelo HUD da manobra (`:616-626`), que não são desta feature; depois desta revisão nenhum objeto da cena desta feature lê `tricks.boost` |
| `applyCameraView`, `kartRoot`, sombra, giro, `trackBounds` | inalterados |

Orçamento de quadro (FEAT-0004): o kart com o piloto custa 27 chamadas de desenho e 5.128 triângulos
([DES-0001](DES-0001-modelo-kart-01-montagem-agrupamento-e-decalques.md)), mais a passagem de sombra das
23 malhas que projetam sombra (os 4 decalques não projetam); cenário, pista, marcas, minimapa e HUD ficam como
hoje; `renderer.setPixelRatio(Math.min(devicePixelRatio, 2))` (`:27`) fica. Nenhum ajuste de qualidade, sombra
ou detalhe é exposto. Se o teste registrado ficar abaixo do limite, a redução é no custo do kart sem mudar a
forma (menos malhas por mesclagem adicional, dentro das regras de [ADR-0001](../adr/ADR-0001-material-unico-com-cores-por-vertice-e-malhas-por-grupo.md)),
nunca no limite, e a sombra continua (`DOMAIN/DEC-05`).

Download (REQ-FEAT-0006-01): o build atual tem 579 177 bytes de JS e 11 407 de CSS sem compressão
(`dist/assets/`, 152 903 bytes gzip medidos pela `race-lap-validation`); o modelo é código (cerca de 700
linhas) sem textura, modelo ou fonte baixados; nenhuma dependência nova. A medida é a de `test-strategy.md`,
NFR-0002.

## Colaboradores

Chama `src/kart01Model.ts`, `src/kart01Decals.ts`, `src/kartPose.ts`, `src/gameCamera.ts`, `src/lap.ts`
(`getLapState`, como hoje), `src/track.ts` (`track`, `WIDTH`), `three`. Não é chamado por nenhum módulo.

## Estado e concorrência

Estado local novo: `spin` (giro acumulado por `simStepCount`), `cameraView` (a câmera do quadro corrente),
`trackBounds` (calculado uma vez). O modelo é construído uma vez por página; recarga descarta tudo e volta a
`TRACK_OVERVIEW` com `idleKart` (REQ-FEAT-0001-17; FLOW-0002). Idempotência: cada quadro reescreve pose,
câmera e luz a partir do estado corrente; um quadro sem passo novo reescreve os mesmos valores
(REQ-FEAT-0002-07); nada desta feature escreve na simulação (`stepLap` continua o único ponto de escrita,
`:416`; `RENDER_NEUTRAL`). Nada é persistido.

## Comportamento em falha

- WebGL ausente: tratamento existente (`:21-26`), antes de montar o modelo.
- Pista não carregada: `NO_SCENE`, `renderer.clear()`; a mensagem é de `race-lap-validation` (`:203-206`).
- Área de jogo com 0 px (aba oculta ou `host` sem tamanho): a câmera do quadro anterior é mantida e nada é
  desenhado; `requestAnimationFrame` já é suspenso pelo navegador com a aba oculta.
- `getKartPose` `NO_STATE`: kart invisível nesse quadro, câmera em `TRACK_OVERVIEW`, nada estimado.
- Rede: nenhuma chamada. Registro em log: só `console.warn` com códigos (os existentes de `:162-164`,
  `:221`, `:434`, e `kart01-decals` de [DES-0001](DES-0001-modelo-kart-01-montagem-agrupamento-e-decalques.md)).

## Observabilidade das metas de desempenho

NFR-0001 (60 fps no notebook, 30 fps no celular intermediário, paisagem e retrato) é medido no aparelho
nomeado, em teste registrado em `docs/kart-01/device-log.md` (**novo**, no molde de
`docs/lap-validation-device-log.md`): aparelho, navegador, orientação, contagem de quadros de cada segundo de
uma volta completa em corrida com a aba em primeiro plano e sem pausa, e a menor contagem (REQ-FEAT-0004-05).
A contagem por segundo vem das ferramentas de desempenho do navegador ou de um trecho colado no console do
navegador durante o teste (contagem de `requestAnimationFrame` por segundo); **nenhum instrumento é
acrescentado ao jogo** — seria superfície só de teste. A métrica que mostra o limite perdido é a menor
contagem por segundo. Uma execução em desktop não vale para celular (I9).

## Determinismo (D-DS-07)

Não é código de simulação. O relógio de parede continua decidindo só quantos passos rodam num quadro
(`advanceClock`, `:412`) e a vigilância do sensor (`:402`); pose, giro, câmera e luz dependem de
`simStepCount`, `countdownRemainingMs` e do estado — nunca de `dt`. Prova: `RENDER_NEUTRAL` e
`tests/modelo-kart-01-contract.test.ts` afirmam que `src/main.ts` não contém mais `rotateY(state.speed`,
`camera.position.lerp`, `THREE.MathUtils.lerp(camera.fov`, `boxGeo` para o kart, `turboActive` nem o jato de
escapamento, e importa os quatro módulos novos.

## Feature flag

Nenhuma: a substituição do kart provisório e da câmera alta é a própria entrega e o F-Spec proíbe chave
para voltar a eles (FEAT-0001 e FEAT-0003, Configuração); a reversão é a do repositório
([ADR-0003](../adr/ADR-0003-ordem-de-entrega-depois-da-dirigibilidade-e-sem-chave.md)).

## Pontos em aberto

Nenhum.
