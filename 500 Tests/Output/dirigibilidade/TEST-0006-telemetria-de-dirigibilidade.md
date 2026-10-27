---
id: TEST-0006
title: Telemetria de dirigibilidade (API-0001) campo a campo
feature: dirigibilidade
stage: test
status: validated
version: 1.0.0
sources: [AC-US-0004-06, AC-US-0003-02, AC-US-0004-05]
---

# TEST-0006 — Telemetria de dirigibilidade (API-0001) campo a campo

| | |
|---|---|
| Arquivo | `tests/dirigibilidade-telemetry.test.ts` (estratégia: `telemetry`) |
| Nível | contrato: `getHandlingTelemetry` sobre estados reais (estado inicial, volta do piloto de teste por `startLap`/`stepLap`, passos em `TEST_PAD`, na pista de teste e em `CIRCUIT`) |
| Interface exercitada | `getHandlingTelemetry`, `isForcing`, `step`, `initialState`, `testPadArc`, `TEST_PAD`, `nearest` (`src/physics.ts`); `startLap`, `stepLap` (`src/lap.ts`); `testPilot`, `straight` (`scripts/handlingBench.ts`) |
| Fixtures | `trace()` de `tests/helpers/handling.ts`; `straight(v)` a 13,88 e 13,90 m/s; kart parado encostado na barreira da pista sintética; `boundaryEnvironment` (`p.x > 0 ? 'grass' : 'asphalt'`) atravessado em x = 0; `syntheticReading()` de `tests/fixtures/trackFiles.ts` |

## Verificações

| Check | Decide | Teste | O que a faria falhar |
|---|---|---|---|
| CHK-TEST-0006-01 | AC-US-0004-06 | the telemetry is a pure reading of the state with exactly the fields of API-0001, from the initial state through every step of a lap, and NO_STATE without a state | campo a mais ou a menos, estado inicial fora de repouso/`grip`/asfalto, identidade do acerto não copiada, `speedMps` negativa ou `handling` fora dos quatro valores em algum passo da volta, `simStepCount` diferente do contador da volta, `NO_STATE` com outro campo |
| CHK-TEST-0006-02 | AC-US-0003-02 | the forcing condition holds only with full throttle, full steer and more than 50 km/h at the start of the step; partial steer never forces | limiar diferente de 50 km/h (mutação D: a 13,88 m/s passa a forçar), esterço 0,9 ou acelerador 0,99 forçando, esterço saturado não forçando, traseira solta com esterço parcial |
| CHK-TEST-0006-03 | AC-US-0004-05 | wallContact is true only on the step of a contact: false when the kart rests against the wall and false everywhere on the test pad | contato reportado com o kart parado encostado, kart encostado que ganha velocidade, `wallContact` verdadeiro na pista de teste (sem parede), traço que não sai da faixa |
| CHK-TEST-0006-04 | AC-US-0004-06 | the surface of the telemetry follows the environment: asphalt, then grass, then asphalt again | `surface` que não muda na fronteira, muda mais de uma vez, ou não volta a `ASPHALT` |
