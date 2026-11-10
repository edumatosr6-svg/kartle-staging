---
id: NFR-0004
title: Determinismo com o som ligado e desligado
feature: apresentacao-e-som
stage: req
status: validated
version: 1.0.0
sources: [SEED/NF-04, SEED/RD-01]
---

# NFR-0004 — Determinismo com o som ligado e desligado

| Requisito | Limite mensurável | Como é observado | Canal | Fonte |
|---|---|---|---|---|
| A mesma sequência de entradas, a partir do mesmo estado inicial, dá o mesmo tempo total da volta com o som ligado e com o som desligado | Diferença de 0 ms entre o tempo com o som ligado e o tempo com o som desligado | Saída de `npm test`: a mesma sequência de entradas é executada com o som ligado e com o som desligado, com a simulação avançada por `STEP`, e os tempos totais são comparados | `web-desktop`, `web-mobile` | `SEED/NF-04` (RNF07) |
| A mesma sequência de entradas, a partir do mesmo estado inicial, dá os mesmos tempos de setor com o som ligado e com o som desligado | Diferença de 0 ms em cada setor | Saída de `npm test`: as mesmas execuções da linha anterior, com os tempos de setor comparados um a um | `web-desktop`, `web-mobile` | `SEED/NF-04` (RNF07) |
