---
id: DES-0008
title: Desenho da Kart Park na tela de corrida — grama, asfalto, faixa de borda, zebras com relevo, barreira de pneus, linha de largada e minimapa — implementação
feature: pista-kart-park
stage: code
status: draft
version: 2.0.0
sources: [SCR-0003, FLOW-0002, RULE-0006, FEAT-0002, FEAT-0004, FEAT-0005, FEAT-0007, FEAT-0008, REQ-FEAT-0002-13, REQ-FEAT-0004-08, REQ-FEAT-0005-04, REQ-FEAT-0007-01, REQ-FEAT-0007-02, REQ-FEAT-0008-01, REQ-FEAT-0008-02, REQ-FEAT-0008-03, REQ-FEAT-0008-04, REQ-FEAT-0008-05, REQ-FEAT-0008-06, REQ-FEAT-0008-07, REQ-FEAT-0008-08, REQ-FEAT-0008-09, REQ-FEAT-0008-10, REQ-FEAT-0008-11, REQ-FEAT-0008-12, REQ-FEAT-0008-13, REQ-FEAT-0008-14, REQ-FEAT-0008-15, REQ-FEAT-0008-16, REQ-FEAT-0008-17, REQ-FEAT-0008-18, REQ-FEAT-0008-19, REQ-FEAT-0008-20, REQ-FEAT-0008-21, REQ-FEAT-0008-22, REQ-FEAT-0008-23, REQ-FEAT-0008-24]
---

# DES-0008 — Desenho da Kart Park na tela de corrida — implementação

Rodada 5 (2026-11-03, Mode A sobre o projeto DES-0008 2.1.0, `dspec-validation-20261103-1946`): `src/trackScene.ts`, camada
aplicação, alterado (134 → 262 linhas), importa só `three`, o tipo `Point` de `src/track.ts` e `BARRIER_HALF_WIDTH_M`/`TrackGeometry`
de `src/trackGeometry.ts`; sem DOM, sem textura, sem rede; constrói em Node. `src/main.ts` alterado em uma linha (`:239`). Linhas
citadas são as da árvore desta rodada (`src/trackScene.ts` 262 linhas, `src/main.ts` 671 linhas).

## Realização por requisito

| Requisito | Arquivo e símbolo |
|---|---|
| REQ-FEAT-0002-13 | `src/trackScene.ts` `asphaltMesh` (`:62-80`, sem mudança: `leftEdge[i]`/`rightEdge[i]` a y 0,03, volta fechada, `#434d48`); filho `asphalt` |
| REQ-FEAT-0005-04 | `curbsMesh` (`:124-162`: quadriláteros de zebra subdivididos a cada `CURB_STRIPE_M`, `#c8423b`/`#f0e9d5` alternadas desde `fromLapM`); filho `curbs` |
| REQ-FEAT-0004-08 | `barriersMesh` (`:210-224`) sobre `tyreStackCentres` (`:196-208`): pilhas em toda a extensão de cada poligonal de `barriers`; filho `barriers` |
| SCR-0003 | `startLine` (`:226-247`, sem mudança); `buildTrackScene` (`:249-254`) com os seis filhos `grass`, `asphalt`, `edge-lines`, `curbs`, `barriers`, `start-line`, única entrada a geometria; `minimapTransform` (`:257-262`, sem mudança) |
| REQ-FEAT-0008-01, -02 | `EDGE_LINE_WIDTH_M` (`:10`, 0,10); `edgeLinesMesh` (`:91-122`) e `inwardNormal` (`:83-89`): duas tiras fechadas, vértice externo `leftEdge[i]`/`rightEdge[i]`, interno deslocado por `(n_a + n_b) · EDGE_LINE_WIDTH_M / (1 + n_a·n_b)` (a bissetriz `m_i` vezes `EDGE_LINE_WIDTH_M / cos(θ_i/2)`), normais para o lado de `centerline`; y 0,033 (`EDGE_LINE_Y`, `:25`); `#f2f2ec`, `polygonOffset` fator e unidades −1, recebe sombra; 684 segmentos e 2.736 triângulos no arquivo publicado, largura perpendicular 0,1000 m em todo segmento, nenhum vértice interno fora de `asphalt` por `classifySurface` (medido nesta rodada) |
| REQ-FEAT-0008-06, -07 | `CURB_RELIEF_M` (`:11`, 0,04); `curbsMesh` `:146-147`: cantos do lado do asfalto (`e0`, `e1`) a `CURB_Y` 0,035 e de fora (`o0`, `o1`) a 0,075; normais por `computeVertexNormals` sobre a rampa |
| REQ-FEAT-0008-12 a -15 | `TYRE_RADIUS_M` (`:13`, igual a `BARRIER_HALF_WIDTH_M` 0,1), `TYRE_SEGMENTS` 12, `TYRE_HEIGHT_M` 0,18, `TYRES_PER_STACK` 5, `TYRE_SPACING_M` 0,12 (`:14-17`); `tyreStackGeometry` (`:164-194`): 5 cilindros abertos de y 0 a 0,9 m mais a tampa do pneu de cima, 132 triângulos, cor por vértice `#1b1b1b`/`#2a2a2a` alternada por pneu; `tyreStackCentres`: uma pilha em cada vértice e `⌈l / TYRE_SPACING_M⌉ − 1` pontos interiores por segmento; `barriersMesh`: `InstancedMesh`, só translação (`makeTranslation`), projeta e recebe sombra. No arquivo publicado: 646 pilhas (medido nesta rodada) |
| REQ-FEAT-0008-16, -17, -18 | `GRASS_TONES` (`:19`), `GRASS_STRIPE_M` (`:18`); `grassToneAt` (`:33-36`: `((⌊xM / 5⌋ mod 2) + 2) mod 2`, só da posição); `grassMesh` (`:38-60`): 400 faixas de −1.000 a 1.000 m, 4 vértices próprios cada (1.600 vértices, 800 triângulos), cor `GRASS_TONES[grassToneAt(x da borda esquerda, 0)]`, normal +y, `MeshStandardMaterial` com `roughness` 0,9 como o `ground`, recebe sombra |
| REQ-FEAT-0008-21 | `src/main.ts:239` `ground.visible = !(ready && trackGeometry)` em `chooseTrack`; `ground` (`:53`, `#68865b`) e `syntheticScene` sem mudança |
| REQ-FEAT-0008-22, -23, -24 | `buildTrackScene(geometry)` com um só parâmetro; `src/trackScene.ts` não lê canal, tela, relógio, sorteio, endereço nem armazenamento, não carrega imagem nem textura e não tem configuração; toda cor é constante do módulo |
| REQ-FEAT-0008-03 a -05, -08 a -11, -19, -20 | só desenho: nenhum módulo de simulação nem `src/trackData.ts` importa `./trackScene`; `src/physics.ts`, `src/trackGeometry.ts`, `src/curbFeedback.ts` e `src/audio.ts` não foram tocados (DES-0006) |
| REQ-FEAT-0007-01, -02; FEAT-0007 | 6 objetos desenháveis com a cena sintética e o `ground` ocultos; nenhuma textura nem material transparente; sem configuração de qualidade; a taxa de quadros nos aparelhos de referência é medição humana (E2E-03, E2E-05 em `docs/kart-park-device-log.md`, estágio de testes) — não medida nesta rodada |

Constantes e cores retiradas pela troca de caixas por pneus: `BARRIER_COLOR` (`#e6dfc9`) e `BARRIER_HEIGHT_M`; não eram exportadas.
A prova em Node (`tests/pista-kart-park-scene.test.ts`) é do estágio de testes.
