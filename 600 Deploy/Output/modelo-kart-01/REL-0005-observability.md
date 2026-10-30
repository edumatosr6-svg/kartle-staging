---
id: REL-0005
title: Observabilidade — o que a release registra, o que se mede e o que faria soar um alerta
feature: modelo-kart-01
stage: deploy
status: validated
version: 1.1.0
sources: [DES-0001, DES-0003, DES-0004, DES-0007, DM-0001, NFR-0001, NFR-0002, NFR-0004, NFR-0005, NFR-0006, TEST-0001, TEST-0004]
---

# REL-0005 — Observabilidade

## O que a release acrescenta aos registros do cliente

**Nada que saia do navegador.** A feature não envia telemetria, não chama rede e não grava no navegador (DES-0007;
`CHK-TEST-0004-*`). O que existe de observável no cliente é a própria tela — o Kart 01, a placa, a sombra, a câmera, as marcas
de pneu, mais o HUD, o seletor e o treino das releases contidas — e o console do navegador, onde o único registro novo desta feature é um
`console.warn` com **códigos apenas**: `kart01-decals`/`NO_2D_CONTEXT`, emitido uma vez quando o navegador não dá contexto canvas
2D para pintar a placa (o modelo continua a ser montado, sem número; DES-0007). Nenhum campo de aparelho, idioma, data ou nome
sai do processo; a saída de `npm run baseline:kart01` não carrega nome de máquina nem de usuário (o fixture guarda um sha de
commit e números da simulação, DM-0001). A decisão de monitoramento das releases anteriores é mantida: **vigilância manual
conforme o runbook, nenhum monitor externo, nenhum envio de telemetria** (`200 Requirements/220 Input/race-lap-validation/DOMAIN.md`,
*Monitoramento*, 2026-10-21; RNF12).

## O que se mede, por requisito, e onde

| Requisito | Métrica | Onde se obtém | Limiar que indica falha |
|---|---|---|---|
| AC-US-0001-14 Kart 01 em toda exibição | quadros com o kart de caixas | tela (H1; `smoke.md` D4, D7, M6, M10); `check_served.py` confirma `helmet`/`boxGeo` ausentes do JS servido | 1 quadro com caixas, ou marcador do kart provisório no bundle |
| AC-US-0001-15 / -16 sombra e placa | sombra no chão junto ao kart; número `01` legível | tela (H2; D7, M6); `check_served.py` confirma `placaTraseira` e o `fillText` de `01` | sombra ausente; placa lisa |
| AC-US-0002-01..06 esterço, giro, volante, mãos, posição e rumo | o que a tela mostra contra o estado | tela (H3; D8, D9, M8); `CHK-TEST-0001-14..18`, `CHK-TEST-0002-*` provam o estado | roda ou volante parado com esterço; deslizamento após reposicionar; movimento na pausa |
| AC-US-0003-08 / -04 kart inteiro no quadro; campo de visão constante | cantos do modelo no quadro numa curva de 90° a 50 km/h, paisagem e retrato; campo de visão com todos os comandos | tela (H4; D10, D13, M7); `CHK-TEST-0003-04`, `-08`; `check_served.py` confirma `turboFovDeltaDeg`/`baseVerticalFovDeg` ausentes | qualquer parte do kart ou do piloto fora do quadro; campo de visão que muda com algum comando |
| AC-US-0003-10..14 visão geral, descida, sinal verde, fim da volta, treino contínuo | pista inteira antes da contagem; altura da câmera nunca a subir; pose de corrida no `VERDE`; câmera atrás do kart parado ao encerrar; câmera atrás do piloto em movimento depois do fim de uma volta de treino | tela (H1, H2; D4, D6, D11, M4, M11); `CHK-TEST-0003-10..18` | pista cortada; câmera a subir num quadro; corte no `VERDE`; visão geral ou descida pelo fim de uma volta de treino |
| AC-US-0005-01, -04..-07 marcas de pneu; nenhum efeito de drift nem de turbo | marcas sob os pneus traseiros exibidos só com a volta em `RUNNING`, > 6 m/s e deriva > 0,055 rad; nenhuma fumaça, chama ou indicação de drift | tela (H5; D12, M8); `check_served.py` confirma a condição `speedMps>6&&….sideslipRad>.055` e a ausência de `exhaustOutlet`/`escapamentoSaida`; `CHK-TEST-0004-06`, `-17`..`-20` | marca fora do pneu; trecho novo na reta, na visão geral, na contagem ou na pausa; nenhuma marca em curva forte escorregando; fumaça, chama ou indicação de drift |
| NFR-0001 / RNF03 taxa de quadros | `fpsPerSecond` e `minFps` numa volta completa, aba em primeiro plano, por aparelho e orientação | `docs/kart-01/device-log.md` (H6; D14, M9) | `minFps` abaixo de 60 no notebook ou de 30 no celular |
| NFR-0002 / RNF02 tamanho | bytes de `dist/` no build; bytes comprimidos transferidos na primeira visita | `measure_dist.py` no workflow (build limpo de `6b314b2`: 711 561 bytes; 188 918 gzip); lista de transferências (H6; D3, M3) | 3 145 728 bytes ou mais |
| NFR-0003 dependências | arquivos em `dist/assets/` além de um JS e um CSS; `dependencies` de `package.json` | `check_bundle.py` (nenhum outro arquivo); `CHK-TEST-0004-*` (`['three']`) | qualquer *asset* novo ou dependência nova |
| NFR-0004 custo de desenho | malhas, chamadas de desenho e triângulos do modelo montado | `DRAW_COST` em `npm test` (27 / 27 / 5 128; limite 30 chamadas); indiretamente, o fps de H6 | acima de 30 chamadas ou forma diferente de 5 128 triângulos |
| NFR-0005 / NFR-0006 / NFR-0007 camadas, simulação intacta, posições das rodas | `LAYERING`, `RENDER_NEUTRAL`, `SIM_CONTRACT`, `DETERMINISM`, `WHEEL_POSITIONS` | `npm test` no workflow (443 aprovados) — nada a observar na página servida | qualquer registro `FAIL`, que para o workflow antes do `deploy` |
| RNF01 carregamento | tempo da navegação até o kart responder, cache vazio, 4G | `smoke.md` D2/M2 | 10 s ou mais |
| RNF06 HTTPS | certificado válido; 0 recursos em HTTP; inclinação ativa no celular | navegador (cadeado); `check_served.py` recusa URL `http://` | qualquer recurso inseguro ou aviso de certificado |
| Disponibilidade da página | código de resposta do `index.html`, do JS e do CSS em vigor | **verificação manual em HTTPS** (`runbook.md`, *Verify* 1 e 8) ou `check_served.py` (três GET), por decisão do dono do produto (sem monitor externo) | qualquer resposta diferente de 200 |
| Integridade do deploy | o `index.html` servido aponta para o `assets/index-<hash>.js` do build aprovado | `check_served.py <URL> index-<hash>.js` contra o `<hash>` impresso no passo *Build* da execução aprovada (hoje `BwruE9Pq` em staging, execução 41101055606) | hash divergente |
| Regressão das releases contidas | `arcade-assistido-v6` no bundle; HUD com valor; treino de voltas seguidas | `smoke.md` D4, D11, M11 e os `smoke.md` de cada release contida; `check_served.py` confirma `arcade-assistido-v6`, `arcade-assistido-v4`, `realista-aluguel-4t-v4` e `Kartle · ` | identificador ausente; treino que para o kart ao fim de uma volta |
| Erros no console | erros ao carregar e durante uma volta | `smoke.md` D5/M5 | 1 ou mais erros (um `warn` com código não é erro; `NO_2D_CONTEXT` é sintoma de ambiente a anotar) |

## O registro de implantações — o histórico do Actions

Como nas releases anteriores, o **histórico de execuções do workflow `pages`**
(`https://github.com/edumatosr6-svg/kartle/actions`; staging em `https://github.com/edumatosr6-svg/kartle-staging/actions`) é o
registro de deploy: cada execução guarda o commit, o resultado de `npm test` (443 aprovados), o log do build com os nomes dos
*assets*, a medida de RNF02 e — no trabalho `deploy` — quem aprovou e quando (D-DP-06) e a URL publicada. Retenção: 90 dias por
padrão; a execução verde anterior é o alvo do caminho B enquanto estiver retida.

Estado em 2026-10-30, apurado sem executar nada no GitHub (três GET de leitura às URLs; números de execução informados pelo
orquestrador, a confirmar na aba Actions):

| Repositório | Execução | Commit | `build` | `deploy` | Leitura |
|---|---|---|---|---|---|
| `kartle-staging` | 40579585592 (revisão anterior desta release) | `6ea3862` | concluído | concluído | validada em 2026-10-27 (`reports/deploy-validation/deploy-validation-20261027-2057.md`); `index-D0RarhFV.js`; já não é a servida |
| `kartle-staging` | **41076989728** | `652bbaa` | concluído | concluído | a última execução verde **anterior** a esta revisão; alvo do caminho B em staging |
| `kartle-staging` | **41101055606** | `6b314b2` | concluído | concluído | `https://edumatosr6-svg.github.io/kartle-staging/` serve `index-BwruE9Pq.js` desde 17:48:06Z; `check_served.py` 40/40 |
| `kartle` (produção) | 39827702391 (primeira release) e as que a substituíram pelo grupo `pages` | `05c3570` e posteriores | concluído | *Waiting* ou `cancelled` | **nada aprovado**; a URL de produção responde 404; produção nunca serviu um `dist/` |

O validador confirma o número da execução de staging e o estado da de produção na aba Actions e os cita no relatório; este
registro não os copia (regra herdada: os números em vigor são os da aba Actions, nunca os de um registro).

## Qual alerta soaria

**Nenhum alerta automático sobre a página servida — por decisão mantida.** O GitHub Pages não oferece monitor de
disponibilidade nem registros de acesso, e o dono do produto decidiu em 2026-10-21 que a vigilância é **manual, conforme o
runbook** (abrir a URL publicada após cada deploy); esta release não acrescenta monitor nem telemetria (RNF12; DES-0007). O
único alerta automático é o do pipeline — uma execução falhada (teste, build ou RNF02) notifica o dono do produto por e-mail do
GitHub e nada é publicado; nesta release o `npm test` do workflow inclui os 66 `CHK-TEST-00nn-nn` da feature, de modo que o kart
de caixas ainda ligado (`CHK-TEST-0004-01`), um efeito de turbo ou de drift de volta (`CHK-TEST-0001-21`, `-0004-17`, `-18`),
uma mudança na condição das marcas (`CHK-TEST-0004-06`, `-19`, `-20`), uma mudança na simulação (`RENDER_NEUTRAL`, `DETERMINISM`), um módulo de simulação
a importar o modelo (`LAYERING`), um custo de desenho acima de 30 chamadas (`DRAW_COST`) ou uma dependência nova **param a
execução antes do `deploy`**. Sobre a página, o "alerta" é a vigilância humana do `runbook.md` (D-DP-03): *Verify* ao promover e
24 h depois, com reversão se um limiar da tabela acima for cruzado. `check_served.py` é a forma reproduzível dessa verificação
(três GET; nenhum dado pessoal).

## Novo modo de falha que esta release introduz, e como se vê

| Modo de falha | Sintoma observável | Diagnóstico |
|---|---|---|
| kart de caixas em algum quadro | caixas em vez do Kart 01 (antes da contagem, em corrida, após recarga ou giro) | defeito de aplicação (`FAIL CODE`); `CHK-TEST-0004-01` deveria ter falhado no `npm test` do workflow |
| placa sem número | para-choque liso; `console.warn` `kart01-decals`/`NO_2D_CONTEXT` | navegador sem contexto canvas 2D: ambiente; noutro navegador de referência, `FAIL CODE` |
| sombra ausente | kart "flutua" sem sombra no asfalto | `castShadow` ou caixa de sombra (`src/main.ts:40-45`); `FAIL CODE` |
| câmera a subir na contagem, corte no `VERDE`, kart cortado em curva ou em retrato, campo de visão a mudar com um comando, visão geral pelo fim de uma volta de treino | observado na tela (H1, H2, H4) | `FAIL CODE` (`src/gameCamera.ts`); `CHK-TEST-0003-*` prova a geometria, a tela confirma a forma real do aparelho |
| rodas ou volante parados com esterço; kart a deslizar depois de reposicionar; marcas fora dos pneus, fora da situação de derrapagem ou ausentes em curva forte; fumaça, chama ou indicação de drift | tela (H3, H5) | `FAIL CODE` (`src/kartPose.ts`, `src/main.ts` laço de quadro e bloco das marcas) |
| taxa de quadros abaixo do limiar com o Kart 01 e a sombra | `minFps` < 60 (notebook) ou < 30 (celular) em H6 | `FAIL CODE` (custo de desenho ou sombra), não de empacotamento; ou aparelho fora da referência (I9) |
| download comprimido acima de 3 MB | lista de transferências (H6) | `FAIL` deste estágio se o workflow deixou passar; hoje 188 918 bytes gzip |
| *assets* em 404, `deploy` com zero passos, execução cancelada pelo grupo `pages`, cache de 10 min | os mesmos das releases anteriores (`600 Deploy/Output/dirigibilidade/REL-0005-observability.md`) | empacotamento ou configuração (`FAIL` deste estágio), com os remédios lá descritos |
