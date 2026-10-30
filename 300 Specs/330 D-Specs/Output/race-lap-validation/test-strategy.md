---
title: Estratégia de testes — validação de volta de corrida
feature: race-lap-validation
stage: dspec
status: validated
version: 1.2.1
sources: []
---

# Estratégia de testes

Prova é verificação determinística em `npm test` (node:test via tsx), avançando a simulação com `STEP`, nunca
medida contra o relógio de parede (I9). O que depende de tela, de sensor, de taxa de quadros ou de navegador
específico só se prova em teste registrado no aparelho ou no navegador nomeado, em `docs/lap-validation-device-log.md`,
e uma execução em desktop não vale para celular. O projeto não tem ferramenta de teste de ponta a ponta e esta
feature não acrescenta dependência: os níveis "web E2E" e "mobile E2E" são o roteiro registrado abaixo, com
identificadores `E2E-nn`. Nenhum teste usa configuração, ponto de entrada ou gancho criado só para testar: os testes
chegam ao comportamento pela interface pública de `src/lap.ts`, `src/trackData.ts`, `src/lapTiming.ts`,
`src/lapMessages.ts` e `src/frameClock.ts`, por arquivos de pista de fixture e por sessões de estado semeado
(a `LapSession` é dado simples; o teste cria uma por `startLap` e, quando precisa de um instante específico, copia-a
com a posição do kart ou um contador alterados, como um estado de partida semeado).

## Níveis

| Nível | Onde roda | O que cobre |
|---|---|---|
| Unitário | `npm test` | funções puras: `toMs`, `interpolateMs`, `isCutExceeded`, `crossLine`, `readTrackData`, `checkConsistency`, `resolveLanguage`, `formatLapTime`, `describeLap`, `formatSectorTime`, `describeTrainingResult`, `advanceClock`, `offeredLapKinds` |
| Integração | `npm test` | a máquina de estados completa de `src/lap.ts` sobre a física real (`step`, `CIRCUIT`) e a pista sintética: volta inteira, marcador pulado, corte, pausa, reposicionamento; o treino de voltas seguidas, de várias voltas, em `tests/lap-training.test.ts` |
| Contrato de API | `npm test` | `tests/lap-contract.test.ts`: forma e unidades de `getLapState`, `getLapResult`, `readTrackData`, códigos de rejeição por operação, ausência de campo além dos contratados (inclusive de dado pessoal); os campos opcionais `setupId` e `setupVersion` de API-0001 presentes no resultado exatamente quando o pedido `startLap` os trouxe, copiados sem interpretação, e ausentes quando não (API-0002); `listLapResults`, `endTraining`, `PAUSE_BUTTON` e `NOT_TRAINING`, com a ordem de precedência das rejeições de API-0002; os campos `lapSequenceCount` e `lapStartMs` em todo `getLapState` (1 e 0 fora do treino), `bestValidLapMs` só no treino depois da primeira volta válida, e `lapSequenceCount`, `lapStartMs`, `trainingLapMs` e `trainingSectorMs` no resultado exatamente quando `lapKind` é `TRAINING` (`trainingSectorMs` só numa pista que declara setores) |
| Web E2E | roteiro registrado em Chrome, Edge, Firefox e Safari nas versões atuais, em `web-desktop` | texto na tela, tamanhos, contraste, escala de cinza, Esc, perda de foco, idioma, rede bloqueada, tempos iguais entre navegadores |
| Mobile E2E | roteiro registrado em celular intermediário de referência (RNF03), em `web-mobile` | inclinação e perda do sensor, retorno ao toque com estado visível, texto de 16 px, 30 fps |

## Fixtures e como chegar a cada estado

| Fixture | O que é | Estado a que dá acesso |
|---|---|---|
| `syntheticReading()` | `readTrackData(SYNTHETIC_TRACK_FILE)`, `COMPLETE` | volta completa na pista sintética |
| `tests/fixtures/track-v1.json` | `{schemaVersion: 1, trackId, trackVersion: 1}` | leitura da forma anterior, `INCOMPLETE` (NFR-0012) |
| arquivo derivado sem `markers` | cópia do sintético sem a lista de marcadores | `INCOMPLETE` por dado faltante |
| arquivos derivados reprovando C1 a C7 | cópias do sintético com uma única inconsistência cada | `INCOMPLETE` por inconsistência |
| `schemaVersion` igual a `TRACK_SCHEMA_VERSION + 1`, e texto corrompido | cópia do sintético cuja versão de esquema é derivada da constante exportada por `src/trackData.ts` (nenhum literal de versão no teste); texto corrompido em literal | `UNSUPPORTED_SCHEMA` (devolvido com essa `schemaVersion`, objeto de entrada intacto) e `UNREADABLE` |
| pedido de `startLap` com `setupId` e `setupVersion` | literais do enum de API-0002 e um texto de versão, no teste, copiados sem interpretação | resultado com os dois campos; o mesmo pedido sem eles dá resultado sem os campos (os padrões de leitura são do leitor de registros de `dirigibilidade`, fora deste conjunto) |
| `withCutLimits(1, 300)` | cópia do sintético com `cutDistanceM` 1 e `cutDurationMs` 300 (`trackVersion` 3) | corte pelos limites da pista |
| `withShortMarker(2)` | cópia do sintético em que o marcador 2 é um segmento curto de −1 m a +9 m do lado direito da linha central | marcador que um kart a −4 m da linha central não cruza |
| `autopilot(state, offsetM)` em `tests/helpers/autopilot.ts` | controlador determinístico de entradas a 10 Hz, derivado do de `scripts/keyboard-lap.ts`, com deslocamento lateral opcional em função da posição de arco | volta completa (cerca de 3770 passos); escapada pela grama a 1,5 m além da borda (`autopilot(-7)`); resto da volta depois de um salto semeado; num treino, voltas seguidas sem parar, porque o controlador depende só da posição e o kart não para na chegada |
| `driveOut` | `Input` `{throttle: 1, brake: 0, steer: 0}` fixo | saída de pista em linha reta, para o corte |
| `seedLap(lap, patch)` | cópia da `LapSession` com `kart`, `markersPassedCount` ou `sectorBoundsMs` alterados | marcadores fora de ordem; marcador pulado na pista sintética publicada; cruzamento na contramão; cruzamento repetido depois do fim; volta que começa depois de um limite; kart parado 2 m além da borda; no treino, kart parado 5 m além da borda (corte sem pilotagem) e salto do kart, depois do limite 1, para além do limite 2 e de um marcador (limite saltado, setores sem tempo e marcador pulado), e kart logo antes da chegada com velocidade, de frente ou de costas |
| `withoutSectors()` | cópia do sintético sem `sectorLimits`, com `direction`, `finishLine` e `markers` declarados | `INCOMPLETE` que declara chegada e sentido mas não setores: treino com resultado só de tempo total e validade (REQ-FEAT-0010-27) |
| `tests/helpers/seeded.ts` | gerador congruencial linear com semente fixa | sequências de `Input` variadas e repetíveis; nunca `Math.random` |
| oráculo de corte | laço do próprio teste com `step` e `nearest` | primeiro passo em que o kart passa de 3 m além da borda por mais de 120 passos seguidos; na escapada dentro do limite, a distância máxima além da borda e a contagem de passos na grama |
| oráculo de chegada | laço do próprio teste que aplica `crossLine` da chegada ao deslocamento de cada passo do kart da sessão | o passo `k` e a fração de cada cruzamento da chegada no sentido da pista, e daí o instante esperado `interpolateMs(k, f)` e o número de cruzamentos de um treino |

Cruzamento exatamente sobre o passo: a física não permite posicionar o kart numa linha com precisão arbitrária; o
caso é provado em `crossLine` (deslocamento que termina em `side` igual a 0 dá `fraction` 1) e em `interpolateMs(k, 1)`
igual a `toMs(k + 1)`, que são as funções que a volta usa, e o caso interno ao passo, nas voltas inteiras, pela
comparação com o oráculo do próprio teste (`toMs(k) < lapMs < toMs(k + 1)` para o `k` do passo da chegada).

## Funcionalidade por nível

| Funcionalidade | Unitário | Integração | Contrato | Web E2E | Mobile E2E | Razão |
|---|---|---|---|---|---|---|
| FEAT-0001 contagem e largada | sim | sim | sim | E2E-01 | E2E-01, E2E-05 | a regra é da simulação (provada em `npm test`); o texto e os tamanhos exigem tela e aparelho |
| FEAT-0002 conclusão e tempos | sim | sim | sim | E2E-02 | E2E-02 | tempo e soma em `npm test`; a exibição `m:ss.mmm` na tela |
| FEAT-0003 tempo independente e pausa | sim | sim | sim | E2E-03, E2E-04, E2E-11 | E2E-05 | determinismo em `npm test`; Esc, foco, sensor e navegadores só em teste registrado |
| FEAT-0004 marcadores e sentido | sim | sim | sim | E2E-02 | E2E-02 | regra da simulação; motivo exibido na tela |
| FEAT-0005 corte e grama | sim | sim | sim | E2E-02 | E2E-02 | regra com oráculo independente em `npm test` |
| FEAT-0006 reposicionamento e tipos | sim | sim | sim | E2E-06 | E2E-06 | tipos e oferta em `npm test`; ausência da opção oficial na tela |
| FEAT-0007 estado na tela | sim | não | não | E2E-02, E2E-07, E2E-09 | E2E-02, E2E-07 | textos e idioma puros; contraste por fichas; tamanho, escala de cinza e idioma do navegador na tela |
| FEAT-0008 dado de pista | sim | sim | sim | E2E-06 | E2E-06 | leitor e verificação puros; erro exibido na tela |
| FEAT-0009 transversais | sim | sim | sim | E2E-08, E2E-10 | E2E-08, E2E-10 | camada, privacidade e passo fixo em `npm test`; rede bloqueada, armazenamento vazio e quadros em aparelho |
| FEAT-0010 voltas seguidas no treino | sim | sim | sim | E2E-12, E2E-13 | E2E-12, E2E-13 | a sequência, os tempos, o corte, a melhor volta válida e `endTraining` são da simulação e se provam em `npm test`; o painel do resultado, os rótulos, o botão de pausa e "encerrar treino" nos dois canais e o avanço sem parar exigem tela e aparelho |

## Roteiro registrado (web E2E e mobile E2E)

| Id | O que se faz e se registra | Canal |
|---|---|---|
| E2E-01 | iniciar a volta; ver 3, 2, 1 e VERDE em texto com 48 px no mínimo e contraste de 4,5:1; cronômetro `0:00.000` durante a contagem; acelerar antes do VERDE sem efeito | desktop e celular |
| E2E-02 | completar uma volta; ver "válida em andamento", tempo de cada setor ao completá-lo e o resultado com tempo total e quatro tempos (no treino, no painel de SCR-0001, E2E-12; em volta oficial de fixture, na tela de resultado); repetir pulando um marcador, cortando e reposicionando em volta oficial de fixture, e ver os motivos. Comparação de tempos (SCR-0003, DES-0010): com uma volta válida concluída no acerto corrente, encerrar o treino, trocar o acerto no seletor existente `#handling-preset` (só fora de volta ou treino ativo) e concluir outra volta válida — nenhuma comparação com o tempo do outro acerto é exibida (diferença, melhor tempo ou ordenação) e o melhor tempo exibido não é o dele; concluir uma segunda volta válida no mesmo acerto — a comparação é exibida (melhor tempo entre as duas). Com o melhor tempo exibido na Kart Park, encerrar o treino e escolher a pista sintética no seletor de pistas existente (`chooseTrack`, `src/main.ts:227`; duas pistas de treino em `TRAINING_TRACKS`, `src/trainingSession.ts:12-15`): o melhor tempo da Kart Park não é exibido nem comparado na pista sintética (`TRACK_DIFFERS`, `renderBest`, `src/main.ts:289-295`). A decisão fica em `compareLapRecords`; o ramo `SETUP_VERSION_DIFFERS` não é alcançável pela tela (o seletor de acerto só oferece as versões publicadas correntes) e, sem superfície só de teste, fica provado nos testes de `compareLapRecords` de `dirigibilidade` | desktop e celular |
| E2E-03 | Esc pausa; o cronômetro para; continuar pelo botão ou por Esc; o cronômetro retoma do mesmo valor | desktop |
| E2E-04 | trocar de aba e voltar: a volta fica pausada com o mesmo cronômetro e só continua quando o Jogador continua | desktop e celular |
| E2E-05 | cobrir ou desativar o sensor com a inclinação ativa: a volta pausa em cerca de 0,5 s; negar a permissão antes da volta: o texto de controle por toque fica visível | celular |
| E2E-06 | abrir uma pista de fixture `INCOMPLETE`: nenhuma opção de volta oficial e volta de treino pilotável; abrir uma de esquema desconhecido: erro exibido e nenhuma volta | desktop e celular |
| E2E-07 | trocar o idioma do navegador entre pt, en e outro: os textos de estado e de motivo seguem; medir 16 px no celular | desktop e celular |
| E2E-08 | bloquear a rede depois do carregamento e completar uma volta: resultado exibido; registrar 0 requisições durante a volta. Com o armazenamento do site limpo antes de abrir a página, completar uma volta e um treino de ao menos duas voltas, encerrar o treino e recarregar: nas ferramentas do navegador (aplicação ou armazenamento), registrar 0 entradas em `localStorage`, `sessionStorage`, IndexedDB e cookies da origem (REQ-FEAT-0009-11) | desktop e celular |
| E2E-09 | tela em escala de cinza: todo estado e motivo é legível por texto | desktop e celular |
| E2E-10 | uma volta completa com a validação ativa: fps médio e mínimo, 60 em notebook e 30 em celular intermediário (NFR-0003) | notebook e celular, nomeados |
| E2E-11 | a mesma sequência de entradas reproduzida (script de entradas de `tests/helpers`) em Chrome, Edge, Firefox e Safari: tempo total e quatro tempos iguais ao ms (NFR-0008) | quatro navegadores |
| E2E-12 | escolher "treino": uma contagem 3, 2, 1, VERDE; completar duas voltas válidas sem tocar em nada além da pilotagem: no fim de cada uma o painel do resultado aparece ao lado, sem cobrir o estado da volta, com tempo total, quatro tempos de setor, "válida" e "não oficial", o kart segue andando, o cronômetro recomeça e nenhuma contagem aparece; "melhor volta válida" aparece depois da primeira volta válida. Sair da pista além do limite: "inválida · corte" no quadro seguinte, o kart segue, a volta termina só na chegada seguinte com "inválida · corte", tempo total e "—" no setor sem tempo, e a melhor volta válida não muda; a volta seguinte começa "válida em andamento". Reposicionar: o estado exibido não muda. Pausar pelo botão "pausar" (desktop e celular): cronômetro parado; continuar: mesmo valor, sem contagem. "Encerrar treino" visível em corrida e em pausa; acioná-lo em pausa: volta à oferta, sem resultado para a volta em andamento e sem nenhuma volta começando. Escolher "treino" de novo: "melhor volta válida" não aparece antes da primeira volta válida deste treino. Recarregar a página no meio de um treino: nenhum resultado e nenhuma melhor volta válida na reabertura | desktop e celular |
| E2E-13 | abrir pela mesma via de E2E-06 a pista de fixture `withoutSectors()`, `INCOMPLETE`: só a opção de treino; completar uma volta: o painel mostra só o tempo total, a validade e "não oficial", sem nenhuma linha de setores | desktop e celular |

## Critérios de aceite: como o teste chega a cada um

`U` é unitário, `I` integração; o arquivo está em `tests/`. Nome em uso na árvore: a etapa de testes nomeia os
arquivos `tests/<feature>-<área>.test.ts`, de modo que o nome curto desta estratégia (`lap-<área>`, `frame-clock`,
`track-data`) e o nome `tests/lap-<área>.test.ts` ou `tests/track-data.test.ts` citado nos itens de projeto designam
`tests/race-lap-validation-<área>.test.ts` (áreas: `contract`, `crossing`, `cut`, `determinism`, `frame-clock`,
`frozen`, `hud-css`, `kinds`, `layering`, `messages`, `state`, `timing`, `track-data`, `training`, `validity`).

| Critério | Teste e caminho |
|---|---|
| AC-US-0001-01 | `lap-state` (I): `startLap` com `syntheticReading()`, 360 `stepLap` na contagem; `countdownRemainingMs` de 3000 a 0 e fase `RUNNING`, para `OFFICIAL`, `RECON` e `TRAINING`; `lap-timing` (U): `toMs(360) === 3000` |
| AC-US-0001-02 | `lap-messages` (U): `describeLap` devolve `countdownText` 3, 2 e 1 para 3000, 2000 e 1000 ms e valores intermediários; E2E-01 |
| AC-US-0001-03 | `lap-messages` (U): `greenSignalVisible` no primeiro quadro de `RUNNING` e `message('countdownGreenSignal')`; E2E-01 |
| AC-US-0001-04 | `lap-state` (I): `elapsedMs` 0 nos 360 passos da contagem; `lap-messages` (U): `formatLapTime(0) === '0:00.000'` |
| AC-US-0001-05 | `lap-state` (I): após N passos do sinal verde `elapsedMs === toMs(N)`, com o kart posto, por `seedLap`, antes e depois da linha de chegada |
| AC-US-0001-06 | `lap-state` (I): `Input` `{throttle: 1}` nos 360 passos; no sinal verde `kart.speed === 0` e posição igual à da largada |
| AC-US-0001-07 | `lap-state` (I): no sinal verde, depois de aceleração antecipada, `lapValidity` `VALID` sem `invalidReason`; `lap-messages` (U): texto "válida em andamento" |
| AC-US-0001-08 | `lap-state` (I): `elapsedMs` após N passos igual com e sem aceleração antes do sinal verde |
| AC-US-0001-09 | `lap-hud-css` (U): numeral com `--lap-countdown-size` de 48 px; E2E-01 mede em desktop e celular |
| AC-US-0001-10 | `lap-hud-css` (U): contraste de `--lap-text` sobre `--lap-chip-bg` maior ou igual a 4,5; E2E-01 |
| AC-US-0002-01 | `lap-validity` (I): `autopilot` completa a volta sintética; fase `ENDED`, `VALID`; E2E-02 |
| AC-US-0002-02 | `lap-state` (I): `getLapResult` traz `lapMs`; E2E-02 mostra na tela |
| AC-US-0002-03 | `lap-state` (I): `sectorMs` com 4 inteiros; E2E-02 |
| AC-US-0002-04 | `lap-contract` (U): `Number.isInteger` em `lapMs` e em cada `sectorMs` |
| AC-US-0002-05 | `lap-state` (I): soma de `sectorMs` igual a `lapMs`, para a volta do autopilot e para voltas com entradas semeadas |
| AC-US-0002-06 | `lap-messages` (U): `formatLapTime` para 62345, 0, 59999, 3723004 |
| AC-US-0002-07 | `lap-timing` e `lap-crossing` (U): `interpolateMs` e `crossLine` em frações de 0,001 a 1; `lap-validity` (I): `toMs(k) < lapMs < toMs(k + 1)` com o `k` do passo da chegada, medido pelo oráculo do teste |
| AC-US-0002-08 | idem para `sectorBoundsMs`, com os passos dos limites de setor |
| AC-US-0002-09 | `lap-state` (I): `completedSectorMs` cresce de 1 em 1 e em ordem durante a volta; E2E-02 |
| AC-US-0002-10 | `lap-validity` (I): cada fronteira `bi` fica no passo de cruzamento do limite `i` do arquivo, medido pelo oráculo; primeiro setor desde o sinal verde; `lap-training` (I): na segunda volta de um treino o primeiro tempo de setor é `b1 - lapStartMs`; com `seedLap` que salta o limite 1, o cruzamento do limite 2 é registrado (`sectorBoundsMs` `[null, b2]`) |
| AC-US-0002-11 | `lap-state` (I): o resultado traz `trackId` `synthetic` e `trackVersion` 2, vindos da leitura |
| AC-US-0002-12 | `lap-validity` (I): numa volta oficial, `seedLap` recoloca o kart antes da chegada depois do fim e dá passos; a sessão devolvida é a mesma e `getLapResult` não muda; no treino, o novo cruzamento encerra a volta seguinte com resultado próprio (AC-US-0010-20) |
| AC-US-0002-13 | `lap-validity` (I): `autopilot` na pista sintética publicada dá `VALID` com 4 setores |
| AC-US-0003-01 | `lap-determinism` (I): duas execuções do autopilot dão `lapMs` iguais |
| AC-US-0003-02 | idem para `sectorMs` |
| AC-US-0003-03 | `lap-determinism` (I): a mesma sequência de `Input` por passo agrupada em quadros de 2 e de 4 passos dá `lapMs` igual; `frame-clock` (U) |
| AC-US-0003-04 | idem para `sectorMs` |
| AC-US-0003-05 | `lap-state` (I): `pauseLap('ESC_KEY')` congela `elapsedMs`; E2E-03 prova a tecla |
| AC-US-0003-06 | `lap-state` (I): `pauseLap('FOCUS_LOST')`; o cronômetro é o mesmo ao voltar; E2E-04 prova o evento |
| AC-US-0003-07 | `lap-state` (I): `pauseLap('SENSOR_LOST')`; E2E-05 prova a vigilância no celular |
| AC-US-0003-08 | `lap-state` (I): `stepLap` em `PAUSED` devolve a mesma sessão, `stepCount` congelado, e o tempo ao continuar é o do instante da pausa |
| AC-US-0003-09 | `lap-state` (I): depois de `resumeLap` a volta segue `VALID` e com o mesmo `lapKind`; `lap-messages` (U): "válida em andamento" |
| AC-US-0003-10 | `lap-determinism` (I): resultado sem pausa igual ao com uma pausa de qualquer duração no meio |
| AC-US-0004-01 | `lap-validity` (I): `withShortMarker(2)` e `autopilot` a −4 m: `INVALID` `MISSED_MARKER` na chegada |
| AC-US-0004-02 | `lap-validity` (I): `seedLap` posiciona o kart depois do marcador 1 e antes do 2 com contador 0; os marcadores 2 a 4 não contam; chegada `MISSED_MARKER` |
| AC-US-0004-03 | `lap-state` (I): resultado inválido sem `lapMs` nem `sectorMs`, `official` falso |
| AC-US-0004-04 | `lap-messages` (U): "marcador pulado"; E2E-02 |
| AC-US-0004-05 | `lap-validity` (I): na volta de `withShortMarker(2)` os três limites de setor são cruzados e o resultado é `MISSED_MARKER` |
| AC-US-0004-06 | `lap-validity` (I): na pista sintética publicada, `seedLap` salta o kart, em repouso na linha central, para 3 índices de arco depois do ponto de cruzamento único do marcador 2, com `markersPassedCount` 1 (marcador 1 contado, marcador 2 nunca cruzado), e `autopilot()` pilota o resto da volta até a chegada: fase `ENDED`, `INVALID`, `MISSED_MARKER` (CHK-TEST-0005-11). Pular um marcador por pilotagem, sem corte, não é alcançável nesta pista (o alcance do marcador, 9 m, excede a borda mais o limite de corte, 5,5 m + 3 m, e o retorno pela grama passa de 1000 ms — medição da etapa de testes); o salto é o estado de partida semeado previsto no preâmbulo, e a regra de marcador pulado fica provada também por pilotagem em `withShortMarker(2)` (AC-US-0004-01) |
| AC-US-0004-07 | `lap-validity` (I): numa volta oficial, `elapsedMs` não muda depois do passo da chegada inválida e um novo cruzamento não gera segundo resultado |
| AC-US-0005-01 | `lap-validity` (I): `seedLap` põe o kart depois da chegada, de costas; ao cruzar, a fase segue `RUNNING` e `lapValidity` `VALID` |
| AC-US-0005-02 | `lap-validity` (I): na mesma situação `getLapResult` devolve `NO_RESULT` |
| AC-US-0005-03 | `lap-validity` (I): só o cruzamento no sentido da pista encerra; vários cruzamentos na contramão e depois um no sentido da pista |
| AC-US-0005-04 | `lap-validity` (I): `seedLap` antes do marcador 1, de costas: `markersPassedCount` continua 0 |
| AC-US-0006-01 | `lap-cut` (I): `driveOut` com oráculo: `INVALID` `CUT` no primeiro passo em que 120 passos seguidos são ultrapassados com mais de 3 m da borda |
| AC-US-0006-02 | `lap-cut` (I): saída de até 120 passos e retorno a 3 m ou menos não invalida; nova saída recomeça a contagem |
| AC-US-0006-03 | `lap-cut` (I), duas verificações: (a) `autopilot(-7)` — alvo 7 m à direita da linha central, 1,5 m além da borda da pista de 11 m — por 600 passos, com o laço do próprio teste medindo, a partir do passo 240, a distância além da borda: mais de 200 passos na grama e máximo menor ou igual a 3 m; `VALID` e fase `RUNNING` (CHK-TEST-0006-03); (b) `seedLap` põe o kart parado a exatamente 2 m além da borda (`kartAt(40, 0, WIDTH / 2 + 2)`, conferido pelo teste com tolerância de 0,05 m) e 600 passos com entrada `IDLE`: `VALID` e `elapsedMs === toMs(600)` (CHK-TEST-0006-04). A pilotagem fica a 1,5 m, e não a 2 m, porque a 2 m além da borda o autopilot passa de 3 m nas curvas e a volta termina em `CUT` (medição da etapa de testes); os 2 m são provados com o kart parado. Limiar inalterado: 3 m e 1000 ms |
| AC-US-0006-04 | `lap-cut` (I): `withCutLimits(1, 300)` invalida pelos limites da pista |
| AC-US-0006-05 | `lap-messages` (U): "corte"; E2E-02 |
| AC-US-0006-06 | `lap-cut` (I): em volta oficial e em volta de reconhecimento, `elapsedMs` e `sectorBoundsMs` não mudam depois do passo da invalidação, e a fase é `ENDED` |
| AC-US-0006-07 | `lap-cut` (I): mesma entrada por N passos em grama e em asfalto: velocidade menor na grama |
| AC-US-0006-08 | `lap-cut` (I): na escapada de AC-US-0006-03 `describeLap` mostra "válida em andamento" |
| AC-US-0007-01 | `lap-kinds` (I): `repositionKart` em `OFFICIAL` e `RUNNING` dá `INVALID` `REPOSITION` |
| AC-US-0007-02 | `lap-messages` (U): "reposicionamento"; E2E-02 |
| AC-US-0007-03 | `lap-kinds` (I): `stepCount` e `elapsedMs` não mudam depois do reposicionamento oficial e os passos seguintes são ignorados |
| AC-US-0007-04 | `lap-kinds` (I): em `TRAINING` e `RECON` a validade continua `VALID` depois de reposicionar, repetidamente |
| AC-US-0007-05 | `lap-kinds` (I) e `lap-messages` (U): sem `invalidReason` e sem texto de motivo |
| AC-US-0007-06 | `lap-kinds` (I): `elapsedMs` após N passos do sinal verde é `toMs(N)` com reposicionamentos intercalados; `lap-training` (I): numa volta seguinte do treino, `elapsedMs` é `toMs(stepCount) - lapStartMs` com reposicionamentos intercalados |
| AC-US-0008-01 | `lap-state` e `lap-messages`: resultado `VALID` de `TRAINING` e `RECON` com `official` falso e texto "não oficial"; E2E-02 |
| AC-US-0008-02 | `lap-kinds` (I): `official` falso para `TRAINING` e `RECON` concluídos, e verdadeiro só para `OFFICIAL` `VALID` `COMPLETE` |
| AC-US-0008-03 | `lap-kinds` (U): `offeredLapKinds` de `INCOMPLETE` não contém `OFFICIAL`; `startLap` `OFFICIAL` dá `OFFICIAL_NOT_AVAILABLE`; E2E-06 |
| AC-US-0008-04 | `lap-kinds` (I): `startLap` `TRAINING` sobre leitura `INCOMPLETE`, 1200 passos de `Input`: kart anda e o cronômetro avança |
| AC-US-0008-05 | `lap-kinds` (I): em leitura `INCOMPLETE` (arquivo derivado sem `markers`, que declara chegada e sentido), o resultado de cada volta do treino concluída na chegada tem `official` falso; o mesmo com `withoutSectors()` |
| AC-US-0009-01 | `lap-state` (I): `getLapState` devolve estado válido a cada passo do sinal verde ao fim; `lap-training` (I): também a cada passo das voltas seguintes, do instante de cruzamento que as iniciou; E2E-02 e E2E-12 observam a tela por quadro |
| AC-US-0009-02 | `lap-messages` (U): "válida em andamento" |
| AC-US-0009-03 | `lap-messages` (U): "inválida" mais motivo para cada `invalidReason` |
| AC-US-0009-04 | `lap-messages` (U): todo estado e motivo tem texto não vazio; E2E-09 em escala de cinza |
| AC-US-0009-05 | `lap-messages` (U): `resolveLanguage('pt-BR')` e `'pt'` dão `pt` |
| AC-US-0009-06 | `lap-messages` (U): `'en-US'` e `'en'` dão `en` |
| AC-US-0009-07 | `lap-messages` (U): `'fr'`, `'es-419'`, `'de'`, vazio e `undefined` dão `en`; E2E-07 |
| AC-US-0009-08 | `lap-hud-css` (U): contraste de cada par de fichas maior ou igual a 4,5; E2E-07 |
| AC-US-0009-09 | `lap-hud-css` (U): `--lap-state-size` de 16 px; E2E-07 mede no celular |
| AC-US-0010-01 | `lap-training` (I): treino na pista sintética com `autopilot()` por três voltas; para cada cruzamento medido pelo oráculo de chegada, `lapStartMs` da volta seguinte é igual a `interpolateMs(k, f)` e a `lapStartMs + trainingLapMs` do resultado anterior, com 0 ms de diferença; `getLapState` depois do passo do cruzamento traz esse `lapStartMs` |
| AC-US-0010-02 | `lap-training` (I): o resultado de uma volta `INVALID` (corte semeado e salto semeado) traz `trainingLapMs`; com `withoutSectors()`, também; `lap-messages` (U): `describeTrainingResult` traz `totalText` em todo caso; E2E-12, E2E-13 |
| AC-US-0010-03 | `lap-training` (I): `seedLap` põe o kart logo antes da chegada com velocidade; `Input` `{throttle: 1}` em todos os passos; um passo depois do passo do cruzamento, `kart.speed` maior que 0 e fase `RUNNING` |
| AC-US-0010-04 | `lap-training` (I): do sinal verde ao encerramento, através de dois fins de volta e de uma pausa com retomada, `lapPhase` nunca volta a `COUNTDOWN` e `countdownRemainingMs` fica 0; `lap-messages` (U): `describeLap` sem `countdownText` e `greenSignalVisible` falso com `stepCount` maior ou igual a 120; E2E-12 |
| AC-US-0010-05 | `lap-training` (I): para cada resultado, `trainingLapMs` é o instante do oráculo para o cruzamento que o encerra menos `lapStartMs`, em ms inteiros |
| AC-US-0010-06 | `lap-training` (I): depois de três voltas, a soma dos `trainingLapMs` de `listLapResults` é igual ao instante do último cruzamento medido pelo oráculo e ao `lapStartMs` da volta em andamento, com 0 ms de diferença |
| AC-US-0010-07 | `lap-training` (I): `driveOut` num treino, com o oráculo de corte: no passo previsto, `lapValidity` `INVALID` e `invalidReason` `CUT` em `getLapState`, fase `RUNNING`; `lap-messages` (U): "inválida" e "corte"; E2E-12 observa o quadro seguinte |
| AC-US-0010-08 | `lap-training` (I): na mesma saída, um passo depois do passo da invalidação com `{throttle: 1}`, `kart.speed` maior que 0 |
| AC-US-0010-09 | `lap-training` (I): corte semeado, `repositionKart` e `autopilot()` até a chegada: entre a invalidação e o cruzamento, `lapSequenceCount` e `listLapResults` não mudam; no cruzamento, um resultado `INVALID` `CUT` e a nova volta com `lapStartMs` igual ao instante do oráculo |
| AC-US-0010-10 | `lap-training` (I): `withShortMarker(2)` e `autopilot(-4)` num treino: resultado `INVALID` `MISSED_MARKER` e volta seguinte com `lapStartMs` igual a `lapStartMs + trainingLapMs` desse resultado, fase `RUNNING` |
| AC-US-0010-11 | `lap-training` (I): depois de um resultado `INVALID` (corte e marcador pulado), `getLapState` traz `lapValidity` `VALID`, sem `invalidReason`, `markersPassedCount` 0 e `completedSectorMs` vazia; `lap-messages` (U): "válida em andamento"; E2E-12 |
| AC-US-0010-12 | `lap-training` (I): sem `bestValidLapMs` antes do primeiro resultado `VALID`; depois, igual ao menor `trainingLapMs` entre os resultados `VALID` de `listLapResults`; `lap-messages` (U): rótulo `bestValidLap`; E2E-12 |
| AC-US-0010-13 | `lap-training` (I): uma volta `VALID` completa e depois uma volta `INVALID` mais curta (salto semeado que pula marcadores, `trainingLapMs` menor): `bestValidLapMs` igual ao da volta válida |
| AC-US-0010-14 | `lap-training` (I): depois da conclusão de uma volta válida, de uma inválida, da invalidação por corte e de um reposicionamento, `stepLap` sem nenhum comando no meio avança `stepCount` de 1 por chamada e a fase segue `RUNNING`; só em `PAUSED` e em `ENDED` `stepLap` devolve a mesma sessão; E2E-12 (o laço de quadros segue sozinho) |
| AC-US-0010-15 | `lap-training` (I): `pauseLap(lap, 'PAUSE_BUTTON')` num treino em `RUNNING`: `PAUSED` com `pauseCause` `PAUSE_BUTTON`, `stepLap` sem efeito e, depois de `resumeLap`, `elapsedMs` igual ao do instante da pausa; `lap-contract` (U): `NOT_TRAINING` em `OFFICIAL` e `RECON`; E2E-12 pelo botão nos dois canais |
| AC-US-0010-16 | E2E-12: "encerrar treino" visível durante o treino, em corrida e em pausa, em desktop e em celular, e ausente fora do treino; `lap-messages` (U): `endTrainingAction` nos dois idiomas; `lap-contract` (U): `endTraining` aceito em `COUNTDOWN`, `RUNNING` e `PAUSED` |
| AC-US-0010-17 | `lap-training` (I): com uma volta em andamento depois de duas concluídas, `endTraining`: `listLapResults` com 2 itens, `getLapResult` igual ao segundo, nenhum resultado com `lapSequenceCount` 3 |
| AC-US-0010-18 | `lap-training` (I): depois de `endTraining`, 600 `stepLap` com `{throttle: 1}` devolvem a mesma sessão (`deepEqual`), `lapSequenceCount` e `listLapResults` iguais; o segundo `endTraining` devolve `LAP_ENDED`; E2E-12 |
| AC-US-0010-19 | `lap-training` (I): `repositionKart` numa volta `VALID` e numa volta `INVALID` `CUT` do treino: `lapValidity` e `invalidReason` iguais antes e depois; `lap-messages` (U): o mesmo texto de `describeLap` antes e depois; E2E-12 |
| AC-US-0010-20 | `lap-training` (I): em três voltas, `listLapResults` tem tantos itens quanto os cruzamentos no sentido da pista medidos pelo oráculo, com `lapSequenceCount` 1, 2, 3, sem repetição |
| AC-US-0010-21 | `lap-training` (I): volta oficial concluída pelo `autopilot()` e volta oficial invalidada por corte: fase `ENDED`, `listLapResults` com 1 item e `lapSequenceCount` 1 depois de mais 600 passos que cruzam a chegada de novo |
| AC-US-0010-22 | `lap-training` (I): depois do encerramento de uma volta oficial, 600 passos com `{throttle: 1}` deixam `kart` igual (`deepEqual`) ao do passo do encerramento |
| AC-US-0010-23 | `lap-training` (I): salto semeado depois do limite 1 para além do limite 2 e `autopilot()` até a chegada: `trainingSectorMs` com `null` nas posições 2 e 3 e inteiros nas posições 1 e 4; `lap-messages` (U): "—" nessas posições; E2E-12 |
| AC-US-0010-24 | `lap-training` (I): resultados `VALID`, `INVALID` `CUT` e `INVALID` `MISSED_MARKER` com o motivo, na pista sintética e em `withoutSectors()`; `lap-messages` (U): `validityText` e `reasonText`; E2E-12, E2E-13 |
| AC-US-0010-25 | `lap-training` (I): todo resultado do treino tem `official` falso; `lap-messages` (U): `describeTrainingResult` traz `lapUnofficial` em todo resultado do treino; E2E-12 |
| AC-US-0010-26 | `lap-training` (I): `seedLap` põe o kart logo antes da chegada: o passo que cruza produz 1 resultado, e os passos seguintes, já depois da linha, nenhum; ida e volta sobre a chegada (contramão e de novo no sentido da pista) produzem resultado só nos cruzamentos no sentido da pista, cada um uma vez |
| AC-US-0010-27 | `lap-training` (I): com `withoutSectors()`, o resultado da volta concluída tem `trainingLapMs` e não tem `trainingSectorMs` nem `sectorMs`; `lap-messages` (U): `describeTrainingResult` sem `sectorTexts`; E2E-13 |

## Requisitos não funcionais

| NFR | Como é provado |
|---|---|
| NFR-0001 | `lap-determinism` |
| NFR-0002 | `lap-state` (pausa não avança passo) |
| NFR-0003 | E2E-10 nos aparelhos de referência |
| NFR-0004 | `lap-layering` (nenhum símbolo de rede nos módulos) e E2E-08 |
| NFR-0005 | `lap-contract` (chaves do resultado são exatamente as de API-0001) e `lap-layering` |
| NFR-0006 | E2E-09 e `lap-messages` |
| NFR-0007 | `lap-messages` (as 24 chaves de DES-0008 nos dois idiomas, inclusive `pauseAction`, `endTrainingAction`, `bestValidLap` e `sectorNoTime`) e E2E-07 |
| NFR-0008 | E2E-11 |
| NFR-0009 | os arquivos da tabela de DES-0012, um por regra, inclusive `lap-training` para as voltas seguidas do treino |
| NFR-0010 | `lap-frozen` |
| NFR-0011 | registro de benchmarks em `docs/lap-validation-bench.md`, antes e depois |
| NFR-0012 | `track-data`: forma anterior lida sem erro; o arquivo sintético declara `schemaVersion` igual a `TRACK_SCHEMA_VERSION`, maior que a versão da forma anterior; `TRACK_SCHEMA_VERSION + 1` é `UNSUPPORTED_SCHEMA` com o objeto de entrada intacto. Sem literal de versão de esquema em nenhuma verificação: os valores derivam da constante exportada, para que subir o esquema em outra feature não reprove a prova (FB-01 de `pista-kart-park`) |

## Requisitos sem critério próprio: o observável de cada um

Requisitos `[DOMAIN]` do treino e de privacidade, cobertos no F-Spec por um critério que não enuncia o seu
observável (relatório `fspec-validation-20261030-1227.md`, avisos ISSUE-01 e ISSUE-02). O observável e o caminho de
teste ficam aqui, sem superfície nova:

| Requisito | Observável | Teste e caminho |
|---|---|---|
| REQ-FEAT-0010-28 | contramão no treino: nenhum resultado novo e `lapSequenceCount` igual | `lap-training` (I): `seedLap` põe o kart depois da chegada, de costas; cruzar: fase `RUNNING`, `listLapResults` e `lapSequenceCount` iguais |
| REQ-FEAT-0010-29 | volta já `INVALID` `CUT` que pula marcador ou corta de novo termina com `CUT` e um só motivo | `lap-training` (I): corte semeado, novo corte semeado e salto que pula um marcador, depois `autopilot()` até a chegada: resultado `INVALID` com `invalidReason` `CUT` |
| REQ-FEAT-0010-30 | `endTraining` aceito em `PAUSED` e em `COUNTDOWN`, sem resultado | `lap-training` (I): `endTraining` em contagem e numa pausa no meio de uma volta: fase `ENDED`, `listLapResults` como antes; E2E-12 em pausa |
| REQ-FEAT-0010-31 | recarregar no meio do treino não produz resultado da volta em andamento | a sessão só existe na memória (DM-0002) e nenhum símbolo de armazenamento existe em `src/lap.ts` nem em `src/main.ts` (`lap-layering`, U); E2E-12, recarga no meio de um treino |
| REQ-FEAT-0010-32 | a melhor volta válida não é guardada além do treino em andamento: depois do encerramento ela some e um novo treino não a exibe antes da sua primeira volta válida | `lap-training` (I): treino com uma volta `VALID` (`bestValidLapMs` presente); `endTraining`: `getLapState` sem `bestValidLapMs`; novo `startLap` `TRAINING`: `getLapState` sem `bestValidLapMs` e `listLapResults` vazia até o primeiro resultado `VALID` deste treino, também depois de um primeiro resultado `INVALID`; `lap-layering` (U): sem símbolo de armazenamento em `src/lap.ts`, `src/lapMessages.ts` e `src/main.ts`; E2E-12: o elemento "melhor volta válida" ausente no novo treino antes da primeira volta válida e depois da recarga |
| REQ-FEAT-0009-11 | nenhum resultado da volta gravado no navegador por esta feature | `lap-layering` (U): os textos de `src/lap.ts`, `src/lapMessages.ts` e `src/main.ts` não contêm `localStorage`, `sessionStorage`, `indexedDB` nem `document.cookie`; E2E-08: com o armazenamento do site limpo, depois de uma volta, de um treino de duas voltas e de uma recarga, 0 entradas em `localStorage`, `sessionStorage`, IndexedDB e cookies da origem, registradas em `docs/lap-validation-device-log.md` |

## Cobertura das regras de REQ-FEAT-0009-10

Marcador pulado, contramão, corte pelos limites padrão, corte pelos limites da pista, grama sem corte,
reposicionamento, reconhecimento e treino, pista de dado incompleto, início no sinal verde, queima de largada
ignorada, suspensão na pausa, interpolação do cruzamento, soma dos setores igual ao total e voltas seguidas no treino
(início da volta seguinte no instante de cruzamento da chegada, AC-US-0010-01; volta inválida do treino seguindo até a
próxima chegada, AC-US-0010-09; melhor volta válida, AC-US-0010-12 e -13): cada uma tem ao menos um teste nas linhas
acima, executado sem renderização nem controles.
