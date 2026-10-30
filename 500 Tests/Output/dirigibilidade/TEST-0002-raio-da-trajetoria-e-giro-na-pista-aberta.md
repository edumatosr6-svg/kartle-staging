---
id: TEST-0002
title: Raio da trajetória aos 3 s e giro de 180° em 2 s na pista de teste aberta
feature: dirigibilidade
stage: test
status: validated
version: 2.0.0
sources: [AC-US-0002-05, AC-US-0002-07, AC-US-0002-08, AC-US-0002-09, NFR-0003]
---

# TEST-0002 — Raio da trajetória aos 3 s e giro de 180° em 2 s na pista de teste aberta

| | |
|---|---|
| Arquivo | `tests/dirigibilidade-cornering.test.ts` (estratégia: `cornering`) |
| Nível | integração: o teste conduz a partida por `step`/`getHandlingTelemetry` em `testPadArea(100)` e julga o limiar sobre o próprio traço (raio pela velocidade, raio pelas posições da janela dos passos 349 a 372 de DES-0004, giro acumulado passo a passo), depois compara com `runBench('CORNER_RADIUS')`/`runBench('CORNER_TURN')`; contrato (campos de API-0003 4.0.1, `serialize`) e unitário por `judge` sobre registros sintéticos |
| Interface exercitada | `runBench`, `judge`, `serialize`, `straight`, `makeInput` (`scripts/handlingBench.ts`); `step`, `getHandlingTelemetry`, `testPadArea`, `STEP` (`src/physics.ts`) |
| Fixtures | `options(mode)` e `trace()` de `tests/helpers/handling.ts`; `straight(50 / 3.6)` e `straight(70 / 3.6)` com acelerador 1 e esterço ±1 por 372 passos; `straight(50 / 3.6)` com acelerador 0 e esterço ±1 por 240 passos; `BINARY` e `PROPORTIONAL` |

## Verificações

| Check | Decide | Teste | O que a faria falhar |
|---|---|---|---|
| CHK-TEST-0002-09 | AC-US-0002-07 | from 50 km/h with full throttle and full steer held, the path radius 3 s after the start is at most 13 m, to either side, in both input forms | raio acima de 13 m em qualquer das duas leituras do traço (mutação M2, aderência de v5: reprova), as duas leituras discordando em mais de 5 %, `pathRadiusAt3sM` diferente da recomputação pelas posições, passo fora da área ou parada antes de 3 s, `handlingAt3s` alterando o veredito, `judge` aceitando 13,01 m ou recusando 13,0 m |
| CHK-TEST-0002-10 | AC-US-0002-08 | from 70 km/h with full throttle and full steer held, the path radius 3 s after the start is at most 13 m: the kart sheds speed instead of opening the line | raio acima de 13 m em qualquer das duas leituras do traço a partir de 70 km/h (mutação M2 reprova), leituras discordantes, campo diferente da recomputação, saída da área ou parada; velocidade aos 3 s não abaixo dos 70 km/h da partida |
| CHK-TEST-0002-11 | AC-US-0002-09 | from 50 km/h with throttle 0 and full steer held, the kart turns at least 180° within 2 s of the start, to either side | giro acumulado abaixo de π rad no passo 240 ou π atingido depois de 2 000 ms (mutação M2 reprova), `halfTurnReachedMs` diferente do primeiro passo do traço com giro ≥ π, `turnAt2sRad` ou `speedAt2sMps` diferentes do passo 240 do traço, lados girando para o mesmo sentido, `judge` aceitando 2 009 ms ou um giro de 3,0 rad, parado ou não |
| CHK-TEST-0002-06 | AC-US-0002-05 | the output carries, per input form, four CORNER_RADIUS and two CORNER_TURN records of API-0003 4.0.1 with the area fields, the speeds in km/h and the turn in degrees, and no retired corner bench | número de registros diferente de 4 e 2 (mutação M12 reprova), campo a mais ou a menos, `radiusWindowMs` diferente de 200, `testAreaRadiusM` diferente de 100 (mutação M10 reprova), `speedAt3sMps`/`handlingAt3s` diferentes do passo 360 do traço, `REFERENCE_CORNER`/`UNDERSTEER_ONSET` na saída, apresentação sem km/h ou sem graus, `judge` sem `MEASUREMENT_MISSING` para o kart parado ou sem `TEST_AREA_EXCEEDED` para a saída da área |
| CHK-TEST-0002-08 | NFR-0003 | the keyboard and the tilt forms give the same radius and the same turn, both passing | medidas diferentes entre `BINARY` e `PROPORTIONAL`, reprovação em um dos modos (mutação M2 reprova), acelerador e esterço cheios com forma diferente entre os adaptadores |
