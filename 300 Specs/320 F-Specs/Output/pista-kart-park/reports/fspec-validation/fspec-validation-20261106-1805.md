---
stage: fspec
feature: pista-kart-park
verdict: SUCCESS
generated: 2026-11-06T18:07:00Z
counts: {blocker: 0, error: 0, warning: 0, info: 0, divergence: 0}
seed: {revision: 3, digest: 1fe5243f7e36}
upstream: {stage: req, version: req-validation-20261106-1741}
feedbacks: []
previous: fspec-validation-20261106-1803.md (FAIL, 0/1/3/0); ISSUE-01, ISSUE-02, ISSUE-03 e ISSUE-04 reverificados, os quatro fechados
population: "revalidação (§8): ISSUE-01 a ISSUE-04 do relatório anterior; os arquivos com version movida desde ele (flows/FLOW-0003 2.0.1, features/FEAT-0008 2.0.1, screens/SCR-0002 1.1.2, flows/FLOW-0001 1.1.1; 00-index.md e 99-traceability.md são do gate); dois arquivos intocados sorteados: features/FEAT-0003, screens/SCR-0001. A lista de AC-* (77, US-0001 a US-0007, sem AC-US-0003-09) e de NFR-* (13, sem NFR-0011) de req-validation-20261106-1741 foi a de F4"
isolation: "a invocação não trouxe justificativa do gerador; 97-changelog.md foi aberto ao listar arquivos e não pesou em nenhum julgamento (os arquivos movidos foram identificados pela data de modificação posterior ao relatório anterior)"
status-stamp: "status: validated aplicado ao front matter dos 27 arquivos do conjunto que têm o campo; 00-index.md é gerado e reflete o estado no próximo lint_artifacts.py --emit"
---

# Relatório de validação F-Spec — pista-kart-park

## Summary

- verdict: SUCCESS
- blocker: 0
- error: 0
- warning: 0
- info: 0
- divergence: 0

## Issues

Nenhum.

## Divergences

Nenhuma; 98-divergences.md não tem linhas.

## Coverage

- Critérios cobertos: 77 de 77 `AC-*` (US-0001 a US-0007), cada um citado por ao menos um `REQ-*` não retirado.
- Critérios descobertos: nenhum.
- NFRs: 13 de 13 realizados (NFR-0001 a NFR-0010, NFR-0012 a NFR-0014); nenhum adiado ao D-Spec.
- Requisitos sem fonte: nenhum.
- Contratos sem consumidor: nenhum (API-0001 por API-0002, SCR-0003 e os ensaios; API-0002 por SCR-0001, SCR-0002 e FLOW-0001; API-0003 por RULE-0004, SCR-0003 e FEAT-0008).
