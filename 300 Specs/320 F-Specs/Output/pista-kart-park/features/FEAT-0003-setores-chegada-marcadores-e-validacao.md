---
id: FEAT-0003
title: Setores, chegada, marcadores e validação da volta na Kart Park
feature: pista-kart-park
stage: fspec
status: validated
version: 2.0.0
sources: [US-0003, AC-US-0003-01, AC-US-0003-02, AC-US-0003-03, AC-US-0003-04, AC-US-0003-05, AC-US-0003-06, AC-US-0003-07, AC-US-0003-08, AC-US-0003-10, AC-US-0003-11, AC-US-0003-12]
---

# FEAT-0003 — Setores, chegada, marcadores e validação da volta na Kart Park

## Resumo

O arquivo de pista gerado dá à Kart Park o que o arquivo da réplica não traz: a chegada na linha de
largada, três limites de setor em retas da réplica, perto de 204,9 m, 354,9 m e 534,7 m (quatro setores,
RF09), e marcadores de percurso a no máximo 25 m um do outro. Com eles, a volta na Kart Park é validada
pelas regras de `race-lap-validation`, sem nenhuma mudança: volta que pula marcador é inválida com o motivo
"marcador pulado" (RF10), o corte usa os limites padrão de 3 m e 1000 ms, e o atalho pela grama com mais de
6 m de grama entre as bordas é invalidado pelos marcadores, sem barreira (`DOMAIN/DEC-10`).

## Canais

`web-desktop` e `web-mobile`: os mesmos setores, os mesmos marcadores, as mesmas regras de validade e de
corte e o mesmo motivo exibido, nos textos de `race-lap-validation`. Em `web-mobile`, sem sensor ou com
permissão negada, o controle recai para toque com estado visível; as regras da volta não mudam (I4).

## Requisitos

- REQ-FEAT-0003-01: O arquivo de pista gerado SHALL declarar exatamente 3 `sectorLimits`, que com a
  chegada definem 4 setores (AC-US-0003-01).
- REQ-FEAT-0003-02: O arquivo de pista gerado SHALL declarar, em ordem, cada limite de setor como a linha
  transversal no ponto da `centerline` cuja distância de volta, medida a partir do ponto 0, é a mais
  próxima de 204,9 m, de 354,9 m e de 534,7 m (AC-US-0003-02).
- REQ-FEAT-0003-03: O arquivo de pista gerado SHALL declarar a `finishLine` como a linha transversal no
  ponto 0, a mesma da largada (AC-US-0003-03).
- REQ-FEAT-0003-04: O arquivo de pista gerado SHALL declarar cada marcador de percurso como a linha
  transversal num ponto da linha central, em ordem de distância de volta, nenhum no ponto 0 nem num ponto
  de limite de setor (AC-US-0003-04; contrato de dado de pista de `race-lap-validation`: marcadores
  distintos dos limites de setor).
- REQ-FEAT-0003-05: O arquivo de pista gerado SHALL ter no máximo 25 m de distância de volta entre dois
  marcadores consecutivos, inclusive do último marcador, passando pelo ponto 0, ao primeiro
  (AC-US-0003-04).
- REQ-FEAT-0003-06: O arquivo de pista gerado SHALL estender cada linha transversal ao longo da normal do
  seu ponto, de uma borda da pista à outra e mais `cutDistanceM` além de cada borda, parando antes de uma
  barreira ou da pista de outra parte da volta, de modo que um atalho pela grama mais largo que essa
  extensão pula ao menos um marcador (AC-US-0003-05, AC-US-0003-10; `DOMAIN/DEC-10`;
  [RULE-0002](../rules/RULE-0002-geometria-e-verificacoes-do-arquivo-de-pista.md)).
- REQ-FEAT-0003-07: O arquivo de pista gerado SHALL NOT declarar `cutDistanceM` nem `cutDurationMs`, de
  modo que valem os limites padrão de 3 m e 1000 ms (AC-US-0003-07, AC-US-0003-08).
- REQ-FEAT-0003-08: O sistema SHALL, na Kart Park, ter no estado da simulação `lapValidity` `INVALID` com
  `invalidReason` `MISSED_MARKER` para uma volta em que o kart pula um marcador de percurso
  (AC-US-0003-05).
- REQ-FEAT-0003-09: O sistema SHALL exibir, na Kart Park, o motivo "marcador pulado" quando a volta é
  invalidada por marcador pulado (AC-US-0003-06).
- REQ-FEAT-0003-10: O sistema SHALL, na Kart Park, invalidar por corte (`CUT`) no estado da simulação a
  volta em que o kart fica mais de 3 m além da borda da pista por mais de 1000 ms de tempo simulado
  contínuo (AC-US-0003-07).
- REQ-FEAT-0003-11: O sistema SHALL NOT, na Kart Park, invalidar por corte a volta em que o kart fica mais
  de 3 m além da borda da pista por 1000 ms ou menos de tempo simulado contínuo (AC-US-0003-08).
- REQ-FEAT-0003-12: Retirado na rodada 5, com o critério que realizava (AC-US-0003-09, atalho pela grama
  por dentro da curva 4, retirado dos requisitos na revisão 3). O atalho pela grama com mais de 6 m de grama
  continua coberto pelos requisitos 05, 06 e 08. O id não é reaproveitado.
- REQ-FEAT-0003-13: O sistema SHALL, na Kart Park, terminar com `lapValidity` `VALID` a volta que passa por
  todos os marcadores de percurso em ordem, no sentido da pista, e cruza a chegada sem corte
  (AC-US-0003-10).
- REQ-FEAT-0003-14: O sistema SHALL exibir, ao fim de uma volta válida na Kart Park, a tela de resultado
  com o tempo total e os 4 tempos de setor, como ao fim de uma volta válida na pista sintética
  (AC-US-0003-11).
- REQ-FEAT-0003-15: O sistema SHALL aplicar na Kart Park, sem mudança, as regras de `race-lap-validation`
  para chegada cruzada de novo, chegada na contramão, pausa, perda de foco e recarga da página durante a
  volta (AC-US-0003-10, AC-US-0003-11: a volta na Kart Park termina e é apresentada como na pista
  sintética; US-0003, caso anormal "Cruzar a chegada de novo...", que liga esses casos às mesmas regras;
  `SEED/US-3`: "validada como na pista sintética").
- REQ-FEAT-0003-16: O arquivo de pista gerado SHALL ter cada um dos três limites internos de setor num ponto
  cuja distância de volta fica dentro de um elemento do tipo reta do arquivo da réplica: entre o início
  (`de_m`) e o fim (`de_m` + `comprimento_m`) desse elemento, inclusive, lidos na `centerline` a partir do
  ponto 0 (AC-US-0003-12; [RULE-0002](../rules/RULE-0002-geometria-e-verificacoes-do-arquivo-de-pista.md)).

## Comportamento

Linhas da volta: [API-0001](../api/API-0001-dado-de-pista-com-geometria-zebras-e-barreiras.md) (`finishLine`,
`sectorLimits`, `markers`, formas de `race-lap-validation`), [RULE-0002](../rules/RULE-0002-geometria-e-verificacoes-do-arquivo-de-pista.md)
(posição e extensão de cada linha). Passo e corte: [FLOW-0002](../flows/FLOW-0002-passo-de-simulacao-na-kart-park.md),
[RULE-0001](../rules/RULE-0001-superficie-borda-da-pista-e-obstaculos.md) (borda da pista). Validade, motivo,
tempos e resultado: regras e telas de `race-lap-validation`, sem mudança. A tela de resultado do requisito 14 é,
para a volta de treino, a única desta feature, o painel "Resultado da volta do treino" da tela de corrida de `race-lap-validation`, sem parar o jogo
([SCR-0002](../screens/SCR-0002-credito-na-tela-de-resultado.md)).

| Situação | Comportamento |
|---|---|
| Volta completa sobre a pista, passando por todos os marcadores em ordem | `VALID`; tempo total e 4 tempos de setor no painel do resultado da volta do treino |
| Atalho pela grama com mais de 6 m de grama entre as bordas | Sem barreira; o kart, a mais de `cutDistanceM` da borda da pista, não cruza ao menos um marcador; a volta é `INVALID` com `MISSED_MARKER` ao cruzar a chegada |
| Atalho pelos trechos quase encostados (≈ 369–406 m contra ≈ 595–624 m) | Impedido pela barreira ([FEAT-0004](FEAT-0004-barreira-nos-trechos-quase-encostados.md)) |
| Kart a mais de 3 m da borda da pista por mais de 1000 ms | Corte: `INVALID` com `CUT` no passo; no treino a volta é invalidada sem ser encerrada e o kart segue, pelas regras de treino de `race-lap-validation` |
| Kart a mais de 3 m da borda por 1000 ms ou menos e de volta | Sem corte; se nesse intervalo ele não cruzou um marcador, a volta é invalidada por marcador pulado ao cruzar a chegada |
| Rodas sobre a zebra | Pista: não acumulam tempo para o corte ([FEAT-0005](FEAT-0005-zebra-com-efeito.md)) |
| Chegada cruzada de novo, contramão, pausa, perda de foco, recarga | Regras de `race-lap-validation`; nenhuma cria registro de desafio diário ([FEAT-0001](FEAT-0001-seletor-de-pista-no-treino.md)) |
| Troca de pista no meio da volta | A volta é descartada; o kart vai para a largada da pista escolhida ([FEAT-0001](FEAT-0001-seletor-de-pista-no-treino.md)) |
| Sensor ausente ou permissão negada (`web-mobile`) | Toque com estado visível; regras inalteradas |
| Rede indisponível | Sem efeito (D-FS-08) |

## Estado

Não define estados próprios. Lê o modelo de estados da volta de `race-lap-validation` (`lapPhase`,
`lapValidity`, `invalidReason`, `markersPassedCount`, `completedSectorMs`, `stepCount`), sem mudança: a
Kart Park só entrega as linhas que esse modelo usa. A distância além da borda que alimenta o corte é
`beyondTrackEdgeM` ([API-0003](../api/API-0003-contato-do-kart-com-a-pista.md)), calculada a cada passo de
`STEP`.

## Configuração

Nenhuma. Os limites de corte são os padrão de `race-lap-validation`, porque o arquivo da Kart Park não os
declara; nenhuma configuração do jogo os altera.

## Critérios de aceite

- O arquivo gerado tem 3 `sectorLimits`; cada um é a linha transversal no ponto da `centerline` mais
  próximo, em distância de volta, de 204,9 m, 354,9 m e 534,7 m (satisfaz AC-US-0003-01, AC-US-0003-02;
  cobre os requisitos 01 e 02).
- A distância de volta do ponto de cada limite interno de setor fica entre o início e o fim de um elemento
  do tipo reta do arquivo da réplica (satisfaz AC-US-0003-12; cobre o requisito 16).
- A `finishLine` é a linha transversal no ponto 0 (satisfaz AC-US-0003-03; cobre o requisito 03).
- Nenhum par de marcadores consecutivos, inclusive o último e o primeiro, está a mais de 25 m de distância
  de volta; nenhum marcador está no ponto 0 nem num limite de setor; cada linha cobre a pista e
  `cutDistanceM` além de cada borda, salvo onde para antes de barreira ou de outra parte da pista (satisfaz
  AC-US-0003-04; cobre os requisitos 04, 05 e 06).
- Uma sequência de `Input` que leva o kart a pular um marcador, inclusive por um atalho pela grama com
  mais de 6 m de grama entre as bordas, termina `INVALID` com `MISSED_MARKER`, e a tela exibe "marcador
  pulado" (satisfaz AC-US-0003-05, AC-US-0003-06; cobre os requisitos 06, 08 e 09).
- Com o kart mantido a mais de 3 m da borda da pista: por mais de 1000 ms de tempo simulado contínuo,
  `INVALID` com `CUT` no passo em que a duração passa de 1000 ms; por 1000 ms ou menos e de volta à
  distância de 3 m ou menos, sem corte (satisfaz AC-US-0003-07, AC-US-0003-08; cobre os requisitos 07, 10
  e 11).
- Uma volta pela pista, sem corte, passa por todos os marcadores e termina `VALID`, e o painel do resultado da
  volta do treino exibe o tempo total e os 4 tempos de setor em `m:ss.mmm`, como na pista sintética (satisfaz
  AC-US-0003-10, AC-US-0003-11; cobre os requisitos 13 e 14).
- Os casos de chegada cruzada de novo, contramão, pausa, perda de foco e recarga dão na Kart Park o mesmo
  resultado que na pista sintética (satisfaz AC-US-0003-10, AC-US-0003-11 nesses casos anormais; cobre o
  requisito 15).

## Pontos em aberto

Nenhum.
