---
id: TEST-0003
title: Zebra como superfície da simulação — 85 % de aderência por pneu, rodas na zebra sem saída de pista e o contato de API-0003
feature: pista-kart-park
stage: test
status: validated
version: 1.0.1
sources: [AC-US-0005-04, AC-US-0005-06]
---

# TEST-0003 — Zebra como superfície da simulação

| | |
|---|---|
| Arquivo | `tests/pista-kart-park-surface.test.ts` (estratégia: `surface`) |
| Nível | unitário (`tireForce`, `surfaceMu`), integração (`step` sobre ambientes todo zebra e todo asfalto do mesmo estado; kart semeado com as rodas de um lado na zebra e dirigido 30 passos na Kart Park) e contrato (`getTrackContact` campo a campo, `NO_STATE`, sequência semeada de 300 passos na pista sintética) |
| Interface exercitada | `tireForce`, `surfaceMu`, `CURB_GRIP_PC`, `step`, `getTrackContact`, `wheelPositions`, `PUBLISHED_SETUPS`, `ARCADE_ASSISTIDO_V5`, `ARCADE_KART`, `TEST_PAD`, `CIRCUIT` (`src/physics.ts`); `positionAtLapM` |
| Fixtures | `kartParkEnvironment()`; `straddling(inM)`: kart no meio do trecho de zebra mais longo com as rodas do lado da zebra 0,3 m sobre a faixa e as outras no asfalto; ambiente `{surfaceAt: () => 'curb', walls: false}` contra `TEST_PAD`; `Seeded(20261027)` na `CIRCUIT`; kart a 20 m da caixa da pista (toda grama); acertos lidos de `PUBLISHED_SETUPS` com a versão publicada no rótulo (`ARCADE_ASSISTIDO` hoje `arcade-assistido-v6`, `REALISTA_ALUGUEL_4T`), `ARCADE_KART`, o atrito traseiro escalado por 0,67 e o literal `ARCADE_ASSISTIDO_V5` do piloto da Kart Park; as verificações medem a regra da zebra (razões ao asfalto do mesmo acerto), não os números de uma versão (FB-02 de `dirigibilidade`) |

## Verificações

| Check | Decide | Teste | O que a faria falhar |
|---|---|---|---|
| CHK-TEST-0003-01 | AC-US-0005-06 | the tyre capacity on the curb is 85 % of the capacity of the same tyre on the asphalt, for every load, slip and published setup | `CURB_GRIP_PC` ≠ 0,85 (mutação A), `surfaceMu('curb')/surfaceMu('asphalt')` ≠ 0,85, `tireForce(...,'curb').capacity` fora de 0,85 × asfalto (1e-12) em 48 combinações de carga, deslize e fx por acerto, força além da capacidade, regra da grama alterada |
| CHK-TEST-0003-02 | AC-US-0005-06 | stepping the simulation with every wheel on a curb gives each tyre 85 % of the capacity it has on the asphalt from the same state | atrito recuperado de `telemetry.wheels[i].capacity/carga` fora de 0,85 × asfalto (1e-9) no primeiro passo, capacidade fora de ±0,01 de 0,85 × asfalto, roda sem carga, superfície da telemetria ≠ `curb`, `yawRate` após 1 s de esterço cheio na zebra não menor que no asfalto |
| CHK-TEST-0003-03 | AC-US-0005-04, AC-US-0005-06 | a kart with the wheels of one side on the curb and the others on the asphalt reads CURB on those wheels, grip 0.85 there, and edge distance 0 | `wheelSurfaces` sem `CURB` nas rodas do lado da zebra ou sem `ASPHALT` nas outras, `curbWheelCount` ≠ 2, `wheelGripPc` ≠ 0,85/1, `beyondTrackEdgeM` ≠ 0 (mutação C/I), `barrierContact` verdadeiro, roda na grama ou centro fora da pista em 30 passos |
| CHK-TEST-0003-04 | AC-US-0005-04, AC-US-0005-06 | the contact reading has exactly the fields of API-0003, NO_STATE without a state, and never CURB nor barrier contact on the synthetic track | campo a mais ou a menos nos seis do contrato, `NO_STATE` ausente, listas de outro comprimento, `CURB` ou `barrierContact` na pista sintética em 300 passos semeados, aderência da grama diferente de `grassFriction/friction` |
| CHK-TEST-0003-05 | AC-US-0005-04 | the wheel surfaces of the reading are the surfaces at the four wheel positions of the state, front-left first | `wheelSurfaces` diferente da classificação nas quatro posições de `wheelPositions` na ordem DE, DD, TE, TD; kart longe da pista com roda não `GRASS` ou `beyondTrackEdgeM` ≤ 10 m |
