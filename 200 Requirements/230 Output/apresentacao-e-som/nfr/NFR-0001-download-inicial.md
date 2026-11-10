---
id: NFR-0001
title: Tamanho do download inicial
feature: apresentacao-e-som
stage: req
status: validated
version: 1.0.0
sources: [SEED/NF-01, SEED/CTX, SEED/RE-03]
---

# NFR-0001 — Tamanho do download inicial

| Requisito | Limite mensurável | Como é observado | Canal | Fonte |
|---|---|---|---|---|
| O download inicial do jogo, com a capa, o ícone, o som do motor e o som de pneu incluídos, fica abaixo do limite de RNF02 | Menor que 3 MB comprimidos (o download inicial sem a feature somava 186.291 bytes comprimidos em 2026-11-06) | Soma, em bytes comprimidos, de tudo o que o navegador baixa para o jogo abrir, medida no build que entrega a feature | `web-desktop`, `web-mobile` | `SEED/NF-01` (RNF02), `SEED/CTX`, `SEED/RE-03` |
