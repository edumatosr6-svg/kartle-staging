---
stage: deploy
feature: pista-kart-park
verdict: SUCCESS
generated: 2026-11-09T14:16:24Z
environment: staging — `https://edumatosr6-svg.github.io/kartle-staging/` (GitHub Pages, `edumatosr6-svg/kartle-staging`, ramo `staging`, `.github/workflows/pages.yml`, D23)
commit: 3d5dfdd5fdf7526b1536c78cbb62d3aa7707e91f (candidato do registro 2.0.0; registro em 6db6e11, que só muda `600 Deploy/`)
counts: {blocker: 0, error: 0, warning: 1, info: 4, divergence: 0}
seed: {revision: 3, digest: 1fe5243f7e36}
upstream: {stage: test, verdict: test-validation-20261107-0052.md}
round: 1 (seed revisão 3)
mode: revalidation (candidato novo 2aa013e → 3d5dfdd; todos os arquivos do registro com version movida)
previous: reports/deploy-validation/deploy-validation-20261104-1340.md
previous-issues: {ISSUE-01: open (re-verificada; agora sobre index-DszUW7WJ.js), ISSUE-03: resolved (caminho B ensaiado nesta rodada para o par 41832829595 ↔ 42320960893), ISSUE-04: open (re-verificada), ISSUE-07: resolved (test-validation-20261107-0052.md carimba 1fe5243f7e36 = --seed-line)}
population: [ISSUE-01, -03, -04, -07 do relatório anterior; version movida: 01-release, 97-changelog, 98-divergences, REL-0001 (1.2.0), REL-0002 a REL-0005, runbook, smoke (2.0.0); intocado: nenhum]
gate: lint_artifacts.py --stage deploy — 0 error, 0 warning, 10 arquivos (executado pelo loop; não re-julgado)
staging-run: 42320960893 (3d5dfdd, push; tentativa 1 2026-11-07 success; tentativa 2 2026-11-09 success — roll forward deste ensaio, build 14:13:04–14:15:00Z, deploy 14:15:03–14:15:28Z)
rollback-rehearsed: yes — caminho B: rerun de 41832829595 (tentativa 2, 14:10:50Z → index-BMmvlQeM.js servido 14:12:50Z), roll forward por rerun de 42320960893 (tentativa 2, 14:13:00Z → index-DszUW7WJ.js servido 14:15:39Z)
production: BLOCKED (OPEN-01 Esri aberto; origin/master = 05c3570; https://edumatosr6-svg.github.io/kartle/ 404; nenhum comando contra edumatosr6-svg/kartle)
divergences: []
feedbacks: []
---

# Relatório de validação de deploy — pista-kart-park (seed revisão 3, rodada 1)

## Evidence

| Prova | Resultado |
|---|---|
| Candidato e árvore (P1) | `3d5dfdd` ponta de `master` antes de `6db6e11`; `git diff --name-only 3d5dfdd 6db6e11` fora de `600 Deploy/`: vazio; `git diff --name-only 671d125 3d5dfdd`: só Markdown (`DOMAIN.md`, `500 Tests/Output/`); contra `2aa013e`, na árvore construída, só `src/main.ts`, `src/trainingSession.ts`, `src/tracks/kart-park-v2.json` |
| Construído pelo pipeline (P1) | `git ls-remote staging` → `refs/heads/staging` = `3d5dfdd`; `gh run view 42320960893`: `push`, `headSha` `3d5dfdd5…`, tentativa 1 `success` (build 2026-11-07T00:53:39–00:55:10Z, deploy 00:55:13–00:55:22Z); log reduzido: Node v24.22.2, `tests 477 / pass 477 / fail 0 / skipped 0`, *Build* `index-DszUW7WJ.js 690.59 kB`, `index-q-biCwua.css`, *Measure dist* `total_bytes=708040 gzip_bytes=186379 within_limit=True` |
| Servido = build limpo (P1) | `git archive 3d5dfdd` (LF) → `npm ci` → `MSYS_NO_PATHCONV=1 npx vite build --base=/kartle-staging/`: `index.html` 6 592 B `36e5e39cd548a309…`, `index-DszUW7WJ.js` 690 598 B `282419aab4b20d2b…`, `index-q-biCwua.css` 10 850 B `5e1c964b3b292f33…`; `cmp` contra o servido: 3/3 iguais (GET 14:07Z, `Last-Modified` 2026-11-07 00:55:17 GMT; e de novo 14:16Z após o roll forward, `Last-Modified` 2026-11-09 14:15:21 GMT) |
| Suíte local (P1) | `npm test` na árvore de `3d5dfdd`: `tests 477 / pass 477 / fail 0 / cancelled 0 / skipped 0`, saída 0, 59 s; `npm run track -- verify kart-park 2`: 20 `PASS`, 0 `FAIL`, `VERIFIED`, saída 0 |
| Frescor (P1) | build 2026-11-07T00:53Z (e 2026-11-09T14:13Z) > última edição de origem `671d125` 2026-11-06T19:51:48Z (código `06582f8` 19:13:00Z) |
| Veredito de testes mais novo (P1) | `test-validation-20261107-0052.md`: `SUCCESS`, 477/477, 136 da feature, `fresh: true`, `seed: {revision: 3, digest: 1fe5243f7e36}` = `pipeline_progress.py --seed-line` |
| Segredos (P2) | `git grep` de padrões de token em `600 Deploy/`, `.github/`, `docs/`: 0; `import.meta.env`/`process.env` em `src`, `index.html`, `scripts` de `3d5dfdd`: 0; `secrets.`/`env:` no workflow: 0 (permissões `contents: read`, `pages: write`, `id-token: write`); padrões de token nos três logs de execução reduzidos: 0; `REL-0001` 1.2.0 confere (nenhuma variável lida) |
| Instalação (P3) | `check_served.py https://edumatosr6-svg.github.io/kartle-staging/ index-DszUW7WJ.js` → `status=200 js_bytes=690598 css_bytes=10850 cache_control='max-age=600' track_sha256=c79f14cb…4d20a checks=84 failed=0` |
| Bundle (P3; NFR-0001/0006/0010) | `check_bundle.py <build limpo> tracks/registry.json` → `checks=94 failed=0 total_bytes=708040 track_bytes=36584 track_sha256=c79f14cb…`; `measure_dist.py` local `files=3 total_bytes=708040 gzip_bytes=186791 within_limit=True`; `git ls-files --eol` dos cinco arquivos de pista: `attr/-text`, `i/crlf w/crlf` nas duas origens, `i/lf w/lf` nos outros três |
| Migração (P4) | não se aplica (`600 Deploy/Input/` não declara banco nem verificação de histórico; `REL-0002` 2.0.0): `localStorage`/`sessionStorage`/`indexedDB` em `src`/`index.html` de `3d5dfdd`: 0; nenhum backfill |
| Smoke automático (P5) | Chromium headless na URL de staging (14:09Z): um JS `index-DszUW7WJ.js`; seletor 2 opções, "Kart Park — São José dos Pinhais (réplica não oficial) · 691 m" `aria-pressed=true`, "Pista sintética" `false`; `#track-name` igual; `#track-credit` "© colaboradores do OpenStreetMap · licença ODbL · openstreetmap.org/copyright", `href` `https://openstreetmap.org/copyright`, `target=_blank rel=noopener noreferrer`; `#track-status` `kart-park`; `#lap-offer` 1 botão ("treino"); `#lap-training-result-credit` dentro de `#lap-training-result`, `#lap-result-credit` ausente; "traçado aproximado"/"687 m": 0; `41,45`: 0 ("recorde" só no texto de marketing do `index.html`, inalterado desde `2aa013e`); `isSecureContext` true; sintética → crédito oculto, `synthetic`; volta → crédito visível, `kart-park`; treino iniciado e encerrado → `#welcome` visível, `#lap-result` oculto; armazenamento 0 |
| Smoke humano (P5) | D2, D6, D9–D16, D18–D22, M1–M13 / H1–H12: `docs/kart-park-device-log.md` sem entrada sobre `3d5dfdd` (último commit `1bb63aa`, 2026-10-30) — ISSUE-01 |
| NFR observado (P5) | RNF02: 708 040 B brutos (22,5 % de 3 145 728), 186 379 gzip no workflow; NFR-0001: literal 36 584 B (< 200 000); NFR-0006: `c79f14cb…` = entrada `kart-park` 2; NFR-0010: recursos do site = 1 JS + 1 CSS |
| Reversão ensaiada (P6) | caminho B: `gh run rerun 41832829595` às 14:10:50Z → tentativa 2 (`1966c4a`; 467/467; `index-BMmvlQeM.js`; build 14:10:55–14:12:05Z, deploy 14:12:08–14:12:36Z) → servido 14:12:50Z (**2 min 0 s**); `check_served_v1.py` (de `1966c4a`) `checks=79 failed=0`, JS `babb1884645d2c40…` = medido em 1340, "traçado aproximado" 1, "réplica não oficial" 0; a ferramenta desta release reprova por projeto (`checks=84 failed=11`) |
| Roll forward (P6) | `gh run rerun 42320960893` às 14:13:00Z → tentativa 2 (`3d5dfdd`; 477/477; `index-DszUW7WJ.js`; `total_bytes=708040`) → servido 14:15:39Z (**2 min 39 s**); `cmp` 3/3 com o build limpo; `check_served` `checks=84 failed=0` |
| Observabilidade (P7) | novos `console.*` de `2aa013e` a `3d5dfdd`: 2 `console.warn('track-data', …)` só com códigos e `trackId`/`trackVersion`; console capturado: 0 `track-data`, 1 aviso three.js (`PCFSoftShadowMap`), 1 erro 404 de `https://edumatosr6-svg.github.io/favicon.ico` (ISSUE-02); nenhum conteúdo de jogador, aparelho ou sensor |
| Flags e ordem (P8) | sem flag (ADR-0005); ocorrido = `REL-0003` etapa 2 / `runbook.md` *Promote* 7 (push `3d5dfdd` → 42320960893) e o ensaio = R1/R2 caminho B |
| Produção (D-DP-06) | `git ls-remote origin` → `master` = `05c3570`; `https://edumatosr6-svg.github.io/kartle/` 404 (GET 14:16Z); `gh run list -R edumatosr6-svg/kartle`: 39827702391 `waiting`, intocada; nenhum push nem comando contra `edumatosr6-svg/kartle` |
| Estado final de staging | `refs/heads/staging` = `3d5dfdd`; serve `index-DszUW7WJ.js` pela execução 42320960893 tentativa 2 (`Last-Modified: Mon, 09 Nov 2026 14:15:21 GMT`) |

## Issues

### ISSUE-01
- severity: info
- check: P5
- class: porta humana (ambiental)
- status: open (re-verificada)
- file: `docs/kart-park-device-log.md`
- location: último commit `1bb63aa` (2026-10-30); `runbook.md` *Linhas humanas* H1–H12; `smoke.md` D2, D6, D9–D16, D18–D22, M1–M13
- finding: nenhuma entrada sobre o build de `3d5dfdd` (`index-DszUW7WJ.js`): traçado da réplica, rótulo, acabamento sobre a versão 2 e taxa de quadros (H11, NFR-0002) não observados em aparelho.
- expected: entrada nova do dono do produto sobre `index-DszUW7WJ.js` com H1–H12 e as linhas M do celular nomeado, em paisagem e retrato.

### ISSUE-02
- severity: warning
- check: P5
- class: smoke D5/M5 com erro de console fora da aplicação
- status: new
- file: `index.html` (inalterado desde `2aa013e`); `600 Deploy/Output/pista-kart-park/smoke.md`
- location: `smoke.md` D5 (limiar "0 erros"); `runbook.md` gatilhos de reversão ("erro no console ao carregar")
- finding: o carregamento registra `Failed to load resource: 404` de `https://edumatosr6-svg.github.io/favicon.ico` (pedido do navegador fora da base, sem `<link rel="icon">` na página), o que contraria a letra de D5 e de um gatilho de reversão.
- expected: a página declara um ícone sob a base, ou `smoke.md` D5/M5 e o gatilho excluem com nome o 404 do favicon pedido pelo navegador.

### ISSUE-03
- severity: info
- check: P5
- class: texto esperado do smoke diferente do observado
- status: new
- file: `600 Deploy/Output/pista-kart-park/smoke.md`
- location: D4 ("`#lap-offer` com exatamente um botão, 'volta de treino'"); D7; `runbook.md` *Verify* 4
- finding: o botão servido diz "treino" (`src/lapMessages.ts:34` `startTraining` pt), não "volta de treino".
- expected: D4/D7 e *Verify* 4 citam o rótulo "treino" (en "training") do botão único.

### ISSUE-04
- severity: info
- check: P6
- class: porta humana (decisão) — promoção BLOQUEADA
- status: open (re-verificada)
- file: `200 Requirements/220 Input/pista-kart-park/DOMAIN.md`
- location: linhas 23–24, 32, 37 (OPEN-01 aberto; vale para a réplica); `runbook.md` *Promote* 11
- finding: OPEN-01 (Esri) continua aberto; `origin/master` = `05c3570`; produção 404; nada aprovado, acionado nem enviado.
- expected: como no relatório anterior.

### ISSUE-05
- severity: info
- check: P6
- class: registro atrás do ensaio
- status: new
- file: `600 Deploy/Output/pista-kart-park/98-divergences.md`; `runbook.md`; `REL-0002-migration.md`
- location: DIV-DP-03; `runbook.md` caminho B ("não repetido para o par 41832829595 ↔ 42320960893"), *Preconditions* "Alvo de reversão"; `REL-0002` revisão 3; DIV-DP-17 (C1 não ensaiado)
- finding: o caminho B foi ensaiado nesta rodada para o par 41832829595 ↔ 42320960893 (reversão 2 min 0 s, restauração 2 min 39 s, até o servido), mas o registro ainda o dá como não repetido; C1 segue não ensaiado.
- expected: a próxima rodada do gerador registra o ensaio de 2026-11-09 com estas durações e as execuções nas tentativas 2; C1 como na DIV-DP-17.

## Promotion question

Veredito **SUCCESS**: staging serve o build de `3d5dfdd` (42320960893, tentativa 2, 477/477), byte a byte igual ao build limpo, `check_served` 84/84, `check_bundle` 94/94, arquivo da Kart Park versão 2 `c79f14cb…` = registro em `STAGING`; reversão B e roll forward demonstrados nesta rodada.

**Não há pergunta de promoção para esta release**: produção está **BLOQUEADA** pela decisão Esri (OPEN-01; ADR-0005; NFR-0012; vale para a réplica), `600 Deploy/Output/pista-kart-park/runbook.md` termina em *Promote* 11 ("parar"), e nada foi aprovado, acionado nem enviado a `edumatosr6-svg/kartle`. Reversão em staging: caminho B para 41832829595 (R1/R2); ponto sem retorno: não existe nesta release. Ficam com Eduardo: H1–H12 sobre `index-DszUW7WJ.js` (ISSUE-01) e a decisão Esri (ISSUE-04).
