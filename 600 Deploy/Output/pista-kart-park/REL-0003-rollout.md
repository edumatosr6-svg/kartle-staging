---
id: REL-0003
title: Rollout — staging agora, produção bloqueada pela decisão Esri; ordem de operações, janela de compatibilidade e o pipeline do GitHub Pages
feature: pista-kart-park
stage: deploy
status: validated
version: 1.2.0
sources: [DES-0004, DES-0005, DES-0007, DES-0011, DES-0012, DM-0002, ADR-0005, ADR-0007, NFR-0002, NFR-0004, NFR-0005, NFR-0006, NFR-0010, NFR-0011, NFR-0012, TEST-0009, TEST-0012]
---

# REL-0003 — Rollout

## Ordem de operações

A ordem típica do estágio (migração aditiva → backend → web → mobile → parte destrutiva) colapsa aqui num único passo, pela mesma
razão estrutural das releases anteriores: não há backend, banco, aplicativo nativo nem migração de dado (`REL-0002`). A sequência
**para em staging**: a promoção a produção está bloqueada por projeto até a decisão Esri (ADR-0005; NFR-0012; `DOMAIN.md`,
o ponto Esri de 2026-10-22), e o passo de produção desta tabela só existe para dizer o que **não** fazer.

| Ordem | Passo | Quem | Desfaz-se por |
|---|---|---|---|
| 1 | anotar o alvo de reversão: em `edumatosr6-svg/kartle-staging`, a última execução verde **anterior** à desta release é a **41101055606** (commit `6b314b2`, 2026-10-30T17:43:23Z, `assets/index-BwruE9Pq.js`; sem o crédito no painel do resultado); em `edumatosr6-svg/kartle`, **não há** execução verde (404; `origin/master` = `05c3570`) | executor do runbook | não se desfaz: é a rede de segurança |
| 2 | conferência byte-exata dos três arquivos de pista (`git ls-files --eol`, `runbook.md` *Promote* 1) e `git push staging master:staging` → o workflow constrói e publica em **staging**. **O ocorrido**: push de `d9139a2` → execução 40603572961 **reprovada** no `npm test` (CHK-TEST-0012-01/-05: a origem CRLF normalizada a LF pelo git); correção `5ed7a5b` (`.gitattributes` `-text`) → 40606152700 verde, validada em 2026-10-28; depois, em staging, 40607336550 (`3f1ced3`, registro), 40987575935 (`2f3dfab`, prévia `?acerto=`, só staging), 41076989728 (`652bbaa`, merge que registra a prévia sem o código dela), 41101055606 (`6b314b2`, 2026-10-30T17:43:23Z, verde; `index-BwruE9Pq.js`; `check_served.py` 79 verificações, 4 reprovadas — ADR-0007, DIV-DP-16) e **41109469203** (`e70aad9`, 2026-10-30T18:44:27Z, verde, 444/444; `index-DmxsQuIL.js`; `check_served.py` **79/79**) — a desta rodada. Rodar `smoke.md` e H1–H8 só num build que passe em `check_served` | executor do runbook; testador humano | *Re-run all jobs* da execução 41101055606 (caminho B) ou *Unpublish site* (caminho A) — procedimento B ensaiado em 2026-10-27, A em 2026-10-21 |
| 3 | **parar.** Não há pergunta de promoção para esta release (D-DP-06 sem objeto): a precondição *Decisão Esri registrada* do `runbook.md` está por marcar. O dono do produto decide (a) a licença Esri e (b) como as releases contidas chegam a produção entretanto (`runbook.md`, *Promoção bloqueada*) | dono do produto | — |
| 4 | **não executar nesta release**: `git push origin master` com `e70aad9` ou qualquer commit de `master` a partir de `ba221ad` criaria em `edumatosr6-svg/kartle` uma execução à espera do revisor cujo bundle contém a Kart Park; aprová-la seria promover a Kart Park sem a decisão (NFR-0012). Se acontecer por engano, **Reject** | — | — |
| 5 | **na entrega que promover** (depois da decisão): código com o crédito da Esri (REQ-FEAT-0006-14; DES-0011) no seletor e no painel do resultado de cada volta, `npm run track -- promote kart-park 1 --esri-decision "<referência>"` (registro em `PRODUCTION`; conferência byte-exata antes do push, porque `tracks/registry.json` muda), testes, nova rodada deste estágio, `git push origin master`, *Approve and deploy*, `smoke.md` *Verificação em produção*, vigilância por 24 h (`REL-0005`) | dono do produto | R1 do `runbook.md` daquela entrega (caminho A, ou B se então existir execução verde) |

Não há parte destrutiva adiada: nada é removido de nenhum armazenamento. `#lap-result-credit` sai de `#lap-result` na entrega que
realizar ADR-0007 (o elemento não tem caminho em que apareça no treino contínuo); a sua volta é a do repositório.

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
| Estado em 2026-10-30 (`gh run list`, leitura) | nenhuma execução verde; 39827702391 (`05c3570`) `pending` e as anteriores `cancelled`; 404 | 41109469203 (`e70aad9`) verde e servida (`Last-Modified: Fri, 30 Oct 2026 18:46:34 GMT`); 41101055606 (`6b314b2`) e 41076989728 (`652bbaa`) verdes e retidas |

## Feature flag e quem "liga" a feature

Não há flag (ADR-0005: nenhuma chave de configuração, de compilação ou de execução). A feature fica ativa para 100 % dos jogadores
de **staging** no instante em que o `index.html` novo é servido. Quem a "liga" em produção é o dono do produto, na entrega que
promover, com a decisão Esri registrada — a "chave mestra" de I4 é esse ato humano e registrado (`tracks/registry.json` em
`PRODUCTION` com `esriDecisionRef`). Não há remoção de flag a agendar.

## Janela de compatibilidade e versão mínima do cliente

| Pergunta | Resposta |
|---|---|
| O que o código antigo precisa continuar funcionando contra | nada: não há servidor, contrato de rede nem dado persistido compartilhado entre as versões (DES-0012; `REL-0002`) |
| Por quanto tempo as duas versões coexistem | **até 10 min**: o Pages serve todo arquivo com `Cache-Control: max-age=600` (medido de novo em 2026-10-30) e serve só a implantação corrente; uma página antiga ainda aberta continua a correr em memória, com o treino de volta única |
| Versão mínima do cliente | não há versão instalada: a página é o cliente. Navegadores de referência: Chrome, Edge, Firefox e Safari nas versões atuais (`test-strategy.md`); a vibração exige `navigator.vibrate` (ausente, o treino é igual sem pulso — REQ-FEAT-0005-16..19); o som exige `AudioContext`; a inclinação exige `window.isSecureContext` |
| Atualização forçada | não se aplica; o único mecanismo é o cache |
| Registros entre versões | nenhum registro de treino é persistido em nenhuma das versões |
| Pistas publicadas para os próximos dias | `kart-park` 1 é imutável; uma correção é a versão 2 (`REL-0002`) |

### Regra de cache — o que o GitHub Pages aplica (não configurável)

`index.html` e *assets* com `Cache-Control: max-age=600`, sem comando de purga; os nomes dos *assets* carregam hash de conteúdo
(`index-DmxsQuIL.js` e `index-q-biCwua.css` nesta release, `index-BwruE9Pq.js` e `index-oR7KyBh_.css` na execução anterior); o
Pages serve apenas a implantação corrente, por isso os *assets* da versão anterior deixam de responder quando esta a substitui —
mitigado pelos 10 min e por o bundle ser um único módulo carregado na abertura.

## O pipeline — `.github/workflows/pages.yml`

Inalterado (a cerca de escrita deste estágio não cobre `.github/`). Etapas e a saída que aprova cada uma:

| # | Etapa | Comando ou ação no workflow | Saída observável que aprova a etapa |
|---|---|---|---|
| 0 | conferência byte-exata (antes do push; humano) | `git ls-files --eol tracks/sources/kart-park.json src/tracks/kart-park-v1.json tracks/registry.json` | `attr/-text` nas três; `i/` = `w/` (`crlf` na origem, `lf` nos outros dois) |
| 1 | obter o commit | `actions/checkout` do commit do push (`e70aad9` nesta release) | o cabeçalho da execução mostra o hash |
| 2 | Node e instalação | `actions/setup-node` com `node-version-file: .nvmrc` (24) e `cache: npm`; `npm ci` | Node 24.x no log (v24.22.1 em 41109469203); saída 0 |
| 3 | testar | `npm test` | saída 0; **444** aprovados, 0 reprovados (103 desta feature: V01–V18 sobre o arquivo publicado e a origem, resumos registrados contra os bytes do blob, `promote` recusado sem `--esri-decision`, camadas, determinismo na Kart Park, treino de voltas seguidas na Kart Park) |
| 4 | construir | `npm run build -- --base=/kartle/` em produção, `--base=/kartle-staging/` em staging | saída 0; `dist/index.html`, `dist/assets/index-<hash>.js` (`DmxsQuIL` para `e70aad9`), `dist/assets/index-<hash>.css` (`q-biCwua`); nenhum outro *asset* |
| 5 | medir | `python3 -I "600 Deploy/Output/race-lap-validation/tools/measure_dist.py" dist` | `within_limit=True`; em 41109469203: `total_bytes=711620 gzip_bytes=188719 ratio=0.226` |
| 6 | empacotar | `actions/configure-pages`; `actions/upload-pages-artifact` com `path: dist` | artefato `github-pages` anexado à execução |
| 7 | publicar | trabalho `deploy`, ambiente `github-pages`, `actions/deploy-pages` | **staging**: publica de imediato; **produção**: *Waiting* até o revisor — **nesta release, nunca** (D-DP-06; NFR-0012) |
| 8 | conferir o servido | `python -I "600 Deploy/Output/pista-kart-park/tools/check_served.py" <URL> index-<hash>.js` (humano ou validador) | `checks=79 failed=0`: 200 em HTTPS, um JS e um CSS sob a base certa, `<hash>` esperado, elementos do HTML (inclusive os do treino contínuo), o crédito em `#lap-training-result-credit` e nenhum `lap-result-credit` (ADR-0007), o arquivo da Kart Park uma vez no JS com o SHA-256 registrado, 684/38/34/3/1, textos do seletor e do crédito, `vibrate(20)`, `lowpassHz:160`, malhas, nenhum `esri`/`41.45`/`recorde`, `arcade-assistido-v6`, classes do CSS, tamanhos. Em 41109469203: `failed=0` (em 41101055606, `failed=4`: ADR-0007) |
| 9 | smoke em staging | `smoke.md` + linhas H1–H8 do `runbook.md` (humano), num build com a etapa 8 sem reprovação | todas as linhas dentro do limiar; registro em `docs/kart-park-device-log.md` |
| 10 | **parar** | não há pergunta de promoção | — |

## Riscos específicos deste rollout e como são observados

| Risco | Como se vê | Resposta |
|---|---|---|
| **promoção da Kart Park sem a decisão Esri** | execução em `edumatosr6-svg/kartle` à espera do revisor com commit a partir de `ba221ad` | **Reject**; se já aprovada, R1 (caminho A) no mesmo instante; a regra é 0 promoções antes da decisão (NFR-0012) |
| **resumo registrado diferente dos bytes do commit** (fim de linha normalizado pelo git num arquivo de pista) | `git ls-files --eol` com `attr/text`/`attr/auto` ou `i/` ≠ `w/`; no workflow, CHK-TEST-0012-01/-05 reprovam e nada é publicado (como em 40603572961) | `FAIL` deste estágio (empacotamento): restaurar o `-text`, readicionar o arquivo com os bytes registrados, conferir, novo push |
| **crédito OSM ausente do resultado de uma volta de treino na Kart Park** (ADR-0007; regressão) | `check_served.py`/`check_bundle.py`: as 4 linhas de ADR-0007 reprovam (como em `6b314b2`, antes da rodada 4 de código; passam em `e70aad9`); na tela, o painel `#lap-training-result` sem a linha do crédito, ou o crédito que some no redesenho do painel (D9, M10, H3, H5); CHK-TEST-0009-04/-11 no workflow | `FAIL CODE`; gatilho de reversão (D-DP-03). Atenção: o alvo do caminho B (`6b314b2`) tem essa lacuna por construção |
| staging serve, no mesmo bundle, mudanças de outras features cujas portas humanas continuam abertas | os registros de release de `race-lap-validation`, `dirigibilidade` e `modelo-kart-01` | decisão do dono do produto (DIV-DP-12): executar as listas delas na mesma sessão de aparelho que H1–H8 |
| `index.html` novo servido com *assets* antigos, ou antigo com *assets* já removidos (janela de 10 min) | tela em branco ou erro de módulo no console; `#track-status` nunca sai de "carregando a pista" | esperar os 10 min e recarregar em janela anônima; se persistir, reverter |
| trabalho `deploy` de staging falha **sem executar nenhum passo** | `deploy` em vermelho sem passo listado | política de ramos restrita: liberar e *Re-run all jobs* (`FAIL` deste estágio, configuração) |
| bundle construído sem `--base=/kartle-staging/` | `index.html` referencia `/assets/...` e os *assets* respondem 404 | `FAIL` deste estágio; `check_served.py` acusa "assets referenciados sob a base" |
| arquivo da Kart Park ausente ou diferente do registrado (SHA-256) | `check_served.py` acusa "presente uma vez" ou "SHA-256 … igual ao registrado"; `#track-status` sem `kart-park` | `FAIL` deste estágio se o `dist/` não veio do commit; `FAIL CODE` se o commit publica outro conteúdo |
| `esri` no bundle antes da decisão, ou `41,45`/`recorde` em qualquer tela | `check_served.py` (0 ocorrências hoje); CHK-TEST-0009-07 e CHK-TEST-0001-16 no workflow | `FAIL CODE` |
| zebra sem vibração no celular de referência, ou vibração fora da zebra / na pausa | H4 (M7); `vibrate(20)` está no bundle | `FAIL CODE` (`src/curbFeedback.ts`, laço de `src/main.ts`) ou navegador sem `navigator.vibrate` (ambiente: E2E-06) |
| som da zebra ausente, contínuo ou indistinto no teclado | H4 (D12) em Chrome e Firefox | `FAIL CODE` (`src/audio.ts`) |
| kart atravessa a barreira, ou ricocheteia de forma estranha | H3 (D11); CHK-TEST-0004-02/-03 | atravessar: `FAIL CODE`; ricochete: observação para o D-Spec |
| taxa de quadros abaixo de 60 no notebook ou de 30 no celular (NFR-0002) num treino de duas voltas | `minFps` em `docs/kart-park-device-log.md` (D14, M9) | reverter em staging; `FAIL CODE` (`src/trackScene.ts`) ou aparelho fora da referência (I9) |
| requisição a outro serviço entre a escolha da pista e "encerrar treino" (NFR-0004) | painel de rede (H7; D15, M11); CHK-TEST-0011-02 | `FAIL CODE`; a requisição a `fonts.googleapis.com` no carregamento é divergência aceita (DIV-DP-10) |
| download comprimido acima de 3 MB (RNF02) | lista de transferências (D3, M3); `measure_dist.py` no workflow | `FAIL` deste estágio se o workflow deixou passar; hoje 188 682 bytes gzip (6,0 % do limite) |
