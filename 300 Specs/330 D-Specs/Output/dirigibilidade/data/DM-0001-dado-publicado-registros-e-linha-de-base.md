---
id: DM-0001
title: Dado publicado do acerto, registros de volta e replay, saída dos ensaios e linha de base
feature: dirigibilidade
stage: dspec
status: validated
version: 3.0.2
sources: [API-0002, API-0003, RULE-0002, RULE-0003, FEAT-0005, FEAT-0006, REQ-FEAT-0002-06, REQ-FEAT-0005-05, REQ-FEAT-0005-08, REQ-FEAT-0005-09, REQ-FEAT-0006-08, REQ-FEAT-0006-09, NFR-0004, NFR-0009]
---

# DM-0001 — Dado publicado do acerto, registros de volta e replay, saída dos ensaios e linha de base

Não há banco de dados nem armazenamento no navegador nesta feature (`race-lap-validation` proíbe gravação
local, `tests/race-lap-validation-layering.test.ts`). Os "esquemas" desta feature são quatro formas de dado
versionado (I3, I5): o dado publicado com o jogo (literal em código), o registro de volta e o replay (dados
simples, em memória e em fixtures), a saída dos ensaios (linhas JSON) e a linha de base em `docs/physics.md`.
Nenhum campo carrega dado pessoal (I6). Unidades no nome de todo campo numérico (D-FS-06). A pista de teste
aberta não é dado: é um ambiente construído por função
([DES-0001](../core/DES-0001-acerto-arcade-assistido-v6-e-assistencias.md)), sem registro algum.

## 1. Dado publicado — `PUBLISHED_SETUPS` (`src/physics.ts:98-106`)

Um registro por `setupId`, congelado (`Object.freeze`), literal em código.

| Campo | Tipo | Unidade | Nulo | Padrão | Restrições |
|---|---|---|---|---|---|
| `setupId` | `'ARCADE_ASSISTIDO' \| 'REALISTA_ALUGUEL_4T'` | — | não | — | chave única |
| `setupVersion` | texto não vazio | — | não | — | única entre todas as versões declaradas; diferente de `previousSetupVersion` |
| `previousSetupVersion` | texto não vazio | — | sim | ausente | a versão do acerto anterior à feature (API-0002, RULE-0003); presente só quando houve |
| `config` | `Readonly<KartConfig>` | campos com unidade em [DES-0001](../core/DES-0001-acerto-arcade-assistido-v6-e-assistencias.md) | não | — | o preset da versão corrente |
| `previousConfig` | `Readonly<KartConfig>` | idem | sim | ausente | o preset da versão anterior à feature, intacto; presente se e só se `previousSetupVersion` presente |

Valores publicados **(muda)**:

| `setupId` | `setupVersion` | `previousSetupVersion` | `config` | `previousConfig` |
|---|---|---|---|---|
| `ARCADE_ASSISTIDO` | `arcade-assistido-v6` | `arcade-assistido-v4` | `ARCADE_ASSISTIDO_V6` (acerto C, `DOMAIN/DEC-15`) | `ARCADE_KART` (intacto, `src/physics.ts:67-74`) |
| `REALISTA_ALUGUEL_4T` | `realista-aluguel-4t-v4` | ausente | `RENTAL_KART` (intacto, `src/physics.ts:55-64`) | ausente |

Versões declaradas do Arcade e o seu registro em código: `arcade-assistido-v4` (`ARCADE_KART`, anterior à
feature, `previousSetupVersion`); `arcade-assistido-v5` (`ARCADE_ASSISTIDO_V5`, publicada na staging e
substituída: `SUPERSEDED`, legível, nunca editada; não está em `PUBLISHED_SETUPS` porque o dado publicado tem
um registro por `setupId`, e um registro gravado com ela é lido com `setupVersionSource` `DECLARED` e nunca é
comparável com a corrente); `arcade-assistido-v6` (`ARCADE_ASSISTIDO_V6`, corrente). Cada rodada seguinte do
ciclo em staging (`DOMAIN/DEC-10`) que altera um parâmetro declara um literal novo e a `setupVersion`
seguinte; o identificador de uma rodada substituída nunca é reutilizado nem editado, e o seu literal fica em
código. `previousSetupVersion` continua a apontar para a versão anterior à feature, porque é o padrão com que
um registro gravado antes da feature, sem `setupVersion`, é resolvido (API-0002).

Índices e unicidade: `setupId` é a chave do registro; `setupVersion` e `previousSetupVersion` são únicos no
conjunto de todas as versões declaradas, inclusive as substituídas (verificado por
`tests/dirigibilidade-setup-version.test.ts`).

## 2. Registro de volta — `LapRecord` (`src/setupRecords.ts:17`, inalterado)

O `LapResult` de `race-lap-validation` (API-0001 1.2.0 daquela feature) com os campos de API-0002
obrigatórios; todo campo de `LapResult` 1.2.0 é carregado como está, inclusive os opcionais de uma volta de
treino. O `LapResult` carrega `setupId?` e `setupVersion?` copiados do pedido `startLap`, ausentes
quando o pedido não os traz; só esta feature constrói o registro (`buildLapRecord`), preenchendo só o que o
resultado não traz ([ADR-0002](../adr/ADR-0002-formato-do-replay-e-registro-de-volta-em-memoria.md)).

| Campo | Tipo | Unidade | Nulo na leitura | Nulo na gravação | Padrão na leitura |
|---|---|---|---|---|---|
| `trackId`, `trackVersion`, `lapKind`, `lapValidity`, `official`, `challengeNumber?`, `invalidReason?`, `lapMs?`, `sectorMs?` | como em `LapResult` | ms nos tempos | como hoje | como hoje | como hoje |
| `lapSequenceCount?` | inteiro, como em `LapResult` 1.2.0 | voltas | sim (presente em todo resultado `TRAINING`; ausente em `OFFICIAL` e `RECON`) | como em `LapResult` | ausente lê-se como 1 (padrão de `race-lap-validation`) |
| `lapStartMs?` | inteiro, como em `LapResult` 1.2.0 | ms | sim (idem) | como em `LapResult` | ausente lê-se como 0 (idem) |
| `trainingLapMs?` | inteiro, como em `LapResult` 1.2.0 | ms | sim (só com `lapKind` `TRAINING`) | como em `LapResult` | ausente |
| `trainingSectorMs?` | lista de 4 posições, inteiro ou `null`, como em `LapResult` 1.2.0 | ms | sim (só com `lapKind` `TRAINING` numa pista que declara setores) | como em `LapResult` | ausente |
| `setupId` | enum | — | sim (registro antigo) | não | `ARCADE_ASSISTIDO` (`resolveSetupRef`) |
| `setupVersion` | texto | — | sim (registro antigo) | não | `previousSetupVersion` do `setupId` resolvido (`arcade-assistido-v4` para o Arcade) |

Os quatro campos de treino são de `race-lap-validation`: esta feature os copia com o resto do resultado
(`buildLapRecord` só acrescenta os dois campos de acerto) e nenhum deles entra na comparabilidade (RULE-0003),
no texto compartilhado nem em ensaio algum. Nenhum campo de drift, turbo, carga ou pontuação existe no
registro (AC-US-0003-09, -11).

## 3. Replay — `ReplayRecord` versão 1 (`src/setupRecords.ts:18-21`, inalterado)

| Campo | Tipo | Unidade | Nulo na leitura | Nulo na gravação | Padrão na leitura |
|---|---|---|---|---|---|
| `replayFormatVersion` | inteiro ≥ 1 | — | sim | não (1) | ausente lê-se como 1; maior que 1 é `UNSUPPORTED_FORMAT` |
| `trackId` | texto não vazio | — | não | não | ausente é `UNREADABLE` |
| `trackVersion` | texto não vazio ou inteiro ≥ 1 | — | não | não | ausente é `UNREADABLE` |
| `challengeNumber` | inteiro ≥ 1 | — | sim | sim | ausente |
| `lapKind` | `'OFFICIAL' \| 'RECON' \| 'TRAINING'` | — | sim | não | `TRAINING` |
| `setupId` | enum | — | sim (registro antigo) | não | `ARCADE_ASSISTIDO` |
| `setupVersion` | texto | — | sim (registro antigo) | não | como em `LapRecord` |
| `inputs` | lista de `Input` por passo `RUNNING`; no máximo `MAX_REPLAY_INPUT_STEPS` (36 000) | um por passo de `STEP` | não | não | lista vazia, acima do teto ou elemento fora de forma é `UNREADABLE` |

Teto do registro serializado: texto JSON com mais de `MAX_REPLAY_TEXT_CHARS` (4 194 304) caracteres é
`UNREADABLE` antes de ser analisado. `Input` por passo: `{throttle: 0..1, brake: 0..1, steer: -1..1, drift?:
boolean}` — o conjunto, a faixa e o significado de `src/physics.ts:9`, inalterados (NFR-0006). Um replay
gravado com o comando de drift continua legível e reproduzível; o comando não tem efeito na reprodução
(RULE-0001, RULE-0003). Um replay nunca referencia a pista de teste.

## 4. Saída dos ensaios — registro de API-0003 4.0.1 **(muda)**

Uma linha JSON por registro (`JSON.stringify`), um registro por `benchId` e por variante (`inputMode`, lado do
esterço, velocidade de partida, sequência) e, para `DETERMINISM` e `REALISTA_UNCHANGED`, por
`benchEnvironment`. Os campos são exatamente os de API-0003 4.0.1, com os tipos e unidades de lá; os campos
por `benchId` estão na tabela de [DES-0004](../core/DES-0004-ensaios-de-dirigibilidade-e-saida.md). Campos
comuns a todo registro: `benchId`, `benchEnvironment` (`TEST_PAD` ou `SYNTHETIC_TRACK`), `setupId`,
`setupVersion`, `inputMode`, `verdict`, `failReason?` (`THRESHOLD_EXCEEDED`, `BASELINE_MISSING`, `OFF_ASPHALT`,
`NON_DETERMINISTIC`, `CONTRACT_CHANGED`, `SPEED_NOT_HELD`, `MEASUREMENT_MISSING`, `TEST_AREA_EXCEEDED`),
`measuredAtUtc`, `baselineAvailable`; e, em todo registro com `TEST_PAD`, `testAreaRadiusM`,
`offAsphaltStepCount` e, com saída, `offAsphaltFirstStep`, `offAsphaltFirstXM`, `offAsphaltFirstZM`. Retirados
(nunca emitidos): os `benchId` `REFERENCE_CORNER`, `UNDERSTEER_ONSET`, `DRIFT_MANEUVER` e os campos
`throttleCondition`, `arcRadiusM`, `laneWidthM`, `maxUndersteerMs`, `v0Mps`, `v1Mps`, `entrySpeedStepMps`,
`maxUndersteerMsBySpeed`, `driftScorePoints`, `excludedRecoveryStepCount` (API-0003 4.0.0, Compatibilidade).
Os parâmetros de ensaio que API-0003 não lista como campo saem numa linha separada, prefixada por `#` e
também JSON, e vão para `parameters` da entrada de `docs/physics.md`
([ADR-0004](../adr/ADR-0004-ensaios-como-biblioteca-e-parametros-de-ensaio.md)). Em `npm test` cada registro
é impresso como diagnóstico do teste.

## 5. Linha de base — bloco em `docs/physics.md` **(muda)**

Um único bloco cercado ` ```json handling-baseline ` dentro de `docs/physics.md`, ao lado da entrada datada
em prosa que NFR-0004 exige (os dois registram o mesmo dado; a prosa é para pessoas, o bloco para o ensaio).

| Campo | Tipo | Unidade | Nulo | Restrições |
|---|---|---|---|---|
| `entries` | lista de entradas | — | não | pode ser vazia; **uma entrada por (`setupId`, `setupVersion`, `runtimeId`)** — `readBaseline` toma a primeira igual, e duas entradas iguais tornariam a escolha arbitrária |
| `entries[].setupId` | enum | — | não | |
| `entries[].setupVersion` | texto | — | não | a versão medida |
| `entries[].measuredAtUtc` | texto ISO 8601 UTC | — | não | data da medição; nunca entra em medição |
| `entries[].runtimeId` | texto | — | sim | presente quando a entrada traz `STEP_COST`; forma em [ADR-0003](../adr/ADR-0003-linha-de-base-legivel-por-maquina-em-docs-physics.md), sem nome de máquina nem de usuário |
| `entries[].parameters` | objeto (`BENCH_PARAMETERS` da execução, mais `runtimeId`) | unidades no nome de cada campo | sim | os parâmetros de ensaio com que a entrada foi medida (NFR-0004) |
| `entries[].records` | lista de registros de API-0003 | — | não | os mesmos campos da seção 4, cada um com `benchEnvironment`, `verdict` e `failReason` como a execução que produziu a entrada os julgou |

Resolução (RULE-0002, Linha de base): o veredito só depende de linha de base em `STEP_COST` — o
`meanStepCostUs` do registro `STEP_COST` (mesmo `inputMode`) da entrada com a `previousSetupVersion` do acerto
ensaiado e o mesmo `runtimeId` da execução — e na identidade do Realista (`REALISTA_UNCHANGED`, a entrada
`REALISTA_ALUGUEL_4T`/`realista-aluguel-4t-v4`, registro a registro por ambiente). `baselineLapTimeMs` de
`TEST_PILOT_LAP` e `baselineAvailable` dos demais registros vêm da entrada da `previousSetupVersion`
(mesmo `benchId`, `benchEnvironment`, `inputMode` e variante), sem entrar no veredito. Entrada ou registro
igual ausente é `baselineAvailable` falso e, onde a linha de base decide, `FAIL` com `BASELINE_MISSING`. Uma
entrada medida com os ensaios de versões anteriores deste projeto não tem registros dos `benchId` novos e não
serve de linha de base para eles; nunca é convertida nem extrapolada.

Entradas esperadas no bloco depois da entrega: `arcade-assistido-v4` (`--previous`) e
`realista-aluguel-4t-v4` (`--realista`), medidas de novo com os ensaios desta versão e **substituindo** no
bloco as entradas de 2026-10-22 com a mesma chave; `arcade-assistido-v6`, acrescentada; `arcade-assistido-v5`,
mantida como registro da rodada substituída (nenhum ensaio a lê). A prosa datada de 2026-10-22 e de
2026-10-27 fica, como histórico, e a entrada nova em prosa (`## Dirigibilidade — Arcade assistido v6`) diz a
data, a `setupVersion`, os parâmetros do acerto e de ensaio e os resultados ao lado da linha de base, com os
limites em vigor (REQ-FEAT-0006-08, F-Spec FEAT-0006 2.2.0).

## Plano de migração

Não há revisão de esquema de banco. As mudanças são de leitor versionado e de dado literal (D-DS-02):

| Passo | O que faz | Reversão (downgrade) |
|---|---|---|
| M1 | Declara `PUBLISHED_SETUPS` com a versão nova e a anterior (rodada de código 1) | remover a declaração; `ARCADE_KART` e `RENTAL_KART` intactos |
| M2 | Introduz `LapRecord` e `ReplayRecord` versão 1, com `setupId` e `setupVersion` opcionais na leitura (rodada de código 1) | remover os leitores; nada persistido |
| M3 | Acrescenta o bloco `handling-baseline` a `docs/physics.md` (rodada de código 2) | apagar o bloco; a prosa permanece |
| M4 | `setupId?`/`setupVersion?` em `src/lap.ts`, copiados do pedido; `buildLapRecord` preenche só o que falta (rodada de código 3) | remover os campos e as cópias; nada persistido |
| M5 **(novo)** | Acrescenta o literal `ARCADE_ASSISTIDO_V6` e passa `PUBLISHED_SETUPS.ARCADE_ASSISTIDO` a `arcade-assistido-v6` (`previousSetupVersion` e `previousConfig` inalterados) | voltar `PUBLISHED_SETUPS.ARCADE_ASSISTIDO` a `arcade-assistido-v5`/`ARCADE_ASSISTIDO_V5` e remover o literal novo; nenhum registro persistido carrega a versão |
| M6 **(novo)** | Substitui no bloco as entradas `arcade-assistido-v4` e `realista-aluguel-4t-v4` pela medição com os ensaios desta versão e acrescenta `arcade-assistido-v6`, com a prosa datada | restaurar o bloco anterior pelo controle de versão do repositório; a prosa de 2026-10-22 e de 2026-10-27 nunca é apagada |

Cada passo é executável como um commit e revertível como o seu `git revert`.

## Backfill

Nenhum: não há registro persistido a preencher. Um registro antigo (sem `setupVersion`) é resolvido na
leitura, a cada leitura, sem ser reescrito (idempotente por construção).

## Janela de compatibilidade

Código antigo e novo coexistem sem janela de dado: os campos de acerto são opcionais na leitura, a forma
anterior do replay é lida sem erro para sempre, e um replay de formato maior que 1 é `UNSUPPORTED_FORMAT`
intacto (I4). Um registro da rodada `arcade-assistido-v5` é lido com a sua versão declarada e é não
comparável com a corrente. Como nada é persistido, não há dado antigo em navegador algum a migrar; a
compatibilidade é provada com fixtures (`tests/fixtures/records.ts`). A troca das entradas da linha de base é
atômica no commit que as mede: nenhum leitor vê um bloco com duas entradas da mesma chave.

## Retenção e privacidade

| Dado | Onde vive | Por quanto tempo | O que nunca contém |
|---|---|---|---|
| `PUBLISHED_SETUPS` e os literais de versão | código empacotado | a vida do build | nada além de parâmetros físicos e identificadores de versão |
| `LapRecord`, `ReplayRecord` | memória da página (`main.ts`), fixtures de teste | até recarregar a página | nome, apelido, aparelho, data, relógio, posição geográfica |
| saída dos ensaios | stdout do desenvolvedor; `docs/physics.md` (prosa e bloco) | o repositório | nome de máquina, usuário, caminho de arquivo |
| texto compartilhado | passado à Web Share API ou à área de transferência pelo gesto do Jogador | não retido pela aplicação | versão do acerto; comparação entre versões; conteúdo de drift ou turbo; dado pessoal |
