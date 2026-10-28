---
title: Registro de mudanças — pista Kart Park (estágio de deploy)
feature: pista-kart-park
stage: deploy
status: validated
version: 1.0.0
sources: []
---

# Registro de mudanças

## 2026-10-27 — rodada 1, Modo A (nenhum registro de release existia)

**Entradas lidas** (lista fechada do estágio, §12): `400 Code/Output/pista-kart-park/01-implementation.md` 1.2.0 e
`98-divergences.md` (linhas 2 e 13); `500 Tests/Output/pista-kart-park/98-divergences.md` 1.0.0 e
`reports/test-validation/test-validation-20261027-2333.md` (`SUCCESS`, 398/398, 22 divergências); `300 Specs/330 D-Specs/Output/
pista-kart-park/test-strategy.md` (roteiro E2E-01 a E2E-08 e a tabela de critérios), ADR-0005 (sem chave; promoção bloqueada),
DES-0011 (verificações, registro, `promote`), DES-0012 (privacidade, rede, crédito, licença), DES-0010 (regra de
`--esri-decision`), DM-0002 (registro); `200 Requirements/230 Output/pista-kart-park/nfr/` (NFR-0001 a NFR-0012, títulos; NFR-0001,
NFR-0002, NFR-0004, NFR-0005, NFR-0012 por inteiro); `200 Requirements/220 Input/pista-kart-park/DOMAIN.md` (decisões de
2026-10-22: licença, crédito, ponto Esri) e `SEED.md` (origem do traçado: caminho OSM e bordas em imagem Esri World Imagery);
`600 Deploy/Input/domain-directives.md`; o registro validado da release anterior (`600 Deploy/Output/modelo-kart-01/`, incluindo
`reports/deploy-validation/deploy-validation-20261027-2057.md` para o número da execução 40579585592 e o ensaio de reversão) como
molde; `.github/workflows/pages.yml`, `.nvmrc`, `package.json` (scripts), `tracks/registry.json`, `index.html` (ids),
`src/trainingSession.ts:9-16`, `src/lapMessages.ts:80-93`, `src/curbFeedback.ts:5-9`, `src/audio.ts:8`, `src/main.ts` (linhas
do crédito, do seletor, do `vibrate` e da abertura), `scripts/track-pipeline.ts` (linhas de `promote` e de `--esri-decision`),
`docs/kart-01/device-log.md` (cabeçalhos, como molde do registro a criar). `.git/refs/heads/master`,
`.git/refs/remotes/staging/staging`, `.git/refs/remotes/origin/master` e `.git/logs/HEAD` foram lidos como arquivos para obter os
hashes e os horários; nenhum comando `git` foi executado. O JS de `dist/` foi sondado por contagens de marcadores (nunca corpos)
e o arquivo de pista nele embutido foi extraído por um decodificador JSON e comparado por SHA-256 com o registro.

**Fatos apurados** (sem executar nada no GitHub além de GET de leitura às duas URLs): a ponta de `master` é
`d9139a21f833e4e2ee72a6d9b58322ce77ae4564` (23:39:01Z) e o remoto `staging` aponta para o mesmo hash (push às 23:39:04Z);
`origin/master` continua em `05c3570` (nada desta nem das duas releases anteriores foi enviado a produção; a URL de produção
responde 404); o `dist/` local de 23:24:33Z tem `index-DYFBop8t.js` (694 056 bytes), `index-Dv0Dz75T.css` (11 890) e
`index.html` (7 375), total 713 321 bytes (189 855 gzip), `within_limit=True`, o mesmo `<hash>` que o manifesto de código nomeia
para a rodada 3; o arquivo da Kart Park está no JS **uma vez**, como literal de 43 012 bytes (o arquivo tem 43 013 com o `\n`
final) cujo SHA-256 com o `\n` é exatamente o registrado em `tracks/registry.json` (`04ce5e51…`, `STAGING`); o JS não contém
`esri`, `41.45`, `41,45`, `41450`, `KARTPLAN`, `recorde`, `Circuito Aurora`, `helmet` nem `boxGeo`; às 23:46Z
`https://edumatosr6-svg.github.io/kartle-staging/` ainda servia `index-D0RarhFV.js` (`Last-Modified` 20:37:38Z) — a execução do
push de `d9139a2` estava em curso ou o cache de borda ainda não tinha trocado; `docs/kart-park-device-log.md` não existe;
`docs/kart-01/device-log.md` continua "Não executadas" e `docs/handling-device-log.md` continua a não existir.

**O que foi escrito**

- `01-release.md`: o que é entregue (Kart Park esquema 3 no bundle, seletor, crédito, zebra, barreira; nenhuma mudança nos
  presets nem no contrato de passo), **o que não é entregue** (produção, pela decisão Esri), a proveniência (`d9139a2`, veredito
  398/398, build local medido e conferido, staging em curso, produção 404 com `origin/master` em `05c3570`), as quatro
  precondições humanas que restam, a reprodução do build com as ferramentas desta release e a medida real do artefato
  (+63 403 bytes contra a release anterior, 22,7 % do limite; o literal da pista com 43 012 bytes).
- `REL-0001-config.md` (nenhuma variável; o catálogo, o crédito e as constantes da zebra são dado em código; `--esri-decision` é
  referência a uma decisão, não segredo), `REL-0002-migration.md` (esquema 3 com o leitor do 2 mantido; nada persistido muda;
  versão publicada imutável; a "revisão 3" — `promote` — não faz parte desta release), `REL-0003-rollout.md` (sequência que
  para em staging; o passo de produção descrito como o que não fazer; alvo B em staging = 40579585592; riscos, inclusive a
  promoção indevida), `REL-0004-mobile.md` (sem app nativo; vibração de 20 ms a cada 0,25 s, navegador sem `navigator.vibrate`,
  inclinação negada, 30 fps nas duas orientações), `REL-0005-observability.md` (nada sai do navegador; `console.warn('track-data')`
  único registro; métricas por requisito, inclusive a prova verificável de "não promovido" — o registro sem `PRODUCTION` e
  `check_served.py` a reprovar em produção; modos de falha novos, a começar pela promoção sem decisão).
- `smoke.md`: **30 verificações** — 18 em `web-desktop` (D1–D18) e 12 em `web-mobile` (M1–M12), cada uma com o limiar observado
  (NFR-0001, NFR-0002, NFR-0004, NFR-0005, NFR-0006, NFR-0008, NFR-0010, NFR-0012, RNF01, RNF02, RNF06, D-DP-04, DES-0012 e os
  critérios AC-US-0001-01/-02/-05, AC-US-0002-08, AC-US-0003-06/-11, AC-US-0004-04/-06, AC-US-0005-03/-07..-12,
  AC-US-0006-01..09, REQ-FEAT-0001-13, REQ-FEAT-0003-15, REQ-FEAT-0005-16..19, REQ-FEAT-0006-12, mais a regressão da
  sintética); a seção *Verificação em produção* declarada **não aplicável** nesta release; `check_served.py` como preparação comum.
- `runbook.md`: precondições (16; 4 por marcar: validação de staging, registro em tela H1–H8, **decisão Esri registrada**,
  portas humanas das releases contidas), promover **até staging** (11 passos; o 11 é "parar"), a lista do que **não fazer**, a
  seção *Promoção bloqueada* (por quê; a evidência que a decisão exige — termos de uso da Esri para dado derivado do World
  Imagery, a permissão de traçado no OSM e o seu alcance, a proveniência do arquivo de origem, o texto de crédito; os três
  desfechos; e as **duas opções** para `dirigibilidade` e o Kart 01 chegarem a produção entretanto: esperar, ou
  `git push origin 6ea3862:master` sem `--force` e aprovar aquela execução, mantendo `origin/master` em `6ea3862`), verificar (13),
  **linhas humanas H1–H8** (seletor/abertura/crédito/armazenamento; troca de pista; volta completa com desenho, corte, barreira,
  foco, recarga e 60 fps; som da zebra em Chrome e Firefox; celular com inclinação negada, vibração, 30 fps e resultado;
  navegador sem vibração e download; rede bloqueada; navegador em inglês — roteiros E2E-01 a E2E-08, 22 linhas do veredito de
  testes; registradas em `docs/kart-park-device-log.md`, **que o dono do produto cria**), reverter (5), gatilhos de reversão em
  staging e o gatilho em produção (qualquer aprovação com a feature), ponto sem retorno.
- `tools/check_bundle.py` (83 verificações sobre `dist/` e `tracks/registry.json`: um JS e um CSS e nada mais; o arquivo da Kart
  Park uma vez no JS, JSON legível, SHA-256 + LF e bytes iguais ao registro, estado `STAGING`, chaves de DM-0001, 684/38/34/3/1
  (382), abaixo de 200 000 bytes; textos do seletor e do crédito; `vibrate(20)`, `lowpassHz:160`, fonte `noise`,
  `curbWheelCount`, `barrierContact`/`barrierTouching`; malhas; nenhum `esri`/`41.45`/`41,45`/`41450`/`KARTPLAN`/`recorde`/
  `Circuito Aurora`/`helmet`/`boxGeo`/`XMLHttpRequest`/`sendBeacon`; releases anteriores; elementos do HTML; classes do CSS;
  armazenamento e `fetch(` como `warn`; tamanhos; opcionalmente o registro em tela — executado: **83/83**, 1 `warn`) e
  `tools/check_served.py` (74 verificações sobre a página servida, três GET de leitura; executado contra staging às 23:46Z:
  `65 checks, 28 failed` sobre o bundle anterior ainda servido — as 28 linhas da Kart Park, como esperado — e a ferramenta de
  `modelo-kart-01` 37/37 sobre o mesmo; esperado 74/74 quando a execução de `d9139a2` publicar). Copiados e adaptados dos da
  `modelo-kart-01`; `measure_dist.py` da primeira release reutilizado por referência (é o que o workflow chama).
- `98-divergences.md`: 15 linhas — 7 `open` (DIV-DP-01 registro em tela por criar e preencher, H1–H8; DIV-DP-03 caminho B não
  repetido para este par; DIV-DP-04 execução de staging de `d9139a2` por confirmar; DIV-DP-05 `check_bundle.py` fora do workflow,
  `info`; DIV-DP-07 RNF01 e NFR-0002 não medidos; DIV-DP-12 portas humanas das releases contidas; DIV-DP-15 caminho das
  releases contidas a produção), 1 **`blocked`** (DIV-DP-14 promoção bloqueada pela decisão Esri), 4 `resolved` (inclusive
  DIV-DP-11: o crédito OSM/ODbL passa a exigido e está no bundle), 3 `waived` herdadas das decisões de 2026-10-21. `00-index.md`
  emitido por `lint_artifacts.py --emit` (gate: 0 erros, 0 avisos sobre 10 arquivos).
- Nada foi executado contra produção; nenhum push, nenhuma reexecução, nenhuma chamada à API do GitHub; nenhum valor de
  segredo escrito; `.github/`, `src/`, `scripts/`, `tests/`, `tracks/`, `docs/` e as pastas de outras features não foram tocados
  (§14). `docs/kart-park-device-log.md` **não** foi criado: é nomeado para o dono do produto.

**Itens fechados**: nenhum relatório anterior.

**Itens que ficam abertos, com o que os fecha**: DIV-DP-01 (dono do produto: criar `docs/kart-park-device-log.md` e registrar
H1–H8 em staging); DIV-DP-03 (validador ou dono do produto: reexecutar 40579585592 e depois a execução de `d9139a2`, com
`check_served`); DIV-DP-04 (validador: confirmar a execução de `d9139a2` em staging e 74/74); DIV-DP-05 (decisão do dono do
produto; `info`); DIV-DP-07 (junta-se à DIV-DP-01); DIV-DP-12 (decisão do dono do produto: fechar as portas humanas das três
releases sobre este bundle com "Pista sintética", ou medi-las isoladas reexecutando 40579585592); DIV-DP-14 (dono do produto: a
decisão Esri em `DOMAIN.md`); DIV-DP-15 (dono do produto: opção 1 ou 2 para `dirigibilidade` e o Kart 01).

**Itens recusados**: nenhum.
