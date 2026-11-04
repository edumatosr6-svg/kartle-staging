---
stage: deploy
feature: pista-kart-park
verdict: SUCCESS
generated: 2026-11-04T13:02:55Z
environment: staging — `https://edumatosr6-svg.github.io/kartle-staging/` (GitHub Pages, `edumatosr6-svg/kartle-staging`, ramo `staging`, `.github/workflows/pages.yml`, D23)
commit: 2aa013e67de49fb842f42cda573b3b82df5cf824 (servido pela execução de 1966c4a, só registros de `600 Deploy/Output/pista-kart-park/` depois de 2aa013e)
counts: {blocker: 0, error: 0, warning: 1, info: 6, divergence: 0}
seed: {revision: 2, digest: 49d733298158}
upstream: {stage: test, verdict: test-validation-20261103-2043.md}
round: 4
mode: revalidation (candidato novo 2aa013e; registro 1.3.0 em 1966c4a)
previous: reports/deploy-validation/deploy-validation-20261103-1744.md
previous-issues: {ISSUE-01: open (parcial), ISSUE-03: open (parcial), ISSUE-04: open, ISSUE-05: open, ISSUE-06: resolved (registro 1.3.0 nomeia 2aa013e, o veredito 20261103-2043 e as medidas do build limpo de 2aa013e)}
population: [ISSUE-01, -03..-06 do relatório anterior; version movida: 01-release.md, 97-changelog.md, 98-divergences.md, REL-0002, REL-0003, REL-0004, REL-0005, runbook.md, smoke.md (todos 1.3.0); intocado: REL-0001-config.md (1.1.0)]
staging-run: 41832829595 (1966c4a, tentativa 1, success; build 12:51:04–12:52:18Z, deploy 12:52:21–12:53:05Z)
rollback-rehearsed: C1 ensaiado localmente (clone descartável); caminho B não reexecutado (alvo 41156803005 `success`, retido)
production: BLOCKED (OPEN-01 Esri aberto, DOMAIN.md 2026-11-03; origin/master = 05c3570; nada aprovado, acionado nem enviado a `edumatosr6-svg/kartle`)
divergences: []
feedbacks: []
---

# Relatório de validação de deploy — pista-kart-park (rodada 4)

## Evidence

| Prova | Resultado |
|---|---|
| Commit verificado nomeado (P1) | `2aa013e` em `01-release.md` 1.3.0 e `runbook.md:25`; `git diff --name-only 2aa013e 1966c4a`: 10 arquivos, todos em `600 Deploy/Output/pista-kart-park/` — nenhum caminho da regra de invalidação |
| Construído pelo pipeline (P1) | `gh run view 41832829595`: `headSha` `1966c4a7…`, tentativa 1, `success`, criada 2026-11-04T12:51:01Z; `git ls-remote staging` → `refs/heads/staging` = `1966c4a` |
| Frescor (P1) | build 2026-11-04T12:51–12:52Z, depois da última edição de origem (`fbfb073`, 2026-11-03T20:04:58Z); `Last-Modified: Wed, 04 Nov 2026 12:53:01 GMT` nos três arquivos servidos |
| Servido = build limpo de `2aa013e` (P1) | GET às 12:55:00Z com `Cache-Control: no-cache`: `index.html` 6 592 bytes sha256 `3b0dfc3705f80a8f…`, `assets/index-BMmvlQeM.js` 696 559 bytes `babb1884645d2c40…`, `assets/index-q-biCwua.css` 10 850 bytes `5e1c964b3b292f33…`; `cmp` contra `MSYS_NO_PATHCONV=1 npx vite build --base=/kartle-staging/` da árvore limpa (`git diff --quiet 2aa013e -- src index.html package*.json tsconfig.json tracks scripts .nvmrc .github`; sem `vite.config.*`): **3 de 3 byte a byte iguais**, e iguais aos valores de `01-release.md` |
| Pipeline do servido (P1) | log de 41832829595 (912 linhas) reduzido por script, fora do contexto: `ℹ tests 467 / pass 467 / fail 0 / cancelled 0 / skipped 0 / todo 0`, 0 `✖` (as 21 "linhas de falha" do redutor são nomes de checks aprovados); `node: v24.22.1`; *Build* `index-BMmvlQeM.js 696.55 kB`, `index-q-biCwua.css`; *Measure dist* `files=3 total_bytes=714001 gzip_bytes=189539 within_limit=True ratio=0.227` |
| Suíte local (P1) | `npx tsx --test tests/*.test.ts` na árvore de `2aa013e`: `ℹ tests 467 / pass 467 / fail 0 / cancelled 0 / skipped 0 / todo 0`, saída 0, 68,7 s |
| Veredito de testes mais novo (P1) | SUCCESS — `test-validation-20261103-2043.md` (467/467, 126 da feature, fresca); carimbo `seed` com digest errado (ISSUE-07) |
| Segredos (P2) | 0 padrões de token com corpo no registro, em `.github/`, em `docs/kart-park-device-log.md` e no log de 41832829595 (6 máscaras `***`); 0 `import.meta.env`/`process.env` em `src/`, `scripts/`, `index.html`; `pages.yml` sem `secrets.`/`env:`; `.github/` sem diferença `e70aad9..1966c4a` |
| Instalação em staging (P3) | `python -I "…/tools/check_served.py" https://edumatosr6-svg.github.io/kartle-staging/ index-BMmvlQeM.js`: `status=200 js_bytes=696559 css_bytes=10850 cache_control='max-age=600' track_sha256=04ce5e510410e297…0f057b1 checks=79 failed=0` |
| Bundle (P3, NFR-0001/0006/0010/0014) | `check_bundle.py` sobre o build limpo e sobre o servido: `checks=88 failed=0`, `track_bytes=43012`, `track_sha256=04ce5e51…` = `tracks/registry.json`; `measure_dist.py` local `total_bytes=714001 gzip_bytes=189786 within_limit=True`; `npm run track -- verify kart-park 1`: V18 `PASS`, `VERIFIED` |
| Migração (P4) | não se aplica (`REL-0002`; DES-0012): nenhum banco, nenhum formato persistido; `localStorage`, `sessionStorage`, IndexedDB e cookies vazios no servido depois de trocar de pista e recarregar |
| Smoke automático (P5) | D1: `isSecureContext` verdadeiro, recursos `index-BMmvlQeM.js` (186 447 transferidos) e `index-q-biCwua.css` da base `/kartle-staging/`, nenhum outro *asset* do jogo (só `fonts.googleapis.com`, DIV-DP-10); D3: 714 001 brutos / 189 539 comprimidos < 3 145 728; D4: 2 botões, Kart Park `aria-pressed=true`, `#track-name` "Kart Park — São José dos Pinhais (traçado aproximado) · 687 m", crédito com link `https://openstreetmap.org/copyright` `target=_blank`, `#track-status` `kart-park`, oferta "treino", `#lap-training-result-credit` oculto; D5 (carga e troca de pista): 0 erros, 1 aviso do three.js (`PCFSoftShadowMap`); D7 parcial: sintética sem crédito, `#track-status` `synthetic`, de volta com crédito; D8: recarga com a sintética escolhida abre na Kart Park, armazenamento vazio; D17: 79/79 e 88/88; D19 parcial: grama em faixas de 2 tons e zebras visíveis atrás do seletor (captura de 12:58Z, sem volta iniciada) |
| Smoke humano (P5) | não executado nesta rodada (automação com `requestAnimationFrame` a 1–2 fps): D2, D6, D9–D16, D18, D20–D22, M1–M13, H1–H12 — ISSUE-01 |
| Autenticação, RBAC, webhook (P5) | não se aplica — página estática |
| Reversão C1 ensaiada (P6) | clone `--shared` descartável no scratchpad, `git revert --no-edit 2aa013e fbfb073`: sem conflito; árvore construída e `tests/` = `e70aad9`; checkout LF: `ℹ tests 444 / pass 444 / fail 0`, 54 s; build `--base=/kartle-staging/`: `index-DmxsQuIL.js` 694 178 bytes `79e3182c860855c0…`, `index-q-biCwua.css` `5e1c964b…`, `index.html` `ba4e81a44a43f150…` — iguais ao servido por 41156803005 (relatório anterior); `check_bundle` 88/88, `total_bytes=711620`; nada enviado |
| Reversão B (P6) | alvo 41156803005 (`1bb63aa`) `success`, criada 2026-10-31T01:44:42Z, dentro da retenção de 90 dias; não reexecutada (staging não foi revertido) |
| Ponto sem retorno (P6) | `runbook.md:238`: não existe nesta release; o ato irreversível nomeado (gravar `PRODUCTION` sem decisão) não está em nenhum passo |
| Produção (D-DP-06) | `git ls-remote origin` → `master` = `05c3570`; nenhum comando contra `edumatosr6-svg/kartle` |
| Flags e ordem (P8) | sem flag (ADR-0005); ocorrido = `runbook.md` *Promote* 7 / `REL-0003` etapa 2 (`git push staging master:staging` com `master` = `1966c4a`, execução verde, `check_served` 79/79 sobre o `<hash>` esperado `BMmvlQeM`) |
| Observabilidade (P7) | console capturado sem dado de jogador (só o aviso do three.js); falhas novas do acabamento com sinal em `REL-0005` linhas 38–40, 108–109 (H9–H12, `npm test` CHK-TEST-0010-06..16, traço NFR-0013) |

## Issues

### ISSUE-01
- severity: info
- check: P5
- class: porta humana (ambiental)
- status: open (parcial)
- file: `docs/kart-park-device-log.md`
- location: última entrada 2026-10-30 (`e70aad9`); `runbook.md` *Linhas humanas* H1–H12; `smoke.md` D2, D6, D9–D16, D18, D20–D22, M1–M13
- finding: nenhuma entrada sobre o build de `2aa013e` (`index-BMmvlQeM.js`); o acabamento (H9–H12), a taxa de quadros com ele (H11, NFR-0002) e a sintética igual (H12/D22) não foram observados em aparelho; esta rodada cobriu por automação só D1, D3, D4, D5 (carga e troca), D7/D8 parciais, D17 e D19 parcial.
- expected: entrada nova em `docs/kart-park-device-log.md` sobre `index-BMmvlQeM.js` com H1–H12 e as linhas M do celular nomeado, em paisagem e retrato.

### ISSUE-03
- severity: info
- check: P6
- class: ensaio parcial
- status: open (parcial)
- file: `600 Deploy/Output/pista-kart-park/98-divergences.md`
- location: DIV-DP-03; `runbook.md` R1/R2
- finding: o caminho B não foi repetido para o par 41156803005 ↔ 41832829595; o caminho C1 foi ensaiado localmente nesta rodada e reproduz byte a byte o bundle do alvo B.
- expected: como no relatório anterior; o ensaio C1 desta rodada fica como prova do caminho C.

### ISSUE-04
- severity: info
- check: P6
- class: porta humana (decisão) — promoção BLOQUEADA
- status: open (re-verificada)
- file: `200 Requirements/220 Input/pista-kart-park/DOMAIN.md`
- location: linhas 31–32 (2026-11-03, OPEN-01 aberto); `runbook.md` precondição "Decisão Esri registrada"; *Promote* 11
- finding: OPEN-01 (Esri) continua aberto; `origin/master` = `05c3570`; nada aprovado, acionado nem enviado a produção.
- expected: como no relatório anterior.

### ISSUE-05
- severity: info
- check: P6
- class: porta humana (decisão)
- status: open (re-verificada)
- file: `600 Deploy/Output/race-lap-validation/01-release.md`, `600 Deploy/Output/dirigibilidade/01-release.md`, `600 Deploy/Output/modelo-kart-01/01-release.md`
- location: DIV-DP-12; `01-release.md` *Precondições humanas* 5
- finding: os três registros contidos nomeiam `e70aad9` (e `6b314b2`), mas staging serve agora a árvore de `2aa013e`, que muda `src/`; pela regra de invalidação de cada um, ficaram atrás do servido.
- expected: as três releases contidas passam os seus registros a `2aa013e` / `index-BMmvlQeM.js` e fecham as suas linhas humanas sobre esse build.

### ISSUE-07
- severity: warning
- check: P1
- class: carimbo de seed errado
- status: new
- file: `500 Tests/Output/pista-kart-park/reports/test-validation/test-validation-20261103-2043.md`
- location: front matter linha 9 (`seed: {revision: 2, digest: b80f2635073f}`); copiado em `01-release.md` linhas 31 e 73
- finding: `pipeline_progress.py --seed-line pista-kart-park` dá `digest: 49d733298158` (o mesmo de `a5bb426` e dos relatórios de D-Spec e código), e o `SEED.md` não muda desde `a5bb426` (2026-11-03T18:49Z, antes do veredito); o veredito julgou o seed atual, mas o carimbo errado faz `pipeline_progress` mostrar `test drift` e `deploy seed!`.
- expected: o carimbo do veredito de testes é o que `--seed-line` imprime (`49d733298158`), e o registro cita esse digest.

### ISSUE-08
- severity: info
- check: P6
- class: ensaio de reversão — fim de linha do checkout
- status: new
- file: `600 Deploy/Output/pista-kart-park/runbook.md`
- location: *Alvo de reversão*, caminho C1; R1 *Caminho C*
- finding: num clone novo com `core.autocrlf=true` (o deste Windows), o `npm test` de C1 reprova 2 checks de features contidas (`tests/dirigibilidade-contract.test.ts` CHK-TEST-0010-01, `tests/race-lap-validation-frozen.test.ts` CHK-TEST-0014-05: `fail 2` de 444) porque o checkout grava CRLF; com checkout LF (como a árvore de trabalho atual e o CI) passa 444/444; a conferência byte-exata do runbook cobre só os três arquivos de pista.
- expected: o caminho C1 diz em que árvore se executa (a de trabalho atual, ou um checkout LF), para que a reprovação por fim de linha não seja lida como defeito da reversão.

### ISSUE-09
- severity: info
- check: P1 e P8
- class: registro atrás do estado
- status: new
- file: `600 Deploy/Output/pista-kart-park/01-release.md`
- location: *Proveniência* "Construído pelo pipeline", "Servido em staging hoje"; precondições 1–2; `runbook.md:79`; `REL-0003` linha 82 e linha 86
- finding: o registro (escrito antes do envio) diz `2aa013e` "não enviado" e staging em `1bb63aa`; o servido é a execução 41832829595 de `1966c4a` (só registros acima de `2aa013e`, admitido pela regra de invalidação), e o *Measure dist* dessa execução dá `gzip_bytes=189539` contra os 189 786 do build local (bytes brutos iguais, 714 001; diferença do zlib).
- expected: o registro nomeia a execução 41832829595 (`1966c4a`) como a que serve o candidato, marca as precondições 1 e 2 e cita os números do *Measure dist* da execução.

## Promotion question

Veredito **SUCCESS**: staging serve o build da árvore de `2aa013e` (execução 41832829595 de `1966c4a`, `success`, 467/467), byte a byte igual ao build limpo local, `check_served` 79/79, `check_bundle` 88/88, arquivo da Kart Park `04ce5e51…` = registro em `STAGING`; reversão C1 ensaiada e reprodutora do alvo B.

**Não há pergunta de promoção para esta release**: produção está **BLOQUEADA** pela decisão Esri (OPEN-01; ADR-0005; NFR-0012), `runbook.md` termina em *Promote* 11 ("parar"), e nada foi aprovado, acionado nem enviado a `edumatosr6-svg/kartle`. Reversão em staging: caminho B para 41156803005 (`600 Deploy/Output/pista-kart-park/runbook.md`, R1/R2); ponto sem retorno: não existe nesta release. Fica com Eduardo: as linhas humanas H1–H12 sobre `index-BMmvlQeM.js` (ISSUE-01), as das releases contidas (ISSUE-05) e a decisão Esri (ISSUE-04).
