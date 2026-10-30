---
id: RULE-0004
title: Corte e grama
feature: race-lap-validation
stage: fspec
status: validated
version: 1.1.0
sources: [US-0006, US-0010, AC-US-0006-01, AC-US-0006-02, AC-US-0006-03, AC-US-0006-04, AC-US-0006-06, AC-US-0006-07, AC-US-0006-08, AC-US-0010-07, AC-US-0010-08, AC-US-0010-09]
---

# RULE-0004 — Corte e grama

Decide quando uma saída de pista é corte. Fonte dos limites: `DOMAIN/DEC-01` (D09), com os valores padrão que
o dado da pista pode substituir. O efeito do corte no treino segue `DOMAIN/DEC-12`. Decidido na simulação (I2).

## Limites

| Limite | Padrão | Declarado pela pista | Fonte |
|---|---|---|---|
| Distância além da borda, `cutDistanceM` | 3 m | Sim, opcional ([API-0003](../api/API-0003-dado-de-pista.md)) | AC-US-0006-01, AC-US-0006-04 |
| Duração contínua, `cutDurationMs` | 1000 ms | Sim, opcional | AC-US-0006-01, AC-US-0006-04 |

Cada limite ausente no dado da pista usa o padrão. Com limite declarado, vale o da pista e não o padrão
(AC-US-0006-04).

## Tabela de decisão (por passo em `RUNNING`)

| Distância do kart além da borda | `offTrackMs` antes do passo | Efeito no passo | Fonte |
|---|---|---|---|
| Sobre a pista, ou 0 | qualquer | `offTrackMs` = 0; sem efeito na validade | AC-US-0006-03 |
| Maior que 0 e menor ou igual a `cutDistanceM` | qualquer | `offTrackMs` = 0; sem invalidação; só a redução de velocidade da grama (RF08) | AC-US-0006-03, AC-US-0006-08 |
| Maior que `cutDistanceM` | `offTrackMs` + `STEP` menor ou igual a `cutDurationMs` | `offTrackMs` = `offTrackMs` + `STEP`; sem invalidação | AC-US-0006-02 |
| Maior que `cutDistanceM` | `offTrackMs` + `STEP` maior que `cutDurationMs` | Corte neste passo: a volta em andamento fica `INVALID` com `CUT`. Em volta oficial ou de reconhecimento, fase `ENDED`; no treino, a fase segue `RUNNING` (tabela "Efeitos") | AC-US-0006-01; AC-US-0010-07 |

"Maior" e "menor ou igual" são estritos como escritos: 3 m exatos não é corte; 1000 ms exatos não é corte.
A duração é medida em passos de `STEP` do estado da simulação, convertidos em ms, e é contínua: qualquer
passo com o kart a `cutDistanceM` ou menos da borda reinicia `offTrackMs` em 0 (AC-US-0006-02). `offTrackMs`
mede a saída do kart, "seguidos" no sentido de `DOMAIN/DEC-01`: o início de uma volta seguinte do treino não o
reinicia, e o corte é atribuído à volta em andamento no passo em que a duração é ultrapassada.

## Efeitos

| Efeito | Regra | Fonte |
|---|---|---|
| Fim da volta oficial ou de reconhecimento | Termina no passo da invalidação; nenhum tempo de volta nem de setor é acrescentado depois dele | AC-US-0006-06; `DOMAIN/DEC-06` |
| Volta de treino | Não termina no corte: fica `INVALID` com `CUT` desde o passo da invalidação, o kart não para e nenhuma volta nova começa até o próximo cruzamento da chegada no sentido da pista, que a encerra e inicia a seguinte | AC-US-0010-08, AC-US-0010-09; `DOMAIN/DEC-12` |
| Motivo exibido | "corte" ([RULE-0006](RULE-0006-mensagens-de-estado-e-motivo.md)); no treino, a partir do primeiro quadro renderizado depois do passo da invalidação | AC-US-0006-05; AC-US-0010-07 |
| Pausa, perda de foco, perda do sensor, botão de pausa | Nenhum passo avança; `offTrackMs` não muda; o tempo em pausa não conta | US-0006, caso anormal; `DOMAIN/DEC-08` |
| Corte seguido de marcador pulado | O motivo é `CUT`. Fora do treino, a volta já terminou; no treino, ela segue com `CUT` até a chegada | US-0006, caso anormal; US-0010, caso anormal |
| Novo corte numa volta de treino já inválida por corte | Sem novo efeito sobre a validade nem sobre o motivo | US-0010, caso anormal |
| Grama sem corte | A velocidade do kart após N passos na grama é menor que após N passos na pista, partindo do mesmo estado e com a mesma entrada | AC-US-0006-07; RF08 |

A redução de velocidade na grama é a física existente (RF08) e não muda nesta feature (NFR-0011).

## Idempotência e ordem

`offTrackMs` só avança por passo de simulação; reaplicar o mesmo passo não existe. O corte invalida uma volta
uma única vez: fora do treino, depois dele a fase é `ENDED` e novos passos de saída de pista são ignorados; no
treino, a volta já está `INVALID` com `CUT` e um novo corte não muda nada. O contador de sequência é
`stepCount` do passo da invalidação ([RULE-0002](RULE-0002-estados-da-volta.md)).
