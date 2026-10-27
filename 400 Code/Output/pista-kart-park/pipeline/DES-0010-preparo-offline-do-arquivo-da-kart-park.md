---
id: DES-0010
title: Preparo offline do arquivo de pista da Kart Park — implementação
feature: pista-kart-park
stage: code
status: validated
version: 1.1.0
sources: [FLOW-0003, RULE-0002, FEAT-0002, FEAT-0003, FEAT-0004, FEAT-0005, REQ-FEAT-0002-01, REQ-FEAT-0002-02, REQ-FEAT-0002-03, REQ-FEAT-0002-04, REQ-FEAT-0002-05, REQ-FEAT-0002-06, REQ-FEAT-0002-07, REQ-FEAT-0002-08, REQ-FEAT-0002-09, REQ-FEAT-0002-10, REQ-FEAT-0002-11, REQ-FEAT-0002-14, REQ-FEAT-0003-01, REQ-FEAT-0003-02, REQ-FEAT-0003-03, REQ-FEAT-0003-04, REQ-FEAT-0003-05, REQ-FEAT-0003-06, REQ-FEAT-0003-07, REQ-FEAT-0003-12, REQ-FEAT-0004-01, REQ-FEAT-0004-02, REQ-FEAT-0004-03, REQ-FEAT-0005-01, REQ-FEAT-0005-02, REQ-FEAT-0005-03, REQ-FEAT-0006-09]
---

# DES-0010 — Preparo offline do arquivo da Kart Park — implementação

`scripts/trackPrep.ts` (biblioteca pura, 391 linhas; importa só `src/track.ts`, `src/trackData.ts`, `src/trackGeometry.ts`),
`scripts/track-pipeline.ts` (programa, 167 linhas; `node:crypto`, `node:fs`, `node:path`, `TRAINING_TRACKS`),
`tracks/sources/kart-park.json` (cópia byte a byte, SHA-256 `52c5adda…`), `package.json` script `track`. Rodada 2 (DES-0010 1.1.0,
ADR-0006 1.1.0): a entrada `kart-park` 1 e o arquivo da rodada reprovada foram retirados e o preparo refeito:
`npm run track -- prepare kart-park 1` → `PREPARED src/tracks/kart-park-v1.json smoothingWindowM=12 lapLengthM=682.116
maxSmoothingOffsetM=0.295 reducedCurbs=nenhuma bytes=43013`. Constantes de ADR-0006 em `scripts/trackPrep.ts:12-27`
(`SMOOTH_WINDOW_M` 12, `SMOOTH_MAX_OFFSET_M` 0,295, `TARGET_LAP_LENGTH_M` 687,5, `LAP_LENGTH_TOLERANCE` 0,01; sem `SMOOTH_LAMBDA`
nem `SMOOTH_MAX_ITERATIONS`).

## Realização por requisito

| Requisito | Arquivo e símbolo |
|---|---|
| FLOW-0003 (passos 1 a 8); REQ-FEAT-0002-01, -02 | `readOriginTrack` (`:59-91`: `formato`, `versao`, `sentido`, `largada.indice` 0, pontos `[x, y, largura]`, zebras `lado`/`de_m`/`ate_m`; não lê nome, cidade, comprimentos nem recorde), `prepareTrack` (`:181-276`), identidade `schemaVersion` 3 / `trackId` / `trackVersion` / `osmDerived` `true` / `COUNTER_CLOCKWISE` (`:266-271`) |
| REQ-FEAT-0002-03, -04, -07, -08 | conversão `O_i = (x_i − cx, −(y_i − cy))` com o centro da caixa arredondado (`:183-187`); falha se a soma de enrolamento não indica anti-horário (`:188`); 684 pontos na ordem da origem, volta fechada sem repetir o ponto 0 |
| REQ-FEAT-0002-05, -10, -11 | `smooth` (`:93-116`): para cada ponto, média ponderada dos pontos da origem a até 6 m de distância de volta na linha original (`cumulativeOf`, volta fechada, `j` em ordem crescente), pesos `½ (1 + cos(π δ / 6))`, grampo de 0,295 m em torno do ponto correspondente, arredondamento a 0,001 m, comprimento remedido sobre a linha arredondada (`polylineLength`); `prepareTrack` falha, sem escrever, fora de 687,5 m ± 1 % (`:190-194`). Medido: 682,116 m, desvio máximo 0,2955 m, 22 pontos no grampo; bordas sem cruzamento conferidas por V08 |
| REQ-FEAT-0002-09 | `widthM` copiada e arredondada (`:195`) |
| REQ-FEAT-0002-06; REQ-FEAT-0003-01 | `startPosition` no meio de P0→P1 com `headingDeg = atan2(dx, dz)` (`:238-239`); `finishLine = transversalLine(g, 0)` (`:268`) |
| REQ-FEAT-0003-02 a -07, -12 | limites nos pontos que minimizam `|d_o(i) − D_k|` (`:240-244`; pontos 200, 348, 527); marcadores `n = ⌈L/18⌉` = 38, `s/2 + k·s`, afastados 2 m do ponto 0 e dos limites (`:245-265`); `transversalLine` (`:133-161`, o passo 9 de DES-0010 1.1.0: pela normal, de cada lado a partir da borda da pista — borda externa da zebra se houver — em passos de 0,05 m até 3 m além da borda (`beyondTrackEdgeM`, refino `refineEnd` `:163-171`), parando no último ponto de grama antes de outra parte da pista ou no cruzamento com a barreira (`segmentCrossing` `:173-179`); `from` esquerda, `to` direita) |
| REQ-FEAT-0005-01, -02, -03 | zebras por índice fracionário em `d_o` levado à linha publicada (`fractionalIndex` `:118-126`, `toLap` `:199`); a que cruza a largada dividida em dois trechos (`:200-206`; `RIGHT 671,129–682,116` e `0–2,977`): 34; largura 1,0 m reduzida pela folga de grama a outra parte da volta (> 30 m de distância de volta) até 0,4 m (`:207-229`), falha abaixo de 0,3 m (`:230-231`); cada trecho com largura > 0 para fora da borda |
| REQ-FEAT-0004-01, -02, -03 | `buildBarriers` (`:287-367`, o passo 5 de DES-0010 1.1.0): pares de amostras a cada 0,25 m nas bordas dos trechos de d_o 371–414 m e 580–615 m, borda voltada para o outro trecho pela amostra mais próxima, `|p − q| ≤ 6` m, vértice no meio da parte de grama de `pq` (marcha de 0,01 m com `classifySurface`), falha com grama abaixo de 0,2 m, vértices ordenados pela distância de volta no primeiro trecho, sequência contínua (salto ≤ 1 m) por barreira; resultado na linha suavizada: 1 poligonal de 382 vértices, 53,29 m, a ≥ 0,510 m do asfalto |
| REQ-FEAT-0002-14; REQ-FEAT-0006-09 | `serializeTrackFile` (`:380-391`) compacta, uma linha, sem nome, comprimento oficial ou recorde; 43 013 bytes |
| RULE-0002; FEAT-0002 a FEAT-0005 | `PrepRecord` (`:47-50`, preenchido em `:272-275`: `smoothingWindowM`, `maxSmoothingOffsetM`, `lapLengthM`, `originOffsetM`, `curbWidthsM`, `reducedCurbs`) gravado no registro por `publish`; `lapLengthM` só em `prep`, nunca chave do arquivo (DM-0001, V18) |

Programa: `parseArgs` (`scripts/track-pipeline.ts:40-62`) valida `<comando>`, `<trackId>` (`[a-z0-9-]{1,40}`, no catálogo, com
origem em `tracks/sources/`), `<trackVersion>` (1 a 6 dígitos sem zero à esquerda) e `--esri-decision` antes de ler ou escrever
qualquer arquivo; recusa com `argumento inválido: <nome>` e código 1, sem reproduzir o valor. `prepare` (`:96-109`) confere o resumo
da origem (`ORIGIN_SHA256` `:24-26`), recusa par já registrado (`:98`), escreve por temporário e renomeação; a saída lista só identificadores,
contagens e medidas.
