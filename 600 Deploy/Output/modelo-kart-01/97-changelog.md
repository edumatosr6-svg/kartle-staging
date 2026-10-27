---
title: Registro de mudanças — modelo Kart 01 e câmera de jogo (estágio de deploy)
feature: modelo-kart-01
stage: deploy
status: validated
version: 1.0.0
sources: []
---

# Registro de mudanças

## 2026-10-27 — rodada 1, Modo A (nenhum registro de release existia)

**Entradas lidas** (lista fechada do estágio, §12): `400 Code/Output/modelo-kart-01/01-implementation.md` 1.1.0 e
`98-divergences.md` (linhas 7–9, 15, 19, 20); `500 Tests/Output/modelo-kart-01/98-divergences.md` 1.0.0 e
`reports/test-validation/test-validation-20261027-2028.md` (`SUCCESS`, 296/296, 22 divergências);
`300 Specs/330 D-Specs/Output/modelo-kart-01/test-strategy.md` (roteiros E2E-01 a E2E-06 e a tabela de critérios), DM-0001
(seção 2, registro em tela), DES-0003 (constantes da câmera), DES-0007 (lista de rede e armazenamento; `console.warn`), ADR-0003
(sem chave; reversão pelo repositório); `200 Requirements/230 Output/modelo-kart-01/nfr/` (NFR-0001 a NFR-0007, títulos);
`600 Deploy/Input/domain-directives.md`; o registro validado da release anterior (`600 Deploy/Output/dirigibilidade/`, incluindo
`reports/deploy-validation/deploy-validation-20261027-1931.md` para os números de execução e o ensaio de reversão) como molde;
`.github/workflows/pages.yml`, `.nvmrc`, `package.json` (scripts), `index.html` (ids), `src/gameCamera.ts:40-60`,
`src/kart01Model.ts:12-31`, `src/kart01Decals.ts` (linhas do `fillText`), `docs/kart-01/device-log.md`. `.git/refs/heads/master`
e `.git/refs/remotes/staging/staging` foram lidos como arquivos para obter o hash da ponta e confirmar o push a staging; nenhum
comando `git` foi executado. O JS de `dist/` foi sondado por `grep` de marcadores (contagens, não corpos) para saber o que a
minificação preserva.

**Fatos apurados** (sem executar nada no GitHub além de três GET de leitura à URL de staging, por `check_served.py`): a ponta de
`master` é `6ea3862c74603886e3af421da3f542220980293f` e o remoto `staging` aponta para o mesmo hash; o `dist/` local de
2026-10-27 19:26:48Z tem `index-D0RarhFV.js` (631 352 bytes), `index-dgojskay.css` (11 407) e `index.html` (7 159), total
649 918 bytes (171 137 gzip), `within_limit=True`; `https://edumatosr6-svg.github.io/kartle-staging/` responde 200 em HTTPS com
`Cache-Control: max-age=600`, `Last-Modified` 2026-10-27 20:37:38 GMT, e serve o mesmo `index-D0RarhFV.js` com os mesmos
631 352 bytes (a execução do push de `6ea3862` já tinha concluído quando a rodada começou); `docs/kart-01/device-log.md` existe
com a execução 1 (navegador embutido, parcial, sem fps) e a seção de aparelhos de referência "Não executadas";
`docs/handling-device-log.md` (da `dirigibilidade`) continua a não existir.

**O que foi escrito**

- `01-release.md`: o que é entregue (Kart 01 com 27 chamadas e 5 128 triângulos, câmera de jogo 1,38 / 3,05 / 62°, estado de
  exibição, efeitos re-ancorados, nenhuma mudança de física), a proveniência (`6ea3862`, veredito 296/296, build local e
  staging com o mesmo `<hash>` e tamanho, produção nunca promovida), as três precondições humanas que restam, a reprodução do
  build com as ferramentas desta release e a medida real do artefato (+51 890 bytes contra a release anterior, 20,7 % do limite).
- `REL-0001-config.md` (nenhuma variável; as constantes do kart e da câmera são dado em código, proibida qualquer chave por
  ADR-0003), `REL-0002-migration.md` (nenhum formato publicado ou persistido muda; a linha de base `schemaVersion` 1 fica no
  repositório; reversão = republicar o bundle anterior), `REL-0003-rollout.md` (passo único; alvo B em staging = 40566728590,
  já ensaiado; riscos desta release, inclusive o de staging ter trocado de bundle com as linhas humanas da `dirigibilidade`
  por executar), `REL-0004-mobile.md` (sem app nativo; forma da área de jogo por quadro, retrato, giro, fps 30 nas duas
  orientações), `REL-0005-observability.md` (nada sai do navegador; `console.warn` `kart01-decals`/`NO_2D_CONTEXT` único registro
  novo; métricas por requisito; vigilância manual mantida; modos de falha novos).
- `smoke.md`: **27 verificações** — 16 em `web-desktop` (D1–D16) e 11 em `web-mobile` (M1–M11), cada uma com o limiar observado
  (NFR-0001, NFR-0002, NFR-0003, NFR-0006, RNF01, RNF02, RNF06, DES-0007 e os critérios AC-US-0001-14..16, AC-US-0002-01..06,
  AC-US-0003-08..13, AC-US-0004-01..02, AC-US-0005-01..03, mais a regressão de `setupVersion`); subconjunto de produção;
  `check_served.py` como preparação comum.
- `runbook.md`: precondições (13; 3 por marcar: validação de staging, registro H1–H6 nos aparelhos, portas humanas das releases
  contidas), promover (11 passos), verificar (8), **linhas humanas H1–H6** (Kart 01 em toda exibição com visão geral e descida;
  placa `01`, piloto, sombra, câmera atrás e perto, fim da volta; rodas esterçam e giram, volante, pausa, reposicionamento; sem
  corte na curva de 90° a 50 km/h e retrato; marcas e fumaça; fps 60/30 e download — o smoke de aparelho que o dono do produto
  executa e registra em `docs/kart-01/device-log.md`, roteiros E2E-01 a E2E-06, 22 linhas `unverified` do veredito de testes),
  reverter (5), gatilhos de reversão e ponto sem retorno; rollback com o `<sha-anterior>`/`<hash-anterior>` e a reexecução no
  Pages (caminho B em staging, ensaiado; A em produção; C pelo repositório).
- `tools/check_bundle.py` (45 verificações sobre `dist/` e o registro em tela: um JS e um CSS e nada mais; marcadores do Kart 01,
  número `01`, constantes de câmera e modos de câmera que a minificação preserva; `helmet`/`boxGeo` ausentes; identificadores
  das releases anteriores; elementos do HTML; tamanhos; executado: 45/45) e `tools/check_served.py` (37 verificações sobre a
  página servida, três GET de leitura; executado contra staging: 37/37). Copiados e adaptados dos da `dirigibilidade`;
  `measure_dist.py` da primeira release reutilizado por referência (é o que o workflow chama).
- `98-divergences.md`: 13 linhas — 4 `open` (DIV-DP-01 execuções nos aparelhos de referência por registrar, H1–H6; DIV-DP-03
  caminho B não repetido para este par de execuções; DIV-DP-05 `check_bundle.py` fora do workflow, `info`; DIV-DP-07 RNF01 e
  NFR-0001 não medidos para este bundle), 1 `open` por decisão (DIV-DP-12 staging serve este bundle com as portas humanas das
  releases contidas por fechar), 5 `resolved`, 3 `waived` herdadas das decisões de 2026-10-21. `00-index.md` emitido por
  `lint_artifacts.py --emit`.
- Nada foi executado contra produção; nenhum push, nenhuma reexecução, nenhuma chamada à API do GitHub; nenhum valor de
  segredo escrito; `.github/`, `src/`, `tests/`, `docs/` e as pastas de outras features não foram tocados (§14).

**Itens fechados**: nenhum relatório anterior.

**Itens que ficam abertos, com o que os fecha**: DIV-DP-01 (dono do produto: registrar H1–H6 em staging nos aparelhos nomeados,
três entradas no device log); DIV-DP-03 (validador ou dono do produto: reexecutar 40566728590 e depois a execução de `6ea3862`,
com `check_served`); DIV-DP-05 (decisão do dono do produto; `info`); DIV-DP-07 (junta-se à DIV-DP-01); DIV-DP-12 (decisão do
dono do produto: fechar as portas humanas das três releases na mesma sessão sobre este bundle, ou medir a `dirigibilidade`
isolada reexecutando 40566728590).

**Itens recusados**: nenhum.
