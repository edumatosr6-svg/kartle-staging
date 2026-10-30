---
id: TEST-0001
title: Resposta do volante na pista de teste aberta a 50 km/h mantidos
feature: dirigibilidade
stage: test
status: validated
version: 1.1.0
sources: [AC-US-0001-01, AC-US-0001-02, AC-US-0001-03, AC-US-0001-04, AC-US-0001-05, AC-US-0001-06, NFR-0003]
---

# TEST-0001 — Resposta do volante na pista de teste aberta a 50 km/h mantidos

| | |
|---|---|
| Arquivo | `tests/dirigibilidade-steer-response.test.ts` (estratégia: `steer-response`) |
| Nível | integração (`runBench('STEER_RESPONSE')` sobre a física real na pista de teste aberta, `testPadArea(100)`) e contrato (campos de API-0003 4.0.1 por `judge` e `serialize`) |
| Interface exercitada | `runBench`, `handlingBenchReport`, `judge`, `serialize`, `makeInput` (`scripts/handlingBench.ts`) |
| Fixtures | `options(mode)` de `tests/helpers/handling.ts` (acerto publicado `ARCADE_ASSISTIDO`, `measuredAtUtc` fixo, linha de base de `docs/physics.md`); `straight(50 / 3.6)` e o regulador de velocidade da biblioteca; lados +1 e −1 em `BINARY` e `PROPORTIONAL`, ±0,5 em `PROPORTIONAL`; registros sintéticos derivados do registro real por `judge` |

## Verificações

| Check | Decide | Teste | O que a faria falhar |
|---|---|---|---|
| CHK-TEST-0001-01 | AC-US-0001-01 | the yaw rate reaches 90 % of its steady value within 180 ms of a full steer input at 50 km/h held, to either side | esterço mais lento (`steerApplyRatePerS` menor: 11 verificações reprovam na mutação A), velocidade fora da faixa de 50 km/h ± 0,5 m/s, regime nulo |
| CHK-TEST-0001-02 | AC-US-0001-02 | the yaw rate falls to 10 % of its steady value within 250 ms of releasing a full steer input at 50 km/h held | retorno do esterço mais lento (`steerReturnRatePerS`), guinada residual acima de 10 % do regime |
| CHK-TEST-0001-03 | AC-US-0001-03 | a partial tilt steer reaches 90 % of its own, smaller steady yaw rate within 180 ms at 50 km/h held | adaptador que satura 0,5 em 1 (regime igual ao do esterço cheio), subida acima de 180 ms para o regime parcial |
| CHK-TEST-0001-04 | AC-US-0001-04 | releasing a partial tilt steer brings the yaw rate to 10 % of that regime within 250 ms at 50 km/h held | queda acima de 250 ms a partir do regime parcial |
| CHK-TEST-0001-05 | AC-US-0001-05 | the verdict depends only on the two measured times and the held speed, never on understeer steps | `judge` que reprove por `understeerStepCount`, veredito do registro real diferente do recalculado só pelos tempos e pela faixa de velocidade, 22 passos (183 ms) aceitos |
| CHK-TEST-0001-06 | AC-US-0001-06 | the output carries the steering-response record of API-0003 4.0.1 with its times, regime, speed range, settle window and the declared area, and leaving the area fails before any other reason | campo a mais ou a menos que os de API-0003 mais os da área, tempo não inteiro, `throttleInputNorm` presente em `THROTTLE_REGULATED`, `testAreaRadiusM` diferente dos 100 m da estratégia (mutação M10 reprova), passo fora da área ou campos de saída sem saída, `TEST_AREA_EXCEEDED` não vindo antes de `SPEED_NOT_HELD`/`THRESHOLD_EXCEEDED`, `SPEED_NOT_HELD` não emitido para velocidade fora da faixa, lista vazia de ensaios dando `PASS` implícito, km/h ausente na apresentação |
| CHK-TEST-0001-07 | NFR-0003 | the keyboard and the tilt forms of the same full steer give the same measured response | medidas diferentes entre `BINARY` e `PROPORTIONAL` para o mesmo `Input` (regra de pilotagem no adaptador, I2), reprovação em um dos modos |
| CHK-TEST-0001-08 | AC-US-0001-01 | the input forms saturate a steer beyond the range and the keyboard form is binary | `PROPORTIONAL` sem saturação em −1..1, `BINARY` com valor parcial, `drift` carregado sem ter sido dado |
