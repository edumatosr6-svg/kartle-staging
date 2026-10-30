---
id: DM-0002
title: Estado e resultado da volta em memória
feature: race-lap-validation
stage: dspec
status: validated
version: 1.2.0
sources: [FEAT-0001, FEAT-0002, FEAT-0003, FEAT-0010, REQ-FEAT-0001-05, REQ-FEAT-0002-04, REQ-FEAT-0002-11, REQ-FEAT-0003-08, REQ-FEAT-0010-01, REQ-FEAT-0010-05, REQ-FEAT-0010-06, REQ-FEAT-0010-12, REQ-FEAT-0010-20]
---

# DM-0002 — Estado e resultado da volta em memória

## Realiza

Os `REQ-*` em `sources`: os campos de estado de RULE-0002 e de API-0001 (`lapPhase`, `resumePhase`,
`pauseCause`, `lapKind`, `lapValidity`, `invalidReason`, contadores, `lapSequenceCount`, `lapStartMs`), o resultado
único de cada volta e, no treino, a lista de resultados e a melhor volta válida (FEAT-0010). Camada: simulação,
`src/lap.ts`. Não há tabela, banco nem arquivo gravado: o estado vive na memória da página e some quando a página é
recarregada ou abandonada (REQ-FEAT-0009-11, REQ-FEAT-0010-31, REQ-FEAT-0010-32).

Uma `LapSession` é uma volta oficial, uma volta de reconhecimento ou um treino inteiro: o treino é uma sequência de
voltas dentro de uma única sessão, criada por um único `startLap` e encerrada só por `endTraining`
([ADR-0006](../adr/ADR-0006-treino-como-sequencia-de-voltas-numa-sessao.md)).

## `LapSession` (imutável; cada passo ou comando devolve uma nova)

| Campo | Tipo | Unidade | Nulável | Padrão ao iniciar | Observação |
|---|---|---|---|---|---|
| `lapKind` | `OFFICIAL`, `RECON`, `TRAINING` | — | não | do pedido | fixo na sessão |
| `trackId` | texto | — | não | da leitura | nunca da data, do relógio ou do nome |
| `trackVersion` | texto ou inteiro | — | não | da leitura | copiado sem interpretação |
| `challengeNumber` | inteiro | — | sim | ausente | copiado do pedido; ausente não muda nada |
| `setupId` | `ARCADE_ASSISTIDO`, `REALISTA_ALUGUEL_4T` | — | sim | ausente | copiado do pedido sem interpretação (API-0002); ausente não muda nada; um valor fora do enum não é verificado aqui: é resolvido pelo leitor do dado publicado de `dirigibilidade` |
| `setupVersion` | texto | — | sim | ausente | copiado do pedido sem interpretação (API-0002); ausente não muda nada |
| `trackStatus` | `COMPLETE`, `INCOMPLETE` | — | não | da leitura | decide `official` |
| `lines` | estrutura de linhas e limites de corte | m, ms | não | da leitura | referência ao dado lido, não copiada. `COMPLETE`: chegada, 3 limites de setor e marcadores. `INCOMPLETE`: as linhas que a leitura declara (chegada, limites, marcadores), quando ela declara `direction` e `finishLine`; sem um dos dois, nenhuma linha ([ADR-0004](../adr/ADR-0004-lacunas-do-f-spec-resolvidas-no-projeto.md), item 3). Limites de corte sempre resolvidos |
| `config` | `KartConfig` congelado | — | não | configuração vigente ao iniciar | fixa durante a sessão; mudar peso ou estilo vale para a sessão seguinte |
| `phase` | `COUNTDOWN`, `RUNNING`, `PAUSED`, `ENDED` | — | não | `COUNTDOWN` | RULE-0002; no treino, fase do treino inteiro |
| `resumePhase` | `COUNTDOWN`, `RUNNING` | — | sim | ausente | presente só com `PAUSED` |
| `pauseCause` | `ESC_KEY`, `FOCUS_LOST`, `SENSOR_LOST`, `PAUSE_BUTTON` | — | sim | ausente | presente só com `PAUSED`; `PAUSE_BUTTON` só com `lapKind` `TRAINING` |
| `validity` | `VALID`, `INVALID` | — | não | `VALID` | da volta em andamento; volta a `VALID` no início de cada volta do treino |
| `invalidReason` | `MISSED_MARKER`, `CUT`, `REPOSITION` | — | sim | ausente | presente só com `INVALID`; o primeiro motivo da volta em andamento |
| `countdownSteps` | inteiro 0 a 360 | passos | não | 0 | 360 passos de `STEP` são 3000 ms exatos; só avança antes do sinal verde, uma vez por sessão |
| `stepCount` | inteiro | passos | não | 0 | passos contados do sinal verde; contador de sequência; avança só em `RUNNING`; no treino não recomeça a cada volta |
| `lapSequenceCount` | inteiro, a partir de 1 | voltas | não | 1 | posição da volta em andamento na sequência do treino; fica 1 fora do treino |
| `lapStartMs` | inteiro | ms | não | 0 | início da volta em andamento, contado do sinal verde: 0 na primeira volta e fora do treino; nas voltas seguintes do treino, o instante de cruzamento (já em ms inteiros) que encerrou a anterior |
| `markersPassedCount` | inteiro 0 a total de marcadores | marcadores | não | 0 | da volta em andamento; volta a 0 no início de cada volta do treino |
| `sectorBoundsMs` | lista de 0 a 3 posições, cada uma inteiro ou `null` | ms | não | vazia | `b1`, `b2`, `b3` da volta em andamento, em ordem. O comprimento é o índice do limite registrado mais alto; uma posição `null` é um limite que ficou sem registro porque um limite posterior foi registrado antes dele ([DES-0003](../core/DES-0003-cruzamentos-marcadores-setores-e-chegada.md)). Volta a vazia no início de cada volta do treino |
| `offTrackSteps` | inteiro | passos | não | 0 | passos seguidos além da distância de corte; mede a saída do kart e não recomeça no início de uma volta do treino |
| `kart` | `State` da física | — | não | largada | posição, heading e demais campos do `State` existente |
| `results` | lista de `LapResult` | — | não | vazia | em ordem de encerramento. Em `OFFICIAL` e `RECON`, 0 ou 1 item; no treino, 1 item por volta concluída na chegada. Substitui o campo `result` da versão 1.1.0 |

Valores derivados (funções puras, não armazenados, [DES-0002](../core/DES-0002-tempo-da-volta-e-interpolacao.md)):

| Valor | Definição |
|---|---|
| `countdownRemainingMs` | `3000 - toMs(countdownSteps)` |
| `elapsedMs` | 0 em `COUNTDOWN`; `toMs(stepCount) - lapStartMs` em `RUNNING`, `PAUSED` e no `ENDED` sem resultado válido da volta (congelado na pausa e no fim); `lapMs` do resultado no `ENDED` de uma volta oficial ou de reconhecimento válida |
| `completedSectorMs` | tempos `bi - b(i-1)` da volta em andamento, com `b0 = lapStartMs`, do setor 1 até o primeiro setor sem as duas fronteiras; no `ENDED` de uma volta válida com `sectorMs`, os quatro tempos dela |
| `bestValidLapMs` | só no treino, com `phase` diferente de `ENDED`: o menor `trainingLapMs` entre os itens de `results` com `lapValidity` `VALID`; ausente sem nenhum deles, fora do treino e depois de `endTraining` |
| último resultado | o último item de `results`, lido por `getLapResult` |

## `LapResult` (API-0001)

| Campo | Tipo | Unidade | Nulável | Observação |
|---|---|---|---|---|
| `trackId` | texto | — | não | |
| `trackVersion` | texto ou inteiro | — | não | |
| `challengeNumber` | inteiro | — | sim | só presente se o pedido o trouxe |
| `setupId` | `ARCADE_ASSISTIDO`, `REALISTA_ALUGUEL_4T` | — | sim | só presente se o pedido o trouxe, copiado da sessão; ausente lê-se `ARCADE_ASSISTIDO` pelo leitor de registros de `dirigibilidade` (`resolveSetupRef`, `src/setupRecords.ts`), nunca por esta simulação (API-0001) |
| `setupVersion` | texto | — | sim | só presente se o pedido o trouxe, copiado da sessão; ausente lê-se a `previousSetupVersion` do `setupId` pelo mesmo leitor (API-0001) |
| `lapKind` | enum | — | não | |
| `lapValidity` | `VALID`, `INVALID` | — | não | |
| `invalidReason` | enum | — | sim | só com `INVALID`; o primeiro motivo da volta, nunca um segundo |
| `official` | booleano | — | não | verdadeiro somente com `OFFICIAL`, `VALID` e `trackStatus` `COMPLETE` |
| `lapMs` | inteiro | ms | sim | só com `VALID`; `b4 - b0` |
| `sectorMs` | 4 inteiros | ms | sim | só com `VALID` numa pista que declara os 3 limites de setor e com as três fronteiras registradas; `[b1 - b0, b2 - b1, b3 - b2, b4 - b3]` |
| `lapSequenceCount` | inteiro | voltas | sim | só com `TRAINING`: posição da volta no treino |
| `lapStartMs` | inteiro | ms | sim | só com `TRAINING`: `b0` da volta |
| `trainingLapMs` | inteiro | ms | sim | só com `TRAINING`, também com `INVALID`: `b4 - b0`; igual a `lapMs` quando `VALID` |
| `trainingSectorMs` | 4 posições, inteiro ou `null` | ms | sim | só com `TRAINING` numa pista que declara os 3 limites de setor: posição i é `bi - b(i-1)` quando as duas fronteiras estão registradas, senão `null`; igual a `sectorMs` quando este existe |

O resultado não tem campo de identidade de jogador, de dispositivo, de data nem de relógio (NFR-0005).

`setupId` e `setupVersion` identificam o acerto do resultado como `trackId` e `trackVersion` identificam a pista;
nenhum dos dois altera validade, tempo ou motivo, e a simulação os copia sem ler o dado publicado do acerto
(API-0001; sentido de dependência: `src/setupRecords.ts` importa `src/lap.ts`, nunca o contrário). O resultado é a
fonte da qual o replay e o texto compartilhado — registros de `dirigibilidade`, em `src/setupRecords.ts` e
`src/handlingMessages.ts` — copiam os dois campos; este modelo não os descreve. Todos os resultados de um treino
têm os mesmos `trackId`, `trackVersion`, `setupId` e `setupVersion`, copiados da sessão (INV-4), de modo que
`bestValidLapMs` compara só tempos comparáveis por construção.

## Invariantes verificáveis

| Id | Invariante |
|---|---|
| INV-1 | Em `OFFICIAL` e `RECON`: `phase` `ENDED` se, e somente se, `results` tem exatamente um item. No treino: `results.length` é `lapSequenceCount - 1` em toda fase, e `phase` só chega a `ENDED` por `endTraining`. Depois de `ENDED` nenhum comando nem passo muda a sessão |
| INV-2 | `resumePhase` e `pauseCause` existem se, e somente se, `phase` é `PAUSED` |
| INV-3 | Em `PAUSED` e em `ENDED` nenhum contador (`countdownSteps`, `stepCount`, `lapSequenceCount`, `lapStartMs`, `offTrackSteps`, `markersPassedCount`, `sectorBoundsMs`), nem `results`, nem `kart` mudam |
| INV-4 | `lapKind`, `trackId`, `trackVersion`, `challengeNumber`, `setupId`, `setupVersion`, `trackStatus`, `lines` e `config` não mudam durante a sessão |
| INV-5 | Resultado com `sectorMs` tem 4 inteiros cuja soma é `lapMs`, com diferença de 0 ms, e cada elemento maior ou igual a 0 |
| INV-6 | `INVALID` tem `invalidReason`, e o resultado não tem `lapMs` nem `sectorMs` |
| INV-7 | Dentro de uma volta, `markersPassedCount` e `sectorBoundsMs.length` só crescem e nunca passam do total declarado; uma posição registrada de `sectorBoundsMs` nunca muda. Ambos voltam a 0 e a vazia só no início de uma volta do treino |
| INV-8 | `official` verdadeiro implica `OFFICIAL`, `VALID` e `COMPLETE` |
| INV-9 | `stepCount` só avança em `RUNNING`; `countdownSteps` só avança em `COUNTDOWN`; o tempo exibido é função só desses contadores e de `lapStartMs` |
| INV-10 | No treino, para resultados consecutivos `r(n)` e `r(n+1)`: `r(n+1).lapStartMs = r(n).lapStartMs + r(n).trainingLapMs`; `r(1).lapStartMs = 0`; e `lapStartMs` da sessão é `r(n).lapStartMs + r(n).trainingLapMs` do último. Por isso a soma dos `trainingLapMs` é o `lapStartMs` da volta em andamento, com diferença de 0 ms |
| INV-11 | No treino, `results[i].lapSequenceCount` é `i + 1`: de 1 em diante, sem repetição e sem lacuna; nenhum resultado muda depois de produzido |

## Plano de migração

Nenhum: o estado não é persistido, não há versão a migrar nem reversão a especificar além do descarte da página.

## Preenchimento retroativo

Nenhum.

## Janela de compatibilidade

Nenhuma: o tipo é interno ao cliente. O contrato visível é o de API-0001 e API-0002, cujos nomes e unidades não
mudam depois de publicados (I3). Rodada de 2026-10-22: `setupId` e `setupVersion` entram nos dois tipos como campos
opcionais e aditivos. Rodada de 2026-10-30 (API-0001 1.2.0, API-0002 1.2.1): `lapSequenceCount` e `lapStartMs` entram
no estado com os valores neutros 1 e 0 fora do treino; `bestValidLapMs` é opcional e ausente fora do treino;
`lapSequenceCount`, `lapStartMs`, `trainingLapMs` e `trainingSectorMs` entram no resultado só com `TRAINING`;
`PAUSE_BUTTON` entra em `pauseCause` só no treino. Nenhum campo do contrato é renomeado, removido ou muda de
significado. O campo interno `result` (um resultado) dá lugar a `results` (lista); nenhum leitor fora de `src/lap.ts`
o lê no código em execução (os demais módulos leem `getLapResult`), e `getLapResult` continua a devolver o mesmo
valor em volta oficial e de reconhecimento.

## Retenção e privacidade

Retido só enquanto a página está aberta. Contém identificadores de pista, de acerto, números de passo e tempos em ms;
não contém dado pessoal, identificador de jogador, idioma nem horário (D-DS-04, I6). Nada é enviado pela rede nem
gravado em `localStorage`, `sessionStorage`, IndexedDB ou cookie por esta feature: nem o resultado, nem a lista de
resultados do treino, nem a melhor volta válida, que deixa de existir com a sessão (um novo `startLap` começa com
`results` vazia). A persistência do resultado é do desafio diário (etapa 5).
