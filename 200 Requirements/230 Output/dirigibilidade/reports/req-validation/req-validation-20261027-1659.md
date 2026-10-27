---
stage: req
feature: dirigibilidade
verdict: FAIL
generated: 2026-10-27T16:59:15Z
counts: {blocker: 0, error: 2, warning: 0, info: 2, divergence: 0}
seed: {revision: 3, digest: 7dd24c8b6cab}
feedbacks: []
population: "revalidação de req-validation-20261022-1829.md: as duas issues anteriores reverificadas primeiro; nenhum arquivo com `version:` movida desde aquele relatório (só o `generated:` de 00-index.md e 99-traceability.md); dois arquivos intocados sorteados (NFR-0006, NFR-0009); 98-divergences.md para R8; insumo movido desde aquele relatório: `DOMAIN.md` ganhou a 19.ª entrada (2026-10-27, \"Onde o subesterço é medido na curva com acelerador zero\") e `SCOPE-BACKLOG.md` passou a existir na pasta do seed (2 entradas) — ambos conferidos para R4 nos dois sentidos"
---

# Relatório de validação — dirigibilidade

## Issues anteriores

- ISSUE-01 (R3, info, US-0002, AC-US-0002-03 e glossário "Velocidade de início do subesterço") — mantida como ISSUE-03 abaixo: texto e `version:` (3.3.0) inalterados; `DOMAIN/DEC-12` inalterado.
- ISSUE-02 (R3, info, US-0003, AC-US-0003-01) — mantida como ISSUE-04 abaixo: texto e `version:` (3.0.0) inalterados.

## Issues

### ISSUE-01
- severity: error
- check: R4
- file: 01-context.md
- location: chave de rastreabilidade (tabela "Itens do seed e decisões de domínio") e tabela "Decisões de domínio aplicadas"
- finding: a entrada de 2026-10-27 de `DOMAIN.md` — "Onde o subesterço é medido na curva com acelerador zero": no ensaio do arco de 18 m entrando a 50 km/h com acelerador zero, o `understeer` conta só no asfalto, até a primeira saída da faixa; passos na grama depois da saída não entram na medição; limiar 200 ms mantido; o mesmo vale para qualquer ensaio em que a permanência na faixa não é exigida — não tem rótulo na chave, não consta da tabela de decisões aplicadas, de nenhum `sources:` nem das Fontes de US-0002, e a matriz gerada não a liga a nada: item do seed sem cobertura (`DOMAIN.md`: 19 entradas, 18 cobertas).
- expected: rótulo `DOMAIN/DEC-14` na chave, com o texto da decisão; linha na tabela de decisões aplicadas apontando US-0002 (critério 01 na condição de acelerador 0; caso anormal "Kart sai da faixa de asfalto do arco"; e, por "o mesmo vale para qualquer ensaio em que a permanência na faixa não é exigida", o patamar interrompido pela saída acima de 50 km/h dos critérios 03 e 06, onde a varredura já termina na saída e só falta a citação); o rótulo no `sources:` e nas Fontes de US-0002, para que a matriz gerada o ligue.

### ISSUE-02
- severity: error
- check: R2
- file: stories/US-0002-aderencia-em-curva.md
- location: AC-US-0002-01 e caso anormal "Kart sai da faixa de asfalto do arco"
- finding: na condição de acelerador 0 o critério 01 conta o `understeer` "em nenhum trecho do arco" e o caso anormal declara que, depois da saída da faixa, "o ensaio reporta o passo e a posição da saída e o critério 01 continua a ser julgado em todo o arco"; `DOMAIN.md` (2026-10-27) fixa que o `understeer` conta só no asfalto, até a primeira saída da faixa, e que passos na grama depois da saída não entram na medição — a história contradiz uma decisão do seed.
- expected: o critério 01 declara que, na condição de acelerador 0, a maior sequência de `understeer` consecutivo é contada só nos passos em que o kart está na faixa de asfalto, até a primeira saída, com o limiar de 200 ms inalterado, citando o rótulo novo; o caso anormal diz que a primeira saída fecha a janela de medição do critério 01 (o ensaio continua a reportar o passo e a posição da saída) e que na condição de acelerador cheio nada muda (a saída falha o critério 02).

### ISSUE-03
- severity: info
- check: R3
- file: stories/US-0002-aderencia-em-curva.md
- location: AC-US-0002-03 (e a mesma frase na definição "Velocidade de início do subesterço" de 02-glossary.md)
- finding: (reverificada de req-validation-20261022-1829.md, ISSUE-01, texto inalterado) o critério traz, citando `DOMAIN/DEC-12`, a regra "V1 é a velocidade mantida do patamar interrompido pela saída e o critério é avaliado com esse valor" e a frase "nunca sair de frente até sair da faixa cumpre o critério"; as duas só coincidem quando a velocidade do patamar interrompido é maior ou igual a 1,15 × V0. Observação que decide, tal como o conjunto está: a saída do ensaio reporta V1 em km/h igual à velocidade mantida do patamar interrompido e o veredito é aprovado quando V1 ≥ 1,15 × V0 (a fórmula governa). `DOMAIN/DEC-12` carrega as duas leituras; a escolha no caso em que divergem é do dono do produto.
- expected: nenhuma mudança no conjunto por esta etapa; se o dono do produto quiser que nunca sair de frente até sair da faixa aprove incondicionalmente, `DOMAIN.md` diz isso primeiro e o critério 03 passa a declarar essa regra em vez da fórmula nesse caso.

### ISSUE-04
- severity: info
- check: R3
- file: stories/US-0003-traseira-viva-e-controlavel.md
- location: AC-US-0003-01
- finding: (reverificada de req-validation-20261022-1829.md, ISSUE-02, texto inalterado) a cláusula da curva de referência com acelerador cheio é ligada à condução normal por "em particular", mas com acelerador cheio a velocidade pode passar de 50 km/h no arco e a condição de forçar passa a valer; o critério é decidível (estado de aderência em todos os passos do arco), mais estrito que o seed e coerente com `DOMAIN/DEC-13`.
- expected: a cláusula da curva de referência é separada da cláusula de condução normal e declara que vale em todos os passos do arco, inclusive acima de 50 km/h.

## Divergences

None.

## Coverage

Seed items: 27 covered (5 histórias, 6 regras de domínio, 4 NFRs, 4 restrições, 4 impactos no domínio, 4 itens fora do escopo), 0 uncovered. `DOMAIN.md`: 19 entradas, 18 cobertas (`DOMAIN/REF-01` a `REF-05`, `DOMAIN/DEC-01` a `DEC-13`), 1 não coberta: 2026-10-27, "Onde o subesterço é medido na curva com acelerador zero" (ISSUE-01, ISSUE-02). `SCOPE-BACKLOG.md`: 2 entradas de 2026-10-27 (V0 quando a linha de base nunca sai de frente; veredito para saída da faixa exatamente a 50 km/h e para varredura que termina sem saída), ambas perguntas adiadas ao autor sem decisão tomada — nada a cobrir, e o conjunto não inventa regra para nenhuma delas. Lista "Fora do escopo" de `01-context.md` igual à do seed. Set items with no seed source: 0 (sorteados: NFR-0006 → `SEED/RE-02`, `SEED/RD-03`, `SEED/IM-I8`; NFR-0009 → `SEED/RD-04`, `SEED/IM-I3I5`). R5 nos sorteados: limite com unidade e método de observação presentes; nenhum enunciado como escolha de projeto. R7 nos arquivos da população: `STEP`, `Input`, 480 Hz, `trackVersion`, `docs/physics.md`, `npm test`/`npm run bench:handling` citados ao seed. R8: nenhum `OPEN-<nn>` nem `TBD`; `98-divergences.md` sem linhas.

## Contexto recebido fora do procedimento

Linhas de assunto do `git log` (usadas só para datar o insumo movido) carregam o motivo das rodadas de código e de spec; `NOTES.md` traz a proveniência dos limiares; `SCOPE-BACKLOG.md` nomeia a rodada do D-Spec e identificadores de código; `97-changelog.md` só por `grep` de `SCOPE-BACKLOG`, não lido. Nada disso entrou no julgamento. A raiz de código não foi lida.
