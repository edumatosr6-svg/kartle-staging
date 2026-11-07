---
stage: test
feature: pista-kart-park
verdict: SUCCESS
generated: 2026-11-07T00:52:25Z
run: {collected: 477, passed: 477, failed: 0, skipped: 0, fresh: true, feature-scope: {collected: 136, passed: 136, failed: 0, skipped: 0}}
counts: {blocker: 0, error: 0, warning: 6, info: 1, divergence: 32}
checks: {before: 126, after: 136, migrated: 41, removed: 1}
seed: {revision: 3, digest: 1fe5243f7e36}
upstream: {stage: dspec, version: 2.0.0}
build: {commit: 671d125, head: 596e964, tests: committed (671d125); 596e964 altera só Markdown}
round: 8
mode: revalidation
previous-report: reports/test-validation/test-validation-20261106-1950.md
feedback-sent: []
---

# Relatório de validação de testes — pista-kart-park, seed revisão 3 (código `06582f8`, suítes `671d125`, registros `596e964`)

## Verification status

- seed: `pipeline_progress.py --seed-line pista-kart-park` → `{revision: 3, digest: 1fe5243f7e36}`
- árvore: `git diff 671d125 HEAD` toca só `97-changelog.md` (teste) e `DOMAIN.md` (seed); nenhum arquivo de `src/`, `scripts/`, `tracks/` ou `tests/` mudou depois da execução registrada; árvore de trabalho limpa
- execução registrada `runs/test-run-20261106-1640.*` (gravada 2026-11-06 16:41 −03:00): posterior à última edição de `src/`/`scripts/`/`tracks/` (15:58) e de `tests/` (16:37); JUnit 477 `<testcase>`, 0 `<failure>`, 0 `<skipped>`; `ℹ` tests 477, pass 477, fail 0, cancelled 0, skipped 0, todo 0
- execução do validador: nova, 2026-11-07 00:51–00:52Z, `npx tsx --test` com repórteres spec e JUnit sobre `tests/*.test.ts`; `ℹ` tests 477, pass 477, fail 0, cancelled 0, skipped 0, todo 0; mesmo conjunto de 477 casos e o mesmo estado de cada um da execução registrada (sem flake)
- feature: 136 `<testcase>` nos 12 arquivos `tests/pista-kart-park-*.test.ts`, 136 `CHK-TEST-*` únicos, todos aprovados; o mesmo conjunto de 136 ids dos registros `TEST-*.md` e de `99-traceability.md` (nenhuma linha sem execução, nenhuma execução sem linha)
- atrito: 126 antes (`reports/junit-latest.xml`), 136 agora; 11 adicionados; 41 migrados (changelog, rodada 6, "Migração"); 1 removido (CHK-TEST-0005-06) com aprovação humana explícita registrada no changelog (rodada 6, coluna "Aprovação", `596e964`) e em `DOMAIN.md` (2026-11-06); `tests/pista-kart-park-lap.test.ts:169` só comenta a retirada
- critérios: os 77 `AC-*` vigentes dos 7 `US-*` (AC-US-0003-09 retirado, REQ-FEAT-0003-12 retirado no changelog do F-Spec) têm linha em `99-traceability.md` e ao menos uma verificação executada e aprovada; NFR-0001, -0003..-0010, -0012..-0014 também
- unverified: as 29 linhas de tela/aparelho de `98-divergences.md` (a metade de tela de 33 `AC-*`, NFR-0004 e NFR-0005; NFR-0002 inteiro, só em aparelho); cobertos só por skip: 0
- população da revalidação: as 8 issues de `test-validation-20261106-1950`; nenhum arquivo com `version:` movido (o changelog mudou uma linha de tabela em `596e964`, examinada como local de ISSUE-11); amostra sorteada de suítes sem alteração: `pista-kart-park-barrier.test.ts` (TEST-0004) e `pista-kart-park-session.test.ts` (TEST-0007)
- tautologia (T3) na amostra: CHK-TEST-0004-02/-03 reprovam se a resolução da barreira em `step` deixar um passo terminar do outro lado (oráculo de cruzamento próprio do teste); CHK-TEST-0004-04 reprova com qualquer diferença > 1e-9 entre a resposta da barreira e a do muro existente; CHK-TEST-0004-05 reprova se `barrierContact` repetir dentro de um episódio; CHK-TEST-0007-09/-13 reprovam com a mutação MV1 da rodada anterior; nenhuma igualdade de ponto flutuante, nenhum relógio, rede ou ordem

## Failures

Nenhuma.

## Issues

### ISSUE-11
- severity: error
- check: Check attrition
- status: resolvida
- where: `500 Tests/Output/pista-kart-park/97-changelog.md`, rodada 6, "Retirada (critério retirado a montante)", coluna "Aprovação"; `200 Requirements/220 Input/pista-kart-park/DOMAIN.md`
- defect: a remoção de CHK-TEST-0005-06 não tinha aprovação humana registrada.
- expected: atendido — a coluna "Aprovação" registra a aprovação explícita do dono do produto (Eduardo Matos, 2026-11-06) e `DOMAIN.md` registra a decisão; nenhuma mudança de teste foi necessária nem feita.

### ISSUE-10
- severity: warning
- check: T3
- status: mantida (`tests/pista-kart-park-session.test.ts` sem alteração)
- where: `tests/pista-kart-park-session.test.ts` CHK-TEST-0007-11; `98-divergences.md`, linha AC-US-0006-08; changelog, migração de CHK-TEST-0007-11
- defect: a metade "não derivado do comprimento medido" não pode falhar: `notEqual(691, 690,674)` é sempre verdadeiro para um inteiro, e a releitura de `TRAINING_TRACKS` lê um catálogo congelado; um catálogo com `Math.round(lapLengthM)` passa.
- expected: ler o comprimento pela interface pública da sessão que carregou outro arquivo, ou o registro deixa de afirmar a contraprova; o 691 literal continua decidindo AC-US-0006-08.

### ISSUE-01
- severity: warning
- check: T3
- status: mantida (suítes sem alteração)
- where: `tests/pista-kart-park-screens.test.ts` CHK-TEST-0009-01/-04/-05/-08/-10/-12/-13, `tests/pista-kart-park-feedback.test.ts` CHK-TEST-0008-08, `tests/pista-kart-park-layering.test.ts` CHK-TEST-0011-01..09
- defect: as afirmações sobre `src/main.ts`, `index.html` e os módulos são textuais; a presença do texto não prova que o ramo executa (I9).
- expected: continuam como guarda de ligação (nível "texto" da estratégia); a parte de tela fica `unverified` até E2E-01.

### ISSUE-05
- severity: info
- check: T1
- status: mantida (`docs/kart-park-device-log.md` e `98-divergences.md` sem alteração)
- where: `docs/kart-park-device-log.md`; `98-divergences.md`, seção de aparelho; `test-strategy.md` 2.0.0, E2E-01..E2E-09
- defect: `98-divergences.md` diz que o log de aparelho "não existe"; ele existe com uma única execução, de 2026-10-30 sobre `e70aad9`; não há execução sobre `06582f8` (versão 2); as 29 linhas ficam `unverified`.
- expected: um humano executa E2E-01..E2E-09 sobre o pacote de `06582f8` e registra no log antes da promoção; o registro corrige a frase.

### ISSUE-06
- severity: warning
- check: T4
- status: mantida (`test-strategy.md` 2.0.0, linha 103, sem alteração)
- where: `300 Specs/330 D-Specs/Output/pista-kart-park/test-strategy.md:103` ↔ CHK-TEST-0005-03
- defect: a estratégia decide AC-US-0003-06 por `describeLap`; a verificação usa `describeTrainingResult`, a leitura fiel do critério no treino contínuo.
- expected: a próxima rodada do D-Spec reescreve a linha para `describeTrainingResult`; o teste não muda.

### ISSUE-07
- severity: warning
- check: T3
- status: mantida (`tests/pista-kart-park-layering.test.ts:16` sem alteração)
- where: `tests/pista-kart-park-layering.test.ts:16` (`imports`), usado por CHK-TEST-0011-01/-06/-08
- defect: `imports` só lê `from '...'`; `import './x';` ou `import('...')` em `src/trackScene.ts` passa pela lista fechada de CHK-TEST-0011-08.
- expected: o leitor de importações captura `import '...'` e `import('...')`, ou o changelog declina com o motivo.

### ISSUE-08
- severity: warning
- check: T3
- status: mantida (CHK-TEST-0009-04 e -11 sem alteração)
- where: `tests/pista-kart-park-screens.test.ts` CHK-TEST-0009-04 e -11; ADR-0007
- defect: com o crédito desenhado só para resultado `VALID` em `renderTrainingResult`, as verificações passam.
- expected: CHK-TEST-0009-04 afirma que a chamada de `renderCredit` não depende de `lapValidity`, e CHK-TEST-0009-11 inclui um item `VALID` da Kart Park.

### ISSUE-09
- severity: warning
- check: T4
- status: mantida (`test-strategy.md` 2.0.0, linha 139, sem alteração)
- where: `300 Specs/330 D-Specs/Output/pista-kart-park/test-strategy.md:139` ↔ CHK-TEST-0010-07 (`EDGE_TOLERANCE_M` 2e-5)
- defect: a estratégia fixa 1e-6 m para a faixa de borda, abaixo da resolução `float32` a ~90 m (ulp 7,6e-6 m) que DES-0008 adota; a verificação aceita 2e-5 m.
- expected: a próxima rodada do D-Spec troca 1e-6 m por uma tolerância compatível com `float32`; o teste não muda.

## Divergences

- DIV-01..29: as 29 linhas de tela/aparelho de `98-divergences.md`, `unverified` com a regra provada em `npm test`; aprovação: níveis E2E como roteiro registrado na estratégia 2.0.0 (ISSUE-05).
- DIV-30 (AC-US-0007-02, tolerância 2e-5 m em vez de 1e-6 m): aceita, sem alteração; defeito do D-Spec (ISSUE-09).
- DIV-31 (AC-US-0007-05/-06, `CURB_Y` = 0,035 m escrito no teste): aceita, sem alteração; valor de DES-0008.
- DIV-32 (AC-US-0007-17, piloto a 2 m/s com `steerGain` 2 entre 425 e 470 m da versão 2): aceita; recalibração que a estratégia 2.0.0 atribui a esta etapa.
- CHK-TEST-0005-06 / AC-US-0003-09: retirado a montante com aprovação explícita do dono do produto (changelog rodada 6; `DOMAIN.md` 2026-11-06); nenhum critério vigente sem verificação.
