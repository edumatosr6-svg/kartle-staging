---
stage: fspec
feature: dirigibilidade
verdict: SUCCESS
generated: 2026-10-30T15:19:46Z
counts: {blocker: 0, error: 0, warning: 0, info: 0, divergence: 0}
seed: {revision: 6, digest: dbf86f325606}
upstream: {stage: req, version: 4.4.0}
feedbacks: []
population: "revalidação após a rodada 13 (Mode C, requisitos revalidados contra o seed revision 6, req-validation-20261030-1509.md) sobre fspec-validation-20261030-1237.md (SUCCESS, sem issues): nenhuma issue anterior a reverificar; arquivos com versão movida: 01-overview (4.1.0), 02-glossary (4.1.0), 97-changelog (4.1.0, só varredura mecânica), features/FEAT-0003 (4.1.0), features/FEAT-0006 (2.2.0), flows/FLOW-0001 (1.2.2), rules/RULE-0001 (4.1.0), screens/SCR-0001 (1.2.0), screens/SCR-0003 (1.0.0, novo); 00-index e 99-traceability regenerados pelo gate; dois arquivos intocados sorteados (shuf sobre os treze intocados): api/API-0001, features/FEAT-0004; lista de AC-* reconstruída dos requisitos (37 AC, quatro novos: AC-US-0003-12 a AC-US-0003-15; 9 NFR, NFR-0004 4.2.1 e NFR-0005 1.4.0 movidos); varreduras mecânicas sobre o conjunto: links relativos (155, todos resolvem), REQ (68, um modal cada, todos citam AC-*, NFR ou [DOMAIN]), AC-* sem REQ (nenhum), OPEN/TBD (nenhum), texto de mensagem mermaid com ';' ou '#' (nenhum)"
isolation: "nenhuma justificativa do gerador chegou pela tarefa; a tarefa descreveu o que a rodada mudou (SCR-0003 novo, botão Drift retirado), lido só como orientação de população; as linhas de assunto do git log, o git status e as notas de memória do usuário presentes no ambiente foram desconsideradas; de 97-changelog.md foram lidos os títulos das rodadas e, por acaso, a primeira linha do gatilho da rodada 13, que não entrou no julgamento; a pasta do seed e a raiz de código não foram lidas"
---

# Relatório de validação — dirigibilidade

## Summary

- veredito: SUCCESS
- contagens: blocker 0, error 0, warning 0, info 0, divergence 0
- issues anteriores (fspec-validation-20261030-1237.md): nenhuma
- status: `status: validated` gravado em todos os arquivos do conjunto que têm o campo

## Issues

Nenhuma.

## Divergences

Nenhuma.

## Coverage

- critérios cobertos: 37 de 37 (US-0001: 01-06; US-0002: 05, 07, 08, 09; US-0003: 01, 03, 04, 05, 07, 08, 09, 10, 11, 12, 13, 14, 15; US-0004: 01-07; US-0005: 01-07); nenhum descoberto. AC-US-0003-12 a AC-US-0003-15 realizados por REQ-FEAT-0003-18 a REQ-FEAT-0003-21.
- NFR: NFR-0001 a NFR-0009 realizados; nenhum adiado.
- requisitos sem fonte: nenhum (68 REQ).
- fora do escopo de `01-overview.md`: igual ao dos requisitos (quatro itens).
- contratos sem consumidor: nenhum (API-0001: FEAT-0001 a FEAT-0004, FLOW-0001, FLOW-0002, SCR-0001; API-0002: FEAT-0005, FLOW-0003, SCR-0002; API-0003: FEAT-0001 a FEAT-0006, FLOW-0002). SCR-0003 não chama contrato deste conjunto.
- `98-divergences.md`: cabeçalho bem formado, nenhuma linha.
- feedback entre features: nenhum.
