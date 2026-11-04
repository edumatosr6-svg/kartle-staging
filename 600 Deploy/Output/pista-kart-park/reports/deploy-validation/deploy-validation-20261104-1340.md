---
stage: deploy
feature: pista-kart-park
verdict: SUCCESS
generated: 2026-11-04T13:40:13Z
environment: staging — `https://edumatosr6-svg.github.io/kartle-staging/` (GitHub Pages, `edumatosr6-svg/kartle-staging`, ramo `staging`, `.github/workflows/pages.yml`, D23)
commit: 2aa013e67de49fb842f42cda573b3b82df5cf824 (candidato do registro 1.4.0); servido em staging: 1966c4a7df7ff516ac7f7ab536907c3b0a7fd858 (só registros de `600 Deploy/Output/pista-kart-park/` sobre 2aa013e)
counts: {blocker: 0, error: 0, warning: 1, info: 4, divergence: 0}
seed: {revision: 2, digest: 49d733298158}
upstream: {stage: test, verdict: test-validation-20261103-2043.md}
round: 5
mode: revalidation (registro 1.4.0 em ee9e9bc, correções de ISSUE-07/-08/-09)
previous: reports/deploy-validation/deploy-validation-20261104-1302.md
previous-issues: {ISSUE-01: open (parcial), ISSUE-03: open (parcial), ISSUE-04: open (re-verificada), ISSUE-05: resolved (os três registros contidos nomeiam 2aa013e/BMmvlQeM e passaram nesta sessão), ISSUE-07: open (parcial — registro corrigido; relatório de testes não), ISSUE-08: resolved (runbook.md:53 diz em que árvore se executa C1), ISSUE-09: resolved (01-release.md:77, :90 e medida nomeiam 41832829595 e 189 539)}
population: [ISSUE-01, -03, -04, -05, -07, -08, -09 do relatório anterior; version movida: 01-release, 97-changelog, 98-divergences, REL-0002 a REL-0005, runbook, smoke (1.4.0); intocado: REL-0001-config.md (1.1.0, o único)]
gate: lint_artifacts.py --stage deploy — 0 error, 0 warning, 10 arquivos (sem --emit)
staging-run: 41832829595 (1966c4a, push, tentativa 1, success; build 12:51:04–12:52:18Z, deploy 12:52:21–12:53:05Z)
rollback-rehearsed: reused — caminho C1 ensaiado em deploy-validation-20261104-1302.md; caminho B não reexecutado (alvo 41156803005 `success`, retido)
production: BLOCKED (OPEN-01 Esri aberto, DOMAIN.md 2026-11-03; origin/master = 05c3570; nada aprovado, acionado nem enviado a `edumatosr6-svg/kartle`)
divergences: []
feedbacks: []
---

# Relatório de validação de deploy — pista-kart-park (rodada 5)

## Evidence

| Prova | Resultado |
|---|---|
| Candidato do registro (P1) | `2aa013e` em `01-release.md` 1.4.0 (linhas 22, 77–79), `runbook.md` `<sha>`/`<hash>` `BMmvlQeM` — coerentes; `git diff --name-only 2aa013e ee9e9bc` fora de `600 Deploy/`: vazio |
| Ramo e execução (P1) | `git ls-remote staging` → `refs/heads/staging` = `1966c4a`; `gh run view 41832829595`: `headSha` `1966c4a7…`, evento `push`, tentativa 1, `success`, jobs `build` 12:51:04–12:52:18Z e `deploy` 12:52:21–12:53:05Z; é a mais nova de `gh run list -L 3` |
| Servido = build limpo de `2aa013e` (P1) | GET 13:31Z: `index.html` 6 592 B `3b0dfc3705f80a8f…`, `index-BMmvlQeM.js` 696 559 B `babb1884645d2c40…`, `index-q-biCwua.css` 10 850 B `5e1c964b3b292f33…` = hashes do `cmp` 3/3 do relatório 1302 (reutilizado; `Last-Modified: Wed, 04 Nov 2026 12:53:01 GMT` inalterado) |
| Frescor (P1) | build 2026-11-04T12:51–12:52Z > última edição de origem (`fbfb073` 2026-11-03T20:04:58Z; `2aa013e` testes) |
| Suíte local (P1) | `npx tsx --test tests/*.test.ts` na árvore de `2aa013e`: `ℹ tests 467 / pass 467 / fail 0 / cancelled 0 / skipped 0 / todo 0`, saída 0, 52 s; `npx tsx --test tests/pista-kart-park-*.test.ts` (12 arquivos): `ℹ tests 126 / pass 126 / fail 0 / skipped 0` |
| Veredito de testes mais novo (P1) | SUCCESS — `test-validation-20261103-2043.md` (467/467, 126 da feature, sobre `2aa013e`); carimbo `seed` do relatório ainda `b80f2635073f` (ISSUE-07) |
| Segredos (P2) | 0 padrões de token com corpo em `600 Deploy/`, `.github/`, `docs/`; `git grep import.meta.env\|process.env 2aa013e -- src index.html scripts`: 0; `REL-0001` (1.1.0, intocado) confere |
| Instalação (P3) | `python -I "600 Deploy/Output/pista-kart-park/tools/check_served.py" https://edumatosr6-svg.github.io/kartle-staging/ index-BMmvlQeM.js` → `status=200 js_bytes=696559 css_bytes=10850 cache_control='max-age=600' track_sha256=04ce5e510410e297…0f057b1 checks=79 failed=0` |
| Bundle (P3, NFR-0001/0006/0010/0014) | `check_bundle.py <3 arquivos servidos> tracks/registry.json` → `checks=88 failed=0 total_bytes=714001 track_bytes=43012 track_sha256=04ce5e51…`; `measure_dist.py` sobre os servidos `files=3 total_bytes=714001 gzip_bytes=189786 within_limit=True`; `npm run track -- verify kart-park 1`: V17/V18 `PASS`, `VERIFIED`; `tracks/registry.json` `publicationState` `STAGING` |
| Migração (P4) | não se aplica (`REL-0002` 1.4.0; DES-0012): nenhum banco, nenhum formato persistido; `git grep localStorage\|sessionStorage\|indexedDB 2aa013e -- src index.html`: 0 |
| Smoke (P5) | automático reutilizado do relatório 1302 sobre os mesmos bytes (D1, D3, D4, D5, D7/D8 parciais, D17, D19 parcial); humano: `docs/kart-park-device-log.md` sem entrada nova (`git log 2aa013e..ee9e9bc -- docs`: 0 commits) — ISSUE-01 |
| Reversão (P6) | C1 ensaiado em 1302 (reproduz `index-DmxsQuIL.js` de 41156803005); `runbook.md:53` diz agora executar C1 num checkout LF; alvo B 41156803005 `success`, retido; ponto sem retorno: não existe nesta release |
| Observabilidade (P7) | nenhum `console.*` novo de `e70aad9` a `2aa013e`; console do servido (1302): 0 erros, 1 aviso do three.js (`PCFSoftShadowMap`) |
| Flags e ordem (P8) | sem flag (ADR-0005); ocorrido = `runbook.md` *Promote* 7 / `REL-0003` etapa 2 (`git push staging master:staging`, 41832829595 verde, `check_served` 79/79 sobre `BMmvlQeM`) |
| Produção (D-DP-06) | `git ls-remote origin` → `master` = `05c3570`; nenhum comando contra `edumatosr6-svg/kartle` |

## Issues

### ISSUE-01
- severity: info
- check: P5
- class: porta humana (ambiental)
- status: open (parcial)
- file: `docs/kart-park-device-log.md`
- location: última entrada 2026-10-30 (`e70aad9`); `runbook.md` *Linhas humanas* H1–H12; `smoke.md` D2, D6, D9–D16, D18, D20–D22, M1–M13
- finding: nenhuma entrada sobre o build de `2aa013e` (`index-BMmvlQeM.js`); acabamento (H9–H12), taxa de quadros com ele (H11, NFR-0002) e sintética igual (H12/D22) não observados em aparelho.
- expected: entrada nova em `docs/kart-park-device-log.md` sobre `index-BMmvlQeM.js` com H1–H12 e as linhas M do celular nomeado, em paisagem e retrato.

### ISSUE-03
- severity: info
- check: P6
- class: ensaio parcial
- status: open (parcial)
- file: `600 Deploy/Output/pista-kart-park/98-divergences.md`
- location: DIV-DP-03; `runbook.md` R1/R2
- finding: o caminho B não foi repetido para o par 41156803005 ↔ 41832829595; o C1 de 1302 fica como prova do caminho C.
- expected: como no relatório anterior.

### ISSUE-04
- severity: info
- check: P6
- class: porta humana (decisão) — promoção BLOQUEADA
- status: open (re-verificada)
- file: `200 Requirements/220 Input/pista-kart-park/DOMAIN.md`
- location: linhas 31–32 (2026-11-03, OPEN-01 aberto); `runbook.md` precondição "Decisão Esri registrada"; *Promote* 11
- finding: OPEN-01 (Esri) continua aberto; `origin/master` = `05c3570`; nada aprovado, acionado nem enviado a produção.
- expected: como no relatório anterior.

### ISSUE-07
- severity: warning
- check: P1
- class: carimbo de seed errado
- status: open (parcial)
- file: `500 Tests/Output/pista-kart-park/reports/test-validation/test-validation-20261103-2043.md`
- location: front matter linha 9 (`seed: {revision: 2, digest: b80f2635073f}`)
- finding: o registro de deploy cita agora `49d733298158` (`01-release.md:33`, `97-changelog.md:326`), mas o relatório de testes mantém o carimbo errado e `pipeline_progress.py` segue mostrando `test drift` para a feature.
- expected: a próxima rodada do estágio de testes emite um relatório com o carimbo que `--seed-line pista-kart-park` imprime (`49d733298158`).

## Promotion question

Veredito **SUCCESS**: staging serve o build de `2aa013e` (41832829595 de `1966c4a`, 467/467; 126/126 desta feature), byte a byte igual ao build limpo (relatório 1302), `check_served` 79/79, `check_bundle` 88/88, arquivo da Kart Park `04ce5e51…` = registro em `STAGING`; correções ISSUE-08 e ISSUE-09 conferidas.

**Não há pergunta de promoção para esta release**: produção está **BLOQUEADA** pela decisão Esri (OPEN-01; ADR-0005; NFR-0012), `runbook.md` termina em *Promote* 11 ("parar"), e nada foi aprovado, acionado nem enviado a `edumatosr6-svg/kartle`. Reversão em staging: caminho B para 41156803005 (`600 Deploy/Output/pista-kart-park/runbook.md`, R1/R2); ponto sem retorno: não existe nesta release. Fica com Eduardo: as linhas humanas H1–H12 sobre `index-BMmvlQeM.js` (ISSUE-01) e a decisão Esri (ISSUE-04).
