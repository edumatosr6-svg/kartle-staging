---
id: ADR-0003
title: O código desta feature entra depois do da dirigibilidade, que também altera src/main.ts; sem chave mestra, porque o F-Spec proíbe configuração
feature: modelo-kart-01
stage: dspec
status: validated
version: 1.3.0
sources: [FEAT-0001, FEAT-0003, FEAT-0005, FEAT-0006, REQ-FEAT-0001-01, REQ-FEAT-0003-16, REQ-FEAT-0003-17, REQ-FEAT-0005-01, REQ-FEAT-0005-05, REQ-FEAT-0005-09, REQ-FEAT-0005-10, REQ-FEAT-0005-11, REQ-FEAT-0005-12, REQ-FEAT-0006-06, REQ-FEAT-0006-07, REQ-FEAT-0006-08, NFR-0006, NFR-0007]
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
   de pneu, que hoje lê `maneuvers.drifting` (`src/main.ts:559`), é tratada pela decisão 6, que substitui o que
   esta decisão dizia dela na versão 1.1.0 (que a troca era da `dirigibilidade`). Quanto à
   `race-lap-validation` (revisão 3, US-10, voltas seguidas no treino), a câmera não depende de ordem (o modo
   não lê o tipo da volta); só a parte "kart em movimento" da verificação de integração de AC-US-0003-14 exige
   o código daquela feature, e até lá é divergência registrada em `98-divergences.md`, nunca um requisito
   afrouxado.
5. **Sem chave mestra.** O padrão neutro de I4 vale assim: nada da simulação muda (`RENDER_NEUTRAL`,
   `SIM_CONTRACT`, `DETERMINISM`), nenhum dado é persistido, e a mudança é só visual — o próprio F-Spec a
   declara segura e sem chave. A reversão é a do repositório.
6. **Revisão das rodadas 6 e 7 (feedback da `dirigibilidade`, FB-01 e FB-02; F-Spec com a situação de marca
   de pneu).** O D-Spec da `dirigibilidade` retira o drift sem condição substituta para as marcas: na janela de
   compatibilidade `State.maneuvers` vale sempre `initialManeuvers()` e `maneuvers.drifting` é sempre falso
   (ADR-0006 daquela feature, decisões 2 e 4), de modo que o `if` das marcas de `src/main.ts:554`, que exige
   `tricks.drifting`, nunca vale. O seed (`revision: 4`, US-5, segundo critério) e `DOMAIN/DEC-09` fixam
   quando as marcas aparecem, e o F-Spec os especifica (FEAT-0005 2.1.0: REQ-FEAT-0005-11 e -12, que
   substituem o requisito 04, retirado; RULE-0003 1.2.0, tabela "Trecho novo de marca de pneu"; FLOW-0001
   1.4.0, passo 9). Decide-se:
   1. A situação de marca de pneu é a do F-Spec, nomeada e não redefinida aqui: no quadro em que `simStepCount`
      avançou desde o quadro anterior, com `lapPhase` `RUNNING` em `getLapState`, `speedMps` maior que 6 e
      `sideslipRad` maior que 0,055 em `getHandlingTelemetry`, um trecho novo sob cada pneu traseiro; em
      qualquer outro quadro, nenhum (REQ-FEAT-0005-11, -12). O bloco das marcas de `src/main.ts` a decide com
      essas leituras, sem `tricks` nem outro campo de `State.maneuvers`, e a cadência de `SKID_STEP_INTERVAL`
      (um trecho a cada 5 passos) dá lugar a um trecho por quadro com passo novo
      ([DES-0005](../web/DES-0005-efeitos-presos-ao-kart.md), Situação de marca de pneu). Nenhum módulo,
      função, constante ou chave nova.
   2. A mudança entra na próxima rodada de código desta feature, que segue a entrega do código da
      `dirigibilidade`: a árvore corrente já publica `arcade-assistido-v6` (`src/physics.ts:106`) e mantém
      `State.maneuvers` constante. Com ela, nenhuma leitura de `State.maneuvers` desta feature resta em
      `src/main.ts` — uma das duas condições da retirada final da `dirigibilidade` (ADR-0006 daquela feature,
      decisão 4) —, e aquela retirada não precisa remover a condição das marcas.
   3. Na mesma rodada a linha de base é gravada de novo com `arcade-assistido-v6`
      (`npm run baseline:kart01 -- --force --commit <sha>`;
      [ADR-0004](ADR-0004-linha-de-base-da-simulacao-como-fixture-versionado.md),
      [DM-0001](../data/DM-0001-linha-de-base-da-simulacao-e-registro-em-tela.md)). Hoje ela está gravada com
      `arcade-assistido-v5` (`recordedOnCommit` `b86b200`), e a leitura já devolve `BASELINE_MISSING`
      (`tests/helpers/kart01Report.ts:340`) até a regravação; as verificações que dependem dela reprovam até lá
      — nunca uma comparação contra o acerto anterior.

## Alternativas consideradas

- **Entrar antes da `dirigibilidade`.** Contraria a decisão do dono do produto; produziria duas edições
  concorrentes de `src/main.ts` e uma linha de base invalidada pelo reacerto dos presets. Recusada.
- **Chave mestra desligada por padrão.** Proibida pelo F-Spec e deixaria a feature invisível na entrega.
  Recusada.
- **Impor ordem também à `pista-kart-park`.** Nenhum requisito ou decisão o pede; o projeto já é
  independente da pista. Recusada.
- **Marcas sem situação** (primeira opção do FB-01 da `dirigibilidade`). Contraria REQ-FEAT-0005-11, que o
  F-Spec acrescentou com o seed `revision: 4` e `DOMAIN/DEC-09`. Recusada (decisão 6).
- **Ler a velocidade e a derrapagem lateral direto de `State` (`state.speed`, `state.telemetry.sideslip`),
  como o `if` de hoje.** RULE-0003 e FLOW-0001 nomeiam `getHandlingTelemetry` como a leitura, com `NO_STATE`
  sem trecho; ler o mesmo fato por outro caminho faria um fato em dois lugares. Recusada.
- **Manter a cadência de um trecho a cada 5 passos (`SKID_STEP_INTERVAL`).** Deixaria quadros com a situação
  válida e sem trecho, contra REQ-FEAT-0005-11. Recusada.
- **Deixar a condição substituta à `dirigibilidade`.** Aquele D-Spec recusa criar condição de exibição
  (`SEED/RE-01`), e a situação é requisito desta feature (FEAT-0005). Recusada.

## Consequências

- O relatório de validação de código da `dirigibilidade` é precondição de entrada da etapa de código desta
  feature; o `pipeline-progress` mostra as duas.
- Se a `dirigibilidade` publicar outro `setupVersion` depois de a linha de base ser gravada, `npm test`
  reporta `BASELINE_MISSING` até a regravação — comportamento desejado, nunca comparação contra outro acerto.
  Isso vale também para o acerto que retira o drift e o turbo: a linha de base é regravada com
  `arcade-assistido-v6` na próxima rodada de código desta feature (decisão 6;
  [ADR-0004](ADR-0004-linha-de-base-da-simulacao-como-fixture-versionado.md)).
- As retiradas do turbo da rodada 5 não esperam a `dirigibilidade` (decisão 4); a situação de marca de pneu
  e a regravação da linha de base entram depois da entrega do código dela (decisão 6); a primeira rodada de
  código desta feature seguiu a decisão 1.
- Quantas marcas aparecem na pilotagem normal depende da física da `dirigibilidade`, que esta feature não
  muda; o D-Spec daquela feature mede 0,077 rad de derrapagem lateral máxima na volta do piloto de teste com
  `arcade-assistido-v6` (`NORMAL_DRIVING`, `DES-0004` dele), acima do limite de 0,055. Isso é contexto, não
  critério: os limites são os de REQ-FEAT-0005-11 e -12 e não mudam nesta etapa.

## Estado

Aceita na rodada 1; decisão 4 acrescentada na rodada 5 (F-Spec 1.3); decisão 6 acrescentada na rodada 6
(feedback `dirigibilidade` → `modelo-kart-01` de 2026-10-30, FB-01 e FB-02) e reescrita na rodada 7 sobre o
F-Spec com a situação de marca de pneu (REQ-FEAT-0005-11, -12).
