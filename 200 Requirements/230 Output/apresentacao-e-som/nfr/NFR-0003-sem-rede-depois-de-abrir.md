---
id: NFR-0003
title: Sem rede depois de o jogo abrir
feature: apresentacao-e-som
stage: req
status: validated
version: 1.0.0
sources: [SEED/NF-03, SEED/RE-03]
---

# NFR-0003 — Sem rede depois de o jogo abrir

| Requisito | Limite mensurável | Como é observado | Canal | Fonte |
|---|---|---|---|---|
| Depois de o jogo abrir, o jogo não faz requisição de rede para buscar som ou imagem desta feature | 0 requisições para som ou imagem desta feature depois de o jogo abrir | Registro das requisições de rede do navegador, do momento em que o jogo abre até o fim de uma volta completa com o som ligado e ao menos um deslize, em cada canal | `web-desktop`, `web-mobile` | `SEED/NF-03` (RNF08) |
| Os sons e as imagens desta feature vêm dentro do download inicial | 100 % dos arquivos desta feature (4 de 4: capa, ícone, som do motor, som de pneu) dentro do download inicial | Lista do que o navegador baixa para o jogo abrir, comparada com os arquivos desta feature | `web-desktop`, `web-mobile` | `SEED/RE-03` |
| Com a rede desligada depois de o jogo abrir, o som do motor e o som de pneu tocam como em US-0003 e US-0004 | 0 sons desta feature em falta com a rede desligada | Volta completa com o som ligado e ao menos um deslize, com a rede do aparelho desligada depois de o jogo abrir, em cada canal | `web-desktop`, `web-mobile` | `SEED/NF-03` (RNF08), `SEED/RE-03` |
