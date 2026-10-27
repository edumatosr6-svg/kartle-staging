---
stage: code
feature: pista-kart-park
verdict: FAIL SPEC
generated: 2026-10-27T21:25:31Z
counts: {blocker: 0, error: 1, warning: 2, info: 1, divergence: 2}
seed: {revision: 1, digest: b5aa5be4734a}
upstream: {stage: dspec, version: 1.0.1}
files_examined: 22
feedbacks: ["300 Specs/330 D-Specs/Output/pista-kart-park/reports/feedback/feedback-20261027-2125.md"]
---

# Relatório de validação de código — pista-kart-park (rodada 1)

## Summary

- O código realiza o projeto validado à letra (presets, `Input`, `step`, `STEP` e `src/physics.ts:3` inalterados; `bench:handling` 46/46; `tsc` 0; `npx tsx --test` 294/296 com só as duas verificações de outras features reprovadas; `track verify kart-park 1` V01–V18 `PASS`; arquivo 42 642 B, 687,52 m, anti-horário no plano (leste, norte) como a origem, setores 201,63/350,34/529,86 m, 39 marcadores ≤ 18,29 m, 34 zebras com a da largada dividida, 1 barreira de 63,51 m entre d_o 372–581 m, sem Esri, sem recorde, crédito OSM/ODbL nas duas telas, só `three`, camadas limpas, `promote` recusado sem `--esri-decision`).
- A regra de suavização de ADR-0006, aplicada a este dado, escolhe 0 iterações: o arquivo publicado não é suavizado, contra US-2, DOMAIN/DEC-04 e FLOW-0003 passo 3; defeito de projeto, não de código — FAIL SPEC com feedback ao D-Spec (mais dois itens de contrato/método que o projeto precisa absorver).

## Issues

### ISSUE-01
- severity: error
- check: C2 (fidelidade ao projeto — o projeto, como escrito, não realiza o requisito)
- file: `scripts/trackPrep.ts`; `300 Specs/330 D-Specs/Output/pista-kart-park/adr/ADR-0006-lacunas-do-f-spec-resolvidas-no-projeto.md`
- location: `scripts/trackPrep.ts:94-115` (`smooth`); ADR-0006 "Suavização"; `tracks/registry.json` `prep.smoothingIterations` 0, `prep.maxSmoothingOffsetM` 0
- finding: a regra "iterações de 0 a 400 escolhidas pelo comprimento mais próximo de 687,5 m" dá k = 0 sobre `kart-park.json` (origem já mede 687,5196 m; k = 1 dá 686,72 m), logo a linha central publicada é a origem sem nenhuma suavização, enquanto US-2 ("linha central suavizada", AC-US-0002-06), DOMAIN/DEC-04 ("suavizar a linha central, com janela de cerca de 12 m") e FLOW-0003 passo 3 ("Suaviza a linha central") exigem uma linha suavizada; o código implementa a regra exatamente como o ADR a escreve.
- expected: ADR-0006 com um critério que produza suavização de fato sobre este dado (por exemplo, o maior k cujo comprimento arredondado fique em 680,625–694,375 m com o grampo de 0,295 m, ou uma janela fixa de cerca de 12 m com o grampo), seguido de `prepare`/`verify`/`publish` com o arquivo resultante; feedback SPEC-ISSUE-01.

### ISSUE-02
- severity: warning
- check: C2 (fidelidade de assinatura)
- file: `src/trainingSession.ts`
- location: `src/trainingSession.ts:83` (`startTrainingLap(session, lap, config, setup?: SetupRef)`) contra DES-0005 1.1.0, tabela de interface, linha `startTrainingLap(session, lap, config)`
- finding: quarto parâmetro opcional `setup?: SetupRef`, copiado para o `LapRequest`, que o projeto não nomeia; sem ele `LapResult.setupId`/`setupVersion` de toda volta de treino some e `compareLapRecords` (RULE-0003 de `dirigibilidade`, API-0002 1.1.0 de `race-lap-validation`) deixa de comparar o melhor tempo — a assinatura do projeto é que está incompleta.
- expected: DES-0005 nomeia a passagem do `SetupRef` ao pedido da volta (parâmetro ou campo da sessão) e a sua semântica; feedback SPEC-ISSUE-02.

### ISSUE-03
- severity: warning
- check: C2 (procedimento do projeto diferente do implementado)
- file: `scripts/trackPrep.ts`
- location: `scripts/trackPrep.ts:132-160` (linha transversal) e `:282-362` (`buildBarriers`) contra DES-0010 1.0.1 passos 9 e 5
- finding: passo 9 — a marcha de 0,05 m termina quando o ponto fica 3 m além da borda medido por `beyondTrackEdgeM`, com bissecção a 2,99 m, e não a 3 m de deslocamento ao longo da normal; passo 5 — a borda "voltada para o outro trecho" é a cuja amostra está mais perto das bordas do outro trecho, e não a definida pelo teste "segmento até o outro trecho não atravessa o próprio asfalto"; o resultado passa V11 e V13 e a razão está em `01-implementation.md`, mas o texto do projeto descreve outro procedimento.
- expected: DES-0010 reescrito com o procedimento que o dado exige (ou com a prova de que os dois são equivalentes neste dado), para que projeto e preparo publicado coincidam; feedback SPEC-ISSUE-03.

### ISSUE-04
- severity: info
- check: C2 (interface além da tabela do projeto)
- file: `src/trackGeometry.ts`
- location: `src/trackGeometry.ts:57` (`closestOnSegment`), `:85` (`pointInQuad`), `:269` (`centerlineCrossings`), `:282` (`windingSumOf`)
- finding: quatro funções exportadas além da tabela de interface de DES-0002, usadas por `src/trackData.ts`, `src/physics.ts` e `scripts/trackChecks.ts`; registradas em `01-implementation.md`.
- expected: DES-0002 lista as quatro na revisão que atender SPEC-ISSUE-01 (nota no feedback).

### ISSUE-05
- severity: divergence
- check: C10
- file: `tests/race-lap-validation-track-data.test.ts`
- location: `:18-24` (`CHK-TEST-0009-02`)
- finding: a verificação exige `SYNTHETIC_TRACK_FILE.schemaVersion === TRACK_SCHEMA_VERSION`; ADR-0001 manda o leitor em 3 com a pista sintética em 2, e o código obedece (`src/trackData.ts:11`, `:161-166`).
- expected: ajuste na etapa de testes de `race-lap-validation` (previsto em `01-architecture.md`, "Consequências para outras features"); não conta como defeito de código.

### ISSUE-06
- severity: divergence
- check: C10
- file: `tests/modelo-kart-01-contract.test.ts`
- location: `:162` (`CHK-TEST-0004-13`, `DETERMINISM` de `tests/helpers/kart01Report.ts:426`)
- finding: a linha de base `tests/fixtures/kart01-sim-baseline.json` não tem `barrierTouching`/`barrierContact`, que DES-0003 acrescenta à telemetria (`src/physics.ts:112`); `lapMs` e os demais campos coincidem segundo `98-divergences.md`.
- expected: linha de base regravada na etapa de testes de `modelo-kart-01`; não conta como defeito de código.

## Divergences

- `98-divergences.md` #12 (REQ-FEAT-0007-03, -04, -06, -07): open — provas de `npm test` da Kart Park, etapa de testes.
- `98-divergences.md` #13 (REQ-FEAT-0007-13, REQ-FEAT-0006-14): resolved no código (`scripts/track-pipeline.ts:40-62`, `:151-160`, verificado: `promote` sem `--esri-decision` → `argumento inválido`; registro em `STAGING`); open na etapa de deploy (lista de verificação da release).
- Linhas resolved #1, #3, #4, #5, #6, #7, #8, #10, #11: `arquivo:linha` conferidos por amostra e o código faz o que a linha exige.

## Coverage

- requisitos com código: 101/101 `REQ-FEAT-*` do projeto têm linha em `99-traceability.md` (258 linhas) e símbolo nos registros conferidos (DES-0005, DES-0009, DES-0011).
- requisitos sem código: nenhum.
- arquivos tocados sem registro: nenhum (9 modificados e 11 novos, todos na tabela de `01-implementation.md`).
- portão reexecutado: `npx tsc --noEmit -p .` 0; `npx tsx --test tests/*.test.ts` 296 = 294 pass + 2 fail (ISSUE-05, ISSUE-06); `npm run bench:handling` 46 `PASS` / 0 `FAIL`; `npm run track -- verify kart-park 1` V01–V18 `PASS`, `VERIFIED`.
- arquivos examinados: os 20 da tabela de `01-implementation.md` (leituras dirigidas) e dois intocados por amostra (`src/track.ts`, `src/maneuvers.ts`: sem importação nova, sem relógio, DOM ou sorteio).
