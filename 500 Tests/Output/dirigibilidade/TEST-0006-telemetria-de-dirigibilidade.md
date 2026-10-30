---
id: TEST-0006
title: Telemetria de dirigibilidade (API-0001 2.0.0) campo a campo e o comando de drift sem efeito
feature: dirigibilidade
stage: test
status: validated
version: 1.1.0
sources: [AC-US-0004-06, AC-US-0003-03, AC-US-0004-05, AC-US-0003-08]
---

# TEST-0006 — Telemetria de dirigibilidade (API-0001 2.0.0) campo a campo e o comando de drift sem efeito

| | |
|---|---|
| Arquivo | `tests/dirigibilidade-telemetry.test.ts` (estratégia: `telemetry`) |
| Nível | contrato: `getHandlingTelemetry` sobre estados reais (estado inicial, volta do piloto de teste por `startLap`/`stepLap` até o primeiro resultado, passos em `TEST_PAD`, em `testPadArea(1)`, em `testPadArea(100)` e em `CIRCUIT`); integração: as sequências de `STEER_RESPONSE`, `CORNER_RADIUS` e `CORNER_TURN` com e sem o comando de drift |
| Interface exercitada | `getHandlingTelemetry`, `isForcing`, `step`, `initialState`, `testPadArea`, `TEST_PAD`, `nearest` (`src/physics.ts`); `startLap`, `stepLap`, `getLapResult` (`src/lap.ts`); `testPilot`, `straight`, `makeInput` (`scripts/handlingBench.ts`); `initialManeuvers` (`src/maneuvers.ts`) |
| Fixtures | `trace()` e `untilFirstResult()` de `tests/helpers/handling.ts`; `straight(v)` a 13,88 e 13,90 m/s; kart parado encostado na barreira da pista sintética; `boundaryEnvironment` (`p.x > 0 ? 'grass' : 'asphalt'`) atravessado em x = 0; `testPadArea(1)` (saída da área em poucos passos); `syntheticReading()` de `tests/fixtures/trackFiles.ts` |

## Verificações

| Check | Decide | Teste | O que a faria falhar |
|---|---|---|---|
| CHK-TEST-0006-01 | AC-US-0004-06 | the telemetry is a pure reading of the state with exactly the fields of API-0001, position and heading included and no drift field, from the initial state through every step of a lap up to its first result, and NO_STATE without a state | campo a mais ou a menos (mutação M9, `driftActive` de volta: reprova), posição ou rumo diferentes do estado, estado inicial fora de repouso/`grip`/asfalto, identidade do acerto não copiada, `speedMps` negativa ou `handling` fora dos quatro valores em algum passo da volta, `simStepCount` diferente do contador da volta, volta sem primeiro resultado, `NO_STATE` com outro campo |
| CHK-TEST-0006-02 | AC-US-0003-03 | the forcing condition holds only with full throttle, full steer and more than 50 km/h at the start of the step; partial steer never forces | limiar diferente de 50 km/h, esterço 0,9 ou acelerador 0,99 forçando, esterço saturado não forçando, traseira solta com esterço parcial (mutação M8 reprova) |
| CHK-TEST-0006-03 | AC-US-0004-05 | wallContact is true only on the step of a contact: false when the kart rests against the wall and false everywhere on the open test pad, off the declared area included | contato reportado com o kart parado encostado, kart encostado que ganha velocidade, `wallContact` verdadeiro na pista de teste aberta, área de 1 m que não leva o kart a `GRASS` em poucos passos ou que não é um disco (mutação M17, faixa \|x\| ≤ r: reprova), corrida dentro da área de 100 m fora do asfalto |
| CHK-TEST-0006-04 | AC-US-0004-06 | the surface of the telemetry follows the environment: asphalt, then grass, then asphalt again | `surface` que não muda na fronteira, muda mais de uma vez, ou não volta a `ASPHALT` |
| CHK-TEST-0006-05 | AC-US-0003-08 | the steering, radius and turn sequences give the same state at every step with the drift command held, and the maneuver state never leaves its initial value | qualquer estado diferente com o comando de drift nas sequências de `STEER_RESPONSE`, `CORNER_RADIUS` e `CORNER_TURN`, nos dois lados e nos dois modos (mutação M4 reprova), `maneuvers` diferente de `initialManeuvers()` |
