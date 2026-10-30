---
id: DES-0003
title: Versão do acerto, registros de volta e replay e comparabilidade (API-0002)
feature: dirigibilidade
stage: dspec
status: validated
version: 2.1.1
sources: [API-0002, RULE-0003, FLOW-0003, FEAT-0005, FEAT-0006, REQ-FEAT-0005-01, REQ-FEAT-0005-05, REQ-FEAT-0005-06, REQ-FEAT-0005-08, REQ-FEAT-0005-09, REQ-FEAT-0005-10, REQ-FEAT-0005-13, REQ-FEAT-0006-03]
---

# DES-0003 — Versão do acerto, registros de volta e replay e comparabilidade (API-0002)

## Realiza

O contrato API-0002 1.2.0 campo a campo: `getSetupVersion`, `readReplay` e `compareLapRecords`; a versão
nova (`arcade-assistido-v6`) distinguível da anterior pela leitura do campo (AC-US-0005-04); a
comparabilidade decidida aqui, antes de qualquer exibição na tela (AC-US-0005-05) ou no texto compartilhado
(AC-US-0005-07), que só recebem o resultado; registros anteriores à feature lidos sem erro com
`RESOLVED_FROM_ABSENCE` (NFR-0009); replay de outra versão reproduzido passo a passo com o acerto corrente e
tratado como não comparável (REQ-FEAT-0005-10; AC-US-0005-06), com um comando de drift gravado sem efeito; o
mesmo replay dá o mesmo tempo (AC-US-0005-01). O registro de volta sobre o `LapResult` de
`race-lap-validation`, cujos API-0001 1.2.0 e API-0002 1.2.1 (os campos vêm da 1.1.0) carregam `setupId?` e
`setupVersion?` copiados do
pedido `startLap`. Regra: RULE-0003. Formatos: [DM-0001](../data/DM-0001-dado-publicado-registros-e-linha-de-base.md).
Decisão: [ADR-0002](../adr/ADR-0002-formato-do-replay-e-registro-de-volta-em-memoria.md).

## Posicionamento

Módulo `src/setupRecords.ts`, camada **Simulação**, **existente** (129 linhas; as-built das rodadas de código
1 a 3) e **alterado** nesta rodada num ponto, o fim da reprodução em `replayLap` **(muda)**; a versão nova
chega pelo dado publicado (`PUBLISHED_SETUPS`, [DES-0001](DES-0001-acerto-arcade-assistido-v6-e-assistencias.md)),
que este módulo só lê. Motivo de ser
módulo próprio: reproduzir um replay exige `startLap`/`stepLap` de `src/lap.ts`, e `src/physics.ts` não pode
importar a volta. Importa `src/physics.ts` (`PUBLISHED_SETUPS`, tipos), `src/lap.ts`, `src/lapTiming.ts`
(`COUNTDOWN_STEPS`) e tipos de `src/trackData.ts`.

`src/lap.ts` (camada Simulação, módulo de `race-lap-validation`) já tem `setupId?` e `setupVersion?` em
`LapRequest` (`:24`), `LapSession` (`:31-32`) e `LapResult` (`:55-56`), copiados do pedido sem interpretação e
ausentes quando o pedido não os traz (FB-01 aceito por aquela feature; implementado pela rodada de código 3
desta). Esta rodada não o toca.

## Interface

| Função | Entradas | Saída | Rejeições |
|---|---|---|---|
| `getSetupVersion(setupId)` (`:39`) | `setupId: unknown` | `{setupId, setupVersion, previousSetupVersion?}` copiados de `PUBLISHED_SETUPS` — para o Arcade, `arcade-assistido-v6` e `arcade-assistido-v4` | `{code: 'UNKNOWN_SETUP'}` para valor fora do enum |
| `resolveSetupRef(partial)` (`:46`) | `{setupId?: unknown, setupVersion?: unknown}` | `{setupId, setupVersion, setupVersionSource}`: `setupId` ausente ou inválido → `ARCADE_ASSISTIDO`; `setupVersion` texto não vazio → `DECLARED` (inclusive `arcade-assistido-v5`, a rodada substituída); ausente → `previousSetupVersion` do `setupId` (ou a `setupVersion` corrente se não há anterior), `RESOLVED_FROM_ABSENCE` | nenhuma |
| `readReplay(source)` (`:54`) | `source: unknown` (objeto, texto JSON de no máximo `MAX_REPLAY_TEXT_CHARS` caracteres, `null`, `undefined`); `inputs` com no máximo `MAX_REPLAY_INPUT_STEPS` elementos | `{replayStatus: 'READABLE', trackId, trackVersion, setupId, setupVersion, setupVersionSource, inputStepCount}` | `{replayStatus: 'UNREADABLE'}` (inclusive acima do teto); `{replayStatus: 'UNSUPPORTED_FORMAT'}` |
| `MAX_REPLAY_TEXT_CHARS` (`:8`) | `4_194_304` caracteres | teto do texto aceito por `readReplay` | — |
| `MAX_REPLAY_INPUT_STEPS` (`:9`) | `36_000` passos (300 s a 120 Hz) | teto de `inputs.length`; limita o trabalho de `replayLap` | — |
| `compareLapRecords(a, b)` (`:79`) | dois registros com `trackId?`, `trackVersion?`, `setupId?`, `setupVersion?` | `{comparability}` pela tabela de RULE-0003, após `resolveSetupRef` em cada um | `{code: 'INCOMPLETE_RECORD'}` se `trackId` ou `trackVersion` ausente em um deles |
| `buildLapRecord(result, setup)` (`:92`) | `result: LapResult`, `setup: SetupRef` | `LapRecord = {...result, setupId: result.setupId ?? setup.setupId, setupVersion: result.setupVersion ?? setup.setupVersion}`: preenche só o que o resultado não traz; cópia idempotente quando o resultado já os traz | nenhuma |
| `buildReplayRecord(lap, inputs, setup)` (`:97`) | `lap: LapSession` encerrada, `inputs` por passo `RUNNING` (com `drift` quando o `Input` o trouxe), `setup: SetupRef` | `ReplayRecord` versão 1 (DM-0001, seção 3) | nenhuma |
| `replayLap(record, reading, setup, driverMassKg = 75)` (`:108`) | `record: ReplayRecord` legível, `reading: TrackReading`, `setup: PublishedSetup` corrente, `driverMassKg` (kg) | `{ok: true, record: LapRecord, comparability}`; o pedido de `startLap` leva `setup.setupId` e `setup.setupVersion`; **(muda)** a reprodução termina no primeiro passo em que `getLapResult` devolve um resultado — e não na chegada da fase a `ENDED` —, de modo que uma volta `TRAINING`, que pelo contrato 1.2.x de `race-lap-validation` produz o resultado na chegada com a fase em `RUNNING` e só chega a `ENDED` por `endTraining`, é reproduzida como a oficial e a de reconhecimento; o registro obtido é o desse primeiro resultado; cada `Input` gravado, inclusive o comando de drift, é entregue a `stepLap`, e a simulação ignora o comando ([DES-0001](DES-0001-acerto-arcade-assistido-v6-e-assistencias.md)) | `{ok: false, code}` de `startLap` ou `NO_RESULT` quando os `Input` acabam antes do fim |

Ordem das verificações de `readReplay`, para resposta determinística: (1) texto acima de
`MAX_REPLAY_TEXT_CHARS` → `UNREADABLE` antes de qualquer análise; senão `JSON.parse` em `try`; (2) não objeto,
`null` ou `undefined` → `UNREADABLE`; (3) `replayFormatVersion` presente e não inteiro ≥ 1 → `UNREADABLE`;
inteiro > 1 → `UNSUPPORTED_FORMAT`, sem ler mais nada e sem alterar o objeto; (4) `trackId` e `trackVersion`
válidos, senão `UNREADABLE`; (5) `inputs` lista não vazia com no máximo `MAX_REPLAY_INPUT_STEPS` elementos,
senão `UNREADABLE` antes de ler qualquer elemento; (6) cada elemento com `throttle`, `brake`, `steer`
numéricos finitos e `drift` ausente ou booleano, senão `UNREADABLE`; (7) `resolveSetupRef`. A função nunca
grava, apaga nem altera `source` (I4).

`compareLapRecords`: `trackId` e `trackVersion` por igualdade estrita; `setupId` e `setupVersion` depois de
`resolveSetupRef`; decisão na ordem `TRACK_DIFFERS` → `SETUP_DIFFERS` → `SETUP_VERSION_DIFFERS` →
`COMPARABLE`. Um tempo da rodada `arcade-assistido-v5` (staging) contra um de `arcade-assistido-v6` dá
`SETUP_VERSION_DIFFERS`, como um da versão anterior à feature.

`replayLap`: o tempo obtido é o da reprodução com o acerto corrente, nunca o gravado; um replay de
`arcade-assistido-v4` ou `arcade-assistido-v5` reproduzido dá `SETUP_VERSION_DIFFERS` entre o gravado e o
obtido, e nenhum chamador o apresenta como equivalente (REQ-FEAT-0005-10). O contrato de passo não mudou
(NFR-0006), por isso a sequência é aplicável.

## Colaboradores

Chama `PUBLISHED_SETUPS` (`src/physics.ts`), `startLap`, `stepLap`, `getLapResult` (`src/lap.ts`),
`COUNTDOWN_STEPS` (`src/lapTiming.ts`). É chamado por `src/main.ts` (resultado, melhor tempo), por
`src/handlingMessages.ts` (tipos), por `scripts/handlingBench.ts` (`SETUP_VERSION`) e pelos testes.

## Estado e concorrência

- Todas as operações são puras: nenhuma altera `PUBLISHED_SETUPS`, o registro lido ou a sessão.
- **Declaração de versão**: uma vez por entrega, como registro literal em `PUBLISHED_SETUPS`; redeclarar o
  mesmo identificador é o mesmo literal; a ordem entre versões é dada por `previousSetupVersion` e pelos
  literais mantidos em código, sem contador (RULE-0003). `tests/dirigibilidade-setup-version.test.ts` afirma
  que os identificadores são únicos e que `setupVersion ≠ previousSetupVersion` para o Arcade.
- **Gravação**: esta feature não grava registro algum. `buildLapRecord` produz um registro por volta
  encerrada, na memória da aplicação; chamá-lo duas vezes para o mesmo `LapResult` devolve registros iguais.
- **Pedido da volta**: `beginLap` (`src/main.ts`, [DES-0007](../web/DES-0007-integracao-da-aplicacao-e-adaptadores.md)),
  `replayLap`, a volta do piloto de teste e a volta cronometrada dos benches
  ([DES-0004](DES-0004-ensaios-de-dirigibilidade-e-saida.md)) informam `setupId` e `setupVersion` no pedido.
- Contador de sequência da reprodução: o `stepCount` da `LapSession`.

## Comportamento em falha

| Situação | Resultado | Registro (apenas identificadores) |
|---|---|---|
| registro ausente, corrompido, fora de forma ou acima do teto | `UNREADABLE`; nenhuma comparação; nada é descartado | `console.warn('replay', 'UNREADABLE')` na aplicação, quando ela o lê |
| `replayFormatVersion` > 1 | `UNSUPPORTED_FORMAT`; intacto | `console.warn('replay', 'UNSUPPORTED_FORMAT', replayFormatVersion)` |
| registro sem `trackId` ou `trackVersion` em `compareLapRecords` | `INCOMPLETE_RECORD`; nenhuma comparação exibida nem compartilhada | `console.warn('lap-record', 'INCOMPLETE_RECORD')` |
| `replayLap` com leitura de pista que não bate com o replay | rejeição de `startLap` | nenhum |
| `Input` esgotado antes do fim | `NO_RESULT` | nenhum |

Sem tempo-limite, nova tentativa nem rede. Nenhum conteúdo de registro é registrado em log.

## Observabilidade

`SETUP_VERSION` ([DES-0004](DES-0004-ensaios-de-dirigibilidade-e-saida.md)) reporta `declaredSetupVersion`,
`previousSetupVersion`, `oldRecordsReadCount` e `oldRecordsReadOkCount`; uma regressão de leitura aparece
como contagens diferentes (NFR-0009).

## Determinismo (D-DS-07)

Funções puras sem relógio nem sorteio; a reprodução usa `STEP` por `stepLap`. Provas:
`tests/dirigibilidade-setup-version.test.ts` reproduz o mesmo `ReplayRecord` duas vezes e afirma `deepEqual`
dos `LapRecord` obtidos e dos estados finais; afirma que reproduzir um replay gravado com
`arcade-assistido-v4` com o acerto corrente dá `SETUP_VERSION_DIFFERS`; e que o mesmo replay com `drift`
verdadeiro em todos os passos dá o mesmo `LapRecord` que sem ele.

## Feature flag

Nenhuma: a declaração de versão é dado publicado; não há configuração para escolher versão, ler ou não ler
registros antigos (FEAT-0005, Configuração).

## Pontos em aberto

Nenhum.
