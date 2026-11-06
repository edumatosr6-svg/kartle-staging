---
title: Glossário — pista Kart Park
feature: pista-kart-park
stage: fspec
status: validated
version: 2.0.0
sources: []
---

# Glossário

Os termos valem igualmente em `web-desktop` e `web-mobile`, salvo indicação. Os termos de domínio vêm do
glossário dos requisitos; as definições geométricas e as linhas de enum e de campo são as dos contratos de
`api/` e das regras de `rules/`.

## Termos de domínio

| Termo | Definição |
|---|---|
| Jogador | Quem escolhe a pista no treino e pilota o kart, com teclado (`web-desktop`) ou com inclinação e toque (`web-mobile`) |
| Curador do catálogo | Quem prepara offline o arquivo de pista da Kart Park: conversão para os eixos do jogo, linhas de volta, zebras, barreira, verificação e versão |
| Kart Park | Pista real de São José dos Pinhais (PR), `trackId` `kart-park`; primeira pista real do Kartle; no jogo, a versão 2, a réplica não oficial |
| Pista sintética | A pista que o jogo já tem, `trackId` `synthetic`; continua selecionável e continua sendo a pista dos ensaios automáticos de `dirigibilidade` e de `race-lap-validation` |
| Tela inicial | A tela de início de volta de `race-lap-validation`, onde o Jogador escolhe iniciar uma volta, acrescida do seletor de pista |
| Seletor de pista | Controle da tela inicial com duas opções, a Kart Park (versão 2) e a pista sintética; escolher uma opção carrega aquela pista no treino |
| Catálogo do treino | A lista fixa das pistas que o seletor oferece, com o nome, a versão carregada, o comprimento exibido e a indicação de crédito OSM de cada uma ([API-0002](api/API-0002-catalogo-e-selecao-da-pista-do-treino.md)) |
| Treino | Pilotagem livre na pista escolhida no seletor, só com volta de treino (`lapKind` `TRAINING`); não gera tentativa nem resultado de desafio diário (I1) |
| Tela de resultado | Nos requisitos, a tela exibida ao fim de uma volta, com o tempo da volta. Para a volta de treino, a única desta feature, é o painel "Resultado da volta do treino" da tela de corrida de `race-lap-validation`, exibido sem parar o jogo ([SCR-0002](screens/SCR-0002-credito-na-tela-de-resultado.md)) |
| Sessão de treino | O estado da simulação e da volta numa pista escolhida no seletor, do momento em que a pista é carregada até a escolha de outra pista ou o fechamento da página ([RULE-0003](rules/RULE-0003-sessao-de-treino-e-selecao-de-pista.md)) |
| Desafio diário | Desafio do dia, ligado a um `challengeNumber`; ainda não existe e é de outra feature |
| Réplica não oficial | O traçado da Kart Park versão 2: o desenho da pista real refeito com retas e arcos de raio constante, ligados por transições de 5 m, com largura fixa de 7 m e zebras por regra; 690,7 m, 7,9 % mais curto que o traçado oficial de 750 m (`DOMAIN/DEC-13`) |
| Traçado da versão 1 | O traçado da Kart Park `trackVersion` 1, gerado de `kart-park.json` (caminho OpenStreetMap `way/128739206` e bordas detectadas na Esri World Imagery); base sobre a qual a réplica foi ajustada; o seu arquivo publicado continua no repositório, igual, e fora do seletor |
| Arquivo da réplica | `replica/kart-park-replica.json`, formato `kartle-pista`, aprovado pelo dono do produto em 2026-11-06: pontos da linha central em metros (*x* leste, *y* norte, origem na linha de largada), largura, 33 elementos e 22 zebras; não traz chegada, limites de setor nem marcadores |
| Elemento | Cada uma das 33 partes do arquivo da réplica: uma reta ou um arco de raio constante, com distância de volta de início (`de_m`) e comprimento (`comprimento_m`); 16 retas e 17 arcos |
| Arquivo de pista gerado | O arquivo da Kart Park versão 2 produzido offline a partir do arquivo da réplica, no formato que o jogo lê (`schemaVersion` 3, [API-0001](api/API-0001-dado-de-pista-com-geometria-zebras-e-barreiras.md)) |
| Linha central da réplica | A poligonal fechada dos pontos do arquivo da réplica, expressa nos eixos do jogo com a mesma origem: (*x*, *y*) da réplica é (*x*, −*y*) em (`xM`, `zM`) |
| Linha central | A poligonal fechada `centerline` do arquivo de pista gerado; a no máximo 0,10 m da linha central da réplica, com o ponto 0 a no máximo 0,10 m do ponto 0 dela |
| Ponto 0 | O primeiro ponto da linha central, onde ficam a linha de largada e a linha de chegada; o mesmo da réplica, a no máximo 0,10 m |
| Distância de volta | Distância medida ao longo da linha central, a partir do ponto 0, no sentido de corrida, em metros; as distâncias declaradas no arquivo da réplica (zebras, elementos) são lidas nesta régua, sem conversão |
| Trecho aproximado | Trecho que os requisitos dão como "≈ *a*–*b* m", com os extremos arredondados ao metro; abrange as distâncias de volta de *a* − 0,5 m a *b* + 0,5 m ([RULE-0002](rules/RULE-0002-geometria-e-verificacoes-do-arquivo-de-pista.md)) |
| Sentido de corrida | Anti-horário, visto de cima (`direction` `COUNTER_CLOCKWISE`) |
| Eixos do jogo | Leste = +x, norte = −z, em metros; visto de cima, (x, −z) é o plano com norte para cima e leste para a direita |
| Normal | Em cada ponto *i*, o vetor unitário perpendicular à direção do ponto *i* − 1 ao ponto *i* + 1 (índices em volta fechada), apontando para a esquerda do sentido de corrida |
| Largura do asfalto | `widthM` de cada ponto: 7,0 m em todo ponto da Kart Park versão 2, da réplica; desvio aceito da regra geral "largura do OSM quando houver, senão 8 m" |
| Borda do asfalto | Cada uma das duas poligonais formadas pelos pontos a meia largura do asfalto de cada ponto da linha central, ao longo da normal, uma à esquerda e outra à direita |
| Asfalto | A área entre as duas bordas do asfalto, segmento a segmento |
| Zebra | Faixa encostada na borda do asfalto, do lado declarado, para fora, ao longo de um trecho de volta; conta como pista e dá a cada pneu 85 % da aderência do asfalto |
| Trecho de zebra | Uma zebra contínua entre duas distâncias de volta; o arquivo da réplica tem 22 (430,7 m no total), o arquivo gerado tem os mesmos 22, e nenhum cruza a linha de largada |
| Zebras por regra | A regra com que as zebras da réplica foram postas: por dentro das curvas de raio menor que 30 m e por fora na saída das de raio menor que 16 m; o arquivo gerado copia as zebras que o arquivo da réplica declara |
| Pista | O asfalto mais as zebras |
| Borda da pista | O limite externo da pista: a borda do asfalto ou, onde houver zebra daquele lado, a borda externa da zebra |
| Grama | Tudo o que fica fora da pista; a sua regra não muda nesta feature |
| Saída de pista | Estado do kart com a sua posição além da borda da pista (`beyondTrackEdgeM` maior que 0) |
| Corte | Invalidação da volta quando o kart fica mais de `cutDistanceM` (3 m) além da borda da pista por mais de `cutDurationMs` (1000 ms); regra de `race-lap-validation`, sem mudança |
| Aderência | A força máxima que o pneu transmite ao chão com a mesma carga e o mesmo escorregamento; aqui expressa como fração da do mesmo pneu no asfalto (`wheelGripPc`) |
| Curva mais fechada | Na réplica, o arco de raio 8,8 m, à esquerda, de 86°, perto de 216 m de volta |
| Grampo | Curva em que a pista volta quase no sentido contrário; os dois grampos da réplica têm raio 15,5 m e 14,4 m |
| Trechos quase encostados | O par de partes da pista entre ≈ 369–406 m e ≈ 595–624 m de volta, com no mínimo 1,28 m e no máximo 6 m de grama entre as bordas do asfalto |
| Atalho pela grama | Passagem pela grama entre duas partes da pista que encurta a volta; com mais de 6 m de grama entre as bordas, é invalidado pelos marcadores, sem barreira |
| Barreira | Obstáculo físico desta feature entre os trechos quase encostados; poligonal na grama; o kart bate e não passa |
| Muro existente | O obstáculo da pista sintética; a barreira tem o mesmo efeito de colisão que ele |
| Setor | Cada um dos quatro trechos da volta, separados pelos três limites de setor e pela chegada |
| Linha transversal | Segmento que atravessa a pista num ponto da linha central, ao longo da normal, e se estende `cutDistanceM` além da borda da pista de cada lado, parando antes de uma barreira ou de outra parte da pista |
| Linha de largada e de chegada | Na Kart Park, a mesma linha transversal no ponto 0 |
| Limite de setor | Linha transversal no ponto da linha central cuja distância de volta é a mais próxima de 204,9 m, 354,9 m ou 534,7 m; cada um fica dentro de um elemento do tipo reta da réplica |
| Marcador de percurso | Linha transversal num ponto da linha central; marcadores consecutivos ficam a no máximo 25 m de distância de volta, inclusive do último ao primeiro |
| Marcador pulado | Motivo `MISSED_MARKER` de `race-lap-validation`, exibido como "marcador pulado" |
| Vibração da zebra | Pulso de 20 ms do aparelho, começado no máximo uma vez a cada 0,25 s de tempo simulado enquanto houver ao menos uma roda na zebra, em `web-mobile`, se o navegador permitir |
| Som da zebra | Ruído curto e grave próprio da zebra, repetido enquanto houver ao menos uma roda na zebra, em `web-desktop`, com o som ligado |
| Som ligado | O áudio do jogo está ativo: o navegador permitiu a reprodução e o jogo não está silenciado; "som desligado" é o contrário |
| Tempo simulado | Tempo em passos de `STEP` no estado da simulação; não avança com a simulação suspensa |
| Crédito OSM | Linha com "© colaboradores do OpenStreetMap", a menção "licença ODbL" e um link para `https://openstreetmap.org/copyright` |
| Esri World Imagery | Imagem de satélite sobre a qual foram medidas as bordas do traçado da versão 1, base da réplica; a licença para publicar dado derivado dela vale para as duas versões e é decidida antes da promoção para produção |
| Staging / produção | Os dois ambientes de publicação; a Kart Park, em qualquer versão, fica só em staging até a decisão sobre a licença Esri |
| Versão da pista | O `trackVersion` de um arquivo de pista publicado; nunca muda depois de publicado. A Kart Park tem a versão 1 (traçado da versão 1, fora do seletor) e a versão 2 (réplica não oficial, no seletor) |
| Acabamento | O desenho de kartódromo da Kart Park: faixa de borda, relevo da zebra, barreira de pneus e tons de grama; só desenho, fora da simulação, sobre o traçado da versão 2 ([RULE-0006](rules/RULE-0006-acabamento-visual-da-kart-park.md)) |
| Cena desenhada | O que a tela desenha, com as medidas em metros do mundo do jogo, de onde se leem as larguras, alturas e distâncias do acabamento |
| Faixa de borda | Faixa branca contínua de 0,10 m por dentro do asfalto, junto a cada borda do asfalto, em toda a volta da Kart Park; asfalto para a simulação |
| Relevo da zebra | Altura desenhada da zebra: 0 m na borda do lado do asfalto, maior que 0 m e no máximo 0,05 m na borda de fora; fora da simulação |
| Barreira de pneus | A barreira desenhada como fileira de pneus pretos empilhados de 0,9 m de altura, com a face a no máximo 0,05 m da face de colisão de cada lado |
| Face de colisão | De cada um dos dois lados de uma barreira do arquivo de pista, a superfície em que o kart bate e para; não é a poligonal da barreira, que não tem espessura, e a distância entre as duas é de projeto |
| Tom de grama | Cada verde em que a grama da Kart Park é desenhada; ao menos 2, todos `GRASS` para a simulação |
| Luminância relativa | Luminância de uma cor na definição da WCAG 2; a de cada tom de grama difere da de `#68865b`, a cor de grama de antes da revisão 2, entre 8 % e 20 % desse valor |
| Revisão 2 | A revisão do seed de 2026-11-03, que acrescenta o acabamento; "o jogo de antes da revisão 2" é a referência de AC-US-0007-16 para a aparência da pista sintética |
| Revisão 3 | A revisão do seed de 2026-11-06, que troca o traçado pela réplica não oficial, publicada como versão 2; a referência de NFR-0013 e de AC-US-0007-07 passa a ser a versão 2 com e sem o acabamento desenhado |

## Enums e campos

| Nome | Onde | Valores ou significado |
|---|---|---|
| `schemaVersion` | [API-0001](api/API-0001-dado-de-pista-com-geometria-zebras-e-barreiras.md) | 2: forma existente, geometria da pista sintética; 3: forma com `centerline` |
| `trackVersion` | API-0001, [API-0002](api/API-0002-catalogo-e-selecao-da-pista-do-treino.md) | Versão publicada de uma pista; na Kart Park, 1 (fora do seletor) e 2 (no seletor) |
| `centerline` | API-0001 | Lista fechada de pontos `{xM, zM, widthM}` |
| `curbs` | API-0001 | Lista de trechos de zebra `{side, fromLapM, toLapM, widthM}` |
| `side` | API-0001 | `LEFT`, `RIGHT`, no sentido de corrida; "esquerda" e "direita" no arquivo da réplica |
| `barriers` | API-0001 | Lista de barreiras, cada uma uma poligonal `points` de pontos `{xM, zM}` |
| `osmDerived` | API-0001 | Booleano: o arquivo deriva de dado OpenStreetMap |
| `trackDataStatus` | API-0001 (de `race-lap-validation`) | `COMPLETE`, `INCOMPLETE`, `UNSUPPORTED_SCHEMA`, `UNREADABLE` |
| `options` | API-0002 | As duas entradas do catálogo do treino, `{trackId, trackVersion, displayName, displayLengthM, osmCredit}` |
| `sessionState` | API-0002, [RULE-0003](rules/RULE-0003-sessao-de-treino-e-selecao-de-pista.md) | `NO_SESSION`, `LOADING`, `READY`, `FAILED` |
| `TRACK_VERSION_MISMATCH` | API-0002 | Código de `selectTrainingTrack`: o arquivo lido não tem o `trackId` pedido ou o `trackVersion` da entrada do catálogo |
| `wheelSurfaces` | [API-0003](api/API-0003-contato-do-kart-com-a-pista.md) | Lista de 4 valores `ASPHALT`, `CURB`, `GRASS`, na ordem dianteira esquerda, dianteira direita, traseira esquerda, traseira direita |
| `curbWheelCount` | API-0003 | Quantas rodas estão em `CURB`, de 0 a 4 |
| `wheelGripPc` | API-0003 | Aderência de cada roda como fração da do mesmo pneu no asfalto |
| `beyondTrackEdgeM` | API-0003 | Distância da posição do kart além da borda da pista; 0 sobre a pista |
| `barrierContact` | API-0003 | Verdadeiro só no passo em que o kart entra em contato com uma barreira |
