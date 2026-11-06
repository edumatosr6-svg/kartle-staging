---
title: Arquitetura — pista Kart Park
feature: pista-kart-park
stage: dspec
status: validated
version: 2.0.0
sources: []
---

# Arquitetura

Este conjunto projeta como cada `REQ-*` do F-Spec validado de `pista-kart-park` (FEAT-0001 a FEAT-0008,
API-0001 a API-0003, FLOW-0001 a FLOW-0003, SCR-0001 a SCR-0003, RULE-0001 a RULE-0006; seed `revision: 3`,
validação `fspec-validation-20261106-1805`, SUCCESS; commit `281b617`) é realizado sobre o código em execução. A
revisão 3 troca o traçado da Kart Park pela réplica não oficial, publicada como `kart-park` `trackVersion` 2 ao
lado do arquivo da versão 1, que fica igual e sai do seletor ([ADR-0008](adr/ADR-0008-kart-park-versao-2-a-partir-da-replica.md)). Os caminhos são relativos à raiz do repositório (diretriz do estágio: o código vive em
`src/`, `tests/`, `scripts/` e `index.html`; `400 Code/Source/` está vazio). O produto é um cliente de
navegador sem servidor, sem conta e sem banco: não existem as pastas `backend/` e `mobile/` deste estágio
(`web-mobile` roda o mesmo cliente). Os itens do dado de pista e da simulação ficam em `core/`, os da
aplicação em `web/`, o preparo offline e a publicação em `pipeline/`, as garantias de privacidade e de
licença em `security/`, os formatos em `data/` e as decisões em `adr/`.

**Estado do código lido como as-built.** A árvore do commit `281b617`, que carrega o código e os testes da
revisão 2 desta feature, validados (`code-validation-20261103-2004` e `test-validation-20261104-1432`, SUCCESS) e
em staging. As linhas citadas neste conjunto são as dessa árvore. O que a revisão 3 muda nela é pequeno no
cliente (o catálogo, a conferência de versão e o arquivo empacotado) e concentrado no preparo offline (a
réplica como origem, as verificações V01 a V20) e no dado publicado (o arquivo da versão 2 e a entrada dele no
registro); a física, a volta, a geometria, o leitor, o desenho e o retorno da zebra não mudam.

## Contexto primário (I1)

O contexto primário continua sendo o desafio diário, que ainda não existe e é de outra feature. Esta
feature só abre **sessões de treino**: toda volta é `TRAINING`, sem `challengeNumber`, e o `LapResult` é
chaveado em `trackId` + `trackVersion` exatamente como em `race-lap-validation`. A pista escolhida no seletor
é um atributo da sessão (`selectedTrackId`), nunca uma chave de resultado; nada é chaveado na data, no
relógio do aparelho ou no nome da pista, e nada é gravado no navegador
([DES-0005](core/DES-0005-sessao-de-treino-catalogo-e-selecao-de-pista.md),
[DES-0012](security/DES-0012-privacidade-rede-credito-e-licenca.md)). O tempo é contado em passos de
`STEP`, nunca em tempo de parede; o retorno da zebra também
([DES-0009](web/DES-0009-retorno-da-zebra-vibracao-e-som.md)).

## Posicionamento por camada (I2)

| Camada | Módulo | Situação | Conteúdo desta feature |
|---|---|---|---|
| Dado de pista | `src/track.ts` | inalterado | a pista sintética (`track`, `WIDTH`, `nearest`), as primitivas de linha (`Line`, `sideOf`, `crossLine`) e `SYNTHETIC_TRACK_FILE` (esquema 2) não mudam |
| Dado de pista | `src/trackData.ts` | alterado | leitor das versões de esquema 1, 2 e 3; campos `centerline`, `curbs`, `barriers`, `osmDerived`; verificações de consistência da versão 3 sobre a geometria do próprio arquivo ([DES-0001](core/DES-0001-leitura-do-dado-de-pista-em-esquema-3.md), [DM-0001](data/DM-0001-arquivo-de-pista-versao-de-esquema-3.md)) |
| Dado de pista | `src/trackGeometry.ts` | **novo** | geometria de um arquivo em esquema 3: normais, bordas, asfalto, zebras, borda da pista, distância de volta, barreiras, grade espacial ([DES-0002](core/DES-0002-geometria-da-pista-declarada-no-arquivo.md)) |
| Dado de pista (lugar na árvore: `src/tracks/`) | `src/tracks/kart-park-v1.json` | inalterado | o arquivo publicado da Kart Park `trackVersion` 1, byte a byte igual; deixa de ser importado e sai do pacote do jogo |
| Dado de pista (lugar na árvore: `src/tracks/`) | `src/tracks/kart-park-v2.json` | **novo** | o arquivo publicado da Kart Park `trackVersion` 2, a réplica, gerado offline e empacotado no cliente ([DM-0001](data/DM-0001-arquivo-de-pista-versao-de-esquema-3.md)) |
| Simulação | `src/physics.ts` | alterado | superfície `curb` com 85 % da aderência por pneu; zebra como pista nas demais regras; colisão com barreira; `trackEnvironment`; `trackEdgeDistanceM`; `getTrackContact` ([DES-0003](core/DES-0003-superficie-por-roda-zebra-e-barreira.md)) |
| Simulação | `src/lap.ts` | alterado | corte medido da borda da pista do ambiente da volta; reposicionamento na linha central do ambiente; `kartAtStart` ([DES-0004](core/DES-0004-volta-na-kart-park-corte-e-reposicionamento.md)) |
| Simulação | `src/trainingSession.ts` | alterado | catálogo do treino (entradas de API-0002: `trackId`, `trackVersion` opcional, `displayName`, `displayLengthM`, `osmCredit`), estado `sessionState`, `getTrainingTrackOptions`, `selectTrainingTrack` com a conferência de `trackId` e `trackVersion` e o código `TRACK_VERSION_MISMATCH`, `startTrainingLap` (API-0002, RULE-0003) ([DES-0005](core/DES-0005-sessao-de-treino-catalogo-e-selecao-de-pista.md)); nenhum texto de crédito nem regra de tela |
| Simulação | `src/lapTiming.ts` | inalterado | tempo inteiro em ms não muda |
| Simulação | `src/maneuvers.ts` | não usado por esta feature | o drift e o turbo saem do jogo (`dirigibilidade`, seed `revision: 5`, ADR-0006 daquela feature): o passo deixa de avançar a manobra e o módulo tem retirada projetada lá; nada desta feature depende dele (zebra, barreira e retorno da zebra não têm efeito de drift ou de turbo) |
| Adaptadores de controle | em `src/main.ts` | inalterados | teclado, inclinação e toque continuam entregando o `Input` normalizado; nenhum campo novo (NFR-0008) |
| Aplicação | `src/main.ts` | alterado | seletor, crédito, nome da pista, sessões, troca de cena, retorno da zebra; na revisão 3, só a importação do arquivo da versão 2 e o aviso de `TRACK_VERSION_MISMATCH` ([DES-0007](web/DES-0007-tela-inicial-seletor-credito-e-resultado.md), [DES-0008](web/DES-0008-desenho-da-kart-park-na-tela-de-corrida.md), [DES-0009](web/DES-0009-retorno-da-zebra-vibracao-e-som.md)) |
| Aplicação | `src/trackScene.ts` | **novo**; alterado na revisão 2 | constrói o grupo Three.js de uma pista em esquema 3 (grama em 2 tons, asfalto, faixa de borda, zebras com relevo, barreira de pneus, linha de largada) e a transformação do minimapa; o acabamento de FEAT-0008 é só desenho e não entra na simulação ([DES-0008](web/DES-0008-desenho-da-kart-park-na-tela-de-corrida.md)) |
| Aplicação | `src/curbFeedback.ts` | **novo** | decisão pura, por passo, de pulso de vibração e de repetição do som da zebra (RULE-0004) ([DES-0009](web/DES-0009-retorno-da-zebra-vibracao-e-som.md)) |
| Aplicação | `src/lapMessages.ts` | alterado | textos do crédito OSM (`OSM_CREDIT`), regra de tela do crédito (`creditFor`) e rótulo da opção (`optionLabel`), fora de `message()` e sem tradução; aplicação pura, testável em `npm test` ([DES-0007](web/DES-0007-tela-inicial-seletor-credito-e-resultado.md)) |
| Aplicação | `src/audio.ts` | alterado | som próprio da zebra e descritores de sinal dos três sons do jogo, dos quais cada som constrói o seu sinal ([DES-0009](web/DES-0009-retorno-da-zebra-vibracao-e-som.md)) |
| Aplicação | `index.html`, `src/style.css`, `src/rawImports.d.ts` (**novo**, só declaração de tipo) | alterados | seletor, linhas de crédito, nome da pista; importação do arquivo de pista como texto |
| Aplicação (programa offline em Node; lugar na árvore: `scripts/`) | `scripts/track-pipeline.ts` | alterado | comandos `prepare`, `verify`, `publish`, `promote` do preparo offline, com a origem escolhida por (`trackId`, `trackVersion`) e a versão 1 congelada ([DES-0010](pipeline/DES-0010-preparo-offline-do-arquivo-da-kart-park.md), [DES-0011](pipeline/DES-0011-verificacoes-registro-de-publicacao-e-promocao.md)) |
| Dado de pista (biblioteca pura do preparo; lugar na árvore: `scripts/`) | `scripts/trackPrep.ts`, `scripts/trackChecks.ts` | alterados | construção do arquivo da versão 2 a partir da réplica (o preparo da versão 1 fica, congelado) e verificações V01 a V20 de RULE-0002 2.0.0, usadas pelo programa e por `npm test` |
| Dado do preparo offline (fora do cliente, I2) | `tracks/sources/kart-park.json` (inalterado), `tracks/sources/kart-park-replica.json` (**novo**), `tracks/registry.json` (alterado) | | origem da versão 1 e réplica, copiadas byte a byte; registro de publicação com a entrada 2 acrescentada ([DM-0002](data/DM-0002-registro-de-publicacao-e-estado-em-memoria.md)) |
| Configuração do repositório | `.gitattributes` | inalterado | as regras `tracks/sources/*.json -text`, `src/tracks/*.json -text` e `tracks/registry.json -text` (`.gitattributes:5-7`) já cobrem os arquivos novos da revisão 3: todo arquivo de pista cujo SHA-256 é registrado fica fora da conversão de fim de linha, o que o teste de publicação afirma ([DES-0011](pipeline/DES-0011-verificacoes-registro-de-publicacao-e-promocao.md)) |

Por que módulos novos (I10):

- `src/trackGeometry.ts`: `src/track.ts` guarda **uma** pista constante e é importado por todo teste e
  bench existente; a geometria de um arquivo qualquer em esquema 3 (bordas por ponto, zebras, grade de
  busca) é outra responsabilidade, consultada a cada passo pela simulação e reusada pelo preparo offline.
  Colocá-la em `src/trackData.ts` faria o leitor (classificação de um arquivo) carregar consultas espaciais
  de tempo de passo.
- `src/trainingSession.ts`: a sessão de treino é um modelo de estados da simulação (RULE-0003) que contém a
  volta; `src/lap.ts` é a volta de `race-lap-validation`, cujo modelo não muda, e `src/main.ts` não carrega
  em `npm test` (importa Three.js e o DOM), onde a sessão precisa de prova.
- `src/trackScene.ts`: o desenho da pista em esquema 3 precisa de prova em `npm test` (AC-US-0002-08,
  AC-US-0004-06, AC-US-0005-03) e `src/main.ts` não carrega lá; o módulo importa `three`, que roda em Node
  sem WebGL para construir geometria. A cena da pista sintética continua em `src/main.ts`: dividir
  `src/main.ts` não faz parte desta feature.
- `src/curbFeedback.ts`: o registro dos pulsos e repetições pedidos por passo é a observação dos critérios
  da zebra (F-Spec, "Como a especificação é verificada"); precisa ser puro e testável sem DOM.
- `scripts/trackPrep.ts`, `scripts/trackChecks.ts`, `scripts/track-pipeline.ts`: o preparo offline não
  existe (diretrizes: "has no folder yet"). Bibliotecas puras separadas do programa, como
  `scripts/handlingBench.ts` e `scripts/keyboard-lap.ts` de `dirigibilidade`; as verificações ficam
  separadas da construção para que uma verificação não repita o código que ela julga
  ([ADR-0002](adr/ADR-0002-preparo-offline-em-typescript-e-arquivo-empacotado.md)).
- `tracks/`: dado do preparo offline que não é fonte do cliente nem documentação. Os arquivos publicados ficam
  em `src/tracks/` porque o empacotado no cliente mora ali; só o que o catálogo declara é importado.

A revisão 3 não acrescenta módulo: o catálogo e a conferência de versão cabem em `src/trainingSession.ts`, que
já é dono da transição `LOADING` → `READY`; o preparo da réplica cabe em `scripts/trackPrep.ts`, que já lê o
formato `kartle-pista` e já constrói barreira, linhas e largada; as verificações novas cabem em
`scripts/trackChecks.ts`.

Sentido das dependências (permitido): `trackGeometry.ts` importa só `src/track.ts` (tipos `Point`, `Line` e
`crossLine`); `trackData.ts` importa `track.ts` e `trackGeometry.ts`; `physics.ts` importa `track.ts` e
`trackGeometry.ts` (e, durante a janela de compatibilidade de `dirigibilidade`, `maneuvers.ts` só pelo valor
constante de `State.maneuvers`); `lap.ts` importa `physics.ts`, `track.ts`, `trackData.ts`,
`lapTiming.ts` e `trackGeometry.ts`; `trainingSession.ts` importa `trackData.ts`, `trackGeometry.ts`,
`physics.ts` e `lap.ts`; `curbFeedback.ts` não importa nada além de tipos de `physics.ts`; `lapMessages.ts`
continua importando só tipos de `lap.ts` (`creditFor` e `optionLabel` recebem a entrada do catálogo por tipo
estrutural); `trackScene.ts` importa `three` e tipos e constantes de `trackGeometry.ts`; `main.ts` importa tudo
isso. `scripts/trackPrep.ts` e `scripts/trackChecks.ts` importam só `src/track.ts`, `src/trackData.ts` e
`src/trackGeometry.ts`; `scripts/track-pipeline.ts` importa as duas bibliotecas, `TRAINING_TRACKS` de
`src/trainingSession.ts` (para validar o argumento `<trackId>`), `node:fs`, `node:path` e `node:crypto` e é o único
lugar do preparo que lê o relógio de parede (`new Date()` para `stagedAtUtc` e `promotedAtUtc`). Nenhum
módulo de dado de pista ou de simulação importa `three`, o DOM, `src/audio.ts` ou `src/main.ts`, nem lê
`Date`, `performance.now` ou `Math.random` ([DES-0006](core/DES-0006-invariantes-ensaios-e-ordem-de-entrega.md)).

## Fluxo alterado — abertura, escolha e troca de pista

```mermaid
sequenceDiagram
    participant J as Jogador
    participant M as main.ts (aplicacao)
    participant T as trainingSession.ts
    participant D as trackData.ts e trackGeometry.ts
    participant L as lap.ts
    M->>T: selectTrainingTrack(sessao, volta, kart-park, fontes) na carga do modulo
    T->>D: readTrackData(texto empacotado da versao 2), buildTrackGeometry
    T->>T: confere trackId kart-park e trackVersion 2 da entrada do catalogo
    alt arquivo de outra pista ou versao
        T-->>M: FAILED, TRACK_VERSION_MISMATCH, nenhuma sessao, volta ausente
        M-->>J: seletor com as duas opcoes e o erro do dado da pista
    else arquivo da versao 2
        T-->>M: READY, COMPLETE, trackVersion 2, sessao com ambiente e kart na largada, volta ausente
        M-->>J: seletor, Kart Park marcada, nome, 691 m, credito OSM, cena da Kart Park
    end
    J->>M: escolhe a pista sintetica
    M->>T: selectTrainingTrack(sessao, volta, synthetic, fontes)
    T-->>M: READY, sessao nova com CIRCUIT, volta descartada
    J->>M: treino
    M->>T: startTrainingLap(sessao, volta, acerto, referencia do acerto)
    T->>L: startLap TRAINING, trackId e trackVersion da sessao, setupId e setupVersion copiados, sem challengeNumber, ambiente da sessao
    L-->>M: COUNTDOWN, depois RUNNING
    loop cada cruzamento da chegada no sentido da pista
        L-->>M: listLapResults cresce um item, fase segue RUNNING, volta seguinte no mesmo instante
        M-->>J: painel do resultado da volta do treino e credito OSM nele se a pista tem osmCredit
    end
    J->>M: encerrar treino
    M->>L: endTraining
    L-->>M: ENDED, nenhum resultado para a volta em andamento
    M-->>J: tela inicial com o seletor, a sessao e a pista inalteradas
```

O treino de voltas seguidas é de `race-lap-validation` (F-Spec revalidado, FEAT-0010; projeto: ADR-0006, DM-0002
1.2.0, DES-0001 1.2.0, DES-0007 e DES-0008 1.1.0): esta feature o inicia pela sessão
([DES-0005](core/DES-0005-sessao-de-treino-catalogo-e-selecao-de-pista.md)), lê o fim de cada volta pelo
crescimento de `listLapResults` ([DES-0004](core/DES-0004-volta-na-kart-park-corte-e-reposicionamento.md)) e põe o
crédito no painel do resultado da volta do treino
([DES-0007](web/DES-0007-tela-inicial-seletor-credito-e-resultado.md),
[ADR-0007](adr/ADR-0007-credito-no-painel-do-resultado-da-volta-do-treino.md)).

## Fluxo alterado — passo na Kart Park e retorno da zebra

```mermaid
sequenceDiagram
    participant M as main.ts (aplicacao e adaptadores)
    participant L as lap.ts
    participant P as physics.ts
    participant G as trackGeometry.ts
    participant F as curbFeedback.ts
    loop cada passo de STEP em RUNNING
        M->>L: stepLap(volta, Input normalizado)
        L->>P: step(kart, Input, STEP, acerto, ambiente da Kart Park)
        P->>G: classifySurface por roda e por subpasso
        P->>G: segmentos de barreira, contato no trajeto do subpasso
        L->>P: trackEdgeDistanceM(ambiente, kart) para o corte
        L->>L: marcadores, setores e chegada como em race-lap-validation
        M->>P: getTrackContact(kart, ambiente, acerto)
        P-->>M: simStepCount, wheelSurfaces, curbWheelCount, wheelGripPc, beyondTrackEdgeM, barrierContact
        M->>F: decideCurbFeedback(estado, passo, rodas na zebra, canal, som)
        F-->>M: pulso, repeticao do som, estado novo
    end
    M-->>M: navigator.vibrate(20) em web-mobile, audio.curb() com o som ligado
```

## Fluxo alterado — preparo offline e publicação

```mermaid
sequenceDiagram
    participant C as Curador do catalogo
    participant X as track-pipeline.ts
    participant R as trackPrep.ts
    participant V as trackChecks.ts
    participant G as tracks/registry.json
    C->>X: prepare kart-park 2
    X->>R: tracks/sources/kart-park-replica.json, resumo conferido
    R-->>X: arquivo gerado sem suavizar, PREPARED
    X-->>C: src/tracks/kart-park-v2.json escrito, o da versao 1 intocado
    C->>X: verify kart-park 2
    X->>V: arquivo gerado e arquivo da replica
    V-->>X: V01 a V20, VERIFIED ou REJECTED
    C->>X: publish kart-park 2
    X->>G: trackId, trackVersion 2, sha256, STAGING, ao fim da lista
    G-->>X: registrado, ou ja registrado com o mesmo resumo
    C->>X: promote kart-park 2 com a referencia da decisao Esri
    X->>G: PRODUCTION so com a referencia
```

## Dependências externas

Nenhuma dependência nova de execução nem de desenvolvimento (REQ-FEAT-0007-11), também na revisão 3. O preparo offline usa só
módulos embutidos do Node (`node:fs`, `node:path`, `node:crypto`) e o `tsx` que o projeto já tem. O arquivo
de pista é empacotado no cliente pelo Vite (importação `?raw`), de modo que nenhuma requisição é feita entre
a escolha da pista e o fim da volta (REQ-FEAT-0007-05). O dado do OpenStreetMap e a réplica entram só pelos arquivos de
origem copiados para `tracks/sources/`, offline: sem rede, sem tempo-limite e sem nova tentativa; a chave de idempotência da publicação é
`trackId` + `trackVersion` + `sha256` ([DES-0011](pipeline/DES-0011-verificacoes-registro-de-publicacao-e-promocao.md),
D-DS-03). O link do crédito é navegação iniciada pelo Jogador, que o jogo nunca espera.

## Estratégia de compatibilidade

| Contrato | Tratamento |
|---|---|
| Arquivo de pista | revisão 3: nenhuma mudança de esquema; a Kart Park ganha o arquivo `trackVersion` 2 e o da versão 1 fica igual, fora do pacote ([ADR-0008](adr/ADR-0008-kart-park-versao-2-a-partir-da-replica.md)). Desde a revisão 1: versão de esquema 3 acrescentada; o leitor lê 1, 2 e 3; o arquivo da pista sintética continua em 2, sem mudança; versão maior que 3 é `UNSUPPORTED_SCHEMA`, intacta ([DM-0001](data/DM-0001-arquivo-de-pista-versao-de-esquema-3.md), [ADR-0001](adr/ADR-0001-esquema-3-do-arquivo-de-pista.md)) |
| `readTrackData`, `TrackReading` | mesma função e mesma forma plana; em esquema 3 a leitura traz também `centerline`, `curbs`, `barriers` e `osmDerived` |
| `checkConsistency` | inalterada (pista sintética, C1 a C7); a versão 3 usa `checkConsistencyV3` sobre a geometria do arquivo |
| `STEP`, `step(state, input, dt, config, environment)`, `Input` | inalterados; `Environment` ganha o campo opcional `track`; objetos `{surfaceAt, walls}` existentes continuam válidos |
| `Surface` | ganha o valor `curb`, que só aparece num ambiente com zebra; na pista sintética as superfícies continuam `asphalt` e `grass` e todo cálculo é idêntico bit a bit ([ADR-0004](adr/ADR-0004-zebra-como-superficie-na-fisica.md)) |
| `getHandlingTelemetry` (`dirigibilidade`) | inalterado: `surface` continua `ASPHALT` ou `GRASS` (o centro do kart sobre a zebra é pista, `ASPHALT`); `wallContact` não é usado pela barreira |
| `LapSession`, `LapResult`, `getLapState`, `listLapResults`, `endTraining` | de `race-lap-validation`, não alterados por esta feature; o ambiente da volta já é parâmetro de `startLap`. Pelo projeto revalidado daquela feature (ADR-0006, DM-0002 1.2.0), uma sessão `TRAINING` é um treino de voltas seguidas, com um resultado por volta concluída e `ENDED` só por `endTraining`; os itens e as provas desta feature leem o fim de cada volta pelo crescimento de `listLapResults` |
| `edgeDistanceM` (`src/lap.ts:218`) | inalterado e ainda exportado; o corte passa a usar `trackEdgeDistanceM`, que na pista sintética é a mesma expressão |
| Catálogo do treino (API-0002) | revisão 3: campo opcional `trackVersion` na entrada (ausente: a seleção não confere versão, como antes; 2 na Kart Park) e código novo `TRACK_VERSION_MISMATCH`, que só ocorre quando o arquivo lido não é o que a entrada declara; `displayName` e `displayLengthM` mantêm nome, unidade e significado, com os valores da réplica; nenhum código existente muda de significado ([DES-0005](core/DES-0005-sessao-de-treino-catalogo-e-selecao-de-pista.md)) |
| Registro de publicação | revisão 3: `registryVersion` continua 1; a entrada nova traz `prep.method` `REPLICA`, e ausente vale a forma da entrada da versão 1, que não é reescrita ([DM-0002](data/DM-0002-registro-de-publicacao-e-estado-em-memoria.md)) |
| Dado persistido do jogador | nenhum campo novo, nenhuma leitura ou gravação |
| Telas de `race-lap-validation` | acrescidas do seletor, das linhas de crédito e do nome da pista da sessão; textos existentes inalterados. A linha de crédito do resultado fica dentro do painel do resultado da volta do treino (`#lap-training-result-credit`), e `#lap-result-credit` sai de `#lap-result`, que só exibe volta oficial e de reconhecimento ([ADR-0007](adr/ADR-0007-credito-no-painel-do-resultado-da-volta-do-treino.md)) |

## Ordem de entrega

A dependência de entrega depois de `dirigibilidade` (REQ-FEAT-0007-12, NFR-0011) foi retirada na revisão 3 do
seed: ela já se cumpriu nas entregas da revisão 1 e da revisão 2, e a revisão 3 não toca nos arquivos que
`dirigibilidade` escreve. Os arquivos que a revisão 3 altera: `src/trainingSession.ts`, `src/main.ts` (a
importação e um aviso), `scripts/trackPrep.ts`, `scripts/trackChecks.ts`, `scripts/track-pipeline.ts`,
`tracks/registry.json`; os novos: `src/tracks/kart-park-v2.json`, `tracks/sources/kart-park-replica.json`; e, na
etapa de testes, os `tests/pista-kart-park-*.test.ts`, `tests/fixtures/kartParkFiles.ts`,
`tests/helpers/kartParkPilot.ts` e `docs/kart-park-device-log.md`. Nenhum arquivo de outra feature.

## Consequências para outras features

- `race-lap-validation`, etapa de testes: mudança já aplicada por aquela feature (commit `32d0adf`). Com o
  esquema 3 que o F-Spec exige (REQ-FEAT-0002-02, REQ-FEAT-0002-16 e API-0001), `src/trackData.ts:11`
  declara `TRACK_SCHEMA_VERSION = 3`, a pista sintética continua em 2 (REQ-FEAT-0002-15) e um arquivo
  sintético com `schemaVersion` 3 e sem `centerline` é `UNREADABLE`. As duas verificações daquela feature que
  afirmavam o literal 2 e usavam 3 como "versão posterior" já seguem só o requisito delas (NFR-0012 daquela
  feature: versão maior que a anterior, versão desconhecida intacta): CHK-TEST-0009-02
  (`tests/race-lap-validation-track-data.test.ts:18-30`) lê a versão anterior da fixture e a do leitor da
  exportação, e CHK-TEST-0009-03 (`:32-40`) deriva a posterior de `TRACK_SCHEMA_VERSION + 1`. Nenhum
  arquivo daquela feature é editado por este conjunto nem pelas etapas de código e de testes desta feature.
- `dirigibilidade`: nenhum campo de API-0001 daquela feature muda; os ensaios dela continuam na pista
  sintética e na pista de teste, cujos cálculos não mudam (ambiente sem `track`); o custo por passo na pista
  sintética não ganha chamada de `surfaceAt` (o bloco de barreira e o cálculo de toque só existem com
  `environment.track`), de modo que `STEP_COST` daquela feature não é afetado. Com a retirada do drift e do turbo
  (seed `revision: 5` daquela feature), as linhas que esta feature tinha acrescentado à manobra (a zebra como pista
  para o drift) e o cancelamento da manobra na barreira saem com a manobra, pela rodada de código de
  `dirigibilidade`; esta feature não tem mudança de código própria por isso, e o seu teste de camada deixa de
  nomear `src/maneuvers.ts` ([DES-0006](core/DES-0006-invariantes-ensaios-e-ordem-de-entrega.md)).
- `race-lap-validation`, treino de voltas seguidas (FB-01 daquela feature, rodada de 2026-10-30): já entregue; o
  crédito do resultado está no painel `#lap-training-result` e as provas desta feature leem o fim de cada volta
  pelo crescimento de `listLapResults`. A revisão 3 não muda nada disso.
- Revisão 3: nenhuma consequência para outra feature. O catálogo, a conferência de versão e o arquivo da versão 2
  são desta feature; nenhum teste ou bench de outra feature cita `kart-park` (DES-0006), e a pista sintética, a
  dos ensaios delas, não muda.

## Rastros de decisão

| ADR | Decisão |
|---|---|
| [ADR-0001](adr/ADR-0001-esquema-3-do-arquivo-de-pista.md) | esquema 3 com a geometria no arquivo; leitor das versões 1, 2 e 3; consistência da versão 3 sobre a geometria do próprio arquivo |
| [ADR-0002](adr/ADR-0002-preparo-offline-em-typescript-e-arquivo-empacotado.md) | preparo offline em TypeScript sob `scripts/`, verificações em `npm test`; arquivo publicado empacotado no cliente como texto |
| [ADR-0003](adr/ADR-0003-colisao-com-a-barreira.md) | barreira como poligonal com meia espessura de contato; mesma resposta do muro; contato também no trajeto do subpasso |
| [ADR-0004](adr/ADR-0004-zebra-como-superficie-na-fisica.md) | zebra como terceira superfície da física, 85 % da aderência por pneu, pista nas demais regras; caminho da pista sintética bit a bit inalterado |
| [ADR-0005](adr/ADR-0005-kart-park-sem-chave-e-producao-bloqueada.md) | nenhuma chave de configuração; produção com a Kart Park bloqueada na promoção até a decisão Esri |
| [ADR-0006](adr/ADR-0006-lacunas-do-f-spec-resolvidas-no-projeto.md) | largura da zebra, suavização e origem das coordenadas (estas duas só da versão 1), intervalo e timbre do som, aba do link e aparência |
| [ADR-0007](adr/ADR-0007-credito-no-painel-do-resultado-da-volta-do-treino.md) | crédito OSM do resultado no painel do resultado de cada volta do treino de `race-lap-validation`; `#lap-result-credit` retirado |
| [ADR-0008](adr/ADR-0008-kart-park-versao-2-a-partir-da-replica.md) | revisão 3: a réplica como `trackVersion` 2, com os pontos dela sem suavizar; arquivo novo ao lado da versão 1; conferência de versão no catálogo; versão 1 fora do pacote e o seu preparo congelado |
