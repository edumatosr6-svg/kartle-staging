---
id: REL-0003
title: Rollout — ordem de operações, janela de compatibilidade e o pipeline do GitHub Pages
feature: modelo-kart-01
stage: deploy
status: validated
version: 1.1.0
sources: [DES-0003, DES-0004, DES-0007, ADR-0003, NFR-0001, NFR-0002, NFR-0003, NFR-0006, TEST-0003, TEST-0004]
---

# REL-0003 — Rollout

## Ordem de operações

A ordem típica do estágio (migração aditiva → backend → web → mobile → parte destrutiva) colapsa aqui num único passo, pela
mesma razão estrutural das releases anteriores: não há backend, não há banco, não há aplicativo nativo e não há migração
(`REL-0002`). O que muda nesta revisão: o commit é `6b314b2` (seed rev 4), o alvo de reversão em staging é a execução
41076989728 (`652bbaa`), e a promoção a produção depende da decisão Esri da `pista-kart-park`, contida neste commit.

| Ordem | Passo | Quem | Desfaz-se por |
|---|---|---|---|
| 1 | anotar o alvo de reversão: em `edumatosr6-svg/kartle-staging`, a última execução verde **anterior** à desta revisão é a **41076989728** (commit `652bbaa`); em `edumatosr6-svg/kartle`, **não há** execução verde (nada promovido; a URL responde 404) — o alvo de produção é o site não publicado (caminho A) | executor do runbook | não se desfaz: é a rede de segurança |
| 2 | `git push staging master:staging` → o workflow constrói e publica em **staging**. **Estado em 2026-10-30**: feito; execução **41101055606** (`6b314b2`, `success`); `https://edumatosr6-svg.github.io/kartle-staging/` serve `index-BwruE9Pq.js` desde 17:48:06Z (200 em HTTPS; `check_served.py` 40/40; byte a byte o build limpo). Rodar `smoke.md` e as linhas humanas H1–H6 do `runbook.md` | executor do runbook; testador humano | *Re-run all jobs* da execução 41076989728 (caminho B) ou *Unpublish site* (caminho A) |
| 3 | **decisão Esri ou escolha entre as opções 1 a 3** de `01-release.md` (o commit contém a Kart Park) | dono do produto | não promover |
| 4 | **pergunta ao dono do produto** — promover o commit escolhido? (D-DP-06) | dono do produto | não promover |
| 5 | `git push origin master` (avanço rápido a partir de `05c3570`; nunca `--force`) → o workflow constrói em `edumatosr6-svg/kartle` e **para à espera do revisor**; o dono do produto clica *Approve and deploy*; o cache do Pages renova em até 10 min. Aprovar sempre a execução **mais recente** cujo `build` esteja verde e cujo commit seja o escolhido no passo 3 (ou um posterior só de registro); **nunca** a 39827702391 (`05c3570`) | dono do produto | R1 do `runbook.md` |
| 6 | `smoke.md`, seção *Verificação em produção*, e vigilância por 24 h (`REL-0005`) | dono do produto | idem 5 |

Não há parte destrutiva adiada para uma release seguinte: nada é removido de nenhum armazenamento. O +4° de turbo, o jato no
escapamento e as marcas presas ao drift **saem do código** nesta revisão (CHK-TEST-0001-21, CHK-TEST-0004-17, -18; `check_served.py`
confirma a ausência no bundle) — a sua volta é a do repositório (ADR-0003), não de uma chave.

## Staging e produção no GitHub Pages — o que existe

Tudo o que a primeira release criou e configurou (D23, 2026-10-21) é reutilizado sem alteração; a tabela completa está em
`600 Deploy/Output/race-lap-validation/REL-0003-rollout.md`. O que importa a quem executa:

| | Produção | Staging |
|---|---|---|
| Repositório | `edumatosr6-svg/kartle` (este), remoto local `origin` (`05c3570`) | `edumatosr6-svg/kartle-staging`, remoto local `staging` (`6b314b2`) |
| Ramo que publica | `master` | `staging` (`git push staging master:staging`) |
| URL | `https://edumatosr6-svg.github.io/kartle/` | `https://edumatosr6-svg.github.io/kartle-staging/` |
| Settings → Pages → *Source* | GitHub Actions — configurado | GitHub Actions — configurado |
| Ambiente `github-pages` → *Required reviewers* | `edumatosr6-svg` — o clique é a promoção (D-DP-06) | nenhum |
| Ambiente `github-pages` → *Deployment branches and tags* | restrição padrão (só `master`) — mantida como segunda tranca | **No restriction** — liberada em 2026-10-21; **volta à restrição padrão a cada despublicação/reativação do Pages**: refazer a liberação antes de um *Re-run all jobs* depois do caminho A, senão o `deploy` falha com zero passos |
| Estado em 2026-10-30 | nenhuma execução verde; a URL responde 404 | execução 41101055606 verde (publicou às 17:48:06Z); serve `index-BwruE9Pq.js`; a anterior verde é a 41076989728 (`652bbaa`) |

## Feature flag e quem "liga" a feature

Não há flag (ADR-0003, *Sem chave mestra*; o padrão neutro de I4 vale porque nada da simulação muda — `RENDER_NEUTRAL`,
`SIM_CONTRACT`, `DETERMINISM`). A feature fica ativa para 100 % dos jogadores no instante em que o `index.html` novo é servido.
Quem a liga é o dono do produto ao executar o passo 5; o que ele observa está em `REL-0005` e os limiares que mandam reverter, no
`runbook.md`. Não há remoção de flag a agendar.

## Janela de compatibilidade e versão mínima do cliente

| Pergunta | Resposta |
|---|---|
| O que o código antigo precisa continuar funcionando contra | nada: não há servidor, contrato de rede nem dado persistido compartilhado entre as versões (DES-0007; `REL-0002`) |
| Por quanto tempo as duas versões coexistem | **até 10 min**: o Pages serve todo arquivo com `Cache-Control: max-age=600` (confirmado em 2026-10-30 na resposta de staging) e serve só a implantação corrente; uma página antiga ainda aberta continua a correr em memória |
| Versão mínima do cliente | não há versão instalada: a página é o cliente. Navegadores de referência: Chrome, Edge, Firefox e Safari nas versões atuais (`test-strategy.md`), em `web-desktop` e `web-mobile`; a placa exige um contexto canvas 2D (`kart01-decals`/`NO_2D_CONTEXT` quando falta); a inclinação exige `window.isSecureContext` (HTTPS) |
| Atualização forçada | não se aplica; o único mecanismo é o cache |
| Registros entre versões | o registro de volta e o texto compartilhado são das releases contidas; esta feature não os muda |

### Regra de cache — o que o GitHub Pages aplica (não configurável)

Inalterada e medida de novo em 2026-10-30: `index.html` e *assets* com `Cache-Control: max-age=600`, sem comando de purga; os
nomes dos *assets* carregam hash de conteúdo (`index-BwruE9Pq.js` e `index-oR7KyBh_.css` nesta revisão); o Pages serve apenas a
implantação corrente, por isso os *assets* da versão anterior deixam de responder quando esta a substitui — mitigado pelos 10 min e
por o bundle ser um único módulo carregado na abertura.

## O pipeline — `.github/workflows/pages.yml`

Inalterado por esta feature (a cerca de escrita deste estágio não cobre `.github/`). Etapas e a saída que aprova cada uma, na
própria execução do Actions:

| # | Etapa | Comando ou ação no workflow | Saída observável que aprova a etapa |
|---|---|---|---|
| 1 | obter o commit | `actions/checkout` do commit do push (`6b314b2` nesta revisão) | o cabeçalho da execução mostra o hash |
| 2 | Node e instalação | `actions/setup-node` com `node-version-file: .nvmrc` (24) e `cache: npm`; `npm ci` | Node 24.x no log; saída 0; lockfile inalterado |
| 3 | testar | `npm test` | saída 0; **443** aprovados, 0 reprovados, 0 pulados (66 desta feature) |
| 4 | construir | `npm run build -- --base=/kartle/` em produção, `--base=/kartle-staging/` em staging | saída 0; o log do Vite lista `dist/index.html`, `dist/assets/index-<hash>.js` (esperado `BwruE9Pq` para a árvore de `6b314b2` com a base de staging), `dist/assets/index-<hash>.css`; nenhum outro *asset* |
| 5 | medir | `python3 -I "600 Deploy/Output/race-lap-validation/tools/measure_dist.py" dist` (ferramenta da primeira release, reutilizada por referência) | `within_limit=True` (RNF02: abaixo de 3 145 728 bytes); medido no build limpo: 711 561 bytes |
| 6 | empacotar | `actions/configure-pages`; `actions/upload-pages-artifact` com `path: dist` | artefato `github-pages` anexado à execução |
| 7 | publicar | trabalho `deploy`, ambiente `github-pages`, `actions/deploy-pages` | **staging**: publica de imediato; **produção**: fica em *Waiting* até o revisor clicar *Approve and deploy* (D-DP-06) |
| 8 | conferir o servido | `python -I "600 Deploy/Output/modelo-kart-01/tools/check_served.py" <URL> index-<hash>.js` (humano ou validador; não está no workflow) | `checks=40 failed=0`: 200 em HTTPS, um JS e um CSS sob a base certa, `<hash>` esperado, elementos do HTML, marcadores do Kart 01, número `01`, condição das marcas, constantes de câmera, nenhum símbolo do kart provisório nem dos efeitos de turbo, identificadores das releases contidas, tamanhos |
| 9 | smoke em staging | `smoke.md` + linhas H1–H6 do `runbook.md` (humano) | todas as linhas com resultado dentro do limiar; registro em `docs/kart-01/device-log.md` |
| 10 | **parar** | a execução de produção parada em *deploy* é a pergunta de promoção; o clique é a resposta — e só existe depois da decisão Esri ou da escolha de opção | aprovação registrada na execução, com quem e quando |
| 11 | verificar | `smoke.md`, *Verificação em produção*, depois dos 10 min de cache | limiares de RNF01, RNF02, RNF06, NFR-0001 e os da tela observados |

## Riscos específicos deste rollout e como são observados

| Risco | Como se vê | Resposta |
|---|---|---|
| promover a Kart Park sem a decisão Esri, ao empurrar `master` para `origin` | qualquer execução de produção de um commit a partir de `ba221ad` | **não aprovar**; *Reject* deixa tudo como está; a escolha entre as opções de `01-release.md` vem antes (DIV-DP-15) |
| `index.html` novo servido com *assets* antigos, ou antigo com *assets* já removidos (janela de 10 min) | tela em branco ou erro de módulo no console (404 em `/kartle/assets/`); `#track-status` nunca sai de "carregando a pista" | esperar os 10 min do `max-age` e recarregar em janela anônima; se persistir, reverter |
| trabalho `deploy` de staging falha **sem executar nenhum passo** (o `build` ficou verde) | `deploy` em vermelho sem passo listado; nenhuma URL publicada | política de ramos do ambiente restrita ao ramo padrão: liberar e *Re-run all jobs* (`FAIL` deste estágio, configuração) |
| execução de produção cancelada pelo grupo `pages` antes da aprovação | a execução que esperava aparece `cancelled`; a mais nova espera no lugar dela | aprovar a mais recente com `build` verde, depois de conferir o commit |
| bundle construído sem `--base=/kartle/` | `index.html` referencia `/assets/...` e os *assets* respondem 404 | defeito de empacotamento (`FAIL` deste estágio); `check_served.py` acusa "assets referenciados sob a base" |
| efeito de turbo ou de drift ainda no bundle | fumaça no escapamento ou campo de visão a abrir com Espaço; `check_served.py` acusa `exhaustOutlet`/`escapamentoSaida`/`turboFovDeltaDeg`/`baseVerticalFovDeg`; `CHK-TEST-0001-21`, `-0004-17`, `-18` teriam falhado | defeito de aplicação (`FAIL CODE`) — o `npm test` do workflow o impede de chegar ao `deploy` |
| marcas na reta, na pausa ou na contagem, ou nenhuma marca em curva forte | observado na tela (H5, D12); `check_served.py` confirma a condição `speedMps>6&&….sideslipRad>.055` no bundle; `CHK-TEST-0004-06`, `-19`, `-20` provam o bloco | defeito de aplicação (`FAIL CODE`), não de empacotamento |
| câmera a ir à visão geral pelo fim de uma volta de treino | observado na tela (H2, D11); `CHK-TEST-0003-15`, `-16`, `-18` provam a câmera no treino contínuo | `FAIL CODE` |
| placa sem o número `01` | o para-choque traseiro liso; console com `kart01-decals`/`NO_2D_CONTEXT` | navegador sem contexto canvas 2D: sintoma de ambiente; noutro navegador de referência, `FAIL CODE` |
| taxa de quadros abaixo de 60 no notebook ou de 30 no celular (NFR-0001, RNF03) | `minFps` em `docs/kart-01/device-log.md` (H6) | reverter; a causa é defeito de aplicação (`FAIL CODE`) ou aparelho fora da referência (I9) |
| download comprimido acima de 3 MB (NFR-0002) | lista de transferências do navegador (H6); `measure_dist.py` no workflow pararia o `build` antes | `FAIL` deste estágio se o workflow deixou passar; hoje 188 918 bytes gzip (6,0 % do limite) |
| reverter staging enquanto outra feature mede o seu bundle | o caminho B devolve `652bbaa`, sem o treino contínuo nem a `dirigibilidade` rev 6 | avisar antes; a reversão de staging nunca é precondição da de produção (`runbook.md`) |
| requisição a `fonts.googleapis.com` no carregamento | uma requisição no painel de rede antes da volta | divergência aceita (DIV-DP-10); não é gatilho |
