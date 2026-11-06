---
id: DES-0006
title: Invariantes da simulação, contrato de passo, pista dos ensaios e dependências
feature: pista-kart-park
stage: dspec
status: validated
version: 2.0.0
sources: [FEAT-0007, FEAT-0008, FLOW-0002, REQ-FEAT-0007-03, REQ-FEAT-0007-04, REQ-FEAT-0007-06, REQ-FEAT-0007-07, REQ-FEAT-0007-08, REQ-FEAT-0007-09, REQ-FEAT-0007-10, REQ-FEAT-0007-11, REQ-FEAT-0008-08, REQ-FEAT-0008-25, REQ-FEAT-0008-26, REQ-FEAT-0008-27]
---

# DES-0006 — Invariantes da simulação, contrato de passo, pista dos ensaios e dependências

## Realiza

Os `REQ-*` transversais em `sources`: a mesma sequência de `Input` a partir do mesmo estado na Kart Park dá o
mesmo `lapMs` e os mesmos 4 `sectorMs` (REQ-FEAT-0007-03, -04); superfície, aderência na zebra, zebra como
pista, colisão com a barreira, setores, marcadores e corte são decididos na simulação a partir do dado da
pista, e a apresentação só desenha e reage (REQ-FEAT-0007-06); cada critério de US-0002 a US-0005 observado
na simulação ou no arquivo tem uma verificação determinística em `npm test`, sem renderização
(REQ-FEAT-0007-07); `STEP`, `step(state, input, dt)` e os campos de `Input` não mudam, e o efeito da zebra não
é campo de `Input` (REQ-FEAT-0007-08, -09); a pista sintética continua a pista de todos os ensaios
automáticos de `dirigibilidade` e de `race-lap-validation` (REQ-FEAT-0007-10); nenhuma dependência de
execução nova (REQ-FEAT-0007-11). O acabamento visual (FEAT-0008) não muda a simulação: a mesma sequência de
`Input` a partir do mesmo estado na Kart Park versão 2 dá, com e sem o acabamento desenhado, o mesmo `lapMs`, os
mesmos 4 `sectorMs` e a mesma posição, rumo e velocidade do kart em todo passo, inclusive sobre a faixa de
borda, sobre a zebra e contra a barreira (REQ-FEAT-0008-08, -25, -26, -27). A ordem de entrega depois de
`dirigibilidade` (REQ-FEAT-0007-12) foi retirada na revisão 3 do seed e sai deste item; ela já se cumpriu nas
entregas anteriores e não restringe mais nada.

## Posicionamento

Não é um módulo: é uma restrição que atravessa `src/trackGeometry.ts`, `src/trackData.ts`, `src/physics.ts`,
`src/lap.ts` e `src/trainingSession.ts` (camada **simulação** e **dado de pista**), com a sua verificação em
`tests/pista-kart-park-layering.test.ts` e `tests/pista-kart-park-determinism.test.ts`. Camada do item:
**simulação** (dona do contrato de passo, I8).

## Interface

Nenhuma função nova. As garantias, cada uma com o ponto que a impõe:

| Garantia | Ponto de aplicação |
|---|---|
| Regras de pista na simulação | `classifySurface`, `beyondTrackEdgeM` (dado de pista); `surfaceMu`, bloco da barreira, `trackEdgeDistanceM` (`src/physics.ts`); corte e linhas (`src/lap.ts`); a aplicação só lê `getTrackContact`, `getLapState`, `getLapResult`, `listLapResults` e `getTrainingTrackOptions`; o fim de cada volta do treino é decidido pela simulação e lido pelo crescimento de `listLapResults`, nunca pela aplicação |
| Simulação sem camada externa | os módulos `src/trackGeometry.ts` e `src/trainingSession.ts` entram na lista de simulação do teste de camada desta feature, com os de `race-lap-validation`: nenhuma importação de `three`, `./audio`, `./main`; nenhum uso de `document`, `window`, `Date`, `performance`, `Math.random`, `requestAnimationFrame`, `setTimeout`, `setInterval`. A lista desta feature não nomeia `src/maneuvers.ts`: o drift e o turbo saem do jogo e o módulo tem retirada projetada por `dirigibilidade` (ADR-0006 daquela feature, que espera que nenhum teste de outra feature o nomeie); a pureza dele, enquanto existir, continua afirmada pelo teste de camada de `race-lap-validation` |
| Aplicação pura testável | `src/curbFeedback.ts` entra na lista de aplicação pura: as mesmas proibições de relógio, DOM e sorteio; `src/lapMessages.ts`, que recebe `OSM_CREDIT`, `creditFor` e `optionLabel` ([DES-0007](../web/DES-0007-tela-inicial-seletor-credito-e-resultado.md)), já está na lista de aplicação pura de `race-lap-validation` (`tests/race-lap-validation-layering.test.ts:10`) e continua importando só tipos de `./lap` (`:27-28`) |
| Regra de tela fora da simulação | o teste de camada desta feature afirma que o texto de `src/trainingSession.ts` não contém `openstreetmap`, `ODbL` nem o separador de rótulo `' · '`: os textos do crédito, a regra de exibição do crédito e a formatação do rótulo ficam em `src/lapMessages.ts` (aplicação), e a sessão só entrega as entradas do catálogo |
| Contrato de passo | `export const STEP = 1 / 120;`, o tipo `Input` e a assinatura de `step` ficam literalmente como `tests/race-lap-validation-frozen.test.ts:31-41` afirma; a linha 3 de `src/physics.ts` também |
| Pista dos ensaios | nenhum teste ou bench de `race-lap-validation` e de `dirigibilidade` passa a importar um arquivo `src/tracks/kart-park-v*.json`, `src/trainingSession.ts` ou `trackEnvironment`; os ensaios desta feature são os únicos a usar a Kart Park, e usam a versão 2 (a versão 1 só nas provas de que ela não mudou) |
| Dependências | `package.json` `dependencies` continua só `three`; `devDependencies` não muda; o preparo usa só módulos embutidos do Node |
| Simulação inalterada pelo acabamento (FEAT-0008) | o acabamento vive só em `src/trackScene.ts` e `src/main.ts` (aplicação, [DES-0008](../web/DES-0008-desenho-da-kart-park-na-tela-de-corrida.md)); nenhum módulo da lista de simulação nem `src/trackData.ts` importa `./trackScene`, e nenhuma constante do acabamento (`EDGE_LINE_WIDTH_M`, `CURB_RELIEF_M`, `TYRE_*`, `GRASS_*`) aparece neles; `BARRIER_HALF_WIDTH_M`, `CURB_GRIP_PC` e `STEP` não mudam. A prova é a comparação com e sem o desenho na versão 2 (Determinismo, abaixo) |

## Colaboradores

Os módulos listados acima; os testes de camada, de contrato de passo e de determinismo.

## Estado e concorrência

Sem estado próprio. A sequência de `Input` por passo é a única entrada da simulação; a mesma sequência a
partir do mesmo estado dá os mesmos estados, as mesmas superfícies, os mesmos contatos, os mesmos
cruzamentos e o mesmo tempo (I8).

## Comportamento em falha

Uma violação aparece como reprovação em `npm test` (camada, contrato de passo, dependências, determinismo). Nada
em tempo de execução.

## Determinismo (D-DS-07)

Passo fixo `STEP`, tempo inteiro em ms, sem relógio de parede, sem sorteio sem semente, geometria e barreiras
processadas na ordem do arquivo. Provas em `tests/pista-kart-park-determinism.test.ts`: o piloto de teste da
Kart Park completa uma volta `VALID` duas vezes com a mesma sequência de `Input` e `lapMs` e os 4 `sectorMs`
são iguais um a um; a sessão inteira, kart incluído, é `deepEqual` nas duas execuções; uma sequência
semeada (`tests/helpers/seeded.ts`) de 2.000 passos na Kart Park dá estados `deepEqual` em duas execuções.
`tests/pista-kart-park-layering.test.ts` lê os módulos como texto (como o teste de camada de
`race-lap-validation`) e afirma as proibições acima, que `package.json` mantém as dependências, e que nenhum
arquivo `tests/race-lap-validation-*.test.ts`, `tests/dirigibilidade-*.test.ts`, `scripts/keyboard-lap.ts`,
`scripts/physics-bench.ts` ou `scripts/handlingBench.ts` cita `kart-park`.

Acabamento com e sem desenho na versão 2 (REQ-FEAT-0008-08, -25, -26, -27; NFR-0013 2.0.0). As sequências: a
volta `VALID` do piloto na versão 2; uma volta do piloto com deslocamento lateral que põe as rodas de um lado
sobre a faixa de borda, depois sobre uma zebra, e termina saindo por fora contra a barreira; e a sequência
semeada de 2.000 passos. Cada uma é avançada duas vezes no mesmo processo, sobre o mesmo arquivo: "sem o
acabamento", sem construir cena alguma; "com o acabamento", depois de `buildTrackScene(geometria)` construir o
grupo inteiro (grama, faixa de borda, zebras com relevo, pilhas de pneus) da mesma geometria, e com
`buildTrackScene` chamado de novo a cada 120 passos durante o avanço. O teste guarda, a cada passo de `STEP`,
`x`, `z`, rumo e velocidade do kart com a precisão inteira do `number`, e ao fim `lapMs` e os 4 `sectorMs` de cada
volta concluída, e os acha iguais passo a passo e volta a volta (`===`); afirma, na sequência com deslocamento,
que houve passo com roda a até `EDGE_LINE_WIDTH_M` da borda do asfalto e dentro dele, passo com roda em `CURB` e
passo com `barrierContact`. A prova estrutural acompanha: `tests/pista-kart-park-layering.test.ts` afirma que
nenhum módulo de simulação nem `src/trackData.ts` importa `./trackScene` e que nenhuma constante do acabamento
aparece neles, de modo que construir o desenho não tem caminho até o estado da simulação.

A comparação com `tests/fixtures/kartParkRev1Trace.json` (o traço registrado antes do código da revisão 2, sobre
a versão 1) continua, sem mudança, sobre `src/tracks/kart-park-v1.json`, que não muda: é a prova de que a
simulação não mudou de comportamento desde então, agora também pela revisão 3, que não altera `src/physics.ts`,
`src/lap.ts`, `src/trackGeometry.ts` nem `src/trackData.ts` (a mudança de simulação dela é só a conferência de
versão em `src/trainingSession.ts`, antes de qualquer passo). Ela deixa de ser a prova de REQ-FEAT-0008-25 a -27, que a revisão 3 passou a pedir na versão 2.

## Feature flag

Nenhuma: são restrições, e o estado neutro é o contrato de hoje.

## Pontos em aberto

Nenhum.
