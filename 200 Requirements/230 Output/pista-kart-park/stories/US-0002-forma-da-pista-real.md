---
id: US-0002
title: Forma da pista real, desenhada como kartódromo
feature: pista-kart-park
stage: req
status: validated
version: 2.0.0
sources: [SEED/US-2, SEED/MED, SEED/RD-01, SEED/RD-02, SEED/RD-03, SEED/RD-10, SEED/RE-03, SEED/IM-I2, SEED/IM-I3I5, SEED/IM-I10, SEED/RI-02, SEED/FE-08, DOMAIN/DEC-09, DOMAIN/DEC-13]
---

# US-0002 — Forma da pista real, desenhada como kartódromo

## História

Como Jogador, quero que a Kart Park tenha a forma da pista real desenhada como um kartódromo, para
reconhecer o traçado e ver as curvas e retas limpas.

## Canais

- `web-desktop` e `web-mobile`: a mesma geometria, a mesma largura e o mesmo sentido. A forma da pista é
  dado lido pela simulação (I2, `SEED/IM-I2`) e não depende do canal. Nenhuma diferença de comportamento
  entre os canais.
- `web-mobile`: com sensor de inclinação ausente ou permissão negada, o controle recai para toque com
  estado visível na tela (I4, `[DOMAIN]`); a pista não muda.

## Pré-condições

- O arquivo de pista da Kart Park versão 2 foi gerado offline pelo Curador do catálogo a partir do
  arquivo da réplica (`replica/kart-park-replica.json`, formato `kartle-pista`, `SEED.md` Contexto), com
  os eixos do jogo (`SEED/RE-03`).
- Para os critérios observados na simulação: a Kart Park está escolhida no seletor e o treino foi
  iniciado.

## Critérios de aceite

- AC-US-0002-01: No arquivo de pista gerado, a linha central é fechada: a volta termina no ponto 0, onde
  começa (`SEED/MED`, RF02).
- AC-US-0002-02: No arquivo de pista gerado, o comprimento da volta fechada da linha central está entre
  683,793 m e 697,607 m (690,7 m ± 1 %, `SEED/US-2`).
- AC-US-0002-03: No arquivo de pista gerado, a linha de largada está no ponto 0 da linha central.
- AC-US-0002-04: No arquivo de pista gerado, a linha central percorrida no sentido de corrida e expressa
  nos eixos do jogo (leste = +x, norte = −z) gira no sentido anti-horário visto de cima (`SEED/RE-03`:
  com outro mapeamento, o circuito fica espelhado).
- AC-US-0002-05: No arquivo de pista gerado, a largura do asfalto é 7,0 m em todo ponto da volta
  (`SEED/US-2`, `SEED/RD-03`).
- AC-US-0002-06: No estado da simulação com a Kart Park carregada, cada ponto da linha central fica a no
  máximo 0,10 m da linha central do arquivo da réplica, expressa nos eixos do jogo (leste = +x,
  norte = −z) (`SEED/US-2`).
- AC-US-0002-07: No arquivo de pista gerado, na curva mais fechada da volta (raio 8,8 m, perto de 216 m
  de volta), as duas bordas do asfalto não se cruzam: nenhuma delas cruza a si mesma nem a outra.
- AC-US-0002-08: No estado da simulação com a Kart Park carregada, a linha central e as larguras do
  asfalto são as do arquivo de pista gerado, sem nova suavização nem conversão ao carregar (`SEED/RD-02`,
  `SEED/IM-I10`: preparo offline).

## Casos anormais

- **Preparo que suaviza de novo a linha da réplica, ou que afasta algum ponto mais de 0,10 m dela**: o
  arquivo reprova no critério 06 e não atende a esta história; a correção é feita no preparo offline,
  nunca no jogo em execução (I10, `SEED/RD-02`).
- **Comprimento fora de 683,793–697,607 m, largura diferente de 7,0 m em algum ponto ou bordas que se
  cruzam na curva de raio 8,8 m**: o arquivo reprova nos critérios 02, 05 ou 07.
- **Conversão com outro mapeamento de eixos**: o circuito fica espelhado e gira no sentido horário; o
  arquivo reprova nos critérios 04 e 06 (`SEED/RE-03`).
- **Mudança da linha central depois de publicada a versão 2** (corrigir um elemento, uma largura): é
  publicada como versão nova, nunca como edição da versão 2 (NFR-0006, `SEED/IM-I3I5`).
- **Diferença para o traçado oficial de 750 m** (a réplica é 7,9 % mais curta, `SEED/MED`): aceita e
  informada ao Jogador pelo nome "réplica não oficial" (US-0006, `DOMAIN/DEC-13`); aproximar o traçado
  dos 750 m está fora do escopo (`SEED/FE-08`), e o comprimento exigido continua 690,7 m ± 1 %
  (critério 02).
- **Regra geral de largura (largura do OSM quando houver, senão 8 m)**: não se aplica à Kart Park; a
  largura fixa de 7 m da réplica é um desvio aceito (`SEED/RD-03`).
- **Sensor de inclinação ausente ou permissão negada (`web-mobile`)**: o controle recai para toque com
  estado visível (I4); a geometria da pista não muda.

## Fontes

- `SEED/US-2` — história e seus quatro critérios (revisão 3).
- `SEED/MED` — comprimento, pontos, sentido, largada, largura e curva mais fechada medidos na réplica.
- `SEED/RD-01` — circuito fechado de 400 a 1500 m (RF02); 690,7 m ± 1 % está nessa faixa.
- `SEED/RD-02` — pista em metros, no sentido de corrida, preparada offline (RF03, RF06, I10).
- `SEED/RD-03` — largura fixa de 7 m da réplica, desvio aceito (RF04).
- `SEED/RD-10` — traçado da réplica não oficial, feito de retas e arcos.
- `SEED/RE-03` — conversão offline com os eixos do jogo.
- `SEED/IM-I2` — a geometria e a largura entram na simulação como dado.
- `SEED/IM-I3I5` — a réplica é publicada como versão 2.
- `SEED/IM-I10` — nenhum editor de pista no jogo.
- `SEED/RI-02`, `DOMAIN/DEC-09` — a tolerância de suavização de 0,30 m foi fechada; a revisão 3 não suaviza mais, e a
  regra que vale é a de 0,10 m (critério 06).
- `SEED/FE-08` — aproximar o traçado dos 750 m oficiais está fora do escopo.
- `DOMAIN/DEC-13` — réplica não oficial aprovada: retas e arcos, transições de 5 m, largura fixa de 7 m.

## Pontos em aberto

Nenhum — `SEED/US-2` e `DOMAIN/DEC-13` fixam o traçado, a largura e a tolerância.
