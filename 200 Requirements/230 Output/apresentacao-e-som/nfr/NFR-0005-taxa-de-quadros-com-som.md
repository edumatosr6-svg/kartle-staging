---
id: NFR-0005
title: Taxa de quadros com os sons tocando
feature: apresentacao-e-som
stage: req
status: validated
version: 1.0.0
sources: [SEED/NF-05]
---

# NFR-0005 — Taxa de quadros com os sons tocando

Os limites são os de RNF03 já especificados (em `pista-kart-park`, NFR-0002); o seed desta feature exige
que continuem valendo com os sons tocando e não fixa número novo.

| Requisito | Limite mensurável | Como é observado | Canal | Fonte |
|---|---|---|---|---|
| Taxa de quadros sustentada durante uma volta completa com o som ligado, o som do motor tocando e ao menos um deslize com som de pneu, em notebook | 60 fps, nos aparelhos de referência de RNF03 | Teste registrado no aparelho nomeado (I9): quadros por segundo medidos ao longo de uma volta completa com o som ligado | `web-desktop` | `SEED/NF-05` (RNF03) |
| Taxa de quadros sustentada durante uma volta completa com o som ligado, o som do motor tocando e ao menos um deslize com som de pneu, em celular intermediário | 30 fps, nos aparelhos de referência de RNF03 | Teste registrado no aparelho nomeado (I9): quadros por segundo medidos ao longo de uma volta completa com o som ligado; uma execução em desktop não vale como evidência para celular | `web-mobile` | `SEED/NF-05` (RNF03) |
