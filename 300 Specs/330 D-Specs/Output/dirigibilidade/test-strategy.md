---
title: Estratégia de testes — dirigibilidade do Arcade assistido
feature: dirigibilidade
stage: dspec
status: validated
version: 6.1.0
sources: []
---

# Estratégia de testes

Prova é verificação determinística em `npm test` (node:test via tsx), avançando a simulação com `STEP`, nunca
medida contra o relógio de parede (I9); o custo por passo é a única medida de parede e fica nos benches. O que
depende de tela, de sensor ou de aparelho só se prova em teste registrado, em `docs/handling-device-log.md`
(**novo**, criado pela etapa de testes no molde de `docs/lap-validation-bench.md` de `race-lap-validation`), e
uma execução em desktop não vale para celular. O projeto não tem ferramenta de teste de ponta a ponta e esta
feature não acrescenta dependência: "web E2E" e "mobile E2E" são o roteiro registrado abaixo, `E2E-nn`.
Nenhum teste usa configuração, ponto de entrada ou gancho criado só para testar: os testes chegam ao
comportamento por `step`/`getHandlingTelemetry`/`testPadArea` (`src/physics.ts`),
`startLap`/`stepLap`/`getLapResult` (`src/lap.ts`), `src/setupRecords.ts`, `src/handlingMessages.ts`, pela
biblioteca de ensaios `scripts/handlingBench.ts` (a mesma dos benches), por estados iniciais colocados pelas
operações públicas e por fixtures de registro. A pista de teste aberta e a pista sintética são os ambientes que o
F-Spec declara para cada ensaio (RULE-0002), não ambientes de teste.

**Fim de uma volta nos testes.** Toda verificação que percorre uma volta até o fim — volta do piloto de teste,
reprodução de replay, leitura do HUD "até o fim da volta" — para no **primeiro passo em que `getLapResult`
devolve um resultado**, nunca na fase `ENDED`: pelo D-Spec de `race-lap-validation` (treino como sequência de
voltas, rodada de 2026-10-30), uma volta `TRAINING` produz o resultado na chegada com a fase em `RUNNING` e só
chega a `ENDED` por `endTraining`; na árvore corrente os dois instantes coincidem, de modo que a mesma
verificação vale antes e depois daquela mudança (FB-01 de `reports/feedbacks/race-lap-validation/feedback-20261030-1256.md`).
O auxiliar `untilFirstResult(lap, controller, maxSteps)` em `tests/helpers/handling.ts` (**muda**) encapsula
essa condição.

## Níveis

| Nível | Onde roda | O que cobre |
|---|---|---|
| Unitário | `npm test` | funções puras: `getHandlingTelemetry`, `testPadArea`, `getSetupVersion`, `resolveSetupRef`, `readReplay`, `compareLapRecords`, `buildLapRecord`, `buildReplayRecord`, `readBaseline`, `baselineRecord`, `judge` (sobre registros sintéticos), `serialize`, `formatSharedText`, `shareLabel` |
| Integração | `npm test` | os ensaios de RULE-0002 sobre a física real, na pista de teste aberta e na pista sintética, via `scripts/handlingBench.ts`; a volta do piloto de teste por `src/lap.ts`; `replayLap`; a recuperação com acelerador e esterço zerados juntos por `step` |
| Contrato | `npm test` | forma e unidades de API-0001 2.0.0, API-0002 1.2.0 e API-0003 4.0.1 campo a campo (inclusive `benchEnvironment` e os campos da área em todo registro `TEST_PAD`, e a ausência dos `benchId` e campos retirados); códigos de rejeição; `STEP_CONTRACT`; `REALISTA_UNCHANGED`; presets congelados; camada e símbolos proibidos; ausência por texto dos elementos de drift, turbo e versão na tela |
| Bench | `npm run bench:handling`, `npm run bench:physics` | os mesmos registros mais `STEP_COST`; produção das linhas de base (`--previous`, `--realista`) |
| Web E2E | roteiro registrado em Chrome, Edge, Firefox e Safari atuais, `web-desktop` | HUD em todos os quadros sem indicador de drift ou turbo; resultado sem versão do acerto; melhor tempo só comparável; texto compartilhado; tela inicial, dica da barra de ferramentas e guia de manobras sem drift nem turbo |
| Mobile E2E | roteiro registrado em celular intermediário de referência, `web-mobile` | inclinação proporcional e toque com o mesmo HUD; controle de toque sem o botão "Drift", com o sensor ativo e no recuo para toque; tela inicial e guia sem drift nem turbo; compartilhar pela Web Share API |

## Fixtures e como chegar a cada estado

| Fixture | O que é | Estado a que dá acesso |
|---|---|---|
| `straight(v)` em `scripts/handlingBench.ts` | `{...initialState(), x: 0, z: 0, heading: 0, vx: 0, vz: v, speed: v}`: a partida, no centro da área declarada | partida em linha reta a 50 km/h, 70 km/h, 60,1 km/h (`forcingSpeedMps`) ou do repouso |
| `testPadArea(r)` (`src/physics.ts`) | disco de asfalto de raio `r` centrado na origem | `ASPHALT` dentro, `GRASS` fora; `wallContact` sempre falso; a saída da área |
| `testPadArea(1)` | o mesmo disco com 1 m de raio, chamado pelo teste com `step` | a transição `ASPHALT` → `GRASS` da telemetria na borda da área em poucos passos; o veredito `TEST_AREA_EXCEEDED` é provado por `judge` sobre registro sintético, porque a área de cada ensaio é parâmetro fixo |
| regulador de velocidade (interno à biblioteca) | acelerador 1 se a velocidade anterior < alvo, senão 0 | velocidade mantida em 50 km/h (prova: `speedMinMps`/`speedMaxMps`) |
| `grassEntry(speedMps)`, `wallApproach()` | entrada na grama e trajetória até a parede da pista sintética | 1 s na grama; contatos com a parede |
| `syntheticReading()` | leitura `COMPLETE` da pista sintética (`tests/fixtures/trackFiles.ts` nos testes) | volta do piloto de teste; `replayLap` |
| `testPilot(config)`, `testPilotLapWith` | controlador binário determinístico; volta com outro controlador | volta completa; piloto desviado de 8 m; controlador parado |
| `forcingThenRelease(side, throttleAtRelease)` | sequência por `step`: acelerador 1 e esterço do lado a partir de `straight(16.7)` até `forcing` com `oversteer`/`sliding` ou 360 passos; depois esterço 0 e acelerador `throttleAtRelease` (1 ou 0) | recuperação com acelerador mantido e com os dois zerados juntos (REQ-FEAT-0003-09) |
| `withDrift(inputs)` | a mesma lista de `Input` com `drift: true` em todos | as duas execuções de `DRIFT_INERT`; replay gravado com drift |
| `tests/fixtures/records.ts` (**muda**) | `oldReplay()`/`oldResult()` sem campos de acerto e sem `replayFormatVersion`; `newReplay()`/`newResult()` com `arcade-assistido-v6`; `v4Replay()` com `arcade-assistido-v4` e `inputs` de uma volta de `ARCADE_KART`; `v5Replay()` com `arcade-assistido-v5` (a rodada substituída) e `drift: true` em parte dos `inputs`; `futureReplay()` com `replayFormatVersion` 2; `corruptReplay()`; `oversizedReplay()`/`oversizedReplayText()` acima dos tetos; `incompleteResult()` sem `trackVersion` | leitura de registro antigo, novo, de rodada substituída, não suportado, ilegível, acima do teto e incompleto; reprodução de outra versão; `oldRecords` de `SETUP_VERSION` |
| `baselineMarkdown()` | texto com bloco `handling-baseline` válido (entradas com uma chave cada, registros com `benchEnvironment`), um sem bloco, um corrompido, um sem o `runtimeId` da execução, um com registro `STEP_COST` de outro `inputMode` | `baselineAvailable` verdadeiro e falso; `BASELINE_MISSING` em `STEP_COST` e `REALISTA_UNCHANGED` |
| `docs/physics.md` real | o bloco registrado pela etapa de código | os vereditos reais de `STEP_COST` (no bench), `TEST_PILOT_LAP` (`baselineLapTimeMs`) e `REALISTA_UNCHANGED` |
| `inputMode` `PROPORTIONAL` | o mesmo `Input` com o esterço contínuo saturado e a variante 0,5 | paridade com a inclinação |

## Funcionalidade por nível

| Funcionalidade | Unitário | Integração | Contrato | Bench | Web E2E | Mobile E2E | Razão |
|---|---|---|---|---|---|---|---|
| FEAT-0001 resposta do volante | sim | sim | sim | `bench:handling` | — | — | limiares medidos no estado da simulação, na pista de teste aberta; nenhum elemento de tela próprio |
| FEAT-0002 aderência em curva | sim | sim | sim | `bench:handling` | — | — | raio e giro medidos da posição e do rumo da telemetria |
| FEAT-0003 traseira viva, sem drift nem turbo | sim | sim | sim | `bench:handling` | E2E-01, E2E-02, E2E-04 | E2E-01, E2E-03, E2E-04 | condução normal, recuperação, `DRIFT_INERT` e `SPEED_CAP` na simulação; a ausência dos indicadores e do ensino do drift na tela, no texto compartilhado e no controle de toque exige tela; a ausência por texto em `index.html`, `src/style.css` e `src/main.ts` é contrato |
| FEAT-0004 aceleração, velocidade, grama, parede e HUD | sim | sim | sim | `bench:physics` | E2E-01 | E2E-01 | limiares na simulação; "todos os quadros" exige tela |
| FEAT-0005 determinismo, piloto de teste e versão | sim | sim | sim | `bench:handling` | E2E-02 | E2E-02 | registros e comparabilidade puros; a exibição e o compartilhar exigem tela |
| FEAT-0006 transversais | sim | sim | sim | `bench:handling`, `bench:physics` | — | — | camada, contrato de passo, Realista, paridade, custo, `race-lap-validation` e `docs/physics.md` |

## Roteiro registrado (web E2E e mobile E2E)

| Id | O que se faz e se registra | Canal |
|---|---|---|
| E2E-01 | iniciar uma volta com o Arcade assistido; gravar a tela do sinal verde ao fim; verificar que `#speed` (km/h) e `#handling` (texto) estão visíveis com valor em todos os quadros, inclusive em grama e após bater; segurar Espaço (desktop) em curvas e retas: nenhum medidor, rótulo "TURBO"/"CARREGANDO DRIFT", pontos de estilo, combo, mensagem de prêmio ou brilho de turbo aparece em quadro algum, e a pilotagem não muda de forma visível; pausar (Esc, troca de aba; cobrir o sensor no celular) e verificar que os dois elementos mantêm o último valor | desktop e celular |
| E2E-02 | completar uma volta com o Arcade; ver no resultado o tempo, sem a versão do acerto e sem conteúdo de drift ou turbo; trocar para o Realista: o melhor tempo passa a `—`; completar uma volta com o Realista: o melhor tempo mostra só o tempo dessa volta, nunca o do Arcade nem uma diferença entre os dois; voltar ao Arcade: `—` de novo; compartilhar e verificar o texto (pista, versão da pista e tempo; sem versão do acerto, sem segundo tempo, sem estilo, combo ou turbo) | desktop (área de transferência) e celular (Web Share) |
| E2E-03 | com a inclinação ativa, uma volta inteira; verificar o mesmo HUD e que o esterço parcial não força a traseira (texto de aderência nunca "Saindo de traseira"/"Derrapando" sem acelerador cheio e esterço cheio) | celular |
| E2E-04 | com o navegador em português e de novo em inglês: abrir o jogo e registrar a tela inicial (`#welcome`) antes da volta e de novo depois de uma volta; registrar a barra de ferramentas (desktop: a dica ao lado de W A S D) e a área abaixo dela; verificar que nenhum texto, ícone ou controle menciona ou oferece o drift, a tecla Espaço, carga, turbo, mini-turbo, impulso, combo ou pontuação, e que não há guia de manobras; no celular, iniciar uma volta com a inclinação ativa e outra com a permissão negada (recuo para toque) e registrar o controle de toque durante a contagem e a volta: só ←, →, Freio e Acelerar, sem botão "Drift" nem outro controle de drift ou turbo; no desktop, ver que o botão "encerrar treino" de `race-lap-validation` continua na barra durante um treino | desktop e celular |

## Critérios de aceite: como o teste chega a cada um

`U` unitário, `I` integração, `C` contrato; arquivos em `tests/`, prefixo `dirigibilidade-`.

| Critério | Teste e caminho |
|---|---|
| AC-US-0001-01 | `steer-response` (I): `runBench('STEER_RESPONSE')` em `BINARY` e `PROPORTIONAL`, lados +1 e −1: `benchEnvironment` `TEST_PAD`, `testAreaRadiusM` 100, `offAsphaltStepCount` 0, `speedHoldMode` `THROTTLE_REGULATED`, velocidade dentro de ±0,5 m/s de `50 / 3.6` e `riseToNinetyPctMs <= 180`; `steer-response` (U) por `judge`: registro sintético com 175 ms é `PASS`, com 183 ms é `FAIL` |
| AC-US-0001-02 | idem: `fallToTenPctMs <= 250` |
| AC-US-0001-03 | `steer-response` (I): variante ±0,5 em `PROPORTIONAL`: `riseToNinetyPctMs <= 180` com a velocidade mantida |
| AC-US-0001-04 | idem: `fallToTenPctMs <= 250` |
| AC-US-0001-05 | `steer-response` (I e U): o veredito recalculado só pelos tempos, pela faixa de velocidade e pela área é igual ao `verdict` de todo registro, qualquer que seja `understeerStepCount`; registro sintético com tempos e velocidade dentro e `understeerStepCount` 50 é `PASS` |
| AC-US-0001-06 | `steer-response` (C): o registro tem exatamente os campos de API-0003 para `STEER_RESPONSE` mais os da área, sem `throttleInputNorm`; registro sintético com `speedMaxMps` = alvo + 0,6 é `FAIL` `SPEED_NOT_HELD`; com `offAsphaltStepCount` 1, `offAsphaltFirstStep` e posição, `FAIL` `TEST_AREA_EXCEEDED` antes de qualquer outro motivo |
| AC-US-0002-05 | `cornering` (C): por `inputMode`, quatro registros `CORNER_RADIUS` (`entrySpeedMps` 13,89 e 19,44 × `steerInputNorm` ±1) com `radiusWindowMs` 200, `pathRadiusAt3sM`, `speedAt3sMps`, `handlingAt3s` e campos da área, e dois `CORNER_TURN` (±1) com `turnAt2sRad`, `halfTurnReachedMs`, `speedAt2sMps`; nenhum `REFERENCE_CORNER` nem `UNDERSTEER_ONSET` na saída; `serialize` apresenta as velocidades em km/h e `turnAt2sRad` em graus; registros sintéticos: `CORNER_RADIUS` com `stoppedAtStep` é `MEASUREMENT_MISSING` sem `pathRadiusAt3sM`, `CORNER_TURN` parado com giro 3,0 rad é `THRESHOLD_EXCEEDED` com `stoppedAtStep`, qualquer um com `offAsphaltStepCount` 1 é `TEST_AREA_EXCEEDED` |
| AC-US-0002-07 | `cornering` (I): `CORNER_RADIUS` a 50 km/h, lados ±1, nos dois `inputMode`: `pathRadiusAt3sM <= 13`; o campo é igual à recomputação sobre as posições do traço pela definição de DES-0004 (janela dos passos 349 a 372); um registro sintético com 13,0 é `PASS` e com 13,01 é `THRESHOLD_EXCEEDED`; com `handlingAt3s` `oversteer`, `sliding` ou `understeer` o veredito não muda (REQ-FEAT-0002-14) |
| AC-US-0002-08 | idem a 70 km/h |
| AC-US-0002-09 | `cornering` (I): `CORNER_TURN` lados ±1, nos dois `inputMode`: `halfTurnReachedMs <= 2000`; `turnAt2sRad` igual a `\|headingRad\|` do passo 240 menos o da partida, recomputado do traço; o primeiro passo com giro ≥ π é o de `halfTurnReachedMs`; nenhum `handling` do traço altera o veredito |
| AC-US-0003-01 | `rear` (I): `NORMAL_DRIVING` (um registro, `SYNTHETIC_TRACK`): `normalDrivingStepCount` igual ao número de passos `RUNNING` da volta do piloto de teste até o primeiro resultado, `oversteerOrSlidingStepCount` 0 e igual à contagem recomputada sobre o traço, inclusive os passos com `forcing` verdadeiro |
| AC-US-0003-03 | `rear` (I): `REAR_RECOVERY` lados ±1, nos dois `inputMode`: `entrySpeedMps` 16,7, campos da área com `offAsphaltStepCount` 0; se `rearReleased`, `gripReached` e `recoveryMs <= 400`; se não, `forcingMs` 3 000, sem `gripReached`/`recoveryMs`/`maxSideslipRad` e `verdict` `PASS` (com o acerto C, medido sem soltar); `rear` (U) por `judge`: com `rearReleased` e `recoveryMs` 404, ou `gripReached` falso, `THRESHOLD_EXCEEDED`; com `rearReleased` falso, `PASS`; `rear` (I): `forcingThenRelease(±1, 0)` (acelerador e esterço zerados juntos): se a traseira soltou, `grip` em no máximo 48 passos, senão nenhum passo em `oversteer`/`sliding` com `forcing` (REQ-FEAT-0003-09) |
| AC-US-0003-04 | idem: com `rearReleased`, `maxSideslipRad <= 0.65`; registro sintético com 0,66 é `THRESHOLD_EXCEEDED` |
| AC-US-0003-05 | `rear` (I): `NORMAL_DRIVING`: `maxSideslipRad <= 0.65` e igual ao máximo recomputado sobre o traço |
| AC-US-0003-07 | `rear` (C): registros `REAR_RECOVERY` (`TEST_PAD`, `steerInputNorm`, `entrySpeedMps`, `rearReleased`, `forcingMs`, condicionais), `NORMAL_DRIVING` (`SYNTHETIC_TRACK`, sem `excludedRecoveryStepCount`), `DRIFT_INERT` (duas sequências) e `SPEED_CAP` (`maxObservedSpeedMps`, `maxObservedBenchId`, `topSpeedMps`, apresentados em km/h) com as unidades de API-0003 |
| AC-US-0003-08 | `rear` (I): `DRIFT_INERT` nos dois ambientes e nos dois `inputMode`: `differingStepCount` 0 e `comparedStepCount` igual ao tamanho da sequência; `telemetry` (I): a mesma sequência de `STEER_RESPONSE`, `CORNER_RADIUS` e `CORNER_TURN` com `withDrift` dá estados `deepEqual` passo a passo; `setup-version` (I): `replayLap(v5Replay())` e o mesmo replay sem `drift` dão o mesmo `LapRecord`; `contract` (C): `getHandlingTelemetry` não tem `driftActive`; `src/physics.ts` não chama `advanceManeuvers` nem `cancelManeuver` e todo estado de um traço tem `maneuvers` igual a `initialManeuvers()` |
| AC-US-0003-09 | `hud-text` (C): `index.html` sem `style-score`, `combo`, `drift-hud`, `drift-meter`, `drift-label`, `drift-help` e `lap-result-setup`; `src/main.ts` sem esses identificadores, sem `chargeTier`, sem import de `./maneuvers` e sem mensagem de pontos de estilo; `src/style.css` sem `.drift-hud`, `.drift-meter`, `.style-score` e `.boosting`; E2E-01 e E2E-02 na tela |
| AC-US-0003-10 | `rear` (I): `SPEED_CAP` nos dois `inputMode`: `maxObservedSpeedMps <= topSpeedMps`, `topSpeedMps` igual ao do registro `TOP_SPEED` da mesma execução, e `maxObservedSpeedMps` igual ao máximo recomputado sobre os traços cobertos (sem `CORNER_RADIUS` a 70 km/h quando 19,44 m/s passa de `topSpeedMps`); registros sintéticos: sem `topSpeedMps`, `MEASUREMENT_MISSING`; acima, `THRESHOLD_EXCEEDED` |
| AC-US-0003-11 | `hud-text` (U): `formatSharedText` sobre `newResult()` válido e inválido contém exatamente `Kartle`, `trackId`, `v<trackVersion>` e o tempo ou o estado inválido, sem `setupVersion`, segundo tempo, "estilo", "turbo", "drift" ou "combo", nos dois idiomas; E2E-02 |
| AC-US-0003-12 | `hud-text` (C): `index.html` não casa `/drift\|turbo\|impulso\|combo\|Espaço/i` e não contém `Entre de lado` nem `Saia voando`; `#welcome` continua com `#track-selector`, `#track-credit`, `#track-status` e `#lap-offer`; as mensagens de `src/lapMessages.ts` em `pt` e `en` não casam `/drift\|turbo\|impulso\|mini-?turbo\|combo/i`; E2E-04 nos dois canais e nos dois idiomas |
| AC-US-0003-13 | `hud-text` (C): o `<span class="control-hint">` de `index.html` tem exatamente o texto `Dirigir`; `#lap-end-training` continua dentro de `.actions` (a retirada não o tocou); o mesmo padrão sobre `index.html` de AC-US-0003-12; E2E-04 |
| AC-US-0003-14 | `hud-text` (C): `index.html` não contém `maneuver-guide` nem `Como fazer drift`; `src/style.css` não contém `.maneuver-guide`; E2E-04 nos dois canais e nos dois idiomas |
| AC-US-0003-15 | `hud-text` (C): `index.html` não contém `data-control="drift"` nem `Segurar para drift`, e `.touch-controls` tem exatamente os quatro botões `left`, `right`, `brake`, `throttle`; `src/main.ts` não contém `[data-control="drift"]` nem `touch.has('drift')` e continua com `drift: keys.has(' ')`; `src/style.css` não contém `data-control=drift`; o mesmo `.touch-controls` serve o sensor ativo e o recuo (DES-0007), e E2E-04 registra os dois no celular |
| AC-US-0004-01 | `speed` (I): `ACCELERATION` (`TEST_PAD`, `testAreaRadiusM` 1 500, `driverMassKg` 75): `zeroToSixtyKmhMs <= 2500` |
| AC-US-0004-02 | `speed` (I): `TOP_SPEED`: `65 / 3.6 <= topSpeedMps <= 72 / 3.6`; registros sintéticos com 18,05 e 20,01 m/s são `THRESHOLD_EXCEEDED`, com 18,056 e 20,0 são `PASS` |
| AC-US-0004-03 | `speed` (I): `GRASS_LOSS` à velocidade estabilizada (`grassEntry(topSpeedMps)`): `speedAfterOneSMps <= 0.7 × entrySpeedMps`; os 120 passos em `GRASS` sem `wallContact`; registro sintético dentro do limiar julgado com `observed` é `FAIL` |
| AC-US-0004-04 | idem com `grassEntry(50 / 3.6)` |
| AC-US-0004-05 | `speed` (I): `WALL_CONTACT`: `contacts` não vazia e `after < before` em todos; registro sintético com lista vazia é `MEASUREMENT_MISSING`; `telemetry` (C): `wallContact` só no passo do contato em `CIRCUIT` e nunca em `testPadArea` |
| AC-US-0004-06 | `telemetry` (C): `getHandlingTelemetry` devolve `speedMps` e `handling` em todo passo da volta do piloto de teste, do sinal verde ao primeiro resultado (`untilFirstResult`), e o estado inicial antes; `hud-text` (U): rótulos não vazios para os quatro valores; E2E-01 |
| AC-US-0004-07 | `speed` (C): os quatro registros com os campos nomeados e o seu `benchEnvironment` (`TEST_PAD` com os campos da área para aceleração e velocidade estabilizada; `SYNTHETIC_TRACK` para grama e parede); `serialize` apresenta km/h e s; `bench:physics` imprime o mesmo |
| AC-US-0005-01 | `setup-version` (I): `replayLap` do mesmo `newReplay()` duas vezes: `deepEqual` dos `LapRecord` e dos estados finais, com a reprodução encerrada no primeiro resultado; `test-pilot` (I): `DETERMINISM` por ambiente com `runCount` 2 e `identical`, e o registro `TEST_PAD` com os campos da área agregados; registro sintético com `identical` falso é `NON_DETERMINISTIC` |
| AC-US-0005-02 | `test-pilot` (I): `TEST_PILOT_LAP` com o acerto corrente: `SYNTHETIC_TRACK` e `offAsphaltStepCount` 0, a volta encerrada no primeiro resultado (não na fase `ENDED`); o piloto desviado de 8 m (`testPilotLapWith`) dá `FAIL` `OFF_ASPHALT` com `offAsphaltFirstStep` e posição |
| AC-US-0005-03 | `test-pilot` (I): `lapTimeMs <= 25000`, igual ao `lapMs` do primeiro resultado; registro sintético com 25 001 é `THRESHOLD_EXCEEDED`; `sectorMs` com exatamente 4 inteiros em todo registro (somam `lapTimeMs` na volta válida; controlador parado: `[50000, 50000, 50000, 50000]`) |
| AC-US-0005-04 | `setup-version` (U): `getSetupVersion('ARCADE_ASSISTIDO')` dá `arcade-assistido-v6` e `previousSetupVersion` `arcade-assistido-v4`; `readReplay` de `v4Replay()`, `v5Replay()` e `newReplay()` dá três `setupVersion` diferentes, `DECLARED`; `SETUP_VERSION` com `oldRecords` dos fixtures: `declaredSetupVersion` ≠ `previousSetupVersion`; os literais `ARCADE_KART` e `ARCADE_ASSISTIDO_V5` não mudaram (comparação campo a campo com os valores de 2026-10-22) e `ARCADE_ASSISTIDO_V6` é `ARCADE_ASSISTIDO_V5` com exatamente os cinco campos de `DOMAIN/DEC-15` diferentes; (I): uma volta iniciada com os dois campos no pedido dá `getLapResult` com eles, e sem eles, sem eles; `buildLapRecord(newResult(), ref)` é cópia idempotente |
| AC-US-0005-05 | `setup-version` (U): tabela de RULE-0003 linha a linha em `compareLapRecords`, inclusive `v5` contra `v6` (`SETUP_VERSION_DIFFERS`) e `incompleteResult()` (`INCOMPLETE_RECORD`); (I): `replayLap(v4Replay())` dá `SETUP_VERSION_DIFFERS`; `hud-text` (C): `src/main.ts` só atualiza o melhor tempo depois de `compareLapRecords` `COMPARABLE` (por texto); E2E-02 |
| AC-US-0005-06 | `contract` (C): `STEP_CONTRACT` com os três booleanos verdadeiros e `benchEnvironment` `SYNTHETIC_TRACK`; `setup-version` (I): `v4Replay()` reproduzido passo a passo até o primeiro resultado com o acerto corrente |
| AC-US-0005-07 | `hud-text` (U): `formatSharedText` nunca contém dois tempos nem diferença, para quaisquer dois registros, comparáveis ou não; E2E-02 |

## Requisitos não funcionais

| NFR | Como é provado |
|---|---|
| NFR-0001 | `test-pilot` (I): `DETERMINISM` por ambiente; `NON_DETERMINISTIC` nunca tolerado |
| NFR-0002 | `bench:handling`: `STEP_COST` (`SYNTHETIC_TRACK`) com `meanStepCostUs <= 1.10 × baselineMeanStepCostUs` para o `runtimeId` da máquina de referência; `contract` (U): `runBench('STEP_COST', {stepCost: {meanStepCostUs: 11, runtimeId}})` com linha de base 10 dá `THRESHOLD_EXCEEDED` e com 10 dá `PASS`; sem entrada para o `runtimeId`, `BASELINE_MISSING` |
| NFR-0003 | `steer-response`, `cornering`, `rear`, `speed` (I): cada ensaio de US-0001 a US-0004 em `BINARY` e `PROPORTIONAL`, `PASS` nos dois; o acelerador regulado só assume 0 ou 1 |
| NFR-0004 | `contract` (U): o bloco `handling-baseline` de `docs/physics.md` tem uma entrada por (`setupId`, `setupVersion`, `runtimeId`), com entradas `arcade-assistido-v4`, `realista-aluguel-4t-v4` e `arcade-assistido-v6` com `measuredAtUtc`, `parameters` (com `testAreaRadiusM`, `straightTestAreaRadiusM`, `radiusWindowMs`, `forcingSpeedMps`, `forcingWindowMs`) e registros de todos os `benchId` de API-0003 4.0.1, sem `benchId` retirado; a prosa datada é verificada na revisão da etapa de código |
| NFR-0005 | `contract` (C): `src/setupRecords.ts`, `scripts/handlingBench.ts` e `src/physics.ts` sem `three`, DOM, `Date`, `performance`, `Math.random`, `node:perf_hooks`, `node:os`; `src/main.ts` sem os literais da regra e sem `testPadArea`; todos os ensaios rodam sem DOM |
| NFR-0006 | `contract` (C): `STEP_CONTRACT`; `race-lap-validation-frozen` verde (inclusive a linha 3 de `src/physics.ts`); `v4Replay()` reproduzido |
| NFR-0007 | `contract` (C): `REALISTA_UNCHANGED` nos dois ambientes com 0 e 0, contra a entrada do Realista medida com os ensaios desta versão; `{...RENTAL_KART}` sem campo opcional; sem `realistaBaseline`, `BASELINE_MISSING` |
| NFR-0008 | a mesma execução de `npm test` roda `tests/race-lap-validation-*.test.ts`; `src/maneuvers.ts` presente e puro durante a janela de compatibilidade (ADR-0006); `contract` (C): `src/lap.ts`, `src/track.ts`, `src/trackData.ts` e `src/lapTiming.ts` não importam `src/setupRecords.ts` nem contêm `testPadArea`, `PUBLISHED_SETUPS` ou `resolveSetupRef` |
| NFR-0009 | `setup-version` (U): `oldReplay()` e `oldResult()` com `READABLE`/`RESOLVED_FROM_ABSENCE` e `arcade-assistido-v4`; `futureReplay()` `UNSUPPORTED_FORMAT` e intacto; `corruptReplay()`, `oversizedReplay()`, `oversizedReplayText()` `UNREADABLE` sem ler elemento algum; `SETUP_VERSION` com contagens iguais |

## Verificações existentes

Migração das verificações escritas para a versão 5.1.0 (conventions §17); as retiradas seguem a retirada dos
critérios que elas provavam, aprovada pelo dono do produto (`DOMAIN/DEC-15`, revisão 4 do seed; tabelas de
migração dos requisitos 4.3.0 e do F-Spec 4.0.0):

| Verificação | Destino |
|---|---|
| `tests/dirigibilidade-cornering.test.ts` (`REFERENCE_CORNER`, `UNDERSTEER_ONSET`, V0/V1, janela de `maxUndersteerMs`) | **reescrita** sobre `CORNER_RADIUS` e `CORNER_TURN` (AC-US-0002-05, -07, -08, -09); as verificações do arco e da varredura saem com AC-US-0002-01 a -04 e -06 |
| `tests/dirigibilidade-classify.test.ts` (classes de passo) | **retirada** com o classificador (REQ-FEAT-0003-03 retirado, REQ-FEAT-0003-12 modificado; ADR-0005) |
| `tests/dirigibilidade-rear.test.ts` (`NORMAL_DRIVING` por ambiente, `excludedRecoveryStepCount`, `DRIFT_MANEUVER`, recuperação no arco) | **reescrita**: `NORMAL_DRIVING` da volta, `REAR_RECOVERY` aberta e por lado, `DRIFT_INERT`, `SPEED_CAP`; a verificação de `driftScorePoints` sai com AC-US-0003-06 |
| `tests/dirigibilidade-steer-response.test.ts` | mantida, com o ambiente `testPadArea` e os campos da área no lugar da saída da faixa |
| `tests/dirigibilidade-speed.test.ts` | mantida; `TOP_SPEED` contra 65–72 km/h; `WALL_CONTACT` vazio como `MEASUREMENT_MISSING` |
| `tests/dirigibilidade-telemetry.test.ts` | mantida; sem `driftActive`, com posição e rumo; `testPadArea` no lugar de `testPadLane`/`testPadArc`; laços até o primeiro resultado (`:34`, `:45`) |
| `tests/dirigibilidade-setup-version.test.ts` | mantida; `arcade-assistido-v6`, `v5Replay()`; laços até o primeiro resultado (`:48-55`, `:100-104`, `:114-120`) |
| `tests/dirigibilidade-hud-text.test.ts` | mantida; texto compartilhado sem `setupVersion`; ausência dos elementos do drift e de `#lap-result-setup`; **ganha** as verificações por texto de AC-US-0003-12 a -15 (tela inicial, dica, guia e controle de toque) |
| `tests/dirigibilidade-contract.test.ts`, `tests/dirigibilidade-test-pilot.test.ts` | mantidas, com os `benchId` e campos de API-0003 4.0.1 e o fim da volta no primeiro resultado |
| `tests/helpers/handling.ts` | `ARCADE_CONFIG` passa ao `config` publicado (`ARCADE_ASSISTIDO_V6`), não a `ARCADE_ASSISTIDO_V5`; ganha `untilFirstResult` |
| `tests/maneuvers.test.ts:68-80` ("player-induced drift generates real lateral slip and a useful exit boost") | **retirada** (`DOMAIN/DEC-15`: o drift através do passo deixa de existir); as demais verificações do arquivo ficam durante a janela de compatibilidade e saem na retirada final (ADR-0006) |
| `tests/physics.test.ts` | inalterada: usa `ARCADE_KART`, `RENTAL_KART` e `TEST_PAD`, sem o comando de drift |
| testes de `race-lap-validation` | não tocados; continuam verdes (NFR-0008) |
