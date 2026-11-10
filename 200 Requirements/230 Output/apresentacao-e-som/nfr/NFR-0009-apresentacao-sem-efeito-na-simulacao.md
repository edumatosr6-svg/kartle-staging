---
id: NFR-0009
title: Apresentação sem efeito na simulação
feature: apresentacao-e-som
stage: req
status: validated
version: 1.0.0
sources: [SEED/RD-01, SEED/IM-I2]
---

# NFR-0009 — Apresentação sem efeito na simulação

Som e imagem ficam do lado da apresentação (I2): a simulação, a volta e o tempo não dependem deles, e
nenhum dado de simulação muda com esta feature.

| Requisito | Limite mensurável | Como é observado | Canal | Fonte |
|---|---|---|---|---|
| Com os sons e as imagens desta feature indisponíveis, a mesma sequência de entradas dá o mesmo tempo total da volta e os mesmos tempos de setor que com eles disponíveis | Diferença de 0 ms no tempo total e em cada setor | Saída de `npm test`: a mesma sequência de entradas é executada com e sem os sons e as imagens desta feature disponíveis, com a simulação avançada por `STEP`, e os tempos são comparados | `web-desktop`, `web-mobile` | `SEED/RD-01` (I2) |
| A feature não muda nenhum dado de simulação | 0 campos do estado da simulação acrescentados, retirados ou alterados por esta feature | Saída de `npm test`: o estado da simulação depois da mesma sequência de entradas, avançada por `STEP`, é idêntico campo a campo antes e depois da feature | `web-desktop`, `web-mobile` | `SEED/IM-I2` (I2) |
