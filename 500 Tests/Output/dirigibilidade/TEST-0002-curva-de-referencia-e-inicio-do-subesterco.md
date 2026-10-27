---
id: TEST-0002
title: Curva de referência de 18 m e varredura de início do subesterço
feature: dirigibilidade
stage: test
status: validated
version: 1.0.0
sources: [AC-US-0002-01, AC-US-0002-02, AC-US-0002-03, AC-US-0002-04, AC-US-0002-05, AC-US-0002-06, NFR-0003]
---

# TEST-0002 — Curva de referência de 18 m e varredura de início do subesterço

| | |
|---|---|
| Arquivo | `tests/dirigibilidade-cornering.test.ts` (estratégia: `cornering`) |
| Nível | integração (`runBench('REFERENCE_CORNER')` e `runBench('UNDERSTEER_ONSET')` sobre a física real em `testPadArc(18, WIDTH)`, com o traço da curva refeito pelo teste por `step`/`getHandlingTelemetry`) e unitário por `judge` sobre registros sintéticos |
| Interface exercitada | `runBench`, `judge`, `readBaseline`, `serialize`, `diagnosticsOf`, `arcEntry`, `makeInput` (`scripts/handlingBench.ts`); `step`, `getHandlingTelemetry`, `testPadArc` (`src/physics.ts`) |
| Fixtures | `options(mode)` e `trace()` de `tests/helpers/handling.ts`; `arcEntry(50 / 3.6)` com esterço +1 e acelerador 0 ou 1 mantidos por 300 passos (acelerador cheio: até o primeiro passo na grama); `baselineMarkdown(variant)` de `tests/fixtures/records.ts` (`valid`, `noBlock`, `corrupt`, `otherEnvironment`, `otherArc`, `noV1`, `interruptedV1`, `noPlateauParameters`); linha `#` do registro (`exitSpeedMps`, `interruptedPlateauSpeedMps`, origem de V1) |

## Verificações

| Check | Decide | Teste | O que a faria falhar |
|---|---|---|---|
| CHK-TEST-0002-01 | AC-US-0002-01 | at 50 km/h on the 18 m arc with full steer, understeer never lasts more than 200 ms consecutive, measured on the asphalt up to the first lane exit with throttle 0 and over the whole arc with full throttle | `maxUndersteerMs` acima de 200; janela de medição com acelerador 0 que inclua os passos na grama depois da saída (mutação B: 633 ms contra 125, 3 verificações reprovam), execução interrompida antes dos 300 passos, `judge` aceitando 204 ms |
| CHK-TEST-0002-02 | AC-US-0002-02 | with full throttle the kart stays on the asphalt of the arc at every step, and a lane exit under throttle 0 is reported without failing | passo na grama com acelerador cheio, `offAsphaltStepCount` diferente da contagem do traço, passo ou posição da saída diferentes do primeiro passo na grama, posição reportada dentro da faixa, `OFF_ASPHALT` com acelerador 0 ou ausente com acelerador cheio |
| CHK-TEST-0002-03 | AC-US-0002-03 | the understeer onset speed of the new setup is at least 15 % above the baseline V0 read from docs/physics.md | linha de base ausente, V1 abaixo de 1,15 × V0, V1 diferente do primeiro patamar completo acima de 200 ms ou, sem nenhum, da velocidade do patamar interrompido, apresentação sem "sem início de subesterço até a saída da faixa" no caso de `DOMAIN/DEC-12`, `judge` aceitando 57,2 km/h contra 50 km/h ou emitindo `MEASUREMENT_MISSING` sem `v1Mps` no fim natural |
| CHK-TEST-0002-04 | AC-US-0002-03 | V0 is taken only from a baseline of the same sweep whose V1 is the speed of a complete plateau with understeer | linha de base sem `v1Mps`, com V1 do patamar interrompido ou medida por velocidades de entrada (sem `plateauMs`/`plateauSpeedHoldMode`) aceita como V0; a linha de base real (V1 50 km/h, lista vazia, `MEASUREMENT_MISSING`) recusada |
| CHK-TEST-0002-05 | AC-US-0002-04 | above 50 km/h the loss of the front is progressive: the understeer of each complete plateau never decreases towards the next, faster plateau | menos de dois patamares completos, patamar abaixo de 50 km/h ou fora da ordem crescente em passos de `entrySpeedStepMps`, duração que diminui para o patamar seguinte, patamar interrompido incluído na lista, parâmetros do patamar ausentes da linha de parâmetros, `judge` comparando por máximo acumulado |
| CHK-TEST-0002-06 | AC-US-0002-05 | the output carries the two reference-corner records and the onset record of API-0003 with the arc radius, the lane width, the understeer durations, V0 and V1 in m/s and km/h | `arcRadiusM` diferente de 18, `laneWidthM` diferente da largura da pista, campo ausente ou com tipo errado, km/h ausente da apresentação, bloco ausente ou corrompido ou registro de outro ambiente ou outro arco aceito como linha de base |
| CHK-TEST-0002-07 | AC-US-0002-06 | the lane exit decides how the sweep ends: below 50 km/h it fails as OFF_ASPHALT, above it with fewer than two plateaus as MEASUREMENT_MISSING, and after two plateaus it is the natural end | `judge` fora da tabela de RULE-0002 (saída abaixo de 50 km/h não reprovando, dois patamares dando `MEASUREMENT_MISSING`, varredura sem saída com veredito), registro real com mais de uma saída, posição da saída dentro da faixa, saída antes dos patamares completos, motivo da reprovação diferente do que a velocidade de saída manda |
| CHK-TEST-0002-08 | NFR-0003 | the keyboard and the tilt forms give the same corner and the same sweep, both passing | medidas diferentes entre `BINARY` e `PROPORTIONAL`, reprovação em um dos modos, acelerador cheio ou esterço cheio com forma diferente entre os adaptadores |
