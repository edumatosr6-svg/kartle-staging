---
id: DES-0010
title: Preparo offline do arquivo de pista da Kart Park versão 2 a partir da réplica
feature: pista-kart-park
stage: dspec
status: validated
version: 2.0.0
sources: [FLOW-0003, RULE-0002, RULE-0005, FEAT-0002, FEAT-0003, FEAT-0004, FEAT-0005, REQ-FEAT-0002-01, REQ-FEAT-0002-02, REQ-FEAT-0002-04, REQ-FEAT-0002-05, REQ-FEAT-0002-06, REQ-FEAT-0002-07, REQ-FEAT-0002-08, REQ-FEAT-0002-09, REQ-FEAT-0002-10, REQ-FEAT-0002-11, REQ-FEAT-0002-14, REQ-FEAT-0002-18, REQ-FEAT-0002-19, REQ-FEAT-0002-20, REQ-FEAT-0002-21, REQ-FEAT-0003-01, REQ-FEAT-0003-02, REQ-FEAT-0003-03, REQ-FEAT-0003-04, REQ-FEAT-0003-05, REQ-FEAT-0003-06, REQ-FEAT-0003-07, REQ-FEAT-0003-16, REQ-FEAT-0004-01, REQ-FEAT-0004-02, REQ-FEAT-0004-03, REQ-FEAT-0005-01, REQ-FEAT-0005-02, REQ-FEAT-0005-03, REQ-FEAT-0005-20, REQ-FEAT-0006-09]
---

# DES-0010 — Preparo offline do arquivo de pista da Kart Park versão 2 a partir da réplica

## Realiza

Os passos 1 a 8 de FLOW-0003 (revisão 3 do seed): do arquivo da réplica não oficial ao arquivo de pista
gerado em esquema 3, com `trackId` `kart-park`, `trackVersion` 2 e `schemaVersion` 3 (REQ-FEAT-0002-01, -02),
publicado como arquivo novo ao lado do da versão 1 (REQ-FEAT-0002-18, -20); a linha central da réplica nos
eixos do jogo com a mesma origem, `xM` = *x* e `zM` = −*y*, sem nova suavização nem reamostragem, a no máximo
0,10 m dela em todo ponto e com o ponto 0 no ponto 0 dela (REQ-FEAT-0002-07, -10, -19); volta fechada sem
repetir o ponto 0, no sentido anti-horário, com 690,7 m ± 1 % (REQ-FEAT-0002-04, -05, -08); `widthM` 7,0 em todo
ponto e bordas sem cruzamento (REQ-FEAT-0002-09, -11); a largada no segmento do ponto 0 ao ponto 1
(REQ-FEAT-0002-06); chegada, 3 limites de setor perto de 204,9 / 354,9 / 534,7 m, cada um dentro de um elemento
reta da réplica, e marcadores a no máximo 25 m, como linhas transversais estendidas até `cutDistanceM` além da
borda da pista ou até a barreira ou outra parte da pista, sem limites de corte declarados (REQ-FEAT-0003-01 a
-07, -16); as 22 zebras da réplica, uma a uma, com o lado e as distâncias de volta dela, nenhuma cruzando a
largada, cada uma com largura maior que 0 para fora da borda (REQ-FEAT-0005-01, -02, -03, -20); a barreira
entre os trechos ≈ 369–406 m e ≈ 595–624 m, na grama (REQ-FEAT-0004-01 a -03); arquivo abaixo de 200.000 bytes e
sem recorde (REQ-FEAT-0002-14, REQ-FEAT-0006-09). O preparo fica fora do cliente (I10): o jogo não suaviza, não
converte e não edita pista.

## Posicionamento

- `scripts/trackPrep.ts`, biblioteca pura do preparo; camada **dado de pista** (lugar na árvore: `scripts/`),
  alterado: ganha a leitura da réplica e o preparo da versão 2 (`readReplicaTrack`, `prepareReplicaTrack`). O
  preparo da versão 1 (`readOriginTrack`, `prepareTrack`, com a suavização de [ADR-0006](../adr/ADR-0006-lacunas-do-f-spec-resolvidas-no-projeto.md))
  fica no módulo **sem mudança**, congelado: o programa nunca o executa para gerar arquivo (o par `kart-park` 1
  está registrado), e ele só sustenta a prova de reprodução do arquivo da versão 1 (Determinismo, abaixo).
  Motivo de não ser módulo novo: as duas leituras são do mesmo formato `kartle-pista` versão 1 e os passos da
  barreira, das linhas transversais e da largada são os mesmos, com outros números.
- `scripts/track-pipeline.ts`, programa em Node; camada **aplicação** (programa offline; lugar na árvore:
  `scripts/`), alterado: a origem passa a ser escolhida pelo par (`trackId`, `trackVersion`), não só pelo
  `trackId` (tabela `TRACK_ORIGINS`, abaixo).
- `tracks/sources/kart-park-replica.json`, **novo**: o arquivo da réplica entregue pelo dono do produto,
  copiado byte a byte pelo Curador do catálogo de `200 Requirements/220 Input/pista-kart-park/replica/kart-park-replica.json`;
  34.373 bytes, SHA-256 `eba665b6c700fe7a05cd89862ef74d93ce307e613393e34cf78b9c69b2caa24e`. O preparo recusa uma
  réplica com outro resumo, sem alterá-la. A regra `tracks/sources/*.json -text` de `.gitattributes`
  (`.gitattributes:5`) já o cobre: o Git não converte fim de linha num arquivo cujo resumo é registrado, e nenhuma
  regra nova é necessária.
- `tracks/sources/kart-park.json` (origem da versão 1) e `src/tracks/kart-park-v1.json`: **inalterados**, byte a
  byte (REQ-FEAT-0002-20, -21).
- `src/tracks/kart-park-v2.json`, **novo**: o arquivo publicado da versão 2, escrito pelo programa; coberto por
  `src/tracks/*.json -text` (`.gitattributes:6`).

Decisões: [ADR-0002](../adr/ADR-0002-preparo-offline-em-typescript-e-arquivo-empacotado.md) (linguagem e
empacotamento, sem mudança), [ADR-0008](../adr/ADR-0008-kart-park-versao-2-a-partir-da-replica.md) (versão 2 a
partir da réplica, ao lado da versão 1).

## Interface

`scripts/trackPrep.ts`, acrescido (o preparo da versão 1 não muda):

| Símbolo | Assinatura | Descrição |
|---|---|---|
| `ReplicaElement` | `{kind: 'STRAIGHT' \| 'LEFT_ARC' \| 'RIGHT_ARC'; fromM: number; lengthM: number}` (m) | um elemento da réplica: `tipo` `reta` → `STRAIGHT`, `esquerda` → `LEFT_ARC`, `direita` → `RIGHT_ARC`; `de_m`, `comprimento_m` |
| `ReplicaTrack` | `{points: {x: number; y: number; widthM: number}[]; curbs: {side: CurbSide; fromM: number; toM: number}[]; elements: ReplicaElement[]}` (m) | a réplica lida: `pontos` `[x, y, largura]` (x leste, y norte, metros, origem na linha de largada, no sentido de corrida), `zebras` `{lado, de_m, ate_m}` e `elementos` `{tipo, de_m, comprimento_m}` |
| `readReplicaTrack(json)` | `(unknown) => ReplicaTrack \| {error: string}` | exige `formato` `kartle-pista`, `versao` 1, `sentido` `anti-horario`, `largada.indice` 0; `pontos` com 3 ou mais itens de 3 números finitos e largura positiva; `zebras` com `lado` `esquerda` ou `direita` e `de_m < ate_m`, finitos; `elementos` com 1 ou mais itens de `tipo` conhecido, `de_m` finito e `comprimento_m` finito e positivo. Não lê nem copia `id`, `nome`, `cidade`, `tipo`, `comprimento_m`, `comprimento_oficial_m`, `largura_media_m`, `origem` (latitude e longitude), `largada.rumo_graus`, `pontos_formato`, `transicao_m` nem `fontes` |
| `prepareReplicaTrack(replica, options)` | `(ReplicaTrack, {trackId: string; trackVersion: number}) => {file: Schema3File; prep: ReplicaPrepRecord} \| {error: string}` | os passos abaixo; `ReplicaPrepRecord` é o objeto `prep` da entrada da versão 2 no registro ([DM-0002](../data/DM-0002-registro-de-publicacao-e-estado-em-memoria.md)) |
| `serializeTrackFile(file)` | `(Schema3File) => string` | sem mudança: a serialização determinística de [DM-0001](../data/DM-0001-arquivo-de-pista-versao-de-esquema-3.md) |

Constantes da versão 2 (prefixo `REPLICA_`, para não se confundirem com as da versão 1, que ficam):
`REPLICA_LAP_LENGTH_M` 690,7 e `REPLICA_LAP_TOLERANCE` 0,01 (a faixa de 683,793 m a 697,607 m);
`REPLICA_WIDTH_M` 7,0; `REPLICA_MAX_OFFSET_M` 0,10; `REPLICA_SECTOR_TARGETS_M` [204,9; 354,9; 534,7];
`REPLICA_NEAR_SECTIONS_M` [[368,5; 406,5]; [594,5; 624,5]] (os trechos ≈ 369–406 m e ≈ 595–624 m lidos com meio
metro de cada lado, RULE-0002 "Trecho aproximado"); `BARRIER_TRACK_CLEARANCE_M` 0,2
(`2 * BARRIER_HALF_WIDTH_M`). Reusadas sem mudança: `MARKER_TARGET_SPACING_M` 18, `MIN_LINE_SPACING_M` 2,
`LINE_MARCH_STEP_M` 0,05, `CUT_DISTANCE_M` 3, `LINE_END_TARGET_M` 2,99, `LINE_MARCH_MAX_M` 60,
`BARRIER_GAP_MAX_M` 6, `EDGE_SAMPLE_M` 0,25, `GAP_MARCH_STEP_M` 0,01, `BARRIER_SEQUENCE_GAP_M` 1,
`CURB_WIDTH_M` 1,0, `CURB_MIN_WIDTH_M` 0,3, `CURB_MIN_GRASS_M` 0,4, `OTHER_PART_LAP_M` 30; arredondamento a 0,001.

Passos de `prepareReplicaTrack`, em ordem; cada recusa nomeia o índice ou o trecho, nunca o conteúdo:

1. **Conversão sem suavização** (RULE-0002, eixos; ADR-0008): `P_i = (round3(x_i), round3(−y_i))` para cada ponto
   `i` da réplica, na ordem, **todos os pontos e só eles**: sem deslocamento de origem, sem suavizar, sem
   reamostrar. A `centerline` começa no ponto 0 da réplica, a linha de largada dela. O maior afastamento do
   arredondamento, `max |P_i − (x_i, −y_i)|`, fica em `prep.maxReplicaOffsetM` (no máximo cerca de 0,0007 m);
   o preparo recusa se passar de `REPLICA_MAX_OFFSET_M` ou se dois pontos consecutivos ficarem iguais. Por
   construção, V01 e V07 passam com folga; são verificadas, não presumidas.
2. **Comprimento**: `lapLengthM` medido sobre as coordenadas gravadas (soma dos segmentos, inclusive do último
   ponto ao ponto 0); fora de 683,793 m a 697,607 m o preparo falha nomeando o comprimento, sem escrever. Fica
   em `prep.lapLengthM`. O rótulo do catálogo é `displayLengthM` 691, fixado pelo F-Spec e independente desse
   valor ([DES-0005](../core/DES-0005-sessao-de-treino-catalogo-e-selecao-de-pista.md)).
3. **Larguras**: `widthM_i = round3(largura_i)`; o preparo recusa, nomeando o índice, se algum valor não é
   `REPLICA_WIDTH_M` (7,0).
4. **Zebras**: uma por zebra da réplica, na ordem dela, com `side` do `lado`, `fromLapM = round3(de_m)` e
   `toLapM = round3(ate_m)`, lidos diretamente na `centerline` a partir do ponto 0 (a régua da réplica,
   RULE-0002); nenhuma divisão e nenhum índice fracionário. O preparo recusa, nomeando o trecho, se algum não
   tem `0 <= fromLapM < toLapM <= lapLengthM` (V20 por construção). Largura: `CURB_WIDTH_M`, reduzida, por
   trecho, até deixar `CURB_MIN_GRASS_M` de grama entre a borda externa do trecho e o asfalto ou a zebra
   (largura nominal) de outra parte da volta (a mais de `OTHER_PART_LAP_M` de distância de volta); abaixo de
   `CURB_MIN_WIDTH_M` o preparo falha nomeando o trecho. Cada redução entra em `prep.reducedCurbs`. É a regra
   de largura da versão 1 (ADR-0006), sem mudança.
5. **Barreira**: o algoritmo da versão 1 (pares de amostras das duas bordas a cada `EDGE_SAMPLE_M`, borda
   voltada para o outro trecho pela amostra mais próxima, par descartado acima de `BARRIER_GAP_MAX_M`,
   travessia de `pq` em passos de `GAP_MARCH_STEP_M` com a superfície de `classifySurface`, vértice no meio da
   parte de grama, ordenação pela distância de volta do ponto mais próximo da linha central no primeiro
   trecho, sequências cortadas em saltos maiores que `BARRIER_SEQUENCE_GAP_M`), aplicado aos pontos da
   `centerline` com `d` dentro de cada trecho de `REPLICA_NEAR_SECTIONS_M`. A distância de volta é `d` da
   própria `centerline`; não há mais `d_o` de uma linha original. Uma guarda nova, depois de montadas as
   poligonais: cada barreira, amostrada a cada 0,05 m nos vértices e nos segmentos, tem `beyondTrackEdgeM`
   de ao menos `BARRIER_TRACK_CLEARANCE_M`; senão o preparo falha nomeando o vértice. Com ela, a superfície de
   contato (0,1 m de cada lado, [ADR-0003](../adr/ADR-0003-colisao-com-a-barreira.md)) e os pneus desenhados de
   raio 0,1 m ([DES-0008](../web/DES-0008-desenho-da-kart-park-na-tela-de-corrida.md)) ficam na grama
   (REQ-FEAT-0004-03; REQ-FEAT-0008-15). V13 a V15 continuam verificadas, não presumidas.
6. **Largada e chegada**: `finishLine` é a linha transversal no ponto 0; `startPosition` é o meio do segmento
   do ponto 0 ao ponto 1, com `headingDeg = atan2(dx, dz) * 180 / π` desse segmento.
7. **Limites de setor**: para cada `D_k` de `REPLICA_SECTOR_TARGETS_M`, o ponto `i` que minimiza
   `|d(i) − D_k|` (empate, o menor `i`); a linha transversal nele. O preparo recusa, nomeando `D_k`, se `d(i)`
   não está dentro de um elemento `STRAIGHT` da réplica (`fromM <= d(i) <= fromM + lengthM`): V19 por
   construção.
8. **Marcadores**: a regra da versão 1, sobre `d`: `n = ceil(lapLengthM / 18)`, `s = lapLengthM / n`; o
   marcador `k` no ponto cujo `d(i)` é o mais próximo de `s / 2 + k * s`, afastado para o ponto mais próximo a
   2 m ou mais do ponto 0 e dos pontos de limite de setor (empate, o seguinte). Com pontos a cerca de 1 m,
   consecutivos ficam a no máximo cerca de 21 m (V10, 25 m) e a pelo menos 2 m (C7 v3).
9. **Linha transversal no ponto `i`**: a regra da versão 1 (DM-0001; RULE-0002), sem mudança: reta por `P_i` na
   direção `n_i`, de cada lado a partir da borda da pista, marcha de `LINE_MARCH_STEP_M` parando no último
   ponto na grama antes de outra parte da pista, no cruzamento com uma barreira, ou, por bissecção, no último
   ponto com `beyondTrackEdgeM` abaixo de `LINE_END_TARGET_M`; `from` à esquerda e `to` à direita no sentido
   de corrida (`crossLine` `FORWARD`).
10. **Identidade**: `schemaVersion` 3, `trackId`, `trackVersion` (2), `osmDerived` `true`, `direction`
    `COUNTER_CLOCKWISE` (o preparo falha se a área com sinal no plano (x, −z) não é positiva); sem
    `cutDistanceM`, `cutDurationMs`, nome, comprimento oficial ou recorde.

Medições de viabilidade sobre a cópia da réplica, feitas para este projeto com um script descartável fora do
repositório (só agregados): 691 pontos com segmentos de 0,949 m a 1,012 m; ponto 0 em (0, 0); comprimento da
poligonal convertida 690,674 m (dentro da faixa); todas as larguras 7; zebras de 37,3 m a 645 m, nenhuma com
`ate_m <= de_m`; área com sinal positiva no plano (x, −z); os pontos de `D_k` são os índices 205, 355 e 535,
com `d` 204,898 m, 354,853 m e 534,717 m, cada um dentro de um elemento `reta`. Os valores que valem são os que o
preparo grava e as verificações de [DES-0011](DES-0011-verificacoes-registro-de-publicacao-e-promocao.md) julgam.

`scripts/track-pipeline.ts`:

| Símbolo | Conteúdo |
|---|---|
| `TRACK_ORIGINS` | tabela congelada por (`trackId`, `trackVersion`): `kart-park` 1 → `{file: 'tracks/sources/kart-park.json', sha256: '52c5adda…5302', method: 'SMOOTHED_ORIGIN', frozen: true}`; `kart-park` 2 → `{file: 'tracks/sources/kart-park-replica.json', sha256: 'eba665b6…a24e', method: 'REPLICA'}`. Substitui `ORIGIN_SHA256` (`scripts/track-pipeline.ts:24-26`) e o caminho `tracks/sources/<trackId>.json` (`:61`) |

Comandos (`npm run track -- <comando> <trackId> <trackVersion>`):

| Comando | Efeito | Saída |
|---|---|---|
| `prepare kart-park 2` | confere o resumo da réplica; `readReplicaTrack`; `prepareReplicaTrack`; escreve `src/tracks/kart-park-v2.json` (temporário e renomeação); recusa se o par já está no registro | `PREPARED`, o caminho, o comprimento medido, o maior afastamento e as larguras reduzidas; código 0, ou 1 com a mensagem |
| `prepare`, `verify` ou `publish` com `kart-park 1` | recusados antes de ler qualquer arquivo: a versão 1 está publicada e congelada (`frozen`); a sua garantia é o resumo registrado ([DES-0011](DES-0011-verificacoes-registro-de-publicacao-e-promocao.md)) | `recusado: kart-park 1 é versão publicada e congelada`; código 1 |
| `verify`, `publish`, `promote` | [DES-0011](DES-0011-verificacoes-registro-de-publicacao-e-promocao.md) | |

Argumentos, validados todos antes de ler o conteúdo de qualquer arquivo ou de escrever qualquer arquivo; um
valor fora da regra encerra com código 1 e `argumento inválido: <nome do argumento>`, sem reproduzir o valor:

| Argumento | Tipo e regra |
|---|---|
| `<comando>` | um de `prepare`, `verify`, `publish`, `promote` |
| `<trackId>` | cadeia de 1 a 40 caracteres em `[a-z0-9-]`, igual ao `trackId` de uma entrada de `TRAINING_TRACKS` ([DES-0005](../core/DES-0005-sessao-de-treino-catalogo-e-selecao-de-pista.md)) |
| `<trackVersion>` | cadeia de 1 a 6 dígitos decimais, sem sinal, sem zero à esquerda; inteiro de 1 a 999999; o par (`<trackId>`, `<trackVersion>`) tem de estar em `TRACK_ORIGINS` e o arquivo de origem dele tem de existir (a única consulta ao disco da validação). Hoje: `kart-park` 1 e `kart-park` 2. O caminho da origem, o caminho escrito `src/tracks/<trackId>-v<trackVersion>.json` e a chave do registro são montados só depois desta validação |
| `--esri-decision <referência>` | sem mudança: aceito só com `promote`, obrigatório nele e no máximo uma vez; 1 a 200 caracteres sem caractere de controle depois de retirados os espaços das pontas |
| qualquer outro argumento ou opção | recusado |

## Colaboradores

`scripts/trackPrep.ts` chama `buildTrackGeometry`, `classifySurface`, `beyondTrackEdgeM`, `positionAtLapM`,
`lapMAtIndex`, `nearestOnCenterline`, `closestOnSegment`, `windingSumOf` (`src/trackGeometry.ts`) e
`serializeTrackFile`. `scripts/track-pipeline.ts` chama a biblioteca, lê `TRAINING_TRACKS`
(`src/trainingSession.ts`) para validar `<trackId>`, e chama `node:fs`, `node:path` e `node:crypto`. Chamados
pelo Curador do catálogo (o programa) e por `npm test` (a biblioteca).

## Estado e concorrência

Sem estado: `prepareReplicaTrack` é função pura da réplica e das opções. Executar `prepare kart-park 2` duas
vezes com a mesma réplica escreve o mesmo arquivo, byte a byte. Um `prepare` de um par já registrado é
recusado, sem escrever: uma versão publicada nunca é regenerada no lugar (I3). O arquivo da versão 1 e a sua
origem nunca são abertos para escrita: nenhum comando escreve fora de `src/tracks/kart-park-v2.json` e
`tracks/registry.json`.

## Comportamento em falha

Argumento fora da tabela, ou o par `kart-park` 1 com `prepare`, `verify` ou `publish`: código de saída 1, nada
lido nem escrito. Réplica ausente, com outro resumo, de formato desconhecido ou fora das restrições: erro
nomeado, nada escrito. Comprimento fora da faixa, largura diferente de 7,0, zebra fora de `[0, lapLengthM]`,
zebra que não cabe, barreira sem grama suficiente ou perto demais da pista, limite de setor fora de uma reta,
sentido horário: erro nomeado, nada escrito. Falha no meio da escrita: o temporário fica para trás e nenhum
arquivo publicado é tocado. Sem rede, sem tempo-limite; nova tentativa é executar de novo. A saída lista só
identificadores, contagens e medidas, nunca o conteúdo do arquivo.

## Determinismo (D-DS-07)

Aritmética em ordem fixa, sem relógio nem sorteio. Provas em `tests/pista-kart-park-publication.test.ts`, onde
está hoje a prova de reprodução da versão 1 (CHK-TEST-0012-03, `:70`):
`prepareReplicaTrack` sobre `tracks/sources/kart-park-replica.json` com `trackVersion` 2 seguido de
`serializeTrackFile` dá exatamente os bytes de `src/tracks/kart-park-v2.json` (o arquivo publicado é
reproduzível) e duas execuções dão o mesmo texto; `readReplicaTrack` recusa uma cópia com `formato` trocado,
uma com zebra de `lado` desconhecido e uma com elemento de `tipo` desconhecido; `prepareReplicaTrack` recusa uma
cópia com uma largura 6,9 e uma com a zebra 0 começando depois do fim da volta. A prova da versão 1 continua
como está: `prepareTrack` sobre `tracks/sources/kart-park.json` com `trackVersion` 1 dá exatamente os bytes de
`src/tracks/kart-park-v1.json`, uma segunda testemunha, além do resumo registrado, de que o arquivo da versão 1
não mudou (REQ-FEAT-0002-20, -21).

## Feature flag

Nenhuma: programa offline executado pelo Curador; não roda no cliente.

## Pontos em aberto

Nenhum.
