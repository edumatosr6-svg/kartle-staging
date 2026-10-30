---
stage: test
feature: race-lap-validation
verdict: SUCCESS
generated: 2026-10-30T16:07:00Z
run: {collected: 432, passed: 422, failed: 10, skipped: 0, fresh: true, feature: {collected: 179, passed: 179, failed: 0, skipped: 0}}
counts: {blocker: 0, error: 0, warning: 2, info: 12, divergence: 39}
seed: {revision: 3, digest: beee272fdb3b}
upstream: {stage: code, report: code-validation-20261030-1526}
checks: {before: 140, after: 179, migrated: 0, removed: 0}
feedbacks: []
---

# Relatório de validação de testes — race-lap-validation (rodada 5, Modo B: treino de voltas seguidas, seed rev 3)

## Verification status

- criteria verified: 72 de 111 (65 `AC-US-*` de 99 e 7 `NFR-*` de 12) — decididos por `npm test`; as 179 verificações `CHK-TEST-*` desta feature executaram e passaram.
- contagem: 99 `AC-US-*` (72 anteriores + 27 de US-0010) e 12 `NFR-*`; 39 com metade de tela/aparelho/navegador pendente (27 das rodadas 1 a 4 + 12 de US-0010: AC-US-0010-02, -04, -07, -11, -12, -15, -16, -19, -23, -24, -25, -27), cada um com a metade de simulação provada em `npm test` (salvo NFR-0003 e NFR-0008); 111 − 39 = 72 verificados.
- unverified: 39 — ver Divergences.
- covered only by a skip: 0.
- US-0010: os 27 critérios têm ao menos uma verificação que os nomeia na mensagem (CHK-TEST-0015-01 a -28; CHK-TEST-0012-14 a -17; CHK-TEST-0010-19 a -24); AC-US-0010-16 decidido por CHK-TEST-0012-15, -16 e CHK-TEST-0010-24 (aceitação/recusa de `endTraining` e rótulo), tela em E2E-12.
- invariantes da volta oficial: AC-US-0010-21 (CHK-TEST-0015-21: concluída e cortada, 600 passos + novo cruzamento, 1 resultado, `lapSequenceCount` 1, sem campos de treino), AC-US-0010-22 (CHK-TEST-0015-22: `kart` igual por 600 passos com aceleração), I7 (CHK-TEST-0015-04, -09; CHK-TEST-0012-17); TEST-0005 (sorteado) e as demais suítes oficiais inalteradas e aprovadas.
- população (§8): issues ISSUE-01 a -15 do relatório `test-validation-20261027-2130` re-verificadas; arquivos com `version:` movida: TEST-0004 1.0.1, TEST-0007 1.1.0, TEST-0010 1.1.0, TEST-0012 1.2.0, TEST-0013 1.1.0, TEST-0015 1.0.0 (novo), `97-changelog.md` 1.4.0, `98-divergences.md` 1.2.0 e os cinco arquivos de teste com diff contra `HEAD` (`contract`, `kinds`, `layering`, `messages`, `state`); helpers e fixtures sem diff; sorteados (`shuf`): TEST-0005 (`validity.test.ts`) e TEST-0011 (`hud-css.test.ts`), sem diff desde 2026-10-21, nenhuma finding.
- T1: `junit-latest.xml` e `npm-test-latest.log` gravados em 2026-10-30T15:53:21Z; última edição em `tests/` 15:50:04Z (`state.test.ts`) e em `src/` 15:11:50Z (`main.ts`, `style.css`); `find src tests scripts index.html -newer junit-latest.xml` vazio — fresca. Totais `ℹ`: tests 432, pass 422, fail 10, cancelled 0, skipped 0, todo 0. Redução por script (`xml.etree`, só contagens e ids): 432 `<testcase>`, 10 com `<failure>`, todos fora desta feature (`pista-kart-park-lap` CHK-TEST-0005-01/-02/-03/-04/-06/-08/-10, `pista-kart-park-session` CHK-TEST-0007-05, `pista-kart-park-determinism` CHK-TEST-0006-03, `dirigibilidade-setup-version` CHK-TEST-0008-03), conferindo com a lista declarada e com o relatório de código; 179 casos nos 14 arquivos `race-lap-validation-*`, 179 ids únicos, igual aos 179 títulos `test('CHK-TEST-…')` e aos 179 ids de `99-traceability.md`. Sem flake: as três reprovações desta feature na execução do estágio de código (CHK-TEST-0012-01, -0010-17, -0007-10) seguiram mudança de fonte e de projeto (ADR-0006).
- atrição: `HEAD:99-traceability.md` (rodada 4) 140 ids; árvore 179; removidos 0; acrescentados 39 (CHK-TEST-0010-19..24, 0012-14..17, 0013-05, 0015-01..28); modificados 3; `97-changelog.md` 1.4.0 ("140 antes, 179 depois… 0 removidos, 39 acrescentados") confere.
- T3 sobre as modificadas: CHK-TEST-0012-01 reprova se `getLapState` perder `lapStartMs`/`lapSequenceCount` ou trouxer `bestValidLapMs` fora do treino (M14); CHK-TEST-0010-17 reprova com 23 ou 25 chaves, sem uma das quatro novas ou com menos de 22 traduções reais (M24); CHK-TEST-0007-10 reprova se um resultado em dado `INCOMPLETE` (sem marcadores; sem setores) for oficial, se o treino não fechar duas voltas na chegada ou se a versão diferir da leitura (M02, M19).
- T3 sobre as acrescentadas (amostra que cobre os 27 critérios, lida por inteiro em `state.test.ts:267-824`, `contract.test.ts:189-267`, `messages.test.ts:159-233`, `layering.test.ts:59-65`): dirigem a simulação real (`stepLap` sobre `step`, `autopilot()`, `seedLap`, corte semeado, salto semeado); instantes esperados vêm de oráculos próprios (`finishOracle` com `crossLine`/`interpolateMs`; corte por `beyondEdgeM` > 3 m por > 1000 ms), nunca de `lapStartMs` da sessão; textos esperados da tabela de DES-0008 1.1.0 (linhas 61-68); tempos inteiros em ms; corridas compartilhadas memorizadas e não mutadas; nenhuma leitura de relógio, rede ou ordem de teste; toda asserção nomeia o critério. Guardas de fixture (`throw new Error('fixture: …')`, asserções "the fixture must…") impedem vacuidade (ex.: -14 exige a volta inválida mais curta que a válida; -22 exige kart em movimento no encerramento).
- mutações: 32 registradas em `97-changelog.md` 1.4.0, cada verificação acrescentada ou modificada reprovada por ao menos uma; reproduzidas por este validador numa cópia em diretório de rascunho (árvore intocada, `git diff HEAD -- src` vazio): M01 (`lapStartMs: finishMs + 1`, `src/lap.ts:361`) reprova exatamente CHK-TEST-0015-01, -02, -03, -06, -11, -12, -20; M04 (melhor volta conta inválidas, `:272`) reprova -14 e -27; M05 (melhor volta mantida em `ENDED`, `:269`) reprova só -27 — iguais à tabela.
- T4: nenhuma verificação desta feature reprovou; as 10 reprovações são de suítes de outras features (ISSUE-18).
- T5: idempotência com o mesmo pedido repetido — `endTraining` segundo → `LAP_ENDED` com a sessão intacta (CHK-TEST-0015-18, CHK-TEST-0012-15), `PAUSE_BUTTON` segundo → `ALREADY_PAUSED` (CHK-TEST-0012-15); precedência de API-0002 1.2.0 nos dois sentidos (aceito em contagem, corrida e pausa — CHK-TEST-0012-16; recusado em oficial/reconhecimento/encerrado — CHK-TEST-0012-15); RBAC, migração, offline e token não se aplicam (ISSUE-07).

## Failures

Nenhuma nesta feature.

## Issues

### ISSUE-01
- severity: warning
- check: T3
- file: `tests/race-lap-validation-contract.test.ts`
- location: linha 115, CHK-TEST-0012-07
- finding: mantida (arquivo tocado nesta rodada, linha inalterada): `getLapState(paused.lap).toString()` comparado consigo mesmo nunca falha; a verificação decide AC-US-0003-08 pelas demais asserções.
- expected: a asserção compara duas leituras por `deepEqual` ou é removida.

### ISSUE-02
- severity: warning
- check: T3
- file: `tests/race-lap-validation-crossing.test.ts`, `tests/race-lap-validation-state.test.ts`
- location: `crossing` linha 30 (CHK-TEST-0002-03); `state` linhas 64-67 (CHK-TEST-0004-04) e bloco TEST-0004 (CHK-TEST-0004-15)
- finding: mantida: igualdade exata sobre ponto flutuante que a especificação exige exato, sem comentário fixando que o valor exato é o contrato; os novos `deepEqual` de `kart` em CHK-TEST-0015-18, -22 e -28 são prescritos pela estratégia (linhas AC-US-0010-18, -22; NFR-0001) e não ampliam a issue.
- expected: tolerância explícita ou comentário fixando que o valor exato é o contrato.

### ISSUE-03
- severity: info
- check: T3
- file: `tests/race-lap-validation-frozen.test.ts`
- location: linha 59, CHK-TEST-0014-05
- finding: mantida: fixa literalmente a linha 3 de `src/physics.ts` (tocado em 2026-10-30T13:42Z por outra feature, linha 3 idêntica); reformatação sem mudança de comportamento a faria falhar.
- expected: nenhuma ação nesta rodada; registrado para a próxima revisão de DES-0012.

### ISSUE-06
- severity: info
- check: T1
- file: `500 Tests/Output/race-lap-validation/98-divergences.md` 1.2.0; `docs/lap-validation-device-log.md`
- location: níveis Web E2E e Mobile E2E (E2E-01 a E2E-13)
- finding: mantida e ampliada: o registro humano não muda desde 2026-10-21T16:47Z; os novos roteiros E2E-12 e E2E-13 (treino de voltas seguidas, pista sem setores) nunca executaram; níveis E2E declarados, não silenciosos.
- expected: execução humana de E2E-12 e E2E-13 e reconciliação de `98-divergences.md` com o registro, fechando só linhas cujo roteiro passou com entrada ou tela reais.

### ISSUE-07
- severity: info
- check: T5
- file: `500 Tests/Output/race-lap-validation/TEST-0012-contrato-da-volta.md` 1.2.0
- location: nota final
- finding: mantida: acesso não autenticado, papel recusado, migração up/down, offline e falha de token não se aplicam (sem endpoint, sessão, banco nem árvore móvel; `endTraining` é comando local de `player` anônimo).
- expected: nenhuma ação.

### ISSUE-10
- severity: info
- check: T3
- file: `tests/helpers/autopilot.ts`; `src/main.ts`
- location: `autopilot.ts:17` (`config: KartConfig = ARCADE_KART`)
- finding: mantida: a suíte roda com `ARCADE_KART` sem `setupId`/`setupVersion` (salvo CHK-TEST-0012-12/-13), a aplicação com o acerto publicado; nenhuma verificação vazia por isso.
- expected: nenhuma ação nesta rodada; fixture no acerto publicado entra pela estratégia ou por `SCOPE-BACKLOG.md`.

### ISSUE-11
- severity: info
- check: T3
- file: `tests/race-lap-validation-contract.test.ts`
- location: linha 20, `RESULT_OPTIONAL`; CHK-TEST-0012-02, linha 52
- finding: mantida: o arquivo foi tocado nesta rodada e `RESULT_OPTIONAL` continua sem `setupId` e `setupVersion` (API-0001); sem reprovação falsa porque as chaves percorridas vêm de resultados sem os campos.
- expected: a próxima rodada que tocar o arquivo acrescenta `setupId` e `setupVersion` a `RESULT_OPTIONAL`, sem alterar as asserções existentes.

### ISSUE-12
- severity: info
- check: T2
- file: `tests/race-lap-validation-layering.test.ts`; `src/main.ts`
- location: listas `SIMULATION`/`APPLICATION_PURE` (linhas 9-10), CHK-TEST-0013-03; `main.ts:3-20`
- finding: mantida: `main.ts` importa módulos de outras features (`audio`, `trackGeometry`, `trainingSession`, `trackScene`, `curbFeedback`, `kart01*`, `kartPose`, `gameCamera`) fora das listas; `grep` de rede e armazenamento em `src/` vazio; CHK-TEST-0013-05 acrescenta `document.cookie` só para `lap.ts`, `lapMessages.ts` e `main.ts`.
- expected: nenhuma ação nesta feature; as etapas de testes das features donas provam a ausência de rede e armazenamento nos seus módulos.

### ISSUE-13
- severity: info
- check: T4
- file: `300 Specs/330 D-Specs/Output/race-lap-validation/test-strategy.md` 1.2.1
- location: linha 216 (NFR-0012)
- finding: parcialmente resolvida: DES-0006 1.1.1 já não exige o sintético igual a `TRACK_SCHEMA_VERSION`, mas a linha NFR-0012 da estratégia ainda diz "declara `schemaVersion` igual a `TRACK_SCHEMA_VERSION`", em conflito com ADR-0001 de `pista-kart-park` (constante 3, sintético 2); CHK-TEST-0009-02 fiel a NFR-0012.
- expected: a próxima rodada do D-Spec troca, na linha 216, "igual a `TRACK_SCHEMA_VERSION`" por "maior que a da forma anterior e não maior que `TRACK_SCHEMA_VERSION`, lido pelo leitor".

### ISSUE-14
- severity: info
- check: T1
- file: `500 Tests/Output/race-lap-validation/reports/junit-latest.xml`
- location: atributo `file` dos `<testcase>`; ids `CHK-TEST-*` homônimos de `dirigibilidade`, `modelo-kart-01` e `pista-kart-park`
- finding: mantida: o junit da suíte inteira repete numeração `CHK-TEST-*` entre features (ex.: CHK-TEST-0005-01, -0007-05, -0008-03 reprovados são de outras features); a atrição e a atribuição de reprovações foram feitas pelo arquivo de cada caso.
- expected: nenhuma ação nesta feature; o validador compara por arquivo enquanto a convenção numerar `CHK-TEST-*` por feature.

### ISSUE-15
- severity: info
- check: T3
- file: `tests/race-lap-validation-track-data.test.ts`
- location: linha 44, CHK-TEST-0009-04
- finding: mantida (arquivo intocado): dois literais `2` de versão de esquema em entradas `UNREADABLE`, que não afirmam versão.
- expected: nenhuma ação obrigatória; a próxima rodada que tocar o arquivo pode derivá-los de `TRACK_SCHEMA_VERSION`.

### ISSUE-16
- severity: info
- check: T2
- file: `tests/race-lap-validation-state.test.ts`; `300 Specs/330 D-Specs/Output/race-lap-validation/test-strategy.md` 1.2.1; `tests/dirigibilidade-contract.test.ts`
- location: bloco TEST-0015 (linhas 267-824); estratégia linha 28 (`tests/lap-training.test.ts`); `dirigibilidade-contract.test.ts:164-165` (`suites.length === 14`)
- finding: desvio declarado e aceitável: as 28 verificações da área `lap-training` ficam num bloco isolado de `state.test.ts` (helpers próprios, nível integração, ids e oráculos da estratégia) porque um 15.º arquivo reprova CHK-TEST-0010-06 de `dirigibilidade` (confirmado na linha 165); a cobertura e o nível não mudam; o critério decidido é o mesmo.
- expected: a etapa de testes de `dirigibilidade` troca a contagem exata por "ao menos 14" ou por lista nominal; depois, esta feature move o bloco para `tests/race-lap-validation-training.test.ts`, e o D-Spec alinha o nome da linha 28 à convenção `tests/<slug>-<area>.test.ts`.

### ISSUE-17
- severity: info
- check: T3
- file: `tests/race-lap-validation-state.test.ts`; `300 Specs/330 D-Specs/Output/race-lap-validation/test-strategy.md` 1.2.1
- location: CHK-TEST-0015-12 e -13/-15 (`autopilot(4)`); estratégia linha 182 (AC-US-0010-10, `autopilot(-4)`)
- finding: desvio declarado e aceitável: em `tests/helpers/autopilot.ts` o deslocamento positivo é à esquerda e `withShortMarker(2)` estende o marcador de +1 m a −9 m (`tests/fixtures/trackFiles.ts:37`), logo `autopilot(-4)` cruza o marcador e não produz `MISSED_MARKER`; `autopilot(4)` é o que CHK-TEST-0005-07/-09/-10 já usam, e a verificação afirma `INVALID` `MISSED_MARKER` antes de julgar o instante, de modo que um sinal errado reprovaria em vez de passar vazio.
- expected: o D-Spec corrige o sinal para `autopilot(4)` na linha AC-US-0010-10 da estratégia numa próxima rodada.

### ISSUE-18
- severity: info
- check: T4
- file: `tests/pista-kart-park-lap.test.ts`, `tests/pista-kart-park-session.test.ts`, `tests/pista-kart-park-determinism.test.ts`, `tests/dirigibilidade-setup-version.test.ts`
- location: `pista-kart-park` CHK-TEST-0005-01, -02, -03, -04, -06, -08, -10, CHK-TEST-0007-05, CHK-TEST-0006-03; `dirigibilidade` CHK-TEST-0008-03
- finding: as 10 reprovações da execução são de outras features e esperam que a volta de treino termine na chegada ou no corte (ADR-0006 validado: só `endTraining` encerra o treino), classificadas como teste que supõe o treino de volta única pelo relatório `code-validation-20261030-1526`; fora do veredito desta feature; feedback não emitido por este validador (escrita restrita a relatório e carimbos nesta execução).
- expected: o loop encaminha às etapas de testes de `pista-kart-park` e `dirigibilidade`, que ajustam as suas verificações a ADR-0006 sem enfraquecê-las.

## Divergences

Linhas de `98-divergences.md` 1.2.0 com estado `unverified`, julgadas legítimas (a parte pendente exige tela, aparelho, taxa de quadros ou navegador; a metade de simulação está provada); não contribuem para o veredito. Quem deve: execução humana do roteiro e reconciliação (ISSUE-06). Os dois desvios de estratégia são ISSUE-16 e ISSUE-17.

| Id | Provado em `npm test` | Pendente (roteiro) |
|---|---|---|
| AC-US-0001-02 | CHK-TEST-0010-01 | E2E-01 |
| AC-US-0001-03 | CHK-TEST-0010-02 | E2E-01 |
| AC-US-0001-09 | CHK-TEST-0011-01 | E2E-01 |
| AC-US-0001-10 | CHK-TEST-0011-02 | E2E-01 |
| AC-US-0002-01 | CHK-TEST-0005-01 | E2E-02 |
| AC-US-0002-02 | CHK-TEST-0004-07 | E2E-02 |
| AC-US-0002-03 | CHK-TEST-0004-08 | E2E-02 |
| AC-US-0002-09 | CHK-TEST-0004-10 | E2E-02 |
| AC-US-0003-05 | CHK-TEST-0004-12 | E2E-03 |
| AC-US-0003-06 | CHK-TEST-0004-13 | E2E-04 |
| AC-US-0003-07 | CHK-TEST-0004-14 | E2E-05 |
| AC-US-0004-04 | CHK-TEST-0010-06 | E2E-02 |
| AC-US-0006-05 | CHK-TEST-0010-07, CHK-TEST-0006-10 | E2E-02 |
| AC-US-0007-02 | CHK-TEST-0010-08 | E2E-02 |
| AC-US-0008-01 | CHK-TEST-0007-06, CHK-TEST-0010-10 | E2E-02 |
| AC-US-0008-03 | CHK-TEST-0007-08 | E2E-06 |
| AC-US-0008-04 | CHK-TEST-0007-09 | E2E-06 |
| AC-US-0009-01 | CHK-TEST-0004-19, CHK-TEST-0012-01 | E2E-02 |
| AC-US-0009-04 | CHK-TEST-0010-13 | E2E-09 |
| AC-US-0009-07 | CHK-TEST-0010-16 | E2E-07 |
| AC-US-0009-08 | CHK-TEST-0011-03 | E2E-07 |
| AC-US-0009-09 | CHK-TEST-0011-04 | E2E-07 |
| NFR-0003 | — | E2E-10 |
| NFR-0004 | CHK-TEST-0013-03 | E2E-08 |
| NFR-0006 | CHK-TEST-0010-13, CHK-TEST-0011-03 | E2E-09 |
| NFR-0007 | CHK-TEST-0010-17 | E2E-07 |
| NFR-0008 | — | E2E-11 |
| AC-US-0010-02 | CHK-TEST-0015-24, CHK-TEST-0010-19 | E2E-12, E2E-13 |
| AC-US-0010-04 | CHK-TEST-0015-05, CHK-TEST-0010-22 | E2E-12 |
| AC-US-0010-07 | CHK-TEST-0015-10, CHK-TEST-0010-23 | E2E-12 |
| AC-US-0010-11 | CHK-TEST-0015-13, CHK-TEST-0010-23 | E2E-12 |
| AC-US-0010-12 | CHK-TEST-0015-06, CHK-TEST-0015-27, CHK-TEST-0010-24 | E2E-12 |
| AC-US-0010-15 | CHK-TEST-0015-16, CHK-TEST-0012-15, CHK-TEST-0012-16, CHK-TEST-0010-24 | E2E-12 |
| AC-US-0010-16 | CHK-TEST-0012-15, CHK-TEST-0012-16, CHK-TEST-0010-24 | E2E-12 |
| AC-US-0010-19 | CHK-TEST-0015-19 | E2E-12 |
| AC-US-0010-23 | CHK-TEST-0015-23, CHK-TEST-0010-20 | E2E-12 |
| AC-US-0010-24 | CHK-TEST-0015-24, CHK-TEST-0010-19 | E2E-12, E2E-13 |
| AC-US-0010-25 | CHK-TEST-0015-07, CHK-TEST-0010-19 | E2E-12 |
| AC-US-0010-27 | CHK-TEST-0015-25, CHK-TEST-0012-14, CHK-TEST-0010-21 | E2E-13 |
