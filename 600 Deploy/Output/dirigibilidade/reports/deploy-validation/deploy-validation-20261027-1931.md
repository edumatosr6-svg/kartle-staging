---
stage: deploy
feature: dirigibilidade
verdict: SUCCESS
generated: 2026-10-27T19:31:10Z
environment: staging — `https://edumatosr6-svg.github.io/kartle-staging/` (GitHub Pages, repositório `edumatosr6-svg/kartle-staging`, ramo `staging`, workflow `.github/workflows/pages.yml`, D23)
commit: b86b200d14f950baa1a902f56b6f6fbfff5082ba
counts: {blocker: 0, error: 0, warning: 0, info: 4, divergence: 0}
seed: {revision: 3, digest: 7dd24c8b6cab}
upstream: {stage: test, verdict: test-validation-20261027-1902.md}
round: 1
previous: none
population: [01-release.md, REL-0001-config.md, REL-0002-migration.md, REL-0003-rollout.md, REL-0004-mobile.md, REL-0005-observability.md, runbook.md, smoke.md, tools/check_bundle.py, tools/check_served.py, 97-changelog.md, 98-divergences.md]
staging-run: 40566728590
rollback-rehearsed: true
feedbacks: []
---

# Relatório de validação de deploy — dirigibilidade (rodada 1)

## Evidence

| Prova | Resultado |
|---|---|
| Commit verificado nomeado (P1) | sim — `b86b200d14f950baa1a902f56b6f6fbfff5082ba` em `01-release.md` *Proveniência*, `runbook.md` (`<sha>`, precondição 1, passo 1), `REL-0003` ordem 2 e etapa 1; `git log -1 b86b200`: "dirigibilidade: testes validados (65 checks, suíte 237/237)", 2026-10-27T19:10:41Z; ponta de `master` |
| Construído pelo pipeline a partir desse commit (P1) | **sim, observado** — `gh run list/view --repo edumatosr6-svg/kartle-staging`: execução **40566728590**, evento `push`, ramo `staging`, `head_sha` `b86b200d14…5082ba`, criada 19:10:42Z; trabalho `build` (checkout, setup-node, Install (lockfile), Test, Build, Measure dist (RNF02), configure-pages, upload-pages-artifact) `success` 19:10:46Z–19:11:39Z; trabalho `deploy` (`deploy-pages`) `success` 19:11:44Z–19:11:54Z; tentativa 1 |
| Artefato de staging = árvore verificada (P1) | **sim, byte a byte** — JS servido `assets/index-BiFxJ0FY.js`: 200, 579 462 bytes, sha256 `136a2b6537791ab5…`; build limpo de `git archive b86b200` (sem a árvore de trabalho, que outra feature está a editar) com `npm ci` + `npm run build -- --base=/kartle-staging/` em diretório temporário: `index-BiFxJ0FY.js` 579 462 bytes, sha256 `136a2b6537791ab5…` — **idêntico**; CSS `index-dgojskay.css` 11 407 bytes, sha256 `cb10bfa773bb92f2…` idêntico nos dois lados; `index.html` servido 7 189 bytes (o local difere só por fim de linha CRLF do `git archive` no Windows, 84 bytes, mesmas referências) |
| Artefato fresco (P1) | sim — commit 19:10:41Z → execução 19:10:42Z → publicado com `Last-Modified: Tue, 27 Oct 2026 19:11:49 GMT` (e, após o ensaio de reversão, 19:32:41 GMT); a árvore de trabalho de `src/main.ts`/`package.json` (modificada 19:26Z por `modelo-kart-01`) **não** entra no juízo: o que se julga é o commit |
| Veredito de testes mais novo (P1) | SUCCESS — `500 Tests/Output/dirigibilidade/reports/test-validation/test-validation-20261027-1902.md` (único no diretório; `collected: 237, passed: 237, failed: 0, skipped: 0, fresh: true`; `seed: {revision: 3, digest: 7dd24c8b6cab}` — o registro de deploy não carrega digest próprio; o deste relatório é o do veredito de testes; `SEED.md` `revision: 3`) |
| Segredos no registro, no workflow e neste relatório (P2, D-DP-05) | nenhum valor — `grep -rniE "token\|secret\|password\|ghp_\|gho_"` sobre `600 Deploy/Output/dirigibilidade`: 4 ocorrências, todas menções e não valores (`REL-0001` linha 23 "Configuração e secrets: none", linha 31 "não lê `secrets.*`", linha 39 "token OIDC"; `runbook.md` linha 62 "token OIDC"); `pages.yml` sem `env:`, sem `secrets.*`; nenhum log capturado além de cabeçalhos HTTP |
| Variáveis que o cliente lê vs `REL-0001` (P2) | 0 = 0 — nenhuma variável; as duas entradas (nome do repositório, ambiente `github-pages`) vêm do contexto da execução |
| Instalação em staging (P3) | **sim** — `python -I "600 Deploy/Output/dirigibilidade/tools/check_served.py" https://edumatosr6-svg.github.io/kartle-staging/ index-BiFxJ0FY.js`: `status=200 js=index-BiFxJ0FY.js js_bytes=579462 cache_control='max-age=600' checks=18 failed=0` (200 em HTTPS; um JS e um CSS sob `/kartle-staging/`; hash esperado; `#speed`, `#handling`, `#lap-result-setup`, `#lap-share`, `#handling-preset` com `arcade` selecionado, `#preset-label`; três identificadores de acerto e o prefixo `Kartle · ` no JS servido; 579 462 < 3 145 728) — executado às 19:28Z (antes do ensaio) e às 19:33Z (depois), 18/18 nas duas |
| Bundle empacotado (P3, D10) | `python -I "600 Deploy/Output/dirigibilidade/tools/check_bundle.py" dist docs/physics.md`: `checks=20 failed=0` (identificadores, elementos, `arcade` selecionado, 0 `localStorage`/`sessionStorage`/`indexedDB`, bloco `handling-baseline` com três entradas e `measuredAtUtc` 2026-10-27T18:18:17Z da v5); `measure_dist.py dist`: `within_limit=True`. **Atenção**: o `dist/` da árvore de trabalho é hoje o de outra feature (`index-D0RarhFV.js`, 631 352 bytes, 19:26:48Z) — ISSUE-02; o bundle desta release é o do build limpo de `b86b200` (579 462 bytes) e o servido |
| Passo manual não descrito pelo runbook (P3) | nenhum — push a `staging`, `check_served`, política de ramos do ambiente, *Re-run all jobs*, aprovação em produção: todos descritos (*Promote* 7, 10; *Roll back* R1, R2; precondições) |
| Cabeças de migração / upgrade em cópia / backfill (P4) | não se aplica — sem banco e sem armazenamento no navegador (`REL-0002`, DM-0001); acerto versionado e leitores de registro viajam no bundle; 0 ocorrências textuais de armazenamento no `dist/` (`check_bundle.py`); leitores provados por `CHK-TEST-0008-*` no `npm test` da execução 40566728590 |
| Downgrade / reversão demonstrada (P6) — **caminho B em staging, ensaiado nesta rodada** | **sim** — nenhuma execução em andamento antes de cada comando (`gh run list`: 0 `in_progress`); `gh run rerun 39631099098 --repo edumatosr6-svg/kartle-staging` às **19:29:24Z** → tentativa 3, `build` 19:29:27Z–19:29:53Z, `deploy` 19:29:56Z–19:30:21Z, `success`; às 19:30:41Z a URL servia **`index-Cqfgl3da.js`** (574 785 bytes, `Last-Modified` 19:30:18 GMT; `check_served` com `index-Cqfgl3da.js`: 200, hash esperado, `failed=6` — exatamente as 6 linhas desta feature que a release anterior não tem: `#lap-result-setup`, `#lap-share`, os três identificadores e o prefixo; comportamento esperado do v4); `gh run rerun 40566728590` às **19:30:59Z** → tentativa 2, `build` 19:31:01Z–19:32:03Z, `deploy` 19:32:06Z–19:32:46Z, `success`; às 19:33:11Z `check_served … index-BiFxJ0FY.js`: `checks=18 failed=0`, `Last-Modified` 19:32:41 GMT. **Ciclo completo ≈ 3 min 47 s** (reversão ≈ 1 min 17 s do comando à página servida; restauração ≈ 2 min 12 s); o cache de 10 min não atrasou o observador com `Cache-Control: no-cache`. Nenhum push de outra feature entrou entretanto (lista de execuções inalterada: 40566728590, 40560536024, 40553053763) |
| Reversão em produção (P6) — caminho A | nada a reverter: produção nunca serviu um `dist/` (`gh run list --repo edumatosr6-svg/kartle`: 39827702391 `pending` para `05c3570` de 2026-10-22, 39817624458 e 39812848553 `cancelled`; nenhuma execução verde); **nada foi aprovado, acionado nem enviado** a produção por esta validação — ISSUE-03 |
| Runbook — estrutura (P6) | precondições (11; 2 por marcar: validação de staging — este relatório — e `docs/handling-device-log.md`), *Promote* (11 passos com *Esperado*, *Leva*, *Desfaz-se por*), *Verify* (8), *Roll back* (R1–R5 com caminho e duração), gatilhos de reversão (D-DP-03: RNF01, RNF02, RNF03, NFR-0002, acerto, HUD, comparabilidade, console, HTTPS), ponto sem retorno nomeado ("não existe nesta release"; o único ato irreversível seria `push --force`) |
| Linhas humanas H1–H5 (P5, P6) | atribuídas ao dono do produto (`edumatosr6-svg`), cada uma com aparelho (notebook e celular de referência; máquina de referência da linha de base para H5), ação, registro e critério de aprovação (AC-US-0004-06, AC-US-0005-05/RULE-0003, NFR-0003/AC-US-0003-02, RNF03 60/30 fps, NFR-0002 ≤ 1,10 ×), roteiro E2E-01 a E2E-03; registro em `docs/handling-device-log.md` — **o arquivo não existe** (`ls docs/handling-device-log.md`: não encontrado); porta humana, não defeito de empacotamento — ISSUE-01 |
| Smoke em staging — `web-desktop` (P5) | automático: D1 (HTTPS, hash, 18/18), D3 (579 462 bytes de JS servido < 3 145 728; gzip 150 111 no build limpo), D10 (três identificadores servidos; `check_bundle` 20/20) **passam**; D4, D5, D6, D7, D8, D9, D11 (tela e console), D2 (RNF01) e D12 (RNF03) são de navegador e aparelho e ficam para o humano — ISSUE-01; nenhuma automação de navegador disponível a esta validação (e o ritmo sob automação é inválido: 1–2 quadros/s, release anterior) |
| Smoke em staging — `web-mobile` (P5) | M3 observado indiretamente (mesmo bundle); M1, M2, M4–M9 são de aparelho — ISSUE-01 |
| NFR observados em staging (P5) | RNF02: 579 462 bytes brutos de JS servido (limite 3 145 728; 18,4 %); RNF06: 200 em HTTPS, `check_served` recusa `http://`; NFR-0009: `arcade-assistido-v5`, `arcade-assistido-v4`, `realista-aluguel-4t-v4` no JS servido; NFR-0007: `realista-aluguel-4t-v4` presente; NFR-0004: bloco `handling-baseline` com v5 datada; RNF01, RNF03, NFR-0002, NFR-0003, AC-US-0004-06, AC-US-0005-05 sem valor até H1–H5 |
| Autenticação, RBAC, webhook (P5) | não se aplica — página estática sem servidor; o único controle é o revisor obrigatório do ambiente `github-pages` de produção, confirmado pelo estado `pending` da execução 39827702391 |
| Compatibilidade / cliente não atualizado (P6) | janela = cache de 10 min (`Cache-Control: max-age=600`, medido); nenhum servidor nem dado persistido partilhado; registro antigo sem `setupVersion` lido como v4 (`CHK-TEST-0008-*`); sem app nativo (`REL-0004`) |
| Observabilidade (P7) | `REL-0005`: cada modo de falha novo tem sintoma na tela; nenhum log sai do navegador; `console.warn` só com códigos; decisão de vigilância manual de 2026-10-21 mantida (DIV-DP-08 `waived`); nenhum log capturado com conteúdo I6; cada limiar tem a sua métrica e onde se lê |
| Feature flag / ordem de `REL-0003` (P8) | nenhuma flag, por projeto validado (DES-0007, ADR-0001); ordem 1–2 confrontada com staging (alvo 39631099098 anotado; push de `b86b200` publicado; caminho B agora ensaiado); 3–5 por executar pelo dono do produto |
| Crédito OSM / ODbL (D-DP-04) | não exigido (0 dado OSM; ratificado em 2026-10-21; DIV-DP-11 `resolved`) |
| Divergências do registro | DIV-DP-01 (`open`, porta humana — ISSUE-01), DIV-DP-03 (**fechada por esta rodada** — ISSUE-04), DIV-DP-05 (`open`, `info`, decisão do dono do produto), DIV-DP-07 (`open`, junta-se à DIV-DP-01); 5 `resolved`, 3 `waived` herdadas |

## Issues

### ISSUE-01
- severity: info
- check: P5
- class: porta humana (ambiental)
- status: open
- file: `600 Deploy/Output/dirigibilidade/runbook.md`
- location: precondição "`docs/handling-device-log.md` criado e com as linhas H1–H5"; *Linhas humanas* H1–H5; `smoke.md` D2, D4–D9, D11, D12 e M1–M9; `98-divergences.md` DIV-DP-01 e DIV-DP-07
- finding: `docs/handling-device-log.md` não existe e nenhuma linha humana foi executada; os 5 critérios `unverified` do veredito de testes (AC-US-0004-06, AC-US-0005-05, NFR-0002, NFR-0003, NFR-0004) e RNF01/RNF03 ficam sem medida para este bundle; é o mesmo padrão ambiental da release anterior (execução 3 de `docs/lap-validation-device-log.md`) e não um defeito do registro: as linhas estão atribuídas ao dono do produto com aparelho, passo, registro e critério.
- expected: Eduardo cria `docs/handling-device-log.md` no molde de `docs/lap-validation-device-log.md` e registra a execução 1 em `https://edumatosr6-svg.github.io/kartle-staging/` (serve `index-BiFxJ0FY.js`): H1–H5 do `runbook.md` e D2, D4–D9, D11, D12, M1–M9 do `smoke.md`, com aparelho, navegador, versão, medida e data; uma linha reprovada é `FAIL CODE`; só então a precondição marca `[x]` e a pergunta de promoção pode ser respondida.
- precondição humana: um testador com o notebook, o celular e a máquina de referência nomeados.

### ISSUE-02
- severity: info
- check: P1
- class: registro desatualizado por um evento
- status: new
- file: `600 Deploy/Output/dirigibilidade/01-release.md`
- location: *Proveniência*, linha *Build local da mesma árvore*; `runbook.md` *Promote* passos 4 e 5
- finding: o `dist/` da árvore de trabalho foi reconstruído às 19:26:48Z pela feature `modelo-kart-01` (`src/main.ts` e `package.json` modificados) e contém `index-D0RarhFV.js` (631 352 bytes), não mais o `index-BiFxJ0FY.js` de 13:27 que o registro descreve; a afirmação era verdadeira ao ser escrita e a proveniência não é afetada (build limpo de `git archive b86b200` com sha256 idêntico ao servido), mas o passo 4 do runbook executado sobre a árvore de trabalho atual não imprime `BiFxJ0FY`.
- expected: nenhuma ação no registro (a precondição 1 já avisa que se publica o commit e não a árvore de trabalho); quem executar o passo 4 fora de uma árvore limpa de `b86b200` deve esperar outro `<hash>` e confiar no `<hash>` do passo *Build* da execução 40566728590.

### ISSUE-03
- severity: info
- check: P6
- class: ambiental
- status: new
- file: `600 Deploy/Output/dirigibilidade/runbook.md`
- location: precondição "Execução verde do workflow `pages` em staging"; *Roll back* R1 ("Alternativa em produção"); `REL-0005` tabela do registro de implantações, linha `kartle`
- finding: em `edumatosr6-svg/kartle` a execução em espera é a **39827702391** (`pending`, commit `05c3570` de 2026-10-22, "race-lap-validation: D-Spec alinhado ao esquema de pista v3"), não a de `b86b200`; 39817624458 e 39812848553 estão `cancelled`; produção nunca serviu um `dist/` — caminho A (nada a reverter) é o aplicável, e a alternativa de R1 ("aprovar a execução da árvore anterior") existe de fato e aponta para `05c3570`, cujo conteúdo não foi conferido por esta validação.
- expected: o passo 10 do runbook cria a execução de `b86b200` com `git push origin master` e o dono do produto aprova **essa** (conferindo o commit), nunca a 39827702391 por engano; se a alternativa de R1 vier a ser usada, conferir antes que `05c3570` não toca `src/`, `scripts/`, `tests/`, `index.html`, `docs/physics.md` nem o lockfile em relação a `c41c6c3`.

### ISSUE-04
- severity: info
- check: P6
- class: registro desatualizado por um evento
- status: new
- file: `600 Deploy/Output/dirigibilidade/98-divergences.md`
- location: DIV-DP-03; `runbook.md` precondição "Reversão ensaiada em staging" e R1/R2 (coluna *Leva*, caminho B); `REL-0003` ordem 2
- finding: o caminho B foi ensaiado nesta rodada (reexecução de 39631099098 → `index-Cqfgl3da.js` servido em ≈ 1 min 17 s; reexecução de 40566728590 → `index-BiFxJ0FY.js` de volta em ≈ 2 min 12 s; ciclo ≈ 3 min 47 s, sem necessidade de liberar a política de ramos porque o site não foi despublicado), de modo que DIV-DP-03 deixa de estar `open` e a estimativa "3 a 5 min + 10 min de cache" de R1 tem agora valores observados.
- expected: DIV-DP-03 marcada `resolved (2026-10-27, rodada 1 de validação)` com os números acima; R1 caminho B com "≈ 1,5 min do comando à página" e R2 com "restauração ≈ 2,5 min"; `version:` movido — pode ficar para a próxima rodada do gerador, não bloqueia.

## Promotion question

Veredito **SUCCESS**: o candidato `b86b200d14f950baa1a902f56b6f6fbfff5082ba` foi construído pelo pipeline (execução 40566728590 de `edumatosr6-svg/kartle-staging`), é byte-idêntico ao build limpo do commit, é servido em HTTPS em staging (`check_served` 18/18) e é reversível pelo caminho B, ensaiado e restaurado nesta rodada. **Não é uma promoção** (D-DP-06). Antes da pergunta, fecha-se a porta humana:

1. Eduardo cria `docs/handling-device-log.md` e registra em staging a execução 1: H1–H5 do `runbook.md` e as linhas de navegador e aparelho do `smoke.md` (ISSUE-01); uma reprovação é `FAIL CODE` e volta ao estágio de código.
2. Só depois, a pergunta ao dono do produto: **promover `b86b200` a produção?** — `600 Deploy/Output/dirigibilidade/runbook.md`, *Promote* passos 9 a 11: `git push origin master`, abrir a execução mais recente de `edumatosr6-svg/kartle` com `build` verde e commit `b86b200` (não a 39827702391 em espera — ISSUE-03), *Review deployments* → *Approve and deploy*; ponto sem retorno: **não existe** (caminho A, despublicar, sempre disponível; caminho B em staging ensaiado hoje). Produção nunca serviu um `dist/`: promover esta release é também promover a de `race-lap-validation`, contida nela.
