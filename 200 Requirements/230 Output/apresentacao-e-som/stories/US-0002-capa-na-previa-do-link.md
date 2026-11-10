---
id: US-0002
title: Capa na prévia do link
feature: apresentacao-e-som
stage: req
status: validated
version: 1.1.0
sources: [SEED/US-2, SEED/VG, SEED/CTX, SEED/RD-01, SEED/RE-04, SEED/RI-01, SEED/FE-07, DOMAIN/DEC-01]
---

# US-0002 — Capa na prévia do link

## História

Como Visitante, quero ver a capa do jogo na prévia do link, para saber o que vou abrir.

## Canais

- Link compartilhado: o Visitante vê a prévia fora do jogo, no aplicativo ou site em que o link foi
  compartilhado. A prévia é montada a partir do que a página do jogo declara.
- `web-desktop` e `web-mobile`: a página do jogo é a mesma nos dois canais e declara a mesma capa, o
  mesmo título e a mesma descrição; nos dois canais, nenhuma tela do jogo mostra a capa. Nenhum critério
  desta história depende do dispositivo de entrada nem do sensor de inclinação; em `web-mobile`, com
  sensor ausente ou permissão negada, o controle recai para toque com estado visível (I4, `[DOMAIN]`) e
  a capa não muda.

## Pré-condições

- Nenhuma do lado do Visitante: ele ainda não abriu o jogo.
- Os critérios 01 a 06 são observados no documento da página do jogo entregue ao navegador.
- Para o critério 07: o jogo está aberto.

## Critérios de aceite

- AC-US-0002-01: O documento da página do jogo declara a capa como imagem de prévia de link.
- AC-US-0002-02: A imagem declarada como prévia de link tem 1200 px ou mais de largura.
- AC-US-0002-03: O documento da página do jogo declara, junto da capa, o título "Kartle".
- AC-US-0002-04: O documento da página do jogo declara, junto da capa, uma descrição de uma frase, em
  português.
- AC-US-0002-05: A imagem declarada como prévia de link é a imagem de `docs/art/cover.png`.
- AC-US-0002-06: A imagem declarada como prévia de link não contém texto dentro da imagem.
- AC-US-0002-07: Em `web-desktop` e `web-mobile`, nenhuma tela do jogo mostra a imagem da capa
  (`DOMAIN/DEC-01`).

## Casos anormais

- **Aplicativo ou site que não monta prévia de link**: o Visitante vê só o endereço; o link abre o jogo
  igual. Os critérios 01 a 06 são da página, e continuam observáveis nela.
- **Serviço de prévia que não consegue baixar a imagem**: o título e a descrição continuam declarados
  (critérios 03 e 04); a prévia pode aparecer sem imagem.
- **Busca da capa por um serviço de prévia**: acontece fora do jogo e antes de o Visitante abri-lo; não é
  uma requisição do jogo depois de aberto (NFR-0003).
- **Jogador que abre o jogo sem passar por uma prévia**: não vê a capa em nenhuma tela do jogo
  (critério 07).
- **Imagem da capa ausente no que é entregue**: a página fica sem imagem de prévia; a simulação, a volta
  e o tempo não mudam (`SEED/RD-01`, NFR-0009).
- **Recarga, abandono ou perda de foco**: a história não muda estado de tentativa nem de resultado; a
  página declara sempre a mesma capa, o mesmo título e a mesma descrição.

## Fontes

- `SEED/US-2` — história e seus três critérios.
- `SEED/VG`, `SEED/CTX` — o jogo hoje não tem capa; o arquivo de origem está em `docs/art/`.
- `SEED/RD-01` — imagem é apresentação.
- `SEED/RE-04` — nenhuma marca, logotipo ou texto de terceiros na imagem (NFR-0008).
- `SEED/RI-01`, `SEED/FE-07`, `DOMAIN/DEC-01` — a capa aparece só na prévia do link; nenhuma tela do
  jogo a mostra.

## Pontos em aberto

Nenhum — `DOMAIN/DEC-01` fechou em 2026-11-10 onde a capa aparece. A licença dos arquivos gerados por IA
está em NFR-0010 e bloqueia só a promoção para produção.
