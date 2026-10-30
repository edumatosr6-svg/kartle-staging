---
id: RULE-0003
title: Cronometragem, interpolação e formato do tempo
feature: race-lap-validation
stage: fspec
status: validated
version: 1.1.0
sources: [US-0001, US-0002, US-0003, US-0007, US-0010, AC-US-0001-05, AC-US-0002-04, AC-US-0002-05, AC-US-0002-06, AC-US-0002-07, AC-US-0002-08, AC-US-0002-10, AC-US-0003-03, AC-US-0007-06, AC-US-0010-01, AC-US-0010-05, AC-US-0010-06, AC-US-0010-23, AC-US-0010-27, NFR-0001, NFR-0002, NFR-0008]
---

# RULE-0003 — Cronometragem, interpolação e formato do tempo

Como o tempo da volta nasce da simulação, como o instante de um cruzamento é obtido dentro de um passo e
como o tempo é exibido. Fontes: `DOMAIN/DEC-03`, `DOMAIN/DEC-05`, `DOMAIN/DEC-12`, `DOMAIN/DEC-13`, I8.

## Linha do tempo

Todo instante desta regra é medido em tempo de simulação contado do sinal verde.

| Instante | Valor | Fonte |
|---|---|---|
| Início da contagem | `countdownRemainingMs` = 3000 | AC-US-0001-01; `DOMAIN/DEC-05` |
| Sinal verde | Fim da contagem; instante 0; início da volta oficial, da de reconhecimento e da primeira volta do treino | `DOMAIN/DEC-05` |
| Passo j do sinal verde | Tempo de simulação = j × `STEP` | AC-US-0001-05 |
| Cruzamento da linha de largada | Não inicia nem altera o cronômetro | `DOMAIN/DEC-05` |
| Início de uma volta seguinte do treino | O instante de cruzamento da chegada que encerrou a volta anterior, `lapStartMs` ([RULE-0002](RULE-0002-estados-da-volta.md)), com diferença de 0 ms | AC-US-0010-01 |
| Fim do setor i | Instante de cruzamento do limite de setor i; o setor 4 termina no cruzamento da chegada | AC-US-0002-10 |
| Fim da volta | Instante de cruzamento da chegada no sentido da pista: na volta válida e, no treino, em toda volta encerrada na chegada | AC-US-0002-01; AC-US-0010-05 |

O tempo da volta em andamento é o tempo de simulação decorrido desde o início dessa volta: N × `STEP` após N
passos de uma volta iniciada no sinal verde; o instante de simulação menos `lapStartMs` numa volta seguinte do
treino. Um reposicionamento não acrescenta penalidade (AC-US-0007-06).

O tempo é função da sequência de passos da simulação e nunca do relógio de parede, da taxa de quadros nem de
uma pausa (I8; AC-US-0003-03, AC-US-0003-10). Pausa não acrescenta nem retira passos (RULE-0002).

## Instante de cruzamento

| Caso | Instante | Fonte |
|---|---|---|
| A linha é cruzada entre o passo k e o passo k + 1 e não coincide com nenhum | O instante é interpolado dentro do passo e é estritamente maior que k × `STEP` e estritamente menor que (k + 1) × `STEP` | AC-US-0002-07, AC-US-0002-08 |
| O cruzamento coincide exatamente com um passo | O instante é o desse passo, k × `STEP` | US-0002, caso anormal |
| Mais de uma linha cruzada no mesmo passo | Cada instante é interpolado separadamente; a ordem das linhas é a de [RULE-0001](RULE-0001-validade-da-volta.md) e dos setores | AC-US-0002-10 |
| A chegada cruzada no treino encerra uma volta e inicia a seguinte | O mesmo instante, em ms inteiros, é o fim de uma e o início da outra | AC-US-0010-01 |

O método de interpolação e a conversão do instante para milissegundos inteiros são decisão do D-Spec. A
restrição que o F-Spec impõe a esse método: o resultado em ms inteiros fica estritamente dentro do intervalo
do passo quando o cruzamento é interno ao passo, é o mesmo em todo runtime nomeado (NFR-0008, diferença de
0 ms) e é o mesmo para as mesmas entradas (NFR-0001). Cada instante é convertido uma única vez, e o valor
convertido é o que serve de fim de uma volta e de início da seguinte.

## Fronteiras, tempos de setor e soma

| Grandeza | Definição | Fonte |
|---|---|---|
| Fronteira `b0` | Início da volta: 0 (sinal verde) ou `lapStartMs` (volta seguinte do treino) | `DOMAIN/DEC-05`; AC-US-0010-01 |
| Fronteiras `b1`, `b2`, `b3` | Instante, em ms inteiros, do primeiro cruzamento no sentido da pista do limite de setor i que ocorre depois da última fronteira anterior registrada na mesma volta; fica sem registro se esse cruzamento não ocorre | AC-US-0002-08, AC-US-0002-10 |
| Fronteira `b4` | Instante de cruzamento da chegada que encerra a volta, em ms inteiros | AC-US-0002-07 |
| Tempo do setor i | `bi` menos `b(i-1)`, em ms inteiros, quando as duas fronteiras estão registradas; sem tempo quando uma delas falta | AC-US-0002-10; AC-US-0010-23; `DOMAIN/DEC-13` |
| Tempo total | `b4` menos `b0`, em ms inteiros | AC-US-0002-04; AC-US-0010-05 |

Numa volta válida todas as fronteiras são registradas em ordem, porque os marcadores obrigam a travessia dos
três limites e da chegada ([API-0003](../api/API-0003-dado-de-pista.md)); como cada tempo de setor é a
diferença entre fronteiras consecutivas, a soma dos quatro tempos de setor é igual ao tempo total, com
diferença de 0 ms (AC-US-0002-05). O tempo total e os tempos de setor são expressos em milissegundos inteiros
no resultado (AC-US-0002-04).

Numa volta de treino inválida encerrada na chegada, um limite de setor pode ficar sem cruzamento (por
exemplo, num corte que o salta). Os dois setores vizinhos desse limite ficam sem tempo e são exibidos como "—";
os demais setores com as duas fronteiras registradas têm tempo; o tempo total existe sempre (AC-US-0010-02,
AC-US-0010-23; `DOMAIN/DEC-13`). Exemplo: sem cruzamento do limite 2, os setores 2 e 3 aparecem como "—" e os
setores 1 e 4 têm tempo.

Numa pista cujo dado não declara setores, não há fronteiras `b1` a `b3`, e o resultado não tem tempo de setor:
só o tempo total e a validade (AC-US-0010-27; `DOMAIN/DEC-13`).

## Voltas seguidas do treino

| Grandeza | Definição | Fonte |
|---|---|---|
| Tempo total da volta n do treino | `b4` da volta n menos `lapStartMs` da volta n | AC-US-0010-05 |
| `lapStartMs` da volta n + 1 | Igual a `b4` da volta n | AC-US-0010-01 |
| Soma dos tempos totais das voltas concluídas | Igual ao `b4` da última delas, isto é, ao tempo de simulação do sinal verde ao cruzamento que a encerrou, com diferença de 0 ms | AC-US-0010-06 |

A soma vale porque cada volta começa exatamente onde a anterior termina e a primeira começa no sinal verde.

## Formato de exibição

| Valor em ms | Exibição `m:ss.mmm` | Observação |
|---|---|---|
| 62345 | `1:02.345` | Exemplo de `DOMAIN/DEC-03` |
| 0 | `0:00.000` | Cronômetro na contagem |
| 59999 | `0:59.999` | Segundos de 00 a 59 |
| 3723004 | `62:03.004` | Minutos sem limite superior; milissegundos sempre com 3 dígitos |
| sem tempo | `—` | Setor sem tempo numa volta de treino (`DOMAIN/DEC-13`) |

Minutos sem zeros à esquerda, segundos com 2 dígitos, milissegundos com 3 dígitos. A exibição converte o
inteiro em ms sem arredondar. A igualdade entre execuções é verificada no resultado em ms, não no texto
(US-0003, caso anormal).

## Idempotência e ordem

Os instantes de fronteira são produzidos uma única vez por volta, cada um no `stepCount` em que a linha é
cruzada; cruzar de novo uma linha já registrada na mesma volta não altera nenhum instante (I7). No treino,
as fronteiras de cada volta são próprias dela e recomeçam a cada volta.
