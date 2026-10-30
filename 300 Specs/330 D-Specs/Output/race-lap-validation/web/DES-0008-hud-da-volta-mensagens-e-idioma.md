---
id: DES-0008
title: HUD da volta, mensagens, idioma e legibilidade
feature: race-lap-validation
stage: dspec
status: validated
version: 1.1.0
sources: [FEAT-0001, FEAT-0002, FEAT-0004, FEAT-0005, FEAT-0006, FEAT-0007, FEAT-0010, REQ-FEAT-0001-02, REQ-FEAT-0001-03, REQ-FEAT-0001-04, REQ-FEAT-0001-09, REQ-FEAT-0001-10, REQ-FEAT-0002-06, REQ-FEAT-0002-09, REQ-FEAT-0004-04, REQ-FEAT-0004-08, REQ-FEAT-0005-05, REQ-FEAT-0005-08, REQ-FEAT-0006-02, REQ-FEAT-0006-05, REQ-FEAT-0007-01, REQ-FEAT-0007-02, REQ-FEAT-0007-03, REQ-FEAT-0007-04, REQ-FEAT-0007-05, REQ-FEAT-0007-06, REQ-FEAT-0007-07, REQ-FEAT-0007-08, REQ-FEAT-0007-09, REQ-FEAT-0007-10, REQ-FEAT-0007-11, REQ-FEAT-0007-12, REQ-FEAT-0007-13, REQ-FEAT-0007-14, REQ-FEAT-0010-02, REQ-FEAT-0010-04, REQ-FEAT-0010-07, REQ-FEAT-0010-11, REQ-FEAT-0010-12, REQ-FEAT-0010-13, REQ-FEAT-0010-15, REQ-FEAT-0010-16, REQ-FEAT-0010-19, REQ-FEAT-0010-23, REQ-FEAT-0010-24, REQ-FEAT-0010-25, REQ-FEAT-0010-27]
---

# DES-0008 — HUD da volta, mensagens, idioma e legibilidade

## Realiza

Os `REQ-*` em `sources`: contagem 3, 2, 1 e sinal verde em texto, com 48 px no mínimo e contraste de 4,5:1
(AC-US-0001-02, -03, -09, -10); cronômetro em zero na contagem (AC-US-0001-04); estado "válida em andamento" ou
"inválida" com o motivo em todos os quadros do início de cada volta ao fim, em texto além de cor, em português e em
inglês conforme o idioma do navegador, com 4,5:1 e 16 px no mínimo em `web-mobile` (AC-US-0009-01 a -09; NFR-0006,
NFR-0007); tempo de cada setor ao completá-lo (AC-US-0002-09); formato `m:ss.mmm` (AC-US-0002-06); volta pausada
indicada em texto. No treino: nenhuma contagem depois do sinal verde (AC-US-0010-04); "inválida" e "corte" a partir
do primeiro quadro depois do passo da invalidação e "válida em andamento" no início de cada volta seguinte
(AC-US-0010-07, -11); o estado exibido inalterado pelo reposicionamento (AC-US-0010-19); o resultado de cada volta
com tempo total, quatro tempos de setor com "—" nos setores sem tempo, validade com o motivo e "não oficial", ou só
tempo total e validade numa pista sem setores (AC-US-0010-02, -23 a -25, -27); a melhor volta válida
(AC-US-0010-12, -13); os rótulos do botão de pausa e da ação "encerrar treino" (AC-US-0010-15, -16). Tela:
SCR-0001. Textos: RULE-0006.

## Posicionamento

- `src/lapMessages.ts`, camada **aplicação**, puro (sem DOM, importável por `npm test`), existente e estendido.
  Motivo de ser um módulo próprio: `src/main.ts` não carrega em `npm test`, e os textos, o idioma e o formato precisam
  de prova automática.
- `index.html` e `src/style.css`, camada **aplicação**, alterados: elementos e estilos do HUD.
- A apresentação só exibe: validade, motivo, tempo, resultado de cada volta e melhor volta válida vêm de
  `getLapState` e `getLapResult`; nada é decidido nem comparado aqui (I2, D-FS-05).

## Interface

`src/lapMessages.ts`:

| Símbolo | Assinatura | Descrição |
|---|---|---|
| `resolveLanguage(tag)` | `(texto \| null \| undefined) => 'pt' \| 'en'` | idioma primário da etiqueta, sem a variante regional: `pt` ou `pt-BR` dá `pt`; `en` ou `en-GB` dá `en`; qualquer outro, ausente ou vazio dá `en` (`DEC-09`) |
| `message(key, lang)` | `(MessageKey, 'pt' \| 'en') => texto` | texto da tabela abaixo; total sobre as chaves |
| `formatLapTime(ms)` | `(inteiro >= 0) => texto` | `m:ss.mmm`, minutos sem zeros à esquerda, segundos com 2 dígitos, milissegundos com 3 dígitos, sem arredondar: 62345 dá `1:02.345`, 0 dá `0:00.000`, 3723004 dá `62:03.004`. Entrada negativa ou fracionária é limitada com `Math.max(0, Math.trunc(ms))` (I4) |
| `formatSectorTime(ms, lang)` | `(inteiro \| null, lang) => texto` | `formatLapTime(ms)` com um inteiro; `message('sectorNoTime', lang)`, isto é "—", com `null` (RULE-0003, formato) |
| `describeLap(view, lang)` | `(LapStateView, lang) => {stateText, reasonText?, pausedText?, countdownText?}` | `stateText` é `lapStateValidInProgress` com `lapValidity` `VALID` e `lapStateInvalid` com `INVALID`; `reasonText` só com `INVALID`; `pausedText` só com `lapPhase` `PAUSED`; `countdownText` só em `COUNTDOWN`, o numeral `Math.ceil(countdownRemainingMs / 1000)`. Como só uma sessão recém-criada passa por `COUNTDOWN`, no treino o numeral só aparece antes da primeira volta |
| `greenSignalVisible(view)` | `(LapStateView) => booleano` | verdadeiro com `lapPhase` `RUNNING` e `stepCount` menor que 120 (1 s de simulação); a duração é função de passos, não de relógio, e congela na pausa. No treino `stepCount` não recomeça, de modo que o sinal verde só aparece no começo do treino |
| `describeTrainingResult(result, lang)` | `(LapResult de TRAINING, lang) => {validityText, reasonText?, totalText, sectorTexts?, unofficialText?}` | `validityText`: `lapResultValid` com `VALID`, `lapStateInvalid` com `INVALID`; `reasonText` só com `INVALID`, o texto do motivo; `totalText`: `formatLapTime(trainingLapMs)`; `sectorTexts`: presente só quando o resultado traz `trainingSectorMs`, os quatro `formatSectorTime` em ordem; ausente numa pista sem setores, e nenhuma linha de setores é montada; `unofficialText`: `lapUnofficial` quando `official` é falso, isto é, em todo resultado do treino |

Chaves e textos (RULE-0006, mais as chaves de apoio acrescentadas por este projeto, marcadas com asterisco; o F-Spec
as deixou como redação do D-Spec):

| Chave | Português | Inglês |
|---|---|---|
| `lapStateValidInProgress` | válida em andamento | valid, in progress |
| `lapStateInvalid` | inválida | invalid |
| `reasonMissedMarker` | marcador pulado | missed marker |
| `reasonCut` | corte | cut |
| `reasonReposition` | reposicionamento | repositioning |
| `lapUnofficial` | não oficial | unofficial |
| `countdownGreenSignal` | VERDE | GREEN |
| `lapResultValid` | válida | valid |
| `lapPaused` | volta pausada | lap paused |
| `pauseAction` | pausar | pause |
| `endTrainingAction` | encerrar treino | end training |
| `bestValidLap` | melhor volta válida | best valid lap |
| `sectorNoTime` | — | — |
| `loadingTrack` | carregando a pista | loading track |
| `noTrackAvailable` | nenhuma pista disponível | no track available |
| `trackDataError` | dado da pista indisponível | track data unavailable |
| `controlFallbackTouch` | controle por toque (sensor de inclinação indisponível) | touch control (tilt sensor unavailable) |
| `sectorLabel`* | setor | sector |
| `totalLabel`* | tempo total | total time |
| `startTraining`* | treino | training |
| `startOfficial`* | volta oficial | official lap |
| `startRecon`* | volta de reconhecimento | recon lap |
| `resumeLap`* | continuar | resume |
| `newLap`* | nova volta | new lap |

São 24 chaves. `startTraining` passa de "volta de treino" a "treino" porque a opção de SCR-0002 inicia um treino de
voltas seguidas, e não uma volta. Os rótulos e textos já existentes da página (cabeçalho, painel de acerto, dicas de
tecla) permanecem como estão; a exigência de dois idiomas vale para os estados, os motivos e os textos desta feature.

**Elementos** (índice de SCR-0001), todos em `index.html` dentro de `.game-shell`, salvo os botões da barra de ações:

| Elemento | Conteúdo |
|---|---|
| `#lap-countdown` | numeral da contagem (3, 2, 1) ou `countdownGreenSignal`; centralizado; oculto fora da contagem e do sinal verde |
| `#lap-state` | `stateText` e, se houver, `reasonText`, em `role="status"`; atualizado só quando o texto muda; no treino, do início de cada volta ao seu fim |
| `#lap-paused` | `pausedText` quando a fase é `PAUSED` |
| `#lap-sectors` | lista dos setores completados da volta em andamento, `sectorLabel` n e `formatLapTime(completedSectorMs[n-1])` |
| `#lap-control-fallback` | `controlFallbackTouch` em `web-mobile` sem inclinação ativa |
| `#timer` (existente) | `formatLapTime(elapsedMs)`; `0:00.000` até o sinal verde; no treino, o tempo da volta em andamento, que recomeça no início de cada volta |
| `#lap-best-valid` (novo) | `bestValidLap` e `formatLapTime(bestValidLapMs)`; visível só quando `getLapState` traz `bestValidLapMs` |
| `#lap-training-result` (novo) | painel do resultado da volta encerrada mais recente do treino: título `validityText` e, se houver, `reasonText`; linha `totalLabel` + `totalText` + `unofficialText`; lista `sectorLabel` n + `sectorTexts[n-1]` quando houver, nenhuma lista numa pista sem setores. Visível num treino que não está em `ENDED` e já tem resultado; refeito só quando muda o `lapSequenceCount` do último resultado ou o idioma |
| `#pause` (existente, barra de ações) | `resumeLap` com a fase `PAUSED`; `pauseAction` num treino em `COUNTDOWN` ou `RUNNING` ([DES-0007](DES-0007-integracao-da-aplicacao.md)) |
| `#lap-end-training` (novo, barra de ações) | `endTrainingAction`, num treino em `COUNTDOWN`, `RUNNING` ou `PAUSED` |

`#lap-best-valid` e `#lap-training-result` ficam na coluna direita, abaixo de `.timing`, sem cobrir `#lap-state`
(centro, topo), `#lap-sectors` (coluna esquerda) nem o cronômetro: o resultado de uma volta do treino é distinto do
estado da volta em andamento e não o oculta (SCR-0001). O painel não pede ação e o jogo não para. Ele fica visível do
primeiro quadro depois do cruzamento que encerrou a volta até ser substituído pelo resultado da volta seguinte ou
até o encerramento do treino ([ADR-0004](../adr/ADR-0004-lacunas-do-f-spec-resolvidas-no-projeto.md), item 5).

**Idioma.** A cada quadro a aplicação lê `navigator.language` (uma leitura, sem custo) e chama `resolveLanguage`,
de modo que uma mudança de idioma durante a volta é seguida sem alterar a validade (REQ-FEAT-0007-13). O idioma
não é gravado nem enviado (NFR-0005).

**Legibilidade.** Cada texto de estado, motivo, contagem, setor, resultado de volta do treino e melhor volta válida
fica dentro de um bloco com fundo **opaco** próprio (`.lap-chip`), para que o "fundo imediato" seja determinado e
não dependa da cena 3D. Fichas de cores em `src/style.css`, no `:root`:

| Propriedade | Valor | Uso | Contraste |
|---|---|---|---|
| `--lap-text` | `#ffffff` | texto sobre as fichas | — |
| `--lap-chip-bg` | `#13241e` | ficha de estado válido, contagem, setores, pausa, resultado válido do treino, melhor volta válida | 16,2:1 com `--lap-text` |
| `--lap-chip-invalid-bg` | `#7a1f12` | ficha de estado inválido e de resultado inválido do treino | 10,3:1 com `--lap-text` |
| `--lap-countdown-size` | `48px` | tamanho mínimo do numeral e do sinal verde | — |
| `--lap-state-size` | `16px` | tamanho mínimo do texto de estado, de motivo e do resultado de cada volta do treino, aplicado em `web-desktop` e `web-mobile` | — |

O tamanho do numeral é `font-size: max(var(--lap-countdown-size), 6vw)`, e o do estado `max(var(--lap-state-size), 1rem)`.
Aplicar 16 px também em `web-desktop` cumpre o mínimo de `web-mobile` e não contraria a decisão do dono do produto,
que não fixa mínimo naquele canal. Nenhuma propriedade nova de cor é criada: os elementos novos usam as fichas
existentes. A cor distingue válida de inválida **além** do texto, nunca no lugar dele (NFR-0006).

## Colaboradores

Chama `LapStateView` e `LapResult` (tipos de `src/lap.ts`, só como tipos) e nada mais. É chamado por `src/main.ts`
e pelos testes. `src/lapMessages.ts` importa apenas tipos de `src/lap.ts` (camada interna): o sentido é permitido.

## Estado e concorrência

Sem estado próprio: a mensagem é função de `lapValidity`, `invalidReason`, `official`, do tipo de volta, da presença
do tempo de cada setor e do idioma corrente. Exibir a mesma mensagem duas vezes é sem efeito. A mensagem não altera
o estado da volta. Ao continuar depois de uma pausa, o estado exibido é o do instante da pausa, porque nenhum campo de
validade mudou (REQ-FEAT-0007-12); o mesmo vale depois de um reposicionamento no treino (REQ-FEAT-0010-19). A
melhor volta válida exibida é a que a simulação calcula: a tela não compara tempos (D-FS-05).

## Comportamento em falha

Chave desconhecida: `message` é total sobre `MessageKey` (o compilador garante); idioma ausente cai em inglês.
`getLapState` devolvendo `NO_ACTIVE_LAP` esconde `#lap-state`, `#lap-sectors`, `#lap-countdown`, `#lap-best-valid` e
`#lap-training-result` (estado Vazio); `getLapResult` devolvendo `NO_RESULT` no treino esconde
`#lap-training-result`. Registro: nenhum.

## Determinismo (D-DS-07)

Não é código de simulação; mesmo assim é puro e determinístico: a mesma `view`, o mesmo resultado e o mesmo idioma
dão o mesmo texto. Provas: `tests/lap-messages.test.ts` (`resolveLanguage` para `pt`, `pt-BR`, `en`, `en-US`, `fr`,
`es-419`, `de`, vazio e `undefined`; `formatLapTime` nos exemplos de RULE-0003, incluindo 59999 e 3723004;
`formatSectorTime(null)` igual a "—"; as 24 chaves existem nos dois idiomas e nenhuma está vazia; `describeLap` para
cada combinação de validade e motivo; `describeTrainingResult` para resultado `VALID` com quatro setores, `INVALID`
com `CUT` e com `MISSED_MARKER`, setores com `null` e resultado sem `trainingSectorMs`, sempre com "não oficial") e
`tests/lap-hud-css.test.ts` (lê `src/style.css`, extrai as propriedades `--lap-*` e afirma contraste maior ou igual a
4,5 para os pares da tabela, 48 px para o numeral e 16 px para o estado).

## Feature flag

Nenhuma: FEAT-0001, FEAT-0007 e FEAT-0010 não têm chave; o HUD vale ligado.

## Pontos em aberto

Nenhum.
