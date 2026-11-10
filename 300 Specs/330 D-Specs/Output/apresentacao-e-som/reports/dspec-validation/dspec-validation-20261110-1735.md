---
stage: dspec
feature: apresentacao-e-som
verdict: FAIL
generated: 2026-11-10T17:35:02Z
counts: {blocker: 0, error: 1, warning: 2, info: 0, divergence: 16}
seed: {revision: 2, digest: e7a828ada2d2}
upstream: {stage: fspec, version: n/a, validation: fspec-validation-20261110-1714, status: validated}
feedbacks: ["300 Specs/330 D-Specs/Output/pista-kart-park/reports/feedbacks/apresentacao-e-som/feedback-20261110-1735.md"]
previous: "nenhum (primeira validação)"
population: "conjunto inteiro (primeira validação): 01-architecture, test-strategy, 97-changelog, 98-divergences, DES-0001 a DES-0005, DM-0001, ADR-0001 a ADR-0003, todos 1.0.0"
isolation: "a invocação trouxe só a feature e os caminhos; 97-changelog.md e os ADRs foram lidos como arquivos do conjunto, sem tomar os motivos neles como evidência"
placement: "afirmações de lugar conferidas contra HEAD 5a0dfb3 (src/, index.html, tests/, scripts/ sem mudança local): index.html:4-8, :34; src/audio.ts:5, :10, :28, :29-43, :45-47, :48-53; src/main.ts:147, :187-200, :347-353, :548-561, :584, :586-615, :608; src/lap.ts:10, :188-201; src/physics.ts:59, :69, :81, :140-146, :400-417; package.json:6-16; tests/pista-kart-park-feedback.test.ts:158-185; tests/fixtures/kart01-sim-baseline.json (a361c9c, 2026-10-30); tests/helpers/kartParkPilot.ts; scripts/trackPrep.ts e scripts/track-pipeline.ts; docs/art e docs/sfx (4 origens com os bytes declarados); ausentes e marcados novos: src/assets/, src/soundOutput.ts, scripts/assetBudget.ts, scripts/asset-budget.ts, tests/helpers/soundReport.ts, docs/apresentacao-e-som-device-log.md"
---

# Relatório de validação D-Spec — apresentacao-e-som

## Summary

- verdict: FAIL
- blocker: 0
- error: 1 (ISSUE-01)
- warning: 2 (ISSUE-02, ISSUE-03)
- info: 0
- divergence: 16, todas `open`, em `98-divergences.md` 1.0.0
- scope (fora do veredito): 2 itens enviados a `pista-kart-park` (FB-01, FB-02)
- status: nenhum `status:` alterado (FAIL)

## Issues

### ISSUE-01

- severity: error
- check: D5 — D-DS-01 (todo item de projeto nomeia a sua camada do mapa das diretrizes)
- file: web/DES-0004-verificacoes-registros-e-medida-do-build.md
- location: DES-0004 1.0.0, "Posicionamento", linhas 34-35 ("Camada do mapa: nenhuma"); mesma afirmação em 01-architecture.md 1.0.0, linhas 30-31 ("Fora do cliente")
- finding: o item declara que não pertence a nenhuma camada, e os módulos novos `scripts/assetBudget.ts` e `scripts/asset-budget.ts` ficam sem camada; as diretrizes exigem que cada item seja posto em exatamente uma das quatro camadas e que todo módulo novo seja posto numa delas.
- expected: DES-0004 nomeia uma camada do mapa para o item e para cada módulo novo, com o lugar na árvore (`scripts/`) dito à parte, e a tabela de 01-architecture.md repete a mesma camada.

### ISSUE-02

- severity: warning
- check: D8 — caminho de teste alcançável por critério; nível adequado
- file: test-strategy.md
- location: test-strategy.md 1.0.0, linha de AC-US-0004-04 ("as quatro combinações" de `laidSegment` e `rearOnAsphalt`) e linha de AC-US-0004-01
- finding: a composição `tireMarkingAsphalt = laidSegment && rearOnAsphalt` é montada só dentro de `src/main.ts` (DES-0003), que `npm test` não carrega; o teste unitário das quatro combinações não tem função a chamar, e a regra "a marca é no asfalto" fica provada só por leitura de texto e por E2E-07.
- expected: a linha diz por qual caminho executável as quatro combinações são exercitadas, ou troca o nível declarado para contrato de texto mais roteiro registrado.

### ISSUE-03

- severity: warning
- check: D5 — I10 (módulo novo sem o motivo de o existente não servir)
- file: web/DES-0004-verificacoes-registros-e-medida-do-build.md
- location: DES-0004 1.0.0, "Posicionamento", linhas 29-30 (`tests/helpers/soundReport.ts`, **novo**)
- finding: o ajudante novo é declarado sem a linha que diz por que `tests/helpers/kart01Report.ts`, que já monta e serializa registros da mesma forma, não comporta os três registros.
- expected: uma linha com o motivo de o ajudante ser novo, como as dos outros módulos novos do item.

## Scope — enviado a outra feature (fora do veredito)

### FB-01

- severity: scope
- check: D5 — I3 (retirada com consumidores fora desta feature)
- target: pista-kart-park, D-Spec, `web/DES-0009-retorno-da-zebra-vibracao-e-som.md` 1.2.1
- finding: DES-0003 muda `ENGINE_SOUND` para `{source: 'recording'}` e retira `RaceAudio.toggle()` e `RaceAudio.update()`, que DES-0009 de `pista-kart-park` descreve como estado atual.
- expected: decisão da feature alvo na sua próxima rodada de D-Spec.

### FB-02

- severity: scope
- check: D5 — I3 (retirada com consumidores fora desta feature)
- target: pista-kart-park, D-Spec, `test-strategy.md`; a jusante, `tests/pista-kart-park-feedback.test.ts:165-169`, `:182`
- finding: CHK-TEST-0008-07 afirma `toggle()` e um motor oscilador do tipo `ENGINE_SOUND.source`; test-strategy.md deste conjunto migra essas linhas sob o mesmo identificador.
- expected: decisão da feature alvo na sua próxima rodada de D-Spec.

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

- requisitos cobertos: 46 de 46 (FEAT-0001: 4; FEAT-0002: 7; FEAT-0003: 12; FEAT-0004: 7; FEAT-0005: 16)
- requisitos sem cobertura: nenhum
- itens de projeto sem fonte: nenhum
- critérios sem caminho de teste alcançável: nenhum; AC-US-0004-04 com caminho unitário parcial (ISSUE-02)
- contratos: API-0001 (5 declarações), API-0002 (8 campos, `setSoundOn`), API-0003 (4 registros, 11 motivos) sem diferença de campo
- D9: nenhum `OPEN-<nn>` nem `TBD`; D6: nenhum segredo, credencial ou token
