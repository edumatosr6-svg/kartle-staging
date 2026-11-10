---
stage: dspec
feature: apresentacao-e-som
verdict: SUCCESS
generated: 2026-11-10T17:42:57Z
counts: {blocker: 0, error: 0, warning: 0, info: 0, divergence: 16}
seed: {revision: 2, digest: e7a828ada2d2}
upstream: {stage: fspec, version: n/a, validation: fspec-validation-20261110-1714, status: validated}
feedbacks: []
previous: "reports/dspec-validation/dspec-validation-20261110-1735.md (FAIL: 1 error, 2 warning)"
population: "revalidação (§8): ISSUE-01, ISSUE-02, ISSUE-03 do relatório anterior; arquivos com version movida: web/DES-0004 1.0.1, 01-architecture 1.0.1, security/DES-0005 1.0.1, test-strategy 1.0.1, 97-changelog 1.0.1; dois intocados sorteados: adr/ADR-0003 1.0.0, data/DM-0001 1.0.0"
isolation: "a invocação trouxe só a feature e os caminhos; 97-changelog.md e ADR-0003 foram lidos como arquivos do conjunto, sem tomar os motivos neles como evidência"
placement: "afirmações de lugar da população conferidas contra HEAD 5a0dfb3 (src/, index.html, tests/, scripts/, package.json sem mudança local): package.json:6-16; src/lap.ts:188-201; src/audio.ts:51-52; src/main.ts:555, :584, :586-615; tests/helpers/kart01Report.ts (importa three; CheckId, CheckRecord); tests/helpers/kartParkPilot.ts; tests/fixtures/kart01-sim-baseline.json (recordedOnCommit a361c9c, 2026-10-30); tests/pista-kart-park-feedback.test.ts:158-185; scripts/trackPrep.ts e scripts/track-pipeline.ts; docs/art e docs/sfx (4 origens com os bytes declarados); ausentes e marcados novos: src/assets/, src/soundOutput.ts, scripts/assetBudget.ts, scripts/asset-budget.ts, tests/helpers/soundReport.ts, docs/apresentacao-e-som-device-log.md"
---

# Relatório de validação D-Spec — apresentacao-e-som

## Summary

- verdict: SUCCESS
- blocker: 0
- error: 0
- warning: 0
- info: 0
- divergence: 16, todas `open`, em `98-divergences.md` 1.0.0
- scope (fora do veredito): nenhum item novo; FB-01 e FB-02 de `feedback-20261110-1735.md` seguem pendentes em `pista-kart-park`
- status: `status: validated` em todo arquivo do conjunto

## Issues

Nenhuma.

## Issues do relatório anterior

### ISSUE-01

- severity: error
- check: D5 — D-DS-01
- file: web/DES-0004-verificacoes-registros-e-medida-do-build.md
- state: fechada
- evidence: DES-0004 1.0.1, "Posicionamento", linhas 22-43 (camada aplicação para o item e para cada módulo novo, árvore dita à parte); 01-architecture.md 1.0.1, linhas 30-32; DES-0005 1.0.1, linhas 25-26.

### ISSUE-02

- severity: warning
- check: D8
- file: test-strategy.md
- state: fechada
- evidence: test-strategy.md 1.0.1, linhas de AC-US-0004-01 e AC-US-0004-04: nível da composição declarado como contrato de texto mais E2E-07; a unidade fica com `decideSoundOutput`.

### ISSUE-03

- severity: warning
- check: D5 — I10
- file: web/DES-0004-verificacoes-registros-e-medida-do-build.md
- state: fechada
- evidence: DES-0004 1.0.1, linhas 31-36: motivo de `tests/helpers/soundReport.ts` ser novo; conferido contra `tests/helpers/kart01Report.ts` (importa `three`, tipos `CheckId` e `CheckRecord`).

## Divergences

### REQ-FEAT-0001-01, -02, -03, -04
- estado: open
- hoje: `index.html:4-8`; `src/assets/` ausente
- fecha: DES-0001, DM-0001

### REQ-FEAT-0002-01 a -06
- estado: open
- hoje: `index.html:7-8`
- fecha: DES-0001, DM-0001

### REQ-FEAT-0003-10, -11
- estado: open
- hoje: `src/audio.ts:5`, `:32-36`, `:51`
- fecha: DES-0003, ADR-0002

### REQ-FEAT-0003-04, -05
- estado: open
- hoje: `src/audio.ts:52`
- fecha: DES-0002, DES-0003

### REQ-FEAT-0003-06
- estado: open
- hoje: `src/main.ts:197-200`, `:584`; `src/lap.ts:188-201`
- fecha: DES-0002, DES-0003, ADR-0003

### REQ-FEAT-0003-07
- estado: open
- hoje: `src/audio.ts:41`
- fecha: DES-0003

### REQ-FEAT-0003-02, -03
- estado: open
- hoje: `src/audio.ts:51-52`
- fecha: DES-0002, DES-0003

### REQ-FEAT-0003-09
- estado: open
- hoje: `src/audio.ts:29-43`; `src/main.ts:349`
- fecha: DES-0003

### REQ-FEAT-0003-12
- estado: open
- hoje: `src/main.ts:348-352`
- fecha: DES-0003

### REQ-FEAT-0004-01 a -07
- estado: open
- hoje: `src/main.ts:586-615`; `src/audio.ts` sem som de pneu
- fecha: DES-0002, DES-0003, ADR-0003

### REQ-FEAT-0005-02, -04
- estado: open
- hoje: nenhuma forma entregue em `dist/`; origens de `docs/art/` e `docs/sfx/` fora do controle de versão
- fecha: DES-0001, DM-0001, ADR-0001

### REQ-FEAT-0005-01, -02, -04, -10, -12 (`ASSET_BUDGET`)
- estado: open
- hoje: `package.json:6-14`
- fecha: DES-0004

### REQ-FEAT-0005-06, -07, -14, -15
- estado: open
- hoje: `tests/apresentacao-e-som-*.test.ts` ausente
- fecha: DES-0004

### REQ-FEAT-0005-11
- estado: open
- hoje: `tests/pista-kart-park-feedback.test.ts:165-169`, `:182`
- fecha: DES-0003, test-strategy.md

### REQ-FEAT-0005-03, -05, -08, -09, -13
- estado: open
- hoje: `docs/apresentacao-e-som-device-log.md` ausente
- fecha: DES-0004, DES-0005

### REQ-FEAT-0005-16
- estado: open
- hoje: confirmação da licença não registrada (`LICENSE_PENDING`)
- fecha: DES-0005

## Coverage

- requisitos cobertos: 46 de 46 (contagem do relatório anterior; `sources:` dos itens de projeto não mudaram nesta rodada)
- requisitos sem cobertura: nenhum
- itens de projeto sem fonte: nenhum
- critérios sem caminho de teste alcançável: nenhum
- D9: nenhum `OPEN-<nn>` nem `TBD`; nenhuma linha `waived-pending`
