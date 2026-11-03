---
stage: test
feature: race-lap-validation
verdict: SUCCESS
generated: 2026-11-03T17:43:41Z
run: {collected: 444, passed: 444, failed: 0, skipped: 0, fresh: true, build: e70aad9, feature: {collected: 179, passed: 179, failed: 0, skipped: 0}}
counts: {blocker: 0, error: 0, warning: 2, info: 12, divergence: 39}
seed: {revision: 3, digest: beee272fdb3b}
upstream: {stage: code, report: code-validation-20261030-1526}
checks: {before: 179, after: 179, migrated: 0, removed: 0}
feedbacks: []
---

# Relatório de validação de testes — race-lap-validation (rodada 6, re-validação no build e70aad9, ADR-0007 de pista-kart-park)

## Verification status

- criteria verified: 72 de 111 (65 `AC-US-*` de 99 e 7 `NFR-*` de 12) — decididos por `npm test`; as 179 verificações `CHK-TEST-*` desta feature executaram e passaram. Sem mudança contra a rodada 5.
- unverified: 39 — as mesmas linhas de `98-divergences.md` 1.2.0 (ver Divergences); cada uma com a metade de simulação provada, salvo NFR-0003 e NFR-0008.
- covered only by a skip: 0.
- build: `git diff --stat e70aad9 HEAD -- src index.html tests` vazio (HEAD `c4bb672`, commits posteriores só registros); entre `6b314b2` e `e70aad9` mudaram `src/main.ts` (`renderTrainingResult`, `renderResult`, um comentário), `index.html` (`#lap-training-result-credit` dentro de `#lap-training-result`; `#lap-result-credit` removido), `src/style.css` (uma regra `#lap-training-result-credit a`) e `tests/pista-kart-park-screens.test.ts`; nenhum arquivo `tests/race-lap-validation-*`, `tests/helpers/` ou `tests/fixtures/` mudou; nenhum artefato de requisitos, F-Spec, D-Spec ou código desta feature mudou desde `0c83ed9` (2026-10-30T12:27-03:00).
- T1: `junit-latest.xml` e `npm-test-latest.log` gravados em 2026-11-03T17:40:12Z; última edição em `src/`/`index.html` 2026-10-30T15:39-03:00; `find src tests scripts index.html -newer junit-latest.xml` vazio — fresca. Totais `ℹ`: tests 444, pass 444, fail 0, cancelled 0, skipped 0, todo 0. Redução por script (`xml.etree`, só contagens e ids): 444 `<testcase>`, 0 `<failure>`, 0 `<skipped>`; 179 casos nos 14 arquivos `race-lap-validation-*`, 179 ids únicos, iguais aos 179 ids de `99-traceability.md` (nenhum pendente, nenhum sem rastreio). ISSUE-18 da rodada 5 resolvida: as 10 reprovações de `pista-kart-park` e `dirigibilidade` não ocorrem mais.
- atrição: `6b314b2:99-traceability.md` 179 ids; esta execução 179; removidos 0; acrescentados 0; `97-changelog.md` sem entrada nova exigida.
- mudança em `renderTrainingResult`: o conteúdo do painel (validade, motivo, total, não oficial, setores) continua vindo de `describeTrainingResult` e do mesmo `items`, decidido nesta feature por CHK-TEST-0010-19 a -24 e CHK-TEST-0015-*; a troca de `panel.replaceChildren(...items)` por remoção dos filhos exceto o crédito + `credit.before(...items)` só altera a árvore DOM, que nenhuma verificação desta feature exercita (metade de tela em E2E-12 — ISSUE-19); a forma do código e do HTML é fixada por CHK-TEST-0009-04 e a escolha do crédito por resultado por CHK-TEST-0009-11 de `pista-kart-park`, ambas aprovadas nesta execução; CHK-TEST-0013-03/-05 (`main.ts` sem rede/armazenamento) e TEST-0011 (`style.css`) leram os arquivos alterados e passaram.
- população (§8): issues ISSUE-01 a -18 do relatório `test-validation-20261030-1559` re-verificadas; arquivos com `version:` movida: nenhum; sorteados (`shuf`): TEST-0006 (`cut.test.ts`) e TEST-0014 (`frozen.test.ts`), sem diff desde a rodada 5 — CHK-TEST-0006-01 reprova se o limite de 3 m/1000 ms ou o passo do corte mudar (oráculo próprio `cutOracle`), CHK-TEST-0014-03/-04 reprovam com qualquer valor de preset alterado; nenhuma finding nova.
- T4: nenhuma verificação reprovou.
- T5: inalterado da rodada 5 — idempotência de `endTraining` e `PAUSE_BUTTON` com o mesmo pedido repetido (CHK-TEST-0015-18, CHK-TEST-0012-15); RBAC, migração, offline e token não se aplicam (ISSUE-07).

## Failures

Nenhuma.

## Issues

### ISSUE-01
- severity: warning
- check: T3
- file: `tests/race-lap-validation-contract.test.ts`
- location: linha 115, CHK-TEST-0012-07
- finding: mantida (arquivo intocado): `getLapState(paused.lap).toString()` comparado consigo mesmo nunca falha; a verificação decide AC-US-0003-08 pelas demais asserções.
- expected: a asserção compara duas leituras por `deepEqual` ou é removida.

### ISSUE-02
- severity: warning
- check: T3
- file: `tests/race-lap-validation-crossing.test.ts`, `tests/race-lap-validation-state.test.ts`
- location: `crossing` linha 30 (CHK-TEST-0002-03); `state` linhas 64-67 (CHK-TEST-0004-04) e bloco TEST-0004 (CHK-TEST-0004-15)
- finding: mantida (arquivos intocados): igualdade exata sobre ponto flutuante que a especificação exige exato, sem comentário fixando que o valor exato é o contrato.
- expected: tolerância explícita ou comentário fixando que o valor exato é o contrato.

### ISSUE-03
- severity: info
- check: T3
- file: `tests/race-lap-validation-frozen.test.ts`
- location: linha 59, CHK-TEST-0014-05
- finding: mantida: fixa literalmente a linha 3 de `src/physics.ts`; reformatação sem mudança de comportamento a faria falhar.
- expected: nenhuma ação nesta rodada; registrado para a próxima revisão de DES-0012.

### ISSUE-06
- severity: info
- check: T1
- file: `500 Tests/Output/race-lap-validation/98-divergences.md` 1.2.0; `docs/lap-validation-device-log.md`
- location: níveis Web E2E e Mobile E2E (E2E-01 a E2E-13); registro "Execução no celular — 2026-10-30" (build `e70aad9`)
- finding: atualizada: o registro humano ganhou uma execução qualitativa no celular sobre `e70aad9` (relato do dono do produto; aparelho, navegador e fps não informados): corte invalida a volta (passa), voltas seguidas e crédito OSM no resultado "passa (pelo resumo)", sem observação específica; nenhum roteiro E2E-01 a E2E-13 foi executado como escrito; `98-divergences.md` não foi reconciliado com essa execução.
- expected: execução humana de E2E-12 e E2E-13 (e dos demais roteiros pendentes) e reconciliação de `98-divergences.md`, fechando só linhas cujo roteiro passou com entrada ou tela reais.

### ISSUE-07
- severity: info
- check: T5
- file: `500 Tests/Output/race-lap-validation/TEST-0012-contrato-da-volta.md` 1.2.0
- location: nota final
- finding: mantida: acesso não autenticado, papel recusado, migração up/down, offline e falha de token não se aplicam.
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
- finding: mantida: `RESULT_OPTIONAL` continua sem `setupId` e `setupVersion` (API-0001); sem reprovação falsa.
- expected: a próxima rodada que tocar o arquivo acrescenta `setupId` e `setupVersion` a `RESULT_OPTIONAL`.

### ISSUE-12
- severity: info
- check: T2
- file: `tests/race-lap-validation-layering.test.ts`; `src/main.ts`
- location: listas `SIMULATION`/`APPLICATION_PURE` (linhas 9-10), CHK-TEST-0013-03
- finding: mantida: `main.ts` importa módulos de outras features fora das listas; CHK-TEST-0013-03/-05 passaram sobre o `main.ts` de `e70aad9`.
- expected: nenhuma ação nesta feature.

### ISSUE-13
- severity: info
- check: T4
- file: `300 Specs/330 D-Specs/Output/race-lap-validation/test-strategy.md` 1.2.1
- location: linha 216 (NFR-0012)
- finding: mantida: a linha NFR-0012 ainda diz "declara `schemaVersion` igual a `TRACK_SCHEMA_VERSION`", em conflito com ADR-0001 de `pista-kart-park`; CHK-TEST-0009-02 fiel a NFR-0012.
- expected: a próxima rodada do D-Spec troca "igual a `TRACK_SCHEMA_VERSION`" por "maior que a da forma anterior e não maior que `TRACK_SCHEMA_VERSION`, lido pelo leitor".

### ISSUE-14
- severity: info
- check: T1
- file: `500 Tests/Output/race-lap-validation/reports/junit-latest.xml`
- location: atributo `file` dos `<testcase>`
- finding: mantida: ids `CHK-TEST-*` repetidos entre features; a contagem desta feature foi feita pelo arquivo de cada caso.
- expected: nenhuma ação nesta feature.

### ISSUE-15
- severity: info
- check: T3
- file: `tests/race-lap-validation-track-data.test.ts`
- location: linha 44, CHK-TEST-0009-04
- finding: mantida: dois literais `2` de versão de esquema em entradas `UNREADABLE`, que não afirmam versão.
- expected: nenhuma ação obrigatória.

### ISSUE-16
- severity: info
- check: T2
- file: `tests/race-lap-validation-state.test.ts`; `300 Specs/330 D-Specs/Output/race-lap-validation/test-strategy.md` 1.2.1; `tests/dirigibilidade-contract.test.ts`
- location: bloco TEST-0015; estratégia linha 28; `dirigibilidade-contract.test.ts:164-165`
- finding: mantida, desvio declarado e aceitável: as 28 verificações de `lap-training` seguem num bloco de `state.test.ts` por causa da contagem exata de suítes em `dirigibilidade`.
- expected: a etapa de testes de `dirigibilidade` troca a contagem exata por "ao menos 14" ou lista nominal; depois esta feature move o bloco para `tests/race-lap-validation-training.test.ts`.

### ISSUE-17
- severity: info
- check: T3
- file: `tests/race-lap-validation-state.test.ts`; `300 Specs/330 D-Specs/Output/race-lap-validation/test-strategy.md` 1.2.1
- location: CHK-TEST-0015-12 e -13/-15 (`autopilot(4)`); estratégia linha 182
- finding: mantida, desvio declarado e aceitável: a estratégia diz `autopilot(-4)`, que não produz `MISSED_MARKER` na fixture; a verificação usa `autopilot(4)` e afirma o motivo antes de julgar o instante.
- expected: o D-Spec corrige o sinal para `autopilot(4)` na linha AC-US-0010-10 da estratégia.

### ISSUE-19
- severity: info
- check: T2
- file: `src/main.ts`; `index.html`; `src/style.css`
- location: `main.ts:461-487` (`renderTrainingResult`); `#lap-training-result` / `#lap-training-result-credit`; regra `#lap-training-result[data-validity=INVALID] .lap-chip`
- finding: a mudança de ADR-0007 no painel `#lap-training-result` (DES-0008) não é exercitada por nenhuma verificação desta feature: a metade de tela do painel é E2E-12, já `unverified` em `98-divergences.md` (AC-US-0010-02, -04, -07, -11, -12, -23, -24, -25); a lógica que esta feature decide (texto e dados do resultado) não mudou e passou; a forma DOM é fixada estaticamente por CHK-TEST-0009-04 de `pista-kart-park`. O crédito (`lap-chip track-credit`) fica dentro do painel e recebe o fundo inválido da regra `[data-validity=INVALID] .lap-chip` numa volta inválida do Kart Park.
- expected: a próxima execução de E2E-12 olha o painel depois de ao menos duas voltas seguidas (uma válida, uma inválida) no Kart Park e confirma: título, total e setores redesenhados sem duplicar, crédito como último filho e legível; nenhuma ação de teste nesta rodada.

## Divergences

Linhas de `98-divergences.md` 1.2.0 com estado `unverified`, iguais às da rodada 5 e julgadas legítimas (a parte pendente exige tela, aparelho, taxa de quadros ou navegador; a metade de simulação está provada); não contribuem para o veredito. Quem deve: execução humana do roteiro e reconciliação (ISSUE-06).

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
