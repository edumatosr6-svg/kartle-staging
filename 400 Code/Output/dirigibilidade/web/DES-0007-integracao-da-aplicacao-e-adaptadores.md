---
id: DES-0007
title: Integração da aplicação — escolha do acerto publicado e adaptadores de controle — implementação
feature: dirigibilidade
stage: code
status: validated
version: 1.2.0
sources: [FLOW-0001, FEAT-0001, FEAT-0003, FEAT-0005, FEAT-0006, REQ-FEAT-0001-07, REQ-FEAT-0003-10, REQ-FEAT-0003-13, REQ-FEAT-0005-05, REQ-FEAT-0005-09, REQ-FEAT-0006-01, REQ-FEAT-0006-03, NFR-0003, NFR-0005]
---

# DES-0007 — Integração da aplicação e adaptadores — implementação

`src/main.ts`, camada aplicação. Nenhuma linha deste item mudou na rodada de código 5 (projeto DES-0007 1.2.0): o acerto corrente
já vem de `PUBLISHED_SETUPS` (`:130`), que passa a publicar `arcade-assistido-v6` (DES-0001). A remoção do `import` de `./maneuvers`
é de DES-0005.

## Realização por requisito

| Requisito | Arquivo e símbolo |
|---|---|
| REQ-FEAT-0001-07 | `src/main.ts` (inclinação `tiltSteer = clamp(delta / 25, -1, 1)`); `src/physics.ts` `isForcing`, `integrate` (saturação) |
| REQ-FEAT-0003-10, REQ-FEAT-0006-01 | `src/main.ts` laço de quadros (`Input` amostrado por quadro a `stepLap`; nenhuma regra de pilotagem no adaptador) |
| REQ-FEAT-0003-13 | `src/main.ts:507` (`drift: keys.has(' ') \|\| touch.has('drift')` continua entregue; a simulação o ignora) |
| REQ-FEAT-0005-05 | `src/main.ts:309-310` `beginLap` (`startTrainingLap(..., { setupId, setupVersion })`; `setupRef` fixado no mesmo ponto) |
| REQ-FEAT-0005-09 | `src/main.ts:130` `setup = PUBLISHED_SETUPS.ARCADE_ASSISTIDO`; `:332` `SETUP_BY_PRESET` (nenhuma opção para versão anterior ou rodada substituída) |
| REQ-FEAT-0006-03 | `stepLap(lap, input)` com o mesmo `Input`; `STEP` e o solver intocados |
