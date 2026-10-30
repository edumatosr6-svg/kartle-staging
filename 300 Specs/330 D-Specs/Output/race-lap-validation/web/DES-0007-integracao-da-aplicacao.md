---
id: DES-0007
title: Integração da aplicação, adaptadores de pausa e laço de quadros
feature: race-lap-validation
stage: dspec
status: validated
version: 1.1.0
sources: [FEAT-0001, FEAT-0003, FEAT-0007, FEAT-0009, FEAT-0010, REQ-FEAT-0001-12, REQ-FEAT-0001-13, REQ-FEAT-0003-03, REQ-FEAT-0003-04, REQ-FEAT-0003-05, REQ-FEAT-0003-06, REQ-FEAT-0003-07, REQ-FEAT-0003-12, REQ-FEAT-0007-12, REQ-FEAT-0009-05, REQ-FEAT-0009-06, REQ-FEAT-0010-14, REQ-FEAT-0010-15, REQ-FEAT-0010-16, REQ-FEAT-0010-18, REQ-FEAT-0010-31]
---

# DES-0007 — Integração da aplicação, adaptadores de pausa e laço de quadros

## Realiza

Os `REQ-*` em `sources`: pausa por Esc, perda de foco e perda do sensor, sem ação do Jogador nos dois últimos
(AC-US-0003-05 a -07); o cronômetro exibido para e volta com o mesmo valor; a contagem suspensa na pausa; o
controle por toque com estado visível quando o sensor falta (REQ-FEAT-0001-13); tempo independente da taxa de
quadros (AC-US-0003-03, -04); 60 fps e 30 fps com a validação ativa (NFR-0003); e a retirada da validação
preliminar por portões. No treino: o laço de quadros segue avançando a simulação depois de cada fim de volta, de
cada corte e de cada reposicionamento, sem ação do Jogador (AC-US-0010-14); o botão de pausa e a ação "encerrar
treino" nos dois canais (AC-US-0010-15, -16); depois do encerramento, a volta à oferta sem nenhuma volta iniciada
(AC-US-0010-18). Nenhuma regra de volta é decidida aqui (I2, REQ-FEAT-0009-01).

## Posicionamento

- `src/main.ts`, camada **aplicação**, alterado. Os **adaptadores de controle** continuam dentro de `src/main.ts`,
  como hoje (mapa de camadas); cada um só converte um evento em um comando ou em `Input` normalizado. Dividir
  `src/main.ts` não faz parte desta feature.
- `src/frameClock.ts`, camada **aplicação**. Motivo de ter sido criado: a conversão de tempo de quadro em passos era
  um laço interno de `main.ts`, que importa Three.js e o DOM e não carrega em `npm test`; extraí-la como função pura
  permite provar a independência de taxa de quadros.
- `index.html`, camada **aplicação**: o botão de encerrar o treino entra na barra de ações existente
  (`.toolbar .actions`), ao lado de `#reset` e `#pause`; não há módulo novo nesta rodada.

## Interface

`src/frameClock.ts`:

| Símbolo | Assinatura | Descrição |
|---|---|---|
| `MAX_FRAME_S` | `0.1` | teto do tempo de quadro, como o laço atual (`Math.min(..., 0.1)`) |
| `advanceClock(accumulatorS, frameDtS)` | `(número >= 0, número >= 0) => {steps: inteiro, accumulatorS: número}` | soma `min(frameDtS, MAX_FRAME_S)` ao acumulador e subtrai `STEP` enquanto o acumulador for maior ou igual a `STEP`, contando os passos, com a mesma aritmética do laço atual |

O tempo de parede só decide **quantos** passos rodam num quadro; o resultado da volta depende apenas da sequência
de passos e de `Input` (DES-0002). A queda de quadros reduz a velocidade percebida do jogo, nunca altera o tempo
oficial.

`src/main.ts`, por trecho do código anterior à integração (rodada 1):

| Trecho atual | Mudança |
|---|---|
| import (linha 2) | passa a importar `startLap`, `pauseLap`, `resumeLap`, `repositionKart`, `stepLap`, `getLapState`, `getLapResult`, `offeredLapKinds` de `./lap`; `readTrackData` e `SYNTHETIC_TRACK_FILE` de `./trackData` e `./track`; `advanceClock` de `./frameClock`; `LapTracker` sai do import |
| estado (linhas 146 a 152) | `state` e `laps` saem; entram `lap: LapSession \| undefined`, `reading: TrackReading` (lido uma vez, com `readTrackData(SYNTHETIC_TRACK_FILE)`) e `accumulatorS`. Antes de qualquer volta o kart exibido é `initialState()` na largada |
| `reset` (linhas 156 a 161) e botão `#reset` (linha 193), tecla `R` (linha 207) | passam a emitir `repositionKart(lap)` e a ignorar a rejeição. O antigo "reiniciar tudo" deixa de existir; recomeçar é uma nova volta |
| `$('start').onclick` (linha 185) | passa a apresentar a oferta de volta ([DES-0009](DES-0009-inicio-de-volta-e-erros.md)) e, ao escolher um tipo, a chamar `startLap(lap, request, reading, config)` e limpar `accumulatorS`, `keys` e `touch` |
| seletor de estilo e peso (linhas 162 a 184) | os controles ficam desabilitados enquanto houver volta em `COUNTDOWN`, `RUNNING` ou `PAUSED`; a mudança vale para a volta seguinte, pois `config` é fixada no `startLap` (INV-4). O texto existente "reinicia o treino" passa a "vale na próxima volta" |
| `pause()` (linhas 194 a 202) e botão `#pause` | `pause()` sai. O botão `#pause` fica visível e ativo com a fase `PAUSED`, com o rótulo "Continuar", e chama `resumeLap(lap)`; no treino, também em `COUNTDOWN` e `RUNNING`, como botão de pausa (tabela da rodada de 2026-10-30, abaixo). Fora desses casos fica oculto. Pausar manualmente fora do treino é a tecla Esc em `web-desktop`; em `web-mobile` não há pausa manual por toque fora do treino, porque os requisitos não a exigem ([ADR-0005](../adr/ADR-0005-pausa-retomada-e-perda-do-sensor.md)). Ao pausar, a aplicação limpa `keys` e `touch` e zera `accumulatorS`; ao continuar, zera `accumulatorS` para não liberar passos acumulados |
| `keydown` Esc (linha 208) | Esc em `COUNTDOWN` ou `RUNNING` emite `pauseLap(lap, 'ESC_KEY')`; em `PAUSED` emite `resumeLap(lap)` ([ADR-0005](../adr/ADR-0005-pausa-retomada-e-perda-do-sensor.md)) |
| `blur` e `visibilitychange` (linhas 211 e 212) | emitem `pauseLap(lap, 'FOCUS_LOST')`; o retorno do foco **não** retoma a volta (RULE-0002) |
| inclinação (linhas 218 a 237) | a lógica de calibração não muda; acrescenta-se `lastOrientationAtMs` (relógio de parede, só do adaptador) atualizado a cada `deviceorientation` com leitura válida, e a vigilância descrita abaixo |
| laço de quadros (linhas 255 a 283) | `dt` é lido como hoje; se a fase for `COUNTDOWN` ou `RUNNING`, `advanceClock` dá o número de passos e cada passo chama `lap = stepLap(lap, input)`, interrompendo o laço quando a fase vira `ENDED`. O `Input` é amostrado uma vez por quadro, como hoje. As linhas 276 a 281 (decisão de volta, `best`, `state.elapsed = 0`) são removidas; a regra vive em `src/lap.ts` |
| renderização do kart, câmera, áudio e minimapa (linhas 284 a 329) | leem `lap.kart` (ou `initialState()` sem volta); `audio.update` recebe `fase === 'RUNNING'` no lugar de `running` |
| `$('timer')` (linha 330) | exibe `formatLapTime(view.elapsedMs)` ([DES-0008](DES-0008-hud-da-volta-mensagens-e-idioma.md)), e não `format(state.elapsed)` |
| `best` (linha 149, 277) | passa a ser derivado de `getLapResult(lap).lapMs` quando `lapValidity` é `VALID`, apenas na memória da página; nada é gravado (REQ-FEAT-0009-11) |

**Rodada de 2026-10-30: treino com voltas seguidas** (FEAT-0010; trechos do código em execução, depois de
`c41c6c3` e das integrações de `dirigibilidade`, `pista-kart-park` e `modelo-kart-01`):

| Trecho atual | Mudança |
|---|---|
| import de `./lap` (`src/main.ts:10`) | acrescenta `endTraining` e `listLapResults` |
| `emitPause` (`src/main.ts:198-202`) | a causa passa a aceitar `PAUSE_BUTTON`; o resto não muda (limpa `keys` e `touch`, zera `accumulatorS`) |
| novo `emitEndTraining` | chama `endTraining(lap)`; aceito, guarda a sessão devolvida, zera `accumulatorS`, limpa `keys` e `touch`, esconde o painel do resultado da volta do treino e mostra o painel de oferta `#welcome` (SCR-0002, [DES-0009](DES-0009-inicio-de-volta-e-erros.md)); rejeitado, não faz nada. Nenhum resultado é produzido para a volta em andamento (a simulação decide, DES-0001) |
| `$('pause').onclick` (`src/main.ts:341`) | com a fase `PAUSED`, `emitResume()`, como hoje; num treino em `COUNTDOWN` ou `RUNNING`, `emitPause('PAUSE_BUTTON')` (REQ-FEAT-0010-15) |
| visibilidade e rótulo de `#pause` (`src/main.ts:597-599`) | visível com a fase `PAUSED` (rótulo `resumeLap`, como hoje) e num treino em `COUNTDOWN` ou `RUNNING` (rótulo `pauseAction`); oculto nos demais casos. Em volta oficial e de reconhecimento nada muda |
| novo botão `#lap-end-training` em `index.html:33` (`.actions`) | rótulo `endTrainingAction`; visível só num treino em `COUNTDOWN`, `RUNNING` ou `PAUSED`, oculto nos demais casos; `onclick` = `emitEndTraining`. Acionável por ponteiro em `web-desktop` e por toque em `web-mobile`; nenhum atalho de teclado (REQ-FEAT-0010-16; ADR-0004, item 8) |
| laço de passos (`src/main.ts:488-519`) | sem mudança de forma: roda enquanto a fase é `COUNTDOWN` ou `RUNNING` e para em `ENDED`. Como o fim de uma volta do treino, o corte e o reposicionamento deixam a fase em `RUNNING`, o quadro seguinte roda os seus passos sem nenhum comando (REQ-FEAT-0010-14); só a pausa e o encerramento suspendem o avanço |
| novo resultado (`src/main.ts:524-538`) | o gancho que hoje roda quando a fase chega a `ENDED` passa a rodar a cada resultado novo: `handledResults` guarda quantos itens de `listLapResults(lap).lapResults` já foram tratados; depois dos passos do quadro, cada item novo, em ordem, passa pelo mesmo tratamento de hoje (registro de `dirigibilidade` com `buildLapRecord`, melhor registro comparável com `compareLapRecords`, `renderBest`), e `handledResults` passa ao comprimento da lista. Em volta oficial e de reconhecimento o resultado novo aparece no mesmo passo em que a fase chega a `ENDED`, como antes; no treino, a cada volta concluída na chegada. `handledResults` volta a 0 em `beginLap` e em `chooseTrack` |
| `renderResult` (`src/main.ts:439-469`, chamada em `:592`) | chamada só quando a fase é `ENDED` e `lapKind` não é `TRAINING`: a tela de resultado (SCR-0003, [DES-0010](DES-0010-resultado-da-volta.md)) é só da volta oficial e da de reconhecimento. O treino encerrado volta à oferta (`emitEndTraining`) |
| `renderHud` (`src/main.ts:408-438`) | acrescenta a melhor volta válida e o painel do resultado da volta do treino ([DES-0008](DES-0008-hud-da-volta-mensagens-e-idioma.md)); a contagem, o sinal verde, o estado, a pausa e os setores da volta em andamento não mudam de regra |
| `lapActive` (`src/main.ts:196`) e controles de acerto (`:594-596`) | sem mudança: num treino em `COUNTDOWN`, `RUNNING` ou `PAUSED` o peso e o estilo ficam desabilitados; depois do encerramento, liberados para o próximo treino |

**Vigilância do sensor (web-mobile).** Com `tilt` ativo e a fase `COUNTDOWN` ou `RUNNING`, se
`performance.now() - lastOrientationAtMs` passar de `SENSOR_SILENCE_MS` = 500, o adaptador emite
`pauseLap(lap, 'SENSOR_LOST')` uma vez (um segundo evento recebe `ALREADY_PAUSED`). Ao continuar, `lastOrientationAtMs`
recebe o instante atual, dando 500 ms de tolerância. O relógio de parede é usado só para decidir **quando** emitir o
comando; nunca altera o tempo da volta. Esta é a única leitura de relógio, e fica no adaptador da camada de aplicação
(permitido pelo mapa de camadas). No treino vale o mesmo.

**Sensor ausente ou permissão negada antes da volta.** Em `web-mobile` (canal reconhecido por
`matchMedia('(pointer: coarse)')` no início da volta, como o CSS já faz), se `tilt` não está ativo, a aplicação
usa o controle por toque e exibe o texto `controlFallbackTouch` durante toda a volta ou todo o treino
([DES-0008](DES-0008-hud-da-volta-mensagens-e-idioma.md)); a duração da contagem, as regras e a sequência de voltas
não mudam. Em `web-desktop` o estado não se aplica.

## Colaboradores

Chama `src/lap.ts`, `src/trainingSession.ts` (de `pista-kart-park`: `startTrainingLap`, que inicia o treino com
`startLap` `TRAINING`), `src/trackData.ts`, `src/track.ts`, `src/frameClock.ts`, `src/lapMessages.ts`,
`src/setupRecords.ts` (de `dirigibilidade`, registro do resultado), `src/audio.ts` (existente). É o único chamador de
comandos de volta. Não é chamado por nenhum outro módulo.

## Estado e concorrência

- Estado local: `lap`, `reading`, `accumulatorS`, `keys`, `touch`, `tilt`, `lastOrientationAtMs`,
  `handledResults`. A volta é a fonte única; a aplicação não copia validade nem tempo e não decide quando uma volta
  do treino termina.
- Eventos de pausa chegam de quatro origens independentes (Esc, `blur`/`visibilitychange`, vigilância, botão de
  pausa no treino) e podem coincidir: a deduplicação é da simulação (`ALREADY_PAUSED`), não do adaptador. Pausa e
  `blur` ao mesmo tempo viram uma pausa. Um clique duplo em "encerrar treino" recebe `LAP_ENDED` no segundo e não faz
  nada.
- `handledResults` só cresce dentro de uma sessão e é a chave que impede tratar duas vezes o mesmo resultado
  (registro de `dirigibilidade`); a simulação nunca altera um resultado já produzido (INV-11).
- Recarregar ou abandonar a página descarta `lap`: nenhum resultado para a volta em andamento e nada gravado
  (REQ-FEAT-0010-31).
- Mudar `config` entre voltas não afeta voltas já iniciadas (cópia congelada na sessão).

## Comportamento em falha

- `readTrackData` devolvendo `UNREADABLE` ou `UNSUPPORTED_SCHEMA`: não se cria volta, a oferta fica vazia e o erro
  é exibido ([DES-0009](DES-0009-inicio-de-volta-e-erros.md)).
- WebGL ausente: o tratamento existente é mantido.
- Rede: nenhuma chamada; a ausência de rede não tem efeito observável.
- Aba oculta: `requestAnimationFrame` é suspenso pelo navegador e a volta já foi pausada por `FOCUS_LOST`.
- Rejeição de `endTraining` ou de `pauseLap` com `PAUSE_BUTTON` (`NOT_TRAINING`, `LAP_ENDED`, `ALREADY_PAUSED`): sem
  efeito e sem mensagem, como determina SCR-0001; os botões só aparecem quando o pedido é aceito.
- Registro: apenas os avisos de DES-0006 e de `dirigibilidade`, com identificadores; nada de conteúdo de jogador.

## Observabilidade das metas de desempenho

NFR-0003 (60 fps em notebook, 30 fps em celular) é medido no aparelho nomeado com as ferramentas de desempenho do
navegador, em teste registrado em `docs/lap-validation-device-log.md` (aparelho, navegador, versão, fps médio e
mínimo numa volta completa e num treino de ao menos duas voltas seguidas). Não se acrescenta instrumento ao jogo
para isso: seria superfície só de teste. A validação de volta custa uma chamada a `nearest` (240 segmentos) por
passo, já usada pela física por roda; o orçamento a conferir no teste registrado é de no máximo 12 passos por quadro
(teto de 0,1 s). O fim de uma volta do treino acrescenta, no passo do cruzamento, a montagem de um resultado e, no
quadro seguinte, a reconstrução de um painel de texto: custo constante por volta, não por passo.

## Determinismo (D-DS-07)

A aplicação não está na simulação; ainda assim a independência de taxa de quadros é provada:
`tests/frame-clock.test.ts` aplica `advanceClock` com quadros de 1/30 s e de 1/60 s à mesma duração, conferindo a
contagem de passos; `tests/lap-determinism.test.ts` executa a mesma sequência de `Input` por passo agrupada em
quadros de 2 e de 4 passos e compara os resultados com `deepEqual`.

## Feature flag

Nenhuma: nenhum requisito pede chave; a aposentadoria da validação preliminar aconteceu na mesma mudança que
introduziu a nova, e o treino de voltas seguidas substitui o treino de volta única na mesma mudança, de modo que não
há dois comportamentos ativos (FEAT-0010, Configuração: "Nenhuma"). A reversão é a do repositório (DM-0001).

## Pontos em aberto

Nenhum.
