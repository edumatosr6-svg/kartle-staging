---
id: DES-0004
title: Ensaios de dirigibilidade, ambientes, linha de base e saída (API-0003) — implementação
feature: dirigibilidade
stage: code
status: draft
version: 2.0.0
sources: [API-0003, RULE-0001, RULE-0002, FLOW-0002, FEAT-0001, FEAT-0002, FEAT-0003, FEAT-0004, FEAT-0005, FEAT-0006, REQ-FEAT-0001-05, REQ-FEAT-0001-06, REQ-FEAT-0001-09, REQ-FEAT-0002-01, REQ-FEAT-0002-02, REQ-FEAT-0002-03, REQ-FEAT-0002-04, REQ-FEAT-0002-05, REQ-FEAT-0002-06, REQ-FEAT-0002-07, REQ-FEAT-0002-09, REQ-FEAT-0002-10, REQ-FEAT-0003-07, REQ-FEAT-0003-08, REQ-FEAT-0003-12, REQ-FEAT-0004-07, REQ-FEAT-0005-01, REQ-FEAT-0005-02, REQ-FEAT-0005-03, REQ-FEAT-0005-04, REQ-FEAT-0005-07, REQ-FEAT-0005-11, REQ-FEAT-0005-12, REQ-FEAT-0006-02, REQ-FEAT-0006-04, REQ-FEAT-0006-05, REQ-FEAT-0006-06, REQ-FEAT-0006-07, REQ-FEAT-0006-08, REQ-FEAT-0006-09, NFR-0001, NFR-0002, NFR-0003, NFR-0004, NFR-0007, NFR-0008]
---

# DES-0004 — Ensaios de dirigibilidade, ambientes, linha de base e saída (API-0003) — implementação

Biblioteca `scripts/handlingBench.ts` (camada simulação no papel de árvore `scripts/`; escrita pelas rodadas 1 e 2 contra a versão
4.0.0 do item e **alterada nesta rodada (3, Mode C) contra a 5.0.0** em `referenceCornerBench`, `understeerOnset`,
`understeerBaselineRecord`, `judge`, a linha `#` de `UNDERSTEER_ONSET` e o pedido da volta de `testPilotLap`), programa
`scripts/keyboard-lap.ts` (`bench:handling`; camada aplicação, único módulo com `node:perf_hooks`, `node:os` e `new Date()`;
alterado nesta rodada só no pedido da volta de `measureStepCost`, `:25-26`), programa `scripts/physics-bench.ts` (`bench:physics`,
inalterado nesta rodada). A biblioteca não importa `node:os`, `node:perf_hooks`, `Date` nem `performance`; `node:fs` só para
`docs/physics.md` e o texto de `src/physics.ts`. Nenhum arquivo de `tests/` foi escrito (estágio de testes). Nenhum parâmetro de
`BENCH_PARAMETERS` nem limiar de `THRESHOLDS` mudou.

## Realização por requisito

| Requisito | Arquivo e símbolo |
|---|---|
| REQ-FEAT-0001-05 | `scripts/handlingBench.ts` `judge` (`STEER_RESPONSE`: só `speedMinMps`/`speedMaxMps`, `riseToNinetyPctMs`, `fallToTenPctMs`; `observed` ignorado; `understeerStepCount` informativo) |
| REQ-FEAT-0001-06 | `scripts/handlingBench.ts` `steerResponse` (registro com `benchEnvironment` `TEST_PAD`, `riseToNinetyPctMs`, `fallToTenPctMs`, `steadyYawRateRadPerS`, `speedMinMps`, `speedMaxMps`, `settleWindowMs`, `speedHoldMode`, `targetSpeedMps`, `speedHoldBandMps`); `scripts/keyboard-lap.ts` (imprime por `serialize`) |
| REQ-FEAT-0001-09 | `scripts/handlingBench.ts` `judge` (`SPEED_NOT_HELD` antes dos tempos quando `speedMinMps`/`speedMaxMps` saem de `targetSpeedMps` ± `speedHoldBandMps`) |
| REQ-FEAT-0002-01, REQ-FEAT-0002-02, REQ-FEAT-0002-03 | `scripts/handlingBench.ts` `referenceCornerBench` (`:268-291`: com `THROTTLE_FULL` para no primeiro passo com `surface` `GRASS`; com `THROTTLE_ZERO` percorre os 300 passos da janela esteja o kart onde estiver e mede `maxUndersteerMs` em todos eles, dentro e fora da faixa; `offAsphaltStepCount` conta os passos fora da faixa), `judge` (`:693-697`: `OFF_ASPHALT` só com `THROTTLE_FULL`; com `THROTTLE_ZERO` o único critério é `maxUndersteerMs <= 200`; com `THROTTLE_FULL` também `oversteer`/`sliding` por `observed`) |
| REQ-FEAT-0002-04 | `scripts/handlingBench.ts` `understeerOnset` (`:337-399`: `v1Mps` = menor alvo de patamar completo com `understeer` > 200 ms ou, no fim natural sem nenhum, o alvo do patamar interrompido pela saída, `:376-377`), `v1FromCompletePlateau` (`:316-321`), `understeerBaselineRecord` (`:325-330`: `v0Mps` só de um registro cujo `v1Mps` é velocidade de patamar completo com subesterço), `judge` (`v1Mps >= 1.15 × v0Mps`, `:705-707`) |
| REQ-FEAT-0002-05 | `scripts/handlingBench.ts` `understeerOnset` (`maxUndersteerMsBySpeed`: pares `[plateauSpeedMps, maxUndersteerMs]` dos patamares completos acima de 50 km/h, maior sequência consecutiva na fase mantida de cada patamar; o interrompido nunca entra), `judge` (não decrescente patamar a patamar) |
| REQ-FEAT-0002-06 | `scripts/handlingBench.ts` `referenceCornerBench`, `understeerOnset` (campos `benchEnvironment`, `arcRadiusM`, `laneWidthM`, `maxUndersteerMs`, `v0Mps`, `v1Mps`); `serialize`, `presentation` (km/h na linha `#`) |
| REQ-FEAT-0002-07 | `scripts/handlingBench.ts` `sameSetting`, `baselineRecord`, `understeerBaselineRecord`, `v1FromCompletePlateau`, `readBaseline`, `judge` (`BASELINE_MISSING`) |
| REQ-FEAT-0002-09 | `scripts/handlingBench.ts` `referenceCornerBench` (`offAsphaltStepCount`: 0 ou 1 com `THROTTLE_FULL`, 0 a 300 com `THROTTLE_ZERO`; `offAsphaltFirstStep`, `offAsphaltFirstXM`, `offAsphaltFirstZM` da primeira saída), `judge` (`OFF_ASPHALT` só com `THROTTLE_FULL`, `:695`) |
| REQ-FEAT-0002-10 | `scripts/handlingBench.ts` `understeerOnset` (fim no primeiro passo fora da faixa; `observed` `OFF_ASPHALT` abaixo de 50 km/h; `naturalEnd` = saída acima de 50 km/h com 2 pares ou mais, `:376`; lança nos dois casos sem decisão), `judge` (`:698-707`: `OFF_ASPHALT` → menos de 2 pares `MEASUREMENT_MISSING` → fim natural sem `v1Mps` lança → `BASELINE_MISSING` → limiares; o fim natural nunca produz `MEASUREMENT_MISSING`) |
| REQ-FEAT-0003-07 | `scripts/handlingBench.ts` `driftManeuver` (`driftScorePoints`), `judge` |
| REQ-FEAT-0003-08 | `scripts/handlingBench.ts` `rearRecovery` (`benchEnvironment` `TEST_PAD`, `arcRadiusM`, `laneWidthM`, `gripReached`, `recoveryMs` condicional, `maxSideslipRad`, campos de saída da faixa), `normalDriving` (`normalDrivingStepCount`, `excludedRecoveryStepCount`, `oversteerOrSlidingStepCount`, `maxSideslipRad`, um registro por ambiente; só passos no asfalto — os passos fora da faixa da execução com acelerador 0 não entram) |
| REQ-FEAT-0003-12 | `scripts/handlingBench.ts` `rearRecovery` (`gripReached` falso sem `grip`), `judge` (`THRESHOLD_EXCEEDED`), `normalDriving` (os passos além de `RECOVERY_MAX_STEPS` sem `grip` são `NORMAL` por `classifyHandlingSteps` e entram no agregado) |
| REQ-FEAT-0004-07 | `scripts/handlingBench.ts` `straightLine` (`ACCELERATION`, `TOP_SPEED` em `testPadLane`), `grassLoss`, `wallContact` (`SYNTHETIC_TRACK`), `serialize` (km/h e s); `scripts/physics-bench.ts` (imprime os quatro registros) |
| REQ-FEAT-0005-01, REQ-FEAT-0005-02, REQ-FEAT-0005-12 | `scripts/handlingBench.ts` `determinism` (um registro por ambiente; `runCount` 2; `deepEqual` dos estados por passo e do `LapResult`; compara o traço inteiro, inclusive os passos fora da faixa com acelerador 0), `judge` (`NON_DETERMINISTIC`) |
| REQ-FEAT-0005-03, REQ-FEAT-0005-04, REQ-FEAT-0005-11 | `scripts/handlingBench.ts` `testPilotLap` (`SYNTHETIC_TRACK`; o pedido de `startLap` leva `setupId` e `setupVersion` do acerto e da versão ensaiados por `setupRef(o)`, `:499`; `lapTimeMs`, `sectorMs` sempre com 4 inteiros, `offAsphaltStepCount` e primeira saída; volta sem tempo reporta `toMs(MAX_LAP_STEPS)`), `judge` (`OFF_ASPHALT`, depois `lapTimeMs <= 25000`); `scripts/keyboard-lap.ts` |
| REQ-FEAT-0005-07 | `scripts/handlingBench.ts` `stepContract` (`1 / STEP === 120`, `120 × SOLVER_SUBSTEPS === 480` e a linha de `step`, a linha literal de `Input`) |
| REQ-FEAT-0006-02 | `scripts/handlingBench.ts` (sem DOM, `three`, `Date`, `performance`, `node:os`, `node:perf_hooks`; `measuredAtUtc` e `stepCost` em `BenchOptions`) |
| REQ-FEAT-0006-04 | `scripts/handlingBench.ts` `realistaUnchanged` (um registro por ambiente; `countDifferingMeasures` contra `options.realistaBaseline`; `arcadeAssistActiveCount` pelos traços) |
| REQ-FEAT-0006-05 | `scripts/handlingBench.ts` `makeInput` (`BINARY`/`PROPORTIONAL`), `runSuite`, `steerSides` (variante parcial 0,5 só em `PROPORTIONAL`); `scripts/keyboard-lap.ts` (roda os dois modos) |
| REQ-FEAT-0006-06, REQ-FEAT-0006-09 | `scripts/handlingBench.ts` `stepCost` (linha de base só com `runtimeId` igual; `BASELINE_MISSING` senão), `judge` (`≤ 1,10 ×`); `scripts/keyboard-lap.ts` `measureStepCost` (`:21-39`; o pedido de `startLap`, `:25-26`, leva `setupId` e a `setupVersion` da versão ensaiada), `runtimeId` |
| REQ-FEAT-0006-07 | `src/track.ts`, `src/trackData.ts`, `src/lapTiming.ts` inalterados; `src/lap.ts` só com os campos opcionais copiados (DES-0003), ausentes nas voltas iniciadas sem eles; `ARCADE_KART` e `RENTAL_KART` intactos (portão desta rodada em `01-implementation.md`) |
| REQ-FEAT-0006-08 | `scripts/handlingBench.ts` `baselineEntry`, `serialize` (linha `#` com `BENCH_PARAMETERS` e `runtimeId`); `docs/physics.md` (bloco e prosa, DM-0001) |

## Interface

Exportada (inalterada nesta rodada): `BENCH_PARAMETERS` (os parâmetros de ADR-0004, congelados), `THRESHOLDS`, `MAX_LAP_STEPS`,
`PILOT_DECISION_STEPS`, os tipos de registro (`BenchRecord` por `benchId`, `BenchCommon` com `benchEnvironment`, `FailReason` com
`SPEED_NOT_HELD` e `MEASUREMENT_MISSING`), `BenchOptions`, `SIMULATION_BENCHES`, `ALL_BENCHES`, `laneEnvironment`, `arcEnvironment`,
`makeInput`, `straight`, `arcEntry`, `grassEntry`, `wallApproach`, `testPilot`, `sameSetting`, `baselineRecord`, `builtInOldRecords`,
`countDifferingMeasures`, `judge(record, observed?)`, `runBench`, `handlingBenchReport`, `testPilotLapWith`, `syntheticReading`,
`readBaseline`, `loadBaselineText`, `baselineEntry`, `serialize`, `diagnosticsOf`. Mudam de comportamento sob API-0003 3.3.0, com o
mesmo nome e a mesma assinatura: `judge` em `REFERENCE_CORNER` e `UNDERSTEER_ONSET`, `runBench`/`handlingBenchReport` nesses dois
ensaios (campos `offAsphaltStepCount` de `THROTTLE_ZERO` e `v1Mps`), e `serialize` na linha `#` de `UNDERSTEER_ONSET`.

Decisões de implementação, onde o projeto deixava detalhe em aberto (nenhuma muda contrato ou requisito):

- `REFERENCE_CORNER` com acelerador cheio: a contagem de passos em `oversteer`/`sliding` não é campo do contrato; chega ao
  veredito pelo segundo argumento `observed` (`THRESHOLD_EXCEEDED`) e sai na linha `#`, como as demais observações sem campo.
- A maior sequência de `understeer` do patamar interrompido de `UNDERSTEER_ONSET` (subida e fase mantida, até o passo anterior à
  saída; `plateauMaxRun`, `:343`) decide só o texto da linha `#` — "V1 de patamar completo com subesterço", "V1 do patamar
  interrompido pela saída (subesterço iniciado nele)" ou "sem início de subesterço até a saída da faixa" (`:379-382`) — e é
  impressa como `interruptedPlateauMaxUndersteerMs`; nunca entra em `v1Mps` nem no veredito. Quando `v1Mps` está ausente (saída que
  reprova por si sem patamar completo com subesterço) a linha `#` diz "ausente (…)".
- Os diagnósticos da linha `#` ficam ao lado do registro (`diagnosticsOf`), nunca dentro dele.
- A condição de V0 (`v1FromCompletePlateau`) é uma função interna, não exportada: a biblioteca só a usa para aceitar ou recusar
  o registro da linha de base; o teste a exercita por `runBench`/`handlingBenchReport` com `baselineMarkdown()`.
- `STEP_COST` sai uma vez por `inputMode` em `bench:handling`, porque o programa roda os dois modos com as mesmas opções.
- O programa `bench:handling` termina com código 0 e deixa o veredito nos registros; o gate de limiares é `npm test`.
