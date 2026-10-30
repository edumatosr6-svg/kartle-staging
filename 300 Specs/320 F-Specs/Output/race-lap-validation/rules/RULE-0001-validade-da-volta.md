---
id: RULE-0001
title: Validade da volta
feature: race-lap-validation
stage: fspec
status: validated
version: 1.1.0
sources: [US-0002, US-0004, US-0005, US-0006, US-0007, US-0008, US-0010, AC-US-0002-01, AC-US-0004-01, AC-US-0004-02, AC-US-0005-01, AC-US-0005-03, AC-US-0006-01, AC-US-0006-06, AC-US-0007-01, AC-US-0007-04, AC-US-0010-01, AC-US-0010-09, AC-US-0010-10, AC-US-0010-11, AC-US-0010-19, AC-US-0010-21]
---

# RULE-0001 — Validade da volta

Decide quando uma volta é válida, inválida ou segue em andamento. A decisão pertence à simulação (I2,
D-FS-05); a tela só exibe o resultado. Cada linha cita a fonte; nenhum limite nasce aqui.

## Vocabulário

| Termo | Valores |
|---|---|
| `lapValidity` | `VALID` (em andamento ou concluída), `INVALID` |
| `invalidReason` | `MISSED_MARKER`, `CUT`, `REPOSITION`, ou ausente quando `lapValidity` é `VALID` |
| `lapKind` | `OFFICIAL`, `RECON`, `TRAINING` |
| Cruzamento no sentido da pista | travessia de uma linha no sentido que o dado da pista declara como o da pista ([API-0003](../api/API-0003-dado-de-pista.md)) |
| Contramão | travessia da mesma linha no sentido oposto |

## Tabela 1 — cruzamento da linha de chegada (fase `RUNNING`)

| Sentido do cruzamento | Validade da volta antes do cruzamento | Todos os marcadores passados em ordem | `OFFICIAL` ou `RECON` | `TRAINING` | Fonte |
|---|---|---|---|---|---|
| Contramão | qualquer | qualquer | Ignorado: a volta não encerra, nenhum resultado, nenhum tempo | Ignorado: a volta não encerra e nenhuma volta começa | AC-US-0005-01, AC-US-0005-02; US-0010, caso anormal |
| Sentido da pista | `VALID` | sim | Volta concluída: `VALID`, fase `ENDED`, resultado com tempo total e quatro tempos de setor | Volta concluída: resultado `VALID`; a volta seguinte começa no mesmo instante de cruzamento, fase segue `RUNNING` | AC-US-0002-01; AC-US-0010-01 |
| Sentido da pista | `VALID` | não, ou na ordem errada | `INVALID` com `MISSED_MARKER`, fase `ENDED`, sem tempo | Resultado `INVALID` com `MISSED_MARKER`; a volta seguinte começa no mesmo instante, fase segue `RUNNING` | AC-US-0004-01, AC-US-0004-02; AC-US-0010-10 |
| Sentido da pista | `INVALID` (só existe no treino: por corte) | qualquer | Não se aplica: fora do treino a volta inválida já terminou | Resultado `INVALID` com o motivo que a volta já tinha; a volta seguinte começa no mesmo instante | AC-US-0010-09; US-0010, caso anormal |

Fora do treino, uma volta só se encerra no passo em que a chegada é cruzada no sentido da pista
(AC-US-0005-03), com uma exceção: uma volta oficial ou de reconhecimento invalidada por corte, ou uma volta
oficial invalidada por reposicionamento, termina no passo da invalidação (Tabela 2). No treino, toda volta se
encerra só no cruzamento da chegada no sentido da pista, válida ou inválida (AC-US-0010-09).

A volta seguinte do treino começa sem motivo de invalidação: `lapValidity` `VALID`, `invalidReason` ausente,
`markersPassedCount` 0, nenhum setor fechado (AC-US-0010-11).

Numa pista cujo dado não declara marcadores (dado incompleto, só treino), a condição "todos os marcadores
passados em ordem" vale com zero marcadores, pela definição de volta válida do glossário dos requisitos; a
validade dessa volta depende só do corte (Tabela 2).

## Tabela 2 — eventos que invalidam, por tipo de volta

| Evento | `OFFICIAL` | `RECON` | `TRAINING` | Fonte |
|---|---|---|---|---|
| Chegada no sentido da pista sem todos os marcadores em ordem | `INVALID`, `MISSED_MARKER`, fim no passo | Igual a `OFFICIAL` | `INVALID`, `MISSED_MARKER` no resultado da volta; a seguinte começa no mesmo instante | AC-US-0004-01; AC-US-0010-10; US-0008, caso anormal |
| Corte (ver [RULE-0004](RULE-0004-corte-e-grama.md)) | `INVALID`, `CUT`, fim no passo da invalidação | Igual a `OFFICIAL` | `INVALID`, `CUT` no passo da invalidação; a volta segue em andamento até o próximo cruzamento da chegada no sentido da pista | AC-US-0006-01, AC-US-0006-06; AC-US-0010-07, AC-US-0010-09 |
| Reposicionamento com fase `RUNNING` | `INVALID`, `REPOSITION`, fim no passo do pedido | Nenhum efeito sobre a validade, sem motivo, sem penalidade | Nenhum efeito sobre a validade: não invalida uma volta válida nem revalida uma volta já inválida; sem motivo novo, sem penalidade | AC-US-0007-01, AC-US-0007-04, AC-US-0007-05; AC-US-0010-19 |
| Chegada na contramão | Nenhum efeito | Nenhum efeito | Nenhum efeito | AC-US-0005-01; US-0008, US-0010, casos anormais |
| Saída de pista dentro dos limites de corte (grama) | Nenhum efeito sobre a validade; só a redução de velocidade | Igual | Igual | AC-US-0006-08 |
| Aceleração antes do sinal verde | Nenhum efeito | Nenhum efeito | Nenhum efeito | AC-US-0001-07 |
| Pausa, perda de foco, perda do sensor, botão de pausa | Nenhum efeito sobre a validade | Igual | Igual | AC-US-0003-09; AC-US-0010-15 |

## Tabela 3 — o que acontece depois da invalidação ou da conclusão

| Condição | Efeito | Fonte |
|---|---|---|
| Volta oficial ou de reconhecimento invalidada | Termina no passo da invalidação: nenhum tempo de volta nem de setor é acrescentado depois dele | AC-US-0004-07, AC-US-0006-06, AC-US-0007-03; `DOMAIN/DEC-06` |
| Volta de treino invalidada por corte | Fica `INVALID` com `CUT` e segue em andamento; o tempo dela continua contando até o cruzamento da chegada no sentido da pista que a encerra | AC-US-0010-07, AC-US-0010-09; `DOMAIN/DEC-12` |
| Volta oficial ou de reconhecimento com `lapValidity` `INVALID` | Não tem tempo oficial; o resultado não carrega tempo total nem tempos de setor | AC-US-0004-03 |
| Volta de treino com `lapValidity` `INVALID` encerrada na chegada | Não tem tempo oficial; o resultado carrega o tempo total da volta e, numa pista que declara setores, os quatro tempos de setor, com os setores sem tempo marcados ([API-0001](../api/API-0001-resultado-e-estado-da-volta.md), [RULE-0003](RULE-0003-cronometragem-e-interpolacao.md)) | AC-US-0010-02, AC-US-0010-23; `DOMAIN/DEC-13` |
| Volta oficial ou de reconhecimento encerrada (válida ou inválida) e novo evento (chegada, marcador, saída de pista, reposicionamento) | Ignorado: a fase é `ENDED` e o estado contém exatamente 1 resultado; nenhuma volta seguinte começa | AC-US-0002-12; AC-US-0010-21; I7 |
| Volta de treino encerrada na chegada e novo cruzamento da chegada no sentido da pista | Encerra a volta seguinte, que tem o seu próprio resultado; a volta já encerrada mantém exatamente 1 resultado | AC-US-0010-20, AC-US-0010-26; US-0002, caso anormal |
| Duas invalidações possíveis na mesma volta | Vale a primeira na ordem dos passos. Fora do treino a volta já terminou nela. No treino, a volta inválida por corte que depois pula um marcador ou corta de novo mantém o motivo `CUT` até a chegada; o resultado carrega só esse motivo | `DOMAIN/DEC-06`; US-0006, caso anormal; US-0010, caso anormal |
| Passagem por marcador antes do marcador anterior, ou na contramão | Não conta; `markersPassedCount` não avança nem recua | AC-US-0005-04; AC-US-0004-02 |
| Marcador retomado depois de pulado, na ordem e no sentido da pista | Conta | US-0004, caso anormal |

## Contador de marcadores

`markersPassedCount` é um inteiro de 0 ao total de marcadores declarados na pista. A travessia, no sentido da
pista, do marcador de índice `markersPassedCount` + 1 aumenta o contador de 1. Qualquer outra travessia de
marcador (contramão, ou marcador que não é o próximo) deixa o contador como está. A idempotência é natural:
atravessar de novo um marcador já contado não muda o contador. O contador sobrevive à pausa. No treino, ele
volta a 0 no início de cada volta, que é o instante de cruzamento da chegada que encerrou a anterior.

## Idempotência e ordem

| Transição | Idempotente sob repetição | Carrega contador de sequência |
|---|---|---|
| Conclusão da volta oficial ou de reconhecimento | Sim: o segundo cruzamento é ignorado (fase `ENDED`) | `stepCount` do passo de encerramento |
| Conclusão de uma volta do treino e início da seguinte | Sim: cada cruzamento é avaliado uma única vez e encerra no máximo 1 volta | `stepCount` do passo do cruzamento; `lapSequenceCount` da volta encerrada |
| Invalidação | Sim: a segunda invalidação da mesma volta é ignorada (fora do treino, fase `ENDED`; no treino, `lapValidity` já `INVALID`) | `stepCount` do passo da invalidação |
| Passagem por marcador | Sim: não aumenta o contador duas vezes | `stepCount` do passo da travessia |

A fonte do estado da volta no resto do conjunto é [RULE-0002](RULE-0002-estados-da-volta.md).
