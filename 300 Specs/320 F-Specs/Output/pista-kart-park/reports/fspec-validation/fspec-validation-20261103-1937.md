---
stage: fspec
feature: pista-kart-park
verdict: SUCCESS
generated: 2026-11-03T19:37:00Z
counts: {blocker: 0, error: 0, warning: 3, info: 0, divergence: 0}
seed: {revision: 2, digest: 49d733298158}
upstream: {stage: req, version: req-validation-20261103-1900}
feedbacks: []
previous: fspec-validation-20261103-1908.md (SUCCESS, 0/0/2/0); ISSUE-01 e ISSUE-02 reverificados, ambos fechados
population: "revalidação (§8): ISSUE-01 e ISSUE-02 do relatório anterior; os arquivos com version movida (01-overview.md, 02-glossary.md, 97-changelog.md, features/FEAT-0001, FEAT-0003, FEAT-0008, flows/FLOW-0001, rules/RULE-0003, RULE-0006, screens/SCR-0001, SCR-0002, SCR-0003); dois arquivos intocados sorteados: api/API-0003, rules/RULE-0002. A lista de AC-* e NFR-* dos requisitos (revisão 2, req-validation-20261103-1900, 26 arquivos validated) foi a de F4"
isolation: 97-changelog.md e reports/feedback/FEEDBACK-01.md e FEEDBACK-02.md trazem raciocínio do gerador e do D-Spec; foram usados só para localizar trechos e não pesaram em nenhum julgamento. Nenhuma justificativa chegou pela invocação.
status-stamp: "status: validated aplicado ao front matter dos 13 arquivos do conjunto que estavam em draft; as células Status de 00-index.md são geradas e refletem o estado no próximo lint_artifacts.py --emit"
---

# Relatório de validação F-Spec — pista-kart-park

## Summary

- verdict: SUCCESS
- blocker: 0
- error: 0
- warning: 3
- divergence: 0

## Issues

### ISSUE-01
- severity: warning
- check: F3
- file: features/FEAT-0008-acabamento-visual.md
- location: Critérios de aceite, item dos requisitos 12 a 15 ("a no máximo 0,05 m da superfície de contato da barreira, onde o kart para desse lado")
- finding: O critério nomeia "superfície de contato da barreira" o conceito que REQ-FEAT-0008-14, RULE-0006, SCR-0003 e 02-glossary.md chamam "Face de colisão"; o mesmo conceito com dois nomes.
- expected: O critério diz "a no máximo 0,05 m da face de colisão da barreira de cada lado", com o termo de 02-glossary.md.

### ISSUE-02
- severity: warning
- check: F3
- file: screens/SCR-0002-credito-na-tela-de-resultado.md
- location: Navegação, "com a sessão de pista e a pista selecionada inalteradas"
- finding: "Sessão de pista" não está em 02-glossary.md; o termo definido para esse estado é "Sessão de treino" (usado em RULE-0003 e SCR-0001).
- expected: "com a sessão de treino e a pista selecionada inalteradas", ou o termo novo definido em 02-glossary.md.

### ISSUE-03
- severity: warning
- check: F3
- file: flows/FLOW-0001-abertura-escolha-e-troca-de-pista.md
- location: diagrama (participant R "Tela de resultado"; "J->>R: encerrar treino"; "R->>T") contra Passos 9 e 10
- finding: O passo 9 atribui a exibição do resultado à "Tela de corrida" e SCR-0001 e SCR-0003 põem a ação "encerrar treino" na tela de corrida, enquanto o diagrama atribui as duas ao participante "Tela de resultado"; o mesmo ator do fluxo com dois nomes.
- expected: O participante R passa a ser a tela de corrida com o painel "Resultado da volta do treino" (ou o passo 9 usa o mesmo nome do diagrama), e "encerrar treino" sai do mesmo participante nomeado em SCR-0001 e SCR-0003.

## Divergences

Nenhuma; 98-divergences.md não tem linhas.

## Coverage

- Issues anteriores: ISSUE-01 (REQ-FEAT-0008-24 "reduzir") fechada — o requisito diz "SHALL NOT retirar o acabamento nem nenhum dos seus quatro elementos" e o critério verifica isso; ISSUE-02 (luminância em SCR-0003) fechada — a célula diz a diferença de 8 % a 20 % com a fórmula de RULE-0006.
- Critérios cobertos: 74 de 74 `AC-*` (US-0001 a US-0007); nenhum `REQ-*` acrescentado, retirado ou com fonte mudada na população; AC-US-0003-11 e AC-US-0006-04 a -06 seguem realizados por REQ-FEAT-0003-14 e REQ-FEAT-0006-04 a -06, com "Tela de resultado" agora definido em 02-glossary.md; AC-US-0007-11 por REQ-FEAT-0008-14 e RULE-0006.
- Critérios descobertos: nenhum.
- NFRs: 14 de 14 realizados; nenhum adiado ao D-Spec.
- Requisitos sem fonte: nenhum na população.
- Contratos sem consumidor: nenhum na população (API-0002 lido por SCR-0001 e SCR-0002; API-0003 por RULE-0004 e os ensaios).
- Fora do escopo: 01-overview.md sem mudança na lista; segue a de 01-context.md dos requisitos.
