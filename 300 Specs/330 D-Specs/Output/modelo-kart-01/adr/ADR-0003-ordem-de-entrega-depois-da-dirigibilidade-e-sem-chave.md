---
id: ADR-0003
title: O código desta feature entra depois do da dirigibilidade, que também altera src/main.ts; sem chave mestra, porque o F-Spec proíbe configuração
feature: modelo-kart-01
stage: dspec
status: validated
version: 1.1.0
sources: [FEAT-0001, FEAT-0003, FEAT-0005, FEAT-0006, REQ-FEAT-0001-01, REQ-FEAT-0003-16, REQ-FEAT-0003-17, REQ-FEAT-0005-09, REQ-FEAT-0005-10, REQ-FEAT-0006-06, REQ-FEAT-0006-07, REQ-FEAT-0006-08, NFR-0006]
---

# ADR-0003 — Ordem de entrega depois da `dirigibilidade`; sem chave mestra

## Contexto

Três features alteram `src/main.ts`: a `dirigibilidade` (HUD por `getHandlingTelemetry`, registro de volta,
compartilhar — já no commit `0068a57`, "checkpoint, aguarda D-Spec Modo C", sem relatório de validação de
código), a `pista-kart-park` (desenho da pista real na tela de corrida; D-Spec validado, código não escrito)
e esta. A `dirigibilidade` ainda pode mudar os valores do acerto `ARCADE_ASSISTIDO_V5` pelos seus ensaios,
o que muda o resultado de qualquer sequência de `Input` — a linha de base desta feature
([DM-0001](../data/DM-0001-linha-de-base-da-simulacao-e-registro-em-tela.md)) compara exatamente isso. O
dono do produto decidiu: o código desta feature entra depois do da `dirigibilidade`. O F-Spec proíbe
chave para voltar ao kart provisório ou à câmera alta e qualquer escolha de kart, cor, adesivo, câmera ou
campo de visão (FEAT-0001, FEAT-0003, Configuração); a diretriz I4 pede padrão neutro para toda
configuração nova.

## Decisão

1. A etapa de código desta feature começa depois de a `dirigibilidade` ter o seu código validado
   (`SUCCESS` do validador de código sobre a árvore que inclui as mudanças de `src/main.ts` daquela
   feature). Este conjunto foi escrito contra `src/main.ts` do commit `0068a57`, que já carrega essas
   mudanças, e cita cada ponto por trecho e símbolo além da linha; se a rodada final da `dirigibilidade`
   mover linhas, a etapa de código reencontra os pontos pelo símbolo sem que o projeto mude.
2. A linha de base da simulação é gravada **depois** disso e **antes** da primeira mudança de código desta
   feature, com o `setupVersion` então publicado ([ADR-0004](ADR-0004-linha-de-base-da-simulacao-como-fixture-versionado.md)).
3. Em relação à `pista-kart-park` não se impõe ordem: o projeto é independente da pista (os limites da
   visão geral vêm de uma função sobre qualquer lista de pontos; a sombra acompanha o kart; a pose de corrida
   é relativa ao kart). A feature que entrar por último reencontra `src/main.ts` como estiver; nenhum
   símbolo desta feature colide com os daquela (`kart01*`, `kartPose`, `gameCamera`, `kartRoot`, `spin`,
   `cameraView`, `trackBounds`).
4. **Revisão da rodada 5 (F-Spec 1.3: drift e turbo fora do jogo, treino com voltas seguidas).** O F-Spec
   deixa à etapa de design a ordem de entrega entre esta feature e a `dirigibilidade` (`01-overview.md` do
   F-Spec, Relação com outras features). As mudanças desta revisão **não dependem de ordem** e podem entrar
   antes ou depois do código da `dirigibilidade` que retira o drift e o turbo: elas só **removem** o que esta
   feature acrescentou e que lê o estado de turbo — a parcela de turbo da câmera e a sua entrada
   ([DES-0003](../web/DES-0003-camera-de-jogo.md), [DES-0004](../web/DES-0004-integracao-da-cena-em-main-ts.md)),
   o jato de escapamento e o seu nó de ancoragem ([DES-0005](../web/DES-0005-efeitos-presos-ao-kart.md),
   [DES-0001](../web/DES-0001-modelo-kart-01-montagem-agrupamento-e-decalques.md)). Entrando antes, a retirada
   do turbo pela `dirigibilidade` não encontra nenhum leitor desta feature. A condição de situação das marcas
   de pneu, que hoje lê `maneuvers.drifting` (`src/main.ts:559`), é anterior a esta feature e é a etapa de
   código da `dirigibilidade` que a troca ao retirar o drift; esta feature só ancora as marcas. Quanto à
   `race-lap-validation` (revisão 3, US-10, voltas seguidas no treino), a câmera não depende de ordem (o modo
   não lê o tipo da volta); só a parte "kart em movimento" da verificação de integração de AC-US-0003-14 exige
   o código daquela feature, e até lá é divergência registrada em `98-divergences.md`, nunca um requisito
   afrouxado.
5. **Sem chave mestra.** O padrão neutro de I4 vale assim: nada da simulação muda (`RENDER_NEUTRAL`,
   `SIM_CONTRACT`, `DETERMINISM`), nenhum dado é persistido, e a mudança é só visual — o próprio F-Spec a
   declara segura e sem chave. A reversão é a do repositório.

## Alternativas consideradas

- **Entrar antes da `dirigibilidade`.** Contraria a decisão do dono do produto; produziria duas edições
  concorrentes de `src/main.ts` e uma linha de base invalidada pelo reacerto dos presets. Recusada.
- **Chave mestra desligada por padrão.** Proibida pelo F-Spec e deixaria a feature invisível na entrega.
  Recusada.
- **Impor ordem também à `pista-kart-park`.** Nenhum requisito ou decisão o pede; o projeto já é
  independente da pista. Recusada.

## Consequências

- O relatório de validação de código da `dirigibilidade` é precondição de entrada da etapa de código desta
  feature; o `pipeline-progress` mostra as duas.
- Se a `dirigibilidade` publicar outro `setupVersion` depois de a linha de base ser gravada, `npm test`
  reporta `BASELINE_MISSING` até a regravação — comportamento desejado, nunca comparação contra outro acerto.
  Isso vale também para o acerto que retira o drift e o turbo: a linha de base é regravada com o `setupVersion`
  que ele publicar ([ADR-0004](ADR-0004-linha-de-base-da-simulacao-como-fixture-versionado.md)).
- A rodada de código desta revisão não espera a `dirigibilidade` (decisão 4); a primeira rodada de código
  desta feature seguiu a decisão 1.

## Estado

Aceita na rodada 1; decisão 4 acrescentada na rodada 5 (F-Spec 1.3).
