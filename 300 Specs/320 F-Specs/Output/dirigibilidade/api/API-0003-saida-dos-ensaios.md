---
id: API-0003
title: Contrato da saída dos ensaios de dirigibilidade
feature: dirigibilidade
stage: fspec
status: validated
version: 4.0.1
sources: [US-0001, US-0002, US-0003, US-0004, US-0005, NFR-0001, NFR-0002, NFR-0003, NFR-0004, NFR-0006, NFR-0007, NFR-0009, AC-US-0001-05, AC-US-0001-06, AC-US-0002-05, AC-US-0002-07, AC-US-0002-08, AC-US-0002-09, AC-US-0003-03, AC-US-0003-07, AC-US-0003-08, AC-US-0003-10, AC-US-0004-02, AC-US-0004-07, AC-US-0005-01, AC-US-0005-02, AC-US-0005-03, AC-US-0005-04, AC-US-0005-06]
---

# API-0003 — Contrato da saída dos ensaios de dirigibilidade

Contrato do que a saída de `npm test`, de `npm run bench:handling` e do bench de física contém para cada
ensaio de [RULE-0002](../rules/RULE-0002-ensaios-e-limiares.md): os critérios dos requisitos nomeiam essa
saída como ponto de observação, e este contrato fixa os campos, as unidades e o veredito. A forma de
serialização (linhas de texto ou JSON) é decisão de projeto; os nomes e as unidades abaixo são contrato.
Nomes em `camelCase` plano com a unidade SI no sufixo (D-FS-06): velocidades em m/s (`...Mps`), tempos em
milissegundos (`...Ms`), comprimentos em metros (`...M`), ângulos em radianos (`...Rad`), como na
telemetria ([API-0001](API-0001-telemetria-de-dirigibilidade.md)). Os critérios de US-0001, US-0002,
US-0003 e US-0004 nomeiam km/h, s e graus como ponto de observação (AC-US-0001-06, AC-US-0002-05,
AC-US-0003-07, AC-US-0004-07): a saída serializada e `docs/physics.md` **apresentam** cada velocidade
também convertida em km/h (valor × 3,6), o tempo de 0–60 km/h também em s (valor ÷ 1000) e o giro também
em graus (valor × 180/π) ao lado do campo SI; a apresentação não é campo do contrato e não altera o nome
nem a unidade do campo. Cada linha abaixo diz a unidade do campo.

## Operações

| Operação | Propósito | Quem chama |
|---|---|---|
| `handlingBenchReport` | Produz um registro por ensaio executado e por variante | `npm test`, `npm run bench:handling`, bench de física |

## Auth

Sem sessão; executado localmente pelo desenvolvedor ou pela integração. Não é exposto ao Jogador; não há
papel, porque não há acesso em tempo de execução do jogo. Público no repositório porque não contém segredo
nem dado pessoal (I6).

## Registro por ensaio

| Campo | Tipo | Unidade | Obrigatório | Padrão e restrições |
|---|---|---|---|---|
| `benchId` | enum (ver glossário) | — | sim | um registro por ensaio e por variante (`inputMode`, lado do esterço, velocidade de partida, sequência) |
| `benchEnvironment` | enum `TEST_PAD`, `SYNTHETIC_TRACK` | — | sim | ambiente em que o ensaio rodou ([RULE-0002](../rules/RULE-0002-ensaios-e-limiares.md), Ambientes); `TEST_PAD` para `STEER_RESPONSE`, `CORNER_RADIUS`, `CORNER_TURN` e `REAR_RECOVERY`; `SYNTHETIC_TRACK` para `TEST_PILOT_LAP`, `NORMAL_DRIVING`, `GRASS_LOSS`, `WALL_CONTACT` e `STEP_COST`; em `DRIFT_INERT`, o da sequência comparada; reportado para os demais (`SEED/RD-06`) |
| `setupId` | enum `ARCADE_ASSISTIDO`, `REALISTA_ALUGUEL_4T` | — | sim | |
| `setupVersion` | texto | — | sim | versão corrente do acerto ensaiado |
| `inputMode` | enum `BINARY`, `PROPORTIONAL` | — | sim | forma do `Input` (NFR-0003) |
| `verdict` | enum `PASS`, `FAIL` | — | sim | |
| `failReason` | enum `THRESHOLD_EXCEEDED`, `BASELINE_MISSING`, `OFF_ASPHALT`, `NON_DETERMINISTIC`, `CONTRACT_CHANGED`, `SPEED_NOT_HELD`, `MEASUREMENT_MISSING`, `TEST_AREA_EXCEEDED` | — | só com `FAIL` | ausente com `PASS` |
| `measuredAtUtc` | texto (data e hora UTC) | — | sim | data da execução, para `docs/physics.md` (NFR-0004); nunca entra em nenhuma medição |
| `baselineAvailable` | booleano | — | sim | `true` quando a linha de base do ensaio está registrada no mesmo ensaio e no mesmo ambiente (e, em `STEP_COST`, na mesma máquina e runtime) |

## Campos comuns aos ensaios na pista de teste aberta (`benchEnvironment` `TEST_PAD`)

| Campo | Tipo | Unidade | Obrigatório | Restrições |
|---|---|---|---|---|
| `testAreaRadiusM` | número | m | sim | raio do disco de asfalto declarado pelo ensaio, centrado no ponto de partida; parâmetro de ensaio ([RULE-0002](../rules/RULE-0002-ensaios-e-limiares.md), Ambientes) |
| `offAsphaltStepCount` | inteiro | passos | sim | passos fora da área declarada; 0 para `PASS`; maior que 0 é `FAIL` com `TEST_AREA_EXCEEDED` (US-0002, caso anormal "Kart fora da área do ensaio") |
| `offAsphaltFirstStep` | inteiro | passos | só com `offAsphaltStepCount` > 0 | primeiro passo fora da área declarada |
| `offAsphaltFirstXM`, `offAsphaltFirstZM` | número | m | só com `offAsphaltStepCount` > 0 | posição desse passo |

## Campos medidos por `benchId`

| `benchId` | Campo | Tipo | Unidade | Obrigatório | Restrições |
|---|---|---|---|---|---|
| `STEER_RESPONSE` | `steerInputNorm` | número | normalizado (faixa de `Input`) | sim | 1, −1 ou valor entre 0 e 1 exclusive (parcial, `PROPORTIONAL`) |
| `STEER_RESPONSE` | `targetSpeedMps` | número | m/s | sim | 13,89 (50 km/h, `DOMAIN/DEC-01`); apresentado também em km/h |
| `STEER_RESPONSE` | `speedHoldMode` | enum `THROTTLE_CONSTANT`, `THROTTLE_REGULATED` | — | sim | modo de manter a velocidade em 50 km/h pelo acelerador (`DOMAIN/REF-03`); parâmetro de ensaio |
| `STEER_RESPONSE` | `throttleInputNorm` | número | normalizado | só com `speedHoldMode` `THROTTLE_CONSTANT` | acelerador constante mantido durante o ensaio; parâmetro de ensaio; ausente em `THROTTLE_REGULATED`, em que o acelerador de cada passo é escolhido pelo ensaio |
| `STEER_RESPONSE` | `speedHoldBandMps` | número | m/s | sim | meia-largura da faixa tolerada em torno de `targetSpeedMps`; parâmetro de ensaio |
| `STEER_RESPONSE` | `speedMinMps`, `speedMaxMps` | número | m/s | sim | velocidade mínima e máxima observadas enquanto o esterço está aplicado (AC-US-0001-06, prova de velocidade mantida); apresentadas também em km/h; fora de `targetSpeedMps` ± `speedHoldBandMps` o veredito é `FAIL` com `SPEED_NOT_HELD` |
| `STEER_RESPONSE` | `riseToNinetyPctMs` | inteiro | ms | sim | tempo simulado de 0 a 90 % do regime (AC-US-0001-06) |
| `STEER_RESPONSE` | `fallToTenPctMs` | inteiro | ms | sim | tempo simulado do regime a 10 % (AC-US-0001-06) |
| `STEER_RESPONSE` | `settleWindowMs` | inteiro | ms | sim | janela curta e estacionária usada para medir o regime (AC-US-0001-06); parâmetro de ensaio |
| `STEER_RESPONSE` | `steadyYawRateRadPerS` | número | rad/s | sim | regime medido na janela, em módulo, com a velocidade mantida (AC-US-0001-06) |
| `STEER_RESPONSE` | `understeerStepCount` | inteiro | passos | sim | passos em `understeer` durante o ensaio; informativo, não altera `verdict` (AC-US-0001-05) |
| `CORNER_RADIUS` | `steerInputNorm` | número | normalizado | sim | 1 ou −1: o lado ensaiado (AC-US-0002-07, AC-US-0002-08) |
| `CORNER_RADIUS` | `entrySpeedMps` | número | m/s | sim | velocidade de partida: 13,89 (50 km/h) ou 19,44 (70 km/h); apresentada também em km/h (AC-US-0002-05) |
| `CORNER_RADIUS` | `radiusWindowMs` | inteiro | ms | sim | duração da janela de medição do raio, centrada no instante 3 s depois da partida; parâmetro de ensaio (AC-US-0002-05) |
| `CORNER_RADIUS` | `pathRadiusAt3sM` | número | m | só sem `stoppedAtStep` | raio da trajetória 3 s depois da partida ([RULE-0002](../rules/RULE-0002-ensaios-e-limiares.md), Medidas da curva de referência); ≤ 13 para `PASS` (AC-US-0002-07, AC-US-0002-08) |
| `CORNER_RADIUS` | `speedAt3sMps` | número | m/s | sim | velocidade 3 s depois da partida; 0 quando o kart parou antes; apresentada também em km/h (AC-US-0002-05) |
| `CORNER_RADIUS` | `handlingAt3s` | enum `grip`, `understeer`, `oversteer`, `sliding` | — | sim | estado de aderência 3 s depois da partida; informativo, não altera `verdict` (AC-US-0002-05) |
| `CORNER_RADIUS` | `stoppedAtStep` | inteiro | passos | só se a velocidade chegou a 0 antes de 3 s | passo em que a velocidade chegou a 0; com ele, `FAIL` com `MEASUREMENT_MISSING` (US-0002, caso anormal "Velocidade chega a 0 antes de 3 s") |
| `CORNER_TURN` | `steerInputNorm` | número | normalizado | sim | 1 ou −1: o lado ensaiado (AC-US-0002-09) |
| `CORNER_TURN` | `entrySpeedMps` | número | m/s | sim | 13,89 (50 km/h); apresentada também em km/h |
| `CORNER_TURN` | `turnAt2sRad` | número | rad | sim | módulo do giro 2 s depois da partida; com o kart parado antes, o giro atingido até a parada; apresentado também em graus (AC-US-0002-05) |
| `CORNER_TURN` | `halfTurnReachedMs` | inteiro | ms | só se o giro atingiu π rad em até 2 s | instante, contado da partida, do primeiro passo com giro de pelo menos π rad (180°); ≤ 2 000 para `PASS` (AC-US-0002-05, AC-US-0002-09) |
| `CORNER_TURN` | `speedAt2sMps` | número | m/s | sim | velocidade 2 s depois da partida; apresentada também em km/h (AC-US-0002-05) |
| `CORNER_TURN` | `stoppedAtStep` | inteiro | passos | só se a velocidade chegou a 0 antes de 2 s | passo da parada; o giro conta só até ele (US-0002, caso anormal "Velocidade chega a 0 antes de 2 s") |
| `NORMAL_DRIVING` | `normalDrivingStepCount` | inteiro | passos | sim | passos de condução normal: todos os passos da volta do piloto de teste ([RULE-0001](../rules/RULE-0001-estado-de-aderencia-e-condicao-de-forcar.md)) |
| `NORMAL_DRIVING` | `oversteerOrSlidingStepCount` | inteiro | passos | sim | 0 para `PASS` (AC-US-0003-07) |
| `NORMAL_DRIVING` | `maxSideslipRad` | número | rad | sim | derrapagem lateral máxima na volta; ≤ 0,65 para `PASS` (AC-US-0003-07) |
| `REAR_RECOVERY` | `steerInputNorm` | número | normalizado | sim | 1 ou −1: o lado forçado e depois levado a 0 (AC-US-0003-03) |
| `REAR_RECOVERY` | `entrySpeedMps` | número | m/s | sim | velocidade de partida, acima de 13,89 (50 km/h); parâmetro de ensaio; apresentada também em km/h |
| `REAR_RECOVERY` | `rearReleased` | booleano | — | sim | `true` quando `handling` chegou a `oversteer` ou `sliding` sob a condição de forçar (US-0003, caso anormal "Traseira não solta") |
| `REAR_RECOVERY` | `forcingMs` | inteiro | ms | sim | tempo simulado em que o kart foi forçado: até a traseira soltar ou, sem soltar, até a duração máxima do forçar |
| `REAR_RECOVERY` | `gripReached` | booleano | — | só com `rearReleased` | `true` quando `handling` voltou a `grip` dentro do ensaio |
| `REAR_RECOVERY` | `recoveryMs` | inteiro | ms | só com `gripReached` | tempo até o primeiro `grip` (AC-US-0003-07); ≤ 400 para `PASS` |
| `REAR_RECOVERY` | `maxSideslipRad` | número | rad | só com `rearReleased` | derrapagem lateral máxima na recuperação (AC-US-0003-07); ≤ 0,65 para `PASS` |
| `DRIFT_INERT` | `comparedStepCount` | inteiro | passos | sim | passos comparados entre a execução com o comando de drift mantido e a sem ele (AC-US-0003-08) |
| `DRIFT_INERT` | `differingStepCount` | inteiro | passos | sim | passos em que posição, velocidade, rumo, estado de aderência ou derrapagem lateral diferem; 0 para `PASS` (AC-US-0003-07) |
| `DRIFT_INERT` | `firstDifferingStep` | inteiro | passos | só com `differingStepCount` > 0 | primeiro passo diferente |
| `SPEED_CAP` | `maxObservedSpeedMps` | número | m/s | sim | maior velocidade observada nos ensaios cobertos ([RULE-0002](../rules/RULE-0002-ensaios-e-limiares.md)); apresentada também em km/h (AC-US-0003-07) |
| `SPEED_CAP` | `maxObservedBenchId` | enum `benchId` | — | sim | ensaio em que a maior velocidade foi observada |
| `SPEED_CAP` | `topSpeedMps` | número | m/s | só com `TOP_SPEED` medido na mesma execução | velocidade estabilizada do mesmo acerto e versão, copiada de `TOP_SPEED`; apresentada também em km/h; `maxObservedSpeedMps` ≤ `topSpeedMps` para `PASS` (AC-US-0003-10) |
| `ACCELERATION` | `zeroToSixtyKmhMs` | inteiro | ms | sim | tempo simulado de 0 a 60 km/h (16,67 m/s); apresentado também em s (AC-US-0004-07) |
| `ACCELERATION` | `driverMassKg` | número | kg | sim | 75 |
| `TOP_SPEED` | `topSpeedMps` | número | m/s | sim | apresentado também em km/h (AC-US-0004-07); entre 65/3,6 e 72/3,6 inclusive para `PASS` (AC-US-0004-02) |
| `GRASS_LOSS` | `entrySpeedMps` | número | m/s | sim | velocidade estabilizada ou 13,89 (50 km/h); apresentado também em km/h |
| `GRASS_LOSS` | `speedAfterOneSMps` | número | m/s | sim | apresentado também em km/h (AC-US-0004-07) |
| `WALL_CONTACT` | `contacts` | lista de pares (`speedBeforeContactMps`, `speedAfterContactMps`) | m/s | sim | um par por contato, apresentado também em km/h (AC-US-0004-07); lista vazia é `FAIL` com `MEASUREMENT_MISSING`, porque o ensaio exige ao menos um contato |
| `DETERMINISM` | `runCount` | inteiro | execuções | sim | pelo menos 2 |
| `DETERMINISM` | `identical` | booleano | — | sim | `true` para `PASS` (AC-US-0005-01) |
| `TEST_PILOT_LAP` | `lapTimeMs` | inteiro | ms | sim | tempo total (AC-US-0005-03) |
| `TEST_PILOT_LAP` | `sectorMs` | lista de 4 inteiros | ms | sim | |
| `TEST_PILOT_LAP` | `offAsphaltStepCount` | inteiro | passos | sim | 0 para `PASS` (AC-US-0005-02) |
| `TEST_PILOT_LAP` | `offAsphaltFirstStep` | inteiro | passos | só com `offAsphaltStepCount` > 0 | passo da primeira saída |
| `TEST_PILOT_LAP` | `offAsphaltFirstXM`, `offAsphaltFirstZM` | número | m | só com `offAsphaltStepCount` > 0 | posição da primeira saída (US-0005, caso anormal) |
| `TEST_PILOT_LAP` | `baselineLapTimeMs` | inteiro | ms | só com `baselineAvailable` | ~31 400 na linha de base citada |
| `STEP_COST` | `meanStepCostUs` | número | µs | sim | média por passo sobre a volta (NFR-0002) |
| `STEP_COST` | `baselineMeanStepCostUs` | número | µs | só com `baselineAvailable` | |
| `SETUP_VERSION` | `declaredSetupVersion`, `previousSetupVersion` | texto | — | sim | diferentes para `PASS` (AC-US-0005-04) |
| `SETUP_VERSION` | `oldRecordsReadCount`, `oldRecordsReadOkCount` | inteiro | registros | sim | iguais para `PASS` (NFR-0009) |
| `STEP_CONTRACT` | `stepUnchanged`, `solverRateUnchanged`, `inputFieldsUnchanged` | booleano | — | sim | todos `true` para `PASS` (AC-US-0005-06) |
| `REALISTA_UNCHANGED` | `differingMeasureCount` | inteiro | medidas | sim | 0 para `PASS` (NFR-0007) |
| `REALISTA_UNCHANGED` | `arcadeAssistActiveCount` | inteiro | assistências | sim | 0 para `PASS` |

Forma vazia: uma execução que não roda nenhum ensaio produz zero registros e é reportada como tal; nunca
produz `PASS` implícito.

## Erros

| Código | Condição | Efeito |
|---|---|---|
| `FAIL` com `BASELINE_MISSING` | em `STEP_COST`, linha de base ausente em `docs/physics.md` ou registrada em outra máquina e runtime | o critério não é julgado; a linha de base precisa ser registrada no mesmo ensaio (NFR-0002) |
| `FAIL` com `SPEED_NOT_HELD` | em `STEER_RESPONSE`, `speedMinMps` ou `speedMaxMps` fora de `targetSpeedMps` ± `speedHoldBandMps` enquanto o esterço está aplicado | o regime não é estacionário; os tempos medidos não valem como veredito (US-0001, caso anormal "Velocidade não mantida") |
| `FAIL` com `TEST_AREA_EXCEEDED` | em qualquer ensaio em `TEST_PAD`, `offAsphaltStepCount` > 0: o kart saiu da área de asfalto declarada pelo ensaio | a medição é inválida; falha do ambiente de ensaio, não aprovação nem reprovação da dirigibilidade; passo e posição reportados (US-0002, caso anormal "Kart fora da área do ensaio") |
| `FAIL` com `OFF_ASPHALT` | `offAsphaltStepCount` > 0 em `TEST_PILOT_LAP` | passo e posição reportados; a feature não é entregue com esse resultado (US-0005, caso anormal) |
| `FAIL` com `MEASUREMENT_MISSING` | em `CORNER_RADIUS`, a velocidade chegou a 0 antes de 3 s (`stoppedAtStep`); em `SPEED_CAP`, `TOP_SPEED` não foi medido na mesma execução; em `WALL_CONTACT`, `contacts` vazio (nenhum contato com velocidade maior que 0) | falta de medida: o critério fica sem o valor que julga; o passo da parada é reportado (US-0002, caso anormal "Velocidade chega a 0 antes de 3 s"); em `WALL_CONTACT`, não há par a julgar (AC-US-0004-05) |
| `FAIL` com `NON_DETERMINISTIC` | execuções repetidas diferem | defeito de determinismo (NFR-0001), nunca tolerância |
| `FAIL` com `CONTRACT_CHANGED` | `STEP_CONTRACT` ou `REALISTA_UNCHANGED` detectam mudança | NFR-0006, NFR-0007 |
| `FAIL` com `THRESHOLD_EXCEEDED` | qualquer limiar de [RULE-0002](../rules/RULE-0002-ensaios-e-limiares.md) não atendido, incluindo o giro abaixo de π rad em até 2 s ou até a parada (`CORNER_TURN`), a recuperação acima de 400 ms ou sem `grip` (`gripReached` falso), `differingStepCount` > 0 (`DRIFT_INERT`) e `maxObservedSpeedMps` acima de `topSpeedMps` (`SPEED_CAP`) | nenhum afrouxamento do limiar é admitido |

Em `CORNER_RADIUS` e `CORNER_TURN`, o estado de aderência não é erro nem veredito: `oversteer`, `sliding` ou
`understeer` em qualquer passo não reprovam, e `handlingAt3s` é informativo (US-0002, casos anormais). Em
`REAR_RECOVERY`, `rearReleased` falso não é erro: o registro reporta `forcingMs` e o veredito não reprova,
porque nenhum critério exige que a traseira solte (US-0003, caso anormal "Traseira não solta sob a condição
de forçar"). Em `STEER_RESPONSE`, um passo em `understeer` não altera o veredito (AC-US-0001-05,
`DOMAIN/DEC-09`).

## Idempotência

Executar o mesmo ensaio duas vezes produz registros idênticos, exceto `measuredAtUtc` e `meanStepCostUs`
(que depende da máquina e é comparado só com a linha de base da mesma máquina e runtime). Não há chave;
não há estado alterado.

## Paginação e sondagem

Não se aplica.

## Compatibilidade

Versão 4.0.0, pelas revisões 4 e 5 do seed (`DOMAIN/DEC-15`, `DOMAIN/DEC-16`, requisitos 4.3.0). Nenhum
registro foi publicado fora do repositório sob a forma anterior, e o único leitor deste contrato como
entrada é a leitura de linha de base de `docs/physics.md`, que passa a servir só a `STEP_COST` e nunca lê
uma entrada de `benchId` retirado: não há leitura a rejeitar (I3). Um `benchId` ou campo retirado deixa de
ser emitido em qualquer registro, e o seu substituto, quando existe, está nesta versão.

| Mudança | Tratamento |
|---|---|
| `benchId` `REFERENCE_CORNER` retirado | Substituído por `CORNER_RADIUS` (acelerador cheio, raio aos 3 s) e `CORNER_TURN` (acelerador 0, giro em até 2 s) |
| `benchId` `UNDERSTEER_ONSET` retirado | Sem substituto: a varredura de início do subesterço saiu com `DOMAIN/DEC-15`; a curva é julgada por `CORNER_RADIUS` e `CORNER_TURN`. Uma entrada de `docs/physics.md` desse ensaio não é linha de base de nenhum ensaio desta versão |
| `benchId` `DRIFT_MANEUVER` retirado | Substituído por `DRIFT_INERT` (o comando de drift não muda o estado) |
| Campo `throttleCondition` e os seus valores `THROTTLE_ZERO`, `THROTTLE_FULL` retirados | A condição de acelerador passa a ser o próprio ensaio: `CORNER_RADIUS` (acelerador cheio) e `CORNER_TURN` (acelerador 0) |
| Campos `arcRadiusM` e `laneWidthM` retirados (em `REFERENCE_CORNER`, `UNDERSTEER_ONSET` e `REAR_RECOVERY`) | Substituídos por `testAreaRadiusM`: a pista de teste aberta não tem arco nem faixa |
| Campo `maxUndersteerMs` retirado | Substituído por `pathRadiusAt3sM` (`CORNER_RADIUS`) e `turnAt2sRad` (`CORNER_TURN`): a curva é julgada pelo raio e pelo giro, não pelo rótulo de aderência |
| Campos `v0Mps`, `v1Mps`, `entrySpeedStepMps` e `maxUndersteerMsBySpeed` (com `plateauSpeedMps`) retirados | Sem substituto, com `UNDERSTEER_ONSET` |
| Campo `driftScorePoints` retirado | Substituído por `differingStepCount` de `DRIFT_INERT`: não há pontuação de drift |
| Campo `excludedRecoveryStepCount` retirado de `NORMAL_DRIVING` | Sem substituto: a condução normal é todos os passos da volta do piloto de teste, sem exclusão ([RULE-0001](../rules/RULE-0001-estado-de-aderencia-e-condicao-de-forcar.md)) |
| `NORMAL_DRIVING` | Mantém o nome e os campos `normalDrivingStepCount`, `oversteerOrSlidingStepCount` e `maxSideslipRad`, com nome, unidade e significado (passos de condução normal); a população passa a ser a volta do piloto de teste em `SYNTHETIC_TRACK`, como os requisitos redefiniram a condução normal (AC-US-0003-01, AC-US-0003-05) |
| `REAR_RECOVERY` | Roda na pista de teste aberta; `gripReached` e `maxSideslipRad` mantêm nome, unidade e significado e passam a ser condicionais a `rearReleased`, porque sem a traseira solta não há recuperação; `steerInputNorm`, `entrySpeedMps`, `rearReleased` e `forcingMs` são aditivos |
| `offAsphaltStepCount`, `offAsphaltFirstStep`, `offAsphaltFirstXM`, `offAsphaltFirstZM` em `TEST_PAD` | Mantêm nome e unidade e o significado "passo fora do asfalto do ambiente", que na pista de teste aberta é a área declarada; acrescentados a todo ensaio em `TEST_PAD` (antes, só no arco) e reportados com `TEST_AREA_EXCEEDED` em vez de `OFF_ASPHALT` |
| `failReason` | `TEST_AREA_EXCEEDED` é aditivo. `OFF_ASPHALT` mantém o significado e passa a ser emitido só em `TEST_PILOT_LAP`. `MEASUREMENT_MISSING` mantém o significado (falta de medida) e passa a cobrir `CORNER_RADIUS` com parada antes de 3 s, `SPEED_CAP` sem `TOP_SPEED` e `WALL_CONTACT` sem contato (antes, um `FAIL` sem motivo declarado). `BASELINE_MISSING` mantém o significado e passa a ser emitido só em `STEP_COST` |
| `TOP_SPEED` | `topSpeedMps` mantém nome, unidade e significado; muda só o limiar do veredito (65 km/h a 72 km/h, `DOMAIN/DEC-15`), que não é campo |
| `CORNER_RADIUS`, `CORNER_TURN`, `DRIFT_INERT`, `SPEED_CAP` e os seus campos | Aditivos |

O histórico das versões 1.0.0 a 3.4.0 deste contrato, que descrevia os ensaios agora retirados, está em
[97-changelog.md](../97-changelog.md). Cada entrada de `docs/physics.md` registra os campos desta versão,
com data, para a linha de base e para o novo acerto (NFR-0004).
