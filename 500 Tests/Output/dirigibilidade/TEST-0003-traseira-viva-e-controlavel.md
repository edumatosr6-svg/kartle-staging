---
id: TEST-0003
title: Traseira viva e controlável: condução normal, recuperação e drift
feature: dirigibilidade
stage: test
status: validated
version: 1.0.0
sources: [AC-US-0003-01, AC-US-0003-02, AC-US-0003-03, AC-US-0003-04, AC-US-0003-05, AC-US-0003-06, AC-US-0003-07, NFR-0003]
---

# TEST-0003 — Traseira viva e controlável: condução normal, recuperação e drift

| | |
|---|---|
| Arquivo | `tests/dirigibilidade-rear.test.ts` (estratégia: `rear`) |
| Nível | integração (`handlingBenchReport` com `REFERENCE_CORNER`, `UNDERSTEER_ONSET`, `NORMAL_DRIVING`, `REAR_RECOVERY` e `DRIFT_MANEUVER` sobre a física real, por modo de `Input`; traços refeitos pelo teste) e contrato (campos de API-0003) |
| Interface exercitada | `handlingBenchReport`, `judge`, `serialize`, `arcEntry`, `makeInput` (`scripts/handlingBench.ts`); `classifyHandlingSteps`, `step`, `getHandlingTelemetry`, `testPadArc` (`src/physics.ts`) |
| Fixtures | `options(mode)` e `trace()` de `tests/helpers/handling.ts`; `forcingSequence` (acelerador 1 e esterço 1 no arco a 16,7 m/s até a traseira soltar, depois esterço 0 com o acelerador mantido até o primeiro `grip`); traços da curva de referência com acelerador 0 e cheio; `tests/maneuvers.test.ts` e `package.json` lidos como texto |

## Verificações

| Check | Decide | Teste | O que a faria falhar |
|---|---|---|---|
| CHK-TEST-0003-01 | AC-US-0003-01 | in normal driving the telemetry never reports oversteer or sliding, and the full-throttle reference corner stays in grip or understeer at every step | passo `oversteer`/`sliding` de classe `NORMAL` no asfalto (mutação D: 10 verificações reprovam com a condição de forçar a 40 km/h), agregado vazio, passo solto na curva de referência com acelerador cheio |
| CHK-TEST-0003-02 | AC-US-0003-02 | oversteer and sliding occur only in steps of class FORCING, DRIFT or RECOVERY | passo solto classificado como `NORMAL` em qualquer traço (curva com acelerador 0 ou cheio, sequência de forçar), sequência de forçar que nunca solta a traseira |
| CHK-TEST-0003-03 | AC-US-0003-03 | with the rear loose under the forcing condition, releasing the steer brings the telemetry back to grip within 400 ms | `gripReached` falso, `recoveryMs` acima de 400 ou não inteiro, saída da faixa na recuperação, sequência refeita que não volta a `grip` em 48 passos, `judge` aceitando 404 ms ou sem `grip` |
| CHK-TEST-0003-04 | AC-US-0003-04 | the sideslip never exceeds 0.65 rad during the recovery: the kart does not spin | `maxSideslipRad` acima de 0,65 no registro ou em qualquer passo da recuperação refeita, `judge` aceitando 0,66 rad |
| CHK-TEST-0003-05 | AC-US-0003-05 | in normal driving the sideslip never exceeds 0.65 rad, and the recovery steps are excluded from the aggregate | deriva acima de 0,65 rad, `excludedRecoveryStepCount` diferente dos passos `RECOVERY` no asfalto da sequência de forçar, `normalDrivingStepCount` fora do intervalo que os traços `NORMAL` conhecidos e a varredura permitem (recuperação contada como normal), `judge` aceitando 0,66 rad ou um passo solto |
| CHK-TEST-0003-06 | AC-US-0003-06 | the drift maneuver of requirements/11 is still possible and still scores with the Arcade assistido | `driftScorePoints` 0, `judge` aceitando 0 pontos, verificação existente do drift removida de `tests/maneuvers.test.ts`, `npm test` deixando de cobrir `tests/*.test.ts` |
| CHK-TEST-0003-07 | AC-US-0003-07 | the output carries the recovery and normal-driving records of API-0003 with the recovery time, the maximum sideslip and the loose-step count | campo ausente ou com tipo errado, `recoveryMs` presente sem `grip` ou ausente com `grip`, um só registro `NORMAL_DRIVING`, serialização sem `recoveryMs` ou `oversteerOrSlidingStepCount` |
| CHK-TEST-0003-08 | NFR-0003 | the keyboard and the tilt forms give the same recovery and the same normal-driving aggregate | medidas diferentes entre `BINARY` e `PROPORTIONAL` em `REAR_RECOVERY`, `NORMAL_DRIVING`, `DRIFT_MANEUVER` ou na curva com acelerador cheio |
