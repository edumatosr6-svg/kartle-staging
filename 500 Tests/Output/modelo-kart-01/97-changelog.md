---
title: Changelog do estágio de testes
feature: modelo-kart-01
stage: test
status: validated
version: 1.3.0
---

# 97 — Changelog

## 2026-10-27 — rodada 1, Modo A (nenhuma suíte existia para a feature)

### Entrada

- Critérios validados de `200 Requirements/230 Output/modelo-kart-01/` (US-0001 1.1.0, US-0002 1.1.0, US-0003 1.2.1, US-0004
  1.0.1, US-0005 1.0.1; NFR-0001 a NFR-0007); estratégia `test-strategy.md` 1.3.0, DES-0001 a DES-0007 e DM-0001 (projeto
  1.3.0, `dspec-validation-20261027-1941`); contratos API-0001 a API-0003 e RULE-0001 a RULE-0003 do F-Spec; manifesto de
  código `01-implementation.md` 1.1.0 e `98-divergences.md` 1.1.0 do código (linhas 15, 19 e 20 `open`, devidas a este estágio
  e ao registro humano); relatório `code-validation-20261027-1951.md` (SUCCESS; ISSUE-03 sobre o `min.y` das rodas).
- Árvore de código no momento da rodada: `src/kart01Model.ts`, `src/kart01Decals.ts`, `src/kartPose.ts`, `src/gameCamera.ts`,
  `src/main.ts` (553 linhas), `scripts/kart01-baseline.ts`, fixture `tests/fixtures/kart01-sim-baseline.json` (`schemaVersion` 1,
  `recordedOnCommit` `b86b200…`, `ARCADE_ASSISTIDO` 3 531 passos, `REALISTA_ALUGUEL_4T` 5 272 passos), `docs/kart-01/device-log.md`
  com a execução 1 (estágio de código, sem medida de taxa de quadros).

### O que foi escrito

- 4 arquivos de teste em `tests/modelo-kart-01-*.test.ts` (59 verificações `CHK-TEST-00nn-nn`, uma por função de teste),
  executados por `npm test` (`node:test` + `node:assert/strict` via `tsx`), com os registros de API-0002 impressos por
  `t.diagnostic(serializeRecord(record))` — os 12 `checkId`, cada um em exatamente um arquivo, como DES-0006 distribui
  (`KART_DIMENSIONS`, `WHEELS_AND_TRACKS`, `PART_GROUPS`, `PART_COLORS`, `DRAW_COST` em `model`; `WHEEL_SPIN` ×3 e
  `TELEMETRY_WHEEL_POSITIONS` em `pose`; `LAYERING`, `RENDER_NEUTRAL`, `SIM_CONTRACT`, `DETERMINISM`, `WHEEL_POSITIONS` em
  `contract`).
- Helper `tests/helpers/kart01Report.ts` (DES-0006): tipos de API-0002, `measureKart01Model`, `judgeModelCheck`, `wheelSpinCheck`,
  `layeringCheck`, `renderNeutralCheck`, `simContractCheck`, `determinismCheck`, `wheelPositionsCheck`,
  `telemetryWheelPositionsCheck`, `readSimBaseline`, `serializeRecord`; mais os auxiliares de teste `parseSimBaseline` (a mesma
  regra sobre dados em memória, para as cópias alteradas sem escrever arquivo), `judgeWheelSpin`, `countForbiddenImports`,
  `inputRangesUnchanged`, `inputTypeLineOf`, `expandRuns`, `replayBaseline` (uma reprodução por linha de base, partilhada por
  `DETERMINISM` e `WHEEL_POSITIONS`), `wheelWorldPoints`, `modelToWorld`, `modelExtremePoints`, `projectPoint`, `moving`,
  `boxOf`, `colorHexesOf`, `wheelDiameterM`, `pilotColorHexes`. Nenhum destes é superfície da aplicação: vivem em `tests/helpers/`
  e nenhum módulo de `src/` os importa.
- Registros de teste `TEST-0001` a `TEST-0004` neste diretório; `98-divergences.md`; este changelog. `00-index.md` e
  `99-traceability.md` são emitidos por `lint_artifacts.py --emit`.
- Nenhum arquivo de `src/`, `scripts/`, `docs/`, `index.html`, `package.json` ou `tests/fixtures/` foi editado; nenhuma
  dependência foi acrescentada.

### Mapeamento dos nomes da estratégia para os arquivos

| Estratégia (DES-0006) | Arquivo escrito | Registro | Verificações |
|---|---|---|---|
| `model` | `tests/modelo-kart-01-model.test.ts` | TEST-0001 | 19 |
| `pose` | `tests/modelo-kart-01-pose.test.ts` | TEST-0002 | 10 |
| `camera` | `tests/modelo-kart-01-camera.test.ts` | TEST-0003 | 14 |
| `contract` | `tests/modelo-kart-01-contract.test.ts` | TEST-0004 | 16 |

### Migração de verificações existentes

Inventário antes da escrita: nenhum id `CHK-TEST-*` desta feature em `tests/` nem em `99-traceability.md` (o estágio não
existia para a feature). Os 65 ids da `dirigibilidade` (`tests/dirigibilidade-*.test.ts`) e os 140 da `race-lap-validation`
(`tests/race-lap-validation-*.test.ts`) continuam nos seus arquivos, não tocados, e passam na mesma execução; `tests/physics.test.ts`
e `tests/maneuvers.test.ts` não foram modificados. `tests/race-lap-validation-layering.test.ts` continua a valer para os módulos
que lista; `LAYERING` (CHK-TEST-0004-08) verifica os mesmos seis arquivos da simulação contra os quatro módulos novos, sem o
duplicar. Nada a migrar.

### Execução

`npx tsx --test tests/*.test.ts` com os repórteres `junit` (`reports/junit-latest.xml`) e `spec`
(`reports/npm-test-latest.log`): 296 verificações, 296 aprovadas, 0 reprovadas, 0 puladas, ~20 s (237 existentes + 59 novas).
As quatro suítes novas sozinhas: ~9 s; os ensaios mais caros rodam uma vez por arquivo e são partilhados pelas verificações
(`DETERMINISM` ~1,5 s para as duas execuções de referência, 8 803 passos; `SIM_CONTRACT` ~1,2 s, 21 sondas de 120 passos por
acerto; `RENDER_NEUTRAL` ~1,2 s sobre os 3 531 passos da execução `ARCADE_ASSISTIDO`; a volta completa de
`TELEMETRY_WHEEL_POSITIONS` 3 767 passos; a curva de 90° 245 passos projetada em duas formas).

### Prova de que as verificações podem falhar

Além da coluna "o que a faria falhar" de cada `TEST-*`, as 4 suítes foram executadas contra uma cópia temporária de `src/`,
`tests/`, `scripts/` e `package.json` fora do repositório (diretório de rascunho da sessão, `node_modules` por junção), com sete
mutações, uma de cada vez; a cópia foi descartada. Durante a escrita, uma verificação reprovou por defeito do próprio check
(CHK-TEST-0004-02: o auxiliar `uses` recusava `shadow.camera` precedido de `sun.`), corrigida no check, não no código.

| Mutação | Verificações que reprovaram (59 executadas) |
|---|---|
| A — `src/kart01Model.ts`: raio das rodas traseiras 0,14 → 0,135 m (diâmetro 0,27 m) | 2: CHK-TEST-0001-03 (`WHEELS_AND_TRACKS`), CHK-TEST-0002-02 (`WHEEL_SPIN`: `diameterM` do modelo ≠ taxa de rolamento de `kartPose`) |
| B — `src/gameCamera.ts`: `RACE_CHASE_HEIGHT_M` 1,38 → 1,5 m | 2: CHK-TEST-0003-01, CHK-TEST-0003-12 |
| C — `src/gameCamera.ts`: `decideCameraMode` devolvendo `TRACK_OVERVIEW` em `ENDED` (`DOMAIN/DEC-06` desfeito) | 6: CHK-TEST-0003-01, -02, -03, -10, -13, -14 |
| D — `src/main.ts`: chamada `paintKart01Decals(kart01)` removida | 1: CHK-TEST-0004-03 |
| E — `src/physics.ts`: `clamp(input.throttle, 0, 0.8)` no passo (limite movido para dentro) | 2: CHK-TEST-0004-11 (`SIM_CONTRACT`, `inputContractUnchanged` falso), CHK-TEST-0004-13 (`DETERMINISM`) |
| F — `src/kart01Model.ts`: `piloto` adicionado a `banco` em vez de `root` | 1: CHK-TEST-0001-05 (`GROUP_NESTED`) |
| G — `src/kartPose.ts`: `advanceWheelSpin` com `Math.abs(distanceM)` (ré sem sinal) | 1: CHK-TEST-0002-02 (registro a −10 m/s `SPIN_MISMATCH`) |

### Itens da estratégia aplicados com ajuste, com o motivo

- **"`min.y` 0 (rodas no chão)" (AC-US-0002-05, `model` (I)):** a caixa envolvente das quatro rodas montadas tem `min.y`
  0,0033 m, porque o pneu é um `LatheGeometry` de 14 segmentos sem vértice em −Y (DES-0001 1.1.0; ISSUE-03 do relatório
  `code-validation-20261027-1951`, info). A verificação CHK-TEST-0001-17 afirma "rodas no chão" com a precisão que RULE-0001
  dá a toda medida de roda — ao centímetro: `toCm(min.y) === 0`, `min.y ≥ 0`, e o centro de cada roda a exatamente um raio do
  chão — e imprime o valor bruto por `t.diagnostic`. Não é defeito de código (a geometria é a do Cowork, inalterada) nem
  tolerância nova: é a de RULE-0001. Registrado em `98-divergences.md` como interpretação da frase da estratégia.
- **"o `upperArm` tem comprimento 0,285 m, o `forearm` 0,246 m" (AC-US-0002-04):** o braço superior é o segmento ombro→cotovelo
  (0,285 m, `ARM_UPPER_M`); 0,246 m é o comprimento da malha do antebraço (0,84 + 0,072 vezes 0,27 m), enquanto o segmento
  cotovelo→mão da cinemática mede 0,27 m. CHK-TEST-0001-16 afirma os três: 0,285 m e 0,27 m com 1e-6 e a malha de 0,246 m ao
  milímetro, mais a luva a 0,1386 m do centro no plano do aro (e a 0,012 m fora dele, o `z` local da pegada) nos cinco ângulos.
- **`curve90` "a 50 km/h" (AC-US-0003-07, -08):** o kart é colocado a 50 km/h por `seedLap` numa volta `TRAINING` com o acerto
  `ARCADE_ASSISTIDO` e dirigido com acelerador e esterço cheios; durante os 245 passos até os 90° a velocidade varia entre 44 e
  58 km/h (regulador e curva). CHK-TEST-0003-08 afirma que algum quadro da curva está a ≥ 50 km/h e projeta todos os quadros;
  o pior canto fica em |NDC| 0,68.
- **`readSimBaseline(path)` (DES-0006):** recebe um segundo parâmetro opcional, a leitura corrente (`syntheticReading()` por
  padrão), porque a regra "`trackVersion` da leitura corrente difere da gravada" precisa da leitura; `parseSimBaseline(data,
  reading)` aplica a mesma regra a dados em memória, o que permite as cópias alteradas de CHK-TEST-0004-12, -14 e -15 sem
  escrever arquivo. `determinismCheck`/`wheelPositionsCheck` recebem o resultado de `readSimBaseline` (ok ou `BASELINE_MISSING`)
  e a leitura, como a tabela de DES-0006 descreve.
- **`renderNeutralCheck(reading, inputs)`:** recebe também a configuração da execução de referência (`driverMass` 75 kg), para
  que a sequência gravada seja reproduzida no mesmo acerto; `lapState` da câmera por quadro vem de `getLapState(rendered)`.
- **`WHEEL_POSITIONS.checkStepCount`:** soma dos `checkStepCount` das duas execuções de referência (8 803), já que o registro é
  um só para os dois acertos e `comparedValueCount` é 16.
- **AC-US-0001-14 "`src/main.ts` não contém `boxGeo` aplicado a um grupo `kart`":** `boxGeo` continua em `src/main.ts` para os
  marcadores da pista; CHK-TEST-0004-01 afirma a ausência de `box(kart`, do cilindro `0.31`, da esfera `0.36` e de `helmet`, e
  a presença de `buildKart01Model()`, `paintKart01Decals` e `kartRoot`.
- **`LAYERING` e `countForbiddenImports`:** além do registro sobre os seis arquivos, a função é exercitada com um texto sintético
  que importa `./kartPose` (e a forma `.js`), para que a verificação possa falhar sem alterar a simulação.

### Itens declinados, com o motivo

- **Criação de árvores de E2E e escrita em `docs/kart-01/device-log.md`:** declinada. O estágio escreve só em `tests/` e em
  `500 Tests/Output/<feature>/` (conventions §14); não há ferramenta de E2E e nenhuma dependência foi acrescentada. Os critérios
  cuja parte de tela, aparelho, orientação ou navegador depende dos roteiros `E2E-01` a `E2E-06` estão em `98-divergences.md`
  como `unverified`, à espera do registro humano em `docs/kart-01/device-log.md` (execução 1 registrada pelo código, sem
  taxa de quadros).
- **Verificações de acesso não autenticado e de papel recusado (política de segurança do skill):** não aplicáveis. API-0001 a
  API-0003 não têm endpoint de rede, sessão nem papel (I6); não há webhook.
- **Verificação de idempotência por evento duplicado (política do skill):** não há escrita de domínio nem transição de estado
  nesta feature; a idempotência de API-0002 (a mesma verificação duas vezes dá registros idênticos) está em CHK-TEST-0004-16 e a
  de `updateKart01Pose` por pose em CHK-TEST-0001-14/-15 (poses repetidas dão as mesmas rotações); a invariância de
  `advanceWheelSpin` sem passo novo em CHK-TEST-0002-03.
- **Linha 1 de NFR-0006 ("0 linhas alteradas em `src/physics.ts`, `src/lap.ts`, `src/track.ts` e nos presets"):** a diferença
  do repositório é registrada pelo manifesto da etapa de código (`01-implementation.md`, D-CD-01) e conferida pelo validador de
  código; em `npm test` vale `SIM_CONTRACT` (CHK-TEST-0004-11) e `DETERMINISM` (CHK-TEST-0004-13), como a estratégia distribui.
  Nenhuma verificação chama `git` (o estágio não o executa).
- **`checkFailReason` de `BASELINE_MISSING` para `TELEMETRY_WHEEL_POSITIONS`:** não existe; o registro não depende da linha de
  base (compara a telemetria com `wheelPositions` do mesmo passo), como API-0002 lista só três registros com esse motivo.

## 2026-10-27 — rodada 2, Modo B (uma verificação reprovada por mudança de projeto de outra feature)

### Entrada

- `400 Code/Output/pista-kart-park/98-divergences.md` (seção "Verificações de outras features reprovadas por esta rodada", linha
  `CHK-TEST-0004-13`): DES-0003 de `pista-kart-park` acrescenta `barrierTouching` e `barrierContact` a `Telemetry`
  (`src/physics.ts:26`); `runDiffers` comparava o `State` final por `isDeepStrictEqual` com `finalKart` gravado em `b86b200`, cuja
  `telemetry` não tem os dois campos. Evidência da etapa de código: retirados os dois campos, os dois `finalKart` são iguais e
  `lapMs` 29 419 / 43 932 ms iguais.
- Projeto de `modelo-kart-01`: DM-0001 (`finalKart` comparado "campo a campo, inclui `telemetry` e `maneuvers`"; janela de
  compatibilidade: regravação só quando outra feature publica **outro acerto ou outra pista**), ADR-0004, DES-0006; REQ-FEAT-0006-07/-08.

### O que mudou (correção a — comparar os campos gravados)

- `tests/helpers/kart01Report.ts`: nova `recordedFieldsOf(recorded, current)` — projeção do `State` corrente sobre os campos que
  a linha de base gravou, recursiva em objetos e vetores (vetores mantêm o comprimento corrente, logo outro comprimento difere;
  um campo gravado ausente do estado fica `undefined` e difere). `runDiffers` compara `recordedFieldsOf(run.finalKart, kart)`
  com `run.finalKart` por `isDeepStrictEqual`; `lapValidity`, `lapMs` e `sectorMs` como antes. O registro `DETERMINISM` de
  API-0002 não ganhou campo.
- `tests/modelo-kart-01-contract.test.ts`, CHK-TEST-0004-13: além das asserções anteriores, prova que a verificação ainda pode
  falhar — `recordedFieldsOf` ignora um campo nunca gravado (`addedLater`), nota um campo gravado ausente (`wallContact`
  `undefined`) e um vetor de outro comprimento (`wheels` vazio); `determinismCheck` sobre uma cópia da linha de base com
  `finalKart.x` + 0,01 é `NON_DETERMINISTIC` com `differingRunCount` 1, e com um campo gravado que o estado não tem
  (`recordedButGone`) também. Custo: duas reproduções a mais (~3 s na verificação).
- `TEST-0004` 1.0.0 → 1.1.0: coluna "o que a faria falhar" de CHK-TEST-0004-13, fixtures e interface (`recordedFieldsOf`).
- `tests/fixtures/kart01-sim-baseline.json` **não** foi regravado: `recordedOnCommit` continua `b86b200`.

### Por que (a) e não (b) — regravar com `--force`

- A janela de compatibilidade de DM-0001 manda regravar quando outra feature publica outro acerto ou outra pista; aqui
  `setupVersion` (`arcade-assistido-v5`, `realista-aluguel-4t-v4`) e `trackVersion` 2 são os mesmos, e cada valor gravado é
  idêntico ao reproduzido — a simulação não mudou, só a forma da `telemetry` ganhou dois campos sem valor gravado.
- Regravar aceitaria silenciosamente qualquer mudança da simulação da árvore corrente (a rodada de `pista-kart-park`, ainda sem
  commit, sem sha para `--commit`), e DM-0001 proíbe comparar contra uma linha de base de outro estado. A projeção mantém cada
  um dos valores gravados como decisor (REQ-FEAT-0006-07/-08: mesma entrada, mesma volta, mesmo estado gravado).
- Quando `pista-kart-park` for committed, a regravação permanece opcional e só mudaria `recordedOnCommit`; os valores são os mesmos.

### Migração de verificações existentes

| Id | Mudança | Por que o critério continua coberto |
|---|---|---|
| CHK-TEST-0004-13 | modified: comparação de `finalKart` pelos campos gravados (`recordedFieldsOf`) em vez do objeto inteiro; cinco asserções de capacidade de falha acrescentadas | todos os campos gravados (`State` completo da revisão `b86b200`, com `telemetry` e `maneuvers`) continuam comparados valor a valor; só um campo que a linha de base nunca gravou deixa de decidir — e para ele não há valor esperado |

Nenhuma verificação removida, renomeada ou fundida; as outras 58 carried.

### Execução

`npx tsx --test tests/*.test.ts` com os repórteres `junit` (`reports/junit-latest.xml`) e `spec` (`reports/npm-test-latest.log`),
2026-10-27: 296 verificações, 296 aprovadas, 0 reprovadas, 0 puladas, ~40 s. CHK-TEST-0004-13 passa com `DETERMINISM`
`comparedRunCount` 2, `differingRunCount` 0; `CHK-TEST-0009-02` (`race-lap-validation`, em edição por outro agente) passou nesta
execução.

### Prova de que a verificação pode falhar

Cópia temporária de `src/`, `tests/`, `scripts/` e `package.json` no diretório de rascunho da sessão (`node_modules` por junção),
mutação E de novo (`clamp(input.throttle, 0, 0.8)` em `src/physics.ts:234`), `tests/modelo-kart-01-contract.test.ts` só: 14
aprovadas, 2 reprovadas — CHK-TEST-0004-11 (`SIM_CONTRACT`, `inputContractUnchanged` falso) e CHK-TEST-0004-13 (`DETERMINISM`
`differingRunCount` 2, `NON_DETERMINISTIC`). A cópia foi descartada. Em memória, dentro da própria verificação: `finalKart.x` +
0,01 e um campo gravado inexistente no estado reprovam (acima).

### Itens declinados, com o motivo

- **Regravar a linha de base (`npm run baseline:kart01 -- --force --commit <sha>`), a primeira alternativa do encaminhamento de
  `pista-kart-park`:** declinada, pelos motivos da seção "Por que (a)". A segunda alternativa do mesmo encaminhamento ("comparar
  `finalKart` só nos campos da versão gravada") é a adotada.
- **Acrescentar ao registro `DETERMINISM` um campo com os campos não comparados:** declinado; API-0002 fixa os campos do
  registro e CHK-TEST-0004-16 os confere campo a campo (superfície congelada em rodada de correção, conventions §16). A lista
  fica nesta entrada e na coluna de TEST-0004.

## 2026-10-30 — rodada 3, Modo B (linha de base da simulação regravada com `arcade-assistido-v6`)

### Entrada

- FB-02 da `dirigibilidade`, aplicado no D-Spec validado (`reports/dspec-validation/dspec-validation-20261030-1413.md`):
  ADR-0004 ("Regravação com `arcade-assistido-v6`"), ADR-0003 decisão 6, DM-0001.
- Entrega do código da `dirigibilidade` (commit `cfad3dc`, acerto `arcade-assistido-v6`). Com o fixture ainda em
  `arcade-assistido-v5`, `readSimBaseline` devolvia `BASELINE_MISSING` e reprovavam CHK-TEST-0004-09, -11, -12, -13, -14,
  -15 e -16.

### O que mudou

- `tests/fixtures/kart01-sim-baseline.json` regravado com `npm run baseline:kart01 -- --force --commit a361c9c9970195acf0b11c0b2f31ea21b91d7fce`
  sobre a árvore de `HEAD` (`src/` e `scripts/` sem alteração local). Proveniência: `recordedOnCommit` `a361c9c…`,
  `recordedAtUtc` 2026-10-30T14:51:27Z, `stepS` 1/120, `trackId` `synthetic`, `trackVersion` 2, motorista de 75 kg.
- `ARCADE_ASSISTIDO`: `setupVersion` `arcade-assistido-v5` → `arcade-assistido-v6`; 3 531 → 3 525 passos, 143 → 136
  trechos de `inputRuns`, `lapMs` 29 419 → 29 369, `VALID`; `finalKart` novo.
- `REALISTA_ALUGUEL_4T`: `realista-aluguel-4t-v4` inalterado; mesmos 5 272 passos, mesmos `inputRuns`, `lapMs` 43 932; o
  `finalKart` só ganhou `telemetry.barrierTouching` e `telemetry.barrierContact` (DES-0003 de `pista-kart-park`), que agora
  decidem em CHK-TEST-0004-13.
- `wheelPositions`, `simWheelbaseM` 1,04, `simTrackWidthM` 1,20 e `inputTypeLine` iguais aos gravados antes.
- TEST-0004 1.1.0 → 1.2.0: linha "Fixtures" (proveniência da linha de base) e a frase de CHK-TEST-0004-13 sobre os campos de
  `pista-kart-park`, agora gravados.
- Nenhum arquivo de teste nem `tests/helpers/kart01Report.ts` mudou: o leitor compara `setupVersion` com `PUBLISHED_SETUPS`, e as
  cópias alteradas em memória (`setupVersion` `arcade-assistido-v4`, etc.) seguem diferentes do publicado.

### Migração de verificações existentes

Nenhuma verificação modificada, renomeada, fundida ou removida; todas carried. CHK-TEST-0004-09, -11 a -16 voltam a comparar a
simulação real (`drive` com `autopilot()` sobre `PUBLISHED_SETUPS`) contra a volta gravada com o acerto v6.

### Execução

`npx tsx --test tests/*.test.ts` com os repórteres `junit` (`reports/junit-latest.xml`) e `spec` (`reports/npm-test-latest.log`),
2026-10-30: 393 verificações, 393 aprovadas, 0 reprovadas, 0 puladas, ~36 s. Nenhuma verificação de marcas de pneu ou de
congelamento do Kart 01 reprovou nesta execução.

### Itens declinados, com o motivo

- **Alterar as verificações de marcas de pneu / congelamento do Kart 01:** fora do escopo desta rodada; a rodada de código do
  Kart 01 que as implementa vem depois.

## 2026-10-30 — rodada 4, Modo B (seed rev 4: marcas por derrapagem, sem drift nem turbo, treino contínuo)

### Entrada

- `reports/test-validation/test-validation-20261030-1453.md` (FAIL TEST): ISSUE-09 (sem verificação para AC-US-0003-14 e
  AC-US-0005-04 a -07) e ISSUE-10 (CHK-TEST-0003-09, -0001-19, -0004-05 e -0004-06 decidiam critérios retirados).
- Requisitos revalidados contra o seed rev 4 (`200 Requirements/230 Output/modelo-kart-01/`, US-0003 AC-14, US-0005 AC-04 a -07);
  estratégia `test-strategy.md` 1.6.0 ("Verificações existentes"; linhas de AC-US-0003-04, -14 e AC-US-0005-04 a -07).
- Código da rodada 3 (`400 Code/Output/modelo-kart-01/reports/code-validation/code-validation-20261030-1655.md`, SUCCESS):
  `baseVerticalFovDeg` renomeada `shapeVerticalFovDeg` (DES-0003), `turboActive`/`turboFovDeltaDeg` fora de `CameraView`,
  jato e `exhaustOutlet` fora, marcas pela telemetria (`speedMps` > 6, `sideslipRad` > 0,055) a cada passo novo em `RUNNING`.
- Antes desta rodada: `tests/modelo-kart-01-camera.test.ts` não carregava (importava `baseVerticalFovDeg`); CHK-TEST-0001-19,
  -0004-05 e -0004-06 reprovavam contra a árvore.

### O que mudou

- `tests/modelo-kart-01-camera.test.ts`: importa `shapeVerticalFovDeg`; `viewOf`/`viewOfPose` sem `turboActive`; CHK-TEST-0003-09
  retirada; CHK-TEST-0003-15 e -16 novas (AC-US-0003-14).
- `tests/modelo-kart-01-model.test.ts`: CHK-TEST-0001-19 retirada; CHK-TEST-0001-20 (AC-US-0005-04) e -21 (AC-US-0005-05) novas.
- `tests/modelo-kart-01-contract.test.ts`: CHK-TEST-0004-05 retirada; CHK-TEST-0004-06 reescrita para AC-US-0005-06;
  CHK-TEST-0004-17 (AC-US-0005-04), -18 (AC-US-0005-05), -19 e -20 (AC-US-0005-07) novas.
- `tests/helpers/kart01Report.ts`: `tyreMarkBlockOf` e `tyreMarkRunner` — o bloco das marcas de `src/main.ts` (o primeiro `if`
  depois da declaração de `lastSkidStepCount` cuja condição o lê), transpilado como está com `typescript` (dependência de
  desenvolvimento já declarada), executado num escopo que só tem a sessão, a pose, `getLapState`, `getHandlingTelemetry`,
  `simWheelGroundPositions`, `THREE` e uma `InstancedMesh` real; devolve os trechos escritos no quadro. Nenhum comando de
  jogador existe no escopo: uma leitura de teclado, toque, inclinação ou `Input` no bloco lança `ReferenceError`.
  `renderNeutralCheck` deixa de passar `turboActive` a `computeCameraView` (campo que a interface não tem mais; CHK-TEST-0004-09
  sem mudança de comportamento).
- TEST-0001 1.0.0 → 1.1.0, TEST-0003 1.0.0 → 1.1.0, TEST-0004 1.2.0 → 1.3.0 (`sources:` só com critérios do seed rev 4);
  98-divergences 1.1.0 → 1.2.0 (seção de critérios retirados, linhas novas de AC-US-0003-14 e AC-US-0005-04 a -07, duas
  interpretações registradas).

### Migração de verificações existentes

| Id | Desfecho | O que mudou | Por que o critério continua coberto / aprovação |
|---|---|---|---|
| CHK-TEST-0003-09 | removed | decidia o efeito de turbo de 4° (AC-US-0003-09) | critério retirado do seed (rev 3/4) pelo dono do produto, Eduardo Matos, 2026-10-29 ("Sem efeito de turbo na câmera", `200 Requirements/220 Input/modelo-kart-01/DOMAIN.md`); estratégia 1.6.0 "Verificações existentes"; registrado em `98-divergences.md` |
| CHK-TEST-0001-19 | removed | decidia a posição da âncora `exhaustOutlet` (AC-US-0005-02) | critério retirado pelo dono do produto, Eduardo Matos, 2026-10-29 ("Treino contínuo e fim do drift e do turbo", `DOMAIN/DEC-07`); no lugar, CHK-TEST-0001-21 prova a ausência (AC-US-0005-05) |
| CHK-TEST-0004-05 | removed | decidia o jato preso a `anchors.exhaustOutlet` visível com `tricks.boost` (AC-US-0005-02) | mesma decisão de 2026-10-29 (Eduardo Matos, `DOMAIN/DEC-07`); no lugar, CHK-TEST-0004-18 (AC-US-0005-05) |
| CHK-TEST-0004-06 | modified | era a expressão regular `tricks.drifting && state.speed > 6 && …` (AC-US-0005-03, retirado em 2026-10-29/2026-10-30 por Eduardo Matos, `DOMAIN/DEC-07`, `DOMAIN/DEC-09`); agora executa o bloco das marcas de `src/main.ts` sobre 6 000 passos dirigidos em quadros de 0 a 3 passos e exige 2 trechos (um terminando sob cada roda traseira, encadeado na posição do quadro anterior) exatamente nos quadros com passo novo, `RUNNING`, > 6 m/s e > 0,055 rad, e nenhum nos outros; exige quadros dirigidos dos dois lados de cada limite e da derrapagem | decide AC-US-0005-06 (e a metade de velocidade e derrapagem de AC-US-0005-07), como a estratégia 1.6.0 pede para esta verificação |
| CHK-TEST-0003-04 | modified | sem a afirmação `baseVerticalFovDeg === 62` (campo retirado); acrescenta `shapeVerticalFovDeg('LANDSCAPE', a) === 62` para 1, 16:9 e 21:9, a sessão dirigida com `drift` alternado e aceleração plena com 62° em todos os quadros, e a ausência de `baseVerticalFovDeg`/`turboFovDeltaDeg` em toda `CameraView` (visão geral, descida, corrida) | AC-US-0003-04 decidido por mais caminhos, nenhum afrouxado |
| CHK-TEST-0003-05 | modified | só o nome (sem "without turbo") | mesmo corpo |
| CHK-TEST-0003-06 | modified | `baseVerticalFovDeg('PORTRAIT', 0.99)` → `shapeVerticalFovDeg('PORTRAIT', 0.99)` (renomeação de DES-0003) | mesmo valor exigido |
| CHK-TEST-0003-10 | modified | as afirmações de ausência de `baseVerticalFovDeg`/`turboFovDeltaDeg` na visão geral passam para CHK-TEST-0003-04 (que cobre os três modos); a chamada sem pista não passa `turboActive` | AC-US-0003-10 com as mesmas afirmações de modo, altura, margem e `NO_SCENE` |
| CHK-TEST-0004-09 | modified | `renderNeutralCheck` sem `turboActive` | `RENDER_NEUTRAL` inalterado (`differingFieldCount` 0) |

Novas: CHK-TEST-0001-20, -0001-21, -0003-15, -0003-16, -0004-17, -0004-18, -0004-19, -0004-20. Atrito por arquivo: 59 → 64
(3 removidas, 8 novas); nenhuma outra id mudou.

### Execução

`npx tsx --test` com os repórteres `junit` (`reports/junit-latest.xml`) e `spec` (`reports/npm-test-latest.log`), 2026-10-30:
441 verificações, 441 aprovadas, 0 reprovadas, 0 puladas; desta feature, por atributo `file`: `-model` 20, `-pose` 10,
`-camera` 15, `-contract` 19 = 64, todas aprovadas.

### Prova de que as verificações novas e modificadas podem falhar

Cópia de `src/`, `tests/`, `tracks/`, `index.html`, `package.json` e `tsconfig.json` no rascunho da sessão, com junção para
`node_modules`; uma mutação literal por vez, os arquivos de teste nomeados executados com o repórter TAP, o arquivo restaurado
depois de cada tentativa (sem mutação: 64/64). Resultado:

- M01 (`src/main.ts`, `speedMps > 6` → `>= 6`): 1 de 19 reprovadas — CHK-TEST-0004-19
- M02 (`src/main.ts`, `sideslipRad > 0.055` → `>= 0.055`): 1 de 19 reprovadas — CHK-TEST-0004-19
- M03 (`src/main.ts`, `speedMps > 6` → `> 5.5`): 2 de 19 reprovadas — CHK-TEST-0004-06, CHK-TEST-0004-19
- M04 (`src/main.ts`, `sideslipRad > 0.055` → `> 0.06`): 2 de 19 reprovadas — CHK-TEST-0004-06, CHK-TEST-0004-19
- M05 (`src/main.ts`, fase recusada só em `COUNTDOWN` (no lugar de `!== 'RUNNING'`)): 1 de 19 reprovadas — CHK-TEST-0004-20
- M06 (`src/main.ts`, contador `>` → `>=`): 2 de 19 reprovadas — CHK-TEST-0004-06, CHK-TEST-0004-19
- M07 (`src/main.ts`, termo `&& lap.kart.maneuvers.drifting` acrescentado): 3 de 19 reprovadas — CHK-TEST-0004-06, CHK-TEST-0004-17, CHK-TEST-0004-19
- M08 (`src/main.ts`, rodas dianteiras (`.slice(0, 2)`)): 2 de 19 reprovadas — CHK-TEST-0004-04, CHK-TEST-0004-06
- M09 (`src/main.ts`, derrapagem com sinal (`lap.kart.telemetry.sideslip > 0.055`)): 2 de 19 reprovadas — CHK-TEST-0004-06, CHK-TEST-0004-19
- M10 (`src/main.ts`, `Sprite` acrescentado a `kartRoot`): 1 de 19 reprovadas — CHK-TEST-0004-17
- M11 (`src/main.ts`, jato `ConeGeometry` acrescentado à cena): 2 de 19 reprovadas — CHK-TEST-0004-17, CHK-TEST-0004-18
- M12 (`src/kart01Model.ts`, `anchors.exhaustOutlet` de volta (`src/kart01Model.ts`)): 2 de 39 reprovadas — CHK-TEST-0001-21, CHK-TEST-0004-18
- M13 (`src/kart01Model.ts`, cone acrescentado à raiz do modelo (`src/kart01Model.ts`)): 2 de 20 reprovadas — CHK-TEST-0001-09, CHK-TEST-0001-20
- M14 (`src/gameCamera.ts`, `TRACK_OVERVIEW` no treino a partir da segunda volta (`decideCameraMode`)): 1 de 15 reprovadas — CHK-TEST-0003-16
- M15 (`src/gameCamera.ts`, `TRACK_OVERVIEW` no treino `ENDED` (`computeCameraView`)): 1 de 15 reprovadas — CHK-TEST-0003-15
- M16 (`src/gameCamera.ts`, `baseVerticalFovDeg` de volta na `CameraView` de corrida): 1 de 15 reprovadas — CHK-TEST-0003-04
- M17 (`src/gameCamera.ts`, `shapeVerticalFovDeg` 64° em paisagem acima de 2:1): 1 de 15 reprovadas — CHK-TEST-0003-04
- M18 (`src/gameCamera.ts`, +4° no campo vertical acima de 12 m/s): 1 de 15 reprovadas — CHK-TEST-0003-04
- Registro integral: `reports/mutation-trials-20261030-r4.txt`. Junção e cópia removidas depois; árvore do repositório intacta.

### Itens declinados, com o motivo

- **"velocidades de 0 a mais de 25 m/s" (estratégia, AC-US-0003-04):** a simulação v6 não passa de ~16 m/s na pista sintética
  com nenhum acerto publicado; a sessão dirigida exige > 15 m/s e os 25 m/s ficam na pose `moving(25)`. Registrado em
  `98-divergences.md` (interpretação).
- **Verificação por texto do bloco das marcas (estratégia, AC-US-0005-06/-07):** substituída pela execução do próprio bloco
  sobre estados dirigidos, como a invocação desta rodada pede; os limites exatos usam uma cópia do passo dirigido com um campo
  no limite (`seedLap`), ao lado do controle 6 + 1e-6 / 0,055 + 1e-6. Registrado em `98-divergences.md` (interpretação).
- **ISSUE-01 (expressões regulares sobre `src/main.ts`), ISSUE-02 a -06:** carried, como no relatório (warning/info, não
  bloqueiam).

## 2026-10-30 — rodada 5, Modo B (nível C da câmera; executor das marcas tolerante a forma)

### Entrada

- `reports/test-validation/test-validation-20261030-1725.md` (FAIL TEST): ISSUE-11 (nível C da estratégia 1.6.0 para
  AC-US-0003-04 e AC-US-0003-14 sem verificação; a mutação V3 — `RACE_CHASE` na contagem do treino — passava 15/15),
  ISSUE-12 (falha de extração derrubava as 19 verificações do arquivo; pose sem o `idleKart` de `src/main.ts`), ISSUE-13 e
  ISSUE-14 (info).

### O que mudou

- `tests/modelo-kart-01-camera.test.ts`: CHK-TEST-0003-15 modificada; CHK-TEST-0003-17 (AC-US-0003-04, nível C) e -18
  (AC-US-0003-14, nível C) novas; importa `sourceText` e `stripComments` do helper.
- `tests/helpers/kart01Report.ts`: `tyreMarkRunner` monta a pose como `src/main.ts` (`getKartPose(lap?.kart ?? idleKart)`,
  terceiro parâmetro opcional), põe no escopo as constantes numéricas de módulo de `src/main.ts` (`const NOME = número;`) e
  converte qualquer falha de extração ou de execução num único erro "AC-US-0005-06: the tyre-mark block of src/main.ts changed
  shape (…)"; `tyreMarkBlockOf` aceita o texto já transpilado.
- `tests/modelo-kart-01-contract.test.ts`: a varredura das marcas é montada na primeira verificação que a usa (`lazySweep`), não no
  carregamento do módulo; CHK-TEST-0004-20 ganha o quadro sem volta sobre um `idleKart` que escorrega acima dos dois limites.
- TEST-0003 1.1.0 → 1.2.0, TEST-0004 1.3.0 → 1.4.0, 98-divergences (velocidades medidas no `TEST_PAD`, ISSUE-14; totais da
  execução).

### Migração de verificações existentes

| Id | Desfecho | O que mudou | Por que o critério continua coberto |
|---|---|---|---|
| CHK-TEST-0003-15 | modified | além de corrida, corrida pausada e fim, compara as vistas e o modo de `decideCameraMode` entre `OFFICIAL`, `RECON` e `TRAINING` na contagem e na contagem pausada (`COUNTDOWN_DESCENT` em todos os tipos) e percorre a contagem real de um treino e de uma volta oficial passo a passo, com vistas iguais | AC-US-0003-14 decidido por mais fases; nenhuma afirmação anterior saiu |
| CHK-TEST-0004-20 | modified | acrescenta o quadro sem volta com `idleKart` | AC-US-0005-07 com as mesmas afirmações e mais um caso |
| CHK-TEST-0004-06, -19 | modified | só o modo de montar a varredura e o executor (pose com `idleKart`, constantes de módulo, erro único); oráculo e afirmações iguais | AC-US-0005-06/-07 inalterados |

Novas: CHK-TEST-0003-17, CHK-TEST-0003-18. Atrito por arquivo: 64 → 66; nenhuma removida.

### Execução

`npx tsx --test` com os repórteres `junit` (`reports/junit-latest.xml`) e `spec` (`reports/npm-test-latest.log`), 2026-10-30:
443 verificações, 443 aprovadas, 0 reprovadas, 0 puladas; desta feature, por atributo `file`: `-model` 20, `-pose` 10,
`-camera` 17, `-contract` 19 = 66.

### Prova de que as verificações novas e modificadas podem falhar

Cópia de `src/`, `tests/`, `tracks/`, `index.html`, `package.json`, `tsconfig.json` no rascunho, com junção para `node_modules`;
mutação literal, arquivos de teste nomeados com o repórter TAP, arquivos restaurados depois de cada tentativa; cópia e junção
removidas no fim, árvore do repositório intacta. Registro integral em `reports/mutation-trials-20261030-r5.txt`.

- N01 (`decideCameraMode` sem descida na contagem do treino (V3 do validador)): tests 17 fail 2 | failing CHK-TEST-0003-15, CHK-TEST-0003-18
- N02 (`src/gameCamera.ts` importa o tipo `Input`): tests 17 fail 1 | failing CHK-TEST-0003-17
- N03 (`src/gameCamera.ts` importa `src/maneuvers.ts`): tests 17 fail 1 | failing CHK-TEST-0003-17
- N04 (`turboActive: false` acrescentado à chamada de `computeCameraView` em `src/main.ts`): tests 17 fail 1 | failing CHK-TEST-0003-17
- N05 (constante `baseVerticalFovDeg` em `src/main.ts`): tests 17 fail 1 | failing CHK-TEST-0003-17
- N06 (`decideCameraMode` em corrida para o reconhecimento na contagem): tests 17 fail 2 | failing CHK-TEST-0003-15, CHK-TEST-0003-18
- N07 (limite 6 movido para a constante de módulo `SKID_MIN_SPEED_MPS = 6` (refatoração neutra, V2 do validador): deve passar): tests 19 fail 0 | failing none
- N08 (a mesma constante com 7): tests 19 fail 2 | failing CHK-TEST-0004-06, CHK-TEST-0004-19
- N09 (o bloco das marcas passa a ler `keys` (comando do jogador)): tests 19 fail 3 | failing CHK-TEST-0004-06, CHK-TEST-0004-19, CHK-TEST-0004-20 | message: block changed shape

N07 mostra que a refatoração neutra não derruba mais nada; N09 mostra que uma mudança de forma reprova só as verificações de
marca, com a mensagem de forma, e as outras 16 do arquivo seguem executando.

### Itens declinados, com o motivo

- **ISSUE-13 (estado no limite exato por `seedLap`):** mantido, como o relatório recomenda; é a única verificação que separa `>`
  de `>=` (M01, M02) e usa só o `LapSession` público.
- **ISSUE-12, dependência do primeiro `if` que lê `lastSkidStepCount`:** mantida; um bloco reescrito de outra forma passa a dar a
  mensagem de forma em vez de um falso verde ou uma falha de arquivo.
