---
title: Runbook — publicar em staging, verificar e reverter a release da Kart Park; promoção a produção BLOQUEADA pela decisão Esri
feature: pista-kart-park
stage: deploy
status: validated
version: 1.0.0
sources: [DM-0001, DM-0002, DES-0003, DES-0005, DES-0007, DES-0009, DES-0011, DES-0012, ADR-0005, NFR-0001, NFR-0002, NFR-0004, NFR-0005, NFR-0006, NFR-0008, NFR-0010, NFR-0011, NFR-0012, TEST-0008, TEST-0009, TEST-0012]
---

# Runbook

Para quem não escreveu a release. Executar da raiz do repositório, com todo caminho entre aspas. Nenhum passo é executado por um
loop: cada um é de um humano, e a promoção a produção é sempre do dono do produto (D-DP-06) — **e nesta release ela não existe**:
a Kart Park é derivada de imagem Esri World Imagery e a decisão sobre essa licença **bloqueia a promoção** (ADR-0005; NFR-0012;
`DOMAIN.md`, decisão *Licença* e o ponto Esri de 2026-10-22). O provedor é o **GitHub Pages** (D23): o pipeline é
`.github/workflows/pages.yml`, a publicação é um push e a promoção seria um clique de aprovação no ambiente `github-pages` do
repositório de produção — o mesmo procedimento das releases anteriores (`600 Deploy/Output/modelo-kart-01/runbook.md`), com os
nomes desta release e **sem o passo de produção**. Nomes usados abaixo:

| Nome | Valor (não é segredo) |
|---|---|
| dono do produto | conta GitHub `edumatosr6-svg` (revisor obrigatório do ambiente `github-pages` de produção); é quem executa as linhas humanas H1–H8 nos aparelhos de referência, quem cria `docs/kart-park-device-log.md` e quem decide a licença Esri |
| repositório de **produção** | `edumatosr6-svg/kartle` — `https://github.com/edumatosr6-svg/kartle` (público), remoto local `origin`, ramo `master`, site `https://edumatosr6-svg.github.io/kartle/` (404 hoje); execuções em `https://github.com/edumatosr6-svg/kartle/actions`; `origin/master` = `05c3570` (2026-10-22) |
| repositório de **staging** | `edumatosr6-svg/kartle-staging` — `https://github.com/edumatosr6-svg/kartle-staging` (público), remoto local `staging`, ramo `staging`, site `https://edumatosr6-svg.github.io/kartle-staging/`; execuções em `https://github.com/edumatosr6-svg/kartle-staging/actions` |
| `<sha>` | o hash do commit da árvore verificada: `d9139a21f833e4e2ee72a6d9b58322ce77ae4564` (ponta de `master` em 2026-10-27T23:39:01Z). Um commit posterior **só de registro** (que não toque `src/`, `scripts/`, `tests/`, `tracks/`, `index.html`, `package.json` nem `package-lock.json`) não invalida a release; qualquer outro invalida |
| `<hash>` | o hash de conteúdo no nome do JS (`assets/index-<hash>.js`), impresso no passo *Build* da execução que se publica; para a árvore de `<sha>`, **`DYFBop8t`** (build local, 694 056 bytes; o manifesto de código nomeia o mesmo) |
| `<sha-anterior>` / `<hash-anterior>` | a release anterior (`modelo-kart-01`): árvore `6ea3862`, JS `index-D0RarhFV.js` (631 352 bytes); em staging, execução verde **40579585592** (commit `6ea3862`, validada) |
| "execução verde" | uma execução do workflow `pages` com os dois trabalhos (`build`, `deploy`) concluídos com sucesso |
| `check_served` | `python -I "600 Deploy/Output/pista-kart-park/tools/check_served.py" <URL> index-<hash>.js` — três GET de leitura; `checks=74 failed=0` aprova |
| `check_bundle` | `python -I "600 Deploy/Output/pista-kart-park/tools/check_bundle.py" dist tracks/registry.json` — leitura local; `checks=83 failed=0` aprova (com `docs/kart-park-device-log.md` como terceiro argumento, 87) |
| registro em tela | `docs/kart-park-device-log.md` — **o dono do produto o cria** (não existe; nomeado por `test-strategy.md`; nenhum estágio o escreve, §14), no molde de `docs/kart-01/device-log.md`: uma entrada por aparelho e orientação, com build (`<sha>`, `index-<hash>.js`), aparelho, navegador, versão, DPR, área de jogo em px, orientação, método da contagem, `fpsPerSecond`, `minFps`, resultado por roteiro E2E-01 a E2E-08, download, data |
| registro da pista | `tracks/registry.json`: entrada `kart-park` 1 em **`STAGING`** (SHA-256 `04ce5e51…`, 43 013 bytes); só passa a `PRODUCTION` por `npm run track -- promote kart-park 1 --esri-decision "<referência>"`, na entrega que promover |

Os números das execuções do Actions **não são copiados aqui**: cada push cria uma execução nova nos dois repositórios e, pelo
grupo de concorrência `pages`, cancela a execução de produção que ainda esperava atrás da mais antiga — as execuções em vigor
são sempre as que a aba Actions mostra, e são elas que o relatório de validação cita.

Artefato: `dist/` (HTML, JS e CSS estáticos), construído **pelo workflow** a partir de `<sha>`; o arquivo de pista da Kart Park
está dentro do JS. Não há banco, migração de dado, armazenamento no navegador nem aplicativo nativo. A feature fica ativa ao
servir o `index.html` novo (sem flag — ADR-0005).

**Alvo de reversão.** Três caminhos, e cada passo de *Roll back* nomeia qual aplica:

| Caminho | Quando se aplica | O que R1 faz |
|---|---|---|
| **A — despublicar** | não há execução verde anterior no repositório (**produção, hoje**: nada foi publicado; 404) | Settings → Pages → menu "…" ao lado da URL do site → **Unpublish site**; a URL responde 404 do GitHub. Ensaiado em staging em 2026-10-21 |
| **B — reexecutar a última execução verde anterior** | existe uma execução verde do commit anterior (**staging, hoje**: 40579585592, `6ea3862`, serve `<hash-anterior>`) | Actions → workflow `pages` → essa execução → **Re-run all jobs**; o workflow reconstrói esse commit (`npm ci` do lockfile, `npm test`, build) e publica. Em staging, **conferir antes a política de ramos do ambiente** se o site tiver sido despublicado entretanto. A página volta ao bundle sem seletor, sem Kart Park e sem crédito, com o Kart 01 e a mesma física na sintética. **Procedimento ensaiado** em 2026-10-27 19:29–19:33Z no mesmo site (par 39631099098 ↔ 40566728590): reversão ≈ 1 min 17 s do comando à página servida, restauração ≈ 2 min 12 s; não repetido para o par desta release (DIV-DP-03) |
| **C — reverter e reconstruir** (ADR-0005: "o artefato anterior não contém a Kart Park") | quando B não existe ou a execução anterior já não pode ser reexecutada (retenção de 90 dias) | `git revert` dos commits da cadeia desta feature que tocam a árvore, na ordem inversa (`1a12076`, `b44bacb`, `c5dfcb3`, `ba221ad`; `d9139a2` e `95d78fa` são só registro) `&& npm test && git push staging master:staging` (ou `origin master`, na entrega que promover); atenção: `32d0adf` e `c7e71b1` adaptaram testes de outras features ao leitor v3 e podem precisar de reversão junto — `npm test` decide; a execução nova roda `npm test` e o build na árvore revertida |

## Preconditions

- [x] **Commit verificado existe**: `d9139a21f833e4e2ee72a6d9b58322ce77ae4564` (`master`), a árvore que o veredito de testes
      verificou. Quem executa confere: `git log --oneline -7` mostra `d9139a2` como ponta (ou um commit só de registro acima
      dele) e `git status` não acusa modificação em `src/`, `scripts/`, `tests/`, `tracks/`, `index.html`, `package.json` nem
      no lockfile. O que se publica é o commit, não a árvore de trabalho.
- [x] Veredito de testes `SUCCESS`: `500 Tests/Output/pista-kart-park/reports/test-validation/test-validation-20261027-2333.md`
      (398 verificações, 398 aprovadas, 102 desta feature; `fresh: true`); validação de código `code-validation-20261027-2327.md`
      `SUCCESS`.
- [x] **Ordem de entrega** (NFR-0011): `<sha>` descende de `6ea3862` (`modelo-kart-01`), que descende de `b86b200`
      (`dirigibilidade` validada) — manifesto de código 1.2.0; conferível com `git merge-base --is-ancestor b86b200 d9139a2`.
- [ ] Validação de staging `SUCCESS`: relatório em `600 Deploy/Output/pista-kart-park/reports/deploy-validation/` — **aguarda a
      primeira execução do validador** sobre este registro, com o número da execução de staging de `<sha>` e o `<hash>` servido.
- [x] Histórico de migração: **não se aplica** — não há banco; o esquema 3 do arquivo de pista mantém o leitor do 2; nada
      persistido muda; a Kart Park é uma versão publicada imutável, registrada (`REL-0002`).
- [x] Feature flag: **não há** (ADR-0005); a feature fica ativa ao servir o `index.html` novo. O ponto de aplicação humano é a
      promoção, bloqueada.
- [x] **Repositórios e ambientes configurados** (2026-10-21, primeira release): produção com *Source* = GitHub Actions, revisor
      obrigatório `edumatosr6-svg` e política de ramos restrita a `master`; staging com *Source* = GitHub Actions, sem revisor e
      política de ramos **sem restrição** — a reconferir depois de qualquer despublicação. Nenhuma credencial configurada: o
      Pages usa o token OIDC da execução (D-DP-05).
- [x] **Push de `<sha>` a staging feito** (2026-10-27T23:39:04Z; `.git/refs/remotes/staging/staging` = `d9139a2`). A execução e
      o bundle servido são confirmados no passo 7 e pelo validador: às 23:46Z a URL ainda servia `<hash-anterior>`.
- [x] **Registro da pista em `STAGING`**: `tracks/registry.json` com `kart-park` 1, SHA-256 `04ce5e51…`, sem `promotedAtUtc` nem
      `esriDecisionRef`; o bundle reproduz o arquivo byte a byte (`check_bundle` 83/83). `npm run track -- promote` recusa sem
      `--esri-decision` (CHK-TEST-0012-04).
- [x] **Procedimento de reversão ensaiado em staging** (2026-10-27 19:29–19:33Z, caminho B sobre o mesmo site e a mesma workflow;
      ciclo ≈ 3 min 47 s). O alvo desta release é agora a 40579585592. Não repetido por esta rodada (nenhum comando contra o
      GitHub); o validador pode repeti-lo com o par 40579585592 ↔ execução de `<sha>` (DIV-DP-03).
- [ ] **`docs/kart-park-device-log.md` criado pelo dono do produto, com as linhas H1–H8 registradas em staging** nos aparelhos
      e navegadores nomeados (notebook de referência; celular intermediário em paisagem e em retrato; Chrome e Firefox para o
      som; um navegador em inglês; um sem `navigator.vibrate`): as 22 linhas `unverified`/`n/a` do veredito de testes (DIV-01 a
      DIV-22: AC-US-0001-01, -02, -05; AC-US-0002-08; AC-US-0003-06, -11; AC-US-0004-06; AC-US-0005-03, -07..-12;
      AC-US-0006-01..08; NFR-0002; NFR-0004; NFR-0005; NFR-0012 segunda linha; REQ-FEAT-0001-13; REQ-FEAT-0007-12) dependem
      disso (DIV-DP-01).
- [ ] **Decisão Esri registrada em `DOMAIN.md`** pelo dono do produto (identificador e data), com a evidência da seção *Promoção
      bloqueada* abaixo. **Enquanto não estiver marcada, não existe passo de produção para esta release** (NFR-0012: 0 promoções
      antes da decisão). Marcada, a promoção ainda não é deste commit: é da entrega que acrescentar o crédito da Esri e gravar
      `PRODUCTION` no registro.
- [ ] **Portas humanas das releases contidas** nesta: `docs/kart-01/device-log.md` com H1–H6 de `modelo-kart-01` ("Não
      executadas"), `docs/handling-device-log.md` com H1–H5 de `dirigibilidade` (não existe) e a execução 3 de
      `docs/lap-validation-device-log.md` (`race-lap-validation`). Em staging, as três listas correm sobre este bundle escolhendo
      "Pista sintética" (DIV-DP-12), na mesma sessão de aparelho que H1–H8; em produção, ver *Promoção bloqueada*.
- [x] Monitoramento decidido: **vigilância manual conforme este runbook**, nenhum monitor externo nem telemetria (decisão de
      2026-10-21, mantida; `REL-0005`).
- [x] Node na versão fixada: `.nvmrc` = `24` na raiz (o workflow lê `node-version-file`).

## Promote (até staging; o passo de produção não existe nesta release)

| # | Passo | Esperado | Leva | Desfaz-se por |
|---|---|---|---|---|
| 1 | conferir o commit: `git log --oneline -7`; `git status` | `d9139a2` é a ponta (ou só commits de registro acima); nenhuma modificação local em `src/`, `scripts/`, `tests/`, `tracks/`, `index.html`, `package.json`, lockfile | 1 min | nada a desfazer: leitura local |
| 2 | `npm ci` | saída 0; `package-lock.json` inalterado | 1 a 2 min | nada externo: só recria `node_modules/` |
| 3 | `npm test` | saída 0; `398 passed, 0 failed, 0 skipped` (102 em `tests/pista-kart-park-*.test.ts`) | 1 a 2 min | nada a desfazer |
| 4 | `npm run track -- verify kart-park 1` | `VERIFIED`, V01 a V18 `PASS`; nada escrito | 10 s | nada a desfazer: leitura |
| 5 | `npm run build` | saída 0; `dist/assets/index-<hash>.js` com `<hash>` = `DYFBop8t` (se a árvore for a de `<sha>`), `index-Dv0Dz75T.css`, e nenhum outro arquivo em `dist/assets/`; anotar o `<hash>` — é a conferência local; o artefato publicado é o do workflow | 1 min | nada externo: apagar `dist/` local |
| 6 | `python -I "600 Deploy/Output/race-lap-validation/tools/measure_dist.py" dist` e `check_bundle` | `within_limit=True` (≈ 713 321 bytes, RNF02); `checks=83 failed=0` (o arquivo da Kart Park no JS com o SHA-256 do registro; 0 `esri`; 0 recorde) | 10 s | nada a desfazer: leitura |
| 7 | publicar em **staging**: `git push staging master:staging` (**feito em 2026-10-27T23:39:04Z** pelo dono do produto) e acompanhar a execução `pages` desse commit em `https://github.com/edumatosr6-svg/kartle-staging/actions`; depois `check_served https://edumatosr6-svg.github.io/kartle-staging/ index-<hash>.js` em janela anônima (até 10 min de cache). Se o `deploy` falhar **sem executar nenhum passo**, liberar a política de ramos do ambiente e *Re-run all jobs* | execução verde (`npm test` 398 aprovados; `Measure dist` `within_limit=True`; `deploy` concluído); `check_served` `checks=74 failed=0` com o `<hash>` do passo *Build* dessa execução (esperado `DYFBop8t`; às 23:46Z ainda `D0RarhFV`, 28 linhas da Kart Park reprovadas — estado anterior à execução) | 3 a 5 min (execução) + até 10 min de cache | R1/R2 sobre `kartle-staging` (caminho B: 40579585592; ou A) |
| 8 | **criar `docs/kart-park-device-log.md`** (dono do produto; molde: `docs/kart-01/device-log.md`) e anotar nele o alvo de reversão: staging → execução 40579585592 (`6ea3862`, `<hash-anterior>` `D0RarhFV`), caminho B; produção → "nada publicado; nenhuma promoção desta release (decisão Esri pendente)" | arquivo criado com o cabeçalho, o build (`<sha>`, `index-<hash>.js`) e a nota | 5 min | nada a desfazer: anotação |
| 9 | executar `smoke.md` em staging (D1–D18, M1–M12) **e as linhas humanas H1–H8 abaixo**, e registrar em `docs/kart-park-device-log.md` (uma entrada por aparelho e orientação; navegadores nomeados) | todas as linhas dentro do limiar; D4/M4 com 2 opções, Kart Park marcada e os 3 elementos do crédito; D7 sintética sem crédito; D11/M12 sem atravessar a barreira; D12 som só na zebra em Chrome e Firefox; M7 vibração só na zebra; M8 sem erro sem vibração; D16 nome em português no navegador em inglês; D15/M11 0 requisições; H6 com `minFps` ≥ 60 e ≥ 30 | 120 a 180 min | nada a desfazer: observação; o registro fica como histórico |
| 10 | opcionalmente, na mesma sessão: as listas pendentes das releases contidas (H1–H6 de `modelo-kart-01`, H1–H5 de `dirigibilidade`, execução 3 de `race-lap-validation`) sobre este bundle, escolhendo "Pista sintética" (DIV-DP-12); registrar cada uma no seu log | cada lista no seu registro; a simulação na sintética é a mesma (NFR-0008) | 90 a 150 min | nada a desfazer |
| 11 | **parar.** Não há pergunta de promoção (D-DP-06 sem objeto). Registrar no relatório de validação: "staging verificado; produção bloqueada pela decisão Esri; registro em `STAGING`". Ler a seção *Promoção bloqueada* e levar ao dono do produto as duas decisões que ela pede | decisão (a) e (b) registradas em `DOMAIN.md` quando existirem; sem resposta, nada muda e nada é promovido | até a decisão | nada a desfazer |

**Não fazer nesta release**: `git push origin master` com `<sha>` ou qualquer commit posterior de `master`; **Approve and
deploy** em qualquer execução de `edumatosr6-svg/kartle` cujo commit contenha esta feature; `npm run track -- promote` com uma
referência que não seja a de uma decisão registrada em `DOMAIN.md`. Se uma execução dessas aparecer em *Waiting* por engano:
**Reject** (nada é publicado; a execução fica como histórico).

## Promoção bloqueada — a decisão Esri e as duas opções para as releases contidas

**Por que está bloqueada.** O traçado da Kart Park (`tracks/sources/kart-park.json`) foi gerado pelo dono do produto a partir
do caminho OpenStreetMap `way/128739206` **e de bordas detectadas em imagem Esri World Imagery** (seed, *Origem*). O dado OSM
leva o crédito e a ODbL (no bundle, nas duas telas). O dado derivado da imagem Esri tem licença por decidir: o dono do produto
decidiu em 2026-10-22 usar o dado agora, mostrar o crédito OSM/ODbL, manter a Kart Park **só em staging** e decidir a licença
Esri **antes da promoção para produção**, com base nos termos de uso da Esri (`DOMAIN.md`; NFR-0012; ADR-0005). O código
aplica a regra em dois pontos: `npm run track -- promote` recusa sem `--esri-decision "<referência>"` (DES-0010, DES-0011;
CHK-TEST-0012-04) e esta lista de verificação recusa promover um artefato que contenha `kart-park` sem a entrada `PRODUCTION`
com essa referência (DES-0012).

**(a) A evidência que o dono do produto precisa ler para decidir** (nenhuma é conclusão deste runbook; a decisão é dele):

| Evidência | O que procurar | Onde |
|---|---|---|
| Termos de uso da Esri para os mapas base do ArcGIS Online (o serviço *World Imagery*) | se dado vetorial **derivado** da imagem (bordas traçadas/detectadas) pode ser redistribuído num produto próprio, sob que condições (atribuição obrigatória, uso não comercial, proibição de "derivative products"), e se a redistribuição sob ODbL junto ao dado OSM é compatível com essas condições | `esri.com/legal` (*Terms of Use* / *Products and Services Terms*) e a página do item *World Imagery* no ArcGIS Online, seções *Terms of Use* e *Credits* (Esri, Maxar, Earthstar Geographics e a comunidade de usuários) |
| A permissão da Esri para traçar o World Imagery **no OpenStreetMap** | o alcance dessa permissão: cobre contribuições ao OSM; se cobre dado traçado da imagem **fora** do OSM (como as bordas detectadas aqui) é a pergunta | página *Esri World Imagery* no wiki do OpenStreetMap e o aviso de atribuição que ela pede |
| A proveniência do próprio arquivo de origem | que partes vieram do caminho OSM (linha central) e que partes vieram da imagem (bordas → larguras por ponto; zebras?), porque a decisão pode ser diferente para cada parte | seed (`SEED.md`, *Origem* e as medições de `NOTES.md`); `tracks/sources/kart-park.json` |
| O texto de crédito que a Esri exige, se exigir | o texto exato a exibir ao lado do crédito OSM nas duas telas, na entrega que promover (REQ-FEAT-0006-14; DES-0011) | os mesmos termos; o crédito do item *World Imagery* |

**Desfechos possíveis e o que cada um faz:**

| Decisão registrada em `DOMAIN.md` | Consequência |
|---|---|
| **libera** (com ou sem crédito obrigatório) | entrega nova: o crédito da Esri no texto da decisão em `creditFor` (`src/lapMessages.ts`) e nas duas telas (DES-0007, DES-0011); `npm run track -- promote kart-park 1 --esri-decision "<identificador e data da decisão>"` (registro em `PRODUCTION`, commit próprio); `npm test`; nova rodada deste estágio; `git push origin master`; **Approve and deploy**; `smoke.md` *Verificação em produção* |
| **não libera** | a Kart Park fica só em staging; para produção, ou uma versão 2 da pista preparada de origem sem o dado Esri (feature nova no pipeline: outro traçado, outro seed), ou a Kart Park sai do catálogo (mudança de F-Spec); `master` continua a carregar a feature |
| **adia** | o estado de hoje: staging com a Kart Park; produção sem nenhuma release que a contenha; a opção (b) abaixo decide o resto |

**(b) Como `dirigibilidade` e o Kart 01 chegam a produção entretanto** — qualquer commit de `master` a partir de `ba221ad`
contém a Kart Park; promover `master` é promover a Kart Park (ADR-0005: "enquanto a decisão não existir, nenhum artefato
construído de um commit que contenha esta feature vai a produção; uma correção urgente de produção nesse intervalo sai de um
ramo anterior ao primeiro commit desta feature"). As duas opções; **a escolha é do dono do produto**:

| Opção | O que se faz | O que custa | O que exige |
|---|---|---|---|
| **1 — esperar a decisão Esri** e promover tudo junto | nenhum push a `origin` até a decisão; depois, a entrega que promover leva `race-lap-validation`, `dirigibilidade`, `modelo-kart-01` e a Kart Park de uma vez | produção continua em 404 até lá (nunca serviu um `dist/`); as portas humanas das três releases contidas fecham em staging sobre este bundle (passo 10) | a decisão (a) |
| **2 — publicar `6ea3862` em produção antes de qualquer push de `master`** | `git push origin 6ea3862:master` (avanço rápido a partir de `05c3570`, **sem** `--force`): o workflow constrói a árvore de `modelo-kart-01` (sem Kart Park: `check_served.py` desta release reprova nas linhas da Kart Park, e o de `modelo-kart-01` dá 37/37) e espera o revisor; o dono do produto aprova **só depois** de as portas humanas daquelas releases fecharem (`docs/kart-01/device-log.md` H1–H6, `docs/handling-device-log.md` H1–H5, execução 3 de `docs/lap-validation-device-log.md` — pelo runbook de `modelo-kart-01`); `origin/master` fica em `6ea3862` e o `master` local continua em `d9139a2` | o passo 10 deste runbook mede aquelas releases sobre **este** bundle (sintética), ou reexecuta 40579585592 em staging para medi-las isoladas (DIV-DP-12); uma correção urgente de produção até a decisão sai de um ramo em `6ea3862` e só pode ir a `origin master` enquanto for avanço rápido (o `master` local a absorve por merge depois); **nunca** `push --force` | nenhuma decisão Esri; a atenção de não aprovar, no mesmo repositório, uma execução posterior com `d9139a2` |

A opção 2 **não** adianta a decisão Esri e **não** toca em staging; a opção 1 **não** publica nada. Nenhuma das duas é tomada por
um loop (D-DP-06). Registrar a escolha no relatório de validação e em `DOMAIN.md`.

## Verify (em staging; em produção só na entrega que promover)

| # | Verificação (`smoke.md`) | Esperado |
|---|---|---|
| 1 | D1 / M1 HTTPS em `https://edumatosr6-svg.github.io/kartle-staging/` — **verificação manual** (+ `check_served`), a única vigilância de disponibilidade desta release | cadeado válido; 0 recursos inseguros; `index.html`, JS e CSS com 200 e nenhum outro *asset*; `<hash>` esperado; o arquivo da Kart Park no JS com o SHA-256 registrado; inclinação ativa no celular (RNF06; NFR-0006; NFR-0010) |
| 2 | D2 / M2 carregamento em 4G, cache vazio | kart responde em menos de 10 s (RNF01) |
| 3 | D3 / M3 bytes transferidos na primeira visita | abaixo de 3 145 728 bytes (RNF02); esperado da ordem de 190 KB comprimidos |
| 4 | D4 / M4 tela inicial | 2 opções com a Kart Park marcada; rótulo "… (traçado aproximado) · 687 m"; os 3 elementos do crédito com o link; `#track-status` `kart-park`; um botão "volta de treino"; nenhum recorde (AC-US-0001-01, -02; AC-US-0006-01..03, -07..-09; NFR-0005; D-DP-04) |
| 5 | D5 / M5 console | 0 erros ao carregar, ao trocar de pista e numa volta |
| 6 | D7, D8 troca de pista e recarga | sintética sem crédito e com o kart na largada dela; de volta à Kart Park com crédito; recarga abre na Kart Park; armazenamento vazio (AC-US-0001-02, -05; AC-US-0006-04) |
| 7 | D9, D10, D11 / M12 volta na Kart Park | asfalto de larguras variáveis, zebras do lado declarado, barreira contínua; resultado com total, 4 setores e crédito; "marcador pulado" na volta inválida; o kart bate na barreira e não passa (AC-US-0002-08, AC-US-0003-06, -11, AC-US-0004-04, -06, AC-US-0005-03, AC-US-0006-04..06) |
| 8 | D12 / M7, M8 retorno da zebra | som grave repetido só com roda na zebra em Chrome e Firefox, nenhum desligado; vibração de 20 ms a cada 0,25 s só na zebra no celular, nenhuma na pausa; sem `navigator.vibrate`, sem erro e sem aviso (AC-US-0005-07..12; REQ-FEAT-0005-16..19) |
| 9 | D15 / M11 rede bloqueada | 0 requisições da escolha ao fim da volta; crédito visível sem rede (NFR-0004; REQ-FEAT-0006-12) |
| 10 | D16 navegador em inglês | nome, "Pista sintética" e crédito em português; o resto em inglês (AC-US-0006-07, -08) |
| 11 | D18 / M10 regressão na sintética | `#lap-result-setup` = `arcade-assistido-v5`; texto compartilhado; sem crédito; Kart 01 e câmera como na release anterior (NFR-0008) |
| 12 | D17 ferramentas | `check_bundle` 83/83 local; `check_served` 74/74 em staging |
| 13 | repetir 1, 4, 5 e 11 depois de 24 h (vigilância manual; nenhum monitor externo) | mesmos resultados; a execução de `<sha>` continua a última em `https://github.com/edumatosr6-svg/kartle-staging/actions`; **nenhuma** execução aprovada em `https://github.com/edumatosr6-svg/kartle/actions` com commit que contenha a feature |

**Gatilhos de reversão em staging (D-DP-03):** carregamento de 10 s ou mais em 4G; transferência de 3 145 728 bytes ou mais; o
jogo a abrir na sintética ou o seletor com uma opção só; o crédito OSM/ODbL ausente de uma das duas telas com a Kart Park, ou
presente na sintética; `41,45` ou "recorde" em qualquer tela; o kart a atravessar a barreira; zebra sem som no teclado (som
ligado) ou sem vibração no celular de referência, ou som/vibração fora da zebra ou na pausa; erro no console ao carregar, ao
trocar de pista ou durante a volta (inclusive 404 de um *asset* ou `track-data`); `#track-status` sem `kart-park` ao abrir;
qualquer recurso servido sem HTTPS; `minFps` abaixo de 60 no notebook ou de 30 no celular de referência; `#lap-result-setup` sem
`arcade-assistido-v5` numa volta na sintética. **Gatilho em produção, hoje:** qualquer execução aprovada em
`edumatosr6-svg/kartle` cujo commit contenha a feature — reverter pelo caminho A no mesmo instante.

## Linhas humanas — o smoke de aparelho que o dono do produto executa (H1–H8)

As oito linhas do estágio de testes que só a tela, o aparelho, o ouvido, a mão, o navegador nomeado, a rede bloqueada ou o relógio
de parede decidem (`500 Tests/Output/pista-kart-park/98-divergences.md`, DIV-01 a DIV-22; `test-strategy.md` E2E-01 a E2E-08).
Executadas sobre a URL de **staging**, nos aparelhos e navegadores nomeados, com a página em primeiro plano, e registradas em
`docs/kart-park-device-log.md` — uma entrada por aparelho e por orientação, com build, aparelho, navegador, versão, DPR, área de
jogo em px, orientação, método da contagem, `fpsPerSecond`, `minFps`, resultado por roteiro, download, data. Nenhuma pode ser
feita por um loop nem sob automação do navegador (ritmo inválido; vibração inobservável).

| # | Linha | O que se faz | O que se registra | Critério de aprovação | Roteiro |
|---|---|---|---|---|---|
| H1 | seletor, abertura na Kart Park, crédito com link, nada persistido | abrir a URL em **Chrome, Edge, Firefox e Safari**; ler o seletor e o crédito; clicar no link; escolher a sintética e recarregar; depois de voltas nas duas pistas, abrir o painel de armazenamento | as 2 opções com a Kart Park marcada e o rótulo; os 3 elementos do crédito; o link abrindo `openstreetmap.org/copyright` em outra aba; a recarga na Kart Park; armazenamento vazio; por navegador | AC-US-0001-01: 2 opções; AC-US-0001-02: 4 de 4 recargas na Kart Park; AC-US-0001-05: 0 registros; AC-US-0006-01..03, -07, -08: 3 elementos e o rótulo exato; NFR-0005 | E2E-01 |
| H2 | troca de pista sem volta em andamento | em Chrome, trocar de pista nos dois sentidos, antes de uma volta e depois de uma volta terminada | o kart na largada da pista escolhida; nenhuma volta em andamento; a única oferta "volta de treino" | DES-0005: `selectTrainingTrack` recusado só com volta em andamento; AC-US-0001-01 | E2E-02 |
| H3 | volta completa na Kart Park: desenho, resultado, corte, barreira, foco, recarga, 60 fps | no **notebook de referência**: volta válida; volta inválida por marcador pulado; bater na barreira a ≈ 50 km/h; perda de foco; recarga a meio da volta; volta na sintética; contador de fps ligado na volta válida | asfalto de larguras variáveis, zebras do lado declarado, barreira contínua; resultado com total, 4 setores e crédito; "marcador pulado" com crédito; o kart bate e não passa (anotar ricochetes estranhos como observação); pausa na perda de foco; recarga sem resultado; sintética sem crédito; `fpsPerSecond` e `minFps` | AC-US-0002-08, AC-US-0005-03, AC-US-0004-06: desenho conforme o arquivo; AC-US-0003-06, -11; AC-US-0004-04: 0 travessias; AC-US-0006-04..06; REQ-FEAT-0003-15; NFR-0002: `minFps` ≥ 60 | E2E-03 |
| H4 | som da zebra no teclado | em **Chrome e Firefox**, som ligado: roda na zebra, manter, sair; som desligado: repetir | ruído grave repetido só com roda na zebra, distinto do motor e da recompensa; nenhum desligado; por navegador | AC-US-0005-09, -10, -11, -12: 0 repetições fora da zebra, 0 com o som desligado, distinguível | E2E-04 |
| H5 | celular: seletor, crédito, inclinação negada, vibração, 30 fps, resultado | no **celular intermediário de referência**, paisagem e retrato: tela inicial; negar a inclinação; volta na Kart Park com roda na zebra, saída, pausa na zebra; contador de fps nas duas orientações; resultado e `#lap-share`; sintética sem crédito | seletor e crédito inteiros nas duas orientações; toque com o aviso, seletor e pista inalterados; pulso curto repetido só na zebra, 0 na pausa; `fpsPerSecond`/`minFps` por orientação; resultado com crédito; sintética sem | AC-US-0001-01; AC-US-0006-01..06; REQ-FEAT-0001-13; AC-US-0005-07, -08: 0 pulsos fora da zebra ou na pausa; NFR-0002: `minFps` ≥ 30 nas duas (uma medida em desktop não vale, I9) | E2E-05 |
| H6 | navegador sem `navigator.vibrate` (e a medida de download) | num navegador sem vibração (Safari no iOS; ou vibração desligada no sistema, anotando): volta com zebras; numa primeira visita com cache vazio, ler os bytes comprimidos transferidos (4G real) | volta igual, sem vibração, sem erro no console, sem aviso; bytes comprimidos por aparelho | REQ-FEAT-0005-16..19: 0 erros, 0 avisos; RNF02: abaixo de 3 145 728 bytes | E2E-06 |
| H7 | rede bloqueada depois do carregamento | desktop (painel offline) e celular (modo avião): escolher a pista, volta com zebra e barreira, ler o crédito | tudo funciona; 0 requisições do jogo entre a escolha e o resultado; o link do crédito pode não abrir | NFR-0004: 0 requisições a outro serviço; REQ-FEAT-0006-12 | E2E-07 |
| H8 | navegador em inglês | abrir num navegador com o idioma inglês; ler os textos | nome da Kart Park, "Pista sintética" e crédito em português e iguais; o resto em inglês | AC-US-0006-07, -08: textos idênticos em qualquer idioma | E2E-08 |

Resultado esperado do conjunto: 8 linhas `PASS` registradas (entradas no device log: notebook paisagem; celular paisagem;
celular retrato; mais as notas por navegador para H1, H4, H6 e H8); a partir daí as 22 linhas `unverified`/`n/a` do veredito de
testes ficam verificadas na sua metade humana (a segunda linha de NFR-0012 continua `n/a` até a decisão), e a precondição
correspondente deste runbook fecha. Uma linha reprovada é `FAIL CODE` (defeito de aplicação), nunca de empacotamento: o bundle
é o mesmo que passou nas 398 verificações — exceto a vibração num navegador sem `navigator.vibrate` (ambiente; é a H6) e um
`minFps` abaixo do limiar num aparelho fora da referência (I9; anotar o modelo).

## Roll back

| # | Passo (desfaz o passo de *Promote* indicado) | Esperado | Leva |
|---|---|---|---|
| R1 | desfaz 7, pelo caminho que o passo 8 registrou. **Staging — caminho B**: Actions → `pages` → execução 40579585592 → **Re-run all jobs** (conferir a política de ramos do ambiente se o site tiver sido despublicado); serve `index-D0RarhFV.js`. **Staging — caminho A** (se B não existir): Settings → Pages → menu "…" → **Unpublish site**. **Caminho C** quando B não existir e o commit anterior não puder ser reexecutado: `git revert` da cadeia (`1a12076`, `b44bacb`, `c5dfcb3`, `ba221ad`), `npm test` local, `git push staging master:staging`. **Produção**: nada a desfazer nesta release — se uma execução com a feature tiver sido aprovada por engano, caminho A em `edumatosr6-svg/kartle` (Unpublish site) no mesmo instante | **B**: a URL serve o `index.html` que referencia `assets/index-D0RarhFV.js`; o seletor, o crédito e a Kart Park somem; o Kart 01 e a sintética voltam como na release anterior; `check_served` de `modelo-kart-01` 37/37. **A**: a URL responde 404 do GitHub em até 10 min. **C**: execução nova com `npm test` verde na árvore revertida (296 verificações, se os testes de outras features voltarem ao estado anterior ao leitor v3) | B: ≈ 1 min 20 s do comando à página servida (procedimento ensaiado em 2026-10-27) + até 10 min de cache. A: 1 min + até 10 min de cache. C: 10 min + 3 a 5 min + cache |
| R2 | propagação do cache (desfaz o `check_served` de 7): sem purga; esperar até 10 min e `check_served <URL> index-<hash-anterior>.js` em janela anônima — esperado `failed=` igual ao número de linhas que só este bundle tem (28 em 2026-10-27: elementos novos, arquivo da Kart Park, seletor, crédito, zebra, barreira, malhas, classes), com `hash do JS é o esperado` `ok`; a ferramenta da release anterior, `600 Deploy/Output/modelo-kart-01/tools/check_served.py`, dá `37/37` sobre esse bundle. **Para voltar a publicar depois do caminho A**: reativar o Pages (Settings → Pages → *Source* = GitHub Actions), **conferir a política de ramos do ambiente** (a reativação recria o ambiente restrito ao ramo padrão; em staging liberar de novo) e *Re-run all jobs* da execução verde | **A**: busca nova devolve 404; na republicação, 200 com o `<hash>` da execução reexecutada. **B/C**: hash esperado servido; `check_served` de `modelo-kart-01` 37/37 | até 10 min (republicação pelo caminho A: ≈ 7,5 min no ensaio de 2026-10-21; restauração pelo caminho B: ≈ 2 min 12 s no ensaio de 2026-10-27) |
| R3 | executar *Verify* 1, 2 e 11 na versão restaurada (**B/C**; a tela inicial é a da release anterior: sem seletor, só a sintética); no caminho **A**, confirmar que a URL responde 404 nos 4 navegadores de referência | **B/C**: HTTPS válido; carregamento abaixo de 10 s; a tela anterior funciona. **A**: nenhuma página servida | 10 min |
| R4 | registrar a reversão: hash revertido, alvo restaurado (A: "não publicado"; B/C: hash restaurado e número da execução), gatilho observado, horário | linha em `docs/kart-park-device-log.md` e relatório em `reports/deploy-validation/` | 5 min |
| R5 | se a causa for da aplicação (abertura, seletor, crédito, desenho, barreira, zebra, som, vibração, corte, fps, idioma), abrir `FAIL CODE` para o estágio de código; se for do empacotamento (base, cache, HTTPS, Pages, política de ramos, *asset* a mais, SHA-256 do arquivo de pista diferente do registrado); ou de processo (promoção sem decisão), `FAIL` deste estágio | relatório com a classificação | 15 min, no mesmo dia |

Staging reverte-se sempre deste modo (R1 e R2 sobre `edumatosr6-svg/kartle-staging`; lá o `deploy` não pede aprovação) e nunca é
precondição para reverter produção.

Dados: nada a desfazer. A feature não grava no navegador e não há servidor (DES-0012, `REL-0002`); um jogador com a página nova
em cache continua a jogá-la por até 10 min; depois busca o `index.html` restaurado (ou o 404 do caminho A). O registro de volta
e o texto compartilhado na sintética são os mesmos nas duas versões. `tracks/registry.json` **não** é revertido por uma reversão
de bundle: a entrada `kart-park` 1 em `STAGING` continua válida (a versão publicada é imutável; uma correção é a versão 2).

**Point of no return:** não existe nesta release. Em staging a execução verde anterior é reexecutável enquanto o Actions a
retiver (90 dias) e, passado isso, o caminho C reconstrói de um commit — o repositório é o artefato de reversão; em produção
nada foi publicado e a reversão de uma aprovação indevida é despublicar (caminho A), sempre possível. O único ato que tornaria a
reversão impossível seria **apagar o histórico do repositório** (`push --force` sobre `master`), que nenhum passo deste runbook
faz. O ato que **não se reverte por projeto** é outro: gravar `PRODUCTION` no registro da pista com uma referência que não seja a
de uma decisão registrada — não é um ponto sem retorno técnico (o commit pode ser revertido), mas é a violação de NFR-0012, e por
isso este runbook não o contém.
