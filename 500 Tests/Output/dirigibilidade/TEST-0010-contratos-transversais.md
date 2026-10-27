---
id: TEST-0010
title: Contratos transversais: passo fixo, custo, docs/physics.md, camadas, Realista e validação de volta
feature: dirigibilidade
stage: test
status: validated
version: 1.0.0
sources: [AC-US-0005-06, NFR-0002, NFR-0004, NFR-0005, NFR-0006, NFR-0007, NFR-0008]
---

# TEST-0010 — Contratos transversais: passo fixo, custo, docs/physics.md, camadas, Realista e validação de volta

| | |
|---|---|
| Arquivo | `tests/dirigibilidade-contract.test.ts` (estratégia: `contract`) |
| Nível | contrato (`STEP_CONTRACT`, `STEP_COST`, `REALISTA_UNCHANGED`, `SETUP_VERSION` por `runBench` e `judge`; campos comuns de API-0003) e unitário (`readBaseline` sobre `docs/physics.md` real e sobre `baselineMarkdown('stepCost')`; fontes de `src/` e `scripts/` lidas como texto, sem comentários) |
| Interface exercitada | `runBench`, `judge`, `readBaseline`, `loadBaselineText`, `ALL_BENCHES`, `BENCH_PARAMETERS` (`scripts/handlingBench.ts`); `STEP`, `SOLVER_SUBSTEPS`, `RENTAL_KART`, `ARCADE_KART`, `ARCADE_ASSISTIDO_V5`, `PUBLISHED_SETUPS` (`src/physics.ts`) |
| Fixtures | `baselineMarkdown('stepCost')` de `tests/fixtures/records.ts` (entrada com `runtimeId` de fixture e `STEP_COST` de 10 µs nos dois modos); `options(mode)` com `stepCost` constante (10, 10,9 e 11,5 µs: nenhum relógio lido); linhas de base reais de `docs/physics.md` (`arcade-assistido-v4`, `arcade-assistido-v5`, `realista-aluguel-4t-v4`) |

## Verificações

| Check | Decide | Teste | O que a faria falhar |
|---|---|---|---|
| CHK-TEST-0010-01 | AC-US-0005-06 | the step, the solver rate and the Input fields are the same before and after the feature | `STEP` diferente de 1/120, solver fora de 480 Hz, linha literal de `Input` ou assinatura de `step` alteradas, `STEP_CONTRACT` reprovado, `judge` sem `CONTRACT_CHANGED` |
| CHK-TEST-0010-02 | NFR-0002 | the step cost is judged only against a baseline of the same machine and runtime, at most 10 % above it | linha de base de outro runtime aceita, 11,5 µs contra 10 µs aprovado, 10,9 µs reprovado, `BASELINE_MISSING` não emitido para outro runtime, `STEP_COST` medindo o relógio por conta própria, linha de base real sem `runtimeId` |
| CHK-TEST-0010-03 | NFR-0004 | docs/physics.md carries a handling-baseline block with a dated entry per setup version, the sweep parameters and every record of API-0003 with its environment | bloco ausente, entrada de uma das três versões ausente, `measuredAtUtc` fora do formato, `plateauMs`/`plateauSpeedHoldMode` ausentes dos parâmetros, `benchId` de `ALL_BENCHES` sem registro, registro sem `benchEnvironment` ou sem os campos condicionais do seu ensaio, prosa sem data |
| CHK-TEST-0010-04 | NFR-0005 | the simulation modules of the feature read no DOM, clock, random, perf hooks or os, and the application decides no driving rule | `document.`/`window.`/`Date`/`performance.`/`Math.random`/temporizadores/`navigator.`/`fetch(` em `src/physics.ts`, `src/setupRecords.ts`, `scripts/handlingBench.ts` ou `src/handlingMessages.ts`; importação de `three`, `node:perf_hooks`, `node:os`, `./audio` ou `./main`; literal de regra (`50 / 3.6`, `13.88`, `0.65`) ou símbolo de pilotagem (`KART_PRESETS`, `ARCADE_KART`, `classifyHandlingSteps`, `testPadLane`, `testPadArc`, `isForcing`) em `src/main.ts`; DOM presente no runner |
| CHK-TEST-0010-05 | NFR-0007 | the Realista preset is unchanged: no differing measure against its baseline, no arcade assist active, no new optional field | medida diferente da linha de base do Realista em qualquer ambiente, assistência ativa, campo opcional novo em `RENTAL_KART` ou `ARCADE_KART`, Realista com versão anterior declarada, presets ou dado publicado não congelados, `judge` sem `BASELINE_MISSING`/`CONTRACT_CHANGED` |
| CHK-TEST-0010-06 | NFR-0008 | the lap validation and the track data of race-lap-validation do not know the setup: no import of the records module, no test-pad, and the setup fields only copied | `src/lap.ts`, `src/track.ts`, `src/trackData.ts` ou `src/lapTiming.ts` importando os módulos da feature ou usando `testPadLane`/`testPadArc`/`PUBLISHED_SETUPS`/`resolveSetupRef`; `setupVersion` fora de `src/lap.ts`; em `src/lap.ts`, mais menções a `setupVersion` do que os campos opcionais e as duas cópias literais (mutação C reprova), ou uma comparação; suítes de `race-lap-validation` ou a verificação `0012-02` daquela feature (resultado com exatamente os campos do contrato numa volta sem acerto) removidas |
| CHK-TEST-0010-07 | AC-US-0005-06 | the records of API-0003 carry the common fields with their types, failReason only with FAIL, and every published setup is frozen | campo comum ausente ou com tipo errado, `measuredAtUtc` lido do relógio em vez do chamador, `failReason` com `PASS`, lista de ensaios ou parâmetros mutáveis, número de ensaios diferente de 16 |
