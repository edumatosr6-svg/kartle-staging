---
id: US-0007
title: Reposicionar invalida a volta oficial
feature: race-lap-validation
stage: req
status: validated
version: 2.1.2
sources: [SEED/US-7, SEED/US-10, SEED/RD-10, DOMAIN/DEC-02, DOMAIN/DEC-06, DOMAIN/DEC-08]
---

# US-0007 — Reposicionar invalida a volta oficial

## História

Como Jogador, quero saber que reposicionar o kart numa volta oficial a invalida, para decidir
conscientemente.

## Canais

- `web-desktop`: o reposicionamento é acionado pelo teclado (RF12).
- `web-mobile`: o reposicionamento é acionado por toque.
- A regra e o motivo exibido são os mesmos nos dois canais; só a entrada difere.
- `web-mobile`: com sensor de inclinação ausente ou permissão negada, o controle recai para toque com
  estado visível (I4, `[DOMAIN]`); a regra desta história não muda.

## Pré-condições

- O sinal verde foi dado e a volta está em andamento.
- A volta foi iniciada como oficial, de reconhecimento ou de treino; quem define o tipo é o desafio
  diário, fora do escopo.

## Critérios de aceite

- AC-US-0007-01: Em volta oficial, reposicionar o kart torna a volta inválida no estado da simulação
  (D08, `DOMAIN/DEC-02`).
- AC-US-0007-02: Em volta oficial, ao reposicionar, a tela exibe o motivo "reposicionamento".
- AC-US-0007-03: No estado da simulação, a volta oficial invalidada por reposicionamento termina no passo
  do reposicionamento: nenhum tempo de volta é acrescentado depois desse passo (`DOMAIN/DEC-06`).
- AC-US-0007-04: Em volta de reconhecimento ou de treino sem motivo de invalidação, reposicionar não torna
  a volta inválida: a tela continua exibindo o estado "válida em andamento" (`DOMAIN/DEC-02`).
- AC-US-0007-05: Em volta de reconhecimento ou de treino, reposicionar não exibe o motivo
  "reposicionamento" na tela (`SEED/US-7`, "não exibe motivo"; `DOMAIN/DEC-02`).
- AC-US-0007-06: No estado da simulação, numa volta de reconhecimento ou de treino, o tempo da volta após
  um reposicionamento é o tempo de simulação decorrido desde o início da volta, sem acréscimo de
  penalidade: N × `STEP` após N passos de `STEP` contados do sinal verde, numa volta iniciada nele; a
  diferença entre o instante de simulação e o instante de cruzamento da chegada que a iniciou, nas voltas
  seguintes do treino (`DOMAIN/DEC-02`, "sem penalidade"; US-0010).

## Casos anormais

- **Reposicionamentos repetidos na mesma volta oficial**: a volta já terminou no primeiro
  (critério 03); o motivo exibido é "reposicionamento".
- **Reposicionamentos repetidos em reconhecimento ou treino**: nenhum deles invalida nem penaliza
  (critérios 04 a 06).
- **Reposicionamento nas voltas seguidas do treino**: livre em qualquer volta da sequência e não
  interrompe a sequência (US-0010, critérios 14 e 19; `SEED/US-7`, "em treino, reposicionar não
  invalida").
- **Reposicionamento numa volta de treino já inválida por corte**: a volta segue inválida com o motivo
  "corte"; reposicionar não a revalida nem acrescenta o motivo "reposicionamento" (critério 05; US-0010,
  critério 19). Numa volta de reconhecimento, a volta inválida por corte já terminou no passo da
  invalidação (`DOMAIN/DEC-06`).
- **Pausa, perda de foco ou perda do sensor durante a volta**: simulação e cronômetro ficam suspensos;
  pausar não é reposicionar e não invalida a volta (`DOMAIN/DEC-08`).
- **Recarregar ou abandonar a página antes da chegada**: a volta não é concluída e não produz resultado
  (`SEED/RD-05`).

## Fontes

- `SEED/US-7` — história e seus dois critérios.
- `SEED/RD-10` — reposicionamento (D08).
- `DOMAIN/DEC-02` — confirmação de D08: invalida a volta oficial; livre e sem penalidade em reconhecimento
  e treino.
- `DOMAIN/DEC-06` — volta invalidada termina imediatamente.
- `DOMAIN/DEC-08` — pausa durante a volta.
- `SEED/US-10` — voltas seguidas no treino, nas quais reposicionar segue livre (`SEED/US-7`).

## Pontos em aberto

Nenhum — a regra de reposicionamento, o fim da volta invalidada e a pausa estão decididos em `DOMAIN.md`
de 2026-10-20.
