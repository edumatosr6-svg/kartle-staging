---
stage: test
feature: pista-kart-park
verdict: FAIL TEST
generated: 2026-11-06T19:50:41Z
run: {collected: 477, passed: 477, failed: 0, skipped: 0, fresh: true, feature-scope: {collected: 136, passed: 136, failed: 0, skipped: 0}}
counts: {blocker: 0, error: 1, warning: 6, info: 1, divergence: 32}
checks: {before: 126, after: 136, migrated: 41, removed: 1}
seed: {revision: 3, digest: 1fe5243f7e36}
build: {commit: 06582f8, head: 06582f8, tests: working tree (git diff HEAD, 9 suites and the fixture uncommitted)}
round: 7
mode: revalidation
previous-report: reports/test-validation/test-validation-20261104-1432.md
feedback-sent: []
---

# Relatório de validação de testes — pista-kart-park, seed revisão 3 (código `06582f8`, suítes da rodada 6 do gerador)

## Verification status

- seed: `pipeline_progress.py --seed-line pista-kart-park` → `{revision: 3, digest: 1fe5243f7e36}`
- gate: `lint_artifacts.py --stage test --feature pista-kart-park` → 0 erros, 0 avisos em 14 arquivos (não rejulgado)
- execução do validador: nova, 2026-11-06 16:45–16:46 −03:00, `npx tsx --test` com repórter JUnit e spec sobre `tests/*.test.ts`, posterior ao último commit de `src/` (`06582f8`, 16:13) e à última edição das suítes (16:37); totais `ℹ`: tests 477, pass 477, fail 0, cancelled 0, skipped 0, todo 0; JUnit: 477 `<testcase>`, 0 `<failure>`, 0 `<skipped>`
- execução registrada `runs/test-run-20261106-1640.*`: mesmos totais e o mesmo conjunto de ids da execução do validador; nenhuma verificação passou numa e reprovou na outra (sem flake)
- feature: 136 `<testcase>` nos 12 arquivos `tests/pista-kart-park-*.test.ts`, 136 `CHK-TEST-*` únicos, todos aprovados; o mesmo conjunto de 136 ids dos registros `TEST-*.md` e de `99-traceability.md` (nenhuma linha sem execução, nenhuma execução sem linha)
- atrito: 126 antes (`reports/junit-latest.xml`, 2026-11-03), 136 agora; 11 adicionados (CHK-TEST-0001-21, -22, -0002-09, -0006-08..10, -0007-12, -13, -0009-13, -0012-08, -09); 41 migrados (changelog, rodada 6, "Migração"); 1 removido (CHK-TEST-0005-06, ISSUE-11)
- critérios: os 77 `AC-*` vigentes dos 7 `US-*` (AC-US-0003-09 retirado) têm linha em `99-traceability.md` e ao menos uma verificação executada e aprovada; NFR-0001, -0003..-0010, -0012..-0014 também
- unverified: as 29 linhas de tela/aparelho de `98-divergences.md` (a metade de tela de 33 `AC-*`, NFR-0004 e NFR-0005; NFR-0002 inteiro, só em aparelho); cobertos só por skip: 0
- população da revalidação: as 6 issues de `test-validation-20261104-1432`; os arquivos com `version:` movido (TEST-0001, -0002, -0005, -0006, -0007, -0009, -0010, -0011, -0012, `97-changelog.md` 1.4.0, `98-divergences.md` 2.0.0, `test-strategy.md` 2.0.0) e as 9 suítes e a fixture alteradas; amostra de arquivos sem alteração: `pista-kart-park-surface.test.ts` (TEST-0003) e `pista-kart-park-feedback.test.ts` (TEST-0008) — pontos escolhidos pela geometria lida, sem número da versão 1
- tautologia (T3), mutações do validador numa cópia em rascunho, uma por vez, nas 12 suítes da feature (linha de base 136/136): MV1 `selectTrainingTrack` sem a conferência de `trackId` → reprovam CHK-TEST-0007-09, -0007-13; MV2 ambiente da sessão construído com a linha central deslocada 0,15 m em *x* → reprovam CHK-TEST-0002-09, -0006-03

## Failures

Nenhuma.

## Issues

### ISSUE-11
- severity: error
- check: Check attrition
- status: nova
- where: `500 Tests/Output/pista-kart-park/97-changelog.md`, rodada 6, "Retirada (critério retirado a montante)"; `tests/pista-kart-park-lap.test.ts:169`
- defect: CHK-TEST-0005-06 saiu da execução sem migração e sem aprovação humana registrada; a coluna "Aprovação" cita a revisão 3 do seed (que não menciona o atalho da curva 4) e a instrução do test-loop, e diz que "a confirmação explícita do dono do produto continua pedida". A instrução de um agente não é aprovação humana (conventions §17).
- expected: o dono do produto registra no changelog a aprovação explícita da remoção de CHK-TEST-0005-06 (com AC-US-0003-09 / REQ-FEAT-0003-12 retirados); nenhuma mudança de teste é necessária.
- owed by: dono do produto, depois test-loop

### ISSUE-10
- severity: warning
- check: T3
- status: nova
- where: `tests/pista-kart-park-session.test.ts` CHK-TEST-0007-11; `98-divergences.md`, linha AC-US-0006-08; changelog, migração de CHK-TEST-0007-11
- defect: a metade "não derivado do comprimento medido" não pode falhar: `notEqual(691, 690,674)` é sempre verdadeiro para um inteiro, e a releitura de `TRAINING_TRACKS` depois de selecionar a versão 1 lê um catálogo congelado (CHK-TEST-0007-01). Um catálogo com `Math.round(lapLengthM)` passa. O registro afirma que a verificação "falha se o catálogo derivar o comprimento do arquivo".
- expected: ler o comprimento pela interface pública da sessão que carregou outro arquivo (`getTrainingTrackOptions(sessão)`), ou o registro deixa de afirmar a contraprova; o 691 literal continua decidindo AC-US-0006-08.

### ISSUE-01
- severity: warning
- check: T3
- status: mantida; ampliada por CHK-TEST-0009-13
- where: `tests/pista-kart-park-screens.test.ts` CHK-TEST-0009-01/-04/-05/-08/-10/-12/-13, `tests/pista-kart-park-feedback.test.ts` CHK-TEST-0008-08, `tests/pista-kart-park-layering.test.ts` CHK-TEST-0011-01..09
- defect: as afirmações sobre `src/main.ts`, `index.html` e os módulos são textuais (`renderOffer`, `chooseTrack`, `renderBest` em CHK-TEST-0009-13); a presença do texto não prova que o ramo executa (I9).
- expected: continuam como guarda de ligação (nível "texto" da estratégia); a parte de tela de AC-US-0001-09 fica `unverified` até E2E-01.

### ISSUE-05
- severity: info
- check: T1
- status: mantida, texto corrigido
- where: `docs/kart-park-device-log.md`; `98-divergences.md`, seção de aparelho; `test-strategy.md` 2.0.0, E2E-01..E2E-09
- defect: `98-divergences.md` diz que `docs/kart-park-device-log.md` "não existe"; o arquivo existe (`1bb63aa`) com uma única execução, de 2026-10-30 sobre `e70aad9`, qualitativa e sem fps. Não há execução sobre `06582f8` (versão 2); as 29 linhas ficam `unverified`.
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

- DIV-01..29: as 29 linhas de tela/aparelho de `98-divergences.md` (inclui AC-US-0001-08, -09 novas), `unverified` com a regra provada em `npm test`; aprovação: níveis E2E como roteiro registrado na estratégia 2.0.0 (ISSUE-05).
- DIV-30 (AC-US-0007-02, tolerância 2e-5 m em vez de 1e-6 m): aceita, sem alteração; defeito do D-Spec (ISSUE-09).
- DIV-31 (AC-US-0007-05/-06, `CURB_Y` = 0,035 m escrito no teste): aceita, sem alteração; valor de DES-0008.
- DIV-32 (AC-US-0007-17, piloto a 2 m/s com `steerGain` 2 entre 425 e 470 m da versão 2): aceita; recalibração que a estratégia 2.0.0 atribui a esta etapa.
