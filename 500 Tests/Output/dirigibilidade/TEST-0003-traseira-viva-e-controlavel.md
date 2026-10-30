---
id: TEST-0003
title: Traseira viva e controlável: condução normal, recuperação, drift sem efeito e velocidade máxima
feature: dirigibilidade
stage: test
status: validated
version: 2.0.0
sources: [AC-US-0003-01, AC-US-0003-03, AC-US-0003-04, AC-US-0003-05, AC-US-0003-07, AC-US-0003-08, AC-US-0003-10, NFR-0003]
---

# TEST-0003 — Traseira viva e controlável: condução normal, recuperação, drift sem efeito e velocidade máxima

| | |
|---|---|
| Arquivo | `tests/dirigibilidade-rear.test.ts` (estratégia: `rear`) |
| Nível | integração: a volta do piloto de teste por `startLap`/`stepLap` até o primeiro resultado, com e sem o comando de drift mantido em todos os passos; `forcingThenRelease(lado, acelerador)` por `step` em `testPadArea(100)`; a reta do repouso em `testPadArea(1500)`; cada regra recomputada sobre o traço do teste e comparada com `handlingBenchReport` (`NORMAL_DRIVING`, `REAR_RECOVERY`, `DRIFT_INERT`, `SPEED_CAP`, `TOP_SPEED`); contrato (campos de API-0003 4.0.1) e unitário por `judge` |
| Interface exercitada | `handlingBenchReport`, `judge`, `serialize`, `straight`, `makeInput`, `testPilot`, `MAX_LAP_STEPS` (`scripts/handlingBench.ts`); `step`, `getHandlingTelemetry`, `testPadArea` (`src/physics.ts`); `startLap`, `stepLap`, `getLapResult` (`src/lap.ts`); `initialManeuvers` (`src/maneuvers.ts`) |
| Fixtures | `options(mode)`, `trace()` e `untilFirstResult()` de `tests/helpers/handling.ts`; `syntheticReading()` de `tests/fixtures/trackFiles.ts`; `forcingThenRelease` (acelerador 1 e esterço ±1 de `straight(16.7)` até `forcing` com `oversteer`/`sliding` ou 360 passos, depois esterço 0 e acelerador 1 ou 0 até o primeiro `grip` ou 360 passos); `withDrift` (a mesma `Input` com `drift: true`) |

## Verificações

| Check | Decide | Teste | O que a faria falhar |
|---|---|---|---|
| CHK-TEST-0003-01 | AC-US-0003-01 | over every step of the test-pilot lap the telemetry never reports oversteer or sliding, and the record counts exactly those steps | passo `oversteer`/`sliding` na volta (mutações M3, M7 reprovam), `normalDrivingStepCount` diferente dos passos da volta até o primeiro resultado, `oversteerOrSlidingStepCount` diferente da contagem do traço, `NORMAL_DRIVING` fora de `SYNTHETIC_TRACK`, `judge` aceitando um passo solto |
| CHK-TEST-0003-05 | AC-US-0003-05 | over every step of the test-pilot lap the sideslip never exceeds 0.65 rad, and the record carries that maximum | derrapagem máxima da volta acima de 0,65 rad, `maxSideslipRad` diferente do máximo do traço (mutações M3, M7 reprovam), `judge` aceitando 0,66 rad ou recusando 0,65 |
| CHK-TEST-0003-03 | AC-US-0003-03 | after forcing the rear on the open pad, taking the steer to 0 brings grip back within 400 ms, with the throttle held or released; a rear that never lets go is reported, not failed | traseira solta sem voltar a `grip` em 48 passos com acelerador mantido ou zerado (mutação M8 reprova), passo fora da área, `rearReleased`/`recoveryMs`/`forcingMs` diferentes do traço, passo solto sob forçar sem `rearReleased`, `judge` aceitando 404 ms ou a falta de `grip`, reprovando a traseira que não solta, ou sem `TEST_AREA_EXCEEDED` |
| CHK-TEST-0003-04 | AC-US-0003-04 | during the recovery the sideslip never exceeds 0.65 rad: the kart does not spin | derrapagem acima de 0,65 rad em algum passo da recuperação (mutação M8 reprova), `maxSideslipRad` diferente do máximo da recuperação do traço, campos da recuperação presentes sem soltura, `judge` aceitando 0,66 rad |
| CHK-TEST-0003-09 | AC-US-0003-08 | the same Input sequence with the drift command held from the first to the last step gives the same state at every step: no charge, no mini-turbo, no boost | qualquer estado da volta ou de `forcingThenRelease` diferente com o comando de drift (mutação M4, impulso de 0,2 % por passo: reprova), `maneuvers` diferente de `initialManeuvers()`, `comparedStepCount` diferente do tamanho das sequências, `differingStepCount` diferente de 0, `judge` aceitando um passo diferente |
| CHK-TEST-0003-10 | AC-US-0003-10 | no bench that starts at or below the top speed, nor the test-pilot lap with the drift command held, ever goes faster than the top speed of the same setup | velocidade acima da estabilizada na reta ou na volta com o comando de drift (mutação M4 reprova) ou em qualquer ensaio coberto, `topSpeedMps` diferente do `TOP_SPEED` da mesma execução ou da reta do teste, `maxObservedSpeedMps` diferente do máximo recomputado, `judge` aceitando velocidade acima ou sem `MEASUREMENT_MISSING` sem `topSpeedMps` |
| CHK-TEST-0003-07 | AC-US-0003-07 | the output carries the REAR_RECOVERY, NORMAL_DRIVING, DRIFT_INERT and SPEED_CAP records of API-0003 4.0.1 with their environments and units | ambiente errado, `testAreaRadiusM` diferente de 100 (mutação M10 reprova), campo condicional presente ou ausente fora da regra, `excludedRecoveryStepCount` presente, número de registros `NORMAL_DRIVING`/`DRIFT_INERT` diferente de 1/2, campos da área no `DRIFT_INERT` da volta, saída sem a comparação (mutação M4 reprova) ou sem km/h ao lado da velocidade estabilizada |
| CHK-TEST-0003-08 | NFR-0003 | the keyboard and the tilt forms give the same recovery, normal driving, drift comparison and speed cap | medidas diferentes entre `BINARY` e `PROPORTIONAL`, qualquer registro reprovado em um dos modos (mutações M1, M3, M4, M7, M8 reprovam) |
