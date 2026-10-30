---
id: RULE-0002
title: Ambientes, ensaios e limiares de dirigibilidade
feature: dirigibilidade
stage: fspec
status: validated
version: 4.0.1
sources: [US-0001, US-0002, US-0003, US-0004, US-0005, NFR-0001, NFR-0002, NFR-0003, NFR-0004, NFR-0006, NFR-0007, NFR-0008, NFR-0009, AC-US-0001-01, AC-US-0001-02, AC-US-0001-03, AC-US-0001-04, AC-US-0001-05, AC-US-0001-06, AC-US-0002-05, AC-US-0002-07, AC-US-0002-08, AC-US-0002-09, AC-US-0003-01, AC-US-0003-03, AC-US-0003-04, AC-US-0003-05, AC-US-0003-07, AC-US-0003-08, AC-US-0003-10, AC-US-0004-01, AC-US-0004-02, AC-US-0004-03, AC-US-0004-04, AC-US-0004-05, AC-US-0004-07, AC-US-0005-01, AC-US-0005-02, AC-US-0005-03, AC-US-0005-04, AC-US-0005-06]
---

# RULE-0002 — Ambientes, ensaios e limiares de dirigibilidade

Tabela única dos limiares desta feature, com a sua fonte, os dois ambientes de ensaio e a definição de
cada ensaio determinístico que os verifica: ambiente, estado inicial, `Input` por passo, medição e
veredito. Todo ensaio avança a simulação com `STEP`, sem renderização, controles, DOM nem relógio de
parede (I9, NFR-0005), com o acerto Arcade assistido na versão corrente (acerto C, `DOMAIN/DEC-15`),
salvo onde a tabela nomeia o Realista. Os valores medidos são reportados pelo contrato
[API-0003](../api/API-0003-saida-dos-ensaios.md).

## Ambientes de ensaio

| `benchEnvironment` | O que é | Geometria | Grama, parede e área do ensaio | Fonte |
|---|---|---|---|---|
| `TEST_PAD` (pista de teste aberta) | Ambiente de ensaio próprio da simulação, separado da pista sintética e de qualquer pista publicada; não é dado de pista e não altera a validação de volta (NFR-0008). Usado por `STEER_RESPONSE` (partida em reta), `CORNER_RADIUS`, `CORNER_TURN`, `REAR_RECOVERY` e pela sequência de recuperação de `DRIFT_INERT` | Asfalto sem faixa e sem paredes. Cada ensaio declara a área de asfalto que contém a sua trajetória: um disco de asfalto centrado no ponto de partida, de raio `testAreaRadiusM` (parâmetro de ensaio reportado e registrado em `docs/physics.md`) | Não há grama nem parede a ensaiar: dentro da área declarada a telemetria reporta `surface` `ASPHALT`; fora dela, `GRASS`, no sentido de "fora da área de asfalto do ensaio". Um passo fora da área declarada invalida a medição: o ensaio reporta `FAIL` com `failReason` `TEST_AREA_EXCEEDED`, com o passo e a posição, como falha do ambiente de ensaio — nunca como aprovação e nunca como reprovação da dirigibilidade. `wallContact` nunca é verdadeiro | `SEED/RD-06`, `DOMAIN/REF-03`, `DOMAIN/DEC-15` (via US-0001 a US-0003); US-0002, caso anormal "Kart fora da área do ensaio"; pré-condições de US-0001 e US-0003 (o kart segue no asfalto) |
| `SYNTHETIC_TRACK` (pista sintética) | Pista do piloto de teste; raios mínimos de curva de 24 m e 25 m, com um grampo de 4 m | A da pista sintética, inalterada | Tem grama e parede; é onde `GRASS_LOSS` e `WALL_CONTACT` rodam, por necessidade. A volta do piloto de teste roda aqui e serve a `TEST_PILOT_LAP`, a `NORMAL_DRIVING` (condução normal, `SEED/US-3`), a `STEP_COST` e à sequência da volta de `DRIFT_INERT` | `SEED/RD-06`, `DOMAIN/REF-03` (via US-0003 e US-0005) |

O Jogador nunca pilota na pista de teste; os ensaios alimentam a simulação com a mesma forma de `Input`
que os adaptadores produzem (US-0001 a US-0003, Canais). O ambiente dos ensaios `ACCELERATION` e
`TOP_SPEED` não é fixado pelos requisitos: é reportado em `benchEnvironment` (lacuna deliberada de
`01-overview.md`), e a reta usada é longa o bastante para a velocidade deixar de crescer.

## Limiares

| Limiar | Valor | Fonte |
|---|---|---|
| Subida da taxa de guinada a 90 % do regime, esterço cheio, partida em reta na pista de teste aberta a 50 km/h mantidos | no máximo 180 ms | `DOMAIN/DEC-01` (AC-US-0001-01) |
| Queda da taxa de guinada a 10 % do regime ao soltar | no máximo 250 ms | `DOMAIN/DEC-01` (AC-US-0001-02) |
| Subida e queda com esterço parcial (`web-mobile`) | 180 ms e 250 ms, para o regime do esterço aplicado | `SEED/US-1` via AC-US-0001-03, AC-US-0001-04 |
| Raio da trajetória 3 s depois da partida, de 50 km/h, acelerador e esterço cheios, cada lado | no máximo 13 m | `SEED/US-2` via AC-US-0002-07; `DOMAIN/DEC-15` |
| Raio da trajetória 3 s depois da partida, de 70 km/h, acelerador e esterço cheios, cada lado | no máximo 13 m | `SEED/US-2` via AC-US-0002-08; `DOMAIN/DEC-15` |
| Giro em até 2 s depois da partida, de 50 km/h, acelerador 0 e esterço cheio, cada lado | pelo menos 180° (π rad) | `SEED/US-2` via AC-US-0002-09; `DOMAIN/DEC-16` |
| Passos com `oversteer` ou `sliding` na volta do piloto de teste (condução normal) | 0 | `SEED/US-3` via AC-US-0003-01 |
| Derrapagem lateral na volta do piloto de teste (condução normal) e na recuperação | no máximo 0,65 rad | `SEED/US-3` via AC-US-0003-04, AC-US-0003-05 |
| Recuperação da traseira ao zerar o esterço | no máximo 400 ms | `DOMAIN/DEC-04` (AC-US-0003-03) |
| Passos com estado diferente entre a mesma sequência com e sem o comando de drift | 0 | `SEED/US-3` via AC-US-0003-08 |
| Maior velocidade observada nos ensaios que partem de velocidade igual ou menor que a estabilizada | no máximo a velocidade estabilizada medida por `TOP_SPEED` para o mesmo acerto e a mesma versão | `SEED/US-3` via AC-US-0003-10 |
| 0–60 km/h, piloto de 75 kg | no máximo 2,5 s | `DOMAIN/DEC-05` (AC-US-0004-01) |
| Velocidade estabilizada em reta | entre 65 km/h e 72 km/h, inclusive os dois extremos | `SEED/US-4` via AC-US-0004-02; `DOMAIN/DEC-15` |
| Velocidade após 1 s na grama (entrada à velocidade estabilizada e a 50 km/h) | no máximo 70 % da velocidade de entrada | `SEED/US-4` via AC-US-0004-03, AC-US-0004-04 |
| Contato com a parede | velocidade no passo seguinte menor que no passo anterior, em 100 % dos contatos | `SEED/US-4` via AC-US-0004-05 |
| Volta do piloto de teste (pista sintética) | no máximo 25 s; 0 passos fora do asfalto | `DOMAIN/DEC-07` (AC-US-0005-02, AC-US-0005-03) |
| Determinismo | resultados idênticos em 100 % de no mínimo 2 execuções | `SEED/NF-01` via AC-US-0005-01, NFR-0001 |
| Custo por passo | média no máximo 10 % acima da linha de base, mesma máquina e runtime | `SEED/NF-02` via NFR-0002 |

"No máximo", "pelo menos" e "entre … inclusive" são inclusivos; "menor que" e "maior que" são estritos. Os
limiares são enunciados na unidade dos critérios (km/h, s, graus); os campos que os verificam são SI (m/s,
ms, m, rad) por D-FS-06 ([API-0003](../api/API-0003-saida-dos-ensaios.md)), e a comparação converte o
limiar para a unidade do campo (km/h ÷ 3,6 = m/s; s × 1000 = ms; 180° = π rad), sem arredondar o valor
medido. Os limiares em vigor são os da revisão 5 do seed: o acerto C (`DOMAIN/DEC-15`) substitui o piso de
105 km/h pela faixa de 65 km/h a 72 km/h e os ensaios do arco de raio 18 m pelos de raio da trajetória na
pista de teste aberta; `DOMAIN/DEC-16` fixa o giro de pelo menos 180° em até 2 s para a curva sem
acelerador. Os limites de resposta do volante (180 ms, 250 ms), de recuperação (400 ms), de derrapagem
lateral (0,65 rad), de 0–60 km/h (2,5 s), de grama, de parede e da volta do piloto de teste (25 s) não
mudaram.

## Medidas da curva de referência

A curva de referência é o ensaio de curva da pista de teste aberta (US-0002): o kart parte em linha reta,
no asfalto, em `grip`, com esterço 0 e a velocidade de partida colocada pelo ensaio como estado inicial; a
**partida** é o passo em que o esterço cheio é aplicado, e esse esterço é mantido até o fim do ensaio. Não
é segmento da pista sintética nem o antigo arco de raio 18 m.

| Medida | Definição | Fonte |
|---|---|---|
| Raio da trajetória aos 3 s | Raio de curvatura do caminho do centro do kart, em m: a velocidade dividida pela taxa de variação da direção do movimento, medido numa janela de duração `radiusWindowMs` centrada no instante 3 s de tempo simulado depois da partida; a duração da janela é parâmetro de ensaio reportado e registrado em `docs/physics.md` | AC-US-0002-07, AC-US-0002-08, AC-US-0002-05; glossário dos requisitos, "Raio da trajetória" |
| Giro | Variação acumulada do rumo do kart (direção para a qual o kart aponta, em torno do eixo vertical), com sinal, contada do passo da partida; o critério usa o seu módulo, em rad, apresentado também em graus. O giro de π rad (180°) deixa o kart apontando para o lado oposto ao da partida | AC-US-0002-09; `DOMAIN/DEC-16`; glossário dos requisitos, "Giro" |
| Instante do meio giro | Tempo simulado, contado da partida, do primeiro passo em que o módulo do giro é pelo menos π rad | AC-US-0002-05, AC-US-0002-09 |

O estado de aderência não entra no veredito da curva de referência: `CORNER_RADIUS` julga só o raio, em
qualquer estado de aderência — acima de 50 km/h, acelerador e esterço cheios são a condição de forçar e a
traseira pode soltar —, e `CORNER_TURN` julga só o giro; nenhum dos dois é reprovado por um passo com
`understeer`, `oversteer` ou `sliding` (US-0002, casos anormais "Traseira solta durante o ensaio com
acelerador cheio" e "`understeer` reportado durante o ensaio").

## Ensaios

Cada ensaio parte do ambiente e do estado inicial descritos, com acelerador, freio e esterço em 0 salvo
indicação, e aplica o `Input` indicado em todos os passos. Os parâmetros que os requisitos deixam ao
ensaio (modo de manter a velocidade e faixa tolerada, janela de estabilização do regime, janela de medição
do raio, raio da área declarada da pista de teste, velocidade de partida e duração máxima do forçar na
recuperação) são **parâmetros de ensaio**: registrados em `docs/physics.md` (NFR-0004) e, os que têm campo
em [API-0003](../api/API-0003-saida-dos-ensaios.md), também reportados na saída; nunca limiares. Em todo
ensaio em `TEST_PAD`, um passo fora da área declarada dá `TEST_AREA_EXCEEDED` (Ambientes de ensaio).

| `benchId` | Ambiente | Estado inicial e `Input` | Medição | Veredito `PASS` se | Fonte |
|---|---|---|---|---|---|
| `STEER_RESPONSE` | `TEST_PAD`, partida em reta | Asfalto, `grip`, em linha reta, 50 km/h, esterço 0; a velocidade é mantida em 50 km/h pelo acelerador durante todo o ensaio (`speedHoldMode`: constante ou regulado por passo); num passo o esterço vai a 1 (e, em repetição, a −1); mantido até o regime, medido na janela curta e estacionária `settleWindowMs`, com o kart seguindo dentro da área declarada a curva que a resposta produz; depois, num passo, volta a 0 | `riseToNinetyPctMs`, `fallToTenPctMs`, `settleWindowMs`, `steadyYawRateRadPerS`, `speedMinMps`, `speedMaxMps`, `steerInputNorm`, `understeerStepCount` | subida ≤ 180 ms e queda ≤ 250 ms, nos dois lados, com `speedMinMps` e `speedMaxMps` dentro de `targetSpeedMps` ± `speedHoldBandMps`; `understeer` durante o ensaio não altera o veredito; velocidade fora da faixa é `FAIL` com `SPEED_NOT_HELD` | AC-US-0001-01, AC-US-0001-02, AC-US-0001-05, AC-US-0001-06; `DOMAIN/REF-03`, `DOMAIN/DEC-09` |
| `STEER_RESPONSE` com `steerInputNorm` entre 0 e 1 exclusive (`inputMode` `PROPORTIONAL`) | `TEST_PAD`, partida em reta | Idem, com o esterço levado ao valor parcial e mantido | idem, para o regime desse esterço | subida ≤ 180 ms e queda ≤ 250 ms, com a velocidade mantida | AC-US-0001-03, AC-US-0001-04 |
| `CORNER_RADIUS` | `TEST_PAD` | Partida em linha reta a 50 km/h e, em segunda execução, a 70 km/h (`entrySpeedMps`); no passo da partida, acelerador cheio e esterço cheio (1 e, em repetição, −1) aplicados e mantidos | `pathRadiusAt3sM` (Medidas da curva de referência), `speedAt3sMps`, `handlingAt3s`, `radiusWindowMs`; `stoppedAtStep` se a velocidade chegar a 0 antes de 3 s | `pathRadiusAt3sM` ≤ 13 m nas duas velocidades de partida e nos dois lados, em qualquer estado de aderência; velocidade 0 antes de 3 s é `FAIL` com `MEASUREMENT_MISSING` (falta de medida: com o kart parado o raio não é definido) | AC-US-0002-07, AC-US-0002-08, AC-US-0002-05; `DOMAIN/DEC-15` |
| `CORNER_TURN` | `TEST_PAD` | Partida em linha reta a 50 km/h; no passo da partida, acelerador 0 e esterço cheio (1 e, em repetição, −1) aplicados e mantidos | `turnAt2sRad` (módulo do giro 2 s depois da partida; com o kart parado antes, o giro da parada, porque o rumo não muda depois dela), `halfTurnReachedMs` (instante do meio giro, se atingido em até 2 s), `speedAt2sMps`; `stoppedAtStep` se a velocidade chegar a 0 antes de 2 s | o módulo do giro atinge pelo menos π rad (180°) num passo até 2 s depois da partida (`halfTurnReachedMs` ≤ 2 000), nos dois lados; com o kart parado antes de 2 s, o giro conta só até o passo da parada, e abaixo de π rad o ensaio é `FAIL` com `THRESHOLD_EXCEEDED`, com `stoppedAtStep` e o giro atingido | AC-US-0002-09, AC-US-0002-05; `DOMAIN/DEC-16` |
| `NORMAL_DRIVING` | `SYNTHETIC_TRACK` | Todos os passos da volta do piloto de teste (a mesma execução de `TEST_PILOT_LAP`), sem exceção: os passos em que o piloto de teste força o kart também são condução normal ([RULE-0001](RULE-0001-estado-de-aderencia-e-condicao-de-forcar.md)) | `handling` e `sideslipRad` por passo; `normalDrivingStepCount`, `oversteerOrSlidingStepCount`, `maxSideslipRad` | `oversteerOrSlidingStepCount` = 0 e `maxSideslipRad` ≤ 0,65 rad | AC-US-0003-01, AC-US-0003-05, AC-US-0003-07 |
| `REAR_RECOVERY` | `TEST_PAD` | Asfalto, `grip`, em linha reta, velocidade de partida acima de 50 km/h (`entrySpeedMps`); acelerador cheio e esterço cheio (1 e, em repetição, −1) mantidos até `handling` em `oversteer` ou `sliding`, ou até a duração máxima do forçar (parâmetro de ensaio); se a traseira soltou, num passo o esterço vai a 0, acelerador mantido cheio | `rearReleased`, `forcingMs`; com a traseira solta, `gripReached`, `recoveryMs` (tempo até o primeiro `grip`) e `maxSideslipRad` na recuperação | com a traseira solta: `gripReached`, `recoveryMs` ≤ 400 ms e `maxSideslipRad` ≤ 0,65 rad, senão `FAIL` com `THRESHOLD_EXCEEDED`. Sem a traseira soltar (`rearReleased` falso), o critério da recuperação não tem passo de partida: o registro reporta `rearReleased` e `forcingMs` e não reprova, porque nenhum critério exige que a traseira solte (US-0003, caso anormal "Traseira não solta sob a condição de forçar") | AC-US-0003-03, AC-US-0003-04, AC-US-0003-07; `DOMAIN/DEC-04` |
| `DRIFT_INERT` | `SYNTHETIC_TRACK` (volta do piloto de teste) e `TEST_PAD` (sequência de `REAR_RECOVERY`), um registro por sequência | A mesma sequência de `Input` por passo, aplicada ao mesmo estado inicial duas vezes: uma com o comando de drift mantido do primeiro ao último passo e outra sem ele | `comparedStepCount`, `differingStepCount` e, se houver, `firstDifferingStep`, comparando por passo posição, velocidade, rumo, estado de aderência e derrapagem lateral | `differingStepCount` = 0 | AC-US-0003-08, AC-US-0003-07; `SEED/RD-01` |
| `SPEED_CAP` | o de cada ensaio coberto | Todos os ensaios desta tabela que partem de velocidade igual ou menor que `topSpeedMps` do mesmo acerto e versão (`STEER_RESPONSE`, `CORNER_RADIUS` na partida que atende essa condição, `CORNER_TURN`, `REAR_RECOVERY`, `ACCELERATION`, `TOP_SPEED`, `GRASS_LOSS`, `WALL_CONTACT`, `TEST_PILOT_LAP` e as duas execuções de `DRIFT_INERT`, inclusive com o comando de drift mantido) | `maxObservedSpeedMps` (maior `speedMps` em todos os passos desses ensaios), `maxObservedBenchId`, `topSpeedMps` | `maxObservedSpeedMps` ≤ `topSpeedMps`; sem `TOP_SPEED` medido na mesma execução, `FAIL` com `MEASUREMENT_MISSING` | AC-US-0003-10, AC-US-0003-07 |
| `ACCELERATION` | reportado | Reta, asfalto, 0 km/h, piloto de 75 kg; acelerador cheio mantido, esterço 0 | `zeroToSixtyKmhMs` | ≤ 2 500 ms (2,5 s) | AC-US-0004-01, AC-US-0004-07 |
| `TOP_SPEED` | reportado | Reta, asfalto; acelerador cheio mantido, esterço 0, até a velocidade deixar de crescer | `topSpeedMps` | 65/3,6 m/s ≤ `topSpeedMps` ≤ 72/3,6 m/s (65 km/h a 72 km/h, inclusive) | AC-US-0004-02, AC-US-0004-07; `DOMAIN/DEC-15` |
| `GRASS_LOSS` | `SYNTHETIC_TRACK` | Entrada na grama à velocidade estabilizada e, em segunda execução, a 50 km/h (13,89 m/s); acelerador cheio e esterço 0 mantidos; 1 s de tempo simulado na grama | `entrySpeedMps`, `speedAfterOneSMps` por execução | `speedAfterOneSMps` ≤ 0,70 × `entrySpeedMps` nas duas | AC-US-0004-03, AC-US-0004-04, AC-US-0004-07 |
| `WALL_CONTACT` | `SYNTHETIC_TRACK` | Trajetória que leva ao contato com a parede com velocidade maior que 0 | `speedBeforeContactMps`, `speedAfterContactMps` por contato (`wallContact` verdadeiro) | depois < antes em 100 % dos contatos; nenhum contato é `FAIL` com `MEASUREMENT_MISSING` | AC-US-0004-05, AC-US-0004-07 |
| `DETERMINISM` | o de cada ensaio | Cada ensaio desta tabela e a volta do piloto de teste, executados no mínimo 2 vezes com a mesma sequência de `Input` | estados por passo, tempo total e quatro tempos de setor | idênticos em 100 % das execuções | AC-US-0005-01, NFR-0001 |
| `TEST_PILOT_LAP` | `SYNTHETIC_TRACK` | Largada da pista sintética, comandos binários do piloto de teste | `lapTimeMs`, `sectorMs`, `offAsphaltStepCount`, `offAsphaltFirstStep` e posição se houver saída | `lapTimeMs` ≤ 25 000 ms; `offAsphaltStepCount` = 0 | AC-US-0005-02, AC-US-0005-03 |
| `SETUP_VERSION` | — | Leitura da versão declarada no dado publicado (`getSetupVersion`, [API-0002](../api/API-0002-versao-do-acerto.md)) e dos registros gravados antes da feature e com a versão nova (`readReplay`) | `declaredSetupVersion`, `previousSetupVersion`, `oldRecordsReadCount`, `oldRecordsReadOkCount` | `declaredSetupVersion` ≠ `previousSetupVersion` e `oldRecordsReadOkCount` = `oldRecordsReadCount` ([RULE-0003](RULE-0003-versao-do-acerto-e-comparabilidade.md)) | AC-US-0005-04, NFR-0009 |
| `STEP_CONTRACT` | — | Leitura de `STEP`, da taxa do solver e do conjunto, faixa e significado dos campos de `Input` | comparação com a versão anterior à feature | 0 mudanças | AC-US-0005-06, NFR-0006 |
| `REALISTA_UNCHANGED` | o de cada ensaio | Todos os ensaios de física e de dirigibilidade com `setupId` `REALISTA_ALUGUEL_4T`, nos mesmos ambientes | medidas, comparadas com a linha de base do Realista | idênticas em 100 % das medidas; 0 assistências arcade ativas | NFR-0007 |
| `STEP_COST` | `SYNTHETIC_TRACK` | Volta completa do piloto de teste | `meanStepCostUs`, comparado com a linha de base na mesma máquina e runtime | ≤ 1,10 × linha de base | NFR-0002 |

Os ensaios de US-0001 a US-0004 (`STEER_RESPONSE`, `CORNER_RADIUS`, `CORNER_TURN`, `NORMAL_DRIVING`,
`REAR_RECOVERY`, `DRIFT_INERT`, `SPEED_CAP`, `ACCELERATION`, `TOP_SPEED`, `GRASS_LOSS`, `WALL_CONTACT`) são
executados com `inputMode` `BINARY` (sequência do teclado) e com `inputMode` `PROPORTIONAL` (sequência
equivalente da inclinação, esterço 1 mantido), e precisam de `PASS` nas duas formas (NFR-0003). O conjunto
de `npm test` da feature `race-lap-validation` continua aprovado com o novo acerto (NFR-0008), verificado
na mesma execução de `npm test`.

## Ensaios retirados

Os ensaios `REFERENCE_CORNER` (arco de raio 18 m a 50 km/h, acelerador 0 e cheio), `UNDERSTEER_ONSET`
(varredura de início do subesterço no arco) e `DRIFT_MANEUVER` (a manobra de drift continua pontuando)
saíram com a revisão 4 do seed (`DOMAIN/DEC-15`): os critérios que eles verificavam foram retirados dos
requisitos com aprovação do dono do produto. A curva de referência passa a ser verificada por
`CORNER_RADIUS` e `CORNER_TURN`; a ausência do drift, por `DRIFT_INERT`; a varredura não tem substituto.
Nenhum desses `benchId` é executado, emitido ou aceito como linha de base
([API-0003](../api/API-0003-saida-dos-ensaios.md), Compatibilidade).

## Linha de base

O veredito só depende de linha de base em `STEP_COST`. Só conta como linha de base a entrada de
`docs/physics.md` do mesmo ensaio, no mesmo ambiente e na mesma máquina e runtime; sem ela, o ensaio
reporta `FAIL` com `failReason` `BASELINE_MISSING` e o critério não é julgado até a linha de base ser
registrada. A linha de base nunca é inventada nem extrapolada. Os demais ensaios têm limiares absolutos; a
sua linha de base — o mesmo ensaio, no mesmo ambiente, com o acerto Arcade assistido anterior — é
registrada em `docs/physics.md` ao lado do resultado do novo acerto (NFR-0004) e reportada onde o contrato
tem campo para ela (`baselineLapTimeMs`), sem entrar no veredito.

## Suspensão e tempo simulado

Em todo ensaio e na volta do Jogador, os limites são de tempo simulado: a pausa, a perda de foco da aba ou
a perda do sensor suspendem a simulação, nenhum passo avança e nenhum limite conta o tempo suspenso — os
2 s e os 3 s da curva de referência, os 400 ms da recuperação e os tempos de resposta incluídos (casos
anormais de US-0001 a US-0005). A taxa de quadros não altera nenhuma medição, porque a resposta é função
dos passos de `STEP`.

## Idempotência e ordem

Um ensaio é uma função pura do acerto, do ambiente, do estado inicial e da sequência de `Input`: repetir o
ensaio dá a mesma saída (`DETERMINISM`). No `STEER_RESPONSE` com `speedHoldMode` `THROTTLE_REGULATED`, o
acelerador de cada passo é função determinística da telemetria dos passos anteriores, logo a sequência de
`Input` resultante é a mesma em toda execução. A ordem dos passos é `simStepCount`; não há contador
adicional.
