---
title: Divergências — dirigibilidade do Arcade assistido (estágio de código)
feature: dirigibilidade
stage: code
status: validated
version: 3.0.0
sources: []
---

# Divergências

Registro contra `300 Specs/330 D-Specs/Output/dirigibilidade/98-divergences.md` 4.0.0 (projeto revalidado em
`dspec-validation-20261030-1333`; rodada de código 5, Mode B). Caminhos relativos à raiz do repositório; as medidas são as de
`01-implementation.md` (saída de `npm run bench:handling` de 2026-10-30, registrada em `docs/physics.md`).

## Linhas abertas do projeto 4.0.0, com o estado nesta rodada

| # | Requisito | O que exige | Etapa devedora | Item de projeto | Estado | Resolução |
|---|---|---|---|---|---|---|
| 1 | REQ-FEAT-0004-02, REQ-FEAT-0002-11, -12, -13, REQ-FEAT-0005-05 | acerto C publicado como `arcade-assistido-v6`, v5 intacto, `previousSetupVersion` `arcade-assistido-v4` | código | DES-0001, DM-0001, ADR-0001 | resolved | `src/physics.ts:92-95` (`ARCADE_ASSISTIDO_V6`), `:106-107` (`PUBLISHED_SETUPS`); `ARCADE_ASSISTIDO_V5` `:79-89` intacto; medido: 19,25 m/s (69,3 km/h), raio 11,67/11,77 m, giro 208,4° |
| 2 | REQ-FEAT-0003-13, -16, REQ-FEAT-0006-01 | o comando de drift não muda o estado; nenhuma carga, impulso, combo ou pontuação; velocidade máxima única | código | DES-0001, ADR-0006 | resolved | `src/physics.ts:2` (`import` só de `initialManeuvers` e `Maneuvers`), `:223`, `:229`, `:236`, `:278`, `:289-293` (parcelas de `drifting`/`boosting` retiradas), `:383` (sem `advanceManeuvers`), sem cancelamentos; invariantes provados (0 diferenças em 72 000 passos, `core/DES-0001`); `DRIFT_INERT` 0 de 3 126 e 0 de 360; `SPEED_CAP` 19,25 ≤ 19,25 m/s |
| 3 | REQ-FEAT-0002-17; REQ-FEAT-0001-01 a -04, REQ-FEAT-0003-04, -05 | pista de teste aberta, `TEST_AREA_EXCEEDED` fora da área | código | DES-0001, DES-0004, ADR-0005 | resolved | `src/physics.ts:198-200` (`testPadArea`); `scripts/handlingBench.ts:114-115`, `:52` (`FailReason`), `:741` (`judge`: `TEST_AREA_EXCEEDED` primeiro); 0 passos fora da área em todos os registros |
| 4 | REQ-FEAT-0002-06, -14, -15, -16 | `CORNER_RADIUS` e `CORNER_TURN` julgados só pelo raio e pelo giro | código | DES-0004, ADR-0004 | resolved | `scripts/handlingBench.ts:279` (`pathRadius`), `:295` (`cornerRadius`), `:325` (`cornerTurn`); `REFERENCE_CORNER`, `UNDERSTEER_ONSET` e as suas funções retirados |
| 5 | REQ-FEAT-0003-01, -06, -08 | `NORMAL_DRIVING` sobre todos os passos da volta do piloto de teste | código | DES-0004, ADR-0005 | resolved | `scripts/handlingBench.ts:490` (`normalDriving`); `classifyHandlingSteps` retirado de `src/physics.ts`; medido: 0 de 2 766, 0,077 rad |
| 6 | REQ-FEAT-0003-04, -05, -12, -17 | `REAR_RECOVERY` aberta, ±1, `rearReleased`/`forcingMs`, sem reprovar sem soltura | código | DES-0004, ADR-0004 | resolved | `scripts/handlingBench.ts:352` (`rearRecovery`), `judge`; medido: traseira não solta dos dois lados, `forcingMs` 3 000, `PASS` |
| 7 | REQ-FEAT-0003-08, -13, -16 | registros `DRIFT_INERT` e `SPEED_CAP` | código | DES-0004 | resolved | `scripts/handlingBench.ts:503`, `:514`, `:533`, `:586`; `DRIFT_MANEUVER` retirado |
| 8 | REQ-FEAT-0004-02, -07 | `TOP_SPEED` 65–72 km/h; `WALL_CONTACT` vazio `MEASUREMENT_MISSING`; campos da área em `ACCELERATION`/`TOP_SPEED` | código | DES-0004 | resolved | `scripts/handlingBench.ts:32-36` (`THRESHOLDS`), `:385` (`straightLine` na área de 1 500 m), `judge` |
| 9 | API-0001 2.0.0 | telemetria com posição e rumo, sem `driftActive` | código | DES-0002 | resolved | `src/physics.ts:424-440` |
| 10 | REQ-FEAT-0003-14 | HUD sem indicador de drift, turbo, combo ou pontuação | código | DES-0005 | resolved | `index.html` (`.style-score` e `#drift-hud` removidos), `src/main.ts:512` (laço sem prêmio), escrita do HUD do drift e `import` de `./maneuvers` removidos; `src/style.css` sem as regras do drift |
| 11 | REQ-FEAT-0003-15, REQ-FEAT-0005-13; SCR-0002 1.2.0 | texto compartilhado e resultado sem `setupVersion` nem drift | código | DES-0006 | resolved | `src/handlingMessages.ts:9`; `index.html` sem `#lap-result-setup`; `src/main.ts` `renderResult` sem a escrita da versão |
| 12 | REQ-FEAT-0005-01 a -04, -10 | a volta do piloto de teste, a cronometrada e a reprodução terminam no primeiro resultado | código | DES-0003, DES-0004 | resolved | `scripts/handlingBench.ts:448`, `:460` (`hasLapResult` em `testPilotLap`); `scripts/keyboard-lap.ts:33` (`measureStepCost`); `src/setupRecords.ts:121` (`replayLap`) |
| 13 | REQ-FEAT-0006-08, NFR-0004 | entrada datada de `arcade-assistido-v6`; v4 e Realista medidos de novo, uma entrada por chave | código | DM-0001, ADR-0003 | resolved | `docs/physics.md` (seção `## Dirigibilidade — Arcade assistido v6` e bloco com v4 e Realista de 2026-10-30, v5 mantida, v6 acrescentada) |
| 14 | provas em `npm test` (REQ-FEAT-0001-06, REQ-FEAT-0002-06, REQ-FEAT-0003-08, REQ-FEAT-0004-07, REQ-FEAT-0006-04, -05) e roteiro registrado | verificações de test-strategy 6.0.0; `docs/handling-device-log.md` | testes | test-strategy | open | nenhum arquivo de `tests/` é escrito aqui; as falhas desta rodada estão na tabela "Verificações reprovadas" |

## Dependências e notas desta rodada

| # | Item | O que o projeto diz | Estado na árvore | Etapa devedora | Estado |
|---|---|---|---|---|---|
| R | DES-0006 (gatilho de cada resultado), DM-0001 seção 2 (campos de treino de `LapResult` 1.2.0) | o tratamento de cada resultado aceita o gatilho "cada item novo de `listLapResults`" de `race-lap-validation`; o `LapRecord` carrega `lapSequenceCount`, `lapStartMs`, `trainingLapMs`, `trainingSectorMs` | o código do treino contínuo de `race-lap-validation` ainda não está na árvore: `src/lap.ts` não tem `listLapResults` nem os campos de treino, e o gatilho continua a fase `ENDED` (`src/main.ts:530-533`). Esta rodada implementou a parte desta feature: `recordLapResult` (`src/main.ts:289-300`) recebe um `LapResult` e não lê a fase; `buildLapRecord` copia o resultado inteiro, logo carrega os campos de treino quando existirem; os fins de volta no primeiro resultado (linha 12) | código de `race-lap-validation` (rodada seguinte) | open |
| W | DES-0004, Colaboradores ("deixa de importar … `WIDTH`") | `grassEntry` mantido (DES-0004) | `grassEntry` usa `WIDTH / 2` para pôr o kart ao lado da pista; `scripts/handlingBench.ts:12` continua importando `WIDTH` de `src/track.ts` só para isso, sem mudança de comportamento (`GRASS_LOSS` e a identidade do Realista dependem da mesma entrada) | — | resolved |

## Verificações reprovadas em `npx tsx --test tests/*.test.ts` (370 testes: 350 aprovados, 20 reprovados)

| Arquivo | Verificação | Motivo | Devedora |
|---|---|---|---|
| `tests/dirigibilidade-classify.test.ts` | carregamento do arquivo | importa `classifyHandlingSteps`, retirado (DES-0001; o projeto retira o arquivo) | testes desta feature |
| `tests/dirigibilidade-cornering.test.ts` | carregamento do arquivo | importa `arcEntry`/`testPadArc` e os ensaios retirados (`REFERENCE_CORNER`, `UNDERSTEER_ONSET`) | testes desta feature |
| `tests/dirigibilidade-rear.test.ts` | carregamento do arquivo | importa símbolos retirados (anel de 18 m, `DRIFT_MANEUVER`) | testes desta feature |
| `tests/dirigibilidade-speed.test.ts` | carregamento do arquivo | importa símbolos retirados | testes desta feature |
| `tests/dirigibilidade-telemetry.test.ts` | carregamento do arquivo | afirma `driftActive` e `testPadLane` (API-0001 1.x) | testes desta feature |
| `tests/dirigibilidade-contract.test.ts` | CHK-TEST-0010-03, CHK-TEST-0010-07 | esperam `arcRadiusM` no bloco e dezesseis ensaios (API-0003 3.x) | testes desta feature |
| `tests/dirigibilidade-hud-text.test.ts` | CHK-TEST-0007-02, CHK-TEST-0007-03 | esperam a `setupVersion` no texto compartilhado e `#lap-result-setup` (SCR-0002 1.1) | testes desta feature |
| `tests/dirigibilidade-setup-version.test.ts` | CHK-TEST-0008-04 | o fixture grava a volta com `ARCADE_ASSISTIDO_V5` (`tests/helpers/handling.ts:19`) e a reproduz com o acerto corrente v6 | testes desta feature |
| `tests/dirigibilidade-steer-response.test.ts` | CHK-TEST-0001-06 | importa `testPadArc`/espera a faixa reta | testes desta feature |
| `tests/dirigibilidade-test-pilot.test.ts` | CHK-TEST-0009-05 | conta os registros da suíte anterior (segunda condição de acelerador) | testes desta feature |
| `tests/maneuvers.test.ts` | "player-induced drift generates real lateral slip and a useful exit boost" | exige o drift pelo passo; retirado pela tabela de migração do projeto (`tests/maneuvers.test.ts:68-80`) | testes desta feature |
| `tests/modelo-kart-01-contract.test.ts` | CHK-TEST-0004-09, -11, -12, -13, -14, -15, -16 | a linha de base da simulação de `modelo-kart-01` (`tests/fixtures/kart01-sim-baseline.json`) é chaveada em `arcade-assistido-v5`: `BASELINE_MISSING` com `arcade-assistido-v6` (feedback cruzado FB-02 de `modelo-kart-01`, ISSUE-11 de `dspec-validation-20261030-1333`) | `modelo-kart-01` |

Os conjuntos de `race-lap-validation` e de `pista-kart-park` (inclusive os testes de camada que nomeiam `src/maneuvers.ts` e os
de superfície que leem `PUBLISHED_SETUPS.ARCADE_ASSISTIDO`) passam inteiros nesta rodada.
