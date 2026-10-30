---
title: Divergências — modelo Kart 01 e câmera de jogo
feature: modelo-kart-01
stage: dspec
status: validated
version: 1.5.0
sources: []
---

# Divergências

Registro durável dos requisitos deste conjunto que o sistema em execução não satisfaz (conventions §6). O
F-Spec (1.3, `fspec-validation-20261030-1202`) é normativo: nenhuma linha abaixo enfraquece um requisito. Cada
linha cita o que existe em `arquivo:linha`, a etapa que deve a mudança e o item de projeto que a fecha. As
linhas da rodada 1 citam `src/main.ts` do commit `0068a57`, que já carregava as mudanças da `dirigibilidade`;
a primeira rodada de código desta feature trabalhou sobre elas e registra a resolução no seu próprio
registro. As linhas da rodada 5 (F-Spec 1.3: drift e turbo fora do jogo, treino com voltas seguidas) citam a
árvore de trabalho corrente, que já tem aquela rodada de código. As linhas dos requisitos que o F-Spec 1.3
retirou (o 10 de FEAT-0003, os 02 e 03 de FEAT-0005) saíram deste registro com eles. As linhas das rodadas 6 e 7
(feedback da `dirigibilidade`, FB-01 e FB-02; FEAT-0005 2.1.0, com a situação de marca de pneu e sem o requisito 04)
citam a árvore corrente de 2026-10-30, que já publica `arcade-assistido-v6`. Caminhos relativos à raiz do repositório.

| Requisito | O que exige | O que o sistema faz hoje | Etapa devedora | Item de projeto | Estado |
|---|---|---|---|---|---|
| REQ-FEAT-0001-01, -02 a -14, -17 | todo kart exibido é o Kart 01, com as medidas, os 16 grupos e as cores da ficha, nos dois canais e nas duas formas | `src/main.ts:113-120` e `:123-134` montam o kart provisório (`:121-122`, `let setup`, é da `dirigibilidade` e fica): três caixas (`#e7a056`, `#edb45f`, `#243e35`), uma esfera `helmet`, quatro cilindros de raio 0,31 m e largura 0,28 m em `wheelPositions(setup.config)` (bitola 1,20 m, entre-eixos 1,04 m); nenhum grupo nomeado, nenhuma das quatro cores, 1,45 m de largura só na caixa dianteira; `docs/kart-01/kart.js` não é importado | código | DES-0001, DES-0004, DES-0006, ADR-0001 | open |
| REQ-FEAT-0001-15 | número 01 na placa do para-choque exibido | não existe placa nem número (`src/main.ts:113-120`) | código | DES-0001, DES-0004 | open |
| REQ-FEAT-0001-16 | sombra do kart no chão, visível junto ao kart pela câmera de corrida | o kart de caixas projeta sombra (`box()` em `:74`; rodas em `:130`) numa caixa de sombra fixa de ±120 m × ±100 m em torno da origem (`:36`), 2 048 texels: 11,7 cm por texel, e sem sombra fora da caixa | código | DES-0004 | open |
| REQ-FEAT-0002-01 | cada roda dianteira girada pelo `steerAngleRad` que a simulação informa | `src/main.ts:474` gira cada pivô pelo ângulo **por roda** da telemetria (`telemetry.wheels[i].steerAngle`, correção de Ackermann), e não por um único ângulo de esterço; `getKartPose` não existe | código | DES-0002, DES-0004 | open |
| REQ-FEAT-0002-02 | giro das quatro rodas pela taxa de rolamento vezes o tempo simulado entre quadros, com sinal, por `simStepCount`; `WHEEL_SPIN` em `npm test` | `src/main.ts:476` gira `state.speed × dt / 0.31`: relógio de parede (`dt`), velocidade sem sinal, raio 0,31 m, só com `running`; nenhum registro `WHEEL_SPIN` | código | DES-0002, DES-0004, DES-0006 | open |
| REQ-FEAT-0002-03, -04, -10 | volante que gira com o esterço, mãos no aro, sete peças animáveis depois do agrupamento | não há volante, braços nem piloto articulado; o capacete é uma esfera fixa (`:117-119`) | código | DES-0001, DES-0004, ADR-0001 | open |
| REQ-FEAT-0002-05 | ponto de referência de RULE-0003 em (`xM`, `zM`), rodas no chão | `:442` põe a origem do kart de caixas na posição; o kart de caixas tem as rodas nas posições da simulação, logo não precisa de deslocamento; o modelo do Kart 01 precisa de 0,084 m (`modelOffsetForwardM`), que não existe | código | DES-0002, DES-0004 | open |
| REQ-FEAT-0003-01, -02, -03, -08, -13 | câmera de corrida a 1,38 m, 3,05 m atrás, mira 3,2 m à frente a 0,30 m, presa ao rumo sem suavização | `:478-482`: perseguição a 18 m atrás e 14 m de altura, mirando 9 m à frente a 0,5 m, com `camera.position.lerp(…, 1 − exp(−dt × 5))` (atraso e suavização por relógio de parede); `getCameraView`/`computeCameraView` não existem | código | DES-0003, DES-0004, ADR-0002 | open |
| REQ-FEAT-0003-04, -05, -06, -07, -15 | forma da área de jogo por quadro; 62° vertical em paisagem em todos os quadros, a qualquer velocidade; retrato com horizontal ≥ 60° e vertical ≥ 62°; regra da nova forma no quadro seguinte | campo de visão 48° (`:19`) mais `min(5, velocidade × 0,15)` e a parcela de turbo (`:483`), suavizado (`:485`); nenhuma distinção de forma: `camera.aspect` só muda no `ResizeObserver` (`:391-394`) | código | DES-0003, DES-0004, ADR-0002 | open |
| REQ-FEAT-0003-09 | kart inteiro no quadro numa curva de 90° a 50 km/h, nas duas formas | não há requisito violado pela câmera atual (o kart é pequeno no quadro), mas nenhuma prova existe; com a nova pose a prova é a projeção de `tests/modelo-kart-01-camera.test.ts` | código | DES-0003 | open |
| REQ-FEAT-0003-11 | visão geral só sem volta ativa, pista inteira no quadro nas duas formas; nunca depois do fim de uma volta, oficial ou de treino, até uma nova contagem | câmera inicial fixa em (125, 130, 145) olhando a origem (`:395-396`) enquanto `started` é falso (`:478`): não é ajustada aos limites da pista nem à forma (em retrato a pista sai do quadro); `started` nunca volta a falso, logo `ENDED` fica na perseguição — a permanência vale por acidente, sem modo decidido pelo estado da volta | código | DES-0003, DES-0004 | open |
| REQ-FEAT-0003-12, -14 | descida da visão geral para trás do piloto durante a contagem, função só de `countdownRemainingMs` e da pose, altura que nunca aumenta, pose da visão geral no primeiro quadro | não há descida: `started` passa a verdadeiro em `beginLap` (`:229`) e a perseguição suavizada começa no primeiro quadro da contagem, com a câmera vindo de (125, 130, 145) por `lerp` de relógio de parede | código | DES-0003, DES-0004, ADR-0002 | open |
| REQ-FEAT-0004-03, -04 | ≤ 30 chamadas de desenho e 5.128 triângulos do modelo montado, em `DRAW_COST` | o kart de caixas tem 9 malhas; o Kart 01 não está montado; nenhum registro `DRAW_COST` | código | DES-0001, DES-0006, ADR-0001 | open |
| REQ-FEAT-0004-01, -02, -05 | taxa de quadros sustentada registrada nos aparelhos de referência, com o Kart 01, a sombra e a câmera de corrida | nenhum registro para esta feature (`docs/kart-01/device-log.md` não existe) | código, testes | DES-0004, DM-0001 | open |
| REQ-FEAT-0005-01, -07, -08 | marcas de pneu nas posições traseiras de `wheelPositions` da configuração da volta, um trecho por avanço de `simStepCount`, nenhum na suspensão, trechos antigos parados no reposicionamento | `:451-455` usa `wheelPositions(config)` da aplicação (igual a `lap.config` hoje) com a transformação correta; a cadência é de relógio de parede (`skidClock += dt`, `:448-449`), não de `simStepCount`; o reinício em reposicionamento é indireto (velocidade 0 esvazia `previousSkids`, `:472`) | código | DES-0005 | open |
| REQ-FEAT-0003-05, -06, -07, -17 (rodada 5) | só o campo de visão de base da forma, em todos os quadros; nenhum comando do Jogador muda o campo de visão; API-0003 2.0.0 sem `baseVerticalFovDeg` nem `turboFovDeltaDeg` | árvore corrente: `src/main.ts:586` passa `turboActive` (`drivingAssists`, sem `prefers-reduced-motion`, `tricks.boost > 0`) e `src/gameCamera.ts:181-182` soma `TURBO_FOV_DELTA_DEG` (`:48`, 4°) à base: com o turbo acionado pelo Jogador, 66° em paisagem e base + 4° em retrato; `src/gameCamera.ts:26-27` e `:185` publicam os dois campos retirados | código | DES-0003, DES-0004, ADR-0002 | open |
| REQ-FEAT-0005-10 (rodada 5) | nenhuma fumaça ou chama de turbo saindo do escapamento do Kart 01, antes da largada e em corrida, com qualquer comando | árvore corrente: `src/main.ts:150-157` prende um cone (`ConeGeometry(0.18, 1.2, 8)`) a `kart01.anchors.exhaustOutlet` e `:555-556` o mostra com `tricks.boost > 0`, pulsando; o nó `escapamentoSaida` existe só para ele (`src/kart01Model.ts:45`, `:526-530`, `:539`) | código | DES-0005, DES-0001, ADR-0001 | open |
| REQ-FEAT-0005-09 (rodada 5) | nenhuma indicação de drift junto ao Kart 01, antes da largada e em corrida, com qualquer comando | árvore corrente: o drift ainda existe no jogo (`src/main.ts:495` lê o comando de drift; `src/maneuvers.ts`); não há objeto próprio de indicação na cena, mas as marcas de pneu só nascem com `maneuvers.drifting` (`src/main.ts:559`) e a versão 1.1.0 de DES-0005 as designava como a indicação de drift. Esta feature retira a designação e não cria efeito; a retirada do drift do jogo é da `dirigibilidade` (revisão 4, `DOMAIN/DEC-07`); a situação em que as marcas nascem é a da linha seguinte | código (`dirigibilidade`, retirada do drift; esta feature em DES-0005) | DES-0005, ADR-0003 | open |
| REQ-FEAT-0005-11, -12 (rodada 7) | um trecho novo sob cada pneu traseiro em cada quadro com passo novo, `lapPhase` `RUNNING`, `speedMps` maior que 6 e `sideslipRad` maior que 0,055 em `getHandlingTelemetry`; nenhum em qualquer outro quadro, com qualquer comando | árvore corrente: o `if` do bloco das marcas (`src/main.ts:554`) exige `tricks.drifting`, lê `state.speed` e `state.telemetry.sideslip` direto de `State` e não `getHandlingTelemetry`, e desenha no máximo um trecho a cada `SKID_STEP_INTERVAL` (5) passos (`:147`, `:555`); `State.maneuvers` vale sempre `initialManeuvers()` na janela de compatibilidade da `dirigibilidade` (ADR-0006 daquela feature, decisão 2), logo o `if` nunca vale e nenhuma marca é desenhada | código (esta feature, na próxima rodada de código) | DES-0005, ADR-0003 | open |
| REQ-FEAT-0003-16; REQ-FEAT-0005-01 depois do fim de uma volta de treino (rodada 5) | no treino, do fim de uma volta até a próxima visão geral, câmera em `RACE_CHASE` em relação ao kart **em movimento**; trechos novos de marca sob os pneus traseiros depois do fim de uma volta de treino | árvore corrente: a câmera já atende — `decideCameraMode` dá `RACE_CHASE` para toda fase de volta ativa fora da contagem e não lê `lapKind` (`src/gameCamera.ts:72-76`); mas toda volta, de qualquer tipo, termina em `ENDED` e para a simulação (`src/lap.ts:190`; o laço de passos de `src/main.ts:499` para em `ENDED`): no treino o kart congela, contra `DOMAIN/DEC-07`. O encadeamento das voltas seguidas é de `race-lap-validation` (revisão 3, US-10), nomeado e não redefinido aqui; a parte "kart em movimento" da verificação de AC-US-0003-14 falha até lá | código (`race-lap-validation`, US-10 da revisão 3) | DES-0003, DES-0005 (nada a mudar nesta feature) | open |
| REQ-FEAT-0005-05, -06 | `WHEEL_POSITIONS` e `TELEMETRY_WHEEL_POSITIONS` em `npm test` contra a linha de base | nenhum registro; nenhuma linha de base (`tests/fixtures/kart01-sim-baseline.json` não existe) | código | DES-0006, DM-0001, ADR-0004 | open |
| REQ-FEAT-0005-05; REQ-FEAT-0006-07, -08 (rodada 6) | registros comparados com a linha de base do acerto publicado; `BASELINE_MISSING` só quando ela falta | árvore corrente: `tests/fixtures/kart01-sim-baseline.json` gravado com `arcade-assistido-v5` (`recordedOnCommit` `b86b200`); a árvore já publica `arcade-assistido-v6` (`src/physics.ts:106`), e `tests/helpers/kart01Report.ts:340` devolve `BASELINE_MISSING` até a regravação | código (esta feature, na próxima rodada de código) | DM-0001, ADR-0004, ADR-0003 | open |
| REQ-FEAT-0006-04, -05 | `LAYERING` e `RENDER_NEUTRAL` em `npm test` | `tests/race-lap-validation-layering.test.ts` protege a simulação dos módulos que existem hoje, mas não conhece os módulos desta feature; nenhum `RENDER_NEUTRAL` | código | DES-0006 | open |
| REQ-FEAT-0006-07, -08 | `SIM_CONTRACT` e `DETERMINISM` em `npm test` contra a linha de base | `tests/race-lap-validation-determinism.test.ts` prova determinismo entre execuções da mesma sessão; nenhum registro de API-0002 nem linha de base anterior à feature | código | DES-0006, DM-0001, ADR-0004 | open |

Satisfeitos hoje, sem divergência, e protegidos pelo projeto: o kart exibido no rumo que a simulação
informa (REQ-FEAT-0002-06: `src/main.ts:442`); o estado do último passo concluído, sem interpolação
(REQ-FEAT-0002-07: `:424` lê `lap.kart` depois do laço de `:412-423`); kart parado na pausa
(REQ-FEAT-0002-08: `src/lap.ts:173` devolve a sessão em `PAUSED`); nova posição no primeiro quadro depois
do reposicionamento (REQ-FEAT-0002-09: `src/lap.ts:158-164` substitui `kart`); download de 579 177 + 11 407 bytes sem
compressão (REQ-FEAT-0006-01); `three` como única dependência de execução, `^0.186.1` (REQ-FEAT-0006-02,
-03: `package.json`); os três arquivos da simulação e os presets intactos (REQ-FEAT-0006-06: nenhum item de
projeto os toca).

Fato conferido no as-built e que o F-Spec 1.3 especifica igual, sem divergência: ao fim da volta oficial (`ENDED`),
válida ou invalidada, inclusive por reposicionamento, a simulação para e o kart congela — hoje a sessão em
`ENDED` não avança (`src/lap.ts:173`; `src/main.ts:403` só avança em `COUNTDOWN` e `RUNNING`), e é isso que
FEAT-0003 (tabela Comportamento, "Fim da volta oficial"), RULE-0002 (tabela Modos; transição "`RACE_CHASE`
permanece `RACE_CHASE` — volta oficial"), FLOW-0001 (passo 1) e `02-glossary.md` ("Em corrida", "Fim da volta",
"Volta oficial") do F-Spec 1.3 exigem, pelo invariante INV-1 de `race-lap-validation` (`DM-0002` daquela feature: nenhum passo muda a
sessão depois de `ENDED`), que esta feature não muda (REQ-FEAT-0006-06 proíbe tocar `src/lap.ts`). Só a câmera
continua na pose de corrida em relação ao kart parado, até a próxima visão geral: realizado por DES-0003
(`decideCameraMode`, `ENDED` → `RACE_CHASE`; câmera função só da pose), DES-0004 (`beginLap`, `emitReposition`
e `#lap-new-lap` inalterados) e [ADR-0002](adr/ADR-0002-camera-como-funcao-pura-do-quadro.md) (Consequências).
Nenhum requisito de pilotagem depois do fim da volta existe no F-Spec, e nenhuma proposta ao autor fica
pendente sobre isso: a pergunta da rodada 1 foi respondida pelo dono do produto (`DOMAIN/DEC-06` corrigida em
2026-10-22, absorvida pelo F-Spec 1.2.0; `97-changelog.md`, rodada 2).
