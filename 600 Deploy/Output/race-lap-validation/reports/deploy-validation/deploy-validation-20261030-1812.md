---
stage: deploy
feature: race-lap-validation
verdict: SUCCESS
generated: 2026-10-30T18:16:17Z
environment: staging — `https://edumatosr6-svg.github.io/kartle-staging/` (GitHub Pages, repositório `edumatosr6-svg/kartle-staging`, ramo `staging`, workflow `pages`, D23)
commit: 6b314b2193c25cd6384a3f64cffdc369637b3753
counts: {blocker: 0, error: 0, warning: 0, info: 3, divergence: 0}
seed: {revision: 3, digest: beee272fdb3b}
upstream: {stage: test, verdict: test-validation-20261030-1559.md}
round: 6
previous: deploy-validation-20261021-1643.md
population: [01-release.md, REL-0001-config.md, REL-0002-migration.md, REL-0003-rollout.md, REL-0004-mobile.md, REL-0005-observability.md, runbook.md, smoke.md, 98-divergences.md, tools/check_served.py, tools/measure_dist.py]
staging-run: 41101055606
rollback-target: 41076989728 (652bbaa)
rollback-rehearsed: "caminho B, mesmo workflow, 2026-10-27 19:29–19:33Z — 600 Deploy/Output/dirigibilidade/reports/deploy-validation/deploy-validation-20261027-1931.md; não reexecutado nesta rodada"
production: não tocada; nada aprovado
feedbacks: []
---

# Relatório de validação de deploy — race-lap-validation (rodada 6, seed rev 3, commit 6b314b2)

## Evidence

| Prova | Resultado |
|---|---|
| Construído pelo pipeline a partir de `6b314b2` (P1) | sim — `gh run view 41101055606 --repo edumatosr6-svg/kartle-staging`: workflow `pages`, evento `push`, ramo `staging`, `headSha` `6b314b2193c25cd6384a3f64cffdc369637b3753`, tentativa 1, `completed success`; `build` 17:43:26Z–17:47:57Z `success`, `deploy` 17:48:00Z–17:48:12Z `success` |
| `npm test` no pipeline (P1) | log da execução reduzido por script (§18): `tests 443`, `pass 443`, `fail 0`, `skipped 0`, `cancelled 0`; os **179** `CHK-TEST-*` declarados em `tests/race-lap-validation-*.test.ts` de `6b314b2` aparecem todos aprovados, 0 reprovados; Node 24.22.1; `Measure dist` → `within_limit=True` |
| Árvore verificada contida no commit publicado (P1) | sim — `0c83ed9` e `8811414` são ancestrais de `6b314b2`; `git diff --stat 8811414 6b314b2 -- src/lap.ts src/lapMessages.ts src/lapTiming.ts src/frameClock.ts src/trackData.ts tests/race-lap-validation-*` vazio; `git diff --stat 0c83ed9 8811414 -- src index.html` vazio |
| Servido = build limpo de `6b314b2` (P1) | sim — `git archive 6b314b2` em pasta de rascunho, `npm ci` (saída 0), `npm run build -- --base=/kartle-staging/` (saída 0): `index-BwruE9Pq.js` sha256 `023fb54be8e8c3f6…a6a0ca43` = servido; `index-oR7KyBh_.css` sha256 `dd4e4455049904945…a854b26729` = servido; `index.html` sha256 `92f2091ea5b2da5f…b32c11b5` = servido (após normalizar CRLF do `git archive` com `core.autocrlf=true`); build sem `--base`: mesmo `index-BwruE9Pq.js` (runbook passo 4 confere). Nota de reprodução: no Git Bash, `--base=/kartle-staging/` sem `MSYS_NO_PATHCONV=1` é reescrito para `/Program Files/Git/kartle-staging/` (só o `index.html` muda; os *assets* não) |
| Artefato fresco (P1) | sim — commit 17:43:19Z → execução criada 17:43:23Z → `Last-Modified: Fri, 30 Oct 2026 17:48:06 GMT` em `index.html` e no JS; nenhuma execução posterior em `kartle-staging` (`gh run list`: 41101055606 é a mais nova; 0 `in_progress`) |
| Veredito de testes mais novo (P1) | SUCCESS — `500 Tests/Output/race-lap-validation/reports/test-validation/test-validation-20261030-1559.md`, seed `{revision: 3, digest: beee272fdb3b}` = `SEED.md` `revision: 3`; feature 179/179 |
| Segredos no registro, no workflow, no log da execução e neste relatório (P2) | nenhum valor — varredura (`ghp_`, `github_pat_`, `gho_`, `ghs_`, `sk-`, `AKIA`, bloco PEM, JWT, `password=`, `token=`) nos arquivos do registro, `tools/`, `.github/workflows/pages.yml` e `docs/lap-validation-device-log.md`: 0 valores (2 linhas de relatórios antigos citam os padrões, não valores); log da execução 41101055606: 0 ocorrências de cada padrão, 6 máscaras `***` do GitHub; `pages.yml` sem `secrets.*` nem `env:` |
| Variáveis lidas pelo cliente vs `REL-0001` (P2) | 0 = 0 — `git grep import.meta.env\|process.env 6b314b2 -- src index.html`: 0; `localStorage`/`sessionStorage`/`indexedDB`/`fetch(`/`XMLHttpRequest`/`WebSocket`/`sendBeacon` nos cinco módulos da feature e em `src/main.ts`: 0 |
| Instalação em staging (P3) | sim — GET `https://edumatosr6-svg.github.io/kartle-staging/`: 200, `ssl_verify_result=0`, `Cache-Control: max-age=600`; `index.html` referencia `assets/index-BwruE9Pq.js` e `assets/index-oR7KyBh_.css`, ambos 200 |
| `check_served.py` (smoke automático, P3/P5) | `python -I "600 Deploy/Output/race-lap-validation/tools/check_served.py" https://edumatosr6-svg.github.io/kartle-staging/ index-BwruE9Pq.js` → `status=200 js_bytes=694094 css_bytes=10800 checks=53 failed=0`, saída 0 (só GET em HTTPS ao staging) |
| `measure_dist.py` sobre os três arquivos servidos (RNF02) | `files=3 total_bytes=711477 gzip_bytes=188898 within_limit=True ratio=0.226`, saída 0 — igual a `01-release.md` |
| Passo manual não descrito pelo runbook (P3) | nenhum — push a `staging`, `check_served`, política de ramos, *Re-run all jobs*, aprovação em produção: *Promote* 7 e 10, *Roll back* R1/R2, precondições |
| Migração (P4) | não se aplica — sem banco; sessão de treino em memória (`REL-0002`, DM-0002); leitor de pista inalterado nesta rodada |
| Reversão (P6) | caminho B: alvo 41076989728 (`652bbaa`, `completed success`, criada 2026-10-30T15:02:21Z, dentro da retenção); `652bbaa` contém a primeira release (`c41c6c3`) e não contém `0c83ed9`; procedimento ensaiado no mesmo workflow em 2026-10-27 19:29:24Z–19:33Z (reexecução de 39631099098 e volta de 40566728590, ciclo ≈ 3 min 47 s) — `600 Deploy/Output/dirigibilidade/reports/deploy-validation/deploy-validation-20261027-1931.md`; não reexecutado nesta rodada por instrução. Caminho A ensaiado em 2026-10-21 (log de aparelho, *Ensaio de reversão R4*). Caminho C: `git revert 8811414 0c83ed9` descrito em R1 |
| Runbook — estrutura (P6) | precondições, *Promote* 1–11 (Esperado, Leva, Desfaz-se por), *Produção* (opções 1–3), *Verify* 1–8, gatilhos D-DP-03, H1–H6, *Roll back* R1–R5 com durações, ponto sem retorno nomeado ("não existe nesta release"; `push --force` excluído) |
| Smoke humano em staging (P5) | **não executado** — D1–D16 e M1–M14 esperam a execução 3 (H1–H6); ISSUE-01 |
| Observabilidade (P7) | `REL-0005`: modos de falha novos (painel ausente, kart parado, contagem nova, "encerrar treino" ausente, melhor volta errada) com sinal na tela e classificação; vigilância manual (DIV-DP-08 `waived`); nenhum log capturado além de cabeçalhos HTTP e do log da execução (sem conteúdo I6) |
| Flag / ordem de `REL-0003` (P8) | nenhuma flag (DES-0007, DES-0011, ADR-0006); ordem 1–2 confere com staging (alvo B anotado, push de `6b314b2` publicado por 41101055606); 3–5 por executar pelo dono do produto |
| Produção | não tocada por esta validação (nenhuma leitura, aprovação, disparo ou push em `edumatosr6-svg/kartle`); `origin/master` local = `05c3570`, ancestral de `6ea3862`; `ba221ad` (Kart Park) está em `6b314b2` e não em `6ea3862` — confere com DIV-DP-15 e a seção *Produção* do runbook |

## Issues

### ISSUE-01
- severity: info
- check: P5
- class: humana (porta humana; DIV-DP-06, DIV-DP-07 `open`)
- file: `600 Deploy/Output/race-lap-validation/runbook.md`
- location: *Linhas humanas — o roteiro da execução 3* (H1–H6); `smoke.md` D1–D16, M1–M14
- finding: nenhuma linha humana foi executada sobre `6b314b2`; os 39 critérios `unverified` do veredito de testes e RNF01 em 4G seguem sem medida, e os aparelhos de referência ainda não estão nomeados em `docs/lap-validation-device-log.md`.
- expected: Eduardo Matos (`edumatosr6-svg`) executa H1–H6 em `https://edumatosr6-svg.github.io/kartle-staging/` e registra a execução 3 no log com aparelho, navegador, versão, medida e data — H1 notebook de referência (D2, D5, D12: carga < 10 s em 4G, contagem 3 s, 60 fps); H2 notebook (D6–D11: NFR-0002/0004/0006/0007, REQ-FEAT-0009-11); H3 Chrome, Edge, Firefox e Safari (D13: 0 ms de diferença, NFR-0008); H4 notebook (D15, D16: AC-US-0010-02, -04, -07, -11, -12, -15, -16, -19, -23, -24, -25; E2E-13 "não executável pela tela"); H5 celular intermediário de referência (M1–M12: RNF01, RNF06, NFR-0002, NFR-0003 30 fps, NFR-0004, NFR-0006 16 px, NFR-0007, I4); H6 celular, paisagem e retrato (M13, M14: AC-US-0010-15, -16 por toque).

### ISSUE-02
- severity: info
- check: P6
- class: decisão do dono do produto (DIV-DP-15 `open`)
- file: `600 Deploy/Output/race-lap-validation/runbook.md`
- location: *Produção — as opções enquanto a decisão Esri não existe*; `01-release.md` *A produção e a Kart Park*
- finding: `6b314b2` contém a Kart Park (`ba221ad`), cuja promoção está bloqueada pela decisão Esri; promover este build é promover a Kart Park, e nenhuma opção foi escolhida nem aprovada.
- expected: Eduardo escolhe e registra em `DOMAIN.md` uma das opções — 1 esperar a decisão Esri e promover as quatro features juntas; 2 publicar `6ea3862` (primeira release desta feature, sem Kart Park; avanço rápido a partir de `05c3570`, sem `--force`); 3 portar o treino contínuo para um ramo sem a Kart Park (trabalho novo com veredito próprio) — e só então responde à pergunta de promoção.

### ISSUE-03
- severity: info
- check: P6
- class: evidência herdada
- file: `600 Deploy/Output/race-lap-validation/runbook.md`
- location: precondição "Reversão ensaiada em staging"; R1 caminho B
- finding: o caminho B não foi reexecutado sobre o alvo desta rodada (41076989728); a prova é o ensaio do mesmo procedimento no mesmo workflow em 2026-10-27 19:29–19:33Z (`600 Deploy/Output/dirigibilidade/reports/deploy-validation/deploy-validation-20261027-1931.md`), e o alvo existe, está verde e dentro da retenção.
- expected: nenhuma ação para esta rodada; se Eduardo acionar R1 em staging, registrar a duração observada em R4.

## Promotion question

Depois de fechada a execução 3 (ISSUE-01) e registrada a opção de produção (ISSUE-02, DIV-DP-15): **Eduardo, promover a produção o build escolhido — `6b314b2` só pela opção 1 (com a decisão Esri), ou `6ea3862` pela opção 2?** Caminho: `600 Deploy/Output/race-lap-validation/runbook.md`, *Promote* passos 9–11 (push a `origin` sem `--force`, *Review deployments* → *Approve and deploy* só na execução do commit escolhido) e *Verify* 1–8. Ponto sem retorno: não existe nesta release (caminho A — *Unpublish site* — enquanto produção nunca serviu um `dist/`; depois, B ou C). Nada foi aprovado por esta validação.
