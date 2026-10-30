---
id: SCR-0001
title: Corrida, contagem e estado da volta
feature: race-lap-validation
stage: fspec
status: validated
version: 1.1.0
sources: [US-0001, US-0003, US-0007, US-0009, US-0010, NFR-0004, NFR-0006, NFR-0007, AC-US-0001-02, AC-US-0001-03, AC-US-0001-04, AC-US-0001-09, AC-US-0001-10, AC-US-0002-09, AC-US-0003-05, AC-US-0003-06, AC-US-0003-07, AC-US-0009-01, AC-US-0009-02, AC-US-0009-03, AC-US-0009-04, AC-US-0009-08, AC-US-0009-09, AC-US-0010-02, AC-US-0010-04, AC-US-0010-07, AC-US-0010-11, AC-US-0010-12, AC-US-0010-15, AC-US-0010-16, AC-US-0010-19, AC-US-0010-23, AC-US-0010-24, AC-US-0010-25, AC-US-0010-27]
---

# SCR-0001 — Corrida, contagem e estado da volta

## Propósito

Tela da volta em andamento: mostra a contagem regressiva, o sinal verde, o cronômetro, os tempos de setor já
completados e, em todos os quadros do início de cada volta ao seu fim, o estado da volta ("válida em
andamento" ou "inválida" com o motivo). No treino, é também a tela de todas as voltas seguidas: mostra o
resultado de cada volta sem parar o jogo, a melhor volta válida, o botão de pausa e a ação "encerrar treino".
A tela só exibe e encaminha entradas; validade, tempo e melhor volta são da simulação (I2).

## Canal

Ambos. As diferenças estão na tabela de canais abaixo. A leitura do estado e dos resultados usa
[API-0001](../api/API-0001-resultado-e-estado-da-volta.md); os comandos usam
[API-0002](../api/API-0002-comandos-da-volta.md); o dado da pista vem de
[API-0003](../api/API-0003-dado-de-pista.md).

| Aspecto | `web-desktop` | `web-mobile` |
|---|---|---|
| Entrada de pilotagem | teclado (RF12) | inclinação e toque |
| Pausa manual fora do treino | tecla Esc | nenhuma exigida pelos requisitos |
| Pausa manual no treino | tecla Esc e botão de pausa | botão de pausa |
| Pausa automática | perda de foco da aba | perda de foco da aba; perda do sensor de inclinação |
| Encerrar o treino | ação "encerrar treino" na tela | ação "encerrar treino" na tela |
| Reposicionamento | teclado | toque |
| Tamanho mínimo do texto de estado e de motivo | sem mínimo fixado | 16 px |
| Estado offline | igual (sem rede, tudo funciona) | igual |

O botão de pausa e a ação "encerrar treino" são controles com rótulo em texto (`pauseAction` e
`endTrainingAction`, [RULE-0006](../rules/RULE-0006-mensagens-de-estado-e-motivo.md)), acionáveis por ponteiro em
`web-desktop` e por toque em `web-mobile`, exibidos durante todo o treino e só nele. Nenhum atalho de teclado
para eles é decidido pelos requisitos.

## Pontos de entrada

Depois de `startLap` aceito em [SCR-0002](SCR-0002-inicio-de-volta.md). A volta oficial e a de reconhecimento
terminam em [SCR-0003](SCR-0003-resultado-da-volta.md); o treino termina pela ação "encerrar treino" e volta a
[SCR-0002](SCR-0002-inicio-de-volta.md).

## Estados

| Estado | Condição | Chamadas | O que a tela mostra | Fonte |
|---|---|---|---|---|
| Carregando | O dado da pista ainda está sendo lido | `readTrackData` | Texto de carregamento; nenhuma ação de volta | FLOW-0004 |
| Vazio | Dado lido e nenhuma volta iniciada | `getLapState` retorna `NO_ACTIVE_LAP` | Sem estado da volta, sem tempos; o início é feito em [SCR-0002](SCR-0002-inicio-de-volta.md) | FLOW-0004 |
| Contagem | `lapPhase` `COUNTDOWN` | `getLapState` por quadro | Valor da contagem (3, 2, 1) em texto de no mínimo 48 px, contraste mínimo 4,5:1; cronômetro em zero. No treino, só antes da primeira volta | AC-US-0001-02, AC-US-0001-04, AC-US-0001-09, AC-US-0001-10; AC-US-0010-04 |
| Sinal verde | Primeiro quadro de `RUNNING` depois da contagem | `getLapState` | Rótulo do sinal verde em texto (48 px, 4,5:1) | AC-US-0001-03 |
| Em andamento | `RUNNING`, `lapValidity` `VALID` | `getLapState` por quadro | Cronômetro `m:ss.mmm` da volta em andamento; tempos de setor completados; estado "válida em andamento" em texto | AC-US-0009-01, AC-US-0009-02, AC-US-0002-09; AC-US-0010-11 |
| Inválida em andamento (treino) | `RUNNING`, `lapKind` `TRAINING`, `lapValidity` `INVALID` | `getLapState` por quadro | Estado "inválida" e o motivo em texto, a partir do primeiro quadro depois do passo da invalidação; o cronômetro segue contando; o kart segue | AC-US-0010-07, AC-US-0009-03 |
| Inválida | `ENDED`, `lapValidity` `INVALID` (volta oficial ou de reconhecimento) | `getLapState`, `getLapResult` | Estado "inválida" e o motivo ("marcador pulado", "corte" ou "reposicionamento") em texto; cronômetro parado; leva a [SCR-0003](SCR-0003-resultado-da-volta.md) | AC-US-0009-03 |
| Resultado da volta do treino | `RUNNING` no treino, a partir do primeiro quadro depois do cruzamento que encerrou uma volta | `getLapResult` | Um painel com o resultado da volta encerrada mais recente, distinto do estado da volta em andamento e sem cobri-lo: tempo total (`trainingLapMs`) em `m:ss.mmm`; numa pista que declara setores, os quatro tempos de setor (`trainingSectorMs`) em `m:ss.mmm`, com "—" em cada setor sem tempo; numa pista sem setores declarados, nenhum tempo de setor e nenhuma linha de setores; a validade, "válida" ou "inválida" com o motivo; o rótulo "não oficial". O jogo não para e o painel não pede ação | AC-US-0010-02, AC-US-0010-23, AC-US-0010-24, AC-US-0010-25, AC-US-0010-27 |
| Melhor volta válida (treino) | `bestValidLapMs` presente | `getLapState` por quadro | Rótulo "melhor volta válida" e o tempo em `m:ss.mmm`, do fim da primeira volta válida ao encerramento do treino; ausente antes dela | AC-US-0010-12, AC-US-0010-13 |
| Pausada | `lapPhase` `PAUSED` | `getLapState` | Cronômetro parado no valor do instante da pausa; o estado da volta do instante da pausa; indicação em texto de que a volta está pausada. No treino, a ação "encerrar treino" continua oferecida; ao continuar, nenhuma contagem | AC-US-0003-05, AC-US-0003-06, AC-US-0003-07; AC-US-0010-04, AC-US-0010-15 |
| Encerrada válida | `ENDED` e `VALID` (volta oficial ou de reconhecimento) | `getLapResult` | Leva a [SCR-0003](SCR-0003-resultado-da-volta.md) | AC-US-0002-01 |
| Treino encerrado | `ENDED`, `lapKind` `TRAINING` | nenhuma | Leva a [SCR-0002](SCR-0002-inicio-de-volta.md); nenhum resultado para a volta que estava em andamento | AC-US-0010-17, AC-US-0010-18 |
| Erro | `UNSUPPORTED_SCHEMA` ou `UNREADABLE` | `readTrackData` | Mensagem `trackDataError` em texto, nos dois idiomas ([RULE-0006](../rules/RULE-0006-mensagens-de-estado-e-motivo.md)), sem volta iniciada; o dado de versão desconhecida fica intacto. As rejeições de `startLap` (`LAP_ALREADY_ACTIVE`, `OFFICIAL_NOT_AVAILABLE`, `TRACK_DATA_UNREADABLE`, `TRACK_SCHEMA_UNSUPPORTED`) e de `endTraining` e `pauseLap` (`LAP_ENDED`, `NOT_TRAINING`, `ALREADY_PAUSED`) não têm mensagem própria: são sem efeito e não são exibidas | API-0003 |
| Offline | Sem rede | nenhuma chamada de rede | Nenhuma diferença: contagem, volta, treino e resultados funcionam; nenhum aviso de rede é exibido | NFR-0004 |
| Permissão negada | `web-mobile` com sensor ausente ou permissão negada | nenhuma | O controle recai para toque e a tela mostra, em texto, "controle por toque (sensor de inclinação indisponível)" ([RULE-0006](../rules/RULE-0006-mensagens-de-estado-e-motivo.md)); contagem, regras e sequência de voltas não mudam | I4 |
| Permissão negada em `web-desktop` | Não se aplica | — | O canal usa teclado; não pede sensor | RF12 |

Todo texto de estado, motivo, contagem, resultado e rótulo existe além da cor, em português e em inglês
conforme o idioma do navegador (NFR-0006, NFR-0007). Por quanto tempo o painel do resultado de uma volta do
treino fica visível não é decidido pelos requisitos (ver `01-overview.md`); ele não pode ocultar o estado da
volta em andamento.

A melhor volta válida é calculada pela simulação entre voltas do mesmo treino, que têm a mesma pista e o mesmo
acerto; a tela não compara tempos por conta própria (D-FS-05).

## Ações do Jogador

| Ação | Canal | Resultado |
|---|---|---|
| Pausar | `web-desktop` (Esc) | `pauseLap` `ESC_KEY`: estado Pausada |
| Pausar pelo botão (treino) | ambos | `pauseLap` `PAUSE_BUTTON`: estado Pausada |
| Perder o foco da aba | ambos (automático) | `pauseLap` `FOCUS_LOST` |
| Perder o sensor | `web-mobile` (automático) | `pauseLap` `SENSOR_LOST` |
| Continuar | ambos | `resumeLap`; o meio de acionar não é decidido pelos requisitos; nenhuma contagem ao voltar a `RUNNING` |
| Encerrar o treino | ambos, só no treino, também na pausa | `endTraining`: estado Treino encerrado |
| Reposicionar | teclado em `web-desktop`; toque em `web-mobile` | `repositionKart`: em volta oficial, estado Inválida com "reposicionamento"; em reconhecimento, o kart é recolocado e o estado segue "válida em andamento", sem motivo; no treino, o kart é recolocado e o estado da volta exibido não muda, válido ou inválido com o mesmo motivo |
| Acelerar antes do sinal verde | ambos | Sem efeito; sem penalidade |

## Navegação

Entrada por [SCR-0002](SCR-0002-inicio-de-volta.md). Saída para [SCR-0003](SCR-0003-resultado-da-volta.md) ao
`ENDED` de uma volta oficial ou de reconhecimento; saída para [SCR-0002](SCR-0002-inicio-de-volta.md) ao
encerrar o treino. O fim de uma volta do treino não sai desta tela. Recarregar ou abandonar a tela durante a
volta ou o treino não produz resultado para a volta em andamento.
