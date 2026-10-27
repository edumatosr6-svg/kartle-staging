---
stage: dspec
feature: modelo-kart-01
verdict: SUCCESS
generated: 2026-10-27T19:41:42Z
counts: {blocker: 0, error: 0, warning: 0, info: 1, divergence: 21}
seed: {revision: 1, digest: ef2fe14c9440}
upstream: {stage: fspec, version: 1.2.0}
feedbacks: []
population: "re-validação (conventions §8) depois de uma rodada Mode C sobre o feedback da etapa de código `reports/feedback/feedback-20261027-1928.md` (SPEC-ISSUE-01): o relatório anterior `dspec-validation-20261027-1624` (SUCCESS) não tinha issue aberta, logo nenhuma a re-verificar; arquivos com `version:` movida (4): web/DES-0001 (1.0.0 → 1.1.0), web/DES-0006 (1.2.0 → 1.3.0), test-strategy.md (1.2.0 → 1.3.0), 97-changelog.md (1.2.0 → 1.3.0); dois arquivos intocados sorteados ao acaso (random.sample sobre os 12 com versão inalterada): 98-divergences.md, adr/ADR-0001; D1 mecânico sobre os 18 arquivos; F-Spec 1.2.0 (`status: validated` nos 22 arquivos) lido para D3 (RULE-0001, API-0002, FEAT-0001, FEAT-0004); requisitos (`02-glossary.md`, US-0001) e `01-overview.md` lidos só para a palavra da tolerância; árvore lida só para fatos de posicionamento: `docs/kart-01/kart.js:291-325` (`criarRoda`); gate `lint_artifacts.py` passado antes desta execução (índice regenerado em 2026-10-27T19:41:07Z)"
context-ignored: "a invocação trouxe o resumo do que a rodada mudou (eixo Z, nó `spin`, 14 segmentos, tolerância inalterada); foi tratado como lista de arquivos a ler, não como fundamento: cada afirmação foi conferida contra RULE-0001, API-0002, FEAT-0001 do F-Spec 1.2.0 e contra `docs/kart-01/kart.js`; a rodada 4 de `97-changelog.md` registra a escolha e os motivos do gerador — chegaram pelo artefato e não foram usados como fundamento"
---

# Relatório de validação do D-Spec — modelo-kart-01

## Summary

- veredito: SUCCESS
- contagens: 0 blocker, 0 error, 0 warning, 1 info, 21 divergence
- issues anteriores: nenhuma aberta em `dspec-validation-20261027-1624` (SUCCESS, 0 issues)
- SPEC-ISSUE-01 do feedback `feedback-20261027-1928.md`: respondida na rodada 4 de `97-changelog.md` ("Fechada por edição"), com a escolha entre as saídas que o feedback oferecia, o motivo e as recusas; a regra nova está nos três lugares que a carregam (DES-0001 tabela "Como as medidas de RULE-0001 saem do modelo montado"; DES-0006 linha `measureKart01Model`; `test-strategy.md` AC-US-0001-04, seguida por "idem" em -05 a -07) e nenhum lugar do conjunto lê "extensão em Y" fora do histórico do changelog
- a regra nova é medida do modelo montado, não o valor declarado: extensão em Z da caixa envolvente da geometria mesclada de cada roda no referencial local do nó `spin` (nó exposto por `Kart01Model.wheels[nome].spin`); DES-0001 e DES-0006 dizem que o valor coincide com `wheels[nome].diameterM` sem que `diameterM` seja a medida (`SEED/IM-I9`; AC-US-0001-04 e -05 "para o modelo montado"); fato de posicionamento conferido em `docs/kart-01/kart.js:296-309`: `segs = 14`, perfil com pontos em `r = raio`, `pneu.rotateZ(-Math.PI / 2)` (o eixo Y do `LatheGeometry` vai a X; Z fica), de modo que φ = 0 e φ = π dão z = ±`raio` (extensão em Z = 2 × `raio`, 0,26 e 0,28 exatos) e nenhum vértice cai em ±Y (extensão em Y = 2 × `raio` × sin(3 × 2π/14) = 0,975 × 2 × `raio`; 0,2535 e 0,273), como os itens afirmam
- a tolerância não foi reduzida nem ampliada: `judgeModelCheck` de DES-0006 continua "cada valor arredondado ao centímetro igual (0,26; 0,28; 1,00; 1,14), senão `OUT_OF_TOLERANCE`", igual a RULE-0001 ("ao centímetro"; "nenhuma outra tolerância é admitida"), API-0002 (`WHEELS_AND_TRACKS`) e REQ-FEAT-0001-05 a -08 ("medida ao centímetro"); o changelog recusa a saída que afrouxaria o requisito (0,25/0,27)
- nenhuma geometria, campo, símbolo ou registro acrescentado (§16): `Kart01Model` e API-0002 inalterados; 5.128 triângulos e 27 chamadas mantidos (REQ-FEAT-0004-04, `DOMAIN/DEC-01`)
- ISSUE-13 (info): o changelog rotula o requisito dos diâmetros como `REQ-FEAT-0001-04`, que é o entre-eixos; detalhes em Issues
- feedback enviado: nenhum
- entrada humana: nenhuma; nenhuma divergência `waived-pending`
- `status: validated` gravado nos 5 arquivos do conjunto que liam `draft` (web/DES-0001, web/DES-0006, test-strategy.md, 97-changelog.md e o próprio 00-index.md, inclusive a coluna Status da sua tabela, como nos ciclos de 1840 e 1624); 99-traceability.md não tem campo `status`; nenhum arquivo lê `draft`

## Issues

### ISSUE-13
- severity: info
- check: D3 (rastreabilidade do registro ao `REQ-*`)
- file: `300 Specs/330 D-Specs/Output/modelo-kart-01/97-changelog.md`
- location: rodada 4, "Itens recusados" — "Admitir 0,25/0,27 ao centímetro em RULE-0001/REQ-FEAT-0001-04"
- finding: no F-Spec 1.2.0 `REQ-FEAT-0001-04` é o entre-eixos (1,05 m, `wheelbaseM`); os diâmetros das rodas são `REQ-FEAT-0001-05` (dianteiras, AC-US-0001-04) e `REQ-FEAT-0001-06` (traseiras, AC-US-0001-05); o rótulo repete o do feedback da etapa de código, que confundiu o id do critério com o do requisito; DES-0001, DES-0006 e `test-strategy.md` citam os ids certos (`sources` e linhas AC-US-0001-04/-05), por isso só o histórico fica impreciso
- fix (para o gerador, não aplicado): trocar `REQ-FEAT-0001-04` por `REQ-FEAT-0001-05, -06` nessa linha da rodada 4

## Divergences

- REQ-FEAT-0001-01, -02 a -14, -17 — kart provisório de caixas em `src/main.ts:113-120` e `:123-134` — fecha: DES-0001, DES-0004, DES-0006, ADR-0001 — open
- REQ-FEAT-0001-15 — sem placa nem número (`src/main.ts:113-120`) — fecha: DES-0001, DES-0004 — open
- REQ-FEAT-0001-16 — sombra em caixa fixa ±120/±100 m na origem (`src/main.ts:36`; `box()` em `:74`, rodas em `:130`) — fecha: DES-0004 — open
- REQ-FEAT-0002-01 — esterço por roda da telemetria (`src/main.ts:474`); `getKartPose` não existe — fecha: DES-0002, DES-0004 — open
- REQ-FEAT-0002-02 — giro por relógio de parede e raio 0,31 (`src/main.ts:476`); sem `WHEEL_SPIN` — fecha: DES-0002, DES-0004, DES-0006 — open
- REQ-FEAT-0002-03, -04, -10 — sem volante, braços nem piloto articulado (`src/main.ts:117-119`) — fecha: DES-0001, DES-0004, ADR-0001 — open
- REQ-FEAT-0002-05 — sem ponto de referência (`src/main.ts:442`) — fecha: DES-0002, DES-0004 — open
- REQ-FEAT-0003-01, -02, -03, -08, -13 — perseguição alta suavizada (`src/main.ts:478-482`) — fecha: DES-0003, DES-0004, ADR-0002 — open
- REQ-FEAT-0003-04, -05, -06, -07, -15 — campo de visão 48° + termo de velocidade (`src/main.ts:19`, `:483`, `:485`, `:391-394`) — fecha: DES-0003, DES-0004, ADR-0002 — open
- REQ-FEAT-0003-09 — sem prova do kart inteiro no quadro — fecha: DES-0003 — open
- REQ-FEAT-0003-10 — turbo somado a 48° com termo de velocidade e suavização (`src/main.ts:483`, `:485`) — fecha: DES-0003, DES-0004, ADR-0002 — open
- REQ-FEAT-0003-11 — câmera inicial fixa (`src/main.ts:395-396`, `:478`) — fecha: DES-0003, DES-0004 — open
- REQ-FEAT-0003-12, -14 — sem descida (`src/main.ts:229`) — fecha: DES-0003, DES-0004, ADR-0002 — open
- REQ-FEAT-0004-03, -04 — Kart 01 não montado; sem `DRAW_COST` — fecha: DES-0001, DES-0006, ADR-0001 — open
- REQ-FEAT-0004-01, -02, -05 — `docs/kart-01/device-log.md` não existe — fecha: DES-0004, DM-0001 — open
- REQ-FEAT-0005-01, -07, -08 — cadência de marcas por relógio de parede (`src/main.ts:448-449`, `:451-455`, `:472`) — fecha: DES-0005 — open
- REQ-FEAT-0005-02 — dois jatos presos ao kart de caixas (`src/main.ts:143-151`) — fecha: DES-0005 — open
- REQ-FEAT-0005-03 — marcas sob as rodas de caixas (`src/main.ts:447`) — fecha: DES-0005 — open
- REQ-FEAT-0005-05, -06 — sem `WHEEL_POSITIONS`, `TELEMETRY_WHEEL_POSITIONS` nem linha de base — fecha: DES-0006, DM-0001, ADR-0004 — open
- REQ-FEAT-0006-04, -05 — `tests/race-lap-validation-layering.test.ts` não conhece os módulos novos; sem `RENDER_NEUTRAL` — fecha: DES-0006 — open
- REQ-FEAT-0006-07, -08 — sem `SIM_CONTRACT`, `DETERMINISM` nem linha de base anterior à feature — fecha: DES-0006, DM-0001, ADR-0004 — open

## Coverage

- requisitos: 63 `REQ-*` do F-Spec 1.2.0; os `sources:` de DES-0001 e DES-0006 não mudaram nesta rodada; `99-traceability.md` regenerado pelo gate antes desta execução; 0 descobertos; o relatório 1624 fechou as duas direções e nenhum arquivo movido alterou `sources:`
- contratos: API-0002 → DES-0006, campo a campo inalterado (`frontWheelDiametersM`, `rearWheelDiametersM` lista de 2 em m, ordem esquerda, direita; `PASS` ao centímetro em 0,26/0,28); RULE-0001 "diâmetro externo da roda com o pneu", "ao centímetro", "corrigido no modelo, nunca na tabela" — a regra nova mede a geometria montada e a tolerância fica; API-0001 e API-0003 fora da população (arquivos sem mudança)
- itens de projeto sem fonte: nenhum; contradição com o upstream: nenhuma; contradição interna: nenhuma — DES-0001 (tabela das medidas), DES-0006 (`measureKart01Model`) e `test-strategy.md` (AC-US-0001-04 a -07) dizem a mesma regra de medida; a medida sintética "roda 0,27 m → `OUT_OF_TOLERANCE`" de `test-strategy.md` continua válida
- critérios: AC-US-0001-04 a -07 com caminho declarado (`model` (I): `measureKart01Model(buildKart01Model())`, nós `spin` públicos de `Kart01Model.wheels`; (U): medida sintética); os demais 36 `AC-*` sem mudança desde 1624; 0 inalcançáveis; 0 por configuração, ponto de entrada ou gancho só de teste
- caminhos de módulo: nenhum caminho novo nesta rodada; `docs/kart-01/kart.js` presente e **sem alteração** declarada (DES-0001), `criarRoda` em `:291`; o changelog diz que a rodada de código seguinte toca só `tests/helpers/kart01Report.ts` (novo), não `src/kart01Model.ts`
- D1 nos 4 movidos e 2 sorteados: ligações relativas resolvem (DES-0001 → DES-0002, DES-0004, DES-0005, DES-0006, ADR-0003; DES-0006 → DM-0001, ADR-0004, DES-0007; test-strategy → DM-0001, DES-0005, DES-0006, DES-0007; 98-divergences → ADR-0002; ADR-0001 → DES-0001); nenhum bloco mermaid nesses arquivos; `OPEN-<nn>` e `TBD`: 0 ocorrências nos 18 arquivos; front matter, ids, índice, rastreabilidade e arquivos obrigatórios são do gate e não foram re-julgados
- D2 (DES-0001, DES-0006): `REQ-*`, caminho exato (existente ou **novo**), camada Aplicação, interface, colaboradores, falha e chave (nenhuma, com a razão do F-Spec) presentes; unidade em todo numérico (m nas medidas das rodas; referencial e eixo nomeados); sem corpo de implementação (a regra de medida é contrato, não código)
- D3 (DES-0001, DES-0006): a regra nova realiza REQ-FEAT-0001-05 e -06 como medida sobre o modelo montado; nada é redefinido sob o mesmo nome (I3: `frontWheelDiametersM`/`rearWheelDiametersM` continuam m, lista de 2, mesma semântica de API-0002; `wheels[nome].diameterM` continua o declarado que o giro usa, RULE-0003)
- D4: DM-0001 fora da população (sem mudança); nenhum campo novo
- D5: nenhuma chamada nova entre camadas; a medida fica em `tests/helpers/kart01Report.ts` (evidência, I9), que lê o modelo pela interface pública; I4 e I10 sem mudança (nenhum módulo, dependência ou configuração nova; nenhuma geometria alterada)
- D6: sem segredo nos 4 arquivos movidos (varredura de padrões: 0); sem sessão, papel ou entrada de fronteira nova
- D7: sem escrita de domínio nem transição de estado nova; `measureKart01Model` leitura idempotente
- D8 (`test-strategy.md` 1.3.0): seis `FEAT-*` com nível; AC-US-0001-04 nomeia o eixo e o nó; nenhuma regra provada só por E2E
- D9: `98-divergences.md` (sorteado, 1.2.0): 21 linhas com requisito, exigência, `arquivo:linha`, etapa devedora, item que fecha e estado `open`; nenhuma `waived-pending`; a rodada 4 não abriu linha nova
- ADR-0001 (sorteado, 1.0.0): decisão 2 ("nenhuma geometria, posição, escala ou segmento muda") coerente com a rodada 4, que recusou mudar a roda; consequências e alternativas sem contradição com DES-0001 1.1.0
- `97-changelog.md` rodada 4: o que mudou, SPEC-ISSUE-01 fechada por edição, escolha com motivo, recusas com motivo (`diameterM`; "maior extensão entre Y e Z"; afrouxar 0,25/0,27; mudar geometria; campo novo), nenhuma superfície acrescentada (§16), FB-01 superado mantido (§17); rótulo do requisito impreciso (ISSUE-13)
