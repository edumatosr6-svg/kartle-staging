---
stage: fspec
feature: race-lap-validation
verdict: FAIL
generated: 2026-10-30T12:26:07Z
counts: {blocker: 0, error: 1, warning: 3, info: 1, divergence: 0}
seed: {revision: 3, digest: beee272fdb3b}
upstream: {stage: req, version: 2.3.3}
feedbacks: []
---

# Relatório de validação do F-Spec — race-lap-validation

## Summary

- Rodada: revalidação; relatório anterior `fspec-validation-20261022-1624.md` (SUCCESS, 1 info). Requisitos: `req-validation-20261030-1158.md` (SUCCESS, seed `revision: 3`), todos os arquivos `status: validated`.
- População (conventions §8): issue anterior ISSUE-01; arquivos com `version:` movida: `01-overview.md`, `02-glossary.md`, `97-changelog.md`, `api/API-0001`, `api/API-0002`, `features/FEAT-0001` a `FEAT-0009`, `features/FEAT-0010` (novo), `flows/FLOW-0001` a `FLOW-0004`, `flows/FLOW-0005` (novo), `rules/RULE-0001` a `RULE-0006`, `screens/SCR-0001` a `SCR-0003`; amostra de intocados: `api/API-0003`, `98-divergences.md` (os dois únicos intocados).
- Racional do gerador: nenhum recebido do chamador; as justificativas da rodada 4 em `97-changelog.md` não foram usadas como evidência.
- Itens do gate (front matter, ids, índice, rastreabilidade, arquivos obrigatórios, `OPEN`/`TBD`) não rejulgados (§13).

## Issues

### ISSUE-01

- severidade: info
- verificação: F4 — cobertura dos requisitos nos dois sentidos (`AC-*` citado que não pertence aos requisitos desta feature)
- arquivo: `screens/SCR-0003-resultado-da-volta.md`
- localização: seção "Comparação de tempos", linha 59
- achado: reaberto do relatório anterior, sem mudança: o texto cita `AC-US-0005-05` sem qualificador de feature; nos requisitos desta feature `US-0005` tem só `AC-US-0005-01` a `AC-US-0005-04`.
- esperado: citar o id qualificado (`dirigibilidade/AC-US-0005-05`) ou só `FB-01`, de modo que nenhum `AC-*` fora da lista desta feature apareça no conjunto.

### ISSUE-02

- severidade: error
- verificação: F3 — consistência entre arquivos
- arquivo: `api/API-0003-dado-de-pista.md`
- localização: tabela "Campos do arquivo de pista", linha `sectorLimits` (linha 41)
- achado: o contrato diz "o setor 1 começa no sinal verde", o que contradiz `RULE-0003` (fronteira `b0` = `lapStartMs` nas voltas seguintes do treino) e REQ-FEAT-0002-10 (o primeiro setor começa no início da volta).
- esperado: a linha diz que o setor 1 começa no início da volta — o sinal verde ou, nas voltas seguintes do treino, `lapStartMs` —, como em `RULE-0003`.

### ISSUE-03

- severidade: warning
- verificação: F2 — requisito atômico, com exatamente um de SHALL / SHOULD / MAY
- arquivo: `features/FEAT-0010-voltas-seguidas-no-treino.md`
- localização: REQ-FEAT-0010-31
- achado: o requisito tem dois comportamentos com dois `SHALL NOT`: não produzir resultado na recarga ou no abandono, e não guardar a melhor volta válida além do treino em andamento.
- esperado: cada requisito carrega um comportamento com uma só palavra-chave.

### ISSUE-04

- severidade: warning
- verificação: F3 — consistência entre arquivos
- arquivo: `api/API-0002-comandos-da-volta.md`
- localização: seção "Erros", linhas `LAP_ENDED`, `ALREADY_PAUSED` e `NOT_TRAINING`
- achado: as condições se sobrepõem sem precedência declarada (`endTraining` numa volta oficial `ENDED` cabe em `LAP_ENDED` e em `NOT_TRAINING`; `pauseLap` com `PAUSE_BUTTON` numa volta oficial `PAUSED` cabe em `ALREADY_PAUSED` e em `NOT_TRAINING`), enquanto `RULE-0005` ("Encerrar o treino") dá `NOT_TRAINING` em qualquer fase para `OFFICIAL` e `RECON`.
- esperado: a precedência entre os códigos fica declarada e é a mesma em `API-0002` e em `RULE-0005`, de modo que cada caso tenha um só código.

### ISSUE-05

- severidade: warning
- verificação: F3 — definição órfã
- arquivo: `rules/RULE-0002-estados-da-volta.md`
- localização: tabela "Contadores", linha `sectorsCompletedCount`
- achado: o contador é definido aqui e não é usado em nenhum fluxo, funcionalidade, contrato ou tela (o contrato expõe `completedSectorMs`).
- esperado: o contador é usado onde o conjunto o exige ou deixa de ser definido.

## Divergences

Nenhuma.

## Coverage

- `AC-*` dos requisitos: 99 cobertos, 0 descobertos.
- NFR-0001 a NFR-0012: 12 realizados, 0 descartados.
- Requisitos `REQ-*` sem origem: 0 (160 ids); todo requisito é coberto por um critério da sua funcionalidade.
- Contratos sem consumidor: 0. `listLapResults` (API-0001) é consumido pelas verificações de `npm test` (AC-US-0010-20, AC-US-0010-26) e por nenhum estado de tela.
- Contratos consumidos de fora do conjunto: `compareLapRecords`, `getSetupVersion` e `previousSetupVersion` (`dirigibilidade`, `API-0002`), verificados só pelo nome; todos ainda existem.
