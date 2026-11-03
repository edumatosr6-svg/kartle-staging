---
stage: dspec
feature: pista-kart-park
verdict: FAIL
generated: 2026-11-03T19:24:00Z
counts: {blocker: 0, error: 2, warning: 1, info: 2, divergence: 16}
seed: {revision: 2, digest: 49d733298158}
upstream: {stage: fspec, validation: fspec-validation-20261103-1908, status: validated}
feedbacks: []
feedbacks-pending: ["300 Specs/320 F-Specs/Output/pista-kart-park/reports/feedback/FEEDBACK-02.md (escrito pelo gerador, não aceito pelo F-Spec; ver ISSUE-04)"]
previous: "dspec-validation-20261030-1327.md (SUCCESS, 0/0/1/2); ISSUE-01, ISSUE-02 e ISSUE-03 reverificados e mantidos abaixo"
population: "revalidação (§8) para a seed revisão 2: as três issues do relatório anterior; os arquivos com version movida (00-index.md, 01-architecture.md 1.2.0, 97-changelog.md 1.4.0, 98-divergences.md 1.2.0, 99-traceability.md, core/DES-0006 1.2.0, pipeline/DES-0011 1.1.0, test-strategy.md 1.2.0, web/DES-0008 2.0.0); dois arquivos intocados sorteados (semente 20261103-1924): data/DM-0001, core/DES-0003"
isolation: "a invocação trouxe só a feature, os caminhos e o pedido de recalcular números; nenhuma justificativa do gerador. O raciocínio do gerador presente em DES-0008 2.0.0 ('Face de colisão') e em FEEDBACK-02.md foi lido só como a leitura declarada pelo projeto e julgado contra RULE-0006, FEAT-0008 e o arquivo publicado"
recomputed: "luminância WCAG 2 de #68865b, #6e8f60, #627d56 (0,2075, 0,2380, 0,1794; distâncias 0,147 e 0,136: conferem); bordas do arquivo publicado (684 segmentos, maior virada 21,1°, fator 1,017, menor segmento 0,167 m, largura no ponto 0 5,03 m: conferem); barreira (53,287 m, n 297, 298 pilhas, 1.490 pneus, 39.336 triângulos: conferem; distância ao asfalto 0,510 m e à zebra 5,04 m: conferem); envoltória dos pneus contra a face de colisão: não confere (ISSUE-05); SHA-256 de src/tracks/kart-park-v1.json igual ao de tracks/registry.json: confere"
status-stamp: "nenhum: veredito FAIL"
---

# Relatório de validação D-Spec — pista-kart-park

## Summary

- verdict: FAIL
- blocker: 0
- error: 2 (ISSUE-04, ISSUE-05)
- warning: 1 (ISSUE-03)
- info: 2 (ISSUE-01, ISSUE-02)
- divergence: 16, todas `open`, em `98-divergences.md` 1.2.0

## Issues

### ISSUE-01

- severity: info
- check: D3 — contrato API-0001 campo a campo (reverificação de ISSUE-01 de dspec-validation-20261030-1327.md)
- file: adr/ADR-0006-lacunas-do-f-spec-resolvidas-no-projeto.md; data/DM-0002-registro-de-publicacao-e-estado-em-memoria.md; pipeline/DES-0010-preparo-offline-do-arquivo-da-kart-park.md
- location: ADR-0006 1.2.0, linha "Suavização"; DM-0002 1.2.0, tabela `prep`, `lapLengthM`; DES-0010 1.1.0, passo 2
- finding: sem mudança; o texto continua a sugerir uma chave `lapLengthM` no arquivo publicado, que não é campo de API-0001 nem de DM-0001.
- expected: "o comprimento derivado da `centerline` gravada". Não condiciona o veredito.

### ISSUE-02

- severity: info
- check: D5 — I3 (reverificação de ISSUE-02 de dspec-validation-20261030-1327.md)
- file: 01-architecture.md; test-strategy.md
- location: 01-architecture.md 1.2.0, "Consequências para outras features", primeiro item (linhas 239-241); test-strategy.md 1.2.0, "Testes de outras features" (linhas 196-199)
- finding: os dois trechos não mudaram nesta rodada e ainda descrevem `tests/race-lap-validation-track-data.test.ts:20` afirmando o literal 2, mudança já aplicada (`src/trackData.ts:11` declara `TRACK_SCHEMA_VERSION = 3`).
- expected: registrar que a mudança já foi aplicada por `race-lap-validation`. Não condiciona o veredito.

### ISSUE-03

- severity: warning
- check: D9 — linha de divergência com o que existe hoje em `arquivo:linha`
- file: 98-divergences.md
- location: linhas 20, 21, 30, 31, 32 e o parágrafo final ("REQ-FEAT-0007-12: nenhum código desta feature existe")
- finding: sem mudança nas linhas anteriores; a linha nova (35) cita a árvore corrente (`src/trackScene.ts:121-126`, `:39-75`, `:77-95`, `:10`, `src/main.ts:53`, conferidos), enquanto as linhas presas a `ac84352` continuam a afirmar como "hoje" o que a árvore já não tem (`src/trackData.ts:5` versão 2, sem `src/tracks/`, sem `tests/pista-kart-park-*.test.ts`). O mesmo arquivo mistura duas bases.
- expected: uma base única para a coluna "O que o sistema faz hoje", aplicada às linhas anteriores, ao cabeçalho e ao parágrafo final.

### ISSUE-04

- severity: error
- check: D3 — todo `REQ-*` realizado por um item de projeto (REQ-FEAT-0008-14, AC-US-0007-11)
- file: web/DES-0008-desenho-da-kart-park-na-tela-de-corrida.md; test-strategy.md
- location: DES-0008 2.0.0, "Medidas do acabamento contra RULE-0006", linha REQ-FEAT-0008-14, e seção "Face de colisão (REQ-FEAT-0008-14)"; test-strategy.md 1.2.0, linha AC-US-0007-11
- finding: RULE-0006 1.0.0 ("Geometria desenhada", linha "Face dos pneus") define a face de colisão como a poligonal da barreira e fixa que a fileira desenhada ocupa no máximo 0,05 m de cada lado dela; o critério de aceite de FEAT-0008 mede "a no máximo 0,05 m da poligonal da barreira de cada lado". DES-0008 mede contra a superfície de contato a `BARRIER_HALF_WIDTH_M` = 0,1 m (ADR-0003) e desenha a face entre 0,073 m e 0,12 m da poligonal; o teste de AC-US-0007-11 afirma "no máximo 0,05 m de `BARRIER_HALF_WIDTH_M`", não o que o F-Spec pede. A leitura foi enviada ao F-Spec em FEEDBACK-02.md, que o F-Spec validado não aceitou. Com a superfície de contato a 0,1 m, que NFR-0013 congela, RULE-0006 só se cumpre com a face a exatamente 0,05 m em todo ponto (≤ 0,05 m da poligonal e o kart parado a ≤ 0,05 m dos pneus), o que pilhas redondas não dão.
- expected: o dono do F-Spec decide FEEDBACK-02 (reescrever RULE-0006 e o critério de FEAT-0008 com "a superfície de contato da barreira", sem mudar `REQ-*`, ou fixar outra medida); depois, o projeto e o teste de AC-US-0007-11 seguem o texto decidido.

### ISSUE-05

- severity: error
- check: D3 — todo `REQ-*` realizado pelo mecanismo nomeado (REQ-FEAT-0008-14, AC-US-0007-11), também na leitura do próprio projeto
- file: web/DES-0008-desenho-da-kart-park-na-tela-de-corrida.md; test-strategy.md
- location: DES-0008 2.0.0, tabela "Conteúdo do grupo", linha `barriers` (pilhas a cada `k · L / n` de comprimento); "Face de colisão", frases "a pelo menos ... 0,073 m" e "Nas curvas da poligonal a corda entre dois centros é no máximo o arco, de modo que o limite se mantém"; linhas REQ-FEAT-0008-14 de "Medidas" e AC-US-0007-11 de test-strategy.md
- finding: a barreira publicada (`src/tracks/kart-park-v1.json`) tem 381 segmentos (mediana 0,12 m, mínimo 0,005 m) com viradas internas de até 177,6°, e um trecho em dente de serra de cerca de 21,5 m a 44 m do seu comprimento com viradas de 150° a 161°. Com 298 pilhas espaçadas por comprimento ao longo dela, recalculado: na fronteira da superfície de contato (pontos a 0,1 m da poligonal), o pneu mais próximo, com o raio externo de 0,12 m, fica a até 0,068 m (perto de 29,69 m do comprimento), e 194 de 26.449 pontos amostrados passam de 0,05 m; o limite de 0,073 m a 0,12 m não vale nas curvas. O teste de AC-US-0007-11 como descrito (normal local a cada 0,02 m) acha 1.933 de 5.718 amostras fora de [0,05 m, 0,15 m] nesse arquivo, onde a normal de um segmento corre ao longo dos braços vizinhos do dente de serra.
- expected: uma disposição que cubra os vértices (por exemplo, uma pilha centrada em cada vértice da poligonal além do espaçamento máximo) e uma medida de teste sem ambiguidade nas curvas (distância entre a fronteira da superfície de contato e a envoltória dos pneus, nos dois sentidos), com os números recalculados sobre o arquivo publicado, seguindo o texto que ISSUE-04 fixar.

## Divergences

### REQ-FEAT-0002-02, -16; API-0001
- estado: open
- hoje: `src/trackData.ts:5`, `:89` (base `ac84352`; ver ISSUE-03)
- fecha: DES-0001, DM-0001, ADR-0001

### REQ-FEAT-0002-01, -03 a -11, -14, -17, -18; REQ-FEAT-0003-01 a -07; REQ-FEAT-0004-01 a -03; REQ-FEAT-0005-01 a -03; REQ-FEAT-0006-09
- estado: open
- hoje: `package.json:6-13` (base `ac84352`; ver ISSUE-03)
- fecha: DES-0010, DES-0011, DM-0001, DM-0002, ADR-0002, ADR-0006

### REQ-FEAT-0001-01 a -12, -14; API-0002
- estado: open
- hoje: `index.html:19`; `src/main.ts:152`, `:155`, `:208-218`
- fecha: DES-0005, DES-0007

### REQ-FEAT-0002-12, REQ-FEAT-0005-05, -08, -09; API-0003
- estado: open
- hoje: `src/physics.ts`
- fecha: DES-0002, DES-0003, ADR-0004

### REQ-FEAT-0004-04 a -07
- estado: open
- hoje: `src/physics.ts:276-290`
- fecha: DES-0003, ADR-0003

### REQ-FEAT-0003-10, -11, REQ-FEAT-0005-06, -07
- estado: open
- hoje: `src/lap.ts:218-220`, `:245-252`
- fecha: DES-0004, DES-0002

### REQ-FEAT-0002-12 (reposicionamento), REQ-FEAT-0001-08
- estado: open
- hoje: `src/lap.ts:154-161`, `:109-112`
- fecha: DES-0004

### REQ-FEAT-0003-08, -12, -13, -14, -15
- estado: open
- hoje: `src/lap.ts:223-252`
- fecha: DES-0004, DES-0005, DES-0010

### REQ-FEAT-0002-13, REQ-FEAT-0004-08, REQ-FEAT-0005-04; REQ-FEAT-0007-01, -02
- estado: open
- hoje: `src/main.ts:44-110`, `:289-297`
- fecha: DES-0008

### REQ-FEAT-0005-10 a -19
- estado: open
- hoje: `src/audio.ts:1-43`
- fecha: DES-0009

### REQ-FEAT-0006-01 a -08, -10 a -13
- estado: open
- hoje: `index.html:17`, `:19`, `:25` (base `ac84352`; ver ISSUE-03)
- fecha: DES-0005, DES-0007, DES-0012

### REQ-FEAT-0007-03, -04, -06, -07
- estado: open
- hoje: `tests/race-lap-validation-layering.test.ts:9-10` (base `ac84352`; ver ISSUE-03)
- fecha: DES-0006, test-strategy.md

### REQ-FEAT-0007-13, REQ-FEAT-0006-14
- estado: open
- hoje: `package.json:6-13`; `index.html:19`, `:25` (base `ac84352`; ver ISSUE-03)
- fecha: DES-0011, DES-0012, ADR-0005

### REQ-FEAT-0006-04, -05, -06; REQ-FEAT-0003-14 (rodada de 2026-10-30)
- estado: open
- hoje: `index.html:25`; `src/main.ts:465`, `:592`
- fecha: DES-0007, ADR-0007

### REQ-FEAT-0003-08, -10, -12, -13, -15; REQ-FEAT-0001-05 (rodada de 2026-10-30)
- estado: open
- hoje: `tests/pista-kart-park-lap.test.ts:47`; `tests/helpers/kartParkPilot.ts:114`
- fecha: DES-0004, DES-0005, test-strategy.md

### REQ-FEAT-0008-01, -02, -06, -07, -12 a -18, -22 (rodada de 2026-11-03)
- estado: open
- hoje: `src/trackScene.ts:121-126`, `:39-75`, `:77-95`, `:10`; `src/main.ts:53` (conferidos na árvore)
- fecha: DES-0008 (REQ-FEAT-0008-14 não fechado: ISSUE-04, ISSUE-05)

## Coverage

- requisitos cobertos: 129 de 130 (REQ-FEAT-0001-01 a REQ-FEAT-0007-13 e REQ-FEAT-0008-01 a -29, pelos `sources` de DES-0006, DES-0008 e DES-0011 para os novos)
- requisitos sem cobertura: REQ-FEAT-0008-14 (nomeado em DES-0008, mas não realizado: ISSUE-04, ISSUE-05)
- itens de projeto sem fonte: nenhum
- critérios sem caminho de teste alcançável: nenhum; o caminho de AC-US-0007-11 existe, mas afirma outra medida (ISSUE-04) e reprova no arquivo publicado (ISSUE-05)
- D9: nenhum `OPEN-<nn>` nem `TBD` no conjunto; D6: nenhum segredo, credencial ou token
