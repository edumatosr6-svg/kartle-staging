---
id: US-0004
title: Pneu cantando no deslize
feature: apresentacao-e-som
stage: req
status: validated
version: 1.1.0
sources: [SEED/US-4, SEED/VG, SEED/CTX, SEED/RD-01, SEED/RD-02, SEED/RD-03, SEED/RE-03, SEED/FE-02, SEED/RI-02, DOMAIN/DEC-02]
---

# US-0004 — Pneu cantando no deslize

## História

Como Jogador, quero ouvir o pneu cantar quando o kart desliza, para perceber que passei do limite de
aderência.

## Canais

- `web-desktop` e `web-mobile`: o mesmo comportamento do som de pneu nos dois canais.
- `web-mobile`: a história não usa o sensor de inclinação; com sensor ausente ou permissão negada, o
  controle recai para toque com estado visível (I4, `[DOMAIN]`) e o som de pneu segue os mesmos
  critérios.

## Pré-condições

- O jogo está aberto e o kart está na pista.
- Para os critérios 01, 02 e 06: o Jogador ligou o som.

## Critérios de aceite

- AC-US-0004-01: Com o som ligado, o som de pneu toca na saída de áudio do jogo enquanto o kart deixa
  marca de pneu no asfalto, vista na tela.
- AC-US-0004-02: Com o som ligado, o som de pneu para na saída de áudio do jogo em até 200 ms depois que
  o kart deixa de marcar o asfalto.
- AC-US-0004-03: Com o kart parado, nenhum som de pneu toca na saída de áudio do jogo.
- AC-US-0004-04: Com o kart rodando sem deslizar, sem deixar marca de pneu no asfalto, nenhum som de pneu
  toca na saída de áudio do jogo.
- AC-US-0004-05: Com o som desligado, nenhum som de pneu toca na saída de áudio do jogo.
- AC-US-0004-06: Com o som ligado, o som de pneu que toca na saída de áudio do jogo é a gravação de pneu
  de `docs/sfx/tire-screech.mp3` (`DOMAIN/DEC-02`).

## Casos anormais

- **Deslizes curtos em sequência**: o som acompanha a marca: toca enquanto o kart marca o asfalto
  (critério 01) e para em até 200 ms depois de cada vez que deixa de marcar (critério 02).
- **Pausa, resultado ou reposicionamento durante um deslize**: o seed não dá ao som de pneu regra própria
  para esses estados; vale o critério 02 a partir do momento em que o kart deixa de marcar o asfalto.
- **Som desligado no meio de um deslize**: nenhum som de pneu toca (critério 05).
- **Kart deslizando fora do asfalto**: a regra do seed liga o som à marca de pneu no asfalto
  (`SEED/RD-02`); som de grama está fora do escopo (`SEED/FE-02`).
- **Kart sobre a zebra**: o som da zebra continua o de `pista-kart-park` e não muda (`SEED/RD-03`,
  NFR-0007); o som de pneu segue só a marca de pneu no asfalto.
- **Arquivo de som ausente, ilegível, ou navegador sem áudio**: nenhum som de pneu toca; a marca de pneu
  continua desenhada, e a simulação, a volta, o tempo e os setores não mudam (`SEED/RD-01`, NFR-0004,
  NFR-0009).
- **Sem rede depois de o jogo abrir**: o som de pneu vem dentro do download inicial (`SEED/RE-03`) e toca
  igual; nenhuma requisição é feita para buscá-lo (NFR-0003).
- **Recarga da página**: o jogo abre com o som desligado (US-0003) e nenhum som de pneu toca (critério
  05). A história não muda estado de tentativa nem de resultado.
- **Sensor de inclinação ausente ou permissão negada (`web-mobile`)**: o controle recai para toque com
  estado visível (I4); os critérios do som não mudam.

## Fontes

- `SEED/US-4` — história e seus quatro critérios.
- `SEED/VG`, `SEED/CTX` — som de pneu gravado; o arquivo de origem está em `docs/sfx/`.
- `SEED/RD-02` — o pneu canta na mesma situação em que o kart deixa marca de pneu.
- `SEED/RD-01` — som é apresentação.
- `SEED/RD-03` — o som da zebra continua o de `pista-kart-park`.
- `SEED/RE-03` — os sons vêm dentro do download inicial.
- `SEED/FE-02` — som de grama, de batida, de largada e música fora do escopo.
- `SEED/RI-02`, `DOMAIN/DEC-02` — o som de pneu foi ouvido pelo dono do produto e serve como está:
  `docs/sfx/tire-screech.mp3`.

## Pontos em aberto

Nenhum — `DOMAIN/DEC-02` fechou em 2026-11-10 a qualidade do som de pneu: o arquivo foi ouvido e serve
como está. A licença dos arquivos gerados por IA está em NFR-0010 e bloqueia só a promoção para produção.
