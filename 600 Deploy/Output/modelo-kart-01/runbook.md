---
title: Runbook — promover, verificar e reverter a release do modelo Kart 01 e da câmera de jogo
feature: modelo-kart-01
stage: deploy
status: validated
version: 1.1.0
sources: [DM-0001, DES-0001, DES-0003, DES-0004, DES-0005, DES-0007, ADR-0003, NFR-0001, NFR-0002, NFR-0003, NFR-0006, TEST-0001, TEST-0003, TEST-0004]
---

# Runbook

Para quem não escreveu a release. Executar da raiz do repositório, com todo caminho entre aspas. Nenhum passo é executado por um
loop: cada um é de um humano, e a promoção a produção é sempre do dono do produto (D-DP-06). O provedor é o **GitHub Pages**
(D23): o pipeline é `.github/workflows/pages.yml`, a publicação é um push e a promoção é um clique de aprovação no ambiente
`github-pages` do repositório de produção. Nomes usados abaixo:

| Nome | Valor (não é segredo) |
|---|---|
| dono do produto | conta GitHub `edumatosr6-svg` (revisor obrigatório do ambiente `github-pages` de produção); é quem executa as linhas humanas H1–H6 nos aparelhos de referência |
| repositório de **produção** | `edumatosr6-svg/kartle` — `https://github.com/edumatosr6-svg/kartle` (público), remoto local `origin`, ramo `master`, site `https://edumatosr6-svg.github.io/kartle/`; execuções em `https://github.com/edumatosr6-svg/kartle/actions` |
| repositório de **staging** | `edumatosr6-svg/kartle-staging` — `https://github.com/edumatosr6-svg/kartle-staging` (público), remoto local `staging`, ramo `staging`, site `https://edumatosr6-svg.github.io/kartle-staging/`; execuções em `https://github.com/edumatosr6-svg/kartle-staging/actions` |
| `<sha>` | o hash do commit da árvore verificada: `6b314b2193c25cd6384a3f64cffdc369637b3753` (seed rev 4). Um commit posterior **só de registro** (que não toque `src/`, `scripts/`, `tests/`, `tracks/`, `index.html`, `docs/kart-01/kart.js`, `package.json` nem `package-lock.json`, como `483c5fa`) não invalida a release; qualquer outro invalida |
| `<hash>` | o hash de conteúdo no nome do JS (`assets/index-<hash>.js`), impresso no passo *Build* da execução que se publica; para a árvore de `<sha>`, **`BwruE9Pq`** (build limpo e staging, 694 094 bytes, sha256 `023fb54be8e8c3f6…`) |
| `<run-staging>` | a execução de staging que publicou `<sha>`: **41101055606** (`success`) |
| `<run-anterior>` / `<sha-anterior>` | o alvo do caminho B em staging: execução **41076989728**, commit **`652bbaa`** (árvore de `07b5cfa`: Kart 01 da revisão anterior com o código do +4° de turbo, do jato e das marcas presas ao drift; acerto `arcade-assistido-v6`; Kart Park; treino de uma volta); o seu `<hash-anterior>` é lido no passo *Build* dessa execução |
| "execução verde" | uma execução do workflow `pages` com os dois trabalhos (`build`, `deploy`) concluídos com sucesso |
| `check_served` | `python -I "600 Deploy/Output/modelo-kart-01/tools/check_served.py" <URL> index-<hash>.js` — três GET de leitura; `checks=40 failed=0` aprova |
| `check_bundle` | `python -I "600 Deploy/Output/modelo-kart-01/tools/check_bundle.py" dist docs/kart-01/device-log.md` — leitura local; `checks=48 failed=0` aprova (o `warn` do registro em tela some depois de H1–H6) |
| registro em tela | `docs/kart-01/device-log.md` (DM-0001, seção 2): uma entrada por execução, com build, aparelho, orientação, método da contagem, `fpsPerSecond`, `minFps`, roteiros e download |

Os números de execução acima são os em vigor em 2026-10-30; cada push cria uma execução nova nos dois repositórios e, pelo grupo
de concorrência `pages`, pode cancelar a execução de produção que ainda esperava — **confirmar sempre na aba Actions** antes de
reexecutar ou aprovar.

Artefato: `dist/` (HTML, JS e CSS estáticos), construído **pelo workflow** a partir de `<sha>`. Não há banco, migração de dado,
armazenamento no navegador nem aplicativo nativo. A feature fica ativa ao servir o `index.html` novo (sem flag — ADR-0003).

**Alvo de reversão.** Três caminhos, e cada passo de *Roll back* nomeia qual aplica:

| Caminho | Quando se aplica | O que R1 faz |
|---|---|---|
| **A — despublicar** | não há execução verde anterior no repositório (**produção, hoje**: nada foi promovido; a URL responde 404) | Settings → Pages → menu "…" ao lado da URL do site → **Unpublish site**; a URL responde 404 do GitHub. Ensaiado em staging em 2026-10-21 |
| **B — reexecutar a última execução verde anterior** | existe uma execução verde do commit anterior (**staging, hoje**: 41076989728, `652bbaa`) | Actions → workflow `pages` → essa execução → **Re-run all jobs**; o workflow reconstrói esse commit (`npm ci` do lockfile, `npm test`, build) e publica (em produção, pede a aprovação do revisor). Conferir antes a política de ramos do ambiente se o site tiver sido despublicado entretanto. A página volta ao Kart 01 da revisão anterior (com o +4° de turbo e o jato no código; com o acerto v6, sem drift nem turbo, nenhuma marca aparece) e ao treino de uma volta. **Procedimento ensaiado** em 2026-10-27 19:29–19:33Z no mesmo site (par 39631099098 ↔ 40566728590): reversão ≈ 1 min 17 s do comando à página servida, restauração ≈ 2 min 12 s |
| **C — reverter e reconstruir** (ADR-0003: "a reversão é a do repositório") | quando B não existe ou a execução anterior já não pode ser reexecutada (retenção de 90 dias) | `git revert` dos commits desta feature que mudaram a árvore desde `652bbaa`, na ordem inversa (`6b314b2`, `aeaf504`; `07b5cfa` **fica**: a linha de base v6 é a de `652bbaa`), resolvendo conflitos em `src/main.ts` a favor das outras features `&& npm test && git push origin master`; a execução nova roda `npm test` e o build na árvore revertida e pede aprovação |

## Preconditions

- [x] **Commit verificado existe**: `6b314b2193c25cd6384a3f64cffdc369637b3753` (`master`), a árvore que os vereditos de código e
      de testes verificaram. Quem executa confere: `git log --oneline -5` mostra `6b314b2` (ou só commits de registro acima dele,
      como `483c5fa`) e `git status` não acusa modificação em `src/`, `scripts/`, `tests/`, `tracks/`, `index.html`,
      `package.json` nem no lockfile. O que se publica é o commit, não a árvore de trabalho.
- [x] Veredito de código `SUCCESS`: `400 Code/Output/modelo-kart-01/reports/code-validation/code-validation-20261030-1655.md`
      (seed rev 4).
- [x] Veredito de testes `SUCCESS`: `500 Tests/Output/modelo-kart-01/reports/test-validation/test-validation-20261030-1743.md`
      (443 verificações, 443 aprovadas, 66 desta feature; `fresh: true`).
- [ ] Validação de staging `SUCCESS` para `<sha>`: relatório em `600 Deploy/Output/modelo-kart-01/reports/deploy-validation/`
      — **aguarda o validador** sobre esta revisão do registro (o relatório de 2026-10-27 vale para `6ea3862`, não para `<sha>`).
- [x] Histórico de migração: **não se aplica** — não há banco; nenhum formato publicado ou persistido muda por esta feature; a
      linha de base da simulação vive no repositório e não no bundle (`REL-0002`).
- [x] Feature flag: **não há** (ADR-0003); a feature fica ativa ao servir o `index.html` novo.
- [x] **Repositórios e ambientes configurados** (2026-10-21, primeira release): produção com *Source* = GitHub Actions, revisor
      obrigatório `edumatosr6-svg` e política de ramos restrita a `master`; staging com *Source* = GitHub Actions, sem revisor e
      política de ramos **sem restrição** — a reconferir depois de qualquer despublicação. Nenhuma credencial configurada: o
      Pages usa o token OIDC da execução (D-DP-05).
- [x] **Execução verde do workflow `pages` em staging para `<sha>`**: `<run-staging>` 41101055606; a URL de staging serve
      `index-BwruE9Pq.js` desde 2026-10-30 17:48:06Z (200 em HTTPS; `check_served` 40/40; byte a byte o JS do build limpo). Em
      produção, **nenhuma execução verde** e nada aprovado; a URL responde 404.
- [x] **Alvo de reversão em staging retido**: 41076989728 (`652bbaa`), caminho B; procedimento ensaiado no mesmo site em
      2026-10-27 (≈ 1 min 17 s / ≈ 2 min 12 s). O par desta revisão (41076989728 ↔ 41101055606) não foi reexecutado por este
      registro (nenhum comando contra o GitHub; `98-divergences.md`, DIV-DP-03).
- [ ] **`docs/kart-01/device-log.md` com as linhas H1–H6 registradas sobre `index-BwruE9Pq.js`, nos aparelhos de referência
      nomeados** (notebook e celular intermediário, paisagem e retrato): as 24 linhas `unverified` do veredito de testes
      (AC-US-0001-14..16, AC-US-0002-01, -03..-06, AC-US-0003-08, -10..-14, AC-US-0004-01, -02, AC-US-0005-01, -04..-07,
      NFR-0001, NFR-0002; NFR-0006 linha 1 é revisão de código) dependem disso. O arquivo existe com a execução 1 (navegador
      embutido, build de 2026-10-27, parcial); a seção *Execuções nos aparelhos de referência* diz "Não executadas" (DIV-DP-01).
- [ ] **Portas humanas das releases contidas** nesta: `docs/handling-device-log.md` da `dirigibilidade` (o arquivo não existe),
      a execução seguinte de `docs/lap-validation-device-log.md` (`race-lap-validation`) e `docs/kart-park-device-log.md`
      (`pista-kart-park`). Promover `<sha>` promove as quatro; as listas cabem na mesma sessão de aparelho sobre este bundle
      (DIV-DP-12).
- [ ] **Decisão Esri registrada em `DOMAIN.md` da `pista-kart-park`, ou escolha registrada entre as opções 1 a 3 de
      `01-release.md`** (*Produção — opções enquanto a decisão Esri não existe*). Sem uma das duas, **não há pergunta de
      promoção** para `<sha>`: o commit contém a Kart Park (DIV-DP-15).
- [x] Monitoramento decidido: **vigilância manual conforme este runbook**, nenhum monitor externo nem telemetria (decisão de
      2026-10-21, mantida; `REL-0005`). A verificação HTTPS manual é *Verify* 1 e 8.
- [x] Node na versão fixada: `.nvmrc` = `24` na raiz (o workflow lê `node-version-file`).

## Promote

| # | Passo | Esperado | Leva | Desfaz-se por |
|---|---|---|---|---|
| 1 | conferir o commit: `git log --oneline -5`; `git status` | `6b314b2` ou só commits de registro acima dele (hoje `483c5fa`); nenhuma modificação local em `src/`, `scripts/`, `tests/`, `tracks/`, `index.html`, `package.json`, lockfile | 1 min | nada a desfazer: leitura local |
| 2 | `npm ci` | saída 0; `package-lock.json` inalterado | 1 a 2 min | nada externo: só recria `node_modules/` |
| 3 | `npm test` | saída 0; `443 passed, 0 failed, 0 skipped` (66 em `tests/modelo-kart-01-*.test.ts`) | 1 a 3 min | nada a desfazer |
| 4 | `npm run build` | saída 0; `dist/assets/index-<hash>.js` e um CSS, nenhum outro arquivo em `dist/assets/`; anotar o `<hash>` (com `-- --base=/kartle-staging/`, `BwruE9Pq`) — é a conferência local; o artefato publicado é o do workflow | 1 min | nada externo: apagar `dist/` local |
| 5 | `python -I "600 Deploy/Output/race-lap-validation/tools/measure_dist.py" dist` e `check_bundle` | `within_limit=True` (≈ 711 561 bytes, RNF02); `checks=48 failed=0` | 10 s | nada a desfazer: leitura |
| 6 | registrar o alvo de reversão em `docs/kart-01/device-log.md`: staging → execução 41076989728 (`652bbaa`), caminho B; produção → "nenhuma execução verde anterior; reversão pelo caminho A (Unpublish site)" | nota registrada com os números conferidos na aba Actions de cada repositório | 2 min | nada a desfazer: anotação |
| 7 | publicar em **staging**: `git push staging master:staging` (**feito**: `<run-staging>` 41101055606, `6b314b2`) e conferir `check_served https://edumatosr6-svg.github.io/kartle-staging/ index-<hash>.js`. Se o `deploy` falhar **sem executar nenhum passo**, liberar a política de ramos do ambiente e *Re-run all jobs* | execução verde (`npm test` 443 aprovados; `Measure dist` `within_limit=True`; `deploy` concluído); `check_served` `checks=40 failed=0` (**hoje: 200, `index-BwruE9Pq.js`, 40/40, servido desde 17:48:06Z**) | 3 a 5 min (execução) + até 10 min de cache | R1/R2 sobre `kartle-staging` (caminho B: 41076989728; ou A) |
| 8 | executar `smoke.md` em staging (D1–D16, M1–M11) **e as linhas humanas H1–H6 abaixo**, e registrar em `docs/kart-01/device-log.md` (uma entrada por aparelho e orientação, nomeando `index-BwruE9Pq.js`) | todas as linhas dentro do limiar; D4/M4 sem kart de caixas; D7/M6 com placa `01` e sombra; D10/D13/M7 com o kart inteiro na curva e o campo de visão constante; D11/M11 com a câmera atrás do piloto depois da chegada; D12 com marcas só em curva forte; H6 com `minFps` ≥ 60 e ≥ 30 | 90 a 150 min | nada a desfazer: observação; o registro fica como histórico |
| 9 | **decisão Esri ou escolha da opção** (`01-release.md`): sem uma das duas, **parar aqui**. Opção 1 (decisão Esri tomada e entregue pela `pista-kart-park`): a árvore a promover passa a ser a do commit dessa entrega, e os passos 1–8 repetem-se para ela. Opção 2: a árvore a promover é `6ea3862` e o runbook que vale é o validado em 2026-10-27 (versão 1.0.0 deste arquivo), não este | escolha registrada no relatório de validação e em `DOMAIN.md`, com data | até a decisão; sem decisão, vale "não promover" | nada a desfazer |
| 10 | **pergunta ao dono do produto**: promover o commit escolhido no passo 9 a produção? (D-DP-06). Lembrete: produção nunca serviu um `dist/`; promover esta release é também promover `dirigibilidade`, `race-lap-validation` e `pista-kart-park`, com as suas portas humanas no estado que a precondição correspondente registra | resposta explícita registrada; "não" encerra aqui sem efeito | até 1 dia útil; sem resposta, vale "não" | nada a desfazer |
| 11 | publicar em **produção**: `git push origin master` (avanço rápido a partir de `05c3570`, **nunca** `--force`); em `https://github.com/edumatosr6-svg/kartle/actions`, abrir a execução **mais recente** cujo `build` esteja verde, conferir que o commit é o do passo 9 e que o passo *Build* imprime o `index-<hash>.js` esperado; **nunca** aprovar a 39827702391 (`05c3570`) nem outra execução de árvore diferente; só depois do "sim" do passo 10, **Review deployments** → marcar `github-pages` → **Approve and deploy** | `build` verde com `npm test` todo aprovado e `Measure dist` `within_limit=True`; após a aprovação, `deploy` verde com a URL `https://edumatosr6-svg.github.io/kartle/` | 3 a 5 min de execução + o tempo até o clique | R1 (caminho A em produção); antes do clique, **Reject** deixa tudo como está |
| 12 | propagação do cache: sem purga no Pages (`max-age=600`); esperar até 10 min e `check_served https://edumatosr6-svg.github.io/kartle/ index-<hash>.js` em janela anônima | `checks=40 failed=0`; o `index.html` servido referencia `/kartle/assets/index-<hash>.js`; JS e CSS com 200 | até 10 min | R2 |

## Verify

| # | Verificação (`smoke.md`, *Verificação em produção*) | Esperado |
|---|---|---|
| 1 | D1 / M1 HTTPS em `https://edumatosr6-svg.github.io/kartle/` — **verificação manual** (+ `check_served`), a única vigilância de disponibilidade desta release | cadeado válido; 0 recursos inseguros; `index.html`, JS e CSS com 200 e nenhum outro *asset*; `<hash>` esperado; inclinação ativa no celular (RNF06, NFR-0003) |
| 2 | D2 / M2 carregamento em 4G, cache vazio | kart responde em menos de 10 s (RNF01) |
| 3 | D3 / M3 bytes transferidos na primeira visita | abaixo de 3 145 728 bytes (NFR-0002, RNF02); esperado da ordem de 189 KB comprimidos |
| 4 | D4 / M4 visão geral e estado inicial | pista inteira com o Kart 01 na largada, nenhum kart de caixas; `ARCADE ASSISTIDO · TREINO LIVRE`; um botão "treino" (AC-US-0003-10, AC-US-0001-14) |
| 5 | D5 / M5 console | 0 erros ao carregar e num treino |
| 6 | D6, D7, D8 / M6, M7 contagem, corrida, placa, sombra, esterço; retrato no celular; campo de visão | descida sem subir e `VERDE` atrás do piloto; placa `01` legível e sombra no chão; rodas e volante com o esterço; kart inteiro na curva nas duas formas; nenhum comando muda o campo de visão (AC-US-0003-11, -12, AC-US-0001-15, -16, AC-US-0002-01..04, AC-US-0003-08, -04) |
| 7 | D11 / M11 fim de uma volta de treino e "encerrar treino" | câmera atrás do piloto em movimento depois da chegada; ao encerrar, kart parado com a câmera atrás (AC-US-0003-14, -13 na forma alcançável) |
| 8 | repetir 1, 4, 5 e 7 depois de 24 h (vigilância manual; nenhum monitor externo) | mesmos resultados; a execução aprovada continua a última em `https://github.com/edumatosr6-svg/kartle/actions` e Settings → Pages mostra o site ativo com essa implantação |

**Gatilhos de reversão (D-DP-03):** carregamento de 10 s ou mais em 4G; transferência de 3 145 728 bytes ou mais; o kart de caixas
em qualquer quadro; placa sem o número `01` num navegador de referência com contexto 2D, ou kart sem sombra; qualquer parte do
kart ou do piloto fora do quadro numa curva de 90° a 50 km/h, em paisagem ou em retrato; a câmera a subir durante a contagem ou um
corte no `VERDE`; **o campo de visão a mudar com qualquer comando**; **fumaça ou chama no escapamento, ou indicação de drift junto
ao kart**; **a câmera a ir à visão geral ou a descer pelo fim de uma volta de treino**; rodas ou volante parados com esterço;
movimento durante a pausa ou deslizamento após reposicionar; **marcas fora dos pneus traseiros, marcas na reta, na visão geral, na
contagem ou na pausa, ou nenhuma marca numa curva forte com o kart escorregando**; erro no console ao carregar ou durante a volta
(inclusive 404 de um *asset* em `/kartle/assets/`); qualquer recurso servido sem HTTPS; `minFps` abaixo de 60 no notebook ou de 30
no celular de referência (NFR-0001, RNF03).

## Linhas humanas — o smoke de aparelho que o dono do produto executa (H1–H6)

As seis linhas do estágio de testes que só a tela, o aparelho, a orientação ou o relógio de parede decidem
(`500 Tests/Output/modelo-kart-01/98-divergences.md`; `test-strategy.md` E2E-01 a E2E-06, seed rev 4). Executadas sobre a URL de
**staging** (`index-BwruE9Pq.js`), no notebook e no celular de referência nomeados pelo modelo comercial, com a página em primeiro
plano, e registradas em `docs/kart-01/device-log.md` (build, aparelho, navegador, versão, DPR, área de jogo em px, orientação,
método da contagem, `fpsPerSecond`, `minFps`, resultado por roteiro, download, data) — uma entrada por aparelho e por orientação.
Nenhuma pode ser feita por um loop nem sob automação do navegador (o ritmo sob automação é inválido: execução 1 do registro).

| # | Linha | O que se faz | O que se registra | Critério de aprovação | Roteiro |
|---|---|---|---|---|---|
| H1 | Kart 01 em toda exibição; visão geral e descida | abrir a URL; olhar a visão geral nas duas pistas do seletor; iniciar o treino e observar a contagem; recarregar durante a contagem e durante a corrida; no celular, girar na visão geral (paisagem ↔ retrato); **gravar a tela** da contagem | a pista inteira na visão geral nas duas formas; o Kart 01 (laranja, piloto de macacão azul e capacete) em todo quadro, antes e depois de cada recarga e giro; na gravação, o primeiro quadro da contagem na visão geral, a altura da câmera nunca a subir, e no `VERDE` a câmera atrás do piloto sem corte; **desktop e celular** | AC-US-0001-14: 0 quadros com o kart de caixas; AC-US-0003-10: 4 cantos da pista no quadro em cada forma; AC-US-0003-11: 0 quadros com a altura a subir; AC-US-0003-12: pose de corrida no quadro do sinal verde | E2E-01 |
| H2 | modelo com placa `01`, piloto e sombra; câmera atrás e perto; **câmera depois de uma volta de treino** | em corrida, olhar o kart pela câmera de corrida; completar uma volta de treino e **seguir pilotando** a segunda; invalidar uma volta por corte e reposicionar, seguindo em frente; depois "encerrar treino" e "treino" de novo | a placa `01` legível no para-choque traseiro; o piloto sentado com as mãos no volante; a sombra no asfalto junto ao kart; a câmera atrás e perto (o kart na parte inferior do quadro, motor à direita do piloto); **ao cruzar a chegada (volta válida, invalidada ou com reposicionamento), a câmera continua atrás do piloto acompanhando o kart em movimento, sem visão geral nem descida**, e o resultado aparece ao lado sem parar o kart; ao "encerrar treino", kart parado, câmera atrás do kart parado, oferta sobre a cena; o novo treino começa na visão geral; **desktop e celular** | AC-US-0001-15: sombra visível; AC-US-0001-16: número legível; AC-US-0003-01..03: câmera atrás, 1,38 m / 3,05 m (confirmado pela forma, não por instrumento); **AC-US-0003-14: 0 quadros de visão geral ou descida pelo fim de uma volta de treino**; AC-US-0003-13 na forma alcançável pela página (DIV-DP-14) | E2E-02 |
| H3 | rodas esterçam e giram; volante e mãos; pausa e reposicionamento | esterçar para os dois lados (teclas; inclinação no celular) e acelerar; pausar (Esc, troca de aba; cobrir o sensor no celular) e retomar; reposicionar | as rodas dianteiras giram para o lado do esterço e o volante mais, para o mesmo lado; as mãos ficam no aro; as quatro rodas rolam com a velocidade; na pausa, kart, rodas, câmera e marcas parados; depois de reposicionar, kart e câmera na nova posição no quadro seguinte; **desktop e celular** | AC-US-0002-01, -02, -03, -04: esterço, giro, volante, mãos; AC-US-0002-05, -06: 0 movimento na pausa, 0 deslizamento, rumo correto | E2E-03 |
| H4 | sem corte numa curva de 90° a 50 km/h; **nenhum efeito de turbo no campo de visão**; retrato | em corrida, numa curva de 90° a cerca de 50 km/h, em paisagem **e em retrato** (celular; desktop com a janela mais alta que larga); apertar, tocar e inclinar **todos os comandos**, inclusive Espaço e qualquer botão que antes acionava drift ou turbo; trocar de orientação | o kart com o piloto inteiro no quadro durante toda a curva nas duas formas; **o campo de visão não muda em nenhum quadro** com nenhum comando; na troca de orientação a pose não muda e o campo da nova forma vale no quadro seguinte; **celular nas duas formas; desktop** | AC-US-0003-08: 0 cantos do kart ou do piloto fora do quadro; AC-US-0003-04: 62° em paisagem / regra de retrato, constante com qualquer comando (AC-US-0003-09 retirado); REQ-FEAT-0003-15: 1 quadro de atraso no máximo | E2E-04 |
| H5 | **marcas de pneu visíveis em curva forte e ausentes na reta e na pausa; nenhum efeito de turbo nem de drift** | escolher a pista `synthetic`; antes da largada (visão geral e contagem, acelerando) e em corrida, com todos os comandos: olhar o escapamento e o kart; numa **curva forte acima de 6 m/s**, escorregar de lado para a esquerda e para a direita, sem comando de drift; numa reta a fundo; pausar numa curva; reposicionar durante as marcas; depois do fim de uma volta de treino, outra curva forte | **em curva forte com o kart escorregando, um trecho novo sob cada pneu traseiro exibido do seu lado, quadro a quadro, também depois do fim de uma volta de treino**; **na reta, na visão geral, na contagem e na pausa, nenhum trecho novo**; depois do reposicionamento, trechos antigos parados e novos da nova posição; **nenhuma fumaça ou chama no escapamento e nenhuma indicação de drift**, em nenhum quadro; **desktop e celular** | AC-US-0005-01: 0 marcas fora do pneu; AC-US-0005-06: trechos presentes com > 6 m/s e deriva > 0,055 rad; AC-US-0005-07: 0 trechos fora dessa situação; AC-US-0005-04: 0 indicações de drift; AC-US-0005-05: 0 quadros com efeito de turbo | E2E-05 |
| H6 | taxa de quadros 60/30 e download | uma volta completa em corrida com a aba em primeiro plano e sem pausa, contando os quadros de cada segundo (ferramentas de desempenho do navegador ou trecho no console; nunca código do jogo): no **notebook** em paisagem; no **celular** em paisagem **e** em retrato; numa primeira visita com cache vazio, ler os bytes comprimidos transferidos | `fpsPerSecond` (lista) e `minFps` por aparelho e orientação; bytes comprimidos; **uma entrada por aparelho e orientação** | NFR-0001 / AC-US-0004-01: `minFps` ≥ 60 no notebook; AC-US-0004-02: `minFps` ≥ 30 no celular nas duas formas (uma medida em desktop não vale, I9); NFR-0002: abaixo de 3 145 728 bytes | E2E-06 |

Resultado esperado do conjunto: 6 linhas `PASS` registradas (3 entradas no device log: notebook paisagem, celular paisagem,
celular retrato, cada uma nomeando `index-BwruE9Pq.js`); a partir daí as 24 linhas `unverified` do veredito de testes ficam
verificadas na sua metade humana, e a precondição correspondente deste runbook fecha. Uma linha reprovada é `FAIL CODE` (defeito
de aplicação), nunca de empacotamento: o bundle é o mesmo que passou nas 443 verificações — exceto a placa sem número num navegador
sem contexto 2D (ambiente; anotar o navegador) e um `minFps` abaixo do limiar num aparelho fora da referência (I9; anotar o modelo).

## Roll back

| # | Passo (desfaz o passo de *Promote* indicado) | Esperado | Leva |
|---|---|---|---|
| R1 | desfaz 11 (ou 7, em staging), pelo caminho que o passo 6 registrou. **Produção, hoje — caminho A**: `https://github.com/edumatosr6-svg/kartle` → Settings → Pages → menu "…" → **Unpublish site** → confirmar. **Staging — caminho B**: Actions → `pages` → execução **41076989728** → **Re-run all jobs** (conferir a política de ramos do ambiente se o site tiver sido despublicado); serve o `<hash-anterior>` impresso no *Build* dessa execução. **Caminho C** quando B não existir: `git revert` de `6b314b2` e `aeaf504` (nessa ordem; conflitos em `src/main.ts` resolvidos a favor das outras features), `npm test` local, `git push origin master` (ou `staging master:staging`), aprovar o `deploy` | **A**: a URL responde 404 do GitHub em até 10 min; Settings → Pages sem site publicado. **B**: a URL serve o `index.html` que referencia `assets/index-<hash-anterior>.js`; o Kart 01 da revisão anterior, treino de uma volta, mesma física v6. **C**: execução nova com `npm test` verde na árvore revertida | A: 1 min + até 10 min de cache (ensaiado em 2026-10-21). B: ≈ 1 min 20 s do comando à página servida (procedimento ensaiado em 2026-10-27) + até 10 min de cache para quem tem a página em cache. C: 15 min + 3 a 5 min + aprovação + cache |
| R2 | propagação do cache (desfaz 12): sem purga; esperar até 10 min e `check_served <URL> index-<hash-anterior>.js` em janela anônima — esperado `hash do JS é o esperado` `ok` e reprovadas as linhas que a árvore anterior não satisfaz (a condição das marcas, as ausências de `exhaustOutlet`/`escapamentoSaida`/`turboFovDeltaDeg`/`baseVerticalFovDeg`). **Para voltar a publicar depois do caminho A**: reativar o Pages (Settings → Pages → *Source* = GitHub Actions), **conferir a política de ramos do ambiente** e *Re-run all jobs* da execução verde | **A**: busca nova devolve 404; na republicação, 200 com o `<hash>` da execução reexecutada. **B/C**: hash esperado servido | até 10 min (republicação pelo caminho A: ≈ 7,5 min no ensaio de 2026-10-21; restauração pelo caminho B: ≈ 2 min 12 s no ensaio de 2026-10-27) |
| R3 | executar *Verify* 1, 2 e 4 na versão restaurada (**B/C**); no caminho **A**, confirmar que a URL responde 404 nos 4 navegadores de referência | **B/C**: HTTPS válido; carregamento abaixo de 10 s; a tela anterior funciona. **A**: nenhuma página servida | 10 min |
| R4 | registrar a reversão: hash revertido, alvo restaurado (A: "não publicado"; B/C: hash restaurado e número da execução), gatilho observado, horário | linha em `docs/kart-01/device-log.md` e relatório em `reports/deploy-validation/` | 5 min |
| R5 | se a causa for da aplicação (kart de caixas, placa, sombra, câmera, campo de visão, marcas, efeitos, esterço, fps), abrir `FAIL CODE` para o estágio de código; se for do empacotamento (base `/kartle/`, cache, HTTPS, Pages, política de ramos, *asset* a mais), `FAIL` deste estágio | relatório com a classificação | 15 min, no mesmo dia |

Staging reverte-se do mesmo modo (R1 e R2 sobre `edumatosr6-svg/kartle-staging`; lá o `deploy` não pede aprovação) e nunca é
precondição para reverter produção. Atenção: reverter staging tira de lá também o que as releases contidas publicaram desde
`652bbaa` (`dirigibilidade` rev 6, `race-lap-validation` treino contínuo, `pista-kart-park` revalidada) — avisar quem estiver a
medir essas releases antes de reexecutar.

Dados: nada a desfazer. A feature não grava no navegador e não há servidor (DES-0007, `REL-0002`); um jogador com a página nova
em cache continua a jogá-la por até 10 min; depois busca o `index.html` restaurado (ou o 404 do caminho A).

**Point of no return:** não existe nesta release. Em produção a reversão é despublicar (caminho A), sempre possível; em staging a
execução verde anterior é reexecutável enquanto o Actions a retiver (90 dias) e, passado isso, o caminho C reconstrói de um
commit — o repositório é o artefato de reversão (ADR-0003). O único ato que tornaria a reversão impossível seria **apagar o
histórico do repositório** (`push --force` sobre `master`), que nenhum passo deste runbook faz. A linha de base da simulação
(`tests/fixtures/kart01-sim-baseline.json`, `recordedOnCommit` `a361c9c`) só é regravada com `--force` e num commit próprio.
