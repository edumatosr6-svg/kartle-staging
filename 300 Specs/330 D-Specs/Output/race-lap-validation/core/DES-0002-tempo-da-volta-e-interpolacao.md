---
id: DES-0002
title: Tempo da volta em passos e interpolação do cruzamento
feature: race-lap-validation
stage: dspec
status: validated
version: 1.1.0
sources: [FEAT-0001, FEAT-0002, FEAT-0003, FEAT-0010, REQ-FEAT-0001-01, REQ-FEAT-0001-05, REQ-FEAT-0001-08, REQ-FEAT-0002-04, REQ-FEAT-0002-05, REQ-FEAT-0002-07, REQ-FEAT-0002-08, REQ-FEAT-0003-01, REQ-FEAT-0003-02, REQ-FEAT-0003-11, REQ-FEAT-0010-01, REQ-FEAT-0010-05, REQ-FEAT-0010-06]
---

# DES-0002 — Tempo da volta em passos e interpolação do cruzamento

## Realiza

Os `REQ-*` em `sources`: contagem de 3000 ms de simulação ao iniciar uma volta oficial, de reconhecimento ou um
treino, tempo da volta igual a N × `STEP` após N passos do sinal verde, sem penalidade (AC-US-0001-01, -05, -08);
tempo total e tempos de setor em milissegundos inteiros cuja soma é o total, com diferença de 0 ms (AC-US-0002-04,
-05); instante de cruzamento estritamente dentro do passo e igual ao passo quando coincide (AC-US-0002-07, -08);
mesmo tempo em duas execuções, em 30 fps e 60 fps, com e sem pausa e entre navegadores (AC-US-0003-01 a -04, -10;
NFR-0001, NFR-0008). No treino: a volta seguinte começa no mesmo instante, em ms inteiros, em que a anterior
termina; o tempo total de cada volta é o fim menos o início; a soma dos tempos das voltas concluídas é o tempo do
sinal verde ao último cruzamento, com diferença de 0 ms (AC-US-0010-01, -05, -06; RULE-0003). Decisão:
[ADR-0001](../adr/ADR-0001-tempo-inteiro-em-ms-e-interpolacao.md).

## Posicionamento

Módulo `src/lapTiming.ts`, camada **simulação**, funções puras sobre números inteiros e uma fração (existente, sem
mudança de interface nesta rodada). As fronteiras e os derivados de cada volta são montados em `src/lap.ts`
([DES-0001](DES-0001-ciclo-da-volta-e-comandos.md), [DES-0003](DES-0003-cruzamentos-marcadores-setores-e-chegada.md)).
Motivo de ser um módulo próprio: a aritmética do tempo é usada pela máquina de estados e pelos testes e precisa ser
provada isoladamente; `src/physics.ts` não é alterado.

## Interface

`STEP` vale 1/120 s, de modo que um passo dura 25/3 ms, número que não é inteiro em ms. Por isso o tempo da volta
é carregado como contagem de passos e convertido para ms inteiros por funções exatas, sem acumular `dt` em ponto
flutuante (o campo `elapsed` do `State` da física não é usado como cronômetro da volta).

| Símbolo | Tipo e unidade | Definição |
|---|---|---|
| `COUNTDOWN_STEPS` | inteiro, passos | 360 (3000 ms ÷ 25/3 ms) |
| `COUNTDOWN_MS` | inteiro, ms | 3000 |
| `toMs(steps)` | `(inteiro >= 0) => inteiro, ms` | `Math.floor((25 * steps + 1) / 3)`: o inteiro de ms mais próximo de `steps × 25/3`; para `steps` = 360 devolve exatamente 3000 |
| `interpolateMs(k, fraction)` | `(inteiro >= 0, número em (0, 1]) => inteiro, ms` | ver abaixo |
| `isCutExceeded(offSteps, durationMs)` | `(inteiro >= 0, inteiro > 0) => booleano` | `25 * offSteps > 3 * durationMs`, aritmética inteira exata (usada por [DES-0004](DES-0004-corte-e-grama.md)) |

`interpolateMs(k, fraction)`: o deslocamento do passo `k` ao passo `k + 1` cruzou a linha na fração `fraction` do
passo. Se `fraction` for 1, o cruzamento coincide com o passo `k + 1` e o resultado é `toMs(k + 1)`. Caso
contrário, com `lo = toMs(k) + 1` e `hi = toMs(k + 1) - 1` (sempre `lo <= hi`, pois o passo tem mais de 8 ms),
o resultado é `Math.round((k + fraction) * 25 / 3)` limitado ao intervalo `[lo, hi]`. Assim o valor inteiro fica
estritamente entre `toMs(k)` e `toMs(k + 1)`, e portanto estritamente entre `k × STEP` e `(k + 1) × STEP`
(REQ-FEAT-0002-07 e -08). Como `Math.round` e o limitador são monótonos, dois cruzamentos no mesmo passo mantêm a
ordem dos instantes. O instante "no passo" de uma volta que coincide com o passo `k` é `toMs(k)`. Todo instante é
contado do sinal verde, com `k` igual a `stepCount` antes do passo.

**Fronteiras de uma volta** (RULE-0003), todas inteiras em ms e contadas do sinal verde:

| Fronteira | Valor |
|---|---|
| `b0` | `lapStartMs` da volta: 0 na volta oficial, na de reconhecimento e na primeira volta do treino; nas voltas seguintes do treino, o `b4` da volta anterior, o mesmo inteiro, sem nova conversão |
| `b1`, `b2`, `b3` | instante, vindo de `interpolateMs` ou de `toMs`, do registro do limite de setor `i` ([DES-0003](DES-0003-cruzamentos-marcadores-setores-e-chegada.md)), ou sem registro (`null`) |
| `b4` | instante do cruzamento da chegada que encerra a volta |

O tempo do setor `i` é `bi - b(i-1)` quando as duas fronteiras estão registradas, e não existe quando falta uma
delas; o tempo total é `b4 - b0`. Numa volta com as quatro fronteiras registradas, a soma dos quatro setores é igual
ao total com diferença de 0 ms por construção (soma telescópica, REQ-FEAT-0002-05). Numa volta iniciada no sinal
verde, `b0` = 0 e o tempo total é `b4`, estritamente entre `toMs(k)` e `toMs(k + 1)` quando o cruzamento é interno
ao passo `k` (REQ-FEAT-0002-07).

**Voltas seguidas do treino.** Cada instante de cruzamento é convertido uma única vez: o inteiro `b4` que encerra a
volta n é, sem nova conversão, o `lapStartMs` da volta n + 1, com diferença de 0 ms (REQ-FEAT-0010-01). O tempo
total da volta n é `b4(n) - lapStartMs(n)` (REQ-FEAT-0010-05). Como a primeira volta começa em 0 e cada volta
seguinte começa exatamente onde a anterior termina, a soma dos tempos totais das voltas concluídas é `b4` da
última, que é o tempo de simulação do sinal verde a esse cruzamento, com diferença de 0 ms (REQ-FEAT-0010-06;
INV-10 de [DM-0002](../data/DM-0002-estado-da-volta-em-memoria.md)). Toda a conta é de inteiros.

Derivados expostos por `getLapState`: `countdownRemainingMs = 3000 - toMs(countdownSteps)` (de 3000 a 0);
`elapsedMs` = 0 durante a contagem e `toMs(stepCount) - lapStartMs` em seguida, que é N × `STEP` em ms inteiros
após N passos de uma volta iniciada no sinal verde e o tempo de simulação desde o início da volta nas voltas
seguintes do treino. O valor nunca é negativo: o cruzamento que deu `lapStartMs` está no passo que levou
`stepCount` ao valor corrente, e `interpolateMs(k, f)` nunca passa de `toMs(k + 1)`. Depois de uma volta oficial ou de
reconhecimento válida `elapsedMs` passa a valer `lapMs`, para que o cronômetro final e o resultado coincidam.

## Colaboradores

Chamado só por `src/lap.ts`, por `src/lapMessages.ts` (que formata o inteiro de ms) e pelos testes. Importa
`STEP` de `src/physics.ts` apenas para que o teste afirme `1 / STEP === 120`; nenhuma outra dependência.

## Estado e concorrência

Sem estado: funções puras. Os instantes de fronteira são produzidos uma única vez por volta, no `stepCount` em
que a linha é cruzada (DES-0003 decide quando); cruzar de novo uma linha já contada não os recalcula. No treino, as
fronteiras são próprias de cada volta e recomeçam a cada volta; `stepCount`, do qual todo instante é contado, não
recomeça.

## Comportamento em falha

Entradas fora do domínio (`steps` negativo ou não inteiro, `fraction` fora de (0, 1]) não ocorrem por
construção: `steps` é contador inteiro e a fração vem de `crossLine`. Defesa: `toMs` e `interpolateMs` usam
`Math.max(0, Math.trunc(...))` nos argumentos inteiros, sem lançar, e `fraction` é limitada a (0, 1] pela própria
`crossLine`. Nada é registrado.

## Determinismo (D-DS-07)

Passo fixo `STEP`, nenhum relógio, nenhum sorteio. As operações de ponto flutuante do caminho do tempo são só
soma, subtração, multiplicação, divisão e `Math.round`/`Math.floor`, definidas de modo idêntico em todo motor de
JavaScript; a conversão final é inteira, e as diferenças entre fronteiras são de inteiros. Provas em
`tests/lap-timing.test.ts`: `toMs(360) === 3000`; `toMs(k + 1) - toMs(k)` vale 8 ou 9; para `k` de 0 a 2000 e frações
de 0,001 a 1 em passos de 0,001, `toMs(k) < interpolateMs(k, f) <= toMs(k + 1)` e estritamente menor quando `f < 1`;
soma dos setores igual ao total em voltas sintéticas; repetir é igual. Em `tests/lap-training.test.ts`: em um treino de
três ou mais voltas, `lapStartMs` de cada volta igual a `lapStartMs + trainingLapMs` da anterior e a soma dos
`trainingLapMs` igual ao `lapStartMs` da volta em andamento. Reserva honesta sobre NFR-0008: as funções de `Math`
usadas pela física (`sin`, `cos`, `tanh`, `exp`, `pow`, `atan2`, `hypot`) podem diferir na última casa entre motores. O
arredondamento a ms absorve diferenças desse tamanho, salvo num instante que caia a menos de cerca de 1e-12 ms de
um meio milissegundo; a evidência é o teste registrado nos quatro navegadores (test-strategy), e qualquer
diferença registrada é defeito, conforme REQ-FEAT-0003-11.

## Feature flag

Nenhuma: FEAT-0002, FEAT-0003 e FEAT-0010 não têm chave, e a unidade (ms inteiros) é fixa (`DEC-03`).

## Pontos em aberto

Nenhum.
