---
id: RULE-0002
title: Geometria e verificações do arquivo de pista gerado
feature: pista-kart-park
stage: fspec
status: validated
version: 2.0.0
sources: [US-0002, US-0003, US-0004, US-0005, NFR-0001, NFR-0006, AC-US-0002-01, AC-US-0002-02, AC-US-0002-03, AC-US-0002-04, AC-US-0002-05, AC-US-0002-06, AC-US-0002-07, AC-US-0003-01, AC-US-0003-02, AC-US-0003-03, AC-US-0003-04, AC-US-0003-12, AC-US-0004-01, AC-US-0004-02, AC-US-0004-03, AC-US-0005-01, AC-US-0005-02, AC-US-0005-13, AC-US-0006-09]
---

# RULE-0002 — Geometria e verificações do arquivo de pista gerado

Define as medidas que o arquivo de pista gerado da Kart Park versão 2 usa e as verificações que ele passa
antes de ser publicado ([FLOW-0003](../flows/FLOW-0003-preparo-e-publicacao-do-arquivo-de-pista.md)). Cada
verificação é determinística: lê o arquivo gerado e, quando indicado, o arquivo da réplica
(`replica/kart-park-replica.json`), sem simulação nem renderização (NFR-0007). Todo número vem dos
requisitos (`SEED/MED`, `SEED/US-2` a `SEED/US-5`, `DOMAIN/DEC-03`, `DOMAIN/DEC-10`, `DOMAIN/DEC-13`).

## Medidas

| Medida | Definição | Fonte |
|---|---|---|
| Linha central da réplica | Os pontos do arquivo da réplica, na ordem, em metros, expressos nos eixos do jogo com a origem do arquivo da réplica: o ponto (*x*, *y*), com *y* para o norte, é (*x*, −*y*) no plano (`xM`, `zM`); ligados em volta fechada. *R*₀ é o seu ponto 0, a linha de largada da réplica | AC-US-0002-06; `SEED/RE-03` via US-0002 |
| *P*ᵢ | O ponto *i* de `centerline`, de 0 a *N* − 1, com *N* o número de pontos do arquivo gerado | AC-US-0002-01 |
| Distância de volta *d*(*i*) | Soma dos comprimentos dos segmentos de `centerline` do ponto 0 ao ponto *i*; o comprimento da volta *L* é a soma dos *N* segmentos, inclusive do ponto *N* − 1 ao ponto 0 | AC-US-0002-02 |
| Distância de volta declarada no arquivo da réplica | O início (`de_m`) e o fim (`ate_m`) de cada zebra e o início (`de_m`) e o fim (`de_m` + `comprimento_m`) de cada elemento, lidos como distâncias de volta *d* na `centerline`, a partir do ponto 0, sem conversão. A leitura vale porque o ponto 0 gerado fica a no máximo 0,10 m de *R*₀ (V01) e todo ponto gerado a no máximo 0,10 m da linha central da réplica (V07) | AC-US-0003-12, AC-US-0005-02 |
| Trecho aproximado | Um trecho dado pelos requisitos como "≈ *a*–*b* m", com *a* e *b* arredondados ao metro, é o conjunto dos pontos com *d* de *a* − 0,5 m a *b* + 0,5 m. Os dois trechos quase encostados são *T*₁ = 368,5–406,5 m e *T*₂ = 594,5–624,5 m | AC-US-0004-01, AC-US-0004-02 |
| Normal, bordas do asfalto, zebra, borda da pista | Como em [RULE-0001](RULE-0001-superficie-borda-da-pista-e-obstaculos.md) | AC-US-0002-07 |
| Linha transversal no ponto *i* | Segmento sobre a reta por *P*ᵢ na direção da normal *n*ᵢ: de cada lado, vai da borda da pista mais `cutDistanceM` (3 m), parando antes, se a extensão além da borda da pista encontrar pista ou barreira; orientada como o contrato de linha de `race-lap-validation` exige para o sentido de corrida | AC-US-0003-04, AC-US-0003-05, AC-US-0003-10 |
| Área com sinal | Fórmula da área do polígono de `centerline` com as coordenadas (*x*, −*z*), na ordem dos pontos; positiva significa anti-horário visto de cima | AC-US-0002-04 |

## Verificações do arquivo gerado

Todas precisam passar para o arquivo ser publicado. "Igual", para um valor gravado com arredondamento,
significa diferir no máximo meia unidade da última casa decimal gravada.

| # | Verificação | Passa quando | Fonte |
|---|---|---|---|
| V01 | Ponto 0 da réplica | A distância de *P*₀ a *R*₀ é de no máximo 0,10 m | AC-US-0002-03, AC-US-0002-06 |
| V02 | Volta fechada | `centerline` tem ao menos 3 pontos, e o último ponto é diferente do ponto 0 (o ponto 0 não é repetido; a volta fecha do último ao ponto 0) | AC-US-0002-01 |
| V03 | Comprimento | *L* está entre 683,793 m e 697,607 m, inclusive (690,7 m ± 1 %) | AC-US-0002-02 |
| V04 | Largada e chegada | `finishLine` é a linha transversal no ponto 0; `startPosition` está sobre o segmento do ponto 0 ao ponto 1, do lado de depois da `finishLine` no sentido de corrida e antes do ponto 1, com `headingDeg` igual ao rumo desse segmento | AC-US-0002-03, AC-US-0003-03 |
| V05 | Sentido | A área com sinal é positiva e `direction` é `COUNTER_CLOCKWISE` | AC-US-0002-04 |
| V06 | Largura | Para todo *i*, `widthM` do ponto *i* é 7,0 | AC-US-0002-05 |
| V07 | Distância à réplica | Para todo *i*, a distância de *P*ᵢ até a linha central da réplica, a poligonal fechada, é de no máximo 0,10 m | AC-US-0002-06 |
| V08 | Bordas | A borda esquerda e a borda direita do asfalto, em volta fechada, não têm autointerseção e não se cruzam; isso inclui a curva mais fechada, de raio 8,8 m, perto de 216 m | AC-US-0002-07 |
| V09 | Setores | `sectorLimits` tem 3 linhas, em ordem de distância de volta, e a *k*-ésima é a linha transversal no ponto *i* que minimiza \|*d*(*i*) − *D*ₖ\|, com *D* = 204,9 m, 354,9 m e 534,7 m | AC-US-0003-01, AC-US-0003-02 |
| V10 | Marcadores | Cada item de `markers` é a linha transversal num ponto da linha central; os pontos estão em ordem crescente de *d*(*i*); nenhum é o ponto 0 nem um ponto de V09; a diferença de *d* entre marcadores consecutivos, e do último ao primeiro passando pelo ponto 0 (*L* menos a distância do último mais a distância do primeiro), é de no máximo 25 m | AC-US-0003-04 |
| V11 | Extensão das linhas | Para `finishLine`, cada limite de setor e cada marcador: o segmento cobre a pista no seu ponto de borda a borda; cada ponta fica a `cutDistanceM` além da borda da pista, ou antes, no primeiro encontro da extensão com pista ou barreira; a parte além da borda da pista está toda na grama | AC-US-0003-05, AC-US-0003-10 |
| V12 | Zebras | `curbs` tem 22 trechos, em correspondência um a um com os 22 trechos do arquivo da réplica: cada trecho gerado tem o lado do trecho da réplica (`LEFT` para "esquerda", `RIGHT` para "direita"), `fromLapM` igual ao `de_m` e `toLapM` igual ao `ate_m` dele, e `widthM` maior que 0 | AC-US-0005-01, AC-US-0005-02 |
| V13 | Cobertura da barreira | Para todo ponto *p* das bordas do asfalto dos pontos de *T*₁, seja *q* o ponto das bordas do asfalto dos pontos de *T*₂ mais próximo de *p*: se \|*p* − *q*\| é de 6 m ou menos, o segmento *pq* cruza uma barreira; e o mesmo trocando *T*₁ e *T*₂ | AC-US-0004-01 |
| V14 | Limite da barreira | Para todo ponto de toda barreira, a soma das distâncias até o asfalto dos pontos de *T*₁ e até o asfalto dos pontos de *T*₂ é de no máximo 6 m | AC-US-0004-02 |
| V15 | Barreira fora do asfalto | Nenhuma barreira tem ponto, nem trecho entre pontos, dentro do asfalto | AC-US-0004-03 |
| V16 | Identidade | `schemaVersion` 3, `trackId` `kart-park`, `trackVersion` 2, `osmDerived` verdadeiro; `cutDistanceM` e `cutDurationMs` ausentes | NFR-0006, AC-US-0003-07 |
| V17 | Tamanho | O arquivo, como é entregue ao navegador, tem menos de 200.000 bytes | NFR-0001 |
| V18 | Sem recorde | O arquivo não tem campo de recorde, de tempo da pista real nem de comprimento oficial | AC-US-0006-09 |
| V19 | Limites em retas | Para cada um dos três pontos *i* de V09, existe um elemento do arquivo da réplica com tipo "reta" tal que `de_m` ≤ *d*(*i*) ≤ `de_m` + `comprimento_m` | AC-US-0003-12 |
| V20 | Zebra sem cruzar a largada | Todo trecho de `curbs` tem 0 ≤ `fromLapM` < `toLapM` ≤ *L* | AC-US-0005-13 |

Os trechos *T*₁ e *T*₂, a curva de raio 8,8 m perto de 216 m e as distâncias 204,9 m, 354,9 m e 534,7 m
são os medidos pelo seed na réplica (`SEED/MED`, `SEED/US-3`, `SEED/US-4`); por isso as verificações os
aplicam em *d*, a régua que começa no mesmo ponto 0 da réplica. Os dois grampos da réplica (raio 15,5 m e
14,4 m) e as outras curvas fechadas estão cobertos por V08, que vale para a volta inteira.

## Idempotência e ordem

As verificações são funções puras do arquivo gerado e do arquivo da réplica: repeti-las dá o mesmo
resultado, e nenhuma altera arquivo. A ordem não importa; a publicação exige todas aprovadas
([RULE-0005](RULE-0005-versao-e-publicacao-da-pista.md)).
