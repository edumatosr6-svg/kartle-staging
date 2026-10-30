---
id: DES-0007
title: Integração da aplicação — escolha do acerto publicado e adaptadores de controle
feature: dirigibilidade
stage: dspec
status: validated
version: 1.2.0
sources: [FLOW-0001, FEAT-0001, FEAT-0003, FEAT-0005, FEAT-0006, REQ-FEAT-0001-07, REQ-FEAT-0003-10, REQ-FEAT-0003-13, REQ-FEAT-0005-05, REQ-FEAT-0005-09, REQ-FEAT-0006-01, REQ-FEAT-0006-03, NFR-0003, NFR-0005]
---

# DES-0007 — Integração da aplicação — escolha do acerto publicado e adaptadores de controle

## Realiza

Os `REQ-*` em `sources`: a aplicação pilota com o acerto corrente do dado publicado — o acerto C,
`arcade-assistido-v6` — e nunca com outra versão (REQ-FEAT-0005-05, -09); os adaptadores entregam só o
`Input` normalizado, saturado na faixa, binário no teclado e no toque e proporcional na inclinação, sem
regra de pilotagem (REQ-FEAT-0001-07, REQ-FEAT-0003-10, REQ-FEAT-0006-01; NFR-0003, NFR-0005); o comando de
drift continua chegando à simulação no mesmo campo de `Input`, com a mesma faixa, e não tem efeito
(REQ-FEAT-0003-13; FLOW-0001, "Comando de drift mantido"); `Input` e o passo inalterados
(REQ-FEAT-0006-03). O Jogador nunca pilota na pista de teste aberta: nenhum adaptador nem tela a alcança.

## Posicionamento

`src/main.ts`, camada **Aplicação** (os adaptadores de controle continuam dentro dele, como o mapa de camadas
registra), **existente**. Este item não altera nenhuma linha nesta rodada: a escolha do acerto já lê
`PUBLISHED_SETUPS`, que passa a declarar `arcade-assistido-v6` ([DES-0001](../core/DES-0001-acerto-arcade-assistido-v6-e-assistencias.md)),
e o pedido da volta já informa `setupId` e `setupVersion`. As remoções do drift no HUD são de
[DES-0005](DES-0005-hud-velocidade-e-aderencia.md). Nenhum módulo novo.

## Interface

| Trecho atual de `src/main.ts` | O que faz |
|---|---|
| `:2-4` import | `PUBLISHED_SETUPS`, `getHandlingTelemetry`, `getTrackContact` e os tipos `PublishedSetup`/`SetupRef` de `./physics`; `buildLapRecord`/`compareLapRecords` de `./setupRecords`; `formatSharedText`/`shareLabel` de `./handlingMessages`. `KART_PRESETS`, `ARCADE_KART`, `ARCADE_ASSISTIDO_V5` e `ARCADE_ASSISTIDO_V6` não são importados; o import de `./maneuvers` (`:5`) sai por DES-0005 |
| `:131`, `:163` `let setup: PublishedSetup = PUBLISHED_SETUPS.ARCADE_ASSISTIDO; let config = { ...setup.config, driverMass: 75 }` | o acerto corrente vem do dado publicado: com a entrega, `ARCADE_ASSISTIDO_V6`; não há caminho para outra versão |
| `:319-330` seletor `#handling-preset` | os valores `arcade` e `rental` do `<select>` (`index.html:38`) mapeados para `ARCADE_ASSISTIDO` e `REALISTA_ALUGUEL_4T` (`SETUP_BY_PRESET`, `:319`); nenhuma opção para versão anterior, rodada substituída ou preset experimental (`DOMAIN/DEC-10`; FEAT-0005, Configuração) |
| `:296-306` `beginLap` | `startTrainingLap(training, lap, config, {setupId, setupVersion})` (`:297`, sessão de treino de `pista-kart-park`), que passa os dois campos ao pedido de `startLap`; o `setupRef` da volta é fixado no mesmo ponto (`:299`) e usado pelo HUD e pelo registro até a volta encerrar; peso e acerto ficam desabilitados durante a volta (`:594-596`) |
| `:352-376` teclado e toque | esterço `−1`, `0` ou `1` e acelerador `0` ou `1` (`:489-494`): a entrada binária de NFR-0003; Espaço e o botão de toque `drift` alimentam `drift` (`:495`) |
| `:379-388` inclinação | `tiltSteer = clamp(delta / 25, −1, 1)` (`:386`) já satura na faixa: a entrada proporcional; sem sensor ou sem permissão o toque assume, com estado visível |
| `:497-501` laço de passos | `advanceClock` decide quantos passos rodam no quadro; `stepLap(lap, input)` com o `Input` amostrado uma vez por quadro, inclusive `drift`, que a simulação ignora |

Saturação (I4): o adaptador de inclinação satura em `:386`; a simulação satura de novo na condição de forçar,
no esterço e no acelerador ([DES-0001](../core/DES-0001-acerto-arcade-assistido-v6-e-assistencias.md)), de
modo que um `Input` fora da faixa vale o saturado (REQ-FEAT-0001-07). Nenhuma regra de pilotagem é decidida
aqui: `forcing`, `handling`, superfície, parede e a ausência de efeito do comando de drift só existem em
`src/physics.ts`. O comando de drift não é retirado do adaptador: o F-Spec mantém o campo de `Input` com o
mesmo nome e faixa (I8, NFR-0006) e o controle de drift do toque como entrada sem efeito (RULE-0001).

## Colaboradores

Chama `PUBLISHED_SETUPS`, `getHandlingTelemetry` (`src/physics.ts`), `startTrainingLap`
(`src/trainingSession.ts`), `stepLap` (`src/lap.ts`) e os itens de apresentação
[DES-0005](DES-0005-hud-velocidade-e-aderencia.md) e
[DES-0006](DES-0006-resultado-melhor-tempo-e-texto-compartilhado.md). Nenhum módulo o chama.

## Estado e concorrência

Estado local: `setup`, `config`, `setupRef` da volta. `setup` só muda com volta ausente ou encerrada; `config`
é copiado e congelado por `startLap`, então uma mudança de acerto vale para a volta seguinte. Escolher o mesmo
acerto duas vezes atribui o mesmo registro congelado. Nada é persistido.

## Comportamento em falha

Valor do `<select>` fora do mapa: ignorado (`:322`). Sensor negado: toque, estado visível. Sem rede, sem
tempo-limite, sem escrita.

## Observabilidade

`tests/dirigibilidade-contract.test.ts` afirma por texto que `src/main.ts` lê `PUBLISHED_SETUPS`, não importa
`KART_PRESETS`, `ARCADE_KART`, `ARCADE_ASSISTIDO_V5`, `ARCADE_ASSISTIDO_V6`, `testPadArea` nem `./maneuvers`, e
continua alimentando `drift` no `Input`.

## Determinismo (D-DS-07)

Não é código de simulação; o tempo de parede só decide quantos passos rodam num quadro (`advanceClock`, de
`race-lap-validation`). Provas: as de [DES-0001](../core/DES-0001-acerto-arcade-assistido-v6-e-assistencias.md).

## Feature flag

Nenhuma: a escolha do acerto já existe e aponta para o dado publicado; não há chave para outra versão nem
para religar o drift (FEAT-0003 e FEAT-0005, Configuração;
[ADR-0001](../adr/ADR-0001-versao-do-acerto-como-registro-novo-no-codigo.md)).

## Pontos em aberto

Nenhum.
