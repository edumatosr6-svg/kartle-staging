---
id: DES-0005
title: Sessão de treino, catálogo do treino e seleção de pista — implementação
feature: pista-kart-park
stage: code
status: draft
version: 1.0.0
sources: [API-0002, RULE-0003, FLOW-0001, FEAT-0001, FEAT-0006, REQ-FEAT-0001-01, REQ-FEAT-0001-02, REQ-FEAT-0001-03, REQ-FEAT-0001-04, REQ-FEAT-0001-05, REQ-FEAT-0001-06, REQ-FEAT-0001-07, REQ-FEAT-0001-08, REQ-FEAT-0001-09, REQ-FEAT-0001-10, REQ-FEAT-0001-11, REQ-FEAT-0001-12, REQ-FEAT-0001-14, REQ-FEAT-0006-07, REQ-FEAT-0006-08, REQ-FEAT-0006-09, REQ-FEAT-0006-10, REQ-FEAT-0006-11]
---

# DES-0005 — Sessão de treino, catálogo e seleção de pista — implementação

`src/trainingSession.ts`, camada simulação, novo (94 linhas). Importa `src/physics.ts` (`CIRCUIT`, `trackEnvironment`, tipos),
`src/lap.ts` (`kartAtStart`, `startLap`), `src/trackData.ts` (`readTrackData`, tipos) e `src/trackGeometry.ts`
(`buildTrackGeometry`). Não contém `openstreetmap`, `ODbL` nem `' · '`; nenhum texto de crédito, nenhuma regra de tela.

## Realização por requisito

| Requisito | Arquivo e símbolo |
|---|---|
| API-0002; REQ-FEAT-0001-01 | `TRAINING_TRACKS` (`:12-15`, congelado, duas entradas, sem campo de recorde), `getTrainingTrackOptions` (`:45-53`: sempre as duas entradas; `trackDataStatus` só com `READY` ou `FAILED`) |
| REQ-FEAT-0001-02, -04 | `OPENING_TRACK_ID = 'kart-park'` (`:16`); `initialTrainingSession` (`:40-42`); `src/main.ts:645` seleciona a abertura na carga sem ler escolha anterior |
| REQ-FEAT-0001-03, -12 | nenhuma transição grava nada; nenhum `localStorage`/`sessionStorage`/IndexedDB/cookie; nenhum registro de desafio |
| REQ-FEAT-0001-05, -09, -10 | `selectTrainingTrack` (`:55-79`): outra pista, ou sem sessão `READY`, devolve sessão nova e `lap: undefined` (a volta recebida em qualquer fase deixa de existir); `UNKNOWN_TRACK` deixa tudo como está (`:56`); a mesma pista `READY` devolve a sessão e a volta recebidas (`:57-61`, idempotência) |
| REQ-FEAT-0001-08 | `startKart = kartAtStart(reading.startPosition)` (`:75`); `trainingIdleKart` (`:92-94`) |
| REQ-FEAT-0001-06, -07, -11 | `startTrainingLap` (`:81-90`): sempre `lapKind: 'TRAINING'`, nunca `challengeNumber`, `trackId`/`trackVersion` da leitura da sessão, ambiente da sessão; `setup` opcional copiado sem interpretação (decisão registrada em `01-implementation.md`) |
| REQ-FEAT-0001-14 | `UNSUPPORTED_SCHEMA` → sessão `FAILED` com `TRACK_SCHEMA_UNSUPPORTED` (`:63-66`); `UNREADABLE` ou `trackId` diferente → `FAILED` com `TRACK_DATA_UNREADABLE` (`:67-70`); `startTrainingLap` rejeita sem leitura (`:84-86`); as duas opções continuam selecionáveis (`getTrainingTrackOptions`) |
| RULE-0003; FLOW-0001 | `SessionState` (`:18`), `TrainingSession` imutável (`:19-25`); `LOADING` dura a chamada (leitura síncrona do dado empacotado); ambiente `trackEnvironment(buildTrackGeometry(...))` numa leitura com `centerline`, `CIRCUIT` numa de versão 2 (`:72-74`) |
| REQ-FEAT-0006-07, -08, -10, -11; FEAT-0006 | entrada `kart-park`: `displayName` `Kart Park — São José dos Pinhais (traçado aproximado)`, `displayLengthM` 687, `osmCredit` `true`; entrada `synthetic`: `Pista sintética`, sem comprimento, `osmCredit` `false` (`:13-14`); literais iguais nos dois idiomas |
| REQ-FEAT-0006-09; FEAT-0001 | nenhum campo de recorde em `TrainingTrackOption` (`:10`); nenhuma chave de configuração |
