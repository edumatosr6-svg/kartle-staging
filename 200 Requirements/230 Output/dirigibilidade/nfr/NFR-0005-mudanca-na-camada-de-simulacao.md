---
id: NFR-0005
title: Mudança restrita à camada de simulação
feature: dirigibilidade
stage: req
status: validated
version: 1.4.0
sources: [SEED/RE-01, SEED/IM-I2, SEED/RD-01, DOMAIN/DEC-16, DOMAIN/DEC-17]
---

# NFR-0005 — Mudança restrita à camada de simulação

| Requisito | Limite mensurável | Como é observado | Canal | Fonte |
|---|---|---|---|---|
| As regras de pilotagem ficam na simulação (`src/physics.ts` e `src/maneuvers.ts`, restrição do seed); nenhuma regra de pilotagem — resposta do volante, aderência, aceleração, perda na grama ou na parede — é decidida em renderização ou em adaptador de controle (I2). A retirada do drift e do turbo (US-0003) tira regras de pilotagem da simulação e não cria nenhuma fora dela; retirar da tela tudo o que mostrava, ensinava ou oferecia o drift e o turbo — HUD, resultado, texto compartilhado, tela inicial, dica da barra de ferramentas, guia de manobras e o botão "Drift" do controle de toque no celular (critérios 09 e 11 a 15 de US-0003) — é só remoção de exibição, permitida pela restrição, sem regra nova na renderização | 0 regras de pilotagem fora da camada de simulação; 0 importações de camada externa (DOM, renderização, áudio, relógio de parede) na simulação; os ensaios de US-0001 a US-0005 executam sem DOM em `npm test` | Saída de `npm test` executando os ensaios sem DOM; revisão da etapa de código contra o mapa de camadas (I2) | `web-desktop`, `web-mobile` | `SEED/RE-01`, `SEED/IM-I2`, `SEED/RD-01`, `DOMAIN/DEC-16`, `DOMAIN/DEC-17` |
