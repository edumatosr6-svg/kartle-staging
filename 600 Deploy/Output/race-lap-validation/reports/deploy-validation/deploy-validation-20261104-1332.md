---
stage: deploy
feature: race-lap-validation
verdict: SUCCESS
generated: 2026-11-04T13:32:24Z
environment: staging — `https://edumatosr6-svg.github.io/kartle-staging/` (GitHub Pages, `edumatosr6-svg/kartle-staging`, ramo `staging`, workflow `pages`, D23)
commit: 2aa013e67de49fb842f42cda573b3b82df5cf824 (candidato do registro 1.4.0); servido em staging: 1966c4a7df7ff516ac7f7ab536907c3b0a7fd858 (só registros de `600 Deploy/Output/pista-kart-park/` sobre 2aa013e)
counts: {blocker: 0, error: 0, warning: 0, info: 4, divergence: 0}
seed: {revision: 3, digest: beee272fdb3b}
upstream: {stage: test, verdict: test-validation-20261103-1743.md (build e70aad9; aplicado a 2aa013e por contenção, aceita — ISSUE-20)}
round: 9
mode: revalidation (registro movido a `2aa013e` em ee9e9bc)
previous: deploy-validation-20261103-1805.md
previous-issues: {ISSUE-01: open (parcial), ISSUE-02: open (parcial — opção 1 registrada, Esri aberto), ISSUE-03: open (re-verificada)}
population: [ISSUE-01..-03 do relatório anterior; version movida: 01-release, 97-changelog, 98-divergences, REL-0001, REL-0003, REL-0005, runbook, smoke (1.4.0); intocados amostrados: REL-0002-migration.md, REL-0004-mobile.md (1.3.0)]
gate: lint_artifacts.py --stage deploy — 0 error, 0 warning, 10 arquivos (sem --emit)
staging-run: 41832829595 (1966c4a, push, tentativa 1, success; build 12:51:04–12:52:18Z, deploy 12:52:21–12:53:05Z)
rollback-target: 41156803005 (1bb63aa, success, retida); 41076989728 para tirar esta rodada
rollback-rehearsed: reused — caminho C1 ensaiado em deploy-validation-20261104-1302.md de pista-kart-park (reproduz byte a byte o bundle de 41156803005); caminho B não reexecutado
production: não tocada; `git ls-remote origin` → master = 05c3570; nada aprovado, acionado nem enviado
feedbacks: []
---

# Relatório de validação de deploy — race-lap-validation (rodada 9)

## Evidence

| Prova | Resultado |
|---|---|
| Candidato do registro (P1) | `2aa013e` em `01-release.md` 1.4.0 *Proveniência*, `runbook.md:22` `<sha>`, `REL-0003`, `smoke.md` — coerentes |
| Ramo e execução (P1) | `git ls-remote staging` → `refs/heads/staging` = `1966c4a`; `gh run list -R edumatosr6-svg/kartle-staging -L 3`: 41832829595 (`1966c4a`, `success`, 2026-11-04T12:51:01Z) é a mais nova; `git diff --name-only 2aa013e ee9e9bc` fora de `600 Deploy/`: vazio |
| Servido = build limpo de `2aa013e` (P1) | GET 13:31Z: `index.html` 6 592 B sha256 `3b0dfc3705f80a8f…`, `index-BMmvlQeM.js` 696 559 B `babb1884645d2c40…`, `index-q-biCwua.css` 10 850 B `5e1c964b3b292f33…` = os hashes do `cmp` 3/3 contra o build limpo em `600 Deploy/Output/pista-kart-park/reports/deploy-validation/deploy-validation-20261104-1302.md` (evidência reutilizada; bytes servidos inalterados desde então, `Last-Modified: Wed, 04 Nov 2026 12:53:01 GMT`) |
| Frescor (P1) | build 12:51–12:52Z de 2026-11-04 > última edição de origem (`fbfb073`/`2aa013e`, 2026-11-03) |
| Contenção `e70aad9` → `2aa013e` (P1) | `git diff --quiet e70aad9 2aa013e -- src/lap.ts src/lapMessages.ts src/lapTiming.ts src/frameClock.ts src/trackData.ts src/track.ts src/physics.ts index.html src/style.css tests/race-lap-validation-*`: sem diferença; código mudado só `src/trackScene.ts` (importado só por `src/main.ts:15`, cena visual, 0 `console.*` novos) e `src/main.ts:239` `ground.visible = !(ready && trackGeometry)` dentro de `chooseTrack`, fora de `renderTrainingResult`/`renderResult`/botões; `.github`, `package*.json`, `tsconfig.json`, `.nvmrc` sem diferença |
| Suíte local (P1) | `npx tsx --test tests/*.test.ts` na árvore de `2aa013e`: `ℹ tests 467 / pass 467 / fail 0 / cancelled 0 / skipped 0 / todo 0`, saída 0, 52 s; `npx tsx --test tests/race-lap-validation-*.test.ts` (14 arquivos): `ℹ tests 179 / pass 179 / fail 0 / skipped 0` |
| Pipeline do servido (P1) | *Test* 467/467, *Build* `index-BMmvlQeM.js`, *Measure dist* `total_bytes=714001 gzip_bytes=189539` (log reduzido no relatório 1302 de pista-kart-park, reutilizado) |
| Veredito de testes (P1) | SUCCESS — `test-validation-20261103-1743.md` (rodada 6, seed rev 3, build `e70aad9`, 179/179); nenhum veredito sobre `2aa013e` para esta featura (ISSUE-20) |
| Segredos (P2) | 0 padrões de token com corpo em `600 Deploy/`, `.github/`, `docs/`; `git grep import.meta.env\|process.env 2aa013e -- src index.html scripts`: 0 — `REL-0001` "nenhuma" confere |
| Instalação (P3) | `python -I "600 Deploy/Output/race-lap-validation/tools/check_served.py" https://edumatosr6-svg.github.io/kartle-staging/ index-BMmvlQeM.js` → `status=200 js_bytes=696559 css_bytes=10850 cache_control='max-age=600' checks=53 failed=0` |
| NFR observado (P5) | RNF02: `measure_dist.py` sobre os 3 arquivos servidos `files=3 total_bytes=714001 gzip_bytes=189786 within_limit=True ratio=0.227` (limite 3 145 728); RNF01, RNF03 (fps), contagem de 3 s: não medidos (linhas humanas; `requestAnimationFrame` a 1–2 fps sob automação) |
| Migração (P4) | não se aplica — `git grep localStorage\|sessionStorage\|indexedDB\|fetch(\|XMLHttpRequest\|WebSocket\|sendBeacon 2aa013e -- src index.html`: 0 |
| Smoke humano (P5) | `docs/lap-validation-device-log.md`: última entrada 2026-10-30 sobre `e70aad9`/`index-DmxsQuIL.js`; nada sobre `index-BMmvlQeM.js` (ISSUE-01) |
| Reversão (P6) | alvo B 41156803005 (`1bb63aa`) `success`, retido; ensaio C1 de 1302 (`git revert 2aa013e fbfb073`) reproduz `index-DmxsQuIL.js` `79e3182c…` desse alvo; `runbook.md:168` ponto sem retorno: não existe nesta release |
| Logs (P7) | `git grep console.(log\|warn\|error\|info) 2aa013e -- src`: 6, nenhum novo de `e70aad9` a `2aa013e`; console do servido (1302): 0 erros, 1 aviso do three.js |
| Flag e rollout (P8) | sem flag (DES-0007); ordem de `REL-0003` (push a `staging` → `pages` → `check_served`) = 41832829595 (evento `push`, `1966c4a`) seguida de `check_served` 53/53 |
| Produção | `git ls-remote origin` → `master` = `05c3570`; nenhum comando contra `edumatosr6-svg/kartle` |

## Issues

### ISSUE-01
- severity: info
- check: P5
- class: porta humana (ambiental)
- status: open (parcial)
- file: `docs/lap-validation-device-log.md`
- location: última entrada *Execução no celular — 2026-10-30*; `runbook.md` *Linhas humanas* H1–H6; `98-divergences.md` DIV-DP-06
- finding: nenhuma entrada sobre o build de `2aa013e` (`index-BMmvlQeM.js`); a execução 3 (notebook e celular nomeados, fps, carga 4G, quatro navegadores) não existe.
- expected: execução 3 registrada sobre `index-BMmvlQeM.js` com H1–H6 (inclusive M11 30 fps, M13/M14 em paisagem e retrato) e o modelo, navegador e versão do celular.

### ISSUE-02
- severity: info
- check: P6
- class: decisão do dono do produto — promoção BLOQUEADA
- status: open (parcial)
- file: `200 Requirements/220 Input/pista-kart-park/DOMAIN.md`
- location: linhas 31–32 (2026-11-03); `runbook.md` *Produção — as opções enquanto a decisão Esri não existe*
- finding: a opção de produção 1 (esperar Esri) está registrada; OPEN-01 (Esri) continua aberto, e promover este build é promover a Kart Park.
- expected: decisão Esri registrada antes de qualquer pergunta de promoção.

### ISSUE-03
- severity: info
- check: P6
- class: ensaio reutilizado
- status: open (re-verificada)
- file: `600 Deploy/Output/race-lap-validation/runbook.md`
- location: R1 caminho B; linha 25 (execução anterior 41156803005)
- finding: o caminho B para 41156803005 não foi reexecutado; o ensaio C1 do relatório 1302 de pista-kart-park reproduz byte a byte o bundle desse alvo.
- expected: nenhuma ação nesta rodada.

### ISSUE-20
- severity: info
- check: P1
- class: veredito de testes por contenção
- status: new
- file: `600 Deploy/Output/race-lap-validation/01-release.md`
- location: *Proveniência*, linhas "Veredito de testes" e "Mudança do build `e70aad9` → `2aa013e` e contenção"
- finding: o veredito mais novo da feature (`test-validation-20261103-1743.md`) julgou `e70aad9`, não `2aa013e`; a contenção foi aceita porque o commit é nomeado e construído pelo pipeline, nenhum arquivo de origem ou teste da feature muda, o delta é só de cena (`src/trackScene.ts`, `src/main.ts:239`), e as 179 verificações da feature passaram frescas sobre `2aa013e` (local, CI 41832829595 e veredito 20261103-2043 de pista-kart-park).
- expected: a próxima rodada de `test-loop` desta feature nomeia o build que julga; se a contenção deixar de valer (qualquer mudança em arquivo rastreado da feature), veredito de testes novo antes deste estágio.

## Promotion question

Veredito **SUCCESS**: staging serve `2aa013e` (41832829595, 467/467; 179/179 desta feature), `check_served` 53/53, RNF02 714 001 B (22,7 %); o veredito de testes de `e70aad9` vale para `2aa013e` por contenção (ISSUE-20). Não é uma promoção, e hoje não há pergunta de promoção: produção está **BLOQUEADA** pela decisão Esri (opção 1 escolhida; ISSUE-02) e falta a execução 3 (ISSUE-01). Runbook: `600 Deploy/Output/race-lap-validation/runbook.md` (passo 9; reversão R1 caminho B para 41156803005); ponto sem retorno: não existe nesta release.
