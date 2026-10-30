---
stage: dspec
feature: modelo-kart-01
verdict: FAIL
generated: 2026-10-30T13:45:40Z
counts: {blocker: 0, error: 2, warning: 0, info: 1, divergence: 24}
seed: {revision: 3, digest: 20575ff0c316}
upstream: {stage: fspec, version: 1.3.1, report: fspec-validation-20261030-1202}
feedbacks: []
population: "re-validação (conventions §8) depois da rodada 6, Mode C (feedback dirigibilidade feedback-20261030-1326, FB-01 e FB-02): issue do relatório anterior dspec-validation-20261030-1218 (ISSUE-13, info); arquivos com `version:` movida (9): 01-architecture.md (1.4.0), 97-changelog.md (1.5.0), 98-divergences.md (1.4.0), test-strategy.md (1.5.0), adr/ADR-0003 (1.2.0), adr/ADR-0004 (1.1.0), data/DM-0001 (1.3.0), web/DES-0004 (1.3.1), web/DES-0005 (1.3.0); 00-index.md e 99-traceability.md gerados pelo gate (não re-julgados); dois intocados sorteados (random.sample sobre ADR-0001, ADR-0002, DES-0001, DES-0002, DES-0003, DES-0006, DES-0007): web/DES-0002, security/DES-0007; F-Spec 1.3.1 (`status: validated` nos 21 arquivos) lido para D3: FEAT-0005, RULE-0003 (ancoragem das marcas e efeitos retirados), 01-overview (relação com outras features); seed `revision: 3` (US-5) lido só para conferir a citação; árvore lida só para fatos de posicionamento: src/main.ts:141-157, :495, :553-559, src/physics.ts:106-110, tests/helpers/kart01Report.ts:336-342, tests/modelo-kart-01-contract.test.ts:78-80, tests/fixtures/kart01-sim-baseline.json (setupVersion, recordedOnCommit, schemaVersion), scripts/kart01-baseline.ts, package.json; ADR-0006 e 01-architecture do D-Spec de dirigibilidade lidos só para a fronteira entre features"
context-ignored: "o chamador resumiu a resolução de FB-01 e FB-02, e a rodada 6 de 97-changelog.md registra o raciocínio do gerador (inclusive a 'decisão do dono do produto' e os itens recusados); usados só como lista do que mudou, não como fundamento — a decisão citada não está no F-Spec validado nem no seed"
---

# Relatório de validação do D-Spec — modelo-kart-01

## Summary

- veredito: FAIL
- contagens: 0 blocker, 2 error, 0 warning, 1 info, 24 divergence
- issue anterior: ISSUE-13 (info) continua aberta, sem mudança na linha citada
- issues novas: ISSUE-14, ISSUE-15 (error, D3)
- feedback enviado: nenhum
- entrada humana: sim — a situação em que as marcas de pneu nascem depois da retirada do drift não é decidida pelo F-Spec (ISSUE-14)
- `status:` não alterado (veredito FAIL)

## Issues

### ISSUE-13
- severity: info
- check: D3 (rastreabilidade do registro ao `REQ-*`)
- file: `300 Specs/330 D-Specs/Output/modelo-kart-01/97-changelog.md`
- location: rodada 4, "Itens recusados", linha 325 — "Admitir 0,25/0,27 ao centímetro em RULE-0001/REQ-FEAT-0001-04"
- finding: ainda aberta desde dspec-validation-20261027-1941; no F-Spec 1.3.1 `REQ-FEAT-0001-04` é o entre-eixos (1,05 m); os diâmetros das rodas são `REQ-FEAT-0001-05` e `REQ-FEAT-0001-06`
- fix (para o gerador, não aplicado): trocar `REQ-FEAT-0001-04` por `REQ-FEAT-0001-05, -06` nessa linha

### ISSUE-14
- severity: error
- check: D3 (item de projeto sem `REQ-*` que o sustente; comportamento inventado)
- file: `300 Specs/330 D-Specs/Output/modelo-kart-01/adr/ADR-0003-ordem-de-entrega-depois-da-dirigibilidade-e-sem-chave.md`
- location: Decisão, item 6.1 (linhas 65-72); Consequências, último item (linhas 116-118)
- finding: a decisão faz desta feature a dona da condição de situação das marcas de pneu e a muda de `RUNNING && tricks.drifting && speed > 6 && |sideslip| > 0.055` (`src/main.ts:559`, conferido) para `RUNNING && speed > 6 && |sideslip| > 0.055`. Isso acrescenta situações em que as marcas nascem (derrapagem lateral acima de 0,055 rad sem drift, que antes da feature nunca desenhava marca) — contra REQ-FEAT-0005-04 ("manter as situações ... iguais às de antes da feature, sem acrescentar nem retirar situação"), contra FEAT-0005 ("Esta feature muda onde a marca aparece, não quando"; "Efeito sem a situação que o dispara: a renderização não decide nada") e contra RULE-0003 ("nenhuma situação é acrescentada nem retirada"). Nenhum `REQ-*` nem `[DOMAIN]` do F-Spec 1.3.1 pede a condição nova; o seed `revision: 3`, US-5, citado como fonte, diz que as marcas continuam aparecendo, mas não fixa condição, e a "decisão do dono do produto" invocada não está em nenhuma entrada validada. A existência de condição para as marcas depois da retirada do drift é escolha de produto que o F-Spec resolve no sentido contrário
- fix (para o gerador, não aplicado): não derivável das entradas; ou o autor emenda o F-Spec (FEAT-0005, REQ-FEAT-0005-04, e RULE-0003, coluna "Quando") por uma rodada Mode C da etapa de F-Spec, declarando a condição nova, e o D-Spec passa a citá-la; ou a decisão 6.1 sai e as marcas ficam sem situação depois da entrega da `dirigibilidade` (primeira opção do FB-01), com a lacuna levada ao autor como `OPEN-<nn>`. A decisão 6.3 (regravação da linha de base com `arcade-assistido-v6`) não depende disso e pode ficar

### ISSUE-15
- severity: error
- check: D3 (item de projeto sem `REQ-*` que o sustente; comportamento inventado)
- file: `300 Specs/330 D-Specs/Output/modelo-kart-01/web/DES-0005-efeitos-presos-ao-kart.md`
- location: Realiza (linhas 22-24, em contradição com a linha 17); Interface, tabela de mudanças, linha "condição de situação (`:559`)" (linha 53); seção "Condição de situação das marcas (rodada 6)" (linhas 55-83); Observabilidade (linhas 127-131); Feature flag (linhas 141-143)
- finding: o item de projeto realiza a mesma condição nova de ISSUE-14 e declara ao mesmo tempo realizar REQ-FEAT-0005-04 "sem acrescentar nem retirar nenhuma" situação (linha 17); a condição sem `tricks.drifting` acrescenta situações. O mesmo comportamento se propaga a `test-strategy.md` (AC-US-0005-01, linha 125: contrato que exige a ausência de `tricks`, E2E-05 "marcas nas curvas fortes sem comando de drift"; linhas 147-151: CHK-TEST-0004-06, que hoje afirma "the situations that draw a tyre mark are unchanged", passa a exigir o oposto), `01-architecture.md` (linhas 44-50 e 179), `98-divergences.md` (linha 43, coluna "O que exige" atribui a REQ-FEAT-0005-01, -04 uma condição que eles não exigem) e `web/DES-0004-integracao-da-cena-em-main-ts.md` (linha 69)
- fix (para o gerador, não aplicado): seguir a decisão humana de ISSUE-14 em todos esses pontos; sem emenda do F-Spec, a seção "Condição de situação das marcas" e as verificações que dependem dela saem, e a linha 43 de `98-divergences.md` volta a citar REQ-FEAT-0005-01, -04 pelo que eles exigem

## Divergences

- REQ-FEAT-0001-01, -02 a -14, -17 — kart provisório (`src/main.ts:113-120`, `:123-134` em `0068a57`) — fecha: DES-0001, DES-0004, DES-0006, ADR-0001 — open
- REQ-FEAT-0001-15 — sem placa nem número — fecha: DES-0001, DES-0004 — open
- REQ-FEAT-0001-16 — caixa de sombra fixa na origem — fecha: DES-0004 — open
- REQ-FEAT-0002-01 — esterço por roda da telemetria — fecha: DES-0002, DES-0004 — open
- REQ-FEAT-0002-02 — giro por relógio de parede — fecha: DES-0002, DES-0004, DES-0006 — open
- REQ-FEAT-0002-03, -04, -10 — sem volante, braços nem piloto articulado — fecha: DES-0001, DES-0004, ADR-0001 — open
- REQ-FEAT-0002-05 — sem ponto de referência — fecha: DES-0002, DES-0004 — open
- REQ-FEAT-0003-01, -02, -03, -08, -13 — perseguição alta suavizada — fecha: DES-0003, DES-0004, ADR-0002 — open
- REQ-FEAT-0003-04, -05, -06, -07, -15 — campo de visão 48° com termo de velocidade — fecha: DES-0003, DES-0004, ADR-0002 — open
- REQ-FEAT-0003-09 — sem prova do kart inteiro no quadro — fecha: DES-0003 — open
- REQ-FEAT-0003-11 — câmera inicial fixa — fecha: DES-0003, DES-0004 — open
- REQ-FEAT-0003-12, -14 — sem descida — fecha: DES-0003, DES-0004, ADR-0002 — open
- REQ-FEAT-0004-03, -04 — Kart 01 não montado; sem `DRAW_COST` — fecha: DES-0001, DES-0006, ADR-0001 — open
- REQ-FEAT-0004-01, -02, -05 — `docs/kart-01/device-log.md` ausente — fecha: DES-0004, DM-0001 — open
- REQ-FEAT-0005-01, -07, -08 — cadência de marcas por relógio de parede — fecha: DES-0005 — open
- REQ-FEAT-0003-05, -06, -07, -17 (rodada 5) — parcela de turbo: `src/main.ts:586`, `src/gameCamera.ts:181-182`, `:48`, `:26-27`, `:185` — fecha: DES-0003, DES-0004, ADR-0002 — open
- REQ-FEAT-0005-10 (rodada 5) — jato de escapamento: `src/main.ts:150-157`, `:555-556` (conferido); nó em `src/kart01Model.ts:45`, `:526-530`, `:539` — fecha: DES-0005, DES-0001, ADR-0001 — open
- REQ-FEAT-0005-09 (rodada 5) — drift ainda no jogo: `src/main.ts:495`, condição das marcas em `:559` (conferido) — fecha: DES-0005, ADR-0003 — open
- REQ-FEAT-0005-01, -04 (rodada 6) — `src/main.ts:559` exige `tricks.drifting` (conferido); depois da entrega da `dirigibilidade` a condição nunca vale — fecha: DES-0005, ADR-0003 — open; a forma de fechar está em ISSUE-14 e ISSUE-15
- REQ-FEAT-0003-16; REQ-FEAT-0005-01 depois do fim de uma volta de treino (rodada 5) — encadeamento devido por `race-lap-validation` — fecha: DES-0003, DES-0005 — open
- REQ-FEAT-0005-05, -06 — sem `WHEEL_POSITIONS` nem linha de base — fecha: DES-0006, DM-0001, ADR-0004 — open
- REQ-FEAT-0005-05; REQ-FEAT-0006-07, -08 (rodada 6) — `tests/fixtures/kart01-sim-baseline.json` em `arcade-assistido-v5`, `recordedOnCommit` `b86b200` (conferido); `tests/helpers/kart01Report.ts:340` devolve `BASELINE_MISSING` com outro `setupVersion` (conferido); a árvore já publica `arcade-assistido-v6` (`src/physics.ts:106`) — fecha: DM-0001, ADR-0004, ADR-0003 — open
- REQ-FEAT-0006-04, -05 — sem `LAYERING` dos módulos novos nem `RENDER_NEUTRAL` — fecha: DES-0006 — open
- REQ-FEAT-0006-07, -08 — sem `SIM_CONTRACT` nem `DETERMINISM` — fecha: DES-0006, DM-0001, ADR-0004 — open

## Coverage

- requisitos: 64 `REQ-*` do F-Spec 1.3.1; 64 realizados por `sources:` de DES/ADR/DM; 0 descobertos; 0 `REQ-*` citados que o F-Spec não tem
- itens de projeto sem fonte: a condição de situação das marcas sem o termo do drift (ADR-0003 decisão 6.1; DES-0005, seção da rodada 6) — ISSUE-14, ISSUE-15
- contratos: API-0001 a API-0003 sem mudança nesta rodada
- critérios: 40 `AC-*` com caminho declarado em `test-strategy.md`; 0 inalcançáveis; 0 por configuração, ponto de entrada ou gancho só de teste; o caminho novo de AC-US-0005-01 (contrato sem `tricks`, E2E-05 com curva forte sem comando de drift) prova o comportamento de ISSUE-14, não o critério
- caminhos de módulo: `src/main.ts`, `src/physics.ts`, `tests/helpers/kart01Report.ts`, `tests/modelo-kart-01-contract.test.ts`, `tests/fixtures/kart01-sim-baseline.json`, `scripts/kart01-baseline.ts` existem; `npm run baseline:kart01` declarado em `package.json:12`
- D1 na população: ligações relativas dos arquivos lidos resolvem; `OPEN-<nn>` e `TBD`: 0
