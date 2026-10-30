---
stage: dspec
feature: dirigibilidade
verdict: SUCCESS
generated: 2026-10-30T13:36:58Z
counts: {blocker: 0, error: 0, warning: 2, info: 4, divergence: 14}
seed: {revision: 5, digest: 48feb6d51bf8}
upstream: {stage: fspec, version: 4.0.1, status: validated, index-generated: 2026-10-30T12:39:45Z}
feedbacks: []
population: "revalidação após dspec-validation-20261030-1326 (FAIL); rodada 11, Mode B: ISSUE-01 a ISSUE-13 daquele relatório reverificadas primeiro; arquivos com version movida: 97-changelog 4.0.0→4.0.1, DES-0001 4.0.0→4.0.1, DES-0003 2.1.0→2.1.1, DES-0004 6.0.0→6.0.1, DM-0001 3.0.0→3.0.1 (lidos inteiros); dois intocados sorteados (random.SystemRandom sobre os 15 restantes): 01-architecture.md 4.0.0 e ADR-0005 2.0.0; campos obrigatórios de API-0003 4.0.1 por benchId conferidos contra a tabela nova de DES-0004; campos de treino de LapResult conferidos contra API-0001 1.2.0 e API-0002 1.2.1 de race-lap-validation (só as linhas dos campos); citações arquivo:linha dos arquivos movidos conferidas na árvore corrente (scripts/handlingBench.ts :94-98, :109-110, :138-149, :156-171, :199-232, :808-821; scripts/keyboard-lap.ts :16-18, :21-40, :32, :42-53; scripts/physics-bench.ts :40-47; src/physics.ts :2-3, :32, :118, :189-200, :223-238, :280, :291-301, :308, :316, :333, :352, :388-399, :414, :442-481; src/lap.ts :24, :31-32, :55-56; src/setupRecords.ts :8-9, :39-108; src/maneuvers.ts, ativação só com held); alvos das cinco issues scope conferidos (ainda presentes); 64 REQ-* do F-Spec cruzados com sources por script; grep de TBD, OPEN-nn e segredos"
context-ignored: "nenhuma justificativa do gerador chegou pela invocação; 97-changelog.md (versão movida) e as seções Contexto/Alternativas de ADR-0005 foram lidos como conteúdo do artefato, não como evidência"
---

# Relatório de validação — dirigibilidade (D-Spec)

## Summary

- ISSUE-01 de 1326 (error, D3, campos obrigatórios na saída da área): resolvida — `DES-0004` linhas 155-170 definem, por `benchId` em `TEST_PAD`, o valor de cada campo que API-0003 4.0.1 torna obrigatório quando a execução para antes do instante de medida; linha 248 remete à tabela; nenhum campo nem valor de enum acrescentado.
- ISSUE-02 de 1326 (error, D4, `LapRecord` sobre `LapResult` 1.2.0): resolvida — `DM-0001` seção 2 cita API-0001 1.2.0 e lista `lapSequenceCount?`, `lapStartMs?`, `trainingLapMs?`, `trainingSectorMs?` com tipo, unidade, nulidade e padrão iguais aos daquele contrato; `DES-0003` Realiza cita API-0001 1.2.0 e API-0002 1.2.1.
- ISSUE-03 de 1326 (warning, D2, `readBaseline`): resolvida — `DES-0004` linha 82 cita `scripts/handlingBench.ts:808-821`, conferido.
- ISSUE-04 de 1326 (warning, D2, corpo de implementação): resolvida — `DES-0001` "Passo sem drift nem turbo" passa a contrato por sítio (o que sai, o que fica) e dois invariantes, sem expressões de substituição.
- ISSUE-05 a ISSUE-08 de 1326 (info): sem mudança; reportadas como ISSUE-01 a ISSUE-04.
- ISSUE-09 a ISSUE-13 de 1326 (scope): alvos ainda presentes na árvore; feedbacks de 20261030-1326 já nas features alvo; reportadas como ISSUE-07 a ISSUE-11, sem novo envio.

## Issues

### ISSUE-01

- severidade: info
- verificação: D5 — I4 (chave mestra desligada por padrão)
- arquivo: `core/DES-0001-acerto-arcade-assistido-v6-e-assistencias.md`; `adr/ADR-0001-versao-do-acerto-como-registro-novo-no-codigo.md`
- localização: `DES-0001` seção Feature flag; `ADR-0001` decisão 5
- achado: sem chave mestra porque FEAT-0003 e FEAT-0005 (Configuração) proíbem configuração para escolher acerto ou religar o drift; padrão sem mudança nos campos opcionais ausentes e na neutralidade da retirada para `Input` sem o comando de drift.
- esperado: nada a mudar.

### ISSUE-02

- severidade: info
- verificação: D3 — cobertura do F-Spec nos dois sentidos
- arquivo: `web/DES-0006-resultado-melhor-tempo-e-texto-compartilhado.md`; `adr/ADR-0002-formato-do-replay-e-registro-de-volta-em-memoria.md`
- localização: `DES-0006` linhas 60-63; `ADR-0002` Consequências, primeiro item
- achado: os pontos de entrada "abrir um tempo ou replay gravado" e "reproduzir um replay" de SCR-0002 seguem sem tela porque nenhuma feature persiste registros; redução declarada; nenhum `REQ-*` afetado.
- esperado: nada a mudar.

### ISSUE-03

- severidade: info
- verificação: D9 — campos de cada linha de `98-divergences.md`
- arquivo: `98-divergences.md`
- localização: tabela "Linhas resolvidas que continuam valendo" (linhas 37-47)
- achado: as sete linhas `resolved` seguem sem a coluna "Item de projeto"; todos os 64 `REQ-*` estão em `sources` de ao menos um DES/DM/ADR.
- esperado: opcionalmente acrescentar a coluna "Item de projeto".

### ISSUE-04

- severidade: info
- verificação: D8 — caminho de teste de cada `AC-*`
- arquivo: `core/DES-0004-ensaios-de-dirigibilidade-e-saida.md`; `adr/ADR-0004-ensaios-como-biblioteca-e-parametros-de-ensaio.md`; `test-strategy.md`
- localização: `DES-0004` linhas 177, 207 e 253; `ADR-0004` Consequências, segundo item; `test-strategy.md` linhas 99-100
- achado: com o acerto C a traseira não solta sob a condição de forçar; AC-US-0003-03, AC-US-0003-04 e REQ-FEAT-0003-09 são alcançados por `REAR_RECOVERY` com `rearReleased` falso (`PASS` por REQ-FEAT-0003-17) e por `judge` sobre registros sintéticos; nenhum teste exercita na física a recuperação de 400 ms com o acerto entregue.
- esperado: nada a mudar no veredito; o F-Spec decide o caso (REQ-FEAT-0003-17).

### ISSUE-05

- severidade: warning
- verificação: D2 — caminho e ponto de posicionamento conferidos
- arquivo: `01-architecture.md`
- localização: tabela "Posicionamento por camada (I2)", linha de `scripts/keyboard-lap.ts`, `scripts/physics-bench.ts` (linha 96)
- achado: a linha declara os dois programas de bench "existentes, inalterados", enquanto `DES-0004` linhas 46-48 e 102 marcam `measureStepCost` de `scripts/keyboard-lap.ts` como **(muda)** (fim do laço no primeiro resultado, em vez de `lap.phase !== 'ENDED'`, hoje `scripts/keyboard-lap.ts:32`).
- esperado: na linha 96, `scripts/keyboard-lap.ts` "existente, alterado" (fim da volta de `measureStepCost`, DES-0004) e `scripts/physics-bench.ts` "existente, inalterado".

### ISSUE-06

- severidade: warning
- verificação: D2 — colaboradores e interface do item conferidos
- arquivo: `01-architecture.md`
- localização: bloco "Fluxo alterado", mensagem `L-->>M: fase ENDED, LapResult com setupId e setupVersion copiados` (linha 151)
- achado: o fluxo põe o resultado da volta na fase `ENDED`; no treino de `race-lap-validation` (API-0001 1.2.0) o resultado chega com a fase em `RUNNING` e `ENDED` só vem por `endTraining`, e `DES-0006` (linha 50), `DES-0003` (`replayLap`) e `DES-0004` (`TEST_PILOT_LAP`) já tratam o gatilho como "resultado novo".
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
- localização: `ADR-0006` decisões 2 e 4; alvo `src/main.ts:559` e ADR-0003 de `modelo-kart-01`, decisão 4
- achado: a condição das marcas de pneu (`tricks.drifting`) perde a sua única situação; nenhuma condição substituta é criada aqui; FB-01 de `modelo-kart-01/reports/feedbacks/dirigibilidade/feedback-20261030-1326.md` pendente.
- esperado: decisão da feature alvo; não entra neste veredito.

### ISSUE-11

- severidade: scope
- verificação: D5 — I3 (versão publicada substituída; leitores fora desta feature)
- arquivo: `adr/ADR-0001-versao-do-acerto-como-registro-novo-no-codigo.md`; `01-architecture.md`
- localização: `ADR-0001` Consequências, terceiro item; alvo `tests/helpers/kart01Report.ts:339-340` e `tests/fixtures/kart01-sim-baseline.json`
- achado: a linha de base da simulação de `modelo-kart-01` passa a `BASELINE_MISSING` com `arcade-assistido-v6`; FB-02 de `modelo-kart-01/reports/feedbacks/dirigibilidade/feedback-20261030-1326.md` pendente.
- esperado: decisão da feature alvo; não entra neste veredito.

## Divergences

- registro: `98-divergences.md` 4.0.0 (intocado) — 14 linhas `open`, cada uma com `REQ-*`, exigência, estado atual em `arquivo:linha`, etapa devedora, item de projeto e estado.
- linhas resolvidas: 7 (ISSUE-03).
- `waived-pending`: nenhuma.

## Coverage

- Requisitos: 64 de 64 em `sources` de ao menos um DES/DM/ADR; nenhum `REQ-*` em `sources` fora do F-Spec 4.0.1.
- API-0003 4.0.1 ↔ `DES-0004`: campos obrigatórios definidos também no caso `TEST_AREA_EXCEEDED` (`STEER_RESPONSE`, `CORNER_RADIUS`, `CORNER_TURN`, `REAR_RECOVERY`, `ACCELERATION`/`TOP_SPEED`, `DRIFT_INERT`).
- `LapResult` 1.2.0 de `race-lap-validation` ↔ `DM-0001` seção 2: quatro campos de treino, campo a campo.
- Itens de projeto sem fonte: nenhum.
- Critérios sem caminho de teste alcançável: nenhum; recuperação física não exercitada com o acerto entregue em ISSUE-04.
- Segredos, dado pessoal, `TBD`, `OPEN-<nn>`: nenhum.
- Feedbacks enviados nesta execução: nenhum (ISSUE-07 a ISSUE-11 já encaminhadas em 20261030-1326).
