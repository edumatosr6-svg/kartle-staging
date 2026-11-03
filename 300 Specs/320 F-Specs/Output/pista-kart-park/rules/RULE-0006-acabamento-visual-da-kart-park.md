---
id: RULE-0006
title: Acabamento visual da Kart Park
feature: pista-kart-park
stage: fspec
status: validated
version: 1.0.0
sources: [US-0007, NFR-0013, NFR-0014, AC-US-0007-01, AC-US-0007-02, AC-US-0007-03, AC-US-0007-04, AC-US-0007-05, AC-US-0007-06, AC-US-0007-07, AC-US-0007-08, AC-US-0007-09, AC-US-0007-10, AC-US-0007-11, AC-US-0007-12, AC-US-0007-13, AC-US-0007-14, AC-US-0007-15, AC-US-0007-16, AC-US-0007-17, AC-US-0007-20, AC-US-0007-21]
---

# RULE-0006 — Acabamento visual da Kart Park

O acabamento — faixa de borda, relevo da zebra, barreira de pneus e tons de grama — é só desenho (I2,
`SEED/RD-13`): a apresentação o calcula a partir do dado de pista que já lê
([API-0001](../api/API-0001-dado-de-pista-com-geometria-zebras-e-barreiras.md)) e da pista da sessão
([API-0002](../api/API-0002-catalogo-e-selecao-da-pista-do-treino.md)); a simulação não o lê, e nenhuma
regra de [RULE-0001](RULE-0001-superficie-borda-da-pista-e-obstaculos.md) muda. Todas as medidas abaixo são
da cena desenhada, em metros do mundo do jogo, e por isso as mesmas em `web-desktop` e `web-mobile`, em
qualquer aparelho, tamanho de tela e orientação; só o enquadramento muda. Fontes: US-0007, NFR-0013,
NFR-0014.

## Em que pista o acabamento é desenhado

| Pista da sessão (`trackId`) | Acabamento | Fonte |
|---|---|---|
| `kart-park` | Faixa de borda, relevo da zebra, barreira de pneus e tons de grama, como nas tabelas abaixo | AC-US-0007-01, AC-US-0007-05, AC-US-0007-09, AC-US-0007-13 |
| `synthetic` | Nenhum elemento do acabamento: para o mesmo estado do kart e da câmera, a imagem é a do jogo de antes da revisão 2, com a grama em `#68865b` | AC-US-0007-16 |

Trocar de pista no seletor troca o desenho com a sessão: a sintética aparece sem acabamento, e a Kart Park
volta com o mesmo desenho da grama (US-0007, caso anormal).

## Geometria desenhada

As bordas do asfalto, a normal, as zebras e a barreira são as de
[RULE-0001](RULE-0001-superficie-borda-da-pista-e-obstaculos.md), lidas do arquivo de pista.

| Elemento | Regra | Fonte |
|---|---|---|
| Faixa de borda | Uma faixa branca junto a cada uma das duas bordas do asfalto, por dentro do asfalto, contínua em toda a volta | AC-US-0007-01 |
| Largura da faixa de borda | 0,10 m, medida perpendicular à borda do asfalto, em todo ponto da volta | AC-US-0007-02 |
| Faixa de borda junto a uma zebra ou na linha de largada | Continua contínua: a zebra fica fora do asfalto e não a cobre; a linha de largada não a interrompe | AC-US-0007-01; US-0007, caso anormal |
| Relevo da zebra, borda do lado do asfalto | Altura de 0 m em todo o comprimento do trecho | AC-US-0007-05 |
| Relevo da zebra, borda de fora | Altura maior que 0 m e de no máximo 0,05 m em todo o comprimento do trecho | AC-US-0007-06 |
| Barreira de pneus | Cada barreira de `barriers` desenhada como uma fileira de pneus pretos empilhados em toda a sua extensão | AC-US-0007-09 |
| Altura da pilha de pneus | 0,9 m em toda a extensão da barreira | AC-US-0007-10 |
| Face dos pneus | De cada um dos dois lados, a face dos pneus fica a no máximo 0,05 m da face de colisão da barreira, em todo ponto da barreira. A face de colisão é a poligonal da barreira ([RULE-0001](RULE-0001-superficie-borda-da-pista-e-obstaculos.md), [API-0001](../api/API-0001-dado-de-pista-com-geometria-zebras-e-barreiras.md)), em que o kart para dos dois lados; logo a fileira desenhada, medida perpendicular à poligonal, ocupa no máximo 0,05 m de cada lado dela | AC-US-0007-11 |
| Pneus fora da pista | Nenhum pneu desenhado sobre o asfalto nem sobre a zebra | AC-US-0007-12 |
| Tons de grama | A grama da Kart Park é desenhada em ao menos 2 tons de verde | AC-US-0007-13 |
| Luminância de cada tom | Para cada tom *t*: \|*L*(*t*) − *L*(`#68865b`)\| / *L*(`#68865b`) entre 0,08 e 0,20, com *L* a luminância relativa da WCAG 2 | AC-US-0007-20 |
| Tom de cada posição do chão | O tom de grama em cada posição (`xM`, `zM`) é função só dessa posição, em metros do mundo do jogo: o mesmo em toda abertura da Kart Park, em qualquer aparelho, sem valor aleatório que mude entre aberturas e sem depender do tamanho da tela | AC-US-0007-14 |
| Origem do desenho | Nenhum elemento do acabamento usa foto de satélite nem imagem ou textura baixada da rede | US-0007, caso anormal (`SEED/FE-07`); NFR-0004 |

## Tabela de decisão — o acabamento na simulação (por passo)

A simulação decide a superfície, a borda da pista e o contato pelas tabelas de
[RULE-0001](RULE-0001-superficie-borda-da-pista-e-obstaculos.md), sem mudança. O acabamento entra nelas
assim:

| Posição | `wheelSurfaces` | `wheelGripPc` | Saída de pista e corte | Fonte |
|---|---|---|---|---|
| Roda sobre a faixa de borda | `ASPHALT` (a faixa fica dentro do asfalto) | 1, a mesma do mesmo pneu no asfalto | Nenhuma saída de pista com nenhuma roda além da borda do asfalto (`beyondTrackEdgeM` 0); nenhum corte, por mais de 1000 ms que dure | AC-US-0007-03, AC-US-0007-04, AC-US-0007-17 |
| Roda sobre a zebra desenhada com relevo | `CURB` | 0,85, como em AC-US-0005-06 | As da zebra, sem mudança | AC-US-0007-08 |
| Kart sobre a zebra | — | — | Posição, rumo e velocidade a cada passo de `STEP` são os mesmos que no jogo de antes da revisão 2, com a mesma sequência de `Input`: o kart não sobe, não pula e não é desviado pela zebra | AC-US-0007-07 |
| Roda sobre qualquer tom de grama | `GRASS`, o mesmo para todos os tons | A da grama, a mesma para todos os tons | As da grama, sem mudança | AC-US-0007-15, AC-US-0007-21 |
| Kart contra a barreira de pneus | — | — | O kart para na face de colisão (AC-US-0004-04, AC-US-0004-05), a no máximo 0,05 m dos pneus vistos | AC-US-0007-11; US-0007, caso anormal |

Consequência verificável: a mesma sequência de `Input`, a partir do mesmo estado inicial na Kart Park, dá
o mesmo `lapMs`, os mesmos 4 `sectorMs` e o mesmo estado do kart a cada passo antes e depois da revisão 2
(NFR-0013).

## Dado de pista

| Regra | Fonte |
|---|---|
| O acabamento não acrescenta, não muda e não retira nenhum campo nem valor do arquivo de pista: o arquivo publicado da Kart Park continua byte a byte igual, com o mesmo resumo criptográfico registrado na publicação da versão 1 | NFR-0014 |
| O acabamento não é versão nova da pista: o arquivo publicado continua com `trackVersion` 1 ([RULE-0005](RULE-0005-versao-e-publicacao-da-pista.md)) | NFR-0014 |

## Idempotência e ordem

O desenho é função pura do dado de pista, da pista da sessão e do estado do kart e da câmera: desenhar de
novo o mesmo estado dá a mesma imagem, e não há contador de sequência. O acabamento não tem estado próprio
nem transição.
