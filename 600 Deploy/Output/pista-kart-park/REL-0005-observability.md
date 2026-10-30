---
id: REL-0005
title: Observabilidade — o que a release registra, o que se mede, qual alerta soaria e como se vê a promoção indevida
feature: pista-kart-park
stage: deploy
status: draft
version: 1.1.0
sources: [ADR-0007, DES-0003, DES-0007, DES-0009, DES-0011, DES-0012, DM-0002, ADR-0005, NFR-0001, NFR-0002, NFR-0003, NFR-0004, NFR-0005, NFR-0006, NFR-0007, NFR-0008, NFR-0010, NFR-0012, TEST-0001, TEST-0008, TEST-0009, TEST-0011, TEST-0012]
---

# REL-0005 — Observabilidade

## O que a release acrescenta aos registros do cliente

**Nada que saia do navegador.** A feature não envia telemetria, não chama rede e não grava no navegador (DES-0012;
CHK-TEST-0011-02). O que existe de observável no cliente é a própria tela — o seletor, o crédito, a Kart Park desenhada, a
vibração, o som, o resultado — e o console do navegador, onde o único registro desta feature é `console.warn('track-data', …)`
com **códigos apenas** (`UNREADABLE`, `UNSUPPORTED_SCHEMA`, `INCOMPLETE`), emitido quando o arquivo de pista não é legível —
situação que não ocorre com o arquivo empacotado válido (CHK-TEST-0012-01). Nenhum campo de jogador, aparelho, posição, idioma
ou sensor sai do processo; a saída de `npm run track` carrega identificadores, códigos e medidas, nunca o conteúdo do arquivo
(DES-0011). A decisão de monitoramento das releases anteriores é mantida: **vigilância manual conforme o runbook, nenhum monitor
externo, nenhum envio de telemetria** (decisão *Monitoramento* de 2026-10-21; RNF12).

## O que se mede, por requisito, e onde

| Requisito | Métrica | Onde se obtém | Limiar que indica falha |
|---|---|---|---|
| NFR-0001 tamanho do arquivo da pista | bytes do literal da Kart Park no JS | `check_bundle.py` / `check_served.py` (43 012 bytes no bundle; 43 013 no arquivo) | 200 000 bytes ou mais |
| NFR-0006 versão imutável | SHA-256 do literal + LF contra `tracks/registry.json` | `check_bundle.py` (local) e `check_served.py` (servido): `04ce5e51…` | qualquer diferença; ou uma entrada do registro reescrita com outro resumo (CHK-TEST-0012-01/-02 no workflow) |
| NFR-0012 publicação condicionada à licença | estado da entrada `kart-park` 1 no registro; execuções de produção aprovadas | `tracks/registry.json` (`STAGING` hoje; `check_bundle.py` avisa se não for `STAGING`); aba Actions de `edumatosr6-svg/kartle` (nenhuma aprovação); `check_served.py` sobre a URL de produção **deve reprovar** nas linhas da Kart Park enquanto não houver decisão (hoje: 404) | 1 execução aprovada em produção com commit que contenha a feature antes da decisão; ou `esri` no bundle sem decisão |
| NFR-0005 / D-DP-04 crédito visível | os três elementos do crédito no seletor e no painel do resultado de cada volta na Kart Park, nos dois canais | tela (H1 D4, H3 D9/D10, H5 M4/M10); `check_served.py` confirma os textos, o link, `#track-credit` e `#lap-training-result-credit` dentro de `#lap-training-result` sem nenhum `lap-result-credit` (ADR-0007) | um elemento ausente num dos dois lugares; sintética com crédito; **hoje (`6b314b2`) as 4 linhas de ADR-0007 reprovam** — DIV-DP-16 |
| AC-US-0001-01, -02, -05 seletor e abertura | as duas opções; Kart Park marcada ao abrir e ao recarregar; armazenamento vazio | tela (H1 D4/D8; H5 M4); `check_served.py` confirma o catálogo | abertura na sintética; opção a menos; chave gravada |
| AC-US-0002-08, AC-US-0005-03, AC-US-0004-06 desenho | asfalto com larguras do arquivo; zebras no lado declarado; barreira em todo o comprimento | tela (H3 D9; M12); `check_served.py` confirma as malhas `asphalt`/`curbs`/`barriers`/`start-line` | zebra do lado errado; barreira interrompida |
| AC-US-0004-04 barreira | o kart nunca termina um passo do outro lado | `npm test` (CHK-TEST-0004-02/-03: 0 cruzamentos de 5 a 200 m/s); a sensação na tela é H3 (D11) | 1 cruzamento |
| AC-US-0005-07, -08 vibração | pulso de 20 ms a cada 0,25 s só com roda na zebra | tela e mão (H4 M7); `check_served.py` confirma `vibrate(20)` | pulso fora da zebra ou na pausa; nenhum pulso no celular de referência com vibração |
| AC-US-0005-09..12 som | ruído grave repetido só com roda na zebra, distinto, nenhum com o som desligado | ouvido (H4 D12, Chrome e Firefox); `check_served.py` confirma `lowpassHz:160` e a fonte `noise` | som contínuo, fora da zebra, ou com o som desligado |
| AC-US-0006-07, -08, -09 nome, "687 m", nenhum recorde | o rótulo nas duas telas; nenhum `41,45` | tela (H1, H8); `check_served.py`: nome e `displayLengthM:687` presentes; `41.45`/`41,45`/`41450`/`KARTPLAN`/`recorde` ausentes | rótulo diferente; recorde em qualquer tela |
| NFR-0002 taxa de quadros | `fpsPerSecond` e `minFps` numa volta completa na Kart Park, por aparelho e orientação | `docs/kart-park-device-log.md` (H6; D14, M9) | `minFps` abaixo de 60 no notebook ou de 30 no celular |
| NFR-0004 sem servidor | requisições entre a escolha da pista e o fim da volta | painel de rede com a rede bloqueada (H7; D15, M11) | 1 requisição a outro serviço (a de `fonts.googleapis.com` no carregamento é aceita, DIV-DP-10) |
| NFR-0003, NFR-0007, NFR-0008 determinismo, regras na simulação, contrato de passo | `DETERMINISM` na Kart Park; regras sem a tela; presets/`STEP`/`Input` intactos; `bench:handling` 46/46 | `npm test` no workflow (443 aprovados) e os benches no manifesto de código — nada a observar na página servida | qualquer registro `FAIL`, que para o workflow antes do `deploy` |
| NFR-0010 dependências | arquivos em `dist/assets/` além de um JS e um CSS; `dependencies` de `package.json` | `check_bundle.py`; CHK-TEST-0011-* | qualquer *asset* novo (uma textura, um JSON servido à parte) ou dependência nova |
| RNF02 tamanho | bytes de `dist/` no build; bytes comprimidos transferidos na primeira visita | `measure_dist.py` no workflow (711 477; 188 682 gzip); lista de transferências (D3, M3) | 3 145 728 bytes ou mais |
| RNF01 carregamento | tempo da navegação até o kart responder, cache vazio, 4G | `smoke.md` D2/M2 | 10 s ou mais |
| RNF06 HTTPS | certificado válido; 0 recursos em HTTP; inclinação ativa no celular | navegador (cadeado); `check_served.py` recusa URL `http://` | qualquer recurso inseguro ou aviso de certificado |
| Disponibilidade da página | código de resposta do `index.html`, do JS e do CSS em vigor | **verificação manual em HTTPS** (`runbook.md`, *Verify*) ou `check_served.py` (três GET), por decisão do dono do produto (sem monitor externo) | qualquer resposta diferente de 200 |
| Integridade do deploy | o `index.html` servido aponta para o `assets/index-<hash>.js` do build aprovado | `check_served.py <URL> index-<hash>.js` contra o `<hash>` impresso no passo *Build* da execução (`BwruE9Pq` para `6b314b2`) | hash divergente |
| Regressão das releases contidas | o painel do resultado de cada volta na sintética sem crédito; Kart 01; `arcade-assistido-v6` | `smoke.md` D18; `check_served.py` confirma `kart01-decals`, `=1.38,`, `arcade-assistido-v6`, `arcade-assistido-v4`, `realista-aluguel-4t-v4` e `Kartle · `; as listas das features contidas | crédito na sintética; acerto ausente do bundle; kart de caixas |
| Erros no console | erros ao carregar, ao trocar de pista e durante uma volta | `smoke.md` D5/M5 | 1 ou mais erros (um `warn` com código não é erro) |

## O registro de implantações — o histórico do Actions

Como nas releases anteriores, o **histórico de execuções do workflow `pages`**
(`https://github.com/edumatosr6-svg/kartle/actions`; staging em `https://github.com/edumatosr6-svg/kartle-staging/actions`) é o
registro de deploy: cada execução guarda o commit, o resultado de `npm test` (443 aprovados em 41101055606), o log do build com os nomes dos
*assets*, a medida de RNF02 e — no trabalho `deploy` — quem aprovou e quando (D-DP-06) e a URL publicada. Retenção: 90 dias por
padrão; a execução verde anterior é o alvo do caminho B enquanto estiver retida. **O registro da promoção da pista** é outro:
`tracks/registry.json`, no repositório, onde `PRODUCTION`, `promotedAtUtc` e `esriDecisionRef` só aparecem na entrega que
promover (DM-0002) — a ausência deles hoje é a prova verificável de que a Kart Park não foi promovida (CHK-TEST-0012-04).

Estado em 2026-10-30, apurado por leitura (`gh run list`/`gh run view` nos dois repositórios; GET às URLs):

| Repositório | Execução | Commit | `build` | `deploy` | Leitura |
|---|---|---|---|---|---|
| `kartle-staging` | 40603572961 | `d9139a2` | **failure** (`npm test`: CHK-TEST-0012-01/-05) | `skipped` | o fim de linha da origem normalizado pelo git; corrigido por `5ed7a5b` (regra byte-exata) |
| `kartle-staging` | 40606152700 | `5ed7a5b` | concluído | concluído | validada em 2026-10-28 (`deploy-validation-20261028-0008.md`); `index-DYFBop8t.js` |
| `kartle-staging` | 40607336550, 40987575935 | `3f1ced3` (registro), `2f3dfab` (prévia `?acerto=`, só staging) | concluído | concluído | substituídas |
| `kartle-staging` | **41076989728** | `652bbaa` | concluído (393/393) | concluído 15:04:27Z | a última verde **anterior** a esta; `index-dD_vz2Ev.js`; alvo do caminho B; retida |
| `kartle-staging` | **41101055606** | `6b314b2` | concluído 17:47:57Z (443/443; 711 477 bytes) | concluído 17:48:12Z | **a desta rodada**; serve `index-BwruE9Pq.js` desde 17:48:06 GMT; `check_served.py` 79 verificações, 4 reprovadas (ADR-0007, DIV-DP-16) |
| `kartle` (produção) | 39827702391 e as anteriores | `05c3570` e anteriores | concluído | `pending` / `cancelled` | **nada aprovado**; produção responde 404; `origin/master` = `05c3570` |

O validador reconfirma estes números na aba Actions e os cita no relatório; os números em vigor são sempre os da aba Actions.

## Qual alerta soaria

**Nenhum alerta automático sobre a página servida — por decisão mantida.** O GitHub Pages não oferece monitor de
disponibilidade nem registros de acesso, e o dono do produto decidiu em 2026-10-21 que a vigilância é **manual, conforme o
runbook**; esta release não acrescenta monitor nem telemetria (RNF12; DES-0012). O único alerta automático é o do pipeline — uma
execução falhada (teste, build ou RNF02) notifica o dono do produto por e-mail do GitHub e nada é publicado; nesta release o
`npm test` do workflow inclui as 102 `CHK-TEST-00nn-nn` da feature, de modo que um arquivo de pista alterado sem nova versão
(CHK-TEST-0012-01), uma entrada `PRODUCTION` sem `esriDecisionRef` (CHK-TEST-0012-04), um módulo da feature com rede ou
armazenamento (CHK-TEST-0011-02), o recorde `41,45` num texto (CHK-TEST-0009-07), um preset ou o contrato de passo alterados
(NFR-0008) ou um cruzamento da barreira (CHK-TEST-0004-02/-03) **param a execução antes do `deploy`**. Sobre a página, o
"alerta" é a vigilância humana do `runbook.md` (D-DP-03): *Verify* em staging e, na entrega que promover, 24 h depois em
produção, com reversão se um limiar da tabela acima for cruzado. `check_served.py` é a forma reproduzível dessa verificação (três
GET; nenhum dado pessoal) — e, sobre a URL de produção, a sua **reprovação** nas linhas da Kart Park é o estado esperado até a
decisão Esri.

## Novo modo de falha que esta release introduz, e como se vê

| Modo de falha | Sintoma observável | Diagnóstico |
|---|---|---|
| Kart Park promovida sem a decisão Esri | execução aprovada em `edumatosr6-svg/kartle` com commit que contenha a feature; `check_served.py` desta release passa em produção; `tracks/registry.json` sem `PRODUCTION` | violação de NFR-0012 / ADR-0005: reverter de imediato (caminho A) e registrar; `FAIL` deste estágio (processo), não da aplicação |
| jogo abre na pista sintética, ou o seletor tem uma opção só | tela ao abrir (H1 D4, M4) | `FAIL CODE` (`src/main.ts:645` `chooseTrack(OPENING_TRACK_ID)`; `TRAINING_CATALOG`); CHK-TEST-0007-02 e CHK-TEST-0009-08 deveriam ter falhado |
| crédito ausente do seletor ou do painel do resultado de uma volta na Kart Park, ou presente na sintética | tela (H1, H3, H5); `check_served.py` (linhas de ADR-0007) | `FAIL CODE` (`renderCredit`/`creditFor`; o desenho do painel em `renderTrainingResult`); CHK-TEST-0009-01..04 — hoje o caso de `6b314b2` (DIV-DP-16) |
| `#track-status` fica em "carregando a pista" ou mostra `track-data` no console | tela e console (D5) | arquivo de pista ilegível no bundle: `FAIL` deste estágio se o `dist/` não veio do commit (SHA-256 diverge), `FAIL CODE` se o commit o publica assim (impossível com CHK-TEST-0012-01 verde) |
| kart atravessa a barreira; zebra sem efeito na aderência | tela (H3) | `FAIL CODE` (`src/physics.ts` bloco da barreira `:339-357`, `barrierContactPoint` `:367-383`; `surfaceMu`) |
| ricochete em ângulo inesperado na barreira | tela (H3) | observação de qualidade (poligonal em zigue-zague de 0,1 m); feedback ao D-Spec numa versão 2 da pista, não gatilho |
| vibração ou som fora da zebra, na pausa, ou ausentes no aparelho de referência | mão e ouvido (H4) | `FAIL CODE` (`src/curbFeedback.ts`, `src/audio.ts`, laço de `src/main.ts`); navegador sem `navigator.vibrate` é ambiente (E2E-06) |
| corte ou reposicionamento errado na Kart Park (kart posto fora da linha central, volta válida depois de cortar) | tela (H3) | `FAIL CODE` (`src/lap.ts`); CHK-TEST-0005-* |
| taxa de quadros abaixo do limiar com asfalto, zebras e 381 instâncias de barreira | `minFps` < 60 (notebook) ou < 30 (celular) em H6 | `FAIL CODE` (`src/trackScene.ts`), não de empacotamento; ou aparelho fora da referência (I9) |
| nome ou "687 m" em inglês, ou traduzidos | tela num navegador em inglês (H8) | `FAIL CODE` (`optionLabel`; os textos são literais em português, não entram em `MESSAGES`) |
| resumo registrado de um arquivo de pista diferente dos bytes do commit (fim de linha normalizado pelo git) | `npm test` do workflow reprova CHK-TEST-0012-01/-05 e nada é publicado (e-mail do GitHub); localmente, `git ls-files --eol` sem `attr/-text` ou com `i/` ≠ `w/` | empacotamento (`FAIL` deste estágio): a regra byte-exata (`.gitattributes` `-text`; `runbook.md`, *Promote* 1) |
| *assets* em 404, `deploy` com zero passos, execução cancelada pelo grupo `pages`, cache de 10 min | os mesmos das releases anteriores (`600 Deploy/Output/modelo-kart-01/REL-0005-observability.md`) | empacotamento ou configuração (`FAIL` deste estágio), com os remédios lá descritos |
