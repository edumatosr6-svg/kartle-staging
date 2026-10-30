---
stage: deploy
feature: dirigibilidade
verdict: SUCCESS
generated: 2026-10-30T18:21:53Z
environment: staging — `https://edumatosr6-svg.github.io/kartle-staging/` (GitHub Pages, `edumatosr6-svg/kartle-staging`, ramo `staging`, `.github/workflows/pages.yml`)
commit: 6b314b2193c25cd6384a3f64cffdc369637b3753
counts: {blocker: 0, error: 0, warning: 0, info: 4, divergence: 0}
seed: {revision: 6}
upstream: {stage: test, verdict: test-validation-20261030-1638.md}
round: 2
previous: deploy-validation-20261027-1931.md
population: [ISSUE-01..04 da rodada anterior, 01-release.md, 97-changelog.md, 98-divergences.md, REL-0001-config.md, REL-0002-migration.md, REL-0003-rollout.md, REL-0004-mobile.md, REL-0005-observability.md, runbook.md, smoke.md, tools/check_bundle.py, tools/check_served.py]
staging-run: 41101055606
rollback-rehearsed: true (caminho B, 2026-10-27; par desta release não reexecutado — ISSUE-05)
resolved: [ISSUE-02, ISSUE-03, ISSUE-04]
feedbacks: []
---

# Relatório de validação de deploy — dirigibilidade (rodada 2)

## Evidence

| Prova | Resultado |
|---|---|
| Construído pelo pipeline a partir de 6b314b2 (P1) | sim — `gh run view 41101055606 --repo edumatosr6-svg/kartle-staging`: `push`, ramo `staging`, `headSha` `6b314b2193c2…3753`, tentativa 1, `conclusion: success`; `build` 17:43:26–17:47:57Z `success`; `deploy` 17:48:00–17:48:12Z `success` |
| Artefato servido = build limpo de 6b314b2 (P1) | sim, byte a byte — `git archive 6b314b2` em diretório temporário, `npm ci`, `MSYS_NO_PATHCONV=1 npm run build -- --base=/kartle-staging/` (saída 0): `index-BwruE9Pq.js` 694 094 bytes sha256 `023fb54be8e8c3f6aab900110d358ff5109dfdf9f8aa7b40f6f0f38ba6a0ca43`; servido `assets/index-BwruE9Pq.js` 200, 694 094 bytes, sha256 idêntico; CSS `index-oR7KyBh_.css` 10 800 bytes sha256 `dd4e4455…b26729` idêntico; `index.html` servido 6 583 bytes igual ao local após normalizar fim de linha |
| Artefato fresco (P1) | sim — commit 17:43:19Z → execução 17:43:23Z → `Last-Modified: Fri, 30 Oct 2026 17:48:06 GMT`; commits acima de 6b314b2 (`483c5fa`, `589efb1`) só tocam `500 Tests/Output/modelo-kart-01` e `600 Deploy/Output/race-lap-validation` |
| Veredito de testes mais novo (P1) | SUCCESS — `test-validation-20261030-1638.md` (seed rev 6, 65/65 da feature); `SEED.md` `revision: 6`; `npm test` na execução: `tests 443`, `pass 443`, `fail 0`, `skipped 0` (reduzido por script; as 21 "failure lines" de `reduce_run.py` são nomes de verificações aprovadas que contêm "fail") |
| Segredos (P2, D-DP-05) | nenhum — 0 casamentos de `ghp_`, `github_pat_`, `AKIA…`, `PRIVATE KEY`, `sk-…`, `xox?-`, JWT e `password/secret/token/api_key = "…"` no registro, em `.github/`, no log da execução (874 linhas, só contagens) e no JS servido; `pages.yml` só com `pages: write` e `id-token: write`, inalterado desde 6b314b2 |
| Variáveis lidas vs `REL-0001` (P2) | 0 = 0 — `import.meta.env` e `process.env` ausentes de `src/` em 6b314b2 |
| Instalação e smoke automático (P3, P5) | `python -I check_served.py https://edumatosr6-svg.github.io/kartle-staging/ index-BwruE9Pq.js`: `status=200 checks=22 failed=0`, `cache_control='max-age=600'`; `python -I check_bundle.py <build limpo>/dist docs/physics.md`: `checks=25 failed=0` (`docs/physics.md` inalterado desde 6b314b2); as duas ferramentas lidas: só GET em HTTPS para a URL dada e leitura local |
| Acerto v6 no bundle servido (P5, NFR-0009) | sim — JS servido: `arcade-assistido-v6` ×1, `arcade-assistido-v4` ×1, `arcade-assistido-v5` ×0, `realista-aluguel-4t-v4` presente, padrão `setupVersion v6 / previousSetupVersion v4` casado |
| Drift/turbo no HTML servido e controle de toque (P5, DES-0009) | 0 casamentos de `drift|turbo|impulso|combo|Espaço` no HTML servido (conferência independente: o único casamento de um padrão alargado é "carregando a pista"); CSS servido sem `drift|turbo|maneuver`; `data-control` = `left`, `right`, `brake`, `throttle` — nenhum controle Drift; dica `Dirigir`; sem `maneuver-guide`; `#lap-result-setup` ausente |
| Migração (P4) | não se aplica — sem banco nem armazenamento no navegador (`REL-0002`); `localStorage`/`sessionStorage`/`indexedDB` 0 no bundle |
| Reversão (P6) | caminho B ensaiado neste site em 2026-10-27 19:29–19:33Z (`deploy-validation-20261027-1931.md`); alvo desta release 41076989728 (`652bbaa`) `success` em 2026-10-30, dentro da retenção; não reexecutado nesta rodada por instrução — ISSUE-05; runbook com R1–R5, durações e ponto sem retorno ("não existe") |
| RNF02 observado | 711 477 bytes brutos (`Measure dist` da execução: `total_bytes=711477 within_limit=True`); limite 3 145 728 (22,6 %) |
| Linhas humanas H1–H5 (P5) | definidas no `runbook.md` com aparelho, passo, registro e critério; `docs/handling-device-log.md` inexistente — ISSUE-01 |
| Feature flag / ordem de `REL-0003` (P8) | nenhuma flag por projeto validado (DES-0007, DES-0009, ADR-0006); ordem 1–2 de `REL-0003` confere com o que foi feito em staging (alvo 41076989728 anotado; push → 41101055606); 3–5 do dono do produto |
| Produção (D-DP-06) | nada tocado nem aprovado; `origin/master` = `05c3570` (ref local); bloqueio da Kart Park confirmado — ISSUE-07 |

## Issues

### ISSUE-01
- severity: info
- check: P5
- class: porta humana (ambiental)
- status: open (re-verificada)
- file: `600 Deploy/Output/dirigibilidade/runbook.md`
- location: *Linhas humanas* H1–H5; precondição `docs/handling-device-log.md`; `smoke.md` D2, D4–D9, D11–D13, M1–M9; `98-divergences.md` DIV-DP-01, DIV-DP-07
- finding: `docs/handling-device-log.md` não existe (`ls`: não encontrado) e nenhuma linha humana foi executada sobre `index-BwruE9Pq.js`; 12 critérios do veredito de testes e RNF01/RNF03 seguem sem medida humana.
- expected: Eduardo registra a execução 1 em staging (execução 41101055606) — H1 sensação do acerto C (notebook teclado + celular inclinação; veredito em texto; 0 "Saindo de traseira"/"Derrapando" com esterço parcial), H2 grampos (≥ 180° em 2 s sem acelerador; raio ≤ 13 m com acelerador cheio), H3 Espaço sem efeito e 0 telas/controles de drift nos dois idiomas e nos dois canais, H4 HUD gravado com valor em todos os quadros e resultado sem versão do acerto, H5 fps (≥ 60 notebook, ≥ 30 celular) e `STEP_COST` ≤ 1,10 × na máquina de referência — com aparelho, navegador, versão, medida e data; reprovação é `FAIL CODE`.

### ISSUE-02
- severity: info
- check: P1
- class: registro desatualizado por um evento
- status: resolved
- file: `600 Deploy/Output/dirigibilidade/01-release.md`
- location: *Proveniência*, *Build local da mesma árvore*
- finding: o registro agora descreve o build local num diretório temporário e o runbook manda publicar o commit, não a árvore de trabalho; `dist/` local hoje contém `index-BwruE9Pq.js`.
- expected: nenhuma ação.

### ISSUE-03
- severity: info
- check: P6
- class: ambiental
- status: resolved
- file: `600 Deploy/Output/dirigibilidade/runbook.md`
- location: *Promote* passo 10; `REL-0005` registro de implantações, linha `kartle`
- finding: o passo 10 proíbe aprovar a execução antiga em espera (39827702391, `05c3570`) e manda conferir commit e `<hash>` da execução mais recente.
- expected: nenhuma ação.

### ISSUE-04
- severity: info
- check: P6
- class: registro desatualizado por um evento
- status: resolved
- file: `600 Deploy/Output/dirigibilidade/98-divergences.md`
- location: DIV-DP-03; `runbook.md` R1/R2
- finding: DIV-DP-03 está `resolved (2026-10-27)` e R1/R2 trazem as durações observadas (≈ 1,5 min; ≈ 2,5 min).
- expected: nenhuma ação.

### ISSUE-05
- severity: info
- check: P6
- class: ambiental
- status: new
- file: `600 Deploy/Output/dirigibilidade/runbook.md`
- location: precondição "Reversão ensaiada em staging"; R1 caminho B (41076989728 ↔ 41101055606)
- finding: o caminho B foi demonstrado neste site e com este mecanismo em 2026-10-27, mas o par desta release não foi reexecutado (instrução desta rodada: não reexecutar workflow de staging); o alvo 41076989728 existe, está `success` e dentro da retenção de 90 dias.
- expected: aceitar a demonstração de 2026-10-27 como prova do mecanismo; se o dono do produto quiser o par desta release ensaiado, reexecutar 41076989728 e depois 41101055606 e conferir com `check_served` (22/22 ao final).

### ISSUE-06
- severity: info
- check: P5
- class: ambiental (não é lacuna de requisito)
- status: new
- file: `600 Deploy/Output/dirigibilidade/98-divergences.md`
- location: DIV-DP-13; `smoke.md` D14, M10
- finding: `#lap-share` é inalcançável neste bundle por qualquer caminho de interface (`renderResult` só para `lapKind` ≠ `TRAINING`; `offeredLapKinds(reading, [])` só devolve `TRAINING`; nenhum parâmetro de URL abre volta oficial ou de reconhecimento), mas AC-US-0003-11 e AC-US-0005-07 são restrições negativas sobre o texto "quando gerado", e SCR-0002 atribui a tela de resultado e o fluxo de compartilhar a `race-lap-validation`, não exigindo que esta feature o ofereça; `formatSharedText` é pura e só compõe `trackId`, `trackVersion` e um tempo, provada por `CHK-TEST-0007-02` e `-0007-05` — o requisito está satisfeito no que pede; falta só a observação humana, impossível neste ambiente.
- expected: o estágio de testes reclassifica a metade humana "compartilhar" de E2E-02 para quando o desafio diário existir, ou o dono do produto registra essa aceitação; nenhuma mudança de código nem de release.

### ISSUE-07
- severity: info
- check: P8
- class: decisão humana pendente
- status: new
- file: `600 Deploy/Output/dirigibilidade/01-release.md`
- location: *Promoção*; `98-divergences.md` DIV-DP-14; `runbook.md` *Decisão de promoção*
- finding: confirmado por git — `ba221ad` (Kart Park) é ancestral de `cfad3dc` (v6) e de `f6e2d16` (drift fora das telas); 0 commits com `arcade-assistido-v6` em `src/physics.ts` sem `ba221ad`; `6ea3862` tem `arcade-assistido-v5` e `data-control="drift"`; logo esta release não tem caminho para produção sem a decisão Esri.
- expected: o dono do produto registra a decisão Esri (ou a de esperar, ou a de produzir um ramo sem Kart Park como trabalho novo); nenhum loop promove.

## Promotion question

Veredito **SUCCESS**: `6b314b2193c25cd6384a3f64cffdc369637b3753` foi construído pelo pipeline (execução 41101055606), o JS e o CSS servidos são byte-idênticos ao build limpo do commit, `check_served` 22/22 e `check_bundle` 25/25, sem segredos, reversível pelo caminho B (41076989728). **Não é uma promoção** (D-DP-06) e **nada foi aprovado em produção**. Antes da pergunta: Eduardo executa H1–H5 em staging e cria `docs/handling-device-log.md` (ISSUE-01). A pergunta ao dono do produto, hoje **bloqueada** pela decisão Esri (ISSUE-07): **esperar a decisão Esri e promover 6b314b2 (ou descendente só de registro) junto com as outras três features?** — `600 Deploy/Output/dirigibilidade/runbook.md`, *Promote* passos 9 a 11; ponto sem retorno: não existe (caminho A, despublicar, sempre disponível).
