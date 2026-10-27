---
id: DES-0007
title: Integração da aplicação — escolha do acerto publicado e adaptadores de controle
feature: dirigibilidade
stage: dspec
status: validated
version: 1.1.0
sources: [FLOW-0001, FEAT-0001, FEAT-0003, FEAT-0005, FEAT-0006, REQ-FEAT-0001-07, REQ-FEAT-0003-10, REQ-FEAT-0005-05, REQ-FEAT-0005-09, REQ-FEAT-0006-01, REQ-FEAT-0006-03, NFR-0003, NFR-0005]
---

# DES-0007 — Integração da aplicação — escolha do acerto publicado e adaptadores de controle

## Realiza

Os `REQ-*` em `sources`: a aplicação pilota com o acerto corrente do dado publicado e nunca com a versão
anterior (REQ-FEAT-0005-05, -09); os adaptadores entregam só o `Input` normalizado, saturado na faixa,
binário no teclado e no toque e proporcional na inclinação, sem regra de pilotagem (REQ-FEAT-0001-07,
REQ-FEAT-0003-10, REQ-FEAT-0006-01; NFR-0003, NFR-0005); `Input` e o passo inalterados (REQ-FEAT-0006-03).
Fluxo: FLOW-0001. O Jogador nunca pilota na pista de teste: nenhum adaptador nem tela a alcança.

## Posicionamento

`src/main.ts`, camada **Aplicação** (os adaptadores de controle continuam dentro dele, como o mapa de
camadas registra), **existente** (escrito pela rodada de código 2 segundo este item; as-built, commit
`0068a57`) e **alterado** nesta rodada num único ponto, o pedido de `startLap` em `beginLap` **(muda)**.
Nenhum módulo novo.

## Interface

| Trecho atual de `src/main.ts` | O que faz, e o que muda |
|---|---|
| `:2-4` import | importa `PUBLISHED_SETUPS`, `getHandlingTelemetry` e os tipos `PublishedSetup`/`SetupRef` de `./physics`, `buildLapRecord`/`compareLapRecords` de `./setupRecords` e `formatSharedText`/`shareLabel` de `./handlingMessages`; `KART_PRESETS` e `ARCADE_KART` não são importados (continuam exportados e intactos em `src/physics.ts`) |
| `:124` `wheelPositions(setup.config)` | geometria idêntica à de antes (entre-eixos e bitola não mudam) |
| `:122`, `:158` `let setup: PublishedSetup = PUBLISHED_SETUPS.ARCADE_ASSISTIDO; let config = { ...setup.config, driverMass: 75 }` | o acerto corrente vem do dado publicado; não há caminho para a versão anterior |
| `:247-260` seletor `#handling-preset` | os valores `arcade` e `rental` do `<select>` (`index.html:38`) são mapeados para `ARCADE_ASSISTIDO` e `REALISTA_ALUGUEL_4T` (`SETUP_BY_PRESET`, `:247`); `setup = PUBLISHED_SETUPS[...]` (`:251`); `config = {...setup.config, driverMass: config.driverMass}`; os textos existentes não mudam; não existe opção para a versão anterior nem para preset experimental: durante o ciclo de acerto em staging (`DOMAIN/DEC-10`, FEAT-0005 Configuração) o `<select>` continua com os dois valores de hoje e o Arcade é sempre a `setupVersion` corrente de `PUBLISHED_SETUPS` |
| `:224-234` `beginLap` | **(muda)** `startLap(lap, {lapKind: kind, trackId: reading.trackId, trackVersion: reading.trackVersion, setupId: setup.setupId, setupVersion: setup.setupVersion}, reading, config)`: o pedido passa a informar os dois campos (API-0002 1.1.0 de `race-lap-validation`, FB-01; hoje `:226` não os informa), de modo que o `LapResult` da volta já os carrega; o `setupRef = {setupId: setup.setupId, setupVersion: setup.setupVersion}` da volta continua fixado no mesmo ponto (`:228`) e usado pelo HUD ([DES-0005](DES-0005-hud-velocidade-e-aderencia.md)) e pelo registro ([DES-0006](DES-0006-resultado-melhor-tempo-e-texto-compartilhado.md)) até a volta encerrar; os controles de peso e acerto ficam desabilitados durante a volta (`:492-493`), de modo que `setup`, `config` e o pedido da volta nunca divergem |
| `:280-295` teclado e toque | inalterados: esterço `−1`, `0` ou `1` e acelerador `0` ou `1` por `Number(...)` (`:406-409`); é a entrada binária de NFR-0003 |
| `:307-316` inclinação | inalterada: `tiltSteer = clamp(delta / 25, −1, 1)` (`:314`) já satura na faixa; é a entrada proporcional; sem sensor ou sem permissão o toque assume, com o estado visível de `race-lap-validation` (`:497-500`) |
| `:412-416` laço de passos | inalterado: `stepLap(lap, input)` com o `Input` amostrado uma vez por quadro |

Saturação (I4): o adaptador de inclinação satura em `:314`; a simulação satura de novo em
`src/physics.ts:119` (condição de forçar), `:204` (esterço) e `:212-213` (acelerador e freio), de modo que
um `Input` fora da faixa entregue por qualquer adaptador vale o saturado e os limites valem para esse valor
(REQ-FEAT-0001-07). Nenhuma regra de pilotagem é decidida aqui: `forcing`, `handling`, a classe do passo,
superfície e parede só existem em `src/physics.ts`.

## Colaboradores

Chama `PUBLISHED_SETUPS`, `getHandlingTelemetry` (`src/physics.ts`), `startLap`, `stepLap` (`src/lap.ts`) e
os itens de apresentação [DES-0005](DES-0005-hud-velocidade-e-aderencia.md) e
[DES-0006](DES-0006-resultado-melhor-tempo-e-texto-compartilhado.md). Não é chamado por nenhum módulo.

## Estado e concorrência

Estado local: `setup`, `config`, `setupRef` da volta. `setup` só muda com volta ausente ou encerrada
(controles desabilitados durante a volta); `config` é copiado e congelado por `startLap` (`src/lap.ts:120`),
então uma mudança de acerto vale para a volta seguinte (texto existente "vale na próxima volta"). Idempotência:
escolher o mesmo acerto duas vezes atribui o mesmo registro congelado. Nada é persistido.

## Comportamento em falha

Valor do `<select>` fora do mapa: ignorado (`:250`). Sensor negado: toque, estado visível
(existente). Sem rede, sem tempo-limite, sem escrita.

## Observabilidade

`tests/dirigibilidade-contract.test.ts` afirma que `src/main.ts` não importa `KART_PRESETS` nem
`ARCADE_KART` e lê `PUBLISHED_SETUPS` (texto do módulo, como `tests/race-lap-validation-layering.test.ts`
faz), e que não importa `testPadLane`, `testPadArc` nem `classifyHandlingSteps`.

## Determinismo (D-DS-07)

Não é código de simulação; o tempo de parede só decide quantos passos rodam num quadro (`advanceClock`, de
`race-lap-validation`). Provas: as de [DES-0001](../core/DES-0001-acerto-arcade-assistido-v5-e-assistencias.md).

## Feature flag

Nenhuma: a escolha do acerto já existe (`#handling-preset`) e passa a apontar para o dado publicado; não há
chave para a versão anterior (FEAT-0005, Configuração;
[ADR-0001](../adr/ADR-0001-versao-do-acerto-como-registro-novo-no-codigo.md)).

## Pontos em aberto

Nenhum.
