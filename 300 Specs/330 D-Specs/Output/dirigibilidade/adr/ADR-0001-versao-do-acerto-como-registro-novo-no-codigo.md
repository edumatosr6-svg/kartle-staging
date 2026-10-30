---
id: ADR-0001
title: Cada versão do acerto é um registro novo em código; a anterior à feature e as rodadas substituídas ficam intactas; sem chave mestra
feature: dirigibilidade
stage: dspec
status: validated
version: 1.1.0
sources: [RULE-0003, FEAT-0005, FEAT-0006, REQ-FEAT-0005-05, REQ-FEAT-0005-09, REQ-FEAT-0006-04, REQ-FEAT-0006-07, NFR-0007, NFR-0009]
---

# ADR-0001 — Cada versão do acerto é um registro novo em código; a anterior à feature e as rodadas substituídas ficam intactas; sem chave mestra

## Contexto

O F-Spec exige que o novo Arcade assistido seja declarado como nova `setupVersion`, que nenhuma versão
publicada seja editada no lugar (REQ-FEAT-0005-09, RULE-0003) e que o conjunto de `npm test` de
`race-lap-validation` continue 100 % aprovado (REQ-FEAT-0006-07). Esse conjunto afirma literalmente os valores
de `ARCADE_KART` e `RENTAL_KART` e que `KART_PRESETS.arcade === ARCADE_KART`
(`tests/race-lap-validation-frozen.test.ts`, CHK-TEST-0014-03 a -05). O F-Spec proíbe qualquer configuração
para escolher entre acertos (FEAT-0005, Configuração), enquanto a política do estágio pede uma chave mestra
desligada por padrão para toda feature nova (I4). API-0002 e RULE-0003 definem `previousSetupVersion` como a
versão do Arcade **anterior à feature** — o padrão com que um registro gravado antes dela é resolvido — e
mandam que cada rodada de presets do ciclo em staging (`DOMAIN/DEC-10`) seja nova `setupVersion`, com a rodada
reprovada em `SUPERSEDED`, legível e nunca editada. A rodada `arcade-assistido-v5` foi publicada na staging, e
o dono do produto escolheu o acerto C (`DOMAIN/DEC-15`).

## Decisão

1. `ARCADE_KART` permanece em `src/physics.ts` com o seu conteúdo e é o registro da versão
   `arcade-assistido-v4`, a anterior à feature (`previousSetupVersion`, `previousConfig`). `KART_PRESETS` fica
   como está e não é lido pelo jogo.
2. Cada rodada do Arcade assistido é um literal novo em `src/physics.ts`: `ARCADE_ASSISTIDO_V5`
   (`arcade-assistido-v5`, substituída) e `ARCADE_ASSISTIDO_V6` (`arcade-assistido-v6`, o acerto C,
   `{...ARCADE_ASSISTIDO_V5, governorSpeed: 19.5, assistLateralG: 2.4, maxSteer: 0.5, friction: 2.1,
   frontStiffness: 26}`). O literal de uma rodada substituída nunca é editado nem removido; o da rodada
   corrente é o `config` de `PUBLISHED_SETUPS`.
3. O dado publicado é `PUBLISHED_SETUPS` ([DM-0001](../data/DM-0001-dado-publicado-registros-e-linha-de-base.md)),
   lido por `src/main.ts` e pelos ensaios, com um registro por `setupId`: a versão corrente e a anterior à
   feature. `previousSetupVersion` não acompanha as rodadas de staging, porque mudaria a resolução de
   registros antigos para uma versão que nunca os produziu.
4. Os parâmetros de assistência são campos **opcionais** de `KartConfig` com padrão igual ao comportamento
   anterior, ausentes em `RENTAL_KART` e `ARCADE_KART`.
5. Não há chave mestra: a entrega da versão nova **é** a sua declaração no dado publicado; o "padrão sem
   mudança" de I4 está nos campos opcionais ausentes; uma chave para voltar a outra versão seria exatamente a
   configuração que o F-Spec proíbe. `PHYSICS_VERSION` não muda.

## Alternativas consideradas

- **Editar `ARCADE_ASSISTIDO_V5` no lugar com os valores do acerto C.** A rodada foi publicada na staging e é
  `SUPERSEDED` (RULE-0003): editá-la faria um replay gravado nela ser lido como de outro acerto. Recusada.
- **`previousSetupVersion` apontando para a rodada substituída (`arcade-assistido-v5`, `previousConfig`
  `ARCADE_ASSISTIDO_V5`)** (a leitura da versão 2.0.0 de DM-0001). Um registro anterior à feature, sem
  `setupVersion`, passaria a ser resolvido para v5, que nunca o produziu, contra API-0002 ("a versão anterior
  à feature"); a linha de base do Arcade deixaria de ser a do acerto anterior à feature (RULE-0002). Recusada.
- **Editar `ARCADE_KART` no lugar.** Viola REQ-FEAT-0005-09 e quebra CHK-TEST-0014-04. Recusada.
- **Nova `trackVersion` em vez de `setupVersion`.** O F-Spec decidiu pela versão própria do acerto. Recusada.
- **Chave mestra que liga o acerto novo, ou prévias selecionáveis por endereço (como as da staging,
  `?acerto=c`).** Proibidas pelo F-Spec (FEAT-0005, Configuração; `DOMAIN/DEC-10`). Recusadas.
- **Nova `PHYSICS_VERSION`.** Nomeia o modelo, não o acerto, e está congelada por CHK-TEST-0014-05. Recusada.

## Consequências

- Três literais de preset Arcade convivem em `src/physics.ts` (`ARCADE_KART`, `ARCADE_ASSISTIDO_V5`,
  `ARCADE_ASSISTIDO_V6`); só o corrente é código vivo do jogo. Toda rodada futura acrescenta um literal.
- O teste de congelamento de `race-lap-validation` continua verde sem edição; os testes que usam `ARCADE_KART`
  continuam rodando contra a versão anterior à feature; os auxiliares de outras features que importam
  `ARCADE_ASSISTIDO_V5` continuam valendo, porque o literal não muda.
- Leitores que fixaram a versão publicada pelo nome (a linha de base da simulação de `modelo-kart-01`,
  chaveada em `arcade-assistido-v5`) passam a não encontrar a sua versão: é a consequência pretendida de uma
  versão nova, e cabe à feature que os possui medir de novo (`01-architecture.md`, Efeito sobre outras
  features).

## Estado

Aceita nesta rodada.
