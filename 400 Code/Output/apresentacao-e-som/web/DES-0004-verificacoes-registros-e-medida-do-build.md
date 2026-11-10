---
id: DES-0004
title: Verificações — registros de npm test, medida do build e registro de aparelho — implementação
feature: apresentacao-e-som
stage: code
status: draft
version: 1.0.0
sources: [FEAT-0005, API-0003, FLOW-0003, REQ-FEAT-0005-01, REQ-FEAT-0005-02, REQ-FEAT-0005-04, REQ-FEAT-0005-06, REQ-FEAT-0005-07, REQ-FEAT-0005-08, REQ-FEAT-0005-09, REQ-FEAT-0005-10, REQ-FEAT-0005-12, REQ-FEAT-0005-14, REQ-FEAT-0005-15]
---

# DES-0004 — Verificações — implementação

Desta etapa: `scripts/assetBudget.ts` (novo, 191 linhas), `scripts/asset-budget.ts` (novo, 20 linhas) e o script
`"check:assets": "tsx scripts/asset-budget.ts"` (`package.json:14`). Nenhum módulo de `src/` os importa. Da etapa de testes, e não
escritos aqui: `tests/helpers/soundReport.ts`, os registros `SOUND_DETERMINISM`, `ASSETS_NEUTRAL` e `SIM_STATE_UNCHANGED`, e
`docs/apresentacao-e-som-device-log.md`.

## Realização por requisito

| Requisito | Arquivo e símbolo |
|---|---|
| REQ-FEAT-0005-01 | `measureAssetBudget` (`scripts/assetBudget.ts:125-191`): `initialDownloadBytes` = soma do gzip de nível 9 de `index.html` e de cada arquivo de `initialDownloadFiles` (`:71-84`) achado em `dist/`, cada um uma vez; `INITIAL_DOWNLOAD_LIMIT_BYTES` 3.000.000 (`:22`), `PASS` exige menos |
| REQ-FEAT-0005-02 | `featureAssetBytes`: bytes da forma entregue de cada achado (arquivo, ou carga decodificada); `FEATURE_ASSET_BUDGET_BYTES` 300.000 (`:20`) |
| REQ-FEAT-0005-04 | `assetCount` e `assetsInInitialDownloadCount`: cada `assetRole` do registro achado pelo `deliveredSha256` como arquivo de `dist/` ou como carga de `embeddedPayloads` (`:87-93`) de um `.js` de `dist/`; conta no download inicial quando o arquivo, ou o JS que traz a carga, pertence ao conjunto |
| REQ-FEAT-0002-02 (via `coverWidthPx`) | `readImageSize` (`:30-57`): PNG pelo `IHDR`; JPEG pelo marcador de início de quadro (`SOF0` a `SOF15`, menos `C4`, `C8`, `CC`), o que cobre o JPEG progressivo da capa; `COVER_MIN_WIDTH_PX` 1200 (`:23`) |
| REQ-FEAT-0005-10 | `newRuntimeDependencyCount`: nomes de `dependencies` de `package.json` fora de `runtimeDependenciesBaseline`; `package.json` continua só com `three` |
| REQ-FEAT-0005-12 | `curbSoundFileCount`: arquivos de `dist/` com extensão de áudio (`AUDIO_EXTENSIONS`, `:24`) mais cargas `audio/…` embutidas nos JS, cujo resumo não é o do motor nem o do pneu |
| REQ-FEAT-0005-06, -07, -14, -15 | nenhum código desta etapa: são registros de `npm test` (etapa de testes); o que os torna possíveis é `RaceAudio` e `decideSoundOutput` não escreverem nada na simulação |
| REQ-FEAT-0005-08, -09 | nenhum código desta etapa: roteiros E2E-10 e E2E-11 |

Ordem do primeiro motivo de `FAIL` (`:176-185`): `BASELINE_MISSING`, `ASSET_MISSING`, `ASSET_NOT_IN_INITIAL_DOWNLOAD`,
`BUDGET_EXCEEDED`, `INITIAL_DOWNLOAD_EXCEEDED`, `COVER_TOO_NARROW`, `CURB_SOUND_FILE_PRESENT`, `NEW_RUNTIME_DEPENDENCY`.
`scripts/asset-budget.ts`: mede `dist`, `src/assets/feature-assets.json` e `package.json` a partir da raiz, escreve o registro numa
linha em `stdout`, sai com 0 em `PASS` e 1 em `FAIL`; numa exceção, escreve em `stderr` o caminho relativo e sai com 1, sem registro.

## Escolhas desta etapa dentro do projeto

- `initialDownloadFiles` devolve cada endereço da mesma origem como caminho sem a barra inicial, sem consulta e sem fragmento, uma
  vez, na ordem do documento; endereço com esquema, `//` ou `data:` fica fora. `rel` é lido por palavra: `apple-touch-icon` não é
  `icon`.
- Base de publicação: com `vite build --base=/nome/` os endereços de `dist/index.html` trazem a base, que não é pasta de `dist/`.
  `measureAssetBudget` casa cada endereço com o arquivo de `dist/` que os seus segmentos finais soletram (`:137-143`). Sem isso a
  medida do build candidato da etapa de deploy daria `ASSET_NOT_IN_INITIAL_DOWNLOAD`.
- O registro traz sempre os 7 campos numéricos (o tipo `AssetBudgetRecord` do projeto não os dá por opcionais); o que não pôde ser
  medido sai 0. Sem `dist/`: `ASSET_MISSING` com tudo em 0.
- `package.json` ausente ou ilegível sai como `BASELINE_MISSING`. O projeto diz "registro com `FAIL` e o motivo" sem nomear o
  motivo; dos 8 do contrato, é o que diz que a comparação de dependências não pôde ser feita. Fica registrado no changelog como
  ponto a confirmar.
- Registro de origem ilegível também é `BASELINE_MISSING` quando falta `assets` ou algum `deliveredSha256`: sem eles nada pode ser
  achado por resumo.
