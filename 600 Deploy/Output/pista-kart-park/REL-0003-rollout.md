---
id: REL-0003
title: Rollout — staging agora, produção bloqueada pela decisão Esri; ordem de operações, janela de compatibilidade e o pipeline do GitHub Pages
feature: pista-kart-park
stage: deploy
status: validated
version: 1.0.0
sources: [DES-0005, DES-0007, DES-0011, DES-0012, DM-0002, ADR-0005, NFR-0002, NFR-0004, NFR-0005, NFR-0010, NFR-0011, NFR-0012, TEST-0009, TEST-0012]
---

# REL-0003 — Rollout

## Ordem de operações

A ordem típica do estágio (migração aditiva → backend → web → mobile → parte destrutiva) colapsa aqui num único passo, pela mesma
razão estrutural das três releases anteriores: não há backend, não há banco, não há aplicativo nativo e não há migração de dado
(`REL-0002`). O que muda contra a `modelo-kart-01` é que **a sequência para em staging**: a promoção a produção está bloqueada
por projeto até a decisão Esri (ADR-0005; NFR-0012; DOMAIN.md, decisão *Licença* de 2026-10-22), e o passo de produção desta
tabela só existe para dizer o que **não** fazer.

| Ordem | Passo | Quem | Desfaz-se por |
|---|---|---|---|
| 1 | anotar o alvo de reversão: em `edumatosr6-svg/kartle-staging`, a última execução verde **anterior** à desta release é a **40579585592** (commit `6ea3862`, `assets/index-D0RarhFV.js`, 631 352 bytes; validada em `600 Deploy/Output/modelo-kart-01/reports/deploy-validation/deploy-validation-20261027-2057.md`); em `edumatosr6-svg/kartle`, **não há** execução verde (404 hoje; `origin/master` = `05c3570`) | executor do runbook | não se desfaz: é a rede de segurança |
| 2 | `git push staging master:staging` → o workflow constrói e publica em **staging**. **Estado em 2026-10-27**: feito pelo dono do produto às 23:39:04Z (`.git/refs/remotes/staging/staging` = `d9139a2`); às 23:46Z a URL ainda servia `index-D0RarhFV.js` (execução em curso ou cache de 10 min) — o esperado é `index-DYFBop8t.js` e `check_served.py` 74/74. Rodar `smoke.md` e as linhas humanas H1–H8 do `runbook.md`; registrar em `docs/kart-park-device-log.md` | executor do runbook; testador humano | *Re-run all jobs* da execução 40579585592 (caminho B, volta ao bundle sem a Kart Park) ou *Unpublish site* (caminho A) — procedimento B ensaiado em 2026-10-27, A em 2026-10-21 |
| 3 | **parar.** Não há pergunta de promoção para esta release (D-DP-06 sem objeto): a precondição *Decisão Esri registrada* do `runbook.md` está por marcar. O que o dono do produto decide aqui é (a) a licença Esri e (b) como `dirigibilidade` e o Kart 01 chegam a produção entretanto (`runbook.md`, *Promoção bloqueada*) | dono do produto | — |
| 4 | **não executar nesta release**: `git push origin master` com `d9139a2` ou qualquer commit posterior de `master` criaria em `edumatosr6-svg/kartle` uma execução à espera do revisor cujo bundle contém a Kart Park; aprová-la seria promover a Kart Park sem a decisão (0 promoções antes da decisão — NFR-0012). Se um push desses acontecer por engano, **Reject** na execução (ou deixar expirar) e nada é publicado | — | — |
| 5 | **na entrega que promover** (depois da decisão): código com o crédito da Esri no texto da decisão (REQ-FEAT-0006-14; DES-0011), `npm run track -- promote kart-park 1 --esri-decision "<referência>"` (registro em `PRODUCTION`), testes, nova rodada deste estágio, `git push origin master`, *Approve and deploy*, `smoke.md` *Verificação em produção*, vigilância por 24 h (`REL-0005`) | dono do produto | R1 do `runbook.md` daquela entrega (caminho A, ou B se então existir execução verde) |

Não há parte destrutiva adiada: nada é removido de nenhum armazenamento. O "Circuito Aurora" sai do `index.html` nesta release
(texto de marketing substituído pelo seletor) — a sua volta é a do repositório.

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
| Ambiente `github-pages` → *Deployment branches and tags* | restrição padrão (só `master`) — mantida como segunda tranca | **No restriction** — liberada em 2026-10-21; **volta à restrição padrão a cada despublicação/reativação do Pages**: refazer a liberação antes de um *Re-run all jobs* depois do caminho A, senão o `deploy` falha com zero passos |
| Estado em 2026-10-27 | nenhuma execução verde; 404; `origin/master` = `05c3570` (nem `6ea3862` nem `d9139a2` enviados) | push de `d9139a2` feito às 23:39:04Z; execução por confirmar na aba Actions; a URL servia `index-D0RarhFV.js` às 23:46Z |

## Feature flag e quem "liga" a feature

Não há flag (ADR-0005: nenhuma chave de configuração, de compilação ou de execução; uma chave desligada abriria o jogo na pista
sintética, contra REQ-FEAT-0001-02, e ligada em produção "liberaria a promoção", que o F-Spec exclui). A feature fica ativa para
100 % dos jogadores de **staging** no instante em que o `index.html` novo é servido. Quem a "liga" em produção é o dono do
produto, na entrega que promover, com a decisão Esri registrada — a "chave mestra" de I4 é esse ato humano e registrado
(`tracks/registry.json` em `PRODUCTION` com `esriDecisionRef`). Não há remoção de flag a agendar.

## Janela de compatibilidade e versão mínima do cliente

| Pergunta | Resposta |
|---|---|
| O que o código antigo precisa continuar funcionando contra | nada: não há servidor, contrato de rede nem dado persistido compartilhado entre as versões (DES-0012; `REL-0002`) |
| Por quanto tempo as duas versões coexistem | **até 10 min**: o Pages serve todo arquivo com `Cache-Control: max-age=600` (confirmado hoje na resposta de staging) e serve só a implantação corrente; uma página antiga ainda aberta continua a correr em memória, só com a sintética |
| Versão mínima do cliente | não há versão instalada: a página é o cliente. Navegadores de referência: Chrome, Edge, Firefox e Safari nas versões atuais (`test-strategy.md`); a vibração exige `navigator.vibrate` (ausente, a volta é igual sem pulso — REQ-FEAT-0005-16..19, E2E-06); o som exige `AudioContext` e o som ligado; a inclinação exige `window.isSecureContext` |
| Atualização forçada | não se aplica; o único mecanismo é o cache |
| Registros entre versões | iguais nas duas versões para a sintética; a Kart Park só existe na nova |
| Pistas publicadas para os próximos dias | `kart-park` 1 é imutável; uma correção é a versão 2 (`REL-0002`) |

### Regra de cache — o que o GitHub Pages aplica (não configurável)

Inalterada e medida de novo hoje: `index.html` e *assets* com `Cache-Control: max-age=600`, sem comando de purga; os nomes dos
*assets* carregam hash de conteúdo (`index-DYFBop8t.js` e `index-Dv0Dz75T.css` nesta release, `index-D0RarhFV.js` e
`index-dgojskay.css` na anterior); o Pages serve apenas a implantação corrente, por isso os *assets* da versão anterior deixam de
responder quando esta a substitui — mitigado pelos 10 min e por o bundle ser um único módulo carregado na abertura. Um
observador com `Cache-Control: no-cache` viu a troca em ≈ 20 s no ensaio de 2026-10-27; um navegador com a resposta em cache
pode levar até 10 min.

## O pipeline — `.github/workflows/pages.yml`

Inalterado por esta feature (a cerca de escrita deste estágio não cobre `.github/`). Etapas e a saída que aprova cada uma, na
própria execução do Actions:

| # | Etapa | Comando ou ação no workflow | Saída observável que aprova a etapa |
|---|---|---|---|
| 1 | obter o commit | `actions/checkout` do commit do push (`d9139a2` nesta release) | o cabeçalho da execução mostra o hash |
| 2 | Node e instalação | `actions/setup-node` com `node-version-file: .nvmrc` (24) e `cache: npm`; `npm ci` | Node 24.x no log; saída 0; lockfile inalterado |
| 3 | testar | `npm test` | saída 0; **398** aprovados, 0 reprovados, 0 pulados (102 desta feature: V01–V18 sobre o arquivo publicado e a origem, registro com resumo igual, `promote` recusado sem `--esri-decision`, 0 símbolos de rede ou armazenamento nos módulos, determinismo na Kart Park) |
| 4 | construir | `npm run build -- --base=/kartle/` em produção, `--base=/kartle-staging/` em staging | saída 0; o log do Vite lista `dist/index.html`, `dist/assets/index-<hash>.js` (esperado `DYFBop8t` para a árvore de `d9139a2`), `dist/assets/index-<hash>.css` (`Dv0Dz75T`); nenhum outro *asset* — o arquivo de pista está dentro do JS |
| 5 | medir | `python3 -I "600 Deploy/Output/race-lap-validation/tools/measure_dist.py" dist` (ferramenta da primeira release, reutilizada por referência) | `within_limit=True` (RNF02: abaixo de 3 145 728 bytes); medido localmente: 713 321 bytes |
| 6 | empacotar | `actions/configure-pages`; `actions/upload-pages-artifact` com `path: dist` | artefato `github-pages` anexado à execução |
| 7 | publicar | trabalho `deploy`, ambiente `github-pages`, `actions/deploy-pages` | **staging**: publica de imediato; **produção**: fica em *Waiting* até o revisor clicar — **nesta release, nunca** (D-DP-06; NFR-0012) |
| 8 | conferir o servido | `python -I "600 Deploy/Output/pista-kart-park/tools/check_served.py" <URL> index-<hash>.js` (humano ou validador; não está no workflow) | `checks=74 failed=0`: 200 em HTTPS, um JS e um CSS sob a base certa, `<hash>` esperado, elementos do HTML, o arquivo da Kart Park uma vez no JS com o SHA-256 registrado, 684/38/34/3/1, textos do seletor e do crédito, `vibrate(20)`, `lowpassHz:160`, malhas, nenhum `esri`/`41.45`/`recorde`, releases anteriores, classes do CSS, tamanhos |
| 9 | smoke em staging | `smoke.md` + linhas H1–H8 do `runbook.md` (humano) | todas as linhas com resultado dentro do limiar; registro em `docs/kart-park-device-log.md` |
| 10 | **parar** | não há pergunta de promoção; a precondição *Decisão Esri registrada* do `runbook.md` fica por marcar | — |

## Riscos específicos deste rollout e como são observados

| Risco | Como se vê | Resposta |
|---|---|---|
| **promoção da Kart Park sem a decisão Esri** (um push de `master` a `origin` aprovado por hábito) | execução em `edumatosr6-svg/kartle` à espera do revisor com commit `d9139a2` ou posterior; `check_served.py` desta release passaria em produção | **Reject**; se já aprovada, R1 (caminho A: despublicar) no mesmo instante e registrar a reversão; a regra é 0 promoções antes da decisão (NFR-0012) |
| staging passou a servir este bundle enquanto as portas humanas das releases contidas continuam por executar | `docs/kart-01/device-log.md` "Não executadas"; `docs/handling-device-log.md` inexistente | decisão do dono do produto (`98-divergences.md`, DIV-DP-12): executar as listas daquelas releases sobre este bundle escolhendo "Pista sintética" (a simulação na sintética é a mesma — NFR-0008; `bench:handling` 46/46), ou reexecutar 40579585592 para medir isoladas e depois reexecutar a execução de `d9139a2` |
| `index.html` novo servido com *assets* antigos, ou antigo com *assets* já removidos (janela de 10 min) | tela em branco ou erro de módulo no console (404 em `/kartle-staging/assets/`); `#track-status` nunca sai de "carregando a pista" | esperar os 10 min do `max-age` e recarregar em janela anônima; se persistir, reverter |
| trabalho `deploy` de staging falha **sem executar nenhum passo** (o `build` ficou verde) | `deploy` em vermelho sem passo listado; nenhuma URL publicada | política de ramos do ambiente restrita ao ramo padrão (recriada a cada reativação do Pages): liberar e *Re-run all jobs* (`FAIL` deste estágio, configuração) |
| bundle construído sem `--base=/kartle-staging/` | `index.html` referencia `/assets/...` e os *assets* respondem 404 | defeito de empacotamento (`FAIL` deste estágio); `check_served.py` acusa "assets referenciados sob a base" |
| arquivo da Kart Park ausente ou diferente do registrado (SHA-256) | `check_served.py` acusa "arquivo da Kart Park presente uma vez" ou "SHA-256 … igual ao registrado"; na tela, `#track-status` sem `kart-park` ou `track-data` no console | `FAIL` deste estágio se o `dist/` não veio do commit; `FAIL CODE` se o commit publica outro conteúdo (CHK-TEST-0012-01 o impediria no `npm test` do workflow) |
| `esri` no bundle antes da decisão, ou `41,45`/`recorde` em qualquer tela | `check_served.py` (0 ocorrências hoje); CHK-TEST-0009-07 e CHK-TEST-0001-16 no workflow | `FAIL CODE` |
| crédito OSM/ODbL invisível numa das duas telas (D-DP-04; NFR-0005) | tela (H1, H5; D4, D9, M4, M10); `check_served.py` confirma os três textos e `#track-credit`/`#lap-result-credit` no bundle | `FAIL CODE` (a regra é CHK-TEST-0009-01..04) — e gatilho de reversão |
| zebra sem vibração no celular de referência, ou vibração fora da zebra / na pausa | H4 (M7); `vibrate(20)` está no bundle | `FAIL CODE` (`src/curbFeedback.ts`, laço de `src/main.ts`) ou navegador sem `navigator.vibrate` (ambiente: E2E-06, anotar) |
| som da zebra ausente, contínuo ou indistinto no teclado | H4 (D12) em Chrome e Firefox | `FAIL CODE` (`src/audio.ts`) |
| kart atravessa a barreira, ou ricocheteia de forma estranha | H3 (D11); CHK-TEST-0004-02/-03 provam 0 cruzamentos de 5 a 200 m/s | atravessar: `FAIL CODE`; ricochete inesperado nas velocidades alcançáveis: observação para o D-Spec (poligonal em zigue-zague; `500 Tests/Output/pista-kart-park/98-divergences.md`), não gatilho |
| taxa de quadros abaixo de 60 no notebook ou de 30 no celular (NFR-0002) com asfalto, zebras e 381 instâncias de barreira | `minFps` em `docs/kart-park-device-log.md` (H6) | reverter em staging; a causa é defeito de aplicação (`FAIL CODE`: `src/trackScene.ts`) ou aparelho fora da referência (I9) |
| requisição a outro serviço entre a escolha da pista e o fim da volta (NFR-0004) | painel de rede (H7; D15, M11); CHK-TEST-0011-02 | `FAIL CODE`; a requisição a `fonts.googleapis.com` no carregamento é divergência aceita (DIV-DP-10) e não conta |
| download comprimido acima de 3 MB (RNF02) | lista de transferências (D3, M3); `measure_dist.py` no workflow pararia o `build` antes | `FAIL` deste estágio se o workflow deixou passar; hoje 189 855 bytes gzip (6,0 % do limite) |
