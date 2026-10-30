---
stage: fspec
feature: modelo-kart-01
verdict: SUCCESS
generated: 2026-10-30T14:06:08Z
counts: {blocker: 0, error: 0, warning: 1, info: 0, divergence: 0}
seed: {revision: 4, digest: 4e9bfbba6294}
upstream: {stage: req, version: 1.5.0}
feedbacks: []
population: "re-validação (conventions §8): relatório anterior fspec-validation-20261030-1202 sem issues; arquivos com `version:` movida desde ele (7): 01-overview.md (1.4.0), 02-glossary.md (1.3.1 -> 1.4.0), 97-changelog.md (1.3.1 -> 1.4.0), features/FEAT-0005 (2.1.0), flows/FLOW-0001 (1.4.0), rules/RULE-0003 (1.2.0), screens/SCR-0001 (1.4.0); 00-index.md e 99-traceability.md gerados pelo gate (não re-julgados); dois intocados sorteados: api/API-0001, api/API-0002; upstream movido: US-0005 2.1.1 (AC-US-0005-06 e AC-US-0005-07 novos), 01-context 1.5.0, 02-glossary 1.5.0, todos status validated (req-validation-20261030-1353, SUCCESS)"
context-ignored: "nenhuma justificativa recebida do chamador; a justificativa do gerador em 97-changelog.md (rodada 6, inclusive os itens recusados) chegou pelo próprio artefato e não foi usada como fundamento; do changelog só se conferiu quais arquivos mudaram"
---

# Relatório de validação do F-Spec — modelo-kart-01

## Summary

- veredito: SUCCESS
- contagens: 0 blocker, 0 error, 1 warning, 0 info, 0 divergence

## Issues

### ISSUE-01

- severity: warning
- check: F3
- file: 01-overview.md
- location: seção "Relação com outras features", item `race-lap-validation`
- finding: o item diz que a feature usa a contagem regressiva e o sinal verde, pelo contrato `getLapState`, "só para decidir o modo da câmera", e o fim da volta oficial "só para manter a câmera na pose de corrida"; FEAT-0005 (REQ-FEAT-0005-11 e 12, seção "Situação de marca de pneu"), RULE-0003 ("Tabela de decisão — trecho novo de marca de pneu") e FLOW-0001 (passo 9) também leem `lapPhase` de `getLapState` (`RUNNING` como volta em andamento; `ENDED`, `PAUSED`, `COUNTDOWN` como não em andamento) para decidir se um trecho novo de marca de pneu é desenhado.
- expected: o item nomeia também o uso de `lapPhase` de `getLapState` para a situação de marca de pneu (volta em andamento, `DOMAIN/DEC-09`, via AC-US-0005-06 e AC-US-0005-07), sem o "só para" que o exclui.

## Divergences

Nenhuma.

## Coverage

- critérios: 42 `AC-*` dos requisitos (AC-US-0001-01 a 16, AC-US-0002-01 a 06, AC-US-0003-01 a 08 e 10 a 14, AC-US-0004-01 a 02, AC-US-0005-01 e 04 a 07) realizados por ao menos um `REQ-*`; 0 descobertos; AC-US-0005-06 por REQ-FEAT-0005-11, AC-US-0005-07 por REQ-FEAT-0005-08 e REQ-FEAT-0005-12; 0 `AC-*` citados que não existam nos requisitos; critérios retirados (AC-US-0003-09, AC-US-0005-02, AC-US-0005-03) não citados em features/
- requisitos sem fonte: nenhum (65 `REQ-*`, cada um com exatamente um de SHALL / SHOULD / MAY); REQ-FEAT-0005-04 retirado sem reaproveitamento do número, substituído por REQ-FEAT-0005-11 e 12
- NFRs: NFR-0001 a NFR-0007 realizados, 0 adiados, 0 descartados
- contratos sem consumidor: nenhum; `getHandlingTelemetry` (`speedMps` 0 ou maior, `sideslipRad` em módulo, `NO_STATE`) e `getLapState` (`lapPhase`; no treino `ENDED` só depois de `endTraining`) lidos com o domínio que dirigibilidade API-0001 2.0.0 e race-lap-validation API-0001 lhes dão
- `TBD` e `OPEN-<nn>`: nenhum; 98-divergences.md: nenhuma linha, cabeçalho bem formado
