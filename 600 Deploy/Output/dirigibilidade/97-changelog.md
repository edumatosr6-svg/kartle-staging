---
title: Registro de mudanças — dirigibilidade do Arcade assistido (estágio de deploy)
feature: dirigibilidade
stage: deploy
status: validated
version: 1.0.0
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
