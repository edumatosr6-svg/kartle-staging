---
id: TEST-0012
title: Publicação — trackVersion 1, resumo e tamanho no registro, reprodução byte a byte pelo preparo, recusas do programa numa cópia temporária (promoção sem decisão Esri, regeneração, argumentos)
feature: pista-kart-park
stage: test
status: draft
version: 1.0.0
sources: [NFR-0006, NFR-0012, NFR-0001, AC-US-0002-06]
---

# TEST-0012 — Publicação, registro e programa

| | |
|---|---|
| Arquivo | `tests/pista-kart-park-publication.test.ts` (estratégia: `publication`) |
| Nível | arquivo (`tracks/registry.json`, `src/tracks/kart-park-v1.json` e `tracks/sources/kart-park.json` lidos no lugar; SHA-256 por `node:crypto`), unitário (`prepareTrack` + `serializeTrackFile` contra o texto publicado) e programa (`scripts/track-pipeline.ts` executado por `node node_modules/tsx/dist/cli.mjs` com o diretório de trabalho numa cópia temporária dos três arquivos em `os.tmpdir()`, apagada no fim; o repositório nunca é tocado) |
| Interface exercitada | `prepareTrack`, `readOriginTrack`, `serializeTrackFile`, `SMOOTH_WINDOW_M` (`scripts/trackPrep.ts`); `MAX_FILE_BYTES`; comandos `verify`, `prepare`, `publish`, `promote` e os argumentos inválidos de `scripts/track-pipeline.ts` |
| Fixtures | `registryJson()`, `kartParkText()`, `originJson()`; `sandbox()` (cópia temporária); decisão de teste "DOMAIN/DEC-08 decisão de teste"; `prepareTrack(..., {trackVersion: 2})` como contraprova |

## Verificações

| Check | Decide | Teste | O que a faria falhar |
|---|---|---|---|
| CHK-TEST-0012-01 | NFR-0006, NFR-0012 | the Kart Park is published as trackVersion 1 and the registry records its digest, size, STAGING state and preparation facts | `trackVersion` ≠ 1, entrada ausente, `registryVersion` ≠ 1, `file` diferente, `sha256` ≠ SHA-256 dos bytes publicados (mutação G: qualquer byte alterado depois da publicação), `fileBytes` ≠ tamanho, estado ≠ `STAGING`, campos de promoção presentes, `stagedAtUtc` fora do formato ISO, origem ou resumo da origem diferentes, janela ≠ `SMOOTH_WINDOW_M`, `lapLengthM` a mais de 0,001 m do medido, larguras de zebra diferentes das publicadas |
| CHK-TEST-0012-02 | NFR-0006 | the (trackId, trackVersion) pairs of the registry are unique and the bundled Kart Park is the highest published version | par repetido, arquivo empacotado com versão abaixo da maior do registro, `main.ts` importando outra versão, versão não inteira positiva |
| CHK-TEST-0012-03 | NFR-0006, AC-US-0002-06 | the preparation reproduces the published file byte for byte from the origin, with the preparation record of the registry | origem ilegível, preparo recusado, texto serializado ≠ publicado (mutação G; qualquer mudança na suavização, nas zebras, na barreira, nos setores ou nos marcadores sem versão nova), `prep` diferente do registro em janela, desvio máximo, comprimento, deslocamento da origem, larguras ou zebras reduzidas; versão 2 com o mesmo texto (a comparação não poderia falhar) |
| CHK-TEST-0012-04 | NFR-0012 | no production entry exists without a recorded Esri decision, and the program refuses to promote without one | entrada `PRODUCTION` sem `esriDecisionRef` ou `promotedAtUtc`, `promote` sem `--esri-decision` saindo 0 ou sem "argumento inválido: --esri-decision" ou alterando o registro, decisão vazia aceita, promoção com decisão recusada ou sem gravar `PRODUCTION`/referência/instante ou alterando o resumo, segunda promoção não idempotente, registro do repositório fora de `STAGING` |
| CHK-TEST-0012-05 | NFR-0006 | the program verifies the published version, refuses to regenerate it, treats a second publish as already registered, and validates its arguments before touching a file | `verify` saindo ≠ 0, sem 18 `PASS` ou sem `VERIFIED`; `prepare kart-park 1` aceito ou alterando o arquivo; `publish` repetido recusado ou sem "já registrado"; `trackVersion` `01`, `trackId` `synthetic`, `--esri-decision` fora de `promote` ou comando desconhecido aceitos ou com outra mensagem; `prepare kart-park 2` recusado, não escrevendo `kart-park-v2.json` ou tocando a versão 1 |
| CHK-TEST-0012-06 | NFR-0001 | the published size is below the 200 000 byte limit the registry and the program apply | `fileBytes` ou o tamanho medido ≥ `MAX_FILE_BYTES`, `publish` sem a recusa no limite |
