---
stage: dspec
feature: modelo-kart-01
verdict: SUCCESS
generated: 2026-10-30T14:17:06Z
counts: {blocker: 0, error: 0, warning: 1, info: 1, divergence: 24}
seed: {revision: 4, digest: 4e9bfbba6294}
upstream: {stage: fspec, version: 2.1.0, report: fspec-validation-20261030-1401}
feedbacks: []
population: "re-validação (conventions §8) depois da rodada 7, Mode B: issues do relatório anterior dspec-validation-20261030-1341 (ISSUE-13 info, ISSUE-14 e ISSUE-15 error); arquivos com `version:` movida desde ele (7): 01-architecture.md (1.4.0 -> 1.5.0), 97-changelog.md (1.5.0 -> 1.6.0), 98-divergences.md (1.4.0 -> 1.5.0), test-strategy.md (1.5.0 -> 1.6.0), adr/ADR-0003 (1.2.0 -> 1.3.0), web/DES-0004 (1.3.1 -> 1.3.2), web/DES-0005 (1.3.0 -> 1.4.0); 00-index.md e 99-traceability.md gerados pelo gate (não re-julgados); dois intocados sorteados (random.sample sobre ADR-0001, ADR-0002, ADR-0004, DM-0001, DES-0001, DES-0002, DES-0003, DES-0006, DES-0007): data/DM-0001, adr/ADR-0001; F-Spec (`status: validated` em todos os arquivos; FEAT-0005 2.1.0, RULE-0003 1.2.0) lido para D3: 65 `REQ-*`, 42 `AC-*`; árvore lida só para fatos de posicionamento: src/main.ts:2, :140, :147, :149-156, :164, :507, :548, :550-551, :553-555, :575, :576-581, src/physics.ts:106, :120-126, :427-437, src/lap.ts:66, :168, :198-206, src/kartPose.ts:26, src/gameCamera.ts:26-27, :48, :72, :181-185, src/kart01Model.ts:45, :526-530, :539, tests/modelo-kart-01-contract.test.ts:78-80"
context-ignored: "o chamador não passou justificativa; a rodada 7 de 97-changelog.md traz o raciocínio do gerador (inclusive os itens recusados, entre eles a recusa de atualizar as linhas citadas e a de extrair a decisão para função pura); usada só como lista do que mudou, não como fundamento"
---

# Relatório de validação do D-Spec — modelo-kart-01

## Summary

- veredito: SUCCESS
- contagens: 0 blocker, 0 error, 1 warning, 1 info, 24 divergence
- issues anteriores: ISSUE-13, ISSUE-14, ISSUE-15 fechadas
- issues novas: ISSUE-16 (warning, D8), ISSUE-17 (info, D9)
- feedback enviado: nenhum
- entrada humana: não
- `status: validated` gravado em todos os arquivos do conjunto

## Issues

### ISSUE-13
- severity: info
- check: D3 (rastreabilidade do registro ao `REQ-*`)
- file: `300 Specs/330 D-Specs/Output/modelo-kart-01/97-changelog.md`
- location: rodada 4, "Itens recusados", linha 325
- finding: fechada; a linha cita `REQ-FEAT-0001-05, -06`, os diâmetros das rodas

### ISSUE-14
- severity: error
- check: D3 (item de projeto sem `REQ-*` que o sustente)
- file: `300 Specs/330 D-Specs/Output/modelo-kart-01/adr/ADR-0003-ordem-de-entrega-depois-da-dirigibilidade-e-sem-chave.md`
- location: Decisão 6.1 (linhas 66-73)
- finding: fechada; a condição agora é a situação de marca de pneu de REQ-FEAT-0005-11 e -12 (FEAT-0005 2.1.0, RULE-0003 1.2.0, seed `revision: 4`, `DOMAIN/DEC-09`), lida de `getKartPose`, `getLapState` e `getHandlingTelemetry`, nomeada e não redefinida; REQ-FEAT-0005-04 saiu de `sources:`

### ISSUE-15
- severity: error
- check: D3 (item de projeto sem `REQ-*` que o sustente)
- file: `300 Specs/330 D-Specs/Output/modelo-kart-01/web/DES-0005-efeitos-presos-ao-kart.md`
- location: Realiza (linhas 15-29); Situação de marca de pneu (linhas 62-102)
- finding: fechada; o item realiza REQ-FEAT-0005-11 e -12 com as quatro condições e os limites estritos do F-Spec; test-strategy.md (AC-US-0005-06, -07), 01-architecture.md (linhas 45-49, 180), 98-divergences.md (linha 43) e DES-0004 (linha 69) alinhados

### ISSUE-16
- severity: warning
- check: D8 (níveis apropriados)
- file: `300 Specs/330 D-Specs/Output/modelo-kart-01/test-strategy.md`
- location: linhas 128-129 (AC-US-0005-06, AC-US-0005-07); matriz de FEAT-0005 (linha 68)
- finding: a decisão da tabela "Trecho novo de marca de pneu" de RULE-0003 (quatro condições, limites estritos, um trecho por quadro com passo novo) só é executada no roteiro em tela E2E-05; o nível (C) confere o texto do `if` em `src/main.ts`, e o nível (I) confere só as leituras de entrada (`lapPhase`, `simStepCount`, `NO_STATE`), nunca a decisão de desenhar ou não um trecho a partir delas; os valores no limite (exatamente 6 m/s e 0,055 rad) não são executados em nenhum nível
- fix (para o gerador, não aplicado): dar à decisão um ponto executável em Node (por exemplo, uma função pura da situação chamada pelo bloco das marcas) e cobri-la em nível U com as linhas da tabela de RULE-0003, inclusive os limites exatos; ou registrar a cobertura só por tela como aceita

### ISSUE-17
- severity: info
- check: D9 (o que existe hoje em `arquivo:linha`)
- file: `300 Specs/330 D-Specs/Output/modelo-kart-01/98-divergences.md`
- location: linhas 40-42 (as linhas da rodada 5, que o cabeçalho declara citarem a árvore corrente)
- finding: as linhas citadas não são as da árvore de hoje: `src/main.ts:586` (`turboActive`, hoje `:581`), `:150-157` e `:555-556` (jato, hoje `:150-156` e `:550-551`), `:495` (comando de drift, hoje `:507`), `:559` (condição das marcas, hoje `:554`, como a linha 43 do mesmo arquivo cita para o mesmo `if`); os símbolos citados existem e identificam cada ponto sem ambiguidade. As mesmas linhas antigas aparecem em DES-0004 linha 68 e ADR-0003 decisão 4 (linha 49)
- fix (para o gerador, não aplicado): trocar as linhas pelas de hoje (`:581`, `:150-156`, `:550-551`, `:507`, `:554`) ou datar as linhas da rodada 5 pelo commit em que foram lidas

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
- REQ-FEAT-0003-05, -06, -07, -17 (rodada 5) — parcela de turbo: `src/main.ts:581` (conferido; o registro cita `:586`), `src/gameCamera.ts:181-182`, `:48`, `:26-27`, `:185` — fecha: DES-0003, DES-0004, ADR-0002 — open
- REQ-FEAT-0005-10 (rodada 5) — jato de escapamento: `src/main.ts:150-156`, `:550-551` (conferido); nó em `src/kart01Model.ts:45`, `:526-530`, `:539` — fecha: DES-0005, DES-0001, ADR-0001 — open
- REQ-FEAT-0005-09 (rodada 5) — drift ainda no jogo: `src/main.ts:507` (comando), condição das marcas em `:554` (conferido) — fecha: DES-0005, ADR-0003 — open
- REQ-FEAT-0005-11, -12 (rodada 7) — `src/main.ts:554` exige `tricks.drifting` e lê `state.speed` e `state.telemetry.sideslip`; `SKID_STEP_INTERVAL` em `:147`, `:555` (conferido) — fecha: DES-0005, ADR-0003 — open
- REQ-FEAT-0003-16; REQ-FEAT-0005-01 depois do fim de uma volta de treino (rodada 5) — encadeamento devido por `race-lap-validation` — fecha: DES-0003, DES-0005 — open
- REQ-FEAT-0005-05, -06 — sem `WHEEL_POSITIONS` nem linha de base — fecha: DES-0006, DM-0001, ADR-0004 — open
- REQ-FEAT-0005-05; REQ-FEAT-0006-07, -08 (rodada 6) — linha de base em `arcade-assistido-v5`; a árvore publica `arcade-assistido-v6` (`src/physics.ts:106`, conferido) — fecha: DM-0001, ADR-0004, ADR-0003 — open
- REQ-FEAT-0006-04, -05 — sem `LAYERING` dos módulos novos nem `RENDER_NEUTRAL` — fecha: DES-0006 — open
- REQ-FEAT-0006-07, -08 — sem `SIM_CONTRACT` nem `DETERMINISM` — fecha: DES-0006, DM-0001, ADR-0004 — open

## Coverage

- requisitos: 65 `REQ-*` do F-Spec (FEAT-0005 2.1.0, com -11 e -12; -04 retirado); 65 realizados por `sources:` de DES/ADR/DM; 0 descobertos; 0 `REQ-*` citados que o F-Spec não tem
- itens de projeto sem fonte: nenhum
- contratos: API-0001 a API-0003 sem mudança nesta rodada; `getHandlingTelemetry` (`speedMps`, `sideslipRad` em módulo, `NO_STATE`, `src/physics.ts:427-437`) e `getLapState` (`lapPhase`, `src/lap.ts:66`, `:206`) lidos como o F-Spec os nomeia
- critérios: 42 `AC-*` com caminho declarado em `test-strategy.md` (inclusive AC-US-0005-06 e -07); 0 inalcançáveis; 0 por configuração, ponto de entrada ou gancho só de teste
- caminhos de módulo: `src/main.ts`, `src/kart01Model.ts`, `src/kartPose.ts`, `src/lap.ts`, `src/physics.ts`, `src/gameCamera.ts`, `tests/modelo-kart-01-contract.test.ts` existem; nenhum módulo novo nesta rodada
- D1 na população: ligações relativas dos arquivos lidos resolvem; bloco mermaid de 01-architecture.md bem formado; `OPEN-<nn>` e `TBD`: 0
