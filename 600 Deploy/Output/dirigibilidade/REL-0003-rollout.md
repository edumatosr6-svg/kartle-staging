---
id: REL-0003
title: Rollout — ordem de operações, janela de compatibilidade e o pipeline do GitHub Pages
feature: dirigibilidade
stage: deploy
status: validated
version: 2.0.0
sources: [DM-0001, DES-0007, DES-0009, ADR-0001, ADR-0006, NFR-0002, NFR-0008, NFR-0009, TEST-0010]
---

# REL-0003 — Rollout

## Ordem de operações

A ordem típica do estágio (migração aditiva → backend → web → mobile → parte destrutiva) colapsa aqui num único passo: não
há backend, não há banco, não há aplicativo nativo e a "migração" viaja dentro do próprio bundle (`REL-0002`). O que muda
contra a rodada anterior deste registro é que a árvore publicada (`6b314b2`) **contém a Kart Park**, cuja promoção a
produção está bloqueada pela decisão Esri (`pista-kart-park`, ADR-0005): o passo 3 é uma decisão entre opções, não uma
pergunta de sim ou não.

| Ordem | Passo | Quem | Desfaz-se por |
|---|---|---|---|
| 1 | anotar o alvo de reversão: em `edumatosr6-svg/kartle-staging`, a última execução verde **anterior** à desta release é a **41076989728** (commit `652bbaa`, `assets/index-dD_vz2Ev.js`; acerto v6 com o drift ainda nas telas); em `edumatosr6-svg/kartle`, **não há** execução verde (nada promovido) — o alvo de produção é o site não publicado (caminho A) | executor do runbook | não se desfaz: é a rede de segurança |
| 2 | `git push staging master:staging` → o workflow constrói e publica em **staging**. **Estado em 2026-10-30**: feito; a execução **41101055606** (commit `6b314b2`) concluiu `build` (`npm test` 443/443, `Measure dist` `within_limit=True`) e `deploy` às 17:48:12Z, e `https://edumatosr6-svg.github.io/kartle-staging/` serve `index-BwruE9Pq.js` (200 em HTTPS; `check_served.py` 22/22). Rodar `smoke.md` e as linhas humanas H1–H5 do `runbook.md` | executor do runbook; testador humano | *Re-run all jobs* da execução 41076989728 (caminho B; ensaiado neste site em 2026-10-27 com outro par) ou *Unpublish site* (caminho A) |
| 3 | **decisão do dono do produto** (D-DP-06) entre as opções de `01-release.md`, *Promoção*: (1) esperar a decisão Esri e promover tudo junto — a única que entrega esta release; (2) publicar `6ea3862` sem Kart Park — que **não** entrega esta release (acerto v5 com drift). Um commit "acerto C sem Kart Park" não existe | dono do produto | não promover |
| 4 | só com a decisão Esri registrada e a entrega de `pista-kart-park` que a aplica: `git push origin master` → o workflow constrói em `edumatosr6-svg/kartle` e **para à espera do revisor** no ambiente `github-pages`; o dono do produto clica *Approve and deploy*; o cache do Pages renova em até 10 min. Aprovar sempre a execução **mais recente** cujo `build` esteja verde e cujo commit seja `6b314b2` ou um descendente que só acrescente registros ou a entrega Esri; nunca a 39827702391 (`05c3570`), que estava `pending` na leitura de 2026-10-27 (relatório de validação anterior) | dono do produto | R1 do `runbook.md` (caminho A) |
| 5 | `smoke.md`, seção *Verificação em produção*, e vigilância por 24 h (`REL-0005`) | dono do produto | idem 4 |

Não há parte destrutiva nesta release: nada é removido de nenhum armazenamento; `ARCADE_KART` (v4) permanece como
`previousConfig` e `ARCADE_ASSISTIDO_V5` como base do v6 (ADR-0001). A parte destrutiva adiada é a retirada final de
`src/maneuvers.ts` e de `State.maneuvers` (ADR-0006), numa entrega futura com o seu próprio gatilho.

## Staging e produção no GitHub Pages — o que existe

Tudo o que a release de `race-lap-validation` criou e configurou (D23, 2026-10-21) é reutilizado sem alteração; a tabela
completa está em `600 Deploy/Output/race-lap-validation/REL-0003-rollout.md`. O que importa a quem executa:

| | Produção | Staging |
|---|---|---|
| Repositório | `edumatosr6-svg/kartle` (este), remoto local `origin` | `edumatosr6-svg/kartle-staging`, remoto local `staging` |
| Ramo que publica | `master` | `staging` (`git push staging master:staging`) |
| URL | `https://edumatosr6-svg.github.io/kartle/` | `https://edumatosr6-svg.github.io/kartle-staging/` |
| Settings → Pages → *Source* | GitHub Actions — configurado | GitHub Actions — configurado |
| Ambiente `github-pages` → *Required reviewers* | `edumatosr6-svg` — o clique é a promoção (D-DP-06) | nenhum |
| Ambiente `github-pages` → *Deployment branches and tags* | restrição padrão (só `master`) — mantida como segunda tranca | **No restriction**; **volta à restrição padrão a cada despublicação/reativação do Pages**: refazer a liberação antes de um *Re-run all jobs* depois do caminho A, senão o `deploy` falha com zero passos |
| Estado em 2026-10-30 | nenhuma execução verde; nada servido; `origin/master` = `05c3570` | execução 41101055606 (`6b314b2`) verde; serve `index-BwruE9Pq.js` |

## Feature flag e quem "liga" a feature

Não há flag (DES-0007 e DES-0009, *Feature flag*; ADR-0001, ADR-0006): a escolha do acerto já existe na página
(`#handling-preset`, opção `arcade` selecionada por padrão) e aponta para o dado publicado v6; **não há chave para a versão
anterior nem para religar o drift**. A feature fica ativa para 100 % dos jogadores no instante em que o `index.html` novo é
servido. Quem a liga é o dono do produto ao executar o passo 4; o que ele observa está em `REL-0005` e os limiares que mandam
reverter, no `runbook.md`. O jogador pode escolher o Realista (`realista-aluguel-4t-v4`, inalterado) — escolha de acerto,
não chave de rollout.

## Janela de compatibilidade e versão mínima do cliente

| Pergunta | Resposta |
|---|---|
| O que o código antigo precisa continuar funcionando contra | nada: não há servidor, contrato de rede nem dado persistido compartilhado entre as versões (DES-0008; DM-0001) |
| Por quanto tempo as duas versões coexistem | **até 10 min**: o Pages serve todo arquivo com `Cache-Control: max-age=600` (confirmado de novo hoje na resposta de staging) e serve só a implantação corrente; uma página antiga ainda aberta continua a correr em memória |
| Versão mínima do cliente | não há versão instalada: a página é o cliente. Navegadores de referência: Chrome, Edge, Firefox e Safari nas versões atuais (`test-strategy.md`), em `web-desktop` e `web-mobile`; a inclinação exige `window.isSecureContext` (HTTPS) |
| Atualização forçada | não se aplica; o único mecanismo é o cache |
| Registros entre versões | um registro sem `setupVersion` é lido como `arcade-assistido-v4` (`RESOLVED_FROM_ABSENCE`, NFR-0009); um tempo de outra versão nunca é comparado com um tempo v6 (`SETUP_VERSION_DIFFERS`, RULE-0003) |

### Regra de cache — o que o GitHub Pages aplica (não configurável)

Inalterada e medida de novo hoje: `index.html` e *assets* com `Cache-Control: max-age=600`, sem comando de purga; os nomes
dos *assets* carregam hash de conteúdo (`index-BwruE9Pq.js` e `index-oR7KyBh_.css` nesta release, `index-dD_vz2Ev.js` e
`index-CW8t98so.css` na execução anterior de staging); o Pages serve apenas a implantação corrente, por isso os *assets* da
versão anterior deixam de responder quando esta a substitui — mitigado pelos 10 min e por o bundle ser um único módulo
carregado na abertura.

## O pipeline — `.github/workflows/pages.yml`

Inalterado por esta feature (a cerca de escrita deste estágio não cobre `.github/`). Etapas e a saída que aprova cada uma, na
própria execução do Actions:

| # | Etapa | Comando ou ação no workflow | Saída observável que aprova a etapa |
|---|---|---|---|
| 1 | obter o commit | `actions/checkout` do commit do push (`6b314b2` nesta release) | o cabeçalho da execução mostra o hash |
| 2 | Node e instalação | `actions/setup-node` com `node-version-file: .nvmrc` (24) e `cache: npm`; `npm ci` | Node 24.x no log; saída 0; lockfile inalterado |
| 3 | testar | `npm test` | saída 0; **443** aprovados, 0 reprovados, 0 pulados (65 desta feature) |
| 4 | construir | `npm run build -- --base=/kartle/` em produção, `--base=/kartle-staging/` em staging | saída 0; o log do Vite lista `dist/index.html`, `dist/assets/index-BwruE9Pq.js` (694,09 kB) e `dist/assets/index-oR7KyBh_.css` para a árvore de `6b314b2` |
| 5 | medir | `python3 -I "600 Deploy/Output/race-lap-validation/tools/measure_dist.py" dist` | `within_limit=True` (RNF02); na execução 41101055606: `total_bytes=711477` |
| 6 | empacotar | `actions/configure-pages`; `actions/upload-pages-artifact` com `path: dist` | artefato `github-pages` anexado à execução |
| 7 | publicar | trabalho `deploy`, ambiente `github-pages`, `actions/deploy-pages` | **staging**: publica de imediato; **produção**: fica em *Waiting* até o revisor clicar *Approve and deploy* (D-DP-06) |
| 8 | conferir o servido | `python -I "600 Deploy/Output/dirigibilidade/tools/check_served.py" <URL> index-<hash>.js` (humano ou validador; não está no workflow) | `checks=22 failed=0`: 200 em HTTPS, um JS e um CSS sob a base certa, `<hash>` esperado, elementos do HUD, `#lap-result-setup` ausente, HTML sem drift nem turbo, dica `Dirigir`, toque com 4 controles, v6 corrente com v4 anterior, v5 ausente |
| 9 | smoke em staging | `smoke.md` + linhas H1–H5 do `runbook.md` (humano) | todas as linhas com resultado dentro do limiar; registro em `docs/handling-device-log.md` |
| 10 | **parar** | a decisão de promoção (passo 3 acima); a execução de produção parada em *deploy* só existe depois do push do passo 4 | decisão registrada no relatório de validação e em `DOMAIN.md` |
| 11 | verificar | `smoke.md`, *Verificação em produção*, depois dos 10 min de cache | limiares de RNF01, RNF02, RNF06 e NFR-0009 observados |

## Riscos específicos deste rollout e como são observados

| Risco | Como se vê | Resposta |
|---|---|---|
| promover por engano a Kart Park antes da decisão Esri (um push de `master` a `origin` aprovado) | a execução de produção com commit de `master` posterior a `ba221ad` em *Waiting* | **Reject** na revisão; se já aprovada, R1 caminho A (`runbook.md`): despublicar e registrar |
| promover `6ea3862` julgando que leva esta release | produção com `#preset-label` do Arcade, mas Espaço muda a pilotagem e a tela mostra a dica de drift e o botão "Drift" | não é defeito de empacotamento: é a release anterior desta feature (v5 com drift). A opção 2 não entrega o acerto C |
| `index.html` novo servido com *assets* antigos, ou antigo com *assets* já removidos (janela de 10 min) | tela em branco ou erro de módulo no console (404 em `/kartle/assets/`) | esperar os 10 min do `max-age` e recarregar em janela anônima; se persistir, reverter |
| trabalho `deploy` de staging falha **sem executar nenhum passo** (o `build` ficou verde) | `deploy` em vermelho sem passo listado | política de ramos do ambiente restrita ao ramo padrão: liberar e *Re-run all jobs* (`FAIL` deste estágio, configuração) |
| bundle construído sem `--base=/kartle/` | `index.html` referencia `/assets/...` e os *assets* respondem 404 | defeito de empacotamento; `check_served.py` acusa "assets referenciados sob a base" |
| acerto errado no bundle (por exemplo, ainda o v5) | `check_served.py` reprova "v6 corrente com v4 anterior" e "v5 ausente"; a curva volta a abrir (raio de 17 a 25 m); `CHK-TEST-0008-*` teria falhado em `npm test` | defeito de aplicação (`FAIL CODE`) — o `npm test` do workflow o impede de chegar ao `deploy` |
| drift ou turbo de volta numa tela | `check_served.py` reprova as linhas de drift, dica ou toque; H3 vê o texto ou o botão | defeito de aplicação (`FAIL CODE`); `CHK-TEST-0007-07..10` teriam falhado em `npm test` |
| custo por passo acima de 1,10 × a linha de base (NFR-0002) ou queda de taxa de quadros (RNF03) | `STEP_COST` `FAIL` no `bench:handling` da máquina de referência; fps abaixo de 60 no notebook ou de 30 no celular (H5) | reverter; defeito de aplicação (`FAIL CODE`). Medido em 2026-10-30: 181,3 µs contra 173,9 µs (1,04 ×, `PASS`) |
| sensor de inclinação indisponível em `web-mobile` | a página avisa "Inclinação indisponível" quando `window.isSecureContext` é falso | sintoma de HTTPS ausente (RNF06): corrigir o certificado, não o código |
| requisição a `fonts.googleapis.com` no carregamento | uma requisição no painel de rede antes da volta | divergência aceita (DIV-DP-10); não é gatilho |
