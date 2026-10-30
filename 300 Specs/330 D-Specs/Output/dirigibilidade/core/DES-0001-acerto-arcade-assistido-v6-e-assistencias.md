---
id: DES-0001
title: Acerto Arcade assistido v6 (acerto C), assistências, pista de teste aberta e passo sem drift nem turbo
feature: dirigibilidade
stage: dspec
status: validated
version: 4.0.1
sources: [FEAT-0001, FEAT-0002, FEAT-0003, FEAT-0004, FEAT-0005, FEAT-0006, RULE-0001, RULE-0002, FLOW-0001, REQ-FEAT-0001-01, REQ-FEAT-0001-02, REQ-FEAT-0001-03, REQ-FEAT-0001-04, REQ-FEAT-0001-07, REQ-FEAT-0001-08, REQ-FEAT-0002-08, REQ-FEAT-0002-11, REQ-FEAT-0002-12, REQ-FEAT-0002-13, REQ-FEAT-0003-01, REQ-FEAT-0003-04, REQ-FEAT-0003-05, REQ-FEAT-0003-06, REQ-FEAT-0003-09, REQ-FEAT-0003-10, REQ-FEAT-0003-11, REQ-FEAT-0003-13, REQ-FEAT-0003-16, REQ-FEAT-0004-01, REQ-FEAT-0004-02, REQ-FEAT-0004-03, REQ-FEAT-0004-04, REQ-FEAT-0004-05, REQ-FEAT-0004-08, REQ-FEAT-0004-10, REQ-FEAT-0005-07, REQ-FEAT-0005-09, REQ-FEAT-0006-01, REQ-FEAT-0006-02, REQ-FEAT-0006-03, REQ-FEAT-0006-04]
---

# DES-0001 — Acerto Arcade assistido v6 (acerto C), assistências, pista de teste aberta e passo sem drift nem turbo

## Realiza

Os `REQ-*` em `sources`: resposta do volante partindo em reta na pista de teste aberta com a velocidade
mantida (AC-US-0001-01 a -04); curva com raio da trajetória ≤ 13 m aos 3 s com acelerador e esterço cheios
de 50 km/h e de 70 km/h, e giro ≥ 180° em até 2 s sem acelerador de 50 km/h (AC-US-0002-07 a -09); traseira
que nunca solta na volta do piloto de teste e que, solta sob a condição de forçar, volta a `grip` em 400 ms
(AC-US-0003-01, -03 a -05); comando de drift sem efeito no estado e velocidade máxima única (AC-US-0003-08,
-10); aceleração, velocidade estabilizada entre 65 km/h e 72 km/h, grama e parede (AC-US-0004-01 a -05) —
tudo decidido nos presets, nas assistências e no passo da camada de simulação (NFR-0005; REQ-FEAT-0003-10),
com `STEP`, solver e `Input` inalterados (NFR-0006), o Realista intacto (NFR-0007) e nenhuma versão publicada
do Arcade editada no lugar (REQ-FEAT-0005-09). O ambiente de ensaio `TEST_PAD` de RULE-0002 (pista de teste
aberta) é construído aqui. Decisões: [ADR-0001](../adr/ADR-0001-versao-do-acerto-como-registro-novo-no-codigo.md),
[ADR-0005](../adr/ADR-0005-pista-de-teste-como-ambiente-da-simulacao-e-velocidade-mantida.md),
[ADR-0006](../adr/ADR-0006-retirada-do-drift-e-do-turbo-com-janela-de-compatibilidade.md).

## Posicionamento

`src/physics.ts`, camada **Simulação**, **existente** (481 linhas na árvore corrente) e **alterado** nos
pontos marcados **(muda)** abaixo. Nenhum módulo novo: o modelo do veículo, os presets, os ambientes
(`Environment`, `CIRCUIT`, `TEST_PAD`, `trackEnvironment`) e a telemetria vivem aqui. O que **não** muda:
`STEP` (`:6`), `PHYSICS_VERSION` (`:8`), a linha de `Input` (`:9`, com `drift?`), `RENTAL_KART` (`:55-64`),
`ARCADE_KART` (`:67-74`), `KART_PRESETS` (`:75`), `ARCADE_ASSISTIDO_V5` (`:79-89`), `SOLVER_SUBSTEPS`
(`:90`), a assinatura de `step` (`:384`), a constante `TEST_PAD` (`:188`), o bloco de barreira e de zebra de
`pista-kart-park` e a **linha 3** (`export { nearest, track, WIDTH, LapTracker } from './track';`) — tudo
afirmado por `tests/race-lap-validation-frozen.test.ts` ou usado pelos testes existentes. `src/maneuvers.ts`
não é alterado: deixa de ser chamado pelo passo e fica na janela de compatibilidade de ADR-0006.

## Interface

### Preset novo e dado publicado **(muda)**

| Símbolo | Tipo | Situação | Descrição |
|---|---|---|---|
| `ARCADE_ASSISTIDO_V6` | `Readonly<KartConfig>` | **novo**, depois de `:89` | `Object.freeze({...ARCADE_ASSISTIDO_V5, governorSpeed: 19.5, assistLateralG: 2.4, maxSteer: 0.5, friction: 2.1, frontStiffness: 26})` — o acerto C que o dono do produto escolheu na staging (`DOMAIN/DEC-15`); todos os demais campos, inclusive as assistências opcionais, vêm de `ARCADE_ASSISTIDO_V5` |
| `ARCADE_ASSISTIDO_V5` | `Readonly<KartConfig>` | existente, `:79-89`, **intacto** | o registro da rodada `arcade-assistido-v5`, publicada na staging e substituída (`SUPERSEDED`, RULE-0003): nunca editado; é a base literal do v6 e continua exportado (auxiliares de teste de `pista-kart-park` o importam) |
| `PUBLISHED_SETUPS` | `Readonly<Record<SetupId, PublishedSetup>>` | existente, `:98-106`, **(muda)** | `ARCADE_ASSISTIDO`: `setupVersion` `arcade-assistido-v6`, `previousSetupVersion` `arcade-assistido-v4`, `config` `ARCADE_ASSISTIDO_V6`, `previousConfig` `ARCADE_KART` (a versão anterior à feature, API-0002); `REALISTA_ALUGUEL_4T` inalterado ([DM-0001](../data/DM-0001-dado-publicado-registros-e-linha-de-base.md), seção 1) |
| `SetupId`, `SetupRef`, `PublishedSetup` | tipos | existentes, `:91-96` | inalterados |

Alavancas do acerto (unidade no sufixo, D-FS-06); os campos opcionais de `KartConfig` (`:46-51`) continuam
lidos só no ramo `config.drivingAssists`, com o padrão anterior quando ausentes (I4; `RENTAL_KART` e
`ARCADE_KART` não os declaram):

| Campo | Unidade | v5 → v6 | Onde atua | Alavanca para |
|---|---|---|---|---|
| `governorSpeed` | m/s | 31,5 → **19,5** | `:238` governador (rampa de 1,5 m/s) | velocidade estabilizada entre 65 km/h e 72 km/h (REQ-FEAT-0004-02): 19,5 m/s menos a rampa dá 69,3 km/h (`DOMAIN/DEC-15`) |
| `assistLateralG` | g | 1,48 → **2,4** | `:206-209` limite de esterço por velocidade (`atan(wheelbase × G × g / u²)` + folga) | raio ≤ 13 m aos 3 s de 50 km/h e de 70 km/h (REQ-FEAT-0002-11, -12) e giro ≥ 180° em 2 s (REQ-FEAT-0002-13): o v5 limitava o esterço ao que 1,48 g permite e fazia raios de 17 m a 25 m (`DOMAIN/DEC-15`) |
| `maxSteer` | rad | 0,36 → **0,5** | `:208`, `:225` teto do esterço | idem; acima do limite por velocidade só vale em baixa velocidade, onde o giro sem acelerador acontece |
| `friction` | adimensional | 1,57 → **2,1** | `:153` aderência no asfalto, `:278` teto da assistência | aderência para a curva fechada sem a traseira soltar na volta do piloto de teste (REQ-FEAT-0003-01, -06) |
| `frontStiffness` | adimensional | 23 → **26** | `:265` rigidez dos pneus dianteiros | resposta da frente ao esterço maior (REQ-FEAT-0001-01 a -04) |
| `enginePower`, `driveForce`, `throttleRate`, `rearStiffness` | W, N, 1/s, — | inalterados (26 500, 2 420, 8, 22) | `:240`, `:234`, `:265` | 0–60 km/h ≤ 2,5 s (REQ-FEAT-0004-01) |
| `steerApplyRatePerS`, `steerReturnRatePerS` | 1/s | inalterados (14, 24) | `:229` | subida ≤ 180 ms, queda ≤ 250 ms (REQ-FEAT-0001-01 a -04) |
| `assistSteerAllowanceRad` | rad | inalterado (0,004) | `:207` | folga além do limite cinemático |
| `yawTrackingGainPerS`, `yawCorrectGainPerS` | 1/s | inalterados (5,8, 33) | `:295-297`, `:291` | guinada ao aplicar e ao soltar; recuperação em ≤ 400 ms (REQ-FEAT-0003-04, -09) |
| `slipDampingGainPerS`, `slipDampingCapG` | 1/s, g | inalterados (18, 0,8) | `:282-283` | `sideslipRad` ≤ 0,65 na volta do piloto de teste e na recuperação (REQ-FEAT-0003-05, -06) |
| `forcingRearFrictionScale`, `forcingRampMps` | —, m/s | inalterados (0,67, 2,4) | `:214-217`, `:230` | traseira viva só sob a condição de forçar (RULE-0001) |
| `grassSpeedLossPerS` | 1/s | inalterado (0,7) | `:300` | ≥ 30 % de perda em 1 s na grama (REQ-FEAT-0004-03, -04, -08) |

Os valores do v6 são decisão do dono do produto (`DOMAIN/DEC-15`) e não são limiares. Medidos por ele em
2026-10-29 e 2026-10-30 e conferidos nesta rodada com a biblioteca as-built e o v6 em memória (informação,
não linha de base): velocidade estabilizada 19,25 m/s (69,3 km/h); 0–60 km/h em 2 208 ms; raio aos 3 s de
11,67 m partindo de 50 km/h e 11,76 m de 70 km/h; giro de 208° em 2 s sem acelerador, com 180° atingidos em
1 825 ms; volta do piloto de teste em 23 049 ms sem passo fora do asfalto, com 0 passos em
`oversteer`/`sliding` e derrapagem lateral máxima de 0,077 rad; resposta do volante com subida de 108 ms e
queda de 58 ms (esterço 0,5: 108 e 50 ms); grama a 51 % e 55 % da entrada após 1 s. Sob a condição de forçar
a 60 km/h, de qualquer lado, a traseira **não solta** em 3 s no asfalto aberto (o kart desacelera a cerca de
54 km/h em `grip`/`understeer`): `REAR_RECOVERY` reporta `rearReleased` falso e não reprova, como
REQ-FEAT-0003-17 decide; a recuperação de 400 ms fica sem passo de partida com o acerto entregue
([DES-0004](DES-0004-ensaios-de-dirigibilidade-e-saida.md); proposta ao autor no changelog).

### Pista de teste aberta **(muda)**

| Símbolo | Assinatura | Descrição |
|---|---|---|
| `testPadArea(testAreaRadiusM)` | `(testAreaRadiusM: number /* m */) => Environment` — **novo**, no lugar de `testPadLane`/`testPadArc` (`:189-200`, **retirados**) | disco de asfalto centrado na origem: `surfaceAt(p)` é `'asphalt'` se `testAreaRadiusM > 0` e `Math.hypot(p.x, p.z) <= testAreaRadiusM`, senão `'grass'`; `walls: false`; sem `track`. A origem é o ponto de partida de todo ensaio em `TEST_PAD` (o kart entra em `(0, 0)` com `heading` 0, sentido +z); fora do disco `surface` é `GRASS` no sentido de "fora da área de asfalto do ensaio" (API-0001) |

A pista de teste aberta não é dado de pista: não tem `trackId`, linhas, setores nem marcadores, e nenhum
adaptador ou tela a alcança (RULE-0002, Ambientes; `SEED/RD-06`). `wallContact` nunca é verdadeiro ali
porque `walls` é falso (`:324`). Raio não positivo dá um ambiente todo `grass` (nenhum ensaio o chama
assim). Os geradores `testPadLane` e `testPadArc` saem: nenhum ensaio de RULE-0002 4.0.1 usa faixa ou arco
(API-0003 4.0.0, Compatibilidade: `laneWidthM` e `arcRadiusM` retirados), e os seus leitores são só a
biblioteca e os testes desta feature, que mudam no mesmo conjunto (DES-0004, test-strategy). A constante
`TEST_PAD` (asfalto sem limite) fica para os usos existentes (`tests/physics.test.ts`,
`scripts/physics-bench.ts:1`).

### Passo sem drift nem turbo **(muda)**

A manobra de `requirements/11` sai do passo (RULE-0001, "Sem drift e sem turbo"; `DOMAIN/DEC-15`). O
contrato, por sítio da árvore corrente — o que sai e o que fica; a forma do código que resta é da etapa de
código:

| Sítio atual | O que sai | O que fica |
|---|---|---|
| `:2` `import` de `./maneuvers` | `advanceManeuvers` e `cancelManeuver` | o `import` de `initialManeuvers` e do tipo `Maneuvers`, **na linha 2** — restrição de contrato: a linha 3 (reexportação de `./track`) não se move (CHK-TEST-0014-05 de `race-lap-validation`) |
| `:223-224` em `integrate` | os termos `drifting` e `boosting` e tudo o que dependia deles | — |
| `:225`, `:231`, `:238`, `:280`, `:291` | a parcela de cada expressão que só existia com `drifting` ou `boosting`: o aumento do limite de esterço, a redução do atrito traseiro, o acréscimo ao governador, a folga lateral maior e o ganho de correção de guinada próprio do drift | o comportamento que essas expressões já tinham com `drifting` e `boosting` falsos |
| `:292-298` | o ramo de momento do drift | o ramo de `yawTrackingGainPerS` |
| `:301` | a força do impulso | — |
| `:316` | — | `maneuvers` carregado sem mudança |
| `:333`, `:352`, `:414` | os cancelamentos da manobra na parede, na barreira e na grama | — |
| `:388-391` | o cálculo de `onRoad`, que só alimentava a manobra | — |
| `:395-399` | a chamada de `advanceManeuvers` | o passo parte do estado recebido |

Invariantes que a etapa de código prova (test-strategy, AC-US-0003-08 e `DETERMINISM`): (1) para todo `Input`
sem o comando de drift, com qualquer preset e em qualquer ambiente, o estado depois de cada passo é igual,
bit a bit, ao que o mesmo passo dá na árvore anterior a esta mudança — a retirada só remove parcelas que valiam o elemento neutro
com `drifting` e `boosting` falsos; (2) para todo `Input`, o estado com o comando de drift mantido é igual ao
estado sem ele (AC-US-0003-08). `State.maneuvers` (`:32`) continua no tipo e vale `initialManeuvers()` em todo
estado (`initialState`, `:118`), sem nunca avançar: nenhum estado acumula carga, impulso, combo ou pontuação
(RULE-0001), e os leitores de `state.maneuvers` em `src/main.ts` que pertencem a outra feature continuam a
compilar e passam a ler sempre o valor inicial ([ADR-0006](../adr/ADR-0006-retirada-do-drift-e-do-turbo-com-janela-de-compatibilidade.md)).
A velocidade máxima passa a ser a do governador em qualquer situação: sem o termo de impulso, partindo de
velocidade igual ou menor que a estabilizada, nenhuma força leva o kart acima dela (AC-US-0003-10, verificado
por `SPEED_CAP`).

### Condição de forçar e telemetria por passo (existentes)

`step(state, input, dt, config, environment)` (assinatura inalterada, `:384`): calcula `forcing` uma vez por
chamada (`isForcing`, `:125-127`: acelerador saturado ≥ 1 **e** `|esterço saturado|` ≥ 1 **e** `state.speed`
> 50 / 3,6 no início do passo; o literal vive só em `:124`) e a fração da rampa (`forcingRampFraction`,
`:214-217`), aplica-as em `integrate` (`:230`), incrementa `stepCount` (`:413`) e preenche a telemetria do
passo (`:358-360`, `:412`): `forcing`, `surface` (o ambiente no centro do kart depois do passo), `wallContact`
(só no passo em que o ramo de paredes remove velocidade normal), `assistActive`. Esterço parcial nunca
satisfaz a condição; o comando de drift não entra nela. A saturação do `Input` acontece em `:126`, `:226`,
`:234-235` (REQ-FEAT-0001-07). O classificador `handling()` (`:167-174`) não muda. A parede reduz a velocidade
a cada contato com `outgoing > 0` (`:329-334`), o que realiza REQ-FEAT-0004-05 sem alteração.

### Classificador de passo **(retirado)**

`StepClass`, `RECOVERY_MAX_STEPS`, `loose` e `classifyHandlingSteps` (`:457-481`) saem. RULE-0001 4.0.0 troca
as classes de passo por contextos de observação: a condução normal é a volta do piloto de teste inteira, sem
exclusão, e a recuperação é a do ensaio `REAR_RECOVERY`, cujo passo de soltura é o passo em que o próprio
ensaio leva o esterço a 0 ([DES-0004](DES-0004-ensaios-de-dirigibilidade-e-saida.md)); a classe `DRIFT`
deixa de existir com a manobra. Nenhum leitor do jogo usava o classificador; o único consumidor era o
agregado `NORMAL_DRIVING`, que passa a não precisar dele. A regra de pilotagem (forçar, aderência,
assistências que devolvem a traseira) continua toda no passo (REQ-FEAT-0003-10).

## Colaboradores

Chama `nearest`/`WIDTH`/`track` (`src/track.ts`), as funções de geometria de `src/trackGeometry.ts` (de
`pista-kart-park`, inalteradas) e `initialManeuvers` (`src/maneuvers.ts`, só para o valor constante). É
chamado por `src/lap.ts` (`stepLap`), `src/setupRecords.ts`, `scripts/handlingBench.ts` (`step`,
`getHandlingTelemetry`, `testPadArea`, `PUBLISHED_SETUPS`), `scripts/physics-bench.ts`, `src/main.ts`
(`PUBLISHED_SETUPS`, `getHandlingTelemetry`, `getTrackContact`) e pelos testes. Nenhuma importação de `three`,
DOM, `src/audio.ts` ou `src/main.ts`.

## Estado e concorrência

- `State` é imutável por passo: `step` devolve um estado novo; `stepCount` é o contador de sequência
  (`simStepCount` de API-0001) e avança só quando `step` é chamado — na pausa, perda de foco ou perda do
  sensor `stepLap` devolve a mesma sessão e nenhum contador avança, logo todo limite em ms conta só tempo
  simulado (REQ-FEAT-0001-08, REQ-FEAT-0002-08, REQ-FEAT-0003-11).
- Idempotência: `step` é função pura do estado, do `Input`, de `dt`, do `config` e do ambiente; reaplicar o
  mesmo passo ao mesmo estado dá o mesmo estado; o comando de drift não altera essa função. Não há chave de
  deduplicação porque não há evento externo.
- Versões do acerto: `ARCADE_KART` (anterior à feature) e `ARCADE_ASSISTIDO_V5` (rodada substituída) são
  registros intactos; a versão corrente é `ARCADE_ASSISTIDO_V6` (REQ-FEAT-0005-09). Não existe caminho para o
  jogo escolher uma versão que não a corrente: `PUBLISHED_SETUPS` expõe `previousConfig` só para os ensaios de
  linha de base. Cada rodada seguinte do ciclo em staging (`DOMAIN/DEC-10`) que altera um parâmetro é um
  literal novo e nova `setupVersion` (ADR-0001).

## Comportamento em falha

Sem dependência externa, sem tempo-limite, sem escrita parcial. `dt` fora de (0, 0,1] continua lançando
`RangeError` (`:385`). Um campo opcional ausente vale o padrão; os presets são literais congelados,
verificados por `tests/dirigibilidade-contract.test.ts`. `testPadArea` com raio não positivo devolve um
ambiente todo `grass`. Nada é registrado em log pela simulação.

## Observabilidade

Os limiares são observados pelos registros de API-0003 ([DES-0004](DES-0004-ensaios-de-dirigibilidade-e-saida.md)):
`riseToNinetyPctMs`, `fallToTenPctMs`, `speedMinMps`/`speedMaxMps`, `pathRadiusAt3sM`, `turnAt2sRad`/
`halfTurnReachedMs`, `oversteerOrSlidingStepCount`, `maxSideslipRad`, `rearReleased`/`forcingMs`/
`recoveryMs`, `differingStepCount`, `maxObservedSpeedMps`, `zeroToSixtyKmhMs`, `topSpeedMps`,
`speedAfterOneSMps`, `contacts`. Uma regressão aparece como `FAIL` com `THRESHOLD_EXCEEDED`,
`TEST_AREA_EXCEEDED`, `OFF_ASPHALT`, `MEASUREMENT_MISSING` ou `SPEED_NOT_HELD` no registro correspondente.

## Determinismo (D-DS-07)

Passo fixo `STEP`, `SOLVER_SUBSTEPS` fixo, sem relógio, sem sorteio; `forcing` é função do `Input` e do
estado; `testPadArea` é função pura da posição; retirar a manobra elimina o único estado que dependia do
histórico do comando de drift. Provas: `DETERMINISM` por ambiente e `DRIFT_INERT` em
`tests/dirigibilidade-test-pilot.test.ts` e `tests/dirigibilidade-rear.test.ts`;
`tests/race-lap-validation-layering.test.ts` continua afirmando a ausência de `Date`, `performance`,
`Math.random` e DOM em `src/physics.ts` e em `src/maneuvers.ts`.

## Feature flag

Nenhuma chave: a versão corrente é dado publicado ([RULE-0003](../../../../320%20F-Specs/Output/dirigibilidade/rules/RULE-0003-versao-do-acerto-e-comparabilidade.md))
e o F-Spec proíbe configuração para escolher entre acertos ou religar o drift (FEAT-0003 e FEAT-0005,
Configuração). O "padrão sem mudança" (I4) está nos campos opcionais ausentes em `RENTAL_KART` e
`ARCADE_KART` e no fato de a retirada da manobra ser neutra para todo `Input` sem o comando de drift; o
motivo está em [ADR-0001](../adr/ADR-0001-versao-do-acerto-como-registro-novo-no-codigo.md) e
[ADR-0006](../adr/ADR-0006-retirada-do-drift-e-do-turbo-com-janela-de-compatibilidade.md). `testPadArea` não
altera nenhum passo do jogo: só os ensaios o chamam.

## Pontos em aberto

Nenhum.
