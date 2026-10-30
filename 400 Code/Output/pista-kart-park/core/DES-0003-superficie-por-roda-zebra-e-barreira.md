---
id: DES-0003
title: Superfície por roda, aderência na zebra, colisão com a barreira e contato do kart com a pista — implementação
feature: pista-kart-park
stage: code
status: validated
version: 1.2.0
sources: [API-0003, RULE-0001, FLOW-0002, FEAT-0002, FEAT-0004, FEAT-0005, REQ-FEAT-0002-12, REQ-FEAT-0004-04, REQ-FEAT-0004-05, REQ-FEAT-0004-06, REQ-FEAT-0004-07, REQ-FEAT-0005-05, REQ-FEAT-0005-06, REQ-FEAT-0005-08, REQ-FEAT-0005-09, REQ-FEAT-0007-09]
---

# DES-0003 — Superfície por roda, zebra, barreira e contato — implementação

`src/physics.ts`, camada simulação: alterado por esta feature (386 → 481 linhas nas rodadas 1 a 3). Na árvore da rodada 4 o arquivo
tem **440 linhas**: a retirada do drift e do turbo por `dirigibilidade` (`cfad3dc`, seed `revision: 5` daquela feature) tirou a
condição de pista da manobra, o cancelamento da manobra na barreira, o cancelamento por grama e o comentário de RULE-0001 desta
feature que os acompanhava; esta feature não tocou o arquivo na rodada 4. As linhas abaixo são as da árvore corrente. Importa
`src/trackGeometry.ts` (`:4`). Inalterados por esta feature: a linha 3, `STEP` (`:6`), `Input` (`:9`), a assinatura de `step`
(`:376`), os presets, `KART_PRESETS`, `PHYSICS_VERSION`, o bloco do muro (`:318-331`), `getHandlingTelemetry` (`:431`, `surface`
continua `ASPHALT` ou `GRASS`).

Rodada 3 (FAIL-01 de `testing-report-20261027-2307`): `barrierContactPoint` (hoje `:359-375`) escolhia a normal do lado de S invertida
(`leftOfAB` está do lado em que `orientation` é negativa); `startSideNormal` (hoje `:364`) passou a `sSide >= 0 ? −leftOfAB : leftOfAB`,
e o comentário da função diz de que lado o vetor fica.

## Realização por requisito

| Requisito | Arquivo e símbolo |
|---|---|
| REQ-FEAT-0005-05; API-0003 | `Surface` com `curb` (`:11`); `getTrackContact` (`:408-422`): `wheelSurfaces` pelas posições das rodas no fim do passo (`wheelPositions`, `:411`, a mesma fórmula de `integrate`, `:250`), `curbWheelCount`, `wheelGripPc` (1, `CURB_GRIP_PC`, `grassFriction / friction`, `:414`), `beyondTrackEdgeM` por `trackEdgeDistanceM`, `barrierContact`, `simStepCount = state.stepCount`; `{code: 'NO_STATE'}` sem estado |
| REQ-FEAT-0005-08 | `CURB_GRIP_PC = 0.85` (`:13`), `surfaceMu` (`:158-160`), usado em `tireForce` (`:161-163`) sobre o `friction` do pneu (`:262`) e no freio assistido (`:254-258`) |
| REQ-FEAT-0005-09 | rolamento inalterado (`:251`: só `grass` a 0,18); `curbFraction` e `grassFraction` (`:273-274`), `mu` da assistência com o termo `(CURB_GRIP_PC · friction − grassFriction) · curbFraction` (`:276`), perda da grama por `grassFraction` (`:295`). DES-0003 1.1.0, linha "manobra": sem mudança desta feature — a manobra e o seu cálculo de pista já não existem no arquivo |
| REQ-FEAT-0005-06 | `trackEdgeDistanceM` (`:191-193`): `beyondTrackEdgeM` com `track`, senão `max(0, nearest(p).distance − WIDTH/2)` |
| REQ-FEAT-0004-04 | `Environment.track` opcional (`:182`); `trackEnvironment` (`:186-188`): `walls: false`, superfícies por `classifySurface` |
| REQ-FEAT-0004-05, -06 | bloco da barreira (`:332-348`), por subpasso, depois do muro, na ordem do arquivo: `barrierContactPoint` (`:359-375`: cruzamento próprio do trajeto S→E com a normal do lado de S — `startSideNormal` `:364`, corrigida na rodada 3 —, senão superfície a menos de 0,1 m com `m = (E − Q)/|E − Q|` ou a normal do lado de S, `:371-374`); centro em `Q + m · 0,1`; resposta do muro com `n = −m` (1,12; 0,65; `barrierHit`; `speed` recalculada), sem cancelamento de manobra, como o passo 3 de DES-0003 1.1.0 e o muro; `CHK-TEST-0004-02` a `-06` verdes (60 e 200 m/s, 90° e 30°, dos dois lados) |
| REQ-FEAT-0004-07 | telemetria `barrierTouching`/`barrierContact` (`:26`, `:118`); em `step` (`:389`, `:392-396`): tocando se algum subpasso respondeu ou o centro termina a ≤ 0,11 m de um segmento (nada consultado sem `track` ou sem barreira); contato só quando passa de falso a verdadeiro |
| REQ-FEAT-0002-12 | a geometria do ambiente é a do arquivo (`trackEnvironment(buildTrackGeometry(...))` em `src/trainingSession.ts:72-74`) |
| REQ-FEAT-0007-09; RULE-0001; FLOW-0002 | `Input` inalterado por esta feature; nenhum sinal da aplicação entra na física; `step` continua uma função do estado |

## Evidência de que a pista sintética não mudou

`bench:handling` 46/46 `PASS` e `bench:physics` 10/10 `PASS` com os valores da linha de base; `tests/physics.test.ts`,
`tests/dirigibilidade-*` e `tests/race-lap-validation-*` verdes; os dois `finalKart` da linha de base de `modelo-kart-01` são
`deepEqual` sem os dois campos novos da telemetria (ver `98-divergences.md`). Rodada 3: `bench:handling` 46/46, `bench:physics` 10/10,
`npx tsx --test tests/*.test.ts` 398/398 (a pista sintética não tem barreira; a correção só alcança ambientes com `track`).

Rodada 4 (DES-0003 1.1.0, ADR-0003 1.1.0, ADR-0004 1.1.0; retirada do drift e do turbo por `dirigibilidade`): nenhuma mudança de
código desta feature. O que o changelog do projeto atribui à rodada de código de `dirigibilidade` — o cancelamento da manobra na
barreira, o cálculo da condição de pista da manobra, o comentário de RULE-0001 que o acompanhava e o cancelamento por grama — já foi
retirado por ela (`cfad3dc`); a árvore corrente satisfaz DES-0003 1.1.0 como está (`npx tsx --test tests/*.test.ts` 442/443, só
`CHK-TEST-0009-04`, de outro item).
