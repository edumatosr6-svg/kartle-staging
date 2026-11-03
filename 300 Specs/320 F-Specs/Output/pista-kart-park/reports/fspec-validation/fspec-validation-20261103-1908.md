---
stage: fspec
feature: pista-kart-park
verdict: SUCCESS
generated: 2026-11-03T19:10:38Z
counts: {blocker: 0, error: 0, warning: 2, info: 0, divergence: 0}
seed: {revision: 2, digest: 49d733298158}
upstream: {stage: req, version: 1.2.0}
feedbacks: []
previous: fspec-validation-20261022-1522.md (SUCCESS, 0/0/0/0); nenhuma issue a reverificar
population: "revalidação (§8): nenhuma issue anterior; os arquivos com version movida (01-overview.md, 02-glossary.md, 97-changelog.md, 99-traceability.md, features/FEAT-0007, rules/RULE-0005, screens/SCR-0003) e os novos (features/FEAT-0008, rules/RULE-0006); dois arquivos intocados sorteados: screens/SCR-0001, features/FEAT-0002. A lista de AC-* e NFR-* dos requisitos (revisão 2, req-validation-20261103-1900) foi montada inteira para F4"
isolation: 97-changelog.md traz o raciocínio do gerador; foi examinado só por busca dirigida (OPEN, TBD, vazamento de projeto) e não pesou em nenhum julgamento. Nenhuma justificativa chegou pela invocação.
status-stamp: "status: validated aplicado ao front matter dos arquivos do conjunto que estavam em draft; as células Status de 00-index.md são geradas e refletem o estado no próximo lint_artifacts.py --emit"
---

# Relatório de validação F-Spec — pista-kart-park

## Summary

- verdict: SUCCESS
- blocker: 0
- error: 0
- warning: 2
- divergence: 0

## Issues

### ISSUE-01
- severity: warning
- check: F2
- file: features/FEAT-0008-acabamento-visual.md
- location: REQ-FEAT-0008-24; critério de aceite "Nenhuma configuração ou caminho do jogo desliga o acabamento"
- finding: O requisito proíbe "retirar nem reduzir" o acabamento; a fonte (US-0007, caso anormal) diz só que o acabamento "não é retirado". "Reduzir" não tem passa/falha observável e nenhum critério de aceite o cobre (o critério só verifica que nada desliga o acabamento); lido largo, toca o que 01-overview.md deixa ao projeto (quantidade de pneus, tons além de 2).
- expected: REQ-FEAT-0008-24 diz "SHALL NOT retirar o acabamento nem nenhum dos seus quatro elementos" (ou define "reduzir" pelas medidas de AC-US-0007-02, -06, -10, -11, -13 e -20) e o critério de aceite verifica exatamente isso.

### ISSUE-02
- severity: warning
- check: F3
- file: screens/SCR-0003-kart-park-na-tela-de-corrida.md
- location: tabela "Elementos acrescentados", linha "Tons de grama (Kart Park)"
- finding: "cada um com luminância relativa a 8 % a 20 % da de `#68865b`" lê-se como luminância igual a 8–20 % da referência, não como diferença de 8–20 %; diverge do termo "Luminância relativa" de 02-glossary.md e da fórmula de RULE-0006 (\|L(t) − L(ref)\| / L(ref) entre 0,08 e 0,20).
- expected: A célula diz "cada um com luminância relativa que difere da de `#68865b` entre 8 % e 20 % desse valor", como em 02-glossary.md e REQ-FEAT-0008-17.

## Divergences

Nenhuma; 98-divergences.md não tem linhas.

## Coverage

- Critérios cobertos: 74 de 74 `AC-*` (US-0001 a US-0007); os 21 de US-0007 por REQ-FEAT-0008-01 a -22; AC-US-0002-05, AC-US-0004-05 e AC-US-0005-01, reescritos na revisão 2, seguem realizados por REQ-FEAT-0002-03/-09, FEAT-0004 (referencial local do obstáculo) e FEAT-0005.
- Critérios descobertos: nenhum.
- NFRs: 14 de 14 realizados; NFR-0002 com o acabamento em REQ-FEAT-0007-01/-02, NFR-0013 em REQ-FEAT-0008-25 a -27, NFR-0014 em REQ-FEAT-0008-28/-29 e RULE-0005; nenhum adiado ao D-Spec.
- Requisitos sem fonte: nenhum na população.
- Contratos sem consumidor: nenhum na população (API-0001, API-0002 e API-0003 lidos por FEAT-0008, RULE-0006 e SCR-0003, sem campo novo).
- Fora do escopo: 01-overview.md acrescenta `SEED/FE-06` a `SEED/FE-08`, como 01-context.md dos requisitos.
