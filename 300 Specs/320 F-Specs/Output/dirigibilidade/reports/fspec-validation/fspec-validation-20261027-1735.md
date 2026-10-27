---
stage: fspec
feature: dirigibilidade
verdict: SUCCESS
generated: 2026-10-27T17:35:42Z
counts: {blocker: 0, error: 0, warning: 0, info: 1, divergence: 0}
seed: {revision: 3, digest: 7dd24c8b6cab}
upstream: {stage: req, version: 3.4.0}
feedbacks: []
population: "revalidação de fspec-validation-20261027-1714.md (FAIL, 5 errors, 1 warning): as seis issues anteriores reverificadas primeiro; arquivos com `version:` movida desde aquele relatório (git diff HEAD): 01-overview.md (3.2.0 → 3.3.0), 02-glossary.md (3.2.0 → 3.3.0), 97-changelog.md (3.3.0 → 3.4.0; só varredura mecânica), api/API-0003 (3.3.0 → 3.4.0), features/FEAT-0002 (3.3.0 → 3.4.0), flows/FLOW-0002 (3.3.0 → 3.4.0), rules/RULE-0002 (3.3.0 → 3.4.0); 00-index.md e 99-traceability.md só com `generated:` movido (gerados, propriedade do gate); dois arquivos intocados sorteados (random.SystemRandom, sobre a lista dos 14 artefatos intocados): flows/FLOW-0001, features/FEAT-0004; lista de AC-* reconstruída dos requisitos 3.4.0 (US-0002 3.4.0 e 01-context.md 3.4.0 lidos na íntegra; US-0004 2.0.0 lido para o sorteado FEAT-0004); verificações mecânicas sobre o conjunto inteiro: links relativos (146, todos resolvem), blocos mermaid (4, válidos), formato dos REQ (62, ids únicos, cada um com exatamente um modal: 59 SHALL, 3 SHALL NOT; todos citam AC-*, NFR ou [DOMAIN]; nenhum termo ambíguo), OPEN/TBD (nenhum nos artefatos), segredos (nenhum), 98-divergences.md (cabeçalho bem formado, nenhuma linha), 99-traceability.md (Items with no upstream source: None; 33 AC-* e 9 NFR presentes)"
isolation: "nenhuma justificativa do gerador chegou a este validador pela tarefa; 97-changelog.md deste conjunto não foi lido — só contado por grep (14 citações de `DOMAIN/DEC-14`) e varrido para OPEN/TBD e segredos; as linhas de assunto do `git log` e o `git status` do ambiente, e as notas de memória do usuário que nomeiam motivos das rodadas de código, foram desconsideradas; a pasta do seed não foi lida (`DOMAIN/DEC-14` foi lido pelo texto que US-0002 3.4.0 e 01-context.md 3.4.0 citam dele); a raiz de código não foi lida"
---

# Relatório de validação — dirigibilidade

## Summary

- veredito: SUCCESS
- contagens: blocker 0, error 0, warning 0, info 1, divergence 0
- issues do relatório anterior: ISSUE-01 (warning, F3) resolvida — REQ-FEAT-0002-04 (linhas 57-68), a linha de comportamento de FEAT-0002 (linha 120), `v1Mps` em API-0003 (linha 76), FLOW-0002 (linha 65) e o glossário (linha 52) enunciam o terceiro caso de V1 como RULE-0002 o decide, citando "Fim da varredura de início do subesterço", sem mudar nenhum valor; o resíduo (fonte do caso por derivação) é ISSUE-01 abaixo, info, F7; ISSUE-02 (error, F4) resolvida — REQ-FEAT-0002-01 (linhas 42-47) e REQ-FEAT-0002-09 (linhas 86-93), Comportamento (linhas 116 e 119) e critérios de aceite (linhas 142-146, 155-158) de FEAT-0002 3.4.0 declaram a janela de medição de `DOMAIN/DEC-14` via AC-US-0002-01; ISSUE-03 (error, F4) resolvida — RULE-0002 3.4.0, Ambientes (linha 23), `REFERENCE_CORNER` (linha 76), nota de Limiares (linhas 55-60), "Fim da varredura" (linhas 102-103) e `UNDERSTEER_ONSET` (linha 77) citam `DOMAIN/DEC-14`; ISSUE-04 (error, F4) resolvida — API-0003 3.4.0, `maxUndersteerMs` (linha 69), Erros (linhas 141-146), entrada 3.4.0 de Compatibilidade (linhas 219-228) e `v1Mps` (linha 76); ISSUE-05 (error, F4) resolvida — FLOW-0002 3.4.0, linhas 45, 46, 64 e 65; ISSUE-06 (error, F4) resolvida — 01-overview.md 3.3.0 declara a base "versão 3.4.0", `DOMAIN/DEC-01` a `DOMAIN/DEC-14` e a decisão de 2026-10-27 com remissão a RULE-0002
- status: `status: validated` gravado nos oito arquivos que liam `draft` (00-index.md, 01-overview.md, 02-glossary.md, 97-changelog.md, api/API-0003, features/FEAT-0002, flows/FLOW-0002, rules/RULE-0002); nenhum arquivo do conjunto lê `draft`

## Issues

### ISSUE-01

- severidade: info
- check: F7
- arquivo: `rules/RULE-0002-ensaios-e-limiares.md`
- local: "Fim da varredura de início do subesterço", linhas 110-113 ("Se o patamar interrompido pela saída é o primeiro em que `understeer` passa de 200 ms consecutivos, o subesterço começou nele e V1 é igualmente a sua velocidade mantida"); tabela, linha 118 ("inclusive quando esse patamar é o primeiro em que `understeer` passa de 200 ms consecutivos")
- achado: o terceiro caso de V1 (patamar interrompido pela saída acima de 50 km/h que é o primeiro a reportar `understeer` por mais de 200 ms consecutivos) é fechado por derivação de `DOMAIN/DEC-12` (mesmo valor: a velocidade mantida desse patamar) e de AC-US-0002-03, que enunciam só os dois casos (patamar completo com `understeer` acima de 200 ms; nenhum patamar com `understeer` acima de 200 ms); nenhuma decisão dos requisitos 3.4.0 o nomeia; o conjunto está consistente nesse caso (ISSUE-01 anterior resolvida) e a derivação não acrescenta limiar nem muda valor.
- esperado: nenhuma mudança no conjunto; proposta ao autor (conventions §15): entrada em `DOMAIN.md` confirmando que, quando o patamar interrompido pela saída acima de 50 km/h é o primeiro em que `understeer` passa de 200 ms consecutivos, V1 é a sua velocidade mantida — ou a decisão contrária, que exigiria nova rodada dos requisitos e deste conjunto.

## Divergences

Nenhuma.

## Coverage

- lista de `AC-*` reconstruída dos requisitos 3.4.0: 33 critérios (US-0001: 6; US-0002: 6; US-0003: 7; US-0004: 7; US-0005: 6) e 9 NFR; todos constam como item upstream em `99-traceability.md` ("Items with no upstream source": None).
- critérios reverificados nesta rodada, cobertos sem contradição: AC-US-0002-01 (REQ-FEAT-0002-01: janela de medição da condição de acelerador 0 só nos passos na faixa de asfalto até a primeira saída, limiar 200 ms; REQ-FEAT-0002-02: acelerador cheio em todo o arco; REQ-FEAT-0002-09: a primeira saída fecha a janela de `maxUndersteerMs` com `THROTTLE_ZERO`), AC-US-0002-02 (REQ-FEAT-0002-03), AC-US-0002-03 (REQ-FEAT-0002-04: patamar interrompido medido só até a saída, `DOMAIN/DEC-14`), AC-US-0002-04 (REQ-FEAT-0002-05), AC-US-0002-05 (REQ-FEAT-0002-06), AC-US-0002-06 (REQ-FEAT-0002-10); o caso anormal "Kart sai da faixa de asfalto do arco" de US-0002 3.4.0 realizado por REQ-FEAT-0002-09 e REQ-FEAT-0002-10, RULE-0002 (Ambientes, `REFERENCE_CORNER`, `UNDERSTEER_ONSET`, "Fim da varredura"), API-0003 (`maxUndersteerMs`, `offAsphaltStepCount`, Erros, Compatibilidade 3.4.0) e FLOW-0002 (passos 4 e 5; alternativas, linhas 64-65); `DOMAIN/DEC-14` citado em 01-overview.md, 02-glossary.md, FEAT-0002, RULE-0002, API-0003 e FLOW-0002; nos sorteados: AC-US-0004-01 a AC-US-0004-07 (FEAT-0004: 10 REQ, cada um com um modal e citação; critérios de aceite cobrem os requisitos 01 a 10; campos `wallContact`, `surface`, `speedMps`, `handling` resolvem em API-0001 e `ACCELERATION`, `TOP_SPEED`, `GRASS_LOSS`, `WALL_CONTACT` e seus campos em API-0003; AC-US-0004-06 especificado nos dois canais; nenhuma configuração; nenhum módulo, biblioteca ou tabela nomeado), AC-US-0001-01, AC-US-0002-01, AC-US-0003-03, AC-US-0004-06 (FLOW-0001: `getHandlingTelemetry` e `NO_STATE` resolvem em API-0001; nenhum evento externo, deduplicação dispensada com D-FS-03; roda sem rede, D-FS-08; nenhuma regra de pilotagem no adaptador nem na apresentação, D-FS-05; mermaid válido).
- critérios não reverificados nesta rodada (população fixa; conforme fspec-validation-20261022-1837.md, -1857.md e 20261027-1714.md): AC-US-0001-02 a AC-US-0001-06; AC-US-0003-01, AC-US-0003-02, AC-US-0003-04 a AC-US-0003-07; AC-US-0005-01 a AC-US-0005-06; NFR-0001 a NFR-0009 (todos presentes em `99-traceability.md`).
- requisitos sem fonte: nenhum (62 REQ; cada um cita `AC-*`, um NFR ou `[DOMAIN]` com item dos requisitos; varredura mecânica).
- fora do escopo de `01-overview.md`: igual ao dos requisitos (quatro itens).
- contratos sem consumidor: nenhum (`API-0001`: FEAT-0001 a FEAT-0004, FLOW-0001, FLOW-0002, SCR-0001; `API-0002`: FEAT-0005, FEAT-0006, FLOW-0003, SCR-0002; `API-0003`: FEAT-0001 a FEAT-0006, FLOW-0002).
- API-0003 3.4.0 (F5): `maxUndersteerMs` mantém nome, unidade e significado e, com `THROTTLE_ZERO`, deixa de cobrir os passos fora da faixa, com a declaração de que nenhum registro foi publicado sob a forma anterior e nenhum consumidor lê o contrato como entrada (I3; mesma forma aceita para 3.3.0); `v1Mps` mantém nome, unidade, obrigatoriedade e valor; nenhum campo nem valor de enum acrescentado; nenhuma retirada; auth, superfície de erro e idempotência inalterados.
- `98-divergences.md`: cabeçalho bem formado, nenhuma linha; `OPEN-<nn>` e `TBD`: nenhum nos artefatos (propriedade do gate, confirmada por varredura).
- feedback entre features: nenhum a enviar (nenhum achado cuja correção pertença a outra feature).
