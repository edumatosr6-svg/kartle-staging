---
id: REL-0002
title: Migração — acerto v6 versionado no bundle, drift fora do passo, replay versão 1, dado persistido intocado
feature: dirigibilidade
stage: deploy
status: validated
version: 2.0.0
sources: [DM-0001, DES-0001, DES-0003, ADR-0001, ADR-0002, ADR-0006, NFR-0007, NFR-0008, NFR-0009, TEST-0008]
---

# REL-0002 — Migração

## Não há banco nem armazenamento no navegador

O produto não tem banco no MVP (I5) e esta feature não grava nada no navegador (DM-0001, seção 1: "não há banco de dados
nem armazenamento no navegador nesta feature"). Os "esquemas" desta release são:

| Esquema | Onde vive | Versão nesta release | Persistido |
|---|---|---|---|
| Acerto publicado (`PublishedSetup`) | empacotado no bundle (`PUBLISHED_SETUPS` em `src/physics.ts`) | `ARCADE_ASSISTIDO` → `arcade-assistido-v6` (`ARCADE_ASSISTIDO_V6`), anterior declarada `arcade-assistido-v4` (`ARCADE_KART`, intacto como `previousConfig`); `REALISTA_ALUGUEL_4T` → `realista-aluguel-4t-v4` (inalterado, NFR-0007). `ARCADE_ASSISTIDO_V5` fica no código como base dos valores do v6 e registro da rodada de staging substituída; o identificador `arcade-assistido-v5` não está no JS servido (`check_served.py`) | não: viaja dentro do JS |
| Estado da simulação (`State`) | memória da página | `State.maneuvers` carregado sem mudança pelo passo: o comando `drift` de `Input` é aceito e ignorado (`DRIFT_INERT`), sem carga, impulso nem turbo (ADR-0006; janela de compatibilidade até a retirada final de `src/maneuvers.ts`) | não |
| Registro de volta (`LapRecord`) | memória da página (`LapResult` + `SetupRef`; DM-0001 seção 2) | sem versão própria: carrega `setupId` e `setupVersion` do pedido da volta; a `setupVersion` é dado do registro e não aparece na tela nem no texto compartilhado (DES-0006) | não |
| Replay (`ReplayRecord`) | memória da página e fixtures de teste (`tests/fixtures/records.ts`) | `replayFormatVersion` **1** (`REPLAY_FORMAT_VERSION`); ausente lê-se como 1; maior que 1 é `UNSUPPORTED_FORMAT` | não: nenhum replay é gravado por esta release |
| Linha de base dos ensaios | `docs/physics.md`, bloco ```json handling-baseline``` | quatro entradas: `arcade-assistido-v4` e `realista-aluguel-4t-v4` (medidas de novo em 2026-10-30), `arcade-assistido-v6` (2026-10-30T13:55:38Z) e `arcade-assistido-v5` (2026-10-27, registro da rodada substituída, que nenhum ensaio lê) | em repositório, não em navegador |
| Arquivo de pista | empacotado no bundle | inalterado por esta feature (as pistas e o seu esquema são de `race-lap-validation` e `pista-kart-park`; NFR-0008) | não |
| Dado do jogador no navegador | nenhum escrito por esta feature (`CHK-TEST-0010-*`; `check_bundle.py`: 0 ocorrências textuais de `localStorage`/`sessionStorage`/`indexedDB` no `dist/`) | — | a feature não lê nem escreve |

## Revisões, ordem, duração e reversão (D-DP-01)

| # | Revisão | O que faz | Ordem | Duração | Reversão (downgrade) | Como a reversão foi ensaiada |
|---|---|---|---|---|---|---|
| 1 | acerto padrão → `arcade-assistido-v6` (DM-0001 M1, M3; DES-0001) | `PUBLISHED_SETUPS.ARCADE_ASSISTIDO.config` passa a `ARCADE_ASSISTIDO_V6`; `ARCADE_KART` (v4) fica intacto como `previousConfig`; o Realista não muda | única; aplicada no mesmo passo em que o bundle é publicado | 0 s de indisponibilidade: não há dado armazenado a converter | republicar o bundle anterior (`runbook.md` R1: caminho B em staging — execução 41076989728, `652bbaa`; caminho A em produção, onde nada foi publicado); nada fica gravado em navegador | `CHK-TEST-0008-*` (`getSetupVersion('ARCADE_ASSISTIDO')` = v6 com anterior v4; `REALISTA_UNCHANGED` 0 medidas diferentes); caminho B ensaiado neste site em 2026-10-27 (≈ 1 min 17 s do comando à página servida; restauração ≈ 2 min 12 s) |
| 2 | drift e turbo fora do passo (ADR-0006; DES-0001) | o passo ignora o comando `drift` e não aplica carga, impulso nem turbo; a velocidade máxima é a do governador (`SPEED_CAP`); `Input`, `STEP` e o solver de 480 Hz não mudam (`STEP_CONTRACT`) | mesma publicação | 0 s | republicar o bundle anterior: em staging, a execução 41076989728 tem o v6 e também o drift fora do passo (código da rodada 5); a anterior a ela, 40566728590 (`b86b200`), tem o v5 com drift | `DRIFT_INERT` (0 de 3 126 passos diferentes numa volta; 0 de 360 na recuperação), `SPEED_CAP` e `STEP_CONTRACT` em `npm run bench:handling` e em `npm test` |
| 3 | drift e turbo fora das telas (DES-0005, DES-0006, DES-0007, DES-0009) | só remoção de exibição: HUD, resultado (`#lap-result-setup` também sai), texto compartilhado, tela inicial, dica, guia de manobras e o botão "Drift" do toque | mesma publicação | 0 s | republicar o bundle anterior (caminho B: `652bbaa` volta a mostrar o drift nas telas) | `CHK-TEST-0007-05..10`; `check_served.py` reprova o HTML de `652bbaa` nas linhas de drift (que tem "Drift", "Espaço" e `data-control="drift"`) |
| 4 | leitores de registro antigo (DM-0001 M2, M4; ADR-0002) — inalterados desde a release anterior | um registro **sem** `setupVersion` é lido como `arcade-assistido-v4` (`RESOLVED_FROM_ABSENCE`); `replayFormatVersion` > 1 é `UNSUPPORTED_FORMAT` e o objeto fica intacto (I4) | mesma publicação | 0 s | remover os leitores; nenhum registro foi persistido com eles | `CHK-TEST-0008-*` (`oldReplay()`, `v4Replay()` → `SETUP_VERSION_DIFFERS` com o v6, `futureReplay()` intacto); NFR-0009 |

Não há revisão 5. Nenhuma versão em execução recebe um dado que não entenda: nada é persistido nem trocado com servidor.

## Preenchimento retroativo (backfill)

Nenhum: não existe registro persistido a preencher (DM-0001, *Backfill*). Não há lote, idempotência, progresso ou
interrupção a declarar.

## Formatos publicados para os próximos dias (D-DP-01)

- uma `setupVersion` publicada nunca é editada no lugar (ADR-0001): mudar um parâmetro do v6 exige publicar
  `arcade-assistido-v7` e manter o v6 intacto;
- um registro ou replay com `setupVersion` diferente da corrente não é comparável (`SETUP_VERSION_DIFFERS`, RULE-0003) e
  nunca é descartado (I4); um replay com formato maior que 1 é `UNSUPPORTED_FORMAT` e fica intacto;
- a retirada final de `src/maneuvers.ts` e de `State.maneuvers` é uma entrega futura com gatilho em ADR-0006 (os leitores de
  outras features saem antes); o campo `drift` de `Input` continua no contrato de passo (I8).

## Dado persistido do jogador (I5)

A feature não usa `localStorage`, `sessionStorage` nem IndexedDB. Qualquer dado que outra parte do produto venha a gravar
no navegador **não é lido, convertido nem apagado** por esta release.

## Janela de compatibilidade

Uma única versão do cliente roda por vez: a página servida pelo Pages. A janela que existe é a do **cache do navegador**
(`max-age=600`, `REL-0003`): um jogador com o `index.html` anterior em cache continua a correr o bundle anterior até buscar o
novo. Como nada é persistido nem trocado com servidor, as duas versões coexistem sem conflito; um tempo feito com outra
versão do acerto nunca é apresentado como comparável a um tempo v6 (RULE-0003).
