---
stage: req
feature: race-lap-validation
verdict: FAIL
generated: 2026-10-30T02:29:08Z
counts: {blocker: 0, error: 4, warning: 1, info: 0, divergence: 0}
seed: {revision: 3, digest: beee272fdb3b}
feedbacks: []
ignored-input: "97-changelog.md, seções 'Itens recusados, com motivo' — justificativa do gerador, desconsiderada no julgamento"
---

# Relatório de validação — race-lap-validation

## Issues

### ISSUE-01
- severity: error
- check: R3
- file: stories/US-0006-corte-e-grama.md
- location: AC-US-0006-06
- finding: o critério junta dois comportamentos — na volta oficial e na de reconhecimento a volta inválida por corte termina no passo da invalidação; no treino ela segue até a próxima chegada — e um pode passar enquanto o outro falha
- expected: AC-US-0006-06 só com o fim no passo da invalidação (volta oficial e de reconhecimento); o comportamento do treino fica em US-0010 (AC-US-0010-08/09) ou num critério próprio

### ISSUE-02
- severity: error
- check: R3
- file: stories/US-0010-voltas-seguidas-no-treino.md
- location: AC-US-0010-02
- finding: um único critério exige quatro observações independentes — tempo total exibido, quatro tempos de setor exibidos, validade ("válida" ou "inválida" com o motivo) exibida e tempos identificados em texto como não oficiais — não atômico (US-0002 separa as mesmas observações em AC-US-0002-01/02/03)
- expected: um critério por observação (tempo total; quatro tempos de setor; validade com o motivo; rótulo "não oficial"), cada um no estado da tela ao fim da volta de treino na chegada

### ISSUE-03
- severity: error
- check: R3
- file: stories/US-0010-voltas-seguidas-no-treino.md
- location: AC-US-0010-20
- finding: junta duas propriedades distintas — cada volta tem exatamente 1 resultado; cada cruzamento da chegada no sentido da pista encerra no máximo 1 volta — num só critério
- expected: dois critérios, cada um com sua observação no estado da simulação

### ISSUE-04
- severity: error
- check: R4
- file: stories/US-0010-voltas-seguidas-no-treino.md
- location: AC-US-0010-02 e Casos anormais ("Volta de treino que termina sem ter cruzado o limite de um setor", "Pista de dado incompleto")
- finding: o primeiro critério de US-10 do seed exige que o resultado de toda volta de treino mostre "tempo, quatro setores, válida ou inválida com o motivo"; o conjunto o cobre só para voltas que cruzaram os quatro limites de setor e declara indecidido o caso, novo no seed revision 3, de uma volta de treino inválida (corte ou marcador pulado) que chega sem ter cruzado um limite de setor, e o de uma pista de treino cujo dado não declara setores (DOMAIN/DEC-10) — nem o seed nem DOMAIN.md decidem o que o resultado mostra no lugar do setor não medido
- expected: decisão do dono do produto em DOMAIN.md sobre o que o resultado de uma volta de treino exibe para um setor cujo limite não foi cruzado (e numa pista sem setores), e então um critério observável para esse caso; até lá, o ponto é aberto, não silenciado

### ISSUE-05
- severity: warning
- check: R4
- file: stories/US-0010-voltas-seguidas-no-treino.md
- location: Pontos em aberto; AC-US-0010-12, -14, -16, -19; 01-context.md (rótulos DOMAIN/DEC-12/P1–P3 e parágrafo "Não resta ponto em aberto"); stories/US-0007-reposicionamento.md (Casos anormais, sources)
- finding: os critérios são apresentados como apoiados em "pressupostos do condutor, a confirmar pelo dono do produto" e passíveis de mudar se recusados, mas o seed revision 3 já os enuncia — US-10: "A melhor volta válida do treino fica visível durante todo o treino" (P2) e "O treino só para quando o Jogador pausa (...) ou encerra o treino" (P1); US-7: "Em reconhecimento e em treino, reposicionar não invalida" e DOMAIN/DEC-02 (P3) — o conjunto rotula como em aberto o que o seed fecha, e a matriz liga P1–P3 a todos os 22 critérios de US-0010 e a todos os de US-0007
- expected: os critérios citam os itens do seed que os fixam (SEED/US-10, SEED/US-7, DOMAIN/DEC-02) sem a ressalva "a confirmar"; os rótulos P1–P3 saem ou ficam restritos aos critérios que de fato realizam cada um

## Divergences

None.

## Coverage

Seed items: 46 covered (10 histórias, 11 regras de domínio, 8 NFRs, 5 restrições, 6 impactos no domínio, 6 itens fora do escopo), 0 uncovered; SEED/US-10 coberto em parte (ISSUE-04). Pontos OPEN-01 a OPEN-08 do seed fechados por DOMAIN.md (DEC-01 a DEC-08); DEC-09 a DEC-12 aplicados. Set items with no seed source: 0.
