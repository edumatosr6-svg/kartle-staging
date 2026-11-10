---
id: DM-0001
title: Registro de origem dos arquivos entregues e estado do som em memória — implementação
feature: apresentacao-e-som
stage: code
status: draft
version: 1.0.0
sources: [RULE-0003, API-0002, API-0003, REQ-FEAT-0001-03, REQ-FEAT-0002-05, REQ-FEAT-0003-10, REQ-FEAT-0004-06, REQ-FEAT-0005-02, REQ-FEAT-0005-10, REQ-FEAT-0005-13]
---

# DM-0001 — Registro de origem e estado do som em memória — implementação

Sem banco e sem migração. `src/assets/feature-assets.json` (novo, escrito à mão, `schemaVersion` 1) e o estado em memória de
`RaceAudio`. Nenhum módulo do jogo importa o registro.

## Realização por requisito

| Requisito | Arquivo e símbolo |
|---|---|
| REQ-FEAT-0001-03, REQ-FEAT-0002-05, REQ-FEAT-0003-10, REQ-FEAT-0004-06, REQ-FEAT-0005-13 | `src/assets/feature-assets.json` `assets`: 4 entradas (`ICON_IMAGE`, `COVER_IMAGE`, `ENGINE_LOOP`, `TIRE_SCREECH`) com `sourcePath`, `sourceSha256`, `deliveredPath`, `deliveredSha256`, `deliveredBytes`, `transform`, e `widthPx`/`heightPx` nas imagens |
| REQ-FEAT-0005-02 | `deliveredBytes` 36.674, 72.701, 70.998, 44.389 (soma 224.762), cada um dentro do teto de DM-0001 do projeto (45.000, 100.000, 70.998, 44.389) |
| REQ-FEAT-0005-10 | `runtimeDependenciesBaseline`: `["three"]` |
| API-0002 (estado do som) | `RaceAudio` (`src/audio.ts:62-70`): `enabled` falso, `decision` (`SoundDecisionState`), `reading`, `loads`, `recordings` (buffer e limites de repetição), `voices`; `src/main.ts:157-158`: `stepThrottleNorm`, `laidSegment`, `repositionAcceptedAtMs`; nada gravado no navegador |

## Valores do registro

| `assetRole` | Origem (SHA-256, bytes) | Forma entregue (SHA-256, bytes) | `transform` |
|---|---|---|---|
| `ICON_IMAGE` | `386b0ef4…33050`, 5.233.536 | `c4159544…ca28c`, 36.674, 192 × 192 | `RESIZE_REENCODE` |
| `COVER_IMAGE` | `08a6c68f…c0ffc`, 6.161.514 | `28ed9c01…e9e40`, 72.701, 1200 × 670 | `RESIZE_REENCODE` |
| `ENGINE_LOOP` | `9a3e52fd…d77ee`, 70.998 | o mesmo resumo, 70.998 | `COPY` |
| `TIRE_SCREECH` | `4d897bae…faff`, 44.389 | o mesmo resumo, 44.389 | `COPY` |

Os resumos completos estão no arquivo. Reversão: reverter o commit da entrega e refazer o build; nenhum dado de jogador existe.
