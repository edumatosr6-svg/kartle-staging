---
stage: fspec
feature: dirigibilidade
verdict: FAIL
generated: 2026-10-27T17:14:43Z
counts: {blocker: 0, error: 5, warning: 1, info: 0, divergence: 0}
seed: {revision: 3, digest: 7dd24c8b6cab}
upstream: {stage: req, version: 3.4.0}
feedbacks: []
population: "revalidação após fspec-validation-20261022-1857.md (SUCCESS, 1 warning), disparada pela movimentação dos requisitos (US-0002 3.3.0 → 3.4.0, 01-context.md 3.3.0 → 3.4.0, 97-changelog 3.3.1 → 3.4.0: rótulo novo `DOMAIN/DEC-14`; validados em req-validation-20261027-1705.md): ISSUE-01 anterior reverificada primeiro; arquivos deste estágio com `version:` movida desde aquele relatório (git diff HEAD): nenhum (só `generated:` de 00-index.md e 99-traceability.md); F4 reexecutado com a lista de AC-* reconstruída dos requisitos 3.4.0 sobre os arquivos cujo `sources:` cita os critérios modificados AC-US-0002-01, AC-US-0002-03 e AC-US-0002-06 (features/FEAT-0002, rules/RULE-0002, api/API-0003, flows/FLOW-0002, flows/FLOW-0001, api/API-0001) e sobre 01-overview.md e 02-glossary.md, que enunciam a base dos requisitos e a curva de referência; dois arquivos intocados sorteados (random.SystemRandom): api/API-0002, screens/SCR-0001; verificações mecânicas sobre o conjunto inteiro: links relativos (139, todos resolvem), blocos mermaid (4, cabeçalho válido), formato dos REQ (62, cada um com exatamente um modal: 59 SHALL, 3 SHALL NOT), OPEN/TBD (nenhum), segredos (nenhum), termos ambíguos nos REQ (nenhum), consumidores dos contratos (todos têm)"
isolation: "nenhuma justificativa do gerador chegou a este validador pela tarefa; o gerador não rodou nesta rodada (nenhuma entrada nova em 97-changelog.md deste conjunto, nenhuma `version:` movida); 97-changelog.md deste conjunto não entrou no julgamento — as suas rodadas 1 a 4 chegaram ao contexto numa leitura em bloco e foram desconsideradas, e os arquivos movidos foram identificados por git diff; a pasta do seed (SEED.md, DOMAIN.md, NOTES.md, SCOPE-BACKLOG.md) foi lida no início da rodada, fora da lista de entrada do estágio (conventions §12), e não entrou no julgamento: `DOMAIN/DEC-14` foi lido pelo texto integral que US-0002 3.4.0 (Fontes) e 01-context.md 3.4.0 (chave de rastreabilidade) dos requisitos citam dele; as linhas de assunto do `git log` do ambiente e as entradas de SCOPE-BACKLOG.md nomeiam os motivos das rodadas de código e do D-Spec, desconsiderados; a raiz de código não foi lida"
---

# Relatório de validação — dirigibilidade

## Summary

- veredito: FAIL
- contagens: blocker 0, error 5, warning 1, info 0, divergence 0
- issue do relatório anterior: ISSUE-01 (warning, F3) mantida como ISSUE-01 abaixo (nenhum dos arquivos envolvidos moveu de versão; os requisitos 3.4.0 continuam a enunciar só os dois casos de V1)
- causa dos erros: os requisitos passaram a 3.4.0 com `DOMAIN/DEC-14` (AC-US-0002-01, AC-US-0002-03, AC-US-0002-06 e caso anormal "Kart sai da faixa de asfalto do arco" de US-0002) e o conjunto não foi regenerado: nenhum arquivo cita `DOMAIN/DEC-14`, e a janela de medição do `understeer` com acelerador 0 enunciada no conjunto é a que a decisão substituiu
- status: nenhum `status:` gravado (veredito FAIL); nenhum arquivo do conjunto lê `draft`

## Issues

### ISSUE-01

- severidade: warning
- check: F3
- arquivo: `features/FEAT-0002-aderencia-em-curva.md`
- local: REQ-FEAT-0002-04 (linhas 53-61, "sem nenhum patamar — completo ou interrompido — ter reportado"); Comportamento, linha 111 ("entra em V1 só como a velocidade do caso de `DOMAIN/DEC-12`"); o mesmo enunciado em `api/API-0003-saida-dos-ensaios.md`, linha 76 (`v1Mps`), em `flows/FLOW-0002-ensaio-deterministico-e-piloto-de-teste.md`, linha 65, e em `02-glossary.md`, linha 52 ("Velocidade de início do subesterço")
- achado: (reverificada de fspec-validation-20261022-1857.md, ISSUE-01; nenhum dos cinco arquivos moveu de versão) o mesmo conceito (V1 no fim natural da varredura) tem cobertura de casos diferente entre as partes do conjunto: `rules/RULE-0002-ensaios-e-limiares.md` ("Fim da varredura de início do subesterço", linhas 107-110, e tabela, linha 115, "sem nenhum patamar assim") decide que, quando o patamar interrompido pela saída é o primeiro em que `understeer` passa de 200 ms consecutivos, V1 é a velocidade mantida desse patamar, "de modo que V1 tem valor em todo fim natural da varredura"; REQ-FEAT-0002-04, a linha de comportamento de FEAT-0002, `v1Mps` em API-0003 (obrigatório em todo fim natural), FLOW-0002 e o glossário enunciam só os dois casos de AC-US-0002-03 (patamar completo com `understeer` > 200 ms; nenhum patamar, completo ou interrompido, com `understeer` > 200 ms) e deixam esse terceiro caso sem valor; os requisitos 3.4.0 (AC-US-0002-03; caso anormal "Nenhum patamar reporta `understeer`"; glossário 3.3.0) continuam sem o enunciar, e RULE-0002 o fecha por derivação de `DOMAIN/DEC-12` (mesmo valor).
- esperado: REQ-FEAT-0002-04, a linha de comportamento de FEAT-0002, `v1Mps` em API-0003, FLOW-0002 e o glossário enunciam o segundo caso como RULE-0002 o decide ("sem nenhum patamar completo com `understeer` por mais de 200 ms consecutivos, a velocidade mantida do patamar interrompido pela saída, inclusive quando esse patamar é o primeiro em que `understeer` passa de 200 ms"), citando RULE-0002 "Fim da varredura" (AC-US-0002-03, `DOMAIN/DEC-12` por derivação), sem mudar nenhum valor; proposta ao autor: entrada em `DOMAIN.md` que confirme esse terceiro caso, já que os requisitos não o enunciam.

### ISSUE-02

- severidade: error
- check: F4
- arquivo: `features/FEAT-0002-aderencia-em-curva.md`
- local: REQ-FEAT-0002-01 (linhas 40-43, "em nenhum trecho do arco"); REQ-FEAT-0002-09 (linhas 79-85, "continuar a medir `maxUndersteerMs` (requisito 01) em todos os passos do arco, dentro e fora da faixa"); Comportamento, linha 107 ("`understeer` consecutivo ≤ 200 ms em todos os passos do arco é o único critério") e linha 110 ("`maxUndersteerMs` continua medido em todo o arco, dentro e fora da faixa"); Critérios de aceite, linhas 145-148 ("`maxUndersteerMs` medido em todo o arco")
- achado: AC-US-0002-01 dos requisitos 3.4.0 (US-0002 3.4.0; `DOMAIN/DEC-14`, decisão do dono do produto de 2026-10-27, rotulada em 01-context.md 3.4.0) fixa que, na condição de acelerador 0, a maior sequência de `understeer` consecutivo é contada só nos passos em que o kart está na faixa de asfalto, até a primeira saída da faixa, e que os passos depois da saída não entram na medição, com o limiar de 200 ms inalterado; o caso anormal "Kart sai da faixa de asfalto do arco" de US-0002 3.4.0 diz que a primeira saída fecha a janela de medição do critério 01 e que escorregar na grama não é sair de frente. O requisito 01 mede "em nenhum trecho do arco" (a leitura anterior dos requisitos, que `DOMAIN/DEC-14` substituiu) e o requisito 09 manda continuar a medir `maxUndersteerMs` dentro e fora da faixa; as linhas de Comportamento e o critério de aceite repetem isso. O conjunto contradiz a sua fonte de autoridade (conventions §6): não é divergência. Nenhum arquivo do conjunto cita `DOMAIN/DEC-14`.
- esperado: REQ-FEAT-0002-01 declara a janela de medição da condição de acelerador 0 — só nos passos na faixa de asfalto, até a primeira saída da faixa; os passos depois da saída não entram; limiar de 200 ms — citando AC-US-0002-01 e `DOMAIN/DEC-14` via AC-US-0002-01; REQ-FEAT-0002-02 continua com a janela de todo o arco (acelerador cheio, permanência na faixa exigida pelo requisito 03); REQ-FEAT-0002-09 passa a dizer que, com `THROTTLE_ZERO`, a primeira saída fecha a janela de `maxUndersteerMs` e os passos depois dela não entram na medição, com `offAsphaltStepCount`, `offAsphaltFirstStep` e posição reportados sem reprovar; as duas linhas de Comportamento e o critério de aceite seguem o mesmo enunciado; a condição `THROTTLE_FULL` (requisitos 02, 03 e 09) não muda; `sources:` inalterado (AC-US-0002-01 já consta); versão movida.

### ISSUE-03

- severidade: error
- check: F4
- arquivo: `rules/RULE-0002-ensaios-e-limiares.md`
- local: Ambientes de ensaio, linha 23, coluna "Grama e parede" ("com acelerador 0 (`THROTTLE_ZERO`), a saída é reportada (passo e posição) sem reprovar, e `maxUndersteerMs` continua medido em todo o arco"); Ensaios, linha 74, `REFERENCE_CORNER`, coluna Medição ("medido em todos os passos do arco (com acelerador 0, também nos passos fora da faixa)"); Limiares, linhas 55-58 (nota "`DOMAIN/DEC-12` e `DOMAIN/DEC-13` também não mudam nenhum limiar", sem `DOMAIN/DEC-14`)
- achado: a regra manda medir `maxUndersteerMs` também nos passos fora da faixa com acelerador 0, onde AC-US-0002-01 dos requisitos 3.4.0 (`DOMAIN/DEC-14`) fecha a janela de medição na primeira saída da faixa e exclui os passos depois dela; a mesma contradição de ISSUE-02, no arquivo que define o ensaio. A seção "Fim da varredura de início do subesterço" (linhas 95-128) e a linha `UNDERSTEER_ONSET` (linha 75) já terminam a varredura no primeiro passo fora da faixa e já medem o patamar interrompido só até a saída, coerentes com AC-US-0002-03 e AC-US-0002-06 3.4.0, mas sem citar `DOMAIN/DEC-14`.
- esperado: as duas células passam a "medido só nos passos na faixa de asfalto, até a primeira saída da faixa; os passos depois da saída não entram na medição (`DOMAIN/DEC-14` via AC-US-0002-01)", mantendo a saída reportada sem reprovar (`DOMAIN/DEC-13`); a nota de Limiares cita `DOMAIN/DEC-14` entre as decisões que não mudam limiar; em "Fim da varredura de início do subesterço" e na linha `UNDERSTEER_ONSET`, acrescentar a citação `DOMAIN/DEC-14` (via AC-US-0002-03 e AC-US-0002-06) ao lado de `DOMAIN/DEC-11` para o patamar interrompido medido só até a saída, sem mudar o comportamento; `sources:` inalterado; versão movida.

### ISSUE-04

- severidade: error
- check: F4
- arquivo: `api/API-0003-saida-dos-ensaios.md`
- local: Campos medidos por `benchId`, linha 69 (`maxUndersteerMs`: "maior duração consecutiva de `understeer` em todos os passos do arco (AC-US-0002-05); com `throttleCondition` `THROTTLE_ZERO`, também nos passos fora da faixa (`DOMAIN/DEC-13` via AC-US-0002-01)"); Erros, linhas 140-143 ("o veredito é só o de `maxUndersteerMs` ≤ 200 ms, medido em todos os passos do arco"); Compatibilidade, linhas 199-214 (entrada 3.3.0: "`maxUndersteerMs` ... com `THROTTLE_ZERO`, cobre também os passos fora da faixa" — último estado declarado do campo)
- achado: o significado de `maxUndersteerMs` com `THROTTLE_ZERO` declarado pelo contrato (todos os passos do arco, dentro e fora da faixa) é o que AC-US-0002-01 dos requisitos 3.4.0 (`DOMAIN/DEC-14`) exclui: só os passos na faixa de asfalto, até a primeira saída. A mesma contradição de ISSUE-02, no contrato que a etapa de código e a de testes leem.
- esperado: a linha de `maxUndersteerMs` e o parágrafo de Erros passam a "com `THROTTLE_FULL`, em todos os passos do arco; com `THROTTLE_ZERO`, só nos passos na faixa de asfalto até a primeira saída da faixa, sem os passos depois dela (`DOMAIN/DEC-14` via AC-US-0002-01)"; nova entrada em Compatibilidade (versão 3.4.0 do contrato) declarando que `maxUndersteerMs` mantém nome e unidade e, com `THROTTLE_ZERO`, deixa de cobrir os passos fora da faixa, com a declaração de que nenhum registro foi publicado sob a forma anterior e nenhum consumidor lê o contrato como entrada (a forma aceita em fspec-validation-20261022-1857.md, Coverage, para as mudanças de 3.3.0; o contrato não é dos publicados de I3); na linha de `v1Mps` (linha 76), acrescentar `DOMAIN/DEC-14` à citação do patamar interrompido pela saída (via AC-US-0002-03), sem mudar o valor; `sources:` inalterado; versão movida.

### ISSUE-05

- severidade: error
- check: F4
- arquivo: `flows/FLOW-0002-ensaio-deterministico-e-piloto-de-teste.md`
- local: Alternativas, erros e eventos fora de ordem, linha 64 ("`maxUndersteerMs` continua julgado em todo o arco, dentro e fora da faixa — permanecer na faixa enquanto o kart desacelera não é exigido (`DOMAIN/DEC-13` via AC-US-0002-01; US-0002, caso anormal)")
- achado: o fluxo manda julgar `maxUndersteerMs` nos passos fora da faixa com `THROTTLE_ZERO`, onde o caso anormal "Kart sai da faixa de asfalto do arco" de US-0002 3.4.0 (`DOMAIN/DEC-14`) diz que a primeira saída fecha a janela de medição do critério 01 e que os passos na grama depois dela não entram na medição. A mesma contradição de ISSUE-02. A linha 65 (`UNDERSTEER_ONSET`) e o passo 4 (linha 45) já terminam a varredura no primeiro passo fora da faixa, coerentes com 3.4.0, mas sem citar `DOMAIN/DEC-14`.
- esperado: a linha 64 passa a "a primeira saída fecha a janela de medição de `maxUndersteerMs`: contado só nos passos na faixa de asfalto até ela; os passos depois da saída não entram (`DOMAIN/DEC-14` via AC-US-0002-01); `offAsphaltStepCount`, `offAsphaltFirstStep` e posição reportados sem reprovar (`DOMAIN/DEC-13`)"; na linha 65 e no passo 4, acrescentar a citação `DOMAIN/DEC-14` (via AC-US-0002-03 e AC-US-0002-06) para o patamar interrompido medido só até a saída; `sources:` inalterado; versão movida.

### ISSUE-06

- severidade: error
- check: F4
- arquivo: `01-overview.md`
- local: "O que é especificado", linhas 19-22 ("versão 3.3.0"; "`DOMAIN/DEC-01` a `DOMAIN/DEC-13`, `DOMAIN/REF-01` a `DOMAIN/REF-05`") e linhas 25-27 ("As decisões de 2026-10-22 (`DOMAIN/DEC-11` a `DOMAIN/DEC-13`, `DOMAIN/REF-04`, `DOMAIN/REF-05`) fixam como os ensaios de curva de referência e de início do subesterço terminam e são julgados")
- achado: a base declarada do conjunto é a versão 3.3.0 dos requisitos com as decisões `DOMAIN/DEC-01` a `DOMAIN/DEC-13`; os requisitos estão em 3.4.0 (US-0002, 01-context.md, 97-changelog) e carregam `DOMAIN/DEC-14` (01-context.md 3.4.0, chave de rastreabilidade e tabela "Decisões de domínio aplicadas"), que a visão geral não nomeia: item dos requisitos sem cobertura no conjunto, e enunciado da base contradito pela sua fonte (conventions §6).
- esperado: base "versão 3.4.0" e "`DOMAIN/DEC-01` a `DOMAIN/DEC-14`"; uma frase dizendo que a decisão de 2026-10-27 (`DOMAIN/DEC-14`) fixa onde o `understeer` é medido na curva de referência com acelerador 0 — só no asfalto, até a primeira saída da faixa — e em qualquer ensaio em que a permanência na faixa não é exigida, sem mudar nenhum limiar, com remissão a RULE-0002; versão movida.

## Divergences

Nenhuma.

## Coverage

- lista de `AC-*` reconstruída dos requisitos 3.4.0: 33 critérios (US-0001: 6; US-0002: 6; US-0003: 7; US-0004: 7; US-0005: 6) e 9 NFR; todos constam como item upstream em `99-traceability.md` e são citados no conjunto; "Items with no upstream source": nenhum.
- critério contradito pelos requisitos 3.4.0: AC-US-0002-01 (REQ-FEAT-0002-01 e REQ-FEAT-0002-09 realizam a leitura anterior; ISSUE-02 a ISSUE-05); item dos requisitos sem cobertura: `DOMAIN/DEC-14` (ISSUE-06; nenhum arquivo do conjunto o cita).
- critérios reverificados nesta rodada, cobertos sem contradição: AC-US-0002-02 (REQ-FEAT-0002-03; condição de acelerador cheio inalterada por `DOMAIN/DEC-14`), AC-US-0002-03 (REQ-FEAT-0002-04: a varredura termina na primeira saída da faixa e o patamar interrompido é medido só até ela, como 3.4.0 exige; citação de `DOMAIN/DEC-14` ausente, levada ao esperado de ISSUE-03, ISSUE-04 e ISSUE-05), AC-US-0002-04 (REQ-FEAT-0002-05), AC-US-0002-05 (REQ-FEAT-0002-06), AC-US-0002-06 (REQ-FEAT-0002-10, idem AC-US-0002-03); nos sorteados: AC-US-0004-06 (SCR-0001: estados carregando, vazio, populado, pausada, erro, offline e permissão negada, nos dois canais; única chamada `getHandlingTelemetry` resolve em API-0001; nenhuma regra de pilotagem na tela; nenhum módulo, biblioteca ou tabela nomeado), AC-US-0005-04, AC-US-0005-05, AC-US-0005-06, NFR-0006, NFR-0007, NFR-0009 (API-0002: todo campo com obrigatoriedade, padrão e motivo de neutralidade; chave `challengeNumber` com `trackVersion` preservada no resultado, D-FS-01; auth `player` anônimo com o motivo de ser público; superfície de erro completa; idempotência declarada como leitura pura e a gravação de I7 nomeada à feature que a possui; nenhuma retirada, nenhum campo redefinido sob o mesmo nome, nenhuma operação só mobile, nenhuma configuração; acréscimo aditivo aos registros com leitor da forma antiga e ensaio `SETUP_VERSION` que a lê, I5; nenhum segredo ou dado real).
- critérios não reverificados nesta rodada (população fixa; conforme fspec-validation-20261022-1837.md e -1857.md): AC-US-0001-01 a AC-US-0001-06; AC-US-0003-01 a AC-US-0003-07; AC-US-0004-01 a AC-US-0004-05 e AC-US-0004-07; AC-US-0005-01 a AC-US-0005-03; NFR-0001 a NFR-0005 e NFR-0008.
- requisitos sem fonte: nenhum (62 REQ; cada um cita `AC-*`, um NFR ou `[DOMAIN]` com item dos requisitos; varredura mecânica).
- fora do escopo de `01-overview.md`: igual ao dos requisitos (quatro itens; inalterado em 3.4.0).
- contratos sem consumidor: nenhum (`API-0001`: FEAT-0001 a FEAT-0004, FLOW-0001, FLOW-0002, SCR-0001; `API-0002`: FEAT-0005, FEAT-0006, FLOW-0003, SCR-0002; `API-0003`: FEAT-0001 a FEAT-0006, FLOW-0002).
- `98-divergences.md`: cabeçalho bem formado, nenhuma linha; `OPEN-<nn>` e `TBD`: nenhum (propriedade do gate, confirmada por varredura).
- feedback entre features: nenhum a enviar (nenhum achado cuja correção pertença a outra feature).
