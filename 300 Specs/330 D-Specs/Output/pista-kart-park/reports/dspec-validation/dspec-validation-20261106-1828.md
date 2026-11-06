---
stage: dspec
feature: pista-kart-park
verdict: FAIL
generated: 2026-11-06T18:28:00Z
counts: {blocker: 0, error: 1, warning: 0, info: 3, divergence: 8}
seed: {revision: 3, digest: 1fe5243f7e36}
upstream: {stage: fspec, validation: fspec-validation-20261106-1805, commit: 281b617, status: validated}
feedbacks: []
previous: "dspec-validation-20261103-1946.md (SUCCESS, seed revision 2); primeira validação do Mode A da revisão 3"
population: "todo o conjunto (rodada Mode A, nenhum relatório anterior neste laço); as issues não fechadas do relatório anterior reverificadas (ISSUE-02, ISSUE-06; ISSUE-03 fechado pela base única de 98-divergences.md 2.0.0)"
isolation: "a invocação trouxe só a feature e os caminhos; o raciocínio escrito em 97-changelog.md 1.6.0 foi lido só como texto do conjunto"
---

# Relatório de validação D-Spec — pista-kart-park

## Summary

- verdict: FAIL
- blocker: 0
- error: 1 (ISSUE-01)
- warning: 0
- info: 3 (ISSUE-02, ISSUE-03, ISSUE-04)
- divergence: 8, todas `open`, em `98-divergences.md` 2.0.0

## Issues

### ISSUE-01

- severity: error
- check: D4 — revisão nomeada com reversão declarada (a reversão contradiz o contrato do F-Spec e a imutabilidade do próprio conjunto)
- file: data/DM-0001-arquivo-de-pista-versao-de-esquema-3.md; data/DM-0002-registro-de-publicacao-e-estado-em-memoria.md
- location: DM-0001 2.0.0, "Plano de migração", linhas "Reversão" e "Teste da reversão"; DM-0002 2.0.0, "Plano de migração", linhas "Reversão" e "Teste da reversão"
- finding: a reversão projetada é `git revert` que retira `src/tracks/kart-park-v2.json`, `tracks/sources/kart-park-replica.json` e a entrada `kart-park` 2 do registro, enquanto API-0001 2.0.0 (Compatibilidade) diz que reverter a revisão 3 não edita nenhum arquivo de pista e só a entrada do catálogo do treino volta, e DM-0002 declara que nenhuma entrada entregue (`STAGING` ou `PRODUCTION`) é retirada e DM-0001 que toda versão publicada fica no repositório (I3).
- expected: a reversão devolve só a entrada `kart-park` do catálogo e a importação de `src/main.ts` ao estado anterior, deixando o arquivo da versão 2, a réplica copiada e a entrada 2 do registro intactos, e o teste da reversão afirma que eles continuam presentes e com o resumo registrado.

### ISSUE-02

- severity: info
- check: D5 — I3 (reverificação de ISSUE-02 de dspec-validation-20261103-1946.md)
- file: adr/ADR-0001-esquema-3-do-arquivo-de-pista.md
- location: ADR-0001 1.0.1, "Consequências", segundo item
- finding: sem mudança de texto; ainda afirma que `tests/race-lap-validation-track-data.test.ts:20-21` e `:24-30` "passam a reprovar" e que a mudança é da etapa de testes daquela feature, mudança já aplicada (commit `32d0adf`).
- expected: registrar que a mudança já foi aplicada por `race-lap-validation`, como em 01-architecture.md 2.0.0. Não condiciona o veredito.

### ISSUE-03

- severity: info
- check: D2 — caminho e posição verificados na árvore (reverificação de ISSUE-06 de dspec-validation-20261103-1946.md)
- file: web/DES-0008-desenho-da-kart-park-na-tela-de-corrida.md
- location: DES-0008 3.0.0, tabela "`src/main.ts`, por trecho atual", linha `:289-297` `minimap`, `:363-364` câmera de visão geral; "Comportamento em falha", `src/main.ts:22`
- finding: a versão mudou, mas as três âncoras continuam erradas na árvore de `281b617`: `:22` é linha vazia (a mensagem sem WebGL está em `:30-35`), o minimapa está em `:404-411`, e `:289-297`/`:363-364` não são os trechos nomeados.
- expected: as âncoras da árvore de `281b617`. Não condiciona o veredito.

### ISSUE-04

- severity: info
- check: D2 — caminho e posição verificados na árvore
- file: web/DES-0007-tela-inicial-seletor-credito-e-resultado.md
- location: DES-0007 2.0.0, tabela "`src/main.ts`, por trecho atual", linhas `:152` `idleKart`, `chooseTrack(trackId)`, `:187-207` `renderOffer`, `:208-218` `beginLap`, `renderResult` (`:439-469`, `:465`), `renderHud` (`:408-438`, `:446-464`); "Comportamento em falha", `:454-457`
- finding: 01-architecture.md 2.0.0 declara que as linhas citadas são as da árvore de `281b617`, mas estas são da árvore anterior à feature: em `281b617` `chooseTrack` já existe (`:225`, descrito como "nova função local"), `renderOffer` está em `:253`, `beginLap` em `:309`, `renderHud` em `:425`, `renderResult` em `:489`, `idleKart` em `:563`, o aviso de toque em `:642`, e `lap-result-credit` já não existe em `src/main.ts` nem em `index.html`; só `:13` e `:156` conferem.
- expected: as âncoras da árvore de `281b617`, com os trechos já entregues marcados como existentes e só a importação, as fontes e o aviso de `TRACK_VERSION_MISMATCH` como mudança da revisão 3. Não condiciona o veredito.

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

- requisitos cobertos: 132 de 132 ativos (137 ids no F-Spec, 5 retirados: REQ-FEAT-0002-03, REQ-FEAT-0003-12, REQ-FEAT-0007-12, REQ-FEAT-0008-28, -29, nenhum citado em `sources:`)
- requisitos sem cobertura: nenhum
- itens de projeto sem fonte: nenhum
- critérios sem caminho de teste alcançável: nenhum (78 `AC-*` do F-Spec com linha em test-strategy.md; AC-US-0003-09 marcado retirado)
- D9: nenhum `OPEN-<nn>` nem `TBD`; D6: nenhum segredo, credencial ou token
