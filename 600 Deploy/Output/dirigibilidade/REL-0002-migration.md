---
id: REL-0002
title: Migração — acerto versionado no bundle, replay versão 1, dado persistido intocado
feature: dirigibilidade
stage: deploy
status: validated
version: 1.0.0
sources: [DM-0001, DES-0003, ADR-0001, ADR-0002, NFR-0007, NFR-0008, NFR-0009, TEST-0008]
---

# REL-0002 — Migração

## Não há banco nem armazenamento no navegador

O produto não tem banco no MVP (I5) e esta feature não grava nada no navegador (DM-0001, seção 1: "não há banco de dados
nem armazenamento no navegador nesta feature"). Os "esquemas" desta release são:

| Esquema | Onde vive | Versão nesta release | Persistido |
|---|---|---|---|
| Acerto publicado (`PublishedSetup`) | empacotado no bundle (`PUBLISHED_SETUPS` em `src/physics.ts`) | `ARCADE_ASSISTIDO` → `arcade-assistido-v5` (anterior `arcade-assistido-v4`, intacta como `previousConfig`); `REALISTA_ALUGUEL_4T` → `realista-aluguel-4t-v4` (inalterado, NFR-0007) | não: viaja dentro do JS |
| Registro de volta (`LapRecord`) | memória da página (`LapResult` + `SetupRef`; DM-0001 seção 2) | sem versão própria: carrega `setupId` e `setupVersion` do pedido da volta | não |
| Replay (`ReplayRecord`) | memória da página e fixtures de teste (`tests/fixtures/records.ts`) | `replayFormatVersion` **1** (`REPLAY_FORMAT_VERSION`); ausente lê-se como 1; maior que 1 é `UNSUPPORTED_FORMAT` | não: nenhum replay é gravado por esta release |
| Linha de base dos ensaios | `docs/physics.md`, bloco ```json handling-baseline``` | três entradas: `arcade-assistido-v4`, `realista-aluguel-4t-v4` (2026-10-22) e `arcade-assistido-v5` (refeita em 2026-10-27T18:18Z) | em repositório, não em navegador |
| Arquivo de pista | empacotado no bundle (`race-lap-validation`) | `schemaVersion` 2, `trackId` `synthetic`, `trackVersion` 2 — **inalterado** (NFR-0008) | não |
| Dado do jogador no navegador | nenhum escrito por esta feature (`CHK-TEST-0010-*`; `check_bundle.py`: 0 ocorrências textuais de `localStorage`/`sessionStorage`/`indexedDB` no `dist/`) | — | a feature não lê nem escreve |

## Revisões, ordem, duração e reversão (D-DP-01)

| # | Revisão | O que faz | Ordem | Duração | Reversão (downgrade) | Como a reversão foi ensaiada |
|---|---|---|---|---|---|---|
| 1 | acerto `arcade-assistido-v4` → `arcade-assistido-v5` como padrão (DM-0001 M1, M3) | `PUBLISHED_SETUPS.ARCADE_ASSISTIDO.config` passa a `ARCADE_ASSISTIDO_V5`; `ARCADE_KART` (v4) fica intacto como `previousConfig`; o Realista não muda | única; aplicada no mesmo passo em que o bundle é publicado | 0 s de indisponibilidade: não há dado armazenado a converter | republicar o bundle anterior (`runbook.md` R1: caminho B em staging — execução 39631099098 da árvore `c41c6c3`; caminho A ou C em produção); nada fica gravado em navegador, logo não há dado a desfazer. Em código, a reversão é um commit que aponta `config` de volta a `ARCADE_KART` (DM-0001, *Plano de migração*: "remover os leitores; nenhum registro foi persistido") | `CHK-TEST-0008-*`: `getSetupVersion('ARCADE_ASSISTIDO')` com `previousSetupVersion` diferente; `REALISTA_UNCHANGED` 0 medidas diferentes; R1/R2 ensaiados em staging em 2026-10-21 (release anterior, mesmo procedimento) |
| 2 | leitores de registro antigo (DM-0001 M2, M4; ADR-0002) | `readReplay`/`resolveSetupRef` leem um registro **sem** `setupVersion` como `arcade-assistido-v4` (`RESOLVED_FROM_ABSENCE`); `replayFormatVersion` > 1 é `UNSUPPORTED_FORMAT` e o objeto fica intacto (I4); `src/lap.ts` ganha `setupId?`/`setupVersion?` copiados do pedido, ausentes quando o pedido não os traz (`CHK-TEST-0012-02` de `race-lap-validation` continua verde) | mesma publicação | 0 s | remover os leitores e os campos; nenhum registro foi persistido com eles | `CHK-TEST-0008-*` (`oldReplay()`, `oldResult()`, `futureReplay()` intacto, `corruptReplay()`, `oversizedReplay()` sem ler elementos); NFR-0009 |

Não há revisão 3. A forma anterior do produto não carregava `setupVersion` em registro algum e não persistia registros,
por isso nenhuma versão em execução recebe um dado que não entenda nesta entrega.

## Preenchimento retroativo (backfill)

Nenhum: não existe registro persistido a preencher (DM-0001, *Backfill*: "não há registro persistido a preencher; um
registro antigo sem `setupVersion` é resolvido na leitura"). Não há, portanto, lote, idempotência, progresso ou
interrupção a declarar.

## Formatos publicados para os próximos dias (D-DP-01)

Esta feature não publica pista nem desafio; a regra da release anterior continua em vigor (arquivo de pista versão 2
intacto; uma `trackVersion` publicada nunca é editada no lugar, I3). A regra nova que esta release deixa em vigor para o
**acerto**:

- uma `setupVersion` publicada nunca é editada no lugar (ADR-0001): mudar um parâmetro do v5 exige publicar
  `arcade-assistido-v6` e manter o v5 intacto como `previousConfig`;
- um registro ou replay com `setupVersion` desconhecida não é comparável (`SETUP_VERSION_DIFFERS`, RULE-0003) e nunca é
  descartado (I4); um replay com formato maior que 1 é `UNSUPPORTED_FORMAT` e fica intacto.

## Dado persistido do jogador (I5)

A feature não usa `localStorage`, `sessionStorage` nem IndexedDB. Qualquer dado que outra parte do produto venha a gravar
no navegador **não é lido, convertido nem apagado** por esta release. A persistência de registros e replays pertence ao
desafio diário (pós-MVP) e não entra aqui; quando entrar, os leitores desta release (`readReplay`, `resolveSetupRef`) são
os que lerão o que foi gravado sem `setupVersion`.

## Janela de compatibilidade

Uma única versão do cliente roda por vez: a página servida pelo Pages. A janela que existe é a do **cache do navegador**
(`max-age=600`, `REL-0003`): um jogador com o `index.html` anterior em cache continua a correr o bundle anterior
(`index-Cqfgl3da.js`, acerto v4 sem `setupVersion` no resultado) até buscar o `index.html` novo. Como nada é persistido
nem trocado com servidor, as duas versões coexistem sem conflito; um texto compartilhado pela versão anterior não traz
`setupVersion`, e um leitor desta release o resolveria como `arcade-assistido-v4` (NFR-0009).
