---
id: REL-0002
title: Migração — o arquivo de pista ganha o esquema 3 com o leitor do 2 mantido; nada persistido muda; a versão publicada é imutável
feature: pista-kart-park
stage: deploy
status: validated
version: 2.0.0
sources: [DM-0001, DM-0002, DES-0001, DES-0005, DES-0010, DES-0011, ADR-0001, ADR-0002, ADR-0005, ADR-0008, NFR-0001, NFR-0006, NFR-0008, NFR-0012, NFR-0014, TEST-0001, TEST-0002, TEST-0007, TEST-0012]
---

# REL-0002 — Migração

## Não há banco nem armazenamento no navegador

O produto não tem banco no MVP (I5) e esta feature não grava nada no navegador: a pista escolhida não é lembrada (a reabertura
volta à Kart Park porque o código seleciona `OPENING_TRACK_ID` na carga), nenhuma volta de treino cria registro de desafio
(DES-0012; CHK-TEST-0007-05, CHK-TEST-0011-02). Os "esquemas" desta release são:

| Esquema | Onde vive | Versão nesta release | Persistido | Entra no bundle |
|---|---|---|---|---|
| Arquivo de pista — **esquema 3** (`TRACK_SCHEMA_VERSION` 3: `schemaVersion`, `trackId`, `trackVersion`, `osmDerived`, `direction`, `startPosition`, `finishLine`, `sectorLimits`, `markers`, `centerline` com `widthM` por ponto, `curbs`, `barriers`) | `src/trackData.ts` (leitor, inalterado na revisão 3), `src/tracks/kart-park-v2.json` (dado empacotado) | `kart-park` **versão 2**, 36 585 bytes, SHA-256 `c79f14cb…`, 691 pontos, 7,0 m em todo ponto; `readTrackData` → `COMPLETE`; V01–V20 `PASS` | não | **sim, como literal no JS** (36 584 bytes sem o LF final; `check_bundle.py` confere o SHA-256 + LF contra a entrada `kart-park` 2 de `tracks/registry.json`) |
| Arquivo de pista — esquema 3, `kart-park` **versão 1** | `src/tracks/kart-park-v1.json` | 43 013 bytes, SHA-256 `04ce5e51…`, o mesmo blob desde `d9139a2`; publicada e congelada (`prepare`/`verify`/`publish` recusados — ADR-0008, decisão 5) | não | **não** desde a revisão 3 (ADR-0008, decisão 4; `src/main.ts` não a importa; `check_bundle.py` confere a ausência) |
| Conferência de versão do catálogo | `src/trainingSession.ts` (`TRAINING_TRACKS`, `selectTrainingTrack`) | a entrada `kart-park` declara `trackVersion` 2; um arquivo com outro `trackVersion` dá `FAILED` com `TRACK_VERSION_MISMATCH` (DES-0005; ADR-0008, decisão 3) | não | sim |
| Arquivo de pista — esquema 2 (a pista `synthetic` v2) | `src/trackData.ts` (caminho da versão 2 intacto) | `synthetic` v2 — **inalterado** (DES-0001; CHK-TEST-0009-02 de `race-lap-validation`) | não | sim |
| Acerto publicado (`PublishedSetup`) | `PUBLISHED_SETUPS` em `src/physics.ts` | `arcade-assistido-v6` e `realista-aluguel-4t-v4` (de `dirigibilidade`) — **esta feature não os altera** (NFR-0008) | não | sim (identificadores conferidos pelas ferramentas) |
| Registro de volta e replay | memória da página | `lapKind` `TRAINING`, `trackId` e `trackVersion` da sessão (agora 2) em cada `LapResult` (DES-0005); nada sobrevive à recarga | não | sim |
| Registro de publicação (`tracks/registry.json`) | repositório | `registryVersion` 1; entradas `kart-park` 1 e **2** em `STAGING` com `sha256`, `fileBytes`, `stagedAtUtc`, `prep` (na 2, `prep.method` `REPLICA`, `originFile` `tracks/sources/kart-park-replica.json`, `originSha256` `eba665b6…`, `lapLengthM` 690,674); **sem** `promotedAtUtc`/`esriDecisionRef` (DM-0002 2.0.1) | em repositório, não em navegador | **não** |
| Origens do preparo | repositório | `tracks/sources/kart-park.json` (formato `kartle-pista` v1, CRLF, `52c5adda…`, intacta) e `tracks/sources/kart-park-replica.json` (a réplica, CRLF, `eba665b6…` = `prep.originSha256` da entrada 2), cópias byte a byte **no blob do git**, garantidas pela regra byte-exata (`.gitattributes` `-text` desde `5ed7a5b`); conferência: `git ls-files --eol` com `attr/-text` e `i/` = `w/` nos cinco arquivos (`runbook.md`, *Promote* 1) | em repositório | não |
| Registro em tela (`docs/kart-park-device-log.md`) | `docs/`, do dono do produto | prosa com tabelas; sem migração | em repositório | não |
| Dado do jogador no navegador | nenhum lido ou escrito por esta feature | — | — | — |

## Revisões, ordem, duração e reversão (D-DP-01)

| # | Revisão | O que faz | Ordem | Duração | Reversão (downgrade) | Como a reversão foi ensaiada |
|---|---|---|---|---|---|---|
| 1 | o leitor de pista passa a aceitar o esquema 3 e a Kart Park entra no bundle (DES-0001, DM-0001, ADR-0001, ADR-0002) | o `index.html` novo referencia o JS do build, que carrega os dois arquivos de pista (Kart Park e sintética); nenhum dado é convertido, gravado ou lido | entregue nas rodadas anteriores; mantida | 0 s | republicar o bundle anterior (caminho B do `runbook.md`) | caminho B ensaiado em staging em 2026-10-27 19:29–19:33Z (≈ 1 min 17 s de reversão, ≈ 2 min 12 s de restauração); caminho C1 da revisão 2 ensaiado em 2026-11-04 (`deploy-validation-20261104-1302.md`) |
| 2 | a Kart Park como versão publicada e imutável no registro (DM-0002, DES-0011; NFR-0006) | `tracks/registry.json` com a entrada `kart-park` 1 em `STAGING`; `publish` de novo → `já registrado`; outro conteúdo com o mesmo par → recusado | entregue; mantida | 0 s | **não se reverte uma versão publicada**: uma correção é a versão seguinte (I3; REQ-FEAT-0002-18) — é o que a revisão 3 faz | CHK-TEST-0012-01..03; CHK-TEST-0012-09 (as duas versões e a réplica intactas) |
| 3 | **revisão 3 do seed: `kart-park` versão 2 a partir da réplica** (DM-0001 2.0.1, *Plano de migração*; DM-0002 2.0.1; ADR-0008) | acrescenta `src/tracks/kart-park-v2.json`, `tracks/sources/kart-park-replica.json` e a entrada `kart-park` 2 do registro (`STAGING`, `REPLICA`); a entrada do catálogo passa a declarar `trackVersion` 2 com o nome e o comprimento da réplica, e a aplicação passa a empacotar a versão 2 no lugar da 1; **nenhum arquivo existente é reescrito** e não há mudança de esquema | única; aplicada no mesmo passo em que o bundle de `3d5dfdd` é publicado (feito: execução 42320960893, 2026-11-06) | 0 s de indisponibilidade: não há dado armazenado a converter | **em staging, operacional**: republicar o candidato anterior — caminho B, *Re-run all jobs* da execução 41832829595 (`1966c4a`, árvore de `2aa013e`, `index-BMmvlQeM.js`, Kart Park versão 1 com o acabamento); o registro no repositório não muda, e não precisa (não entra no bundle). **Em código** (caminho C1, quando B não existir): a reversão de DM-0001 2.0.1 — uma mudança de código, **não um `git revert`** dos commits da revisão 3, que devolve ao estado anterior só a entrada `kart-park` do catálogo em `src/trainingSession.ts` (sem `trackVersion`, nome e comprimento da versão 1) e a importação de `src/main.ts` (`./tracks/kart-park-v1.json?raw`); `src/tracks/kart-park-v2.json`, a réplica e a entrada `kart-park` 2 ficam intactos (I3; API-0001, Compatibilidade; REQ-FEAT-0002-17, -18); depois `npm test`, `npm run build` e a republicação em staging | caminho B: o **procedimento** é o de 2026-10-27, não repetido para o par 41832829595 ↔ 42320960893 (`98-divergences.md`, DIV-DP-03); o alvo é verde, retido e validado (`deploy-validation-20261104-1302.md`, `-1340.md`). Caminho C1: **não ensaiado**. A parte automática do "Teste da reversão" de DM-0001/DM-0002 que já existe é CHK-TEST-0012-09 (os arquivos que a reversão mantém continuam com os resumos registrados); uma árvore revertida reprovaria as verificações da revisão 3 que afirmam a versão 2 no catálogo, no rótulo e na importação (CHK-TEST-0007-11, -12, -13; CHK-TEST-0009-05, -06, -13), por isso C1 é uma rodada de código e de testes, não um comando |
| 4 | **promoção a `PRODUCTION`** (DES-0011; ADR-0005; NFR-0012) — **não faz parte desta release** | `npm run track -- promote kart-park 2 --esri-decision "<referência>"` gravaria `PRODUCTION`, `promotedAtUtc` e `esriDecisionRef`; sem a referência: recusa com código 1 e nada escrito (CHK-TEST-0012-04) | **só na entrega que promover**, depois da decisão Esri registrada em `DOMAIN.md`; é um commit próprio (o registro muda) | 1 s | não se aplica a esta release (não executada); naquela entrega, "`PRODUCTION` repetido: nada" e a volta a `STAGING` não existe por projeto — a reversão de produção é a do bundle | — |

Não há revisão de dado persistido. Nenhuma versão em execução recebe um dado que não entenda: o bundle anterior (versão 1) nunca
recebe o arquivo da versão 2 (não há rede; cada bundle traz o seu literal), e o bundle novo lê o esquema 2 da sintética com o
caminho antigo (CHK-TEST-0002-*; CHK-TEST-0009-02 de `race-lap-validation`).

## Preenchimento retroativo (backfill)

Nenhum: não existe registro persistido a preencher, e nenhum resultado de volta da versão 1 está gravado (DM-0001 2.0.1,
*Preenchimento retroativo*). Não há, portanto, lote, idempotência, progresso ou interrupção a declarar. O único "preenchimento" é
o preparo offline da réplica (`prepare` → `verify` → `publish` de `kart-park` 2), já executado em `06582f8`, determinístico (a
réplica reproduz `kart-park-v2.json` byte a byte — `code-validation-20261106-1912.md`) e fora do caminho de publicação.

## Formatos publicados para os próximos dias (D-DP-01)

A regra que esta release mantém em vigor: **uma versão publicada de pista nunca é editada no lugar** (NFR-0006; REQ-FEAT-0002-18) —
a réplica entrou como `kart-park` **2**, com o seu próprio `prepare`/`verify`/`publish`, ao lado da 1, e o catálogo declara a
versão que carrega (ADR-0008). Uma terceira versão seguirá o mesmo caminho (arquivo novo, entrada nova, catálogo com o
`trackVersion` novo, a importação trocada; as anteriores ficam). A sintética continua `synthetic` v2, intacta. Os acertos
publicados são os de `dirigibilidade`, que esta feature não altera. Os bytes de toda versão publicada são os do blob no git (regra
byte-exata), nunca os da árvore de trabalho. Um leitor futuro de esquema 4 mantém o 3 e o 2 (I3, I5).

**A versão 1 continua publicada e verificável** pelo resumo `04ce5e51…` (CHK-TEST-0012-09), mas não é jogável: nenhuma opção do
catálogo a carrega e nenhum pacote a contém. A promoção da Kart Park, quando houver decisão, é a da versão 2.

## Dado persistido do jogador (I5)

A feature não usa `localStorage`, `sessionStorage`, IndexedDB nem cookie. Qualquer dado que outra parte do produto venha a
gravar no navegador **não é lido, convertido nem apagado** por esta release.

## Janela de compatibilidade

Uma única versão do cliente roda por vez: a página servida pelo Pages. A janela que existe é a do **cache do navegador**
(`max-age=600`, `REL-0003`): um jogador com o `index.html` anterior em cache continua a correr o bundle anterior
(`index-BMmvlQeM.js`, a Kart Park versão 1 com o acabamento) até buscar o `index.html` novo. Como nada é persistido nem trocado
com servidor, as duas versões coexistem sem conflito; uma volta na versão 1 e uma na versão 2 não são comparáveis, mas nenhuma
é gravada e cada `LapResult` carrega o `trackVersion` da sua sessão (ADR-0008, Consequências).
