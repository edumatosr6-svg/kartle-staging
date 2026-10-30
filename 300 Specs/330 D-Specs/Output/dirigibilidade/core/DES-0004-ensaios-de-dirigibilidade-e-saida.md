---
id: DES-0004
title: Ensaios de dirigibilidade, pista de teste aberta, linha de base e saída (API-0003)
feature: dirigibilidade
stage: dspec
status: validated
version: 6.0.1
sources: [API-0003, RULE-0001, RULE-0002, FLOW-0002, FEAT-0001, FEAT-0002, FEAT-0003, FEAT-0004, FEAT-0005, FEAT-0006, REQ-FEAT-0001-05, REQ-FEAT-0001-06, REQ-FEAT-0001-09, REQ-FEAT-0002-06, REQ-FEAT-0002-08, REQ-FEAT-0002-14, REQ-FEAT-0002-15, REQ-FEAT-0002-16, REQ-FEAT-0002-17, REQ-FEAT-0003-08, REQ-FEAT-0003-12, REQ-FEAT-0003-13, REQ-FEAT-0003-16, REQ-FEAT-0003-17, REQ-FEAT-0004-07, REQ-FEAT-0005-01, REQ-FEAT-0005-02, REQ-FEAT-0005-03, REQ-FEAT-0005-04, REQ-FEAT-0005-07, REQ-FEAT-0005-11, REQ-FEAT-0005-12, REQ-FEAT-0006-02, REQ-FEAT-0006-04, REQ-FEAT-0006-05, REQ-FEAT-0006-06, REQ-FEAT-0006-07, REQ-FEAT-0006-08, REQ-FEAT-0006-09, NFR-0001, NFR-0002, NFR-0003, NFR-0004, NFR-0007, NFR-0008]
---

# DES-0004 — Ensaios de dirigibilidade, pista de teste aberta, linha de base e saída (API-0003)

## Realiza

O contrato API-0003 4.0.1 campo a campo e a tabela de ensaios e ambientes de RULE-0002 4.0.1: um registro
por `benchId` e variante, com `benchEnvironment`, na saída de `npm test`, `npm run bench:handling` e do bench
de física (AC-US-0001-06, AC-US-0002-05, AC-US-0003-07, AC-US-0004-07, AC-US-0005-01 a -04, -06); veredito
do `STEER_RESPONSE` só pelos tempos, com a velocidade mantida (AC-US-0001-05; REQ-FEAT-0001-09:
`SPEED_NOT_HELD`); curva julgada só pelo raio da trajetória aos 3 s (`CORNER_RADIUS`) e pelo giro em até 2 s
(`CORNER_TURN`), em qualquer estado de aderência (REQ-FEAT-0002-14), com `MEASUREMENT_MISSING` pela parada
antes de 3 s (REQ-FEAT-0002-16) e `THRESHOLD_EXCEEDED` pelo giro insuficiente até a parada (REQ-FEAT-0002-15);
`TEST_AREA_EXCEEDED` em todo ensaio na pista de teste aberta quando o kart sai da área declarada
(REQ-FEAT-0002-17); condução normal sobre todos os passos da volta do piloto de teste; recuperação na pista
de teste aberta, cada lado, com a traseira que não solta reportada sem reprovar (REQ-FEAT-0003-12, -17);
comando de drift sem efeito (`DRIFT_INERT`, REQ-FEAT-0003-13) e velocidade máxima única (`SPEED_CAP`,
REQ-FEAT-0003-16); velocidade estabilizada entre 65 km/h e 72 km/h; `NON_DETERMINISTIC` como defeito
(REQ-FEAT-0005-12; NFR-0001); paridade `BINARY`/`PROPORTIONAL` (NFR-0003); custo por passo e `BASELINE_MISSING`
(NFR-0002; REQ-FEAT-0006-06, -09); Realista idêntico (NFR-0007); contrato de passo (REQ-FEAT-0005-07);
`race-lap-validation` aprovado na mesma execução (NFR-0008); registro em `docs/physics.md` com ambiente e
parâmetros (NFR-0004). Decisões:
[ADR-0003](../adr/ADR-0003-linha-de-base-legivel-por-maquina-em-docs-physics.md),
[ADR-0004](../adr/ADR-0004-ensaios-como-biblioteca-e-parametros-de-ensaio.md),
[ADR-0005](../adr/ADR-0005-pista-de-teste-como-ambiente-da-simulacao-e-velocidade-mantida.md).

## Posicionamento

Lugar na árvore: `scripts/`, onde as diretrizes põem os benches, e `tests/` para as verificações.

- `scripts/handlingBench.ts`, **existente** (853 linhas; realiza a versão 5.1.0 deste item) e **alterado**
  nesta rodada, camada **Simulação** (os ensaios só avançam a simulação com `STEP`): biblioteca pura dos
  ensaios — sem DOM, `three`, `node:perf_hooks`, `node:os`, `Date` nem `performance` —, importada por
  `npm test` e pelos dois benches. `node:fs` só lê `docs/physics.md` (`loadBaselineText`) e o texto de
  `src/physics.ts` (`STEP_CONTRACT`). Todo valor de parede (`measuredAtUtc`, `meanStepCostUs`, `runtimeId`)
  entra por argumento.
- `scripts/keyboard-lap.ts` (`bench:handling`) e `scripts/physics-bench.ts` (`bench:physics`), **existentes**,
  camada **Aplicação** (programas de bench): chamam a biblioteca e imprimem os registros; o único ponto que
  muda é o fim da volta cronometrada de `measureStepCost` **(muda)**, que passa a ser o primeiro resultado da
  volta, como em `TEST_PILOT_LAP` (abaixo);
  `scripts/keyboard-lap.ts` é o único que importa `node:perf_hooks` (`measureStepCost`, `:21-40`) e `node:os`
  (`runtimeId()`, `:16-18`) e, com `scripts/physics-bench.ts:41`, os únicos que leem `new Date()`
  (`measuredAtUtc`). `bench:physics` continua imprimindo `ACCELERATION`, `TOP_SPEED`, `GRASS_LOSS` e
  `WALL_CONTACT` (`:40-47`).
- `tests/dirigibilidade-*.test.ts` e `tests/fixtures/records.ts`, **existentes** (escritos para a versão 5.1.0)
  e reescritos pela etapa de testes segundo [test-strategy](../test-strategy.md).
- `docs/physics.md`, **existente**: nova entrada datada do acerto `arcade-assistido-v6` e o bloco
  `handling-baseline` com uma entrada por (`setupId`, `setupVersion`, `runtimeId`)
  ([DM-0001](../data/DM-0001-dado-publicado-registros-e-linha-de-base.md), seção 5).

## Interface

### Biblioteca `scripts/handlingBench.ts`

| Símbolo | Assinatura | Descrição |
|---|---|---|
| `BenchId` | `'STEER_RESPONSE' \| 'CORNER_RADIUS' \| 'CORNER_TURN' \| 'NORMAL_DRIVING' \| 'REAR_RECOVERY' \| 'DRIFT_INERT' \| 'SPEED_CAP' \| 'ACCELERATION' \| 'TOP_SPEED' \| 'GRASS_LOSS' \| 'WALL_CONTACT' \| 'DETERMINISM' \| 'TEST_PILOT_LAP' \| 'STEP_COST' \| 'SETUP_VERSION' \| 'STEP_CONTRACT' \| 'REALISTA_UNCHANGED'` **(muda)** | saem `REFERENCE_CORNER`, `UNDERSTEER_ONSET`, `DRIFT_MANEUVER` (nunca emitidos, API-0003 4.0.0); entram `CORNER_RADIUS`, `CORNER_TURN`, `DRIFT_INERT`, `SPEED_CAP` |
| `FailReason` | os oito valores de API-0003 **(muda)** | acrescenta `TEST_AREA_EXCEEDED` |
| `Observed` | `'THRESHOLD_EXCEEDED'` **(muda)** | o que um ensaio vê no seu traço e nenhum campo carrega: só a precondição de `GRASS_LOSS` (sai `OFF_ASPHALT`, que servia a `UNDERSTEER_ONSET`) |
| `BenchRecord` | união discriminada por `benchId` **(muda)** | exatamente os campos de API-0003 4.0.1 por `benchId`, com os tipos e unidades de lá, e nenhum outro (tabela de ensaios abaixo); `BenchCommon` (`benchEnvironment`, `setupId`, `setupVersion`, `inputMode`, `verdict`, `failReason?`, `measuredAtUtc`, `baselineAvailable`); `TestPadFields` (`testAreaRadiusM`, `offAsphaltStepCount`, `offAsphaltFirstStep?`, `offAsphaltFirstXM?`, `offAsphaltFirstZM?`) em **todo** registro com `benchEnvironment` `TEST_PAD`. Saem `throttleCondition`, `arcRadiusM`, `laneWidthM`, `maxUndersteerMs`, `v0Mps`, `v1Mps`, `maxUndersteerMsBySpeed`, `driftScorePoints`, `excludedRecoveryStepCount` |
| `BenchOptions` | `{setup, version, inputMode, baseline?, realistaBaseline?, oldRecords?, measuredAtUtc, stepCost?}` (`:94-98`, mantido) | `version: 'previous'` usa `previousConfig` e `previousSetupVersion` (só para produzir a linha de base); `baseline` é a entrada da versão anterior do acerto ensaiado; `realistaBaseline`, a do Realista; `oldRecords`, os registros antigos de `SETUP_VERSION` (`builtInOldRecords()` quando ausente); `measuredAtUtc` e `stepCost` vêm do chamador |
| `BENCH_PARAMETERS` | objeto congelado **(muda)** | os parâmetros de ensaio de [ADR-0004](../adr/ADR-0004-ensaios-como-biblioteca-e-parametros-de-ensaio.md), decisão 2, reportados na linha `#` e em `parameters` da entrada de `docs/physics.md`: `targetSpeedMps` `50 / 3.6`, `speedHoldMode` `THROTTLE_REGULATED`, `speedHoldBandMps` 0,5, `holdMs` 600, `settleWindowMs` 200, `steerInputNormPartial` 0,5, **`testAreaRadiusM` 100** (raio da área declarada de `STEER_RESPONSE`, `CORNER_RADIUS`, `CORNER_TURN`, `REAR_RECOVERY` e da sequência de `DRIFT_INERT` na pista de teste), **`straightTestAreaRadiusM` 1 500** (raio da área declarada da reta de `ACCELERATION` e `TOP_SPEED`, reportado no campo `testAreaRadiusM` desses registros), **`radiusWindowMs` 200**, `forcingSpeedMps` 16,7 (velocidade de partida de `REAR_RECOVERY`, 60,1 km/h, reportada em `entrySpeedMps`), `forcingWindowMs` 3 000 (duração máxima do forçar e da recuperação), `grassEntryIndex` 83, `grassEntryOffsetM` 0,2, `grassEntryAngleRad` 0,15, `grassWindowMs` 1 000, `wallApproachRad` 0,6, `wallWindowMs` 10 000, `topSpeedWindowMs` 60 000, `maxSpeedMps` 26 e `lateralBudgetMps2` 9,5 (piloto de teste), `driverMassKg` 75, `runCount` 2. Saem `laneWidthM`, `arcRadiusM`, `cornerWindowMs`, `entrySpeedStepMps`, `plateauMs`, `plateauSpeedHoldMode`, `entrySpeedMaxMps` |
| `THRESHOLDS` | objeto congelado **(muda)** | os limiares de RULE-0002 4.0.1 na unidade do campo: `riseToNinetyPctMs` 180, `fallToTenPctMs` 250, `pathRadiusM` 13, `turnRad` π, `turnWithinMs` 2 000, `radiusAtMs` 3 000, `recoveryMs` 400, `maxSideslipRad` 0,65, `zeroToSixtyKmhMs` 2 500, `topSpeedMinMps` `65 / 3.6`, `topSpeedMaxMps` `72 / 3.6`, `grassSpeedRatio` 0,70, `lapTimeMs` 25 000, `stepCostRatio` 1,10. Saem `maxUndersteerMs`, `understeerOnsetRatio` e o piso `105 / 3.6` |
| `CORNER_ENTRY_SPEEDS_MPS` | `[50 / 3.6, 70 / 3.6]` **(novo)** | as velocidades de partida de `CORNER_RADIUS` fixadas pelos critérios (AC-US-0002-07, -08); `CORNER_TURN` parte de `50 / 3.6` (AC-US-0002-09). Valores de critério, não parâmetros de ensaio |
| `padEnvironment`, `straightPadEnvironment` | `Environment` **(novos, no lugar de `laneEnvironment`/`arcEnvironment`, `:109-110`)** | `testPadArea(BENCH_PARAMETERS.testAreaRadiusM)` e `testPadArea(BENCH_PARAMETERS.straightTestAreaRadiusM)` ([DES-0001](DES-0001-acerto-arcade-assistido-v6-e-assistencias.md)) |
| `straight(speedMps)` | `(number /* m/s */) => State` (`:147-149`, mantido) | `{...initialState(), x: 0, z: 0, heading: 0, vx: 0, vz: V, speed: V}`: o ponto de partida, centro da área declarada, em linha reta no sentido +z; estado inicial de todo ensaio na pista de teste aberta |
| `grassEntry(speedMps)`, `wallApproach()` | mantidos (`:156-171`) | entrada na grama da pista sintética e trajetória até a parede |
| `testPilot(config)` | `(KartConfig) => Controller` (`:199-232`, mantido) | o piloto de teste — a régua de regressão, a mesma para a linha de base e para o acerto novo |
| `testPilotLapWith(options, controller)` | mantido | a volta do piloto de teste com outro controlador (testes) |
| `makeInput(mode, throttle, brake, steer, drift?)` | mantido (`:138-145`) | `BINARY` é o teclado; `PROPORTIONAL` é o adaptador de inclinação (número contínuo saturado); `drift` é repassado como veio |
| `runBench(benchId, options)` | `(BenchId, BenchOptions) => BenchRecord[]` **(muda)** | um registro por variante; `SPEED_CAP`, `NORMAL_DRIVING`, `DRIFT_INERT` e `DETERMINISM` executam a suíte inteira; `STEP_COST` exige `options.stepCost`; lança só quando a leitura da pista sintética não é `COMPLETE` (defeito do repositório) |
| `handlingBenchReport(options, benchIds?)` | `(BenchOptions, BenchId[]?) => BenchRecord[]` **(muda)** | todos os ensaios, ou os pedidos; `STEP_COST` só com `options.stepCost`; zero ensaios dá lista vazia, nunca `PASS` implícito; antes de devolver, preenche `baselineAvailable` de cada registro (abaixo) |
| `judge(record, observed?)` | `<T extends BenchRecord>(T, Observed?) => T` **(muda)** | fonte única do veredito: recalcula `verdict` e `failReason` dos campos do registro (e, só em `GRASS_LOSS`, de `observed`), na ordem da tabela de ensaios; um teste julga um registro sintético como o bench. Não lança em caso algum (os dois casos sem decisão de `UNDERSTEER_ONSET` saíram com o ensaio) |
| `readBaseline(markdownText, setupId, setupVersion, runtimeId?)` | mantido (`:808-821`) | localiza o bloco `handling-baseline` e a entrada pedida (única por chave, DM-0001) |
| `baselineRecord(baseline, benchId, match)`, `sameSetting(record)` | **(muda)** | localiza na entrada o registro do mesmo `benchId`, `benchEnvironment`, `inputMode` e variante — `steerInputNorm` e `entrySpeedMps` quando o registro os tem (`\|Δ\| < 1e-9`); saem a comparação de `arcRadiusM`/`laneWidthM` e a resolução de V0 (`understeerBaselineRecord`, `v1FromCompletePlateau`) |
| `loadBaselineText()`, `baselineEntry(...)`, `serialize(records, parameters)`, `builtInOldRecords()`, `countDifferingMeasures(current, baseline)` | mantidos | `countDifferingMeasures` pareia por `benchId`, `benchEnvironment`, `inputMode` e variante (`sameSetting`), excluídos `measuredAtUtc` e `meanStepCostUs`; par ausente conta 1 |

Retirados da biblioteca, com os ensaios e campos que API-0003 4.0.0 retira: `ThrottleCondition`,
`referenceCornerBench`, `understeerOnset`, `driftManeuver`, `arcEntry`, `ArcGeometry`/`arcGeometry`,
`understeerBaselineRecord`, `v1FromCompletePlateau`, `laneEnvironment`, `arcEnvironment` e o uso de
`classifyHandlingSteps` em `normalDriving` (`:554-571`).

`baselineAvailable` (API-0003: verdadeiro quando a linha de base do ensaio está registrada no mesmo ensaio e
no mesmo ambiente): em `STEP_COST`, entrada com o mesmo `runtimeId` e registro `STEP_COST` do mesmo
`inputMode`; em `REALISTA_UNCHANGED`, `realistaBaseline` presente; nos demais, `baselineRecord(options.baseline,
benchId, sameSetting(record)) !== undefined`. Só `STEP_COST` e `REALISTA_UNCHANGED` usam a linha de base no
veredito; `TEST_PILOT_LAP` copia `baselineLapTimeMs`, informativo (RULE-0002, Linha de base).

### Programas de bench (um ponto muda)

| Símbolo | Descrição |
|---|---|
| `runtimeId()` (`scripts/keyboard-lap.ts:16-18`) | `${platform}-${arch}-node${versions.node}-${modelo da CPU}` (ADR-0003); nunca nome de máquina ou de usuário |
| `measureStepCost(setup, version)` (`:21-40`) | volta do piloto de teste na pista sintética com `performance.now()` antes e depois de cada `stepLap`; o pedido de `startLap` leva `setupId` e `setupVersion` ensaiados; **(muda)** o laço termina no primeiro passo em que `getLapResult` devolve um resultado, ou em `MAX_LAP_STEPS` (hoje `:32`, `lap.phase !== 'ENDED'`), de modo que mede os mesmos passos que `TEST_PILOT_LAP`; o tempo medido nunca entra em medida de domínio (I9) |
| `--previous`, `--realista` (`:42-53`) | produzem as linhas de base `arcade-assistido-v4` (`previousConfig`) e `realista-aluguel-4t-v4`, sem `baseline` nem `realistaBaseline`; sem argumento, o Arcade corrente julgado contra a entrada da `previousSetupVersion` e a do Realista |

### Tempo, unidades e limiares

Toda medida vem de `getHandlingTelemetry` ([DES-0002](DES-0002-telemetria-de-dirigibilidade.md)) ou de
`getLapResult`/`getLapState`; todo tempo em ms é `toMs(passos)` de `src/lapTiming.ts`
(`Math.floor((25 × passos + 1) / 3)`, inteiro exato); a comparação com o limiar converte o limiar para a
unidade do campo, sem arredondar o medido (RULE-0002). 180 ms não é múltiplo de um passo: `toMs(21)` = 175 é
`PASS`, `toMs(22)` = 183 é `FAIL`. 250 ms = 30 passos, 400 ms = 48, 2 000 ms = 240, 2 500 ms = 300, 3 000 ms
= 360, 25 000 ms = 3 000. A **partida** de um ensaio de curva é o passo 1, o primeiro em que o esterço cheio é
aplicado; "t depois da partida" é o estado depois do passo `t / STEP` (3 s: passo 360; 2 s: passo 240).
65 km/h = `65 / 3.6` (18,056 m/s) e 72 km/h = `72 / 3.6` (20,000 m/s), inclusive; 180° = π rad.

### Ambientes e `benchEnvironment`

| Ambiente | Construção | `benchEnvironment` | Ensaios |
|---|---|---|---|
| Pista de teste aberta, área de curva | `testPadArea(100)`: disco de asfalto de raio 100 m centrado na partida, sem paredes | `TEST_PAD` | `STEER_RESPONSE`, `CORNER_RADIUS`, `CORNER_TURN`, `REAR_RECOVERY`, sequência de `DRIFT_INERT` |
| Pista de teste aberta, área de reta | `testPadArea(1500)`: o mesmo disco com raio que contém a reta de `topSpeedWindowMs` a qualquer velocidade abaixo de 25 m/s | `TEST_PAD` | `ACCELERATION`, `TOP_SPEED` (ambiente não fixado pelos requisitos; reportado) |
| Pista sintética | `CIRCUIT` com `readTrackData(SYNTHETIC_TRACK_FILE)` para a volta | `SYNTHETIC_TRACK` | `GRASS_LOSS`, `WALL_CONTACT`, `TEST_PILOT_LAP`, `NORMAL_DRIVING`, volta de `DRIFT_INERT`, `STEP_COST` |
| Agregados por ambiente | `DETERMINISM` e `REALISTA_UNCHANGED`: um registro com `TEST_PAD` (sobre os ensaios da pista de teste) e um com `SYNTHETIC_TRACK` (sobre os da pista sintética); os dois precisam de `PASS`. No registro `TEST_PAD`, os campos da área agregam os ensaios cobertos: `testAreaRadiusM` é a maior área declarada entre eles (1 500), `offAsphaltStepCount` a soma dos seus `offAsphaltStepCount`, e os campos da primeira saída são os do primeiro registro, na ordem da suíte, com contagem maior que 0 | ambos | — |
| Sem passo próprio num ambiente | `SPEED_CAP` (cobre os dois ambientes), `SETUP_VERSION` e `STEP_CONTRACT` (não avançam a simulação) reportam `SYNTHETIC_TRACK` por convenção documentada: o campo obrigatório tem valor fixo e o registro não carrega área declarada que não teve | `SYNTHETIC_TRACK` | — |

Os valores de área são parâmetros de ensaio: contêm, com folga, as trajetórias medidas nesta rodada com a
biblioteca as-built sobre o asfalto sem limite (acerto C: até 29 m da partida nas curvas e 25 m na
recuperação; `ARCADE_KART`: até 53 m; `RENTAL_KART`: até 40 m; a reta de `TOP_SPEED`, até 343 m quando a
velocidade deixa de crescer); um kart que se afasta mais que isso no tempo do ensaio não está fazendo o que o
ensaio mede.

### Medidas da curva de referência (RULE-0002)

Com `P_j` a posição (`positionXM`, `positionZM`) depois do passo `j` (`P_0`, a do estado inicial), o
deslocamento `D_j = P_j − P_{j−1}` e a direção do movimento `χ_j = atan2(D_j.x, D_j.z)`:

| Medida | Definição de projeto |
|---|---|
| Raio da trajetória aos 3 s (`pathRadiusAt3sM`) | `h = radiusWindowMs / 2` em passos (12); janela dos passos `360 − h + 1` a `360 + h` (349 a 372). Para cada passo `j` de 350 a 372 em que `D_j` e `D_{j−1}` não são nulos, a variação de direção `wrap(χ_j − χ_{j−1})` (para `(−π, π]`) acontece ao longo do caminho `(\|D_{j−1}\| + \|D_j\|) / 2`; `Θ` é a soma das variações e `L` a soma desses caminhos; `pathRadiusAt3sM = L / \|Θ\|`, em m: a velocidade média dividida pela taxa de variação da direção do movimento. Com `\|Θ\|` = 0 (trajetória reta) o raio não é finito: o campo recebe `Number.MAX_VALUE` (o maior número finito, serializável em JSON) e o limiar reprova |
| Giro (`turnAt2sRad`) | `turn_j = headingRad_j − headingRad_0`; `turnAt2sRad = \|turn_240\|`, ou `\|turn_s\|` do passo `s` da parada |
| Instante do meio giro (`halfTurnReachedMs`) | `toMs(j)` do primeiro `j ≤ 240` com `\|turn_j\| ≥ π`; ausente se nenhum |
| Parada (`stoppedAtStep`) | o primeiro passo com `speedMps === 0` (a restrição de repouso de `src/physics.ts:308` zera a velocidade), contado antes de 3 s em `CORNER_RADIUS` (passo < 360) e antes de 2 s em `CORNER_TURN` (passo < 240); o valor é o `simStepCount` desse passo |

### Definição de cada ensaio (estado inicial, `Input`, medição, veredito)

Acelerador, freio e esterço começam em 0 salvo indicação. `PROPORTIONAL` entrega os mesmos valores de
esterço cheio (1 ou −1) e acelerador que `BINARY`, construídos como o adaptador de inclinação os constrói, e
acrescenta a variante parcial onde a tabela a nomeia. Cada ensaio guarda o seu *traço* (sequência de
`Input`, estados e telemetria), que alimenta `DETERMINISM`, `DRIFT_INERT`, `SPEED_CAP` e
`REALISTA_UNCHANGED`. Em todo ensaio na pista de teste aberta, a execução **para no primeiro passo** com
`surface` `GRASS` (fora da área declarada): `offAsphaltStepCount` 1, `offAsphaltFirstStep` = `simStepCount`
desse passo, `offAsphaltFirstXM`/`offAsphaltFirstZM` = a posição nele; sem saída, `offAsphaltStepCount` 0. A
coluna "`PASS` se" é a ordem em que `judge` decide: o primeiro motivo encontrado é o `failReason`.

**Campos obrigatórios quando a execução para na saída da área antes do instante de medida.** O registro sai
com `TEST_AREA_EXCEEDED`, o primeiro motivo de todo ensaio na pista de teste aberta, e cada campo que API-0003
4.0.1 torna obrigatório nesse caso é **medido até o passo da saída**, como no caso da parada: nenhum campo e
nenhum valor de enum é acrescentado, nenhum campo obrigatório fica ausente, e os valores são informativos — não
decidem o veredito, que a saída já decidiu. Um passo "não alcançado" é o mesmo que no caso sem saída: o valor
de teto da janela que a tabela já define.

| `benchId` | Saída antes de… | Valor de cada campo obrigatório |
|---|---|---|
| `STEER_RESPONSE` | fim da fase A (passo 72) ou da fase B | `steadyYawRateRadPerS` = média de `\|yawRateRadPerS\|` nos últimos 24 passos executados da fase A (todos, se forem menos); `riseToNinetyPctMs` = `toMs` do primeiro passo executado da fase A com `\|yawRateRadPerS\| >= 0.9 × steady`, senão `toMs(72)`; `fallToTenPctMs` = `toMs` dos passos da fase B até o primeiro com `<= 0.1 × steady`, senão `toMs(72)` (também quando a fase B não começou); `speedMinMps`/`speedMaxMps` sobre os passos executados da fase A; `understeerStepCount` sobre os passos executados |
| `CORNER_RADIUS` | passo 360 ou fim da janela (372) | `pathRadiusAt3sM` pela definição de Medidas sobre os passos da janela executados até a saída (`Number.MAX_VALUE` quando nenhum passo da janela foi executado ou `Θ` é 0); `speedAt3sMps` e `handlingAt3s` do passo 360, ou do passo da saída se ela veio antes; sem `stoppedAtStep`, que só existe com a parada |
| `CORNER_TURN` | passo 240 | `turnAt2sRad` = `\|turn\|` do passo da saída; `speedAt2sMps` do passo da saída; `halfTurnReachedMs` só se o giro atingiu π antes da saída |
| `REAR_RECOVERY` | fim da fase A ou da fase B | `rearReleased` e `forcingMs` dos passos executados da fase A; com `rearReleased`, `gripReached` falso se nenhum passo executado da fase B teve `grip` (sem `recoveryMs`) e `maxSideslipRad` sobre os passos executados da fase B |
| `ACCELERATION`, `TOP_SPEED` | 60 km/h ou o fim do crescimento | `zeroToSixtyKmhMs` = `toMs` do primeiro passo com `speedMps >= 60 / 3.6`, senão `toMs` de `topSpeedWindowMs`; `topSpeedMps` = `speedMps` do passo da saída |
| `DRIFT_INERT` (recuperação) | fim da sequência | as duas execuções param cada uma na sua saída; `comparedStepCount` = passos da execução mais longa; um passo presente só numa delas conta como diferente; os campos da área são os da execução com o comando |

| `benchId` | Ambiente, estado inicial e `Input` por passo | Medição | `PASS` se |
|---|---|---|---|
| `STEER_RESPONSE` (lados +1 e −1; `PROPORTIONAL` acrescenta ±0,5) **(muda: ambiente)** | `padEnvironment`, `straight(50 / 3.6)`, acerto ensaiado com `driverMass` 75. **Fase A** (`holdMs` 600 = 72 passos): esterço no valor da variante; acelerador do passo `k` = 1 se `speedMps` do passo `k−1` (ou do estado inicial) < `targetSpeedMps`, senão 0 (`THROTTLE_REGULATED`, binário por construção; nunca é a condição de forçar). **Fase B** (até 72 passos): esterço 0, mesma regulação, até o primeiro passo com `\|yawRateRadPerS\| <= 0.1 × steady` | `steadyYawRateRadPerS` = média de `\|yawRateRadPerS\|` nos últimos 24 passos da fase A; `riseToNinetyPctMs` = `toMs` do primeiro passo da fase A com `\|yawRateRadPerS\| >= 0.9 × steady` (nenhum: `toMs(72)`); `fallToTenPctMs` = `toMs` dos passos da fase B até o primeiro com `<= 0.1 × steady` (nenhum: `toMs(72)`); `speedMinMps`/`speedMaxMps` na fase A; `understeerStepCount` nas duas fases; `targetSpeedMps`, `speedHoldMode`, `speedHoldBandMps`, `settleWindowMs`, `steerInputNorm` copiados; `throttleInputNorm` ausente; campos da área | `offAsphaltStepCount = 0` (senão `TEST_AREA_EXCEEDED`); `speedMinMps >= targetSpeedMps − speedHoldBandMps` e `speedMaxMps <= targetSpeedMps + speedHoldBandMps` (senão `SPEED_NOT_HELD`); `riseToNinetyPctMs <= 180` e `fallToTenPctMs <= 250` (senão `THRESHOLD_EXCEEDED`); `understeerStepCount` não entra |
| `CORNER_RADIUS` (partida 50 km/h e 70 km/h × lados +1 e −1) **(novo)** | `padEnvironment`, `straight(entrySpeedMps)`, `grip`; do passo 1 (a partida) em diante, acelerador 1 e esterço do lado; até o passo 372 (fim da janela de raio), ou parada antes de 360, ou saída da área | `pathRadiusAt3sM` (Medidas; ausente com `stoppedAtStep`); `speedAt3sMps` = `speedMps` do passo 360 (0 com parada); `handlingAt3s` = `handling` do passo 360 (do passo da parada, com parada); `radiusWindowMs`, `steerInputNorm`, `entrySpeedMps` copiados; `stoppedAtStep` com parada; campos da área | `offAsphaltStepCount = 0` (senão `TEST_AREA_EXCEEDED`); sem `stoppedAtStep` (senão `MEASUREMENT_MISSING`: com o kart parado o raio não é definido); `pathRadiusAt3sM <= 13` (senão `THRESHOLD_EXCEEDED`). `handlingAt3s` e qualquer passo em `understeer`, `oversteer` ou `sliding` não entram |
| `CORNER_TURN` (lados +1 e −1) **(novo)** | `padEnvironment`, `straight(50 / 3.6)`, `grip`; do passo 1 em diante, acelerador 0 e esterço do lado; até o passo 240, ou parada, ou saída da área | `turnAt2sRad`, `halfTurnReachedMs` (Medidas); `speedAt2sMps` = `speedMps` do passo 240 (0 com parada); `steerInputNorm`, `entrySpeedMps` copiados; `stoppedAtStep` com parada antes de 240; campos da área | `offAsphaltStepCount = 0` (senão `TEST_AREA_EXCEEDED`); `halfTurnReachedMs` presente, isto é, giro ≥ π rad num passo até 2 s — com parada, até o passo da parada (senão `THRESHOLD_EXCEEDED`, com `stoppedAtStep` e o giro atingido). O estado de aderência não entra |
| `NORMAL_DRIVING` (um registro, `SYNTHETIC_TRACK`) **(muda)** | todos os passos `RUNNING` do traço de `TEST_PILOT_LAP` da mesma execução, sem exceção — inclusive os passos com `forcing` verdadeiro e os fora do asfalto (RULE-0001, Contextos de observação) | `normalDrivingStepCount` = passos do traço; `oversteerOrSlidingStepCount` = passos com `handling` `oversteer` ou `sliding`; `maxSideslipRad` = máximo de `sideslipRad` | `oversteerOrSlidingStepCount = 0` e `maxSideslipRad <= 0.65` (senão `THRESHOLD_EXCEEDED`) |
| `REAR_RECOVERY` (lados +1 e −1) **(muda: ambiente, lados, campos)** | `padEnvironment`, `straight(forcingSpeedMps)` (16,7 m/s, acima de 50 km/h), `grip`. **Fase A** (forçar): acelerador 1 e esterço do lado, até o primeiro passo com `forcing` verdadeiro **e** `handling` `oversteer` ou `sliding`, ou até `forcingWindowMs` (360 passos). **Fase B** (só se a traseira soltou): esterço 0, acelerador 1 mantido, do passo de soltura (o primeiro da fase B, RULE-0001) até o primeiro passo em `grip`, ou até 360 passos | `rearReleased` = a fase A terminou pela traseira solta; `forcingMs` = `toMs` dos passos da fase A; com `rearReleased`: `gripReached` = houve passo em `grip` na fase B, `recoveryMs` = `toMs` dos passos da fase B até o primeiro `grip` inclusive (só com `gripReached`), `maxSideslipRad` = máximo de `sideslipRad` nesses passos (na fase B inteira, sem `grip`); `steerInputNorm`, `entrySpeedMps` copiados; campos da área | `offAsphaltStepCount = 0` (senão `TEST_AREA_EXCEEDED`); sem `rearReleased`: `PASS` — nenhum critério exige que a traseira solte (REQ-FEAT-0003-17); com `rearReleased`: `gripReached` (senão `THRESHOLD_EXCEEDED`, REQ-FEAT-0003-12), `recoveryMs <= 400` e `maxSideslipRad <= 0.65` (senão `THRESHOLD_EXCEEDED`) |
| `DRIFT_INERT` (duas sequências) **(novo)** | **Volta**: a sequência de `Input` da execução de `TEST_PILOT_LAP` (os `COUNTDOWN_STEPS` passos parados e os comandos do piloto), reaplicada duas vezes por `startLap`/`stepLap` a partir da mesma largada: sem o comando de drift e com `drift: true` em todos os passos (`SYNTHETIC_TRACK`). **Recuperação**: a sequência de `Input` do registro `REAR_RECOVERY` de lado +1, reaplicada duas vezes por `step` a partir de `straight(forcingSpeedMps)` em `padEnvironment`, sem e com `drift: true` em todos os passos (`TEST_PAD`) | `comparedStepCount` = passos comparados; `differingStepCount` = passos em que `positionXM`, `positionZM`, `speedMps`, `headingRad`, `handling` ou `sideslipRad` diferem entre as duas execuções (igualdade estrita); `firstDifferingStep` = índice do primeiro deles na sequência (1 no primeiro passo); na recuperação, campos da área da execução com o comando | na recuperação, `offAsphaltStepCount = 0` (senão `TEST_AREA_EXCEEDED`); `differingStepCount = 0` (senão `THRESHOLD_EXCEEDED`) |
| `SPEED_CAP` (um registro, `SYNTHETIC_TRACK` por convenção) **(novo)** | nenhum passo próprio: os traços da mesma execução e do mesmo `inputMode` dos ensaios que partem de velocidade igual ou menor que `topSpeedMps` — `STEER_RESPONSE`, `CORNER_RADIUS` nas partidas com `entrySpeedMps <= topSpeedMps`, `CORNER_TURN`, `REAR_RECOVERY` se `forcingSpeedMps <= topSpeedMps`, `ACCELERATION`/`TOP_SPEED`, `GRASS_LOSS`, `WALL_CONTACT`, `TEST_PILOT_LAP` e as quatro execuções de `DRIFT_INERT` (com e sem o comando) | `maxObservedSpeedMps` = maior `speedMps` depois de qualquer passo desses traços; `maxObservedBenchId` = o `benchId` em que foi observada (o primeiro, na ordem da suíte, em empate); `topSpeedMps` copiado do registro `TOP_SPEED` da mesma execução | `topSpeedMps` presente (senão `MEASUREMENT_MISSING`); `maxObservedSpeedMps <= topSpeedMps` (senão `THRESHOLD_EXCEEDED`) |
| `ACCELERATION` **(muda: ambiente)** | `straightPadEnvironment`, `straight(0)`, `driverMassKg` 75, acelerador 1 e esterço 0 mantidos, até a velocidade deixar de crescer (diferença entre passos < 1e-6 m/s por 120 passos) ou `topSpeedWindowMs`; a mesma execução de `TOP_SPEED` | `zeroToSixtyKmhMs` = `toMs` do primeiro passo com `speedMps >= 60 / 3.6` (nenhum: `toMs` da janela); `driverMassKg`; campos da área | `offAsphaltStepCount = 0` (senão `TEST_AREA_EXCEEDED`); `<= 2500` (senão `THRESHOLD_EXCEEDED`) |
| `TOP_SPEED` **(muda: limiar, ambiente)** | idem | `topSpeedMps` = `speedMps` do último passo; campos da área | `offAsphaltStepCount = 0` (senão `TEST_AREA_EXCEEDED`); `65 / 3.6 <= topSpeedMps <= 72 / 3.6` (senão `THRESHOLD_EXCEEDED`) |
| `GRASS_LOSS` (duas execuções) (mantido) | `CIRCUIT`; `grassEntry(topSpeedMps)` com o `topSpeedMps` de `TOP_SPEED` nas mesmas opções, e `grassEntry(50 / 3.6)`; acelerador 1 e esterço 0 por `grassWindowMs` (120 passos) | `entrySpeedMps`; `speedAfterOneSMps` | precondição: os 120 passos com `surface` `GRASS` e nenhum `wallContact` (senão `THRESHOLD_EXCEEDED` por `observed`); `speedAfterOneSMps <= 0.70 × entrySpeedMps` |
| `WALL_CONTACT` **(muda: motivo da lista vazia)** | `CIRCUIT`, `wallApproach()`, acelerador 1, esterço 0, por `wallWindowMs` | um par (`speedBeforeContactMps`, `speedAfterContactMps`) por passo com `wallContact` e velocidade do passo anterior > 0 | lista não vazia (senão `MEASUREMENT_MISSING`: não há par a julgar); `after < before` em 100 % dos pares (senão `THRESHOLD_EXCEEDED`) |
| `DETERMINISM` (um registro por ambiente) (mantido) | a suíte do ambiente (salvo `STEP_COST`) executada `runCount` 2 vezes com a mesma sequência de `Input`, inclusive as execuções de `DRIFT_INERT` | `identical` = `deepEqual` dos estados por passo de cada traço e, em `SYNTHETIC_TRACK`, do `LapResult`; no registro `TEST_PAD`, campos da área agregados | no registro `TEST_PAD`, `offAsphaltStepCount = 0` (senão `TEST_AREA_EXCEEDED`); `identical` (senão `NON_DETERMINISTIC`) |
| `TEST_PILOT_LAP` **(muda: fim da volta)** | `startLap` em `TRAINING` sobre a leitura da pista sintética, com `setupId` e `setupVersion` ensaiados no pedido; `COUNTDOWN_STEPS` passos parados; `testPilot` até o **primeiro passo em que `getLapResult` devolve um resultado** (a primeira volta concluída ou invalidada), ou `MAX_LAP_STEPS` 6 000 — nunca até a fase `ENDED`, que o treino de `race-lap-validation` (API-0001 1.2.0 daquela feature) só alcança por `endTraining`; hoje os dois instantes coincidem | `lapTimeMs` do primeiro resultado (volta `VALID`; senão `toMs(6000)`); `sectorMs` sempre 4 inteiros (setores não concluídos com `toMs(6000)`); `offAsphaltStepCount` = passos `RUNNING` com `GRASS`, com a primeira saída; `baselineLapTimeMs` do registro igual da linha de base | `offAsphaltStepCount = 0` (senão `OFF_ASPHALT`); `lapTimeMs <= 25000` (senão `THRESHOLD_EXCEEDED`) |
| `STEP_COST` (só em `bench:handling`) **(muda: ambiente)** | nenhum estado: `meanStepCostUs` e `runtimeId` chegam em `options.stepCost`, medidos sobre a volta do piloto de teste | `meanStepCostUs`; `baselineMeanStepCostUs` do registro `STEP_COST` da entrada com o mesmo `runtimeId`; `benchEnvironment` `SYNTHETIC_TRACK` (a volta medida) | linha de base presente (senão `BASELINE_MISSING`); `meanStepCostUs <= 1.10 × baselineMeanStepCostUs` (senão `THRESHOLD_EXCEEDED`) |
| `SETUP_VERSION` **(muda: ambiente)** | leitura de `PUBLISHED_SETUPS` e de `options.oldRecords ?? builtInOldRecords()` (`readReplay` para os que têm `inputs`; `compareLapRecords` e `resolveSetupRef` para os demais) | `declaredSetupVersion` (`arcade-assistido-v6`), `previousSetupVersion` (`arcade-assistido-v4`), `oldRecordsReadCount`, `oldRecordsReadOkCount` | diferentes e contagens iguais (senão `THRESHOLD_EXCEEDED`) |
| `STEP_CONTRACT` **(muda: ambiente)** | leitura de `STEP`, `SOLVER_SUBSTEPS` e do texto de `src/physics.ts` | `stepUnchanged` = `1 / STEP === 120`; `solverRateUnchanged` = `120 × SOLVER_SUBSTEPS === 480` e a linha de `step` usa `Math.ceil(dt / (STEP / SOLVER_SUBSTEPS))`; `inputFieldsUnchanged` = a linha `export type Input` é literalmente `export type Input = { throttle: number; brake: number; steer: number; drift?: boolean };` | os três verdadeiros (senão `CONTRACT_CHANGED`) |
| `REALISTA_UNCHANGED` (um registro por ambiente) **(muda: conjunto comparado)** | a suíte inteira com `setupId` `REALISTA_ALUGUEL_4T` (`RENTAL_KART`), em `BINARY` e `PROPORTIONAL`, mais os seus `NORMAL_DRIVING`, `SPEED_CAP` e `DETERMINISM`, comparados registro a registro, por ambiente, com os da entrada `options.realistaBaseline` | `differingMeasureCount` (`countDifferingMeasures`); `arcadeAssistActiveCount` = passos com `assistActive` nos traços do ambiente; no registro `TEST_PAD`, campos da área agregados | no registro `TEST_PAD`, `offAsphaltStepCount = 0` (senão `TEST_AREA_EXCEEDED`); `realistaBaseline` presente (senão `BASELINE_MISSING`); 0 e 0 (senão `CONTRACT_CHANGED`) |

Os ensaios de US-0001 a US-0004 (`STEER_RESPONSE`, `CORNER_RADIUS`, `CORNER_TURN`, `NORMAL_DRIVING`,
`REAR_RECOVERY`, `DRIFT_INERT`, `SPEED_CAP`, `ACCELERATION`, `TOP_SPEED`, `GRASS_LOSS`, `WALL_CONTACT`) rodam
com `inputMode` `BINARY` e `PROPORTIONAL` e precisam de `PASS` nos dois (REQ-FEAT-0006-05). O conjunto de
`race-lap-validation` roda na mesma execução de `npm test` e continua aprovado porque `src/track.ts`,
`src/trackData.ts`, `src/lap.ts`, `ARCADE_KART`, `RENTAL_KART`, a linha de `Input` e a linha 3 de
`src/physics.ts` não mudam e `src/maneuvers.ts` continua presente
([ADR-0006](../adr/ADR-0006-retirada-do-drift-e-do-turbo-com-janela-de-compatibilidade.md); REQ-FEAT-0006-07).

A recuperação com acelerador e esterço levados a 0 no mesmo passo (REQ-FEAT-0003-09) não tem registro
próprio: API-0003 não tem campo que distinga essa variante, e acrescentá-lo mudaria o contrato. É verificada
em `npm test` pela mesma fase A de `REAR_RECOVERY` seguida de `Input` nulo, por `step`
([test-strategy](../test-strategy.md)).

**Medido nesta rodada** com a biblioteca as-built e o acerto C em memória, sobre o asfalto sem limite (a
etapa de código mede de novo sob este projeto; nada aqui é linha de base): `CORNER_RADIUS` 11,67 m de 50 km/h
e 11,76 m de 70 km/h, com `handlingAt3s` `understeer` e 54–55 km/h aos 3 s; `CORNER_TURN` 208° em 2 s,
`halfTurnReachedMs` 1 825; `REAR_RECOVERY` com `rearReleased` falso dos dois lados e `forcingMs` 3 000 (o
kart desacelera a cerca de 54 km/h em `understeer`); `NORMAL_DRIVING` com 0 passos em `oversteer`/`sliding` e
`maxSideslipRad` 0,077 em 2 766 passos; `TOP_SPEED` 19,25 m/s; `TEST_PILOT_LAP` 23 049 ms; velocidade máxima da
volta 69,30 km/h.

### Serialização

`serialize` imprime, por programa de bench, uma linha `# {"parameters": {...}}` com `BENCH_PARAMETERS` (e
`runtimeId` em `bench:handling`) e depois, por registro, uma linha JSON com exatamente os campos de API-0003
e uma linha `#` de apresentação: cada campo `...Mps` também em km/h (`× 3.6`), `zeroToSixtyKmhMs` também em
s (`÷ 1000`), `turnAt2sRad` também em graus (`× 180 / π`), `contacts` em km/h, e os diagnósticos que não são
campo — em `CORNER_RADIUS`, `L` e `Θ` da janela; em `REAR_RECOVERY` sem `rearReleased`, "a traseira não soltou
em `forcingWindowMs`"; em `GRASS_LOSS` reprovado por `observed`, o motivo. Em `npm test`, cada teste imprime
o registro por `t.diagnostic`.

## Colaboradores

Chama `step`, `initialState`, `getHandlingTelemetry`, `testPadArea`, `PUBLISHED_SETUPS`, `CIRCUIT`, `STEP`,
`SOLVER_SUBSTEPS` (`src/physics.ts`); `startLap`, `stepLap`, `getLapState`, `getLapResult` (`src/lap.ts`);
`toMs`, `COUNTDOWN_STEPS` (`src/lapTiming.ts`); `track`, `nearest`, `SYNTHETIC_TRACK_FILE` (`src/track.ts`);
`readTrackData` (`src/trackData.ts`); `readReplay`, `compareLapRecords`, `resolveSetupRef`
(`src/setupRecords.ts`); `node:fs`. Deixa de importar `classifyHandlingSteps`, `testPadLane`, `testPadArc`,
`TEST_PAD` e `WIDTH`. É chamada por `scripts/keyboard-lap.ts`, `scripts/physics-bench.ts` e
`tests/dirigibilidade-*.test.ts`; nunca por `src/`.

## Estado e concorrência

Sem estado entre ensaios: cada ensaio constrói o seu estado inicial e o seu ambiente. Um ensaio é função pura
do acerto, do ambiente, do estado inicial e da sequência de `Input` (RULE-0002); o acelerador regulado de
`STEER_RESPONSE` e o fim das fases de `REAR_RECOVERY` são funções da telemetria dos passos anteriores, logo a
sequência de `Input` resultante é a mesma em toda execução; `DRIFT_INERT` reaplica sequências gravadas.
Repetir produz registros idênticos exceto `measuredAtUtc` (do chamador) e `meanStepCostUs`. Não há chave:
nada é escrito. O registro em `docs/physics.md` é feito pelo desenvolvedor na etapa de código, com a data,
para a linha de base (`--previous`, `--realista`) e para o acerto novo (REQ-FEAT-0006-08). Cada rodada de
presets do ciclo em staging (`DOMAIN/DEC-10`) repete todos os ensaios, nos mesmos ambientes e contra os
mesmos limiares, como nova `setupVersion`, e acrescenta a sua entrada datada.

## Comportamento em falha

| Situação | Resultado |
|---|---|
| kart fora da área declarada em qualquer ensaio na pista de teste aberta | a execução para nesse passo; `FAIL` `TEST_AREA_EXCEEDED` com `offAsphaltFirstStep` e posição: medição inválida, falha do ambiente de ensaio, nunca aprovação; os campos obrigatórios são medidos até o passo da saída (tabela "Campos obrigatórios quando a execução para na saída da área") |
| velocidade não mantida em `STEER_RESPONSE` | `FAIL` `SPEED_NOT_HELD` com `speedMinMps`/`speedMaxMps`; os tempos ficam no registro e não valem como veredito |
| parada antes de 3 s em `CORNER_RADIUS` | `FAIL` `MEASUREMENT_MISSING`, `stoppedAtStep`, sem `pathRadiusAt3sM` |
| parada antes de 2 s em `CORNER_TURN` com giro abaixo de π | `FAIL` `THRESHOLD_EXCEEDED`, `stoppedAtStep` e `turnAt2sRad` do passo da parada |
| trajetória reta na janela de raio | `pathRadiusAt3sM` = `Number.MAX_VALUE`; `FAIL` `THRESHOLD_EXCEEDED` |
| traseira não solta em `REAR_RECOVERY` | `rearReleased` falso, `forcingMs`; `PASS` |
| traseira solta sem `grip` na recuperação | `FAIL` `THRESHOLD_EXCEEDED`, `gripReached` falso, `recoveryMs` ausente |
| estados diferentes com e sem o comando de drift | `DRIFT_INERT` `FAIL` `THRESHOLD_EXCEEDED` com `firstDifferingStep` |
| velocidade acima da estabilizada | `SPEED_CAP` `FAIL` `THRESHOLD_EXCEEDED` com `maxObservedBenchId`; sem `topSpeedMps`, `MEASUREMENT_MISSING` |
| precondição de `GRASS_LOSS` não atingida | `FAIL` `THRESHOLD_EXCEEDED` por `observed` |
| `WALL_CONTACT` sem contato | `FAIL` `MEASUREMENT_MISSING`, `contacts` vazia |
| piloto de teste fora do asfalto; não termina em `MAX_LAP_STEPS` ou volta invalidada | `OFF_ASPHALT` com passo e posição; `THRESHOLD_EXCEEDED` com `lapTimeMs` = `toMs(6000)` e `sectorMs` com 4 elementos |
| execuções diferentes | `DETERMINISM` `FAIL` `NON_DETERMINISTIC`; nunca tolerância |
| `docs/physics.md` ausente, sem bloco, corrompido ou sem entrada igual | `readBaseline` devolve `undefined`; `baselineAvailable` falso; `STEP_COST` e `REALISTA_UNCHANGED` dão `BASELINE_MISSING`; os demais vereditos não dependem dela |
| leitura da pista sintética não `COMPLETE` | a biblioteca lança: defeito do repositório, não resultado de ensaio |

Sem rede, sem tempo-limite. Registro em log: só a saída serializada (identificadores, campos de API-0003,
parâmetros e `runtimeId`); nunca caminho de arquivo, nome de máquina ou de usuário.

## Observabilidade

Cada limiar tem o seu campo e cada falha o seu `failReason`; `docs/physics.md` guarda a série datada, por
ambiente, que mostra uma regressão entre entregas (NFR-0004). `STEP_COST` é a métrica de NFR-0002;
`DETERMINISM`, a de NFR-0001; `REALISTA_UNCHANGED`, a de NFR-0007; o conjunto de `race-lap-validation` verde,
a de NFR-0008; `speedMinMps`/`speedMaxMps`, a da velocidade mantida; `rearReleased`/`forcingMs` dizem se a
recuperação teve o que medir; a linha `#` de `CORNER_RADIUS` mostra o comprimento e a variação de direção de
que o raio saiu.

## Determinismo (D-DS-07)

A biblioteca avança a simulação só com `STEP` e nunca lê relógio: não importa `node:perf_hooks` nem
`node:os` e não contém `Date` nem `performance`; `measuredAtUtc` e `stepCost` vêm do chamador (I9). Provas:
`DETERMINISM` por ambiente em `tests/dirigibilidade-test-pilot.test.ts`; `DRIFT_INERT` em
`tests/dirigibilidade-rear.test.ts`; `tests/dirigibilidade-contract.test.ts` afirma a ausência desses símbolos
em `scripts/handlingBench.ts`.

## Feature flag

Nenhuma: não é comportamento de usuário. `--previous`, `--realista`, `version` e `setup` são argumentos dos
programas de bench para produzir a linha de base, reportados na saída; os parâmetros de ensaio são fixos e
reportados, não limiares nem configuração.

## Pontos em aberto

Nenhum.
