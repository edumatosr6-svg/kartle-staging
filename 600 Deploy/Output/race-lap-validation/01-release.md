---
title: Release — validação de volta de corrida
feature: race-lap-validation
stage: deploy
status: draft
version: 1.3.0
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

| Fato | Estado em 2026-11-03 |
|---|---|
| Veredito de testes | `SUCCESS` — `500 Tests/Output/race-lap-validation/reports/test-validation/test-validation-20261103-1743.md` (rodada 6, seed rev 3, **re-validação no build `e70aad9`**, registrada em `6ca677e`): suíte **444/444** (execução fresca de 2026-11-03T17:40:12Z, 0 reprovados, 0 pulados) e **179/179** desta feature (179 antes, 179 depois, 0 migradas, 0 removidas); 72 de 111 critérios verificados por `npm test` e os mesmos **39** com a metade de tela, aparelho ou navegador pendente (DIV-DP-06). O veredito julga a mudança de `renderTrainingResult` trazida por ADR-0007: o conteúdo do painel continua a vir de `describeTrainingResult` (CHK-TEST-0010-19 a -24, CHK-TEST-0015-*); só a árvore DOM muda, metade de tela de E2E-12. O veredito anterior, `test-validation-20261030-1559.md` (rodada 5, árvore de `8811414`), fica como histórico |
| Validação de código | `SUCCESS` — `400 Code/Output/race-lap-validation/reports/code-validation/code-validation-20261030-1526.md` (4 `warning` e 1 `info` herdados; volta oficial e de reconhecimento inalteradas) |
| Commits da feature | `0c83ed9` (código validado) e `8811414` (testes revalidados, 179 checks); `git diff --stat 0c83ed9 8811414 -- src index.html` vazio: o veredito de testes da rodada 5 verificou a árvore de código validada. Nenhum artefato de requisitos, F-Spec, D-Spec ou código desta feature mudou desde `0c83ed9` |
| Mudança do build `6b314b2` → `e70aad9` | `git diff --stat 6b314b2 e70aad9 -- src index.html tests package.json package-lock.json tsconfig.json vite.config.* .github`: `index.html` (o contêiner `#lap-training-result-credit` passa a ser o último filho de `#lap-training-result`; `#lap-result-credit` sai de `#lap-result`), `src/main.ts` (`renderTrainingResult` deixa de usar `replaceChildren`: remove os filhos exceto o crédito, insere o resultado antes dele e desenha o crédito da pista do resultado; `renderResult` sem crédito; um comentário do estado da zebra), `src/style.css` (uma regra, `#lap-training-result-credit a{pointer-events:auto}`) e `tests/pista-kart-park-screens.test.ts` — o **ADR-0007 de `pista-kart-park`** (crédito OSM no painel de resultado de cada volta de treino; código `38354bb`, testes `e70aad9`). Os módulos desta feature (`src/lap.ts`, `src/lapMessages.ts`, `src/lapTiming.ts`, `src/frameClock.ts`, `src/trackData.ts`) e `tests/race-lap-validation-*` não mudam, mas o painel `#lap-training-result` desta feature muda de forma — por isso o veredito de testes novo acima, e não só a contenção. Workflow, lockfile e dependências inalterados |
| **Commit verificado e servido em staging (`<sha>`)** | **`e70aad9ddf5cf42da6c5957b4023afdbf6cacd03`** (curto `e70aad9`, `master`, 2026-10-30T15:44:24−03:00, "pista-kart-park: CHK-TEST-0009-04 migrado para o crédito do painel de treino (ADR-0007) e CHK-TEST-0009-11 novo — 444/444"). Acima dele só há commits de registro (`bb5cd3a`, `28d40ef`, `1bb63aa`, `c4bb672`, `6ca677e`): `git diff --stat e70aad9 6ca677e -- src index.html tests scripts package.json package-lock.json` vazio. Entre `8811414` e `6b314b2` (rodada 10) entraram `dirigibilidade`, `modelo-kart-01` e `pista-kart-park` sem tocar os módulos nem os testes desta feature; entre `6b314b2` e `e70aad9`, o ADR-0007 da linha acima. **Regra de invalidação do `<sha>`**: um commit posterior só de registro (que não toque `src/`, `index.html`, `tests/`, `scripts/`, `package.json`, `package-lock.json`, `tsconfig.json` nem `vite.config.*`) não invalida a release, desde que a execução do workflow desse commit fique verde e `check_served.py` dê o mesmo resultado sobre o mesmo `<hash>`; qualquer outro invalida e pede veredito de testes novo e nova rodada deste estágio |
| Staging — execução | `edumatosr6-svg/kartle-staging`, workflow `pages`. **Em vigor: 41156803005**, commit `1bb63aa` (só de registro sobre `e70aad9`; evento `push`, tentativa 1, `success`; `build` 2026-10-31T01:44:44–01:46:42Z, `deploy` 01:46:44–01:46:54Z): Node v24.22.1; *Test* `tests 444 / pass 444 / fail 0 / skipped 0`; *Build* `dist/assets/index-DmxsQuIL.js 694.17 kB`, `index-q-biCwua.css 10.85 kB`; *Measure dist* `files=3 total_bytes=711620 gzip_bytes=188719 within_limit=True`. A primeira execução de `e70aad9` é a **41109469203** (2026-10-30T18:44:27Z, `success`, os mesmos bytes). Leitura por `gh run view` e pelo log da execução (só leitura) |
| Staging — o que é servido | `https://edumatosr6-svg.github.io/kartle-staging/` lido em 2026-11-03 por GET público (sem token): HTTP 200, `Last-Modified: Sat, 31 Oct 2026 01:46:48 GMT`, `Cache-Control: max-age=600`; `index.html` 6 592 bytes (sha256 `ba4e81a4…`) referencia `assets/index-DmxsQuIL.js` (694 178 bytes, sha256 `79e3182c…`) e `assets/index-q-biCwua.css` (10 850 bytes, `5e1c964b…`); `python -I "600 Deploy/Output/race-lap-validation/tools/check_served.py" https://edumatosr6-svg.github.io/kartle-staging/ index-DmxsQuIL.js` → `checks=53 failed=0`. **Build limpo de `e70aad9`** (`git archive e70aad9` numa pasta de rascunho, `npm ci`, `MSYS_NO_PATHCONV=1 npx vite build --base=/kartle-staging/`): `index-DmxsQuIL.js` e `index-q-biCwua.css` com os mesmos sha256 do servido; o `index.html` tem 6 640 bytes por causa do CRLF do `git archive` no Windows e, normalizado para LF, 6 592 bytes com o sha256 servido (`ba4e81a4…`) |
| Alvo de reversão em staging (caminho B) | execução **41076989728**, commit **`652bbaa`** (2026-10-30T12:02:08−03:00) — a última execução verde **sem** esta rodada; contém a primeira release desta feature (treino de uma volta, seed rev 2) e não contém `0c83ed9`. Entre ela e a em vigor ficam 41101055606 (`6b314b2`, o candidato da rodada 10: o mesmo treino contínuo sem o crédito no painel), 41109469203 e 41111441877 (`e70aad9`, `28d40ef`), todas verdes; nenhuma é alvo desta feature |
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

1. **Validação de staging pelo validador** sobre a execução em vigor 41156803005 (`reports/deploy-validation/`): `<hash>`
   servido `DmxsQuIL`, `check_served.py` 53/53, e o ensaio de reversão pelo caminho B em staging (reexecutar 41076989728 e
   voltar), se o validador o exigir para esta rodada.
2. **Execução 3 do log de aparelho** (`docs/lap-validation-device-log.md`), humana, sobre a URL de staging, no notebook e no
   celular de referência nomeados — o roteiro de `runbook.md`, *Linhas humanas — o roteiro da execução 3* (H1–H6), agora com
   **E2E-12** (voltas seguidas, inválida segue, pausa pelo botão, encerrar treino) e o registro de **E2E-13**. Os 39
   critérios `unverified` do veredito de testes dependem desse registro (DIV-DP-06). A **execução no celular de
   2026-10-30** do mesmo log (dono do produto, sobre `e70aad9`/`index-DmxsQuIL.js`, aparelho sem modelo, navegador nem
   versão) é evidência **qualitativa** e **não fecha nenhuma linha**: confirma que o corte invalida a volta e o kart segue;
   voltas seguidas sem parar, crédito no resultado e retrato passaram só pelo resumo ("tudo deu certo"); "rodou legal"
   sem fps medido; nenhuma linha do notebook. Não é a execução 3.
3. **A escolha do dono do produto entre as opções de produção** acima, registrada em `DOMAIN.md`; e, na opção 1, a decisão
   Esri.
4. Só então a pergunta de promoção (`runbook.md`, passo 9).

Cumpridas: o veredito de código `SUCCESS` no seed rev 3 e o de testes `SUCCESS` **sobre `e70aad9`**; o commit servido em
staging nomeado (`e70aad9`, execução em vigor 41156803005 de um commit só de registro) e a mudança `6b314b2` → `e70aad9`
descrita; o artefato servido conferido (53/53), igual ao build limpo e medido (abaixo); o alvo de reversão em
staging nomeado (41076989728); o Node fixado (`.nvmrc` = `24`); os dois repositórios e a política de ramos de staging
(desde 2026-10-21); a decisão de monitoramento (vigilância manual), mantida.

## Reprodução do build

O workflow executa estes passos a cada push; à mão, da raiz do repositório, com caminhos entre aspas:

| Passo | Comando | Resultado esperado |
|---|---|---|
| 1 | `npm ci` | saída 0; `package-lock.json` inalterado |
| 2 | `npm test` | saída 0; 444 aprovados, 0 reprovados, 0 pulados em `e70aad9` (179 `CHK-TEST-*` desta feature) |
| 3 | `npm run build` (no workflow: `-- --base=/kartle/` ou `/kartle-staging/`, pelo nome do repositório) | saída 0 (`tsc --noEmit` e `vite build`); `dist/index.html`, `dist/assets/index-<hash>.js`, `dist/assets/index-<hash>.css` |
| 4 | `python -I "600 Deploy/Output/race-lap-validation/tools/measure_dist.py" dist` | tabela de tamanhos; `within_limit=True`; saída 0 (é a ferramenta que o workflow chama) |
| 5 | `python -I "600 Deploy/Output/race-lap-validation/tools/check_served.py" <URL> index-<hash>.js` | `checks=53 failed=0` sobre a URL publicada (só leitura; três GET em HTTPS) |
| 6 | `npm run preview` | `http://127.0.0.1:4173` serve o bundle; a página abre com a oferta "treino"; ao iniciá-lo, uma contagem e, a cada chegada, o painel `#lap-training-result` |

### Medida real do artefato servido em staging (execução 41156803005, árvore de `e70aad9`, base `/kartle-staging/`)

| Arquivo | bytes | gzip bytes |
|---|---:|---:|
| `assets/index-DmxsQuIL.js` | 694 178 | 183 088 |
| `assets/index-q-biCwua.css` | 10 850 | 3 045 |
| `index.html` | 6 592 | 2 586 |
| **total** | **711 620** | **188 719** |

- Números do passo *Measure dist* da execução 41156803005 (`measure_dist.py` no Linux do workflow); os bytes são os
  servidos (GET de 2026-11-03). O mesmo `measure_dist.py` sobre os três arquivos baixados, no Windows, dá os mesmos
  711 620 bytes e 188 938 com gzip (outra biblioteca zlib; a compressão não é a medida do limiar).
  Limite de RNF02 (download inicial abaixo de 3 145 728 bytes): **711 620 bytes brutos (22,6 %)**; 188 719 com gzip (6,0 %).
- Contra o candidato anterior (`6b314b2`, 711 477 bytes): **+143 bytes**, o contêiner do crédito no painel e a regra de CSS
  do ADR-0007. Contra a primeira release (593 256 bytes, `c41c6c3`): +118 364 bytes, quase todo das três features que
  vieram depois (Kart Park como literal no JS, Kart 01, acertos); a parte desta rodada é o painel, os botões e quatro mensagens.
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
