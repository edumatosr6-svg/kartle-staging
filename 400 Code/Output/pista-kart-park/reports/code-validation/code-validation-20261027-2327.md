---
stage: code
feature: pista-kart-park
verdict: SUCCESS
generated: 2026-10-27T23:30:26Z
counts: {blocker: 0, error: 0, warning: 0, info: 0, divergence: 2}
seed: {revision: 1, digest: b5aa5be4734a}
upstream: {stage: dspec, version: 1.0.2}
files_examined: 12
feedbacks: []
previous: "code-validation-20261027-2213.md (SUCCESS, 0/0/0/0/2); ISSUE-01 a ISSUE-06 reverificados e continuam fechados; rodada 3 acionada por testing-report-20261027-2307 FAIL-01"
population: "revalidação (§8): os seis itens do relatório anterior; o item FAIL-01 do Testing Report; os arquivos com version movida (01-implementation 1.2.0, 97-changelog 1.2.0, 98-divergences 1.2.0, core/DES-0003 1.0.1; fonte src/physics.ts); dois intocados sorteados (semente 20261027-2327): pipeline/DES-0011, web/DES-0009"
---

# Relatório de validação de código — pista-kart-park (rodada 3)

## Summary

- A rodada 3 aplica exatamente a correção geométrica de FAIL-01: `src/physics.ts:372` passa a `startSideNormal = sSide >= 0 ? {−leftOfAB.x, −leftOfAB.z} : leftOfAB`; com `a = (0,0)`, `b = (1,0)` tem-se `leftOfAB = (0, −1)` e `orientation(a, b, ·) = c.z`, logo o vetor fica do lado negativo e a normal escolhida aponta para o lado de `S` nos dois sinais de `sSide` (DES-0003 passo 1); no ramo do trajeto (`:376-378`) o kart vai a `Q + m·0,1` do lado de origem, `n = −m` aponta para a barreira e `outgoing = v·n > 0` dispara a resposta do muro (1,12; 0,65; `cancelManeuver`; `barrierHit`); o caso `near.distanceM === 0` (`:382`) usa a mesma normal, consistente com o passo 2 ("ou a normal do lado de S, se E está sobre AB"); o ramo de proximidade (`:380-383`) e o comentário `:365-366` são as únicas outras linhas da função, e o comentário só descreve o lado do vetor.
- Nada mais mudou em `src/physics.ts` (481 linhas, como no manifesto; `STEP` `:6`, `PHYSICS_VERSION` `:8` `rental-4t-v4`, `Input` `:9`, `CURB_GRIP_PC` `:13`, `RENTAL_KART` `:55`, `ARCADE_KART` `:67`, `KART_PRESETS` `:75`, `ARCADE_ASSISTIDO_V5` `:79` com `governorSpeed` 31,5, `SOLVER_SUBSTEPS` `:90`, bloco do muro `:324-338`, bloco da barreira `:339-357`, `step` `:384`, telemetria `:405-412`, nos mesmos símbolos e linhas que o manifesto e o relatório anterior citam); `src/lap.ts` 302 linhas, `trackEdgeDistanceM` em `:3`/`:264`, não aparece na árvore de trabalho; portão reexecutado: `npx tsc --noEmit -p .` 0; `npx tsx --test tests/*.test.ts` 398 / 398 aprovadas / 0 reprovadas; `bench:handling` 46 `PASS` / 0 `FAIL`; `track verify kart-park 1` V01–V18 `PASS`, `VERIFIED` (684 pontos, 682,116 m, 38 marcadores, 34 zebras, 381 segmentos de barreira, 43 013 bytes). Nenhum defeito aberto: SUCCESS.

## Issues

### ISSUE-01
- severity: fechado (era FAIL-01 do Testing Report, CODE)
- check: C2
- file: `src/physics.ts`
- location: `:372` (`startSideNormal`), `:365-366` (comentário), `:376-378` (ramo do trajeto), `:382` (`near.distanceM === 0`)
- finding: normal do lado de `S` agora aponta para o lado de origem (DES-0003 passo 1, ADR-0003 decisão 2); reflexão dispara no ramo do trajeto; caso `E` sobre `AB` consistente; nenhuma outra linha da função, do bloco da barreira (`:339-357`), do muro (`:324-338`) ou do arquivo alterada; `CHK-TEST-0004-03` incluído nas 398 verificações aprovadas.
- expected: atendido.

### ISSUE-02
- severity: fechado (era ISSUE-01 do relatório anterior, error)
- check: C2
- file: `scripts/trackPrep.ts`
- location: `:12-15` (`SMOOTH_WINDOW_M` 12, `SMOOTH_MAX_OFFSET_M` 0,295, `TARGET_LAP_LENGTH_M` 687,5, `LAP_LENGTH_TOLERANCE` 0,01)
- finding: constantes inalteradas; `track verify kart-park 1` V01 (desvio máximo 0,2955 m no ponto 218), V03 (682,116 m) e V07 (0,2940 m) `PASS` sobre o arquivo intacto.
- expected: atendido.

### ISSUE-03
- severity: fechado (era ISSUE-02 do relatório anterior, warning)
- check: C2
- file: `src/trainingSession.ts`
- location: `:81` (`startTrainingLap(session, lap, config, setup?: SetupRef)`; o relatório anterior citava `:83`, mesma assinatura), `src/main.ts:297`
- finding: assinatura de DES-0005 1.2.0 e chamada com `{setupId, setupVersion}` no quarto argumento; arquivo não tocado nesta rodada.
- expected: atendido.

### ISSUE-04
- severity: fechado (era ISSUE-03 do relatório anterior, warning)
- check: C2
- file: `scripts/trackPrep.ts`
- location: `transversalLine`, `refineEnd`, `buildBarriers`
- finding: arquivo não tocado nesta rodada; V11 (42 linhas de borda a borda em 3 m), V13 (376 pares separados por barreira), V14 (381 segmentos) e V15 `PASS`.
- expected: atendido.

### ISSUE-05
- severity: fechado (era ISSUE-04 do relatório anterior, info)
- check: C2
- file: `src/trackGeometry.ts`
- location: `:57`, `:85`, `:269`, `:282`
- finding: `closestOnSegment`, `pointInQuad`, `centerlineCrossings`, `windingSumOf` exportados nas mesmas linhas; arquivo não tocado.
- expected: atendido.

### ISSUE-06
- severity: fechado (era ISSUE-05 e ISSUE-06 do relatório anterior, divergence)
- check: C10
- file: `tests/race-lap-validation-track-data.test.ts`, `tests/modelo-kart-01-contract.test.ts`
- location: `CHK-TEST-0009-02`, `CHK-TEST-0004-13`
- finding: 398/398 nesta rodada; nenhum arquivo de `tests/` na árvore de trabalho desta feature.
- expected: atendido.

## Divergences

- `98-divergences.md` #12 (REQ-FEAT-0007-03, -04, -06, -07): open — provas de `npm test` da Kart Park, etapa de testes (102 verificações de `tests/pista-kart-park-*.test.ts` agora incluídas nas 398).
- `98-divergences.md` #13 (REQ-FEAT-0007-13, REQ-FEAT-0006-14): resolved no código (`scripts/track-pipeline.ts`, registro em `STAGING`); open na etapa de deploy.
- Linha #5 (rodada 3): `arquivo:linha` conferidos contra a árvore — `src/physics.ts:176-183` (`Environment.track`, `trackEnvironment` com `walls: false`), `:339-357` (bloco da barreira com `n = −m`), `:367-383` (`barrierContactPoint`, `:372` corrigida), `:405-412` (`barrierTouching`/`barrierContact`); o código faz o que a linha exige.
- Linha #6 (rodada 3): `src/physics.ts:185-187` (`trackEdgeDistanceM`) e `src/lap.ts:264` conferidos; iguais.

## Coverage

- requisitos com código: 101/101 `REQ-FEAT-*` com linha em `99-traceability.md` (277 linhas, gerada pelo gate); as linhas de DES-0003 (API-0003, FEAT-0002, FEAT-0004, FEAT-0005, FLOW-0002) apontam para o registro cuja tabela cita os símbolos conferidos.
- requisitos sem código: nenhum.
- arquivos tocados sem registro: nenhum — a árvore de trabalho altera `src/physics.ts` e os registros do manifesto (`00-index.md`, `01-implementation.md`, `97-changelog.md`, `98-divergences.md`, `99-traceability.md`, `core/DES-0003`), exatamente os que `01-implementation.md` 1.2.0 e `97-changelog.md` rodada 3 nomeiam; `src/lap.ts`, `tests/`, presets, `Input`, contrato de passo e arquivo de pista inalterados.
- escopo (C9): a única alternativa recusada (renomear `leftOfAB`) está registrada em `97-changelog.md` com motivo; nenhum `TODO`, impressão de depuração ou código comentado em `src/physics.ts`.
- amostras intocadas: `pipeline/DES-0011` 1.1.0 (`scripts/trackChecks.ts:132-333` = `verifyTrackFile` até `return results`) e `web/DES-0009` 1.0.0 (`src/main.ts:512-516` `navigator.vibrate(CURB_PULSE_MS)` / `audio.curb()`, `src/audio.ts:45-47` `soundOn()`); símbolos e linhas existem.
- status: os 18 registros sob `400 Code/Output/pista-kart-park/` (fora `reports/`) leem `status: validated`; nenhum `draft` restava a carimbar.
- arquivos examinados: 12 (`01-implementation.md`, `97-changelog.md`, `98-divergences.md`, `core/DES-0003`, `pipeline/DES-0011`, `web/DES-0009`, `00-index.md` e `99-traceability.md` (leitura dirigida); `src/physics.ts`, `src/lap.ts`, `src/trainingSession.ts`, `scripts/trackPrep.ts` (leituras dirigidas); conferências pontuais em `src/main.ts`, `src/audio.ts`, `scripts/trackChecks.ts`, `src/trackGeometry.ts`, `tests/pista-kart-park-barrier.test.ts`).
