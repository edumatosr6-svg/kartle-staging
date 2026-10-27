---
stage: code
feature: pista-kart-park
verdict: SUCCESS
generated: 2026-10-27T22:13:49Z
counts: {blocker: 0, error: 0, warning: 0, info: 0, divergence: 2}
seed: {revision: 1, digest: b5aa5be4734a}
upstream: {stage: dspec, version: 1.0.2}
files_examined: 21
feedbacks: []
previous: "code-validation-20261027-2125.md (FAIL SPEC, 0/1/2/1/2); ISSUE-01 a ISSUE-06 reverificados e fechados"
population: "revalidação (§8): os seis itens do relatório anterior; os arquivos com version movida (01-implementation 1.1.0, 97-changelog 1.1.0, 98-divergences 1.1.0, pipeline/DES-0010 1.1.0, pipeline/DES-0011 1.1.0, data/DM-0001 1.1.0, data/DM-0002 1.1.0, core/DES-0002 1.1.0, core/DES-0005 1.1.0, web/DES-0007 1.1.0; fonte scripts/trackPrep.ts, scripts/track-pipeline.ts, src/tracks/kart-park-v1.json, tracks/registry.json); dois intocados sorteados (semente 20261027-2208): src/style.css, src/trainingSession.ts"
---

# Relatório de validação de código — pista-kart-park (rodada 2)

## Summary

- A rodada 2 realiza ADR-0006 1.1.0 à letra: `smooth` (`scripts/trackPrep.ts:95-115`) aplica uma vez a janela de 12 m de distância de volta com pesos de cosseno levantado e o grampo de 0,295 m; rederivação independente (`python -I`, origem `52c5adda…` → arquivo `04ce5e51…`) coincide ponto a ponto (0 desvios > 1 mm, desvio máximo 0,2955 m no ponto 218, 684 pontos, 682,116 m dentro de 680,625–694,375, anti-horário como a origem, limites 199,394/347,042/525,650 m, 38 marcadores ≤ 18,003 m, 34 zebras com a da largada dividida, barreira de 382 vértices e 53,29 m a ≥ 0,510 m da borda do asfalto e nenhum vértice no asfalto, sem chave `lapLengthM`, 43 013 bytes).
- Portão reexecutado: `npx tsc --noEmit -p .` 0; `npx tsx --test tests/*.test.ts` 296/296; `bench:handling` 46 `PASS` / 0 `FAIL`; `track verify kart-park 1` V01–V18 `PASS`, `VERIFIED`; presets, `Input`, `STEP`, `src/physics.ts:3`, regras de `src/lap.ts` e `tests/` intocados nesta rodada; só `three` em `dependencies`; registro em `STAGING`, `promote` sem `--esri-decision` recusado em `parseArgs` (`scripts/track-pipeline.ts:57`). Nenhum defeito aberto: SUCCESS.

## Issues

### ISSUE-01
- severity: fechado (era error)
- check: C2
- file: `scripts/trackPrep.ts`
- location: `:12-15` (`SMOOTH_WINDOW_M` 12, `SMOOTH_MAX_OFFSET_M` 0,295, `TARGET_LAP_LENGTH_M` 687,5, `LAP_LENGTH_TOLERANCE` 0,01), `:95-115` (`smooth`), `:189-194` (comprimento remedido e conferido), `:272-275` (`PrepRecord.smoothingWindowM`)
- finding: regra de ADR-0006 1.1.0 / DES-0010 1.1.0 passo 2 implementada (δ pela distância de volta na linha original, volta fechada, `j` crescente, próprio ponto com peso 1, projeção sobre o círculo de 0,295 m, arredondamento a 0,001 m antes da medição, falha sem escrever fora de 687,5 m ± 1 %); `SMOOTH_LAMBDA`/`SMOOTH_MAX_ITERATIONS` ausentes; arquivo publicado reproduzido pela rederivação independente; a entrada `smoothingIterations` 0 da rodada reprovada não existe mais em `tracks/registry.json` (DM-0002 1.1.0, "Entrada de rodada reprovada").
- expected: atendido.

### ISSUE-02
- severity: fechado (era warning)
- check: C2
- file: `src/trainingSession.ts`
- location: `:83` (`startTrainingLap(session, lap, config, setup?: SetupRef)`), `:87-90` (`setupId`/`setupVersion` só quando `setup` é dado); `src/main.ts:297`
- finding: assinatura e semântica iguais à tabela de interface de DES-0005 1.2.0 e ao registro `:208-218`/`beginLap` de DES-0007 1.2.0; nenhuma mudança de código.
- expected: atendido.

### ISSUE-03
- severity: fechado (era warning)
- check: C2
- file: `scripts/trackPrep.ts`
- location: `:133-159` (`transversalLine`: ordem grama → barreira → `beyondTrackEdgeM >= 3`), `:163-170` (`refineEnd`, 20 passos, último ponto abaixo de 2,99 m), `:307-310` (`buildBarriers`: borda voltada pela amostra mais próxima, empate à esquerda, descarte > 6 m ou = 0)
- finding: DES-0010 1.1.0 passos 5 e 9 descrevem o procedimento que o código executa (marcha de 0,01 m, falha sem grama ou grama < 0,2 m, ordem pela distância de volta no primeiro trecho com desempate x/z, salto ≤ 1 m); V11 e V13 `PASS`.
- expected: atendido.

### ISSUE-04
- severity: fechado (era info)
- check: C2
- file: `src/trackGeometry.ts`
- location: `:57`, `:85`, `:269`, `:282`
- finding: `closestOnSegment`, `pointInQuad`, `centerlineCrossings` e `windingSumOf` constam da tabela de interface de DES-0002 1.1.0 (`:50-53`); nenhuma mudança de código.
- expected: atendido.

### ISSUE-05
- severity: fechado (era divergence)
- check: C10
- file: `tests/race-lap-validation-track-data.test.ts`
- location: `CHK-TEST-0009-02`
- finding: reescrito por `race-lap-validation` em `32d0adf`; `npx tsx --test tests/*.test.ts` 296 aprovadas, 0 reprovadas nesta rodada; nenhum arquivo de `tests/` tocado por esta feature.
- expected: atendido.

### ISSUE-06
- severity: fechado (era divergence)
- check: C10
- file: `tests/modelo-kart-01-contract.test.ts`
- location: `CHK-TEST-0004-13`
- finding: comparação restrita aos campos da linha de base por `modelo-kart-01` em `c7e71b1`; passa na rodada 2 (296/296).
- expected: atendido.

## Divergences

- `98-divergences.md` #12 (REQ-FEAT-0007-03, -04, -06, -07): open — provas de `npm test` da Kart Park, etapa de testes.
- `98-divergences.md` #13 (REQ-FEAT-0007-13, REQ-FEAT-0006-14): resolved no código (`scripts/track-pipeline.ts:48-57`, `:151-160`; registro em `STAGING`, `stagedAtUtc` 2026-10-27T21:58:06.132Z); open na etapa de deploy.
- Linha #2 (rodada 2): `arquivo:linha` de `scripts/trackPrep.ts` (`:59-91`, `:93-116`, `:133-161`, `:181-276`, `:190-194`, `:287-367`, `:380-391`) e de `scripts/track-pipeline.ts` (`:40-62`, `:96-109`, `:111-122`, `:124-149`, `:151-160`) conferidos contra a árvore; o código faz o que a linha exige.

## Coverage

- requisitos com código: 101/101 `REQ-FEAT-*` com linha em `99-traceability.md` (gerada pelo gate; registros DES-0010, DES-0011, DM-0001, DM-0002, DES-0002, DES-0005, DES-0007 conferidos contra os símbolos e linhas da árvore).
- requisitos sem código: nenhum.
- arquivos tocados sem registro: nenhum — a árvore de trabalho altera `scripts/trackPrep.ts`, `scripts/track-pipeline.ts`, `src/tracks/kart-park-v1.json`, `tracks/registry.json` e os registros do manifesto, exatamente os que `01-implementation.md` 1.1.0 nomeia; `scripts/trackChecks.ts`, `src/physics.ts`, `src/lap.ts`, `package.json` e `tests/` inalterados.
- registro (DM-0002 1.1.0): uma entrada `kart-park` 1 `STAGING` com `prep` {`originFile`, `originSha256` `52c5adda…`, `smoothingWindowM` 12, `maxSmoothingOffsetM` 0,295, `lapLengthM` 682,116, `originOffsetM` {26,625; 5,49}, `curbWidthsM` 34 × 1, `reducedCurbs` []}, `sha256` `04ce5e51…`, `fileBytes` 43 013; campos iguais à tabela de DM-0002.
- camadas: `scripts/trackPrep.ts` importa só `../src/track` (tipo), `../src/trackData` (tipo) e `../src/trackGeometry`, sem `node:*`, relógio ou sorteio; `src/trainingSession.ts` (amostra) importa só `./physics`, `./lap`, `./trackData`, `./trackGeometry`, sem `three`, DOM, relógio, sorteio nem texto de crédito; `src/style.css:8` (amostra) só `.track-selector`/`.track-credit`.
- configuração morta (C8): todas as constantes exportadas de `scripts/trackPrep.ts` são lidas num sítio que muda o resultado (`SMOOTH_WINDOW_M` em `:97`, `LAP_LENGTH_TOLERANCE` em `:191`); nenhum segredo, `TODO` ou impressão de depuração em `scripts/trackPrep.ts`.
- arquivos examinados: 21 (10 registros do manifesto com `version` movida; `scripts/trackPrep.ts`, `scripts/track-pipeline.ts`, `scripts/trackChecks.ts` (V01/V03/V07, leitura dirigida), `src/tracks/kart-park-v1.json`, `tracks/registry.json`, `tracks/sources/kart-park.json`, `src/trainingSession.ts`, `src/main.ts:297`, `src/trackGeometry.ts` (exportações), `src/physics.ts` e `src/lap.ts` (presets, `STEP`, `Input`, linha 3, `evaluateCut` — leituras dirigidas), `src/style.css:8`).
