---
title: Visão geral — pista Kart Park
feature: pista-kart-park
stage: fspec
status: validated
version: 2.0.0
sources: []
---

# Visão geral

## O que é especificado

Esta especificação funcional diz o que o Kartle faz para ter a sua primeira pista real, a **Kart Park**
(São José dos Pinhais, PR), jogável no treino ao lado da pista sintética: o seletor de pista da tela
inicial, o arquivo de pista gerado offline a partir da réplica não oficial (linha central de retas e arcos,
largura fixa de 7,0 m, chegada, setores em retas, marcadores, as 22 zebras da réplica e a barreira),
publicado como `kart-park` `trackVersion` 2 com o arquivo da versão 1 mantido igual e fora do seletor, as
regras de superfície e de colisão que a simulação aplica nele, o retorno da zebra (vibração em
`web-mobile`, som em `web-desktop`), o crédito OpenStreetMap/ODbL com o nome "réplica não oficial" e o
acabamento visual de kartódromo da Kart Park (faixa branca de borda, zebra com relevo, barreira de pneus e
grama em tons de verde), que é só desenho e acompanha o traçado da versão 2. A base é o conjunto de
requisitos validado em `200 Requirements/230 Output/pista-kart-park/` (US-0001 a US-0007, NFR-0001 a
NFR-0010 e NFR-0012 a NFR-0014, com NFR-0011 retirado; changelog da rodada 4, de 2026-11-06; seed
`revision: 3`, de 2026-11-06; validação `req-validation-20261106-1741`, SUCCESS), que já carrega as
decisões do dono do produto de 2026-10-22, de 2026-11-03 e de 2026-11-06 (`DOMAIN/DEC-01` a
`DOMAIN/DEC-13`, rótulos definidos em `01-context.md` daquele conjunto). Todo número usado aqui vem desses
requisitos, que o tomaram das medições do seed.

O produto não tem servidor, conta nem sessão no MVP (RNF08, RNF10). Os contratos de `api/` são contratos
em processo dentro do navegador e nos ensaios, únicos para os dois canais, e não endpoints de rede; o
único papel é `player` (anônimo). Nomes de campo em `camelCase` plano com a unidade no sufixo (D-FS-06).

## Por canal

| Canal | O que esta especificação fixa |
|---|---|
| `web-desktop` | Seletor com as duas pistas, Kart Park (versão 2) selecionada ao abrir; pilotagem pelo teclado; zebras e barreira desenhadas, com o acabamento na Kart Park; retorno da zebra só pelo som, com o som ligado; crédito no seletor e no resultado da volta do treino |
| `web-mobile` | O mesmo seletor, a mesma pista, o mesmo acabamento com as mesmas medidas e as mesmas regras; pilotagem por inclinação e toque, ou só toque com estado visível sem sensor ou sem permissão (I4); retorno da zebra pela vibração de 20 ms a cada 0,25 s, se o navegador permitir; o som da zebra é permitido e não exigido; o mesmo crédito |
| Preparo offline (Curador do catálogo) | Sem canal de jogo: gera o arquivo de pista da Kart Park a partir do arquivo da réplica, verifica-o e o publica como `trackVersion` 2, sem tocar no arquivo da versão 1, só em staging até a decisão sobre a licença Esri |

Geometria, largura, zebra, barreira, setores, marcadores, aderência e colisão são idênticos nos dois
canais e decididos na simulação a partir do dado da pista (I2). Os canais diferem só no adaptador de
controle e no retorno da zebra.

## Mapa do conjunto

| Parte | Onde |
|---|---|
| Funcionalidades | `features/FEAT-0001` (seletor de pista no treino), `FEAT-0002` (forma, largura e versão do arquivo de pista), `FEAT-0003` (setores, chegada, marcadores e validação da volta), `FEAT-0004` (barreira nos trechos quase encostados), `FEAT-0005` (zebra com efeito), `FEAT-0006` (crédito, nome e comprimento), `FEAT-0007` (requisitos transversais), `FEAT-0008` (acabamento visual da Kart Park) |
| Fluxos | `flows/FLOW-0001` (abertura do jogo, escolha e troca de pista), `FLOW-0002` (passo de simulação na Kart Park e retorno da zebra), `FLOW-0003` (preparo offline, verificação e publicação do arquivo de pista) |
| Contratos | `api/API-0001` (dado de pista com linha central, larguras, zebras e barreiras), `API-0002` (catálogo e seleção da pista do treino), `API-0003` (contato do kart com a pista: superfície por roda, borda da pista e barreira) |
| Telas | `screens/SCR-0001` (tela inicial com o seletor de pista), `SCR-0002` (crédito no resultado da volta do treino), `SCR-0003` (Kart Park na tela de corrida e retorno da zebra) |
| Regras | `rules/RULE-0001` (superfície, borda da pista e obstáculos), `RULE-0002` (geometria e verificações do arquivo de pista gerado), `RULE-0003` (sessão de treino e seleção de pista), `RULE-0004` (retorno da zebra), `RULE-0005` (versão e publicação da pista), `RULE-0006` (acabamento visual da Kart Park) |

O índice (`00-index.md`) e a matriz de rastreabilidade (`99-traceability.md`) são gerados pelo gate e não
são escritos à mão.

## Camadas (I2)

A forma da pista, a superfície sob cada roda, a aderência na zebra, a colisão com a barreira, os setores,
os marcadores e o corte são decididos na simulação, a partir do arquivo de pista; a apresentação só
desenha a pista e exibe o estado, e os adaptadores de controle só entregam o `Input` normalizado (D-FS-05,
NFR-0007). O retorno da zebra (vibração e som) é efeito da apresentação disparado pelo estado da
simulação, nunca uma regra de pista. O acabamento visual (faixa de borda, relevo da zebra, barreira de
pneus, tons de grama) também é só da apresentação: a simulação não o lê, e a mesma sequência de `Input` dá
a mesma volta na versão 2 com e sem ele desenhado (NFR-0013,
[RULE-0006](rules/RULE-0006-acabamento-visual-da-kart-park.md)). O preparo do arquivo é offline e fica
fora do cliente (I10): o jogo não suaviza, não converte e não edita pista.

## Contratos existentes nomeados, não redefinidos

| Contrato | Dono | O que este conjunto faz com ele |
|---|---|---|
| Dado de pista (`readTrackData`, `schemaVersion`, `trackId`, `trackVersion`, `direction`, `startPosition`, `finishLine`, `sectorLimits`, `markers`, `cutDistanceM`, `cutDurationMs`, `trackDataStatus`) | `race-lap-validation` (API-0003 daquele conjunto) | Acrescenta a versão de esquema 3, com linha central, larguras, zebras, barreiras e indicação de dado OSM ([API-0001](api/API-0001-dado-de-pista-com-geometria-zebras-e-barreiras.md)); a versão 2 continua lida como hoje. As duas versões publicadas da Kart Park estão no esquema 3 |
| Volta (`startLap`, `getLapState`, `getLapResult`, `lapKind`, `lapValidity`, `invalidReason`, `lapMs`, `sectorMs`, `challengeNumber`) e as telas de início de volta e de corrida, com o painel "Resultado da volta do treino" e a ação "encerrar treino" | `race-lap-validation` | Usados sem mudança; este conjunto acrescenta o seletor à tela de início de volta, o crédito ao painel do resultado da volta do treino e o desenho da Kart Park à tela de corrida. Toda volta desta feature é `TRAINING` (REQ-FEAT-0001-11): no treino de `race-lap-validation` as voltas seguem uma após a outra, o resultado de cada uma aparece nesse painel sem parar o jogo, e o treino termina só pela ação "encerrar treino", que volta à tela inicial; a tela de resultado da volta daquele conjunto é só da volta oficial e da de reconhecimento, que esta feature não oferece |
| Telemetria de dirigibilidade (`getHandlingTelemetry`, `simStepCount`, `surface`, `wallContact`) | `dirigibilidade` (API-0001 daquele conjunto) | Lida sem mudança de nome, valor ou significado; a superfície por roda com a zebra e o contato com a barreira são campos novos de [API-0003](api/API-0003-contato-do-kart-com-a-pista.md) |
| `step(state, input, dt)`, `STEP`, `Input` | contrato de passo (I8) | Inalterados (NFR-0008) |

## Decisões de forma desta especificação

- **Esquema 3 do dado de pista.** O arquivo da Kart Park declara `schemaVersion` 3, que traz a linha
  central com a largura de cada ponto, as zebras e as barreiras. O arquivo da pista sintética continua na
  versão 2, sem nenhuma mudança (NFR-0009; nenhum critério muda a pista sintética), e continua lido como
  hoje, com a geometria existente. É mudança versionada com leitor da versão anterior (I3, I5), e não
  aditiva, porque um leitor da versão 2 que ignorasse a linha central desenharia a Kart Park com a
  geometria errada em silêncio; com a versão nova, ele rejeita o arquivo de forma visível
  (`UNSUPPORTED_SCHEMA`).
- **Duas versões publicadas, uma no seletor.** A réplica é a Kart Park `trackVersion` 2, um arquivo novo
  com o mesmo `trackId`; o arquivo da versão 1 continua publicado, byte a byte igual (NFR-0014). A entrada
  `kart-park` do catálogo do treino declara o `trackVersion` que carrega (2), e a seleção confere o arquivo
  lido com ela: um arquivo de outra versão não abre sessão (`TRACK_VERSION_MISMATCH`). Assim nenhuma opção
  inicia treino com a versão 1 (AC-US-0001-08, AC-US-0001-09;
  [API-0002](api/API-0002-catalogo-e-selecao-da-pista-do-treino.md)).
- **A régua da réplica.** A `centerline` é a linha da réplica expressa nos eixos do jogo com a origem do
  arquivo da réplica (leste = +x, norte = −z), sem nova suavização: o ponto 0 gerado fica a no máximo 0,10 m
  do ponto 0 da réplica, a linha de largada dela, e todo ponto gerado a no máximo 0,10 m da linha dela
  (AC-US-0002-06). Por isso as distâncias de volta que o arquivo da réplica declara (início e fim de cada
  zebra e de cada elemento) são lidas na `centerline`, a partir do ponto 0, sem conversão; é o que torna
  decidíveis os trechos de zebra declarados (AC-US-0005-02) e os limites de setor em retas
  (AC-US-0003-12). Os limites de setor ficam no ponto da `centerline` de distância de volta mais próxima de
  204,9 m, 354,9 m e 534,7 m (AC-US-0003-02). Um trecho que os requisitos dão como "≈ *a*–*b* m", com os
  extremos arredondados ao metro, é lido com meio metro de cada lado
  ([RULE-0002](rules/RULE-0002-geometria-e-verificacoes-do-arquivo-de-pista.md)).
- **A zebra fica fora do asfalto.** Cada zebra é uma faixa encostada na borda do asfalto, do lado
  declarado, para fora. Assim o asfalto continua com 7,0 m de largura em todo ponto (AC-US-0002-05), e a
  grama é o que fica fora do asfalto e da zebra, como o glossário dos requisitos a define.
- **Borda da pista.** A pista é o asfalto mais a zebra (a zebra conta como pista, AC-US-0005-04). A
  distância do corte e a saída de pista são medidas a partir da borda da pista: a borda do asfalto ou,
  onde houver zebra, a borda externa dela ([RULE-0001](rules/RULE-0001-superficie-borda-da-pista-e-obstaculos.md)).
- **Linhas transversais.** Linha de chegada, limites de setor e marcadores atravessam a pista no seu
  ponto, ao longo da normal, e se estendem `cutDistanceM` além da borda da pista de cada lado, parando
  antes de uma barreira ou de outra parte da pista. Um kart dentro da distância que não é corte cruza todas
  elas; um atalho pela grama mais largo que isso pula marcadores (AC-US-0003-05, `DOMAIN/DEC-10`).
- **Obstáculos da Kart Park.** Os únicos obstáculos da Kart Park são as barreiras declaradas no seu
  arquivo. Um muro derivado da linha central, como o da pista sintética, ficaria na grama entre partes da
  pista com mais de 6 m de grama, o que AC-US-0004-02 proíbe.
- **Catálogo do treino.** O nome exibido, o comprimento exibido (691 m), a versão carregada e a indicação
  de crédito OSM ficam no catálogo das pistas do seletor
  ([API-0002](api/API-0002-catalogo-e-selecao-da-pista-do-treino.md)), não no arquivo de pista: o crédito
  tem de aparecer com a Kart Park selecionada mesmo se o arquivo dela não puder ser lido (AC-US-0006-01 a
  AC-US-0006-03), e nome e comprimento exibidos não estão entre as mudanças que exigem versão nova da pista
  (NFR-0006). O arquivo de pista declara `osmDerived`, a proveniência do dado (I6).
- **Acabamento só na Kart Park, calculado do dado que já existe.** O acabamento é desenhado quando a pista
  da sessão é `kart-park`, a partir de `centerline`, `curbs` e `barriers` da versão 2, sem campo novo em
  nenhum contrato: a simulação, que lê só o arquivo, é a mesma com e sem ele (NFR-0013), e a pista
  sintética fica com a aparência de antes (AC-US-0007-16).
- **Face de colisão da barreira.** A barreira do arquivo é uma poligonal sem espessura
  ([API-0001](api/API-0001-dado-de-pista-com-geometria-zebras-e-barreiras.md)); a face de colisão é, de
  cada um dos dois lados, a superfície em que o kart bate e para (AC-US-0004-04, AC-US-0004-05), e não a
  própria poligonal. A face dos pneus desenhados fica a no máximo 0,05 m dessa superfície, do mesmo lado
  (AC-US-0007-11). Este conjunto não fixa a distância entre a superfície e a poligonal: é de projeto, e o
  acabamento não a muda, porque mudá-la mudaria a trajetória (NFR-0013), nem muda o arquivo de pista.
- **Retorno da zebra em tempo simulado.** O intervalo de 0,25 s entre pulsos de vibração e o intervalo
  entre repetições do som são contados em passos de `STEP` (I8, I9): com a simulação suspensa (pausa,
  perda de foco, perda do sensor), nenhum pulso ou repetição novo começa.
- **Textos.** O nome da Kart Park, o crédito e o rótulo "Pista sintética" são exibidos em português nos
  dois idiomas do jogo: os critérios fixam o nome e o crédito sem condição de idioma, e os requisitos
  dispensaram o idioma pt/en nesta feature. Os demais textos da tela inicial e do resultado da volta do
  treino são os de `race-lap-validation`, nos dois idiomas, sem mudança.
- **Som da zebra em `web-mobile`.** Permitido e não exigido (MAY): os requisitos o declaram fora do que
  este conjunto exige, sem proibi-lo (US-0005, Canais).

## Lacunas deliberadas

Os requisitos não fixam os pontos abaixo; nenhum critério os pede, e esta especificação não os decide nem
os inventa:

| Ponto | Situação |
|---|---|
| Largura lateral de cada zebra | O arquivo da réplica declara só o lado e o trecho de volta de cada zebra. O arquivo gerado declara a largura de cada uma (`widthM`, maior que 0); o valor é dado do preparo offline, decidido no D-Spec com a evidência registrada |
| Como os pontos da réplica chegam à `centerline` | Manter os pontos da réplica, ou outra amostragem da mesma linha, é decisão do preparo; o que se verifica é o resultado: ponto 0 e todo ponto a no máximo 0,10 m da réplica, volta fechada, 690,7 m ± 1 % e 7,0 m de largura |
| Intervalo entre repetições do som da zebra e o seu timbre | `DOMAIN/DEC-11` diz "ruído curto e grave que se repete"; o intervalo e o som são fixados no D-Spec, constantes; o que se exige é repetir com roda na zebra, não começar repetição sem roda na zebra, não tocar com o som desligado e ser diferente dos outros sons |
| Texto do crédito da Esri | Depende dos termos de uso que a decisão do dono do produto citar; até ela, a Kart Park, em qualquer versão, não vai para produção (NFR-0012) |
| Se o link do crédito abre na mesma aba ou em outra | Qualquer das duas preserva os critérios: o treino não persiste dado (US-0001) e a perda de foco pausa a volta como hoje |
| Cerca ou muro no perímetro externo da Kart Park | Nenhum: o cenário além de asfalto, zebra, grama e barreiras é de outra feature (`SEED/FE-05`) |
| Se o arquivo da versão 1 é entregue ao navegador | Os requisitos exigem só que ele continue publicado no repositório, igual (NFR-0014), e que nenhuma opção o carregue (AC-US-0001-09); entregá-lo ou não é de projeto |
| Detalhes da aparência do acabamento | Os requisitos fixam a largura da faixa, as alturas do relevo e da pilha de pneus, a distância dos pneus à face de colisão e a faixa de luminância dos tons; o perfil do relevo entre as duas bordas da zebra, as cores da zebra, o diâmetro e a contagem dos pneus, quantos tons de grama além de 2 e o padrão que os distribui pelo chão são decisão de design |

## Fora do escopo

Idêntico ao dos requisitos:

- As outras duas pistas reais da etapa 3, um catálogo de pistas e o calendário do desafio diário
  (`SEED/FE-01`).
- Elevação do terreno (`SEED/FE-02`, I10).
- Medalhas e cores de setor (`SEED/FE-03`).
- Recorde da pista real e qualquer comparação com tempos reais (`SEED/FE-04`).
- O cenário além de asfalto, zebra, grama e barreiras, como árvores, tribuna e boxes (`SEED/FE-05`).
- Zebra com relevo na física: o kart subir ou trepidar na zebra (`SEED/FE-06`); o relevo é só desenho.
- Chão com foto de satélite ou textura baixada da rede (`SEED/FE-07`).
- Aproximar o traçado dos 750 m oficiais (`SEED/FE-08`).
- Escolher a versão 1 da Kart Park no jogo: ela deixa o seletor (`SEED/FE-09`).
- O canal `remote-wheel` (pós-MVP, I10) e um editor de pista no jogo (I10).

## Como a especificação é verificada

Os critérios observados no arquivo de pista gerado são verificados lendo o arquivo e, quando indicado, o
arquivo da réplica ([RULE-0002](rules/RULE-0002-geometria-e-verificacoes-do-arquivo-de-pista.md)); os
observados no estado da simulação, avançando a simulação com `STEP` sem renderização (NFR-0007, I9); os
observados na tela, no som e na vibração, no estado da tela e com um registro dos pulsos e repetições
pedidos por passo; a taxa de quadros, por teste registrado nos aparelhos de referência de RNF03, com o
acabamento na tela (NFR-0002); o acabamento sem efeito na volta, avançando com `STEP` as mesmas sequências
de `Input` na versão 2 com e sem o acabamento desenhado (NFR-0013); o arquivo da versão 1 inalterado, pelo
resumo criptográfico registrado na publicação dele (NFR-0014). A pista sintética continua sendo a pista dos
ensaios automáticos de `dirigibilidade` e de `race-lap-validation` (NFR-0009); os ensaios desta feature
usam a Kart Park versão 2.
