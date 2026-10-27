---
id: DES-0002
title: Geometria da pista declarada no arquivo — bordas, zebras, borda da pista e barreiras — implementação
feature: pista-kart-park
stage: code
status: validated
version: 1.1.0
sources: [RULE-0001, RULE-0002, FEAT-0002, FEAT-0003, FEAT-0005, REQ-FEAT-0002-12, REQ-FEAT-0003-06, REQ-FEAT-0003-10, REQ-FEAT-0005-03, REQ-FEAT-0005-05, REQ-FEAT-0005-06, REQ-FEAT-0005-07]
---

# DES-0002 — Geometria da pista declarada no arquivo — implementação

`src/trackGeometry.ts`, camada dado de pista, novo (289 linhas). Importa só `src/track.ts` (`crossLine`, tipos `Line`, `Point`).
Sem relógio, sem sorteio, sem DOM; a estrutura devolvida é congelada (`Object.freeze` em cada nível).

## Realização por requisito

| Requisito | Arquivo e símbolo |
|---|---|
| RULE-0001, RULE-0002 (definições) | `normalsOf` (`:68-78`: `n_i = (d.z, −d.x)/|d|` com `d = P_(i+1) − P_(i−1)`; diferença nula → normal do segmento, senão a anterior), `buildTrackGeometry` (`:138-216`: `cumulativeM`, `lapLengthM` com o segmento final, `leftEdge`/`rightEdge` a `widthM/2`, `asphaltQuads` `[L_i, L_(i+1), R_(i+1), R_i]`, `curbQuads` com quebras em `fromLapM`, nos pontos internos e em `toLapM`, borda e normal interpoladas sem renormalizar, `curbQuadSpan`, `barrierSegments`, `bounds`, `grid` de `GRID_CELL_M` 8) |
| REQ-FEAT-0005-05 | `classifySurface` (`:219-226`): asfalto, depois zebra, depois grama; `pointInQuad` (`:85-96`, número de cruzamentos, fronteira dentro); fora da caixa é grama; a grade só poda |
| REQ-FEAT-0005-06, -07; REQ-FEAT-0003-10 | `beyondTrackEdgeM` (`:228-234`): 0 sobre asfalto ou zebra; fora, a menor distância a todos os quadriláteros (varredura completa, exata) |
| REQ-FEAT-0003-06; REQ-FEAT-0005-03 | `lapMAtIndex` (`:247-252`), `positionAtLapM` (`:254-256`, centro, normal, bordas interpoladas), `nearestOnCenterline` (`:236-245`, `headingRad = atan2(dx, dz)`), `centerlineCrossings` (`:269-280`), `windingSumOf` (`:282-289`) |
| REQ-FEAT-0002-12 | `buildTrackGeometry` lê `centerline`, `curbs`, `barriers` como declarados; nada é gravado de volta |
| FEAT-0002, FEAT-0003, FEAT-0005 | constantes `GRID_CELL_M` 8, `BARRIER_HALF_WIDTH_M` 0,1, `BARRIER_TOUCH_TOLERANCE_M` 0,01 (`:15-18`); `nearestBarrier` (`:258-266`); `closestOnSegment` (`:57-64`), `pointInQuad` (`:85-96`), `centerlineCrossings` (`:269-280`) e `windingSumOf` (`:282-289`) exportados, listados na tabela de interface de DES-0002 1.1.0 (rodada 2, ISSUE-04) |

## Medidas

Kart Park: 684 pontos, 684 quadriláteros de asfalto, zebras em 34 trechos, 381 segmentos de barreira, caixa x −88,36…88,96 m e
z −59,38…60,20 m, grade 23 × 15 (arquivo da rodada 2). Um passo de `step` com `getTrackContact` custa 0,159 ms em Node (1 200 passos a aceleração
total). As provas de igualdade grade/varredura e dos pontos a 0,05 m das bordas são do estágio de testes.
