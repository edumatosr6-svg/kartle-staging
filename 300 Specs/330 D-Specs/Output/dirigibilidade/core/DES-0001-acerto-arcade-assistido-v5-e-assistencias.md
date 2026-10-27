---
id: DES-0001
title: Acerto Arcade assistido v5, assistências, pista de teste e classificação do passo na simulação
feature: dirigibilidade
stage: dspec
status: validated
version: 3.4.0
sources: [FEAT-0001, FEAT-0002, FEAT-0003, FEAT-0004, FEAT-0006, RULE-0001, RULE-0002, FLOW-0001, REQ-FEAT-0001-01, REQ-FEAT-0001-02, REQ-FEAT-0001-03, REQ-FEAT-0001-04, REQ-FEAT-0001-07, REQ-FEAT-0001-08, REQ-FEAT-0002-01, REQ-FEAT-0002-02, REQ-FEAT-0002-03, REQ-FEAT-0002-04, REQ-FEAT-0002-05, REQ-FEAT-0002-08, REQ-FEAT-0002-10, REQ-FEAT-0003-01, REQ-FEAT-0003-02, REQ-FEAT-0003-03, REQ-FEAT-0003-04, REQ-FEAT-0003-05, REQ-FEAT-0003-06, REQ-FEAT-0003-09, REQ-FEAT-0003-10, REQ-FEAT-0003-11, REQ-FEAT-0003-12, REQ-FEAT-0004-01, REQ-FEAT-0004-02, REQ-FEAT-0004-03, REQ-FEAT-0004-04, REQ-FEAT-0004-05, REQ-FEAT-0004-08, REQ-FEAT-0004-10, REQ-FEAT-0005-07, REQ-FEAT-0005-09, REQ-FEAT-0006-01, REQ-FEAT-0006-02, REQ-FEAT-0006-03, REQ-FEAT-0006-04]
---

# DES-0001 — Acerto Arcade assistido v5, assistências, pista de teste e classificação do passo na simulação

## Realiza

Os `REQ-*` em `sources`: resposta do volante em reta da pista de teste com a velocidade mantida
(AC-US-0001-01 a -04), aderência no arco de raio 18 m da pista de teste e início progressivo do subesterço
(AC-US-0002-01 a -04), traseira só solta ao forçar, teto de derrapagem, recuperação em 400 ms e a classe de
passo "Recuperação" distinta da condução normal (AC-US-0003-01 a -05; RULE-0001), aceleração, velocidade
estabilizada, grama e parede (AC-US-0004-01 a -05), tudo decidido nos presets, nas assistências e no
classificador da camada de simulação (NFR-0005; REQ-FEAT-0003-10), com `STEP`, solver e `Input`
inalterados (NFR-0006), o Realista intacto (NFR-0007) e a versão anterior do Arcade nunca editada no lugar
(REQ-FEAT-0005-09). Os ambientes de ensaio de RULE-0002 (pista de teste em reta e em arco) são
construídos aqui. Decisões: [ADR-0001](../adr/ADR-0001-versao-do-acerto-como-registro-novo-no-codigo.md),
[ADR-0005](../adr/ADR-0005-pista-de-teste-como-ambiente-da-simulacao-e-velocidade-mantida.md).

## Posicionamento

`src/physics.ts`, camada **Simulação**, **existente**: o item está escrito pelas rodadas de código 1 e 2
(as-built, 385 linhas, commit `0068a57`) e é lido aqui como descrição do que o sistema faz; nenhuma
interface deste item muda nesta rodada — só a leitura das alavancas de `UNDERSTEER_ONSET` e da curva de
referência com acelerador 0 à luz de `DOMAIN/DEC-12`, `DOMAIN/DEC-13` e `DOMAIN/DEC-14` (F-Spec 3.4.0); a
rodada de código 3 (commit `767508e`) não tocou este módulo nem `ARCADE_ASSISTIDO_V5`. Nenhum módulo novo:
o modelo do veículo, os seus presets e os ambientes (`Environment`, `CIRCUIT`, `TEST_PAD`, `:164-166`) vivem
aqui (decisão do autor: presets em `src/physics.ts`). O que **não** muda: `STEP` (`:5`), `PHYSICS_VERSION`
(`:7`), `Input` (`:8`), `RENTAL_KART` (`:50-58`), `ARCADE_KART` (`:61-68`), `KART_PRESETS` (`:69`), a
assinatura de `step` (`:319`), a constante `TEST_PAD` (`:166`, asfalto sem limite, usada por
`tests/physics.test.ts:7` e por `scripts/physics-bench.ts:1`) e a linha 3 — tudo afirmado por
`tests/race-lap-validation-frozen.test.ts:31-60` ou usado pelos testes existentes. `src/maneuvers.ts` não
muda.

## Interface

### Preset novo e dado publicado (existentes, as-built)

| Símbolo | Tipo | Situação | Descrição |
|---|---|---|---|
| `ARCADE_ASSISTIDO_V5` | `Readonly<KartConfig>` | existente, `:73-83` (entregue pela rodada de código 2) | `{...ARCADE_KART, <parâmetros existentes retunados>, <parâmetros opcionais de assistência>}`, congelado. Os valores em `:75-82` são os escolhidos pela etapa de código pelos ensaios de [DES-0004](DES-0004-ensaios-de-dirigibilidade-e-saida.md) na pista de teste e registrados em `docs/physics.md:221-237`; dois registros ainda reprovam sob o projeto anterior (`UNDERSTEER_ONSET`, `REFERENCE_CORNER` com acelerador 0) e são julgados de novo pela rodada de código seguinte sob este; a tabela de alavancas abaixo diz o que cada um move |
| `PUBLISHED_SETUPS` | `Readonly<Record<SetupId, PublishedSetup>>` | existente, `:92-100` | o dado publicado de [DM-0001](../data/DM-0001-dado-publicado-registros-e-linha-de-base.md), seção 1 |
| `SetupId`, `SetupRef`, `PublishedSetup` | tipos | existentes, `:85-90` | `SetupRef = {setupId, setupVersion}` |
| `SOLVER_SUBSTEPS` | `4` | existente, `:84`; usado em `:321` | subpassos por `STEP`: `step` usa `Math.ceil(dt / (STEP / SOLVER_SUBSTEPS))`, mesmo valor de antes da feature; 120 × 4 = 480 Hz (REQ-FEAT-0005-07) |

`KartConfig` (`:31-46`) tem campos **opcionais**, lidos apenas dentro do ramo `config.drivingAssists` de
`integrate` e de `steeringLimit`; ausente, cada um vale o literal que o código usava antes da feature, de
modo que `RENTAL_KART` e `ARCADE_KART`, que não os declaram, se comportam exatamente como antes (I4;
`REALISTA_UNCHANGED` prova). Unidade no sufixo (D-FS-06):

| Campo opcional | Unidade | Padrão (comportamento anterior) | Onde atua (as-built) | Alavanca para |
|---|---|---|---|---|
| `steerApplyRatePerS` | múltiplo do limite por s (1/s) | 5 | `:206-207` taxa de aproximação do esterço ao alvo | subida a 90 % em ≤ 180 ms (REQ-FEAT-0001-01, -03); entregue 14 |
| `steerReturnRatePerS` | múltiplo do limite por s (1/s) | 10 | `:206-207` taxa de retorno ao soltar ou inverter | queda a 10 % em ≤ 250 ms (REQ-FEAT-0001-02, -04); entregue 24 |
| `assistLateralG` | g | `friction` | `:184-187` aceleração lateral que o limite de esterço por velocidade pede | raio de 18 m a 50 km/h sem saturar a frente (REQ-FEAT-0002-01 a -03): a 13,89 m/s o raio de 18 m pede 10,7 m/s² (1,09 g) de aceleração lateral; entregue 1,48 g. Com acelerador 0 a velocidade cai, o limite de esterço cresce e o raio natural aperta (sai do anel pelo lado interno, [ADR-0005](../adr/ADR-0005-pista-de-teste-como-ambiente-da-simulacao-e-velocidade-mantida.md)): por `DOMAIN/DEC-13` isso não reprova, e a alavanca só precisa manter `understeer` ≤ 200 ms consecutivos nos passos na faixa até a primeira saída (`DOMAIN/DEC-14`, F-Spec 3.4.0): na grama, depois da saída, o teto de guinada da assistência cai com `grassFriction` (`:253`, `:260-261`) enquanto o limite de esterço cresce com a desaceleração, a deriva dianteira fica entre 0,15 e 0,36 rad contra 0,05–0,08 rad na traseira e o rótulo `understeer` vale por construção em todo passo — nenhuma alavanca desta tabela move `grassFriction`, o teto de guinada ou o rótulo, e os passos depois da saída não entram na medição. Medido pela rodada de código 3 (`docs/physics.md:253`, `:270-277`): 633 ms na janela inteira, 125 ms até a saída, de modo que o acerto entregue (1,48 g) atende sem retune; com acelerador cheio a permanência na faixa continua exigida |
| `assistSteerAllowanceRad` | rad | 0,045 | `:185-187` folga além do limite cinemático | saturação progressiva da frente acima de V1 (REQ-FEAT-0002-04, -05, -10): com `assistLateralG`, decide se, e em que patamar, a frente satura e a telemetria reporta `understeer` no asfalto. Por `DOMAIN/DEC-12` (F-Spec 3.3.0) a frente **não precisa** avisar antes da saída da faixa: V1 ≥ 1,15 × V0 (57,5 km/h) é cumprido por um patamar completo com `understeer` acima de 200 ms consecutivos de alvo ≥ 59,0 km/h, **ou** pela saída da faixa acima de 50 km/h depois de pelo menos dois patamares completos acima de 50 km/h com o patamar interrompido de alvo ≥ 59,0 km/h, sem subesterço em patamar algum (V1 = velocidade mantida do patamar interrompido; [ADR-0004](../adr/ADR-0004-ensaios-como-biblioteca-e-parametros-de-ensaio.md), decisão 8). Medido pela rodada de código 2 (`docs/physics.md:252`; feedback de 2026-10-22): `ARCADE_KART` (0,045 rad, `friction` 1,10) reporta 808 ms no patamar de 50 km/h e sai a 51,7 km/h (V0 = 50 km/h); o acerto entregue (0,004 rad, 1,48 g, `:78`) chega ao limite com os dois eixos derivando por igual (dianteira 0,075–0,130 rad, traseira 0,088–0,122 rad), o rótulo `understeer` de `handling()` (`:156-163`: deriva dianteira > 0,09 rad **e** > 1,2 × a traseira; inalterado por decisão do dono) fica em `grip`, o kart completa 7 patamares acima de 50 km/h sem `understeer` e sai da faixa a 56,1 km/h com o patamar interrompido em 64,4 km/h — `MEASUREMENT_MISSING` pelo projeto anterior, fim natural com V1 = 64,4 km/h por este; folga ≥ 0,016 rad reporta `understeer` já a 50 km/h com acelerador 0 (REQ-FEAT-0002-01 reprova) e ≤ 0,012 rad nunca. Nenhuma alavanca dependente da velocidade é acrescentada |
| `yawTrackingGainPerS` | 1/s | 0 (termo inexistente fora do drift; no drift o ganho 4 de `:268` não muda) | `:270-272` momento `clamp(inertia × (intendedYaw − yawRate) × ganho, ±140 N·m)` fora do drift | rapidez da guinada ao aplicar e ao soltar (REQ-FEAT-0001-01 a -04); entregue 5,8 |
| `yawCorrectGainPerS` | 1/s | 9 | `:266` amortecimento do excesso de guinada ao soltar | recuperação em ≤ 400 ms (REQ-FEAT-0003-04, -09); entregue 33 |
| `slipDampingGainPerS` | 1/s | 4 | `:258` amortecimento da velocidade lateral excedente | `sideslipRad` ≤ 0,65 em condução normal e na recuperação (REQ-FEAT-0003-05, -06); entregue 18 |
| `slipDampingCapG` | g | 0,45 | `:257` teto da força de amortecimento | idem; entregue 0,8 |
| `forcingRearFrictionScale` | adimensional | 1 (sem efeito) | `:208`, `:242` multiplicador do atrito dos pneus traseiros só nos passos com `forcing` verdadeiro (como o 0,86 do drift) | traseira viva ao forçar, nunca em condução normal (REQ-FEAT-0003-01, -03); entregue 0,67 |
| `forcingRampMps` | m/s | 0 (degrau: a escala vale inteira a partir de 50 km/h, comportamento anterior) | existente, `:46`, `:192-195` (`forcingRampFraction`), `:328`, `:208`: a escala aplicada aos pneus traseiros passa a `1 + (forcingRearFrictionScale − 1) × r`, com `r = clamp((state.speed − 50 / 3.6) / forcingRampMps, 0, 1)` calculado uma vez por passo em `step` (`:328`), sobre o mesmo `state.speed` (início do passo) de `isForcing` (`:327`), e entregue a `integrate` junto com `forcing` (`:336`); `r = 1` quando o campo é 0 ou ausente (o degrau anterior) | margem entre a curva de referência com acelerador cheio, em que `forcing` passa a verdadeiro assim que a velocidade excede 50 km/h e `handling` ainda tem de ser `grip` ou `understeer` (REQ-FEAT-0003-02), e o ensaio de recuperação, que entra bem acima de 50 km/h e precisa da traseira solta (REQ-FEAT-0003-04); a mesma margem vale para a varredura de `UNDERSTEER_ONSET`, cujos passos de acelerador 1 acima de 50 km/h, com esterço cheio, também são "Forçando" (REQ-FEAT-0002-05, -10); `forcing` em si continua binário (RULE-0001). Entregue 2,4 m/s com escala 0,67: a curva de referência com acelerador cheio fica na faixa sem `oversteer`/`sliding` e a recuperação volta a `grip` em 8 ms (`docs/physics.md:245-248`) |
| `grassSpeedLossPerS` | 1/s | 0 (sem efeito) | `:275` força longitudinal extra `−massa × u × k × fração de rodas na grama` | ≥ 30 % de perda em 1 s na grama (REQ-FEAT-0004-03, -04, -08); entregue 0,7 (48 % e 55 % medidos, `docs/physics.md:253`) |

Parâmetros existentes retunados no v5 (mesmas unidades de hoje): `enginePower` (W), `driveForce` (N),
`governorSpeed` (m/s), `throttleRate` (1/s), `friction`, `rearStiffness`, `frontStiffness`, `maxSteer`
(rad). `kartMass`, `driverMass` (75 kg no ensaio), `wheelbase`, `trackWidth`, `frontWeight`, `cgHeight`,
`yawRadius` e `grassFriction` não mudam de nome nem de unidade. Os valores respeitam as restrições numéricas
do acerto agressivo (`DOMAIN/REF-02`, F-Spec 3.0.0 e seguintes): para 0–60 km/h em 2,5 s com 228 kg a força
líquida média precisa ser ≥ 1 520 N (16,67 m/s ÷ 2,5 s × 228 kg); para 105 km/h estabilizados (29,17 m/s)
`governorSpeed` precisa superar 29,17 m/s mais a rampa de 1,5 m/s do governador (`:216`); a curva de
referência de 18 m a 50 km/h exige que o limite de esterço por velocidade (`assistLateralG`) admita ao
menos 1,09 g de aceleração lateral sem saturar a frente; e, na pista de teste em reta, a guinada que o
limite de esterço pede a 50 km/h com esterço cheio é `u × tan(limite) / wheelbase` (com o acerto entregue,
`assistLateralG` 1,48 e folga 0,004 rad, cerca de 1,1 rad/s de teto; a guinada real fica abaixo, e a subida
medida é de 117 ms), o que limita o deslocamento lateral do kart durante o ensaio de resposta e, por isso, a
duração do ensaio que cabe na faixa de 11 m ([DES-0004](DES-0004-ensaios-de-dirigibilidade-e-saida.md),
`holdMs`). As restrições se contrariam e a escolha dos valores é da etapa de código: força motriz alta para
0–60 km/h faz o kart ganhar velocidade na curva de referência com acelerador cheio, onde ele tem de ficar na
faixa e em `grip`/`understeer`, e a traseira tem de soltar no ensaio de recuperação a 60 km/h —
`forcingRampMps`, `forcingRearFrictionScale` e `driveForce` são as alavancas desse compromisso. Medido na
rodada de código 2: 0–60 km/h em 2 383 ms, 110,2 km/h estabilizados, volta do piloto de teste em 21 340 ms
sem sair do asfalto (`docs/physics.md:250-255`).

### Pista de teste (existente, as-built)

Dois geradores de `Environment` (`:164`), puros, sem importação nova, ao lado de `CIRCUIT` e `TEST_PAD`
(`:165-166`), escritos pela rodada de código 2 (`:167-178`). A pista de teste não é dado de pista: não tem
`trackId`, linhas, setores nem marcadores, e nenhum adaptador ou tela a alcança (RULE-0002, Ambientes;
`SEED/RD-06`).

| Símbolo | Assinatura | Descrição |
|---|---|---|
| `testPadLane(laneWidthM)` | `(laneWidthM: number /* m */) => Environment` (`:170-172`) | reta: `surfaceAt(p)` é `'asphalt'` se `\|p.x\| <= laneWidthM / 2`, senão `'grass'`; sem limite em z; `walls: false`. O kart entra em `(0, 0)` com `heading` 0 (sentido +z, `src/physics.ts:122`) |
| `testPadArc(arcRadiusM, laneWidthM)` | `(arcRadiusM: number /* m */, laneWidthM: number /* m */) => Environment` (`:173-178`) | arco: anel centrado na origem; `surfaceAt(p)` é `'asphalt'` se `\|hypot(p.x, p.z) − arcRadiusM\| <= laneWidthM / 2`, senão `'grass'`; `walls: false`. O anel não tem fim: "o arco" de um ensaio é o trecho percorrido na sua janela, e a entrada é o ponto `(arcRadiusM, 0)` com `heading` 0, tangente ao anel, com o centro à direita do kart (esquerda do corpo é `+x` em `heading` 0, `:122`), de modo que `input.steer` +1 pede a curva para dentro (`targetSteer = −steer × limite`, `:204`) |

`laneWidthM` é sempre `WIDTH` (`src/track.ts:2`, 11 m): "faixa da largura da pista". `arcRadiusM` é 18
(`DOMAIN/REF-03`). Fora da faixa `surface` é `GRASS` no sentido de "fora do asfalto" (API-0001): a
telemetria não distingue grama de ensaio de grama de pista, e nenhum critério de grama é medido na pista
de teste; na curva de referência com acelerador 0 a execução continua fora da faixa e a saída é reportada,
mas `maxUndersteerMs` é medido só nos passos na faixa até a primeira saída (REQ-FEAT-0002-09;
`DOMAIN/DEC-14`; ADR-0005). `wallContact` nunca é verdadeiro ali porque `walls` é falso (`:299`). A
constante `TEST_PAD` (asfalto sem limite) permanece para os usos existentes e para `DRIFT_MANEUVER`, cujo
ambiente é o da verificação existente (`tests/maneuvers.test.ts:63-67`).

### Condição de forçar e telemetria por passo (existentes, as-built)

`step(state, input, dt, config, environment)` (assinatura inalterada, `:319`):

1. Calcula `forcing` uma vez por chamada (`isForcing`, `:118-120`, em `:327`): `clamp(input.throttle, 0, 1) >= 1`
   **e** `|clamp(input.steer, −1, 1)| >= 1` **e** `state.speed > 50 / 3.6` (13,888… m/s, 50 km/h,
   `DOMAIN/DEC-02`; o literal `FORCING_SPEED_MPS` vive só em `src/physics.ts:117` e não é configurável;
   `state` é o estado no início do passo). Esterço parcial nunca satisfaz a condição (RULE-0001). A
   saturação na faixa de `Input` ocorre em `:119`, `:204`, `:212-213`; `forcing` usa o valor saturado
   (REQ-FEAT-0001-07).
2. Calcula a fração da rampa (`forcingRampFraction`, `:328`) e passa `forcing` e a fração a `integrate`
   (`:336`), que aplica `forcingRearFrictionScale` com a rampa aos pneus traseiros quando
   `config.drivingAssists && forcing` (`:208`, `:242`).
3. Incrementa `stepCount` (`:341`; inteiro, +1 por chamada de `step`, 0 em `initialState()`, `:112`).
4. Preenche a telemetria do passo (`Telemetry`, `:17-21`; `:314-316`):

| Campo de `Telemetry` | Tipo | Definição |
|---|---|---|
| `forcing` | booleano | o valor calculado em 1 |
| `surface` | `'asphalt' \| 'grass'` | `environment.surfaceAt({x, z})` no centro do kart **depois** do passo (`:316`); em `CIRCUIT` é o critério `nearest(p).distance > WIDTH / 2` (`:165`); na pista de teste, o da faixa |
| `wallContact` | booleano | verdadeiro se, neste passo, o ramo `environment.walls` (`:299-312`) encontrou `outgoing > 0` e removeu a componente normal da velocidade; falso nos demais, inclusive no kart encostado com velocidade 0 |
| `assistActive` | booleano | verdadeiro se o ramo `config.drivingAssists && state.speed > 0.5` (`:250`) executou neste passo |

No estado inicial (`emptyTelemetry`, `:103-106`) `surface` é o literal `'asphalt'`: `initialState()` não
recebe ambiente e a telemetria inicial é literal ([DES-0002](DES-0002-telemetria-de-dirigibilidade.md)).
Os campos existentes (`handling`, `sideslip`, `frontSlip`, `rearSlip`, `wheels`, G) e o classificador
`handling()` (`:156-163`) não mudam — nem por `DOMAIN/DEC-12`, que fixa V1 em vez de mudar o rótulo:
`oversteer` e `sliding` continuam sendo leituras das forças; a assistência garante que em condução normal
(sem `forcing`, sem drift, fora de recuperação) a traseira não satura e `|sideslip|` fica ≤ 0,65 rad, por
amortecimento (`slipDampingGainPerS`, `slipDampingCapG`, `yawCorrectGainPerS`), e que ao forçar o atrito
traseiro reduzido deixa a traseira soltar. A parede já reduz a velocidade a cada contato com `outgoing > 0`
(`:305-308`: a componente normal passa a −0,12 × `outgoing`, a tangencial fica, logo o módulo diminui), o
que realiza REQ-FEAT-0004-05 sem alteração; esta feature só o reporta.

### Classificação do passo (existente, as-built; RULE-0001)

| Símbolo | Assinatura | Descrição |
|---|---|---|
| `StepClass` | `'NORMAL' \| 'FORCING' \| 'DRIFT' \| 'RECOVERY'` (`:363`) | as quatro classes de RULE-0001 |
| `RECOVERY_MAX_STEPS` | `48` (= `Math.round(0.4 / STEP)`, `:364`; 400 ms de `DOMAIN/DEC-04`) | teto da recuperação em passos; `toMs(48)` = 400 (inclusivo) |
| `classifyHandlingSteps(steps)` | `(steps: readonly {input: Input; telemetry: HandlingTelemetry}[]) => StepClass[]` (`:366-385`) | classifica cada passo a partir do `Input` aplicado nele e da telemetria **depois** dele, na ordem de `simStepCount`, sem estado além da sequência |

Regra, passo `k` (0 ≤ k < n):
- `DRIFT` se `telemetry[k].driftActive`; senão `FORCING` se `telemetry[k].forcing`;
- senão `RECOVERY` se existe um passo de soltura `s ≤ k` tal que `|clamp(input[s−1].steer)| >= 1`,
  `input[s].steer === 0`, `telemetry[s−1].forcing` verdadeiro, `telemetry[s−1].handling` em
  `oversteer`/`sliding`, nenhum passo em `s..k−1` tem `handling` `grip`, e `k − s + 1 <= RECOVERY_MAX_STEPS`
  (o passo de soltura e o primeiro passo em `grip` pertencem à recuperação; um passo `FORCING` ou `DRIFT`
  entre `s` e `k` encerra a recuperação);
- senão `NORMAL`.

Os passos além de `RECOVERY_MAX_STEPS` sem `grip` são `NORMAL` e, com `oversteer`/`sliding`, falham o
agregado (REQ-FEAT-0003-12; RULE-0001). A função não lê o ambiente: um passo fora do asfalto recebe a sua
classe e é o agregado de [DES-0004](DES-0004-ensaios-de-dirigibilidade-e-saida.md) que o exclui ("no
asfalto"). Esterço reduzido a valor intermediário não abre recuperação (lacuna deliberada do F-Spec).

## Colaboradores

Chama `nearest`/`WIDTH` (`src/track.ts`) e `advanceManeuvers` (`src/maneuvers.ts`), como hoje. É chamado por
`src/lap.ts` (`stepLap`), por `src/setupRecords.ts`, por `scripts/handlingBench.ts` (`step`,
`getHandlingTelemetry`, `testPadLane`, `testPadArc`, `classifyHandlingSteps`, `RECOVERY_MAX_STEPS`), por
`scripts/physics-bench.ts` e pelos testes. `src/main.ts` lê `PUBLISHED_SETUPS` e `getHandlingTelemetry`.
Nenhuma importação de `three`, DOM, `src/audio.ts` ou `src/main.ts`.

## Estado e concorrência

- `State` é imutável por passo: `step` devolve um estado novo; `stepCount` é o contador de sequência
  (`simStepCount` de API-0001) e avança só quando `step` é chamado — na pausa, perda de foco ou perda do
  sensor `stepLap` devolve a mesma sessão (`src/lap.ts:173`) e nenhum contador avança, logo todo limite em
  ms conta só tempo simulado (REQ-FEAT-0001-08, REQ-FEAT-0002-08, REQ-FEAT-0003-11).
- Idempotência: `step` é função pura do estado, do `Input`, de `dt`, do `config` e do ambiente; reaplicar o
  mesmo passo ao mesmo estado dá o mesmo estado. `classifyHandlingSteps` é função pura da sequência:
  reavaliar o mesmo passo com o mesmo histórico dá a mesma classe (RULE-0001, Idempotência). Não há chave
  de deduplicação porque não há evento externo.
- A versão anterior é um registro intacto: `ARCADE_KART` não é tocado; a nova versão é `ARCADE_ASSISTIDO_V5`
  (REQ-FEAT-0005-09). Não existe caminho para o jogo escolher o acerto anterior: `PUBLISHED_SETUPS` expõe
  `previousConfig` só para os ensaios de linha de base. Cada rodada do ciclo em staging (`DOMAIN/DEC-10`)
  que altera um parâmetro é nova `setupVersion` (ADR-0001).

## Comportamento em falha

Sem dependência externa, sem tempo-limite, sem escrita parcial. `dt` fora de (0, 0,1] continua lançando
`RangeError` (`:320`), como hoje. Um campo opcional ausente vale o padrão; um campo presente com valor não
finito não é validado em tempo de execução (os presets são literais congelados, verificados por
`tests/dirigibilidade-contract.test.ts`). `testPadLane`/`testPadArc` com largura ou raio não positivos
devolvem um ambiente todo `grass` (nenhum ensaio os chama assim; `tests/dirigibilidade-telemetry.test.ts`
afirma a geometria com os valores do ensaio). `classifyHandlingSteps` com lista vazia devolve lista vazia.
Nada é registrado em log pela simulação.

## Observabilidade

Os limiares são observados pelos registros de API-0003 ([DES-0004](DES-0004-ensaios-de-dirigibilidade-e-saida.md)):
`riseToNinetyPctMs`, `fallToTenPctMs`, `speedMinMps`/`speedMaxMps`, `maxUndersteerMs`, `v1Mps` (com a
linha `#` dizendo de onde veio), `recoveryMs`/`gripReached`, `maxSideslipRad`,
`oversteerOrSlidingStepCount`, `excludedRecoveryStepCount`, `zeroToSixtyKmhMs`, `topSpeedMps`,
`speedAfterOneSMps`, `contacts`. Uma regressão aparece como `FAIL` com `THRESHOLD_EXCEEDED`, `OFF_ASPHALT`,
`MEASUREMENT_MISSING` ou `SPEED_NOT_HELD` no registro correspondente.

## Determinismo (D-DS-07)

Passo fixo `STEP`, `SOLVER_SUBSTEPS` fixo, sem relógio, sem sorteio; `forcing` é função do `Input` e do
estado; os geradores da pista de teste são funções puras da posição; o classificador é função pura da
sequência. Provas: `tests/dirigibilidade-test-pilot.test.ts` executa cada ensaio e a volta do piloto de
teste duas vezes e afirma `deepEqual` dos estados por passo (`DETERMINISM`);
`tests/race-lap-validation-layering.test.ts` continua afirmando a ausência de `Date`, `performance`,
`Math.random` e DOM em `src/physics.ts`.

## Feature flag

Nenhuma chave: a versão corrente é dado publicado ([RULE-0003](../../../../320%20F-Specs/Output/dirigibilidade/rules/RULE-0003-versao-do-acerto-e-comparabilidade.md))
e o F-Spec proíbe configuração para escolher entre o acerto antigo e o novo (FEAT-0005, Configuração). O
"padrão sem mudança" (I4) está nos campos opcionais: ausentes em `RENTAL_KART` e `ARCADE_KART`, cada um vale
o literal anterior — `forcingRampMps` ausente é o degrau anterior —, e o Realista e a versão anterior não
mudam de comportamento; o motivo está em
[ADR-0001](../adr/ADR-0001-versao-do-acerto-como-registro-novo-no-codigo.md). Os geradores da pista de
teste e o classificador não alteram nenhum passo do jogo: só são chamados pelos ensaios.

## Pontos em aberto

Nenhum.
