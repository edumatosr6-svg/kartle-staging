---
title: Release — dirigibilidade do Arcade assistido (acerto arcade-assistido-v6, sem drift nem turbo)
feature: dirigibilidade
stage: deploy
status: validated
version: 2.0.0
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

Esta versão do registro substitui a 1.0.0, que descrevia a árvore `b86b200` (acerto v5, com drift e turbo). O que mudou de
uma para a outra está em `97-changelog.md`.

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

| Fato | Estado em 2026-10-30 |
|---|---|
| Veredito de testes | `SUCCESS` — `500 Tests/Output/dirigibilidade/reports/test-validation/test-validation-20261030-1638.md` (rodada 3, seed rev 6, digest `dbf86f325606`): as **65** `CHK-TEST-00nn-nn` desta feature aprovadas (61 → 65; 0 removidas); 12 critérios com a metade de tela, aparelho ou relógio `unverified` (`500 Tests/Output/dirigibilidade/98-divergences.md`). A execução daquele veredito (13:35 −03:00) tinha 9 reprovações de `pista-kart-park`, atribuídas àquela feature e corrigidas depois (`1254443`, testes revalidados) |
| Código validado | `400 Code/Output/dirigibilidade/reports/code-validation/code-validation-20261030-1613.md` (rodada 6, `SUCCESS`; commit `f6e2d16`) |
| Commit verificado | **`6b314b2193c25cd6384a3f64cffdc369637b3753`** (curto `6b314b2`), ramo `master`, 2026-10-30 14:43:19 −03:00, "modelo-kart-01: testes migrados para o seed rev 4 … — 443/443". Contém toda a cadeia desta feature no seed rev 6 (`301451c` seed, `9e3f50b` req, `9e7f93f` F-Spec, `5d2817e` D-Spec, `f6e2d16` código rodada 6, `c387839` testes revalidados) e as das outras três features. A ponta de `master` é `483c5fa`, que só acrescenta relatórios de `modelo-kart-01` sobre `6b314b2` (commit **só de registro**: nenhum arquivo de `src/`, `scripts/`, `tests/`, `index.html`, `docs/physics.md`, `package.json` ou do lockfile) |
| Suíte inteira na árvore de `6b314b2` | **443** coletados, 443 aprovados, 0 reprovados, 0 pulados — no `npm test` da execução de staging (log do Actions, reduzido às linhas de contagem) e de novo localmente nesta rodada (JUnit, 2026-10-30, árvore de trabalho igual a `6b314b2` fora dos relatórios não rastreados) |
| Build local da mesma árvore | `vite build --base=/kartle-staging/` para um diretório temporário: **`assets/index-BwruE9Pq.js`** 694 094 bytes, `assets/index-oR7KyBh_.css` 10 800 — o mesmo nome e tamanho do servido; `measure_dist.py`: `within_limit=True` (188 912 bytes comprimidos); `check_bundle.py <dir> docs/physics.md`: **25 verificações, 0 reprovadas** |
| Staging | **publicado**: execução **41101055606** de `edumatosr6-svg/kartle-staging` (evento `push`, ramo `staging`, commit `6b314b2`, tentativa 1; `build` 17:43:26–17:47:57Z com `npm test` 443/443 e `Measure dist` `total_bytes=711477 within_limit=True`; `deploy` 17:48:00–17:48:12Z; `success`). `https://edumatosr6-svg.github.io/kartle-staging/` responde **200 em HTTPS** (`Last-Modified: Fri, 30 Oct 2026 17:48:06 GMT`, `Cache-Control: max-age=600`) e serve `index.html` (6 583 bytes) que referencia **`assets/index-BwruE9Pq.js`** (694 094 bytes) e `assets/index-oR7KyBh_.css`; `check_served.py`: **22 verificações, 0 reprovadas** (acerto v6 corrente com v4 anterior, v5 ausente, Realista v4, prefixo do texto compartilhado, elementos do HUD, `#lap-result-setup` ausente, HTML sem drift/turbo/impulso/combo/Espaço, sem guia de manobras, dica `Dirigir`, controle de toque só com `left`, `right`, `brake`, `throttle`). Leitura por `gh run view` (só leitura) e dois GET |
| Produção | o site Pages de `edumatosr6-svg/kartle`, `https://edumatosr6-svg.github.io/kartle/`, com o ambiente `github-pages` protegido por **revisor obrigatório** (`edumatosr6-svg`); o clique de aprovação é a promoção (D-DP-06). **Nada foi promovido**: produção nunca serviu um `dist/`; `origin/master` é `05c3570` (lido em `.git/refs/remotes/origin/master`). **Esta árvore não é promovível hoje**: contém a Kart Park, bloqueada pela decisão Esri (`pista-kart-park`, ADR-0005) — ver *Promoção* abaixo |
| Tag de release | não existe; a release é identificada pelo hash acima e pela execução do workflow que a publicou |
| Sistema de CI | **GitHub Actions**, `.github/workflows/pages.yml` (inalterado por esta feature): `npm ci` → `npm test` (**443** aprovados) → `npm run build -- --base=/<repo>/` → `measure_dist.py` (RNF02) → `upload-pages-artifact` → `deploy-pages`; etapas em `REL-0003` |
| Alvo de reversão em staging | a execução verde anterior em `kartle-staging` é a **41076989728** (commit `652bbaa`, 2026-10-30 15:02Z, `npm test` 393/393, `assets/index-dD_vz2Ev.js` 691,31 kB, `assets/index-CW8t98so.css`): já com o acerto v6, mas com o drift e o turbo ainda nas telas (tela inicial, dica, guia, botão "Drift" do toque) — caminho B do `runbook.md`. Antes dela, a 40566728590 (`b86b200`, v5, `index-BiFxJ0FY.js`), validada na rodada anterior |

### Precondições humanas que restam, em ordem

1. **Criar e preencher `docs/handling-device-log.md`** com a execução humana do roteiro de aparelho (E2E-01 a E2E-04 de
   `300 Specs/330 D-Specs/Output/dirigibilidade/test-strategy.md`) sobre a URL de staging, no notebook e no celular de
   referência: as **cinco linhas humanas** H1–H5 do `runbook.md` (sensação do acerto C; raio nos grampos; tecla de drift
   sem efeito e nenhuma tela de drift; HUD por quadro e resultado; taxa de quadros e custo por passo). O arquivo **ainda não
   existe** (`98-divergences.md`, DIV-DP-01); 12 critérios do veredito de testes têm a metade humana `unverified` até esse
   registro. A rodada de teste do dono do produto que o domínio mantém como critério final (`DOMAIN.md`, 2026-10-21) é a H1.
2. **Validação de staging pelo validador** (`reports/deploy-validation/`), que confirma a execução 41101055606 e o `<hash>`
   servido.
3. **A decisão de promoção** (D-DP-06), entre as opções de *Promoção* abaixo — hoje nenhuma leva esta release a produção sem
   a decisão Esri.

Cumpridas: o commit da árvore verificada (`6b314b2`); o veredito de testes `SUCCESS` no seed rev 6; o build reproduzido
pelo pipeline em staging e servido em HTTPS com o mesmo `<hash>` do build local; o caminho B de reversão ensaiado neste site
em 2026-10-27 (`reports/deploy-validation/deploy-validation-20261027-1931.md`); o Node fixado (`.nvmrc` = `24`); os dois
repositórios configurados (D23); a decisão de monitoramento (vigilância manual, nenhum monitor externo), mantida.

## Promoção — a árvore contém a Kart Park

Todo commit de `master` a partir de `ba221ad` contém a Kart Park, e a decisão de `pista-kart-park` (ADR-0005; seu
`runbook.md`, *Promoção bloqueada*) é que nenhum artefato construído de um commit que a contenha vai a produção antes da
decisão Esri do dono do produto. `6b314b2` está nesse caso. As opções, como na rodada anterior e no registro daquela feature;
**a escolha é do dono do produto**:

| Opção | O que leva a produção | O que vale para esta release |
|---|---|---|
| **1 — esperar a decisão Esri** e promover tudo junto | `race-lap-validation`, `dirigibilidade` (acerto C, sem drift), `modelo-kart-01` e a Kart Park de uma vez, de um commit de `master` igual ou posterior a `6b314b2` | é a única que entrega **esta** release; até lá produção continua sem nada publicado. As portas humanas (H1–H5) fecham em staging sobre este bundle |
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
`6b314b2`** (a árvore de trabalho pode trazer edições de outra feature):

| Passo | Comando | Resultado esperado |
|---|---|---|
| 1 | `npm ci` | saída 0; `package-lock.json` inalterado |
| 2 | `npm test` | saída 0; **443** aprovados, 0 reprovados, 0 pulados (65 `CHK-TEST-*` desta feature) |
| 3 | `npm run build` (no workflow, `-- --base=/kartle/` ou `/kartle-staging/`) | saída 0 (`tsc --noEmit` e depois `vite build`); `dist/index.html`, `dist/assets/index-BwruE9Pq.js`, `dist/assets/index-oR7KyBh_.css` |
| 4 | `python -I "600 Deploy/Output/race-lap-validation/tools/measure_dist.py" dist` | tabela de tamanhos; `within_limit=True`; saída 0 (ferramenta da release anterior, reutilizada por referência — é a que o workflow chama) |
| 5 | `python -I "600 Deploy/Output/dirigibilidade/tools/check_bundle.py" dist docs/physics.md` | `checks=25 failed=0`: v6 corrente com v4 anterior, v5 ausente do JS, elementos do HUD, `#lap-result-setup` ausente, HTML e CSS sem drift/turbo, dica `Dirigir`, toque com 4 controles, bloco `handling-baseline` com v4, Realista e v6 (datada) e a v5 mantida como registro |
| 6 | `npm run bench:handling` (opcional; só na máquina de referência conta para NFR-0002) | saída 0; 56 registros `PASS` (17 ensaios nos dois modos); `STEP_COST` ≤ 1,10 × a linha de base |
| 7 | `npm run preview` | `http://127.0.0.1:4173` serve o bundle; `#preset-label` mostra `ARCADE ASSISTIDO · TREINO LIVRE`; segurar Espaço numa volta não muda nada na tela nem na pilotagem |

### Medida real do artefato

| Arquivo | bytes (servido em staging) | gzip bytes (build local) |
|---|---:|---:|
| `assets/index-BwruE9Pq.js` | 694 094 | 183 262 |
| `assets/index-oR7KyBh_.css` | 10 800 | 3 040 |
| `index.html` | 6 583 | 2 610 |
| **total** | **711 477** | **188 912** |

- Limite de RNF02 (download inicial abaixo de 3 145 728 bytes): **711 477 bytes brutos (22,6 % do limite)**, igual ao
  `total_bytes` do passo *Measure dist* da execução 41101055606. O `index.html` do build local em Windows tem 6 619 bytes
  (fins de linha CRLF da árvore de trabalho); o JS e o CSS são idênticos.
- Contra a release validada anterior (`b86b200`, 598 028 bytes): +113 449 bytes, quase todos de outras features na mesma
  árvore (o modelo do Kart 01, a pista Kart Park embutida); a parte desta feature não é isolável no bundle. Contra a execução de staging anterior (`652bbaa`, 709 021 bytes): **+2 456 bytes**.
- O Vite avisa que o chunk principal passa de 500 kB minificado (Three.js); aviso de ferramenta, não violação de limiar.
- Os nomes dos *assets* carregam hash de conteúdo: o `index.html` publicado é o que aponta para a versão em vigor
  (`REL-0003`, regra de cache).

## O que o pipeline faz (`.github/workflows/pages.yml`)

Inalterado por esta feature. Em ordem, com saída observável na execução do Actions: checkout do commit → Node da `.nvmrc`
(24) com cache do npm → `npm ci` → `npm test` (443 aprovados) → `npm run build -- --base=/kartle/` (ou `/kartle-staging/`) →
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
