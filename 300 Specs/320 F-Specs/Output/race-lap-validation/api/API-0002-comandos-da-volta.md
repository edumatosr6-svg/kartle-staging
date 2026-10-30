---
id: API-0002
title: Contrato dos comandos da volta
feature: race-lap-validation
stage: fspec
status: validated
version: 1.2.1
sources: [US-0001, US-0003, US-0007, US-0008, US-0010, AC-US-0001-06, AC-US-0003-05, AC-US-0003-06, AC-US-0003-07, AC-US-0003-08, AC-US-0007-01, AC-US-0007-04, AC-US-0008-03, AC-US-0010-15, AC-US-0010-16, AC-US-0010-17, AC-US-0010-18, AC-US-0010-19, NFR-0010]
---

# API-0002 — Contrato dos comandos da volta

Contrato em processo entre a camada de aplicação, os adaptadores de controle e a simulação, único para
`web-desktop` e `web-mobile`. Não há endpoint de rede, caminho HTTP nem prefixo no MVP. Nomes em `camelCase`
plano, com a unidade como sufixo, por D-FS-06.

Os comandos não são campos de `Input`: o passo fixo `STEP` e o significado de cada campo de `Input` não
mudam (NFR-0010). O avanço da simulação continua sendo o passo existente com `Input`; esta feature só lhe
acrescenta o efeito descrito em [RULE-0002](../rules/RULE-0002-estados-da-volta.md) e não o redefine.

## Operações

| Operação | Propósito | Fase aceita |
|---|---|---|
| `startLap` | Cria uma volta oficial ou de reconhecimento, ou um treino, numa pista e inicia a contagem | nenhuma volta, ou volta `ENDED` |
| `pauseLap` | Suspende simulação e cronômetro | `COUNTDOWN`, `RUNNING` |
| `resumeLap` | Continua a volta pausada | `PAUSED` |
| `repositionKart` | Recoloca o kart na pista | `RUNNING` |
| `endTraining` | Encerra o treino | `COUNTDOWN`, `RUNNING`, `PAUSED`, só com `lapKind` `TRAINING` |

## Auth

Sem sessão e sem conta (RNF10). Papel permitido: `player` (anônimo). Contrato interno do cliente, público
dentro dele porque não há segredo nem identidade; o emissor de cada comando é um adaptador de controle ou a
camada de aplicação, que só encaminham o que o Jogador ou o navegador fez (I2).

## `startLap`

| Campo do pedido | Tipo | Obrigatório | Padrão e restrições |
|---|---|---|---|
| `lapKind` | enum `OFFICIAL`, `RECON`, `TRAINING` | sim | sem padrão; o tipo é definido pelo desafio diário, fora do escopo. `TRAINING` inicia um treino: uma sequência de voltas com uma única contagem ([RULE-0002](../rules/RULE-0002-estados-da-volta.md)) |
| `trackId` | texto | sim | pista do dado lido ([API-0003](API-0003-dado-de-pista.md)) |
| `trackVersion` | valor do dado da pista | sim | versão do dado lido |
| `challengeNumber` | inteiro | não | padrão: ausente. Neutro: ausente não muda a volta; é só copiado para o resultado ([API-0001](API-0001-resultado-e-estado-da-volta.md)) |
| `setupId` | enum `ARCADE_ASSISTIDO`, `REALISTA_ALUGUEL_4T` | não | padrão: ausente; no resultado, ausente lê-se `ARCADE_ASSISTIDO`. Acerto corrente da volta, informado pela camada de aplicação a partir do dado publicado (`getSetupVersion`, contrato `API-0002` de `dirigibilidade`); esta feature não o deriva nem o valida: o valor é copiado sem interpretação, e um valor fora do enum é resolvido pelo leitor do dado publicado, não por este comando. Neutro: ausente não muda a volta (validade, tempo, motivo); é só copiado para o resultado (I5; FB-01 de `dirigibilidade`) |
| `setupVersion` | texto | não | padrão: ausente; no resultado, ausente lê-se a `previousSetupVersion` do `setupId`. Versão corrente do acerto, informada pela camada de aplicação a partir do dado publicado; esta feature não a deriva nem a interpreta. Neutro: ausente não muda a volta; é só copiada para o resultado. Toda volta iniciada a partir desta mudança informa os dois campos, para que o seu resultado não seja lido pelos padrões como um registro anterior (I3, I5; FB-01 de `dirigibilidade`) |

Efeito: cria a volta, ou o treino, em `COUNTDOWN` com `countdownRemainingMs` 3000, o kart parado na posição de
largada, `lapValidity` `VALID`, `lapSequenceCount` 1 e `lapStartMs` 0; `challengeNumber`, `setupId` e
`setupVersion` são guardados sem interpretação e copiados para cada resultado, também para todos os
resultados de um treino. Resposta: aceito, com o estado inicial de `getLapState`.

## `pauseLap`

| Campo do pedido | Tipo | Obrigatório | Padrão e restrições |
|---|---|---|---|
| `pauseCause` | enum `ESC_KEY`, `FOCUS_LOST`, `SENSOR_LOST`, `PAUSE_BUTTON` | sim | `ESC_KEY` só em `web-desktop`; `SENSOR_LOST` só em `web-mobile`; `PAUSE_BUTTON` nos dois canais, só com `lapKind` `TRAINING` (AC-US-0010-15) |

Efeito: a volta vai para `PAUSED` com `resumePhase` igual à fase anterior; nenhum passo de `STEP` avança até
`resumeLap` ou, no treino, até `endTraining` (AC-US-0003-08, AC-US-0010-15). `FOCUS_LOST` e `SENSOR_LOST` são
emitidos pelo navegador e pelo adaptador sem ação do Jogador (AC-US-0003-06, AC-US-0003-07); `PAUSE_BUTTON` é
emitido quando o Jogador aciona o botão de pausa do treino.

## `resumeLap`

Sem campos. Efeito: a volta volta a `resumePhase`; o tempo da volta é o do instante da pausa; voltar a
`RUNNING` não exibe contagem (AC-US-0010-04). O meio pelo qual o Jogador aciona o comando não é decidido pelos
requisitos.

## `repositionKart`

Sem campos. Efeito conforme [RULE-0005](../rules/RULE-0005-tipos-de-volta-e-reposicionamento.md): em
`OFFICIAL`, invalida com `REPOSITION` no passo do pedido; em `RECON` e `TRAINING`, recoloca o kart sem outro
efeito: no treino, a volta não fica inválida nem é revalidada (AC-US-0010-19). É acionado por teclado em
`web-desktop` e por toque em `web-mobile`; o contrato é o mesmo.

## `endTraining`

Sem campos. Efeito: o treino vai para `ENDED`; a volta em andamento não é concluída e não recebe resultado; os
resultados já produzidos continuam legíveis por `getLapResult` e `listLapResults` até o próximo `startLap`;
nenhuma volta começa depois (AC-US-0010-17, AC-US-0010-18). Aceito em `COUNTDOWN`, `RUNNING` e `PAUSED`,
inclusive durante uma pausa (US-0010, caso anormal). Acionado pela ação "encerrar treino" da tela, oferecida
nos dois canais durante o treino (AC-US-0010-16; [SCR-0001](../screens/SCR-0001-corrida-hud-da-volta.md)).

## Erros

Rejeições sem lançar e sem alterar o estado da volta:

| Código | Operação | Condição | Corpo |
|---|---|---|---|
| `LAP_ALREADY_ACTIVE` | `startLap` | existe volta ou treino em `COUNTDOWN`, `RUNNING` ou `PAUSED` | apenas o código |
| `OFFICIAL_NOT_AVAILABLE` | `startLap` | `lapKind` `OFFICIAL` e o dado da pista é `INCOMPLETE` (AC-US-0008-03) | apenas o código |
| `TRACK_DATA_UNREADABLE` | `startLap` | o dado da pista é ilegível | apenas o código |
| `TRACK_SCHEMA_UNSUPPORTED` | `startLap` | versão de esquema do dado desconhecida | apenas o código |
| `NO_ACTIVE_LAP` | `pauseLap`, `resumeLap`, `repositionKart`, `endTraining` | nenhuma volta foi aceita | apenas o código |
| `LAP_ENDED` | `pauseLap`, `resumeLap`, `repositionKart`, `endTraining` | a volta ou o treino está em `ENDED` | apenas o código |
| `NOT_PAUSED` | `resumeLap` | a volta não está em `PAUSED` | apenas o código |
| `ALREADY_PAUSED` | `pauseLap` | a volta já está em `PAUSED` | apenas o código |
| `NOT_RUNNING` | `repositionKart` | a volta está em `COUNTDOWN` ou `PAUSED` | apenas o código |
| `NOT_TRAINING` | `endTraining`; `pauseLap` com `PAUSE_BUTTON` | `lapKind` é `OFFICIAL` ou `RECON`: o botão de pausa e a ação de encerrar existem só no treino (`SEED/US-10`) | apenas o código |

Quando mais de uma condição vale para o mesmo pedido, só um código é retornado, o primeiro desta ordem de
precedência, a mesma de [RULE-0005](../rules/RULE-0005-tipos-de-volta-e-reposicionamento.md):

1. `NO_ACTIVE_LAP`;
2. `NOT_TRAINING` (`endTraining`, ou `pauseLap` com `PAUSE_BUTTON`, com `lapKind` `OFFICIAL` ou `RECON`, em qualquer fase);
3. `LAP_ENDED`;
4. `ALREADY_PAUSED`, `NOT_PAUSED` ou `NOT_RUNNING`, que não se sobrepõem entre si.

Em `startLap`: `LAP_ALREADY_ACTIVE`, depois `TRACK_DATA_UNREADABLE`, depois `TRACK_SCHEMA_UNSUPPORTED`, depois
`OFFICIAL_NOT_AVAILABLE`. Exemplos: `endTraining` numa volta oficial `ENDED` retorna `NOT_TRAINING`;
`pauseLap` com `PAUSE_BUTTON` numa volta oficial `PAUSED` retorna `NOT_TRAINING`.

Toda rejeição deixa o estado como estava: nenhuma delas invalida a volta, consome tempo ou produz resultado.

## Idempotência

Chave: a volta ativa ou o treino ativo (não há identificador de pedido; o estado decide).

| Operação | Pedido repetido |
|---|---|
| `startLap` | Rejeitado com `LAP_ALREADY_ACTIVE` enquanto a volta ou o treino não termina; não reinicia a contagem nem cria segunda volta. A deduplicação ocorre na simulação. Depois de `ENDED`, um novo `startLap` cria outra volta ou outro treino, com outros resultados |
| `pauseLap` | `ALREADY_PAUSED`: sem efeito, sem trocar `resumePhase` nem `pauseCause` |
| `resumeLap` | `NOT_PAUSED`: sem efeito |
| `repositionKart` | Em `OFFICIAL`, o primeiro encerra a volta e os seguintes retornam `LAP_ENDED`; em `RECON` e `TRAINING` cada pedido recoloca o kart sem efeito de validade |
| `endTraining` | O primeiro encerra o treino; os seguintes retornam `LAP_ENDED`, sem efeito |

O consumo de tentativa do desafio diário (reload, abandono, repetição) é da etapa 5 e não faz parte deste
contrato (I7, D-FS-04): este contrato só garante que uma volta tem no máximo 1 resultado.

## Paginação e sondagem

Não se aplica: os comandos são pontuais.

## Compatibilidade

Contrato novo, sem campo publicado anterior. O avanço da simulação com `Input` não muda (NFR-0010); um pedido
de aposentadoria de campo existente não se aplica porque nenhum campo existente é renomeado ou removido.

Rodada de 2026-10-22 (FB-01 de `dirigibilidade`, aceito): `setupId` e `setupVersion` são acrescentados ao
pedido `startLap` como campos opcionais e aditivos. Um emissor que não os informa continua aceito, com o
mesmo efeito de antes sobre a volta; o resultado que ele produz é lido pelos padrões de
[API-0001](API-0001-resultado-e-estado-da-volta.md). Nenhum campo existente muda de nome, significado ou
unidade, e nenhuma rejeição nova é introduzida.

Rodada de 2026-10-30 (seed `revision: 3`, US-0010): acrescentados o comando `endTraining`, o valor
`PAUSE_BUTTON` de `pauseCause` e a rejeição `NOT_TRAINING`, que só alcança esses dois acréscimos. Um emissor
que não os usa continua com o mesmo efeito em `OFFICIAL` e `RECON`. O efeito de `startLap` com `TRAINING` muda
por decisão do seed (`SEED/US-10`, `DOMAIN/DEC-12`): inicia um treino de voltas seguidas que termina só com
`endTraining`. Nenhum campo existente muda de nome, significado ou unidade.
