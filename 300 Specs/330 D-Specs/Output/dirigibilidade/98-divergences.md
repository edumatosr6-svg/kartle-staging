---
title: Divergências — dirigibilidade do Arcade assistido
feature: dirigibilidade
stage: dspec
status: validated
version: 3.0.0
sources: []
---

# Divergências

Registro durável dos requisitos deste conjunto que o sistema em execução não satisfaz (conventions §6). O
F-Spec (3.3.0) é normativo: nenhuma linha abaixo enfraquece um requisito. Cada linha cita o que existe hoje
em `arquivo:linha` — a árvore depois da rodada de código 2 (commit `0068a57`), que implementou o projeto
validado em `dspec-validation-20261022-1615` —, a etapa que deve a mudança e o item de projeto que a fecha.
Caminhos relativos à raiz do repositório.

## Linhas abertas

| Requisito | O que exige | O que o sistema faz hoje | Etapa devedora | Item de projeto | Estado |
|---|---|---|---|---|---|
| REQ-FEAT-0002-04, -05, -07, -10 | V1 definida em todo fim natural da varredura de `UNDERSTEER_ONSET`: a menor velocidade de patamar completo com `understeer` acima de 200 ms consecutivos ou, sem nenhum, a velocidade mantida do patamar interrompido pela saída (`v1Mps` reportado nos dois casos, com o motivo "sem início de subesterço até a saída da faixa" apresentado ao lado no segundo); `MEASUREMENT_MISSING` só pela saída acima de 50 km/h antes do segundo patamar completo; V0 só de um patamar completo com subesterço da linha de base (`BASELINE_MISSING` sem isso) | `scripts/handlingBench.ts:344` toma V1 só de patamar completo e `:355` deixa `v1Mps` ausente sem um; `:672` (`judge`) reprova o fim natural sem `v1Mps` com `MEASUREMENT_MISSING` (o caso (b) de API-0003 3.2.0, retirado na 3.3.0); `:363-367` imprime `v1Measured` em vez do motivo; `:311` aceita como V0 qualquer `v1Mps` numérico. Medido pela rodada de código 2 (`docs/physics.md:252`; bloco `handling-baseline`, entrada `arcade-assistido-v5`): 7 patamares completos acima de 50 km/h (51,8 a 62,6 km/h) com 0 ms de `understeer`, saída a 56,1 km/h no passo 2 114, `v1Mps` ausente, `FAIL` `MEASUREMENT_MISSING`; pelo projeto, V1 = 17,89 m/s (64,4 km/h, alvo do patamar interrompido) ≥ 1,15 × 13,89 m/s, fim natural | código | DES-0004, ADR-0003, ADR-0004, DM-0001 | open |
| REQ-FEAT-0002-01, -03, -09 | `REFERENCE_CORNER` com `THROTTLE_ZERO`: a execução percorre os 300 passos da janela esteja o kart onde estiver; `maxUndersteerMs` ≤ 200 é o único critério, medido dentro e fora da faixa; `offAsphaltStepCount` (passos fora da faixa), `offAsphaltFirstStep` e posição reportados sem reprovar; `OFF_ASPHALT` só com `THROTTLE_FULL` | `scripts/handlingBench.ts:273` interrompe a execução no primeiro passo `GRASS` nas duas condições de acelerador, e `:663` (`judge`) reprova com `OFF_ASPHALT` nas duas. Medido pela rodada de código 2 (`docs/physics.md:244`): com acelerador 0 o acerto entregue reporta `understeer` por 125 ms e sai da faixa pelo lado interno no passo 240 de 300, `FAIL` `OFF_ASPHALT`; pelo projeto a saída é reportada e só os 125 ms (e os passos restantes da janela) são julgados | código | DES-0004, ADR-0004, ADR-0005 | open |
| REQ-FEAT-0005-05, -06, -08 com API-0002 (FB-01 de `race-lap-validation`: API-0001 e API-0002 1.1.0 daquela feature) | o pedido `startLap` aceita `setupId` e `setupVersion`, a sessão os guarda e `getLapResult` os devolve copiados sem interpretação, ausentes quando o pedido não os traz; `buildLapRecord` preenche só o que o resultado não traz; toda volta iniciada por esta feature informa os dois campos | `src/lap.ts:23` (`LapRequest` só com `challengeNumber`), `:25-46` e `:48-58` (`LapSession` e `LapResult` sem os dois campos), `:117` e `:270` (só `challengeNumber` é copiado); `src/setupRecords.ts:91-93` (`buildLapRecord` sobrescreve com `setup`), `:108-112` (`replayLap` pede a volta sem os campos); `src/main.ts:226` (`beginLap` chama `startLap` sem os campos); `scripts/handlingBench.ts:468` e `scripts/keyboard-lap.ts:25` (voltas de ensaio sem os campos). Linha assumida do registro de `race-lap-validation` (`98-divergences.md` daquela feature, rodada de 2026-10-22), que a declarou devida ao código desta feature | código (desta feature) | DES-0003, DES-0007, DM-0001, ADR-0002 | open |
| REQ-FEAT-0005-07, REQ-FEAT-0006-03 e a prova em `npm test` de todo ensaio (REQ-FEAT-0001-06, REQ-FEAT-0002-06, REQ-FEAT-0003-07, REQ-FEAT-0004-07, REQ-FEAT-0006-04, -05 nomeiam "a saída de `npm test` ou dos benches"; AC-US-0004-06 e AC-US-0005-05 exigem o roteiro registrado) | `STEP_CONTRACT`, `REALISTA_UNCHANGED`, `DETERMINISM` e os demais registros na saída de `npm test`; `docs/handling-device-log.md` com o roteiro E2E registrado | a biblioteca produz todos os registros (`scripts/handlingBench.ts:729-765`) e os benches os imprimem (`scripts/keyboard-lap.ts:41-61`, `scripts/physics-bench.ts:40-47`), mas não existe `tests/dirigibilidade-*.test.ts` nem `tests/fixtures/records.ts` (`tests/` tem só `physics`, `maneuvers` e `race-lap-validation-*`), logo `npm test` não contém registro algum; `docs/handling-device-log.md` não existe | testes ([test-strategy](test-strategy.md)) | DES-0004, test-strategy | open |

## Linhas resolvidas pela rodada de código 2 (commit `0068a57`)

| Requisito | O que exige | O que resolveu (`arquivo:linha` de hoje) | Estado |
|---|---|---|---|
| REQ-FEAT-0001-01 a -04, -06, -09 | resposta do volante em reta da pista de teste com a velocidade mantida em 50 km/h, regime estacionário, `benchEnvironment`, `speedMinMps`/`speedMaxMps`, `speedHoldMode`, `SPEED_NOT_HELD` | `scripts/handlingBench.ts:234-263` (reta `testPadLane`, acelerador regulado `:127`, janela de 200 ms), `:656-658` (`SPEED_NOT_HELD`); `src/physics.ts:170-172`; medido: 117/58 ms com esterço cheio, 108/50 ms com 0,5, velocidade entre 13,84 e 13,94 m/s (`docs/physics.md:243`) | resolved |
| REQ-FEAT-0002-02, -06; REQ-FEAT-0002-01, -03, -09 com `THROTTLE_FULL` | curva de referência no arco de raio 18 m da pista de teste; `arcRadiusM`, `laneWidthM`, `benchEnvironment`; `OFF_ASPHALT` com passo e posição com acelerador cheio | `scripts/handlingBench.ts:266-286`, `:151-153` (`arcEntry`), `:662-665`; `src/physics.ts:173-178`; medido com acelerador cheio: 0 ms de `understeer`, 0 `oversteer`/`sliding`, na faixa (`docs/physics.md:245`). A condição com acelerador 0 está na linha aberta acima | resolved |
| REQ-FEAT-0003-01, -03, -06, -08, -12 | condução normal exclui a recuperação (classe própria, até 400 ms); `normalDrivingStepCount`, `excludedRecoveryStepCount`; passos além de 400 ms sem `grip` entram e falham | `src/physics.ts:363-385` (`classifyHandlingSteps`, `RECOVERY_MAX_STEPS`); `scripts/handlingBench.ts:525-541`; medido: 0 `oversteer`, deriva 0,054/0,059 rad, 1 passo de recuperação excluído (`docs/physics.md:247`) | resolved |
| REQ-FEAT-0003-02 | na curva de referência com acelerador cheio, só `grip` ou `understeer` em todos os passos, inclusive os acima de 50 km/h | `src/physics.ts:46`, `:192-195`, `:208`, `:328`, `:336` (`forcingRampMps` 2,4 m/s com escala 0,67, `:81-82`); `scripts/handlingBench.ts:283-285` (`observed` `THRESHOLD_EXCEEDED`); medido: 0 passos em `oversteer`/`sliding` (`docs/physics.md:245`) | resolved |
| REQ-FEAT-0003-04, -05, -09, -11 | recuperação no arco da pista de teste, `gripReached`, `recoveryMs` condicional, `OFF_ASPHALT` na saída da faixa com `offAsphaltStepCount`, passo e posição | `scripts/handlingBench.ts:372-399`, `:680-682`; medido: `grip` em 8 ms, deriva 0,064 rad, na faixa (`docs/physics.md:248`) | resolved |
| REQ-FEAT-0004-01, -02 | 0–60 km/h em ≤ 2,5 s; ≥ 105 km/h estabilizada, com `benchEnvironment` reportado | `scripts/handlingBench.ts:412-429` (reta `testPadLane`); `src/physics.ts:75` (`enginePower` 26 500 W, `driveForce` 2 420 N, `governorSpeed` 31,5 m/s); medido: 2 383 ms e 30,61 m/s (`docs/physics.md:250-251`) | resolved |
| REQ-FEAT-0004-03, -04, -08 | ≤ 70 % da velocidade de entrada após 1 s na grama da pista sintética | `scripts/handlingBench.ts:156-167` (`grassEntry`), `:432-446`; `src/physics.ts:275` (`grassSpeedLossPerS` 0,7, `:81`); medido: 48 % e 55 % (`docs/physics.md:253`) | resolved |
| REQ-FEAT-0004-05 | contato com a parede reportado e medido em 100 % dos contatos, com `benchEnvironment` | `src/physics.ts:299-312`; `scripts/handlingBench.ts:448-459`; `scripts/physics-bench.ts:40-47`; medido: 820 contatos, depois < antes em 100 % (`docs/physics.md:254`) | resolved |
| REQ-FEAT-0004-06, -09 | HUD lido pelo contrato API-0001 | `src/main.ts:502-508` (`getHandlingTelemetry(state, setupRef)`); `src/physics.ts:351-360` | resolved |
| REQ-FEAT-0004-07, REQ-FEAT-0001-06, REQ-FEAT-0002-06, REQ-FEAT-0003-07, -08, REQ-FEAT-0006-05 (nos benches) | registros por `benchId` na saída dos benches, em `BINARY` e `PROPORTIONAL`, com `benchEnvironment`; `driftScorePoints` | `scripts/handlingBench.ts:59-91` (tipos), `:729-765`; `scripts/keyboard-lap.ts:41-61` (`BINARY` e `PROPORTIONAL`, `serialize`); `scripts/physics-bench.ts:40-47`; `driftScorePoints` em `:76`. A prova em `npm test` está na linha aberta acima | resolved |
| REQ-FEAT-0005-05, -06, -08, -10 e API-0002 (aplicação e leitores) | aplicação com o acerto publicado; comparação só `COMPARABLE`; registros antigos lidos; texto compartilhado | `src/setupRecords.ts:39-127`; `src/main.ts:2-4`, `:122`, `:158-160`, `:217-222` (`renderBest`), `:247-260` (seletor), `:272-279` (compartilhar), `:387-388`, `:426-438` (`LapRecord` e melhor tempo); `index.html:25`; `src/handlingMessages.ts:1-14`. A parte do FB-01 está na linha aberta acima | resolved |
| REQ-FEAT-0005-01 a -04, -11, -12 | `DETERMINISM` por ambiente e `TEST_PILOT_LAP` (`SYNTHETIC_TRACK`, ≤ 25 000 ms, 0 passos fora do asfalto, `sectorMs` com 4 inteiros) na saída de `npm run bench:handling` | `scripts/handlingBench.ts:464-498`, `:543-554`; `scripts/keyboard-lap.ts:11`, `:59`; medido: 21 340 ms, 0 passos fora do asfalto, execuções idênticas (`docs/physics.md:255-257`) | resolved |
| REQ-FEAT-0005-07, REQ-FEAT-0006-03 (biblioteca e benches) | `STEP_CONTRACT` | `src/physics.ts:84`, `:321`; `scripts/handlingBench.ts:594-604`; medido: os três booleanos verdadeiros (`docs/physics.md:259`). Em `npm test`: linha aberta acima | resolved |
| REQ-FEAT-0006-04 | `REALISTA_UNCHANGED` com 0 medidas diferentes e 0 assistências, por ambiente | `scripts/handlingBench.ts:625-645`; entrada `realista-aluguel-4t-v4` no bloco de `docs/physics.md`; medido: 0 e 0 (`docs/physics.md:260`) | resolved |
| REQ-FEAT-0006-06, -09 | `STEP_COST` ≤ 1,10 × linha de base da mesma máquina e runtime | `scripts/keyboard-lap.ts:16-39` (`runtimeId`, `measureStepCost`); `scripts/handlingBench.ts:556-565`; medido: 196,1 µs contra 203,3 µs (`docs/physics.md:256`) | resolved |
| REQ-FEAT-0006-08 | entrada datada em `docs/physics.md` por `setupVersion`, com ambiente, parâmetros e os campos de API-0003 para linha de base e acerto novo | `docs/physics.md:196-262` (prosa datada) e `:265-412` (bloco com três entradas, `parameters` e `runtimeId`) | resolved |

Satisfeitos desde antes, sem divergência, e protegidos pelo projeto: saturação do `Input` na faixa
(REQ-FEAT-0001-07: `src/physics.ts:119`, `:204`, `:212-213`; `src/main.ts:314`); condição de forçar e
telemetria por passo de API-0001 (`src/physics.ts:117-120`, `:314-316`, `:341`, `:351-360`), com `surface`
inicial `asphalt` literal (`:105`); dado publicado e versão anterior intacta (REQ-FEAT-0005-09:
`PUBLISHED_SETUPS` em `:92-100`, `ARCADE_KART` em `:61-68`, ADR-0001); tempo simulado sem contar a
suspensão (REQ-FEAT-0001-08, REQ-FEAT-0002-08, REQ-FEAT-0003-11: `src/lap.ts:173` devolve a sessão fora de
`RUNNING`); regras de pilotagem só na simulação e simulação sem DOM (REQ-FEAT-0003-10, REQ-FEAT-0006-01,
-02: `tests/race-lap-validation-layering.test.ts`); grama e parede não invalidam a volta por si
(REQ-FEAT-0004-10: `src/lap.ts` só corta por distância e duração); conjunto de `race-lap-validation`
aprovado (REQ-FEAT-0006-07: `npm test` 170/170 na rodada de código 2; os campos opcionais que `src/lap.ts`
ganha pela linha aberta do FB-01 ficam ausentes nas voltas iniciadas sem eles, e `CHK-TEST-0012-02`
continua verde). Os valores do acerto `arcade-assistido-v5` são escolha da etapa de código pelos ensaios na
pista de teste; as medidas citadas nas linhas acima são as da rodada de código 2, registradas em
`docs/physics.md` pela etapa de código — nenhuma é linha de base deste projeto, e a entrada
`arcade-assistido-v5` é refeita pela rodada seguinte sob os vereditos deste projeto.
