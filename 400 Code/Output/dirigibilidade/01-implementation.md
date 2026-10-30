---
title: Registro de implementação — dirigibilidade do Arcade assistido
feature: dirigibilidade
stage: code
status: validated
version: 3.0.0
sources: []
---

# Registro de implementação

Rodada 5, Mode B (2026-10-30): o projeto revalidado de `300 Specs/330 D-Specs/Output/dirigibilidade/` (rodadas 10 e 11,
`dspec-validation-20261030-1333`, SUCCESS; F-Spec 4.0.1, seed `revision: 5`, `DOMAIN/DEC-15`, `DOMAIN/DEC-16`) foi aplicado sobre a
árvore da rodada 4: acerto C publicado como `arcade-assistido-v6`; drift e turbo fora do passo, com `State.maneuvers` e
`src/maneuvers.ts` na janela de compatibilidade de ADR-0006; pista de teste aberta (`testPadArea`); telemetria com posição e rumo, sem
`driftActive`; classificador de passo retirado; biblioteca de ensaios reescrita sobre API-0003 4.0.1 e RULE-0002 4.0.1; HUD, resultado e
texto compartilhado sem drift, turbo nem `setupVersion`; fim da volta e da reprodução no primeiro resultado. Os dois avisos do
relatório de validação foram honrados: `scripts/keyboard-lap.ts` muda em `measureStepCost` (fim no primeiro resultado) e o
tratamento de cada resultado na aplicação recebe um `LapResult` sem ler a fase. Nenhum arquivo de `tests/`, `package.json` ou
`tsconfig.json` foi tocado; nenhuma dependência acrescentada; `STEP`, `SOLVER_SUBSTEPS`, o solver, a linha de `Input`, a assinatura de
`step`, `RENTAL_KART`, `ARCADE_KART`, `ARCADE_ASSISTIDO_V5`, `KART_PRESETS` e a linha 3 de `src/physics.ts` inalterados. A prévia de
staging (`?acerto=`) não existe em `master` e não foi acrescentada.

## Arquivos tocados nesta rodada (D-CD-01)

| Arquivo | Situação | Camada | Itens de projeto |
|---|---|---|---|
| `src/physics.ts` | alterado: linha 2 (`import` só de `initialManeuvers` e `Maneuvers`), `ARCADE_ASSISTIDO_V6` (`:92-95`), `PUBLISHED_SETUPS` (`:106-107`), `testPadArea` (`:198-200`) no lugar de `testPadLane`/`testPadArc`, `integrate` e `step` sem a manobra, `HandlingTelemetry`/`getHandlingTelemetry` (`:424-440`), classificador de passo retirado | simulação | DES-0001, DES-0002, DM-0001 (M5), ADR-0006 |
| `scripts/handlingBench.ts` | reescrito (919 linhas) | simulação (papel `scripts/`) | DES-0004, DM-0001, ADR-0003, ADR-0004, ADR-0005 |
| `scripts/keyboard-lap.ts` | alterado num ponto (`measureStepCost`, `:33`) | aplicação (programa de bench) | DES-0004 |
| `src/setupRecords.ts` | alterado num ponto (`replayLap`, `:120-123`) | simulação | DES-0003 |
| `src/main.ts` | alterado: `import` de `./maneuvers` removido; laço de passos sem prêmio (`:512`); `recordLapResult` (`:289-300`) extraído do gatilho; `renderResult` sem a versão; escrita do HUD do drift removida | aplicação | DES-0005, DES-0006 |
| `src/handlingMessages.ts` | alterado em `formatSharedText` (`:9`) | aplicação | DES-0006, DES-0008 |
| `index.html` | alterado só por remoção (`.style-score`, `#lap-result-setup`, `#drift-hud`) | aplicação | DES-0005, DES-0006 |
| `src/style.css` | alterado só por remoção (regras do drift e do turbo) | aplicação | DES-0005 |
| `docs/physics.md` | alterado: seção datada `## Dirigibilidade — Arcade assistido v6`; bloco `handling-baseline` com v4 e Realista medidos de novo, v5 mantida, v6 acrescentada | registro | DM-0001 (M6), DES-0004 (NFR-0004) |

Inalterados: `src/maneuvers.ts` (janela de compatibilidade), `src/lap.ts`, `src/lapTiming.ts`, `src/track.ts`, `src/trackData.ts`,
`src/trainingSession.ts`, `src/audio.ts`, `scripts/physics-bench.ts`, `tests/*`.

## Portão determinístico desta rodada

| Passo | Resultado |
|---|---|
| prova dos invariantes de DES-0001 (script fora do repositório) | 72 000 passos, 0 estados diferentes da árvore anterior sem o comando de drift, 0 diferentes com e sem o comando |
| `npx tsc --noEmit -p .` | saída 0 |
| `npx vite build` | saída 0 |
| `npm run bench:physics` | saída 0; 10 registros `PASS` (`ACCELERATION` 2 208 ms, `TOP_SPEED` 19,25 m/s, `GRASS_LOSS`, `WALL_CONTACT`), nos dois modos |
| `npm run bench:handling -- --previous` / `-- --realista` | saída 0; 56 registros cada, gravados como linha de base (`arcade-assistido-v4`: 24 `PASS`, 32 `FAIL`, como esperado da versão anterior à feature) |
| `npm run bench:handling` | saída 0; 56 registros do `arcade-assistido-v6`, **56 `PASS`** (17 ensaios nos dois modos de `Input`) |
| `npx tsx --test tests/*.test.ts` | 370 testes: 350 aprovados, 20 reprovados — todos esperados e devidos às etapas de teste (`98-divergences.md`, "Verificações reprovadas") |
| `lint_artifacts.py --stage code --feature dirigibilidade --emit` | ver `97-changelog.md`, rodada 5 |

Registros de `npm run bench:handling` (v6, nos dois modos salvo indicação): `STEER_RESPONSE` ±1 108/58 ms, ±0,5 (`PROPORTIONAL`)
108/50 ms, velocidade 13,83–13,94 m/s; `CORNER_RADIUS` 11,67 m de 50 km/h e 11,77 m de 70 km/h (54,0 e 55,3 km/h aos 3 s,
`understeer` informativo); `CORNER_TURN` 3,637 rad (208,4°) em 2 s, `halfTurnReachedMs` 1 825; `NORMAL_DRIVING` 0 de 2 766 passos,
0,077 rad; `REAR_RECOVERY` `rearReleased` falso dos dois lados, `forcingMs` 3 000; `DRIFT_INERT` 0 de 3 126 (volta) e 0 de 360
(recuperação); `SPEED_CAP` 19,25 m/s = `TOP_SPEED` (`ACCELERATION`); `ACCELERATION` 2 208 ms; `TOP_SPEED` 19,25 m/s (69,3 km/h);
`GRASS_LOSS` 51 % e 55 %; `WALL_CONTACT` 832 contatos, 100 % com queda; `DETERMINISM` idêntico nos dois ambientes; `TEST_PILOT_LAP`
23 049 ms (6 331 / 6 271 / 5 682 / 4 765), 0 passos fora do asfalto, linha de base 26 703 ms; `STEP_COST` 181,3 µs contra 173,9 µs
(1,04 ×); `SETUP_VERSION` `arcade-assistido-v6` ≠ `arcade-assistido-v4`, 2/2; `STEP_CONTRACT` verdadeiro; `REALISTA_UNCHANGED` 0
medidas diferentes e 0 assistências nos dois ambientes. Nenhum passo fora da área declarada em ensaio algum.

## Rastreabilidade

A matriz `99-traceability.md` é gerada pelo gate a partir dos campos `sources` dos registros `core/`, `data/`, `web/` e `security/`;
cada registro nomeia, por `REQ-*`, o arquivo e o símbolo que o realiza. O índice `00-index.md` também é gerado. As linhas do registro
de divergências do projeto (4.0.0) e as dependências desta rodada estão em `98-divergences.md`. O histórico das rodadas 1 a 4 está em
`97-changelog.md`.
