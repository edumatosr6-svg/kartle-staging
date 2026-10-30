---
id: FEAT-0002
title: Aderência em curva sem sair de frente
feature: dirigibilidade
stage: fspec
status: validated
version: 4.0.0
sources: [US-0002, AC-US-0002-05, AC-US-0002-07, AC-US-0002-08, AC-US-0002-09]
---

# FEAT-0002 — Aderência em curva sem sair de frente

## Resumo

Com o acerto Arcade assistido na sua nova versão (acerto C, `DOMAIN/DEC-15`), o kart faz a curva que o
Jogador pede. A curva é julgada na **pista de teste aberta** — asfalto sem faixa e sem paredes —, com o
kart partindo em linha reta e o esterço cheio aplicado e mantido desde o passo da partida
([RULE-0002](../rules/RULE-0002-ensaios-e-limiares.md), Medidas da curva de referência): com acelerador
cheio, partindo de 50 km/h ou de 70 km/h, o raio da trajetória 3 s depois da partida é de no máximo 13 m —
a 70 km/h o kart perde velocidade na curva em vez de abrir a trajetória; sem acelerador, partindo de
50 km/h, o kart gira pelo menos 180° em até 2 s (`DOMAIN/DEC-16`). Cada lado do esterço é ensaiado. O que
se julga é o raio e o giro, não o rótulo de aderência. Os ensaios do arco de raio 18 m e da varredura de
início do subesterço saíram com a revisão 4 do seed (`DOMAIN/DEC-15`); a pista sintética não entra em
nenhum ensaio desta funcionalidade.

## Canais

`web-desktop` e `web-mobile`: mesmos limites, com esterço cheio. No teclado o esterço cheio é a única
direção possível; na inclinação, é o ângulo mapeado para esterço 1 (ou −1). Com esterço parcial o kart
faz raio maior e gira menos por construção, e nenhum limite de raio nem de giro é fixado (lacuna deliberada
de `01-overview.md`). Sem sensor ou sem permissão: toque, esterço binário, mesmos requisitos (I4). Em
nenhum canal o Jogador pilota na pista de teste: o ensaio alimenta a simulação com a mesma forma de
`Input` que o adaptador do canal produz (`SEED/RD-06`).

## Requisitos

- REQ-FEAT-0002-11: O sistema SHALL, no estado da simulação, na pista de teste aberta, com o kart partindo
  em linha reta a 50 km/h e acelerador cheio e esterço cheio (1 ou −1, cada lado) aplicados no passo da
  partida e mantidos, apresentar raio da trajetória de no máximo 13 m medido 3 s de tempo simulado depois
  da partida (AC-US-0002-07).
- REQ-FEAT-0002-12: O sistema SHALL, no estado da simulação, na pista de teste aberta, com o kart partindo
  em linha reta a 70 km/h e acelerador cheio e esterço cheio (1 ou −1, cada lado) aplicados no passo da
  partida e mantidos, apresentar raio da trajetória de no máximo 13 m medido 3 s de tempo simulado depois
  da partida: o kart perde velocidade na curva em vez de abrir a trajetória (AC-US-0002-08).
- REQ-FEAT-0002-13: O sistema SHALL, no estado da simulação, na pista de teste aberta, com o kart partindo
  em linha reta a 50 km/h e acelerador 0 e esterço cheio (1 ou −1, cada lado) aplicados no passo da partida
  e mantidos, levar o giro do kart a pelo menos 180° (π rad) em até 2 s de tempo simulado contados da
  partida (AC-US-0002-09).
- REQ-FEAT-0002-06: O sistema SHALL conter, na saída de `npm test` ou de `npm run bench:handling`, para o
  acerto Arcade assistido e para cada lado, os registros `CORNER_RADIUS` dos requisitos 11 e 12 (com
  `entrySpeedMps`, `pathRadiusAt3sM`, `speedAt3sMps`, `handlingAt3s` e `radiusWindowMs`) e `CORNER_TURN`
  do requisito 13 (com `turnAt2sRad`, `halfTurnReachedMs` e `speedAt2sMps`), com `benchEnvironment`
  `TEST_PAD`, velocidades apresentadas também em km/h e o giro também em graus (AC-US-0002-05).
- REQ-FEAT-0002-14: O sistema SHALL julgar os requisitos 11 e 12 só pelo raio da trajetória e o requisito
  13 só pelo giro, em qualquer estado de aderência: um passo com `understeer`, ou com `oversteer` ou
  `sliding` sob a condição de forçar, não reprova nenhum dos três, e o estado no instante de medição do
  raio é reportado em `handlingAt3s` (AC-US-0002-07, AC-US-0002-08 e AC-US-0002-09, casos anormais
  "Traseira solta durante o ensaio com acelerador cheio" e "`understeer` reportado durante o ensaio").
- REQ-FEAT-0002-15: O sistema SHALL, quando a velocidade chega a 0 antes de 2 s no ensaio do requisito 13,
  contar o giro só até o passo da parada e, se até ali o giro não atingiu 180°, reportar `CORNER_TURN` como
  `FAIL` com `failReason` `THRESHOLD_EXCEEDED`, com `stoppedAtStep` e o giro atingido (AC-US-0002-09, caso
  anormal "Velocidade chega a 0 antes de 2 s").
- REQ-FEAT-0002-16: O sistema SHALL, quando a velocidade chega a 0 antes de 3 s nos ensaios dos requisitos
  11 e 12, reportar `CORNER_RADIUS` como `FAIL` com `failReason` `MEASUREMENT_MISSING` (falta de medida:
  com o kart parado o raio da trajetória não é definido), com `stoppedAtStep` e sem `pathRadiusAt3sM`
  (AC-US-0002-07 e AC-US-0002-08, caso anormal "Velocidade chega a 0 antes de 3 s").
- REQ-FEAT-0002-17: O sistema SHALL, quando o kart sai da área de asfalto declarada pelo ensaio na pista de
  teste aberta, invalidar a medição e reportar o ensaio como `FAIL` com `failReason` `TEST_AREA_EXCEEDED`,
  com `offAsphaltFirstStep` e a posição da saída, como falha do ambiente de ensaio e nunca como aprovação
  [DOMAIN] (I9; US-0002, caso anormal "Kart fora da área do ensaio").
- REQ-FEAT-0002-08: O sistema SHALL contar os 3 s dos requisitos 11 e 12 e os 2 s do requisito 13 em tempo
  simulado, sem incluir o tempo em que a simulação esteve suspensa por pausa, perda de foco da aba ou
  perda do sensor [DOMAIN] (I8; US-0002, caso anormal "Pausa, perda de foco ou perda do sensor durante a
  curva").

Numeração: os requisitos 01 a 05, 07, 09 e 10 desta funcionalidade, que realizavam os critérios retirados
do arco de raio 18 m e da varredura de início do subesterço, foram retirados com a revisão 4 do seed
(`DOMAIN/DEC-15`) e os seus números não são reutilizados; os requisitos 06 e 08 continuam, com o texto dos
ensaios de raio e giro. A tabela de migração está em `97-changelog.md`.

## Comportamento

Passo e telemetria: [FLOW-0001](../flows/FLOW-0001-passo-de-simulacao-e-hud.md),
[API-0001](../api/API-0001-telemetria-de-dirigibilidade.md). Ensaios `CORNER_RADIUS` e `CORNER_TURN`,
ambiente, área declarada e medidas: [RULE-0002](../rules/RULE-0002-ensaios-e-limiares.md),
[FLOW-0002](../flows/FLOW-0002-ensaio-deterministico-e-piloto-de-teste.md),
[API-0003](../api/API-0003-saida-dos-ensaios.md). Condição de forçar:
[RULE-0001](../rules/RULE-0001-estado-de-aderencia-e-condicao-de-forcar.md).

| Situação | Comportamento |
|---|---|
| Partida a 50 km/h ou a 70 km/h, acelerador e esterço cheios, cada lado | Raio da trajetória aos 3 s ≤ 13 m (requisitos 11 e 12); o raio é medido na janela `radiusWindowMs` centrada nos 3 s |
| Partida a 50 km/h, acelerador 0 e esterço cheio, cada lado | Giro ≥ 180° em até 2 s (requisito 13); `halfTurnReachedMs` reporta o instante |
| Traseira solta durante o ensaio com acelerador cheio | Acima de 50 km/h é a condição de forçar; `oversteer`/`sliding` não reprovam; vale só o raio, e `handlingAt3s` é reportado (requisito 14) |
| `understeer` reportado durante o ensaio | Não reprova: o raio e o giro julgam, não o rótulo (requisito 14) |
| Velocidade chega a 0 antes de 2 s (sem acelerador) | O giro conta até a parada; abaixo de 180°, `FAIL` com `THRESHOLD_EXCEEDED`, `stoppedAtStep` e o giro atingido (requisito 15) |
| Velocidade chega a 0 antes de 3 s (com acelerador cheio) | `FAIL` com `MEASUREMENT_MISSING` e `stoppedAtStep` (requisito 16) |
| Partida a 70 km/h acima da velocidade estabilizada | A velocidade de partida é imposta pelo ensaio e o kart pode perder velocidade; a regra de que a velocidade nunca passa da estabilizada ([FEAT-0003](FEAT-0003-traseira-viva-e-controlavel.md)) vale só para ensaios que partem de velocidade igual ou menor que ela |
| Esterço parcial (`web-mobile`) | Raio maior e giro menor por construção; nenhum limite fixado (lacuna deliberada) |
| Kart fora da área de asfalto declarada | `FAIL` com `TEST_AREA_EXCEEDED`, passo e posição: medição inválida, falha do ambiente (requisito 17) |
| Grama e parede | Não existem na pista de teste aberta; na pista sintética seguem [FEAT-0004](FEAT-0004-aceleracao-velocidade-grama-parede-e-hud.md), e nenhum critério de raio ou giro é medido lá |
| Pausa, perda de foco, perda do sensor | Simulação suspensa; os 2 s e os 3 s não contam a suspensão (requisito 08) |
| Sensor ausente ou permissão negada antes da volta (`web-mobile`) | Toque com estado visível; requisitos inalterados |
| Rede indisponível | Sem efeito (D-FS-08) |

## Estado

Não define estados próprios; lê `speedMps`, `headingRad`, `positionXM`, `positionZM`, `handling`,
`surface` e `simStepCount` ([API-0001](../api/API-0001-telemetria-de-dirigibilidade.md)). O raio da
trajetória e o giro são valores medidos pelo ensaio, não estados.

## Configuração

Nenhuma. Nenhuma configuração existe para forçar um evento, injetar um estado ou habilitar um caminho de
depuração. A velocidade de partida é estado inicial colocado pelo ensaio; a janela de medição do raio
(`radiusWindowMs`) e o raio da área declarada (`testAreaRadiusM`) são parâmetros de ensaio reportados e
registrados em `docs/physics.md` (NFR-0004); nenhum deles é configuração da feature.

## Critérios de aceite

- `CORNER_RADIUS` a 50 km/h, cada lado: `pathRadiusAt3sM` ≤ 13 (satisfaz AC-US-0002-07; cobre os
  requisitos 11 e 14).
- `CORNER_RADIUS` a 70 km/h, cada lado: `pathRadiusAt3sM` ≤ 13 (satisfaz AC-US-0002-08; cobre os
  requisitos 12 e 14).
- `CORNER_TURN` a 50 km/h, cada lado: `halfTurnReachedMs` ≤ 2 000; parada antes de 2 s com giro abaixo de
  π rad dá `FAIL` com `THRESHOLD_EXCEEDED` e `stoppedAtStep` (satisfaz AC-US-0002-09; cobre os requisitos
  13, 14 e 15).
- Parada antes de 3 s em `CORNER_RADIUS`: `FAIL` com `MEASUREMENT_MISSING` e `stoppedAtStep` (satisfaz
  AC-US-0002-07 e AC-US-0002-08, caso anormal; cobre o requisito 16).
- Saída da área declarada: `FAIL` com `TEST_AREA_EXCEEDED`, `offAsphaltFirstStep` e posição (satisfaz
  AC-US-0002-05, caso anormal "Kart fora da área do ensaio"; cobre o requisito 17).
- A saída de `npm test` ou de `npm run bench:handling` contém `CORNER_RADIUS` por velocidade de partida e
  lado e `CORNER_TURN` por lado, com `benchEnvironment` `TEST_PAD` e os campos nomeados no requisito 06,
  medidos em tempo simulado (satisfaz AC-US-0002-05; cobre os requisitos 06 e 08).

## Pontos em aberto

Nenhum.
