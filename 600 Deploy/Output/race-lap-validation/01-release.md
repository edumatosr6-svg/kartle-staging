---
title: Release — validação de volta de corrida
feature: race-lap-validation
stage: deploy
status: validated
version: 1.2.0
sources: [DM-0001, DM-0002, DES-0001, DES-0007, DES-0008, DES-0009, DES-0010, DES-0011, ADR-0006, NFR-0003, NFR-0004, NFR-0006, NFR-0007, NFR-0012]
---

# 01 — Release

Candidato a release da feature `race-lap-validation` no **seed rev 3** (2026-10-29; digest `beee272fdb3b`): à contagem
regressiva, à cronometragem por passo fixo, à validação da volta (marcadores, sentido, corte, reposicionamento), aos tipos
de volta e ao HUD da primeira release soma-se o **treino como sequência de voltas numa sessão** (ADR-0006): o resultado de
cada volta aparece no painel lateral `#lap-training-result` **sem parar o kart**, uma volta inválida é marcada no quadro
seguinte e o treino segue até a chegada, "melhor volta válida" fica visível a partir da primeira volta válida, "—" ocupa o
setor não cruzado, o treino termina pelo botão "encerrar treino" (em corrida ou em pausa) e o botão "pausar" pausa nos dois
canais. A **volta oficial e a de reconhecimento ficam inalteradas** (INV-1 de DM-0002; confirmado pelo relatório de código) e continuam
**não ofertadas** nesta release: a oferta depende do desafio diário, outra feature (DES-0009; `offeredLapKinds(reading, [])`
em `src/main.ts`). O que se entrega é o mesmo tipo de artefato da primeira release: um **artefato estático** (`dist/`, HTML
+ JS + CSS) servido pelo **GitHub Pages** com HTTPS (D23); não há servidor, banco, serviço, armazenamento no navegador nem
aplicativo nativo.

## O que é entregue

| Item | Conteúdo | Fonte |
|---|---|---|
| Canais | `web-desktop` e `web-mobile` — a mesma página, teclado no computador, inclinação ou toque no celular; o botão "pausar" e o botão "encerrar treino" nos dois | diretivas do estágio; `REL-0004` |
| Arquivos de origem desta rodada | alterados: `src/lap.ts` (sessão de treino: `lapSequenceCount`, `lapStartMs`, `trainingLapMs`, `bestValidLapMs`, `endTraining`, pausa `PAUSE_BUTTON`), `src/lapMessages.ts` (24 chaves pt/en; quatro novas: `pauseAction`, `endTrainingAction`, `bestValidLap`, `sectorNoTime`), `src/main.ts` (painel lateral, melhor volta, botões), `index.html` (`#lap-best-valid`, `#lap-training-result`, `#lap-end-training`), `src/style.css`; inalterados: `src/lapTiming.ts`, `src/frameClock.ts`, `src/trackData.ts`, `src/track.ts`, `src/physics.ts`; dependências: nenhuma acrescentada | `400 Code/Output/race-lap-validation/01-implementation.md`; `code-validation-20261030-1526.md` |
| Formato publicado que muda | nenhum nesta rodada: o arquivo de pista segue o esquema 3 da release `pista-kart-park`, com o leitor das versões 1 e 2 mantido (`REL-0002`) | DM-0001 |
| Formato persistido que muda | nenhum: a sessão de treino vive em memória e é descartada ao recarregar (DM-0002; E2E-08: 0 entradas no armazenamento do site) | DM-0002, DES-0011 |
| Feature flag | **nenhuma**, por decisão do projeto validado (DES-0007, DES-0011; ADR-0006 não acrescenta chave); a reversão é a republicação do artefato anterior (`runbook.md`) | DES-0007 |
| Variáveis de ambiente | nenhuma lida pelo cliente | `REL-0001` |
| O que o jogador vê de novo | "treino" na oferta; uma só contagem 3, 2, 1, VERDE por treino; a cada chegada o painel lateral com tempo total, quatro setores (ou "—"), validade com o motivo e "não oficial", sem cobrir o estado da volta; o kart segue, o cronômetro recomeça, nenhuma contagem nova; "melhor volta válida"; "inválida · corte" no quadro seguinte ao corte e a volta segue até a chegada; "❚❚ pausar" / "▶ continuar"; "encerrar treino" visível durante o treino em corrida e em pausa, ausente fora dele | DES-0001, DES-0008, DES-0010; `smoke.md` |

## Proveniência — o commit que a release nomeia

| Fato | Estado em 2026-10-30 |
|---|---|
| Veredito de testes | `SUCCESS` — `500 Tests/Output/race-lap-validation/reports/test-validation/test-validation-20261030-1559.md` (rodada 5, seed rev 3): **179** verificações desta feature coletadas e aprovadas (140 antes, 39 acrescentadas, 0 removidas); execução fresca de 2026-10-30T15:53:21Z; 72 de 111 critérios verificados por `npm test` e **39** com a metade de tela, aparelho ou navegador pendente (27 das rodadas anteriores + 12 de US-0010, todos ligados a E2E-12/E2E-13). Na suíte inteira daquela execução, 10 reprovações eram de outras features (`pista-kart-park`, `dirigibilidade`), corrigidas pelos commits que elas fizeram depois |
| Validação de código | `SUCCESS` — `400 Code/Output/race-lap-validation/reports/code-validation/code-validation-20261030-1526.md` (4 `warning` e 1 `info` herdados; volta oficial e de reconhecimento inalteradas) |
| Commits da feature | `0c83ed9` (código validado) e `8811414` (testes revalidados, 179 checks); `git diff --stat 0c83ed9 8811414 -- src index.html` vazio: o veredito de testes verificou a árvore de código validada |
| **Commit construído e publicado em staging** | **`6b314b2193c25cd6384a3f64cffdc369637b3753`** (curto `6b314b2`, `master`, 2026-10-30T14:43:19−03:00, "modelo-kart-01: testes migrados para o seed rev 4 … — 443/443"). Entre `8811414` e `6b314b2` entraram `f6e2d16`, `c387839` (`dirigibilidade` rodada 6), `aeaf504`, `6b314b2` (`modelo-kart-01` rodada 3) e `1254443` (`pista-kart-park`, testes): tocam `index.html`, `src/main.ts`, `src/style.css`, `src/gameCamera.ts` e `src/kart01Model.ts`, **nenhum módulo desta feature** (`src/lap.ts`, `src/lapMessages.ts`, `src/lapTiming.ts`, `src/frameClock.ts`, `src/trackData.ts`) e nenhum `tests/race-lap-validation-*`. As 179 verificações desta feature correm no `npm test` do workflow sobre `6b314b2` (443 aprovados na mensagem do commit; a execução só publica com `npm test` verde), e a página servida carrega os elementos e as 24 mensagens desta rodada (`tools/check_served.py`, 53/53, abaixo) |
| Staging — execução | `edumatosr6-svg/kartle-staging`, workflow `pages`, execução **41101055606**, commit `6b314b2`, **success** (dado do condutor do loop; confirmado pelo validador na aba Actions) |
| Staging — o que é servido | `https://edumatosr6-svg.github.io/kartle-staging/` lido em 2026-10-30 por GET público (sem token): HTTP 200, `Last-Modified: Fri, 30 Oct 2026 17:48:06 GMT`, `Cache-Control: max-age=600`; `index.html` referencia `assets/index-BwruE9Pq.js` e `assets/index-oR7KyBh_.css`; `python -I "600 Deploy/Output/race-lap-validation/tools/check_served.py" https://edumatosr6-svg.github.io/kartle-staging/ index-BwruE9Pq.js` → `checks=53 failed=0`. O manifesto de código de `modelo-kart-01` (rodada 3) nomeia o mesmo `index-BwruE9Pq.js` com 694 094 bytes no build local: o `<hash>` local e o de staging coincidem |
| Alvo de reversão em staging (caminho B) | execução **41076989728**, commit **`652bbaa`** (2026-10-30T12:02:08−03:00) — a última execução verde anterior à desta rodada; contém a primeira release desta feature (treino de uma volta, seed rev 2) e não contém `0c83ed9` |
| Produção | `https://edumatosr6-svg.github.io/kartle/` (`edumatosr6-svg/kartle`, ambiente `github-pages` com **revisor obrigatório** `edumatosr6-svg`; o clique é a promoção, D-DP-06). **Nada foi promovido**: na última observação registrada (registro de `pista-kart-park`, 2026-10-27) a URL respondia 404, e a referência local `origin/master` é `05c3570` (a leitura em vigor é a da aba Actions e de Settings → Pages, feita pelo validador ou pelo dono do produto; este estágio não toca produção). A promoção da primeira release continua à espera da **execução 3** do log de aparelho, e agora também da questão Esri (abaixo) |
| Tag de release | não existe; a release é identificada pelo hash acima e pela execução do workflow que a publicar |
| Sistema de CI | **GitHub Actions**, `.github/workflows/pages.yml` (inalterado desde `c1f7f28`): `npm ci` → `npm test` → `npm run build -- --base=/<repo>/` → `measure_dist.py` → `upload-pages-artifact` → `deploy-pages`; etapas em `REL-0003` |

### A produção e a Kart Park — `master` não é promovível hoje

Todo commit de `master` a partir de `ba221ad` contém a pista **Kart Park** (`pista-kart-park`), cuja promoção a produção está
**bloqueada pela decisão Esri** (licença do dado derivado do Esri World Imagery; `DOMAIN.md` de `pista-kart-park`, 2026-10-22;
ADR-0005 daquela feature). Esta rodada (`0c83ed9`) vem depois de `ba221ad` e reescreve `src/lap.ts` e `src/lapMessages.ts`
sobre as mudanças da Kart Park (`git log 6ea3862..0c83ed9 -- src/lap.ts src/lapMessages.ts`: `ba221ad`, `0c83ed9`). Logo
**promover esta release é promover a Kart Park**. As opções, todas do dono do produto (D-DP-06), estão em `runbook.md`,
*Produção — as opções enquanto a decisão Esri não existe*:

1. **esperar a decisão Esri** e promover tudo junto (as quatro features) numa entrega que a cumpra;
2. **publicar `6ea3862` em produção antes** (a opção 2 do runbook de `pista-kart-park`): leva a **primeira** release desta
   feature (seed rev 2, treino de uma volta), não esta rodada; o treino contínuo fica em staging até a opção 1;
3. **portar o treino contínuo para um ramo sem a Kart Park** (a partir de `6ea3862`): não é uma promoção deste build — é
   trabalho novo de código, testes e deploy (os dois módulos divergem por causa da Kart Park), com o seu próprio veredito.

### Precondições humanas que restam, em ordem

1. **Validação de staging pelo validador** sobre a execução 41101055606 (`reports/deploy-validation/`): `<hash>` servido
   `BwruE9Pq`, `check_served.py` 53/53, e o ensaio de reversão pelo caminho B em staging (reexecutar 41076989728 e voltar),
   se o validador o exigir para esta rodada.
2. **Execução 3 do log de aparelho** (`docs/lap-validation-device-log.md`), humana, sobre a URL de staging, no notebook e no
   celular de referência nomeados — o roteiro de `runbook.md`, *Linhas humanas — o roteiro da execução 3* (H1–H6), agora com
   **E2E-12** (voltas seguidas, inválida segue, pausa pelo botão, encerrar treino) e o registro de **E2E-13**. Os 39
   critérios `unverified` do veredito de testes dependem desse registro (DIV-DP-06).
3. **A escolha do dono do produto entre as opções de produção** acima, registrada em `DOMAIN.md`; e, na opção 1, a decisão
   Esri.
4. Só então a pergunta de promoção (`runbook.md`, passo 9).

Cumpridas: o veredito de testes e o de código `SUCCESS` no seed rev 3; o commit construído em staging nomeado e a
contenção da árvore verificada demonstrada; o artefato servido conferido (53/53) e medido (abaixo); o alvo de reversão em
staging nomeado (41076989728); o Node fixado (`.nvmrc` = `24`); os dois repositórios e a política de ramos de staging
(desde 2026-10-21); a decisão de monitoramento (vigilância manual), mantida.

## Reprodução do build

O workflow executa estes passos a cada push; à mão, da raiz do repositório, com caminhos entre aspas:

| Passo | Comando | Resultado esperado |
|---|---|---|
| 1 | `npm ci` | saída 0; `package-lock.json` inalterado |
| 2 | `npm test` | saída 0; 443 aprovados, 0 reprovados, 0 pulados em `6b314b2` (179 `CHK-TEST-*` desta feature) |
| 3 | `npm run build` (no workflow: `-- --base=/kartle/` ou `/kartle-staging/`, pelo nome do repositório) | saída 0 (`tsc --noEmit` e `vite build`); `dist/index.html`, `dist/assets/index-<hash>.js`, `dist/assets/index-<hash>.css` |
| 4 | `python -I "600 Deploy/Output/race-lap-validation/tools/measure_dist.py" dist` | tabela de tamanhos; `within_limit=True`; saída 0 (é a ferramenta que o workflow chama) |
| 5 | `python -I "600 Deploy/Output/race-lap-validation/tools/check_served.py" <URL> index-<hash>.js` | `checks=53 failed=0` sobre a URL publicada (só leitura; três GET em HTTPS) |
| 6 | `npm run preview` | `http://127.0.0.1:4173` serve o bundle; a página abre com a oferta "treino"; ao iniciá-lo, uma contagem e, a cada chegada, o painel `#lap-training-result` |

### Medida real do artefato servido em staging (execução 41101055606, commit `6b314b2`, base `/kartle-staging/`)

| Arquivo | bytes | gzip bytes |
|---|---:|---:|
| `assets/index-BwruE9Pq.js` | 694 094 | 183 262 |
| `assets/index-oR7KyBh_.css` | 10 800 | 3 040 |
| `index.html` | 6 583 | 2 596 |
| **total** | **711 477** | **188 898** |

- Medido com `measure_dist.py` sobre os três arquivos baixados de staging para uma pasta de rascunho (fora do repositório).
  Limite de RNF02 (download inicial abaixo de 3 145 728 bytes): **711 477 bytes brutos (22,6 %)**; 188 898 com gzip (6,0 %).
- Contra a primeira release (593 256 bytes, `c41c6c3`): +118 221 bytes, quase todo das três features que vieram depois
  (Kart Park como literal no JS, Kart 01, acertos); a parte desta rodada é o painel, os botões e quatro mensagens.
- O build do workflow usa `--base=/kartle/` em produção: o `index.html` difere em poucos bytes; a medida que vale é a
  impressa no passo *Measure dist* da execução.
- O Vite avisa que o chunk principal passa de 500 kB minificado (Three.js); aviso de ferramenta, não violação de limiar.

## O que o pipeline faz (`.github/workflows/pages.yml`)

Inalterado. Checkout do commit → Node da `.nvmrc` → `npm ci` → `npm test` → `npm run build -- --base=/<repo>/` →
`measure_dist.py dist` (saída 0) → `configure-pages` → `upload-pages-artifact` → trabalho `deploy` no ambiente
`github-pages`. Em produção o `deploy` **espera o revisor obrigatório** (D-DP-06); em staging publica de imediato, desde
que a política de ramos do ambiente admita `staging` (liberada em 2026-10-21; volta a ser restrita a cada despublicação —
`REL-0003`). Permissões mínimas, nenhum segredo (I6). `tools/check_served.py` é executado por quem valida e pelo runbook,
não pelo workflow.

## Limitações conhecidas — divergências aceitas e herdadas

- As duas divergências aceitas pelo dono do produto em 2026-10-21 continuam (`98-divergences.md`): o `href="/"` da marca
  sai de `/kartle/` no GitHub Pages (DIV-DP-12) e a página faz uma requisição a `fonts.googleapis.com` no carregamento, não
  durante a volta (DIV-DP-14); as correções seguem em `200 Requirements/220 Input/race-lap-validation/SCOPE-BACKLOG.md`.
- **E2E-13** (painel sem linha de setores numa pista sem setores) não é executável pela página servida: nenhuma pista do
  catálogo publicado é `INCOMPLETE` e a página não abre pista de fixture (a mesma razão de E2E-06 desde a primeira
  release). Fica decidido por `npm test` (CHK-TEST-0015-25, CHK-TEST-0012-14, CHK-TEST-0010-21) e registrado como "não
  executável pela tela" na execução 3 (DIV-DP-06).
- O bundle contém a Kart Park, dado derivado de OpenStreetMap: o crédito OSM/ODbL **passa a ser exigido** e é verificado
  pela release `pista-kart-park` (DIV-DP-05); a produção está bloqueada pela decisão Esri (DIV-DP-15).
