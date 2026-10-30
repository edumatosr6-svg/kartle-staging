---
id: ADR-0004
title: Ensaios como biblioteca em scripts/ compartilhada por npm test e pelos benches; parâmetros de ensaio fixados; medidas do raio e do giro; DRIFT_INERT e SPEED_CAP
feature: dirigibilidade
stage: dspec
status: validated
version: 5.0.0
sources: [API-0003, RULE-0002, FLOW-0002, FEAT-0001, FEAT-0002, FEAT-0003, FEAT-0004, FEAT-0005, FEAT-0006, REQ-FEAT-0001-06, REQ-FEAT-0001-09, REQ-FEAT-0002-06, REQ-FEAT-0002-14, REQ-FEAT-0002-15, REQ-FEAT-0002-16, REQ-FEAT-0002-17, REQ-FEAT-0003-08, REQ-FEAT-0003-13, REQ-FEAT-0003-16, REQ-FEAT-0003-17, REQ-FEAT-0004-07, REQ-FEAT-0005-03, REQ-FEAT-0005-04, REQ-FEAT-0006-04, REQ-FEAT-0006-05, NFR-0001, NFR-0003, NFR-0007, NFR-0009]
---

# ADR-0004 — Ensaios como biblioteca em scripts/ compartilhada por npm test e pelos benches; parâmetros de ensaio fixados; medidas do raio e do giro; DRIFT_INERT e SPEED_CAP

## Contexto

Os critérios nomeiam "a saída de `npm test` ou de `npm run bench:handling`/bench de física" como ponto de
observação dos mesmos registros (API-0003). A biblioteca `scripts/handlingBench.ts` e os dois programas de
bench existem (rodadas de código 1 a 4) e realizam a versão 4.1.0 desta decisão. O F-Spec 4.0.1 (seed
`revision: 5`, `DOMAIN/DEC-15`, `DOMAIN/DEC-16`) troca a curva de referência: saem o arco de 18 m e a
varredura de início do subesterço; entram o raio da trajetória aos 3 s com acelerador e esterço cheios
(50 km/h e 70 km/h) e o giro de pelo menos 180° em até 2 s sem acelerador, na pista de teste aberta, julgados
em qualquer estado de aderência; a recuperação passa à pista de teste aberta, cada lado, com a traseira que
não solta reportada sem reprovar; entram `DRIFT_INERT` (o comando de drift não muda o estado) e `SPEED_CAP` (a
velocidade nunca passa da estabilizada); a condução normal passa a ser a volta do piloto de teste inteira. O
F-Spec deixa ao ensaio a janela de medição do raio (`radiusWindowMs`), o raio da área declarada
(`testAreaRadiusM`), a velocidade de partida e a duração máxima do forçar da recuperação, e define o raio como
"a velocidade dividida pela taxa de variação da direção do movimento" numa janela centrada nos 3 s. A
telemetria passa a expor posição e rumo (API-0001 2.0.0).

Medido nesta rodada com a biblioteca as-built e o acerto C em memória (informação, não linha de base): raio de
11,67 m e 11,76 m aos 3 s, giro de 208° em 2 s; sob a condição de forçar a 55–69 km/h, de qualquer lado, a
traseira do acerto C não solta em 3 s no asfalto aberto (desacelera a cerca de 54 km/h em `understeer`);
`ARCADE_KART` e `RENTAL_KART`, nos mesmos ensaios, ficam a até 53 m e 40 m da partida.

## Decisão

1. Uma biblioteca pura `scripts/handlingBench.ts` ([DES-0004](../core/DES-0004-ensaios-de-dirigibilidade-e-saida.md))
   produz os registros; `npm test` e os dois benches a chamam. O mesmo código, três saídas.
2. **Parâmetros de ensaio fixos e reportados** (nunca limiares nem configuração do jogo), em
   `BENCH_PARAMETERS`: `targetSpeedMps` `50 / 3.6`, `speedHoldMode` `THROTTLE_REGULATED`, `speedHoldBandMps`
   0,5, `holdMs` 600, `settleWindowMs` 200, `steerInputNormPartial` 0,5, `testAreaRadiusM` 100,
   `straightTestAreaRadiusM` 1 500, `radiusWindowMs` 200, `forcingSpeedMps` 16,7, `forcingWindowMs` 3 000,
   `grassEntryIndex` 83, `grassEntryOffsetM` 0,2, `grassEntryAngleRad` 0,15, `grassWindowMs` 1 000,
   `wallApproachRad` 0,6, `wallWindowMs` 10 000, `topSpeedWindowMs` 60 000, `maxSpeedMps` 26,
   `lateralBudgetMps2` 9,5, `driverMassKg` 75, `runCount` 2, piloto de teste com decisão a cada 12 passos. A
   etapa de código ajusta o acerto, nunca um parâmetro de ensaio; mudar um deles é mudança deste projeto, com
   nova linha de base. O piloto de teste é a régua de regressão.
3. **Área declarada por ensaio.** Toda execução na pista de teste aberta começa na origem e para no primeiro
   passo fora do disco declarado, com `TEST_AREA_EXCEEDED` como primeiro motivo do veredito: medição inválida,
   nunca aprovação nem reprovação da dirigibilidade. Dois raios: 100 m para os ensaios de curva, resposta e
   recuperação, que contêm com folga as trajetórias medidas dos três acertos; 1 500 m para a reta de aceleração
   e velocidade estabilizada, que contém `topSpeedWindowMs` a qualquer velocidade abaixo de 25 m/s.
4. **Raio da trajetória pela posição.** Na janela de 24 passos centrada no passo 360, o raio é o caminho
   percorrido dividido pela variação acumulada da direção do deslocamento, cada variação ponderada pelo
   caminho em que acontece; trajetória reta dá `Number.MAX_VALUE` e reprova. A posição é a de API-0001; nenhuma
   grandeza fora do contrato é lida. Conferido nesta rodada: 11,671 m e 11,765 m com o acerto C, iguais aos
   medidos pelo dono do produto (≈ 11,7 m).
5. **Giro pelo rumo acumulado.** `turn_j = headingRad_j − headingRad_0`, sem reduzir a uma volta; o critério
   usa o módulo, e `halfTurnReachedMs` é o primeiro passo com módulo ≥ π até 2 s. Com o kart parado antes de
   2 s, o giro conta até o passo da parada (o rumo não muda depois dela).
6. **Partida e instantes.** A partida é o passo 1; "3 s" é o estado depois do passo 360 e "2 s" o do passo 240,
   em tempo simulado.
7. **Precondição não atingida é `FAIL`; o que o registro carrega é julgado pelos campos.** Saída da área
   (`TEST_AREA_EXCEEDED`), parada antes de 3 s em `CORNER_RADIUS` (`MEASUREMENT_MISSING`), velocidade não
   mantida (`SPEED_NOT_HELD`), lista de contatos vazia (`MEASUREMENT_MISSING`), traseira solta sem `grip`
   (`gripReached` falso), piloto de teste que não termina (`lapTimeMs` = `toMs(MAX_LAP_STEPS)`). Só a
   precondição de `GRASS_LOSS` (grama mantida, sem parede), que nenhum campo carrega, chega a `judge` pelo
   segundo argumento. A traseira que não solta não é precondição: é o caso anormal que REQ-FEAT-0003-17
   decide sem reprovação.
8. **Recuperação na pista de teste aberta, cada lado.** Forçar a partir de 16,7 m/s até a traseira soltar sob
   a condição de forçar, ou até 3 s; o passo de soltura é o primeiro com esterço 0, que o próprio ensaio
   aplica. `rearReleased` e `forcingMs` sempre; `gripReached`, `recoveryMs` e `maxSideslipRad` só com a
   traseira solta.
9. **`DRIFT_INERT` por reaplicação de sequências gravadas.** As sequências de `Input` da volta do piloto de
   teste e de `REAR_RECOVERY` (lado +1) são reaplicadas duas vezes ao mesmo estado inicial, sem e com
   `drift: true` em todos os passos, e comparadas passo a passo em posição, velocidade, rumo, estado de
   aderência e derrapagem lateral, por igualdade estrita.
10. **`SPEED_CAP` sobre os traços da mesma execução.** Maior `speedMps` depois de qualquer passo dos ensaios
    que partem de velocidade igual ou menor que `topSpeedMps` (inclusive as execuções de `DRIFT_INERT` com o
    comando), contra o `topSpeedMps` de `TOP_SPEED` da mesma execução.
11. **Agregados e convenções de ambiente.** `DETERMINISM` e `REALISTA_UNCHANGED` saem um registro por ambiente;
    no de `TEST_PAD`, os campos da área agregam os ensaios cobertos (maior raio, soma das contagens, primeira
    saída). `NORMAL_DRIVING` sai um registro, em `SYNTHETIC_TRACK`. `SPEED_CAP`, `SETUP_VERSION` e
    `STEP_CONTRACT` reportam `SYNTHETIC_TRACK` por convenção, e `STEP_COST`, o ambiente da volta que mede.
12. **Entradas da biblioteca que vêm de fora dela**, como campos opcionais de `BenchOptions`: `oldRecords`
    (fixtures em `npm test`, `builtInOldRecords()` quando ausente), `realistaBaseline`, `baseline`,
    `measuredAtUtc`, `stepCost`. A biblioteca nunca importa de `tests/`.
13. As lacunas deliberadas do F-Spec não ganham ensaio: nenhum registro mede inversão do esterço, redução
    parcial do esterço, raio ou giro com esterço parcial, ou magnitude da perda na parede.

## Alternativas consideradas

- **Biblioteca em `src/` ou em `tests/helpers/`; relógio de parede e `runtimeId()` na biblioteca.** Recusadas
  pelos motivos da versão anterior: não é código do jogo, inverteria o papel das árvores, e a biblioteca é
  camada Simulação.
- **Raio pela velocidade e pela taxa de guinada (`speedMps / |yawRateRadPerS|`).** A guinada é a rotação do
  corpo, não a do movimento: sob derrapagem as duas diferem, e o glossário define o raio pela direção do
  movimento. Recusada.
- **Raio pela direção da velocidade no estado.** Exigiria ler `vx`/`vz`, que API-0001 não expõe. Recusada em
  favor da posição, que o contrato expõe para isto.
- **Raio por ajuste de círculo a três posições.** Sensível ao ruído de passo e mais difícil de explicar na
  linha `#`; a soma ponderada dá o mesmo valor no movimento estacionário. Recusada.
- **Uma área declarada única para todos os ensaios (1 500 m).** Tornaria a área sem efeito nos ensaios de
  curva, onde um kart que se afasta 100 m da partida não está fazendo a curva medida. Recusada.
- **Rodar `ACCELERATION` e `TOP_SPEED` na faixa reta antiga (`testPadLane`).** A pista de teste do F-Spec 4.0.1
  é aberta, sem faixa; `TEST_PAD` passou a significar isso. Recusada.
- **`SPEED_CAP` com o `benchEnvironment` do ensaio da velocidade máxima.** O registro passaria a carregar uma
  área declarada que não é dele quando a máxima vem da pista de teste. Recusada em favor da convenção.
- **Variar a velocidade de partida da recuperação até a traseira soltar.** Seria escolher o parâmetro para o
  ensaio dar um resultado; o F-Spec decide o caso da traseira que não solta. Recusada.
- **Um registro `REAR_RECOVERY` com acelerador zerado na soltura.** API-0003 não tem campo que distinga a
  variante; REQ-FEAT-0003-09 é verificado por `step` em `npm test` (test-strategy). Recusada.
- **Manter o classificador de passo para `NORMAL_DRIVING`.** A condução normal passou a ser a volta inteira,
  sem exclusão (RULE-0001 4.0.0). Recusada; o classificador sai
  ([ADR-0005](ADR-0005-pista-de-teste-como-ambiente-da-simulacao-e-velocidade-mantida.md)).
- **Tolerância numérica em `DETERMINISM` ou em `DRIFT_INERT`.** O F-Spec a proíbe (REQ-FEAT-0005-12;
  "o mesmo estado"). Recusada.
- **Medir custo por passo em `npm test`.** Relógio de parede em teste contraria I9. Recusada.
- **Manter as decisões 8, 9 e 10 da versão 4.1.0** (varredura de `UNDERSTEER_ONSET`, janela de
  `maxUndersteerMs` na curva com acelerador 0, V0 só de patamar completo). Sem objeto: os ensaios e os campos
  saíram com `DOMAIN/DEC-15`. Retiradas.

## Consequências

- `npm test` executa todos os ensaios; a volta do piloto de teste roda uma vez por suíte e é reaplicada duas
  vezes por `DRIFT_INERT`.
- Com o acerto C, `REAR_RECOVERY` sai com `rearReleased` falso e `PASS`: a recuperação de 400 ms não tem passo
  de partida no acerto entregue, e a sua lógica de veredito é provada em `npm test` sobre registros sintéticos
  (test-strategy). Isso é visível no registro (`rearReleased`, `forcingMs`) e foi proposto ao autor.
- As linhas de base são medidas de novo com estes ensaios
  ([ADR-0003](ADR-0003-linha-de-base-legivel-por-maquina-em-docs-physics.md)); as medidas das versões
  anteriores deste projeto não são comparáveis e ficam só na prosa datada.

## Estado

Aceita nesta rodada.
