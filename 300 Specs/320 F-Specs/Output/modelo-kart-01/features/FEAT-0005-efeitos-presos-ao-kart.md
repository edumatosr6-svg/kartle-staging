---
id: FEAT-0005
title: Efeitos presos ao kart e posições das rodas da simulação
feature: modelo-kart-01
stage: fspec
status: validated
version: 2.1.0
sources: [US-0005, NFR-0007, AC-US-0005-01, AC-US-0005-04, AC-US-0005-05, AC-US-0005-06, AC-US-0005-07]
---

# FEAT-0005 — Efeitos presos ao kart

## Resumo

As marcas de pneu continuam saindo do kart que o Jogador pilota, agora o Kart 01: no chão, sob os pneus
traseiros. Elas continuam vindo de `wheelPositions`, contrato da simulação que esta feature não muda; a
diferença conhecida entre as rodas da simulação e as do modelo não é corrigida aqui (`DOMAIN/DEC-02`).

As marcas aparecem quando o kart escorrega de lado, e só então: no quadro em que a simulação avançou pelo
menos um passo, com a volta em andamento, a velocidade do kart acima de 6 m/s e a derrapagem lateral acima
de 0,055 rad — a **situação de marca de pneu** (`SEED/US-5`, segundo critério, na `revision: 4`;
`DOMAIN/DEC-09`, via AC-US-0005-06 e AC-US-0005-07). Sem o drift, essa é a única situação. Os valores são
lidos do que a simulação e a volta informam no quadro — a fase da volta em `getLapState`, a velocidade e a
derrapagem lateral na telemetria de dirigibilidade (`getHandlingTelemetry`) —, nunca calculados a partir do
modelo exibido: a apresentação só desenha o trecho e não decide nada (`SEED/RD-01`, I2).

O drift e o turbo saíram do jogo pela `dirigibilidade` (revisão 4), não por esta feature: com o Kart 01,
nenhum quadro mostra a indicação de drift nem fumaça ou chama de turbo saindo do escapamento, antes da
largada e em corrida, qualquer que seja o comando do Jogador (`SEED/US-5`, terceiro critério;
`DOMAIN/DEC-07`, via AC-US-0005-04 e AC-US-0005-05). Os critérios 02 e 03 de US-0005 (fumaça e indicação de
drift nas posições do Kart 01) foram retirados.

## Canais

`web-desktop` e `web-mobile`: as mesmas marcas de pneu, nas mesmas posições do Kart 01 e na mesma situação de
marca de pneu, e a mesma ausência de indicação de drift e de fumaça ou chama de turbo, em paisagem e em
retrato. Em `web-mobile` com sensor ausente ou permissão negada, o controle recai para toque com estado
visível (I4); os efeitos e a situação em que as marcas aparecem não mudam. Os efeitos e a sua ausência são
verificados na tela; `wheelPositions` e a telemetria, na saída de `npm test`
([API-0002](../api/API-0002-relatorio-do-modelo-montado.md)).

## Requisitos

- REQ-FEAT-0005-01: O sistema SHALL desenhar, em corrida, cada trecho novo de marca de pneu no chão na
  posição traseira de `wheelPositions` do lado correspondente — a esquerda sob o pneu traseiro esquerdo, a
  direita sob o pneu traseiro direito —, levada pela posição e pelo rumo do kart, de modo que apareça na tela
  sob o pneu traseiro do Kart 01 exibido (AC-US-0005-01).
- Requisitos 02 e 03 desta funcionalidade (fumaça do escapamento e indicação de drift exibidas nas posições
  do Kart 01): retirados com os critérios 02 e 03 de US-0005, pelo seed `revision: 2` e por
  `DOMAIN/DEC-07`; os números 02 e 03 não são reaproveitados. A ausência desses efeitos é dos requisitos 09
  e 10.
- Requisito 04 desta funcionalidade (manter as situações em que as marcas são desenhadas iguais às de antes
  da feature): retirado na versão 2.1.0, porque o seed `revision: 4` e `DOMAIN/DEC-09` passaram a dizer
  quando as marcas aparecem (US-0005, Pré-condições); substituído pelos requisitos 11 e 12; o número 04 não
  é reaproveitado.
- REQ-FEAT-0005-05: O sistema SHALL manter os valores de `wheelPositions` após N passos de `STEP`, para a
  mesma sequência de `Input` a partir do mesmo estado inicial, iguais aos de antes da feature em 100 % das
  execuções comparadas, reportados no registro `WHEEL_POSITIONS` (NFR-0007).
- REQ-FEAT-0005-06: O sistema SHALL reportar na telemetria as posições das rodas que vêm de `wheelPositions`
  e nunca as posições das rodas do modelo, com 0 diferenças, passo a passo, entre as duas, reportadas no
  registro `TELEMETRY_WHEEL_POSITIONS` (NFR-0007).
- REQ-FEAT-0005-07: O sistema SHALL, a partir do primeiro quadro depois de um reposicionamento, desenhar os
  trechos novos de marca, nos quadros em que a situação de marca de pneu vale, sob os pneus traseiros do
  Kart 01 na nova posição, sem mover as marcas já desenhadas no chão [DOMAIN] (US-0005, caso anormal
  "Reposicionamento do kart").
- REQ-FEAT-0005-08: O sistema SHALL, enquanto a simulação está suspensa (pausa, perda de foco, perda do
  sensor) ou parada depois do fim da volta oficial, não desenhar nenhum trecho novo de marca, mesmo com a
  velocidade e a derrapagem lateral do último estado acima dos limites, mantendo as marcas já desenhadas
  onde estão (AC-US-0005-07; US-0005, casos anormais "Pausa" e "Fim da volta oficial").
- REQ-FEAT-0005-09: O sistema SHALL NOT exibir, antes da largada e em corrida, em nenhum quadro, a indicação
  de drift junto ao Kart 01 exibido, qualquer que seja a combinação de comandos do Jogador — tecla, toque ou
  inclinação, inclusive os que antes acionavam o drift (AC-US-0005-04).
- REQ-FEAT-0005-10: O sistema SHALL NOT exibir, antes da largada e em corrida, em nenhum quadro, fumaça ou
  chama de turbo saindo do escapamento do Kart 01 exibido, qualquer que seja a combinação de comandos do
  Jogador — tecla, toque ou inclinação, inclusive os que antes acionavam o turbo (AC-US-0005-05).
- REQ-FEAT-0005-11: O sistema SHALL, em corrida, em cada quadro em que a situação de marca de pneu vale —
  `simStepCount` de `getKartPose` maior que no quadro anterior, `lapPhase` `RUNNING` em `getLapState`,
  `speedMps` de `getHandlingTelemetry` maior que 6 e `sideslipRad` de `getHandlingTelemetry` maior que
  0,055 —, desenhar um trecho novo de marca de pneu sob cada pneu traseiro do Kart 01 exibido, na posição do
  requisito 01, com os valores lidos do estado do último passo concluído antes do quadro (AC-US-0005-06).
- REQ-FEAT-0005-12: O sistema SHALL NOT desenhar, antes da largada e em corrida, trecho novo de marca de pneu
  sob o Kart 01 exibido em nenhum quadro em que alguma condição da situação de marca de pneu não vale —
  `simStepCount` igual ao do quadro anterior (inclusive em pausa), `lapPhase` diferente de `RUNNING` ou sem
  volta ativa, `speedMps` de 6 ou menos, `sideslipRad` de 0,055 ou menos, ou `getHandlingTelemetry` sem
  estado (`NO_STATE`) —, qualquer que seja a combinação de comandos do Jogador (AC-US-0005-07).

## Situação de marca de pneu

Decidida em cada quadro pelo estado que a simulação e a volta informam; a tabela de decisão completa e a
idempotência estão em [RULE-0003](../rules/RULE-0003-posicao-animacao-e-efeitos-do-kart-01.md).

| Condição | Leitura | Vale quando | Fonte |
|---|---|---|---|
| Simulação avançou | `simStepCount` de `getKartPose` ([API-0001](../api/API-0001-estado-do-kart-para-exibicao.md)) | maior que o do quadro anterior | AC-US-0005-06, AC-US-0005-07 |
| Volta em andamento | `lapPhase` de `getLapState` (`race-lap-validation`, nomeado e não redefinido) | `RUNNING`; não vale em `COUNTDOWN`, `PAUSED`, `ENDED` nem `NO_ACTIVE_LAP` | AC-US-0005-06, AC-US-0005-07 |
| Velocidade do kart | `speedMps` de `getHandlingTelemetry` (`dirigibilidade`, nomeado e não redefinido; 0 ou maior) | maior que 6; com exatamente 6, não vale | AC-US-0005-06, AC-US-0005-07; US-0005, caso anormal "Valores no limite" |
| Derrapagem lateral | `sideslipRad` de `getHandlingTelemetry` (já em módulo: a derrapagem para a esquerda e para a direita dá o mesmo valor) | maior que 0,055; com exatamente 0,055, não vale | AC-US-0005-06, AC-US-0005-07; US-0005, casos anormais "Valores no limite" e "Derrapagem para o outro lado" |

A situação vale só quando as quatro condições valem no mesmo quadro. `rollingSpeedMps` não entra na
situação: a velocidade é a da telemetria, que a simulação já informa em módulo.

## Comportamento

Quadro de exibição: [FLOW-0001](../flows/FLOW-0001-quadro-de-exibicao-em-corrida.md). Ancoragem das marcas,
situação de marca de pneu e ausência dos efeitos retirados:
[RULE-0003](../rules/RULE-0003-posicao-animacao-e-efeitos-do-kart-01.md). Verificação de `wheelPositions` e da
telemetria: [FLOW-0003](../flows/FLOW-0003-verificacao-do-modelo-montado.md),
[API-0002](../api/API-0002-relatorio-do-modelo-montado.md). Tela:
[SCR-0001](../screens/SCR-0001-cena-de-jogo-com-o-kart-01.md).

| Situação | Comportamento |
|---|---|
| Kart escorregando de lado em corrida | Com `lapPhase` `RUNNING`, `speedMps` maior que 6 e `sideslipRad` maior que 0,055, cada quadro com passo novo desenha um trecho novo sob cada pneu traseiro (requisitos 01 e 11) |
| Valores no limite | `speedMps` de exatamente 6 ou `sideslipRad` de exatamente 0,055: nenhum trecho novo (requisito 12) |
| Derrapagem para o outro lado | `sideslipRad` vem em módulo; a derrapagem para a esquerda e para a direita é comparada ao mesmo limite de 0,055 (requisitos 11 e 12) |
| Uma condição deixa de valer no meio da derrapagem | A partir do primeiro quadro em que `speedMps` cai a 6 ou menos, `sideslipRad` cai a 0,055 ou menos ou `lapPhase` deixa de ser `RUNNING`, nenhum trecho novo; as marcas já desenhadas não mudam por causa desta feature (requisito 12) |
| Vários passos de `STEP` entre dois quadros | A situação é decidida pelo estado do último passo concluído, lido uma vez no quadro; nenhum passo intermediário é lido nem estimado; se ela vale, um trecho novo sob cada pneu traseiro (requisito 11) |
| Quadro sem passo novo | `simStepCount` igual ao do quadro anterior: nenhum trecho novo, quaisquer que sejam os valores lidos (requisito 12) |
| Antes da largada (visão geral e contagem) | Não há volta em andamento (`NO_ACTIVE_LAP` ou `COUNTDOWN`): nenhum trecho novo, qualquer que seja a velocidade ou a derrapagem lateral; nenhum quadro mostra a indicação de drift nem fumaça ou chama de turbo junto ao Kart 01 (requisitos 09, 10 e 12) |
| Diferença conhecida entre as rodas da simulação e as do modelo | A bitola da simulação é de 1,20 m e a traseira do modelo, de 1,14 m: a posição traseira de `wheelPositions` fica 0,03 m para fora do centro de cada roda traseira exibida; com o ponto de referência de [RULE-0003](../rules/RULE-0003-posicao-animacao-e-efeitos-do-kart-01.md), a diferença ao longo do rumo é de no máximo 0,01 m (entre-eixos de 1,04 m contra 1,05 m). As marcas continuam vindo de `wheelPositions`; os requisitos 01 e 11 são julgados pela marca vista na tela sob o pneu exibido. Se essa diferença puser a marca fora do pneu exibido, o requisito não é atendido e a decisão volta ao dono do produto: nem `wheelPositions` nem as medidas do modelo mudam nesta feature (`DOMAIN/DEC-02`) |
| Reposicionamento do kart | Trechos novos sob os pneus traseiros na nova posição, quando a situação de marca de pneu vale; as marcas já desenhadas não mudam |
| Fim da volta oficial (`lapPhase` `ENDED`) | A simulação para e o kart congela, como hoje (invariante INV-1 de `race-lap-validation`; `DOMAIN/DEC-06`); `simStepCount` não avança, a volta não está em andamento e nenhum trecho novo de marca é desenhado enquanto o kart está congelado (requisitos 08 e 12) |
| Fim de uma volta de treino | As voltas são seguidas e o kart não congela (`DOMAIN/DEC-07`); a situação de marca de pneu continua sendo lida a cada quadro, e os trechos novos continuam aparecendo sob os pneus traseiros do Kart 01 sempre que ela vale (requisitos 01 e 11), sem interrupção por causa do fim da volta |
| Pausa, perda de foco ou perda do sensor | `lapPhase` `PAUSED` e `simStepCount` parado: nenhum trecho novo, mesmo com a velocidade e a derrapagem lateral do último estado acima dos limites; as marcas ficam onde estão, junto ao kart parado (requisitos 08 e 12) |
| `getHandlingTelemetry` sem estado (`NO_STATE`) | Não ocorre em corrida; se ocorrer, nenhum trecho novo nesse quadro e nada é estimado (requisito 12) |
| Comando que antes acionava o drift ou o turbo | Não há mais drift nem turbo (`DOMAIN/DEC-07`); nenhuma tecla, toque ou inclinação exibe a indicação de drift ou a fumaça ou chama de turbo (requisitos 09 e 10), e nenhum comando faz aparecer marca de pneu fora da situação de marca de pneu (requisito 12) |
| Efeito sem a situação que o dispara | A renderização não decide nada (`SEED/RD-01`): uma marca de pneu só aparece na situação de marca de pneu, lida do estado que a simulação informa; esta feature não acrescenta outra situação (requisito 12) |
| Troca de orientação do celular | As posições das marcas em relação ao Kart 01 e a situação em que elas aparecem não mudam |
| Sensor ausente ou permissão negada (`web-mobile`) | Toque com estado visível (I4); as marcas continuam presas ao kart, e os requisitos 09 a 12 continuam valendo |
| `wheelPositions` diferente da linha de base | `WHEEL_POSITIONS` dá `FAIL` com `STATE_DIFFERS` |
| Posição de roda na telemetria diferente de `wheelPositions` | `TELEMETRY_WHEEL_POSITIONS` dá `FAIL` com `STATE_DIFFERS` |
| Rede indisponível | Sem efeito (D-FS-08) |

## Estado

Não define estados próprios. Lê, a cada quadro, a pose do kart e `simStepCount`
([API-0001](../api/API-0001-estado-do-kart-para-exibicao.md)), `lapPhase` de `getLapState`, `speedMps` e
`sideslipRad` de `getHandlingTelemetry` e `wheelPositions` — contratos de outras features e da simulação,
nomeados e não redefinidos; nenhuma leitura escreve na simulação (NFR-0005). Os trechos de marca já
desenhados são estado de exibição: um trecho novo sob cada pneu traseiro é desenhado só num quadro em que
`simStepCount` avançou e a situação de marca de pneu vale, na ordem de `simStepCount`, e nunca de novo para o
mesmo `simStepCount`; depois do fim da volta oficial `simStepCount` não avança, e no treino continua
avançando. A indicação de drift e a fumaça ou chama de turbo não têm estado nesta feature: não são exibidas
em nenhum estado.

## Configuração

Nenhuma. Os limites de 6 m/s e de 0,055 rad são do seed (`SEED/US-5`, segundo critério; `DOMAIN/DEC-09`),
não configuração. Nenhuma configuração existe para forçar um efeito ou uma marca, mudar os limites, religar
um efeito retirado, injetar um estado ou habilitar um caminho de depuração.

## Critérios de aceite

- Na tela, em corrida, cada trecho novo de marca aparece no chão sob o pneu traseiro exibido do lado
  correspondente, também depois do fim de uma volta de treino; depois de um reposicionamento, os trechos
  novos saem da nova posição e os antigos não se movem (satisfaz AC-US-0005-01; cobre os requisitos 01 e
  07).
- Na tela, em corrida, em cada quadro com passo novo em que `lapPhase` é `RUNNING`, `speedMps` é maior que 6
  e `sideslipRad` é maior que 0,055, aparece um trecho novo sob cada pneu traseiro do Kart 01 exibido,
  derrapando para a esquerda ou para a direita (satisfaz AC-US-0005-06; cobre o requisito 11).
- Na tela, antes da largada e em corrida, nenhum trecho novo de marca aparece em quadro sem passo novo
  (inclusive em pausa), com a volta fora de `RUNNING` (antes da largada, em pausa, depois do fim da volta
  oficial), com `speedMps` de 6 ou menos ou com `sideslipRad` de 0,055 ou menos, inclusive nos valores
  exatos de 6 e de 0,055 e com qualquer combinação de teclas, toques e inclinações (satisfaz AC-US-0005-07;
  cobre os requisitos 08 e 12).
- Na tela, antes da largada e em corrida, em nenhum quadro a indicação de drift aparece junto ao Kart 01
  exibido, com qualquer combinação de teclas, toques e inclinações, inclusive os que antes acionavam o drift
  (satisfaz AC-US-0005-04; cobre o requisito 09).
- Na tela, antes da largada e em corrida, em nenhum quadro fumaça ou chama de turbo sai do escapamento do
  Kart 01 exibido, com qualquer combinação de teclas, toques e inclinações, inclusive os que antes
  acionavam o turbo (satisfaz AC-US-0005-05; cobre o requisito 10).
- `WHEEL_POSITIONS`: `differingValueCount` igual a 0 em 100 % das execuções comparadas (satisfaz o NFR-0007;
  cobre o requisito 05).
- `TELEMETRY_WHEEL_POSITIONS`: `differingValueCount` igual a 0 em todos os passos comparados (satisfaz o
  NFR-0007; cobre o requisito 06).

## Pontos em aberto

Nenhum.
