---
id: US-0001
title: Escolha da pista no treino
feature: pista-kart-park
stage: req
status: validated
version: 1.1.0
sources: [SEED/US-1, SEED/RD-07, SEED/RD-09, SEED/IM-I1, SEED/IM-I3I5, SEED/RE-01, SEED/RE-07, SEED/FE-09, DOMAIN/DEC-01, DOMAIN/DEC-06, DOMAIN/DEC-13]
---

# US-0001 — Escolha da pista no treino

## História

Como Jogador, quero escolher a pista do treino, para pilotar numa pista real.

## Canais

- `web-desktop` e `web-mobile`: o mesmo seletor, as mesmas duas opções, a mesma pista selecionada na
  abertura do jogo e o mesmo efeito da troca de pista. Nenhuma diferença de comportamento entre os
  canais.
- `web-desktop`: o Jogador escolhe a pista e pilota com o teclado; `web-mobile`: com toque, e pilota com
  inclinação e toque (`SEED.md`, Atores e canais).
- `web-mobile`: com sensor de inclinação ausente ou permissão negada, o controle recai para toque com
  estado visível na tela (I4, `[DOMAIN]`); o seletor e a pista escolhida não mudam.

## Pré-condições

- O jogo está aberto na tela inicial.
- Para a troca de pista: um treino está carregado numa das duas pistas, e o Jogador volta ao seletor e
  escolhe a outra.

## Critérios de aceite

- AC-US-0001-01: Na tela inicial, o seletor de pista oferece duas opções: a Kart Park e a pista
  sintética (`DOMAIN/DEC-01`).
- AC-US-0001-02: Ao abrir o jogo, a opção selecionada no seletor da tela inicial é a Kart Park
  (`DOMAIN/DEC-06`).
- AC-US-0001-03: Com a Kart Park escolhida no seletor, o estado da simulação do treino iniciado tem o
  `trackId` da Kart Park.
- AC-US-0001-04: Com a pista sintética escolhida no seletor, o estado da simulação do treino iniciado tem
  o `trackId` da pista sintética (`DOMAIN/DEC-06`).
- AC-US-0001-05: Depois de uma volta concluída numa pista escolhida no seletor, qualquer que seja ela, o
  dado persistido no navegador não contém nenhum registro de desafio diário (tentativa ou resultado) que
  não existisse antes da volta (I1, `SEED/RD-09`).
- AC-US-0001-06: Depois de trocar de pista no seletor, o estado da simulação tem o kart na posição de
  largada da pista escolhida.
- AC-US-0001-07: Depois de trocar de pista no seletor, o estado da simulação não tem volta em andamento.
- AC-US-0001-08: Com a Kart Park escolhida no seletor, o estado da simulação do treino iniciado tem o
  `trackVersion` 2 da Kart Park, a réplica não oficial (`SEED/US-1`, `DOMAIN/DEC-13`).
- AC-US-0001-09: Nenhuma opção do seletor de pista inicia um treino com o `trackVersion` 1 da Kart Park
  (`SEED/US-1`, `SEED/FE-09`).

## Casos anormais

- **Troca de pista com uma volta de treino em andamento**: a volta em andamento não continua na pista
  nova; o kart fica na largada da pista escolhida, sem volta em andamento (critérios 06 e 07). Como o
  seletor é só de treino, nenhum registro de desafio diário é criado nem alterado (critério 05).
- **Recarregar ou abandonar a página e abrir o jogo de novo**: o jogo abre com a Kart Park selecionada
  (critério 02), qualquer que tenha sido a pista escolhida antes; uma volta de treino em andamento não
  continua e não cria registro de desafio diário (critério 05).
- **Perder o foco da aba durante o treino**: a pista escolhida não muda; a volta segue as mesmas regras
  que na pista sintética (US-0003) e não cria registro de desafio diário (critério 05).
- **Desafio diário ainda inexistente**: o seletor é só de treino até ele existir (`DOMAIN/DEC-06`); a
  pista de cada desafio diário é decidida pela feature do desafio, não por este seletor (I1,
  `SEED/IM-I1`).
- **Versão 1 da Kart Park ainda presente no repositório**: o arquivo dela continua publicado e inalterado
  (NFR-0014), mas não é oferecido no seletor nem carregado pelo treino (critérios 08 e 09).
- **Sensor de inclinação ausente ou permissão negada (`web-mobile`)**: o controle recai para toque com
  estado visível (I4); o seletor, a pista escolhida e a posição de largada não mudam.

## Fontes

- `SEED/US-1` — história e seus cinco critérios, entre eles o da versão 2 no seletor (revisão 3).
- `SEED/RD-09` — seletor só de treino (I1, RF14).
- `SEED/IM-I1` — a pista de cada desafio diário é da feature do desafio.
- `SEED/RD-07`, `SEED/IM-I3I5`, `SEED/RE-07` — a revisão 3 publica `kart-park` versão 2; a versão 1
  não muda.
- `SEED/FE-09` — escolher a versão 1 da Kart Park no jogo está fora do escopo.
- `SEED/RE-01` — a pista sintética continua existindo como pista dos ensaios, por isso continua
  selecionável.
- `DOMAIN/DEC-01` — a Kart Park entra ao lado da pista sintética, com seletor.
- `DOMAIN/DEC-06` — só treino; o jogo abre na Kart Park; a sintética fica selecionável.
- `DOMAIN/DEC-13` — a réplica não oficial substitui o traçado da versão 1 no seletor, como versão 2.

## Pontos em aberto

Nenhum — `DOMAIN/DEC-01`, `DOMAIN/DEC-06` e `DOMAIN/DEC-13` fixam as opções do seletor, a versão
oferecida, a pista da abertura e o modo treino.
