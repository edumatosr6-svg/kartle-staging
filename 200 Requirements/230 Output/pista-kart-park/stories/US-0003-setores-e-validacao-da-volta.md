---
id: US-0003
title: Setores e validação da volta
feature: pista-kart-park
stage: req
status: validated
version: 2.0.0
sources: [SEED/US-3, SEED/MED, SEED/RD-05, SEED/RD-06, SEED/RD-10, SEED/RI-03, DOMAIN/DEC-10, DOMAIN/DEC-13]
---

# US-0003 — Setores e validação da volta

## História

Como Jogador, quero que uma volta na Kart Park tenha setores e seja validada como na pista sintética,
para que meu tempo de treino seja comparável entre voltas.

## Canais

- `web-desktop` e `web-mobile`: os mesmos setores, os mesmos marcadores, as mesmas regras de validade e
  de corte e o mesmo motivo exibido. Nenhuma diferença de comportamento entre os canais.
- `web-mobile`: com sensor de inclinação ausente ou permissão negada, o controle recai para toque com
  estado visível na tela (I4, `[DOMAIN]`); as regras da volta não mudam.

## Pré-condições

- O arquivo de pista da Kart Park versão 2 foi gerado offline com chegada, limites de setor e marcadores
  de percurso (o arquivo da réplica não os traz, `SEED.md` Contexto).
- Para os critérios observados na simulação ou na tela: a Kart Park está escolhida no seletor e uma
  volta de treino está em andamento.

## Critérios de aceite

- AC-US-0003-01: No arquivo de pista gerado, a volta da Kart Park tem 4 setores (RF09).
- AC-US-0003-02: No arquivo de pista gerado, os três limites internos de setor ficam nos pontos da linha
  central cuja distância de volta, medida a partir do ponto 0, é a mais próxima de 204,9 m, de 354,9 m e
  de 534,7 m (`SEED/US-3`).
- AC-US-0003-03: No arquivo de pista gerado, a linha de chegada é a linha de largada, no ponto 0.
- AC-US-0003-04: No arquivo de pista gerado, a distância de volta entre dois marcadores de percurso
  consecutivos é de no máximo 25 m, inclusive entre o último marcador da volta e o primeiro.
- AC-US-0003-05: Na Kart Park, uma volta em que o kart pula um marcador de percurso é inválida no estado
  da simulação (RF10).
- AC-US-0003-06: Na Kart Park, quando uma volta é invalidada por marcador pulado, a tela exibe o motivo
  "marcador pulado".
- AC-US-0003-07: Na Kart Park, uma volta em que o kart fica mais de 3 m além da borda da pista por mais
  de 1000 ms é invalidada por corte no estado da simulação (limites padrão de `race-lap-validation`,
  citados por `SEED/US-3`).
- AC-US-0003-08: Na Kart Park, ficar mais de 3 m além da borda da pista por 1000 ms ou menos não
  invalida a volta por corte no estado da simulação.
- AC-US-0003-10: Na Kart Park, uma volta que passa por todos os marcadores de percurso em ordem e cruza
  a chegada sem corte termina válida no estado da simulação.
- AC-US-0003-11: Na Kart Park, ao fim de uma volta válida, a tela de resultado exibe o tempo total e os
  4 tempos de setor, como ao fim de uma volta válida na pista sintética.
- AC-US-0003-12: No arquivo de pista gerado, cada um dos três limites internos de setor fica dentro de
  um elemento do tipo reta do arquivo da réplica (`SEED/US-3`: limites em retas).

## Casos anormais

- **Atalho pela grama com mais de 6 m de grama entre as bordas**: não tem barreira (US-0004,
  `DOMAIN/DEC-10`); a volta que o usa pula ao menos um marcador e é inválida (critérios 04 e 05).
- **Atalho pelos trechos quase encostados** (≈ 369–406 m contra ≈ 595–624 m): impedido pela barreira
  (US-0004).
- **Rodas sobre a zebra**: contam como pista e não acumulam tempo para o corte (US-0005).
- **Cruzar a chegada de novo depois de concluir a volta, cruzar na contramão, pausar, perder o foco da
  aba ou recarregar a página durante a volta**: a volta segue as mesmas regras que na pista sintética
  (`race-lap-validation`), porque é "validada como na pista sintética" (`SEED/US-3`). Como o seletor é
  só de treino, nenhum desses casos cria registro de desafio diário (US-0001).
- **Troca de pista no meio da volta**: a volta não continua; o kart vai para a largada da pista
  escolhida, sem volta em andamento (US-0001).
- **Sensor de inclinação ausente ou permissão negada (`web-mobile`)**: o controle recai para toque com
  estado visível (I4); as regras da volta não mudam.

## Fontes

- `SEED/US-3` — história e seus quatro critérios (limites de setor da revisão 3).
- `SEED/MED` — a réplica, com seus elementos (retas e arcos), de onde se leem as retas dos limites.
- `SEED/RD-05` — largada, 4 setores e chegada (RF09).
- `SEED/RD-06` — volta que pula marcador é inválida (RF10, `race-lap-validation`).
- `SEED/RD-10`, `DOMAIN/DEC-13` — traçado da réplica não oficial, de retas e arcos.
- `SEED/RI-03`, `DOMAIN/DEC-10` — os marcadores a cada 25 m bastam para os atalhos pela grama.

## Pontos em aberto

Nenhum — `DOMAIN/DEC-10` fecha a questão dos atalhos pela grama, e os limites de corte são os padrão
citados pelo seed.
