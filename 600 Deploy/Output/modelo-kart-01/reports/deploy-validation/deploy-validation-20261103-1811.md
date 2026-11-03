---
stage: deploy
feature: modelo-kart-01
verdict: SUCCESS
generated: 2026-11-03T18:11:00Z
environment: staging — `https://edumatosr6-svg.github.io/kartle-staging/` (GitHub Pages, `edumatosr6-svg/kartle-staging`, ramo `staging`, workflow `pages`)
commit: e70aad9ddf5cf42da6c5957b4023afdbf6cacd03 (candidato do registro 1.2.0); servido em staging: 1bb63aa98c6c30ad3fc637e85f1e6d552d031209 (só registro; árvore de build = e70aad9)
counts: {blocker: 0, error: 0, warning: 0, info: 5, divergence: 0}
seed: {revision: 4, digest: 4e9bfbba6294}
upstream: {stage: test, verdict: test-validation-20261030-1743.md}
round: 4
mode: revalidation (registro movido a `e70aad9` em 25fa89b)
previous: reports/deploy-validation/deploy-validation-20261103-1741.md
previous-issues: {ISSUE-07: resolved, ISSUE-06: resolved, ISSUE-01: open (parcial), ISSUE-02: open, ISSUE-03: open, ISSUE-04: open (parcial), ISSUE-05: open}
population: [ISSUE-07, -01..-06 do relatório anterior; version movida: 01-release, 97-changelog, 98-divergences, REL-0002 a REL-0005, runbook, smoke; intocado: REL-0001-config.md (único)]
gate: lint_artifacts.py --stage deploy — 0 error, 0 warning, 10 arquivos (sem --emit)
staging-run: 41156803005 (1bb63aa, success; mesmos bytes de 41109469203/e70aad9)
rollback-target: 41076989728 (652bbaa, success, retida)
rollback-rehearsed: reused (caminho B, 2026-10-27; nada reexecutado nesta rodada)
production: não tocada (nenhum GET, `gh` ou push contra `edumatosr6-svg/kartle`; o "404" de `01-release.md` não foi reconferido); nada aprovado
feedbacks: []
---

# Relatório de validação de deploy — modelo-kart-01 (rodada 4)

## Evidence

| Prova | Resultado |
|---|---|
| Candidato do registro (P1) | `e70aad9` em `01-release.md` *Proveniência*, `runbook.md` `<sha>`/`<hash>` `DmxsQuIL`/execução em vigor 41156803005, `REL-0003`, `REL-0005`, `smoke.md` |
| Contenção (P1) | `git diff --stat e70aad9 HEAD -- src index.html tests scripts package.json package-lock.json tsconfig.json vite.config.* .github .nvmrc`: vazio; `6b314b2..e70aad9` (= `483c5fa..e70aad9` em `src index.html tests`): só `index.html`, `src/main.ts`, `src/style.css`, `tests/pista-kart-park-screens.test.ts` (ADR-0007) |
| Veredito de testes aplicável (P1) | newest SUCCESS `test-validation-20261030-1743.md` (66/66 desta feature, 443/443, árvore de `6b314b2`); execução fresca sobre `e70aad9` (`500 Tests/Output/race-lap-validation/reports/junit-latest.xml`, veredito `test-validation-20261103-1743.md`) reduzida por script: 66 casos em `tests/modelo-kart-01-*`, 0 `failure`, 0 `skipped`; suíte 444/444 |
| Pipeline e frescor (P1) | 41109469203 (`e70aad9`, push, `success`) e em vigor 41156803005 (`1bb63aa`, `success`; log reduzido: 444/444, 0 `✖`, *Build* `index-DmxsQuIL.js`, `total_bytes=711620 gzip_bytes=188719 within_limit=True`); `Last-Modified: Sat, 31 Oct 2026 01:46:48 GMT` posterior a `e70aad9` |
| Build limpo = servido (P1) | `git archive e70aad9` + `npm ci` + `MSYS_NO_PATHCONV=1 npx vite build --base=/kartle-staging/`: JS `79e3182c…`, CSS `5e1c964b…`, `index.html` LF `ba4e81a4…` = servidos; `measure_dist.py` no dist limpo `total_bytes=711668` (CRLF do `index.html`) `within_limit=True` |
| `check_bundle.py` (P3) | `… check_bundle.py <dist limpo> docs/kart-01/device-log.md` → `checks=48 failed=0 js=index-DmxsQuIL.js`, sem `warn` |
| `check_served.py` (P3/P5) | `… check_served.py <URL> index-DmxsQuIL.js` → `status=200 js_bytes=694178 css_bytes=10850 checks=40 failed=0` |
| Medidas do registro (P1, ISSUE-06) | `01-release.md`, `REL-0004`, `REL-0005`, `REL-0003` dão 711 620 / 188 719 (= *Measure dist* de 41156803005); 6 667 / 711 561 / 188 918 só citados como histórico corrigido (`01-release.md:128`) |
| Segredos (P2) | 0 padrões de token com corpo em `600 Deploy/`, `docs/`, `.github/` e no log de 41156803005; `git grep import.meta.env\|process.env e70aad9 -- src index.html`: 0 (`REL-0001` confere) |
| Migração (P4) | não se aplica — sem banco; nada persistido (0 acessos a armazenamento em `e70aad9:src`) |
| NFR observado (P5) | NFR-0002: 711 620 B brutos, 188 719 gzip (6,0 % de 3 145 728); `fpsPerSecond`/`minFps` (60/30) e bytes transferidos no aparelho: **não medidos** (linhas humanas) |
| Smoke humano (P5) | `docs/kart-01/device-log.md`: *Execuções nos aparelhos de referência* "Não executadas"; *Execução no celular — 2026-10-30*, aparelho sem modelo: "aparece as marcas"; o resto pelo resumo; fps não medido — qualitativo |
| Reversão (P6) | 41076989728 (`652bbaa`): `success`, `build`/`deploy` `success`, retida; ensaio B de 2026-10-27 reutilizado |
| Logs (P7) | `console.warn('kart01-decals', 'NO_2D_CONTEXT')` e os demais de `e70aad9:src`: só códigos e ids |
| Flag e rollout (P8) | sem flag (ADR-0003); ordem de `REL-0003` = execução 41109469203 (push de `e70aad9`) |
| Produção | não tocada; `origin/master` local = `05c3570` |

## Issues

### ISSUE-01
- severity: info
- check: P5
- class: porta humana (ambiental)
- status: open (parcial)
- file: `docs/kart-01/device-log.md`
- location: linha 38 ("Não executadas"); *Execução no celular — 2026-10-30* (linhas 41–62); `runbook.md` *Linhas humanas* H1–H6
- finding: sem mudança no log desde o relatório anterior; nenhuma das três entradas pedidas (notebook paisagem, celular paisagem, celular retrato) existe.
- expected: em aberto — H1 (visão geral, contagem gravada, recarga; 0 quadros com kart de caixas); H2 (placa `01`, sombra, câmera atrás no treino contínuo, 0 visão geral pelo fim de uma volta); H3 (rodas, volante e mãos com teclas e inclinação, pausa, reposicionamento); H4 (curva de 90° com todos os comandos, 0 cantos fora do quadro, 62° paisagem e regra de retrato); H5 (marcas só sob os pneus traseiros, 0 na reta, visão geral, contagem e pausa, 0 fumaça ou chama, 0 indicação de drift); H6 `minFps` ≥ 60 no notebook e ≥ 30 no celular nas duas formas, bytes < 3 145 728; modelo, navegador e versão do celular.

### ISSUE-02
- severity: info
- check: P6
- class: ensaio reutilizado
- status: open (re-verificada)
- file: `600 Deploy/Output/modelo-kart-01/98-divergences.md`
- location: DIV-DP-03; `runbook.md` R1/R2
- finding: o alvo 41076989728 segue `success` e retido; o caminho B não foi reexecutado nesta rodada.
- expected: como no relatório anterior.

### ISSUE-03
- severity: info
- check: P6
- class: porta humana (decisão) — produção bloqueada
- status: open (re-verificada)
- file: `600 Deploy/Output/modelo-kart-01/01-release.md`
- location: *Produção — opções enquanto a decisão Esri não existe*; DIV-DP-15
- finding: `pista-kart-park/DOMAIN.md` (último commit `ac84352`) mantém OPEN-01 (Esri) sem decisão; nenhuma opção 1/2/3 registrada.
- expected: como no relatório anterior.

### ISSUE-04
- severity: info
- check: P5
- class: porta humana (decisão)
- status: open (parcial)
- file: `600 Deploy/Output/modelo-kart-01/98-divergences.md`
- location: DIV-DP-12; `runbook.md` precondição *Portas humanas das releases contidas*
- finding: as portas humanas de `race-lap-validation`, `dirigibilidade` e `pista-kart-park` continuam abertas (só a execução qualitativa de 2026-10-30 em cada log).
- expected: as linhas em aberto de cada log (relatórios de deploy de 2026-11-03 das outras três features).

### ISSUE-05
- severity: info
- check: P5
- class: porta humana (decisão)
- status: open (re-verificada)
- file: `600 Deploy/Output/modelo-kart-01/98-divergences.md`
- location: DIV-DP-14; `smoke.md` D11, M11; `runbook.md` H2
- finding: AC-US-0003-13 na forma completa continua inalcançável (`e70aad9:src/main.ts:278` `offeredLapKinds(reading, [])`: só o treino); nenhuma aceitação registrada.
- expected: como no relatório anterior.

## Promotion question

Veredito **SUCCESS**: o candidato `e70aad9` é o que staging serve (41156803005, 444/444, 66/66 desta feature), byte a byte igual ao build limpo, `check_served` 40/40, `check_bundle` 48/48. Não é uma promoção. A decisão que fica com Eduardo é a decisão Esri, ou a escolha entre as opções 1, 2 e 3 de `01-release.md`; só a opção 1 promove o seed rev 4. Só depois dela, e das linhas H1–H6 desta release e das contidas, cabe a pergunta "promover?". Runbook: `600 Deploy/Output/modelo-kart-01/runbook.md`. Ponto sem retorno: não existe. Nada foi aprovado nem enviado a produção.
