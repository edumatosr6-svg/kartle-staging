---
id: DES-0004
title: Volta na Kart Park — corte pela borda da pista, reposicionamento e largada — implementação
feature: pista-kart-park
stage: code
status: draft
version: 1.0.0
sources: [FEAT-0003, FEAT-0005, FLOW-0002, RULE-0001, REQ-FEAT-0001-08, REQ-FEAT-0002-12, REQ-FEAT-0003-08, REQ-FEAT-0003-10, REQ-FEAT-0003-11, REQ-FEAT-0003-12, REQ-FEAT-0003-13, REQ-FEAT-0003-15, REQ-FEAT-0005-07]
---

# DES-0004 — Volta na Kart Park — implementação

`src/lap.ts`, camada simulação, alterado (292 → 302 linhas). Importa `trackEdgeDistanceM` de `src/physics.ts` (`:3`) e
`nearestOnCenterline` de `src/trackGeometry.ts` (`:6`). `LapSession`, `LapResult`, `LapStateView`, os comandos e os códigos de
rejeição não mudaram; `edgeDistanceM` continua exportado (`:235-237`).

## Realização por requisito

| Requisito | Arquivo e símbolo |
|---|---|
| REQ-FEAT-0001-08 | `kartAtStart` (`:140-142`): `{...initialState(), x, z, heading}` da `startPosition`, ou `initialState()`; `startLap` o chama (`:114`) com o mesmo resultado de antes; `src/trainingSession.ts:75` o usa para o kart da sessão |
| REQ-FEAT-0003-10, -11; REQ-FEAT-0005-07 | `evaluateCut` (`:263-270`): `trackEdgeDistanceM(session.environment, kart) <= cutDistanceM`; comparações, `offTrackSteps` e `isCutExceeded` inalterados; a zebra dá 0 |
| REQ-FEAT-0002-12 | `repositionKart` (`:159-172`) e `nearestOnTrack` (`:174-182`): com `environment.track`, `nearestOnCenterline` do arquivo (posição e rumo do segmento); sem, `nearest`/`track` da sintética |
| REQ-FEAT-0003-08, -12, -13, -15; FEAT-0003; FLOW-0002; RULE-0001 | `evaluateDisplacement` (`:240-259`), `complete`, `invalidate`, `buildResult` (`:272-301`) inalterados: as linhas transversais da Kart Park (`scripts/trackPrep.ts:132-160`) chegam pela leitura e produzem `MISSED_MARKER`, `CUT` e `VALID` pelas mesmas regras |
| FEAT-0005 | o corte usa a borda que inclui a zebra (`src/trackGeometry.ts:228-234`) |

As provas com o piloto de teste da Kart Park (`VALID` com 4 setores, `MISSED_MARKER` sem `CUT`, `CUT` no passo 121, atalho da
curva 4, zebra sem corte, reposicionamento na linha central do arquivo, determinismo) são do estágio de testes.
