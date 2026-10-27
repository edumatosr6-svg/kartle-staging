---
id: REL-0005
title: Observabilidade — o que a release registra, o que se mede e o que faria soar um alerta
feature: dirigibilidade
stage: deploy
status: validated
version: 1.0.0
sources: [DES-0005, DES-0006, DES-0008, NFR-0002, NFR-0004, NFR-0005, NFR-0009, TEST-0010]
---

# REL-0005 — Observabilidade

## O que a release acrescenta aos registros do cliente

**Nada que saia do navegador.** A feature não envia telemetria, não chama rede e não grava no navegador (DES-0008;
`CHK-TEST-0010-*`; NFR-0005). O que existe de observável no cliente é a própria tela — `#speed`, `#handling`,
`#lap-result-setup`, `#lap-result-total`, o melhor tempo (`—` fora de `COMPARABLE`) — e o console do navegador, onde o
único registro desta feature é um `console.warn` com **códigos e identificadores apenas** (`replay`/`UNREADABLE`,
`UNSUPPORTED_FORMAT`, `INCOMPLETE_RECORD`; DES-0008). O que sai do processo é o texto compartilhado, só com campos de
`LapRecord` (`trackId`, `trackVersion`, tempo ou estado, `setupVersion`) — nenhum campo de aparelho, idioma, data ou nome.
A saída dos benches (`runtimeId()`) não carrega nome de máquina nem de usuário. A decisão de monitoramento da release
anterior é mantida: **vigilância manual conforme o runbook, nenhum monitor externo, nenhum envio de telemetria**
(`200 Requirements/220 Input/race-lap-validation/DOMAIN.md`, *Monitoramento*, 2026-10-21; RNF12).

## O que se mede, por requisito, e onde

| Requisito | Métrica | Onde se obtém | Limiar que indica falha |
|---|---|---|---|
| NFR-0009 acerto versionado | `setupVersion` exibida no resultado e no texto compartilhado | `#lap-result-setup` e o texto compartilhado (`smoke.md` D7/D8, M7); `check_served.py` confirma os três identificadores no JS servido | resultado sem `arcade-assistido-v5` (vazio, `arcade-assistido-v4` ou outro) |
| RULE-0003 comparabilidade | melhor tempo exibido só entre registros `COMPARABLE` | `smoke.md` D9: `—` ao trocar de acerto, nunca uma diferença entre versões | um tempo de outro acerto ou versão apresentado como comparável |
| AC-US-0004-06 HUD | `#speed` (km/h) e `#handling` (texto) com valor em todos os quadros; último valor na pausa | `runbook.md` H1 (E2E-01), gravação de tela | qualquer quadro entre o sinal verde e o fim sem valor |
| NFR-0002 custo por passo | média de µs por passo de `STEP` na volta do piloto de teste, na máquina de referência | `npm run bench:handling` (`STEP_COST`), registrado em `docs/physics.md` (hoje 220,4 µs contra 203,3 µs, 1,084 ×) | acima de 1,10 × a linha de base |
| RNF03 quadros | fps médio e mínimo numa volta completa | `runbook.md` H4 (`docs/handling-device-log.md`) | abaixo de 60 em notebook ou de 30 em celular |
| NFR-0003 paridade | o mesmo HUD e a mesma aderência com inclinação e com teclado | `runbook.md` H3 (E2E-03) | traseira forçada com esterço parcial; estado de aderência diferente para a mesma manobra |
| NFR-0004 documentação | bloco `handling-baseline` com três entradas e `measuredAtUtc` da v5; prosa datada | `check_bundle.py dist docs/physics.md`; revisão de código | bloco sem a entrada v5 ou sem data |
| RNF01 carregamento | tempo da navegação até o kart responder, cache vazio, 4G | `smoke.md` D2/M2 | 10 s ou mais |
| RNF02 tamanho | bytes de `dist/` no build; bytes transferidos na primeira visita | `measure_dist.py` no workflow (598 028 bytes); painel de rede | 3 145 728 bytes ou mais |
| RNF06 HTTPS | certificado válido; 0 recursos em HTTP; inclinação ativa no celular | navegador (cadeado); `check_served.py` recusa URL `http://` | qualquer recurso inseguro ou aviso de certificado |
| Disponibilidade da página | código de resposta do `index.html` e do JS em vigor | **verificação manual em HTTPS** (`runbook.md`, *Verify* 1 e 8) ou `check_served.py`, por decisão do dono do produto (sem monitor externo) | qualquer resposta diferente de 200 |
| Integridade do deploy | o `index.html` servido aponta para o `assets/index-<hash>.js` do build aprovado | `check_served.py <URL> index-<hash>.js` contra o `<hash>` impresso no passo *Build* da execução aprovada (hoje `BiFxJ0FY` em staging) | hash divergente |
| Erros no console | erros ao carregar e durante uma volta | `smoke.md` D5/M5 | 1 ou mais erros (um `warn` de replay com código não é erro) |

## O registro de implantações — o histórico do Actions

Como na release anterior, o **histórico de execuções do workflow `pages`**
(`https://github.com/edumatosr6-svg/kartle/actions`; staging em `https://github.com/edumatosr6-svg/kartle-staging/actions`)
é o registro de deploy: cada execução guarda o commit, o resultado de `npm test` (237 aprovados), o log do build com os
nomes dos *assets*, a medida de RNF02 e — no trabalho `deploy` — quem aprovou e quando (D-DP-06) e a URL publicada.
Retenção: 90 dias por padrão; a execução verde anterior é o alvo do caminho B enquanto estiver retida.

Estado em 2026-10-27, apurado sem executar nada no GitHub (um GET de leitura à URL de staging):

| Repositório | Execução | Commit | `build` | `deploy` | Leitura |
|---|---|---|---|---|---|
| `kartle-staging` | 39631099098 (release anterior) | `2bee672` (árvore `c41c6c3`) | concluído | concluído | a última execução verde **anterior** a esta release; `index-Cqfgl3da.js`; alvo do caminho B em staging |
| `kartle-staging` | **número lido na aba Actions** | `b86b200` | concluído (segundo o condutor do loop) | concluído | `https://edumatosr6-svg.github.io/kartle-staging/` serve `index-BiFxJ0FY.js` desde 19:11:49Z; `check_served.py` 18/18 |
| `kartle` (produção) | 39627810079 (release anterior) e as que a substituíram pelo grupo `pages` | `162b1b3` e posteriores | concluído | *Waiting* ou `cancelled` | **nada aprovado**; produção nunca serviu um `dist/`; a execução em vigor é lida na aba Actions |

O validador confirma o número da execução de staging e o estado da de produção na aba Actions e os cita no relatório;
este registro não os copia (regra herdada: os números em vigor são os da aba Actions, nunca os de um registro).

## Qual alerta soaria

**Nenhum alerta automático sobre a página servida — por decisão mantida.** O GitHub Pages não oferece monitor de
disponibilidade nem registros de acesso, e o dono do produto decidiu em 2026-10-21 que a vigilância é **manual, conforme o
runbook** (abrir a URL publicada após cada deploy); esta release não acrescenta monitor nem telemetria (RNF12; DES-0008).
O único alerta automático é o do pipeline — uma execução falhada (teste, build ou RNF02) notifica o dono do produto por
e-mail do GitHub e nada é publicado; nesta release o `npm test` do workflow inclui os 65 `CHK-TEST-00nn-nn` da feature, de
modo que um acerto errado no bundle (`CHK-TEST-0008-*`) ou uma dependência de rede ou armazenamento num módulo de
simulação (`CHK-TEST-0010-*`) **param a execução antes do `deploy`**. Sobre a página, o "alerta" é a vigilância humana
do `runbook.md` (D-DP-03): *Verify* ao promover e 24 h depois, com reversão se um limiar da tabela acima for cruzado.
`check_served.py` é a forma reproduzível dessa verificação (dois GET; nenhum dado pessoal).

## Novo modo de falha que esta release introduz, e como se vê

| Modo de falha | Sintoma observável | Diagnóstico |
|---|---|---|
| acerto padrão não é o v5 | `#lap-result-setup` mostra `arcade-assistido-v4`, vazio ou outro; o texto compartilhado sem `arcade-assistido-v5`; a resposta do volante volta à anterior | defeito de aplicação (`FAIL CODE`); `CHK-TEST-0008-*` deveria ter falhado no `npm test` do workflow |
| melhor tempo comparado entre versões | o resultado mostra um melhor tempo ou uma diferença depois de trocar de acerto, em vez de `—` | defeito de aplicação (`src/main.ts` `renderBest`, DES-0006; `FAIL CODE`) |
| HUD sem valor em algum quadro, ou valor a mudar durante a pausa | `#speed`/`#handling` vazios ou a avançar com a volta pausada | defeito de aplicação (DES-0005; `FAIL CODE`); observável só na tela (H1) |
| compartilhar falha | aviso "Não foi possível compartilhar." e nenhum registro alterado (DES-0006, comportamento em falha) | em desktop sem `navigator.share`, a área de transferência exige página em primeiro plano e HTTPS — sintoma de contexto, não de empacotamento; em HTTPS com a página ativa, `FAIL CODE` |
| custo por passo acima do limiar | `STEP_COST` `FAIL` no `bench:handling` da máquina de referência; fps abaixo do limiar (H4) | defeito de aplicação (`FAIL CODE`), não de empacotamento |
| *assets* em 404, `deploy` com zero passos, execução cancelada pelo grupo `pages`, cache de 10 min | os mesmos da release anterior (`600 Deploy/Output/race-lap-validation/REL-0005-observability.md`) | empacotamento ou configuração (`FAIL` deste estágio), com os remédios lá descritos |
