---
title: Release — dirigibilidade do Arcade assistido (acerto arcade-assistido-v6, sem drift nem turbo)
feature: dirigibilidade
stage: deploy
status: validated
version: 2.2.0
sources: [DM-0001, DES-0001, DES-0003, DES-0005, DES-0006, DES-0007, DES-0008, DES-0009, ADR-0001, ADR-0006, NFR-0002, NFR-0004, NFR-0007, NFR-0008, NFR-0009, TEST-0007, TEST-0008, TEST-0010]
---

# 01 — Release

Candidato a release da feature `dirigibilidade` no **seed rev 6**: o preset `ARCADE_ASSISTIDO_V6` (`src/physics.ts`) — o
**acerto C** escolhido pelo dono do produto na staging em 2026-10-29 (`DOMAIN.md`) — como acerto padrão da página
(`PUBLISHED_SETUPS.ARCADE_ASSISTIDO`, `setupVersion` `arcade-assistido-v6`, anterior publicada `arcade-assistido-v4` intacta
como `previousConfig`; o `ARCADE_ASSISTIDO_V5` fica no código só como base dos valores do v6 e como registro da rodada de
staging substituída, nunca publicado como versão corrente nem anterior); **o drift e o turbo fora da simulação** (o comando
`drift` de `Input` é aceito e não tem efeito, `DRIFT_INERT`; a velocidade máxima é a do governador, `SPEED_CAP`; ADR-0006) **e
de toda tela** (HUD, resultado, texto compartilhado, tela inicial, dica da barra, guia de manobras e o botão "Drift" do controle
de toque — DES-0005, DES-0006, DES-0007, DES-0009); o HUD de velocidade e aderência; os registros publicados
(`src/setupRecords.ts`; `npm run bench:handling`) e a linha de base legível por máquina em `docs/physics.md`. O artefato é o
mesmo tipo da release anterior: **estático** (`dist/`, HTML + JS + CSS) servido pelo **GitHub Pages** com HTTPS (D23); **não
há servidor, banco, serviço, migração de dado nem aplicativo nativo**, e nada é gravado no navegador.

Esta versão do registro substitui a 1.0.0, que descrevia a árvore `b86b200` (acerto v5, com drift e turbo), a 2.0.0, que
nomeava `6b314b2`, e a 2.1.0, que nomeava `e70aad9`; a 2.2.0 nomeia `2aa013e`, o build que staging serve desde 2026-11-04. O que mudou de uma para a outra está em
`97-changelog.md`.

## O que é entregue

| Item | Conteúdo | Fonte |
|---|---|---|
| Canais | `web-desktop` e `web-mobile` — a mesma página, com teclado no computador e inclinação ou toque no celular | diretivas do estágio; `REL-0004` |
| O que esta feature mudou desde a release validada anterior (`b86b200`) | `src/physics.ts` (`ARCADE_ASSISTIDO_V6`; `PUBLISHED_SETUPS.ARCADE_ASSISTIDO` → v6; drift e turbo fora do passo, `State.maneuvers` carregado sem mudança), `src/handlingMessages.ts` (texto compartilhado sem `setupVersion`), `src/main.ts` (HUD e resultado sem indicadores de drift ou turbo, sem `#lap-result-setup`, sem `touch.has('drift')`), `index.html` (sem indicadores de drift, sem `#lap-result-setup`, tela inicial sem drift, dica `Dirigir`, sem guia de manobras, controle de toque só com ←, →, Freio e Acelerar), `src/style.css` (regras de drift e do guia retiradas), `scripts/handlingBench.ts` (ensaios na pista de teste aberta, `DRIFT_INERT`, `SPEED_CAP`), `docs/physics.md` (seção datada do v6 e bloco `handling-baseline` com quatro entradas). `src/maneuvers.ts` fica no repositório, importado só pelo tipo de `State`, numa janela de compatibilidade (ADR-0006) | `400 Code/Output/dirigibilidade/01-implementation.md` 3.1.0 (rodada 6); `docs/physics.md` |
| Outras features na mesma árvore | `race-lap-validation` (treino de voltas seguidas), `modelo-kart-01` (Kart 01, marcas de pneu, câmera) e `pista-kart-park` (seletor de pista, Kart Park, crédito OSM) — cada uma com o seu registro em `600 Deploy/Output/<feature>/`; este registro observa só o que é da `dirigibilidade` | `git log` de `master` |
| Formato publicado que muda | o **acerto**: `ARCADE_ASSISTIDO` → `arcade-assistido-v6` (anterior declarada `arcade-assistido-v4`); `REALISTA_ALUGUEL_4T` → `realista-aluguel-4t-v4` (inalterado, NFR-0007); `ReplayRecord` versão 1 (inalterado). Viajam dentro do bundle | DM-0001; `REL-0002` |
| Formato persistido que muda | **nenhum**: a feature não grava nada no navegador (`CHK-TEST-0010-*`; `check_bundle.py`: 0 ocorrências textuais de armazenamento no `dist/`) | DM-0001 seção 1; DES-0008 |
| Feature flag | **nenhuma**, por decisão do projeto validado (DES-0007 e DES-0009, *Feature flag*; ADR-0001, ADR-0006): a escolha do acerto (`#handling-preset`) aponta para o dado publicado; não há chave para a versão anterior nem para o drift. A reversão é a republicação do artefato anterior (`runbook.md`) | DES-0007, DES-0009, ADR-0001, ADR-0006 |
| Variáveis de ambiente | nenhuma lida pelo cliente; nenhuma no workflow | `REL-0001` |
| O que o jogador vê de novo | o acerto padrão responde como o C (esterço até 0,5 rad, aderência de 2,4 g, velocidade estabilizada 69,3 km/h, 0–60 km/h em 2,21 s, raio ≈ 11,7 m com acelerador e esterço cheios a partir de 50 km/h, 208° em 2 s sem acelerador); segurar Espaço não faz nada; nenhum medidor, rótulo, pontuação, combo, guia, dica ou botão de drift ou turbo em tela alguma; o resultado e o texto compartilhado (`Kartle · <trackId> v<trackVersion> · <tempo>`) sem a versão do acerto; o melhor tempo mostra `—` ao trocar de acerto (nunca compara versões diferentes) | DES-0001, DES-0005, DES-0006, DES-0009, RULE-0003; `docs/physics.md` (seção v6) |

## Proveniência — o commit que a release nomeia

| Fato | Estado em 2026-11-04 |
|---|---|
| Veredito de testes | `SUCCESS` — `500 Tests/Output/dirigibilidade/reports/test-validation/test-validation-20261030-1638.md` (rodada 3, seed rev 6, digest `dbf86f325606`): as **65** `CHK-TEST-00nn-nn` desta feature aprovadas (61 → 65; 0 removidas); 12 critérios com a metade de tela, aparelho ou relógio `unverified` (`500 Tests/Output/dirigibilidade/98-divergences.md`). A execução daquele veredito (13:35 −03:00) tinha 9 reprovações de `pista-kart-park`, atribuídas àquela feature e corrigidas depois (`1254443`, testes revalidados). **Aplicável a `2aa013e` por contenção, não por veredito novo** (como já o era a `6b314b2` e a `e70aad9`): entre `e70aad9` e `2aa013e` nenhum arquivo `tests/dirigibilidade-*`, `tests/physics.test.ts`, `tests/maneuvers.test.ts` ou `tests/helpers/` mudou, nem `src/physics.ts`, `src/handlingMessages.ts`, `src/setupRecords.ts`, `src/maneuvers.ts`, `scripts/` ou `docs/physics.md` (`git diff --quiet e70aad9 2aa013e -- …` sem diferença); na execução fresca da suíte sobre a árvore de `2aa013e` (JUnit `500 Tests/Output/pista-kart-park/reports/junit-latest.xml`, do veredito `test-validation-20261103-2043.md` daquela feature, reduzido por script), as **65** verificações desta feature passam, 0 reprovadas, 0 puladas (e as 23 de `tests/physics.test.ts` e 8 de `tests/maneuvers.test.ts`), numa suíte de **467/467** |
| Código validado | `400 Code/Output/dirigibilidade/reports/code-validation/code-validation-20261030-1613.md` (rodada 6, `SUCCESS`; commit `f6e2d16`) |
| Commit verificado | **`2aa013e67de49fb842f42cda573b3b82df5cf824`** (curto `2aa013e`), ramo `master`, 2026-11-03 17:44:39 −03:00, "pista-kart-park: testes da revisão 2 …" — o commit que staging serve. Contém toda a cadeia desta feature no seed rev 6 (`301451c` seed, `9e3f50b` req, `9e7f93f` F-Spec, `5d2817e` D-Spec, `f6e2d16` código rodada 6, `c387839` testes revalidados) e as das outras três features. Acima dele só há commits **de registro** (`1966c4a`, `c06afdd`: só `600 Deploy/Output/pista-kart-park/`; nenhum arquivo de `src/`, `scripts/`, `tests/`, `index.html`, `docs/physics.md`, `package.json` ou do lockfile). O candidato anterior, `e70aad9` (versão 2.1.0, `deploy-validation-20261103-1808.md` `SUCCESS`), fica como histórico |
| Mudança `6b314b2` → `e70aad9` e contenção | `git diff --stat 6b314b2 e70aad9 -- src index.html tests package.json package-lock.json tsconfig.json vite.config.* .github docs/physics.md`: `index.html` (o contêiner `#lap-training-result-credit` dentro de `#lap-training-result`; `#lap-result-credit` sai de `#lap-result`), `src/main.ts` (`renderTrainingResult` preserva e desenha o crédito; `renderResult` sem crédito; um comentário do estado da zebra), `src/style.css` (uma regra `#lap-training-result-credit a`) e `tests/pista-kart-park-screens.test.ts` — o **ADR-0007 de `pista-kart-park`** (crédito OSM no painel de resultado de cada volta de treino; `38354bb`, `e70aad9`). Nada desta feature: nem `src/physics.ts`, `src/handlingMessages.ts`, `src/setupRecords.ts`, `docs/physics.md`, nem o HUD (`.handling-readout`, `#preset-label`), o resultado (`#lap-result-setup` ausente), a tela inicial, a dica ou os controles de toque; `check_served.py` e `check_bundle.py` desta release dão o mesmo resultado sobre o build novo (abaixo) |
| Mudança `e70aad9` → `2aa013e` e contenção | `git diff --name-only e70aad9 2aa013e -- src index.html tests scripts package.json package-lock.json tsconfig.json vite.config.* .github .nvmrc docs/physics.md`: `src/trackScene.ts` (acabamento visual da Kart Park, seed rev 2 de **`pista-kart-park`**: grama em faixas, faixa de borda, zebra com relevo, barreira de pneus; código `fbfb073`), `src/main.ts` (**uma linha**, 239: `ground.visible = !(ready && trackGeometry)` — o chão plano fica oculto só com a Kart Park pronta, onde a grama do acabamento o substitui; na pista sintética, a dos ensaios de `bench:handling` e dos testes desta feature, continua visível como antes), sete suítes `tests/pista-kart-park-*.test.ts` e `tests/fixtures/kartParkRev1Trace.json`. Nada desta feature: nem o passo, o acerto, os registros publicados, o HUD (`.handling-readout`, `#preset-label`), o resultado, a tela inicial, a dica ou os controles de toque (`index.html` e `src/style.css` sem diferença); a linha nova é a visibilidade de um objeto da cena e não entra na simulação (NFR-0013 de `pista-kart-park`: a trajetória passo a passo na Kart Park é a de antes do acabamento, provada em `npm test`). `check_served.py` (22/22) e `check_bundle.py` (25/25) desta release dão o mesmo resultado sobre o build novo (abaixo) |
| Suíte inteira na árvore de `2aa013e` | **467** coletados, 467 aprovados, 0 reprovados, 0 pulados — no `npm test` da execução de staging 41832829595 (`1966c4a`, só registro sobre `2aa013e`; log do Actions reduzido às linhas de contagem, `deploy-validation-20261104-1302.md` de `pista-kart-park`) e na execução local fresca do veredito `test-validation-20261103-2043.md` de `pista-kart-park` (65 desta feature) |
| Build limpo da mesma árvore | `MSYS_NO_PATHCONV=1 npx vite build --base=/kartle-staging/` da árvore limpa de `2aa013e`: **`assets/index-BMmvlQeM.js`** 696 559 bytes (sha256 `babb1884…`), `assets/index-q-biCwua.css` 10 850 (`5e1c964b…`) e `index.html` 6 592 (`3b0dfc37…`) — os três byte a byte iguais ao servido (`cmp`, `deploy-validation-20261104-1302.md` de `pista-kart-park`); sobre os três arquivos servidos (baixados por GET em 2026-11-04): `measure_dist.py` `within_limit=True`; `check_bundle.py <dist> docs/physics.md`: **25 verificações, 0 reprovadas** |
| Staging | **publicado**: execução **41832829595** de `edumatosr6-svg/kartle-staging` (evento `push`, commit `1966c4a`, só de registro sobre `2aa013e`, tentativa 1; `build` 2026-11-04 12:51:04–12:52:18Z com `npm test` 467/467 e `Measure dist` `total_bytes=714001 gzip_bytes=189539 within_limit=True`; `deploy` 12:52:21–12:53:05Z; `success`; ramo `staging` = `1966c4a` por `git ls-remote`). `https://edumatosr6-svg.github.io/kartle-staging/` responde **200 em HTTPS** (`Last-Modified: Wed, 04 Nov 2026 12:53:01 GMT`, `Cache-Control: max-age=600`) e serve `index.html` (6 592 bytes, sha256 `3b0dfc37…`) que referencia **`assets/index-BMmvlQeM.js`** (696 559 bytes, `babb1884…`) e `assets/index-q-biCwua.css` (`5e1c964b…`); `check_served.py … index-BMmvlQeM.js` (2026-11-04): **22 verificações, 0 reprovadas** (acerto v6 corrente com v4 anterior, v5 ausente, Realista v4, prefixo do texto compartilhado, elementos do HUD, `#lap-result-setup` ausente, HTML sem drift/turbo/impulso/combo/Espaço, sem guia de manobras, dica `Dirigir`, controle de toque só com `left`, `right`, `brake`, `throttle`). Leitura por `gh run list` (só leitura) e GET |
| Produção | o site Pages de `edumatosr6-svg/kartle`, `https://edumatosr6-svg.github.io/kartle/`, com o ambiente `github-pages` protegido por **revisor obrigatório** (`edumatosr6-svg`); o clique de aprovação é a promoção (D-DP-06). **Nada foi promovido**: produção nunca serviu um `dist/`; `origin/master` é `05c3570` (`git ls-remote origin`, 2026-11-04). **Esta árvore não é promovível hoje**: contém a Kart Park, bloqueada pela decisão Esri (`pista-kart-park`, ADR-0005) — ver *Promoção* abaixo |
| Tag de release | não existe; a release é identificada pelo hash acima e pela execução do workflow que a publicou |
| Sistema de CI | **GitHub Actions**, `.github/workflows/pages.yml` (inalterado por esta feature): `npm ci` → `npm test` (**467** aprovados) → `npm run build -- --base=/<repo>/` → `measure_dist.py` (RNF02) → `upload-pages-artifact` → `deploy-pages`; etapas em `REL-0003` |
| Alvo de reversão em staging | o alvo do caminho B passa a **41156803005** (commit `1bb63aa`, só de registro sobre `e70aad9`; 2026-10-31, `npm test` 444/444, `assets/index-DmxsQuIL.js` 694 178 bytes; `success`, retida): a execução verde imediatamente anterior à em vigor, com **esta release inteira** (acerto C, sem drift nem turbo em tela alguma, `check_served` 22/22 sobre `DmxsQuIL` em 2026-11-03) e sem o acabamento da Kart Park — reexecutá-la desfaz só o passo `e70aad9` → `2aa013e`. Para tirar também a retirada do drift das telas, o alvo continua a **41076989728** (commit `652bbaa`, 2026-10-30 15:02Z, `npm test` 393/393, `assets/index-dD_vz2Ev.js` 691,31 kB, `assets/index-CW8t98so.css`): acerto v6 com o drift e o turbo ainda nas telas (tela inicial, dica, guia, botão "Drift" do toque); entre as duas, 41101055606 (`6b314b2`), 41109469203 (`e70aad9`) e 41111441877 (`28d40ef`), todas verdes. Antes delas, a 40566728590 (`b86b200`, v5, `index-BiFxJ0FY.js`) |

### Precondições humanas que restam, em ordem

1. **Preencher `docs/handling-device-log.md`** (o arquivo existe desde `1bb63aa`, criado pelo dono do produto) com a execução
   humana do roteiro de aparelho (E2E-01 a E2E-04 de `300 Specs/330 D-Specs/Output/dirigibilidade/test-strategy.md`) sobre a
   URL de staging (`index-BMmvlQeM.js`), no notebook e no celular de referência: as **cinco linhas humanas** H1–H5 do
   `runbook.md` (sensação do acerto C; raio nos grampos; tecla de drift sem efeito e nenhuma tela de drift; HUD por quadro e
   resultado; taxa de quadros e custo por passo) (`98-divergences.md`, DIV-DP-01); 12 critérios do veredito de testes têm a
   metade humana `unverified` até esse registro. A rodada de teste do dono do produto que o domínio mantém como critério final
   (`DOMAIN.md`, 2026-10-21) é a H1. **Estado em 2026-11-04**: o arquivo tem só uma *Execução no celular — 2026-10-30* sobre
   `e70aad9`/`index-DmxsQuIL.js`, num aparelho sem modelo, navegador nem versão e sem medida. É evidência **qualitativa**:
   confirma a sensação de curva no celular ("virou bem") e, pelo resumo, nenhum botão ou texto de drift e jogo em retrato;
   "rodou legal" sem fps medido; nada no notebook. **Não fecha nenhuma linha H1–H5**.
2. **Validação de staging pelo validador** (`reports/deploy-validation/`), que confirma a execução em vigor 41832829595, o
   `<hash>` servido `BMmvlQeM` e a contenção `e70aad9` → `2aa013e` no lugar de um veredito de testes novo.
3. **A decisão Esri** (`pista-kart-park`), da qual depende a promoção (D-DP-06): o dono do produto escolheu em 2026-11-03 a
   opção 1 de *Promoção* abaixo (`DOMAIN.md`: esperar a decisão Esri e subir junto com as outras três features).

Cumpridas: o commit da árvore verificada e servida (`2aa013e`) com a contenção das mudanças `6b314b2` → `e70aad9` → `2aa013e`;
o veredito de testes `SUCCESS` no seed rev 6, aplicável a `2aa013e` (65/65 na suíte 467/467); o build reproduzido pelo pipeline em
staging e servido em HTTPS com os mesmos bytes do build limpo; o alvo B novo (41156803005) nomeado; o caminho B de reversão ensaiado neste site
em 2026-10-27 (`reports/deploy-validation/deploy-validation-20261027-1931.md`); o Node fixado (`.nvmrc` = `24`); os dois
repositórios configurados (D23); a decisão de monitoramento (vigilância manual, nenhum monitor externo), mantida; a opção de
produção 1, registrada em `DOMAIN.md` (2026-11-03).

## Promoção — a árvore contém a Kart Park

Todo commit de `master` a partir de `ba221ad` contém a Kart Park, e a decisão de `pista-kart-park` (ADR-0005; seu
`runbook.md`, *Promoção bloqueada*) é que nenhum artefato construído de um commit que a contenha vai a produção antes da
decisão Esri do dono do produto. `2aa013e` está nesse caso. As opções, como na rodada anterior e no registro daquela feature;
**a escolha é do dono do produto** — e foi feita em 2026-11-03: **opção 1** (`DOMAIN.md`):

| Opção | O que leva a produção | O que vale para esta release |
|---|---|---|
| **1 — esperar a decisão Esri** e promover tudo junto | `race-lap-validation`, `dirigibilidade` (acerto C, sem drift), `modelo-kart-01` e a Kart Park de uma vez, de um commit de `master` igual ou posterior a `2aa013e` | é a única que entrega **esta** release; até lá produção continua sem nada publicado. As portas humanas (H1–H5) fecham em staging sobre este bundle |
| **2 — publicar `6ea3862` antes de qualquer push de `master`** (`git push origin 6ea3862:master`, avanço rápido de `05c3570`, sem `--force`; procedimento no `runbook.md` de `pista-kart-park`) | a árvore de `modelo-kart-01`, sem Kart Park | **não entrega esta release**: `6ea3862` tem o acerto **`arcade-assistido-v5`** e o **drift e o turbo** no passo e nas telas (`index.html` com "Drift", "Espaço" e `data-control="drift"`) — exatamente o estado que o dono do produto rejeitou na staging em 2026-10-29 ("o kart simplesmente não vira"). Promovê-la publica a `dirigibilidade` da rodada anterior, não a validada hoje |

**"Acerto C sem Kart Park" não existe como commit.** O último commit de `master` sem a Kart Park é `71f604e` (só registro
sobre `6ea3862`); todos os commits com o v6 (`cfad3dc` em diante) e com o drift fora das telas (`f6e2d16` em diante) são
posteriores a `ba221ad`. Também não é um *cherry-pick* limpo: as rodadas 5 e 6 do código foram escritas sobre o treino de
voltas seguidas de `race-lap-validation` e a sessão de treino de `pista-kart-park` (`startTrainingLap`, DES-0007). Um commit
assim seria trabalho novo — um ramo a partir de `6ea3862` com as mudanças do seed rev 4–6 desta feature, a sua própria rodada
de código e de testes, a sua execução de staging e uma nova rodada deste estágio — e decidi-lo é do dono do produto; este
registro não o cria nem o recomenda.

## Reprodução do build

O workflow executa estes passos a cada push; à mão, da raiz do repositório, com caminhos entre aspas, **numa árvore limpa de
`2aa013e`** (a árvore de trabalho pode trazer edições de outra feature; no Git Bash do Windows, `MSYS_NO_PATHCONV=1` antes de
um `--base=/…/`):

| Passo | Comando | Resultado esperado |
|---|---|---|
| 1 | `npm ci` | saída 0; `package-lock.json` inalterado |
| 2 | `npm test` | saída 0; **467** aprovados, 0 reprovados, 0 pulados (65 `CHK-TEST-*` desta feature) |
| 3 | `npm run build` (no workflow, `-- --base=/kartle/` ou `/kartle-staging/`) | saída 0 (`tsc --noEmit` e depois `vite build`); `dist/index.html`, `dist/assets/index-BMmvlQeM.js`, `dist/assets/index-q-biCwua.css` |
| 4 | `python -I "600 Deploy/Output/race-lap-validation/tools/measure_dist.py" dist` | tabela de tamanhos; `within_limit=True`; saída 0 (ferramenta da release anterior, reutilizada por referência — é a que o workflow chama) |
| 5 | `python -I "600 Deploy/Output/dirigibilidade/tools/check_bundle.py" dist docs/physics.md` | `checks=25 failed=0`: v6 corrente com v4 anterior, v5 ausente do JS, elementos do HUD, `#lap-result-setup` ausente, HTML e CSS sem drift/turbo, dica `Dirigir`, toque com 4 controles, bloco `handling-baseline` com v4, Realista e v6 (datada) e a v5 mantida como registro |
| 6 | `npm run bench:handling` (opcional; só na máquina de referência conta para NFR-0002) | saída 0; 56 registros `PASS` (17 ensaios nos dois modos); `STEP_COST` ≤ 1,10 × a linha de base |
| 7 | `npm run preview` | `http://127.0.0.1:4173` serve o bundle; `#preset-label` mostra `ARCADE ASSISTIDO · TREINO LIVRE`; segurar Espaço numa volta não muda nada na tela nem na pilotagem |

### Medida real do artefato

| Arquivo | bytes (servido em staging) | gzip bytes (`measure_dist.py` sobre os servidos, Windows) |
|---|---:|---:|
| `assets/index-BMmvlQeM.js` | 696 559 | 184 146 |
| `assets/index-q-biCwua.css` | 10 850 | 3 049 |
| `index.html` | 6 592 | 2 591 |
| **total** | **714 001** | **189 786** (no *Measure dist* da execução 41832829595: **189 539**) |

- Limite de RNF02 (download inicial abaixo de 3 145 728 bytes): **714 001 bytes brutos (22,7 % do limite)**, igual ao
  `total_bytes` do passo *Measure dist* da execução 41832829595. O gzip difere (189 539 no Linux do workflow, 189 786 no
  Windows sobre os mesmos bytes): só a biblioteca zlib; a compressão não é a medida do limiar. Contra `e70aad9` (711 620):
  +2 381 bytes, todos no JS, do acabamento de `pista-kart-park`; antes, contra `6b314b2` (711 477): +143 bytes, do ADR-0007.
- Contra a release validada anterior (`b86b200`, 598 028 bytes): +115 973 bytes, quase todos de outras features na mesma
  árvore (o modelo do Kart 01, a pista Kart Park embutida); a parte desta feature não é isolável no bundle. Contra a execução de staging `652bbaa` (709 021 bytes): **+4 980 bytes**.
- O Vite avisa que o chunk principal passa de 500 kB minificado (Three.js); aviso de ferramenta, não violação de limiar.
- Os nomes dos *assets* carregam hash de conteúdo: o `index.html` publicado é o que aponta para a versão em vigor
  (`REL-0003`, regra de cache).

## O que o pipeline faz (`.github/workflows/pages.yml`)

Inalterado por esta feature. Em ordem, com saída observável na execução do Actions: checkout do commit → Node da `.nvmrc`
(24) com cache do npm → `npm ci` → `npm test` (467 aprovados) → `npm run build -- --base=/kartle/` (ou `/kartle-staging/`) →
`measure_dist.py dist` (saída 0) → `configure-pages` → `upload-pages-artifact` → trabalho `deploy` no ambiente
`github-pages`. Em produção o `deploy` **espera a aprovação do revisor obrigatório** (D-DP-06); em staging publica de
imediato, desde que a política de ramos do ambiente admita o ramo `staging` (volta a ser restrita a cada despublicação —
`REL-0003`). Permissões mínimas, nenhum segredo (I6). `tools/check_bundle.py` e `tools/check_served.py` são executados por
quem valida e pelo runbook, não pelo workflow (`98-divergences.md`, DIV-DP-05).

## Limitações conhecidas — divergências aceitas e herdadas

- As divergências aceitas pelo dono do produto em 2026-10-21 continuam válidas: o `href="/"` da marca e a requisição a
  `fonts.googleapis.com` no carregamento (`waived`, DIV-DP-09 e DIV-DP-10 em `98-divergences.md`).
- O crédito OpenStreetMap e o aviso ODbL agora existem na página por causa da Kart Park (`pista-kart-park`); são daquela
  feature e não desta.
- O botão `#lap-share` está no `index.html`, mas só aparece no resultado de uma volta oficial ou de reconhecimento, que esta
  página não oferece (o treino de voltas seguidas de `race-lap-validation` volta à oferta sem tela de resultado). O texto
  compartilhado sem a versão do acerto é provado por `CHK-TEST-0007-02` e `-0007-05` sobre `formatSharedText`, mas a sua
  metade humana (compartilhar de verdade) não é executável neste bundle (`98-divergences.md`, DIV-DP-13).
