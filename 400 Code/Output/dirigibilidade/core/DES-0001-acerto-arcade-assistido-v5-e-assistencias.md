---
id: DES-0001
title: Acerto Arcade assistido v5, assistências, pista de teste e classificação do passo — implementação
feature: dirigibilidade
stage: code
status: draft
version: 1.0.0
sources: [FEAT-0001, FEAT-0002, FEAT-0003, FEAT-0004, FEAT-0006, RULE-0001, RULE-0002, FLOW-0001, REQ-FEAT-0001-01, REQ-FEAT-0001-02, REQ-FEAT-0001-03, REQ-FEAT-0001-04, REQ-FEAT-0001-07, REQ-FEAT-0001-08, REQ-FEAT-0002-01, REQ-FEAT-0002-02, REQ-FEAT-0002-03, REQ-FEAT-0002-04, REQ-FEAT-0002-05, REQ-FEAT-0002-08, REQ-FEAT-0002-10, REQ-FEAT-0003-01, REQ-FEAT-0003-02, REQ-FEAT-0003-03, REQ-FEAT-0003-04, REQ-FEAT-0003-05, REQ-FEAT-0003-06, REQ-FEAT-0003-09, REQ-FEAT-0003-10, REQ-FEAT-0003-11, REQ-FEAT-0003-12, REQ-FEAT-0004-01, REQ-FEAT-0004-02, REQ-FEAT-0004-03, REQ-FEAT-0004-04, REQ-FEAT-0004-05, REQ-FEAT-0004-08, REQ-FEAT-0004-10, REQ-FEAT-0005-07, REQ-FEAT-0005-09, REQ-FEAT-0006-01, REQ-FEAT-0006-02, REQ-FEAT-0006-03, REQ-FEAT-0006-04]
---

# DES-0001 — Acerto Arcade assistido v5, assistências, pista de teste e classificação do passo — implementação

`src/physics.ts`, camada simulação, alterado. O que não muda: `STEP`, `PHYSICS_VERSION`, `Input`, `RENTAL_KART`, `ARCADE_KART`,
`KART_PRESETS`, a assinatura de `step`, a constante `TEST_PAD`, a linha 3 (afirmado por `tests/race-lap-validation-frozen.test.ts`,
verde nesta rodada). `src/maneuvers.ts` não muda.

## O que mudou nesta rodada

| Símbolo | Situação | Conteúdo |
|---|---|---|
| `KartConfig.forcingRampMps?` | novo campo opcional (m/s) | rampa da escala de atrito traseiro ao forçar; ausente ou 0 é o degrau as-built |
| `forcingRampFraction` | nova | `clamp((speed − 50 / 3.6) / forcingRampMps, 0, 1)`, 1 sem rampa; chamada uma vez por passo em `step`, sobre o `state.speed` de `isForcing` |
| `integrate` | assinatura interna com `forcingRamp` | escala traseira `1 + (forcingRearFrictionScale − 1) × r` só com `drivingAssists && forcing`; `RENTAL_KART` e `ARCADE_KART` dão escala 1 |
| `testPadLane(laneWidthM)` | nova | reta: `asphalt` se `\|x\| <= laneWidthM / 2`, senão `grass`; `walls: false`; largura não positiva dá tudo `grass` |
| `testPadArc(arcRadiusM, laneWidthM)` | nova | anel: `asphalt` se `\|hypot(x, z) − arcRadiusM\| <= laneWidthM / 2`; `walls: false` |
| `StepClass`, `RECOVERY_MAX_STEPS` (48), `classifyHandlingSteps` | novos | a regra de RULE-0001 sobre a sequência `{input, telemetry}`: `DRIFT` → `FORCING` → `RECOVERY` (passo de soltura com esterço cheio → 0, `forcing` e `oversteer`/`sliding` no passo anterior, até o primeiro `grip` inclusive ou 48 passos) → `NORMAL`; lista vazia dá lista vazia |
| `ARCADE_ASSISTIDO_V5` | valores finais | escolhidos pelos ensaios de DES-0004 nesta rodada (abaixo) |

## Valores de `ARCADE_ASSISTIDO_V5` e o que cada um fechou

| Parâmetro | Valor | Alavanca para |
|---|---|---|
| `enginePower` | 26 500 W | força motriz acima de 50 km/h (`min(driveForce, P × 0,86 / u)`): com acelerador cheio no arco o kart não ganha velocidade a ponto de sair da faixa nem satura a traseira (REQ-FEAT-0002-02, REQ-FEAT-0003-02); na reta, chega a 110 km/h (REQ-FEAT-0004-02) |
| `driveForce` | 2 420 N | 0–60 km/h em 2 383 ms (REQ-FEAT-0004-01); limitado pela tração na largada |
| `governorSpeed` | 31,5 m/s | velocidade estabilizada 30,61 m/s (110,2 km/h) |
| `throttleRate` | 8 /s | acelerador cheio em 125 ms |
| `friction` | 1,57 | tração para 0–60 km/h; 1,09 g do arco a 50 km/h; a manobra de drift ainda desliza (`driftScorePoints` 200, REQ-FEAT-0003-07) |
| `frontStiffness` / `rearStiffness` | 23 / 22 | derivas pequenas em condução normal (`maxSideslipRad` 0,054 na pista de teste, 0,059 na volta) |
| `maxSteer` | 0,36 rad | como no acerto anterior |
| `steerApplyRatePerS` / `steerReturnRatePerS` | 14 / 24 | subida a 90 % em 117 ms e queda a 10 % em 58 ms (REQ-FEAT-0001-01 a -04) |
| `assistLateralG` / `assistSteerAllowanceRad` | 1,48 g / 0,004 rad | esterço no arco de 18 m sem saturar a frente (REQ-FEAT-0002-01); ver `97-changelog.md` para o que o par não alcança |
| `yawTrackingGainPerS` / `yawCorrectGainPerS` | 5,8 / 33 | rapidez da guinada e recuperação em 8 ms (REQ-FEAT-0003-04, -09) |
| `slipDampingGainPerS` / `slipDampingCapG` | 18 / 0,8 g | `sideslipRad` ≤ 0,065 em condução normal e na recuperação (REQ-FEAT-0003-05, -06) |
| `forcingRearFrictionScale` / `forcingRampMps` | 0,67 / 2,4 m/s | traseira solta só ao forçar, acima de 50 km/h, com a margem da rampa (REQ-FEAT-0003-01, -03) |
| `grassSpeedLossPerS` | 0,7 /s | 48 % da velocidade após 1 s na grama à velocidade estabilizada, 55 % a 50 km/h (REQ-FEAT-0004-03, -04, -08) |

## Realização por requisito

| Requisito | Arquivo e símbolo |
|---|---|
| REQ-FEAT-0001-01, -02, -03, -04 | `src/physics.ts` `ARCADE_ASSISTIDO_V5` (`steerApplyRatePerS`, `steerReturnRatePerS`, `yawTrackingGainPerS`), `integrate` (taxa de aproximação do esterço, momento de guinada); medido por `STEER_RESPONSE` em `testPadLane`: 117/58 ms com esterço cheio e 108/50 ms com esterço 0,5 |
| REQ-FEAT-0001-07 | `src/physics.ts` `isForcing` (`clamp` do `Input`), `integrate` (`targetSteer`, `throttle`, `brake` saturados) |
| REQ-FEAT-0001-08, REQ-FEAT-0002-08, REQ-FEAT-0003-11 | `src/physics.ts` `step` (`stepCount` + 1 por chamada; `src/lap.ts` `stepLap` não chama `step` em `PAUSED`) |
| REQ-FEAT-0002-01, -02, -03 | `src/physics.ts` `testPadArc`, `ARCADE_ASSISTIDO_V5` (`assistLateralG`, `friction`, `enginePower`); medido: acelerador cheio `PASS` (0 ms de `understeer`, na faixa); acelerador 0 com 125 ms de `understeer` e saída da faixa pelo lado interno no passo 240 — não alcançado, ver `97-changelog.md` |
| REQ-FEAT-0002-04, -05, -10 | `src/physics.ts` `testPadArc`, `ARCADE_ASSISTIDO_V5`; o ensaio é `scripts/handlingBench.ts` `understeerOnset`; V1 não medida nesta rodada (`MEASUREMENT_MISSING`), ver `97-changelog.md` |
| REQ-FEAT-0003-01, -06 | `src/physics.ts` `integrate` (amortecimento `slipDampingGainPerS`/`slipDampingCapG`, `yawCorrectGainPerS`); medido por `NORMAL_DRIVING`: 0 passos em `oversteer`/`sliding`, `maxSideslipRad` ≤ 0,059 nos dois ambientes |
| REQ-FEAT-0003-02 | `src/physics.ts` `forcingRampFraction`, `integrate` (escala traseira com rampa), `ARCADE_ASSISTIDO_V5` (`enginePower`); medido: 0 passos em `oversteer`/`sliding` com acelerador cheio no arco |
| REQ-FEAT-0003-03 | `src/physics.ts` `isForcing`, `step` (`forcing` na telemetria), `integrate` (escala traseira só com `forcing`), `classifyHandlingSteps` |
| REQ-FEAT-0003-04, -05, -09 | `src/physics.ts` `integrate` (`yawCorrectGainPerS`, amortecimento), `ARCADE_ASSISTIDO_V5`; medido por `REAR_RECOVERY`: `gripReached`, 8 ms, `maxSideslipRad` 0,064 |
| REQ-FEAT-0003-10 | `src/physics.ts` `isForcing`, `handling`, `classifyHandlingSteps` (tudo na simulação) |
| REQ-FEAT-0003-12 | `src/physics.ts` `RECOVERY_MAX_STEPS`, `classifyHandlingSteps` (passos além de 48 sem `grip` são `NORMAL`) |
| REQ-FEAT-0004-01, -02 | `src/physics.ts` `ARCADE_ASSISTIDO_V5` (`driveForce`, `enginePower`, `governorSpeed`, `friction`); medido: 2 383 ms e 110,2 km/h |
| REQ-FEAT-0004-03, -04, -08 | `src/physics.ts` `integrate` (`grassSpeedLossPerS` × fração de rodas na grama), `ARCADE_ASSISTIDO_V5` |
| REQ-FEAT-0004-05 | `src/physics.ts` `integrate` (ramo `environment.walls`: componente normal removida, `wallContact`) |
| REQ-FEAT-0004-10 | `src/lap.ts` inalterado (corte só por distância e duração); `src/physics.ts` não decide validade |
| REQ-FEAT-0005-07 | `src/physics.ts` `STEP`, `SOLVER_SUBSTEPS`, `step` (`Math.ceil(dt / (STEP / SOLVER_SUBSTEPS))`), `Input` |
| REQ-FEAT-0005-09 | `src/physics.ts` `ARCADE_KART` (intacto), `ARCADE_ASSISTIDO_V5` (registro novo), `PUBLISHED_SETUPS` |
| REQ-FEAT-0006-01, -02 | `src/physics.ts` (sem `three`, DOM, `Date`, `performance`, `Math.random`; todas as regras aqui) |
| REQ-FEAT-0006-03 | `src/physics.ts` `STEP`, `SOLVER_SUBSTEPS`, `Input`, assinatura de `step` inalterados |
| REQ-FEAT-0006-04 | `src/physics.ts` `RENTAL_KART` intacto; campos opcionais ausentes valem o literal anterior (`?? 5`, `?? 10`, `?? friction`, `?? 0.045`, `?? 0`, `?? 9`, `?? 4`, `?? 0.45`, `?? 1`, `?? 0`); medido por `REALISTA_UNCHANGED`: 0 medidas diferentes, 0 assistências |

Determinismo: passo fixo, sem relógio nem sorteio; `DETERMINISM` `identical` nos dois ambientes e nos dois modos de `Input`.
