---
stage: fspec
feature: apresentacao-e-som
verdict: SUCCESS
generated: 2026-11-10T17:14:00Z
counts: {blocker: 0, error: 0, warning: 1, info: 1, divergence: 0}
seed: {revision: 2, digest: e7a828ada2d2}
upstream: {stage: req, version: req-validation-20261110-1652}
feedbacks: []
previous: fspec-validation-20261110-1709
previous-issues: "ISSUE-01 fechada; ISSUE-02 mantida (warning); ISSUE-03 fechada; ISSUE-04 mantida (info)"
population: "revalidação: as 4 issues do relatório anterior; os 7 arquivos com versão alterada (02-glossary.md, 97-changelog.md, API-0001, FEAT-0004, FLOW-0001, FLOW-0002, RULE-0002); 2 arquivos intocados sorteados (FEAT-0002, FEAT-0003)"
isolation: "a invocação não trouxe justificativa do gerador; 97-changelog.md faz parte do conjunto e teve a versão alterada, foi lido, e as suas seções de decisões e de itens recusados não pesaram em nenhum julgamento"
status-stamp: "status: validated em todos os arquivos do conjunto que liam draft; 00-index.md regenerado por lint_artifacts.py --emit"
---

# Relatório de validação F-Spec — apresentacao-e-som

## Summary

- verdict: SUCCESS
- blocker: 0
- error: 0
- warning: 1
- info: 1
- divergence: 0

## Issues

### ISSUE-02

- severity: warning
- check: F2 (requisito testável, sem ambiguidade)
- file: api/API-0003-registros-de-verificacao.md
- location: campo `initialDownloadBytes` e motivo `INITIAL_DOWNLOAD_EXCEEDED`; também features/FEAT-0005-requisitos-transversais.md, REQ-FEAT-0005-01 e o seu critério de aceite, e rules/RULE-0003-arquivos-da-feature-peso-e-licenca.md, linha "Download inicial"
- finding: mantida do relatório 20261110-1709: o campo é medido em bytes e a condição de `PASS` e de `FAIL` é dada em "3 MB", sem o valor em bytes; entre 3.000.000 e 3.145.728 bytes o veredito não é decidível. Os requisitos (NFR-0001, `SEED/NF-01`) não fixam a conversão.
- expected: o autor diz em `SEED/NF-01` se 3 MB são 3.000.000 ou 3.145.728 bytes (linha para `200 Requirements/220 Input/apresentacao-e-som/SCOPE-BACKLOG.md`); até lá o limite fica como está.

### ISSUE-04

- severity: info
- check: F7 (toda regra de domínio cita a fonte; nenhum ramo inventado)
- file: rules/RULE-0001-estado-do-som-e-som-do-motor.md
- location: tabela de decisão do estado do motor, linha 5 (`COUNTDOWN`, nenhuma volta aceita); também features/FEAT-0003-som-do-motor-gravado.md, linha "Antes de a volta estar em andamento"
- finding: mantida do relatório 20261110-1709: o motor em silêncio durante a contagem regressiva cita AC-US-0003-01 por inferência; os requisitos definem "volta em andamento" como o Jogador pilotando uma volta e não mencionam a contagem regressiva.
- expected: a leitura fica como está; entrada em `DOMAIN.md` para o dono do produto confirmar que não há som de motor antes de a volta começar.

## Divergences

Nenhuma; 98-divergences.md não tem linhas.

## Coverage

- Critérios cobertos: 28 de 28 `AC-*` (US-0001 a US-0004).
- Critérios descobertos: nenhum.
- NFRs: 10 de 10 realizados (FEAT-0005); nenhum adiado ao D-Spec.
- Requisitos sem fonte: nenhum.
- Contratos sem consumidor: nenhum.
