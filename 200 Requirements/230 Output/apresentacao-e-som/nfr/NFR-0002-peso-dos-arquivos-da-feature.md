---
id: NFR-0002
title: Peso dos arquivos da feature
feature: apresentacao-e-som
stage: req
status: validated
version: 1.0.0
sources: [SEED/NF-02]
---

# NFR-0002 — Peso dos arquivos da feature

| Requisito | Limite mensurável | Como é observado | Canal | Fonte |
|---|---|---|---|---|
| O peso somado da capa, do ícone, do som do motor e do som de pneu, na forma em que são entregues ao navegador, não passa do limite do seed | No máximo 300.000 bytes somados | Soma dos bytes de cada arquivo desta feature como entregue ao navegador, medida no build que entrega a feature | `web-desktop`, `web-mobile` | `SEED/NF-02` |
