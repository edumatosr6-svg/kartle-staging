---
id: DES-0007
title: Tela inicial com seletor e crédito, crédito na tela de resultado e nome da pista da sessão
feature: pista-kart-park
stage: dspec
status: validated
version: 2.0.1
sources: [SCR-0001, SCR-0002, FLOW-0001, FEAT-0001, FEAT-0003, FEAT-0006, REQ-FEAT-0001-01, REQ-FEAT-0001-02, REQ-FEAT-0001-03, REQ-FEAT-0001-04, REQ-FEAT-0001-11, REQ-FEAT-0001-13, REQ-FEAT-0001-14, REQ-FEAT-0001-15, REQ-FEAT-0001-16, REQ-FEAT-0003-09, REQ-FEAT-0003-14, REQ-FEAT-0006-01, REQ-FEAT-0006-02, REQ-FEAT-0006-03, REQ-FEAT-0006-04, REQ-FEAT-0006-05, REQ-FEAT-0006-06, REQ-FEAT-0006-07, REQ-FEAT-0006-08, REQ-FEAT-0006-09, REQ-FEAT-0006-10, REQ-FEAT-0006-11, REQ-FEAT-0006-12, REQ-FEAT-0006-13]
---

# DES-0007 — Tela inicial com seletor e crédito, crédito na tela de resultado e nome da pista da sessão

## Realiza

As telas SCR-0001 e SCR-0002 e os passos de aplicação de FLOW-0001: o seletor com as duas opções na tela
inicial (REQ-FEAT-0001-01), a Kart Park selecionada e carregada a cada abertura, sem ler nem gravar a escolha
(REQ-FEAT-0001-02, -03, -04); só volta de treino oferecida (REQ-FEAT-0001-11); o seletor e a pista inalterados
sem sensor em `web-mobile`, com o aviso de toque existente (REQ-FEAT-0001-13); o erro do dado na tela inicial,
com as duas opções selecionáveis (REQ-FEAT-0001-14), também quando o arquivo lido não é o da versão que a
entrada do catálogo declara (`TRACK_VERSION_MISMATCH`, REQ-FEAT-0001-16); o arquivo publicado da versão 2 da Kart
Park como o único da Kart Park empacotado no jogo (REQ-FEAT-0001-15); a linha de crédito OSM — texto, menção e link — no
seletor com a Kart Park selecionada e na tela de resultado de uma volta na Kart Park, só para pista com
`osmCredit`, sem rede, nos dois canais e nas duas telas (REQ-FEAT-0006-01 a -06, -10, -12, -13); o nome e o
comprimento da Kart Park em toda tela que exibe o nome, iguais nos dois idiomas (REQ-FEAT-0006-07, -08, -11);
nenhum recorde (REQ-FEAT-0006-09); o motivo "marcador pulado" e a tela de resultado com o tempo total e os 4
setores, de `race-lap-validation`, sem mudança, também na Kart Park (REQ-FEAT-0003-09, -14).

**Tela de resultado de uma volta de treino.** A sessão desta feature só inicia treinos
([DES-0005](../core/DES-0005-sessao-de-treino-catalogo-e-selecao-de-pista.md)), e no F-Spec revalidado de
`race-lap-validation` o resultado de cada volta do treino não usa a tela de resultado da volta (SCR-0003 1.2.1
daquela feature, só de volta oficial e de reconhecimento): aparece, sem parar o jogo, no **painel do resultado da
volta do treino** da tela de corrida (SCR-0001 1.1.0, estado "Resultado da volta do treino"; elemento
`#lap-training-result` de DES-0008 1.1.0 daquela feature), com validade, motivo, tempo total, os quatro tempos de
setor em `m:ss.mmm` e "não oficial". É esse o resultado de `race-lap-validation`, "nomeado e não redefinido", a que
SCR-0002 desta feature acrescenta o crédito: a linha de crédito OSM passa a ficar dentro desse painel, exibida com
o resultado de cada volta concluída na Kart Park, válida ou inválida
([ADR-0007](../adr/ADR-0007-credito-no-painel-do-resultado-da-volta-do-treino.md)).

## Posicionamento

Camada **aplicação**:

- `src/main.ts`, alterado: estado da sessão, seletor, crédito, nome da pista, início da volta, já entregues pelas
  revisões 1 e 2; na revisão 3, só a importação do arquivo da Kart Park, as fontes do treino e o aviso de
  `TRACK_VERSION_MISMATCH`.
- `index.html`, já existente na árvore de `281b617`: dois contêineres em `#welcome` (`index.html:19`), um dentro de
  `#lap-training-result` (`:26`, o painel que `race-lap-validation` acrescenta à coluna direita da tela de
  corrida), que substituiu o de `#lap-result` (`:27`, sem `lap-result-credit`), e o identificador `#track-name` no
  rótulo da pista (`:17`). A revisão 3 não muda `index.html`.
- `src/style.css`, alterado: regras `.track-selector` e `.track-credit`.
- `src/lapMessages.ts`, alterado (aplicação pura, de `race-lap-validation`): recebe os textos do crédito
  (`OSM_CREDIT`), a regra de tela do crédito (`creditFor`) e a formatação do rótulo da opção (`optionLabel`).
  Continua importando só tipos de `./lap` (`tests/race-lap-validation-layering.test.ts:27-28`): as duas
  funções recebem a entrada do catálogo por tipo estrutural, sem importar `src/trainingSession.ts`. Nenhuma
  chave nova em `MESSAGES` (as 20 chaves de CHK-TEST-0010-17 continuam as mesmas), porque esses textos não
  passam por `message()` nem por `resolveLanguage` (REQ-FEAT-0006-11). Motivo de não ser módulo novo:
  `src/lapMessages.ts` já é o módulo da aplicação pura com os textos das telas e carrega em `npm test`, onde
  `src/main.ts` não carrega.
- `src/rawImports.d.ts`, **novo**, só declaração de tipo: `declare module '*.json?raw' { const text: string;
  export default text; }`, para `tsc --noEmit` aceitar a importação do arquivo de pista como texto (o
  `tsconfig.json` inclui `src`). Motivo de ser novo: nenhum arquivo de declaração existe hoje.

`src/main.ts` não decide regra: a sessão, a escolha e a oferta de volta vêm de `src/trainingSession.ts`
([DES-0005](../core/DES-0005-sessao-de-treino-catalogo-e-selecao-de-pista.md)), que entrega as entradas do
catálogo com `osmCredit`, `displayName` e `displayLengthM`; o crédito e o rótulo de uma entrada vêm de
`creditFor` e `optionLabel` (`src/lapMessages.ts`); a validade, o motivo e os tempos vêm de `src/lap.ts` (I2).

## Interface

`src/lapMessages.ts`, acrescido (o resto do módulo não muda):

| Símbolo | Assinatura | Descrição |
|---|---|---|
| `OSM_CREDIT` | `{text: '© colaboradores do OpenStreetMap', license: 'licença ODbL', url: 'https://openstreetmap.org/copyright'}`, congelado | os textos do crédito, sem tradução (REQ-FEAT-0006-01 a -06, -11) |
| `creditFor(option)` | `({readonly osmCredit: boolean} \| undefined) => typeof OSM_CREDIT \| undefined` | `OSM_CREDIT` só quando a entrada do catálogo recebida declara `osmCredit` verdadeiro (REQ-FEAT-0006-10); `undefined` para a entrada da pista sintética e para entrada ausente (`trackId` fora do catálogo). A entrada é a de `getTrainingTrackOptions(training).options` com o `trackId` da tela: `selectedTrackId` no seletor (SCR-0001), o `trackId` do resultado exibido no painel do resultado da volta do treino (`getLapResult(lap)`, o último item de `listLapResults`) no resultado (SCR-0002) |
| `optionLabel(option)` | `({readonly displayName: string; readonly displayLengthM?: number}) => string` | `displayName`, seguido de `' · '`, `displayLengthM` e `' m'` quando `displayLengthM` existe; só `displayName` sem ele (REQ-FEAT-0006-07, -08) |

Elementos novos ou alterados em `index.html` ("entrada de `X`" é a entrada de `getTrainingTrackOptions(training).options` com `trackId` `X`):

| Elemento | Onde | Conteúdo |
|---|---|---|
| `#track-selector` | dentro de `#welcome`, antes de `#track-status` | `div` com `role="group"` e `aria-label="Pista"`; dois `button type="button"` com `data-track-id` (`kart-park`, `synthetic`), texto `optionLabel(opção)` e `aria-pressed` `true` na opção de `selectedTrackId` |
| `#track-credit` | dentro de `#welcome`, depois de `#track-selector` | `p` com a classe `lap-chip track-credit`, oculto (`hidden`) salvo quando `creditFor` da entrada de `selectedTrackId` existe: `OSM_CREDIT.text`, ` · `, `OSM_CREDIT.license`, ` · ` e um `a` com `href` `OSM_CREDIT.url`, `target="_blank"`, `rel="noopener noreferrer"` e texto `openstreetmap.org/copyright`, na mesma linha |
| `#lap-training-result-credit` | último filho de `#lap-training-result`, depois do título, da linha do total e da lista de setores que `race-lap-validation` desenha | `p` com a classe `lap-chip track-credit` e o mesmo conteúdo de `#track-credit`, visível só quando o painel está visível e `creditFor` da entrada do `trackId` do resultado exibido existe; o `a` recebe `pointer-events: auto` (a coluna da tela de corrida não captura o ponteiro em todos os blocos) e é acionável por clique em `web-desktop` e por toque em `web-mobile` |
| `#lap-result-credit` | **retirado** de `#lap-result` | o elemento sai de `index.html` e `renderResult` deixa de chamar `renderCredit`: `#lap-result` só exibe volta oficial e de reconhecimento (DES-0007 1.1.0 de `race-lap-validation`), que a sessão de treino não oferece, de modo que o contêiner nunca seria exibido; o crédito do resultado passa a `#lap-training-result-credit`, na mesma entrega |
| `#track-name` | o `strong` de `.track-label` (`index.html:17`) | `optionLabel` da opção de `selectedTrackId`; substitui o texto fixo "Circuito Aurora", que nomeia a pista sintética e, com a Kart Park na sessão, a nomearia errado |

O crédito é construído por uma função local de `src/main.ts`, `renderCredit(container, credit)`, que cria o
texto e o `a` a partir de `OSM_CREDIT` com `textContent` e `setAttribute` (nunca `innerHTML`), e que esvazia e
oculta o contêiner quando `credit` é `undefined`. As duas telas usam a mesma função, de modo que o texto, a
menção e o link são idênticos (REQ-FEAT-0006-13).

`src/main.ts`, por trecho da árvore de `281b617` (os trechos já entregues pelas revisões 1 e 2 marcados como existentes; a revisão 3 muda só a importação, as fontes e o aviso de `TRACK_VERSION_MISMATCH`):

| Trecho atual | Mudança |
|---|---|
| `:13` importação do arquivo da Kart Park | revisão 3: `kartParkV1Text from './tracks/kart-park-v1.json?raw'` passa a `kartParkV2Text from './tracks/kart-park-v2.json?raw'`; o arquivo da versão 1 deixa de ser importado e, por isso, não entra no pacote do jogo (a lacuna "se o arquivo da versão 1 é entregue ao navegador" do F-Spec, decidida em [ADR-0008](../adr/ADR-0008-kart-park-versao-2-a-partir-da-replica.md)); continua em `src/tracks/`, byte a byte igual. As demais importações ficam como estão: de `./trainingSession`, `initialTrainingSession`, `selectTrainingTrack`, `getTrainingTrackOptions`, `startTrainingLap`, `trainingIdleKart`, `OPENING_TRACK_ID`, `TRAINING_TRACKS`, e de `./lapMessages` `creditFor` e `optionLabel` |
| `:563` `idleKart`, em `frame` | existente, sem mudança na revisão 3: `const idleKart = trainingIdleKart(training)`; sem sessão pronta, o kart não é exibido |
| `:156` `TRACK_SOURCES` | revisão 3: `{'kart-park': kartParkV1Text, ...}` passa a `{'kart-park': kartParkV2Text, synthetic: SYNTHETIC_TRACK_FILE}`. Existente e sem mudança: `training = initialTrainingSession()` (`:157`) e `chooseTrack(OPENING_TRACK_ID)` na carga do módulo (`:670`), sem ler escolha anterior |
| `:225-251` `chooseTrack(trackId)` | existente (entregue na revisão 1): `r = selectTrainingTrack(training, lap, trackId, TRACK_SOURCES)`; guarda `r.session` e `r.lap`; zera o estado do retorno da zebra ([DES-0009](DES-0009-retorno-da-zebra-vibracao-e-som.md)); troca a cena ([DES-0008](DES-0008-desenho-da-kart-park-na-tela-de-corrida.md)); ligada ao `onclick` de cada botão de `#track-selector` (`:265`); os avisos `console.warn('track-data', ...)` de `UNREADABLE`, `UNSUPPORTED_SCHEMA` e `INCOMPLETE` em `:230-232`. Revisão 3, única mudança: com `TRACK_VERSION_MISMATCH`, um aviso a mais ao lado desses, `console.warn('track-data', 'TRACK_VERSION_MISMATCH', reading.trackId, reading.trackVersion)` (identificadores do arquivo lido, nunca o conteúdo), e o caminho de `FAILED` que já existe (sem cena, sem kart, `#track-status` com `trackDataError`) |
| `:253-286` `renderOffer` | existente, sem mudança na revisão 3: a guarda de redesenho é a chave com `lang`, `sessionState`, `selectedTrackId` e `trackDataStatus` (`:255-257`); desenha o seletor e o crédito a partir de `getTrainingTrackOptions(training)` (`:258-268`); `#track-status` mostra `loadingTrack` com `NO_SESSION`/`LOADING` (`:272`), `trackDataError` com `FAILED` (`:273-276`), o que cobre `TRACK_VERSION_MISMATCH` porque a sessão fica `FAILED` (textos de `race-lap-validation`, sem chave nova), e o `trackId` com `READY` (`:277`); a oferta de volta é `offeredLapKinds(reading, [])` (`:279-285`), que numa sessão de treino é só `TRAINING`, e não aparece sem sessão `READY` |
| `:309-320` `beginLap` | existente, sem mudança na revisão 3: `startTrainingLap(training, lap, config, {setupId: setup.setupId, setupVersion: setup.setupVersion})` (`:310`); o tipo de volta não é argumento e a referência do acerto (FB-01 de `dirigibilidade`) passa pelo quarto argumento ([DES-0005](../core/DES-0005-sessao-de-treino-catalogo-e-selecao-de-pista.md) 1.2.0) |
| `:489-517` `renderResult` | existente, sem mudança na revisão 3: não chama `renderCredit` e `lap-result-credit` já não existe em `src/main.ts` nem em `index.html`; o resto é de `race-lap-validation` |
| desenho do painel do resultado da volta do treino (`renderTrainingResult`, `:462-488`, chamado por `renderHud`, `:425-459`, em `:458`) | existente, sem mudança na revisão 3: no ramo em que o painel é redesenhado — resultado novo (muda o `lapSequenceCount` do último resultado) ou idioma novo (`:466-467`) —, logo depois do desenho do painel, `renderCredit($('lap-training-result-credit'), creditFor(selectedOption(result.trackId)))` (`:485`); o redesenho troca os seus próprios elementos e mantém `#lap-training-result-credit`, o último filho do painel (`:481-484`). Com o painel oculto (sem resultado, treino encerrado ou sem volta, `:465`), o crédito fica oculto com ele |
| rótulo `.track-label` | existente, sem mudança na revisão 3: `#track-name` recebe `optionLabel` da opção selecionada a cada mudança de sessão, em `chooseTrack` (`:248-249`) |

Os textos do crédito vêm de `OSM_CREDIT` e o nome e "Pista sintética" do `displayName` das entradas do
catálogo, formatados por `optionLabel`; nenhum passa por `message()`/`resolveLanguage` (REQ-FEAT-0006-11). Os
demais textos continuam as chaves de `MESSAGES` de `src/lapMessages.ts`, inalteradas. A navegação continua a de
`race-lap-validation`: o seletor é alcançado na abertura e depois de "encerrar treino" (`#lap-end-training`,
`emitEndTraining` de DES-0007 1.1.0 daquela feature, que mostra `#welcome`), sem treino em andamento; o fim de
uma volta do treino não sai da tela de corrida.

O link do crédito no painel fica acionável durante o treino. Acioná-lo abre o destino em outra aba
([ADR-0006](../adr/ADR-0006-lacunas-do-f-spec-resolvidas-no-projeto.md)); a perda de foco da aba pausa o treino pela
regra de `race-lap-validation` (`pauseLap` com `FOCUS_LOST`), e nada do resultado, da sessão ou da pista muda nem é
gravado.

`src/style.css`: `.track-selector` (linha flexível de dois botões, com o estado `aria-pressed="true"`
destacado pela cor de `.primary`) e `.track-credit a` (cor `#d5ef91` sobre `--lap-chip-bg`, sublinhado). O
crédito usa a classe `lap-chip`, que já tem o tamanho mínimo de 16 px e o contraste verificados pelo teste de
HUD de `race-lap-validation`.

## Colaboradores

`src/main.ts` chama `src/trainingSession.ts`, `offeredLapKinds`, `getLapResult` (`src/lap.ts`), `message`,
`formatLapTime`, `creditFor`, `optionLabel` (`src/lapMessages.ts`) e o DOM; é chamado pelos manipuladores de
clique e pelo laço de quadros. `creditFor` e `optionLabel` não chamam nada: recebem a entrada do catálogo que
`src/main.ts` lhes passa e são chamados por `src/main.ts` e pelos testes.

## Estado e concorrência

Estado local: `training` (sessão) e `lap` (volta), substituídos só pelos valores que `selectTrainingTrack` e os
comandos da volta devolvem. Clicar duas vezes na mesma opção pronta não tem efeito (idempotência de
API-0002); clicar em outra durante um treino não acontece pelas telas (o seletor fica em `#welcome`, oculto
durante o treino) e, por qualquer outro caminho, o treino é descartado pela sessão, sem resultado para a volta em
andamento. O crédito do painel é redesenhado só quando o painel é: o mesmo resultado lido de novo não o refaz. Nada é gravado: nenhum
`localStorage`, `sessionStorage`, IndexedDB nem cookie (REQ-FEAT-0001-03).

## Comportamento em falha

Dado da pista escolhida ilegível, de esquema desconhecido ou de outra pista ou versão que a da entrada do
catálogo (`TRACK_VERSION_MISMATCH`): `#track-status` com `trackDataError`, nenhuma
oferta de volta, as duas opções habilitadas, o crédito visível se a opção selecionada tem `osmCredit` (vem do
catálogo). Sem rede: idêntico ao online, porque o arquivo vem no pacote do jogo e o crédito é texto local; o
destino do link pode não abrir. Sensor ausente ou negado em `web-mobile`: o aviso
`controlFallbackTouch` existente (`src/main.ts:639-642`); seletor, sessão e largada não mudam. Registro: só os
identificadores de `console.warn('track-data', ...)`.

## Observabilidade

`tests/pista-kart-park-screens.test.ts` importa `src/lapMessages.ts` e o catálogo de
`src/trainingSession.ts` e afirma: `creditFor` da entrada `kart-park` é `OSM_CREDIT`, com `text`
`© colaboradores do OpenStreetMap`, `license` `licença ODbL` e `url` `https://openstreetmap.org/copyright`;
`creditFor` da entrada `synthetic` e de entrada ausente é `undefined`; `optionLabel` da entrada `kart-park` é
exatamente `Kart Park — São José dos Pinhais (réplica não oficial) · 691 m` e o da entrada `synthetic` é
`Pista sintética`; nenhuma das duas funções recebe idioma, e nenhum desses textos é valor de `MESSAGES`. O mesmo
teste lê `index.html` e `src/main.ts` como texto e afirma: `#track-selector` e `#track-credit` em `#welcome`,
`#lap-training-result-credit` dentro de `#lap-training-result`, `#track-name`, e nenhum `lap-result-credit`;
`renderCredit` chamado com `creditFor(...)` nos dois pontos (`#track-credit` e `#lap-training-result-credit`); nenhum uso de `innerHTML` para o crédito; nenhum texto "41,45",
"41.45", "Circuito Aurora", "traçado aproximado" nem "687 m" (em `index.html`, `src/main.ts`,
`src/lapMessages.ts` e `src/trainingSession.ts`); `src/main.ts` importa `./tracks/kart-park-v2.json?raw` e não
cita `kart-park-v1`; `startLap(` não é chamado diretamente (só `startTrainingLap`). A apresentação
real é provada no roteiro E2E-01 a E2E-03, E2E-05, E2E-07
e E2E-08 ([test-strategy](../test-strategy.md)).

## Determinismo (D-DS-07)

Não é código de simulação. O tempo de parede continua decidindo só quantos passos rodam num quadro
(`advanceClock`).

## Feature flag

Nenhuma: o seletor e o crédito são fixos (FEAT-0001 e FEAT-0006, Configuração: nenhuma); a pista da abertura
não é configurável ([ADR-0005](../adr/ADR-0005-kart-park-sem-chave-e-producao-bloqueada.md)).

## Pontos em aberto

Nenhum.
