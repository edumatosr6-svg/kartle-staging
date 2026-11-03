---
stage: deploy
feature: dirigibilidade
verdict: SUCCESS
generated: 2026-11-03T18:08:00Z
environment: staging — `https://edumatosr6-svg.github.io/kartle-staging/` (GitHub Pages, `edumatosr6-svg/kartle-staging`, ramo `staging`, `.github/workflows/pages.yml`)
commit: e70aad9ddf5cf42da6c5957b4023afdbf6cacd03 (candidato do registro 2.1.0); servido em staging: 1bb63aa98c6c30ad3fc637e85f1e6d552d031209 (só registro; árvore de build = e70aad9)
counts: {blocker: 0, error: 0, warning: 1, info: 4, divergence: 0}
seed: {revision: 6, digest: dbf86f325606}
upstream: {stage: test, verdict: test-validation-20261030-1638.md}
round: 4
mode: revalidation (registro movido a `e70aad9` em 25fa89b)
previous: deploy-validation-20261103-1738.md
previous-issues: {ISSUE-08: resolved, ISSUE-01: open (parcial), ISSUE-05: open, ISSUE-06: open, ISSUE-07: open}
population: [ISSUE-08, -01, -05, -06, -07 do relatório anterior; version movida: 01-release, 97-changelog, 98-divergences, REL-0001, REL-0003, REL-0004, REL-0005, runbook, smoke; intocado: REL-0002-migration.md (único, lido inteiro na parte de backfill)]
gate: lint_artifacts.py --stage deploy — 0 error, 0 warning, 10 arquivos (sem --emit)
staging-run: 41156803005 (1bb63aa, success; mesmos bytes de 41109469203/e70aad9)
rollback-target: 41076989728 (652bbaa, success, retida)
rollback-rehearsed: reused (caminho B, 2026-10-27; nada reexecutado nesta rodada)
production: não tocada; nada aprovado
feedbacks: []
---

# Relatório de validação de deploy — dirigibilidade (rodada 4)

## Evidence

| Prova | Resultado |
|---|---|
| Candidato do registro (P1) | `e70aad9` em `01-release.md` *Proveniência*, `runbook.md` `<sha>`/`<hash>` `DmxsQuIL`/execução em vigor 41156803005, `REL-0003` etapa 2, `REL-0005`, `smoke.md` |
| Contenção (P1) | `git diff --stat e70aad9 HEAD -- src index.html tests scripts package.json package-lock.json tsconfig.json vite.config.* .github .nvmrc`: vazio; `6b314b2..e70aad9`: só `index.html`, `src/main.ts`, `src/style.css`, `tests/pista-kart-park-screens.test.ts` (ADR-0007) — nenhum módulo ou teste desta feature |
| Veredito de testes aplicável (P1) | newest SUCCESS `test-validation-20261030-1638.md` (65/65 desta feature, commit `c387839`); na execução fresca sobre `e70aad9` (`500 Tests/Output/race-lap-validation/reports/junit-latest.xml`, veredito `test-validation-20261103-1743.md`) reduzida por script: 65 casos em `tests/dirigibilidade-*`, 0 `failure`, 0 `skipped`; suíte 444/444 |
| Pipeline e frescor (P1) | 41109469203 (`e70aad9`, push, `success`) e em vigor 41156803005 (`1bb63aa`, `success`; log reduzido: 444/444, 0 `✖`, *Build* `index-DmxsQuIL.js`, `total_bytes=711620 within_limit=True`); `Last-Modified: Sat, 31 Oct 2026 01:46:48 GMT` posterior a `e70aad9` |
| Build limpo = servido (P1) | `git archive e70aad9` + `npm ci` + `MSYS_NO_PATHCONV=1 npx vite build --base=/kartle-staging/`: JS `79e3182c…` e CSS `5e1c964b…` = servidos; `index.html` LF `ba4e81a4…` = servido |
| `check_bundle.py` (P3) | `python -I "…/dirigibilidade/tools/check_bundle.py" <dist limpo> docs/physics.md` → `checks=25 failed=0 js=index-DmxsQuIL.js` |
| `check_served.py` (P3/P5) | `… check_served.py <URL> index-DmxsQuIL.js` → `status=200 js_bytes=694178 checks=22 failed=0` |
| Segredos (P2) | 0 padrões de token com corpo em `600 Deploy/`, `docs/`, `.github/` e no log de 41156803005; `git grep import.meta.env\|process.env e70aad9 -- src index.html`: 0 |
| Migração (P4) | não se aplica — sem banco; nada persistido (`REL-0002`; 0 acessos a armazenamento em `e70aad9:src`) |
| NFR observado (P5) | RNF02: 711 620 B brutos, 188 719 gzip; RNF01, RNF03 (60/30 fps), `STEP_COST` no aparelho: **não medidos** (linhas humanas) |
| Smoke humano (P5) | `docs/handling-device-log.md` (criado em `1bb63aa`), *Execução no celular — 2026-10-30*, aparelho sem modelo: "virou bem" (sensação de curva); sem drift e retrato só pelo resumo; fps não medido — qualitativo |
| Inalcançável (P5) | `e70aad9:src/main.ts:278` `offeredLapKinds(reading, [])`: só o treino é ofertado — `#lap-share` (D14, M10) continua sem caminho |
| Reversão (P6) | 41076989728 (`652bbaa`): `success`, `build`/`deploy` `success`, retida; ensaio B de 2026-10-27 reutilizado |
| Logs (P7) | `console.warn` em `e70aad9:src`: só códigos e ids |
| Flag e rollout (P8) | sem flag (DES-0007); ordem de `REL-0003` = execução 41109469203 (push de `e70aad9`) |
| Produção | não tocada; `origin/master` local = `05c3570` |

## Issues

### ISSUE-09
- severity: warning
- check: P5
- class: registro atrás do estado
- status: new
- file: `600 Deploy/Output/dirigibilidade/smoke.md`
- location: linha 16 ("arquivo ainda por criar"); `01-release.md` *Precondições humanas* item 1 (linhas 62–63, "O arquivo **ainda não existe**")
- finding: `docs/handling-device-log.md` existe desde `1bb63aa`; `98-divergences.md` DIV-DP-01, `REL-0004` e o próprio item 1 (linha 65) já o dizem, mas essas duas frases ficaram da versão 2.0.0.
- expected: na próxima revisão do registro, as duas frases dizem que o log existe só com a execução qualitativa de 2026-10-30.

### ISSUE-01
- severity: info
- check: P5
- class: porta humana (ambiental)
- status: open (parcial)
- file: `docs/handling-device-log.md`
- location: *Execução no celular — 2026-10-30* (linhas 5–26); `runbook.md` *Linhas humanas* H1–H5; `98-divergences.md` DIV-DP-01, DIV-DP-07
- finding: sem mudança no log desde o relatório anterior; nenhuma linha H1–H5 fechada.
- expected: em aberto — H1 metade notebook (teclado) e, no celular, 0 "Saindo de traseira"/"Derrapando" com esterço parcial (M8); H2 grampos com tentativas e saídas, (a) e (b) (D13); H3 notebook (Espaço sem efeito, telas em pt e en) e controle de toque com a inclinação negada (M7); H4 gravação do HUD por quadro, pausa, troca para Realista (D6, D8, D9, M6); H5 fps ≥ 60 no notebook e ≥ 30 no celular nomeado, `STEP_COST` ≤ 1,10× (D12, M9); D2/M2 carga em 4G (RNF01); M1, M3, M5; modelo, navegador e versão do celular.

### ISSUE-05
- severity: info
- check: P6
- class: ensaio reutilizado
- status: open (re-verificada)
- file: `600 Deploy/Output/dirigibilidade/runbook.md`
- location: R1 caminho B
- finding: o alvo 41076989728 segue `success` e retido; o caminho B não foi reexecutado nesta rodada.
- expected: nenhuma ação nesta rodada.

### ISSUE-06
- severity: info
- check: P5
- class: ambiental (não é lacuna de requisito)
- status: open (re-verificada)
- file: `600 Deploy/Output/dirigibilidade/98-divergences.md`
- location: DIV-DP-13; `smoke.md` D14, M10
- finding: `#lap-share` continua inalcançável pela interface (só o treino é oferecido em `e70aad9`).
- expected: reclassificação da metade humana de E2E-02 ou aceitação registrada pelo dono do produto.

### ISSUE-07
- severity: info
- check: P8
- class: decisão humana pendente
- status: open (re-verificada)
- file: `600 Deploy/Output/dirigibilidade/01-release.md`
- location: *Promoção — a árvore contém a Kart Park*; `98-divergences.md` DIV-DP-14
- finding: `pista-kart-park/DOMAIN.md` (último commit `ac84352`) mantém OPEN-01 (Esri) sem decisão; não existe commit com o acerto C sem a Kart Park.
- expected: o dono do produto registra a decisão Esri ou a de esperar; nenhum loop promove.

## Promotion question

Veredito **SUCCESS**: o candidato `e70aad9` é o que staging serve (41156803005, 444/444, 65/65 desta feature), byte a byte igual ao build limpo, `check_served` 22/22, `check_bundle` 25/25. Não é uma promoção. A única opção que leva esta release a produção é a 1, esperar a decisão Esri, e por isso a decisão que fica com Eduardo é esta: tomar a decisão Esri, ou registrar que vai esperar. Só depois disso, e das linhas H1–H5, cabe a pergunta "promover?" (`runbook.md`, passos 9–10). Runbook: `600 Deploy/Output/dirigibilidade/runbook.md`. Ponto sem retorno: não existe. Nada foi aprovado nem enviado a produção.
