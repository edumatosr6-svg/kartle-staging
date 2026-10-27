---
id: TEST-0009
title: Volta do piloto de teste na pista sintética e determinismo dos ensaios
feature: dirigibilidade
stage: test
status: validated
version: 1.0.0
sources: [AC-US-0005-01, AC-US-0005-02, AC-US-0005-03, NFR-0001, NFR-0003]
---

# TEST-0009 — Volta do piloto de teste na pista sintética e determinismo dos ensaios

| | |
|---|---|
| Arquivo | `tests/dirigibilidade-test-pilot.test.ts` (estratégia: `test-pilot`) |
| Nível | integração (`handlingBenchReport` com `TEST_PILOT_LAP` e `DETERMINISM` sobre `src/lap.ts` e a física real, por modo de `Input`; `testPilotLapWith` com controladores desviado e parado) e contrato (`sectorMs`, teto da janela) |
| Interface exercitada | `handlingBenchReport`, `runBench`, `testPilotLapWith`, `judge` (`scripts/handlingBench.ts`); `CIRCUIT` (`src/physics.ts`) |
| Fixtures | `options(mode)` de `tests/helpers/handling.ts`; `autopilot(8, ARCADE_CONFIG)` de `tests/helpers/autopilot.ts` (8 m ao lado da linha); controlador parado (acelerador, freio e esterço 0); linha de base `TEST_PILOT_LAP` de `docs/physics.md` |

## Verificações

| Check | Decide | Teste | O que a faria falhar |
|---|---|---|---|
| CHK-TEST-0009-01 | AC-US-0005-02 | the test pilot completes the synthetic lap with zero steps off the asphalt, and a pilot driven 8 m beside the line fails as OFF_ASPHALT with the step and position of its first exit | passo fora do asfalto com o piloto de teste, ambiente errado, piloto desviado sem `OFF_ASPHALT`, passo ou posição da saída ausentes, posição reportada no asfalto |
| CHK-TEST-0009-02 | AC-US-0005-03 | the test-pilot lap takes at most 25 s of simulated time and is faster than the recorded baseline | tempo acima de 25 000 ms ou não inteiro, linha de base ausente, tempo igual ou acima da linha de base, `judge` aceitando 25 001 ms |
| CHK-TEST-0009-03 | AC-US-0005-03 | every test-pilot record carries exactly four integer sector times; a valid lap sums them to the lap time and a lap that never ends reports the window ceiling | lista com número de setores diferente de 4 ou não inteiros, soma diferente do tempo total, volta parada sem `lapTimeMs` 50 000 e quatro tetos, registro do piloto desviado sem 4 inteiros |
| CHK-TEST-0009-04 | AC-US-0005-01 | every bench run twice gives identical states in both environments, and a run that differs is NON_DETERMINISTIC | `identical` falso em qualquer ambiente ou modo, `runCount` abaixo de 2, `judge` sem `NON_DETERMINISTIC` para execuções diferentes |
| CHK-TEST-0009-05 | NFR-0001 | the whole set of simulation benches produces the same records on a second run | qualquer campo de qualquer registro diferente entre duas execuções (relógio, sorteio, estado compartilhado), número de registros diferente do esperado |
| CHK-TEST-0009-06 | NFR-0003 | the keyboard and the tilt forms give the same lap time and sector times | medidas diferentes entre `BINARY` e `PROPORTIONAL` na volta, versão gravada diferente da corrente |
