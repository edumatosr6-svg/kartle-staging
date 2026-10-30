---
stage: fspec
feature: modelo-kart-01
verdict: SUCCESS
generated: 2026-10-30T12:04:21Z
counts: {blocker: 0, error: 0, warning: 0, info: 0, divergence: 0}
seed: {revision: 3, digest: 20575ff0c316}
upstream: {stage: req, version: 1.4.1}
feedbacks: []
population: "re-validação (conventions §8): ISSUE-01 do relatório anterior fspec-validation-20261030-1157; arquivos com `version:` movida desde ele (2): 02-glossary.md (1.3.0 -> 1.3.1), 97-changelog.md (1.3.0 -> 1.3.1); 00-index.md e 99-traceability.md gerados pelo gate (não re-julgados); dois intocados sorteados: rules/RULE-0002, 98-divergences.md; upstream: requisitos sem mudança desde o relatório anterior (01-context 1.4.1, 02-glossary 1.4.0, todos status validated)"
context-ignored: "nenhuma justificativa recebida do chamador; a justificativa do gerador registrada em 97-changelog.md (rodada 5, inclusive os itens recusados) não foi usada como fundamento; do changelog só se conferiu quais arquivos mudaram"
---

# Relatório de validação do F-Spec — modelo-kart-01

## Summary

- veredito: SUCCESS
- contagens: 0 blocker, 0 error, 0 warning, 0 info, 0 divergence
- ISSUE-01 do relatório anterior: fechada; a linha `lapPhase`, `resumePhase`, `countdownRemainingMs`, `lapKind` de 02-glossary.md dá o domínio de `lapKind` como `OFFICIAL`, `RECON`, `TRAINING`, igual a `getLapState` (race-lap-validation, API-0001); as linhas "Volta oficial" e "Treino" nomeiam cada uma o seu valor e repetem o glossário dos requisitos

## Issues

Nenhuma.

## Divergences

Nenhuma.

## Coverage

- critérios: 40 `AC-*` dos requisitos (AC-US-0001-01 a 16, AC-US-0002-01 a 06, AC-US-0003-01 a 08 e 10 a 14, AC-US-0004-01 a 02, AC-US-0005-01, 04 e 05) realizados por ao menos um `REQ-*`; 0 descobertos; 0 `AC-*` citados que não existam nos requisitos; critérios retirados (AC-US-0003-09, AC-US-0005-02, AC-US-0005-03) não citados em features/
- requisitos sem fonte: nenhum
- NFRs: NFR-0001 a NFR-0007 realizados, 0 adiados, 0 descartados
- contratos sem consumidor: nenhum
- `TBD` e `OPEN-<nn>`: nenhum; 98-divergences.md: nenhuma linha, cabeçalho bem formado
