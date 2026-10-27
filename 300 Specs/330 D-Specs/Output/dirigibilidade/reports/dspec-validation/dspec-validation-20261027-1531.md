---
stage: dspec
feature: dirigibilidade
verdict: SUCCESS
generated: 2026-10-27T15:31:40Z
counts: {blocker: 0, error: 0, warning: 1, info: 4, divergence: 4}
seed: {revision: 3, digest: 7dd24c8b6cab}
upstream: {stage: fspec, version: 3.3.0, status: validated, index-generated: 2026-10-22T19:04:19Z}
feedbacks: []
population: "revalidação após dspec-validation-20261022-1615 (SUCCESS); rodada 8, Mode C (feedback do código feedback-20261022-1803 e FB-01 de race-lap-validation feedback-20261022-1703; F-Spec movido a 3.3.0): ISSUE-01 e ISSUE-02 daquele relatório reverificadas primeiro; arquivos com version movida (git diff contra HEAD): 01-architecture.md 3.0.0, 97-changelog.md 3.0.0, 98-divergences.md 3.0.0, adr/ADR-0002 2.0.0, adr/ADR-0003 1.4.0, adr/ADR-0004 4.0.0, adr/ADR-0005 1.2.0, core/DES-0001 3.3.0, core/DES-0002 1.1.1, core/DES-0003 2.0.0, core/DES-0004 5.0.0, data/DM-0001 2.0.0, test-strategy.md 5.0.0, web/DES-0005 1.0.2, web/DES-0006 1.1.0, web/DES-0007 1.1.0; os dois únicos arquivos intocados (adr/ADR-0001 1.0.1, security/DES-0008 1.0.2) são a amostra; lista de REQ-* (62), AC-* (32), NFR-* (9) e os campos de API-0001, API-0002 e API-0003 do F-Spec comparados por script com sources e corpo dos 14 itens e com test-strategy.md; caminhos de módulo e citações arquivo:linha conferidos por script numa passada (src/physics.ts, src/lap.ts, src/setupRecords.ts, src/main.ts, src/track.ts, src/handlingMessages.ts, index.html, scripts/handlingBench.ts, scripts/keyboard-lap.ts, scripts/physics-bench.ts, tests/*, docs/physics.md); símbolos de relógio e de node:os em scripts/handlingBench.ts por grep; 100 links relativos e 2 blocos mermaid por script; grep de segredos, dado pessoal e TBD/OPEN; FB-01 conferido contra API-0001/API-0002 1.1.0 e 98-divergences.md:36 de race-lap-validation (só nomes de contrato, §12)"
context-ignored: "nenhuma justificativa do gerador chegou pela invocação; 97-changelog.md (versão movida) e as seções Contexto/Alternativas dos ADR foram lidos como conteúdo do artefato; reports/feedback/feedback-20261022-1803.md e reports/feedbacks/race-lap-validation/feedback-20261022-1703.md foram lidos como relatórios da feature (§12), não como justificativa"
---

# Relatório de validação — dirigibilidade (D-Spec)

## Summary

- ISSUE-01 de 1615 (info, I4, chave mestra): sem mudança — `ADR-0001` 1.0.1 intacto, `DES-0001` 3.3.0 Feature flag igual; reportada como ISSUE-02.
- ISSUE-02 de 1615 (info, D3, pontos de entrada de SCR-0002): sem mudança — `DES-0006` 1.1.0 linhas 140-145 e `ADR-0002` 2.0.0 Consequências declaram a redução; reportada como ISSUE-03.
- FB-01 (`race-lap-validation`, 20261022-1703): aceito nos quatro sítios que nomeia (`DES-0003` 2.0.0, `01-architecture.md` 3.0.0, `ADR-0002` 2.0.0, `DM-0001` 2.0.0) e na linha nova de `98-divergences.md`; API-0001 e API-0002 de `race-lap-validation` estão em 1.1.0 e a linha 36 do registro daquela feature declara a linha devida a esta; `src/lap.ts` sem `setupId`/`setupVersion` conferido.
- SPEC-ISSUE-01 e SPEC-ISSUE-02 (código, 20261022-1803): absorvidos pelo F-Spec 3.3.0 (`DOMAIN/DEC-12`, `DOMAIN/DEC-13`) e realizados em `DES-0004` 5.0.0, `ADR-0004` 4.0.0, `ADR-0005` 1.2.0, `DES-0001` 3.3.0, `DM-0001` 2.0.0, `test-strategy.md` 5.0.0, contra as linhas as-built `scripts/handlingBench.ts:273, :311, :344, :355, :363-367, :663, :672`.

## Issues

### ISSUE-01

- severidade: warning
- verificação: D9 — "o que existe hoje em `arquivo:linha`" de cada linha do registro (e D2, verificação de posicionamento contra a árvore)
- arquivo: `98-divergences.md`; `core/DES-0001-acerto-arcade-assistido-v5-e-assistencias.md`; `adr/ADR-0003-linha-de-base-legivel-por-maquina-em-docs-physics.md`; `adr/ADR-0004-ensaios-como-biblioteca-e-parametros-de-ensaio.md`; `adr/ADR-0005-pista-de-teste-como-ambiente-da-simulacao-e-velocidade-mantida.md`
- localização: `98-divergences.md` linha aberta REQ-FEAT-0002-04/-05/-07/-10 (`docs/physics.md:252`) e linhas resolvidas REQ-FEAT-0004-03/-04/-08 (`:253`), REQ-FEAT-0004-05 (`:254`), REQ-FEAT-0005-01 a -04 (`:255-257`), REQ-FEAT-0005-07 (`:259`), REQ-FEAT-0006-04 (`:260`), REQ-FEAT-0003-02 (`src/physics.ts:46`); `DES-0001` linhas 35, 62, 68, 69; `ADR-0003` decisão 2; `ADR-0004` Contexto; `ADR-0005` Consequências
- achado: as citações de `docs/physics.md` apontam uma a seis linhas abaixo do fato — `UNDERSTEER_ONSET` (808 ms, saída a 56,1 km/h) está em `:246`, não `:252`; `GRASS_LOSS` em `:252`, não `:253`; `WALL_CONTACT` em `:253`, não `:254`; `DETERMINISM` em `:254`, fora de `:255-257`; `STEP_CONTRACT` em `:258`, não `:259`; `REALISTA_UNCHANGED` em `:259`, não `:260` —, `forcingRampMps` está em `src/physics.ts:45` (não `:46`) e `RENTAL_KART` começa em `:49` (não `:50`); todas as demais citações `arquivo:linha` da população conferem.
- esperado: renumerar as citações (`docs/physics.md:246`, `:252`, `:253`, `:254`, `:258`, `:259`; `src/physics.ts:45`, `:49-58`) nos sítios listados, sem outra mudança.

### ISSUE-02

- severidade: info
- verificação: D5 — I4 (chave mestra desligada por padrão)
- arquivo: `adr/ADR-0001-versao-do-acerto-como-registro-novo-no-codigo.md`; `core/DES-0001-acerto-arcade-assistido-v5-e-assistencias.md`
- localização: `ADR-0001` linhas 32-37 e 45-46; `DES-0001` linhas 218-226
- achado: sem chave mestra porque FEAT-0005 (Configuração) proíbe configuração para escolher entre o acerto antigo e o novo; o padrão sem mudança de I4 está nos campos opcionais ausentes em `RENTAL_KART`/`ARCADE_KART` (`forcingRampMps` ausente = degrau as-built), com `REALISTA_UNCHANGED` como prova.
- esperado: nada a mudar.

### ISSUE-03

- severidade: info
- verificação: D3 — cobertura do F-Spec nos dois sentidos
- arquivo: `web/DES-0006-resultado-melhor-tempo-e-texto-compartilhado.md`; `adr/ADR-0002-formato-do-replay-e-registro-de-volta-em-memoria.md`
- localização: `DES-0006` linhas 140-145; `ADR-0002` Consequências, primeiro item
- achado: "abrir um tempo ou replay gravado" e "reproduzir um replay" de SCR-0002 sem tela porque nenhuma feature persiste registros; a redução é declarada e `readReplay`/`replayLap` ficam disponíveis; nenhum `REQ-*` afetado.
- esperado: nada a mudar nesta rodada; a feature que persistir registros cobre esse ponto de entrada.

### ISSUE-04

- severidade: info
- verificação: D9 — campos de cada linha de `98-divergences.md`
- arquivo: `98-divergences.md`
- localização: tabela "Linhas resolvidas pela rodada de código 2", 16 linhas
- achado: as linhas `resolved` trazem requisito, exigência, o que resolveu em `arquivo:linha` e estado — o que §6 pede de uma linha resolvida —, mas não a coluna "Item de projeto" que D9 lista para toda linha; nenhum requisito fica sem item de projeto (os 62 `REQ-*` estão em `sources` de ao menos um DES/DM).
- esperado: nada a mudar para o veredito; opcionalmente acrescentar a coluna "Item de projeto" à tabela resolvida, por uniformidade com a tabela aberta.

### ISSUE-05

- severidade: info
- verificação: D3 — contrato API-0003 servido campo a campo
- arquivo: `core/DES-0004-ensaios-de-dirigibilidade-e-saida.md`
- localização: tabela Interface, linha `BenchRecord` (`REFERENCE_CORNER`, `:68-69`); tabela de ensaios, linha `REFERENCE_CORNER`
- achado: o campo obrigatório `throttleCondition` de `REFERENCE_CORNER` (API-0003) é nomeado no item só pelos seus valores (`THROTTLE_ZERO`, `THROTTLE_FULL`); o nome do campo não aparece em `DES-0004`, embora o as-built (`scripts/handlingBench.ts:279`) o carregue e o item afirme "exatamente os campos de API-0003".
- esperado: nomear `throttleCondition` na linha `BenchRecord` de `REFERENCE_CORNER`.

## Divergences

- registro: `98-divergences.md` 3.0.0 — 4 linhas abertas (REQ-FEAT-0002-04/-05/-07/-10; REQ-FEAT-0002-01/-03/-09; REQ-FEAT-0005-05/-06/-08 com API-0002, FB-01; REQ-FEAT-0005-07 e REQ-FEAT-0006-03 com a prova em `npm test`), cada uma com `REQ-*`, exigência, estado atual em `arquivo:linha`, etapa devedora, item de projeto e estado `open`.
- citações conferidas: `scripts/handlingBench.ts:273, :311, :344, :355, :363-367, :468, :663, :672, :729-765`; `scripts/keyboard-lap.ts:25, :41-61`; `scripts/physics-bench.ts:40-47`; `src/lap.ts:23, :25-46, :48-58, :117, :270` sem `setupId`/`setupVersion`; `src/setupRecords.ts:91-93, :108-112`; `src/main.ts:226`; `docs/physics.md:244`; `tests/` sem `dirigibilidade-*.test.ts` nem `fixtures/records.ts`; `docs/handling-device-log.md` ausente.
- linhas resolvidas: 16, cada uma com o `arquivo:linha` que a resolve (citações de `docs/physics.md:253-260` em ISSUE-01); nenhum requisito saiu do registro.
- `waived-pending`: nenhuma.

## Coverage

- Requisitos: 62 de 62 cobertos (REQ-FEAT-0001-01..09, 0002-01..10, 0003-01..12, 0004-01..10, 0005-01..12, 0006-01..09), cada um em `sources` de ao menos um DES/DM; nenhum descoberto.
- NFR: 9 de 9 com mecanismo e métrica (`test-strategy.md` e `DES-0004` Observabilidade).
- API-0001 ↔ `DES-0002`: 11 campos e `NO_STATE`, campo a campo. API-0002 ↔ `DES-0003`: `getSetupVersion`, `readReplay`, `compareLapRecords`, códigos `UNKNOWN_SETUP`, `UNREADABLE`, `UNSUPPORTED_FORMAT`, `INCOMPLETE_RECORD`, campos opcionais com os padrões neutros. API-0003 3.3.0 ↔ `DES-0004` 5.0.0: campo a campo, inclusive `v1Mps` obrigatório no fim natural e condicional nos desfechos reprovados pela saída, `offAsphaltStepCount` informativo de `REFERENCE_CORNER` com `THROTTLE_ZERO`, `MEASUREMENT_MISSING` só antes do segundo patamar completo, `sectorMs` com 4 inteiros, `driftScorePoints`; ISSUE-05 para o nome `throttleCondition`.
- Itens de projeto sem fonte: nenhum (14 itens, todos com `REQ-*`/`FEAT-*` em `sources`; nenhuma fonte fora do F-Spec).
- Critérios sem caminho de teste alcançável: nenhum (32 de 32 `AC-*`; 6 de 6 `FEAT-*` com nível).
- Caminhos novos declarados e ausentes da árvore: `tests/dirigibilidade-*.test.ts`, `tests/fixtures/records.ts`, `docs/handling-device-log.md`; existentes conferidos: `src/physics.ts`, `src/lap.ts`, `src/setupRecords.ts`, `src/handlingMessages.ts`, `src/main.ts`, `src/track.ts`, `src/trackData.ts`, `src/lapTiming.ts`, `src/maneuvers.ts`, `src/lapMessages.ts`, `src/audio.ts`, `src/style.css`, `index.html`, `scripts/handlingBench.ts`, `scripts/keyboard-lap.ts`, `scripts/physics-bench.ts`, `docs/physics.md`, `docs/lap-validation-bench.md`, `tests/fixtures/trackFiles.ts`, `tests/helpers/autopilot.ts`.
- Segredos, dado pessoal, `TBD`, `OPEN-<nn>`: nenhum; `scripts/handlingBench.ts` sem `Date`, `performance`, `Math.random`, `node:os`, `node:perf_hooks` fora de comentário.
- Feedbacks enviados: nenhum.
