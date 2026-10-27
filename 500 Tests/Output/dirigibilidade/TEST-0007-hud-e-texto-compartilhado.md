---
id: TEST-0007
title: Rótulos do HUD e texto compartilhado do resultado
feature: dirigibilidade
stage: test
status: validated
version: 1.0.0
sources: [AC-US-0004-06, AC-US-0005-05]
---

# TEST-0007 — Rótulos do HUD e texto compartilhado do resultado

| | |
|---|---|
| Arquivo | `tests/dirigibilidade-hud-text.test.ts` (estratégia: `hud-text`) |
| Nível | unitário, sem DOM: `formatSharedText` e `shareLabel` sobre registros sintéticos; `src/main.ts` e `index.html` lidos como texto |
| Interface exercitada | `formatSharedText`, `shareLabel` (`src/handlingMessages.ts`); `formatLapTime`, `message` (`src/lapMessages.ts`) |
| Fixtures | `record(patch)`: `LapRecord` sintético da pista `synthetic` v2 com `setupVersion` `fixture-setup-9.9.9`, válido (83 456 ms) e inválido (`CUT`) |

## Verificações

| Check | Decide | Teste | O que a faria falhar |
|---|---|---|---|
| CHK-TEST-0007-01 | AC-US-0004-06 | the HUD has a speed element in km/h and a handling element with a non-empty text for each of the four states | `#speed` ou `#handling` removidos de `index.html`, rótulo vazio ou repetido para um dos quatro estados, HUD que não converte `speedMps` em km/h, HUD que não lê por API-0001 |
| CHK-TEST-0007-02 | AC-US-0005-05 | the shared text carries the lap time and the setup version, never a second time nor a difference | tempo ou versão ausentes, segundo tempo ou diferença no texto, volta inválida compartilhada com tempo ou sem a versão, em pt ou en |
| CHK-TEST-0007-03 | AC-US-0005-05 | the share control has a label in each language | rótulo vazio ou igual nas duas línguas, controle `#lap-share` ou elemento `#lap-result-setup` removidos |
| CHK-TEST-0007-04 | AC-US-0005-05 | the application shows a best time only when the records are COMPARABLE and clears it when the setup changes | melhor tempo exibido sem `COMPARABLE`, troca de acerto que mantém `bestRecord`, substituição do melhor sem comparar, diferença entre tempos calculada em `src/main.ts` |
