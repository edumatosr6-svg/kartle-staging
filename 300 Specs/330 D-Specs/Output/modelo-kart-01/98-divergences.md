---
title: Divergências — modelo Kart 01 e câmera de jogo
feature: modelo-kart-01
stage: dspec
status: validated
version: 1.0.0
sources: []
---

# Divergências

Registro durável dos requisitos deste conjunto que o sistema em execução não satisfaz (conventions §6). O
F-Spec (1.1.0) é normativo: nenhuma linha abaixo enfraquece um requisito. Cada linha cita o que existe hoje
em `arquivo:linha` — `src/main.ts` do commit `0068a57`, que já carrega as mudanças da `dirigibilidade` —, a
etapa que deve a mudança e o item de projeto que a fecha. Caminhos relativos à raiz do repositório.

| Requisito | O que exige | O que o sistema faz hoje | Etapa devedora | Item de projeto | Estado |
|---|---|---|---|---|---|
| REQ-FEAT-0001-01, -02 a -14, -17 | todo kart exibido é o Kart 01, com as medidas, os 16 grupos e as cores da ficha, nos dois canais e nas duas formas | `src/main.ts:113-134` monta o kart provisório: três caixas (`#e7a056`, `#edb45f`, `#243e35`), uma esfera `helmet`, quatro cilindros de raio 0,31 m e largura 0,28 m em `wheelPositions(setup.config)` (bitola 1,20 m, entre-eixos 1,04 m); nenhum grupo nomeado, nenhuma das quatro cores, 1,45 m de largura só na caixa dianteira; `docs/kart-01/kart.js` não é importado | código | DES-0001, DES-0004, DES-0006, ADR-0001 | open |
| REQ-FEAT-0001-15 | número 01 na placa do para-choque exibido | não existe placa nem número (`src/main.ts:113-120`) | código | DES-0001, DES-0004 | open |
| REQ-FEAT-0001-16 | sombra do kart no chão, visível junto ao kart pela câmera de corrida | o kart de caixas projeta sombra (`box()` em `:74`; rodas em `:130`) numa caixa de sombra fixa de ±120 m × ±100 m em torno da origem (`:36`), 2 048 texels: 11,7 cm por texel, e sem sombra fora da caixa | código | DES-0004 | open |
| REQ-FEAT-0002-01 | cada roda dianteira girada pelo `steerAngleRad` que a simulação informa | `src/main.ts:474` gira cada pivô pelo ângulo **por roda** da telemetria (`telemetry.wheels[i].steerAngle`, correção de Ackermann), e não por um único ângulo de esterço; `getKartPose` não existe | código | DES-0002, DES-0004 | open |
| REQ-FEAT-0002-02 | giro das quatro rodas pela taxa de rolamento vezes o tempo simulado entre quadros, com sinal, por `simStepCount`; `WHEEL_SPIN` em `npm test` | `src/main.ts:476` gira `state.speed × dt / 0.31`: relógio de parede (`dt`), velocidade sem sinal, raio 0,31 m, só com `running`; nenhum registro `WHEEL_SPIN` | código | DES-0002, DES-0004, DES-0006 | open |
| REQ-FEAT-0002-03, -04, -10 | volante que gira com o esterço, mãos no aro, sete peças animáveis depois do agrupamento | não há volante, braços nem piloto articulado; o capacete é uma esfera fixa (`:117-119`) | código | DES-0001, DES-0004, ADR-0001 | open |
| REQ-FEAT-0002-05 | ponto de referência de RULE-0003 em (`xM`, `zM`), rodas no chão | `:442` põe a origem do kart de caixas na posição; o kart de caixas tem as rodas nas posições da simulação, logo não precisa de deslocamento; o modelo do Kart 01 precisa de 0,084 m (`modelOffsetForwardM`), que não existe | código | DES-0002, DES-0004 | open |
| REQ-FEAT-0003-01, -02, -03, -08, -13 | câmera de corrida a 1,38 m, 3,05 m atrás, mira 3,2 m à frente a 0,30 m, presa ao rumo sem suavização | `:478-482`: perseguição a 18 m atrás e 14 m de altura, mirando 9 m à frente a 0,5 m, com `camera.position.lerp(…, 1 − exp(−dt × 5))` (atraso e suavização por relógio de parede); `getCameraView`/`computeCameraView` não existem | código | DES-0003, DES-0004, ADR-0002 | open |
| REQ-FEAT-0003-04, -05, -06, -07, -15 | forma da área de jogo por quadro; 62° vertical em paisagem a qualquer velocidade; retrato com horizontal ≥ 60° e vertical ≥ 62°; regra da nova forma no quadro seguinte | campo de visão 48° (`:19`) mais `min(5, velocidade × 0,15)` (`:483`), suavizado (`:485`); nenhuma distinção de forma: `camera.aspect` só muda no `ResizeObserver` (`:391-394`) | código | DES-0003, DES-0004, ADR-0002 | open |
| REQ-FEAT-0003-09 | kart inteiro no quadro numa curva de 90° a 50 km/h, nas duas formas | não há requisito violado pela câmera atual (o kart é pequeno no quadro), mas nenhuma prova existe; com a nova pose a prova é a projeção de `tests/modelo-kart-01-camera.test.ts` | código | DES-0003 | open |
| REQ-FEAT-0003-10 | com turbo, vertical = base da forma + a diferença do efeito existente (4°) | `:483` soma 4° ao 48° com termo de velocidade e suaviza por `dt` (`:485`): quadros sem turbo acima da base e quadros com turbo abaixo de base + 4 | código | DES-0003, DES-0004, ADR-0002 | open |
| REQ-FEAT-0003-11 | visão geral só sem volta ativa, pista inteira no quadro nas duas formas; nunca em `ENDED` | câmera inicial fixa em (125, 130, 145) olhando a origem (`:395-396`) enquanto `started` é falso (`:478`): não é ajustada aos limites da pista nem à forma (em retrato a pista sai do quadro); `started` nunca volta a falso, logo `ENDED` fica na perseguição — a permanência vale por acidente, sem modo decidido pelo estado da volta | código | DES-0003, DES-0004 | open |
| REQ-FEAT-0003-12, -14 | descida da visão geral para trás do piloto durante a contagem, função só de `countdownRemainingMs` e da pose, altura que nunca aumenta, pose da visão geral no primeiro quadro | não há descida: `started` passa a verdadeiro em `beginLap` (`:229`) e a perseguição suavizada começa no primeiro quadro da contagem, com a câmera vindo de (125, 130, 145) por `lerp` de relógio de parede | código | DES-0003, DES-0004, ADR-0002 | open |
| REQ-FEAT-0004-03, -04 | ≤ 30 chamadas de desenho e 5.128 triângulos do modelo montado, em `DRAW_COST` | o kart de caixas tem 9 malhas; o Kart 01 não está montado; nenhum registro `DRAW_COST` | código | DES-0001, DES-0006, ADR-0001 | open |
| REQ-FEAT-0004-01, -02, -05 | taxa de quadros sustentada registrada nos aparelhos de referência, com o Kart 01, a sombra e a câmera de corrida | nenhum registro para esta feature (`docs/kart-01/device-log.md` não existe) | código, testes | DES-0004, DM-0001 | open |
| REQ-FEAT-0005-01, -07, -08 | marcas de pneu nas posições traseiras de `wheelPositions` da configuração da volta, um trecho por avanço de `simStepCount`, nenhum na suspensão, trechos antigos parados no reposicionamento | `:451-455` usa `wheelPositions(config)` da aplicação (igual a `lap.config` hoje) com a transformação correta; a cadência é de relógio de parede (`skidClock += dt`, `:448-449`), não de `simStepCount`; o reinício em reposicionamento é indireto (velocidade 0 esvazia `previousSkids`, `:472`) | código | DES-0005 | open |
| REQ-FEAT-0005-02 | fumaça saindo do escapamento do Kart 01 | dois jatos presos ao kart de caixas em (±0,37, 0,4, −1,35) (`:143-151`); o Kart 01 tem uma ponteira à direita, atrás | código | DES-0005 | open |
| REQ-FEAT-0005-03 | indicação de drift junto às rodas traseiras do Kart 01 exibido | não há efeito próprio de drift na cena; durante o drift as marcas (`:447`) são o efeito junto às rodas, hoje sob as rodas de caixas | código | DES-0005 | open |
| REQ-FEAT-0005-05, -06 | `WHEEL_POSITIONS` e `TELEMETRY_WHEEL_POSITIONS` em `npm test` contra a linha de base | nenhum registro; nenhuma linha de base (`tests/fixtures/kart01-sim-baseline.json` não existe) | código | DES-0006, DM-0001, ADR-0004 | open |
| REQ-FEAT-0006-04, -05 | `LAYERING` e `RENDER_NEUTRAL` em `npm test` | `tests/race-lap-validation-layering.test.ts` protege a simulação dos módulos que existem hoje, mas não conhece os módulos desta feature; nenhum `RENDER_NEUTRAL` | código | DES-0006 | open |
| REQ-FEAT-0006-07, -08 | `SIM_CONTRACT` e `DETERMINISM` em `npm test` contra a linha de base | `tests/race-lap-validation-determinism.test.ts` prova determinismo entre execuções da mesma sessão; nenhum registro de API-0002 nem linha de base anterior à feature | código | DES-0006, DM-0001, ADR-0004 | open |

Satisfeitos hoje, sem divergência, e protegidos pelo projeto: o kart exibido no rumo que a simulação
informa (REQ-FEAT-0002-06: `src/main.ts:442`); o estado do último passo concluído, sem interpolação
(REQ-FEAT-0002-07: `:424` lê `lap.kart` depois do laço de `:412-423`); kart parado na pausa
(REQ-FEAT-0002-08: `src/lap.ts:173` devolve a sessão em `PAUSED`); nova posição no primeiro quadro depois
do reposicionamento (REQ-FEAT-0002-09: `src/lap.ts:158-164` substitui `kart`); efeitos nas mesmas situações
(REQ-FEAT-0005-04: as condições de `:445` e `:447` não mudam); download de 579 177 + 11 407 bytes sem
compressão (REQ-FEAT-0006-01); `three` como única dependência de execução, `^0.186.1` (REQ-FEAT-0006-02,
-03: `package.json`); os três arquivos da simulação e os presets intactos (REQ-FEAT-0006-06: nenhum item de
projeto os toca).

Fato lido como as-built que o F-Spec descreve de outro modo e que nenhum `REQ-*` desta feature exige: o
glossário e RULE-0002 dizem que, com a volta encerrada, "o kart continua pilotável"; hoje a sessão em
`ENDED` não avança (`src/lap.ts:173`; `src/main.ts:403` só avança em `COUNTDOWN` e `RUNNING`) e o kart fica
parado. Não é divergência deste conjunto — o fim da volta e o seu ciclo pertencem à `race-lap-validation`
(INV-1 de `DM-0002` daquela feature: nenhum passo muda a sessão depois de `ENDED`) e REQ-FEAT-0006-06 proíbe
mudar `src/lap.ts` — e o projeto da câmera vale nos dois casos, porque é função só da pose
([ADR-0002](adr/ADR-0002-camera-como-funcao-pura-do-quadro.md)). Registrado em `97-changelog.md` como
proposta ao autor.
