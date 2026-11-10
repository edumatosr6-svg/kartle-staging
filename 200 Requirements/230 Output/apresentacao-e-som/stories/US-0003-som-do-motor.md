---
id: US-0003
title: Som do motor gravado
feature: apresentacao-e-som
stage: req
status: validated
version: 1.1.0
sources: [SEED/US-3, SEED/VG, SEED/CTX, SEED/RD-01, SEED/RE-03, SEED/FE-05, SEED/RI-02, DOMAIN/DEC-02]
---

# US-0003 — Som do motor gravado

## História

Como Jogador, quero ouvir um motor de kart de verdade, para sentir a velocidade.

## Canais

- `web-desktop` e `web-mobile`: o mesmo comportamento do som do motor nos dois canais. O que muda é só o
  dispositivo com que o Jogador acelera e liga o som.
- `web-mobile`: a história não usa o sensor de inclinação; com sensor ausente ou permissão negada, o
  controle recai para toque com estado visível (I4, `[DOMAIN]`) e o som do motor segue os mesmos
  critérios.

## Pré-condições

- O jogo está aberto.
- Para os critérios 01 a 06 e 10: o Jogador ligou o som.
- Para os critérios 01 a 03 e 10: uma volta está em andamento.

## Critérios de aceite

- AC-US-0003-01: Com o som ligado e uma volta em andamento, na saída de áudio do jogo o som do motor toca
  sem intervalo de silêncio maior que 50 ms.
- AC-US-0003-02: Com o som ligado e o mesmo acelerador, na saída de áudio do jogo o tom do motor a 20 m/s
  é mais agudo que a 5 m/s.
- AC-US-0003-03: Com o som ligado e na mesma velocidade, na saída de áudio do jogo o motor soa mais alto
  com o acelerador pressionado do que com o acelerador solto.
- AC-US-0003-04: Com o som ligado, quando a volta deixa de estar em andamento por pausa, a saída de áudio
  do jogo fica sem som de motor em até 200 ms.
- AC-US-0003-05: Com o som ligado, quando a volta deixa de estar em andamento por resultado, a saída de
  áudio do jogo fica sem som de motor em até 200 ms.
- AC-US-0003-06: Com o som ligado, quando a volta deixa de estar em andamento por reposicionamento, a
  saída de áudio do jogo fica sem som de motor em até 200 ms.
- AC-US-0003-07: Com o som desligado, nenhum som de motor toca na saída de áudio do jogo.
- AC-US-0003-08: Ao abrir o jogo, a tela mostra o som desligado.
- AC-US-0003-09: O estado do som só passa de desligado para ligado por uma ação do Jogador no controle de
  som do jogo.
- AC-US-0003-10: Com o som ligado e uma volta em andamento, o som de motor que toca na saída de áudio do
  jogo é a gravação de motor de `docs/sfx/engine-loop.mp3`, no lugar do tom sintetizado
  (`DOMAIN/DEC-02`).

## Casos anormais

- **Kart parado com a volta em andamento**: o motor continua tocando (critério 01); o tom e a
  intensidade seguem a velocidade e o acelerador (critérios 02 e 03).
- **Som ligado no meio de uma volta**: a partir da ação do Jogador valem os critérios 01 a 03.
- **Som desligado no meio de uma volta**: nenhum som de motor toca (critério 07).
- **Volta retomada depois de pausa ou reposicionamento**: com o som ligado e a volta de novo em
  andamento, valem os critérios 01 a 03.
- **Recarga da página**: o jogo abre com o som desligado (critério 08), qualquer que fosse o estado
  antes. A história não muda estado de tentativa nem de resultado.
- **Perda de foco da janela ou da aba**: se a perda de foco tirar a volta de andamento por pausa, vale o
  critério 04; o seed não dá ao som regra própria para a perda de foco.
- **Navegador que só libera áudio depois de um gesto do usuário**: o som começa desligado e só liga por
  ação do Jogador (critérios 08 e 09), e essa ação é o gesto.
- **Arquivo de som ausente, ilegível, ou navegador sem áudio**: nenhum som de motor toca; a simulação, a
  volta, o tempo e os setores não mudam (`SEED/RD-01`, NFR-0004, NFR-0009).
- **Sem rede depois de o jogo abrir**: o som do motor vem dentro do download inicial (`SEED/RE-03`) e
  toca igual; nenhuma requisição é feita para buscá-lo (NFR-0003).
- **Sensor de inclinação ausente ou permissão negada (`web-mobile`)**: o controle recai para toque com
  estado visível (I4); os critérios do som não mudam.

## Fontes

- `SEED/US-3` — história e seus seis critérios.
- `SEED/VG`, `SEED/CTX` — motor gravado no lugar do tom sintetizado; esta feature é a dona do som do
  motor; o arquivo de origem está em `docs/sfx/`.
- `SEED/RD-01` — som é apresentação; a simulação, a volta e o tempo não dependem dele.
- `SEED/RE-03` — os sons vêm dentro do download inicial.
- `SEED/FE-05` — sem controle de volume: o som é só ligado ou desligado.
- `SEED/RI-02`, `DOMAIN/DEC-02` — o som do motor foi ouvido pelo dono do produto e serve como está:
  `docs/sfx/engine-loop.mp3`.

## Pontos em aberto

Nenhum — `DOMAIN/DEC-02` fechou em 2026-11-10 a qualidade do som do motor: o arquivo foi ouvido e serve
como está. A licença dos arquivos gerados por IA está em NFR-0010 e bloqueia só a promoção para produção.
