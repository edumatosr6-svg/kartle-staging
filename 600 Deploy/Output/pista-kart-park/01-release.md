---
title: Release — pista Kart Park (staging; produção bloqueada pela decisão Esri)
feature: pista-kart-park
stage: deploy
status: draft
version: 1.4.0
sources: [DM-0001, DM-0002, DES-0001, DES-0002, DES-0003, DES-0004, DES-0005, DES-0006, DES-0007, DES-0008, DES-0009, DES-0010, DES-0011, DES-0012, ADR-0001, ADR-0002, ADR-0003, ADR-0004, ADR-0005, ADR-0006, ADR-0007, NFR-0001, NFR-0002, NFR-0003, NFR-0004, NFR-0005, NFR-0006, NFR-0007, NFR-0008, NFR-0009, NFR-0010, NFR-0011, NFR-0012, NFR-0013, NFR-0014, US-0007, TEST-0001, TEST-0007, TEST-0008, TEST-0009, TEST-0010, TEST-0012]
---

# 01 — Release

Candidato a release da feature `pista-kart-park`: a **Kart Park** (São José dos Pinhais, PR) como primeira pista real do Kartle,
jogável no **treino** ao lado da pista sintética — arquivo de pista em **esquema 3** (`src/tracks/kart-park-v1.json`, 43 013
bytes, 684 pontos, linha central suavizada com janela de 12 m a até 0,30 m da origem, 682,116 m medidos, rótulo "687 m",
38 marcadores, 34 zebras de 1,0 m, 1 barreira de 382 vértices, 3 limites de setor); o **seletor de pista** da tela inicial, que
abre sempre na Kart Park; o **crédito OpenStreetMap/ODbL** com link no seletor e no painel do resultado de cada volta do treino
(ADR-0007); a **zebra como superfície** (aderência 0,85 do asfalto, vibração de 20 ms a cada 0,25 s no celular, ruído grave a
160 Hz no teclado com o som ligado); a **barreira** com resposta de muro; o preparo offline e o registro de publicação
(`npm run track`); e, desde a revisão 2 do seed, o **acabamento visual** da Kart Park (US-0007).

**O que mudou na rodada 4 (Modo B/revisão, 2026-11-03).** O candidato passou de **`e70aad9`** (validado em staging,
`deploy-validation-20261103-1744.md`, `SUCCESS`) a **`2aa013e`**, publicado em staging em 2026-11-04 pela execução **41832829595**
(commit `1966c4a`, só registros acima de `2aa013e`) e validado em `deploy-validation-20261104-1302.md` (`SUCCESS`). A rodada 5
(Modo B, 2026-11-04) põe o registro no estado depois do envio. Entre `e70aad9` e `2aa013e`, a árvore construída muda só
no **desenho** (seed revisão 2, *acabamento visual*; US-0007, FEAT-0008, DES-0008 2.1.0):

- código **`fbfb073`** (validação `400 Code/Output/pista-kart-park/reports/code-validation/code-validation-20261103-2004.md`,
  `SUCCESS`): `src/trackScene.ts` (+162/−17) — **grama em faixas** de 2 tons (`GRASS_TONES`, `grassToneAt`, determinística pela
  posição no mundo), **faixa de borda** branca de 0,10 m por dentro do asfalto nas duas bordas (`edge-lines`), **zebra com
  relevo** (0 m do lado do asfalto, 0,04 m por fora), **barreira de pneus** pretos (646 pilhas de 0,9 m numa `InstancedMesh`, a
  face a ≤ 0,05 m da face de colisão); `src/main.ts` (+1: o chão da sintética, `ground`, fica oculto só com a Kart Park pronta);
- testes **`2aa013e`** (validação `500 Tests/Output/pista-kart-park/reports/test-validation/test-validation-20261103-2043.md`,
  `SUCCESS`, seed revisão 2, digest `49d733298158`): 23 verificações novas e 2 migradas (126 da feature), com o traço da simulação de
  `f926815` como fixture (NFR-0013); suíte **467/467**.

Nada mais muda na árvore construída: `index.html`, `src/style.css`, `package.json`, `package-lock.json`, `tsconfig.json`,
`.github/`, `.nvmrc`, `tracks/` e `src/tracks/` são os de `e70aad9` (`git diff --quiet e70aad9 2aa013e -- …`). O acabamento é **só
desenho** (I2; SEED/RD-13): a simulação, a pilotagem e a volta são as mesmas (NFR-0013, provado em `npm test`), e o arquivo da
pista **não muda** — o mesmo blob, o mesmo SHA-256 registrado, `trackVersion` 1 (NFR-0014): **não há republicação de pista**
nem versão 2.

O treino é uma **sequência de voltas numa sessão** (`race-lap-validation`); o acerto publicado é `arcade-assistido-v6` sem drift
nem turbo (`dirigibilidade`) e o Kart 01 tem marcas de pneu (`modelo-kart-01`). O que se entrega é o mesmo tipo de artefato das
releases anteriores: um **artefato estático** (`dist/`, HTML + JS + CSS) servido pelo **GitHub Pages** com HTTPS (D23); **não há
servidor, banco, serviço, migração de dado, armazenamento no navegador nem aplicativo nativo** — o arquivo de pista vai **dentro
do JS** como literal (ADR-0002), e o acabamento não acrescenta textura, imagem nem *asset* (SEED/FE-07; NFR-0010).

**O que esta release não faz: ir a produção.** A Kart Park é derivada de um caminho OpenStreetMap e de bordas detectadas em
imagem **Esri World Imagery** (seed, *Origem*). O dono do produto decidiu em **2026-11-03** (`200 Requirements/220 Input/pista-kart-park/DOMAIN.md`):
**o ponto Esri continua aberto**, a Kart Park **segue só em staging**, sem liberação nem remedição sem Esri por enquanto, e a produção
**espera a decisão** (opção 1 de *Promoção bloqueada* (b) do `runbook.md`): as quatro features (`race-lap-validation`,
`dirigibilidade`, `modelo-kart-01`, `pista-kart-park`) chegam a produção **juntas**, e **nenhum commit de `master` é enviado a
`origin`** até lá (NFR-0012; ADR-0005). `tracks/registry.json` mantém `kart-park` 1 em `STAGING`; `npm run track -- promote`
recusa sem `--esri-decision` (CHK-TEST-0012-04). O `runbook.md` termina, por isso, **antes** da pergunta de promoção.

## O que é entregue

| Item | Conteúdo | Fonte |
|---|---|---|
| Canais | `web-desktop` e `web-mobile` — a mesma página, com teclado no computador (som da zebra) e inclinação ou toque no celular (vibração da zebra); paisagem e retrato; o mesmo acabamento nos dois canais (US-0007, *Canais*) | diretivas do estágio; `REL-0004` |
| Arquivos de origem desta feature | os das rodadas 1 a 4 (`src/trackGeometry.ts`, `src/trainingSession.ts`, `src/curbFeedback.ts`, `src/trackScene.ts`, `src/rawImports.d.ts`, `src/tracks/kart-park-v1.json`, `scripts/trackPrep.ts`, `scripts/trackChecks.ts`, `scripts/track-pipeline.ts`, `tracks/sources/kart-park.json`, `tracks/registry.json`; alterados `src/trackData.ts`, `src/physics.ts`, `src/lap.ts`, `src/lapMessages.ts`, `src/audio.ts`, `src/main.ts`, `index.html`, `src/style.css`, `package.json`; `.gitattributes`); **rodada 5 de código** (`fbfb073`): `src/trackScene.ts` (acabamento) e `src/main.ts` (`ground.visible`); `tests/pista-kart-park-*.test.ts` (12 suítes, 126 verificações; `tests/fixtures/kartParkRev1Trace.json` novo em `2aa013e`) | `400 Code/Output/pista-kart-park/01-implementation.md` 1.5.0; `500 Tests/Output/pista-kart-park/` |
| Contido no mesmo build, de outras features | o treino de voltas seguidas (`race-lap-validation`); `arcade-assistido-v6` sem drift nem turbo (`dirigibilidade`); marcas de pneu e câmera sem turbo (`modelo-kart-01`). Cada uma tem o seu registro de release, hoje nomeando `e70aad9` (`98-divergences.md`, DIV-DP-12) | registros de release dessas features |
| Inalterados contra `e70aad9` | `index.html`, `src/style.css` (o CSS servido tem o mesmo nome e os mesmos bytes, `index-q-biCwua.css`), `.github/workflows/pages.yml`, `.nvmrc`, `package.json`, `package-lock.json`, `tsconfig.json`, `tracks/`, `src/tracks/`; dependências de execução: **nenhuma acrescentada** (`three` continua a única — NFR-0010) | `git diff --stat e70aad9 2aa013e`: na árvore construída, só `src/main.ts` e `src/trackScene.ts` |
| Formato publicado | **o arquivo de pista em esquema 3** com o leitor da versão 2 mantido; `kart-park` **versão 1**, imutável, SHA-256 `04ce5e51…` em `tracks/registry.json` (NFR-0006) — o mesmo blob desde `d9139a2`; **NFR-0014**: 0 bytes diferentes, `trackVersion` 1, nenhuma republicação | DM-0001, DM-0002, ADR-0001; `REL-0002` |
| Formato persistido | **nenhum**: a pista escolhida não é gravada nem lida no navegador; nenhuma volta de treino cria registro de desafio (DES-0012; CHK-TEST-0011-02); o tom da grama vem da posição, não de armazenamento (AC-US-0007-14) | DES-0012; `REL-0002` |
| Feature flag | **nenhuma** (ADR-0005). O ponto de aplicação da "chave mestra" de I4 é a **promoção**: humano, registrado em `tracks/registry.json` e bloqueado pela decisão Esri | ADR-0005, DES-0011 |
| Variáveis de ambiente | nenhuma lida pelo cliente, pelo preparo offline ou pelo workflow | `REL-0001` |
| O que o jogador vê | o mesmo de `e70aad9` (seletor com a Kart Park marcada, crédito OSM com link, treino de voltas seguidas com o crédito no painel do resultado de cada volta, zebra com vibração e som, a barreira que não deixa passar, nenhum recorde) **e, na Kart Park**: uma faixa branca contínua por dentro do asfalto nas duas bordas; zebras com relevo (sobem para fora, sem efeito na física); a barreira desenhada como fileira de pneus pretos empilhados, onde o kart encosta sem entrar; a grama em faixas de 2 tons de verde, iguais em cada abertura e em cada aparelho. **Na sintética, nada muda** (AC-US-0007-16) | DES-0005, DES-0007, DES-0008 2.1.0, DES-0009, ADR-0007; US-0007; `REL-0003` |

## Proveniência — o commit que a release nomeia

| Fato | Estado em 2026-11-04 |
|---|---|
| Validação de código | `SUCCESS` — `code-validation-20261103-2004.md` (rodada 5, seed revisão 2): o acabamento em `fbfb073` (2026-11-03T17:04:58 −03:00), medido sobre `buildTrackScene(kartParkGeometry())` (faixa de 0,099994 a 0,100006 m; relevo 0,035 → 0,075 m; 646 pilhas de 0,9 m; face a ≤ 0,0220 m da fronteira de contato; luminâncias 0,2380 / 0,1794 contra 0,2075); SHA-256 do arquivo da pista `04ce5e51…` igual ao registro |
| Veredito de testes | `SUCCESS` — `500 Tests/Output/pista-kart-park/reports/test-validation/test-validation-20261103-2043.md` (rodada 5, seed revisão 2): **467/467**, 126 desta feature (23 novas, 2 migradas, 0 removidas), execução fresca; AC-US-0007-01..21, NFR-0013 e NFR-0014 decididos em `npm test` na sua metade automática; as metades de tela e de aparelho ficam nas linhas humanas (abaixo). **Carimbo de seed**: o digest certo da seed revisão 2 é **`49d733298158`** — o que `pipeline_progress.py --seed-line pista-kart-park` imprime (SHA-1 do corpo do `SEED.md` sem a front matter, fins de linha normalizados para LF, sem espaços nas pontas, 12 primeiros hex), igual desde `a5bb426` (2026-11-03T18:49Z, antes do veredito) até `HEAD`. O relatório de testes traz `b80f2635073f`, que é o SHA-1 do arquivo inteiro, com a front matter e em CRLF como está na árvore de trabalho — não o carimbo; o veredito julgou a seed atual, e só o carimbo está errado (ISSUE-07 de `deploy-validation-20261104-1302.md`; este estágio não edita o relatório de outro estágio) |
| Commit verificado (`<sha>`) | **`2aa013e67de49fb842f42cda573b3b82df5cf824`** (curto `2aa013e`), 2026-11-03T17:44:39 −03:00, "pista-kart-park: testes da revisão 2 …". Acima dele só há commits de registro desta feature (`1966c4a`: o registro 1.3.0; `c06afdd`: o relatório de validação de 2026-11-04 — ambos só em `600 Deploy/Output/pista-kart-park/`), que a regra de invalidação admite. Contra `e70aad9` muda, na árvore construída, só `src/main.ts` e `src/trackScene.ts` (`fbfb073`); o resto são testes (`2aa013e`) e registros. Chegou a staging por avanço rápido (`1bb63aa` era ancestral). Cadeia (NFR-0011): `b86b200` e `6ea3862` continuam ancestrais |
| Construído pelo pipeline | **sim**: execução **41832829595** de `edumatosr6-svg/kartle-staging` (evento `push` de `1966c4a`, tentativa 1, `success`; criada 2026-11-04T12:51:01Z; `build` 12:51:04–12:52:18Z, `deploy` 12:52:21–12:53:05Z; ramo `staging` = `1966c4a` por `git ls-remote`). Do log, reduzido por script: Node v24.22.1; *Test* `tests 467 / pass 467 / fail 0 / skipped 0`; *Build* `index-BMmvlQeM.js 696.55 kB`, `index-q-biCwua.css`; *Measure dist* `files=3 total_bytes=714001 gzip_bytes=189539 within_limit=True ratio=0.227`. O envio foi o *Promote* 7 do `runbook.md` (`git push staging master:staging` com `master` = `1966c4a`), feito em 2026-11-04 |
| Build limpo local (referência para o servido) | `MSYS_NO_PATHCONV=1 npx vite build --base=/kartle-staging/` sobre a árvore limpa de `2aa013e` (2026-11-03; refeito pelo validador em 2026-11-04): `dist/assets/index-BMmvlQeM.js` 696 559 bytes (sha256 `babb1884645d2c40…`), `dist/assets/index-q-biCwua.css` 10 850 bytes (`5e1c964b3b292f33…`, igual ao servido hoje), `dist/index.html` 6 592 bytes (`3b0dfc3705f80a8f…`) — **os três byte a byte iguais ao servido** (`cmp`, `deploy-validation-20261104-1302.md`); `measure_dist.py` local: `files=3 total_bytes=714001 gzip_bytes=189786 within_limit=True ratio=0.227` (o gzip difere dos 189 539 do *Measure dist* da execução só pela biblioteca zlib — Windows contra Linux; os bytes brutos são os mesmos); `check_bundle.py dist tracks/registry.json`: **`checks=88 failed=0`**, `track_bytes=43012`, `track_sha256=04ce5e51…`; `npm run track -- verify kart-park 1`: `VERIFIED`. O `<hash>` do passo *Build* da execução 41832829595 é **`BMmvlQeM`**, o esperado |
| Servido em staging hoje | **o candidato `2aa013e`**: `https://edumatosr6-svg.github.io/kartle-staging/` (GET de 2026-11-04) responde 200 com `Last-Modified: Wed, 04 Nov 2026 12:53:01 GMT` e `Cache-Control: max-age=600`, e serve `index.html` (6 592 bytes, `3b0dfc37…`) → `assets/index-BMmvlQeM.js` (696 559 bytes, `babb1884…`) e `assets/index-q-biCwua.css` (10 850 bytes, `5e1c964b…`) pela execução **41832829595** (`1966c4a`); `check_served.py … index-BMmvlQeM.js` → `checks=79 failed=0` (`track_sha256=04ce5e51…`); `check_bundle.py` sobre o servido 88/88; validado `SUCCESS` em `deploy-validation-20261104-1302.md`. A anterior, 41156803005 (`1bb63aa`, `index-DmxsQuIL.js`), é o alvo do caminho B |
| Arquivo da Kart Park = registro | **sim, e inalterado** (NFR-0014): blobs em `2aa013e` iguais aos de `5ed7a5b` — `src/tracks/kart-park-v1.json` `a1f57085…`, `tracks/registry.json` `cfdeec07…`, `tracks/sources/kart-park.json` `d5ee2187…`; o literal no JS do build limpo dá SHA-256 + LF `04ce5e510410e297764c047739422b07d46290c70eade1c1fb5bb7d120f057b1` = `tracks/registry.json` entrada `kart-park` 1 (`fileBytes` 43 013, `STAGING`, sem `promotedAtUtc`/`esriDecisionRef`) |
| Regra byte-exata dos arquivos de pista | inalterada: `git ls-files --eol` → `attr/-text` nas três, `i/crlf w/crlf` na origem, `i/lf w/lf` nas outras duas (conferido em 2026-11-03) — `runbook.md`, *Promote* 1 |
| Regra de invalidação do `<sha>` | um commit posterior **não invalida** a release quando não muda a árvore construída (`src/`, `index.html`, `package.json`, `package-lock.json`, `tsconfig.json`, `vite.config.*`) nem os **bytes** dos três arquivos de pista, **desde que** a execução do workflow desse commit fique verde e `check_served.py` dê o mesmo resultado sobre o mesmo `<hash>`; qualquer outro commit invalida e pede veredito de testes novo e nova rodada deste estágio |
| Produção | `https://edumatosr6-svg.github.io/kartle/` responde **404**; `origin/master` = **`05c3570`** (2026-10-22); nada aprovado. **Não promovível**: decisão de 2026-11-03 (ponto Esri aberto; opção 1) — `runbook.md`, *Promoção bloqueada* |
| Tag de release | não existe; a release é identificada pelo hash acima e pelo número da execução que o publicou (41832829595) |
| Sistema de CI | **GitHub Actions**, `.github/workflows/pages.yml` (inalterado): `npm ci` → `npm test` (467) → `npm run build -- --base=/<repo>/` → `measure_dist.py` (RNF02) → `upload-pages-artifact` → `deploy-pages`; etapas em `REL-0003` |
| Alvo de reversão em staging | a execução anterior à em vigor, **41156803005** (`1bb63aa`, árvore de `e70aad9`, `index-DmxsQuIL.js`, `success`, 2026-10-31, retida): o mesmo jogo, com o crédito no painel do resultado, **sem o acabamento** — reversão de qualidade equivalente salvo o desenho de US-0007. Antes dela: 41109469203 (`e70aad9`, o mesmo `DmxsQuIL`) e 41101055606 (`6b314b2`, sem o crédito no painel — só emergência). O caminho C1 (revert de `2aa013e` e `fbfb073`) foi ensaiado em 2026-11-04 num checkout LF e reconstrói `DmxsQuIL` byte a byte (`runbook.md`, *Alvo de reversão*). Em produção não há execução verde (caminho A, nada a despublicar) |

### Precondições humanas que restam, em ordem

1. **Publicar `2aa013e` em staging** — feito em 2026-11-04: execução 41832829595 (`1966c4a`), `check_served … index-BMmvlQeM.js`
   `checks=79 failed=0`.
2. **Validação de staging pelo validador** — feita: `deploy-validation-20261104-1302.md`, `SUCCESS`, com a prova byte a byte
   contra o build limpo. Esta versão (1.4.0) do registro aguarda a revalidação das suas correções (ISSUE-07, -08, -09).
3. **Registrar em `docs/kart-park-device-log.md`** (existe desde `1bb63aa`, com a execução no celular de 2026-10-30 sobre
   `e70aad9`, parcial) uma entrada nova sobre o build de `2aa013e`: as **linhas humanas H1–H8** que seguem abertas e as **quatro
   linhas novas do acabamento, H9–H12** (`runbook.md`): o aspecto da faixa de borda, do relevo da zebra, dos pneus e dos tons de
   grama no notebook (H9) e no celular (H10), a taxa de quadros com o acabamento na tela (H11, NFR-0002: 60 fps no notebook e
   30 fps no celular em paisagem e retrato) e a imagem da sintética igual à de antes (H12, E2E-09).
4. **A decisão Esri**, registrada em `DOMAIN.md` com identificador e data. Em 2026-11-03 o dono do produto registrou
   que ela **continua aberta** e escolheu a opção 1 (esperar e promover as quatro features juntas). Sem a decisão não há pergunta
   de promoção (NFR-0012); com ela, a promoção é de uma **entrega nova** que acrescenta o crédito da Esri (REQ-FEAT-0006-14;
   DES-0011) e grava `PRODUCTION` no registro.
5. **As releases contidas passam a nomear o mesmo build** (DIV-DP-12): o envio mudou `src/`, o que, pela regra de invalidação de
   cada uma, as deixou atrás do servido (ISSUE-05). Em 2026-11-04 os registros de `race-lap-validation`, `dirigibilidade` e
   `modelo-kart-01` passaram a `2aa013e` (em rascunho, por validar), sem veredito de testes novo — por contenção.

Cumpridas: a validação de código `SUCCESS` da rodada 5; o veredito de testes `SUCCESS` sobre `2aa013e` (467/467); o build limpo
local com `check_bundle` 88/88 e o arquivo da Kart Park igual ao registrado; o envio a staging (41832829595) e a validação de
staging `SUCCESS` (`deploy-validation-20261104-1302.md`), servido = build limpo byte a byte; o ensaio C1 da reversão; o arquivo da pista e `trackVersion` 1 inalterados
(NFR-0014); a regra byte-exata em vigor e conferível; o registro da pista em `STAGING`; o Node fixado (`.nvmrc` = `24`); os dois
repositórios configurados (D23); a escolha da opção 1 registrada (DIV-DP-15).

## Reprodução do build

O workflow executa estes passos a cada push; à mão, da raiz do repositório, com caminhos entre aspas:

| Passo | Comando | Resultado esperado |
|---|---|---|
| 1 | `git ls-files --eol tracks/sources/kart-park.json src/tracks/kart-park-v1.json tracks/registry.json` | `attr/-text` nas três; `i/crlf w/crlf` na origem, `i/lf w/lf` nas outras duas |
| 2 | `npm ci` | saída 0; `package-lock.json` inalterado |
| 3 | `npm test` | saída 0; **467** aprovados, 0 reprovados, 0 pulados (126 desta feature) |
| 4 | `npm run track -- verify kart-park 1` | `VERIFIED`, V01 a V18 `PASS` (leitura; nada escrito) |
| 5 | `npm run build` (no workflow, `-- --base=/kartle/` ou `/kartle-staging/`; no Git Bash, à mão, `MSYS_NO_PATHCONV=1 npx vite build --base=/kartle-staging/`) | saída 0; `dist/index.html`, `dist/assets/index-BMmvlQeM.js`, `dist/assets/index-q-biCwua.css`; nenhum outro arquivo em `dist/assets/` |
| 6 | `python -I "600 Deploy/Output/race-lap-validation/tools/measure_dist.py" dist` | `total_bytes=714001 within_limit=True`; saída 0 |
| 7 | `python -I "600 Deploy/Output/pista-kart-park/tools/check_bundle.py" dist tracks/registry.json` | `checks=88 failed=0` |
| 8 | `npm run preview` | `http://127.0.0.1:4173` serve o bundle; abre na Kart Park com o seletor e o crédito; "volta de treino" inicia a contagem sobre o asfalto da Kart Park, com faixa de borda, zebras com relevo, pneus e grama em faixas |

### Medida do artefato (build limpo local de `2aa013e` = servido pela execução 41832829595, base `/kartle-staging/`)

| Arquivo | bytes | gzip bytes |
|---|---:|---:|
| `assets/index-BMmvlQeM.js` | 696 559 | 184 146 |
| `assets/index-q-biCwua.css` | 10 850 | 3 049 |
| `index.html` | 6 592 | 2 591 |
| **total** (`measure_dist.py` local) | **714 001** | **189 786** (*Measure dist* da execução 41832829595: **189 539**) |

- Limite de RNF02 (download inicial abaixo de 3 145 728 bytes): **714 001 bytes brutos (22,7 % do limite)**, igual ao
  `total_bytes` do *Measure dist* da execução; 189 539 comprimidos no workflow, 189 786 no Windows sobre os mesmos bytes (só zlib)
  (6,0 %). Contra o build servido de `e70aad9` (711 620 bytes; 188 719 gzip): **+2 381 bytes** brutos (+1 067 gzip),
  todos no JS — o código do acabamento; o CSS e o `index.html` têm o mesmo tamanho.
- O arquivo da Kart Park no bundle: **43 012 bytes** (o arquivo tem 43 013 com o `\n` final; o literal `?raw` omite-o) —
  NFR-0001 pede abaixo de 200 000; `SHA-256(literal + "\n")` = `04ce5e51…` = o registrado (NFR-0006, NFR-0014).
- Os números do *Measure dist* da execução 41832829595 coincidem nos bytes brutos (714 001); o gzip difere só pela zlib.

## O que o pipeline faz (`.github/workflows/pages.yml`)

Inalterado. Em ordem, com saída observável na execução do Actions: checkout do commit → Node da `.nvmrc` (24) com cache do npm →
`npm ci` → `npm test` (467 aprovados; inclui V01–V18 sobre o arquivo publicado, os resumos registrados contra os bytes do blob,
o crédito no painel do resultado, a prova de que `promote` recusa sem `--esri-decision`, as medidas do acabamento na cena
construída em Node e a trajetória passo a passo igual à de antes da revisão 2) → `npm run build -- --base=/kartle/` (ou
`/kartle-staging/`) → `measure_dist.py dist` (saída 0) → `configure-pages` → `upload-pages-artifact` de `dist/` → trabalho `deploy`
no ambiente `github-pages`. Em produção o `deploy` **espera a aprovação do revisor obrigatório** (D-DP-06) — e nesta release **a
aprovação não pode ser dada** antes da decisão Esri; em staging publica de imediato. Permissões mínimas, nenhum segredo (I6). As
ferramentas desta release (`tools/check_bundle.py`, `tools/check_served.py`) são executadas por quem valida e pelo runbook, não
pelo workflow (`98-divergences.md`, DIV-DP-05).

## Limitações conhecidas — divergências aceitas e herdadas

- As divergências aceitas pelo dono do produto em 2026-10-21 continuam válidas: o `href="/"` da marca e a requisição a
  `fonts.googleapis.com` no carregamento (DIV-DP-09, DIV-DP-10, `waived`).
- O crédito da **Esri** não está no bundle (0 ocorrências de `esri`), por projeto: entra na entrega que promover, se a decisão o
  liberar (NFR-0012, segunda linha; REQ-FEAT-0006-14).
- As ferramentas `check_served.py` e `check_bundle.py` não conferem o acabamento (não têm linha para faixa, relevo, pneus ou tons;
  §16, nenhuma verificação nova numa rodada de revisão): o acabamento é provado em `npm test` (CHK-TEST-0010-06..16 e as demais da
  rodada 5) e pela tela (H9–H12). As ferramentas continuam a provar o arquivo da pista, o crédito e o resto do empacotamento.
- A poligonal da barreira alterna de direção a cada 0,1 m: o kart pode ricochetear em ângulos inesperados — observação de
  qualidade para o D-Spec, não defeito; a "sensação" da barreira é a linha H3 e o encosto nos pneus é H9.
- Taxa de quadros (agora com o acabamento: 646 pilhas de pneus, duas tiras de faixa de borda, grama em faixas), vibração, som, a
  legibilidade do crédito no painel e o aspecto do acabamento não foram medidos em nenhum aparelho nomeado sobre este build. São
  as linhas H3–H12 do `runbook.md`. A execução no celular de 2026-10-30 (`docs/kart-park-device-log.md`) é de `e70aad9`, sem o
  acabamento, e sem medida de fps; nenhuma entrada ainda sobre `index-BMmvlQeM.js`.
- Staging serve, no mesmo bundle, as mudanças de `race-lap-validation`, `dirigibilidade` e `modelo-kart-01`, cujas portas
  humanas são dos registros delas (`98-divergences.md`, DIV-DP-12).
