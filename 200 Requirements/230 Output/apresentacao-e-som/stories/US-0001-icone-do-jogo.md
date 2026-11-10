---
id: US-0001
title: Ícone do jogo
feature: apresentacao-e-som
stage: req
status: validated
version: 1.1.0
sources: [SEED/US-1, SEED/VG, SEED/CTX, SEED/RD-01, SEED/RE-03, SEED/RE-04]
---

# US-0001 — Ícone do jogo

## História

Como Jogador, quero que o Kartle tenha um ícone, para achar o jogo entre abas e atalhos.

## Canais

- `web-desktop`: o ícone aparece na aba do navegador.
- `web-mobile`: o ícone aparece na aba do navegador e também no atalho criado por "adicionar à tela de
  início". O atalho da tela de início é só deste canal.
- `web-mobile`: a história não usa o sensor de inclinação; com sensor ausente ou permissão negada, o
  controle recai para toque com estado visível (I4, `[DOMAIN]`) e o ícone não muda.

## Pré-condições

- A página do jogo está aberta no navegador.
- Para o critério 03: o Jogador usou "adicionar à tela de início" no navegador do celular.

## Critérios de aceite

- AC-US-0001-01: Em `web-desktop`, com a página do jogo aberta, a aba do navegador mostra o ícone do
  Kartle.
- AC-US-0001-02: Em `web-mobile`, com a página do jogo aberta, a aba do navegador mostra o ícone do
  Kartle.
- AC-US-0001-03: Em `web-mobile`, o atalho criado por "adicionar à tela de início" mostra, na tela de
  início do aparelho, o ícone do Kartle.
- AC-US-0001-04: O ícone mostrado na aba e no atalho é a imagem de `docs/art/icon.png`.
- AC-US-0001-05: O ícone mostrado na aba e no atalho não contém texto.

## Casos anormais

- **Navegador que não desenha ícone de página na aba**: não há onde observar os critérios 01 e 02 nesse
  navegador; o jogo abre e funciona igual, porque a imagem é apresentação (`SEED/RD-01`).
- **Navegador de celular sem "adicionar à tela de início"**: o critério 03 não é observável nesse
  navegador; os critérios 02, 04 e 05 continuam valendo.
- **Sem rede depois de o jogo abrir**: o ícone vem dentro do download inicial (`SEED/RE-03`); nenhuma
  requisição é feita para buscá-lo (NFR-0003).
- **Imagem do ícone ausente ou ilegível para o navegador**: a aba fica sem o ícone do Kartle; a
  simulação, a volta e o tempo não mudam (`SEED/RD-01`, NFR-0009).
- **Recarga da página**: a aba volta a mostrar o mesmo ícone (critérios 01 e 02). A história não muda
  estado de tentativa nem de resultado.
- **Sensor de inclinação ausente ou permissão negada (`web-mobile`)**: o controle recai para toque com
  estado visível (I4); o ícone não muda.

## Fontes

- `SEED/US-1` — história e seus três critérios.
- `SEED/VG`, `SEED/CTX` — o jogo hoje não tem ícone; o arquivo de origem está em `docs/art/`.
- `SEED/RD-01` — imagem é apresentação.
- `SEED/RE-03` — as imagens vêm dentro do download inicial (NFR-0003).
- `SEED/RE-04` — nenhuma marca, logotipo ou texto de terceiros na imagem (NFR-0008).

## Pontos em aberto

Nenhum nesta história. A licença dos arquivos gerados por IA está em NFR-0010 e bloqueia só a promoção
para produção.
