---
stage: code
feature: dirigibilidade
verdict: SUCCESS
generated: 2026-10-30T14:13:22Z
counts: {blocker: 0, error: 0, warning: 0, info: 0, divergence: 2}
seed: {revision: 5, digest: 48feb6d51bf8}
upstream: {stage: dspec, version: 4.0.0, status: validated, report: dspec-validation-20261030-1333}
feedbacks: []
files_examined: 24
population: "rodada 5 (Mode B), re-validação contra code-validation-20261027-1824 (0 issues a reverificar); arquivos do manifesto com version movida: 01-implementation.md 3.0.0, 97-changelog.md 3.0.0, 98-divergences.md 3.0.0, core/DES-0001 2.0.0 (renomeado -v6-), core/DES-0002 2.0.0, core/DES-0003 3.0.0, core/DES-0004 3.0.0, data/DM-0001 3.0.0, web/DES-0005 2.0.0, web/DES-0006 2.0.0, web/DES-0007 1.2.0, security/DES-0008 1.1.0; fonte alterada nesta rodada (mtime 2026-10-30, exatamente os 9 arquivos da tabela D-CD-01): src/physics.ts, scripts/handlingBench.ts, scripts/keyboard-lap.ts, src/setupRecords.ts, src/main.ts, src/handlingMessages.ts, index.html, src/style.css, docs/physics.md; dois intocados sorteados: src/maneuvers.ts e scripts/physics-bench.ts"
evidence: "npx tsc --noEmit -p . saída 0; npm run bench:handling executado 3 vezes e reduzido por script: 56 registros arcade-assistido-v6 em cada, 1ª execução 54 PASS / 2 FAIL (só STEP_COST, medida de relógio, 318,5 µs contra 173,9 µs, logo após o tsc), 2ª e 3ª 56 PASS / 0 FAIL (STEP_COST 177,0 e 185,5 µs, limiar 1,10 × 173,9 = 191,2 µs); pista aberta: TOP_SPEED 19,2514 m/s (69,3 km/h, faixa 65–72), CORNER_RADIUS 11,671 m de 50 km/h e 11,765 m de 70 km/h (≤ 13, os dois lados e os dois modos), CORNER_TURN 3,6366 rad em 2 s com π atingido em 1 825 ms sem acelerador, ACCELERATION 2 208 ms, offAsphaltStepCount 0 em todo registro TEST_PAD; npm run bench:physics 10 PASS / 0 FAIL; invariante 1 de DES-0001 verificado independentemente: as duas voltas de referência de tests/fixtures/kart01-sim-baseline.json (gravadas no commit b86b200, física anterior a esta rodada; ARCADE_ASSISTIDO_V5 e RENTAL_KART, 3 531 + 5 272 passos, sem comando de drift) reproduzidas com a física atual dão o mesmo finalKart campo a campo (inclusive rodas e telemetria), o mesmo lapMs e os mesmos setores; invariante 2: as mesmas voltas com drift true em todo passo dão o mesmo estado final, e 96 000 passos com entradas pseudoaleatórias (V6, V5, ARCADE_KART, RENTAL_KART × CIRCUIT, TEST_PAD, testPadArea(1500), testPadArea(40)) dão 0 estados diferentes entre drift true e false, State.maneuvers sempre igual a initialManeuvers(), velocidade máxima do V6 19,04 m/s; grep: src/physics.ts sem drifting, boosting, advanceManeuvers, cancelManeuver, onRoad nem parcela de governador do impulso; npx tsx --test tests/*.test.ts: 370 testes, 350 pass, 20 fail, os 20 iguais à tabela 'Verificações reprovadas' de 98-divergences.md (5 carregamentos de arquivo dirigibilidade-*, CHK-TEST-0010-03/-07, 0007-02/-03, 0008-04, 0001-06, 0009-05, a verificação de drift de tests/maneuvers.test.ts e CHK-TEST-0004-09, -11 a -16 de modelo-kart-01), nenhum de race-lap-validation nem de pista-kart-park; 64/64 REQ-FEAT-* do projeto em 99-traceability.md; todas as citações arquivo:linha de 98-divergences.md e 01-implementation.md conferidas na árvore"
context-ignored: "nenhuma justificativa do gerador chegou pela invocação; a afirmação do manifesto sobre a prova dos invariantes (script fora do repositório) não foi aceita como evidência e foi substituída pela verificação acima"
---

# Relatório de validação de código — dirigibilidade (rodada 5)

## Summary

Verificações C1–C10 e D-CD-01 a D-CD-07 sobre a população acima: nenhum `blocker`, `error`, `warning` ou `info`.
Duas linhas `open` com motivo e etapa devedora (14 e R); W e 1–13 resolvidas e conferidas no código.

## Issues

Nenhum `ISSUE-<nn>`.

## Divergences

- id: DIV-14
- severity: divergence
- check: C10 / D-CD-07
- file: `400 Code/Output/dirigibilidade/98-divergences.md`
- location: linha 14 (provas em `npm test` de test-strategy 6.0.0; `docs/handling-device-log.md`)
- finding: `open`; as 20 verificações reprovadas são as declaradas, chaveadas no projeto anterior (v5, API-0003 3.x, SCR-0002 1.1) e na linha de base de `modelo-kart-01`.
- expected: fechada pelo estágio de testes desta feature e pelo de `modelo-kart-01` (FB-02), não por este estágio.

- id: DIV-R
- severity: divergence
- check: C10 / D-CD-07
- file: `400 Code/Output/dirigibilidade/98-divergences.md`
- location: linha R (gatilho "cada item novo de `listLapResults`"; campos de treino de `LapResult` 1.2.0)
- finding: `open`; `src/lap.ts` não tem `listLapResults` nem os campos de treino, o gatilho continua a fase `ENDED` (`src/main.ts:530-533`) e a parte desta feature existe (`recordLapResult`, `src/main.ts:289-300`, sem leitura da fase).
- expected: fechada pela rodada de código de `race-lap-validation`.

## Coverage

- requisitos com código: 64/64 `REQ-FEAT-*` do projeto em `99-traceability.md` (0 ausentes, 0 extras); todo arquivo citado pelos registros `core/`, `data/`, `web/`, `security/` existe.
- requisitos sem código: nenhum.
- arquivos alterados não registrados: nenhum.
