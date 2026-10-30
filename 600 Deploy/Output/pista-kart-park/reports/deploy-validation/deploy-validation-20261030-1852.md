---
stage: deploy
feature: pista-kart-park
verdict: SUCCESS
generated: 2026-10-30T18:57:00Z
environment: staging — `https://edumatosr6-svg.github.io/kartle-staging/` (GitHub Pages, repositório `edumatosr6-svg/kartle-staging`, ramo `staging`, workflow `.github/workflows/pages.yml`, D23)
commit: e70aad9ddf5cf42da6c5957b4023afdbf6cacd03
counts: {blocker: 0, error: 0, warning: 1, info: 4, divergence: 0}
seed: {revision: 1, digest: b5aa5be4734a}
upstream: {stage: test, verdict: test-validation-20261030-1844.md}
round: 2
mode: revalidation (registro Modo B, rodada 3)
previous: reports/deploy-validation/deploy-validation-20261028-0008.md
previous-issues: {ISSUE-01: open, ISSUE-02: resolved, ISSUE-03: open, ISSUE-04: open, ISSUE-05: open}
population: [ISSUE-01..05 do relatório anterior; version movida desde 3f1ced3: 01-release.md 1.2.0, 97-changelog.md 1.2.0, 98-divergences.md 1.2.0, REL-0001-config.md 1.1.0, REL-0002-migration.md 1.2.0, REL-0003-rollout.md 1.2.0, REL-0004-mobile.md 1.2.0, REL-0005-observability.md 1.2.0, runbook.md 1.2.0, smoke.md 1.2.0, tools/check_bundle.py, tools/check_served.py; amostra aleatória: nenhum arquivo intocado restante]
staging-run: 41109469203
rollback-rehearsed: reused (caminho B, 2026-10-27 19:29–19:33Z — `600 Deploy/Output/dirigibilidade/reports/deploy-validation/deploy-validation-20261027-1931.md`; nenhuma workflow de staging reexecutada nesta rodada); alvo 41101055606 (`6b314b2`) verde e retido, só para emergência
production: BLOCKED (decisão Esri, ADR-0005 / NFR-0012; nada aprovado, acionado nem enviado a `edumatosr6-svg/kartle`)
divergences: []
feedbacks: []
---

# Relatório de validação de deploy — pista-kart-park (rodada 2, build de `e70aad9`)

## Evidence

| Prova | Resultado |
|---|---|
| Commit verificado nomeado (P1) | `e70aad9ddf5cf42da6c5957b4023afdbf6cacd03` (2026-10-30T15:44:24 −03:00) em `01-release.md` *Proveniência*, `runbook.md` `<sha>`, `REL-0003` etapa 1; `git diff --stat 6b314b2 e70aad9`: só `index.html`, `src/main.ts`, `src/style.css`, `tests/pista-kart-park-screens.test.ts`; `.github/`, `.nvmrc`, `package.json`, lockfile, `tsconfig.json` sem diferença; HEAD `94ad87b` difere de `e70aad9` só em `500 Tests/Output/` (relatório de testes e CSV) — não invalida; `git merge-base --is-ancestor` `b86b200` e `6ea3862` → `e70aad9` verdadeiros (NFR-0011); `git status` vazio em `src/ scripts/ tests/ tracks/ index.html package*.json` |
| Construído pelo pipeline (P1) | sim — `gh run view 41109469203 --repo edumatosr6-svg/kartle-staging` (leitura): `push`, ramo `staging`, `headSha` `e70aad9ddf5c…`, criada 18:44:27Z, tentativa 1, `success`; `build` 18:44:30–18:46:27Z `success`, `deploy` 18:46:30–18:46:39Z `success`; log reduzido (875 linhas, fora do contexto): `tests 444 / pass 444 / fail 0 / cancelled 0 / skipped 0 / todo 0`, 0 `✖`, `✔ CHK-TEST-0009-04` e `✔ CHK-TEST-0009-11` presentes; `node: v24.22.1`; *Build* `index-DmxsQuIL.js 694.17 kB`, `index-q-biCwua.css 10.85 kB`; *Measure dist* `files=3 total_bytes=711620 gzip_bytes=188719 within_limit=True ratio=0.226` |
| Servido = build limpo (P1) | **sim, byte a byte** — `git archive e70aad9 \| tar -x` em diretório novo no scratchpad, `npm ci` (0), `MSYS_NO_PATHCONV=1 npm run build -- --base=/kartle-staging/` (0): JS `index-DmxsQuIL.js` 694 178 bytes sha256 `79e3182c860855c0…` = servido `79e3182c860855c0…`; CSS `index-q-biCwua.css` 10 850 bytes `5e1c964b3b292f33…` = servido; `index.html` servido 6 592 bytes `ba4e81a44a43f150…` = build limpo depois de retirar o CRLF do `git archive` no Windows (`diff` vazio); nenhum outro *asset* em `dist/assets/` |
| Artefato fresco (P1) | commit 18:44:24Z → execução 18:44:27Z → `Last-Modified: Fri, 30 Oct 2026 18:46:34 GMT` nos três recursos (`ETag` `"6ae4e60a-a97a2"` JS, `"6ae4e60a-2a62"` CSS, `"6ae4e60a-19c0"` HTML; `Cache-Control: max-age=600`), lidos às 18:53:20Z com `Cache-Control: no-cache`; última edição de código `38354bb` 18:21:19Z |
| Veredito de testes mais novo (P1) | SUCCESS — `500 Tests/Output/pista-kart-park/reports/test-validation/test-validation-20261030-1844.md` (rodada 4, `collected: 444, passed: 444, failed: 0, skipped: 0, fresh: true`; 103 desta feature; `seed: {revision: 1, digest: b5aa5be4734a}`); `SEED.md` `revision: 1`, `pipeline_progress.body_digest` = `b5aa5be4734a`, igual; validação de código `code-validation-20261030-1836.md` `SUCCESS` |
| Arquivo da Kart Park servido = registro (P1, NFR-0006) | sim — `tracks/registry.json` em `e70aad9`: `kart-park` 1, `sha256` `04ce5e510410e297764c047739422b07d46290c70eade1c1fb5bb7d120f057b1`, `fileBytes` 43 013, `STAGING`, sem `promotedAtUtc`/`esriDecisionRef`; `check_served.py` `track_sha256=04ce5e51…0f057b1`; `check_bundle.py` (servido e build limpo) `track_bytes=43012 track_sha256=04ce5e51…0f057b1` |
| Regra byte-exata (P1) | `git ls-files --eol`: `i/lf w/lf attr/-text src/tracks/kart-park-v1.json`; `i/lf w/lf attr/-text tracks/registry.json`; `i/crlf w/crlf attr/-text tracks/sources/kart-park.json`; blobs em `e70aad9` = `5ed7a5b` nos três (`a1f57085`, `cfdeec07`, `d5ee2187`); sha256 dos blobs `04ce5e51…`, `d6303d0a…`, `52c5adda…` (= `prep.originSha256`) |
| Segredos (P2) | nenhum valor — padrões de token (`ghp_`, `gho_`, `github_pat_`, chave privada, `AKIA…`) no registro: 0; menções textuais só em `REL-0001`, `runbook.md` ("token OIDC") e no relatório anterior; `pages.yml` em `e70aad9`: 0 `secrets.`/`env:`; log da execução reduzido: 0 padrões de token; nenhum log capturado além de cabeçalhos HTTP, JSON do `gh` e reduções |
| Variáveis (P2) | 0 = 0 — `REL-0001`: nenhuma variável lida pelo cliente, preparo offline ou workflow; `pages.yml` inalterado desde `6b314b2` |
| Instalação em staging (P3) | `python -I "…/tools/check_served.py" https://edumatosr6-svg.github.io/kartle-staging/ index-DmxsQuIL.js` às 18:54Z: `status=200 js=index-DmxsQuIL.js js_bytes=694178 css_bytes=10850 cache_control='max-age=600' last_modified='Fri, 30 Oct 2026 18:46:34 GMT' track_sha256=04ce5e51… checks=79 failed=0`, saída 0 (três GET a staging, nenhum outro efeito) |
| Bundle empacotado (P3, NFR-0001, NFR-0010, NFR-0012) | `check_bundle.py <servido> <registry.json de e70aad9>`: `checks=88 failed=0`, `total_bytes=711620` (87 `ok` + 1 `warn`: `fetch(` do polyfill de `modulepreload`, previsto); sobre o build limpo: `checks=88 failed=0`; `measure_dist.py` sobre o servido: `total_bytes=711620 within_limit=True ratio=0.226` |
| Crédito no painel do resultado — Kart Park sim, sintética não (P5, ADR-0007, AC-US-0006-04..06, D-DP-04) | no servido: `index.html` com `#lap-training-result-credit` (classe `hidden` inicial) como filho de `#lap-training-result`; 0 `lap-result-credit` no HTML e no JS; JS: `renderTrainingResult` mantém o contêiner e chama `cg(Q('lap-training-result-credit'), Gf(sg(n.trackId)))`; `Gf(e){return e?.osmCredit?Wf:void 0}`; catálogo `kart-park` `osmCredit:!0`, `synthetic` `osmCredit:!1`; `cg` com `t` indefinido esvazia e adiciona `hidden`, com crédito cria o link `target=_blank` `rel=noopener noreferrer` e remove `hidden` — crédito no painel só na Kart Park; as 4 linhas de ADR-0007 de cada ferramenta passam |
| Passo manual não descrito (P3) | nenhum — push a `staging`, `check_served`, política de ramos e *Re-run all jobs* descritos no `runbook.md` *Promote* 7 e R1/R2 |
| Migração (P4) | não se aplica — sem banco nem armazenamento no navegador (`REL-0002`; DES-0012); esquema 3 com leitor do 2 coberto pelo `npm test` do workflow (444/444) |
| Promoção bloqueada — `promote` recusa (P6, NFR-0012) | executado na cópia `git archive` de `e70aad9`: `npm run track -- promote kart-park 1` → `argumento inválido: --esri-decision`, saída **1**; sha256 de `tracks/registry.json`, `src/tracks/kart-park-v1.json`, `tracks/sources/kart-park.json` antes = depois (`d6303d0a…`, `04ce5e51…`, `52c5adda…`); nenhum arquivo novo em `tracks/` nem `src/tracks/`; `DOMAIN.md`: OPEN-01 (Esri) de 2026-10-22 sem decisão registrada |
| Reversão (P6) — caminho B | ensaio reutilizado (2026-10-27 19:29–19:33Z, mesma workflow e mesmo site); nenhuma workflow reexecutada nesta rodada; alvo **41101055606** (`6b314b2`) `success`, tentativa 1, retido (`gh run list`, leitura) — emergência apenas: serve o jogo sem o crédito no painel (cruza o gatilho do crédito; `runbook.md` R1, *Gatilhos*); alternativa com crédito no resultado 41076989728 (`652bbaa`) também `success` |
| Reversão (P6) — produção | caminho A, nada a reverter; `origin/master` = `05c3570` (ref local); nenhum GET, `gh` ou push contra `edumatosr6-svg/kartle` nesta rodada |
| Runbook — estrutura (P6) | precondições (16; por marcar: veredito de testes — já existe, ISSUE-06 —, validação de staging — este relatório —, `docs/kart-park-device-log.md`, decisão Esri, portas das releases contidas), *Promote* 1–11 com *Esperado*, *Leva*, *Desfaz-se por*; *Verify* 1–13; *Roll back* R1–R5 com caminhos A/B/C e durações; caminho C nomeia `e70aad9`, `38354bb` e a cadeia com `5ed7a5b`; ponto sem retorno "não existe nesta release" nomeado; *Promoção bloqueada* (a)/(b) |
| Ordem de `REL-0003` vs ocorrido (P8) | confere — etapa 2 lista 40603572961 (falha), 40606152700, 40607336550, 40987575935, 41076989728, 41101055606, 41109469203; `gh run list` mostra as seis últimas verdes na mesma ordem e commits (`5ed7a5b`, `3f1ced3`, `2f3dfab`, `652bbaa`, `6b314b2`, `e70aad9`) |
| Feature flag (P8) | nenhuma, por projeto (ADR-0005); o ponto de aplicação é a promoção, bloqueada |
| Observabilidade (P7) | `REL-0005`: modos de falha com sintoma e classificação; nenhum log sai do navegador; vigilância manual (DIV-DP-08 `waived`); nenhum log capturado com conteúdo I6 |
| NFR observados em staging (P5) | NFR-0001: literal 43 012 bytes (< 200 000); NFR-0006: `04ce5e51…` servido = registro; NFR-0010: um JS e um CSS; NFR-0012: 0 `esri` (ferramentas), `STAGING`, `promote` recusado; RNF02: 711 620 bytes brutos (22,6 %), 188 719 gzip no CI; RNF06: 200 em HTTPS; RNF01, NFR-0002 (fps), NFR-0004, NFR-0005 e os 22 critérios de aparelho sem valor até H1–H8 (ISSUE-01) |
| Smoke — `web-desktop` / `web-mobile` (P5) | automático: D1, D3, D17 passam (79/79, 88/88, 711 620 bytes); D2, D4–D16, D18 e M1–M12 são de navegador e aparelho — humanos (ISSUE-01); nenhuma automação de navegador usada |
| Autenticação, RBAC, webhook (P5) | não se aplica — página estática sem servidor |
| Compatibilidade (P6) | janela = `Cache-Control: max-age=600` medido; nada persistido; sem app nativo (`REL-0004`) |

## Issues

### ISSUE-01
- severity: info
- check: P5
- class: porta humana (ambiental)
- status: open (re-verificada)
- file: `600 Deploy/Output/pista-kart-park/runbook.md`
- location: precondição `docs/kart-park-device-log.md`; *Linhas humanas* H1–H8; `smoke.md` D2, D4–D16, D18, M1–M12; `98-divergences.md` DIV-DP-01, DIV-DP-07
- finding: `docs/kart-park-device-log.md` continua sem existir (`ls docs/`), por isso os 22 critérios de aparelho do veredito de testes, RNF01 e NFR-0002 seguem sem medida para `index-DmxsQuIL.js` (execução 41109469203).
- expected: Eduardo cria `docs/kart-park-device-log.md` no molde de `docs/kart-01/device-log.md` e registra H1–H8 e as linhas de aparelho do `smoke.md` sobre a URL de staging (`e70aad9`, `index-DmxsQuIL.js`), com H3/H5 incluindo o crédito no painel `#lap-training-result` a cada volta na Kart Park e a ausência dele na sintética; reprovação é `FAIL CODE`.

### ISSUE-03
- severity: info
- check: P6
- class: ensaio reutilizado (instrução do loop)
- status: open (re-verificada)
- file: `600 Deploy/Output/pista-kart-park/98-divergences.md`
- location: DIV-DP-03; `runbook.md` R1/R2, precondição "Procedimento de reversão ensaiado"
- finding: o caminho B não foi repetido para o par 41101055606 ↔ 41109469203; vale o ensaio de 2026-10-27 19:29–19:33Z na mesma workflow e no mesmo site; o alvo 41101055606 está verde e retido e serve um bundle sem o crédito no painel, por isso é alvo só de emergência.
- expected: nada a mudar no registro; se Eduardo quiser o ensaio sobre este par, R1/R2 em staging (≈ 4 min) quando nenhuma outra feature estiver a publicar, esperando `check_served … index-BwruE9Pq.js` 79/4 na reversão e 79/0 com `index-DmxsQuIL.js` na restauração.

### ISSUE-04
- severity: info
- check: P6
- class: porta humana (decisão) — promoção BLOQUEADA
- status: open (re-verificada)
- file: `600 Deploy/Output/pista-kart-park/runbook.md`
- location: precondição "Decisão Esri registrada em `DOMAIN.md`"; *Promote* 11; *Promoção bloqueada* (a)/(b); `98-divergences.md` DIV-DP-14 (`blocked`), DIV-DP-15
- finding: `DOMAIN.md` mantém OPEN-01 (Esri) sem decisão; `promote kart-park 1` sem `--esri-decision` recusou (saída 1) sem escrever; nada foi aprovado, acionado nem enviado a produção; não há pergunta de promoção para esta release.
- expected: Eduardo registra em `DOMAIN.md` a decisão Esri (libera / não libera / adia, com identificador e data) e a opção (b) para as releases contidas (1 esperar; 2 entrega nova a partir de `6ea3862` sem a Kart Park); até lá, **Reject** em qualquer execução de `edumatosr6-svg/kartle` com commit que contenha a feature.

### ISSUE-05
- severity: info
- check: P6
- class: porta humana (decisão)
- status: open (re-verificada)
- file: `600 Deploy/Output/pista-kart-park/runbook.md`
- location: precondição "Portas humanas das releases contidas"; *Promote* 10; `98-divergences.md` DIV-DP-12
- finding: `docs/kart-01/device-log.md` continua com as entradas de aparelho "Não executadas" (linha 38), `docs/handling-device-log.md` não existe e a execução 3 de `docs/lap-validation-device-log.md` continua por fazer, enquanto staging serve o build de `e70aad9` que as contém.
- expected: Eduardo executa as listas pendentes de `race-lap-validation`, `dirigibilidade` e `modelo-kart-01` na mesma sessão de aparelho que H1–H8 (escolhendo "Pista sintética") ou decide medi-las em separado, e anota a escolha no device log de cada uma.

### ISSUE-06
- severity: warning
- check: P1 (proveniência) e P6 (precondições do runbook)
- class: registro atrás do estado — corrigir na próxima rodada do gerador
- status: new
- file: `600 Deploy/Output/pista-kart-park/01-release.md`
- location: `01-release.md` *Proveniência* "Veredito de testes" (linha 62) e *Precondições humanas* 1 (linha 77); `runbook.md` precondição "Veredito de testes `SUCCESS` sobre `e70aad9`" (linhas 59–61); `98-divergences.md` DIV-DP-02 ("em curso"), DIV-DP-07 ("711 477 bytes brutos, 188 682 gzip"), DIV-DP-12 ("o build de `6b314b2` contém"); `REL-0003-rollout.md` linha 107 e `REL-0005-observability.md` linha 42 ("711 477; 188 682 gzip")
- finding: o registro afirma que a validação de testes de `e70aad9` está "em curso" e deixa a precondição por marcar, mas `test-validation-20261030-1844.md` (`SUCCESS`, 444/444, 103 da feature, `seed` revisão 1 `b5aa5be4734a`) já existe; e cinco pontos ainda citam as medidas ou o build de `6b314b2` (711 477 / 188 682) em vez dos de `e70aad9` (711 620 / 188 719, execução 41109469203) — o bundle servido está correto e as medidas certas estão em `01-release.md` *Medida real* e neste relatório.
- expected: `01-release.md`, `runbook.md` e DIV-DP-02 citam `test-validation-20261030-1844.md` `SUCCESS` sobre `e70aad9` e marcam a precondição `[x]`; a precondição "Validação de staging" marca `[x]` com este relatório; DIV-DP-07, `REL-0003` linha 107 e `REL-0005` linha 42 passam a 711 620 bytes / 188 719 gzip; DIV-DP-12 nomeia o build de `e70aad9`; `version:` dos arquivos tocados movido.

## Promotion question

Veredito **SUCCESS**: staging serve `e70aad9ddf5cf42da6c5957b4023afdbf6cacd03`, construído pelo pipeline (execução **41109469203**, `success`, 444/444 em Linux), byte-idêntico ao build limpo (JS `79e3182c…`, CSS `5e1c964b…`, HTML `ba4e81a4…`), `check_served` 79/79, `check_bundle` 88/88, arquivo da Kart Park `04ce5e51…` = registro em `STAGING`, crédito OSM no painel do resultado de cada volta só na Kart Park; DIV-DP-16 fechada no servido.

**Não há pergunta de promoção para esta release**: produção está **BLOQUEADA** pela decisão Esri (ADR-0005; NFR-0012) — `promote` recusa sem `--esri-decision` (verificado, nada escrito), `runbook.md` termina em *Promote* 11 ("parar"), e **nada foi aprovado**, acionado nem enviado a `edumatosr6-svg/kartle`. Reversão em staging: caminho B para 41101055606 só em emergência (`600 Deploy/Output/pista-kart-park/runbook.md`, R1/R2); ponto sem retorno: não existe nesta release.

Fica com Eduardo, em ordem: (1) H1–H8 em `docs/kart-park-device-log.md` sobre `index-DmxsQuIL.js` (ISSUE-01); (2) portas humanas das releases contidas (ISSUE-05); (3) decisão Esri e opção (b) registradas em `DOMAIN.md` (ISSUE-04) — só então existe uma pergunta de promoção, e ela será a de uma entrega nova com o crédito da Esri e `PRODUCTION` no registro.
