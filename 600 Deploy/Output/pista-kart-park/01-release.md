---
title: Release — pista Kart Park (staging; produção bloqueada pela decisão Esri)
feature: pista-kart-park
stage: deploy
status: validated
version: 1.2.0
sources: [DM-0001, DM-0002, DES-0001, DES-0002, DES-0003, DES-0004, DES-0005, DES-0006, DES-0007, DES-0008, DES-0009, DES-0010, DES-0011, DES-0012, ADR-0001, ADR-0002, ADR-0003, ADR-0004, ADR-0005, ADR-0006, ADR-0007, NFR-0001, NFR-0002, NFR-0003, NFR-0004, NFR-0005, NFR-0006, NFR-0007, NFR-0008, NFR-0009, NFR-0010, NFR-0011, NFR-0012, TEST-0001, TEST-0007, TEST-0008, TEST-0009, TEST-0012]
---

# 01 — Release

Candidato a release da feature `pista-kart-park`: a **Kart Park** (São José dos Pinhais, PR) como primeira pista real do Kartle,
jogável no **treino** ao lado da pista sintética — arquivo de pista em **esquema 3** (`src/tracks/kart-park-v1.json`, 43 013
bytes, 684 pontos, linha central suavizada com janela de 12 m a até 0,30 m da origem, 682,116 m medidos, rótulo "687 m",
38 marcadores, 34 zebras de 1,0 m, 1 barreira de 382 vértices, 3 limites de setor); o **seletor de pista** da tela inicial, que
abre sempre na Kart Park; o **crédito OpenStreetMap/ODbL** com link no seletor e no painel do resultado de cada volta do treino;
a **zebra como superfície** (aderência 0,85 do asfalto, vibração de 20 ms a cada 0,25 s no celular, ruído grave a 160 Hz no
teclado com o som ligado); a **barreira** com resposta de muro; o preparo offline e o registro de publicação (`npm run track`).

**O que muda nesta rodada (Modo B, rodada 3, 2026-10-30).** O registro passa do build de `6b314b2` (rodada 2, que abriu
DIV-DP-16) ao build de **`e70aad9`**, que staging serve hoje. A rodada 4 de código desta feature (`38354bb`, validação
`400 Code/Output/pista-kart-park/reports/code-validation/code-validation-20261030-1836.md`, `SUCCESS`) realizou **ADR-0007**: o
crédito do resultado vive em `#lap-training-result-credit`, último filho do painel do resultado da volta do treino
(`#lap-training-result`), redesenhado a cada resultado sem ser removido (`src/main.ts:461-486`), com o link acionável
(`#lap-training-result-credit a{pointer-events:auto}`); `#lap-result-credit` saiu de `#lap-result` e de `renderResult`. Os testes
foram migrados em `e70aad9` (CHK-TEST-0009-04 para o painel; CHK-TEST-0009-11 novo; 444/444). **DIV-DP-16 está fechada.**

O treino é uma **sequência de voltas numa sessão** (`race-lap-validation`): o resultado de cada volta aparece no painel
`#lap-training-result` sem parar o kart, a volta inválida é marcada e segue, "encerrar treino" volta ao seletor, e `#lap-result`
fica só para volta oficial e de reconhecimento. O acerto publicado é `arcade-assistido-v6` sem drift nem turbo (`dirigibilidade`)
e o Kart 01 tem marcas de pneu (`modelo-kart-01`).

O que se entrega é o mesmo tipo de artefato das releases anteriores: um **artefato estático** (`dist/`, HTML + JS + CSS) servido
pelo **GitHub Pages** com HTTPS (D23); **não há servidor, banco, serviço, migração de dado, armazenamento no navegador nem
aplicativo nativo** — o arquivo de pista vai **dentro do JS** como literal (ADR-0002).

**O que esta release não faz: ir a produção.** A Kart Park é derivada de um caminho OpenStreetMap e de bordas detectadas em
imagem **Esri World Imagery** (seed, *Origem*), e a dúvida sobre a licença desse dado derivado **bloqueia só a promoção para
produção** (`DOMAIN.md`, o ponto Esri de 2026-10-22, ainda sem decisão; NFR-0012; ADR-0005). `tracks/registry.json` tem a entrada
`kart-park` 1 em `STAGING`; `npm run track -- promote` recusa sem `--esri-decision` (CHK-TEST-0012-04). O `runbook.md` termina,
por isso, **antes** da pergunta de promoção.

## O que é entregue

| Item | Conteúdo | Fonte |
|---|---|---|
| Canais | `web-desktop` e `web-mobile` — a mesma página, com teclado no computador (som da zebra) e inclinação ou toque no celular (vibração da zebra); paisagem e retrato | diretivas do estágio; `REL-0004` |
| Arquivos de origem desta feature | os da rodada 1 (`src/trackGeometry.ts`, `src/trainingSession.ts`, `src/curbFeedback.ts`, `src/trackScene.ts`, `src/rawImports.d.ts`, `src/tracks/kart-park-v1.json`, `scripts/trackPrep.ts`, `scripts/trackChecks.ts`, `scripts/track-pipeline.ts`, `tracks/sources/kart-park.json`, `tracks/registry.json`; alterados `src/trackData.ts`, `src/physics.ts`, `src/lap.ts`, `src/lapMessages.ts`, `src/audio.ts`, `src/main.ts`, `index.html`, `src/style.css`, `package.json`); `.gitattributes` (`5ed7a5b`, regra byte-exata); **rodada 4** (`38354bb`): `index.html` (`#lap-training-result-credit` dentro de `#lap-training-result`; `#lap-result-credit` retirado), `src/main.ts` (`renderTrainingResult` preserva e redesenha o crédito; `renderResult` sem crédito), `src/style.css` (link do crédito acionável no painel); `tests/pista-kart-park-*.test.ts` (12 suítes; CHK-TEST-0009-04 migrada e CHK-TEST-0009-11 nova em `e70aad9`) | `400 Code/Output/pista-kart-park/01-implementation.md` 1.4.0; `500 Tests/Output/pista-kart-park/` |
| Contido no mesmo build, de outras features | o treino de voltas seguidas (`race-lap-validation`, `0c83ed9`); `arcade-assistido-v6` sem drift nem turbo (`dirigibilidade`, `cfad3dc`, `f6e2d16`); marcas de pneu e câmera sem turbo (`modelo-kart-01`, `aeaf504`). Cada uma tem o seu registro de release | registros de release dessas features |
| Inalterados | `.github/workflows/pages.yml`, `.nvmrc`, `package-lock.json`, `tsconfig.json`, `tracks/`, `src/tracks/`; dependências de execução: **nenhuma acrescentada** (`three` continua a única — NFR-0010) | `git diff --stat 6b314b2 e70aad9`: só `index.html`, `src/main.ts`, `src/style.css` e `tests/pista-kart-park-screens.test.ts` |
| Formato publicado | **o arquivo de pista em esquema 3** com o leitor da versão 2 mantido; `kart-park` **versão 1**, imutável, SHA-256 `04ce5e51…` em `tracks/registry.json` (NFR-0006; D-DP-01) — o mesmo blob desde `d9139a2` | DM-0001, DM-0002, ADR-0001; `REL-0002` |
| Formato persistido | **nenhum**: a pista escolhida não é gravada nem lida no navegador; nenhuma volta de treino cria registro de desafio (DES-0012; CHK-TEST-0011-02) | DES-0012; `REL-0002` |
| Feature flag | **nenhuma** (ADR-0005). O ponto de aplicação da "chave mestra" de I4 é a **promoção**: humano, registrado em `tracks/registry.json` e bloqueado pela decisão Esri | ADR-0005, DES-0011 |
| Variáveis de ambiente | nenhuma lida pelo cliente, pelo preparo offline ou pelo workflow | `REL-0001` |
| O que o jogador vê | ao abrir, o seletor com "Kart Park — São José dos Pinhais (traçado aproximado) · 687 m" marcada e "Pista sintética"; a linha "© colaboradores do OpenStreetMap · licença ODbL · openstreetmap.org/copyright" (link em outra aba); `#track-status` `kart-park`; a Kart Park desenhada com o Kart 01 na largada; a única oferta "volta de treino". No treino, as voltas seguem-se sem parar o kart: o resultado de cada volta (validade, motivo, total, 4 setores, "não oficial") aparece no painel `#lap-training-result` **com o crédito OSM como último item** (ADR-0007), válida ou inválida, e nunca na sintética; "encerrar treino" volta ao seletor; zebra com vibração e som; a barreira bate e não deixa passar; o recorde real de 41,45 s **não** aparece | DES-0005, DES-0007, DES-0008, DES-0009, ADR-0007; `REL-0003` |

## Proveniência — o commit que a release nomeia

| Fato | Estado em 2026-10-30 |
|---|---|
| Validação de código | `SUCCESS` — `code-validation-20261030-1836.md` (rodada 4, iteração 2): ADR-0007 realizado em `38354bb` (2026-10-30T15:39:02 −03:00); `tsc` 0; `track verify kart-park 1` `VERIFIED` com o arquivo intacto (`04ce5e51…`); 1 aviso de ponteiros deslocados no manifesto |
| Veredito de testes | o último `SUCCESS` registrado é `500 Tests/Output/pista-kart-park/reports/test-validation/test-validation-20261030-1714.md` (rodada 3, 102/102, árvore anterior à rodada 4 de código). **A validação de testes de `e70aad9` (CHK-TEST-0009-04 migrada, CHK-TEST-0009-11 nova) está em curso** pelo laço de testes; o `npm test` da execução 41109469203 dá **444/444** sobre `e70aad9`. Precondição em aberto no `runbook.md` |
| Commit verificado (`<sha>`) | **`e70aad9ddf5cf42da6c5957b4023afdbf6cacd03`** (curto `e70aad9`), 2026-10-30T15:44:24 −03:00, "pista-kart-park: CHK-TEST-0009-04 migrado para o crédito do painel de treino (ADR-0007) e CHK-TEST-0009-11 novo — 444/444": a ponta de `master` e o commit que staging serve. Contra `6b314b2` muda só `index.html`, `src/main.ts`, `src/style.css` (`38354bb`) e `tests/pista-kart-park-screens.test.ts` (`e70aad9`), além de registros. Cadeia (NFR-0011): `b86b200` e `6ea3862` continuam ancestrais |
| Construído pelo pipeline | **sim, observado** (`gh run view`, só leitura): execução **41109469203** de `edumatosr6-svg/kartle-staging`, evento `push`, `head_sha` `e70aad9…`, criada 2026-10-30T18:44:27Z, tentativa 1, `success`; `build` 18:44:30–18:46:27Z (Node v24.22.1; *Test* `tests 444 / pass 444 / fail 0`; *Build* `dist/assets/index-DmxsQuIL.js 694.17 kB`, `index-q-biCwua.css 10.85 kB`; *Measure dist* `files=3 total_bytes=711620 gzip_bytes=188719 within_limit=True ratio=0.226`); `deploy` 18:46:30–18:46:39Z `success` |
| Servido em staging | `https://edumatosr6-svg.github.io/kartle-staging/` com `Last-Modified: Fri, 30 Oct 2026 18:46:34 GMT`, `Cache-Control: max-age=600`: `index.html` 6 592 bytes (sha256 `ba4e81a4…`), `assets/index-DmxsQuIL.js` 694 178 bytes (`79e3182c…`; 183 635 gzip), `assets/index-q-biCwua.css` 10 850 bytes (`5e1c964b…`) — total **711 620 bytes**, igual ao *Measure dist* da execução. A prova byte a byte contra um build limpo de `e70aad9` é do validador |
| Arquivo da Kart Park servido = registro | **sim**: as duas ferramentas extraem o literal (43 012 bytes) e dão SHA-256 + LF = `04ce5e510410e297764c047739422b07d46290c70eade1c1fb5bb7d120f057b1` = `tracks/registry.json` entrada `kart-park` 1 (`fileBytes` 43 013, `STAGING`, sem `promotedAtUtc`/`esriDecisionRef`); blobs em `e70aad9` iguais aos de `5ed7a5b`: `src/tracks/kart-park-v1.json` `a1f57085…`, `tracks/registry.json` `cfdeec07…`, `tracks/sources/kart-park.json` `d5ee2187…` (CRLF, `prep.originSha256` `52c5adda…`) |
| Ferramentas sobre o servido | `check_served.py … index-DmxsQuIL.js`: **`checks=79 failed=0`**; `check_bundle.py` sobre o artefato servido (baixado para fora da árvore) e o registro de `e70aad9`: **`checks=88 failed=0`** (1 `warn`: `fetch(` do polyfill de `modulepreload`). As 4 linhas de ADR-0007 que reprovavam em `6b314b2` passam: `#lap-training-result-credit` dentro de `#lap-training-result` no HTML e nomeado no JS; nenhum `lap-result-credit` no HTML nem no JS |
| Regra byte-exata dos arquivos de pista | os três arquivos cujo resumo o registro guarda vivem no git **sem normalização de fim de linha** (`.gitattributes`, `5ed7a5b`: `tracks/sources/*.json -text`, `src/tracks/*.json -text`, `tracks/registry.json -text`); o resumo registrado é o dos **bytes do blob**, não o da árvore de trabalho. Conferência local antes de qualquer push: `git ls-files --eol tracks/sources/kart-park.json src/tracks/kart-park-v1.json tracks/registry.json` → `attr/-text` nas três e `i/` = `w/` (hoje: `i/crlf w/crlf` na origem, `i/lf w/lf` nas outras duas) — `runbook.md`, *Promote* 1 |
| Regra de invalidação do `<sha>` | um commit posterior **não invalida** a release quando não muda a árvore construída (`src/`, `index.html`, `package.json`, `package-lock.json`, `tsconfig.json`, `vite.config.*`) nem os **bytes** dos três arquivos de pista — por exemplo, registros, testes de outra feature, ou atributos de git que deixem o resumo igual —, **desde que** a execução do workflow desse commit fique verde e `check_served.py` dê o mesmo resultado sobre o mesmo `<hash>`; qualquer outro commit invalida e pede veredito de testes novo e nova rodada deste estágio |
| Produção | `https://edumatosr6-svg.github.io/kartle/` responde **404**; `origin/master` = **`05c3570`** (2026-10-22); execução 39827702391 `pending` e as anteriores `cancelled`; nada aprovado. **Não promovível** enquanto a decisão Esri não existir (ADR-0005; NFR-0012) — `runbook.md`, *Promoção bloqueada* |
| Tag de release | não existe; a release é identificada pelo hash acima e pela execução 41109469203 |
| Sistema de CI | **GitHub Actions**, `.github/workflows/pages.yml` (inalterado): `npm ci` → `npm test` (444) → `npm run build -- --base=/<repo>/` → `measure_dist.py` (RNF02) → `upload-pages-artifact` → `deploy-pages`; etapas em `REL-0003` |
| Execução anterior e alvo de reversão | em staging, a execução verde **anterior** à 41109469203 é a **41101055606** (commit `6b314b2`, 2026-10-30T17:43:23Z, `success`, tentativa 1; *Test* 443/443; `index-BwruE9Pq.js`): o mesmo jogo **sem o crédito no painel do resultado** (DIV-DP-16, fechada nesta rodada) — por isso é alvo de reversão de emergência, não de qualidade equivalente. Antes dela, 41076989728 (`652bbaa`, treino de volta única com o crédito em `#lap-result`). Em produção não há execução verde (caminho A, nada a despublicar) |

### Precondições humanas que restam, em ordem

1. **Veredito de testes `SUCCESS` sobre `e70aad9`** (laço de testes em curso: CHK-TEST-0009-04 migrada, CHK-TEST-0009-11 nova).
2. **Validação de staging pelo validador** (`reports/deploy-validation/`) sobre a execução 41109469203.
3. **Registrar em `docs/kart-park-device-log.md` as execuções nos aparelhos de referência** — o arquivo **não existe** e este
   estágio não o cria (§14); é o dono do produto quem o cria, no molde de `docs/kart-01/device-log.md`, com as **oito linhas
   humanas H1–H8 do `runbook.md`** (E2E-01 a E2E-08 de `test-strategy.md`, com E2E-02 e E2E-03 no treino contínuo). As 22
   linhas de aparelho do veredito de testes dependem desse registro.
4. **A decisão Esri do dono do produto, registrada em `DOMAIN.md`** (identificador e data). Sem ela não há pergunta de promoção
   (D-DP-06 fica sem objeto; NFR-0012). Com ela, a promoção é de uma **entrega nova** que acrescenta o crédito da Esri
   (REQ-FEAT-0006-14; DES-0011) e grava `PRODUCTION` no registro.
5. **Enquanto 4 não existe**: decidir como as releases contidas chegam a produção (`runbook.md`, *Promoção bloqueada* (b)).

Cumpridas: a validação de código `SUCCESS` da rodada 4; o commit servido nomeado e construído pelo pipeline (41109469203, verde,
444/444); as duas ferramentas sem reprovação sobre o servido (79/79, 88/88); o arquivo da Kart Park servido igual ao registrado;
a regra byte-exata em vigor e conferível; o registro da pista em `STAGING`; o Node fixado (`.nvmrc` = `24`); os dois
repositórios configurados (D23); a vigilância manual, mantida.

## Reprodução do build

O workflow executa estes passos a cada push; à mão, da raiz do repositório, com caminhos entre aspas:

| Passo | Comando | Resultado esperado |
|---|---|---|
| 1 | `git ls-files --eol tracks/sources/kart-park.json src/tracks/kart-park-v1.json tracks/registry.json` | `attr/-text` nas três; `i/crlf w/crlf` na origem, `i/lf w/lf` nas outras duas |
| 2 | `npm ci` | saída 0; `package-lock.json` inalterado |
| 3 | `npm test` | saída 0; **444** aprovados, 0 reprovados, 0 pulados (103 desta feature, com CHK-TEST-0009-11) |
| 4 | `npm run track -- verify kart-park 1` | `VERIFIED`, V01 a V18 `PASS` (leitura; nada escrito) |
| 5 | `npm run build` (no workflow, `-- --base=/kartle/` ou `/kartle-staging/`) | saída 0; `dist/index.html`, `dist/assets/index-<hash>.js`, `dist/assets/index-<hash>.css`; nenhum outro arquivo em `dist/assets/` |
| 6 | `python -I "600 Deploy/Output/race-lap-validation/tools/measure_dist.py" dist` | `within_limit=True`; saída 0 (ferramenta da primeira release, a que o workflow chama) |
| 7 | `python -I "600 Deploy/Output/pista-kart-park/tools/check_bundle.py" dist tracks/registry.json` | `checks=88 failed=0` (1 `warn`) |
| 8 | `npm run preview` | `http://127.0.0.1:4173` serve o bundle; abre na Kart Park com o seletor e o crédito; "volta de treino" inicia a contagem sobre o asfalto da Kart Park |

### Medida real do artefato (execução 41109469203, base `/kartle-staging/`)

| Arquivo | bytes | gzip bytes |
|---|---:|---:|
| `assets/index-DmxsQuIL.js` | 694 178 | 183 635 |
| `assets/index-q-biCwua.css` | 10 850 | — |
| `index.html` | 6 592 | — |
| **total** (*Measure dist*) | **711 620** | **188 719** |

- Limite de RNF02 (download inicial abaixo de 3 145 728 bytes): **711 620 bytes brutos (22,6 % do limite)**; 188 719
  comprimidos (6,0 %). Contra o build de `6b314b2` (711 477 bytes): **+143 bytes** (o contêiner do crédito no painel e o seu
  desenho; a regra de CSS do link).
- O arquivo da Kart Park no bundle: **43 012 bytes** (o arquivo tem 43 013 com o `\n` final; o literal `?raw` omite-o) —
  NFR-0001 pede abaixo de 200 000; `SHA-256(literal + "\n")` = `04ce5e51…` = o registrado (NFR-0006).
- Os nomes dos *assets* carregam hash de conteúdo: o `index.html` publicado é o que aponta para a versão em vigor (`REL-0003`).

## O que o pipeline faz (`.github/workflows/pages.yml`)

Inalterado. Em ordem, com saída observável na execução do Actions: checkout do commit → Node da `.nvmrc` (24) com cache do npm →
`npm ci` → `npm test` (444 aprovados; inclui V01–V18 sobre o arquivo publicado, os resumos registrados contra os bytes do blob,
o crédito no painel do resultado e a prova de que `promote` recusa sem `--esri-decision`) → `npm run build -- --base=/kartle/`
(ou `/kartle-staging/`) → `measure_dist.py dist` (saída 0) → `configure-pages` → `upload-pages-artifact` de `dist/` → trabalho
`deploy` no ambiente `github-pages`. Em produção o `deploy` **espera a aprovação do revisor obrigatório** (D-DP-06) — e nesta
release **a aprovação não pode ser dada** antes da decisão Esri; em staging publica de imediato. Permissões mínimas, nenhum
segredo (I6). As ferramentas desta release (`tools/check_bundle.py`, `tools/check_served.py`) são executadas por quem valida e
pelo runbook, não pelo workflow (`98-divergences.md`, DIV-DP-05).

## Limitações conhecidas — divergências aceitas e herdadas

- As divergências aceitas pelo dono do produto em 2026-10-21 continuam válidas: o `href="/"` da marca e a requisição a
  `fonts.googleapis.com` no carregamento (DIV-DP-09, DIV-DP-10, `waived`).
- O crédito da **Esri** não está no bundle (0 ocorrências de `esri`), por projeto: entra na entrega que promover, se a decisão o
  liberar (NFR-0012, segunda linha; REQ-FEAT-0006-14).
- A poligonal da barreira alterna de direção a cada 0,1 m: o kart pode ricochetear em ângulos inesperados — observação de
  qualidade para o D-Spec, não defeito; a "sensação" da barreira é a linha H3 do `runbook.md`.
- Taxa de quadros, vibração, som e a legibilidade do crédito no painel durante a corrida não foram medidos em nenhum aparelho
  nomeado. São as linhas H3, H4, H5 e H6 do `runbook.md`.
- Staging serve, no mesmo bundle, as mudanças de `race-lap-validation`, `dirigibilidade` e `modelo-kart-01` da mesma data,
  cujas portas humanas são dos registros delas (`98-divergences.md`, DIV-DP-12).
