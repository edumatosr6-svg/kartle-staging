---
stage: deploy
feature: race-lap-validation
verdict: FAIL
generated: 2026-11-03T17:35:00Z
environment: staging — `https://edumatosr6-svg.github.io/kartle-staging/` (GitHub Pages, `edumatosr6-svg/kartle-staging`, ramo `staging`, workflow `pages`, D23)
commit: 6b314b2193c25cd6384a3f64cffdc369637b3753 (candidato do registro); servido em staging: 1bb63aa98c6c30ad3fc637e85f1e6d552d031209 (árvore de build = e70aad9ddf5cf42da6c5957b4023afdbf6cacd03)
counts: {blocker: 1, error: 0, warning: 0, info: 3, divergence: 0}
seed: {revision: 3, digest: beee272fdb3b}
upstream: {stage: test, verdict: test-validation-20261030-1559.md}
round: 7
mode: revalidation (evidência nova: log de aparelho de 1bb63aa; nenhuma versão do registro movida)
previous: deploy-validation-20261030-1812.md
previous-issues: {ISSUE-01: open (parcial), ISSUE-02: open, ISSUE-03: open}
population: [ISSUE-01..03 do relatório anterior; version movida: nenhuma (último commit do registro e76af69/589efb1); amostra aleatória: 98-divergences.md, 01-release.md; evidência nova: docs/lap-validation-device-log.md]
staging-run: 41156803005 (1bb63aa, success; mesmos bytes de 41109469203/e70aad9)
rollback-target: 41076989728 (652bbaa)
rollback-rehearsed: reused (caminho B, 2026-10-27 19:29–19:33Z; nada reexecutado nesta rodada)
production: não tocada; nada aprovado
feedbacks: []
---

# Relatório de validação de deploy — race-lap-validation (rodada 7)

## Evidence

| Prova | Resultado |
|---|---|
| Candidato do registro (P1) | `6b314b2`, execução 41101055606 (`success`, retida) — `runbook.md:22-24` (`<sha>`, "execução de staging em vigor 41101055606"), `01-release.md`, `REL-0003` etapa 2 "a URL serve `index-BwruE9Pq.js`" |
| O que staging serve (P1) | `gh run list --repo edumatosr6-svg/kartle-staging` (leitura): mais nova 41156803005 (`1bb63aa`, 2026-10-31T01:44:42Z, `success`), antes 41111441877 (`28d40ef`), 41109469203 (`e70aad9`), 41101055606 (`6b314b2`); `Last-Modified: Sat, 31 Oct 2026 01:46:48 GMT`; servido `index-DmxsQuIL.js` sha256 `79e3182c860855c0…`, `index-q-biCwua.css` `5e1c964b3b292f33…`, `index.html` `ba4e81a44a43f150…` = build limpo de `e70aad9` medido em `pista-kart-park/…/deploy-validation-20261030-1852.md` |
| Diferença candidato → servido (P1) | `git diff --stat 6b314b2 e70aad9 -- src index.html`: `index.html` (crédito `#lap-training-result-credit` dentro de `#lap-training-result`; `#lap-result-credit` retirado), `src/main.ts` (`renderTrainingResult` deixa de usar `replaceChildren`, mantém o contêiner do crédito; crédito saiu de `renderResult`), `src/style.css`; `e70aad9..1bb63aa` só registros (`400/500/600 …/Output`, `docs/`) |
| `check_served.py` com o hash do candidato (P5) | `… check_served.py <URL> index-BwruE9Pq.js` → `checks=53 failed=1` (`hash do JS é o esperado — servido index-DmxsQuIL.js, esperado index-BwruE9Pq.js`), saída 1 |
| `check_served.py` com o hash servido (P3) | `… check_served.py <URL> index-DmxsQuIL.js` → `status=200 js_bytes=694178 css_bytes=10850 checks=53 failed=0`, saída 0 (GET em HTTPS, nenhum outro efeito) |
| Pipeline do servido (P1) | log de 41156803005 reduzido por script (fora do contexto): `tests 444 / pass 444 / fail 0 / skipped 0 / cancelled 0`, 0 `✖`; `node: v24.22.1`; *Build* `index-DmxsQuIL.js 694.17 kB`; *Measure dist* `total_bytes=711620 gzip_bytes=188719 within_limit=True` |
| Veredito de testes mais novo (P1) | SUCCESS — `test-validation-20261030-1559.md` (179/179 da feature) sobre a árvore de `6b314b2`; nenhum veredito desta feature sobre `e70aad9` |
| Segredos (P2) | 0 valores — padrões de token com corpo (`ghp_…{30,}`, `github_pat_…`, `gho_`, `ghs_`, `AKIA…`, PEM, JWT, `password=`/`token=` com valor) em `600 Deploy/Output`, `docs/` (os quatro device logs) e `.github/`: 0; log de 41156803005: 0, 6 máscaras `***` |
| Migração (P4) | não se aplica — sem banco nem armazenamento (`REL-0002`) |
| Smoke humano — execução no celular de 2026-10-30 (P5) | `docs/lap-validation-device-log.md` linhas 107–128, sobre `e70aad9` / `index-DmxsQuIL.js`, aparelho sem modelo, navegador e versão; confirmado especificamente: corte invalida e o kart segue (parte de M13/H6); só "pelo resumo": voltas seguidas sem parar (M13), crédito OSM no resultado (M12), jogável em retrato (M6/H6 retrato; cabeçalho da execução diz "paisagem"); qualitativo: "rodou legal" sem fps (M11) |
| Produção | não tocada (nenhum GET, `gh` ou push contra `edumatosr6-svg/kartle`); `origin/master` local = `05c3570` |

## Issues

### ISSUE-04
- severity: blocker
- check: P1
- class: registro atrás do staging (defeito de release, não de aplicação)
- status: new
- file: `600 Deploy/Output/race-lap-validation/runbook.md`
- location: tabela de nomes `<sha>`/`<hash>`/"execução de staging em vigor" (linhas 22–24); `01-release.md` *Proveniência*; `REL-0003-rollout.md` etapa 2 (linha 22); `smoke.md` linha 21
- finding: o candidato do registro (`6b314b2`, `index-BwruE9Pq.js`, 41101055606) não é o que staging serve; staging serve o build de `1bb63aa` (árvore de `e70aad9`, `index-DmxsQuIL.js`), cujo commit este registro não declara e que muda `src/main.ts` e `index.html` desta feature (redesenho do painel `#lap-training-result`); `check_served` com o hash do candidato reprova 1/53; a execução de aparelho de 2026-10-30 foi feita sobre esse build não declarado, logo o candidato não é julgável em staging sem republicar `6b314b2`.
- expected: o `deploy-generator` (Modo B) passa o registro a `e70aad9` (como fez `pista-kart-park` em `bb5cd3a`): `<sha>`, `<hash>` `DmxsQuIL`, execução em vigor 41156803005 (ou 41109469203) com a regra de commit só de registro, `REL-0003` etapa 2, `smoke.md`, e cita um veredito de testes desta feature sobre `e70aad9` (o estágio de testes revalida, porque `renderTrainingResult` mudou); depois, revalidação.

### ISSUE-01
- severity: info
- check: P5
- class: porta humana (ambiental)
- status: open (parcial)
- file: `docs/lap-validation-device-log.md`
- location: *Execução no celular — 2026-10-30* (linhas 107–128); `runbook.md` *Linhas humanas* H1–H6; `98-divergences.md` DIV-DP-06
- finding: a execução no celular não é a execução 3 do runbook — sem aparelho nomeado (I9), sem medida, e sobre `index-DmxsQuIL.js`; confirma só o corte que invalida com o kart seguindo; voltas seguidas, crédito no resultado e retrato passaram só pelo resumo ("tudo deu certo"); fps não medido; nenhuma linha do notebook foi executada.
- expected: em aberto — H1 (D2 carga 4G < 10 s, D5 contagem de 3 s, D12 60 fps); H2 (D6–D11: painel, pausa por Esc/aba/botão, pulo/corte/reposicionamento, offline e armazenamento, pt/en/fr, escala de cinza); H3 (D13, quatro navegadores, 0 ms); H4 (D15, D16, E2E-13 "não executável pela tela"); H5 celular nomeado (M1 inclinação, M2 carga 4G, M3 bytes, M4 oferta única, M5 contagem 48 px/16 px, M6 painel legível, M7 sensor coberto e negado, M8 troca de app, M9 modo avião, M10 idioma, M11 30 fps, M12 crédito confirmado); H6 (M13 quatro voltas com "melhor volta válida", M14 "pausar" e "encerrar treino" por toque, paisagem e retrato); registrar modelo, navegador e versão do celular.

### ISSUE-02
- severity: info
- check: P6
- class: decisão do dono do produto (DIV-DP-15 `open`)
- status: open (re-verificada)
- file: `600 Deploy/Output/race-lap-validation/runbook.md`
- location: *Produção — as opções enquanto a decisão Esri não existe*
- finding: `DOMAIN.md` continua sem a decisão Esri nem a opção 1/2/3; qualquer build com o treino contínuo contém a Kart Park.
- expected: Eduardo registra a opção em `DOMAIN.md` antes de qualquer pergunta de promoção.

### ISSUE-03
- severity: info
- check: P6
- class: ensaio reutilizado
- status: open (re-verificada)
- file: `600 Deploy/Output/race-lap-validation/runbook.md`
- location: R1 caminho B; precondição "Reversão ensaiada em staging"
- finding: o alvo 41076989728 (`652bbaa`) segue `success` e retido; o caminho B não foi reexecutado (ensaio de 2026-10-27 reutilizado).
- expected: nenhuma ação nesta rodada.

## Promotion question

Não há pergunta de promoção: veredito **FAIL** por ISSUE-04 (o candidato registrado não está em staging). Volta ao `deploy-loop` para o `deploy-generator` mover o registro a `e70aad9`. Nada foi aprovado nem enviado a produção; runbook: `600 Deploy/Output/race-lap-validation/runbook.md`; ponto sem retorno: não existe nesta release.
