---
id: RULE-0005
title: Tipos de volta, reposicionamento e pista de dado incompleto
feature: race-lap-validation
stage: fspec
status: validated
version: 1.1.1
sources: [US-0007, US-0008, US-0010, AC-US-0007-01, AC-US-0007-04, AC-US-0007-05, AC-US-0007-06, AC-US-0008-01, AC-US-0008-02, AC-US-0008-03, AC-US-0008-04, AC-US-0008-05, AC-US-0010-16, AC-US-0010-19, AC-US-0010-25, AC-US-0010-27]
---

# RULE-0005 — Tipos de volta, reposicionamento e pista de dado incompleto

Fontes: `DOMAIN/DEC-02` (D08), `DOMAIN/DEC-10`, `DOMAIN/DEC-12`, `DOMAIN/DEC-13`, I7. Quem define o tipo de uma
volta é o desafio diário, fora do escopo; esta regra só decide o que cada tipo implica aqui.

## Tipo de volta e resultado

| `lapKind` | Reposicionar em `RUNNING` | Fim | Resultados | Campo `official` do resultado | Fonte |
|---|---|---|---|---|---|
| `OFFICIAL` | Invalida, `REPOSITION`, fim no passo do pedido | Na chegada ou na invalidação; o kart para | 0 ou 1; tempo oficial se válida | `true` só se válida (abaixo) | AC-US-0007-01; AC-US-0010-21, AC-US-0010-22; `DOMAIN/DEC-02` |
| `RECON` | Livre, sem invalidar, sem motivo, sem penalidade | Na chegada ou na invalidação por corte | 0 ou 1; tempo exibido como não oficial | `false` | AC-US-0007-04, AC-US-0007-05, AC-US-0007-06; AC-US-0008-01 |
| `TRAINING` | Livre, sem invalidar nem revalidar, sem motivo "reposicionamento", sem penalidade | Só por `endTraining`; cada volta da sequência termina na chegada no sentido da pista | 1 por volta concluída na chegada; tempo exibido como não oficial | `false` | AC-US-0007-04, AC-US-0007-05, AC-US-0007-06; AC-US-0008-01; AC-US-0010-19, AC-US-0010-20, AC-US-0010-25 |

`official` é `true` somente quando `lapKind` é `OFFICIAL`, `lapValidity` é `VALID`, a volta foi concluída e a
pista é de dado completo. Em qualquer outra combinação é `false`. Nenhuma volta de reconhecimento ou de
treino é entregue como resultado oficial (AC-US-0008-02).

## Reposicionamento (comando `repositionKart`)

| Fase da volta | Efeito | Fonte |
|---|---|---|
| `RUNNING` e `OFFICIAL` | Invalida com `REPOSITION` no passo do pedido | AC-US-0007-01, AC-US-0007-03 |
| `RUNNING` e `RECON` | Recoloca o kart na pista; sem efeito sobre validade, tempo e motivo | AC-US-0007-04 a AC-US-0007-06 |
| `RUNNING` e `TRAINING` | Recoloca o kart na pista em qualquer volta da sequência; sem efeito sobre validade, tempo e motivo: a volta válida segue válida e a volta já inválida por corte segue inválida com `CUT`; a sequência de voltas não é interrompida | AC-US-0007-04 a AC-US-0007-06; AC-US-0010-14, AC-US-0010-19; US-0007, caso anormal |
| `COUNTDOWN` ou `PAUSED` | Rejeitado com `NOT_RUNNING`, sem efeito sobre a validade | US-0007, pré-condição e caso anormal sobre pausa |
| `ENDED` | Rejeitado com `LAP_ENDED`, sem efeito; reposicionamentos repetidos não geram segundo resultado | US-0007, caso anormal; I7 |

O tempo da volta de reconhecimento ou de treino segue o tempo de simulação decorrido desde o início da volta,
com ou sem reposicionamento: N × `STEP` após N passos numa volta iniciada no sinal verde; o instante de
simulação menos `lapStartMs` numa volta seguinte do treino (AC-US-0007-06;
[RULE-0003](RULE-0003-cronometragem-e-interpolacao.md)). O ponto para onde o kart é recolocado não é decidido
pelos requisitos (ver `01-overview.md`).

## Encerrar o treino (comando `endTraining`)

| Fase | `lapKind` | Efeito | Fonte |
|---|---|---|---|
| `COUNTDOWN`, `RUNNING` ou `PAUSED` | `TRAINING` | Fase `ENDED`; a volta em andamento não é concluída e não recebe resultado; os resultados já produzidos ficam como estão; nenhuma volta começa depois | AC-US-0010-16, AC-US-0010-17, AC-US-0010-18 |
| qualquer | `OFFICIAL` ou `RECON` | Rejeitado com `NOT_TRAINING`, sem efeito | `SEED/US-10` (a ação existe só no treino) |
| `ENDED` | `TRAINING` | Rejeitado com `LAP_ENDED`, sem efeito | I7 |

Precedência das rejeições, a mesma de [API-0002](../api/API-0002-comandos-da-volta.md): `NO_ACTIVE_LAP`, depois
`NOT_TRAINING`, depois `LAP_ENDED`, depois `ALREADY_PAUSED`, `NOT_PAUSED` ou `NOT_RUNNING`; só o primeiro código
que vale é retornado. Por isso `endTraining` numa volta oficial ou de reconhecimento retorna `NOT_TRAINING` em
qualquer fase, também em `ENDED`, e um `pauseLap` com `PAUSE_BUTTON` fora do treino retorna `NOT_TRAINING`
também com a volta pausada.

## Leitura do dado da pista e oferta de volta

`trackDataStatus` resulta da leitura do dado ([API-0003](../api/API-0003-dado-de-pista.md)).

| `trackDataStatus` | Significado | Volta oficial oferecida | Treino oferecido | Fonte |
|---|---|---|---|---|
| `COMPLETE` | Declara largada, sentido, linha de chegada, quatro setores e marcadores, de forma consistente | Sim, se o desafio diário a define | Sim | `DOMAIN/DEC-10` |
| `INCOMPLETE` | Falta algum dos itens acima, ou o dado está na forma anterior, ou é inconsistente | Não: nenhuma opção de volta oficial | Sim: pilotável | AC-US-0008-03, AC-US-0008-04; `DOMAIN/DEC-10` |
| `UNSUPPORTED_SCHEMA` | Versão de esquema desconhecida | Não | Não: o dado não é usado | I3, I4 |
| `UNREADABLE` | Dado ilegível | Não | Não | I4 |

Em pista `INCOMPLETE` todo resultado tem `official` igual a `false` (AC-US-0008-05). Um pedido `startLap`
com `lapKind` `OFFICIAL` que chegue à simulação para uma pista `INCOMPLETE` é rejeitado com
`OFFICIAL_NOT_AVAILABLE` e não cria volta ([API-0002](../api/API-0002-comandos-da-volta.md)).

No treino numa pista `INCOMPLETE` que declara linha de chegada e sentido mas não declara setores, cada volta
encerrada na chegada tem resultado só com o tempo total e a validade, sem tempo de setor (AC-US-0010-27;
`DOMAIN/DEC-13`). Numa pista sem linha de chegada não há cruzamento que encerre uma volta; o que se cronometra
nela não é decidido pelos requisitos (ver `01-overview.md`).

## Idempotência e ordem

| Transição | Idempotente sob repetição | Contador de sequência |
|---|---|---|
| Invalidação por reposicionamento | Sim: a segunda é rejeitada (`LAP_ENDED`) | `stepCount` do passo do pedido |
| Reposicionamento em reconhecimento ou treino | Pode repetir; cada um recoloca o kart sem outro efeito de validade | `stepCount` do passo do pedido |
| Encerramento do treino | Sim: o segundo pedido é rejeitado (`LAP_ENDED`) | `stepCount` do pedido |
| Leitura do dado da pista | Sim: ler duas vezes o mesmo dado dá o mesmo `trackDataStatus` | nenhum |
