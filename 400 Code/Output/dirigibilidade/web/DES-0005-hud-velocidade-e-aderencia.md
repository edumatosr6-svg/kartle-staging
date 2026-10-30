---
id: DES-0005
title: HUD de velocidade e estado de aderência, sem indicador de drift ou turbo — implementação
feature: dirigibilidade
stage: code
status: validated
version: 2.0.1
sources: [SCR-0001, FLOW-0001, API-0001, FEAT-0003, FEAT-0004, FEAT-0006, REQ-FEAT-0003-14, REQ-FEAT-0004-06, REQ-FEAT-0004-09, REQ-FEAT-0006-01]
---

# DES-0005 — HUD de velocidade e aderência, sem indicador de drift ou turbo — implementação

`src/main.ts`, `index.html` e `src/style.css`, camada aplicação, alterados na rodada de código 5 só por remoção (projeto DES-0005
2.0.0). `#speed` e `#handling` continuam lidos por quadro pelo contrato API-0001.

## Realização por requisito

| Requisito | Arquivo e símbolo |
|---|---|
| REQ-FEAT-0004-06, -09 | `src/main.ts:647-654` (`getHandlingTelemetry(state, setupRef)`; `NO_STATE` deixa os dois elementos vazios; o último passo fica na suspensão) |
| REQ-FEAT-0003-14 | removidos: `index.html` `.style-score` (`ESTILO`, `#style-score`, `#combo`) de `.timing` e o bloco `#drift-hud` (`#drift-label`, `#drift-meter`, `#drift-fill`, `#drift-help`); `src/main.ts` o `import { chargeTier } from './maneuvers'`, a leitura de `maneuvers.awards` e a mensagem de prêmio com `audio.reward` no laço de passos (`:512` passa a só `lap = stepLap(lap, input)`), e a escrita de `#style-score`, `#combo`, `#drift-fill`, `#drift-meter`, `#drift-hud`, `#drift-label`, `#drift-help` e da classe `boosting`; `src/style.css` as regras `.style-score`, `.style-score em`, `.drift-hud` (e `strong`, `small`, `[data-tier]`), `.drift-meter`, `.drift-meter i`, `.boosting` e as ocorrências de `.drift-hud` em `@media(max-width:700px)` e `@media(pointer:coarse)` |
| REQ-FEAT-0006-01 | só remoção de exibição; nenhuma regra nova na renderização |

Ficam as leituras de `state.maneuvers` de `modelo-kart-01` (`const tricks = state.maneuvers`, `src/main.ts:589`; marcas em `:595`),
que leem sempre o valor inicial (ADR-0006). O botão de toque "Drift" e a leitura `touch.has('drift')` saíram nesta rodada por
[DES-0007](DES-0007-integracao-da-aplicacao-e-adaptadores.md); os textos de instrução do drift fora do HUD, por
[DES-0009](DES-0009-tela-inicial-dica-e-guia-de-manobras-sem-drift.md). `src/audio.ts` não muda.
