---
stage: fspec
feature: race-lap-validation
verdict: SUCCESS
generated: 2026-10-30T12:27:57Z
counts: {blocker: 0, error: 0, warning: 2, info: 0, divergence: 0}
seed: {revision: 3, digest: beee272fdb3b}
upstream: {stage: req, version: 2.3.3}
feedbacks: []
population: "issues de fspec-validation-20261030-1226.md (ISSUE-01 a ISSUE-05, todas fechadas); arquivos com version movida: screens/SCR-0003 1.2.1, api/API-0003 1.0.2, features/FEAT-0010 1.0.1, api/API-0002 1.2.1, rules/RULE-0005 1.1.1, rules/RULE-0002 1.1.1, 97-changelog.md 1.2.1; amostra aleatória de não tocados: features/FEAT-0009, screens/SCR-0001"
ignored-input: "97-changelog.md, rodada 5 (justificativas do gerador) — não usada como evidência; nenhum racional recebido do chamador"
---

# Relatório de validação do F-Spec — race-lap-validation

## Summary

- Revalidação após Mode B sobre `fspec-validation-20261030-1226.md`; requisitos `status: validated` (`req-validation-20261030-1158.md`, seed `revision: 3`).
- Fechadas: ISSUE-01 (SCR-0003 linha 59 cita `dirigibilidade/AC-US-0005-05`), ISSUE-02 (API-0003 `sectorLimits` concorda com RULE-0003), ISSUE-03 (REQ-FEAT-0010-31 dividido em 31 e 32), ISSUE-04 (precedência única em API-0002 e RULE-0005), ISSUE-05 (`sectorsCompletedCount` removido, sem uso residual).

## Issues

### ISSUE-01

- severidade: warning
- verificação: F2 — todo SHALL coberto por ao menos um critério de aceite
- arquivo: `features/FEAT-0010-voltas-seguidas-no-treino.md`
- localização: "Critérios de aceite", último item ("Chegada na contramão no treino não encerra nem inicia volta; recarregar não produz resultado")
- achado: o critério declara cobrir REQ-FEAT-0010-32, mas o seu texto não traz nenhum observável sobre a melhor volta válida não guardada além do treino em andamento.
- esperado: um critério de aceite enuncia o observável de REQ-FEAT-0010-32 (por exemplo, um novo treino não exibe melhor volta válida antes da sua primeira volta válida).

### ISSUE-02

- severidade: warning
- verificação: F2 — todo SHALL coberto por ao menos um critério de aceite
- arquivo: `features/FEAT-0009-requisitos-transversais.md`
- localização: "Critérios de aceite", quarto item ("Volta concluída com a rede bloqueada; 0 campos pessoais e 0 requisições com dados da volta")
- achado: o critério declara cobrir REQ-FEAT-0009-11 (não gravar no navegador o resultado da volta), mas só enuncia observáveis de rede e de dado pessoal, nada sobre gravação no navegador.
- esperado: um critério de aceite enuncia o observável de REQ-FEAT-0009-11 (nenhum resultado da volta gravado no navegador por esta feature).

## Divergences

Nenhuma.

## Coverage

- `AC-*` dos requisitos: 99 cobertos, 0 descobertos.
- NFR-0001 a NFR-0012: 12 realizados, 0 descartados.
- Requisitos `REQ-*` sem origem: 0 (161 ids).
- Contratos sem consumidor: 0.
