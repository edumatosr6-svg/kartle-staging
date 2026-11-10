---
id: TEST-0005
title: Arquivos entregues e medida do build — origem e forma entregue contra o registro, sons copiados byte a byte, dimensões e tetos, e ASSET_BUDGET sobre pastas dist montadas pelo teste, uma por motivo de reprovação
feature: apresentacao-e-som
stage: test
status: draft
version: 1.0.0
sources: [AC-US-0001-04, AC-US-0002-02, AC-US-0002-05, AC-US-0003-10, AC-US-0004-06, NFR-0001, NFR-0002, NFR-0003, NFR-0006, NFR-0007, NFR-0008]
---

# TEST-0005 — Arquivos e medida do build

| | |
|---|---|
| Arquivo | `tests/apresentacao-e-som-assets.test.ts` (estratégia: arquivo e unitário; registro `ASSET_BUDGET` de API-0003) |
| Nível | arquivo (os bytes de `docs/art/`, `docs/sfx/` e `src/assets/` e o registro `src/assets/feature-assets.json`); unitário (`measureAssetBudget`, `readImageSize`, `initialDownloadFiles`, `embeddedPayloads` sobre pastas montadas pelo teste) |
| Interface exercitada | `measureAssetBudget`, `readImageSize`, `initialDownloadFiles`, `embeddedPayloads` (`scripts/assetBudget.ts`) |
| Fixtures | `goodDist()` (o documento, o JS de entrada com as duas gravações embutidas como texto `data:`, o CSS e as duas imagens com resumo no nome), escrito em diretório temporário e apagado ao fim; `jpegOf(largura, altura)` (JPEG reduzido ao cabeçalho de quadro); `noise(n)` (bytes que o gzip não reduz, gerador de semente fixa); `withAsset` (o registro de origem com o resumo de uma forma entregue trocado) |

O registro `ASSET_BUDGET` do `dist/` real sai de `npm run build && npm run check:assets`, fora de `npm test` (nível "Build" da estratégia); a leitura desta rodada está em `runs/asset-budget-20261110-1849.json`.

## Verificações

| Check | Decide | Teste | O que a faria falhar |
|---|---|---|---|
| CHK-TEST-0005-01 | AC-US-0001-04 | the delivered icon is derived from docs/art/icon.png: the recorded digests are those of the two files, 192 × 192 in the square proportion of the origin | origem ou forma entregue com outro resumo; origem diferente de `docs/art/icon.png`; dimensões diferentes de 192 por 192; origem não quadrada; formato diferente de PNG opaco; acima de 45.000 bytes |
| CHK-TEST-0005-02 | AC-US-0002-05 | the delivered cover is derived from docs/art/cover.png: the recorded digests are those of the two files, and 1200 × 670 keeps the proportion of the origin | resumo diferente; origem diferente de `docs/art/cover.png`; dimensões fora da proporção de 2752 por 1536 (recorte); formato diferente de JPEG; acima de 100.000 bytes |
| CHK-TEST-0005-03 | AC-US-0003-10 | the engine recording delivered is docs/sfx/engine-loop.mp3 byte for byte | um byte diferente entre `src/assets/engine-loop.mp3` e a origem; registro com outro resumo, outro tamanho ou transformação diferente de `COPY` |
| CHK-TEST-0005-04 | AC-US-0004-06 | the tyre recording delivered is docs/sfx/tire-screech.mp3 byte for byte | um byte diferente (M21); registro divergente; o arquivo do pneu igual ao do motor |
| CHK-TEST-0005-05 | NFR-0008 | the origin record names exactly the 4 files of the feature, one per role, with the digests the visual inspection has to quote | papel a mais, a menos ou repetido; resumo que não é o do arquivo entregue hoje (M21); imagem além da capa e do ícone; resultado de inspeção escrito no registro |
| CHK-TEST-0005-06 | AC-US-0002-02 | the delivered cover is 1200 px wide or more, and a build whose cover is 1199 px wide is COVER_TOO_NARROW | capa entregue com menos de 1200 px; capa de 1199 px aprovada; capa de 1200 px reprovada; cabeçalho ilegível sem `COVER_TOO_NARROW` e largura 0 |
| CHK-TEST-0005-07 | AC-US-0002-02 | the size of an image is read from the header of a PNG and of a JPEG, baseline or progressive, and anything else has no size | largura e altura trocadas; largura acima de 65.535 truncada; JPEG progressivo não lido; tabela de Huffman lida como quadro; tamanho devolvido para arquivo que não é imagem |
| CHK-TEST-0005-08 | NFR-0002 | each delivered form fits its ceiling and the 4 sum at most 300,000 bytes; a build whose 4 files sum more is BUDGET_EXCEEDED | forma entregue acima do teto de DM-0001; soma acima de 300.000; soma de 300.001 aprovada; soma de 300.000 reprovada; texto em base 64 contado no lugar dos bytes |
| CHK-TEST-0005-09 | NFR-0001 | the initial download is the gzip of the document and of every file it asks for when it opens, and 3,000,000 bytes or more is INITIAL_DOWNLOAD_EXCEEDED | download de 3.000.000 bytes ou mais aprovado (M19); arquivo não pedido pelo documento contado; bytes contados sem compressão |
| CHK-TEST-0005-10 | NFR-0003 | a build of the feature delivers 4 of 4 files inside the initial download: the 2 images as files the document asks for and the 2 recordings inside the entry script | `assetCount` ou `assetsInInitialDownloadCount` diferente de 4 num build correto; gravação embutida não achada pelo resumo; publicação sob caminho base não reconhecida |
| CHK-TEST-0005-11 | NFR-0003 | a build without one image or without one recording inside a script is ASSET_MISSING | build sem o ícone, sem a capa ou sem uma gravação aprovado; gravação com um bit diferente aceita como a entregue; `dist` inexistente sem registro `FAIL` completo |
| CHK-TEST-0005-12 | NFR-0003 | a build whose document does not ask for the cover, or whose recording sits in a script the document does not ask for, is ASSET_NOT_IN_INITIAL_DOWNLOAD | `og:image` ou `apple-touch-icon` contados como pedidos ao abrir (M18); gravação num JS não pedido contada como download inicial |
| CHK-TEST-0005-13 | NFR-0003 | the files the document asks for when it opens are its scripts and its stylesheet, modulepreload, icon and preload links of the same origin, each once | `apple-touch-icon` (M18), `og:image`, `canonical`, comentário, endereço de outra origem, `data:` ou imagem do `body` contados; arquivo repetido; consulta ou fragmento mantidos |
| CHK-TEST-0005-14 | NFR-0003 | the payloads embedded in a script are every base 64 data literal of its text, with its type and its decoded bytes | literal não achado; bytes decodificados diferentes; endereço ou `data:` sem base 64 contado; tipo fora de minúsculas |
| CHK-TEST-0005-15 | NFR-0007 | a build of the feature delivers no sound for the curb: any audio file, or a third sound inside a script, is CURB_SOUND_FILE_PRESENT | arquivo `.mp3`, `.ogg`, `.wav` ou `.m4a` extra aprovado; terceiro som embutido aprovado; imagem embutida contada como som; `curbSoundFileCount` diferente de 0 num build correto |
| CHK-TEST-0005-16 | NFR-0006 | the feature adds no runtime dependency: package.json lists the baseline, and one more name is NEW_RUNTIME_DEPENDENCY | `dependencies` de `package.json` diferente de `three`; linha de base alterada (M20); dependência nova aprovada; dependência de desenvolvimento contada |
| CHK-TEST-0005-17 | NFR-0006 | without the origin record, without its dependency baseline or without a readable package.json the measure is BASELINE_MISSING, never a PASS | registro ausente, ilegível ou sem linha de base dando `PASS` ou outro motivo; `package.json` ausente ou ilegível aprovado |
| CHK-TEST-0005-18 | NFR-0001 | the ASSET_BUDGET record carries exactly the fields of the contract, a reason only on FAIL, and the first reason found in the designed order | campo fora dos 9 do contrato; `checkFailReason` com `PASS`; medida não inteira; registro diferente ao medir de novo; ordem dos motivos diferente da de DES-0004 |

AC-US-0001-05 e AC-US-0002-06 (nenhum texto no ícone e na capa) e a primeira linha de NFR-0008 não têm verificação em `npm test`: são a inspeção visual E2E-12. A verificação -05 só garante que os resumos a citar nessa inspeção são os dos arquivos entregues.
