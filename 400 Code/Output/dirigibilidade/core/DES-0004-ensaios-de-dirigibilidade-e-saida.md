---
id: DES-0004
title: Ensaios de dirigibilidade, ambientes, linha de base e saída (API-0003) — implementação
feature: dirigibilidade
stage: code
status: draft
version: 1.0.0
sources: [API-0003, RULE-0001, RULE-0002, FLOW-0002, FEAT-0001, FEAT-0002, FEAT-0003, FEAT-0004, FEAT-0005, FEAT-0006, REQ-FEAT-0001-05, REQ-FEAT-0001-06, REQ-FEAT-0001-09, REQ-FEAT-0002-04, REQ-FEAT-0002-05, REQ-FEAT-0002-06, REQ-FEAT-0002-07, REQ-FEAT-0002-09, REQ-FEAT-0002-10, REQ-FEAT-0003-07, REQ-FEAT-0003-08, REQ-FEAT-0003-12, REQ-FEAT-0004-07, REQ-FEAT-0005-01, REQ-FEAT-0005-02, REQ-FEAT-0005-03, REQ-FEAT-0005-04, REQ-FEAT-0005-07, REQ-FEAT-0005-11, REQ-FEAT-0005-12, REQ-FEAT-0006-02, REQ-FEAT-0006-04, REQ-FEAT-0006-05, REQ-FEAT-0006-06, REQ-FEAT-0006-07, REQ-FEAT-0006-08, REQ-FEAT-0006-09, NFR-0001, NFR-0002, NFR-0003, NFR-0004, NFR-0007, NFR-0008]
---

# DES-0004 — Ensaios de dirigibilidade, ambientes, linha de base e saída (API-0003) — implementação

Biblioteca `scripts/handlingBench.ts` (camada simulação no papel de árvore `scripts/`; reescrita nesta rodada contra a versão 4.0.0
do item), programa `scripts/keyboard-lap.ts` (`bench:handling`, reescrito; camada aplicação, único módulo com `node:perf_hooks`,
`node:os` e `new Date()`), programa `scripts/physics-bench.ts` (`bench:physics`, alterado: mantém as linhas que imprimia e acrescenta
os quatro registros). A biblioteca não importa `node:os`, `node:perf_hooks`, `Date` nem `performance`; `node:fs` só para
`docs/physics.md` e o texto de `src/physics.ts`. Nenhum arquivo de `tests/` foi escrito (estágio de testes).

## Realização por requisito

| Requisito | Arquivo e símbolo |
|---|---|
| REQ-FEAT-0001-05 | `scripts/handlingBench.ts` `judge` (`STEER_RESPONSE`: só `speedMinMps`/`speedMaxMps`, `riseToNinetyPctMs`, `fallToTenPctMs`; `observed` ignorado; `understeerStepCount` informativo) |
| REQ-FEAT-0001-06 | `scripts/handlingBench.ts` `steerResponse` (registro com `benchEnvironment` `TEST_PAD`, `riseToNinetyPctMs`, `fallToTenPctMs`, `steadyYawRateRadPerS`, `speedMinMps`, `speedMaxMps`, `settleWindowMs`, `speedHoldMode`, `targetSpeedMps`, `speedHoldBandMps`); `scripts/keyboard-lap.ts` (imprime por `serialize`) |
| REQ-FEAT-0001-09 | `scripts/handlingBench.ts` `judge` (`SPEED_NOT_HELD` antes dos tempos quando `speedMinMps`/`speedMaxMps` saem de `targetSpeedMps` ± `speedHoldBandMps`) |
| REQ-FEAT-0002-04 | `scripts/handlingBench.ts` `understeerOnset` (`v1Mps` = menor patamar completo com `understeer` > 200 ms), `understeerBaselineRecord` (`v0Mps` da linha de base do mesmo arco), `judge` (`v1Mps >= 1.15 × v0Mps`) |
| REQ-FEAT-0002-05 | `scripts/handlingBench.ts` `understeerOnset` (`maxUndersteerMsBySpeed`: pares `[plateauSpeedMps, maxUndersteerMs]` dos patamares completos acima de 50 km/h, maior sequência consecutiva dentro de cada patamar), `judge` (não decrescente patamar a patamar) |
| REQ-FEAT-0002-06 | `scripts/handlingBench.ts` `referenceCornerBench`, `understeerOnset` (campos `benchEnvironment`, `arcRadiusM`, `laneWidthM`, `maxUndersteerMs`, `v0Mps`, `v1Mps`); `serialize` (km/h na linha `#`) |
| REQ-FEAT-0002-07 | `scripts/handlingBench.ts` `sameSetting`, `baselineRecord`, `understeerBaselineRecord`, `readBaseline`, `judge` (`BASELINE_MISSING`) |
| REQ-FEAT-0002-09 | `scripts/handlingBench.ts` `referenceCornerBench` (para no primeiro passo com `surface` `GRASS`; `offAsphaltStepCount`, `offAsphaltFirstStep`, `offAsphaltFirstXM`, `offAsphaltFirstZM`), `judge` (`OFF_ASPHALT` primeiro) |
| REQ-FEAT-0002-10 | `scripts/handlingBench.ts` `understeerOnset` (fim no primeiro passo fora da faixa; `observed` `OFF_ASPHALT` abaixo de 50 km/h; lança nos dois casos sem decisão), `judge` (`OFF_ASPHALT` → menos de 2 pares `MEASUREMENT_MISSING` → `BASELINE_MISSING` → sem `v1Mps` `MEASUREMENT_MISSING` → limiares) |
| REQ-FEAT-0003-07 | `scripts/handlingBench.ts` `driftManeuver` (`driftScorePoints`), `judge` |
| REQ-FEAT-0003-08 | `scripts/handlingBench.ts` `rearRecovery` (`benchEnvironment` `TEST_PAD`, `arcRadiusM`, `laneWidthM`, `gripReached`, `recoveryMs` condicional, `maxSideslipRad`, campos de saída da faixa), `normalDriving` (`normalDrivingStepCount`, `excludedRecoveryStepCount`, `oversteerOrSlidingStepCount`, `maxSideslipRad`, um registro por ambiente) |
| REQ-FEAT-0003-12 | `scripts/handlingBench.ts` `rearRecovery` (`gripReached` falso sem `grip`), `judge` (`THRESHOLD_EXCEEDED`), `normalDriving` (os passos além de `RECOVERY_MAX_STEPS` sem `grip` são `NORMAL` por `classifyHandlingSteps` e entram no agregado) |
| REQ-FEAT-0004-07 | `scripts/handlingBench.ts` `straightLine` (`ACCELERATION`, `TOP_SPEED` em `testPadLane`), `grassLoss`, `wallContact` (`SYNTHETIC_TRACK`), `serialize` (km/h e s); `scripts/physics-bench.ts` (imprime os quatro registros) |
| REQ-FEAT-0005-01, REQ-FEAT-0005-02, REQ-FEAT-0005-12 | `scripts/handlingBench.ts` `determinism` (um registro por ambiente; `runCount` 2; `deepEqual` dos estados por passo e do `LapResult`), `judge` (`NON_DETERMINISTIC`) |
| REQ-FEAT-0005-03, REQ-FEAT-0005-04, REQ-FEAT-0005-11 | `scripts/handlingBench.ts` `testPilotLap` (`SYNTHETIC_TRACK`; `lapTimeMs`, `sectorMs` sempre com 4 inteiros, `offAsphaltStepCount` e primeira saída; volta sem tempo reporta `toMs(MAX_LAP_STEPS)`), `judge` (`OFF_ASPHALT`, depois `lapTimeMs <= 25000`); `scripts/keyboard-lap.ts` |
| REQ-FEAT-0005-07 | `scripts/handlingBench.ts` `stepContract` (`1 / STEP === 120`, `120 × SOLVER_SUBSTEPS === 480` e a linha de `step`, a linha literal de `Input`) |
| REQ-FEAT-0006-02 | `scripts/handlingBench.ts` (sem DOM, `three`, `Date`, `performance`, `node:os`, `node:perf_hooks`; `measuredAtUtc` e `stepCost` em `BenchOptions`) |
| REQ-FEAT-0006-04 | `scripts/handlingBench.ts` `realistaUnchanged` (um registro por ambiente; `countDifferingMeasures` contra `options.realistaBaseline`; `arcadeAssistActiveCount` pelos traços) |
| REQ-FEAT-0006-05 | `scripts/handlingBench.ts` `makeInput` (`BINARY`/`PROPORTIONAL`), `runSuite`, `steerSides` (variante parcial 0,5 só em `PROPORTIONAL`); `scripts/keyboard-lap.ts` (roda os dois modos) |
| REQ-FEAT-0006-06, REQ-FEAT-0006-09 | `scripts/handlingBench.ts` `stepCost` (linha de base só com `runtimeId` igual; `BASELINE_MISSING` senão), `judge` (`≤ 1,10 ×`); `scripts/keyboard-lap.ts` `measureStepCost`, `runtimeId` |
| REQ-FEAT-0006-07 | `src/lap.ts`, `src/track.ts`, `src/trackData.ts`, `src/lapTiming.ts` inalterados; `ARCADE_KART` e `RENTAL_KART` intactos (portão desta rodada em `01-implementation.md`) |
| REQ-FEAT-0006-08 | `scripts/handlingBench.ts` `baselineEntry`, `serialize` (linha `#` com `BENCH_PARAMETERS` e `runtimeId`); `docs/physics.md` (bloco e prosa, DM-0001) |

## Interface

Exportada: `BENCH_PARAMETERS` (os parâmetros de ADR-0004, congelados), `THRESHOLDS`, `MAX_LAP_STEPS`, `PILOT_DECISION_STEPS`, os
tipos de registro (`BenchRecord` por `benchId`, `BenchCommon` com `benchEnvironment`, `FailReason` com `SPEED_NOT_HELD` e
`MEASUREMENT_MISSING`), `BenchOptions`, `SIMULATION_BENCHES`, `ALL_BENCHES`, `laneEnvironment`, `arcEnvironment`, `makeInput`,
`straight`, `arcEntry`, `grassEntry`, `wallApproach`, `testPilot`, `sameSetting`, `baselineRecord`, `builtInOldRecords`,
`countDifferingMeasures`, `judge(record, observed?)`, `runBench`, `handlingBenchReport`, `testPilotLapWith`, `syntheticReading`,
`readBaseline`, `loadBaselineText`, `baselineEntry`, `serialize`, `diagnosticsOf`.

Decisões de implementação, onde o projeto deixava detalhe em aberto (nenhuma muda contrato ou requisito):

- `REFERENCE_CORNER` com acelerador cheio: a contagem de passos em `oversteer`/`sliding` não é campo do contrato; chega ao
  veredito pelo segundo argumento `observed` (`THRESHOLD_EXCEEDED`) e sai na linha `#`, como as demais observações sem campo.
- Os diagnósticos da linha `#` (contagem de `oversteer`, velocidade da saída, patamar interrompido, patamares completos, V1
  medida, motivo de `observed`) ficam ao lado do registro (`diagnosticsOf`), nunca dentro dele.
- `STEP_COST` sai uma vez por `inputMode` em `bench:handling`, porque o programa roda os dois modos com as mesmas opções.
- O programa `bench:handling` termina com código 0 e deixa o veredito nos registros; o gate de limiares é `npm test`.
