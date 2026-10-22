---
id: DES-0007
title: Integração da aplicação — escolha do acerto publicado e adaptadores de controle — implementação
feature: dirigibilidade
stage: code
status: draft
version: 1.0.0
sources: [FLOW-0001, FEAT-0001, FEAT-0003, FEAT-0005, FEAT-0006, REQ-FEAT-0001-07, REQ-FEAT-0003-10, REQ-FEAT-0005-05, REQ-FEAT-0005-09, REQ-FEAT-0006-01, REQ-FEAT-0006-03, NFR-0003, NFR-0005]
---

# DES-0007 — Integração da aplicação — escolha do acerto publicado e adaptadores de controle — implementação

`src/main.ts`, camada aplicação (os adaptadores continuam dentro dele). Nenhum módulo novo.

## Realização por requisito

| Requisito | Arquivo e símbolo |
|---|---|
| REQ-FEAT-0001-07 | `src/main.ts` (inclinação: `tiltSteer = clamp(delta / 25, -1, 1)`, inalterado); `src/physics.ts` `isForcing`, `integrate` (saturação de `steer`, `throttle`, `brake` na faixa) |
| REQ-FEAT-0003-10 | `src/main.ts` `frame` (o `Input` amostrado por quadro vai a `stepLap`; nenhuma regra de pilotagem no adaptador nem na tela) |
| REQ-FEAT-0005-05 | `src/main.ts` `beginLap` (`setupRef = { setupId, setupVersion }` do acerto corrente, fixado com o `config` da volta e usado pelo HUD e pelo registro até o fim) |
| REQ-FEAT-0005-09 | `src/main.ts` `setup = PUBLISHED_SETUPS.ARCADE_ASSISTIDO` (importação de `KART_PRESETS` e `ARCADE_KART` removida); `SETUP_BY_PRESET` (`arcade` → `ARCADE_ASSISTIDO`, `rental` → `REALISTA_ALUGUEL_4T`; nenhuma opção para a versão anterior) |
| REQ-FEAT-0006-01 | `src/main.ts` (teclado e toque binários, inclinação proporcional; `forcing`, `handling`, classe do passo, superfície e parede só existem em `src/physics.ts`) |
| REQ-FEAT-0006-03 | `src/main.ts` `frame` (`stepLap(lap, input)` com o mesmo `Input` de antes; `STEP` e o solver não são tocados) |

## Interface

`let setup: PublishedSetup` (declarado antes das rodas, porque `wheelPositions(setup.config)` as constrói); `let config = { ...setup.config,
driverMass: 75 }`; `let setupRef: SetupRef`; `#handling-preset` `onchange` mapeia os dois valores do `<select>` por `SETUP_BY_PRESET`,
copia `setup.config` com o `driverMass` corrente, atualiza `setupRef` (os controles ficam desabilitados durante a volta, logo o
`setupRef` da volta, fixado em `beginLap`, nunca diverge do `config`) e zera `bestRecord`. O laço de passos, o teclado, o toque e a
inclinação não mudam.
