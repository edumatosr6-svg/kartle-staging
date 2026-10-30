---
id: US-0003
title: Câmera atrás e perto do kart
feature: modelo-kart-01
stage: req
status: validated
version: 1.4.0
sources: [SEED/US-3, SEED/RD-01, SEED/RD-04, SEED/IM-I9, DOMAIN/DEC-03, DOMAIN/DEC-04, DOMAIN/DEC-06, DOMAIN/DEC-07, DOMAIN/DEC-08]
---

# US-0003 — Câmera atrás e perto do kart

## História

Como Jogador, quero a câmera atrás e perto do kart, para sentir velocidade e proximidade da pista.

## Canais

- `web-desktop` e `web-mobile`: a mesma pose de corrida, a mesma visão geral antes da contagem, a mesma
  descida durante a contagem e a mesma permanência na pose de corrida depois do fim de uma volta: na volta
  oficial, em relação ao kart parado, com a simulação parada e o painel de resultado exibido; no treino, em
  relação ao kart que continua pilotável e em movimento.
- Diferença por forma da área de jogo (`DOMAIN/DEC-03`): em paisagem, o campo de visão vertical é de 62°;
  em retrato, o campo de visão horizontal é de pelo menos 60° e o vertical não fica abaixo de 62°.
  `web-mobile` usa as duas formas, conforme o Jogador segura o celular; `web-desktop` usa a regra de
  paisagem, e a de retrato só quando a janela é mais alta que larga.
- `web-mobile` com sensor ausente ou permissão negada: o controle recai para toque com estado visível (I4);
  a câmera não muda.

## Pré-condições

- Kart 01 em cena (US-0001).
- Para os critérios de corrida: o Jogador em corrida, do sinal verde até a próxima visão geral da pista,
  inclusive depois do fim de uma volta, válida ou invalidada: na volta oficial, com o painel de resultado
  exibido, a simulação parada e o kart congelado (`DOMAIN/DEC-06`); no treino, com o kart pilotável, porque
  as voltas são seguidas (`DOMAIN/DEC-07`).
- Para os critérios de largada: a contagem regressiva e o sinal verde que o jogo já tem.
- Para o critério 13: o fim da volta oficial (`ENDED`) e o painel de resultado que o jogo já tem, com a
  simulação parada e o kart congelado como hoje (invariante INV-1 de `race-lap-validation`, que esta
  feature não muda).
- Para o critério 14: o treino com voltas seguidas que `race-lap-validation` define (revisão 3, US-10), em
  que o kart não congela ao fim de uma volta (`DOMAIN/DEC-07`); esta feature não muda esse comportamento.

## Critérios de aceite

- AC-US-0003-01: Em corrida, em cada quadro, a câmera da cena exibida na tela está 1,38 m acima do chão
  (`SEED/US-3`, primeiro critério; `SEED/IM-I9`).
- AC-US-0003-02: Em corrida, em cada quadro, a câmera da cena exibida está 3,05 m atrás da posição do kart,
  medidos no chão ao longo do rumo do kart, no sentido oposto a ele (`SEED/US-3`, primeiro critério).
- AC-US-0003-03: Em corrida, em cada quadro, a câmera da cena exibida mira um ponto 3,2 m à frente da
  posição do kart, ao longo do rumo, e 0,30 m acima do chão (`SEED/US-3`, primeiro critério).
- AC-US-0003-04: Em corrida, em paisagem, o campo de visão vertical da cena exibida é de 62° em todos os
  quadros (`SEED/US-3`, primeiro critério; `DOMAIN/DEC-03`; `DOMAIN/DEC-08`: só o campo de visão base).
- AC-US-0003-05: Em corrida, em retrato, o campo de visão horizontal da cena exibida é de pelo menos 60° em
  todos os quadros (`DOMAIN/DEC-03`; `DOMAIN/DEC-08`).
- AC-US-0003-06: Em corrida, em retrato, o campo de visão vertical da cena exibida não fica abaixo de 62°
  em nenhum quadro (`DOMAIN/DEC-03`: "o vertical cresce em retrato"; `DOMAIN/DEC-08`).
- AC-US-0003-07: Em corrida, a câmera acompanha o rumo do kart sem corte: entre dois quadros consecutivos,
  a direção horizontal para onde a câmera mira muda exatamente o quanto muda o rumo do kart exibido
  (`SEED/US-3`, segundo critério).
- AC-US-0003-08: Numa curva de 90° feita a 50 km/h, em paisagem e em retrato, o kart exibido fica inteiro
  dentro do quadro na tela em todos os quadros da curva (`SEED/US-3`, segundo critério).
- Critério 09 desta história (efeito de turbo no campo de visão, aplicado a partir da base de 62°):
  retirado em 2026-10-29 pelo seed `revision: 3`, que tirou o terceiro critério de `SEED/US-3`, e por
  `DOMAIN/DEC-08`: com o turbo fora do jogo, a câmera de corrida tem só o campo de visão base (critérios
  04 a 06). O número 09 não é reaproveitado.
- AC-US-0003-10: Antes do início da contagem regressiva, a tela mostra a visão geral da pista: a pista
  vista do alto, inteira no quadro (`DOMAIN/DEC-04`).
- AC-US-0003-11: Durante a contagem regressiva, a câmera desce da visão geral para trás do piloto: a altura
  da câmera acima do chão diminui ao longo da contagem e não aumenta em nenhum quadro da contagem
  (`DOMAIN/DEC-04`).
- AC-US-0003-12: No quadro do sinal verde, a câmera já está na pose de corrida: 1,38 m acima do chão,
  3,05 m atrás da posição do kart e mirando o ponto 3,2 m à frente e 0,30 m acima do chão
  (`DOMAIN/DEC-04`).
- AC-US-0003-13: Na volta oficial, do quadro em que a volta termina (`ENDED`), válida ou invalidada,
  inclusive por reposicionamento, com o painel de resultado exibido na tela, até o quadro anterior à
  próxima visão geral da pista, a câmera da cena exibida está, em todos os quadros, na pose de corrida em
  relação ao kart exibido, parado (1,38 m acima do chão, 3,05 m atrás da posição do kart e mirando o ponto
  3,2 m à frente e 0,30 m acima do chão, critérios 01 a 03), sem voltar à visão geral: a visão geral
  existe só antes da contagem regressiva (`DOMAIN/DEC-06`; `DOMAIN/DEC-07`: o congelamento vale só para a
  volta oficial).
- AC-US-0003-14: No treino, do quadro em que uma volta termina, válida ou invalidada, inclusive por
  reposicionamento, até o quadro anterior à próxima visão geral da pista, a câmera da cena exibida está, em
  todos os quadros, na pose de corrida em relação ao kart exibido, que continua na posição e no rumo que a
  simulação informa a cada quadro (critérios 01 a 03, com o kart em movimento), sem voltar à visão geral
  (`DOMAIN/DEC-07`: no treino o kart não congela e a câmera continua atrás do piloto).

## Casos anormais

- **Reposicionamento do kart em corrida**: no primeiro quadro depois do reposicionamento, a câmera está na
  pose de corrida em relação à nova posição e ao novo rumo do kart; a mudança de visada é igual à mudança
  de rumo do kart (critério 07), por isso não é corte. Quando o reposicionamento invalida a volta oficial,
  a volta termina, a simulação para, o kart congela e a câmera continua na pose de corrida em relação ao
  kart parado (critério 13). Quando invalida uma volta de treino, o kart não congela e a câmera continua na
  pose de corrida em relação ao kart em movimento (critério 14).
- **Fim da volta oficial, válida ou invalidada, com o painel de resultado exibido**: no quadro em que a
  volta termina (`ENDED`) e em todos os seguintes, a simulação está parada e o kart congelado, como hoje
  (invariante INV-1 de `race-lap-validation`, que esta feature não muda); o painel de resultado aparece
  sobre a cena sem mover a câmera, e a câmera fica na pose de corrida em relação ao kart parado (critério
  13), com a regra de campo de visão da forma da área de jogo (critérios 04 a 06); como o rumo do kart
  parado não muda, a visada da câmera não muda entre quadros (critério 07, com mudança de rumo nula). A
  próxima visão geral da pista é a de antes de uma nova contagem regressiva (critério 10); até lá, nenhum
  quadro mostra a visão geral (`DOMAIN/DEC-06`).
- **Fim de uma volta de treino**: as voltas são seguidas (`DOMAIN/DEC-07`); o kart não congela, e a câmera
  continua na pose de corrida em relação ao kart em movimento (critério 14), acompanhando o rumo sem corte
  (critério 07) e com a regra de campo de visão da forma da área de jogo (critérios 04 a 06); nenhum quadro
  mostra a visão geral até a próxima contagem regressiva (critério 10). O que o jogo faz no fim de uma
  volta de treino é de `race-lap-validation`; esta feature só fixa a câmera.
- **Rodada ou derrapagem forte**: a câmera acompanha o rumo do kart, não a direção do movimento; numa rodada
  de 180°, a câmera gira junto com o kart.
- **Marcha à ré**, se a simulação a informar: a câmera continua atrás do kart em relação ao rumo; o kart se
  move em direção à câmera.
- **Troca de orientação do celular ou redimensionamento da janela em corrida**: no quadro seguinte vale a
  regra de campo de visão da nova forma da área de jogo (critérios 04 a 06); a pose de corrida não muda.
- **Comando que antes acionava o turbo**: não há mais turbo (`DOMAIN/DEC-07`); nenhuma tecla, toque ou
  inclinação muda o campo de visão, que fica no valor base da forma da área de jogo (critérios 04 a 06;
  `DOMAIN/DEC-08`).
- **Kart junto a uma parede ou a uma borda**: a pose de corrida não muda; o seed não pede desvio da câmera
  por obstáculo.
- **Pausa em corrida**: a simulação não avança; a câmera fica na pose de corrida em relação ao kart parado.
- **Pausa ou suspensão durante a contagem regressiva**: a descida acompanha a contagem; enquanto a contagem
  não avança, a câmera não desce, e no sinal verde vale o critério 12.
- **Recarga da página antes da largada**: se a recarga leva de novo a antes da contagem, vale o critério 10,
  e a descida recomeça com a nova contagem.
- **Sensor ausente ou permissão negada (`web-mobile`)**: o controle recai para toque com estado visível
  (I4); a câmera não muda.

## Fontes

- `SEED/US-3` — história e seus dois critérios na `revision: 3` (pose e campo de visão; rumo sem corte e
  curva de 90° a 50 km/h).
- `SEED/RD-04` — a câmera vem da ficha "Kart 01 — Kartle".
- `SEED/RD-01` — a câmera mostra o estado da simulação e não decide nada.
- `SEED/IM-I9` — os critérios de câmera são verificados em tela.
- `DOMAIN/DEC-03` — campo de visão em retrato e em paisagem.
- `DOMAIN/DEC-04` — visão geral antes da contagem, descida durante a contagem, pose de corrida no sinal
  verde.
- `DOMAIN/DEC-06` — câmera depois do fim da volta, na redação corrigida pelo dono do produto em 2026-10-22
  após feedback do D-Spec: ao fim da volta (`ENDED`), a simulação para e o kart congela, como hoje
  (invariante INV-1 de `race-lap-validation`, que não muda); a decisão descreve só a câmera: pose de
  corrida mantida em relação ao kart parado, com o painel de resultado exibido, até a próxima visão geral;
  a visão geral existe só antes da contagem regressiva; "em corrida", para a câmera, não termina em
  `ENDED` (critério 13; seção Canais; pré-condições; casos anormais "Reposicionamento do kart em corrida" e
  "Fim da volta oficial").
- `DOMAIN/DEC-07` — decisão de 2026-10-29: no treino as voltas são seguidas (`race-lap-validation`
  revisão 3, US-10), o kart não congela ao fim de uma volta de treino e a câmera continua atrás do piloto;
  o congelamento de `DOMAIN/DEC-06` vale só para a volta oficial (critérios 13 e 14; seção Canais;
  pré-condições; casos anormais "Reposicionamento do kart em corrida", "Fim da volta oficial", "Fim de uma
  volta de treino" e "Comando que antes acionava o turbo").
- `DOMAIN/DEC-08` — decisão de 2026-10-29: sem efeito de turbo na câmera; a câmera de corrida tem só o
  campo de visão base, 62° e a regra de retrato (critérios 04 a 06; retirada do critério 09; caso anormal
  "Comando que antes acionava o turbo").

## Pontos em aberto

Nenhum — `DOMAIN/DEC-03` e `DOMAIN/DEC-04` fecham os pontos abertos 03 e 04 do seed; `DOMAIN/DEC-06` e
`DOMAIN/DEC-07` fecham a câmera depois do fim da volta, oficial e de treino; o seed `revision: 3` e
`DOMAIN/DEC-08` fecham o efeito de turbo no campo de visão.
