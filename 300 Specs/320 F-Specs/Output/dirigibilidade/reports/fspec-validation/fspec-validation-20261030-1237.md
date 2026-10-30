---
stage: fspec
feature: dirigibilidade
verdict: SUCCESS
generated: 2026-10-30T12:39:13Z
counts: {blocker: 0, error: 0, warning: 0, info: 0, divergence: 0}
seed: {revision: 5, digest: 48feb6d51bf8}
upstream: {stage: req, version: 4.3.0}
feedbacks: []
population: "revalidação após a rodada 12 (Mode B) sobre fspec-validation-20261030-1222.md (FAIL, 5 errors, 1 warning): as seis issues anteriores reverificadas primeiro; arquivos movidos pela rodada (gravados às 12:36Z, depois do relatório anterior): 01-overview, 02-glossary, 97-changelog (só varredura mecânica), api/API-0002, api/API-0003, features/FEAT-0003, features/FEAT-0005, flows/FLOW-0001, flows/FLOW-0002, flows/FLOW-0003, rules/RULE-0002, rules/RULE-0003, screens/SCR-0002; 00-index e 99-traceability regenerados pelo gate; dois arquivos intocados sorteados (shuf sobre os oito intocados): 98-divergences.md, api/API-0001; rules/RULE-0001 lido só na seção 'Contextos de observação', citada pela transição corrigida de FEAT-0003; lista de AC-* reconstruída dos requisitos 4.3.0 (33 AC, 9 NFR); varreduras mecânicas sobre o conjunto: links relativos (154, todos resolvem), REQ (64, um modal cada, todos citam AC-*, NFR ou [DOMAIN]), AC-* sem REQ (nenhum), OPEN/TBD (nenhum), texto de mensagem mermaid com ';' ou '#' (nenhum)"
isolation: "nenhuma justificativa do gerador chegou pela tarefa; as linhas de assunto do git log, o git status e as notas de memória do usuário presentes no ambiente foram desconsideradas; de 97-changelog.md só os títulos das rodadas foram lidos; a pasta do seed e a raiz de código não foram lidas"
---

# Relatório de validação — dirigibilidade

## Summary

- veredito: SUCCESS
- contagens: blocker 0, error 0, warning 0, info 0, divergence 0
- issues anteriores (fspec-validation-20261030-1222.md): ISSUE-01 (F4) encerrada — SCR-0002, API-0002, RULE-0003, FEAT-0005 e FLOW-0003 não exibem nem compartilham a `setupVersion`; ISSUE-02 (F7) encerrada — a transição de FEAT-0003 para `oversteer`/`sliding` não usa `forcing` como gatilho exclusivo e segue RULE-0001, Contextos de observação; ISSUE-03, ISSUE-04 e ISSUE-05 (F1) encerradas — nenhum texto de mensagem dos blocos `sequenceDiagram` contém `;` ou `#`; ISSUE-06 (F5) encerrada — API-0003 (Erros, `failReason`) e FLOW-0002 nomeiam `MEASUREMENT_MISSING` para `WALL_CONTACT` com `contacts` vazio
- status: `status: validated` gravado em todos os arquivos do conjunto que têm o campo

## Issues

Nenhuma.

## Divergences

Nenhuma.

## Coverage

- critérios cobertos: 33 de 33 (US-0001: 01-06; US-0002: 05, 07, 08, 09; US-0003: 01, 03, 04, 05, 07, 08, 09, 10, 11; US-0004: 01-07; US-0005: 01-07); nenhum descoberto.
- NFR: NFR-0001 a NFR-0009 realizados; nenhum adiado.
- requisitos sem fonte: nenhum (64 REQ).
- fora do escopo de `01-overview.md`: igual ao dos requisitos (quatro itens).
- contratos sem consumidor: nenhum (API-0001: FEAT-0001 a FEAT-0004, FLOW-0001, FLOW-0002, SCR-0001; API-0002: FEAT-0005, FLOW-0003, SCR-0002; API-0003: FEAT-0001 a FEAT-0006, FLOW-0002).
- `98-divergences.md`: cabeçalho bem formado, nenhuma linha.
- feedback entre features: nenhum.
