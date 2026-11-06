---
title: Changelog — pista Kart Park
feature: pista-kart-park
stage: req
status: validated
version: 1.3.0
sources: [SEED, DOMAIN]
---

# Changelog

## 2026-10-22 — rodada 1, Mode A (geração a partir do seed revision 1)

**O que mudou**

- Conjunto gerado do zero a partir de `SEED.md` (`revision: 1`, 2026-10-22) e `DOMAIN.md`:
  `01-context.md`, `02-glossary.md`, seis histórias (US-0001 a US-0006, uma por história do seed), doze
  NFRs (NFR-0001 a NFR-0012) e o registro `98-divergences.md`, sem linhas.
- `00-index.md` e `99-traceability.md` não foram escritos: o gate os gera com `lint_artifacts.py --emit`.
- As onze decisões de `DOMAIN.md` de 2026-10-22, rotuladas `DOMAIN/DEC-01` a `DOMAIN/DEC-11` na ordem
  do arquivo, foram aplicadas no lugar dos quatro pontos abertos do seed; nenhum ponto em aberto é
  carregado.
- Restrições e impactos no domínio do seed sem história própria tornados mensuráveis como NFR: I2
  (NFR-0007), I3/I5 (NFR-0006), I8 (NFR-0008), pista dos ensaios (NFR-0009), dependências (NFR-0010),
  ordem do código (NFR-0011), licença Esri e publicação (NFR-0012).

**Decisões do autor para esta execução, aplicadas**

- A licença Esri bloqueia só a promoção para produção e não bloqueia nenhuma etapa de especificação:
  registrada em NFR-0012 e em `01-context.md`.
- O código desta feature só começa depois que `dirigibilidade` passar nos testes: carregado como
  NFR-0011, citando a restrição do seed, com a indicação de que a dependência deve ser registrada no
  D-Spec.
- A pista sintética continua sendo a pista dos ensaios automáticos: NFR-0009.
- Todos os números do seed foram medidos: usados como estão, sem nova medição.

**Itens fechados**: nenhum `ISSUE-<nn>` ou `FB-<nn>` (primeira rodada).

**Itens recusados, com motivo**

- "Código fica na raiz do repositório" (decisão do autor para esta execução): não entra no conjunto,
  porque é localização de código, uma decisão de design que esta etapa não registra (proibição de
  decisões de design); cabe ao D-Spec, que lê a raiz de código.
- A decisão do autor nomeia os arquivos congelados por `dirigibilidade` de forma diferente da restrição
  do seed; o conjunto cita só o texto do seed (Restrições), sem nomes de arquivo além dos que ele cita,
  e deixa a lista exata para o D-Spec, onde a dependência deve ser registrada.
- A janela de suavização de cerca de 12 m (`DOMAIN/DEC-04`) não virou critério de aceite: "cerca de"
  não é decidível. O que se verifica é o resultado — a tolerância de 0,30 m e o comprimento de
  687,5 m ± 1 % depois da suavização (US-0002); a janela fica como orientação ao design em
  `01-context.md` e no glossário.
- A frase "numa linha discreta" (`DOMAIN/DEC-07`) não virou critério: não é decidível sem um limite que
  o seed não dá; os critérios exigem a presença do crédito nas duas telas (US-0006).
- O caráter "curto e grave" do som da zebra (`DOMAIN/DEC-11`) ficou no glossário, não como limiar: o
  seed não dá duração nem frequência; o critério decidível é o som ser próprio, repetir-se com roda na
  zebra e não tocar com o som desligado (US-0005).
- A aderência da grama de ≈ 40 % (`DOMAIN/DEC-05`) é citada como referência no glossário e não virou
  critério: o seed não pede mudança na grama.
- O som da zebra em `web-mobile` não virou critério: o seed o exige só no teclado (`web-desktop`); a
  diferença entre os canais está declarada em US-0005.
- A regra geral "em todo trecho em que a grama entre duas partes não consecutivas mede 6 m ou menos"
  virou critério sobre o par medido pelo seed (≈ 371–414 m contra ≈ 580–615 m, US-0004), com a
  exclusão de barreira acima de 6 m (`DOMAIN/DEC-10`): sem um limiar para "não consecutivas", um critério
  geral leria como tais as duas pernas de um grampo, o que o seed não pede.
- Os limites de setor "perto de" 201,6 m, 350,3 m e 529,9 m viraram o ponto da linha central mais
  próximo dessas distâncias, medidas na linha central original (US-0003): é a leitura decidível sem
  inventar uma tolerância.
- `NOTES.md` da pasta do seed não foi lido (fora da lista de entrada da etapa). O arquivo de origem só
  foi resumido por script para confirmar que o trecho de zebra que cruza a largada passa 3 m dela, como o
  seed diz; nenhum número dele entrou no conjunto além dos do seed.

## 2026-11-03 — rodada 2, Mode A (regeneração a partir do seed revision 2)

**O que mudou**

- O seed passou de `revision: 1` para `revision: 2` (2026-11-03, commit `a5bb426`). A única mudança de
  conteúdo é o acabamento visual da Kart Park; tudo o que a revisão 2 não mudou foi mantido com os mesmos
  ids e o mesmo texto: US-0001 a US-0006, NFR-0001, NFR-0003 a NFR-0011 e `98-divergences.md`.
- Novo: US-0007 (acabamento visual, `SEED/US-7`), com 16 critérios, AC-US-0007-01 a AC-US-0007-16, que
  cobrem os onze critérios do seed, separados onde um critério do seed juntava dois comportamentos
  (largura e presença da faixa; aderência e corte; borda de dentro e de fora da zebra; altura e distância
  dos pneus).
- Novo: NFR-0013 (acabamento sem efeito na volta, `SEED/NF-06`) e NFR-0014 (arquivo publicado byte a
  byte igual e `trackVersion` 1, `SEED/RE-05`).
- NFR-0002 (1.1.0): a taxa de quadros passa a ser medida com o acabamento de US-0007 na tela
  (`SEED/NF-02` revisto).
- `01-context.md` (1.1.0): carimbo do seed em `revision: 2`; rótulos novos `SEED/US-7`, `SEED/RD-13`,
  `SEED/NF-06`, `SEED/RE-05`, `SEED/RE-06`, `SEED/FE-06` a `SEED/FE-08`; textos de `SEED/NF-02`,
  `SEED/IM-I2` e `SEED/IM-I3I5` atualizados; as duas restrições novas citadas; fora do escopo com os três
  itens novos; famílias de NFR atualizadas.
- `DOMAIN/DEC-12` rotulado: a entrada de 2026-11-03 de `DOMAIN.md` diz que a decisão sobre a licença Esri
  continua pendente e a Kart Park segue só em staging. Não muda nenhum critério — confirma `DOMAIN/DEC-08`
  e o NFR-0012, que passa a citá-la (1.0.1); `01-context.md` deixa de dizer que nenhum ponto resta e diz
  que nenhum ponto é carregado por este conjunto.
- `02-glossary.md` (1.1.0): acabamento, cena desenhada, faixa de borda, relevo da zebra, barreira de
  pneus, face de colisão, tom de grama, cor de grama de hoje e luminância relativa.

**Itens fechados**: nenhum `ISSUE-<nn>` ou `FB-<nn>` (rodada de Mode A por mudança de revisão).

**Itens recusados ou lidos, com motivo**

- "Difere ... entre 8 % e 20 % em luminância" (`SEED/US-7`) virou a luminância relativa da WCAG 2 de
  cada tom, com a diferença medida como fração da luminância relativa de `#68865b` (AC-US-0007-13). É a
  leitura decidível mais literal de "difere X %"; a leitura em pontos percentuais absolutos daria tons
  muito mais afastados. O validador ou o autor pode pedir a outra leitura.
- "O kart para quando encosta nos pneus que o jogador vê" não virou critério à parte: é a consequência
  observável da distância de no máximo 0,05 m entre a face dos pneus e a face de colisão
  (AC-US-0007-11) junto com US-0004 (critérios 04 e 05); fica como caso anormal de US-0007.
- "A aderência, a vibração e o som da zebra continuam como em US-5" não repete os critérios de US-0005:
  AC-US-0007-08 os referencia, para que um fato fique num lugar só.
- "Rente ao asfalto do lado da pista" virou altura de 0 m na borda do lado do asfalto (AC-US-0007-05); o
  seed não dá tolerância, e nenhuma foi inventada.
- O motivo de `SEED/FE-08` cita 676 m do caminho OSM e `NOTES.md`; o conjunto só repete o item de fora do
  escopo, porque `NOTES.md` não é lido (fora da lista de entrada da etapa).
- US-0004 e US-0005 não foram editadas: a revisão 2 não muda nenhum critério delas; US-0007 as cita.
- O NFR-0006 não foi editado: sua regra "mudança de conteúdo é versão nova" continua valendo, e a
  revisão 2 não muda o conteúdo do arquivo (NFR-0014).

## 2026-11-03 — rodada 3, Mode B (relatório `req-validation-20261103-1854.md`)

**O que mudou**

- US-0007 (1.1.0): critérios não atômicos divididos, ids novos no fim, nenhum id existente renumerado.
  AC-US-0007-04 fica com a saída de pista e AC-US-0007-17 recebe o corte com rodas na faixa de borda por
  mais de 1000 ms (ISSUE-07). AC-US-0007-08 fica com a aderência (AC-US-0005-06), AC-US-0007-18 recebe a
  vibração em `web-mobile` (AC-US-0005-07 e 08) e AC-US-0007-19 o som em `web-desktop` (AC-US-0005-09 a
  12) (ISSUE-08). AC-US-0007-13 fica com os ao menos 2 tons de verde e AC-US-0007-20 recebe a faixa de
  luminância de cada tom, com a mesma leitura de antes (ISSUE-09). AC-US-0007-15 fica com a aderência e
  AC-US-0007-21 recebe o estado de superfície da grama (ISSUE-10). AC-US-0007-14 passa a se observar na
  cena desenhada: o tom de grama por posição do chão, em metros do mundo do jogo (ISSUE-12).
- NFR-0011 (1.0.1) e `01-context.md` (1.1.1): a Fonte e a restrição citam só `SEED/RE-02`; a frase sobre
  registrar a dependência no D-Spec saiu, por não ter fonte no seed nem em `DOMAIN.md` (ISSUE-01,
  ISSUE-02). A instrução do autor de 2026-10-22 continua registrada na rodada 1 deste changelog.
- `02-glossary.md` (1.1.1): "Borda da pista" definida como a borda do asfalto ou, onde há zebra, a borda
  de fora da zebra (`SEED/US-5`); os critérios de corte de US-0003 já usam o termo (ISSUE-03).
- US-0004 (1.0.1): AC-US-0004-05 diz o referencial (local do obstáculo) e o instante (o mesmo número de
  passos de `STEP` depois do contato) da comparação (ISSUE-04).
- US-0005 (1.0.1): AC-US-0005-02 mede o trecho de volta na linha central original, com a exceção do
  trecho dividido na largada (ISSUE-05).
- US-0002 (1.0.1): AC-US-0002-05 diz que o ponto correspondente é o de mesmo índice, leitura de "varia
  ponto a ponto como no arquivo" (`SEED/US-2`) (ISSUE-06).
- Arquivos editados que estavam `validated` voltaram a `draft`. `00-index.md` e `99-traceability.md`
  regenerados pelo gate.

**Itens fechados**: ISSUE-01, ISSUE-02, ISSUE-03, ISSUE-04, ISSUE-05, ISSUE-06, ISSUE-07, ISSUE-08,
ISSUE-09, ISSUE-10, ISSUE-12.

**Itens recusados, com motivo**

- ISSUE-11 (leitura da luminância em AC-US-0007-20, antes AC-US-0007-13): mantida como está. O seed não
  diz qual luminância nem se a diferença é relativa; escolher outra leitura é decisão do autor, a fixar em
  `DOMAIN.md`. O validador marcou o item como info e o critério é decidível como escrito.
- Nenhum critério, história ou NFR novo além das divisões pedidas; nenhuma linha de divergência.

## 2026-11-06 — rodada 4, Mode A (regeneração a partir do seed revision 3)

**O que mudou**

- O seed passou de `revision: 2` para `revision: 3` (2026-11-06). A revisão 3 troca o traçado pela
  réplica não oficial `replica/kart-park-replica.json`, publicada como `kart-park` versão 2; a versão 1
  sai do seletor e o seu arquivo fica byte a byte igual. `DOMAIN.md` ganhou a decisão de 2026-11-06,
  rotulada `DOMAIN/DEC-13`. Ids mantidos onde o requisito sobrevive; todo arquivo do conjunto voltou a
  `draft`, porque nenhum foi validado contra a revisão 3.
- US-0001 (1.1.0): novos AC-US-0001-08 (o treino com a Kart Park carrega o `trackVersion` 2) e
  AC-US-0001-09 (nenhuma opção do seletor inicia o `trackVersion` 1); caso anormal da versão 1 que
  continua no repositório.
- US-0002 (2.0.0): história reescrita como no seed. AC-02 passa a 690,7 m ± 1 % (683,793–697,607 m);
  AC-05 passa a largura fixa de 7,0 m em todo ponto; AC-06 passa a linha central no estado da simulação a
  até 0,10 m da linha do arquivo da réplica, nos eixos do jogo (antes: 0,30 m da linha original); AC-07
  passa à curva de raio 8,8 m perto de 216 m (antes: grampo de ≈ 6 m perto de 218 m). AC-01, 03, 04 e 08
  mantidos, sem a palavra "suavizada". `DOMAIN/DEC-09` continua citada nas fontes, como substituída pela regra
  de 0,10 m (`SEED/RI-02`).
- US-0003 (2.0.0): AC-02 com os limites perto de 204,9 / 354,9 / 534,7 m, medidos na linha central do
  arquivo gerado; novo AC-US-0003-12 (cada limite interno fica numa reta do arquivo da réplica);
  AC-US-0003-09 retirado (ver recusas); casos anormais com os trechos novos.
- US-0004 (1.1.0): AC-01 com os trechos ≈ 369–406 m e ≈ 595–624 m; AC-02 sem a menção aos atalhos de
  12 a 26 m; casos anormais atualizados, com a grama mínima de 1,28 m.
- US-0005 (2.0.0): AC-01 passa a 22 trechos, os do arquivo da réplica (antes: 34, com a zebra da
  largada dividida); AC-02 e AC-03 leem o arquivo da réplica, sem a exceção da zebra dividida; novo
  AC-US-0005-13 (nenhum trecho de zebra cruza a linha de largada); fontes com `SEED/RD-14` e
  `DOMAIN/DEC-13`.
- US-0006 (2.0.0): AC-07 com o nome "Kart Park — São José dos Pinhais (réplica não oficial)"; AC-08 com
  691 m; AC-09 (recorde de 41,45 s) mantido; casos anormais e fontes com `DOMAIN/DEC-13`.
- US-0007 (1.2.0): critérios do acabamento inalterados, salvo AC-07, que compara a trajetória sobre a
  zebra com e sem o relevo desenhado na versão 2 (antes: com o jogo de antes da revisão 2); pré-condição
  e fontes passam de `SEED/RE-05` e `SEED/IM-I3I5` para `SEED/RE-08`. AC-16 (pista sintética igual à de
  antes da revisão 2) mantido: a referência continua válida.
- NFR-0001 (1.1.0): arquivo gerado da versão 2; o arquivo da réplica mede 34.373 bytes.
- NFR-0006 (2.0.0): a primeira linha passa a exigir `trackVersion` 2 com o mesmo `trackId`; a terceira
  deixa de citar "suavizar de novo".
- NFR-0012 (1.1.0): a dúvida da licença Esri vale para qualquer versão, também para a réplica
  (`DOMAIN/DEC-13`).
- NFR-0013 (2.0.0): reescrito como `SEED/NF-06` da revisão 3 — mesmas entradas, mesmo tempo, setores e
  trajetória na versão 2 com e sem o acabamento de US-0007 desenhado.
- NFR-0014 (2.0.0): reescrito como `SEED/RE-07` — o arquivo da versão 1 continua no repositório, byte a
  byte igual; renomeado para `NFR-0014-arquivo-da-versao-1-inalterado.md`. A exigência de `trackVersion` 1
  saiu: a versão publicada agora é a 2 (NFR-0006).
- NFR-0011 retirado e o arquivo removido: a restrição "o código desta feature só começa depois que
  `dirigibilidade` passar nos testes" saiu do seed na revisão 3. O id não é reaproveitado.
- `01-context.md` (2.0.0): carimbo do seed em `revision: 3`; regra de rótulos estáveis (item novo recebe o
  próximo número livre); rótulos novos `SEED/RD-14`, `SEED/RE-07`, `SEED/RE-08`, `SEED/FE-09`,
  `DOMAIN/DEC-13`; textos de `SEED/MED`, `SEED/RD-03`, `SEED/RD-10`, `SEED/NF-06`, `SEED/IM-I3I5`,
  `SEED/IM-I6` atualizados; `SEED/RE-02` e `SEED/RE-05` retirados; `DOMAIN/DEC-04` e `DOMAIN/DEC-09`
  marcadas como substituídas onde a revisão 3 as substitui; tabela de medições da réplica; restrições da
  revisão 3 citadas.
- `02-glossary.md` (2.0.0): réplica não oficial, traçado da versão 1, arquivo da réplica, elemento,
  linha central da réplica, curva mais fechada, zebras por regra; saem traçado aproximado, arquivo de
  origem, linha central original e suavizada e suavização; largura, grampo, trechos quase encostados,
  atalho, trecho de zebra, setor, limite de setor, Esri, versão e acabamento atualizados.
- `98-divergences.md`: só o status; nenhuma divergência relatada.

**Itens fechados**: nenhum `ISSUE-<nn>` ou `FB-<nn>` (rodada de Mode A por mudança de revisão).

**Itens recusados ou lidos, com motivo**

- AC-US-0003-09 (atalho pela grama por dentro da curva 4, de ≈ 147 m a ≈ 200 m) foi retirado, sem
  renumerar os demais: a localização vinha das medições do traçado da versão 1, e a revisão 3 não mede
  nem cita esse atalho na réplica. A regra de `DOMAIN/DEC-10` continua coberta por AC-US-0003-04 e 05
  (marcadores a no máximo 25 m; volta que pula marcador é inválida) e por AC-US-0004-02 (sem barreira
  acima de 6 m de grama). Um local novo exigiria uma medição que o seed não traz.
- A regra das zebras (`SEED/RD-14`) não virou critério próprio sobre os arcos: o seed exige "as 22
  zebras do arquivo" (`SEED/US-5`), e a regra é a que gerou esse arquivo; um critério por arco pediria
  extensões (onde a zebra começa e termina em cada arco e transição) que o seed não dá.
- "A pista não é suavizada de novo" (`SEED/US-2`) não virou critério à parte: o observável é a distância
  de no máximo 0,10 m ao arquivo da réplica (AC-US-0002-06) e a carga sem nova suavização (AC-08); o
  preparo que suaviza de novo aparece como caso anormal.
- "Limites em retas" (`SEED/US-3`) virou AC-US-0003-12, lido nos elementos do tipo reta do arquivo da
  réplica; as três distâncias citadas caem em retas desse arquivo (198,5–207,8 m, 314,3–369,2 m e
  522,1–547,0 m), conferidas por script de leitura, sem número novo no conjunto.
- A distância média e máxima da réplica à linha da versão 1 (0,89 m e 3,47 m, `SEED/MED`) ficou no
  contexto, não como critério: o seed não a exige do jogo.
- As transições de 5 m entre elementos (`DOMAIN/DEC-13`) não viraram critério: descrevem como a réplica
  foi feita, e o critério de 0,10 m sobre o arquivo dela as carrega.
- AC-US-0007-16 continua comparando a pista sintética com o jogo de antes da revisão 2: a restrição
  "a aparência da pista sintética não muda" segue igual, e essa referência continua a anterior a todo o
  acabamento.
- NFR-0002, NFR-0003, NFR-0004, NFR-0005, NFR-0007, NFR-0008, NFR-0009 e NFR-0010 não mudaram de texto:
  os itens do seed que eles cobrem não mudaram na revisão 3; só voltaram a `draft`.
- `NOTES.md` foi lido nesta rodada por instrução do chamador; nenhum número dele entrou no conjunto além
  dos que o seed já traz.
