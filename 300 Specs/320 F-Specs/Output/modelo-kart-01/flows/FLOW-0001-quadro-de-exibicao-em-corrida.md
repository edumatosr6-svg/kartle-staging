---
id: FLOW-0001
title: Quadro de exibição em corrida com o Kart 01
feature: modelo-kart-01
stage: fspec
status: validated
version: 1.3.0
sources: [US-0001, US-0002, US-0003, US-0004, US-0005, NFR-0005, AC-US-0001-15, AC-US-0001-16, AC-US-0002-01, AC-US-0002-02, AC-US-0002-03, AC-US-0002-04, AC-US-0002-05, AC-US-0002-06, AC-US-0003-01, AC-US-0003-02, AC-US-0003-03, AC-US-0003-04, AC-US-0003-05, AC-US-0003-06, AC-US-0003-07, AC-US-0003-13, AC-US-0003-14, AC-US-0004-01, AC-US-0004-02, AC-US-0005-01, AC-US-0005-04, AC-US-0005-05]
---

# FLOW-0001 — Quadro de exibição em corrida com o Kart 01

Como cada quadro em corrida — do sinal verde até o quadro anterior à próxima visão geral, inclusive depois do
fim de uma volta, oficial ou de treino — é desenhado em `web-desktop` e `web-mobile`: com a volta em
`RUNNING`, e no treino também depois do fim de uma volta, porque as voltas são seguidas e o kart não congela
(`DOMAIN/DEC-07`), a simulação avança com o `Input` do Jogador; depois do fim da volta oficial (`ENDED`), com
o painel de resultado exibido, a simulação está parada e o kart congelado, como hoje (invariante INV-1 de
`race-lap-validation`; NFR-0006), e nenhum passo novo é produzido; em todos os casos a apresentação lê o
estado do kart, põe o Kart 01 na pose da simulação com as rodas, o volante e os braços, posiciona a câmera de
corrida com o campo de visão de base, desenha as marcas de pneu presas ao kart e a sombra, e não exibe
indicação de drift nem fumaça ou chama de turbo (`DOMAIN/DEC-07`, `DOMAIN/DEC-08`). Realiza
[FEAT-0001](../features/FEAT-0001-kart-01-na-pista.md),
[FEAT-0002](../features/FEAT-0002-kart-reage-aos-comandos.md),
[FEAT-0003](../features/FEAT-0003-camera-de-jogo.md),
[FEAT-0004](../features/FEAT-0004-desempenho-do-kart-01.md) e
[FEAT-0005](../features/FEAT-0005-efeitos-presos-ao-kart.md). Roda sem rede: nenhuma requisição entre o
`Input` e o quadro (D-FS-08, RNF08). Nenhum evento externo entra neste fluxo, logo não há deduplicação a
declarar (D-FS-03). A apresentação não escreve nada na simulação (I2, NFR-0005).

```mermaid
sequenceDiagram
    participant J as Jogador
    participant C as Adaptador de controle
    participant S as Simulacao
    participant V as Estado da volta
    participant A as Apresentacao
    participant T as Tela
    J->>C: teclado, inclinacao ou toque
    C->>S: Input normalizado
    loop zero ou mais passos de STEP neste quadro, nenhum depois do fim da volta oficial
        S->>S: step
    end
    A->>V: getLapState
    V-->>A: lapPhase de corrida, ENDED na volta oficial encerrada
    A->>S: getKartPose
    S-->>A: simStepCount, xM, zM, headingRad, steerAngleRad, rollingSpeedMps
    A->>A: Kart 01 na pose, rodas, volante e bracos
    A->>A: camera de corrida e campo de visao de base pela forma
    A->>A: marcas de pneu em wheelPositions e sombra, sem drift nem turbo
    A-->>T: quadro desenhado
```

## Passos

| Passo | Ator | Ação | Estado | Fonte |
|---|---|---|---|---|
| 1 | Jogador | Esterça, acelera ou freia pelo teclado (`web-desktop`), pela inclinação e toque (`web-mobile`) ou só pelo toque (sensor ausente ou negado), enquanto a volta corre (`RUNNING`) e, no treino, também depois do fim de uma volta, com o kart pilotável (`DOMAIN/DEC-07`); depois do fim da volta oficial (`ENDED`) a simulação está parada e o kart congelado, como hoje (invariante INV-1 de `race-lap-validation`): nenhum comando produz passo novo. Nenhum requisito de pilotagem existe nesta feature; nenhum comando aciona drift ou turbo, que saíram do jogo | `lapPhase` de corrida; `ENDED` na volta oficial encerrada | US-0002, Canais e casos anormais "Fim da volta oficial" e "Fim de uma volta de treino"; US-0003, casos anormais "Fim da volta oficial, válida ou invalidada, com o painel de resultado exibido" e "Fim de uma volta de treino" |
| 2 | Adaptador de controle | Entrega o `Input` normalizado, limitado à faixa (I4); nada desta feature muda o adaptador | | US-0002, caso anormal "Esterço fora da faixa no `Input`" |
| 3 | Simulação | Avança zero ou mais passos de `STEP` desde o quadro anterior, sem nada desta feature; depois do fim da volta oficial (`ENDED`), nenhum: `simStepCount` não avança (simulação parada, invariante INV-1 de `race-lap-validation`); no treino, o fim de uma volta não interrompe os passos | `simStepCount` + n; n = 0 depois do fim da volta oficial | NFR-0005, NFR-0006 |
| 4 | Apresentação | Lê `getLapState` (`race-lap-validation`) e decide o modo da câmera: `RACE_CHASE` em `RUNNING`, depois do fim da volta oficial (`ENDED`) e depois do fim de uma volta de treino ([RULE-0002](../rules/RULE-0002-camera-de-jogo.md)) | `cameraMode` `RACE_CHASE` | AC-US-0003-01, AC-US-0003-13, AC-US-0003-14 |
| 5 | Apresentação | Lê `getKartPose` ([API-0001](../api/API-0001-estado-do-kart-para-exibicao.md)): o estado do último passo concluído | | AC-US-0002-05, AC-US-0002-06 |
| 6 | Apresentação | Põe o ponto de referência do Kart 01 em `xM`, `zM`, com as rodas no chão, apontado em `headingRad` ([RULE-0003](../rules/RULE-0003-posicao-animacao-e-efeitos-do-kart-01.md)) | | AC-US-0002-05, AC-US-0002-06 |
| 7 | Apresentação | Esterça as rodas dianteiras por `steerAngleRad`; gira as quatro rodas pela taxa de rolamento vezes o tempo simulado desde o quadro anterior; gira o volante com o esterço; mantém as mãos do piloto no aro | giro acumulado por `simStepCount` | AC-US-0002-01 a AC-US-0002-04 |
| 8 | Apresentação | Posiciona a câmera na pose de corrida (1,38 m de altura, 3,05 m atrás, mira 3,2 m à frente a 0,30 m), presa ao rumo, com o campo de visão de base da forma da área de jogo, que nenhum comando muda; publica-a em `getCameraView` ([API-0003](../api/API-0003-camera-da-cena-exibida.md)) | | AC-US-0003-01 a AC-US-0003-07, AC-US-0003-13, AC-US-0003-14 |
| 9 | Apresentação | Desenha os trechos novos de marca de pneu nas posições traseiras de `wheelPositions` levadas pela pose do kart, nas situações em que o jogo já as desenha; não desenha indicação de drift nem fumaça ou chama de turbo no escapamento ([RULE-0003](../rules/RULE-0003-posicao-animacao-e-efeitos-do-kart-01.md)) | trechos de marca por `simStepCount` | AC-US-0005-01, AC-US-0005-04, AC-US-0005-05 |
| 10 | Apresentação | Desenha a sombra do kart no chão e o número 01 na placa do para-choque | | AC-US-0001-15, AC-US-0001-16 |
| 11 | Tela | Exibe o quadro; a taxa de quadros medida é a destes quadros, com o Kart 01, a sombra e a câmera de corrida | | AC-US-0004-01, AC-US-0004-02 |

A sequência de `Input` por passo é a única entrada da simulação: os passos 4 a 11 só leem, e a mesma sequência
produz o mesmo estado com ou sem eles (NFR-0005).

## Alternativas, erros e eventos fora de ordem

| Situação | Tratamento |
|---|---|
| Vários passos de `STEP` entre dois quadros | O quadro mostra o último; o giro das rodas soma o tempo simulado de todos eles; um trecho de marca por passo em que o jogo as desenha |
| Quadro sem passo novo | O mesmo estado do quadro anterior; rodas sem giro; nenhum trecho novo de marca |
| Pausa, perda de foco da aba, perda do sensor | A simulação fica suspensa; `simStepCount` não avança; kart, câmera e marcas parados no último estado ([FEAT-0002](../features/FEAT-0002-kart-reage-aos-comandos.md), [FEAT-0005](../features/FEAT-0005-efeitos-presos-ao-kart.md)) |
| Reposicionamento do kart | No primeiro quadro depois dele, kart, câmera e trechos novos de marca na nova posição e no novo rumo; nenhum quadro intermediário; marcas já desenhadas não se movem. Quando invalida a volta oficial, a volta passa a `ENDED`, a simulação para, o kart congela e a câmera continua na pose de corrida em relação ao kart parado; quando invalida uma volta de treino, o kart não congela e o fluxo segue como em "Fim de uma volta de treino" |
| Troca de orientação ou redimensionamento | No quadro seguinte, a regra de campo de visão da nova forma; pose, modelo e efeitos iguais |
| Comando que antes acionava o drift ou o turbo | Não há mais drift nem turbo (`DOMAIN/DEC-07`): o campo de visão continua o de base da forma (`DOMAIN/DEC-08`) e nenhum quadro mostra a indicação de drift nem fumaça ou chama de turbo |
| Rodada, derrapagem forte ou marcha à ré | Câmera presa ao rumo; rodas à taxa de rolamento no sentido do movimento |
| `getKartPose` sem estado (`NO_STATE`) | Não ocorre em `RUNNING`, depois do fim da volta oficial nem depois do fim de uma volta de treino; se ocorrer, nenhum kart é desenhado nesse quadro e nada é estimado |
| Fim da volta oficial (`lapPhase` `ENDED`), válida ou invalidada, inclusive por reposicionamento | O quadro continua "em corrida" para a câmera, com a simulação parada e o kart congelado, como hoje (invariante INV-1 de `race-lap-validation`; NFR-0006): os passos 1 a 3 não produzem passo novo (`simStepCount` não avança), e os passos 4 a 11 leem o estado congelado e desenham a câmera na pose de corrida em relação ao kart parado, sem corte e sem visão geral — rodas sem giro e nenhum trecho novo de marca, como em "Quadro sem passo novo" —, em todos os quadros até o anterior à próxima visão geral ([FLOW-0002](FLOW-0002-largada-visao-geral-descida-e-pose-de-corrida.md), passo 9); o painel de resultado de `race-lap-validation` aparece sobre a cena sem mover a câmera; nenhum quadro mostra a visão geral |
| Fim de uma volta de treino, válida ou invalidada, inclusive por reposicionamento | As voltas são seguidas e o kart não congela (`DOMAIN/DEC-07`; `race-lap-validation` revisão 3, US-10): os passos 1 a 11 continuam como em qualquer quadro em corrida — a simulação avança com o `Input`, as rodas giram, os trechos novos de marca saem sob os pneus traseiros e a câmera fica na pose de corrida em relação ao kart em movimento, sem corte e sem visão geral nem descida por causa do fim da volta, até o quadro anterior à próxima visão geral ([FLOW-0002](FLOW-0002-largada-visao-geral-descida-e-pose-de-corrida.md), passo 10) |
| Sensor de inclinação ausente ou permissão negada (`web-mobile`) | O adaptador recai para toque com estado visível (I4); o fluxo é o mesmo a partir do passo 3 |
| Taxa de quadros baixa | Animação e câmera dependem do passo da simulação, não do número de quadros; o limite de taxa de quadros é o de [FEAT-0004](../features/FEAT-0004-desempenho-do-kart-01.md) |
| Rede indisponível | Sem efeito: nenhuma requisição neste fluxo (D-FS-08) |
