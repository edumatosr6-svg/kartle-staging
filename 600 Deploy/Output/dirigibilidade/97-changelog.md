---
title: Registro de mudanças — dirigibilidade do Arcade assistido (estágio de deploy)
feature: dirigibilidade
stage: deploy
status: validated
version: 2.0.0
sources: []
---

# Registro de mudanças

## 2026-10-27 — rodada 1, Modo A (nenhum registro de release existia)

**Entradas lidas** (lista fechada do estágio, §12): `400 Code/Output/dirigibilidade/01-implementation.md` 2.1.0 e
`98-divergences.md` 2.1.0; `500 Tests/Output/dirigibilidade/98-divergences.md` 1.0.0 e
`reports/test-validation/test-validation-20261027-1902.md` (`SUCCESS`, 237/237); `300 Specs/330 D-Specs/Output/dirigibilidade/test-strategy.md`
5.1.0, DM-0001, DES-0005, DES-0006, DES-0007 (*Feature flag*), DES-0008; `200 Requirements/230 Output/dirigibilidade/nfr/`
(NFR-0001 a NFR-0009); `600 Deploy/Input/domain-directives.md`; o registro validado da release anterior
(`600 Deploy/Output/race-lap-validation/`) como molde; `.github/workflows/pages.yml`, `.nvmrc`, `package.json`,
`index.html`, `src/handlingMessages.ts`, `src/physics.ts` (`PUBLISHED_SETUPS`), `src/main.ts` (só as linhas do acerto, do
resultado e do compartilhar), `docs/physics.md` (cabeçalho da seção datada). O `.git/refs/heads/master` foi lido como
arquivo para obter o hash completo da ponta; nenhum comando `git` foi executado.

**Fatos apurados** (sem executar nada no GitHub além de dois GET de leitura à URL de staging): a ponta de `master` é
`b86b200d14f950baa1a902f56b6f6fbfff5082ba`; o `dist/` local de 2026-10-27 13:27 tem `index-BiFxJ0FY.js` (579 462 bytes),
`index-dgojskay.css` (11 407) e `index.html` (7 159), total 598 028 bytes (154 400 gzip), `within_limit=True`;
`https://edumatosr6-svg.github.io/kartle-staging/` responde 200 em HTTPS com `Cache-Control: max-age=600`,
`Last-Modified` 2026-10-27 19:11:49 GMT, e serve o mesmo `index-BiFxJ0FY.js` com os mesmos 579 462 bytes;
`docs/handling-device-log.md` **não existe**.

**O que foi escrito**

- `01-release.md`: o que é entregue (acerto v5 como dado publicado, `setupId`/`setupVersion` no resultado e no texto
  compartilhado, HUD, registros, linha de base), a proveniência (`b86b200`, veredito 237/237, build local e staging com o
  mesmo `<hash>`, produção nunca promovida), as três precondições humanas que restam, a reprodução do build com as
  ferramentas desta release e a medida real do artefato (+4 772 bytes contra a release anterior).
- `REL-0001-config.md` (nenhuma variável; o acerto versionado é dado em código, não configuração),
  `REL-0002-migration.md` (acerto v4 → v5 como padrão; leitores de registro antigo e replay versão 1; sem backfill;
  nada persistido; regra "uma `setupVersion` nunca é editada no lugar"), `REL-0003-rollout.md` (passo único; o caminho B
  passa a existir em staging; política de ramos recriada a cada despublicação; riscos desta release),
  `REL-0004-mobile.md` (sem app nativo; paridade, HUD, Web Share, fps e custo por passo como linhas H),
  `REL-0005-observability.md` (nada sai do navegador; `console.warn` só com códigos; métricas por requisito; vigilância
  manual mantida; modos de falha novos).
- `smoke.md`: **21 verificações** — 12 em `web-desktop` (D1–D12) e 9 em `web-mobile` (M1–M9), cada uma com o limiar
  observado (RNF01, RNF02, RNF03, RNF06, NFR-0002, NFR-0003, NFR-0004, NFR-0005, NFR-0007, NFR-0008, NFR-0009, RULE-0003,
  AC-US-0004-06, AC-US-0005-05); subconjunto de produção; `check_served.py` como preparação comum.
- `runbook.md`: precondições (11), promover (11 passos), verificar (8), **linhas humanas H1–H5** (HUD por quadro,
  resultado e compartilhar no aparelho, inclinação no celular, taxa de quadros, custo por passo — o smoke de aparelho que
  o dono do produto executa e registra em `docs/handling-device-log.md`), reverter (5), gatilhos de reversão e ponto sem
  retorno; rollback com o `<sha-anterior>`/`<hash-anterior>` e a reexecução no Pages (caminho B em staging, A em produção).
- `tools/check_bundle.py` (20 verificações sobre `dist/` e o bloco `handling-baseline`; executado: 20/20) e
  `tools/check_served.py` (18 verificações sobre a página servida, dois GET de leitura; executado contra staging: 18/18).
  `measure_dist.py` da release anterior reutilizado por referência (é o que o workflow chama).
- `98-divergences.md`: 12 linhas — 4 `open` (DIV-DP-01 log de aparelho inexistente e H1–H5 por executar; DIV-DP-03
  caminho B nunca reexecutado; DIV-DP-05 `check_bundle.py` fora do workflow, `info`; DIV-DP-07 RNF01/RNF03 não medidos),
  5 `resolved`, 3 `waived` herdadas das decisões de 2026-10-21. `00-index.md` emitido por `lint_artifacts.py --emit`.
- Nada foi executado contra produção; nenhum push, nenhuma reexecução, nenhuma chamada à API do GitHub; nenhum valor de
  segredo escrito; `.github/`, `src/`, `tests/`, `docs/` e as pastas de outras features não foram tocados (§14).

**Itens fechados**: nenhum relatório anterior.

**Itens que ficam abertos, com o que os fecha**: DIV-DP-01 (dono do produto: criar o log e registrar H1–H5 em staging);
DIV-DP-03 (validador ou dono do produto: reexecutar 39631099098 e depois a execução de `b86b200`, com `check_served`);
DIV-DP-05 (decisão do dono do produto; `info`); DIV-DP-07 (junta-se à DIV-DP-01).

**Itens recusados**: nenhum.

## 2026-10-30 — rodada 2, Modo B (registro atualizado para o build validado do seed rev 6)

**Gatilho**: o registro validado descrevia `b86b200` (acerto v5, com drift e turbo). A staging serve agora `6b314b2`
(execução 41101055606), que leva o seed rev 6 desta feature: acerto `arcade-assistido-v6` (acerto C), drift e turbo fora da
simulação e de todas as telas; código validado (rodada 6, `code-validation-20261030-1613.md`) e testes validados
(`test-validation-20261030-1638.md`).

**Entradas lidas** (lista fechada do estágio, §12): os dois relatórios acima; `500 Tests/Output/dirigibilidade/98-divergences.md`;
`400 Code/Output/dirigibilidade/01-implementation.md` 3.1.0; `300 Specs/330 D-Specs/Output/dirigibilidade/` (DES-0005, DES-0006,
DES-0007, DES-0009, ADR-0006, `test-strategy.md`, títulos); `200 Requirements/220 Input/dirigibilidade/SEED.md` rev 6 e `DOMAIN.md`
(decisões de 2026-10-29 e 2026-10-30); `src/physics.ts` (`PUBLISHED_SETUPS`), `src/handlingMessages.ts`, `src/main.ts` (só as
linhas do resultado, do treino e do encerrar), `index.html`, `docs/physics.md` (seção v6 e bloco `handling-baseline`); o
registro de `pista-kart-park` (01-release, runbook, *Promoção bloqueada*) só para as opções de promoção; o relatório de validação
de deploy de 2026-10-27.

**Fatos apurados** (nenhum comando contra produção; em staging só leituras): `gh run view` das execuções 41101055606 (`6b314b2`,
`success`) e 41076989728 (`652bbaa`, `success`), com o log reduzido às linhas de contagem e de *assets* (443/443 e 393/393;
`index-BwruE9Pq.js` e `index-dD_vz2Ev.js`; `total_bytes` 711 477 e 709 021); dois GET à URL de staging (200, `max-age=600`,
`Last-Modified` 17:48:06 GMT, `index-BwruE9Pq.js` 694 094 bytes; HTML sem drift/turbo/Espaço/combo; JS com v6 corrente e v4
anterior, sem v5); build local da árvore (igual a `6b314b2`) para um diretório temporário com o mesmo `<hash>`; `npm test`
local 443/443 (JUnit reduzido a contagens); `git show` de `652bbaa` e `6ea3862` (`index.html` de ambos com "Drift", "Espaço" e
`data-control="drift"`; `6ea3862` com `arcade-assistido-v5`); `git merge-base` (a Kart Park, `ba221ad`, está em `652bbaa` e em
`6b314b2`, não em `6ea3862`); `.git/refs/remotes/origin/master` = `05c3570`; `docs/handling-device-log.md` continua inexistente.

**O que mudou**

| Artefato | Mudança |
|---|---|
| `01-release.md` 2.0.0 | v6 e retirada do drift no que é entregue; proveniência para `6b314b2`, execução 41101055606, 443/443, build local e servido com `BwruE9Pq`; medida 711 477 bytes; alvo de reversão 41076989728 (`652bbaa`); nova seção *Promoção* com as duas opções e a constatação de que o "acerto C sem Kart Park" não existe como commit; limitação do compartilhar |
| `REL-0001` 2.0.0 | acerto publicado v6; a retirada do drift não é configuração |
| `REL-0002` 2.0.0 | esquemas e revisões do v6: acerto, drift fora do passo, drift fora das telas, leitores inalterados; linha de base com quatro entradas (v5 como registro) |
| `REL-0003` 2.0.0 | ordem com a decisão de promoção entre opções; estado de staging de 2026-10-30; etapas do pipeline com 443 e `BwruE9Pq`; riscos novos (promover a Kart Park por engano, promover `6ea3862` julgando que leva esta release, drift de volta numa tela) |
| `REL-0004` 2.0.0 | controle de toque sem drift; linhas H renumeradas; custo por passo e tamanho do v6 |
| `REL-0005` 2.0.0 | métricas de US-2 e US-3; registro de implantações com 41101055606, 41076989728 e 40566728590; modos de falha do v6 |
| `smoke.md` 2.0.0 | **21 → 24 verificações**: D1–D14 e M1–M10. D4/M4 sem drift na tela inicial e na barra; D7 tecla de drift sem efeito e velocidade 65–72 km/h (nova); D8 resultado do treino sem a versão do acerto (era D7, resultado com `#lap-result-setup`); D13 grampo (nova); M7 controle de toque sem "Drift" (nova); o compartilhar (D8 e M7 antigas) migra para D14 e M10, com o texto sem a versão do acerto e marcado não executável neste bundle (DIV-DP-13) |
| `runbook.md` 2.0.0 | `<sha>`, `<hash>`, execução e alvo de reversão novos; precondição da decisão Esri; seção *Decisão de promoção*; **H1–H5 refeitas** para o v6 sem drift: H1 sensação do acerto C (a rodada de teste do dono do produto, com a paridade da inclinação), H2 raio nos grampos, H3 tecla de drift sem efeito e nenhuma tela de drift, H4 HUD por quadro e resultado, H5 taxa de quadros e custo por passo; durações do caminho B ensaiadas |
| `tools/check_served.py` | 18 → **22 verificações**: retira `#lap-result-setup` e o v5 como presentes; acrescenta `#lap-result-setup` ausente, HTML sem drift/turbo/impulso/combo/Espaço, sem guia de manobras, dica `Dirigir`, controle de toque com quatro controles, v6 corrente com v4 anterior, v5 ausente. Executado contra staging: 22/22 |
| `tools/check_bundle.py` | 20 → **25 verificações**: as mesmas mudanças sobre `dist/` (HTML e CSS), e o bloco `handling-baseline` com v4, Realista e v6 datada e a v5 mantida. Executado sobre o build local: 25/25 |
| `98-divergences.md` 2.0.0 | DIV-DP-01 com os 12 critérios do rev 6; DIV-DP-02 e DIV-DP-04 resolvidas para `6b314b2`; DIV-DP-03 resolved com o ensaio de 2026-10-27 (ISSUE-04 da validação); DIV-DP-11 passa à feature da Kart Park; novas DIV-DP-13 (compartilhar inalcançável) e DIV-DP-14 (produção bloqueada pela decisão Esri) |

**Itens fechados**: ISSUE-04 da validação de 2026-10-27 (DIV-DP-03 marcada `resolved` e durações do caminho B no `runbook.md`);
ISSUE-02 (o passo 4 do runbook e a reprodução do build pedem árvore limpa de `<sha>`); ISSUE-03 (o passo 10 nomeia a
39827702391 como execução a não aprovar).

**Itens que ficam abertos**: ISSUE-01 da validação (porta humana) continua, como DIV-DP-01 e DIV-DP-07, agora com as H1–H5 do v6.

**Itens recusados**: nenhum. **Remoções de verificação** (§17): nenhuma. Migrações: as verificações de `check_served.py` e
`check_bundle.py` que exigiam `#lap-result-setup` e `arcade-assistido-v5` presentes passam a exigir a sua ausência, porque o
seed rev 6 (decisões do dono do produto de 2026-10-29/30) tirou a versão do acerto da tela e substituiu o v5 pelo v6; a
verificação dos três identificadores passa a verificar a versão corrente (v6) com a anterior declarada (v4); as linhas de
smoke do compartilhar migram para D14/M10, não executáveis neste bundle (DIV-DP-13), em vez de desaparecer. As antigas
H1–H5 migram: HUD por quadro e resultado → H4; inclinação → H1 (celular); taxa de quadros e custo por passo → H5; resultado
e compartilhar no aparelho → H4 (resultado) e DIV-DP-13 (compartilhar).

**Nada foi executado contra produção**; nenhum push, nenhuma reexecução, nenhuma aprovação; nenhum valor de segredo escrito;
`.github/`, `src/`, `tests/`, `docs/` e as pastas de outras features não foram tocados (§14).
