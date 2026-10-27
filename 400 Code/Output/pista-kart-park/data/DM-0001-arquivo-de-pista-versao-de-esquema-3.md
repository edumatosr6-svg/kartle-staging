---
id: DM-0001
title: Arquivo de pista, versão de esquema 3 — implementação
feature: pista-kart-park
stage: code
status: draft
version: 1.0.0
sources: [API-0001, FEAT-0002, FEAT-0003, FEAT-0004, FEAT-0005, RULE-0002, REQ-FEAT-0002-01, REQ-FEAT-0002-02, REQ-FEAT-0002-03, REQ-FEAT-0002-04, REQ-FEAT-0002-07, REQ-FEAT-0002-09, REQ-FEAT-0002-12, REQ-FEAT-0002-14, REQ-FEAT-0002-15, REQ-FEAT-0002-16, REQ-FEAT-0002-17, REQ-FEAT-0002-18, REQ-FEAT-0003-01, REQ-FEAT-0003-04, REQ-FEAT-0003-07, REQ-FEAT-0004-01, REQ-FEAT-0005-01, REQ-FEAT-0005-03, REQ-FEAT-0006-09]
---

# DM-0001 — Arquivo de pista, versão de esquema 3 — implementação

Sem banco: o "esquema" é o arquivo de pista empacotado. Nesta rodada: o leitor das versões 1, 2 e 3 (`src/trackData.ts`), a
geometria derivada (`src/trackGeometry.ts`) e o arquivo publicado `src/tracks/kart-park-v1.json` (novo, gerado por
`npm run track -- prepare kart-park 1`, 42 642 bytes, uma linha terminada por `\n`, SHA-256
`24093e904466dd12bf864509496facf78da4362249588ad494e92cdd78dd9f7e`). `SYNTHETIC_TRACK_FILE` (`src/track.ts`) continua em
`schemaVersion` 2, `trackVersion` 2, sem mudança.

## Realização por requisito

| Requisito | Arquivo e símbolo |
|---|---|
| API-0001; REQ-FEAT-0002-01, -02 | `src/trackData.ts` `readSchema3Fields` (`:101-135`: tabela de campos de DM-0001 — `centerline` ≥ 3 pontos, `curbs` com `side`/`fromLapM`/`toLapM`/`widthM`, `barriers` com `points` ≥ 2, `osmDerived` booleano, padrões neutros), `readTrackData` ordens 1 a 9 (`:137-166`); `src/tracks/kart-park-v1.json` `schemaVersion` 3, `trackId` `kart-park`, `trackVersion` 1 (V16) |
| REQ-FEAT-0002-03, -04, -07, -09; REQ-FEAT-0005-01, -03; REQ-FEAT-0004-01; REQ-FEAT-0003-01, -04, -07 | o arquivo publicado: 684 pontos `{xM, zM, widthM}` sem repetir o ponto 0, eixos do jogo, larguras copiadas; 34 `curbs`; 1 `barriers` com 395 `points`; `finishLine`, 3 `sectorLimits`, 39 `markers`; `serializeTrackFile` (`scripts/trackPrep.ts:375-386`: chaves na ordem `schemaVersion`, `trackId`, `trackVersion`, `osmDerived`, `direction`, `startPosition`, `finishLine`, `sectorLimits`, `markers`, `centerline`, `curbs`, `barriers`; 0,001 m e 0,001°) |
| REQ-FEAT-0002-12 | o leitor copia os valores (`:103-131`); `buildTrackGeometry` não altera a linha central |
| REQ-FEAT-0002-14 | 42 642 bytes; literal no pacote 49 049 caracteres (V17 em `scripts/trackChecks.ts:323-327`, `MAX_FILE_BYTES` 200 000) |
| REQ-FEAT-0002-15 | versão 2 lida pelo caminho de antes (`src/trackData.ts:161-166`) |
| REQ-FEAT-0002-16 | ordem 6 (`:103-108`) → `UNREADABLE`, arquivo intacto |
| REQ-FEAT-0002-17, -18 | `tracks/registry.json` guarda `sha256` e `fileBytes`; `publish` recusa outro conteúdo para o mesmo par e `prepare` recusa regenerar um par registrado (`scripts/track-pipeline.ts:98`, `:130-132`); uma versão nova é um arquivo novo `kart-park-v<n+1>.json` |
| REQ-FEAT-0006-09 | nenhum campo de nome, comprimento exibido, comprimento oficial ou recorde (V18, `scripts/trackChecks.ts:99-129`); `readOriginTrack` não lê `nome`, `cidade`, `comprimento_m`, `comprimento_oficial_m`, `recorde` |
| RULE-0002; FEAT-0002 a FEAT-0005 | `checkConsistencyV3` C1 a C7 v3 (`src/trackData.ts:290-366`) |

## Plano de migração

| Passo | Estado | Reversão |
|---|---|---|
| `TRACK_SCHEMA_VERSION` 2 → 3, leitor das versões 1, 2 e 3 | **feito nesta rodada** | `git revert` dos commits de código desta feature na ordem inversa; `npm test` e `npm run build` na árvore revertida; republicar o artefato anterior em staging. Nada gravado em navegador; `src/tracks/kart-park-v1.json` e `tracks/registry.json` saem com o revert e voltam sem mudança de conteúdo |
| Arquivo da Kart Park acrescentado | **feito nesta rodada** | idem |

Preenchimento retroativo: nenhum. Janela de compatibilidade: arquivo e leitor no mesmo artefato; um cliente só da versão 2 diante
do arquivo da Kart Park dá `UNSUPPORTED_SCHEMA` (CHK-TEST-0009-03 na árvore anterior). Retenção e privacidade: geometria,
identificadores e `osmDerived`; nada pessoal, nenhum recorde.
