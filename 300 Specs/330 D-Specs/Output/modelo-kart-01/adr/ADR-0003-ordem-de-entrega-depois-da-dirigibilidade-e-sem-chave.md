---
id: ADR-0003
title: O código desta feature entra depois do da dirigibilidade, que também altera src/main.ts; sem chave mestra, porque o F-Spec proíbe configuração
feature: modelo-kart-01
stage: dspec
status: validated
version: 1.0.0
sources: [FEAT-0001, FEAT-0003, FEAT-0006, REQ-FEAT-0001-01, REQ-FEAT-0006-06, REQ-FEAT-0006-07, REQ-FEAT-0006-08, NFR-0006]
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
4. **Sem chave mestra.** O padrão neutro de I4 vale assim: nada da simulação muda (`RENDER_NEUTRAL`,
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

## Estado

Aceita nesta rodada.
