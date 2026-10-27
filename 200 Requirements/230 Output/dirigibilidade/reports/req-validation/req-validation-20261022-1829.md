---
stage: req
feature: dirigibilidade
verdict: SUCCESS
generated: 2026-10-22T18:29:40Z
counts: {blocker: 0, error: 0, warning: 0, info: 2, divergence: 0}
seed: {revision: 3, digest: 7dd24c8b6cab}
feedbacks: []
population: "revalidação de req-validation-20261022-1817.md: as sete issues anteriores reverificadas primeiro; arquivos com `version:` movida desde aquele relatório: 01-context.md (3.2.0 → 3.3.0), 02-glossary.md (3.2.0 → 3.3.0), 97-changelog.md (3.2.0 → 3.3.1, lido pelo diff das entradas novas), stories/US-0002-aderencia-em-curva.md (3.2.0 → 3.3.0); dois arquivos intocados sorteados (NFR-0004, NFR-0009); 98-divergences.md para R8; a entrada nova de `DOMAIN.md` (2026-10-22, \"Leitura de 'sem subesterço'\", 18.ª entrada) conferida para R4 nos dois sentidos"
---

# Relatório de validação — dirigibilidade

## Issues anteriores

- ISSUE-01 (R4, error, 01-context.md, chave e tabela de decisões aplicadas) — fechada: `DOMAIN/DEC-12`, `DOMAIN/DEC-13` e `DOMAIN/REF-05` constam da chave, da tabela de decisões aplicadas (US-0002, glossário), do `sources:` e das Fontes de US-0002; a matriz gerada liga os três a US-0002.
- ISSUE-02 (R4, error, US-0002, AC-US-0002-03) — fechada: o critério declara V1 quando nenhum patamar reporta `understeer` por mais de 200 ms até a saída da faixa acima de 50 km/h (velocidade mantida do patamar interrompido), cita `DOMAIN/DEC-12` e `DOMAIN/REF-05`; ver ISSUE-01 abaixo (info) sobre a frase final do mesmo critério.
- ISSUE-03 (R4, error, 02-glossary.md, "Velocidade de início do subesterço") — fechada: a definição traz o caso de recuo para V1, com `DOMAIN/DEC-12` e `DOMAIN/REF-05`.
- ISSUE-04 (R2, error, US-0002, AC-US-0002-02) — fechada: o critério 02 restrito à condição de acelerador cheio; a condição de acelerador 0 julgada só pelo critério 01, com `DOMAIN/DEC-13` citado nos dois.
- ISSUE-05 (R2, error, US-0002, caso anormal "Kart sai da faixa de asfalto do arco") — fechada: a saída falha o critério 02 só com acelerador cheio; com acelerador 0 o ensaio reporta passo e posição e não reprova.
- ISSUE-06 (R3, info, US-0003, AC-US-0003-01) — mantida como ISSUE-02 abaixo: texto e `version:` (3.0.0) inalterados.
- ISSUE-07 (R2, info, US-0002, AC-US-0002-01) — fechada pela entrada `DOMAIN/REF-05` de `DOMAIN.md`, que fixa a leitura de "sem `understeer`" como nenhuma sequência com mais de 200 ms consecutivos; o conjunto a cita.

## Issues

### ISSUE-01
- severity: info
- check: R3
- file: stories/US-0002-aderencia-em-curva.md
- location: AC-US-0002-03 (e a mesma frase na definição "Velocidade de início do subesterço" de 02-glossary.md)
- finding: o critério traz, lado a lado e citando `DOMAIN/DEC-12`, a regra "V1 é a velocidade mantida do patamar interrompido pela saída e o critério é avaliado com esse valor" e a frase "nunca sair de frente até sair da faixa cumpre o critério"; as duas só coincidem quando a velocidade do patamar interrompido é maior ou igual a 1,15 × V0 — se a saída da faixa acima de 50 km/h ocorrer, sem `understeer`, num patamar abaixo de 1,15 × V0, a fórmula reprova e a frase aprova. Observação que decide, tal como o conjunto está: a saída do ensaio reporta V1 em km/h igual à velocidade mantida do patamar interrompido e o veredito é aprovado quando V1 ≥ 1,15 × V0 (a fórmula governa; a frase é consequência dela só nesse caso). A escolha entre as duas leituras no caso em que divergem é decisão do dono do produto, não derivável dos insumos.
- expected: nenhuma mudança no conjunto por esta etapa; se o dono do produto quiser que nunca sair de frente até sair da faixa aprove incondicionalmente, `DOMAIN.md` diz isso primeiro e o critério 03 passa a declarar essa regra em vez da fórmula nesse caso.

### ISSUE-02
- severity: info
- check: R3
- file: stories/US-0003-traseira-viva-e-controlavel.md
- location: AC-US-0003-01
- finding: (reverificada de req-validation-20261022-1817.md, ISSUE-06, texto inalterado) a cláusula da curva de referência com acelerador cheio é ligada à condução normal por "em particular", mas com acelerador cheio a velocidade pode passar de 50 km/h no arco e a condição de forçar passa a valer; o critério é decidível (estado de aderência em todos os passos do arco), mais estrito que o seed e coerente com `DOMAIN/DEC-13`.
- expected: a cláusula da curva de referência é separada da cláusula de condução normal e declara que vale em todos os passos do arco, inclusive acima de 50 km/h.

## Divergences

None.

## Coverage

Seed items: 27 covered (5 histórias, 6 regras de domínio, 4 NFRs, 4 restrições, 4 impactos no domínio, 4 itens fora do escopo), 0 uncovered. `DOMAIN.md`: 18 entradas, 18 cobertas (`DOMAIN/REF-01` a `REF-05`, `DOMAIN/DEC-01` a `DEC-13`), 0 não cobertas. `SCOPE-BACKLOG.md` não existe na pasta do seed. Lista "Fora do escopo" de `01-context.md` igual à do seed. Set items with no seed source: 0. Famílias de NFR (R5): todas especificadas ou dispensadas em uma linha em `01-context.md`; NFR-0004 e NFR-0009 (sorteados) com limite, unidade e método de observação.

## Contexto recebido fora do procedimento

`97-changelog.md` (na população por `version:` movida) carrega a justificativa do gerador para cada edição e as suas "leituras registradas"; foi lido como artefato e nada dessa justificativa entrou no julgamento. `NOTES.md` da pasta do seed traz proveniência dos limiares; lido como material de apoio, sem efeito no julgamento. A raiz de código não foi lida.
