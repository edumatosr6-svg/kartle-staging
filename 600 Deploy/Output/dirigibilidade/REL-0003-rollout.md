---
id: REL-0003
title: Rollout — ordem de operações, janela de compatibilidade e o pipeline do GitHub Pages
feature: dirigibilidade
stage: deploy
status: validated
version: 1.0.0
sources: [DM-0001, DES-0007, ADR-0001, NFR-0002, NFR-0008, NFR-0009, TEST-0010]
---

# REL-0003 — Rollout

## Ordem de operações

A ordem típica do estágio (migração aditiva → backend → web → mobile → parte destrutiva) colapsa aqui num único passo,
pela mesma razão estrutural da release anterior: não há backend, não há banco, não há aplicativo nativo e a "migração"
viaja dentro do próprio bundle (`REL-0002`). O que muda contra `race-lap-validation` é que **agora existe uma execução
verde anterior em staging** — o caminho B de reversão passa a existir lá.

| Ordem | Passo | Quem | Desfaz-se por |
|---|---|---|---|
| 1 | anotar o alvo de reversão: em `edumatosr6-svg/kartle-staging`, a última execução verde **anterior** à desta release é a **39631099098** (commit `2bee672`, árvore `c41c6c3`, `assets/index-Cqfgl3da.js`); em `edumatosr6-svg/kartle`, **não há** execução verde (nada promovido) — o alvo de produção é o site não publicado (caminho A) ou, se a execução da árvore anterior ainda estiver em *Waiting*, a sua aprovação (`runbook.md`) | executor do runbook | não se desfaz: é a rede de segurança |
| 2 | `git push staging master:staging` → o workflow constrói e publica em **staging**. **Estado em 2026-10-27**: feito pelo dono do produto; a execução do push de `b86b200` concluiu `build` e `deploy` (condutor do loop) e `https://edumatosr6-svg.github.io/kartle-staging/` serve `index-BiFxJ0FY.js` desde 19:11:49Z (200 em HTTPS; `check_served.py` 18/18). Rodar `smoke.md` e as linhas humanas H1–H5 do `runbook.md` | executor do runbook; testador humano | *Re-run all jobs* da execução 39631099098 (caminho B, volta ao v4) ou *Unpublish site* (caminho A) — ambos ensaiados em 2026-10-21 (release anterior) |
| 3 | **pergunta ao dono do produto** — promover `b86b200`? (D-DP-06) | dono do produto | não promover |
| 4 | `git push origin master` → o workflow constrói em `edumatosr6-svg/kartle` e **para à espera do revisor** no ambiente `github-pages`; o dono do produto clica *Approve and deploy*; o cache do Pages renova em até 10 min. Atenção ao grupo de concorrência `pages`: cada push novo **cancela** a execução de produção que esperava atrás da mais antiga, por isso aprovar sempre a execução **mais recente** cujo `build` esteja verde, e conferir que o seu commit é `b86b200` (ou um posterior só de registro, que não toque `src/`, `scripts/`, `tests/`, `index.html`, `docs/physics.md` nem o lockfile) | dono do produto | R1 do `runbook.md` |
| 5 | `smoke.md`, seção *Verificação em produção*, e vigilância por 24 h (`REL-0005`) | dono do produto | idem 4 |

Não há parte destrutiva adiada para uma release seguinte: nada é removido de nenhum armazenamento; `ARCADE_KART` (v4)
permanece no código como `previousConfig` e linha de base (ADR-0001) — a sua remoção, se vier, é uma release futura
com a sua própria versão de acerto.

## Staging e produção no GitHub Pages — o que existe

Tudo o que a release anterior criou e configurou (D23, 2026-10-21) é reutilizado sem alteração; a tabela completa está em
`600 Deploy/Output/race-lap-validation/REL-0003-rollout.md`. O que importa a quem executa:

| | Produção | Staging |
|---|---|---|
| Repositório | `edumatosr6-svg/kartle` (este), remoto local `origin` | `edumatosr6-svg/kartle-staging`, remoto local `staging` |
| Ramo que publica | `master` | `staging` (`git push staging master:staging`) |
| URL | `https://edumatosr6-svg.github.io/kartle/` | `https://edumatosr6-svg.github.io/kartle-staging/` |
| Settings → Pages → *Source* | GitHub Actions — configurado | GitHub Actions — configurado |
| Ambiente `github-pages` → *Required reviewers* | `edumatosr6-svg` — o clique é a promoção (D-DP-06) | nenhum |
| Ambiente `github-pages` → *Deployment branches and tags* | restrição padrão (só `master`) — mantida como segunda tranca | **No restriction** — liberada em 2026-10-21; **volta à restrição padrão a cada despublicação/reativação do Pages** (observado no ensaio de R1/R2): refazer a liberação antes de um *Re-run all jobs* depois do caminho A, senão o `deploy` falha com zero passos |
| Estado em 2026-10-27 | nenhuma execução verde; nada servido | execução do push de `b86b200` verde; serve `index-BiFxJ0FY.js` |

## Feature flag e quem "liga" a feature

Não há flag (DES-0007, *Feature flag*; ADR-0001): a escolha do acerto já existe na página (`#handling-preset`, opção
`arcade` selecionada por padrão) e passa a apontar para o dado publicado v5; **não há chave para a versão anterior**. A
feature fica ativa para 100 % dos jogadores no instante em que o `index.html` novo é servido. Quem a liga é o dono do
produto ao executar o passo 4; o que ele observa está em `REL-0005` e os limiares que mandam reverter, no `runbook.md`.
Não há remoção de flag a agendar. O jogador pode, na própria página, escolher o Realista (`realista-aluguel-4t-v4`,
inalterado) — é escolha de acerto, não chave de rollout.

## Janela de compatibilidade e versão mínima do cliente

| Pergunta | Resposta |
|---|---|
| O que o código antigo precisa continuar funcionando contra | nada: não há servidor, contrato de rede nem dado persistido compartilhado entre as versões (DES-0008; DM-0001) |
| Por quanto tempo as duas versões coexistem | **até 10 min**: o Pages serve todo arquivo com `Cache-Control: max-age=600` (confirmado hoje na resposta de staging) e serve só a implantação corrente; uma página antiga ainda aberta continua a correr em memória com o acerto v4 |
| Versão mínima do cliente | não há versão instalada: a página é o cliente. Navegadores de referência: Chrome, Edge, Firefox e Safari nas versões atuais (`test-strategy.md`), em `web-desktop` e `web-mobile`; a inclinação exige `window.isSecureContext` (HTTPS) |
| Atualização forçada | não se aplica; o único mecanismo é o cache |
| Registros entre versões | um texto compartilhado ou replay produzido pela versão anterior não traz `setupVersion` e é lido por esta como `arcade-assistido-v4` (`RESOLVED_FROM_ABSENCE`, NFR-0009); nunca é comparado com um tempo v5 (`SETUP_VERSION_DIFFERS`, RULE-0003) |

### Regra de cache — o que o GitHub Pages aplica (não configurável)

Inalterada e medida de novo hoje: `index.html` e *assets* com `Cache-Control: max-age=600`, sem comando de purga; os
nomes dos *assets* carregam hash de conteúdo (`index-BiFxJ0FY.js` nesta release, `index-Cqfgl3da.js` na anterior; o CSS
`index-dgojskay.css` é o mesmo); o Pages serve apenas a implantação corrente, por isso os *assets* da versão anterior
deixam de responder quando esta a substitui — mitigado pelos 10 min e por o bundle ser um único módulo carregado na
abertura. No ensaio de 2026-10-21, depois de despublicar, um navegador viu o 404 em ≈ 1 min e um cliente com a resposta
em cache de borda continuou a receber 200 por mais de 6 min: a janela de 10 min vale também para a reversão.

## O pipeline — `.github/workflows/pages.yml`

Inalterado por esta feature (a cerca de escrita deste estágio não cobre `.github/`). Etapas e a saída que aprova cada
uma, na própria execução do Actions:

| # | Etapa | Comando ou ação no workflow | Saída observável que aprova a etapa |
|---|---|---|---|
| 1 | obter o commit | `actions/checkout` do commit do push (`b86b200` nesta release) | o cabeçalho da execução mostra o hash |
| 2 | Node e instalação | `actions/setup-node` com `node-version-file: .nvmrc` (24) e `cache: npm`; `npm ci` | Node 24.x no log; saída 0; lockfile inalterado |
| 3 | testar | `npm test` | saída 0; **237** aprovados, 0 reprovados, 0 pulados (65 desta feature) |
| 4 | construir | `npm run build -- --base=/kartle/` em produção, `--base=/kartle-staging/` em staging | saída 0; o log do Vite lista `dist/index.html`, `dist/assets/index-<hash>.js` (esperado `BiFxJ0FY` para a árvore de `b86b200`), `dist/assets/index-dgojskay.css` |
| 5 | medir | `python3 -I "600 Deploy/Output/race-lap-validation/tools/measure_dist.py" dist` (ferramenta da release anterior, reutilizada por referência) | `within_limit=True` (RNF02: abaixo de 3 145 728 bytes); medido localmente: 598 028 bytes |
| 6 | empacotar | `actions/configure-pages`; `actions/upload-pages-artifact` com `path: dist` | artefato `github-pages` anexado à execução |
| 7 | publicar | trabalho `deploy`, ambiente `github-pages`, `actions/deploy-pages` | **staging**: publica de imediato; **produção**: fica em *Waiting* até o revisor clicar *Approve and deploy* (D-DP-06) |
| 8 | conferir o servido | `python -I "600 Deploy/Output/dirigibilidade/tools/check_served.py" <URL> index-<hash>.js` (humano ou validador; não está no workflow) | `checks=18 failed=0`: 200 em HTTPS, um JS e um CSS sob a base certa, `<hash>` esperado, elementos do HUD e do resultado, três identificadores de acerto no JS servido |
| 9 | smoke em staging | `smoke.md` + linhas H1–H5 do `runbook.md` (humano) | todas as linhas com resultado dentro do limiar; registro em `docs/handling-device-log.md` |
| 10 | **parar** | a execução de produção parada em *deploy* é a pergunta de promoção; o clique é a resposta | aprovação registrada na execução, com quem e quando |
| 11 | verificar | `smoke.md`, *Verificação em produção*, depois dos 10 min de cache | limiares de RNF01, RNF02, RNF06 e NFR-0009 observados |

## Riscos específicos deste rollout e como são observados

| Risco | Como se vê | Resposta |
|---|---|---|
| `index.html` novo servido com *assets* antigos, ou antigo com *assets* já removidos (janela de 10 min) | tela em branco ou erro de módulo no console (404 em `/kartle/assets/`); `#track-status` nunca sai de "carregando a pista" | esperar os 10 min do `max-age` e recarregar em janela anônima; se persistir, reverter |
| trabalho `deploy` de staging falha **sem executar nenhum passo** (o `build` ficou verde) | `deploy` em vermelho sem passo listado; nenhuma URL publicada | política de ramos do ambiente restrita ao ramo padrão (recriada a cada reativação do Pages): liberar e *Re-run all jobs* (`FAIL` deste estágio, configuração) |
| execução de produção cancelada pelo grupo `pages` antes da aprovação | a execução que esperava aparece `cancelled`; a mais nova espera no lugar dela | aprovar a mais recente com `build` verde, depois de conferir o commit |
| bundle construído sem `--base=/kartle/` | `index.html` referencia `/assets/...` e os *assets* respondem 404 | defeito de empacotamento (`FAIL` deste estágio): restaurar o flag no workflow e reexecutar; `check_served.py` acusa "assets referenciados sob a base" |
| acerto errado no bundle (por exemplo, `config` ainda a apontar para `ARCADE_KART`) | `#lap-result-setup` mostra `arcade-assistido-v4` ou vazio; o texto compartilhado sem `arcade-assistido-v5`; `CHK-TEST-0008-*` teria falhado em `npm test` | defeito de aplicação (`FAIL CODE`) — mas o `npm test` do workflow o impede de chegar ao `deploy` |
| custo por passo acima de 1,10 × a linha de base (NFR-0002) ou queda de taxa de quadros (RNF03) | `STEP_COST` `FAIL` no `bench:handling` da máquina de referência; fps abaixo de 60 no notebook ou de 30 no celular (H4/H5 do `runbook.md`) | reverter; a causa é defeito de aplicação (`FAIL CODE`), não de empacotamento. Medido hoje: 220,4 µs contra 203,3 µs (1,084 ×, `PASS`) |
| sensor de inclinação indisponível em `web-mobile` | a página avisa "Inclinação indisponível" quando `window.isSecureContext` é falso | sintoma de HTTPS ausente (RNF06): corrigir o certificado, não o código |
| requisição a `fonts.googleapis.com` no carregamento | uma requisição no painel de rede antes da volta | divergência aceita (DIV-DP-14 da release anterior); não é gatilho |
