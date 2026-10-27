---
id: DES-0006
title: Verificações de npm test e relatório do modelo montado (API-0002) — gravador da linha de base, medição desta rodada e o que fica para o estágio de testes
feature: modelo-kart-01
stage: code
status: validated
version: 1.1.0
sources: [API-0002, FLOW-0003, RULE-0001, RULE-0003, FEAT-0001, FEAT-0002, FEAT-0004, FEAT-0005, FEAT-0006, REQ-FEAT-0001-02, REQ-FEAT-0001-03, REQ-FEAT-0001-04, REQ-FEAT-0001-05, REQ-FEAT-0001-06, REQ-FEAT-0001-07, REQ-FEAT-0001-08, REQ-FEAT-0001-09, REQ-FEAT-0001-10, REQ-FEAT-0001-11, REQ-FEAT-0001-12, REQ-FEAT-0001-13, REQ-FEAT-0001-14, REQ-FEAT-0002-02, REQ-FEAT-0004-03, REQ-FEAT-0004-04, REQ-FEAT-0005-05, REQ-FEAT-0005-06, REQ-FEAT-0006-04, REQ-FEAT-0006-05, REQ-FEAT-0006-06, REQ-FEAT-0006-07, REQ-FEAT-0006-08, NFR-0004, NFR-0005, NFR-0006, NFR-0007]
---

# DES-0006 — Verificações de `npm test` e relatório do modelo montado (API-0002) — estágio de código

Deste item, o estágio de código entrega o que não é arquivo de teste: `scripts/kart01-baseline.ts` (novo) e o script
`baseline:kart01` em `package.json`. `tests/helpers/kart01Report.ts`, `tests/modelo-kart-01-model.test.ts`, `-pose.test.ts`,
`-camera.test.ts` e `-contract.test.ts` — os 12 `checkId` de API-0002 na saída de `npm test` — são do estágio de testes
(`test-strategy.md`); nenhum arquivo de `tests/*.test.ts` ou `tests/helpers/` foi escrito aqui. As medidas que esses registros farão
foram feitas nesta rodada por programa descartável em Node com o `three` do projeto, e estão abaixo e em `01-implementation.md`.

## Realização por requisito

| Requisito | Arquivo e símbolo |
|---|---|
| REQ-FEAT-0005-05, REQ-FEAT-0006-07, -08; NFR-0006, NFR-0007 (linha de base) | `scripts/kart01-baseline.ts` `main` (`--force`, `--commit <sha>`; recusa sobrescrever), `encodeRuns` (corridas `[contagem, throttle, brake, steer, drift]`), `inputTypeLine` (a linha `export type Input =` de `src/physics.ts`), gravação de `stepS`, `simWheelbaseM`/`simTrackWidthM` (iguais nos dois acertos, verificado), `wheelPositions` por acerto, `referenceRuns` (`completeLap` por `startSession` + `runCountdown` + `drive` com `autopilot()` e `MAX_LAP_STEPS`), `finalKart`, `lapValidity`, `lapMs`, `sectorMs`; `package.json` `baseline:kart01`; fixture em `tests/fixtures/kart01-sim-baseline.json` (DM-0001) |
| REQ-FEAT-0006-06 | diferença do repositório desta rodada: 0 linhas em `src/physics.ts`, `src/lap.ts`, `src/track.ts`, `src/trackData.ts`, `src/maneuvers.ts`, `src/lapTiming.ts`; presets, `Input` e `step` intactos (`01-implementation.md`) |
| REQ-FEAT-0006-04, -05 (camadas, neutralidade) | `src/kartPose.ts`, `src/gameCamera.ts`, `src/kart01Model.ts`, `src/kart01Decals.ts` não são importados por nenhum módulo da simulação; `src/main.ts` `frame` escreve na simulação só por `stepLap`; registros `LAYERING`/`RENDER_NEUTRAL`: estágio de testes |
| REQ-FEAT-0001-02 a -14, REQ-FEAT-0004-03, -04 (medidas desta rodada) | modelo montado em Node: 27 malhas, 27 chamadas, 5 128 triângulos; caixa envolvente dos 15 grupos z −0,990..0,9365 (1,9265 m), x ±0,725 (1,45 m); entre-eixos 1,05 m (nós `steer` em z ∓0,525); bitolas 1,00 m e 1,14 m; diâmetros das rodas como extensão em Z da geometria mesclada no referencial local do nó `spin` (DES-0006 1.3.0, `measureKart01Model`) 0,26/0,26/0,28/0,28 m, exatas (rodada 2; `98-divergences.md` linha 21, `resolved`); cores do atributo `color` `#1A1B1F`, `#1A2233`, `#1C1D21`, `#1E2024`, `#26292E`, `#2B2E34`, `#2F55D4`, `#33373D`, `#3A3E45`, `#5A6069`, `#8A9099`, `#B9BEC6`, `#C5CAD1`, `#F4F3EF`, `#FF6A13` e `materials.plate.color` `#F4F3EF`; 16 grupos com triângulos, `piloto` sem grupo pai nomeado; registros `KART_DIMENSIONS`, `WHEELS_AND_TRACKS`, `PART_GROUPS`, `PART_COLORS`, `DRAW_COST`: estágio de testes |
| REQ-FEAT-0002-02 (`WHEEL_SPIN`) | `src/kartPose.ts` `advanceWheelSpin` aplica `N` passos num único quadro com `delta × STEP` exato; registro: estágio de testes |
| REQ-FEAT-0005-06 (`TELEMETRY_WHEEL_POSITIONS`) | `src/kartPose.ts` `simWheelGroundPositions`; registro: estágio de testes |
| API-0002, FLOW-0003, RULE-0001, RULE-0003; NFR-0004, NFR-0005 | o conjunto de registros nasce nos testes; o gravador é a única escrita (fixture), fora de `npm test` |

## Resultado do gravador nesta rodada

`npm run baseline:kart01 -- --commit b86b200d14f950baa1a902f56b6f6fbfff5082ba`, sobre a árvore anterior às mudanças de código:
`ARCADE_ASSISTIDO` `arcade-assistido-v5` 3 531 passos, `VALID`, 29 419 ms, setores 7 851/7 753/7 464/6 351 ms, 143 corridas;
`REALISTA_ALUGUEL_4T` `realista-aluguel-4t-v4` 5 272 passos, `VALID`, 43 932 ms, setores 11 574/12 613/12 922/6 823 ms, 112 corridas;
`trackId` `synthetic`, `trackVersion` 2; `stepS` 1/120; `simWheelbaseM` 1,04; `simTrackWidthM` 1,20. Esta feature não altera a
simulação: uma regravação com o código desta feature presente dá o mesmo resultado (ADR-0004).
