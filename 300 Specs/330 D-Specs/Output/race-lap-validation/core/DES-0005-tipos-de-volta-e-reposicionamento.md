---
id: DES-0005
title: Tipos de volta, reposicionamento e resultado oficial
feature: race-lap-validation
stage: dspec
status: validated
version: 1.1.1
sources: [FEAT-0006, FEAT-0008, FEAT-0010, REQ-FEAT-0006-01, REQ-FEAT-0006-03, REQ-FEAT-0006-04, REQ-FEAT-0006-06, REQ-FEAT-0006-08, REQ-FEAT-0006-11, REQ-FEAT-0006-12, REQ-FEAT-0006-14, REQ-FEAT-0006-15, REQ-FEAT-0008-06, REQ-FEAT-0008-07, REQ-FEAT-0010-19, REQ-FEAT-0010-21, REQ-FEAT-0010-22, REQ-FEAT-0010-25]
---

# DES-0005 — Tipos de volta, reposicionamento e resultado oficial

## Realiza

Os `REQ-*` em `sources`: reposicionar invalida a volta oficial com o motivo "reposicionamento" e é livre em
reconhecimento e treino (AC-US-0007-01 a -06); no treino, reposicionar não invalida nem revalida a volta em
andamento, válida ou inválida por corte, e não interrompe a sequência (AC-US-0010-19); reposicionamento fora de
`RUNNING` ou com a volta encerrada sem efeito (REQ-FEAT-0006-14, -15); resultado de reconhecimento, de cada volta do
treino e de pista de dado incompleto identificado como não oficial (AC-US-0008-01, -02, -05; AC-US-0010-25); nenhuma
volta oficial numa pista de dado incompleto e treino pilotável (AC-US-0008-03, -04); depois do encerramento de uma
volta oficial nenhuma volta seguinte começa e o kart fica parado (AC-US-0010-21, -22). Regra: RULE-0005.

## Posicionamento

Funções `repositionKart`, `buildResult` e `offeredLapKinds` em `src/lap.ts`, camada **simulação** (estende
DES-0001). O desafio diário, que define o tipo, é outra feature; esta só recebe `lapKind` no pedido.

## Interface

- `repositionKart(lap)` (rejeições em DES-0001). Efeito, com a volta em `RUNNING`:

| `lapKind` | Efeito |
|---|---|
| `OFFICIAL` | `validity` `INVALID`, `invalidReason` `REPOSITION`, fase `ENDED` imediatamente, sem mover o kart nem avançar o `stepCount`; resultado sem tempo. O reposicionamento é aplicado entre dois passos, o que equivale a "o passo do pedido" de RULE-0002: nenhum tempo é acrescentado depois dele |
| `RECON` | o kart é recolocado; `validity`, `invalidReason`, `stepCount` e tempo não mudam, e nenhuma penalidade é acrescentada. Pode repetir sem limite |
| `TRAINING` | o mesmo, em qualquer volta da sequência: uma volta `VALID` segue `VALID`, uma volta `INVALID` com `CUT` segue `INVALID` com `CUT`; nenhum motivo `REPOSITION` é registrado, `lapSequenceCount` e `lapStartMs` não mudam, e a fase segue `RUNNING`, de modo que o passo seguinte roda sem outro comando (REQ-FEAT-0010-19, REQ-FEAT-0010-14) |

- **Destino do reposicionamento** (lacuna deliberada do F-Spec, decisão de projeto em ADR-0004): o ponto da linha
  central do ambiente da sessão mais próximo do kart, por `nearestOnTrack(lap.environment, from)`
  (`src/lap.ts:174-182`): com a geometria de um arquivo de pista no ambiente, `nearestOnCenterline` de
  `src/trackGeometry.ts` dá o ponto e o rumo; sem ela (pista sintética), o ponto é `nearest(kart).position` e o rumo é
  o do segmento `track[i]` a `track[i + 1]` no sentido de percurso (`Math.atan2(dx, dz)`). `heading` igual a esse
  rumo, velocidade 0 e demais campos como em `initialState()`, mantendo `elapsed` do `State`. `offTrackSteps` volta a 0.
  O estilo (`maneuvers`) é reiniciado como no `reset` existente.
- **Princípio do deslocamento**: todo deslocamento do kart é avaliado para cruzamentos de linha, inclusive o do
  reposicionamento. O deslocamento do ponto antigo ao destino passa por `evaluateDisplacement`
  ([DES-0003](DES-0003-cruzamentos-marcadores-setores-e-chegada.md)) com o instante `toMs(stepCount)`. Sem essa
  regra, uma volta de treino poderia saltar um limite de setor sem passar por marcador. No treino, um
  reposicionamento que cruze a chegada no sentido da pista encerra a volta como qualquer outro cruzamento, no
  instante `toMs(stepCount)`; a validade não é tocada pelo reposicionamento em si.
- `buildResult(session, b4?)`: monta o resultado da volta que termina ([DM-0002](../data/DM-0002-estado-da-volta-em-memoria.md)),
  com `b0 = lapStartMs`.
  - `official` = `lapKind` `OFFICIAL` **e** `validity` `VALID` **e** `trackStatus` `COMPLETE`; em qualquer outra
    combinação é falso. Uma volta de reconhecimento ou de treino nunca produz `official` verdadeiro, nem em pista de
    dado completo (AC-US-0008-02, AC-US-0010-25). Em pista `INCOMPLETE` todo resultado é não oficial (AC-US-0008-05).
  - Com `VALID` e `b4`: `lapMs = b4 - b0`; `sectorMs` com os quatro tempos quando a pista declara os 3 limites de
    setor e as três fronteiras estão registradas (sempre, numa pista `COMPLETE`, DES-0003).
  - Com `INVALID`: `invalidReason`, sem `lapMs` nem `sectorMs` (INV-6).
  - Só com `TRAINING`: `lapSequenceCount`, `lapStartMs`, `trainingLapMs = b4 - b0` e, numa pista que declara os 3
    limites de setor, `trainingSectorMs` com `null` em cada setor sem as duas fronteiras. Em `OFFICIAL` e `RECON` os
    quatro campos ficam ausentes, como todo resultado anterior a esta rodada (API-0001, compatibilidade).
- **Fim da volta oficial e de reconhecimento**: o resultado é produzido no passo do encerramento e a fase passa a
  `ENDED` no mesmo passo. `stepLap` devolve a mesma sessão em `ENDED` (DES-0001), de modo que a partir do passo do
  encerramento a posição do `kart` no estado da simulação não muda e nenhuma volta seguinte começa
  (REQ-FEAT-0010-21, -22). Na volta de reconhecimento o kart também fica parado; o F-Spec não fixa o movimento dele,
  e esta é a decisão de projeto de [ADR-0004](../adr/ADR-0004-lacunas-do-f-spec-resolvidas-no-projeto.md), item 7.
- `offeredLapKinds(reading, challengeKinds = [])`: `COMPLETE` devolve `TRAINING` mais os tipos que o desafio
  diário definir em `challengeKinds`; `INCOMPLETE` devolve só `TRAINING`, nunca `OFFICIAL` (AC-US-0008-03);
  `UNSUPPORTED_SCHEMA` e `UNREADABLE` devolvem lista vazia. Esta feature chama a função com `challengeKinds`
  vazio, pois o desafio diário não existe ainda; assim a oferta nunca inclui volta oficial nem de reconhecimento
  sem que o desafio as defina. A apresentação exibe exatamente a lista, sem decidir nada (I2).

## Colaboradores

Chama `nearestOnCenterline` (`src/trackGeometry.ts`) quando o ambiente traz a geometria do arquivo, senão `nearest`
e `track` (`src/track.ts`); `initialState` (`src/physics.ts`), `toMs`, DES-0003. Chamado por `src/main.ts` (tecla `R` e botão de
reposicionar) e por `src/lap.ts`.

## Estado e concorrência

Lê `lapKind`, `phase`, `trackStatus`, `lapStartMs`, `lapSequenceCount`; altera `kart`, `validity`,
`invalidReason`, `phase`, `results`, `offTrackSteps`.

- **Idempotência**: em `OFFICIAL` o primeiro pedido encerra a volta e os seguintes recebem `LAP_ENDED`, sem segundo
  resultado e mantendo o motivo `REPOSITION` do primeiro (REQ-FEAT-0006-14). Em `RECON` e `TRAINING` cada pedido
  recoloca o kart sem outro efeito de validade. Em `COUNTDOWN` e `PAUSED` o pedido é rejeitado com `NOT_RUNNING`,
  porque pausar ou aguardar não é reposicionar (REQ-FEAT-0006-15).
- Contador de sequência: `stepCount` do pedido; o reposicionamento não o avança.
- O tipo não muda durante a sessão (INV-4).

## Comportamento em falha

Sem dependência. Um pedido `OFFICIAL` em leitura `INCOMPLETE` que chegue à simulação é rejeitado em `startLap`
com `OFFICIAL_NOT_AVAILABLE`; a apresentação não deveria tê-lo emitido, e nenhuma volta é criada. Sem registro de
log: a rejeição é um valor devolvido.

## Determinismo (D-DS-07)

O destino é função do estado do kart e da linha central; sem relógio nem sorteio; o passo continua `STEP`. Provas
em `tests/lap-kinds.test.ts`: reposicionar em `OFFICIAL` invalida no ato, sem tempo e com `REPOSITION`; em
`TRAINING` e `RECON` N passos depois do sinal verde o `elapsedMs` é `toMs(N)` com e sem reposicionamentos; o
segundo reposicionamento oficial dá `LAP_ENDED`; `NOT_RUNNING` em contagem e pausa; `official` falso em
`TRAINING` e `RECON` concluídos e em pista `INCOMPLETE`; `OFFICIAL_NOT_AVAILABLE`; `offeredLapKinds` por status.
Em `tests/lap-training.test.ts`: reposicionar numa volta seguinte do treino mantém `elapsedMs` igual a
`toMs(stepCount) - lapStartMs`; reposicionar numa volta `INVALID` com `CUT` a mantém assim; depois do encerramento de
uma volta oficial, 600 passos com aceleração máxima deixam o `kart` e `listLapResults` iguais (`deepEqual`).

## Feature flag

Nenhuma: FEAT-0006 e FEAT-0010 não têm chave; o tipo da volta é entrada do pedido, e não ajuste.

## Pontos em aberto

Nenhum.
