---
id: NFR-0007
title: Som da zebra inalterado
feature: apresentacao-e-som
stage: req
status: validated
version: 1.0.0
sources: [SEED/RE-01, SEED/RD-03, SEED/FE-03]
---

# NFR-0007 — Som da zebra inalterado

O som da zebra pertence a `pista-kart-park` (US-0005 daquele conjunto): um ruído curto e grave que se
repete enquanto houver roda na zebra, com o som ligado. Esta feature não o troca por arquivo
(`SEED/FE-03`) e não muda nenhum dos seus critérios.

| Requisito | Limite mensurável | Como é observado | Canal | Fonte |
|---|---|---|---|---|
| Os critérios do som da zebra de `pista-kart-park` continuam satisfeitos depois desta feature | 0 critérios do som da zebra de `pista-kart-park` deixam de ser satisfeitos (4 de 4: critérios 09 a 12 de US-0005 daquele conjunto) | Saída de `npm test`: os ensaios de `pista-kart-park` para o som da zebra, executados com esta feature entregue | `web-desktop` | `SEED/RE-01`, `SEED/RD-03` |
| O som da zebra continua sintetizado, sem arquivo de som | 0 arquivos de som da zebra entre os arquivos entregues ao navegador | Lista dos arquivos de som entregues ao navegador no build que entrega a feature | `web-desktop`, `web-mobile` | `SEED/FE-03` |
