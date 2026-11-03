---
id: FEAT-0008
title: Acabamento visual da Kart Park
feature: pista-kart-park
stage: fspec
status: validated
version: 1.1.0
sources: [US-0007, NFR-0002, NFR-0004, NFR-0013, NFR-0014, AC-US-0007-01, AC-US-0007-02, AC-US-0007-03, AC-US-0007-04, AC-US-0007-05, AC-US-0007-06, AC-US-0007-07, AC-US-0007-08, AC-US-0007-09, AC-US-0007-10, AC-US-0007-11, AC-US-0007-12, AC-US-0007-13, AC-US-0007-14, AC-US-0007-15, AC-US-0007-16, AC-US-0007-17, AC-US-0007-18, AC-US-0007-19, AC-US-0007-20, AC-US-0007-21]
---

# FEAT-0008 — Acabamento visual da Kart Park

## Resumo

Dá à Kart Park, para o Jogador, o acabamento de um kartódromo: uma faixa branca de 0,10 m por dentro de
cada borda do asfalto, a zebra com relevo desenhado, a barreira de US-0004 como uma fileira de pneus pretos
empilhados de 0,9 m e a grama em ao menos 2 tons de verde. Todo o acabamento é desenho (I2, `SEED/RD-13`):
a simulação, a pilotagem, a volta, os setores e o arquivo de pista publicado não mudam (NFR-0013,
NFR-0014). A pista sintética continua com a aparência de antes.

## Canais

| Canal | O que muda |
|---|---|
| `web-desktop` e `web-mobile` | O mesmo acabamento, com as mesmas medidas e o mesmo desenho da grama, medidos em metros do mundo do jogo; a simulação não muda em nenhum dos dois |
| `web-mobile` | A vibração da zebra continua a de [FEAT-0005](FEAT-0005-zebra-com-efeito.md). Sem sensor de inclinação ou com permissão negada, o controle recai para toque com estado visível (I4); o acabamento não muda |
| `web-desktop` | O som da zebra continua o de [FEAT-0005](FEAT-0005-zebra-com-efeito.md) |

A taxa de quadros com o acabamento na tela é a de [FEAT-0007](FEAT-0007-requisitos-transversais.md)
(requisitos 01 e 02, NFR-0002).

## Requisitos

- REQ-FEAT-0008-01: O sistema SHALL desenhar, na tela de corrida com a Kart Park, uma faixa branca
  contínua junto a cada uma das duas bordas do asfalto, por dentro do asfalto, em toda a volta, sem
  interrupção junto a uma zebra nem na linha de largada (AC-US-0007-01).
- REQ-FEAT-0008-02: O sistema SHALL desenhar a faixa de borda com 0,10 m de largura, medida perpendicular à
  borda do asfalto, em todo ponto da volta (AC-US-0007-02).
- REQ-FEAT-0008-03: O sistema SHALL dar a cada roda sobre a faixa de borda a superfície `ASPHALT` e a
  aderência do mesmo pneu no asfalto, nas mesmas condições (AC-US-0007-03).
- REQ-FEAT-0008-04: O sistema SHALL NOT pôr em saída de pista um kart com rodas sobre a faixa de borda e
  nenhuma roda além da borda do asfalto (AC-US-0007-04).
- REQ-FEAT-0008-05: O sistema SHALL NOT invalidar por corte uma volta na Kart Park em que o kart roda com
  rodas sobre a faixa de borda por mais de 1000 ms, sem nenhuma roda além da borda do asfalto
  (AC-US-0007-17).
- REQ-FEAT-0008-06: O sistema SHALL desenhar cada trecho de zebra da Kart Park com altura de 0 m na sua
  borda do lado do asfalto (AC-US-0007-05).
- REQ-FEAT-0008-07: O sistema SHALL desenhar cada trecho de zebra da Kart Park com altura maior que 0 m e
  de no máximo 0,05 m na sua borda de fora (AC-US-0007-06).
- REQ-FEAT-0008-08: O sistema SHALL dar, a cada passo de `STEP`, a um kart que roda sobre a zebra a mesma
  posição, o mesmo rumo e a mesma velocidade que o jogo de antes da revisão 2 dá com a mesma sequência de
  `Input`: o relevo da zebra não entra na simulação, e o kart não sobe, não pula e não é desviado pela
  zebra (AC-US-0007-07).
- REQ-FEAT-0008-09: O sistema SHALL manter, com o relevo da zebra desenhado, a aderência de cada pneu sobre
  a zebra de AC-US-0005-06 (0,85 da do mesmo pneu no asfalto) (AC-US-0007-08).
- REQ-FEAT-0008-10: O sistema SHALL manter em `web-mobile`, com o relevo da zebra desenhado, a vibração da
  zebra de AC-US-0005-07 e AC-US-0005-08, pelas regras de [RULE-0004](../rules/RULE-0004-retorno-da-zebra.md)
  (AC-US-0007-18).
- REQ-FEAT-0008-11: O sistema SHALL manter em `web-desktop`, com o relevo da zebra desenhado, o som da zebra
  de AC-US-0005-09 a AC-US-0005-12, pelas regras de [RULE-0004](../rules/RULE-0004-retorno-da-zebra.md)
  (AC-US-0007-19).
- REQ-FEAT-0008-12: O sistema SHALL desenhar, na tela de corrida com a Kart Park, cada barreira de
  US-0004 como uma fileira de pneus pretos empilhados em toda a extensão da barreira (AC-US-0007-09).
- REQ-FEAT-0008-13: O sistema SHALL desenhar a pilha de pneus com 0,9 m de altura em toda a extensão da
  barreira (AC-US-0007-10).
- REQ-FEAT-0008-14: O sistema SHALL desenhar, de cada um dos dois lados da barreira, a face dos pneus a no
  máximo 0,05 m da face de colisão da barreira do arquivo de pista, em todo ponto da barreira
  (AC-US-0007-11).
- REQ-FEAT-0008-15: O sistema SHALL NOT desenhar nenhum pneu da barreira sobre o asfalto nem sobre a zebra
  (AC-US-0007-12).
- REQ-FEAT-0008-16: O sistema SHALL desenhar a grama da Kart Park em ao menos 2 tons de verde
  (AC-US-0007-13).
- REQ-FEAT-0008-17: O sistema SHALL desenhar cada tom de grama da Kart Park com luminância relativa (WCAG 2)
  que difere da de `#68865b` entre 8 % e 20 % desse valor de referência (AC-US-0007-20).
- REQ-FEAT-0008-18: O sistema SHALL atribuir a cada posição do chão da Kart Park, em metros do mundo do
  jogo, o mesmo tom de grama em toda abertura da Kart Park, no mesmo aparelho ou em aparelhos diferentes
  (AC-US-0007-14).
- REQ-FEAT-0008-19: O sistema SHALL dar a uma roda sobre qualquer tom de grama a aderência da grama, a
  mesma para todos os tons (AC-US-0007-15).
- REQ-FEAT-0008-20: O sistema SHALL dar a uma roda sobre qualquer tom de grama a superfície `GRASS`, a
  mesma para todos os tons (AC-US-0007-21).
- REQ-FEAT-0008-21: O sistema SHALL desenhar a pista sintética, para um mesmo estado do kart e da câmera,
  com a mesma imagem do jogo de antes da revisão 2: sem faixa de borda, sem relevo de zebra, sem barreira
  de pneus e com a grama em `#68865b` (AC-US-0007-16).
- REQ-FEAT-0008-22: O sistema SHALL desenhar o mesmo acabamento, com as mesmas medidas e o mesmo tom de
  grama por posição do chão, em `web-desktop` e em `web-mobile`, em qualquer aparelho, tamanho de tela e
  orientação (AC-US-0007-02, AC-US-0007-06, AC-US-0007-10, AC-US-0007-11, AC-US-0007-14).
- REQ-FEAT-0008-23: O sistema SHALL NOT usar foto de satélite nem imagem ou textura baixada da rede no
  acabamento; o acabamento não acrescenta requisição de rede (NFR-0004; US-0007, caso anormal).
- REQ-FEAT-0008-24: O sistema SHALL NOT retirar o acabamento nem nenhum dos seus quatro elementos (faixa de
  borda, relevo da zebra, barreira de pneus, tons de grama) para cumprir a taxa de quadros; um
  aparelho de referência que não a sustente com o acabamento é falha de NFR-0002 (NFR-0002; US-0007, caso
  anormal).
- REQ-FEAT-0008-25: O sistema SHALL dar, para a mesma sequência de `Input` a partir do mesmo estado inicial
  na Kart Park, o mesmo `lapMs` antes e depois da revisão 2, idêntico ao milissegundo em 100 % das
  sequências comparadas (NFR-0013).
- REQ-FEAT-0008-26: O sistema SHALL dar, nas mesmas execuções, os mesmos 4 valores de `sectorMs` antes e
  depois da revisão 2, idênticos ao milissegundo e um a um (NFR-0013).
- REQ-FEAT-0008-27: O sistema SHALL dar, nas mesmas execuções, a mesma posição, o mesmo rumo e a mesma
  velocidade do kart em 100 % dos passos de `STEP` antes e depois da revisão 2, com ao menos uma sequência
  comparada que passa sobre a faixa de borda, sobre a zebra e contra a barreira (NFR-0013).
- REQ-FEAT-0008-28: O arquivo de pista publicado da Kart Park SHALL continuar byte a byte igual ao de antes
  da revisão 2, com 0 bytes diferentes e o mesmo resumo criptográfico registrado na publicação da versão 1
  (NFR-0014).
- REQ-FEAT-0008-29: O arquivo de pista publicado da Kart Park SHALL continuar com `trackVersion` 1 depois
  da revisão 2 (NFR-0014).

## Comportamento

Regras: [RULE-0006](../rules/RULE-0006-acabamento-visual-da-kart-park.md) (geometria do acabamento, em que
pista ele é desenhado e como entra na simulação), [RULE-0001](../rules/RULE-0001-superficie-borda-da-pista-e-obstaculos.md)
(superfície, borda da pista e colisão, sem mudança), [RULE-0004](../rules/RULE-0004-retorno-da-zebra.md)
(vibração e som, sem mudança), [RULE-0005](../rules/RULE-0005-versao-e-publicacao-da-pista.md) (o arquivo
e a versão não mudam). Contratos lidos, sem campo novo: [API-0001](../api/API-0001-dado-de-pista-com-geometria-zebras-e-barreiras.md)
(`centerline`, `curbs`, `barriers`), [API-0002](../api/API-0002-catalogo-e-selecao-da-pista-do-treino.md)
(`trackId` da sessão), [API-0003](../api/API-0003-contato-do-kart-com-a-pista.md) (`wheelSurfaces`,
`wheelGripPc`, `beyondTrackEdgeM`). Tela: [SCR-0003](../screens/SCR-0003-kart-park-na-tela-de-corrida.md).
Abertura e troca de pista: [FLOW-0001](../flows/FLOW-0001-abertura-escolha-e-troca-de-pista.md). Passo:
[FLOW-0002](../flows/FLOW-0002-passo-de-simulacao-na-kart-park.md), que o acabamento não muda.

| Situação | Comportamento |
|---|---|
| Kart Park escolhida e treino iniciado | Faixa de borda, relevo da zebra, barreira de pneus e tons de grama desenhados ([RULE-0006](../rules/RULE-0006-acabamento-visual-da-kart-park.md)) |
| Kart contra a barreira de pneus, em qualquer velocidade e de qualquer lado | Para na face de colisão (AC-US-0004-04, AC-US-0004-05), a no máximo 0,05 m dos pneus vistos; não entra nos pneus nem para antes deles mais que 0,05 m |
| Rodas sobre a faixa de borda | Asfalto para a simulação: aderência de asfalto, nenhuma saída de pista, nenhum tempo de corte |
| Troca de pista no seletor, da Kart Park para a sintética e de volta | A sintética aparece sem nenhum elemento do acabamento; a Kart Park volta com o mesmo desenho da grama |
| Aparelho diferente, tela redimensionada ou orientação girada (`web-mobile`) | O desenho da grama e as medidas do acabamento não mudam; só o enquadramento |
| Rede indisponível depois de o jogo abrir | O acabamento é desenhado igual: não depende de nada da rede (NFR-0004) |
| Aparelho de referência abaixo da taxa de quadros | Falha de NFR-0002; o acabamento não é retirado e a simulação não muda |
| Sem sensor de inclinação ou com permissão negada (`web-mobile`) | Toque com estado visível (I4); o acabamento e a simulação não mudam |
| Mesma sequência de `Input` no jogo de antes e no de depois da revisão 2 | Mesmo `lapMs`, mesmos `sectorMs` e mesmo estado do kart a cada passo |

## Estado

Não define estados. O desenho é função do dado de pista, do `trackId` da sessão (`sessionState` `READY`,
[RULE-0003](../rules/RULE-0003-sessao-de-treino-e-selecao-de-pista.md)) e do estado do kart e da câmera.

## Configuração

Nenhuma. Nenhuma configuração liga ou desliga o acabamento ou um dos seus elementos, nem muda a largura da faixa, a altura do
relevo e da pilha de pneus ou os tons de grama: são medidas fixadas pelos requisitos.

## Critérios de aceite

- Na tela de corrida com a Kart Park, as duas bordas do asfalto têm a faixa branca contínua em toda a
  volta, inclusive junto às zebras e na linha de largada; na cena desenhada, ela tem 0,10 m de largura em
  todo ponto (satisfaz AC-US-0007-01, AC-US-0007-02; cobre os requisitos 01 e 02).
- Com o kart posto com rodas sobre a faixa de borda e nenhuma além da borda do asfalto, `wheelSurfaces` dá
  `ASPHALT` e `wheelGripPc` 1 nessas rodas e `beyondTrackEdgeM` é 0; uma volta com mais de 1000 ms assim
  não termina com `CUT` (satisfaz AC-US-0007-03, AC-US-0007-04, AC-US-0007-17; cobre os requisitos 03, 04
  e 05).
- Na cena desenhada, cada zebra tem altura 0 m na borda do lado do asfalto e altura maior que 0 m e de no
  máximo 0,05 m na borda de fora (satisfaz AC-US-0007-05, AC-US-0007-06; cobre os requisitos 06 e 07).
- A saída de `npm test` compara, passo a passo, o estado do kart numa sequência que passa sobre a zebra com
  o registrado no jogo de antes da revisão 2 e os acha iguais; `wheelGripPc` na zebra continua 0,85
  (satisfaz AC-US-0007-07, AC-US-0007-08; cobre os requisitos 08 e 09).
- Com o relevo desenhado, o registro dos pulsos pedidos em `web-mobile` e o das repetições do som em
  `web-desktop` satisfazem os critérios de aceite de [FEAT-0005](FEAT-0005-zebra-com-efeito.md) para
  AC-US-0005-07 a AC-US-0005-12 (satisfaz AC-US-0007-18, AC-US-0007-19; cobre os requisitos 10 e 11).
- Na tela, a barreira aparece como pneus pretos empilhados em toda a extensão; na cena desenhada, a pilha
  tem 0,9 m de altura, a face dos pneus fica, de cada um dos dois lados, a no máximo 0,05 m da superfície de contato da barreira, onde o kart para desse lado, e
  nenhum pneu está sobre o asfalto ou a zebra (satisfaz AC-US-0007-09 a AC-US-0007-12; cobre os requisitos
  12 a 15).
- Na tela, a grama da Kart Park mostra ao menos 2 tons de verde, cada um com luminância relativa a uma
  distância de 8 % a 20 % da de `#68865b`; o tom de uma mesma posição do chão é o mesmo em duas aberturas,
  em dois aparelhos diferentes e com a tela redimensionada (satisfaz AC-US-0007-13, AC-US-0007-14,
  AC-US-0007-20; cobre os requisitos 16, 17, 18 e 22).
- Com rodas sobre tons de grama diferentes, `wheelSurfaces` dá `GRASS` e `wheelGripPc` dá a mesma fração
  em todas (satisfaz AC-US-0007-15, AC-US-0007-21; cobre os requisitos 19 e 20).
- Com a pista sintética, a imagem de um mesmo estado do kart e da câmera é igual à do jogo de antes da
  revisão 2 (satisfaz AC-US-0007-16; cobre o requisito 21).
- O registro de rede do navegador numa volta na Kart Park não tem requisição de imagem ou textura do
  acabamento, e o acabamento aparece igual sem rede depois da abertura (cobre o requisito 23).
- Nenhuma configuração ou caminho do jogo retira o acabamento nem nenhum dos seus quatro elementos; o
  teste de taxa de quadros de
  [FEAT-0007](FEAT-0007-requisitos-transversais.md) é feito com ele na tela (cobre o requisito 24).
- A saída de `npm test` avança a simulação na Kart Park com `STEP` pelas mesmas sequências de `Input` no
  jogo de antes e no de depois da revisão 2, com ao menos uma sequência sobre a faixa de borda, a zebra e
  a barreira, e acha iguais `lapMs`, os 4 `sectorMs` e o estado do kart em todos os passos (cobre os
  requisitos 25, 26 e 27).
- O resumo criptográfico do arquivo de pista publicado da Kart Park depois da revisão 2 é o registrado na
  publicação da versão 1, e o seu `trackVersion` é 1 (cobre os requisitos 28 e 29).

## Pontos em aberto

Nenhum.
