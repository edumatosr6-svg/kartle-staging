---
id: FEAT-0010
title: Voltas seguidas no treino
feature: race-lap-validation
stage: fspec
status: validated
version: 1.0.1
sources: [US-0010, AC-US-0010-01, AC-US-0010-02, AC-US-0010-03, AC-US-0010-04, AC-US-0010-05, AC-US-0010-06, AC-US-0010-07, AC-US-0010-08, AC-US-0010-09, AC-US-0010-10, AC-US-0010-11, AC-US-0010-12, AC-US-0010-13, AC-US-0010-14, AC-US-0010-15, AC-US-0010-16, AC-US-0010-17, AC-US-0010-18, AC-US-0010-19, AC-US-0010-20, AC-US-0010-21, AC-US-0010-22, AC-US-0010-23, AC-US-0010-24, AC-US-0010-25, AC-US-0010-26, AC-US-0010-27]
---

# FEAT-0010 — Voltas seguidas no treino

## Resumo

No treino o Jogador dá quantas voltas quiser sem o jogo parar. Uma única contagem regressiva abre o treino.
Cada cruzamento da chegada no sentido da pista encerra a volta em andamento, mostra o resultado dela sem parar
o kart e inicia a volta seguinte no mesmo instante, sem nova contagem. Uma volta que se torna inválida por
corte é marcada na hora e segue até a próxima passagem pela chegada. A melhor volta válida do treino fica
visível. O treino só é suspenso pela pausa e só termina quando o Jogador o encerra. Reposicionar no treino não
invalida nem revalida a volta. A volta oficial não muda: termina na chegada ou na invalidação, e o kart para
(`SEED/US-10`, `SEED/US-7`, `DOMAIN/DEC-12`, `DOMAIN/DEC-13`; [RULE-0002](../rules/RULE-0002-estados-da-volta.md)).

## Canais

| Canal | O que muda |
|---|---|
| `web-desktop` | Pausa por Esc, por perda de foco da aba e, no treino, pelo botão de pausa; ação "encerrar treino" na tela |
| `web-mobile` | Pausa por perda de foco da aba, por perda do sensor de inclinação e, no treino, pelo botão de pausa; ação "encerrar treino" na tela. Sensor ausente ou permissão negada antes do treino: o controle recai para toque com estado visível e a sequência de voltas não muda |

As regras de sequência, a exibição do resultado de cada volta, o estado da volta e a melhor volta válida são
idênticos nos dois canais. A forma do botão de pausa e da ação "encerrar treino" é a de
[SCR-0001](../screens/SCR-0001-corrida-hud-da-volta.md).

## Requisitos

- REQ-FEAT-0010-01: O sistema SHALL, no treino, quando a linha de chegada é cruzada no sentido da pista,
  encerrar a volta em andamento e iniciar a seguinte no mesmo instante: no estado da simulação, `lapStartMs`
  da nova volta é igual ao instante de cruzamento, interpolado no passo, que encerrou a anterior, com
  diferença de 0 ms (AC-US-0010-01).
- REQ-FEAT-0010-02: O sistema SHALL exibir, ao terminar uma volta de treino na chegada, o tempo total dela,
  também quando a volta é inválida ou não cruzou o limite de algum setor, numa pista que declara os quatro
  setores e numa pista que não declara setores (AC-US-0010-02).
- REQ-FEAT-0010-03: O sistema SHALL NOT parar o kart no fim de uma volta de treino: com aceleração máxima
  aplicada em todos os passos, a velocidade do kart no estado da simulação, 1 passo de `STEP` depois do
  cruzamento da chegada, é maior que 0 m/s (AC-US-0010-03).
- REQ-FEAT-0010-04: O sistema SHALL exibir a contagem regressiva do treino só antes da primeira volta: do
  sinal verde ao encerramento do treino, a tela não exibe contagem regressiva, nem no fim de uma volta nem ao
  continuar depois de uma pausa (AC-US-0010-04).
- REQ-FEAT-0010-05: O sistema SHALL calcular o tempo total de cada volta de treino concluída na chegada como a
  diferença, em milissegundos inteiros, entre o instante de cruzamento que a encerra e o instante em que ela
  começou: o sinal verde, para a primeira volta; o instante de cruzamento que encerrou a anterior, para as
  demais (AC-US-0010-05).
- REQ-FEAT-0010-06: O sistema SHALL manter a soma dos tempos totais das voltas de treino concluídas na
  chegada igual ao tempo de simulação decorrido do sinal verde ao instante de cruzamento que encerrou a última
  delas, com diferença de 0 ms (AC-US-0010-06).
- REQ-FEAT-0010-07: O sistema SHALL exibir, no treino, quando a volta se torna inválida por corte, o estado
  "inválida" com o motivo "corte" a partir do primeiro quadro renderizado depois do passo da invalidação
  (AC-US-0010-07).
- REQ-FEAT-0010-08: O sistema SHALL NOT parar o kart na invalidação por corte no treino: com aceleração
  máxima aplicada em todos os passos, a velocidade do kart no estado da simulação, 1 passo de `STEP` depois
  do passo da invalidação, é maior que 0 m/s (AC-US-0010-08).
- REQ-FEAT-0010-09: O sistema SHALL, no treino, manter a volta invalidada por corte em andamento entre o
  passo da invalidação e o cruzamento seguinte da chegada no sentido da pista, sem iniciar nova volta nesse
  intervalo, e iniciar a nova volta no instante desse cruzamento (AC-US-0010-09).
- REQ-FEAT-0010-10: O sistema SHALL, no treino, iniciar a volta seguinte no mesmo instante do cruzamento da
  chegada no sentido da pista que torna a volta inválida por marcador pulado (AC-US-0010-10).
- REQ-FEAT-0010-11: O sistema SHALL iniciar cada volta seguinte do treino sem motivo de invalidação, mesmo
  quando a anterior foi inválida, exibindo o estado "válida em andamento" a partir do início da nova volta
  (AC-US-0010-11).
- REQ-FEAT-0010-12: O sistema SHALL exibir, do fim da primeira volta válida do treino ao encerramento do
  treino, o tempo total da melhor volta válida do treino, o menor tempo total entre as voltas válidas
  concluídas nesse treino, calculado na simulação (`bestValidLapMs`) (AC-US-0010-12).
- REQ-FEAT-0010-13: O sistema SHALL NOT alterar o tempo da melhor volta válida exibido por causa de uma volta
  inválida do treino, mesmo quando o tempo total dela é menor que o exibido (AC-US-0010-13).
- REQ-FEAT-0010-14: O sistema SHALL, no treino, seguir avançando a simulação com novos passos de `STEP`, sem
  ação do Jogador, depois da conclusão de uma volta válida, da conclusão de uma volta inválida, da invalidação
  por corte e do reposicionamento; só a pausa e o encerramento do treino suspendem o avanço (AC-US-0010-14).
- REQ-FEAT-0010-15: O sistema SHALL oferecer no treino, em `web-desktop` e em `web-mobile`, um botão de pausa
  cujo acionamento suspende simulação e cronômetro da volta, de modo que o tempo da volta ao continuar seja
  igual ao tempo da volta no instante da pausa (AC-US-0010-15).
- REQ-FEAT-0010-16: O sistema SHALL oferecer na tela, durante o treino, em `web-desktop` e em `web-mobile`, a
  ação de encerrar o treino (AC-US-0010-16).
- REQ-FEAT-0010-17: O sistema SHALL NOT concluir a volta em andamento ao encerrar o treino: o estado da
  simulação não contém resultado para ela (AC-US-0010-17).
- REQ-FEAT-0010-18: O sistema SHALL NOT iniciar nenhuma volta depois do encerramento do treino: o estado da
  simulação não contém volta iniciada depois dele (AC-US-0010-18).
- REQ-FEAT-0010-19: O sistema SHALL NOT alterar a validade da volta em andamento ao reposicionar o kart no
  treino: a tela continua exibindo, depois do reposicionamento, o mesmo estado da volta do instante anterior a
  ele, válida ou inválida com o mesmo motivo (AC-US-0010-19).
- REQ-FEAT-0010-20: O sistema SHALL produzir, no treino, exatamente 1 resultado para cada volta concluída no
  estado da simulação (AC-US-0010-20).
- REQ-FEAT-0010-21: O sistema SHALL NOT iniciar volta seguinte depois do encerramento de uma volta oficial,
  seja no cruzamento da chegada no sentido da pista, seja no passo em que ela se torna inválida
  (AC-US-0010-21).
- REQ-FEAT-0010-22: O sistema SHALL parar o kart no encerramento de uma volta oficial: a partir do passo do
  encerramento, a posição do kart no estado da simulação não muda (AC-US-0010-22).
- REQ-FEAT-0010-23: O sistema SHALL exibir, ao terminar uma volta de treino na chegada numa pista que declara
  os quatro setores, os quatro tempos de setor dela, com "—" no lugar do tempo de cada setor sem tempo, isto
  é, de cada setor com um limite que o kart não cruzou ([RULE-0003](../rules/RULE-0003-cronometragem-e-interpolacao.md))
  (AC-US-0010-23).
- REQ-FEAT-0010-24: O sistema SHALL exibir, ao terminar uma volta de treino na chegada, a validade dela:
  "válida", ou "inválida" com o motivo, numa pista que declara os quatro setores e numa pista que não declara
  setores (AC-US-0010-24).
- REQ-FEAT-0010-25: O sistema SHALL identificar em texto como não oficiais os tempos exibidos no resultado de
  cada volta de treino (AC-US-0010-25).
- REQ-FEAT-0010-26: O sistema SHALL encerrar no máximo 1 volta por cruzamento da chegada no sentido da pista,
  no treino (AC-US-0010-26).
- REQ-FEAT-0010-27: O sistema SHALL, no treino numa pista cujo dado não declara setores, exibir o resultado de
  cada volta terminada na chegada sem tempo de setor e sem linha de setores (AC-US-0010-27).
- REQ-FEAT-0010-28: O sistema SHALL NOT encerrar a volta em andamento nem iniciar uma nova quando a chegada é
  cruzada na contramão no treino; a volta seguinte começa só no cruzamento no sentido da pista [DOMAIN]
  (US-0010, caso anormal "Chegada na contramão no treino"; US-0005).
- REQ-FEAT-0010-29: O sistema SHALL manter o motivo "corte" numa volta de treino já inválida por corte que
  depois pula um marcador ou corta de novo, até a chegada que a encerra, sem registrar um segundo motivo no
  resultado [DOMAIN] (US-0010, caso anormal; US-0006, caso anormal; `DOMAIN/DEC-12`).
- REQ-FEAT-0010-30: O sistema SHALL aceitar o encerramento do treino também durante a pausa e durante a
  contagem, sem produzir resultado para a volta em andamento [DOMAIN] (US-0010, caso anormal "Encerrar o
  treino durante uma pausa").
- REQ-FEAT-0010-31: O sistema SHALL NOT produzir resultado para a volta em andamento quando a página é
  recarregada ou abandonada durante o treino [DOMAIN] (US-0010, caso anormal; `SEED/RD-05`).
- REQ-FEAT-0010-32: O sistema SHALL NOT guardar a melhor volta válida além do treino em andamento [DOMAIN]
  (US-0010, caso anormal "Recarregar ou abandonar a página durante o treino"; persistência entre sessões fora
  do escopo).

## Comportamento

Fluxo nominal e alternativas: [FLOW-0005](../flows/FLOW-0005-treino-com-voltas-seguidas.md). Estados:
[RULE-0002](../rules/RULE-0002-estados-da-volta.md). Validade por tipo de volta:
[RULE-0001](../rules/RULE-0001-validade-da-volta.md). Tempos e setores sem tempo:
[RULE-0003](../rules/RULE-0003-cronometragem-e-interpolacao.md). Comandos `pauseLap` com `PAUSE_BUTTON` e
`endTraining`: [API-0002](../api/API-0002-comandos-da-volta.md). Leitura do estado, do resultado e da lista de
resultados: [API-0001](../api/API-0001-resultado-e-estado-da-volta.md). Tela:
[SCR-0001](../screens/SCR-0001-corrida-hud-da-volta.md).

| Situação | Comportamento |
|---|---|
| Chegada no sentido da pista com todos os marcadores em ordem | Resultado "válida" com tempo total e quatro tempos de setor; a volta seguinte começa no mesmo instante; o kart não para; a melhor volta válida é atualizada se o tempo for menor |
| Chegada no sentido da pista sem todos os marcadores em ordem | Resultado "inválida", "marcador pulado", com tempo total; a volta seguinte começa no mesmo instante, "válida em andamento" |
| Corte | "inválida" e "corte" a partir do quadro seguinte ao passo; o kart segue; a volta termina só na chegada seguinte no sentido da pista, com resultado "inválida", "corte" e tempo total |
| Corte que salta um limite de setor | Os setores vizinhos do limite não cruzado aparecem como "—"; o tempo total aparece |
| Chegada na contramão | Ignorada: a volta não termina e nenhuma começa |
| Chegada cruzada de novo depois de uma volta concluída | Encerra a volta seguinte, com resultado próprio; nenhum segundo resultado para a já concluída (a deduplicação ocorre na simulação, que avalia cada cruzamento uma única vez, no passo em que ocorre) |
| Reposicionamento em qualquer volta da sequência | O kart é recolocado; validade, motivo e tempo não mudam; a sequência continua |
| Pausa por Esc, perda de foco, perda do sensor ou botão de pausa | Simulação e cronômetro suspensos; ao continuar, a mesma volta segue com o mesmo estado e o mesmo tempo, sem contagem ([FLOW-0003](../flows/FLOW-0003-pausa-e-retomada.md)) |
| Encerrar o treino, inclusive em pausa ou na contagem | Fase `ENDED`; a volta em andamento não recebe resultado; nenhuma volta começa; repetir o pedido não tem efeito (`LAP_ENDED`) |
| Treino ainda sem volta válida concluída | Nenhuma melhor volta válida exibida |
| Pista sem setores declarados (dado incompleto, só treino) | Resultado de cada volta só com tempo total, validade e "não oficial" |
| Pista sem linha de chegada (dado incompleto, só treino) | Nenhum cruzamento encerra volta; o que se cronometra não é decidido pelos requisitos (ver `01-overview.md`) |
| Sensor ausente ou permissão negada antes do treino (`web-mobile`) | Controle por toque com estado visível; a sequência não muda |
| Recarregar ou abandonar a página | A volta em andamento não tem resultado; nada é guardado por esta feature |
| Rede indisponível | Sem efeito: o treino inteiro roda sem rede (D-FS-08, NFR-0004) |
| Volta oficial encerrada | Nenhuma volta seguinte; o kart fica parado na posição do passo do encerramento |

## Estado

Lê e altera `lapPhase`, `lapValidity`, `invalidReason`, `lapSequenceCount`, `lapStartMs`, `markersPassedCount`
e a lista de resultados; a simulação calcula `bestValidLapMs`
([RULE-0002](../rules/RULE-0002-estados-da-volta.md), [API-0001](../api/API-0001-resultado-e-estado-da-volta.md)).

| Transição | O que a dispara | Idempotência e contador |
|---|---|---|
| Volta n concluída e volta n + 1 iniciada, fase segue `RUNNING` | cruzamento da chegada no sentido da pista | Um cruzamento encerra no máximo 1 volta; avaliado uma vez, no passo do cruzamento. `lapSequenceCount` passa de n a n + 1; `lapStartMs` passa ao instante do cruzamento; `stepCount` segue |
| `lapValidity` `VALID` para `INVALID` com `CUT`, fase segue `RUNNING` | passo em que a duração de corte é ultrapassada | Uma vez por volta; novos cortes na mesma volta não mudam nada |
| `bestValidLapMs` passa a existir ou diminui | resultado `VALID` com `trainingLapMs` menor que o atual, ou o primeiro resultado `VALID` | Função dos resultados; recalcular dá o mesmo valor |
| `COUNTDOWN`, `RUNNING` ou `PAUSED` para `ENDED` | `endTraining` | O segundo pedido retorna `LAP_ENDED` |
| `COUNTDOWN` ou `RUNNING` para `PAUSED` e volta | pausa e continuar | Pausar de novo retorna `ALREADY_PAUSED` |

## Configuração

Nenhuma. A duração da contagem, a sequência de voltas e a forma do resultado não são configuráveis; o
tratamento do treino vale ligado por padrão, como toda a feature (requisitos, `01-context.md`).

## Critérios de aceite

- No treino, a volta seguinte começa no instante de cruzamento que encerrou a anterior, com 0 ms de diferença;
  cada cruzamento no sentido da pista encerra no máximo 1 volta e cada volta concluída tem exatamente 1
  resultado (satisfaz AC-US-0010-01, AC-US-0010-10, AC-US-0010-20, AC-US-0010-26; cobre os requisitos 01, 10,
  20 e 26).
- O kart não para no fim de uma volta nem na invalidação por corte, e a simulação segue avançando depois de
  cada um desses eventos e do reposicionamento (satisfaz AC-US-0010-03, AC-US-0010-08, AC-US-0010-14; cobre os
  requisitos 03, 08 e 14).
- A contagem aparece só antes da primeira volta do treino (satisfaz AC-US-0010-04; cobre o requisito 04).
- Tempo total de cada volta igual ao fim menos o início, e soma dos tempos igual ao tempo do sinal verde ao
  último cruzamento (satisfaz AC-US-0010-05, AC-US-0010-06; cobre os requisitos 05 e 06).
- O corte no treino aparece como "inválida", "corte" no quadro seguinte, a volta segue até a chegada e a nova
  volta começa "válida em andamento" (satisfaz AC-US-0010-07, AC-US-0010-09, AC-US-0010-11; cobre os
  requisitos 07, 09, 11 e 29).
- O resultado de cada volta mostra o tempo total, os quatro setores com "—" nos setores sem tempo, a validade
  com o motivo e o rótulo "não oficial"; numa pista sem setores, só tempo total e validade (satisfaz
  AC-US-0010-02, AC-US-0010-23, AC-US-0010-24, AC-US-0010-25, AC-US-0010-27; cobre os requisitos 02, 23, 24,
  25 e 27).
- A melhor volta válida aparece depois da primeira volta válida e não muda por volta inválida (satisfaz
  AC-US-0010-12, AC-US-0010-13; cobre os requisitos 12 e 13).
- O botão de pausa suspende e preserva o tempo; a ação "encerrar treino" aparece nos dois canais, encerra sem
  resultado para a volta em andamento e nenhuma volta começa depois (satisfaz AC-US-0010-15 a AC-US-0010-18;
  cobre os requisitos 15 a 18 e 30).
- Reposicionar no treino mantém o estado da volta exibido (satisfaz AC-US-0010-19; cobre o requisito 19).
- Em volta oficial, nenhuma volta seguinte depois do encerramento e o kart parado a partir dele (satisfaz
  AC-US-0010-21, AC-US-0010-22; cobre os requisitos 21 e 22).
- Chegada na contramão no treino não encerra nem inicia volta; recarregar não produz resultado (satisfaz
  AC-US-0010-01, AC-US-0010-17; cobre os requisitos 28, 31 e 32).

## Pontos em aberto

Nenhum. A duração da exibição do resultado de cada volta do treino, o meio de continuar depois da pausa e o
que se cronometra numa pista sem linha de chegada não são decididos pelos requisitos e estão em "Lacunas
deliberadas" de `01-overview.md`.
