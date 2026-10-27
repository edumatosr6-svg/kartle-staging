---
stage: req
feature: dirigibilidade
verdict: SUCCESS
generated: 2026-10-27T17:13:26Z
counts: {blocker: 0, error: 0, warning: 0, info: 2, divergence: 0}
seed: {revision: 3, digest: 7dd24c8b6cab}
feedbacks: []
population: "revalidação de req-validation-20261027-1659.md: as quatro issues anteriores reverificadas primeiro; arquivos com `version:` movida desde aquele relatório: 01-context.md (3.3.0 → 3.4.0), 97-changelog.md (3.3.1 → 3.4.0, só as linhas acrescentadas, filtradas por grep para R7 e R8), stories/US-0002-aderencia-em-curva.md (3.3.0 → 3.4.0); dois arquivos intocados sorteados (US-0004, NFR-0003); 98-divergences.md para R8; `DOMAIN.md` (19 entradas) e `SCOPE-BACKLOG.md` (2 entradas) conferidos para R4 nos dois sentidos"
---

# Relatório de validação — dirigibilidade

## Issues anteriores

- ISSUE-01 (R4, error, 01-context.md) — fechada: `DOMAIN/DEC-14` consta da chave de rastreabilidade com o texto da decisão; a tabela "Decisões de domínio aplicadas" tem a linha `DOMAIN/DEC-14` apontando US-0002 (critério 01 na condição de acelerador 0; caso anormal "Kart sai da faixa de asfalto do arco"; patamar interrompido dos critérios 03 e 06); o rótulo está no `sources:` e nas Fontes de US-0002; a matriz gerada liga `DOMAIN/DEC-14` a US-0002 (AC-US-0002-01 a 06).
- ISSUE-02 (R2, error, US-0002, AC-US-0002-01 e caso anormal de saída da faixa) — fechada: na condição de acelerador 0 o critério 01 conta a maior sequência de `understeer` consecutivo só nos passos na faixa de asfalto, até a primeira saída, com o limiar de 200 ms, citando `DOMAIN/DEC-14`; o caso anormal declara que a primeira saída fecha a janela de medição do critério 01 (o ensaio continua a reportar o passo e a posição da saída) e que na condição de acelerador cheio nada muda (a saída falha o critério 02).
- ISSUE-03 (R3, info, US-0002, AC-US-0002-03 e glossário) — mantida como ISSUE-01 abaixo: `DOMAIN/DEC-12` inalterado; 02-glossary.md inalterado (3.3.0); o critério 03 (3.4.0) continua a trazer as duas leituras.
- ISSUE-04 (R3, info, US-0003, AC-US-0003-01) — mantida como ISSUE-02 abaixo: texto e `version:` (3.0.0) inalterados.

## Issues

### ISSUE-01
- severity: info
- check: R3
- file: stories/US-0002-aderencia-em-curva.md
- location: AC-US-0002-03 (e a mesma frase na definição "Velocidade de início do subesterço" de 02-glossary.md)
- finding: (reverificada de req-validation-20261027-1659.md, ISSUE-03) o critério traz, citando `DOMAIN/DEC-12`, a regra "V1 é a velocidade mantida do patamar interrompido pela saída e o critério é avaliado com esse valor" e a frase "nunca sair de frente até sair da faixa cumpre o critério"; as duas só coincidem quando a velocidade do patamar interrompido é maior ou igual a 1,15 × V0. Observação que decide, tal como o conjunto está: a saída do ensaio reporta V1 em km/h igual à velocidade mantida do patamar interrompido e o veredito é aprovado quando V1 ≥ 1,15 × V0 (a fórmula governa). `DOMAIN/DEC-12` carrega as duas leituras; a escolha no caso em que divergem é do dono do produto.
- expected: nenhuma mudança no conjunto por esta etapa; se o dono do produto quiser que nunca sair de frente até sair da faixa aprove incondicionalmente, `DOMAIN.md` diz isso primeiro e o critério 03 passa a declarar essa regra em vez da fórmula nesse caso.

### ISSUE-02
- severity: info
- check: R3
- file: stories/US-0003-traseira-viva-e-controlavel.md
- location: AC-US-0003-01
- finding: (reverificada de req-validation-20261027-1659.md, ISSUE-04, texto inalterado) a cláusula da curva de referência com acelerador cheio é ligada à condução normal por "em particular", mas com acelerador cheio a velocidade pode passar de 50 km/h no arco e a condição de forçar passa a valer; o critério é decidível (estado de aderência em todos os passos do arco), mais estrito que o seed e coerente com `DOMAIN/DEC-13`.
- expected: a cláusula da curva de referência é separada da cláusula de condução normal e declara que vale em todos os passos do arco, inclusive acima de 50 km/h.

## Divergences

None.

## Coverage

Seed items: 27 covered (5 histórias, 6 regras de domínio, 4 NFRs, 4 restrições, 4 impactos no domínio, 4 itens fora do escopo), 0 uncovered. `DOMAIN.md`: 19 entradas, 19 cobertas (`DOMAIN/REF-01` a `REF-05`, `DOMAIN/DEC-01` a `DEC-14`). `SCOPE-BACKLOG.md`: 2 entradas de 2026-10-27 adiadas ao autor sem decisão tomada (V0 quando a linha de base nunca sai de frente; veredito para saída da faixa exatamente a 50 km/h e para varredura que termina sem saída) — nada a cobrir; o conjunto não inventa regra para nenhuma delas (AC-US-0002-06 decide só abaixo e acima de 50 km/h; AC-US-0002-03 e o glossário fixam o patamar interrompido só para V1). Lista "Fora do escopo" de `01-context.md` igual à do seed. Set items with no seed source: 0 (sorteados: US-0004 → `SEED/US-4`, `SEED/RD-05`, `SEED/NF-03`, `SEED/IM-I9`, `DOMAIN/REF-01`, `DOMAIN/REF-02`, `DOMAIN/DEC-02`, `DOMAIN/DEC-05`, `DOMAIN/DEC-06`; NFR-0003 → `SEED/NF-03`, `SEED/IM-I2`). R3 nos sorteados: AC-US-0004-01 a 07 com ponto de observação (estado da simulação, tela, saída de `npm test`/bench), unidade em cada limiar e fonte citada; nenhum vocabulário proibido em critério do conjunto ("rápida" só na citação da sensação alvo do seed, fora de critério). R5 no sorteado NFR-0003: limite com unidade (100 % dos critérios, nas duas formas de `Input`) e método de observação (saída de `npm test`); nenhum enunciado como escolha de projeto; tabela de famílias de `01-context.md` com todas as famílias de R5 e D-REQ-07 especificadas ou dispensadas em uma linha. R6 na população: canais nomeados e sensor ausente tratado (D-REQ-05); padrão seguro com motivo em uma linha (`01-context.md`, "Padrão seguro"); nenhum segredo nem dado real; nenhuma superfície autenticada; nenhum refactor pedido. R7 na população: `src/physics.ts`, `src/lap.ts`, `src/track.ts`, `STEP`, 480 Hz, `Input`, DOM citados da seção Restrições do seed; `docs/physics.md`, `npm test`, `npm run bench:handling`, `trackVersion` citados ao seed; as linhas acrescentadas de 97-changelog.md não nomeiam módulo, arquivo nem identificador. R8: nenhum `OPEN-<nn>` nem `TBD`; `98-divergences.md` sem linhas, cabeçalho bem formado. R1: nenhum bloco mermaid no conjunto.

## Gravação em SUCCESS

`status: validated` gravado em 01-context.md, 97-changelog.md e stories/US-0002-aderencia-em-curva.md (únicos em `draft`); 00-index.md e 99-traceability.md reemitidos por `lint_artifacts.py --stage req --feature dirigibilidade --emit` (derivados, conventions §13; o `status:` do índice deriva dos arquivos).

## Contexto recebido fora do procedimento

As entradas de `DOMAIN.md` e de `SCOPE-BACKLOG.md` nomeiam a rodada de código ou do D-Spec que as motivou; as linhas acrescentadas de 97-changelog.md carregam a justificativa do gerador (vistas só por grep filtrado para R7 e R8); linhas de assunto do `git log` do ambiente carregam o motivo das rodadas de código e de spec; `NOTES.md` traz a proveniência dos limiares. Nada disso entrou no julgamento. A raiz de código não foi lida.
