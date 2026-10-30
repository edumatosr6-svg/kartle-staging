---
id: ADR-0006
title: Treino como sequência de voltas numa única sessão
feature: race-lap-validation
stage: dspec
status: validated
version: 1.0.0
sources: [FEAT-0010, REQ-FEAT-0010-01, REQ-FEAT-0010-04, REQ-FEAT-0010-06, REQ-FEAT-0010-14, REQ-FEAT-0010-17, REQ-FEAT-0010-20]
---

# ADR-0006 — Treino como sequência de voltas numa única sessão

## Contexto

O seed `revision: 3` mudou o treino (`SEED/US-10`, `DOMAIN/DEC-12`): uma única contagem, voltas seguidas sem parar o
jogo, a volta seguinte começando no instante de cruzamento da chegada que encerrou a anterior, o corte que invalida
sem encerrar, a melhor volta válida visível e o fim só pela ação de encerrar o treino (FEAT-0010, RULE-0002). Até esta
rodada, toda volta — inclusive a de treino — era uma `LapSession` que terminava em `ENDED` na chegada ou na
invalidação, com exatamente um resultado (`src/lap.ts:255`, `:269`). A escolha de onde a sequência vive mexe no
modelo do resultado que outras features leem (`dirigibilidade` registra cada resultado; `pista-kart-park` inicia o
treino e testa voltas na Kart Park), por isso é registrada aqui.

## Decisão

O treino é **uma** `LapSession` ([DM-0002](../data/DM-0002-estado-da-volta-em-memoria.md)) criada por um único
`startLap` com `TRAINING` e encerrada só por `endTraining`:

- a fase é a do treino inteiro: uma contagem no começo, `RUNNING` de volta em volta, `PAUSED` na pausa e `ENDED`
  só por `endTraining`;
- a sessão guarda a lista `results`, um item por volta concluída na chegada, e os contadores `lapSequenceCount` e
  `lapStartMs` da volta em andamento; `stepCount` e `offTrackSteps` não recomeçam;
- o cruzamento da chegada no sentido da pista fecha a volta e abre a seguinte no mesmo passo, com o mesmo inteiro
  de ms como fim de uma e início da outra ([DES-0003](../core/DES-0003-cruzamentos-marcadores-setores-e-chegada.md),
  `closeTrainingLap`);
- a melhor volta válida é derivada de `results` a cada leitura, e não armazenada;
- volta oficial e de reconhecimento continuam como antes: uma volta por sessão, `ENDED` na chegada ou na invalidação,
  0 ou 1 resultado.

## Alternativas consideradas

| Alternativa | Por que não |
|---|---|
| Uma `LapSession` nova por volta do treino, criada pela aplicação ao ver `ENDED` | a aplicação decidiria quando uma volta começa (I2, D-FS-05); a nova sessão passaria pela contagem e recomeçaria `stepCount` e `offTrackSteps`, contra REQ-FEAT-0010-04 e RULE-0004; e o início da volta seguinte viraria uma segunda conversão do instante, contra REQ-FEAT-0010-01 |
| Uma `LapSession` nova por volta, criada pela simulação dentro de `stepLap` | o estado da sessão anterior (resultados, melhor volta) teria de ser copiado para a nova, que seria a mesma sessão com outro nome; os comandos `pauseLap`, `endTraining` e `getLapResult` teriam de conhecer a cadeia |
| Guardar `bestValidLapMs` como campo da sessão | estado duplicado de `results`, com o risco de os dois divergirem; derivar dá o mesmo valor sempre (FEAT-0010, "Estado") |
| Manter o campo único `result` e acrescentar uma lista à parte | dois lugares para o mesmo fato; `getLapResult` lê o último item da lista |

## Consequências

- `getLapResult` devolve o último resultado mesmo com o treino em `RUNNING`; `listLapResults` devolve todos. Em volta
  oficial e de reconhecimento os dois só têm valor depois de `ENDED`, como antes.
- A aplicação deixa de usar a chegada a `ENDED` como sinal de "volta terminou" e passa a usar o crescimento de
  `listLapResults` ([DES-0007](../web/DES-0007-integracao-da-aplicacao.md)); o gancho de registro de `dirigibilidade`
  passa a rodar uma vez por resultado.
- Código e testes que esperam que uma volta `TRAINING` chegue a `ENDED` na chegada — o piloto de testes da Kart Park
  (`tests/helpers/kartParkPilot.ts`) e verificações de `pista-kart-park` que cruzam a chegada de novo depois do fim —
  passam a ver a volta seguinte começar; são da feature `pista-kart-park` e registrados no changelog desta rodada para
  a sua avaliação.
- Reverter a decisão é local a `src/lap.ts` e `src/main.ts`; nenhum dado é persistido e nenhum contrato publicado é
  renomeado.

## Status

Aceita neste conjunto (rodada de 2026-10-30).
