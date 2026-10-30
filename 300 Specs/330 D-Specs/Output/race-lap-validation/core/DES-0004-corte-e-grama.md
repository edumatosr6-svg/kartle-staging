---
id: DES-0004
title: Corte e grama
feature: race-lap-validation
stage: dspec
status: validated
version: 1.1.1
sources: [FEAT-0005, FEAT-0008, FEAT-0010, REQ-FEAT-0005-01, REQ-FEAT-0005-02, REQ-FEAT-0005-03, REQ-FEAT-0005-04, REQ-FEAT-0005-06, REQ-FEAT-0005-07, REQ-FEAT-0005-09, REQ-FEAT-0005-10, REQ-FEAT-0005-11, REQ-FEAT-0008-04, REQ-FEAT-0010-07, REQ-FEAT-0010-08, REQ-FEAT-0010-29]
---

# DES-0004 — Corte e grama

## Realiza

Os `REQ-*` em `sources`: corte quando o kart fica a mais de 3 m além da borda por mais de 1000 ms seguidos, ou
pelos limites que a pista declara (AC-US-0006-01 a -04); motivo "corte" e, em volta oficial e de reconhecimento,
fim no passo da invalidação (AC-US-0006-05, -06); grama sem corte só reduz a velocidade (AC-US-0006-07, -08);
contagem recomeçando a cada nova saída; tempo de pausa fora da conta. No treino, o corte invalida no passo sem
encerrar a volta e sem parar o kart, e um novo corte numa volta já inválida não muda nada (AC-US-0010-07, -08;
REQ-FEAT-0010-29). Regra de decisão: RULE-0004.

## Posicionamento

Função interna `evaluateCut` em `src/lap.ts`, camada **simulação** (estende DES-0001; não há módulo novo). A
física da grama é a existente: `CIRCUIT.surfaceAt` classifica como grama todo ponto a mais de `WIDTH / 2` da
linha central, e o atrito e a resistência de rolagem de `src/physics.ts` já reduzem a velocidade (REQ-FEAT-0005-07).
Esta feature não altera a física (NFR-0011).

## Interface

- Distância além da borda, em metros, 0 sobre a pista, medida na posição do centro do kart pela borda do ambiente
  da sessão: `trackEdgeDistanceM(session.environment, ponto)` (`src/physics.ts:185-187`), chamada por `evaluateCut`
  (`src/lap.ts:263-270`). Com a geometria de um arquivo de pista no ambiente (`environment.track`), a borda é a dessa
  geometria; sem ela (pista sintética), é a expressão de `edgeDistanceM(point)`:
  `Math.max(0, nearest(point).distance - WIDTH / 2)`, com `nearest` e `WIDTH` de `src/track.ts`. Nas tabelas abaixo,
  `edgeDistanceM` designa essa medida por ambiente.
- `resolveCutLimits(track)`: `{distanceM, durationMs}` com `distanceM` = `cutDistanceM` da pista se declarado e
  válido, senão 3, e `durationMs` = `cutDurationMs` se declarado e válido, senão 1000. Cada limite ausente usa o
  seu padrão, de modo independente (REQ-FEAT-0008-04). `DEFAULT_CUT_DISTANCE_M` e `DEFAULT_CUT_DURATION_MS` são
  constantes de `src/trackData.ts`.
- `evaluateCut(session, kartAfterStep)`, executado depois dos cruzamentos de linha, num passo `RUNNING` cuja fase
  continua `RUNNING` depois deles:

| Condição no passo | Efeito |
|---|---|
| `edgeDistanceM` menor ou igual a `distanceM` (inclui sobre a pista) | `offTrackSteps` = 0; nenhum efeito sobre a validade; só a redução de velocidade da grama |
| `edgeDistanceM` maior que `distanceM` e `isCutExceeded(offTrackSteps + 1, durationMs)` falso | `offTrackSteps` + 1 |
| `edgeDistanceM` maior que `distanceM` e `isCutExceeded(offTrackSteps + 1, durationMs)` verdadeiro | `offTrackSteps` + 1 e corte neste passo, com o efeito da tabela seguinte |

| `lapKind` | Volta em andamento | Efeito do corte |
|---|---|---|
| `OFFICIAL`, `RECON` | `VALID` | `validity` `INVALID`, `invalidReason` `CUT`, fase `ENDED` neste passo, resultado sem tempo; o passo da invalidação conta no `stepCount`, nenhum tempo de volta nem de setor é acrescentado depois dele (REQ-FEAT-0005-06) |
| `TRAINING` | `VALID` | `validity` `INVALID`, `invalidReason` `CUT` neste passo; a fase segue `RUNNING`, nenhum resultado é produzido e nenhuma volta começa; o kart não é tocado e o passo seguinte roda com o efeito normal do `Input` (REQ-FEAT-0010-07, -08); a volta termina só no próximo cruzamento da chegada no sentido da pista ([DES-0003](DES-0003-cruzamentos-marcadores-setores-e-chegada.md)) |
| `TRAINING` | já `INVALID` com `CUT` | nada além de `offTrackSteps`: o motivo continua `CUT` e nada mais muda (RULE-0004, "Novo corte numa volta de treino já inválida") |

"Maior" é estrito: 3 m exatos não é corte, e 1000 ms exatos (120 passos) não é corte; com 121 passos,
`25 * 121 = 3025 > 3000`, o corte ocorre no 121º passo seguido (REQ-FEAT-0005-01). A comparação é inteira e
exata ([DES-0002](DES-0002-tempo-da-volta-e-interpolacao.md)), sem arredondar milissegundos.

Aplica-se a todos os tipos de volta e a dado `COMPLETE` ou `INCOMPLETE` (RULE-0001, Tabela 2). Fora do treino, um
corte que ocorre antes de uma chegada sem marcadores mantém o motivo `CUT`, porque a volta já terminou; no treino,
porque a volta segue inválida com `CUT` até a chegada e o resultado leva o primeiro motivo (REQ-FEAT-0005-11).

No treino, `offTrackSteps` mede a saída do kart e não recomeça no início de uma volta (RULE-0004): uma saída que
atravessa a chegada continua contando, e cada passo em que a duração está ultrapassada é um passo de corte, com o
efeito da tabela sobre a volta em andamento nesse passo. Por isso a volta que começa durante uma saída já além dos
limites fica `INVALID` com `CUT` no fim do passo em que começou, e a precedência no mesmo passo é a de
[ADR-0004](../adr/ADR-0004-lacunas-do-f-spec-resolvidas-no-projeto.md), item 1.

## Colaboradores

Chama `trackEdgeDistanceM` (`src/physics.ts`), que usa a geometria do arquivo de pista quando o ambiente a traz e,
sem ela, `nearest` e `WIDTH` (`src/track.ts`); e `isCutExceeded` (`src/lapTiming.ts`). Chamado por `stepLap`.

## Estado e concorrência

Lê e altera `offTrackSteps`, `validity`, `invalidReason` e, fora do treino, `phase` e `results`.

- `offTrackSteps` avança apenas por passo de simulação em `RUNNING`; não avança em `PAUSED`, então o tempo de
  pausa, de perda de foco ou de perda do sensor não conta para os limites (REQ-FEAT-0005-10) e a contagem de
  uma saída em curso é retomada do mesmo valor ao continuar.
- Idempotência: o corte invalida uma volta uma única vez. Fora do treino a fase passa a `ENDED` e novos passos de
  saída de pista são ignorados; no treino a volta já está `INVALID` e um novo passo de corte não muda o motivo.
  Reaplicar o mesmo passo não existe; o estado só avança passo a passo.
- Contador de sequência: `stepCount` do passo da invalidação.
- Uma saída seguida de retorno a `distanceM` ou menos zera o acumulador; uma nova saída recomeça a contagem
  (REQ-FEAT-0005-09).
- No reposicionamento em volta de reconhecimento ou treino, `offTrackSteps` volta a 0 porque o kart é recolocado
  na linha central (DES-0005); a validade não muda.

## Comportamento em falha

Sem dependência. Limites de corte declarados fora de forma tornam o dado `INCOMPLETE`
([DES-0006](DES-0006-leitura-do-dado-de-pista.md)) e valem os padrões na sessão. Nenhum registro de log.

## Determinismo (D-DS-07)

Passo fixo; comparação inteira; a distância vem da borda do ambiente (geometria do arquivo ou `nearest` na pista
sintética), determinística e sem relógio. Provas em
`tests/lap-cut.test.ts`: o teste dirige o kart (entrada fixa que o leva para fora da pista, em `CIRCUIT`) numa volta
oficial e, em paralelo, recalcula com um oráculo independente (um laço de `step` e `nearest` do próprio teste) o
primeiro passo em que o kart está a mais de 3 m da borda por mais de 120 passos seguidos; afirma que a volta fica
`INVALID` `CUT` exatamente nesse passo, que 120 passos exatos e distância de 3 m exatos não invalidam, que uma saída
de 120 passos seguida de retorno não invalida, que uma pista com `cutDistanceM` 1 e `cutDurationMs` 300 invalida
pelos limites da pista, e que pausar no meio da saída e continuar dá o mesmo passo de corte. Em
`tests/lap-training.test.ts`, a mesma saída num treino: `INVALID` `CUT` no mesmo passo, fase `RUNNING`, nenhum
resultado novo, velocidade maior que 0 m/s um passo depois com aceleração máxima, e motivo `CUT` mantido depois de
mais passos de corte. A redução da grama é provada pelos testes existentes de física (`grass slows the kart more
than asphalt`) e por um teste que compara N passos em grama e em asfalto com a mesma entrada.

## Feature flag

Nenhuma: FEAT-0005 e FEAT-0010 não têm chave; os limites são dado da pista com padrão neutro (`DEC-01`: valem 3 m
e 1000 ms quando a pista não declara).

## Pontos em aberto

Nenhum.
