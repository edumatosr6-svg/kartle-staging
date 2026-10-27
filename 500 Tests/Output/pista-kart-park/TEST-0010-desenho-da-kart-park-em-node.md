---
id: TEST-0010
title: Desenho da Kart Park construído em Node — asfalto pelas bordas do arquivo, faixas da zebra no lado declarado, barreira em todo o comprimento, linha de largada e minimapa
feature: pista-kart-park
stage: test
status: draft
version: 1.0.0
sources: [AC-US-0002-08, AC-US-0005-03, AC-US-0004-06, AC-US-0002-03]
---

# TEST-0010 — Desenho da Kart Park construído em Node

| | |
|---|---|
| Arquivo | `tests/pista-kart-park-scene.test.ts` (estratégia: `scene`) |
| Nível | integração (`buildTrackScene(kartParkGeometry())` em Node, sem renderizador: atributos de posição e cor das malhas, matrizes das instâncias decompostas com `three`; `minimapTransform`) |
| Interface exercitada | `buildTrackScene`, `CURB_STRIPE_M`, `minimapTransform` (`src/trackScene.ts`); `classifySurface`, `nearestOnCenterline`, `lapMAtIndex`, `BARRIER_HALF_WIDTH_M`; `THREE.Matrix4.decompose` |
| Fixtures | a cena construída uma vez por arquivo; `kartParkFile()` para as linhas e o ponto 0 |

## Verificações

| Check | Decide | Teste | O que a faria falhar |
|---|---|---|---|
| CHK-TEST-0010-01 | AC-US-0002-08 | the asphalt mesh is the ribbon between the left and right edges of the file geometry, vertex for vertex | número de vértices ≠ 2 × (n + 1), vértice a mais de 1e-4 m (float32) da borda esquerda ou direita do arquivo (desenho com largura fixa ou suavização própria), índices ≠ 6 por segmento, sem sombra recebida |
| CHK-TEST-0010-02 | AC-US-0005-03 | every curb stripe is drawn on the side of the track its span declares, alternating two colours every metre | menos de uma faixa por metro de zebra, centro de faixa do lado oposto ao do trecho que contém a sua distância de volta ou fora de uma zebra (mutação I), ≠ 2 cores, algum dos 34 trechos sem faixa |
| CHK-TEST-0010-03 | AC-US-0004-06 | the barrier is drawn in its whole length: one instance per segment, centred on it, scaled to its length, 0.2 m thick | `count` ≠ segmentos (mutação H), soma das escalas z ≠ comprimento declarado (1e-6), instância a mais de 1e-4 m do ponto médio ou com escala z ≠ comprimento do segmento, espessura ≠ 0,2 m, altura ≤ 0,5 m, barreira total ≤ 50 m, sem sombra projetada |
| CHK-TEST-0010-04 | AC-US-0002-03 | the start line is drawn across the asphalt at point 0, as wide as the track there | menos de 2 quadrados, quadrado a mais de largura/2 + 1 m do ponto 0, número de quadrados ≠ 2 × ⌊largura/1,1⌋ |
| CHK-TEST-0010-05 | AC-US-0002-08 | the minimap transform fits the track box into the canvas with a margin | escala ≠ min(200/w, 130/h), canto da caixa mapeado fora de [10; 210] × [10; 140] px, partes da cena diferentes de asfalto, zebras, barreiras e linha de largada |
