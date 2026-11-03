---
id: DES-0008
title: Desenho da Kart Park na tela de corrida — grama, asfalto, faixa de borda, zebras com relevo, barreira de pneus, linha de largada e minimapa
feature: pista-kart-park
stage: dspec
status: draft
version: 2.0.0
sources: [SCR-0003, FLOW-0002, RULE-0006, FEAT-0002, FEAT-0004, FEAT-0005, FEAT-0007, FEAT-0008, REQ-FEAT-0002-13, REQ-FEAT-0004-08, REQ-FEAT-0005-04, REQ-FEAT-0007-01, REQ-FEAT-0007-02, REQ-FEAT-0008-01, REQ-FEAT-0008-02, REQ-FEAT-0008-03, REQ-FEAT-0008-04, REQ-FEAT-0008-05, REQ-FEAT-0008-06, REQ-FEAT-0008-07, REQ-FEAT-0008-08, REQ-FEAT-0008-09, REQ-FEAT-0008-10, REQ-FEAT-0008-11, REQ-FEAT-0008-12, REQ-FEAT-0008-13, REQ-FEAT-0008-14, REQ-FEAT-0008-15, REQ-FEAT-0008-16, REQ-FEAT-0008-17, REQ-FEAT-0008-18, REQ-FEAT-0008-19, REQ-FEAT-0008-20, REQ-FEAT-0008-21, REQ-FEAT-0008-22, REQ-FEAT-0008-23, REQ-FEAT-0008-24]
---

# DES-0008 — Desenho da Kart Park na tela de corrida

## Realiza

Os acréscimos de SCR-0003: a tela de corrida desenha o asfalto da Kart Park com a linha central e as larguras
do arquivo (REQ-FEAT-0002-13), cada barreira em todo o seu comprimento (REQ-FEAT-0004-08) e cada trecho de
zebra no lado e no trecho declarados (REQ-FEAT-0005-04), sustentando 60 fps em notebook e 30 fps em celular
intermediário numa volta completa, com o acabamento na tela (REQ-FEAT-0007-01, -02).

O acabamento visual da Kart Park de FEAT-0008 e RULE-0006 (seed `revision: 2`): a faixa branca de 0,10 m por
dentro de cada borda do asfalto, contínua (REQ-FEAT-0008-01, -02); o relevo desenhado da zebra, 0 m do lado
do asfalto e 0,04 m na borda de fora (-06, -07); a barreira como fileira de pneus pretos empilhados de 0,9 m,
com a face a no máximo 0,05 m da face de colisão e nenhum pneu sobre asfalto ou zebra (-12 a -15); a grama
em 2 tons de verde por posição do chão, com a luminância exigida (-16, -17, -18); o mesmo desenho nos dois
canais (-22), sem imagem ou textura da rede (-23) e sem configuração que o reduza (-24). A pista sintética
continua com a imagem de antes (-21). O acabamento é só desenho (I2): a simulação não lê nada deste módulo,
de modo que a faixa é asfalto, os tons são grama, a zebra não ergue o kart e a vibração e o som da zebra
continuam os de [DES-0009](DES-0009-retorno-da-zebra-vibracao-e-som.md) (-03, -04, -05, -08, -09, -10, -11,
-19, -20). Nenhuma regra de pista é decidida aqui.

## Posicionamento

- `src/trackScene.ts`, camada **aplicação**, alterado: o grupo Three.js de uma pista em esquema 3 ganha a
  grama em tons, a faixa de borda e o relevo da zebra, e a barreira passa de caixas a pilhas de pneus. O
  acabamento fica neste módulo porque ele já é o único que desenha a Kart Park e o único desenho provado em
  `npm test` (constrói geometria em Node sem WebGL); a cena sintética, em `src/main.ts`, não o recebe.
- `src/main.ts`, camada **aplicação**, alterado em uma linha: o plano do chão (`ground`, `:53`, `#68865b`)
  fica oculto enquanto o grupo de uma pista em esquema 3 está visível, porque a grama do grupo o cobre.

Nenhum módulo novo, nenhuma dependência nova: só `three`, que o módulo já importa. Nenhum arquivo de imagem
ou textura: toda cor é constante do módulo, em cor por vértice ou cor de material.

## Interface

`src/trackScene.ts` — constantes, em metros do mundo do jogo, iguais em todo canal e em toda tela:

| Símbolo | Valor | Descrição e motivo |
|---|---|---|
| `CURB_STRIPE_M` | `1` | comprimento de cada faixa vermelha ou branca da zebra, m de distância de volta (sem mudança) |
| `EDGE_LINE_WIDTH_M` | `0.10` | largura da faixa de borda, medida perpendicular à borda do asfalto (REQ-FEAT-0008-02) |
| `CURB_RELIEF_M` | `0.04` | altura do relevo na borda de fora da zebra; dentro de (0, 0,05] com 0,01 m de folga (REQ-FEAT-0008-07) |
| `TYRE_RADIUS_M` | `0.12` | raio externo de cada pneu desenhado |
| `TYRE_SEGMENTS` | `12` | lados do cilindro de cada pneu; raio interno do polígono `TYRE_RADIUS_M · cos(π/12)` = 0,1159 m |
| `TYRE_HEIGHT_M` | `0.18` | altura de um pneu da pilha |
| `TYRES_PER_STACK` | `5` | pneus por pilha: 5 × 0,18 m = 0,9 m (REQ-FEAT-0008-13) |
| `TYRE_SPACING_M` | `0.18` | distância máxima, ao longo da barreira, entre os centros de duas pilhas seguidas |
| `GRASS_STRIPE_M` | `5` | largura de cada faixa de tom da grama, em `xM` |
| `GRASS_TONES` | `['#6e8f60', '#627d56']` | os 2 tons de grama; luminância relativa WCAG 2 de 0,2380 e 0,1794 contra 0,2075 de `#68865b`: \|L(t) − L(ref)\| / L(ref) de 0,147 e 0,136, dentro de [0,08, 0,20] (REQ-FEAT-0008-17) |

Funções:

| Símbolo | Assinatura | Descrição |
|---|---|---|
| `buildTrackScene(geometry)` | `(TrackGeometry) => THREE.Group` | grupo com seis filhos nomeados: `grass`, `asphalt`, `edge-lines`, `curbs`, `barriers`, `start-line`. A única entrada é a geometria: nenhum parâmetro de canal, de tela, de qualidade ou de semente (REQ-FEAT-0008-22, -24) |
| `grassToneAt(xM, zM)` | `(number, number) => 0 \| 1` | índice em `GRASS_TONES` do tom de grama da posição: `((⌊xM / GRASS_STRIPE_M⌋ mod 2) + 2) mod 2`; função só da posição, sem sorteio, sem relógio, sem medida de tela (REQ-FEAT-0008-18). `zM` está na assinatura porque o tom é da posição do chão; o desenho em faixas não depende dele |
| `minimapTransform(bounds)` | `({minX, maxX, minZ, maxZ}) => {scale: number; offsetX: number; offsetY: number}` (escala em px/m, deslocamentos em px) | encaixa a caixa da pista em 200 × 130 px, centrada no canvas de 220 × 150 px (sem mudança) |

Conteúdo do grupo:

| Filho | Geometria | Aparência |
|---|---|---|
| `grass` | uma `BufferGeometry` plana a `y` 0, o mesmo quadrado de 2.000 × 2.000 m centrado na origem que o `ground` de `src/main.ts:53`, dividido em 400 faixas de `GRASS_STRIPE_M` em `xM` (de −1.000 a 1.000, bordas em múltiplos exatos de 5); cada faixa com 2 triângulos e 4 vértices próprios na cor `GRASS_TONES[grassToneAt(x da borda esquerda da faixa, 0)]`: 1.600 vértices, 800 triângulos | cor por vértice, mesmos parâmetros de material do `ground`; recebe sombra |
| `asphalt` | sem mudança: os pontos `leftEdge[i]` e `rightEdge[i]` da geometria a `y` 0,03, dois triângulos por segmento, volta fechada | `#434d48` |
| `edge-lines` | uma `BufferGeometry` com duas tiras fechadas, uma por borda. Na borda esquerda, o vértice externo é `leftEdge[i]` e o interno é `leftEdge[i] + m_i · EDGE_LINE_WIDTH_M / cos(θ_i / 2)`, com `m_i` a bissetriz unitária das normais para dentro do asfalto (o lado de `centerline[i]`) dos dois segmentos da borda que chegam em `i`, e `θ_i` o ângulo de virada da borda em `i`; o mesmo com `rightEdge` na direita. Cada segmento interno fica paralelo ao seu segmento de borda, a 0,10 m dele. A `y` 0,033, dois triângulos por segmento, 684 segmentos por borda | `#f2f2ec`, `polygonOffset` com fator e unidades −1 sobre o asfalto; recebe sombra |
| `curbs` | os quadriláteros de zebra da geometria, subdivididos a cada `CURB_STRIPE_M` como hoje; os vértices do lado do asfalto (`e0`, `e1`) a `y` `CURB_Y` (0,035) e os de fora (`o0`, `o1`) a `CURB_Y + CURB_RELIEF_M` (0,075): cada faixa é uma rampa | faixas alternadas `#c8423b` e `#f0e9d5`, normais recalculadas pela inclinação |
| `barriers` | `InstancedMesh` de uma geometria de pilha: `TYRES_PER_STACK` cilindros abertos de raio `TYRE_RADIUS_M`, altura `TYRE_HEIGHT_M` e `TYRE_SEGMENTS` lados, empilhados de `y` 0 a 0,9 m, mais a tampa do pneu de cima (132 triângulos). Para cada poligonal de `barriers` de comprimento `L`, `n = ⌈L / TYRE_SPACING_M⌉`, e uma instância centrada em cada ponto à distância `k · L / n` ao longo da poligonal, `k = 0 … n`: a primeira no primeiro ponto, a última no último | cor por vértice, `#1b1b1b` e `#2a2a2a` alternados por pneu da pilha (os dois pretos, para a pilha se ler empilhada); projeta e recebe sombra |
| `start-line` | sem mudança: quadrados de 1,1 × 0,7 m alternados, atravessando o asfalto no ponto 0 ao longo da normal, a `y` 0,055 | `#eff0df` e `#25362f` |

Sem árvores, tribuna ou cerca: o cenário além do acabamento de RULE-0006 é de outra feature
(`SEED/FE-05`).

`src/main.ts`, por trecho atual:

| Trecho atual | Mudança |
|---|---|
| `:53-56` `ground` (`#68865b`) e `:58-127` `syntheticScene` | sem mudança: os mesmos objetos, com os mesmos valores |
| `chooseTrack` (`:238-244`), onde `syntheticScene.visible` e o `visible` dos grupos de `trackScenes` são postos | acrescenta `ground.visible = !(ready && trackGeometry)`: oculto só com o grupo de uma pista em esquema 3 visível; com a pista sintética `READY` e com `FAILED`, visível como hoje |
| `:289-297` `minimap`, `:363-364` câmera de visão geral, extensões da câmera de sombra | sem mudança |

## Medidas do acabamento contra RULE-0006

| Requisito | Medida no desenho |
|---|---|
| REQ-FEAT-0008-01, -02 | duas tiras fechadas, sem quebra junto às zebras (que ficam fora do asfalto) nem na largada: no ponto 0 a largura é 5,03 m e a linha de largada ocupa 4 × 1,1 = 4,4 m centrados, a 0,315 m de cada borda, fora da faixa; largura perpendicular de cada segmento 0,10 m. A maior virada das bordas do arquivo publicado é de 21,1°, o que dá fator de esquadro de no máximo 1,017; o menor segmento de borda é de 0,167 m |
| REQ-FEAT-0008-06, -07 | altura acima de `CURB_Y`: 0 m nos vértices do lado do asfalto e 0,04 m nos de fora, em todo o comprimento de cada trecho |
| REQ-FEAT-0008-12, -13 | pilhas em toda a extensão de cada poligonal, da primeira à última, com 0,9 m de altura. Com a barreira de 53,29 m do arquivo publicado: `n` = 297, 298 pilhas, 1.490 pneus, 39.336 triângulos numa chamada de desenho |
| REQ-FEAT-0008-14 | ver "Face de colisão" abaixo: de cada lado, a face desenhada fica entre 0,073 m e 0,12 m da poligonal, isto é, a no máximo 0,027 m da face de colisão, a 0,1 m |
| REQ-FEAT-0008-15 | o ponto de pneu mais afastado fica a 0,12 m da poligonal; a menor distância da poligonal da barreira ao asfalto é de 0,51 m e a uma zebra, de 5,04 m (medições do seed, `NOTES.md` de 2026-11-03): nenhum pneu toca asfalto ou zebra |
| REQ-FEAT-0008-16, -17, -18 | 2 tons, a 0,147 e 0,136 da luminância de referência; o tom de cada posição é `grassToneAt` |
| REQ-FEAT-0008-21 | `syntheticScene`, `ground` e a cor `#68865b` não mudam; nada de `src/trackScene.ts` fica visível com a pista sintética |

### Face de colisão (REQ-FEAT-0008-14)

No projeto, a face de colisão da barreira é a superfície de contato a `BARRIER_HALF_WIDTH_M` = 0,1 m de cada
lado da poligonal ([ADR-0003](../adr/ADR-0003-colisao-com-a-barreira.md), `src/trackGeometry.ts:17`): é ali
que o kart para dos dois lados (AC-US-0004-04, -05). O desenho mede a face dos pneus contra ela, e não contra
a poligonal, porque RULE-0006 pede que o kart parado na barreira fique a no máximo 0,05 m dos pneus vistos;
com a face desenhada na poligonal, o kart pararia 0,1 m antes dela. A constante da simulação não muda
(NFR-0013, NFR-0014). A frase de RULE-0006 que identifica a face de colisão com a poligonal, e dela deduz no
máximo 0,05 m de cada lado, foi devolvida ao autor do F-Spec em `FEEDBACK-02.md` como alinhamento de texto,
sem mudança de requisito.

A face desenhada, de cada lado, é a envoltória das pilhas. No ponto de maior afastamento, o centro de uma
pilha, ela está a `TYRE_RADIUS_M` = 0,12 m da poligonal (0,02 m além da face de colisão). No de menor
afastamento, a meio caminho entre dois centros a no máximo 0,18 m, está a pelo menos
`√((0,12 · cos(π/12))² − 0,09²)` = 0,073 m (0,027 m aquém). Nas curvas da poligonal a corda entre dois centros
é no máximo o arco, de modo que o limite se mantém. Largura total desenhada: entre 0,146 m e 0,24 m.

## Colaboradores

Chama `three` e lê `TrackGeometry` e `BARRIER_HALF_WIDTH_M` de `src/trackGeometry.ts`. É chamado por
`src/main.ts` (`chooseTrack`) e pelos testes. Não chama a simulação, o DOM nem a rede. Nenhum módulo de
simulação ou de dado de pista importa `src/trackScene.ts`
([DES-0006](../core/DES-0006-invariantes-ensaios-e-ordem-de-entrega.md)).

## Estado e concorrência

O grupo de cada pista é construído uma vez por página e guardado em `trackScenes`; trocar de pista só alterna
`visible`, e voltar à Kart Park mostra o mesmo grupo, com a mesma grama. Construir de novo a partir da mesma
geometria dá os mesmos atributos, número a número: a construção é função pura da geometria. Nada é
persistido.

## Comportamento em falha

Sem WebGL o jogo já mostra a mensagem de `src/main.ts:22` e para; `buildTrackScene` não depende de WebGL. Uma
geometria sem zebra ou sem barreira dá filhos vazios. Sem rede o desenho é o mesmo: nada é baixado. Sem
escrita, sem registro.

## Desempenho (REQ-FEAT-0007-01, -02; REQ-FEAT-0008-24)

Com o acabamento, a Kart Park desenha 6 objetos: grama (800 triângulos), asfalto, faixas de borda (2.736
triângulos), zebras, barreira (uma `InstancedMesh`, cerca de 39 mil triângulos) e a linha de largada, com a
cena sintética (300 caixas e até 90 árvores) e o `ground` ocultos. Nenhuma textura, nenhum material
transparente. A métrica que mostraria o limite sendo perdido é a taxa de quadros sustentada numa volta
completa com o acabamento na tela, registrada no notebook e no celular intermediário de referência de RNF03
(E2E-03 e E2E-05 em `docs/kart-park-device-log.md`); uma execução em desktop não vale para celular. Nenhuma
configuração, parâmetro ou caminho retira ou reduz o acabamento: um aparelho que não sustente a taxa é falha
de NFR-0002, tratada numa rodada nova deste desenho, nunca desligando-o.

## Observabilidade

`tests/pista-kart-park-scene.test.ts` constrói o grupo em Node a partir do arquivo publicado e afirma, além do
que já afirmava para o asfalto, as zebras e a linha de largada: a faixa de borda (largura perpendicular de
0,10 m em todo segmento, vértices dentro do asfalto, tiras fechadas, folga da linha de largada); a altura dos
vértices das zebras; as pilhas (extensão, altura, envoltória de cada lado contra a face de colisão, nenhum
ponto de pneu fora da grama); os tons de grama (luminância calculada no teste, cor de cada faixa igual a
`grassToneAt`, construção repetida igual). Detalhe em [test-strategy](../test-strategy.md). Em execução não
há registro: o desenho não tem caminho de falha próprio.

## Determinismo (D-DS-07)

Não é código de simulação; a construção é determinística a partir da geometria, sem `Math.random`, relógio ou
medida de tela.

## Feature flag

Nenhuma: o desenho segue a pista da sessão. FEAT-0008 proíbe configuração que ligue, desligue ou reduza o
acabamento ou mude as suas medidas; o estado neutro da pista sintética é garantido por ela não receber nada
deste módulo.

## Pontos em aberto

Nenhum.
