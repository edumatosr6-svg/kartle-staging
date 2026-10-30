---
stage: req
feature: dirigibilidade
verdict: FAIL
generated: 2026-10-30T02:41:13Z
counts: {blocker: 0, error: 3, warning: 0, info: 2, divergence: 0}
seed: {revision: 5, digest: 48feb6d51bf8}
feedbacks: []
population: "validação completa (primeira validação desde req-validation-20261027-1705.md, seed revision 3 → 5): as 18 entradas do índice; SEED.md, DOMAIN.md (21 entradas), SCOPE-BACKLOG.md (2 entradas) e domain-directives.md para R4 e R6; 97-changelog.md só nas rodadas 12 e 13, para R7 e R8. As duas infos do relatório anterior (AC-US-0002-03, AC-US-0003-01 antigo) ficam sem objeto: o critério 03 de US-0002 foi retirado pela revisão 4 e o critério 01 de US-0003 foi reescrito."
---

# Relatório de validação — dirigibilidade

## Issues

### ISSUE-01
- severity: error
- check: R3
- file: stories/US-0003-traseira-viva-e-controlavel.md
- location: AC-US-0003-09
- finding: o critério junta dois comportamentos em dois pontos de observação distintos da lista do projeto: o que a tela mostra (HUD durante a volta e tela de resultado) e o conteúdo do texto compartilhado.
- expected: dois critérios, um para a tela (HUD e resultado) e outro para o texto compartilhado, cada um com o seu ponto de observação; o número 09 continua com a parte da tela e a parte do texto compartilhado recebe número novo.

### ISSUE-02
- severity: error
- check: R4
- file: stories/US-0003-traseira-viva-e-controlavel.md
- location: AC-US-0003-09, cláusula do texto compartilhado
- finding: a restrição do seed (`SEED/RE-01`, revisão 5) tira do texto compartilhado "o que mostrava os dois" (drift e turbo), e US-3 exclui carga, impulso, combo e pontuação de drift; o critério só proíbe "pontuação de drift" no texto compartilhado, então um texto com turbo, impulso, carga ou combo passa o critério e descumpre o seed.
- expected: o critério do texto compartilhado proíbe a mesma lista que o da tela: indicador de carga de drift, de turbo ou de impulso, combo e pontuação de drift.

### ISSUE-03
- severity: error
- check: R4
- file: nfr/NFR-0004-documentacao-dos-ensaios.md
- location: coluna "Como é observado"
- finding: o método manda registrar em `docs/physics.md` "os limites em vigor na revisão 4 do seed", que incluem o raio de no máximo 3 m aos 3 s sem acelerador retirado pela revisão 5 (`DOMAIN/DEC-16`), enquanto a coluna do limite da mesma NFR e AC-US-0002-09 pedem o giro de pelo menos 180° em até 2 s.
- expected: o método cita os limites em vigor na revisão 5 do seed (acerto C, `DOMAIN/DEC-15`, e giro sem acelerador, `DOMAIN/DEC-16`), coerentes com a coluna do limite.

### ISSUE-04
- severity: info
- check: R3
- file: stories/US-0002-aderencia-em-curva.md
- location: Casos anormais, "`understeer` reportado durante o ensaio" (relativo a AC-US-0002-09)
- finding: o caso diz que "os critérios 07 a 09 julgam o raio", mas o critério 09 julga o giro; o critério 09 continua decidível (o giro acumulado chega a 180° até 2 s de tempo simulado no estado da simulação, cada lado).
- expected: o caso diz que os critérios 07 e 08 julgam o raio e o critério 09 julga o giro, e que nenhum dos três é reprovado por um passo com `understeer`.

### ISSUE-05
- severity: info
- check: R4
- file: stories/US-0001-resposta-do-volante.md
- location: Pré-condições, "Ambiente de ensaio" (e o termo "Pista de teste" de 02-glossary.md)
- finding: a reta da pista de teste com "faixa de asfalto da largura da pista, sem paredes" não vem do seed nem de `DOMAIN.md` (`DOMAIN/REF-03` dá a faixa de `WIDTH` ao arco de 18 m retirado e só diz "reta" para a resposta do volante); com esterço cheio mantido a 50 km/h o acerto C descreve um círculo de raio da ordem de 12 m, e a história não diz o que vale quando o kart sai dessa faixa antes da janela do regime ou durante a queda do critério 02.
- expected: o ambiente da reta segue só o que o seed e `DOMAIN/REF-03` dizem (reta, velocidade mantida em 50 km/h), ou a história declara a superfície fora da faixa e o que acontece com a medição quando o kart sai dela.

## Divergences

None.

## Coverage

Seed items: 27 mapeados (5 histórias, 6 regras de domínio, 4 NFRs, 4 restrições, 4 impactos no domínio, 4 itens fora do escopo), 0 sem mapeamento; `SEED/RE-01` coberto em parte no texto compartilhado (ISSUE-02). `DOMAIN.md`: 21 entradas; 12 aplicadas (`DOMAIN/REF-01` a `REF-03`, `DEC-01`, `DEC-04`, `DEC-05`, `DEC-07` a `DEC-10`, `DEC-15`, `DEC-16`) e 9 declaradas substituídas por `DOMAIN/DEC-15` em `01-context.md` (`DEC-02`, `DEC-03`, `DEC-06`, `DEC-11` a `DEC-14`, `REF-04`, `REF-05`). `SCOPE-BACKLOG.md`: 2 entradas de 2026-10-27 sobre o ensaio de início do subesterço, sem objeto desde a revisão 4; nada a cobrir. Lista "Fora do escopo" de `01-context.md` igual à do seed. Set items with no seed source: 0.

## Contexto recebido fora do procedimento

As rodadas 12 e 13 de `97-changelog.md` carregam a justificativa do gerador; `NOTES.md` da pasta do seed (proveniência, fora da lista de leitura) foi lido; as entradas de `DOMAIN.md` e as mensagens de commit do ambiente nomeiam o motivo das revisões. Nada disso entrou no julgamento. A raiz de código não foi lida.
