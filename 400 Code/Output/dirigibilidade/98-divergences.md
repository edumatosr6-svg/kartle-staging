---
title: Divergências — dirigibilidade do Arcade assistido (estágio de código)
feature: dirigibilidade
stage: code
status: validated
version: 3.1.0
sources: []
---

# Divergências

Registro contra `300 Specs/330 D-Specs/Output/dirigibilidade/98-divergences.md` 4.1.0 (projeto revalidado em
`dspec-validation-20261030-1530`; rodada de código 6, Mode B; linhas 1 a 13 resolvidas na rodada 5, 15 e 16 nesta). Caminhos relativos à raiz do repositório; as medidas são as de
`01-implementation.md` (saída de `npm run bench:handling` de 2026-10-30, registrada em `docs/physics.md`).

## Linhas abertas do projeto 4.1.0, com o estado nesta rodada

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
| 14 | provas em `npm test` (REQ-FEAT-0001-06, REQ-FEAT-0002-06, REQ-FEAT-0003-08, REQ-FEAT-0004-07, REQ-FEAT-0006-04, -05) e roteiro registrado | verificações de test-strategy 6.1.0 (inclusive AC-US-0003-12 a -15 em `tests/dirigibilidade-hud-text.test.ts`); `docs/handling-device-log.md` | testes | test-strategy | open | nenhum arquivo de `tests/` é escrito aqui; as falhas desta rodada estão na tabela "Verificações reprovadas" |
| 15 | REQ-FEAT-0003-18, -19, -20; SCR-0003 1.0.0 | tela inicial, dica da barra e guia de manobras sem drift nem turbo, sem texto novo | código | DES-0009 | resolved | `index.html:19` (`#welcome` sem o `<h2>`, a frase do drift e "Espaço + curva para drift"), `:34` (`.control-hint` "Dirigir"; `.actions` e `#lap-end-training` intactos), `.maneuver-guide` retirada; `src/style.css:3` sem `.maneuver-guide`; `index.html` sem `/drift\|turbo\|impulso\|combo\|Espaço/i` |
| 16 | REQ-FEAT-0003-21; SCR-0001 1.2.0 | controle de toque sem o botão "Drift" nem outro controle de drift ou turbo | código | DES-0007 | resolved | `index.html:32` (`.touch-controls` só com `left`/`right` e `brake`/`throttle`); `src/main.ts:549` (`drift: keys.has(' ')`); consulta `driftButton` retirada; `src/style.css:3` sem `.touch-controls button[data-control=drift]` |

## Dependências e notas desta rodada

| # | Item | O que o projeto diz | Estado na árvore | Etapa devedora | Estado |
|---|---|---|---|---|---|
| R | DES-0006 (gatilho de cada resultado), DM-0001 seção 2 (campos de treino de `LapResult` 1.2.0) | o tratamento de cada resultado aceita o gatilho "cada item novo de `listLapResults`" de `race-lap-validation`; o `LapRecord` carrega `lapSequenceCount`, `lapStartMs`, `trainingLapMs`, `trainingSectorMs` | o código do treino contínuo de `race-lap-validation` ainda não está na árvore: `src/lap.ts` não tem `listLapResults` nem os campos de treino, e o gatilho continua a fase `ENDED` (`src/main.ts:530-533`). Esta rodada implementou a parte desta feature: `recordLapResult` (`src/main.ts:289-300`) recebe um `LapResult` e não lê a fase; `buildLapRecord` copia o resultado inteiro, logo carrega os campos de treino quando existirem; os fins de volta no primeiro resultado (linha 12) | código de `race-lap-validation` (rodada seguinte) | open |
| W | DES-0004, Colaboradores ("deixa de importar … `WIDTH`") | `grassEntry` mantido (DES-0004) | `grassEntry` usa `WIDTH / 2` para pôr o kart ao lado da pista; `scripts/handlingBench.ts:12` continua importando `WIDTH` de `src/track.ts` só para isso, sem mudança de comportamento (`GRASS_LOSS` e a identidade do Realista dependem da mesma entrada) | — | resolved |

## Verificações reprovadas em `npx tsx --test tests/*.test.ts` (432 testes: 422 aprovados, 10 reprovados)

| Arquivo | Verificação | Motivo | Devedora |
|---|---|---|---|
| `tests/pista-kart-park-lap.test.ts`, `-feedback`, `-session`, `-determinism` | CHK-TEST-0005-01, -02, -03, -04, -06, -08, -10; CHK-TEST-0006-03; CHK-TEST-0007-05 | o piloto e o replay dessas verificações leem `PUBLISHED_SETUPS.ARCADE_ASSISTIDO.config`, hoje o acerto C (`arcade-assistido-v6`); FB-02 de `pista-kart-park/reports/feedbacks/dirigibilidade/feedback-20261030-1326.md` (ISSUE-09) | `pista-kart-park` |
| `tests/dirigibilidade-setup-version.test.ts` | CHK-TEST-0008-03 | AC-US-0005-05: a reprodução do replay da versão anterior com o acerto corrente (`arcade-assistido-v6`) não é aceita pela verificação; já reprovava antes desta rodada, que não toca a simulação nem `src/setupRecords.ts` | testes desta feature |

Nenhuma verificação de texto de `dirigibilidade` ou `race-lap-validation` que nomeie os elementos retirados (`#welcome`, `.control-hint`,
`.maneuver-guide`, `data-control="drift"`) reprova nesta rodada. As verificações de AC-US-0003-12 a -15 que `test-strategy` 6.1.0 pede
em `tests/dirigibilidade-hud-text.test.ts` ainda não existem (linha 14).
