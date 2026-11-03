---
title: Release — modelo Kart 01 e câmera de jogo
feature: modelo-kart-01
stage: deploy
status: validated
version: 1.2.0
sources: [DM-0001, DES-0001, DES-0002, DES-0003, DES-0004, DES-0005, DES-0006, DES-0007, ADR-0001, ADR-0002, ADR-0003, ADR-0004, NFR-0001, NFR-0002, NFR-0003, NFR-0004, NFR-0005, NFR-0006, NFR-0007, TEST-0001, TEST-0002, TEST-0003, TEST-0004]
---

# 01 — Release

Candidato a release da feature `modelo-kart-01` no **seed rev 4**, atualizado do build validado em 2026-10-27 (`6ea3862`, seed
rev 1) para o build validado em 2026-10-30 (`6b314b2`) e, nesta versão, para o build que staging serve, `e70aad9` (o mesmo
código desta feature; muda só o ADR-0007 de `pista-kart-park`). Continua a entregar o **Kart 01** (modelo montado por programa a partir de
`docs/kart-01/kart.js`, 15 grupos mais o piloto, 27 chamadas de desenho, 5 128 triângulos, placa `01` pintada em canvas) no lugar
do kart de caixas e a **câmera de jogo** (visão geral da pista inteira antes da contagem, descida contínua durante a contagem, pose
de corrida 1,38 m acima do chão e 3,05 m atrás do kart com mira 3,2 m à frente a 0,30 m, 62° verticais em paisagem e a regra de
retrato de 60° horizontais mínimos). O que muda nesta revisão, por decisão do dono do produto (`DOMAIN.md` de 2026-10-29 e
2026-10-30):

- **marcas de pneu quando o kart escorrega**: um trecho novo sob cada pneu traseiro exibido em cada quadro com passo novo, com a
  volta em `RUNNING`, velocidade **acima de 6 m/s** e deriva lateral em módulo **acima de 0,055 rad**, lidas da telemetria
  (`getHandlingTelemetry`; `sideslipRad` já é o módulo) — sem drift, sem `tricks`; nada na reta, na visão geral, na contagem, na
  pausa nem depois do fim da volta oficial (AC-US-0005-06, -07);
- **sem efeitos de turbo**: nenhuma fumaça nem chama no escapamento (o jato e a âncora `escapamentoSaida`/`exhaustOutlet` saíram
  do modelo e de `src/main.ts`, AC-US-0005-05) e **nenhum efeito de turbo no campo de visão** (o +4° saiu de `src/gameCamera.ts`;
  AC-US-0003-09 retirado); nenhuma indicação de drift junto ao kart (AC-US-0005-04);
- **câmera atrás do piloto no treino contínuo**: no treino de voltas seguidas, o fim de uma volta (válida, invalidada ou com
  reposicionamento) não leva a câmera à visão geral nem à descida — ela continua atrás do kart em movimento (AC-US-0003-14).

Nenhuma mudança de física por esta feature (`RENDER_NEUTRAL`, `SIM_CONTRACT`, `DETERMINISM` em `npm test`). O artefato continua
estático (`dist/`, HTML + JS + CSS) servido pelo **GitHub Pages** com HTTPS (D23); **não há servidor, banco, serviço, migração de
dado, armazenamento no navegador nem aplicativo nativo**.

## O que é entregue

| Item | Conteúdo | Fonte |
|---|---|---|
| Canais | `web-desktop` e `web-mobile` — a mesma página, com teclado no computador e inclinação ou toque no celular; nas duas formas da área de jogo (paisagem e retrato) | diretivas do estágio; `REL-0004` |
| Arquivos desta feature mudados desde `6ea3862` | `src/gameCamera.ts` (sem `TURBO_FOV_DELTA_DEG`, `turboActive`, `baseVerticalFovDeg`/`turboFovDeltaDeg` no `CameraView`; `baseVerticalFovDeg` renomeado `shapeVerticalFovDeg`; `RACE_CHASE` por fase e não por tipo de volta), `src/kart01Model.ts` (sem a âncora `exhaustOutlet`/`escapamentoSaida`; `anchors` só `bumperPlate`), `src/main.ts` (bloco das marcas lido da telemetria; sem jato no escapamento; câmera sem turbo), `tests/modelo-kart-01-*.test.ts` e `tests/helpers/kart01Report.ts` (**66** verificações `CHK-TEST-00nn-nn`: 64 → 66, 4 migradas, 0 removidas), `tests/fixtures/kart01-sim-baseline.json` (linha de base **regravada** sobre `a361c9c` com `arcade-assistido-v6` e `realista-aluguel-4t-v4`, commit `07b5cfa`) | `400 Code/Output/modelo-kart-01/01-implementation.md` 1.2.0; `500 Tests/Output/modelo-kart-01/` |
| Inalterados por esta feature desde `6ea3862` | `src/kartPose.ts`, `src/kart01Decals.ts`, `src/physics.ts`, `src/lap.ts`, `src/track.ts`, `src/trackData.ts`, `src/maneuvers.ts`, `src/lapTiming.ts`, `package.json` (pelo lado desta feature; `git diff` vazio na rodada 3 de código), `.github/workflows/pages.yml`, `.nvmrc`; dependências de execução: **nenhuma acrescentada** (`three` `^0.186.1` continua a única) | `code-validation-20261030-1655.md`; NFR-0003, NFR-0006 |
| Releases contidas no mesmo commit | `e70aad9` também carrega, já validados nos seus estágios: `dirigibilidade` seed rev 6 (acerto **`arcade-assistido-v6`**, sem drift e sem turbo; drift fora da tela inicial, da dica, do guia e do botão de toque; `#lap-result-setup` e o HUD de drift saíram do `index.html` — `cfad3dc`), `race-lap-validation` seed rev 3 (**treino de voltas seguidas**: resultado ao lado da volta sem parar o kart, inválida marca e segue, "encerrar treino", melhor volta — `0c83ed9`) e **`pista-kart-park`** (Kart Park como pista de abertura, seletor de pista, crédito OSM/ODbL — `ba221ad` em diante, e o crédito no painel de resultado de cada volta de treino pelo ADR-0007 — `38354bb`, `e70aad9`; **só staging**: a promoção dela está bloqueada pela decisão Esri) | registros de release de cada feature em `600 Deploy/Output/<feature>/` |
| Formato publicado que muda por esta feature | **nenhum**; os acertos (`arcade-assistido-v6`, `realista-aluguel-4t-v4`) e as pistas (`synthetic` v2, `kart-park` v1) são das releases contidas; a linha de base `tests/fixtures/kart01-sim-baseline.json` (`schemaVersion` 1, `recordedOnCommit` `a361c9c`) vive no repositório e **não entra no bundle** | DM-0001; `REL-0002` |
| Formato persistido que muda | **nenhum**: a feature não grava nada no navegador (DES-0007; `CHK-TEST-0004-*`; `check_bundle.py`: 0 ocorrências textuais de `localStorage`/`sessionStorage`/`indexedDB` no `dist/`) | DES-0007; `REL-0002` |
| Feature flag | **nenhuma**, por decisão do projeto validado (ADR-0003: sem chave mestra; "a reversão é a do repositório"). A reversão desta release é a republicação do artefato anterior (`runbook.md`) | ADR-0003 |
| Variáveis de ambiente | nenhuma lida pelo cliente; nenhuma no workflow | `REL-0001` |
| O que o jogador vê de novo (desde `6ea3862`) | marcas de pneu escuras sob os pneus traseiros **só quando o kart escorrega de lado** acima de 6 m/s (curvas fortes; nunca na reta); **nenhuma** fumaça ou chama no escapamento e **nenhuma** abertura do campo de visão com qualquer comando (Espaço e o antigo botão de drift não fazem nada à câmera); no treino, ao cruzar a chegada, a câmera continua atrás do piloto acompanhando o kart. O resto do Kart 01 e da câmera é o da revisão anterior; HUD, seletor de pista, treino contínuo e acerto são das releases contidas | DES-0003 2.0.0, DES-0005 2.0.0; `REL-0003` |

## Proveniência — o commit que a release nomeia

| Fato | Estado em 2026-11-03 |
|---|---|
| Veredito de código | `SUCCESS` — `400 Code/Output/modelo-kart-01/reports/code-validation/code-validation-20261030-1655.md` (seed rev 4, digest `4e9bfbba6294`; 0 blocker, 0 error, 3 warning de citação de linha, 4 info; `tsc --noEmit` 0; `git diff` vazio para `src/physics.ts`, `src/lap.ts`, `src/track.ts`, `src/trackData.ts`, `src/maneuvers.ts`, `src/lapTiming.ts`, `src/kartPose.ts`, `src/kart01Decals.ts`) |
| Veredito de testes | `SUCCESS` — `500 Tests/Output/modelo-kart-01/reports/test-validation/test-validation-20261030-1743.md` (rodada 5, Modo B: **443** verificações coletadas, 443 aprovadas, 0 reprovadas, 0 puladas; **66** `CHK-TEST-00nn-nn` desta feature — `-model` 20, `-pose` 10, `-camera` 17, `-contract` 19; `fresh: true`, `junit-latest.xml` 17:42:43Z posterior à última edição de `src/` 16:46:48Z e de `tests/` 17:38:11Z; 24 linhas `unverified` na metade de tela, aparelho ou repositório, nenhuma no veredito). É o veredito mais novo desta feature, sobre a árvore de `6b314b2`. **Aplicável a `e70aad9`**: entre `6b314b2` e `e70aad9` nenhum arquivo `tests/modelo-kart-01-*`, `tests/helpers/` ou `tests/fixtures/` mudou, nem `src/kart01Model.ts`, `src/gameCamera.ts`, `src/kartPose.ts`, `src/kart01Decals.ts` ou `docs/kart-01/kart.js` (`git diff --stat 6b314b2 e70aad9 -- tests` só lista `tests/pista-kart-park-screens.test.ts`); na execução fresca de 2026-11-03T17:40:12Z sobre a árvore de `e70aad9` (JUnit `500 Tests/Output/race-lap-validation/reports/junit-latest.xml`, do veredito `test-validation-20261103-1743.md`), suíte **444/444** e as **66** verificações desta feature aprovadas, 0 puladas |
| Commit verificado | **`e70aad9ddf5cf42da6c5957b4023afdbf6cacd03`** (curto `e70aad9`), "pista-kart-park: CHK-TEST-0009-04 migrado para o crédito do painel de treino (ADR-0007) e CHK-TEST-0009-11 novo — 444/444", 2026-10-30 15:44:24 −03:00 — o commit que staging serve. Acima dele só há commits **de registro** (`bb5cd3a`, `28d40ef`, `1bb63aa`, `c4bb672`, `6ca677e`: nenhum toca `src/`, `scripts/`, `tests/`, `tracks/`, `index.html`, `docs/kart-01/kart.js`, `package.json` nem o lockfile). Cadeia desta feature desde a release anterior: `abe82e2` (seed rev 4) → `221dd74`, `e3177e4`, `a361c9c` (req, F-Spec, D-Spec) → `07b5cfa` (linha de base regravada com v6) → `aeaf504` (código, rodada 3) → `6b314b2` (testes, o `<sha>` da versão 1.1.0 deste registro) |
| Mudança `6b314b2` → `e70aad9` e contenção | `git diff --stat 6b314b2 e70aad9 -- src index.html tests tracks package.json package-lock.json tsconfig.json vite.config.* .github docs/kart-01`: `index.html` (o contêiner `#lap-training-result-credit` dentro de `#lap-training-result`; `#lap-result-credit` sai de `#lap-result`), `src/main.ts` (`renderTrainingResult` preserva e desenha o crédito; `renderResult` sem crédito; um comentário do estado da zebra), `src/style.css` (uma regra `#lap-training-result-credit a`) e `tests/pista-kart-park-screens.test.ts` — o **ADR-0007 de `pista-kart-park`** (`38354bb`, `e70aad9`). Nada desta feature: nem o modelo, a pose, os decalques, a câmera, as marcas de pneu, nem o trecho de `src/main.ts` que os chama; `check_served.py` e `check_bundle.py` desta release dão o mesmo resultado sobre o build novo (abaixo) |
| Build limpo da mesma árvore (esta rodada) | `git archive e70aad9` extraído no rascunho da sessão, `npm ci` + `MSYS_NO_PATHCONV=1 npx vite build --base=/kartle-staging/` (no Git Bash, sem `MSYS_NO_PATHCONV=1` o `--base` é reescrito como caminho do Windows e o `index.html` sai maior — a causa dos 6 667 bytes da versão 1.1.0): `assets/index-DmxsQuIL.js` **694 178 bytes**, sha256 `79e3182c860855c0…`, `assets/index-q-biCwua.css` 10 850 (`5e1c964b…`), `index.html` 6 640 (CRLF do `git archive` no Windows; 6 592 e o sha256 servido `ba4e81a4…` normalizado para LF); `measure_dist.py`: `total_bytes=711668 within_limit=True ratio=0.226`; `check_bundle.py <dist> docs/kart-01/device-log.md`: **`checks=48 failed=0`**, sem `warn` (o registro em tela já nomeia `index-DmxsQuIL.js`) |
| Staging | **publicado**: execução **41109469203** do workflow `pages` em `edumatosr6-svg/kartle-staging` (commit `e70aad9`, 2026-10-30 18:44:27Z, `success`) e, **em vigor**, **41156803005** (commit `1bb63aa`, só de registro sobre `e70aad9`; `build` 2026-10-31 01:44:44–01:46:42Z com *Test* 444/444 e *Measure dist* `total_bytes=711620 gzip_bytes=188719 within_limit=True`; `deploy` 01:46:44–01:46:54Z; `success`) — lidas por `gh run view` (só leitura). `https://edumatosr6-svg.github.io/kartle-staging/` responde **200 em HTTPS** (`Last-Modified: Sat, 31 Oct 2026 01:46:48 GMT`, `Cache-Control: max-age=600`) e serve `index.html` (6 592 bytes, sha256 `ba4e81a4…`) que referencia **`assets/index-DmxsQuIL.js`** (694 178 bytes servidos, sha256 `79e3182c…` — **byte a byte o JS do build limpo**) e `assets/index-q-biCwua.css` (10 850, `5e1c964b…`); `check_served.py … index-DmxsQuIL.js` (2026-11-03): **`checks=40 failed=0`** (marcadores do Kart 01, número `01`, condição das marcas `speedMps>6&&….sideslipRad>.055`, constantes de câmera, três modos de câmera; `helmet`/`boxGeo` e `exhaustOutlet`/`escapamentoSaida`/`turboFovDeltaDeg`/`baseVerticalFovDeg` **ausentes**; `arcade-assistido-v6` e os identificadores das releases contidas presentes) |
| Produção | `https://edumatosr6-svg.github.io/kartle/` responde **404** (nada publicado); `.git/refs/remotes/origin/master` = **`05c3570`** (2026-10-22, primeira release). O ambiente `github-pages` tem revisor obrigatório `edumatosr6-svg`; o clique é a promoção (D-DP-06). **`e70aad9` contém a `pista-kart-park`** (`ba221ad` é ancestral): promovê-lo é promover a Kart Park, bloqueada pela decisão Esri — as opções estão em *Produção — opções enquanto a decisão Esri não existe*, abaixo |
| Tag de release | não existe; a release é identificada pelo hash acima e pela execução do workflow que a publicar |
| Sistema de CI | **GitHub Actions**, `.github/workflows/pages.yml` (inalterado): `npm ci` → `npm test` (**444** aprovados) → `npm run build -- --base=/<repo>/` → `measure_dist.py` (RNF02) → `upload-pages-artifact` → `deploy-pages`; etapas em `REL-0003` |
| Alvo de reversão em staging | o alvo do caminho B continua a **41076989728** (entre ela e a em vigor ficam 41101055606 de `6b314b2` — o mesmo Kart 01 rev 4, sem o crédito no painel do treino — e 41109469203/41111441877, todas verdes), commit **`652bbaa`** ("registra a prévia `?acerto=` (só staging) no histórico sem trazer o código dela": árvore de `07b5cfa` — Kart 01 da revisão anterior, com o código das marcas presas ao drift, do jato e do +4° de turbo, acerto `arcade-assistido-v6`, Kart Park, treino de uma volta); informada pelo orquestrador; o `<hash>` que ela serve é lido no passo *Build* dessa execução. É o caminho B de `runbook.md` |

## Produção — opções enquanto a decisão Esri não existe

Todo commit de `master` a partir de `ba221ad` contém a Kart Park, e a sua promoção está bloqueada até o dono do produto registrar
a decisão sobre a licença do dado derivado da imagem Esri World Imagery (`600 Deploy/Output/pista-kart-park/runbook.md`, *Promoção
bloqueada*; ADR-0005 daquela feature). Esta release (`e70aad9`) está nesse caso. **A escolha é do dono do produto** (D-DP-06);
nenhuma é tomada por um loop:

| Opção | O que se faz | O que entrega em produção | O que custa / exige |
|---|---|---|---|
| **1 — esperar a decisão Esri** e promover tudo junto | nenhum push a `origin` até a decisão; depois, a entrega que a cumprir (crédito Esri, `npm run track -- promote … --esri-decision`, nova rodada do estágio de deploy da `pista-kart-park`) é promovida com `git push origin master` e *Approve and deploy* | `race-lap-validation` rev 3, `dirigibilidade` rev 6, **este Kart 01 rev 4** e a Kart Park, de uma vez | produção continua 404 até lá; as portas humanas das quatro releases fecham em staging sobre o bundle servido; nenhuma ação nova deste estágio além de conferir o `<sha>` que for promovido |
| **2 — publicar `6ea3862`** (o registro validado em 2026-10-27, anterior à Kart Park) | `git push origin 6ea3862:master` (avanço rápido a partir de `05c3570`, **sem** `--force`) e aprovar só essa execução, depois das portas humanas **daquela** árvore | o Kart 01 **seed rev 1** (com +4° de turbo, jato no escapamento e marcas presas ao drift), acerto `arcade-assistido-v5`, treino de uma volta — comportamento que o dono do produto **retirou** em 2026-10-29/30 | as linhas humanas H1–H6 de `6ea3862` mediriam um bundle que staging já não serve (reexecutar 40579585592 em staging para o medir, ≈ 2 min, e depois a 41156803005 de volta); o `master` local continua à frente de `origin/master` e uma execução posterior de `master` em produção **não** pode ser aprovada por engano; **não promove o seed rev 4** |
| **3 — ramo de produção sem a Kart Park, com o Kart 01 rev 4** | um ramo a partir de `e70aad9` com `git revert` dos commits da `pista-kart-park` que tocam a árvore (ou a partir de `6ea3862` com os commits rev 3/4 das outras features escolhidos) | o Kart 01 rev 4 com as releases contidas sem a Kart Park | é uma **árvore nova, nunca testada**: os commits da `pista-kart-park` e do treino contínuo da `race-lap-validation` estão entrelaçados (`src/main.ts`, `src/lap.ts`, `src/trainingSession.ts`, `index.html`); exige rodadas de código, testes e deploy sobre esse ramo antes de qualquer pergunta de promoção — não é esta release |

Este registro prepara a release para a **opção 1** (a que promove o seed rev 4) e descreve a 2 para que a escolha seja informada;
a 3 é uma decisão de escopo para o dono do produto. Em todas: **nunca** `push --force` sobre `master` e **nunca** aprovar a
execução de produção em *Waiting* 39827702391 (`05c3570`) por engano.

### Precondições humanas que restam, em ordem

1. **Registrar em `docs/kart-01/device-log.md` as execuções nos aparelhos de referência** sobre a URL de staging (serve
   `index-DmxsQuIL.js`): as **seis linhas humanas H1–H6 do `runbook.md`**, revistas para o seed rev 4 (marcas visíveis em curva
   forte e ausentes na reta e na pausa; nenhum efeito de turbo; câmera atrás do piloto depois de uma volta de treino), com
   `fpsPerSecond`, `minFps` e os bytes comprimidos transferidos. O arquivo existe com a execução 1 (navegador embutido, build de
   2026-10-27, parcial), a seção *Execuções nos aparelhos de referência* diz **"Não executadas"**, e há a evidência **qualitativa** do dono do produto no próprio celular, *Execução no celular — 2026-10-30* do mesmo arquivo, sobre `e70aad9`/`index-DmxsQuIL.js`: aparelho sem modelo, navegador nem versão, só paisagem, sem medida; confirma que as marcas de pneu aparecem ("aparece as marcas"); o resto pelo resumo ("tudo deu certo") ou não pedido; "rodou legal" sem `fpsPerSecond` nem `minFps` — **não fecha nenhuma linha H1–H6** e não é uma das três entradas pedidas.
   As 24 linhas `unverified` do veredito de testes (`500 Tests/Output/modelo-kart-01/98-divergences.md`) dependem desse registro.
2. **Validação de staging pelo validador** (`reports/deploy-validation/`), sobre a execução em vigor 41156803005 e o `<hash>`
   `DmxsQuIL`.
3. **A decisão Esri, ou a escolha entre as opções 1 a 3 acima**, e só depois a pergunta de promoção (D-DP-06) — com a atenção de
   que promover `e70aad9` (ou um posterior) promove também `dirigibilidade`, `race-lap-validation` e `pista-kart-park`, cujas
   portas humanas (`docs/handling-device-log.md`, a execução 3 de `docs/lap-validation-device-log.md` e
   `docs/kart-park-device-log.md` — os três com a mesma execução qualitativa no celular de 2026-10-30, que não fecha nenhuma
   linha) continuam abertas e cabem na mesma sessão de aparelho sobre este bundle (DIV-DP-12).

Cumpridas: o commit da árvore verificada e servida (`e70aad9`) com a contenção da mudança `6b314b2` → `e70aad9`; os vereditos
de código e de testes `SUCCESS` para o seed rev 4, este aplicável a `e70aad9` (66/66 na suíte 444/444); o build
reproduzido pelo pipeline em staging e servido em HTTPS **byte a byte igual** ao build limpo do commit; o alvo de reversão em
staging (41076989728) retido; o procedimento do caminho B ensaiado no mesmo site em 2026-10-27; o Node fixado (`.nvmrc` = `24`);
os dois repositórios configurados (D23); a decisão de monitoramento (vigilância manual, nenhum monitor externo), mantida.

## Reprodução do build

O workflow executa estes passos a cada push; à mão, da raiz do repositório, com caminhos entre aspas:

| Passo | Comando | Resultado esperado |
|---|---|---|
| 1 | `npm ci` | saída 0; `package-lock.json` inalterado |
| 2 | `npm test` | saída 0; **444** aprovados, 0 reprovados, 0 pulados (66 desta feature) |
| 3 | `npm run build` (no workflow, `-- --base=/kartle/` ou `/kartle-staging/`; no Git Bash do Windows, `MSYS_NO_PATHCONV=1` antes do comando) | saída 0 (`tsc --noEmit` e depois `vite build`); `dist/index.html`, `dist/assets/index-<hash>.js`, `dist/assets/index-<hash>.css`; nenhum outro arquivo em `dist/assets/` |
| 4 | `python -I "600 Deploy/Output/race-lap-validation/tools/measure_dist.py" dist` | tabela de tamanhos; `within_limit=True`; saída 0 (ferramenta da primeira release, reutilizada por referência — é a que o workflow chama) |
| 5 | `python -I "600 Deploy/Output/modelo-kart-01/tools/check_bundle.py" dist docs/kart-01/device-log.md` | `checks=48 failed=0`: um JS e um CSS e nada mais em `dist/assets/`; marcadores do Kart 01, constantes de câmera e a condição das marcas de pneu no JS; nenhum símbolo do kart provisório nem dos efeitos de turbo; identificadores das releases contidas; elementos do HTML; tamanhos; o `warn` "registro em tela nomeia o JS" não aparece desde que o log nomeia `index-DmxsQuIL.js` (a execução qualitativa de 2026-10-30), o que não equivale a H1–H6 registradas |
| 6 | `npm run baseline:kart01` (opcional; recusa-se sem `--force` quando o fixture existe) | a linha de base continua a de `a361c9c`; não é passo de release |
| 7 | `npm run preview` | `http://127.0.0.1:4173` serve o bundle; a visão geral mostra a pista de abertura inteira com o Kart 01 na largada; no `VERDE` a câmera está atrás do piloto; a placa `01` é legível |

### Medida real do artefato (servido em staging, árvore de `e70aad9`, base `/kartle-staging/`; *Measure dist* da execução 41156803005)

| Arquivo | bytes | gzip bytes |
|---|---:|---:|
| `assets/index-DmxsQuIL.js` | 694 178 | 183 088 |
| `assets/index-q-biCwua.css` | 10 850 | 3 045 |
| `index.html` | 6 592 | 2 586 |
| **total** | **711 620** | **188 719** |

- Limite de NFR-0002 / RNF02 (download inicial abaixo de 3 145 728 bytes): **711 620 bytes brutos (22,6 % do limite)**; 188 719
  comprimidos (6,0 %). São os bytes servidos (GET de 2026-11-03) e o *Measure dist* do workflow; o build limpo no Windows dá
  711 668 só pelo CRLF do `index.html`. A versão 1.1.0 trazia 6 667 / 711 561 / 188 918, medidos num build cujo `--base` o Git
  Bash reescreveu (sem `MSYS_NO_PATHCONV=1`); corrigido aqui. Contra `6b314b2` servido (711 477): +143 bytes, do ADR-0007 de
  `pista-kart-park`. Contra a revisão anterior desta release (649 918 bytes, `6ea3862`): **+61 702 bytes**, que vêm das releases contidas (pista Kart Park embutida,
  seletor e crédito, treino contínuo, acerto v6); o lado desta feature **retira** código (jato, âncora, turbo no campo de visão).
- O JS e o CSS servidos em staging são byte a byte os do build limpo (sha256 `79e3182c…`, `5e1c964b…`): o pipeline reproduziu a
  árvore.
- O Vite avisa que o chunk principal passa de 500 kB minificado (Three.js); aviso de ferramenta, não violação de limiar.
- Os nomes dos *assets* carregam hash de conteúdo: o `index.html` publicado é o que aponta para a versão em vigor (`REL-0003`,
  regra de cache). O CSS mudou (`q-biCwua`) pelas releases contidas, não por esta feature.

## O que o pipeline faz (`.github/workflows/pages.yml`)

Inalterado por esta feature. Em ordem, com saída observável na execução do Actions: checkout do commit → Node da `.nvmrc` (24)
com cache do npm → `npm ci` → `npm test` (444 aprovados) → `npm run build -- --base=/kartle/` (ou `/kartle-staging/`) →
`measure_dist.py dist` (saída 0) → `configure-pages` → `upload-pages-artifact` de `dist/` → trabalho `deploy` no ambiente
`github-pages`. Em produção o `deploy` **espera a aprovação do revisor obrigatório** (D-DP-06); em staging publica de imediato,
desde que a política de ramos do ambiente admita o ramo `staging` (`REL-0003`). Permissões mínimas, nenhum segredo (I6). As
ferramentas desta release (`tools/check_bundle.py`, `tools/check_served.py`) são executadas por quem valida e pelo runbook, não
pelo workflow (`98-divergences.md`, DIV-DP-05).

## Limitações conhecidas — divergências aceitas e herdadas

- As divergências aceitas pelo dono do produto em 2026-10-21 continuam válidas: o `href="/"` da marca sai de `/kartle/` no GitHub
  Pages e a página faz uma requisição a `fonts.googleapis.com` no carregamento (não durante a volta). Ambas `waived`
  (`98-divergences.md`, DIV-DP-09 e DIV-DP-10).
- O crédito OpenStreetMap e o aviso ODbL passam a ser exigidos pela Kart Park (D-DP-04) e são da `pista-kart-park`; esta feature
  não acrescenta dado de pista.
- A placa `01` é pintada num canvas 2D no carregamento; num navegador sem contexto 2D o modelo aparece sem número e o console
  mostra `kart01-decals`/`NO_2D_CONTEXT` (DES-0007) — sintoma de ambiente, não de empacotamento (`REL-0005`).
- A taxa de quadros não foi medida em nenhum aparelho nomeado: o navegador embutido roda em segundo plano e o seu ritmo é
  inválido (`docs/kart-01/device-log.md`, execução 1). É a linha H6 do `runbook.md`.
- O fim da **volta oficial** (simulação parada, câmera atrás do kart parado, painel `#lap-result` sobre a cena; AC-US-0003-13)
  não é alcançável nesta página: o treino é a única volta oferecida e "encerrar treino" volta à oferta **sem** painel de
  resultado (DES-0007/DES-0009 da `race-lap-validation`). A regra é provada em `npm test` (`CHK-TEST-0003-13`, `-14`); na tela
  observa-se a forma "encerrar treino" (kart parado, câmera atrás dele, oferta sobre a cena) — `98-divergences.md`, DIV-DP-14.
