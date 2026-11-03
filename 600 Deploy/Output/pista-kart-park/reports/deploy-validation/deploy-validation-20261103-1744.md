---
stage: deploy
feature: pista-kart-park
verdict: SUCCESS
generated: 2026-11-03T17:44:00Z
environment: staging — `https://edumatosr6-svg.github.io/kartle-staging/` (GitHub Pages, `edumatosr6-svg/kartle-staging`, ramo `staging`, `.github/workflows/pages.yml`, D23)
commit: e70aad9ddf5cf42da6c5957b4023afdbf6cacd03 (servido pela execução de 1bb63aa, só registros depois de e70aad9)
counts: {blocker: 0, error: 0, warning: 1, info: 4, divergence: 0}
seed: {revision: 1, digest: b5aa5be4734a}
upstream: {stage: test, verdict: test-validation-20261030-1844.md}
round: 3
mode: revalidation (evidência nova: `docs/kart-park-device-log.md` criado em 1bb63aa; nenhuma versão do registro movida)
previous: reports/deploy-validation/deploy-validation-20261030-1852.md
previous-issues: {ISSUE-01: open (parcial), ISSUE-03: open, ISSUE-04: open, ISSUE-05: open (parcial), ISSUE-06: open}
population: [ISSUE-01, -03..-06 do relatório anterior; version movida: nenhuma (último commit do registro bb5cd3a); amostra aleatória: 01-release.md, REL-0004-mobile.md; evidência nova: docs/kart-park-device-log.md]
staging-run: 41156803005 (1bb63aa, success)
rollback-rehearsed: reused (caminho B, 2026-10-27 19:29–19:33Z; nada reexecutado nesta rodada); alvo 41101055606 (`6b314b2`) `success`, retido, só para emergência
production: BLOCKED (decisão Esri, ADR-0005 / NFR-0012; nada aprovado, acionado nem enviado a `edumatosr6-svg/kartle`)
divergences: []
feedbacks: []
---

# Relatório de validação de deploy — pista-kart-park (rodada 3)

## Evidence

| Prova | Resultado |
|---|---|
| Commit verificado nomeado (P1) | `e70aad9` em `01-release.md`, `runbook.md:24` `<sha>` com a regra de invalidação "não muda a árvore construída (`src/`, `index.html`, `package.json`, `package-lock.json`, `tsconfig.json`, `vite.config.*`) nem os bytes dos três arquivos de pista" |
| Execução servida (P1) | `gh run list` (leitura): mais nova 41156803005 (`1bb63aa`, 2026-10-31T01:44:42Z, tentativa 1, `success`; `build` 01:44:44–01:46:42Z, `deploy` 01:46:44–01:46:54Z), depois de 41111441877 (`28d40ef`) e 41109469203 (`e70aad9`); `git diff --name-only e70aad9 1bb63aa`: só `400/500/600 …/Output` e `docs/` — nenhum caminho da regra de invalidação nem `.github/`, `tracks/`, `scripts/` |
| Servido = build limpo de `e70aad9` (P1) | GET às 17:31Z com `Cache-Control: no-cache`: `index-DmxsQuIL.js` 694 178 bytes sha256 `79e3182c860855c0…`, `index-q-biCwua.css` 10 850 bytes `5e1c964b3b292f33…`, `index.html` 6 592 bytes `ba4e81a44a43f150…` — iguais aos do build limpo de `e70aad9` do relatório anterior; `Last-Modified: Sat, 31 Oct 2026 01:46:48 GMT` |
| Pipeline do servido (P1) | log de 41156803005 reduzido por script (875 linhas, fora do contexto): `tests 444 / pass 444 / fail 0 / skipped 0 / cancelled 0 / todo 0`, 0 `✖` (as 21 "linhas de falha" do redutor são nomes de checks aprovados com "fail"/"refused"); `node: v24.22.1`; *Measure dist* `total_bytes=711620 gzip_bytes=188719 within_limit=True` |
| Veredito de testes mais novo (P1) | SUCCESS — `test-validation-20261030-1844.md` (444/444, 103 da feature, `seed` revisão 1 `b5aa5be4734a` = `SEED.md`) |
| Segredos (P2) | 0 valores — padrões de token com corpo no registro, nos quatro device logs, em `.github/` e no log de 41156803005; 6 máscaras `***` |
| Instalação em staging (P3) | `python -I "…/tools/check_served.py" https://edumatosr6-svg.github.io/kartle-staging/ index-DmxsQuIL.js` às 17:31Z: `status=200 js_bytes=694178 css_bytes=10850 cache_control='max-age=600' track_sha256=04ce5e510410e297…0f057b1 checks=79 failed=0`, saída 0 (três GET) |
| Bundle (P3, NFR-0001/0010/0012) | bytes servidos iguais aos do relatório anterior (`check_bundle.py` 88/88 sobre o servido e o build limpo); não reexecutado |
| Migração (P4) | não se aplica (`REL-0002`; DES-0012) |
| Promoção bloqueada (P6, NFR-0012) | reutilizado: `promote kart-park 1` sem `--esri-decision` recusou (saída 1) em 2026-10-30; `tracks/` e `src/tracks/` sem diferença `e70aad9..1bb63aa`; `DOMAIN.md` sem decisão Esri |
| Reversão (P6) | caminho B reutilizado; alvo 41101055606 `success`, retido (emergência: sem o crédito no painel); produção caminho A, nada a reverter; `origin/master` local = `05c3570` |
| Ordem de `REL-0003` vs ocorrido (P8) | etapa 2 lista até 41109469203; depois houve 41111441877 e 41156803005, pushes só de registro previstos pela regra de invalidação, com os mesmos bytes servidos |
| Smoke humano — execução no celular de 2026-10-30 (P5) | `docs/kart-park-device-log.md` linhas 5–26, sobre `e70aad9` / `index-DmxsQuIL.js`, aparelho sem modelo, navegador e versão; confirmado especificamente: vibração na zebra (M7/H5), corte invalida e o kart segue (D10 no celular); só "pelo resumo": voltas seguidas, crédito OSM no painel do resultado de cada volta (M10/H5, ADR-0007), retrato (M4, M9, M10); qualitativo: "rodou legal" sem fps (M9) |
| Smoke automático (P5) | D1, D3, D17 passam (79/79; bytes iguais; 711 620 brutos); nenhuma automação de navegador usada |
| Autenticação, RBAC, webhook (P5) | não se aplica — página estática |

## Issues

### ISSUE-01
- severity: info
- check: P5
- class: porta humana (ambiental)
- status: open (parcial)
- file: `docs/kart-park-device-log.md`
- location: *Execução no celular — 2026-10-30* (linhas 5–26); `runbook.md` *Linhas humanas* H1–H8; `smoke.md` D2, D4–D16, D18, M1–M12
- finding: o log agora existe, com uma execução de celular sem aparelho nomeado e sem medida; confirma vibração na zebra e corte que invalida; o crédito no painel do resultado — a mudança desta rodada (ADR-0007) — passou só pelo resumo; fps não medido; nenhuma linha do notebook.
- expected: em aberto — H1 (Chrome, Edge, Firefox, Safari: seletor, crédito com link em outra aba, sintética e recarga, nada persistido); H2 (troca de pista, "encerrar treino"); H3 notebook (duas voltas seguidas, pulo de marcador, barreira a ≈ 50 km/h, perda de foco, recarga, sintética, 60 fps); H4 som da zebra em Chrome e Firefox, ligado e desligado; H5 celular nomeado (inclinação negada, pulso de 20 ms que para fora da zebra e na pausa, crédito confirmado no painel a cada volta e ausente na sintética, 30 fps em paisagem e retrato); H6 navegador sem `navigator.vibrate` e bytes em 4G; H7 offline/modo avião; H8 inglês; D2/M2 carga em 4G (RNF01); D5/M5 console; modelo, navegador e versão do celular.

### ISSUE-03
- severity: info
- check: P6
- class: ensaio reutilizado
- status: open (re-verificada)
- file: `600 Deploy/Output/pista-kart-park/98-divergences.md`
- location: DIV-DP-03; `runbook.md` R1/R2
- finding: o caminho B não foi repetido para o par 41101055606 ↔ servido; o alvo segue `success` e retido.
- expected: como no relatório anterior.

### ISSUE-04
- severity: info
- check: P6
- class: porta humana (decisão) — promoção BLOQUEADA
- status: open (re-verificada)
- file: `600 Deploy/Output/pista-kart-park/runbook.md`
- location: precondição "Decisão Esri registrada em `DOMAIN.md`"; *Promote* 11; DIV-DP-14, DIV-DP-15
- finding: `DOMAIN.md` mantém OPEN-01 (Esri) sem decisão; nada aprovado, acionado nem enviado a produção.
- expected: como no relatório anterior.

### ISSUE-05
- severity: info
- check: P6
- class: porta humana (decisão)
- status: open (parcial)
- file: `600 Deploy/Output/pista-kart-park/runbook.md`
- location: precondição "Portas humanas das releases contidas"; DIV-DP-12
- finding: as listas de `race-lap-validation`, `dirigibilidade` e `modelo-kart-01` foram tocadas na mesma sessão de celular (`docs/handling-device-log.md` criado; execuções novas em `docs/lap-validation-device-log.md` e `docs/kart-01/device-log.md`), sem fechar nenhuma; os registros dessas três ainda nomeiam `6b314b2` e não o build servido (FAIL de deploy de 2026-11-03 de cada uma).
- expected: as três releases contidas passam os seus registros a `e70aad9` e fecham as suas linhas humanas, ou Eduardo registra a decisão de as separar.

### ISSUE-06
- severity: warning
- check: P1 e P6
- class: registro atrás do estado
- status: open (re-verificada)
- file: `600 Deploy/Output/pista-kart-park/01-release.md`
- location: *Proveniência* "Veredito de testes"; `runbook.md` precondições (linhas 59–61); DIV-DP-02, DIV-DP-07, DIV-DP-12; `REL-0003` linha 107; `REL-0005` linha 42
- finding: o registro não mudou desde `bb5cd3a`: continua "validação de testes em curso", a precondição por marcar, as medidas de `6b314b2` (711 477 / 188 682) e DIV-DP-12 com o build de `6b314b2`; e agora a execução servida é 41156803005, não 41109469203.
- expected: o mesmo do relatório anterior, mais a precondição `docs/kart-park-device-log.md` apontando a execução de 2026-10-30 como parcial e a execução servida 41156803005 em `REL-0003` etapa 2.

## Promotion question

Veredito **SUCCESS**: staging serve o build da árvore de `e70aad9` (execução 41156803005, `success`, 444/444), byte a byte igual ao build limpo, `check_served` 79/79, arquivo da Kart Park `04ce5e51…` = registro em `STAGING`.

**Não há pergunta de promoção para esta release**: produção está **BLOQUEADA** pela decisão Esri (ADR-0005; NFR-0012), `runbook.md` termina em *Promote* 11 ("parar"), e nada foi aprovado, acionado nem enviado a `edumatosr6-svg/kartle`. Reversão em staging: caminho B para 41101055606 só em emergência (`600 Deploy/Output/pista-kart-park/runbook.md`, R1/R2); ponto sem retorno: não existe nesta release. Fica com Eduardo: as linhas humanas de ISSUE-01, as das releases contidas (ISSUE-05) e a decisão Esri (ISSUE-04).
