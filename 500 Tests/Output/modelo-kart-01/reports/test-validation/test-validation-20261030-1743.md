---
stage: test
feature: modelo-kart-01
verdict: SUCCESS
generated: 2026-10-30T17:45:30Z
run: {collected: 443, passed: 443, failed: 0, skipped: 0, fresh: true}
counts: {blocker: 0, error: 0, warning: 2, info: 7, divergence: 24}
checks: {before: 64, after: 66, migrated: 4, removed: 0}
seed: {revision: 4, digest: 4e9bfbba6294}
round: 5
mode: B
previous-report: reports/test-validation/test-validation-20261030-1725.md
upstream: {strategy: test-strategy.md 1.6.0, code-report: code-validation-20261030-1655 (SUCCESS)}
run-artifacts: {junit: reports/junit-latest.xml, log: reports/npm-test-latest.log, measured: 2026-10-30T17:42:43Z, last-src-edit: src/main.ts 2026-10-30T16:46:48Z, last-test-edit: tests/modelo-kart-01-camera.test.ts 2026-10-30T17:38:11Z}
population: [ISSUE-01..14 do relatório anterior, TEST-0003 1.2.0, TEST-0004 1.4.0, 97-changelog (rodada 5), 98-divergences, tests/helpers/kart01Report.ts, tests/modelo-kart-01-camera.test.ts, tests/modelo-kart-01-contract.test.ts, TEST-0001 (não tocado, sorteado), tests/modelo-kart-01-model.test.ts (não tocado, sorteado)]
stamped: []
feedbacks: []
---

# Relatório de validação de testes — modelo-kart-01, rodada 5 (Modo B, seed rev 4)

## Verification status

- critérios do seed rev 4: 49 (42 AC + 7 NFR); verificados em `npm test`: 25; metade automatizável provada e metade de tela `unverified`: 20 (DIV-01..09, -11..-15, -18, -28..-32); só no aparelho: 4 (DIV-19..22); sem nenhuma verificação: 0; cobertos só por skip: 0
- níveis da estratégia: AC-US-0003-04 e AC-US-0003-14 com U, I e C (CHK-TEST-0003-04, -15, -16, -17, -18)
- execução: `ℹ tests 443 · pass 443 · fail 0 · skipped 0`; desta feature, por atributo `file`: `-model` 20, `-pose` 10, `-camera` 17, `-contract` 19 = 66, 0 `failure`, 0 `skipped`
- frescor: `junit-latest.xml` 17:42:43Z, posterior a `src/` (16:46:48Z) e `tests/` (17:38:11Z); `find src tests tracks scripts index.html package.json -newer junit-latest.xml` vazio; `src/`, `scripts/`, `tracks/` sem alteração local contra `HEAD`
- portão determinístico: `lint_artifacts.py --stage test` 0 erros, 0 avisos
- atrito: 64 → 66; modificadas 4 (0003-15, 0004-06, -19, -20) com linha de migração; novas 2 (0003-17, -18); nenhuma removida
- capacidade de falha: 9 tentativas em `reports/mutation-trials-20261030-r5.txt` (N07 é a refatoração neutra, que deve passar); reprodução independente em cópia no rascunho (junção e cópia removidas, árvore intacta): W1 (V3, `RACE_CHASE` na contagem do treino) reprova CHK-TEST-0003-15 e -18; W2 (V2, limite 6 em constante de módulo) 19/19 aprovadas; W3 (limite 0,055 em constante de módulo com 0,05) reprova CHK-TEST-0004-06 e -19; W4 (`import * as` de `./maneuvers` em `src/gameCamera.ts`) 17/17 aprovadas (ISSUE-15)
- marcas de pneu: o executor monta a pose como `src/main.ts` (`lap?.kart ?? idleKart`), põe no escopo as constantes numéricas de módulo e converte falha de extração ou execução numa única mensagem de forma; a varredura é preguiçosa e a falha atinge só CHK-TEST-0004-06, -19, -20
- carimbo: nenhum arquivo do estágio em `status: draft`; nada a carimbar

## Failures

Nenhuma.

## Issues

### ISSUE-15
- severity: warning
- check: T3
- status: new
- where: `tests/modelo-kart-01-camera.test.ts:408-410` CHK-TEST-0003-17
- defect: só importações com chaves (`import { … } from '…'`) são examinadas e o caminho precisa terminar em `maneuvers`; `import * as m from './maneuvers'` (W4), importação padrão, de efeito ou `./maneuvers.js` passam.
- expected: toda forma de importação de `src/gameCamera.ts` é examinada (o leitor de importações de NFR-0005 já conta a forma `.js`); não bloqueia.

### ISSUE-11
- severity: error
- check: T2
- status: closed
- where: CHK-TEST-0003-15 (modificada), -17, -18 (novas)
- defect: nível C de AC-US-0003-04 e AC-US-0003-14 sem verificação.
- expected: resolvido — as cinco afirmações de nível C existem; V3 reprova CHK-TEST-0003-15 e -18 (N01, W1).

### ISSUE-12
- severity: warning
- check: T3
- status: closed
- where: `tests/helpers/kart01Report.ts` `tyreMarkRunner`; `tests/modelo-kart-01-contract.test.ts` `lazySweep`
- defect: refatoração neutra derrubava o arquivo; pose sem `idleKart`.
- expected: resolvido — W2/N07 aprovadas, N09 reprova só as três verificações de marca com a mensagem de forma; a dependência do primeiro `if` que lê `lastSkidStepCount` foi declinada com motivo em `97-changelog.md`.

### ISSUE-14
- severity: info
- check: T2
- status: closed
- where: `98-divergences.md` linha 29
- defect: a interpretação citava só a pista sintética.
- expected: resolvido — velocidades do `TEST_PAD` registradas.

### ISSUE-13
- severity: info
- check: T3
- status: carried (declinado com motivo em `97-changelog.md`)
- where: CHK-TEST-0004-19
- defect: estado no limite exato forjado com `seedLap`, contra a estratégia linha 129.
- expected: interpretação registrada; manter.

### ISSUE-01
- severity: warning
- check: T3
- status: carried (CHK-TEST-0003-17/-18 acrescentam expressões sobre `src/gameCamera.ts` e `src/main.ts`, pedidas pela estratégia)
- where: `tests/modelo-kart-01-contract.test.ts` CHK-TEST-0004-01..04, -17, -18
- defect: as expressões regulares fixam o texto das fontes (I9).
- expected: manter as afirmações de ausência; afrouxar as que fixam nomes e forma; não bloqueia.

### ISSUE-02
- severity: info
- check: T3
- status: carried (inalterado; arquivo sorteado)
- where: `tests/modelo-kart-01-model.test.ts` CHK-TEST-0001-09
- defect: `meshCount === 27` e `drawCallCount === 27` além de `≤ 30`.
- expected: valor nomeado pela estratégia (D-TS-03); manter.

### ISSUE-03
- severity: info
- check: T3
- status: carried (inalterado; arquivo sorteado)
- where: `tests/modelo-kart-01-model.test.ts` CHK-TEST-0001-17
- defect: `steer.position.y ≈ diameterM / 2` compara duas leituras da mesma constante.
- expected: `min.y` decide o critério; nada a mudar.

### ISSUE-04
- severity: info
- check: T4
- status: carried (inalterado)
- where: CHK-TEST-0001-17; `98-divergences.md`, AC-US-0002-05
- defect: "`min.y` 0" lido ao centímetro.
- expected: interpretação registrada; nenhum feedback devido.

### ISSUE-05
- severity: info
- check: T3
- status: carried (inalterado)
- where: `tests/modelo-kart-01-camera.test.ts` CHK-TEST-0003-08
- defect: câmera rígida em relação ao kart; o laço repete uma configuração relativa.
- expected: a verificação pode falhar; nada a mudar.

### ISSUE-06
- severity: info
- check: T3
- status: carried (inalterado)
- where: `tests/modelo-kart-01-pose.test.ts:44` CHK-TEST-0002-02/-03
- defect: igualdade estrita de ponto flutuante `spinRevs === expectedSpinRevs`.
- expected: exata por construção; manter.

### ISSUE-07
- severity: info
- check: T1
- status: carried (aplicado nesta rodada)
- where: `reports/junit-latest.xml`
- defect: ids `CHK-TEST-00nn-nn` repetem-se entre features na mesma execução.
- expected: atrito contado pelo atributo `file` (20 + 10 + 17 + 19 = 66).

## Divergences

DIV-01..09, DIV-11..15, DIV-18..22 e DIV-28..32 carried, inalteradas (metade de tela ou aparelho, registro humano em `98-divergences.md`).
