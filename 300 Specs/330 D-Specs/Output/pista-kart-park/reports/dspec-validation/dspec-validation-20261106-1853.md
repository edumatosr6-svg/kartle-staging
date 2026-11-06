---
stage: dspec
feature: pista-kart-park
verdict: SUCCESS
generated: 2026-11-06T18:53:00Z
counts: {blocker: 0, error: 0, warning: 0, info: 2, divergence: 8}
seed: {revision: 3, digest: 1fe5243f7e36}
upstream: {stage: fspec, validation: fspec-validation-20261106-1805, commit: 281b617, status: validated}
feedbacks: []
previous: "dspec-validation-20261106-1836.md (SUCCESS: ISSUE-01, ISSUE-02 info)"
population: "revalidação (§8) após a rodada Mode C sobre feedback-20261106-1850 (SPEC-ISSUE-01): ISSUE-01 e ISSUE-02 de 20261106-1836; arquivos com version movida: DES-0010 2.1.0, DES-0011 2.0.1, 97-changelog.md 1.8.0; amostra aleatória de dois intocados: ADR-0001 1.0.2, test-strategy.md 2.0.0"
isolation: "a invocação trouxe só a feature, os caminhos e o nome do feedback; 97-changelog.md 1.8.0 foi lido como arquivo da população, sem tomar os motivos de recusa nele como evidência"
placement: "afirmações de lugar conferidas contra HEAD (a999201), não contra a árvore sem commit: .gitattributes:5-6; scripts/track-pipeline.ts:24-26, :61; scripts/trackChecks.ts:11-13; tests/pista-kart-park-publication.test.ts:70, :167; EDGE_SAMPLE_M 0,25 e BARRIER_GAP_MAX_M 6 em scripts/trackPrep.ts:22-23; símbolos colaboradores exportados de src/trackGeometry.ts, src/track.ts, src/trackData.ts; réplica de 200 Requirements com 34.373 bytes e SHA-256 eba665b6…a24e"
---

# Relatório de validação D-Spec — pista-kart-park

## Summary

- verdict: SUCCESS
- blocker: 0
- error: 0
- warning: 0
- info: 2 (ISSUE-01, ISSUE-02, ambas abertas desde 20261106-1836, arquivos sem mudança)
- divergence: 8, todas `open`, em `98-divergences.md` 2.0.0 (sem mudança)
- SPEC-ISSUE-01 de `feedback-20261106-1850`: fechado em DES-0010 2.1.0, passo 5 (amostragem por borda, cada amostra julgada sozinha) e DES-0011 2.0.1, V13 (mesma definição de amostragem); V13 continua a regra de RULE-0002 do F-Spec

## Issues

### ISSUE-01

- severity: info
- check: D2 — caminho de módulo existente ou marcado novo, verificado na árvore
- file: web/DES-0007-tela-inicial-seletor-credito-e-resultado.md
- location: DES-0007 2.0.1, "Posicionamento", linhas 59-61 (`src/rawImports.d.ts`, **novo**, "nenhum arquivo de declaração existe hoje")
- finding: aberta desde 20261106-1836, sem mudança: `src/rawImports.d.ts` marcado novo, mas existe na árvore desde `ba221ad`; `.track-selector`/`.track-credit` já em `src/style.css` e `OSM_CREDIT`, `creditFor`, `optionLabel` já em `src/lapMessages.ts`.
- expected: os três módulos marcados como existentes e sem mudança na revisão 3. Não condiciona o veredito.

### ISSUE-02

- severity: info
- check: D3 — forma do contrato campo a campo (API-0002 `displayLengthM`)
- file: adr/ADR-0006-lacunas-do-f-spec-resolvidas-no-projeto.md
- location: ADR-0006 2.0.0, "Decisão", linha "Suavização (só versão 1)", coluna "Motivo e evidência"
- finding: aberta desde 20261106-1836, sem mudança: atribui `displayLengthM` 687 ao REQ-FEAT-0006-08, que no F-Spec validado fixa 691 m; DES-0005 e DES-0007 servem 691.
- expected: o texto restrito à versão 1 como histórico. Não condiciona o veredito.

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
- hoje: `scripts/trackPrep.ts:12-21`; `src/tracks/kart-park-v2.json` e `tracks/sources/kart-park-replica.json` ausentes em HEAD
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

- requisitos cobertos: 132 de 132 ativos (137 ids no F-Spec; 5 retirados: REQ-FEAT-0002-03, REQ-FEAT-0003-12, REQ-FEAT-0007-12, REQ-FEAT-0008-28, -29); `sources:` de DES-0010 e DES-0011 sem mudança nesta rodada
- requisitos sem cobertura: nenhum
- itens de projeto sem fonte: nenhum
- critérios sem caminho de teste alcançável: nenhum (AC-US-0004-01 por V13 e AC-US-0007-12 pela guarda de 0,2 m, test-strategy.md 2.0.0)
- D9: nenhum `OPEN-<nn>` nem `TBD`; D6: nenhum segredo, credencial ou token
- status: `status: validated` posto no front matter de DES-0010, DES-0011, 97-changelog.md e 00-index.md; as colunas "Status" da tabela de `00-index.md` são derivadas e ficam para `lint_artifacts.py --emit` do laço
