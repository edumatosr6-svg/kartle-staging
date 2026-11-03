---
stage: deploy
feature: race-lap-validation
verdict: SUCCESS
generated: 2026-11-03T18:05:00Z
environment: staging — `https://edumatosr6-svg.github.io/kartle-staging/` (GitHub Pages, `edumatosr6-svg/kartle-staging`, ramo `staging`, workflow `pages`, D23)
commit: e70aad9ddf5cf42da6c5957b4023afdbf6cacd03 (candidato do registro 1.3.0); servido em staging: 1bb63aa98c6c30ad3fc637e85f1e6d552d031209 (só registro; árvore de build = e70aad9)
counts: {blocker: 0, error: 0, warning: 0, info: 3, divergence: 0}
seed: {revision: 3, digest: beee272fdb3b}
upstream: {stage: test, verdict: test-validation-20261103-1743.md}
round: 8
mode: revalidation (registro movido a `e70aad9` em 25fa89b)
previous: deploy-validation-20261103-1735.md
previous-issues: {ISSUE-04: resolved, ISSUE-01: open (parcial), ISSUE-02: open, ISSUE-03: open}
population: [ISSUE-04, -01, -02, -03 do relatório anterior; version movida: os 10 arquivos do registro (01-release, 97-changelog, 98-divergences, REL-0001 a REL-0005, runbook, smoke); amostra de intocados: nenhum arquivo do registro ficou intocado]
gate: lint_artifacts.py --stage deploy — 0 error, 0 warning, 10 arquivos (sem --emit)
staging-run: 41156803005 (1bb63aa, success; mesmos bytes de 41109469203/e70aad9)
rollback-target: 41076989728 (652bbaa, success, retida)
rollback-rehearsed: reused (caminho B, 2026-10-27; nada reexecutado nesta rodada)
production: não tocada (nenhum GET, `gh` ou push contra `edumatosr6-svg/kartle`); nada aprovado
feedbacks: []
---

# Relatório de validação de deploy — race-lap-validation (rodada 8)

## Evidence

| Prova | Resultado |
|---|---|
| Candidato do registro (P1) | `e70aad9` em `01-release.md` *Proveniência*, `runbook.md` `<sha>`/`<hash>` `DmxsQuIL`/execução em vigor 41156803005, `REL-0003` etapa 2, `smoke.md`, `REL-0005` — todos coerentes |
| Contenção (P1) | `git diff --stat e70aad9 HEAD -- src index.html tests scripts package.json package-lock.json tsconfig.json vite.config.* .github .nvmrc`: vazio (HEAD `25fa89b`; acima de `e70aad9` só registros); `git diff --stat 8811414 e70aad9 -- src/lap.ts src/lapMessages.ts src/lapTiming.ts src/frameClock.ts src/trackData.ts tests/race-lap-validation-*`: vazio; `6b314b2..e70aad9`: `index.html`, `src/main.ts`, `src/style.css`, `tests/pista-kart-park-screens.test.ts` (ADR-0007), como o registro descreve |
| Pipeline (P1) | `gh run list --repo edumatosr6-svg/kartle-staging --workflow pages` (leitura): 41156803005 (`1bb63aa`, push, `success`, 2026-10-31T01:44:42Z) em vigor; 41109469203 (`e70aad9`, `success`); log de 41156803005 reduzido por script: `tests 444 / pass 444 / fail 0 / cancelled 0 / skipped 0`, 0 `✖`, `node: v24.22.1`, *Build* `index-DmxsQuIL.js 694.17 kB`, *Measure dist* `total_bytes=711620 gzip_bytes=188719 within_limit=True` |
| Frescor (P1) | `Last-Modified: Sat, 31 Oct 2026 01:46:48 GMT` > última edição de código (`e70aad9`, 2026-10-30T18:44Z) |
| Build limpo = servido (P1) | `git archive e70aad9` no rascunho, `npm ci` (0), `MSYS_NO_PATHCONV=1 npx vite build --base=/kartle-staging/` (0): `index-DmxsQuIL.js` sha256 `79e3182c860855c0…` e `index-q-biCwua.css` `5e1c964b3b292f33…` = servidos; `index.html` 6 640 B (CRLF), normalizado para LF `ba4e81a44a43f150…` = servido (6 592 B) |
| Veredito de testes (P1) | SUCCESS — `test-validation-20261103-1743.md`, `build: e70aad9`, fresco: 444/444, 179/179 desta feature; JUnit `reports/junit-latest.xml` reduzido por script: 179 casos em `tests/race-lap-validation-*`, 0 `failure`, 0 `skipped` |
| Segredos (P2) | 0 ocorrências de padrões de token com corpo (`ghp_`, `github_pat_`, `gho_/ghs_/ghu_/ghr_`, `AKIA`, PEM, JWT, `password/secret/token/api_key=` com valor) em `600 Deploy/`, `docs/`, `.github/`; log de 41156803005: 0 (6 máscaras `***`) |
| Variáveis (P2) | `git grep import.meta.env\|process.env e70aad9 -- src index.html`: 0 — `REL-0001` "nenhuma" confere |
| Instalação (P3) | GET `https://edumatosr6-svg.github.io/kartle-staging/`: HTTP 200, `Cache-Control: max-age=600`; `index.html` → `assets/index-DmxsQuIL.js` (694 178 B) e `assets/index-q-biCwua.css` (10 850 B) |
| `check_served.py` (P3/P5) | `python -I "…/race-lap-validation/tools/check_served.py" <URL> index-DmxsQuIL.js` → `status=200 js_bytes=694178 css_bytes=10850 checks=53 failed=0` |
| Migração (P4) | não se aplica — sem banco nem armazenamento; `git grep fetch\|XMLHttpRequest\|WebSocket\|sendBeacon\|localStorage\|sessionStorage\|indexedDB e70aad9 -- src index.html`: 0 |
| NFR observado (P5) | RNF02: 711 620 B brutos (22,6 % de 3 145 728), 188 719 gzip; RNF01, RNF03 (fps), contagem de 3 s: **não medidos** (linhas humanas; sem medida sob automação) |
| Smoke humano (P5) | `docs/lap-validation-device-log.md`, *Execução no celular — 2026-10-30*, sobre `e70aad9`/`index-DmxsQuIL.js`, aparelho sem modelo, navegador e versão: corte invalida e o kart segue (relato específico); voltas seguidas, crédito no resultado e retrato só pelo resumo; "rodou legal" sem fps — qualitativo, não fecha linha |
| Reversão (P6) | alvo B 41076989728 (`652bbaa`): `success`, `build` e `deploy` `success`, retida; ensaio do caminho B de 2026-10-27 reutilizado |
| Logs (P7) | `console.warn` em `e70aad9:src`: só códigos e ids (`track-data`, `lap-record`, `kart01-decals`); nenhuma classe não registrável |
| Flag e rollout (P8) | sem flag por decisão (DES-0007); ordem de `REL-0003` (push a `staging` → `pages` → `check_served`) = execução 41109469203 (evento `push`, `e70aad9`) |
| Produção | não tocada; `origin/master` local = `05c3570` |

## Issues

### ISSUE-01
- severity: info
- check: P5
- class: porta humana (ambiental)
- status: open (parcial)
- file: `docs/lap-validation-device-log.md`
- location: *Execução no celular — 2026-10-30* (linhas 107–128); `runbook.md` *Linhas humanas* H1–H6; `98-divergences.md` DIV-DP-06, DIV-DP-07
- finding: sem mudança no log desde o relatório anterior; a execução no celular de 2026-10-30 não é a execução 3 (sem aparelho nomeado, sem medida, nada no notebook).
- expected: em aberto — H1 (D2 carga 4G < 10 s, D5 contagem de 3 s, D12 60 fps); H2 (D6–D11: painel, pausa por Esc/aba/botão, pulo/corte/reposicionamento, offline e armazenamento, pt/en/fr, escala de cinza); H3 (D13, quatro navegadores, 0 ms); H4 (D15, D16; E2E-13 "não executável pela tela"); H5 celular nomeado (M1–M12, inclusive M11 30 fps e M12 crédito); H6 (M13 quatro voltas, M14 "pausar" e "encerrar treino" por toque, paisagem e retrato); modelo, navegador e versão do celular.

### ISSUE-02
- severity: info
- check: P6
- class: decisão do dono do produto (DIV-DP-15 `open`)
- status: open (re-verificada)
- file: `600 Deploy/Output/race-lap-validation/runbook.md`
- location: *Produção — as opções enquanto a decisão Esri não existe*
- finding: `200 Requirements/220 Input/pista-kart-park/DOMAIN.md` (último commit `ac84352`, 2026-10-22) mantém OPEN-01 (Esri) sem decisão; `race-lap-validation/DOMAIN.md` sem a opção 1/2/3.
- expected: Eduardo registra a opção em `DOMAIN.md` antes de qualquer pergunta de promoção.

### ISSUE-03
- severity: info
- check: P6
- class: ensaio reutilizado
- status: open (re-verificada)
- file: `600 Deploy/Output/race-lap-validation/runbook.md`
- location: R1 caminho B; precondição "Reversão ensaiada em staging"
- finding: o alvo 41076989728 segue `success` e retido; o caminho B não foi reexecutado nesta rodada.
- expected: nenhuma ação nesta rodada.

## Promotion question

Veredito **SUCCESS**: o candidato `e70aad9` é o que staging serve (41156803005, 444/444), byte a byte igual ao build limpo, `check_served` 53/53, com veredito de testes sobre a mesma árvore. Não é uma promoção. A pergunta "promover?" (`runbook.md`, passo 9) só pode ser feita depois de duas coisas, ambas de Eduardo: a execução 3 (H1–H6) e a escolha da opção de produção 1, 2 ou 3, registrada em `DOMAIN.md`. Hoje, portanto, a decisão pendente é qual opção de produção adotar. Runbook: `600 Deploy/Output/race-lap-validation/runbook.md`. Ponto sem retorno: não existe nesta release. Nada foi aprovado, acionado nem enviado a produção.
