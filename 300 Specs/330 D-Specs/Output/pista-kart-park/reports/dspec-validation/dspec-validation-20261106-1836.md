---
stage: dspec
feature: pista-kart-park
verdict: SUCCESS
generated: 2026-11-06T18:36:00Z
counts: {blocker: 0, error: 0, warning: 0, info: 2, divergence: 8}
seed: {revision: 3, digest: 1fe5243f7e36}
upstream: {stage: fspec, validation: fspec-validation-20261106-1805, commit: 281b617, status: validated}
feedbacks: []
previous: "dspec-validation-20261106-1828.md (FAIL: ISSUE-01 error; ISSUE-02 a ISSUE-04 info)"
population: "revalidação (§8): ISSUE-01 a ISSUE-04 de 20261106-1828, todas fechadas; arquivos com version movida: DM-0001 2.0.1, DM-0002 2.0.1, ADR-0001 1.0.2, DES-0007 2.0.1, DES-0008 3.0.1, 97-changelog.md 1.7.0; amostra aleatória de dois intocados: 99-traceability.md, ADR-0006 2.0.0"
isolation: "a invocação trouxe só a feature e os caminhos; 97-changelog.md 1.7.0 foi lido só para saber que arquivos mudaram"
---

# Relatório de validação D-Spec — pista-kart-park

## Summary

- verdict: SUCCESS
- blocker: 0
- error: 0
- warning: 0
- info: 2 (ISSUE-01, ISSUE-02)
- divergence: 8, todas `open`, em `98-divergences.md` 2.0.0 (sem mudança)
- fechadas do relatório anterior: ISSUE-01 (DM-0001/DM-0002 2.0.1), ISSUE-02 (ADR-0001 1.0.2; `tests/race-lap-validation-track-data.test.ts:18-30`, `:32-40` e commit `32d0adf` conferidos), ISSUE-03 (DES-0008 3.0.1; `src/main.ts:30-35`, `:404-420`, `:522-529`, `:615-622`, `:46-47`, `:239` conferidos), ISSUE-04 (DES-0007 2.0.1; tabela de `src/main.ts` e `index.html:17`, `:19`, `:26`, `:27` conferidos)

## Issues

### ISSUE-01

- severity: info
- check: D2 — caminho de módulo existente ou marcado novo, verificado na árvore
- file: web/DES-0007-tela-inicial-seletor-credito-e-resultado.md
- location: DES-0007 2.0.1, "Posicionamento", itens `src/style.css`, `src/lapMessages.ts`, `src/rawImports.d.ts`; "Interface", "`src/lapMessages.ts`, acrescido"
- finding: `src/rawImports.d.ts` está marcado **novo** com o motivo "nenhum arquivo de declaração existe hoje", mas existe na árvore desde `ba221ad` com a declaração `*.json?raw` descrita; as regras `.track-selector` e `.track-credit` já estão em `src/style.css:8`; `OSM_CREDIT`, `creditFor` e `optionLabel` já estão em `src/lapMessages.ts:105`, `:113`, `:118`. O mesmo item diz que os trechos entregues pelas revisões 1 e 2 estão marcados como existentes.
- expected: os três módulos marcados como existentes e sem mudança na revisão 3. Não condiciona o veredito.

### ISSUE-02

- severity: info
- check: D3 — forma do contrato campo a campo (API-0002 `displayLengthM`)
- file: adr/ADR-0006-lacunas-do-f-spec-resolvidas-no-projeto.md
- location: ADR-0006 2.0.0, "Decisão", linha "Suavização (só versão 1)", coluna "Motivo e evidência"
- finding: afirma "o rótulo continua \"687 m\" (`displayLengthM` 687 do catálogo, fixado pelo F-Spec em REQ-FEAT-0006-08)", enquanto REQ-FEAT-0006-08 do F-Spec validado fixa "691 m" e DES-0005 (`displayLengthM` 691) e DES-0007 servem 691; o item que serve o contrato está correto.
- expected: o texto restrito à versão 1 como histórico, sem atribuir 687 ao REQ-FEAT-0006-08 atual. Não condiciona o veredito.

## Divergences

### REQ-FEAT-0001-15, -16; API-0002 (`trackVersion`, `TRACK_VERSION_MISMATCH`)
- estado: open
- hoje: `src/trainingSession.ts:10`, `:67-69`; `src/main.ts:13`, `:156`
- fecha: DES-0005, DES-0007, ADR-0008

### REQ-FEAT-0006-07, -08
- estado: open
- hoje: `src/trainingSession.ts:13`
- fecha: DES-0005, DES-0007

### REQ-FEAT-0002-01, -04 a -11, -14, -19; REQ-FEAT-0003-01 a -07, -16; REQ-FEAT-0004-01 a -03; REQ-FEAT-0005-01 a -03, -20; REQ-FEAT-0006-09
- estado: open
- hoje: `scripts/trackPrep.ts:12-21`; `src/tracks/kart-park-v2.json` e `tracks/sources/kart-park-replica.json` ausentes
- fecha: DES-0010, DM-0001, ADR-0008

### REQ-FEAT-0002-01, -04 a -11, -19; REQ-FEAT-0003-01 a -05, -16; REQ-FEAT-0004-01, -02; REQ-FEAT-0005-01, -02, -20 (verificações)
- estado: open
- hoje: `scripts/trackChecks.ts:11-13`, `:16-17`, `:21`, `:27`, `:31-34`
- fecha: DES-0011

### REQ-FEAT-0002-17, -18
- estado: open
- hoje: `tracks/registry.json:3-61`; `scripts/track-pipeline.ts:24-26`, `:44`, `:61`
- fecha: DES-0010, DES-0011, DM-0002

### REQ-FEAT-0002-12, -13; REQ-FEAT-0004-08; REQ-FEAT-0005-04; REQ-FEAT-0003-08, -10, -11, -13, -15; REQ-FEAT-0008-01 a -24
- estado: open
- hoje: `src/main.ts:13`
- fecha: DES-0007

### REQ-FEAT-0008-25, -26, -27
- estado: open
- hoje: `tests/pista-kart-park-determinism.test.ts:72`
- fecha: DES-0006, test-strategy.md

### REQ-FEAT-0001-15, -16; REQ-FEAT-0002-*, REQ-FEAT-0003-*, REQ-FEAT-0005-01, -02, -20; REQ-FEAT-0006-07, -08; REQ-FEAT-0008-01 (verificações em `npm test`)
- estado: open
- hoje: `tests/fixtures/kartParkFiles.ts:29-30`; `tests/pista-kart-park-session.test.ts:69`, `:210`; `tests/pista-kart-park-track-file.test.ts:72`, `:248-263`; `tests/pista-kart-park-lap.test.ts:173-187`
- fecha: test-strategy.md

## Coverage

- requisitos cobertos: 132 de 132 ativos (137 ids no F-Spec; 5 retirados: REQ-FEAT-0002-03, REQ-FEAT-0003-12, REQ-FEAT-0007-12, REQ-FEAT-0008-28, -29; nenhum citado em `sources:`)
- requisitos sem cobertura: nenhum
- itens de projeto sem fonte: nenhum (nenhum `REQ-*` em `sources:` fora do F-Spec)
- critérios sem caminho de teste alcançável: nenhum (test-strategy.md 2.0.0 sem mudança desde 20261106-1828)
- D9: nenhum `OPEN-<nn>` nem `TBD`; D6: nenhum segredo, credencial ou token
