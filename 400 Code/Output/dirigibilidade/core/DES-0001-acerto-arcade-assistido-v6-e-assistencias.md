---
id: DES-0001
title: Acerto Arcade assistido v6 (acerto C), assistências, pista de teste aberta e passo sem drift nem turbo — implementação
feature: dirigibilidade
stage: code
status: validated
version: 2.0.0
sources: [FEAT-0001, FEAT-0002, FEAT-0003, FEAT-0004, FEAT-0005, FEAT-0006, RULE-0001, RULE-0002, FLOW-0001, REQ-FEAT-0001-01, REQ-FEAT-0001-02, REQ-FEAT-0001-03, REQ-FEAT-0001-04, REQ-FEAT-0001-07, REQ-FEAT-0001-08, REQ-FEAT-0002-08, REQ-FEAT-0002-11, REQ-FEAT-0002-12, REQ-FEAT-0002-13, REQ-FEAT-0003-01, REQ-FEAT-0003-04, REQ-FEAT-0003-05, REQ-FEAT-0003-06, REQ-FEAT-0003-09, REQ-FEAT-0003-10, REQ-FEAT-0003-11, REQ-FEAT-0003-13, REQ-FEAT-0003-16, REQ-FEAT-0004-01, REQ-FEAT-0004-02, REQ-FEAT-0004-03, REQ-FEAT-0004-04, REQ-FEAT-0004-05, REQ-FEAT-0004-08, REQ-FEAT-0004-10, REQ-FEAT-0005-07, REQ-FEAT-0005-09, REQ-FEAT-0006-01, REQ-FEAT-0006-02, REQ-FEAT-0006-03, REQ-FEAT-0006-04]
---

# DES-0001 — Acerto Arcade assistido v6, assistências, pista de teste aberta e passo sem drift nem turbo — implementação

`src/physics.ts`, camada simulação, existente e alterado na rodada de código 5 (projeto DES-0001 4.0.1). O arquivo renomeado
(`…-v5-…` → `…-v6-…`) acompanha o item de projeto. Inalterados: `STEP` (`:6`), `PHYSICS_VERSION` (`:8`), a linha de `Input` (`:9`),
`RENTAL_KART` (`:55-64`), `ARCADE_KART` (`:67-74`), `KART_PRESETS` (`:75`), `ARCADE_ASSISTIDO_V5` (`:79-89`), `TEST_PAD`, a
assinatura de `step` (`:376`) e a linha 3 (reexportação de `./track`); a linha 2 continua o `import` de `./maneuvers`, só com
`initialManeuvers` e o tipo `Maneuvers` (ADR-0006).

## Realização por requisito

| Requisito | Arquivo e símbolo |
|---|---|
| REQ-FEAT-0004-02, REQ-FEAT-0002-11, -12, -13, REQ-FEAT-0005-09 | `src/physics.ts:92-95` `ARCADE_ASSISTIDO_V6` (`{...ARCADE_ASSISTIDO_V5, governorSpeed: 19.5, assistLateralG: 2.4, maxSteer: 0.5, friction: 2.1, frontStiffness: 26}`), `:106-107` `PUBLISHED_SETUPS.ARCADE_ASSISTIDO` (`arcade-assistido-v6`, `previousSetupVersion` `arcade-assistido-v4`, `previousConfig` `ARCADE_KART`); `ARCADE_ASSISTIDO_V5` intacto |
| REQ-FEAT-0001-01 a -04, REQ-FEAT-0003-04, -05 (ambiente) | `src/physics.ts:198-200` `testPadArea` (disco de asfalto na origem, `walls: false`, `grass` fora; raio não positivo dá tudo `grass`); `testPadLane`/`testPadArc` retirados |
| REQ-FEAT-0003-13, -16, REQ-FEAT-0006-01 | `src/physics.ts` `integrate` (`:223` limite de esterço, `:229` atrito traseiro, `:236` governador, `:278` folga lateral, `:289-293` momento só do ramo de `yawTrackingGainPerS`, sem a força de impulso; sem cancelamentos em `:327`, `:345`) e `step` (`:383` o passo parte do estado recebido; sem `onRoad`, `advanceManeuvers` nem o cancelamento na grama); `State.maneuvers` carregado sem mudança (`:310`) e `initialManeuvers()` no estado inicial (`:124`) |
| REQ-FEAT-0003-01, -06, -09, -10, -11, REQ-FEAT-0001-07, -08, REQ-FEAT-0002-08 | `src/physics.ts` `isForcing`, `forcingRampFraction`, `step` (`:380` condição de forçar por chamada), assistências de `integrate` (inalteradas) |
| REQ-FEAT-0004-01, -03, -04, -05, -08, -10 | `src/physics.ts` `integrate` (motor, grama, parede; inalterados) |
| REQ-FEAT-0005-07, REQ-FEAT-0006-02, -03, -04 | `src/physics.ts` (`STEP`, `SOLVER_SUBSTEPS`, `Input`, `step`, `RENTAL_KART` inalterados; sem `three`, DOM, `Date`, `performance`, `Math.random`) |

## Invariantes provados nesta rodada

Script de prova fora do repositório (cópia da árvore anterior de `src/physics.ts` contra a nova), 72 000 passos sobre
`RENTAL_KART`, `ARCADE_KART`, `ARCADE_ASSISTIDO_V5` e `ARCADE_ASSISTIDO_V6` em `CIRCUIT`, `TEST_PAD` e no ambiente da pista do
Kart Park, com `Input` binário e proporcional: (1) sem o comando de drift, o estado de cada passo é igual, campo a campo
(`Object.is`), ao da árvore anterior — 0 diferenças; (2) com `drift: true` em todos os passos, o estado é igual ao sem o comando —
0 diferenças. O classificador de passo (`StepClass`, `RECOVERY_MAX_STEPS`, `classifyHandlingSteps`) saiu.
