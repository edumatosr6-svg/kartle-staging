---
title: Registro de mudanças — dirigibilidade do Arcade assistido
feature: dirigibilidade
stage: dspec
status: validated
version: 4.1.0
sources: []
---

# Registro de mudanças

## 2026-10-21 — rodada 1, Mode A

**O que mudou**

- Conjunto gerado do zero a partir do F-Spec validado de `300 Specs/320 F-Specs/Output/dirigibilidade/`
  (FEAT-0001 a FEAT-0006 com 58 requisitos `REQ-*`, API-0001 a API-0003, RULE-0001 a RULE-0003, FLOW-0001
  a FLOW-0003, SCR-0001 e SCR-0002) e do código em execução na raiz do repositório (somente leitura, para
  posicionamento), com as decisões que o autor passou a esta rodada: requisitos validados em
  `req-validation-20261021-1627`; decisões do dono do produto em `DOMAIN.md` já carregadas pelo F-Spec
  (resposta do volante mede só guinada; `understeer` transitório no ensaio de 50 km/h é aceitável); a rodada
  de teste do dono do produto é critério humano final e não bloqueia; o código fica na raiz do repositório,
  presets em `src/physics.ts`, benches em `scripts/`.
- Oito itens de projeto (`core/DES-0001` a `DES-0004`, `web/DES-0005` a `DES-0007`, `security/DES-0008`),
  um modelo de dados (`DM-0001`: dado publicado, registros de volta e replay, saída dos ensaios, linha de
  base), quatro ADR, `01-architecture.md`, `test-strategy.md` (cobre os 31 critérios `AC-*` e os 9 NFR) e
  `98-divergences.md` com 16 linhas abertas.
- `00-index.md` e `99-traceability.md` não foram escritos: o gate os gera com `lint_artifacts.py --emit`.
- As pastas `backend/` e `mobile/` do esqueleto do estágio não existem porque o produto não tem servidor nem
  aplicativo nativo; a simulação está em `core/`, a apresentação em `web/`, a privacidade em `security/`.

**Decisões de projeto onde o F-Spec deixou lacuna ou decisão de projeto** (todas em ADR, nenhuma muda requisito)

- Identificadores concretos de versão: `arcade-assistido-v5` (nova), `arcade-assistido-v4` (anterior, o
  conteúdo de `ARCADE_KART`), `realista-aluguel-4t-v4` (Realista, sem anterior) — ADR-0001, DM-0001.
- O novo acerto é um literal novo (`ARCADE_ASSISTIDO_V5`) e `ARCADE_KART` fica intacto como registro da
  versão anterior, o que preserva o teste de congelamento de `race-lap-validation` — ADR-0001.
- Sem chave mestra: o F-Spec proíbe configuração para escolher o acerto; o padrão neutro de I4 está nos
  campos opcionais de `KartConfig`, ausentes nos presets antigos — ADR-0001.
- Registro de volta `LapRecord` envolve o `LapResult` sem alterá-lo; replay com formato versão 1; nenhuma
  persistência — ADR-0002.
- Linha de base como bloco JSON dentro de `docs/physics.md`; `runtimeId` sem nome de máquina — ADR-0003.
- Ensaios como biblioteca em `scripts/handlingBench.ts`; parâmetros de ensaio fixados; precondição não
  atingida é `FAIL` — ADR-0004.
- Serialização da saída dos ensaios: linhas JSON, um registro por linha, parâmetros e apresentação em
  km/h e s em linhas `#` separadas, para manter o registro campo a campo igual a API-0003 — DES-0004.

**Itens fechados**: nenhum `ISSUE-<nn>` ou `FB-<nn>` (primeira geração).

**Itens recusados, com motivo**

- Editar `ARCADE_KART` no lugar: viola REQ-FEAT-0005-09 e quebra `tests/race-lap-validation-frozen.test.ts`,
  o que contraria REQ-FEAT-0006-07 (ADR-0001).
- Acrescentar `setupId`/`setupVersion` ao `LapResult` de `src/lap.ts`: quebra
  `tests/race-lap-validation-contract.test.ts:35-41`; o F-Spec diz que os contratos daquela feature são
  nomeados e não redefinidos; o acréscimo é feito no registro (ADR-0002). Nenhum feedback a
  `race-lap-validation` é necessário, porque nenhum módulo nem teste daquela feature precisa mudar.
- Tela de abertura de registro gravado e reprodução de replay na interface: nenhuma feature persiste
  registros hoje e o F-Spec diz que a gravação é da feature que a possui; os leitores ficam disponíveis e
  os estados de SCR-0002 que dependem de registros gravados são declarados em DES-0006 (ADR-0002).
- Mover os rótulos do estado de aderência para um módulo puro: refatoração que o F-Spec não pede
  (I10); continuam em `src/main.ts:474`.
- Ensaios para as lacunas deliberadas do F-Spec (inversão do esterço, redução parcial, magnitude da perda
  na parede, grama abaixo de 45 km/h com percentual): não há critério; nenhum registro os mede (ADR-0004).
- Tolerância numérica no `DETERMINISM`: proibida por REQ-FEAT-0005-12 (ADR-0004).
- Medir custo por passo em `npm test`: relógio de parede em teste contraria I9; fica nos benches (ADR-0004).
- Chave mestra desligada por padrão: proibida pelo F-Spec e deixaria a feature sem efeito (ADR-0001).
- Divergências com o sistema em execução: não foram recusadas; estão em `98-divergences.md`.
- Nenhum requisito foi enfraquecido, removido ou dividido.

**Migração de verificações existentes**: `tests/physics.test.ts:147-189` e `tests/maneuvers.test.ts:68-79`
(usam `ARCADE_KART`, intacto), `tests/physics.test.ts:35` (`LapTracker`) e todo `tests/race-lap-validation-*.test.ts`
permanecem como estão; a função `keyboardLap` de `scripts/keyboard-lap.ts` é substituída pelo piloto de
teste da biblioteca (`testPilot`), que reporta `TEST_PILOT_LAP` em vez do objeto anterior — nenhuma
verificação é removida (§17).

## 2026-10-21 — rodada 2, Mode B (relatório `reports/dspec-validation/dspec-validation-20261021-1722.md`)

**O que mudou** (só os pontos do relatório; nenhum módulo, tabela, campo de contrato, endpoint ou
componente novo em relação ao conjunto reprovado, §16)

- ISSUE-01 (error, D-DS-01) — fechado. Um único enunciado em `01-architecture.md`, `DES-0004`, `DES-0008`,
  `ADR-0003`, `ADR-0004` e `test-strategy.md`: a biblioteca `scripts/handlingBench.ts` (camada Simulação)
  não importa `node:perf_hooks` nem `node:os` e não contém `Date` nem `performance`; o relógio de parede
  (`measureStepCost`, com `performance.now()`) e `runtimeId()` (com `node:os`) vivem em
  `scripts/keyboard-lap.ts`, declarado na camada **Aplicação** (programa de bench em Node que só altera a
  simulação por `startLap`/`stepLap`), e entram na biblioteca como argumento `BenchOptions.stepCost`
  (`meanStepCostUs`, `runtimeId`), ao lado de `measuredAtUtc`, que já vinha do chamador;
  `runBench('STEP_COST')` só compara o valor recebido com a linha de base. `scripts/physics-bench.ts`
  passa à mesma camada e não importa nenhum dos dois módulos. A lista de dependências de
  `01-architecture.md`, a tabela de camadas, os Colaboradores e o Determinismo de `DES-0004`, a tabela de
  fronteiras e o teste de `DES-0008` e as linhas NFR-0002/NFR-0005 de `test-strategy.md` refletem isso.
- ISSUE-02 (error, D6) — fechado. `DES-0003` fixa `MAX_REPLAY_TEXT_CHARS` = 4 194 304 caracteres do texto
  recebido e `MAX_REPLAY_INPUT_STEPS` = 36 000 elementos de `inputs` (300 s simulados a 120 Hz; distinto
  de `MAX_LAP_STEPS` 6 000 do piloto de teste), ambos verificados antes de ler qualquer elemento, excesso
  `UNREADABLE`; a ordem das verificações de `readReplay` ganhou o passo do teto; `DES-0008` cita os limites;
  `DM-0001` seção 3 registra o teto na linha de `inputs` e o teto do texto; `test-strategy.md` acrescenta
  os fixtures `oversizedReplay()` e `oversizedReplayText()` e a prova de que nenhum elemento é lido.
- ISSUE-03 (error, D4) — fechado. Os cinco campos opcionais novos de `KartConfig` levam a unidade no
  sufixo: `steerApplyRatePerS`, `steerReturnRatePerS`, `yawTrackingGainPerS`, `yawCorrectGainPerS`,
  `slipDampingGainPerS` (`DES-0001`, tabela e prosa). `DM-0001` remete à tabela de `DES-0001` e
  `test-strategy.md` não nomeava esses campos; nada mais a propagar.
- ISSUE-04 (info, D2) — fechado. `DES-0001`: `scripts/keyboard-lap.ts:34`; `01-architecture.md`:
  `tests/race-lap-validation-frozen.test.ts:53-57`.
- ISSUE-05 (info, D8) — fechado. `docs/handling-device-log.md` marcado como **novo**, criado pela etapa de
  código no molde de `docs/lap-validation-bench.md`.
- ISSUE-06 (info, I4) e ISSUE-07 (info, D3) — nada a mudar, como o relatório pede; registrados aqui para
  que a decisão fique explícita: sem chave mestra por proibição do F-Spec (ADR-0001); o ponto de entrada
  "abrir um tempo ou replay gravado" de SCR-0002 fica com a feature que persistir registros (ADR-0002).
- `00-index.md` e `99-traceability.md` não foram tocados: o gate os regenera.

**Itens recusados, com motivo**: nenhum. Nenhum requisito foi enfraquecido; nenhuma divergência nova
(`98-divergences.md` inalterado); nenhum feedback a outra feature.

## 2026-10-21 — rodada 3, Mode B (mesmo relatório `dspec-validation-20261021-1722.md`; F-Spec movido a 2.0.0)

**Gatilho**: a rodada 2 deixou os sete pontos do relatório fechados, mas o F-Spec passou a 2.0.0 (seed
`revision: 2`, `fspec-validation-20261021-1750`, SUCCESS) antes de o validador deste estágio rodar de novo.
Esta rodada reverifica os pontos do relatório e carrega as decisões que o autor passou à invocação, sem
redescoberta: acerto agressivo de `DOMAIN/REF-02` (180 ms / 250 ms; 50 km/h na curva de referência de
raio 18 m; 200 ms e 400 ms mantidos; 0–60 km/h em 2,5 s; ≥ 105 km/h; volta do piloto de teste ≤ 25 s;
ensaio de resposta do volante mede só a guinada; ciclo `DOMAIN/DEC-10` = staging + feedback curto, sem
preset experimental); código na raiz do repositório, presets em `src/physics.ts`, benches em `scripts/`.

**O que mudou** (só valores, referências e prosa; nenhum módulo, tabela, campo, endpoint, componente,
ensaio ou parâmetro de ensaio acrescentado em relação ao conjunto reprovado, §16)

- ISSUE-01 a ISSUE-05: conferidos como aplicados nos arquivos (rodada 2); ISSUE-06 e ISSUE-07: nada a mudar.
  Os arquivos tocados na rodada 2 sem bump de versão (`01-architecture.md`, `DES-0003`, `DES-0008`,
  `ADR-0003`, `ADR-0004`) passam a 1.0.1 para que a população de revalidação os inclua.
- Limiares da revisão 2 carregados em todos os sítios: `DES-0001` (2.0.0: alavancas 180/250 ms e curva de
  18 m a 50 km/h; restrições numéricas recalculadas — ≥ 1 520 N médios para 0–60 km/h em 2,5 s com 228 kg,
  `governorSpeed` acima de 29,17 m/s mais a rampa, ao menos 1,09 g lateral na curva de referência; condição
  de forçar `state.speed > 50 / 3.6`); `DES-0004` (2.0.0: tabela de conversão — 180 ms comparado em ms
  sobre `toMs`, `toMs(21)` = 175 `PASS` e `toMs(22)` = 183 `FAIL`, 2 500 ms = 300 passos, 25 000 ms = 3 000,
  105 km/h = `105 / 3.6`, 50 km/h = `50 / 3.6`; `STEER_RESPONSE` ≤ 180/250; `REFERENCE_CORNER`,
  `UNDERSTEER_ONSET` e `GRASS_LOSS` a `50 / 3.6` m/s; `ACCELERATION` ≤ 2 500; `TOP_SPEED` ≥ `105 / 3.6`;
  `TEST_PILOT_LAP` ≤ 25 000); `test-strategy.md` (2.0.0: fixtures `moving(50 / 3.6)` e `forcingSequence`
  acima de 50 km/h; caminhos de AC-US-0001-01 a -04, AC-US-0003-02, AC-US-0004-01, -02, -04, AC-US-0005-03 e
  NFR-0005 com os valores novos); `98-divergences.md` (1.1.0: linhas de REQ-FEAT-0001-01 a -04,
  REQ-FEAT-0002-01 a -03, REQ-FEAT-0004-01/-02 e REQ-FEAT-0005-01 a -04 com a exigência da revisão 2; o
  estado atual do código, em `arquivo:linha`, não muda); `DES-0005` (1.0.1: literais proibidos em
  `src/main.ts` passam a `50 / 3.6` / `13.88`).
- Ciclo em staging (`DOMAIN/DEC-10`, RULE-0003 1.1.0, FEAT-0005 Configuração): `ADR-0001` (1.0.1,
  Consequências), `DM-0001` (1.0.1, seção 1), `DES-0004` (Estado e concorrência) e `DES-0007` (1.0.1,
  `<select>`) dizem que cada rodada de presets reprovada é substituída por nova `setupVersion`, nunca editada
  no lugar, que `PUBLISHED_SETUPS` segue com um registro por `setupId` (corrente e anterior) e que nenhum
  preset experimental entra no painel; todos os ensaios se repetem por rodada contra os mesmos limiares.
- `01-architecture.md` (1.0.1): cita o F-Spec 2.0.0 e a revisão 2 do seed. `DES-0004` nomeia "bench de
  física" ao lado de `npm run bench:physics`, como o F-Spec 2.0.0 passou a dizer; o nome do script é
  posicionamento deste estágio e permanece.
- `00-index.md` e `99-traceability.md` não foram tocados: o gate os regenera com `lint_artifacts.py --emit`.

**Tabela de migração** (conventions §17): nenhum item de projeto, ADR, modelo de dados, ensaio, fixture,
critério ou verificação retirado ou acrescentado; 8 DES, 1 DM, 4 ADR, 31 `AC-*` e 9 NFR cobertos antes e
depois; 16 divergências antes e depois.

**Itens fechados**: ISSUE-01 a ISSUE-05 (reconfirmados); ISSUE-06, ISSUE-07 (nada a mudar). Nenhum
`FB-<nn>` pendente.

**Itens recusados, com motivo**

- Os valores da revisão 1 (250/300 ms, 45 km/h, 3,0 s, 95 km/h, 27 s) não ficam como piso nem como
  alternativa: o F-Spec 2.0.0 diz "substitui".
- Arredondar 180 ms para 22 passos (183 ms): afrouxaria o limiar; a comparação é feita em ms sobre `toMs`,
  como RULE-0002 manda ("sem arredondar o valor medido").
- Constante exportada ou configurável para a velocidade da condição de forçar: seria superfície nova numa
  rodada de correção (§16) e configuração que FEAT-0005 proíbe; o literal `50 / 3.6` vive só em
  `src/physics.ts`, como o 12,5 anterior.
- Registro de `PUBLISHED_SETUPS` por rodada de staging (um literal por rodada reprovada): RULE-0003 só exige
  que a versão reprovada não seja editada no lugar e continue legível nos registros; a comparabilidade e a
  linha de base precisam só da versão anterior (`previousConfig`), e a reprodução usa sempre o acerto
  corrente (API-0002). Recusado como superfície nova sem requisito.
- Parâmetros de ensaio (`forcingSpeedMps` 16,7, `entrySpeedMaxMps` 25, janelas): inalterados; 16,7 m/s
  continua acima dos 50 km/h que `REAR_RECOVERY` exige, e nenhum requisito os move.
- Nenhum requisito foi enfraquecido; nenhuma divergência nova ou resolvida; nenhum feedback a outra feature
  (`race-lap-validation` não precisa mudar: os valores da revisão 2 só atingem os presets, os ensaios e os
  limiares desta feature).

## 2026-10-21 — rodada 4, Mode B (relatório `reports/dspec-validation/dspec-validation-20261021-1800.md`)

**O que mudou** (só o ponto do relatório; nenhum módulo, tabela, campo, endpoint, componente, ensaio ou
parâmetro de ensaio acrescentado em relação ao conjunto reprovado, §16)

- ISSUE-01 (error, D5/D2) — fechado. A linha `testPilot(config)` sai da tabela de símbolos de
  `scripts/keyboard-lap.ts` e entra na tabela de `scripts/handlingBench.ts` em `DES-0004` (2.0.1), com a
  mesma assinatura e descrição, acrescida de quem a importa (`TEST_PILOT_LAP`, `DETERMINISM`, `npm test` e
  `measureStepCost`); a tabela de `scripts/keyboard-lap.ts` fica só com `runtimeId()` e
  `measureStepCost(setup)`, e a descrição de `measureStepCost` diz "importado de `scripts/handlingBench.ts`".
  O sentido de dependência passa a ser um só em todo o conjunto: Aplicação (`keyboard-lap.ts`) importa a
  biblioteca de Simulação (`handlingBench.ts`), nunca o contrário. `test-strategy.md` (2.0.1) nomeia o módulo
  do fixture `testPilot(config)` na tabela de fixtures. `01-architecture.md:39`, `97-changelog.md` (rodada 1)
  e `DES-0004:41, 106` já diziam "da biblioteca" e não mudam.
- ISSUE-02 (info, I4) e ISSUE-03 (info, D3) — nada a mudar, como o relatório pede: sem chave mestra por
  proibição do F-Spec (ADR-0001); o ponto de entrada "abrir um tempo ou replay gravado" de SCR-0002 fica
  com a feature que persistir registros (ADR-0002).
- `00-index.md` e `99-traceability.md` não foram tocados: o gate os regenera com `lint_artifacts.py --emit`.

**Itens fechados**: ISSUE-01; ISSUE-02 e ISSUE-03 (nada a mudar). Nenhum `FB-<nn>` pendente.

**Itens recusados, com motivo**: nenhum. Nenhum requisito foi enfraquecido; nenhuma divergência nova ou
resolvida (`98-divergences.md` inalterado); nenhum feedback a outra feature.

## 2026-10-21 — rodada 5, Mode A (F-Spec 3.0.0, seed `revision: 3`; feedback do código `reports/feedback/feedback-20261021-1827.md`)

**Gatilho**: o F-Spec passou a 3.0.0 (`fspec-validation-20261021-1853`, SUCCESS) depois do FAIL SPEC da
rodada de código 1: a pista sintética não tem curva de 18 m e o regime da resposta do volante com acelerador
0 não é estacionário. Decisões do autor recebidas para esta rodada e carregadas sem redescoberta: a curva de
referência é um ensaio em pista de teste (arco de raio 18 m, faixa de `WIDTH`, sem paredes, ambiente de
ensaio próprio como o `TEST_PAD` de `src/physics.ts`); o ensaio de resposta do volante roda em reta com a
velocidade mantida em 50 km/h pelo acelerador e o regime é o valor estabilizado nessa condição (janela
curta, estacionária); só a volta do piloto de teste usa a pista sintética; o código parcial da rodada de
código 1 (`src/physics.ts` com `ARCADE_ASSISTIDO_V5` candidato, `src/setupRecords.ts`,
`scripts/handlingBench.ts`) é lido como as-built e o projeto vence; código na raiz do repositório, presets
em `src/physics.ts`, benches em `scripts/`. Os cinco itens do feedback do código que o F-Spec devolveu ao
projeto (SPEC-ISSUE-02 a 06) são resolvidos nesta rodada.

**O que mudou**

- `01-architecture.md` (2.0.0): F-Spec 3.0.0; estado as-built da rodada de código 1; o que a revisão 3 muda;
  tabela de camadas com os símbolos existentes e os novos de `src/physics.ts`; segundo diagrama (ensaios);
  compatibilidade da constante `TEST_PAD` e da linha de base; ADR-0005.
- `DES-0001` (3.0.0): linhas as-built de `src/physics.ts`; o candidato `ARCADE_ASSISTIDO_V5` como ponto de
  partida; **novos** `testPadLane`, `testPadArc` (pista de teste em reta e arco, largura `WIDTH`, raio
  18 m), `classifyHandlingSteps` + `StepClass` + `RECOVERY_MAX_STEPS` (classe "Recuperação" de RULE-0001,
  decidida na simulação) e o campo opcional `forcingRampMps` (padrão 0 = degrau as-built; margem entre a
  curva de referência com acelerador cheio e o ensaio de recuperação); restrição numérica do regime de
  guinada na faixa de 11 m.
- `DES-0002` (1.1.0): valor inicial de `surface` fixado como o literal `ASPHALT` de `emptyTelemetry`
  (`src/physics.ts:102`), com o motivo (SPEC-ISSUE-05); `surface` `GRASS` como "fora da faixa" na pista de
  teste; `wallContact` nunca verdadeiro ali.
- `DES-0003` (1.1.0): módulo existente (as-built), linhas citadas; sem mudança de interface.
- `DES-0004` (3.0.0): biblioteca existente e alterada, com o que muda marcado; `benchEnvironment` em todo
  registro e a tabela de ambientes; `STEER_RESPONSE` com `speedHoldMode` `THROTTLE_REGULATED` (acelerador
  0/1 por passo, função da velocidade anterior, nunca forçando), `speedHoldBandMps` 0,5, `holdMs` 600,
  `settleWindowMs` 200, `speedMinMps`/`speedMaxMps`, `SPEED_NOT_HELD` (SPEC-ISSUE-02); `REFERENCE_CORNER`,
  `UNDERSTEER_ONSET` e `REAR_RECOVERY` em `testPadArc(18, WIDTH)` com `arcEntry`, `arcRadiusM`, `laneWidthM`,
  parada no primeiro passo fora da faixa, `offAsphaltFirstStep` e posição (SPEC-ISSUE-01, fechado pelo seed e
  pelo F-Spec); `REAR_RECOVERY` com `gripReached`, `recoveryMs` condicional e `OFF_ASPHALT`; `NORMAL_DRIVING`
  por `classifyHandlingSteps`, um registro por ambiente, com `normalDrivingStepCount` e
  `excludedRecoveryStepCount` (SPEC-ISSUE-06); `BenchOptions.oldRecords` e `builtInOldRecords()`
  (SPEC-ISSUE-03) e `BenchOptions.realistaBaseline` (SPEC-ISSUE-04), ambos já no as-built e agora de
  projeto; `GRASS_LOSS` na pista sintética por `grassEntry` (índice 83, trecho reto); `ACCELERATION`/`TOP_SPEED`
  em `testPadLane`; `DETERMINISM` e `REALISTA_UNCHANGED` por ambiente; `TEST_PILOT_LAP` sem `lapValidity`
  (volta sem tempo reporta `toMs(MAX_LAP_STEPS)`); `REFERENCE_CORNER` sem `oversteerOrSlidingStepCount`
  (vai para a linha `#`); `baselineRecord` por ensaio, ambiente, geometria e variante; argumentos
  `--previous`/`--realista` de `bench:handling`.
- `DM-0001` (1.1.0): seção 4 com `benchEnvironment` e os campos da revisão 3; seção 5 com
  `entries[].parameters` e a resolução por ambiente e geometria; nota de que o candidato `arcade-assistido-v5`
  ainda não foi entregue sob esse identificador; M1/M2 marcados como feitos.
- `ADR-0003` (1.1.0): resolução da linha de base por ensaio, ambiente e geometria; alternativas recusadas
  (aceitar por `benchId`/`inputMode`; converter a medida da pista sintética). `ADR-0004` (2.0.0): parâmetros
  da revisão 3; precondições e motivos de falha; decisões 6 (entradas da biblioteca) e 7 (agregados por
  ambiente); consequência de que as medidas da rodada de código 1 não são comparáveis. `ADR-0005` (**novo**,
  1.0.0): pista de teste como geradores em `src/physics.ts`, velocidade mantida por acelerador regulado,
  classificador na simulação, grama no trecho reto da pista sintética; alternativas recusadas (curva da
  pista sintética; geometria só na biblioteca; acelerador constante parcial ou 1; velocidade imposta por
  fora; classificador na biblioteca; faixa mais larga).
- `DES-0007` (1.0.2): linhas as-built da saturação em `src/physics.ts` (`:116`, `:182`, `:189-190`); teste
  de contrato também afirma que `src/main.ts` não importa os símbolos de ensaio. `DES-0008` (1.0.2):
  fronteiras de `parameters`, do texto de `src/physics.ts` e de `oldRecords`.
- `test-strategy.md` (3.0.0): fixtures da pista de teste (`testPadLane`, `testPadArc`, `arcEntry`,
  `grassEntry`, regulador, sequências sintéticas do classificador, `baselineMarkdown()` com geometria
  diferente); caminhos dos critérios com `benchEnvironment`, `SPEED_NOT_HELD`, `OFF_ASPHALT` no arco,
  `gripReached`, `excludedRecoveryStepCount`, `DETERMINISM` e `REALISTA_UNCHANGED` por ambiente; NFR-0004
  com ambiente e parâmetros.
- `98-divergences.md` (2.0.0): todas as linhas recitadas contra a árvore depois da rodada de código 1
  (`scripts/handlingBench.ts`, `src/physics.ts`, `src/setupRecords.ts`, `src/main.ts`, `scripts/keyboard-lap.ts`,
  `scripts/physics-bench.ts`, `docs/physics.md`); 17 linhas abertas (a linha nova é REQ-FEAT-0003-02:
  o degrau de `forcingRearFrictionScale` a 50 km/h); o que a rodada de código 1 já satisfaz passa à lista
  final.
- Sem mudança de conteúdo, carregados na versão corrente: `DES-0005` (1.0.1), `DES-0006` (1.0.0),
  `ADR-0001` (1.0.1), `ADR-0002` (1.0.0) — nenhum item da revisão 3 os atinge (HUD, resultado, versão e
  replay não mudam com o ambiente dos ensaios), e as linhas de `src/main.ts` que citam continuam válidas.
- `00-index.md` e `99-traceability.md` não foram escritos: o gate os regenera com `lint_artifacts.py --emit`.

**Tabela de migração** (conventions §17): 8 DES e 1 DM antes e depois; ADR 4 → 5 (ADR-0005 novo);
31 critérios `AC-*` e 9 NFR cobertos antes e depois; 61 requisitos `REQ-*` do F-Spec 3.0.0 realizados (os
três novos — requisito 09 de FEAT-0001, requisito 09 de FEAT-0002, requisito 12 de FEAT-0003 — entram em
`DES-0004`, `DES-0001` e `ADR-0004`/`ADR-0005`); divergências 16 → 17 (uma nova; nenhuma resolvida: o
código da rodada 1 realiza partes do projeto anterior, não deste). Nenhum item de projeto, modelo, ensaio,
fixture ou verificação retirado. Parâmetros de ensaio que mudam de valor em relação à versão 2.0.1:
`holdMs` 2 000 → 600, `settleWindowMs` 500 → 200, acelerador do `STEER_RESPONSE` constante 0 → regulado
(`speedHoldMode`), `entryArcM` 20 e `cornerWindowMs` sobre a pista sintética → `arcEntry` e janela sobre o
anel de 18 m; parâmetros novos: `targetSpeedMps`, `speedHoldBandMps`, `laneWidthM`, `arcRadiusM`,
`grassEntryIndex`, `grassEntryOffsetM`, `grassEntryAngleRad`; parâmetros retirados: `entryArcM`
(a entrada do arco é o ponto tangente fixo). Campos de registro retirados em relação ao as-built, por não
serem do contrato: `oversteerOrSlidingStepCount` em `REFERENCE_CORNER`, `lapValidity` em `TEST_PILOT_LAP`.

**Itens fechados**: SPEC-ISSUE-02 (regime estacionário: velocidade mantida por acelerador regulado,
`holdMs` 600, `settleWindowMs` 200, `SPEED_NOT_HELD`), SPEC-ISSUE-03 (`BenchOptions.oldRecords` +
`builtInOldRecords()`), SPEC-ISSUE-04 (`BenchOptions.realistaBaseline`), SPEC-ISSUE-05 (`surface` inicial
é o literal `ASPHALT`), SPEC-ISSUE-06 (os passos de recuperação, até 400 ms, não entram em `NORMAL_DRIVING`;
os além de 400 ms entram). SPEC-ISSUE-01 fechado a montante (seed revisão 3, F-Spec 3.0.0) e carregado aqui
como `testPadArc(18, WIDTH)`. ISSUE-01 e ISSUE-02 (info) de `dspec-validation-20261021-1805`: nada a mudar
(sem chave mestra por proibição do F-Spec; abertura de registro gravado fica com a feature que persistir
registros). Nenhum `FB-<nn>` pendente para esta feature.

**Itens recusados, com motivo**

- Curva de referência de 24 m da pista sintética, ou geometria sintética de 18 m dentro da pista: o seed
  (revisão 3) e o F-Spec decidiram pela pista de teste; a pista sintética não muda (NFR-0008).
- `speedHoldMode` `THROTTLE_CONSTANT` com acelerador parcial: não é binário e falharia a paridade `BINARY`
  (NFR-0003); acelerador constante 1 satisfaria a condição de forçar (ADR-0005).
- Velocidade imposta por fora da simulação (zerar a aceleração longitudinal): caminho que o jogo não tem,
  superfície só de teste (I9; ADR-0005).
- Faixa da pista de teste mais larga que `WIDTH` para a reta: o F-Spec fixa "faixa da largura da pista"; a
  duração do ensaio (`holdMs` 600) é que se ajusta, com a conta registrada em `DES-0004`.
- `OFF_ASPHALT` como motivo de falha de `STEER_RESPONSE` e da precondição de `GRASS_LOSS`: API-0003 enumera
  os ensaios em que a saída do asfalto é motivo; fora deles a precondição não mantida segue a regra de
  ADR-0004 (`THRESHOLD_EXCEEDED`), para não alargar o contrato.
- Campo `oversteerOrSlidingStepCount` em `REFERENCE_CORNER` e `lapValidity` em `TEST_PILOT_LAP` (ambos no
  as-built): não são campos de API-0003; o primeiro vai para a linha `#` de apresentação, o segundo é
  substituído pela regra de `lapTimeMs` = `toMs(MAX_LAP_STEPS)` para volta sem tempo.
- Um único registro de `NORMAL_DRIVING`/`DETERMINISM`/`REALISTA_UNCHANGED` com `benchEnvironment` arbitrário:
  tornaria o campo falso; um registro por ambiente (ADR-0004, decisão 7).
- Classificador de recuperação dentro de `scripts/handlingBench.ts` (onde o as-built exclui `forcing`/drift):
  RULE-0001 é regra do passo e REQ-FEAT-0003-10 manda decidi-la na simulação; fica em `src/physics.ts`.
- Aceitar a linha de base por `benchId` e `inputMode` (as-built, `scripts/handlingBench.ts:275`) ou
  converter a medida da pista sintética para o arco: RULE-0002 exige o mesmo ensaio, ambiente e geometria e
  proíbe extrapolar (ADR-0003).
- Mudar `forcingSpeedMps` (16,7 m/s) ou `entrySpeedMaxMps` (25 m/s): nenhum requisito os move; a entrada
  do arco a 16,7 m/s está acima de 50 km/h como `REAR_RECOVERY` exige; a margem contra a curva de
  referência com acelerador cheio vem da alavanca `forcingRampMps`, não do parâmetro de ensaio.
- Editar os valores do candidato `ARCADE_ASSISTIDO_V5` neste estágio: são escolha da etapa de código pelos
  ensaios; o projeto fixa as alavancas e as restrições numéricas (DES-0001).
- Ambiente numérico dos ensaios de 0–60 km/h e velocidade estabilizada como limiar: lacuna deliberada do
  F-Spec; a reta da pista de teste é escolhida e reportada em `benchEnvironment`.
- Os itens recusados das rodadas 1 e 3 continuam recusados pelos mesmos motivos (editar `ARCADE_KART`;
  campos no `LapResult`; tela de replay; tolerância no `DETERMINISM`; custo por passo em `npm test`; chave
  mestra; valores da revisão 1 como piso; arredondar 180 ms para 22 passos; constante configurável da
  condição de forçar; registro de `PUBLISHED_SETUPS` por rodada de staging).
- Nenhum requisito foi enfraquecido; nenhuma divergência resolvida; nenhum feedback a outra feature
  (`race-lap-validation` não precisa mudar: a pista de teste não passa por `src/lap.ts` nem pelo dado de
  pista). A pasta do seed e `200 Requirements/230 Output/` não foram lidas (conventions §12): as decisões do
  autor vieram com a invocação e o F-Spec 3.0.0 carrega `SEED/RD-06` e `DOMAIN/REF-03`.

## 2026-10-22 — rodada 6, Mode A (F-Spec 3.0.0, seed `revision: 3`; feedback do código `reports/feedback/feedback-20261021-1827.md`)

**Gatilho**: nova execução do loop depois de a anterior (`dspec-loop-phases-20261021-1858`) ter sido
interrompida no validador, sem relatório. O conjunto da rodada 5 foi tratado como rascunho e conferido de
novo contra o F-Spec validado (`fspec-validation-20261021-1853`, SUCCESS) e contra a árvore. Decisões do
autor recebidas para esta rodada e carregadas sem redescoberta (as mesmas da rodada 5): curva de referência
como ensaio na pista de teste (arco de raio 18 m, faixa de `WIDTH`, sem paredes, ambiente próprio como o
`TEST_PAD` de `src/physics.ts`); resposta do volante em reta com a velocidade mantida em 50 km/h e regime
estacionário; só a volta do piloto de teste na pista sintética; os itens SPEC-ISSUE-02 a 06 do feedback
resolvidos; código parcial lido como as-built, o projeto vence; código na raiz, presets em
`src/physics.ts`, benches em `scripts/`.

**Verificação do método sobre a árvore** (conventions §12 permite ler a raiz de código; nada foi escrito
nela): as definições deste projeto foram executadas sobre `src/physics.ts`, `src/track.ts` e
`scripts/handlingBench.ts` da rodada de código 1, com scripts fora do repositório, para conferir que cada
ensaio é alcançável. Os números estão nos itens que os usam (DES-0001, DES-0004, ADR-0004, ADR-0005,
`98-divergences.md`) e nenhum é linha de base.

**O que mudou**

- `DES-0004` (3.1.0): `judge(record, observed?)` — o segundo argumento leva a precondição não mantida que o
  ensaio vê no traço e que nenhum campo de API-0003 carrega (kart fora da faixa em `STEER_RESPONSE`,
  `UNDERSTEER_ONSET` e `REAR_RECOVERY`; grama não mantida em `GRASS_LOSS`; V1 não determinado), de modo que
  `judge` continua a fonte única do veredito; a rodada 5 dizia que `judge` decidia "só dos campos" e, ao
  mesmo tempo, fazia vereditos depender de condições fora deles. `UNDERSTEER_ONSET`: a varredura termina
  na primeira execução que sai da faixa; V1 vem dos passos no asfalto, inclusive da execução que depois
  sai; `maxUndersteerMsBySpeed` só com execuções completas acima de V1; saída a 50 km/h ou antes de V1 é
  `OFF_ASPHALT`; teto sem V1 é `THRESHOLD_EXCEEDED`; sem V1, `v1Mps` é a última velocidade executada e o
  registro é `FAIL`. `baselineRecord` só aceita como V0 um registro com V1 determinado. `grassEntry` com o
  lado de fora definido por fórmula (o oposto à origem). `testPilot` e todos os parâmetros de ensaio fixos.
  `--previous` e `--realista` não passam linha de base. Prova de método da fase A de `STEER_RESPONSE` com o
  regime medido. Linha `#` com os diagnósticos novos.
- `ADR-0004` (2.1.0): Contexto com os fatos medidos (pista de 368,5 m; o piloto anterior, com teto de
  13 m/s, não desce de 28,35 s; `ARCADE_KART` com o piloto da biblioteca em 26 703 ms; `understeer` de
  `ARCADE_KART` já a 50 km/h; durações cortadas pela saída caindo com a velocidade); decisão 2 fixa todos os
  parâmetros, o piloto inclusive; decisão 3 com `observed`; decisão 8 nova (varredura até a primeira saída);
  alternativas recusadas correspondentes; consequências sobre `baselineLapTimeMs` e o V0 da linha de base.
  Fontes: `REQ-FEAT-0002-04`, `-05`, `-09` acrescentadas.
- `ADR-0003` (1.2.0): as execuções que produzem linha de base não recebem linha de base; um registro de
  `UNDERSTEER_ONSET` sem V1 determinado não serve de V0.
- `ADR-0005` (1.1.0): o lado e a geometria da entrada na grama, com a medida de que os 120 passos ficam na
  grama sem tocar a parede; o trecho de grama deixa de ser ajustável pela etapa de código; motivo da
  alternativa "classificador na biblioteca" corrigido (REQ-FEAT-0003-10).
- `DES-0001` (3.1.0): `forcingRampMps` calculado uma vez por passo em `step`, sobre o mesmo `state.speed`
  de `isForcing`; alavancas com o que foi medido (`oversteer` na curva de referência com acelerador cheio
  pelo degrau as-built; nenhum V1 com o candidato); a guinada de 0,95 rad/s passa a ser dita teto, com o
  regime medido de 0,72 rad/s; o compromisso entre força motriz, curva de referência com acelerador cheio e
  recuperação declarado; linhas `tests/race-lap-validation-frozen.test.ts:31-60` e
  `tests/maneuvers.test.ts:63-67` corrigidas.
- `DM-0001` (1.2.0): seção 5 com a condição de V1 determinado para V0 e os vereditos dos registros de uma
  entrada de linha de base.
- `DES-0003` (1.1.1): `compareLapRecords` compara a pista por igualdade estrita "sem normalização" (a
  rodada 5 dizia "após normalização" e o contrário na mesma frase); linhas citadas.
- `01-architecture.md` (2.1.0): linhas `tests/race-lap-validation-frozen.test.ts:48-51`/`:53-60` e
  `tests/race-lap-validation-contract.test.ts:34-41` corrigidas; parágrafo da revisão 3 e linha de
  ADR-0004 com a varredura e os parâmetros fixos. `ADR-0002` (1.0.1): mesma linha do teste de contrato.
- `test-strategy.md` (3.1.0): caminhos de AC-US-0002-03 e -04 para a varredura nova e a condição de V0;
  `observed` nos caminhos de AC-US-0001-06, AC-US-0003-03 e AC-US-0004-03; `syntheticReading()` sem a
  sugestão de que a biblioteca importa de `tests/`; `grassEntry` com a geometria.
- `98-divergences.md` (2.1.0): linhas de REQ-FEAT-0002-04/-05/-07, REQ-FEAT-0003-02, REQ-FEAT-0004-01/-02 e
  REQ-FEAT-0005-01 a -04 com `arquivo:linha` adicionais e o que foi medido do candidato; 17 linhas abertas,
  como antes.
- Sem mudança de conteúdo, carregados na versão corrente: `DES-0002` (1.1.0), `DES-0005` (1.0.1),
  `DES-0006` (1.0.0), `DES-0007` (1.0.2), `DES-0008` (1.0.2), `ADR-0001` (1.0.1).
- `00-index.md` e `99-traceability.md` não foram escritos: o gate os regenera com `lint_artifacts.py --emit`.

**Tabela de migração** (conventions §17): 8 DES, 1 DM e 5 ADR antes e depois; 61 requisitos `REQ-*`, 31
critérios `AC-*` e 9 NFR realizados antes e depois; 17 divergências antes e depois. Nenhum item de projeto,
ensaio, fixture ou verificação retirado. Interface que muda: `judge` ganha o segundo argumento opcional
`observed`. Parâmetros de ensaio: nenhum valor muda; `entrySpeedMaxMps` passa de limite da varredura a
teto de segurança; `maxSpeedMps`, `lateralBudgetMps2` e `grassEntryIndex` deixam de ser ajustáveis pela
etapa de código. Nenhum campo de registro de API-0003 acrescentado ou retirado.

**Itens fechados**: SPEC-ISSUE-02 (regime estacionário: velocidade mantida por acelerador regulado,
`holdMs` 600, `settleWindowMs` 200, `SPEED_NOT_HELD`; agora com a medida do método), SPEC-ISSUE-03
(`BenchOptions.oldRecords` + `builtInOldRecords()`; a biblioteca não importa de `tests/`), SPEC-ISSUE-04
(`BenchOptions.realistaBaseline`), SPEC-ISSUE-05 (`surface` inicial é o literal `ASPHALT`), SPEC-ISSUE-06 (os
passos de recuperação, até 400 ms, não entram em `NORMAL_DRIVING`; os além de 400 ms entram) — os cinco
carregados da rodada 5 e reconferidos. SPEC-ISSUE-01 fechado a montante (seed revisão 3, F-Spec 3.0.0).
Nenhum `ISSUE-<nn>` pendente (a rodada 5 não chegou a ter relatório); nenhum `FB-<nn>` pendente.

**Itens recusados, com motivo**

- Toda saída da faixa em `UNDERSTEER_ONSET` como `OFF_ASPHALT`, como a linha de erro de API-0003 e a
  alternativa de FLOW-0002 dizem ao pé da letra: com a varredura subindo até sair da faixa — o que ocorre
  com qualquer kart, porque a 90 km/h só 2,7 g caberiam no arco —, o ensaio reprovaria todo acerto e
  REQ-FEAT-0002-04/-05 ficariam inalcançáveis por construção. O projeto aplica `OFF_ASPHALT` à saída a
  50 km/h e à saída antes de V1 (as falhas do ensaio) e trata a saída depois de V1 como o fim da varredura
  mensurável, sem medir nada fora do asfalto (ADR-0004, decisão 8). A mesma linha de API-0003 já havia sido
  apontada pelo validador do F-Spec (`fspec-validation-20261021-1853`, ISSUE-01, aviso) por citar um campo
  que o registro de `UNDERSTEER_ONSET` não tem; nenhum requisito muda e nenhum feedback ao F-Spec é escrito.
- Teto da varredura abaixo da velocidade de saída da faixa: seria um parâmetro moldado ao acerto para o
  ensaio passar (ADR-0004).
- Contar em `maxUndersteerMsBySpeed` a duração cortada pela saída da faixa: cai com a velocidade por
  geometria e mede subesterço fora do asfalto (ADR-0004).
- Campos de saída da faixa em `UNDERSTEER_ONSET` e `REAR_RECOVERY`: o contrato de API-0003 não os tem; a
  posição e o passo saem na linha `#` e o veredito vem por `observed`.
- Piloto de teste e trecho de grama ajustáveis pela etapa de código (como a rodada 5 permitia): mudariam a
  régua junto com o acerto; ficam fixos.
- Piloto do programa anterior (teto de 13 m/s): a volta não desceria de 28,35 s com acerto algum.
- Tomar como "linha de base citada" os cerca de 31 400 ms de API-0003: é o tempo de outro piloto; a linha
  de base é o mesmo ensaio (RULE-0002), e `baselineLapTimeMs` vem do bloco de `docs/physics.md`.
- Mudar o classificador `handling()` de `src/physics.ts:153-160` para chamar de subesterço o kart que sai
  de frente com a frente sem saturar: mudaria a telemetria do Realista e do HUD; o projeto dá as
  alavancas (`assistSteerAllowanceRad`, `assistLateralG`) para a frente avisar no asfalto.
- Editar os valores do candidato `ARCADE_ASSISTIDO_V5` neste estágio: são escolha da etapa de código pelos
  ensaios; as medidas desta rodada só mostram onde ele ainda não atende.
- Os itens recusados das rodadas 1, 3 e 5 continuam recusados pelos mesmos motivos.
- Nenhum requisito foi enfraquecido; nenhuma divergência resolvida; nenhum feedback a outra feature
  (`race-lap-validation` não muda). A pasta do seed e `200 Requirements/230 Output/` não foram lidas
  (conventions §12).

## 2026-10-22 — rodada 7, Mode B (relatório `reports/dspec-validation/dspec-validation-20261022-1331.md`; F-Spec 3.2.0)

**Gatilho**: o relatório FAIL `dspec-validation-20261022-1331` (`ISSUE-01` e `ISSUE-02`, erros, D3;
`ISSUE-03`, aviso, D1; `ISSUE-04`, aviso, D8; `ISSUE-05` e `ISSUE-06`, info). Depois dele o F-Spec passou a
3.2.0 (rodadas 7 e 8 do seu changelog, `status: validated`), absorvendo a decisão do dono do produto que
a `ISSUE-01` pedia ao dono do F-Spec. Decisão do autor recebida para esta rodada e carregada sem
redescoberta: no ensaio de início do subesterço (`UNDERSTEER_ONSET`, velocidade subindo no arco de 18 m),
sair da faixa abaixo de 50 km/h reprova (`OFF_ASPHALT`); sair acima de 50 km/h é o fim natural da varredura
e não reprova, desde que pelo menos duas velocidades acima de 50 km/h tenham sido medidas antes da saída;
saída antes da segunda medição acima de 50 km/h reprova por falta de medida (`MEASUREMENT_MISSING`, motivo
distinto de `OFF_ASPHALT`). Código na raiz do repositório; presets em `src/physics.ts`; benches em
`scripts/`. A pasta do seed e `200 Requirements/230 Output/` não foram lidas (conventions §12): a decisão
chega a este estágio por RULE-0002, API-0003, FLOW-0002 e FEAT-0002 3.2.0.

**Verificação do método sobre a árvore** (leitura da raiz de código, nada escrito nela): a varredura em
patamares deste projeto (patamares de 1 000 ms, passo de 0,5 m/s, acelerador regulado, esterço `+1`, anel
de raio 18 m e faixa de 11 m, `driverMass` 75) foi executada sobre `src/physics.ts` da rodada de código 1
com um script fora do repositório. `ARCADE_KART`: 808 ms de `understeer` consecutivo no patamar de 50 km/h
(V0 = 50 km/h) e saída da faixa a 51,7 km/h dentro do patamar de 51,8 km/h. Candidato
`ARCADE_ASSISTIDO_V5`: 0 ms no patamar de 50 km/h e saída a 49,3 km/h durante a subida para o patamar de
51,8 km/h, depois de 247 passos sob a condição de forçar. Os números estão em ADR-0003, ADR-0004, DES-0001 e
`98-divergences.md`; nenhum é linha de base.

**O que mudou**

- `ISSUE-01` (erro, D3 — veredito da saída da faixa e `maxUndersteerMsBySpeed` de `UNDERSTEER_ONSET`
  contra API-0003 e FLOW-0002): o projeto passa a realizar a varredura que API-0003, RULE-0002 ("Fim da
  varredura de início do subesterço"), FLOW-0002 e FEAT-0002 3.2.0 definem, em todos os sítios do fato.
  `ADR-0004` (3.0.0): Contexto com a regra do F-Spec 3.2.0 e a medida acima; decisão 2 com `plateauMs`
  1 000 e `plateauSpeedHoldMode` `THROTTLE_REGULATED` (a duração do patamar e o modo de manter a sua
  velocidade, que RULE-0002 manda registrar em `docs/physics.md`) e `entrySpeedMaxMps` como velocidade-alvo
  máxima de patamar; decisão 3 com o que vai por campo e o que vai por `observed`; decisão 8 reescrita (uma
  execução contínua no anel; subida e fase mantida por patamar; V1 e pares só de patamares completos; a
  saída decidida pela velocidade do kart no passo da saída; ordem dos motivos; os dois casos que RULE-0002
  não decide fazem a biblioteca lançar); alternativas e consequências correspondentes; `REQ-FEAT-0002-10`
  nas fontes. `DES-0004` (4.0.0): `BenchRecord` de `UNDERSTEER_ONSET` com `offAsphaltStepCount`,
  `offAsphaltFirstStep`, posição, `v1Mps` opcional e pares `[plateauSpeedMps, maxUndersteerMs]`;
  `FailReason` com `MEASUREMENT_MISSING`; `BENCH_PARAMETERS` com os dois parâmetros de patamar; `judge` com
  `observed` só para `GRASS_LOSS` e para a saída abaixo de 50 km/h em `UNDERSTEER_ONSET`; `baselineRecord`
  aceita como V0 o registro com `v1Mps`, qualquer que seja o seu `failReason`, e exige o mesmo método
  (`entrySpeedStepMps`, `plateauMs`, `plateauSpeedHoldMode`); `runBench` declara o erro dos casos sem
  decisão; linha `UNDERSTEER_ONSET` da tabela de ensaios reescrita; `NORMAL_DRIVING` agrega a varredura;
  linha `#` com a velocidade no passo da saída; tabela de falha com as saídas de `UNDERSTEER_ONSET` e os
  casos sem decisão; `REQ-FEAT-0002-10` nas fontes. `test-strategy.md` (4.0.0): regulador de velocidade e
  `baselineMarkdown()` para os patamares e para o V0 por `v1Mps`; caminhos de AC-US-0002-03, -04 e -05
  reescritos; caminho novo de AC-US-0002-06 (critério novo do F-Spec 3.2.0), por `judge` sobre registros
  sintéticos e pela varredura real; NFR-0003 e NFR-0004 com os patamares. `ADR-0003` (1.3.0): decisões 2, 3
  e 5 com o V0 tirado de `v1Mps` e o mesmo método. `DM-0001` (1.3.0): seção 4 com `MEASUREMENT_MISSING`,
  os campos de API-0003 3.1.0/3.2.0 e os parâmetros de patamar; seção 5 com a resolução de V0. `DES-0001`
  (3.2.0): alavancas `assistSteerAllowanceRad` e `forcingRampMps` descritas sobre a varredura em patamares,
  com a medida acima; `MEASUREMENT_MISSING` em Observabilidade; `REQ-FEAT-0002-10` nas fontes.
  `01-architecture.md` (2.2.0): F-Spec 3.2.0; parágrafo da revisão 3 e linha de ADR-0004 com a varredura
  em patamares. `98-divergences.md` (2.2.0): linha de REQ-FEAT-0002-04/-05/-07 passa a incluir -10, com a
  exigência nova e o `arquivo:linha` do que o as-built faz.
- Carregados nos mesmos sítios que a `ISSUE-01` reescreve, porque cada um deles afirma servir API-0003
  campo a campo e ficaria falso contra a 3.2.0: a saída da faixa da reta em `STEER_RESPONSE` deixa de
  reprovar (`DES-0004`, linha `STEER_RESPONSE` e tabela de falha; `ADR-0004`, decisão 3; `test-strategy.md`,
  AC-US-0001-06), como API-0003 e FLOW-0002 3.2.0 dizem; `REAR_RECOVERY` julga a saída da faixa pelos campos
  `offAsphaltStepCount`, `offAsphaltFirstStep` e posição que API-0003 3.1.0 lhe deu, em vez de `observed`
  (`DES-0004`; `ADR-0004`, decisão 3; `test-strategy.md`, AC-US-0003-03 e -07; `98-divergences.md`);
  `driftScore` passa a `driftScorePoints` (`DES-0004`; `test-strategy.md`, AC-US-0003-06;
  `98-divergences.md`).
- `ISSUE-02` (erro, D3 — `TEST_PILOT_LAP.sectorMs`): `DES-0004` fixa `sectorMs` em 4 inteiros sempre — na
  volta `VALID` os quatro de `LapResult.sectorMs`; na volta inválida ou não encerrada, os setores concluídos
  seguidos de `toMs(MAX_LAP_STEPS)` para cada setor não concluído, o teto de `lapTimeMs` —, também na tabela
  de falha; `test-strategy.md`, caminho de contrato de AC-US-0005-03, afirma o comprimento 4, a soma igual a
  `lapTimeMs` na volta válida e `[50000, 50000, 50000, 50000]` com um controlador parado por
  `testPilotLapWith`; `98-divergences.md`, linha de REQ-FEAT-0005-01 a -04, cita
  `scripts/handlingBench.ts:384-385`.
- `ISSUE-03` (aviso, D1): `01-architecture.md`, mensagem `M-->>J` do primeiro `sequenceDiagram`, com `,` no
  lugar de `;`.
- `ISSUE-04` (aviso, D8): E2E-02 passa a esperar `—` ao trocar de acerto e ao voltar ao Arcade (a troca
  zera `bestRecord`, `DES-0006`), e só o tempo da volta do Realista depois de completá-la; `DES-0006` fica
  como está.
- `ISSUE-05` e `ISSUE-06` (info): nada a mudar, como o relatório diz.
- Versões: `ADR-0004` 3.0.0, `DES-0004` 4.0.0, `test-strategy.md` 4.0.0, `ADR-0003` 1.3.0, `DM-0001` 1.3.0,
  `DES-0001` 3.2.0, `01-architecture.md` 2.2.0, `98-divergences.md` 2.2.0, este changelog 2.2.0. Intocados:
  `DES-0002`, `DES-0003`, `DES-0005`, `DES-0006`, `DES-0007`, `DES-0008`, `ADR-0001`, `ADR-0002`,
  `ADR-0005`. `00-index.md` e `99-traceability.md` não foram escritos: o gate os regenera com
  `lint_artifacts.py --emit`.

**Superfície (conventions §16)**: nenhum módulo, item de projeto, ADR, modelo de dados, tabela, endpoint,
tela ou componente acrescentado. Os elementos novos nas interfaces existentes são os que o contrato a montante
já carrega e que a `ISSUE-01` manda servir campo a campo: o valor `MEASUREMENT_MISSING` (API-0003 3.1.0), os
campos de saída da faixa de `UNDERSTEER_ONSET` e `REAR_RECOVERY` (API-0003 3.1.0), o elemento
`plateauSpeedMps` do par (API-0003 3.1.0, renomeado na mudança de significado), `v1Mps` condicional e
`driftScorePoints` (API-0003 3.2.0, renomeação); e os parâmetros `plateauMs` e `plateauSpeedHoldMode`, a
duração do patamar e o modo de manter a sua velocidade que RULE-0002 3.2.0 nomeia como parâmetros de ensaio
registrados em `docs/physics.md` (AC-US-0002-04). Nada além do que o F-Spec 3.2.0 nomeia.

**Tabela de migração** (conventions §17): 8 DES, 1 DM e 5 ADR antes e depois. Requisitos `REQ-*`
realizados: 61 antes, 62 depois (`REQ-FEAT-0002-10`, novo no F-Spec 3.2.0); critérios `AC-*` com caminho de
teste: 31 antes, 32 depois (AC-US-0002-06); 9 NFR antes e depois; 17 divergências antes e depois (quatro
linhas com exigência ou `arquivo:linha` atualizados). Nenhum caminho de critério retirado. Modificados:
`UNDERSTEER_ONSET` passa de uma execução por velocidade de entrada a uma varredura contínua em patamares; o
ramo "teto atingido sem V1 → `THRESHOLD_EXCEEDED`" e o ramo "saída depois de V1 encerra sem falha" deixam de
existir (substituídos pela decisão de RULE-0002 e pelo erro dos casos sem decisão); `observed` deixa de
valer para `STEER_RESPONSE` (sem efeito) e para `REAR_RECOVERY` (campos); no caminho de AC-US-0001-06, a
afirmação "nenhum passo do traço tem `surface` `GRASS`" sai, porque API-0003 3.2.0 diz que essa saída não
altera o veredito, e entra a afirmação de que um registro julgado com `observed` continua `PASS`; no
caminho de AC-US-0003-03, `observed` `OFF_ASPHALT` é trocado pelos campos. Parâmetros de ensaio: dois
acrescentados (`plateauMs`, `plateauSpeedHoldMode`); `entrySpeedMaxMps` mantém nome e valor e passa a ser
a velocidade-alvo máxima de patamar; nenhum outro valor muda.

**Itens fechados**: `ISSUE-01`, `ISSUE-02`, `ISSUE-03`, `ISSUE-04` de `dspec-validation-20261022-1331`;
`ISSUE-05` e `ISSUE-06` sem mudança. Nenhum `FB-<nn>` pendente.

**Itens recusados, com motivo**

- Primeira alternativa da `ISSUE-01` (toda saída da faixa em `UNDERSTEER_ONSET` como `OFF_ASPHALT`, com um
  fim de varredura independente do acerto): não tomada. A segunda alternativa ocorreu a montante — o F-Spec
  3.2.0 passou a admitir o fim da varredura pela saída da faixa acima de 50 km/h —, e o projeto a segue.
- Alternativa da `ISSUE-04` (`DES-0006` deixar de zerar `bestRecord` na troca de acerto): não tomada. Os
  zeramentos de `src/main.ts:226` (peso) e `:233` (acerto) ficam como estão; o de peso é necessário porque
  `compareLapRecords` não vê o peso do piloto, e com um único `bestRecord` sem zeramento o tempo do Arcade
  ficaria guardado enquanto o do Realista nunca seria mostrado. A correção menor é o roteiro esperar `—`.
- Veredito para os dois casos que RULE-0002 não decide (saída exatamente a 50 km/h; varredura sem saída da
  faixa): não inventado. A biblioteca lança e nenhum registro é emitido (ADR-0004, decisão 8). Proposta ao
  autor para `SCOPE-BACKLOG.md`: "2026-10-22 dspec-loop rodada 7 — `UNDERSTEER_ONSET`: que resultado tem a
  varredura que termina sem sair da faixa (último patamar concluído, ou velocidade que deixa de subir)?"; a
  proposta da rodada 7 dos requisitos sobre a saída exatamente a 50 km/h segue valendo.
- Velocidade do kart no passo da saída como campo de `UNDERSTEER_ONSET`: não acrescentada (não é campo de
  API-0003; seria superfície numa rodada de correção, §16); vai para a linha `#` e chega a `judge` por
  `observed`. A proposta de `SCOPE-BACKLOG.md` da rodada 7 do F-Spec sobre esse campo segue com o autor.
- Acelerador parcial para manter o patamar sem a condição de forçar: recusado (em `BINARY` o acelerador é 0
  ou 1, e o ensaio usa a forma de `Input` do adaptador); a consequência para o acerto está em ADR-0004 e
  DES-0001 (`forcingRampMps`).
- Janela própria para a subida de cada patamar: recusada (parâmetro a mais); o critério e o teto de
  `TOP_SPEED` dizem quando a velocidade deixou de crescer.
- Os itens recusados das rodadas 1, 3, 5 e 6 continuam recusados pelos mesmos motivos, salvo dois da rodada
  6 que o F-Spec 3.1.0/3.2.0 superou: "toda saída da faixa em `UNDERSTEER_ONSET` como `OFF_ASPHALT`" (agora
  decidida por RULE-0002 pela velocidade no passo da saída) e "campos de saída da faixa em `UNDERSTEER_ONSET`
  e `REAR_RECOVERY`" (agora campos de API-0003, servidos acima).
- Nenhum requisito foi enfraquecido; nenhuma divergência resolvida ou acrescentada; nenhum feedback a outra
  feature (`race-lap-validation` não muda).

## 2026-10-27 — rodada 8, Mode C (feedback do código `reports/feedback/feedback-20261022-1803.md`, SPEC-ISSUE-01 e SPEC-ISSUE-02; feedback cruzado `reports/feedbacks/race-lap-validation/feedback-20261022-1703.md`, FB-01; F-Spec 3.3.0)

**Gatilho**: o FAIL SPEC da rodada de código 2 (`feedback-20261022-1803`: SPEC-ISSUE-01, V1 não medida por um
acerto que nunca sai de frente até sair da faixa; SPEC-ISSUE-02, a curva de referência com acelerador 0 sai
do anel pelo lado interno) e o feedback cruzado pendente de `race-lap-validation` (`feedback-20261022-1703`,
FB-01, mais novo que `dspec-validation-20261022-1615`), resolvidos numa única rodada Mode C (conventions
§14). O loop `dspec-loop-phases-20261022-1904` começou em 2026-10-22 e foi interrompido antes de registrar
esta entrada; retomado em 2026-10-27, o conjunto escrito na primeira tentativa foi conferido de novo contra o
F-Spec 3.3.0 (`status: validated`) e contra a árvore (commit `0068a57`), com uma correção (o número desta
rodada em `ADR-0002`).

**Decisões do autor recebidas para esta rodada e carregadas sem redescoberta** (dono do produto, 2026-10-22,
após o FAIL SPEC do código; chegam a este estágio por FEAT-0002, RULE-0002, API-0003 e FLOW-0002 3.3.0):
(1) `DOMAIN/DEC-12` — quando a varredura em patamares no arco de 18 m termina pela saída da faixa acima de
50 km/h sem a telemetria ter reportado `understeer` em nenhum patamar, V1 é a velocidade mantida do patamar
interrompido pela saída e "V1 ≥ 1,15 × V0" é avaliado com esse valor; nunca sair de frente até sair da faixa
cumpre o critério; o rótulo `understeer` não muda. (2) `DOMAIN/DEC-13` — na curva de referência entrando a
50 km/h com acelerador 0, o único critério é "sem `understeer` por mais de 200 ms consecutivos"; permanecer
na faixa enquanto desacelera não é exigido; a variante com acelerador cheio continua exigindo permanência na
faixa e ausência de `understeer`/`oversteer`. `DOMAIN/REF-05` — "sem `understeer`" é nenhuma sequência acima
de 200 ms consecutivos, não tolerância zero. Nenhum outro limiar muda. Código na raiz do repositório;
presets em `src/physics.ts`; benches em `scripts/handlingBench.ts`. FB-01: **aceitar** — o `LapResult` de
`race-lap-validation` carrega `setupId?` e `setupVersion?` copiados do pedido `startLap` (API-0001 e
API-0002 1.1.0 daquela feature); `buildLapRecord` preenche só o que o resultado não traz; `beginLap` em
`src/main.ts` informa os dois campos; a linha de divergência correspondente é assumida aqui. O código da
rodada 2 (`src/physics.ts` com `ARCADE_ASSISTIDO_V5`, `scripts/handlingBench.ts`, `src/setupRecords.ts`,
`src/handlingMessages.ts`, `src/main.ts`) é o as-built; o projeto vence.

**O que mudou**

- SPEC-ISSUE-01 (V1 num acerto que não sai de frente; `DOMAIN/DEC-12`):
  - `DES-0004` (5.0.0): `UNDERSTEER_ONSET` — `v1Mps` definido em todo fim natural da varredura: o menor
    `plateauSpeedMps` de patamar completo com `understeer` por mais de 200 ms consecutivos ou, sem nenhum
    patamar assim, o alvo do patamar interrompido pela saída; `v1Mps` ausente só nos desfechos em que a
    saída reprova por si (`OFF_ASPHALT`, `MEASUREMENT_MISSING`) sem patamar completo em subesterço; ordem do
    veredito: `OFF_ASPHALT` (por `observed`) → `MEASUREMENT_MISSING` (menos de 2 pares, único caso desse
    motivo) → `BASELINE_MISSING` → limiares; o fim natural nunca produz `MEASUREMENT_MISSING` (o caso (b) de
    API-0003 3.2.0 deixa de existir) e um registro de fim natural sem `v1Mps` faz `judge` lançar
    (malformado); `baselineRecord`/`understeerBaselineRecord` só aceitam como V0 um `v1Mps` que é velocidade
    de patamar completo com subesterço (`50 / 3.6`, ou um par com `maxUndersteerMs > 200`), nunca o do
    patamar interrompido; a linha `#` diz de onde `v1Mps` veio, em três textos, inclusive "sem início de
    subesterço até a saída da faixa" (apresentação, não campo); tabela de falha e Observabilidade
    correspondentes.
  - `ADR-0004` (4.0.0): Contexto com os fatos medidos pela rodada de código 2 (3 103 acertos avaliados; o
    rótulo `understeer` exige deriva dianteira > 0,09 rad e > 1,2 × a traseira e o kart assistido chega ao
    limite com os dois eixos derivando por igual; a folga de esterço não depende da velocidade; 7 patamares
    completos sem `understeer`, saída a 56,1 km/h, patamar interrompido de 64,4 km/h); decisão 8 reescrita
    (V1 nos dois casos; ordem dos motivos); decisão 10 nova (V0 nunca tirado de velocidade sem subesterço);
    alternativas recusadas; consequências com os dois caminhos de `PASS` — patamar completo de 59,0 km/h ou
    mais com subesterço, ou saída acima de 50 km/h com o patamar interrompido de alvo ≥ 59,0 km/h depois de
    pelo menos dois patamares completos — e o acerto entregue no segundo.
  - `ADR-0003` (1.4.0): decisões 2 e 5 — V0 só de patamar completo com subesterço; o `v1Mps` do patamar
    interrompido não serve de V0; Contexto com o bloco `handling-baseline` escrito pela rodada de código 2.
  - `DM-0001` (2.0.0): seção 4 (`v1Mps` presente em todo fim natural) e seção 5 (resolução de V0 com a
    condição acima; V0 de hoje = 13,89 m/s, da entrada `arcade-assistido-v4`).
  - `DES-0001` (3.3.0): as alavancas `assistSteerAllowanceRad`, `assistLateralG` e `forcingRampMps` lidas
    à luz de `DEC-12` — a frente não precisa avisar antes da saída da faixa; `handling()` (`:156-163`) não
    muda; nenhuma alavanca dependente da velocidade acrescentada; linhas as-built da rodada de código 2
    (`:73-83`, `:170-178`, `:363-385`) e as medidas de `docs/physics.md:250-255`.
  - `98-divergences.md` (3.0.0): linha de REQ-FEAT-0002-04, -05, -07, -10 reescrita contra
    `scripts/handlingBench.ts:311`, `:344`, `:355`, `:363-367`, `:672`.
  - `test-strategy.md` (5.0.0): caminhos de AC-US-0002-03, -05 e -06 (registros sintéticos de fim natural
    com V1 do patamar interrompido e com V1 de patamar completo; `judge` lança no malformado;
    `baselineMarkdown()` com registro cujo `v1Mps` veio do patamar interrompido dá `BASELINE_MISSING`).
- SPEC-ISSUE-02 (curva de referência com acelerador 0; `DOMAIN/DEC-13`):
  - `DES-0004`: `REFERENCE_CORNER` com `THROTTLE_ZERO` percorre os 300 passos da janela esteja o kart onde
    estiver; `maxUndersteerMs` medido em todos os passos, dentro e fora da faixa; `offAsphaltStepCount`
    informativo (0 a 300), com `offAsphaltFirstStep` e a posição da primeira saída; `OFF_ASPHALT` nunca
    nessa condição; `THROTTLE_FULL` inalterado (para no primeiro passo fora da faixa, `OFF_ASPHALT`, sem
    `oversteer`/`sliding`); `NORMAL_DRIVING` só toma os passos no asfalto; `judge` com a ordem de cada
    condição; tabela de falha.
  - `ADR-0004`: decisão 9 nova e decisão 3; alternativas recusadas (manter a velocidade, janela menor,
    acelerador parcial, piloto retunado; parar no primeiro passo fora da faixa — o as-built, `:273`).
  - `ADR-0005` (1.2.0): Contexto com a medida (saída pelo lado interno no passo 240 de 300; `steeringLimit`,
    `src/physics.ts:180-188`); decisão 1 — a curva com acelerador 0 continua fora da faixa com a telemetria
    lida; alternativas recusadas; consequência (grama fora da faixa aplicada aos passos após a saída, o que
    o F-Spec aceita); REQ-FEAT-0002-02 nas fontes.
  - `DES-0001`: alavanca `assistLateralG` sob `DEC-13`. `DM-0001` seção 4 (`offAsphaltStepCount` de
    `REFERENCE_CORNER` informativo com `THROTTLE_ZERO`).
  - `98-divergences.md`: linha de REQ-FEAT-0002-01, -03, -09 contra `scripts/handlingBench.ts:273` e `:663`.
  - `test-strategy.md`: caminhos de AC-US-0002-01 e -02 (traço de 300 passos; registro sintético com
    `offAsphaltStepCount` 60 e `maxUndersteerMs` 125 é `PASS`; com 204, `THRESHOLD_EXCEEDED`, nunca
    `OFF_ASPHALT`).
- FB-01 (`race-lap-validation`, aceito):
  - `DES-0003` (2.0.0): seção "Campos copiados em `src/lap.ts`" (`LapRequest` `:23`, `LapSession` `:25-46`,
    `LapResult` `:48-58`, cópias em `startLap` `:117` e `buildResult` `:270`, como `challengeNumber`; sem
    verificação nem resolução em `src/lap.ts`); `buildLapRecord` passa a preencher só o que o resultado não
    traz (`result.setupId ?? setup.setupId`, `result.setupVersion ?? setup.setupVersion`), cópia idempotente
    sobre um resultado que já os traz; `replayLap` informa os dois campos no pedido; "Pedido da volta" em
    Estado e concorrência.
  - `DM-0001`: seção 2 (`LapResult` 1.1.0 com os campos opcionais; `LapRecord` com os dois obrigatórios) e
    passo M4 do plano de migração, com downgrade.
  - `ADR-0002` (2.0.0): decisão 1 reescrita; a decisão anterior (`LapResult` intacto, identidade anexada só
    por `buildLapRecord`) e "recusar o FB-01" como alternativas recusadas; consequência sobre `src/lap.ts` e
    a linha de divergência assumida.
  - `01-architecture.md` (3.0.0): tabela de camadas (`src/lap.ts` alterado nos campos copiados;
    `src/setupRecords.ts`, `scripts/handlingBench.ts`, `scripts/keyboard-lap.ts` e `src/main.ts` alterados
    num ponto cada), seção "A restrição que molda o projeto" (o `LapResult` carrega os campos opcionais;
    `CHK-TEST-0012-02` continua verde porque as suas voltas são iniciadas sem eles), diagrama do fluxo
    alterado, tabela de compatibilidade, linha de ADR-0002 em Rastros de decisão.
  - `DES-0007` (1.1.0): `beginLap` (`src/main.ts:226`) informa `setupId` e `setupVersion` no pedido de
    `startLap`. `DES-0006` (1.1.0): leitura de `buildLapRecord` (`src/main.ts:429`) sob o FB-01 — o
    `setupRef` é o recuo para um resultado sem os campos.
  - `DES-0004`: a volta do piloto de teste (`scripts/handlingBench.ts:468`) e a volta cronometrada de
    `measureStepCost` (`scripts/keyboard-lap.ts:25`) informam os dois campos no pedido.
  - `98-divergences.md`: linha nova de REQ-FEAT-0005-05, -06, -08 com API-0002 (FB-01), assumida do
    registro de `race-lap-validation`, etapa devedora: código desta feature, contra `src/lap.ts:23`,
    `:25-46`, `:48-58`, `:117`, `:270`, `src/setupRecords.ts:91-93`, `:108-112`, `src/main.ts:226`,
    `scripts/handlingBench.ts:468`, `scripts/keyboard-lap.ts:25`.
  - `test-strategy.md`: AC-US-0005-04 (volta iniciada com e sem os campos; `buildLapRecord` idempotente
    sobre `newResult()` e preenchendo `oldResult()`; `replayLap` com a `setupVersion` vinda do resultado) e
    NFR-0008 (`CHK-TEST-0012-02`; em `src/lap.ts` os dois campos só aparecem como cópia do pedido).
- As-built da rodada de código 2 recitado, sem mudança de interface, em `DES-0002` (1.1.1) e `DES-0005`
  (1.0.2) e nas seções de posicionamento de `DES-0001`, `DES-0003`, `DES-0004`, `DES-0006` e `DES-0007`
  (linhas de `src/physics.ts`, `src/main.ts`, `scripts/handlingBench.ts`, `scripts/keyboard-lap.ts`,
  `scripts/physics-bench.ts`, `index.html`, `docs/physics.md:196-262` e `:265-412`). `98-divergences.md`: as
  17 linhas abertas recitadas contra a árvore da rodada de código 2 — 4 ficam abertas (as duas reescritas
  acima, a do FB-01 e a prova em `npm test` com `docs/handling-device-log.md`) e 16 linhas passam à tabela
  "Linhas resolvidas pela rodada de código 2", cada uma com o `arquivo:linha` que a resolve; nenhum
  requisito saiu do registro.
- Intocados (validados): `ADR-0001` (1.0.1), `DES-0008` (1.0.2). `00-index.md` e `99-traceability.md` não
  foram escritos: o gate os regenera com `lint_artifacts.py --emit`.

**Superfície (conventions §16)**: Mode C acrescenta superfície só com item a montante que a autorize.
Acrescentado: os campos opcionais `setupId?` e `setupVersion?` em `LapRequest`, `LapSession` e `LapResult`
de `src/lap.ts`, autorizados por API-0001/API-0002 1.1.0 de `race-lap-validation` (FB-01) e projetados no
D-Spec daquela feature (DM-0002, DES-0001) — esta rodada só os põe no código desta feature. Nenhum campo,
valor de enum ou parâmetro de ensaio novo em API-0003; nenhuma alavanca nova em `KartConfig`; nenhum
módulo, tela ou configuração novos. Mudam de significado sob API-0003 3.3.0, com o mesmo nome e a mesma
unidade: `v1Mps` (obrigatório no fim natural; a definição de V1 nos dois casos) e `offAsphaltStepCount` de
`REFERENCE_CORNER` com `THROTTLE_ZERO` (informativo, 0 a 300).

**Tabela de migração** (conventions §17): 8 DES, 1 DM e 5 ADR antes e depois; 62 requisitos `REQ-*`, 32
critérios `AC-*` e 9 NFR realizados antes e depois; divergências: 17 linhas abertas antes; depois, 4 abertas
e 16 resolvidas pela rodada de código 2 (commit `0068a57`), com o `arquivo:linha` de hoje; nenhum item de
projeto, ensaio, fixture, critério ou verificação retirado. Interfaces que mudam: `buildLapRecord`
(preenche só o que falta), `replayLap` (pedido com os campos), `judge` em `REFERENCE_CORNER` `THROTTLE_ZERO`
e em `UNDERSTEER_ONSET`, `baselineRecord`/`understeerBaselineRecord` (condição de V0), `serialize` (linha
`#` de `UNDERSTEER_ONSET`), os pedidos de `startLap` em `src/main.ts`, `scripts/handlingBench.ts` e
`scripts/keyboard-lap.ts`; `src/lap.ts` ganha os campos opcionais copiados. Parâmetros de ensaio: nenhum
valor muda. Ramos retirados: o caso (b) de `MEASUREMENT_MISSING` (fim natural sem V1) e a parada no
primeiro passo fora da faixa com `THROTTLE_ZERO`.

**Itens fechados**: SPEC-ISSUE-01 e SPEC-ISSUE-02 de `reports/feedback/feedback-20261022-1803.md`; FB-01 de
`reports/feedbacks/race-lap-validation/feedback-20261022-1703.md` (aceito por inteiro, nos quatro sítios que
nomeia — `DES-0003`, `01-architecture.md`, `ADR-0002`, `DM-0001` — e nos demais sítios do mesmo fato:
`DES-0004`, `DES-0006`, `DES-0007`, `98-divergences.md`, `test-strategy.md`); `ISSUE-01` e `ISSUE-02` (info)
de `dspec-validation-20261022-1615`: nada a mudar (sem chave mestra por proibição do F-Spec, ADR-0001;
abertura de registro gravado fica com a feature que persistir registros, ADR-0002). Nenhum outro feedback
pendente para esta feature.

**Itens recusados, com motivo**

- As três saídas que o feedback do código ofereceu para SPEC-ISSUE-01 — alavanca de folga de esterço
  dependente da velocidade em `DES-0001`, outro rótulo de subesterço em `handling()` (deriva dianteira acima
  de um limiar sem a razão com a traseira) ou outro limiar de deriva: não tomadas. O dono do produto decidiu
  de outro modo (`DOMAIN/DEC-12`, via F-Spec 3.3.0): o rótulo não muda e V1 é a velocidade mantida do
  patamar interrompido; nenhuma alavanca é acrescentada (ADR-0004, Alternativas).
- As saídas oferecidas para SPEC-ISSUE-02 — velocidade mantida na curva com acelerador 0, janela menor que
  2 500 ms, acelerador parcial, ou piloto de teste com entrada no grampo compatível com o acerto: não
  tomadas. `DOMAIN/DEC-13` dispensa a permanência na faixa nessa execução; REQ-FEAT-0002-01 mantém o
  acelerador em 0 durante todo o arco e o piloto é parâmetro fixo (ADR-0004, decisão 2 e Alternativas;
  ADR-0005, Alternativas).
- Recusar o FB-01 e manter o `LapResult` intacto (a decisão das rodadas 1 a 7; "acrescentar
  `setupId`/`setupVersion` ao `LapResult` de `src/lap.ts`" recusado nas rodadas 1 e 5): superado. O contrato
  daquela feature já carrega os campos (API-0001/API-0002 1.1.0) e duas descrições do mesmo contrato não
  podem valer ao mesmo tempo; a decisão do autor para esta rodada é aceitar (ADR-0002, Alternativas).
- Aceitar como V0 o `v1Mps` do patamar interrompido de uma linha de base que nunca sai de frente (o
  as-built, `scripts/handlingBench.ts:311`, aceita qualquer `v1Mps` numérico): não tomado. O F-Spec define
  o caso de `DEC-12` para o novo acerto (V1) e deixa o recuo de V0 sem decisão; aceitá-lo seria estimar V0
  — `BASELINE_MISSING`, nada estimado (ADR-0003, decisão 2; ADR-0004, decisão 10). Com a linha de base
  medida (`ARCADE_KART`, 808 ms a 50 km/h) o caso não ocorre. Proposta ao autor para `SCOPE-BACKLOG.md`:
  "2026-10-27 dspec-loop rodada 8 — `UNDERSTEER_ONSET`: que V0 vale quando a linha de base nunca sai de
  frente até sair da faixa (a velocidade do patamar interrompido também para V0, ou `BASELINE_MISSING`)?"
- Campo que diga de onde `v1Mps` veio, ou valor de `failReason` para "sem início de subesterço": não
  acrescentados; API-0003 3.3.0 diz que o motivo é apresentação, e o caso é derivável do contrato (`v1Mps`
  maior que todo `plateauSpeedMps` da lista e nenhum par acima de 200 ms); vai para a linha `#`.
- Velocidade do kart no passo da saída como campo de `UNDERSTEER_ONSET`: continua não acrescentada
  (API-0003 não a tem); vai para a linha `#` e chega a `judge` por `observed`.
- Editar os valores de `ARCADE_ASSISTIDO_V5` (`src/physics.ts:75-82`) ou refazer a entrada
  `arcade-assistido-v5` de `docs/physics.md` neste estágio: são da etapa de código. Sob este projeto os dois
  registros reprovados mudam de veredito (fim natural com V1 = 64,4 km/h ≥ 57,5 km/h; curva com acelerador
  0 julgada só pelos 125 ms de `understeer`) e a rodada de código seguinte os refaz, em Mode B/C sobre
  `scripts/handlingBench.ts`, `src/lap.ts`, `src/setupRecords.ts`, `src/main.ts` e `scripts/keyboard-lap.ts`.
- Veredito para os dois casos que RULE-0002 não decide (saída exatamente a 50 km/h; varredura sem saída da
  faixa): continuam sem veredito; a biblioteca lança (ADR-0004, decisão 8). As propostas de
  `SCOPE-BACKLOG.md` das rodadas anteriores seguem com o autor.
- Nenhum requisito foi enfraquecido, removido ou dividido; nenhuma divergência `waived-pending`; nenhum
  feedback a outra feature (`race-lap-validation` já carrega o contrato 1.1.0 e o seu registro já declara a
  linha devida a esta feature; nada mais a pedir). `DOMAIN.md` foi lido só para conferir as entradas de
  2026-10-22 (conventions §15); todo conteúdo projetado vem do F-Spec 3.3.0; o restante da pasta do seed e
  `200 Requirements/230 Output/` não foram lidos (§12).
- Os itens recusados das rodadas 1, 3, 5, 6 e 7 continuam recusados pelos mesmos motivos, salvo o de
  "campos no `LapResult`" (rodadas 1 e 5), superado acima.

## 2026-10-27 — rodada 9, Mode C (feedback do código `reports/feedback/feedback-20261027-1619.md`, SPEC-ISSUE-03; F-Spec 3.4.0)

**Gatilho**: o FAIL SPEC da rodada de código 3 (`feedback-20261027-1619`, SPEC-ISSUE-03): com a biblioteca
realizando DES-0004 5.0.0 (`maxUndersteerMs` medido em todos os 300 passos, dentro e fora da faixa), o
acerto entregue sai da faixa pelo lado interno no passo 240 e, nos 61 passos seguintes na grama, o rótulo
`understeer` vale por construção (teto de guinada com `grassFriction` contra o limite de esterço que cresce
com a desaceleração) — 633 ms, `FAIL` `THRESHOLD_EXCEEDED` nos dois `inputMode`; 2 967 acertos avaliados
pela etapa de código, nenhum aprova os 15 registros. Único feedback pendente para esta feature (mais novo
que `dspec-validation-20261027-1531`; conventions §14).

**Decisão do autor recebida para esta rodada e carregada sem redescoberta** (dono do produto, 2026-10-27,
`DOMAIN/DEC-14`; chega a este estágio por FEAT-0002, RULE-0002, API-0003 e FLOW-0002 3.4.0,
`status: validated`): no ensaio do arco de 18 m com acelerador zero — e em qualquer ensaio em que a
permanência na faixa não é exigida — o `understeer` conta só no asfalto, até a primeira saída da faixa; os
passos na grama depois da saída não entram na medição; o limiar continua 200 ms; nenhum outro limiar ou
regra muda; `ARCADE_ASSISTIDO_V5` não muda (com essa regra o ensaio mede 125 ms e passa). Código na raiz do
repositório; biblioteca de ensaios em `scripts/handlingBench.ts`. Resolver SPEC-ISSUE-03 em DES-0004 /
ADR-0004 (decisão 9) e na test-strategy; nada mais muda. O código da rodada 3 (commit `767508e`, 14/15
registros) é o as-built.

**O que mudou**

- SPEC-ISSUE-03 (janela de medição de `maxUndersteerMs` em `REFERENCE_CORNER` com `THROTTLE_ZERO`;
  `DOMAIN/DEC-14`):
  - `DES-0004` (5.1.0): Realiza e linha `REFERENCE_CORNER` da tabela de ensaios — a execução com
    `THROTTLE_ZERO` continua a percorrer os 300 passos e a reportar a saída sem reprovar, mas a janela de
    medição de `maxUndersteerMs` fecha no passo anterior a `offAsphaltFirstStep`: a sequência consecutiva de
    `understeer` é acumulada só nos passos na faixa até a primeira saída, e nenhum passo depois dela entra,
    na grama ou de volta ao asfalto; `offAsphaltStepCount` continua informativo na janela inteira;
    `THROTTLE_FULL` inalterado; `BenchRecord` (cobertura de `maxUndersteerMs` sob API-0003 3.4.0); tabela de
    falha; Observabilidade (`offAsphaltFirstStep` diz onde a janela fechou); Posicionamento com o as-built
    da rodada de código 3 (`scripts/handlingBench.ts:272-283`, `:280-281`; `docs/physics.md:196-277`, `:253`,
    bloco `:279-426`), os marcadores **(muda)** da 5.0.0 declarados entregues e a marca **(muda 5.1.0)** no
    único ponto que muda; API-0003 e RULE-0002 citados em 3.4.0.
  - `ADR-0004` (4.1.0): Contexto com o F-Spec 3.4.0 e os fatos medidos pela rodada de código 3 (633 ms = 15
    passos no asfalto + 61 na grama; teto de guinada `mu × g × 0,85 / u` com `grassFriction` 0,38,
    `src/physics.ts:253`, `:260-261`; rótulo por construção na grama; 2 967 acertos); decisão 9 reescrita
    (janela de medição até a primeira saída; execução, traço e `offAsphaltStepCount` inalterados); decisão
    3 (a saída fecha a janela); alternativas (parar na saída — recusada; medir na grama — substituída;
    alavanca sobre o teto de guinada fora do asfalto, `grassFriction` ou revisão dos limiares — recusadas;
    `NORMAL_DRIVING` na mesma janela — recusada); consequências (a entrada `arcade-assistido-v5` refeita só
    nesse registro; o acerto entregue mede 125 ms).
  - `ADR-0005` (1.3.0): Contexto (`DEC-14` e a medida), decisão 1 (a telemetria continua lida fora da
    faixa para a saída e para `DETERMINISM`, mas nenhum ensaio mede critério fora do asfalto), alternativa
    "interromper na saída" com o motivo atual, consequência (os passos depois da saída são executados e
    reportados, não medidos).
  - `DES-0001` (3.4.0): alavanca `assistLateralG` sob `DEC-14` (o acerto entregue, 1,48 g, atende sem
    retune: 125 ms até a saída; na grama nenhuma alavanca move `grassFriction`, o teto de guinada ou o
    rótulo); parágrafo da pista de teste; Posicionamento (F-Spec 3.4.0; `src/physics.ts` e
    `ARCADE_ASSISTIDO_V5` não tocados pela rodada de código 3).
  - `test-strategy.md` (5.1.0): caminho de AC-US-0002-01 (recomputação de `maxUndersteerMs` sobre os passos
    anteriores ao primeiro `GRASS`, igual ao campo; a recomputação sobre o traço inteiro é maior ou igual) e
    de AC-US-0002-02 (registro sintético com os valores medidos: `offAsphaltStepCount` 61,
    `offAsphaltFirstStep` 240, 125 ms é `PASS`; nenhum passo a partir da saída altera o campo);
    Verificações existentes com as medidas da rodada de código 3.
  - `01-architecture.md` (3.1.0): F-Spec 3.4.0; estado as-built da rodada de código 3 (14/15; o que
    reprova e por quê); parágrafo das decisões com `DEC-14`; tabela de camadas com `src/lap.ts`,
    `src/setupRecords.ts`, `src/main.ts`, `scripts/keyboard-lap.ts` e `scripts/handlingBench.ts` como
    as-built e o único ponto que muda; tabela de compatibilidade (entrada `arcade-assistido-v5`); rastros
    de ADR-0004 e ADR-0005.
  - `98-divergences.md` (3.1.0): recitado contra a árvore da rodada de código 3 (commit `767508e`): a linha
    de REQ-FEAT-0002-01, -03, -09 reescrita (exigência 3.4.0; `scripts/handlingBench.ts:280-281` acumula em
    todos os 300 passos; medido 633 ms, 61 passos fora; pelo projeto 125 ms); as linhas de REQ-FEAT-0002-04,
    -05, -07, -10 e de REQ-FEAT-0005-05, -06, -08 (FB-01) passam à tabela "Linhas resolvidas pela rodada de
    código 3", com o `arquivo:linha` que as resolve; a linha dos testes em `npm test` continua aberta
    (`tests/dirigibilidade-*.test.ts` e `tests/fixtures/records.ts` ainda ausentes); 2 linhas abertas, 18
    resolvidas.
- Intocados (validados): `DES-0002`, `DES-0003`, `DES-0005`, `DES-0006`, `DES-0007`, `DES-0008`, `DM-0001`
  (não carrega o fato: `offAsphaltStepCount` continua a contar a janela inteira e API-0003 3.4.0 não
  acrescenta campo), `ADR-0001`, `ADR-0002`, `ADR-0003`. `00-index.md` e `99-traceability.md` não foram
  escritos: o gate os regenera com `lint_artifacts.py --emit`.

**Superfície (conventions §16)**: nenhum módulo, item de projeto, ADR, modelo de dados, campo, valor de
enum, parâmetro de ensaio, alavanca, tela ou configuração acrescentado. Muda de cobertura sob o mesmo nome,
unidade e significado: `maxUndersteerMs` em `REFERENCE_CORNER` com `THROTTLE_ZERO` (API-0003 3.4.0,
Compatibilidade). Limiares: nenhum muda. `ARCADE_ASSISTIDO_V5`: inalterado.

**Tabela de migração** (conventions §17): 8 DES, 1 DM e 5 ADR antes e depois; 62 requisitos `REQ-*`, 32
critérios `AC-*` e 9 NFR realizados antes e depois; divergências: 4 abertas e 16 resolvidas antes; 2 abertas
e 18 resolvidas depois (duas resolvidas pela rodada de código 3; uma reescrita; uma inalterada); nenhum item
de projeto, ensaio, fixture, critério ou verificação retirado. Interface que muda: a medição de
`maxUndersteerMs` em `referenceCornerBench` com `THROTTLE_ZERO` (acumulação condicionada a "ainda sem
saída"); `judge`, `BenchRecord`, `offAsphaltStepCount`, o traço e os parâmetros de ensaio não mudam. Ramo
retirado: a acumulação de `understeer` nos passos depois da primeira saída.

**Itens fechados**: SPEC-ISSUE-03 de `reports/feedback/feedback-20261027-1619.md`. O item informativo do
mesmo feedback ("Estado do código nesta rodada") foi lido como as-built e carregado em `01-architecture.md`
e `98-divergences.md`. Nenhum `ISSUE-<nn>` pendente (`dspec-validation-20261027-1531` é SUCCESS); nenhum
outro feedback pendente para esta feature.

**Itens recusados, com motivo**

- As saídas que o feedback ofereceu além da janela de medição — alavanca em `DES-0001` sobre o teto de
  guinada fora do asfalto, mudança de `grassFriction`, revisão dos limiares que se contrariam (recuperação a
  60 km/h no anel de 23,5 m, grampo do piloto de teste, curva de 18 m com acelerador 0): não tomadas; o
  dono do produto decidiu pela janela de medição (`DOMAIN/DEC-14`), sem mudar limiar, alavanca, acerto ou
  `handling()` (ADR-0004, Alternativas).
- Parar a execução com acelerador 0 no primeiro passo fora da faixa (a biblioteca da rodada de código 2,
  mesmos 125 ms): não tomado; mudaria `offAsphaltStepCount` (0 ou 1) e o traço de `DETERMINISM`, que
  API-0003 3.4.0 não mudou — só a cobertura de `maxUndersteerMs` (ADR-0004 e ADR-0005, Alternativas).
- Restringir `NORMAL_DRIVING` à janela até a primeira saída: não tomado; RULE-0002 define o agregado pelos
  passos de condução normal no asfalto e o F-Spec 3.4.0 não o mudou (com o acerto entregue o kart não volta
  ao asfalto na janela: 61 passos fora, do 240 ao 300).
- Um campo que diga em que passo a janela fechou: não acrescentado; `offAsphaltFirstStep` já o diz (como o
  F-Spec recusou na rodada 10 do seu changelog).
- Reler as demais citações `arquivo:linha` de `DES-0004` e dos itens não tocados contra a árvore da rodada de
  código 3: não feito; `DES-0004` declara que as suas linhas são as de `0068a57` salvo as marcadas
  `em 767508e`, e as linhas que decidem o veredito (`98-divergences.md`, `01-architecture.md`) foram
  recitadas. `DM-0001` segue citando API-0003 "3.1.0 a 3.3.0" para os campos, porque a 3.4.0 não acrescenta
  campo.
- Editar `ARCADE_ASSISTIDO_V5` ou refazer a entrada `arcade-assistido-v5` de `docs/physics.md`: da etapa de
  código; sob esta versão o registro `REFERENCE_CORNER` com acelerador 0 passa a 125 ms e a rodada de código
  seguinte o refaz, em Mode B/C sobre `scripts/handlingBench.ts` (uma condição na acumulação de `:280-281`).
- Veredito para os dois casos que RULE-0002 não decide e V0 de linha de base sem subesterço: continuam como
  nas rodadas 7 e 8 (a biblioteca lança; `BASELINE_MISSING`); as propostas de `SCOPE-BACKLOG.md` seguem com
  o autor (registradas em `842943a`).
- Nenhum requisito foi enfraquecido, removido ou dividido; nenhuma divergência `waived-pending`; nenhum
  feedback a outra feature (`race-lap-validation` já carrega o contrato 1.1.0 e revalidou o seu código após
  o drift de `src/lap.ts`, `4ea95d3`). `DOMAIN.md` foi lido só para conferir a entrada de 2026-10-27
  (`DEC-14`; conventions §15); todo conteúdo projetado vem do F-Spec 3.4.0 e do feedback; o restante da pasta
  do seed e `200 Requirements/230 Output/` não foram lidos (§12).
- Os itens recusados das rodadas 1, 3, 5, 6, 7 e 8 continuam recusados pelos mesmos motivos, salvo "medir
  `maxUndersteerMs` em todos os passos do arco, dentro e fora da faixa" (rodada 8, decisão 9 de ADR-0004
  4.0.0), substituído por `DOMAIN/DEC-14`.

## 2026-10-30 — rodada 10, Mode C (F-Spec 4.0.1, seed `revision: 5`; feedback cruzado `reports/feedbacks/race-lap-validation/feedback-20261030-1256.md`, FB-01)

**Gatilho**: o F-Spec foi revalidado contra a revisão 5 do seed (`fspec-validation-20261030-1237`, SUCCESS,
sobre as rodadas 11 e 12 do changelog do F-Spec): acerto C (`DOMAIN/DEC-15`); curva julgada pelo raio da
trajetória aos 3 s (≤ 13 m de 50 km/h e de 70 km/h, acelerador e esterço cheios) e pelo giro (≥ 180° em até
2 s sem acelerador de 50 km/h, `DOMAIN/DEC-16`) na pista de teste aberta; arco de 18 m e varredura de início do
subesterço retirados; recuperação na pista de teste aberta, cada lado; velocidade estabilizada de 65 km/h a
72 km/h; drift e turbo retirados da simulação e da exibição (HUD, resultado, texto compartilhado); a
`setupVersion` fica como dado, sem texto novo de tela. O coordenador pediu levar isso aos itens do acerto e das
assistências, aos registros de API-0003 e à lista de ensaios, ao dado publicado e à linha de base, à
integração do HUD e do resultado e à estratégia de testes. No meio da rodada chegou o FB-01 de
`race-lap-validation` (D-Spec daquela feature, `dspec-validation-20261030-1256`): o treino passa a ser uma
sequência de voltas que só chega a `ENDED` por `endTraining`. Entradas lidas: o F-Spec 4.0.1 inteiro; o código
na raiz (as-built); `DOMAIN.md` só nas entradas de 2026-10-29 e 2026-10-30 (`DEC-15`, `DEC-16`), para os
valores do acerto C que o F-Spec deixou ao projeto (conventions §15); dos D-Specs de `modelo-kart-01` e de
`race-lap-validation`, só os nomes e as decisões que tocam leitores comuns (§12). Os valores medidos citados
nos itens foram conferidos nesta rodada rodando a biblioteca as-built com o acerto C em memória, num script
fora do repositório; nenhum arquivo do código foi escrito.

**O que mudou**

- `core/DES-0001` (4.0.0; arquivo renomeado de `…-v5-e-assistencias.md` para `…-v6-e-assistencias.md`, links
  atualizados): literal novo `ARCADE_ASSISTIDO_V6` = `ARCADE_ASSISTIDO_V5` com `governorSpeed` 19,5,
  `assistLateralG` 2,4, `maxSteer` 0,5, `friction` 2,1, `frontStiffness` 26; `PUBLISHED_SETUPS` em
  `arcade-assistido-v6` com `previousSetupVersion` `arcade-assistido-v4`; tabela de alavancas refeita;
  `testPadArea` no lugar de `testPadLane`/`testPadArc`; o passo sem a manobra de drift e o turbo, trecho a
  trecho, mantendo a linha 2 como `import` de `./maneuvers` para a linha 3 não se mover; classificador de passo
  retirado; medidas do acerto C (raio 11,67/11,76 m, giro 208°, 69,3 km/h, 2 208 ms, 23 049 ms; traseira que
  não solta sob a condição de forçar).
- `core/DES-0002` (2.0.0): `driftActive` retirado; `positionXM`, `positionZM`, `headingRad` acrescentados.
- `core/DES-0003` (2.1.0): versões v6/v5/v4 na resolução e na comparabilidade; `replayLap` termina no primeiro
  resultado (FB-01).
- `core/DES-0004` (6.0.0): reescrita sobre API-0003 4.0.1 e RULE-0002 4.0.1 — `CORNER_RADIUS`, `CORNER_TURN`,
  `DRIFT_INERT`, `SPEED_CAP`; `REAR_RECOVERY` aberta, por lado, com `rearReleased`/`forcingMs`;
  `NORMAL_DRIVING` sobre a volta inteira; `TEST_AREA_EXCEEDED` e os campos da área em todo registro `TEST_PAD`;
  definições de projeto do raio (pela posição, janela dos passos 349 a 372) e do giro (pelo rumo acumulado);
  parâmetros de ensaio novos (`testAreaRadiusM` 100, `straightTestAreaRadiusM` 1 500, `radiusWindowMs` 200) e
  retirados; `TOP_SPEED` de 65 km/h a 72 km/h; `WALL_CONTACT` vazio como `MEASUREMENT_MISSING`;
  `baselineAvailable` preenchido em todo registro; convenções de ambiente (`SPEED_CAP`, `SETUP_VERSION`,
  `STEP_CONTRACT` em `SYNTHETIC_TRACK`; `STEP_COST` no ambiente da volta que mede); fim da volta do piloto de
  teste e de `measureStepCost` no primeiro resultado (FB-01).
- `web/DES-0005` (2.0.0): retirada, por trecho, de `.style-score`/`#combo`, `#drift-hud`, das mensagens de
  prêmio, de `chargeTier`, da classe `boosting` e das regras de estilo só deles.
- `web/DES-0006` (2.0.0): `formatSharedText` sem `· <setupVersion>`; `#lap-result-setup` retirado; o
  tratamento de cada resultado novo aceita o gatilho de `race-lap-validation` (FB-01).
- `web/DES-0007` (1.2.0): linhas recitadas na árvore corrente; o comando de drift continua entregue e
  ignorado; nenhuma linha muda por este item.
- `security/DES-0008` (1.1.0): texto compartilhado sem `setupVersion`.
- `data/DM-0001` (3.0.0): valores publicados v6; versões declaradas v4/v5/v6; saída de API-0003 4.0.1; bloco
  da linha de base com uma entrada por (`setupId`, `setupVersion`, `runtimeId`), entradas esperadas e
  resolução só para `STEP_COST` e o Realista; passos M5 e M6 com reversão.
- `adr/ADR-0001` (1.1.0): cada rodada é um literal novo; `previousSetupVersion` continua a versão anterior à
  feature. `adr/ADR-0002` (2.0.1): o texto compartilhado não carrega os campos de acerto. `adr/ADR-0003`
  (2.0.0): linha de base só para o custo por passo e o Realista; uma entrada por chave. `adr/ADR-0004` (5.0.0):
  decisões dos ensaios novos; decisões 8 a 10 da versão anterior retiradas. `adr/ADR-0005` (2.0.0): pista de
  teste aberta; classificador retirado. `adr/ADR-0006` (1.0.0, **novo**): drift e turbo fora do passo agora,
  `State.maneuvers` e `src/maneuvers.ts` numa janela de compatibilidade com gatilho de retirada final.
- `01-architecture.md` (4.0.0), `test-strategy.md` (6.0.0) e `98-divergences.md` (4.0.0) reescritos; seção
  nova "Efeito sobre outras features" em `01-architecture.md`. `00-index.md` e `99-traceability.md` regenerados
  pelo gate.

**Superfície (Mode C)**: acrescentados, cada um autorizado por item do F-Spec 4.0.1: `ARCADE_ASSISTIDO_V6` e a
`setupVersion` `arcade-assistido-v6` (FEAT-0004, FEAT-0005, `DOMAIN/DEC-15`); `testPadArea` (RULE-0002,
Ambientes); os `benchId` e campos de API-0003 4.0.0; `positionXM`, `positionZM`, `headingRad` (API-0001 2.0.0);
os parâmetros `testAreaRadiusM`, `straightTestAreaRadiusM`, `radiusWindowMs` (RULE-0002, parâmetros de ensaio);
`CORNER_ENTRY_SPEEDS_MPS` (valores dos critérios); ADR-0006. Nenhuma tela, elemento ou texto de tela
acrescentado; três elementos retirados (`.style-score`, `#drift-hud`, `#lap-result-setup`).

**Tabela de migração** (conventions §17). As retiradas seguem a retirada dos critérios que realizavam,
aprovada pelo dono do produto (`DOMAIN/DEC-15`, revisão 4 do seed; tabelas de migração dos requisitos 4.3.0 e
do F-Spec, rodada 11).

| Item | Antes | Agora |
|---|---|---|
| `benchId` `REFERENCE_CORNER`, `UNDERSTEER_ONSET`, `DRIFT_MANEUVER` | ensaios | **retirados**; substitutos `CORNER_RADIUS` + `CORNER_TURN`, nenhum, `DRIFT_INERT` |
| `testPadLane`, `testPadArc`, `arcEntry`, `laneEnvironment`, `arcEnvironment` | geradores e estados da faixa e do arco | **retirados**; substituto `testPadArea` |
| `classifyHandlingSteps`, `StepClass`, `RECOVERY_MAX_STEPS`; `tests/dirigibilidade-classify.test.ts` | classes de passo | **retirados** (REQ-FEAT-0003-03 retirado, -12 modificado) |
| `driftActive` (telemetria) | campo | **retirado** sem substituto (API-0001 2.0.0) |
| ramos `drifting`/`boosting` e `advanceManeuvers` no passo; `tests/maneuvers.test.ts:68-80` | manobra de drift | **retirados** (`DOMAIN/DEC-15`); `State.maneuvers` e `src/maneuvers.ts` na janela de ADR-0006 |
| HUD do drift, mensagens de prêmio, `#lap-result-setup`, `· <setupVersion>` no texto compartilhado | exibição | **retirados** (AC-US-0003-09, -11; SCR-0002 1.2.0) |
| `BENCH_PARAMETERS` `laneWidthM`, `arcRadiusM`, `cornerWindowMs`, `entrySpeedStepMps`, `plateauMs`, `plateauSpeedHoldMode`, `entrySpeedMaxMps`; `THRESHOLDS` `maxUndersteerMs`, `understeerOnsetRatio`, `105 / 3.6` | parâmetros e limiares | **retirados** |
| decisões 8, 9 e 10 de ADR-0004; decisões de V0 de ADR-0003 | decisões | **retiradas** (sem objeto) |
| `NORMAL_DRIVING`, `REAR_RECOVERY`, `TOP_SPEED`, `WALL_CONTACT`, `STEP_COST`, `SETUP_VERSION`, `STEP_CONTRACT` | registros | modificados (população, ambiente, lados, limiar, motivo ou convenção de ambiente) |
| fim da volta em `TEST_PILOT_LAP`, `measureStepCost` e `replayLap` | fase `ENDED` | primeiro resultado (FB-01 de `race-lap-validation`) |
| `PUBLISHED_SETUPS.ARCADE_ASSISTIDO` | `arcade-assistido-v5` | `arcade-assistido-v6`; `ARCADE_ASSISTIDO_V5` fica intacto |

8 DES, 1 DM e 5 ADR antes; 8 DES, 1 DM e 6 ADR depois. Requisitos realizados: os 64 `REQ-*` do F-Spec 4.0.1
(62 antes; 11 retirados e 13 novos); 33 `AC-*` e 9 NFR.

**Itens fechados**: o pedido do coordenador desta rodada; FB-01 de
`reports/feedbacks/race-lap-validation/feedback-20261030-1256.md`, **aceito**: o fim de uma volta nos ensaios,
na volta cronometrada, em `replayLap` e nos testes passa a ser o primeiro resultado (`getLapResult` sem
código), não a fase `ENDED`, o que vale antes e depois da mudança de `race-lap-validation`; o tratamento de cada
resultado na aplicação aceita o gatilho "cada item novo de `listLapResults`" projetado lá (DES-0003, DES-0004,
DES-0006, test-strategy, `98-divergences.md`). O FB-01 de `feedback-20261022-1703` já estava aceito desde a
rodada 8. Nenhum `ISSUE-<nn>` pendente (o último relatório deste estágio, `dspec-validation-20261027-1803`, é
SUCCESS).

**Itens recusados, com motivo**

- Apagar `src/maneuvers.ts` e `State.maneuvers` nesta entrega: `src/main.ts` deixaria de compilar enquanto as
  leituras de `modelo-kart-01` existirem e `tests/race-lap-validation-layering.test.ts:9` falharia, contra
  REQ-FEAT-0006-07; projetado como janela de compatibilidade com gatilho (ADR-0006).
- Editar as leituras de `state.maneuvers` de `modelo-kart-01` em `src/main.ts` (jato, câmera, marcas) ou criar
  uma condição nova para as marcas de pneu: escreveria na superfície de outra feature, ou criaria regra nova de
  renderização (`SEED/RE-01`); recusado (ADR-0006).
- Retirar o campo `drift` de `Input` ou o botão de drift do toque: o F-Spec mantém o campo e o controle como
  entrada sem efeito (NFR-0006; RULE-0001).
- Retirar os textos de instrução do drift fora do HUD (`index.html:19` boas-vindas, `:33` dica da barra, `:34`
  guia "Como fazer drift"): o F-Spec limita a retirada ao HUD durante a volta, ao resultado e ao texto
  compartilhado (AC-US-0003-09, -11), e trocá-los seria texto novo (RNF11). Proposta ao autor, abaixo.
- `previousSetupVersion` apontando para `arcade-assistido-v5` (a leitura de DM-0001 2.0.0): API-0002 e RULE-0003
  a definem como a versão anterior à feature; recusado (ADR-0001).
- Variar a velocidade de partida ou a duração do forçar de `REAR_RECOVERY` até a traseira do acerto C soltar:
  seria escolher o parâmetro de ensaio pelo resultado; o F-Spec decide a traseira que não solta
  (REQ-FEAT-0003-17).
- Um registro de API-0003 para a recuperação com acelerador e esterço zerados juntos: o contrato não tem campo
  que distinga a variante; verificada em `npm test` por `step` (test-strategy).
- Mudar a volta do piloto de teste para `OFFICIAL` ou `RECON` (uma das saídas que o FB-01 ofereceu): mudaria o
  tipo de volta que a linha de base mediu e, em `OFFICIAL`, dependeria da leitura completa da pista; o fim no
  primeiro resultado resolve o mesmo caso sem isso.
- Recitar os números de v5 do bloco de `docs/physics.md`: sem objeto, porque nenhum ensaio desta versão os lê; a
  entrada v5 fica como histórico.
- Os itens recusados das rodadas 1 a 9 que tratavam do arco de 18 m, da varredura e de V0 ficam sem objeto; os
  demais continuam recusados pelos mesmos motivos.

**Propostas ao autor** (para `SCOPE-BACKLOG.md`, que este estágio não escreve):

- "2026-10-30 dspec-loop rodada 10 — com o acerto C a traseira não solta sob a condição de forçar a 55–69 km/h
  (o kart desacelera a ~54 km/h em `understeer`): a recuperação de 400 ms fica sem medida no acerto entregue.
  Aceitar, ou pedir uma alavanca que faça a traseira soltar?"
- "2026-10-30 dspec-loop rodada 10 — sem o drift o jogo deixa de desenhar marcas de pneu (a única situação era
  o drift): as marcas devem aparecer em alguma outra situação? (afeta `modelo-kart-01`, FEAT-0005)"
- "2026-10-30 dspec-loop rodada 10 — os textos de instrução do drift e do turbo nas boas-vindas, na barra e no
  guia de manobras devem sair?"

**Para a validação encaminhar a outras features** (conventions §14; feedbacks escritos pelo validador): a
`race-lap-validation` e a `pista-kart-park`, deixar de nomear `src/maneuvers.ts` nos testes de camada (gatilho
da retirada final, ADR-0006); a `modelo-kart-01`, o efeito sobre as marcas de pneu e a linha de base da
simulação chaveada em `arcade-assistido-v5`; a `pista-kart-park`, que os testes que leem
`PUBLISHED_SETUPS.ARCADE_ASSISTIDO` passam a pilotar o acerto C.

**Versões**: `01-architecture.md` 4.0.0; `DES-0001` 4.0.0; `DES-0002` 2.0.0; `DES-0003` 2.1.0; `DES-0004` 6.0.0;
`DES-0005` 2.0.0; `DES-0006` 2.0.0; `DES-0007` 1.2.0; `DES-0008` 1.1.0; `DM-0001` 3.0.0; `ADR-0001` 1.1.0;
`ADR-0002` 2.0.1; `ADR-0003` 2.0.0; `ADR-0004` 5.0.0; `ADR-0005` 2.0.0; `ADR-0006` 1.0.0; `test-strategy.md`
6.0.0; `98-divergences.md` 4.0.0; este changelog 4.0.0; todos em `status: draft`.

## 2026-10-30 — rodada 11, Mode B (`reports/dspec-validation/dspec-validation-20261030-1326.md`: 2 erros, 2 avisos)

**Gatilho**: o relatório FAIL `dspec-validation-20261030-1326` sobre a rodada 10 (`ISSUE-01` e `ISSUE-02`,
erros; `ISSUE-03` e `ISSUE-04`, avisos; `ISSUE-05` a `ISSUE-08`, informativos; `ISSUE-09` a `ISSUE-13`,
`scope`, encaminhados pela validação como feedback a outras features).

**O que mudou**

- `ISSUE-01` (erro, D3): `core/DES-0004` (6.0.1) ganha a tabela "Campos obrigatórios quando a execução para
  na saída da área antes do instante de medida": em `STEER_RESPONSE`, `CORNER_RADIUS`, `CORNER_TURN`,
  `REAR_RECOVERY`, `ACCELERATION`/`TOP_SPEED` e na sequência de recuperação de `DRIFT_INERT`, cada campo que
  API-0003 4.0.1 torna obrigatório é medido até o passo da saída, como no caso da parada — `pathRadiusAt3sM`
  sobre os passos da janela executados (`Number.MAX_VALUE` sem passo ou sem variação de direção),
  `speedAt3sMps`/`handlingAt3s` e `turnAt2sRad`/`speedAt2sMps` do passo da saída quando ela vem antes do
  instante, `steadyYawRateRadPerS` sobre os passos executados da fase A, `fallToTenPctMs` com o teto `toMs(72)`
  quando não alcançado; os valores são informativos, porque `TEST_AREA_EXCEEDED` já decidiu o veredito. Mesmo
  fato em outro sítio: a linha da saída da área na tabela Comportamento em falha remete à tabela nova. Nenhum
  campo, valor de enum ou mudança de contrato.
- `ISSUE-02` (erro, D4): `data/DM-0001` (3.0.1), seção 2, cita API-0001 1.2.0 de `race-lap-validation`, diz que
  todo campo de `LapResult` 1.2.0 é carregado pelo `LapRecord` e lista `lapSequenceCount`, `lapStartMs`,
  `trainingLapMs` e `trainingSectorMs` como opcionais de treino, com a nulidade e o padrão de leitura daquele
  contrato, fora da comparabilidade, do texto compartilhado e dos ensaios. Mesmo fato em outro sítio:
  `core/DES-0003` (2.1.1), Realiza, cita API-0001 1.2.0 e API-0002 1.2.1 (os campos de acerto vêm da 1.1.0).
- `ISSUE-03` (aviso, D2): `core/DES-0004`, linha `readBaseline`, cita `scripts/handlingBench.ts:808-821`.
- `ISSUE-04` (aviso, D2): `core/DES-0001` (4.0.1), "Passo sem drift nem turbo": a tabela de expressões de
  substituição dá lugar ao contrato por sítio (o que sai, o que fica), com a linha 2 como restrição de contrato
  e dois invariantes que a etapa de código prova — estado igual bit a bit ao da árvore anterior para todo
  `Input` sem o comando de drift; estado igual com e sem o comando.

**Superfície (conventions §16)**: nenhum requisito, módulo, campo, valor de enum, parâmetro, tela ou elemento
acrescentado; a tabela de `ISSUE-01` define valores de campos que API-0003 já tinha, e as quatro linhas de
`ISSUE-02` descrevem campos que `LapResult` 1.2.0 de `race-lap-validation` já tem.

**Itens fechados**: `ISSUE-01` a `ISSUE-04` de `dspec-validation-20261030-1326`.

**Itens recusados, com motivo**

- `ISSUE-05`, `ISSUE-06`, `ISSUE-08` (info): o relatório pede nada a mudar; não tocados. `ISSUE-08` segue como
  proposta ao autor (rodada 10).
- `ISSUE-07` (info, coluna "Item de projeto" na tabela de linhas resolvidas de `98-divergences.md`): opcional e
  fora das issues que esta rodada de correção recebeu; não acrescentada.
- `ISSUE-09` a `ISSUE-13` (`scope`): devidas pelas features alvo, por feedback já escrito pela validação; nada a
  mudar neste conjunto.
- Mudar a nulidade de campos de API-0003 para o caso da saída da área: o contrato é do F-Spec e o caso se
  resolve medindo até o passo da saída, sem mudança de contrato.

**Versões**: `DES-0001` 4.0.1; `DES-0003` 2.1.1; `DES-0004` 6.0.1; `DM-0001` 3.0.1; este changelog 4.0.1; todos em
`status: draft`. Intocados nesta rodada: os demais arquivos. `00-index.md` e `99-traceability.md` regenerados
pelo gate.

## 2026-10-30 — rodada 12, Mode C (F-Spec 4.1.0 revalidado contra o seed `revision: 6`, `fspec-validation-20261030-1517.md`)

**Gatilho**: o F-Spec foi revalidado (SUCCESS, `fspec-validation-20261030-1517`) contra o seed `revision: 6` e os
requisitos 4.4.0 (`DOMAIN/DEC-17`): requisitos novos REQ-FEAT-0003-18 (tela inicial, AC-US-0003-12),
REQ-FEAT-0003-19 (dica da barra de ferramentas, AC-US-0003-13), REQ-FEAT-0003-20 (guia de manobras,
AC-US-0003-14) e REQ-FEAT-0003-21 (controle de toque sem o botão "Drift", AC-US-0003-15); tela nova `SCR-0003`
1.0.0; `SCR-0001` 1.2.0 cobre o controle de toque; `FEAT-0003` 4.1.0; `FEAT-0006` 2.2.0 (REQ-FEAT-0006-01 nomeia
todas as telas da retirada; REQ-FEAT-0006-08 diz "os limites em vigor"). Nota de posicionamento do coordenador:
a rodada de código de `race-lap-validation` acrescentou `#lap-end-training` em `index.html:34`, a mesma linha da
dica da tecla de drift.

**O que mudou**

- `web/DES-0009` (1.0.0, **novo**): a tela inicial (`#welcome`, `index.html:19`), a dica da barra de ferramentas
  (`.control-hint`, `index.html:34`) e o guia de manobras (`.maneuver-guide`, `index.html:35`) sem drift nem
  turbo, por remoção: saem o `<h2>` "Entre de lado. Saia voando.", a frase "Acelere, encaixe o drift e solte
  para dar o impulso." e o trecho "· Espaço + curva para drift" de `#welcome`; o trecho "· Espaço: drift →
  turbo" de `.control-hint` (fica "Dirigir"); a seção `.maneuver-guide` inteira, cujo conteúdo era só o drift
  (estado Vazio de SCR-0003), e as suas regras em `src/style.css:3`. A edição troca só o texto dentro de
  `.control-hint`: `.actions` e `#lap-end-training` não são tocados. Os contêineres de `pista-kart-park` e de
  `race-lap-validation` dentro de `#welcome` ficam. Motivo de um item novo e não de uma extensão: nenhum item
  do conjunto cobria essas três telas (DES-0005 é o HUD, SCR-0001); o código continua nos módulos existentes.
- `web/DES-0007` (1.3.0): realiza REQ-FEAT-0003-21 — sai o `<button data-control="drift">` de `index.html:32`, a
  leitura `|| touch.has('drift')` de `src/main.ts:549` (o comando de drift passa a vir só da tecla de drift), as
  linhas `driftButton` de `src/main.ts:655-656` (sem o botão, a consulta devolveria `null` e lançaria a cada
  quadro) e a regra `.touch-controls button[data-control=drift]` de `src/style.css:3`; um só `.touch-controls`
  serve o sensor ativo e o recuo para toque. As linhas de `src/main.ts` citadas no item foram conferidas de novo
  na árvore corrente (depois da rodada de código de `race-lap-validation`). Fonte nova: SCR-0001.
- Mesmo fato nos outros sítios: `web/DES-0005` (2.0.1) deixa de dizer que o botão de toque fica e que os textos
  de instrução não mudam, e remete a DES-0007 e DES-0009; cita SCR-0001 1.2.0. `01-architecture.md` (4.1.0):
  base no F-Spec 4.1.0 e seed `revision: 6`, SCR-0001 a SCR-0003, item "Nenhuma tela ensina nem oferece o
  drift", linhas dos adaptadores e de `index.html`/`src/style.css` e a mensagem do quadro no diagrama.
  `test-strategy.md` (6.1.0): roteiro E2E-04 (tela inicial, dica e ausência do guia nos dois canais e nos dois
  idiomas; controle de toque com o sensor ativo e no recuo; `#lap-end-training` intacto), E2E-01 sem o botão de
  drift do celular, níveis web e mobile E2E, linha de FEAT-0003, caminhos de AC-US-0003-12 a -15 por texto em
  `tests/dirigibilidade-hud-text.test.ts`. `98-divergences.md` (4.1.0): duas linhas abertas (REQ-FEAT-0003-18 a
  -20, fechadas por DES-0009; REQ-FEAT-0003-21, por DES-0007) e a linha dos testes com AC-US-0003-12 a -15.
- `data/DM-0001` (3.0.2): a entrada em prosa de `docs/physics.md` traz os resultados "com os limites em vigor"
  (REQ-FEAT-0006-08 em FEAT-0006 2.2.0), não "da revisão 5".

**Superfície**: Mode C sobre o F-Spec movido; DES-0009 e as remoções de DES-0007 realizam os quatro requisitos
novos. Nenhum módulo, campo, contrato, valor de enum, configuração, texto ou elemento de tela acrescentado: os
requisitos novos só exigem retirada. Itens: 8 DES, 1 DM e 6 ADR antes; 9 DES, 1 DM e 6 ADR depois. Requisitos
realizados: os 68 `REQ-*` do F-Spec 4.1.0 (64 antes); 37 `AC-*` (33 antes) e 9 NFR.

**Tabela de migração** (conventions §17): nenhum requisito, contrato, campo ou ensaio retirado nem renomeado.

| Item | Antes (rodada 11) | Agora |
|---|---|---|
| botão de toque `[data-control="drift"]` | fica, como controle de drift sem efeito | **retirado** (REQ-FEAT-0003-21) |
| comando de drift no `Input` da aplicação | tecla Espaço e botão de toque | só a tecla Espaço; o campo `drift` de `Input` fica com o mesmo nome e faixa |
| ensino do drift em `#welcome` e em `.control-hint` | não muda (fora do F-Spec 4.0.1) | **retirado**, sem texto novo |
| `.maneuver-guide` | não muda | **retirado** inteiro (conteúdo só de drift) |

**Itens fechados**: o pedido do coordenador desta rodada. A proposta ao autor da rodada 10 ("os textos de
instrução do drift e do turbo nas boas-vindas, na barra e no guia de manobras devem sair?") foi respondida pelo
seed `revision: 6` e sai da lista. Nenhum `ISSUE-<nn>` pendente (`dspec-validation-20261030-1333` é SUCCESS) e
nenhum `FB-<nn>` novo.

**Itens recusados, com motivo**

- Um título novo para `#welcome` no lugar de "Entre de lado. Saia voando.", ou um guia de manobras com outro
  conteúdo: seria texto novo de tela (RNF11; SCR-0003, estado Vazio); a retirada não põe nada no lugar.
- Manter o `<h2>` "Entre de lado. Saia voando." por não nomear o drift: entrar de lado é a manobra de drift e
  sair voando é o impulso, e o parágrafo seguinte os ligava; REQ-FEAT-0003-18 proíbe texto que os mencione.
- Retirar a tecla Espaço do adaptador de teclado, o `preventDefault` do Espaço em `src/main.ts:378` ou o campo
  `drift` de `Input`: o F-Spec mantém o comando de drift no `Input`, sem efeito (REQ-FEAT-0003-13, NFR-0006); o
  `preventDefault` só impede a rolagem da página e não ensina nada.
- Retirar a regra `.welcome h2` ou `.touch-controls button:disabled` de `src/style.css`: a primeira estiliza o
  `<h2>` da falta de WebGL (`src/main.ts:33`), a segunda é genérica; nenhuma é de drift.
- Editar a linha de `index.html:34` além do texto de `.control-hint` (por exemplo, reordenar ou reescrever
  `.actions`): tocaria `#lap-end-training`, de `race-lap-validation`.
- Estender AC-US-0003-15 à contagem antes do sinal verde: o critério é observado durante a volta; a remoção é
  estática e vale em qualquer fase, sem alargar o critério.
- Reconferir contra a árvore corrente todas as citações `arquivo:linha` do conjunto (a seção de as-built de
  `01-architecture.md`, a tabela de retirada de DES-0005, as demais linhas abertas de `98-divergences.md`), que a
  rodada de código desta feature e a de `race-lap-validation` deslocaram: fora do que esta rodada Mode C
  recebeu; conferidas de novo só as citações dos sítios tocados (DES-0007 inteiro, DES-0009, as linhas novas de
  `98-divergences.md`). As citações de linha de `modelo-kart-01` em DES-0005, já deslocadas, saíram do
  parágrafo editado; ADR-0006 as mantém como contexto.
- Os itens recusados das rodadas 1 a 11 continuam recusados pelos mesmos motivos, salvo "Retirar o campo
  `drift` de `Input` ou o botão de drift do toque" e "Retirar os textos de instrução do drift fora do HUD", da
  rodada 10, cuja parte do botão e dos textos o F-Spec 4.1.0 agora exige (a do campo `drift` continua recusada).

**Para a validação encaminhar a outras features**: nenhum. As retiradas não tocam os contêineres de
`pista-kart-park` e de `race-lap-validation` em `#welcome`, nem `#lap-end-training`, nem `#lap-control-fallback`;
nenhum teste dessas features lê os textos retirados.

**Versões**: `01-architecture.md` 4.1.0; `DES-0005` 2.0.1; `DES-0007` 1.3.0; `DES-0009` 1.0.0; `DM-0001` 3.0.2;
`test-strategy.md` 6.1.0; `98-divergences.md` 4.1.0; este changelog 4.1.0; todos em `status: draft`. Intocados:
`DES-0001` a `DES-0004`, `DES-0006`, `DES-0008` e `ADR-0001` a `ADR-0006`. `00-index.md` e `99-traceability.md`
regenerados pelo gate.
