---
stage: req
feature: dirigibilidade
verdict: FAIL
generated: 2026-10-22T18:17:59Z
counts: {blocker: 0, error: 5, warning: 0, info: 2, divergence: 0}
seed: {revision: 3, digest: 7dd24c8b6cab}
feedbacks: []
population: "revalidação de req-validation-20261022-1506.md: a issue anterior reverificada primeiro; nenhum arquivo com `version:` movida desde aquele relatório (00-index.md e 99-traceability.md só tiveram `generated:` reemitido pelo lint; nenhuma linha de gerador no log de fases desta rodada); dois arquivos intocados sorteados (NFR-0004, NFR-0003); 98-divergences.md para R8; as duas entradas novas de `DOMAIN.md` (2026-10-22, \"Início do subesterço num acerto que não sai de frente\" e \"Curva de referência com acelerador zero\") conferidas para R4 nos dois sentidos"
---

# Relatório de validação — dirigibilidade

## Issues anteriores

- ISSUE-01 (R3, info, US-0003, AC-US-0003-01) — mantida como ISSUE-06 abaixo: texto e `version:` (3.0.0) inalterados.

## Issues

### ISSUE-01
- severity: error
- check: R4
- file: 01-context.md
- location: tabela "Itens do seed e decisões de domínio (chave de rastreabilidade)" e tabela "Decisões de domínio aplicadas"
- finding: as duas entradas de `DOMAIN.md` datadas de 2026-10-22 depois de `DOMAIN/REF-04` — "Início do subesterço num acerto que não sai de frente" e "Curva de referência com acelerador zero" — não têm rótulo na chave e não estão mapeadas a nenhuma história; a matriz gerada não consegue ligá-las e nenhum `sources:` as cita.
- expected: um rótulo por entrada (p. ex. `DOMAIN/DEC-12` e `DOMAIN/DEC-13`) na chave, cada um mapeado a US-0002 na tabela de decisões aplicadas, citado no `sources:` e nas Fontes de US-0002.

### ISSUE-02
- severity: error
- check: R4
- file: stories/US-0002-aderencia-em-curva.md
- location: AC-US-0002-03
- finding: V1 só tem valor quando algum patamar reporta `understeer` por mais de 200 ms consecutivos; quando a varredura termina pela saída da faixa acima de 50 km/h sem nenhum patamar ter reportado `understeer`, V1 não existe e "V1 ≥ 1,15 × V0" é indecidível — caso que `DOMAIN.md` (2026-10-22, "Início do subesterço num acerto que não sai de frente") fecha: V1 é a velocidade mantida do patamar interrompido pela saída e nunca sair de frente até sair da faixa cumpre o critério.
- expected: o critério declara esse caso e o valor de V1 nele, citando o rótulo novo; observação que decide: a saída do ensaio reporta V1 em km/h igual à velocidade mantida do patamar interrompido e o veredito é aprovado quando V1 ≥ 1,15 × V0.

### ISSUE-03
- severity: error
- check: R4
- file: 02-glossary.md
- location: termo "Velocidade de início do subesterço"
- finding: a definição só cobre "menor velocidade medida em cujo patamar a telemetria reporta `understeer` por mais de 200 ms consecutivos"; não diz o que vale quando nenhum patamar chega a isso antes de a varredura terminar pela saída da faixa acima de 50 km/h, caso fechado por `DOMAIN.md` (2026-10-22, "Início do subesterço num acerto que não sai de frente").
- expected: a definição acrescenta o caso de recuo — velocidade mantida do patamar interrompido pela saída, que não é um patamar completo no sentido de `DOMAIN/REF-04` — citando o rótulo novo.

### ISSUE-04
- severity: error
- check: R2
- file: stories/US-0002-aderencia-em-curva.md
- location: AC-US-0002-02
- finding: exige que o kart permaneça dentro da faixa em todos os passos do arco nas duas condições de acelerador, inclusive com acelerador 0; `DOMAIN.md` (2026-10-22, "Curva de referência com acelerador zero") decide que com acelerador zero o único critério é "sem `understeer` por mais de 200 ms consecutivos" e que permanecer na faixa enquanto desacelera não é exigido — o critério contradiz a camada de domínio do seed.
- expected: o critério 02 restrito à condição de acelerador cheio mantido; a condição de acelerador 0 julgada só pelo critério 01, com o rótulo novo citado em ambos.

### ISSUE-05
- severity: error
- check: R2
- file: stories/US-0002-aderencia-em-curva.md
- location: Casos anormais, "Kart sai da faixa de asfalto do arco"
- finding: afirma que, na curva de referência dos critérios 01 e 02, "nas duas condições de acelerador", o passo em que o kart sai da faixa falha o critério 02 em qualquer velocidade; contradiz a mesma decisão de `DOMAIN.md` (2026-10-22, "Curva de referência com acelerador zero") para a condição de acelerador 0.
- expected: a saída da faixa falha o critério 02 só na condição de acelerador cheio; com acelerador 0 o ensaio reporta o passo e a posição da saída e não reprova por ela.

### ISSUE-06
- severity: info
- check: R3
- file: stories/US-0003-traseira-viva-e-controlavel.md
- location: AC-US-0003-01
- finding: (reverificada de req-validation-20261022-1506.md, ISSUE-01, texto inalterado) a cláusula da curva de referência com acelerador cheio é ligada à condução normal por "em particular", mas com acelerador cheio a velocidade pode passar de 50 km/h no arco e a condição de forçar passa a valer; o critério é decidível (estado de aderência em todos os passos do arco) e mais estrito que o seed.
- expected: a cláusula da curva de referência é separada da cláusula de condução normal e declara que vale em todos os passos do arco, inclusive acima de 50 km/h.

### ISSUE-07
- severity: info
- check: R2
- file: stories/US-0002-aderencia-em-curva.md
- location: AC-US-0002-01, condição de acelerador cheio
- finding: `DOMAIN.md` (2026-10-22, "Curva de referência com acelerador zero") diz que a variante com acelerador cheio "continua exigindo permanência na faixa e ausência de `understeer`/`oversteer`"; lida aqui como o estado atual — `DOMAIN/DEC-03` (200 ms consecutivos, "mantido") para `understeer` e AC-US-0003-01 para `oversteer` —, não como tolerância zero a `understeer`; nenhuma contradição registrada sob essa leitura.
- expected: nenhuma mudança no conjunto; se o dono do produto quis tolerância zero com acelerador cheio, `DOMAIN/DEC-03` muda primeiro em `DOMAIN.md`.

## Divergences

None.

## Coverage

Seed items: 27 covered (5 histórias, 6 regras de domínio, 4 NFRs, 4 restrições, 4 impactos no domínio, 4 itens fora do escopo), 0 uncovered. `DOMAIN.md`: 17 entradas, 15 cobertas (REF-01 a REF-04, DEC-01 a DEC-11), 2 não cobertas — "Início do subesterço num acerto que não sai de frente" (ISSUE-01, ISSUE-02, ISSUE-03) e "Curva de referência com acelerador zero" (ISSUE-01, ISSUE-04, ISSUE-05), ambas de 2026-10-22. `SCOPE-BACKLOG.md` não existe na pasta do seed. Lista "Fora do escopo" de `01-context.md` igual à do seed. Set items with no seed source: 0.

## Contexto recebido fora do procedimento

`NOTES.md` da pasta do seed traz proveniência dos limiares (quem propôs, quem fechou); foi lido como material de apoio e nada dele entrou no julgamento. `97-changelog.md` não foi lido: sua `version:` não moveu.
