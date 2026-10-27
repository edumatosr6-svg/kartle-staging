---
id: DES-0003
title: Superfície por roda, aderência na zebra, colisão com a barreira e contato do kart com a pista — implementação
feature: pista-kart-park
stage: code
status: validated
version: 1.0.0
sources: [API-0003, RULE-0001, FLOW-0002, FEAT-0002, FEAT-0004, FEAT-0005, REQ-FEAT-0002-12, REQ-FEAT-0004-04, REQ-FEAT-0004-05, REQ-FEAT-0004-06, REQ-FEAT-0004-07, REQ-FEAT-0005-05, REQ-FEAT-0005-06, REQ-FEAT-0005-08, REQ-FEAT-0005-09, REQ-FEAT-0007-09]
---

# DES-0003 — Superfície por roda, zebra, barreira e contato — implementação

`src/physics.ts`, camada simulação, alterado (386 → 481 linhas). Importa `src/trackGeometry.ts` (`:4`). Inalterados: a linha 3,
`STEP` (`:6`), `Input` (`:9`), a assinatura de `step` (`:384`), `RENTAL_KART`, `ARCADE_KART`, `ARCADE_ASSISTIDO_V5`, `KART_PRESETS`,
`PHYSICS_VERSION`, o bloco do muro (`:324-338`), `getHandlingTelemetry` (`surface` continua `ASPHALT` ou `GRASS`).

## Realização por requisito

| Requisito | Arquivo e símbolo |
|---|---|
| REQ-FEAT-0005-05; API-0003 | `Surface` com `curb` (`:11`); `getTrackContact` (`:425-436`): `wheelSurfaces` pelas posições das rodas no fim do passo (a fórmula de `integrate`, `:251`), `curbWheelCount`, `wheelGripPc` (1, `CURB_GRIP_PC`, `grassFriction / friction`), `beyondTrackEdgeM` por `trackEdgeDistanceM`, `barrierContact`, `simStepCount = state.stepCount`; `{code: 'NO_STATE'}` sem estado |
| REQ-FEAT-0005-08 | `CURB_GRIP_PC = 0.85` (`:13`), `surfaceMu` (`:152-154`), usado em `tireForce` (`:157`) sobre o `friction` já escalado do pneu traseiro (`:264`) e no freio assistido (`:260`) |
| REQ-FEAT-0005-09 | rolamento inalterado (`:253`: só `grass` a 0,18); `curbFraction` e `grassFraction` (`:275-276`), `mu` da assistência com o termo `(CURB_GRIP_PC · friction − grassFriction) · curbFraction` (`:278`), perda da grama por `grassFraction` (`:300`), `onRoad` = nenhuma roda em `grass` (`:389-392`), cancelamento do drift por roda em `grass` (`:414`) |
| REQ-FEAT-0005-06 | `trackEdgeDistanceM` (`:185-187`): `beyondTrackEdgeM` com `track`, senão `max(0, nearest(p).distance − WIDTH/2)` |
| REQ-FEAT-0004-04 | `Environment.track` opcional (`:176`); `trackEnvironment` (`:180-182`): `walls: false`, superfícies por `classifySurface` |
| REQ-FEAT-0004-05, -06 | bloco da barreira (`:339-357`), por subpasso, depois do muro, na ordem do arquivo: `barrierContactPoint` (`:367-383`: cruzamento próprio do trajeto S→E com o lado de S, senão superfície a menos de 0,1 m com `m = (E − Q)/|E − Q|` ou a normal do lado de S); centro em `Q + m · 0,1`; resposta do muro com `n = −m` (1,12; 0,65; `cancelManeuver`; `speed` recalculada) |
| REQ-FEAT-0004-07 | telemetria `barrierTouching`/`barrierContact` (`:26`, `:109-113`); em `step` (`:405-412`): tocando se algum subpasso respondeu ou o centro termina a ≤ 0,11 m de um segmento (nada consultado sem `track` ou sem barreira); contato só quando passa de falso a verdadeiro |
| REQ-FEAT-0002-12 | a geometria do ambiente é a do arquivo (`trackEnvironment(buildTrackGeometry(...))` em `src/trainingSession.ts:72-74`) |
| REQ-FEAT-0007-09; RULE-0001; FLOW-0002 | `Input` inalterado; nenhum sinal da aplicação entra na física; `step` continua uma função do estado |

## Evidência de que a pista sintética não mudou

`bench:handling` 46/46 `PASS` e `bench:physics` 10/10 `PASS` com os valores da linha de base; `tests/physics.test.ts`,
`tests/dirigibilidade-*` e `tests/race-lap-validation-*` verdes; os dois `finalKart` da linha de base de `modelo-kart-01` são
`deepEqual` sem os dois campos novos da telemetria (ver `98-divergences.md`).
