---
id: DES-0011
title: Verificações V01 a V18 do arquivo, registro de publicação e promoção — implementação
feature: pista-kart-park
stage: code
status: draft
version: 1.0.0
sources: [RULE-0002, RULE-0005, FLOW-0003, FEAT-0002, FEAT-0003, FEAT-0004, FEAT-0005, FEAT-0006, FEAT-0007, REQ-FEAT-0002-01, REQ-FEAT-0002-02, REQ-FEAT-0002-03, REQ-FEAT-0002-04, REQ-FEAT-0002-05, REQ-FEAT-0002-06, REQ-FEAT-0002-07, REQ-FEAT-0002-08, REQ-FEAT-0002-09, REQ-FEAT-0002-10, REQ-FEAT-0002-11, REQ-FEAT-0002-14, REQ-FEAT-0002-17, REQ-FEAT-0002-18, REQ-FEAT-0003-01, REQ-FEAT-0003-02, REQ-FEAT-0003-03, REQ-FEAT-0003-04, REQ-FEAT-0003-05, REQ-FEAT-0003-06, REQ-FEAT-0003-07, REQ-FEAT-0004-01, REQ-FEAT-0004-02, REQ-FEAT-0004-03, REQ-FEAT-0005-01, REQ-FEAT-0005-02, REQ-FEAT-0005-03, REQ-FEAT-0006-09, REQ-FEAT-0006-14, REQ-FEAT-0007-07, REQ-FEAT-0007-13]
---

# DES-0011 — Verificações V01 a V18, registro de publicação e promoção — implementação

`scripts/trackChecks.ts` (biblioteca pura, 361 linhas; importa só `src/track.ts`, `src/trackData.ts`, `src/trackGeometry.ts`;
**não importa** `scripts/trackPrep.ts`: lê a origem com `readOrigin` `:51-69` e a regra de eixos própria), `scripts/track-pipeline.ts`
(`verify`, `publish`, `promote`), `tracks/registry.json`. `npm run track -- verify kart-park 1` → V01 a V18 `PASS`, `VERIFIED`.

## Realização por requisito

| Requisito | Arquivo e símbolo |
|---|---|
| RULE-0002; REQ-FEAT-0007-07 | `verifyTrackFile(text, originJson)` (`scripts/trackChecks.ts:132-333`): exige `COMPLETE` de versão 3, executa V01 a V18 sempre na mesma ordem; `CheckResult.detail` só com identificadores e medidas; a mesma função serve ao programa e a `npm test` |
| REQ-FEAT-0002-03, -05, -10 (V01, V02, V07) | `:149-159`, `:184-188`: 684/684 pontos, desvio máximo 0,0000 m à origem e à poligonal original |
| REQ-FEAT-0002-10 (V03); REQ-FEAT-0002-06, REQ-FEAT-0003-01 (V04); REQ-FEAT-0002-07, -08 (V05); REQ-FEAT-0002-09 (V06) | `:160-183`: 687,520 m; chegada em P0 ao longo de n0 da esquerda para a direita, largada em P0→P1 (t 0,5) do lado de depois com o rumo do segmento; área +16 153,5 m² e `COUNTER_CLOCKWISE`; larguras iguais, 4,4 e 10,8 |
| REQ-FEAT-0002-11 (V08) | `:190-204`: bordas sem autointerseção nem interseção mútua (`segmentsCross`, vizinhos excluídos) |
| REQ-FEAT-0003-02, -03 (V09); REQ-FEAT-0003-04, -05 (V10) | `:205-224`: limites nos pontos 200, 348, 527; 39 marcadores crescentes, nenhum no ponto 0 nem num limite, espaçamento máximo 18,29 m (≤ 25) |
| REQ-FEAT-0003-06, -07 (V11) | `:225-257`: 43 linhas, amostradas a 0,05 m, cruzam a pista de borda a borda (pontas na grama, pista contígua), pontas a ≤ 3,001 m além da borda; ponta a menos de 2,95 m tem pista ou cruzamento de barreira nos 0,06 m seguintes ou está sobre a barreira (≤ 0,001 m) |
| REQ-FEAT-0005-01, -02, -03 (V12) | `:258-285`: 34 trechos, cada zebra da origem casada por índice fracionário (± 0,0005 m), a que cruza a largada em dois trechos `[início, lapLengthM]` e `[0, fim]`, `from < to`, `widthM > 0` |
| REQ-FEAT-0004-01, -02, -03 (V13, V14, V15) | `:286-316`: 385 pares de amostras a ≤ 6 m entre os trechos, todos cortados pela barreira (cruzamento ou toque dentro de 0,002 m, `segmentsTouch` `:82-83`); soma das distâncias aos asfaltos dos dois trechos ≤ 6 m em todo vértice e amostra (máx. 5,743 m); nenhum vértice no asfalto, nenhum segmento cruza uma borda |
| REQ-FEAT-0002-01, -02 (V16); REQ-FEAT-0002-14 (V17); REQ-FEAT-0006-09 (V18) | `:317-332`: identidade e ausência de `cutDistanceM`/`cutDurationMs`; 42 642 bytes e literal de 49 049 caracteres < 200 000 (`utf8Length` `:351-360`, sem `node:buffer`); conjunto de chaves de DM-0001 em todo nível (`unexpectedKey` `:99-129`) |
| REQ-FEAT-0002-17, -18; RULE-0005; FLOW-0003 (passos 9 a 11) | `scripts/track-pipeline.ts` `verify` (`:111-122`: `VERIFIED` código 0, `REJECTED` com os identificadores código 1), `publish` (`:124-149`: `VERIFIED` na mesma execução, SHA-256 por `createHash('sha256')`, dedupe por par com o mesmo resumo, recusa de outro conteúdo, reprodução byte a byte, escrita atômica), `readRegistry` (`:73-84`) |
| REQ-FEAT-0007-13; REQ-FEAT-0006-14; FEAT-0006, FEAT-0007 | `promote` (`:151-160`) só com `--esri-decision` validado (`:48-56`); `PRODUCTION` com `promotedAtUtc` e `esriDecisionRef`; o crédito da Esri fica para a entrega que promover, sem chave |
| FEAT-0002 a FEAT-0005 | `tracks/registry.json`: entrada `kart-park` 1 `STAGING` (`fileBytes` 42 642, `sha256` `24093e90…`, `prep`) |

As provas em `npm test` (`tests/pista-kart-park-track-file.test.ts` com um teste por V, cópias desviadas, `-publication.test.ts`
com o resumo registrado e a unicidade do par) são do estágio de testes; `verifyTrackFile` executado duas vezes nesta rodada deu
listas iguais.
