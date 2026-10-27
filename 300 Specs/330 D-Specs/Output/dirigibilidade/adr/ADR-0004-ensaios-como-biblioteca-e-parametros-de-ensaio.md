---
id: ADR-0004
title: Ensaios como biblioteca em scripts/ compartilhada por npm test e pelos benches; parâmetros de ensaio fixados; entradas da biblioteca
feature: dirigibilidade
stage: dspec
status: validated
version: 4.0.0
sources: [API-0003, RULE-0002, FLOW-0002, FEAT-0001, FEAT-0002, FEAT-0003, FEAT-0004, FEAT-0005, FEAT-0006, REQ-FEAT-0001-06, REQ-FEAT-0001-09, REQ-FEAT-0002-01, REQ-FEAT-0002-03, REQ-FEAT-0002-04, REQ-FEAT-0002-05, REQ-FEAT-0002-06, REQ-FEAT-0002-09, REQ-FEAT-0002-10, REQ-FEAT-0003-08, REQ-FEAT-0004-07, REQ-FEAT-0005-03, REQ-FEAT-0005-04, REQ-FEAT-0006-04, REQ-FEAT-0006-05, NFR-0001, NFR-0003, NFR-0007, NFR-0009]
---

# ADR-0004 — Ensaios como biblioteca em scripts/ compartilhada por npm test e pelos benches; parâmetros de ensaio fixados; entradas da biblioteca

## Contexto

Os critérios nomeiam "a saída de `npm test` ou de `npm run bench:handling`/bench de física" como ponto de
observação dos mesmos registros (API-0003). As rodadas de código 1 e 2 escreveram a biblioteca
`scripts/handlingBench.ts` e os dois programas de bench segundo as versões anteriores deste projeto
(as-built, commit `0068a57`). O F-Spec 3.3.0 deixa ao ensaio parâmetros (modo de manter a velocidade e
faixa tolerada, janela de estabilização, largura da faixa; na varredura de início do subesterço, o tamanho
do patamar, a sua duração e o modo de manter a sua velocidade) e lacunas deliberadas (resposta à inversão,
recuperação parcial, magnitude da perda na parede, comprimento do arco). Em `UNDERSTEER_ONSET`, RULE-0002
("Fim da varredura de início do subesterço", `DOMAIN/DEC-11`, `DOMAIN/DEC-12`, `DOMAIN/REF-05`) define a
varredura como uma subida da velocidade do kart no arco em **patamares de velocidade mantida** a partir de
50 km/h, encerrada pelo primeiro passo fora da faixa, e decide essa saída pela velocidade do kart no passo
da saída: abaixo de 50 km/h, `FAIL` `OFF_ASPHALT`; acima, com pelo menos dois patamares completos acima de
50 km/h, fim natural da varredura, sem reprovar pela saída, com V1 **sempre definida** — a menor velocidade
de patamar completo com `understeer` por mais de 200 ms consecutivos ou, sem nenhum patamar assim, a
velocidade mantida do patamar interrompido pela saída, de modo que nunca sair de frente até sair da faixa
cumpre V1 ≥ 1,15 × V0 —; acima, com zero ou um, `FAIL` `MEASUREMENT_MISSING`, o único caso desse motivo. Em
`REFERENCE_CORNER`, RULE-0002 e API-0003 3.3.0 (`DOMAIN/DEC-13`) tornam a permanência na faixa exigência só
da execução com acelerador cheio: com acelerador 0 o único critério é `maxUndersteerMs` ≤ 200 ms, medido em
todos os passos do arco, dentro e fora da faixa, e a saída é reportada sem reprovar. A saída exatamente a
50 km/h e o fim da varredura sem saída da faixa ficam sem decisão (lacunas deliberadas de `01-overview.md`
do F-Spec), assim como o recuo de V0 para uma linha de base que não reporta subesterço em patamar algum. A
velocidade do kart no passo da saída não é campo do registro (API-0003).

Fatos medidos pela rodada de código 2 sobre o acerto entregue `arcade-assistido-v5` (`src/physics.ts:73-83`),
registrados em `docs/physics.md:239-262` e no feedback da etapa de código de 2026-10-22
(`reports/feedback/feedback-20261022-1803.md`); nenhum é linha de base deste projeto:

- Com as alavancas de [DES-0001](../core/DES-0001-acerto-arcade-assistido-v5-e-assistencias.md), 3 103
  acertos avaliados pela etapa de código (603 por amostragem e 2 500 por subida local) chegaram a no máximo
  13 dos 15 registros em `PASS`: nenhum acerto mede V1 pelo rótulo `understeer` na varredura e, ao mesmo
  tempo, mantém a curva de referência e a volta do piloto de teste. O rótulo `understeer` de `handling()`
  (`src/physics.ts:156-163`) exige deriva dianteira > 0,09 rad **e** > 1,2 × a traseira; o kart assistido
  chega ao limite com os dois eixos derivando por igual (dianteira 0,075–0,130 rad, traseira 0,088–0,122
  rad) e o rótulo fica em `grip`; a única alavanca que puxa a dianteira acima da traseira, a folga de
  esterço (`assistSteerAllowanceRad`), não depende da velocidade — com 0,016 rad ou mais a telemetria
  reporta `understeer` já a 50 km/h com acelerador 0 (REQ-FEAT-0002-01 reprova), com 0,012 rad ou menos
  nunca. O acerto entregue completa 7 patamares acima de 50 km/h (51,8 a 62,6 km/h) sem `understeer` e sai
  da faixa a 56,1 km/h no passo 2 114, com o patamar interrompido de alvo 17,89 m/s (64,4 km/h): pela
  versão 3.2.0 de API-0003 era `MEASUREMENT_MISSING` (caso (b)); pela 3.3.0 é o fim natural, com V1 =
  64,4 km/h.
- Com acelerador 0 na curva de referência o kart entra a 50 km/h e desacelera a 34 km/h em 2 s; o limite
  de esterço por velocidade do acerto assistido cresce com a queda da velocidade
  (`atan(wheelbase × G × g / u²)`, `src/physics.ts:180-188`), o raio natural do kart aperta de 18 m para
  menos de 12,5 m e ele sai da faixa **pelo lado interno** do anel no passo 240 de 300, com `understeer`
  por no máximo 125 ms. Os acertos que mantêm a curva com acelerador 0 (`assistLateralG` ≈ 0,9 g) não fazem
  o grampo de 4,1 m da pista sintética com o piloto de teste fixo (`TEST_PILOT_LAP` sai do asfalto).
- A pista sintética tem 368,5 m; o piloto da biblioteca (`maxSpeedMps` 26, `lateralBudgetMps2` 9,5) faz a
  volta com `ARCADE_KART` em 26 703 ms e com o acerto entregue em 21 340 ms, sem passo fora do asfalto
  (`docs/physics.md:255`). `ARCADE_KART` reporta `understeer` por 808 ms consecutivos no patamar de 50 km/h e
  sai da faixa a 51,7 km/h, antes do segundo patamar completo acima de 50 km/h (`docs/physics.md:252`; bloco
  `handling-baseline`, entrada `arcade-assistido-v4`). Uma velocidade de 90 km/h só caberia na faixa (raio
  externo 23,5 m) com 2,7 g de aceleração lateral: a varredura sai da faixa muito antes de 25 m/s com
  qualquer acerto de kart.

## Decisão

1. Uma biblioteca pura `scripts/handlingBench.ts` ([DES-0004](../core/DES-0004-ensaios-de-dirigibilidade-e-saida.md))
   produz os registros; `npm test` e os dois benches a chamam. O mesmo código, três saídas.
2. Parâmetros de ensaio, fixados em `BENCH_PARAMETERS` e reportados (nunca limiares nem configuração do
   jogo): `targetSpeedMps` `50 / 3.6`; `speedHoldMode` `THROTTLE_REGULATED`; `speedHoldBandMps` 0,5
   (±1,8 km/h); `holdMs` 600; `settleWindowMs` 200; `steerInputNorm` parcial 0,5; `laneWidthM` = `WIDTH`
   (11); `arcRadiusM` 18; `cornerWindowMs` 2 500 (curva de referência, nas duas condições de acelerador);
   `entrySpeedStepMps` 0,5 (tamanho do patamar); `plateauMs` 1 000 (duração da fase mantida de cada
   patamar); `plateauSpeedHoldMode` `THROTTLE_REGULATED` (modo de manter a velocidade do patamar);
   `entrySpeedMaxMps` 25 (velocidade do último patamar, teto de segurança, decisão 8); `forcingSpeedMps`
   16,7; `forcingWindowMs` 3 000; `grassEntryIndex` 83; `grassEntryOffsetM` 0,2; `grassEntryAngleRad` 0,15;
   `grassWindowMs` 1 000; `wallApproachRad` 0,6; `wallWindowMs` 10 000; `topSpeedWindowMs` 60 000;
   `driverMassKg` 75; `runCount` 2; piloto de teste com decisão a cada 12 passos, `maxSpeedMps` 26 e
   `lateralBudgetMps2` 9,5. **Todos são fixos** e nenhum muda nesta rodada: a etapa de código ajusta o
   acerto, nunca um parâmetro de ensaio; mudar um deles é mudança deste projeto, com nova linha de base. O
   piloto de teste em particular é a régua de regressão (glossário do F-Spec): a linha de base e o acerto
   novo rodam com o mesmo piloto, e um piloto retunado mudaria a régua junto com o acerto. Os parâmetros
   que API-0003 tem como campo saem no registro; os demais na linha `#` e em `parameters` da entrada de
   `docs/physics.md` — inclusive `plateauMs` e `plateauSpeedHoldMode`, que RULE-0002 manda registrar ali
   (AC-US-0002-04).
3. Precondição não atingida é `FAIL`: um ensaio que não chega ao estado que mede não aprova o requisito. O
   que o registro de API-0003 carrega é julgado pelos campos: saída da faixa em `REFERENCE_CORNER` **só com
   acelerador cheio**, em `REAR_RECOVERY` e em `TEST_PILOT_LAP` (`offAsphaltStepCount` > 0, `OFF_ASPHALT`),
   traseira que não solta em `REAR_RECOVERY` (`gripReached` falso), nenhum contato em `WALL_CONTACT`
   (`contacts` vazia), piloto de teste que não termina ou volta invalidada (`lapTimeMs` =
   `toMs(MAX_LAP_STEPS)`). O que o ensaio vê no seu traço e nenhum campo carrega chega a
   `judge(record, observed)` pelo segundo argumento: `GRASS_LOSS` que toca a parede ou volta ao asfalto
   antes de 1 s (`THRESHOLD_EXCEEDED`), `REFERENCE_CORNER` com acelerador cheio e passos em
   `oversteer`/`sliding` (`THRESHOLD_EXCEEDED`) e, em `UNDERSTEER_ONSET`, a saída da faixa com a velocidade
   do kart abaixo de 50 km/h (`OFF_ASPHALT`; a velocidade no passo da saída não é campo). A velocidade fora
   da faixa mantida é `SPEED_NOT_HELD`. A saída da faixa da reta em `STEER_RESPONSE` e a saída da faixa do
   arco em `REFERENCE_CORNER` com acelerador 0 não alteram o veredito (API-0003, AC-US-0001-05;
   `DOMAIN/DEC-13`).
4. As lacunas deliberadas do F-Spec não ganham ensaio: nenhum registro mede inversão do esterço, redução
   parcial do esterço ou magnitude da perda na parede.
5. O cenário de `DRIFT_MANEUVER` é o do teste existente `tests/maneuvers.test.ts:68-79`, replicado na
   biblioteca com o acerto corrente e no mesmo ambiente (`TEST_PAD`); o teste existente não é alterado nem
   removido.
6. Entradas da biblioteca que vêm de fora dela, como campos opcionais de `BenchOptions`: `oldRecords`
   (os registros antigos que `SETUP_VERSION` lê; `npm test` passa os fixtures de `tests/fixtures/records.ts`;
   ausente, a biblioteca usa `builtInOldRecords()`, dois registros mínimos literais na forma anterior à
   feature) e `realistaBaseline` (a entrada do Realista lida com `readBaseline`, usada só por
   `REALISTA_UNCHANGED`; `baseline` continua sendo a entrada da versão anterior do acerto ensaiado). A
   biblioteca nunca importa de `tests/`.
7. Os agregados `NORMAL_DRIVING`, `DETERMINISM` e `REALISTA_UNCHANGED` saem um registro por ambiente, para
   que `benchEnvironment` seja sempre o ambiente em que a medida foi feita; `SETUP_VERSION` e
   `STEP_CONTRACT`, sem passo de simulação, reportam `TEST_PAD` por convenção documentada.
8. **A varredura de `UNDERSTEER_ONSET` realiza RULE-0002 em patamares, termina na primeira saída da faixa e
   tem V1 em todo fim natural** (REQ-FEAT-0002-04, -10; `DOMAIN/DEC-12`). Uma única execução contínua no
   anel de 18 m, com esterço `+1` mantido; o patamar `k` (k = 0, 1, 2, …) tem a velocidade-alvo
   `50 / 3.6 + k × entrySpeedStepMps`; o acelerador de cada passo segue `plateauSpeedHoldMode`
   `THROTTLE_REGULATED` — 1 se a velocidade do passo anterior está abaixo do alvo do patamar corrente, senão
   0 —, a mesma regra de `STEER_RESPONSE`
   ([ADR-0005](ADR-0005-pista-de-teste-como-ambiente-da-simulacao-e-velocidade-mantida.md), decisão 2),
   binária nos dois `inputMode`. Cada patamar tem uma fase de subida até o primeiro passo com a velocidade
   no alvo e uma fase mantida de `plateauMs`; o patamar está completo ao fim da fase mantida dentro da faixa;
   o patamar em que o kart sai da faixa, na subida ou na fase mantida, é o interrompido, e a sua velocidade
   mantida é o seu alvo. `maxUndersteerMsBySpeed` traz os patamares completos acima de 50 km/h; o patamar
   interrompido nunca entra nele (AC-US-0002-04). **V1** é a menor velocidade-alvo de patamar completo com
   `understeer` por mais de 200 ms consecutivos na fase mantida; quando nenhum patamar completo o teve e a
   varredura chega ao fim natural, V1 é o alvo do patamar interrompido pela saída — nos dois casos `v1Mps` é
   reportado e V1 ≥ 1,15 × V0 é avaliado com ele, de modo que nunca sair de frente até sair da faixa cumpre
   o critério; nos desfechos em que a saída reprova por si, `v1Mps` fica ausente quando nenhum patamar
   completo teve `understeer` acima de 200 ms. A velocidade do kart no passo da saída decide o resultado
   como RULE-0002 manda: abaixo de `50 / 3.6`, `OFF_ASPHALT` (pelo segundo argumento de `judge`, decisão 3);
   acima, com menos de dois pares, `MEASUREMENT_MISSING`; acima, com dois ou mais, fim natural, e o
   veredito é o de linha de base, V1 e não diminuição. Entre os motivos, a ordem é: os dois resultados da
   saída que reprovam por si (que valem com ou sem V1), `BASELINE_MISSING` (sem linha de base o critério de
   V1 não é julgado, RULE-0002, Linha de base), limiares. O fim natural nunca produz `MEASUREMENT_MISSING`
   (o caso (b) da versão 3.2.0 de API-0003 deixou de existir); um registro de fim natural sem `v1Mps` é
   malformado e faz `judge` lançar. Os dois casos que RULE-0002 não decide — saída com a velocidade
   exatamente igual a `50 / 3.6`, e fim sem saída da faixa (o patamar de `entrySpeedMaxMps` completo, ou uma
   subida que não alcança o alvo: a velocidade deixa de crescer pelo critério de `TOP_SPEED` ou
   `topSpeedWindowMs` se esgota) — não recebem veredito: a biblioteca lança um erro com o `benchId` e o
   caso, e nenhum registro é emitido. `entrySpeedMaxMps` é só o teto que garante o fim da execução. A linha
   `#` diz de onde `v1Mps` veio e, no caso sem subesterço, apresenta o motivo "sem início de subesterço até a
   saída da faixa" que API-0003 pede (apresentação, não campo).
9. **A curva de referência com acelerador 0 percorre a janela inteira e é julgada só pelos 200 ms de
   `understeer`** (REQ-FEAT-0002-01, -03, -09; `DOMAIN/DEC-13`). A execução com `THROTTLE_ZERO` avança os
   300 passos de `cornerWindowMs` qualquer que seja a posição do kart em relação à faixa: "o arco" é a
   janela, a posição do kart não tira um passo dele, e `maxUndersteerMs` é medido em todos os passos,
   dentro e fora da faixa; `offAsphaltStepCount` passa a contar os passos fora da faixa (informativo), com
   `offAsphaltFirstStep` e a posição da primeira saída, e `OFF_ASPHALT` nunca é emitido nessa condição. A
   execução com `THROTTLE_FULL` continua a parar no primeiro passo fora da faixa e a reprovar com
   `OFF_ASPHALT`, exigindo também `handling` só `grip`/`understeer` (REQ-FEAT-0003-02). Os passos fora da
   faixa da execução com acelerador 0 não entram em `NORMAL_DRIVING` (o agregado só toma passos no
   asfalto); `DETERMINISM` compara o traço inteiro.
10. **V0 nunca é tirado de uma velocidade em que a linha de base não reportou subesterço.** Serve de V0 o
    registro `UNDERSTEER_ONSET` da linha de base cujo `v1Mps` é a velocidade de um patamar completo com
    `understeer` acima de 200 ms consecutivos (`50 / 3.6`, ou o `plateauSpeedMps` de um par com
    `maxUndersteerMs > 200`), qualquer que seja o `failReason` com que a execução da linha de base o julgou;
    um `v1Mps` que veio do patamar interrompido não serve, porque o F-Spec define esse caso só para V1 e
    deixa o recuo de V0 em aberto — `BASELINE_MISSING`, nada estimado
    ([ADR-0003](ADR-0003-linha-de-base-legivel-por-maquina-em-docs-physics.md), decisões 2 e 5).

## Alternativas consideradas

- **Biblioteca em `src/`.** Não é código do jogo e usa `node:fs`; `src/` é o cliente.
  Recusada; `scripts/` é onde as diretrizes põem os benches.
- **Relógio de parede e `runtimeId()` dentro da biblioteca.** A biblioteca é camada Simulação e não pode
  ler `performance.now`; `node:perf_hooks` e `node:os` ficam no programa `scripts/keyboard-lap.ts`, que
  entrega `meanStepCostUs` e `runtimeId` já medidos em `BenchOptions.stepCost`. Recusada.
- **Biblioteca em `tests/helpers/`, ou biblioteca importando `tests/fixtures/records.ts`.** Os benches
  importariam de `tests/`, invertendo o papel das árvores. Recusada; os registros antigos entram por
  `oldRecords`.
- **`baseline` como bloco inteiro resolvido por ensaio dentro da biblioteca.** Faria a biblioteca decidir
  qual entrada é "a anterior" do Realista e qual é a do Arcade a partir de `PUBLISHED_SETUPS`, misturando
  leitura de arquivo com veredito; dois campos explícitos são mais simples de testar. Recusada.
- **Precondição decidida pelo ensaio fora de `judge`, gravando `verdict` direto.** Haveria duas fontes de
  veredito, e um teste que julga um registro sintético não reproduziria o do bench. Recusada em favor do
  segundo argumento `observed`.
- **A velocidade do kart no passo da saída como campo de `UNDERSTEER_ONSET`.** API-0003 não a tem;
  acrescentá-la mudaria o contrato. Recusada; a saída abaixo de 50 km/h chega a `judge` por `observed`, e a
  velocidade sai na linha `#`.
- **Um campo que diga de onde V1 veio, ou um valor de `failReason` para "sem início de subesterço".**
  API-0003 3.3.0 não os tem e diz que o motivo é apresentação; o caso é derivável do contrato (`v1Mps`
  maior que todo `plateauSpeedMps` da lista e nenhum par acima de 200 ms). Recusada; vai para a linha `#`.
- **Alavanca de folga de esterço dependente da velocidade em `DES-0001`, ou outro rótulo de subesterço em
  `handling()`, ou outro limiar de deriva**, para que a frente avise no asfalto antes da saída (as três
  saídas que o feedback da etapa de código ofereceu). O dono do produto decidiu de outro modo
  (`DOMAIN/DEC-12`, via F-Spec 3.3.0): o rótulo `understeer` não muda e V1 é a velocidade mantida do
  patamar interrompido quando nenhum patamar reportou subesterço. Recusadas; nenhuma alavanca é
  acrescentada e `handling()` fica como está.
- **Um veredito para os dois casos que RULE-0002 não decide** (`OFF_ASPHALT` para a saída exatamente a
  50 km/h; `THRESHOLD_EXCEEDED` para a varredura sem saída da faixa). Seria um ramo de domínio que o F-Spec
  recusou decidir. Recusada; a biblioteca lança, o que impede um registro com resultado inventado e deixa o
  caso visível ao autor.
- **Aceitar como V0 o `v1Mps` do patamar interrompido de uma linha de base que não reporta subesterço**
  (o as-built, `scripts/handlingBench.ts:311`, aceita qualquer `v1Mps` numérico). O F-Spec define o caso de
  `DOMAIN/DEC-12` para o novo acerto (V1) e deixa o recuo de V0 sem decisão; aceitá-lo seria estimar V0.
  Recusada (decisão 10); `BASELINE_MISSING`. Com a linha de base medida (`ARCADE_KART`, 808 ms a 50 km/h)
  o caso não ocorre.
- **Acelerador parcial para manter o patamar sem ativar a condição de forçar.** Em `BINARY` o acelerador do
  teclado só assume 0 ou 1, e o ensaio alimenta a simulação com a forma de `Input` do adaptador
  (RULE-0002). Recusada; os passos de acelerador 1 acima de 50 km/h são "Forçando" por RULE-0001, como em
  `REFERENCE_CORNER` com acelerador cheio.
- **Patamar como janela fixa que inclui a subida.** Com a subida lenta no arco, a velocidade do patamar não
  estaria mantida durante a medida, e o par levaria uma velocidade que o kart não teve. Recusada em favor de
  subida e fase mantida separadas.
- **Contar na lista `maxUndersteerMsBySpeed` o patamar interrompido pela saída da faixa.** RULE-0002 o
  exclui (não é velocidade medida); a duração cortada pela saída mede subesterço que continua fora do
  asfalto, onde nada é medido. Recusada; o patamar interrompido entra só em V1, no caso de `DOMAIN/DEC-12`.
- **Uma janela própria para a subida de cada patamar.** Seria mais um parâmetro; o critério de "a
  velocidade deixou de crescer" e o teto `topSpeedWindowMs` de `TOP_SPEED` já dizem quando o kart não tem
  mais como acelerar. Recusada.
- **Manter a velocidade na curva de referência com acelerador 0, janela menor que 2 500 ms, acelerador
  parcial, ou piloto de teste com entrada no grampo compatível com um acerto de 0–60 km/h em 2,5 s** (as
  saídas que o feedback da etapa de código ofereceu para SPEC-ISSUE-02). O dono do produto decidiu
  (`DOMAIN/DEC-13`) que, com acelerador 0, o único critério é o de 200 ms de `understeer` e permanecer na
  faixa não é exigido; REQ-FEAT-0002-01 mantém o acelerador em 0 e o piloto é parâmetro fixo (decisão 2).
  Recusadas.
- **Parar a execução com acelerador 0 no primeiro passo fora da faixa e medir `maxUndersteerMs` só até
  ali** (o as-built, `scripts/handlingBench.ts:273`). REQ-FEAT-0002-09 e RULE-0002 mandam continuar a medir
  em todos os passos do arco, dentro e fora da faixa; parar esconderia um subesterço fora da faixa.
  Recusada (decisão 9).
- **Campos novos no registro para a precondição de `GRASS_LOSS`.** O registro de API-0003 não os tem;
  acrescentá-los mudaria o contrato. Recusada; o motivo sai na linha `#`.
- **Piloto de teste retunável pela etapa de código.** Faria o limiar de 25 s ser atendido mudando a régua
  em vez do acerto. Recusada (decisão 2).
- **Manter o piloto do programa anterior (teto de 13 m/s).** A volta nunca desceria de 28,35 s: o
  requisito seria inalcançável por construção do ensaio, não do acerto. Recusada.
- **Tolerância numérica no `DETERMINISM`.** O F-Spec a proíbe (REQ-FEAT-0005-12). Recusada.
- **Medir custo por passo em `npm test`.** Relógio de parede em teste contraria I9; fica nos benches.
  Recusada.
- **Um único registro agregado com `benchEnvironment` arbitrário.** Tornaria o campo falso em metade das
  medidas. Recusada em favor de um registro por ambiente.

## Consequências

- `npm test` passa a executar os ensaios (algumas dezenas de segundos de simulação); a volta do piloto de
  teste roda uma vez por arquivo de teste que a precisa. Os testes `tests/dirigibilidade-*.test.ts` ainda
  não existem na árvore: até serem escritos, os registros só saem pelos benches.
- `scripts/keyboard-lap.ts` deixou de usar `LapTracker` (rodada de código 2); a classe fica exportada e
  testada como antes.
- Os parâmetros entram em `docs/physics.md` com cada entrada datada (NFR-0004), no objeto `parameters`; as
  três entradas da rodada de código 2 (`arcade-assistido-v4`, `realista-aluguel-4t-v4`,
  `arcade-assistido-v5`) já têm essa forma.
- As medidas da rodada de código 1 (curva na pista sintética; `UNDERSTEER_ONSET` por velocidades de
  entrada) não são comparáveis com as desta versão e não entram em linha de base alguma (ADR-0003,
  decisão 3). As da rodada de código 2 têm o mesmo método e a mesma geometria: a linha de base
  `arcade-assistido-v4` continua válida; só `judge` e os campos de `REFERENCE_CORNER` com acelerador 0
  mudam de significado, e a entrada `arcade-assistido-v5` é refeita pela rodada de código seguinte.
- `baselineLapTimeMs` é o tempo do mesmo piloto com `arcade-assistido-v4` (26 703 ms); o valor de cerca
  de 31 400 ms que API-0003 cita como "linha de base citada" é do programa anterior, com outro piloto, e
  não é linha de base deste ensaio (RULE-0002: linha de base é o mesmo ensaio).
- Como `ARCADE_KART` já excede 200 ms de `understeer` no patamar de 50 km/h, o V0 da linha de base é a
  velocidade do primeiro patamar (50 km/h) e o novo acerto precisa de V1 ≥ 1,15 × V0 (15,972 m/s,
  57,5 km/h); na grade dos patamares (0,5 m/s a partir de `50 / 3.6`) o primeiro alvo que atende é
  `50 / 3.6 + 2.5` (16,389 m/s, 59,0 km/h; o alvo anterior, 57,2 km/h, não atende). O registro da linha de
  base sai com `MEASUREMENT_MISSING` (a saída a 51,7 km/h vem antes do segundo patamar completo acima de
  50 km/h) e serve de V0 mesmo assim, porque o seu `v1Mps` (`50 / 3.6`) é a velocidade de um patamar
  completo com subesterço (decisão 10).
- Para `PASS`, o novo acerto não pode ter `understeer` acima de 200 ms consecutivos em patamar completo
  abaixo de 59,0 km/h e precisa, dentro da faixa, **ou** completar um patamar de 59,0 km/h ou mais com
  `understeer` acima de 200 ms consecutivos, **ou** sair da faixa acima de 50 km/h depois de pelo menos dois
  patamares completos acima de 50 km/h com o patamar interrompido de alvo 59,0 km/h ou mais (isto é, com os
  patamares até 57,2 km/h completos), sem subesterço em patamar algum; nos dois caminhos a subida de cada
  patamar acima de 50 km/h é feita sob a condição de forçar, e a não diminuição entre patamares completos
  continua exigida. O acerto entregue (7 patamares completos sem `understeer`, interrompido em 64,4 km/h)
  está no segundo caminho. A etapa de código ajusta `assistSteerAllowanceRad`, `assistLateralG` e
  `forcingRampMps` ([DES-0001](../core/DES-0001-acerto-arcade-assistido-v5-e-assistencias.md)) só se outro
  ensaio o exigir; um acerto que sai da faixa abaixo de 50 km/h, ou antes do segundo patamar completo,
  continua a reprovar com `OFF_ASPHALT` ou `MEASUREMENT_MISSING`.
- A curva de referência com acelerador 0 aprova um acerto cujo raio natural aperta ao desacelerar e sai do
  anel pelo lado interno, desde que `understeer` nunca passe de 200 ms consecutivos em nenhum dos 300
  passos; a saída fica visível em `offAsphaltStepCount`, no passo e na posição.
- Os dois casos sem decisão do F-Spec, se ocorrerem, aparecem como erro da execução de `npm test` ou do
  bench, e cabe ao autor decidi-los no seed; com a medida acima, nenhum acerto de kart chega ao teto de
  25 m/s dentro da faixa.

## Estado

Aceita nesta rodada.
