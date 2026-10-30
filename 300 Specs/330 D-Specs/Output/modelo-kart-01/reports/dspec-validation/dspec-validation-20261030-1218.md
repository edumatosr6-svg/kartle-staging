---
stage: dspec
feature: modelo-kart-01
verdict: SUCCESS
generated: 2026-10-30T12:23:21Z
counts: {blocker: 0, error: 0, warning: 0, info: 1, divergence: 22}
seed: {revision: 3, digest: 20575ff0c316}
upstream: {stage: fspec, version: 1.3.1, report: fspec-validation-20261030-1202}
feedbacks: []
population: "re-validação (conventions §8) depois da rodada 5, Mode C (F-Spec revalidado): issue do relatório anterior dspec-validation-20261027-1941 (ISSUE-13, info); arquivos com `version:` movida (11): 01-architecture.md (1.3.0), 97-changelog.md (1.4.0), 98-divergences.md (1.3.0), test-strategy.md (1.4.0), adr/ADR-0001 (1.1.0), adr/ADR-0002 (1.2.0), adr/ADR-0003 (1.1.0), web/DES-0001 (1.2.0), web/DES-0003 (1.2.0), web/DES-0004 (1.3.0), web/DES-0005 (1.2.0); 00-index.md e 99-traceability.md gerados pelo gate (não re-julgados); dois intocados sorteados (random.sample sobre DES-0002, DES-0006, DES-0007, DM-0001, ADR-0004): web/DES-0006, web/DES-0002; F-Spec 1.3 (`status: validated` em todos os arquivos) lido para D3: FEAT-0003, FEAT-0005, API-0003 2.0.0, RULE-0002, e as linhas alteradas de FEAT-0002 e RULE-0003; árvore lida só para fatos de posicionamento: src/gameCamera.ts, src/main.ts, src/kart01Model.ts, src/lap.ts, src/style.css, tests/helpers/autopilot.ts; F-Spec de race-lap-validation (FEAT-0010) e de dirigibilidade lidos só para a fronteira entre features"
context-ignored: "o chamador não passou justificativa; a rodada 5 de 97-changelog.md (inclusive os itens recusados) registra o raciocínio do gerador e foi usada só como lista dos arquivos movidos, não como fundamento"
---

# Relatório de validação do D-Spec — modelo-kart-01

## Summary

- veredito: SUCCESS
- contagens: 0 blocker, 0 error, 0 warning, 1 info, 22 divergence
- issue anterior: ISSUE-13 (info) continua aberta, sem mudança na linha citada
- feedback enviado: nenhum
- entrada humana: nenhuma; nenhuma divergência `waived-pending`
- `status: validated` gravado nos 12 arquivos que liam `draft` (os 11 movidos e 00-index.md, inclusive a coluna Status da sua tabela)

## Issues

### ISSUE-13
- severity: info
- check: D3 (rastreabilidade do registro ao `REQ-*`)
- file: `300 Specs/330 D-Specs/Output/modelo-kart-01/97-changelog.md`
- location: rodada 4, "Itens recusados", linha 325 — "Admitir 0,25/0,27 ao centímetro em RULE-0001/REQ-FEAT-0001-04"
- finding: ainda aberta desde dspec-validation-20261027-1941; no F-Spec 1.3 `REQ-FEAT-0001-04` é o entre-eixos (1,05 m); os diâmetros das rodas são `REQ-FEAT-0001-05` e `REQ-FEAT-0001-06`
- fix (para o gerador, não aplicado): trocar `REQ-FEAT-0001-04` por `REQ-FEAT-0001-05, -06` nessa linha

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
- REQ-FEAT-0003-05, -06, -07, -17 — parcela de turbo: `src/main.ts:586` (`turboActive`), `src/gameCamera.ts:181-182`, `:48`, `:26-27`, `:185` (conferido) — fecha: DES-0003, DES-0004, ADR-0002 — open
- REQ-FEAT-0005-10 — jato de escapamento: `src/main.ts:150-157`, `:555-556`; nó em `src/kart01Model.ts:45`, `:526-530`, `:539` (conferido) — fecha: DES-0005, DES-0001, ADR-0001 — open
- REQ-FEAT-0005-09 — drift ainda no jogo: `src/main.ts:495`, condição das marcas em `:559` (conferido) — fecha: DES-0005, ADR-0003; retirada do drift devida pela `dirigibilidade` — open
- REQ-FEAT-0003-16; REQ-FEAT-0005-01 no treino — toda volta termina em `ENDED` e para a simulação: `src/lap.ts:190`, `src/main.ts:499` (conferido); `src/gameCamera.ts:72-76` já não lê `lapKind` — fecha: DES-0003, DES-0005; encadeamento devido por `race-lap-validation` (FEAT-0010 do F-Spec daquela feature, já especificado; nenhum feedback necessário) — open
- REQ-FEAT-0005-05, -06 — sem `WHEEL_POSITIONS` nem linha de base — fecha: DES-0006, DM-0001, ADR-0004 — open
- REQ-FEAT-0006-04, -05 — sem `LAYERING` dos módulos novos nem `RENDER_NEUTRAL` — fecha: DES-0006 — open
- REQ-FEAT-0006-07, -08 — sem `SIM_CONTRACT` nem `DETERMINISM` — fecha: DES-0006, DM-0001, ADR-0004 — open

## Coverage

- requisitos: 64 `REQ-*` do F-Spec 1.3; 64 realizados por `sources:` de DES/ADR/DM; 0 descobertos; 0 `REQ-*` citados que o F-Spec não tem (os retirados REQ-FEAT-0003-10, -0005-02, -0005-03 fora de todo `sources:`); NFR-0001 a NFR-0007 realizados
- contratos: API-0003 2.0.0 → DES-0003 `CameraView` campo a campo (13 campos, sem `baseVerticalFovDeg` nem `turboFovDeltaDeg`; erro `NO_SCENE`); retirada I3 com ponto de rejeição pela ausência e substituto `verticalFovDeg` declarados; API-0001 e API-0002 sem mudança no upstream
- itens de projeto sem fonte: nenhum
- critérios: 40 `AC-*` com caminho declarado em `test-strategy.md` (AC-US-0003-14, AC-US-0005-04, AC-US-0005-05 novos; AC-US-0003-09, AC-US-0005-02, -03 retirados e ausentes); 0 inalcançáveis; 0 por configuração, ponto de entrada ou gancho só de teste; a parte "kart em movimento" de AC-US-0003-14 tem caminho (`completeLap(reading, 'TRAINING')`, `tests/helpers/autopilot.ts:86`) e depende da divergência devida por `race-lap-validation`
- caminhos de módulo: `src/gameCamera.ts`, `src/kartPose.ts`, `src/kart01Model.ts`, `src/kart01Decals.ts`, `tests/helpers/kart01Report.ts`, `tests/fixtures/kart01-sim-baseline.json`, `scripts/kart01-baseline.ts` existem; `docs/kart-01/device-log.md` declarado **novo**; filhos da cena listados em AC-US-0005-04 conferidos em `src/main.ts:41-61`, `:138-144`, `:245`
- D1 na população: ligações relativas dos 13 arquivos lidos resolvem; um bloco mermaid (01-architecture.md, sequência) sem separador inválido; `OPEN-<nn>` e `TBD`: 0
