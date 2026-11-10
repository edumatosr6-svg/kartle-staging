---
id: FEAT-0002
title: Capa, título e descrição na prévia do link
feature: apresentacao-e-som
stage: fspec
status: validated
version: 1.0.0
sources: [US-0002, AC-US-0002-01, AC-US-0002-02, AC-US-0002-03, AC-US-0002-04, AC-US-0002-05, AC-US-0002-06, AC-US-0002-07]
---

# FEAT-0002 — Capa na prévia do link

## Resumo

O Visitante que recebe um link do Kartle vê, na prévia, a capa do jogo, o título "Kartle" e uma descrição
de uma frase em português, antes de abrir o jogo. A página do jogo declara os três; quem monta a prévia é o
aplicativo ou site em que o link foi compartilhado. A capa é a imagem de `docs/art/cover.png`, sem texto
dentro da imagem, e aparece **só** na prévia: nenhuma tela do jogo a mostra (`DOMAIN/DEC-01`).

## Canais

- Link compartilhado: o Visitante vê a prévia fora do jogo.
- `web-desktop` e `web-mobile`: o documento da página é o mesmo e declara a mesma capa, o mesmo título e a
  mesma descrição ([API-0001](../api/API-0001-declaracoes-da-pagina-do-jogo.md)); nos dois canais nenhuma
  tela do jogo mostra a capa. Em `web-mobile`, com sensor ausente ou permissão negada, o controle recai
  para toque com estado visível (I4) e a capa não muda.

## Requisitos

- REQ-FEAT-0002-01: O sistema SHALL declarar, no documento da página do jogo, a capa como imagem de prévia
  de link (`previewImage`) (AC-US-0002-01).
- REQ-FEAT-0002-02: O sistema SHALL entregar a imagem declarada em `previewImage` com 1200 px ou mais de
  largura (AC-US-0002-02).
- REQ-FEAT-0002-03: O sistema SHALL declarar, no mesmo documento e junto da capa, o título de prévia
  (`previewTitle`) com o texto exato "Kartle" (AC-US-0002-03).
- REQ-FEAT-0002-04: O sistema SHALL declarar, no mesmo documento e junto da capa, uma descrição de prévia
  (`previewDescription`) de exatamente uma frase, em português (AC-US-0002-04).
- REQ-FEAT-0002-05: O sistema SHALL entregar, como imagem declarada em `previewImage`, a forma entregue da
  imagem `docs/art/cover.png` e nenhuma outra imagem (AC-US-0002-05).
- REQ-FEAT-0002-06: O sistema SHALL NOT entregar imagem de prévia de link que contenha texto dentro da
  imagem (AC-US-0002-06).
- REQ-FEAT-0002-07: O sistema SHALL NOT mostrar a imagem da capa em nenhuma tela do jogo, em `web-desktop`
  e em `web-mobile` (AC-US-0002-07).

## Comportamento

Nominal: [FLOW-0001](../flows/FLOW-0001-abertura-da-pagina-e-entrega-dos-arquivos.md). Declarações:
[API-0001](../api/API-0001-declaracoes-da-pagina-do-jogo.md). Prévia e seus estados:
[SCR-0002](../screens/SCR-0002-aba-atalho-e-previa-do-link.md). Forma entregue, peso e a capa dentro do
download inicial: [RULE-0003](../rules/RULE-0003-arquivos-da-feature-peso-e-licenca.md).

O texto da descrição não é fixado pelos requisitos: o que se exige é uma frase só, em português. O texto
escolhido é registrado pelo D-Spec e não muda entre entregas do mesmo build.

| Situação | Comportamento |
|---|---|
| Aplicativo ou site que não monta prévia de link | O Visitante vê só o endereço; o link abre o jogo igual; as declarações continuam no documento |
| Serviço de prévia que não consegue baixar a imagem, ou tempo esgotado | O título e a descrição continuam declarados; a prévia pode aparecer sem imagem |
| Busca do documento e da capa por um serviço de prévia | Acontece fora do jogo e antes de o Visitante abri-lo; é leitura, não muda estado e não é requisição do jogo depois de aberto. Repetida ou fora de ordem, dá a mesma resposta; nenhuma deduplicação é necessária |
| Jogador que abre o jogo sem passar por uma prévia | Não vê a capa em nenhuma tela do jogo |
| Imagem da capa ausente no que é entregue | A página fica sem imagem de prévia; a simulação, a volta e o tempo não mudam ([FEAT-0005](FEAT-0005-requisitos-transversais.md)) |
| Recarga, abandono ou perda de foco | Nenhum estado de tentativa ou de resultado muda; o documento declara sempre a mesma capa, o mesmo título e a mesma descrição |
| Sem rede depois de o jogo abrir | A prévia não depende do jogo aberto; nenhuma tela do jogo busca a capa (D-FS-08) |

## Estado

Não define estados. Não lê nem muda estado de tentativa, de resultado ou de simulação.

## Configuração

Nenhuma. O título, a descrição e a capa não são ajustáveis pelo Jogador; nenhuma configuração existe para
forçar um evento, injetar um estado ou habilitar um caminho de depuração.

## Critérios de aceite

- O documento da página do jogo entregue traz `previewImage` (satisfaz AC-US-0002-01; cobre o requisito
  01).
- A imagem para a qual `previewImage` resolve tem largura de 1200 px ou mais (satisfaz AC-US-0002-02; cobre
  o requisito 02).
- O documento traz `previewTitle` igual a "Kartle" (satisfaz AC-US-0002-03; cobre o requisito 03).
- O documento traz `previewDescription` com uma frase só, em português (satisfaz AC-US-0002-04; cobre o
  requisito 04).
- A imagem para a qual `previewImage` resolve é a forma entregue de `docs/art/cover.png` (satisfaz
  AC-US-0002-05; cobre o requisito 05).
- A imagem de prévia não contém texto dentro da imagem (satisfaz AC-US-0002-06; cobre o requisito 06).
- Percorridas as telas do jogo em `web-desktop` e em `web-mobile` — inicial, início de volta, corrida,
  pausa e resultado —, nenhuma mostra a imagem da capa (satisfaz AC-US-0002-07; cobre o requisito 07).

## Pontos em aberto

Nenhum.
