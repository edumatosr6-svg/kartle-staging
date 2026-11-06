---
id: NFR-0013
title: Acabamento sem efeito na volta
feature: pista-kart-park
stage: req
status: validated
version: 2.0.0
sources: [SEED/NF-06, SEED/RD-13, SEED/RE-08, SEED/IM-I2]
---

# NFR-0013 — Acabamento sem efeito na volta

Na revisão 3, a comparação é feita na Kart Park versão 2, com e sem o acabamento de US-0007 desenhado
(`SEED/NF-06`); ela não compara mais o jogo de antes e de depois da revisão 2.

| Requisito | Limite mensurável | Como é observado | Canal | Fonte |
|---|---|---|---|---|
| Na Kart Park versão 2, a mesma sequência de entradas, a partir do mesmo estado inicial, dá o mesmo tempo total da volta com e sem o acabamento de US-0007 desenhado | Idêntico ao milissegundo em 100 % das sequências comparadas | Saída de `npm test`: a simulação da versão 2 é avançada com `STEP` pela mesma sequência de entradas uma vez com o acabamento desenhado e uma vez sem ele, e os tempos totais são comparados | `web-desktop`, `web-mobile` | `SEED/NF-06` |
| Na Kart Park versão 2, a mesma sequência de entradas dá os mesmos 4 tempos de setor com e sem o acabamento de US-0007 desenhado | Idênticos ao milissegundo em 100 % das sequências comparadas | Saída de `npm test`: as mesmas execuções da linha anterior, com os 4 tempos de setor comparados um a um | `web-desktop`, `web-mobile` | `SEED/NF-06` |
| Na Kart Park versão 2, a mesma sequência de entradas dá a mesma trajetória com e sem o acabamento de US-0007 desenhado | Posição, rumo e velocidade do kart idênticos em 100 % dos passos de `STEP` de 100 % das sequências comparadas, com ao menos uma sequência que passa sobre a faixa de borda, sobre a zebra e contra a barreira | Saída de `npm test`: o estado do kart a cada passo de `STEP` das mesmas execuções, comparado passo a passo | `web-desktop`, `web-mobile` | `SEED/NF-06`, `SEED/RD-13` |
