---
id: DES-0010
title: Preparo offline do arquivo de pista da Kart Park — implementação
feature: pista-kart-park
stage: code
status: draft
version: 1.0.0
sources: [FLOW-0003, RULE-0002, FEAT-0002, FEAT-0003, FEAT-0004, FEAT-0005, REQ-FEAT-0002-01, REQ-FEAT-0002-02, REQ-FEAT-0002-03, REQ-FEAT-0002-04, REQ-FEAT-0002-05, REQ-FEAT-0002-06, REQ-FEAT-0002-07, REQ-FEAT-0002-08, REQ-FEAT-0002-09, REQ-FEAT-0002-10, REQ-FEAT-0002-11, REQ-FEAT-0002-14, REQ-FEAT-0003-01, REQ-FEAT-0003-02, REQ-FEAT-0003-03, REQ-FEAT-0003-04, REQ-FEAT-0003-05, REQ-FEAT-0003-06, REQ-FEAT-0003-07, REQ-FEAT-0003-12, REQ-FEAT-0004-01, REQ-FEAT-0004-02, REQ-FEAT-0004-03, REQ-FEAT-0005-01, REQ-FEAT-0005-02, REQ-FEAT-0005-03, REQ-FEAT-0006-09]
---

# DES-0010 — Preparo offline do arquivo da Kart Park — implementação

`scripts/trackPrep.ts` (biblioteca pura, 386 linhas; importa só `src/track.ts`, `src/trackData.ts`, `src/trackGeometry.ts`),
`scripts/track-pipeline.ts` (programa, 167 linhas; `node:crypto`, `node:fs`, `node:path`, `TRAINING_TRACKS`),
`tracks/sources/kart-park.json` (cópia byte a byte, SHA-256 `52c5adda…`), `package.json` script `track`. Executado uma vez:
`npm run track -- prepare kart-park 1` → `PREPARED src/tracks/kart-park-v1.json smoothingIterations=0 lapLengthM=687.52
maxSmoothingOffsetM=0 reducedCurbs=nenhuma bytes=42642`. Constantes de ADR-0006 em `scripts/trackPrep.ts:12-27`.

## Realização por requisito

| Requisito | Arquivo e símbolo |
|---|---|
| FLOW-0003 (passos 1 a 8); REQ-FEAT-0002-01, -02 | `readOriginTrack` (`:59-91`: `formato`, `versao`, `sentido`, `largada.indice` 0, pontos `[x, y, largura]`, zebras `lado`/`de_m`/`ate_m`; não lê nome, cidade, comprimentos nem recorde), `prepareTrack` (`:180-271`), identidade `schemaVersion` 3 / `trackId` / `trackVersion` / `osmDerived` `true` / `COUNTER_CLOCKWISE` (`:261-266`) |
| REQ-FEAT-0002-03, -04, -07, -08 | conversão `O_i = (x_i − cx, −(y_i − cy))` com o centro da caixa arredondado (`:182-186`); falha se a soma de enrolamento não indica anti-horário (`:187`); 684 pontos na ordem da origem, volta fechada sem repetir o ponto 0 |
| REQ-FEAT-0002-05, -10, -11 | `smooth` (`:94-115`: Jacobi λ 0,5, grampo 0,295 m, k de 0 a 400 pelo comprimento arredondado mais perto de 687,5 m, empate o menor) → k = 0 sobre este dado; bordas sem cruzamento conferidas por V08 |
| REQ-FEAT-0002-09 | `widthM` copiada e arredondada (`:190`) |
| REQ-FEAT-0002-06; REQ-FEAT-0003-01 | `startPosition` no meio de P0→P1 com `headingDeg = atan2(dx, dz)` (`:233-234`); `finishLine = transversalLine(g, 0)` (`:263`) |
| REQ-FEAT-0003-02 a -07, -12 | limites nos pontos que minimizam `|d_o(i) − D_k|` (`:235-239`); marcadores `n = ⌈L/18⌉`, `s/2 + k·s`, afastados 2 m do ponto 0 e dos limites (`:240-260`); `transversalLine` (`:132-160`: pela normal, de cada lado a partir da borda da pista — borda externa da zebra se houver — em passos de 0,05 m até 3 m além da borda (`beyondTrackEdgeM`, refino `refineEnd` `:162-170`), parando no último ponto de grama antes de outra parte da pista ou no cruzamento com a barreira (`segmentCrossing` `:172-178`); `from` esquerda, `to` direita) |
| REQ-FEAT-0005-01, -02, -03 | zebras por índice fracionário em `d_o` levado à linha publicada (`fractionalIndex` `:117-125`, `toLap` `:194`); a que cruza a largada dividida em dois trechos (`:195-201`): 34; largura 1,0 m reduzida pela folga de grama a outra parte da volta (> 30 m de distância de volta) até 0,4 m (`:202-224`), falha abaixo de 0,3 m (`:225-226`); cada trecho com largura > 0 para fora da borda |
| REQ-FEAT-0004-01, -02, -03 | `buildBarriers` (`:282-362`): amostras a cada 0,25 m nas bordas dos trechos de d_o 371–414 m e 580–615 m, borda voltada para o outro trecho pela amostra mais próxima, `|p − q| ≤ 6` m, vértice no meio da parte de grama de `pq` (marcha de 0,01 m com `classifySurface`), falha com grama abaixo de 0,2 m, vértices ordenados pela distância de volta no primeiro trecho, sequência contínua (salto ≤ 1 m) por barreira; resultado: 1 poligonal de 395 vértices |
| REQ-FEAT-0002-14; REQ-FEAT-0006-09 | `serializeTrackFile` (`:375-386`) compacta, uma linha, sem nome, comprimento oficial ou recorde; 42 642 bytes |
| RULE-0002; FEAT-0002 a FEAT-0005 | `PrepRecord` (`:47-50`, preenchido em `:267-270`: `smoothingIterations`, `maxSmoothingOffsetM`, `lapLengthM`, `originOffsetM`, `curbWidthsM`, `reducedCurbs`) gravado no registro por `publish` |

Programa: `parseArgs` (`scripts/track-pipeline.ts:40-62`) valida `<comando>`, `<trackId>` (`[a-z0-9-]{1,40}`, no catálogo, com
origem em `tracks/sources/`), `<trackVersion>` (1 a 6 dígitos sem zero à esquerda) e `--esri-decision` antes de ler ou escrever
qualquer arquivo; recusa com `argumento inválido: <nome>` e código 1, sem reproduzir o valor. `prepare` (`:96-109`) confere o resumo
da origem (`ORIGIN_SHA256` `:24-26`), recusa par já registrado (`:98`), escreve por temporário e renomeação; a saída lista só identificadores,
contagens e medidas.
