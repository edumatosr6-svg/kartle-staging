---
id: DES-0005
title: HUD de velocidade e estado de aderência, sem indicador de drift ou turbo
feature: dirigibilidade
stage: dspec
status: validated
version: 2.0.0
sources: [SCR-0001, FLOW-0001, API-0001, FEAT-0003, FEAT-0004, FEAT-0006, REQ-FEAT-0003-14, REQ-FEAT-0004-06, REQ-FEAT-0004-09, REQ-FEAT-0006-01]
---

# DES-0005 — HUD de velocidade e estado de aderência, sem indicador de drift ou turbo

## Realiza

Os `REQ-*` em `sources`: velocidade em km/h e estado de aderência em texto em todos os quadros entre o
sinal verde e o fim da volta, nos dois canais, sem remover nem ocultar os dois elementos (AC-US-0004-06);
último valor mantido na suspensão (REQ-FEAT-0004-09); nenhum indicador de carga de drift, de turbo ou de
impulso, combo ou pontuação de drift no HUD, em nenhum estado e com o comando de drift mantido
(AC-US-0003-09; REQ-FEAT-0003-14); a retirada é só remoção de exibição, sem regra nova na renderização
(REQ-FEAT-0006-01; `SEED/RE-01`, `DOMAIN/DEC-16`). Tela: SCR-0001 1.1.0.

## Posicionamento

`src/main.ts`, `index.html` e `src/style.css`, camada **Aplicação**, **existentes** e **alterados** só por
remoção. Os elementos `#speed` (`index.html:29`) e `#handling` (`index.html:28`) continuam no mesmo lugar,
com o mesmo estilo e a mesma leitura.

## Interface

Leitura dos dois elementos (inalterada):

| Trecho atual de `src/main.ts` | O que faz |
|---|---|
| `:605` `const telemetry = getHandlingTelemetry(state, setupRef)` | lê a telemetria do contrato; com `'code' in telemetry` os dois elementos ficam sem valor (`:607`); senão `#speed` recebe `Math.round(telemetry.speedMps × 3,6)` (`:609`) |
| `:606`, `:610-611` `labels[telemetry.handling]` | a tabela de rótulos é a de antes da feature, inalterada; `data-state` recebe `telemetry.handling` |

`state` é `lap?.kart ?? idleKart ?? initialState()` (`:522`): na pausa, perda de foco ou perda do sensor
`stepLap` devolve a mesma sessão, logo o HUD mantém o último valor por construção; antes do sinal verde a
leitura é o estado inicial (0 km/h, `grip`) — "Vazio" de SCR-0001; ao fim da volta, o último passo.

Retirada da exibição do drift e do turbo **(muda)**:

| Onde | O que sai |
|---|---|
| `index.html:18` | o `<span class="style-score">` (rótulo "ESTILO", `#style-score` e `#combo`) dentro de `.timing`; "VOLTA ATUAL", `#timer` e "Melhor" ficam |
| `index.html:30` | o bloco `#drift-hud` inteiro (`#drift-label`, `#drift-meter` com `#drift-fill`, `#drift-help`) |
| `src/main.ts:5` | `import { chargeTier } from './maneuvers'` |
| `src/main.ts:500`, `:502-506` | a leitura de `maneuvers.awards` antes do passo e, depois dele, a mensagem de prêmio (`notify` com "Boa curva!", "Drift perfeito!", "Super drift!" e os pontos de estilo) e `audio.reward(tier)`: o laço passa a só `lap = stepLap(lap, input)` antes do retorno da zebra |
| `src/main.ts:613-624` | a escrita de `#style-score` e `#combo`, o cálculo de `tier` e de `fill`, a escrita de `#drift-fill`, `#drift-meter` (`aria-valuenow`, `aria-label`), `#drift-hud` (`data-tier`, `hidden`), `#drift-label`, `#drift-help` e a classe `boosting` em `.game-shell` |
| `src/style.css:3` | as regras só desses elementos: `.style-score`, `.style-score em`, `.drift-hud`, `.drift-hud strong`, `.drift-hud small`, `.drift-meter`, `.drift-meter i`, os três `.drift-hud[data-tier=…] .drift-meter i`, `.boosting`, e as ocorrências de `.drift-hud` dentro de `@media(max-width:700px)` e `@media(pointer:coarse)` |

Ficam, porque não são indicador de carga, turbo, impulso, combo nem pontuação: o botão de toque
`[data-control="drift"]` (`index.html:31`, `src/main.ts:625-626`), que é o controle de drift do adaptador de
toque e entrega o comando que a simulação ignora (RULE-0001; SCR-0001, Ações); a leitura do comando em
`src/main.ts:495`; e as leituras de `state.maneuvers` que pertencem a `modelo-kart-01` (`:553`, `:555`,
`:559`, `:586`), que passam a ler sempre o valor inicial
([ADR-0006](../adr/ADR-0006-retirada-do-drift-e-do-turbo-com-janela-de-compatibilidade.md)). Os textos de
instrução do drift fora do HUD (`index.html:19` boas-vindas, `:33` dica da barra, `:34` guia de manobras) não
são HUD durante a volta nem resultado, e não mudam nesta rodada (motivo no changelog). `src/audio.ts` não
muda: `reward` deixa de ser chamado.

Conversão: `km/h = speedMps × 3,6`, arredondada ao inteiro; nenhuma outra transformação. O canal
`web-mobile` usa os mesmos elementos e a mesma leitura; a inclinação só muda o adaptador.

## Colaboradores

Chama `getHandlingTelemetry` (`src/physics.ts`, [DES-0002](../core/DES-0002-telemetria-de-dirigibilidade.md)).
Chamado pelo laço de quadros de `src/main.ts`. Nenhum módulo o chama.

## Estado e concorrência

Sem estado próprio: o HUD é função da leitura do quadro. Redesenhar o mesmo quadro mostra o mesmo valor.
Nada é gravado. A retirada não deixa estado: nenhuma variável de carga, prêmio ou combo existe na aplicação.

## Comportamento em falha

`NO_STATE` deixa os dois elementos sem valor de telemetria (SCR-0001, "Carregando"). Sem dependência externa,
tempo-limite nem escrita. Nada é registrado em log.

## Observabilidade

A prova de "todos os quadros" e da ausência dos indicadores na tela é o roteiro registrado E2E-01
([test-strategy](../test-strategy.md)); `tests/dirigibilidade-hud-text.test.ts` afirma por texto que
`index.html` não contém `style-score`, `combo`, `drift-hud`, `drift-meter`, `drift-label` nem `drift-help`, que
`src/main.ts` não os escreve, não importa `./maneuvers` nem chama `notify` com pontos de estilo, e que
`src/style.css` não tem `.drift-hud`, `.drift-meter`, `.style-score` nem `.boosting`.

## Determinismo (D-DS-07)

Não é código de simulação; só lê. `tests/dirigibilidade-contract.test.ts` afirma que `src/main.ts` não
contém os literais da condição de forçar (`50 / 3.6`, `13.88`) nem o teto 0,65 (nenhuma regra decidida na
apresentação).

## Feature flag

Nenhuma: os dois elementos já existem; a retirada dos indicadores do drift é remoção de exibição que
acompanha a manobra retirada, sem chave para religá-la (FEAT-0003, Configuração).

## Pontos em aberto

Nenhum.
