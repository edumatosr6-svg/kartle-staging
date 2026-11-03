---
stage: deploy
feature: dirigibilidade
verdict: FAIL
generated: 2026-11-03T17:38:00Z
environment: staging — `https://edumatosr6-svg.github.io/kartle-staging/` (GitHub Pages, `edumatosr6-svg/kartle-staging`, ramo `staging`, `.github/workflows/pages.yml`)
commit: 6b314b2193c25cd6384a3f64cffdc369637b3753 (candidato do registro); servido em staging: 1bb63aa98c6c30ad3fc637e85f1e6d552d031209 (árvore de build = e70aad9ddf5cf42da6c5957b4023afdbf6cacd03)
counts: {blocker: 1, error: 0, warning: 0, info: 4, divergence: 0}
seed: {revision: 6}
upstream: {stage: test, verdict: test-validation-20261030-1638.md}
round: 3
mode: revalidation (evidência nova: `docs/handling-device-log.md` criado em 1bb63aa; nenhuma versão do registro movida)
previous: deploy-validation-20261030-1817.md
previous-issues: {ISSUE-01: open (parcial), ISSUE-05: open, ISSUE-06: open, ISSUE-07: open}
population: [ISSUE-01, -05, -06, -07 do relatório anterior; version movida: nenhuma (último commit do registro e76af69); amostra aleatória: REL-0001-config.md, runbook.md; evidência nova: docs/handling-device-log.md]
staging-run: 41156803005 (1bb63aa, success; mesmos bytes de 41109469203/e70aad9)
rollback-rehearsed: reused (caminho B, 2026-10-27; nada reexecutado nesta rodada)
production: não tocada; nada aprovado
feedbacks: []
---

# Relatório de validação de deploy — dirigibilidade (rodada 3)

## Evidence

| Prova | Resultado |
|---|---|
| Candidato do registro (P1) | `6b314b2`, execução 41101055606 (`success`, retida); `runbook.md:23` regra: "um commit posterior só de registro (que não toque `src/`, …, `index.html`, …) não invalida a release; qualquer outro invalida" |
| O que staging serve (P1) | mais nova 41156803005 (`1bb63aa`, 2026-10-31T01:44:42Z, `success`), depois de 41111441877 (`28d40ef`) e 41109469203 (`e70aad9`); servido `index-DmxsQuIL.js` sha256 `79e3182c860855c0…`, CSS `5e1c964b3b292f33…`, HTML `ba4e81a44a43f150…` = build limpo de `e70aad9` (medido em `pista-kart-park/…/deploy-validation-20261030-1852.md`) |
| Diferença candidato → servido (P1) | `6b314b2..e70aad9` muda `src/main.ts`, `index.html`, `src/style.css` (crédito OSM no painel do treino, ADR-0007) — pela regra do `runbook.md:23`, invalida o candidato; `src/physics.ts`, `src/setupRecords.ts`, `docs/physics.md`, `package*.json` sem diferença; `e70aad9..1bb63aa` só registros |
| `check_served.py` com o hash do candidato (P5) | `index-BwruE9Pq.js` → `checks=22 failed=1` (hash servido `index-DmxsQuIL.js`), saída 1 |
| `check_served.py` com o hash servido (P3) | `index-DmxsQuIL.js` → `status=200 js_bytes=694178 checks=22 failed=0`, saída 0 (GET em HTTPS) |
| Pipeline do servido (P1) | log de 41156803005 reduzido por script: `tests 444 / pass 444 / fail 0`, 0 `✖`; *Measure dist* `total_bytes=711620 gzip_bytes=188719 within_limit=True` |
| Veredito de testes mais novo (P1) | SUCCESS — `test-validation-20261030-1638.md` (65/65 da feature) sobre a árvore anterior a `e70aad9` |
| Segredos (P2) | 0 valores no registro, em `docs/handling-device-log.md`, em `.github/` e no log de 41156803005 |
| Migração (P4) | não se aplica (`REL-0002`) |
| Smoke humano — execução no celular de 2026-10-30 (P5) | `docs/handling-device-log.md` linhas 5–26, sobre `index-DmxsQuIL.js`, aparelho sem modelo, navegador e versão; confirmado especificamente: "virou bem" (H1 metade celular, veredito de sensação do acerto C); só "pelo resumo": nenhum botão ou texto de drift (H3 metade celular, M4/M7); qualitativo: "rodou legal" sem fps (H5/M9) |
| Produção | não tocada; `origin/master` local = `05c3570` |

## Issues

### ISSUE-08
- severity: blocker
- check: P1
- class: registro atrás do staging (defeito de release, não de aplicação)
- status: new
- file: `600 Deploy/Output/dirigibilidade/runbook.md`
- location: tabela de nomes `<sha>`/`<hash>` (linha 23 e seguintes); `01-release.md` *Proveniência*; `REL-0003-rollout.md` etapa de staging
- finding: staging serve o build de `1bb63aa` (árvore de `e70aad9`, `index-DmxsQuIL.js`), que muda `src/main.ts` e `index.html` depois de `6b314b2` — pela própria regra do runbook, esse build invalida o candidato registrado; o commit servido não está declarado neste registro, `check_served` com o hash do candidato reprova 1/22, e a execução de aparelho de 2026-10-30 observou esse build, não o candidato.
- expected: o `deploy-generator` (Modo B) passa o registro a `e70aad9` (`<sha>`, `<hash>` `DmxsQuIL`, execução 41156803005 ou 41109469203, contenção `git diff 6b314b2 e70aad9` sem tocar os módulos desta feature) e cita o veredito de testes aplicável a `e70aad9`; depois, revalidação.

### ISSUE-01
- severity: info
- check: P5
- class: porta humana (ambiental)
- status: open (parcial)
- file: `docs/handling-device-log.md`
- location: *Execução no celular — 2026-10-30* (linhas 5–26); `runbook.md` *Linhas humanas* H1–H5; `98-divergences.md` DIV-DP-01, DIV-DP-07
- finding: o log agora existe, mas só com uma execução de celular sem aparelho nomeado e sem medida; confirma a sensação de curva no celular; "sem drift" só pelo resumo; fps não medido; nenhuma linha do notebook.
- expected: em aberto — H1 metade notebook (teclado) e, no celular, 0 "Saindo de traseira"/"Derrapando" com esterço parcial (M8); H2 grampos com tentativas e saídas, (a) e (b) (D13); H3 notebook (Espaço sem efeito, telas em pt e en) e o controle de toque com a inclinação negada (M7); H4 gravação do HUD por quadro, pausa, troca para Realista (D6, D8, D9, M6); H5 fps ≥ 60 no notebook e ≥ 30 no celular nomeado, `STEP_COST` ≤ 1,10× (D12, M9); D2/M2 carga em 4G (RNF01); M1, M3, M5; modelo, navegador e versão do celular.

### ISSUE-05
- severity: info
- check: P6
- class: ensaio reutilizado
- status: open (re-verificada)
- file: `600 Deploy/Output/dirigibilidade/runbook.md`
- location: R1 caminho B
- finding: o alvo 41076989728 segue `success` e retido; o caminho B não foi reexecutado (ensaio de 2026-10-27 reutilizado).
- expected: nenhuma ação nesta rodada.

### ISSUE-06
- severity: info
- check: P5
- class: ambiental (não é lacuna de requisito)
- status: open (re-verificada)
- file: `600 Deploy/Output/dirigibilidade/98-divergences.md`
- location: DIV-DP-13; `smoke.md` D14, M10
- finding: `#lap-share` continua inalcançável pela interface (só o treino é oferecido); a execução no celular não o cobre.
- expected: como no relatório anterior — reclassificação da metade humana de E2E-02 ou aceitação registrada pelo dono do produto.

### ISSUE-07
- severity: info
- check: P8
- class: decisão humana pendente
- status: open (re-verificada)
- file: `600 Deploy/Output/dirigibilidade/01-release.md`
- location: *Promoção*; `98-divergences.md` DIV-DP-14
- finding: `DOMAIN.md` continua sem a decisão Esri; não existe commit com o acerto C sem a Kart Park.
- expected: o dono do produto registra a decisão Esri ou a de esperar; nenhum loop promove.

## Promotion question

Não há pergunta de promoção: veredito **FAIL** por ISSUE-08 (o candidato registrado não está em staging e o build servido o invalida pela regra do runbook). Volta ao `deploy-loop` para o `deploy-generator` mover o registro a `e70aad9`. Nada foi aprovado nem enviado a produção; runbook: `600 Deploy/Output/dirigibilidade/runbook.md`; ponto sem retorno: não existe.
