---
id: FEAT-0001
title: Ícone do jogo na aba e no atalho da tela de início
feature: apresentacao-e-som
stage: fspec
status: validated
version: 1.0.0
sources: [US-0001, AC-US-0001-01, AC-US-0001-02, AC-US-0001-03, AC-US-0001-04, AC-US-0001-05]
---

# FEAT-0001 — Ícone do jogo

## Resumo

O Kartle passa a ter um ícone: o Jogador o vê na aba do navegador e, no celular, no atalho criado por
"adicionar à tela de início". O ícone é a imagem de `docs/art/icon.png`, sem texto. O documento da página
do jogo o declara; quem o desenha é o navegador.

## Canais

- `web-desktop`: ícone na aba do navegador.
- `web-mobile`: ícone na aba do navegador e no atalho da tela de início. O atalho é só deste canal. A
  feature não usa o sensor de inclinação; com sensor ausente ou permissão negada, o controle recai para
  toque com estado visível (I4) e o ícone não muda.
- O documento da página é o mesmo nos dois canais (um contrato só:
  [API-0001](../api/API-0001-declaracoes-da-pagina-do-jogo.md)).

## Requisitos

- REQ-FEAT-0001-01: O sistema SHALL declarar, no documento da página do jogo, o ícone do Kartle como ícone
  de página (`pageIcon`), de modo que a aba do navegador o mostre com a página aberta, em `web-desktop` e
  em `web-mobile` (AC-US-0001-01, AC-US-0001-02).
- REQ-FEAT-0001-02: O sistema SHALL declarar, no documento da página do jogo, o ícone do Kartle como ícone
  do atalho da tela de início (`homeScreenIcon`), de modo que o atalho criado por "adicionar à tela de
  início" em `web-mobile` o mostre (AC-US-0001-03).
- REQ-FEAT-0001-03: O sistema SHALL entregar, como ícone da aba e do atalho, a forma entregue da imagem
  `docs/art/icon.png` e nenhuma outra imagem (AC-US-0001-04).
- REQ-FEAT-0001-04: O sistema SHALL NOT entregar ícone da aba ou do atalho que contenha texto
  (AC-US-0001-05).

## Comportamento

Nominal: [FLOW-0001](../flows/FLOW-0001-abertura-da-pagina-e-entrega-dos-arquivos.md). Declarações:
[API-0001](../api/API-0001-declaracoes-da-pagina-do-jogo.md). Onde o ícone aparece e em que estados:
[SCR-0002](../screens/SCR-0002-aba-atalho-e-previa-do-link.md). Forma entregue e peso:
[RULE-0003](../rules/RULE-0003-arquivos-da-feature-peso-e-licenca.md).

| Situação | Comportamento |
|---|---|
| Navegador que não desenha ícone de página na aba | Não há onde observar o ícone na aba; a declaração continua no documento e o jogo funciona igual |
| Navegador de celular sem "adicionar à tela de início" | O atalho não é observável; a aba, a origem e a ausência de texto continuam valendo |
| Imagem do ícone ausente ou ilegível para o navegador | A aba fica sem o ícone do Kartle; a simulação, a volta e o tempo não mudam ([FEAT-0005](FEAT-0005-requisitos-transversais.md)) |
| Recarga da página | O documento traz as mesmas declarações; a aba volta a mostrar o mesmo ícone |
| Documento pedido duas vezes ou fora de ordem | Leitura sem estado: cada entrega traz as mesmas declarações |
| Sem rede depois de o jogo abrir | O ícone vem dentro do download inicial; nenhuma requisição é feita para buscá-lo (D-FS-08; [FEAT-0005](FEAT-0005-requisitos-transversais.md)) |
| Tempo esgotado ao baixar o ícone na abertura | A aba fica sem o ícone do Kartle; o jogo abre igual |
| Sensor ausente ou permissão negada (`web-mobile`) | Toque com estado visível (I4); o ícone não muda |

## Estado

Não define estados. Não lê nem muda estado de tentativa, de resultado ou de simulação.

## Configuração

Nenhuma. Não há ajuste de ícone exposto ao Jogador; nenhuma configuração existe para forçar um evento,
injetar um estado ou habilitar um caminho de depuração.

## Critérios de aceite

- Com a página do jogo aberta em `web-desktop`, a aba do navegador mostra o ícone do Kartle, e o documento
  entregue traz `pageIcon` (satisfaz AC-US-0001-01; cobre o requisito 01).
- Com a página do jogo aberta em `web-mobile`, a aba do navegador mostra o ícone do Kartle (satisfaz
  AC-US-0001-02; cobre o requisito 01).
- Em `web-mobile`, depois de "adicionar à tela de início", o atalho na tela de início do aparelho mostra o
  ícone do Kartle, e o documento entregue traz `homeScreenIcon` (satisfaz AC-US-0001-03; cobre o
  requisito 02).
- A imagem para a qual `pageIcon` e `homeScreenIcon` resolvem é a forma entregue de `docs/art/icon.png`
  (satisfaz AC-US-0001-04; cobre o requisito 03).
- A imagem mostrada na aba e no atalho não contém texto (satisfaz AC-US-0001-05; cobre o requisito 04).

## Pontos em aberto

Nenhum.
