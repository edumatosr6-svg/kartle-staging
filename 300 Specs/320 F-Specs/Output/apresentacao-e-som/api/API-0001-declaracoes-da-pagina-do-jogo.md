---
id: API-0001
title: Contrato das declarações da página do jogo
feature: apresentacao-e-som
stage: fspec
status: validated
version: 1.0.1
sources: [US-0001, US-0002, NFR-0003, AC-US-0001-01, AC-US-0001-02, AC-US-0001-03, AC-US-0001-04, AC-US-0002-01, AC-US-0002-02, AC-US-0002-03, AC-US-0002-04, AC-US-0002-05]
---

# API-0001 — Contrato das declarações da página do jogo

Contrato único, para `web-desktop`, `web-mobile` e os serviços de prévia de link, do que o documento da
página do jogo declara: o ícone, a imagem de prévia, o título e a descrição. Não é endpoint de API: é o
documento que a publicação do jogo entrega no endereço do Kartle; não há prefixo nem chave de domínio no
MVP (diretrizes do estágio). Os nomes abaixo são nomes lógicos das declarações, em `camelCase` plano com a
unidade no sufixo (D-FS-06); a marcação que carrega cada uma no documento é do D-Spec.

## Operação

| Operação | Propósito | Quem lê |
|---|---|---|
| Entrega do documento da página do jogo | Dar ao navegador e aos serviços de prévia as declarações de identidade do jogo | O navegador do Jogador, ao abrir o endereço; o aplicativo ou site que monta a prévia de um link |

## Auth

Sem sessão e sem conta (RNF10). Papel permitido: `player` (anônimo), único papel do produto; o Visitante e
os serviços de prévia leem o mesmo documento sem se identificar. Contrato deliberadamente público: é a
página de entrada do jogo, não carrega dado pessoal (I6) nem segredo (D-FS-07), e a leitura não altera
estado.

## Parâmetros

Nenhum parâmetro de caminho ou de consulta. O documento é o mesmo para todo leitor, canal e momento, dentro
do mesmo build.

## Corpo do pedido

Nenhum.

## Resposta — declarações do documento

| Declaração | Tipo | Unidade | Obrigatória | Padrão e restrições |
|---|---|---|---|---|
| `pageIcon` | endereço de imagem | — | sim | resolve para a forma entregue de `docs/art/icon.png` (`ICON_IMAGE`); é o ícone que a aba mostra. Sem padrão: antes da feature o documento não declarava ícone; declarar não muda nenhum comportamento do jogo |
| `homeScreenIcon` | endereço de imagem | — | sim | resolve para a forma entregue de `docs/art/icon.png` (`ICON_IMAGE`); é o ícone do atalho da tela de início em `web-mobile`. Sem padrão; neutro pelo mesmo motivo |
| `previewImage` | endereço de imagem | — | sim | resolve para a forma entregue de `docs/art/cover.png` (`COVER_IMAGE`), imagem com 1200 px ou mais de largura (propriedade da imagem, conferida por `coverWidthPx` em [API-0003](API-0003-registros-de-verificacao.md); o documento não declara a largura). Sem padrão; neutro: só os serviços de prévia a usam |
| `previewTitle` | texto | — | sim | exatamente "Kartle" |
| `previewDescription` | texto | — | sim | exatamente uma frase, em português; o mesmo texto em toda entrega do mesmo build |

`previewTitle` e `previewDescription` são declarados junto de `previewImage`, no mesmo documento e no mesmo
grupo de declarações de prévia. Nenhuma declaração carrega dado do Jogador nem do Visitante (I6).

Resposta na forma vazia: não existe. O documento entregue traz sempre as cinco declarações; um documento sem
alguma delas não atende este contrato.

## Erros

Não há código de rejeição próprio: o contrato é um documento estático. As condições anormais e o que o
leitor observa:

| Condição | O que o leitor observa | Efeito no jogo |
|---|---|---|
| A imagem para a qual `pageIcon` ou `homeScreenIcon` resolve está ausente ou ilegível | A aba ou o atalho ficam sem o ícone do Kartle | Nenhum: a simulação, a volta e o tempo não mudam (NFR-0009) |
| A imagem para a qual `previewImage` resolve está ausente, ou o serviço de prévia não consegue baixá-la | A prévia aparece sem imagem; `previewTitle` e `previewDescription` continuam declarados | Nenhum |
| O leitor não usa as declarações (navegador que não desenha ícone; aplicativo que não monta prévia) | Nada é mostrado; o link abre o jogo igual | Nenhum |
| O documento não chega (sem rede antes de o jogo abrir, tempo esgotado) | O jogo não abre | Fora deste contrato: nenhum requisito desta feature muda esse comportamento |

## Idempotência

Leitura pura: pedir o documento de novo, duas vezes ou fora de ordem devolve as mesmas declarações e não
altera estado. Não há chave. Nenhum evento externo muda estado por este contrato, e por isso nenhuma
deduplicação é necessária (D-FS-03).

## Paginação e sondagem

Sem paginação e sem sondagem. O navegador lê o documento uma vez por abertura ou recarga; depois de o jogo
abrir, nenhuma leitura é feita para buscar o ícone ou a capa (NFR-0003, D-FS-08).

## Compatibilidade

| Mudança | Tratamento |
|---|---|
| `pageIcon`, `homeScreenIcon`, `previewImage`, `previewTitle`, `previewDescription` | Declarações novas. Antes da feature o documento não declarava ícone nem capa; nenhuma declaração existente é renomeada ou removida |
| Contratos publicados (arquivo de pista, dado persistido, texto compartilhado) | Inalterados |
| Significado de uma declaração | Nunca muda sob o mesmo nome; uma mudança futura exige nome novo (I3) |
| Declaração retirada | Nenhuma: não há nome antigo a rejeitar |
