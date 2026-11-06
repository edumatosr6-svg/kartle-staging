---
stage: fspec
feature: pista-kart-park
verdict: FAIL
generated: 2026-11-06T18:03:51Z
counts: {blocker: 0, error: 1, warning: 3, info: 0, divergence: 0}
seed: {revision: 3, digest: 1fe5243f7e36}
upstream: {stage: req, version: req-validation-20261106-1741}
feedbacks: []
previous: fspec-validation-20261103-1937.md (SUCCESS, 0/0/3/0); ISSUE-01, ISSUE-02 e ISSUE-03 reverificados, os três continuam abertos
population: "revalidação (§8): ISSUE-01 a ISSUE-03 do relatório anterior; os arquivos com version movida, que são todos os 27 do conjunto (Mode A da revisão 3), então nenhum arquivo intocado restou para a amostra de dois. A lista de AC-* (77, US-0001 a US-0007, sem AC-US-0003-09) e de NFR-* (13, sem NFR-0011) dos requisitos validados em req-validation-20261106-1741 foi a de F4"
isolation: "a invocação não trouxe justificativa do gerador; 97-changelog.md e reports/feedback/ deste conjunto não foram lidos como entrada de julgamento"
---

# Relatório de validação F-Spec — pista-kart-park

## Summary

- verdict: FAIL
- blocker: 0
- error: 1
- warning: 3
- info: 0
- divergence: 0

## Issues

### ISSUE-01
- severity: error
- check: F1
- file: flows/FLOW-0003-preparo-e-publicacao-do-arquivo-de-pista.md
- location: bloco mermaid, mensagem "C->>E: publica em staging, STAGING; o arquivo da versao 1 fica como esta"
- finding: Num sequenceDiagram o ";" encerra a instrução, então o texto depois dele é lido como uma instrução nova sem seta e o diagrama não passa pelo parser.
- expected: A mensagem fica sem ";" (por exemplo "publica em staging, STAGING, o arquivo da versao 1 fica como esta") ou usa a entidade "#59;".

### ISSUE-02
- severity: warning
- check: F3
- file: features/FEAT-0008-acabamento-visual.md
- location: Critérios de aceite, item dos requisitos 12 a 15 ("a no máximo 0,05 m da superfície de contato da barreira, onde o kart para desse lado")
- finding: O critério chama de "superfície de contato da barreira" o conceito que REQ-FEAT-0008-14, RULE-0006, SCR-0003 e 02-glossary.md chamam de "Face de colisão"; continua aberto desde ISSUE-01 de fspec-validation-20261103-1937.
- expected: O critério diz "a no máximo 0,05 m da face de colisão da barreira de cada lado", com o termo de 02-glossary.md.

### ISSUE-03
- severity: warning
- check: F3
- file: screens/SCR-0002-credito-na-tela-de-resultado.md
- location: Navegação, "com a sessão de pista e a pista selecionada inalteradas"
- finding: "Sessão de pista" não está em 02-glossary.md, onde o termo para esse estado é "Sessão de treino"; continua aberto desde ISSUE-02 de fspec-validation-20261103-1937.
- expected: "com a sessão de treino e a pista selecionada inalteradas".

### ISSUE-04
- severity: warning
- check: F3
- file: flows/FLOW-0001-abertura-escolha-e-troca-de-pista.md
- location: diagrama (participant R "Tela de resultado"; "J->>R: encerrar treino"; "R->>T") contra os passos 9 e 10
- finding: O passo 9 atribui o resultado à "Tela de corrida", e SCR-0001 e SCR-0003 põem "encerrar treino" na tela de corrida, mas o diagrama dá as duas coisas ao participante "Tela de resultado"; continua aberto desde ISSUE-03 de fspec-validation-20261103-1937.
- expected: O participante R é a tela de corrida com o painel "Resultado da volta do treino", e "encerrar treino" sai do participante que SCR-0001 e SCR-0003 nomeiam.

## Divergences

Nenhuma; 98-divergences.md não tem linhas.

## Coverage

- Critérios cobertos: 77 de 77 `AC-*` (US-0001 a US-0007), cada um citado por ao menos um `REQ-*` não retirado.
- Critérios descobertos: nenhum.
- NFRs: 13 de 13 realizados (NFR-0001 a NFR-0010, NFR-0012 a NFR-0014); nenhum adiado ao D-Spec.
- Requisitos sem fonte: nenhum; REQ-FEAT-0002-03, REQ-FEAT-0003-12, REQ-FEAT-0007-12, REQ-FEAT-0008-28 e REQ-FEAT-0008-29 estão marcados como retirados, sem reaproveitamento de id.
- SHALL sem critério de aceite da própria feature: nenhum.
- Contratos sem consumidor: nenhum (API-0001 lido por API-0002, SCR-0003 e os ensaios; API-0002 por SCR-0001, SCR-0002 e FLOW-0001; API-0003 por RULE-0004, SCR-0003 e os ensaios).
- Fora do escopo: 01-overview.md lista SEED/FE-01 a SEED/FE-09, igual a 01-context.md dos requisitos.
