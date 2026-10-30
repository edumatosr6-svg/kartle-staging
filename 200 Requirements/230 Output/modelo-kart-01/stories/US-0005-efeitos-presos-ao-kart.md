---
id: US-0005
title: Efeitos continuam presos ao kart
feature: modelo-kart-01
stage: req
status: validated
version: 2.1.1
sources: [SEED/US-5, SEED/RE-03, SEED/RD-01, DOMAIN/DEC-02, DOMAIN/DEC-06, DOMAIN/DEC-07, DOMAIN/DEC-09]
---

# US-0005 — Efeitos continuam presos ao kart

## História

Como Jogador, quero que os efeitos que já existem continuem presos ao kart, para ver as marcas de pneu
saírem do Kart 01 que estou pilotando quando ele escorrega de lado, sem efeitos de drift ou de turbo, que
saíram do jogo.

## Canais

- `web-desktop` e `web-mobile`: as mesmas marcas de pneu, nas mesmas posições do Kart 01 e nas mesmas
  situações (volta em andamento, velocidade e derrapagem lateral acima dos mesmos limites), e a mesma
  ausência de indicação de drift e de fumaça ou chama de turbo, em paisagem e em retrato. Nenhuma diferença
  entre os canais.
- `web-mobile` com sensor ausente ou permissão negada: o controle recai para toque com estado visível (I4);
  os efeitos e as situações em que as marcas aparecem não mudam.

## Pré-condições

- Kart 01 em cena (US-0001), em corrida; para os critérios 04, 05 e 07, também antes da largada.
- A situação em que as marcas de pneu aparecem é a do segundo critério de `SEED/US-5` (`revision: 4`) e de
  `DOMAIN/DEC-09`: volta em andamento, velocidade do kart acima de 6 m/s e derrapagem lateral informada
  pela simulação acima de 0,055 rad. Sem drift, essa é a única situação. Os três valores vêm do estado que
  a simulação informa no quadro; a renderização não os calcula a partir do modelo e não decide nada
  (`SEED/RD-01`).
- O drift e o turbo já saíram do jogo (`dirigibilidade` revisão 4; `SEED/US-5`, terceiro critério;
  `DOMAIN/DEC-07`); esta feature não os retira nem os recoloca, e garante só que o Kart 01 não exibe os
  efeitos deles.
- As posições das rodas que a simulação usa para marcas de pneu e telemetria continuam vindo de
  `wheelPositions` (`SEED/RE-03`, NFR-0007).

## Critérios de aceite

- AC-US-0005-01: Em corrida, sempre que o jogo desenha marcas de pneu, cada trecho novo de marca aparece na
  tela no chão sob o pneu traseiro do Kart 01 exibido, do lado correspondente (esquerdo ou direito)
  (`SEED/US-5`, primeiro critério).
- Critérios 02 e 03 desta história (fumaça do escapamento e indicação de drift exibidas nas posições do
  Kart 01): retirados em 2026-10-29 pelo seed `revision: 2` (o critério de `SEED/US-5` que hoje é o
  terceiro) e por `DOMAIN/DEC-07`, porque o drift e o turbo saíram do jogo e esses efeitos deixaram de
  existir. Os números 02 e 03 não são reaproveitados; os critérios 04 e 05 fixam a ausência desses efeitos.
- AC-US-0005-04: Antes da largada e em corrida, em nenhum quadro a tela mostra a indicação de drift junto
  ao Kart 01 exibido, qualquer que seja a combinação de comandos do Jogador (`SEED/US-5`, terceiro
  critério; `DOMAIN/DEC-07`).
- AC-US-0005-05: Antes da largada e em corrida, em nenhum quadro a tela mostra fumaça ou chama de turbo
  saindo do escapamento do Kart 01 exibido, qualquer que seja a combinação de comandos do Jogador
  (`SEED/US-5`, terceiro critério; `DOMAIN/DEC-07`).
- AC-US-0005-06: Em corrida, em cada quadro em que a simulação avançou pelo menos um passo desde o quadro
  anterior (fora da pausa), a volta está em andamento, a velocidade do kart
  informada pela simulação é maior que 6 m/s e a derrapagem lateral informada pela simulação é maior que
  0,055 rad em módulo (para qualquer lado), a tela mostra um trecho novo de marca de pneu no chão sob cada
  pneu traseiro do Kart 01 exibido (`SEED/US-5`, segundo critério; `DOMAIN/DEC-09`).
- AC-US-0005-07: Antes da largada e em corrida, em nenhum quadro em que a simulação não avançou nenhum passo
  desde o quadro anterior (inclusive em pausa), ou a volta não está em andamento, ou a velocidade do kart informada pela simulação é de 6 m/s ou menos, ou a derrapagem lateral informada pela
  simulação é de 0,055 rad ou menos em módulo, a tela mostra trecho novo de marca de pneu sob o Kart 01
  exibido, qualquer que seja a combinação de comandos do Jogador (`SEED/US-5`, segundo critério, "Sem
  drift, essa é a única situação"; `DOMAIN/DEC-09`).

## Casos anormais

- **Valores no limite**: velocidade de exatamente 6 m/s ou derrapagem lateral de exatamente 0,055 rad em
  módulo não fazem aparecer trecho novo de marca, porque o seed diz "a mais de 6 m/s" e "acima de 0,055
  rad" (critério 07).
- **Derrapagem para o outro lado**: o seed diz "quando o kart escorrega de lado", sem escolher o lado; a
  derrapagem lateral para a esquerda e para a direita é comparada ao mesmo limite de 0,055 rad em módulo
  (critérios 06 e 07).
- **Uma condição deixa de valer no meio da derrapagem**: a partir do primeiro quadro em que a velocidade
  cai a 6 m/s ou menos, a derrapagem lateral cai a 0,055 rad ou menos em módulo, ou a volta deixa de estar
  em andamento, nenhum trecho novo de marca aparece (critério 07); as marcas já desenhadas no chão não mudam
  por causa desta feature.
- **Diferença conhecida entre as rodas da simulação e as do modelo**: o dono do produto decidiu não alinhar
  as medidas da física às do modelo nesta feature (`DOMAIN/DEC-02`). A bitola da simulação é de 1,20 m e a
  traseira do modelo, de 1,14 m: pelos números do seed, a posição traseira de `wheelPositions` fica 0,03 m
  para fora do centro de cada roda traseira do modelo, e o entre-eixos difere em 0,01 m (1,04 m contra
  1,05 m). As marcas continuam vindo de `wheelPositions` (`SEED/RE-03`); os critérios 01 e 06 são julgados
  pela marca vista na tela sob o pneu exibido. Se essa diferença puser a marca fora do pneu exibido, o
  critério falha e a decisão volta ao dono do produto: nem `wheelPositions` nem as medidas do modelo mudam
  nesta feature.
- **Reposicionamento do kart**: a partir do primeiro quadro depois do reposicionamento, os trechos novos de
  marca aparecem sob os pneus traseiros do Kart 01 na nova posição, quando as condições do critério 06
  valem; as marcas já desenhadas no chão não mudam por causa desta feature.
- **Antes da largada**: não há volta em andamento; nenhum trecho novo de marca aparece, qualquer que seja a
  velocidade ou a derrapagem lateral (critério 07).
- **Fim da volta oficial**: a simulação para e o kart congela, como hoje (invariante INV-1 de
  `race-lap-validation`; `DOMAIN/DEC-06`); nenhum trecho novo de marca é desenhado enquanto o kart está
  congelado.
- **Fim de uma volta de treino**: as voltas são seguidas e o kart não congela (`DOMAIN/DEC-07`); os trechos
  novos de marca continuam aparecendo sob os pneus traseiros do Kart 01 sempre que as condições do critério
  06 valem (critérios 01 e 06), sem interrupção por causa do fim da volta.
- **Pausa**: a simulação não avança; mesmo com a volta em andamento e a velocidade e a derrapagem lateral
  do último estado acima dos limites, nenhum trecho novo de marca é desenhado (critério 07), e as marcas
  ficam presas ao kart parado.
- **Comando que antes acionava o drift ou o turbo**: não há mais drift nem turbo (`DOMAIN/DEC-07`); nenhuma
  tecla, toque ou inclinação exibe a indicação de drift ou a fumaça ou chama de turbo (critérios 04 e 05),
  e nenhum comando faz aparecer marca de pneu fora da situação do critério 06 (critério 07).
- **Efeito sem a situação que o dispara**: a renderização não decide nada (`SEED/RD-01`); uma marca de pneu
  só aparece na situação do critério 06, lida do estado que a simulação informa, e esta feature não
  acrescenta outra situação (critério 07).
- **Troca de orientação do celular**: as posições das marcas em relação ao Kart 01 e as situações em que
  elas aparecem não mudam.
- **Sensor ausente ou permissão negada (`web-mobile`)**: o controle recai para toque com estado visível
  (I4); as marcas continuam presas ao kart, e os critérios 04 a 07 continuam valendo.

## Fontes

- `SEED/US-5` — história e seus três critérios na `revision: 4` (marcas de pneu nas posições das rodas
  traseiras do Kart 01; marcas quando o kart escorrega de lado, com a volta em andamento, a mais de 6 m/s e
  com derrapagem lateral informada pela simulação acima de 0,055 rad, a única situação sem drift; sem
  indicação de drift nem fumaça ou chama de turbo, porque o drift e o turbo foram retirados do jogo). O
  seed não diz o valor da história; a oração "para ..." o tira dos próprios critérios do seed, sem
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
- `DOMAIN/DEC-09` — decisão de 2026-10-30: sem o drift, a marca de pneu aparece "quando escorregar", com a
  volta em andamento, a mais de 6 m/s e com derrapagem lateral (telemetria da simulação) acima de 0,055 rad
  (critérios 06 e 07; casos anormais "Valores no limite", "Derrapagem para o outro lado", "Uma condição
  deixa de valer no meio da derrapagem" e "Antes da largada").

## Pontos em aberto

Nenhum — `DOMAIN/DEC-02` fecha o ponto aberto 02 do seed, `DOMAIN/DEC-07` fixa a retirada dos efeitos de
drift e de turbo, e o seed `revision: 4` com `DOMAIN/DEC-09` fixa quando as marcas de pneu aparecem.
