---
id: DES-0008
title: Desenho da Kart Park na tela de corrida — asfalto, zebras, barreira, linha de largada e minimapa — implementação
feature: pista-kart-park
stage: code
status: validated
version: 1.1.0
sources: [SCR-0003, FLOW-0002, FEAT-0002, FEAT-0004, FEAT-0005, FEAT-0007, REQ-FEAT-0002-13, REQ-FEAT-0004-08, REQ-FEAT-0005-04, REQ-FEAT-0007-01, REQ-FEAT-0007-02]
---

# DES-0008 — Desenho da Kart Park na tela de corrida — implementação

`src/trackScene.ts`, camada aplicação, novo (134 linhas): importa `three` e `src/trackGeometry.ts`; sem DOM; constrói em Node.
`src/main.ts`: a cena sintética (faixas, zebras decorativas, caixas do muro, linha de largada, árvores — os mesmos objetos e valores)
passa a filha de `syntheticScene` (`:58-60`, `:80`, `:100`, `:105`, `:114`, `:127`; linhas de `src/main.ts` da árvore da rodada 4, 670 linhas); chão, luzes, Kart 01 e marcas ficam em `scene`.

## Realização por requisito

| Requisito | Arquivo e símbolo |
|---|---|
| REQ-FEAT-0002-13 | `src/trackScene.ts` `asphaltMesh` (`:18-37`: `BufferGeometry` dos `leftEdge[i]`/`rightEdge[i]` a y 0,03, dois triângulos por segmento, volta fechada, `#434d48`); filho `asphalt` |
| REQ-FEAT-0005-04 | `curbsMesh` (`:39-75`: os quadriláteros de zebra da geometria, subdivididos a cada `CURB_STRIPE_M` 1 m, cores por vértice `#c8423b`/`#f0e9d5` alternadas desde `fromLapM`, y 0,035); filho `curbs` |
| REQ-FEAT-0004-08 | `barriersMesh` (`:77-96`: `InstancedMesh` de caixa unitária, uma instância por segmento, 0,2 × 0,9 m × comprimento, no meio e no rumo do segmento, `#e6dfc9`, sombra); filho `barriers`, 394 instâncias na Kart Park |
| SCR-0003 | `startLine` (`:98-119`: quadrados 1,1 × 0,7 m alternados `#eff0df`/`#25362f` no ponto 0 ao longo da normal, y 0,055); `buildTrackScene` (`:121-127`) com os quatro filhos nomeados; `minimapTransform` (`:129-134`: caixa em 200 × 130 px centrada em 220 × 150 px) |
| FLOW-0002; FEAT-0002, FEAT-0004, FEAT-0005 | `src/main.ts` `chooseTrack` (`:225-250`; troca de cena `:236-247`): `syntheticScene.visible` com a sintética `READY`; grupo da Kart Park construído uma vez (`trackScenes[trackId]`) e `visible`; `FAILED` sem grupo visível; `trackBounds` da caixa da geometria para a visão geral; `minimap` (`:407-422`): linha central da sessão com `minimapTransform` ou a transformação literal da sintética (`* 1.1 + 110`, `* 1.1 + 75`); sem sessão pronta só limpa |
| REQ-FEAT-0007-01, -02; FEAT-0007 | 3 objetos desenháveis mais a linha de largada; sem configuração de qualidade; a taxa de quadros nos aparelhos de referência é medição humana (`docs/kart-park-device-log.md`, estágio de testes) — não medida nesta rodada (navegador embutido) |

Sem árvores, tribuna ou cerca (outra feature). A caixa de sombra acompanha o kart desde `modelo-kart-01` (±60 m), de modo que a
linha "extensões da câmera de sombra" do projeto não tem mais objeto. A prova em Node (`tests/pista-kart-park-scene.test.ts`) é do
estágio de testes.
