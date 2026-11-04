---
stage: deploy
feature: dirigibilidade
verdict: SUCCESS
generated: 2026-11-04T13:36:03Z
environment: staging — `https://edumatosr6-svg.github.io/kartle-staging/` (GitHub Pages, `edumatosr6-svg/kartle-staging`, ramo `staging`, `.github/workflows/pages.yml`)
commit: 2aa013e67de49fb842f42cda573b3b82df5cf824 (candidato do registro 2.2.0); servido em staging: 1966c4a7df7ff516ac7f7ab536907c3b0a7fd858 (só registros de `600 Deploy/Output/pista-kart-park/` sobre 2aa013e)
counts: {blocker: 0, error: 0, warning: 0, info: 5, divergence: 0}
seed: {revision: 6, digest: dbf86f325606}
upstream: {stage: test, verdict: test-validation-20261030-1638.md (árvore anterior a e70aad9; aplicado a 2aa013e por contenção, aceita — ISSUE-10)}
round: 5
mode: revalidation (registro movido a `2aa013e` em ee9e9bc)
previous: deploy-validation-20261103-1808.md
previous-issues: {ISSUE-09: resolved (`smoke.md:16` e `01-release.md:60` dizem que o log existe desde `1bb63aa`), ISSUE-01: open (parcial), ISSUE-05: open (re-verificada), ISSUE-06: open (parcial — aceitação registrada), ISSUE-07: open (parcial — opção 1 registrada, Esri aberto)}
population: [ISSUE-09, -01, -05, -06, -07 do relatório anterior; version movida: 01-release, 97-changelog, 98-divergences, REL-0001, REL-0003, REL-0004, REL-0005, runbook, smoke (2.2.0); intocado: REL-0002-migration.md (2.0.0, o único)]
gate: lint_artifacts.py --stage deploy — 0 error, 0 warning, 10 arquivos (sem --emit)
staging-run: 41832829595 (1966c4a, push, tentativa 1, success; build 12:51:04–12:52:18Z, deploy 12:52:21–12:53:05Z)
rollback-target: 41156803005 (1bb63aa, success, retida); 41076989728 para tirar o acerto v6
rollback-rehearsed: reused — caminho C1 ensaiado em deploy-validation-20261104-1302.md de pista-kart-park (reproduz byte a byte o bundle de 41156803005); caminho B não reexecutado
production: não tocada; `git ls-remote origin` → master = 05c3570; nada aprovado, acionado nem enviado
feedbacks: []
---

# Relatório de validação de deploy — dirigibilidade (rodada 5)

## Evidence

| Prova | Resultado |
|---|---|
| Candidato do registro (P1) | `2aa013e` em `01-release.md` 2.2.0 *Commit verificado*, `runbook.md` `<sha>`/`<hash>` `BMmvlQeM`, execução anterior 41156803005 (`runbook.md:26`) — coerentes |
| Ramo e execução (P1) | `git ls-remote staging` → `refs/heads/staging` = `1966c4a`; `gh run list -R edumatosr6-svg/kartle-staging -L 3`: 41832829595 (`1966c4a`, `push`, `success`) é a mais nova; `git diff --name-only 2aa013e ee9e9bc` fora de `600 Deploy/`: vazio |
| Servido = build limpo de `2aa013e` (P1) | GET 13:31Z: `index.html` `3b0dfc3705f80a8f…`, `index-BMmvlQeM.js` 696 559 B `babb1884645d2c40…`, `index-q-biCwua.css` `5e1c964b3b292f33…` = hashes do `cmp` 3/3 contra o build limpo no relatório `600 Deploy/Output/pista-kart-park/reports/deploy-validation/deploy-validation-20261104-1302.md` (reutilizado; `Last-Modified` inalterado, 12:53:01 GMT) |
| Frescor (P1) | build 2026-11-04T12:51–12:52Z > última edição de origem (`2aa013e`, 2026-11-03) |
| Contenção `e70aad9` → `2aa013e` (P1) | `git diff --quiet e70aad9 2aa013e -- src/physics.ts src/handlingMessages.ts src/setupRecords.ts src/maneuvers.ts src/audio.ts src/lap.ts src/lapMessages.ts src/track.ts src/trackData.ts src/trainingSession.ts src/style.css index.html scripts docs/physics.md tests/dirigibilidade-* tests/physics.test.ts tests/maneuvers.test.ts tests/helpers` (todos os caminhos de `400 Code/Output/dirigibilidade/`): sem diferença; só `src/trackScene.ts` (cena, importado só por `src/main.ts`) e `src/main.ts:239` (visibilidade do chão) mudam; `.github`, `package*.json`, `tsconfig.json`, `.nvmrc` sem diferença |
| Suíte local (P1) | `npx tsx --test tests/*.test.ts` na árvore de `2aa013e`: `ℹ tests 467 / pass 467 / fail 0 / cancelled 0 / skipped 0 / todo 0`, saída 0, 52 s; `npx tsx --test tests/dirigibilidade-*.test.ts` (9 arquivos): `ℹ tests 65 / pass 65 / fail 0 / skipped 0` |
| Banco de ensaio (P5) | `npm run bench:handling`: 56 linhas `"verdict":"PASS"`, 0 outras, saída 0 (inclui `SETUP_VERSION` v6/v4 com 2/2 registros antigos lidos, `STEP_CONTRACT` inalterado, `REALISTA_UNCHANGED` 0 medidas diferentes) |
| Veredito de testes (P1) | SUCCESS — `test-validation-20261030-1638.md` (rodada 3, seed rev 6, 65 desta feature); nenhum veredito sobre `2aa013e` para esta feature (ISSUE-10) |
| Segredos (P2) | 0 padrões de token com corpo em `600 Deploy/`, `.github/`, `docs/`; `git grep import.meta.env\|process.env 2aa013e -- src index.html scripts`: 0 — `REL-0001` confere |
| Instalação (P3) | `python -I "600 Deploy/Output/dirigibilidade/tools/check_served.py" https://edumatosr6-svg.github.io/kartle-staging/ index-BMmvlQeM.js` → `status=200 js_bytes=696559 cache_control='max-age=600' checks=22 failed=0` |
| Bundle (P3/P5) | `python -I "600 Deploy/Output/dirigibilidade/tools/check_bundle.py" <3 arquivos servidos> docs/physics.md` → `checks=25 failed=0 js=index-BMmvlQeM.js` (v6 corrente com v4 anterior, v5 ausente, sem drift/turbo) |
| NFR observado (P5) | RNF02: 714 001 B brutos (22,7 % de 3 145 728), `measure_dist.py` sobre os servidos `gzip_bytes=189786 within_limit=True`; fps (D12, M9), carga 4G (D2/M2): não medidos (linhas humanas; `requestAnimationFrame` a 1–2 fps sob automação) |
| Migração (P4) | não se aplica — `REL-0002` (2.0.0): nenhum formato persistido; `git grep localStorage\|sessionStorage\|indexedDB 2aa013e -- src index.html`: 0; leitura dos registros v4 pelo leitor v6 provada pelo banco (`oldRecordsReadOkCount: 2`) |
| Smoke humano (P5) | `docs/handling-device-log.md`: só a execução qualitativa de 2026-10-30 sobre `e70aad9`; nada sobre `index-BMmvlQeM.js` (ISSUE-01) |
| Reversão (P6) | alvo B 41156803005 (`1bb63aa`) `success`, retido; ensaio C1 de 1302 reproduz `index-DmxsQuIL.js` `79e3182c…` desse alvo; `REL-0002`/`runbook` sem ponto sem retorno (correção do v6 é um v7) |
| Logs (P7) | nenhum `console.*` novo de `e70aad9` a `2aa013e`; console do servido (1302): 0 erros, 1 aviso do three.js |
| Flag e rollout (P8) | sem flag (decisão do projeto); ordem de `REL-0003` (push a `staging` → `pages` → `check_served`) = 41832829595 (`push`, `1966c4a`) seguida de `check_served` 22/22 |
| Produção | `git ls-remote origin` → `master` = `05c3570`; nenhum comando contra `edumatosr6-svg/kartle` |

## Issues

### ISSUE-01
- severity: info
- check: P5
- class: porta humana (ambiental)
- status: open (parcial)
- file: `docs/handling-device-log.md`
- location: *Execução no celular — 2026-10-30*; `runbook.md` *Linhas humanas* H1–H5; `98-divergences.md` DIV-DP-01, DIV-DP-07
- finding: nenhuma entrada sobre o build de `2aa013e` (`index-BMmvlQeM.js`); nenhuma linha H1–H5 fechada.
- expected: entrada nova sobre `index-BMmvlQeM.js` com H1–H5 (notebook e celular nomeado, fps ≥ 60/≥ 30, `STEP_COST` ≤ 1,10×, carga 4G) e modelo, navegador e versão do celular.

### ISSUE-05
- severity: info
- check: P6
- class: ensaio reutilizado
- status: open (re-verificada)
- file: `600 Deploy/Output/dirigibilidade/runbook.md`
- location: R1 caminho B; linha 71
- finding: o par 41156803005 ↔ 41832829595 não foi reexecutado; o ensaio C1 do relatório 1302 de pista-kart-park reproduz byte a byte o bundle do alvo B.
- expected: nenhuma ação nesta rodada.

### ISSUE-06
- severity: info
- check: P5
- class: registro atrás do estado
- status: open (parcial)
- file: `600 Deploy/Output/dirigibilidade/98-divergences.md`
- location: DIV-DP-13 (linha 31, `open`); `200 Requirements/220 Input/dirigibilidade/DOMAIN.md:104`
- finding: o dono do produto aceitou em 2026-11-03 o `#lap-share` inalcançável (D14, M10 saem das linhas a executar), mas DIV-DP-13 continua `open` e não cita a decisão.
- expected: DIV-DP-13 passa a `waived` citando `DOMAIN.md:104`, e D14/M10 marcadas fora das linhas a executar até a volta oficial ser ofertada.

### ISSUE-07
- severity: info
- check: P8
- class: decisão humana pendente — promoção BLOQUEADA
- status: open (parcial)
- file: `200 Requirements/220 Input/pista-kart-park/DOMAIN.md`
- location: linhas 31–32 (2026-11-03); `01-release.md` *Promoção — a árvore contém a Kart Park*; `98-divergences.md` DIV-DP-14
- finding: a opção 1 (esperar Esri) está registrada; OPEN-01 (Esri) continua aberto e não existe commit com o acerto v6 sem a Kart Park.
- expected: decisão Esri registrada pelo dono do produto; nenhum loop promove.

### ISSUE-10
- severity: info
- check: P1
- class: veredito de testes por contenção
- status: new
- file: `600 Deploy/Output/dirigibilidade/01-release.md`
- location: *Proveniência* linhas 45 e 49 ("Veredito de testes", "Mudança `e70aad9` → `2aa013e` e contenção")
- finding: o veredito mais novo da feature (`test-validation-20261030-1638.md`) julgou uma árvore anterior a `e70aad9`, agora levada a `2aa013e` por uma terceira contenção encadeada; aceita nesta rodada porque o commit é nomeado e construído pelo pipeline, nenhum caminho rastreado da feature muda de `e70aad9` a `2aa013e`, e as 65 verificações e o banco (56 PASS) passaram frescos sobre `2aa013e`.
- expected: a próxima rodada de `test-loop` desta feature nomeia o build que julga; qualquer mudança em caminho rastreado da feature exige veredito de testes novo antes deste estágio.

## Promotion question

Veredito **SUCCESS**: staging serve `2aa013e` (41832829595, 467/467; 65/65 desta feature; banco 56 PASS), `check_served` 22/22, `check_bundle` 25/25, RNF02 714 001 B (22,7 %); o veredito de testes vale para `2aa013e` por contenção (ISSUE-10). Não é uma promoção, e hoje não há pergunta de promoção: produção está **BLOQUEADA** pela decisão Esri (opção 1 escolhida; ISSUE-07) e faltam as linhas H1–H5 sobre `index-BMmvlQeM.js` (ISSUE-01). Runbook: `600 Deploy/Output/dirigibilidade/runbook.md` (reversão R1 caminho B para 41156803005); ponto sem retorno: não existe nesta release.
