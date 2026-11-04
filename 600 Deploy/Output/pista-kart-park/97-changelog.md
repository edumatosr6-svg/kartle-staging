---
title: Registro de mudanças — pista Kart Park (estágio de deploy)
feature: pista-kart-park
stage: deploy
status: validated
version: 1.4.0
sources: []
---

# Registro de mudanças

## 2026-10-27 — rodada 1, Modo A (nenhum registro de release existia)

**Entradas lidas** (lista fechada do estágio, §12): `400 Code/Output/pista-kart-park/01-implementation.md` 1.2.0 e
`98-divergences.md` (linhas 2 e 13); `500 Tests/Output/pista-kart-park/98-divergences.md` 1.0.0 e
`reports/test-validation/test-validation-20261027-2333.md` (`SUCCESS`, 398/398, 22 divergências); `300 Specs/330 D-Specs/Output/
pista-kart-park/test-strategy.md` (roteiro E2E-01 a E2E-08 e a tabela de critérios), ADR-0005 (sem chave; promoção bloqueada),
DES-0011 (verificações, registro, `promote`), DES-0012 (privacidade, rede, crédito, licença), DES-0010 (regra de
`--esri-decision`), DM-0002 (registro); `200 Requirements/230 Output/pista-kart-park/nfr/` (NFR-0001 a NFR-0012, títulos; NFR-0001,
NFR-0002, NFR-0004, NFR-0005, NFR-0012 por inteiro); `200 Requirements/220 Input/pista-kart-park/DOMAIN.md` (decisões de
2026-10-22: licença, crédito, ponto Esri) e `SEED.md` (origem do traçado: caminho OSM e bordas em imagem Esri World Imagery);
`600 Deploy/Input/domain-directives.md`; o registro validado da release anterior (`600 Deploy/Output/modelo-kart-01/`, incluindo
`reports/deploy-validation/deploy-validation-20261027-2057.md` para o número da execução 40579585592 e o ensaio de reversão) como
molde; `.github/workflows/pages.yml`, `.nvmrc`, `package.json` (scripts), `tracks/registry.json`, `index.html` (ids),
`src/trainingSession.ts:9-16`, `src/lapMessages.ts:80-93`, `src/curbFeedback.ts:5-9`, `src/audio.ts:8`, `src/main.ts` (linhas
do crédito, do seletor, do `vibrate` e da abertura), `scripts/track-pipeline.ts` (linhas de `promote` e de `--esri-decision`),
`docs/kart-01/device-log.md` (cabeçalhos, como molde do registro a criar). `.git/refs/heads/master`,
`.git/refs/remotes/staging/staging`, `.git/refs/remotes/origin/master` e `.git/logs/HEAD` foram lidos como arquivos para obter os
hashes e os horários; nenhum comando `git` foi executado. O JS de `dist/` foi sondado por contagens de marcadores (nunca corpos)
e o arquivo de pista nele embutido foi extraído por um decodificador JSON e comparado por SHA-256 com o registro.

**Fatos apurados** (sem executar nada no GitHub além de GET de leitura às duas URLs): a ponta de `master` é
`d9139a21f833e4e2ee72a6d9b58322ce77ae4564` (23:39:01Z) e o remoto `staging` aponta para o mesmo hash (push às 23:39:04Z);
`origin/master` continua em `05c3570` (nada desta nem das duas releases anteriores foi enviado a produção; a URL de produção
responde 404); o `dist/` local de 23:24:33Z tem `index-DYFBop8t.js` (694 056 bytes), `index-Dv0Dz75T.css` (11 890) e
`index.html` (7 375), total 713 321 bytes (189 855 gzip), `within_limit=True`, o mesmo `<hash>` que o manifesto de código nomeia
para a rodada 3; o arquivo da Kart Park está no JS **uma vez**, como literal de 43 012 bytes (o arquivo tem 43 013 com o `\n`
final) cujo SHA-256 com o `\n` é exatamente o registrado em `tracks/registry.json` (`04ce5e51…`, `STAGING`); o JS não contém
`esri`, `41.45`, `41,45`, `41450`, `KARTPLAN`, `recorde`, `Circuito Aurora`, `helmet` nem `boxGeo`; às 23:46Z
`https://edumatosr6-svg.github.io/kartle-staging/` ainda servia `index-D0RarhFV.js` (`Last-Modified` 20:37:38Z) — a execução do
push de `d9139a2` estava em curso ou o cache de borda ainda não tinha trocado; `docs/kart-park-device-log.md` não existe;
`docs/kart-01/device-log.md` continua "Não executadas" e `docs/handling-device-log.md` continua a não existir.

**O que foi escrito**

- `01-release.md`: o que é entregue (Kart Park esquema 3 no bundle, seletor, crédito, zebra, barreira; nenhuma mudança nos
  presets nem no contrato de passo), **o que não é entregue** (produção, pela decisão Esri), a proveniência (`d9139a2`, veredito
  398/398, build local medido e conferido, staging em curso, produção 404 com `origin/master` em `05c3570`), as quatro
  precondições humanas que restam, a reprodução do build com as ferramentas desta release e a medida real do artefato
  (+63 403 bytes contra a release anterior, 22,7 % do limite; o literal da pista com 43 012 bytes).
- `REL-0001-config.md` (nenhuma variável; o catálogo, o crédito e as constantes da zebra são dado em código; `--esri-decision` é
  referência a uma decisão, não segredo), `REL-0002-migration.md` (esquema 3 com o leitor do 2 mantido; nada persistido muda;
  versão publicada imutável; a "revisão 3" — `promote` — não faz parte desta release), `REL-0003-rollout.md` (sequência que
  para em staging; o passo de produção descrito como o que não fazer; alvo B em staging = 40579585592; riscos, inclusive a
  promoção indevida), `REL-0004-mobile.md` (sem app nativo; vibração de 20 ms a cada 0,25 s, navegador sem `navigator.vibrate`,
  inclinação negada, 30 fps nas duas orientações), `REL-0005-observability.md` (nada sai do navegador; `console.warn('track-data')`
  único registro; métricas por requisito, inclusive a prova verificável de "não promovido" — o registro sem `PRODUCTION` e
  `check_served.py` a reprovar em produção; modos de falha novos, a começar pela promoção sem decisão).
- `smoke.md`: **30 verificações** — 18 em `web-desktop` (D1–D18) e 12 em `web-mobile` (M1–M12), cada uma com o limiar observado
  (NFR-0001, NFR-0002, NFR-0004, NFR-0005, NFR-0006, NFR-0008, NFR-0010, NFR-0012, RNF01, RNF02, RNF06, D-DP-04, DES-0012 e os
  critérios AC-US-0001-01/-02/-05, AC-US-0002-08, AC-US-0003-06/-11, AC-US-0004-04/-06, AC-US-0005-03/-07..-12,
  AC-US-0006-01..09, REQ-FEAT-0001-13, REQ-FEAT-0003-15, REQ-FEAT-0005-16..19, REQ-FEAT-0006-12, mais a regressão da
  sintética); a seção *Verificação em produção* declarada **não aplicável** nesta release; `check_served.py` como preparação comum.
- `runbook.md`: precondições (16; 4 por marcar: validação de staging, registro em tela H1–H8, **decisão Esri registrada**,
  portas humanas das releases contidas), promover **até staging** (11 passos; o 11 é "parar"), a lista do que **não fazer**, a
  seção *Promoção bloqueada* (por quê; a evidência que a decisão exige — termos de uso da Esri para dado derivado do World
  Imagery, a permissão de traçado no OSM e o seu alcance, a proveniência do arquivo de origem, o texto de crédito; os três
  desfechos; e as **duas opções** para `dirigibilidade` e o Kart 01 chegarem a produção entretanto: esperar, ou
  `git push origin 6ea3862:master` sem `--force` e aprovar aquela execução, mantendo `origin/master` em `6ea3862`), verificar (13),
  **linhas humanas H1–H8** (seletor/abertura/crédito/armazenamento; troca de pista; volta completa com desenho, corte, barreira,
  foco, recarga e 60 fps; som da zebra em Chrome e Firefox; celular com inclinação negada, vibração, 30 fps e resultado;
  navegador sem vibração e download; rede bloqueada; navegador em inglês — roteiros E2E-01 a E2E-08, 22 linhas do veredito de
  testes; registradas em `docs/kart-park-device-log.md`, **que o dono do produto cria**), reverter (5), gatilhos de reversão em
  staging e o gatilho em produção (qualquer aprovação com a feature), ponto sem retorno.
- `tools/check_bundle.py` (83 verificações sobre `dist/` e `tracks/registry.json`: um JS e um CSS e nada mais; o arquivo da Kart
  Park uma vez no JS, JSON legível, SHA-256 + LF e bytes iguais ao registro, estado `STAGING`, chaves de DM-0001, 684/38/34/3/1
  (382), abaixo de 200 000 bytes; textos do seletor e do crédito; `vibrate(20)`, `lowpassHz:160`, fonte `noise`,
  `curbWheelCount`, `barrierContact`/`barrierTouching`; malhas; nenhum `esri`/`41.45`/`41,45`/`41450`/`KARTPLAN`/`recorde`/
  `Circuito Aurora`/`helmet`/`boxGeo`/`XMLHttpRequest`/`sendBeacon`; releases anteriores; elementos do HTML; classes do CSS;
  armazenamento e `fetch(` como `warn`; tamanhos; opcionalmente o registro em tela — executado: **83/83**, 1 `warn`) e
  `tools/check_served.py` (74 verificações sobre a página servida, três GET de leitura; executado contra staging às 23:46Z:
  `65 checks, 28 failed` sobre o bundle anterior ainda servido — as 28 linhas da Kart Park, como esperado — e a ferramenta de
  `modelo-kart-01` 37/37 sobre o mesmo; esperado 74/74 quando a execução de `d9139a2` publicar). Copiados e adaptados dos da
  `modelo-kart-01`; `measure_dist.py` da primeira release reutilizado por referência (é o que o workflow chama).
- `98-divergences.md`: 15 linhas — 7 `open` (DIV-DP-01 registro em tela por criar e preencher, H1–H8; DIV-DP-03 caminho B não
  repetido para este par; DIV-DP-04 execução de staging de `d9139a2` por confirmar; DIV-DP-05 `check_bundle.py` fora do workflow,
  `info`; DIV-DP-07 RNF01 e NFR-0002 não medidos; DIV-DP-12 portas humanas das releases contidas; DIV-DP-15 caminho das
  releases contidas a produção), 1 **`blocked`** (DIV-DP-14 promoção bloqueada pela decisão Esri), 4 `resolved` (inclusive
  DIV-DP-11: o crédito OSM/ODbL passa a exigido e está no bundle), 3 `waived` herdadas das decisões de 2026-10-21. `00-index.md`
  emitido por `lint_artifacts.py --emit` (gate: 0 erros, 0 avisos sobre 10 arquivos).
- Nada foi executado contra produção; nenhum push, nenhuma reexecução, nenhuma chamada à API do GitHub; nenhum valor de
  segredo escrito; `.github/`, `src/`, `scripts/`, `tests/`, `tracks/`, `docs/` e as pastas de outras features não foram tocados
  (§14). `docs/kart-park-device-log.md` **não** foi criado: é nomeado para o dono do produto.

**Itens fechados**: nenhum relatório anterior.

**Itens que ficam abertos, com o que os fecha**: DIV-DP-01 (dono do produto: criar `docs/kart-park-device-log.md` e registrar
H1–H8 em staging); DIV-DP-03 (validador ou dono do produto: reexecutar 40579585592 e depois a execução de `d9139a2`, com
`check_served`); DIV-DP-04 (validador: confirmar a execução de `d9139a2` em staging e 74/74); DIV-DP-05 (decisão do dono do
produto; `info`); DIV-DP-07 (junta-se à DIV-DP-01); DIV-DP-12 (decisão do dono do produto: fechar as portas humanas das três
releases sobre este bundle com "Pista sintética", ou medi-las isoladas reexecutando 40579585592); DIV-DP-14 (dono do produto: a
decisão Esri em `DOMAIN.md`); DIV-DP-15 (dono do produto: opção 1 ou 2 para `dirigibilidade` e o Kart 01).

**Itens recusados**: nenhum.

## 2026-10-30 — rodada 2, Modo B (registro atualizado ao build de `6b314b2` servido em staging)

**Entradas lidas** (§12): `reports/deploy-validation/deploy-validation-20261028-0008.md` (`SUCCESS`, ISSUE-01..05);
`500 Tests/Output/pista-kart-park/reports/test-validation/test-validation-20261030-1714.md` (`SUCCESS`, 102/102, rodada 3);
`300 Specs/330 D-Specs/Output/pista-kart-park/` ADR-0007, DES-0007 (linhas de `#lap-training-result-credit`), `test-strategy.md`
(AC-US-0003-06, -11, AC-US-0006-04..06, E2E-*) e `97-changelog.md` (rodada de 2026-10-30); `200 Requirements/220 Input/pista-kart-park/DOMAIN.md`
(o ponto Esri de 2026-10-22, sem decisão). Leituras de verificação, só leitura: `git log`/`git diff --stat`/`git rev-parse`/`git ls-files --eol`/`git
merge-base --is-ancestor`/`git show` de blobs de pista; `gh run list`/`gh run view` (e o log reduzido por `grep` a contagens, nomes
de *assets* e a linha de *Measure dist*) das execuções 41101055606 e 41076989728 em `kartle-staging` e da lista de `kartle`; GET da
URL de staging (as duas ferramentas) e da de produção (404); o artefato servido baixado para o diretório temporário da sessão,
fora da árvore, para `check_bundle.py`; `index.html`, `src/main.ts` (`renderCredit`, `renderTrainingResult`, `renderResult`,
`vibrate`), `src/lapMessages.ts` (`describeTrainingResult`, `OSM_CREDIT`), `tests/pista-kart-park-screens.test.ts:47-56`, `.gitattributes`.

**Mudanças**
- `01-release.md` 1.1.0: `<sha>` = `6b314b2193c25cd6384a3f64cffdc369637b3753` (servido pela execução 41101055606, verde, 443/443,
  `index-BwruE9Pq.js`, 711 477 bytes); o veredito desta feature vive em `1254443` e `6b314b2` difere dele só em testes e registros
  de `modelo-kart-01`; o que o mesmo build traz de outras features (treino contínuo, acerto v6 sem drift, marcas de pneu); a regra
  byte-exata (`.gitattributes` `-text`, resumo = bytes do blob, `git ls-files --eol`); a regra de invalidação do `<sha>`
  reescrita; medidas do artefato servido; alvo de reversão 41076989728 (`652bbaa`); a lacuna de ADR-0007 (DIV-DP-16).
- `runbook.md` 1.1.0: `<sha>`, `<hash>` `BwruE9Pq`, `<sha-anterior>` 41076989728 / `index-dD_vz2Ev.js`; a conferência byte-exata como
  nome, precondição e *Promote* 1 (com o que fazer se `attr/` ou `i/`≠`w/` divergirem); precondições novas (regra byte-exata,
  DIV-DP-16); *Promote* 3/6/7 com 443, 88 e 79 e o estado de 2026-10-30; caminho C em C1 (voltar ao build anterior: os 7 commits de
  `652bbaa..6b314b2` que tocam a árvore) e C2 (retirar a Kart Park: a cadeia com `5ed7a5b`, conflitos esperados); H2, H3, H5, H7 e
  H8 reescritas para o treino de voltas seguidas (painel do resultado de cada volta com o crédito, "encerrar treino", 60 fps num
  treino de duas voltas); gatilhos e *Verify* com o crédito no painel; R1/R2 para o alvo novo; *Promoção bloqueada* (b) opção 2
  corrigida (ver DIV-DP-15).
- `smoke.md` 1.1.0: preparação com `BwruE9Pq` e 79 verificações (4 de ADR-0007 reprovadas em `6b314b2`); D5, D7, D9, D10, D13,
  D14, D15, D17, D18 e M10 no treino contínuo — o resultado de cada volta no painel `#lap-training-result` com o crédito como
  último item (ADR-0007), a volta inválida que marca e segue, "encerrar treino"; D17 com a conferência byte-exata, o resumo do
  literal igual ao do registro (`04ce5e51…`), os textos do crédito e `arcade-assistido-v6`. 30 linhas, as mesmas numerações.
- `tools/check_served.py` (74 → 79) e `tools/check_bundle.py` (83 → 88): `#lap-result-setup` sai (retirado por `dirigibilidade`),
  entram `#lap-training-result`, `#lap-best-valid`, `#lap-end-training` e as 4 linhas de ADR-0007 (`#lap-training-result-credit`
  dentro de `#lap-training-result` no HTML; nomeado no JS; nenhum `lap-result-credit` no HTML nem no JS); `arcade-assistido-v5` →
  `arcade-assistido-v6`. Executadas: `check_served … index-BwruE9Pq.js` `checks=79 failed=4`; `check_bundle` sobre o artefato
  servido e o registro de `6b314b2` `checks=88 failed=4` (1 `warn`) — as reprovações são as 4 de ADR-0007 em cada uma.
- `REL-0001` 1.1.0 (linha do `.gitattributes`; referência de `OSM_CREDIT`), `REL-0002` 1.1.0 (origem no blob, acerto v6 como de
  `dirigibilidade`, treino contínuo, alvo 41076989728, janela de cache), `REL-0003` 1.1.0 (o ocorrido em staging de `d9139a2` a
  `6b314b2`; etapa 0 byte-exata; 443/79; riscos da regra byte-exata e de ADR-0007), `REL-0004` 1.1.0 (crédito no painel, linhas de
  `src/main.ts` de `6b314b2`, tamanhos), `REL-0005` 1.1.0 (tabela de execuções de 2026-10-30 por leitura do Actions; crédito no
  painel; modo de falha byte-exato).
- `98-divergences.md` 1.1.0: DIV-DP-02, -03, -04 `resolved` com a rodada 2 anotada; DIV-DP-11 anotada; DIV-DP-12, -15 atualizadas;
  **DIV-DP-16 nova** (`open`, `FAIL CODE` esperado).

**Itens fechados**: ISSUE-02 (`<sha>`; a regra byte-exata e a conferência `git ls-files --eol` no *Promote*; a regra de
invalidação; o caminho C com `5ed7a5b`; `REL-0003` ordem 2 com o ocorrido; DIV-DP-02 anotada com a prova byte a byte) — o
`<sha>` passa a `6b314b2` em vez de `5ed7a5b` porque staging serve hoje `6b314b2`; ISSUE-03 (DIV-DP-03 `resolved` como o
relatório pediu; a precondição de ensaio mantida `[x]` com o alvo novo).

**Itens que ficam abertos, com o que os fecha**: ISSUE-01 / DIV-DP-01, DIV-DP-07 (dono do produto: `docs/kart-park-device-log.md`
com H1–H8, sobre um build que feche DIV-DP-16); ISSUE-04 / DIV-DP-14, DIV-DP-15 (dono do produto: decisão Esri e opção (b));
ISSUE-05 / DIV-DP-12 (dono do produto: portas humanas das releases contidas); **DIV-DP-16** (estágio de código desta feature:
ADR-0007; estágio de testes: migração de CHK-TEST-0009-04; depois nova rodada deste estágio). A precondição "Validação de staging
`SUCCESS`" fica `[ ]`: o relatório de 2026-10-28 é do build de `5ed7a5b`.

**Itens recusados ou não aplicados, com motivo**
- ISSUE-02, "`<sha>` passa a `5ed7a5b`": superado — o build servido e a nomear é o de `6b314b2`; `5ed7a5b` entra no histórico de
  `REL-0003`, na cadeia de C2 e em DIV-DP-02.
- ISSUE-02, "conferência `git ls-files --eol` como linha de `check_bundle.py`": não adotado; `check_bundle.py` não executa git e
  só lê os caminhos dados. Ficou como passo do *Promote* (1), precondição e etapa 0 de `REL-0003`, que é a outra forma que o
  relatório admite.
- ISSUE-03, "precondição *Validação de staging* `[x]` com o relatório de 2026-10-28": não aplicado — esse relatório valida o build
  de `5ed7a5b`; para `6b314b2` a precondição espera a próxima validação.
- Corrigir ADR-0007 no código ou migrar CHK-TEST-0009-04: fora da cerca de escrita deste estágio (§14); registrado como DIV-DP-16
  para os estágios de código e de testes desta feature.
- Opção 2 de *Promoção bloqueada* (b) mantida como `git push origin 6ea3862:master`: não mantida — publicaria o acerto v5 com
  drift e turbo que o dono do produto retirou depois; reescrita como entrega nova sem a Kart Park (DIV-DP-15).
- Nenhuma linha nova de smoke nem passo humano novo (§16): as 30 linhas e H1–H8 foram reescritas onde o D-Spec de 2026-10-30
  mudou o roteiro (E2E-02, E2E-03), e as verificações novas das ferramentas observam o que ADR-0007 e o treino contínuo já pedem.
- Nada foi executado contra produção; nenhum push, reexecução ou escrita no GitHub (só `gh run list`/`view`); nenhum valor de
  segredo escrito; nada fora de `600 Deploy/Output/pista-kart-park/` foi escrito (o artefato servido baixado foi para o
  diretório temporário da sessão).

## 2026-10-30 — rodada 3, Modo B (registro atualizado ao build de `e70aad9`; DIV-DP-16 fechada)

**Entradas lidas** (§12): a rodada 2 deste registro (DIV-DP-16); `400 Code/Output/pista-kart-park/reports/code-validation/code-validation-20261030-1836.md`
(`SUCCESS`, rodada 4: ADR-0007) e `01-implementation.md` 1.4.0 (versão); `500 Tests/Output/pista-kart-park/reports/test-validation/`
(nenhum relatório novo: a validação de testes de `e70aad9` está em curso). Leituras de verificação, só leitura: `git log`,
`git diff 6b314b2 e70aad9` (`index.html`, `src/main.ts`, `src/style.css`, `tests/pista-kart-park-screens.test.ts`), `git rev-parse`
dos blobs de pista, `git ls-files --eol`; `gh run view 41109469203` e `gh run list` em `kartle-staging` (log reduzido por `grep` a
contagens, nomes de *assets* e *Measure dist*); GET da URL de staging; o artefato servido baixado para o diretório temporário da
sessão, fora da árvore. O bloqueio da feature estava com o laço de testes (`man-20261030-testC-pista-kart-park`, validação de
testes em curso, escrita só em `500 Tests/`): esta rodada correu **sem o bloqueio**, por instrução, e escreveu só em
`600 Deploy/Output/pista-kart-park/`.

**Mudanças**
- `01-release.md` 1.2.0: `<sha>` = `e70aad9ddf5cf42da6c5957b4023afdbf6cacd03` (execução 41109469203, verde, 444/444,
  `index-DmxsQuIL.js`, 711 620 bytes, 188 719 gzip); ADR-0007 realizado (`38354bb`) e testes migrados (`e70aad9`); veredito de
  testes de `e70aad9` como precondição em aberto; ferramentas sobre o servido **79/79** e **88/88**; alvo de reversão 41101055606
  (`6b314b2`).
- `runbook.md` 1.2.0: `<sha>`, `<hash>` `DmxsQuIL`, `<sha-anterior>` 41101055606 / `index-BwruE9Pq.js` (o mesmo treino sem o
  crédito no painel — reversão de emergência; 41076989728 como alternativa com crédito em `#lap-result`); caminho B e R1/R2 para o
  alvo novo (R2 espera `checks=79 failed=4` sobre `BwruE9Pq`); C1 = `git revert e70aad9 38354bb`; C2 com `e70aad9`, `38354bb` e
  `1254443` à frente da cadeia; precondições: DIV-DP-16 `[x]`, veredito de testes de `e70aad9` `[ ]`, publicação 41109469203;
  *Promote* 3/6/7 com 444, 88/88 e 79/79; o parágrafo de gatilho que tratava `6b314b2` como build em vigor passa a tratar o alvo B.
- `smoke.md` 1.2.0: preparação com `DmxsQuIL` (79/79); D17 com 79/79 e 88/88; 444/103 nos limites. Nenhuma linha nova.
- `REL-0002` 1.2.0, `REL-0003` 1.2.0, `REL-0004` 1.2.0, `REL-0005` 1.2.0: commit, execução, *assets*, tamanhos, alvo de
  reversão, linhas de `src/main.ts` de `e70aad9`; o risco de ADR-0007 passa a regressão vigiada (CHK-TEST-0009-04/-11 no workflow);
  tabela de execuções com 41109469203. `REL-0001` sem mudança (1.1.0).
- `tools/`: sem mudança; executadas sobre o servido de `e70aad9`: `check_served … index-DmxsQuIL.js` `checks=79 failed=0`;
  `check_bundle` (artefato servido + registro de `e70aad9`) `checks=88 failed=0`, 1 `warn` (`fetch(` do polyfill).
- `98-divergences.md` 1.2.0: **DIV-DP-16 `resolved`**; DIV-DP-01, -02, -03, -04, -11 atualizadas para a rodada 3.

**Itens fechados**: DIV-DP-16 (pela rodada 4 de código e pela migração dos testes; verificado sobre o servido).

**Itens que ficam abertos, com o que os fecha**: veredito de testes `SUCCESS` sobre `e70aad9` (laço de testes em curso);
validação de staging desta rodada; DIV-DP-01 / DIV-DP-07 (H1–H8 em `docs/kart-park-device-log.md`); DIV-DP-12, DIV-DP-15
(decisões do dono do produto); DIV-DP-14 (`blocked`: decisão Esri; produção continua BLOQUEADA, 404, nada enviado a `origin`).

**Itens recusados ou não aplicados, com motivo**
- Marcar a precondição do veredito de testes com o relatório de 2026-10-30 17:14: não aplicado — esse relatório é de uma árvore
  anterior à rodada 4 de código; o de `e70aad9` ainda não existe.
- Nenhuma linha nova de smoke, nenhum passo humano novo e nenhuma verificação nova nas ferramentas (§16): CHK-TEST-0009-11 é do
  estágio de testes; as 4 linhas de ADR-0007 já existiam desde a rodada 2.
- Nada foi executado contra produção; nenhum push, reexecução ou escrita no GitHub (só `gh run list`/`view`); nenhum valor de
  segredo escrito.

## 2026-11-03 — rodada 4, Modo B/revisão (candidato `2aa013e`: seed revisão 2, acabamento visual)

**Entradas lidas** (§12): `reports/deploy-validation/deploy-validation-20261103-1744.md` (`SUCCESS` sobre `e70aad9`, ISSUE-01,
-03..-06); `400 Code/Output/pista-kart-park/reports/code-validation/code-validation-20261103-2004.md` (`SUCCESS`, `fbfb073`);
`500 Tests/Output/pista-kart-park/reports/test-validation/test-validation-20261103-2043.md` (`SUCCESS`, `2aa013e`, 467/467, 126
da feature); US-0007, NFR-0002 1.1.0, NFR-0013, NFR-0014 de `200 Requirements/230 Output/pista-kart-park/`; `test-strategy.md`
(E2E-03, E2E-05, E2E-09); `DOMAIN.md` (decisão de 2026-11-03). Leituras de verificação, só leitura: `git diff e70aad9 2aa013e`
(na árvore construída só `src/main.ts` +1 e `src/trackScene.ts` +162/−17; `tracks/`, `src/tracks/`, `index.html`, `src/style.css`,
`package*.json`, `.github/` iguais), `git rev-parse` dos blobs de pista, `git ls-files --eol`, `git ls-remote staging staging`
(`1bb63aa`), `git merge-base --is-ancestor 1bb63aa 2aa013e`. Executado localmente: `MSYS_NO_PATHCONV=1 npx vite build
--base=/kartle-staging/` (árvore limpa de `2aa013e`; `dist/` ignorado pelo git), `measure_dist.py` (714 001 / 189 786,
`within_limit=True`), `check_bundle.py` (88/88), `npm run track -- verify kart-park 1` (`VERIFIED`). Nada enviado, nada contra
produção, nenhuma escrita no GitHub.

**Mudanças**
- `01-release.md` 1.3.0: `<sha>` = `2aa013e67de49fb842f42cda573b3b82df5cf824`; o que muda contra `e70aad9` (acabamento: grama em
  faixas, faixa de borda, zebra com relevo, barreira de pneus; o chão da sintética); vereditos de código e de testes da rodada 5;
  build limpo local como referência (`index-BMmvlQeM.js`, 714 001 bytes, +2 381 contra o servido); staging serve ainda
  `e70aad9` (41156803005); NFR-0014 (arquivo e `trackVersion` 1 inalterados, nenhuma republicação); a decisão de 2026-11-03;
  alvo de reversão 41156803005; precondições reordenadas.
- `runbook.md` 1.3.0: `<sha>`, `<hash>` esperado `BMmvlQeM`, `<sha-anterior>` 41156803005 / `DmxsQuIL` (o mesmo jogo sem o
  acabamento — o caminho B deixa de ser só de emergência); C1 = `git revert 2aa013e fbfb073`; C2 com `2aa013e`, `fbfb073` à frente;
  precondições (veredito de testes `[x]`, NFR-0014 `[x]`, build limpo `[x]`, publicação em staging `[ ]`, H1–H12 `[ ]`, Esri com a
  decisão de 2026-11-03); *Promote* 3/6/7/8/9 com 467, 714 KB, o envio por fazer e a entrada nova no log; opção 1 registrada em
  *Promoção bloqueada* (b); *Verify* 13 novo (acabamento e fps); gatilhos do acabamento; **linhas humanas H9–H12 novas** (H9
  acabamento no notebook, H10 no celular em paisagem e retrato, H11 taxa de quadros com o acabamento — NFR-0002, H12 sintética
  igual, E2E-09); a taxa de quadros sai de H3/H5 para H11; H4, H5 e H7 com o relevo e sem textura; R1/R2 para `DmxsQuIL`
  (esperado 79/79).
- `smoke.md` 1.3.0: preparação com `BMmvlQeM`; **D19–D22 e M13 novas** (aspecto do acabamento, encosto nos pneus e volta com rodas
  na faixa, mesmo tom em cada abertura, sintética 0 pixel; o mesmo no celular); D14/M9 com o acabamento (H11, NFR-0002 1.1.0);
  D3, D17, D18, M7 atualizadas; 467/126 nos limites; referências erradas corrigidas (D14 e M9 apontavam H6; M7 apontava H4).
- `REL-0003` 1.3.0: alvo 41156803005; ordem 2 com as execuções até 41156803005 e o envio de `2aa013e` por fazer; decisão de
  2026-11-03 nas ordens 3 e 4; estado de 2026-11-03; janela de compatibilidade (só o desenho difere); pipeline com 467 e
  `BMmvlQeM`; riscos novos: fps com o acabamento, acabamento errado, sintética mudada, simulação mudada (NFR-0013), arquivo mudado
  (NFR-0014), releases contidas atrás do servido.
- `REL-0002` 1.3.0 (a revisão 2 não é revisão de dado; nenhuma `kart-park` 2), `REL-0004` 1.3.0 (acabamento nos dois canais; fps
  com o acabamento em H11; tamanhos; o log existe), `REL-0005` 1.3.0 (linhas de US-0007, NFR-0013, NFR-0014; NFR-0002 com o
  acabamento; tabela de execuções até 41156803005 e a de `2aa013e` por criar). `REL-0001` sem mudança (1.1.0): nenhuma variável nova.
- `98-divergences.md` 1.3.0: DIV-DP-01 (o log existe; H1–H12 sobre `2aa013e`), -02, -03, -04, -07 (fps com o acabamento), -12
  (os registros das releases contidas ficam atrás do servido com o envio), -14 (ponto Esri aberto em 2026-11-03); **DIV-DP-15
  `resolved`** (opção 1).
- `tools/`: sem mudança.

**Itens fechados**: ISSUE-06 do relatório de 2026-11-03 17:44 (registro atrás do estado: o veredito de testes, as medidas e as
execuções passam ao estado de hoje e ao candidato novo); DIV-DP-15 (decisão de 2026-11-03); ISSUE-04 em parte (a opção (b) está
registrada; a decisão Esri continua aberta).

**Itens que ficam abertos, com o que os fecha**: o envio de `2aa013e` a staging e a validação dele (deploy-loop); ISSUE-01 /
DIV-DP-01, DIV-DP-07 (dono do produto: H1–H12 no log sobre `2aa013e`); ISSUE-03 / DIV-DP-03 (ensaio do par novo, opcional);
ISSUE-04 / DIV-DP-14 (decisão Esri); ISSUE-05 / DIV-DP-12 (portas humanas das releases contidas e uma rodada de cada registro para
`2aa013e`).

**Itens recusados ou não aplicados, com motivo**
- Linhas novas em `check_served.py`/`check_bundle.py` para o acabamento: não acrescentadas — as medidas do acabamento são de
  `npm test` (CHK-TEST-0010-06..16), que o workflow executa antes do `deploy`, e o aspecto é da tela (H9–H12); as ferramentas
  continuam a provar o empacotamento e o arquivo da pista.
- As linhas novas de smoke e as humanas H9–H12 **não** são superfície destravada numa rodada de correção (§16): são autorizadas
  pela revisão 2 do seed (US-0007, NFR-0002 1.1.0, E2E-09 de `test-strategy.md`), como o pedido desta rodada nomeia.
- Editar os registros de `race-lap-validation`, `dirigibilidade` e `modelo-kart-01`: fora da cerca de escrita (§14); o efeito do
  envio sobre eles fica em DIV-DP-12 e no risco de `REL-0003`.
- Marcar a publicação em staging: não aplicado — este estágio não envia; o envio é o *Promote* 7 de um humano ou do laço.
- Republicar a pista ou criar `kart-park` 2: não aplicável (NFR-0014).
- Nada foi executado contra produção; nenhum push, reexecução ou escrita no GitHub; nenhum valor de segredo escrito; nada fora de
  `600 Deploy/Output/pista-kart-park/` foi escrito (o `dist/` local é ignorado pelo git).

## 2026-11-04 — rodada 5, Modo B (relatório `deploy-validation-20261104-1302.md`, SUCCESS; escopo: ISSUE-07, ISSUE-08, ISSUE-09)

O relatório é `SUCCESS` e deixou três itens sobre este registro: o carimbo de seed copiado errado (ISSUE-07, `warning`), a árvore
em que o caminho C1 se executa (ISSUE-08, `info`) e o registro escrito antes do envio (ISSUE-09, `info`). Nenhuma superfície nova
(§16): nenhuma linha de fumaça, roteiro, ferramenta, chave ou opção acrescentada; a nota de C1 diz em que árvore se executa um
caminho que já existia, e a entrada 41832829595 registra a execução que já serve.

**Fatos de entrada** (lidos nesta rodada, só leitura): `git ls-remote staging` → `staging` = `1966c4a`; `git ls-remote origin` →
`master` = `05c3570`; `gh run list` → 41832829595 (`1966c4a`, push, `success`, 2026-11-04T12:51:01Z) e 41156803005 (`1bb63aa`,
`success`); `git diff --stat 2aa013e HEAD -- src tests index.html package.json package-lock.json scripts` vazio; GET de
staging: 200, `Last-Modified` 2026-11-04 12:53:01 GMT, 6 592 / 696 559 / 10 850 bytes, sha256 `3b0dfc37…` / `babb1884…` /
`5e1c964b…`; `measure_dist.py` sobre os servidos: 714 001 / 189 786 (Windows); do relatório: *Measure dist* da execução
714 001 / 189 539, servido = build limpo byte a byte, `check_served` 79/79, `check_bundle` 88/88, ensaio C1 (clone LF 444/444;
com `core.autocrlf=true`, 2 reprovações por fim de linha); `pipeline_progress.py --seed-line pista-kart-park` →
`seed: {revision: 2, digest: 49d733298158}`; a função `body_digest` do script: SHA-1 do corpo do `SEED.md` sem a front matter,
fins de linha normalizados para LF, `strip()`, 12 primeiros hex; o mesmo cálculo sobre o `SEED.md` de `a5bb426` e de `2aa013e`
dá `49d733298158`, e sobre o de antes de `a5bb426` `b5aa5be4734a`; `b80f2635073f` é o SHA-1 do arquivo inteiro (com a front
matter) em CRLF, como a árvore de trabalho o tem — um `sha1sum SEED.md`, não o carimbo.

**O que mudou**

- `01-release.md` (1.4.0): parágrafo da rodada 4 com o envio e a validação; o digest da seed passa a `49d733298158` (linhas 31
  e da *Proveniência*) com a explicação do valor errado do relatório de testes; *Commit verificado* com `1966c4a`/`c06afdd`;
  *Construído pelo pipeline* = execução 41832829595 com os números do log; build limpo = servido; *Servido em staging hoje* =
  o candidato; alvo B 41156803005 e o ensaio C1; medida com 189 539 (workflow) e 189 786 (Windows, só zlib); precondições 1 e
  2 feitas, 5 com os três registros contidos passados a `2aa013e`; *Tag de release* com a execução.
- `runbook.md` (1.4.0): `<sha>` publicado; `<hash>` confirmado; `<sha-anterior>` como a anterior à em vigor; caminho B com o
  par 41156803005 ↔ 41832829595; caminho C1 com **em que árvore se executa** (checkout LF: a árvore de trabalho ou
  `core.autocrlf=false`; com `core.autocrlf=true`, `fail 2` de 444 em checks de `dirigibilidade` e `race-lap-validation` só pelo
  CRLF) e o ensaio de 2026-11-04; precondições de validação, envio, reversão e releases contidas; *Promote* 7 feito; H12 sem
  "antes do envio"; R1 caminho C num checkout LF.
- `smoke.md` (1.4.0): `<hash>` `BMmvlQeM` servido, 79/79; D22 sem "antes do envio".
- `REL-0002` (1.4.0): `index-BMmvlQeM.js` servido. `REL-0003` (1.4.0): passos 1 e 2 com o envio feito; estado de 2026-11-04;
  etapas 1, 2, 4, 5 e 8 com a execução 41832829595 (o *Measure dist* dela, 189 539, e a nota da zlib); a linha das releases
  contidas como ocorrida. `REL-0004` (1.4.0): bytes servidos. `REL-0005` (1.4.0): bytes, 467, entrada 41832829595 no lugar de
  "(por criar)", 41156803005 como alvo B.
- `98-divergences.md` (1.4.0): DIV-DP-02, DIV-DP-03 (par novo e ensaio C1), DIV-DP-04 (rodada 4 com a execução), DIV-DP-07,
  DIV-DP-12 (`docs/handling-device-log.md` existe; os três registros contidos passaram a `2aa013e`).

**Itens fechados**: **ISSUE-07** na parte deste registro — o digest citado é `49d733298158`; **o relatório
`500 Tests/Output/pista-kart-park/reports/test-validation/test-validation-20261103-2043.md` continua com
`seed: {revision: 2, digest: b80f2635073f}`** na front matter: este estágio não edita o relatório de outro estágio (§14 e §19), e
enquanto ele não for corrigido pelo estágio de testes (re-validação, ou correção do carimbo pelo dono) `pipeline_progress` segue a
mostrar `test drift` e `deploy seed!` para esta feature. **ISSUE-08** — o caminho C1 diz em que árvore se executa. **ISSUE-09** — o
registro nomeia a execução 41832829595 (`1966c4a`), marca as precondições 1 e 2 e cita o *Measure dist* da execução.

**Itens que continuam abertos, com o que os fecha**

- **ISSUE-01** (DIV-DP-01, DIV-DP-07): uma entrada em `docs/kart-park-device-log.md` sobre `index-BMmvlQeM.js` com H1–H12.
- **ISSUE-03** (DIV-DP-03): o caminho B não repetido para 41156803005 ↔ 41832829595; o ensaio C1 fica como prova do caminho C.
- **ISSUE-04** (DIV-DP-14): a decisão Esri.
- **ISSUE-05** (DIV-DP-12): os registros contidos passaram a `2aa013e` em 2026-11-04, nos seus próprios registros, por
  contenção e sem veredito de testes novo; fecha com a validação de deploy de cada um.

**Itens recusados**: nenhum.

- Nenhum redeploy, nenhum comando contra produção, nada aprovado; `gh`, `git ls-remote` e GET só de leitura; nenhum valor de
  segredo escrito; `docs/`, `DOMAIN.md`, os relatórios de validação (inclusive o de testes com o carimbo errado) e os registros
  das outras features não editados por esta entrada.
