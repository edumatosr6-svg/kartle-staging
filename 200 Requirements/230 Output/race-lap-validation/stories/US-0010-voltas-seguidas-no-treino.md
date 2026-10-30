---
id: US-0010
title: Voltas seguidas no treino
feature: race-lap-validation
stage: req
status: validated
version: 1.1.2
sources: [SEED/US-10, SEED/US-7, SEED/RD-05, SEED/RD-09, SEED/RD-10, SEED/IM-I7, DOMAIN/DEC-02, DOMAIN/DEC-03, DOMAIN/DEC-05, DOMAIN/DEC-06, DOMAIN/DEC-08, DOMAIN/DEC-10, DOMAIN/DEC-12, DOMAIN/DEC-13]
---

# US-0010 — Voltas seguidas no treino

## História

Como Jogador, quero dar quantas voltas quiser no treino sem o jogo parar, para treinar a pista em
sequência.

## Canais

- `web-desktop` e `web-mobile`: mesmas regras de sequência de voltas, mesma exibição do resultado de cada
  volta, do estado da volta e da melhor volta válida. Nenhuma diferença de comportamento entre os canais.
- Pausa no treino: o botão de pausa, em `web-desktop` e em `web-mobile` (`SEED/US-10`, "botão ou perda de
  foco"); a tecla Esc, só em `web-desktop`; a perda de foco da aba, nos dois canais; a perda do sensor de
  inclinação, só em `web-mobile` (`DOMAIN/DEC-08`). O efeito é o mesmo em todas.
- Encerrar o treino: ação do Jogador oferecida em `web-desktop` e em `web-mobile`; o seed não fixa a forma
  de acioná-la.
- `web-mobile`: com sensor de inclinação ausente ou permissão negada antes do treino, o controle recai para
  toque com estado visível (I4, `[DOMAIN]`); as regras desta história não mudam.
- Tipos de volta: a sequência de voltas vale só para o treino (`SEED/US-10`). A volta oficial aparece aqui
  só nos critérios 21 e 22, que repetem o que o seed diz dela; a volta de reconhecimento não é tratada pelo
  seed nesta história e segue as demais histórias (termina na chegada ou no passo da invalidação,
  `DOMAIN/DEC-06`).

## Pré-condições

- Para os critérios 01, 03 a 20, 23, 25 e 26, o Jogador está num treino numa pista cujo dado declara
  largada, sentido, linha de chegada, quatro setores e marcadores; quem oferece o treino é o desafio diário,
  fora do escopo.
- Para o critério 27, o Jogador está num treino numa pista cujo dado declara linha de chegada e sentido,
  mas não declara setores (`DOMAIN/DEC-10`).
- Para os critérios 02 e 24, o Jogador está num treino numa das duas pistas acima: a que declara os quatro
  setores ou a que não declara setores (`DOMAIN/DEC-13`).
- Para os critérios 01 a 15, 19, 20 e 23 a 27, o sinal verde do treino foi dado (US-0001).
- Para os critérios 21 e 22, a volta foi iniciada como oficial.

## Critérios de aceite

- AC-US-0010-01: No treino, quando a linha de chegada é cruzada no sentido da pista, a volta em andamento
  termina e a próxima começa no mesmo instante: no estado da simulação, o instante de início da nova volta é
  igual ao instante de cruzamento, interpolado no passo, que encerrou a anterior, com diferença de 0 ms
  (`SEED/US-10`, `DOMAIN/DEC-03`).
- AC-US-0010-02: No treino, ao terminar uma volta na chegada, a tela exibe o tempo total dela, também
  quando a volta é inválida ou não cruzou o limite de algum setor (`SEED/US-10`, `DOMAIN/DEC-13`).
- AC-US-0010-03: No treino, o fim de uma volta na chegada não para o kart: com aceleração máxima aplicada em
  todos os passos, a velocidade do kart no estado da simulação, 1 passo de `STEP` depois do cruzamento da
  chegada, é maior que 0 m/s (`SEED/US-10`).
- AC-US-0010-04: No treino, a contagem regressiva é exibida só antes da primeira volta: do sinal verde ao
  encerramento do treino, a tela não exibe contagem regressiva, nem no fim de uma volta nem ao continuar
  depois de uma pausa (`SEED/US-10`, `DOMAIN/DEC-05`).
- AC-US-0010-05: No estado da simulação, o tempo total de cada volta de treino concluída na chegada é a
  diferença, em milissegundos, entre o instante de cruzamento que a encerra e o instante em que ela começou
  — o sinal verde, para a primeira volta; o instante de cruzamento que encerrou a anterior, para as demais
  (`SEED/US-10`, `DOMAIN/DEC-03`, `DOMAIN/DEC-05`).
- AC-US-0010-06: No estado da simulação, a soma dos tempos totais das voltas de treino concluídas na
  chegada é igual ao tempo de simulação decorrido do sinal verde ao instante de cruzamento que encerrou a
  última delas, com diferença de 0 ms (`SEED/US-10`, "no mesmo instante").
- AC-US-0010-07: No treino, quando a volta se torna inválida por corte, a tela exibe o estado "inválida"
  com o motivo "corte" a partir do primeiro quadro renderizado depois do passo da invalidação
  (`SEED/US-10`, "marcada inválida na hora", `DOMAIN/DEC-12`).
- AC-US-0010-08: No treino, a invalidação por corte não para o kart: com aceleração máxima aplicada em
  todos os passos, a velocidade do kart no estado da simulação, 1 passo de `STEP` depois do passo da
  invalidação, é maior que 0 m/s (`SEED/US-10`, `DOMAIN/DEC-12`).
- AC-US-0010-09: No treino, entre o passo da invalidação por corte e o cruzamento seguinte da linha de
  chegada no sentido da pista, nenhuma nova volta começa no estado da simulação; a nova volta começa no
  instante desse cruzamento (`SEED/US-10`, `DOMAIN/DEC-12`).
- AC-US-0010-10: No treino, o cruzamento da chegada no sentido da pista que torna a volta inválida por
  marcador pulado (US-0004) também inicia a próxima volta, no mesmo instante de cruzamento, no estado da
  simulação (`SEED/US-10`).
- AC-US-0010-11: No treino, a nova volta começa sem motivo de invalidação, mesmo quando a anterior foi
  inválida: a partir do início da nova volta, a tela exibe o estado "válida em andamento" (`SEED/US-10`).
- AC-US-0010-12: Do fim da primeira volta válida do treino ao encerramento do treino, a tela exibe o tempo
  total da melhor volta válida do treino, isto é, o menor tempo total entre as voltas válidas concluídas
  nesse treino (`SEED/US-10`, "a melhor volta válida do treino fica visível").
- AC-US-0010-13: Uma volta inválida do treino não altera o tempo da melhor volta válida exibido, mesmo
  quando o seu tempo total é menor que o dele (`SEED/US-10`, "melhor volta válida").
- AC-US-0010-14: No treino, nenhum evento além da pausa e do encerramento do treino suspende o avanço da
  simulação: a conclusão de uma volta válida, a conclusão de uma volta inválida, a invalidação por corte e
  o reposicionamento são seguidos, no estado da simulação, de novos passos de `STEP` sem ação do Jogador
  (`SEED/US-10`, "o treino só para quando o Jogador pausa (...) ou encerra o treino").
- AC-US-0010-15: No treino, em `web-desktop` e em `web-mobile`, acionar o botão de pausa suspende
  simulação e cronômetro da volta: o tempo da volta ao continuar é igual ao tempo da volta no instante da
  pausa (`SEED/US-10`, `DOMAIN/DEC-08`).
- AC-US-0010-16: Durante o treino, em `web-desktop` e em `web-mobile`, a tela oferece a ação de encerrar o
  treino (`SEED/US-10`, "ou encerra o treino").
- AC-US-0010-17: Ao encerrar o treino, a volta em andamento não é concluída: o estado da simulação não
  contém resultado para ela (`SEED/RD-05`).
- AC-US-0010-18: Depois de encerrar o treino, nenhuma nova volta começa: o estado da simulação não contém
  volta iniciada depois do encerramento (`SEED/US-10`).
- AC-US-0010-19: No treino, reposicionar o kart não torna inválida a volta em andamento: a tela continua
  exibindo, depois do reposicionamento, o mesmo estado da volta do instante anterior a ele (`SEED/US-7`,
  "em treino, reposicionar não invalida"; `DOMAIN/DEC-02`).
- AC-US-0010-20: No treino, cada volta concluída tem exatamente 1 resultado no estado da simulação (I7).
- AC-US-0010-21: Em volta oficial, depois do encerramento — no cruzamento da chegada no sentido da pista ou
  no passo em que a volta se torna inválida —, nenhuma volta seguinte começa: o estado da simulação não
  contém volta iniciada depois do encerramento (`SEED/US-10`, "a volta oficial não muda", `DOMAIN/DEC-06`).
- AC-US-0010-22: Em volta oficial, o kart para no encerramento: a partir do passo do encerramento, a
  posição do kart no estado da simulação não muda (`SEED/US-10`, "e o kart para"; INV-1 citado em
  `DOMAIN.md` de 2026-10-29: depois do encerramento, nada muda).
- AC-US-0010-23: No treino, ao terminar uma volta na chegada, a tela exibe os quatro tempos de setor dela,
  com "—" no lugar do tempo de cada setor cujo limite o kart não cruzou (`SEED/US-10`, "quatro setores";
  `DOMAIN/DEC-13`).
- AC-US-0010-24: No treino, ao terminar uma volta na chegada, a tela exibe a validade dela: "válida", ou
  "inválida" com o motivo (`SEED/US-10`; numa pista sem setores declarados, `DOMAIN/DEC-13`).
- AC-US-0010-25: No treino, ao terminar uma volta na chegada, os tempos exibidos no resultado são
  identificados em texto como não oficiais (`SEED/US-10`, `SEED/RD-09`).
- AC-US-0010-26: No treino, cada cruzamento da chegada no sentido da pista encerra no máximo 1 volta no
  estado da simulação (I7).
- AC-US-0010-27: No treino, numa pista cujo dado não declara setores, ao terminar uma volta na chegada, o
  resultado exibido na tela não contém tempo de setor nem linha de setores (`DOMAIN/DEC-13`,
  `DOMAIN/DEC-10`).

## Casos anormais

- **Chegada na contramão no treino**: não encerra a volta em andamento nem inicia uma nova (US-0005); a
  próxima volta começa só no cruzamento no sentido da pista (critérios 01 e 09).
- **Volta de treino inválida por corte que depois pula um marcador ou corta de novo**: a volta já está
  inválida com o motivo "corte" desde o primeiro corte (critério 07) e termina no próximo cruzamento da
  chegada no sentido da pista (critério 09). O seed não diz se o resultado lista um segundo motivo; este
  conjunto exige só o motivo exibido na hora e não acrescenta critério sobre um segundo.
- **Volta de treino que termina sem ter cruzado o limite de um setor** (por exemplo, por um corte que salta
  o limite): o tempo total aparece (critério 02) e o setor não medido aparece como "—" (critério 23,
  `DOMAIN/DEC-13`).
- **Treino ainda sem volta válida concluída**: não existe melhor volta válida; o critério 12 só exige a
  exibição a partir do fim da primeira volta válida.
- **Grama sem corte no treino**: reduz a velocidade e não invalida a volta (US-0006).
- **Pausa, perda de foco ou perda do sensor durante o treino**: simulação e cronômetro ficam suspensos
  (`DOMAIN/DEC-08`); ao continuar, a mesma volta segue com o mesmo estado e o mesmo tempo, sem contagem
  regressiva (critério 04).
- **Encerrar o treino durante uma pausa**: a volta em andamento não é concluída e não produz resultado
  (critério 17).
- **Recarregar ou abandonar a página durante o treino**: a volta em andamento não é concluída e não produz
  resultado (`SEED/RD-05`). Guardar resultados ou a melhor volta entre sessões é da etapa 5, fora do
  escopo; este conjunto não exige que a melhor volta sobreviva à recarga.
- **Pista de dado incompleto** (só jogável como treino, `DOMAIN/DEC-10`): sem setores declarados, o
  resultado mostra só o tempo total e a validade (critério 27, `DOMAIN/DEC-13`); sem linha de chegada não há
  cruzamento que encerre uma volta, e o seed e `DOMAIN.md` não decidem o que se cronometra nela (US-0008).
- **Sensor de inclinação ausente ou permissão negada antes do treino (`web-mobile`)**: o controle recai
  para toque com estado visível (I4); a sequência de voltas não muda.

## Fontes

- `SEED/US-10` — história e seus seis critérios, incluindo a melhor volta válida visível e o treino que só
  para por pausa ou por encerramento.
- `SEED/US-7` — em treino, reposicionar não invalida.
- `SEED/RD-05` — volta sem completar o percurso não é concluída.
- `SEED/RD-09` — treino não escreve tempo oficial.
- `SEED/RD-10`, `DOMAIN/DEC-02` — reposicionamento livre no treino.
- `SEED/IM-I7` — um único resultado por volta concluída.
- `DOMAIN/DEC-03` — tempo em ms e instante de cruzamento interpolado no passo.
- `DOMAIN/DEC-05` — contagem de 3 s e cronômetro no sinal verde.
- `DOMAIN/DEC-06` — volta invalidada termina imediatamente, mantido para a volta oficial.
- `DOMAIN/DEC-08` — pausa, perda de foco e perda do sensor suspendem simulação e cronômetro.
- `DOMAIN/DEC-10` — pista de dado incompleto só jogável como treino.
- `DOMAIN/DEC-12` — voltas seguidas no treino (2026-10-29); substitui `DOMAIN/DEC-06` só para o treino.
- `DOMAIN/DEC-13` — setor não cruzado aparece como "—", tempo total sempre que a volta terminou na
  chegada, pista sem setores mostra só tempo total e validade (decisão de Eduardo Matos, dono do produto,
  confirmada em 2026-10-30).

## Pontos em aberto

Nenhum — o resultado da volta de treino com setor não cruzado e em pista sem setores declarados
(critérios 02, 23, 24 e 27) está decidido pelo dono do produto em `DOMAIN.md` de 2026-10-30
(`DOMAIN/DEC-13`). O treino que só para por pausa ou por encerramento, a melhor volta válida visível e o
reposicionamento livre no treino são texto do seed (`SEED/US-10`, `SEED/US-7`).
