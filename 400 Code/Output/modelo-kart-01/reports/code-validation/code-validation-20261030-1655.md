---
stage: code
feature: modelo-kart-01
verdict: SUCCESS
generated: 2026-10-30T16:55:00Z
counts: {blocker: 0, error: 0, warning: 3, info: 4, divergence: 6}
seed: {revision: 4, digest: 4e9bfbba6294}
upstream: {stage: dspec, version: 1.6.0, report: dspec-validation-20261030-1413}
feedbacks: []
files_examined: 17
population: "re-validação (conventions §8) contra code-validation-20261027-1951: ISSUE-01 a ISSUE-04 re-verificados primeiro; registros com version movida: 01-implementation 1.2.0, 97-changelog 1.2.0, 98-divergences 2.0.0, web/DES-0001 1.2.0, web/DES-0003 2.0.0, web/DES-0004 1.1.0, web/DES-0005 2.0.0 (00-index e 99-traceability gerados pelo gate, não re-julgados); diff da rodada 3 em src/main.ts, src/gameCamera.ts, src/kart01Model.ts (git diff HEAD -- src); dois intocados sorteados (shuf): data/DM-0001, package.json; projeto: DES-0003 1.2.0, DES-0004 1.3.2, DES-0005 1.4.0, ADR-0003 1.3.0 decisão 6, DM-0001 1.3.0; portão: npx tsc --noEmit -p . saída 0; git diff HEAD vazio para src/physics.ts, src/lap.ts, src/track.ts, src/trackData.ts, src/maneuvers.ts, src/lapTiming.ts, src/kartPose.ts, src/kart01Decals.ts, package.json; fixture reduzido por script (schemaVersion 1, recordedOnCommit a361c9c, arcade-assistido-v6 e realista-aluguel-4t-v4, duas referenceRuns VALID); suíte não executada (skill), resultado do chamador 410/13 conferido contra 01-implementation rodada 3 e linhas 28 a 30"
context-ignored: "a invocação listou o que julgar e o resultado da suíte; cada ponto foi conferido na árvore e no projeto"
---

# Relatório de validação de código — modelo-kart-01 — 20261030-1655

## Summary

Verdict SUCCESS: nenhum blocker ou error; 3 warning (citações de linha e registro da linha de base desatualizados) e 4 info.
Situação de marca de pneu igual a REQ-FEAT-0005-11/-12 e DES-0005 1.4.0; turbo no FOV, jato e indicação de drift ausentes; 62°/retrato e `RACE_CHASE` por fase mantidos; `shapeVerticalFovDeg`; simulação intocada; tsc 0.

## Issues

### ISSUE-01
- severity: warning
- check: C10
- file: `400 Code/Output/modelo-kart-01/98-divergences.md`; `400 Code/Output/modelo-kart-01/01-implementation.md`
- location: 98-divergences.md linhas 8 (`src/gameCamera.ts:44-47`, `:94-100`, `:161-189`), 12 (`:62-70`, `:110-147`), 13 (`:54`, `:150-158`, `:177-181`); 01-implementation.md tabela "Arquivos tocados" (`src/kartPose.ts` "77 linhas")
- finding: persiste e cresce com a rodada 3: `src/gameCamera.ts` tem 178 linhas (constantes `:41-44`, `DESCENT_HOLD_MS` `:50`, `trackBoundsOf` `:58-66`, `raceChasePose` `:90`, `cornersFit` `:106`, `countdownDescentPose` `:146`, `computeCameraView` `:157-178`) e `src/kartPose.ts` 76; o código citado existe e faz o que cada linha exige.
- expected: citações das linhas 8, 12 e 13 nas posições da árvore da rodada 3 e "76 linhas" em 01-implementation.md.

### ISSUE-02
- severity: info
- check: C1
- file: `400 Code/Output/modelo-kart-01/web/DES-0001-modelo-kart-01-montagem-agrupamento-e-decalques.md`
- location: :41 ("`spin` — `<roda>Giro`")
- finding: persiste: o nó `spin` chama-se `<roda>MalhaGiro` (`src/kart01Model.ts` `buildWheel`); nenhum contrato depende do nome.
- expected: o registro nomeia `<roda>MalhaGiro`; sem efeito na verificação.

### ISSUE-03
- severity: info
- check: C2
- file: `src/kart01Model.ts`
- location: `buildWheel` (inalterado na rodada 3)
- finding: persiste: a caixa das quatro rodas tem `min.y` 0,0033 m e `test-strategy.md` AC-US-0002-05 (:108) ainda afirma `min.y` 0 em igualdade; o código realiza DES-0001.
- expected: sem ação no código; o estágio de testes afirma "rodas no chão" com a tolerância de RULE-0001.

### ISSUE-04
- severity: info
- check: C2
- file: `src/kartPose.ts`
- location: :36 (`export const WHEEL_NAMES`)
- finding: persiste: constante de ordem exportada fora da tabela de interface de DES-0002, sem comportamento próprio.
- expected: sem ação.

### ISSUE-05
- severity: warning
- check: C10
- file: `400 Code/Output/modelo-kart-01/98-divergences.md`; `400 Code/Output/modelo-kart-01/web/DES-0005-efeitos-presos-ao-kart.md`
- location: 98-divergences.md linha 16 (`src/main.ts:234` "`beginLap` sem `skidClock`") e linha 26 (`src/main.ts:577` "`pose` do `lap.kart` corrente"); web/DES-0005 linha REQ-FEAT-0005-07 (`beginLap` `:234`)
- finding: linhas reescritas nesta rodada citam posições erradas: `:234` está em `chooseTrack` (`beginLap` é `:307`, a limpeza das marcas `:314`) e `:577` é um `}` (a pose é `:566`); o código referido existe e faz o que as linhas exigem.
- expected: `src/main.ts:307-314` para `beginLap` e `:566` para a pose, em 98-divergences.md e web/DES-0005.

### ISSUE-06
- severity: warning
- check: C1
- file: `400 Code/Output/modelo-kart-01/data/DM-0001-linha-de-base-da-simulacao-e-registro-em-tela.md`; `400 Code/Output/modelo-kart-01/98-divergences.md`; `400 Code/Output/modelo-kart-01/97-changelog.md`
- location: DM-0001 :17, :35 (version 1.0.0); 98-divergences.md linhas 19 e 27; 97-changelog.md rodada 3 ("regravado com `arcade-assistido-v6` no commit `07b5cfa`")
- finding: o registro DM-0001 e a linha 19 descrevem o fixture `arcade-assistido-v5` de `recordedOnCommit` `b86b200`, mas a árvore tem `arcade-assistido-v6` com `recordedOnCommit` `a361c9c` (projeto DM-0001 1.3.0); o arquivo entrou no commit `fa8fe54`, e `07b5cfa`, citado na linha 27 e no changelog, não toca o fixture.
- expected: DM-0001 (registro) e linha 19 com o fixture v6 de `a361c9c`; linha 27 e changelog com o commit que gravou o arquivo (`fa8fe54`) ou só o relatório `test-validation-20261030-1453`.

### ISSUE-07
- severity: info
- check: C9
- file: `src/main.ts`
- location: antigos `:158` (`const reducedMotion`) e `:589` (`const tricks = state.maneuvers`) de HEAD
- finding: `const tricks` saiu, embora DES-0004 1.3.2 (linha 69) diga que fica para o HUD da manobra; em HEAD os únicos leitores de `tricks` (`:591`, `:595`, `:622`) e de `reducedMotion` (`:592`, `:622`) eram os que o projeto retira, logo nenhum comportamento muda; registrado em 98-divergences linha 24 e no changelog.
- expected: sem ação no código; a frase de DES-0004 sobre o HUD é do projeto.

## Divergences

- Linha 15 (REQ-FEAT-0004-01, -02, -05) — open: fps em aparelho; `docs/kart-01/device-log.md` presente com os campos não medidos.
- Linha 19 (REQ-FEAT-0005-05, -06) — open: registros do estágio de testes; leitura `simWheelGroundPositions` presente (texto do fixture desatualizado em ISSUE-06).
- Linha 20 (REQ-FEAT-0006-04, -05, -07, -08) — open: registros do estágio de testes; nenhum módulo da simulação importa `./kart01Model`, `./kart01Decals`, `./kartPose` ou `./gameCamera` (grep vazio); `src/gameCamera.ts` importa só `./lapTiming` e tipos; `src/kart01Model.ts` só `three`.
- Linha 28 (AC-US-0003-09 retirado) — open: `tests/modelo-kart-01-camera.test.ts` importa `baseVerticalFovDeg`, ausente de `src/gameCamera.ts` como DES-0003 1.2.0 (Retirada) exige; migração do estágio de testes.
- Linha 29 (AC-US-0005-02 retirado) — open: CHK-TEST-0001-19 e CHK-TEST-0004-05 fixam `anchors.exhaustOutlet` e o jato, retirados por REQ-FEAT-0005-10; estágio de testes.
- Linha 30 (AC-US-0005-03 retirado) — open: CHK-TEST-0004-06 fixa `tricks.drifting`, retirado por REQ-FEAT-0005-11/-12; estágio de testes.
- Linhas 16 e 22 a 27 — resolved: código conferido (ressalvas de localização em ISSUE-05 e de texto em ISSUE-06); linhas 11, 17, 18 — retired, requisitos fora do F-Spec e símbolos ausentes da árvore (grep vazio de `turbo`, `baseVerticalFovDeg`, `exhaustOutlet`, `escapamentoSaida`, `SKID_STEP_INTERVAL` em `src/` fora da simulação).

## Coverage

- Requisitos com código: REQ-FEAT-0005-11/-12 em `src/main.ts:582-608` (passo novo `:585`; `getLapState(lap).lapPhase === 'RUNNING'` `:587-588`; `getHandlingTelemetry(lap.kart, setupRef)` sem `code`, `speedMps > 6`, `sideslipRad > 0.055` estritos `:592-593`, `sideslipRad` já em módulo em `src/physics.ts:437`; nada desenhado sem passo novo, fora de `RUNNING` ou sem estado; sem `tricks`, `maneuvers`, `SKID_STEP_INTERVAL` nem filtros de distância; `previousSkids` em todo quadro com passo novo em `RUNNING` `:607`); DES-0005 1.4.0 Posicionamento diz "Nenhum módulo novo e nenhuma função nova" e ADR-0003 decisão 6.1 "Nenhum módulo, função, constante ou chave nova", o que sustenta a recusa de ISSUE-16 de `dspec-validation-20261030-1413`; REQ-FEAT-0005-09/-10 (jato, `exhaustOutlet`, `escapamentoSaida`, pulsação e `reducedMotion` ausentes; `anchors` = `{ bumperPlate }` em `src/kart01Model.ts:45`, `:534`); REQ-FEAT-0003-05 a -07, -17 (`shapeVerticalFovDeg` `src/gameCamera.ts:79` com 62° em paisagem e `max(62°, 60° horizontal)` em retrato; `verticalFovDeg: base` nos três modos `:169`, `:175`, `:177`; `CameraView` e `CameraFrameInputs` sem os campos retirados; `computeCameraView` chamado com cinco entradas `src/main.ts:613-615`; `applyCameraView` é o único escritor de `fov`); REQ-FEAT-0003-16 (`decideCameraMode` `:68-72` lê só `lapPhase`/`resumePhase`, `RACE_CHASE` em toda fase ativa fora da contagem); demais requisitos como em `code-validation-20261027-1951`, código inalterado; mapa de `REQ-*` de 99-traceability igual ao do projeto (65 ids).
- Requisitos sem código nesta etapa: REQ-FEAT-0004-01, -02, -05 (medição humana) e os registros de `npm test` das linhas 19, 20 e 28 a 30 (estágio de testes); as 13 reprovações informadas (pista-kart-park CHK-TEST-0005-01..04, -06, -08, -10, 0006-03, 0007-05; CHK-TEST-0001-19, 0004-05, 0004-06; `tests/modelo-kart-01-camera.test.ts` sem carregar) são exatamente as previstas; nenhuma outra a julgar.
- Arquivos alterados mas não registrados: nenhum (`git diff HEAD -- src` só em `src/main.ts`, `src/gameCamera.ts`, `src/kart01Model.ts`, todos no manifesto; `src/physics.ts` com presets e `Input`, `src/lap.ts`, `src/track.ts`, `tests/` e `package.json` sem diferença).
