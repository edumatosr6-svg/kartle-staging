---
title: Registro de mudanças — dirigibilidade do Arcade assistido (estágio de código)
feature: dirigibilidade
stage: code
status: validated
version: 2.1.0
sources: []
---

# Registro de mudanças

## 2026-10-27 — rodada 4, Mode B (SPEC-ISSUE-03 de `feedback-20261027-1619.md` resolvido pelo D-Spec na rodada 9, `dspec-validation-20261027-1803`; `DOMAIN/DEC-14`; F-Spec API-0003 3.4.0)

**O que mudou**

- `scripts/handlingBench.ts` (DES-0004 5.1.0; ADR-0004 4.1.0 decisões 3 e 9; ADR-0005 1.3.0 decisão 1): em `referenceCornerBench`, a
  acumulação da sequência consecutiva de `understeer` (`:280-281`) passa a valer só enquanto `exit` está indefinido — com
  `THROTTLE_ZERO`, `maxUndersteerMs` cobre só os passos na faixa de asfalto até a primeira saída; a sequência em curso termina no
  passo da saída e nenhum passo depois dela entra, na grama ou de volta ao asfalto. A execução continua a percorrer os 300 passos,
  o traço, `offAsphaltStepCount` (janela inteira, informativo), `offAsphaltFirstStep` e posição, `judge`, `BenchRecord`,
  `BENCH_PARAMETERS` e `THRESHOLDS` não mudam; com `THROTTLE_FULL` nada muda (a execução já parava no passo da saída, antes da
  acumulação). Comentário da função (`:265-267`) atualizado. O arquivo não mudou de comprimento: as citações `arquivo:linha` da
  rodada 3 continuam válidas.
- `docs/physics.md`: entrada `arcade-assistido-v5` do bloco `handling-baseline` refeita em 2026-10-27T18:18Z com a saída de
  `npm run bench:handling` desta rodada (46 registros `PASS`; `REFERENCE_CORNER` acelerador 0: `maxUndersteerMs` 125,
  `offAsphaltStepCount` 61, `offAsphaltFirstStep` 240; `STEP_COST` 220,4 µs, medida de relógio); título da seção datada (API-0003
  3.4.0), parágrafo de revisão (`DEC-14`, DES-0004 5.1.0), linhas `REFERENCE_CORNER` acelerador 0 e `STEP_COST` da tabela de
  resultados, parágrafo final (todos os 15 ensaios passam; o motivo pelo qual os 61 passos na grama não entram). `arcade-assistido-v4`
  e `realista-aluguel-4t-v4` mantidas.
- Manifesto: `01-implementation.md` (2.1.0), `core/DES-0004` (2.1.0), `98-divergences.md` (2.1.0, contra o registro 3.1.0 do projeto:
  linha B `resolved`, linha D `open`, A e C resolvidas pela rodada 3 e recitadas); `00-index.md` e `99-traceability.md` gerados por
  `lint_artifacts.py --emit`. `core/DES-0001`, `core/DES-0002`, `core/DES-0003`, `data/DM-0001`, `web/DES-0005`, `web/DES-0006`,
  `web/DES-0007` e `security/DES-0008` não mudam (nenhum campo, interface ou arquivo deles tocado; DM-0001 não carrega o fato, como o
  projeto diz).

**Decisões de implementação, onde o projeto deixava detalhe em aberto** (nenhuma muda contrato nem requisito)

- A condição é escrita sobre `exit` (já definido no mesmo passo da primeira saída, antes da acumulação), de modo que o passo da
  saída não entra na medição — "fecha no passo anterior a `offAsphaltFirstStep`" — e a mesma linha serve às duas condições de
  acelerador: com `THROTTLE_FULL` o laço interrompe antes dela no passo da saída, como antes.
- A contagem de `oversteer`/`sliding` da linha `#` com acelerador cheio não foi movida para dentro da condição: só existe com
  `THROTTLE_FULL`, onde `exit` nunca está definido ao chegar nela; o comportamento é idêntico.

**Itens fechados**: SPEC-ISSUE-03 de `feedback-20261027-1619.md` (resolvido pelo projeto 5.1.0 com `DOMAIN/DEC-14`; implementado; o
registro `REFERENCE_CORNER` com acelerador 0 passa a `PASS` com 125 ms sem retune). Nenhum `ISSUE-<nn>` pendente (nenhum relatório de
validação de código nesta feature ainda); nenhum `FB-<nn>` pendente.

**Itens recusados, com motivo**

- Retunar `ARCADE_ASSISTIDO_V5`, ou tocar `ARCADE_KART`, `RENTAL_KART`, `grassFriction`, o teto de guinada, `handling()`, os
  parâmetros de `BENCH_PARAMETERS` ou os limiares: o projeto 5.1.0 diz que nada disso muda (ADR-0004 4.1.0, Alternativas) e o acerto
  entregue atende sob `DEC-14`.
- Parar a execução com acelerador 0 no primeiro passo fora da faixa (biblioteca da rodada 2): recusado pelo projeto (mudaria
  `offAsphaltStepCount` e o traço de `DETERMINISM`); não feito.
- Restringir `NORMAL_DRIVING` à janela até a primeira saída, ou acrescentar um campo que diga onde a janela fechou: recusados pelo
  projeto (`offAsphaltFirstStep` já o diz); não feitos.
- `src/lap.ts`: não tocado (regras de volta congeladas, NFR-0008); `src/setupRecords.ts`, `src/handlingMessages.ts`, `src/main.ts`:
  nenhum deles carrega valor medido nem lê API-0003 — nada a mudar.
- Versão de esquema dos registros: API-0003 3.4.0 não acrescenta campo nem valor de enum ("nenhum registro foi publicado sob a forma
  anterior e nenhum consumidor lê este contrato como entrada"); nenhum campo de versão existe em `BenchRecord` e nenhum foi criado
  (superfície congelada, conventions §16).
- Refazer as entradas `arcade-assistido-v4` e `realista-aluguel-4t-v4` do bloco: continuam válidas (ADR-0004, Consequências);
  `REALISTA_UNCHANGED` passa com 0 medidas diferentes contra a entrada existente.
- Arquivos de teste de test-strategy (`tests/dirigibilidade-*.test.ts`, `tests/fixtures/records.ts`) e `docs/handling-device-log.md`:
  estágio de testes e evidência humana, como nas rodadas 2 e 3.
- Nenhum limiar foi afrouxado, nenhum requisito enfraquecido, nenhuma dependência acrescentada, nenhum arquivo fora dos que o projeto
  nomeia foi tocado.

**Migração de verificações existentes**: nenhuma verificação foi removida ou alterada; `npx tsx --test tests/*.test.ts` 172/172
(`race-lap-validation` incluída); `npx tsc --noEmit -p .` 0.

## 2026-10-27 — rodada 3, Mode C (feedback `feedback-20261022-1803.md` resolvido pelo D-Spec na rodada 8, `dspec-validation-20261027-1531`; FB-01 de `race-lap-validation`)

**O que mudou**

- `scripts/handlingBench.ts` (DES-0004 5.0.0; ADR-0004 decisões 8, 9 e 10; ADR-0005 decisão 1): `referenceCornerBench` com
  `THROTTLE_ZERO` percorre os 300 passos da janela esteja o kart onde estiver, mede `maxUndersteerMs` em todos eles (dentro e fora da
  faixa) e conta os passos fora da faixa em `offAsphaltStepCount`, com `offAsphaltFirstStep` e posição da primeira saída; com
  `THROTTLE_FULL` continua a parar no primeiro passo fora da faixa. `judge` emite `OFF_ASPHALT` em `REFERENCE_CORNER` só com
  `THROTTLE_FULL`; com `THROTTLE_ZERO` o único critério é `maxUndersteerMs <= 200`. `understeerOnset` define `v1Mps` em todo fim
  natural — o menor patamar completo com `understeer` > 200 ms ou, sem nenhum, o alvo do patamar interrompido pela saída — e mede a
  maior sequência de `understeer` do patamar interrompido só para a linha `#`. `judge` em `UNDERSTEER_ONSET` na ordem `OFF_ASPHALT`
  (`observed`) → menos de 2 pares `MEASUREMENT_MISSING` → fim natural sem `v1Mps` lança (malformado) → `BASELINE_MISSING` → limiares;
  o caso (b) de `MEASUREMENT_MISSING` (fim natural sem V1) saiu. `v1FromCompletePlateau` e `understeerBaselineRecord` aceitam como V0
  só um `v1Mps` que é velocidade de patamar completo com subesterço (`50 / 3.6` ou um par da lista acima de 200 ms). A linha `#` de
  `UNDERSTEER_ONSET` diz de onde `v1Mps` veio com os três textos do projeto (inclusive "sem início de subesterço até a saída da
  faixa") e imprime `interruptedPlateauMaxUndersteerMs`; `v1Measured` saiu. O pedido da volta de `testPilotLap` leva `setupId` e
  `setupVersion` do acerto e da versão ensaiados.
- `src/lap.ts` (DES-0003 2.0.0, DM-0001 M4; contrato API-0001/API-0002 1.1.0 de `race-lap-validation`): `LapRequest`, `LapSession` e
  `LapResult` ganham `setupId?: SetupId` e `setupVersion?: string`, copiados do pedido em `startLap` e da sessão em `buildResult`, na
  mesma forma de `challengeNumber` (presentes se e só se o pedido os trouxe; nenhuma verificação ou rejeição nova).
- `src/setupRecords.ts` (DES-0003 2.0.0): `buildLapRecord` preenche só o que o resultado não traz (`result.setupId ?? setup.setupId`,
  `result.setupVersion ?? setup.setupVersion`); `replayLap` pede a volta com os dois campos do acerto corrente.
- `src/main.ts` (DES-0007 1.1.0): `beginLap` informa `setupId` e `setupVersion` no pedido de `startLap`. `scripts/keyboard-lap.ts`
  (DES-0004): `measureStepCost` idem, com a `setupVersion` da versão ensaiada (`previousSetupVersion` com `--previous`).
- `docs/physics.md`: entrada `arcade-assistido-v5` do bloco `handling-baseline` refeita em 2026-10-27 sob os vereditos de API-0003 3.3.0
  (preset inalterado); prosa da seção datada atualizada (revisão de 2026-10-27, tabela de resultados); `arcade-assistido-v4` e
  `realista-aluguel-4t-v4` mantidas.
- Manifesto: `01-implementation.md` (2.0.0), `core/DES-0003` (2.0.0), `core/DES-0004` (2.0.0), `data/DM-0001` (2.0.0), `web/DES-0006`
  (1.1.0), `web/DES-0007` (1.1.0), `98-divergences.md` (2.0.0, contra o registro 3.0.0 do projeto); `00-index.md` e
  `99-traceability.md` gerados por `lint_artifacts.py --emit`. `core/DES-0001`, `core/DES-0002`, `web/DES-0005` e
  `security/DES-0008` não mudam (as-built recitado pelo projeto sem mudança de interface).

**Decisões de implementação, onde o projeto deixava detalhe em aberto** (nenhuma muda contrato nem requisito)

- A maior sequência de `understeer` do patamar interrompido é medida nos seus passos no asfalto (subida e, se começou, fase mantida,
  até o passo anterior à saída) e decide só o texto da linha `#`; quando `v1Mps` está ausente (saída que reprova por si sem patamar
  completo com subesterço) a linha `#` diz "ausente (…)". A condição de V0 é uma função interna (`v1FromCompletePlateau`), não
  exportada.
- Em `src/lap.ts` os dois campos entram na mesma forma condicional de `challengeNumber`, de modo que um pedido sem eles produz um
  resultado sem eles e `CHK-TEST-0012-02` (campos exatos de `getLapResult`) continua verde.
- O fim natural é decidido na biblioteca por `exitSpeed > 50 / 3.6 && bySpeed.length >= 2` e `v1Mps` recebe o alvo do patamar
  interrompido só nesse caso; nos outros desfechos `v1Mps` fica ausente sem patamar completo com subesterço, como API-0003 3.3.0 pede.

**Itens fechados**: SPEC-ISSUE-01 de `feedback-20261022-1803.md` (V1 em todo fim natural; `UNDERSTEER_ONSET` passa a `PASS` com
V1 = 64,4 km/h ≥ 57,5 km/h); SPEC-ISSUE-02 do mesmo feedback na parte de projeto (a curva com acelerador 0 deixa de reprovar por
`OFF_ASPHALT` e é julgada só pelos 200 ms de `understeer`) — o limiar resultante não é alcançado pelo preset, ver abaixo; FB-01 de
`race-lap-validation` (`reports/feedbacks/race-lap-validation/feedback-20261022-1703.md`, aceito pelo D-Spec na rodada 8),
implementado por inteiro nos cinco sítios que o projeto nomeia.

**Itens recusados, com motivo**

- Retunar `ARCADE_ASSISTIDO_V5`: tentado e não entregue. 2 967 acertos avaliados pela biblioteca com os vereditos de API-0003 3.3.0
  (7 amostragens aleatórias de 250–300 acertos nas faixas de todas as alavancas de DES-0001, cada uma seguida de subida local, e 4
  subidas locais de 121 acertos a partir dos melhores) e 36 traços do arco: nenhum acerto aprova os 15 registros. O acerto entregue
  reprova só `REFERENCE_CORNER` com acelerador 0 (633 ms); os que aprovam essa curva (`assistLateralG` ≤ 1,15, ou ≈ 1,31 com
  `friction` 1,50) reprovam `REAR_RECOVERY`, `DRIFT_MANEUVER`, `NORMAL_DRIVING` e `TEST_PILOT_LAP`, ou `UNDERSTEER_ONSET` e
  `ACCELERATION`. Um preset que troca um registro reprovado por outros não é entrega: o preset fica como está e o conflito vai ao
  feedback (SPEC-ISSUE-03, `feedback-20261027-1619.md`).
- Medir `maxUndersteerMs` com acelerador 0 só até a saída da faixa (o que a biblioteca anterior fazia: 125 ms, limiar atendido):
  REQ-FEAT-0002-09 e ADR-0004 decisão 9 mandam medir em todos os passos, dentro e fora da faixa; escolher o contrário seria decidir o
  F-Spec aqui.
- Alterar `grassFriction`, o teto de guinada da assistência (`mu × g × 0,85 / u`), `engineBrake`, `brakeForce`, `steerRate`,
  `axleScrub`, o classificador `handling`, os parâmetros de `BENCH_PARAMETERS` ou o piloto de teste: fora das alavancas que DES-0001
  e ADR-0004 fixam.
- Refazer as entradas `arcade-assistido-v4` e `realista-aluguel-4t-v4` do bloco: o projeto diz que continuam válidas (ADR-0004,
  Consequências) e `REALISTA_UNCHANGED` passa com 0 medidas diferentes contra a entrada existente; o registro `REFERENCE_CORNER` com
  acelerador 0 de `arcade-assistido-v4` (medido pela regra anterior) não é lido como linha de base por ensaio algum.
- Arquivos de teste de test-strategy (`tests/dirigibilidade-*.test.ts`, `tests/fixtures/records.ts`) e `docs/handling-device-log.md`:
  estágio de testes e evidência humana, como na rodada 2.
- Nenhum limiar foi afrouxado, nenhum requisito enfraquecido, nenhuma dependência acrescentada, nenhum arquivo fora dos que o projeto
  nomeia foi tocado.

**Limiar que as alavancas do projeto não alcançam (reportado em `feedback-20261027-1619.md`, verdict FAIL SPEC)**

- `REFERENCE_CORNER` com acelerador 0 (REQ-FEAT-0002-01, -03, -09; `DOMAIN/DEC-13`): saída pelo lado interno no passo 240 e, nos 61
  passos seguintes na grama, `understeer` em todos (deriva dianteira 0,15–0,36 rad contra 0,05–0,08 rad na traseira, porque o teto
  de guinada da assistência usa `grassFriction` 0,38 enquanto o limite de esterço cresce com a desaceleração): `maxUndersteerMs` 633.
- Tudo o mais passa nos dois modos de `Input` (registros em `01-implementation.md`).

**Migração de verificações existentes**: nenhuma verificação foi removida ou alterada; `npm test` 170/170.

## 2026-10-22 — rodada 2, Mode A (após o FAIL SPEC da rodada 1 e a revalidação do projeto)

**O que mudou**

- `src/physics.ts`: campo opcional `forcingRampMps` em `KartConfig`; `forcingRampFraction` e a escala traseira com rampa em
  `integrate`/`step`; geradores `testPadLane` e `testPadArc`; `StepClass`, `RECOVERY_MAX_STEPS` e `classifyHandlingSteps`;
  valores finais de `ARCADE_ASSISTIDO_V5` escolhidos pelos ensaios (tabela em `core/DES-0001-…md`). `RENTAL_KART`, `ARCADE_KART`,
  `KART_PRESETS`, `STEP`, `SOLVER_SUBSTEPS`, `Input`, a assinatura de `step`, `TEST_PAD` e a linha 3 inalterados.
- `scripts/handlingBench.ts`: reescrito contra DES-0004 4.0.0 — registros com `benchEnvironment` e os campos da revisão 3 e de
  API-0003 3.1.0/3.2.0; `FailReason` com `SPEED_NOT_HELD` e `MEASUREMENT_MISSING`; `STEER_RESPONSE` com acelerador regulado em
  `testPadLane`; `REFERENCE_CORNER`, `UNDERSTEER_ONSET` (varredura em patamares, fim na primeira saída da faixa, lança nos dois casos
  sem decisão) e `REAR_RECOVERY` em `testPadArc`; `NORMAL_DRIVING`, `DETERMINISM` e `REALISTA_UNCHANGED` um registro por ambiente;
  `judge(record, observed?)`; linha de base resolvida por ensaio, ambiente, geometria e método (`sameSetting`,
  `understeerBaselineRecord`), `baselineEntry` com `parameters`; `grassEntry` na pista sintética; `driftScorePoints`;
  `TEST_PILOT_LAP` sem `lapValidity` e com 4 setores sempre; `referenceCorner`, `cornerEntry` e `grassEnvironment` removidos.
- `scripts/keyboard-lap.ts`: programa novo de `bench:handling` (`runtimeId`, `measureStepCost`, `--previous`, `--realista`,
  `BINARY` e `PROPORTIONAL`, `serialize`); `keyboardLap` e `LapTracker` saem do programa (a classe continua exportada e testada).
- `scripts/physics-bench.ts`: mantém as linhas que imprimia e acrescenta `ACCELERATION`, `TOP_SPEED`, `GRASS_LOSS`, `WALL_CONTACT`.
- `src/handlingMessages.ts` (novo): `formatSharedText`, `shareLabel`. `src/main.ts`: acerto do dado publicado (`PUBLISHED_SETUPS`,
  `SETUP_BY_PRESET`), `setupRef` fixado em `beginLap`, HUD por `getHandlingTelemetry`, `lastRecord`/`bestRecord`, `renderBest`
  (só `COMPARABLE`), `#lap-result-setup`, `#lap-share` (Web Share ou área de transferência). `index.html`: os dois elementos em
  `#lap-result` com a classe `lap-chip`. `src/setupRecords.ts` mantido como está.
- `docs/physics.md`: seção datada "Dirigibilidade — Arcade assistido v5" e bloco ` ```json handling-baseline ` com as entradas
  `arcade-assistido-v4`, `realista-aluguel-4t-v4` e `arcade-assistido-v5` (DM-0001, M3).
- Manifesto: `01-implementation.md`, registros por item em `core/`, `data/`, `web/`, `security/`, `98-divergences.md` (17 linhas,
  15 `resolved`, 2 `open`); `00-index.md` e `99-traceability.md` gerados por `lint_artifacts.py --emit`.

**Decisões de implementação, onde o projeto deixava detalhe em aberto** (nenhuma muda contrato nem requisito)

- A contagem de `oversteer`/`sliding` da curva de referência com acelerador cheio não é campo de API-0003 e chega a `judge` pelo
  segundo argumento `observed` (`THRESHOLD_EXCEEDED`), como as outras observações sem campo; sai na linha `#`.
- Os diagnósticos da linha `#` ficam ao lado do registro (`diagnosticsOf`), nunca dentro dele.
- `STEP_COST` sai uma vez por `inputMode` em `bench:handling`; o programa termina com código 0 e deixa o veredito nos registros.
- `setupRef` também é atualizado ao trocar o acerto com a volta ausente (os controles ficam desabilitados durante a volta), para que
  o HUD do estado inicial leia o acerto escolhido; o `setupRef` da volta continua fixado em `beginLap`.
- O texto de falha do compartilhamento é um literal pt/en em `src/main.ts`, como as demais notificações; nenhuma chave nova além de
  `shareLabel`.
- `let setup` é declarado antes da construção das rodas, porque `wheelPositions(setup.config)` as precisa.

**Itens fechados**: nenhum `ISSUE-<nn>` ou `FB-<nn>` (primeira geração sobre o projeto revalidado); os seis `SPEC-ISSUE` do feedback
da rodada 1 (`feedback-20261021-1827.md`) foram resolvidos pelo projeto 2.2.0 e estão implementados.

**Itens recusados, com motivo**

- Arquivos de teste nomeados por test-strategy (`tests/dirigibilidade-*.test.ts`, `tests/fixtures/records.ts`): pertencem ao
  estágio de testes; por isso as linhas 11 e 14 de `98-divergences.md` nomeiam a parte de `npm test` como do estágio de testes.
- `docs/handling-device-log.md` (teste registrado nos aparelhos, E2E-01 a E2E-03): evidência humana que esta rodada não produz.
- Alterar `brakeForce`, `engineBrake`, `steerRate`, `axleScrub`, os parâmetros de ensaio de `BENCH_PARAMETERS`, o piloto de teste ou
  o classificador `handling`: fora das alavancas que DES-0001 e ADR-0004 fixam; o que elas não alcançam foi reportado, não contornado.
- Nenhum limiar foi afrouxado, nenhum requisito enfraquecido, nenhuma dependência acrescentada, nenhum arquivo fora dos que o projeto
  nomeia foi tocado.

**Limiares que as alavancas do projeto não alcançam (reportados em `feedback-20261022-1803.md`, verdict FAIL SPEC)**

- `UNDERSTEER_ONSET` (REQ-FEAT-0002-04, -05, -10): V1 não medida — 7 patamares completos acima de 50 km/h sem `understeer`,
  saída da faixa a 56,1 km/h, `FAIL` `MEASUREMENT_MISSING`; em 3 103 acertos avaliados nenhum mede V1 mantendo a curva de referência
  e a volta do piloto (o rótulo `understeer` exige deriva dianteira > 1,2 × a traseira e o kart assistido deriva por igual nos dois eixos).
- `REFERENCE_CORNER` com acelerador 0 (REQ-FEAT-0002-03): `understeer` ≤ 125 ms (limiar atendido), mas saída da faixa pelo lado
  interno no passo 240 de 300 porque o limite de esterço cresce com a desaceleração; os acertos que a mantêm reprovam a volta do piloto.
- Tudo o mais passa nos dois modos de `Input`: guinada 117/58 ms e 108/50 ms, curva com acelerador cheio, recuperação 8 ms,
  condução normal sem `oversteer`, drift 200 pontos, 0–60 km/h 2 383 ms, 110,2 km/h, grama 48 %/55 %, parede, determinismo,
  piloto de teste 21 340 ms sem sair do asfalto (linha de base 26 703 ms), custo por passo, versão do acerto, contrato de passo,
  Realista idêntico.

**Migração de verificações existentes**: nenhuma verificação foi removida ou alterada; `tests/physics.test.ts` e
`tests/maneuvers.test.ts` continuam usando `ARCADE_KART`, `RENTAL_KART` e `TEST_PAD`; `npm test` 170/170.
