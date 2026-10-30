---
stage: dspec
feature: dirigibilidade
verdict: SUCCESS
generated: 2026-10-30T15:35:33Z
counts: {blocker: 0, error: 0, warning: 5, info: 4, divergence: 3}
seed: {revision: 6, digest: dbf86f325606}
upstream: {stage: fspec, version: 4.1.0, status: validated, index-generated: 2026-10-30T15:20:10Z}
feedbacks: []
population: "revalidação após dspec-validation-20261030-1333 (SUCCESS); rodada 12, Mode C: ISSUE-01 a ISSUE-11 daquele relatório reverificadas primeiro; arquivos com version movida ou novos: 01-architecture 4.1.0, 98-divergences 4.1.0, test-strategy 6.1.0, DM-0001 3.0.2, DES-0005 2.0.1, DES-0007 1.3.0, DES-0009 1.0.0 (novo), lidos inteiros; 97-changelog 4.1.0 só pela lista de títulos; 00-index e 99-traceability gerados pelo gate; dois intocados sorteados (shuf sobre os doze restantes): ADR-0003 2.0.0 e ADR-0005 2.0.0; citações arquivo:linha dos arquivos movidos conferidas na árvore corrente (index.html :18, :19, :25, :28-32, :34, :35, :39; src/style.css :3, :5, :7; src/main.ts :2-5, :33, :130, :162, :318-329, :341-348, :376-412, :522, :543-556, :570, :589-595, :605-624, :630-658; src/physics.ts :9, :55, :67, :79, :92, :98-106; src/setupRecords.ts :15-21, :119; scripts/keyboard-lap.ts :32; tests/maneuvers.test.ts :66-70); consumidores de .maneuver-guide, .control-hint, data-control e #welcome procurados em src, tests e scripts; 68 REQ-* do F-Spec 4.1.0 cruzados com sources por script; NFR-0001 a NFR-0009 em sources; grep de TBD, OPEN-nn e segredos"
context-ignored: "a tarefa descreveu o que a rodada mudou (DES-0009 novo, botão Drift retirado, #lap-end-training a manter), usado só como orientação de população; git status, linhas de commit e notas de memória presentes no ambiente desconsideradas; 97-changelog.md não lido além dos títulos; as seções Contexto/Alternativas de ADR-0003 e ADR-0005 lidas como conteúdo do artefato, não como evidência"
---

# Relatório de validação — dirigibilidade (D-Spec)

## Summary

- ISSUE-01 a ISSUE-04 de 1333 (info): sem mudança; reportadas como ISSUE-01 a ISSUE-04.
- ISSUE-05 de 1333 (warning): não resolvida — `01-architecture.md` linha 104 inalterada; reportada como ISSUE-05.
- ISSUE-06 de 1333 (warning): não resolvida — `01-architecture.md` linha 159 inalterada; reportada como ISSUE-06.
- ISSUE-07 a ISSUE-11 de 1333 (scope): alvos ainda presentes; feedbacks de 20261030-1326 ainda nas features alvo; reportadas como ISSUE-07 a ISSUE-11, sem novo envio; alvo de ISSUE-10 hoje em `src/main.ts:595`.
- Novas: ISSUE-12 a ISSUE-14 (warning).

## Issues

### ISSUE-01

- severidade: info
- verificação: D5 — I4 (chave mestra desligada por padrão)
- arquivo: `core/DES-0001-acerto-arcade-assistido-v6-e-assistencias.md`; `adr/ADR-0001-versao-do-acerto-como-registro-novo-no-codigo.md`
- localização: `DES-0001` seção Feature flag; `ADR-0001` decisão 5
- achado: sem chave mestra porque FEAT-0003 e FEAT-0005 (Configuração) proíbem configuração para escolher acerto ou religar o drift; DES-0007 e DES-0009 seguem a mesma razão para a retirada do botão e dos textos.
- esperado: nada a mudar.

### ISSUE-02

- severidade: info
- verificação: D3 — cobertura do F-Spec nos dois sentidos
- arquivo: `web/DES-0006-resultado-melhor-tempo-e-texto-compartilhado.md`; `adr/ADR-0002-formato-do-replay-e-registro-de-volta-em-memoria.md`
- localização: `DES-0006` linhas 60-63; `ADR-0002` Consequências, primeiro item
- achado: os pontos de entrada "abrir um tempo ou replay gravado" e "reproduzir um replay" de SCR-0002 seguem sem tela porque nenhuma feature persiste registros; nenhum `REQ-*` afetado.
- esperado: nada a mudar.

### ISSUE-03

- severidade: info
- verificação: D9 — campos de cada linha de `98-divergences.md`
- arquivo: `98-divergences.md`
- localização: tabela "Linhas resolvidas que continuam valendo" (linhas 41-49)
- achado: as sete linhas `resolved` seguem sem a coluna "Item de projeto"; todos os 68 `REQ-*` estão em `sources` de ao menos um DES/DM/ADR.
- esperado: opcionalmente acrescentar a coluna "Item de projeto".

### ISSUE-04

- severidade: info
- verificação: D8 — caminho de teste de cada `AC-*`
- arquivo: `core/DES-0004-ensaios-de-dirigibilidade-e-saida.md`; `adr/ADR-0004-ensaios-como-biblioteca-e-parametros-de-ensaio.md`; `test-strategy.md`
- localização: `DES-0004` linhas 177, 207 e 253; `ADR-0004` Consequências, segundo item; `test-strategy.md` linhas 100-101
- achado: com o acerto C a traseira não solta sob a condição de forçar; AC-US-0003-03, AC-US-0003-04 e REQ-FEAT-0003-09 são alcançados por `REAR_RECOVERY` com `rearReleased` falso e por `judge` sobre registros sintéticos; nenhum teste exercita na física a recuperação de 400 ms com o acerto entregue.
- esperado: nada a mudar no veredito; o F-Spec decide o caso (REQ-FEAT-0003-17).

### ISSUE-05

- severidade: warning
- verificação: D2 — caminho e ponto de posicionamento conferidos
- arquivo: `01-architecture.md`
- localização: tabela "Posicionamento por camada (I2)", linha de `scripts/keyboard-lap.ts`, `scripts/physics-bench.ts` (linha 104)
- achado: a linha declara os dois programas de bench "existentes, inalterados", enquanto `DES-0004` linhas 46-48 e 102 marcam `measureStepCost` de `scripts/keyboard-lap.ts` como **(muda)**.
- esperado: `scripts/keyboard-lap.ts` "existente, alterado" (fim da volta de `measureStepCost`, DES-0004) e `scripts/physics-bench.ts` "existente, inalterado".

### ISSUE-06

- severidade: warning
- verificação: D2 — colaboradores e interface do item conferidos
- arquivo: `01-architecture.md`
- localização: bloco "Fluxo alterado", mensagem `L-->>M: fase ENDED, LapResult com setupId e setupVersion copiados` (linha 159)
- achado: o fluxo põe o resultado da volta na fase `ENDED`; no treino de `race-lap-validation` o resultado chega com a fase em `RUNNING`, e `DES-0006`, `DES-0003` (`replayLap`), `DES-0004` (`TEST_PILOT_LAP`) e `test-strategy.md` (linhas 25-32) tratam o gatilho como "primeiro resultado".
- esperado: trocar a mensagem por "novo LapResult (getLapResult), com setupId e setupVersion copiados", sem mudar participantes.

### ISSUE-07

- severidade: scope
- verificação: D5 — I3 (retirada exigida pelo F-Spec; consumidores fora desta feature)
- arquivo: `adr/ADR-0006-retirada-do-drift-e-do-turbo-com-janela-de-compatibilidade.md`
- localização: decisão 4; alvo `tests/race-lap-validation-layering.test.ts:9`
- achado: a retirada final de `src/maneuvers.ts` depende de `race-lap-validation` deixar de nomear `maneuvers.ts` em `SIMULATION`; alvo ainda presente; FB-01 de `race-lap-validation/reports/feedbacks/dirigibilidade/feedback-20261030-1326.md` pendente.
- esperado: decisão da feature alvo; não entra neste veredito.

### ISSUE-08

- severidade: scope
- verificação: D5 — I3 (retirada exigida pelo F-Spec; consumidores fora desta feature)
- arquivo: `adr/ADR-0006-retirada-do-drift-e-do-turbo-com-janela-de-compatibilidade.md`
- localização: decisão 4; alvo `tests/pista-kart-park-layering.test.ts:18`
- achado: mesma condição de retirada final em `pista-kart-park`; alvo ainda presente; FB-01 de `pista-kart-park/reports/feedbacks/dirigibilidade/feedback-20261030-1326.md` pendente.
- esperado: decisão da feature alvo; não entra neste veredito.

### ISSUE-09

- severidade: scope
- verificação: D5 — I3 (versão publicada substituída; leitores fora desta feature)
- arquivo: `01-architecture.md`; `core/DES-0001-acerto-arcade-assistido-v6-e-assistencias.md`
- localização: "Efeito sobre outras features", linha `pista-kart-park`; alvo `tests/pista-kart-park-surface.test.ts:19-20`
- achado: as verificações que leem `PUBLISHED_SETUPS.ARCADE_ASSISTIDO.config` passam a pilotar o acerto C; FB-02 de `pista-kart-park/reports/feedbacks/dirigibilidade/feedback-20261030-1326.md` pendente.
- esperado: decisão da feature alvo; não entra neste veredito.

### ISSUE-10

- severidade: scope
- verificação: D5 — I3 (retirada exigida pelo F-Spec; leitores fora desta feature)
- arquivo: `adr/ADR-0006-retirada-do-drift-e-do-turbo-com-janela-de-compatibilidade.md`; `01-architecture.md`
- localização: `ADR-0006` decisões 2 e 4; alvo `src/main.ts:595` (antes `:559`), `tests/modelo-kart-01-contract.test.ts:78-80` e ADR-0003 de `modelo-kart-01`, decisão 4
- achado: a condição das marcas de pneu (`tricks.drifting`) perde a sua única situação; nenhuma condição substituta é criada aqui; FB-01 de `modelo-kart-01/reports/feedbacks/dirigibilidade/feedback-20261030-1326.md` pendente.
- esperado: decisão da feature alvo; não entra neste veredito.

### ISSUE-11

- severidade: scope
- verificação: D5 — I3 (versão publicada substituída; leitores fora desta feature)
- arquivo: `adr/ADR-0001-versao-do-acerto-como-registro-novo-no-codigo.md`; `01-architecture.md`
- localização: `ADR-0001` Consequências, terceiro item; alvo `tests/helpers/kart01Report.ts:339-340` e `tests/fixtures/kart01-sim-baseline.json`
- achado: a linha de base da simulação de `modelo-kart-01` passa a `BASELINE_MISSING` com `arcade-assistido-v6`; FB-02 de `modelo-kart-01/reports/feedbacks/dirigibilidade/feedback-20261030-1326.md` pendente.
- esperado: decisão da feature alvo; não entra neste veredito.

### ISSUE-12

- severidade: warning
- verificação: D2 — ponto de posicionamento conferido na árvore
- arquivo: `01-architecture.md`
- localização: parágrafo "Estado do código lido como as-built nesta rodada" (linhas 69-81); tabela "Efeito sobre outras features", linha `modelo-kart-01` (linha 197, `src/main.ts:555`, `:586`, `:559`)
- achado: o parágrafo descreve a árvore como a do projeto 3.1.0 (`ARCADE_ASSISTIDO_V5` só, `PUBLISHED_SETUPS` em v5 em `src/physics.ts:98-106`, drift em `:223-238`/`:280-301`, `driftActive` em `:444`, `src/main.ts` de 646 linhas com o HUD do drift em `:613-624`, `index.html:18`/`:30` com os elementos do drift, dez testes), mas a árvore corrente tem `ARCADE_ASSISTIDO_V6` em `src/physics.ts:92`, `PUBLISHED_SETUPS` em `arcade-assistido-v6` (`:104`), nenhum `drifting`/`boosting`/`driftActive`, 440 linhas, `src/main.ts` de 676 linhas sem HUD do drift, `index.html` sem `style-score`/`drift-hud`/`lap-result-setup` e nove `tests/dirigibilidade-*.test.ts`; as linhas citadas de `modelo-kart-01` estão hoje em `src/main.ts:589-595` e `:622`.
- esperado: o parágrafo e a linha 197 descrevem a árvore de 2026-10-30 lida nesta rodada, com as linhas que ela tem.

### ISSUE-13

- severidade: warning
- verificação: D9 — campos de cada linha de `98-divergences.md` (o que existe hoje em `arquivo:linha`)
- arquivo: `98-divergences.md`
- localização: linha 14 (cabeçalho: "a árvore corrente, que implementa o projeto 3.1.0"); linhas abertas 22-31 e 34-37
- achado: treze linhas `open` citam como "o que o sistema faz hoje" estados ausentes da árvore corrente — p. ex. `src/physics.ts:79-89` "só tem `ARCADE_ASSISTIDO_V5`" (há `ARCADE_ASSISTIDO_V6` em `:92`), `index.html:18`/`:30` com `#style-score`/`#drift-hud` (ausentes), `src/handlingMessages.ts:9` com a `setupVersion` (ausente), `index.html:25` com `#lap-result-setup` (hoje `#lap-best-valid`), `scripts/keyboard-lap.ts:32` parando em `ENDED` (hoje fim no primeiro resultado), `tests/maneuvers.test.ts:68-80` "player-induced drift" (hoje "realistic preset ignores the drift input"); só as linhas 32 e 33 e a parte de `docs/handling-device-log.md` da linha 37 batem com a árvore.
- esperado: cada linha aberta cita o que a árvore de 2026-10-30 faz em `arquivo:linha`; uma linha cujo requisito a árvore já satisfaz passa a `resolved` com o que a resolveu.

### ISSUE-14

- severidade: warning
- verificação: D2 — ponto de posicionamento conferido na árvore
- arquivo: `web/DES-0005-hud-velocidade-e-aderencia.md`
- localização: Posicionamento (linha 26); Interface, tabela de leitura (linhas 35-38) e tabela "Retirada da exibição do drift e do turbo" (linhas 46-50)
- achado: as citações não são da árvore corrente — `#handling` e `#speed` estão em `index.html:30` e `:31` (não `:28`/`:29`), `getHandlingTelemetry` em `src/main.ts:647` (não `:605`), `state` em `:570` (não `:522`) — e os sítios da retirada (`index.html:18` `.style-score`, `:30` `#drift-hud`, `src/main.ts:5` import de `./maneuvers`, `:500-506`, `:613-624`) não contêm mais esses elementos.
- esperado: as linhas de leitura citam a árvore de 2026-10-30, e a tabela da retirada registra que esses sítios já não existem na árvore (estado-alvo atingido), sem citar linhas que hoje têm outro conteúdo.

## Divergences

- registro: `98-divergences.md` 4.1.0 — 16 linhas `open`; três confirmadas na árvore corrente: REQ-FEAT-0003-18 a -20 (`index.html:19`, `:34`, `:35`; `src/style.css:3`), REQ-FEAT-0003-21 (`index.html:32`; `src/main.ts:549`, `:655-656`; `src/style.css:3`) e a das provas (`docs/handling-device-log.md` ausente; `tests/dirigibilidade-hud-text.test.ts` sem as verificações de AC-US-0003-12 a -15); as outras treze citam estado ausente da árvore (ISSUE-13).
- linhas resolvidas: 7 (ISSUE-03).
- `waived-pending`: nenhuma.

## Coverage

- Requisitos: 68 de 68 em `sources` de ao menos um DES/DM/ADR; REQ-FEAT-0003-18, -19, -20 em `DES-0009`, REQ-FEAT-0003-21 em `DES-0007`; nenhum `REQ-*` em `sources` fora do F-Spec 4.1.0.
- NFR: NFR-0001 a NFR-0009 em `sources` e em `test-strategy.md`, seção "Requisitos não funcionais".
- SCR-0003 1.0.0 ↔ `DES-0009`: três telas mapeadas a `#welcome`, `.control-hint` e `.maneuver-guide` (estado Vazio), conferidas em `index.html:19`, `:34`, `:35` e `src/style.css:3`; `#lap-end-training` e os demais botões de `.actions` fora da edição.
- SCR-0001 1.2.0 (controle de toque) ↔ `DES-0007`: botão, leitura `touch.has('drift')`, consulta `:655-656` e regra de estilo retirados juntos; nenhum leitor do botão fora desta feature.
- Itens de projeto sem fonte: nenhum.
- Critérios sem caminho de teste alcançável: nenhum; AC-US-0003-12 a -15 por `hud-text` (C) e E2E-04.
- Segredos, dado pessoal, `TBD`, `OPEN-<nn>`: nenhum.
- Feedbacks enviados nesta execução: nenhum (ISSUE-07 a ISSUE-11 já encaminhadas em 20261030-1326).
