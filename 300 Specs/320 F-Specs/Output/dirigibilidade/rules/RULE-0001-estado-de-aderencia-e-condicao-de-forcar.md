---
id: RULE-0001
title: Estado de aderência, condução normal, condição de forçar, recuperação e ausência de drift
feature: dirigibilidade
stage: fspec
status: validated
version: 4.0.0
sources: [US-0003, AC-US-0003-01, AC-US-0003-03, AC-US-0003-04, AC-US-0003-05, AC-US-0003-08, AC-US-0003-10, AC-US-0001-05]
---

# RULE-0001 — Estado de aderência, condução normal, condição de forçar, recuperação e ausência de drift

Decide, por passo e no estado da simulação (I2, D-FS-05), em que contexto cada valor do estado de
aderência pode ocorrer, qual é o teto da derrapagem lateral e o que o comando de drift faz — nada. Fontes:
`SEED/US-3` (via US-0003), `SEED/RD-01`, `DOMAIN/DEC-04` (400 ms) e `DOMAIN/DEC-15` (acerto C, fim do
drift e do turbo), citadas nos critérios de US-0003.

## Condição de forçar

`forcing` é verdadeiro num passo se, e somente se, o `Input` desse passo tem acelerador cheio **e**
esterço cheio (1 ou −1) **e** a velocidade do estado da simulação é maior que 50 km/h (`SEED/US-3`, via
AC-US-0003-03). Em `web-mobile`, esterço parcial (módulo menor que 1) nunca satisfaz a condição de forçar
(US-0003, Canais). O comando de drift não entra na condição.

## Contextos de observação

| Contexto | Onde | Passos | `handling` permitido | `sideslipRad` permitida | Fonte |
|---|---|---|---|---|---|
| Condução normal | Volta do piloto de teste na pista sintética | Todos os passos da volta, sem exceção — inclusive os passos em que o piloto de teste força o kart (acelerador e esterço cheios acima de 50 km/h numa curva) | `grip` ou `understeer` | no máximo 0,65 rad | AC-US-0003-01, AC-US-0003-05; US-0003, caso anormal "Piloto de teste força o kart na volta sintética" |
| Forçando | Pista de teste aberta (ensaio de recuperação) e qualquer volta do Jogador | Passos com `forcing` verdadeiro antes da soltura do esterço | qualquer um dos quatro | sem teto | US-0003, caso anormal "Condição de forçar mantida sem soltar o esterço" |
| Recuperação | Pista de teste aberta | Do passo de soltura (abaixo) até o primeiro `grip` | qualquer um dos quatro, voltando a `grip` em no máximo 400 ms | no máximo 0,65 rad em todos os passos | AC-US-0003-03, AC-US-0003-04; `DOMAIN/DEC-04` |

Fora da volta do piloto de teste e dos ensaios, nenhum critério desta regra é medido sobre a volta do
Jogador: o Jogador pode forçar o kart, e a traseira pode soltar; o que se exige é que a volta do piloto de
teste — a régua — nunca solte e que a recuperação no ensaio da pista de teste aberta cumpra os 400 ms.

## Recuperação da traseira

O **passo de soltura** é o passo em que o esterço é levado de 1 (ou −1) a 0 com `handling` em `oversteer`
ou `sliding` e `forcing` verdadeiro no passo anterior. A recuperação é formada pelos passos desde o passo
de soltura até o primeiro passo em `grip` (inclusive).

| Condição de partida | Evento | Exigência | Fonte |
|---|---|---|---|
| `handling` em `oversteer` ou `sliding` com `forcing` verdadeiro, no asfalto da pista de teste aberta | esterço levado de 1 (ou −1) a 0 num passo, acelerador mantido cheio | `handling` volta a `grip` em no máximo 400 ms de tempo simulado contados desse passo; `sideslipRad` no máximo 0,65 rad em todos os passos até lá | AC-US-0003-03, AC-US-0003-04; `DOMAIN/DEC-04` |
| idem | esterço e acelerador levados a 0 no mesmo passo | o tempo até `grip` não é maior que 400 ms | US-0003, caso anormal "Acelerador mantido cheio durante a recuperação" |
| idem | esterço reduzido a valor intermediário (`web-mobile`) | nenhum limite fixado (lacuna deliberada de `01-overview.md`) | US-0003, caso anormal "Esterço reduzido parcialmente" |
| idem | condição de forçar mantida | a traseira permanece solta; `sideslipRad` pode exceder 0,65 rad; o Jogador segue controlando com o esterço | US-0003, caso anormal "Condição de forçar mantida sem soltar o esterço" |
| idem | `grip` não alcançado em 400 ms | a recuperação falha; o ensaio reporta o tempo até o primeiro `grip` ([API-0003](../api/API-0003-saida-dos-ensaios.md), `REAR_RECOVERY`) | US-0003, caso anormal "Recuperação que não volta a `grip` em 400 ms" |
| `forcing` verdadeiro, `handling` ainda em `grip` ou `understeer` | o forçar chega à duração máxima do ensaio sem a traseira soltar | não há passo de soltura nem recuperação a julgar; o ensaio reporta que a traseira não soltou e por quanto tempo foi forçada; nenhum critério exige que a traseira solte | US-0003, caso anormal "Traseira não solta sob a condição de forçar" |

## Sem drift e sem turbo

| Regra | Efeito | Fonte |
|---|---|---|
| O comando de drift (a tecla de drift em `web-desktop`; o controle de drift do adaptador de toque em `web-mobile`) não muda o estado da simulação | A mesma sequência de `Input` por passo, no mesmo estado inicial, com o comando de drift mantido do primeiro ao último passo e sem ele, produz o mesmo estado em todos os passos: posição, velocidade, rumo, estado de aderência e derrapagem lateral. O campo de `Input` que transporta o comando continua com o mesmo nome e a mesma faixa (I8, NFR-0006); a simulação o ignora | AC-US-0003-08; `SEED/RD-01`, `DOMAIN/DEC-15` |
| Não há carga, mini-turbo, impulso, combo nem pontuação de drift | Nenhum estado da simulação os acumula nem os reporta; a telemetria não tem campo de drift ([API-0001](../api/API-0001-telemetria-de-dirigibilidade.md)) | AC-US-0003-08; `DOMAIN/DEC-15` |
| A velocidade máxima é a mesma em qualquer situação | Partindo de velocidade igual ou menor que a velocidade estabilizada, a velocidade do kart nunca passa dela — com ou sem o comando de drift, na reta, na curva, na recuperação | AC-US-0003-10 |

A exibição do drift e do turbo (HUD, resultado, texto compartilhado) sai com a manobra; é remoção de
exibição, sem regra nova na renderização ([SCR-0001](../screens/SCR-0001-hud-de-velocidade-e-aderencia.md),
[SCR-0002](../screens/SCR-0002-resultado-e-texto-compartilhado.md); `SEED/RE-01`, `DOMAIN/DEC-16`).

## O que esta regra não julga

- O ensaio de resposta do volante (partida em reta na pista de teste aberta, 50 km/h mantidos, esterço
  cheio) mede só o tempo da taxa de guinada; um passo em `understeer` durante esse ensaio não o falha
  (AC-US-0001-05, `DOMAIN/DEC-09`). A aderência em curva é julgada só pelos ensaios de raio e giro
  ([RULE-0002](RULE-0002-ensaios-e-limiares.md)), que não usam o rótulo de aderência no veredito.
- Fora do asfalto (grama, parede, na pista sintética; fora da área declarada, na pista de teste aberta)
  nenhum critério de aderência é medido; na pista sintética vale a redução de velocidade de
  [RULE-0002](RULE-0002-ensaios-e-limiares.md).

## Idempotência e ordem

A condição de forçar e o estado de aderência são funções do estado da simulação e do `Input` do passo; a
recuperação depende só dos passos anteriores pela ordem de `simStepCount`: reavaliar o mesmo passo com o
mesmo histórico dá o mesmo resultado, e nenhum passo é reaplicado. A ordem é a de `simStepCount`
([API-0001](../api/API-0001-telemetria-de-dirigibilidade.md)); na suspensão por pausa, perda de foco ou
perda do sensor nenhum passo avança e os 400 ms da recuperação não contam o tempo suspenso.
