---
id: SCR-0002
title: Crédito na tela de resultado da volta
feature: pista-kart-park
stage: fspec
status: validated
version: 1.1.0
sources: [US-0006, US-0003, NFR-0005, AC-US-0003-11, AC-US-0006-04, AC-US-0006-05, AC-US-0006-06, AC-US-0006-09]
---

# SCR-0002 — Crédito na tela de resultado da volta

## Propósito

O que esta feature acrescenta à tela de resultado dos requisitos (a tela exibida ao fim de uma volta, com o
tempo da volta): a linha de crédito OSM quando a volta é na Kart Park. Toda volta desta feature é de treino
([FEAT-0001](../features/FEAT-0001-seletor-de-pista-no-treino.md), requisito 11), e no treino de `race-lap-validation` o resultado de cada volta aparece no painel
"Resultado da volta do treino" da tela de corrida, sem parar o jogo; a linha de crédito fica dentro desse
painel. O resto do painel (tempo total e quatro tempos de setor em `m:ss.mmm`, validade e motivo, "não
oficial") é de `race-lap-validation`, nomeado e não redefinido, e vale na Kart Park como na pista sintética
(AC-US-0003-11). O painel não decide a validade nem o tempo: só os exibe (I2).

## Canal

Ambos, com o mesmo conteúdo; o link é acionado com clique em `web-desktop` e com toque em `web-mobile`. O
painel usa `getLapResult` de `race-lap-validation` para o `trackId` da volta e
[API-0002](../api/API-0002-catalogo-e-selecao-da-pista-do-treino.md) (`getTrainingTrackOptions`) para saber
se essa pista tem `osmCredit`.

## Pontos de entrada

O cruzamento da chegada que encerra uma volta do treino, na tela de corrida
([SCR-0003](SCR-0003-kart-park-na-tela-de-corrida.md)): o painel aparece a partir do primeiro quadro depois
dele, com `lapPhase` `RUNNING`, como em `race-lap-validation`.

## Elementos acrescentados

| Elemento | Conteúdo | Fonte |
|---|---|---|
| Linha de crédito OSM | Só quando a entrada do catálogo do `trackId` da volta tem `osmCredit`: "© colaboradores do OpenStreetMap", a menção "licença ODbL" e um link para `https://openstreetmap.org/copyright`, na mesma linha, iguais nos dois idiomas | AC-US-0006-04, AC-US-0006-05, AC-US-0006-06 |

O painel não exibe recorde da pista real nem comparação com tempos reais (AC-US-0006-09).

## Estados

| Estado | Condição | Chamadas | O que a tela mostra | Fonte |
|---|---|---|---|---|
| Carregando | Uma volta do treino acabou de ser encerrada no cruzamento da chegada e o resultado é lido no mesmo quadro | `getLapResult`, `getTrainingTrackOptions` | Nenhum estado visível próprio, como em `race-lap-validation` | AC-US-0006-04 |
| Vazio | Nenhuma volta do treino encerrada ainda | `getLapResult` retorna `NO_RESULT` | O painel não é exibido; nenhuma linha de crédito | `race-lap-validation` |
| Populado — Kart Park | Resultado com `trackId` `kart-park`, válido ou inválido | `getLapResult`, `getTrainingTrackOptions` | O conteúdo de `race-lap-validation` e a linha de crédito OSM | AC-US-0003-11, AC-US-0006-04 a AC-US-0006-06 |
| Populado — pista sintética | Resultado com `trackId` `synthetic` | `getLapResult`, `getTrainingTrackOptions` | O conteúdo de `race-lap-validation`, sem linha de crédito | US-0006, caso anormal "Pista sintética selecionada" |
| Erro | Resultado ausente depois do cruzamento que encerrou uma volta, ou `trackId` fora do catálogo | `getLapResult` | Nenhuma mensagem própria; sem linha de crédito para pista fora do catálogo | `race-lap-validation`; API-0002 |
| Offline | Sem rede | nenhuma chamada de rede | Idêntico ao estado online; o link continua exibido, e o destino pode não abrir | NFR-0005; US-0006, caso anormal "Sem rede" |
| Permissão negada | Não se aplica | — | O resultado e o crédito não dependem de sensor nem de permissão | US-0006, Canais |

## Ações do Jogador

| Ação | Canal | Resultado |
|---|---|---|
| Acionar o link do crédito | ambos | O navegador abre `https://openstreetmap.org/copyright`; o resultado não muda e nada é gravado |
| Seguir pilotando | ambos | O painel não pede ação: a volta seguinte já está em andamento, e o painel passa a mostrar o resultado dela quando ela for encerrada, como em `race-lap-validation` |
| Encerrar o treino | ambos | Ação "encerrar treino" de `race-lap-validation`: o treino termina e o jogo volta à tela inicial ([SCR-0001](SCR-0001-tela-inicial-com-seletor-de-pista.md)) |

## Navegação

O painel fica na tela de corrida e não é uma navegação: aparece ao fim de cada volta do treino. A saída da
tela de corrida para a tela inicial ([SCR-0001](SCR-0001-tela-inicial-com-seletor-de-pista.md)) é pela ação
"encerrar treino", com a sessão de pista e a pista selecionada inalteradas.
