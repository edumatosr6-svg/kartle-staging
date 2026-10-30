---
stage: test
feature: pista-kart-park
verdict: SUCCESS
generated: 2026-10-30T18:48:07Z
run: {collected: 444, passed: 444, failed: 0, skipped: 0, fresh: true, feature-scope: {collected: 103, passed: 103, failed: 0, skipped: 0}}
counts: {blocker: 0, error: 0, warning: 4, info: 1, divergence: 22}
checks: {before: 102, after: 103, migrated: 1, removed: 0}
seed: {revision: 1, digest: b5aa5be4734a}
round: 4
mode: revalidation
previous-report: reports/test-validation/test-validation-20261030-1714.md
run-artifacts: {junit: reports/junit-latest.xml, log: reports/npm-test-latest.log, measured: 2026-10-30T15:43:40-03:00, last-src-edit: src/main.ts, src/style.css, index.html 2026-10-30T15:21:19-03:00 (commit 38354bb), last-feature-tests-edit: tests/pista-kart-park-screens.test.ts 2026-10-30T15:40:07-03:00 (commit e70aad9)}
code-validation: 400 Code/Output/pista-kart-park/reports/code-validation/code-validation-20261030-1836.md (SUCCESS)
population: [ISSUE-01, -05, -06, -07 (relatório anterior); version movida: 97-changelog 1.2.0, 98-divergences 1.2.0, TEST-0009 1.1.0 + tests/pista-kart-park-screens.test.ts; amostra aleatória: TEST-0011 + tests/pista-kart-park-layering.test.ts, TEST-0004 + tests/pista-kart-park-barrier.test.ts]
mutations-reproduced: [S1 (0009-04), S6 (0009-11), S7 crédito só em volta VALID (nenhuma reprova)]
testing-report: none
feedbacks: []
---

# Relatório de validação de testes — pista-kart-park, rodada 4 (crédito no painel do resultado da volta do treino, ADR-0007)

## Verification status

- execução: junit e log de 15:43:40 −03:00, posteriores a `src/main.ts`, `src/style.css` e `index.html` (15:21:19) e a `tests/pista-kart-park-screens.test.ts` (15:40:07); 444 coletadas, 444 passam, 0 puladas
- feature: 103 `<testcase>` nas 12 suítes, 103 passam; ids únicos e iguais aos 103 de `99-traceability.md`
- atrito: 102 antes; 103 agora; CHK-TEST-0009-04 migrado com linha de Migração; CHK-TEST-0009-11 adicionado; nenhum removido
- critérios verificados em `npm test`: todos os da matriz; unverified: as 22 linhas de aparelho de `98-divergences.md` (DIV-01..22); cobertos só por skip: 0
- CHK-TEST-0009-04: lê `renderTrainingResult` (`functionBody`) e afirma a chamada `renderCredit($('lap-training-result-credit'), creditFor(selectedOption(result.trackId)))`, a conservação do contêiner, o crédito como último filho em `index.html` e a ausência de `lap-result-credit`; S1 reproduzida
- CHK-TEST-0009-11: itens reais de `listLapResults` nas duas pistas, a sintética sem crédito e a Kart Park com `OSM_CREDIT`; S6 reproduzida
- amostra aleatória (T3): TEST-0004 ↔ `barrier.test.ts` e TEST-0011 ↔ `layering.test.ts`, sem alteração desde a rodada 3: toda afirmação nomeia o critério, sem igualdade de ponto flutuante, sem relógio, rede ou ordem

## Failures

(nenhuma)

## Issues

### ISSUE-01
- severity: warning
- check: T3
- status: mantida (CHK-TEST-0009-04 continua textual, agora sobre o corpo de `renderTrainingResult`)
- where: `tests/pista-kart-park-screens.test.ts` CHK-TEST-0009-01/-04/-05/-08/-10, `tests/pista-kart-park-feedback.test.ts` CHK-TEST-0008-08, `tests/pista-kart-park-layering.test.ts` CHK-TEST-0011-01..07
- defect: as afirmações sobre `src/main.ts`, `index.html` e os módulos são textuais; a presença do texto não prova que o ramo executa (I9).
- expected: manter como guarda de camada e de ligação (nível "texto" da estratégia), sem contar como prova do comportamento de tela.

### ISSUE-05
- severity: info
- check: T1
- status: mantida
- where: `98-divergences.md`, seção de aparelho; `test-strategy.md`
- defect: o registro humano do aparelho (`docs/kart-park-device-log.md`) não existe; as 22 linhas ficam `unverified`.
- expected: a etapa de deploy nomeia o registro, e um humano executa o roteiro E2E-01..E2E-08 antes da promoção.

### ISSUE-06
- severity: warning
- check: T4
- status: mantida (respondida no changelog da rodada 4; `test-strategy.md:94` sem alteração)
- where: `300 Specs/330 D-Specs/Output/pista-kart-park/test-strategy.md:94` ↔ CHK-TEST-0005-03
- defect: a estratégia decide AC-US-0003-06 por `describeLap` sobre o estado da volta, o que não funciona no treino contínuo; a verificação usa `describeTrainingResult` sobre o item de `listLapResults`, que é a leitura fiel do critério.
- expected: a próxima rodada do D-Spec de pista-kart-park reescreve a linha 94 para `describeTrainingResult`; o teste não muda.

### ISSUE-07
- severity: warning
- check: T3
- status: mantida (`tests/pista-kart-park-layering.test.ts` sem alteração; o changelog da rodada 4 não a responde)
- where: `tests/pista-kart-park-layering.test.ts:16` (`imports`), usado por `reachedBy` e por CHK-TEST-0011-01/-06
- defect: `imports` só lê `from '...'`; um import de efeito colateral (`import './audio';` em `src/physics.ts`) não entra no grafo nem na proibição de camada externa.
- expected: o leitor de importações também captura `import '...'` e `import('...')`, ou o changelog declina com o motivo.

### ISSUE-08
- severity: warning
- check: T3
- status: nova
- where: `tests/pista-kart-park-screens.test.ts` CHK-TEST-0009-04 e CHK-TEST-0009-11; ADR-0007 (crédito no resultado de cada volta da Kart Park, "válida ou inválida")
- defect: com o crédito desenhado só para resultado `VALID` (`if (result.lapValidity === 'VALID') renderCredit(...)` em `renderTrainingResult`, mutação S7), as 103 verificações passam; o regex de -04 aceita a chamada condicionada; -11 exercita só voltas inválidas e calcula o crédito no próprio teste, apesar do título "valid or not".
- expected: CHK-TEST-0009-04 afirma que a chamada de `renderCredit` em `renderTrainingResult` não depende de `lapValidity`, e CHK-TEST-0009-11 inclui um item `VALID` da Kart Park ou deixa de dizer "valid or not" no título.

## Divergences

- DIV-01..22: as 22 linhas de aparelho de `98-divergences.md` (AC-US-0001-01, -02, -05; AC-US-0002-08; AC-US-0003-06, -11; AC-US-0004-06; AC-US-0005-03, -07..-12; AC-US-0006-01..-08; NFR-0002; NFR-0004; NFR-0005; NFR-0012; REQ-FEAT-0001-13; REQ-FEAT-0007-12/NFR-0011), estado `unverified`/`n/a`, regra provada em `npm test`, metade de aparelho devida ao roteiro humano nomeado pela etapa de deploy; nenhuma contribui para o veredito.
