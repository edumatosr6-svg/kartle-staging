---
id: DES-0002
title: Telemetria de dirigibilidade por passo (API-0001)
feature: dirigibilidade
stage: dspec
status: validated
version: 2.0.0
sources: [API-0001, FLOW-0001, RULE-0001, RULE-0002, FEAT-0001, FEAT-0002, FEAT-0003, FEAT-0004, REQ-FEAT-0001-05, REQ-FEAT-0002-11, REQ-FEAT-0002-12, REQ-FEAT-0002-13, REQ-FEAT-0003-10, REQ-FEAT-0003-13, REQ-FEAT-0004-05, REQ-FEAT-0004-06, REQ-FEAT-0006-01, REQ-FEAT-0006-02]
---

# DES-0002 — Telemetria de dirigibilidade por passo (API-0001)

## Realiza

O contrato API-0001 2.0.0 campo a campo: a leitura `getHandlingTelemetry` que o HUD faz em todos os quadros
(AC-US-0004-06) e que os ensaios fazem em todos os passos; `positionXM`, `positionZM` e `headingRad` para o
raio da trajetória, o giro, a área declarada da pista de teste aberta e a comparação de estados com e sem o
comando de drift (AC-US-0002-07 a -09, AC-US-0003-08); `surface` e `wallContact` para grama, parede e "fora
da área" (AC-US-0004-03, -05; RULE-0002, Ambientes); `forcing` (RULE-0001); `understeerStepCount` possível
por `handling` (REQ-FEAT-0001-05); a regra de que nada é decidido fora da simulação (REQ-FEAT-0003-10,
REQ-FEAT-0006-01, -02). O campo `driftActive` sai, sem substituto (API-0001 2.0.0, Compatibilidade).

## Posicionamento

`src/physics.ts`, camada **Simulação**, **existente** (`HandlingTelemetry` e `getHandlingTelemetry` em
`:441-456`) e **alterado** no tipo e na função: sai `driftActive` (`:444`, `:454`), entram os três campos de
posição e rumo. Não há módulo novo: a telemetria é leitura do `State` que este módulo produz
([DES-0001](DES-0001-acerto-arcade-assistido-v6-e-assistencias.md)), sem dependência de `src/lap.ts`.

## Interface

| Função | Entradas | Saída |
|---|---|---|
| `getHandlingTelemetry(state, setup)` | `state: State \| undefined` (o `kart` da `LapSession`, ou o estado de um ensaio); `setup: SetupRef = {setupId, setupVersion}` do acerto em uso, passado por quem iniciou a volta ou o ensaio | `HandlingTelemetry`, ou `{code: 'NO_STATE'}` quando `state` é ausente |

`HandlingTelemetry`, exatamente os campos de API-0001 2.0.0 e nenhum outro:

| Campo | Tipo | Unidade | Origem no `State` |
|---|---|---|---|
| `simStepCount` | inteiro ≥ 0 | passos | `state.stepCount` |
| `setupId` | enum | — | `setup.setupId` |
| `setupVersion` | texto | — | `setup.setupVersion` |
| `positionXM`, `positionZM` **(novos)** | número | m | `state.x`, `state.z`: o centro do kart no plano do ambiente |
| `headingRad` **(novo)** | número | rad | `state.heading`: acumulado com sinal desde o estado inicial; `step` só soma `yawRate × dt` (`src/physics.ts:309`) e nunca o reduz a uma volta, de modo que o giro de um ensaio é a diferença entre o rumo de um passo e o da partida |
| `speedMps` | número ≥ 0 | m/s | `state.speed` |
| `handling` | `grip \| understeer \| oversteer \| sliding` | — | `state.telemetry.handling` |
| `sideslipRad` | número ≥ 0 | rad | `Math.abs(state.telemetry.sideslip)` |
| `yawRateRadPerS` | número | rad/s | `state.yawRate`, com sinal |
| `surface` | `ASPHALT \| GRASS` | — | `state.telemetry.surface` mapeado `grass` → `GRASS`, os demais (`asphalt`, e `curb` numa pista com zebra) → `ASPHALT`; na pista de teste aberta, `GRASS` é "fora da área declarada" (`testPadArea`) |
| `wallContact` | booleano | — | `state.telemetry.wallContact`; sempre falso na pista de teste aberta (`walls: false`) |
| `forcing` | booleano | — | `state.telemetry.forcing`; o comando de drift não o altera |

Estado inicial (`initialState()`): `simStepCount` 0, posição e rumo os do estado (a largada da pista
sintética, ou `(0, 0)` com rumo 0 nos estados de ensaio), `speedMps` 0, `handling` `grip`, `sideslipRad` 0,
`yawRateRadPerS` 0, `surface` `ASPHALT` (o literal de `emptyTelemetry`, `:109-113`: `initialState()` não recebe
ambiente e o primeiro `step` substitui a telemetria pela medida), `wallContact` e `forcing` falsos. São os
valores de "Vazio" de SCR-0001.

Por que `setup` é parâmetro e não campo do `State`: a `LapSession` congela uma cópia do `KartConfig` e
`RENTAL_KART`/`ARCADE_KART` não podem ganhar campos (teste de congelamento); quem inicia a volta ou o ensaio
conhece o acerto e o passa na leitura. Em `src/main.ts` o `setupRef` e o `config` da volta são fixados no
mesmo ponto (`beginLap`, [DES-0007](../web/DES-0007-integracao-da-aplicacao-e-adaptadores.md)).

## Colaboradores

Chamado por `src/main.ts` (HUD, por quadro, `src/main.ts:605`), por `scripts/handlingBench.ts` (por passo) e
pelos testes. Não chama nada além dos campos do `State`. Nenhum leitor do jogo lia `driftActive`; o campo só
era lido pelo classificador de passo e pelos ensaios, que mudam no mesmo conjunto
([DES-0001](DES-0001-acerto-arcade-assistido-v6-e-assistencias.md), [DES-0004](DES-0004-ensaios-de-dirigibilidade-e-saida.md)).

## Estado e concorrência

Leitura pura: não altera o estado; repetir a chamada sobre o mesmo `state` devolve o mesmo valor. Um valor por
passo, ordenado por `simStepCount`; na suspensão o contador não avança e a leitura devolve o último passo.
Não há chave de deduplicação porque não há escrita.

## Comportamento em falha

`state` ausente devolve `{code: 'NO_STATE'}` sem lançar. Não há dependência, tempo-limite nem escrita. Nada
é registrado em log.

## Observabilidade

A própria leitura é o instrumento: os ensaios de [DES-0004](DES-0004-ensaios-de-dirigibilidade-e-saida.md)
derivam toda medida dela — o raio e o giro da posição e do rumo, a área declarada da posição —, e o HUD a
exibe.

## Determinismo (D-DS-07)

Função pura do `State`; sem relógio nem sorteio. Prova: `tests/dirigibilidade-telemetry.test.ts` afirma
exatamente os campos de API-0001 2.0.0 (sem `driftActive`), os tipos e os valores iniciais, a ordem por
`simStepCount`, `positionXM`/`positionZM`/`headingRad` iguais a `x`/`z`/`heading` do estado e o rumo
acumulado além de 2π num giro contínuo, a transição `ASPHALT` → `GRASS` na borda de `testPadArea`,
`wallContact` verdadeiro só no passo do contato em `CIRCUIT` e nunca na pista de teste aberta, e `NO_STATE`
sem estado.

## Feature flag

Nenhuma: leitura do estado que não altera nenhum passo (API-0001, Compatibilidade). A retirada de
`driftActive` não tem leitor a rejeitar.

## Pontos em aberto

Nenhum.
