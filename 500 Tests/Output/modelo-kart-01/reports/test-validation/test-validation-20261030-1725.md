---
stage: test
feature: modelo-kart-01
verdict: FAIL TEST
generated: 2026-10-30T17:34:32Z
run: {collected: 441, passed: 441, failed: 0, skipped: 0, fresh: true}
counts: {blocker: 0, error: 1, warning: 2, info: 8, divergence: 24}
checks: {before: 59, after: 64, migrated: 6, removed: 3}
seed: {revision: 4, digest: 4e9bfbba6294}
round: 4
mode: B
previous-report: reports/test-validation/test-validation-20261030-1453.md
upstream: {strategy: test-strategy.md 1.6.0, code-report: code-validation-20261030-1655 (SUCCESS)}
run-artifacts: {junit: reports/junit-latest.xml, log: reports/npm-test-latest.log, measured: 2026-10-30T17:24:45Z, last-src-edit: src/main.ts 2026-10-30T16:46:48Z, last-test-edit: tests/modelo-kart-01-contract.test.ts 2026-10-30T17:13:50Z}
population: [ISSUE-01..10 do relatório anterior, TEST-0001 1.1.0, TEST-0003 1.1.0, TEST-0004 1.3.0, 97-changelog 1.2.0, 98-divergences 1.2.0, tests/helpers/kart01Report.ts, tests/modelo-kart-01-{model,camera,contract}.test.ts, TEST-0002 (não tocado, sorteado), tests/modelo-kart-01-pose.test.ts (não tocado, sorteado)]
feedbacks: []
---

# Relatório de validação de testes — modelo-kart-01, rodada 4 (Modo B, seed rev 4)

## Verification status

- critérios do seed rev 4: 49 (42 AC + 7 NFR); verificados em `npm test`: 25; metade automatizável provada e metade de tela `unverified`: 20 (DIV-01..09, -11..-15, -18, -28..-32); só no aparelho: 4 (DIV-19..22); sem nenhuma verificação: 0; cobertos só por skip: 0
- AC-US-0003-14: níveis U e I provados (CHK-TEST-0003-15/-16); nível C da estratégia ausente (ISSUE-11)
- execução: `ℹ tests 441 · pass 441 · fail 0 · skipped 0`; desta feature, por atributo `file` de `junit-latest.xml`: `-model` 20, `-pose` 10, `-camera` 15, `-contract` 19 = 64, 0 `failure`, 0 `skipped`
- frescor: `junit-latest.xml` 17:24:45Z, posterior à última edição de `src/` (16:46:48Z) e de `tests/` (17:13:50Z); `find src tests tracks scripts index.html package.json -newer junit-latest.xml` vazio; `src/`, `scripts/`, `tracks/` sem alteração local contra `HEAD` (`1254443`)
- portão determinístico: `lint_artifacts.py --stage test` 0 erros, 0 avisos
- atrito: 59 → 64; removidas CHK-TEST-0003-09, -0001-19, -0004-05, cada uma com linha de migração em `97-changelog.md` citando a decisão do dono do produto (`DOMAIN.md` 2026-10-29 "Sem efeito de turbo na câmera" → AC-US-0003-09 retirado; 2026-10-29 "Treino contínuo e fim do drift e do turbo", `DOMAIN/DEC-07` → AC-US-0005-02 retirado); modificadas 6 (0003-04, -05, -06, -10, 0004-06, -09); novas 8 (0001-20/-21, 0003-15/-16, 0004-17..-20); nenhuma ausente sem registro
- decisão real das marcas: `tyreMarkRunner` transpila o `if` de `src/main.ts:582-610` como está e o executa sobre `LapSession` reais, `getLapState`/`getHandlingTelemetry`/`simWheelGroundPositions` reais e uma `InstancedMesh` real; o oráculo de CHK-TEST-0004-06 usa os literais do critério (> 6, > 0,055), não os do código
- limites: 6 m/s e 0,055 rad dos dois lados — pelos quadros dirigidos (faixas 5,5–6 / 6–6,5 m/s e 0,05–0,055 / 0,055–0,06 rad, com e sem trecho, derrapagem positiva e negativa, CHK-TEST-0004-06) e pelo valor exato (nenhum trecho) e exato + 1e-6 para fora (2 trechos) em 6 m/s, +0,055 e −0,055 rad (CHK-TEST-0004-19)
- sem marcas: `COUNTDOWN` (todos os passos, comandos plenos), `PAUSED`, `ENDED` pelo jogador, por reposicionamento e pela volta oficial completa, sem volta (CHK-TEST-0004-20); quadros sem passo (quadros de 0 passos da varredura; 3 quadros repetidos em CHK-TEST-0004-19)
- capacidade de falha: 18 tentativas registradas em `reports/mutation-trials-20261030-r4.txt`, todas reprovadas por ao menos uma verificação nova ou modificada; reprodução independente em cópia no rascunho (junção removida, árvore intacta): V1 `speedMps > 6` → `> 7` reprova CHK-TEST-0004-06 e -19; V2 limite movido para constante de módulo `SKID_MIN_SPEED_MPS = 6` (mesmo comportamento) reprova o arquivo inteiro no carregamento (`ReferenceError`, ISSUE-12); V3 `decideCameraMode` devolvendo `RACE_CHASE` para `TRAINING` em `COUNTDOWN` passa 15/15 (ISSUE-11)
- velocidade máxima dos acertos (medida, `step` com aceleração plena por 90 s em `TEST_PAD`): `arcade-assistido-v6` 19,25 m/s, `realista-aluguel-4t-v4` 18,99 m/s; volta do piloto automático na pista sintética: 10,51 / 10,23 m/s

## Failures

Nenhuma.

## Issues

### ISSUE-11
- severity: error
- check: T2
- status: new
- where: estratégia 1.6.0 linhas 113 e 122 (nível C de AC-US-0003-04 e AC-US-0003-14); `tests/modelo-kart-01-camera.test.ts`, `tests/modelo-kart-01-contract.test.ts`; `97-changelog.md` rodada 4 "Itens declinados"
- defect: o nível C que a estratégia atribui não tem verificação — `src/gameCamera.ts` sem `lapKind` (AC-US-0003-14); `src/gameCamera.ts`/`src/main.ts` sem `baseVerticalFovDeg`, `src/gameCamera.ts` sem importar `src/maneuvers.ts` nem o tipo `Input`, e a chamada de `computeCameraView` em `src/main.ts` com exatamente `lapState`, `kartPose`, `viewWidthPx`, `viewHeightPx`, `trackBounds` (AC-US-0003-04); a mutação V3 (câmera dependente de `lapKind` na contagem do treino) passa 15/15, e o changelog não declina esses itens.
- expected: as afirmações de nível C da estratégia para AC-US-0003-04 e AC-US-0003-14 existem (em CHK-TEST-0003-04/-15 ou em verificações novas, com linha de migração) e reprovam V3; ou cada uma é declinada em `97-changelog.md` com o motivo.

### ISSUE-12
- severity: warning
- check: T3
- status: new
- where: `tests/helpers/kart01Report.ts` `tyreMarkBlockOf`/`tyreMarkRunner`; `tests/modelo-kart-01-contract.test.ts:59-77` (`sweep` calculado no carregamento do módulo)
- defect: a execução do bloco é fiel, mas depende da forma do código — o primeiro `if` depois de `lastSkidStepCount = 0` cuja condição o lê, só os nomes do escopo montado pelo helper, `pose` refeito como `getKartPose(lap?.kart)` (o `main.ts` usa `lap?.kart ?? idleKart`); uma refatoração neutra (V2, limite em constante de módulo) derruba o arquivo inteiro no carregamento e as 19 verificações viram 1 falha de arquivo; nunca dá falso verde (V1, M01–M04).
- expected: uma falha de extração reprova só as verificações de marca (varredura preguiçosa dentro delas), com mensagem que diga que o bloco mudou de forma; os limites continuam decididos pela execução.

### ISSUE-13
- severity: info
- check: T3
- status: new
- where: CHK-TEST-0004-19; `98-divergences.md` (interpretação AC-US-0005-06/-07)
- defect: o estado no limite exato é forjado com `seedLap` (cópia do passo dirigido com um campo alterado), contra "nenhum estado é forjado" da estratégia linha 129.
- expected: interpretação registrada; usa só o `LapSession` público, sem superfície de teste em `src/`; é a única verificação que separa `>` de `>=` (M01, M02); manter.

### ISSUE-14
- severity: info
- check: T2
- status: new
- where: CHK-TEST-0003-04; `98-divergences.md` (interpretação AC-US-0003-04)
- defect: "velocidades de 0 a mais de 25 m/s" da estratégia não é alcançável; a divergência diz "nenhum acerto publicado passa de 16 m/s ali" (pista sintética), e no `TEST_PAD` aberto os acertos chegam a 19,25 / 18,99 m/s.
- expected: interpretação confirmada (25 m/s fora do alcance de qualquer acerto publicado; a câmera é função da pose e `moving(25)` cobre 25 m/s); nada a mudar.

### ISSUE-09
- severity: error
- check: T2
- status: closed
- where: `99-traceability.md` linhas de AC-US-0003-14, AC-US-0005-04..07
- defect: critérios sem verificação.
- expected: resolvido — CHK-TEST-0003-15/-16, -0001-20/-21, -0004-06, -17..-20 executadas e aprovadas; nível C restante em ISSUE-11.

### ISSUE-10
- severity: error
- check: T2
- status: closed
- where: CHK-TEST-0003-09, -0001-19, -0004-05, -0004-06; `sources:` de TEST-0001/0003/0004
- defect: verificações de critérios retirados.
- expected: resolvido — três removidas com a decisão do dono do produto citada e mapeadas aos critérios retirados (AC-US-0003-09, AC-US-0005-02); CHK-TEST-0004-06 modificada de AC-US-0005-03 para AC-US-0005-06; `sources:` e rastreabilidade só com critérios do seed rev 4.

### ISSUE-01
- severity: warning
- check: T3
- status: carried (ampliado: CHK-TEST-0004-17/-18 acrescentam expressões sobre `src/main.ts`, `src/kart01Model.ts`, `index.html`)
- where: `tests/modelo-kart-01-contract.test.ts` CHK-TEST-0004-01..04, -17, -18
- defect: as expressões regulares fixam o texto das fontes (I9).
- expected: manter as afirmações de ausência; afrouxar as que fixam nomes e forma; não bloqueia.

### ISSUE-02
- severity: info
- check: T3
- status: carried (inalterado)
- where: `tests/modelo-kart-01-model.test.ts` CHK-TEST-0001-09
- defect: `meshCount === 27` e `drawCallCount === 27` além de `≤ 30`.
- expected: valor nomeado pela estratégia (D-TS-03); manter.

### ISSUE-03
- severity: info
- check: T3
- status: carried (inalterado)
- where: `tests/modelo-kart-01-model.test.ts` CHK-TEST-0001-17
- defect: `steer.position.y ≈ diameterM / 2` compara duas leituras da mesma constante.
- expected: `min.y` decide o critério; nada a mudar.

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
- defect: câmera rígida em relação ao kart; o laço repete uma configuração relativa.
- expected: a verificação pode falhar; nada a mudar.

### ISSUE-06
- severity: info
- check: T3
- status: carried (inalterado; arquivo sorteado)
- where: `tests/modelo-kart-01-pose.test.ts:44` CHK-TEST-0002-02/-03
- defect: igualdade estrita de ponto flutuante `spinRevs === expectedSpinRevs`.
- expected: exata por construção; manter.

### ISSUE-07
- severity: info
- check: T1
- status: carried (aplicado nesta rodada)
- where: `reports/junit-latest.xml`
- defect: ids `CHK-TEST-00nn-nn` repetem-se entre features na mesma execução.
- expected: atrito contado pelo atributo `file` (20 + 10 + 15 + 19 = 64).

### ISSUE-08
- severity: info
- check: T3
- status: closed (desde a rodada 3)
- where: `tests/helpers/kart01Report.ts` `recordedFieldsOf`
- defect: campos novos do `State` não comparados.
- expected: resolvido em `a361c9c`.

## Divergences

DIV-01..09, DIV-11..15 e DIV-18..22 carried, inalteradas. DIV-23..27 encerradas: o código da rodada 3 satisfaz AC-US-0005-04..07 e AC-US-0003-14 (CHK-TEST-0004-06, -17..-20, CHK-TEST-0003-16 aprovadas). Novas (metade de tela, registro humano em `98-divergences.md`):

### DIV-28
- criterion: AC-US-0003-14
- requires: câmera vista na tela seguindo o kart depois da linha de chegada do treino
- code today: decidido só em `npm test` (CHK-TEST-0003-15/-16)
- owed by: E2E-02 (registro humano)

### DIV-29
- criterion: AC-US-0005-04
- requires: nenhuma indicação de drift na tela, antes da largada e em corrida, com todos os comandos
- code today: decidido só em `npm test` (CHK-TEST-0001-20, -0004-17)
- owed by: E2E-05 (registro humano)

### DIV-30
- criterion: AC-US-0005-05
- requires: nenhuma fumaça ou chama de turbo na tela
- code today: decidido só em `npm test` (CHK-TEST-0001-21, -0004-18)
- owed by: E2E-05 (registro humano)

### DIV-31
- criterion: AC-US-0005-06
- requires: trechos vistos sob cada pneu traseiro ao escorregar de lado
- code today: decidido só em `npm test` (CHK-TEST-0004-06)
- owed by: E2E-05 (registro humano)

### DIV-32
- criterion: AC-US-0005-07
- requires: nenhum trecho novo na reta, na visão geral, na contagem, na pausa e depois do fim da volta oficial, na tela
- code today: decidido só em `npm test` (CHK-TEST-0004-06, -19, -20)
- owed by: E2E-05 (registro humano)
