---
id: DES-0004
title: Ensaios de dirigibilidade, pista de teste aberta, linha de base e saída (API-0003) — implementação
feature: dirigibilidade
stage: code
status: validated
version: 3.0.0
sources: [API-0003, RULE-0001, RULE-0002, FLOW-0002, FEAT-0001, FEAT-0002, FEAT-0003, FEAT-0004, FEAT-0005, FEAT-0006, REQ-FEAT-0001-05, REQ-FEAT-0001-06, REQ-FEAT-0001-09, REQ-FEAT-0002-06, REQ-FEAT-0002-08, REQ-FEAT-0002-14, REQ-FEAT-0002-15, REQ-FEAT-0002-16, REQ-FEAT-0002-17, REQ-FEAT-0003-08, REQ-FEAT-0003-12, REQ-FEAT-0003-13, REQ-FEAT-0003-16, REQ-FEAT-0003-17, REQ-FEAT-0004-07, REQ-FEAT-0005-01, REQ-FEAT-0005-02, REQ-FEAT-0005-03, REQ-FEAT-0005-04, REQ-FEAT-0005-07, REQ-FEAT-0005-11, REQ-FEAT-0005-12, REQ-FEAT-0006-02, REQ-FEAT-0006-04, REQ-FEAT-0006-05, REQ-FEAT-0006-06, REQ-FEAT-0006-07, REQ-FEAT-0006-08, REQ-FEAT-0006-09, NFR-0001, NFR-0002, NFR-0003, NFR-0004, NFR-0007, NFR-0008]
---

# DES-0004 — Ensaios de dirigibilidade e saída (API-0003) — implementação

`scripts/handlingBench.ts` (919 linhas), camada simulação no papel `scripts/`, reescrito na rodada de código 5 sobre DES-0004 6.0.1 e
API-0003 4.0.1: sem DOM, `three`, `node:perf_hooks`, `node:os`, `Date` ou `performance`; `node:fs` só lê `docs/physics.md` e
`src/physics.ts`. `scripts/keyboard-lap.ts` mudou num ponto (`measureStepCost`, `:33`: o laço termina no primeiro resultado da volta,
como `TEST_PILOT_LAP`); `scripts/physics-bench.ts` inalterado.

## Realização por requisito

| Requisito | Arquivo e símbolo |
|---|---|
| REQ-FEAT-0001-05, -06, -09 | `scripts/handlingBench.ts:238` `steerResponse` (área de 100 m, acelerador regulado, fase A 72 passos, fase B até 10 %; parada na saída da área com os campos medidos até ela), `judge` (`SPEED_NOT_HELD` antes dos tempos) |
| REQ-FEAT-0002-06, -14, -16, -17 | `:295` `cornerRadius` (50 km/h e 70 km/h × ±1, acelerador 1, até o passo 372, parada antes de 360, saída), `:279` `pathRadius` (janela 349–372, `L / \|Θ\|`, `Number.MAX_VALUE` com `Θ` 0), `judge` (`TEST_AREA_EXCEEDED` → `MEASUREMENT_MISSING` com `stoppedAtStep` → raio > 13 m) |
| REQ-FEAT-0002-08, -15 | `:325` `cornerTurn` (acelerador 0, até o passo 240, parada, saída; giro pelo rumo acumulado, `halfTurnReachedMs`), `judge` |
| REQ-FEAT-0003-08 | `:490` `normalDriving` (todos os passos `RUNNING` da volta do piloto de teste, um registro `SYNTHETIC_TRACK`) |
| REQ-FEAT-0003-12, -17 | `:352` `rearRecovery` (±1, forçar até a traseira soltar ou 360 passos, recuperação só com `rearReleased`), `judge` (sem `rearReleased`: `PASS`) |
| REQ-FEAT-0003-13 | `:514` `driftInertLap`, `:533` `driftInertRecovery`, `:503` `compareRuns` (igualdade estrita de posição, velocidade, rumo, `handling`, derrapagem; passo presente numa só execução conta como diferente) |
| REQ-FEAT-0003-16 | `:586` `speedCap` (traços que partem a velocidade ≤ `topSpeedMps`, desempate na ordem da suíte), `judge` (`MEASUREMENT_MISSING` sem `TOP_SPEED`) |
| REQ-FEAT-0004-07 | `:385` `straightLine` (área de 1 500 m), `:408` `grassLoss`, `:424` `wallContact` (lista vazia `MEASUREMENT_MISSING`), `THRESHOLDS` `:32` (65–72 km/h), `serialize`/`presentation` (km/h, s, graus) |
| REQ-FEAT-0005-01, -02, -03, -11, -12, NFR-0001 | `:452` `testPilotLap` (termina no primeiro resultado, `:448` `hasLapResult`), `:612` `determinism` (por ambiente, campos da área agregados por `:601` `aggregatedPadFields`) |
| REQ-FEAT-0005-04 | `:646` `setupVersion` (`arcade-assistido-v6` ≠ `arcade-assistido-v4`) |
| REQ-FEAT-0005-07, REQ-FEAT-0006-02 | `:667` `stepContract` |
| REQ-FEAT-0006-04, NFR-0007 | `:714` `realistaUnchanged`, `:698` `countDifferingMeasures`, `:680` `sameSetting` |
| REQ-FEAT-0006-05, NFR-0003 | `:144` `makeInput`, `:561` `runSuite` (`BINARY` e `PROPORTIONAL`, ±0,5 em `PROPORTIONAL`) |
| REQ-FEAT-0006-06, -09, NFR-0002 | `:628` `stepCost`; `scripts/keyboard-lap.ts:16-18` `runtimeId`, `:21-41` `measureStepCost` |
| REQ-FEAT-0006-07, NFR-0008 | `src/track.ts`, `src/trackData.ts`, `src/lap.ts` e as linhas 3 e de `Input` de `src/physics.ts` inalterados; `src/maneuvers.ts` presente |
| REQ-FEAT-0006-08, NFR-0004 | `:874` `readBaseline`, `:892` `baselineEntry`, `:911` `serialize`; `docs/physics.md` |
| REQ-FEAT-0002-17 (todos os ensaios em `TEST_PAD`) | `:114-115` `padEnvironment`, `straightPadEnvironment` (`testPadArea`), `:741` `judge` (`TEST_AREA_EXCEEDED` primeiro em todo registro `TEST_PAD` com saída) |

## Medido nesta rodada (`npm run bench:handling`, 2026-10-30)

56 registros do `arcade-assistido-v6`, 56 `PASS` (17 ensaios, `BINARY` e `PROPORTIONAL`): `STEER_RESPONSE` 108/58 ms (±0,5: 108/50);
`CORNER_RADIUS` 11,67 m (50 km/h) e 11,77 m (70 km/h); `CORNER_TURN` 208,4° em 2 s, 180° em 1 825 ms; `NORMAL_DRIVING` 0 de 2 766
passos, 0,077 rad; `REAR_RECOVERY` traseira não solta (3 000 ms); `DRIFT_INERT` 0 de 3 126 e 0 de 360; `SPEED_CAP` 19,25 = `TOP_SPEED`
19,25 m/s (69,3 km/h); `ACCELERATION` 2 208 ms; `GRASS_LOSS` 51 %/55 %; `WALL_CONTACT` 832 contatos; `TEST_PILOT_LAP` 23 049 ms;
`STEP_COST` 181,3 contra 173,9 µs; `REALISTA_UNCHANGED` 0/0 nos dois ambientes. Nenhum passo fora da área declarada.
