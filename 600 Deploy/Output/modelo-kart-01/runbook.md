---
title: Runbook — promover, verificar e reverter a release do modelo Kart 01 e da câmera de jogo
feature: modelo-kart-01
stage: deploy
status: validated
version: 1.0.0
sources: [DM-0001, DES-0001, DES-0003, DES-0004, DES-0005, DES-0007, ADR-0003, NFR-0001, NFR-0002, NFR-0003, NFR-0006, TEST-0001, TEST-0003, TEST-0004]
---

# Runbook

Para quem não escreveu a release. Executar da raiz do repositório, com todo caminho entre aspas. Nenhum passo é executado por um
loop: cada um é de um humano, e a promoção a produção é sempre do dono do produto (D-DP-06). O provedor é o **GitHub Pages**
(D23): o pipeline é `.github/workflows/pages.yml`, a publicação é um push e a promoção é um clique de aprovação no ambiente
`github-pages` do repositório de produção — o mesmo procedimento das releases anteriores
(`600 Deploy/Output/dirigibilidade/runbook.md`), com os nomes desta release. Nomes usados abaixo:

| Nome | Valor (não é segredo) |
|---|---|
| dono do produto | conta GitHub `edumatosr6-svg` (revisor obrigatório do ambiente `github-pages` de produção); é quem executa as linhas humanas H1–H6 nos aparelhos de referência |
| repositório de **produção** | `edumatosr6-svg/kartle` — `https://github.com/edumatosr6-svg/kartle` (público), remoto local `origin`, ramo `master`, site `https://edumatosr6-svg.github.io/kartle/`; execuções em `https://github.com/edumatosr6-svg/kartle/actions` |
| repositório de **staging** | `edumatosr6-svg/kartle-staging` — `https://github.com/edumatosr6-svg/kartle-staging` (público), remoto local `staging`, ramo `staging`, site `https://edumatosr6-svg.github.io/kartle-staging/`; execuções em `https://github.com/edumatosr6-svg/kartle-staging/actions` |
| `<sha>` | o hash do commit da árvore verificada: `6ea3862c74603886e3af421da3f542220980293f` (ponta de `master` em 2026-10-27). Um commit posterior **só de registro** (que não toque `src/`, `scripts/`, `tests/`, `index.html`, `docs/kart-01/kart.js`, `package.json` nem `package-lock.json`) não invalida a release; qualquer outro invalida |
| `<hash>` | o hash de conteúdo no nome do JS (`assets/index-<hash>.js`), impresso no passo *Build* da execução que se publica; para a árvore de `<sha>`, **`D0RarhFV`** (build local e staging, 631 352 bytes) |
| `<sha-anterior>` / `<hash-anterior>` | a release anterior (`dirigibilidade`): árvore `b86b200`, JS `index-BiFxJ0FY.js` (579 462 bytes); em staging, execução verde **40566728590** (commit `b86b200`) |
| "execução verde" | uma execução do workflow `pages` com os dois trabalhos (`build`, `deploy`) concluídos com sucesso |
| `check_served` | `python -I "600 Deploy/Output/modelo-kart-01/tools/check_served.py" <URL> index-<hash>.js` — três GET de leitura; `checks=37 failed=0` aprova |
| `check_bundle` | `python -I "600 Deploy/Output/modelo-kart-01/tools/check_bundle.py" dist docs/kart-01/device-log.md` — leitura local; `checks=45 failed=0` aprova |
| registro em tela | `docs/kart-01/device-log.md` (DM-0001, seção 2): uma entrada por execução, com build, aparelho, orientação, método da contagem, `fpsPerSecond`, `minFps`, roteiros e download |

Os números das execuções do Actions **não são copiados aqui**: cada push cria uma execução nova nos dois repositórios e, pelo
grupo de concorrência `pages`, cancela a execução de produção que ainda esperava atrás da mais antiga — as execuções em vigor
são sempre as que a aba Actions mostra, e são elas que o relatório de validação cita.

Artefato: `dist/` (HTML, JS e CSS estáticos), construído **pelo workflow** a partir de `<sha>`. Não há banco, migração de dado,
armazenamento no navegador nem aplicativo nativo. A feature fica ativa ao servir o `index.html` novo (sem flag — ADR-0003).

**Alvo de reversão.** Três caminhos, e cada passo de *Roll back* nomeia qual aplica:

| Caminho | Quando se aplica | O que R1 faz |
|---|---|---|
| **A — despublicar** | não há execução verde anterior no repositório (**produção, hoje**: nada foi promovido) | Settings → Pages → menu "…" ao lado da URL do site → **Unpublish site**; a URL responde 404 do GitHub. Ensaiado em staging em 2026-10-21 |
| **B — reexecutar a última execução verde anterior** | existe uma execução verde do commit anterior (**staging, hoje**: 40566728590, `b86b200`, serve `<hash-anterior>`) | Actions → workflow `pages` → essa execução → **Re-run all jobs**; o workflow reconstrói esse commit (`npm ci` do lockfile, `npm test`, build) e publica (em produção, pede a aprovação do revisor). Em staging, **conferir antes a política de ramos do ambiente** se o site tiver sido despublicado entretanto. A página volta ao kart de caixas e à câmera alta, com a mesma física. **Ensaiado** em 2026-10-27 19:29–19:33Z no mesmo site (par 39631099098 ↔ 40566728590): reversão ≈ 1 min 17 s do comando à página servida, restauração ≈ 2 min 12 s |
| **C — reverter e reconstruir** (ADR-0003: "a reversão é a do repositório") | quando B não existe ou a execução anterior já não pode ser reexecutada (retenção de 90 dias) | `git revert` dos commits da cadeia desta feature que tocam a árvore, na ordem inversa (`6ea3862`, `3c131aa`, `b29278b`; `8d52603` é só registro) `&& npm test && git push origin master`; a execução nova roda `npm test` e o build na árvore revertida e pede aprovação |

## Preconditions

- [x] **Commit verificado existe**: `6ea3862c74603886e3af421da3f542220980293f` (`master`), a árvore que o veredito de testes
      verificou. Quem executa confere: `git log --oneline -5` mostra `6ea3862` como ponta (ou um commit só de registro acima
      dele) e `git status` não acusa modificação em `src/`, `scripts/`, `tests/`, `index.html`, `package.json` nem no lockfile.
      O que se publica é o commit, não a árvore de trabalho.
- [x] Veredito de testes `SUCCESS`: `500 Tests/Output/modelo-kart-01/reports/test-validation/test-validation-20261027-2028.md`
      (296 verificações, 296 aprovadas, 59 desta feature; `fresh: true`).
- [ ] Validação de staging `SUCCESS`: relatório em `600 Deploy/Output/modelo-kart-01/reports/deploy-validation/` — **aguarda a
      primeira execução do validador** sobre este registro.
- [x] Histórico de migração: **não se aplica** — não há banco; nenhum formato publicado ou persistido muda; a linha de base da
      simulação vive no repositório e não no bundle (`REL-0002`).
- [x] Feature flag: **não há** (ADR-0003); a feature fica ativa ao servir o `index.html` novo.
- [x] **Repositórios e ambientes configurados** (2026-10-21, primeira release): produção com *Source* = GitHub Actions, revisor
      obrigatório `edumatosr6-svg` e política de ramos restrita a `master`; staging com *Source* = GitHub Actions, sem revisor e
      política de ramos **sem restrição** — a reconferir depois de qualquer despublicação, porque a reativação do Pages recria o
      ambiente restrito ao ramo padrão e o `deploy` de `staging` passa a falhar com zero passos. Nenhuma credencial configurada:
      o Pages usa o token OIDC da execução (D-DP-05).
- [x] **Execução verde do workflow `pages` em staging para `<sha>`**: a URL de staging serve `index-D0RarhFV.js` desde
      2026-10-27 20:37:38Z (200 em HTTPS; `check_served` 37/37); o número da execução é lido na aba Actions e entra no
      relatório de validação. Em produção, **nenhuma execução verde** e nada aprovado (a execução da primeira release pode
      estar em *Waiting* ou cancelada pelo grupo `pages`: ler na aba Actions; não aprovar antes do passo 9).
- [x] **Reversão ensaiada em staging** (2026-10-27 19:29–19:33Z, release anterior, caminho B sobre o mesmo site: reexecução
      de 39631099098 → `index-Cqfgl3da.js` servido em ≈ 1 min 17 s; reexecução de 40566728590 → `index-BiFxJ0FY.js` de volta
      em ≈ 2 min 12 s; ciclo ≈ 3 min 47 s). O procedimento desta release é o mesmo e o site é o mesmo; o alvo é agora a
      40566728590. Não é repetido por esta rodada (nenhum comando contra o GitHub); o validador pode repeti-lo com o par
      40566728590 ↔ execução de `<sha>` (`98-divergences.md`, DIV-DP-03).
- [ ] **`docs/kart-01/device-log.md` com as linhas H1–H6 registradas em staging, nos aparelhos de referência nomeados**
      (notebook e celular intermediário, paisagem e retrato): as 22 linhas `unverified` do veredito de testes (DIV-01 a DIV-22:
      AC-US-0001-14..16, AC-US-0002-01, -03..-06, AC-US-0003-08..13, AC-US-0004-01, -02, AC-US-0005-01..03, NFR-0001, NFR-0002;
      NFR-0006 linha 1 é revisão de código) dependem disso. O arquivo **existe** com a execução 1 (navegador embutido, parcial,
      sem taxa de quadros); a seção *Execuções nos aparelhos de referência* diz "Não executadas" (DIV-DP-01).
- [ ] **Portas humanas das releases contidas** nesta: `docs/handling-device-log.md` com H1–H5 da `dirigibilidade` (o arquivo
      não existe) e a execução 3 de `docs/lap-validation-device-log.md` (`race-lap-validation`). Promover `<sha>` promove as
      três releases; as três listas cabem na mesma sessão de aparelho sobre este bundle (DIV-DP-12), e o dono do produto decide
      se as fecha antes do passo 9 ou as aceita como pendentes.
- [x] Monitoramento decidido: **vigilância manual conforme este runbook**, nenhum monitor externo nem telemetria (decisão de
      2026-10-21, mantida; `REL-0005`). A verificação HTTPS manual é *Verify* 1 e 8.
- [x] Node na versão fixada: `.nvmrc` = `24` na raiz (o workflow lê `node-version-file`).

## Promote

| # | Passo | Esperado | Leva | Desfaz-se por |
|---|---|---|---|---|
| 1 | conferir o commit: `git log --oneline -5`; `git status` | `6ea3862` é a ponta (ou só commits de registro acima); nenhuma modificação local em `src/`, `scripts/`, `tests/`, `index.html`, `package.json`, lockfile | 1 min | nada a desfazer: leitura local |
| 2 | `npm ci` | saída 0; `package-lock.json` inalterado | 1 a 2 min | nada externo: só recria `node_modules/` |
| 3 | `npm test` | saída 0; `296 passed, 0 failed, 0 skipped` (59 em `tests/modelo-kart-01-*.test.ts`) | 1 a 2 min | nada a desfazer |
| 4 | `npm run build` | saída 0; `dist/assets/index-<hash>.js` com `<hash>` = `D0RarhFV` (se a árvore for a de `<sha>`) e nenhum outro arquivo em `dist/assets/` além do CSS; anotar o `<hash>` — é a conferência local; o artefato publicado é o do workflow | 1 min | nada externo: apagar `dist/` local |
| 5 | `python -I "600 Deploy/Output/race-lap-validation/tools/measure_dist.py" dist` e `check_bundle` | `within_limit=True` (≈ 649 918 bytes, RNF02); `checks=45 failed=0` | 10 s | nada a desfazer: leitura |
| 6 | registrar o alvo de reversão em `docs/kart-01/device-log.md`: staging → execução 40566728590 (`b86b200`, `<hash-anterior>` `BiFxJ0FY`), caminho B; produção → "nenhuma execução verde anterior; reversão pelo caminho A (Unpublish site)", ou a execução de árvore anterior ainda em *Waiting*, se existir, como alternativa ao A | nota registrada com os números lidos na aba Actions de cada repositório | 2 min | nada a desfazer: anotação |
| 7 | publicar em **staging**: `git push staging master:staging` (**feito em 2026-10-27 ≈ 20:36Z** pelo dono do produto) e acompanhar a execução `pages` desse commit em `https://github.com/edumatosr6-svg/kartle-staging/actions`; depois `check_served https://edumatosr6-svg.github.io/kartle-staging/ index-<hash>.js`. Se o `deploy` falhar **sem executar nenhum passo**, liberar a política de ramos do ambiente e *Re-run all jobs* | execução verde (`npm test` 296 aprovados; `Measure dist` `within_limit=True`; `deploy` concluído); `check_served` `checks=37 failed=0` com o `<hash>` do passo *Build* dessa execução (**hoje: 200, `index-D0RarhFV.js`, 37/37, servido desde 20:37:38Z**) | 3 a 5 min (execução) + até 10 min de cache | R1/R2 sobre `kartle-staging` (caminho B: 40566728590; ou A) |
| 8 | executar `smoke.md` em staging (D1–D16, M1–M11) **e as linhas humanas H1–H6 abaixo**, e registrar em `docs/kart-01/device-log.md` (uma entrada por aparelho e orientação) | todas as linhas dentro do limiar; D4/M4 sem kart de caixas; D7/M6 com placa `01` e sombra; D10/D13/M7 com o kart inteiro na curva; D11/M11 com `arcade-assistido-v5`; H6 com `minFps` ≥ 60 e ≥ 30 | 90 a 150 min | nada a desfazer: observação; o registro fica como histórico |
| 9 | **pergunta ao dono do produto**: promover o commit `<sha>` a produção? (D-DP-06). Lembrete: produção nunca serviu um `dist/`; promover esta release é também promover as de `dirigibilidade` e `race-lap-validation`, contidas nela, com as suas portas humanas no estado que a precondição correspondente registra | resposta explícita registrada; "não" encerra aqui sem efeito | até 1 dia útil; sem resposta, vale "não" | nada a desfazer |
| 10 | publicar em **produção**: `git push origin master` (se a ponta já tiver sido enviada, a execução existe); em `https://github.com/edumatosr6-svg/kartle/actions`, abrir a execução **mais recente** cujo `build` esteja verde, conferir que o commit é `<sha>` (ou um posterior só de registro) e que o passo *Build* imprime `index-<hash>.js`; só depois do "sim" do passo 9, **Review deployments** → marcar `github-pages` → **Approve and deploy** | `build` verde com `npm test` 296 aprovados e `Measure dist` `within_limit=True`; após a aprovação, `deploy` verde com a URL `https://edumatosr6-svg.github.io/kartle/` | 3 a 5 min de execução + o tempo até o clique | R1 (caminho A nesta release em produção); antes do clique, **Reject** deixa tudo como está |
| 11 | propagação do cache: sem purga no Pages (`max-age=600`); esperar até 10 min e `check_served https://edumatosr6-svg.github.io/kartle/ index-<hash>.js` em janela anônima | `checks=37 failed=0`; o `index.html` servido referencia `/kartle/assets/index-<hash>.js`; JS e CSS com 200 | até 10 min | R2 |

## Verify

| # | Verificação (`smoke.md`, *Verificação em produção*) | Esperado |
|---|---|---|
| 1 | D1 / M1 HTTPS em `https://edumatosr6-svg.github.io/kartle/` — **verificação manual** (+ `check_served`), a única vigilância de disponibilidade desta release | cadeado válido; 0 recursos inseguros; `index.html`, JS e CSS com 200 e nenhum outro *asset*; `<hash>` esperado; inclinação ativa no celular (RNF06, NFR-0003) |
| 2 | D2 / M2 carregamento em 4G, cache vazio | kart responde em menos de 10 s (RNF01) |
| 3 | D3 / M3 bytes transferidos na primeira visita | abaixo de 3 145 728 bytes (NFR-0002, RNF02); esperado da ordem de 171 KB comprimidos |
| 4 | D4 / M4 visão geral e estado inicial | pista inteira com o Kart 01 na largada, nenhum kart de caixas; `ARCADE ASSISTIDO · TREINO LIVRE`; `synthetic`; um botão "volta de treino" (AC-US-0003-10, AC-US-0001-14, NFR-0006) |
| 5 | D5 / M5 console | 0 erros ao carregar e numa volta |
| 6 | D6, D7, D8 / M6, M7 contagem, corrida, placa, sombra, esterço; retrato no celular | descida sem subir e `VERDE` atrás do piloto; placa `01` legível e sombra no chão; rodas e volante com o esterço; kart inteiro na curva nas duas formas (AC-US-0003-11, -12, AC-US-0001-15, -16, AC-US-0002-01..04, AC-US-0003-08) |
| 7 | D11 / M11 fim da volta | kart congelado, câmera atrás, painel sobre a cena; `#lap-result-setup` = `arcade-assistido-v5` (AC-US-0003-13; regressão da release anterior) |
| 8 | repetir 1, 4, 5 e 7 depois de 24 h (vigilância manual; nenhum monitor externo) | mesmos resultados; a execução aprovada continua a última em `https://github.com/edumatosr6-svg/kartle/actions` e Settings → Pages mostra o site ativo com essa implantação |

**Gatilhos de reversão (D-DP-03):** carregamento de 10 s ou mais em 4G; transferência de 3 145 728 bytes ou mais; o kart de caixas
em qualquer quadro; placa sem o número `01` num navegador de referência com contexto 2D, ou kart sem sombra; qualquer parte
do kart ou do piloto fora do quadro numa curva de 90° a 50 km/h, em paisagem ou em retrato; a câmera a subir durante a contagem
ou um corte no `VERDE`; rodas ou volante parados com esterço; movimento durante a pausa ou deslizamento após reposicionar;
marcas ou fumaça fora do kart; `#lap-result-setup` sem `arcade-assistido-v5` ao fim de uma volta com o Arcade; erro no console
ao carregar ou durante a volta (inclusive 404 de um *asset* em `/kartle/assets/`); `#track-status` sem `synthetic`; qualquer
recurso servido sem HTTPS; `minFps` abaixo de 60 no notebook ou de 30 no celular de referência (NFR-0001, RNF03).

## Linhas humanas — o smoke de aparelho que o dono do produto executa (H1–H6)

As seis linhas do estágio de testes que só a tela, o aparelho, a orientação ou o relógio de parede decidem
(`500 Tests/Output/modelo-kart-01/98-divergences.md`, DIV-01 a DIV-22; `test-strategy.md` E2E-01 a E2E-06). Executadas sobre a URL
de **staging**, no notebook e no celular de referência nomeados pelo modelo comercial, com a página em primeiro plano, e
registradas em `docs/kart-01/device-log.md` (build, aparelho, navegador, versão, DPR, área de jogo em px, orientação, método da
contagem, `fpsPerSecond`, `minFps`, resultado por roteiro, download, data) — uma entrada por aparelho e por orientação. Nenhuma
pode ser feita por um loop nem sob automação do navegador (o ritmo sob automação é inválido: execução 1 do registro).

| # | Linha | O que se faz | O que se registra | Critério de aprovação | Roteiro |
|---|---|---|---|---|---|
| H1 | Kart 01 em toda exibição; visão geral e descida | abrir a URL; olhar a visão geral; iniciar a volta e observar a contagem; recarregar durante a contagem e durante a corrida; no celular, girar na visão geral (paisagem ↔ retrato); **gravar a tela** da contagem | a pista inteira na visão geral nas duas formas; o Kart 01 (laranja, piloto de macacão azul e capacete) em todo quadro, antes e depois de cada recarga e giro; na gravação, o primeiro quadro da contagem na visão geral, a altura da câmera nunca a subir, e no `VERDE` a câmera atrás do piloto sem corte; **desktop e celular** | AC-US-0001-14: 0 quadros com o kart de caixas; AC-US-0003-10: 4 cantos da pista no quadro em cada forma; AC-US-0003-11: 0 quadros com a altura a subir; AC-US-0003-12: pose de corrida no quadro do sinal verde | E2E-01 |
| H2 | modelo visível com placa `01`, piloto e sombra; câmera atrás e perto; fim da volta | em corrida, olhar o kart pela câmera de corrida; completar uma volta; invalidar uma por reposicionamento; "nova volta" a partir do fim; no celular, tocar `#lap-share` | a placa `01` legível no para-choque traseiro; o piloto sentado com as mãos no volante; a sombra no asfalto junto ao kart; a câmera atrás e perto (o kart na parte inferior do quadro, motor à direita do piloto); no fim, kart congelado (rodas sem giro, nenhuma marca nova), câmera atrás do kart parado, painel sobre a cena sem a mover, `#lap-result-setup` = `arcade-assistido-v5`; "nova volta" começa na visão geral; **desktop e celular** | AC-US-0001-15: sombra visível; AC-US-0001-16: número legível; AC-US-0003-01..03: câmera atrás, 1,38 m / 3,05 m (confirmado pela forma, não por instrumento); AC-US-0003-13: 0 retornos à visão geral com o painel aberto; regressão: `setupVersion` em texto | E2E-02 |
| H3 | rodas esterçam e giram; volante e mãos; pausa e reposicionamento | esterçar para os dois lados (teclas; inclinação no celular) e acelerar; pausar (Esc, troca de aba; cobrir o sensor no celular) e retomar; reposicionar | as rodas dianteiras giram para o lado do esterço e o volante mais, para o mesmo lado; as mãos ficam no aro; as quatro rodas rolam com a velocidade; na pausa, kart, rodas, câmera e efeitos parados; depois de reposicionar, kart e câmera na nova posição no quadro seguinte; **desktop e celular** | AC-US-0002-01, -02, -03, -04: esterço, giro, volante, mãos; AC-US-0002-05, -06: 0 movimento na pausa, 0 deslizamento, rumo correto | E2E-03 |
| H4 | sem corte numa curva de 90° a 50 km/h; turbo; retrato | em corrida, numa curva de 90° a cerca de 50 km/h, em paisagem **e em retrato** (celular; desktop com a janela mais alta que larga); com o turbo ativo; trocar de orientação com e sem turbo | o kart com o piloto inteiro no quadro durante toda a curva nas duas formas; com o turbo o campo de visão abre e volta; na troca de orientação a pose não muda e o campo da nova forma vale no quadro seguinte; **celular nas duas formas; desktop** | AC-US-0003-08: 0 cantos do kart ou do piloto fora do quadro; AC-US-0003-09: +4° visível e retorno; REQ-FEAT-0003-15: 1 quadro de atraso no máximo | E2E-04 |
| H5 | marcas, fumaça e drift presos ao kart | drift com marcas de pneu; turbo; reposicionar durante as marcas; pausar durante o drift | cada trecho novo de marca sob o pneu traseiro exibido do seu lado; fumaça na ponteira do escapamento (direita traseira) só com turbo; trechos antigos parados após reposicionar, novos da nova posição; nenhum trecho na pausa; **desktop e celular** | AC-US-0005-01, -02, -03: 0 marcas fora do pneu, 0 fumaça fora da ponteira, 0 trechos na pausa | E2E-05 |
| H6 | taxa de quadros 60/30 e download | uma volta completa em corrida com a aba em primeiro plano e sem pausa, contando os quadros de cada segundo (ferramentas de desempenho do navegador ou trecho no console; nunca código do jogo): no **notebook** em paisagem; no **celular** em paisagem **e** em retrato; numa primeira visita com cache vazio, ler os bytes comprimidos transferidos | `fpsPerSecond` (lista) e `minFps` por aparelho e orientação; bytes comprimidos; **uma entrada por aparelho e orientação** | NFR-0001 / AC-US-0004-01: `minFps` ≥ 60 no notebook; AC-US-0004-02: `minFps` ≥ 30 no celular nas duas formas (uma medida em desktop não vale, I9); NFR-0002: abaixo de 3 145 728 bytes | E2E-06 |

Resultado esperado do conjunto: 6 linhas `PASS` registradas (3 entradas no device log: notebook paisagem, celular paisagem,
celular retrato); a partir daí as 22 linhas `unverified` do veredito de testes ficam verificadas na sua metade humana, e a
precondição correspondente deste runbook fecha. Uma linha reprovada é `FAIL CODE` (defeito de aplicação), nunca de
empacotamento: o bundle é o mesmo que passou nas 296 verificações — exceto a placa sem número num navegador sem contexto 2D
(ambiente; anotar o navegador) e um `minFps` abaixo do limiar num aparelho fora da referência (I9; anotar o modelo).

## Roll back

| # | Passo (desfaz o passo de *Promote* indicado) | Esperado | Leva |
|---|---|---|---|
| R1 | desfaz 10, pelo caminho que o passo 6 registrou. **Produção, hoje — caminho A**: `https://github.com/edumatosr6-svg/kartle` → Settings → Pages → menu "…" → **Unpublish site** → confirmar. **Alternativa em produção**, se uma execução de árvore anterior ainda estiver em *Waiting* e não cancelada: aprová-la (volta ao kart de caixas e à câmera alta, ou à primeira release) — conferir o commit antes. **Staging — caminho B**: Actions → `pages` → execução 40566728590 → **Re-run all jobs** (conferir a política de ramos do ambiente se o site tiver sido despublicado); serve `index-BiFxJ0FY.js`. **Caminho C** quando B não existir: `git revert` da cadeia desta feature (`6ea3862`, `3c131aa`, `b29278b`), `npm test` local, `git push origin master`, aprovar o `deploy` | **A**: a URL responde 404 do GitHub em até 10 min; Settings → Pages sem site publicado. **B**: a URL serve o `index.html` que referencia `assets/index-<hash-anterior>.js`; o kart de caixas e a câmera alta voltam, `#lap-result-setup` continua `arcade-assistido-v5` (comportamento da release anterior). **C**: execução nova com `npm test` verde na árvore revertida (237 verificações) | A: 1 min + até 10 min de cache (ensaiado em 2026-10-21: 404 em ≈ 1 min no navegador, 200 em cache de borda por > 6 min). B: ≈ 1 min 20 s do comando à página servida (ensaiado em 2026-10-27) + aprovação em produção + até 10 min de cache para quem tem a página em cache. C: 10 min + 3 a 5 min + aprovação + cache |
| R2 | propagação do cache (desfaz 11): sem purga; esperar até 10 min e `check_served <URL> index-<hash-anterior>.js` em janela anônima — esperado `failed=` igual ao número de linhas do Kart 01 que a release anterior não tem (marcadores, número, constantes, modos de câmera), com `hash do JS é o esperado` `ok`; a ferramenta da release anterior, `600 Deploy/Output/dirigibilidade/tools/check_served.py`, dá `18/18` sobre esse bundle. **Para voltar a publicar depois do caminho A**: reativar o Pages (Settings → Pages → *Source* = GitHub Actions), **conferir a política de ramos do ambiente** (a reativação recria o ambiente restrito ao ramo padrão; em staging liberar de novo) e *Re-run all jobs* da execução verde | **A**: busca nova devolve 404; na republicação, 200 com o `<hash>` da execução reexecutada. **B/C**: hash esperado servido; `check_served` da `dirigibilidade` 18/18 | até 10 min (republicação pelo caminho A: ≈ 7,5 min no ensaio de 2026-10-21; restauração pelo caminho B: ≈ 2 min 12 s no ensaio de 2026-10-27) |
| R3 | executar *Verify* 1, 2 e 4 na versão restaurada (**B/C**; em D4 a visão é a da release anterior: câmera alta e kart de caixas, mesmo acerto e mesma pista); no caminho **A**, confirmar que a URL responde 404 nos 4 navegadores de referência | **B/C**: HTTPS válido; carregamento abaixo de 10 s; a tela anterior funciona. **A**: nenhuma página servida | 10 min |
| R4 | registrar a reversão: hash revertido, alvo restaurado (A: "não publicado"; B/C: hash restaurado e número da execução), gatilho observado, horário | linha em `docs/kart-01/device-log.md` e relatório em `reports/deploy-validation/` | 5 min |
| R5 | se a causa for da aplicação (kart de caixas, placa, sombra, câmera, esterço, efeitos, fps), abrir `FAIL CODE` para o estágio de código; se for do empacotamento (base `/kartle/`, cache, HTTPS, Pages, política de ramos, *asset* a mais), `FAIL` deste estágio | relatório com a classificação | 15 min, no mesmo dia |

Staging reverte-se do mesmo modo (R1 e R2 sobre `edumatosr6-svg/kartle-staging`; lá o `deploy` não pede aprovação) e nunca é
precondição para reverter produção.

Dados: nada a desfazer. A feature não grava no navegador e não há servidor (DES-0007, `REL-0002`); um jogador com a página nova
em cache continua a jogá-la por até 10 min; depois busca o `index.html` restaurado (ou o 404 do caminho A). O registro de volta e
o texto compartilhado são os mesmos nas duas versões.

**Point of no return:** não existe nesta release. Em produção a reversão é despublicar (caminho A), sempre possível; em staging a
execução verde anterior é reexecutável enquanto o Actions a retiver (90 dias) e, passado isso, o caminho C reconstrói de um
commit — o repositório é o artefato de reversão (ADR-0003). O único ato que tornaria a reversão impossível seria **apagar o
histórico do repositório** (`push --force` sobre `master`), que nenhum passo deste runbook faz. A linha de base da simulação
(`tests/fixtures/kart01-sim-baseline.json`) só é regravada com `--force` e num commit próprio — não é um ponto sem retorno, é a
forma da próxima release que mudar um acerto ou a pista.
