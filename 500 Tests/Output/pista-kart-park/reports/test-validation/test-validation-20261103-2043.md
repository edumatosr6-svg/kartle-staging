---
stage: test
feature: pista-kart-park
verdict: SUCCESS
generated: 2026-11-03T20:43:28Z
run: {collected: 467, passed: 467, failed: 0, skipped: 0, fresh: true, feature-scope: {collected: 126, passed: 126, failed: 0, skipped: 0}}
counts: {blocker: 0, error: 0, warning: 5, info: 1, divergence: 32}
checks: {before: 103, after: 126, migrated: 2, removed: 0}
seed: {revision: 2, digest: b80f2635073f}
round: 5
mode: revalidation
previous-report: reports/test-validation/test-validation-20261030-1844.md
feedback-sent: []
---

# Relatório de validação de testes — pista-kart-park, rodada 5 (seed revisão 2, acabamento visual, código `fbfb073`)

## Verification status

- execução: `junit-latest.xml` e `npm-test-latest.log` de 17:36:41 −03:00, posteriores ao commit `fbfb073` (17:04:58), à última suíte editada (`pista-kart-park-layering.test.ts`, 17:33:43) e à fixture `kartParkRev1Trace.json` (17:11:09); nenhum arquivo de `src/`, `scripts/`, `tracks/`, `tests/`, `index.html`, `package.json`, `tsconfig.json` é mais novo que a execução
- totais do runner (`ℹ`): tests 467, pass 467, fail 0, cancelled 0, skipped 0, todo 0; JUnit: 467 `<testcase>`, 0 `<failure>`, 0 `<skipped>`
- reexecução do validador na árvore atual (`npx tsx --test tests/*.test.ts`, 2026-11-03 ~17:40): 467 / 467 / 0 falhas / 0 puladas — a execução registrada é a da árvore atual
- feature: 126 `CHK-TEST-*` únicos nas 12 suítes, todos aprovados; o mesmo conjunto de 126 ids de `99-traceability.md`
- atrito: 103 antes (JUnit de `HEAD`), 126 agora; 0 removidos; CHK-TEST-0010-03 e -05 migrados com linha de Migração em `97-changelog.md`; 23 adicionados
- critérios verificados em `npm test`: todos os `AC-*` dos 7 `US-*` (74) têm linha em `99-traceability.md`; AC-US-0007-01..21, NFR-0013 e NFR-0014 decididos por CHK-TEST-0003-06..09, -0005-13, -0006-05..07, -0009-12, -0010-03, -06..16, -0011-08/-09, -0012-07 e pelas verificações sem mudança CHK-TEST-0003-01..03, -0004-02..05, -0008-01..08
- unverified: as 29 linhas de tela/aparelho de `98-divergences.md` (metade de tela de AC-US-0007-01, -09, -11, -13, -14, -16, -18..20 incluída; E2E-03/-04/-05/-09 sem registro humano); cobertos só por skip: 0
- simulação: `git diff --stat f926815 fbfb073 -- src scripts tracks` muda só `src/trackScene.ts` e `src/main.ts`; o traço de revisão 1 é guarda de regressão (S1–S6 do changelog o reprovam)
- tautologia (T3), mutações do validador numa cópia em rascunho, uma por vez, 126 verificações: zebra do lado do asfalto +1 mm → 1 reprova; largura da faixa de borda × 1,0005 (5e-5 m) → 1 reprova; pilhas de pneus deslocadas 0,06 m em x → 2 reprovam; mutação nula → 0
- amostra aleatória de arquivos sem alteração: `pista-kart-park-barrier.test.ts` (TEST-0004) e `pista-kart-park-session.test.ts` (TEST-0007): toda afirmação nomeia o critério, sem relógio, rede ou ordem

## Failures

Nenhuma.

## Issues

### ISSUE-01
- severity: warning
- check: T3
- status: mantida, ampliada a CHK-TEST-0009-12, CHK-TEST-0011-08 e -09
- where: `tests/pista-kart-park-screens.test.ts` CHK-TEST-0009-01/-04/-05/-08/-10/-12, `tests/pista-kart-park-feedback.test.ts` CHK-TEST-0008-08, `tests/pista-kart-park-layering.test.ts` CHK-TEST-0011-01..09
- defect: as afirmações sobre `src/main.ts`, `index.html` e os módulos são textuais (CHK-TEST-0009-12 lê `ground.visible = ...` e `buildTrackScene(...)` por regex); a presença do texto não prova que o ramo executa (I9).
- expected: continuam como guarda de camada e de ligação (nível "texto" da estratégia); AC-US-0007-16 fica `unverified` até E2E-09, como `98-divergences.md` registra.

### ISSUE-05
- severity: info
- check: T1
- status: mantida (E2E-09 acrescentado)
- where: `98-divergences.md`, seção de aparelho; `test-strategy.md` E2E-01..E2E-09
- defect: o registro humano do aparelho (`docs/kart-park-device-log.md`) não existe; as 29 linhas ficam `unverified`.
- expected: a etapa de deploy nomeia o registro e um humano executa E2E-01..E2E-09 antes da promoção.

### ISSUE-06
- severity: warning
- check: T4
- status: mantida (`test-strategy.md` 1.3.0, linha 97, sem alteração)
- where: `300 Specs/330 D-Specs/Output/pista-kart-park/test-strategy.md:97` ↔ CHK-TEST-0005-03
- defect: a estratégia decide AC-US-0003-06 por `describeLap`; a verificação usa `describeTrainingResult`, a leitura fiel do critério no treino contínuo.
- expected: a próxima rodada do D-Spec reescreve a linha para `describeTrainingResult`; o teste não muda.

### ISSUE-07
- severity: warning
- check: T3
- status: mantida (`imports` sem alteração; agora usado também por CHK-TEST-0011-08)
- where: `tests/pista-kart-park-layering.test.ts:16` (`imports`), usado por CHK-TEST-0011-01/-06/-08
- defect: `imports` só lê `from '...'`; um import de efeito colateral (`import './x';`) ou `import('...')` em `src/trackScene.ts` passa pela lista fechada de CHK-TEST-0011-08.
- expected: o leitor de importações captura `import '...'` e `import('...')`, ou o changelog declina com o motivo.

### ISSUE-08
- severity: warning
- check: T3
- status: mantida (CHK-TEST-0009-04 e -11 sem alteração; o changelog da rodada 5 não a responde)
- where: `tests/pista-kart-park-screens.test.ts` CHK-TEST-0009-04 e -11; ADR-0007
- defect: com o crédito desenhado só para resultado `VALID` em `renderTrainingResult` (mutação S7 da rodada 4), as verificações passam.
- expected: CHK-TEST-0009-04 afirma que a chamada de `renderCredit` não depende de `lapValidity`, e CHK-TEST-0009-11 inclui um item `VALID` da Kart Park.

### ISSUE-09
- severity: warning
- check: T4
- status: nova
- where: `300 Specs/330 D-Specs/Output/pista-kart-park/test-strategy.md:132` ↔ CHK-TEST-0010-07 (`EDGE_TOLERANCE_M` 2e-5)
- defect: a estratégia fixa 1e-6 m para a largura da faixa de borda, abaixo da resolução de `Float32BufferAttribute` a ~90 m (ulp 7,6e-6 m) que DES-0008 adota; nenhum desenho conforme ao projeto a atinge. A verificação aceita 2e-5 m (desvio medido 3,7e-6 m) e reprova 5e-5 m (mutação do validador) e a bissetriz sem 1/cos(θ/2).
- expected: a próxima rodada do D-Spec troca 1e-6 m por uma tolerância compatível com `float32` (p.ex. 2e-5 m); o teste não muda.

## Divergences

- DIV-01..29: as 29 linhas de tela/aparelho de `98-divergences.md` (inclui AC-US-0007-01, -09, -11, -13/-20, -14, -16, -18/-19), `unverified` com a regra provada em `npm test`; aprovação: níveis E2E como roteiro registrado na estratégia 1.3.0 (ISSUE-05).
- DIV-30 (AC-US-0007-02, tolerância 2e-5 m em vez de 1e-6 m): aceita; o critério validado ("0,10 m") é verificado com folga 85× menor que o defeito de projeto mais próximo; a linha da estratégia é defeito do D-Spec (ISSUE-09), não do teste nem do código.
- DIV-31 (AC-US-0007-05/-06, `CURB_Y` = 0,035 m escrito no teste): aceita; o valor é o de DES-0008 (linha `curbs`), o módulo não o exporta e a etapa não acrescenta superfície; o lado do asfalto é medido na geometria; zebra +1 mm do lado do asfalto reprova CHK-TEST-0010-08.
- DIV-32 (AC-US-0007-17, piloto a 2 m/s com `steerGain` 1 entre 15 e 55 m): aceita; o critério não fixa velocidade, só rodas sobre a faixa por mais de 1000 ms sem roda além da borda; a verificação afirma ≥ 121 passos seguidos nessa condição, `offTrackSteps` 0 e volta `VALID` sem `CUT`, e S7 a reprova.
