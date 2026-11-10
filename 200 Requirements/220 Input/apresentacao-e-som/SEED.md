---
name: apresentacao-e-som
description: Capa e ícone do Kartle e sons gravados de kart (motor e pneu cantando) no lugar do som sintetizado do motor, entregues dentro do download inicial, sem rede depois de o jogo abrir. Ler antes de qualquer trabalho com ícone, imagem de capa, prévia de link, som do motor ou som de pneu.
revision: 2
date: 2026-11-10
author: eduardo.matos
channels: [web-desktop, web-mobile]
---

## Visão geral

O Kartle passa a ter identidade visual e som de kart. A aba do navegador e o atalho no celular mostram um
ícone próprio, o link compartilhado mostra uma capa, e o jogador ouve um motor de kart gravado e o pneu
cantando quando o kart desliza. Hoje o jogo não tem ícone nem capa, e o motor é um tom sintetizado.

## Contexto

O jogo hoje é todo desenhado e sintetizado em código: não entrega nenhum arquivo de imagem nem de som. O
download inicial medido no build de 2026-11-06 soma 186.291 bytes comprimidos (`NOTES.md`). O som do
motor existe no jogo desde antes do pipeline e não pertence a nenhuma feature especificada; esta feature
passa a ser a dona dele. O som da zebra pertence a `pista-kart-park` (US-5) e não muda.

Os arquivos de origem estão em `docs/art/` (capa e ícone) e `docs/sfx/` (motor e pneu), gerados por IA em
2026-11-10. As medidas de cada um estão em `NOTES.md`.

## Atores e canais

| Ator | Canal | O que faz |
|---|---|---|
| Jogador | `web-desktop` | Vê o ícone na aba, liga o som e ouve motor e pneu enquanto pilota |
| Jogador | `web-mobile` | O mesmo no celular, e vê o ícone ao adicionar o jogo à tela de início |
| Visitante | link compartilhado | Vê a capa e o nome do jogo na prévia do link, antes de abrir o jogo |

## Histórias de usuário

- **US-1** Como Jogador, quero que o Kartle tenha um ícone, para achar o jogo entre abas e atalhos.
  - A aba do navegador mostra o ícone do Kartle, em `web-desktop` e `web-mobile`.
  - Em `web-mobile`, o atalho criado por "adicionar à tela de início" mostra o ícone do Kartle.
  - O ícone mostrado é a imagem de `docs/art/icon.png`, sem texto.
- **US-2** Como Visitante, quero ver a capa do jogo na prévia do link, para saber o que vou abrir.
  - A página do jogo declara a capa como imagem de prévia de link, com 1200 px ou mais de largura.
  - A página declara, junto da capa, o título "Kartle" e uma descrição de uma frase, em português.
  - A capa mostrada é a imagem de `docs/art/cover.png`, sem texto dentro da imagem.
- **US-3** Como Jogador, quero ouvir um motor de kart de verdade, para sentir a velocidade.
  - Com o som ligado e uma volta em andamento, o som do motor toca sem intervalo de silêncio maior que
    50 ms.
  - O tom do motor a 20 m/s é mais agudo que a 5 m/s, com o mesmo acelerador.
  - Na mesma velocidade, o motor soa mais alto com o acelerador pressionado do que solto.
  - Quando a volta deixa de estar em andamento (pausa, resultado ou reposicionamento), o motor silencia em
    até 200 ms.
  - Com o som desligado, nenhum som de motor toca.
  - O som começa desligado e só liga por ação do Jogador, como hoje.
- **US-4** Como Jogador, quero ouvir o pneu cantar quando o kart desliza, para perceber que passei do
  limite de aderência.
  - Com o som ligado, o som de pneu toca enquanto o kart deixa marca de pneu no asfalto.
  - O som de pneu para em até 200 ms depois que o kart deixa de marcar o asfalto.
  - Com o kart parado ou rodando sem deslizar, nenhum som de pneu toca.
  - Com o som desligado, nenhum som de pneu toca.

## Regras de domínio

| Regra | Fonte |
|---|---|
| Som e imagem são apresentação: a simulação, a volta e o tempo não dependem deles | I2 |
| O pneu canta na mesma situação em que o kart deixa marca de pneu | marca de pneu que o jogo já desenha (`NOTES.md`); decisão desta feature |
| O som da zebra continua o ruído curto e grave definido em `pista-kart-park` | `pista-kart-park` US-5, OPEN-04 fechado em 2026-10-22 |

## Requisitos não funcionais

| Requisito | Limite |
|---|---|
| Download inicial, com capa, ícone e sons incluídos | menor que 3 MB comprimidos (RNF02) |
| Peso somado dos arquivos desta feature, como entregues ao navegador | no máximo 300.000 bytes |
| Rede depois de o jogo abrir | nenhuma requisição para buscar som ou imagem desta feature (RNF08) |
| Determinismo | mesmas entradas, mesmo tempo e mesmos setores com o som ligado e desligado (RNF07) |
| Taxa de quadros | os limites de RNF03 já especificados continuam valendo com os sons tocando |

## Restrições

- O som da zebra não muda. Motivo: é critério validado de `pista-kart-park` (US-5).
- Nenhuma dependência nova de execução. Motivo: restrição já adotada nas features anteriores.
- Os sons e as imagens vêm dentro do download inicial. Motivo: o jogo tem de funcionar sem servidor depois
  de aberto (RNF08).
- Nenhuma imagem desta feature traz marca, logotipo ou texto de terceiros.

## Impacto no domínio

- **I2**: som e imagem ficam do lado da apresentação. Nenhum dado de simulação muda.
- Demais invariantes: nenhuma.

## Riscos e incógnitas

OPEN-01 e OPEN-02 foram fechados pelo dono do produto em 2026-11-10, e as decisões estão em `DOMAIN.md`.

- **OPEN-01** Capa dentro do jogo: a capa aparece só na prévia do link. Fechado em 2026-11-10.
- **OPEN-02** Qualidade dos sons: os dois arquivos foram ouvidos e servem como estão. Fechado em
  2026-11-10.
- **OPEN-03** Licença dos arquivos gerados por IA (Higgsfield, gerados em 2026-11-10): o plano usado permite
  uso num jogo publicado? O dono do produto confirma nos termos do plano.
  **Bloqueia só a promoção para produção.** Staging pode usar os arquivos.

## Fora do escopo

- Texturas da pista: são de `pista-kart-park` (revisão 4 proposta).
- Música, som de batida, som de grama e som de largada.
- Som da zebra por arquivo: continua sintetizado.
- Tela de abertura animada, vídeo ou trailer dentro do jogo.
- Controle de volume: o som continua só ligado ou desligado.
- Capa dentro do jogo: a capa aparece só na prévia do link (OPEN-01).
- Céu de fundo e cenário.
