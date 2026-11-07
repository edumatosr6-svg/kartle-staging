---
id: TEST-0010
title: Desenho da Kart Park construído em Node — asfalto pelas bordas do arquivo, faixa de borda, zebra no lado declarado com relevo, barreira de pneus em todo o comprimento com a face na superfície de contato, grama em 2 tons, linha de largada e minimapa
feature: pista-kart-park
stage: test
status: validated
version: 2.1.0
sources: [AC-US-0002-08, AC-US-0005-03, AC-US-0004-06, AC-US-0002-03, AC-US-0007-01, AC-US-0007-02, AC-US-0007-05, AC-US-0007-06, AC-US-0007-09, AC-US-0007-10, AC-US-0007-11, AC-US-0007-12, AC-US-0007-13, AC-US-0007-14, AC-US-0007-20]
---

# TEST-0010 — Desenho da Kart Park construído em Node

| | |
|---|---|
| Arquivo | `tests/pista-kart-park-scene.test.ts` (estratégia: `scene`) |
| Nível | integração (`buildTrackScene(kartParkGeometry())` em Node, sem renderizador: atributos de posição e cor das malhas, índices, caixa da geometria da pilha, matrizes das instâncias decompostas com `three`; `grassToneAt`; `minimapTransform`) |
| Interface exercitada | `buildTrackScene`, `grassToneAt`, `minimapTransform`, `CURB_STRIPE_M`, `EDGE_LINE_WIDTH_M`, `CURB_RELIEF_M`, `TYRE_RADIUS_M`, `TYRE_HEIGHT_M`, `TYRES_PER_STACK`, `TYRE_SPACING_M`, `GRASS_TONES` (`src/trackScene.ts`); `classifySurface`, `closestOnSegment`, `nearestOnCenterline`, `lapMAtIndex`, `BARRIER_HALF_WIDTH_M`; `THREE.Matrix4.decompose`, `THREE.Color.getHexString` |
| Fixtures | a cena construída uma vez por arquivo (uma segunda construção na verificação -15); `kartParkFile()` para as linhas e o ponto 0; `Seeded(20261103)` para as 1.000 posições do chão; luminância WCAG 2 calculada no teste; `CURB_Y` = 0,035 m escrito no teste a partir de DES-0008 (linha `curbs`), porque o módulo não o exporta |

Posições e matrizes são `float32`: perto de 100 m um ulp é 7,6e-6 m. As comparações de posição usam 1e-4 m e a largura da
faixa de borda usa 2e-5 m (ver `98-divergences.md`).

## Verificações

| Check | Decide | Teste | O que a faria falhar |
|---|---|---|---|
| CHK-TEST-0010-01 | AC-US-0002-08 | the asphalt mesh is the ribbon between the left and right edges of the file geometry, vertex for vertex | número de vértices ≠ 2 × (n + 1), vértice a mais de 1e-4 m (float32) da borda esquerda ou direita do arquivo (desenho com largura fixa ou suavização própria), índices ≠ 6 por segmento, sem sombra recebida |
| CHK-TEST-0010-02 | AC-US-0005-03 | every curb stripe is drawn on the side of the track its span declares, alternating two colours every metre | menos de uma faixa por metro de zebra, centro de faixa do lado oposto ao do trecho que contém a sua distância de volta ou fora de uma zebra (mutação I), ≠ 2 cores, algum dos 34 trechos sem faixa |
| CHK-TEST-0010-03 | AC-US-0004-06, AC-US-0007-09 | the barrier is drawn in its whole length: a tyre stack centred on every vertex of each barrier line and consecutive stacks at most TYRE_SPACING_M apart on each segment | `barriers` que não é `InstancedMesh`; vértice de alguma poligonal sem pilha centrada a 1e-4 m; vão maior que `TYRE_SPACING_M` entre centros seguidos (pontas incluídas) num segmento; pilha fora de toda poligonal; barreira total ≤ 40 m; sem sombra projetada. Reprova no desenho da revisão 1 (R1b: uma caixa no ponto médio de cada segmento), sem pilha nos vértices (D9) e com as pilhas deslocadas (D11, D19) |
| CHK-TEST-0010-04 | AC-US-0002-03 | the start line is drawn across the asphalt at point 0, as wide as the track there | menos de 2 quadrados, quadrado a mais de largura/2 + 1 m do ponto 0, número de quadrados ≠ 2 × ⌊largura/1,1⌋ |
| CHK-TEST-0010-05 | AC-US-0002-08 | the minimap transform fits the track box into the canvas with a margin | escala ≠ min(200/w, 130/h), canto da caixa mapeado fora de [10; 210] × [10; 140] px, filhos da cena diferentes de `grass`, `asphalt`, `edge-lines`, `curbs`, `barriers`, `start-line` nessa ordem, `buildTrackScene.length` ≠ 1 (R1b: quatro filhos) |
| CHK-TEST-0010-06 | AC-US-0007-01 | each asphalt edge carries one closed edge-line strip of 691 segments on the asphalt, from the edge itself, unbroken at the curbs and at the start line | sem `edge-lines` (R1b); ≠ 4 × (n + 1) vértices; vértice externo a mais de 1e-4 m de `leftEdge[i]`/`rightEdge[i]`; centro de algum quadrilátero fora do asfalto (faixa por fora da borda ou sob a zebra); segmento sem os dois triângulos ou triângulo entre dois segmentos (D3: o segmento de fechamento falta); canto de quadrado da largada a menos de `EDGE_LINE_WIDTH_M` de uma borda |
| CHK-TEST-0010-07 | AC-US-0007-02 | on every segment of both strips the inner side of the edge line runs 0.10 m from the edge segment, measured perpendicular to it | `EDGE_LINE_WIDTH_M` ≠ 0,10 (D1); vértice interno a mais de 2e-5 m de 0,10 m da reta do segmento de borda, num dos dois segmentos que o tocam (D2: bissetriz sem o fator 1/cos(θ/2) dá até 1,7 mm a menos nas viradas); sem `edge-lines` (R1b) |
| CHK-TEST-0010-08 | AC-US-0007-05 | every curb stripe has height 0 m on its asphalt side: those vertices stay at the curb base CURB_Y | vértice do lado do asfalto (os dois de cada faixa mais perto da linha central) fora de 0,035 m ± 1e-6 (D4: a faixa inteira erguida); sem faixas de zebra |
| CHK-TEST-0010-09 | AC-US-0007-06 | every curb stripe rises to CURB_RELIEF_M on its outer side, more than 0 m and at most 0.05 m above the base | `CURB_RELIEF_M` fora de (0; 0,05] (D5: 0,06); vértice de fora a uma altura acima da base diferente de `CURB_RELIEF_M` ± 1e-6, nula ou acima de 0,05 m (R1b: zebra plana) |
| CHK-TEST-0010-10 | AC-US-0007-09 | the tyre stacks are black: every vertex colour of the stack geometry has each sRGB channel at most 0.17 | geometria da pilha sem cor por vértice (R1b: caixa sem atributo de cor); algum canal sRGB acima de 0,17 (D6: `#3a3a3a`) |
| CHK-TEST-0010-11 | AC-US-0007-10 | a tyre stack stands from the ground to 0.9 m: TYRES_PER_STACK tyres of TYRE_HEIGHT_M | caixa da geometria da pilha com `y` mínimo ≠ 0 ou máximo ≠ 0,9 m (1e-6) (D7: 4 pneus dão 0,72 m; R1b: caixa unitária centrada), `TYRES_PER_STACK × TYRE_HEIGHT_M` ≠ 0,9 |
| CHK-TEST-0010-12 | AC-US-0007-11 | on both sides of the barrier the drawn tyre face is within 0.05 m of the collision face of the file, measured both ways | fronteira de contato (paralelas a `BARRIER_HALF_WIDTH_M` de cada segmento a cada 0,005 m e círculo desse raio em volta de cada vértice a cada 1°, mantidos os pontos a ≥ `BARRIER_HALF_WIDTH_M` − 1e-9 da poligonal) com um ponto a mais de 0,05 m da face desenhada (lados do polígono de cada pneu a cada 0,005 m, centro da matriz da instância, fora de todo outro polígono), ou ponto da face com \|D − `BARRIER_HALF_WIDTH_M`\| > 0,05 m (D8: raio 0,16; D9; D10: raio 0,06; D11: pilhas deslocadas 0,5 m; D19: 1,5 m; R1b). Medido: 0,019 m de contato a face |
| CHK-TEST-0010-13 | AC-US-0007-12 | no tyre of the barrier stands on the asphalt or on a curb: 24 points of the outer circle of every tyre are grass | algum dos 24 pontos a `TYRE_RADIUS_M` de um centro de pilha com `classifySurface` ≠ `grass` (D19: pilhas deslocadas 1,5 m; com 0,5 m, D11, ainda ficam na grama), barreira sem pilhas |
| CHK-TEST-0010-14 | AC-US-0007-13 | the grass shows exactly the two green tones of GRASS_TONES | sem `grass` (R1b); cores do atributo, convertidas a sRGB, diferentes das 2 de `GRASS_TONES`; tom com o canal verde não maior que o vermelho e o azul (D13: `#7f7f7f`) |
| CHK-TEST-0010-15 | AC-US-0007-14 | the grass tone of each ground position is a function of the position only: the same in two builds and the tone grassToneAt gives | atributos de posição ou cor de `grass` diferentes em duas construções (D15: tom tirado do relógio); faixa cuja cor não é `GRASS_TONES[grassToneAt(centro)]` (D14: o tom da faixa seguinte); posição de `Seeded(20261103)` fora de toda faixa ou numa faixa de outro tom; sem `grass` (R1b) |
| CHK-TEST-0010-16 | AC-US-0007-20 | the WCAG 2 relative luminance of each grass tone differs from that of #68865b by 8 % to 20 % of it | \|L(t) − L(`#68865b`)\| / L(`#68865b`) fora de [0,08; 0,20] para algum tom (D12: `#68865b` dá 0 %); cores desenhadas, em sRGB, diferentes dos tons; sem `grass` (R1b) |

As verificações -03 e -05 foram migradas na rodada de 2026-11-03 (de uma caixa por segmento e quatro filhos para as pilhas de
pneus e os seis filhos de DES-0008 2.1.0); a migração está em `97-changelog.md`.
