---
stage: test
feature: pista-kart-park
verdict: SUCCESS
generated: 2026-11-04T14:32:17Z
run: {collected: 467, passed: 467, failed: 0, skipped: 0, fresh: true, feature-scope: {collected: 126, passed: 126, failed: 0, skipped: 0}}
counts: {blocker: 0, error: 0, warning: 5, info: 1, divergence: 32}
checks: {before: 126, after: 126, migrated: 0, removed: 0}
seed: {revision: 2, digest: 49d733298158}
build: {commit: 2aa013e, head: 7692014, served-bundle: index-BMmvlQeM.js}
round: 6
mode: revalidation
previous-report: reports/test-validation/test-validation-20261103-2043.md
feedback-sent: []
---

# Relatório de validação de testes — pista-kart-park, rodada 6 (seed revisão 2, build `2aa013e` / `index-BMmvlQeM.js`)

## Verification status

- build julgado: `HEAD` `7692014`; `git diff --name-only 2aa013e HEAD` fora de `600 Deploy/Output/`: 0 arquivos — código, testes, fixtures e especificações idênticos a `2aa013e`; árvore limpa
- bundle: `npx vite build --base=/kartle-staging/` da árvore atual, saída em rascunho: `index-BMmvlQeM.js` sha256 `babb1884645d2c40…`, `index-q-biCwua.css` — o mesmo nome e hash do servido em staging (`deploy-validation-20261104-1302.md`, P1)
- seed: `pipeline_progress.py --seed-line pista-kart-park` → `{revision: 2, digest: 49d733298158}` (sha1 do corpo sem front matter, LF, aparado); o relatório 20261103-2043 carimbou `b80f2635073f`, que é o sha1 do arquivo inteiro com CRLF — mesmo seed (último commit `a5bb426`, 2026-11-03 15:49 −03:00), carimbo corrigido aqui
- execução: nova, 2026-11-04 11:28:18–11:29:14 −03:00, `npx tsx --test` com repórter JUnit e spec sobre `tests/*.test.ts`; posterior ao último commit de `src/`, `tests/`, `scripts/`, `tracks/` (`2aa013e`, 2026-11-03 17:44:39)
- totais do runner (`ℹ`): tests 467, pass 467, fail 0, cancelled 0, skipped 0, todo 0; saída 0; JUnit: 467 `<testcase>`, 0 `<failure>`, 0 `<skipped>`
- feature: 126 `<testcase>` nos 12 arquivos `tests/pista-kart-park-*.test.ts`, 126 `CHK-TEST-*` únicos, todos aprovados; o mesmo conjunto de 126 ids de `99-traceability.md` (nenhuma linha sem execução, nenhuma execução sem linha)
- atrito: 126 antes (`reports/junit-latest.xml` de 2026-11-03 17:36:41), 126 agora; 0 removidos, 0 migrados, 0 adicionados
- critérios verificados em `npm test`: os 74 `AC-*` dos 7 `US-*` têm linha em `99-traceability.md` (sem alteração desde a rodada 5); AC-US-0007-01..21, NFR-0013 e NFR-0014 seguem decididos pelas mesmas verificações
- unverified: as 29 linhas de tela/aparelho de `98-divergences.md` (metade de tela de AC-US-0007-01, -09, -11, -13, -14, -16, -18..20 incluída); cobertos só por skip: 0
- população da revalidação: as 6 issues da rodada 5; nenhum arquivo com `version:` movido (`99-traceability.md`, `97-changelog.md` 1.3.0, `test-strategy.md` 1.3.0 sem alteração); amostra aleatória de arquivos sem alteração: `pista-kart-park-determinism.test.ts` (TEST-0006) e `pista-kart-park-track-data.test.ts` (TEST-0002)
- amostra: toda afirmação nomeia o critério; sem relógio, rede ou ordem (sequência semeada por `Seeded`, fixture lida do disco); a igualdade exata de `firstDifference` é a própria propriedade de NFR-0013 (traço bit a bit)
- tautologia (T3), mutações do validador numa cópia em rascunho, uma por vez, nos 15 testes das duas suítes: mutação nula → 0 reprovam; `widthM` da zebra lida +1e-9 m em `readTrackData` → reprova CHK-TEST-0002-01; `speed` do passo × (1 + 1e-13) em `src/physics.ts` → reprova CHK-TEST-0006-05

## Failures

Nenhuma.

## Issues

### ISSUE-01
- severity: warning
- check: T3
- status: mantida (suítes sem alteração)
- where: `tests/pista-kart-park-screens.test.ts` CHK-TEST-0009-01/-04/-05/-08/-10/-12, `tests/pista-kart-park-feedback.test.ts` CHK-TEST-0008-08, `tests/pista-kart-park-layering.test.ts` CHK-TEST-0011-01..09
- defect: as afirmações sobre `src/main.ts`, `index.html` e os módulos são textuais; a presença do texto não prova que o ramo executa (I9).
- expected: continuam como guarda de camada e de ligação (nível "texto" da estratégia); AC-US-0007-16 fica `unverified` até E2E-09.

### ISSUE-05
- severity: info
- check: T1
- status: mantida, texto corrigido
- where: `docs/kart-park-device-log.md`; `98-divergences.md`, seção de aparelho; `test-strategy.md` E2E-01..E2E-09
- defect: o registro existe (`1bb63aa`), mas sua única execução é de 2026-10-30 sobre `e70aad9` (`index-DmxsQuIL.js`), qualitativa e sem fps; não há execução sobre `2aa013e`, e E2E-09 e as metades de tela da revisão 2 nunca foram executados; as 29 linhas ficam `unverified`.
- expected: um humano executa E2E-01..E2E-09 sobre `index-BMmvlQeM.js` e registra no log antes da promoção (DIV-DP-01 da etapa de deploy).

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
- status: mantida (`tests/pista-kart-park-layering.test.ts:16` sem alteração)
- where: `tests/pista-kart-park-layering.test.ts:16` (`imports`), usado por CHK-TEST-0011-01/-06/-08
- defect: `imports` só lê `from '...'`; um import de efeito colateral (`import './x';`) ou `import('...')` em `src/trackScene.ts` passa pela lista fechada de CHK-TEST-0011-08.
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
- status: mantida (`test-strategy.md:132` sem alteração)
- where: `300 Specs/330 D-Specs/Output/pista-kart-park/test-strategy.md:132` ↔ CHK-TEST-0010-07 (`EDGE_TOLERANCE_M` 2e-5)
- defect: a estratégia fixa 1e-6 m para a largura da faixa de borda, abaixo da resolução `float32` a ~90 m (ulp 7,6e-6 m) que DES-0008 adota; a verificação aceita 2e-5 m.
- expected: a próxima rodada do D-Spec troca 1e-6 m por uma tolerância compatível com `float32` (p.ex. 2e-5 m); o teste não muda.

## Divergences

- DIV-01..29: as 29 linhas de tela/aparelho de `98-divergences.md`, `unverified` com a regra provada em `npm test`; aprovação: níveis E2E como roteiro registrado na estratégia 1.3.0 (ISSUE-05).
- DIV-30 (AC-US-0007-02, tolerância 2e-5 m em vez de 1e-6 m): aceita, sem alteração; defeito do D-Spec (ISSUE-09).
- DIV-31 (AC-US-0007-05/-06, `CURB_Y` = 0,035 m escrito no teste): aceita, sem alteração; valor de DES-0008.
- DIV-32 (AC-US-0007-17, piloto a 2 m/s com `steerGain` 1 entre 15 e 55 m): aceita, sem alteração.
