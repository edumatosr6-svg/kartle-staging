---
id: REL-0005
title: Observabilidade — o que a release registra, o que se mede e o que faria soar um alerta
feature: dirigibilidade
stage: deploy
status: validated
version: 2.0.0
sources: [DES-0005, DES-0006, DES-0008, DES-0009, ADR-0006, NFR-0002, NFR-0004, NFR-0005, NFR-0009, TEST-0010]
---

# REL-0005 — Observabilidade

## O que a release acrescenta aos registros do cliente

**Nada que saia do navegador.** A feature não envia telemetria, não chama rede e não grava no navegador (DES-0008;
`CHK-TEST-0010-*`; NFR-0005). O que existe de observável no cliente é a própria tela — `#speed`, `#handling`, o resultado da
volta de treino, o melhor tempo (`—` fora de `COMPARABLE`) — e o console do navegador, onde o único registro desta feature é
um `console.warn` com **códigos e identificadores apenas** (`replay`/`UNREADABLE`, `UNSUPPORTED_FORMAT`, `INCOMPLETE_RECORD`;
DES-0008). O texto compartilhado leva só `trackId`, `trackVersion` e o tempo ou o estado inválido — sem `setupVersion`, sem
segundo tempo, sem drift nem turbo, sem campo de aparelho, idioma, data ou nome (DES-0006). A saída dos benches
(`runtimeId()`) não carrega nome de máquina nem de usuário. A decisão de monitoramento é mantida: **vigilância manual conforme
o runbook, nenhum monitor externo, nenhum envio de telemetria** (`200 Requirements/220 Input/race-lap-validation/DOMAIN.md`,
*Monitoramento*, 2026-10-21; RNF12).

## O que se mede, por requisito, e onde

| Requisito | Métrica | Onde se obtém | Limiar que indica falha |
|---|---|---|---|
| NFR-0009 acerto versionado | versão corrente e anterior declaradas no JS servido | `check_served.py` (v6 corrente com v4 anterior; v5 ausente) e `check_bundle.py` | JS sem `arcade-assistido-v6` como corrente, ou com `arcade-assistido-v5` |
| RULE-0003 comparabilidade | melhor tempo exibido só entre registros `COMPARABLE` | `smoke.md` D9; `runbook.md` H4 | um tempo de outro acerto ou versão apresentado como comparável |
| US-2 curva do acerto C | a curva feita nos grampos e nas curvas fechadas | `runbook.md` H2 (o raio é medido pelo `bench:handling`: 11,67 m a 50 km/h, 11,77 m a 70 km/h; 208,4° em 2 s sem acelerador) | o kart abre a trajetória com esterço cheio a ponto de sair do asfalto onde o raio de 13 m cabe |
| US-3 sem drift nem turbo | efeito da tecla de drift e presença de drift/turbo nas telas | `bench:handling` (`DRIFT_INERT` 0 passos diferentes; `SPEED_CAP`); `check_served.py` (HTML, dica, toque); `runbook.md` H3 | qualquer mudança de pilotagem ao segurar Espaço; qualquer texto, ícone ou controle de drift ou turbo em tela |
| AC-US-0004-06 HUD | `#speed` (km/h) e `#handling` (texto) com valor em todos os quadros; último valor na pausa | `runbook.md` H4 (E2E-01), gravação de tela | qualquer quadro entre o sinal verde e o fim sem valor |
| NFR-0002 custo por passo | média de µs por passo na volta do piloto de teste, na máquina de referência | `npm run bench:handling` (`STEP_COST`), registrado em `docs/physics.md` (2026-10-30: 181,3 µs contra 173,9 µs, 1,04 ×) | acima de 1,10 × a linha de base |
| RNF03 quadros | fps médio e mínimo numa volta completa | `runbook.md` H5 (`docs/handling-device-log.md`) | abaixo de 60 em notebook ou de 30 em celular |
| NFR-0003 paridade | o mesmo HUD e a mesma aderência com inclinação e com teclado | `runbook.md` H1 no celular (E2E-03) | traseira forçada com esterço parcial; estado de aderência diferente para a mesma manobra |
| NFR-0004 documentação | bloco `handling-baseline` com v4, Realista e v6 datada; prosa datada da seção v6 | `check_bundle.py dist docs/physics.md`; leitura da seção em H5 | bloco sem a entrada v6 ou sem data; seção sem ambiente, parâmetros ou resultado |
| RNF01 carregamento | tempo da navegação até o kart responder, cache vazio, 4G | `smoke.md` D2/M2 | 10 s ou mais |
| RNF02 tamanho | bytes de `dist/` no build; bytes transferidos na primeira visita | `measure_dist.py` no workflow (711 477 bytes na execução 41101055606); painel de rede | 3 145 728 bytes ou mais |
| RNF06 HTTPS | certificado válido; 0 recursos em HTTP; inclinação ativa no celular | navegador (cadeado); `check_served.py` recusa URL `http://` | qualquer recurso inseguro ou aviso de certificado |
| Disponibilidade da página | código de resposta do `index.html` e do JS em vigor | **verificação manual em HTTPS** (`runbook.md`, *Verify* 1 e 8) ou `check_served.py` (sem monitor externo, por decisão) | qualquer resposta diferente de 200 |
| Integridade do deploy | o `index.html` servido aponta para o `assets/index-<hash>.js` do build aprovado | `check_served.py <URL> index-<hash>.js` contra o `<hash>` impresso no passo *Build* da execução aprovada (hoje `BwruE9Pq` em staging) | hash divergente |
| Erros no console | erros ao carregar e durante uma volta | `smoke.md` D5/M5 | 1 ou mais erros (um `warn` de replay com código não é erro) |

## O registro de implantações — o histórico do Actions

O **histórico de execuções do workflow `pages`** (`https://github.com/edumatosr6-svg/kartle/actions`; staging em
`https://github.com/edumatosr6-svg/kartle-staging/actions`) é o registro de deploy: cada execução guarda o commit, o resultado
de `npm test`, o log do build com os nomes dos *assets*, a medida de RNF02 e — no trabalho `deploy` — quem aprovou e quando
(D-DP-06). Retenção: 90 dias por padrão; a execução verde anterior é o alvo do caminho B enquanto estiver retida.

Estado em 2026-10-30, lido em staging por `gh run view` (só leitura) e por dois GET; produção não foi consultada:

| Repositório | Execução | Commit | `build` | `deploy` | Leitura |
|---|---|---|---|---|---|
| `kartle-staging` | **41101055606** (esta release) | `6b314b2` | `success` (17:43:26–17:47:57Z; `npm test` 443/443; `total_bytes=711477`) | `success` (17:48:00–17:48:12Z) | serve `index-BwruE9Pq.js` (694 094 bytes) desde 17:48:06 GMT; `check_served.py` 22/22 |
| `kartle-staging` | 41076989728 | `652bbaa` | `success` (`npm test` 393/393; `index-dD_vz2Ev.js` 691,31 kB) | `success` | a última execução verde **anterior** a esta; acerto v6 com o drift ainda nas telas; alvo do caminho B em staging |
| `kartle-staging` | 40566728590 | `b86b200` | `success` | `success` | a release validada na rodada anterior deste registro (v5, `index-BiFxJ0FY.js`) |
| `kartle` (produção) | nenhuma verde; 39827702391 (`05c3570`) estava `pending` em 2026-10-27 | — | — | — | **nada aprovado**; produção nunca serviu um `dist/`; o validador lê o estado em vigor na aba Actions |

## Qual alerta soaria

**Nenhum alerta automático sobre a página servida — por decisão mantida.** O GitHub Pages não oferece monitor de
disponibilidade nem registros de acesso; a vigilância é **manual, conforme o runbook**. O único alerta automático é o do
pipeline — uma execução falhada (teste, build ou RNF02) notifica o dono do produto por e-mail do GitHub e nada é publicado;
o `npm test` do workflow inclui os 65 `CHK-TEST-00nn-nn` da feature, de modo que um acerto errado no bundle
(`CHK-TEST-0008-*`), o drift ou o turbo de volta numa tela (`CHK-TEST-0007-05..10`) ou uma dependência de rede ou
armazenamento num módulo de simulação (`CHK-TEST-0010-*`) **param a execução antes do `deploy`**. Sobre a página, o "alerta" é
a vigilância humana do `runbook.md` (D-DP-03): *Verify* ao promover e 24 h depois, com reversão se um limiar da tabela acima
for cruzado. `check_served.py` é a forma reproduzível dessa verificação (dois GET; nenhum dado pessoal).

## Novo modo de falha que esta release introduz, e como se vê

| Modo de falha | Sintoma observável | Diagnóstico |
|---|---|---|
| acerto padrão não é o v6 | `check_served.py` reprova a linha do acerto corrente; a curva volta a abrir (raio de 17 a 25 m com o v5) e o kart passa de 72 km/h na reta | defeito de aplicação (`FAIL CODE`); `CHK-TEST-0008-*` deveria ter falhado no `npm test` do workflow |
| o kart não faz o grampo | com esterço cheio e sem acelerador, o kart não gira 180° em 2 s, ou com acelerador cheio abre mais de 13 m (H2) | defeito de aplicação (`FAIL CODE`); o `bench:handling` (`CORNER_RADIUS`, `CORNER_TURN`) reprova na máquina de referência |
| a tecla de drift volta a ter efeito | segurar Espaço muda a pilotagem ou a velocidade máxima (H3) | defeito de aplicação (`FAIL CODE`); `DRIFT_INERT` ou `SPEED_CAP` reprovam |
| drift ou turbo numa tela | texto, ícone, dica, guia ou botão de drift ou turbo (H3); `check_served.py` reprova | defeito de aplicação (`FAIL CODE`) |
| melhor tempo comparado entre versões | o melhor tempo ou uma diferença aparece depois de trocar de acerto, em vez de `—` | defeito de aplicação (DES-0006; `FAIL CODE`) |
| HUD sem valor em algum quadro, ou valor a mudar durante a pausa | `#speed`/`#handling` vazios ou a avançar com a volta pausada | defeito de aplicação (DES-0005; `FAIL CODE`); observável só na tela (H4) |
| custo por passo acima do limiar | `STEP_COST` `FAIL` no `bench:handling` da máquina de referência; fps abaixo do limiar (H5) | defeito de aplicação (`FAIL CODE`), não de empacotamento |
| *assets* em 404, `deploy` com zero passos, execução cancelada pelo grupo `pages`, cache de 10 min | os mesmos da release de `race-lap-validation` (`600 Deploy/Output/race-lap-validation/REL-0005-observability.md`) | empacotamento ou configuração (`FAIL` deste estágio), com os remédios lá descritos |
