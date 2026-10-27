---
title: Release — modelo Kart 01 e câmera de jogo
feature: modelo-kart-01
stage: deploy
status: validated
version: 1.0.0
sources: [DM-0001, DES-0001, DES-0002, DES-0003, DES-0004, DES-0005, DES-0006, DES-0007, ADR-0001, ADR-0002, ADR-0003, ADR-0004, NFR-0001, NFR-0002, NFR-0003, NFR-0004, NFR-0005, NFR-0006, NFR-0007, TEST-0001, TEST-0002, TEST-0003, TEST-0004]
---

# 01 — Release

Candidato a release da feature `modelo-kart-01`: o **Kart 01** (modelo montado por programa a partir de `docs/kart-01/kart.js`,
15 grupos mais o piloto, 27 malhas, 27 chamadas de desenho, 5 128 triângulos, placa `01` pintada em canvas) no lugar do kart de
caixas; a **câmera de jogo** (visão geral da pista inteira antes da contagem, descida contínua durante a contagem, pose de corrida
1,38 m acima do chão e 3,05 m atrás do kart com mira 3,2 m à frente a 0,30 m, campo de visão vertical de 62° em paisagem e a regra de
retrato de 60° horizontais mínimos, +4° com turbo); o estado do kart para exibição (esterço, giro das rodas, volante e braços do
piloto); os efeitos presos ao kart (marcas sob os pneus traseiros exibidos, fumaça na ponteira do escapamento); **nenhuma mudança
de física** (`src/physics.ts`, `src/lap.ts`, `src/track.ts`, presets e contrato de passo com 0 linhas de diferença, provado por
`RENDER_NEUTRAL`, `SIM_CONTRACT` e `DETERMINISM` em `npm test`). O que se entrega é o mesmo tipo de artefato das duas releases
anteriores (`race-lap-validation`, `dirigibilidade`): um **artefato estático** (`dist/`, HTML + JS + CSS) servido pelo **GitHub
Pages** com HTTPS (D23); **não há servidor, banco, serviço, migração de dado, armazenamento no navegador nem aplicativo nativo**
nesta release.

## O que é entregue

| Item | Conteúdo | Fonte |
|---|---|---|
| Canais | `web-desktop` e `web-mobile` — a mesma página, com teclado no computador e inclinação ou toque no celular; nas duas formas da área de jogo (paisagem e retrato) | diretivas do estágio; `REL-0004` |
| Arquivos de origem desta feature | `src/kart01Model.ts` (novo, 555 linhas: montagem, 15 grupos, paleta, `KART01_NUMBER`, `updateKart01Pose`), `src/kart01Decals.ts` (novo, 91 linhas: placa e número em canvas 2D), `src/kartPose.ts` (novo, 77 linhas, puro), `src/gameCamera.ts` (novo, 186 linhas, puro: `computeCameraView`, `raceChasePose`, `baseVerticalFovDeg`), `src/main.ts` (540 → 553 linhas: Kart 01 em `kartRoot`, caixa de sombra ±60 m e `sun.target`, jato no escapamento, câmera por quadro sem `lerp`), `scripts/kart01-baseline.ts` (novo; `npm run baseline:kart01`), `tests/fixtures/kart01-sim-baseline.json` (novo; linha de base da simulação gravada sobre `b86b200`), `tests/modelo-kart-01-*.test.ts` e `tests/helpers/kart01Report.ts` (59 verificações `CHK-TEST-00nn-nn`), `package.json` (script `baseline:kart01`; dependências inalteradas), `docs/kart-01/device-log.md` (novo; registro em tela) | `400 Code/Output/modelo-kart-01/01-implementation.md` 1.1.0; `500 Tests/Output/modelo-kart-01/` |
| Inalterados por esta feature | `src/physics.ts`, `src/lap.ts`, `src/track.ts`, `src/trackData.ts`, `src/maneuvers.ts`, `src/lapTiming.ts`, `src/frameClock.ts`, `src/lapMessages.ts`, `src/handlingMessages.ts`, `src/setupRecords.ts`, `src/audio.ts`, `src/style.css`, `index.html`, `tsconfig.json`, `.github/workflows/pages.yml`, `.nvmrc`, `package-lock.json`; dependências de execução: **nenhuma acrescentada** (`three` `^0.186.1` continua a única; `mergeGeometries` vem de `three/addons`) | idem; NFR-0003, NFR-0006 |
| Formato publicado que muda | **nenhum**: a pista continua `synthetic` v2 e os acertos `arcade-assistido-v5` / `realista-aluguel-4t-v4` continuam os da release anterior, intactos no bundle (`check_bundle.py` confirma os identificadores); a linha de base `tests/fixtures/kart01-sim-baseline.json` (`schemaVersion` 1) vive no repositório e **não entra no bundle** | DM-0001; `REL-0002` |
| Formato persistido que muda | **nenhum**: a feature não grava nada no navegador (DES-0007; `CHK-TEST-0004-*`; `check_bundle.py`: 0 ocorrências textuais de `localStorage`/`sessionStorage`/`indexedDB` no `dist/`) | DES-0007; `REL-0002` |
| Feature flag | **nenhuma**, por decisão do projeto validado: "sem chave mestra, porque o F-Spec proíbe configuração" — nenhuma chave para voltar ao kart provisório ou à câmera alta; "a reversão é a do repositório" (ADR-0003). A reversão desta release é a republicação do artefato anterior (`runbook.md`) | ADR-0003 |
| Variáveis de ambiente | nenhuma lida pelo cliente; nenhuma no workflow | `REL-0001` |
| O que o jogador vê de novo | o Kart 01 laranja com piloto de macacão azul e capacete em toda exibição (nunca o kart de caixas); a placa `01` no para-choque traseiro; a sombra do kart no chão; a visão geral da pista inteira antes da contagem, a descida da câmera durante `3`, `2`, `1` e, no `VERDE`, a câmera atrás do piloto, perto e baixa; rodas dianteiras e volante girando com o esterço, mãos no aro, rodas rolando com a velocidade; o campo de visão abrindo 4° com o turbo; marcas de pneu sob os pneus traseiros do modelo e fumaça na ponteira; no fim da volta, o kart congelado com a câmera atrás e o painel de resultado sobre a cena. O HUD, o resultado (`#lap-result-setup` = `arcade-assistido-v5`), o texto compartilhado e a física são os da release anterior | DES-0001 a DES-0005; `REL-0003` |

## Proveniência — o commit que a release nomeia

| Fato | Estado em 2026-10-27 |
|---|---|
| Veredito de testes | `SUCCESS` — `500 Tests/Output/modelo-kart-01/reports/test-validation/test-validation-20261027-2028.md` (296 verificações coletadas, 296 aprovadas, 0 reprovadas, 0 puladas: 59 `CHK-TEST-00nn-nn` desta feature em `tests/modelo-kart-01-*.test.ts` + 237 de `physics`, `maneuvers`, `race-lap-validation-*` e `dirigibilidade-*`; execução de 2026-10-27 17:20:40−03:00, posterior à última edição de `tests/` (17:20:12) e de `src/` (`src/main.ts`, 16:26:45); `fresh: true`; 22 divergências `unverified` na metade de tela, aparelho ou repositório — DIV-01 a DIV-22 —, nenhuma no veredito) |
| Commit verificado | **`6ea3862c74603886e3af421da3f542220980293f`** (curto `6ea3862`), ramo `master`, mensagem "modelo-kart-01: testes validados (59 checks, suíte 296/296)" — a ponta de `master` neste momento (lida em `.git/refs/heads/master`; nenhum comando `git` executado por esta rodada). A cadeia desta feature: `b29278b` (código da rodada 1: Kart 01, câmera, 27 chamadas), `8d52603` (D-Spec Modo C, só registro), `3c131aa` (código validado, rodada 2, sem mudança de código), `6ea3862` (testes). A árvore de `src/`, `scripts/`, `tests/`, `index.html`, `package.json` e do lockfile que o veredito verificou é a de `6ea3862`, construída sobre `b86b200` (a release anterior, `dirigibilidade`, contida nesta — ADR-0003) |
| Build local da mesma árvore | `dist/` de 2026-10-27 19:26:48Z (16:26 −03:00, logo depois da última edição de `src/main.ts` e antes de qualquer edição de outra feature): `assets/index-D0RarhFV.js` 631 352 bytes, `assets/index-dgojskay.css` 11 407, `index.html` 7 159; total **649 918 bytes** (171 137 gzip), `within_limit=True` (`measure_dist.py`, tabela abaixo); `check_bundle.py dist docs/kart-01/device-log.md`: **45 verificações, 0 reprovadas** |
| Staging | **publicado**: `https://edumatosr6-svg.github.io/kartle-staging/` responde **200 em HTTPS** (`Last-Modified: Tue, 27 Oct 2026 20:37:38 GMT`, `Cache-Control: max-age=600`) e serve `index.html` (7 189 bytes, base `/kartle-staging/`) que referencia **`assets/index-D0RarhFV.js`** (631 352 bytes servidos — o mesmo `<hash>` e o mesmo tamanho do build local da árvore de `6ea3862`) e `assets/index-dgojskay.css` (11 407); `check_served.py`: **37 verificações, 0 reprovadas** (marcadores do Kart 01, número `01`, constantes de câmera, três modos de câmera, nenhum símbolo do kart provisório, identificadores das releases anteriores, elementos do HTML). A execução do workflow `pages` em `edumatosr6-svg/kartle-staging` que o publicou é a do push de `6ea3862` ao ramo `staging` (`.git/refs/remotes/staging/staging` = `6ea3862`), feito pelo dono do produto em 2026-10-27 ≈ 20:36Z; **o número da execução é lido na aba Actions** e entra no relatório de validação, não neste registro (regra herdada: os números em vigor são os da aba Actions) |
| Produção | o site Pages de `edumatosr6-svg/kartle`, `https://edumatosr6-svg.github.io/kartle/`, com o ambiente `github-pages` protegido por **revisor obrigatório** (`edumatosr6-svg`); o clique de aprovação é a promoção (D-DP-06). **Nada foi promovido**: produção **ainda não serviu nenhum `dist/`** — a release de `race-lap-validation` (árvore `c41c6c3`) ficou com o `deploy` em *Waiting* (execução 39827702391, commit `05c3570`, segundo `600 Deploy/Output/dirigibilidade/reports/deploy-validation/deploy-validation-20261027-1931.md`) e a de `dirigibilidade` (`b86b200`) nunca foi enviada a `origin`. Esta release, se promovida, será a primeira servida em produção — e leva consigo as duas anteriores, cujas árvores estão contidas em `6ea3862` |
| Tag de release | não existe; a release é identificada pelo hash acima e pela execução do workflow que a publicar |
| Sistema de CI | **GitHub Actions**, `.github/workflows/pages.yml` (inalterado por esta feature): `npm ci` → `npm test` (**296** aprovados) → `npm run build -- --base=/<repo>/` → `measure_dist.py` (RNF02) → `upload-pages-artifact` → `deploy-pages`; etapas em `REL-0003` |
| Release anterior e alvo de reversão | `dirigibilidade`: árvore `b86b200`, JS `index-BiFxJ0FY.js` (579 462 bytes); em staging, a última execução verde **anterior** a esta é a **40566728590** (commit `b86b200`), alvo do caminho B de `runbook.md` em staging — **caminho ensaiado** em 2026-10-27 19:29–19:33Z pelo validador da release anterior (reexecução de 39631099098 e de 40566728590: ciclo ≈ 3 min 47 s). Em produção não há execução verde anterior (caminho A, ou aprovação de uma execução de árvore anterior se ainda estiver à espera — `runbook.md`) |

### Precondições humanas que restam, em ordem

1. **Registrar em `docs/kart-01/device-log.md` as execuções nos aparelhos de referência** (notebook, 60 fps em paisagem; celular
   intermediário, 30 fps em paisagem e em retrato) sobre a URL de staging: as **seis linhas humanas H1–H6 do `runbook.md`**
   (roteiros E2E-01 a E2E-06 de `300 Specs/330 D-Specs/Output/modelo-kart-01/test-strategy.md`), com `fpsPerSecond`, `minFps` e os
   bytes comprimidos transferidos. O arquivo **existe** (criado pela etapa de código, com a execução 1 no navegador embutido:
   parcial, sem taxa de quadros, sem retrato) e a seção *Execuções nos aparelhos de referência* diz **"Não executadas"**. As 22
   linhas `unverified` do veredito de testes (`500 Tests/Output/modelo-kart-01/98-divergences.md`) dependem desse registro; a
   linha de NFR-0006 (0 linhas alteradas na simulação) é revisão de código, não de aparelho.
2. **Validação de staging pelo validador** (`reports/deploy-validation/`), que confirma o número da execução de staging e o
   `<hash>` servido.
3. **A pergunta de promoção** (D-DP-06): só depois de 1 e 2 — e com a atenção de que promover `6ea3862` promove também
   `dirigibilidade` e `race-lap-validation`, cujas portas humanas (`docs/handling-device-log.md`, que não existe; execução 3 de
   `docs/lap-validation-device-log.md`) continuam abertas e podem ser fechadas **na mesma sessão de aparelho** sobre este bundle,
   porque a simulação é a mesma (`98-divergences.md`, DIV-DP-12).

Cumpridas: o commit da árvore verificada (`6ea3862`); o veredito de testes `SUCCESS`; o build reproduzido pelo pipeline em staging e
servido em HTTPS com o mesmo `<hash>` e o mesmo tamanho do build local; a reversão pelo caminho B ensaiada no mesmo site de
staging em 2026-10-27 (release anterior), cujo procedimento esta release reutiliza sem alteração; o Node fixado (`.nvmrc` = `24`);
os dois repositórios configurados (D23); a decisão de monitoramento (vigilância manual, nenhum monitor externo), mantida.

## Reprodução do build

O workflow executa estes passos a cada push; à mão, da raiz do repositório, com caminhos entre aspas:

| Passo | Comando | Resultado esperado |
|---|---|---|
| 1 | `npm ci` | saída 0; `package-lock.json` inalterado |
| 2 | `npm test` | saída 0; **296** aprovados, 0 reprovados, 0 pulados (59 desta feature) |
| 3 | `npm run build` (no workflow, `-- --base=/kartle/` ou `/kartle-staging/`) | saída 0 (`tsc --noEmit` e depois `vite build`); `dist/index.html`, `dist/assets/index-<hash>.js`, `dist/assets/index-<hash>.css`; nenhum outro arquivo em `dist/assets/` |
| 4 | `python -I "600 Deploy/Output/race-lap-validation/tools/measure_dist.py" dist` | tabela de tamanhos; `within_limit=True`; saída 0 (ferramenta da primeira release, reutilizada por referência — é a que o workflow chama) |
| 5 | `python -I "600 Deploy/Output/modelo-kart-01/tools/check_bundle.py" dist docs/kart-01/device-log.md` | `checks=45 failed=0`: um JS e um CSS e nada mais em `dist/assets/`; marcadores do Kart 01 e constantes de câmera no JS; nenhum símbolo do kart provisório; identificadores das releases anteriores; elementos do HTML; tamanhos; o registro em tela nomeia o JS |
| 6 | `npm run baseline:kart01` (opcional; recusa-se sem `--force` quando o fixture existe) | a linha de base de `tests/fixtures/kart01-sim-baseline.json` continua a de `b86b200`; não é passo de release |
| 7 | `npm run preview` | `http://127.0.0.1:4173` serve o bundle; a visão geral mostra a pista inteira com o Kart 01 na largada; no `VERDE` a câmera está atrás do piloto; a placa `01` é legível |

### Medida real do artefato (build local de 2026-10-27 19:26Z, árvore de `6ea3862`, base `/`)

| Arquivo | bytes | gzip bytes |
|---|---:|---:|
| `assets/index-D0RarhFV.js` | 631 352 | 165 033 |
| `assets/index-dgojskay.css` | 11 407 | 3 244 |
| `index.html` | 7 159 | 2 860 |
| **total** | **649 918** | **171 137** |

- Limite de NFR-0002 / RNF02 (download inicial abaixo de 3 145 728 bytes): **649 918 bytes brutos (20,7 % do limite)**; 171 137
  comprimidos (5,4 %). Contra a release anterior (598 028 bytes): **+51 890 bytes** (+8,7 %), todos no JS — o custo do modelo por
  programa, dos decalques em canvas, da câmera e do estado de exibição; nenhum recurso novo (textura, modelo, fonte).
- O JS servido em staging tem exatamente 631 352 bytes, o mesmo do build local: o pipeline reproduziu a árvore.
- O Vite avisa que o chunk principal passa de 500 kB minificado (Three.js); aviso de ferramenta, não violação de limiar.
- Os nomes dos *assets* carregam hash de conteúdo: o `index.html` publicado é o que aponta para a versão em vigor (`REL-0003`,
  regra de cache). O CSS não mudou (`dgojskay`, o mesmo das duas releases anteriores).

## O que o pipeline faz (`.github/workflows/pages.yml`)

Inalterado por esta feature. Em ordem, com saída observável na execução do Actions: checkout do commit → Node da `.nvmrc` (24)
com cache do npm → `npm ci` → `npm test` (296 aprovados) → `npm run build -- --base=/kartle/` (ou `/kartle-staging/`) →
`measure_dist.py dist` (saída 0) → `configure-pages` → `upload-pages-artifact` de `dist/` → trabalho `deploy` no ambiente
`github-pages`. Em produção o `deploy` **espera a aprovação do revisor obrigatório** (D-DP-06); em staging publica de imediato,
desde que a política de ramos do ambiente admita o ramo `staging` (liberada em 2026-10-21; volta a ser restrita a cada
despublicação — `REL-0003`). Permissões mínimas, nenhum segredo (I6). O passo *Measure dist* continua a chamar a ferramenta da
primeira release por caminho; as ferramentas desta release (`tools/check_bundle.py`, `tools/check_served.py`) são executadas por
quem valida e pelo runbook, não pelo workflow — acrescentá-las ao workflow é mudança de `.github/`, fora da cerca de escrita deste
estágio (`98-divergences.md`, DIV-DP-05).

## Limitações conhecidas — divergências aceitas e herdadas

- As divergências aceitas pelo dono do produto em 2026-10-21 continuam válidas, porque `index.html` e `src/style.css` não mudaram:
  o `href="/"` da marca sai de `/kartle/` no GitHub Pages e a página faz uma requisição a `fonts.googleapis.com` no carregamento
  (não durante a volta). Ambas `waived` (`98-divergences.md`, DIV-DP-09 e DIV-DP-10).
- O crédito OpenStreetMap e o aviso ODbL continuam não exigidos (pista sintética, 0 dado OSM; D-DP-04 ratificado em 2026-10-21).
  Esta feature não acrescenta dado de pista.
- A placa `01` é pintada num canvas 2D no carregamento; num navegador sem contexto 2D o modelo aparece sem número e o console
  mostra `kart01-decals`/`NO_2D_CONTEXT` (DES-0007) — sintoma de ambiente, não de empacotamento (`REL-0005`).
- A taxa de quadros não foi medida em nenhum aparelho nomeado: o navegador embutido da sessão roda em segundo plano e o seu
  ritmo é inválido (`docs/kart-01/device-log.md`, execução 1). É a linha H6 do `runbook.md`.
- Staging passou a servir este bundle no lugar do de `b86b200`: as linhas humanas H1–H5 da `dirigibilidade` ainda por executar
  correm agora sobre o Kart 01 e a câmera de jogo. A simulação é a mesma (NFR-0006; `RENDER_NEUTRAL`, `DETERMINISM`), por isso
  as medidas de acerto, HUD e comparabilidade continuam válidas; a medida de fps daquela release passa a incluir o custo do
  Kart 01, o que é o estado que se promove (`98-divergences.md`, DIV-DP-12).
