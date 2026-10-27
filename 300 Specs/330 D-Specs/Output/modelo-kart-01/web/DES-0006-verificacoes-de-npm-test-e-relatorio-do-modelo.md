---
id: DES-0006
title: Verificações de npm test e relatório do modelo montado (API-0002) — medidas, custo, giro, camadas, neutralidade, contrato de passo, determinismo e wheelPositions
feature: modelo-kart-01
stage: dspec
status: validated
version: 1.3.0
sources: [API-0002, FLOW-0003, RULE-0001, RULE-0003, FEAT-0001, FEAT-0002, FEAT-0004, FEAT-0005, FEAT-0006, REQ-FEAT-0001-02, REQ-FEAT-0001-03, REQ-FEAT-0001-04, REQ-FEAT-0001-05, REQ-FEAT-0001-06, REQ-FEAT-0001-07, REQ-FEAT-0001-08, REQ-FEAT-0001-09, REQ-FEAT-0001-10, REQ-FEAT-0001-11, REQ-FEAT-0001-12, REQ-FEAT-0001-13, REQ-FEAT-0001-14, REQ-FEAT-0002-02, REQ-FEAT-0004-03, REQ-FEAT-0004-04, REQ-FEAT-0005-05, REQ-FEAT-0005-06, REQ-FEAT-0006-04, REQ-FEAT-0006-05, REQ-FEAT-0006-06, REQ-FEAT-0006-07, REQ-FEAT-0006-08, NFR-0004, NFR-0005, NFR-0006, NFR-0007]
---

# DES-0006 — Verificações de `npm test` e relatório do modelo montado (API-0002)

## Realiza

O contrato API-0002 campo a campo — a operação `kartModelReport` é o conjunto de registros que os arquivos de
teste emitem na saída de `npm test` (seção Interface) — e o fluxo FLOW-0003: um registro por verificação, com `checkId`,
`verdict` e, no `FAIL`, `checkFailReason` na ordem da tabela de decisão de RULE-0001; as medidas, grupos,
cores e custo do modelo montado (REQ-FEAT-0001-02 a -14; REQ-FEAT-0004-03, -04); o giro das rodas depois de
um número conhecido de passos (REQ-FEAT-0002-02); camadas, neutralidade da renderização, contrato de passo,
determinismo, `wheelPositions` e posições de roda da telemetria contra a linha de base anterior à feature
(REQ-FEAT-0005-05, -06; REQ-FEAT-0006-04, -05, -07, -08), com `BASELINE_MISSING` quando a linha de base
falta. A verificação dos três arquivos da simulação e dos presets sem linha alterada (REQ-FEAT-0006-06) é a
diferença do repositório, registrada pela etapa de código no seu manifesto, mais `SIM_CONTRACT`.

## Posicionamento

Camada **Aplicação** (programas de teste em Node, no lugar da árvore que `tests/` ocupa, como os benches da
`dirigibilidade` em `scripts/`), todos **novos**:

- `tests/helpers/kart01Report.ts` — medidas, vereditos e serialização do relatório; importado pelos testes.
- `tests/modelo-kart-01-model.test.ts` — `KART_DIMENSIONS`, `WHEELS_AND_TRACKS`, `PART_GROUPS`, `PART_COLORS`,
  `DRAW_COST`.
- `tests/modelo-kart-01-pose.test.ts` — API-0001, `WHEEL_SPIN`, ponto de referência, `TELEMETRY_WHEEL_POSITIONS`.
- `tests/modelo-kart-01-camera.test.ts` — API-0003 e RULE-0002.
- `tests/modelo-kart-01-contract.test.ts` — `LAYERING`, `RENDER_NEUTRAL`, `SIM_CONTRACT`, `DETERMINISM`,
  `WHEEL_POSITIONS`, símbolos de `src/main.ts`, dependências declaradas.
- `scripts/kart01-baseline.ts` — gravador da linha de base ([DM-0001](../data/DM-0001-linha-de-base-da-simulacao-e-registro-em-tela.md),
  [ADR-0004](../adr/ADR-0004-linha-de-base-da-simulacao-como-fixture-versionado.md)); `package.json` ganha o
  script `baseline:kart01` (`tsx scripts/kart01-baseline.ts`); nenhuma dependência de execução nova.

Motivo de o relatório ficar em `tests/helpers/` e não em `src/`: é evidência (I9), não comportamento do jogo;
só lê o modelo e a simulação pelas suas operações públicas.

## Interface

`kartModelReport` (API-0002) é o nome do conjunto de registros que `npm test` produz, não um símbolo exportado:
cada arquivo de teste emite os seus registros, um por verificação, por `t.diagnostic(serializeRecord(record))`,
e a união é a operação — `KART_DIMENSIONS`, `WHEELS_AND_TRACKS`, `PART_GROUPS`, `PART_COLORS` e `DRAW_COST` em
`tests/modelo-kart-01-model.test.ts`; `WHEEL_SPIN` (um registro por velocidade ensaiada) e
`TELEMETRY_WHEEL_POSITIONS` em `tests/modelo-kart-01-pose.test.ts`; `LAYERING`, `RENDER_NEUTRAL`,
`SIM_CONTRACT`, `DETERMINISM` e `WHEEL_POSITIONS` em `tests/modelo-kart-01-contract.test.ts`: os 12 `checkId`
de API-0002, cada um em exatamente um arquivo. Nenhuma função chamada `kartModelReport` existe, porque os
registros nascem nos testes que `npm test` executa; `tests/helpers/kart01Report.ts` só mede, julga e serializa.

`tests/helpers/kart01Report.ts`:

| Símbolo | Assinatura | Descrição |
|---|---|---|
| `CheckId`, `CheckFailReason`, `CheckRecord` | tipos | os enums e o registro de API-0002: `checkId`, `verdict` (`PASS`/`FAIL`), `checkFailReason` só com `FAIL`, mais os campos medidos do `checkId` |
| `measureKart01Model(model)` | `(Kart01Model) => Kart01Measures` | percorre `model.root` na pose de repouso e devolve: `bboxLengthM`, `bboxWidthM` (m; caixa envolvente da união das geometrias dos 15 grupos, sem `piloto`, no referencial do modelo: comprimento em Z, largura em X); `wheelbaseM` (m; entre os centros dos nós `steer` dianteiros e traseiros); `frontWheelDiametersM`, `rearWheelDiametersM` (m; extensão em Z da caixa envolvente da geometria mesclada de cada roda no referencial local do nó `spin`, o eixo de rolamento — a regra de DES-0001, "Como as medidas de RULE-0001 saem do modelo montado"; medida da geometria, não `wheels[nome].diameterM`; ordem esquerda, direita); `frontTrackM`, `rearTrackM` (m; entre os centros dos nós `steer` do eixo); `partGroups` (um item por grupo nomeado encontrado, com `visibleTriangleCount` = triângulos das malhas visíveis sob o grupo e `parentGroupName` = grupo nomeado mais próximo que o contém, ausente se nenhum); `missingGroupNames` (dos 16 esperados, os ausentes ou com 0 triângulos); `kartColorHexes`, `chassisColorHexes` (cores distintas `#RRGGBB` do atributo `color` das malhas dos grupos, convertidas de linear para sRGB e arredondadas a 8 bits, mais as `color` dos materiais de decalque); `bumperPlateColorHex` (`color` do material da malha `placaTraseira`); `suitColorHex` (`model.palette.macacao`, `FAIL` se ausente das cores do grupo `piloto`); `meshCount`, `drawCallCount` (soma por malha do número de materiais da malha), `triangleCount` (`index.count / 3` ou `position.count / 3` por malha) |
| `judgeModelCheck(checkId, measures)` | `(CheckId, Kart01Measures) => CheckRecord` | aplica RULE-0001: `KART_DIMENSIONS` `PASS` com as três medidas em ±0,02 m, senão `OUT_OF_TOLERANCE`; `WHEELS_AND_TRACKS` com cada valor arredondado ao centímetro igual (0,26; 0,28; 1,00; 1,14), senão `OUT_OF_TOLERANCE`; `PART_GROUPS` `GROUP_MISSING` se `missingGroupNames` não vazia, senão `GROUP_NESTED` se `piloto` tem `parentGroupName`; `PART_COLORS` `COLOR_MISMATCH` se alguma das quatro cores falta ou difere; `DRAW_COST` `LIMIT_EXCEEDED` se `drawCallCount > 30`, senão `SHAPE_CHANGED` se `triangleCount !== 5128`; com mais de uma condição, a primeira na ordem da tabela |
| `wheelSpinCheck(rollingSpeedMps, checkStepCount)` | `(m/s, passos) => CheckRecord` | constrói `checkStepCount + 1` estados com `initialState()` espalhado com `vx`, `vz` da velocidade dada ao longo do rumo (sinal negativo = ré) e `stepCount` de 0 a `checkStepCount` (a construção de `tests/physics.test.ts:5`); lê `getKartPose` do primeiro e do último; aplica `advanceWheelSpin` **num único quadro** (`delta = checkStepCount`); `simulatedTimeMs = toMs(checkStepCount)`; para cada roda, `spinRevs` = o acumulado, `expectedSpinRevs = rollingSpeedMps × simulatedTimeMs / 1000 / (π × diameterM)`; `PASS` só com igualdade estrita (`===`) nas quatro rodas e sinal igual ao do movimento, senão `SPIN_MISMATCH`. As velocidades ensaiadas são 10, −10 e 0 m/s com 120 passos (1 000 ms): `120 × STEP` e `1000 / 1000` são exatamente 1 em ponto flutuante e as duas expressões coincidem bit a bit, sem tolerância |
| `layeringCheck()` | `() => CheckRecord` | lê com `node:fs` o texto de `src/physics.ts`, `src/maneuvers.ts`, `src/track.ts`, `src/trackData.ts`, `src/lap.ts`, `src/lapTiming.ts` (a lista `SIMULATION` de `tests/race-lap-validation-layering.test.ts`) e conta importações de `./kart01Model`, `./kart01Decals`, `./kartPose`, `./gameCamera`: `checkedFileCount` 6, `forbiddenImportCount` 0, senão `FORBIDDEN_IMPORT` |
| `renderNeutralCheck(reading, inputs)` | `(TrackReading, readonly Input[]) => CheckRecord` | duas execuções da mesma sequência a partir de `startSession` + `runCountdown`: uma só com `stepLap`; outra que, a cada passo, também chama `getKartPose`, `advanceWheelSpin`, `simWheelGroundPositions`, `computeCameraView` (área 1280 × 720 px, limites da pista sintética) e `updateKart01Pose` sobre um modelo montado em Node; `checkStepCount` = passos aplicados; `differingFieldCount` = campos de primeiro nível da `LapSession` final que diferem por `deepEqual`; `PASS` em 0, senão `STATE_DIFFERS` |
| `simContractCheck(baseline)` | `(SimBaseline \| BASELINE_MISSING) => CheckRecord` | sem linha de base: `FAIL` `BASELINE_MISSING`. Com ela: `stepUnchanged = STEP === baseline.stepS`; `inputContractUnchanged` = **conjunto de campos** igual **e faixas** iguais (a semântica de API-0002): o conjunto de campos pela linha `export type Input = ...` do texto de `src/physics.ts` igual a `baseline.inputTypeLine` (a linha carrega só os campos); as faixas pela saturação de `step`, o contrato público da simulação — para cada acerto publicado, a partir de `initialState()`, 120 passos de `step` com um `Input` constante além do limite dão o mesmo `State` (`deepEqual`) que com o `Input` no limite (`throttle` 2 ≡ 1 e −1 ≡ 0; `brake` 2 ≡ 1 e −1 ≡ 0; `steer` 3 ≡ 1 e −3 ≡ −1; `drift` falso nos dois), e o limite dá um `State` diferente de um valor dentro da faixa (`throttle` 1 ≢ 0,5; `brake` 1 ≢ 0,5; `steer` 1 ≢ 0,5) e de um valor interno junto ao limite, a 0,01 dele (`throttle` 0,99 ≢ 1 e 0,01 ≢ 0; `brake` 0,99 ≢ 1 e 0,01 ≢ 0; `steer` 0,99 ≢ 1 e −0,99 ≢ −1), o que prende cada limite ao seu valor com resolução de 0,01; as faixas anteriores à feature são `throttle` e `brake` em [0, 1] e `steer` em [−1, 1], as de `src/physics.ts:119`, `:204` e `:212-213` na revisão da linha de base, constantes da verificação (120 passos bastam: `throttle`, `brake` e `steering` do estado chegam ao alvo em menos de 0,2 s, a 3–8 /s, 6 /s e pelo menos 1,35 rad/s); um campo acrescentado ou retirado, um limite movido para fora (de qualquer valor: o par além/no limite deixa de coincidir) ou movido para dentro de 0,01 ou mais (o par junto ao limite passa a coincidir: com `clamp(input.throttle, 0, 0.8)`, 0,99 ≡ 1) dá `false`; um limite movido para dentro de menos de 0,01 não é distinguido por este booleano e é coberto só pela diferença de 0 linhas em `src/physics.ts` que o manifesto da etapa de código registra (REQ-FEAT-0006-06); `simMeasuresUnchanged` = `wheelbase` e `trackWidth` de cada `PUBLISHED_SETUPS[setupId].config` iguais a `baseline.simWheelbaseM` (1,04) e `baseline.simTrackWidthM` (1,20); `simWheelbaseM`, `simTrackWidthM` reportados; `PASS` com os três verdadeiros, senão `CONTRACT_CHANGED` |
| `determinismCheck(baseline, reading)` | `(SimBaseline \| BASELINE_MISSING, TrackReading) => CheckRecord` | sem linha de base: `BASELINE_MISSING`. Para cada execução de referência da linha de base (`ARCADE_ASSISTIDO`, `REALISTA_ALUGUEL_4T`): `startSession(reading, lapKind, PUBLISHED_SETUPS[setupId].config)`, `runCountdown`, replay dos `inputRuns` expandidos; compara `lapMs`, `sectorMs`, `lapValidity` e o `kart` final (`deepEqual`) com os gravados; `comparedRunCount` 2, `differingRunCount` = execuções com diferença; `PASS` em 0, senão `NON_DETERMINISTIC` |
| `wheelPositionsCheck(baseline, reading)` | idem | para cada execução de referência, depois dos `checkStepCount` passos, `wheelPositions(lap.config)` (4 pontos, `forward` e `left` em m) comparados valor a valor com `baseline.wheelPositions[setupId]`: `comparedValueCount` 16, `differingValueCount`; `PASS` em 0, senão `STATE_DIFFERS`; sem linha de base, `BASELINE_MISSING` |
| `telemetryWheelPositionsCheck(trace)` | `(readonly { pose: KartPose; config: KartConfig }[]) => CheckRecord` | para cada passo do traço de uma volta, compara os quatro pontos de `simWheelGroundPositions(pose, config)` com a transformação direta de `wheelPositions(config)` pela pose (a fórmula de `src/physics.ts:229`): `comparedStepCount`, `differingValueCount` (8 valores por passo); `PASS` em 0, senão `STATE_DIFFERS`. O teste afirma ainda, fora do registro, que os centros das rodas traseiras do modelo diferem desses pontos em 0,03 m na lateral: a verificação distingue as duas fontes |
| `readSimBaseline(path)` | `(string) => { ok: true; baseline: SimBaseline } \| { code: 'BASELINE_MISSING' }` | lê `tests/fixtures/kart01-sim-baseline.json`; `BASELINE_MISSING` se o arquivo falta, não é JSON, `schemaVersion !== 1`, ou se o `setupVersion` de cada execução de referência difere de `PUBLISHED_SETUPS[setupId].setupVersion` ou a `trackVersion` da leitura corrente difere da gravada (a linha de base é de outro acerto ou outra pista); nunca estima |
| `serializeRecord(record)` | `(CheckRecord) => string` | uma linha JSON por registro, com os nomes e unidades de API-0002 (decisão de forma: serialização em linhas JSON, impressas por `t.diagnostic` dos testes, como a saída dos ensaios da `dirigibilidade`); os números saem com a precisão de `JSON.stringify` |

`scripts/kart01-baseline.ts`: executa `completeLap` com `autopilot()` de `tests/helpers/autopilot.ts` para cada
acerto publicado, grava os `Input` por passo em `inputRuns` (codificação por corridas `[contagem, throttle,
brake, steer, drift]`), o `kart` final, `lapMs`, `sectorMs`, `lapValidity`, `wheelPositions`, `STEP`, a linha de
`Input` e as medidas da simulação em `tests/fixtures/kart01-sim-baseline.json`
([DM-0001](../data/DM-0001-linha-de-base-da-simulacao-e-registro-em-tela.md)); recusa sobrescrever sem
`--force`; `--commit <sha>` grava a revisão em que foi medido; `recordedAtUtc` por `new Date()` — a única
leitura de relógio deste item, num programa, não numa biblioteca.

## Colaboradores

Os testes chamam `buildKart01Model`, `updateKart01Pose` (`src/kart01Model.ts`), `getKartPose`,
`advanceWheelSpin`, `simWheelGroundPositions` (`src/kartPose.ts`), `computeCameraView` (`src/gameCamera.ts`),
`startLap`/`stepLap`/`getLapState`/`getLapResult` (`src/lap.ts`), `wheelPositions`, `STEP`,
`PUBLISHED_SETUPS`, `initialState` (`src/physics.ts`), `toMs` (`src/lapTiming.ts`), os fixtures
`syntheticReading()` e os helpers `startSession`, `runCountdown`, `drive`, `completeLap`, `autopilot`,
`replay` (existentes). Nenhum módulo de `src/` importa nada daqui.

## Estado e concorrência

Sem estado: cada verificação é uma leitura idempotente do modelo e de execuções da simulação; executar duas
vezes produz registros idênticos (API-0002, Idempotência). A única escrita é a de `scripts/kart01-baseline.ts`
no fixture, fora de `npm test`, com recusa de sobrescrita.

## Comportamento em falha

Linha de base ausente, ilegível, de versão desconhecida, de outro acerto ou de outra pista:
`BASELINE_MISSING` em `SIM_CONTRACT`, `DETERMINISM` e `WHEEL_POSITIONS`; nada é comparado nem estimado
(FLOW-0003). Modelo que não monta em Node (defeito): o teste falha com a exceção. Sem rede, sem tempo-limite.
Registro: os registros JSON na saída; nenhum caminho de arquivo além dos relativos à raiz do repositório;
nenhum dado pessoal ([DES-0007](../security/DES-0007-privacidade-sem-rede-e-sem-persistencia.md)).

## Observabilidade

Os próprios registros, um por verificação, na saída de `npm test`.

## Determinismo (D-DS-07)

Não é código de simulação. Nenhuma verificação lê relógio de parede ou sorteio: tempos são `toMs(passos)`;
as sequências de `Input` vêm do fixture ou do `autopilot` determinístico. Prova: `DETERMINISM` com
`differingRunCount` 0 e a execução repetida de `npm test` com registros idênticos.

## Feature flag

Nenhuma: verificações não têm chave; a linha de base ausente falha em vez de ser pulada.

## Pontos em aberto

Nenhum.
