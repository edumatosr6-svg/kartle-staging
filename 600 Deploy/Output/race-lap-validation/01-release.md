---
title: Release — validação de volta de corrida
feature: race-lap-validation
stage: deploy
status: validated
version: 1.4.0
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

| Fato | Estado em 2026-11-04 |
|---|---|
| Veredito de testes | `SUCCESS` — `500 Tests/Output/race-lap-validation/reports/test-validation/test-validation-20261103-1743.md` (rodada 6, seed rev 3, **re-validação no build `e70aad9`**, registrada em `6ca677e`): suíte **444/444** (execução fresca de 2026-11-03T17:40:12Z, 0 reprovados, 0 pulados) e **179/179** desta feature (179 antes, 179 depois, 0 migradas, 0 removidas); 72 de 111 critérios verificados por `npm test` e os mesmos **39** com a metade de tela, aparelho ou navegador pendente (DIV-DP-06). O veredito julga a mudança de `renderTrainingResult` trazida por ADR-0007: o conteúdo do painel continua a vir de `describeTrainingResult` (CHK-TEST-0010-19 a -24, CHK-TEST-0015-*); só a árvore DOM muda, metade de tela de E2E-12. **Aplicação a `2aa013e` por contenção, não por veredito novo**: nenhum arquivo desta feature nem dos seus testes muda de `e70aad9` a `2aa013e` (linha *Mudança do build `e70aad9` → `2aa013e`*); na execução fresca da suíte sobre a árvore de `2aa013e` (JUnit `500 Tests/Output/pista-kart-park/reports/junit-latest.xml`, do veredito `test-validation-20261103-2043.md` daquela feature, reduzido por script) as **179** verificações `tests/race-lap-validation-*` passam, 0 reprovadas, 0 puladas, numa suíte de **467/467**; o mesmo 467/467 no *Test* da execução de staging 41832829595. O veredito anterior, `test-validation-20261030-1559.md` (rodada 5, árvore de `8811414`), fica como histórico |
| Validação de código | `SUCCESS` — `400 Code/Output/race-lap-validation/reports/code-validation/code-validation-20261030-1526.md` (4 `warning` e 1 `info` herdados; volta oficial e de reconhecimento inalteradas) |
| Commits da feature | `0c83ed9` (código validado) e `8811414` (testes revalidados, 179 checks); `git diff --stat 0c83ed9 8811414 -- src index.html` vazio: o veredito de testes da rodada 5 verificou a árvore de código validada. Nenhum artefato de requisitos, F-Spec, D-Spec ou código desta feature mudou desde `0c83ed9` |
| Mudança do build `6b314b2` → `e70aad9` | `git diff --stat 6b314b2 e70aad9 -- src index.html tests package.json package-lock.json tsconfig.json vite.config.* .github`: `index.html` (o contêiner `#lap-training-result-credit` passa a ser o último filho de `#lap-training-result`; `#lap-result-credit` sai de `#lap-result`), `src/main.ts` (`renderTrainingResult` deixa de usar `replaceChildren`: remove os filhos exceto o crédito, insere o resultado antes dele e desenha o crédito da pista do resultado; `renderResult` sem crédito; um comentário do estado da zebra), `src/style.css` (uma regra, `#lap-training-result-credit a{pointer-events:auto}`) e `tests/pista-kart-park-screens.test.ts` — o **ADR-0007 de `pista-kart-park`** (crédito OSM no painel de resultado de cada volta de treino; código `38354bb`, testes `e70aad9`). Os módulos desta feature (`src/lap.ts`, `src/lapMessages.ts`, `src/lapTiming.ts`, `src/frameClock.ts`, `src/trackData.ts`) e `tests/race-lap-validation-*` não mudam, mas o painel `#lap-training-result` desta feature muda de forma — por isso o veredito de testes novo acima, e não só a contenção. Workflow, lockfile e dependências inalterados |
| Mudança do build `e70aad9` → `2aa013e` e contenção | `git diff --name-only e70aad9 2aa013e -- src index.html tests scripts package.json package-lock.json tsconfig.json vite.config.* .github .nvmrc tracks`: `src/trackScene.ts` (acabamento visual da Kart Park, seed rev 2 de **`pista-kart-park`**: grama em faixas, faixa de borda, zebra com relevo, barreira de pneus; código `fbfb073`), `src/main.ts` (**uma linha**, 239: `ground.visible = !(ready && trackGeometry)` — o chão plano fica oculto só com a Kart Park pronta, onde a grama do acabamento o substitui; na pista sintética continua visível, como antes), `tests/pista-kart-park-*.test.ts` (7 suítes) e `tests/fixtures/kartParkRev1Trace.json` (testes `2aa013e`). **Nada desta feature**: `git diff --quiet e70aad9 2aa013e -- src/lap.ts src/lapMessages.ts src/lapTiming.ts src/frameClock.ts src/trackData.ts src/track.ts index.html src/style.css tests/race-lap-validation-*` sem diferença; em `src/main.ts` a linha nova não toca `renderTrainingResult`, `renderResult`, o painel `#lap-training-result`, os botões nem a melhor volta — é a visibilidade de um objeto da cena, sem efeito na simulação nem na volta (NFR-0013 de `pista-kart-park`, provado pelo traço passo a passo em `npm test`). Por isso o veredito de testes desta feature se aplica por contenção (linha acima), sem rodada nova de testes; `check_served.py` desta release dá 53/53 sobre o build novo (abaixo). Workflow, lockfile e dependências inalterados |
| **Commit verificado e servido em staging (`<sha>`)** | **`2aa013e67de49fb842f42cda573b3b82df5cf824`** (curto `2aa013e`, `master`, 2026-11-03T17:44:39−03:00, "pista-kart-park: testes da revisão 2 …"). Acima dele só há commits de registro (`1966c4a`, `c06afdd`: só `600 Deploy/Output/pista-kart-park/`): `git diff --stat 2aa013e HEAD -- src index.html tests scripts package.json package-lock.json tsconfig.json vite.config.*` vazio. Entre `e70aad9` e `2aa013e`, só o acabamento da Kart Park (linha acima); entre `8811414` e `e70aad9`, `dirigibilidade`, `modelo-kart-01`, `pista-kart-park` e o ADR-0007, já descritos nas versões anteriores deste registro. O candidato anterior, `e70aad9` (registro 1.3.0, `deploy-validation-20261103-1805.md` `SUCCESS`), fica como histórico. **Regra de invalidação do `<sha>`**: um commit posterior só de registro (que não toque `src/`, `index.html`, `tests/`, `scripts/`, `package.json`, `package-lock.json`, `tsconfig.json` nem `vite.config.*`) não invalida a release, desde que a execução do workflow desse commit fique verde e `check_served.py` dê o mesmo resultado sobre o mesmo `<hash>`; qualquer outro invalida e pede veredito de testes novo e nova rodada deste estágio — o envio de `2aa013e` invalidou `e70aad9` por essa regra, e esta versão (1.4.0) é a rodada nova; o veredito de testes novo **não foi produzido**: em seu lugar está a contenção da linha *Mudança do build `e70aad9` → `2aa013e`*, que a validação deste estágio aceita ou recusa |
| Staging — execução | `edumatosr6-svg/kartle-staging`, workflow `pages`. **Em vigor: 41832829595**, commit `1966c4a` (só de registro sobre `2aa013e`; evento `push`, tentativa 1, `success`; `build` 2026-11-04T12:51:04–12:52:18Z, `deploy` 12:52:21–12:53:05Z; ramo `staging` = `1966c4a` por `git ls-remote`): Node v24.22.1; *Test* `tests 467 / pass 467 / fail 0 / skipped 0`; *Build* `dist/assets/index-BMmvlQeM.js 696.55 kB`, `index-q-biCwua.css`; *Measure dist* `files=3 total_bytes=714001 gzip_bytes=189539 within_limit=True`. A execução anterior, **41156803005** (`1bb63aa`, árvore de `e70aad9`, `index-DmxsQuIL.js`, `success`), é o alvo do caminho B. Leitura por `gh run list` (só leitura) e pelo log da execução reduzido por script no relatório `600 Deploy/Output/pista-kart-park/reports/deploy-validation/deploy-validation-20261104-1302.md` |
| Staging — o que é servido | `https://edumatosr6-svg.github.io/kartle-staging/` lido em 2026-11-04 por GET público (sem token): HTTP 200, `Last-Modified: Wed, 04 Nov 2026 12:53:01 GMT`, `Cache-Control: max-age=600`; `index.html` 6 592 bytes (sha256 `3b0dfc37…`) referencia `assets/index-BMmvlQeM.js` (696 559 bytes, sha256 `babb1884…`) e `assets/index-q-biCwua.css` (10 850 bytes, `5e1c964b…`, o mesmo CSS de `e70aad9`); `python -I "600 Deploy/Output/race-lap-validation/tools/check_served.py" https://edumatosr6-svg.github.io/kartle-staging/ index-BMmvlQeM.js` → `checks=53 failed=0`. **Build limpo de `2aa013e` = servido**: os três arquivos byte a byte iguais ao `MSYS_NO_PATHCONV=1 npx vite build --base=/kartle-staging/` da árvore limpa de `2aa013e` (`cmp`, relatório `deploy-validation-20261104-1302.md` de `pista-kart-park`); os sha256 servidos acima são os desse build |
| Alvo de reversão em staging (caminho B) | execução **41156803005**, commit **`1bb63aa`** (só de registro sobre `e70aad9`; 2026-10-31T01:44:42Z, `success`, retida) — a execução verde imediatamente anterior à em vigor: serve `index-DmxsQuIL.js`, com **esta rodada da feature inteira** (treino de voltas seguidas, crédito no painel) e sem o acabamento da Kart Park; reexecutá-la desfaz só o passo `e70aad9` → `2aa013e`. Para tirar também esta rodada (voltar ao treino de uma volta, seed rev 2), o alvo continua a **41076989728** (`652bbaa`, 2026-10-30, `success`), a última execução verde sem `0c83ed9`; entre as duas ficam 41101055606 (`6b314b2`), 41109469203 (`e70aad9`) e 41111441877 (`28d40ef`), todas verdes |
| Produção | `https://edumatosr6-svg.github.io/kartle/` (`edumatosr6-svg/kartle`, ambiente `github-pages` com **revisor obrigatório** `edumatosr6-svg`; o clique é a promoção, D-DP-06). **Nada foi promovido**: na última observação registrada (registro de `pista-kart-park`, 2026-10-27) a URL respondia 404, e `origin/master` é `05c3570` (`git ls-remote origin`, 2026-11-04) (a leitura em vigor é a da aba Actions e de Settings → Pages, feita pelo validador ou pelo dono do produto; este estágio não toca produção). A promoção continua à espera da **execução 3** do log de aparelho e da decisão Esri (abaixo; opção 1 escolhida em 2026-11-03) |
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

1. **Validação de staging pelo validador** sobre a execução em vigor 41832829595 (`reports/deploy-validation/`): `<hash>`
   servido `BMmvlQeM`, `check_served.py` 53/53, a contenção `e70aad9` → `2aa013e` no lugar de um veredito de testes novo, e o
   ensaio de reversão pelo caminho B em staging (reexecutar 41156803005 e voltar), se o validador o exigir para esta rodada.
2. **Execução 3 do log de aparelho** (`docs/lap-validation-device-log.md`), humana, sobre a URL de staging, no notebook e no
   celular de referência nomeados — o roteiro de `runbook.md`, *Linhas humanas — o roteiro da execução 3* (H1–H6), agora com
   **E2E-12** (voltas seguidas, inválida segue, pausa pelo botão, encerrar treino) e o registro de **E2E-13**. Os 39
   critérios `unverified` do veredito de testes dependem desse registro (DIV-DP-06). A **execução no celular de
   2026-10-30** do mesmo log (dono do produto, sobre `e70aad9`/`index-DmxsQuIL.js`, aparelho sem modelo, navegador nem
   versão) é evidência **qualitativa** e **não fecha nenhuma linha**: confirma que o corte invalida a volta e o kart segue;
   voltas seguidas sem parar, crédito no resultado e retrato passaram só pelo resumo ("tudo deu certo"); "rodou legal"
   sem fps medido; nenhuma linha do notebook. Não é a execução 3, e não viu o build de `2aa013e` (`index-BMmvlQeM.js`), sobre o
   qual a execução 3 tem agora de correr.
3. **A decisão Esri** (o ponto Esri de `pista-kart-park`, ainda aberto). A escolha entre as opções de produção está feita: **opção 1**,
   registrada em `DOMAIN.md` em 2026-11-03 (Eduardo Matos; as opções 2 e 3 descartadas).
4. Só então a pergunta de promoção (`runbook.md`, passo 9).

Cumpridas: o veredito de código `SUCCESS` no seed rev 3 e o de testes `SUCCESS` **sobre `e70aad9`**, aplicado a `2aa013e`
por contenção (179/179 na suíte 467/467); o commit servido em staging nomeado (`2aa013e`, execução em vigor 41832829595 de um
commit só de registro) e a mudança `e70aad9` → `2aa013e` descrita; o artefato servido conferido (53/53), igual ao build limpo
e medido (abaixo); o alvo de reversão em staging nomeado (41156803005; 41076989728 para tirar esta rodada); a opção de
produção escolhida (1); o Node fixado (`.nvmrc` = `24`); os dois repositórios e a política de ramos de staging
(desde 2026-10-21); a decisão de monitoramento (vigilância manual), mantida.

## Reprodução do build

O workflow executa estes passos a cada push; à mão, da raiz do repositório, com caminhos entre aspas:

| Passo | Comando | Resultado esperado |
|---|---|---|
| 1 | `npm ci` | saída 0; `package-lock.json` inalterado |
| 2 | `npm test` | saída 0; 467 aprovados, 0 reprovados, 0 pulados em `2aa013e` (179 `CHK-TEST-*` desta feature) |
| 3 | `npm run build` (no workflow: `-- --base=/kartle/` ou `/kartle-staging/`, pelo nome do repositório) | saída 0 (`tsc --noEmit` e `vite build`); `dist/index.html`, `dist/assets/index-<hash>.js`, `dist/assets/index-<hash>.css` |
| 4 | `python -I "600 Deploy/Output/race-lap-validation/tools/measure_dist.py" dist` | tabela de tamanhos; `within_limit=True`; saída 0 (é a ferramenta que o workflow chama) |
| 5 | `python -I "600 Deploy/Output/race-lap-validation/tools/check_served.py" <URL> index-<hash>.js` | `checks=53 failed=0` sobre a URL publicada (só leitura; três GET em HTTPS) |
| 6 | `npm run preview` | `http://127.0.0.1:4173` serve o bundle; a página abre com a oferta "treino"; ao iniciá-lo, uma contagem e, a cada chegada, o painel `#lap-training-result` |

### Medida real do artefato servido em staging (execução 41832829595, árvore de `2aa013e`, base `/kartle-staging/`)

| Arquivo | bytes | gzip bytes (`measure_dist.py` sobre os arquivos servidos, Windows) |
|---|---:|---:|
| `assets/index-BMmvlQeM.js` | 696 559 | 184 146 |
| `assets/index-q-biCwua.css` | 10 850 | 3 049 |
| `index.html` | 6 592 | 2 591 |
| **total** | **714 001** | **189 786** (no *Measure dist* da execução: **189 539**) |

- Bytes brutos servidos (GET de 2026-11-04) = `total_bytes=714001` do *Measure dist* da execução 41832829595. O gzip difere:
  189 539 no Linux do workflow contra 189 786 no Windows sobre os mesmos bytes — só a biblioteca zlib; a compressão não é a
  medida do limiar.
  Limite de RNF02 (download inicial abaixo de 3 145 728 bytes): **714 001 bytes brutos (22,7 %)**; 189 539 com gzip (6,0 %).
- Contra o candidato anterior (`e70aad9`, 711 620 bytes): **+2 381 bytes**, todos no JS — o acabamento da Kart Park; o CSS e
  o `index.html` têm o mesmo tamanho. Antes disso, `6b314b2` → `e70aad9`: +143 bytes do ADR-0007. Contra a primeira release (593 256 bytes, `c41c6c3`): +120 745 bytes, quase todo das três features que
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
