---
stage: deploy
feature: modelo-kart-01
verdict: SUCCESS
generated: 2026-10-30T18:20:05Z
environment: staging — `https://edumatosr6-svg.github.io/kartle-staging/` (GitHub Pages, `edumatosr6-svg/kartle-staging`, ramo `staging`, workflow `pages`)
commit: 6b314b2193c25cd6384a3f64cffdc369637b3753
counts: {blocker: 0, error: 0, warning: 0, info: 6, divergence: 0}
seed: {revision: 4, digest: 4e9bfbba6294}
upstream: {stage: test, verdict: test-validation-20261030-1743.md}
round: 2
mode: B
previous: reports/deploy-validation/deploy-validation-20261027-2057.md
previous-issues: {ISSUE-01: open → ISSUE-01, ISSUE-02: open → ISSUE-02, ISSUE-03: resolved (runbook passo 11 proíbe aprovar 39827702391; produção agora em ISSUE-03 desta rodada), ISSUE-04: resolved (DIV-DP-12 diz 17/17 sem o argumento de hash), ISSUE-05: open → ISSUE-04}
population: [01-release.md, 97-changelog.md, 98-divergences.md, REL-0001-config.md, REL-0002-migration.md, REL-0003-rollout.md, REL-0004-mobile.md, REL-0005-observability.md, runbook.md, smoke.md, tools/check_bundle.py, tools/check_served.py]
staging-run: 41101055606
rollback-rehearsed: reused (caminho B, 2026-10-27 19:29–19:33Z, `600 Deploy/Output/dirigibilidade/reports/deploy-validation/deploy-validation-20261027-1931.md`; nenhuma workflow de staging reexecutada nesta rodada)
feedbacks: []
---

# Relatório de validação de deploy — modelo-kart-01 (rodada 2)

## Evidence

| Prova | Resultado |
|---|---|
| Commit verificado (P1) | `6b314b2193c25cd6384a3f64cffdc369637b3753`, 2026-10-30T17:43:19Z; `git diff --quiet 6b314b2 HEAD -- src scripts tests tracks index.html package.json package-lock.json docs/kart-01/kart.js` = sem diferença (HEAD `589efb1`, acima `483c5fa` e `589efb1` só de registro); `.github/workflows/pages.yml` sem diferença |
| Construído pelo pipeline (P1) | `gh run view 41101055606 --repo edumatosr6-svg/kartle-staging`: `push`, ramo `staging`, `headSha` `6b314b2…3753`, tentativa 1, `success`; `build` 17:43:26Z–17:47:57Z `success`, `deploy` 17:48:00Z–17:48:12Z `success`; log reduzido (grep -o): `index-BwruE9Pq.js`, `index-oR7KyBh_.css`, `ℹ tests 443 / pass 443 / fail 0 / skipped 0`, `total_bytes=711477 within_limit=True` |
| Artefato fresco (P1) | commit 17:43:19Z → execução 17:43:23Z → `Last-Modified: Fri, 30 Oct 2026 17:48:06 GMT` (`ETag "6ae4d856-19b7"`, `Cache-Control: max-age=600`), lido 18:16Z com `no-cache` |
| Servido = build limpo (P1) | `git archive 6b314b2` em diretório de rascunho, `npm ci` (saída 0), `npm run build -- --base=/kartle-staging/` (saída 0): `index-BwruE9Pq.js` 694 094 bytes sha256 `023fb54be8e8c3f6aab900110d358ff5109dfdf9f8aa7b40f6f0f38ba6a0ca43` = servido (`cmp` idêntico); `index-oR7KyBh_.css` 10 800 bytes sha256 `dd4e4455049904945ad6…` = servido; `index.html` idêntico ao servido (6 583 bytes, sha256 `92f2091ea5b2da5f…`) depois de normalizar CRLF, **só** com `MSYS_NO_PATHCONV=1` (ISSUE-06) |
| Veredito de testes mais novo (P1) | `test-validation-20261030-1743.md` SUCCESS (443/443, `fresh: true`, seed rev 4 digest `4e9bfbba6294`); código `code-validation-20261030-1655.md` SUCCESS; `pipeline_progress.py --seed-line` = `{revision: 4, digest: 4e9bfbba6294}` |
| Segredos (P2) | 0 valores: varredura de padrões (`ghp_`, `github_pat_`, `gho_`, `AKIA…`, chave privada, `xox?-`, `sk-…`, `key/password/secret/token = <valor>`) sobre o registro, `.github/` e `dist/` → 1 ocorrência, menção no relatório de 2026-10-27; log da execução: 2 linhas `Secret source: Actions` (metadado, sem valor); `pages.yml` sem `secrets.*`, `permissions` com `id-token: write` |
| Variáveis lidas vs `REL-0001` (P2) | 0 = 0 — `git grep 'import\.meta\.env\|process\.env' 6b314b2 -- src index.html` sem ocorrência |
| Instalação em staging (P3) | `python -I ".../tools/check_served.py" https://edumatosr6-svg.github.io/kartle-staging/ index-BwruE9Pq.js`: `status=200 js=index-BwruE9Pq.js js_bytes=694094 css_bytes=10800 cache_control='max-age=600' last_modified='Fri, 30 Oct 2026 17:48:06 GMT' checks=40 failed=0`, saída 0 (só GET a staging) |
| Bundle empacotado (P3, NFR-0003) | `python -I ".../tools/check_bundle.py" <dist limpo> docs/kart-01/device-log.md`: `checks=48 failed=0 js=index-BwruE9Pq.js total_bytes=711525`, um `warn` (o registro em tela não nomeia este JS — ISSUE-01); `measure_dist.py`: `files=3 total_bytes=711525 gzip_bytes=188904 within_limit=True ratio=0.226` |
| As verificações novas podem falhar (P5) | cópias mutadas do `dist/` limpo, uma mutação por cópia: `;var __m={exhaustOutlet:1};` → `FAIL … exhaustOutlet` (`checks=48 failed=1`, saída 1); idem `escapamentoSaida`, `turboFovDeltaDeg`, `baseVerticalFovDeg` (cada uma `failed=1`, saída 1); condição `sideslipRad>.055` → `>.05` → `FAIL: condição das marcas de pneu` (`failed=1`, saída 1). Árvore real anterior: build limpo de `git archive 652bbaa` → `index-dD_vz2Ev.js` (o mesmo nome que o log da execução 41076989728 imprime) → `check_bundle` `checks=45 failed=5`: exatamente a condição das marcas e as quatro ausências |
| Passo manual não descrito (P3) | nenhum: push a `staging`, `check_served`, política de ramos, *Re-run all jobs*, aprovação em produção — `runbook.md` *Promote* 7, 11; *Roll back* R1, R2 |
| Migração / backfill (P4) | não se aplica — sem banco e sem armazenamento no navegador (`REL-0002`, DM-0001); `check_bundle` sem `localStorage`/`sessionStorage`/`indexedDB` no `dist/` (os três `ok`); linha de base `kart01-sim-baseline.json` fora do bundle |
| Smoke automático (P5) | D1 (HTTPS, hash, 40/40), D3 (711 477 bytes servidos, 22,6 % de RNF02; 188 904 gzip no build limpo), D15 (48/48 e 40/40) **passam**; D2, D4–D14, D16, M1–M11 são de navegador e aparelho — ISSUE-01; nenhuma automação de navegador usada |
| NFR observados (P5) | NFR-0002/RNF02: 711 477 bytes servidos < 3 145 728; RNF06: 200 em HTTPS, `http://` recusado pela ferramenta; NFR-0003: um JS e um CSS; regressão das releases contidas: `arcade-assistido-v6`, `arcade-assistido-v4`, `realista-aluguel-4t-v4`, `Kartle · ` no JS servido; AC-US-0005-05/-06/-07 e AC-US-0003-04 no bundle: condição `speedMps>6&&….sideslipRad>.055` presente (`src/main.ts:593` em `6b314b2`), `exhaustOutlet`/`escapamentoSaida`/`turboFovDeltaDeg`/`baseVerticalFovDeg` ausentes; RNF01, NFR-0001/RNF03 sem valor até H1–H6 |
| Autenticação, RBAC, webhook (P5) | não se aplica — página estática; o único controle é o revisor obrigatório do ambiente `github-pages` de produção (não consultado: fora do âmbito desta rodada) |
| Reversão demonstrada (P6) — caminho B, reutilizado | ensaio de 2026-10-27 19:29:24Z–19:33:11Z em `600 Deploy/Output/dirigibilidade/reports/deploy-validation/deploy-validation-20261027-1931.md` (mesma workflow, mesmo site: reversão ≈ 1 min 17 s, restauração ≈ 2 min 12 s); **nenhuma workflow de staging reexecutada nesta rodada**; alvo 41076989728 (`652bbaa`) retido (`gh run list`: `completed success`, 15:02:21Z); `<hash-anterior>` = `dD_vz2Ev` (log da 41076989728 e build limpo de `652bbaa`) — ISSUE-02 |
| Runbook (P6) | precondições, *Promote* 1–12 com *Esperado/Leva/Desfaz-se por*, *Verify* 1–8, gatilhos de reversão, *Roll back* R1–R5 com caminhos A/B/C e duração, ponto sem retorno nomeado ("não existe"; o único ato irreversível seria `push --force`), linhas humanas H1–H6 com aparelho, passo, registro e critério |
| Compatibilidade (P6) | janela = cache de 10 min (`max-age=600` medido em `index.html`); sem servidor nem dado persistido partilhado; sem app nativo (`REL-0004`) |
| Observabilidade (P7) | `REL-0005`: cada modo de falha novo (marcas fora da condição, efeito de turbo, câmera pelo fim de volta de treino) com sintoma e classificação; único registro do cliente `console.warn` com código; nenhum log capturado nesta rodada além de cabeçalhos HTTP e extratos `grep -o` do log do Actions — nenhum conteúdo I6 |
| Feature flag / ordem de `REL-0003` (P8) | nenhuma flag (ADR-0003); ordem 1 (alvo 41076989728 anotado) e 2 (push `6b314b2` → 41101055606) conferem com `gh run list`; 3–6 por executar pelo dono do produto |
| Produção | não tocada: nenhum GET, nenhum `gh` contra `edumatosr6-svg/kartle`, nada aprovado nem enviado; refs locais `origin/master` = `05c3570`, ancestral de `6b314b2` (avanço rápido possível); `ba221ad` (Kart Park) ancestral de `6b314b2` — ISSUE-03 |

## Issues

### ISSUE-01
- severity: info
- check: P5
- class: porta humana (ambiental)
- status: open
- file: `600 Deploy/Output/modelo-kart-01/runbook.md`
- location: *Linhas humanas* H1–H6; precondição do `docs/kart-01/device-log.md`; `98-divergences.md` DIV-DP-01, DIV-DP-07
- finding: `docs/kart-01/device-log.md` em `6b314b2` só tem a execução 1 (navegador embutido, `index-D0RarhFV.js`) e *Execuções nos aparelhos de referência* = "Não executadas"; as 24 linhas `unverified` do veredito de testes e RNF01/RNF03 ficam sem medida para `index-BwruE9Pq.js`.
- expected: Eduardo registra três entradas (notebook paisagem, celular paisagem, celular retrato) nomeando `index-BwruE9Pq.js`, sobre `https://edumatosr6-svg.github.io/kartle-staging/`, com H1–H6 abaixo; uma reprovação é `FAIL CODE`.
- H1: notebook + celular (paisagem↔retrato) — visão geral nas duas pistas, contagem gravada, recarga na contagem e na corrida — 0 quadros com kart de caixas, 4 cantos da pista no quadro, altura da câmera nunca sobe, pose de corrida no `VERDE` (AC-US-0001-14, AC-US-0003-10..12).
- H2: notebook + celular — corrida, uma volta de treino seguida de outra, volta invalidada com reposicionamento, "encerrar treino", novo treino — placa `01` legível, sombra visível, câmera atrás e perto, 0 quadros de visão geral ou descida pelo fim de uma volta de treino, forma alcançável de AC-US-0003-13 (AC-US-0001-15, -16, AC-US-0003-01..03, -13, -14).
- H3: notebook (teclas) + celular (inclinação, sensor coberto) — esterçar, acelerar, pausar, retomar, reposicionar — rodas e volante para o lado do esterço, mãos no aro, rodas rolam, 0 movimento na pausa, 0 deslizamento após reposicionar (AC-US-0002-01..06).
- H4: celular paisagem e retrato + notebook com janela mais alta que larga — curva de 90° a ≈ 50 km/h com todos os comandos, inclusive Espaço — 0 cantos do kart ou do piloto fora do quadro, campo de visão constante (62° paisagem / regra de retrato), nova forma no quadro seguinte (AC-US-0003-04, -08; REQ-FEAT-0003-15).
- H5: notebook + celular, pista `synthetic` — curva forte > 6 m/s escorregando para os dois lados, reta a fundo, visão geral e contagem acelerando, pausa em curva, reposicionamento, curva depois do fim de uma volta — marcas só sob os pneus traseiros ao escorregar, 0 trechos na reta/visão geral/contagem/pausa, 0 fumaça/chama no escapamento, 0 indicação de drift (AC-US-0005-01, -04..-07).
- H6: notebook paisagem; celular paisagem e retrato; página em primeiro plano, cache vazio — contagem de quadros por segundo numa volta completa e bytes comprimidos transferidos — `minFps` ≥ 60 no notebook, ≥ 30 no celular nas duas formas, download < 3 145 728 bytes (NFR-0001, NFR-0002, AC-US-0004-01, -02).

### ISSUE-02
- severity: info
- check: P6
- class: ensaio reutilizado (instrução da rodada)
- status: open
- file: `600 Deploy/Output/modelo-kart-01/98-divergences.md`
- location: DIV-DP-03; `runbook.md` R1 caminho B, R2, tabela de nomes `<hash-anterior>`
- finding: o par 41076989728 (`652bbaa`) ↔ 41101055606 (`6b314b2`) não foi reexecutado; vale o ensaio de 2026-10-27 19:29–19:33Z (`600 Deploy/Output/dirigibilidade/reports/deploy-validation/deploy-validation-20261027-1931.md`); o resultado esperado de R2 foi conferido sem tocar staging: o alvo serve `index-dD_vz2Ev.js` (log da 41076989728 = build limpo de `652bbaa`) e sobre ele `check_bundle` reprova exatamente as cinco linhas do seed rev 4.
- expected: DIV-DP-03 registra a aceitação do ensaio de 2026-10-27 com o par desta revisão e `runbook.md` nomeia `<hash-anterior>` = `dD_vz2Ev`; se o dono do produto quiser o ensaio sobre este par, R1/R2 em staging (≈ 4 min) quando nenhuma outra feature estiver a medir ou publicar.

### ISSUE-03
- severity: info
- check: P6
- class: porta humana (decisão) — produção bloqueada
- status: open
- file: `600 Deploy/Output/modelo-kart-01/01-release.md`
- location: *Produção — opções enquanto a decisão Esri não existe*; `98-divergences.md` DIV-DP-15; `runbook.md` passos 9–11
- finding: `ba221ad` (Kart Park) é ancestral de `6b314b2`, logo promover este commit promove a Kart Park, bloqueada pela decisão Esri; nada foi aprovado, acionado nem enviado a produção e o estado de produção não foi lido nesta rodada (só refs locais: `origin/master` = `05c3570`).
- expected: o dono do produto registra a decisão Esri ou escolhe entre a opção 1 (esperar e promover tudo junto), 2 (publicar `6ea3862`, seed rev 1, comportamento retirado) ou 3 (ramo sem Kart Park, árvore nova a passar código, testes e deploy) antes de qualquer pergunta de promoção; na aprovação, nunca a execução 39827702391 (`05c3570`) nem `push --force`.

### ISSUE-04
- severity: info
- check: P5
- class: porta humana (decisão)
- status: open
- file: `600 Deploy/Output/modelo-kart-01/98-divergences.md`
- location: DIV-DP-12; `runbook.md` precondição *Portas humanas das releases contidas*
- finding: `6b314b2` contém `dirigibilidade` rev 6, `race-lap-validation` rev 3 e `pista-kart-park`, cujas portas humanas (`docs/handling-device-log.md` inexistente, execução seguinte de `docs/lap-validation-device-log.md`, `docs/kart-park-device-log.md`) não foram registradas sobre `index-BwruE9Pq.js`.
- expected: Eduardo executa as quatro listas na mesma sessão de aparelho sobre a URL de staging e registra cada uma no seu log, ou registra a decisão de as separar; a precondição marca-se conforme a escolha.

### ISSUE-05
- severity: info
- check: P5
- class: porta humana (decisão)
- status: open
- file: `600 Deploy/Output/modelo-kart-01/98-divergences.md`
- location: DIV-DP-14; `smoke.md` D11, M11; `runbook.md` H2
- finding: AC-US-0003-13 na forma completa (painel `#lap-result` sobre a cena depois da volta oficial) não é alcançável na página: em `6b314b2` só o treino é oferecido (`offeredLapKinds`, `src/main.ts:277`) e "encerrar treino" (`emitEndTraining`, `src/main.ts:202`) volta à oferta sem painel; a regra é provada por `CHK-TEST-0003-13`, `-14`.
- expected: o dono do produto aceita a forma "encerrar treino" (kart parado, câmera atrás dele) como metade humana de AC-US-0003-13 ou pede a oferta da volta oficial como item de `SCOPE-BACKLOG.md`.

### ISSUE-06
- severity: info
- check: P1
- class: registro impreciso
- status: new
- file: `600 Deploy/Output/modelo-kart-01/01-release.md`
- location: *Proveniência*, linha *Build limpo da mesma árvore*; *Medida real do artefato* (`index.html` 6 667, total 711 561 / 188 918); `97-changelog.md` linha 101; `REL-0005` "hoje 188 918 bytes gzip"
- finding: os 6 667 bytes do `index.html` não são só CRLF: no Git Bash, `--base=/kartle-staging/` vira `/Program Files/Git/kartle-staging/` (conversão de caminho do MSYS), e esse `index.html` aponta para um caminho inexistente; com `MSYS_NO_PATHCONV=1` o build limpo dá `index.html` 6 631 bytes (CRLF), idêntico ao servido, e `dist/` 711 525 bytes / 188 904 gzip; JS e CSS não mudam.
- expected: a medida passa a 711 525 / 188 904 com o `index.html` de 6 631 bytes e a reprodução manual no Windows nomeia `MSYS_NO_PATHCONV=1` (ou PowerShell) para o `--base`; não bloqueia: o artefato publicado é o do workflow (Ubuntu), byte a byte confirmado.

## Promotion question

Veredito **SUCCESS**: `6b314b2193c25cd6384a3f64cffdc369637b3753` foi construído pela execução **41101055606** (`success`, 443/443), é servido em HTTPS em staging byte a byte igual ao build limpo do commit (JS sha256 `023fb54be8e8c3f6…`), `check_served` 40/40 e `check_bundle` 48/48, as cinco verificações novas reprovam sobre um bundle mutado e sobre a árvore anterior, e a reversão em staging é o caminho B (alvo 41076989728 → `index-dD_vz2Ev.js`; procedimento ensaiado em 2026-10-27, reutilizado). **Não é uma promoção** (D-DP-06); nada foi aprovado. Antes de qualquer pergunta: (1) Eduardo registra H1–H6 em `docs/kart-01/device-log.md` sobre `index-BwruE9Pq.js` (ISSUE-01) e as portas das releases contidas (ISSUE-04); (2) o dono do produto registra a decisão Esri ou escolhe a opção 1, 2 ou 3 de `01-release.md` (ISSUE-03). Só então: **promover o commit escolhido a produção?** — `600 Deploy/Output/modelo-kart-01/runbook.md`, *Promote* 9–12 (`git push origin master` em avanço rápido a partir de `05c3570`, conferir commit e `<hash>` no passo *Build*, *Approve and deploy*; nunca a 39827702391). Ponto sem retorno: **não existe** (produção: caminho A, despublicar; staging: caminho B; caminho C pelo repositório).
