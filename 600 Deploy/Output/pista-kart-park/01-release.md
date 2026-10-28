---
title: Release — pista Kart Park (staging; produção bloqueada pela decisão Esri)
feature: pista-kart-park
stage: deploy
status: validated
version: 1.0.0
sources: [DM-0001, DM-0002, DES-0001, DES-0002, DES-0003, DES-0004, DES-0005, DES-0006, DES-0007, DES-0008, DES-0009, DES-0010, DES-0011, DES-0012, ADR-0001, ADR-0002, ADR-0003, ADR-0004, ADR-0005, ADR-0006, NFR-0001, NFR-0002, NFR-0003, NFR-0004, NFR-0005, NFR-0006, NFR-0007, NFR-0008, NFR-0009, NFR-0010, NFR-0011, NFR-0012, TEST-0001, TEST-0007, TEST-0008, TEST-0009, TEST-0012]
---

# 01 — Release

Candidato a release da feature `pista-kart-park`: a **Kart Park** (São José dos Pinhais, PR) como primeira pista real do Kartle,
jogável no **treino** ao lado da pista sintética — arquivo de pista em **esquema 3** (`src/tracks/kart-park-v1.json`, 43 013
bytes, 684 pontos, linha central suavizada com janela de 12 m a até 0,30 m da origem, 682,116 m medidos, rótulo "687 m",
38 marcadores, 34 zebras de 1,0 m, 1 barreira de 382 vértices e 53,29 m entre os trechos quase encostados, 3 limites de setor);
o **seletor de pista** da tela inicial, que abre sempre na Kart Park; o **crédito OpenStreetMap/ODbL** com link no seletor e na
tela de resultado; a **zebra como superfície** (aderência 0,85 do asfalto, vibração de 20 ms a cada 0,25 s no celular, ruído
grave a 160 Hz no teclado com o som ligado); a **barreira** com resposta de muro (rodada 3: normal do lado de origem corrigida em
`src/physics.ts:372`); o preparo offline e o registro de publicação (`npm run track`). O que se entrega é o mesmo tipo de
artefato das três releases anteriores (`race-lap-validation`, `dirigibilidade`, `modelo-kart-01`): um **artefato estático**
(`dist/`, HTML + JS + CSS) servido pelo **GitHub Pages** com HTTPS (D23); **não há servidor, banco, serviço, migração de dado,
armazenamento no navegador nem aplicativo nativo** nesta release — o arquivo de pista vai **dentro do JS** como literal
(ADR-0002), não como recurso servido à parte.

**O que esta release não faz: ir a produção.** A Kart Park é derivada de um caminho OpenStreetMap e de bordas detectadas em
imagem **Esri World Imagery** (seed, *Origem*), e a dúvida sobre a licença desse dado derivado **bloqueia só a promoção para
produção** (DOMAIN.md, decisão *Licença* e o ponto Esri de 2026-10-22; NFR-0012; ADR-0005). `tracks/registry.json` tem a entrada
`kart-park` 1 em `STAGING`; `npm run track -- promote` recusa sem `--esri-decision` (`scripts/track-pipeline.ts:40-62`,
`:151-160`; CHK-TEST-0012-04). O `runbook.md` termina, por isso, **antes** da pergunta de promoção, com a precondição da decisão
Esri por marcar — e com as duas opções que restam para levar `dirigibilidade` e o Kart 01 a produção entretanto.

## O que é entregue

| Item | Conteúdo | Fonte |
|---|---|---|
| Canais | `web-desktop` e `web-mobile` — a mesma página, com teclado no computador (som da zebra) e inclinação ou toque no celular (vibração da zebra); paisagem e retrato | diretivas do estágio; `REL-0004` |
| Arquivos de origem desta feature | novos: `src/trackGeometry.ts` (289 linhas), `src/trainingSession.ts` (94), `src/curbFeedback.ts` (37), `src/trackScene.ts` (134), `src/rawImports.d.ts`, `src/tracks/kart-park-v1.json` (gerado por `prepare`), `scripts/trackPrep.ts` (391), `scripts/trackChecks.ts` (361), `scripts/track-pipeline.ts` (167), `tracks/sources/kart-park.json` (cópia byte a byte do seed, SHA-256 `52c5adda…`), `tracks/registry.json`; alterados: `src/trackData.ts` (esquema 3, leitor da versão 2 intacto), `src/physics.ts` (481 linhas: `curb` como superfície, `Environment.track`, barreira, telemetria `barrierContact`), `src/lap.ts` (corte por distância à borda, reposicionamento na linha central), `src/lapMessages.ts` (`OSM_CREDIT`, `creditFor`, `optionLabel`), `src/audio.ts` (`CURB_SOUND`, `curb()`), `src/main.ts` (646 linhas: seletor, crédito, sessão, minimapa, retorno da zebra, abertura na Kart Park), `index.html` (`#track-name`, `#track-selector`, `#track-credit`, `#lap-result-credit`; "Circuito Aurora" retirado), `src/style.css` (`.track-selector`, `.track-credit`), `package.json` (script `track`; dependências inalteradas); `tests/pista-kart-park-*.test.ts` (12 suítes, 102 verificações `CHK-TEST-00nn-nn`) | `400 Code/Output/pista-kart-park/01-implementation.md` 1.2.0; `500 Tests/Output/pista-kart-park/` |
| Inalterados por esta feature | `src/track.ts`, `src/maneuvers.ts`, `src/lapTiming.ts`, `src/setupRecords.ts`, os módulos de `modelo-kart-01` (`src/kart01Model.ts`, `src/kart01Decals.ts`, `src/kartPose.ts`, `src/gameCamera.ts`), os presets `RENTAL_KART`, `ARCADE_KART`, `ARCADE_ASSISTIDO_V5`, `STEP`, `Input` e a assinatura de `step` (NFR-0008), `tsconfig.json`, `.github/workflows/pages.yml`, `.nvmrc`, `package-lock.json`; dependências de execução: **nenhuma acrescentada** (`three` continua a única — NFR-0010) | idem |
| Formato publicado que muda | **o arquivo de pista ganha a versão de esquema 3** (`TRACK_SCHEMA_VERSION` 3: `osmDerived`, `direction`, `sectorLimits`, `markers`, `curbs`, `barriers`, larguras por ponto) com o leitor da versão 2 mantido — a pista `synthetic` v2 continua lida pelo mesmo `readTrackData` (CHK-TEST-0009-02 de `race-lap-validation` reescrito para "v3 posterior a v2"); a Kart Park é `kart-park` **versão 1**, imutável, registrada com SHA-256 `04ce5e51…` em `tracks/registry.json` (NFR-0006; D-DP-01) | DM-0001, DM-0002, ADR-0001; `REL-0002` |
| Formato persistido que muda | **nenhum**: a pista escolhida não é gravada nem lida no navegador; nenhuma volta de treino cria registro de desafio (DES-0012; CHK-TEST-0011-02; `check_bundle.py`: 0 ocorrências textuais de `localStorage`/`sessionStorage`/`indexedDB` no `dist/`) | DES-0012; `REL-0002` |
| Feature flag | **nenhuma**, por decisão do projeto validado (ADR-0005: nenhuma chave de configuração, de compilação ou de execução — o catálogo é fixo e a Kart Park é a pista de abertura em todo artefato que contenha esta feature). O ponto de aplicação da "chave mestra" de I4 é a **promoção**: humano, registrado em `tracks/registry.json` e bloqueado pela decisão Esri | ADR-0005, DES-0011 |
| Variáveis de ambiente | nenhuma lida pelo cliente, pelo preparo offline ou pelo workflow | `REL-0001` |
| O que o jogador vê de novo | ao abrir, o seletor com "Kart Park — São José dos Pinhais (traçado aproximado) · 687 m" marcada e "Pista sintética"; a linha discreta "© colaboradores do OpenStreetMap · licença ODbL · openstreetmap.org/copyright" (link em outra aba); `#track-status` `kart-park`; a visão geral com o asfalto de larguras variáveis, as zebras vermelhas e brancas, a barreira e a linha de largada da Kart Park, com o Kart 01 na largada; a única oferta "volta de treino"; na volta, a zebra vibra no celular e soa no teclado, a barreira bate e não deixa passar, o corte e o reposicionamento valem na linha central da Kart Park; no resultado, tempo total, 4 setores e o mesmo crédito; "marcador pulado" numa volta inválida; o recorde real de 41,45 s **não** aparece. A pista sintética, o HUD, o Kart 01, a câmera, os acertos e a física nas releases anteriores são os mesmos | DES-0005, DES-0007, DES-0008, DES-0009; `REL-0003` |

## Proveniência — o commit que a release nomeia

| Fato | Estado em 2026-10-27 |
|---|---|
| Veredito de testes | `SUCCESS` — `500 Tests/Output/pista-kart-park/reports/test-validation/test-validation-20261027-2333.md` (rodada 2, revalidação após `FAIL CODE`: 398 verificações coletadas, 398 aprovadas, 0 reprovadas, 0 puladas — 102 `CHK-TEST-00nn-nn` desta feature em 12 suítes + 296 das três features anteriores; execução de 2026-10-27 20:32:51 −03:00, posterior à última edição de `src/` (`src/physics.ts` 20:24:10, commit `1a12076`) e de `tests/` (19:56:54); `fresh: true`; `seed: {revision: 1, digest: b5aa5be4734a}`; 22 divergências `unverified`/`n/a` na metade de tela, aparelho, som, vibração, navegador ou rede — DIV-01 a DIV-22 —, nenhuma no veredito). Validação de código: `code-validation-20261027-2327.md` `SUCCESS` |
| Commit verificado | **`d9139a21f833e4e2ee72a6d9b58322ce77ae4564`** (curto `d9139a2`), ramo `master`, mensagem "pista-kart-park: testes validados (102 checks, suíte 398/398)", 2026-10-27T23:39:01Z — a ponta de `master` neste momento (lida em `.git/refs/heads/master`; nenhum comando `git` executado por esta rodada). A cadeia desta feature sobre `6ea3862` (`modelo-kart-01` validado; NFR-0011: código só depois de `dirigibilidade`, `b86b200` é ancestral): `ba221ad` (código da rodada 1, ponto de controle), `95d78fa` (D-Spec Modo C, só registro), `c5dfcb3` (código validado, rodada 2: suavização de 12 m), `b44bacb` (testes da rodada 1, ponto de controle), `1a12076` (barreira, rodada 3 — a última edição de `src/`), `d9139a2` (testes validados, só registro). Entre `ba221ad` e `95d78fa` entraram `32d0adf` (`race-lap-validation`: CHK-TEST-0009-02 aceita o esquema 3) e `c7e71b1` (`modelo-kart-01`: CHK-TEST-0004-13 restrito aos campos da linha de base) — adaptações de testes de outras features ao leitor v3, contidas nesta árvore |
| Build local da mesma árvore | `dist/` de 2026-10-27 23:24:33Z (20:24:33 −03:00, 23 s depois da última edição de `src/physics.ts` e antes de `d9139a2`, que não toca a árvore construída): `assets/index-DYFBop8t.js` 694 056 bytes, `assets/index-Dv0Dz75T.css` 11 890, `index.html` 7 375; total **713 321 bytes** (189 855 gzip), `within_limit=True` (`measure_dist.py`, tabela abaixo); o manifesto de código nomeia o mesmo `index-DYFBop8t.js` para a rodada 3; `check_bundle.py dist tracks/registry.json`: **83 verificações, 0 reprovadas** (1 `warn`: `fetch(` do polyfill de `modulepreload` do Vite) |
| Staging | **push feito, execução por confirmar**: `.git/refs/remotes/staging/staging` = `d9139a2` (push do dono do produto em 2026-10-27T23:39:04Z, 3 s depois do commit). Às 23:46Z a URL `https://edumatosr6-svg.github.io/kartle-staging/` **ainda servia o bundle da release anterior** (`index-D0RarhFV.js`, 631 352 bytes, `Last-Modified: Tue, 27 Oct 2026 20:37:38 GMT`, `Cache-Control: max-age=600`): `check_served.py` desta release deu `checks=65 failed=28` — reprovadas **exatamente** as 28 linhas que só este bundle tem (elementos novos do HTML, arquivo da Kart Park, seletor, crédito, zebra, barreira, malhas, classes do CSS), e a ferramenta da release anterior continuou `37/37`. O esperado quando a execução do push concluir: `index-DYFBop8t.js` servido (mesmo lockfile, mesmo Node 24: na release anterior o `<hash>` local e o de staging coincidiram) e `check_served.py … index-DYFBop8t.js` com `checks=74 failed=0`. **O número da execução é lido na aba Actions** pelo validador e entra no relatório de validação, não neste registro (regra herdada) |
| Produção | o site Pages de `edumatosr6-svg/kartle`, `https://edumatosr6-svg.github.io/kartle/`, responde **404** (nada publicado); `.git/refs/remotes/origin/master` = **`05c3570`** (2026-10-22, primeira release): nem `6ea3862` nem `d9139a2` foram enviados a `origin`. O ambiente `github-pages` tem revisor obrigatório `edumatosr6-svg`; o clique é a promoção (D-DP-06). **Esta release não é promovível** enquanto a decisão Esri não existir (ADR-0005; NFR-0012): nenhum push de `d9139a2` (ou de qualquer commit posterior de `master`) a `origin` deve ser aprovado em produção — `runbook.md`, *Promoção bloqueada* |
| Tag de release | não existe; a release é identificada pelo hash acima e pela execução do workflow que a publicar |
| Sistema de CI | **GitHub Actions**, `.github/workflows/pages.yml` (inalterado por esta feature): `npm ci` → `npm test` (**398** aprovados) → `npm run build -- --base=/<repo>/` → `measure_dist.py` (RNF02) → `upload-pages-artifact` → `deploy-pages`; etapas em `REL-0003` |
| Release anterior e alvo de reversão | `modelo-kart-01`: árvore `6ea3862`, JS `index-D0RarhFV.js` (631 352 bytes); em staging, a execução verde **anterior** a esta é a **40579585592** (commit `6ea3862`, validada em `deploy-validation-20261027-2057.md`), alvo do caminho B de `runbook.md` em staging — o **procedimento** do caminho B foi ensaiado no mesmo site em 2026-10-27 19:29–19:33Z (par 39631099098 ↔ 40566728590, ciclo ≈ 3 min 47 s). Em produção não há execução verde (caminho A, nada a despublicar hoje) |

### Precondições humanas que restam, em ordem

1. **Validação de staging pelo validador** (`reports/deploy-validation/`): confirmar o número da execução do push de `d9139a2`
   em `edumatosr6-svg/kartle-staging`, o `<hash>` servido (`DYFBop8t` esperado) e `check_served.py` 74/74.
2. **Registrar em `docs/kart-park-device-log.md` as execuções nos aparelhos de referência** — o arquivo **não existe** e este
   estágio não o cria (§14); é o dono do produto quem o cria, no molde de `docs/kart-01/device-log.md`, com as **oito linhas
   humanas H1–H8 do `runbook.md`** (roteiros E2E-01 a E2E-08 de `300 Specs/330 D-Specs/Output/pista-kart-park/test-strategy.md`):
   notebook de referência (60 fps) e celular intermediário (30 fps, vibração, paisagem e retrato), mais Chrome e Firefox para o
   som, um navegador em inglês e um sem `navigator.vibrate`. As 22 linhas `unverified`/`n/a` do veredito de testes dependem
   desse registro.
3. **A decisão Esri do dono do produto, registrada em `DOMAIN.md`** (identificador e data), com a evidência que o `runbook.md`
   lista (termos de uso da Esri para dado derivado do World Imagery). Sem ela não há pergunta de promoção para esta release
   (D-DP-06 fica sem objeto; NFR-0012: 0 promoções antes da decisão). Com ela, a promoção não é deste commit: é de uma
   **entrega nova** que acrescenta o crédito da Esri (REQ-FEAT-0006-14; DES-0011) e grava `PRODUCTION` no registro
   (`npm run track -- promote kart-park 1 --esri-decision "<referência>"`).
4. **Enquanto 3 não existe**: decidir como `dirigibilidade` e o Kart 01 (`6ea3862`) chegam a produção — esperar a decisão, ou
   publicar `6ea3862` em produção antes de qualquer push de `master` a `origin` (as duas opções em `runbook.md`).

Cumpridas: o commit da árvore verificada (`d9139a2`); o veredito de testes `SUCCESS` e o de código `SUCCESS`; o build local da
árvore medido e conferido (83/83); o push a staging; o registro da pista em `STAGING` com o SHA-256 que o bundle reproduz byte a
byte; o Node fixado (`.nvmrc` = `24`); os dois repositórios configurados (D23); a decisão de monitoramento (vigilância manual,
nenhum monitor externo), mantida.

## Reprodução do build

O workflow executa estes passos a cada push; à mão, da raiz do repositório, com caminhos entre aspas:

| Passo | Comando | Resultado esperado |
|---|---|---|
| 1 | `npm ci` | saída 0; `package-lock.json` inalterado |
| 2 | `npm test` | saída 0; **398** aprovados, 0 reprovados, 0 pulados (102 desta feature) |
| 3 | `npm run track -- verify kart-park 1` | `VERIFIED`, V01 a V18 `PASS` (leitura; nada escrito) |
| 4 | `npm run build` (no workflow, `-- --base=/kartle/` ou `/kartle-staging/`) | saída 0 (`tsc --noEmit` e depois `vite build`); `dist/index.html`, `dist/assets/index-<hash>.js`, `dist/assets/index-<hash>.css`; nenhum outro arquivo em `dist/assets/` — o arquivo de pista está dentro do JS |
| 5 | `python -I "600 Deploy/Output/race-lap-validation/tools/measure_dist.py" dist` | tabela de tamanhos; `within_limit=True`; saída 0 (ferramenta da primeira release, reutilizada por referência — é a que o workflow chama) |
| 6 | `python -I "600 Deploy/Output/pista-kart-park/tools/check_bundle.py" dist tracks/registry.json` | `checks=83 failed=0`: um JS e um CSS e nada mais; o arquivo da Kart Park uma vez no JS, JSON legível, SHA-256 + LF igual ao registrado, 684/38/34/3/1 (382), chaves de DM-0001, abaixo de 200 000 bytes; textos do seletor e do crédito; `vibrate(20)`, `lowpassHz:160`; malhas; nenhum `esri`/`41.45`/`recorde`/`Circuito Aurora`; releases anteriores; elementos do HTML; classes do CSS; tamanhos |
| 7 | `npm run preview` | `http://127.0.0.1:4173` serve o bundle; abre na Kart Park com o seletor e o crédito; "volta de treino" inicia a contagem sobre o asfalto da Kart Park |

### Medida real do artefato (build local de 2026-10-27 23:24Z, árvore de `1a12076` = `src/` de `d9139a2`, base `/`)

| Arquivo | bytes | gzip bytes |
|---|---:|---:|
| `assets/index-DYFBop8t.js` | 694 056 | 183 607 |
| `assets/index-Dv0Dz75T.css` | 11 890 | 3 350 |
| `index.html` | 7 375 | 2 898 |
| **total** | **713 321** | **189 855** |

- Limite de RNF02 (download inicial abaixo de 3 145 728 bytes): **713 321 bytes brutos (22,7 % do limite)**; 189 855 comprimidos
  (6,0 %). Contra a release anterior (649 918 bytes): **+63 403 bytes** (+9,8 %) — o JS cresce 62 704 (o arquivo de pista como
  literal, 43 012 caracteres no bundle, mais os módulos novos), o CSS 483 (seletor e crédito) e o HTML 216 (os quatro elementos).
- O arquivo da Kart Park no bundle: **43 012 bytes** (o arquivo tem 43 013 com o `\n` final; o literal `?raw` omite-o) —
  NFR-0001 pede abaixo de 200 000; `SHA-256(literal + "\n")` = `04ce5e51…` = o registrado em `tracks/registry.json` (NFR-0006).
- O Vite avisa que o chunk principal passa de 500 kB minificado (Three.js); aviso de ferramenta, não violação de limiar.
- Os nomes dos *assets* carregam hash de conteúdo: o `index.html` publicado é o que aponta para a versão em vigor (`REL-0003`,
  regra de cache). O CSS **mudou** nesta release (`Dv0Dz75T`, antes `dgojskay`).

## O que o pipeline faz (`.github/workflows/pages.yml`)

Inalterado por esta feature. Em ordem, com saída observável na execução do Actions: checkout do commit → Node da `.nvmrc` (24)
com cache do npm → `npm ci` → `npm test` (398 aprovados; inclui V01–V18 sobre o arquivo publicado e a prova de que
`promote` recusa sem `--esri-decision`) → `npm run build -- --base=/kartle/` (ou `/kartle-staging/`) → `measure_dist.py dist`
(saída 0) → `configure-pages` → `upload-pages-artifact` de `dist/` → trabalho `deploy` no ambiente `github-pages`. Em produção o
`deploy` **espera a aprovação do revisor obrigatório** (D-DP-06) — e nesta release **a aprovação não pode ser dada** antes da
decisão Esri; em staging publica de imediato, desde que a política de ramos do ambiente admita o ramo `staging` (liberada em
2026-10-21; volta a ser restrita a cada despublicação — `REL-0003`). Permissões mínimas, nenhum segredo (I6). As ferramentas
desta release (`tools/check_bundle.py`, `tools/check_served.py`) são executadas por quem valida e pelo runbook, não pelo
workflow (`98-divergences.md`, DIV-DP-05, herdada).

## Limitações conhecidas — divergências aceitas e herdadas

- As divergências aceitas pelo dono do produto em 2026-10-21 continuam válidas: o `href="/"` da marca sai de `/kartle/` no
  GitHub Pages e a página faz uma requisição a `fonts.googleapis.com` no carregamento (não durante a volta; NFR-0004 conta a
  partir da escolha da pista). Ambas `waived` (`98-divergences.md`, DIV-DP-09 e DIV-DP-10).
- O crédito OpenStreetMap e o aviso ODbL passam a ser **exigidos** (primeira pista OSM; D-DP-04): estão no bundle e nas duas
  telas (`check_bundle.py`, `check_served.py`; AC-US-0006-01..06), e a visibilidade na tela é a linha H1/H5 do `runbook.md`.
- O crédito da **Esri** não está no bundle (0 ocorrências de `esri`), por projeto: entra na entrega que promover, se a decisão o
  liberar (NFR-0012, segunda linha; REQ-FEAT-0006-14).
- A poligonal da barreira alterna de direção a cada 0,1 m (amostragem das bordas a 0,25 m): a normal de contato muda a cada
  segmento e o kart pode ricochetear em ângulos inesperados nas velocidades alcançáveis — observação de qualidade do estágio de
  testes para o D-Spec (`500 Tests/Output/pista-kart-park/98-divergences.md`), não defeito; a "sensação" da barreira é a linha
  H3 do `runbook.md`.
- Taxa de quadros, vibração e som não foram medidos em nenhum aparelho nomeado (o navegador embutido da etapa de código roda em
  segundo plano e não vibra). São as linhas H3, H4, H5 e H6 do `runbook.md`.
- Staging passa a servir este bundle no lugar do de `6ea3862` enquanto as portas humanas das releases contidas (`docs/kart-01/
  device-log.md` "Não executadas"; `docs/handling-device-log.md` inexistente; execução 3 de `docs/lap-validation-device-log.md`)
  continuam abertas. A simulação na pista sintética é a mesma (NFR-0008; `RENDER_NEUTRAL`, `DETERMINISM`, `bench:handling`
  46/46), por isso as listas daquelas releases podem correr sobre este bundle escolhendo "Pista sintética" no seletor
  (`98-divergences.md`, DIV-DP-12).
