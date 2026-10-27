---
stage: fspec
feature: dirigibilidade
verdict: SUCCESS
generated: 2026-10-22T18:57:00Z
counts: {blocker: 0, error: 0, warning: 1, info: 0, divergence: 0}
seed: {revision: 3, digest: 7dd24c8b6cab}
upstream: {stage: req, version: 3.3.0}
feedbacks: []
population: "revalidação após fspec-validation-20261022-1837 (FAIL, 10 error, 1 warning): ISSUE-01 a ISSUE-11 reverificadas primeiro (features/FEAT-0002, rules/RULE-0002, api/API-0003, flows/FLOW-0002, 02-glossary.md, 01-overview.md); arquivos com version movida desde aquele relatório (git diff HEAD): 01-overview.md 3.1.0 -> 3.2.0, 02-glossary.md 3.1.1 -> 3.2.0, api/API-0003 3.2.0 -> 3.3.0, features/FEAT-0002 3.2.0 -> 3.3.0, flows/FLOW-0002 3.2.0 -> 3.3.0, rules/RULE-0002 3.2.0 -> 3.3.0, 97-changelog.md 3.2.0 -> 3.3.0 (só varredura mecânica, ver isolation); dois arquivos intocados sorteados (random.SystemRandom): features/FEAT-0004, api/API-0001; verificações mecânicas sobre o conjunto inteiro: links relativos (139, todos resolvem), blocos mermaid (4), formato dos REQ (62, todos com exatamente um modal), TBD/OPEN (nenhum), segredos (nenhum), termos ambíguos nos arquivos da população (nenhum); requisitos conferidos em status: validated (US-0002 3.3.0, 01-context.md 3.3.0, 02-glossary.md 3.3.0)"
isolation: "nenhuma justificativa do gerador chegou a este validador pela tarefa; 97-changelog.md não foi lido (só varrido por grep mecânico de segredos, TBD e OPEN, sem exibir conteúdo); os arquivos com version movida foram identificados por git diff, não pelo changelog; a pasta do seed não foi lida (§12): DOMAIN/DEC-12, DOMAIN/DEC-13 e DOMAIN/REF-05 foram lidos pelo que US-0002, 01-context.md e 02-glossary.md dos requisitos citam deles"
---

# Relatório de validação — dirigibilidade

## Summary

- veredito: SUCCESS
- contagens: blocker 0, error 0, warning 1, info 0, divergence 0
- issues do relatório anterior: ISSUE-01 a ISSUE-11 resolvidas (REQ-FEAT-0002-03 e 09 restritos por `throttleCondition`; REQ-FEAT-0002-04, RULE-0002, API-0003, FLOW-0002 e o glossário com V1 definido nos dois casos de AC-US-0002-03 e `MEASUREMENT_MISSING` restrito à saída antes do segundo patamar completo; 01-overview.md com base 3.3.0 e `DOMAIN/DEC-01` a `DOMAIN/DEC-13`, `DOMAIN/REF-01` a `DOMAIN/REF-05`)
- status: validated gravado em 00-index.md, 01-overview.md, 02-glossary.md, 97-changelog.md, api/API-0003, features/FEAT-0002, flows/FLOW-0002, rules/RULE-0002

## Issues

### ISSUE-01

- severidade: warning
- check: F3
- arquivo: `features/FEAT-0002-aderencia-em-curva.md`
- local: REQ-FEAT-0002-04 (linhas 53-61, "sem nenhum patamar — completo ou interrompido — ter reportado"); Comportamento, linha "Kart sai da faixa de asfalto do arco na varredura de `UNDERSTEER_ONSET`" (linha 111, "entra em V1 só como a velocidade do caso de `DOMAIN/DEC-12`"); o mesmo enunciado em `api/API-0003-saida-dos-ensaios.md`, Campos medidos, linha `v1Mps` (linha 76), em `flows/FLOW-0002-ensaio-deterministico-e-piloto-de-teste.md`, linha "Kart sai da faixa de asfalto do arco em `UNDERSTEER_ONSET`" (linha 65) e em `02-glossary.md`, linha "Velocidade de início do subesterço" (linha 52)
- achado: o mesmo conceito (V1 no fim natural da varredura) tem cobertura de casos diferente entre as partes do conjunto: `rules/RULE-0002-ensaios-e-limiares.md` ("Fim da varredura de início do subesterço", linhas 107-110, e tabela, linha 115, "sem nenhum patamar assim") decide que, quando o patamar interrompido pela saída é o primeiro em que `understeer` passa de 200 ms consecutivos, V1 é a velocidade mantida desse patamar, "de modo que V1 tem valor em todo fim natural da varredura"; REQ-FEAT-0002-04, a linha de comportamento de FEAT-0002, `v1Mps` em API-0003 (obrigatório em todo fim natural), FLOW-0002 e o glossário enunciam só os dois casos de AC-US-0002-03 (patamar completo com `understeer` > 200 ms; nenhum patamar, completo ou interrompido, com `understeer` > 200 ms) e deixam esse terceiro caso sem valor; os requisitos 3.3.0 (AC-US-0002-03, caso anormal "Nenhum patamar reporta `understeer`", glossário "Velocidade de início do subesterço") também não o enunciam, e RULE-0002 o fecha por derivação de `DOMAIN/DEC-12` (mesmo valor).
- esperado: REQ-FEAT-0002-04, a linha de comportamento de FEAT-0002, `v1Mps` em API-0003, FLOW-0002 e o glossário enunciam o segundo caso como RULE-0002 o decide ("sem nenhum patamar completo com `understeer` por mais de 200 ms consecutivos, a velocidade mantida do patamar interrompido pela saída, inclusive quando esse patamar é o primeiro em que `understeer` passa de 200 ms"), citando RULE-0002 "Fim da varredura" (AC-US-0002-03, `DOMAIN/DEC-12` por derivação), sem mudar nenhum valor; proposta ao autor: entrada em `DOMAIN.md` que confirme esse terceiro caso, já que os requisitos não o enunciam.

## Divergences

Nenhuma.

## Coverage

- critérios cobertos sem contradição (reverificados nesta rodada): AC-US-0002-01 (REQ-FEAT-0002-01, 02), AC-US-0002-02 (REQ-FEAT-0002-03), AC-US-0002-03 (REQ-FEAT-0002-04), AC-US-0002-04 (REQ-FEAT-0002-05), AC-US-0002-05 (REQ-FEAT-0002-06), AC-US-0002-06 (REQ-FEAT-0002-10); AC-US-0004-01 a AC-US-0004-07 (FEAT-0004, amostra).
- critérios cobertos sem contradição (não reverificados nesta rodada, população fixa; conforme fspec-validation-20261022-1837): AC-US-0001-01 a AC-US-0001-06; AC-US-0003-01 a AC-US-0003-07; AC-US-0005-01 a AC-US-0005-06; NFR-0001 a NFR-0009.
- critérios descobertos: nenhum.
- requisitos sem fonte: nenhum (62 REQ; os 10 de FEAT-0002 e os 10 de FEAT-0004 reverificados: todos citam AC-* ou [DOMAIN] com item dos requisitos).
- fora do escopo de `01-overview.md`: igual ao dos requisitos (quatro itens: drift/pistas/manobras; preset Realista; som, vibração, câmera; volante remoto e desafio diário).
- contratos sem consumidor: nenhum (`API-0001`: FEAT-0001 a FEAT-0004, FLOW-0001, FLOW-0002, SCR-0001; `API-0002`: FEAT-0005, FEAT-0006, FLOW-0003, SCR-0002; `API-0003`: FEAT-0001 a FEAT-0006, FLOW-0002).
- mudanças de significado sob o mesmo nome em `API-0003` 3.3.0 (`v1Mps`, `MEASUREMENT_MISSING`, condição de veredito de `offAsphaltStepCount` e de `OFF_ASPHALT` em `REFERENCE_CORNER`): registradas em Compatibilidade com a declaração de que nenhum registro foi publicado sob a forma anterior e nenhum consumidor lê o contrato como entrada; o contrato não é dos publicados de I3; estado esperado por ISSUE-07 do relatório anterior, aceito.
