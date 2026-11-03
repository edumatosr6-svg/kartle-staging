---
stage: dspec
feature: pista-kart-park
verdict: SUCCESS
generated: 2026-11-03T19:46:00Z
counts: {blocker: 0, error: 0, warning: 1, info: 2, divergence: 16}
seed: {revision: 2, digest: 49d733298158}
upstream: {stage: fspec, validation: fspec-validation-20261103-1937, commit: 73feae8, status: validated}
feedbacks: []
previous: "dspec-validation-20261103-1924.md (FAIL, 0/2/1/2); ISSUE-01 fechado (ADR-0006 1.2.1, DM-0002 1.2.1, DES-0010 1.1.1); ISSUE-02 fechado nos dois trechos nomeados (01-architecture.md 1.2.1, test-strategy.md 1.3.0; conferido contra src/trackData.ts:11 e tests/race-lap-validation-track-data.test.ts:18-40, commit 32d0adf), resto no arquivo sorteado ADR-0001 (abaixo); ISSUE-03 mantido; ISSUE-04 fechado (RULE-0006 1.1.0 'Face dos pneus' e FEAT-0008 1.1.0 definem a face de colisão como a superfície em que o kart para e deixam a distância ao projeto; DES-0008 2.1.0 e AC-US-0007-11 de test-strategy.md 1.3.0 medem contra ela); ISSUE-05 fechado (recalculado abaixo)"
population: "revalidação (§8): as cinco issues do relatório anterior; os arquivos com version movida (00-index.md, 01-architecture.md 1.2.1, 97-changelog.md 1.5.0, 99-traceability.md, adr/ADR-0006 1.2.1, data/DM-0002 1.2.1, pipeline/DES-0010 1.1.1, test-strategy.md 1.3.0, web/DES-0008 2.1.0); dois arquivos intocados sorteados (semente 202611031946): adr/ADR-0001, core/DES-0003"
isolation: "a invocação trouxe a feature, os caminhos e o pedido de recalcular números e de conferir o custo de desenho; nenhuma justificativa do gerador. Os motivos escritos em 97-changelog.md 1.5.0 e em DES-0008 2.1.0 ('Por que o raio...') foram lidos só como texto do conjunto e não usados como evidência"
recomputed: "luminância WCAG 2: #68865b 0,2075, #6e8f60 0,2380, #627d56 0,1794; distâncias relativas 0,147 e 0,136, dentro de [0,08, 0,20] (confere). Barreira de src/tracks/kart-park-v1.json: 53,287 m, 382 vértices, 381 segmentos (menor 0,005 m); disposição de DES-0008 2.1.0 (pilha em cada vértice e ceil(l/0,12) por segmento) dá 646 pilhas, 3.230 pneus, 646 × 132 = 85.272 triângulos (confere). Face contra fronteira de contato (buffer de 0,1 m da poligonal, polígonos de 12 lados de raio 0,1 m, vértices em múltiplos de 30°), amostras a 0,001 m: contato→face no máximo 0,0194 m, face→contato (|D − 0,1|) no máximo 0,0227 m, D entre 0,0773 m e 0,1000 m, união sem furos, 1 de 81.553 pontos de contato 'dentro' a 4,9e-8 m (arredondamento do buffer); a 0,005 m: 0,0194 m e 0,0224 m (confere com 0,019/0,023 e com 0,020/0,022 do teste, ≤ 0,05 m). Recorte entre pilhas em segmento reto 0,0243 m (confere). Custo de desenho: a barreira é 1 chamada instanciada de 85.272 triângulos (~9,4 × 10^4 vértices) e, por projetar sombra (src/main.ts:37-46, mapa 2048², PCFSoft), outra igual no passo de sombra: ~1,7 × 10^5 triângulos por quadro, ~5,1 × 10^6 por segundo a 30 fps, mais grama 800, faixas de borda 2.736 e asfalto 1.368; uma ordem de grandeza abaixo da vazão de vértices de uma GPU de celular intermediário e com a cena sintética (300 caixas, 90 árvores) oculta; o mecanismo e a métrica de NFR-0002 / REQ-FEAT-0007-01, -02 estão nomeados (DES-0008, 'Desempenho'; registro em docs/kart-park-device-log.md), sem achado por D3 ou D7"
status-stamp: "status: validated nos campos de front matter de 00-index.md, 01-architecture.md, 97-changelog.md, 98-divergences.md, core/DES-0006, pipeline/DES-0011, test-strategy.md, web/DES-0008 (os demais já validated; 99-traceability.md não tem campo status). A coluna Status de 00-index.md é do gate (lint_artifacts.py --emit)"
---

# Relatório de validação D-Spec — pista-kart-park

## Summary

- verdict: SUCCESS
- blocker: 0
- error: 0
- warning: 1 (ISSUE-03)
- info: 2 (ISSUE-02, ISSUE-06)
- divergence: 16, todas `open`, em `98-divergences.md` 1.2.0

## Issues

### ISSUE-02

- severity: info
- check: D5 — I3 (reverificação de ISSUE-02 de dspec-validation-20261103-1924.md, no arquivo sorteado)
- file: adr/ADR-0001-esquema-3-do-arquivo-de-pista.md
- location: ADR-0001 1.0.0, "Consequências", segundo item (linhas 50-53)
- finding: os dois trechos nomeados antes foram corrigidos; ADR-0001 ainda afirma que `tests/race-lap-validation-track-data.test.ts:20-21` e `:24-30` "passam a reprovar" e que a mudança é da etapa de testes daquela feature, mudança já aplicada (commit `32d0adf`; o teste segue `TRACK_SCHEMA_VERSION` em `:18-40`).
- expected: registrar que a mudança já foi aplicada por `race-lap-validation`, como em 01-architecture.md 1.2.1. Não condiciona o veredito.

### ISSUE-03

- severity: warning
- check: D9 — linha de divergência com o que existe hoje em `arquivo:linha`
- file: 98-divergences.md
- location: linhas 20, 21, 30, 31, 32 e o parágrafo final ("REQ-FEAT-0007-12: nenhum código desta feature existe")
- finding: sem mudança (98-divergences.md continua 1.2.0); as linhas presas a `ac84352` afirmam como "hoje" o que a árvore já não tem, enquanto a linha da rodada de 2026-11-03 cita a árvore corrente: o arquivo mistura duas bases. O gerador adiou a correção para uma rodada Mode A ou C.
- expected: uma base única para a coluna "O que o sistema faz hoje", aplicada às linhas anteriores, ao cabeçalho e ao parágrafo final.

### ISSUE-06

- severity: info
- check: D2 — caminho e posição verificados na árvore
- file: web/DES-0008-desenho-da-kart-park-na-tela-de-corrida.md
- location: DES-0008 2.1.0, tabela "`src/main.ts`, por trecho atual", linha `:289-297` `minimap`, `:363-364` câmera de visão geral; "Comportamento em falha", `src/main.ts:22`
- finding: os módulos existem, mas três âncoras de linha não apontam o trecho nomeado: `src/main.ts:22` é linha vazia (a mensagem sem WebGL está em `:31-34`), `:289-297` é `buildLapRecord` (o minimapa está em `:403-410`), `:363-364` é o tratamento de compartilhar (a câmera de visão geral está perto de `:159` e `:520`). `:53-56`, `:58-127` e `:238-244` conferem. Os trechos são todos "sem mudança" e nomeados pelo símbolo, de modo que o item é construível.
- expected: as âncoras da árvore corrente (`:31-34`, `:403-410`, as linhas da câmera de visão geral). Não condiciona o veredito.

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
- hoje: `src/main.ts:44-110`, `:289-297` (base `ac84352`; ver ISSUE-03)
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
- hoje: `src/trackScene.ts:121-126`, `:39-75`, `:77-95`, `:10`; `src/main.ts:53`
- fecha: DES-0008 2.1.0 (REQ-FEAT-0008-14 realizado: pilha em cada vértice, `TYRE_RADIUS_M` 0,1 m, `TYRE_SPACING_M` 0,12 m; recalculado)

## Coverage

- requisitos cobertos: 130 de 130 (REQ-FEAT-0001-01 a REQ-FEAT-0007-13 e REQ-FEAT-0008-01 a -29)
- requisitos sem cobertura: nenhum
- itens de projeto sem fonte: nenhum
- critérios sem caminho de teste alcançável: nenhum; AC-US-0007-11 mede nos dois sentidos contra a fronteira da superfície de contato, sobre o arquivo publicado, e AC-US-0004-06 afirma a pilha em cada vértice
- D9: nenhum `OPEN-<nn>` nem `TBD` no conjunto; D6: nenhum segredo, credencial ou token
