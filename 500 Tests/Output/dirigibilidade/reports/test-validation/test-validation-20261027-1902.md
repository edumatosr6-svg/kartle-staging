---
stage: test
feature: dirigibilidade
verdict: SUCCESS
generated: 2026-10-27T19:02:14Z
run: {collected: 237, passed: 237, failed: 0, skipped: 0, fresh: true}
counts: {blocker: 0, error: 0, warning: 2, info: 4, divergence: 5}
checks: {before: 0, after: 65, migrated: 0, removed: 0}
seed: {revision: 3, digest: 7dd24c8b6cab}
round: 1
run-artifacts: {junit: reports/junit-latest.xml, log: reports/npm-test-latest.log, measured: 2026-10-27T15:57:03-03:00, last-input-edit: tests/fixtures/records.ts 2026-10-27T15:55:15-03:00}
population: [TEST-0001, TEST-0002, TEST-0003, TEST-0004, TEST-0005, TEST-0006, TEST-0007, TEST-0008, TEST-0009, TEST-0010, 97-changelog.md, 98-divergences.md, tests/dirigibilidade-*.test.ts, tests/helpers/handling.ts, tests/fixtures/records.ts]
feedbacks: []
---

# Relatório de validação de testes — dirigibilidade, rodada 1

## Verification status

- critérios: 41 (AC-US-0001-01..06, AC-US-0002-01..06, AC-US-0003-01..07, AC-US-0004-01..07, AC-US-0005-01..06, NFR-0001..0009)
- verificados em `npm test`: 36
- verificados na metade automatizável e `unverified` na metade de tela, aparelho ou relógio de parede: 5 — AC-US-0004-06 (quadros na tela e pausa: E2E-01), AC-US-0005-05 (exibição, troca de acerto e compartilhar: E2E-02), NFR-0002 (medida de relógio de parede na máquina de referência: bench), NFR-0003 (sensor de inclinação real: E2E-03), NFR-0004 (prosa datada: revisão de código)
- cobertos só por um skip: 0
- verificações desta feature: 65 declaradas em `tests/dirigibilidade-*.test.ts`, 65 presentes e executadas em `junit-latest.xml` (0 ausentes, 0 duplicadas); 172 de `physics`, `maneuvers` e `race-lap-validation-*` na mesma execução, todas aprovadas (NFR-0008)
- frescor: artefatos de 15:57:03 posteriores à última edição de `src/` (12:55), `scripts/` (15:17), `docs/physics.md` (15:19), `tests/` (15:55); nenhuma reexecução necessária
- DEC-14: CHK-TEST-0002-01 recomputa a maior sequência de `understeer` sobre o traço público até o primeiro passo na grama e exige igualdade com `maxUndersteerMs`; o traço real de `THROTTLE_ZERO` sai da faixa no passo 240 (61 passos na grama, 125 ms medidos contra 633 ms na janela inteira, mutação B do changelog), logo a janela de DEC-14 é exercitada e não vacuosa; `UNDERSTEER_ONSET` real: V0 50 km/h, V1 64,4 km/h (1,288 ×) pelo patamar interrompido (DEC-12), saída no passo 2114
- acerto exercitado: `options()` usa `PUBLISHED_SETUPS.ARCADE_ASSISTIDO` com `version: 'current'` (`setupConfig` → `ARCADE_ASSISTIDO_V5`, `scripts/handlingBench.ts:117`) e `trace()` usa `ARCADE_CONFIG = {...ARCADE_ASSISTIDO_V5, driverMass: 75}`
- limiares conferidos contra as histórias e `THRESHOLDS`: 180/250 ms, 200 ms, 1,15 × V0, 400 ms, 0,65 rad, 2 500 ms, 105 km/h, 70 %, 25 000 ms, 1,10 × custo — iguais aos critérios; pares de fronteira por `judge` em cada um
- tautologias: amostra de 24 verificações (pelo menos uma por registro e todas as que citam registro de ensaio); em cada uma há mudança no código que a reprova; as 4 mutações do changelog (A, B, C, D) cobrem 22 ids distintos
- atrito de verificações: nenhum relatório anterior; `before: 0, after: 65`; nada migrado, nada removido

## Failures

Nenhuma.

## Issues

### ISSUE-01
- severity: warning
- check: T3
- where: `tests/dirigibilidade-contract.test.ts` CHK-TEST-0010-02 (NFR-0002)
- defect: o par de fronteira 10,9 µs (PASS) / 11,5 µs (FAIL) contra linha de base 10 µs aceita qualquer `stepCostRatio` em [1,09; 1,15): um `judge` afrouxado para 12 % ou 14 % passa na verificação.
- expected: par justo (por exemplo linha de base 100 µs: 110 µs PASS e 110,01 µs FAIL) ou, como CHK-TEST-0009-02 faz com `lapTimeMs`, afirmar `THRESHOLDS.stepCostRatio === 1.10`.

### ISSUE-02
- severity: warning
- check: T3
- where: `tests/dirigibilidade-hud-text.test.ts` CHK-TEST-0007-01 e CHK-TEST-0007-04 (AC-US-0004-06, AC-US-0005-05)
- defect: as expressões regulares fixam o texto de `src/main.ts` (nomes de variáveis `compared`, `bestRecord`, `lastRecord`, `setup`, forma exata de `$('speed').textContent = Math.round(telemetry.speedMps * 3.6).toString()`): um refactor que preserva o comportamento reprova a verificação e a presença do texto não prova que o ramo executa (I9).
- expected: manter as afirmações estáveis (ids em `index.html`, tabela de rótulos com quatro textos, leitura por `getHandlingTelemetry`, uso de `compareLapRecords`, ausência de subtração entre tempos) e afrouxar as que fixam nomes e forma; a metade de tela de AC-US-0005-05 continua decidida por E2E-02, como `98-divergences.md` já registra.

### ISSUE-03
- severity: info
- check: T3
- where: `tests/dirigibilidade-rear.test.ts` CHK-TEST-0003-04, CHK-TEST-0003-05 (AC-US-0003-04, AC-US-0003-05)
- defect: o par de fronteira 0,66 rad contra 0,65 rad deixa 1,5 % de folga numa medida contínua; um `judge` em 0,655 rad passa.
- expected: 0,6500001 rad como caso FAIL ou `THRESHOLDS.maxSideslipRad === 0.65` afirmado.

### ISSUE-04
- severity: info
- check: T3
- where: `tests/dirigibilidade-contract.test.ts` CHK-TEST-0010-07 (AC-US-0005-06)
- defect: as mensagens de falha (`${r.benchId}: benchEnvironment` etc.) não nomeiam o critério decidido.
- expected: prefixo `AC-US-0005-06:` em cada mensagem, como nas demais verificações.

### ISSUE-05
- severity: info
- check: T2
- where: NFR-0002, `docs/physics.md` entrada `arcade-assistido-v5` (`STEP_COST` 220,37 µs contra 203,29 µs, 1,084 ×)
- defect: nenhuma verificação afirma o registro `STEP_COST` gravado da versão corrente (`baselineAvailable`, `verdict` PASS, razão ≤ `THRESHOLDS.stepCostRatio`); a medida manual fica sem guarda de regressão no `npm test`.
- expected: opcional — verificação sobre `readBaseline(loadBaselineText(), 'ARCADE_ASSISTIDO', ARCADE.setupVersion)` sem ler o relógio; a linha de NFR-0002 em `98-divergences.md` permanece.

### ISSUE-06
- severity: info
- check: T3
- where: `tests/dirigibilidade-telemetry.test.ts` CHK-TEST-0006-03 (AC-US-0004-05)
- defect: `assert.equal(after.speed, 0)` é igualdade de ponto flutuante sobre um valor calculado.
- expected: nenhuma ação enquanto `src/physics.ts:282` (restrição estática de repouso) zerar a velocidade explicitamente; se a restrição mudar, trocar por `near(after.speed, 0)`.

## Divergences

### DIV-01
- criterion: AC-US-0004-06 (quadros na tela em `web-desktop` e `web-mobile`, pausa)
- state: unverified na metade de tela
- verified by: CHK-TEST-0006-01, CHK-TEST-0007-01
- approval: `test-strategy.md` 5.1.0 define Web E2E e Mobile E2E como roteiro registrado (E2E-01); diretriz do estágio: verificações de aparelho, sensor e desempenho são manuais
- hides an automatable criterion: não

### DIV-02
- criterion: AC-US-0005-05 (exibição do resultado, troca de acerto, área de transferência e Web Share)
- state: unverified na metade de tela
- verified by: CHK-TEST-0007-02, CHK-TEST-0007-03, CHK-TEST-0007-04, CHK-TEST-0008-03
- approval: `test-strategy.md` 5.1.0, E2E-02
- hides an automatable criterion: não

### DIV-03
- criterion: NFR-0002 (custo por passo, relógio de parede na máquina de referência)
- state: unverified na medida
- verified by: CHK-TEST-0010-02 (regra de `judge` com valores constantes; linha de base com `runtimeId`)
- approval: diretriz do estágio (D-TS-04: nenhum relógio em `npm test`; RNF03 manual); medida gravada em `docs/physics.md` (1,084 ×)
- hides an automatable criterion: parcialmente — ver ISSUE-05 (guarda sobre o registro gravado), sem substituir a medida

### DIV-04
- criterion: NFR-0003 (sensor de inclinação real)
- state: unverified na metade do aparelho
- verified by: CHK-TEST-0001-07, CHK-TEST-0002-08, CHK-TEST-0003-08, CHK-TEST-0005-07, CHK-TEST-0009-06
- approval: `test-strategy.md` 5.1.0, E2E-03
- hides an automatable criterion: não

### DIV-05
- criterion: NFR-0004 (prosa datada de `docs/physics.md`)
- state: unverified na prosa
- verified by: CHK-TEST-0010-03 (bloco legível por máquina, três entradas, parâmetros, todos os ensaios, data presente)
- approval: `test-strategy.md` 5.1.0 ("a prosa datada é verificada na revisão da etapa de código")
- hides an automatable criterion: não

### DIV-NOTE
- severity: info
- where: `98-divergences.md` coluna "Quem deve" e `500 Tests/Input/domain-directives.md`
- defect: a diretriz do estágio manda registrar as medidas manuais (aparelho, navegador, versão, valor) em `500 Tests/Output/dirigibilidade/`; a estratégia e `98-divergences.md` apontam `docs/handling-device-log.md`.
- expected: o registro humano de E2E-01 a E2E-03 fica, ou é espelhado, em `500 Tests/Output/dirigibilidade/` para que `pipeline-progress` o encontre; decisão do dono do estágio, sem efeito neste veredito.
