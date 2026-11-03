---
stage: deploy
feature: modelo-kart-01
verdict: FAIL
generated: 2026-11-03T17:41:00Z
environment: staging — `https://edumatosr6-svg.github.io/kartle-staging/` (GitHub Pages, `edumatosr6-svg/kartle-staging`, ramo `staging`, workflow `pages`)
commit: 6b314b2193c25cd6384a3f64cffdc369637b3753 (candidato do registro); servido em staging: 1bb63aa98c6c30ad3fc637e85f1e6d552d031209 (árvore de build = e70aad9ddf5cf42da6c5957b4023afdbf6cacd03)
counts: {blocker: 1, error: 0, warning: 0, info: 6, divergence: 0}
seed: {revision: 4, digest: 4e9bfbba6294}
upstream: {stage: test, verdict: test-validation-20261030-1743.md}
round: 3
mode: revalidation (evidência nova: execução no celular em `docs/kart-01/device-log.md`, 1bb63aa; nenhuma versão do registro movida)
previous: reports/deploy-validation/deploy-validation-20261030-1815.md
previous-issues: {ISSUE-01: open (parcial), ISSUE-02: open, ISSUE-03: open, ISSUE-04: open (parcial), ISSUE-05: open, ISSUE-06: open}
population: [ISSUE-01..06 do relatório anterior; version movida: nenhuma (último commit do registro e857a5b); amostra aleatória: REL-0003-rollout.md, REL-0001-config.md; evidência nova: docs/kart-01/device-log.md]
staging-run: 41156803005 (1bb63aa, success; mesmos bytes de 41109469203/e70aad9)
rollback-rehearsed: reused (caminho B, 2026-10-27 19:29–19:33Z; nada reexecutado nesta rodada)
production: não tocada; nada aprovado
feedbacks: []
---

# Relatório de validação de deploy — modelo-kart-01 (rodada 3)

## Evidence

| Prova | Resultado |
|---|---|
| Candidato do registro (P1) | `6b314b2`, execução 41101055606 (`success`, retida); `runbook.md:22` regra: commit posterior que toque `src/` ou `index.html` invalida; `REL-0003` cita `BwruE9Pq` 4 vezes e 41101055606 2 vezes, `e70aad9` 0 |
| O que staging serve (P1) | mais nova 41156803005 (`1bb63aa`, 2026-10-31T01:44:42Z, `success`); servido `index-DmxsQuIL.js` sha256 `79e3182c860855c0…`, CSS `5e1c964b3b292f33…`, HTML `ba4e81a44a43f150…` = build limpo de `e70aad9` (medido em `pista-kart-park/…/deploy-validation-20261030-1852.md`) |
| Diferença candidato → servido (P1) | `6b314b2..e70aad9` muda `src/main.ts`, `index.html`, `src/style.css` (crédito no painel do treino, ADR-0007) — invalida o candidato pela regra do runbook; `src/gameCamera.ts`, `docs/kart-01/kart.js` e o modelo sem diferença; `e70aad9..1bb63aa` só registros |
| `check_served.py` com o hash do candidato (P5) | `index-BwruE9Pq.js` → `checks=40 failed=1` (hash servido `index-DmxsQuIL.js`), saída 1 |
| `check_served.py` com o hash servido (P3) | `index-DmxsQuIL.js` → `status=200 js_bytes=694178 css_bytes=10850 checks=40 failed=0`, saída 0 (GET em HTTPS) |
| Pipeline do servido (P1) | log de 41156803005 reduzido por script: `tests 444 / pass 444 / fail 0`, 0 `✖`; *Measure dist* `total_bytes=711620 gzip_bytes=188719 within_limit=True` |
| Veredito de testes mais novo (P1) | SUCCESS — `test-validation-20261030-1743.md` (443/443) sobre `6b314b2` |
| Segredos (P2) | 0 valores no registro, em `docs/kart-01/device-log.md`, em `.github/` e no log de 41156803005 |
| Migração (P4) | não se aplica (`REL-0002`) |
| Smoke humano — execução no celular de 2026-10-30 (P5) | `docs/kart-01/device-log.md` linhas 41–62, sobre `index-DmxsQuIL.js`, aparelho sem modelo, navegador e versão; a linha 38 ("Não executadas") continua; confirmado especificamente: "aparece as marcas" (H5, marcas ao escorregar, no celular); só "pelo resumo": voltas seguidas sem parar (H2, câmera atrás no treino contínuo, não descrito), nenhuma indicação de drift (H5), retrato (H4); qualitativo: "rodou legal" sem fps (H6) |
| Produção | não tocada; `origin/master` local = `05c3570` |

## Issues

### ISSUE-07
- severity: blocker
- check: P1
- class: registro atrás do staging (defeito de release, não de aplicação)
- status: new
- file: `600 Deploy/Output/modelo-kart-01/runbook.md`
- location: tabela de nomes `<sha>` (linha 22) e `<hash>`; `01-release.md` *Proveniência*; `REL-0003-rollout.md` etapa de staging
- finding: staging serve o build de `1bb63aa` (árvore de `e70aad9`, `index-DmxsQuIL.js`), não declarado neste registro e que, pela regra do próprio runbook (muda `src/` e `index.html`), invalida o candidato `6b314b2`; `check_served` com o hash do candidato reprova 1/40, e a execução de aparelho de 2026-10-30 observou o build não declarado.
- expected: o `deploy-generator` (Modo B) passa o registro a `e70aad9` (`<sha>`, `<hash>` `DmxsQuIL`, execução 41156803005 ou 41109469203, contenção sem tocar os módulos desta feature) e cita o veredito de testes aplicável a `e70aad9`; depois, revalidação.

### ISSUE-01
- severity: info
- check: P5
- class: porta humana (ambiental)
- status: open (parcial)
- file: `docs/kart-01/device-log.md`
- location: linha 38 ("Não executadas"); *Execução no celular — 2026-10-30* (linhas 41–62); `runbook.md` *Linhas humanas* H1–H6
- finding: uma execução de celular sem aparelho nomeado, sem as três entradas pedidas (notebook paisagem, celular paisagem, celular retrato) e sem medida; confirma só que as marcas de pneu aparecem; o resto passou pelo resumo ou não foi pedido.
- expected: em aberto — H1 (visão geral, contagem gravada, recarga; 0 quadros com kart de caixas); H2 (placa `01`, sombra, câmera atrás no treino contínuo, 0 visão geral pelo fim de uma volta); H3 (rodas, volante e mãos com teclas e inclinação, pausa, reposicionamento); H4 (curva de 90° com todos os comandos, 0 cantos fora do quadro, 62° paisagem e regra de retrato); H5 detalhado (marcas só sob os pneus traseiros, 0 na reta, visão geral, contagem e pausa, 0 fumaça ou chama, 0 indicação de drift); H6 `minFps` ≥ 60 no notebook e ≥ 30 no celular nas duas formas, bytes < 3 145 728; tudo no notebook; modelo, navegador e versão do celular.

### ISSUE-02
- severity: info
- check: P6
- class: ensaio reutilizado
- status: open (re-verificada)
- file: `600 Deploy/Output/modelo-kart-01/98-divergences.md`
- location: DIV-DP-03; `runbook.md` R1/R2
- finding: o par 41076989728 ↔ 41101055606 não foi reexecutado; o alvo segue `success` e retido.
- expected: como no relatório anterior.

### ISSUE-03
- severity: info
- check: P6
- class: porta humana (decisão) — produção bloqueada
- status: open (re-verificada)
- file: `600 Deploy/Output/modelo-kart-01/01-release.md`
- location: *Produção — opções enquanto a decisão Esri não existe*; DIV-DP-15
- finding: `DOMAIN.md` continua sem a decisão Esri nem a opção 1/2/3.
- expected: como no relatório anterior.

### ISSUE-04
- severity: info
- check: P5
- class: porta humana (decisão)
- status: open (parcial)
- file: `600 Deploy/Output/modelo-kart-01/98-divergences.md`
- location: DIV-DP-12; `runbook.md` precondição *Portas humanas das releases contidas*
- finding: as quatro listas foram tocadas na mesma sessão de celular de 2026-10-30 (`docs/handling-device-log.md` criado, execução nova em `docs/lap-validation-device-log.md`, `docs/kart-park-device-log.md` criado), mas nenhuma fecha: sem aparelho nomeado, sem medidas e sem o notebook.
- expected: as linhas em aberto de cada log (ver os relatórios de deploy de 2026-11-03 das outras três features).

### ISSUE-05
- severity: info
- check: P5
- class: porta humana (decisão)
- status: open (re-verificada)
- file: `600 Deploy/Output/modelo-kart-01/98-divergences.md`
- location: DIV-DP-14; `smoke.md` D11, M11; `runbook.md` H2
- finding: AC-US-0003-13 na forma completa continua inalcançável (só o treino é oferecido); nenhuma aceitação registrada.
- expected: como no relatório anterior.

### ISSUE-06
- severity: info
- check: P1
- class: registro impreciso
- status: open (re-verificada)
- file: `600 Deploy/Output/modelo-kart-01/01-release.md`
- location: *Medida real do artefato*; `97-changelog.md`; `REL-0005`
- finding: o registro não mudou desde `e857a5b`; as medidas de `index.html` 6 667 / 711 561 / 188 918 seguem sem `MSYS_NO_PATHCONV=1`.
- expected: corrigir junto com ISSUE-07, já com as medidas de `e70aad9` (711 620 / 188 719).

## Promotion question

Não há pergunta de promoção: veredito **FAIL** por ISSUE-07 (o candidato registrado não está em staging e o build servido o invalida pela regra do runbook). Volta ao `deploy-loop` para o `deploy-generator` mover o registro a `e70aad9`. Nada foi aprovado nem enviado a produção; runbook: `600 Deploy/Output/modelo-kart-01/runbook.md`; ponto sem retorno: não existe.
