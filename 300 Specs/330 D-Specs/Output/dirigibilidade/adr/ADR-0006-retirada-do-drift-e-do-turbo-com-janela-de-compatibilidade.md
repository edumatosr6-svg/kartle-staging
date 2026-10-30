---
id: ADR-0006
title: Drift e turbo fora do passo agora; State.maneuvers e src/maneuvers.ts numa janela de compatibilidade até os leitores de outras features saírem
feature: dirigibilidade
stage: dspec
status: validated
version: 1.0.0
sources: [RULE-0001, FEAT-0003, FEAT-0006, REQ-FEAT-0003-10, REQ-FEAT-0003-13, REQ-FEAT-0003-14, REQ-FEAT-0003-16, REQ-FEAT-0006-01, REQ-FEAT-0006-03, REQ-FEAT-0006-07]
---

# ADR-0006 — Drift e turbo fora do passo agora; State.maneuvers e src/maneuvers.ts numa janela de compatibilidade até os leitores de outras features saírem

## Contexto

O F-Spec 4.0.1 retira a manobra de drift e o turbo de `requirements/11` (`DOMAIN/DEC-15`, aprovado pelo dono do
produto): o comando de drift não muda o estado da simulação, nenhum estado acumula carga, impulso, combo ou
pontuação, a velocidade máxima é a mesma em qualquer situação (RULE-0001, "Sem drift e sem turbo";
REQ-FEAT-0003-13, -16), e o HUD, o resultado e o texto compartilhado deixam de mostrá-los, só como remoção de
exibição (REQ-FEAT-0003-14, -15; REQ-FEAT-0006-01). O campo `drift` de `Input` fica, com o mesmo nome e faixa
(NFR-0006). O conjunto de `race-lap-validation` tem de continuar 100 % aprovado (REQ-FEAT-0006-07).

Na árvore corrente a manobra vive em `src/maneuvers.ts` (estado `Maneuvers`, `advanceManeuvers`,
`cancelManeuver`, `chargeTier`), avançada por `step` (`src/physics.ts:395-399`) e lida pelos ramos `drifting` e
`boosting` de `integrate`. O estado `state.maneuvers` tem leitores fora desta feature: em `src/main.ts`, o jato do
escapamento (`:555`), a condição das marcas de pneu (`:559`) e a entrada `turboActive` da câmera (`:586`), código
de `modelo-kart-01`, cujo D-Spec revalidado já projeta a retirada do jato e da entrada de turbo e atribui a
condição das marcas a esta feature; e, pelo nome do arquivo, `tests/race-lap-validation-layering.test.ts:9` e
`tests/pista-kart-park-layering.test.ts:18`, que leem `src/maneuvers.ts` para afirmar a pureza da simulação, e
`tests/race-lap-validation-frozen.test.ts` (CHK-TEST-0014-05), que afirma a linha 3 de `src/physics.ts`, logo
abaixo do `import` de `./maneuvers` da linha 2. A ordem de entrega entre esta feature e `modelo-kart-01` não é
fixa (ADR-0003 daquela feature).

## Decisão

1. **O passo deixa de avançar a manobra agora**: saem de `src/physics.ts` a chamada a `advanceManeuvers`, o
   cálculo de `onRoad`, os três `cancelManeuver` e os ramos `drifting` e `boosting` de `integrate`
   ([DES-0001](../core/DES-0001-acerto-arcade-assistido-v6-e-assistencias.md)). Para todo `Input` sem o comando de
   drift o passo dá o mesmo estado de antes, bit a bit; com o comando, o mesmo estado que sem ele.
2. **Janela de compatibilidade**: `State.maneuvers` continua no tipo `State`, com o valor `initialManeuvers()`
   em todo estado, carregado sem mudança por `step`; `src/maneuvers.ts` continua existindo, sem alteração, e
   `src/physics.ts` importa dele só `initialManeuvers` e o tipo `Maneuvers`, na linha 2. Nenhum estado acumula
   nada: o campo é uma constante. Os leitores de outras features compilam e passam a ler sempre o valor
   inicial — sem jato, sem campo de visão de turbo e sem marcas de pneu, porque a única situação em que as marcas
   nasciam era o drift. Nenhuma condição nova de exibição é criada (`SEED/RE-01`).
3. **O que esta feature retira já** na aplicação: o HUD do drift, as mensagens de prêmio, o `import` de
   `./maneuvers` em `src/main.ts` e as regras de estilo só deles
   ([DES-0005](../web/DES-0005-hud-velocidade-e-aderencia.md)).
4. **Retirada final**, projetada aqui e executada pela rodada de código desta feature que encontrar as duas
   condições satisfeitas — `src/main.ts` sem nenhuma leitura de `state.maneuvers` (a retirada do jato e da
   entrada de turbo é de `modelo-kart-01`; a condição das marcas, que perde a sua única situação, sai junto
   nessa rodada, sem condição substituta) e nenhum teste de outra feature nomeando `src/maneuvers.ts`
   (`race-lap-validation` e `pista-kart-park`, por feedback): saem `State.maneuvers`, o `import` da linha 2 de
   `src/physics.ts` (substituído, na mesma linha, pelo `import` de `./trackGeometry`, hoje na linha 4, para que a
   linha 3 não se mova), `src/maneuvers.ts` e `tests/maneuvers.test.ts`.
5. `tests/maneuvers.test.ts` perde agora só a verificação que exige o drift através do passo ("player-induced
   drift generates real lateral slip and a useful exit boost", `:68-80`), cuja exigência o dono do produto
   retirou (`DOMAIN/DEC-15`); as verificações unitárias de `advanceManeuvers` e `cancelManeuver`, a de que o
   Realista ignora o comando e a de determinismo continuam verdes durante a janela e saem na retirada final.

## Alternativas consideradas

- **Apagar `src/maneuvers.ts` e `State.maneuvers` nesta entrega.** `src/main.ts` deixaria de compilar enquanto
  as leituras de `modelo-kart-01` existirem, e `tests/race-lap-validation-layering.test.ts` falharia ao ler o
  arquivo ausente — REQ-FEAT-0006-07 deixaria de ser atendido por um nome de arquivo numa lista de outra
  feature. Recusada; o caminho é a janela e o feedback.
- **Esta feature editar as leituras de `modelo-kart-01` em `src/main.ts`** (jato, câmera, marcas). As
  verificações de contrato daquela feature afirmam essas linhas pelo texto, e a retirada já está projetada no
  D-Spec dela; editá-las aqui seria escrever na superfície de outra feature (conventions §14). Recusada.
- **Manter a manobra avançando e só esconder a exibição.** O comando de drift continuaria mudando o estado e a
  velocidade passaria da estabilizada com o impulso, contra REQ-FEAT-0003-13 e -16. Recusada.
- **Retirar o campo `drift` de `Input`.** NFR-0006 e CHK-TEST-0014-02 mantêm a linha de `Input`. Recusada.
- **Uma condição nova para as marcas de pneu (por exemplo, derrapagem lateral acima de um limite).** Seria
  regra nova na renderização, que o F-Spec não admite (`SEED/RE-01`). Recusada; proposta ao autor no changelog.

## Consequências

- Durante a janela, `src/maneuvers.ts` é código que o passo não chama; a sua retirada tem gatilho definido e
  não depende de decisão nova.
- Com a entrega, o jogo deixa de desenhar marcas de pneu; o requisito de ancoragem das marcas de
  `modelo-kart-01` fica sem situação em que valer até o autor decidir outra (`01-architecture.md`, Efeito sobre
  outras features).
- A validação deste conjunto encaminha a `race-lap-validation` e a `pista-kart-park` o pedido de deixarem de
  nomear `src/maneuvers.ts` nos seus testes de camada, e a `modelo-kart-01` o efeito sobre as marcas e a linha de
  base da simulação.

## Estado

Aceita nesta rodada.
