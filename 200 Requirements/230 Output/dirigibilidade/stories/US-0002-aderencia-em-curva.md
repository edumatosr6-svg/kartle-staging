---
id: US-0002
title: Aderência em curva sem sair de frente
feature: dirigibilidade
stage: req
status: validated
version: 4.1.1
sources: [SEED/US-2, SEED/RD-01, SEED/RD-05, SEED/RD-06, SEED/NF-03, SEED/IM-I9, DOMAIN/REF-01, DOMAIN/DEC-09, DOMAIN/DEC-15, DOMAIN/DEC-16]
---

# US-0002 — Aderência em curva sem sair de frente

## História

Como Jogador, quero que o kart faça a curva que eu pedi, para não sair de frente.

## Canais

- `web-desktop` e `web-mobile`: mesmos limites (raio da trajetória de no máximo 13 m 3 s depois da
  partida com acelerador cheio, partindo de 50 km/h ou de 70 km/h; giro de pelo menos 180° em até 2 s sem
  acelerador, partindo de 50 km/h), medidos no estado da simulação com esterço cheio. Nenhuma diferença de
  limite entre os canais.
- `web-desktop`: esterço cheio é a única entrada de direção que o teclado produz.
- `web-mobile`: esterço cheio corresponde à inclinação no ângulo que o adaptador mapeia para 1 (ou −1);
  com esterço parcial o kart faz raio maior e gira menos por construção, e este conjunto não fixa limite
  de raio nem de giro.
- `web-mobile` com sensor ausente ou permissão negada: controle por toque, esterço binário, mesmos
  critérios (I4).
- Em nenhum canal o Jogador pilota na pista de teste: o ensaio alimenta a simulação com a mesma forma de
  `Input` que o adaptador do canal produz (`SEED/RD-06`).

## Pré-condições

- Acerto Arcade assistido selecionado, na sua nova versão (acerto C, `DOMAIN/DEC-15`).
- Ambiente de ensaio: pista de teste aberta — asfalto sem faixa e sem paredes —, fora da pista sintética
  (`SEED/US-2`, `SEED/RD-06`).
- O kart está no asfalto, em linha reta, em estado `grip`, com esterço 0 e a velocidade de partida do
  ensaio (50 km/h ou 70 km/h); a partida é o passo em que o esterço cheio é aplicado.

## Critérios de aceite

- AC-US-0002-07: No estado da simulação, na pista de teste aberta, partindo de 50 km/h com acelerador cheio
  e esterço cheio (1 ou −1, cada lado ensaiado) aplicados no passo da partida e mantidos, o raio da
  trajetória medido 3 s de tempo simulado depois da partida é de no máximo 13 m (`SEED/US-2`, primeiro
  critério).
- AC-US-0002-08: No estado da simulação, na pista de teste aberta, partindo de 70 km/h com acelerador cheio
  e esterço cheio (1 ou −1, cada lado ensaiado) aplicados no passo da partida e mantidos, o raio da
  trajetória medido 3 s de tempo simulado depois da partida é de no máximo 13 m: o kart perde velocidade
  na curva em vez de abrir a trajetória (`SEED/US-2`, segundo critério).
- AC-US-0002-09: No estado da simulação, na pista de teste aberta, partindo de 50 km/h com acelerador 0 e
  esterço cheio (1 ou −1, cada lado ensaiado) aplicados no passo da partida e mantidos, o giro do kart
  atinge pelo menos 180° em até 2 s de tempo simulado contados da partida (`SEED/US-2`, terceiro critério;
  `DOMAIN/DEC-16`).
- AC-US-0002-05: A saída de `npm test` ou de `npm run bench:handling` contém, para o acerto Arcade
  assistido e para cada lado: no ensaio dos critérios 07 e 08, a velocidade de partida em km/h, o raio da
  trajetória em m e a velocidade em km/h medidos 3 s depois da partida, o estado de aderência nesse
  instante e a janela de medição do raio em ms; no ensaio do critério 09, o giro em graus aos 2 s, o
  instante em ms em que o giro atingiu 180° e a velocidade em km/h aos 2 s (`SEED/IM-I9`).

Numeração: os critérios 01 a 04 e 06 desta história, do arco de raio 18 m, foram retirados na revisão 4 do
seed (`DOMAIN/DEC-15`) e os seus números não são reutilizados; a tabela de migração está em
`97-changelog.md`.

## Casos anormais

- **Velocidade chega a 0 antes de 2 s** (condição sem acelerador do critério 09): o giro conta só até o
  passo em que o kart para; se até ali não atingiu 180°, o critério 09 reprova, e o ensaio reporta o passo
  da parada e o giro atingido.
- **Velocidade chega a 0 antes de 3 s** (condições com acelerador cheio dos critérios 07 e 08): com o kart
  parado o raio da trajetória não é definido no instante de medição; o ensaio reporta o passo em que a
  velocidade chegou a 0 e o critério reprova por falta de medida.
- **Traseira solta durante o ensaio com acelerador cheio**: acima de 50 km/h, acelerador e esterço cheios
  são a condição de forçar de US-0003, e a telemetria pode reportar `oversteer` ou `sliding`; os critérios
  07 e 08 julgam só o raio da trajetória, em qualquer estado de aderência, e o ensaio reporta o estado no
  instante de medição (critério 05).
- **`understeer` reportado durante o ensaio**: os critérios 07 e 08 julgam o raio e o critério 09 julga o
  giro, não o rótulo de aderência; nenhum dos três é reprovado por um passo com `understeer`.
- **Partida acima da velocidade estabilizada** (critério 08, 70 km/h): a velocidade de partida é imposta
  pelo ensaio; o kart pode perder velocidade, e a regra de US-0003 de que a velocidade nunca passa da
  estabilizada vale só para ensaios que partem de velocidade igual ou menor que ela.
- **Esterço parcial (`web-mobile`)**: raio maior que com esterço cheio, sem limite fixado pelo seed;
  nenhum limite é inventado.
- **Kart fora da área do ensaio**: a pista de teste aberta não tem faixa nem parede; o ensaio declara uma
  área de asfalto que contém a trajetória do ensaio, e um passo fora dela invalida a medição, que o ensaio
  reporta como falha do ambiente de ensaio, não como aprovação.
- **Grama e parede**: não existem na pista de teste aberta; na pista sintética seguem US-0004, e nenhum
  critério de raio é medido lá.
- **Pausa, perda de foco ou perda do sensor durante a curva**: simulação suspensa; os 2 s e os 3 s são de
  tempo simulado e não incluem a suspensão.
- **Sensor ausente ou permissão negada antes da volta (`web-mobile`)**: controle por toque com estado
  visível (I4); critérios inalterados.

## Fontes

- `SEED/US-2` — história e seus três critérios (pista de teste aberta, sem faixa e sem paredes; raio de no
  máximo 13 m depois de 3 s partindo de 50 km/h e de 70 km/h com acelerador e esterço cheios; giro de pelo
  menos 180° em até 2 s sem acelerador partindo de 50 km/h). Os valores ≈ 11,7 m e 208° que o seed dá para
  o acerto escolhido são medidas informativas, não limites.
- `SEED/RD-01` — direção comum permanece fácil; não há drift nem turbo para fazer a curva.
- `SEED/RD-05`, `DOMAIN/REF-01` — muita aderência em alta velocidade; sintoma relatado: sai de frente.
- `SEED/RD-06` — o ensaio de curva roda em ambiente de ensaio próprio, não na pista sintética.
- `SEED/NF-03` — teclado e inclinação atendem ambos.
- `SEED/IM-I9` — ensaio determinístico.
- `DOMAIN/DEC-09` — a aderência em curva é julgada só por esta história, não pelo ensaio de resposta do
  volante.
- `DOMAIN/DEC-15` — acerto C (2026-10-29): o dono do produto relatou que o kart "simplesmente não vira"; a
  curva passa a ser julgada pelo raio na pista de teste aberta, no lugar dos ensaios de esterço cheio no
  arco de raio 18 m (pontos abertos 02 e 03 e início do subesterço), que não valem para um kart que faz
  curva mais fechada que o arco.
- `DOMAIN/DEC-16` — curva sem acelerador (2026-10-30, revisão 5 do seed): sem acelerador a partir de
  50 km/h o kart já está a 4 km/h aos 3 s, e um raio medido aos 3 s não mede nada; o critério passa a ser o
  giro de pelo menos 180° em até 2 s.

## Pontos em aberto

Nenhum — o seed fixa os dois limites de raio e o limite de giro; `DOMAIN/DEC-15` substitui os pontos
abertos 02 e 03, e `DOMAIN/DEC-16` fixa a medida da curva sem acelerador.
