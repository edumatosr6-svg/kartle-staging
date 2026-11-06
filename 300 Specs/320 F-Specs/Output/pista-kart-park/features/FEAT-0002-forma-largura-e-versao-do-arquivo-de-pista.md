---
id: FEAT-0002
title: Forma, largura e versão do arquivo de pista da Kart Park
feature: pista-kart-park
stage: fspec
status: validated
version: 2.0.0
sources: [US-0002, NFR-0001, NFR-0006, NFR-0014, AC-US-0001-08, AC-US-0002-01, AC-US-0002-02, AC-US-0002-03, AC-US-0002-04, AC-US-0002-05, AC-US-0002-06, AC-US-0002-07, AC-US-0002-08, AC-US-0003-12, AC-US-0005-02]
---

# FEAT-0002 — Forma, largura e versão do arquivo de pista da Kart Park

## Resumo

O arquivo de pista gerado dá à Kart Park a forma da pista real desenhada como kartódromo: a linha central
do arquivo da réplica não oficial (`replica/kart-park-replica.json`), expressa nos eixos do jogo e sem nova
suavização, a no máximo 0,10 m dela em todo ponto, fechada no ponto 0, com 690,7 m ± 1 % no sentido
anti-horário, o asfalto com 7,0 m de largura em toda a volta e as bordas sem cruzamento, inclusive na curva
mais fechada, de raio 8,8 m (`DOMAIN/DEC-13`). A simulação usa esse dado como está. A réplica é publicada
como `kart-park` `trackVersion` 2, num arquivo menor que 200.000 bytes; o arquivo da versão 1 continua no
repositório, byte a byte igual, e uma versão publicada nunca muda (I3, I5).

## Canais

`web-desktop` e `web-mobile`: a mesma geometria, a mesma largura e o mesmo sentido; a forma da pista é dado
lido pela simulação e não depende do canal (I2). O preparo do arquivo é offline, do Curador do catálogo,
sem canal de jogo. Em `web-mobile`, sem sensor ou com permissão negada, o controle recai para toque com
estado visível; a pista não muda (I4).

## Requisitos

- REQ-FEAT-0002-01: O arquivo de pista gerado SHALL declarar `trackId` `kart-park` e `trackVersion` 2
  (NFR-0006; AC-US-0001-08).
- REQ-FEAT-0002-02: O arquivo de pista gerado SHALL declarar `schemaVersion` 3 [DOMAIN] (I3, I5: a forma
  com linha central é mudança versionada; `01-overview.md`, decisões de forma).
- REQ-FEAT-0002-03: Retirado na rodada 5. Exigia que o ponto *i* gerado correspondesse ao ponto *i* do
  arquivo do traçado da versão 1; a revisão 3 não tem essa correspondência. O que ele tornava decidível
  passa ao requisito 19. O id não é reaproveitado.
- REQ-FEAT-0002-04: O arquivo de pista gerado SHALL ter a `centerline` fechada: a volta segue do último
  ponto de volta ao ponto 0, e o ponto 0 não é repetido no fim da lista (AC-US-0002-01).
- REQ-FEAT-0002-05: O arquivo de pista gerado SHALL ter o comprimento da volta fechada da linha central,
  soma de todos os segmentos de `centerline`, incluindo o do último ponto ao ponto 0, entre 683,793 m e
  697,607 m (AC-US-0002-02).
- REQ-FEAT-0002-06: O arquivo de pista gerado SHALL declarar a `startPosition` sobre o segmento da linha
  central do ponto 0 ao ponto 1, depois da linha de largada no sentido de corrida e antes do ponto 1, com o
  rumo desse segmento (AC-US-0002-03).
- REQ-FEAT-0002-07: O arquivo de pista gerado SHALL ter as coordenadas em metros nos eixos do jogo, com
  leste = +x e norte = −z, na mesma origem do arquivo da réplica: um ponto (*x*, *y*) da réplica, com *y*
  para o norte, é (`xM` = *x*, `zM` = −*y*) no jogo (AC-US-0002-04, AC-US-0002-06; `SEED/RE-03` via
  US-0002).
- REQ-FEAT-0002-08: O arquivo de pista gerado SHALL ter a linha central, percorrida na ordem dos pontos,
  girando no sentido anti-horário visto de cima, com área com sinal positiva no plano (x, −z), e declarar
  `direction` `COUNTER_CLOCKWISE` (AC-US-0002-04).
- REQ-FEAT-0002-09: O arquivo de pista gerado SHALL ter `widthM` igual a 7,0 m em todo ponto da
  `centerline` (AC-US-0002-05).
- REQ-FEAT-0002-10: O arquivo de pista gerado SHALL ter cada ponto da `centerline` a no máximo 0,10 m da
  linha central da réplica, a poligonal fechada dos pontos do arquivo da réplica expressa nos eixos do jogo
  como no requisito 07, medido até essa poligonal (AC-US-0002-06).
- REQ-FEAT-0002-11: O arquivo de pista gerado SHALL ter as duas bordas do asfalto sem cruzamento em toda a
  volta, o que inclui a curva mais fechada (raio 8,8 m, perto de 216 m): nenhuma borda cruza a si mesma nem
  a outra (AC-US-0002-07).
- REQ-FEAT-0002-12: O sistema SHALL usar, no estado da simulação com a Kart Park carregada, a linha central
  e as larguras do arquivo de pista gerado exatamente como declaradas, sem suavizar, reamostrar nem
  converter ao carregar (AC-US-0002-08; AC-US-0002-06, observado no estado da simulação).
- REQ-FEAT-0002-13: O sistema SHALL desenhar, na tela de corrida, o asfalto da Kart Park com a linha
  central e as larguras do arquivo de pista gerado [DOMAIN] (I2: a tela só desenha o dado; US-0002,
  Canais).
- REQ-FEAT-0002-14: O arquivo de pista gerado da Kart Park SHALL ter menos de 200.000 bytes, como é
  entregue ao navegador (NFR-0001).
- REQ-FEAT-0002-15: O sistema SHALL ler um arquivo de pista em `schemaVersion` 2 como antes desta feature,
  com a geometria existente da pista sintética, sem exigir nenhum campo de [API-0001](../api/API-0001-dado-de-pista-com-geometria-zebras-e-barreiras.md)
  [DOMAIN] (I3, I5; NFR-0009: a pista sintética não muda).
- REQ-FEAT-0002-16: O sistema SHALL tratar como `UNREADABLE` um arquivo em `schemaVersion` 3 cuja
  `centerline` falta, tem menos de 3 pontos ou tem um `widthM` não positivo, sem alterá-lo [DOMAIN] (I4).
- REQ-FEAT-0002-17: O arquivo de cada versão publicada da Kart Park SHALL ficar idêntico byte a byte ao
  publicado, com o resumo criptográfico registrado na publicação (NFR-0006).
- REQ-FEAT-0002-18: Toda mudança na linha central, numa largura, numa zebra, na barreira, nos setores ou
  nos marcadores da Kart Park SHALL ser publicada como arquivo novo com `trackVersion` maior que o da versão
  anterior, nunca como edição de uma versão publicada; a réplica é publicada assim, como versão 2, e não
  como edição da versão 1 (NFR-0006).
- REQ-FEAT-0002-19: O arquivo de pista gerado SHALL ter o ponto 0 da `centerline` a no máximo 0,10 m do
  ponto 0 da linha central da réplica, que é a linha de largada do arquivo da réplica, de modo que as
  distâncias de volta declaradas no arquivo da réplica (zebras e elementos) são medidas na `centerline` a
  partir do mesmo ponto 0 (AC-US-0002-03, AC-US-0002-06; AC-US-0003-12 e AC-US-0005-02 leem distâncias do
  arquivo da réplica a partir do ponto 0).
- REQ-FEAT-0002-20: O arquivo publicado da Kart Park `trackVersion` 1 SHALL continuar no repositório depois
  da publicação da versão 2, com o `trackId` `kart-park` e o `trackVersion` 1 (NFR-0014).
- REQ-FEAT-0002-21: O arquivo publicado da Kart Park `trackVersion` 1 SHALL continuar byte a byte igual,
  com 0 bytes diferentes e o mesmo resumo criptográfico registrado na publicação da versão 1 (NFR-0014).

## Comportamento

Preparo, verificação e publicação: [FLOW-0003](../flows/FLOW-0003-preparo-e-publicacao-do-arquivo-de-pista.md),
[RULE-0002](../rules/RULE-0002-geometria-e-verificacoes-do-arquivo-de-pista.md) (definições e cálculo de
cada verificação), [RULE-0005](../rules/RULE-0005-versao-e-publicacao-da-pista.md). Leitura:
[API-0001](../api/API-0001-dado-de-pista-com-geometria-zebras-e-barreiras.md). Desenho:
[SCR-0003](../screens/SCR-0003-kart-park-na-tela-de-corrida.md).

| Situação | Comportamento |
|---|---|
| Arquivo gerado que passa nas verificações de [RULE-0002](../rules/RULE-0002-geometria-e-verificacoes-do-arquivo-de-pista.md) | Publicável como `trackVersion` 2 (só em staging até a decisão sobre a licença Esri, [RULE-0005](../rules/RULE-0005-versao-e-publicacao-da-pista.md)) |
| Preparo que suaviza de novo a linha da réplica, ou que afasta algum ponto mais de 0,10 m dela | O arquivo reprova e não é publicado; a correção é feita no preparo offline, nunca no jogo (I10) |
| Comprimento fora de 683,793–697,607 m, largura diferente de 7,0 m em algum ponto ou bordas que se cruzam na curva de raio 8,8 m | O arquivo reprova e não é publicado |
| Conversão com outro mapeamento de eixos | O circuito fica espelhado e gira no sentido horário; o arquivo reprova nas verificações de sentido e de distância à réplica |
| Diferença para o traçado oficial de 750 m (a réplica é 7,9 % mais curta) | Aceita; informada pelo nome "réplica não oficial" ([FEAT-0006](FEAT-0006-credito-nome-e-comprimento.md)); aproximar o traçado dos 750 m está fora do escopo |
| Largura geral "do OSM quando houver, senão 8 m" | Não se aplica à Kart Park: a largura fixa de 7 m da réplica é desvio aceito (`SEED/RD-03`) |
| Mudança de esquema (versão 3) | Declarada e versionada (I3, I5): leitor da versão 2 mantido e um ensaio de `npm test` lendo a forma 2 e a forma 3. A versão 2 da Kart Park usa o mesmo esquema 3 da versão 1. Nenhum arquivo existente é reescrito e nenhum dado de jogador muda, então não há migração de dado a fazer |
| Arquivo em `schemaVersion` 2 (pista sintética) | Lido como hoje, sem mudança |
| Arquivo em `schemaVersion` 3 sem linha central utilizável | `UNREADABLE`: nenhuma sessão nessa pista; o arquivo fica intacto |
| Arquivo em `schemaVersion` maior que 3 | `UNSUPPORTED_SCHEMA`, regra de `race-lap-validation`; intacto e reportado |
| Publicação da versão 2 | Arquivo novo, com o mesmo `trackId` e `trackVersion` 2; o arquivo da versão 1 não é editado, renomeado nem apagado |
| Mudança depois de publicada a versão 2 | Versão nova; a publicada não é editada |
| Rede indisponível | Sem efeito: o arquivo vem com os arquivos do jogo |

## Estado

Não define estado de execução: o arquivo de pista é dado imutável por versão. O estado de publicação de uma
versão (`publicationState`: `PREPARED`, `REJECTED`, `VERIFIED`, `STAGING`, `PRODUCTION`) é o de
[RULE-0005](../rules/RULE-0005-versao-e-publicacao-da-pista.md).

## Configuração

Nenhuma. A tolerância de 0,10 m, a largura de 7,0 m, a faixa de comprimento e o limite de tamanho são
verificações do arquivo, não configuração do jogo.

## Critérios de aceite

- O arquivo gerado declara `trackId` `kart-park`, `trackVersion` 2, `schemaVersion` 3 e `direction`
  `COUNTER_CLOCKWISE` (cobre os requisitos 01, 02 e 08).
- A `centerline` não repete o ponto 0 no fim, e a soma de todos os seus segmentos, com o do último ponto
  ao ponto 0, fica entre 683,793 m e 697,607 m (satisfaz AC-US-0002-01, AC-US-0002-02; cobre os requisitos
  04 e 05).
- A `startPosition` está sobre o segmento do ponto 0 ao ponto 1, depois da linha no ponto 0 (satisfaz
  AC-US-0002-03; cobre o requisito 06).
- A área com sinal da `centerline` no plano (x, −z) é positiva (satisfaz AC-US-0002-04; cobre os requisitos
  07 e 08).
- Todo ponto da `centerline` tem `widthM` 7,0 (satisfaz AC-US-0002-05; cobre o requisito 09).
- A distância de cada ponto da `centerline` até a linha central da réplica nos eixos do jogo é de no máximo
  0,10 m, e a do ponto 0 até o ponto 0 da réplica também (satisfaz AC-US-0002-06; cobre os requisitos 07,
  10 e 19).
- As bordas esquerda e direita não têm autointerseção nem interseção entre si, inclusive na curva de raio
  8,8 m (satisfaz AC-US-0002-07; cobre o requisito 11).
- Com a Kart Park carregada, a linha central e as larguras lidas no estado da simulação são iguais às do
  arquivo, ponto a ponto, e cada ponto fica a no máximo 0,10 m da linha central da réplica; a tela de
  corrida desenha o asfalto com elas (satisfaz AC-US-0002-06, AC-US-0002-08; cobre os requisitos 12 e 13).
- O arquivo entregue ao navegador mede menos de 200.000 bytes (cobre o requisito 14).
- O arquivo da pista sintética em `schemaVersion` 2 é lido sem erro e sem mudança; um arquivo em
  `schemaVersion` 3 sem `centerline` é `UNREADABLE` e fica intacto (cobre os requisitos 15 e 16).
- O resumo do arquivo publicado de cada versão é igual ao registrado na publicação; o histórico de
  publicação não tem duas versões com o mesmo `trackVersion` e conteúdo diferente, e a versão 2 tem
  `trackVersion` maior que a 1 (cobre os requisitos 17 e 18).
- Depois da publicação da versão 2, a listagem dos arquivos de pista publicados tem o arquivo com `trackId`
  `kart-park` e `trackVersion` 1, e o seu resumo é o registrado na publicação da versão 1 (cobre os
  requisitos 20 e 21).

## Pontos em aberto

Nenhum.
