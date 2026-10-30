---
id: FEAT-0005
title: Efeitos presos ao kart e posições das rodas da simulação
feature: modelo-kart-01
stage: fspec
status: validated
version: 2.0.0
sources: [US-0005, NFR-0007, AC-US-0005-01, AC-US-0005-04, AC-US-0005-05]
---

# FEAT-0005 — Efeitos presos ao kart

## Resumo

As marcas de pneu continuam saindo do kart que o Jogador pilota, agora o Kart 01: no chão, sob os pneus
traseiros. Elas continuam vindo de `wheelPositions`, contrato da simulação que esta feature não muda; a
diferença conhecida entre as rodas da simulação e as do modelo não é corrigida aqui (`DOMAIN/DEC-02`). Esta
feature muda onde a marca aparece, não quando. O drift e o turbo saíram do jogo pela `dirigibilidade`
(revisão 4), não por esta feature: com o Kart 01, nenhum quadro mostra a indicação de drift nem fumaça ou
chama de turbo saindo do escapamento, antes da largada e em corrida, qualquer que seja o comando do Jogador
(`SEED/US-5`, segundo critério; `DOMAIN/DEC-07`, via AC-US-0005-04 e AC-US-0005-05). Os critérios 02 e 03
de US-0005 (fumaça e indicação de drift nas posições do Kart 01) foram retirados.

## Canais

`web-desktop` e `web-mobile`: as mesmas marcas de pneu, nas mesmas posições do Kart 01, e a mesma ausência
de indicação de drift e de fumaça ou chama de turbo, em paisagem e em retrato. Em `web-mobile` com sensor
ausente ou permissão negada, o controle recai para toque com estado visível (I4); os efeitos não mudam. Os
efeitos e a sua ausência são verificados na tela; `wheelPositions` e a telemetria, na saída de `npm test`
([API-0002](../api/API-0002-relatorio-do-modelo-montado.md)).

## Requisitos

- REQ-FEAT-0005-01: O sistema SHALL desenhar, em corrida, cada trecho novo de marca de pneu no chão na
  posição traseira de `wheelPositions` do lado correspondente — a esquerda sob o pneu traseiro esquerdo, a
  direita sob o pneu traseiro direito —, levada pela posição e pelo rumo do kart, de modo que apareça na tela
  sob o pneu traseiro do Kart 01 exibido (AC-US-0005-01).
- Requisitos 02 e 03 desta funcionalidade (fumaça do escapamento e indicação de drift exibidas nas posições
  do Kart 01): retirados nesta revisão com os critérios 02 e 03 de US-0005, pelo seed `revision: 2` e por
  `DOMAIN/DEC-07`; os números 02 e 03 não são reaproveitados. A ausência desses efeitos é dos requisitos 09
  e 10.
- REQ-FEAT-0005-04: O sistema SHALL manter as situações em que as marcas de pneu são desenhadas iguais às de
  antes da feature, sem acrescentar nem retirar situação [DOMAIN] (I2; US-0005, Pré-condições e caso
  anormal "Efeito sem a situação que o dispara").
- REQ-FEAT-0005-05: O sistema SHALL manter os valores de `wheelPositions` após N passos de `STEP`, para a
  mesma sequência de `Input` a partir do mesmo estado inicial, iguais aos de antes da feature em 100 % das
  execuções comparadas, reportados no registro `WHEEL_POSITIONS` (NFR-0007).
- REQ-FEAT-0005-06: O sistema SHALL reportar na telemetria as posições das rodas que vêm de `wheelPositions`
  e nunca as posições das rodas do modelo, com 0 diferenças, passo a passo, entre as duas, reportadas no
  registro `TELEMETRY_WHEEL_POSITIONS` (NFR-0007).
- REQ-FEAT-0005-07: O sistema SHALL, a partir do primeiro quadro depois de um reposicionamento, desenhar os
  trechos novos de marca sob os pneus traseiros do Kart 01 na nova posição, sem mover as marcas já
  desenhadas no chão [DOMAIN] (US-0005, caso anormal "Reposicionamento do kart").
- REQ-FEAT-0005-08: O sistema SHALL, enquanto a simulação está suspensa ou parada depois do fim da volta
  oficial, não desenhar nenhum trecho novo de marca, mantendo as marcas já desenhadas onde estão [DOMAIN]
  (US-0005, casos anormais "Pausa" e "Fim da volta oficial").
- REQ-FEAT-0005-09: O sistema SHALL NOT exibir, antes da largada e em corrida, em nenhum quadro, a indicação
  de drift junto ao Kart 01 exibido, qualquer que seja a combinação de comandos do Jogador — tecla, toque ou
  inclinação, inclusive os que antes acionavam o drift (AC-US-0005-04).
- REQ-FEAT-0005-10: O sistema SHALL NOT exibir, antes da largada e em corrida, em nenhum quadro, fumaça ou
  chama de turbo saindo do escapamento do Kart 01 exibido, qualquer que seja a combinação de comandos do
  Jogador — tecla, toque ou inclinação, inclusive os que antes acionavam o turbo (AC-US-0005-05).

## Comportamento

Quadro de exibição: [FLOW-0001](../flows/FLOW-0001-quadro-de-exibicao-em-corrida.md). Ancoragem das marcas
e ausência dos efeitos retirados: [RULE-0003](../rules/RULE-0003-posicao-animacao-e-efeitos-do-kart-01.md).
Verificação de `wheelPositions` e da telemetria:
[FLOW-0003](../flows/FLOW-0003-verificacao-do-modelo-montado.md),
[API-0002](../api/API-0002-relatorio-do-modelo-montado.md). Tela:
[SCR-0001](../screens/SCR-0001-cena-de-jogo-com-o-kart-01.md).

| Situação | Comportamento |
|---|---|
| Diferença conhecida entre as rodas da simulação e as do modelo | A bitola da simulação é de 1,20 m e a traseira do modelo, de 1,14 m: a posição traseira de `wheelPositions` fica 0,03 m para fora do centro de cada roda traseira exibida; com o ponto de referência de [RULE-0003](../rules/RULE-0003-posicao-animacao-e-efeitos-do-kart-01.md), a diferença ao longo do rumo é de no máximo 0,01 m (entre-eixos de 1,04 m contra 1,05 m). As marcas continuam vindo de `wheelPositions`; o requisito 01 é julgado pela marca vista na tela sob o pneu exibido. Se essa diferença puser a marca fora do pneu exibido, o requisito não é atendido e a decisão volta ao dono do produto: nem `wheelPositions` nem as medidas do modelo mudam nesta feature (`DOMAIN/DEC-02`) |
| Reposicionamento do kart | Trechos novos sob os pneus traseiros na nova posição; as marcas já desenhadas não mudam |
| Fim da volta oficial (`lapPhase` `ENDED`) | A simulação para e o kart congela, como hoje (invariante INV-1 de `race-lap-validation`; `DOMAIN/DEC-06`); `simStepCount` não avança e nenhum trecho novo de marca é desenhado enquanto o kart está congelado |
| Fim de uma volta de treino | As voltas são seguidas e o kart não congela (`DOMAIN/DEC-07`); sempre que o jogo desenha marcas de pneu, os trechos novos continuam aparecendo sob os pneus traseiros do Kart 01 (requisito 01), sem interrupção por causa do fim da volta |
| Pausa, perda de foco ou perda do sensor | Nenhum trecho novo de marca; as marcas ficam onde estão, junto ao kart parado |
| Comando que antes acionava o drift ou o turbo | Não há mais drift nem turbo (`DOMAIN/DEC-07`); nenhuma tecla, toque ou inclinação exibe a indicação de drift ou a fumaça ou chama de turbo (requisitos 09 e 10) |
| Antes da largada (visão geral e contagem) | Nenhum quadro mostra a indicação de drift nem fumaça ou chama de turbo junto ao Kart 01 (requisitos 09 e 10) |
| Efeito sem a situação que o dispara | A renderização não decide nada: uma marca de pneu só aparece quando o jogo já a desenharia; esta feature não acrescenta nem retira situações |
| Troca de orientação do celular | As posições das marcas em relação ao Kart 01 não mudam |
| Sensor ausente ou permissão negada (`web-mobile`) | Toque com estado visível (I4); as marcas continuam presas ao kart, e os requisitos 09 e 10 continuam valendo |
| `wheelPositions` diferente da linha de base | `WHEEL_POSITIONS` dá `FAIL` com `STATE_DIFFERS` |
| Posição de roda na telemetria diferente de `wheelPositions` | `TELEMETRY_WHEEL_POSITIONS` dá `FAIL` com `STATE_DIFFERS` |
| Rede indisponível | Sem efeito (D-FS-08) |

## Estado

Não define estados próprios. Lê a pose do kart por `simStepCount`
([API-0001](../api/API-0001-estado-do-kart-para-exibicao.md)) e `wheelPositions`, contrato da simulação
nomeado e não redefinido. Os trechos de marca já desenhados são estado de exibição: um trecho novo é
desenhado só quando `simStepCount` avança, na ordem de `simStepCount`, e nunca de novo para o mesmo passo;
depois do fim da volta oficial `simStepCount` não avança, e no treino continua avançando. A indicação de
drift e a fumaça ou chama de turbo não têm estado nesta feature: não são exibidas em nenhum estado.

## Configuração

Nenhuma. Nenhuma configuração existe para forçar um efeito, religar um efeito retirado, injetar um estado ou
habilitar um caminho de depuração.

## Critérios de aceite

- Na tela, em corrida, sempre que o jogo desenha marcas de pneu, cada trecho novo aparece no chão sob o pneu
  traseiro exibido do lado correspondente, também depois do fim de uma volta de treino; depois de um
  reposicionamento, os trechos novos saem da nova posição e os antigos não se movem; na pausa e depois do
  fim da volta oficial, nenhum trecho novo (satisfaz AC-US-0005-01; cobre os requisitos 01, 04, 07 e 08).
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
