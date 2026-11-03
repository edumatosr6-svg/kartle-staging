---
stage: req
feature: pista-kart-park
verdict: FAIL
generated: 2026-11-03T18:57:20Z
counts: {blocker: 0, error: 4, warning: 2, info: 6, divergence: 0}
seed: {revision: 2, digest: 49d733298158}
upstream: {stage: seed, version: n/a}
feedbacks: []
population: os 6 issues de req-validation-20261022-1428.md; os arquivos com versão movida (01-context.md, 02-glossary.md, 97-changelog.md, NFR-0002, NFR-0012, NFR-0013, NFR-0014, US-0007); amostra de 2 arquivos intocados, sorteada (US-0002, US-0003); US-0005 lido só porque AC-US-0007-08 o referencia.
isolation: 97-changelog.md traz o raciocínio do gerador ("Itens recusados ou lidos, com motivo"); foi lido como artefato e não pesou em nenhum julgamento.
---

# Validação de requisitos — pista-kart-park

## Issues

### ISSUE-01
- severity: warning
- check: R4
- file: nfr/NFR-0011-codigo-depois-de-dirigibilidade.md
- location: tabela, coluna Fonte
- finding: Continua do relatório 20261022-1428 (ISSUE-01), sem mudança. A Fonte ainda diz "por decisão do autor para esta execução (2026-10-22), a dependência é registrada no D-Spec". Isso não tem fonte em `SEED.md`, em `DOMAIN.md` nem em `210 Docs/`.
- expected: A Fonte cita só `SEED/RE-02`. Se o autor quiser a regra, ela entra antes em `DOMAIN.md` e o conjunto a cita como `DOMAIN/DEC-nn`.

### ISSUE-02
- severity: warning
- check: R4
- file: 01-context.md
- location: ## Restrições (citadas do seed, seção Restrições), segundo item
- finding: Continua do relatório 20261022-1428 (ISSUE-02), sem mudança. A frase "Por decisão do autor para esta execução (2026-10-22), essa dependência deve ser registrada no D-Spec" ainda não tem fonte em `SEED.md` nem em `DOMAIN.md`.
- expected: O item cita só a restrição do seed, ou a regra entra antes em `DOMAIN.md` e o conjunto a cita como `DOMAIN/DEC-nn`.

### ISSUE-03
- severity: info
- check: R3
- file: stories/US-0003-setores-e-validacao-da-volta.md
- location: AC-US-0003-07, AC-US-0003-08
- finding: Continua do relatório 20261022-1428 (ISSUE-03). "Borda da pista" ainda falta no glossário 1.1.0. Leitura que decide o critério: o limite de fora do asfalto mais a zebra.
- expected: O glossário define "Borda da pista" como o limite de fora do asfalto mais a zebra (`SEED/US-5`), e os critérios de corte usam esse termo.

### ISSUE-04
- severity: info
- check: R3
- file: stories/US-0004-barreira-nos-trechos-quase-encostados.md
- location: AC-US-0004-05
- finding: Continua do relatório 20261022-1428 (ISSUE-04), sem mudança. O critério não diz o referencial nem o instante da comparação. Leitura que decide o critério: o mesmo número de passos de `STEP` desde o contato, no referencial local do obstáculo.
- expected: O critério diz o referencial e o instante da comparação.

### ISSUE-05
- severity: info
- check: R3
- file: stories/US-0005-zebra-com-efeito.md
- location: AC-US-0005-02
- finding: Continua do relatório 20261022-1428 (ISSUE-05), sem mudança. O critério não diz em qual linha central se mede o trecho de volta. Leitura que decide o critério: medir na linha central original, como em AC-US-0003-02.
- expected: O critério diz "distância de volta medida na linha central original", com a exceção da zebra dividida na largada.

### ISSUE-06
- severity: info
- check: R3
- file: stories/US-0002-forma-da-pista-real.md
- location: AC-US-0002-05
- finding: Continua do relatório 20261022-1428 (ISSUE-06), sem mudança. "Ponto correspondente do arquivo de origem" não está definido. Leitura que decide o critério: o ponto de mesmo índice.
- expected: O critério diz qual é o ponto correspondente: o de mesmo índice, ou o ponto da origem mais próximo.

### ISSUE-07
- severity: error
- check: R3
- file: stories/US-0007-acabamento-visual.md
- location: AC-US-0007-04
- finding: O critério junta dois comportamentos: "não está em saída de pista" (estado instantâneo) e "não tem a volta invalidada por corte" (invalidação depois de 1000 ms). O próprio conjunto os separa para a zebra em AC-US-0005-04 e AC-US-0005-05.
- expected: Dois critérios: um para a saída de pista com rodas na faixa de borda, e um para o corte com rodas na faixa de borda por mais de 1000 ms.

### ISSUE-08
- severity: error
- check: R3
- file: stories/US-0007-acabamento-visual.md
- location: AC-US-0007-08
- finding: "A aderência, a vibração e o som da zebra satisfazem os critérios 06 a 12 de US-0005" junta três comportamentos, e sete critérios, em um só critério.
- expected: Um critério por comportamento com o relevo desenhado: a aderência (AC-US-0005-06), a vibração em `web-mobile` (AC-US-0005-07 e 08) e o som em `web-desktop` (AC-US-0005-09 a 12). Cada um pode citar o critério de US-0005 que mantém.

### ISSUE-09
- severity: error
- check: R3
- file: stories/US-0007-acabamento-visual.md
- location: AC-US-0007-13
- finding: O critério junta dois comportamentos: a grama mostrar ao menos 2 tons de verde, e a luminância de cada tom ficar dentro da faixa. Cada um pode falhar sozinho.
- expected: Dois critérios: um para "ao menos 2 tons de verde" e um para a faixa de luminância de cada tom.

### ISSUE-10
- severity: error
- check: R3
- file: stories/US-0007-acabamento-visual.md
- location: AC-US-0007-15
- finding: "Tem a aderência da grama e o estado de superfície da grama" junta dois comportamentos que se observam em separado: a aderência de cada pneu, e o estado de superfície que comanda a saída de pista e o corte.
- expected: Dois critérios: um para a aderência sobre qualquer tom, e um para o estado de superfície sobre qualquer tom. Os dois valem igual para todos os tons.

### ISSUE-11
- severity: info
- check: R3
- file: stories/US-0007-acabamento-visual.md
- location: AC-US-0007-13
- finding: O seed diz "difere ... entre 8 % e 20 % em luminância" e não diz qual luminância nem se a diferença é relativa ou em pontos. O critério escolhe a luminância relativa da WCAG 2 e a diferença como fração de `#68865b` (≈ 0,207, ou seja 0,166–0,191 ou 0,224–0,249). Ler em pontos absolutos, ou em L* da CIELAB, dá outros tons. O critério pode ser decidido como está escrito, mas o seed não resolve qual leitura vale.
- expected: O autor fixa em `DOMAIN.md` qual medida de luminância vale e como se lê a porcentagem; o critério cita essa decisão.

### ISSUE-12
- severity: info
- check: R3
- file: stories/US-0007-acabamento-visual.md
- location: AC-US-0007-14
- finding: "A cor da grama em cada posição do chão ... em aparelhos diferentes", observada "Na tela", depende da tela e da renderização de cada aparelho. Leitura que decide o critério: o tom atribuído a cada posição do chão, em metros do mundo do jogo, na cena desenhada é o mesmo em duas aberturas, em qualquer aparelho.
- expected: O critério se observa na cena desenhada (o tom por posição do chão), não no valor de pixel da tela.

## Divergences

Nenhuma.

## Coverage

- Itens do seed: 63 cobertos, 0 descobertos. São SEED/US-1 a US-7, MED, RD-01 a RD-13, NF-01 a NF-06, RE-01 a RE-06, IM-I1, IM-I2, IM-I3I5, IM-I6, IM-I8, IM-I10, RI-01 a RI-04, FE-01 a FE-08 e DOMAIN/DEC-01 a DEC-12. FE-01 a FE-05 e FE-08 são cobertos só pela lista Fora do escopo de `01-context.md`, que bate com a do seed.
- Itens do conjunto sem fonte no seed: 0 histórias, 0 critérios, 0 NFRs. Uma afirmação em prosa sem fonte aparece em dois arquivos (ISSUE-01, ISSUE-02).
