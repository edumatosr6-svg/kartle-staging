---
id: REL-0002
title: Migração — nenhum formato publicado ou persistido muda; a linha de base fica no repositório
feature: modelo-kart-01
stage: deploy
status: validated
version: 1.0.0
sources: [DM-0001, ADR-0003, ADR-0004, DES-0007, NFR-0006, NFR-0007, TEST-0004]
---

# REL-0002 — Migração

## Não há banco nem armazenamento no navegador

O produto não tem banco no MVP (I5) e esta feature não grava nada no navegador (DES-0007: "nada é persistido no navegador nem
enviado pela rede por esta feature; o único arquivo gravado é o fixture, por um programa fora de `npm test`"). O F-Spec declara
que nenhuma mudança de dado persistido ou de esquema é necessária (DM-0001). Os "esquemas" desta release são:

| Esquema | Onde vive | Versão nesta release | Persistido | Entra no bundle |
|---|---|---|---|---|
| Acerto publicado (`PublishedSetup`) | `PUBLISHED_SETUPS` em `src/physics.ts` | `arcade-assistido-v5` e `realista-aluguel-4t-v4` — **inalterados** (NFR-0006: 0 linhas em `src/physics.ts`; `SIM_CONTRACT` compara `STEP`, `Input` e medidas com a linha de base) | não | sim (os identificadores são conferidos por `check_bundle.py` e `check_served.py`) |
| Arquivo de pista | `src/trackData.ts` | `schemaVersion` 2, `trackId` `synthetic`, `trackVersion` 2 — **inalterado** | não | sim |
| Registro de volta e replay | memória da página | os da release anterior, inalterados (`src/lap.ts` 0 linhas) | não | sim |
| Linha de base da simulação (`kart01-sim-baseline.json`) | `tests/fixtures/`, no repositório | `schemaVersion` **1**, gravada sobre `b86b200` (`recordedOnCommit`); `setupVersion` e `trackVersion` correntes diferentes dos gravados dão `BASELINE_MISSING` em `npm test` (DM-0001) | em repositório, não em navegador | **não** |
| Registro em tela (`docs/kart-01/device-log.md`) | `docs/`, no repositório | prosa com tabelas; sem migração (DM-0001, seção 2) | em repositório | não |
| Dado do jogador no navegador | nenhum escrito por esta feature (`CHK-TEST-0004-*`; `check_bundle.py`: 0 ocorrências textuais de armazenamento no `dist/`) | — | a feature não lê nem escreve | — |

## Revisões, ordem, duração e reversão (D-DP-01)

| # | Revisão | O que faz | Ordem | Duração | Reversão (downgrade) | Como a reversão foi ensaiada |
|---|---|---|---|---|---|---|
| 1 | o Kart 01 e a câmera de jogo substituem o kart de caixas e a câmera alta no bundle (DES-0001 a DES-0005) | o `index.html` novo referencia `index-D0RarhFV.js`; nenhum dado é convertido, gravado ou lido | única; aplicada no mesmo passo em que o bundle é publicado | 0 s de indisponibilidade: não há dado armazenado a converter | republicar o bundle anterior (`runbook.md` R1: caminho B em staging — execução 40566728590 da árvore `b86b200`, `index-BiFxJ0FY.js`; caminho A ou C em produção). Em código, a reversão é o `git revert` da cadeia desta feature (ADR-0003: "a reversão é a do repositório") | caminho B ensaiado em staging em 2026-10-27 19:29–19:33Z (release anterior, mesmo site, mesmo procedimento: reexecução de 39631099098 → `index-Cqfgl3da.js` em ≈ 1 min 17 s; reexecução de 40566728590 → `index-BiFxJ0FY.js` em ≈ 2 min 12 s) |
| 2 | linha de base da simulação como fixture versionado (DM-0001, ADR-0004) | `tests/fixtures/kart01-sim-baseline.json`, `schemaVersion` 1, lido por `npm test` (`DETERMINISM`, `SIM_CONTRACT`, `WHEEL_POSITIONS`) | mesma publicação (vive no commit; não é servida) | 0 s | apagar o arquivo — "nenhum registro foi persistido fora dele" (DM-0001, *Reversão*); uma forma futura é `schemaVersion` 2 com o leitor de 1 mantido (I3, I5) | `CHK-TEST-0004-11` e `-13` reprovam quando o fixture não bate com a simulação corrente (`BASELINE_MISSING`); `npm run baseline:kart01` recusa regravar sem `--force` |

Não há revisão 3. A forma anterior do produto não carregava nada que esta release deixe de ler, e nenhuma versão em execução recebe
um dado que não entenda nesta entrega: a release só muda o que se **desenha**, nunca o que se **simula** ou se **registra**
(NFR-0006, NFR-0007; `RENDER_NEUTRAL` com `differingFieldCount` 0 sobre a volta de referência).

## Preenchimento retroativo (backfill)

Nenhum: não existe registro persistido a preencher. Não há, portanto, lote, idempotência, progresso ou interrupção a declarar.

## Formatos publicados para os próximos dias (D-DP-01)

Esta feature não publica pista, desafio nem acerto; as regras das releases anteriores continuam em vigor sem mudança: o arquivo
de pista versão 2 intacto; uma `trackVersion` ou uma `setupVersion` publicada nunca é editada no lugar (I3; ADR-0001 da
`dirigibilidade`). A regra nova que esta release deixa em vigor é para a **linha de base**: um fixture gravado vale só para o
`setupVersion` de cada acerto e para a `trackVersion` gravados; quando um acerto ou a pista mudarem de versão, a linha de base é
regravada por `npm run baseline:kart01 -- --force` no commit anterior à mudança, com o novo `recordedOnCommit` (DM-0001,
*Janela de compatibilidade*).

## Dado persistido do jogador (I5)

A feature não usa `localStorage`, `sessionStorage` nem IndexedDB. Qualquer dado que outra parte do produto venha a gravar no
navegador **não é lido, convertido nem apagado** por esta release.

## Janela de compatibilidade

Uma única versão do cliente roda por vez: a página servida pelo Pages. A janela que existe é a do **cache do navegador**
(`max-age=600`, `REL-0003`): um jogador com o `index.html` anterior em cache continua a correr o bundle anterior
(`index-BiFxJ0FY.js`, kart de caixas e câmera alta, mesma física) até buscar o `index.html` novo. Como nada é persistido nem
trocado com servidor, as duas versões coexistem sem conflito; um texto compartilhado por qualquer das duas é o mesmo
(`Kartle · synthetic v2 · <tempo> · arcade-assistido-v5`), porque o registro de volta não mudou.
