---
id: DES-0007
title: Integração da aplicação — escolha do acerto publicado e adaptadores de controle
feature: dirigibilidade
stage: dspec
status: validated
version: 1.3.0
sources: [FLOW-0001, SCR-0001, FEAT-0001, FEAT-0003, FEAT-0005, FEAT-0006, REQ-FEAT-0001-07, REQ-FEAT-0003-10, REQ-FEAT-0003-13, REQ-FEAT-0003-21, REQ-FEAT-0005-05, REQ-FEAT-0005-09, REQ-FEAT-0006-01, REQ-FEAT-0006-03, NFR-0003, NFR-0005]
---

# DES-0007 — Integração da aplicação — escolha do acerto publicado e adaptadores de controle

## Realiza

Os `REQ-*` em `sources`: a aplicação pilota com o acerto corrente do dado publicado — o acerto C,
`arcade-assistido-v6` — e nunca com outra versão (REQ-FEAT-0005-05, -09); os adaptadores entregam só o
`Input` normalizado, saturado na faixa, binário no teclado e no toque e proporcional na inclinação, sem
regra de pilotagem (REQ-FEAT-0001-07, REQ-FEAT-0003-10, REQ-FEAT-0006-01; NFR-0003, NFR-0005); o comando de
drift da tecla de drift continua chegando à simulação no mesmo campo de `Input`, com a mesma faixa, e não tem
efeito (REQ-FEAT-0003-13; FLOW-0001, "Comando de drift mantido"); o controle de toque de `web-mobile`, com o
sensor de inclinação ativo e no recuo para toque, deixa de exibir o botão "Drift" e não exibe outro controle que
acione o comando de drift ou um turbo (REQ-FEAT-0003-21; AC-US-0003-15; SCR-0001 1.2.0), só por remoção, sem
regra nova no adaptador (REQ-FEAT-0003-10, REQ-FEAT-0006-01); `Input` e o passo inalterados (REQ-FEAT-0006-03).
O Jogador nunca pilota na pista de teste aberta: nenhum adaptador nem tela a alcança.

## Posicionamento

`src/main.ts`, `index.html` e `src/style.css`, camada **Aplicação** (os adaptadores de controle continuam dentro
de `src/main.ts`, como o mapa de camadas registra), **existentes**. A escolha do acerto não muda nesta rodada: ela
já lê `PUBLISHED_SETUPS`, que declara `arcade-assistido-v6`
([DES-0001](../core/DES-0001-acerto-arcade-assistido-v6-e-assistencias.md)), e o pedido da volta já informa
`setupId` e `setupVersion`. O adaptador de toque é **alterado só por remoção** (tabela "Retirada do botão Drift do
controle de toque"). As remoções do drift no HUD são de [DES-0005](DES-0005-hud-velocidade-e-aderencia.md); as da
tela inicial, da dica da barra de ferramentas e do guia de manobras, de
[DES-0009](DES-0009-tela-inicial-dica-e-guia-de-manobras-sem-drift.md). Nenhum módulo novo.

Linhas citadas da árvore corrente de 2026-10-30, depois da rodada de código de `race-lap-validation` que
acrescentou `#lap-end-training` a `index.html:34`.

## Interface

| Trecho atual de `src/main.ts` | O que faz |
|---|---|
| `:2-4` import | `PUBLISHED_SETUPS`, `getHandlingTelemetry`, `getTrackContact` e os tipos `PublishedSetup`/`SetupRef` de `./physics`; `buildLapRecord`/`compareLapRecords` de `./setupRecords`; `formatSharedText`/`shareLabel` de `./handlingMessages`. `KART_PRESETS`, `ARCADE_KART`, `ARCADE_ASSISTIDO_V5`, `ARCADE_ASSISTIDO_V6` e `./maneuvers` não são importados |
| `:130`, `:162` `let setup: PublishedSetup = PUBLISHED_SETUPS.ARCADE_ASSISTIDO; let config = { ...setup.config, driverMass: 75 }` | o acerto corrente vem do dado publicado (`ARCADE_ASSISTIDO_V6`); não há caminho para outra versão |
| `:341-348` seletor `#handling-preset` | os valores `arcade` e `rental` do `<select>` (`index.html:39`) mapeados para `ARCADE_ASSISTIDO` e `REALISTA_ALUGUEL_4T` (`SETUP_BY_PRESET`, `:341`); nenhuma opção para versão anterior, rodada substituída ou preset experimental (`DOMAIN/DEC-10`; FEAT-0005, Configuração) |
| `:318-329` `beginLap` | `startTrainingLap(training, lap, config, {setupId, setupVersion})` (`:319`, sessão de treino de `pista-kart-park`), que passa os dois campos ao pedido de `startLap`; o `setupRef` da volta é fixado no mesmo ponto (`:321`) e usado pelo HUD e pelo registro até a volta encerrar; peso e acerto ficam desabilitados durante a volta (`:632-633`) |
| `:376-383` teclado, `:387-391` toque | o teclado e os botões `[data-control]` do controle de toque alimentam os conjuntos `keys` e `touch`; esterço `−1`, `0` ou `1` e acelerador `0` ou `1` (`:543-548`): a entrada binária de NFR-0003 |
| `:549` comando de drift | **muda**: `drift: keys.has(' ') \|\| touch.has('drift')` passa a `drift: keys.has(' ')` — só a tecla de drift de `web-desktop` alimenta o campo, que a simulação ignora; nenhum controle de toque o alimenta |
| `:392-412` inclinação | `tiltSteer = clamp(delta / 25, −1, 1)` (`:410`) já satura na faixa: a entrada proporcional; sem sensor ou sem permissão o toque assume, com estado visível (`#lap-control-fallback`, de `race-lap-validation`) |
| `:551-554` laço de passos | `advanceClock` decide quantos passos rodam no quadro; `stepLap(lap, input)` com o `Input` amostrado uma vez por quadro, inclusive `drift`, que a simulação ignora |

### Retirada do botão Drift do controle de toque (REQ-FEAT-0003-21)

| Onde | O que sai | O que fica |
|---|---|---|
| `index.html:32` | dentro de `.touch-controls`, o `<button data-control="drift" aria-label="Segurar para drift">Drift</button>` entre os dois grupos | os dois `<div>` com `left`/`right` e `brake`/`throttle`, na mesma ordem e com os mesmos rótulos; o contêiner `.touch-controls` e o seu `aria-label` |
| `src/main.ts:655-656` | `const driftButton = document.querySelector<HTMLButtonElement>('[data-control="drift"]')!;` e `driftButton.disabled = !config.drivingAssists;` — sem o botão, a consulta devolveria `null` e a escrita lançaria a cada quadro | nada no lugar |
| `src/main.ts:549` | `\|\| touch.has('drift')` (linha da Interface acima) | `keys.has(' ')` |
| `src/style.css:3` | a regra `.touch-controls button[data-control=drift]{…}` | `.touch-controls button:disabled{…}` e as demais regras do controle de toque, inalteradas |

O controle de toque é o mesmo com o sensor ativo e no recuo para toque — um só `.touch-controls`, exibido por
`@media(pointer:coarse)` (`src/style.css:7`) —, então uma remoção vale para os dois estados de AC-US-0003-15 e
para qualquer fase da volta. O laço de `:387-391` é genérico sobre `[data-control]` e não muda. Nenhum texto,
ícone nem controle entra no lugar (RNF11; SCR-0001, Ações). O botão `#tilt` ("Ativar inclinação") e a mensagem
do recuo (`#lap-control-fallback`) não são controle de drift e ficam. Em `web-desktop` o controle de toque não é
exibido (`.touch-controls{display:none}`, `src/style.css:5`) e a tecla de drift continua no `Input` sem efeito
(REQ-FEAT-0003-13).

Saturação (I4): o adaptador de inclinação satura em `:410`; a simulação satura de novo na condição de forçar,
no esterço e no acelerador ([DES-0001](../core/DES-0001-acerto-arcade-assistido-v6-e-assistencias.md)), de
modo que um `Input` fora da faixa vale o saturado (REQ-FEAT-0001-07). Nenhuma regra de pilotagem é decidida
aqui: `forcing`, `handling`, superfície, parede e a ausência de efeito do comando de drift só existem em
`src/physics.ts`. O campo `drift` de `Input` não é retirado: o F-Spec o mantém com o mesmo nome e faixa (I8,
NFR-0006), alimentado pela tecla de drift e por replays gravados, e a simulação o ignora (RULE-0001).

## Colaboradores

Chama `PUBLISHED_SETUPS`, `getHandlingTelemetry` (`src/physics.ts`), `startTrainingLap`
(`src/trainingSession.ts`), `stepLap` (`src/lap.ts`) e os itens de apresentação
[DES-0005](DES-0005-hud-velocidade-e-aderencia.md),
[DES-0006](DES-0006-resultado-melhor-tempo-e-texto-compartilhado.md) e
[DES-0009](DES-0009-tela-inicial-dica-e-guia-de-manobras-sem-drift.md). Nenhum módulo o chama.

## Estado e concorrência

Estado local: `setup`, `config`, `setupRef` da volta, `keys`, `touch`. `setup` só muda com volta ausente ou
encerrada; `config` é copiado e congelado por `startLap`, então uma mudança de acerto vale para a volta
seguinte. Escolher o mesmo acerto duas vezes atribui o mesmo registro congelado. Sem o botão, `touch` nunca
contém `drift`. Nada é persistido.

## Comportamento em falha

Valor do `<select>` fora do mapa: ignorado (`:344`). Sensor negado: toque, estado visível, sem botão "Drift".
Sem a consulta de `:655`, nenhum quadro lê um elemento ausente. Sem rede, sem tempo-limite, sem escrita.

## Observabilidade

`tests/dirigibilidade-contract.test.ts` afirma por texto que `src/main.ts` lê `PUBLISHED_SETUPS`, não importa
`KART_PRESETS`, `ARCADE_KART`, `ARCADE_ASSISTIDO_V5`, `ARCADE_ASSISTIDO_V6`, `testPadArea` nem `./maneuvers`, e
continua alimentando `drift` no `Input` pela tecla de drift. `tests/dirigibilidade-hud-text.test.ts` afirma por
texto que `index.html` não tem `data-control="drift"` nem o rótulo "Segurar para drift", que `src/main.ts` não
tem `[data-control="drift"]` nem `touch.has('drift')` e que `src/style.css` não tem `data-control=drift`
(AC-US-0003-15); a tela, com o sensor ativo e no recuo, é o roteiro E2E-04
([test-strategy](../test-strategy.md)).

## Determinismo (D-DS-07)

Não é código de simulação; o tempo de parede só decide quantos passos rodam num quadro (`advanceClock`, de
`race-lap-validation`). Provas: as de [DES-0001](../core/DES-0001-acerto-arcade-assistido-v6-e-assistencias.md).

## Feature flag

Nenhuma: a escolha do acerto já existe e aponta para o dado publicado; a retirada do botão é remoção que
acompanha a manobra retirada; não há chave para outra versão, para religar o drift nem para devolver o botão
(FEAT-0003 e FEAT-0005, Configuração; [ADR-0001](../adr/ADR-0001-versao-do-acerto-como-registro-novo-no-codigo.md)).

## Pontos em aberto

Nenhum.
