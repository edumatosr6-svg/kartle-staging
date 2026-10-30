---
id: DES-0007
title: Integração da aplicação — escolha do acerto publicado e adaptadores de controle — implementação
feature: dirigibilidade
stage: code
status: validated
version: 1.3.0
sources: [FLOW-0001, SCR-0001, FEAT-0001, FEAT-0003, FEAT-0005, FEAT-0006, REQ-FEAT-0001-07, REQ-FEAT-0003-10, REQ-FEAT-0003-13, REQ-FEAT-0003-21, REQ-FEAT-0005-05, REQ-FEAT-0005-09, REQ-FEAT-0006-01, REQ-FEAT-0006-03, NFR-0003, NFR-0005]
---

# DES-0007 — Integração da aplicação e adaptadores — implementação

`src/main.ts`, `index.html` e `src/style.css`, camada aplicação. Rodada de código 6 (projeto DES-0007 1.3.0): o adaptador de toque é
alterado só por remoção — sai o botão "Drift" do controle de toque, a sua leitura no `Input` e a sua escrita por quadro. O acerto
corrente continua vindo de `PUBLISHED_SETUPS` (`:130`, `arcade-assistido-v6`).

## Realização por requisito

| Requisito | Arquivo e símbolo |
|---|---|
| REQ-FEAT-0001-07 | `src/main.ts` (inclinação `tiltSteer = clamp(delta / 25, -1, 1)`); `src/physics.ts` `isForcing`, `integrate` (saturação) |
| REQ-FEAT-0003-10, REQ-FEAT-0006-01 | `src/main.ts` laço de quadros (`Input` amostrado por quadro a `stepLap`; nenhuma regra de pilotagem no adaptador) |
| REQ-FEAT-0003-13 | `src/main.ts:549` (`drift: keys.has(' ')`: só a tecla de drift alimenta o campo; a simulação o ignora) |
| REQ-FEAT-0003-21 | `index.html:32` `.touch-controls` sem `<button data-control="drift">` (ficam os grupos `left`/`right` e `brake`/`throttle`); `src/main.ts:549` sem `\|\| touch.has('drift')`; `src/main.ts` sem a consulta `driftButton` (antes `:655-656`); `src/style.css:3` sem `.touch-controls button[data-control=drift]` (`.touch-controls button:disabled` fica) |
| REQ-FEAT-0005-05 | `src/main.ts:319` `beginLap` (`startTrainingLap(..., { setupId, setupVersion })`; `setupRef` fixado no mesmo ponto) |
| REQ-FEAT-0005-09 | `src/main.ts:130` `setup = PUBLISHED_SETUPS.ARCADE_ASSISTIDO`; `:341` `SETUP_BY_PRESET` (nenhuma opção para versão anterior ou rodada substituída) |
| REQ-FEAT-0006-03 | `stepLap(lap, input)` com o mesmo `Input`; `STEP` e o solver intocados |
