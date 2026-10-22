---
id: DES-0005
title: HUD de velocidade e estado de aderência — implementação
feature: dirigibilidade
stage: code
status: draft
version: 1.0.0
sources: [SCR-0001, FLOW-0001, API-0001, FEAT-0004, FEAT-0006, REQ-FEAT-0004-06, REQ-FEAT-0004-09, REQ-FEAT-0006-01]
---

# DES-0005 — HUD de velocidade e estado de aderência — implementação

`src/main.ts`, camada aplicação, alterado num trecho do laço de quadros; `index.html` e `src/style.css` não mudam para este item
(`#speed` e `#handling` já existem).

## Realização por requisito

| Requisito | Arquivo e símbolo |
|---|---|
| REQ-FEAT-0004-06 | `src/main.ts` `frame` (`const telemetry = getHandlingTelemetry(state, setupRef)`; `#speed` = `Math.round(telemetry.speedMps * 3.6)`, `#handling` = `labels[telemetry.handling]` e `data-state`, em todos os quadros; `NO_STATE` deixa os dois sem valor) |
| REQ-FEAT-0004-09 | `src/main.ts` `frame` (`state = lap?.kart ?? idleKart`: na pausa `stepLap` devolve a mesma sessão, o `kart` não muda e a leitura repete o último valor) |
| REQ-FEAT-0006-01 | `src/main.ts` `frame` (a tela só converte `speedMps` em km/h e mapeia `handling` para texto; nenhum literal da condição de forçar nem do teto de derrapagem em `src/main.ts`) |

## Interface

Sem símbolo novo: a tabela de rótulos (`Aderência`, `Saindo de frente`, `Saindo de traseira`, `Derrapando`) é a existente, movida para
junto da leitura. As leituras de G lateral, G longitudinal, deriva por eixo e carga por roda continuam lendo `state.telemetry`
diretamente, como o projeto diz.
