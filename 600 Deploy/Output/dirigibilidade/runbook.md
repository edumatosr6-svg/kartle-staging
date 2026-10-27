---
title: Runbook — promover, verificar e reverter a release de dirigibilidade (arcade-assistido-v5)
feature: dirigibilidade
stage: deploy
status: validated
version: 1.0.0
sources: [DM-0001, DES-0005, DES-0006, DES-0007, NFR-0002, NFR-0003, NFR-0004, NFR-0009, TEST-0007, TEST-0008, TEST-0010]
---

# Runbook

Para quem não escreveu a release. Executar da raiz do repositório, com todo caminho entre aspas. Nenhum passo é
executado por um loop: cada um é de um humano, e a promoção a produção é sempre do dono do produto (D-DP-06). O
provedor é o **GitHub Pages** (D23): o pipeline é `.github/workflows/pages.yml`, a publicação é um push e a promoção
é um clique de aprovação no ambiente `github-pages` do repositório de produção — o mesmo procedimento da release
anterior (`600 Deploy/Output/race-lap-validation/runbook.md`), com os nomes desta release. Nomes usados abaixo:

| Nome | Valor (não é segredo) |
|---|---|
| dono do produto | conta GitHub `edumatosr6-svg` (revisor obrigatório do ambiente `github-pages` de produção) |
| repositório de **produção** | `edumatosr6-svg/kartle` — `https://github.com/edumatosr6-svg/kartle` (público), remoto local `origin`, ramo `master`, site `https://edumatosr6-svg.github.io/kartle/`; execuções em `https://github.com/edumatosr6-svg/kartle/actions` |
| repositório de **staging** | `edumatosr6-svg/kartle-staging` — `https://github.com/edumatosr6-svg/kartle-staging` (público), remoto local `staging`, ramo `staging`, site `https://edumatosr6-svg.github.io/kartle-staging/`; execuções em `https://github.com/edumatosr6-svg/kartle-staging/actions` |
| `<sha>` | o hash do commit da árvore verificada: `b86b200d14f950baa1a902f56b6f6fbfff5082ba` (ponta de `master` em 2026-10-27). Um commit posterior **só de registro** (que não toque `src/`, `scripts/`, `tests/`, `index.html`, `docs/physics.md`, `package.json` nem `package-lock.json`) não invalida a release; qualquer outro invalida |
| `<hash>` | o hash de conteúdo no nome do JS (`assets/index-<hash>.js`), impresso no passo *Build* da execução que se publica; para a árvore de `<sha>`, **`BiFxJ0FY`** (build local e staging, 579 462 bytes) |
| `<sha-anterior>` / `<hash-anterior>` | a release anterior (`race-lap-validation`): árvore `c41c6c3`, JS `index-Cqfgl3da.js`; em staging, execução verde **39631099098** (commit `2bee672`) |
| "execução verde" | uma execução do workflow `pages` com os dois trabalhos (`build`, `deploy`) concluídos com sucesso |
| `check_served` | `python -I "600 Deploy/Output/dirigibilidade/tools/check_served.py" <URL> index-<hash>.js` — dois GET de leitura; `checks=18 failed=0` aprova |

Os números das execuções do Actions **não são copiados aqui**: cada push cria uma execução nova nos dois repositórios e,
pelo grupo de concorrência `pages`, cancela a execução de produção que ainda esperava atrás da mais antiga — as execuções
em vigor são sempre as que a aba Actions mostra, e são elas que o relatório de validação cita.

Artefato: `dist/` (HTML, JS e CSS estáticos), construído **pelo workflow** a partir de `<sha>`. Não há banco, migração
de dado, armazenamento no navegador nem aplicativo nativo. A feature fica ativa ao servir o `index.html` novo (sem flag).

**Alvo de reversão.** Três caminhos, e cada passo de *Roll back* nomeia qual aplica:

| Caminho | Quando se aplica | O que R1 faz |
|---|---|---|
| **A — despublicar** | não há execução verde anterior no repositório (**produção, hoje**: nada foi promovido) | Settings → Pages → menu "…" ao lado da URL do site → **Unpublish site**; a URL responde 404 do GitHub. Ensaiado em staging em 2026-10-21 |
| **B — reexecutar a última execução verde anterior** | existe uma execução verde do commit anterior (**staging, hoje**: 39631099098, `2bee672`, serve `<hash-anterior>`) | Actions → workflow `pages` → essa execução → **Re-run all jobs**; o workflow reconstrói esse commit (`npm ci` do lockfile, `npm test`, build) e publica (em produção, pede a aprovação do revisor). Em staging, **conferir antes a política de ramos do ambiente** se o site tiver sido despublicado entretanto. A página volta ao acerto v4 sem `setupVersion` no resultado |
| **C — reverter e reconstruir** (DM-0001, *Plano de migração*) | quando B não existe ou a execução anterior já não pode ser reexecutada (retenção de 90 dias) | `git revert <sha>` (e dos commits da cadeia desta feature que tocam a árvore: `25063ff`, e os anteriores de código, na ordem inversa) `&& git push origin master`; a execução nova roda `npm test` e o build na árvore revertida e pede aprovação |

## Preconditions

- [x] **Commit verificado existe**: `b86b200d14f950baa1a902f56b6f6fbfff5082ba` (`master`), a árvore que o veredito de
      testes verificou. Quem executa confere: `git log --oneline -5` mostra `b86b200` como ponta (ou um commit só de
      registro acima dele) e `git status` não acusa modificação em `src/`, `scripts/`, `tests/`, `index.html`,
      `docs/physics.md` nem no lockfile. **Atenção**: outra feature (`modelo-kart-01`) está a editar `src/main.ts` na
      árvore de trabalho — não misturar: o que se publica é o commit, não a árvore de trabalho.
- [x] Veredito de testes `SUCCESS`: `500 Tests/Output/dirigibilidade/reports/test-validation/test-validation-20261027-1902.md`
      (237 verificações, 237 aprovadas; `fresh: true`).
- [ ] Validação de staging `SUCCESS`: relatório em `600 Deploy/Output/dirigibilidade/reports/deploy-validation/` —
      **aguarda a primeira execução do validador** sobre este registro.
- [x] Histórico de migração: **não se aplica** — não há banco; o acerto versionado e os leitores de registro viajam no
      bundle (`REL-0002`).
- [x] Feature flag: **não há** (DES-0007, ADR-0001); a feature fica ativa ao servir o `index.html` novo.
- [x] **Repositórios e ambientes configurados** (2026-10-21, release anterior): produção com *Source* = GitHub Actions,
      revisor obrigatório `edumatosr6-svg` e política de ramos restrita a `master`; staging com *Source* = GitHub Actions,
      sem revisor e política de ramos **sem restrição** — a reconferir depois de qualquer despublicação, porque a
      reativação do Pages recria o ambiente restrito ao ramo padrão e o `deploy` de `staging` passa a falhar com zero
      passos. Nenhuma credencial configurada: o Pages usa o token OIDC da execução (D-DP-05).
- [x] **Execução verde do workflow `pages` em staging para `<sha>`**: a URL de staging serve `index-BiFxJ0FY.js` desde
      2026-10-27 19:11:49Z (200 em HTTPS; `check_served` 18/18); o número da execução é lido na aba Actions e entra no
      relatório de validação. Em produção, **nenhuma execução verde** e nada aprovado (a execução da release anterior
      ficou em *Waiting* e pode ter sido cancelada pelo grupo `pages`: ler na aba Actions; não aprovar antes do passo 9).
- [x] **Reversão ensaiada em staging** (2026-10-21, release anterior; *Ensaio de reversão R4* em
      `docs/lap-validation-device-log.md`): R1 despublicar → 404 em ≈ 1 min no navegador, 200 em cache de borda por mais
      de 6 min; R2 republicar (reativar o Pages, liberar a política de ramos de novo, *Re-run all jobs*) → 200 com o mesmo
      `<hash>` em ≈ 7,5 min. O procedimento desta release é o mesmo e o site é o mesmo; não é repetido. O caminho B
      (reexecutar 39631099098) **não foi ensaiado** e é a forma mais simples de reversão em staging: o validador pode
      ensaiá-lo (2 execuções, ≈ 15 min com o cache) — `98-divergences.md`, DIV-DP-03.
- [ ] **`docs/handling-device-log.md` criado e com as linhas H1–H5 registradas em staging, nos aparelhos nomeados**
      (5 critérios `unverified` no veredito de testes dependem disso: AC-US-0004-06, AC-US-0005-05, NFR-0002, NFR-0003,
      NFR-0004). O arquivo **ainda não existe** (DIV-DP-01). A rodada de teste do dono do produto que o domínio exige
      antes de fechar a feature (critério final do domínio) cabe na mesma sessão.
- [x] Monitoramento decidido: **vigilância manual conforme este runbook**, nenhum monitor externo nem telemetria
      (decisão de 2026-10-21, mantida; `REL-0005`). A verificação HTTPS manual é *Verify* 1 e 8.
- [x] Node na versão fixada: `.nvmrc` = `24` na raiz (o workflow lê `node-version-file`).

## Promote

| # | Passo | Esperado | Leva | Desfaz-se por |
|---|---|---|---|---|
| 1 | conferir o commit: `git log --oneline -5`; `git status` | `b86b200` é a ponta (ou só commits de registro acima); nenhuma modificação local em `src/`, `scripts/`, `tests/`, `index.html`, `docs/physics.md`, lockfile | 1 min | nada a desfazer: leitura local |
| 2 | `npm ci` | saída 0; `package-lock.json` inalterado | 1 a 2 min | nada externo: só recria `node_modules/` |
| 3 | `npm test` | saída 0; `237 passed, 0 failed, 0 skipped` | 1 min | nada a desfazer |
| 4 | `npm run build` | saída 0; `dist/assets/index-<hash>.js` com `<hash>` = `BiFxJ0FY` (se a árvore for a de `<sha>`); anotar o `<hash>` — é a conferência local; o artefato publicado é o do workflow | 1 min | nada externo: apagar `dist/` local |
| 5 | `python -I "600 Deploy/Output/race-lap-validation/tools/measure_dist.py" dist` e `python -I "600 Deploy/Output/dirigibilidade/tools/check_bundle.py" dist docs/physics.md` | `within_limit=True` (≈ 598 028 bytes, RNF02); `checks=20 failed=0` | 10 s | nada a desfazer: leitura |
| 6 | registrar o alvo de reversão em `docs/handling-device-log.md`: staging → execução 39631099098 (`2bee672`, `<hash-anterior>` `Cqfgl3da`), caminho B; produção → "nenhuma execução verde anterior; reversão pelo caminho A (Unpublish site)", ou a execução da árvore anterior ainda em *Waiting*, se existir, como alternativa ao A | nota registrada com os números lidos na aba Actions de cada repositório | 2 min | nada a desfazer: anotação |
| 7 | publicar em **staging**: `git push staging master:staging` (**feito em 2026-10-27** pelo dono do produto) e acompanhar a execução `pages` desse commit em `https://github.com/edumatosr6-svg/kartle-staging/actions`; depois `check_served https://edumatosr6-svg.github.io/kartle-staging/ index-<hash>.js`. Se o `deploy` falhar **sem executar nenhum passo**, liberar a política de ramos do ambiente e *Re-run all jobs* | execução verde (`npm test` 237 aprovados; `Measure dist` `within_limit=True`; `deploy` concluído); `check_served` `checks=18 failed=0` com o `<hash>` do passo *Build* dessa execução (**hoje: 200, `index-BiFxJ0FY.js`, 18/18**) | 3 a 5 min (execução) + até 10 min de cache | R1/R2 sobre `kartle-staging` (caminho B: 39631099098; ou A) |
| 8 | executar `smoke.md` em staging (D1–D12, M1–M9) **e as linhas humanas H1–H5 abaixo**, e registrar em `docs/handling-device-log.md` | todas as linhas dentro do limiar; D7/M7 com `arcade-assistido-v5` no resultado; D8/M7 com o texto compartilhado correto; D9 com `—` ao trocar de acerto | 60 a 120 min | nada a desfazer: observação; o registro fica como histórico |
| 9 | **pergunta ao dono do produto**: promover o commit `<sha>` a produção? (D-DP-06). Lembrete: produção nunca serviu um `dist/`; promover esta release é também promover a de `race-lap-validation`, contida nela | resposta explícita registrada; "não" encerra aqui sem efeito | até 1 dia útil; sem resposta, vale "não" | nada a desfazer |
| 10 | publicar em **produção**: `git push origin master` (se a ponta já tiver sido enviada, a execução existe); em `https://github.com/edumatosr6-svg/kartle/actions`, abrir a execução **mais recente** cujo `build` esteja verde, conferir que o commit é `<sha>` (ou um posterior só de registro) e que o passo *Build* imprime `index-<hash>.js`; só depois do "sim" do passo 9, **Review deployments** → marcar `github-pages` → **Approve and deploy** | `build` verde com `npm test` 237 aprovados e `Measure dist` `within_limit=True`; após a aprovação, `deploy` verde com a URL `https://edumatosr6-svg.github.io/kartle/` | 3 a 5 min de execução + o tempo até o clique | R1 (caminho A nesta release em produção); antes do clique, **Reject** deixa tudo como está |
| 11 | propagação do cache: sem purga no Pages (`max-age=600`); esperar até 10 min e `check_served https://edumatosr6-svg.github.io/kartle/ index-<hash>.js` em janela anônima | `checks=18 failed=0`; o `index.html` servido referencia `/kartle/assets/index-<hash>.js`; JS e CSS com 200 | até 10 min | R2 |

## Verify

| # | Verificação (`smoke.md`, *Verificação em produção*) | Esperado |
|---|---|---|
| 1 | D1 / M1 HTTPS em `https://edumatosr6-svg.github.io/kartle/` — **verificação manual** (+ `check_served`), a única vigilância de disponibilidade desta release | cadeado válido; 0 recursos inseguros; `index.html` e *assets* com 200; `<hash>` esperado; inclinação ativa no celular (RNF06) |
| 2 | D2 / M2 carregamento em 4G, cache vazio | kart responde em menos de 10 s (RNF01) |
| 3 | D3 / M3 bytes transferidos na primeira visita | abaixo de 3 145 728 bytes (RNF02); esperado da ordem de 155 KB comprimidos |
| 4 | D4 / M4 acerto padrão e pista | `ARCADE ASSISTIDO · TREINO LIVRE`; `arcade` selecionado; `synthetic`; um botão "volta de treino" (NFR-0009, NFR-0008) |
| 5 | D5 / M5 console | 0 erros ao carregar e numa volta |
| 6 | D6, D7, D8 / M6, M7 volta de treino inteira, resultado e compartilhar | HUD com valor durante a volta; `#lap-result-setup` = `arcade-assistido-v5`; texto `Kartle · synthetic v2 · <tempo> · arcade-assistido-v5` sem segundo tempo (NFR-0009, AC-US-0005-05) |
| 7 | D10 registros publicados servidos | `check_served` com os três identificadores no JS servido |
| 8 | repetir 1, 4, 5 e 6 depois de 24 h (vigilância manual; nenhum monitor externo) | mesmos resultados; a execução aprovada continua a última em `https://github.com/edumatosr6-svg/kartle/actions` e Settings → Pages mostra o site ativo com essa implantação |

**Gatilhos de reversão (D-DP-03):** carregamento de 10 s ou mais em 4G; transferência de 3 145 728 bytes ou mais;
`#lap-result-setup` sem `arcade-assistido-v5` ao fim de uma volta com o Arcade; um melhor tempo ou diferença exibida
entre acertos ou versões diferentes; HUD sem valor em algum quadro da volta; erro no console ao carregar ou durante a
volta (inclusive 404 de um *asset* em `/kartle/assets/`); `#track-status` sem `synthetic`; qualquer recurso servido sem
HTTPS; fps abaixo de 60 no notebook ou de 30 no celular de referência (RNF03); `STEP_COST` acima de 1,10 × a linha de
base na máquina de referência (NFR-0002).

## Linhas humanas — o smoke de aparelho que o dono do produto executa (H1–H5)

As cinco linhas do estágio de testes que só a tela, o sensor, o aparelho ou o relógio de parede decidem
(`500 Tests/Output/dirigibilidade/98-divergences.md`; `test-strategy.md` E2E-01 a E2E-03). Executadas sobre a URL de
**staging**, no notebook e no celular de referência nomeados, com a página em primeiro plano, e registradas em
`docs/handling-device-log.md` (aparelho, navegador, versão, medida, data) — a "execução 1" desse log, no molde da
"execução 3" que `docs/lap-validation-device-log.md` ainda espera para a release anterior. Nenhuma pode ser feita por um
loop nem sob automação do navegador (o ritmo sob automação é inválido).

| # | Linha | O que se faz | O que se registra | Critério | Roteiro |
|---|---|---|---|---|---|
| H1 | HUD por quadro | iniciar uma volta com o Arcade; **gravar a tela** do sinal verde ao fim, passando pela grama e encostando numa parede; pausar (Esc e troca de aba no notebook; cobrir o sensor no celular) e retomar | na gravação, `#speed` (km/h) e `#handling` (texto) com valor em todos os quadros; na pausa, os dois mantêm o último valor; feito em **desktop e celular** | AC-US-0004-06 (NFR-0003 na parte do celular): 0 quadros sem valor; 0 ms de avanço na pausa | E2E-01 |
| H2 | resultado e compartilhar no aparelho | completar uma volta com o Arcade; ler o resultado; trocar para Realista (melhor tempo `—`), completar uma volta (só o tempo dessa volta, com `realista-aluguel-4t-v4`), voltar ao Arcade (`—` de novo); compartilhar — área de transferência no notebook, Web Share no celular | `#lap-result-setup` = `arcade-assistido-v5`; texto compartilhado `Kartle · synthetic v2 · <tempo> · arcade-assistido-v5` sem segundo tempo; `—` nas duas trocas; folha do sistema aberta no celular | AC-US-0005-05 / RULE-0003: 0 comparações fora de `COMPARABLE`; `setupVersion` em texto nos dois canais | E2E-02 |
| H3 | inclinação no celular | com a inclinação ativa, uma volta inteira com esterço parcial nas curvas e acelerador cheio; depois uma com esterço cheio | o mesmo HUD da H1; "Saindo de traseira"/"Derrapando" só com acelerador cheio **e** esterço cheio; a volta termina com resultado e `arcade-assistido-v5` | NFR-0003 / AC-US-0003-02: 0 passos de traseira forçada com esterço parcial | E2E-03 |
| H4 | taxa de quadros | uma volta completa com o contador de fps do navegador (F12 → Rendering → Frame Rendering Stats no notebook; ferramenta remota no celular), página em primeiro plano | fps médio e mínimo, por aparelho | RNF03: 60 fps no notebook, 30 fps no celular; uma medida em desktop não vale para o celular (I9) | D12 / M9 |
| H5 | custo por passo | na **máquina de referência** (o `runtimeId` da linha de base em `docs/physics.md`), `npm run bench:handling` | registro `STEP_COST`: média em µs, linha de base, razão, veredito; a última medida registrada é 220,4 µs contra 203,3 µs (1,084 ×, `PASS`, 2026-10-27) | NFR-0002: razão ≤ 1,10; `baselineAvailable` verdadeiro (mesmo `runtimeId`) | `bench:handling` |

Resultado esperado do conjunto: 5 linhas `PASS` registradas; a partir daí os 5 critérios `unverified` do veredito de
testes ficam verificados na sua metade humana, e a precondição correspondente deste runbook fecha. Uma linha reprovada é
`FAIL CODE` (defeito de aplicação), nunca de empacotamento: o bundle é o mesmo que passou nas 237 verificações.

## Roll back

| # | Passo (desfaz o passo de *Promote* indicado) | Esperado | Leva |
|---|---|---|---|
| R1 | desfaz 10, pelo caminho que o passo 6 registrou. **Produção, hoje — caminho A**: `https://github.com/edumatosr6-svg/kartle` → Settings → Pages → menu "…" → **Unpublish site** → confirmar. **Alternativa em produção**, se a execução da árvore anterior (`race-lap-validation`, `c41c6c3`) ainda estiver em *Waiting* e não cancelada: aprová-la (volta ao acerto v4) — conferir o commit antes. **Staging — caminho B**: Actions → `pages` → execução 39631099098 → **Re-run all jobs** (conferir a política de ramos do ambiente se o site tiver sido despublicado); serve `index-Cqfgl3da.js`. **Caminho C** quando B não existir: `git revert` da cadeia desta feature, `npm test` local, `git push origin master`, aprovar o `deploy` | **A**: a URL responde 404 do GitHub em até 10 min; Settings → Pages sem site publicado. **B**: a URL serve o `index.html` que referencia `assets/index-<hash-anterior>.js`; `#lap-result-setup` vazio e o acerto v4 (comportamento da release anterior). **C**: execução nova com `npm test` verde na árvore revertida | A: 1 min + até 10 min de cache (ensaiado: 404 em ≈ 1 min no navegador, 200 em cache de borda por > 6 min). B: 3 a 5 min de execução (+ aprovação em produção) + até 10 min de cache. C: 10 min + 3 a 5 min + aprovação + cache |
| R2 | propagação do cache (desfaz 11): sem purga; esperar até 10 min e `check_served <URL> index-<hash-anterior>.js` em janela anônima. **Para voltar a publicar depois do caminho A**: reativar o Pages (Settings → Pages → *Source* = GitHub Actions), **conferir a política de ramos do ambiente** (a reativação recria o ambiente restrito ao ramo padrão; em staging liberar de novo) e *Re-run all jobs* da execução verde | **A**: busca nova devolve 404; na republicação, 200 com o `<hash>` da execução reexecutada. **B/C**: `check_served` `failed=0` com `<hash-anterior>` | até 10 min (republicação pelo caminho A: ≈ 7,5 min no ensaio) |
| R3 | executar *Verify* 1, 2 e 4 na versão restaurada (**B/C**; em D4 o acerto padrão continua "ARCADE ASSISTIDO", agora o v4, e o resultado não mostra `setupVersion`); no caminho **A**, confirmar que a URL responde 404 nos 4 navegadores de referência | **B/C**: HTTPS válido; carregamento abaixo de 10 s; a tela anterior funciona. **A**: nenhuma página servida | 10 min |
| R4 | registrar a reversão: hash revertido, alvo restaurado (A: "não publicado"; B/C: hash restaurado e número da execução), gatilho observado, horário | linha em `docs/handling-device-log.md` e relatório em `reports/deploy-validation/` | 5 min |
| R5 | se a causa for da aplicação (acerto, HUD, comparabilidade, texto compartilhado, fps, custo por passo), abrir `FAIL CODE` para o estágio de código; se for do empacotamento (base `/kartle/`, cache, HTTPS, Pages, política de ramos), `FAIL` deste estágio | relatório com a classificação | 15 min, no mesmo dia |

Staging reverte-se do mesmo modo (R1 e R2 sobre `edumatosr6-svg/kartle-staging`; lá o `deploy` não pede aprovação) e
nunca é precondição para reverter produção.

Dados: nada a desfazer. A feature não grava no navegador e não há servidor (DM-0001, DES-0008, `REL-0002`); um jogador com
a página nova em cache continua a jogá-la por até 10 min; depois busca o `index.html` restaurado (ou o 404 do caminho
A). Um texto já compartilhado com `arcade-assistido-v5` continua válido como registro: a versão anterior não o lê, e esta
versão, se voltar, o lerá como não comparável com o v4 (RULE-0003).

**Point of no return:** não existe nesta release. Em produção a reversão é despublicar (caminho A), sempre possível; em
staging a execução verde anterior é reexecutável enquanto o Actions a retiver (90 dias) e, passado isso, o caminho C
reconstrói de um commit — o repositório é o artefato de reversão. O único ato que tornaria a reversão impossível seria
**apagar o histórico do repositório** (`push --force` sobre `master`), que nenhum passo deste runbook faz. Uma
`setupVersion` publicada nunca é editada no lugar (ADR-0001): se o v5 precisar de correção, a correção é um v6 — isso
não é um ponto sem retorno, é a forma da próxima release.
