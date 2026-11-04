---
stage: deploy
feature: modelo-kart-01
verdict: SUCCESS
generated: 2026-11-04T13:38:07Z
environment: staging — `https://edumatosr6-svg.github.io/kartle-staging/` (GitHub Pages, `edumatosr6-svg/kartle-staging`, ramo `staging`, `.github/workflows/pages.yml`)
commit: 2aa013e67de49fb842f42cda573b3b82df5cf824 (candidato do registro 1.3.0); servido em staging: 1966c4a7df7ff516ac7f7ab536907c3b0a7fd858 (só registros de `600 Deploy/Output/pista-kart-park/` sobre 2aa013e)
counts: {blocker: 0, error: 0, warning: 0, info: 6, divergence: 0}
seed: {revision: 4, digest: 4e9bfbba6294}
upstream: {stage: test, verdict: test-validation-20261030-1743.md (árvore anterior a e70aad9; aplicado a 2aa013e por contenção, aceita — ISSUE-08)}
round: 5
mode: revalidation (registro movido a `2aa013e` em ee9e9bc)
previous: reports/deploy-validation/deploy-validation-20261103-1811.md
previous-issues: {ISSUE-01: open (parcial), ISSUE-02: open (re-verificada), ISSUE-03: open (parcial — opção 1 registrada, Esri aberto), ISSUE-04: open (parcial), ISSUE-05: open (parcial — aceitação registrada)}
population: [ISSUE-01..-05 do relatório anterior; version movida: 01-release, 97-changelog, 98-divergences, REL-0002 a REL-0005, runbook, smoke (1.3.0); intocado: REL-0001-config.md (1.1.0, o único)]
gate: lint_artifacts.py --stage deploy — 0 error, 0 warning, 10 arquivos (sem --emit)
staging-run: 41832829595 (1966c4a, push, tentativa 1, success; build 12:51:04–12:52:18Z, deploy 12:52:21–12:53:05Z)
rollback-target: 41156803005 (1bb63aa, success, retida); 41076989728 para tirar o rev 4
rollback-rehearsed: reused — caminho C1 ensaiado em deploy-validation-20261104-1302.md de pista-kart-park (reproduz byte a byte o bundle de 41156803005); caminho B não reexecutado
production: não tocada; `git ls-remote origin` → master = 05c3570; nada aprovado, acionado nem enviado
feedbacks: []
---

# Relatório de validação de deploy — modelo-kart-01 (rodada 5)

## Evidence

| Prova | Resultado |
|---|---|
| Candidato do registro (P1) | `2aa013e` em `01-release.md` 1.3.0, `runbook.md` `<sha>`/`<hash>` `BMmvlQeM`, `REL-0001:25` alvo B 41156803005 — coerentes |
| Ramo e execução (P1) | `git ls-remote staging` → `refs/heads/staging` = `1966c4a`; `gh run list -R edumatosr6-svg/kartle-staging -L 3`: 41832829595 (`1966c4a`, `push`, `success`) é a mais nova; `git diff --name-only 2aa013e ee9e9bc` fora de `600 Deploy/`: vazio |
| Servido = build limpo de `2aa013e` (P1) | GET 13:31Z: `index.html` `3b0dfc3705f80a8f…`, `index-BMmvlQeM.js` 696 559 B `babb1884645d2c40…`, `index-q-biCwua.css` `5e1c964b3b292f33…` = hashes do `cmp` 3/3 contra o build limpo no relatório `600 Deploy/Output/pista-kart-park/reports/deploy-validation/deploy-validation-20261104-1302.md` (reutilizado; `Last-Modified` inalterado, 12:53:01 GMT) |
| Frescor (P1) | build 2026-11-04T12:51–12:52Z > última edição de origem (`2aa013e`, 2026-11-03) |
| Contenção `e70aad9` → `2aa013e` (P1) | `git diff --quiet e70aad9 2aa013e -- src/kart01Model.ts src/kart01Decals.ts src/kartPose.ts src/gameCamera.ts src/audio.ts src/frameClock.ts src/handlingMessages.ts src/lap.ts src/lapMessages.ts src/lapTiming.ts src/maneuvers.ts src/physics.ts src/setupRecords.ts src/style.css src/track.ts src/trackData.ts index.html scripts tracks docs/kart-01/kart.js tests/modelo-kart-01-* tests/helpers` (caminhos de `400 Code/Output/modelo-kart-01/`): sem diferença; `src/main.ts` só a linha 239 (visibilidade do chão; `skidMarks`, `kartRoot`, câmera e sombra intocados); `.github`, `package*.json`, `tsconfig.json`, `.nvmrc` sem diferença |
| Suíte local (P1) | `npx tsx --test tests/*.test.ts` na árvore de `2aa013e`: `ℹ tests 467 / pass 467 / fail 0 / cancelled 0 / skipped 0 / todo 0`, saída 0, 52 s; `npx tsx --test tests/modelo-kart-01-*.test.ts` (4 arquivos): `ℹ tests 66 / pass 66 / fail 0 / skipped 0` (inclui a linha de base `tests/fixtures/kart01-sim-baseline.json`, inalterada) |
| Veredito de testes (P1) | SUCCESS — `test-validation-20261030-1743.md` (rodada 5, seed rev 4); nenhum veredito sobre `2aa013e` para esta feature (ISSUE-08) |
| Segredos (P2) | 0 padrões de token com corpo em `600 Deploy/`, `.github/`, `docs/`; `git grep import.meta.env\|process.env 2aa013e -- src index.html scripts`: 0 — `REL-0001` (1.1.0, intocado) confere |
| Instalação (P3) | `python -I "600 Deploy/Output/modelo-kart-01/tools/check_served.py" https://edumatosr6-svg.github.io/kartle-staging/ index-BMmvlQeM.js` → `status=200 js_bytes=696559 css_bytes=10850 cache_control='max-age=600' checks=40 failed=0` |
| Bundle (P3/P5) | `python -I "600 Deploy/Output/modelo-kart-01/tools/check_bundle.py" <3 arquivos servidos> docs/kart-01/device-log.md` → `checks=48 failed=0 js=index-BMmvlQeM.js total_bytes=714001` |
| NFR observado (P5) | RNF02: 714 001 B brutos (22,7 % de 3 145 728), `measure_dist.py` sobre os servidos `gzip_bytes=189786 within_limit=True`; fps 60/30 com o Kart 01 (H5), carga 4G: não medidos (linhas humanas; `requestAnimationFrame` a 1–2 fps sob automação) |
| Migração (P4) | não se aplica ao jogador — nenhum formato persistido (`git grep localStorage\|sessionStorage\|indexedDB 2aa013e -- src index.html`: 0); a linha de base versionada (`REL-0002`) não muda de `e70aad9` a `2aa013e` e não é passo de release (`npm run baseline:kart01` não executado: grava o fixture) |
| Smoke humano (P5) | `docs/kart-01/device-log.md`: só a execução qualitativa de 2026-10-30 sobre `e70aad9`; nada sobre `index-BMmvlQeM.js` (ISSUE-01) |
| Reversão (P6) | alvo B 41156803005 (`1bb63aa`) `success`, retido; ensaio C1 de 1302 reproduz `index-DmxsQuIL.js` `79e3182c…` desse alvo; ponto sem retorno: não existe nesta release (`runbook.md`) |
| Logs (P7) | nenhum `console.*` novo de `e70aad9` a `2aa013e`; único registro admitido da feature segue o `console.warn` com código `kart01-decals`; console do servido (1302): 0 erros, 1 aviso do three.js |
| Flag e rollout (P8) | sem flag (decisão do projeto); ordem de `REL-0003` (push a `staging` → `pages` → `check_served`) = 41832829595 (`push`, `1966c4a`) seguida de `check_served` 40/40 |
| Produção | `git ls-remote origin` → `master` = `05c3570`; nenhum comando contra `edumatosr6-svg/kartle` |

## Issues

### ISSUE-01
- severity: info
- check: P5
- class: porta humana (ambiental)
- status: open (parcial)
- file: `docs/kart-01/device-log.md`
- location: linha 38 ("Não executadas"); *Execução no celular — 2026-10-30*; `runbook.md` *Linhas humanas* H1–H6
- finding: nenhuma entrada sobre o build de `2aa013e` (`index-BMmvlQeM.js`); faltam as três entradas pedidas (notebook paisagem, celular paisagem, celular retrato) com `fpsPerSecond` e `minFps`.
- expected: as três entradas sobre `index-BMmvlQeM.js`, com H1–H6, aparelho, navegador e versão.

### ISSUE-02
- severity: info
- check: P6
- class: ensaio reutilizado
- status: open (re-verificada)
- file: `600 Deploy/Output/modelo-kart-01/98-divergences.md`
- location: DIV-DP-03; `runbook.md` R1/R2, linhas 74–75
- finding: o par 41156803005 ↔ 41832829595 não foi reexecutado; o ensaio C1 do relatório 1302 de pista-kart-park reproduz byte a byte o bundle do alvo B.
- expected: nenhuma ação nesta rodada.

### ISSUE-03
- severity: info
- check: P6
- class: decisão do dono do produto — promoção BLOQUEADA
- status: open (parcial)
- file: `200 Requirements/220 Input/pista-kart-park/DOMAIN.md`
- location: linhas 31–32; `200 Requirements/220 Input/modelo-kart-01/DOMAIN.md:41`; `98-divergences.md` DIV-DP-15
- finding: a opção 1 (esperar Esri) está registrada; OPEN-01 (Esri) continua aberto.
- expected: decisão Esri registrada antes de qualquer pergunta de promoção.

### ISSUE-04
- severity: info
- check: P6
- class: porta humana das releases contidas
- status: open (parcial)
- file: `600 Deploy/Output/modelo-kart-01/98-divergences.md`
- location: DIV-DP-12; `runbook.md` precondição *Portas humanas das releases contidas*
- finding: `docs/lap-validation-device-log.md`, `docs/handling-device-log.md` e `docs/kart-park-device-log.md` não têm entrada sobre `index-BMmvlQeM.js`.
- expected: as linhas em aberto de cada log, sobre `index-BMmvlQeM.js` (relatórios de deploy de 2026-11-04 das outras três features).

### ISSUE-05
- severity: info
- check: P5
- class: registro atrás do estado
- status: open (parcial)
- file: `600 Deploy/Output/modelo-kart-01/98-divergences.md`
- location: DIV-DP-14 (linha 33, `open`); `200 Requirements/220 Input/modelo-kart-01/DOMAIN.md:43`
- finding: o dono do produto aceitou em 2026-11-03 AC-US-0003-13 na forma completa como inalcançável, mas DIV-DP-14 continua `open` e não cita a decisão.
- expected: DIV-DP-14 passa a `waived` citando `DOMAIN.md:43`, e D11/M11/H2 marcam a parte da volta oficial como fora das linhas a executar.

### ISSUE-08
- severity: info
- check: P1
- class: veredito de testes por contenção
- status: new
- file: `600 Deploy/Output/modelo-kart-01/01-release.md`
- location: *Proveniência* linhas 55 e 58 ("Veredito de testes", "Mudança `e70aad9` → `2aa013e` e contenção")
- finding: o veredito mais novo da feature (`test-validation-20261030-1743.md`) julgou uma árvore anterior a `e70aad9`, levada a `2aa013e` por contenção encadeada; aceita porque o commit é nomeado e construído pelo pipeline, nenhum caminho rastreado da feature muda e as 66 verificações passaram frescas sobre `2aa013e`; a única interação nova é de tela (marcas de pneu a `y` 0,055 m e rodas do kart sobre a zebra com relevo até 0,075 m), coberta só pelas linhas humanas.
- expected: a próxima rodada de `test-loop` desta feature nomeia o build que julga; as linhas H de marcas de pneu e rodas incluem a passagem sobre a zebra da Kart Park.

## Promotion question

Veredito **SUCCESS**: staging serve `2aa013e` (41832829595, 467/467; 66/66 desta feature), `check_served` 40/40, `check_bundle` 48/48, RNF02 714 001 B (22,7 %); o veredito de testes vale para `2aa013e` por contenção (ISSUE-08). Não é uma promoção, e hoje não há pergunta de promoção: produção está **BLOQUEADA** pela decisão Esri (opção 1 escolhida; ISSUE-03) e faltam as linhas humanas deste build (ISSUE-01, ISSUE-04). Runbook: `600 Deploy/Output/modelo-kart-01/runbook.md` (reversão R1 caminho B para 41156803005); ponto sem retorno: não existe nesta release.
