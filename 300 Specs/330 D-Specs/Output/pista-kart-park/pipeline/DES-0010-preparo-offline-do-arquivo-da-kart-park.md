---
id: DES-0010
title: Preparo offline do arquivo de pista da Kart Park
feature: pista-kart-park
stage: dspec
status: validated
version: 1.1.0
sources: [FLOW-0003, RULE-0002, FEAT-0002, FEAT-0003, FEAT-0004, FEAT-0005, REQ-FEAT-0002-01, REQ-FEAT-0002-02, REQ-FEAT-0002-03, REQ-FEAT-0002-04, REQ-FEAT-0002-05, REQ-FEAT-0002-06, REQ-FEAT-0002-07, REQ-FEAT-0002-08, REQ-FEAT-0002-09, REQ-FEAT-0002-10, REQ-FEAT-0002-11, REQ-FEAT-0002-14, REQ-FEAT-0003-01, REQ-FEAT-0003-02, REQ-FEAT-0003-03, REQ-FEAT-0003-04, REQ-FEAT-0003-05, REQ-FEAT-0003-06, REQ-FEAT-0003-07, REQ-FEAT-0003-12, REQ-FEAT-0004-01, REQ-FEAT-0004-02, REQ-FEAT-0004-03, REQ-FEAT-0005-01, REQ-FEAT-0005-02, REQ-FEAT-0005-03, REQ-FEAT-0006-09]
---

# DES-0010 — Preparo offline do arquivo de pista da Kart Park

## Realiza

Os passos 1 a 8 de FLOW-0003: do arquivo de origem ao arquivo de pista gerado em esquema 3, com `trackId`
`kart-park`, `trackVersion` 1 e `schemaVersion` 3 (REQ-FEAT-0002-01, -02); os 684 pontos na ordem da origem,
volta fechada sem repetir o ponto 0 (REQ-FEAT-0002-03, -04); metros nos eixos do jogo, sentido anti-horário
(REQ-FEAT-0002-07, -08); a linha suavizada com janela de 12 m a no máximo 0,30 m da original, com o comprimento medido de novo
depois da suavização entre 680,625 m e 694,375 m e as bordas sem cruzamento (REQ-FEAT-0002-05, -10, -11); a largura de cada ponto copiada
(REQ-FEAT-0002-09); a largada (REQ-FEAT-0002-06); chegada, 3 limites de setor e marcadores a no máximo 25 m
como linhas transversais estendidas até `cutDistanceM` além da borda da pista ou até a barreira ou outra parte
da pista, sem limites de corte declarados (REQ-FEAT-0003-01 a -07), o que invalida o atalho da curva 4
(REQ-FEAT-0003-12); as 33 zebras levadas por índice fracionário, com a que cruza a largada dividida
(REQ-FEAT-0005-01, -02), cada uma com largura maior que 0 para fora da borda (REQ-FEAT-0005-03); a barreira
entre os trechos quase encostados, na grama (REQ-FEAT-0004-01 a -03); arquivo abaixo de 200.000 bytes e sem
recorde (REQ-FEAT-0002-14, REQ-FEAT-0006-09). O preparo fica fora do cliente (I10): o jogo não suaviza, não
converte e não edita pista.

## Posicionamento

- `scripts/trackPrep.ts`, **novo**, biblioteca pura do preparo; camada **dado de pista** (lugar na árvore:
  `scripts/`): produz dado de pista e importa só `src/track.ts`, `src/trackData.ts` e `src/trackGeometry.ts`.
- `scripts/track-pipeline.ts`, **novo**, programa em Node; camada **aplicação** (programa offline; lugar na
  árvore: `scripts/`), fora do cliente pela I2: lê e escreve arquivos com `node:fs`.
- `tracks/sources/kart-park.json`, **novo**: o arquivo de origem entregue pelo dono do produto (formato
  `kartle-pista` versão 1), copiado byte a byte pelo Curador do catálogo de
  `200 Requirements/220 Input/pista-kart-park/kart-park.json`; 32.189 bytes, SHA-256
  `52c5adda4ce89bd23a00e04a10d7e12a28900dd4d56414f444e0a4795f2c5302`. O preparo recusa uma origem com outro
  resumo, sem alterá-la.
- `package.json`, alterado: o script `"track": "tsx scripts/track-pipeline.ts"`; nenhuma dependência.

Motivo de serem novos: o preparo offline não existe (diretrizes do estágio). Biblioteca separada do programa,
como `scripts/handlingBench.ts` e `scripts/keyboard-lap.ts`, para que `npm test` prove a construção sem
escrever arquivos; verificações em outra biblioteca ([DES-0011](DES-0011-verificacoes-registro-de-publicacao-e-promocao.md)).
Decisão de linguagem e de empacotamento: [ADR-0002](../adr/ADR-0002-preparo-offline-em-typescript-e-arquivo-empacotado.md).

## Interface

`scripts/trackPrep.ts`:

| Símbolo | Assinatura | Descrição |
|---|---|---|
| `OriginTrack` | `{points: {x: number; y: number; widthM: number}[]; curbs: {side: 'LEFT' \| 'RIGHT'; fromM: number; toM: number}[]}` (m) | a origem lida: `pontos` `[x, y, largura]` (x leste, y norte, metros, a partir da largada, no sentido de corrida) e `zebras` `{lado, de_m, ate_m}`, com `esquerda` → `LEFT` e `direita` → `RIGHT` |
| `readOriginTrack(json)` | `(unknown) => OriginTrack \| {error: string}` | exige `formato` `kartle-pista`, `versao` 1, `sentido` `anti-horario`, `largada.indice` 0, pontos com 3 números finitos e largura positiva, zebras com `lado` conhecido e `de_m < ate_m`; não lê nem copia `nome`, `cidade`, `comprimento_m`, `comprimento_oficial_m`, `recorde` |
| `prepareTrack(origin, options)` | `(OriginTrack, {trackId: string; trackVersion: number}) => {file: Schema3File; prep: PrepRecord} \| {error: string}` | os passos abaixo; `PrepRecord` é o objeto `prep` do registro ([DM-0002](../data/DM-0002-registro-de-publicacao-e-estado-em-memoria.md)) |
| `serializeTrackFile(file)` | `(Schema3File) => string` | a serialização determinística de [DM-0001](../data/DM-0001-arquivo-de-pista-versao-de-esquema-3.md) |

Constantes de projeto ([ADR-0006](../adr/ADR-0006-lacunas-do-f-spec-resolvidas-no-projeto.md)):
`SMOOTH_WINDOW_M` 12 (janela total de distância de volta; meia janela 6 m); `SMOOTH_MAX_OFFSET_M` 0,295;
`TARGET_LAP_LENGTH_M` 687,5 e `LAP_LENGTH_TOLERANCE` 0,01 (a faixa de 680,625 m a 694,375 m);
`SECTOR_TARGETS_M` [201,6; 350,3; 529,9]; `MARKER_TARGET_SPACING_M` 18; `MIN_LINE_SPACING_M` 2;
`LINE_MARCH_STEP_M` 0,05; `CUT_DISTANCE_M` 3 (o padrão de `race-lap-validation`); `LINE_END_TARGET_M` 2,99
(`CUT_DISTANCE_M` − 0,01); `LINE_MARCH_MAX_M` 60; `NEAR_SECTIONS_M` [[371, 414], [580, 615]];
`BARRIER_GAP_MAX_M` 6; `EDGE_SAMPLE_M` 0,25; `GAP_MARCH_STEP_M` 0,01; `BARRIER_SEQUENCE_GAP_M` 1;
`CURB_WIDTH_M` 1,0; `CURB_MIN_WIDTH_M` 0,3; `CURB_MIN_GRASS_M` 0,4; `OTHER_PART_LAP_M` 30; arredondamento
a 0,001. Não existem mais `SMOOTH_LAMBDA` nem `SMOOTH_MAX_ITERATIONS` (revisão 1.1.0, ADR-0006).

Passos de `prepareTrack`, em ordem:

1. **Conversão** (RULE-0002, eixos): `O_i = (x_i − cx, −(y_i − cy))`, com `(cx, cy)` o centro da caixa
   envolvente dos pontos da origem, arredondado a 0,001 m; a origem das coordenadas é o centro da pista. A
   linha central original é a poligonal fechada dos `O_i`; `d_o(i)` é a distância de volta nela.
2. **Suavização** com correspondência por índice, **janela de 12 m, uma aplicação** (ADR-0006): para cada
   ponto `i`, `S_i` é a média ponderada dos pontos **da origem** `O_j` cuja distância de volta até `O_i` na
   linha original, `δ = min(|d_o(j) − d_o(i)|, L_o − |d_o(j) − d_o(i)|)` (volta fechada, `L_o` o comprimento
   original), é no máximo 6 m, com peso `w = ½ (1 + cos(π δ / 6))` (cosseno levantado: 1 em `δ` 0, 0 em `δ`
   6 m), `j` percorrido em ordem crescente de índice; o próprio ponto entra com peso 1. Depois, o grampo
   `|P_i − O_i| <= 0,295 m` (projeção de `S_i` sobre o círculo de 0,295 m em torno de `O_i` quando o desvio
   passa disso; senão `P_i = S_i`). Uma só aplicação: `S` é calculada da origem, nunca de uma linha já
   suavizada. O grampo garante V01 e V07 por construção (o ponto `O_i` está na linha original, e 0,295 m mais o
   arredondamento ficam abaixo de 0,30 m); os dois são verificados, não presumidos. Em seguida o
   **comprimento é medido de novo** sobre as coordenadas já arredondadas (soma dos 684 segmentos, inclusive o
   do último ponto ao ponto 0); se fica fora de `TARGET_LAP_LENGTH_M` ± `LAP_LENGTH_TOLERANCE` (680,625 m a
   694,375 m) o preparo falha nomeando o comprimento medido, sem escrever. Esse comprimento é o
   `lapLengthM` do arquivo e de `prep`; o rótulo do catálogo continua `displayLengthM` 687
   ([DES-0005](../core/DES-0005-sessao-de-treino-catalogo-e-selecao-de-pista.md), REQ-FEAT-0006-08). A janela
   fica em `prep.smoothingWindowM` (12) e o maior desvio em `prep.maxSmoothingOffsetM`.
3. **Larguras**: `widthM_i` igual à largura do ponto `i` da origem, arredondada a 0,001.
4. **Zebras**: para cada zebra da origem, índice fracionário de `de_m` e de `ate_m` em `d_o` e distância de
   volta correspondente na linha suavizada (RULE-0002); a zebra com `ate_m` maior que o comprimento da volta
   original cruza a largada e vira dois trechos do mesmo lado: do início correspondente até `lapLengthM` e de
   0 até o correspondente de `ate_m − comprimento original`; total 34. Largura: `CURB_WIDTH_M`, reduzida, por
   trecho, até deixar `CURB_MIN_GRASS_M` de grama entre a borda externa do trecho e o asfalto ou a zebra
   (largura nominal) de outra parte da volta (a mais de `OTHER_PART_LAP_M` de distância de volta); uma largura
   abaixo de `CURB_MIN_WIDTH_M` faz o preparo falhar, nomeando o trecho. Cada redução entra em
   `prep.reducedCurbs` com a folga que a limitou.
5. **Barreira**: os pontos com `d_o` em cada trecho de `NEAR_SECTIONS_M` dão as duas bordas do asfalto do
   trecho (poligonais `leftEdge` e `rightEdge` desses índices). As amostras são **pares** `(p_E, p_D)` no
   mesmo parâmetro das duas bordas, a cada `EDGE_SAMPLE_M` da borda mais longa de cada segmento, mais o par
   das pontas finais. Para cada par, `q_E` e `q_D` são os pontos mais próximos de `p_E` e de `p_D` nas bordas
   do asfalto do outro trecho; **a borda voltada para o outro trecho é a da amostra mais próxima dele**:
   `(p, q)` é o par de menor distância (empate, a borda esquerda), porque o segmento da outra borda até o
   outro trecho atravessaria o asfalto do próprio trecho. O par é descartado com `|p − q| > BARRIER_GAP_MAX_M`
   ou `|p − q| = 0`. Com `|p − q| <= 6 m`, `pq` é percorrido de `p` a `q` em passos de `GAP_MARCH_STEP_M`
   (0,01 m) classificando a superfície: a saída da pista é o primeiro ponto na grama, a entrada no outro
   trecho é o último ponto na grama antes de voltar a asfalto ou zebra; sem grama em `pq`, ou com a parte de
   grama menor que `2 * BARRIER_HALF_WIDTH_M`, o preparo falha nomeando a amostra (a superfície de contato
   encostaria na pista). O vértice da barreira é o meio da parte de grama. Os vértices dos dois sentidos
   (primeiro trecho contra o segundo, depois o segundo contra o primeiro) são ordenados pela distância de
   volta do ponto mais próximo da linha central **no primeiro trecho** (desempate por `x`, depois `z`); cada
   sequência contínua (sem salto de distância de volta maior que `BARRIER_SEQUENCE_GAP_M`, 1 m) com dois
   vértices ou mais, arredondados a 0,001 m e sem vértice consecutivo repetido, é uma barreira em `barriers`.
   Cada vértice está sobre um `pq` de 6 m ou menos entre os asfaltos, o que dá V14 nos vértices e V13 para
   essas amostras, e na grama, o que dá V15 nos vértices; V13 para as demais amostras (as da borda de trás,
   cujo `q` mais próximo passa pelo próprio asfalto e cruza a barreira), V14 e V15 entre vértices são
   verificados, não presumidos. Revisão 1.1.0 (SPEC-ISSUE-03): o critério anterior ("a borda cujo segmento
   até o outro trecho não atravessa o asfalto do próprio trecho", avaliado por amostra) descartava as
   primeiras amostras de uma borda côncava e deixava V13 sem barreira em (19,56; −45,86); o critério da
   amostra mais próxima é o que `scripts/trackPrep.ts` aplica e com que V13 a V15 passam.
6. **Largada e chegada**: `finishLine` é a linha transversal no ponto 0; `startPosition` é o meio do segmento
   do ponto 0 ao ponto 1, com `headingDeg = atan2(dx, dz) * 180 / π` desse segmento.
7. **Limites de setor**: o ponto `i` que minimiza `|d_o(i) − D_k|` para cada `D_k` de `SECTOR_TARGETS_M`
   (empate, o menor `i`); a linha transversal nele.
8. **Marcadores**: `n = ceil(lapLengthM / 18)`, `s = lapLengthM / n`; o marcador `k` (de 0 a `n − 1`) fica no
   ponto cujo `d(i)` é o mais próximo de `s / 2 + k * s`; se esse ponto está a menos de 2 m de distância de
   volta do ponto 0 ou de um ponto de limite de setor, passa ao ponto mais próximo que não está (empate, o
   seguinte). Com `s <= 18 m`, o arredondamento ao ponto (cerca de 0,5 m) e o desvio de 2 m, dois marcadores
   consecutivos, inclusive o último e o primeiro passando pelo ponto 0, ficam a no máximo 23 m (V10); duas
   linhas consecutivas ficam a pelo menos 2 m (C7 v3).
9. **Linha transversal no ponto `i`** (RULE-0002): reta por `P_i` na direção `n_i`; de cada lado, a partir
   da borda da pista naquele ponto (borda do asfalto, ou a borda externa da zebra que cobre `d(i)` daquele
   lado), avança em passos de `LINE_MARCH_STEP_M` (no máximo `LINE_MARCH_MAX_M`) e, a cada passo, na ordem:
   (a) se o ponto não é grama (`classifySurface` diferente de `grass`: outra parte da pista), a ponta é o
   ponto anterior (o último na grama); (b) se o segmento do ponto anterior ao ponto cruza um segmento de
   barreira, a ponta é o ponto de cruzamento; (c) se `beyondTrackEdgeM(ponto) >= CUT_DISTANCE_M` (a medida
   que o corte usa: distância à borda da pista, não o deslocamento ao longo da normal), a ponta é, por
   **bissecção** (20 passos) entre o ponto anterior e o ponto, o último ponto com `beyondTrackEdgeM` abaixo de
   `LINE_END_TARGET_M` (2,99 m), de modo que a ponta gravada fica entre 2,95 m e 3,001 m além da borda
   depois do arredondamento (a tolerância de V11). O fim é definido pela distância à borda **medida**, não
   pelo deslocamento ao longo da normal: numa curva, ou com outra parte da pista à frente, 3 m ao longo da
   normal ficam a menos de 3 m da borda (marcador 0: 2,868 m) ou encontram a outra parte antes (marcador 20:
   outra parte a 6,33 m) e V11 reprova (SPEC-ISSUE-03, revisão 1.1.0). Orientação: `from` é a ponta da
   esquerda e `to` a da direita no sentido de corrida, de modo que o percurso cruza a linha da direita para a
   esquerda de `from → to` (`crossLine` `FORWARD`, como as linhas da pista sintética).
10. **Identidade**: `schemaVersion` 3, `trackId`, `trackVersion`, `osmDerived` `true`, `direction`
    `COUNTER_CLOCKWISE` (o preparo falha se a área com sinal no plano (x, −z) não é positiva); sem
    `cutDistanceM`, `cutDurationMs`, nome, comprimento oficial ou recorde.

Comandos de `scripts/track-pipeline.ts` (`npm run track -- <comando> <trackId> <trackVersion>`):

| Comando | Efeito | Saída |
|---|---|---|
| `prepare kart-park 1` | confere o resumo da origem; `prepareTrack`; escreve `src/tracks/kart-park-v1.json` (arquivo temporário e renomeação); recusa se o par já está no registro | `PREPARED`, o caminho, a janela, o maior desvio, o comprimento medido e as larguras reduzidas; código de saída 0, ou 1 com a mensagem de erro |
| `verify`, `publish`, `promote` | [DES-0011](DES-0011-verificacoes-registro-de-publicacao-e-promocao.md) | |

Argumentos de `scripts/track-pipeline.ts`, validados todos antes de ler o conteúdo de qualquer arquivo ou de
escrever qualquer arquivo (a única consulta ao disco da validação é a existência da origem de `<trackId>`, já
conferido contra o catálogo). Um valor fora da regra encerra o programa com código de saída 1 e a mensagem
`argumento inválido: <nome do argumento>`, que não reproduz o valor recebido, sem ler nem escrever arquivo:

| Argumento | Tipo e regra |
|---|---|
| `<comando>` | um de `prepare`, `verify`, `publish`, `promote` |
| `<trackId>` | cadeia de 1 a 40 caracteres em `[a-z0-9-]`, igual ao `trackId` de uma entrada de `TRAINING_TRACKS` ([DES-0005](../core/DES-0005-sessao-de-treino-catalogo-e-selecao-de-pista.md)) cujo arquivo de origem `tracks/sources/<trackId>.json` existe; hoje só `kart-park` (a pista sintética não tem origem em `tracks/sources/`). O caminho da origem, o caminho escrito `src/tracks/<trackId>-v<trackVersion>.json` e a chave do registro são montados só depois desta validação |
| `<trackVersion>` | cadeia de 1 a 6 dígitos decimais, sem sinal, sem zero à esquerda e sem separador; inteiro de 1 a 999999 |
| `--esri-decision <referência>` | aceito só com `promote`, obrigatório nele e no máximo uma vez; depois de retirados os espaços das pontas, cadeia de 1 a 200 caracteres sem caractere de controle (U+0000 a U+001F e U+007F a U+009F); é esse valor que `promote` grava em `esriDecisionRef` |
| qualquer outro argumento ou opção | recusado |

## Colaboradores

`scripts/trackPrep.ts` chama `buildTrackGeometry`, `classifySurface`, `positionAtLapM`, `lapMAtIndex`
(`src/trackGeometry.ts`) e `serializeTrackFile`. `scripts/track-pipeline.ts` chama a biblioteca, lê
`TRAINING_TRACKS` (`src/trainingSession.ts`) para validar `<trackId>`, e chama `node:fs`, `node:path` e
`node:crypto`. Chamados pelo Curador do catálogo (o programa) e por `npm test` (a biblioteca).

## Estado e concorrência

Sem estado: `prepareTrack` é função pura da origem e das opções. Executar `prepare` duas vezes com a mesma
origem escreve o mesmo arquivo, byte a byte. Um `prepare` de um par (`trackId`, `trackVersion`) já registrado é
recusado, sem escrever: uma versão publicada nunca é regenerada no lugar (I3). Publicada é a entrada
entregue por uma rodada de código que passou no gate ([DM-0002](../data/DM-0002-registro-de-publicacao-e-estado-em-memoria.md),
"Entrada de rodada reprovada"): a entrada `kart-park` 1 gravada pela rodada reprovada em
`code-validation-20261027-2125` é retirada pela rodada de código seguinte, junto com o arquivo que aponta,
antes de `prepare kart-park 1` com a regra da revisão 1.1.0; `trackVersion` continua 1 (ADR-0006).

## Comportamento em falha

Argumento fora da tabela de argumentos: código de saída 1, a mensagem nomeia o argumento e não reproduz o
valor, nada lido nem escrito. Origem ausente, com outro resumo, de formato desconhecido ou fora das
restrições: erro nomeado, nada escrito.
Zebra que não cabe, barreira sem grama suficiente, comprimento medido depois da suavização fora da faixa de
± 1 % ou sentido horário: erro nomeado, nada escrito. Falha no
meio da escrita: o temporário fica para trás e o arquivo publicado anterior, se existe, não é tocado. Sem rede,
sem tempo-limite; nova tentativa é executar de novo. A saída lista só identificadores, contagens e medidas, nunca
o conteúdo do arquivo.

## Determinismo (D-DS-07)

Aritmética em ordem fixa, sem relógio nem sorteio. Prova em `tests/pista-kart-park-prep.test.ts`:
`prepareTrack` sobre `tracks/sources/kart-park.json` com `trackVersion` 1 seguido de `serializeTrackFile` dá
exatamente os bytes de `src/tracks/kart-park-v1.json` (o arquivo publicado é reproduzível) e duas execuções dão
o mesmo texto; `readOriginTrack` recusa uma cópia com `formato` trocado e uma com zebra de `lado` desconhecido.

## Feature flag

Nenhuma: programa offline executado pelo Curador; não roda no cliente.

## Pontos em aberto

Nenhum.
