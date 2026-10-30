---
id: DES-0004
title: Volta na Kart Park — corte pela borda da pista, reposicionamento e largada
feature: pista-kart-park
stage: dspec
status: validated
version: 1.1.0
sources: [FEAT-0003, FEAT-0005, FLOW-0002, RULE-0001, REQ-FEAT-0001-08, REQ-FEAT-0002-12, REQ-FEAT-0003-08, REQ-FEAT-0003-10, REQ-FEAT-0003-11, REQ-FEAT-0003-12, REQ-FEAT-0003-13, REQ-FEAT-0003-15, REQ-FEAT-0005-07]
---

# DES-0004 — Volta na Kart Park: corte pela borda da pista, reposicionamento e largada

## Realiza

Os `REQ-*` em `sources`: na Kart Park a volta é validada pelas regras de `race-lap-validation`, sem mudança de
regra: marcador pulado dá `INVALID` com `MISSED_MARKER` (REQ-FEAT-0003-08), a volta completa pelos marcadores
em ordem dá `VALID` (REQ-FEAT-0003-13), o atalho pela grama da curva 4 dá `INVALID` (REQ-FEAT-0003-12),
chegada cruzada de novo, contramão, pausa, perda de foco e recarga seguem as mesmas regras
(REQ-FEAT-0003-15); o corte compara com `cutDistanceM` a distância medida da **borda da pista** da Kart Park,
que inclui a zebra (REQ-FEAT-0003-10, -11; REQ-FEAT-0005-07); o kart começa na `startPosition` declarada
(REQ-FEAT-0001-08); a linha central usada no estado da simulação é a do arquivo (REQ-FEAT-0002-12), também no
reposicionamento, que hoje usa a linha central da pista sintética.

"As mesmas regras" são as do F-Spec revalidado de `race-lap-validation` (FEAT-0010, RULE-0002 1.1.1, API-0001
1.2.0, API-0002 1.2.1) e do seu projeto (ADR-0006, DM-0002 1.2.0, DES-0001 1.2.0, DES-0003 1.1.0): como toda volta
de uma sessão de treino é `TRAINING` ([DES-0005](DES-0005-sessao-de-treino-catalogo-e-selecao-de-pista.md)), a volta
na Kart Park é uma volta de um **treino de voltas seguidas** — ver "Volta de treino na Kart Park", abaixo.

## Posicionamento

`src/lap.ts`, camada **simulação**, alterado. Passa a importar `trackEdgeDistanceM` de `src/physics.ts` e
`nearestOnCenterline` de `src/trackGeometry.ts`. O modelo de estados da volta (`LapSession`, `LapResult`,
`LapStateView`, os comandos e os seus códigos) é o de `race-lap-validation` e não é alterado por esta feature:
a sequência de voltas do treino, a lista `results`, `listLapResults` e `endTraining` são daquela feature. Nenhum
módulo novo.

## Interface

| Trecho atual | Mudança |
|---|---|
| `startLap`, `:109-112` | a construção do kart parado na largada passa a ser a função exportada `kartAtStart(start)`; `startLap` a chama com o mesmo resultado bit a bit |
| `kartAtStart(start)` | nova: `(StartPosition \| undefined) => State`: `{...initialState(), x: start.xM, z: start.zM, heading: start.headingDeg * Math.PI / 180}`, ou `initialState()` sem largada; usada também pela sessão de treino ([DES-0005](DES-0005-sessao-de-treino-catalogo-e-selecao-de-pista.md)) |
| `evaluateCut`, `:245-252` | `edgeDistanceM(kart)` passa a `trackEdgeDistanceM(session.environment, kart)`; as comparações estritas, o acumulador `offTrackSteps` e `isCutExceeded` não mudam |
| `repositionKart`, `:154-161` | com `lap.environment.track`, o destino é `nearestOnCenterline(track, from)`: posição no ponto mais próximo da linha central do arquivo e rumo do segmento no sentido de percurso; sem `track`, o código de hoje (`nearest` e `track` da pista sintética) |
| `edgeDistanceM`, `:218-220` | inalterado e ainda exportado (pista sintética) |

As linhas da volta (chegada, limites, marcadores) continuam vindo da leitura (`:106-108`) e os cruzamentos de
`evaluateDisplacement` (`:223-242`) continuam os mesmos: a Kart Park só entrega linhas transversais que
atravessam a pista e se estendem até `cutDistanceM` além da borda da pista
([DES-0010](../pipeline/DES-0010-preparo-offline-do-arquivo-da-kart-park.md)). Por isso o atalho da curva 4,
feito a mais de 3 m da borda da pista na grama de 12 a 26 m, não cruza ao menos um marcador: se volta à pista
antes de passar 1000 ms além dos 3 m, a volta recebe `INVALID` com `MISSED_MARKER` no cruzamento da chegada que a
encerra; se passa 1000 ms a mais de 3 m da borda, fica `INVALID` com `CUT` no passo em que a duração é
ultrapassada, e o resultado dela, no cruzamento seguinte da chegada, mantém `CUT` como único motivo
(REQ-FEAT-0010-29 de `race-lap-validation`).

### Volta de treino na Kart Park

O que a sessão de treino desta feature inicia é um treino de `race-lap-validation` (ADR-0006 daquela feature):
**uma** `LapSession` `TRAINING`, criada por um único `startLap`, que passa por uma contagem e fica em `RUNNING` de
volta em volta. Na Kart Park isso dá, sem regra nova:

| Evento na Kart Park | Efeito no estado da simulação |
|---|---|
| cruzamento da chegada no sentido da pista | a volta em andamento termina: `listLapResults(lap).lapResults` ganha exatamente um item (`VALID`, ou `INVALID` com `MISSED_MARKER` ou com o `CUT` já registrado), e a volta seguinte começa no mesmo instante, com `lapSequenceCount` + 1, `VALID`, nenhum marcador e nenhum limite de setor; a fase continua `RUNNING` e o kart não para |
| corte (mais de 1000 ms a mais de 3 m da borda da pista) | `lapValidity` `INVALID` com `CUT` no passo; a fase continua `RUNNING`, nenhum resultado é produzido e nenhuma volta começa até o cruzamento seguinte da chegada no sentido da pista |
| chegada cruzada na contramão | nada termina e nada começa; nenhum resultado |
| chegada cruzada de novo depois de uma volta concluída | termina a volta seguinte, com o seu próprio resultado; o resultado já produzido não muda e não há segundo resultado para ele |
| pausa e retomada | a mesma volta segue com o mesmo estado e o mesmo tempo; nenhuma contagem |
| reposicionamento | o kart vai para a linha central do arquivo; a validade, o motivo e o tempo da volta em andamento não mudam (REQ-FEAT-0010-19 de `race-lap-validation`) |
| `endTraining` | fase `ENDED`; nenhum resultado para a volta em andamento e nenhuma volta depois |

O fim de cada volta é lido pelo **crescimento** de `listLapResults(lap).lapResults`, nunca pela chegada a `ENDED`,
que numa volta de treino só acontece por `endTraining`. Esta feature não lê nem escreve `results` diretamente; a
aplicação trata cada item novo como `race-lap-validation` projeta (`handledResults`, DES-0007 daquela feature) e
exibe o crédito no painel do resultado ([DES-0007](../web/DES-0007-tela-inicial-seletor-credito-e-resultado.md)).

## Colaboradores

Chama `step`, `trackEdgeDistanceM`, `initialState` (`src/physics.ts`), `nearestOnCenterline`
(`src/trackGeometry.ts`), `crossLine`, `nearest`, `track` (`src/track.ts`) e `src/lapTiming.ts`. É chamado por
`src/trainingSession.ts` (`startLap` via `startTrainingLap`, `kartAtStart`), pela aplicação (comandos da
volta, `listLapResults`, `endTraining`) e pelos testes.

## Estado e concorrência

Sem mudança: funções puras sobre uma `LapSession` imutável, rejeições como valores, contador de sequência
`stepCount` do treino (não recomeça a cada volta), duração do corte em passos de `STEP` (`offTrackSteps`), que só
avança em `RUNNING` e volta a 0 sobre a pista. Um cruzamento da chegada é avaliado uma vez, no passo em que
ocorre, e encerra no máximo uma volta: reler `listLapResults` não produz item novo. Uma volta repetida pela mesma
sequência de `Input` dá a mesma sessão.

## Comportamento em falha

Os códigos de rejeição de `race-lap-validation` não mudam por esta feature (`LAP_ALREADY_ACTIVE`,
`TRACK_DATA_UNREADABLE`, `TRACK_SCHEMA_UNSUPPORTED`, `OFFICIAL_NOT_AVAILABLE`, `NO_ACTIVE_LAP`, `LAP_ENDED`,
`ALREADY_PAUSED`, `NOT_PAUSED`, `NOT_RUNNING` e `NOT_TRAINING`). Sem rede, sem escrita, sem registro.

## Determinismo (D-DS-07)

Passo fixo, tempo inteiro em ms (`lapTiming`), sem relógio nem sorteio. Provas em
`tests/pista-kart-park-lap.test.ts`, com o piloto de teste da Kart Park sobre uma volta `TRAINING` iniciada por
`startLap` ([test-strategy](../test-strategy.md)); em todas, o fim de uma volta é o passo em que
`listLapResults(lap).lapResults` cresce, e a prova lê o item novo: volta completa com resultado `VALID` com 4
setores, a fase em `RUNNING` e a volta seguinte começando com `lapStartMs` igual ao fim da anterior; marcador
pulado por uma excursão lateral curta a 3,5 m da borda da pista dá resultado `MISSED_MARKER` e não `CUT`; kart
mantido a mais de 3 m da borda da pista por 121 passos dá `INVALID` com `CUT` no passo 121, com a fase em
`RUNNING` e nenhum item novo em `listLapResults`, e por 120 passos não dá; o atalho de cerca de 147 m a cerca de
200 m dá resultado `INVALID` no cruzamento da chegada; kart rodando sobre a zebra por mais de 1000 ms, sem roda
além dela, não dá `CUT`; a chegada cruzada de novo depois de uma volta concluída dá o resultado da segunda volta
(`lapSequenceCount` 2) e deixa o primeiro igual; a chegada na contramão não dá resultado; pausa e retomada no
meio da volta dão o resultado `VALID` no cruzamento seguinte; reposicionamento na Kart Park põe o kart sobre a
linha central do arquivo; a mesma sequência de `Input` dá `lapMs` e `sectorMs` iguais em duas execuções. Nenhuma
prova desta feature espera que uma volta `TRAINING` chegue a `ENDED` na chegada ou no corte. Os testes de
`race-lap-validation` sobre a pista sintética (corte, reposicionamento, tipos de volta) passam sem alteração,
porque o caminho sem `track` é o de hoje.

## Feature flag

Nenhuma: na pista sintética o comportamento é o de antes, e na Kart Park a borda é a da pista que o F-Spec
define; não há configuração dos limites de corte (FEAT-0003, Configuração), e o treino de voltas seguidas é de
`race-lap-validation`, sem chave (FEAT-0010 daquela feature, Configuração).

## Pontos em aberto

Nenhum.
