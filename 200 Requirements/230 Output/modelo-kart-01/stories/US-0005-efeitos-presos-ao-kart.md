---
id: US-0005
title: Efeitos continuam presos ao kart
feature: modelo-kart-01
stage: req
status: validated
version: 2.0.1
sources: [SEED/US-5, SEED/RE-03, SEED/RD-01, DOMAIN/DEC-02, DOMAIN/DEC-06, DOMAIN/DEC-07]
---

# US-0005 — Efeitos continuam presos ao kart

## História

Como Jogador, quero que os efeitos que já existem continuem presos ao kart, para ver as marcas de pneu
saírem do Kart 01 que estou pilotando, sem efeitos de drift ou de turbo, que saíram do jogo.

## Canais

- `web-desktop` e `web-mobile`: as mesmas marcas de pneu, nas mesmas posições do Kart 01, e a mesma
  ausência de indicação de drift e de fumaça ou chama de turbo, em paisagem e em retrato. Nenhuma diferença
  entre os canais.
- `web-mobile` com sensor ausente ou permissão negada: o controle recai para toque com estado visível (I4);
  os efeitos não mudam.

## Pré-condições

- Kart 01 em cena (US-0001), em corrida; para os critérios 04 e 05, também antes da largada.
- As situações em que o jogo já desenha marcas de pneu não mudam: esta feature muda onde a marca aparece,
  não quando (`SEED/RD-01`).
- O drift e o turbo já saíram do jogo (`dirigibilidade` revisão 4; `SEED/US-5`, segundo critério;
  `DOMAIN/DEC-07`); esta feature não os retira nem os recoloca, e garante só que o Kart 01 não exibe os
  efeitos deles.
- As posições das rodas que a simulação usa para marcas de pneu e telemetria continuam vindo de
  `wheelPositions` (`SEED/RE-03`, NFR-0007).

## Critérios de aceite

- AC-US-0005-01: Em corrida, sempre que o jogo desenha marcas de pneu, cada trecho novo de marca aparece na
  tela no chão sob o pneu traseiro do Kart 01 exibido, do lado correspondente (esquerdo ou direito)
  (`SEED/US-5`, primeiro critério).
- Critérios 02 e 03 desta história (fumaça do escapamento e indicação de drift exibidas nas posições do
  Kart 01): retirados em 2026-10-29 pelo seed `revision: 2` (`SEED/US-5`, segundo critério) e por
  `DOMAIN/DEC-07`, porque o drift e o turbo saíram do jogo e esses efeitos deixaram de existir. Os números
  02 e 03 não são reaproveitados; os critérios 04 e 05 fixam a ausência desses efeitos.
- AC-US-0005-04: Antes da largada e em corrida, em nenhum quadro a tela mostra a indicação de drift junto
  ao Kart 01 exibido, qualquer que seja a combinação de comandos do Jogador (`SEED/US-5`, segundo
  critério; `DOMAIN/DEC-07`).
- AC-US-0005-05: Antes da largada e em corrida, em nenhum quadro a tela mostra fumaça ou chama de turbo
  saindo do escapamento do Kart 01 exibido, qualquer que seja a combinação de comandos do Jogador
  (`SEED/US-5`, segundo critério; `DOMAIN/DEC-07`).

## Casos anormais

- **Diferença conhecida entre as rodas da simulação e as do modelo**: o dono do produto decidiu não alinhar
  as medidas da física às do modelo nesta feature (`DOMAIN/DEC-02`). A bitola da simulação é de 1,20 m e a
  traseira do modelo, de 1,14 m: pelos números do seed, a posição traseira de `wheelPositions` fica 0,03 m
  para fora do centro de cada roda traseira do modelo, e o entre-eixos difere em 0,01 m (1,04 m contra
  1,05 m). As marcas continuam vindo de `wheelPositions` (`SEED/RE-03`); o critério 01 é julgado pela
  marca vista na tela sob o pneu exibido. Se essa diferença puser a marca fora do pneu exibido, o critério
  falha e a decisão volta ao dono do produto: nem `wheelPositions` nem as medidas do modelo mudam nesta
  feature.
- **Reposicionamento do kart**: a partir do primeiro quadro depois do reposicionamento, os trechos novos de
  marca aparecem sob os pneus traseiros do Kart 01 na nova posição; as marcas já desenhadas no chão não
  mudam por causa desta feature.
- **Fim da volta oficial**: a simulação para e o kart congela, como hoje (invariante INV-1 de
  `race-lap-validation`; `DOMAIN/DEC-06`); nenhum trecho novo de marca é desenhado enquanto o kart está congelado.
- **Fim de uma volta de treino**: as voltas são seguidas e o kart não congela (`DOMAIN/DEC-07`); sempre que
  o jogo desenha marcas de pneu, os trechos novos continuam aparecendo sob os pneus traseiros do Kart 01
  (critério 01), sem interrupção por causa do fim da volta.
- **Pausa**: a simulação não avança; nenhum trecho novo de marca é desenhado, e as marcas ficam presas ao
  kart parado.
- **Comando que antes acionava o drift ou o turbo**: não há mais drift nem turbo (`DOMAIN/DEC-07`); nenhuma
  tecla, toque ou inclinação exibe a indicação de drift ou a fumaça ou chama de turbo (critérios 04 e 05).
- **Efeito sem a situação que o dispara**: a renderização não decide nada (`SEED/RD-01`); uma marca de pneu
  só aparece quando o jogo já a desenharia, e esta feature não acrescenta nem retira situações.
- **Troca de orientação do celular**: as posições das marcas em relação ao Kart 01 não mudam.
- **Sensor ausente ou permissão negada (`web-mobile`)**: o controle recai para toque com estado visível
  (I4); as marcas continuam presas ao kart, e os critérios 04 e 05 continuam valendo.

## Fontes

- `SEED/US-5` — história e seus dois critérios (marcas de pneu nas posições das rodas traseiras do Kart 01;
  sem indicação de drift nem fumaça ou chama de turbo, porque o drift e o turbo foram retirados do jogo).
  O seed não diz o valor da história; a oração "para ..." o tira dos próprios critérios do seed, sem
  acrescentar requisito.
- `SEED/RE-03` — as posições das rodas da simulação continuam vindo de `wheelPositions`.
- `SEED/RD-01` — a renderização mostra o estado da simulação e não decide nada.
- `DOMAIN/DEC-02` — as medidas da física não são alinhadas ao modelo nesta feature.
- `DOMAIN/DEC-06` — ao fim da volta (`ENDED`) a simulação para e o kart congela, como hoje (invariante
  INV-1 de `race-lap-validation`), na redação corrigida em 2026-10-22 (caso anormal "Fim da volta
  oficial").
- `DOMAIN/DEC-07` — decisão de 2026-10-29: o drift e o turbo saíram do jogo (`dirigibilidade` revisão 4),
  a indicação de drift e a fumaça do escapamento ligada ao turbo deixam de existir, as marcas de pneu
  continuam; no treino o kart não congela ao fim de uma volta (critérios 04 e 05; retirada dos critérios
  02 e 03; casos anormais "Fim de uma volta de treino" e "Comando que antes acionava o drift ou o turbo").

## Pontos em aberto

Nenhum — `DOMAIN/DEC-02` fecha o ponto aberto 02 do seed, e `DOMAIN/DEC-07` fixa a retirada dos efeitos de
drift e de turbo.
