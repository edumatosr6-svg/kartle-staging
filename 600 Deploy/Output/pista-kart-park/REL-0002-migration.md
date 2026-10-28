---
id: REL-0002
title: Migração — o arquivo de pista ganha o esquema 3 com o leitor do 2 mantido; nada persistido muda; a versão publicada é imutável
feature: pista-kart-park
stage: deploy
status: validated
version: 1.0.0
sources: [DM-0001, DM-0002, DES-0001, DES-0010, DES-0011, ADR-0001, ADR-0002, ADR-0005, NFR-0001, NFR-0006, NFR-0008, NFR-0012, TEST-0001, TEST-0002, TEST-0012]
---

# REL-0002 — Migração

## Não há banco nem armazenamento no navegador

O produto não tem banco no MVP (I5) e esta feature não grava nada no navegador: a pista escolhida não é lembrada (a reabertura
volta à Kart Park porque o código seleciona `OPENING_TRACK_ID` na carga), nenhuma volta de treino cria registro de desafio
(DES-0012; CHK-TEST-0007-05, CHK-TEST-0011-02). Os "esquemas" desta release são:

| Esquema | Onde vive | Versão nesta release | Persistido | Entra no bundle |
|---|---|---|---|---|
| Arquivo de pista — **esquema 3** (`TRACK_SCHEMA_VERSION` 3: `schemaVersion`, `trackId`, `trackVersion`, `osmDerived`, `direction`, `startPosition`, `finishLine`, `sectorLimits`, `markers`, `centerline` com `widthM` por ponto, `curbs`, `barriers`) | `src/trackData.ts` (leitor), `src/tracks/kart-park-v1.json` (dado) | `kart-park` **versão 1**, 43 013 bytes, SHA-256 `04ce5e51…`; `readTrackData` → `COMPLETE`, `checkConsistencyV3` vazio; V01–V18 `PASS` | não | **sim, como literal no JS** (43 012 bytes sem o LF final; `check_bundle.py` confere o SHA-256 + LF contra `tracks/registry.json`) |
| Arquivo de pista — esquema 2 (a pista `synthetic` v2) | `src/trackData.ts` (caminho da versão 2 intacto) | `synthetic` v2 — **inalterado** (DES-0001: "o caminho da versão 2 intacto"; CHK-TEST-0009-02 de `race-lap-validation`, reescrito em `32d0adf`, afirma que a v3 é posterior e a sintética continua `COMPLETE`) | não | sim |
| Acerto publicado (`PublishedSetup`) | `PUBLISHED_SETUPS` em `src/physics.ts` | `arcade-assistido-v5` e `realista-aluguel-4t-v4` — **inalterados** (NFR-0008: presets, `STEP`, `Input` e `step` intactos; `SIM_CONTRACT`, `DETERMINISM` e `bench:handling` 46/46 provam-no na sintética) | não | sim (identificadores conferidos pelas ferramentas) |
| Registro de volta e replay | memória da página | ganha `lapKind` `TRAINING`, `trackId` e `trackVersion` no pedido (DES-0005); o resultado e o texto compartilhado na sintética são os da release anterior (`#lap-result-setup` = `arcade-assistido-v5`) | não | sim |
| Registro de publicação (`tracks/registry.json`) | repositório | `registryVersion` 1; entrada `kart-park` 1 `STAGING` com `sha256`, `fileBytes`, `stagedAtUtc`, `prep`; **sem** `promotedAtUtc`/`esriDecisionRef` (DM-0002) | em repositório, não em navegador | **não** |
| Origem do preparo (`tracks/sources/kart-park.json`, formato `kartle-pista` v1) | repositório | cópia byte a byte do seed, SHA-256 `52c5adda…` | em repositório | não |
| Registro em tela (`docs/kart-park-device-log.md`) | `docs/`, a criar pelo dono do produto | prosa com tabelas; sem migração | em repositório | não |
| Dado do jogador no navegador | nenhum lido ou escrito por esta feature | — | — | — |

## Revisões, ordem, duração e reversão (D-DP-01)

| # | Revisão | O que faz | Ordem | Duração | Reversão (downgrade) | Como a reversão foi ensaiada |
|---|---|---|---|---|---|---|
| 1 | o leitor de pista passa a aceitar o esquema 3 e a Kart Park entra no bundle (DES-0001, DM-0001, ADR-0001, ADR-0002) | o `index.html` novo referencia `index-DYFBop8t.js`, que carrega os dois arquivos de pista; nenhum dado é convertido, gravado ou lido: a versão 2 continua lida pelo mesmo leitor | única; aplicada no mesmo passo em que o bundle é publicado | 0 s de indisponibilidade: não há dado armazenado a converter | republicar o bundle anterior (`runbook.md` R1: caminho B em staging — execução 40579585592 da árvore `6ea3862`, `index-D0RarhFV.js`; caminho A em produção, onde nada foi publicado). Em código, a reversão é o `git revert` da cadeia desta feature (ADR-0005: "o artefato anterior não contém a Kart Park") | o **procedimento** do caminho B foi ensaiado em staging em 2026-10-27 19:29–19:33Z (release `dirigibilidade`, mesmo site, mesma workflow: reexecução de 39631099098 → `index-Cqfgl3da.js` em ≈ 1 min 17 s; reexecução de 40566728590 → `index-BiFxJ0FY.js` em ≈ 2 min 12 s); para o par desta release (40579585592 ↔ execução de `d9139a2`) não foi repetido por esta rodada (`98-divergences.md`, DIV-DP-03) |
| 2 | a Kart Park como versão publicada e imutável no registro (DM-0002, DES-0011; NFR-0006) | `tracks/registry.json` com a entrada `kart-park` 1 em `STAGING`; `publish` de novo → `já registrado`; outro conteúdo com o mesmo par → recusado; `prepare` de novo → recusado (par já registrado) | mesma publicação (vive no commit; não é servido) | 0 s | **não se reverte uma versão publicada**: uma correção é `trackVersion` 2 (I3; REQ-FEAT-0002-18) — a entrada de rodada reprovada da rodada 1 foi retirada antes de qualquer entrega (DM-0002 1.1.0, "Entrada de rodada reprovada"), por isso a 1 é a primeira entregue | CHK-TEST-0012-01..03 (resumos iguais aos registrados, pares únicos, catálogo no maior `trackVersion`); `check_bundle.py` confere que o bundle serve exatamente o conteúdo registrado |
| 3 | **promoção a `PRODUCTION`** (DES-0011; ADR-0005; NFR-0012) — **não faz parte desta release** | `npm run track -- promote kart-park 1 --esri-decision "<referência>"` grava `PRODUCTION`, `promotedAtUtc` e `esriDecisionRef`; sem a referência: recusa com código 1 e nada escrito (CHK-TEST-0012-04) | **só na entrega que promover**, depois da decisão Esri registrada em `DOMAIN.md`; é um commit próprio (o registro muda) | 1 s | não se aplica a esta release (não executada); naquela entrega, "`PRODUCTION` repetido: nada" e a volta a `STAGING` não existe por projeto — a reversão de produção é a do bundle | — |

Não há revisão de dado persistido. A forma anterior do produto não carregava nada que esta release deixe de ler, e nenhuma versão
em execução recebe um dado que não entenda: o bundle anterior nunca recebe um arquivo de esquema 3 (não há rede), e o bundle novo
lê o esquema 2 da sintética com o caminho antigo (CHK-TEST-0002-*; CHK-TEST-0009-02 de `race-lap-validation`).

## Preenchimento retroativo (backfill)

Nenhum: não existe registro persistido a preencher. Não há, portanto, lote, idempotência, progresso ou interrupção a declarar.
O único "preenchimento" é o preparo offline (`prepare` → `verify` → `publish`), já executado, determinístico (duas execuções dão
listas `deepEqual`; `publish` reconfere a reprodução byte a byte) e fora do caminho de publicação.

## Formatos publicados para os próximos dias (D-DP-01)

A regra que esta release deixa em vigor: **uma versão publicada de pista nunca é editada no lugar** (NFR-0006; REQ-FEAT-0002-18) —
uma mudança de traçado, de suavização ou de barreira é `kart-park` **2**, com o seu próprio `prepare`/`verify`/`publish`, e o
catálogo aponta para a maior `trackVersion` registrada (CHK-TEST-0012-03). A sintética continua `synthetic` v2, intacta. Os
acertos `arcade-assistido-v5` e `realista-aluguel-4t-v4` continuam os das releases anteriores. Um leitor futuro de esquema 4
mantém o 3 e o 2 (I3, I5), como o 3 manteve o 2.

## Dado persistido do jogador (I5)

A feature não usa `localStorage`, `sessionStorage`, IndexedDB nem cookie. Qualquer dado que outra parte do produto venha a
gravar no navegador **não é lido, convertido nem apagado** por esta release.

## Janela de compatibilidade

Uma única versão do cliente roda por vez: a página servida pelo Pages. A janela que existe é a do **cache do navegador**
(`max-age=600`, `REL-0003`): um jogador com o `index.html` anterior em cache continua a correr o bundle anterior
(`index-D0RarhFV.js`, só a pista sintética, sem seletor) até buscar o `index.html` novo. Como nada é persistido nem trocado com
servidor, as duas versões coexistem sem conflito; o texto compartilhado de uma volta na sintética é o mesmo nas duas
(`Kartle · synthetic v2 · <tempo> · arcade-assistido-v5`); uma volta na Kart Park só existe na nova.
