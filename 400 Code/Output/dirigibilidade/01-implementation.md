---
title: Registro de implementação — dirigibilidade do Arcade assistido
feature: dirigibilidade
stage: code
status: draft
version: 2.0.0
sources: []
---

# Registro de implementação

Rodada 3, Mode C (2026-10-27): o projeto revalidado de `300 Specs/330 D-Specs/Output/dirigibilidade/` (rodada 8,
`dspec-validation-20261027-1531`; DES-0004 5.0.0, DES-0003 2.0.0, DM-0001 2.0.0, ADR-0003 1.4.0, ADR-0004 4.0.0, ADR-0005 1.2.0,
DES-0006 1.1.0, DES-0007 1.1.0) foi aplicado sobre a árvore da rodada 2: a resolução de SPEC-ISSUE-01 e SPEC-ISSUE-02 de
`feedback-20261022-1803.md` (`DOMAIN/DEC-12`, `DOMAIN/DEC-13`) em `scripts/handlingBench.ts`, e o FB-01 de `race-lap-validation`
(API-0001/API-0002 1.1.0 daquela feature) em `src/lap.ts`, `src/setupRecords.ts`, `src/main.ts`, `scripts/handlingBench.ts` e
`scripts/keyboard-lap.ts`. Nenhum arquivo de `tests/`, `package.json` ou `tsconfig.json` foi tocado; nenhuma dependência foi
acrescentada; `STEP`, `SOLVER_SUBSTEPS`, `Input`, a assinatura de `step`, `RENTAL_KART`, `ARCADE_KART` e `ARCADE_ASSISTIDO_V5`
inalterados. A ordem de construção foi a do projeto: dado (DM-0001 M4 em `src/lap.ts`), núcleo (DES-0003, DES-0004), aplicação
(DES-0007); o portão determinístico rodou ao fim.

Sob os vereditos de API-0003 3.3.0 o acerto entregue passa a atender `UNDERSTEER_ONSET` (fim natural com V1 = 64,4 km/h, a
velocidade mantida do patamar interrompido pela saída) e continua a atender os demais registros; não atende `REFERENCE_CORNER` com
acelerador 0, porque `maxUndersteerMs` passa a ser medido também nos 61 passos na grama depois da saída pelo lado interno, onde o
acerto assistido reporta `understeer` em todos os passos (633 ms). O retune com as alavancas de DES-0001 foi tentado (2 967 acertos
avaliados pela biblioteca, nenhum aprova os 15 registros) e mostrou que o limiar não é alcançável em conjunto com os demais; a
rodada termina **FAIL SPEC** com o feedback
`300 Specs/330 D-Specs/Output/dirigibilidade/reports/feedback/feedback-20261027-1619.md` (SPEC-ISSUE-03); o preset fica como está
e a implementação do projeto fica completa para a rodada seguinte.

## Arquivos tocados nesta rodada (D-CD-01)

| Arquivo | Situação | Camada | Itens de projeto |
|---|---|---|---|
| `scripts/handlingBench.ts` | alterado (`referenceCornerBench`, `v1FromCompletePlateau`, `understeerBaselineRecord`, `understeerOnset`, `judge`, linha `#` de `UNDERSTEER_ONSET`, pedido da volta de `testPilotLap`) | simulação (papel `scripts/`) | DES-0004, DM-0001, DES-0003 |
| `src/lap.ts` | alterado só nos campos copiados (`LapRequest`, `LapSession`, `LapResult`, `startLap`, `buildResult`) | simulação (módulo de `race-lap-validation`) | DES-0003, DM-0001 (M4) |
| `src/setupRecords.ts` | alterado (`buildLapRecord`, pedido de `replayLap`) | simulação | DES-0003, DM-0001 (M4) |
| `src/main.ts` | alterado num ponto (`beginLap`) | aplicação | DES-0007; DES-0006 (leitura de `buildLapRecord`) |
| `scripts/keyboard-lap.ts` | alterado num ponto (`measureStepCost`) | aplicação (programa de bench) | DES-0004 |
| `docs/physics.md` | alterado (entrada `arcade-assistido-v5` do bloco refeita em 2026-10-27; prosa da seção datada) | registro | DM-0001 (M3), DES-0004 (NFR-0004) |

Inalterados nesta rodada: `src/physics.ts` (`ARCADE_ASSISTIDO_V5`, `handling()`, assistências, pista de teste, classificador),
`scripts/physics-bench.ts`, `src/handlingMessages.ts`, `index.html`, `src/lapTiming.ts`, `src/track.ts`, `src/trackData.ts`,
`src/maneuvers.ts`, `src/lapMessages.ts`, `src/frameClock.ts`, `src/audio.ts`, `src/style.css`, `tests/*`. A tabela de arquivos
da rodada 2 está em `97-changelog.md`.

## Portão determinístico desta rodada

| Passo | Resultado |
|---|---|
| `npx tsc --noEmit` | saída 0 |
| `npm test` | saída 0; 170 testes, 170 aprovados, 0 reprovados (`race-lap-validation` 100 % verde com os campos opcionais em `src/lap.ts`; `CHK-TEST-0012-02` continua verde porque as suas voltas são iniciadas sem eles) |
| `npm run build` | saída 0 |
| `npm run bench:physics` | saída 0; 10 registros `PASS` (`ACCELERATION` 2 383 ms, `TOP_SPEED` 30,61 m/s, `GRASS_LOSS` 14,68 e 7,66 m/s após 1 s, `WALL_CONTACT` depois < antes), nos dois modos |
| `npm run bench:handling` | saída 0; 46 registros do `arcade-assistido-v5` (entrada do bloco refeita): 44 `PASS`, 2 `FAIL` (`REFERENCE_CORNER` acelerador 0 `THRESHOLD_EXCEEDED`, nos dois modos) |
| `lint_artifacts.py --stage code --emit` | saída 0 |

Registros de `npm run bench:handling`, nos dois modos de `Input` salvo indicação: `STEER_RESPONSE` ±1 `PASS` 117/58 ms e ±0,5
(`PROPORTIONAL`) `PASS` 108/50 ms; `REFERENCE_CORNER` acelerador 0 `FAIL` `THRESHOLD_EXCEEDED` (633 ms, saída no passo 240, 61 passos
fora da faixa); `REFERENCE_CORNER` acelerador cheio `PASS` (0 ms, 0 `oversteer`/`sliding`, na faixa); `UNDERSTEER_ONSET` `PASS`
(V0 13,889 m/s, V1 17,889 m/s = 64,4 km/h do patamar interrompido, 7 pares com 0 ms, saída a 56,08 km/h no passo 2 114);
`NORMAL_DRIVING` `PASS` nos dois ambientes (0 `oversteer`, deriva 0,054/0,059 rad, 767/1 953 passos, 1/0 de recuperação excluídos);
`REAR_RECOVERY` `PASS` (8 ms, 0,064 rad, na faixa); `DRIFT_MANEUVER` `PASS` (200 pontos); `ACCELERATION` `PASS` (2 383 ms);
`TOP_SPEED` `PASS` (110,2 km/h); `GRASS_LOSS` `PASS` (48 % e 55 %); `WALL_CONTACT` `PASS`; `DETERMINISM` `PASS` nos dois ambientes;
`TEST_PILOT_LAP` `PASS` (21 340 ms, 0 passos fora do asfalto; linha de base 26 703 ms); `STEP_COST` `PASS` (196,7 µs contra
203,3 µs); `SETUP_VERSION` `PASS`; `STEP_CONTRACT` `PASS`; `REALISTA_UNCHANGED` `PASS` nos dois ambientes (0 medidas diferentes,
0 assistências).

## Rastreabilidade

A matriz `99-traceability.md` é gerada pelo gate a partir dos campos `sources` dos registros `core/`, `data/`, `web/` e `security/`;
cada registro nomeia, por `REQ-*`, o arquivo e o símbolo que o realiza. O índice `00-index.md` também é gerado. As divergências
herdadas do D-Spec 3.0.0 estão em `98-divergences.md`: das 4 linhas abertas do projeto, 2 resolvidas nesta rodada com
`arquivo:linha` e 2 `open` com o motivo; as 16 linhas resolvidas pela rodada 2 são recitadas com o `arquivo:linha` de hoje.
