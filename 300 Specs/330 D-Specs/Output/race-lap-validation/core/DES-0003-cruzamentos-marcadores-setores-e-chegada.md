---
id: DES-0003
title: Cruzamentos, marcadores, setores e chegada
feature: race-lap-validation
stage: dspec
status: validated
version: 1.1.0
sources: [FEAT-0002, FEAT-0004, FEAT-0006, FEAT-0009, FEAT-0010, REQ-FEAT-0002-01, REQ-FEAT-0002-10, REQ-FEAT-0002-12, REQ-FEAT-0002-13, REQ-FEAT-0002-14, REQ-FEAT-0004-01, REQ-FEAT-0004-02, REQ-FEAT-0004-03, REQ-FEAT-0004-04, REQ-FEAT-0004-05, REQ-FEAT-0004-06, REQ-FEAT-0004-07, REQ-FEAT-0004-09, REQ-FEAT-0004-10, REQ-FEAT-0004-11, REQ-FEAT-0004-12, REQ-FEAT-0004-13, REQ-FEAT-0006-13, REQ-FEAT-0009-01, REQ-FEAT-0010-02, REQ-FEAT-0010-03, REQ-FEAT-0010-09, REQ-FEAT-0010-10, REQ-FEAT-0010-11, REQ-FEAT-0010-23, REQ-FEAT-0010-24, REQ-FEAT-0010-26, REQ-FEAT-0010-27, REQ-FEAT-0010-28, REQ-FEAT-0010-29]
---

# DES-0003 — Cruzamentos, marcadores, setores e chegada

## Realiza

Os `REQ-*` em `sources`: conclusão da volta ao cruzar a chegada no sentido da pista com todos os marcadores em
ordem (AC-US-0002-01), um único resultado por volta (AC-US-0002-12), tempo de setor encerrado no limite declarado,
com o primeiro setor desde o início da volta e cada limite registrado só depois da última fronteira registrada
(AC-US-0002-10; REQ-FEAT-0002-14), marcador pulado e fora de ordem (AC-US-0004-01 a -07), chegada e marcador na
contramão sem efeito (AC-US-0005-01 a -04), e as voltas de reconhecimento e treino tratadas como qualquer outra
(AC-US-0008-01, AC-US-0005-01). No treino: o cruzamento da chegada no sentido da pista encerra a volta em andamento
— válida, inválida por marcador pulado ou já inválida por corte —, produz o resultado dela com o tempo total e os
setores sem tempo marcados, e inicia a volta seguinte no mesmo instante, sem motivo e sem parar o kart
(AC-US-0010-01 a -03, -09 a -11, -23, -24, -26, -27; REQ-FEAT-0010-28, -29). Tabelas de decisão: RULE-0001,
RULE-0003.

## Posicionamento

- Primitivas geométricas em `src/track.ts`, camada **dado de pista**: `sideOf(line, point)` e
  `crossLine(line, from, to)` (existentes, sem mudança). Ficam no dado de pista, e não na simulação, porque a
  verificação de consistência do arquivo ([DES-0006](DES-0006-leitura-do-dado-de-pista.md)) também as usa e uma
  camada interna não pode importar uma externa (I2). O tipo `Line` também é de `src/track.ts`.
- Avaliação por passo em `src/lap.ts` (função interna `evaluateDisplacement` e a nova função interna
  `closeTrainingLap`), camada **simulação**. Não há módulo novo: estende o de DES-0001.

## Interface

`crossLine(line, from, to)` devolve `null` ou `{sense, fraction}`:

- `sense`: `FORWARD` quando `sideOf(from) < 0` e `sideOf(to) >= 0`; `REVERSE` quando `sideOf(from) > 0` e
  `sideOf(to) <= 0`; a fórmula de `side` está em [DM-0001](../data/DM-0001-arquivo-de-pista-versao-2.md).
- `fraction`: `|side(from)| / |side(to) - side(from)|`, em (0, 1]; vale 1 quando o deslocamento termina
  exatamente sobre a linha (coincide com o passo).
- O ponto de cruzamento tem de cair dentro do segmento da linha (parâmetro de 0 a 1 inclusive); fora dele não há
  cruzamento. Só aritmética de soma, subtração, multiplicação e divisão.

`evaluateDisplacement(session, from, to, instantMsAt)` aplica, nesta ordem, para um deslocamento do kart de
`from` a `to` num passo `RUNNING`; `instantMsAt(fraction)` devolve o instante em ms inteiros contado do sinal verde
(`interpolateMs(k, fraction)` num passo; `toMs(stepCount)` num reposicionamento, DES-0005):

1. **Marcador.** Só o marcador de índice `markersPassedCount + 1` (o próximo na ordem declarada) é testado. Um
   cruzamento `FORWARD` dele aumenta `markersPassedCount` de 1. `REVERSE`, ou um marcador que não é o próximo, não
   muda o contador (REQ-FEAT-0004-11 e -12). Atravessar de novo um marcador já contado não faz nada.
2. **Limite de setor.** São candidatos os limites de índice maior que o do limite registrado mais alto da volta,
   isto é, os de posição `sectorBoundsMs.length + 1` em diante, testados em ordem. Um cruzamento `FORWARD` do
   candidato `j` registra `bj = instantMsAt(fraction)`; as posições anteriores ainda sem registro passam a `null` e
   ficam sem registro nesta volta. Contramão e limites de índice menor ou igual ao mais alto registrado não contam.
   É o primeiro cruzamento no sentido da pista depois da última fronteira registrada (REQ-FEAT-0002-14; RULE-0003):
   numa volta que cruza os limites em ordem, o efeito é o de sempre — só o próximo limite conta —, e numa volta de
   treino que salta um limite (um corte que passa por fora dele), os limites seguintes continuam a ser registrados,
   e só os dois setores vizinhos do limite saltado ficam sem tempo (REQ-FEAT-0010-23).
3. **Chegada.** Um cruzamento `REVERSE` é ignorado em todo tipo de volta: a volta não se encerra, não há resultado,
   nenhuma volta começa e a fase continua `RUNNING` (REQ-FEAT-0004-08 a -10, REQ-FEAT-0010-28). Um cruzamento
   `FORWARD`, com `b4 = instantMsAt(fraction)`:

| `lapKind` | Condição | Efeito |
|---|---|---|
| `OFFICIAL`, `RECON` | `markersPassedCount` igual ao total de marcadores | volta concluída: resultado `VALID` com `lapMs` e, numa pista que declara os setores, `sectorMs` ([DES-0005](DES-0005-tipos-de-volta-e-reposicionamento.md), `buildResult`), fase `ENDED` |
| `OFFICIAL`, `RECON` | menos marcadores passados | `validity` `INVALID`, `invalidReason` `MISSED_MARKER`, fase `ENDED`, resultado sem tempo, no passo da chegada, sem tempo acrescentado depois dele (REQ-FEAT-0004-07) |
| `TRAINING` | volta em andamento já `INVALID` (só por corte) | `closeTrainingLap`: resultado `INVALID` com o motivo que a volta já tinha, `CUT`, sem segundo motivo, mesmo que ela tenha pulado marcador ou cortado de novo (REQ-FEAT-0010-29) |
| `TRAINING` | `VALID` e `markersPassedCount` igual ao total | `closeTrainingLap`: resultado `VALID` |
| `TRAINING` | `VALID` e menos marcadores passados | `closeTrainingLap`: resultado `INVALID` com `MISSED_MARKER` (REQ-FEAT-0010-10) |

`closeTrainingLap(session, b4, validity, reason)` faz, num único valor novo da sessão:

- acrescenta a `results` o resultado da volta em andamento (`buildResult`, DES-0005), com `lapSequenceCount`,
  `lapStartMs` (= `b0`), `trainingLapMs = b4 - b0`, `trainingSectorMs` com `null` nos setores sem as duas fronteiras
  numa pista que declara os setores, e nenhum campo de setor numa pista que não os declara (REQ-FEAT-0010-02, -23,
  -24, -27);
- inicia a volta seguinte no mesmo instante: `lapSequenceCount` + 1, `lapStartMs = b4` (o mesmo inteiro, sem nova
  conversão), `markersPassedCount` 0, `sectorBoundsMs` vazia, `validity` `VALID` e `invalidReason` ausente
  (REQ-FEAT-0010-01, -11);
- deixa a fase em `RUNNING`, `stepCount`, `offTrackSteps` e o `kart` como estão: o kart não para e o passo seguinte
  roda com o efeito normal do `Input` (REQ-FEAT-0010-03).

O deslocamento que cruza a chegada não é reavaliado para a volta seguinte: a chegada é a última linha da ordem, e
as linhas que vêm depois dela no percurso são avaliadas a partir do passo seguinte. Numa pista `COMPLETE` duas
linhas distam pelo menos 2 m e no máximo uma é cruzada por passo, de modo que nenhum cruzamento se perde.

Invariante dos dados completos (DM-0001, C4 a C7): numa pista `COMPLETE` a ordem dos eventos ao longo da linha
central é marcador, limite, marcador, limite, marcador, limite, marcador, chegada; cada linha é cruzada uma vez
pela linha central, e duas linhas distam pelo menos 2 m, de modo que no máximo uma linha é cruzada por passo. A
chegada e os limites de setor cobrem a pista até além das paredes (C6), então um kart que passou por todos os
marcadores em ordem e chegou à chegada necessariamente cruzou antes os três limites, em ordem: uma volta `VALID`
numa pista `COMPLETE` tem sempre as três fronteiras registradas antes de `b4`. `tests/lap-validity.test.ts` verifica
essa propriedade com entradas determinísticas semeadas.

**Linhas avaliadas.** Numa leitura `COMPLETE`, todas. Numa leitura `INCOMPLETE`, as que ela declara — chegada,
limites de setor, marcadores — quando declara `direction` e `finishLine`; sem um dos dois, nenhuma linha é avaliada e
nenhuma volta termina na chegada ([ADR-0004](../adr/ADR-0004-lacunas-do-f-spec-resolvidas-no-projeto.md), item 3).
Numa leitura que não declara marcadores, o total é 0 e a condição "todos os marcadores passados em ordem" vale com
zero marcadores (RULE-0001); numa que não declara limites de setor, não há fronteiras `b1` a `b3` e o resultado não
tem tempo de setor (REQ-FEAT-0010-27; `DOMAIN/DEC-13`).

**Precedência no mesmo passo** (lacuna deliberada do F-Spec, decisão de projeto em ADR-0004): primeiro os
cruzamentos de linha na ordem marcador, setor, chegada, depois o corte. Um cruzamento de chegada que encerra uma
volta oficial ou de reconhecimento num passo prevalece sobre um corte que o mesmo passo também configuraria, pois
o cruzamento ocorre no interior do passo e o corte é decidido no fim dele. No treino, o corte decidido no fim do
passo vale para a volta que está em andamento no fim do passo, que é a que acabou de começar (RULE-0004: o corte é
atribuído à volta em andamento no passo em que a duração é ultrapassada).

## Colaboradores

Chama `crossLine` (`src/track.ts`), `interpolateMs` e `toMs` (`src/lapTiming.ts`) e `buildResult` (DES-0005). É
chamado por `stepLap` (DES-0001) e por `repositionKart` (DES-0005).

## Estado e concorrência

Lê e altera `markersPassedCount`, `sectorBoundsMs`, `validity`, `invalidReason`, `phase`, `results` e, no treino,
`lapSequenceCount` e `lapStartMs` (DM-0002).

- **Chave de deduplicação**: o índice do próximo marcador e o índice do limite registrado mais alto. Atravessar de
  novo o que já foi contado é idempotente por construção: o contador não se move e uma fronteira registrada não
  muda. Para a chegada, o próprio passo: cada passo avalia só o seu deslocamento, de modo que um cruzamento é
  avaliado uma única vez e encerra no máximo 1 volta (REQ-FEAT-0010-26).
- **Unicidade**: fora do treino, depois de `ENDED` a sessão não muda (DES-0001); um segundo cruzamento da chegada,
  de volta concluída ou invalidada, não gera segundo resultado (REQ-FEAT-0002-12, -0004-13). No treino, o novo
  cruzamento no sentido da pista encerra a volta seguinte, com resultado próprio, e o resultado já produzido não
  muda.
- **Ordem**: toda transição carrega o `stepCount` do passo em que ocorreu; um marcador atravessado antes do
  anterior é ignorado (evento fora de ordem sem efeito).
- **Pausa**: nenhum passo roda em `PAUSED`, então as passagens por marcador e os limites de setor já registrados
  se preservam (REQ-FEAT-0004-14).

## Comportamento em falha

Sem dependências. Se um deslocamento não cruza nenhuma linha, a sessão só avança o contador. Um deslocamento de
comprimento 0 não cruza nada. Não há registro de log.

## Determinismo (D-DS-07)

Só aritmética de ponto flutuante básica e comparações; passo fixo; sem relógio nem sorteio. Provas:
`tests/lap-crossing.test.ts` (sentido, fração, coincidência exata com o passo, segmento fora do alcance, duas
execuções iguais), `tests/lap-validity.test.ts` (volta completa `VALID` na pista sintética; marcador pulado;
chegada na contramão; novo cruzamento depois do fim; limite registrado depois de um limite saltado) e
`tests/lap-training.test.ts` (voltas seguidas, início no instante do cruzamento, resultado por volta, setores sem
tempo, pista sem setores, contramão no treino).

## Feature flag

Nenhuma: FEAT-0002, FEAT-0004 e FEAT-0010 não têm chave; o comportamento vale ligado.

## Pontos em aberto

Nenhum.
