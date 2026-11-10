---
id: SCR-0002
title: Aba do navegador, atalho da tela de início e prévia do link
feature: apresentacao-e-som
stage: fspec
status: validated
version: 1.0.0
sources: [US-0001, US-0002, AC-US-0001-01, AC-US-0001-02, AC-US-0001-03, AC-US-0001-04, AC-US-0001-05, AC-US-0002-01, AC-US-0002-02, AC-US-0002-03, AC-US-0002-04, AC-US-0002-05, AC-US-0002-06]
---

# SCR-0002 — Aba do navegador, atalho da tela de início e prévia do link

## Propósito

As três superfícies fora da área de jogo em que a identidade do Kartle aparece: a aba do navegador, com o
ícone; o atalho da tela de início do celular, com o ícone; e a prévia do link, com a capa, o título "Kartle"
e a descrição. Nenhuma das três é desenhada pelo jogo: o navegador, o aparelho e o aplicativo ou site em que
o link foi compartilhado as montam a partir do que o documento da página declara
([API-0001](../api/API-0001-declaracoes-da-pagina-do-jogo.md)). O que este arquivo especifica é o que cada
uma tem de mostrar quando o leitor usa as declarações.

## Canal

| Superfície | `web-desktop` | `web-mobile` | Link compartilhado |
|---|---|---|---|
| Aba do navegador com o ícone | sim | sim | — |
| Atalho da tela de início com o ícone | — | sim | — |
| Prévia do link com capa, título e descrição | — | — | sim: o Visitante a vê fora do jogo |
| Documento lido | o mesmo | o mesmo | o mesmo |

Em `web-mobile`, com sensor ausente ou permissão negada, o controle recai para toque com estado visível
(I4); nenhuma das três superfícies muda.

## Pontos de entrada

- Aba: o Jogador abre o endereço do Kartle.
- Atalho: o Jogador usa "adicionar à tela de início" no navegador do celular, com a página aberta.
- Prévia: alguém compartilha um link do Kartle num aplicativo ou site que monta prévia.

## Estados

| Estado | Condição | Chamadas | O que é mostrado | Fonte |
|---|---|---|---|---|
| Carregando | O documento ainda não chegou ao leitor | entrega do documento ([API-0001](../api/API-0001-declaracoes-da-pagina-do-jogo.md)) | Aba sem o ícone do Kartle, como o navegador a mostra antes de a página chegar; prévia ainda não montada | US-0001, Pré-condições |
| Vazio | O leitor não usa as declarações: navegador que não desenha ícone de página; celular sem "adicionar à tela de início"; aplicativo que não monta prévia | — | Aba ou atalho sem ícone; só o endereço no lugar da prévia. O link abre o jogo igual | US-0001 e US-0002, casos anormais |
| Populado — aba | Página aberta, `pageIcon` lido | entrega do documento | O ícone do Kartle: a forma entregue de `docs/art/icon.png`, sem texto | AC-US-0001-01, AC-US-0001-02, AC-US-0001-04, AC-US-0001-05 |
| Populado — atalho (`web-mobile`) | Atalho criado, `homeScreenIcon` lido | entrega do documento | O mesmo ícone, na tela de início do aparelho | AC-US-0001-03, AC-US-0001-04, AC-US-0001-05 |
| Populado — prévia | Serviço de prévia leu o documento e a capa | entrega do documento, fora do jogo | A capa (forma entregue de `docs/art/cover.png`, 1200 px ou mais de largura, sem texto dentro da imagem), o título "Kartle" e a descrição de uma frase em português | AC-US-0002-01, AC-US-0002-02, AC-US-0002-03, AC-US-0002-04, AC-US-0002-05, AC-US-0002-06 |
| Erro | Imagem do ícone ou da capa ausente, ilegível ou não baixada pelo serviço de prévia | entrega do documento | Aba ou atalho sem o ícone do Kartle; prévia sem imagem, com o título e a descrição. O jogo, a volta e o tempo não mudam | US-0001, caso anormal "Imagem do ícone ausente ou ilegível"; US-0002, caso anormal "Serviço de prévia que não consegue baixar a imagem" |
| Offline | Rede desligada depois de o jogo abrir | nenhuma | A aba continua com o ícone: ele veio no download inicial. A prévia não depende do jogo aberto | NFR-0003 |
| Permissão negada | Não se aplica: nenhuma das três superfícies pede permissão ao Jogador nem ao Visitante. Sem sensor ou com permissão de sensor negada em `web-mobile`, nada muda | — | Igual a Populado | I4 |

## Navegação

- Da aba: é a própria página do jogo; fechar a aba fecha o jogo.
- Do atalho: tocar no atalho abre o endereço do Kartle, e o fluxo de abertura é o de
  [FLOW-0001](../flows/FLOW-0001-abertura-da-pagina-e-entrega-dos-arquivos.md).
- Da prévia: abrir o link leva o Visitante ao endereço do Kartle; ele passa a ser Jogador e não vê a capa em
  nenhuma tela do jogo ([FEAT-0002](../features/FEAT-0002-capa-na-previa-do-link.md)).

## Ações

| Ação | Quem | O que produz |
|---|---|---|
| Abrir o endereço do Kartle | Jogador, ambos os canais | A aba mostra o ícone do Kartle |
| Recarregar a página | Jogador | A aba volta a mostrar o mesmo ícone; nenhum estado de tentativa ou de resultado muda |
| "Adicionar à tela de início" | Jogador, `web-mobile` | O atalho mostra o ícone do Kartle |
| Compartilhar ou receber um link | Jogador ou Visitante | O aplicativo ou site monta a prévia com a capa, "Kartle" e a descrição |
| Abrir o link a partir da prévia | Visitante | O jogo abre, com o som desligado e sem a capa em nenhuma tela |
