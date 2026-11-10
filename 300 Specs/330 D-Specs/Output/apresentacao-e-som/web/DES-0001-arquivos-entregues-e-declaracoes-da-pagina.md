---
id: DES-0001
title: Arquivos entregues e declarações do documento da página
feature: apresentacao-e-som
stage: dspec
status: validated
version: 1.1.0
sources: [FEAT-0001, FEAT-0002, API-0001, RULE-0003, FLOW-0001, SCR-0002, REQ-FEAT-0001-01, REQ-FEAT-0001-02, REQ-FEAT-0001-03, REQ-FEAT-0001-04, REQ-FEAT-0002-01, REQ-FEAT-0002-02, REQ-FEAT-0002-03, REQ-FEAT-0002-04, REQ-FEAT-0002-05, REQ-FEAT-0002-06, REQ-FEAT-0002-07, REQ-FEAT-0005-02, REQ-FEAT-0005-04, REQ-FEAT-0005-12]
---

# DES-0001 — Arquivos entregues e declarações do documento da página

## Realiza

- O ícone declarado como ícone de página e como ícone do atalho, vindo de `docs/art/icon.png`, sem texto
  (REQ-FEAT-0001-01 a -04; AC-US-0001-01 a -05).
- A capa declarada como imagem de prévia com 1200 px de largura, o título "Kartle" e a descrição de uma
  frase, vindos de `docs/art/cover.png`, sem texto, e nunca mostrada pelo jogo (REQ-FEAT-0002-01 a -07;
  AC-US-0002-01 a -07).
- Os 4 arquivos na forma entregue, somando no máximo 300.000 bytes, todos no download inicial, e nenhum
  arquivo de som da zebra (REQ-FEAT-0005-02, -04, -12).

## Posicionamento

Camada **aplicação**.

- `src/assets/`, **pasta nova** sob `<source>`: `icon.png`, `cover.jpg`, `engine-loop.mp3`,
  `tire-screech.mp3` e `feature-assets.json`. Motivo de ser nova: o projeto não tem pasta de arquivos
  estáticos (não existe `public/`), e os arquivos de `docs/` são a origem pesada, que não vai para o build.
- `index.html`, alterado: 6 elementos novos em `<head>`.
- Os arquivos de origem `docs/art/icon.png`, `docs/art/cover.png`, `docs/sfx/engine-loop.mp3` e
  `docs/sfx/tire-screech.mp3` passam a ser versionados: o F-Spec os nomeia como origem e a verificação
  confere o resumo deles. As demais imagens de `docs/art/` não são desta feature.

Decisão de fundo: [ADR-0001](../adr/ADR-0001-arquivos-versionados-e-pedidos-pelo-documento.md).

## Interface

### Formas entregues

Os valores, as transformações e os tetos de bytes estão em
[DM-0001](../data/DM-0001-registro-de-origem-dos-arquivos-e-estado-do-som.md). As duas imagens são derivadas
uma única vez, fora do build, por redimensionamento com reamostragem Lanczos e recodificação; os dois sons
são cópia byte a byte. Nenhum conteúdo é acrescentado. O build não converte nada: o Vite copia cada imagem
para `dist/assets/` com o resumo no nome, sem tocar nos bytes, e põe os bytes de cada gravação, também sem
tocá-los, como texto `data:` em base 64 dentro do JS de entrada (importação `?inline` de
[DES-0003](DES-0003-saida-de-audio-gravacoes-e-controle-de-som.md)). As gravações não viram arquivo em
`dist/`.

### Declarações em `index.html`

Acrescentadas dentro de `<head>`, depois de `<title>` (`index.html:8`). Os endereços são os de origem; o
build os troca pelos nomes com resumo.

| Declaração lógica (API-0001) | Marcação | Valor |
|---|---|---|
| `pageIcon` | `<link rel="icon" type="image/png" sizes="192x192" href="/src/assets/icon.png" />` | a forma entregue do ícone |
| `homeScreenIcon` | `<link rel="apple-touch-icon" sizes="192x192" href="/src/assets/icon.png" />` | o mesmo arquivo; é a declaração que o Safari do iOS e o Chrome do Android leem para o atalho quando não há manifesto |
| `previewTitle` | `<meta property="og:title" content="Kartle" />` | exatamente `Kartle` |
| `previewDescription` | `<meta property="og:description" content="Corra contra o relógio em uma pista de kart e busque a sua melhor volta." />` | o texto registrado em [ADR-0003](../adr/ADR-0003-lacunas-do-f-spec-resolvidas-no-projeto.md) |
| `previewImage` | `<meta property="og:image" content="/src/assets/cover.jpg" />` | a forma entregue da capa |

As três declarações de prévia ficam juntas, nesta ordem, em linhas consecutivas: é o "mesmo grupo" de
API-0001. O documento não declara a largura da capa (API-0001).

### Como cada arquivo entra no download inicial

| Arquivo | Como entra | Marcação em `index.html` |
|---|---|---|
| ícone | o navegador busca o `rel="icon"` ao abrir a página | a declaração `pageIcon`, acima |
| capa | pré-carregada pelo documento, sem ser desenhada (RULE-0003, REQ-FEAT-0005-04) | `<link rel="preload" as="image" href="/src/assets/cover.jpg" />` |
| som do motor, som de pneu | embutidos no JS de entrada, que o documento já manda buscar pelo `<script type="module">` existente; não têm endereço e não são pedidos | nenhuma: `index.html` não referencia as gravações |

`index.html` **não** ganha `preload` de som nem qualquer elemento que aponte para um `.mp3`
([ADR-0001](../adr/ADR-0001-arquivos-versionados-e-pedidos-pelo-documento.md)).

O que **não** muda em `index.html`: `<title>` (`:8`), `<meta name="description">` (`:7`), `theme-color`
(`:6`), o `<body>` inteiro e o controle `#sound` (`:34`). Nenhuma declaração existente é renomeada ou
removida (API-0001, Compatibilidade).

### A capa fora das telas do jogo

A capa aparece no repositório em exatamente dois lugares de `index.html`: `og:image` e o `preload`. Nenhum
arquivo de `src/` (`.ts`, `.css`) referencia `cover`, e o `<body>` não tem elemento de imagem nem fundo que
a use. É isso que garante REQ-FEAT-0002-07 em toda tela, nos dois canais: o jogo não tem como desenhá-la.

## Colaboradores

- O navegador lê `index.html` e faz os pedidos; os serviços de prévia leem as três declarações `og:` e a
  imagem.
- O Vite (`npm run build`, `package.json:8`) resolve `link[href]` e `meta[property="og:image"]` de
  `index.html` e emite os arquivos em `dist/assets/`.
- `src/main.ts` importa as duas gravações com `?inline`
  ([DES-0003](DES-0003-saida-de-audio-gravacoes-e-controle-de-som.md)); o Vite as embute no JS de entrada.
- A medida do build e `npm test` leem `index.html`, `dist/` e `feature-assets.json`
  ([DES-0004](DES-0004-verificacoes-registros-e-medida-do-build.md)).

Nada aqui chama nem é chamado pela simulação.

## Estado e concorrência

Sem estado. O documento é o mesmo para todo leitor, canal e momento dentro do mesmo build; pedi-lo de novo,
em duplicata ou fora de ordem devolve as mesmas declarações (leitura pura, sem chave, sem deduplicação).

## Comportamento em falha

| Falha | O que acontece | O que fica registrado |
|---|---|---|
| Ícone ausente ou ilegível | a aba e o atalho ficam sem o ícone; o jogo abre igual | nada no jogo; a medida do build dá `ASSET_MISSING` antes da publicação |
| Capa ausente, ou serviço de prévia que não a baixa | prévia sem imagem; título e descrição continuam declarados | idem |
| Serviço de prévia que exige endereço absoluto em `og:image` | prévia sem imagem (o endereço declarado é relativo à raiz) | consequência registrada em [ADR-0001](../adr/ADR-0001-arquivos-versionados-e-pedidos-pelo-documento.md) |
| Som ilegível | tratado em [DES-0003](DES-0003-saida-de-audio-gravacoes-e-controle-de-som.md) | — |
| Documento não chega | o jogo não abre; fora desta feature | — |
| Forma entregue acima do teto ou soma acima de 300.000 bytes | o build mede `BUDGET_EXCEEDED`; reduz-se o arquivo, nunca o limite | o registro `ASSET_BUDGET` |

Nenhuma falha é registrada com conteúdo de usuário: não há usuário identificado (I6).

## Feature flag

Nenhuma: o F-Spec declara "Configuração: Nenhuma" para as quatro funcionalidades. Declarar ícone e prévia não
muda comportamento algum do jogo, e o som continua abrindo desligado (I4).

## Pontos em aberto

Nenhum.
