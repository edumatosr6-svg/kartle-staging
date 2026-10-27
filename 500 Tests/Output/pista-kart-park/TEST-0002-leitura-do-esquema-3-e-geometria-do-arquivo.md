---
id: TEST-0002
title: Leitura do esquema 3 e geometria do arquivo usada como declarada — API-0001, cópias ilegíveis, padrões neutros e regra de superfície
feature: pista-kart-park
stage: test
status: draft
version: 1.0.0
sources: [AC-US-0002-08, AC-US-0002-04, AC-US-0005-04, AC-US-0005-02, NFR-0006]
---

# TEST-0002 — Leitura do esquema 3 e geometria do arquivo usada como declarada

| | |
|---|---|
| Arquivo | `tests/pista-kart-park-track-data.test.ts` (estratégia: `track-data` e `geometry`) |
| Nível | unitário e contrato (API-0001 campo a campo sobre o arquivo publicado; `readTrackData` sobre cópias com um desvio; `buildTrackGeometry`, `classifySurface`, `beyondTrackEdgeM`, `positionAtLapM`, `nearestOnCenterline`, `windingSumOf`, `checkConsistencyV3`) |
| Interface exercitada | `readTrackData`, `checkConsistencyV3`, `TRACK_SCHEMA_VERSION` (`src/trackData.ts`); `buildTrackGeometry`, `classifySurface`, `beyondTrackEdgeM`, `positionAtLapM`, `nearestOnCenterline`, `lapMAtIndex`, `windingSumOf` (`src/trackGeometry.ts`); `SYNTHETIC_TRACK_FILE` (`src/track.ts`) |
| Fixtures | `kartParkText()`, `kartParkFile()`, `kartParkGeometry()`; cópias `withoutCenterline`, `withTwoPointCenterline`, `withZeroWidth`, `withInvalidCurbSide`, `withOnePointBarrier`, `withTextOsmDerived`, `corruptedText`, `withSchema4`, `withoutCurbs`, `withoutBarriers`, `withReversedCenterline`, `withScaledCoordinates`; pontos da borda ± deslocamentos pela normal sobre um trecho de zebra longo e sobre um trecho sem zebra |

## Verificações

| Check | Decide | Teste | O que a faria falhar |
|---|---|---|---|
| CHK-TEST-0002-01 | AC-US-0002-08 | the reading of the published file carries the centerline, the widths, the curbs and the barriers of the file, value for value | leitura diferente de `COMPLETE`, `centerline`/`curbs`/`barriers`/`startPosition`/linhas lidas diferentes das do arquivo em qualquer valor (suavização ou conversão ao carregar), `osmDerived` ausente, limites de corte inventados |
| CHK-TEST-0002-02 | AC-US-0002-08 | the geometry is built from the declared points: edges at half width along the neighbour normal, cumulative lap distance from the points | geometria com pontos diferentes dos declarados, borda a mais de 1e-9 m de centro ± normal × largura/2 (normal pelos vizinhos), distância acumulada ou comprimento diferentes da soma dos segmentos, número de quadriláteros ≠ pontos |
| CHK-TEST-0002-03 | NFR-0006, AC-US-0002-08 | the synthetic file still reads COMPLETE in schema 2, without geometry fields, while the reader is at schema 3 | sintética em outra versão ou lida como não `COMPLETE`, leitor em outra versão, leitura da versão 2 com campo de geometria |
| CHK-TEST-0002-04 | AC-US-0002-08, NFR-0006 | a schema-3 copy without a usable centerline, or with a curb, barrier or osmDerived out of form, reads UNREADABLE and stays intact | cópia sem `centerline`, com 2 pontos, com largura 0, lado de zebra inválido, barreira de 1 ponto, `osmDerived` texto ou texto corrompido lida como outra coisa que `UNREADABLE`; `schemaVersion` 4 sem `UNSUPPORTED_SCHEMA` com a versão reportada; cópia alterada pelo leitor |
| CHK-TEST-0002-05 | AC-US-0002-08 | curbs and barriers are optional with a neutral default: without them the file is still COMPLETE and the geometry has no curb and no obstacle | cópia sem `curbs` ou sem `barriers` não `COMPLETE` ou com lista não vazia, geometria com quadrilátero de zebra ou segmento de barreira sem declaração, `checkConsistencyV3` do publicado não vazia, publicado sem zebras e barreira |
| CHK-TEST-0002-06 | AC-US-0002-04, AC-US-0002-08 | a reversed or rescaled centerline under the same lines reads INCOMPLETE, naming the consistency check that fails | linha central invertida lida como `COMPLETE`, C1 ausente da lista, soma de enrolamento sem troca de sinal, coordenadas escaladas lidas como `COMPLETE` |
| CHK-TEST-0002-07 | AC-US-0005-04, AC-US-0005-02 | the surface rule of the file geometry: asphalt inside the edges, curb on the declared strip, grass beyond, with the edge distance 0 on asphalt and curb | ponto 0,2 m dentro da borda não asfalto, 0,5 m fora da borda num trecho de zebra não zebra (mutação I), além da faixa não grama, `beyondTrackEdgeM` ≠ 0 sobre zebra ou asfalto, 1 m além da zebra a mais de 0,05 m de 1 m, grama a 1 m da borda sem zebra com outra classificação |
| CHK-TEST-0002-08 | AC-US-0002-08 | lap distance and position are inverse of each other along the declared line | `positionAtLapM` → `nearestOnCenterline` → `lapMAtIndex` fora de 1e-6 m da distância pedida em 40 pontos, posição fora da linha |
