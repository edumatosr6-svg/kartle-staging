---
title: Release — pista Kart Park (staging; produção bloqueada pela decisão Esri)
feature: pista-kart-park
stage: deploy
status: draft
version: 2.0.0
sources: [DM-0001, DM-0002, DES-0001, DES-0002, DES-0003, DES-0004, DES-0005, DES-0006, DES-0007, DES-0008, DES-0009, DES-0010, DES-0011, DES-0012, ADR-0001, ADR-0002, ADR-0003, ADR-0004, ADR-0005, ADR-0006, ADR-0007, ADR-0008, NFR-0001, NFR-0002, NFR-0003, NFR-0004, NFR-0005, NFR-0006, NFR-0007, NFR-0008, NFR-0009, NFR-0010, NFR-0011, NFR-0012, NFR-0013, NFR-0014, US-0007, TEST-0001, TEST-0002, TEST-0005, TEST-0007, TEST-0008, TEST-0009, TEST-0010, TEST-0012]
---

# 01 — Release

Candidato a release da feature `pista-kart-park`: a **Kart Park** (São José dos Pinhais, PR) como primeira pista real do Kartle,
jogável no **treino** ao lado da pista sintética. Desde a **revisão 3 do seed** (digest `1fe5243f7e36`) a Kart Park jogável é a
**réplica não oficial**, publicada como `kart-park` **versão 2** no mesmo esquema 3 (ADR-0008): `src/tracks/kart-park-v2.json`,
36 585 bytes, SHA-256 `c79f14cbd49f3a7f19d2d1b50d14512b02525f6af7ecaaf850959c1395c4d20a`, 691 pontos sem nova suavização,
largura fixa de 7 m, 690,674 m medidos, rótulo "691 m", 39 marcadores, 22 zebras de 1,0 m, 1 barreira de 292 vértices, 3 limites
de setor, preparada da réplica `tracks/sources/kart-park-replica.json` (`prep.method` `REPLICA`). Continuam o **seletor de pista**
da tela inicial, que abre sempre na Kart Park; o **crédito OpenStreetMap/ODbL** com link no seletor e no painel do resultado de
cada volta do treino (ADR-0007; a réplica é derivada da versão 1, por isso `osmDerived` continua verdadeiro); a **zebra como
superfície** (aderência 0,85 do asfalto, vibração de 20 ms a cada 0,25 s no celular, ruído grave a 160 Hz no teclado com o som
ligado); a **barreira** com resposta de muro; o **acabamento visual** da revisão 2 (US-0007), agora desenhado sobre a versão 2; e
o preparo offline com o registro de publicação (`npm run track`).

**O que mudou nesta rodada (revisão 3, 2026-11-09).** O candidato passa de **`2aa013e`** (seed revisão 2, validado em staging em
`deploy-validation-20261104-1340.md`, `SUCCESS`) a **`3d5dfdd`**, já publicado em staging pela execução **42320960893**. Entre os
dois, a árvore construída muda só em:

- código **`06582f8`** (validação `400 Code/Output/pista-kart-park/reports/code-validation/code-validation-20261106-1912.md`,
  `SUCCESS`): `src/tracks/kart-park-v2.json` novo; `src/trainingSession.ts` — a entrada `kart-park` do catálogo declara
  `trackVersion` 2, nome "Kart Park — São José dos Pinhais (réplica não oficial)", `displayLengthM` 691, e a seleção de um arquivo
  com outra versão dá `FAILED` com `TRACK_VERSION_MISMATCH`; `src/main.ts` — importa `./tracks/kart-park-v2.json?raw` no lugar da
  versão 1 e avisa `track-data TRACK_VERSION_MISMATCH` no console quando a conferência falha. Fora do bundle: `scripts/trackPrep.ts`,
  `scripts/trackChecks.ts` (V01–V20, V19 e V20 novas), `scripts/track-pipeline.ts` (preparo da réplica; `prepare`/`verify`/`publish`
  recusados para `kart-park` 1), `tracks/registry.json` (entrada `kart-park` 2 em `STAGING`), `tracks/sources/kart-park-replica.json`;
- testes **`671d125`** (validação `500 Tests/Output/pista-kart-park/reports/test-validation/test-validation-20261107-0052.md`,
  `SUCCESS`, seed revisão 3): 11 verificações novas, 41 migradas para a versão 2 e 1 retirada (CHK-TEST-0005-06, o atalho da curva
  4 que não existe na réplica — retirada aprovada pelo dono do produto em 2026-11-06, `596e964`); 136 da feature; suíte **477/477**;
- registros `596e964` e `3d5dfdd` (só Markdown de `200 Requirements/220 Input/` e `500 Tests/Output/`).

Nada mais muda na árvore construída: `index.html`, `src/style.css`, `package.json`, `package-lock.json`, `tsconfig.json`,
`.github/`, `.nvmrc` e `.gitattributes` são os de `2aa013e` (`git diff --stat 2aa013e 3d5dfdd -- …` vazio). **A versão 1 fica
publicada e intacta, fora do pacote** (ADR-0008, decisão 4): `src/tracks/kart-park-v1.json` (43 013 bytes, `04ce5e51…`) e
`tracks/sources/kart-park.json` são os mesmos blobs de `2aa013e`, a entrada `kart-park` 1 do registro não muda, e o JS servido não
contém o literal da versão 1 nem os textos dela ("traçado aproximado", "687 m").

O treino é uma **sequência de voltas numa sessão** (`race-lap-validation`); o acerto publicado é `arcade-assistido-v6` sem drift
nem turbo (`dirigibilidade`) e o Kart 01 tem marcas de pneu (`modelo-kart-01`). O que se entrega é o mesmo tipo de artefato das
releases anteriores: um **artefato estático** (`dist/`, HTML + JS + CSS) servido pelo **GitHub Pages** com HTTPS (D23); **não há
servidor, banco, serviço, migração de dado, armazenamento no navegador nem aplicativo nativo** — o arquivo de pista vai **dentro
do JS** como literal (ADR-0002), e nenhuma textura, imagem nem *asset* é acrescentado (NFR-0010).

**O que esta release não faz: ir a produção.** A Kart Park é derivada de um caminho OpenStreetMap e de bordas detectadas em
imagem **Esri World Imagery**, e a réplica é derivada da versão 1: o dono do produto registrou em 2026-11-06 que **a licença Esri
(o ponto Esri) continua valendo para ela** (`200 Requirements/220 Input/pista-kart-park/DOMAIN.md`). Em 2026-11-03 decidiu que o
ponto Esri continua aberto, que a Kart Park segue **só em staging** e que a produção **espera a decisão** (opção 1 de *Promoção
bloqueada* (b) do `runbook.md`): as quatro features (`race-lap-validation`, `dirigibilidade`, `modelo-kart-01`, `pista-kart-park`)
chegam a produção **juntas**, e **nenhum commit de `master` é enviado a `origin`** até lá (NFR-0012; ADR-0005).
`tracks/registry.json` mantém as entradas `kart-park` 1 e 2 em `STAGING`; `npm run track -- promote` recusa sem
`--esri-decision` (CHK-TEST-0012-04). O `runbook.md` termina, por isso, **antes** da pergunta de promoção.

## O que é entregue

| Item | Conteúdo | Fonte |
|---|---|---|
| Canais | `web-desktop` e `web-mobile` — a mesma página, com teclado no computador (som da zebra) e inclinação ou toque no celular (vibração da zebra); paisagem e retrato; o mesmo acabamento nos dois canais (US-0007, *Canais*) | diretivas do estágio; `REL-0004` |
| Arquivos de origem desta feature | os das rodadas anteriores (`src/trackGeometry.ts`, `src/trainingSession.ts`, `src/curbFeedback.ts`, `src/trackScene.ts`, `src/rawImports.d.ts`, `src/tracks/kart-park-v1.json`, `scripts/trackPrep.ts`, `scripts/trackChecks.ts`, `scripts/track-pipeline.ts`, `tracks/sources/kart-park.json`, `tracks/registry.json`; alterados `src/trackData.ts`, `src/physics.ts`, `src/lap.ts`, `src/lapMessages.ts`, `src/audio.ts`, `src/main.ts`, `index.html`, `src/style.css`, `package.json`; `.gitattributes`); **revisão 3** (`06582f8`): `src/tracks/kart-park-v2.json` e `tracks/sources/kart-park-replica.json` novos; `src/trainingSession.ts`, `src/main.ts`, os três `scripts/` e `tracks/registry.json` alterados; `tests/pista-kart-park-*.test.ts` (12 suítes, 136 verificações) em `671d125` | `400 Code/Output/pista-kart-park/`; `500 Tests/Output/pista-kart-park/` |
| Contido no mesmo build, de outras features | o treino de voltas seguidas (`race-lap-validation`); `arcade-assistido-v6` sem drift nem turbo (`dirigibilidade`); marcas de pneu e câmera sem turbo (`modelo-kart-01`). Cada uma tem o seu registro de release, hoje nomeando `2aa013e` — que o envio de `3d5dfdd` (muda `src/`) deixou atrás do servido (`98-divergences.md`, DIV-DP-12) | registros de release dessas features |
| Inalterados contra `2aa013e` | `index.html`, `src/style.css` (o CSS servido tem o mesmo nome e os mesmos bytes, `index-q-biCwua.css`), `.github/workflows/pages.yml`, `.nvmrc`, `package.json`, `package-lock.json`, `tsconfig.json`, `.gitattributes`, `src/tracks/kart-park-v1.json`, `tracks/sources/kart-park.json`; dependências de execução: **nenhuma acrescentada** (`three` continua a única — NFR-0010) | `git diff --stat 2aa013e 3d5dfdd` |
| Formato publicado | **o arquivo de pista em esquema 3**, sem mudança de esquema, com o leitor das versões 2 e 3 de esquema mantido; `kart-park` **versão 2**, imutável, SHA-256 `c79f14cb…` em `tracks/registry.json` (NFR-0006), a única empacotada; `kart-park` **versão 1** continua publicada e imutável (`04ce5e51…`), fora do pacote (ADR-0008) | DM-0001, DM-0002 2.0.1, ADR-0001, ADR-0008; `REL-0002` |
| Formato persistido | **nenhum**: a pista escolhida não é gravada nem lida no navegador; nenhuma volta de treino cria registro de desafio (DES-0012; CHK-TEST-0011-02); como nada é gravado, nenhum resultado da versão 1 fica a migrar (ADR-0008, Consequências) | DES-0012; `REL-0002` |
| Feature flag | **nenhuma** (ADR-0005). O ponto de aplicação da "chave mestra" de I4 é a **promoção**: humano, registrado em `tracks/registry.json` e bloqueado pela decisão Esri. A versão jogável é escolhida pelo catálogo em código (`trackVersion` 2), não por chave | ADR-0005, ADR-0008, DES-0011 |
| Variáveis de ambiente | nenhuma lida pelo cliente, pelo preparo offline ou pelo workflow | `REL-0001` |
| O que o jogador vê | o seletor com a Kart Park marcada e o rótulo **"Kart Park — São José dos Pinhais (réplica não oficial) · 691 m"**, o crédito OSM com link, o treino de voltas seguidas com o crédito no painel do resultado de cada volta, a zebra com vibração e som, a barreira que não deixa passar, nenhum recorde; na Kart Park, o **traçado da réplica** (retas e arcos, asfalto de largura constante de 7 m, 22 zebras por regra) com o acabamento de US-0007 (faixa de borda branca, zebras com relevo, barreira de pneus pretos, grama em faixas de 2 tons). **Na sintética, nada muda** (AC-US-0007-16) | DES-0005, DES-0007, DES-0008, DES-0009, ADR-0007, ADR-0008; US-0007; `REL-0003` |

## Proveniência — o commit que a release nomeia

| Fato | Estado em 2026-11-09 |
|---|---|
| D-Spec | `validated` — `300 Specs/330 D-Specs/Output/pista-kart-park/reports/dspec-validation/` (`dspec-validation-20261106-1853.md`, `SUCCESS`, `8b00b74`): ADR-0008 (versão 2 a partir da réplica, versão 1 fora do pacote), DM-0001 e DM-0002 2.0.1 com o plano de reversão da revisão 3 (`REL-0002`) |
| Validação de código | `SUCCESS` — `code-validation-20261106-1912.md` (seed revisão 3): `06582f8` (2026-11-06T16:13:00 −03:00); recalculado pelo validador: `npm run track -- verify kart-park 2` V01–V20 `PASS`, `VERIFIED`; os quatro SHA-256 (as duas versões e as duas origens) iguais ao registro; a réplica reproduz `kart-park-v2.json` byte a byte; nenhum import de `kart-park-v1` em `src/` |
| Veredito de testes | `SUCCESS` — `500 Tests/Output/pista-kart-park/reports/test-validation/test-validation-20261107-0052.md` (`seed: {revision: 3, digest: 1fe5243f7e36}`): **477/477**, 136 desta feature (11 novas, 41 migradas, 1 retirada com aprovação registrada), execução fresca; as 29 linhas de tela e aparelho ficam `unverified` até E2E-01..E2E-09 sobre o pacote da versão 2 (linhas humanas, abaixo) |
| Commit verificado (`<sha>`) | **`3d5dfdd5fdf7526b1536c78cbb62d3aa7707e91f`** (curto `3d5dfdd`), 2026-11-06T21:53:24 −03:00, "pista-kart-park: testes da revisão 3 marcados validated …", ponta de `master`. A árvore da aplicação é a das suítes verificadas (`671d125`): `596e964` e `3d5dfdd` mudam só Markdown (`git diff --name-only 671d125 3d5dfdd`: `DOMAIN.md` e `500 Tests/Output/pista-kart-park/`). Contra `2aa013e` muda, na árvore construída, só `src/main.ts`, `src/trainingSession.ts` e `src/tracks/kart-park-v2.json`. `2aa013e` é ancestral (`git merge-base --is-ancestor`); cadeia (NFR-0011): `b86b200` e `6ea3862` continuam ancestrais |
| Construído pelo pipeline | **sim**: execução **42320960893** de `edumatosr6-svg/kartle-staging` (evento `push` de `3d5dfdd`, tentativa 1, `success`; criada 2026-11-07T00:53:37Z; `build` 00:53:39–00:55:10Z, `deploy` 00:55:13–00:55:22Z; ramo `staging` = `3d5dfdd` por `git ls-remote`). Do log, reduzido por script: Node v24.22.2; *Test* `tests 477 / pass 477 / fail 0 / skipped 0`; *Build* `index-DszUW7WJ.js 690.59 kB`, `index-q-biCwua.css 10.85 kB`; *Measure dist* `files=3 total_bytes=708040 gzip_bytes=186379 within_limit=True ratio=0.225`. O envio foi o *Promote* 7 do `runbook.md` (`git push staging master:staging` com `master` = `3d5dfdd`), feito em 2026-11-06 às 21:53 −03:00 |
| Build limpo local (referência para o servido) | `MSYS_NO_PATHCONV=1 npx vite build --base=/kartle-staging/ --outDir <pasta temporária>` sobre a árvore limpa de `3d5dfdd` (2026-11-09): `assets/index-DszUW7WJ.js` 690 598 bytes (sha256 `282419aab4b20d2b…`), `assets/index-q-biCwua.css` 10 850 bytes (`5e1c964b3b292f33…`, o mesmo de `2aa013e`), `index.html` 6 592 bytes (`36e5e39cd548a309…`) — **os três byte a byte iguais ao servido** (`cmp`, GET de 2026-11-09); `measure_dist.py` local: `files=3 total_bytes=708040 gzip_bytes=186791 within_limit=True ratio=0.225` (o gzip difere dos 186 379 do *Measure dist* da execução só pela zlib — Windows contra Linux; os bytes brutos são os mesmos); `check_bundle.py <build> tracks/registry.json`: **`checks=94 failed=0`**, `track_bytes=36584`, `track_sha256=c79f14cb…`; `npm run track -- verify kart-park 2`: V01–V20 `PASS`, `VERIFIED`; `verify kart-park 1`: "recusado: kart-park 1 é versão publicada e congelada", saída 1, nada escrito (ADR-0008, decisão 5) |
| Servido em staging hoje | **o candidato `3d5dfdd`**: `https://edumatosr6-svg.github.io/kartle-staging/` (GET de 2026-11-09) responde 200 com `Last-Modified: Sat, 07 Nov 2026 00:55:17 GMT` e `Cache-Control: max-age=600`, e serve `index.html` → `assets/index-DszUW7WJ.js` e `assets/index-q-biCwua.css` pela execução **42320960893**; o JS contém "réplica não oficial", o literal com `trackVersion` 2 uma vez e `TRACK_VERSION_MISMATCH`; `check_served.py … index-DszUW7WJ.js` → `checks=84 failed=0` (`track_sha256=c79f14cb…`). **A validação de staging desta rodada está por fazer** (o validador reprova ou confirma estes números). A anterior, 41832829595 (`1966c4a`, árvore de `2aa013e`, `index-BMmvlQeM.js`), é o alvo do caminho B |
| Arquivo da Kart Park = registro | **sim**: o literal no JS dá SHA-256 + LF `c79f14cbd49f3a7f19d2d1b50d14512b02525f6af7ecaaf850959c1395c4d20a` = `tracks/registry.json` entrada `kart-park` 2 (`fileBytes` 36 585, `STAGING`, `stagedAtUtc` 2026-11-06T18:58:23.192Z, `prep.method` `REPLICA`, `prep.originSha256` `eba665b6…`, sem `promotedAtUtc`/`esriDecisionRef`); a entrada 1 (`04ce5e51…`, 43 013 bytes, `STAGING`) igual à de `2aa013e` (NFR-0014; CHK-TEST-0012-09) |
| Regra byte-exata dos arquivos de pista | agora **cinco** arquivos: `git ls-files --eol tracks/sources/kart-park.json tracks/sources/kart-park-replica.json src/tracks/kart-park-v1.json src/tracks/kart-park-v2.json tracks/registry.json` → `attr/-text` nas cinco, `i/crlf w/crlf` nas duas origens, `i/lf w/lf` nas outras três (conferido em 2026-11-09) — `runbook.md`, *Promote* 1 |
| Regra de invalidação do `<sha>` | um commit posterior **não invalida** a release quando não muda a árvore construída (`src/`, `index.html`, `package.json`, `package-lock.json`, `tsconfig.json`, `vite.config.*`) nem os **bytes** dos cinco arquivos de pista, **desde que** a execução do workflow desse commit fique verde e `check_served.py` dê o mesmo resultado sobre o mesmo `<hash>`; qualquer outro commit invalida e pede veredito de testes novo e nova rodada deste estágio |
| Produção | `https://edumatosr6-svg.github.io/kartle/` responde **404** (GET de 2026-11-09); `origin/master` = **`05c3570`** (2026-10-22); a execução 39827702391 continua `waiting` e nada foi aprovado. **Não promovível**: ponto Esri aberto (decisões de 2026-11-03 e 2026-11-06) — `runbook.md`, *Promoção bloqueada* |
| Tag de release | não existe; a release é identificada pelo hash acima e pelo número da execução que o publicou (42320960893) |
| Sistema de CI | **GitHub Actions**, `.github/workflows/pages.yml` (inalterado): `npm ci` → `npm test` (477) → `npm run build -- --base=/<repo>/` → `measure_dist.py` (RNF02) → `upload-pages-artifact` → `deploy-pages`; etapas em `REL-0003` |
| Alvo de reversão em staging | a execução anterior à em vigor, **41832829595** (`1966c4a`, árvore de `2aa013e`, `index-BMmvlQeM.js`, `success`, 2026-11-04, retida até cerca de 2027-02-02): o candidato anterior — a Kart Park **versão 1** com o acabamento, o mesmo treino e o mesmo crédito —, validado em `deploy-validation-20261104-1302.md` e `-1340.md`. Antes dela: 41156803005 (`1bb63aa`, árvore de `e70aad9`, `index-DmxsQuIL.js`, versão 1 sem o acabamento). Em código, a reversão da revisão 3 é a de DM-0001 2.0.1 (o catálogo e a importação voltam à versão 1; os arquivos da versão 2 e a entrada 2 ficam) — caminho C1 do `runbook.md`, não ensaiado. Em produção não há execução verde (caminho A, nada a despublicar) |

### Precondições humanas que restam, em ordem

1. **Publicar `3d5dfdd` em staging** — feito em 2026-11-06 (21:53 −03:00): execução 42320960893, `check_served … index-DszUW7WJ.js`
   `checks=84 failed=0`.
2. **Validação de staging pelo validador** sobre a execução 42320960893 — por fazer (rodada 1 do deploy-loop da revisão 3).
3. **Registrar em `docs/kart-park-device-log.md`** (existe desde `1bb63aa`, com a execução no celular de 2026-10-30 sobre
   `e70aad9`, parcial) uma entrada nova sobre o build de `3d5dfdd` (`index-DszUW7WJ.js`): as **linhas humanas H1–H12**
   (`runbook.md`; E2E-01..E2E-09 sobre o pacote da versão 2 — `test-validation-20261107-0052.md`, ISSUE-05), inclusive o rótulo
   "(réplica não oficial) · 691 m", o traçado da réplica com o acabamento nos dois canais e a taxa de quadros com ele (H11,
   NFR-0002: 60 fps no notebook e 30 fps no celular em paisagem e retrato). Nenhuma entrada existe sobre `2aa013e` nem sobre
   `3d5dfdd`.
4. **A decisão Esri**, registrada em `DOMAIN.md` com identificador e data. Continua aberta (2026-11-03) e vale para a versão 2
   (2026-11-06). Sem a decisão não há pergunta de promoção (NFR-0012); com ela, a promoção é de uma **entrega nova** que acrescenta
   o crédito da Esri (REQ-FEAT-0006-14; DES-0011) e grava `PRODUCTION` na entrada `kart-park` 2 do registro.
5. **As releases contidas passam a nomear o mesmo build** (DIV-DP-12): o envio de `3d5dfdd` mudou `src/`, o que, pela regra de
   invalidação de cada uma, deixou os registros de `race-lap-validation`, `dirigibilidade` e `modelo-kart-01` (que nomeiam
   `2aa013e`) atrás do servido. Esta rodada envia um feedback a cada um (`600 Deploy/Output/<feature>/reports/feedbacks/pista-kart-park/`);
   cada um decide na sua própria rodada.

Cumpridas: o D-Spec, a validação de código e o veredito de testes da revisão 3 (`SUCCESS`); o build limpo local com
`check_bundle` 94/94 e o arquivo da Kart Park igual ao registrado; o envio a staging (42320960893) com o servido = build limpo
byte a byte; a versão 1 intacta e fora do pacote; a regra byte-exata em vigor nos cinco arquivos; as duas entradas do registro em
`STAGING`; o Node fixado (`.nvmrc` = `24`); os dois repositórios configurados (D23); a escolha da opção 1 registrada (DIV-DP-15).

## Reprodução do build

O workflow executa estes passos a cada push; à mão, da raiz do repositório, com caminhos entre aspas:

| Passo | Comando | Resultado esperado |
|---|---|---|
| 1 | `git ls-files --eol tracks/sources/kart-park.json tracks/sources/kart-park-replica.json src/tracks/kart-park-v1.json src/tracks/kart-park-v2.json tracks/registry.json` | `attr/-text` nas cinco; `i/crlf w/crlf` nas duas origens, `i/lf w/lf` nas outras três |
| 2 | `npm ci` | saída 0; `package-lock.json` inalterado |
| 3 | `npm test` | saída 0; **477** aprovados, 0 reprovados, 0 pulados (136 desta feature) |
| 4 | `npm run track -- verify kart-park 2` | `VERIFIED`, V01 a V20 `PASS` (leitura; nada escrito). `verify kart-park 1` recusa por projeto (versão congelada) |
| 5 | `npm run build` (no workflow, `-- --base=/kartle/` ou `/kartle-staging/`; no Git Bash, à mão, `MSYS_NO_PATHCONV=1 npx vite build --base=/kartle-staging/`) | saída 0; `dist/index.html`, `dist/assets/index-DszUW7WJ.js`, `dist/assets/index-q-biCwua.css`; nenhum outro arquivo em `dist/assets/` |
| 6 | `python -I "600 Deploy/Output/race-lap-validation/tools/measure_dist.py" dist` | `total_bytes=708040 within_limit=True`; saída 0 |
| 7 | `python -I "600 Deploy/Output/pista-kart-park/tools/check_bundle.py" dist tracks/registry.json` | `checks=94 failed=0` |
| 8 | `npm run preview` | `http://127.0.0.1:4173` serve o bundle; abre na Kart Park "(réplica não oficial) · 691 m" com o seletor e o crédito; "volta de treino" inicia a contagem sobre o asfalto da réplica, com faixa de borda, zebras com relevo, pneus e grama em faixas |

### Medida do artefato (build limpo local de `3d5dfdd` = servido pela execução 42320960893, base `/kartle-staging/`)

| Arquivo | bytes | gzip bytes |
|---|---:|---:|
| `assets/index-DszUW7WJ.js` | 690 598 | 181 149 |
| `assets/index-q-biCwua.css` | 10 850 | 3 049 |
| `index.html` | 6 592 | 2 593 |
| **total** (`measure_dist.py` local) | **708 040** | **186 791** (*Measure dist* da execução 42320960893: **186 379**) |

- Limite de RNF02 (download inicial abaixo de 3 145 728 bytes): **708 040 bytes brutos (22,5 % do limite)**, igual ao
  `total_bytes` do *Measure dist* da execução; 186 379 comprimidos no workflow (5,9 %). Contra o servido de `2aa013e` (714 001
  bytes; 189 539 gzip no workflow): **−5 961 bytes** brutos, todos no JS — o literal da versão 2 (36 584) é menor que o da
  versão 1 (43 012); o CSS e o `index.html` têm os mesmos bytes.
- O arquivo da Kart Park no bundle: **36 584 bytes** (o arquivo tem 36 585 com o `\n` final; o literal `?raw` omite-o) — NFR-0001
  pede abaixo de 200 000; `SHA-256(literal + "\n")` = `c79f14cb…` = o registrado (NFR-0006).

## O que o pipeline faz (`.github/workflows/pages.yml`)

Inalterado. Em ordem, com saída observável na execução do Actions: checkout do commit → Node da `.nvmrc` (24) com cache do npm →
`npm ci` → `npm test` (477 aprovados; inclui V01–V20 sobre o arquivo publicado da versão 2 e a réplica, os resumos registrados das
duas versões e das duas origens contra os bytes do blob, a prova de que a versão 1 continua intacta e fora do pacote, a conferência
de versão do catálogo, o crédito no painel do resultado, a prova de que `promote` recusa sem `--esri-decision`, as medidas do
acabamento na cena construída em Node sobre a versão 2) → `npm run build -- --base=/kartle/` (ou `/kartle-staging/`) →
`measure_dist.py dist` (saída 0) → `configure-pages` → `upload-pages-artifact` de `dist/` → trabalho `deploy` no ambiente
`github-pages`. Em produção o `deploy` **espera a aprovação do revisor obrigatório** (D-DP-06) — e nesta release **a aprovação
não pode ser dada** antes da decisão Esri; em staging publica de imediato. Permissões mínimas, nenhum segredo (I6). As ferramentas
desta release (`tools/check_bundle.py`, `tools/check_served.py`, atualizadas nesta rodada para a versão 2) são executadas por quem
valida e pelo runbook, não pelo workflow (`98-divergences.md`, DIV-DP-05).

## Limitações conhecidas — divergências aceitas e herdadas

- As divergências aceitas pelo dono do produto em 2026-10-21 continuam válidas: o `href="/"` da marca e a requisição a
  `fonts.googleapis.com` no carregamento (DIV-DP-09, DIV-DP-10, `waived`).
- O crédito da **Esri** não está no bundle (0 ocorrências de `esri`), por projeto: entra na entrega que promover, se a decisão o
  liberar (NFR-0012, segunda linha; REQ-FEAT-0006-14).
- As ferramentas `check_served.py` e `check_bundle.py` conferem o arquivo da versão 2, a ausência da versão 1, o rótulo, a
  conferência de versão, o crédito e o resto do empacotamento; **não conferem o acabamento** (nenhuma linha para faixa, relevo,
  pneus ou tons): esse é provado em `npm test` (CHK-TEST-0010-*) e pela tela (H9–H12). Sobre o bundle anterior
  (`index-BMmvlQeM.js`, versão 1), as ferramentas desta versão reprovam por projeto; a conferência do alvo do caminho B usa as
  ferramentas da árvore dele (`runbook.md`, R2).
- O critério AC-US-0001-09 (a versão 1 recusada pelo catálogo) não tem roteiro de tela: o pacote não contém a versão 1, por isso
  só `npm test` o decide (`test-strategy.md`).
- Taxa de quadros, vibração, som, a legibilidade do crédito no painel e o aspecto do acabamento **sobre o traçado da réplica** não
  foram medidos em nenhum aparelho nomeado. São as linhas H1–H12 do `runbook.md`. A execução no celular de 2026-10-30
  (`docs/kart-park-device-log.md`) é de `e70aad9` (versão 1, sem o acabamento) e sem medida de fps.
- Staging serve, no mesmo bundle, as mudanças de `race-lap-validation`, `dirigibilidade` e `modelo-kart-01`, cujas portas
  humanas são dos registros delas (`98-divergences.md`, DIV-DP-12).
