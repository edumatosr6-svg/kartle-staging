---
title: Registro de mudanças — modelo Kart 01 e câmera de jogo (estágio de deploy)
feature: modelo-kart-01
stage: deploy
status: draft
version: 1.3.0
sources: []
---

# Registro de mudanças

## 2026-10-27 — rodada 1, Modo A (nenhum registro de release existia)

**Entradas lidas** (lista fechada do estágio, §12): `400 Code/Output/modelo-kart-01/01-implementation.md` 1.1.0 e
`98-divergences.md` (linhas 7–9, 15, 19, 20); `500 Tests/Output/modelo-kart-01/98-divergences.md` 1.0.0 e
`reports/test-validation/test-validation-20261027-2028.md` (`SUCCESS`, 296/296, 22 divergências);
`300 Specs/330 D-Specs/Output/modelo-kart-01/test-strategy.md` (roteiros E2E-01 a E2E-06 e a tabela de critérios), DM-0001
(seção 2, registro em tela), DES-0003 (constantes da câmera), DES-0007 (lista de rede e armazenamento; `console.warn`), ADR-0003
(sem chave; reversão pelo repositório); `200 Requirements/230 Output/modelo-kart-01/nfr/` (NFR-0001 a NFR-0007, títulos);
`600 Deploy/Input/domain-directives.md`; o registro validado da release anterior (`600 Deploy/Output/dirigibilidade/`, incluindo
`reports/deploy-validation/deploy-validation-20261027-1931.md` para os números de execução e o ensaio de reversão) como molde;
`.github/workflows/pages.yml`, `.nvmrc`, `package.json` (scripts), `index.html` (ids), `src/gameCamera.ts:40-60`,
`src/kart01Model.ts:12-31`, `src/kart01Decals.ts` (linhas do `fillText`), `docs/kart-01/device-log.md`. `.git/refs/heads/master`
e `.git/refs/remotes/staging/staging` foram lidos como arquivos para obter o hash da ponta e confirmar o push a staging; nenhum
comando `git` foi executado. O JS de `dist/` foi sondado por `grep` de marcadores (contagens, não corpos) para saber o que a
minificação preserva.

**Fatos apurados** (sem executar nada no GitHub além de três GET de leitura à URL de staging, por `check_served.py`): a ponta de
`master` é `6ea3862c74603886e3af421da3f542220980293f` e o remoto `staging` aponta para o mesmo hash; o `dist/` local de
2026-10-27 19:26:48Z tem `index-D0RarhFV.js` (631 352 bytes), `index-dgojskay.css` (11 407) e `index.html` (7 159), total
649 918 bytes (171 137 gzip), `within_limit=True`; `https://edumatosr6-svg.github.io/kartle-staging/` responde 200 em HTTPS com
`Cache-Control: max-age=600`, `Last-Modified` 2026-10-27 20:37:38 GMT, e serve o mesmo `index-D0RarhFV.js` com os mesmos
631 352 bytes (a execução do push de `6ea3862` já tinha concluído quando a rodada começou); `docs/kart-01/device-log.md` existe
com a execução 1 (navegador embutido, parcial, sem fps) e a seção de aparelhos de referência "Não executadas";
`docs/handling-device-log.md` (da `dirigibilidade`) continua a não existir.

**O que foi escrito**

- `01-release.md`: o que é entregue (Kart 01 com 27 chamadas e 5 128 triângulos, câmera de jogo 1,38 / 3,05 / 62°, estado de
  exibição, efeitos re-ancorados, nenhuma mudança de física), a proveniência (`6ea3862`, veredito 296/296, build local e
  staging com o mesmo `<hash>` e tamanho, produção nunca promovida), as três precondições humanas que restam, a reprodução do
  build com as ferramentas desta release e a medida real do artefato (+51 890 bytes contra a release anterior, 20,7 % do limite).
- `REL-0001-config.md` (nenhuma variável; as constantes do kart e da câmera são dado em código, proibida qualquer chave por
  ADR-0003), `REL-0002-migration.md` (nenhum formato publicado ou persistido muda; a linha de base `schemaVersion` 1 fica no
  repositório; reversão = republicar o bundle anterior), `REL-0003-rollout.md` (passo único; alvo B em staging = 40566728590,
  já ensaiado; riscos desta release, inclusive o de staging ter trocado de bundle com as linhas humanas da `dirigibilidade`
  por executar), `REL-0004-mobile.md` (sem app nativo; forma da área de jogo por quadro, retrato, giro, fps 30 nas duas
  orientações), `REL-0005-observability.md` (nada sai do navegador; `console.warn` `kart01-decals`/`NO_2D_CONTEXT` único registro
  novo; métricas por requisito; vigilância manual mantida; modos de falha novos).
- `smoke.md`: **27 verificações** — 16 em `web-desktop` (D1–D16) e 11 em `web-mobile` (M1–M11), cada uma com o limiar observado
  (NFR-0001, NFR-0002, NFR-0003, NFR-0006, RNF01, RNF02, RNF06, DES-0007 e os critérios AC-US-0001-14..16, AC-US-0002-01..06,
  AC-US-0003-08..13, AC-US-0004-01..02, AC-US-0005-01..03, mais a regressão de `setupVersion`); subconjunto de produção;
  `check_served.py` como preparação comum.
- `runbook.md`: precondições (13; 3 por marcar: validação de staging, registro H1–H6 nos aparelhos, portas humanas das releases
  contidas), promover (11 passos), verificar (8), **linhas humanas H1–H6** (Kart 01 em toda exibição com visão geral e descida;
  placa `01`, piloto, sombra, câmera atrás e perto, fim da volta; rodas esterçam e giram, volante, pausa, reposicionamento; sem
  corte na curva de 90° a 50 km/h e retrato; marcas e fumaça; fps 60/30 e download — o smoke de aparelho que o dono do produto
  executa e registra em `docs/kart-01/device-log.md`, roteiros E2E-01 a E2E-06, 22 linhas `unverified` do veredito de testes),
  reverter (5), gatilhos de reversão e ponto sem retorno; rollback com o `<sha-anterior>`/`<hash-anterior>` e a reexecução no
  Pages (caminho B em staging, ensaiado; A em produção; C pelo repositório).
- `tools/check_bundle.py` (45 verificações sobre `dist/` e o registro em tela: um JS e um CSS e nada mais; marcadores do Kart 01,
  número `01`, constantes de câmera e modos de câmera que a minificação preserva; `helmet`/`boxGeo` ausentes; identificadores
  das releases anteriores; elementos do HTML; tamanhos; executado: 45/45) e `tools/check_served.py` (37 verificações sobre a
  página servida, três GET de leitura; executado contra staging: 37/37). Copiados e adaptados dos da `dirigibilidade`;
  `measure_dist.py` da primeira release reutilizado por referência (é o que o workflow chama).
- `98-divergences.md`: 13 linhas — 4 `open` (DIV-DP-01 execuções nos aparelhos de referência por registrar, H1–H6; DIV-DP-03
  caminho B não repetido para este par de execuções; DIV-DP-05 `check_bundle.py` fora do workflow, `info`; DIV-DP-07 RNF01 e
  NFR-0001 não medidos para este bundle), 1 `open` por decisão (DIV-DP-12 staging serve este bundle com as portas humanas das
  releases contidas por fechar), 5 `resolved`, 3 `waived` herdadas das decisões de 2026-10-21. `00-index.md` emitido por
  `lint_artifacts.py --emit`.
- Nada foi executado contra produção; nenhum push, nenhuma reexecução, nenhuma chamada à API do GitHub; nenhum valor de
  segredo escrito; `.github/`, `src/`, `tests/`, `docs/` e as pastas de outras features não foram tocados (§14).

**Itens fechados**: nenhum relatório anterior.

**Itens que ficam abertos, com o que os fecha**: DIV-DP-01 (dono do produto: registrar H1–H6 em staging nos aparelhos nomeados,
três entradas no device log); DIV-DP-03 (validador ou dono do produto: reexecutar 40566728590 e depois a execução de `6ea3862`,
com `check_served`); DIV-DP-05 (decisão do dono do produto; `info`); DIV-DP-07 (junta-se à DIV-DP-01); DIV-DP-12 (decisão do
dono do produto: fechar as portas humanas das três releases na mesma sessão sobre este bundle, ou medir a `dirigibilidade`
isolada reexecutando 40566728590).

**Itens recusados**: nenhum.

## 2026-10-30 — revisão 2, Modo B (registro atualizado para o build validado do seed rev 4)

**Entradas lidas** (lista fechada do estágio, §12): `400 Code/Output/modelo-kart-01/reports/code-validation/code-validation-20261030-1655.md`
(`SUCCESS`, seed rev 4); `500 Tests/Output/modelo-kart-01/reports/test-validation/test-validation-20261030-1743.md` (`SUCCESS`,
443/443, 66 verificações desta feature) e `98-divergences.md` 1.2.0 (24 linhas `unverified`, critérios retirados);
`300 Specs/330 D-Specs/Output/modelo-kart-01/test-strategy.md` (E2E-01 a E2E-06 do seed rev 4); o relatório de validação de deploy
`deploy-validation-20261027-2057.md` (5 `info`); o registro da `pista-kart-park` (promoção bloqueada pela decisão Esri, opções).
Fatos medidos por script nesta rodada, sem ler artefato bruto (§18): `check_served.py` contra staging (três GET); build limpo de
`git archive 6b314b2` no rascunho da sessão com `measure_dist.py` e `check_bundle.py`; contagem de marcadores no JS servido;
`git log`/`git diff --stat`/`git show` só de leitura.

**O que mudou**

- `01-release.md` 1.1.0: commit `6b314b2` (ponta `483c5fa` só de registro); vereditos de código e de testes do seed rev 4; o que
  muda para o jogador (marcas quando o kart escorrega > 6 m/s e |deriva| > 0,055 rad; sem efeitos de turbo nem de drift; câmera
  atrás do piloto no treino contínuo); releases contidas (`dirigibilidade` rev 6, `race-lap-validation` rev 3, `pista-kart-park`);
  staging na execução 41101055606 com `index-BwruE9Pq.js` byte a byte igual ao build limpo (sha256 `023fb54be8e8c3f6…`);
  medida 711 561 / 188 918 gzip (22,6 % de RNF02); alvo de reversão 41076989728 (`652bbaa`); nova seção *Produção — opções
  enquanto a decisão Esri não existe* (1 esperar e promover tudo; 2 publicar `6ea3862`; 3 ramo sem a Kart Park, árvore nova).
- `smoke.md` 1.1.0: D1/D15 com `check_served.py` 40/40 e `check_bundle.py` 48/48; D3/M3 com ≈ 189 KB; D4 com o seletor de pista
  e o botão "treino"; D10/D13/M7 com o campo de visão constante sob todos os comandos (sem +4°); D11/M11 com a câmera atrás do
  piloto depois de uma volta de treino e a forma "encerrar treino"; D12/M8 com as marcas só em curva forte e nenhuma na reta,
  na contagem e na pausa, e nenhum efeito de drift ou turbo; regressão por `arcade-assistido-v6`.
- `runbook.md` 1.1.0: `<sha>` `6b314b2`, `<hash>` `BwruE9Pq`, `<run-staging>` 41101055606, alvo B 41076989728 (`652bbaa`); caminho C
  pelo `git revert` de `6b314b2` e `aeaf504`; precondições novas (vereditos do seed rev 4; decisão Esri ou escolha de opção);
  *Promote* com o passo 9 da decisão antes da pergunta; H2 (câmera depois de uma volta de treino), H4 (nenhum efeito de turbo no
  campo de visão), H5 (marcas visíveis em curva forte, ausentes na reta e na pausa; nenhum efeito de turbo ou de drift)
  revistas; gatilhos de reversão revistos.
- `REL-0001` a `REL-0005` 1.1.0: limites das marcas como dado em código; linha de base regravada sobre `a361c9c` com v6; acertos e
  pistas das releases contidas; ordem de operações com o passo da decisão Esri; observabilidade e registro de implantações com
  as execuções 40579585592, 41076989728 e 41101055606; campo de visão sem turbo no celular.
- `tools/check_served.py` (37 → 40 verificações) e `tools/check_bundle.py` (45 → 48): migração por verificação — `exhaustOutlet`
  passa de presença a ausência (com `escapamentoSaida`, `turboFovDeltaDeg`, `baseVerticalFovDeg`: o turbo e o jato saíram no
  seed rev 3/4); `arcade-assistido-v5` → `arcade-assistido-v6` (`dirigibilidade` rev 5); `#lap-result-setup` deixa de ser
  conferido (saiu do `index.html` em `cfad3dc`, da `dirigibilidade`); nova: a condição das marcas `speedMps>6&&….sideslipRad>.055`
  (AC-US-0005-06); em `check_bundle.py`, "registro em tela nomeia o JS deste `dist/`" passa a `warn` (o registro nomeia um build
  só depois da execução humana sobre ele). Executadas: staging 40/40; build limpo 48/48 (1 `warn`); uma cópia mutada do bundle
  (limite 0,05 e `exhaustOutlet` injetado) reprova as duas linhas novas.
- `98-divergences.md` 1.1.0: DIV-DP-02 e DIV-DP-04 recitadas para `6b314b2` e 41101055606; DIV-DP-03 aberta para o par
  41076989728 ↔ 41101055606; DIV-DP-11 resolvida pela `pista-kart-park`; DIV-DP-12 para as quatro releases; DIV-DP-13 com 24
  linhas; novas **DIV-DP-14** (fim da volta oficial inalcançável na página: o treino é a única volta oferecida) e **DIV-DP-15**
  (decisão Esri ou escolha de opção antes de produção).
- `00-index.md` emitido por `lint_artifacts.py --emit`.
- Nada foi executado contra produção nem contra a API do GitHub; nenhum push, nenhuma reexecução; nenhum valor de segredo
  escrito; `.github/`, `src/`, `tests/`, `docs/` e as pastas das outras features não foram tocados (§14).

**Itens fechados** (relatório `deploy-validation-20261027-2057.md`, todos `info`): ISSUE-02 (DIV-DP-03 do par antigo encerrada com
o ensaio reutilizado; a linha passa a valer para o par novo), ISSUE-03 (números de execução em vigor citados e o aviso de nunca
aprovar a 39827702391 no passo 11 do `runbook.md` e em `REL-0003`), ISSUE-04 (DIV-DP-12 corrigida: 17/17 sem o argumento de hash).

**Itens que ficam abertos, com o que os fecha**: ISSUE-01 → DIV-DP-01/-07 (Eduardo registra H1–H6 sobre `index-BwruE9Pq.js`);
ISSUE-05 → DIV-DP-12 (portas humanas das três releases contidas, na mesma sessão de aparelho); DIV-DP-03 (reexecução do par
quando staging estiver livre, ou aceitar o ensaio de 2026-10-27); DIV-DP-14 (aceitar a forma "encerrar treino" ou pedir a volta
oficial na página pelo backlog); DIV-DP-15 (decisão Esri ou escolha entre as opções 1 a 3).

**Itens recusados**: nenhum. **Verificações removidas**: nenhuma verificação de critério; nas ferramentas, a presença de
`#lap-result-setup` e de `exhaustOutlet` foi substituída porque o elemento e a âncora deixaram de existir por decisão registrada
(`cfad3dc`; seed rev 3/4), não por perda de cobertura.

## 2026-11-03 — revisão 3, Modo B (relatório `deploy-validation-20261103-1741.md`, FAIL; escopo: ISSUE-07, `blocker`, e ISSUE-06)

**Gatilho**: o registro nomeava `6b314b2` (`index-BwruE9Pq.js`, execução 41101055606), mas staging serve o build de `e70aad9`
(`index-DmxsQuIL.js`, sha256 `79e3182c…`) pela execução 41156803005 do commit de registro `1bb63aa`; pela regra do `<sha>`,
`e70aad9` (que muda `src/main.ts`, `index.html`, `src/style.css` e um teste de outra feature) invalidava o candidato. O
registro passa a `e70aad9` no molde de `pista-kart-park` em `bb5cd3a`. Nenhuma superfície nova (§16): nenhuma linha de
fumaça, ferramenta, chave ou passo acrescentado; as linhas de tabela novas registram fatos do build servido.

**Entradas lidas** (só leitura): `git diff --stat 6b314b2 e70aad9` (só o ADR-0007 de `pista-kart-park` e
`tests/pista-kart-park-screens.test.ts`; nenhum `tests/modelo-kart-01-*`, `tests/helpers/`, `tests/fixtures/`, nem
`src/kart01Model.ts`, `src/gameCamera.ts`, `src/kartPose.ts`, `src/kart01Decals.ts`, `docs/kart-01/kart.js`);
`e70aad9..6ca677e` só registros; o veredito `test-validation-20261030-1743.md` (o mais novo desta feature) e o JUnit da
execução fresca de 2026-11-03 do veredito `test-validation-20261103-1743.md` de `race-lap-validation` (444/444; 66/66 desta
feature); `gh run view` de 41109469203 e 41156803005 e o log desta (444/444, `index-DmxsQuIL.js`, 711 620 / 188 719); GET
de staging (200, `Last-Modified` 2026-10-31 01:46:48 GMT); `check_served.py … index-DmxsQuIL.js` 40/40; build limpo de
`e70aad9` no rascunho (`git archive`, `npm ci`, `MSYS_NO_PATHCONV=1 npx vite build --base=/kartle-staging/`): mesmos sha256
de JS e CSS, `index.html` igual depois de normalizar o CRLF, `check_bundle.py <dist> docs/kart-01/device-log.md` 48/48 sem
`warn`; `docs/kart-01/device-log.md`, *Execução no celular — 2026-10-30*.

**O que mudou**

- `01-release.md` (1.2.0): abertura e releases contidas com o ADR-0007; proveniência em 2026-11-03 — veredito aplicável a
  `e70aad9` (66/66 na suíte 444/444), commit `e70aad9` com os commits de registro acima, linha nova *Mudança `6b314b2` →
  `e70aad9` e contenção*, build limpo com `MSYS_NO_PATHCONV=1` e os sha256, staging 41109469203 e em vigor 41156803005, CI
  444, alvo B mantido com as execuções intermédias; produção e opções em `e70aad9`; precondições com a execução no celular
  de 2026-10-30 como evidência qualitativa e as portas das releases contidas com os logs que agora existem; medida
  711 620 / 188 719.
- `runbook.md` (1.2.0): `<sha>` `e70aad9` com a regra de commit só de registro, `<hash>` `DmxsQuIL`, `<run-staging>`;
  precondições (commit, veredito aplicável, validação de staging com ISSUE-07, execução verde, par de reversão, registro em
  tela, portas contidas); *Promote* 1, 3, 4 (com `MSYS_NO_PATHCONV=1`), 5, 7, 8; H1–H6 sobre `index-DmxsQuIL.js`.
- `smoke.md` (1.2.0), `REL-0002` (1.2.0), `REL-0003` (1.2.0), `REL-0004` (1.2.0), `REL-0005` (1.2.0): `<hash>`, CSS, 444,
  bytes, execuções e o par de reversão de `e70aad9`; `REL-0004` com a execução qualitativa no celular.
- `98-divergences.md` (1.2.0): estado em 2026-11-03 para `e70aad9`; DIV-DP-01 (a execução no celular não fecha nada),
  DIV-DP-02 e DIV-DP-04 refeitas, DIV-DP-03 (par 41076989728 ↔ 41156803005), DIV-DP-07, DIV-DP-11, DIV-DP-12 (os três logs
  das releases contidas existem, nenhuma porta fechada), DIV-DP-15.

**Itens fechados**

- **ISSUE-07** (registro atrás do staging): o registro nomeia o build servido, com a contenção e o veredito de testes
  aplicável; a confirmação é da revalidação.
- **ISSUE-06** (medidas sem `MSYS_NO_PATHCONV=1`): as medidas de 6 667 / 711 561 / 188 918 saem; ficam as do servido e do
  *Measure dist* de `e70aad9` (711 620 / 188 719), com a causa nomeada em `01-release.md`.
- Defeito de registro de **ISSUE-04**: `docs/handling-device-log.md` era dado como inexistente (DIV-DP-12, `runbook.md`,
  `01-release.md`); corrigido. A porta em si continua aberta.

**Itens que continuam abertos, com o que os fecha**

- **ISSUE-01** (H1–H6; DIV-DP-01, DIV-DP-07): as três entradas nos aparelhos de referência nomeados, com `fpsPerSecond` e
  `minFps`; a execução no celular de 2026-10-30 fica registrada como qualitativa.
- **ISSUE-02** (par de reversão não reexecutado; DIV-DP-03): nenhuma ação deste estágio.
- **ISSUE-03** (decisão Esri; DIV-DP-15): o dono do produto registra a decisão ou a opção 1/2/3.
- **ISSUE-04** (portas humanas das releases contidas; DIV-DP-12): as linhas em aberto de cada log.
- **ISSUE-05** (AC-US-0003-13 completo inalcançável; DIV-DP-14): aceitação do dono do produto ou a oferta da volta oficial.

**Itens recusados**: nenhum.

**Nada foi executado contra produção**; nenhum push, redeploy, reexecução ou aprovação (staging já serve `e70aad9`); `gh` e
GET só de leitura; nenhum valor de segredo escrito; `docs/` e as pastas de outras features não foram tocados (§14).

## 2026-11-04 — revisão 4, Modo B (registro atrás do staging: ISSUE-05 de `pista-kart-park`, `deploy-validation-20261104-1302.md`)

Staging passou a servir a árvore de `2aa013e` (execução 41832829595 de `1966c4a`, 2026-11-04), que muda `src/`; pela regra de
invalidação do `<sha>`, o candidato `e70aad9` da versão 1.2.0 ficou atrás do servido. Esta revisão move o registro para
`2aa013e`. Nenhuma superfície nova (§16): nenhuma linha de fumaça, roteiro, ferramenta, chave ou opção acrescentada; a linha
*Mudança `e70aad9` → `2aa013e`* e a entrada 41832829595 registram fatos do build servido.

**Fatos de entrada** (lidos nesta revisão, só leitura): `git ls-remote staging` → `staging` = `1966c4a`; `git ls-remote origin`
→ `master` = `05c3570`; `gh run list` → 41832829595 (`1966c4a`, push, `success`) e 41156803005 (`1bb63aa`, `success`);
`git diff --name-only e70aad9 2aa013e -- src index.html tests tracks docs/kart-01/kart.js …`: `src/main.ts` (+1, linha 239),
`src/trackScene.ts` (`ASPHALT_Y` continua 0,03; grama nova em `GRASS_Y` 0), sete suítes `tests/pista-kart-park-*` e
`tests/fixtures/kartParkRev1Trace.json`; `git diff --quiet 6b314b2 2aa013e -- src/kart01Model.ts src/gameCamera.ts
src/kartPose.ts src/kart01Decals.ts docs/kart-01/kart.js tests/modelo-kart-01-* tests/helpers` sem diferença; `2aa013e..HEAD`
só registros; JUnit `500 Tests/Output/pista-kart-park/reports/junit-latest.xml` (execução fresca sobre a árvore de `2aa013e`)
reduzido por script: 467 casos, 0 falhas, 0 pulados, 66 em `tests/modelo-kart-01-*`; GET de staging: 200, `Last-Modified`
2026-11-04 12:53:01 GMT, 6 592 / 696 559 / 10 850 bytes, sha256 `3b0dfc37…` / `babb1884…` / `5e1c964b…`; `check_served.py
… index-BMmvlQeM.js` 40/40; `check_bundle.py` sobre os três arquivos servidos e `docs/kart-01/device-log.md`: 48/48 com o
`warn` do registro em tela (o log nomeia `DmxsQuIL`); `measure_dist.py`: 714 001 / 189 786 (Windows); a prova byte a byte
servido = build limpo, o *Measure dist* 714 001 / 189 539 e o ensaio C1, do relatório `deploy-validation-20261104-1302.md` de
`pista-kart-park`; `DOMAIN.md` desta feature, 2026-11-03 (opção 1).

**O que mudou**

- `01-release.md` (1.3.0): parágrafo de abertura; releases contidas (acabamento `fbfb073`/`2aa013e`); veredito de testes
  aplicável a `2aa013e` por contenção (66/66 na suíte 467/467), sem veredito novo; commit `2aa013e`; linha nova *Mudança
  `e70aad9` → `2aa013e` e contenção*; build limpo = servido; staging 41832829595 (`BMmvlQeM`, 40/40, 48/48 com o `warn`);
  alvo B 41156803005 (41076989728 para tirar o rev 4); opção 1 registrada; medida 714 001 brutos, 189 539 gzip no workflow e
  189 786 no Windows (só zlib), +2 381 contra `e70aad9`, +64 083 contra `6ea3862`; precondições 1–3.
- `runbook.md` (1.3.0): `<sha>`, `<hash>` `BMmvlQeM`, `<run-staging>`, `<run-anterior>`; precondições de commit, veredito
  (contenção), validação, staging, alvo de reversão e log de aparelho (`BMmvlQeM`); *Promote* 1, 3–8; linhas humanas; R1/R2 com
  41156803005.
- `smoke.md` (1.3.0): `<hash>` `BMmvlQeM`, árvore promovida `2aa013e`, 467 na suíte.
- `REL-0002` (1.3.0): `index-BMmvlQeM.js`, alvo B, par não reexecutado. `REL-0003` (1.3.0): commit, alvo B, estado de staging
  em 2026-11-04, 467, `BMmvlQeM`, 714 001, 189 539. `REL-0004` (1.3.0): bytes; H1–H6 sobre `BMmvlQeM`. `REL-0005` (1.3.0):
  bytes, 467, `<hash>`, entrada 41832829595, 41156803005 como alvo B.
- `98-divergences.md` (1.3.0): DIV-DP-01 (o `warn` volta; H1–H6 sobre `BMmvlQeM`), DIV-DP-02 e DIV-DP-04 reescritas para
  `2aa013e` (a DIV-DP-04 ainda citava `index-BwruE9Pq.js` e `6b314b2`, e a DIV-DP-02 a ponta `483c5fa` e 711 561 bytes — restos
  das revisões anteriores, corrigidos), DIV-DP-03 (par novo; ensaio C1), DIV-DP-07, DIV-DP-11, DIV-DP-12, DIV-DP-15 (opção 1).

**Itens fechados**: **ISSUE-05** de `pista-kart-park` (`deploy-validation-20261104-1302.md`), na parte desta feature — o
registro nomeia `2aa013e`/`index-BMmvlQeM.js`; a confirmação é da validação deste estágio.

**Itens que continuam abertos, com o que os fecha**

- **Veredito de testes sobre `2aa013e`**: não existe; a regra de invalidação do `<sha>` pede rodada nova, e este registro
  oferece, como na revisão 3, a contenção (nenhum arquivo desta feature nem dos seus testes muda; 66/66 na execução fresca de
  `2aa013e`). Se a validação deste estágio não a aceitar, fecha-o uma re-validação de `test-loop` desta feature sobre `2aa013e`.
- **DIV-DP-01 / DIV-DP-07**: H1–H6 em `docs/kart-01/device-log.md` sobre `index-BMmvlQeM.js` (também apaga o `warn`).
- **DIV-DP-03**: o par 41156803005 ↔ 41832829595 não foi reexecutado.
- **DIV-DP-12**, **DIV-DP-14**, **DIV-DP-15**: como na revisão 3; a DIV-DP-15 tem agora a opção 1 escolhida e espera a decisão
  Esri. A aceitação de AC-US-0003-13 completo como inalcançável (`DOMAIN.md`, 2026-11-03) não é aplicada à DIV-DP-14 nesta
  revisão: mudar o estado da linha é decisão de registro que fica para a próxima rodada com relatório que a peça.

**Itens recusados**: nenhum.

- Nenhum redeploy (staging já serve `2aa013e`), nenhum comando contra produção, nada aprovado; `gh`, `git ls-remote` e GET só
  de leitura; nenhum valor de segredo escrito; `docs/`, `DOMAIN.md`, os relatórios de validação e os registros das outras
  features não editados por esta entrada.
