---
title: Runbook — promover, verificar e reverter a release de dirigibilidade (arcade-assistido-v6, sem drift nem turbo)
feature: dirigibilidade
stage: deploy
status: validated
version: 2.0.0
sources: [DM-0001, DES-0001, DES-0005, DES-0006, DES-0007, DES-0009, ADR-0006, NFR-0002, NFR-0003, NFR-0004, NFR-0009, TEST-0007, TEST-0008, TEST-0010]
---

# Runbook

Para quem não escreveu a release. Executar da raiz do repositório, com todo caminho entre aspas. Nenhum passo é executado por
um loop: cada um é de um humano, e a promoção a produção é sempre do dono do produto (D-DP-06). O provedor é o **GitHub
Pages** (D23): o pipeline é `.github/workflows/pages.yml`, a publicação é um push e a promoção é um clique de aprovação no
ambiente `github-pages` do repositório de produção. **Hoje esta release não é promovível**: a árvore contém a Kart Park,
bloqueada pela decisão Esri (`pista-kart-park`, ADR-0005) — ver *Decisão de promoção*. Nomes usados abaixo:

| Nome | Valor (não é segredo) |
|---|---|
| dono do produto | conta GitHub `edumatosr6-svg` (revisor obrigatório do ambiente `github-pages` de produção) |
| repositório de **produção** | `edumatosr6-svg/kartle` — `https://github.com/edumatosr6-svg/kartle` (público), remoto local `origin`, ramo `master`, site `https://edumatosr6-svg.github.io/kartle/`; execuções em `https://github.com/edumatosr6-svg/kartle/actions` |
| repositório de **staging** | `edumatosr6-svg/kartle-staging` — `https://github.com/edumatosr6-svg/kartle-staging` (público), remoto local `staging`, ramo `staging`, site `https://edumatosr6-svg.github.io/kartle-staging/`; execuções em `https://github.com/edumatosr6-svg/kartle-staging/actions` |
| `<sha>` | o hash do commit da árvore verificada: `6b314b2193c25cd6384a3f64cffdc369637b3753`. Um commit posterior **só de registro** (que não toque `src/`, `scripts/`, `tests/`, `index.html`, `docs/physics.md`, `package.json` nem `package-lock.json`, como `483c5fa`) não invalida a release; qualquer outro invalida |
| `<hash>` | o hash de conteúdo no nome do JS (`assets/index-<hash>.js`), impresso no passo *Build* da execução que se publica; para a árvore de `<sha>`, **`BwruE9Pq`** (build local e staging, 694 094 bytes) |
| execução de staging desta release | **41101055606** (`<sha>`, `build` e `deploy` `success`, 2026-10-30 17:48:12Z) |
| `<sha-anterior>` / `<hash-anterior>` | em staging, a execução verde anterior **41076989728**: commit `652bbaa`, JS `index-dD_vz2Ev.js` (acerto v6 com o drift e o turbo ainda nas telas). Em produção: nenhum (nada publicado) |
| "execução verde" | uma execução do workflow `pages` com os dois trabalhos (`build`, `deploy`) concluídos com sucesso |
| `check_served` | `python -I "600 Deploy/Output/dirigibilidade/tools/check_served.py" <URL> index-<hash>.js` — dois GET de leitura; `checks=22 failed=0` aprova |

Os números das execuções do Actions mudam a cada push: as execuções em vigor são sempre as que a aba Actions mostra, e são
elas que o relatório de validação cita.

Artefato: `dist/` (HTML, JS e CSS estáticos), construído **pelo workflow** a partir de `<sha>`. Não há banco, migração de
dado, armazenamento no navegador nem aplicativo nativo. A feature fica ativa ao servir o `index.html` novo (sem flag).

**Alvo de reversão.** Três caminhos, e cada passo de *Roll back* nomeia qual aplica:

| Caminho | Quando se aplica | O que R1 faz |
|---|---|---|
| **A — despublicar** | não há execução verde anterior no repositório (**produção, hoje**: nada foi promovido) | Settings → Pages → menu "…" ao lado da URL do site → **Unpublish site**; a URL responde 404 do GitHub. Ensaiado em staging em 2026-10-21 |
| **B — reexecutar a última execução verde anterior** | existe uma execução verde do commit anterior (**staging, hoje**: 41076989728, `652bbaa`, serve `<hash-anterior>`) | Actions → workflow `pages` → essa execução → **Re-run all jobs**; o workflow reconstrói esse commit (`npm ci`, `npm test`, build) e publica (em produção, pede a aprovação do revisor). Em staging, **conferir antes a política de ramos do ambiente** se o site tiver sido despublicado entretanto. A página volta ao acerto v6 com a dica, o guia e o botão "Drift" (a tecla já não tinha efeito). Ensaiado neste site em 2026-10-27 com o par 39631099098 ↔ 40566728590: ≈ 1 min 17 s do comando à página servida; restauração ≈ 2 min 12 s |
| **C — reverter e reconstruir** (DM-0001, *Plano de migração*) | quando B não existe ou a execução anterior já não pode ser reexecutada (retenção de 90 dias) | `git revert` dos commits de código desta feature, na ordem inversa (`f6e2d16`, depois `cfad3dc`, e os anteriores da cadeia se preciso) `&& git push origin master`; a execução nova roda `npm test` e o build na árvore revertida e pede aprovação |

## Preconditions

- [x] **Commit verificado existe**: `6b314b2193c25cd6384a3f64cffdc369637b3753` (`master`), a árvore que o veredito de testes e a
      execução de staging verificaram. Quem executa confere: `git log --oneline -5` mostra `6b314b2` (ou só commits de registro
      acima dele, como `483c5fa`) e `git status` não acusa modificação em `src/`, `scripts/`, `tests/`, `index.html`,
      `docs/physics.md` nem no lockfile. O que se publica é o commit, não a árvore de trabalho.
- [x] Veredito de testes `SUCCESS` no seed rev 6: `500 Tests/Output/dirigibilidade/reports/test-validation/test-validation-20261030-1638.md`
      (65 verificações desta feature aprovadas); suíte inteira em `<sha>`: 443/443 (execução 41101055606 e local).
- [ ] Validação de staging `SUCCESS` para `<sha>`: relatório em `600 Deploy/Output/dirigibilidade/reports/deploy-validation/` —
      **aguarda o validador** sobre esta versão do registro (a de 2026-10-27 valida `b86b200`).
- [x] Histórico de migração: **não se aplica** — não há banco; o acerto versionado e os leitores de registro viajam no bundle
      (`REL-0002`).
- [x] Feature flag: **não há** (DES-0007, DES-0009, ADR-0001, ADR-0006); a feature fica ativa ao servir o `index.html` novo.
- [x] **Repositórios e ambientes configurados** (2026-10-21): produção com *Source* = GitHub Actions, revisor obrigatório
      `edumatosr6-svg` e política de ramos restrita a `master`; staging com *Source* = GitHub Actions, sem revisor e política
      de ramos **sem restrição** — a reconferir depois de qualquer despublicação. Nenhuma credencial configurada: o Pages usa o
      token OIDC da execução (D-DP-05).
- [x] **Execução verde do workflow `pages` em staging para `<sha>`**: 41101055606; a URL de staging serve `index-BwruE9Pq.js`
      desde 2026-10-30 17:48:06 GMT (200 em HTTPS; `check_served` 22/22). Em produção, **nenhuma execução verde** e nada
      aprovado.
- [x] **Reversão ensaiada em staging**: caminho B em 2026-10-27 (`reports/deploy-validation/deploy-validation-20261027-1931.md`,
      reexecução e restauração medidas); caminho A em 2026-10-21 (`docs/lap-validation-device-log.md`, *Ensaio de reversão R4*).
      O procedimento e o site são os mesmos; o par desta release (41076989728 ↔ 41101055606) não foi reexecutado.
- [ ] **`docs/handling-device-log.md` criado e com as linhas H1–H5 registradas em staging, nos aparelhos nomeados** (12
      critérios `unverified` no veredito de testes dependem disso: AC-US-0003-09, -11, -12, -13, -14, -15, AC-US-0004-06,
      AC-US-0005-05, AC-US-0005-07, NFR-0002, NFR-0003, NFR-0004). O arquivo **ainda não existe** (DIV-DP-01). A H1 é a rodada
      de teste do dono do produto que o domínio mantém como critério final (`DOMAIN.md`, 2026-10-21).
- [ ] **Decisão Esri registrada** em `200 Requirements/220 Input/pista-kart-park/DOMAIN.md` e a entrega de `pista-kart-park` que
      a aplica — sem ela nenhum commit que contenha esta release vai a produção (*Decisão de promoção*).
- [x] Monitoramento decidido: **vigilância manual conforme este runbook**, nenhum monitor externo nem telemetria (decisão de
      2026-10-21, mantida; `REL-0005`). A verificação HTTPS manual é *Verify* 1 e 8.
- [x] Node na versão fixada: `.nvmrc` = `24` na raiz (o workflow lê `node-version-file`).

## Promote

| # | Passo | Esperado | Leva | Desfaz-se por |
|---|---|---|---|---|
| 1 | conferir o commit: `git log --oneline -5`; `git status` | `6b314b2` é a ponta ou só commits de registro estão acima; nenhuma modificação local em `src/`, `scripts/`, `tests/`, `index.html`, `docs/physics.md`, lockfile | 1 min | nada a desfazer: leitura local |
| 2 | `npm ci` | saída 0; `package-lock.json` inalterado | 1 a 2 min | nada externo: só recria `node_modules/` |
| 3 | `npm test` | saída 0; `443` aprovados, 0 reprovados, 0 pulados | 1 min | nada a desfazer |
| 4 | `npm run build` | saída 0; `dist/assets/index-<hash>.js` com `<hash>` = `BwruE9Pq` (se a árvore for a de `<sha>`); a conferência local; o artefato publicado é o do workflow | 1 min | nada externo: apagar `dist/` local |
| 5 | `python -I "600 Deploy/Output/race-lap-validation/tools/measure_dist.py" dist` e `python -I "600 Deploy/Output/dirigibilidade/tools/check_bundle.py" dist docs/physics.md` | `within_limit=True` (≈ 711 513 bytes com o `index.html` CRLF do Windows; 711 477 no workflow; RNF02); `checks=25 failed=0` | 10 s | nada a desfazer: leitura |
| 6 | registrar o alvo de reversão em `docs/handling-device-log.md`: staging → execução 41076989728 (`652bbaa`, `<hash-anterior>` `dD_vz2Ev`), caminho B; produção → "nada publicado; reversão pelo caminho A (Unpublish site)" | nota registrada com os números lidos na aba Actions de cada repositório | 2 min | nada a desfazer: anotação |
| 7 | publicar em **staging**: `git push staging master:staging` (**feito em 2026-10-30**, execução 41101055606) e acompanhar a execução `pages` desse commit; depois `check_served https://edumatosr6-svg.github.io/kartle-staging/ index-<hash>.js`. Se o `deploy` falhar **sem executar nenhum passo**, liberar a política de ramos do ambiente e *Re-run all jobs* | execução verde (`npm test` 443 aprovados; `Measure dist` `within_limit=True`; `deploy` concluído); `check_served` `checks=22 failed=0` (**hoje: 200, `index-BwruE9Pq.js`, 22/22**) | 5 min (execução; a de hoje levou 4 min 49 s) + até 10 min de cache | R1/R2 sobre `kartle-staging` (caminho B: 41076989728; ou A) |
| 8 | executar `smoke.md` em staging (D1–D13, M1–M9; D14 e M10 não são executáveis neste bundle, DIV-DP-13) **e as linhas humanas H1–H5 abaixo**, e registrar em `docs/handling-device-log.md` | todas as linhas dentro do limiar; D7/H3 sem efeito da tecla de drift; D4/M4/M7 sem drift em tela alguma; D8 sem a versão do acerto no resultado; D9 com `—` ao trocar de acerto; D13/H2 com o grampo feito | 60 a 120 min | nada a desfazer: observação; o registro fica como histórico |
| 9 | **decisão do dono do produto** (D-DP-06) entre as opções de *Decisão de promoção* abaixo; registrar no relatório de validação e em `DOMAIN.md` | decisão explícita registrada; sem decisão Esri, a única forma de esta release ir a produção é esperar (opção 1) | até a decisão Esri; sem resposta, vale "não promover" | nada a desfazer |
| 10 | **só depois da decisão Esri e da entrega de `pista-kart-park` que a aplica**: `git push origin master`; em `https://github.com/edumatosr6-svg/kartle/actions`, abrir a execução **mais recente** cujo `build` esteja verde, conferir que o commit é `<sha>` ou um descendente que só acrescente registros ou a entrega Esri, e que o passo *Build* imprime `index-<hash>.js`; **Review deployments** → marcar `github-pages` → **Approve and deploy**. Nunca aprovar uma execução anterior em espera (a 39827702391, `05c3570`, estava `pending` em 2026-10-27) | `build` verde com `npm test` todo aprovado e `Measure dist` `within_limit=True`; após a aprovação, `deploy` verde com a URL `https://edumatosr6-svg.github.io/kartle/` | 3 a 5 min de execução + o tempo até o clique | R1 (caminho A em produção); antes do clique, **Reject** deixa tudo como está |
| 11 | propagação do cache: sem purga no Pages (`max-age=600`); esperar até 10 min e `check_served https://edumatosr6-svg.github.io/kartle/ index-<hash>.js` em janela anônima | `checks=22 failed=0`; o `index.html` servido referencia `/kartle/assets/index-<hash>.js`; JS e CSS com 200 | até 10 min | R2 |

## Decisão de promoção — a árvore contém a Kart Park

Todo commit de `master` a partir de `ba221ad` contém a Kart Park; enquanto a decisão Esri não existir, nenhum artefato
construído de um desses commits vai a produção (`pista-kart-park`, ADR-0005; a evidência e os desfechos estão no `runbook.md`
daquela feature, *Promoção bloqueada*). As opções; **a escolha é do dono do produto**:

| Opção | O que se faz | O que vale para esta release |
|---|---|---|
| **1 — esperar a decisão Esri** e promover tudo junto | nenhum push a `origin` até a decisão; depois, passos 10 e 11 com um commit igual ou posterior a `<sha>` | é a **única** que leva o acerto C sem drift a produção; até lá produção continua sem nada publicado |
| **2 — publicar `6ea3862` antes de qualquer push de `master`** | `git push origin 6ea3862:master` (avanço rápido de `05c3570`, **sem** `--force`), pelo runbook de `modelo-kart-01`/`pista-kart-park` | **não** entrega esta release: `6ea3862` tem o acerto **v5** e o **drift e o turbo** no passo e nas telas — a versão que o dono do produto rejeitou em 2026-10-29. `check_served` desta release reprova esse bundle (v6 corrente, v5 ausente, linhas de drift) |

**Não existe commit com o acerto C e sem a Kart Park.** O último commit de `master` sem a Kart Park é `71f604e` (só registro
sobre `6ea3862`); o v6 entra em `cfad3dc` e o drift sai das telas em `f6e2d16`, ambos depois de `ba221ad`, e escritos sobre o
treino de voltas seguidas e a sessão de treino das outras features — não se separam por *cherry-pick*. Produzir um commit assim
é trabalho novo (ramo a partir de `6ea3862`, rodada de código e de testes, execução de staging própria e nova rodada deste
estágio) e é decisão do dono do produto; este runbook não o executa.

## Verify

Na entrega que promover; em staging, as mesmas linhas valem como parte do passo 8.

| # | Verificação (`smoke.md`, *Verificação em produção*) | Esperado |
|---|---|---|
| 1 | D1 / M1 HTTPS em `https://edumatosr6-svg.github.io/kartle/` — **verificação manual** (+ `check_served`), a única vigilância de disponibilidade | cadeado válido; 0 recursos inseguros; `index.html` e *assets* com 200; `<hash>` esperado; inclinação ativa no celular (RNF06) |
| 2 | D2 / M2 carregamento em 4G, cache vazio | kart responde em menos de 10 s (RNF01) |
| 3 | D3 / M3 bytes transferidos na primeira visita | abaixo de 3 145 728 bytes (RNF02); esperado da ordem de 189 KB comprimidos |
| 4 | D4 / M4 acerto padrão e tela inicial | `ARCADE ASSISTIDO · TREINO LIVRE`; `arcade` selecionado; dica `Dirigir`; nenhum drift ou turbo em tela (NFR-0009; AC-US-0003-12..14) |
| 5 | D5 / M5 console | 0 erros ao carregar e numa volta |
| 6 | D6, D7, D8, D13 / M6, M7 volta de treino inteira | HUD com valor durante a volta; Espaço sem efeito; velocidade estabilizada 65–72 km/h; resultado sem a versão do acerto; grampo feito; toque só com ←, →, Freio e Acelerar |
| 7 | D10 acerto servido | `check_served` com v6 corrente, v4 anterior, v5 ausente |
| 8 | repetir 1, 4, 5 e 6 depois de 24 h (vigilância manual; nenhum monitor externo) | mesmos resultados; a execução aprovada continua a última em `https://github.com/edumatosr6-svg/kartle/actions` e Settings → Pages mostra o site ativo com essa implantação |

**Gatilhos de reversão (D-DP-03):** carregamento de 10 s ou mais em 4G; transferência de 3 145 728 bytes ou mais; JS servido
sem o v6 como corrente; segurar Espaço muda a pilotagem ou a velocidade máxima; qualquer texto, ícone, guia ou botão de drift
ou turbo em tela; o kart não faz o grampo com esterço cheio aliviando o acelerador; um melhor tempo ou diferença exibida entre
acertos ou versões diferentes; HUD sem valor em algum quadro da volta; erro no console ao carregar ou durante a volta (inclusive
404 de um *asset* em `/kartle/assets/`); qualquer recurso servido sem HTTPS; fps abaixo de 60 no notebook ou de 30 no celular
de referência (RNF03); `STEP_COST` acima de 1,10 × a linha de base na máquina de referência (NFR-0002).

## Linhas humanas — o smoke de aparelho que o dono do produto executa (H1–H5)

As linhas que só a tela, o sensor, o aparelho, o relógio de parede ou o julgamento do dono do produto decidem
(`500 Tests/Output/dirigibilidade/98-divergences.md`, 12 critérios `unverified`; `test-strategy.md` E2E-01 a E2E-04; a rodada de teste do dono do produto do `DOMAIN.md`).
Executadas sobre a URL de **staging** (execução 41101055606, `index-BwruE9Pq.js`), no notebook e no celular de referência
nomeados, com a página em primeiro plano, e registradas em `docs/handling-device-log.md` (aparelho, navegador, versão, medida,
data) — a "execução 1" desse log. Nenhuma pode ser feita por um loop nem sob automação do navegador.

| # | Linha | O que se faz | O que se registra | Critério | Roteiro |
|---|---|---|---|---|---|
| H1 | sensação do acerto C | o dono do produto pilota o Arcade (v6) em voltas de treino seguidas, no notebook (teclado) e no celular (inclinação, com esterço parcial nas curvas e acelerador cheio), na Kart Park e na sintética | veredito do dono do produto sobre resposta do volante, aderência em curva, aceleração e sensação de velocidade ("o kart vira quando eu mando"), em texto; no celular, o texto de aderência nas curvas com esterço parcial | critério final do domínio (rodada de teste do dono do produto, `DOMAIN.md` 2026-10-21); US-1, US-4; NFR-0003: 0 "Saindo de traseira"/"Derrapando" com esterço parcial | E2E-03 |
| H2 | raio nos grampos | nos grampos da Kart Park (raio de ≈ 6 m) e na curva mais fechada da sintética: (a) esterço cheio aliviando o acelerador; (b) esterço cheio com acelerador cheio a partir de ≈ 50 km/h | (a) se o kart contorna sem sair do asfalto; (b) se perde velocidade na curva em vez de abrir a trajetória; número de tentativas e saídas para a grama | US-2: ≥ 180° em 2 s sem acelerador (bench: 208,4°); raio ≤ 13 m com acelerador e esterço cheios (bench: 11,67 m a 50 km/h, 11,77 m a 70 km/h) — a tela confirma o que o bench mede | — |
| H3 | tecla de drift sem efeito e nenhuma tela de drift | no notebook, segurar Espaço em retas e curvas durante uma volta inteira, gravando a tela; com o navegador em português e depois em inglês, registrar a tela inicial antes e depois de uma volta e a barra de ferramentas; no celular, uma volta com a inclinação ativa e outra com a permissão negada (recuo para toque), registrando o controle de toque na contagem e na volta | 0 medidores, rótulos "TURBO"/"CARREGANDO DRIFT", pontos de estilo, combo, prêmio ou brilho de turbo em quadro algum; pilotagem igual com e sem Espaço; dica `Dirigir`; sem guia de manobras; toque só com ←, →, Freio e Acelerar; "encerrar treino" presente na barra durante o treino | US-3; AC-US-0003-09, -12, -13, -14, -15 (nos dois canais e nos dois idiomas) | E2E-01 (Espaço), E2E-04 |
| H4 | HUD por quadro e resultado | iniciar uma volta com o Arcade; **gravar a tela** do sinal verde ao fim, passando pela grama e encostando numa parede; pausar (Esc e troca de aba no notebook; cobrir o sensor no celular) e retomar; ler o resultado da volta; encerrar o treino, trocar para Realista (melhor tempo `—`), uma volta (só o tempo dessa volta), voltar ao Arcade (`—` de novo) | na gravação, `#speed` (km/h) e `#handling` (texto) com valor em todos os quadros; na pausa, o último valor mantido; resultado com validade, total e setores, **sem** a versão do acerto e sem drift ou turbo; `—` nas duas trocas; desktop **e** celular | AC-US-0004-06: 0 quadros sem valor; 0 ms de avanço na pausa; AC-US-0005-05 / RULE-0003: 0 comparações fora de `COMPARABLE`, resultado sem versão do acerto. AC-US-0003-11 e AC-US-0005-07 (texto compartilhado) não têm metade humana executável neste bundle (DIV-DP-13) | E2E-01, E2E-02 |
| H5 | taxa de quadros e custo por passo | uma volta completa com o contador de fps do navegador (F12 → Rendering → Frame Rendering Stats no notebook; ferramenta remota no celular); na **máquina de referência** (o `runtimeId` da linha de base em `docs/physics.md`), `npm run bench:handling`; ler a seção datada do v6 em `docs/physics.md` | fps médio e mínimo, por aparelho; registro `STEP_COST`: média em µs, linha de base, razão, veredito (última medida: 181,3 µs contra 173,9 µs, 1,04 ×, `PASS`, 2026-10-30); se a seção nomeia ambiente, parâmetros, resultado e data | RNF03: 60 fps no notebook, 30 fps no celular (uma medida em desktop não vale para o celular, I9); NFR-0002: razão ≤ 1,10 com `baselineAvailable` verdadeiro; NFR-0004: seção datada completa | D12 / M9; `bench:handling` |

Resultado esperado do conjunto: 5 linhas `PASS` registradas; a partir daí os critérios `unverified` do veredito de testes ficam
verificados na sua metade humana (salvo AC-US-0003-11 e AC-US-0005-07, DIV-DP-13), e a precondição correspondente fecha. Uma
linha reprovada é `FAIL CODE` (defeito de aplicação), nunca de empacotamento: o bundle é o mesmo que passou nas 443
verificações. Um "não" do dono do produto na H1 é uma nova revisão do seed, não uma falha deste estágio.

## Roll back

| # | Passo (desfaz o passo de *Promote* indicado) | Esperado | Leva |
|---|---|---|---|
| R1 | desfaz 10 (ou 7, em staging), pelo caminho que o passo 6 registrou. **Produção — caminho A**: `https://github.com/edumatosr6-svg/kartle` → Settings → Pages → menu "…" → **Unpublish site** → confirmar. **Staging — caminho B**: Actions → `pages` → execução 41076989728 → **Re-run all jobs** (conferir a política de ramos do ambiente se o site tiver sido despublicado); serve `index-dD_vz2Ev.js`. **Caminho C** quando B não existir: `git revert` da cadeia de código desta feature, `npm test` local, `git push`, aprovar o `deploy` | **A**: a URL responde 404 do GitHub em até 10 min; Settings → Pages sem site publicado. **B**: a URL serve o `index.html` que referencia `assets/index-dD_vz2Ev.js`; o acerto v6 com a dica, o guia e o botão "Drift" de volta às telas. **C**: execução nova com `npm test` verde na árvore revertida | A: 1 min + até 10 min de cache (ensaiado: 404 em ≈ 1 min no navegador, 200 em cache de borda por > 6 min). B: ≈ 1,5 min do comando à página (ensaiado em 2026-10-27; + aprovação em produção) + até 10 min de cache. C: 10 min + 3 a 5 min + aprovação + cache |
| R2 | propagação do cache (desfaz 11): sem purga; esperar até 10 min e `check_served <URL>` em janela anônima. **Para voltar a publicar depois do caminho A**: reativar o Pages (Settings → Pages → *Source* = GitHub Actions), **conferir a política de ramos do ambiente** e *Re-run all jobs* da execução verde. **Para restaurar esta release depois do caminho B**: *Re-run all jobs* da 41101055606 | **A**: busca nova devolve 404; na republicação, 200 com o `<hash>` da execução reexecutada. **B**: `check_served` desta release reprova nas linhas de drift (é o esperado: o bundle anterior tem drift nas telas); depois da restauração, `checks=22 failed=0` com `BwruE9Pq` | até 10 min (restauração pelo caminho B: ≈ 2,5 min no ensaio; republicação pelo caminho A: ≈ 7,5 min) |
| R3 | executar *Verify* 1, 2 e 4 na versão restaurada (**B/C**); no caminho **A**, confirmar que a URL responde 404 nos 4 navegadores de referência | **B/C**: HTTPS válido; carregamento abaixo de 10 s; a tela anterior funciona. **A**: nenhuma página servida | 10 min |
| R4 | registrar a reversão: hash revertido, alvo restaurado (A: "não publicado"; B/C: hash restaurado e número da execução), gatilho observado, horário | linha em `docs/handling-device-log.md` e relatório em `reports/deploy-validation/` | 5 min |
| R5 | se a causa for da aplicação (acerto, curva, tecla de drift, drift em tela, HUD, comparabilidade, fps, custo por passo), abrir `FAIL CODE` para o estágio de código; se for do empacotamento (base `/kartle/`, cache, HTTPS, Pages, política de ramos), `FAIL` deste estágio | relatório com a classificação | 15 min, no mesmo dia |

Staging reverte-se do mesmo modo (R1 e R2 sobre `edumatosr6-svg/kartle-staging`; lá o `deploy` não pede aprovação) e nunca é
precondição para reverter produção.

Dados: nada a desfazer. A feature não grava no navegador e não há servidor (DM-0001, DES-0008, `REL-0002`); um jogador com a
página nova em cache continua a jogá-la por até 10 min; depois busca o `index.html` restaurado (ou o 404 do caminho A).

**Point of no return:** não existe nesta release. Em produção a reversão é despublicar (caminho A), sempre possível; em staging
a execução verde anterior é reexecutável enquanto o Actions a retiver (90 dias) e, passado isso, o caminho C reconstrói de um
commit — o repositório é o artefato de reversão. O único ato que tornaria a reversão impossível seria **apagar o histórico do
repositório** (`push --force` sobre `master`), que nenhum passo deste runbook faz. Uma `setupVersion` publicada nunca é editada
no lugar (ADR-0001): se o v6 precisar de correção, a correção é um v7 — a forma da próxima release, não um ponto sem retorno.
