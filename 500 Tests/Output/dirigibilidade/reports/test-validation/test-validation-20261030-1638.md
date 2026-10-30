---
stage: test
feature: dirigibilidade
verdict: SUCCESS
generated: 2026-10-30T16:38:47Z
run: {collected: 436, passed: 427, failed: 9, skipped: 0, fresh: true}
feature-run: {collected: 65, passed: 65, failed: 0, skipped: 0}
counts: {blocker: 0, error: 0, warning: 2, info: 7, divergence: 12}
checks: {before: 61, after: 65, migrated: 0, removed: 0}
seed: {revision: 6, digest: dbf86f325606}
upstream: {stage: code, report: code-validation-20261030-1613, verdict: SUCCESS, strategy: test-strategy.md 6.1.0}
round: 3
previous: reports/test-validation/test-validation-20261030-1455.md
run-artifacts: {junit: reports/junit-latest.xml, log: reports/npm-test-latest.log, measured: 2026-10-30T13:35:14-03:00, last-input-edit: src/main.ts 13:10:02, src/style.css 13:09:55, tests/dirigibilidade-hud-text.test.ts 13:26:56, tests/fixtures/records.ts 13:24:14}
population: [ISSUE-01..10 da rodada 2, TEST-0007 1.2.0, TEST-0008 1.2.0, TEST-0010 1.2.0, 97-changelog.md 2.1.0, 98-divergences.md 2.1.0, tests/dirigibilidade-hud-text.test.ts, tests/dirigibilidade-setup-version.test.ts, tests/dirigibilidade-contract.test.ts, tests/fixtures/records.ts, CHK acrescentadas 0007-07..10, CHK modificadas 0008-03, 0008-05, 0010-06, sorteados intocados tests/dirigibilidade-speed.test.ts e tests/dirigibilidade-steer-response.test.ts]
feedbacks: []
---

# Relatório de validação de testes — dirigibilidade, rodada 3

## Verification status

- critérios: 46 (37 AC de US-0001..US-0005 em vigor no seed rev 6, inclusive AC-US-0003-12..15, + NFR-0001..0009)
- verificados em `npm test`: 34; verificados na metade automatizável e `unverified` na metade de tela, aparelho ou relógio: 12 (DIV-01..12); cobertos só por skip: 0; sem verificação: 0
- execução: `ℹ tests 436 / pass 427 / fail 9 / skipped 0 / cancelled 0`; junit 436 casos, 9 falhas, 0 skips; as 65 `CHK-TEST-*` de `tests/dirigibilidade-*.test.ts` presentes, únicas e aprovadas; `physics`, `maneuvers`, `race-lap-validation-*` (14) e `modelo-kart-01-*` aprovadas; as 9 reprovadas são de `pista-kart-park` (ISSUE-11)
- frescor: artefatos de 13:35:14 posteriores à última edição de `src/` (13:10:02), `index.html`, `scripts/`, `docs/`, `package.json` e de todo arquivo de teste (13:26:56); `find -newer` sobre essas árvores vazio
- atrito: 61 → 65; 0 removidas, 0 renomeadas, 4 acrescentadas (CHK-TEST-0007-07..10), 3 modificadas (CHK-TEST-0008-03, -0008-05, -0010-06), todas na tabela de migração do `97-changelog.md` 2.1.0
- AC-US-0003-12..15: decididos por CHK-TEST-0007-07..10 sobre o texto servido (nós de texto e nomes acessíveis de `#welcome`, `.toolbar`, `.control-hint`, `.touch-controls` e de todo `index.html`), o texto gerado por `content:` de `src/style.css`, a tabela pt/en de `src/lapMessages.ts` (`MESSAGE_KEYS`) e a lista `data-control` (exatamente `brake`, `left`, `right`, `throttle`, um único `.touch-controls`); nenhum nome de variável de `src/main.ts` é fixado (só literais de texto); os controles de toque vêm só de `index.html` (`src/main.ts:387` lê `[data-control]`)
- reprovabilidade: 0007-07 reprova com texto de drift/Espaço/turbo na tela inicial ou em qualquer texto servido e com `#lap-offer`/`#track-*` retirados (H1, H6, H7); 0007-08 com dica diferente de `Dirigir` ou tecla fora de WASD/setas (H2); 0007-09 com `.maneuver-guide` ou guia em página, estilo ou literal (H3); 0007-10 com quinto `data-control`, controle fora do pad, rótulo de drift ou literal `'drift'` em `src/main.ts` (H4, H5); 0008-03 com `replayLap` ignorando a versão ou gravando a do replay (H8, H10) e com corte oficial sem fim de volta (H9); 0008-05 sem primeiro resultado (H9); 0010-06 com suíte nomeada removida ou script `test` sem `tests/*.test.ts` (H11, H12); H13 (15.ª suíte) não reprova, como o critério permite
- CHK-TEST-0008-03: `v4Replay()` é volta `OFFICIAL` de `arcade-assistido-v4`; com `ARCADE_KART` reproduz a própria volta `VALID` e `COMPARABLE` (a fixture é verdadeira), com o acerto corrente dá `SETUP_VERSION_DIFFERS`, registro com `arcade-assistido-v6` e resultado diferente do gravado; é a linha (I) de AC-US-0005-05 da estratégia, sem afrouxamento
- CHK-TEST-0010-06: as 14 suítes nomeadas presentes (as 14 de `tests/race-lap-validation-*.test.ts` conferidas) e o script `test` (`tsx --test tests/*.test.ts`) roda o glob; NFR-0008 ("a mesma execução de `npm test` roda `tests/race-lap-validation-*.test.ts`") continua decidido; a contagem exata não era exigida pelo critério
- `#lap-end-training` em `.actions` (linha AC-US-0003-13 da estratégia): não exigido pelo critério, que só pede ausência de drift e turbo na dica (ISSUE-12)

## Failures

Nenhuma desta feature. As 9 reprovações da execução pertencem a `pista-kart-park` (ISSUE-11).

## Issues

### ISSUE-01
- severity: warning
- check: T3
- where: `tests/dirigibilidade-contract.test.ts:49-51` CHK-TEST-0010-02 (NFR-0002)
- defect: aberto desde a rodada 1; o par 10,9 µs PASS / 11,5 µs FAIL contra 10 µs aceita um `judge` afrouxado até 14 %.
- expected: par justo (por exemplo 11,0 PASS e 11,01 FAIL) ou `THRESHOLDS.stepCostRatio === 1.10` afirmado.

### ISSUE-02
- severity: warning
- check: T3
- where: `tests/dirigibilidade-hud-text.test.ts:70-72` CHK-TEST-0007-01, CHK-TEST-0007-04 (AC-US-0004-06, AC-US-0005-05)
- defect: aberto desde a rodada 1; as expressões regulares fixam nomes de variáveis e a forma exata das linhas de `src/main.ts` (I9); as acrescentadas 0007-07..10 já seguem a direção.
- expected: manter as afirmações estáveis (ids, tabela de rótulos, uso de `getHandlingTelemetry` e `compareLapRecords`, ausência de subtração) e afrouxar as que fixam forma.

### ISSUE-03
- severity: info
- check: T3
- where: `tests/dirigibilidade-rear.test.ts:101,154` CHK-TEST-0003-04, CHK-TEST-0003-05
- defect: aberto desde a rodada 1; 0,65 PASS / 0,66 FAIL deixa folga de 1,5 %.
- expected: 0,6500001 rad como caso FAIL ou `THRESHOLDS.maxSideslipRad === 0.65` afirmado.

### ISSUE-04
- severity: info
- check: T3
- where: `tests/dirigibilidade-contract.test.ts` CHK-TEST-0010-07 (AC-US-0005-06)
- defect: aberto desde a rodada 1; as mensagens do laço de campos comuns (`${r.benchId}: benchEnvironment` etc.) não nomeiam o critério.
- expected: prefixo `AC-US-0005-06:` nessas mensagens.

### ISSUE-05
- severity: info
- check: T2
- where: NFR-0002, entrada `arcade-assistido-v6` de `docs/physics.md`
- defect: aberto desde a rodada 1; nenhuma verificação afirma o registro `STEP_COST` gravado da versão corrente.
- expected: opcional; DIV-06 permanece.

### ISSUE-06
- severity: info
- check: T3
- where: `tests/dirigibilidade-telemetry.test.ts:81` CHK-TEST-0006-03
- defect: aberto desde a rodada 1; `assert.equal(after.speed, 0)` é igualdade de ponto flutuante.
- expected: sem ação enquanto o repouso zerar a velocidade explicitamente; senão `near(after.speed, 0)`.

### ISSUE-07
- severity: info
- check: T2
- status: fechada
- defect: sem objeto; AC-US-0003-12..15 decidem a tela inicial, a dica, o guia e o botão de toque (CHK-TEST-0007-07..10), e `index.html` não traz mais o ensino do drift.
- expected: nenhuma ação.

### ISSUE-08
- severity: info
- check: T3
- where: CHK-TEST-0003-03, CHK-TEST-0003-04 (AC-US-0003-03, AC-US-0003-04)
- defect: aberto desde a rodada 2; com `arcade-assistido-v6` a traseira não solta em 3 000 ms de forçar; o ramo da recuperação ≤ 400 ms e ≤ 0,65 rad só executa sob mutação.
- expected: nenhuma ação deste estágio; sensação de "traseira viva" na rodada do dono do produto (OPEN-08).

### ISSUE-09
- severity: info
- check: T3
- status: fechada
- defect: CHK-TEST-0008-05 passou a exigir o primeiro resultado (H9 reprova); as demais (0005-01, 0005-03, 0008-02) não tinham defeito.
- expected: nenhuma ação.

### ISSUE-10
- severity: info
- check: T1, T4
- status: fechada
- defect: sem objeto; `modelo-kart-01` aprovada nesta execução.
- expected: nenhuma ação.

### ISSUE-11
- severity: info
- check: T1, T4
- where: `tests/pista-kart-park-lap.test.ts` CHK-TEST-0005-01..04, -06, -08, -10; `tests/pista-kart-park-determinism.test.ts` CHK-TEST-0006-03; `tests/pista-kart-park-session.test.ts` CHK-TEST-0007-05
- defect: 9 reprovações de outra feature (mensagens `'RUNNING' !== 'ENDED'`: volta de treino que segue após corte, ADR-0006 de `race-lap-validation`); contadas fora; nenhuma suíte desta feature as lê; a validação de código `20261030-1613` atribui as mesmas a `pista-kart-park` (FB-02).
- expected: devidas ao estágio de testes de `pista-kart-park`; sem efeito neste veredito.

### ISSUE-12
- severity: info
- check: T2
- where: `test-strategy.md` 6.1.0, linhas AC-US-0003-13 (`#lap-end-training` dentro de `.actions`) e AC-US-0003-15 (`drift: keys.has(' ')` mantido); `97-changelog.md` 2.1.0, itens declinados
- defect: duas afirmações da estratégia declinadas, nenhuma decide o critério: AC-US-0003-13 pede só a ausência de drift e turbo na dica (CHK-TEST-0007-08) e AC-US-0003-15 a ausência do controle de toque (CHK-TEST-0007-10); o comando de drift inerte é decidido em execução por CHK-TEST-0003-09 e -0010-08; nenhuma suíte do repositório afirma `#lap-end-training` em `.actions` (guarda de `race-lap-validation`), registrada só por E2E-04.
- expected: nenhuma ação deste estágio; a estratégia retira a guarda da linha AC-US-0003-13 ou a move para `race-lap-validation` na próxima revisão do D-Spec.

## Divergences

### DIV-01
- criterion: AC-US-0003-09
- state: unverified na metade de tela
- verified by: CHK-TEST-0007-06, CHK-TEST-0003-09, CHK-TEST-0010-08
- approval: `test-strategy.md` 6.1.0, E2E-01 e E2E-02
- hides an automatable criterion: não

### DIV-02
- criterion: AC-US-0003-11
- state: unverified no compartilhar real
- verified by: CHK-TEST-0007-05
- approval: `test-strategy.md` 6.1.0, E2E-02
- hides an automatable criterion: não

### DIV-03
- criterion: AC-US-0004-06
- state: unverified na metade de tela
- verified by: CHK-TEST-0006-01, CHK-TEST-0007-01
- approval: `test-strategy.md` 6.1.0, E2E-01
- hides an automatable criterion: não

### DIV-04
- criterion: AC-US-0005-05
- state: unverified na metade de tela
- verified by: CHK-TEST-0007-03, CHK-TEST-0007-04, CHK-TEST-0008-03
- approval: `test-strategy.md` 6.1.0, E2E-02
- hides an automatable criterion: não

### DIV-05
- criterion: AC-US-0005-07
- state: unverified no compartilhar real
- verified by: CHK-TEST-0007-02
- approval: `test-strategy.md` 6.1.0, E2E-02
- hides an automatable criterion: não

### DIV-06
- criterion: NFR-0002
- state: unverified na medida
- verified by: CHK-TEST-0010-02
- approval: D-TS-04 e estratégia (relógio só nos benches)
- hides an automatable criterion: parcialmente — ISSUE-05

### DIV-07
- criterion: NFR-0003
- state: unverified na metade do aparelho
- verified by: CHK-TEST-0001-07, CHK-TEST-0002-08, CHK-TEST-0003-08, CHK-TEST-0005-07, CHK-TEST-0009-06
- approval: `test-strategy.md` 6.1.0, E2E-03
- hides an automatable criterion: não

### DIV-08
- criterion: NFR-0004
- state: unverified na prosa
- verified by: CHK-TEST-0010-03
- approval: `test-strategy.md` 6.1.0
- hides an automatable criterion: não

### DIV-09
- criterion: AC-US-0003-12 (tela inicial, desktop e celular, pt e en)
- state: unverified na tela renderizada, ícones inclusive
- verified by: CHK-TEST-0007-07
- approval: `test-strategy.md` 6.1.0, E2E-04
- hides an automatable criterion: não

### DIV-10
- criterion: AC-US-0003-13 (dica da barra de ferramentas)
- state: unverified na barra renderizada
- verified by: CHK-TEST-0007-08
- approval: `test-strategy.md` 6.1.0, E2E-04
- hides an automatable criterion: não

### DIV-11
- criterion: AC-US-0003-14 (guia de manobras)
- state: unverified na página renderizada
- verified by: CHK-TEST-0007-09
- approval: `test-strategy.md` 6.1.0, E2E-04
- hides an automatable criterion: não

### DIV-12
- criterion: AC-US-0003-15 (controle de toque no celular, sensor ativo e recuo)
- state: unverified no aparelho
- verified by: CHK-TEST-0007-10
- approval: `test-strategy.md` 6.1.0, E2E-04
- hides an automatable criterion: não
