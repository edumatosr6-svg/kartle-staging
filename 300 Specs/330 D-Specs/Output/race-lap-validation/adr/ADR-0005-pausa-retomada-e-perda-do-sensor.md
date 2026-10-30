---
id: ADR-0005
title: Meios de continuar a volta e detecção da perda do sensor
feature: race-lap-validation
stage: dspec
status: validated
version: 1.1.0
sources: [FEAT-0001, FEAT-0003, FEAT-0010, REQ-FEAT-0001-12, REQ-FEAT-0003-06, REQ-FEAT-0003-07, REQ-FEAT-0003-12, REQ-FEAT-0010-15, REQ-FEAT-0010-16]
---

# ADR-0005 — Meios de continuar a volta e detecção da perda do sensor

## Contexto

O F-Spec fixa a pausa (Esc, perda de foco, perda do sensor e, no treino, o botão de pausa) e o comando `resumeLap`,
mas não decide qual tecla, toque ou botão continua a volta (lacuna deliberada), nem o que conta como "o sensor deixa
de fornecer leituras". A aplicação já tem Esc, o botão `#pause` e o tratamento de `blur`/`visibilitychange`. A
decisão toca o polling do navegador e a experiência de controle. Rodada de 2026-10-30: o treino ganhou o botão de
pausa e a ação "encerrar treino" nos dois canais (FEAT-0010, SCR-0001).

## Decisão

1. **Continuar.** O botão existente `#pause`, com a volta `PAUSED` e rotulado "continuar", e a tecla Esc quando a fase
   é `PAUSED`, ambos emitem `resumeLap`. O retorno do foco da aba não retoma a volta.
2. **Pausar.** Esc em `COUNTDOWN` ou `RUNNING` (`ESC_KEY`, só `web-desktop`); `blur` da janela e aba oculta
   (`FOCUS_LOST`, ambos os canais); silêncio do sensor (`SENSOR_LOST`, só `web-mobile`). No treino, o mesmo botão
   `#pause`, visível em `COUNTDOWN` e `RUNNING` com o rótulo `pauseAction` ("pausar"), emite `pauseLap` com
   `PAUSE_BUTTON` nos dois canais. Fora do treino não há botão de pausa manual por toque (ADR-0004, item 4).
3. **Perda do sensor.** Com a inclinação ativa e a fase `COUNTDOWN` ou `RUNNING`, o adaptador mede, com o relógio de
   parede, o tempo desde o último evento `deviceorientation` com `gamma` e `beta` não nulos; passando de 500 ms
   (`SENSOR_SILENCE_MS`) emite `pauseLap` com `SENSOR_LOST`. O relógio decide só **quando** emitir o comando; o tempo da
   volta continua contado em passos. Ao continuar, o instante da última leitura é reiniciado.
4. **Sensor ausente ou negado antes da volta.** O controle por toque assume, com o texto `controlFallbackTouch` visível.
5. **Encerrar o treino.** Um botão novo, `#lap-end-training`, na barra de ações, com o rótulo `endTrainingAction`,
   visível só num treino em `COUNTDOWN`, `RUNNING` ou `PAUSED`, emite `endTraining`. Nenhum atalho de teclado
   (ADR-0004, item 8).

## Alternativas consideradas

| Alternativa | Por que não |
|---|---|
| Retomar automaticamente quando o foco ou o sensor voltam | contraria RULE-0002 (a volta só deixa `PAUSED` pelo Jogador ou, no treino, por `endTraining`) |
| Novo botão ou nova tecla de continuar | superfície nova sem requisito; os meios existentes bastam |
| Um botão de pausa novo, separado de `#pause` | dois controles para um único estado; o mesmo botão alterna entre pausar e continuar, com o rótulo do que faz |
| Encerrar o treino pelo botão `#pause` ou por Esc | mistura suspender e terminar, que o F-Spec separa (o treino em pausa continua oferecendo "encerrar treino") |
| Detectar perda do sensor por contagem de quadros | acopla a regra à taxa de quadros; o relógio de parede no adaptador não afeta o tempo da volta |
| Limite menor que 500 ms | leituras de inclinação chegam em intervalos de dezenas de ms, mas podem atrasar sob carga; 500 ms evita pausas espúrias |

## Consequências

- Um retorno de foco não gera passos; o cronômetro mostra o mesmo valor até o Jogador continuar.
- Se o sensor continuar mudo ao continuar, a volta é pausada de novo depois de 500 ms; o Jogador pode continuar com
  o controle por toque, que não depende de leituras.
- Fora do treino, a pausa em `web-mobile` é só automática; no treino, o botão de pausa existe nos dois canais.
- Um `pauseLap` com `PAUSE_BUTTON` fora do treino é rejeitado com `NOT_TRAINING` pela simulação; a aplicação nunca o
  emite, porque o botão só se apresenta como "pausar" no treino.
- 500 ms é uma constante do adaptador, não uma configuração do Jogador (sem superfície nova).

## Status

Aceita neste conjunto.
