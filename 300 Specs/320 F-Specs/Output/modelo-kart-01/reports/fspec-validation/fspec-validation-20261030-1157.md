---
stage: fspec
feature: modelo-kart-01
verdict: FAIL
generated: 2026-10-30T11:57:30Z
counts: {blocker: 0, error: 1, warning: 0, info: 0, divergence: 0}
seed: {revision: 3, digest: 20575ff0c316}
upstream: {stage: req, version: 1.4.1}
feedbacks: []
population: "re-validação (conventions §8): relatório anterior fspec-validation-20261027-1520 sem issues; arquivos com `version:` movida desde ele (12): 01-overview.md, 02-glossary.md, 97-changelog.md (1.2.0 -> 1.3.0), api/API-0003 (1.0.0 -> 2.0.0), features/FEAT-0002 (1.0.0 -> 1.1.0), features/FEAT-0003 (1.2.0 -> 1.3.0), features/FEAT-0005 (1.0.0 -> 2.0.0), flows/FLOW-0001, flows/FLOW-0002, rules/RULE-0002, screens/SCR-0001 (1.2.0 -> 1.3.0), rules/RULE-0003 (1.0.0 -> 1.1.0); 00-index.md e 99-traceability.md gerados pelo gate (não re-julgados); dois intocados sorteados: features/FEAT-0001, rules/RULE-0001; upstream: requisitos validados em req-validation-20261030-0234 (01-context 1.4.1, US-0002 1.2.1, US-0003 1.4.0, US-0005 2.0.1, 02-glossary 1.4.0)"
context-ignored: "nenhuma justificativa recebida do chamador; a justificativa do gerador registrada nos changelogs (97-changelog.md deste conjunto, rodada 4, e 97-changelog.md dos requisitos) não foi usada como fundamento; do changelog dos requisitos só se conferiu a existência das recusas citadas na seção Lacunas deliberadas de 01-overview.md"
---

# Relatório de validação do F-Spec — modelo-kart-01

## Summary

- veredito: FAIL
- contagens: 0 blocker, 1 error, 0 warning, 0 info, 0 divergence

## Issues

### ISSUE-01

- severity: error
- check: F5 (I3 — domínio de valores de campo existente redefinido sob o mesmo nome)
- file: 02-glossary.md
- location: seção "Enums e campos dos contratos", linha `lapPhase`, `resumePhase`, `countdownRemainingMs`, `lapKind`; e as linhas "Volta oficial" e "Treino" da seção "Termos de domínio"
- finding: a linha dá o domínio de `lapKind`, nomeado do contrato `getLapState` de `race-lap-validation` como "nomeado e não redefinido", só como `OFFICIAL` e `TRAINING`, mas aquele contrato o define com três valores (`OFFICIAL`, `RECON`, `TRAINING`), então o domínio fica reduzido sob o mesmo nome.
- expected: a linha de `lapKind` dá o domínio exatamente como `getLapState` o nomeia (`OFFICIAL`, `RECON`, `TRAINING`), e nenhuma linha do glossário dá a entender que `lapKind` tem só dois valores.

## Divergences

Nenhuma.

## Coverage

- critérios: 40 `AC-*` dos requisitos (AC-US-0001-01 a 16, AC-US-0002-01 a 06, AC-US-0003-01 a 08 e 10 a 14, AC-US-0004-01 a 02, AC-US-0005-01, 04 e 05) realizados por ao menos um `REQ-*`; 0 descobertos; 0 `AC-*` citados que não existam nos requisitos; critérios retirados (AC-US-0003-09, AC-US-0005-02, AC-US-0005-03) não citados em nenhum artefato normativo
- requisitos sem fonte: nenhum; REQ-FEAT-0003-10 e REQ-FEAT-0005-02 e 03 marcados retirados, números não reaproveitados
- NFRs: NFR-0001 a NFR-0007 realizados, 0 adiados, 0 descartados
- contratos sem consumidor: nenhum; API-0003 2.0.0 retira `baseVerticalFovDeg` e `turboFovDeltaDeg` com o substituto `verticalFovDeg` especificado no mesmo contrato
- fora do escopo: os quatro itens de 01-overview.md iguais aos de 01-context.md 1.4.1 dos requisitos
- ligações relativas: 117 verificadas, 0 quebradas; `TBD` e `OPEN-<nn>`: nenhum; 98-divergences.md: nenhuma linha, cabeçalho bem formado
