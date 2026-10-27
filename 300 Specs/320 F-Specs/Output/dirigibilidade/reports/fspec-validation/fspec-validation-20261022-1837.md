---
stage: fspec
feature: dirigibilidade
verdict: FAIL
generated: 2026-10-22T18:37:46Z
counts: {blocker: 0, error: 10, warning: 1, info: 0, divergence: 0}
seed: {revision: 3, digest: 7dd24c8b6cab}
upstream: {stage: req, version: 3.3.0}
feedbacks: []
population: "revalidação após fspec-validation-20261022-1542 (SUCCESS, upstream 3.2.0): nenhuma issue anterior a reverificar; nenhum arquivo deste conjunto com version movida desde aquele relatório (git: só 00-index.md e 99-traceability.md, gerados pelo lint, mudaram; o log de fases desta rodada não tem linha de gerador); o upstream moveu para 3.3.0 (US-0002 3.2.0 -> 3.3.0, 01-context.md e 02-glossary.md 3.2.0 -> 3.3.0: DOMAIN/DEC-12, DOMAIN/DEC-13, DOMAIN/REF-05), por isso F4 sobre a lista completa de AC-* e NFR-* trouxe à população os arquivos que realizam US-0002: features/FEAT-0002, rules/RULE-0002, flows/FLOW-0002, api/API-0003, mais 01-overview.md (fora do escopo e base declarada), 02-glossary.md (F3) e 98-divergences.md (F9); dois arquivos intocados sorteados (random.SystemRandom): features/FEAT-0001, flows/FLOW-0001; verificações mecânicas sobre o conjunto inteiro: links relativos (138, todos resolvem), blocos mermaid (4), formato dos REQ (62 SHALL, 0 sem modal ou com mais de um), TBD/OPEN (nenhum), segredos (nenhum)"
isolation: "nenhuma justificativa do gerador chegou a este validador; 97-changelog.md não foi lido (só varrido por grep mecânico de segredos, TBD e OPEN, sem exibir conteúdo); os arquivos com version movida foram identificados por git diff, não pelo changelog"
---

# Relatório de validação — dirigibilidade

## Summary

- veredito: FAIL
- contagens: blocker 0, error 10, warning 1, info 0, divergence 0
- causa: o conjunto realiza US-0002 na versão 3.2.0; os requisitos estão em 3.3.0 (`DOMAIN/DEC-12`, `DOMAIN/DEC-13`, `DOMAIN/REF-05`) e os critérios AC-US-0002-01, AC-US-0002-02 e AC-US-0002-03 mudaram de conteúdo

## Issues

### ISSUE-01

- severidade: error
- check: F4
- arquivo: `features/FEAT-0002-aderencia-em-curva.md`
- local: Resumo (linhas 16-18); REQ-FEAT-0002-03 (linhas 44-47); Comportamento, linha "Curva de referência da pista de teste a 50 km/h, esterço cheio, acelerador 0 ou cheio" (linha 92); Critérios de aceite, primeiro item (linhas 118-120)
- achado: o requisito 03 exige que o kart permaneça na faixa de asfalto do arco "em cada uma das duas condições de acelerador (0 mantido; cheio mantido)", e o Resumo, a tabela de comportamento e o critério de aceite repetem `offAsphaltStepCount` 0 nas duas condições; AC-US-0002-02 (3.3.0) restringe a permanência na faixa à condição de acelerador cheio e AC-US-0002-01 (3.3.0) declara que, com acelerador 0, "permanecer na faixa enquanto o kart desacelera não é exigido" (`DOMAIN/DEC-13`).
- esperado: REQ-FEAT-0002-03 limitado à condição de acelerador cheio, citando AC-US-0002-02 e `DOMAIN/DEC-13`; a condição de acelerador 0 julgada só pelo requisito 01 (AC-US-0002-01); Resumo, tabela de comportamento e critério de aceite alinhados (`offAsphaltStepCount` 0 só para `THROTTLE_FULL`).

### ISSUE-02

- severidade: error
- check: F4
- arquivo: `features/FEAT-0002-aderencia-em-curva.md`
- local: REQ-FEAT-0002-09 (linhas 68-71); Comportamento, linha "Kart sai da faixa de asfalto do arco na curva de referência (`REFERENCE_CORNER`)" (linha 95); Critérios de aceite, quarto item (linhas 127-128)
- achado: o requisito 09 reporta `REFERENCE_CORNER` como `FAIL` com `OFF_ASPHALT` "em qualquer velocidade", sem distinguir a condição de acelerador, e "sem medir critério de subesterço fora do asfalto"; o caso anormal "Kart sai da faixa de asfalto do arco" de US-0002 (3.3.0) fixa que, na condição de acelerador 0, a saída da faixa não reprova o ensaio, o ensaio reporta o passo e a posição da saída e o critério 01 continua a ser julgado em todo o arco (`DOMAIN/DEC-13`).
- esperado: REQ-FEAT-0002-09 restrito a `throttleCondition` `THROTTLE_FULL`; para `THROTTLE_ZERO`, o registro reporta `offAsphaltFirstStep` e a posição sem `FAIL` por essa saída e `maxUndersteerMs` continua medido em todo o arco, como o caso anormal determina; tabela de comportamento e critério de aceite alinhados.

### ISSUE-03

- severidade: error
- check: F4
- arquivo: `features/FEAT-0002-aderencia-em-curva.md`
- local: REQ-FEAT-0002-04 (linhas 48-50); Comportamento, linha "Kart sai da faixa de asfalto do arco na varredura de `UNDERSTEER_ONSET`" (linha 96, "o patamar interrompido pela saída não é velocidade medida nem entra em V1") e linha "Varredura de `UNDERSTEER_ONSET` sem V1 medida" (linha 97); Critérios de aceite, segundo item (linhas 121-124)
- achado: o conjunto declara que, sem patamar completo com `understeer` por mais de 200 ms consecutivos, `v1Mps` fica ausente e o fim natural da varredura é `FAIL` com `MEASUREMENT_MISSING`, e que o patamar interrompido pela saída nunca entra em V1; AC-US-0002-03 (3.3.0) fixa que, quando a varredura termina pela saída da faixa acima de 50 km/h sem nenhum patamar ter reportado `understeer` por mais de 200 ms consecutivos, V1 é a velocidade mantida do patamar interrompido pela saída, a saída do ensaio reporta V1 em km/h igual a essa velocidade, o critério é avaliado com esse valor e "nunca sair de frente até sair da faixa cumpre o critério" (`DOMAIN/DEC-12`, `DOMAIN/REF-05`).
- esperado: REQ-FEAT-0002-04 (ou requisito próprio citando AC-US-0002-03) define V1 como no critério: menor velocidade medida em cujo patamar `understeer` dura mais de 200 ms consecutivos ou, sem nenhum patamar assim até a saída acima de 50 km/h, a velocidade mantida do patamar interrompido; nesse caso o veredito de V1 ≥ 1,15 × V0 é avaliado com esse valor e `v1Mps` é reportado; as linhas de comportamento e o critério de aceite deixam de prever `MEASUREMENT_MISSING` por "V1 não medida".

### ISSUE-04

- severidade: error
- check: F4
- arquivo: `rules/RULE-0002-ensaios-e-limiares.md`
- local: Ambientes de ensaio, linha `TEST_PAD`, coluna "Grama e parede" (linha 23, "em `REFERENCE_CORNER` e `REAR_RECOVERY`, o passo fora da faixa falha o ensaio (`OFF_ASPHALT`)"); Ensaios, linha `REFERENCE_CORNER`, coluna "Veredito `PASS` se" (linha 72, "0 passos fora da faixa de asfalto")
- achado: a regra exige 0 passos fora da faixa nas duas condições de acelerador e faz a saída da faixa falhar `REFERENCE_CORNER` sem distinguir a condição; AC-US-0002-01 e AC-US-0002-02 (3.3.0) exigem a permanência na faixa só com acelerador cheio e, com acelerador 0, o único critério é `maxUndersteerMs` ≤ 200 ms (`DOMAIN/DEC-13`).
- esperado: linha `REFERENCE_CORNER` com veredito `PASS` se `maxUndersteerMs` ≤ 200 ms nas duas condições e, só em `THROTTLE_FULL`, 0 passos fora da faixa e `handling` só `grip` ou `understeer`; linha `TEST_PAD` dizendo que em `REFERENCE_CORNER` a saída da faixa falha o ensaio só com acelerador cheio e, com acelerador 0, é reportada (passo e posição) sem reprovar; fonte `DOMAIN/DEC-13` via AC-US-0002-01 e AC-US-0002-02 citada (F7).

### ISSUE-05

- severidade: error
- check: F4
- arquivo: `rules/RULE-0002-ensaios-e-limiares.md`
- local: Ensaios, linha `UNDERSTEER_ONSET`, colunas "Medição" e "Veredito `PASS` se" (linha 73, "`v1Mps` ... ausente quando nenhum patamar completo o tem — V1 não medida" e "sem V1 medida, `FAIL` com `MEASUREMENT_MISSING`"); Fim da varredura de início do subesterço, prosa (linha 98, "O patamar interrompido pela saída não é velocidade medida, nem entra em V1"), tabela, segunda linha (linha 105) e prosa (linhas 109-110, "`v1Mps` só é reportado quando V1 foi medida")
- achado: a regra decide o fim natural da varredura sem patamar com `understeer` por mais de 200 ms como `FAIL` com `MEASUREMENT_MISSING` e exclui o patamar interrompido de V1; AC-US-0002-03 (3.3.0) e o caso anormal "Nenhum patamar reporta `understeer` até a saída da faixa acima de 50 km/h" fixam V1 como a velocidade mantida do patamar interrompido pela saída, com o critério V1 ≥ 1,15 × V0 avaliado com esse valor e cumprido por nunca sair de frente (`DOMAIN/DEC-12`); o rótulo `understeer` não muda e "sem `understeer`" é nenhuma sequência acima de 200 ms, não tolerância zero (`DOMAIN/REF-05`).
- esperado: linha `UNDERSTEER_ONSET` e tabela "Fim da varredura" (segunda linha) com V1 definido nos dois casos e `v1Mps` sempre reportado no fim natural da varredura; `MEASUREMENT_MISSING` restrito à saída acima de 50 km/h antes do segundo patamar completo acima de 50 km/h (AC-US-0002-06, inalterado); a prosa deixa de dizer que o patamar interrompido nunca entra em V1 e passa a dizer que ele entra só como V1 do caso de `DOMAIN/DEC-12`, sem ser patamar completo para AC-US-0002-04; fontes `DOMAIN/DEC-12` e `DOMAIN/REF-05` citadas via AC-US-0002-03 (F7).

### ISSUE-06

- severidade: error
- check: F4
- arquivo: `api/API-0003-saida-dos-ensaios.md`
- local: Campos medidos, linha `REFERENCE_CORNER` / `offAsphaltStepCount` (linha 70, "0 para `PASS`"); Erros, linha "`FAIL` com `OFF_ASPHALT`" (linha 125, "`offAsphaltStepCount` > 0 em `TEST_PILOT_LAP`, `REFERENCE_CORNER` ou `REAR_RECOVERY`")
- achado: o contrato faz `offAsphaltStepCount` > 0 reprovar `REFERENCE_CORNER` em qualquer `throttleCondition`; AC-US-0002-01 e AC-US-0002-02 (3.3.0) só exigem a permanência na faixa com acelerador cheio, e o caso anormal de US-0002 fixa que, com acelerador 0, o registro reporta o passo e a posição da saída sem reprovar (`DOMAIN/DEC-13`).
- esperado: restrição de `offAsphaltStepCount` "0 para `PASS`" só com `throttleCondition` `THROTTLE_FULL`; em `THROTTLE_ZERO` o campo é informativo e `offAsphaltFirstStep`, `offAsphaltFirstXM` e `offAsphaltFirstZM` continuam reportados; linha `OFF_ASPHALT` da tabela Erros com a condição "em `REFERENCE_CORNER`, só com `THROTTLE_FULL`"; seção Compatibilidade registra a mudança de condição do veredito.

### ISSUE-07

- severidade: error
- check: F4
- arquivo: `api/API-0003-saida-dos-ensaios.md`
- local: Campos medidos, linha `UNDERSTEER_ONSET` / `v1Mps` (linha 76, "só quando V1 foi medida ... o patamar interrompido pela saída da faixa não conta; ausente quando nenhum patamar completo o teve"); Erros, linha "`FAIL` com `MEASUREMENT_MISSING`", caso (b) (linha 126); prosa após a tabela Erros (linhas 131-136); Compatibilidade, parágrafo da versão 3.2.0 (linhas 187-190)
- achado: `v1Mps` é condicional a "V1 medida" e o fim natural da varredura sem patamar com `understeer` por mais de 200 ms é `FAIL` com `MEASUREMENT_MISSING` (caso b); AC-US-0002-03 (3.3.0) exige que a saída do ensaio reporte V1 em km/h igual à velocidade mantida do patamar interrompido pela saída e que o critério seja avaliado com esse valor (`DOMAIN/DEC-12`), e AC-US-0002-05 exige V0 e V1 em km/h na saída.
- esperado: `v1Mps` obrigatório sempre que a varredura termina pela saída acima de 50 km/h com pelo menos dois patamares completos acima de 50 km/h, com o valor definido nos dois casos (menor velocidade de patamar completo com `understeer` por mais de 200 ms consecutivos; senão, velocidade mantida do patamar interrompido pela saída, `DOMAIN/DEC-12`); `MEASUREMENT_MISSING` restrito ao caso (a); prosa e Compatibilidade registram a mudança de significado e de obrigatoriedade de `v1Mps` e o estreitamento de `MEASUREMENT_MISSING` sob o mesmo nome, com a declaração de que nenhum registro foi publicado sob a forma anterior e nenhum consumidor lê o contrato como entrada (I3, F5).

### ISSUE-08

- severidade: error
- check: F4
- arquivo: `flows/FLOW-0002-ensaio-deterministico-e-piloto-de-teste.md`
- local: Alternativas, erros e eventos fora de ordem, linha "Kart sai da faixa de asfalto do arco em `REFERENCE_CORNER`" (linha 63)
- achado: o fluxo trata a saída da faixa em `REFERENCE_CORNER` como `FAIL` com `OFF_ASPHALT` "em qualquer velocidade", sem distinguir a condição de acelerador; o caso anormal "Kart sai da faixa de asfalto do arco" de US-0002 (3.3.0) fixa que, com acelerador 0, a saída não reprova e o critério 01 continua a ser julgado em todo o arco (`DOMAIN/DEC-13`).
- esperado: linha dividida por `throttleCondition`: `THROTTLE_FULL` reprova com `OFF_ASPHALT`, passo e posição; `THROTTLE_ZERO` reporta passo e posição sem reprovar e mantém `maxUndersteerMs` julgado em todo o arco.

### ISSUE-09

- severidade: error
- check: F4
- arquivo: `flows/FLOW-0002-ensaio-deterministico-e-piloto-de-teste.md`
- local: Alternativas, erros e eventos fora de ordem, linha "Kart sai da faixa de asfalto do arco em `UNDERSTEER_ONSET` (novo acerto)" (linha 64, "nesse fim natural sem V1 medida ..., `FAIL` com `MEASUREMENT_MISSING` e `v1Mps` ausente")
- achado: o fluxo reprova o fim natural da varredura sem patamar com `understeer` por mais de 200 ms e omite `v1Mps`; AC-US-0002-03 (3.3.0) fixa V1 como a velocidade mantida do patamar interrompido pela saída, reportada em km/h, com o critério cumprido por nunca sair de frente (`DOMAIN/DEC-12`).
- esperado: linha dizendo que, no fim natural sem patamar com `understeer` por mais de 200 ms consecutivos, `v1Mps` é a velocidade mantida do patamar interrompido e o veredito de V1 ≥ 1,15 × V0 é avaliado com esse valor; `MEASUREMENT_MISSING` só antes do segundo patamar completo acima de 50 km/h.

### ISSUE-10

- severidade: error
- check: F3
- arquivo: `02-glossary.md`
- local: Termos de domínio, linha "Velocidade de início do subesterço" (linha 52); Enums e campos dos contratos, linha `failReason` (linha 84, "ou fim natural da varredura sem V1 medida")
- achado: o glossário define a velocidade de início do subesterço só pelo patamar com `understeer` por mais de 200 ms consecutivos e faz `MEASUREMENT_MISSING` cobrir o fim natural da varredura sem V1 medida; o glossário dos requisitos (3.3.0), que AC-US-0002-03 nomeia como definição, acrescenta que, para o novo acerto, sem nenhum patamar assim antes da saída acima de 50 km/h, V1 é a velocidade mantida do patamar interrompido (`DOMAIN/DEC-12`) e que "sem `understeer`" é nenhuma sequência acima de 200 ms, não tolerância zero (`DOMAIN/REF-05`); o mesmo conceito fica definido de dois modos entre os requisitos e este conjunto.
- esperado: linha "Velocidade de início do subesterço" com os dois casos e a leitura de `DOMAIN/REF-05`; linha `failReason` com `MEASUREMENT_MISSING` restrito à saída acima de 50 km/h antes do segundo patamar completo acima de 50 km/h.

### ISSUE-11

- severidade: warning
- check: F4
- arquivo: `01-overview.md`
- local: O que é especificado, primeiro parágrafo (linhas 19-21)
- achado: a base declarada é o conjunto de requisitos "versão 3.0.0" com "`DOMAIN/DEC-01` a `DOMAIN/DEC-10`, `DOMAIN/REF-01` a `DOMAIN/REF-03`"; os requisitos validados estão em 3.3.0 e carregam também `DOMAIN/DEC-11`, `DOMAIN/DEC-12`, `DOMAIN/DEC-13`, `DOMAIN/REF-04` e `DOMAIN/REF-05`, que este conjunto já cita em parte (RULE-0002, FEAT-0002).
- esperado: base declarada igual à versão e ao conjunto de decisões dos requisitos realizados (3.3.0; `DOMAIN/DEC-01` a `DOMAIN/DEC-13`, `DOMAIN/REF-01` a `DOMAIN/REF-05`).

## Divergences

Nenhuma.

## Coverage

- critérios cobertos sem contradição: AC-US-0001-01 a AC-US-0001-06 (FEAT-0001); AC-US-0002-04, AC-US-0002-05, AC-US-0002-06 (FEAT-0002); AC-US-0003-01 a AC-US-0003-07 (FEAT-0003); AC-US-0004-01 a AC-US-0004-07 (FEAT-0004); AC-US-0005-01 a AC-US-0005-06 (FEAT-0005); NFR-0001 a NFR-0009 (FEAT-0005, FEAT-0006).
- critérios cobertos com contradição ao upstream 3.3.0: AC-US-0002-01 e AC-US-0002-02 (ISSUE-01, ISSUE-02, ISSUE-04, ISSUE-06, ISSUE-08); AC-US-0002-03 (ISSUE-03, ISSUE-05, ISSUE-07, ISSUE-09, ISSUE-10).
- critérios descobertos: nenhum.
- requisitos sem fonte: nenhum (62 REQ, todos citam AC-* ou [DOMAIN] com item dos requisitos).
- fora do escopo de `01-overview.md`: igual ao dos requisitos (quatro itens).
- contratos sem consumidor: nenhum (`API-0001`: FEAT-0001 a FEAT-0004, FLOW-0001, FLOW-0002, SCR-0001; `API-0002`: FEAT-0005, FEAT-0006, FLOW-0003, SCR-0002; `API-0003`: FEAT-0001 a FEAT-0006, FLOW-0002).
