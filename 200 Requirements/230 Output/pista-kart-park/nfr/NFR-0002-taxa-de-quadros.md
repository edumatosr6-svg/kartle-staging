---
id: NFR-0002
title: Taxa de quadros na Kart Park
feature: pista-kart-park
stage: req
status: validated
version: 1.1.0
sources: [SEED/NF-02, SEED/US-7]
---

# NFR-0002 — Taxa de quadros na Kart Park

| Requisito | Limite mensurável | Como é observado | Canal | Fonte |
|---|---|---|---|---|
| Taxa de quadros sustentada durante uma volta completa na Kart Park, com zebras, barreira e o acabamento de US-0007 na tela (faixa de borda, relevo da zebra, barreira de pneus e tons de grama), em notebook | 60 fps, nos aparelhos de referência de RNF03 | Teste registrado no aparelho nomeado (I9): quadros por segundo medidos ao longo de uma volta completa | `web-desktop` | `SEED/NF-02` (RNF03) |
| Taxa de quadros sustentada durante uma volta completa na Kart Park, com zebras, barreira e o acabamento de US-0007 na tela (faixa de borda, relevo da zebra, barreira de pneus e tons de grama), em celular intermediário | 30 fps, nos aparelhos de referência de RNF03 | Teste registrado no aparelho nomeado (I9): quadros por segundo medidos ao longo de uma volta completa; uma execução em desktop não vale como evidência para celular | `web-mobile` | `SEED/NF-02` (RNF03) |
