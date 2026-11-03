---
id: NFR-0013
title: Acabamento sem efeito na volta
feature: pista-kart-park
stage: req
status: validated
version: 1.0.0
sources: [SEED/NF-06, SEED/RD-13, SEED/IM-I2]
---

# NFR-0013 — Acabamento sem efeito na volta

| Requisito | Limite mensurável | Como é observado | Canal | Fonte |
|---|---|---|---|---|
| A mesma sequência de entradas, a partir do mesmo estado inicial na Kart Park, dá o mesmo tempo total da volta antes e depois da revisão 2 | Idêntico ao milissegundo em 100 % das sequências comparadas | Saída de `npm test`: a simulação é avançada com `STEP` pela mesma sequência de entradas no jogo de antes e no de depois da revisão 2, e os tempos totais são comparados | `web-desktop`, `web-mobile` | `SEED/NF-06` |
| A mesma sequência de entradas dá os mesmos 4 tempos de setor antes e depois da revisão 2 | Idênticos ao milissegundo em 100 % das sequências comparadas | Saída de `npm test`: as mesmas execuções da linha anterior, com os 4 tempos de setor comparados um a um | `web-desktop`, `web-mobile` | `SEED/NF-06` |
| A mesma sequência de entradas dá a mesma trajetória antes e depois da revisão 2 | Posição, rumo e velocidade do kart idênticos em 100 % dos passos de `STEP` de 100 % das sequências comparadas, com ao menos uma sequência que passa sobre a faixa de borda, sobre a zebra e contra a barreira | Saída de `npm test`: o estado do kart a cada passo de `STEP` das mesmas execuções, comparado passo a passo | `web-desktop`, `web-mobile` | `SEED/NF-06`, `SEED/RD-13` |
