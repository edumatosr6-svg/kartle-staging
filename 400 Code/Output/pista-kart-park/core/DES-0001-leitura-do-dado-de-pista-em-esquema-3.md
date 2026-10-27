---
id: DES-0001
title: Leitura do dado de pista em esquema 3 — implementação
feature: pista-kart-park
stage: code
status: validated
version: 1.0.0
sources: [API-0001, FEAT-0002, FEAT-0003, REQ-FEAT-0002-02, REQ-FEAT-0002-12, REQ-FEAT-0002-15, REQ-FEAT-0002-16, REQ-FEAT-0001-14, REQ-FEAT-0003-08, REQ-FEAT-0003-13]
---

# DES-0001 — Leitura do dado de pista em esquema 3 — implementação

`src/trackData.ts`, camada dado de pista, alterado (257 → 369 linhas). Importa `src/track.ts` (como antes, mais `sideOf`) e
`src/trackGeometry.ts`; reexporta os tipos `TrackPoint`, `CurbSpan`, `BarrierLine`. O caminho da versão 2 (`readDeclared`,
`checkConsistency` C1 a C7 sobre a pista sintética, `:161-166`, `:205-287`) não mudou de código.

## Realização por requisito

| Requisito | Arquivo e símbolo |
|---|---|
| API-0001; REQ-FEAT-0002-02 | `src/trackData.ts` `TRACK_SCHEMA_VERSION = 3` (`:11`), `Schema3Fields` (`:38`), `TrackReading` com `Partial<Schema3Fields>` em `COMPLETE` e `INCOMPLETE` (`:39-43`), `readSchema3Fields` (`:101-135`: ordens 6 e 7 de DM-0001, cópias novas, padrões `[]`, `[]`, `false`), `readTrackData` (`:137-166`: ordens 1 a 9; versão 3 em `:152-160` com `buildTrackGeometry` só para a consistência) |
| REQ-FEAT-0002-12 | `readSchema3Fields` copia `xM`, `zM`, `widthM` sem suavizar, reamostrar nem converter; `buildTrackGeometry` (`src/trackGeometry.ts:138`) deriva bordas e grade sem alterar a linha central |
| REQ-FEAT-0002-15 | `readTrackData:161-166`: versão 2 pela função e pelos módulos de antes (`checkConsistency`, `nearest`, `track`, `WIDTH`); `SYNTHETIC_TRACK_FILE` continua `COMPLETE` (`CHK-TEST-0009-13` verde) |
| REQ-FEAT-0002-16; REQ-FEAT-0001-14 | `readSchema3Fields` devolve `undefined` para `centerline` ausente, curta, não finita ou com largura não positiva → `UNREADABLE` (`:154`), arquivo intacto (só lido); a sessão vai a `FAILED` em `src/trainingSession.ts:63-68` |
| REQ-FEAT-0003-08, -13 | as linhas da volta chegam por `readDeclared` como na sintética (`:155`); `checkConsistencyV3` (`:290-366`) exige C2 (cruzamento único no sentido da pista), C4, C5 e C7 v3 antes de `COMPLETE`; `MISSED_MARKER` e `VALID` saem de `src/lap.ts` sem mudança |
| FEAT-0002, FEAT-0003 | `checkConsistencyV3` C1 v3 (`windingSumOf`), C2 v3 (`centerlineCrossings`), C3 v3 (`classifySurface` ≠ `grass`, rumo a menos de 90° do segmento mais próximo), C4 a C5 v3 (arcos relativos à largada), C6 v3 (pontas na grama), C7 v3 (2 m entre linhas, 2 m da largada a marcadores e limites, `sideOf(finishLine, start) > 0`) |

## Comportamento em falha e registro

Nunca lança; `console.warn('track-data', <status>[, ids])` fica na aplicação (`src/main.ts:232-234`), só com `trackId`,
`trackVersion` e `schemaVersion`. Medido sobre o arquivo publicado: `COMPLETE`, `checkConsistencyV3` vazia; duas leituras iguais.
