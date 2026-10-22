---
id: DES-0002
title: Estado do kart para exibição (API-0001), velocidade de rolamento, giro das rodas e ponto de referência
feature: modelo-kart-01
stage: dspec
status: validated
version: 1.0.0
sources: [API-0001, RULE-0003, FEAT-0002, FEAT-0005, FLOW-0001, REQ-FEAT-0002-01, REQ-FEAT-0002-02, REQ-FEAT-0002-05, REQ-FEAT-0002-06, REQ-FEAT-0002-07, REQ-FEAT-0002-08, REQ-FEAT-0002-09, REQ-FEAT-0005-01, REQ-FEAT-0005-06, NFR-0005, NFR-0006, NFR-0007]
---

# DES-0002 — Estado do kart para exibição, velocidade de rolamento, giro das rodas e ponto de referência

## Realiza

O contrato API-0001 campo a campo (`getKartPose`), o giro acumulado das rodas por `simStepCount` e a tabela
de decisão do giro de RULE-0003 (REQ-FEAT-0002-02), o ponto de referência do kart exibido em relação a
`wheelPositions` (REQ-FEAT-0002-05; RULE-0003), o estado do último passo sem interpolação, parado na pausa e
sem quadro intermediário no reposicionamento (REQ-FEAT-0002-07, -08, -09), e as posições de roda da
simulação no mundo, que as marcas de pneu e a verificação `TELEMETRY_WHEEL_POSITIONS` usam
(REQ-FEAT-0005-01, -06; NFR-0007). Leitura pura: não acrescenta campo ao estado da simulação nem muda o
passo (NFR-0005, NFR-0006).

## Posicionamento

`src/kartPose.ts`, camada **Aplicação**, **novo**, puro (sem DOM, sem `three`, sem relógio). Importa de
`src/physics.ts` só `wheelPositions`, `bodyVelocity`, `STEP` e os tipos `State`, `KartConfig`. Motivo de não
estar em `src/physics.ts`: o F-Spec proíbe alterar esse arquivo (REQ-FEAT-0006-06) e a leitura é
apresentação (I2); fica no molde de `src/frameClock.ts`.

## Interface

| Símbolo | Assinatura | Descrição |
|---|---|---|
| `KartPose` | tipo | exatamente os campos de API-0001: `simStepCount` (inteiro, passos), `xM`, `zM` (m), `headingRad`, `steerAngleRad` (rad), `rollingSpeedMps` (m/s) |
| `getKartPose(state)` | `(State \| undefined) => KartPose \| { code: 'NO_STATE' }` | `simStepCount` = `state.stepCount` (o mesmo de `getHandlingTelemetry`, `src/physics.ts:356`); `xM` = `state.x`, `zM` = `state.z`; `headingRad` = `state.heading`; `steerAngleRad` = `state.steering` (o ângulo de esterço que a simulação mantém saturado em `limit`, `src/physics.ts:203-211`; 0 com as rodas alinhadas; positivo para a esquerda, a convenção da simulação); `rollingSpeedMps` = `rollingSpeedMps(state)`; `undefined` dá `NO_STATE` sem lançar |
| `rollingSpeedMps(state)` | `(State) => número (m/s)` | `u = bodyVelocity(state).u` (componente da velocidade ao longo do rumo, `src/physics.ts:123-126`); devolve `state.speed` se `u ≥ 0` e `−state.speed` se `u < 0`: módulo da velocidade do kart com sinal negativo quando o movimento é para trás em relação ao rumo; em derrapagem continua sendo a velocidade do kart, sem escorregamento por roda; 0 com o kart parado |
| `WheelSpinState` | tipo | `{ simStepCount: inteiro (passos); revs: Record<WheelName, número (rotações)> }`; `WheelName` de [DES-0001](DES-0001-modelo-kart-01-montagem-agrupamento-e-decalques.md) |
| `initialWheelSpin()` | `() => WheelSpinState` | `simStepCount` 0 e 0 rotações em cada roda |
| `WHEEL_DIAMETERS_M` | `Readonly<Record<WheelName, número (m)>>` | 0,26 nas dianteiras, 0,28 nas traseiras (os de [DES-0001](DES-0001-modelo-kart-01-montagem-agrupamento-e-decalques.md)) |
| `advanceWheelSpin(spin, pose)` | `(WheelSpinState, KartPose) => WheelSpinState` | `delta = pose.simStepCount − spin.simStepCount` (passos). Se `delta > 0`: para cada roda, `revs += pose.rollingSpeedMps × (delta × STEP) / (π × WHEEL_DIAMETERS_M[roda])`, e `simStepCount = pose.simStepCount`. Se `delta === 0` (quadro sem passo novo, pausa): devolve `spin` inalterado. Se `delta < 0` (contador reiniciado: nova volta ou reposicionamento, cujo kart nasce de `initialState()` com `stepCount` 0, `src/lap.ts:110-112`, `:158-161`): devolve `{ simStepCount: pose.simStepCount, revs: spin.revs }` sem girar — o passo de um contador anterior nunca é aplicado de novo |
| `modelOffsetForwardM(frontWeight, modelWheelbaseM)` | `(adimensional em (0, 1), m) => m` | `modelWheelbaseM × (0,5 − frontWeight)`: quanto o meio do entre-eixos do modelo fica à frente da posição da simulação ao longo do rumo. Em `wheelPositions` (`src/physics.ts:127-133`) o eixo traseiro está a `wheelbase × frontWeight` atrás da posição e o dianteiro a `wheelbase × (1 − frontWeight)` à frente, logo a posição está na fração `frontWeight` do entre-eixos a partir do eixo traseiro; o ponto de referência do modelo é o ponto da sua linha central, no chão, nessa mesma fração a partir do seu eixo traseiro (RULE-0003). Com `frontWeight` 0,42 (os dois acertos publicados) e 1,05 m: 0,084 m |
| `simWheelGroundPositions(pose, config)` | `(KartPose, KartConfig) => readonly { xM: número; zM: número }[]` (4, na ordem de `wheelPositions`) | `xM = pose.xM + forward × sin(headingRad) + left × cos(headingRad)`, `zM = pose.zM + forward × cos(headingRad) − left × sin(headingRad)` para cada `{forward, left}` de `wheelPositions(config)`: a mesma transformação de `src/physics.ts:229` e de `src/main.ts:451-455`. É de onde as marcas de pneu saem ([DES-0005](DES-0005-efeitos-presos-ao-kart.md)) e o que `TELEMETRY_WHEEL_POSITIONS` compara com `wheelPositions`; nunca os centros das rodas do modelo |

Diferença conhecida (RULE-0003; `DOMAIN/DEC-02`): com o deslocamento acima, cada posição traseira de
`wheelPositions` fica 0,03 m para fora do centro da roda traseira exibida (bitola 1,20 m contra 1,14 m) e, ao
longo do rumo, a 0,004 m do eixo traseiro do modelo e a 0,006 m do dianteiro (entre-eixos 1,04 m contra
1,05 m): no máximo 0,01 m. O pneu traseiro exibido tem 0,19 m de largura, de modo que uma marca de 0,19 m
centrada 0,03 m para fora continua sob o pneu.

Decisão de forma: `steerAngleRad` é `state.steering`, e não o ângulo por roda de `state.telemetry.wheels[i].steerAngle`
(a correção de Ackermann por roda, `src/physics.ts:223-224`), porque API-0001 carrega um único ângulo e
REQ-FEAT-0002-01 manda girar **cada** roda dianteira por ele; as duas rodas exibidas recebem o mesmo ângulo.

## Colaboradores

Chamado por `src/main.ts` (uma leitura de `getKartPose` por quadro; `advanceWheelSpin` por quadro;
`modelOffsetForwardM` com `lap.config` ou `config`; `simWheelGroundPositions` para as marcas), por
`src/gameCamera.ts` (tipo `KartPose`) e por `tests/modelo-kart-01-pose.test.ts`. Chama só `src/physics.ts`.

## Estado e concorrência

`getKartPose`, `rollingSpeedMps`, `modelOffsetForwardM` e `simWheelGroundPositions` são leituras puras:
repetir a chamada sobre o mesmo `state` devolve o mesmo valor e nada é alterado. `WheelSpinState` é o único
estado de exibição deste item, vive em `src/main.ts` e avança só quando `simStepCount` avança, na ordem de
`simStepCount`; o contador de sequência é `simStepCount` e um `delta` não positivo nunca gira. Vários passos
entre dois quadros entram como um `delta` só, com o `rollingSpeedMps` do último passo, exatamente como
REQ-FEAT-0002-02 define o giro entre dois quadros. Nada é persistido.

## Comportamento em falha

`state` ausente devolve `NO_STATE` sem lançar; `src/main.ts` então não desenha o kart nesse quadro e não
estima nada ([DES-0004](DES-0004-integracao-da-cena-em-main-ts.md)). Não há dependência, tempo-limite nem
escrita. Nada é registrado em log.

## Observabilidade

`WHEEL_SPIN` e `TELEMETRY_WHEEL_POSITIONS` na saída de `npm test`
([DES-0006](DES-0006-verificacoes-de-npm-test-e-relatorio-do-modelo.md)). Igualdade estrita em `WHEEL_SPIN`:
a verificação aplica os `N` passos num único quadro, com velocidades inteiras (10, −10 e 0 m/s) e `N` = 120,
de modo que `delta × STEP` = 1 exatamente em ponto flutuante e `spinRevs` e `expectedSpinRevs` são a mesma
expressão `v × 1 / (π × d)` — sem tolerância, como RULE-0001 e o changelog dos requisitos exigem.

## Determinismo (D-DS-07)

Não é código de simulação; funções puras sem relógio nem sorteio. Prova: `tests/modelo-kart-01-pose.test.ts`
afirma `getKartPose` campo a campo sobre estados construídos com `initialState()` e velocidade dada (como
`tests/physics.test.ts:5`), o sinal de `rollingSpeedMps` com `u` negativo, `advanceWheelSpin` com `delta`
0, positivo e negativo, e `RENDER_NEUTRAL` afirma que ler a pose a cada passo não muda a sessão.

## Feature flag

Nenhuma: leitura aditiva do estado que não altera nenhum passo (API-0001, Compatibilidade).

## Pontos em aberto

Nenhum.
