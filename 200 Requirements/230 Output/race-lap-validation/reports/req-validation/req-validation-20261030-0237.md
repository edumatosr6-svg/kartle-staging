---
stage: req
feature: race-lap-validation
verdict: FAIL
generated: 2026-10-30T02:37:41Z
counts: {blocker: 0, error: 3, warning: 0, info: 0, divergence: 0}
seed: {revision: 3, digest: beee272fdb3b}
feedbacks: []
population: "issues de req-validation-20261030-0229.md; arquivos com version movida (01-context.md, 02-glossary.md, 97-changelog.md, US-0006, US-0007, US-0008, US-0010); amostra aleatória de não tocados: nfr/NFR-0002-independencia-de-quadros.md, 98-divergences.md"
ignored-input: "97-changelog.md, rodada 7, 'Itens recusados, com motivo' (inclui 'O coordenador a declarou a decisão que fecha ISSUE-04') — justificativa do gerador, desconsiderada no julgamento"
---

# Relatório de validação — race-lap-validation

## Issues

### ISSUE-01
- severity: error
- check: R6 (D-REQ-01)
- file: stories/US-0010-voltas-seguidas-no-treino.md
- location: AC-US-0010-02, AC-US-0010-23, AC-US-0010-27; também stories/US-0008-reconhecimento-e-treino.md (Casos anormais, "Pista de dado incompleto…") e 01-context.md (linha `DOMAIN/DEC-13`; parágrafo "Não resta ponto em aberto neste conjunto")
- finding: a regra de cronometragem do resultado da volta de treino (tempo total sempre que a volta terminou na chegada, setor não cruzado como "—", pista sem setores só com tempo total e validade) cita só `DOMAIN/DEC-13`, e `DOMAIN.md` registra essa entrada de 2026-10-30 como "condutor, a confirmar pelo dono do produto". Não é uma decisão do dono do produto, nem um RF/RNF ou um Dnn fechado, e o seed revision 3 não decide o ponto. O próprio 01-context.md repete a ressalva e, mesmo assim, declara que não resta ponto em aberto. O ISSUE-04 do relatório anterior pedia uma decisão do dono do produto, e ela ainda não existe.
- expected: o dono do produto confirma a entrada de 2026-10-30 em `DOMAIN.md`, e os critérios ficam como estão, citando a decisão confirmada. Até essa confirmação, o ponto fica como `OPEN-<nn>` endereçado ao dono do produto, sem afirmar que nada resta em aberto

### ISSUE-02
- severity: error
- check: R3
- file: stories/US-0010-voltas-seguidas-no-treino.md
- location: AC-US-0010-27
- finding: o critério junta três observações independentes num só, e uma pode passar enquanto outra falha: o resultado não contém tempo nem linha de setores, o tempo total é exibido e a validade é exibida. É o mesmo padrão que motivou a divisão de AC-US-0010-02 no relatório anterior
- expected: AC-US-0010-27 fica só com a ausência de tempo e de linha de setores numa pista sem setores declarados. A exibição do tempo total e a da validade nessa pista ficam com AC-US-0010-02 e AC-US-0010-24, estendendo a pré-condição deles a essa pista, ou com um critério próprio para cada uma

### ISSUE-03
- severity: error
- check: R2
- file: stories/US-0007-reposicionamento.md
- location: AC-US-0007-04, AC-US-0007-05 (contra AC-US-0010-19)
- finding: no treino, a volta inválida por corte segue em andamento até a chegada (US-0010, critérios 07 a 09), e a pré-condição de US-0007 ("a volta está em andamento") não exclui essa volta. Se o Jogador reposiciona nela, AC-US-0007-04 exige que a tela exiba "válida em andamento" e AC-US-0007-05 exige que nenhum motivo apareça, enquanto AC-US-0010-19 exige o mesmo estado de antes do reposicionamento ("inválida", motivo "corte"). As duas histórias dão vereditos opostos para a mesma observação
- expected: AC-US-0007-04 e AC-US-0007-05 valem para volta sem motivo de invalidação, por pré-condição ou no texto do critério. Outra saída é exigir o mesmo estado e nenhum motivo novo ("reposicionamento"), como em AC-US-0010-19

## Divergences

None.

## Coverage

Seed items: 46 cobertos (10 histórias, 11 regras de domínio, 8 NFRs, 5 restrições, 6 impactos no domínio, 6 itens fora do escopo), 0 descobertos. SEED/US-10 está coberto por inteiro, mas a parte do resultado da volta de treino com setor não cruzado ou em pista sem setores se apoia numa entrada de `DOMAIN.md` que ainda não foi confirmada (ISSUE-01). Set items with no seed source: 0.
