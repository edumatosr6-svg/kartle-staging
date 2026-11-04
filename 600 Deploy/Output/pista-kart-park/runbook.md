---
title: Runbook — publicar em staging, verificar e reverter a release da Kart Park; promoção a produção BLOQUEADA pela decisão Esri
feature: pista-kart-park
stage: deploy
status: draft
version: 1.4.0
sources: [DM-0001, DM-0002, DES-0003, DES-0004, DES-0005, DES-0007, DES-0008, DES-0009, DES-0011, DES-0012, ADR-0005, ADR-0007, NFR-0001, NFR-0002, NFR-0004, NFR-0005, NFR-0006, NFR-0008, NFR-0010, NFR-0011, NFR-0012, NFR-0013, NFR-0014, US-0007, TEST-0008, TEST-0009, TEST-0010, TEST-0012]
---

# Runbook

Para quem não escreveu a release. Executar da raiz do repositório, com todo caminho entre aspas. Nenhum passo é executado por um
loop: cada um é de um humano, e a promoção a produção é sempre do dono do produto (D-DP-06) — **e nesta release ela não existe**:
a Kart Park é derivada de imagem Esri World Imagery e a decisão sobre essa licença **bloqueia a promoção** (ADR-0005; NFR-0012;
`DOMAIN.md`: o ponto Esri de 2026-10-22 e a decisão de 2026-11-03 — o ponto Esri continua aberto, a Kart Park segue só em staging, as
quatro features vão a produção juntas e nenhum commit de `master` vai a `origin` até a decisão). O provedor é o **GitHub Pages** (D23): o pipeline é `.github/workflows/pages.yml`, a
publicação é um push e a promoção seria um clique de aprovação no ambiente `github-pages` do repositório de produção. Nomes
usados abaixo:

| Nome | Valor (não é segredo) |
|---|---|
| dono do produto | conta GitHub `edumatosr6-svg` (revisor obrigatório do ambiente `github-pages` de produção); é quem executa as linhas humanas H1–H12, quem escreve em `docs/kart-park-device-log.md` e quem decide a licença Esri |
| repositório de **produção** | `edumatosr6-svg/kartle` — remoto local `origin`, ramo `master`, site `https://edumatosr6-svg.github.io/kartle/` (404 hoje); execuções em `https://github.com/edumatosr6-svg/kartle/actions`; `origin/master` = `05c3570` (2026-10-22) |
| repositório de **staging** | `edumatosr6-svg/kartle-staging` — remoto local `staging`, ramo `staging`, site `https://edumatosr6-svg.github.io/kartle-staging/`; execuções em `https://github.com/edumatosr6-svg/kartle-staging/actions` |
| `<sha>` | o commit verificado e candidato: **`2aa013e67de49fb842f42cda573b3b82df5cf824`** (2026-11-03T17:44:39 −03:00; seed revisão 2, acabamento visual: código `fbfb073`, `code-validation-20261103-2004.md` `SUCCESS`; testes `2aa013e`, `test-validation-20261103-2043.md` `SUCCESS`, 467/467, 126 desta feature). **Publicado em staging** em 2026-11-04 pela execução **41832829595** (commit `1966c4a`, só registros acima de `2aa013e`; *Promote* 7), validado em `deploy-validation-20261104-1302.md`. Contra `e70aad9` muda, na árvore construída, só `src/main.ts` e `src/trackScene.ts`. **Regra de invalidação**: um commit posterior não invalida a release quando não muda a árvore construída (`src/`, `index.html`, `package.json`, `package-lock.json`, `tsconfig.json`, `vite.config.*`) nem os **bytes** dos três arquivos de pista (blob e resumo registrado iguais), desde que a execução do workflow desse commit fique verde e `check_served` dê o mesmo resultado sobre o mesmo `<hash>`; qualquer outro invalida (veredito de testes novo e nova rodada deste estágio) |
| `<hash>` | o hash de conteúdo no nome do JS (`assets/index-<hash>.js`), impresso no passo *Build* da execução que se publica; para `<sha>`, **`BMmvlQeM`** (696 559 bytes; o passo *Build* da execução 41832829595 e o build limpo de `2aa013e`, base `/kartle-staging/`, byte a byte iguais) |
| `<sha-anterior>` / `<hash-anterior>` | a execução verde **anterior** à em vigor (41832829595): **41156803005**, commit `1bb63aa` (2026-10-31T01:44:42Z; só registros sobre a árvore de `e70aad9`), JS `index-DmxsQuIL.js` (694 178 bytes) — o mesmo jogo com o crédito no painel do resultado, **sem o acabamento** de US-0007; validada em `deploy-validation-20261103-1744.md`. Antes dela: 41109469203 (`e70aad9`, o mesmo `DmxsQuIL`) e 41101055606 (`6b314b2`, `index-BwruE9Pq.js`, sem o crédito no painel — só emergência) |
| "execução verde" | uma execução do workflow `pages` com os dois trabalhos (`build`, `deploy`) concluídos com sucesso |
| `check_served` | `python -I "600 Deploy/Output/pista-kart-park/tools/check_served.py" <URL> index-<hash>.js` — três GET de leitura; `checks=79 failed=0` aprova (a ferramenta não confere o acabamento: isso é de `npm test` e de H9–H12) |
| `check_bundle` | `python -I "600 Deploy/Output/pista-kart-park/tools/check_bundle.py" dist tracks/registry.json` — leitura local; `checks=88 failed=0` aprova (com `docs/kart-park-device-log.md` como terceiro argumento, 92) |
| conferência byte-exata | `git ls-files --eol tracks/sources/kart-park.json src/tracks/kart-park-v1.json tracks/registry.json` — leitura; aprova com `attr/-text` nas três linhas e `i/` igual a `w/` em cada uma (`i/crlf w/crlf` na origem; `i/lf w/lf` no arquivo publicado e no registro) |
| registro em tela | `docs/kart-park-device-log.md` — do dono do produto (criado em `1bb63aa`, com a execução no celular de 2026-10-30 sobre `e70aad9`; nenhum estágio o escreve, §14), no molde de `docs/kart-01/device-log.md`: uma entrada por aparelho e orientação, com build (`<sha>`, `index-<hash>.js`), aparelho, navegador, versão, DPR, área de jogo em px, orientação, método da contagem, `fpsPerSecond`, `minFps`, resultado por roteiro E2E-01 a E2E-09, download, data |
| registro da pista | `tracks/registry.json`: entrada `kart-park` 1 em **`STAGING`** (SHA-256 `04ce5e51…`, 43 013 bytes); só passa a `PRODUCTION` por `npm run track -- promote kart-park 1 --esri-decision "<referência>"`, na entrega que promover |

Artefato: `dist/` (HTML, JS e CSS estáticos), construído **pelo workflow** a partir de `<sha>`; o arquivo de pista da Kart Park
está dentro do JS. Não há banco, migração de dado, armazenamento no navegador nem aplicativo nativo. A feature fica ativa ao
servir o `index.html` novo (sem flag — ADR-0005).

**A regra byte-exata.** O SHA-256 que `tracks/registry.json` guarda para a origem (`prep.originSha256`) e para o arquivo
publicado (`sha256`) é o dos **bytes do blob no git**, e o `npm test` do workflow (Linux) confere esses bytes. Por isso os três
arquivos estão marcados `-text` em `.gitattributes` (`5ed7a5b`): o git não normaliza o fim de linha deles no `git add`. A falha
de 2026-10-27 (execução 40603572961 de `d9139a2`: CHK-TEST-0012-01/-05) foi exatamente essa normalização — a árvore de trabalho
no Windows tinha CRLF, o blob ficou LF, e os testes locais mediram a árvore e não o commit. Antes de qualquer push que toque
`tracks/` ou `src/tracks/`, a conferência byte-exata é obrigatória (*Promote* 1); um arquivo de pista novo herda a regra pelos
padrões do `.gitattributes`.

**Alvo de reversão.** Três caminhos, e cada passo de *Roll back* nomeia qual aplica:

| Caminho | Quando se aplica | O que R1 faz |
|---|---|---|
| **A — despublicar** | não há execução verde anterior no repositório (**produção, hoje**: nada foi publicado; 404) | Settings → Pages → menu "…" ao lado da URL do site → **Unpublish site**; a URL responde 404 do GitHub. Ensaiado em staging em 2026-10-21 |
| **B — reexecutar a última execução verde anterior** | existe uma execução verde anterior (**staging, hoje**: 41156803005, `1bb63aa`, serve `<hash-anterior>`) | Actions → workflow `pages` → essa execução → **Re-run all jobs**; o workflow reconstrói esse commit (`npm ci`, `npm test`, build) e publica. Conferir antes a política de ramos do ambiente se o site tiver sido despublicado entretanto. A página volta ao jogo de `e70aad9` — o mesmo treino, o crédito no painel do resultado, a Kart Park **sem o acabamento** (sem faixa de borda, relevo, pneus nem tons; a barreira volta ao desenho anterior): não cruza nenhum gatilho anterior à revisão 2, por isso é reversão de qualidade equivalente salvo US-0007. **Procedimento ensaiado** em 2026-10-27 19:29–19:33Z no mesmo site (reversão ≈ 1 min 17 s, restauração ≈ 2 min 12 s); não repetido para o par 41156803005 ↔ 41832829595 (DIV-DP-03) |
| **C — reverter e reconstruir** | quando B não existe ou a execução anterior já não pode ser reexecutada (retenção de 90 dias) | **C1 — voltar ao build anterior**: `git revert --no-edit 2aa013e fbfb073` (os commits de `e70aad9..2aa013e` que tocam a árvore ou os testes, do mais novo ao mais velho — testes e código da revisão 2) `&& npm test && git push staging master:staging`; a árvore volta à de `e70aad9` (444 testes). **C2 — retirar a Kart Park** (ADR-0005: "o artefato anterior não contém a Kart Park"): `git revert` da cadeia desta feature que toca a árvore, do mais novo ao mais velho (`2aa013e`, `fbfb073`, `e70aad9`, `38354bb`, `1254443`, `5ed7a5b`, `1a12076`, `b44bacb`, `c5dfcb3`, `ba221ad`) — os commits posteriores de outras features editam os mesmos arquivos (`src/main.ts`, `src/lap.ts`, `src/physics.ts`, `index.html`), por isso **conflitos são esperados** e `npm test` decide; a alternativa, para produção, é um ramo a partir de `6ea3862` (ADR-0005). Em C, o push só sai depois de `npm test` verde **e** da conferência byte-exata. **Em que árvore se executa C1**: num checkout com fim de linha LF — a árvore de trabalho atual, ou um clone novo feito com `git -c core.autocrlf=false clone …` (ou com `core.autocrlf=false` antes do checkout). Num clone novo com `core.autocrlf=true` (o padrão deste Windows) o `npm test` de C1 reprova 2 checks de features contidas (`tests/dirigibilidade-contract.test.ts` CHK-TEST-0010-01, `tests/race-lap-validation-frozen.test.ts` CHK-TEST-0014-05: `fail 2` de 444) só porque o checkout grava CRLF — não é defeito da reversão; a conferência byte-exata do *Promote* 1 cobre só os três arquivos de pista. **Ensaiado** em 2026-11-04 num clone descartável com checkout LF (`deploy-validation-20261104-1302.md`): sem conflito, 444/444, e o build `--base=/kartle-staging/` reproduz byte a byte `index-DmxsQuIL.js`, o CSS e o `index.html` servidos pela 41156803005; nada enviado. |

## Preconditions

- [x] **Commit verificado existe**: `2aa013e67de49fb842f42cda573b3b82df5cf824`. Quem executa confere: `git log --oneline -8`
      mostra `2aa013e` ou commits acima dele que não invalidam (regra em `<sha>`; hoje `2aa013e` é a ponta), e `git status`
      não acusa modificação em `src/`, `scripts/`, `tests/`, `tracks/`, `index.html`, `package.json` nem no lockfile.
- [x] Veredito de testes `SUCCESS` **sobre `2aa013e`**: `500 Tests/Output/pista-kart-park/reports/test-validation/test-validation-20261103-2043.md`
      (seed revisão 2; 467/467, 126 desta feature, execução fresca). Validação de código `SUCCESS`: `code-validation-20261103-2004.md`
      (`fbfb073`).
- [x] **Ordem de entrega** (NFR-0011): `b86b200` (`dirigibilidade`) e `6ea3862` (`modelo-kart-01`) são ancestrais de `<sha>` —
      `git merge-base --is-ancestor b86b200 2aa013e`.
- [x] **Regra byte-exata conferida** (2026-11-03): `git ls-files --eol …` (os três arquivos) dá `attr/-text`, `i/crlf w/crlf` na
      origem e `i/lf w/lf` nos outros dois; os blobs em `2aa013e` são os de `5ed7a5b` (`a1f57085…`, `cfdeec07…`, `d5ee2187…`).
- [x] **Arquivo da pista inalterado pelo acabamento** (NFR-0014): `git diff --quiet e70aad9 2aa013e -- tracks src/tracks`; o
      literal no JS do build limpo dá `04ce5e51…` = registro; `trackVersion` 1; **nenhuma republicação** (`npm run track` não é
      executado nesta release além de `verify`).
- [x] **Build limpo local do candidato**: `index-BMmvlQeM.js`, `measure_dist` 714 001 bytes `within_limit=True`, `check_bundle`
      88/88 (2026-11-03, `01-release.md`).
- [x] Validação de staging `SUCCESS` para `<sha>`: `600 Deploy/Output/pista-kart-park/reports/deploy-validation/deploy-validation-20261104-1302.md`
      sobre a execução 41832829595 (servido = build limpo byte a byte; `check_served` 79/79; `check_bundle` 88/88; C1 ensaiado).
      As correções desta versão do registro (ISSUE-07, -08, -09 daquele relatório) aguardam a revalidação.
- [x] Histórico de migração: **não se aplica** — não há banco; o esquema 3 mantém o leitor do 2; nada persistido muda (`REL-0002`).
- [x] Feature flag: **não há** (ADR-0005). O ponto de aplicação humano é a promoção, bloqueada.
- [x] **Repositórios e ambientes configurados** (2026-10-21): produção com revisor obrigatório `edumatosr6-svg` e política de
      ramos restrita a `master`; staging sem revisor e política de ramos **sem restrição** — a reconferir depois de qualquer
      despublicação. Nenhuma credencial configurada: o Pages usa o token OIDC da execução (D-DP-05).
- [x] **`<sha>` publicado em staging** (*Promote* 7): em 2026-11-04 o ramo `staging` avançou de `1bb63aa` para `1966c4a` (avanço
      rápido; só registros acima de `2aa013e`); a execução 41832829595 ficou verde (467/467) e a URL serve `index-BMmvlQeM.js`
      (`Last-Modified` 2026-11-04 12:53:01 GMT; `check_served` 79/79).
- [x] **Registro da pista em `STAGING`**: `kart-park` 1, SHA-256 `04ce5e51…`, sem `promotedAtUtc` nem `esriDecisionRef`; o bundle
      servido reproduz o arquivo byte a byte. `npm run track -- promote` recusa sem `--esri-decision` (CHK-TEST-0012-04;
      executado pelo validador em 2026-10-28: saída 1, nada escrito).
- [x] **Procedimento de reversão ensaiado em staging** (2026-10-27 19:29–19:33Z, caminho B, mesmo site e mesma workflow; ciclo
      ≈ 3 min 47 s; aceito pela validação de 2026-10-28). O alvo é a 41156803005, verde e retida; o caminho C1 foi ensaiado em 2026-11-04 (checkout LF; *Alvo de reversão*).
- [ ] **Linhas humanas H1–H12 registradas em `docs/kart-park-device-log.md`** (o arquivo existe desde `1bb63aa`) sobre o build de
      `<sha>` (`index-BMmvlQeM.js`): H1–H8 seguem abertas (a execução no celular de 2026-10-30 é de `e70aad9`, parcial e sem fps)
      e H9–H12 são as do acabamento (US-0007; NFR-0002 com o acabamento; E2E-09). As linhas de aparelho do veredito de testes
      dependem disso (DIV-DP-01).
- [ ] **Decisão Esri registrada em `DOMAIN.md`** pelo dono do produto (identificador e data). Em 2026-11-03 ficou registrado que
      **o ponto Esri continua aberto** e a produção espera (opção 1). **Enquanto não estiver marcada, não existe passo de produção para
      esta release** (NFR-0012). Marcada, a promoção é da entrega que acrescentar o crédito da Esri e gravar `PRODUCTION` no
      registro, levando as quatro features juntas.
- [ ] **Portas humanas das releases contidas** no mesmo build (`race-lap-validation` treino contínuo, `dirigibilidade` acerto v6
      sem drift, `modelo-kart-01` marcas de pneu): pelos runbooks dessas features, na mesma sessão de aparelho que H1–H12,
      escolhendo "Pista sintética" quando a lista for da sintética; os registros delas passaram a `<sha>` em 2026-11-04
      (rascunho, por validar; DIV-DP-12).
- [x] Monitoramento decidido: **vigilância manual conforme este runbook**, nenhum monitor externo (decisão de 2026-10-21; `REL-0005`).
- [x] Node na versão fixada: `.nvmrc` = `24` (o workflow lê `node-version-file`; a execução usou v24.22.1).

## Promote (até staging; o passo de produção não existe nesta release)

| # | Passo | Esperado | Leva | Desfaz-se por |
|---|---|---|---|---|
| 1 | conferir o commit e os bytes: `git log --oneline -8`; `git status`; **conferência byte-exata** (`git ls-files --eol tracks/sources/kart-park.json src/tracks/kart-park-v1.json tracks/registry.json`) | `<sha>` na cadeia (ou só commits que não invalidam acima dele); nenhuma modificação local nos caminhos da regra; `attr/-text` nas três linhas e `i/` = `w/` (`crlf` na origem, `lf` nos outros dois). Se aparecer `attr/text`, `attr/auto` ou `i/lf w/crlf`, **parar**: o blob não é o registrado — corrigir `.gitattributes`, `git add --renormalize` do arquivo e conferir de novo antes de qualquer push | 1 min | nada a desfazer: leitura local |
| 2 | `npm ci` | saída 0; `package-lock.json` inalterado | 1 a 2 min | nada externo: só recria `node_modules/` |
| 3 | `npm test` | saída 0; `467 passed, 0 failed, 0 skipped` (126 em `tests/pista-kart-park-*.test.ts`) | 1 a 2 min | nada a desfazer |
| 4 | `npm run track -- verify kart-park 1` | `VERIFIED`, V01 a V18 `PASS`; nada escrito | 10 s | nada a desfazer: leitura |
| 5 | `npm run build` | saída 0; `dist/assets/index-<hash>.js` e um `.css`, nenhum outro arquivo em `dist/assets/`; anotar o `<hash>` — conferência local; o artefato publicado é o do workflow | 1 min | nada externo: apagar `dist/` local |
| 6 | `python -I "600 Deploy/Output/race-lap-validation/tools/measure_dist.py" dist` e `check_bundle` | `within_limit=True` (≈ 714 KB, RNF02); `check_bundle` `checks=88 failed=0` (o arquivo da Kart Park no JS com o SHA-256 do registro; o crédito no painel do resultado; 0 `esri`; 0 recorde): **não publicar** uma árvore com reprovação como candidato a validação | 10 s | nada a desfazer: leitura |
| 7 | publicar em **staging**: `git push staging master:staging` e acompanhar a execução `pages` desse commit em `https://github.com/edumatosr6-svg/kartle-staging/actions`; depois `check_served https://edumatosr6-svg.github.io/kartle-staging/ index-<hash>.js` em janela anônima (até 10 min de cache). Se o `deploy` falhar **sem executar nenhum passo**, liberar a política de ramos do ambiente e *Re-run all jobs*. **Antes do envio**, se se quiser H12 contra o servido: capturar a sintética em staging enquanto ainda serve `index-DmxsQuIL.js`. **Estado em 2026-11-04**: **feito** — push de `1966c4a` (`2aa013e` + registros), execução 41832829595 verde, `index-BMmvlQeM.js` servido, `check_served` 79/79 | execução verde (`npm test` 467 aprovados; `Measure dist` `total_bytes` ≈ 714 001, `within_limit=True`; `deploy` concluído); *Build* com `index-BMmvlQeM.js` (outro hash: anotar e conferir contra um build limpo); `check_served` `checks=79 failed=0` com o `<hash>` do passo *Build* | 4 a 5 min (execução) + até 10 min de cache | R1/R2 sobre `kartle-staging` (caminho B: 41156803005; ou A) |
| 8 | **abrir uma entrada nova em `docs/kart-park-device-log.md`** (dono do produto; o arquivo existe) para o build de `<sha>` e anotar o alvo de reversão: staging → execução 41156803005 (`1bb63aa`, `index-DmxsQuIL.js`), caminho B; produção → "nada publicado; nenhuma promoção desta release (ponto Esri aberto, decisão de 2026-11-03)" | entrada com o build (`<sha>`, `index-<hash>.js`) e a nota | 5 min | nada a desfazer: anotação |
| 9 | executar `smoke.md` em staging (D1–D22, M1–M13) **e as linhas humanas H1–H12 abaixo**, e registrar em `docs/kart-park-device-log.md` (uma entrada por aparelho e orientação) — só sobre um build que passe em `check_served` | todas as linhas dentro do limiar; D4/M4 com 2 opções, Kart Park marcada e os 3 elementos do crédito; D9/M10 o painel do resultado de **cada** volta na Kart Park com o crédito, sem parar o kart; D7/D18 sintética sem crédito; D11/M12 sem atravessar a barreira; D12 som só na zebra; M7 vibração só na zebra; D15/M11 0 requisições; D19–D21/M13 o acabamento como em US-0007; D22 sintética 0 pixel diferente; D14/M9 `minFps` ≥ 60 e ≥ 30 com o acabamento | 150 a 210 min | nada a desfazer: observação |
| 10 | opcionalmente, na mesma sessão: as listas pendentes das releases contidas, pelos runbooks delas, sobre este bundle | cada lista no seu registro | 90 a 150 min | nada a desfazer |
| 11 | **parar.** Não há pergunta de promoção (D-DP-06 sem objeto). Registrar no relatório de validação: "staging verificado; produção bloqueada pela decisão Esri; registro em `STAGING`". Levar ao dono do produto as duas decisões de *Promoção bloqueada* | decisões (a) e (b) registradas em `DOMAIN.md` quando existirem; sem resposta, nada é promovido | até a decisão | nada a desfazer |

**Não fazer nesta release** (decisão de 2026-11-03: nenhum commit de `master` vai a `origin` até a decisão Esri):
`git push origin master` com `<sha>` ou qualquer commit de `master` a partir de `ba221ad`;
**Approve and deploy** em qualquer execução de `edumatosr6-svg/kartle` cujo commit contenha esta feature; `npm run track --
promote` com uma referência que não seja a de uma decisão registrada em `DOMAIN.md`; `git push --force` em qualquer ramo. Se uma
execução dessas aparecer em *Waiting* por engano: **Reject** (nada é publicado).

## Promoção bloqueada — a decisão Esri e as opções para as releases contidas

**Por que está bloqueada.** O traçado da Kart Park (`tracks/sources/kart-park.json`) foi gerado pelo dono do produto a partir
do caminho OpenStreetMap `way/128739206` **e de bordas detectadas em imagem Esri World Imagery** (seed, *Origem*). O dado OSM
leva o crédito e a ODbL. O dado derivado da imagem Esri tem licença por decidir: o dono do produto decidiu em 2026-10-22 usar o
dado agora, mostrar o crédito OSM/ODbL, manter a Kart Park **só em staging** e decidir a licença Esri **antes da promoção para
produção** (`DOMAIN.md`; NFR-0012; ADR-0005). O código aplica a regra: `npm run track -- promote` recusa sem
`--esri-decision "<referência>"` (DES-0010, DES-0011; CHK-TEST-0012-04).

**(a) A evidência que o dono do produto precisa ler para decidir** (nenhuma é conclusão deste runbook):

| Evidência | O que procurar | Onde |
|---|---|---|
| Termos de uso da Esri para os mapas base do ArcGIS Online (o serviço *World Imagery*) | se dado vetorial **derivado** da imagem pode ser redistribuído num produto próprio, sob que condições (atribuição, uso não comercial, proibição de "derivative products"), e se a redistribuição sob ODbL junto ao dado OSM é compatível | `esri.com/legal` (*Terms of Use* / *Products and Services Terms*) e a página do item *World Imagery* no ArcGIS Online, seções *Terms of Use* e *Credits* |
| A permissão da Esri para traçar o World Imagery **no OpenStreetMap** | se cobre dado traçado da imagem **fora** do OSM (como as bordas detectadas aqui) | página *Esri World Imagery* no wiki do OpenStreetMap |
| A proveniência do próprio arquivo de origem | que partes vieram do caminho OSM (linha central) e que partes da imagem (bordas → larguras por ponto; zebras?) | seed (`SEED.md`, *Origem*; `NOTES.md`); `tracks/sources/kart-park.json` |
| O texto de crédito que a Esri exige, se exigir | o texto exato a exibir ao lado do crédito OSM no seletor e no painel do resultado de cada volta, na entrega que promover (REQ-FEAT-0006-14; DES-0011; ADR-0007) | os mesmos termos; o crédito do item *World Imagery* |

**Desfechos possíveis:**

| Decisão registrada em `DOMAIN.md` | Consequência |
|---|---|
| **libera** (com ou sem crédito obrigatório) | entrega nova: o crédito da Esri em `creditFor` (`src/lapMessages.ts`) e nos dois lugares do crédito (`#track-credit`, `#lap-training-result-credit`); `npm run track -- promote kart-park 1 --esri-decision "<identificador e data>"` (commit próprio; conferência byte-exata antes do push, porque `tracks/registry.json` muda); `npm test`; nova rodada deste estágio; `git push origin master`; **Approve and deploy**; `smoke.md` *Verificação em produção* |
| **não libera** | a Kart Park fica só em staging; para produção, ou uma versão 2 da pista sem o dado Esri (feature nova no pipeline), ou a Kart Park sai do catálogo (mudança de F-Spec); `master` continua a carregar a feature |
| **adia** | o estado de hoje; a opção (b) decide o resto |

**(b) Como as releases contidas chegam a produção entretanto** — qualquer commit de `master` a partir de `ba221ad` contém a Kart
Park; promover `master` é promover a Kart Park (ADR-0005). **A escolha é do dono do produto**:

| Opção | O que se faz | O que custa | O que exige |
|---|---|---|---|
| **1 — esperar a decisão Esri** e promover tudo junto | nenhum push a `origin` até a decisão; depois, a entrega que promover leva todas as features de uma vez | produção continua em 404 até lá; as portas humanas das releases contidas fecham em staging sobre este bundle | a decisão (a) |
| **2 — um ramo sem a Kart Park** | `6ea3862` (o último build validado sem a Kart Park) carrega `arcade-assistido-v5` **com drift e turbo**, que o dono do produto retirou depois (seed `dirigibilidade` rev 6; acerto v6 de 2026-10-29) — publicá-lo como está levaria a produção uma versão já aposentada. Levar o acerto v6, o treino contínuo e as marcas de pneu sem a Kart Park exige um ramo a partir de `6ea3862` com essas mudanças reaplicadas sem a feature: é uma **entrega nova**, com veredito de testes e registro de release próprios, fora deste registro | uma entrega a mais, mantida em paralelo a `master` até a decisão; `origin master` só por avanço rápido, **nunca** `push --force` | nenhuma decisão Esri; a decisão de fazer essa entrega |

Nenhuma das opções é tomada por um loop (D-DP-06). **Escolha registrada em 2026-11-03** (`DOMAIN.md` desta feature e das três
contidas): **opção 1** — esperar a decisão Esri e levar as quatro features juntas; nenhum push a `origin` até lá (DIV-DP-15).

## Verify (em staging; em produção só na entrega que promover)

| # | Verificação (`smoke.md`) | Esperado |
|---|---|---|
| 1 | D1 / M1 HTTPS em `https://edumatosr6-svg.github.io/kartle-staging/` — **verificação manual** (+ `check_served`), a única vigilância de disponibilidade | cadeado válido; 0 recursos inseguros; `index.html`, JS e CSS com 200 e nenhum outro *asset* (o acabamento não acrescenta textura nem imagem); `<hash>` esperado; o arquivo da Kart Park no JS com o SHA-256 registrado (NFR-0014); `check_served` 79/79 (RNF06; NFR-0006; NFR-0010) |
| 2 | D2 / M2 carregamento em 4G, cache vazio | kart responde em menos de 10 s (RNF01) |
| 3 | D3 / M3 bytes transferidos na primeira visita | abaixo de 3 145 728 bytes (RNF02); esperado da ordem de 190 KB comprimidos |
| 4 | D4 / M4 tela inicial | 2 opções com a Kart Park marcada; rótulo "… (traçado aproximado) · 687 m"; os 3 elementos do crédito com o link; `#track-status` `kart-park`; um botão "volta de treino"; nenhum recorde (AC-US-0001-01, -02; AC-US-0006-01..03, -07..-09; NFR-0005; D-DP-04) |
| 5 | D5 / M5 console | 0 erros ao carregar, ao trocar de pista e num treino |
| 6 | D7, D8 troca de pista, "encerrar treino" e recarga | sintética sem crédito; de volta à Kart Park com crédito; "encerrar treino" volta ao seletor sem tela de resultado; recarga abre na Kart Park; armazenamento vazio (AC-US-0001-02, -05; AC-US-0006-04) |
| 7 | D9, D10, D11 / M10, M12 treino de voltas seguidas na Kart Park | o resultado de cada volta no painel `#lap-training-result`, sem parar o kart, com total, 4 setores e **o crédito dentro do painel** (ADR-0007); a volta inválida marca "marcador pulado" (ou o corte) e segue, e o seu resultado traz o crédito; o kart bate na barreira e não passa (AC-US-0002-08, AC-US-0003-06, -11, AC-US-0004-04, -06, AC-US-0005-03, AC-US-0006-04..06) |
| 8 | D12 / M7, M8 retorno da zebra | som grave repetido só com roda na zebra em Chrome e Firefox, nenhum desligado; vibração de 20 ms a cada 0,25 s só na zebra, nenhuma na pausa; sem `navigator.vibrate`, sem erro e sem aviso (AC-US-0005-07..12; REQ-FEAT-0005-16..19) |
| 9 | D15 / M11 rede bloqueada | 0 requisições da escolha ao fim de um treino de duas voltas; crédito visível sem rede (NFR-0004; REQ-FEAT-0006-12) |
| 10 | D16 navegador em inglês | nome, "Pista sintética" e crédito em português; o resto em inglês (AC-US-0006-07, -08) |
| 11 | D18 regressão na sintética | painel do resultado de cada volta **sem** crédito; a simulação e o Kart 01 como nos registros das releases contidas (NFR-0008) |
| 12 | D17 ferramentas | `check_bundle` 88/88 local; `check_served` 79/79 em staging |
| 13 | D19–D22 / M13 acabamento (H9, H10, H12) e D14 / M9 taxa de quadros com o acabamento (H11) | faixa de borda contínua, zebra com relevo, pneus pretos onde o kart encosta sem entrar, grama em 2 tons iguais em cada abertura, nos dois canais; sintética 0 pixel diferente; `minFps` ≥ 60 no notebook e ≥ 30 no celular em paisagem e retrato (US-0007; NFR-0002) |
| 14 | repetir 1, 4, 5 e 11 depois de 24 h (vigilância manual) | mesmos resultados; a execução de `<sha>` continua a última em `https://github.com/edumatosr6-svg/kartle-staging/actions`; **nenhuma** execução aprovada em `https://github.com/edumatosr6-svg/kartle/actions` com commit que contenha a feature |

**Gatilhos de reversão em staging (D-DP-03):** carregamento de 10 s ou mais em 4G; transferência de 3 145 728 bytes ou mais; o
jogo a abrir na sintética ou o seletor com uma opção só; o crédito OSM/ODbL ausente do seletor ou do painel do resultado de uma
volta na Kart Park, ou presente na sintética; `41,45` ou "recorde" em qualquer tela; o kart a atravessar a barreira; zebra sem som
no teclado (som ligado) ou sem vibração no celular de referência, ou som/vibração fora da zebra ou na pausa; erro no console ao
carregar, ao trocar de pista ou durante o treino (inclusive 404 de um *asset* ou `track-data`); `#track-status` sem `kart-park`
ao abrir; qualquer recurso servido sem HTTPS; `minFps` abaixo de 60 no notebook ou de 30 no celular de referência com o
acabamento na tela; a faixa de borda interrompida, o kart a entrar nos pneus ou a parar a mais de 5 cm deles, a grama num tom só
ou com tons que mudam entre aberturas; qualquer diferença na imagem da sintética (E2E-09); um *asset* novo (textura, imagem). O
alvo do caminho B (`1bb63aa`, árvore de `e70aad9`) não tem o acabamento: reverter para ele retira US-0007 inteira e mais nada, e
a decisão de reverter é do dono do produto, porque o mesmo build serve as releases contidas. **Gatilho em produção, hoje:** qualquer execução aprovada em
`edumatosr6-svg/kartle` cujo commit contenha a feature — reverter pelo caminho A no mesmo instante.

## Linhas humanas — o smoke de aparelho que o dono do produto executa (H1–H12)

As linhas do estágio de testes que só a tela, o aparelho, o ouvido, a mão, o navegador nomeado, a rede bloqueada ou o relógio de
parede decidem (`500 Tests/Output/pista-kart-park/98-divergences.md`, linhas `unverified`; `test-strategy.md` E2E-01 a E2E-09,
com E2E-02 e E2E-03 no treino de voltas seguidas e E2E-03, E2E-05 e E2E-09 cobrindo o acabamento da revisão 2). H1–H8 são as de
antes da revisão 2; **H9–H12 são as do acabamento** (US-0007; NFR-0002 1.1.0). Executadas sobre a URL de **staging**, num build que passe em `check_served`,
nos aparelhos e navegadores nomeados, com a página em primeiro plano, e registradas em `docs/kart-park-device-log.md`. Nenhuma pode
ser feita por um loop nem sob automação do navegador (ritmo inválido; vibração inobservável).

| # | Linha | O que se faz | O que se registra | Critério de aprovação | Roteiro |
|---|---|---|---|---|---|
| H1 | seletor, abertura na Kart Park, crédito com link, nada persistido | abrir a URL em **Chrome, Edge, Firefox e Safari**; ler o seletor e o crédito; clicar no link; escolher a sintética e recarregar; depois de treinos nas duas pistas, abrir o painel de armazenamento | as 2 opções com a Kart Park marcada e o rótulo; os 3 elementos do crédito; o link abrindo `openstreetmap.org/copyright` em outra aba; a recarga na Kart Park; armazenamento vazio; por navegador | AC-US-0001-01: 2 opções; AC-US-0001-02: 4 de 4 recargas na Kart Park; AC-US-0001-05: 0 registros; AC-US-0006-01..03, -07, -08; NFR-0005 | E2E-01 |
| H2 | troca de pista e "encerrar treino" | em Chrome: trocar de pista nos dois sentidos antes de um treino; iniciar um treino, completar uma volta, clicar "encerrar treino" e trocar de pista; iniciar outro treino e trocar de pista com a volta em andamento | o kart na largada da pista escolhida; "encerrar treino" volta ao seletor sem tela de resultado e sem resultado novo; a troca com volta em andamento descarta a volta sem resultado; a única oferta "volta de treino" | DES-0005; AC-US-0001-01; CHK-TEST-0007-05/-07 na tela | E2E-02 |
| H3 | treino de voltas seguidas na Kart Park: desenho, resultado com crédito, corte, barreira, foco, recarga, 60 fps | no **notebook de referência**: treino de **ao menos duas voltas** válidas seguidas; uma volta com marcador pulado; bater na barreira a ≈ 50 km/h; perda de foco; recarga a meio de uma volta; um treino na sintética | asfalto de larguras variáveis, zebras do lado declarado, barreira contínua; a cada chegada, o painel `#lap-training-result` com validade, total, 4 setores e **o crédito dentro do painel**, sem o kart parar; a volta com marcador pulado marca "marcador pulado" e o seu resultado traz o crédito; o kart bate e não passa (ricochete estranho é observação); pausa na perda de foco; recarga sem resultado; sintética sem crédito no painel (a taxa de quadros é H11) | AC-US-0002-08, AC-US-0005-03, AC-US-0004-06; AC-US-0003-06, -11; AC-US-0004-04: 0 travessias; AC-US-0006-04..06 (ADR-0007); REQ-FEAT-0003-15 | E2E-03 |
| H4 | som da zebra no teclado, com o relevo na tela | em **Chrome e Firefox**, som ligado: roda na zebra, manter, sair; som desligado: repetir | ruído grave repetido só com roda na zebra, distinto do motor; nenhum desligado; igual com a zebra em relevo; por navegador | AC-US-0005-09, -10, -11, -12; AC-US-0007-19 | E2E-04 |
| H5 | celular: seletor, crédito, inclinação negada, vibração com o relevo, resultado | no **celular intermediário de referência**, paisagem e retrato: tela inicial; negar a inclinação; treino na Kart Park com roda na zebra (em relevo), saída, pausa na zebra; o painel do resultado de cada volta com o crédito, legível e sem cobrir a volta em andamento; sintética sem crédito | seletor e crédito inteiros nas duas orientações; toque com o aviso; pulso curto repetido só na zebra, 0 na pausa; o link do crédito no painel acionável por toque (a taxa de quadros é H11) | AC-US-0001-01; AC-US-0006-01..06; REQ-FEAT-0001-13; AC-US-0005-07, -08; AC-US-0007-18 | E2E-05 |
| H6 | navegador sem `navigator.vibrate` (e a medida de download) | num navegador sem vibração (Safari no iOS; ou vibração desligada no sistema, anotando): treino com zebras; numa primeira visita com cache vazio, ler os bytes comprimidos transferidos (4G real) | treino igual, sem vibração, sem erro, sem aviso; bytes comprimidos por aparelho | REQ-FEAT-0005-16..19; RNF02 | E2E-06 |
| H7 | rede bloqueada depois do carregamento | desktop (painel offline) e celular (modo avião): escolher a pista, treino de duas voltas com zebra e barreira, ler o crédito no painel do resultado | tudo funciona, com o acabamento inteiro (nenhuma textura nem foto baixada); 0 requisições do jogo entre a escolha e "encerrar treino"; o link do crédito pode não abrir | NFR-0004; REQ-FEAT-0006-12; US-0007 *sem rede* (SEED/FE-07) | E2E-07 |
| H8 | navegador em inglês | abrir num navegador com o idioma inglês; ler os textos, inclusive o painel do resultado | nome da Kart Park, "Pista sintética" e crédito em português e iguais; o resto em inglês | AC-US-0006-07, -08 | E2E-08 |
| H9 | **acabamento no notebook**: faixa de borda, relevo da zebra, pneus, tons de grama | no **notebook de referência**, Chrome, Kart Park: na largada e ao longo de uma volta, olhar as duas bordas do asfalto (junto às zebras e na linha de largada); parar perto de uma zebra e olhá-la de lado; olhar a barreira inteira; dirigir devagar até encostar nos pneus, dos dois lados da barreira; rodar mais de 1 s com as rodas sobre a faixa de borda sem passar da borda e completar a volta; olhar a grama; recarregar a página e redimensionar a janela, voltando ao mesmo ponto | faixa branca **contínua** nas duas bordas, por dentro do asfalto, sem falha junto às zebras nem na largada; zebra sem degrau do lado do asfalto e mais alta por fora; fileira de **pneus pretos empilhados** em toda a extensão da barreira, nenhum sobre o asfalto ou a zebra; o kart encosta nos pneus vistos, sem entrar e sem parar visivelmente antes; a volta com rodas na faixa sai **válida**; a grama com **ao menos 2 tons** de verde, o mesmo tom no mesmo lugar depois da recarga e do redimensionamento; captura de tela de cada item | AC-US-0007-01, -02 (na tela), -05, -06, -09, -11, -12, -13, -14, -17, -20 (tons visivelmente distintos, sem contraste gritante) | E2E-03 |
| H10 | **acabamento no celular**, paisagem e retrato | no **celular intermediário de referência**: o mesmo roteiro de H9 em paisagem; girar o aparelho para retrato e voltar ao mesmo ponto; recarregar | o mesmo acabamento de H9 nas duas orientações; o mesmo tom de grama no mesmo lugar depois de girar e de recarregar; só o enquadramento muda | AC-US-0007-01, -09, -13, -14; US-0007 *Canais* e *aparelho girado* | E2E-05 |
| H11 | **taxa de quadros com o acabamento na tela** (NFR-0002 1.1.0) | no **notebook de referência** (F12 → Rendering → Frame Rendering Stats) e no **celular intermediário de referência** em **paisagem e retrato** (ferramenta remota, ou contagem de `requestAnimationFrame` no console remoto): um treino de ao menos duas voltas completas na Kart Park, página em primeiro plano, sem pausa, com faixa de borda, zebras em relevo, barreira de pneus e grama em faixas na tela | `fpsPerSecond` por segundo da volta e `minFps`, por aparelho e orientação, com o modelo, o navegador e a versão | NFR-0002: `minFps` ≥ 60 no notebook; ≥ 30 no celular nas duas orientações; uma medida em desktop não vale para o celular (I9); um aparelho que não sustenta é falha do NFR, e o acabamento **não** é retirado para cumpri-lo (US-0007, casos anormais) | E2E-03, E2E-05 |
| H12 | **sintética igual à de antes** (E2E-09) | Chrome no notebook, janela de 1280 × 720: abrir o pacote de antes (`npm run preview` de um build limpo de `e70aad9`, ou staging depois de reexecutar 41156803005, `index-DmxsQuIL.js` — e voltar a 41832829595 a seguir) e o pacote de `<sha>`, um depois do outro; em cada um, escolher "Pista sintética", kart na largada antes da contagem, câmera padrão; capturar o canvas (DevTools → elemento `canvas` → *Capture node screenshot*) e comparar as duas imagens numa ferramenta de diferença de imagem | as duas capturas e o número de pixels diferentes | AC-US-0007-16: **0 pixel diferente** — sem faixa, relevo, pneus nem grama em faixas na sintética, e o chão na cor de antes | E2E-09 |

Resultado esperado: 12 linhas `PASS` registradas (entradas notebook paisagem, celular paisagem, celular retrato, mais as notas por
navegador para H1, H4, H6 e H8 e as capturas de H9, H10 e H12); a partir daí as linhas de aparelho do veredito de testes ficam
verificadas na sua metade humana (a segunda linha de NFR-0012 continua `n/a` até a decisão). Uma linha reprovada é `FAIL CODE`,
nunca de empacotamento — exceto a vibração num navegador sem `navigator.vibrate` (ambiente; H6) e um `minFps` abaixo do limiar
num aparelho fora da referência (I9; anotar o modelo).

## Roll back

| # | Passo (desfaz o passo de *Promote* indicado) | Esperado | Leva |
|---|---|---|---|
| R1 | desfaz 7, pelo caminho que o passo 8 registrou. **Staging — caminho B**: Actions → `pages` → execução **41156803005** → **Re-run all jobs** (conferir a política de ramos se o site tiver sido despublicado); serve `index-DmxsQuIL.js`. **Staging — caminho A** (se B não existir): Settings → Pages → menu "…" → **Unpublish site**. **Caminho C** (B indisponível): C1 ou C2 da tabela de caminhos, **num checkout LF** (a árvore de trabalho atual ou `core.autocrlf=false`), `npm test` local, conferência byte-exata, `git push staging master:staging`. **Produção**: nada a desfazer — se uma execução com a feature tiver sido aprovada por engano, caminho A em `edumatosr6-svg/kartle` no mesmo instante | **B**: a URL serve o `index.html` que referencia `assets/index-DmxsQuIL.js`; o treino contínuo, a Kart Park, o seletor e o crédito no seletor e no painel do resultado continuam; o acabamento de US-0007 some. **A**: 404 do GitHub em até 10 min. **C**: execução nova com `npm test` verde na árvore revertida (C1: 444/444 e `index-DmxsQuIL.js`, como no ensaio de 2026-11-04) | B: ≈ 1 min 20 s do comando à página servida (procedimento ensaiado) + até 10 min de cache. A: 1 min + cache. C: 10 a 30 min (conflitos em C2) + 4 a 5 min + cache |
| R2 | propagação do cache: sem purga; esperar até 10 min e `check_served <URL> index-DmxsQuIL.js` em janela anônima — esperado `checks=79 failed=0` (como medido em 2026-11-03 17:31Z sobre esse mesmo bundle, `deploy-validation-20261103-1744.md`). **Para voltar a publicar depois do caminho A**: reativar o Pages (*Source* = GitHub Actions), **conferir a política de ramos** (a reativação a restringe ao ramo padrão; em staging liberar de novo) e *Re-run all jobs* da execução verde | **A**: 404; na republicação, 200 com o `<hash>` reexecutado. **B/C**: hash esperado servido | até 10 min (restauração B ≈ 2 min 12 s no ensaio de 2026-10-27; republicação A ≈ 7,5 min no de 2026-10-21) |
| R3 | executar *Verify* 1, 2 e 4 na versão restaurada (**B/C**); no caminho **A**, confirmar o 404 nos 4 navegadores de referência | **B/C**: HTTPS válido; carregamento abaixo de 10 s; seletor e crédito. **A**: nenhuma página servida | 10 min |
| R4 | registrar a reversão: hash revertido, alvo restaurado (A: "não publicado"; B/C: hash e número da execução), gatilho observado, horário | linha em `docs/kart-park-device-log.md` e relatório em `reports/deploy-validation/` | 5 min |
| R5 | classificar a causa: aplicação (abertura, seletor, crédito, desenho, barreira, zebra, som, vibração, corte, fps, idioma) → `FAIL CODE` para o estágio de código; empacotamento (base, cache, HTTPS, Pages, política de ramos, *asset* a mais, SHA-256 do arquivo de pista diferente do registrado, `attr/` ou `i/`≠`w/` na conferência byte-exata) ou processo (promoção sem decisão) → `FAIL` deste estágio | relatório com a classificação | 15 min, no mesmo dia |

Staging reverte-se sempre deste modo (R1 e R2 sobre `edumatosr6-svg/kartle-staging`; lá o `deploy` não pede aprovação) e nunca é
precondição para reverter produção. Staging é partilhado: reverter este build reverte também as releases contidas nele.

Dados: nada a desfazer. A feature não grava no navegador e não há servidor (DES-0012, `REL-0002`); um jogador com a página nova
em cache continua a jogá-la por até 10 min. `tracks/registry.json` **não** é revertido por uma reversão de bundle: a entrada
`kart-park` 1 em `STAGING` continua válida (a versão publicada é imutável; uma correção é a versão 2).

**Point of no return:** não existe nesta release. Em staging a execução verde anterior é reexecutável enquanto o Actions a
retiver (90 dias) e, passado isso, o caminho C reconstrói de um commit; em produção nada foi publicado e a reversão de uma
aprovação indevida é despublicar (caminho A), sempre possível. O único ato que tornaria a reversão impossível seria **apagar o
histórico do repositório** (`push --force`), que nenhum passo deste runbook faz. O ato que **não se reverte por projeto** é
outro: gravar `PRODUCTION` no registro da pista com uma referência que não seja a de uma decisão registrada — a violação de
NFR-0012, que este runbook não contém.
