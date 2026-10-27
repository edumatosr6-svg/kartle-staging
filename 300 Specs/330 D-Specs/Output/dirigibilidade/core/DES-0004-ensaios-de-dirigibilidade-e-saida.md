---
id: DES-0004
title: Ensaios de dirigibilidade, ambientes, linha de base e saída (API-0003)
feature: dirigibilidade
stage: dspec
status: validated
version: 5.1.0
sources: [API-0003, RULE-0001, RULE-0002, FLOW-0002, FEAT-0001, FEAT-0002, FEAT-0003, FEAT-0004, FEAT-0005, FEAT-0006, REQ-FEAT-0001-05, REQ-FEAT-0001-06, REQ-FEAT-0001-09, REQ-FEAT-0002-01, REQ-FEAT-0002-02, REQ-FEAT-0002-03, REQ-FEAT-0002-04, REQ-FEAT-0002-05, REQ-FEAT-0002-06, REQ-FEAT-0002-07, REQ-FEAT-0002-09, REQ-FEAT-0002-10, REQ-FEAT-0003-07, REQ-FEAT-0003-08, REQ-FEAT-0003-12, REQ-FEAT-0004-07, REQ-FEAT-0005-01, REQ-FEAT-0005-02, REQ-FEAT-0005-03, REQ-FEAT-0005-04, REQ-FEAT-0005-07, REQ-FEAT-0005-11, REQ-FEAT-0005-12, REQ-FEAT-0006-02, REQ-FEAT-0006-04, REQ-FEAT-0006-05, REQ-FEAT-0006-06, REQ-FEAT-0006-07, REQ-FEAT-0006-08, REQ-FEAT-0006-09, NFR-0001, NFR-0002, NFR-0003, NFR-0004, NFR-0007, NFR-0008]
---

# DES-0004 — Ensaios de dirigibilidade, ambientes, linha de base e saída (API-0003)

## Realiza

O contrato API-0003 (3.4.0) campo a campo e a tabela de ensaios e ambientes de RULE-0002 (3.4.0): um
registro por `benchId` e variante, com `benchEnvironment`, na saída de `npm test`, `npm run bench:handling`
e do bench de física (`npm run bench:physics`) (AC-US-0001-06, AC-US-0002-05, AC-US-0003-06, -07,
AC-US-0004-07, AC-US-0005-01 a -04, -06); veredito do `STEER_RESPONSE` só pelos tempos, com a velocidade
mantida, inclusive com o kart fora da faixa da reta (AC-US-0001-05; REQ-FEAT-0001-09: `SPEED_NOT_HELD`);
curva de referência julgada, com acelerador cheio, pela permanência na faixa, pelos 200 ms de `understeer` e
pela ausência de `oversteer`/`sliding`, e, com acelerador 0, **só** pelos 200 ms de `understeer`, medidos só
nos passos na faixa de asfalto até a primeira saída da faixa — os passos depois da saída não entram na
medição —, com a saída reportada sem reprovar (REQ-FEAT-0002-01, -02, -03, -09; `DOMAIN/DEC-13` e
`DOMAIN/DEC-14` via AC-US-0002-01 e -02); `BASELINE_MISSING` sem linha de base do mesmo ensaio,
ambiente e geometria (REQ-FEAT-0002-07, REQ-FEAT-0006-09); `OFF_ASPHALT` com passo e posição no arco com
acelerador cheio, na recuperação e no piloto de teste (REQ-FEAT-0002-09, REQ-FEAT-0005-11); varredura de
`UNDERSTEER_ONSET` em patamares de velocidade mantida, encerrada pela primeira saída da faixa e decidida
pela velocidade do kart nesse passo, com `MEASUREMENT_MISSING` só por falta de medida e com V1 definida em
todo fim natural — a menor velocidade de patamar completo com `understeer` por mais de 200 ms consecutivos
ou, sem nenhum patamar assim, a velocidade mantida do patamar interrompido pela saída, de modo que nunca
sair de frente até sair da faixa cumpre o critério (REQ-FEAT-0002-04, -05, -10; AC-US-0002-03, -04, -06;
`DOMAIN/DEC-12`, `DOMAIN/REF-05`); recuperação sem `grip` reportada e os passos excedentes contados como
condução normal (REQ-FEAT-0003-12); `NON_DETERMINISTIC` como defeito (REQ-FEAT-0005-12; NFR-0001); paridade
`BINARY`/`PROPORTIONAL` (NFR-0003); custo por passo (NFR-0002); Realista idêntico (NFR-0007); contrato de
passo (REQ-FEAT-0005-07); `race-lap-validation` aprovado na mesma execução (NFR-0008); registro em
`docs/physics.md` com ambiente e parâmetros (NFR-0004). Decisões:
[ADR-0003](../adr/ADR-0003-linha-de-base-legivel-por-maquina-em-docs-physics.md),
[ADR-0004](../adr/ADR-0004-ensaios-como-biblioteca-e-parametros-de-ensaio.md),
[ADR-0005](../adr/ADR-0005-pista-de-teste-como-ambiente-da-simulacao-e-velocidade-mantida.md).

## Posicionamento

Dois lugares, com camadas distintas; lugar na árvore: `scripts/`, onde as diretrizes põem os benches, e
`tests/` para as verificações.

- `scripts/handlingBench.ts`, **existente** (escrito pelas rodadas de código 1 a 3; a rodada 3, commit
  `767508e`, realiza a versão 5.0.0 deste item; 853 linhas) e **alterado** nesta rodada num ponto, camada
  **Simulação** (os ensaios
  só avançam a simulação com `STEP`): biblioteca pura dos ensaios (sem DOM, sem `three`, sem
  `node:perf_hooks`, sem `node:os`, sem `Date`, sem `performance`), importada por `npm test` e pelos dois
  benches. Motivo de ser módulo próprio: `scripts/keyboard-lap.ts` é um programa que imprime ao carregar,
  não uma biblioteca; e os ensaios não são código do jogo, logo não ficam em `src/`. Todo valor de parede
  (`measuredAtUtc`, `meanStepCostUs`, `runtimeId`) entra por argumento. `node:fs` é usado só para ler
  `docs/physics.md` (`loadBaselineText`, `:822` em `767508e`) e o texto de `src/physics.ts` (`STEP_CONTRACT`,
  `:626` em `767508e`). Os marcadores **(muda)** abaixo são os da versão 5.0.0 — a curva de referência com
  acelerador 0 percorrendo a janela inteira (`DOMAIN/DEC-13`), a definição de V1 e o veredito de
  `UNDERSTEER_ONSET` (`DOMAIN/DEC-12`), a resolução de V0, a linha `#` e os campos de acerto nas voltas de
  ensaio —, todos entregues pela rodada de código 3 e lidos agora como as-built (`docs/physics.md:207-214`,
  `:253-265`); o único ponto que muda nesta versão, marcado **(muda 5.1.0)**, é a janela de medição de
  `maxUndersteerMs` em `REFERENCE_CORNER` com `THROTTLE_ZERO` (`DOMAIN/DEC-14`, F-Spec 3.4.0; feedback da
  etapa de código de 2026-10-27, SPEC-ISSUE-03). As linhas citadas neste item são as da árvore da rodada de
  código 2 (commit `0068a57`), salvo as marcadas `em 767508e`, da rodada 3.
- `scripts/keyboard-lap.ts` (`bench:handling`), **existente** (rodada de código 2, `:1-61`), camada
  **Aplicação** (programa de bench em Node, que só altera a simulação por `startLap`/`stepLap`): chama a
  biblioteca e imprime os registros `STEER_RESPONSE`, `REFERENCE_CORNER`, `UNDERSTEER_ONSET`,
  `NORMAL_DRIVING`, `REAR_RECOVERY`, `DRIFT_MANEUVER`, `ACCELERATION`, `TOP_SPEED`, `GRASS_LOSS`,
  `WALL_CONTACT`, `TEST_PILOT_LAP`, `DETERMINISM`, `STEP_COST`, `SETUP_VERSION`, `STEP_CONTRACT` e
  `REALISTA_UNCHANGED` (`handlingBenchReport`, `:59`); é o único módulo desta feature que importa
  `node:perf_hooks` (mede `meanStepCostUs` em `measureStepCost`, `:21-39`, executando ele mesmo a volta
  cronometrada com `testPilot` da biblioteca e `stepLap`) e `node:os` (`runtimeId()`, `:16-18`), e que lê
  `new Date()` (`measuredAtUtc`, `:46`); a função `keyboardLap` e o uso de `LapTracker` do programa anterior
  saíram (a linha 3 de `src/physics.ts` e o teste `tests/physics.test.ts:35` ficam). **(muda)**: a volta
  cronometrada de `measureStepCost` (`startLap`, `:25`) passa a informar `setupId` e `setupVersion` do
  acerto ensaiado no pedido, como toda volta iniciada depois da mudança de API-0002 1.1.0 de
  `race-lap-validation` ([DES-0003](DES-0003-versao-do-acerto-registros-e-comparabilidade.md)).
- `scripts/physics-bench.ts` (`bench:physics`), **existente** (rodada de código 2), camada **Aplicação**:
  mantém as linhas que já imprimia (`:9-39`) e acrescenta `ACCELERATION`, `TOP_SPEED`, `GRASS_LOSS` e
  `WALL_CONTACT` (`:40-47`); lê `new Date()` para `measuredAtUtc` (`:41`); não mede custo por passo nem
  calcula `runtimeId` (nenhum dos seus registros usa um nem outro), logo não importa `node:perf_hooks` nem
  `node:os`.
- `tests/dirigibilidade-*.test.ts`, **novos** (ainda ausentes da árvore: `tests/` tem só `physics`,
  `maneuvers` e `race-lap-validation-*`): chamam a biblioteca e afirmam o veredito de cada registro
  ([test-strategy](../test-strategy.md)). `tests/fixtures/records.ts`, **novo**: os registros antigos e
  novos, passados à biblioteca por `BenchOptions.oldRecords`.
- `docs/physics.md`, **existente** (rodadas de código 2 e 3): entrada datada `## Dirigibilidade — Arcade
  assistido v5 (2026-10-22; registros refeitos em 2026-10-27 sob API-0003 3.3.0)` (`:196-277` em `767508e`:
  ambientes e parâmetros, parâmetros do acerto, resultados — o registro `REFERENCE_CORNER` com acelerador 0
  medido na janela inteira, 633 ms, está em `:253`) e o bloco `handling-baseline` (`:279-426` em `767508e`)
  com as entradas `arcade-assistido-v4`, `realista-aluguel-4t-v4` e `arcade-assistido-v5`
  ([DM-0001](../data/DM-0001-dado-publicado-registros-e-linha-de-base.md), seção 5); **alterado** pela etapa
  de código a cada rodada de acerto (nova entrada datada); a entrada `arcade-assistido-v5` e a tabela de
  resultados são refeitas pela rodada de código seguinte só no registro `REFERENCE_CORNER` com
  `THROTTLE_ZERO`, cuja janela de medição muda nesta versão.

## Interface

`scripts/handlingBench.ts`:

| Símbolo | Assinatura | Descrição |
|---|---|---|
| `BenchRecord` | união discriminada por `benchId` (`:59-91`) **(muda)** | exatamente os campos de API-0003 por `benchId`, com os tipos e unidades de lá, e nenhum outro: `BenchCommon` (`:59-62`) com `benchEnvironment`; `STEER_RESPONSE` (`:65-67`) com `targetSpeedMps`, `speedHoldMode`, `speedHoldBandMps`, `speedMinMps`, `speedMaxMps` e `throttleInputNorm?` (só em `THROTTLE_CONSTANT`); `REFERENCE_CORNER` (`:68-69`) com `arcRadiusM`, `laneWidthM`, `maxUndersteerMs`, `offAsphaltStepCount`, `offAsphaltFirstStep?`, `offAsphaltFirstXM?`, `offAsphaltFirstZM?` — **(muda)**: com `THROTTLE_FULL`, `offAsphaltStepCount` é 0 ou 1 (a execução para no primeiro passo fora da faixa); com `THROTTLE_ZERO`, é o número de passos fora da faixa na janela inteira (0 a 300), informativo, e os três campos de saída descrevem a primeira saída; **(muda 5.1.0)**: com `THROTTLE_ZERO`, `maxUndersteerMs` cobre só os passos na faixa até a primeira saída (os anteriores a `offAsphaltFirstStep`), nunca os passos depois dela (API-0003 3.4.0, Compatibilidade); com `THROTTLE_FULL` nada muda; `UNDERSTEER_ONSET` (`:70-71`) com `arcRadiusM`, `laneWidthM`, `offAsphaltStepCount` (0 ou 1), `offAsphaltFirstStep?`, posição, `v0Mps?`, `v1Mps?` e `maxUndersteerMsBySpeed` como pares `[plateauSpeedMps, maxUndersteerMs]` (m/s, ms) dos patamares completos acima de 50 km/h — **(muda)**: `v1Mps` presente em todo fim natural da varredura (nos dois casos da sua definição) e, nos desfechos em que a saída reprova, só quando algum patamar completo teve `understeer` por mais de 200 ms consecutivos (API-0003 3.3.0); `NORMAL_DRIVING` (`:72-73`) com `normalDrivingStepCount`, `excludedRecoveryStepCount`; `REAR_RECOVERY` (`:74-75`) com `arcRadiusM`, `laneWidthM`, `gripReached`, `recoveryMs?`, `offAsphaltStepCount` (0 ou 1), `offAsphaltFirstStep?`, posição; `DRIFT_MANEUVER` (`:76`) com `driftScorePoints`; `TEST_PILOT_LAP` (`:82`) com `sectorMs` de sempre 4 elementos e `lapTimeMs` = `toMs(MAX_LAP_STEPS)` numa volta sem tempo; `FailReason` (`:52-53`) com os sete valores de API-0003 |
| `BenchOptions` | `{setup: PublishedSetup, version: 'current' \| 'previous', inputMode: 'BINARY' \| 'PROPORTIONAL', baseline?: Baseline, realistaBaseline?: Baseline, oldRecords?: readonly unknown[], measuredAtUtc: string, stepCost?: {meanStepCostUs: number, runtimeId: string}}` (`:94-98`, mantido) | `version: 'previous'` usa `previousConfig` (só para produzir a linha de base); `baseline` é a entrada da versão anterior do acerto ensaiado (`UNDERSTEER_ONSET`, `STEP_COST`, `TEST_PILOT_LAP`); `realistaBaseline` é a entrada do Realista (`REALISTA_ALUGUEL_4T`, `realista-aluguel-4t-v4`), lida pelo programa de bench ou pelo teste com `readBaseline` e usada só por `REALISTA_UNCHANGED`; `oldRecords` são os registros antigos que `SETUP_VERSION` lê — os fixtures de `tests/fixtures/records.ts` em `npm test`, e `builtInOldRecords()` quando ausente (a biblioteca não importa de `tests/`); `measuredAtUtc` vem do chamador (bench: `new Date().toISOString()`; teste: constante), nunca da biblioteca; `stepCost` é a medida de parede já feita pelo programa de bench (µs por passo, média) com o `runtimeId` da máquina, nunca lida pela biblioteca |
| `BENCH_PARAMETERS` | objeto congelado (`:20-28`, mantido) | os parâmetros de ensaio de [ADR-0004](../adr/ADR-0004-ensaios-como-biblioteca-e-parametros-de-ensaio.md), reportados na linha `#` e em `docs/physics.md`: `targetSpeedMps` 13,89 (`50 / 3.6`), `speedHoldMode` `THROTTLE_REGULATED`, `speedHoldBandMps` 0,5, `holdMs` 600, `settleWindowMs` 200, `steerInputNormPartial` 0,5, `laneWidthM` = `WIDTH` (11), `arcRadiusM` 18, `cornerWindowMs` 2 500 (curva de referência, nas duas condições de acelerador), `entrySpeedStepMps` 0,5 (tamanho do patamar de `UNDERSTEER_ONSET`), `plateauMs` 1 000 (duração da fase mantida de cada patamar, 120 passos), `plateauSpeedHoldMode` `THROTTLE_REGULATED` (modo de manter a velocidade do patamar), `entrySpeedMaxMps` 25 (velocidade-alvo máxima de patamar: teto de segurança; a varredura termina antes, no primeiro passo fora da faixa), `forcingSpeedMps` 16,7, `forcingWindowMs` 3 000, `grassEntryIndex` 83, `grassEntryOffsetM` 0,2, `grassEntryAngleRad` 0,15, `grassWindowMs` 1 000, `wallApproachRad` 0,6, `wallWindowMs` 10 000, `topSpeedWindowMs` 60 000, `maxSpeedMps` 26 e `lateralBudgetMps2` 9,5 (piloto de teste), `driverMassKg` 75, `runCount` 2. Todos fixos e nenhum valor muda nesta rodada: um parâmetro de ensaio só muda por mudança deste projeto, nunca para fazer um ensaio passar (ADR-0004, decisão 2) |
| `THRESHOLDS` | objeto congelado (`:34-38`, mantido) | os limiares de RULE-0002 na unidade do campo: 180, 250, 200, 400 ms; 0,65 rad; 2 500 ms; `105 / 3.6` m/s; 0,70; 25 000 ms; 1,15; 1,10 |
| `runBench(benchId, options)` | `(BenchId, BenchOptions) => BenchRecord[]` (`:729-747`) | um registro por variante do ensaio; `runBench('STEP_COST', options)` exige `options.stepCost` e só compara o valor recebido com a linha de base (não cronometra nada); lança `Error` (mensagem só com o `benchId` e o caso) nos dois resultados de `UNDERSTEER_ONSET` que RULE-0002 não decide (tabela abaixo), e quando a leitura da pista sintética não é `COMPLETE` |
| `handlingBenchReport(options, benchIds?)` | `(BenchOptions, BenchId[]?) => BenchRecord[]` (`:752-765`) | todos os ensaios, ou os pedidos; `STEP_COST` entra só quando `options.stepCost` está presente; zero ensaios dá lista vazia, nunca `PASS` implícito |
| `judge(record, observed?)` | `<T extends BenchRecord>(T, ('OFF_ASPHALT' \| 'THRESHOLD_EXCEEDED')?) => T` (`:651-724`) **(muda: `REFERENCE_CORNER` e `UNDERSTEER_ONSET`)** | fonte única do veredito: recalcula `verdict` e `failReason` dos campos medidos do registro e de `observed`, o que o ensaio viu no seu traço e que nenhum campo de API-0003 carrega — grama não mantida ou parede em `GRASS_LOSS` (`THRESHOLD_EXCEEDED`); `oversteer`/`sliding` na curva de referência com acelerador cheio (`THRESHOLD_EXCEEDED`); saída da faixa com a velocidade do kart abaixo de `50 / 3.6` no passo da saída em `UNDERSTEER_ONSET` (`OFF_ASPHALT`); a posição de `observed` na ordem de cada ensaio é a da tabela de vereditos abaixo. As saídas da faixa de `REFERENCE_CORNER` com `THROTTLE_FULL`, de `REAR_RECOVERY` e de `TEST_PILOT_LAP` são julgadas pelos campos; a de `REFERENCE_CORNER` com `THROTTLE_ZERO` e a de `STEER_RESPONSE` não alteram o veredito. Sem `observed`, o veredito vem só dos campos, de modo que um teste julga um registro sintético como o bench. `judge` lança, em vez de inventar veredito, diante de um registro `UNDERSTEER_ONSET` com `offAsphaltStepCount` 0 (varredura sem saída da faixa, que RULE-0002 não decide; ADR-0004, decisão 8) e diante de um registro de fim natural — saída acima de 50 km/h, sem `observed`, com dois pares ou mais — sem `v1Mps` (registro malformado: API-0003 3.3.0 torna `v1Mps` obrigatório no fim natural) |
| `readBaseline(markdownText, setupId, setupVersion, runtimeId?)` | `(string, SetupId, string, string?) => Baseline \| undefined` (`:775-787`) | localiza o bloco `handling-baseline` em `docs/physics.md` e a entrada pedida; `runtimeId` vem do chamador; a entrada traz `records` e `parameters` |
| `baselineRecord(baseline, benchId, match)` | `(Baseline?, BenchId, (BenchRecord) => boolean) => BenchRecord \| undefined` (`:302-304`; `sameSetting`, `:290-300`; `understeerBaselineRecord`, `:307-312`) **(muda: condição de V0)** | localiza na entrada o registro do mesmo ensaio **e** do mesmo `benchEnvironment`, com `arcRadiusM` e `laneWidthM` iguais quando o registro os tem (`\|Δ\| < 1e-9`), mesmo `inputMode` e mesma variante; para `UNDERSTEER_ONSET`, além disso, o mesmo `entrySpeedStepMps` no registro e os mesmos `plateauMs` e `plateauSpeedHoldMode` nos `parameters` da entrada (uma entrada medida por velocidades de entrada, ou sem esses parâmetros, não é o mesmo ensaio: API-0003, Compatibilidade), e só um registro cujo `v1Mps` é a velocidade de um patamar completo com `understeer` por mais de 200 ms consecutivos — `\|v1Mps − 50 / 3.6\| < 1e-9` (patamar k = 0, que não entra na lista) ou um par `[plateauSpeedMps, maxUndersteerMs]` de `maxUndersteerMsBySpeed` com `\|plateauSpeedMps − v1Mps\| < 1e-9` e `maxUndersteerMs > 200` —, qualquer que seja o `verdict` ou o `failReason` com que a execução da linha de base o julgou (RULE-0002 aplica o fim da varredura só ao novo acerto, e a linha de base só fornece V0); um `v1Mps` que veio do patamar interrompido pela saída (fim natural sem início de subesterço) **não** serve de V0, porque o F-Spec define esse caso só para V1 e deixa o recuo de V0 em aberto — nada é estimado ([ADR-0003](../adr/ADR-0003-linha-de-base-legivel-por-maquina-em-docs-physics.md), decisões 2 e 5); sem igual, `baselineAvailable` falso (RULE-0002, Linha de base). O as-built (`:311`) aceita qualquer `v1Mps` numérico |
| `loadBaselineText()` | `() => string` (`:789-791`) | lê `docs/physics.md` relativo à raiz do repositório; `''` quando ausente; o caminho nunca é impresso |
| `baselineEntry(records, setupId, setupVersion, measuredAtUtc, runtimeId?, parameters?)` | `(BenchRecord[], SetupId, string, string, string?, object?) => Baseline` (`:793-795`) | constrói a entrada do bloco a partir dos registros de uma execução, com os parâmetros |
| `serialize(records, parameters)` | `(readonly BenchRecord[], object) => string` (`:812-820`; `presentation`, `:800-810`) **(muda: linha `#` de `UNDERSTEER_ONSET`)** | uma linha `#` JSON com os parâmetros de ensaio e, por registro, uma linha JSON com os campos de API-0003 e uma linha `#` de apresentação (km/h, s, contagens diagnósticas; ver Serialização) |
| `testPadLane`, `testPadArc` | importados de `src/physics.ts` ([DES-0001](DES-0001-acerto-arcade-assistido-v5-e-assistencias.md)) | `laneEnvironment = testPadLane(BENCH_PARAMETERS.laneWidthM)`; `arcEnvironment = testPadArc(BENCH_PARAMETERS.arcRadiusM, BENCH_PARAMETERS.laneWidthM)` (`:109-110`) |
| `straight(speedMps)` | `(number /* m/s */) => State` (`:147-149`) | "reta a V": `{...initialState(), x: 0, z: 0, heading: 0, vx: 0, vz: V, speed: V}` (o fixture de `tests/physics.test.ts:5`), no eixo da faixa de `testPadLane` |
| `arcEntry(speedMps)` | `(number /* m/s */) => State` (`:151-153`) | entrada do arco: `{...initialState(), x: arcRadiusM, z: 0, heading: 0, vx: 0, vz: V, speed: V}`, tangente ao anel, centro à direita; o esterço para dentro é `+1` (DES-0001, Pista de teste); estado inicial de `REFERENCE_CORNER`, de `UNDERSTEER_ONSET` (no alvo do primeiro patamar) e de `REAR_RECOVERY` |
| `grassEntry(speedMps)` | `(number /* m/s */) => State` (`:156-167`) | entrada na grama da pista sintética: com `p = track[grassEntryIndex]`, `q = track[grassEntryIndex + 1]`, `h = atan2(q.x − p.x, q.z − p.z)` (sentido dos índices crescentes) e `n = (cos h, −sin h)` (esquerda do corpo, `src/physics.ts:122`), o lado de fora é o de `n` quando `n · p > 0` (a pista envolve a origem; no índice 83 é a esquerda) e o de `−n` caso contrário; o kart fica em `p ± n × (WIDTH / 2 + grassEntryOffsetM)` (5,7 m do eixo, já `grass` por `CIRCUIT.surfaceAt`), com `heading` `h` girado `grassEntryAngleRad` para fora (`+` à esquerda, guinada positiva vira à esquerda) e velocidade V. O índice 83 abre o trecho mais reto da pista (raio discreto acima de 190 m dos índices 81 a 102, cerca de 35 m) |
| `wallApproach()` | `() => State` (`:169-171`) | largada da pista sintética com `heading` desviado de `wallApproachRad` |
| `testPilot(config)` | `(KartConfig) => Controller` (`:199-228`) | o piloto de teste — a régua de regressão, a mesma para a linha de base e para o acerto novo: comandos binários decididos a cada `PILOT_DECISION_STEPS` 12 passos (10 Hz) por antecipação sobre `track`, com `maxSpeedMps` 26 e `lateralBudgetMps2` 9,5 como parâmetros de ensaio fixos; não lê o `config` que recebe; exportado pela biblioteca e importado por `TEST_PILOT_LAP`, `DETERMINISM`, `npm test` e por `measureStepCost` em `scripts/keyboard-lap.ts` |
| `testPilotLapWith(options, controller)` | `(BenchOptions, Controller) => TestPilotLapRecord` (`:768-770`) | a volta do piloto de teste com outro controlador (o piloto deslocado dos testes) |
| `makeInput(mode, throttle, brake, steer, drift?)` | `(InputMode, number, number, number, boolean?) => Input` (`:138-145`) | `BINARY` é o teclado (`0`/`1`, `−1`/`0`/`1`); `PROPORTIONAL` é o adaptador de inclinação (número contínuo saturado) |
| `builtInOldRecords()` | `() => unknown[]` (`:567-572`) | dois registros mínimos na forma anterior à feature (um replay e um resultado, sem `setupId`, `setupVersion` nem `replayFormatVersion`), usados por `SETUP_VERSION` quando `options.oldRecords` está ausente |
| `countDifferingMeasures(current, baseline)` | `(BenchRecord[], BenchRecord[]) => number` (`:609-622`) | campos numéricos, booleanos e listas que diferem entre cada registro e o seu par na linha de base (mesmo `benchId`, `benchEnvironment`, `inputMode` e variante), excluídos `measuredAtUtc` e `meanStepCostUs`; par ausente conta 1 |

`scripts/keyboard-lap.ts` (programa de bench, camada Aplicação; importa `testPilot` e as demais funções da
biblioteca, nunca o contrário — o programa não é importável):

| Símbolo | Assinatura | Descrição |
|---|---|---|
| `runtimeId()` | `() => string` (`:16-18`) | `${platform}-${arch}-node${versions.node}-${modelo da CPU}` com `node:os` (ADR-0003); nunca nome de máquina ou de usuário; local ao programa, não exportado |
| `measureStepCost(setup, version)` | `(PublishedSetup, 'current' \| 'previous') => {meanStepCostUs: number}` (`:21-39`) | executa a volta de `TEST_PILOT_LAP` (`startLap`, `COUNTDOWN_STEPS` passos nulos, `testPilot` importado de `scripts/handlingBench.ts`, `stepLap`) com `performance.now()` de `node:perf_hooks` lido antes e depois de cada `stepLap`; local ao programa, não exportado; o tempo medido nunca entra em medida de domínio (I9). **(muda)**: o pedido de `startLap` (`:25`) leva `setupId` e `setupVersion` do acerto e da versão ensaiados |
| argumentos de linha de comando | `--previous`, `--realista` (`:41-44`) | `--previous` roda com `version: 'previous'` (linha de base do Arcade, `arcade-assistido-v4`); `--realista` roda com `setup` `REALISTA_ALUGUEL_4T`; sem argumento, o Arcade corrente. O programa roda `BINARY` e `PROPORTIONAL` e imprime `serialize(records, {...BENCH_PARAMETERS, runtimeId})` (`:53-61`). Sem argumento, lê `baseline` e `realistaBaseline` com `readBaseline(loadBaselineText(), …)`; com `--previous` ou `--realista` (execuções que **produzem** linha de base) não passa `baseline` nem `realistaBaseline` (`:49`): uma linha de base nunca é julgada contra outra, e os seus registros saem com `BASELINE_MISSING` onde a linha de base é exigida |

Toda medida vem de `getHandlingTelemetry` ([DES-0002](DES-0002-telemetria-de-dirigibilidade.md)) ou de
`getLapResult`/`getLapState` (`src/lap.ts`); todo tempo em ms é `toMs(passos)` de `src/lapTiming.ts`
(inteiro exato); toda comparação com limiar converte o limiar para a unidade do campo sem arredondar o
medido (RULE-0002). Os limiares são os do acerto agressivo (`DOMAIN/REF-02`, inalterados nas revisões 3 e
seguintes; `DOMAIN/DEC-12`, `DOMAIN/DEC-13` e `DOMAIN/DEC-14` não mudam nenhum), comparados em ms sobre `toMs`
(`Math.floor((25 × passos + 1) / 3)`): 180 ms não é múltiplo de um passo — `toMs(21)` = 175 é `PASS` e
`toMs(22)` = 183 é `FAIL`, sem arredondar o limiar para 22 passos; 250 ms = 30 passos, 200 ms = 24, 400 ms =
48 (`RECOVERY_MAX_STEPS`), 2 500 ms = 300, 25 000 ms = 3 000. Velocidades: 60 km/h = `60 / 3.6`, 105 km/h =
`105 / 3.6`, 50 km/h = `50 / 3.6` (13,888… m/s), a mesma expressão da condição de forçar em
`src/physics.ts:117`; 1,15 × V0 com V0 = `50 / 3.6` é 15,972 m/s (57,5 km/h).

### Ambientes e `benchEnvironment`

| Ambiente | Construção | `benchEnvironment` | Ensaios |
|---|---|---|---|
| Pista de teste, reta | `testPadLane(WIDTH)` (DES-0001): faixa de 11 m ao longo de z, sem paredes | `TEST_PAD` | `STEER_RESPONSE`, `ACCELERATION`, `TOP_SPEED` |
| Pista de teste, arco | `testPadArc(18, WIDTH)`: anel de raio 18 m e largura 11 m, sem paredes | `TEST_PAD` | `REFERENCE_CORNER`, `UNDERSTEER_ONSET`, `REAR_RECOVERY` |
| Asfalto sem limite | constante `TEST_PAD` de `src/physics.ts:166`: o ambiente da verificação existente de `tests/maneuvers.test.ts:63-67` | `TEST_PAD` | `DRIFT_MANEUVER` |
| Pista sintética | `CIRCUIT` (`src/physics.ts:165`) com `readTrackData(SYNTHETIC_TRACK_FILE)` para a volta | `SYNTHETIC_TRACK` | `GRASS_LOSS`, `WALL_CONTACT`, `TEST_PILOT_LAP`, `STEP_COST` |
| Agregados | um registro **por ambiente**: `NORMAL_DRIVING`, `DETERMINISM` e `REALISTA_UNCHANGED` são emitidos duas vezes, um com `TEST_PAD` (sobre os ensaios da pista de teste) e um com `SYNTHETIC_TRACK` (sobre os da pista sintética); os dois precisam de `PASS` | ambos | — |
| Sem passo de simulação | `SETUP_VERSION` e `STEP_CONTRACT` não avançam a simulação; reportam `TEST_PAD` por convenção (o ambiente neutro, sem dado de pista), para que o campo obrigatório de API-0003 tenha um valor fixo e documentado | `TEST_PAD` | — |

O ambiente dos ensaios `ACCELERATION` e `TOP_SPEED` não é fixado pelos requisitos (lacuna deliberada do
F-Spec): a reta da pista de teste é escolhida porque não tem fim em z e nenhuma parede, e é reportada.

### Definição de cada ensaio (estado inicial, `Input`, medição, veredito)

Acelerador, freio e esterço começam em 0 salvo indicação. `inputMode` `PROPORTIONAL` entrega os mesmos
valores de esterço cheio (1 ou −1) e acelerador que `BINARY`, por um `Input` construído como o adaptador de
inclinação constrói (número contínuo saturado), e acrescenta a variante parcial onde a tabela a nomeia. O
acelerador regulado de `STEER_RESPONSE` e de `UNDERSTEER_ONSET` só assume 0 ou 1 nos dois modos. Cada ensaio
guarda a sua sequência de `Input` e de telemetria (o *traço*), que alimenta `NORMAL_DRIVING` e
`DETERMINISM`. A coluna "`PASS` se" é a ordem em que `judge` decide: o primeiro motivo encontrado é o
`failReason`; uma condição marcada `observed` é a que o ensaio entrega a `judge` no segundo argumento.

| `benchId` | Ambiente, estado inicial e `Input` por passo | Medição | `PASS` se |
|---|---|---|---|
| `STEER_RESPONSE` (variantes: lado +1 e −1; `PROPORTIONAL` acrescenta `steerInputNorm` ±0,5) (`:234-263`, mantido) | `testPadLane(WIDTH)`, `straight(50 / 3.6)`, `handling` `grip`, acerto corrente com `driverMass` 75. **Fase A** (`holdMs` 600 = 72 passos): esterço no valor da variante; acelerador do passo `k` = 1 se `speedMps` do passo `k−1` (ou do estado inicial em `k` = 0) < `targetSpeedMps`, senão 0 (`speedHoldMode` `THROTTLE_REGULATED`; binário por construção; nunca satisfaz a condição de forçar, que exige acelerador 1 **com** velocidade acima de 50 km/h). **Fase B** (até 72 passos): esterço 0 num passo, mesma regulação; termina no primeiro passo com `\|yawRateRadPerS\| <= 0.1 × steady` | `steadyYawRateRadPerS` = média de `\|yawRateRadPerS\|` nos últimos `settleWindowMs` 200 (24 passos: 49 a 72) da fase A — janela curta e estacionária porque a velocidade é mantida; `riseToNinetyPctMs` = `toMs` do primeiro passo da fase A com `\|yawRateRadPerS\| >= 0.9 × steady` (nenhum: `toMs(72)`); `fallToTenPctMs` = `toMs` dos passos da fase B até o primeiro com `\|yawRateRadPerS\| <= 0.1 × steady` (nenhum: `toMs(72)`); `speedMinMps`/`speedMaxMps` = mínimo e máximo de `speedMps` na fase A (esterço aplicado); `understeerStepCount` = passos em `understeer` nas duas fases; `targetSpeedMps`, `speedHoldMode`, `speedHoldBandMps`, `settleWindowMs`, `steerInputNorm` copiados dos parâmetros; `throttleInputNorm` ausente | na ordem: `speedMinMps < targetSpeedMps − speedHoldBandMps` ou `speedMaxMps > targetSpeedMps + speedHoldBandMps` → `FAIL` `SPEED_NOT_HELD` (os tempos não valem); senão `riseToNinetyPctMs <= 180` e `fallToTenPctMs <= 250`; `understeerStepCount` nunca altera o veredito, nem um passo com `surface` `GRASS` (saída da faixa da reta: não é erro nem campo do registro, API-0003; AC-US-0001-05) |
| `REFERENCE_CORNER` (variantes: `THROTTLE_ZERO`, `THROTTLE_FULL`) (`:268` e seguintes em `767508e`; laço `:272-283`) **(muda 5.1.0: janela de medição de `THROTTLE_ZERO`)** | `testPadArc(18, WIDTH)`, `arcEntry(50 / 3.6)`, `grip`; esterço `+1` (para dentro) mantido; acelerador 0 ou 1 mantido; janela `cornerWindowMs` 2 500 (300 passos, ≈ 35 m de arco a 50 km/h). Com `THROTTLE_FULL`, a execução **para no primeiro passo** com `surface` `GRASS` (nenhum critério é medido fora do asfalto). Com `THROTTLE_ZERO`, a execução percorre **os 300 passos da janela** qualquer que seja a posição do kart em relação à faixa — "o arco" é a janela inteira, a saída é reportada, não reprova e não encerra a execução (RULE-0002, Ambientes; REQ-FEAT-0002-09; `DOMAIN/DEC-13`), porque permanecer na faixa enquanto o kart desacelera não é exigido —, mas a **janela de medição** de `maxUndersteerMs` é só a dos passos na faixa de asfalto até a primeira saída: fecha no passo anterior a `offAsphaltFirstStep`, e nenhum passo depois dela entra na medição, esteja o kart na grama ou de volta ao asfalto — escorregar na grama não é sair de frente (REQ-FEAT-0002-01, -09; `DOMAIN/DEC-14` via AC-US-0002-01; API-0003 3.4.0) | `maxUndersteerMs` = `toMs` da maior sequência consecutiva de `understeer` nos passos medidos: com `THROTTLE_FULL`, todos os passos executados; com `THROTTLE_ZERO`, só os passos anteriores ao primeiro com `surface` `GRASS` (todos os 300 quando o kart não sai) — a sequência em curso no passo da saída termina ali. As-built (`767508e`, `:280-281`): a sequência é acumulada em todos os 300 passos com `THROTTLE_ZERO`; a mudança é condicionar a acumulação a "ainda sem saída" (`exit` indefinido), sem outro efeito sobre a execução, o traço ou os demais campos; `offAsphaltStepCount` = com `THROTTLE_FULL` 0 ou 1; com `THROTTLE_ZERO` o número de passos com `surface` `GRASS` na janela inteira (informativo, inalterado por `DEC-14`); `offAsphaltFirstStep` = `simStepCount` do primeiro passo fora da faixa, `offAsphaltFirstXM`/`offAsphaltFirstZM` = `x`/`z` do kart nesse passo (só com `offAsphaltStepCount > 0`); `handling` por passo (em `THROTTLE_FULL`, a contagem de passos em `oversteer`/`sliding` vai para a linha `#` de apresentação, não é campo); `arcRadiusM` 18, `laneWidthM` 11, `entrySpeedMps` 13,89 copiados dos parâmetros | `THROTTLE_FULL`, na ordem: `offAsphaltStepCount > 0` → `FAIL` `OFF_ASPHALT`; senão `maxUndersteerMs <= 200` e nenhum passo em `oversteer`/`sliding` (`observed` `THRESHOLD_EXCEEDED`; REQ-FEAT-0003-02: os passos acima de 50 km/h são `FORCING` por RULE-0001 e a exigência vale neles do mesmo modo); senão `THRESHOLD_EXCEEDED`. `THROTTLE_ZERO`: **só** `maxUndersteerMs <= 200`, senão `THRESHOLD_EXCEEDED`; `offAsphaltStepCount` nunca altera o veredito e `OFF_ASPHALT` nunca é emitido nessa condição (API-0003 3.3.0 e 3.4.0, Erros). Medido pela rodada de código 3 sobre o acerto entregue (`docs/physics.md:253`): saída pelo lado interno no passo 240, 15 passos consecutivos de `understeer` no asfalto imediatamente antes da saída e 61 na grama depois dela — 633 ms na janela inteira (`FAIL`), 125 ms na janela desta versão (`PASS`), sem mudar `ARCADE_ASSISTIDO_V5` |
| `UNDERSTEER_ONSET` (`:318-369`) **(muda: V1 e veredito)** | `testPadArc(18, WIDTH)`, `arcEntry(50 / 3.6)`, `grip`; esterço `+1` (para dentro) mantido; **uma execução contínua** no anel. O patamar `k` (k = 0, 1, 2, …) tem a velocidade-alvo `plateauSpeedMps = 50 / 3.6 + k × entrySpeedStepMps` (0,5 m/s); o acelerador do passo `n` segue `plateauSpeedHoldMode` `THROTTLE_REGULATED`: 1 se `speedMps` do passo `n−1` (ou do estado inicial) < alvo do patamar corrente, senão 0 (0 ou 1 nos dois `inputMode`; acima de 50 km/h, os passos de acelerador 1 são "Forçando" por RULE-0001). Cada patamar tem a **subida** (do fim do patamar anterior até o primeiro passo com `speedMps >= alvo`; vazia em k = 0, que parte do alvo) e a **fase mantida** de `plateauMs` 1 000 (120 passos) a partir desse passo; o patamar está **completo** ao fim da fase mantida dentro da faixa, e então o alvo passa ao patamar seguinte. A varredura termina no **primeiro passo com `surface` `GRASS`**, na subida ou na fase mantida (esse patamar é o **interrompido**, nunca completo; a sua velocidade mantida é o seu alvo `plateauSpeedMps`) ([ADR-0004](../adr/ADR-0004-ensaios-como-biblioteca-e-parametros-de-ensaio.md), decisão 8) | por patamar completo, `maxUndersteerMs` = `toMs` da maior sequência consecutiva de `understeer` na fase mantida; `maxUndersteerMsBySpeed` = pares `[plateauSpeedMps, maxUndersteerMs]` dos patamares completos com `plateauSpeedMps > 50 / 3.6` (k ≥ 1), em ordem crescente, sem o patamar interrompido; **`v1Mps`** (a velocidade de início do subesterço do glossário, nos dois casos de API-0003 3.3.0): o menor `plateauSpeedMps` de patamar completo (k ≥ 0) com `maxUndersteerMs > 200`; quando nenhum patamar completo o teve e a varredura chega ao **fim natural** (saída acima de 50 km/h depois de pelo menos dois patamares completos acima de 50 km/h), o alvo `plateauSpeedMps` do patamar interrompido pela saída (`DOMAIN/DEC-12`; o mesmo valor quer o patamar interrompido tenha reportado `understeer` por mais de 200 ms consecutivos no asfalto, quer não, RULE-0002 "Fim da varredura"); nos desfechos em que a saída reprova (abaixo de 50 km/h; acima com menos de dois pares) `v1Mps` fica **ausente** quando nenhum patamar completo o teve; `offAsphaltStepCount` = 1 e `offAsphaltFirstStep`, `offAsphaltFirstXM`, `offAsphaltFirstZM` = `simStepCount`, `x`, `z` do passo da saída; a velocidade do kart nesse passo (`speedMps` da telemetria) decide o resultado da saída e vai para a linha `#`, não para um campo; `v0Mps` = `v1Mps` do registro `UNDERSTEER_ONSET` da linha de base aceito por `baselineRecord`; `arcRadiusM`, `laneWidthM`, `entrySpeedStepMps` copiados. Para a linha `#` apenas, a maior sequência de `understeer` do patamar interrompido é medida nos seus passos no asfalto (subida e, se começou, fase mantida, até o passo anterior à saída): ela decide só o motivo apresentado, nunca `v1Mps` nem o veredito. **Sem registro** nos dois casos que RULE-0002 não decide: saída com `speedMps` exatamente igual a `50 / 3.6`; fim sem saída da faixa — o patamar de alvo `entrySpeedMaxMps` (o maior que não passa de 25 m/s) completo, ou uma subida que não alcança o alvo (a velocidade deixa de crescer pelo critério de `TOP_SPEED`, ou `topSpeedWindowMs` se esgota): `runBench` lança um `Error` cuja mensagem traz só o `benchId` e o caso | na ordem: saída com `speedMps < 50 / 3.6` → `FAIL` `OFF_ASPHALT` (`observed`), com ou sem `v1Mps`; saída acima de 50 km/h com menos de 2 pares em `maxUndersteerMsBySpeed` → `FAIL` `MEASUREMENT_MISSING` (falta de medida: o único caso desse motivo, API-0003 3.3.0), com ou sem `v1Mps`; fim natural sem `v1Mps` → `judge` lança (registro malformado); sem linha de base igual → `FAIL` `BASELINE_MISSING`, sem julgar nem extrapolar; senão `v1Mps >= 1.15 × v0Mps` e, em `maxUndersteerMsBySpeed`, cada `maxUndersteerMs` não menor que o do par anterior (patamar a patamar, nunca um máximo acumulado), ou `THRESHOLD_EXCEEDED`. A saída acima de 50 km/h com 2 pares ou mais é o fim natural da varredura e não reprova por si (REQ-FEAT-0002-10); o fim natural nunca produz `MEASUREMENT_MISSING`, porque V1 tem valor nos dois casos (RULE-0002, "Fim da varredura"): nunca sair de frente até sair da faixa cumpre o critério quando o alvo do patamar interrompido é ≥ 1,15 × V0 |
| `NORMAL_DRIVING` (um registro por ambiente) (`:525-541`, mantido) | classifica cada passo dos traços com `classifyHandlingSteps` (DES-0001; RULE-0001): `TEST_PAD` agrega `REFERENCE_CORNER` (as duas condições; da execução com `THROTTLE_ZERO`, só os passos no asfalto, como de todo traço), a varredura de `UNDERSTEER_ONSET` (subidas e fases mantidas, até o passo anterior à saída) e `REAR_RECOVERY`; `SYNTHETIC_TRACK` agrega `TEST_PILOT_LAP`; entram no agregado os passos de classe `NORMAL` com `surface` `ASPHALT` | `normalDrivingStepCount` = passos agregados; `excludedRecoveryStepCount` = passos de classe `RECOVERY` no asfalto (até 400 ms após a soltura; os passos além de 400 ms sem `grip` são `NORMAL` e entram); `oversteerOrSlidingStepCount` e `maxSideslipRad` sobre os agregados; passos `FORCING` e `DRIFT` não entram em contagem alguma | `oversteerOrSlidingStepCount = 0` e `maxSideslipRad <= 0.65`; senão `THRESHOLD_EXCEEDED` |
| `REAR_RECOVERY` (`:372-399`, mantido) | `testPadArc(18, WIDTH)`, `arcEntry(forcingSpeedMps)` (16,7 m/s, 60 km/h: acima de 50 km/h, `forcing` verdadeiro desde o primeiro passo), `grip`. **Fase A**: acelerador 1 e esterço `+1` mantidos até o primeiro passo com `handling` `oversteer` ou `sliding` (janela `forcingWindowMs` 3 000). **Fase B** (passo de soltura inclusive): esterço 0, acelerador 1, até o primeiro passo em `grip` ou até 3 000 ms; a execução **para no primeiro passo** com `surface` `GRASS`, em qualquer fase (nada é medido fora do asfalto) | `gripReached` = houve passo em `grip` na fase B; `recoveryMs` = `toMs` dos passos da fase B até o primeiro `grip`, inclusive (presente só com `gripReached`; o passo de soltura é o passo 1); `maxSideslipRad` = máximo de `sideslipRad` nos passos da fase B até o primeiro `grip` (ou em toda a fase B sem `grip`; 0 se a fase B não ocorreu); `offAsphaltStepCount` (0 ou 1), `offAsphaltFirstStep` = `simStepCount` do passo da saída, `offAsphaltFirstXM`/`offAsphaltFirstZM` = `x`/`z` do kart nesse passo; `arcRadiusM`, `laneWidthM` copiados | `offAsphaltStepCount > 0` → `FAIL` `OFF_ASPHALT` (campo; a saída antes da soltura também, porque o passo fora da faixa falha o ensaio, RULE-0002, Ambientes); traseira não solta na fase A → `FAIL` `THRESHOLD_EXCEEDED` com `gripReached` falso (ADR-0004); `gripReached` falso → `THRESHOLD_EXCEEDED` (REQ-FEAT-0003-12); senão `recoveryMs <= 400` e `maxSideslipRad <= 0.65` |
| `DRIFT_MANEUVER` (`:402-410`, mantido) | `TEST_PAD` (constante), `straight(12)`: `{throttle: 1, steer: 0.7, drift: true}` por 240 passos, depois `{throttle: 1, steer: 0}` por 120 — o cenário de `tests/maneuvers.test.ts:68-79` com o acerto corrente | `driftScorePoints` = `maneuvers.score` ao fim | `driftScorePoints > 0` (o teste existente continua rodando com `ARCADE_KART`, intacto) |
| `ACCELERATION` (`:412-429`, mantido) | `testPadLane(WIDTH)`, `straight(0)`, `driverMassKg` 75, acelerador 1 e esterço 0 mantidos | `zeroToSixtyKmhMs` = `toMs` do primeiro passo com `speedMps >= 60 / 3.6` (nenhum em `topSpeedWindowMs`: `toMs` da janela); `driverMassKg` | `<= 2500` |
| `TOP_SPEED` (`:412-429`, mantido) | idem, até a velocidade deixar de crescer (diferença entre passos < 1e-6 m/s por 120 passos, teto `topSpeedWindowMs` 60 s) | `topSpeedMps` | `>= 105 / 3.6` |
| `GRASS_LOSS` (duas execuções) (`:432-446`, mantido) | `CIRCUIT`; execução 1: `grassEntry(topSpeedMps)` com o `topSpeedMps` medido por `TOP_SPEED` nas mesmas opções; execução 2: `grassEntry(50 / 3.6)`; acelerador 1 e esterço 0 por `grassWindowMs` 1 000 (120 passos) | `entrySpeedMps` = velocidade de entrada; `speedAfterOneSMps` = `speedMps` após os 120 passos | precondição: os 120 passos com `surface` `GRASS` e nenhum `wallContact` (senão `FAIL` `THRESHOLD_EXCEEDED` por `observed`: o ensaio não chegou ao estado que mede, ADR-0004); `speedAfterOneSMps <= 0.70 × entrySpeedMps` nas duas |
| `WALL_CONTACT` (`:448-459`, mantido) | `CIRCUIT`, `wallApproach()` com acelerador 1, esterço 0, por `wallWindowMs` 10 s | para cada passo com `wallContact` verdadeiro e `speedMps` do passo anterior > 0: par (`speedBeforeContactMps`, `speedAfterContactMps`) com a velocidade do passo anterior e a do passo seguinte | lista não vazia e `after < before` em 100 % dos pares |
| `DETERMINISM` (um registro por ambiente) (`:543-554`, mantido) | os ensaios do ambiente (salvo `STEP_COST`) e, em `SYNTHETIC_TRACK`, a volta do piloto de teste, executados `runCount` 2 vezes com a mesma sequência de `Input` | `identical` = `deepEqual` dos estados por passo de cada traço e, em `SYNTHETIC_TRACK`, do `LapResult` (tempo total e quatro setores) | `identical`; senão `FAIL` `NON_DETERMINISTIC` |
| `TEST_PILOT_LAP` (`:464-498`) **(muda: pedido da volta)** | `startLap` em `TRAINING` sobre a leitura da pista sintética com o acerto corrente e `driverMass` 75 (`:468`); o pedido leva `setupId` e `setupVersion` do acerto e da versão ensaiados (`setupRef(o)`, `:118`), como toda volta iniciada depois da mudança de API-0002 1.1.0 de `race-lap-validation` ([DES-0003](DES-0003-versao-do-acerto-registros-e-comparabilidade.md)); `COUNTDOWN_STEPS` passos nulos; `testPilot` até `ENDED` ou `MAX_LAP_STEPS` 6 000 | `lapTimeMs` = `lapMs` do `LapResult` (volta `VALID`); volta `INVALID` ou não encerrada: `lapTimeMs` = `toMs(MAX_LAP_STEPS)` = 50 000 (a volta não produziu tempo; o valor é o teto da janela, ADR-0004); `sectorMs` = **sempre 4 inteiros** em ms (`:489-490`): na volta `VALID`, os quatro de `LapResult.sectorMs` (somam `lapTimeMs`); na volta `INVALID` ou não encerrada, os setores concluídos (`completedSectorMs` de `getLapState`, em ordem) seguidos de `toMs(MAX_LAP_STEPS)` = 50 000 para cada setor não concluído, o mesmo teto de janela de `lapTimeMs`; `offAsphaltStepCount` = passos `RUNNING` com `surface` `GRASS`; `offAsphaltFirstStep`, `offAsphaltFirstXM`, `offAsphaltFirstZM` do primeiro; `baselineLapTimeMs` do registro `TEST_PILOT_LAP` da linha de base (`SYNTHETIC_TRACK`) | `offAsphaltStepCount = 0` (senão `OFF_ASPHALT`) e `lapTimeMs <= 25000` (senão `THRESHOLD_EXCEEDED`) |
| `STEP_COST` (só em `bench:handling`) (`:556-565`, mantido) | nenhum estado: `meanStepCostUs` e `runtimeId` chegam em `options.stepCost`, medidos por `measureStepCost` em `scripts/keyboard-lap.ts`; a biblioteca não lê relógio | `meanStepCostUs` recebido; `baselineMeanStepCostUs` do registro `STEP_COST` da entrada com o mesmo `runtimeId` | `meanStepCostUs <= 1.10 × baselineMeanStepCostUs`; sem entrada para este `runtimeId`: `BASELINE_MISSING` |
| `SETUP_VERSION` (`:574-592`, mantido) | leitura de `PUBLISHED_SETUPS` e de `options.oldRecords ?? builtInOldRecords()`: cada registro com `inputs` é lido por `readReplay`; os demais por `compareLapRecords(r, r)` e `resolveSetupRef` | `declaredSetupVersion`, `previousSetupVersion`; `oldRecordsReadCount` = registros recebidos; `oldRecordsReadOkCount` = leituras `READABLE`/sem `INCOMPLETE_RECORD` com `RESOLVED_FROM_ABSENCE` | diferentes; contagens iguais; senão `THRESHOLD_EXCEEDED` |
| `STEP_CONTRACT` (`:595-604`, mantido) | leitura de `STEP`, `SOLVER_SUBSTEPS` e do texto de `src/physics.ts` | `stepUnchanged` = `1 / STEP === 120`; `solverRateUnchanged` = `120 × SOLVER_SUBSTEPS === 480` e a linha de `step` usa `Math.ceil(dt / (STEP / SOLVER_SUBSTEPS))`; `inputFieldsUnchanged` = a linha `export type Input` é literalmente a de `src/physics.ts:8` | os três verdadeiros; senão `CONTRACT_CHANGED` |
| `REALISTA_UNCHANGED` (um registro por ambiente) (`:625-645`, mantido) | todos os ensaios do ambiente com `setupId` `REALISTA_ALUGUEL_4T` (`RENTAL_KART`), em `BINARY` e `PROPORTIONAL`, comparados registro a registro com os da entrada `options.realistaBaseline` do mesmo ambiente; `arcadeAssistActiveCount` = passos com `assistActive` verdadeiro somados nos traços do ambiente | `differingMeasureCount` (`countDifferingMeasures`); `arcadeAssistActiveCount` | sem `realistaBaseline`: `BASELINE_MISSING`; senão 0 e 0, ou `CONTRACT_CHANGED` |

Os ensaios de US-0001 a US-0004 (`STEER_RESPONSE` a `WALL_CONTACT`) rodam com `inputMode` `BINARY` e
`PROPORTIONAL` e precisam de `PASS` nos dois (REQ-FEAT-0006-05). O conjunto de `race-lap-validation` roda na
mesma execução de `npm test` (`tests/*.test.ts`) e continua aprovado porque `src/track.ts`,
`src/trackData.ts`, `ARCADE_KART` e `RENTAL_KART` não mudam e os campos que `src/lap.ts` ganha são opcionais
e ausentes quando o pedido não os traz (REQ-FEAT-0006-07; [DES-0003](DES-0003-versao-do-acerto-registros-e-comparabilidade.md)).

Por que a fase A de `STEER_RESPONSE` dura 600 ms: com a velocidade mantida a 13,9 m/s e a guinada
pedida pelo limite de esterço (`u × tan(limite) / wheelbase`, um teto, porque a guinada real fica abaixo
dela, DES-0001), o kart se desloca lateralmente no máximo cerca de `v × ω × t² / 2` m — a 1,1 rad/s (teto
do acerto entregue), 2,75 m em 0,6 s, dentro dos 5,5 m da meia-faixa; ao soltar, com rumo ≈ 0,6 rad, a
velocidade lateral é ≈ 7,8 m/s e os 2,75 m restantes dão ≈ 0,35 s, mais que os 250 ms do limiar de queda. A janela de regime (400 a 600 ms) é
curta e estacionária porque a velocidade não deriva; o requisito pede 90 % em 180 ms, logo o regime está
atingido bem antes dela. Medido pela rodada de código 2 com esta definição (`docs/physics.md:243`; não é
linha de base deste projeto, e sim o registro da etapa de código): o acerto entregue `arcade-assistido-v5`
sobe em 117 ms e cai em 58 ms com esterço cheio (108 e 50 ms com esterço 0,5), com a velocidade entre
13,84 e 13,94 m/s (dentro de ±0,5); `ARCADE_KART`, 217 ms de subida (o acerto anterior não atende os
180 ms, como os requisitos dizem).

Serialização: `serialize` imprime, por programa de bench, uma linha `# {"parameters": {...}}` com
`BENCH_PARAMETERS` e, em `bench:handling`, `runtimeId` (calculado pelo programa e passado em
`parameters`), e depois, por registro, uma linha JSON com exatamente os campos de API-0003 e uma linha `#`
de apresentação: cada velocidade em m/s também em km/h (`× 3.6`), `zeroToSixtyKmhMs` também em s
(`÷ 1000`), e os diagnósticos que não são campo — em `REFERENCE_CORNER` `THROTTLE_FULL`, a contagem de
passos em `oversteer`/`sliding`; em `UNDERSTEER_ONSET` **(muda)**, a velocidade do kart no passo da saída da
faixa (m/s e km/h), a velocidade-alvo do patamar interrompido, o número de patamares completos e **de onde
`v1Mps` veio**, com um destes três textos: "V1 de patamar completo com subesterço", "V1 do patamar
interrompido pela saída (subesterço iniciado nele)" ou, quando nenhum patamar — completo ou interrompido —
teve `understeer` por mais de 200 ms consecutivos, o motivo que API-0003 manda apresentar ao lado de
`v1Mps`: "sem início de subesterço até a saída da faixa" (apresentação, não campo); em todo `FAIL` por
`observed`, o motivo. Em `npm test`, cada teste imprime o registro por `t.diagnostic`.

## Colaboradores

Chama `step`, `initialState`, `getHandlingTelemetry`, `classifyHandlingSteps`, `RECOVERY_MAX_STEPS`,
`testPadLane`, `testPadArc`, `PUBLISHED_SETUPS`, `TEST_PAD`, `CIRCUIT`, `STEP`, `SOLVER_SUBSTEPS`
(`src/physics.ts`); `startLap`, `stepLap`, `getLapState`, `getLapResult` (`src/lap.ts`); `toMs`,
`COUNTDOWN_STEPS` (`src/lapTiming.ts`); `track`, `nearest`, `WIDTH`, `SYNTHETIC_TRACK_FILE`
(`src/track.ts`); `readTrackData` (`src/trackData.ts`); `readReplay`, `compareLapRecords`,
`resolveSetupRef` (`src/setupRecords.ts`); `node:fs` (ler `docs/physics.md` e o texto de
`src/physics.ts`) (`:5-15`). A biblioteca **não** importa `node:os` nem `node:perf_hooks`: `runtimeId()` e
`measureStepCost` vivem em `scripts/keyboard-lap.ts`, que entrega os valores em `BenchOptions.stepCost`.
É chamada por `scripts/keyboard-lap.ts`, `scripts/physics-bench.ts` e `tests/dirigibilidade-*.test.ts`.
Nunca por `src/`.

## Estado e concorrência

Sem estado entre ensaios: cada `runBench` constrói o seu estado inicial e o seu ambiente. Um ensaio é
função pura do acerto, do ambiente, do estado inicial e da sequência de `Input` (RULE-0002); no
`STEER_RESPONSE` e no `UNDERSTEER_ONSET` o acelerador de cada passo é função determinística da telemetria do
passo anterior e do alvo corrente (que só muda ao fim de uma fase mantida, contada em passos), logo
a sequência de `Input` resultante é a mesma em toda execução; repetir produz registros idênticos exceto
`measuredAtUtc` (do chamador) e `meanStepCostUs`. Não há chave: nada é escrito. O registro em
`docs/physics.md` é feito pelo desenvolvedor na etapa de código, com a data, para a linha de base
(`--previous`, `--realista`) e para o acerto novo, antes e depois da mudança de parâmetros
(REQ-FEAT-0006-08). Cada rodada de presets do ciclo em staging (`DOMAIN/DEC-10`, FLOW-0002) repete todos os
ensaios desta tabela, nos mesmos ambientes e contra os mesmos limiares, como nova `setupVersion`
([ADR-0001](../adr/ADR-0001-versao-do-acerto-como-registro-novo-no-codigo.md)), e acrescenta a sua entrada
datada; nenhum ensaio, limiar ou preset experimental é acrescentado por rodada.

## Comportamento em falha

| Situação | Resultado |
|---|---|
| `docs/physics.md` ausente ou sem bloco | `readBaseline` devolve `undefined`; `baselineAvailable` falso; `UNDERSTEER_ONSET`, `STEP_COST` e `REALISTA_UNCHANGED` dão `FAIL` `BASELINE_MISSING` (em `UNDERSTEER_ONSET`, salvo quando a saída da faixa já reprova por si, motivo que vem antes na ordem); os demais ensaios não dependem dela |
| entrada da linha de base de outro ambiente, outro `arcRadiusM` ou outro `laneWidthM`; em `UNDERSTEER_ONSET`, registro sem `v1Mps`, registro cujo `v1Mps` veio do patamar interrompido (sem patamar completo com `understeer` acima de 200 ms), ou entrada sem os mesmos `plateauMs`/`plateauSpeedHoldMode`/`entrySpeedStepMps` | `baselineRecord` não a aceita; idem `BASELINE_MISSING` (uma linha de base medida na pista sintética, ou por velocidades de entrada, não serve para a varredura em patamares no arco; um V0 nunca é tirado de uma velocidade em que a linha de base não reportou subesterço) |
| bloco JSON corrompido | idem (`JSON.parse` em `try`); o arquivo não é alterado |
| velocidade não mantida em `STEER_RESPONSE` | `FAIL` `SPEED_NOT_HELD` com `speedMinMps`/`speedMaxMps`; os tempos ficam no registro mas não valem como veredito |
| kart fora da faixa durante `STEER_RESPONSE` | sem efeito no veredito nem campo no registro (API-0003; AC-US-0001-05) |
| precondição de `GRASS_LOSS` não atingida | `FAIL` `THRESHOLD_EXCEEDED` por `observed` (ensaio que não chegou ao estado que mede) |
| kart fora da faixa em `REFERENCE_CORNER` com `THROTTLE_FULL` ou em `REAR_RECOVERY`; piloto de teste fora do asfalto | `FAIL` `OFF_ASPHALT` pelos campos, com `offAsphaltFirstStep` e posição |
| kart fora da faixa em `REFERENCE_CORNER` com `THROTTLE_ZERO` | a execução continua até o fim da janela; `offAsphaltStepCount`, `offAsphaltFirstStep` e posição reportados; o veredito é só o de `maxUndersteerMs`, medido só nos passos na faixa até essa primeira saída — os passos depois dela, na grama ou de volta ao asfalto, não entram (REQ-FEAT-0002-09; `DOMAIN/DEC-13`, `DOMAIN/DEC-14`) |
| kart sai da faixa na varredura de `UNDERSTEER_ONSET` | encerra a varredura, com `offAsphaltStepCount` 1, passo e posição; abaixo de 50 km/h no passo da saída: `FAIL` `OFF_ASPHALT` (por `observed`); acima de 50 km/h com menos de 2 patamares completos acima de 50 km/h: `FAIL` `MEASUREMENT_MISSING`; acima com 2 ou mais: fim natural, sem reprovar pela saída, com `v1Mps` sempre presente — o menor patamar completo com `understeer` acima de 200 ms ou, sem nenhum, o alvo do patamar interrompido — e o veredito de linha de base, V1 ≥ 1,15 × V0 e não diminuição; o patamar interrompido nunca entra em `maxUndersteerMsBySpeed` |
| `UNDERSTEER_ONSET` com resultado que RULE-0002 não decide: saída exatamente a 50 km/h; varredura sem saída da faixa (último patamar completo, ou subida que não alcança o alvo) | a biblioteca lança (`runBench`, e `judge` diante de um registro sem saída); nenhum registro é emitido; `npm test` e o bench falham com o erro, que traz só o `benchId` e o caso; cabe ao autor decidir o caso (lacuna deliberada do F-Spec) |
| registro `UNDERSTEER_ONSET` de fim natural sem `v1Mps` entregue a `judge` | `judge` lança (registro malformado: `v1Mps` é obrigatório no fim natural, API-0003 3.3.0); a biblioteca nunca o produz |
| piloto de teste não termina em `MAX_LAP_STEPS`, ou volta invalidada | `TEST_PILOT_LAP` `FAIL` `THRESHOLD_EXCEEDED` com `lapTimeMs` = `toMs(6000)` e cada setor não concluído com `toMs(6000)` em `sectorMs`, que segue com 4 elementos |
| traseira não solta em `REAR_RECOVERY`; `grip` não alcançado | `FAIL` `THRESHOLD_EXCEEDED`, `gripReached` falso, `recoveryMs` ausente |
| `WALL_CONTACT` sem contato | `FAIL` `THRESHOLD_EXCEEDED`, `contacts` vazia |
| execuções diferentes | `DETERMINISM` `FAIL` `NON_DETERMINISTIC`; nunca tolerância |
| leitura da pista sintética não `COMPLETE` em `TEST_PILOT_LAP` | a biblioteca lança (`:467`): é defeito do repositório, não resultado de ensaio |

Sem rede, sem tempo-limite. Registro em log: só a saída serializada (identificadores, campos de API-0003,
parâmetros e `runtimeId`); nunca caminho de arquivo, nome de máquina ou de usuário.

## Observabilidade

Cada limiar tem o seu campo e cada falha o seu `failReason`; `docs/physics.md` guarda a série datada, por
ambiente, que mostra uma regressão entre entregas (NFR-0004). `STEP_COST` é a métrica de NFR-0002;
`DETERMINISM` a de NFR-0001; `REALISTA_UNCHANGED` a de NFR-0007; o conjunto de `race-lap-validation` verde
a de NFR-0008; `speedMinMps`/`speedMaxMps` a da condição de velocidade mantida; em `UNDERSTEER_ONSET`, a
linha `#` diz de onde `v1Mps` veio, de modo que um acerto que passa sem nunca sair de frente é
distinguível de um que sai de frente num patamar completo; em `REFERENCE_CORNER` com `THROTTLE_ZERO`,
`offAsphaltFirstStep` é o passo em que a janela de `maxUndersteerMs` fechou, e `offAsphaltStepCount` diz
quantos passos da janela ficaram fora da medição.

## Determinismo (D-DS-07)

A biblioteca avança a simulação só com `STEP` e nunca lê relógio: não importa `node:perf_hooks` nem
`node:os` e não contém `Date` nem `performance`; `measuredAtUtc` e `stepCost` vêm do chamador, e só
`scripts/keyboard-lap.ts` (camada Aplicação) lê `performance.now()`, em `measureStepCost`, cujo valor nunca
entra em medida de domínio (I9). O acelerador regulado é função da telemetria do passo anterior. Provas:
`DETERMINISM` por ambiente em `tests/dirigibilidade-test-pilot.test.ts`;
`tests/dirigibilidade-contract.test.ts` afirma a ausência desses símbolos em `scripts/handlingBench.ts`.

## Feature flag

Nenhuma: não é comportamento de usuário. `--previous`, `--realista`, `version` e `setup` são argumentos dos
programas de bench para produzir a linha de base, reportados na saída, não configuração do jogo nem gancho
de teste; `speedHoldMode`, `speedHoldBandMps`, `settleWindowMs`, `arcRadiusM`, `laneWidthM`,
`entrySpeedStepMps`, `plateauMs`, `plateauSpeedHoldMode` e os demais são parâmetros de ensaio fixados e
reportados, não limiares nem configuração.

## Pontos em aberto

Nenhum.
