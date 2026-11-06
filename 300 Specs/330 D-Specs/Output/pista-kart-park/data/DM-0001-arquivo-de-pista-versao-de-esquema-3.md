---
id: DM-0001
title: Arquivo de pista, versão de esquema 3
feature: pista-kart-park
stage: dspec
status: validated
version: 2.0.1
sources: [API-0001, FEAT-0002, FEAT-0003, FEAT-0004, FEAT-0005, RULE-0002, REQ-FEAT-0002-01, REQ-FEAT-0002-02, REQ-FEAT-0002-04, REQ-FEAT-0002-07, REQ-FEAT-0002-09, REQ-FEAT-0002-12, REQ-FEAT-0002-14, REQ-FEAT-0002-15, REQ-FEAT-0002-16, REQ-FEAT-0002-17, REQ-FEAT-0002-18, REQ-FEAT-0002-19, REQ-FEAT-0002-20, REQ-FEAT-0002-21, REQ-FEAT-0003-01, REQ-FEAT-0003-04, REQ-FEAT-0003-07, REQ-FEAT-0004-01, REQ-FEAT-0005-01, REQ-FEAT-0005-03, REQ-FEAT-0005-20, REQ-FEAT-0006-09]
---

# DM-0001 — Arquivo de pista, versão de esquema 3

## Realiza

O contrato API-0001: a versão de esquema 3 do arquivo de pista, com a linha central e a largura de cada
ponto, as zebras, as barreiras e a indicação de dado OSM (REQ-FEAT-0002-02, -04, -07, -09, -19; REQ-FEAT-0003-01,
-04, -07; REQ-FEAT-0004-01; REQ-FEAT-0005-01, -03, -20); a leitura da versão 2 como antes (REQ-FEAT-0002-15); o
arquivo de esquema 3 sem linha central utilizável como `UNREADABLE` (REQ-FEAT-0002-16); o arquivo publicado
imutável, abaixo de 200.000 bytes e sem recorde (REQ-FEAT-0002-14, -17, -18; REQ-FEAT-0006-09); as duas versões
publicadas da Kart Park, a 2 nova ao lado da 1 inalterada (REQ-FEAT-0002-20, -21). Camada: dado
de pista (`src/trackData.ts`, `src/trackGeometry.ts`, `src/tracks/`). Decisão: [ADR-0001](../adr/ADR-0001-esquema-3-do-arquivo-de-pista.md).
Leitor: [DES-0001](../core/DES-0001-leitura-do-dado-de-pista-em-esquema-3.md). Produção do arquivo:
[DES-0010](../pipeline/DES-0010-preparo-offline-do-arquivo-da-kart-park.md).

## Não há banco

O produto não tem banco no MVP. O "esquema" é o arquivo de pista empacotado com o jogo. O esquema 2 é o de
`race-lap-validation` (o DM-0001 daquele conjunto), sem nenhuma mudança: este modelo descreve só o que a
versão 3 acrescenta e como o leitor classifica as três versões. O registro de publicação e o estado em
memória estão em [DM-0002](DM-0002-registro-de-publicacao-e-estado-em-memoria.md).

## Campos do arquivo na versão 3

Unidades no nome: `M` metros, `Ms` milissegundos, `Deg` graus. Eixos do jogo: `x` leste, `z` com norte = −z,
em metros (RULE-0002). Os campos de `race-lap-validation` mantêm nome, tipo, unidade e significado.

| Campo | Tipo | Unidade | Nulável | Padrão | Restrições |
|---|---|---|---|---|---|
| `schemaVersion` | inteiro | — | não | — | `3` |
| `trackId` | texto | — | não | — | não vazio; `kart-park` na Kart Park |
| `trackVersion` | inteiro ≥ 1 ou texto não vazio | — | não | — | `1` na primeira versão da Kart Park e `2` na réplica; nunca alterado depois de publicado |
| `osmDerived` | booleano | — | sim (ausente) | `false` | `true` na Kart Park; neutro: ausente, o arquivo não declara dado OSM |
| `direction` | `CLOCKWISE` ou `COUNTER_CLOCKWISE` | — | sim | ausente | igual ao enrolamento de `centerline` (C1 v3) |
| `startPosition` | `{xM, zM, headingDeg}` | m, m, graus | sim | ausente | `headingDeg` na convenção do `heading` da física: 0 aponta para `+z`, positivo gira para `+x` |
| `finishLine` | linha | m | sim | ausente | linha `{fromXM, fromZM, toXM, toZM}` de `race-lap-validation` |
| `sectorLimits` | lista de exatamente 3 linhas | m | sim | ausente | em ordem de volta |
| `markers` | lista de 1 ou mais linhas | m | sim | ausente | distinta de `sectorLimits` |
| `cutDistanceM`, `cutDurationMs` | como em `race-lap-validation` | m, ms | sim | ausentes; valem 3 e 1000 | ausentes na Kart Park |
| `centerline` | lista de 3 ou mais pontos `{xM, zM, widthM}` | m | não | — | volta fechada do último ponto ao ponto 0, que não se repete; `xM`, `zM` finitos; `widthM` finito e maior que 0, largura do asfalto centrada no ponto ao longo da normal |
| `curbs` | lista de `{side, fromLapM, toLapM, widthM}` | m | sim | lista vazia | `side` `LEFT` ou `RIGHT` no sentido de corrida; `0 <= fromLapM < toLapM <= lapLengthM + 0,001`; `widthM` finito e maior que 0; neutro: sem zebra, nenhuma superfície nova |
| `barriers` | lista de `{points}`, `points` lista de 2 ou mais `{xM, zM}` | m | sim | lista vazia | pontos finitos; cada barreira é a poligonal aberta dos seus pontos; neutro: sem obstáculo |

`lapLengthM` é a soma dos comprimentos dos segmentos de `centerline`, inclusive do último ponto ao ponto 0,
calculada das coordenadas gravadas; a tolerância de 0,001 m do leitor absorve o arredondamento a 3 casas do fim
de um trecho de zebra que termine no comprimento da volta (o caso do arquivo da versão 1, cuja zebra da largada
foi dividida). No arquivo da versão 2 nenhum trecho cruza a largada, e a verificação V20 exige
`toLapM <= lapLengthM` só com a meia unidade da última casa gravada (0,0005 m) ([DES-0011](../pipeline/DES-0011-verificacoes-registro-de-publicacao-e-promocao.md)).

A versão 3 não tem campo de nome, de comprimento exibido, de comprimento oficial nem de recorde: nome e
comprimento exibidos ficam no catálogo do treino ([DES-0005](../core/DES-0005-sessao-de-treino-catalogo-e-selecao-de-pista.md)),
e o recorde não entra em dado algum (REQ-FEAT-0006-09). Campos desconhecidos são ignorados na leitura e
nunca removidos nem reescritos (I3); o **arquivo publicado da Kart Park**, porém, tem exatamente os campos da
tabela, sem nenhum outro (verificação V18 de [DES-0011](../pipeline/DES-0011-verificacoes-registro-de-publicacao-e-promocao.md)).

## Classificação feita por `readTrackData` ([DES-0001](../core/DES-0001-leitura-do-dado-de-pista-em-esquema-3.md))

As ordens 1 a 5 são as de `race-lap-validation`, com o limite de versão passando de 2 a 3.

| Ordem | Condição | `trackDataStatus` |
|---|---|---|
| 1 | entrada ausente, texto que não é JSON, ou JSON que não é objeto | `UNREADABLE` |
| 2 | `schemaVersion` ausente, não inteiro ou menor que 1 | `UNREADABLE` |
| 3 | `schemaVersion` maior que 3 | `UNSUPPORTED_SCHEMA` |
| 4 | `trackId` ou `trackVersion` fora de forma | `UNREADABLE` |
| 5 | `schemaVersion` 1 | `INCOMPLETE` |
| 6 | `schemaVersion` 3 com `centerline` ausente, não lista, com menos de 3 pontos, ou com ponto de `xM`/`zM` não finito ou `widthM` não finito ou não positivo | `UNREADABLE` |
| 7 | `schemaVersion` 3 com `curbs` presente e não lista, ou com item fora das restrições; ou `barriers` presente e não lista, ou com item sem `points` de 2 ou mais pontos finitos; ou `osmDerived` presente e não booleano | `UNREADABLE` |
| 8 | versão 2 ou 3 com campo de linha da volta ausente ou fora de forma, ou `cutDistanceM`/`cutDurationMs` inválidos, ou reprovada na consistência (C1 a C7 na versão 2, sobre a pista sintética; C1 a C7 da versão 3, abaixo) | `INCOMPLETE` |
| 9 | versão 2 ou 3 que passa em tudo | `COMPLETE` |

Em `INCOMPLETE` de versão 3 a leitura devolve `centerline`, `curbs`, `barriers` e `osmDerived` (já
validados nas ordens 6 e 7) e só os campos de linha declarados de forma válida. A ordem 3 vem antes da 4 pelo
mesmo motivo de `race-lap-validation`: um esquema futuro que renomeie `trackId` é reportado como esquema não
suportado.

## Verificações de consistência da versão 3 (C1 a C7 v3)

Puras, determinísticas, sobre os campos e sobre a geometria do **próprio arquivo**
([DES-0002](../core/DES-0002-geometria-da-pista-declarada-no-arquivo.md)), nunca sobre a pista sintética.
Qualquer falha torna o dado `INCOMPLETE`; nenhuma lança. As de mesmo número têm o mesmo propósito das de
`race-lap-validation`.

| Id | Verificação |
|---|---|
| C1 v3 | `direction` igual ao enrolamento de `centerline` em ordem de índice: com `S` = soma de `x_i * z_(i+1) - x_(i+1) * z_i`, `S > 0` é `CLOCKWISE` e `S < 0` é `COUNTER_CLOCKWISE` (a mesma regra de C1; área positiva no plano (x, −z) é `S < 0`) |
| C2 v3 | a `centerline` fechada cruza cada linha (chegada, 3 limites, cada marcador) em exatamente 1 ponto, no sentido da pista (`crossLine` `FORWARD`) |
| C3 v3 | `startPosition` está na pista (`classifySurface` diferente de `grass`) e `headingDeg` fica a menos de 90 graus da tangente do segmento mais próximo da `centerline`, no sentido de percurso |
| C4 v3 | posições de arco medidas da largada no sentido de percurso: marcadores crescentes, limites crescentes, chegada maior que todas |
| C5 v3 | cada limite de setor tem um marcador antes e um depois; o último marcador vem antes da chegada |
| C6 v3 | as duas pontas de cada linha estão na grama (`classifySurface` igual a `grass`): a linha atravessa a pista de borda a borda no seu cruzamento, de modo que um kart sobre a pista não passa sem cruzá-la. Substitui o alcance fixo `WIDTH / 2 + 9` de C6, que pressupõe o muro da pista sintética, inexistente na versão 3 (REQ-FEAT-0004-04) |
| C7 v3 | duas linhas consecutivas na ordem de arco distam pelo menos 2 m; a largada dista pelo menos 2 m de cada marcador e de cada limite; a largada fica do lado de depois da chegada (`sideOf(finishLine, start) > 0`). A distância mínima da largada à chegada de C7 não se aplica: REQ-FEAT-0002-06 põe a largada no segmento do ponto 0 ao ponto 1 (cerca de 1 m), e a primeira passagem pela chegada no sentido da pista continua só ao completar o percurso, porque a largada está depois dela |

## Arquivos publicados da Kart Park

Os dois arquivos estão em `schemaVersion` 3, com a serialização determinística de sempre: JSON compacto numa
linha, terminado por uma quebra de linha, chaves na ordem `schemaVersion`, `trackId`, `trackVersion`,
`osmDerived`, `direction`, `startPosition`, `finishLine`, `sectorLimits`, `markers`, `centerline`, `curbs`,
`barriers`; coordenadas, larguras e distâncias arredondadas a 0,001 m e `headingDeg` a 0,001 grau. Os dois são
cobertos pela regra `src/tracks/*.json -text` de `.gitattributes` (`.gitattributes:6`): o Git nunca converte o fim
de linha de um arquivo cujo SHA-256 é registrado.

| Arquivo | `trackVersion` | Conteúdo | Situação |
|---|---|---|---|
| `src/tracks/kart-park-v1.json` | 1 | traçado da versão 1: 684 pontos suavizados, larguras de 4,4 m a 10,8 m, 34 trechos de zebra, origem no centro da caixa envolvente da origem; 43.013 bytes, SHA-256 `04ce5e51…f057b1` | publicado em 2026-10-27; **inalterado**, byte a byte (REQ-FEAT-0002-20, -21); não é importado pelo cliente, de modo que não entra no pacote do jogo ([ADR-0008](../adr/ADR-0008-kart-park-versao-2-a-partir-da-replica.md)) |
| `src/tracks/kart-park-v2.json` | 2 | a réplica não oficial: os 691 pontos da réplica nos eixos do jogo com a origem dela (`xM` = *x*, `zM` = −*y*; ponto 0 em (0, 0), a linha de largada), sem suavizar nem reamostrar; `widthM` 7,0 em todo ponto; os 22 trechos de zebra da réplica, na ordem dela, nenhum cruzando a largada; uma barreira por trecho contínuo de grama de 6 m ou menos entre os trechos ≈ 369–406 m e ≈ 595–624 m; `osmDerived` `true`, `direction` `COUNTER_CLOCKWISE`; `cutDistanceM` e `cutDurationMs` ausentes. Tamanho esperado da ordem de 45 kB (a `centerline` sozinha tem cerca de 15,5 mil caracteres), abaixo de 200.000 bytes (V17) | **novo**, gerado pelo preparo ([DES-0010](../pipeline/DES-0010-preparo-offline-do-arquivo-da-kart-park.md)), verificado por V01 a V20 e registrado ([DES-0011](../pipeline/DES-0011-verificacoes-registro-de-publicacao-e-promocao.md)); importado pelo cliente como texto (`?raw`) e lido com `readTrackData(texto)` ([ADR-0002](../adr/ADR-0002-preparo-offline-em-typescript-e-arquivo-empacotado.md)) |

A versão 2 não muda o esquema: os campos, a classificação e as verificações C1 a C7 v3 acima valem para os dois
arquivos, e o leitor não sabe qual versão lê; quem confere a versão é a sessão de treino, contra a entrada do
catálogo ([DES-0005](../core/DES-0005-sessao-de-treino-catalogo-e-selecao-de-pista.md)).

Uma versão publicada nunca é editada: qualquer mudança da linha central, de uma largura, de uma zebra, da
barreira, dos setores ou dos marcadores gera `src/tracks/kart-park-v<n+1>.json` com `trackVersion` maior, o
catálogo do treino passa a declarar esse `trackVersion` e a aplicação passa a importar esse arquivo; o arquivo
anterior fica no repositório, intacto (REQ-FEAT-0002-18; I3). A réplica é publicada assim, como versão 2, e não
como edição da versão 1. A imutabilidade é verificada em `npm test` pelo resumo SHA-256 registrado de cada versão
(REQ-FEAT-0002-17, -21).

## Plano de migração

| Item | Conteúdo |
|---|---|
| Revisão | revisão 3 do seed: acréscimo do arquivo de pista `kart-park` `trackVersion` 2 no mesmo `schemaVersion` 3; nenhuma mudança de esquema (o leitor das versões 1, 2 e 3 de esquema fica como está) |
| O que faz | `src/tracks/kart-park-v2.json` e `tracks/sources/kart-park-replica.json` são acrescentados; a entrada `kart-park` do catálogo passa a declarar `trackVersion` 2 e a aplicação passa a empacotar o arquivo da versão 2 no lugar do da versão 1; `src/tracks/kart-park-v1.json`, `tracks/sources/kart-park.json` e o arquivo da pista sintética não mudam; nenhum arquivo existente é reescrito |
| Reversão (passos executáveis) | 1. Uma mudança de código, não um `git revert` dos commits da revisão 3, que devolve ao estado anterior só duas coisas: a entrada `kart-park` do catálogo do treino em `src/trainingSession.ts` (volta a não declarar `trackVersion`) e a importação do arquivo de pista em `src/main.ts` (volta a importar `src/tracks/kart-park-v1.json`). 2. `src/tracks/kart-park-v2.json`, `tracks/sources/kart-park-replica.json` e a entrada `kart-park` 2 do registro ficam no repositório, intactos: uma versão publicada nunca é retirada nem editada (I3; API-0001, Compatibilidade: reverter a revisão 3 não edita nenhum arquivo de pista). 3. `npm test` e `npm run build` na árvore revertida. 4. Republicar em staging o artefato estático construído dela. Nada fica gravado em navegador, então não há dado de jogador a desfazer; o arquivo da versão 1 nunca saiu do repositório, então a reversão não o recria nem o altera |
| Teste da reversão | a árvore revertida passa no `npm test`: o catálogo e a sessão do treino como na revisão 2 (entrada `kart-park` sem `trackVersion`, a aplicação abre a Kart Park na versão 1), e a verificação de imutabilidade afirma que `src/tracks/kart-park-v1.json` e `src/tracks/kart-park-v2.json` continuam presentes com o resumo SHA-256 registrado nas entradas `kart-park` 1 (`04ce5e51…`) e 2 do registro, e que `tracks/sources/kart-park-replica.json` continua presente com o `prep.originSha256` registrado na entrada 2 (`eba665b6…`); o pacote construído dela abre a Kart Park na versão 1 |

## Preenchimento retroativo

Nenhum: não há arquivo de pista armazenado fora do repositório nem dado de jogador a converter. Nenhum resultado
de volta é gravado, de modo que nenhum resultado antigo fica chaveado na versão 1.

## Janela de compatibilidade

O arquivo é empacotado no mesmo artefato do leitor e do catálogo: um cliente com o catálogo da versão 2 recebe o
arquivo da versão 2, e um artefato antigo em cache do navegador continua coerente consigo mesmo (catálogo sem
`trackVersion` e arquivo da versão 1). A troca é num único passo de implantação, sem indisponibilidade. Um
artefato que, por erro de empacotamento, combinasse o catálogo novo com o arquivo da versão 1 não abre sessão na
Kart Park (`TRACK_VERSION_MISMATCH`), exibe o erro e não inicia volta (I4), em vez de usar a pista errada. Quando a
pista passar a ser servida por CDN (pós-MVP, D-DS-03), um cliente que só conheça o esquema 2 classifica qualquer
arquivo da Kart Park como `UNSUPPORTED_SCHEMA` e o mantém intacto.

## Retenção e privacidade

O arquivo guarda geometria, identificadores de pista e a indicação `osmDerived`; nenhum dado pessoal,
identificador de jogador, segredo, nome de autor nem recorde (I6, D-DS-04, REQ-FEAT-0006-09). Cada versão
publicada é guardada para sempre no repositório (I3). O jogo nunca grava, altera nem apaga o arquivo. O
crédito OSM/ODbL acompanha o dado na tela ([DES-0007](../web/DES-0007-tela-inicial-seletor-credito-e-resultado.md)).
