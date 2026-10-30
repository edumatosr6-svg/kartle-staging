---
stage: test
feature: dirigibilidade
verdict: SUCCESS
generated: 2026-10-30T14:55:35Z
run: {collected: 393, passed: 386, failed: 7, skipped: 0, fresh: true}
feature-run: {collected: 61, passed: 61, failed: 0, skipped: 0}
counts: {blocker: 0, error: 0, warning: 2, info: 8, divergence: 8}
checks: {before: 65, after: 61, migrated: 0, removed: 14}
seed: {revision: 5, digest: 48feb6d51bf8}
upstream: {stage: code, version: 3.0.0}
round: 2
previous: reports/test-validation/test-validation-20261027-1902.md
run-artifacts: {junit: reports/junit-latest.xml, log: reports/npm-test-latest.log, measured: 2026-10-30T11:50:11-03:00, last-input-edit: src/main.ts 2026-10-30T11:02:11-03:00, tests 11:43:04, scripts 10:51:48, index.html 10:52:45, docs/physics.md 10:57:13}
population: [ISSUE-01..06 da rodada 1, TEST-0001, TEST-0002, TEST-0003, TEST-0005, TEST-0006, TEST-0007, TEST-0008, TEST-0009, TEST-0010, 97-changelog.md, 98-divergences.md (todos com version movida), CHK acrescentadas 0002-09/-10/-11, 0003-09/-10, 0006-05, 0007-05/-06, 0008-08, 0010-08, as 14 retiradas]
feedbacks: []
---

# Relatório de validação de testes — dirigibilidade, rodada 2

## Verification status

- critérios: 42 (33 AC de US-0001..US-0005 em vigor no seed rev 5 + NFR-0001..0009); retirados e não contados: AC-US-0002-01..04, -06; AC-US-0003-02, -06
- verificados em `npm test`: 34; verificados na metade automatizável e `unverified` na metade de tela, aparelho ou relógio: 8 (DIV-01..08); cobertos só por skip: 0; sem verificação: 0
- execução: 393 coletadas, 386 aprovadas, 7 reprovadas, 0 puladas (`ℹ tests 393 / pass 386 / fail 7`); as 61 de `tests/dirigibilidade-*.test.ts` presentes, únicas e aprovadas; `physics`, `maneuvers` (8), `race-lap-validation-*` e `pista-kart-park-*` aprovadas (NFR-0008); as 7 reprovadas são `tests/modelo-kart-01-contract.test.ts` CHK-TEST-0004-09, -11..-16, fora desta feature (ISSUE-10)
- frescor: artefatos de 11:50:11 posteriores à última edição de `src/`, `scripts/`, `index.html`, `docs/physics.md` e de todo arquivo de teste desta feature; único arquivo posterior: `tests/fixtures/kart01-sim-baseline.json` (11:51:27), lido só por `modelo-kart-01` (ISSUE-10); sem reexecução
- rastreabilidade: os 33 AC e 9 NFR com linha em `99-traceability.md`; 61 ids na rastreabilidade = 61 ids executados, nenhum pendente nos dois sentidos
- atrito: 65 → 61; 14 removidas (CHK-TEST-0002-01..05, -07; CHK-TEST-0003-02, -06; CHK-TEST-0004-01..06), 10 acrescentadas, 0 renomeadas; cada removida decide um critério retirado (US-0002 "Numeração": 01–04 e 06; US-0003 "Numeração": 02 e 06); aprovação: entrada de 2026-10-29 de `200 Requirements/220 Input/dirigibilidade/DOMAIN.md` ("Acerto C e fim do drift e do turbo (Eduardo Matos)"), rotulada `DOMAIN/DEC-15` em `230 Output/dirigibilidade/01-context.md:137` (o `DOMAIN.md` não numera as entradas), e tabela "Verificações existentes" de `test-strategy.md` 6.0.0; o teste sem id de `tests/maneuvers.test.ts` ("player-induced drift…") retirado pela mesma aprovação, nomeado na mesma tabela
- limiares conferidos contra os critérios: 13 m (par 13,0/13,01), 180° em 2 000 ms (par 2 000/2 009 ms), 400 ms (400/404), 0,65 rad, 65–72 km/h (18,05/18,056 e 20,0/20,01 m/s), 2 500 ms, 25 000 ms, 180/250 ms, 70 %
- medem a simulação: cada limiar novo é julgado sobre traço conduzido pelo próprio teste com `step`/`getHandlingTelemetry` ou `startLap`/`stepLap` (raio por velocidade e por posições da janela 349–372; giro acumulado passo a passo; reta refeita; volta até o primeiro resultado; estados com e sem o comando de drift) e só depois comparado ao registro; medidas desta execução: raio 11,67 m (50 km/h) e 11,76 m (70 km/h), 180° aos 1 825 ms (208° aos 2 s), velocidade estabilizada 69,3 km/h; CHK-TEST-0007-06 e CHK-TEST-0010-08 são verificações de texto-fonte prescritas pela estratégia (nível contrato), com o comportamento decidido em tempo de execução por CHK-TEST-0003-09, -0006-05, -0008-08
- reprovabilidade: 19 mutações registradas no changelog derrubam todas as acrescentadas e modificadas, salvo CHK-TEST-0005-01, -03, CHK-TEST-0008-02, -05; as quatro podem reprovar (ISSUE-09)

## Failures

Nenhuma desta feature. As 7 reprovações da execução pertencem a `modelo-kart-01` (ISSUE-10).

## Issues

### ISSUE-01
- severity: warning
- check: T3
- where: `tests/dirigibilidade-contract.test.ts:49-52` CHK-TEST-0010-02 (NFR-0002)
- defect: aberto desde a rodada 1; o par 10,9 µs PASS / 11,5 µs FAIL contra 10 µs aceita um `judge` afrouxado até 14 %.
- expected: par justo (por exemplo 11,0 PASS e 11,01 FAIL) ou `THRESHOLDS.stepCostRatio === 1.10` afirmado.

### ISSUE-02
- severity: warning
- check: T3
- where: `tests/dirigibilidade-hud-text.test.ts` CHK-TEST-0007-01, CHK-TEST-0007-04 (AC-US-0004-06, AC-US-0005-05)
- defect: aberto desde a rodada 1; as expressões regulares fixam nomes de variáveis e a forma exata das linhas de `src/main.ts` (I9).
- expected: manter as afirmações estáveis (ids, tabela de rótulos, uso de `getHandlingTelemetry` e `compareLapRecords`, ausência de subtração) e afrouxar as que fixam forma.

### ISSUE-03
- severity: info
- check: T3
- where: `tests/dirigibilidade-rear.test.ts` CHK-TEST-0003-04, CHK-TEST-0003-05
- defect: aberto desde a rodada 1; 0,65 PASS / 0,66 FAIL deixa folga de 1,5 % (um `judge` em 0,655 passa).
- expected: 0,6500001 rad como caso FAIL ou `THRESHOLDS.maxSideslipRad === 0.65` afirmado.

### ISSUE-04
- severity: info
- check: T3
- where: `tests/dirigibilidade-contract.test.ts:173-178` CHK-TEST-0010-07 (AC-US-0005-06)
- defect: aberto desde a rodada 1; as mensagens do laço de campos comuns (`${r.benchId}: benchEnvironment` etc.) não nomeiam o critério.
- expected: prefixo `AC-US-0005-06:` nessas mensagens.

### ISSUE-05
- severity: info
- check: T2
- where: NFR-0002, entrada `arcade-assistido-v6` de `docs/physics.md`
- defect: aberto desde a rodada 1; nenhuma verificação afirma o registro `STEP_COST` gravado da versão corrente.
- expected: opcional — verificação sobre a linha de base real sem ler o relógio; DIV-06 permanece.

### ISSUE-06
- severity: info
- check: T3
- where: `tests/dirigibilidade-telemetry.test.ts:81` CHK-TEST-0006-03
- defect: aberto desde a rodada 1; `assert.equal(after.speed, 0)` é igualdade de ponto flutuante.
- expected: sem ação enquanto a restrição estática de repouso zerar a velocidade explicitamente; senão `near(after.speed, 0)`.

### ISSUE-07
- severity: info
- check: T2
- where: `index.html:19` (boas-vindas: "encaixe o drift e solte para dar o impulso", "Espaço + curva para drift"), `index.html:32` (barra de ferramentas, visível durante a volta: "Espaço: drift → turbo"), `index.html:33` (`maneuver-guide`, visível durante a volta: "Como fazer drift", "turbo e pontos de estilo"), `index.html:30` (botão de toque "Drift")
- defect: a página ensina o drift, o turbo e os pontos de estilo retirados por `DOMAIN/DEC-15`; fora dos critérios: AC-US-0003-09 restringe a ausência ao HUD durante a volta e à tela de resultado, o seed (Restrições) enumera "HUD, resultado e texto compartilhado", AC-US-0003-11/AC-US-0005-07 decidem `formatSharedText`, e o botão de drift é mantido sem efeito pelo E2E-01; o registro do gerador em `98-divergences.md` omite a linha 32 e a 30.
- expected: decisão do dono do produto (revisão do seed com critério novo, se a retirada incluir o texto de instrução); sem efeito neste veredito; `98-divergences.md` acrescenta as linhas 30 e 32 na próxima rodada.

### ISSUE-08
- severity: info
- check: T3
- where: CHK-TEST-0003-03, CHK-TEST-0003-04 (AC-US-0003-03, AC-US-0003-04)
- defect: com `arcade-assistido-v6` a traseira não solta em 3 000 ms de forçar (`rearReleased: false` nos dois lados e modos); o ramo que mede a recuperação ≤ 400 ms e ≤ 0,65 rad só executa sob as mutações M7/M8, como o caso anormal de US-0003 autoriza.
- expected: nenhuma ação deste estágio; a sensação de "traseira viva" fica para a rodada de teste do dono do produto (OPEN-08).

### ISSUE-09
- severity: info
- check: T3
- where: CHK-TEST-0005-01, CHK-TEST-0005-03, CHK-TEST-0008-02, CHK-TEST-0008-05 (não derrubadas pelas 19 mutações)
- defect: nenhum defeito; as quatro podem reprovar: 0005-01 com força de motor menor ou `governorSpeed` abaixo de 16,67 m/s (0–60 > 2 500 ms ou 60 km/h nunca atingido na reta refeita); 0005-03 com arrasto de grama menor (velocidade após 120 passos > 70 % da entrada, recomputada no traço); 0008-02 se `startLap` deixar de copiar ou passar a inventar `setupId`/`setupVersion` ou se `buildLapRecord` sobrescrever; 0008-05 se `readReplay` recusar o replay v4 ou `stepLap` não aplicar um passo por entrada — esta última é fraca (não exige resultado da volta) e AC-US-0005-06 é decidido principalmente por CHK-TEST-0010-01.
- expected: opcional — uma mutação de motor e uma de grama no registro da próxima rodada; em 0008-05, exigir resultado ou `applied === replay.inputs.length`.

### ISSUE-10
- severity: info
- check: T1, T4
- where: `tests/modelo-kart-01-contract.test.ts` CHK-TEST-0004-09, -11..-16; `tests/fixtures/kart01-sim-baseline.json` (mtime 11:51:27, após a execução)
- defect: 7 reprovações de outra feature (linha de base chaveada em `arcade-assistido-v5`, FB-02 de `modelo-kart-01`); contadas fora; o fixture daquela feature mudou depois da execução, então o estado dessas 7 nesta árvore não é conhecido.
- expected: devidas ao estágio de testes de `modelo-kart-01`; nenhuma suíte desta feature lê o fixture, logo o frescor desta feature não muda.

## Divergences

### DIV-01
- criterion: AC-US-0003-09 (sem indicador de drift, turbo, combo ou pontuação no HUD e no resultado, desktop e celular)
- state: unverified na metade de tela
- verified by: CHK-TEST-0007-06, CHK-TEST-0003-09, CHK-TEST-0010-08
- approval: `test-strategy.md` 6.0.0, E2E-01 e E2E-02 (roteiro registrado); `docs/handling-device-log.md` ainda não existe
- hides an automatable criterion: não

### DIV-02
- criterion: AC-US-0003-11 (texto compartilhado sem drift, turbo, combo ou pontuação)
- state: unverified no compartilhar real
- verified by: CHK-TEST-0007-05
- approval: `test-strategy.md` 6.0.0, E2E-02
- hides an automatable criterion: não

### DIV-03
- criterion: AC-US-0004-06 (HUD em todos os quadros, pausa)
- state: unverified na metade de tela
- verified by: CHK-TEST-0006-01, CHK-TEST-0007-01
- approval: `test-strategy.md` 6.0.0, E2E-01
- hides an automatable criterion: não

### DIV-04
- criterion: AC-US-0005-05 (resultado sem versão do acerto, melhor tempo só comparável)
- state: unverified na metade de tela
- verified by: CHK-TEST-0007-03, CHK-TEST-0007-04, CHK-TEST-0008-03
- approval: `test-strategy.md` 6.0.0, E2E-02
- hides an automatable criterion: não

### DIV-05
- criterion: AC-US-0005-07 (texto compartilhado com um tempo, sem diferença)
- state: unverified no compartilhar real
- verified by: CHK-TEST-0007-02
- approval: `test-strategy.md` 6.0.0, E2E-02
- hides an automatable criterion: não

### DIV-06
- criterion: NFR-0002 (custo por passo, relógio de parede)
- state: unverified na medida
- verified by: CHK-TEST-0010-02
- approval: D-TS-04 e estratégia (relógio só nos benches); medida da etapa de código 181,3 µs contra 173,9 µs (1,04 ×)
- hides an automatable criterion: parcialmente — ISSUE-05

### DIV-07
- criterion: NFR-0003 (sensor de inclinação real)
- state: unverified na metade do aparelho
- verified by: CHK-TEST-0001-07, CHK-TEST-0002-08, CHK-TEST-0003-08, CHK-TEST-0005-07, CHK-TEST-0009-06
- approval: `test-strategy.md` 6.0.0, E2E-03
- hides an automatable criterion: não

### DIV-08
- criterion: NFR-0004 (prosa datada de `docs/physics.md`)
- state: unverified na prosa
- verified by: CHK-TEST-0010-03
- approval: `test-strategy.md` 6.0.0 (prosa lida na revisão da etapa de código)
- hides an automatable criterion: não
