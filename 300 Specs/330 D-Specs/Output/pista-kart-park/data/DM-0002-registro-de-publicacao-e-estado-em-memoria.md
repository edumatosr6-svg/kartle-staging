---
id: DM-0002
title: Registro de publicação das pistas e estado em memória da sessão de treino e do retorno da zebra
feature: pista-kart-park
stage: dspec
status: validated
version: 2.0.1
sources: [RULE-0005, RULE-0003, RULE-0004, API-0002, FLOW-0003, REQ-FEAT-0002-17, REQ-FEAT-0002-18, REQ-FEAT-0002-20, REQ-FEAT-0002-21, REQ-FEAT-0007-13, REQ-FEAT-0001-15, REQ-FEAT-0001-16, REQ-FEAT-0001-03, REQ-FEAT-0001-12, REQ-FEAT-0005-18, REQ-FEAT-0006-14]
---

# DM-0002 — Registro de publicação das pistas e estado em memória

## Realiza

O registro de publicação de RULE-0005 e FLOW-0003 (passos 10 e 11): `trackId`, `trackVersion` e o resumo
criptográfico de cada versão publicada, deduplicado e imutável (REQ-FEAT-0002-17, -18), com a entrada da versão 1
da Kart Park mantida como foi registrada e a da versão 2 acrescentada (REQ-FEAT-0002-20, -21), e a promoção a
produção, de qualquer versão, condicionada à decisão sobre a licença Esri (REQ-FEAT-0007-13, REQ-FEAT-0006-14). E o estado que a
sessão de treino (RULE-0003) e o retorno da zebra (RULE-0004) guardam **só na memória da página**, sem nada
gravado no navegador (REQ-FEAT-0001-03, -12; REQ-FEAT-0005-18). Camadas: o registro é dado do preparo offline,
fora do cliente (I2); a sessão é da simulação; o estado do retorno é da aplicação.

## Não há banco

O registro é um arquivo JSON versionado no repositório, `tracks/registry.json`, escrito só pelo programa
`scripts/track-pipeline.ts` ([DES-0011](../pipeline/DES-0011-verificacoes-registro-de-publicacao-e-promocao.md))
e lido por ele e por `npm test`. O cliente não o importa nem o empacota.

## `tracks/registry.json` — formato versão 1

| Campo | Tipo | Unidade | Nulável | Padrão | Restrições e motivo |
|---|---|---|---|---|---|
| `registryVersion` | inteiro | — | não | — | `1`; o programa recusa, sem alterar o arquivo, um registro de versão desconhecida (I3, I4) |
| `entries` | lista de entradas | — | não | `[]` | só acrescida; nenhuma entrada entregue é removida (a única retirada é a de uma rodada reprovada, abaixo) |

Entrada:

| Campo | Tipo | Unidade | Nulável | Padrão | Restrições e motivo |
|---|---|---|---|---|---|
| `trackId` | texto de 1 a 40 caracteres em `[a-z0-9-]` | — | não | — | identifica a pista (I1); só um `trackId` do catálogo do treino com origem em `tracks/sources/`, pela validação de argumentos do programa ([DES-0010](../pipeline/DES-0010-preparo-offline-do-arquivo-da-kart-park.md)) |
| `trackVersion` | inteiro de 1 a 999999 | — | não | — | contador de sequência das versões da pista (RULE-0005); faixa da validação de argumentos de DES-0010 |
| `file` | texto | — | não | — | caminho do arquivo publicado a partir da raiz do repositório, `src/tracks/<trackId>-v<trackVersion>.json` |
| `sha256` | texto, 64 dígitos hexadecimais minúsculos | — | não | — | resumo SHA-256 dos bytes do arquivo no momento da publicação (REQ-FEAT-0002-17) |
| `fileBytes` | inteiro | bytes | não | — | tamanho do arquivo, abaixo de 200.000 (V17) |
| `publicationState` | `STAGING` ou `PRODUCTION` | — | não | — | os estados persistidos de RULE-0005; `PREPARED`, `VERIFIED` e `REJECTED` são saídas de execução do programa e não são gravados |
| `stagedAtUtc` | texto ISO 8601 em UTC | — | não | — | quando a versão foi registrada; identifica a ordem das publicações |
| `promotedAtUtc` | texto ISO 8601 em UTC | — | sim | ausente | presente só com `PRODUCTION` |
| `esriDecisionRef` | texto de 1 a 200 caracteres, sem caractere de controle | — | sim | ausente | obrigatório com `PRODUCTION`: a referência da decisão do dono do produto registrada em `DOMAIN.md` (identificador e data da decisão) que libera a promoção (REQ-FEAT-0007-13); o valor de `--esri-decision` validado por DES-0010 |
| `prep` | objeto | — | não | — | evidência do preparo, abaixo; a forma depende de `prep.method` |

`prep` (evidência registrada das escolhas do preparo, [ADR-0006](../adr/ADR-0006-lacunas-do-f-spec-resolvidas-no-projeto.md),
[ADR-0008](../adr/ADR-0008-kart-park-versao-2-a-partir-da-replica.md)). Campos comuns:

| Campo | Tipo | Unidade | Restrições |
|---|---|---|---|
| `method` | `SMOOTHED_ORIGIN` ou `REPLICA` | — | opcional; **ausente vale `SMOOTHED_ORIGIN`**, que é a forma da entrada `kart-park` 1 gravada em 2026-10-27 (sem o campo, e que nunca é reescrita); `REPLICA` na entrada `kart-park` 2 |
| `originFile` | texto | — | o arquivo de origem: `tracks/sources/kart-park.json` na versão 1, `tracks/sources/kart-park-replica.json` na versão 2 |
| `originSha256` | texto hexadecimal | — | resumo do arquivo de origem: `52c5adda4ce89bd23a00e04a10d7e12a28900dd4d56414f444e0a4795f2c5302` na versão 1, `eba665b6c700fe7a05cd89862ef74d93ce307e613393e34cf78b9c69b2caa24e` na versão 2 |
| `lapLengthM` | número | m | comprimento da volta da `centerline` gravada, medido de novo pelo preparo; o arquivo não o grava em chave própria |
| `originOffsetM` | `{xM, zM}` | m | deslocamento aplicado às coordenadas da origem: o centro da caixa envolvente na versão 1; `{xM: 0, zM: 0}` na versão 2, que usa a origem da réplica (REQ-FEAT-0002-07) |
| `curbWidthsM` | lista de números | m | largura gravada de cada trecho de `curbs`, na ordem do arquivo |
| `reducedCurbs` | lista de `{curbIndex, widthM, grassClearanceM}` | —, m, m | trechos cuja largura ficou abaixo de 1,0 m pela folga de grama, com a folga que a limitou |

Só com `SMOOTHED_ORIGIN` (versão 1): `smoothingWindowM` (12) e `maxSmoothingOffsetM`, a janela da suavização e o
maior desvio de um ponto gerado ao ponto correspondente da origem (ADR-0006). Só com `REPLICA` (versão 2):
`maxReplicaOffsetM`, o maior afastamento de um ponto gravado ao ponto da réplica nos eixos do jogo, que é só o
arredondamento a 0,001 m (no máximo cerca de 0,0007 m). A entrada da versão 2 não tem campo de suavização: não
houve suavização.

Unicidade: no máximo uma entrada por (`trackId`, `trackVersion`). Índices: não há; o programa e o teste leem a
lista inteira (poucas entradas). Chaves estrangeiras: `file` aponta para um arquivo que existe no repositório
(verificado em `npm test`).

Segunda chegada (idempotência, D-DS-03): publicar de novo o mesmo arquivo com o mesmo (`trackId`,
`trackVersion`) encontra a entrada com o mesmo `sha256` e não muda nada; publicar conteúdo diferente com um
par já registrado é recusado, sem alterar o registro. Promover de novo uma entrada já `PRODUCTION` não muda
nada. A escrita é atômica: o programa escreve num arquivo temporário na mesma pasta e o renomeia sobre o
registro, de modo que uma falha no meio deixa o registro anterior intacto.

**Entrada de rodada reprovada.** Uma entrada é publicada — e por isso imutável (I3, RULE-0005) — quando a
rodada de código que a gravou passou no gate; `STAGING` e `PRODUCTION` são estados de uma entrada entregue
([ADR-0005](../adr/ADR-0005-kart-park-sem-chave-e-producao-bloqueada.md)). A entrada `kart-park` 1 gravada em
`tracks/registry.json` pela rodada reprovada em `code-validation-20261027-2125` (FAIL SPEC; `smoothingIterations`
0, `maxSmoothingOffsetM` 0, `lapLengthM` 687,52) não foi validada, testada nem implantada, e o commit `ba221ad`
é ponto de controle, não entrega: a rodada de código seguinte a retira, junto com `src/tracks/kart-park-v1.json`,
no mesmo commit em que refaz `prepare`/`verify`/`publish kart-park 1`. Depois de entregue, nenhuma entrada é
retirada nem reescrita; a regra "só acrescida" vale a partir daí. Essa retirada já foi feita (a entrada atual,
`stagedAtUtc` 2026-10-27T21:58:06.132Z, é a da rodada que passou no gate) e não se repete: a entrada `kart-park` 1
é, desde então, imutável, e a revisão 3 só acrescenta a entrada `kart-park` 2 depois dela.

## Estado em memória — sessão de treino ([DES-0005](../core/DES-0005-sessao-de-treino-catalogo-e-selecao-de-pista.md))

| Campo | Tipo | Significado |
|---|---|---|
| `sessionState` | `NO_SESSION`, `LOADING`, `READY`, `FAILED` | estado de RULE-0003 |
| `selectedTrackId` | `kart-park` ou `synthetic` | pista do último pedido de seleção; `kart-park` na abertura |
| `reading` | `TrackReading` | leitura do dado da pista da sessão, com `READY` ou `FAILED`; com `READY` na Kart Park, `trackVersion` 2; com `FAILED` por `TRACK_VERSION_MISMATCH`, a leitura do arquivo recebido, guardada para que `getTrainingTrackOptions` devolva o seu `trackDataStatus` |
| `environment` | `Environment` | ambiente da simulação da sessão `READY`: `trackEnvironment(geometria)` na versão 3, `CIRCUIT` na versão 2 |
| `startKart` | `State` | o kart parado na `startPosition` da pista da sessão `READY` |

A volta (`LapSession` de `race-lap-validation`) é guardada ao lado da sessão pela aplicação, como hoje, e só
substituída pelo valor que `selectTrainingTrack` e os comandos da volta devolvem. Numa sessão de treino ela é o
treino inteiro (uma sessão `TRAINING` de voltas seguidas, com a lista de resultados `results` de DM-0002 1.2.0
daquela feature): a sessão de treino desta feature não guarda resultado, contador de voltas nem melhor volta.
O catálogo (`TRAINING_TRACKS`, com o `trackVersion` opcional de cada entrada) é constante do módulo, não estado.

## Estado em memória — retorno da zebra ([DES-0009](../web/DES-0009-retorno-da-zebra-vibracao-e-som.md))

| Campo | Tipo | Unidade | Significado |
|---|---|---|---|
| `lastHandledStep` | inteiro ou ausente | passos | o último `simStepCount` tratado; chave de deduplicação |
| `lastPulseStep` | inteiro ou ausente | passos | passo em que começou o último pulso de vibração |
| `lastSoundStep` | inteiro ou ausente | passos | passo em que começou a última repetição do som |

Zerado (os três ausentes) a cada treino iniciado (`startTrainingLap`) e a cada sessão nova, porque o
`simStepCount` recomeça em 0 com o kart de cada treino (RULE-0004: "uma sessão nova começa sem início
registrado"). Não é zerado no fim de uma volta do treino: as voltas seguidas de um treino de
`race-lap-validation` (ADR-0006 daquela feature) continuam com o mesmo kart e o mesmo `simStepCount`.

## Plano de migração

| Item | Conteúdo |
|---|---|
| Revisão | revisão 3 do seed: acréscimo da entrada `kart-park` `trackVersion` 2 em `STAGING`, com `prep.method` `REPLICA`; `registryVersion` continua 1 (o campo `prep.method` é opcional e ausente vale a forma de antes) |
| O que faz | `publish kart-park 2` acrescenta a entrada ao fim de `entries`; a entrada `kart-park` 1 fica com o mesmo conteúdo, campo a campo; nenhum arquivo publicado muda |
| Reversão (passos executáveis) | 1. A reversão da revisão 3 é a de [DM-0001](DM-0001-arquivo-de-pista-versao-de-esquema-3.md): só a entrada `kart-park` do catálogo do treino e a importação de `src/main.ts` voltam ao estado anterior. 2. O registro não é tocado: a entrada `kart-park` 2, `src/tracks/kart-park-v2.json` e `tracks/sources/kart-park-replica.json` ficam como foram registrados, porque nenhuma entrada entregue (`STAGING` ou `PRODUCTION`) é retirada nem reescrita (REQ-FEAT-0002-17, -18). 3. `npm test` na árvore revertida. O registro não é lido pelo cliente, então nenhum artefato publicado depende dele; uma versão que precise ser substituída é sucedida por uma versão maior, nunca apagada |
| Teste da reversão | a árvore revertida passa em `npm test`; o registro dela tem as entradas `kart-park` 1 e 2, iguais às de antes campo a campo, e a verificação de imutabilidade afirma que `src/tracks/kart-park-v1.json`, `src/tracks/kart-park-v2.json` e `tracks/sources/kart-park-replica.json` continuam presentes com os resumos `sha256` e `prep.originSha256` registrados |

Uma versão futura do formato do registro sobe `registryVersion` e o programa passa a ler a anterior; o
registro nunca é reescrito no lugar para mudar de formato.

## Preenchimento retroativo

Nenhum: a entrada `kart-park` 1 não ganha `prep.method` (ausente vale `SMOOTHED_ORIGIN`), e nenhuma entrada é
reescrita. A pista sintética não é registrada: ela não é preparada offline e o seu arquivo é literal em
`src/track.ts` desde `race-lap-validation`.

## Janela de compatibilidade

Não se aplica ao cliente, que não lê o registro. O programa e o teste de publicação leem as duas formas de
`prep` (com e sem `method`). Entre o commit do arquivo publicado da versão 2 e o da entrada não há estado
intermediário publicável: a etapa de código entrega os dois no mesmo commit, e `npm test` reprova uma árvore
com arquivo publicado sem entrada (ou com entrada sem arquivo).

## Retenção e privacidade

O registro guarda identificadores de pista, resumos, tamanhos, instantes UTC de publicação e promoção, a
referência textual de uma decisão de produto e os parâmetros do preparo. Nenhum nome de pessoa, e-mail,
identificador de jogador, credencial nem conteúdo de jogador (I6, D-DS-04): quem publica não é registrado. As
entradas ficam para sempre (histórico de versões, I3). O estado em memória da sessão e do retorno some com a
página; nada é gravado em `localStorage`, `sessionStorage` nem IndexedDB.
