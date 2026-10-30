---
title: Glossário — dirigibilidade do Arcade assistido
feature: dirigibilidade
stage: fspec
status: validated
version: 4.0.1
sources: []
---

# Glossário

Os termos valem igualmente em `web-desktop` e `web-mobile`, salvo indicação. Os termos de domínio vêm do
glossário dos requisitos; as linhas de enum e de campo são as dos contratos de `api/` e de `rules/`.

## Termos de domínio

| Termo | Definição |
|---|---|
| Jogador | Quem pilota o kart com teclado (`web-desktop`) ou com inclinação e toque (`web-mobile`) |
| Piloto de teste | Sequência determinística de comandos binários executada por `npm run bench:handling` na pista sintética; régua de regressão |
| Acerto | Preset de kart (massa, pneu, motor) e conjunto de assistências usados numa volta (I8) |
| Arcade assistido | Acerto padrão do jogo, objeto desta feature; usa assistências de direção, frenagem e amortecimento de derrapagem |
| Acerto C | Acerto Arcade assistido escolhido pelo dono do produto em 2026-10-29 entre as prévias publicadas na staging (`DOMAIN/DEC-15`); é a nova versão do Arcade assistido que esta feature entrega. O nome que a decisão lhe dá não é critério: a versão declarada é `setupVersion` |
| Realista — aluguel 4T | Acerto sem assistências arcade; referência física documentada; não muda |
| Versão do acerto | Identificador declarado no dado publicado (`setupVersion`) que distingue o acerto novo do anterior; tempos e replays de versões diferentes não são comparáveis |
| Assistências | Regras do acerto Arcade que modulam o `Input` ou o estado dentro da simulação: direção proporcional à velocidade, frenagem equilibrada, amortecimento de derrapagem |
| `Input` | Entrada normalizada que todo adaptador entrega à simulação; conjunto, faixa e significado dos campos não mudam (I8) |
| Esterço | Componente de direção do `Input`, de −1 a 1; esterço cheio é 1 ou −1 |
| Entrada binária | Esterço e acelerador que só assumem 0 ou valor cheio: teclado, e toque em `web-mobile` |
| Entrada proporcional | Esterço com qualquer valor entre −1 e 1: inclinação em `web-mobile` |
| Sensor de inclinação | Sensor do celular que alimenta o esterço proporcional; ausente ou negado, o controle recai para toque com estado visível (I4) |
| Tempo simulado | Tempo em passos de `STEP` no estado da simulação; nunca o relógio de parede |
| `STEP` | Passo fixo da simulação, com solver de 480 Hz; não muda |
| Ensaio | Sequência determinística de estado inicial, ambiente, `Input` por passo e medição, executada em `npm test` ou nos benches, com parâmetros e resultados registrados em `docs/physics.md` |
| Ambiente de ensaio | Onde o ensaio roda: pista de teste aberta (`TEST_PAD`) ou pista sintética (`SYNTHETIC_TRACK`); reportado em `benchEnvironment` e registrado em `docs/physics.md` |
| Pista de teste aberta | Ambiente de ensaio próprio, separado da pista sintética e de qualquer pista publicada: asfalto sem faixa e sem paredes. Cada ensaio declara a área de asfalto que contém a sua trajetória, um disco centrado no ponto de partida de raio `testAreaRadiusM`; sair dela invalida a medição. Usada pela resposta do volante (partida em reta), pelo raio e pelo giro em curva e pela recuperação da traseira; o Jogador não pilota nela; não é dado de pista publicado (`SEED/RD-06`, `DOMAIN/REF-03`, `DOMAIN/DEC-15`) |
| Pista sintética | Pista do piloto de teste (`npm run bench:handling`); raios mínimos de curva de 24 m e 25 m, com um grampo de 4 m. Só a volta do piloto de teste (tempo de volta e condução normal) e os ensaios que precisam de grama ou parede a usam |
| Linha de base | Valor medido pelo mesmo ensaio, no mesmo ambiente, com o acerto Arcade assistido anterior a esta feature, registrado em `docs/physics.md` |
| Partida | Na curva de referência, o passo em que o esterço cheio é aplicado, com o kart em linha reta na velocidade de partida do ensaio; os 2 s e os 3 s são contados dele |
| Taxa de guinada | Velocidade angular do kart em torno do eixo vertical, em rad/s, no estado da simulação |
| Rumo | Direção para a qual o kart aponta, em torno do eixo vertical, em rad (`headingRad`) |
| Velocidade mantida | Condição de ensaio em que a velocidade do kart é mantida num valor constante, em vez de decair com o esterço aplicado: em 50 km/h pelo acelerador durante todo o ensaio de resposta do volante, com o modo de manter (`speedHoldMode`) e a faixa tolerada (`speedHoldBandMps`) reportados como parâmetros de ensaio e o mínimo e o máximo observados provando a condição |
| Regime da taxa de guinada | Valor estabilizado que a taxa de guinada atinge com esterço mantido, partindo de reta na pista de teste aberta, com a velocidade mantida em 50 km/h; medido numa janela curta e estacionária (`settleWindowMs`), nunca num valor que deriva com a desaceleração |
| Resposta do volante | Tempo simulado da aplicação do esterço até 90 % do regime (subida) e do esterço voltar a 0 até 10 % do regime (queda) |
| Raio da trajetória | Raio de curvatura do caminho do centro do kart, em m: a velocidade dividida pela taxa de variação da direção do movimento, medido numa janela curta (`radiusWindowMs`) centrada no instante de medição |
| Giro | Variação acumulada do rumo do kart, com sinal, contada do passo da partida; o critério usa o seu módulo, em rad (π rad = 180°), apresentado também em graus. O giro de 180° deixa o kart apontando para o lado oposto ao da partida (`DOMAIN/DEC-16`) |
| Curva de referência | Ensaio de curva da pista de teste aberta: o kart parte em linha reta a 50 km/h ou a 70 km/h, com esterço cheio aplicado na partida e mantido; com acelerador cheio, mede-se o raio da trajetória 3 s depois da partida (`CORNER_RADIUS`); sem acelerador, partindo de 50 km/h, mede-se o giro em até 2 s (`CORNER_TURN`). Não é segmento da pista sintética nem o antigo arco de raio 18 m (`DOMAIN/DEC-15`, `DOMAIN/DEC-16`) |
| Estado de aderência | Campo `handling` da telemetria: `grip`, `understeer`, `oversteer` ou `sliding` |
| Telemetria | Campos do estado da simulação lidos por passo pelos ensaios e pelo HUD: posição, rumo, velocidade, estado de aderência, derrapagem lateral, taxa de guinada, superfície, contato com a parede, condição de forçar |
| Subesterço (`understeer`) | O kart faz raio maior que o pedido: "sai de frente" |
| Sobre-esterço (`oversteer`) | A traseira perde aderência antes da frente: "traseira solta" |
| Derrapagem (`sliding`) | Os dois eixos sem aderência |
| Derrapagem lateral | Ângulo entre a direção do kart e a direção do seu movimento, em rad |
| Condição de forçar | Acelerador cheio e esterço cheio com velocidade acima de 50 km/h (`SEED/US-3`); é o que solta a traseira no ensaio de recuperação da pista de teste aberta |
| Recuperação | Os passos desde o passo em que o esterço é levado de 1 (ou −1) a 0 com a traseira solta sob a condição de forçar até o primeiro passo em que a telemetria volta a `grip`; dura no máximo 400 ms |
| Condução normal | Todos os passos da volta do piloto de teste na pista sintética, sem exceção — inclusive aqueles em que ele força o kart (`SEED/US-3`, primeiro critério) |
| Drift | Manobra de `requirements/11` — carga segurando a tecla de drift, mini-turbo, combo e pontuação — retirada por esta feature (`SEED/RD-01`, `DOMAIN/DEC-15`) |
| Turbo | Impulso de velocidade acima da velocidade estabilizada, como o mini-turbo do drift; não existe com esta feature |
| Comando de drift | A tecla de drift em `web-desktop`, ou o controle de drift que o adaptador de toque entregue em `web-mobile`; chega à simulação no mesmo campo de `Input`, com a mesma faixa, e não muda o estado da simulação |
| Direção comum | Pilotar a volta com esterço, acelerador e freio, sem manobra especial; permanece fácil (`SEED/RD-01`) |
| Velocidade estabilizada | Velocidade em reta com acelerador cheio mantido, após deixar de crescer; é a velocidade máxima do kart, a mesma em qualquer situação |
| Grama | Superfície fora do asfalto que reduz a velocidade; só na pista sintética |
| Parede | Limite sólido da pista cujo contato reduz a velocidade; só na pista sintética |
| Asfalto | Superfície da pista, ou a área declarada da pista de teste aberta; "sair do asfalto" é qualquer passo com o kart fora dela |
| HUD | Elementos de tela que exibem a velocidade em km/h e o estado de aderência em texto durante a volta; já existem e não regridem; não exibem drift nem turbo |
| Staging | Publicação de uma rodada de código para o teste do dono do produto no ciclo de fechamento humano (`DOMAIN/DEC-10`); não é critério desta especificação |
| Replay | Sequência de `Input` por passo gravada para uma pista, com a versão do acerto que a produziu |
| Texto compartilhado | Texto que o Jogador compartilha com o resultado de uma volta; contrato publicado (I3) |

## Enums e campos dos contratos

| Nome | Valores ou sentido | Onde |
|---|---|---|
| `handling` | `grip`, `understeer`, `oversteer`, `sliding` | [RULE-0001](rules/RULE-0001-estado-de-aderencia-e-condicao-de-forcar.md) |
| `surface` | `ASPHALT`, `GRASS` (`GRASS` é "fora do asfalto"; na pista de teste aberta, fora da área declarada) | [API-0001](api/API-0001-telemetria-de-dirigibilidade.md) |
| `forcing`, `wallContact` | booleanos por passo: condição de forçar mantida; contato com a parede neste passo | API-0001 |
| `positionXM`, `positionZM`, `headingRad` | posição do centro do kart em m; rumo em rad, acumulado com sinal | API-0001 |
| `speedMps`, `sideslipRad`, `yawRateRadPerS` | velocidade em m/s; derrapagem lateral em rad; taxa de guinada em rad/s | API-0001 |
| `simStepCount` | passos de `STEP` desde o estado inicial da simulação; contador de sequência | API-0001 |
| `setupId` | `ARCADE_ASSISTIDO`, `REALISTA_ALUGUEL_4T` | [RULE-0003](rules/RULE-0003-versao-do-acerto-e-comparabilidade.md) |
| `setupVersion`, `previousSetupVersion` | identificador da versão corrente do acerto e da versão anterior à feature, declarados no dado publicado | [API-0002](api/API-0002-versao-do-acerto.md) |
| `setupVersionSource` | `DECLARED`, `RESOLVED_FROM_ABSENCE` | API-0002 |
| `replayStatus` | `READABLE`, `UNSUPPORTED_FORMAT`, `UNREADABLE` | API-0002 |
| `comparability` | `COMPARABLE`, `SETUP_VERSION_DIFFERS`, `SETUP_DIFFERS`, `TRACK_DIFFERS` | RULE-0003 |
| `benchId` | identificador de ensaio: `STEER_RESPONSE`, `CORNER_RADIUS`, `CORNER_TURN`, `NORMAL_DRIVING`, `REAR_RECOVERY`, `DRIFT_INERT`, `SPEED_CAP`, `ACCELERATION`, `TOP_SPEED`, `GRASS_LOSS`, `WALL_CONTACT`, `DETERMINISM`, `TEST_PILOT_LAP`, `SETUP_VERSION`, `STEP_CONTRACT`, `REALISTA_UNCHANGED`, `STEP_COST`; retirados: `REFERENCE_CORNER`, `UNDERSTEER_ONSET`, `DRIFT_MANEUVER`. Os campos medidos são SI com a unidade no sufixo (`entrySpeedMps`, `pathRadiusAt3sM`, `turnAt2sRad`, `halfTurnReachedMs`, `topSpeedMps`, `zeroToSixtyKmhMs`, `testAreaRadiusM`…), apresentados também em km/h, s ou graus na saída serializada e em `docs/physics.md` | [API-0003](api/API-0003-saida-dos-ensaios.md), [RULE-0002](rules/RULE-0002-ensaios-e-limiares.md) |
| `benchEnvironment` | `TEST_PAD` (pista de teste aberta), `SYNTHETIC_TRACK` (pista sintética) — ambiente em que o ensaio rodou | API-0003, RULE-0002 |
| `speedHoldMode` | `THROTTLE_CONSTANT` (acelerador constante, valor em `throttleInputNorm`), `THROTTLE_REGULATED` (acelerador escolhido por passo pelo ensaio para manter a velocidade) — modo de manter a velocidade em `STEER_RESPONSE`; parâmetro de ensaio | API-0003 |
| `speedMinMps`, `speedMaxMps`, `speedHoldBandMps`, `targetSpeedMps` | velocidade mínima e máxima observadas durante o ensaio de resposta; faixa tolerada em torno da velocidade alvo (parâmetro de ensaio); velocidade alvo (13,89 m/s = 50 km/h) | API-0003 |
| `verdict` | `PASS`, `FAIL` | API-0003 |
| `failReason` | `THRESHOLD_EXCEEDED`, `BASELINE_MISSING` (só `STEP_COST`), `OFF_ASPHALT` (só a volta do piloto de teste), `NON_DETERMINISTIC`, `CONTRACT_CHANGED`, `SPEED_NOT_HELD`, `MEASUREMENT_MISSING` (falta de medida: parada antes de 3 s em `CORNER_RADIUS`; `SPEED_CAP` sem `TOP_SPEED`; `WALL_CONTACT` sem contato), `TEST_AREA_EXCEEDED` (o kart saiu da área declarada na pista de teste aberta: falha do ambiente de ensaio) | API-0003 |
| `inputMode` | `BINARY`, `PROPORTIONAL` — forma do `Input` usada no ensaio | API-0003 |
