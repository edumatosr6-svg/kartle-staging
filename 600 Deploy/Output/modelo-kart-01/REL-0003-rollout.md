---
id: REL-0003
title: Rollout — ordem de operações, janela de compatibilidade e o pipeline do GitHub Pages
feature: modelo-kart-01
stage: deploy
status: validated
version: 1.0.0
sources: [DES-0003, DES-0004, DES-0007, ADR-0003, NFR-0001, NFR-0002, NFR-0003, NFR-0006, TEST-0003, TEST-0004]
---

# REL-0003 — Rollout

## Ordem de operações

A ordem típica do estágio (migração aditiva → backend → web → mobile → parte destrutiva) colapsa aqui num único passo, pela
mesma razão estrutural das duas releases anteriores: não há backend, não há banco, não há aplicativo nativo e não há migração
(`REL-0002`). O que muda contra a `dirigibilidade` é que o alvo de reversão em staging é agora a execução daquela release, e que
o **caminho B já foi ensaiado** no mesmo site.

| Ordem | Passo | Quem | Desfaz-se por |
|---|---|---|---|
| 1 | anotar o alvo de reversão: em `edumatosr6-svg/kartle-staging`, a última execução verde **anterior** à desta release é a **40566728590** (commit `b86b200`, `assets/index-BiFxJ0FY.js`, 579 462 bytes); em `edumatosr6-svg/kartle`, **não há** execução verde (nada promovido) — o alvo de produção é o site não publicado (caminho A) ou, se uma execução de árvore anterior ainda estiver em *Waiting*, a sua aprovação (`runbook.md`) | executor do runbook | não se desfaz: é a rede de segurança |
| 2 | `git push staging master:staging` → o workflow constrói e publica em **staging**. **Estado em 2026-10-27**: feito pelo dono do produto (≈ 20:36Z); `https://edumatosr6-svg.github.io/kartle-staging/` serve `index-D0RarhFV.js` desde 20:37:38Z (200 em HTTPS; `check_served.py` 37/37). Rodar `smoke.md` e as linhas humanas H1–H6 do `runbook.md` | executor do runbook; testador humano | *Re-run all jobs* da execução 40566728590 (caminho B, volta ao kart de caixas) ou *Unpublish site* (caminho A) — B ensaiado em 2026-10-27, A em 2026-10-21 |
| 3 | **pergunta ao dono do produto** — promover `6ea3862`? (D-DP-06) | dono do produto | não promover |
| 4 | `git push origin master` → o workflow constrói em `edumatosr6-svg/kartle` e **para à espera do revisor** no ambiente `github-pages`; o dono do produto clica *Approve and deploy*; o cache do Pages renova em até 10 min. Atenção ao grupo de concorrência `pages`: cada push novo **cancela** a execução de produção que esperava atrás da mais antiga, por isso aprovar sempre a execução **mais recente** cujo `build` esteja verde, e conferir que o seu commit é `6ea3862` (ou um posterior só de registro, que não toque `src/`, `scripts/`, `tests/`, `index.html`, `package.json` nem o lockfile) | dono do produto | R1 do `runbook.md` |
| 5 | `smoke.md`, seção *Verificação em produção*, e vigilância por 24 h (`REL-0005`) | dono do produto | idem 4 |

Não há parte destrutiva adiada para uma release seguinte: nada é removido de nenhum armazenamento. O kart de caixas e a câmera
alta **saem do código** nesta release (CHK-TEST-0004-01: `src/main.ts` sem `boxGeo`, `helmet`, `camera.position.lerp`) — a sua
volta é a do repositório (ADR-0003), não de uma chave.

## Staging e produção no GitHub Pages — o que existe

Tudo o que a primeira release criou e configurou (D23, 2026-10-21) é reutilizado sem alteração; a tabela completa está em
`600 Deploy/Output/race-lap-validation/REL-0003-rollout.md`. O que importa a quem executa:

| | Produção | Staging |
|---|---|---|
| Repositório | `edumatosr6-svg/kartle` (este), remoto local `origin` | `edumatosr6-svg/kartle-staging`, remoto local `staging` |
| Ramo que publica | `master` | `staging` (`git push staging master:staging`) |
| URL | `https://edumatosr6-svg.github.io/kartle/` | `https://edumatosr6-svg.github.io/kartle-staging/` |
| Settings → Pages → *Source* | GitHub Actions — configurado | GitHub Actions — configurado |
| Ambiente `github-pages` → *Required reviewers* | `edumatosr6-svg` — o clique é a promoção (D-DP-06) | nenhum |
| Ambiente `github-pages` → *Deployment branches and tags* | restrição padrão (só `master`) — mantida como segunda tranca | **No restriction** — liberada em 2026-10-21; **volta à restrição padrão a cada despublicação/reativação do Pages** (observado no ensaio de 2026-10-21): refazer a liberação antes de um *Re-run all jobs* depois do caminho A, senão o `deploy` falha com zero passos. No ensaio do caminho B de 2026-10-27 não foi preciso, porque o site não foi despublicado |
| Estado em 2026-10-27 | nenhuma execução verde; nada servido | execução do push de `6ea3862` verde (publicou às 20:37:38Z); serve `index-D0RarhFV.js` |

## Feature flag e quem "liga" a feature

Não há flag (ADR-0003, *Sem chave mestra*: "proibida pelo F-Spec e deixaria a feature invisível na entrega"; o padrão neutro de
I4 vale porque nada da simulação muda — `RENDER_NEUTRAL`, `SIM_CONTRACT`, `DETERMINISM`). A feature fica ativa para 100 % dos
jogadores no instante em que o `index.html` novo é servido. Quem a liga é o dono do produto ao executar o passo 4; o que ele
observa está em `REL-0005` e os limiares que mandam reverter, no `runbook.md`. Não há remoção de flag a agendar.

## Janela de compatibilidade e versão mínima do cliente

| Pergunta | Resposta |
|---|---|
| O que o código antigo precisa continuar funcionando contra | nada: não há servidor, contrato de rede nem dado persistido compartilhado entre as versões (DES-0007; `REL-0002`) |
| Por quanto tempo as duas versões coexistem | **até 10 min**: o Pages serve todo arquivo com `Cache-Control: max-age=600` (confirmado hoje na resposta de staging) e serve só a implantação corrente; uma página antiga ainda aberta continua a correr em memória com o kart de caixas |
| Versão mínima do cliente | não há versão instalada: a página é o cliente. Navegadores de referência: Chrome, Edge, Firefox e Safari nas versões atuais (`test-strategy.md`), em `web-desktop` e `web-mobile`; a placa exige um contexto canvas 2D (`kart01-decals`/`NO_2D_CONTEXT` quando falta); a inclinação exige `window.isSecureContext` (HTTPS) |
| Atualização forçada | não se aplica; o único mecanismo é o cache |
| Registros entre versões | iguais nas duas versões: o registro de volta e o texto compartilhado não mudaram (`src/lap.ts` 0 linhas) |

### Regra de cache — o que o GitHub Pages aplica (não configurável)

Inalterada e medida de novo hoje: `index.html` e *assets* com `Cache-Control: max-age=600`, sem comando de purga; os nomes dos
*assets* carregam hash de conteúdo (`index-D0RarhFV.js` nesta release, `index-BiFxJ0FY.js` na anterior; o CSS `index-dgojskay.css`
é o mesmo); o Pages serve apenas a implantação corrente, por isso os *assets* da versão anterior deixam de responder quando esta
a substitui — mitigado pelos 10 min e por o bundle ser um único módulo carregado na abertura. No ensaio de 2026-10-27 o
observador com `Cache-Control: no-cache` viu a troca de bundle em ≈ 20 s depois do `deploy`; um navegador com a resposta em
cache pode levar até 10 min.

## O pipeline — `.github/workflows/pages.yml`

Inalterado por esta feature (a cerca de escrita deste estágio não cobre `.github/`). Etapas e a saída que aprova cada uma, na
própria execução do Actions:

| # | Etapa | Comando ou ação no workflow | Saída observável que aprova a etapa |
|---|---|---|---|
| 1 | obter o commit | `actions/checkout` do commit do push (`6ea3862` nesta release) | o cabeçalho da execução mostra o hash |
| 2 | Node e instalação | `actions/setup-node` com `node-version-file: .nvmrc` (24) e `cache: npm`; `npm ci` | Node 24.x no log; saída 0; lockfile inalterado |
| 3 | testar | `npm test` | saída 0; **296** aprovados, 0 reprovados, 0 pulados (59 desta feature) |
| 4 | construir | `npm run build -- --base=/kartle/` em produção, `--base=/kartle-staging/` em staging | saída 0; o log do Vite lista `dist/index.html`, `dist/assets/index-<hash>.js` (esperado `D0RarhFV` para a árvore de `6ea3862`), `dist/assets/index-dgojskay.css`; nenhum outro *asset* |
| 5 | medir | `python3 -I "600 Deploy/Output/race-lap-validation/tools/measure_dist.py" dist` (ferramenta da primeira release, reutilizada por referência) | `within_limit=True` (RNF02: abaixo de 3 145 728 bytes); medido localmente: 649 918 bytes |
| 6 | empacotar | `actions/configure-pages`; `actions/upload-pages-artifact` com `path: dist` | artefato `github-pages` anexado à execução |
| 7 | publicar | trabalho `deploy`, ambiente `github-pages`, `actions/deploy-pages` | **staging**: publica de imediato; **produção**: fica em *Waiting* até o revisor clicar *Approve and deploy* (D-DP-06) |
| 8 | conferir o servido | `python -I "600 Deploy/Output/modelo-kart-01/tools/check_served.py" <URL> index-<hash>.js` (humano ou validador; não está no workflow) | `checks=37 failed=0`: 200 em HTTPS, um JS e um CSS sob a base certa, `<hash>` esperado, elementos do HTML, marcadores do Kart 01, número `01`, constantes de câmera, nenhum símbolo do kart provisório, identificadores das releases anteriores, tamanhos |
| 9 | smoke em staging | `smoke.md` + linhas H1–H6 do `runbook.md` (humano) | todas as linhas com resultado dentro do limiar; registro em `docs/kart-01/device-log.md` |
| 10 | **parar** | a execução de produção parada em *deploy* é a pergunta de promoção; o clique é a resposta | aprovação registrada na execução, com quem e quando |
| 11 | verificar | `smoke.md`, *Verificação em produção*, depois dos 10 min de cache | limiares de RNF01, RNF02, RNF06, NFR-0001 e os da tela observados |

## Riscos específicos deste rollout e como são observados

| Risco | Como se vê | Resposta |
|---|---|---|
| `index.html` novo servido com *assets* antigos, ou antigo com *assets* já removidos (janela de 10 min) | tela em branco ou erro de módulo no console (404 em `/kartle/assets/`); `#track-status` nunca sai de "carregando a pista" | esperar os 10 min do `max-age` e recarregar em janela anônima; se persistir, reverter |
| trabalho `deploy` de staging falha **sem executar nenhum passo** (o `build` ficou verde) | `deploy` em vermelho sem passo listado; nenhuma URL publicada | política de ramos do ambiente restrita ao ramo padrão (recriada a cada reativação do Pages): liberar e *Re-run all jobs* (`FAIL` deste estágio, configuração) |
| execução de produção cancelada pelo grupo `pages` antes da aprovação | a execução que esperava aparece `cancelled`; a mais nova espera no lugar dela | aprovar a mais recente com `build` verde, depois de conferir o commit |
| bundle construído sem `--base=/kartle/` | `index.html` referencia `/assets/...` e os *assets* respondem 404 | defeito de empacotamento (`FAIL` deste estágio): restaurar o flag no workflow e reexecutar; `check_served.py` acusa "assets referenciados sob a base" |
| kart de caixas ainda no bundle, ou Kart 01 ausente | caixas em algum quadro; `check_served.py` acusa `helmet`/`boxGeo` presentes ou marcadores ausentes; `CHK-TEST-0004-01` teria falhado em `npm test` | defeito de aplicação (`FAIL CODE`) — mas o `npm test` do workflow o impede de chegar ao `deploy` |
| placa sem o número `01` | o para-choque traseiro liso; console com `kart01-decals`/`NO_2D_CONTEXT` | navegador sem contexto canvas 2D: sintoma de ambiente, não de empacotamento; noutro navegador de referência, `FAIL CODE` |
| kart cortado numa curva de 90° a 50 km/h, em retrato, ou câmera que sobe durante a contagem | observado na tela (H4, H1); `CHK-TEST-0003-08` e `-11` provam a geometria em (1280, 720) e (720, 1280) | defeito de aplicação (`FAIL CODE`), não de empacotamento |
| taxa de quadros abaixo de 60 no notebook ou de 30 no celular (NFR-0001, RNF03), com a sombra e os 27 draw calls | `minFps` em `docs/kart-01/device-log.md` (H6) | reverter; a causa é defeito de aplicação (`FAIL CODE`) ou aparelho fora da referência (I9) |
| download comprimido acima de 3 MB (NFR-0002) | lista de transferências do navegador (H6); `measure_dist.py` no workflow pararia o `build` antes | `FAIL` deste estágio se o workflow deixou passar; hoje 171 137 bytes gzip (5,4 % do limite) |
| staging passou a servir este bundle no lugar do de `b86b200` enquanto as linhas humanas da `dirigibilidade` continuam por executar | `check_served.py` da `dirigibilidade` continua 18/18 sobre este bundle (os seus identificadores e elementos estão nele), mas o fps medido inclui o Kart 01 | decisão do dono do produto (`98-divergences.md`, DIV-DP-12): executar as duas listas na mesma sessão sobre este bundle (a simulação é a mesma), ou reexecutar 40566728590 para medir a `dirigibilidade` isolada e depois reexecutar a execução de `6ea3862` |
| requisição a `fonts.googleapis.com` no carregamento | uma requisição no painel de rede antes da volta | divergência aceita (DIV-DP-10); não é gatilho |
