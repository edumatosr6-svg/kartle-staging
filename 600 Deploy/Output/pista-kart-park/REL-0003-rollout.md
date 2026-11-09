---
id: REL-0003
title: Rollout — staging agora, produção bloqueada pela decisão Esri; ordem de operações, janela de compatibilidade e o pipeline do GitHub Pages
feature: pista-kart-park
stage: deploy
status: validated
version: 2.0.0
sources: [DES-0004, DES-0005, DES-0007, DES-0008, DES-0011, DES-0012, DM-0001, DM-0002, ADR-0005, ADR-0007, ADR-0008, NFR-0002, NFR-0004, NFR-0005, NFR-0006, NFR-0010, NFR-0011, NFR-0012, NFR-0013, NFR-0014, US-0007, TEST-0007, TEST-0009, TEST-0010, TEST-0012]
---

# REL-0003 — Rollout

## Ordem de operações

A ordem típica do estágio (migração aditiva → backend → web → mobile → parte destrutiva) colapsa aqui num único passo, pela mesma
razão estrutural das releases anteriores: não há backend, banco, aplicativo nativo nem migração de dado (`REL-0002`). A sequência
**para em staging**: a promoção a produção está bloqueada por projeto até a decisão Esri (ADR-0005; NFR-0012; `DOMAIN.md`: o
ponto Esri de 2026-10-22, a decisão de 2026-11-03 — ponto Esri aberto, Kart Park só em staging, as quatro features vão juntas,
nenhum push de `master` a `origin` — e a de 2026-11-06 — a licença Esri vale também para a réplica), e o passo de produção desta
tabela só existe para dizer o que **não** fazer. A revisão 3 do seed acrescenta um arquivo de pista e troca o que o catálogo
carrega; é aditiva (nenhum arquivo publicado é reescrito nem apagado — `REL-0002`, revisão 3), por isso também cabe num passo só.

| Ordem | Passo | Quem | Desfaz-se por |
|---|---|---|---|
| 1 | anotar o alvo de reversão: em `edumatosr6-svg/kartle-staging`, a execução verde **anterior** à desta release é a **41832829595** (commit `1966c4a`, árvore de `2aa013e`, 2026-11-04, `assets/index-BMmvlQeM.js`; a Kart Park versão 1 com o acabamento); em `edumatosr6-svg/kartle`, **não há** execução verde (404; `origin/master` = `05c3570`) | executor do runbook | não se desfaz: é a rede de segurança |
| 2 | conferência byte-exata dos **cinco** arquivos de pista (`git ls-files --eol`, `runbook.md` *Promote* 1) e `git push staging master:staging` → o workflow constrói e publica em **staging**. **Histórico** (rodadas anteriores): 40603572961 (`d9139a2`) reprovada no `npm test` pela normalização do fim de linha, corrigida por `5ed7a5b`; depois 40606152700, 41101055606 (`6b314b2`, sem o crédito no painel — DIV-DP-16), 41109469203 (`e70aad9`), 41156803005 (`1bb63aa`, `index-DmxsQuIL.js`) e 41832829595 (`1966c4a`, árvore de `2aa013e`, `index-BMmvlQeM.js`, validada em `deploy-validation-20261104-1302.md`/`-1340.md`). **A desta release, feita em 2026-11-06 (21:53 −03:00)**: push de **`3d5dfdd`** (avanço rápido de `1966c4a`) → execução **42320960893**, verde, 477/477, `index-DszUW7WJ.js`, `check_served` 84/84 (2026-11-09). Rodar `smoke.md` e H1–H12 só num build que passe em `check_served` | executor do runbook; testador humano | *Re-run all jobs* da execução 41832829595 (caminho B) ou *Unpublish site* (caminho A) — procedimento B ensaiado em 2026-10-27, A em 2026-10-21 |
| 3 | **parar.** Não há pergunta de promoção para esta release (D-DP-06 sem objeto): a precondição *Decisão Esri registrada* do `runbook.md` está por marcar. O dono do produto decide (a) a licença Esri; (b) já está decidida — opção 1, esperar e promover as quatro features juntas (2026-11-03) | dono do produto | — |
| 4 | **não executar nesta release** (decisão de 2026-11-03): `git push origin master` com `3d5dfdd` ou qualquer commit de `master` a partir de `ba221ad` criaria em `edumatosr6-svg/kartle` uma execução à espera do revisor cujo bundle contém a Kart Park; aprová-la seria promover a Kart Park sem a decisão (NFR-0012). Se acontecer por engano, **Reject** | — | — |
| 5 | **na entrega que promover** (depois da decisão): código com o crédito da Esri (REQ-FEAT-0006-14; DES-0011) no seletor e no painel do resultado de cada volta, `npm run track -- promote kart-park 2 --esri-decision "<referência>"` (registro em `PRODUCTION`; conferência byte-exata antes do push, porque `tracks/registry.json` muda), testes, nova rodada deste estágio, `git push origin master`, *Approve and deploy*, `smoke.md` *Verificação em produção*, vigilância por 24 h (`REL-0005`) | dono do produto | R1 do `runbook.md` daquela entrega (caminho A, ou B se então existir execução verde) |

Não há parte destrutiva adiada: nada é removido de nenhum armazenamento, e a versão 1 da pista **não** é retirada do
repositório nem do registro (I3; ADR-0008) — só sai do pacote.

## Staging e produção no GitHub Pages — o que existe

Tudo o que a primeira release criou e configurou (D23, 2026-10-21) é reutilizado sem alteração; a tabela completa está em
`600 Deploy/Output/race-lap-validation/REL-0003-rollout.md`. O que importa a quem executa:

| | Produção | Staging |
|---|---|---|
| Repositório | `edumatosr6-svg/kartle` (este), remoto local `origin` | `edumatosr6-svg/kartle-staging`, remoto local `staging` |
| Ramo que publica | `master` (o trabalho `deploy` só corre com `ref_name == 'master'`) | `staging` (`git push staging master:staging`) |
| URL | `https://edumatosr6-svg.github.io/kartle/` | `https://edumatosr6-svg.github.io/kartle-staging/` |
| Settings → Pages → *Source* | GitHub Actions — configurado | GitHub Actions — configurado |
| Ambiente `github-pages` → *Required reviewers* | `edumatosr6-svg` — o clique é a promoção (D-DP-06); **nesta release o clique não pode ser dado** | nenhum |
| Ambiente `github-pages` → *Deployment branches and tags* | restrição padrão (só `master`) — segunda tranca | **No restriction** — liberada em 2026-10-21; **volta à restrição padrão a cada despublicação/reativação do Pages**: refazer a liberação antes de um *Re-run all jobs* depois do caminho A |
| Estado em 2026-11-09 (leitura: `git ls-remote`; `gh run list`; GET às URLs) | nenhuma execução verde; 39827702391 (`05c3570`) `waiting` e as anteriores `cancelled`; 404; `origin/master` = `05c3570` | ramo `staging` = `3d5dfdd`; 42320960893 (`3d5dfdd`) verde e servida (`Last-Modified: Sat, 07 Nov 2026 00:55:17 GMT`); 41832829595, 41156803005, 41109469203 e 41101055606 verdes e retidas |

## Feature flag e quem "liga" a feature

Não há flag (ADR-0005: nenhuma chave de configuração, de compilação ou de execução). A feature — e, desde a revisão 3, a versão 2
da Kart Park — fica ativa para 100 % dos jogadores de **staging** no instante em que o `index.html` novo é servido. A versão
jogável é a que o catálogo declara em código (`trackVersion` 2; ADR-0008), não uma chave. Quem a "liga" em produção é o dono do
produto, na entrega que promover, com a decisão Esri registrada — a "chave mestra" de I4 é esse ato humano e registrado
(`tracks/registry.json` em `PRODUCTION` com `esriDecisionRef`). Não há remoção de flag a agendar.

## Janela de compatibilidade e versão mínima do cliente

| Pergunta | Resposta |
|---|---|
| O que o código antigo precisa continuar funcionando contra | nada: não há servidor, contrato de rede nem dado persistido compartilhado entre as versões (DES-0012; `REL-0002`); cada bundle traz o seu próprio arquivo de pista |
| Por quanto tempo as duas versões coexistem | **até 10 min**: o Pages serve todo arquivo com `Cache-Control: max-age=600` (medido de novo em 2026-11-09) e serve só a implantação corrente; uma página antiga ainda aberta continua a correr em memória a Kart Park versão 1 — nenhuma volta é gravada, por isso nada diverge entre as duas além do traçado na tela |
| Versão mínima do cliente | não há versão instalada: a página é o cliente. Navegadores de referência: Chrome, Edge, Firefox e Safari nas versões atuais (`test-strategy.md`); a vibração exige `navigator.vibrate` (ausente, o treino é igual sem pulso — REQ-FEAT-0005-16..19); o som exige `AudioContext`; a inclinação exige `window.isSecureContext` |
| Atualização forçada | não se aplica; o único mecanismo é o cache |
| Registros entre versões | nenhum registro de treino é persistido em nenhuma das versões |
| Pistas publicadas para os próximos dias | `kart-park` 2 (empacotada) e `kart-park` 1 (fora do pacote), ambas imutáveis e em `STAGING`; uma correção futura do traçado é a versão 3 (`REL-0002`) |

### Regra de cache — o que o GitHub Pages aplica (não configurável)

`index.html` e *assets* com `Cache-Control: max-age=600`, sem comando de purga; os nomes dos *assets* carregam hash de conteúdo
(`index-DszUW7WJ.js` nesta release, com o mesmo `index-q-biCwua.css`; `index-BMmvlQeM.js` e `index-q-biCwua.css` na execução
anterior); o Pages serve apenas a implantação corrente, por isso os *assets* da versão anterior deixam de responder quando esta a
substitui — mitigado pelos 10 min e por o bundle ser um único módulo carregado na abertura.

## O pipeline — `.github/workflows/pages.yml`

Inalterado (a cerca de escrita deste estágio não cobre `.github/`). Etapas e a saída que aprova cada uma:

| # | Etapa | Comando ou ação no workflow | Saída observável que aprova a etapa |
|---|---|---|---|
| 0 | conferência byte-exata (antes do push; humano) | `git ls-files --eol tracks/sources/kart-park.json tracks/sources/kart-park-replica.json src/tracks/kart-park-v1.json src/tracks/kart-park-v2.json tracks/registry.json` | `attr/-text` nas cinco; `i/` = `w/` (`crlf` nas duas origens, `lf` nas outras três) |
| 1 | obter o commit | `actions/checkout` do commit do push (`3d5dfdd` na execução 42320960893) | o cabeçalho da execução mostra o hash |
| 2 | Node e instalação | `actions/setup-node` com `node-version-file: .nvmrc` (24) e `cache: npm`; `npm ci` | Node 24.x no log (v24.22.2 em 42320960893); saída 0 |
| 3 | testar | `npm test` | saída 0; **477** aprovados, 0 reprovados (136 desta feature: V01–V20 sobre a versão 2 e a réplica, os resumos registrados das duas versões e das duas origens contra os bytes do blob, a versão 1 intacta e fora do pacote, a conferência de versão do catálogo, `promote` recusado sem `--esri-decision`, camadas, determinismo e treino de voltas seguidas na versão 2, as medidas do acabamento na cena construída em Node sobre a versão 2) |
| 4 | construir | `npm run build -- --base=/kartle/` em produção, `--base=/kartle-staging/` em staging | saída 0; `dist/index.html`, `dist/assets/index-<hash>.js` (`DszUW7WJ` para `3d5dfdd`, o da execução 42320960893), `dist/assets/index-<hash>.css` (`q-biCwua`); nenhum outro *asset* |
| 5 | medir | `python3 -I "600 Deploy/Output/race-lap-validation/tools/measure_dist.py" dist` | `within_limit=True`; na execução 42320960893: `total_bytes=708040 gzip_bytes=186379 ratio=0.225` (o build limpo local no Windows dá os mesmos 708 040 e 186 791 com gzip — só a zlib difere; em 41832829595, de `2aa013e`: 714 001 / 189 539) |
| 6 | empacotar | `actions/configure-pages`; `actions/upload-pages-artifact` com `path: dist` | artefato `github-pages` anexado à execução |
| 7 | publicar | trabalho `deploy`, ambiente `github-pages`, `actions/deploy-pages` | **staging**: publica de imediato; **produção**: *Waiting* até o revisor — **nesta release, nunca** (D-DP-06; NFR-0012) |
| 8 | conferir o servido | `python -I "600 Deploy/Output/pista-kart-park/tools/check_served.py" <URL> index-<hash>.js` (humano ou validador) | `checks=84 failed=0`: 200 em HTTPS, um JS e um CSS sob a base certa, `<hash>` esperado, elementos do HTML (inclusive os do treino contínuo), o crédito em `#lap-training-result-credit` e nenhum `lap-result-credit` (ADR-0007), o arquivo da Kart Park uma vez no JS com `trackVersion` 2 e o SHA-256 registrado da entrada 2, 691/39/22/3/1, o rótulo "(réplica não oficial)", `displayLengthM:691`, `TRACK_VERSION_MISMATCH`, nenhum texto da versão 1, `vibrate(20)`, `lowpassHz:160`, malhas, nenhum `esri`/`41.45`/`recorde`, `arcade-assistido-v6`, classes do CSS, tamanhos. Em 42320960893 (`DszUW7WJ`), 2026-11-09: `failed=0` |
| 9 | smoke em staging | `smoke.md` + linhas H1–H12 do `runbook.md` (humano), num build com a etapa 8 sem reprovação | todas as linhas dentro do limiar; registro em `docs/kart-park-device-log.md` |
| 10 | **parar** | não há pergunta de promoção | — |

## Riscos específicos deste rollout e como são observados

| Risco | Como se vê | Resposta |
|---|---|---|
| **promoção da Kart Park sem a decisão Esri** | execução em `edumatosr6-svg/kartle` à espera do revisor com commit a partir de `ba221ad` | **Reject**; se já aprovada, R1 (caminho A) no mesmo instante; a regra é 0 promoções antes da decisão (NFR-0012), e vale para a versão 2 (`DOMAIN.md`, 2026-11-06) |
| **a versão errada empacotada** (a importação da versão 1 de volta, ou o catálogo sem `trackVersion` 2) | com o catálogo em 2 e o arquivo da 1, a Kart Park não abre: `FAILED`, `trackDataError` na tela, `track-data TRACK_VERSION_MISMATCH` no console (D5); `check_served.py`/`check_bundle.py` reprovam no `trackVersion`, no SHA-256 e nos textos da versão 1; no workflow, CHK-TEST-0007-12/-13 e CHK-TEST-0009-13 reprovam e nada é publicado | `FAIL CODE`; nada a reverter se o workflow parou; se chegou a staging, gatilho de reversão |
| **um arquivo de pista publicado reescrito** (a versão 1 editada no lugar, ou a 2 diferente do registrado) | `npm test` (CHK-TEST-0012-01, -09) reprova e nada é publicado; localmente, `git diff 2aa013e <sha> -- src/tracks/kart-park-v1.json tracks/sources/kart-park.json` não vazio | `FAIL CODE` e violação de I3/NFR-0014 |
| **resumo registrado diferente dos bytes do commit** (fim de linha normalizado pelo git num dos cinco arquivos de pista) | `git ls-files --eol` com `attr/text`/`attr/auto` ou `i/` ≠ `w/`; no workflow, CHK-TEST-0012-01/-05 reprovam e nada é publicado (como em 40603572961) | `FAIL` deste estágio (empacotamento): restaurar o `-text`, readicionar o arquivo com os bytes registrados, conferir, novo push |
| **crédito OSM ausente do resultado de uma volta de treino na Kart Park** (ADR-0007; regressão) | `check_served.py`/`check_bundle.py`: as 4 linhas de ADR-0007 reprovam; na tela, o painel `#lap-training-result` sem a linha do crédito (D9, M10, H3, H5); CHK-TEST-0009-04/-11 no workflow | `FAIL CODE`; gatilho de reversão (D-DP-03) |
| staging serve, no mesmo bundle, mudanças de outras features cujas portas humanas continuam abertas | os registros de release de `race-lap-validation`, `dirigibilidade` e `modelo-kart-01` | decisão do dono do produto (DIV-DP-12): executar as listas delas na mesma sessão de aparelho que H1–H12 |
| as releases contidas ficam atrás do servido quando `3d5dfdd` chega a staging (o envio muda `src/main.ts` e `src/trainingSession.ts`, o que invalida pela regra de cada registro o seu `<sha>` `2aa013e`) | aconteceu em 2026-11-06, como em 2026-11-04 com `2aa013e` | um feedback a cada um desses registros (esta rodada); cada um decide numa rodada própria (`98-divergences.md`, DIV-DP-12); não é editado aqui (§14) |
| `index.html` novo servido com *assets* antigos, ou antigo com *assets* já removidos (janela de 10 min) | tela em branco ou erro de módulo no console; `#track-status` nunca sai de "carregando a pista" | esperar os 10 min e recarregar em janela anônima; se persistir, reverter |
| trabalho `deploy` de staging falha **sem executar nenhum passo** | `deploy` em vermelho sem passo listado | política de ramos restrita: liberar e *Re-run all jobs* (`FAIL` deste estágio, configuração) |
| bundle construído sem `--base=/kartle-staging/` | `index.html` referencia `/assets/...` e os *assets* respondem 404 | `FAIL` deste estágio; `check_served.py` acusa "assets referenciados sob a base" |
| `esri` no bundle antes da decisão, ou `41,45`/`recorde` em qualquer tela | `check_served.py` (0 ocorrências hoje); CHK-TEST-0009-07 e CHK-TEST-0001-16 no workflow | `FAIL CODE` |
| zebra sem vibração no celular de referência, ou vibração fora da zebra / na pausa | H5 (M7); `vibrate(20)` está no bundle | `FAIL CODE` (`src/curbFeedback.ts`, laço de `src/main.ts`) ou navegador sem `navigator.vibrate` (ambiente: E2E-06) |
| som da zebra ausente, contínuo ou indistinto no teclado | H4 (D12) em Chrome e Firefox | `FAIL CODE` (`src/audio.ts`) |
| kart atravessa a barreira da versão 2, ou ricocheteia de forma estranha | H3 (D11); CHK-TEST-0004-02/-03 sobre a versão 2 | atravessar: `FAIL CODE`; ricochete: observação para o D-Spec |
| taxa de quadros abaixo de 60 no notebook ou de 30 no celular (NFR-0002 1.1.0) num treino de duas voltas com o acabamento sobre o traçado da réplica | `minFps` em `docs/kart-park-device-log.md` (H11; D14, M9), por aparelho e orientação | reverter em staging se o dono do produto decidir (caminho B volta à versão 1 com o acabamento); `FAIL CODE` (`src/trackScene.ts`) ou aparelho fora da referência (I9); o acabamento **não** é retirado para cumprir o NFR (US-0007, casos anormais) |
| acabamento errado na tela sobre a versão 2: faixa de borda interrompida, zebra sem relevo, pneus fora do lugar ou com o kart a entrar neles, grama num tom só ou com tons que mudam entre aberturas | H9, H10 (D19–D21, M13); CHK-TEST-0010-* sobre a versão 2 no workflow | `FAIL CODE` (`src/trackScene.ts`); gatilho de reversão |
| a sintética muda de aparência | H12 (D22, 0 pixel diferente); CHK-TEST-0009-12 no workflow | `FAIL CODE`; gatilho de reversão |
| requisição a outro serviço entre a escolha da pista e "encerrar treino" (NFR-0004) | painel de rede (H7; D15, M11); CHK-TEST-0011-02 | `FAIL CODE`; a requisição a `fonts.googleapis.com` no carregamento é divergência aceita (DIV-DP-10) |
| download comprimido acima de 3 MB (RNF02) | lista de transferências (D3, M3); `measure_dist.py` no workflow | `FAIL` deste estágio se o workflow deixou passar; na execução 42320960893, 186 379 bytes gzip (5,9 % do limite) |
