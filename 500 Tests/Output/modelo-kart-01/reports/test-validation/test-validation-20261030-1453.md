---
stage: test
feature: modelo-kart-01
verdict: FAIL TEST
generated: 2026-10-30T15:00:38Z
run: {collected: 393, passed: 393, failed: 0, skipped: 0, fresh: true}
counts: {blocker: 0, error: 2, warning: 1, info: 6, divergence: 24}
checks: {before: 59, after: 59, migrated: 0, removed: 0}
seed: {revision: 4, digest: 4e9bfbba6294}
round: 3
mode: B
previous-report: reports/test-validation/test-validation-20261027-2131.md
upstream: {strategy: test-strategy.md 1.6.0, dspec-report: dspec-validation-20261030-1413}
run-artifacts: {junit: reports/junit-latest.xml, log: reports/npm-test-latest.log, measured: 2026-10-30T14:52:22Z, baseline-written: 2026-10-30T14:51:27Z, last-src-edit: anterior a a361c9c (src/, scripts/ sem alteração local)}
population: [ISSUE-01..08 do relatório anterior, TEST-0004 1.2.0, 97-changelog.md (rodada 3), tests/fixtures/kart01-sim-baseline.json, TEST-0003 (não tocado, sorteado), tests/modelo-kart-01-model.test.ts (não tocado, sorteado)]
feedbacks: []
---

# Relatório de validação de testes — modelo-kart-01, rodada 3 (Modo B, linha de base regravada com arcade-assistido-v6)

## Verification status

- critérios do seed rev 4: 49 (42 AC + 7 NFR); verificados em `npm test`: 25; metade automatizável provada e metade de tela `unverified`: 15 (DIV-01..09, -11..-15, -18); só no aparelho: 4 (DIV-19..22); sem nenhuma verificação: 5 — AC-US-0003-14, AC-US-0005-04, -05, -06, -07 (ISSUE-09); cobertos só por skip: 0
- verificações desta feature: 59 por arquivo em `junit-latest.xml` (`-model` 19, `-pose` 10, `-camera` 14, `-contract` 16), 0 `failure`, 0 `skipped`; `ℹ tests 393 · pass 393 · fail 0 · skipped 0`; 4 delas decidem critérios retirados do seed (ISSUE-10)
- frescor: execução terminada em 14:52:22Z (~36 s), depois da escrita do fixture (14:51:27Z); `find src tests tracks scripts index.html package.json -newer junit-latest.xml` vazio; `src/` e `scripts/` sem alteração local contra `HEAD` (`a361c9c`)
- proveniência do fixture: `git archive a361c9c` extraído no rascunho da sessão, `npx tsx scripts/kart01-baseline.ts --force --commit a361c9c9970195acf0b11c0b2f31ea21b91d7fce` lá → JSON igual ao versionado por `isDeepStrictEqual`, salvo `recordedAtUtc`; gravado pelo script do projeto sobre a árvore committed, sem edição manual
- conteúdo do fixture: `ARCADE_ASSISTIDO` `arcade-assistido-v6`, 3 525 passos (136 trechos), `VALID`, `lapMs` 29 369; `REALISTA_ALUGUEL_4T` `realista-aluguel-4t-v4`, 5 272 passos (112 trechos), `VALID`, `lapMs` 43 932 (inalterado); `trackVersion` 2; `finalKart.telemetry` com `barrierTouching`/`barrierContact` nas duas execuções
- capacidade de falha (cópia no rascunho, sobre o fixture regravado): sem mutação, `tests/modelo-kart-01-contract.test.ts` 16/16; com `SOLVER_SUBSTEPS` 4 → 5 em `src/physics.ts` (STEP e `Input` intactos), 15/16 — reprova CHK-TEST-0004-13 (`DETERMINISM` `differingRunCount` 2, `NON_DETERMINISTIC`); CHK-TEST-0004-09 continua `RENDER_NEUTRAL` `checkStepCount` 3 525 (reprodução da volta gravada, não da árvore); cópia e junção de `node_modules` removidas, árvore do repositório intacta
- atrito: 59 → 59 por arquivo; 0 migrados, 0 removidos; nenhuma verificação ausente
- ADR-0004 decisão 4 / DM-0001: o leitor continua recusando `setupVersion` diferente do publicado; CHK-TEST-0004-14 executada e aprovada com a cópia `arcade-assistido-v4`

## Failures

Nenhuma.

## Issues

### ISSUE-09
- severity: error
- check: T2
- status: new
- where: `99-traceability.md` (54 linhas, nenhuma para os critérios abaixo); TEST-0003, TEST-0004 1.2.0; estratégia 1.6.0 linhas 122, 126-129
- defect: AC-US-0003-14, AC-US-0005-04, AC-US-0005-05, AC-US-0005-06 e AC-US-0005-07 (requisitos revalidados contra o seed rev 4, `221dd74`) não têm linha de rastreabilidade nem verificação; os níveis `camera` (U/I/C), `contract` (C) e `model` (I) que a estratégia lhes atribui não existem.
- expected: verificações conforme a estratégia 1.6.0 — AC-US-0003-14 em `tests/modelo-kart-01-camera.test.ts`, ausência de indicação de drift e de jato/`exhaustOutlet` (AC-US-0005-04/-05), CHK-TEST-0004-06 modificada para a situação de marca de pneu (AC-US-0005-06/-07, quatro condições, `>` estrito), com linha de migração em `97-changelog.md`; as que reprovarem contra a árvore atual são FAIL CODE (divergências DIV-23..27), nunca afrouxadas; ADR-0003 decisão 6.2/6.3 coloca essa migração na mesma rodada de código que a regravação.

### ISSUE-10
- severity: error
- check: T2
- status: new
- where: CHK-TEST-0003-09 (`tests/modelo-kart-01-camera.test.ts:183`, AC-US-0003-09); CHK-TEST-0001-19 (`tests/modelo-kart-01-model.test.ts:261`, AC-US-0005-02); CHK-TEST-0004-05 (AC-US-0005-02); CHK-TEST-0004-06 (AC-US-0005-03, `tricks.drifting`); `sources:` de TEST-0003 e TEST-0004; linhas 53, 60-62 de `99-traceability.md`
- defect: as verificações decidem critérios que o seed rev 4 retirou (turbo no campo de visão, jato preso a `anchors.exhaustOutlet`, condição de drift das marcas) e fixam comportamento que AC-US-0003-04 e AC-US-0005-05 agora proíbem (`turboFovDeltaDeg`/`baseVerticalFovDeg` em `CameraView`, nó `escapamentoSaida`); a entrada da rodada 3 de `97-changelog.md` declara todas `carried`.
- expected: conforme "Verificações existentes" da estratégia 1.6.0 — as verificações dos critérios retirados saem (migração registrada em `97-changelog.md`) e CHK-TEST-0004-06 é modificada para AC-US-0005-06/-07; a rastreabilidade só cita critérios do seed rev 4.

### ISSUE-01
- severity: warning
- check: T3
- status: carried (inalterado; `tests/modelo-kart-01-contract.test.ts` não mudou)
- where: `tests/modelo-kart-01-contract.test.ts` CHK-TEST-0004-01..06 (`assert.match`/`doesNotMatch`)
- defect: as expressões regulares fixam o texto de `src/main.ts` e `src/kart01Decals.ts` (I9).
- expected: manter as afirmações estáveis e afrouxar as que fixam nomes e forma; não bloqueia.

### ISSUE-02
- severity: info
- check: T3
- status: carried (inalterado; arquivo sorteado, linhas 143-144)
- where: `tests/modelo-kart-01-model.test.ts:143-144` CHK-TEST-0001-09
- defect: `meshCount === 27` e `drawCallCount === 27` além de `≤ 30`.
- expected: 27 é valor nomeado pela estratégia (D-TS-03); manter.

### ISSUE-03
- severity: info
- check: T3
- status: carried (inalterado; linha 246)
- where: `tests/modelo-kart-01-model.test.ts:246` CHK-TEST-0001-17
- defect: `steer.position.y ≈ diameterM / 2` compara duas leituras da mesma constante.
- expected: `toCm(min.y) === 0` e `min.y ≥ 0` (linhas 244-245) decidem o critério; nada a mudar.

### ISSUE-04
- severity: info
- check: T4
- status: carried (inalterado)
- where: CHK-TEST-0001-17; `98-divergences.md`, AC-US-0002-05
- defect: "`min.y` 0" lido ao centímetro.
- expected: interpretação registrada; nenhum feedback devido.

### ISSUE-05
- severity: info
- check: T3
- status: carried (inalterado)
- where: `tests/modelo-kart-01-camera.test.ts` CHK-TEST-0003-08
- defect: câmera rígida em relação ao kart; o laço de 245 quadros repete uma configuração relativa.
- expected: a verificação pode falhar; nada a mudar.

### ISSUE-06
- severity: info
- check: T3
- status: carried (inalterado)
- where: `tests/modelo-kart-01-pose.test.ts:44` CHK-TEST-0002-02/-03
- defect: igualdade estrita de ponto flutuante `spinRevs === expectedSpinRevs`.
- expected: exata por construção (60 × STEP = 0,5); manter.

### ISSUE-07
- severity: info
- check: T1
- status: carried (aplicado nesta rodada)
- where: `reports/junit-latest.xml`
- defect: ids `CHK-TEST-00nn-nn` repetem-se entre features na mesma execução.
- expected: atrito contado pelo atributo `file` (`tests/modelo-kart-01-*.test.ts`: 19 + 10 + 14 + 16 = 59).

### ISSUE-08
- severity: info
- check: T3
- status: closed
- where: `tests/helpers/kart01Report.ts` `recordedFieldsOf`; CHK-TEST-0004-13
- defect: campos acrescentados ao `State` depois de `b86b200` não eram comparados.
- expected: resolvido pela regravação em `a361c9c` — `barrierTouching`/`barrierContact` gravados nas duas execuções e decididos por CHK-TEST-0004-13.

## Divergences

DIV-01..09, DIV-11..15 e DIV-18..22 carried, inalteradas desde a rodada 2 (registro humano / revisão de código). DIV-10 (AC-US-0003-09), DIV-16 (AC-US-0005-02) e DIV-17 (AC-US-0005-03) deixam de valer com os critérios retirados (ISSUE-10). Novas, devidas à etapa de código (conventions §6; não contribuem para o veredito):

### DIV-23
- criterion: AC-US-0005-06
- requires: trecho novo de marca sob cada pneu traseiro em todo quadro com passo novo, `RUNNING`, `speedMps` > 6 e `sideslipRad` > 0,055
- code today: `src/main.ts:554` exige `tricks.drifting`, sempre falso com `arcade-assistido-v6`; nenhuma marca é desenhada
- owed by: code-loop (ADR-0003 decisão 6.1/6.2)

### DIV-24
- criterion: AC-US-0005-07
- requires: nenhum trecho novo sem passo novo, fora de `RUNNING` ou abaixo dos limites, sem cadência
- code today: `src/main.ts:147,555` cadência `SKID_STEP_INTERVAL` 5 e condição por `state.speed`/`state.telemetry.sideslip`
- owed by: code-loop

### DIV-25
- criterion: AC-US-0005-05
- requires: nenhum jato/fumaça de turbo; `anchors` só `bumperPlate`
- code today: `src/main.ts:149-156,550-551` jato `ConeGeometry` em `anchors.exhaustOutlet` lendo `.boost`; `src/kart01Model.ts:526-530,539` nó `escapamentoSaida`
- owed by: code-loop

### DIV-26
- criterion: AC-US-0005-04
- requires: nenhuma indicação de drift; `src/main.ts` sem `.drifting`
- code today: `src/main.ts:548,554` lê `state.maneuvers` e `tricks.drifting`
- owed by: code-loop

### DIV-27
- criterion: AC-US-0003-14
- requires: no treino, câmera em pose de corrida sobre o kart em movimento depois do fim da volta
- code today: voltas seguidas no treino dependem de `race-lap-validation` (REQ-FEAT-0003-16, divergência registrada no D-Spec)
- owed by: code-loop de `race-lap-validation`, depois code-loop desta feature
