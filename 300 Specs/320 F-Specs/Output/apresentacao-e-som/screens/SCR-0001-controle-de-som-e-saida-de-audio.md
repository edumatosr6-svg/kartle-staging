---
id: SCR-0001
title: Controle de som e saída de áudio nas telas do jogo
feature: apresentacao-e-som
stage: fspec
status: validated
version: 1.0.0
sources: [US-0002, US-0003, US-0004, AC-US-0002-07, AC-US-0003-01, AC-US-0003-04, AC-US-0003-05, AC-US-0003-06, AC-US-0003-07, AC-US-0003-08, AC-US-0003-09, AC-US-0004-01, AC-US-0004-02, AC-US-0004-05]
---

# SCR-0001 — Controle de som e saída de áudio nas telas do jogo

## Propósito

O que o Jogador vê e ouve desta feature dentro do jogo: o controle de som, que mostra se o som está ligado
ou desligado e é o único meio de ligá-lo, e a saída de áudio, onde tocam o som do motor e o som de pneu. As
telas em si — inicial, início de volta, corrida, pausa e resultado — são de `race-lap-validation`,
`pista-kart-park` e `modelo-kart-01`, nomeadas e não redefinidas. Esta feature não acrescenta tela, texto
nem elemento novo: o controle de som é o que o jogo já tem, e esta feature não o cria nem o move. Nenhuma
tela do jogo mostra a capa (AC-US-0002-07). Nada aqui decide a volta ou o tempo (I2).

## Canal

Ambos. A leitura e o comando usam [API-0002](../api/API-0002-estado-e-comando-do-som.md) (`getSoundOutput`,
`setSoundOn`).

| Aspecto | `web-desktop` | `web-mobile` |
|---|---|---|
| Como o Jogador aciona o controle de som | clique | toque |
| Entrada de pilotagem | teclado | inclinação e toque; só toque sem sensor ou sem permissão (I4) |
| Estado do som mostrado, som do motor, som de pneu | os mesmos | os mesmos |
| Som da zebra | o de `pista-kart-park`, sem mudança | o de `pista-kart-park`, sem mudança |
| Sem rede depois de o jogo abrir | igual: tudo funciona | igual: tudo funciona |

## Pontos de entrada

Abertura do jogo ([FLOW-0001](../flows/FLOW-0001-abertura-da-pagina-e-entrega-dos-arquivos.md)). O controle
de som está nas telas em que o jogo já o mostra; o estado do som vale para todas as telas e acompanha o
Jogador de uma para outra sem mudar.

## Estados

| Estado | Condição | Chamadas | O que o Jogador vê e ouve | Fonte |
|---|---|---|---|---|
| Carregando | O download inicial ainda não terminou | nenhuma | Nenhum som; a tela de carregamento é das features donas das telas. Os sons não têm carregamento próprio depois disto | NFR-0003 |
| Vazio (som desligado) | `soundOn` falso: abertura, recarga, ou o Jogador desligou | `getSoundOutput` | O controle mostra o som desligado; nenhum som de motor nem de pneu, em qualquer fase da volta | AC-US-0003-07, AC-US-0003-08, AC-US-0004-05 |
| Populado (som ligado, volta em andamento) | `soundOn` verdadeiro e `lapPhase` `RUNNING` | `getSoundOutput` | O controle mostra o som ligado; motor tocando sem silêncio maior que 50 ms; pneu tocando enquanto o kart marca o asfalto | AC-US-0003-01, AC-US-0004-01 |
| Populado (som ligado, volta fora de andamento) | `soundOn` verdadeiro e pausa, resultado, reposicionamento ou antes de a volta começar | `getSoundOutput` | O controle mostra o som ligado; motor em silêncio, em até 200 ms depois de a volta deixar de estar em andamento; pneu em silêncio em até 200 ms depois de o kart deixar de marcar | AC-US-0003-04, AC-US-0003-05, AC-US-0003-06, AC-US-0004-02 |
| Erro | `engineSoundAvailable` ou `tireSoundAvailable` falso: arquivo ausente ou ilegível, ou navegador sem áudio | `getSoundOutput` | O som indisponível não toca; o controle continua mostrando o estado que o Jogador escolheu; o jogo, a volta, o tempo e a marca de pneu seguem iguais. Os requisitos não pedem aviso na tela, e nenhum é acrescentado | US-0003 e US-0004, caso anormal "Arquivo de som ausente, ilegível, ou navegador sem áudio" |
| Offline | Rede desligada depois de o jogo abrir | nenhuma de rede | Igual a Vazio ou Populado: os sons vieram no download inicial | NFR-0003 |
| Permissão negada | Navegador que só libera áudio depois de um gesto; ou, em `web-mobile`, sensor ausente ou com permissão negada | `setSoundOn` na ação do Jogador | O áudio não precisa de permissão própria: o som começa desligado e a ação do Jogador no controle é o gesto. Sem sensor, toque com estado visível (I4); o som não muda | US-0003, caso anormal "Navegador que só libera áudio depois de um gesto do usuário"; I4 |

O controle mostra o estado em texto, com os rótulos que já tem: "Som desligado" e "Som ligado". O estado
mostrado é sempre o de `soundOn`.

## Navegação

Entrada: abertura do jogo. Saída: nenhuma própria; o controle não leva a outra tela. Trocar de tela, iniciar,
pausar, retomar ou terminar uma volta não muda `soundOn` (AC-US-0003-09). Recarregar a página volta ao
estado Vazio (AC-US-0003-08).

## Ações do Jogador

| Ação | Canal | O que produz |
|---|---|---|
| Acionar o controle de som com o som desligado | ambos | `setSoundOn` com `soundOn` verdadeiro; o controle passa a mostrar "Som ligado"; com a volta em andamento o motor toca em até 50 ms (AC-US-0003-09, AC-US-0003-01) |
| Acionar o controle de som com o som ligado | ambos | `setSoundOn` com `soundOn` falso; o controle passa a mostrar "Som desligado"; motor e pneu em silêncio a partir da ação (AC-US-0003-07, AC-US-0004-05) |
| Acionar o controle duas vezes seguidas | ambos | Cada ação pede o estado oposto ao mostrado; o pedido carrega o estado final, e um pedido repetido para o mesmo estado não tem efeito |
| Pilotar | ambos | Não muda `soundOn`; com o som ligado, o motor e o pneu seguem [RULE-0001](../rules/RULE-0001-estado-do-som-e-som-do-motor.md) e [RULE-0002](../rules/RULE-0002-som-de-pneu.md) |

Não há ação de volume: o som é só ligado ou desligado.
