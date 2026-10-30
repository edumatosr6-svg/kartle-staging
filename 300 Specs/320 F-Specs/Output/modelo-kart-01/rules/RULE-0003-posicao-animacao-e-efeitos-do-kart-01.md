---
id: RULE-0003
title: Posição, animação e ancoragem dos efeitos do Kart 01
feature: modelo-kart-01
stage: fspec
status: validated
version: 1.1.0
sources: [US-0002, US-0005, NFR-0007, AC-US-0002-01, AC-US-0002-02, AC-US-0002-03, AC-US-0002-04, AC-US-0002-05, AC-US-0002-06, AC-US-0005-01, AC-US-0005-04, AC-US-0005-05]
---

# RULE-0003 — Posição, animação e ancoragem dos efeitos do Kart 01

Decide onde o Kart 01 exibido fica em relação ao estado da simulação, como as rodas, o volante e os braços se
movem, onde as marcas de pneu saem do kart e que efeitos retirados nunca aparecem. Fontes: US-0002
(`SEED/US-2`, `SEED/RD-01`), US-0005 (`SEED/US-5`, `SEED/RE-03`), NFR-0007, a decisão do dono do produto de
não alinhar as medidas da física às do modelo (`DOMAIN/DEC-02`), o congelamento só ao fim da volta oficial
(`DOMAIN/DEC-06`, limitada por `DOMAIN/DEC-07`) e a retirada do drift e do turbo do jogo (`DOMAIN/DEC-07`). A apresentação só mostra o estado que a simulação informa
([API-0001](../api/API-0001-estado-do-kart-para-exibicao.md)) e não decide nada (I2).

## Posição do kart exibido

| Elemento | Regra | Fonte |
|---|---|---|
| Ponto de referência do kart exibido | Na linha central longitudinal do modelo, no chão, entre o eixo traseiro e o dianteiro do modelo, na mesma fração do entre-eixos em que a posição da simulação fica entre as posições traseiras e dianteiras de `wheelPositions` | AC-US-0002-05; US-0005, caso anormal "Diferença conhecida entre as rodas da simulação e as do modelo" |
| Posição | O ponto de referência fica em (`xM`, `zM`) do quadro | AC-US-0002-05 |
| Altura | A base das quatro rodas exibidas toca o chão, plano e sem elevação (I10) | AC-US-0002-05 |
| Orientação | O eixo do para-choque traseiro para o nariz aponta em `headingRad` do quadro | AC-US-0002-06 |
| Estado mostrado | O do último passo de `STEP` concluído antes do quadro; nunca interpolado nem estimado entre passos | US-0002, caso anormal "Vários passos de simulação num mesmo quadro, ou quadro sem passo novo" |

Com esse ponto de referência, a diferença entre as rodas exibidas e as de `wheelPositions` é só a das
medidas, que esta feature não alinha (`DOMAIN/DEC-02`): cada posição traseira de `wheelPositions` fica
0,03 m para fora do centro da roda traseira exibida (bitola de 1,20 m na simulação contra 1,14 m no modelo),
e ao longo do rumo a diferença é de no máximo 0,01 m (entre-eixos de 1,04 m contra 1,05 m).

## Rodas, volante e braços

| Elemento | Regra | Fonte |
|---|---|---|
| Esterço das rodas dianteiras | Cada roda dianteira exibida girada em relação ao chassi, em torno do seu eixo vertical, por `steerAngleRad` do quadro | AC-US-0002-01 |
| Giro das quatro rodas | Entre dois quadros, cada roda gira em torno do seu eixo `rollingSpeedMps` ÷ (π × diâmetro) × tempo simulado entre os quadros (diferença de `simStepCount` × `STEP`), em rotações, no sentido do movimento; diâmetro de 0,26 m na frente e 0,28 m atrás; 0 a 0 m/s | AC-US-0002-02 |
| Volante | Ângulo com o mesmo sinal de `steerAngleRad`, nulo com esterço 0, módulo estritamente crescente com o módulo do esterço; a razão entre os dois não é fixada | AC-US-0002-03 |
| Braços do piloto | As duas mãos sobre o aro do volante em qualquer ângulo do volante | AC-US-0002-04 |
| Animação depois do agrupamento | Rodas, volante e braços giram um a um, cada um com a sua rotação | US-0002, Pré-condições (`DOMAIN/DEC-01`) |

## Tabela de decisão — giro das rodas

| Situação | `rollingSpeedMps` | Tempo simulado entre os quadros | Giro exibido | Fonte |
|---|---|---|---|---|
| Em movimento para a frente | maior que 0 | maior que 0 | para a frente, à taxa de rolamento | AC-US-0002-02 |
| Kart parado | 0 | qualquer | nenhum | AC-US-0002-02 |
| Simulação suspensa (pausa, perda de foco, perda do sensor) | qualquer | 0 | nenhum | US-0002, caso anormal "Pausa" |
| Depois do fim da volta oficial (`ENDED`), simulação parada e kart congelado | o do estado congelado | 0 | nenhum | US-0002, caso anormal "Fim da volta oficial" (`DOMAIN/DEC-06`) |
| Depois do fim de uma volta de treino, kart pilotável | o que a simulação informa | maior que 0 | à taxa de rolamento, como em qualquer quadro em corrida, sem interrupção | US-0002, caso anormal "Fim de uma volta de treino" (`DOMAIN/DEC-07`) |
| Marcha à ré, se a simulação informar | menor que 0 | maior que 0 | para trás, à taxa de rolamento | US-0002, caso anormal "Marcha à ré" |
| Derrapagem, travamento ou patinação | velocidade do kart em módulo, com o sinal do movimento | maior que 0 | à taxa de rolamento na velocidade do kart, sem escorregamento por roda | US-0002, caso anormal "Derrapagem, travamento ou patinação das rodas" |

## Ancoragem das marcas de pneu

| Efeito | Onde aparece | Quando | Fonte |
|---|---|---|---|
| Marcas de pneu | Cada trecho novo, no chão, na posição traseira de `wheelPositions` do lado correspondente, levada pela posição e pelo rumo do kart; aparece sob o pneu traseiro exibido do mesmo lado | Nas situações em que o jogo já desenha marcas, inclusive depois do fim de uma volta de treino; nenhum trecho novo enquanto a simulação está suspensa ou parada depois do fim da volta oficial | AC-US-0005-01; NFR-0007 (`SEED/RE-03`); US-0005, casos anormais "Pausa", "Fim da volta oficial" e "Fim de uma volta de treino" |

Esta regra muda onde a marca aparece, não quando: nenhuma situação é acrescentada nem retirada (US-0005,
Pré-condições). As marcas continuam vindo de `wheelPositions`, nunca das rodas do modelo; se a diferença de
0,03 m puser uma marca fora do pneu exibido, o critério 01 de US-0005 falha e a decisão volta ao dono do
produto, sem mudar `wheelPositions` nem as medidas do modelo nesta feature (`DOMAIN/DEC-02`).

## Efeitos retirados — tabela de decisão

| Efeito | Antes da largada | Em corrida | Com qualquer comando do Jogador | Fonte |
|---|---|---|---|---|
| Indicação de drift junto ao Kart 01 | nunca exibida | nunca exibida | nunca exibida, inclusive com os comandos que antes acionavam o drift | AC-US-0005-04 (`DOMAIN/DEC-07`) |
| Fumaça ou chama de turbo saindo do escapamento do Kart 01 | nunca exibida | nunca exibida | nunca exibida, inclusive com os comandos que antes acionavam o turbo | AC-US-0005-05 (`DOMAIN/DEC-07`) |

O drift e o turbo saíram do jogo pela `dirigibilidade` (revisão 4), não por esta feature; esta regra só fixa
que o Kart 01 não exibe os efeitos deles, em nenhum quadro e em nenhum canal, em paisagem e em retrato.
Nenhum estado da simulação, da volta ou do controle religa esses efeitos.

## Estado e repetição

| Estado de exibição | Avança quando | Idempotência e contador |
|---|---|---|
| Giro acumulado de cada roda | `simStepCount` avança | Contador de sequência: `simStepCount`; o mesmo passo nunca é aplicado duas vezes; quadro sem passo novo não gira |
| Trechos de marca já desenhados | Um trecho novo por avanço de `simStepCount` em que o jogo desenha marcas; `simStepCount` não avança depois do fim da volta oficial e continua avançando no treino | Contador: `simStepCount`; o mesmo passo não desenha um segundo trecho; um reposicionamento não move os trechos já desenhados |
| Indicação de drift e fumaça ou chama de turbo | Nunca: não são exibidas | Sem estado nem contador; nenhum quadro as desenha |
