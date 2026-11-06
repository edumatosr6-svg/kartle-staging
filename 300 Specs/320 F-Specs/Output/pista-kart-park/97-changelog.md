---
title: Registro de mudanças — pista Kart Park
feature: pista-kart-park
stage: fspec
status: validated
version: 2.0.0
sources: []
---

# Registro de mudanças

## 2026-10-22 — rodada 1, Mode A

**O que mudou**

- Conjunto gerado do zero a partir dos requisitos validados de `200 Requirements/230 Output/pista-kart-park/`
  (US-0001 a US-0006, NFR-0001 a NFR-0012, versão 1.0.0; seed `revision: 1`; validação
  `req-validation-20261022-1428`, SUCCESS), com as decisões de `DOMAIN.md` de 2026-10-22 que os requisitos
  já citam como `DOMAIN/DEC-01` a `DOMAIN/DEC-11`.
- Sete funcionalidades (`FEAT-0001` a `FEAT-0007`), três fluxos (`FLOW-0001` a `FLOW-0003`), três contratos
  (`API-0001` a `API-0003`), três telas (`SCR-0001` a `SCR-0003`) e cinco regras (`RULE-0001` a
  `RULE-0005`), mais `01-overview.md`, `02-glossary.md` e `98-divergences.md` (sem linhas).
- Todo critério `AC-*` dos requisitos (53) é realizado por ao menos um requisito: US-0001 em `FEAT-0001`,
  US-0002 em `FEAT-0002`, US-0003 em `FEAT-0003`, US-0004 em `FEAT-0004`, US-0005 em `FEAT-0005`, US-0006 em
  `FEAT-0006`. Todo NFR (12) é realizado: NFR-0001 e NFR-0006 em `FEAT-0002`; NFR-0005 e a segunda linha de
  NFR-0012 em `FEAT-0006`; NFR-0002, NFR-0003, NFR-0004, NFR-0007 a NFR-0011 e a primeira linha de NFR-0012
  em `FEAT-0007`.
- `00-index.md` e `99-traceability.md` não foram escritos: o gate os gera com `lint_artifacts.py --emit`.

**Decisões do autor para esta execução, aplicadas**

- Seed revisado pelo dono do produto em 2026-10-22, todas as decisões fechadas em `DOMAIN.md`, todo número
  medido: os números entram como os requisitos os dão, sem nova medição.
- A dúvida sobre a licença Esri (`SEED/RI-01`) bloqueia só a promoção para produção e nenhuma etapa de
  especificação: `FEAT-0007` (requisito 13), `FEAT-0006` (requisito 14) e `RULE-0005`.
- O código desta feature só começa depois que `dirigibilidade` passar nos testes: `FEAT-0007` (requisito
  12), com a dependência a registrar no D-Spec, como o autor pediu, e a menção em `01-overview.md`.
- A pista sintética continua sendo a pista dos ensaios automáticos: `FEAT-0007` (requisito 10); o arquivo
  dela continua em `schemaVersion` 2, sem mudança (`FEAT-0002`, requisito 15).

**Decisões de forma registradas**

- Não existe API de rede no MVP (diretrizes do estágio). Os contratos de `api/` são em processo, com o único
  papel `player` (anônimo), erros como códigos e idempotência por leitura pura ou por estado final. Nomes em
  `camelCase` com a unidade no sufixo (D-FS-06), no lugar do `snake_case` padrão da habilidade do gerador:
  a diretriz do projeto prevalece.
- O dado de pista da Kart Park passa para `schemaVersion` 3, com `centerline`, `curbs`, `barriers` e
  `osmDerived`; o contrato de dado de pista de `race-lap-validation` é nomeado e estendido, não redefinido
  nem editado. A mudança é versionada (I3, I5) porque um leitor da versão 2 desenharia a Kart Park com a
  geometria errada em silêncio.
- Correspondência por índice entre a linha original e a suavizada, que torna decidíveis AC-US-0002-05,
  AC-US-0003-02 e AC-US-0005-02 (leitura dada como `info` em ISSUE-05 e ISSUE-06 da validação dos
  requisitos).
- Borda da pista como borda externa da zebra, onde há zebra, para a saída de pista e o corte (leitura dada
  como `info` em ISSUE-03 da validação dos requisitos).
- Comparação da colisão com a barreira e com o muro no referencial local do obstáculo, a cada passo desde o
  contato (leitura dada como `info` em ISSUE-04 da validação dos requisitos).
- A zebra fica fora do asfalto (AC-US-0002-05 e a definição de grama dos requisitos); a extensão das linhas
  transversais é `cutDistanceM` além da borda da pista; a Kart Park não tem muro derivado da linha central
  (AC-US-0004-02); o retorno da zebra é contado em tempo simulado; nome, comprimento exibido e indicação de
  crédito ficam num catálogo do treino, para o crédito aparecer mesmo com o arquivo ilegível.
- O som da zebra em `web-mobile` é MAY: os requisitos o deixam fora do exigido sem proibi-lo.
- Nenhum feedback foi enviado a `race-lap-validation` nem a `dirigibilidade`: nenhum requisito delas precisa
  mudar; os acréscimos (esquema 3, superfície por roda, `barrierContact`, crédito na tela de resultado,
  seletor na tela de início de volta) são aditivos e desta feature, e os campos `surface` e `wallContact`
  de `dirigibilidade` mantêm nome, valores e significado.

**Itens fechados**: nenhum `ISSUE-<nn>` ou `FB-<nn>` (primeira geração).

**Itens recusados, com motivo**

- "Código fica na raiz do repositório" (decisão do autor para esta execução): não entra no conjunto, porque
  é localização de código, decisão de design que esta etapa não registra (proibição de decisões de design);
  cabe ao D-Spec, que lê a raiz de código.
- Lista exata dos arquivos que `dirigibilidade` congela: a decisão do autor nomeia arquivos diferentes dos
  da restrição do seed; este conjunto não nomeia módulo nem arquivo (vazamento de design) e deixa a lista
  ao D-Spec, onde a dependência é registrada.
- Largura lateral de cada zebra: os requisitos e o arquivo de origem dão só lado e trecho; o contrato exige
  o campo (`widthM` maior que 0) e deixa o valor ao preparo offline e ao D-Spec, listado em "Lacunas
  deliberadas" de `01-overview.md`.
- Janela de suavização de cerca de 12 m, intervalo e timbre do som da zebra, texto do crédito da Esri,
  aba de abertura do link do crédito, cerca no perímetro e aparência da zebra e da barreira: nenhum critério
  os fixa; ficam em "Lacunas deliberadas" de `01-overview.md`, sem valor inventado.
- Ação de voltar à tela inicial no meio da volta: não acrescentada. A tela inicial é alcançada ao abrir o
  jogo e depois da tela de resultado (navegação de `race-lap-validation`), o que basta para a troca de
  pista de US-0001; o descarte da volta em andamento ao trocar de pista fica especificado no contrato de
  seleção para qualquer caminho.
- Nome da Kart Park na tela de resultado ou no HUD: não acrescentado; nenhum critério pede, e AC-US-0006-07
  e AC-US-0006-08 valem para toda tela que exibir o nome, hoje só o seletor.
- Divergências com o sistema em execução: nenhuma registrada; esta etapa não lê a raiz de código para
  derivar comportamento (conventions §12).
- Leituras fora da lista de entrada, declaradas: `SEED.md` e `DOMAIN.md` foram consultados só para escopo,
  restrições e as decisões que os requisitos já citam; do arquivo de origem foi lida por script só a
  estrutura de chaves (nomes, sem valores), para confirmar que as zebras não declaram largura, o que os
  requisitos já indicavam; `NOTES.md` e os scripts de medição não foram lidos. Da raiz de código e dos
  conjuntos de `race-lap-validation` e `dirigibilidade` foram lidos só nomes de contratos.

## 2026-10-22 — rodada 2, Mode B (fspec-validation-20261022-1511: 5 erros, 3 avisos)

**O que mudou**

- `FLOW-0001` (1.0.1): as três mensagens do `sequenceDiagram` que tinham `;` separam os itens por vírgula
  (fecha ISSUE-01).
- `FLOW-0003` (1.0.1): a mensagem do `sequenceDiagram` que tinha `;` separa os itens por vírgula (fecha
  ISSUE-02). As mensagens do diagrama e a coluna Estado usam os valores de `publicationState` de
  `RULE-0005`: passo 8 `PREPARED`, passo 9 `VERIFIED` ou `REJECTED`, passo 10 `VERIFIED`, passo 11
  `STAGING`; a linha de promoção recusada diz que a versão fica em `STAGING` (fecha ISSUE-06). O mesmo
  conceito, nomeado em prosa ("preparada, verificada, publicada em staging, promovida a produção") na seção
  Estado de `FEAT-0002` (1.0.1), passou a usar os mesmos valores.
- `FEAT-0003` (1.0.1): REQ-FEAT-0003-15 cita AC-US-0003-10 e AC-US-0003-11, que o caso anormal de US-0003
  liga às mesmas regras da pista sintética; o critério de aceite do requisito 15 cita os mesmos (fecha
  ISSUE-03).
- `FEAT-0005` (1.0.1): REQ-FEAT-0005-16 cita AC-US-0005-07 (vibração é o retorno de `web-mobile`) e
  AC-US-0005-09 (o retorno de `web-desktop` é o som); REQ-FEAT-0005-19 cita AC-US-0005-04, AC-US-0005-05 e
  AC-US-0005-06, que o caso anormal nomeia; o critério de aceite do requisito 19 cita os mesmos (fecha
  ISSUE-04).
- `FEAT-0006` (1.0.1): REQ-FEAT-0006-10 cita AC-US-0006-01 a AC-US-0006-06, que exigem o crédito com a Kart
  Park, e leva `[DOMAIN]` com I6 (fecha ISSUE-05). REQ-FEAT-0006-03 e REQ-FEAT-0006-06 exigem o link e o
  destino sem fixar o texto em que ele está (fecha ISSUE-08); o mesmo fato estava na linha "Linha de crédito
  OSM" de `SCR-0001` (1.0.1) e de `SCR-0002` (1.0.1), que agora listam o texto, a menção e um link para o
  destino na mesma linha, como o glossário já define.
- `FEAT-0001` (1.0.1): REQ-FEAT-0001-01 exige as duas opções sem fixar a ordem (fecha ISSUE-07). O mesmo
  fato estava em `SCR-0001` (linha "Seletor de pista", "nesta ordem") e em `API-0002` (1.0.1: catálogo
  "nesta ordem", `options` "na ordem acima", "a pista da abertura é a primeira entrada"); os três deixam de
  fixar a ordem, e a pista da abertura continua a entrada `kart-park`, sempre. `API-0002` não tem
  consumidor implementado: o conjunto é desta mesma data e nunca foi validado.
- Nenhum requisito, contrato, campo, tela ou elemento de tela foi acrescentado (conventions §16).
  `00-index.md` e `99-traceability.md` não foram escritos: o gate os regenera.

**Itens fechados**: ISSUE-01, ISSUE-02, ISSUE-03, ISSUE-04, ISSUE-05, ISSUE-06, ISSUE-07, ISSUE-08.

**Itens recusados, com motivo**

- Nenhum item do relatório foi recusado.
- Decisões do autor para esta execução, repetidas da rodada 1: continuam aplicadas como lá (licença Esri só
  bloqueia a promoção para produção; o código só começa depois de `dirigibilidade` passar nos testes, com a
  dependência registrada no D-Spec; a pista sintética continua a pista dos ensaios automáticos). "Código
  fica na raiz do repositório" continua fora do conjunto pelo mesmo motivo da rodada 1: localização de
  código é decisão de design e cabe ao D-Spec.
- Sem mudança de conteúdo, carregados na versão corrente: `FLOW-0002`, `FEAT-0004`, `FEAT-0007`,
  `API-0001`, `API-0003`, `SCR-0003`, `RULE-0001` a `RULE-0005`, `01-overview.md`, `02-glossary.md`,
  `98-divergences.md` (nenhum item do relatório os atinge).

## 2026-11-03 — rodada 3, Mode A (requisitos revalidados contra o seed revision 2)

**O que mudou**

- Base: requisitos de `200 Requirements/230 Output/pista-kart-park/` com US-0001 a US-0007 e NFR-0001 a
  NFR-0014 (changelog 1.2.0; seed `revision: 2`; validação `req-validation-20261103-1900`, SUCCESS; commit
  `e321b95`). Todo id e toda especificação que a revisão 2 não toca foram mantidos com o mesmo texto.
- Novo `FEAT-0008` (acabamento visual da Kart Park): REQ-FEAT-0008-01 a REQ-FEAT-0008-24 realizam
  AC-US-0007-01 a AC-US-0007-21; REQ-FEAT-0008-25 a -27 realizam NFR-0013; REQ-FEAT-0008-28 e -29 realizam
  NFR-0014.
- Nova `RULE-0006` (acabamento visual): em que pista o acabamento é desenhado (`kart-park` sim, `synthetic`
  não), a geometria desenhada (faixa de 0,10 m, relevo de 0 m a no máximo 0,05 m, pilha de pneus de 0,9 m a
  no máximo 0,05 m da face de colisão, tons de grama por posição e por luminância relativa) e como o
  acabamento entra nas tabelas de `RULE-0001`, que não mudam (faixa de borda é asfalto; todo tom de grama é
  `GRASS`).
- `SCR-0003` (1.1.0): elementos de faixa de borda, relevo da zebra, barreira de pneus e tons de grama; a
  pista sintética sem acabamento; estados populado, offline e de sensor negado, e ações (faixa de borda,
  batida na barreira de pneus, redimensionar ou girar) com o acabamento.
- `FEAT-0007` (1.1.0): REQ-FEAT-0007-01 e -02 medem a taxa de quadros com o acabamento na tela (NFR-0002
  1.1.0). REQ-FEAT-0007-12 deixa de dizer "com a dependência registrada no D-Spec", porque NFR-0011 (1.0.1)
  retirou essa frase por não ter fonte no seed nem em `DOMAIN.md`; o mesmo fato saiu de `01-overview.md`.
  O D-Spec que já registra a dependência não fica em conflito: o requisito só deixa de exigi-lo.
- `RULE-0005` (1.1.0): o acabamento não muda o arquivo e não é versão nova (NFR-0014).
- `01-overview.md` (1.1.0): carimbo da base (acima), escopo, canais, mapa, camadas, duas decisões de forma
  (acabamento só na Kart Park, calculado do dado existente; face de colisão da barreira), lacuna da
  aparência reescrita com o que os requisitos agora fixam, fora do escopo com `SEED/FE-06` a `SEED/FE-08`,
  verificação de NFR-0013 e NFR-0014.
- `02-glossary.md` (1.1.0): acabamento, cena desenhada, faixa de borda, relevo da zebra, barreira de pneus,
  face de colisão, tom de grama, luminância relativa e revisão 2.
- Nenhum contrato de `api/` muda: o acabamento é calculado de `centerline`, `curbs`, `barriers` e do
  `trackId` da sessão, e o arquivo publicado não pode mudar (NFR-0014).
- As leituras que este conjunto já fazia e que os requisitos agora escrevem (US-0002 1.0.1 ponto
  correspondente de mesmo índice; US-0004 1.0.1 referencial local e mesmo número de passos; US-0005 1.0.1
  trecho medido na linha central original; glossário "Borda da pista") não pedem mudança: `RULE-0001`,
  `RULE-0002`, `FEAT-0002`, `FEAT-0004` e `FEAT-0005` já as especificam assim.
- Arquivos editados ou novos ficam `draft`. `00-index.md` e `99-traceability.md` regenerados pelo gate.

**Itens fechados**: nenhum `ISSUE-<nn>` (Mode A por mudança de revisão).

**Itens recusados ou deixados, com motivo**

- `FEEDBACK-01` (FB-01, do D-Spec, 2026-10-30: alinhar ao treino de voltas seguidas de `race-lap-validation`
  o texto de `SCR-0002`, `RULE-0003`, `FEAT-0003`, `FEAT-0001`, `01-overview.md` e a navegação de
  `SCR-0003` que ainda falam em volta de treino terminando em `ENDED`): não aplicado nesta rodada. Esta
  rodada regenera só o que a revisão 2 do seed muda, e o pedido foi manter intacto o que ela não toca; o
  FB-01 não muda nenhum `REQ-*` e continua em aberto para uma rodada de Mode C. A navegação de `SCR-0003`
  ficou como estava, para não deixar o conjunto meio alinhado.
- Espessura da barreira de pneus: a fileira desenhada fica com no máximo 0,05 m de cada lado da poligonal
  da barreira (AC-US-0007-11 sobre uma barreira sem espessura). Não foi dada espessura à barreira: isso
  mudaria o arquivo (NFR-0014) ou a trajetória (NFR-0013). Registrado como decisão de forma em
  `01-overview.md`.
- Perfil do relevo entre as bordas da zebra, cores da zebra, diâmetro e contagem dos pneus, número de tons
  além de 2 e o padrão de tons no chão: nenhum critério os fixa; ficam em "Lacunas deliberadas", sem valor
  inventado.
- Nenhum fluxo novo: o acabamento não acrescenta interação nem passo; `FLOW-0001` e `FLOW-0002` valem sem
  mudança.
- Sem mudança de conteúdo: `FEAT-0001` a `FEAT-0006`, `FLOW-0001` a `FLOW-0003`, `API-0001` a `API-0003`,
  `SCR-0001`, `SCR-0002`, `RULE-0001` a `RULE-0004`, `98-divergences.md`.

## 2026-11-03 — rodada 4, Mode C (FEEDBACK-01, FEEDBACK-02; avisos de fspec-validation-20261103-1908)

Nenhum `REQ-*` acrescentado, retirado ou com critério mudado; nenhum contrato de `api/` muda. Texto alinhado
aos requisitos validados (US-0007 e glossário: "Face de colisão", "Tela de resultado") e ao que
`race-lap-validation` nomeia hoje.

**O que mudou**

- `RULE-0006` (1.1.0), linha "Face dos pneus": a face de colisão é, de cada lado, a superfície em que o kart
  bate e para, e não a poligonal de `barriers`; a regra não fixa a distância entre as duas (projeto) e mede
  os 0,05 m entre a face dos pneus e essa superfície. Saiu a dedução "no máximo 0,05 m de cada lado da
  poligonal".
- `FEAT-0008` (1.1.0): critério de aceite do requisito 14 mede a face dos pneus contra a superfície de
  contato da barreira de cada lado, como REQ-FEAT-0008-14 e o RULE-0006 corrigido. REQ-FEAT-0008-24 diz
  "SHALL NOT retirar o acabamento nem nenhum dos seus quatro elementos", e o critério de aceite e a seção
  Configuração verificam exatamente isso.
- `01-overview.md` (1.2.0): decisão de forma "Face de colisão da barreira" reescrita como em RULE-0006;
  linha da dependência `race-lap-validation`, canais, mapa de telas e textos falam do painel "Resultado da
  volta do treino" e da ação "encerrar treino".
- `02-glossary.md` (1.2.0): "Face de colisão" reescrito; termo novo "Tela de resultado" (o dos requisitos;
  para a volta de treino, o painel "Resultado da volta do treino" da tela de corrida de
  `race-lap-validation`).
- `SCR-0003` (1.2.0): tons de grama com luminância relativa que difere da de `#68865b` entre 8 % e 20 %
  desse valor, com a fórmula de RULE-0006; navegação sem `ENDED`: resultado no painel, saída por
  "encerrar treino".
- `SCR-0002` (1.1.0): o crédito fica dentro do painel "Resultado da volta do treino"; entrada no cruzamento
  da chegada que encerra uma volta, com `lapPhase` `RUNNING`; estados Carregando, Vazio e Erro sem
  `ENDED`; ações "Seguir pilotando" e "Encerrar o treino" no lugar de "Sair da tela"; navegação.
- `SCR-0001` (1.0.2): entrada e retorno pela ação "encerrar treino", não pela tela de resultado.
- `FLOW-0001` (1.0.2): diagrama e passos 8 a 10 com as voltas seguidas do treino, o painel e "encerrar
  treino" (`ENDED` só no fim do treino).
- `RULE-0003` (1.0.1), `FEAT-0003` (1.0.2), `FEAT-0001` (1.0.2): "volta já `ENDED`", "a volta termina no
  passo" (corte), "na tela de resultado" e "depois da tela de resultado" alinhados ao treino: o corte
  invalida sem encerrar, o resultado aparece no painel, o seletor é alcançado na abertura e depois de
  "encerrar treino".

**Itens fechados (resolvidos nesta rodada)**

- `FEEDBACK-02` FB-01: resolvido. A leitura do D-Spec (superfície de contato a 0,1 m da poligonal, fileira
  entre 0,073 m e 0,12 m) não foi trazida para cá: a distância é de projeto e fica no D-Spec.
- `FEEDBACK-01` FB-01: resolvido, sem mudar `REQ-*`; a resolução vem do glossário dos requisitos ("Tela de
  resultado": exibida ao fim de uma volta, com o tempo da volta) e da regra de que a volta na Kart Park
  segue as de `race-lap-validation` (US-0003, `SEED/US-3`). A localização do crédito é a que o D-Spec
  adotou (ADR-0007 daquele conjunto).
- `ISSUE-01` e `ISSUE-02` de fspec-validation-20261103-1908 (avisos): aplicados como o relatório espera.

**Itens recusados ou deixados, com motivo**

- `FEAT-0006` e `API-0002` continuam dizendo "tela de resultado": é o termo dos requisitos (AC-US-0006-04 a
  -06, NFR-0005), agora definido em `02-glossary.md` para a volta de treino; trocá-lo mudaria o texto dos
  requisitos realizados.
- `SCR-0002` mantém id, título e nome de arquivo: renomear quebraria as referências de outros estágios sem
  ganho de significado.
- Arquivos editados ficam `draft`. `00-index.md` e `99-traceability.md` regenerados pelo gate.

## 2026-11-06 — rodada 5, Mode A (requisitos revalidados contra o seed revision 3)

**O que mudou**

- Base: requisitos de `200 Requirements/230 Output/pista-kart-park/` com US-0001 a US-0007, NFR-0001 a
  NFR-0010 e NFR-0012 a NFR-0014 (changelog da rodada 4; seed `revision: 3`, de 2026-11-06; validação
  `req-validation-20261106-1741`, SUCCESS; commit `8c96912`). A revisão 3 troca o traçado pela réplica não
  oficial (`replica/kart-park-replica.json`), publicada como `kart-park` `trackVersion` 2; a versão 1 sai do
  seletor e o seu arquivo fica byte a byte igual (`DOMAIN/DEC-13`). Ids mantidos onde o comportamento
  sobrevive; todo arquivo do conjunto voltou a `draft`.
- `FEAT-0001` (2.0.0): novos REQ-FEAT-0001-15 (a Kart Park carrega o `trackVersion` 2 que a entrada do
  catálogo declara, AC-US-0001-08) e REQ-FEAT-0001-16 (nenhuma opção abre sessão com o `trackVersion` 1;
  arquivo de outra versão termina em `TRACK_VERSION_MISMATCH`, AC-US-0001-09); linha da versão 1 no
  repositório e da versão errada no comportamento.
- `FEAT-0002` (2.0.0): 01 passa a `trackVersion` 2; 05 a 683,793–697,607 m; 07 fixa a mesma origem do
  arquivo da réplica (`xM` = *x*, `zM` = −*y*); 09 a `widthM` 7,0 em todo ponto; 10 a no máximo 0,10 m da
  linha central da réplica; 11 à curva de raio 8,8 m perto de 216 m; 18 cita a versão 2 como versão nova.
  03 retirado (correspondência por índice com o traçado da versão 1). Novos 19 (ponto 0 a no máximo 0,10 m
  do ponto 0 da réplica, régua das distâncias do arquivo da réplica), 20 e 21 (arquivo da versão 1 no
  repositório, byte a byte igual, NFR-0014 2.0.0).
- `FEAT-0003` (2.0.0): 02 com os limites perto de 204,9 / 354,9 / 534,7 m, medidos na `centerline`; 06 sem
  AC-US-0003-09, ligado a AC-US-0003-05 e `DOMAIN/DEC-10`; 12 retirado com AC-US-0003-09; novo 16 (cada
  limite interno dentro de um elemento reta da réplica, AC-US-0003-12); comportamento com os trechos
  ≈ 369–406 m e ≈ 595–624 m e o atalho com mais de 6 m de grama.
- `FEAT-0004` (2.0.0): 01 com os trechos ≈ 369–406 m e ≈ 595–624 m, lidos como em `RULE-0002`; resumo e
  comportamento com a grama mínima de 1,28 m e sem os atalhos de 12 a 26 m.
- `FEAT-0005` (2.0.0): 01 com 22 trechos, um a um os da réplica; 02 com o lado e `de_m`/`ate_m` da réplica
  lidos na `centerline`; 03 com o asfalto de 7,0 m; novo 20 (nenhum trecho cruza a largada,
  AC-US-0005-13); linha da zebra dividida trocada pela de "zebra perto da largada".
- `FEAT-0006` (2.0.0): nome "Kart Park — São José dos Pinhais (réplica não oficial)" e "691 m" (07, 08);
  comportamento com o comprimento de 690,7 m ± 1 %, a diferença para os 750 m oficiais e a licença Esri em
  qualquer versão.
- `FEAT-0007` (2.0.0): 12 retirado com NFR-0011; 13 vale para qualquer versão (NFR-0012 1.1.0); resumo,
  comportamento e critérios sem a ordem de entrega.
- `FEAT-0008` (2.0.0): 08 compara a versão 2 com e sem o relevo desenhado (AC-US-0007-07 1.2.0); 25 a 27
  comparam a versão 2 com e sem o acabamento desenhado (NFR-0013 2.0.0); 28 e 29 retirados com a forma
  antiga de NFR-0014 (o que sobrevive dela está em FEAT-0002, requisitos 20 e 21); resumo com o acabamento
  sobre o traçado da versão 2 (`SEED/RE-08`).
- `API-0001` (2.0.0): `trackVersion` 2 para a réplica e 1 mantida; `centerline` e `curbs` da Kart Park
  versão 2 (réplica nos eixos do jogo, 0,10 m, 7,0 m, 22 zebras); linha de compatibilidade da versão 2, sem
  campo novo, renomeado ou retirado.
- `API-0002` (2.0.0): campo opcional `trackVersion` na entrada do catálogo (padrão ausente, neutro para a
  pista sintética; 2 na Kart Park); novo código `TRACK_VERSION_MISMATCH`; valores de `displayName` e
  `displayLengthM` da Kart Park trocados ("réplica não oficial", 691), com a linha de compatibilidade que
  diz que os campos mantêm nome, unidade e significado.
- `RULE-0002` (2.0.0): medidas e verificações refeitas sobre a réplica. V01 passa de "correspondência" a
  "ponto 0 da réplica"; V03, V06, V07, V08, V09, V12, V13, V14 e V16 com os números da revisão 3; novos V19
  (limites em retas) e V20 (zebra sem cruzar a largada); "trecho aproximado" lido com meio metro de cada
  lado dos extremos arredondados ao metro.
- `RULE-0003` (1.1.0): `LOADING` → `READY` exige o `trackId` e o `trackVersion` da entrada; `LOADING` →
  `FAILED` também com `TRACK_VERSION_MISMATCH`; regra da sessão sempre na versão 2.
- `RULE-0005` (2.0.0): duas versões publicadas; a versão 2 passa pelo mesmo ciclo; a versão 1 não é
  editada, renomeada nem apagada; o catálogo oferece só a versão 2; licença Esri em qualquer versão; o
  acabamento é desenhado sobre a versão 2. Sai "suavizar de novo".
- `RULE-0006` (2.0.0): o acabamento acompanha a versão 2; AC-US-0007-07 e NFR-0013 comparam com e sem o
  desenho; a seção "Dado de pista" deixa de citar NFR-0014.
- `RULE-0001` (1.0.1): "linha central suavizada" passa a "`centerline` do arquivo de pista gerado".
- `FLOW-0001` (1.1.0): leitura e conferência do `trackVersion` 2; "691 m"; linha de `TRACK_VERSION_MISMATCH`.
- `FLOW-0003` (2.0.0): preparo a partir do arquivo da réplica, sem nova suavização, com 7,0 m, as 22 zebras,
  `trackVersion` 2 e publicação ao lado do arquivo da versão 1, que não é tocado.
- `SCR-0001` (1.1.0): nome e "691 m"; nenhuma opção para a versão 1; estado de erro com
  `TRACK_VERSION_MISMATCH`. `SCR-0003` (1.3.0): desenho da versão 2, asfalto de 7,0 m.
- `01-overview.md` (2.0.0): base, escopo, canais e verificação da revisão 3; decisões de forma "duas versões
  publicadas, uma no seletor" e "a régua da réplica" no lugar de "correspondência por índice"; lacunas sem
  a suavização, com a amostragem dos pontos e a entrega do arquivo da versão 1 ao navegador; fora do escopo
  com `SEED/FE-09`; sai o parágrafo da ordem de entrega (NFR-0011).
- `02-glossary.md` (2.0.0): réplica não oficial, traçado da versão 1, arquivo da réplica, elemento, linha
  central da réplica, trecho aproximado, curva mais fechada, zebras por regra, Esri World Imagery, revisão 3,
  `trackVersion` e `TRACK_VERSION_MISMATCH`; saem traçado aproximado, arquivo de origem, linha central
  original e suavizada, ponto correspondente, distância na linha original e índice fracionário.
- `API-0003`, `RULE-0004`, `FLOW-0002`, `SCR-0002`: só voltaram a `draft`, sem mudança de texto; nada neles
  depende do traçado. `98-divergences.md` (1.1.0): nota de que a revisão 3 é a mudança especificada, não
  divergência. `00-index.md` e `99-traceability.md` regenerados pelo gate.

**Tabela de migração** (conventions §17)

| Item | Antes | Agora | Motivo |
|---|---|---|---|
| REQ-FEAT-0002-03 | Ponto *i* gerado = ponto *i* da origem (684 pontos) | Retirado; o que tornava decidível passa a REQ-FEAT-0002-19 | A revisão 3 não deriva a pista do traçado da versão 1 |
| REQ-FEAT-0003-12 | Volta pelo atalho da curva 4 é inválida | Retirado | AC-US-0003-09 retirado dos requisitos (rodada 4 de req); a regra continua coberta por REQ-FEAT-0003-05, -06 e -08 |
| REQ-FEAT-0007-12 | Código só depois de `dirigibilidade` | Retirado | NFR-0011 retirado: a restrição saiu do seed na revisão 3 |
| REQ-FEAT-0008-28 | Arquivo publicado igual ao de antes da revisão 2 | Retirado; a parte que sobrevive é REQ-FEAT-0002-21 | NFR-0014 2.0.0 exige só o arquivo da versão 1 igual |
| REQ-FEAT-0008-29 | Arquivo publicado com `trackVersion` 1 | Retirado; REQ-FEAT-0002-01 (versão 2) e REQ-FEAT-0002-20 (versão 1 no repositório) | NFR-0006 2.0.0 e NFR-0014 2.0.0 |
| RULE-0002 V01 | Correspondência por índice | Ponto 0 da réplica | Mesmo motivo de REQ-FEAT-0002-03 |
| Demais REQ e verificações citados acima | Números da revisão 2 | Números da revisão 3, mesmo id | O comportamento sobrevive; só o fato medido mudou |

As retiradas seguem itens que os requisitos validados já retiraram (AC-US-0003-09, NFR-0011, a forma antiga
de NFR-0014) ou que a revisão 3 do seed, escrita pelo dono do produto, tornou sem objeto. O §17 pede
aprovação humana explícita para retirar uma verificação: a base dessas retiradas é a revisão 3 do seed e a
rodada 4 validada dos requisitos, e a confirmação do dono do produto fica pedida no relatório desta rodada.

**Itens fechados**: nenhum `ISSUE-<nn>` ou `FB-<nn>` (Mode A por mudança de revisão).

**Itens recusados ou deixados, com motivo**

- Fixar que a `centerline` tem exatamente os 691 pontos da réplica: recusado. AC-US-0002-06 aceita até
  0,10 m de distância, e exigir os mesmos pontos seria pedir mais que o critério; a régua comum fica garantida
  pelo ponto 0 (REQ-FEAT-0002-19) e pela distância de 0,10 m.
- Verificação da cobertura da barreira sobre a volta inteira, sem os trechos ≈ 369–406 m e ≈ 595–624 m:
  recusada. AC-US-0004-01 fala desses dois trechos, e AC-US-0004-02 já proíbe barreira entre partes com mais
  de 6 m de grama; a leitura de meio metro de cada lado dos extremos arredondados cobre o "≈" sem número novo.
- Critério próprio para a regra das zebras (`SEED/RD-14`) ou para as transições de 5 m: não acrescentado,
  pelo mesmo motivo dos requisitos (rodada 4 de req): o arquivo da réplica as carrega, e V12 copia as 22
  zebras declaradas.
- Um código de erro novo para a versão errada foi preferido a reaproveitar `TRACK_DATA_UNREADABLE`: o arquivo
  da versão 1 é legível, e chamá-lo de ilegível mudaria o significado de um código existente (política de
  contrato estrito, regra 5).
- Leitura de entrada: além da pasta de requisitos e de `320 F-Specs/Input/`, esta rodada leu
  `200 Requirements/220 Input/pista-kart-park/DOMAIN.md` por instrução do chamador. `SEED.md` e o arquivo da
  réplica foram abertos só para conferir que os trechos ≈ 369–406 m e ≈ 595–624 m e as distâncias dos
  limites de setor dos requisitos batem com a réplica; nenhum número deles entrou no conjunto além dos que
  os requisitos já trazem.

## 2026-11-06 — rodada 6, Mode B (fspec-validation-20261106-1803: 1 erro, 3 avisos)

Só os quatro itens do relatório; nenhum requisito, contrato, campo ou elemento de tela acrescentado (§16).

- `FLOW-0003` (2.0.1): a mensagem "publica em staging, STAGING; o arquivo da versao 1 fica como esta" perde o
  ";" (passa a vírgula), que o analisador de `sequenceDiagram` lia como fim de instrução. Fecha ISSUE-01.
- `FEAT-0008` (2.0.1): o critério de aceite dos requisitos 12 a 15 diz "a no máximo 0,05 m da face de colisão
  da barreira desse lado", com o termo de `02-glossary.md`, no lugar de "superfície de contato da barreira,
  onde o kart para desse lado". Nenhum outro artefato usava o termo antigo. Fecha ISSUE-02.
- `SCR-0002` (1.1.2): navegação diz "com a sessão de treino e a pista selecionada inalteradas", termo de
  `02-glossary.md`. Fecha ISSUE-03.
- `FLOW-0001` (1.1.1): o participante R do diagrama passa a ser "Tela de corrida", e a mensagem dele ao
  Jogador nomeia o painel "Resultado da volta do treino"; o resultado (passo 9) e "encerrar treino" (passo 10,
  SCR-0001, SCR-0003) saem do mesmo participante que os passos e as telas nomeiam. Fecha ISSUE-04.
- `00-index.md` e `99-traceability.md` regenerados pelo gate.

**Itens fechados**: ISSUE-01, ISSUE-02, ISSUE-03, ISSUE-04 de fspec-validation-20261106-1803.

**Itens recusados ou deixados, com motivo**: nenhum.
