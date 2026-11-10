---
stage: dspec
feature: apresentacao-e-som
verdict: SUCCESS
generated: 2026-11-10T17:59:29Z
counts: {blocker: 0, error: 0, warning: 0, info: 0, divergence: 16}
seed: {revision: 2, digest: e7a828ada2d2}
upstream: {stage: fspec, version: n/a, validation: fspec-validation-20261110-1714, status: validated}
feedbacks: []
previous: "reports/dspec-validation/dspec-validation-20261110-1741.md (SUCCESS: nenhuma issue)"
population: "revalidação (§8): o relatório anterior não tem issue aberta; arquivos com version movida para 1.1.0: 01-architecture, test-strategy, 97-changelog, adr/ADR-0001, adr/ADR-0003, data/DM-0001, security/DES-0005, web/DES-0001, web/DES-0003, web/DES-0004; dois intocados sorteados entre os três restantes: 98-divergences 1.0.0, web/DES-0002 1.0.0; fora da população: adr/ADR-0002 1.0.0"
isolation: "a invocação trouxe só a feature e os caminhos; 97-changelog.md, ADR-0001 e ADR-0003 foram lidos como arquivos do conjunto e trazem motivos e uma decisão atribuída ao dono do produto, que não foram tomados como evidência; reports/feedback/feedback-20261110-1745.md não foi lido"
placement: "afirmações de lugar da população conferidas contra HEAD 5a0dfb3 (src/, index.html, tests/, scripts/, package.json sem mudança local): index.html:4-8, :34; package.json:6-16; src/audio.ts:5, :10, :28, :29-43, :45-47, :48-53; src/main.ts:13, :147, :187-200, :347-353, :548-561, :584, :586-615, :608; src/lap.ts:10, :188-201; src/physics.ts:59, :69, :81, :140-146, :400-417; src/rawImports.d.ts (declara só *.json?raw); tests/pista-kart-park-layering.test.ts:37-38, :58-66, :109-118 (importações de src/main.ts e src/audio.ts têm de começar por ., three ou node:); tests/race-lap-validation-layering.test.ts:15, :43-47; tests/pista-kart-park-feedback.test.ts:158-185; node_modules/vite/dist/node/chunks/node.js (inlineRE presente); scripts/trackPrep.ts e scripts/track-pipeline.ts; tests/helpers/kart01Report.ts e kartParkPilot.ts; ausentes e marcados novos: src/assets/, src/soundOutput.ts, scripts/assetBudget.ts, scripts/asset-budget.ts, tests/helpers/soundReport.ts, docs/apresentacao-e-som-device-log.md"
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

Nenhuma (relatório anterior: SUCCESS, sem issue).

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

- requisitos cobertos: 46 de 46 (recontados nos `sources:` de DES-0001 a DES-0005)
- requisitos sem cobertura: nenhum
- itens de projeto sem fonte: nenhum
- critérios sem caminho de teste alcançável: nenhum (28 `AC-US-*` e NFR-0001 a NFR-0010 com linha em test-strategy.md 1.1.0)
- contratos: API-0001 (5 declarações), API-0002 (8 campos, `setSoundOn`), API-0003 (4 registros, 11 motivos) sem diferença de campo
- D9: nenhum `OPEN-<nn>` nem `TBD`; nenhuma linha `waived-pending`; D6: nenhum segredo, credencial ou token
