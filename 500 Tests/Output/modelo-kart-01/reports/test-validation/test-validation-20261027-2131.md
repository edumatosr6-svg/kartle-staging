---
stage: test
feature: modelo-kart-01
verdict: SUCCESS
generated: 2026-10-27T21:35:21Z
run: {collected: 296, passed: 296, failed: 0, skipped: 0, fresh: true}
counts: {blocker: 0, error: 0, warning: 1, info: 7, divergence: 22}
checks: {before: 59, after: 59, migrated: 0, removed: 0}
seed: {revision: 1, digest: ef2fe14c9440}
round: 2
mode: B
previous-report: reports/test-validation/test-validation-20261027-2028.md
run-artifacts: {junit: reports/junit-latest.xml, log: reports/npm-test-latest.log, measured: 2026-10-27T18:29:23-03:00, last-input-edit: tests/modelo-kart-01-contract.test.ts 2026-10-27T18:28:10-03:00, last-src-edit: src/audio.ts 2026-10-27T18:09:57-03:00, baseline: tests/fixtures/kart01-sim-baseline.json 2026-10-27T16:18:01-03:00 (recordedOnCommit b86b200, não regravado)}
population: [ISSUE-01..07 do relatório anterior, TEST-0004 1.1.0, 97-changelog.md 1.1.0, 98-divergences.md 1.1.0, tests/helpers/kart01Report.ts, tests/modelo-kart-01-contract.test.ts, TEST-0003 (não tocado, sorteado), tests/modelo-kart-01-camera.test.ts (não tocado, sorteado)]
feedbacks: []
---

# Relatório de validação de testes — modelo-kart-01, rodada 2 (Modo B, CHK-TEST-0004-13)

## Verification status

- critérios: 47; verificados em `npm test`: 25; metade automatizável provada e metade de tela/aparelho/repositório `unverified`: 18 (DIV-01..18); decididos só no aparelho: 4 (DIV-19..22); cobertos só por um skip: 0 — mesma distribuição da rodada 1, nenhum critério mudou de coluna
- verificações desta feature: 59 declaradas (TEST-0001 19, TEST-0002 10, TEST-0003 14, TEST-0004 16), 59 presentes e executadas em `junit-latest.xml` por arquivo (`modelo-kart-01-model` 19, `-pose` 10, `-camera` 14, `-contract` 16, ids CHK-TEST-0004-01..16 todos presentes); contagem por arquivo, não pelo total do junit (ISSUE-07); `ℹ tests 296 · pass 296 · fail 0 · skipped 0`
- frescor: `junit-latest.xml` e `npm-test-latest.log` de 18:29:23, posteriores à última edição de `tests/` (18:28:10, `modelo-kart-01-contract.test.ts` e `helpers/kart01Report.ts`) e de `src/` (18:09:57, `audio.ts`); `find src tests tracks scripts index.html package.json -newer junit` vazio; nenhuma reexecução necessária
- flake: CHK-TEST-0004-13 reprovou na execução registrada pela etapa de código de `pista-kart-park` e passa agora após mudança de `tests/helpers/kart01Report.ts` — mudança de entrada entre as duas execuções, não flake
- atrito: 59 → 59 por arquivo; CHK-TEST-0004-13 `modified` com linha de migração em `97-changelog.md` (rodada 2); 0 migrados, 0 removidos; os 65 ids de `dirigibilidade` e os 140 de `race-lap-validation` continuam na execução
- CHK-TEST-0004-13 (DETERMINISM) contra DM-0001, DES-0006, REQ-FEAT-0006-07/-08: `recordedFieldsOf(recorded, current)` percorre só as chaves de `recorded` (recursivo em objetos; vetores pelo comprimento de `current`), devolve `current[key]` para cada uma (`undefined` quando ausente) e `runDiffers` compara a projeção com `run.finalKart` por `isDeepStrictEqual`; logo cada um dos 16 campos gravados de `finalKart` (inclusive `telemetry` com 11 campos e `wheels` de 4, e `maneuvers` com 9) continua comparado valor a valor, um campo gravado ausente difere e um vetor de outro comprimento difere; só `barrierTouching`/`barrierContact` (DES-0003 de `pista-kart-park`, sem valor gravado em `b86b200`) deixam de decidir — é o "campo a campo" de DM-0001, não rebaixamento; `lapValidity`, `lapMs`, `sectorMs` como antes
- capacidade de falha verificada por execução, não só por leitura: (1) na própria execução verde, `determinismCheck` sobre a linha de base com `finalKart.x` + 0,01 dá `NON_DETERMINISTIC` com `differingRunCount` 1 e com um campo gravado inexistente no estado (`recordedButGone`) idem — asserções executadas e aprovadas em `junit-latest.xml`; (2) cópia temporária no diretório de rascunho da sessão, mutação E (`clamp(input.throttle, 0, 0.8)` em `src/physics.ts:234`), `tests/modelo-kart-01-contract.test.ts`: 14 aprovadas, 2 reprovadas — CHK-TEST-0004-11 (`inputContractUnchanged` falso) e CHK-TEST-0004-13 (`differingRunCount` 2); (3) mesma cópia, `recordedFieldsOf` sem projeção (`return current`): CHK-TEST-0004-13 reprova (`differingRunCount` 2, os dois campos novos); (4) `recordedFieldsOf` tautológica (`return recorded`): CHK-TEST-0004-13 reprova em "a recorded field missing from the state differs"; cópia descartada, junção de `node_modules` removida, árvore do repositório intacta
- regravação declinada com motivo (`97-changelog.md`, "Por que (a)"): `setupVersion` `arcade-assistido-v5`/`realista-aluguel-4t-v4` e `trackVersion` 2 iguais aos gravados, fora da janela de DM-0001 ("outro acerto ou outra pista"); regravar sobre a árvore sem commit aceitaria a simulação corrente como referência sem sha — a projeção é a alternativa mais estrita das duas que `400 Code/Output/pista-kart-park/98-divergences.md` ofereceu; D-TS-07 respeitada (a verificação não foi enfraquecida: nenhum valor gravado deixou de decidir)
- D-TS-03: o esperado continua vindo do fixture gravado em `b86b200`, nunca da árvore corrente; D-TS-04: nenhum `Date`, `Math.random`, `setTimeout`, `performance` nos arquivos da população; D-TS-05: a verificação de determinismo permanece para a mudança da simulação feita por outra feature; D-TS-06: fixture sintético
- superfície congelada (conventions §16): registro `DETERMINISM` de API-0002 sem campo novo (`comparedRunCount`, `differingRunCount`), CHK-TEST-0004-16 continua conferindo campo a campo
- não tocados sorteados: TEST-0003 (14 linhas CHK-TEST-0003-01..14, ids iguais aos 14 `test(` de `tests/modelo-kart-01-camera.test.ts`, nenhuma coluna "o que a faria falhar" vazia); `tests/modelo-kart-01-camera.test.ts` (14 verificações, 0 asserções sem id de critério, 0 relógio/rede/ordem; igualdades `1.38`, `0.30`, `62` são constantes especificadas lidas pela saída de `computeCameraView`, como na rodada 1)
- T5: idempotência, RBAC, migração up/down e mobile offline não aplicáveis (API-0001..0003 sem endpoint, papel, webhook, banco ou árvore mobile), declinados com motivo em `97-changelog.md` (rodada 1), inalterado

## Failures

Nenhuma.

## Issues

### ISSUE-01
- severity: warning
- check: T3
- status: carried (rodada 1, inalterado)
- where: `tests/modelo-kart-01-contract.test.ts` CHK-TEST-0004-01..06 (15 `assert.match`/`doesNotMatch`)
- defect: as expressões regulares fixam o texto de `src/main.ts` e `src/kart01Decals.ts`; um refactor que preserva o comportamento reprova e a presença do texto não prova que o ramo executa (I9).
- expected: manter as afirmações estáveis (ausência de `skidClock`, `CylinderGeometry(0.31`, `SphereGeometry(0.36`, `helmet`, `box(kart`; presença das importações e de `buildKart01Model()`) e afrouxar as que fixam nomes e forma; a metade de comportamento segue em E2E-02/E2E-05; não bloqueia.

### ISSUE-02
- severity: info
- check: T3
- status: carried (inalterado)
- where: `tests/modelo-kart-01-model.test.ts:143-144` CHK-TEST-0001-09 (NFR-0004)
- defect: `meshCount === 27` e `drawCallCount === 27` além de `≤ 30` e `triangleCount === 5128`.
- expected: 27 é valor nomeado pela estratégia 1.3.0 (D-TS-03); manter.

### ISSUE-03
- severity: info
- check: T3
- status: carried (inalterado)
- where: `tests/modelo-kart-01-model.test.ts:246` CHK-TEST-0001-17 (AC-US-0002-05)
- defect: `steer.position.y ≈ diameterM / 2` compara duas leituras da mesma constante.
- expected: `toCm(min.y) === 0` e `min.y ≥ 0` (linha 244) decidem o critério; nada a mudar.

### ISSUE-04
- severity: info
- check: T4
- status: carried (inalterado)
- where: CHK-TEST-0001-17; `98-divergences.md`, AC-US-0002-05
- defect: "`min.y` 0" lido ao centímetro (`min.y` medido 0,0033 m, `LatheGeometry` de 14 segmentos sem vértice em −Y).
- expected: interpretação registrada em `98-divergences.md`; igualdade exata exige frase no D-Spec com perfil de pneu com vértice em −Y (dspec-loop); nenhum feedback devido.

### ISSUE-05
- severity: info
- check: T3
- status: carried (inalterado)
- where: `tests/modelo-kart-01-camera.test.ts` CHK-TEST-0003-08 (AC-US-0003-08)
- defect: câmera rígida em relação ao kart, logo o laço de 245 quadros repete uma configuração relativa.
- expected: a verificação pode falhar (pior canto |NDC| 0,68) e a ausência de suavização é decidida por CHK-TEST-0003-07; nada a mudar.

### ISSUE-06
- severity: info
- check: T3
- status: carried (inalterado)
- where: `tests/modelo-kart-01-pose.test.ts:44` CHK-TEST-0002-02/-03 (AC-US-0002-02)
- defect: igualdade estrita de ponto flutuante `spinRevs === expectedSpinRevs`.
- expected: exigida por API-0002 e estratégia 1.3.0, exata por construção (60 × STEP = 0,5), determinística (I8); quadros desiguais futuros comparam a 1e-12.

### ISSUE-07
- severity: info
- check: T1
- status: carried (aplicado nesta rodada)
- where: `reports/junit-latest.xml`
- defect: ids `CHK-TEST-00nn-nn` repetem-se entre features na mesma execução; sem o atributo `file`, a contagem mistura features.
- expected: atrito comparado por arquivo (`tests/modelo-kart-01-*.test.ts`: 19 + 10 + 14 + 16 = 59), como feito nesta rodada.

### ISSUE-08
- severity: info
- check: T3
- status: new
- where: `tests/helpers/kart01Report.ts:426-444` `recordedFieldsOf`/`runDiffers`; CHK-TEST-0004-13; DES-0006 linha "o `kart` final (`deepEqual`)"
- defect: um campo que qualquer feature acrescente ao `State` — inclusive esta, no futuro — nunca é comparado enquanto a linha de base de `b86b200` não for regravada; DES-0006 descreve "o `kart` final (`deepEqual`)" e a implementação faz `deepEqual` da projeção sobre os campos gravados.
- expected: aceitável nesta rodada — DM-0001 ("campo a campo, inclui `telemetry` e `maneuvers`") governa a comparação e cada valor gravado decide; um campo novo desta feature na simulação é decidido por `LAYERING`, `SIM_CONTRACT` e pela diferença de 0 linhas do manifesto de código (DIV-18); quando `pista-kart-park` for committed, a regravação com `--commit <sha>` passa a cobrir os dois campos novos (`recordedOnCommit` muda, valores iguais) e a próxima revisão de DES-0006 pode dizer "campos gravados"; nenhum feedback devido por este estágio.

## Divergences

Inalteradas desde a rodada 1 (estratégia 1.3.0, níveis web E2E e mobile E2E como roteiro E2E-01..06; manifesto de código, NFR-0006 linha 1); nenhuma contribui para o veredito (conventions §6); todas em `98-divergences.md` como `unverified`, devidas ao registro humano em `docs/kart-01/device-log.md`.

### DIV-01
- criterion: AC-US-0001-14
- proved: CHK-TEST-0004-01, CHK-TEST-0001-11
- unverified: Kart 01 em todo quadro na tela, após recarga e troca de orientação — E2E-01
- owed by: registro humano

### DIV-02
- criterion: AC-US-0001-15
- proved: CHK-TEST-0001-12, CHK-TEST-0004-02
- unverified: sombra vista no chão pela câmera de corrida — E2E-02
- owed by: registro humano

### DIV-03
- criterion: AC-US-0001-16
- proved: CHK-TEST-0001-13, CHK-TEST-0004-03
- unverified: número 01 legível na tela — E2E-02
- owed by: registro humano

### DIV-04
- criterion: AC-US-0002-01
- proved: CHK-TEST-0001-14, CHK-TEST-0002-01
- unverified: rodas dianteiras giradas vistas na tela — E2E-03
- owed by: registro humano

### DIV-05
- criterion: AC-US-0002-03
- proved: CHK-TEST-0001-15
- unverified: volante na tela — E2E-03
- owed by: registro humano

### DIV-06
- criterion: AC-US-0002-04
- proved: CHK-TEST-0001-16
- unverified: mãos no aro na tela — E2E-03
- owed by: registro humano

### DIV-07
- criterion: AC-US-0002-05
- proved: CHK-TEST-0001-17, CHK-TEST-0002-04, -05, -06, -07
- unverified: posição na tela, pausa (Esc, aba, sensor) e reposicionamento sem deslizamento — E2E-03
- owed by: registro humano

### DIV-08
- criterion: AC-US-0002-06
- proved: CHK-TEST-0001-18, CHK-TEST-0002-07, -08
- unverified: rumo na tela — E2E-03
- owed by: registro humano

### DIV-09
- criterion: AC-US-0003-08
- proved: CHK-TEST-0003-08
- unverified: curva vista na tela em paisagem e retrato — E2E-04
- owed by: registro humano

### DIV-10
- criterion: AC-US-0003-09
- proved: CHK-TEST-0003-09
- unverified: campo de visão abrindo e voltando na tela; troca de orientação com turbo — E2E-04
- owed by: registro humano

### DIV-11
- criterion: AC-US-0003-10
- proved: CHK-TEST-0003-10, CHK-TEST-0003-14
- unverified: pista inteira vista na tela; giro do celular na visão geral — E2E-01
- owed by: registro humano

### DIV-12
- criterion: AC-US-0003-11
- proved: CHK-TEST-0003-11
- unverified: descida observada na tela; pausa e suspensão na contagem — E2E-01
- owed by: registro humano

### DIV-13
- criterion: AC-US-0003-12
- proved: CHK-TEST-0003-12
- unverified: pose de corrida no quadro do verde, na tela — E2E-01
- owed by: registro humano

### DIV-14
- criterion: AC-US-0003-13
- proved: CHK-TEST-0003-01, -02, -03, -13, -14
- unverified: painel de resultado sobre a cena sem movê-la; "nova volta" — E2E-02
- owed by: registro humano

### DIV-15
- criterion: AC-US-0005-01
- proved: CHK-TEST-0002-09, -10, CHK-TEST-0004-04
- unverified: marca vista sob o pneu exibido; trechos antigos parados; nenhum trecho na pausa — E2E-05
- owed by: registro humano

### DIV-16
- criterion: AC-US-0005-02
- proved: CHK-TEST-0001-19, CHK-TEST-0004-05
- unverified: fumaça vista na ponteira — E2E-05
- owed by: registro humano

### DIV-17
- criterion: AC-US-0005-03
- proved: CHK-TEST-0004-06
- unverified: indicação de drift junto às rodas traseiras na tela — E2E-05
- owed by: registro humano

### DIV-18
- criterion: NFR-0006 (linha 1)
- proved: CHK-TEST-0004-11, CHK-TEST-0004-13 (contrato de passo e determinismo contra a linha de base de `b86b200`, campos gravados)
- unverified: 0 linhas alteradas em `src/physics.ts`, `src/lap.ts`, `src/track.ts` e nos presets por esta feature — diferença do repositório registrada pelo manifesto de código (D-CD-01); `npm test` não executa `git`; as linhas de `pista-kart-park` em `src/physics.ts` (DES-0003) pertencem àquela feature
- owed by: revisão de código

### DIV-19
- criterion: AC-US-0004-01
- proved: nenhuma verificação de `npm test` decide taxa de quadros (I9); custo limitado por CHK-TEST-0001-09
- unverified: ≥ 60 fps sustentados numa volta no notebook de referência — E2E-06
- owed by: registro humano

### DIV-20
- criterion: AC-US-0004-02
- proved: idem
- unverified: ≥ 30 fps no celular intermediário, paisagem e retrato — E2E-06
- owed by: registro humano

### DIV-21
- criterion: NFR-0001
- proved: nenhuma (I9)
- unverified: `fpsPerSecond` e `minFps` por aparelho e orientação — E2E-06
- owed by: registro humano

### DIV-22
- criterion: NFR-0002
- proved: nenhuma em `npm test`
- unverified: < 3 MB comprimidos numa primeira visita com cache vazio — E2E-06
- owed by: registro humano
