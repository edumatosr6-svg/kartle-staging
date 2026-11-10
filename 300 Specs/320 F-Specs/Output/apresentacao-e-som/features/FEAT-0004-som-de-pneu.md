---
id: FEAT-0004
title: Som de pneu enquanto o kart marca o asfalto
feature: apresentacao-e-som
stage: fspec
status: validated
version: 1.0.1
sources: [US-0004, AC-US-0004-01, AC-US-0004-02, AC-US-0004-03, AC-US-0004-04, AC-US-0004-05, AC-US-0004-06]
---

# FEAT-0004 — Som de pneu

## Resumo

Com o som ligado, o Jogador ouve o pneu cantar enquanto o kart deixa marca de pneu no asfalto, e o som para
logo depois de o kart deixar de marcar. É a gravação `docs/sfx/tire-screech.mp3` (`DOMAIN/DEC-02`). O som
segue a marca que o jogo já desenha: o pneu canta na mesma situação em que o kart deixa marca
(`SEED/RD-02`, via US-0004). A apresentação não calcula deslize nem aderência; só segue a situação de marca
de pneu (I2).

## Canais

- `web-desktop` e `web-mobile`: mesmo comportamento e mesmo contrato
  ([API-0002](../api/API-0002-estado-e-comando-do-som.md)).
- `web-mobile`: a feature não usa o sensor de inclinação; com sensor ausente ou permissão negada, o
  controle recai para toque com estado visível (I4) e o som de pneu segue os mesmos requisitos.

## Requisitos

- REQ-FEAT-0004-01: O sistema SHALL, com o som ligado, tocar o som de pneu enquanto o kart deixa marca de
  pneu no asfalto (AC-US-0004-01).
- REQ-FEAT-0004-02: O sistema SHALL, com o som ligado, levar o som de pneu ao silêncio em até 200 ms depois
  que o kart deixa de marcar o asfalto (AC-US-0004-02).
- REQ-FEAT-0004-03: O sistema SHALL NOT tocar som de pneu com o kart parado (AC-US-0004-03).
- REQ-FEAT-0004-04: O sistema SHALL NOT tocar som de pneu com o kart rodando sem deslizar, sem deixar marca
  de pneu no asfalto (AC-US-0004-04).
- REQ-FEAT-0004-05: O sistema SHALL NOT tocar som de pneu com o som desligado, inclusive a partir da ação
  que o desliga no meio de um deslize (AC-US-0004-05).
- REQ-FEAT-0004-06: O sistema SHALL tocar, como som de pneu, a forma entregue da gravação
  `docs/sfx/tire-screech.mp3` (AC-US-0004-06).
- REQ-FEAT-0004-07: O sistema SHALL, com o arquivo do som de pneu ausente ou ilegível ou num navegador sem
  áudio, não tocar som de pneu, continuar desenhando a marca de pneu e manter a volta, o tempo e os setores
  como com o som disponível (US-0004, caso anormal "Arquivo de som ausente, ilegível, ou navegador sem
  áudio"; NFR-0009).

## Comportamento

Regra e modelo de estados: [RULE-0002](../rules/RULE-0002-som-de-pneu.md). Fluxo:
[FLOW-0002](../flows/FLOW-0002-som-durante-a-volta.md). Contrato:
[API-0002](../api/API-0002-estado-e-comando-do-som.md). Tela:
[SCR-0001](../screens/SCR-0001-controle-de-som-e-saida-de-audio.md).

| Situação | Comportamento |
|---|---|
| Deslizes curtos em sequência | O som acompanha a marca: toca enquanto o kart marca o asfalto e chega ao silêncio em até 200 ms depois de cada vez que deixa de marcar; se o kart volta a marcar antes do silêncio, o som continua |
| Pausa, resultado ou reposicionamento durante um deslize | O som de pneu não tem regra própria para esses estados: vale o requisito 02 a partir do momento em que o kart deixa de marcar o asfalto. Com a simulação suspensa (`lapPhase` `PAUSED`) ou parada (`lapPhase` `ENDED`) o kart não marca, pela definição de [RULE-0002](../rules/RULE-0002-som-de-pneu.md) |
| Som desligado no meio de um deslize | Nenhum som de pneu toca a partir da ação |
| Som ligado no meio de um deslize | A partir da ação vale o requisito 01 |
| Kart deslizando fora do asfalto | O som está ligado à marca de pneu no asfalto; sem marca no asfalto, nenhum som de pneu. Som de grama está fora do escopo |
| Kart sobre a zebra | O som da zebra continua o de `pista-kart-park` e não muda; o som de pneu segue só a marca de pneu no asfalto. Os dois podem tocar ao mesmo tempo |
| Vários passos avançados entre dois quadros, ou nenhum | Vale o último passo avançado; nenhum passo intermediário é estimado; sem passo novo, nada muda, e um quadro sem passo novo não é simulação suspensa nem parada |
| Mesmo passo lido duas vezes, ou fora de ordem | O estado do som de pneu é função de `soundOn`, `tireSoundAvailable`, `lapPhase` e do último passo avançado; ler de novo o mesmo passo não reinicia o som nem muda nada |
| Arquivo de som ausente, ilegível, ou navegador sem áudio | Requisito 07; `tireSoundAvailable` falso |
| Tempo esgotado ao carregar o som na abertura | Tratado como arquivo ausente; nenhuma nova tentativa pela rede depois de o jogo abrir |
| Sem rede depois de o jogo abrir | O som vem dentro do download inicial e toca igual (D-FS-08; [FEAT-0005](FEAT-0005-requisitos-transversais.md)) |
| Recarga da página | O jogo abre com o som desligado ([FEAT-0003](FEAT-0003-som-do-motor-gravado.md)) e nenhum som de pneu toca. Nenhum estado de tentativa ou de resultado muda |
| Sensor ausente ou permissão negada (`web-mobile`) | Toque com estado visível (I4); os requisitos do som não mudam |

## Estado

| Estado | Valores | O que dirige a transição |
|---|---|---|
| `tireSoundState` | `TIRE_SILENT`, `TIRE_PLAYING` | `soundOn`, `tireSoundAvailable` e o kart marcando o asfalto no último passo avançado, pela tabela de [RULE-0002](../rules/RULE-0002-som-de-pneu.md) |

Lê, sem mudar: `soundOn` ([FEAT-0003](FEAT-0003-som-do-motor-gravado.md)), a situação de marca de pneu
(`modelo-kart-01`) e `simStepCount`.

## Configuração

Nenhuma. O som de pneu segue o mesmo estado ligado ou desligado do jogo; não há controle de volume. Nenhuma
configuração existe para forçar um evento, injetar um estado ou habilitar um caminho de depuração.

## Critérios de aceite

- Com o som ligado, em todo intervalo em que o kart deixa marca de pneu no asfalto, vista na tela,
  `tireSoundState` é `TIRE_PLAYING` e `tireGainNorm` é maior que 0 (satisfaz AC-US-0004-01; cobre o
  requisito 01).
- Depois do último passo em que o kart marcou o asfalto, `tireGainNorm` é 0 em até 200 ms (satisfaz
  AC-US-0004-02; cobre o requisito 02).
- Com o kart parado, `tireGainNorm` é 0 (satisfaz AC-US-0004-03; cobre o requisito 03).
- Com o kart rodando sem trecho novo de marca de pneu no asfalto, `tireGainNorm` é 0 (satisfaz
  AC-US-0004-04; cobre o requisito 04).
- Com `soundOn` falso, durante um deslize com marca no asfalto, `tireGainNorm` é 0 e `tireSoundState` é
  `TIRE_SILENT` (satisfaz AC-US-0004-05; cobre o requisito 05).
- O som de pneu que toca é a forma entregue de `docs/sfx/tire-screech.mp3` (satisfaz AC-US-0004-06; cobre
  o requisito 06).
- Com o arquivo do som de pneu indisponível, `tireSoundAvailable` é falso, `tireGainNorm` é 0, a marca de
  pneu continua desenhada e o registro `ASSETS_NEUTRAL` dá `PASS` (satisfaz o caso anormal de US-0004 e o
  NFR-0009; cobre o requisito 07).

## Pontos em aberto

Nenhum.
