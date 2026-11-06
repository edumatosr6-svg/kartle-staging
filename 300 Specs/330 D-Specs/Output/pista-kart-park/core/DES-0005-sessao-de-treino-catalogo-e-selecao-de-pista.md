---
id: DES-0005
title: Sessão de treino, catálogo do treino e seleção de pista
feature: pista-kart-park
stage: dspec
status: validated
version: 2.0.0
sources: [API-0002, RULE-0003, FLOW-0001, FEAT-0001, FEAT-0006, REQ-FEAT-0001-01, REQ-FEAT-0001-02, REQ-FEAT-0001-03, REQ-FEAT-0001-04, REQ-FEAT-0001-05, REQ-FEAT-0001-06, REQ-FEAT-0001-07, REQ-FEAT-0001-08, REQ-FEAT-0001-09, REQ-FEAT-0001-10, REQ-FEAT-0001-11, REQ-FEAT-0001-12, REQ-FEAT-0001-14, REQ-FEAT-0001-15, REQ-FEAT-0001-16, REQ-FEAT-0006-07, REQ-FEAT-0006-08, REQ-FEAT-0006-09, REQ-FEAT-0006-10, REQ-FEAT-0006-11]
---

# DES-0005 — Sessão de treino, catálogo do treino e seleção de pista

## Realiza

O contrato API-0002 e o modelo de estados de RULE-0003: o catálogo fixo com as duas pistas
(REQ-FEAT-0001-01), a Kart Park como pista da abertura, sem ler nem gravar escolha anterior
(REQ-FEAT-0001-02, -03, -04); a troca de pista encerra a sessão, descarta a volta não encerrada e abre uma
sessão nova com o kart na largada e sem volta (REQ-FEAT-0001-05, -08, -09, -10); a volta de uma sessão é
sempre `TRAINING`, sem `challengeNumber`, com o `trackId` e o `trackVersion` da sessão (REQ-FEAT-0001-06,
-07, -11), sem registro de desafio diário (REQ-FEAT-0001-12) — e, pelo F-Spec revalidado de
`race-lap-validation` (FEAT-0010, ADR-0006 daquela feature), cada `startTrainingLap` inicia um **treino de voltas
seguidas**: uma `LapSession` `TRAINING` cujas voltas terminam a cada cruzamento da chegada no sentido da pista,
cada uma com um item em `listLapResults`, e que só chega a `ENDED` por `endTraining`; dado ilegível ou de esquema desconhecido deixa
a sessão `FAILED`, com as duas opções selecionáveis (REQ-FEAT-0001-14). Revisão 3 do seed: a entrada `kart-park`
declara o `trackVersion` que carrega (2), e a seleção só abre sessão `READY` com um arquivo que declara o `trackId`
pedido e esse `trackVersion`, de modo que a sessão e toda volta dela têm `trackVersion` 2 (REQ-FEAT-0001-15);
um arquivo legível de outra pista ou de outra versão — o da versão 1, por exemplo — termina `FAILED` com
`TRACK_VERSION_MISMATCH`, e nenhuma opção abre sessão com a versão 1 (REQ-FEAT-0001-16). E as entradas do catálogo que
FEAT-0006 lê (API-0002): a indicação `osmCredit`, verdadeira só na Kart Park (REQ-FEAT-0006-10), o nome e o
comprimento exibido da Kart Park, literais iguais nos dois idiomas (REQ-FEAT-0006-07, -08, -11), e nenhum
campo de recorde (REQ-FEAT-0006-09). Os textos do crédito, a regra "crédito só para entrada com `osmCredit`"
e a formatação do rótulo da opção são regra de tela e ficam na aplicação, em `src/lapMessages.ts`
([DES-0007](../web/DES-0007-tela-inicial-seletor-credito-e-resultado.md)).

## Posicionamento

`src/trainingSession.ts`, camada **simulação**, **novo**. Motivo de ser novo: RULE-0003 põe a sessão na
simulação, que a muda só por `selectTrainingTrack`; `src/lap.ts` é o modelo da volta de `race-lap-validation`,
que não muda, e `src/main.ts` não carrega em `npm test`. O catálogo fica com a sessão porque
`getTrainingTrackOptions` o devolve e a indicação de crédito tem de valer mesmo com o arquivo ilegível (vem do
catálogo, não do arquivo). O módulo guarda só a sessão e as entradas do catálogo de API-0002 (`trackId`,
`trackVersion`, `displayName`, `displayLengthM`, `osmCredit`): nenhum texto de crédito, nenhuma regra de exibição e nenhuma
formatação de rótulo. A conferência do arquivo com a entrada também fica aqui, porque é a transição
`LOADING` → `READY` de RULE-0003, que a simulação decide. Não importa `three`, o DOM, `src/audio.ts` nem `src/main.ts`; o texto do arquivo da Kart
Park chega como argumento (`sources`), empacotado pela aplicação ([DES-0007](../web/DES-0007-tela-inicial-seletor-credito-e-resultado.md)).

## Interface

| Símbolo | Assinatura | Descrição |
|---|---|---|
| `TrainingTrackId` | `'kart-park' \| 'synthetic'` | |
| `TrainingTrackOption` | `{trackId: TrainingTrackId; trackVersion?: number; displayName: string; displayLengthM?: number; osmCredit: boolean}` | entrada do catálogo, campo a campo de API-0002 (`displayLengthM` em metros); `trackVersion` opcional, inteiro, ausente por padrão (neutro: a seleção não confere versão) |
| `TRAINING_TRACKS` | `readonly TrainingTrackOption[]`, congelado | `{trackId: 'kart-park', trackVersion: 2, displayName: 'Kart Park — São José dos Pinhais (réplica não oficial)', displayLengthM: 691, osmCredit: true}` e `{trackId: 'synthetic', displayName: 'Pista sintética', osmCredit: false}` (sem `trackVersion`: lê o único arquivo da pista sintética, como antes); sem campo de recorde; nenhuma entrada declara o `trackVersion` 1 da Kart Park (`src/trainingSession.ts:12-15` hoje: sem `trackVersion`, nome "traçado aproximado", 687) |
| `OPENING_TRACK_ID` | `'kart-park'` | a pista da abertura, sempre |
| `SessionState` | `'NO_SESSION' \| 'LOADING' \| 'READY' \| 'FAILED'` | |
| `TrainingSession` | `{sessionState; selectedTrackId; reading?: TrackReading; environment?: Environment; startKart?: State}` | estado de [DM-0002](../data/DM-0002-registro-de-publicacao-e-estado-em-memoria.md), imutável |
| `TrainingTrackSources` | `Readonly<Record<TrainingTrackId, TrackDataSource>>` | o dado de cada pista: texto do arquivo publicado da Kart Park versão 2 (`src/tracks/kart-park-v2.json`) e `SYNTHETIC_TRACK_FILE`; a aplicação empacota só esses dois ([DES-0007](../web/DES-0007-tela-inicial-seletor-credito-e-resultado.md)) |
| `initialTrainingSession()` | `() => TrainingSession` | `{sessionState: 'NO_SESSION', selectedTrackId: OPENING_TRACK_ID}` |
| `getTrainingTrackOptions(session)` | `(TrainingSession) => {options; selectedTrackId; sessionState; trackDataStatus?}` | `options` são sempre as duas entradas; `trackDataStatus` só com `READY` ou `FAILED` (API-0002) |
| `selectTrainingTrack(session, lap, trackId, sources)` | `(TrainingSession, LapSession \| undefined, string, TrainingTrackSources) => SelectTrainingTrackResult` | abaixo |
| `startTrainingLap(session, lap, config, setup?)` | `(TrainingSession, LapSession \| undefined, KartConfig, SetupRef?) => LapCommandResult<StartLapRejection>` | com sessão `READY`: `startLap(lap, {lapKind: 'TRAINING', trackId: reading.trackId, trackVersion: reading.trackVersion, setupId: setup?.setupId, setupVersion: setup?.setupVersion}, reading, config, environment)`, nunca com `challengeNumber`; `setup` (`SetupRef` de `src/physics.ts`, `{setupId, setupVersion}` de `dirigibilidade`) é **copiado ao pedido sem interpretação** — os dois campos só entram quando `setup` é dado, nunca derivados nem preenchidos com padrão — para que `LapResult.setupId`/`setupVersion` (API-0001 1.1.0 de `race-lap-validation`, FB-01 de `dirigibilidade`) e `compareLapRecords` (RULE-0003 de `dirigibilidade`) sigam valendo na volta de treino, como `src/main.ts` já fazia antes desta feature; sem leitura, `{ok: false, code: 'TRACK_DATA_UNREADABLE'}`. A sessão devolvida é o **treino inteiro**: as voltas seguintes começam dentro de `stepLap`, sem nova chamada a `startTrainingLap` (que, com o treino em `COUNTDOWN`, `RUNNING` ou `PAUSED`, recebe a rejeição `LAP_ALREADY_ACTIVE` de `startLap`, sem mudança); todo resultado do treino carrega o mesmo `trackId`, `trackVersion`, `setupId` e `setupVersion` (INV-4 de `race-lap-validation`) |
| `trainingIdleKart(session)` | `(TrainingSession) => State \| undefined` | `startKart` da sessão `READY`; `undefined` sem sessão pronta |

`SelectTrainingTrackResult`, campo a campo de API-0002:

| Caso | Valor |
|---|---|
| `trackId` fora do catálogo | `{ok: false, code: 'UNKNOWN_TRACK', session, lap}` com a sessão e a volta recebidas, inalteradas |
| sessão `READY` com o mesmo `trackId` | `{ok: true, session, lap, response: {sessionState: 'READY', trackId, trackVersion, trackDataStatus}}` com a sessão e a volta recebidas, inalteradas (idempotência) |
| outra pista, ou sem sessão `READY`, dado `COMPLETE` ou `INCOMPLETE` com `trackId` igual ao pedido e, se a entrada declara `trackVersion`, `trackVersion` igual ao dela (`===`) | `{ok: true, session: nova READY, lap: undefined, response: {sessionState: 'READY', trackId, trackVersion, trackDataStatus}}` |
| dado `UNREADABLE` | `{ok: false, code: 'TRACK_DATA_UNREADABLE', session: nova FAILED, lap: undefined, response: {sessionState: 'FAILED', trackId, trackDataStatus: 'UNREADABLE'}}` |
| dado `UNSUPPORTED_SCHEMA` | `{ok: false, code: 'TRACK_SCHEMA_UNSUPPORTED', session: nova FAILED, lap: undefined, response: {sessionState: 'FAILED', trackId, trackDataStatus: 'UNSUPPORTED_SCHEMA'}}` |
| dado `COMPLETE` ou `INCOMPLETE` com `trackId` diferente do pedido, ou com `trackVersion` diferente do declarado pela entrada | `{ok: false, code: 'TRACK_VERSION_MISMATCH', session: nova FAILED (com a leitura), lap: undefined, response: {sessionState: 'FAILED', trackId: <o pedido>, trackDataStatus: <o do arquivo lido>}}`; hoje (`src/trainingSession.ts:67-69`) o `trackId` diferente dá `TRACK_DATA_UNREADABLE` e o `trackVersion` não é conferido |

A ordem da classificação é a da tabela: `UNKNOWN_TRACK`, mesma pista `READY`, `UNSUPPORTED_SCHEMA`,
`UNREADABLE`, conferência de `trackId` e `trackVersion`, `READY`. Um arquivo de esquema desconhecido continua
`TRACK_SCHEMA_UNSUPPORTED` mesmo que declare outra versão: o leitor nem chega a julgar os seus campos. O tipo
`SelectTrainingTrackResult` ganha o código `TRACK_VERSION_MISMATCH` no ramo de falha com `response`, e
`SelectTrainingTrackResponse` com `FAILED` passa a aceitar `trackDataStatus` `COMPLETE` e `INCOMPLETE`
(acréscimos; nenhum código ou campo existente muda).

A sessão nova `READY` guarda `reading`, `environment` (`trackEnvironment(buildTrackGeometry(...))` numa leitura
de versão 3, `CIRCUIT` numa de versão 2) e `startKart = kartAtStart(reading.startPosition)`. Em todo caso que
não é `UNKNOWN_TRACK` nem a mesma pista `READY`, `selectedTrackId` passa ao pedido e o treino recebido, em
qualquer fase, deixa de existir: é o treino da sessão encerrada, nunca continua na pista nova, e a volta que
estava em andamento nele nunca produz resultado (REQ-FEAT-0001-10). As voltas desse treino já concluídas na
chegada já tiveram cada uma o seu resultado produzido e exibido no painel do resultado da volta do treino
([DES-0007](../web/DES-0007-tela-inicial-seletor-credito-e-resultado.md)); a troca não lhes acrescenta nem lhes
muda nada, e nada delas é gravado como desafio diário. `LOADING` existe no modelo e
dura a chamada: como o dado vem empacotado, a leitura é síncrona e um pedido nunca encontra outro em
`LOADING`; a ordem dos pedidos é a ordem das chamadas e vale o último (API-0002, idempotência).

```mermaid
stateDiagram-v2
    [*] --> NO_SESSION: initialTrainingSession
    NO_SESSION --> LOADING: selectTrainingTrack kart-park na carga do modulo
    LOADING --> READY: COMPLETE ou INCOMPLETE com o trackId pedido e o trackVersion da entrada
    LOADING --> FAILED: UNREADABLE, UNSUPPORTED_SCHEMA, ou trackId ou trackVersion diferente da entrada
    READY --> LOADING: selectTrainingTrack de outra pista
    FAILED --> LOADING: selectTrainingTrack de qualquer pista do catalogo
    READY --> READY: selectTrainingTrack da mesma pista, sem efeito
```

## Colaboradores

Chama `readTrackData` (`src/trackData.ts`), `buildTrackGeometry` (`src/trackGeometry.ts`),
`trackEnvironment`, `CIRCUIT` e o tipo `SetupRef` (`src/physics.ts`), `startLap`, `kartAtStart` (`src/lap.ts`);
a referência do acerto vem da aplicação ([DES-0007](../web/DES-0007-tela-inicial-seletor-credito-e-resultado.md)),
que a guarda como hoje, e esta sessão não a interpreta nem a guarda. É chamado pela
aplicação ([DES-0007](../web/DES-0007-tela-inicial-seletor-credito-e-resultado.md)), pelo programa do preparo
offline, que lê só `TRAINING_TRACKS` para validar o argumento `<trackId>`
([DES-0010](../pipeline/DES-0010-preparo-offline-do-arquivo-da-kart-park.md)), e pelos testes.

## Estado e concorrência

Funções puras sobre `TrainingSession` imutável; a aplicação guarda o valor devolvido. Nenhuma transição
grava no navegador (REQ-FEAT-0001-03): nem a escolha, nem a sessão, nem registro de desafio diário. Nenhuma
transição tem contador de sequência exposto: os pedidos são locais e ordenados pela ordem das chamadas
(RULE-0003). Repetir uma seleção leva ao mesmo estado final (kart na largada, sem volta). O treino de uma
sessão tem os contadores de `race-lap-validation` (`stepCount`, que não recomeça a cada volta, e
`lapSequenceCount`); a sessão de treino desta feature não os lê nem os guarda.

## Comportamento em falha

Dado ilegível, de esquema desconhecido ou de outra pista ou versão: sessão `FAILED`, nenhuma volta pode começar
(`startTrainingLap` só inicia com sessão `READY` e devolve `TRACK_DATA_UNREADABLE` sem ela, como hoje), o arquivo
fica intacto (só é lido). A aplicação registra só os identificadores (`console.warn('track-data',
'TRACK_VERSION_MISMATCH', trackId, trackVersion)` com os valores do arquivo lido; [DES-0007](../web/DES-0007-tela-inicial-seletor-credito-e-resultado.md)). `trackId` fora do
catálogo: nada muda. A perda do sensor em `web-mobile` não passa por aqui: não muda `sessionState` nem
`selectedTrackId` (RULE-0003). Sem rede, sem tempo-limite, sem escrita.

## Determinismo (D-DS-07)

Puro, sem relógio nem sorteio; a geometria e o ambiente são construídos do arquivo em ordem fixa. Provas em
`tests/pista-kart-park-session.test.ts`: o catálogo tem exatamente as duas entradas de API-0002 e nenhum
campo de recorde; a abertura (`initialTrainingSession` e `selectTrainingTrack` com `OPENING_TRACK_ID`) dá
`READY` com `selectedTrackId` `kart-park` e o kart na `startPosition` do arquivo; trocar para `synthetic` com
um treino em `COUNTDOWN`, em `RUNNING` (antes e depois de uma volta concluída) e em `PAUSED` devolve `lap`
`undefined`, `getLapState` `NO_ACTIVE_LAP` e o kart na largada sintética, e a lista de resultados do treino
descartado (o valor recebido, imutável) continua com os itens das voltas já concluídas, sem item para a volta
que estava em andamento; escolher a mesma pista `READY` devolve a mesma sessão e o mesmo treino; um treino
iniciado por `startTrainingLap` tem `lapKind` `TRAINING`, sem `challengeNumber`, e `trackId` `kart-park` ou
`synthetic` conforme a sessão, e cada item de `listLapResults` dele — de volta válida, de volta inválida por
corte (cujo resultado sai no cruzamento seguinte da chegada) e de volta inválida por marcador pulado — tem
`lapKind` `TRAINING`, nenhum `challengeNumber` e `official` falso, enquanto `endTraining` leva a `ENDED` sem
acrescentar item; com `setup` dado, a volta carrega `setupId` e `setupVersion` iguais aos do
argumento (e o `LapResult` os devolve), e sem `setup` os dois ficam ausentes do pedido; com o texto da Kart Park corrompido, a seleção dá `FAILED`, `startTrainingLap`
rejeita e uma nova seleção da pista sintética dá `READY`; a abertura, a seleção da Kart Park pelo seletor e a
volta iniciada nela têm `trackVersion` 2 na resposta, na leitura da sessão e em `getLapState` (REQ-FEAT-0001-15);
com as fontes da sessão apontando a entrada `kart-park` para o texto do arquivo publicado da versão 1
(`src/tracks/kart-park-v1.json`), a seleção dá `FAILED` com `TRACK_VERSION_MISMATCH`, `trackDataStatus`
`COMPLETE`, `startTrainingLap` rejeita e `getLapState` dá `NO_ACTIVE_LAP`; com a entrada `kart-park` apontando
para o texto da pista sintética, o mesmo código; nenhuma entrada de `TRAINING_TRACKS` tem `trackVersion` 1
(REQ-FEAT-0001-16); a entrada `kart-park` tem `trackVersion` 2, `displayName`
`Kart Park — São José dos Pinhais (réplica não oficial)`, `displayLengthM` 691 e `osmCredit` verdadeiro, e a
entrada `synthetic` tem `displayName` `Pista sintética`, nenhum `trackVersion`, nenhum `displayLengthM` e
`osmCredit` falso; o `osmCredit` de cada entrada é igual ao `osmDerived` do arquivo da pista (ausente vale
`false`), e o `trackVersion` da entrada `kart-park` é o maior `trackVersion` da Kart Park no registro de
publicação ([DES-0011](../pipeline/DES-0011-verificacoes-registro-de-publicacao-e-promocao.md)). O crédito e o
rótulo construídos dessas entradas são provados com `src/lapMessages.ts`
([DES-0007](../web/DES-0007-tela-inicial-seletor-credito-e-resultado.md)).

## Feature flag

Nenhuma: a pista da abertura, as duas opções e a versão 2 da Kart Park são fixas no catálogo, e nenhuma
configuração existe para escolher outra pista de abertura, escolher a versão 1, forçar uma volta oficial ou
injetar uma sessão (FEAT-0001, Configuração; o campo `trackVersion` da entrada é dado fixo do catálogo, não
chave; sem ele, a seleção se comporta como antes desta revisão;
[ADR-0005](../adr/ADR-0005-kart-park-sem-chave-e-producao-bloqueada.md)).

## Pontos em aberto

Nenhum.
