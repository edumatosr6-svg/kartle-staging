---
id: ADR-0005
title: Pista de teste aberta como gerador de Environment em src/physics.ts; velocidade mantida por acelerador regulado; classificador de passo retirado
feature: dirigibilidade
stage: dspec
status: validated
version: 2.0.0
sources: [RULE-0001, RULE-0002, FLOW-0002, FEAT-0001, FEAT-0002, FEAT-0003, FEAT-0004, REQ-FEAT-0001-01, REQ-FEAT-0001-02, REQ-FEAT-0001-09, REQ-FEAT-0002-11, REQ-FEAT-0002-12, REQ-FEAT-0002-13, REQ-FEAT-0002-17, REQ-FEAT-0003-01, REQ-FEAT-0003-04, REQ-FEAT-0003-10, REQ-FEAT-0004-03, REQ-FEAT-0006-02, NFR-0003, NFR-0005, NFR-0008]
---

# ADR-0005 — Pista de teste aberta como gerador de Environment em src/physics.ts; velocidade mantida por acelerador regulado; classificador de passo retirado

## Contexto

O F-Spec 4.0.1 (seed `revision: 5`, `DOMAIN/DEC-15`) redefine a pista de teste (`benchEnvironment` `TEST_PAD`)
como **pista de teste aberta**: asfalto sem faixa e sem paredes, em que cada ensaio declara a área de asfalto
que contém a sua trajetória — um disco centrado no ponto de partida, de raio `testAreaRadiusM` —; dentro dela
a telemetria reporta `ASPHALT`, fora `GRASS`, e um passo fora invalida a medição (`TEST_AREA_EXCEEDED`). A
faixa reta e o anel de 18 m (`testPadLane`, `testPadArc`, `src/physics.ts:189-200`) foram feitos para a
revisão 3 e não servem a nenhum ensaio desta. A velocidade continua mantida em 50 km/h pelo acelerador no
ensaio de resposta. RULE-0001 4.0.0 troca as classes de passo (`NORMAL`, `FORCING`, `DRIFT`, `RECOVERY`) por
contextos de observação: a condução normal é a volta do piloto de teste inteira, e a recuperação é a do ensaio
na pista de teste aberta. Em `BINARY` o acelerador só assume 0 ou 1, e 1 com esterço cheio acima de 50 km/h é
a condição de forçar.

## Decisão

1. **Pista de teste aberta em `src/physics.ts`**, como um gerador puro de `Environment` ao lado de `CIRCUIT`,
   `TEST_PAD` e `trackEnvironment`: `testPadArea(testAreaRadiusM)` — disco de asfalto centrado na origem,
   `grass` fora dele, sem paredes. Todo ensaio em `TEST_PAD` parte da origem, em linha reta no sentido +z, e
   para no primeiro passo fora do disco. `testPadLane` e `testPadArc` são retirados com os ensaios que os
   usavam; a constante `TEST_PAD` (asfalto sem limite) fica para os usos existentes. A pista de teste não é
   dado de pista, não passa por `src/lap.ts` e não altera a validação de volta (NFR-0008).
2. **Velocidade mantida por acelerador regulado por passo** (`THROTTLE_REGULATED`): 1 se a velocidade do passo
   anterior está abaixo de `targetSpeedMps`, senão 0 — binário por construção, nunca a condição de forçar,
   função determinística da telemetria anterior. `speedHoldBandMps` 0,5; fora da faixa, `SPEED_NOT_HELD`.
   Regime: média de `|yawRateRadPerS|` nos últimos `settleWindowMs` 200 de uma fase mantida de `holdMs` 600.
3. **Classificador de passo retirado** (`classifyHandlingSteps`, `StepClass`, `RECOVERY_MAX_STEPS`,
   `src/physics.ts:457-481`). A regra de pilotagem continua no passo (condição de forçar, estado de
   aderência, assistências que devolvem a traseira — REQ-FEAT-0003-10); o que saiu é a classificação de
   passos para excluir a recuperação de um agregado, que não existe mais. O passo de soltura de RULE-0001 é o
   passo em que o ensaio de recuperação leva o esterço a 0, e a biblioteca o conhece por construção.
4. Grama, parede, volta do piloto de teste e custo por passo continuam na pista sintética (`CIRCUIT`), com a
   entrada na grama e a trajetória até a parede inalteradas.

## Alternativas consideradas

- **Disco centrado num ponto qualquer, passado ao gerador.** Todo ensaio parte da origem; um centro
  parametrizado seria superfície sem uso. Recusada.
- **Área declarada só na biblioteca, sem gerador em `src/physics.ts`.** `Environment` e os demais ambientes
  vivem em `src/physics.ts`, e o F-Spec descreve a pista de teste como ambiente da simulação. Recusada.
- **Manter `testPadLane`/`testPadArc` sem uso.** Código sem requisito que o realize. Recusada.
- **Asfalto sem limite (`TEST_PAD`) para os ensaios, verificando a área só no registro.** O F-Spec quer que a
  telemetria reporte `GRASS` fora da área (API-0001); com asfalto sem limite ela nunca reportaria. Recusada.
- **Acelerador constante parcial ou constante 1 para manter a velocidade; velocidade imposta por fora.**
  Recusadas como antes: falha a paridade `BINARY`, liga a condição de forçar, ou cria superfície só de teste.
- **Manter o classificador de passo sem a classe `DRIFT`.** Sem consumidor: `NORMAL_DRIVING` passou à volta
  inteira e a recuperação é delimitada pelo próprio ensaio. Recusada.

## Consequências

- `src/physics.ts` troca dois geradores por um e perde o classificador; nenhum deles era chamado pelo jogo.
- Fora da área declarada a física aplica `grassFriction` às rodas fora do disco, mas nenhum ensaio mede
  depois desse passo: a execução para nele.
- As linhas de base dos ensaios da pista de teste são medidas de novo na pista de teste aberta
  ([ADR-0003](ADR-0003-linha-de-base-legivel-por-maquina-em-docs-physics.md)).
- `tests/dirigibilidade-classify.test.ts` perde o objeto; a sua retirada segue a dos requisitos de classe de
  passo (REQ-FEAT-0003-03 retirado, REQ-FEAT-0003-12 modificado, F-Spec 4.0.0, aprovados pelo dono do produto
  em `DOMAIN/DEC-15`) e é registrada na tabela de migração do changelog.

## Estado

Aceita nesta rodada.
