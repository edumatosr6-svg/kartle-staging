---
id: DES-0001
title: Arquivos entregues e declarações do documento da página — implementação
feature: apresentacao-e-som
stage: code
status: draft
version: 1.0.0
sources: [FEAT-0001, FEAT-0002, API-0001, RULE-0003, FLOW-0001, SCR-0002, REQ-FEAT-0001-01, REQ-FEAT-0001-02, REQ-FEAT-0001-03, REQ-FEAT-0001-04, REQ-FEAT-0002-01, REQ-FEAT-0002-02, REQ-FEAT-0002-03, REQ-FEAT-0002-04, REQ-FEAT-0002-05, REQ-FEAT-0002-06, REQ-FEAT-0002-07, REQ-FEAT-0005-02, REQ-FEAT-0005-04, REQ-FEAT-0005-12]
---

# DES-0001 — Arquivos entregues e declarações do documento — implementação

`src/assets/` (pasta nova, 5 arquivos) e `index.html` (`:9-14`, depois de `<title>`). Nenhum `vite.config`, nenhuma pasta `public/`.

## Realização por requisito

| Requisito | Arquivo e símbolo |
|---|---|
| REQ-FEAT-0001-01, -02; API-0001 `pageIcon` | `index.html:9` `<link rel="icon" type="image/png" sizes="192x192" href="/src/assets/icon.png" />`; no build vira `/assets/icon-Qd4gmSDZ.png` |
| REQ-FEAT-0001-03; API-0001 `homeScreenIcon` | `index.html:10` `<link rel="apple-touch-icon" sizes="192x192" href="/src/assets/icon.png" />`, o mesmo arquivo |
| REQ-FEAT-0001-04, REQ-FEAT-0002-05, -06 | `src/assets/icon.png` e `src/assets/cover.jpg` derivados só por redimensionamento Lanczos e recodificação de `docs/art/icon.png` e `docs/art/cover.png` (nada acrescentado; as duas origens são opacas, canal alfa 255 em todo ponto); a ausência de texto é da inspeção E2E-12 |
| REQ-FEAT-0002-01; API-0001 `previewImage` | `index.html:13` `<meta property="og:image" content="/src/assets/cover.jpg" />`; no build vira `/assets/cover-lU6Fa3FJ.jpg` |
| REQ-FEAT-0002-02 | `src/assets/cover.jpg`: 1200 × 670 (proporção de 2752 × 1536, sem recorte) |
| REQ-FEAT-0002-03; `previewTitle` | `index.html:11` `<meta property="og:title" content="Kartle" />` |
| REQ-FEAT-0002-04; `previewDescription` | `index.html:12` `og:description` com o texto de ADR-0003, escolha 1 |
| REQ-FEAT-0002-07 | a capa aparece só em `index.html:13` e `:14`; nenhum `.ts` ou `.css` de `src/` contém `cover`; `<body>` inalterado |
| REQ-FEAT-0005-02 | 36.674 + 72.701 + 70.998 + 44.389 = 224.762 bytes, cada arquivo dentro do teto de DM-0001 |
| REQ-FEAT-0005-04 | ícone: `rel="icon"` (`:9`); capa: `index.html:14` `<link rel="preload" as="image" href="/src/assets/cover.jpg" />`; gravações: importações `?inline` de `src/main.ts:9-10`, embutidas em `dist/assets/index-7Ar5m25g.js` |
| REQ-FEAT-0005-12 | nenhum arquivo de som da zebra em `src/assets/`; `dist/` sem arquivo de áudio; `index.html` não referencia `.mp3` e não tem `preload` de som |

As três declarações `og:` estão em linhas consecutivas (`:11-13`), na ordem do projeto. Inalterados: `<title>` (`:8`),
`meta name="description"` (`:7`), `theme-color` (`:6`), o `<body>` e `#sound` (`:40`).

## Como as imagens foram derivadas

Uma vez, fora do build, com Pillow 11.3.0 (Python 3.14; ferramenta da máquina, não é dependência do projeto):
`Image.open(origem).convert('RGB').resize((192, 192), Image.LANCZOS).save('src/assets/icon.png', optimize=True)` e
`…resize((1200, 670), Image.LANCZOS).save('src/assets/cover.jpg', 'JPEG', quality=80, optimize=True, progressive=True)`. Os tamanhos
são os do ensaio de DM-0001 (36.674 e 72.701 bytes). A capa é JPEG progressivo (quadro `SOF2`). Os dois sons são `cp`, conferidos
com `cmp`.

Conferido no build: com e sem `--base`, o Vite 8 reescreve `link[href]` (ícone, atalho, `preload`) e
`meta[property="og:image"]` para o nome com resumo, sem tocar nos bytes (SHA-256 em `dist/` igual ao de `src/assets/`).
