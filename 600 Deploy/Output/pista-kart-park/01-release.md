---
title: Release — pista Kart Park (staging; produção bloqueada pela decisão Esri)
feature: pista-kart-park
stage: deploy
status: draft
version: 1.1.0
sources: [DM-0001, DM-0002, DES-0001, DES-0002, DES-0003, DES-0004, DES-0005, DES-0006, DES-0007, DES-0008, DES-0009, DES-0010, DES-0011, DES-0012, ADR-0001, ADR-0002, ADR-0003, ADR-0004, ADR-0005, ADR-0006, ADR-0007, NFR-0001, NFR-0002, NFR-0003, NFR-0004, NFR-0005, NFR-0006, NFR-0007, NFR-0008, NFR-0009, NFR-0010, NFR-0011, NFR-0012, TEST-0001, TEST-0007, TEST-0008, TEST-0009, TEST-0012]
---

# 01 — Release

Candidato a release da feature `pista-kart-park`: a **Kart Park** (São José dos Pinhais, PR) como primeira pista real do Kartle,
jogável no **treino** ao lado da pista sintética — arquivo de pista em **esquema 3** (`src/tracks/kart-park-v1.json`, 43 013
bytes, 684 pontos, linha central suavizada com janela de 12 m a até 0,30 m da origem, 682,116 m medidos, rótulo "687 m",
38 marcadores, 34 zebras de 1,0 m, 1 barreira de 382 vértices, 3 limites de setor); o **seletor de pista** da tela inicial, que
abre sempre na Kart Park; o **crédito OpenStreetMap/ODbL** com link no seletor e no resultado de cada volta; a **zebra como
superfície** (aderência 0,85 do asfalto, vibração de 20 ms a cada 0,25 s no celular, ruído grave a 160 Hz no teclado com o som
ligado); a **barreira** com resposta de muro; o preparo offline e o registro de publicação (`npm run track`).

**O que muda nesta rodada (Modo B, 2026-10-30).** O registro passa do build de `5ed7a5b` (validado em
`reports/deploy-validation/deploy-validation-20261028-0008.md`) ao build de **`6b314b2`**, que staging serve hoje. O código
**desta feature** não mudou (nenhum commit em `src/trackGeometry.ts`, `src/trainingSession.ts`, `src/curbFeedback.ts`,
`src/trackScene.ts`, `src/trackData.ts`, `scripts/track*.ts`, `tracks/` nem `src/tracks/` desde `5ed7a5b`); mudou o que a
cerca: o **treino passou a ser uma sequência de voltas numa sessão** (`race-lap-validation`, `0c83ed9`: o resultado de cada volta
aparece num painel da tela de corrida, `#lap-training-result`, sem parar o kart; a volta inválida é marcada e segue; "encerrar
treino" volta ao seletor; `#lap-result` fica só para volta oficial e de reconhecimento), o acerto publicado passou a
`arcade-assistido-v6` sem drift nem turbo (`dirigibilidade`, `cfad3dc` e `f6e2d16`) e o Kart 01 ganhou marcas de pneu
(`modelo-kart-01`, `aeaf504`). O D-Spec desta feature foi alinhado ao treino contínuo (`2da9eb8`, 2026-10-30: DES-0004, DES-0005,
DES-0007 e **ADR-0007** — o crédito do resultado passa a `#lap-training-result-credit`, dentro do painel do resultado da volta do
treino, e `#lap-result-credit` sai de `#lap-result`) e os testes desta feature foram revalidados (102 verificações). **O build
servido não realiza ADR-0007** (`98-divergences.md`, DIV-DP-16): ver *Proveniência*.

O que se entrega é o mesmo tipo de artefato das releases anteriores (`race-lap-validation`, `dirigibilidade`, `modelo-kart-01`):
um **artefato estático** (`dist/`, HTML + JS + CSS) servido pelo **GitHub Pages** com HTTPS (D23); **não há servidor, banco,
serviço, migração de dado, armazenamento no navegador nem aplicativo nativo** — o arquivo de pista vai **dentro do JS** como
literal (ADR-0002), não como recurso servido à parte.

**O que esta release não faz: ir a produção.** A Kart Park é derivada de um caminho OpenStreetMap e de bordas detectadas em
imagem **Esri World Imagery** (seed, *Origem*), e a dúvida sobre a licença desse dado derivado **bloqueia só a promoção para
produção** (`DOMAIN.md`, o ponto Esri de 2026-10-22, ainda sem decisão; NFR-0012; ADR-0005). `tracks/registry.json` tem a entrada
`kart-park` 1 em `STAGING`; `npm run track -- promote` recusa sem `--esri-decision` (`scripts/track-pipeline.ts:40-62`,
`:151-160`; CHK-TEST-0012-04). O `runbook.md` termina, por isso, **antes** da pergunta de promoção.

## O que é entregue

| Item | Conteúdo | Fonte |
|---|---|---|
| Canais | `web-desktop` e `web-mobile` — a mesma página, com teclado no computador (som da zebra) e inclinação ou toque no celular (vibração da zebra); paisagem e retrato | diretivas do estágio; `REL-0004` |
| Arquivos de origem desta feature | os da rodada 1, **inalterados desde `1a12076`**: novos `src/trackGeometry.ts`, `src/trainingSession.ts`, `src/curbFeedback.ts`, `src/trackScene.ts`, `src/rawImports.d.ts`, `src/tracks/kart-park-v1.json`, `scripts/trackPrep.ts`, `scripts/trackChecks.ts`, `scripts/track-pipeline.ts`, `tracks/sources/kart-park.json`, `tracks/registry.json`; alterados `src/trackData.ts`, `src/physics.ts`, `src/lap.ts`, `src/lapMessages.ts`, `src/audio.ts`, `src/main.ts`, `index.html`, `src/style.css`, `package.json` (script `track`); `.gitattributes` (`5ed7a5b`, regra byte-exata abaixo); `tests/pista-kart-park-*.test.ts` (12 suítes, 102 verificações, revalidadas em `1254443`) | `400 Code/Output/pista-kart-park/01-implementation.md` 1.2.0; `500 Tests/Output/pista-kart-park/` |
| Contido no mesmo build, de outras features | o treino de voltas seguidas (`race-lap-validation`, `0c83ed9`: `#lap-training-result`, `#lap-best-valid`, `#lap-end-training`; `#lap-result` só para oficial e reconhecimento); `arcade-assistido-v6` sem drift nem turbo, `#lap-result-setup` e o HUD de drift retirados (`dirigibilidade`, `cfad3dc`, `f6e2d16`); marcas de pneu e câmera sem turbo (`modelo-kart-01`, `aeaf504`). Cada uma tem o seu registro de release | registros de release dessas features |
| Inalterados | `.github/workflows/pages.yml`, `.nvmrc`, `package-lock.json`, `tsconfig.json`; dependências de execução: **nenhuma acrescentada** (`three` continua a única — NFR-0010) | `git diff --stat 5ed7a5b 6b314b2` sobre esses caminhos: vazio |
| Formato publicado | **o arquivo de pista em esquema 3** com o leitor da versão 2 mantido; `kart-park` **versão 1**, imutável, SHA-256 `04ce5e51…` em `tracks/registry.json` (NFR-0006; D-DP-01) — o mesmo blob desde `d9139a2` | DM-0001, DM-0002, ADR-0001; `REL-0002` |
| Formato persistido | **nenhum**: a pista escolhida não é gravada nem lida no navegador; nenhuma volta de treino cria registro de desafio (DES-0012; CHK-TEST-0011-02) | DES-0012; `REL-0002` |
| Feature flag | **nenhuma** (ADR-0005). O ponto de aplicação da "chave mestra" de I4 é a **promoção**: humano, registrado em `tracks/registry.json` e bloqueado pela decisão Esri | ADR-0005, DES-0011 |
| Variáveis de ambiente | nenhuma lida pelo cliente, pelo preparo offline ou pelo workflow | `REL-0001` |
| O que o jogador vê | ao abrir, o seletor com "Kart Park — São José dos Pinhais (traçado aproximado) · 687 m" marcada e "Pista sintética"; a linha "© colaboradores do OpenStreetMap · licença ODbL · openstreetmap.org/copyright" (link em outra aba); `#track-status` `kart-park`; a Kart Park desenhada com o Kart 01 na largada; a única oferta "volta de treino". No treino, as voltas seguem-se sem parar o kart: o resultado de cada volta (validade, motivo, total, 4 setores, "não oficial") aparece no painel `#lap-training-result` e — **pelo projeto validado (ADR-0007)** — com o crédito OSM dentro dele; "encerrar treino" volta ao seletor; zebra com vibração e som; a barreira bate e não deixa passar; o recorde real de 41,45 s **não** aparece | DES-0005, DES-0007, DES-0008, DES-0009, ADR-0007; `REL-0003` |

## Proveniência — o commit que a release nomeia

| Fato | Estado em 2026-10-30 |
|---|---|
| Veredito de testes | `SUCCESS` — `500 Tests/Output/pista-kart-park/reports/test-validation/test-validation-20261030-1714.md` (rodada 3, revalidação após o treino de voltas seguidas, o acerto v6 e a retirada do drift/turbo): execução de 14:09:29 −03:00, posterior à última edição de `src/` (13:46:48) e das suítes da feature; **102 de 102** verificações desta feature aprovadas; 437 coletadas, 432 aprovadas, 5 reprovadas — todas de `modelo-kart-01`, migradas depois em `6b314b2`; `fresh: true`; `seed: {revision: 1, digest: b5aa5be4734a}`; 22 divergências de aparelho (DIV-01..22), nenhuma no veredito; avisos ISSUE-06 (estratégia AC-US-0003-06) e ISSUE-07 (leitor de importações de efeito colateral) para as próximas rodadas do D-Spec e dos testes. O veredito vive no commit `1254443` (2026-10-30T14:21:44 −03:00) |
| Commit verificado (`<sha>`) | **`6b314b2193c25cd6384a3f64cffdc369637b3753`** (curto `6b314b2`), 2026-10-30T14:43:19 −03:00, "modelo-kart-01: testes migrados para o seed rev 4 … — 443/443": o commit que staging serve. Contra `1254443` (o do veredito desta feature) muda só `tests/modelo-kart-01-*.test.ts`, `tests/helpers/kart01Report.ts` e registros de `modelo-kart-01` — nenhum arquivo de `src/`, `index.html`, `scripts/`, `tracks/`, `package.json` nem do lockfile —, por isso o bundle é o mesmo e o `npm test` do workflow cobre as 102 verificações desta feature. Cadeia (NFR-0011): `b86b200` e `6ea3862` são ancestrais de `6b314b2` (`git merge-base --is-ancestor`, leitura). A ponta de `master` hoje é `483c5fa` (só registro de `modelo-kart-01`) |
| Construído pelo pipeline | **sim, observado** (`gh run view`, só leitura): execução **41101055606** de `edumatosr6-svg/kartle-staging`, evento `push`, `head_sha` `6b314b2…`, criada 2026-10-30T17:43:23Z, tentativa 1, `success`; `build` 17:43:26–17:47:57Z (Node v24.22.1; *Test* `tests 443 / pass 443 / fail 0`; *Build* `dist/assets/index-BwruE9Pq.js 694.09 kB`, `index-oR7KyBh_.css 10.80 kB`; *Measure dist* `files=3 total_bytes=711477 gzip_bytes=188682 within_limit=True ratio=0.226`); `deploy` 17:48:00–17:48:12Z `success` |
| Servido em staging | `https://edumatosr6-svg.github.io/kartle-staging/` com `Last-Modified: Fri, 30 Oct 2026 17:48:06 GMT`, `Cache-Control: max-age=600`: `index.html` 6 583 bytes (sha256 `92f2091e…`), `assets/index-BwruE9Pq.js` 694 094 bytes (`023fb54b…`; 183 602 gzip), `assets/index-oR7KyBh_.css` 10 800 bytes (`dd4e4455…`) — total **711 477 bytes**, igual ao *Measure dist* da execução. A prova byte a byte contra um build limpo de `6b314b2` é do validador (como na rodada anterior) |
| Arquivo da Kart Park servido = registro | **sim**: `check_served.py` e `check_bundle.py` (sobre o artefato servido) extraem o literal (43 012 bytes) e dão SHA-256 + LF = `04ce5e510410e297764c047739422b07d46290c70eade1c1fb5bb7d120f057b1` = `tracks/registry.json` entrada `kart-park` 1 (`fileBytes` 43 013, `STAGING`, `stagedAtUtc` 2026-10-27T21:58:06.132Z, sem `promotedAtUtc`/`esriDecisionRef`); blobs em `6b314b2` iguais aos de `5ed7a5b`: `src/tracks/kart-park-v1.json` `a1f57085…`, `tracks/registry.json` `cfdeec07…` (sha256 `d6303d0a…`), `tracks/sources/kart-park.json` `d5ee2187…` (sha256 `52c5adda…`, CRLF — o `prep.originSha256` do registro) |
| Ferramentas sobre o servido | `check_served.py … index-BwruE9Pq.js`: **`checks=79 failed=4`**; `check_bundle.py` sobre o artefato servido (baixado para fora da árvore) e o registro de `6b314b2`: **`checks=88 failed=4`** (1 `warn`: `fetch(` do polyfill de `modulepreload`). As **4 reprovações, nas duas ferramentas, são as de ADR-0007**: não há `#lap-training-result-credit` em `#lap-training-result` nem no JS, e `#lap-result-credit` continua no HTML e no JS (`src/main.ts:509`, `renderResult`); `renderTrainingResult` (`src/main.ts:460-482`) desenha o painel sem crédito. Todas as demais passam: HTTPS, um JS e um CSS sob `/kartle-staging/`, `<hash>` esperado, o arquivo da Kart Park byte a byte, 684/38/34/3/1, textos do seletor e do crédito, `vibrate(20)`, `lowpassHz:160`, malhas, 0 `esri`/`41.45`/`recorde`, `arcade-assistido-v6`, elementos do treino contínuo, tamanhos |
| Lacuna de aplicação (DIV-DP-16) | **a volta de treino na Kart Park mostra o resultado sem o crédito OSM** (AC-US-0006-04..06; D-DP-04): o D-Spec revalidado (ADR-0007, DES-0007, `test-strategy.md` linha de AC-US-0006-04) pede o crédito no painel e a retirada de `#lap-result-credit`; o código desta feature não teve rodada depois de `2da9eb8` (última: `1a12076`, 2026-10-27) e CHK-TEST-0009-04 continua a afirmar o elemento antigo (`tests/pista-kart-park-screens.test.ts:47-56`) — a migração que o changelog do D-Spec planejou não foi feita (`checks: {migrated: 0}` no veredito). É defeito de aplicação, não de empacotamento: o caminho é a rodada de código desta feature (ADR-0007) e a migração de CHK-TEST-0009-04, depois nova rodada deste estágio |
| Regra byte-exata dos arquivos de pista | os três arquivos cujo resumo o registro guarda vivem no git **sem normalização de fim de linha** (`.gitattributes`, `5ed7a5b`: `tracks/sources/*.json -text`, `src/tracks/*.json -text`, `tracks/registry.json -text`); o resumo registrado é o dos **bytes do blob**, não o da árvore de trabalho (a falha da execução 40603572961 de `d9139a2` foi o `autocrlf` normalizar a origem CRLF). Conferência local antes de qualquer push: `git ls-files --eol tracks/sources/kart-park.json src/tracks/kart-park-v1.json tracks/registry.json` → `attr/-text` nas três e `i/` = `w/` (hoje: `i/crlf w/crlf` na origem, `i/lf w/lf` nas outras duas) — `runbook.md`, *Promote* 1 |
| Regra de invalidação do `<sha>` | um commit posterior **não invalida** a release quando não muda a árvore construída (`src/`, `index.html`, `package.json`, `package-lock.json`, `tsconfig.json`, `vite.config.*`) nem os **bytes** dos três arquivos de pista (blob e resumo registrado iguais) — por exemplo, registros, testes de outra feature, ou atributos de git que deixem o resumo igual —, **desde que** a execução do workflow desse commit fique verde (o seu `npm test` é a reconferência) e `check_served.py` dê o mesmo resultado sobre o mesmo `<hash>`; qualquer outro commit invalida e pede veredito de testes novo e nova rodada deste estágio |
| Produção | `https://edumatosr6-svg.github.io/kartle/` responde **404**; `origin/master` = **`05c3570`** (2026-10-22); execução 39827702391 `pending` e as anteriores `cancelled`; nada aprovado. **Não promovível** enquanto a decisão Esri não existir (ADR-0005; NFR-0012) — `runbook.md`, *Promoção bloqueada* |
| Tag de release | não existe; a release é identificada pelo hash acima e pela execução 41101055606 |
| Sistema de CI | **GitHub Actions**, `.github/workflows/pages.yml` (inalterado): `npm ci` → `npm test` (443) → `npm run build -- --base=/<repo>/` → `measure_dist.py` (RNF02) → `upload-pages-artifact` → `deploy-pages`; etapas em `REL-0003` |
| Execução anterior e alvo de reversão | em staging, a execução verde **anterior** à 41101055606 é a **41076989728** (commit `652bbaa`, 2026-10-30T15:02:21Z, `success`, tentativa 1; *Test* 393/393; `index-dD_vz2Ev.js` 691,31 kB e `index-CW8t98so.css` 10,78 kB): a Kart Park com o treino de volta única e o crédito em `#lap-result`, `arcade-assistido-v6`, sem drift. `652bbaa` é o merge que registra no histórico a prévia `?acerto=` (`2f3dfab`, só staging, execução 40987575935) sem trazer o código dela. Antes dela: 40607336550 (`3f1ced3`, registro) e 40606152700 (`5ed7a5b`, validada em 2026-10-28). Em produção não há execução verde (caminho A, nada a despublicar) |

### Precondições humanas que restam, em ordem

1. **Fechar DIV-DP-16** (rodada de código desta feature para ADR-0007 e migração de CHK-TEST-0009-04; novo push a staging; nova
   rodada deste estágio). Até lá, a validação de staging deste registro deve reprovar como `FAIL CODE` nas 4 linhas de ADR-0007.
2. **Validação de staging pelo validador** (`reports/deploy-validation/`) sobre o build que realizar ADR-0007.
3. **Registrar em `docs/kart-park-device-log.md` as execuções nos aparelhos de referência** — o arquivo **não existe** e este
   estágio não o cria (§14); é o dono do produto quem o cria, no molde de `docs/kart-01/device-log.md`, com as **oito linhas
   humanas H1–H8 do `runbook.md`** (E2E-01 a E2E-08 de `test-strategy.md`, com E2E-02 e E2E-03 no treino contínuo). As 22
   linhas de aparelho do veredito de testes dependem desse registro.
4. **A decisão Esri do dono do produto, registrada em `DOMAIN.md`** (identificador e data). Sem ela não há pergunta de promoção
   (D-DP-06 fica sem objeto; NFR-0012). Com ela, a promoção é de uma **entrega nova** que acrescenta o crédito da Esri
   (REQ-FEAT-0006-14; DES-0011) e grava `PRODUCTION` no registro.
5. **Enquanto 4 não existe**: decidir como as releases contidas chegam a produção (`runbook.md`, *Promoção bloqueada* (b)).

Cumpridas: o veredito de testes `SUCCESS` (102/102); o commit servido nomeado e construído pelo pipeline (41101055606, verde,
443/443); o arquivo da Kart Park servido igual ao registrado; a regra byte-exata em vigor e conferível; o registro da pista em
`STAGING`; o Node fixado (`.nvmrc` = `24`); os dois repositórios configurados (D23); a vigilância manual, mantida.

## Reprodução do build

O workflow executa estes passos a cada push; à mão, da raiz do repositório, com caminhos entre aspas:

| Passo | Comando | Resultado esperado |
|---|---|---|
| 1 | `git ls-files --eol tracks/sources/kart-park.json src/tracks/kart-park-v1.json tracks/registry.json` | `attr/-text` nas três; `i/crlf w/crlf` na origem, `i/lf w/lf` nas outras duas |
| 2 | `npm ci` | saída 0; `package-lock.json` inalterado |
| 3 | `npm test` | saída 0; **443** aprovados, 0 reprovados, 0 pulados (102 desta feature) |
| 4 | `npm run track -- verify kart-park 1` | `VERIFIED`, V01 a V18 `PASS` (leitura; nada escrito) |
| 5 | `npm run build` (no workflow, `-- --base=/kartle/` ou `/kartle-staging/`) | saída 0; `dist/index.html`, `dist/assets/index-<hash>.js`, `dist/assets/index-<hash>.css`; nenhum outro arquivo em `dist/assets/` |
| 6 | `python -I "600 Deploy/Output/race-lap-validation/tools/measure_dist.py" dist` | `within_limit=True`; saída 0 (ferramenta da primeira release, a que o workflow chama) |
| 7 | `python -I "600 Deploy/Output/pista-kart-park/tools/check_bundle.py" dist tracks/registry.json` | `checks=88 failed=0` quando ADR-0007 estiver realizado; com `6b314b2`, `failed=4` (as linhas de ADR-0007 — DIV-DP-16) |
| 8 | `npm run preview` | `http://127.0.0.1:4173` serve o bundle; abre na Kart Park com o seletor e o crédito; "volta de treino" inicia a contagem sobre o asfalto da Kart Park |

### Medida real do artefato (execução 41101055606, base `/kartle-staging/`)

| Arquivo | bytes | gzip bytes |
|---|---:|---:|
| `assets/index-BwruE9Pq.js` | 694 094 | 183 602 |
| `assets/index-oR7KyBh_.css` | 10 800 | — |
| `index.html` | 6 583 | — |
| **total** (*Measure dist*) | **711 477** | **188 682** |

- Limite de RNF02 (download inicial abaixo de 3 145 728 bytes): **711 477 bytes brutos (22,6 % do limite)**; 188 682
  comprimidos (6,0 %). Contra o build validado de `5ed7a5b` (713 351 bytes): **−1 874 bytes** — o HUD e o guia do drift saem do
  HTML e do CSS; o JS cresce 38 bytes (treino contínuo e marcas de pneu menos o drift).
- O arquivo da Kart Park no bundle: **43 012 bytes** (o arquivo tem 43 013 com o `\n` final; o literal `?raw` omite-o) —
  NFR-0001 pede abaixo de 200 000; `SHA-256(literal + "\n")` = `04ce5e51…` = o registrado (NFR-0006).
- Os nomes dos *assets* carregam hash de conteúdo: o `index.html` publicado é o que aponta para a versão em vigor (`REL-0003`).

## O que o pipeline faz (`.github/workflows/pages.yml`)

Inalterado. Em ordem, com saída observável na execução do Actions: checkout do commit → Node da `.nvmrc` (24) com cache do npm →
`npm ci` → `npm test` (443 aprovados; inclui V01–V18 sobre o arquivo publicado, os resumos registrados contra os bytes do blob e
a prova de que `promote` recusa sem `--esri-decision`) → `npm run build -- --base=/kartle/` (ou `/kartle-staging/`) →
`measure_dist.py dist` (saída 0) → `configure-pages` → `upload-pages-artifact` de `dist/` → trabalho `deploy` no ambiente
`github-pages`. Em produção o `deploy` **espera a aprovação do revisor obrigatório** (D-DP-06) — e nesta release **a aprovação não
pode ser dada** antes da decisão Esri; em staging publica de imediato. Permissões mínimas, nenhum segredo (I6). As ferramentas
desta release (`tools/check_bundle.py`, `tools/check_served.py`) são executadas por quem valida e pelo runbook, não pelo workflow
(`98-divergences.md`, DIV-DP-05).

## Limitações conhecidas — divergências aceitas e herdadas

- **O crédito OSM não aparece no resultado de uma volta de treino na Kart Park** no build de `6b314b2` (DIV-DP-16): aparece no
  seletor (`#track-credit`); o elemento do resultado (`#lap-result-credit`) ficou em `#lap-result`, que o treino contínuo não
  exibe. Defeito de aplicação contra ADR-0007; bloqueia a validação deste registro.
- As divergências aceitas pelo dono do produto em 2026-10-21 continuam válidas: o `href="/"` da marca e a requisição a
  `fonts.googleapis.com` no carregamento (DIV-DP-09, DIV-DP-10, `waived`).
- O crédito da **Esri** não está no bundle (0 ocorrências de `esri`), por projeto: entra na entrega que promover, se a decisão o
  liberar (NFR-0012, segunda linha; REQ-FEAT-0006-14).
- A poligonal da barreira alterna de direção a cada 0,1 m: o kart pode ricochetear em ângulos inesperados — observação de
  qualidade para o D-Spec, não defeito; a "sensação" da barreira é a linha H3 do `runbook.md`.
- Taxa de quadros, vibração e som não foram medidos em nenhum aparelho nomeado. São as linhas H3, H4, H5 e H6 do `runbook.md`.
- Staging serve, no mesmo bundle, as mudanças de `race-lap-validation`, `dirigibilidade` e `modelo-kart-01` da mesma data,
  cujas portas humanas são dos registros delas (`98-divergences.md`, DIV-DP-12).
