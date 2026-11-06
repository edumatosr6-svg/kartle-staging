---
id: US-0007
title: Acabamento visual da Kart Park
feature: pista-kart-park
stage: req
status: validated
version: 1.2.0
sources: [SEED/US-7, SEED/RD-04, SEED/RD-13, SEED/IM-I2, SEED/RE-06, SEED/RE-08, SEED/FE-06, SEED/FE-07, DOMAIN/DEC-03, DOMAIN/DEC-05]
---

# US-0007 — Acabamento visual da Kart Park

## História

Como Jogador, quero que a Kart Park tenha o acabamento de um kartódromo, para reconhecer o lugar e ler a
pista enquanto piloto.

## Canais

- `web-desktop` e `web-mobile`: o mesmo acabamento — faixa de borda, relevo da zebra, barreira de pneus
  e tons de grama —, com as mesmas medidas e o mesmo desenho da grama nos dois canais. Todo o acabamento
  fica do lado do desenho: a simulação, a pilotagem e a volta não mudam em nenhum canal (I2,
  `SEED/RD-13`, `SEED/IM-I2`).
- `web-mobile`: a vibração da zebra continua como em US-0005; com sensor de inclinação ausente ou
  permissão negada, o controle recai para toque com estado visível na tela (I4, `[DOMAIN]`), e o
  acabamento não muda.
- `web-desktop`: o som da zebra continua como em US-0005.
- A taxa de quadros com o acabamento na tela é o NFR-0002, com limite próprio por canal.

## Pré-condições

- A Kart Park carregada é a versão 2, a réplica não oficial (US-0001, NFR-0006). O acabamento é o
  aprovado na revisão 2 do seed e acompanha o traçado da versão 2: "em toda a volta" e "em toda a
  extensão" se leem sobre ela (`SEED/RE-08`).
- Para os critérios observados na tela ou na simulação da Kart Park: a Kart Park está escolhida no
  seletor e o treino foi iniciado.
- Para o critério 16: a pista sintética está escolhida no seletor e o treino foi iniciado.

## Critérios de aceite

- AC-US-0007-01: Na tela, com a Kart Park, cada uma das duas bordas do asfalto tem uma faixa branca
  contínua, desenhada por dentro do asfalto, em toda a volta.
- AC-US-0007-02: Na cena desenhada da Kart Park, a faixa branca de borda tem 0,10 m de largura, medida
  perpendicular à borda do asfalto, em toda a volta.
- AC-US-0007-03: No estado da simulação, a aderência de cada pneu sobre a faixa de borda é a mesma do
  mesmo pneu no asfalto, nas mesmas condições.
- AC-US-0007-04: No estado da simulação, um kart com rodas sobre a faixa de borda e nenhuma roda além
  da borda do asfalto não está em saída de pista.
- AC-US-0007-05: Na cena desenhada da Kart Park, cada trecho de zebra tem altura de 0 m na sua borda do
  lado do asfalto.
- AC-US-0007-06: Na cena desenhada da Kart Park, a altura de cada trecho de zebra na sua borda de fora
  é maior que 0 m e no máximo 0,05 m.
- AC-US-0007-07: No estado da simulação da Kart Park versão 2, a posição, o rumo e a velocidade de um
  kart que roda sobre a zebra, a cada passo de `STEP`, são os mesmos com o relevo da zebra desenhado e
  sem ele, para a mesma sequência de entradas: o kart não sobe, não pula e não é desviado pela zebra
  (`SEED/RD-13`).
- AC-US-0007-08: Com o relevo da zebra desenhado, no estado da simulação, a aderência de cada pneu sobre
  a zebra satisfaz o critério 06 de US-0005, observada como lá.
- AC-US-0007-09: Na tela, com a Kart Park, a barreira de US-0004 aparece como uma fileira de pneus
  pretos empilhados em toda a extensão da barreira.
- AC-US-0007-10: Na cena desenhada da Kart Park, a pilha de pneus tem 0,9 m de altura em toda a
  extensão da barreira.
- AC-US-0007-11: Na cena desenhada da Kart Park, de cada um dos dois lados da barreira, a face dos pneus
  fica a no máximo 0,05 m da face de colisão da barreira do arquivo de pista, em todo ponto da barreira.
- AC-US-0007-12: Na cena desenhada da Kart Park, nenhum pneu da barreira fica sobre o asfalto nem sobre
  a zebra.
- AC-US-0007-13: Na tela, com a Kart Park, a grama mostra ao menos 2 tons de verde.
- AC-US-0007-14: Na cena desenhada da Kart Park, o tom de grama atribuído a cada posição do chão, em
  metros do mundo do jogo, é o mesmo em duas aberturas da Kart Park, no mesmo aparelho ou em aparelhos
  diferentes.
- AC-US-0007-15: No estado da simulação, a aderência de uma roda sobre qualquer tom de grama é a
  aderência da grama, a mesma para todos os tons.
- AC-US-0007-16: Na tela, com a pista sintética, a imagem de um mesmo estado do kart e da câmera é a
  mesma que no jogo de antes da revisão 2: sem faixa de borda, sem relevo de zebra, sem barreira de pneus
  e com a grama na cor de antes (`SEED/RE-06`).
- AC-US-0007-17: Na Kart Park, uma volta em que o kart roda com rodas sobre a faixa de borda por mais de
  1000 ms, sem nenhuma roda além da borda do asfalto, não é invalidada por corte no estado da simulação.
- AC-US-0007-18: Em `web-mobile`, com o relevo da zebra desenhado, a vibração da zebra satisfaz
  os critérios 07 e 08 de US-0005, observada como lá.
- AC-US-0007-19: Em `web-desktop`, com o relevo da zebra desenhado, o som da zebra satisfaz os critérios 09
  a 12 de US-0005, observado como lá.
- AC-US-0007-20: Na tela, com a Kart Park, a luminância relativa (definição da WCAG 2) de cada tom de
  grama difere da luminância relativa de `#68865b` entre 8 % e 20 % desse valor de referência.
- AC-US-0007-21: No estado da simulação, uma roda sobre qualquer tom de grama tem o estado de superfície
  da grama, o mesmo para todos os tons.

## Casos anormais

- **Kart contra a barreira de pneus em qualquer velocidade, de qualquer lado**: o kart para na face de
  colisão da barreira (critérios 04 e 05 de US-0004), que fica a no máximo 0,05 m dos pneus que o Jogador
  vê (critério 11); o kart não entra nos pneus nem para antes deles mais que 0,05 m.
- **Faixa de borda sob uma zebra ou na linha de largada**: a faixa segue contínua por dentro do asfalto
  (critério 01); a zebra, que fica fora do asfalto, não a cobre, e a linha de largada não a interrompe.
- **Troca de pista no seletor (Kart Park para a sintética e de volta)**: a sintética aparece sem nenhum
  elemento do acabamento (critério 16), e a Kart Park volta com o mesmo desenho da grama (critério 14).
- **Aparelho diferente, tela redimensionada ou orientação girada (`web-mobile`)**: o desenho da grama e
  as medidas do acabamento não mudam (critérios 02, 06, 10, 11 e 14); só muda o enquadramento.
- **Sem rede depois de o jogo abrir**: o acabamento não usa foto de satélite nem textura baixada da rede
  (`SEED/FE-07`), e o jogo segue jogável sem servidor (NFR-0004).
- **Aparelho que não sustenta a taxa de quadros com o acabamento**: é falha do NFR-0002; o acabamento
  não é retirado para cumpri-lo, e a simulação não muda (critério 07, NFR-0013).
- **Sensor de inclinação ausente ou permissão negada (`web-mobile`)**: o controle recai para toque com
  estado visível (I4); o acabamento e a simulação não mudam.

## Fontes

- `SEED/US-7` — história e seus onze critérios, inalterados na revisão 3.
- `SEED/RD-04` — asfalto, zebras, grama e barreiras (RF07).
- `SEED/RD-13` — faixa de borda, relevo da zebra, pneus e tons da grama são só desenho (I2, decisão de
  2026-11-03).
- `SEED/IM-I2` — o acabamento fica todo do lado do desenho.
- `SEED/RE-08` — o acabamento continua o mesmo e passa a acompanhar o traçado novo.
- `SEED/RE-06` — a aparência da pista sintética não muda.
- `SEED/FE-06`, `SEED/FE-07` — relevo da zebra fora da física; nada de foto de satélite nem textura
  baixada.
- `DOMAIN/DEC-03` — a barreira de US-0004, onde o kart bate e não passa.
- `DOMAIN/DEC-05` — a aderência e a vibração da zebra que o relevo não muda.

## Pontos em aberto

Nenhum — nem a revisão 2 nem a revisão 3 do seed abrem ponto novo, e os números do acabamento vêm do
seed.
