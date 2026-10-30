---
title: Runbook — promover, verificar e reverter a release de validação de volta
feature: race-lap-validation
stage: deploy
status: validated
version: 1.2.0
sources: [DM-0001, DM-0002, DES-0001, DES-0009, DES-0010, DES-0011, ADR-0006, NFR-0003, NFR-0004, TEST-0009, TEST-0015]
---

# Runbook

Para quem não escreveu a release. Executar da raiz do repositório, com todo caminho entre aspas. Nenhum passo é
executado por um loop: cada um é de um humano, e a promoção a produção é sempre do dono do produto (D-DP-06). O
provedor é o **GitHub Pages** (D23): o pipeline é `.github/workflows/pages.yml`, a publicação é um push e a promoção
é um clique de aprovação no ambiente `github-pages` do repositório de produção. Nomes usados abaixo:

| Nome | Valor (não é segredo) |
|---|---|
| dono do produto | conta GitHub `edumatosr6-svg` (revisor obrigatório do ambiente `github-pages` de produção) |
| repositório de **produção** | `edumatosr6-svg/kartle` — remoto local `origin`, ramo `master`, site `https://edumatosr6-svg.github.io/kartle/`; execuções em `https://github.com/edumatosr6-svg/kartle/actions` |
| repositório de **staging** | `edumatosr6-svg/kartle-staging` — remoto local `staging`, ramo `staging`, site `https://edumatosr6-svg.github.io/kartle-staging/`; execuções em `https://github.com/edumatosr6-svg/kartle-staging/actions` |
| `<sha>` | o commit construído e publicado em staging nesta rodada: `6b314b2193c25cd6384a3f64cffdc369637b3753` (`6b314b2`). Contém `0c83ed9` (código desta rodada validado) e `8811414` (testes revalidados, 179 checks), com a mesma árvore de `src/lap.ts`, `src/lapMessages.ts`, `src/lapTiming.ts`, `src/frameClock.ts`, `src/trackData.ts` e `tests/race-lap-validation-*` (`01-release.md`, *Proveniência*) |
| `<hash>` | o hash de conteúdo do JS (`assets/index-<hash>.js`), impresso no passo *Build* da execução; em staging, execução 41101055606: `BwruE9Pq` |
| execução de staging em vigor | **41101055606** (`6b314b2`, success) |
| execução de staging anterior | **41076989728** (`652bbaa`, success) — alvo do caminho B em staging; serve a primeira release desta feature (treino de uma volta) |
| "execução verde" | uma execução do workflow `pages` com `build` e `deploy` concluídos com sucesso |

Os números das execuções desta rodada vêm do condutor do loop e são confirmados pelo validador na aba Actions; cada push
posterior cria uma execução nova e, pelo grupo de concorrência `pages`, cancela a de produção que ainda esperava —
**as execuções em vigor são sempre as que a aba Actions mostra**.

Artefato: `dist/` (HTML, JS e CSS estáticos), construído **pelo workflow** a partir de `<sha>`. Não há banco, migração
de dado nem aplicativo nativo. A página oferece só o **treino** (DES-0009), agora como sequência de voltas (ADR-0006).

**Alvo de reversão.** Cada passo de *Roll back* nomeia o caminho:

| Caminho | Quando se aplica | O que R1 faz |
|---|---|---|
| **A — despublicar** | nenhuma execução verde anterior no repositório: **produção hoje** (nunca serviu um `dist/`) | Settings → Pages → menu "…" → **Unpublish site**; a URL responde 404 do GitHub |
| **B — reexecutar a última execução verde anterior** | existe execução verde do commit anterior: **staging hoje** (41076989728, `652bbaa`) | Actions → workflow `pages` → a execução anterior → **Re-run all jobs**; o workflow reconstrói esse commit do lockfile; em produção, aprovar |
| **C — reverter e reconstruir** (DM-0001) | B não existe ou a execução já não é reexecutável (retenção de 90 dias) | `git revert` dos commits da rodada (`0c83ed9`, `8811414`) e push; a execução nova roda `npm test` e o build na árvore revertida |

## Preconditions

- [x] **Commit construído nomeado e contenção demonstrada**: `<sha>` = `6b314b2`; `git log --oneline -12` mostra, do mais
      novo ao mais antigo, `6b314b2`, `1254443`, `aeaf504`, `c387839`, `f6e2d16`, `8811414`, …, `0c83ed9`; e
      `git diff --stat 8811414 6b314b2 -- src/lap.ts src/lapMessages.ts src/lapTiming.ts src/frameClock.ts src/trackData.ts tests/race-lap-validation-*`
      não imprime nada (os commits posteriores, de outras features, não tocam os módulos nem os testes desta).
- [x] Veredito de testes `SUCCESS`, seed rev 3: `500 Tests/Output/race-lap-validation/reports/test-validation/test-validation-20261030-1559.md`
      (179 de 179 nesta feature); validação de código `SUCCESS`: `400 Code/Output/race-lap-validation/reports/code-validation/code-validation-20261030-1526.md`.
- [x] **Staging publicado com `<sha>`**: execução 41101055606 success; a URL serve `assets/index-BwruE9Pq.js`
      (`Last-Modified` 2026-10-30 17:48:06 GMT); `tools/check_served.py` → `checks=53 failed=0` (`01-release.md`).
- [ ] Validação de staging `SUCCESS` desta rodada em `600 Deploy/Output/race-lap-validation/reports/deploy-validation/`
      — aguarda o validador. O mais novo, `deploy-validation-20261021-1643.md` (primeira release), é `FAIL` só pelas linhas
      humanas (ISSUE-03).
- [x] Histórico de migração: **não se aplica** — não há banco; a sessão de treino vive em memória (`REL-0002`).
- [x] Feature flag: **não há** (DES-0007; ADR-0006 não acrescenta); a mudança fica ativa ao servir o `index.html` novo.
- [x] Repositórios e ambientes (desde 2026-10-21): produção com *Source* = GitHub Actions, revisor obrigatório
      `edumatosr6-svg` e política de ramos restrita a `master` (segunda tranca); staging com *Source* = GitHub Actions, sem
      revisor, política de ramos **No restriction** — que **volta a ser restrita depois de cada despublicação** e tem de ser
      liberada de novo antes de um *Re-run all jobs* (ensaiado em 2026-10-21; `REL-0003`, `REL-0005`).
- [x] Reversão ensaiada em staging pelo caminho A (2026-10-21, *Ensaio de reversão R4* do log) e o procedimento do caminho
      B ensaiado no mesmo site (registro de `pista-kart-park`, 2026-10-27). O alvo B desta rodada é 41076989728.
- [ ] **Execução 3** do log de aparelho (`docs/lap-validation-device-log.md`): as linhas H1–H6 abaixo, sobre a URL de staging,
      nos aparelhos nomeados (39 critérios `unverified` no veredito de testes dependem dela; DIV-DP-06, DIV-DP-07).
- [ ] **Escolha do dono do produto entre as opções de produção** (seção *Produção*, abaixo), registrada em `DOMAIN.md`:
      `master` contém a Kart Park, bloqueada pela decisão Esri (DIV-DP-15).
- [x] Crédito OSM/ODbL: exigido a partir da Kart Park e verificado pela release `pista-kart-park`; aqui D14/M12.
- [x] Monitoramento: vigilância manual conforme este runbook, nenhum monitor externo (`DOMAIN.md`, 2026-10-21; DIV-DP-08).
- [x] Node na versão fixada: `.nvmrc` = `24`.

## Promote

| # | Passo | Esperado | Leva | Desfaz-se por |
|---|---|---|---|---|
| 1 | conferir os commits (precondição 1) | `<sha>` e `0c83ed9`/`8811414` no histórico; o `git diff --stat` dos módulos e testes desta feature sem saída; `git status` limpo nos arquivos da release | 1 min | nada a desfazer: leitura local |
| 2 | `npm ci` | saída 0; `package-lock.json` inalterado | 1 a 2 min | nada externo: só recria `node_modules/` |
| 3 | `npm test` | saída 0; 443 aprovados em `6b314b2`, 179 deles `CHK-TEST-*` desta feature | 1 a 2 min | nada a desfazer |
| 4 | `npm run build` | saída 0; `dist/` com um JS e um CSS; anotar o `<hash>` local (esperado `BwruE9Pq`, o mesmo de staging) | 1 min | apagar `dist/` local, se se quiser |
| 5 | `python -I "600 Deploy/Output/race-lap-validation/tools/measure_dist.py" dist` | `within_limit=True`; total da ordem de 711 KB (RNF02) | 10 s | nada a desfazer |
| 6 | registrar o alvo de reversão em `docs/lap-validation-device-log.md`: **staging** → 41076989728 (`652bbaa`), caminho B; **produção** → a última execução verde em `https://github.com/edumatosr6-svg/kartle/actions`, ou "nenhuma; caminho A (Unpublish site)" | nota registrada; a execução anterior ainda reexecutável | 2 min | nada a desfazer: anotação |
| 7 | publicar em **staging**: `git push staging master:staging` e acompanhar a execução em `kartle-staging/actions`. **Feito**: execução 41101055606 (`6b314b2`) success. Se o `deploy` falhar sem executar passos, liberar a política de ramos do ambiente e *Re-run all jobs* | execução verde; a URL serve `index-<hash>.js` com o `<hash>` do passo *Build*; `python -I "600 Deploy/Output/race-lap-validation/tools/check_served.py" https://edumatosr6-svg.github.io/kartle-staging/ index-<hash>.js` → `checks=53 failed=0` | 3 a 5 min + até 10 min de cache | R1 caminho B em staging (41076989728) |
| 8 | executar `smoke.md` e as linhas humanas H1–H6 em staging; registrar como **execução 3** | todas as linhas dentro do limiar | 90 a 120 min | nada a desfazer: observação |
| 9 | **pergunta ao dono do produto**: promover? — só depois de 8 **e** da escolha da seção *Produção* (D-DP-06) | resposta explícita registrada; "não" encerra sem efeito | até 1 dia útil; silêncio vale "não" | nada a desfazer |
| 10 | publicar em **produção** pelo caminho escolhido na seção *Produção*: o push correspondente a `origin` (nunca `--force`); a execução constrói e **para em `deploy`**; o dono do produto abre a execução → **Review deployments** → `github-pages` → **Approve and deploy** — só para a execução do commit escolhido | `build` verde (`npm test`, `Measure dist` `within_limit=True`); depois da aprovação, `deploy` verde; `check_served.py https://edumatosr6-svg.github.io/kartle/ index-<hash>.js` com 0 reprovações | 3 a 5 min + o tempo até o clique | antes do clique, **Reject** (nada publicado); depois, R1 |
| 11 | propagação do cache: o Pages não tem purga (`max-age=600`); esperar até 10 min e buscar em janela anônima | a busca nova devolve o `index.html` da execução aprovada; JS e CSS respondem 200 | até 10 min | R2 |

## Produção — as opções enquanto a decisão Esri não existe

Todo commit de `master` a partir de `ba221ad` contém a Kart Park, cuja promoção espera a decisão Esri do dono do produto
(`runbook.md` de `pista-kart-park`, *Promoção bloqueada*; ADR-0005 daquela feature). Esta rodada (`0c83ed9`) está depois
dela e foi escrita sobre ela: **não existe build do treino contínuo sem a Kart Park**. As opções, nenhuma tomada por um
loop; a escolha vai para `DOMAIN.md` e para o relatório de validação:

| Opção | O que se faz | O que leva a produção | O que custa | O que exige |
|---|---|---|---|---|
| **1 — esperar a decisão Esri** | nenhum push de `master` a `origin` até a decisão; depois, a entrega que a cumprir (crédito Esri, registro `PRODUCTION`, nova rodada deste estágio) leva as quatro features | esta rodada inteira, com `dirigibilidade`, `modelo-kart-01` e a Kart Park | produção continua sem página até lá | a decisão Esri; a execução 3 desta release e as linhas humanas das outras |
| **2 — publicar `6ea3862` antes** | `git push origin 6ea3862:master` (avanço rápido a partir de `origin/master`, **sem** `--force`; conferir antes que `origin/master` é ancestral de `6ea3862`) e aprovar só a execução desse commit (opção 2 do runbook de `pista-kart-park`) | a **primeira** release desta feature (seed rev 2: treino de **uma** volta, resultado na tela de resultado), `dirigibilidade` e `modelo-kart-01` até `6ea3862`; **não** esta rodada | o treino contínuo fica só em staging até a opção 1; a verificação humana da primeira release tem de ser feita sobre esse bundle (reexecutar a execução verde de `6ea3862` em staging, ou aceitar a execução 3 sobre `6b314b2` como evidência, decisão do dono do produto); nenhuma execução posterior de `master` pode ser aprovada em produção | nenhuma decisão Esri |
| **3 — portar o treino contínuo para um ramo sem a Kart Park** | ramo a partir de `6ea3862` com ADR-0006 reimplementado sobre o `src/lap.ts` anterior à Kart Park | esta funcionalidade, sem a Kart Park | **não é promoção deste build**: código, testes e deploy novos, com veredito próprio (os dois módulos divergem); dois ramos a manter até a decisão | a decisão de abrir esse trabalho no pipeline |

Nenhuma opção toca staging. A opção 2 e a 3 não adiantam a decisão Esri.

## Verify

| # | Verificação (`smoke.md`, *Verificação em produção*) | Esperado |
|---|---|---|
| 1 | D1 / M1 HTTPS na URL de produção — verificação manual, a única vigilância de disponibilidade (`REL-0005`) | cadeado válido; 0 recursos inseguros; `index.html` e *assets* com 200; inclinação ativa no celular |
| 2 | `check_served.py https://edumatosr6-svg.github.io/kartle/ index-<hash>.js` (na opção 2, o `<hash>` da execução de `6ea3862` e a ferramenta da release daquele commit) | 0 reprovações |
| 3 | D2 / M2 carregamento em 4G, cache vazio | menos de 10 s (RNF01) |
| 4 | D3 / M3 bytes transferidos | abaixo de 3 145 728 bytes (RNF02) |
| 5 | D4 / M4 oferta | exatamente um botão, "treino"; nenhuma opção oficial (NFR-0012; DES-0009) |
| 6 | D5, D6, D15, D16 / M5, M6, M13, M14 treino de voltas seguidas | uma contagem; painel a cada chegada sem parar o kart; melhor volta válida; "encerrar treino" em corrida e em pausa |
| 7 | D14 / M12 crédito OSM e ODbL (quando a entrega contiver a Kart Park) | crédito e aviso visíveis no seletor e no resultado |
| 8 | repetir 1 a 5 depois de 24 h | mesmos resultados; a execução aprovada continua a última na aba Actions |

**Gatilhos de reversão (D-DP-03):** carregamento de 10 s ou mais em 4G; transferência de 3 145 728 bytes ou mais;
`#lap-offer` sem o botão "treino"; erro no console ao carregar (inclusive 404 de um *asset*); painel do treino não exibido
numa chegada; o kart parado ou uma contagem nova numa chegada do treino; "encerrar treino" ausente durante o treino;
qualquer recurso sem HTTPS; fps abaixo de 60 no notebook ou de 30 no celular de referência (NFR-0003).

## Linhas humanas — o roteiro da execução 3 (H1–H6)

As linhas que só a tela, o sensor, o aparelho ou o relógio de parede decidem: as que a primeira release deixou abertas
(ISSUE-03 de `deploy-validation-20261021-1643.md`) e as de **E2E-12/E2E-13** desta rodada (12 critérios de US-0010
`unverified`). Executadas sobre a URL de **staging**, no notebook e no celular de referência nomeados, com a página em
primeiro plano, e registradas como **execução 3** em `docs/lap-validation-device-log.md` (aparelho, navegador, versão,
medida, data). Nenhuma pode ser feita por um loop nem sob automação do navegador (o ritmo sob automação é inválido:
`requestAnimationFrame` a 1–2 quadros/s, três tentativas de 2026-10-21).

| # | Linha | O que se faz | O que se registra | Critério | Roteiro / smoke |
|---|---|---|---|---|---|
| H1 | carregamento e ritmo no notebook | cache vazio e rede limitada a 4G: cronometrar até o kart responder; escolher "treino" e cronometrar a contagem; um treino de duas voltas com o contador de fps (F12 → Rendering → Frame Rendering Stats) | tempo de carga; duração da contagem; fps médio e mínimo, inclusive nas chegadas | RNF01 < 10 s; contagem de 3 s; RNF03 60 fps | E2E-01, E2E-10 / D2, D5, D12 |
| H2 | volta, pausa, motivos, rede, idioma e cor no notebook | D6, D7 (Esc, troca de aba, botão), D8 (pulo, corte, reposicionamento), D9 (offline e armazenamento), D10 (pt, en, fr), D11 (escala de cinza) | resultado de cada linha | NFR-0002, NFR-0004, NFR-0006, NFR-0007; REQ-FEAT-0009-11 | E2E-02, -03, -04, -07, -08, -09 / D6–D11 |
| H3 | determinismo em 4 navegadores | `reference.inputs` de TEST-0008 em Chrome, Edge, Firefox e Safari | total e 4 setores por navegador | NFR-0008: 0 ms de diferença | E2E-11 / D13 |
| H4 | **treino de voltas seguidas no notebook** | um treino de quatro voltas (duas válidas, uma com corte, uma válida) sem tocar em nada além da pilotagem; reposicionar uma vez; pausar pelo botão e continuar; conferir "encerrar treino" em corrida e em pausa e acioná-lo em pausa; novo treino; recarregar no meio de um treino. **E2E-13**: registrar "não executável pela tela — nenhuma pista sem setores no catálogo; decidido por CHK-TEST-0015-25, CHK-TEST-0012-14, CHK-TEST-0010-21" | por chegada: painel ao lado, total, setores ou "—", validade e motivo, "não oficial", kart andando, sem contagem; a melhor volta válida a cada chegada; o estado antes e depois do reposicionamento; o valor do cronômetro na pausa e na retomada; o que aparece ao encerrar, no novo treino e na reabertura | AC-US-0010-02, -04, -07, -11, -12, -15, -16, -19, -23, -24, -25 (tela); -27 por `npm test` | E2E-12, E2E-13 / D15, D16 |
| H5 | celular — as linhas M | M1–M12 no celular de referência nomeado (4G real, inclinação, sensor coberto e negado, troca de aplicativo, modo avião, idioma, 16 px, fps) | resultado e medida de cada linha | RNF01, RNF06, NFR-0002, NFR-0003 (30 fps), NFR-0004, NFR-0006, NFR-0007; I4 | E2E-01, -02, -04, -05, -07, -08, -09, -10 / M1–M12 |
| H6 | **treino de voltas seguidas no celular** | H4 por inclinação ou toque, em paisagem e em retrato; "❚❚ pausar" e "encerrar treino" por toque | o mesmo de H4; os dois botões alcançáveis e legíveis sem cobrir a pista; o painel legível na tela pequena | AC-US-0010-15, -16 nos dois canais; os mesmos de H4 | E2E-12 / M13, M14 |

Resultado esperado: 6 linhas `PASS` (H4 com a nota de E2E-13); a precondição *Execução 3* fecha e os 39 critérios
`unverified` ficam verificados na metade humana. Uma linha reprovada é `FAIL CODE` (defeito de aplicação), nunca de
empacotamento: o bundle é o que passou em `npm test` e em `check_served.py`.

## Roll back

| # | Passo (desfaz o passo de *Promote* indicado) | Esperado | Leva |
|---|---|---|---|
| R1 | desfaz 10 (ou 7, em staging), pelo caminho do passo 6. **Produção, hoje — caminho A**: Settings → Pages → "…" → **Unpublish site** → confirmar. **Staging — caminho B**: `kartle-staging/actions` → execução **41076989728** (`652bbaa`) → **Re-run all jobs** (sem revisor; se o site tiver sido despublicado antes, reativar o Pages e liberar a política de ramos primeiro). **Caminho C**: `git revert 8811414 0c83ed9` (sem `--no-commit`), `npm test`, push ao remoto em causa; em produção, aprovar o `deploy` | **A**: a URL responde 404 em até 10 min. **B**: a URL serve o `index.html` da execução reexecutada (o `<hash>` de `652bbaa`); o treino volta a terminar na primeira chegada (seed rev 2); `check_served.py` desta rodada reprova nos elementos do treino contínuo. **C**: `npm test` verde na árvore revertida e a URL serve o `index.html` reconstruído | A: 1 min + até 10 min de cache (ensaiado: 404 no navegador em ≈ 1 min; cache de borda com 200 por mais de 6 min). B: 3 a 5 min de execução + até 10 min de cache (procedimento ensaiado em 2026-10-27: ≈ 4 min). C: 10 min + execução + aprovação + cache |
| R2 | propagação do cache (desfaz 11): sem purga; esperar até 10 min e buscar em janela anônima. Para voltar a publicar depois do caminho A: reativar o Pages (*Source* = GitHub Actions), conferir a política de ramos do ambiente (em staging, liberar de novo) e *Re-run all jobs* da execução verde | busca nova devolve o 404 (A) ou o `index.html` restaurado (B/C) e os seus *assets* com 200 | até 10 min (republicação pelo caminho A: ≈ 7,5 min no ensaio) |
| R3 | executar *Verify* 1, 3 e 5 na versão restaurada (B/C); no caminho A, confirmar o 404 nos 4 navegadores | B/C: HTTPS válido, carga abaixo de 10 s, a tela anterior funciona; A: nenhuma página | 10 min |
| R4 | registrar a reversão: hash revertido, alvo restaurado e número da execução, gatilho, horário | linha em `docs/lap-validation-device-log.md` e relatório em `reports/deploy-validation/` | 5 min |
| R5 | causa da aplicação (painel, kart parado na chegada, contagem nova, cronômetro, pausa, fps) → `FAIL CODE` para o estágio de código; causa de empacotamento (base, cache, HTTPS, Pages, política de ramos) → `FAIL` deste estágio | relatório com a classificação | 15 min, no mesmo dia |

Staging reverte-se pelos mesmos passos (lá o `deploy` não pede aprovação) e nunca é precondição para reverter produção.

Dados: nada a desfazer. A sessão de treino vive em memória e é descartada ao recarregar (DM-0002); nada é gravado no
navegador nem enviado a servidor (DES-0011). Um jogador com a página nova em cache continua a jogá-la por até 10 min.

**Point of no return:** não existe nesta release. Em produção a reversão é despublicar (A) enquanto nada tiver sido
promovido, e depois reexecutar a execução verde anterior (B) enquanto o Actions a retiver (90 dias), ou reconstruir de um
commit (C) — o repositório é o artefato de reversão. O único ato que tornaria a reversão impossível seria apagar o
histórico (`push --force` sobre `master`), que nenhum passo deste runbook faz. Quando houver pistas publicadas para dias
futuros (pós-MVP), a publicação de uma `trackVersion` passa a ser o ponto sem retorno (I3), e este runbook terá de nomeá-lo.
