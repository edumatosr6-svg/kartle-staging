---
title: Registro de implementação — dirigibilidade do Arcade assistido
feature: dirigibilidade
stage: code
status: draft
version: 1.0.0
sources: []
---

# Registro de implementação

Rodada 2, Mode A: o projeto validado de `300 Specs/330 D-Specs/Output/dirigibilidade/` (2.2.0, 2026-10-22) foi implementado por
inteiro na raiz do repositório (`src/`, `scripts/`, `docs/`, `index.html`; `400 Code/Source/` segue vazio por decisão do dono do
produto), sobre o código parcial da rodada 1. Nenhum arquivo de `tests/`, `package.json` ou `tsconfig.json` foi tocado; nenhuma
dependência foi acrescentada. A ordem de construção foi a do projeto: dado e registros (DM-0001: `PUBLISHED_SETUPS` existente, bloco
`handling-baseline` em `docs/physics.md`), núcleo da simulação (DES-0001 a DES-0004, com a pista de teste de ADR-0005), aplicação
(DES-0005 a DES-0007); o portão determinístico rodou ao fim de cada camada e ao fim.

Os valores de `ARCADE_ASSISTIDO_V5` foram escolhidos pelos ensaios da biblioteca (3 103 acertos avaliados nas faixas de todas as
alavancas de DES-0001). O acerto entregue atende os limiares de guinada, curva com acelerador cheio, recuperação, condução normal,
drift, 0–60 km/h, velocidade estabilizada, grama, parede, determinismo, volta do piloto de teste, custo por passo, versão e contrato
de passo; não atende dois — a curva de referência com acelerador 0 (saída da faixa pelo lado interno) e a medida de V1 na varredura
de início do subesterço —, que nenhum acerto do espaço de alavancas atende junto com os demais. A rodada termina **FAIL SPEC** com o
feedback `300 Specs/330 D-Specs/Output/dirigibilidade/reports/feedback/feedback-20261022-1803.md`; a implementação fica completa
para a rodada seguinte.

## Arquivos tocados (D-CD-01)

| Arquivo | Situação | Camada | Itens de projeto |
|---|---|---|---|
| `src/physics.ts` | alterado | simulação | DES-0001 (`forcingRampMps`, `forcingRampFraction`, `testPadLane`, `testPadArc`, `StepClass`, `RECOVERY_MAX_STEPS`, `classifyHandlingSteps`, valores de `ARCADE_ASSISTIDO_V5`), DES-0002 (`getHandlingTelemetry`, mantido), DM-0001 (`PUBLISHED_SETUPS`, mantido) |
| `src/setupRecords.ts` | mantido (rodada 1) | simulação | DES-0003, DM-0001 |
| `scripts/handlingBench.ts` | reescrito | simulação (papel `scripts/`) | DES-0004, DM-0001, DES-0008 |
| `scripts/keyboard-lap.ts` | reescrito | aplicação (programa de bench) | DES-0004 (`bench:handling`, `runtimeId`, `measureStepCost`), DES-0008 |
| `scripts/physics-bench.ts` | alterado | aplicação (programa de bench) | DES-0004 (`bench:physics` com os quatro registros) |
| `src/handlingMessages.ts` | novo | aplicação (puro) | DES-0006, DES-0008 |
| `src/main.ts` | alterado | aplicação e adaptadores | DES-0005, DES-0006, DES-0007, DES-0008 |
| `index.html` | alterado | aplicação | DES-0006 (`#lap-result-setup`, `#lap-share`) |
| `docs/physics.md` | alterado | registro | DM-0001 (M3), DES-0004 (NFR-0004) |

Inalterados, como o projeto exige: `src/lap.ts`, `src/lapTiming.ts`, `src/track.ts`, `src/trackData.ts`, `src/maneuvers.ts`,
`src/lapMessages.ts`, `src/frameClock.ts`, `src/audio.ts`, `src/style.css`, `tests/*`; em `src/physics.ts`: `STEP`,
`PHYSICS_VERSION`, `Input`, `RENTAL_KART`, `ARCADE_KART`, `KART_PRESETS`, `TEST_PAD`, a assinatura de `step` e a linha 3.

## Portão determinístico desta rodada

| Passo | Resultado |
|---|---|
| `npx tsc --noEmit` | saída 0 (os três programas de `scripts/` também verificam sem erro com as mesmas opções, salvo a ausência de `@types/node`, como antes) |
| `npm test` | saída 0; 170 testes, 170 aprovados, 0 reprovados (suíte pré-existente; `race-lap-validation` 100 % verde com o novo acerto) |
| `npm run build` | saída 0 |
| `npm run bench:physics` | saída 0; linhas anteriores mantidas; `ACCELERATION` 2 383 ms, `TOP_SPEED` 30,61 m/s (110,2 km/h), `GRASS_LOSS` 48 % e 55 %, `WALL_CONTACT` 820 contatos com depois < antes, nos dois modos |
| `npm run bench:handling -- --previous` e `-- --realista` | saída 0; entradas `arcade-assistido-v4` e `realista-aluguel-4t-v4` do bloco de `docs/physics.md` (46 registros cada) |
| `npm run bench:handling` | saída 0; 46 registros do `arcade-assistido-v5` (entrada do bloco): 42 `PASS`, 4 `FAIL` (`REFERENCE_CORNER` acelerador 0 `OFF_ASPHALT` e `UNDERSTEER_ONSET` `MEASUREMENT_MISSING`, nos dois modos) |

Números de referência do acerto entregue (os dois modos de `Input`): 0–60 km/h 2 383 ms; velocidade estabilizada 110,2 km/h;
guinada a 90 % em 117 ms e a 10 % em 58 ms (esterço 0,5: 108 / 50 ms), velocidade mantida entre 13,84 e 13,94 m/s; curva de
18 m com acelerador cheio sem `understeer` nem `oversteer`; curva com acelerador 0 com 125 ms de `understeer` e saída da faixa no
passo 240; varredura com 7 patamares completos (51,8–62,6 km/h) sem `understeer`, saída a 56,1 km/h, V1 não medida (V0 50 km/h);
recuperação em 8 ms com deriva 0,064 rad; condução normal sem `oversteer`, deriva ≤ 0,059 rad; volta do piloto de teste 21 340 ms
sem sair do asfalto (linha de base 26 703 ms); custo por passo 196,1 µs contra 203,3 µs da linha de base; Realista com 0 medidas
diferentes e 0 assistências.

## Rastreabilidade

A matriz `99-traceability.md` é gerada pelo gate a partir dos campos `sources` dos registros `core/`, `data/`, `web/` e `security/`;
cada registro nomeia, por `REQ-*`, o arquivo e o símbolo que o realiza. O índice `00-index.md` também é gerado. As divergências
herdadas do D-Spec estão em `98-divergences.md` (17 linhas: 15 `resolved` com `arquivo:linha`, 2 `open` com o motivo).
