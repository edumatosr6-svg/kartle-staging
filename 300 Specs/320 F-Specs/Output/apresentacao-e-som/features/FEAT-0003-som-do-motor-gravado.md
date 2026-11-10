---
id: FEAT-0003
title: Som do motor gravado e estado do som
feature: apresentacao-e-som
stage: fspec
status: validated
version: 1.0.0
sources: [US-0003, AC-US-0003-01, AC-US-0003-02, AC-US-0003-03, AC-US-0003-04, AC-US-0003-05, AC-US-0003-06, AC-US-0003-07, AC-US-0003-08, AC-US-0003-09, AC-US-0003-10]
---

# FEAT-0003 — Som do motor gravado

## Resumo

Com o som ligado e uma volta em andamento, o Jogador ouve um motor de kart gravado
(`docs/sfx/engine-loop.mp3`, `DOMAIN/DEC-02`), no lugar do tom sintetizado: contínuo, mais agudo quando o
kart anda mais rápido e mais alto quando o acelerador está pressionado. O motor silencia quando a volta
deixa de estar em andamento. O som começa desligado e só o Jogador o liga. A apresentação lê a volta e a
telemetria e nunca escreve nelas (I2).

## Canais

- `web-desktop` e `web-mobile`: mesmo comportamento e mesmo contrato
  ([API-0002](../api/API-0002-estado-e-comando-do-som.md)). Muda só o dispositivo com que o Jogador acelera
  e aciona o controle de som.
- `web-mobile`: a feature não usa o sensor de inclinação; com sensor ausente ou permissão negada, o
  controle recai para toque com estado visível (I4) e o som do motor segue os mesmos requisitos.

## Requisitos

- REQ-FEAT-0003-01: O sistema SHALL, com o som ligado e uma volta em andamento, tocar o som do motor sem
  intervalo de silêncio maior que 50 ms, inclusive na emenda da repetição da gravação, com o kart parado e
  nos primeiros 50 ms depois de o som ser ligado ou de a volta passar a estar em andamento
  (AC-US-0003-01).
- REQ-FEAT-0003-02: O sistema SHALL, com o som ligado, uma volta em andamento e o mesmo acelerador, tocar o
  motor com tom mais agudo a 20 m/s do que a 5 m/s: `enginePitchRatio` a 20 m/s estritamente maior que a
  5 m/s (AC-US-0003-02).
- REQ-FEAT-0003-03: O sistema SHALL, com o som ligado, uma volta em andamento e a mesma velocidade, tocar o
  motor mais alto com o acelerador pressionado do que com o acelerador solto: `engineGainNorm` estritamente
  maior com o acelerador pressionado (AC-US-0003-03).
- REQ-FEAT-0003-04: O sistema SHALL, com o som ligado, levar o som do motor ao silêncio em até 200 ms
  depois de a volta deixar de estar em andamento por pausa (AC-US-0003-04).
- REQ-FEAT-0003-05: O sistema SHALL, com o som ligado, levar o som do motor ao silêncio em até 200 ms
  depois de a volta deixar de estar em andamento por resultado (AC-US-0003-05).
- REQ-FEAT-0003-06: O sistema SHALL, com o som ligado, levar o som do motor ao silêncio em até 200 ms
  depois de a volta deixar de estar em andamento por reposicionamento (AC-US-0003-06).
- REQ-FEAT-0003-07: O sistema SHALL NOT tocar som de motor com o som desligado, inclusive a partir da ação
  que o desliga no meio de uma volta (AC-US-0003-07).
- REQ-FEAT-0003-08: O sistema SHALL abrir o jogo com o som desligado e mostrar na tela, no controle de
  som, que o som está desligado, em toda abertura e em toda recarga da página (AC-US-0003-08).
- REQ-FEAT-0003-09: O sistema SHALL passar o som de desligado para ligado somente por uma ação do Jogador
  no controle de som do jogo (AC-US-0003-09).
- REQ-FEAT-0003-10: O sistema SHALL tocar, como som do motor, a forma entregue da gravação
  `docs/sfx/engine-loop.mp3` (AC-US-0003-10).
- REQ-FEAT-0003-11: O sistema SHALL NOT tocar o tom sintetizado do motor em nenhuma situação
  (AC-US-0003-10: a gravação entra no lugar do tom sintetizado).
- REQ-FEAT-0003-12: O sistema SHALL, com o arquivo do som do motor ausente ou ilegível ou num navegador sem
  áudio, não tocar som de motor e manter o jogo, a volta, o tempo e os setores como com o som disponível
  (US-0003, caso anormal "Arquivo de som ausente, ilegível, ou navegador sem áudio"; NFR-0009).

## Comportamento

Regra e modelo de estados:
[RULE-0001](../rules/RULE-0001-estado-do-som-e-som-do-motor.md). Fluxo:
[FLOW-0002](../flows/FLOW-0002-som-durante-a-volta.md). Contrato:
[API-0002](../api/API-0002-estado-e-comando-do-som.md). Tela:
[SCR-0001](../screens/SCR-0001-controle-de-som-e-saida-de-audio.md). Forma entregue do arquivo:
[RULE-0003](../rules/RULE-0003-arquivos-da-feature-peso-e-licenca.md).

| Situação | Comportamento |
|---|---|
| Kart parado com a volta em andamento | O motor continua tocando; o tom e a intensidade seguem a velocidade e o acelerador |
| Som ligado no meio de uma volta | A partir da ação do Jogador valem os requisitos 01 a 03 |
| Som desligado no meio de uma volta | Nenhum som de motor toca a partir da ação |
| Volta retomada depois de pausa ou de reposicionamento | Com o som ligado e a volta de novo em andamento, valem os requisitos 01 a 03 |
| Antes de a volta estar em andamento (contagem regressiva, tela de início) | O motor não começou: a condição do requisito 01 é a volta em andamento, e nenhum critério pede motor antes dela |
| Recarga da página | O jogo abre com o som desligado, qualquer que fosse o estado antes; o estado do som não é guardado. Nenhum estado de tentativa ou de resultado muda |
| Perda de foco da janela ou da aba | Se tirar a volta de andamento por pausa, vale o requisito 04; o som não tem regra própria para a perda de foco |
| Navegador que só libera áudio depois de um gesto do usuário | O som começa desligado e só liga por ação do Jogador; essa ação é o gesto |
| Ação repetida no controle de som, ou pedido para o estado em que o som já está | Sem efeito: `setSoundOn` é idempotente ([API-0002](../api/API-0002-estado-e-comando-do-som.md)) |
| Vários passos avançados entre dois quadros, ou nenhum | O tom e a intensidade usam o último passo avançado; nenhum passo intermediário é estimado; sem passo novo, os valores não mudam |
| Estado da volta lido fora de ordem ou repetido | O estado do motor é função do estado corrente; ler de novo o mesmo estado não muda nada |
| Arquivo de som ausente, ilegível, ou navegador sem áudio | Requisito 12; `engineSoundAvailable` falso |
| Tempo esgotado ao carregar o som na abertura | Tratado como arquivo ausente: nenhum som de motor; nenhuma nova tentativa pela rede depois de o jogo abrir |
| Sem rede depois de o jogo abrir | O som vem dentro do download inicial e toca igual; nenhuma requisição é feita (D-FS-08; [FEAT-0005](FEAT-0005-requisitos-transversais.md)) |
| Sensor ausente ou permissão negada (`web-mobile`) | Toque com estado visível (I4); os requisitos do som não mudam |

## Estado

| Estado | Valores | O que dirige a transição |
|---|---|---|
| `soundOn` | `false` (som desligado), `true` (som ligado) | Abertura e recarga: `false`. Ação do Jogador no controle de som: `setSoundOn` |
| `engineSoundState` | `ENGINE_SILENT`, `ENGINE_PLAYING` | `soundOn`, `engineSoundAvailable`, a volta em andamento (`lapPhase` de `getLapState`) e o pedido `repositionKart` aceito, pela tabela de [RULE-0001](../rules/RULE-0001-estado-do-som-e-som-do-motor.md) |

Lê, sem mudar: `lapPhase` (`race-lap-validation`), `speedMps` e o comando de aceleração do `Input`
(`dirigibilidade`).

## Configuração

Nenhuma além do estado ligado ou desligado, que é ação do Jogador e não é guardado. Não há controle de
volume. Nenhuma configuração existe para forçar um evento, injetar um estado ou habilitar um caminho de
depuração.

## Critérios de aceite

- Com o som ligado e uma volta em andamento, do instante em que as duas condições valem até deixarem de
  valer, não há intervalo maior que 50 ms com `engineGainNorm` igual a 0 nem com a gravação sem soar,
  inclusive com o kart parado e através da emenda da repetição (satisfaz AC-US-0003-01; cobre o
  requisito 01).
- Com o mesmo acelerador, `enginePitchRatio` lido a 20 m/s é maior que o lido a 5 m/s (satisfaz
  AC-US-0003-02; cobre o requisito 02).
- Na mesma velocidade, `engineGainNorm` lido com o acelerador pressionado é maior que o lido com o
  acelerador solto (satisfaz AC-US-0003-03; cobre o requisito 03).
- Depois de `lapPhase` passar de `RUNNING` a `PAUSED`, `engineGainNorm` é 0 em até 200 ms (satisfaz
  AC-US-0003-04; cobre o requisito 04).
- Depois de `lapPhase` passar de `RUNNING` a `ENDED`, `engineGainNorm` é 0 em até 200 ms (satisfaz
  AC-US-0003-05; cobre o requisito 05).
- Depois de um `repositionKart` aceito, `engineGainNorm` chega a 0 em até 200 ms (satisfaz AC-US-0003-06;
  cobre o requisito 06).
- Com `soundOn` falso, em qualquer fase da volta, `engineGainNorm` é 0 e `engineSoundState` é
  `ENGINE_SILENT` (satisfaz AC-US-0003-07; cobre o requisito 07).
- Ao abrir e ao recarregar a página, `soundOn` é falso e o controle de som mostra o som desligado (satisfaz
  AC-US-0003-08; cobre o requisito 08).
- Sem ação do Jogador no controle de som, `soundOn` continua falso por toda a sessão, inclusive ao iniciar,
  pausar, retomar e terminar voltas; depois da ação, é verdadeiro (satisfaz AC-US-0003-09; cobre o
  requisito 09).
- O som de motor que toca é a forma entregue de `docs/sfx/engine-loop.mp3`, e nenhum tom sintetizado de
  motor é pedido à saída de áudio (satisfaz AC-US-0003-10; cobre os requisitos 10 e 11).
- Com o arquivo do som do motor indisponível, `engineSoundAvailable` é falso, `engineGainNorm` é 0 e o
  registro `ASSETS_NEUTRAL` dá `PASS` (satisfaz o caso anormal de US-0003 e o NFR-0009; cobre o
  requisito 12).

## Pontos em aberto

Nenhum.
