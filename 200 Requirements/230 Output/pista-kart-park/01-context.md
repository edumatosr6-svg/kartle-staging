---
title: Contexto — pista Kart Park
feature: pista-kart-park
stage: req
status: validated
version: 2.0.0
sources: [SEED, DOMAIN]
---

# Contexto

## O que é a feature

O Kartle ganha sua primeira pista real, a **Kart Park**, em São José dos Pinhais (PR). Ela entra **ao
lado** da pista sintética, e o Jogador escolhe uma das duas no treino livre por um seletor de pista
(`SEED.md`, Visão geral; `DOMAIN/DEC-01`). Uma barreira física separa os dois trechos que quase se
encostam, as zebras têm efeito na pilotagem e a volta tem quatro setores. O crédito ao OpenStreetMap
aparece onde o Jogador vê a pista. A revisão 2 do seed deu à Kart Park o acabamento de um kartódromo —
faixa branca nas bordas, zebra com relevo, barreira de pneus e grama com variação de tom —, que é só
desenho e não muda a pilotagem (US-0007, NFR-0013).

A revisão 3 do seed troca o traçado tirado da foto de satélite, torto e de largura irregular, por uma
**réplica não oficial**: o desenho da pista real refeito com retas e curvas de raio constante, largura
fixa de 7 m e zebras nas curvas, publicado como `kart-park` **versão 2** (US-0002, NFR-0006,
`DOMAIN/DEC-13`). A versão 1 deixa o seletor e o seu arquivo publicado continua igual (US-0001,
NFR-0014). O acabamento de US-0007 continua o mesmo e passa a acompanhar o traçado novo (`SEED/RE-08`).

É a primeira das três pistas reais da etapa 3 de `requirements/08` (`SEED.md`, Contexto). O traçado da
versão 1 veio de `kart-park.json` (formato `kartle-pista` v1), gerado pelo dono do produto a partir do
caminho OpenStreetMap `way/128739206` e de bordas detectadas em imagem Esri World Imagery. O traçado da
versão 2 é o arquivo da réplica, `replica/kart-park-replica.json` (mesmo formato), ajustado por mínimos
quadrados sobre `kart-park.json` e aprovado pelo dono do produto em 2026-11-06: 33 elementos, entre retas
e arcos ligados por transições de 5 m. Esse arquivo não traz linha de chegada, limites de setor nem
marcadores; este conjunto exige que o arquivo de pista gerado offline os traga (US-0003).

**Compatibilidade.** Antes desta feature o treino usava só a pista sintética (`SEED.md`, Visão geral).
Esta feature muda a pista com que o jogo abre: passa a ser a Kart Park (US-0001, `DOMAIN/DEC-06`), hoje
na versão 2. A pista sintética **não é aposentada**: continua selecionável no seletor (US-0001) e continua
sendo a pista dos ensaios automáticos (NFR-0009). Nenhum critério deste conjunto muda a pista sintética,
nem a sua aparência (US-0007, `SEED/RE-06`). A troca da versão 1 pela versão 2 não edita a versão 1:
publica uma versão nova, como I3/I5 exigem (NFR-0006, NFR-0014).

**Padrão seguro.** O comportamento novo vale ligado por padrão assim que a feature é entregue, como o
seed pede ("A Kart Park vem selecionada quando o jogo abre"). É seguro ligado porque o seletor é só de
treino e não gera resultado de desafio diário (US-0001, I1), a pista sintética continua disponível e
intacta para os ensaios (NFR-0009) e a Kart Park, em qualquer versão, fica só em staging até a decisão
sobre a licença Esri (NFR-0012).

Seed: `200 Requirements/220 Input/pista-kart-park/SEED.md`, `revision: 3`, `date: 2026-11-06`, autor
`eduardo.matos`; a revisão 3 troca o traçado pela réplica não oficial publicada como versão 2. Camada de
domínio durável: `DOMAIN.md` da mesma pasta, cujas decisões prevalecem sobre os pontos em aberto
correspondentes do seed. Todos os números do seed foram medidos pelo dono do produto (`SEED.md`,
Contexto).

## Atores e canais

| Ator | Canal | Papel nesta feature |
|---|---|---|
| Jogador | `web-desktop` | Escolhe a pista no treino e pilota com o teclado; ouve o som da zebra |
| Jogador | `web-mobile` | O mesmo no celular, com inclinação e toque; sente a vibração da zebra |
| Curador do catálogo | nenhum canal (dado de pista) | Prepara a pista offline: conversão, linhas de volta e versão. Os critérios observados no arquivo de pista gerado (US-0002 a US-0005) são o que ele entrega; o seed não lhe dá história própria |

Canal fora do escopo: `remote-wheel` (pós-MVP, I10). Nenhuma história deste conjunto o cobre.

Em todas as histórias, a pista, a geometria, as regras de volta, o efeito da zebra na aderência e a
barreira são idênticos em `web-desktop` e `web-mobile`. O que muda entre os canais é o dispositivo de
entrada e o retorno da zebra: vibração em `web-mobile`, som em `web-desktop` (US-0005, `DOMAIN/DEC-05`).
Em `web-mobile`, sensor de inclinação ausente ou permissão negada faz o controle recair para toque com
estado visível (I4, `[DOMAIN]`).

## Itens do seed e decisões de domínio (chave de rastreabilidade)

Os rótulos abaixo nomeiam os itens do seed e as decisões de `DOMAIN.md`, que não têm identificador
próprio. O `sources:` de cada história e de cada NFR os cita, e a matriz gerada (`99-traceability.md`)
liga cada rótulo aos itens deste conjunto. Para que os rótulos fiquem estáveis entre revisões, um item
que uma revisão do seed acrescenta recebe o próximo número livre da sua família, qualquer que seja a sua
posição na seção, e o rótulo de um item retirado não é reaproveitado. As decisões de `DOMAIN.md` são
numeradas na ordem em que aparecem no arquivo.

| Rótulo | Item |
|---|---|
| `SEED/US-1` … `SEED/US-7` | As sete histórias de usuário da seção Histórias de usuário, na ordem do seed; `SEED/US-7` é o acabamento visual (revisão 2) |
| `SEED/MED` | A tabela de medições da réplica da seção Contexto (revisão 3) |
| `SEED/RD-01` | Circuito fechado de 400 a 1500 m (RF02) |
| `SEED/RD-02` | Pista em metros e no sentido de corrida, preparada offline (RF03, RF06, I10) |
| `SEED/RD-03` | Largura do OSM quando houver, senão 8 m; aqui a largura é fixa em 7 m, da réplica, um desvio aceito (RF04, decisões de 2026-10-22 e 2026-11-06) |
| `SEED/RD-04` | Asfalto, zebras nas curvas, grama e barreiras (RF07) |
| `SEED/RD-05` | Largada, 4 setores e chegada (RF09) |
| `SEED/RD-06` | Volta que pula marcador é inválida (RF10, `race-lap-validation`) |
| `SEED/RD-07` | Uma pista publicada nunca muda em sua versão; mudar é publicar versão nova (I3, I5) |
| `SEED/RD-08` | Crédito OSM e menção à ODbL quando houver dado OSM (RNF09, D-DP-04 ratificado) |
| `SEED/RD-09` | Seletor só de treino; a escolha de pista do desafio diário é de outra feature (I1, RF14, decisão de 2026-10-22) |
| `SEED/RD-10` | Traçado da réplica não oficial (retas e arcos), apresentado como réplica não oficial (decisão de 2026-11-06); na revisão 2 era "suavizar e apresentar como traçado aproximado" |
| `SEED/RD-11` | Barreira física nos trechos quase encostados (decisão de 2026-10-22) |
| `SEED/RD-12` | Zebra conta como pista, com 85 % de aderência e vibração no celular (decisão de 2026-10-22) |
| `SEED/RD-13` | Faixa de borda, relevo da zebra, pneus e tons da grama são só desenho (I2, decisão de 2026-11-03) |
| `SEED/RD-14` | Zebras por regra: por dentro das curvas de raio menor que 30 m e por fora na saída das de raio menor que 16 m (decisão de 2026-11-06; revisão 3) |
| `SEED/NF-01` | Arquivo da pista menor que 200 KB (RNF02) |
| `SEED/NF-02` | Taxa de quadros na Kart Park: 60 fps em notebook e 30 fps em celular intermediário (RNF03), com o acabamento de US-7 |
| `SEED/NF-03` | Determinismo: mesmas entradas, mesmo tempo e mesmos setores na Kart Park (RNF07) |
| `SEED/NF-04` | Jogar sem servidor (RNF08) |
| `SEED/NF-05` | Crédito visível em 100 % das telas de US-6 com a Kart Park selecionada (RNF09) |
| `SEED/NF-06` | Acabamento sem efeito na volta: na versão 2, as mesmas entradas dão o mesmo tempo, os mesmos setores e a mesma trajetória com e sem o acabamento de US-7 desenhado (texto da revisão 3) |
| `SEED/RE-01` | A pista sintética continua sendo a pista dos ensaios automáticos de `dirigibilidade` e `race-lap-validation` |
| `SEED/RE-03` | Conversão offline para o formato que o jogo lê, com os eixos do jogo leste = +x, norte = −z |
| `SEED/RE-04` | Nenhuma dependência nova de execução |
| `SEED/RE-06` | A aparência da pista sintética não muda |
| `SEED/RE-07` | A revisão 3 publica a pista como `kart-park` versão 2; o arquivo publicado da versão 1 continua no repositório, byte a byte igual (revisão 3) |
| `SEED/RE-08` | O acabamento de US-7 continua o mesmo e passa a acompanhar o traçado novo (revisão 3) |
| `SEED/IM-I1` | O seletor é só de treino; a pista de cada desafio diário é da feature do desafio |
| `SEED/IM-I2` | Geometria, largura, zebra e barreira entram na simulação como dado; a tela só desenha; o acabamento de US-7 fica todo do lado do desenho |
| `SEED/IM-I3I5` | A revisão 3 é a versão 2 de `kart-park`; a versão 1 não é alterada |
| `SEED/IM-I6` | Crédito e licença dos dados derivados; a réplica é derivada do traçado da versão 1 |
| `SEED/IM-I8` | O contrato de passo não muda; o efeito da zebra é um dado de superfície |
| `SEED/IM-I10` | Nenhum editor de pista no jogo |
| `SEED/RI-01` … `SEED/RI-04` | Os quatro riscos da seção Riscos e incógnitas, na ordem do seed (licença Esri, tolerância da suavização, atalhos pela grama, som da zebra) |
| `SEED/FE-01` … `SEED/FE-09` | Os nove itens da seção Fora do escopo, na ordem do seed; `SEED/FE-06` a `SEED/FE-08` vêm da revisão 2 e `SEED/FE-09` da revisão 3 |
| `DOMAIN/DEC-01` | Entrada da pista: a Kart Park entra ao lado da pista sintética, com um seletor de pista |
| `DOMAIN/DEC-02` | Licença: usar os dados agora e mostrar o crédito OSM/ODbL; a dúvida sobre os dados derivados da Esri bloqueia só a promoção para produção; staging pode usar a pista |
| `DOMAIN/DEC-03` | Atalho entre trechos quase encostados: barreira física entre os trechos; o kart bate e não passa |
| `DOMAIN/DEC-04` | Fidelidade (2026-10-22): suavizar a linha central; nome "traçado aproximado"; 687 m; o recorde real de 41,45 s não aparece. Para o traçado, o nome e o comprimento, substituída por `DOMAIN/DEC-13` e pela revisão 3; continua valendo para o recorde |
| `DOMAIN/DEC-05` | Zebras: contam como pista e têm efeito; cada pneu sobre a zebra tem 85 % da aderência do asfalto (a grama tem ≈ 40 %); no celular, vibração de 20 ms a cada 0,25 s enquanto houver roda na zebra; no teclado, só o som |
| `DOMAIN/DEC-06` | Seletor: só para treino até o desafio diário existir; o jogo abre na Kart Park; a sintética fica selecionável e continua sendo a pista dos ensaios automáticos |
| `DOMAIN/DEC-07` | Crédito: "© colaboradores do OpenStreetMap", menção à ODbL e link para `openstreetmap.org/copyright` numa linha discreta no seletor de pista e na tela de resultado sempre que a pista for a Kart Park; o crédito da Esri entra junto se a licença for liberada |
| `DOMAIN/DEC-08` | Licença Esri: o dono do produto decide antes da promoção para produção, com base nos termos de uso da Esri; até lá, a Kart Park fica só em staging |
| `DOMAIN/DEC-09` | Tolerância da suavização de 0,30 m (2026-10-22); a revisão 3 não suaviza mais, e a regra que vale é a de 0,10 m de US-2 (`SEED/RI-02`) |
| `DOMAIN/DEC-10` | Atalhos pela grama: os marcadores a cada 25 m bastam; barreira só nos trechos com 6 m de grama ou menos |
| `DOMAIN/DEC-11` | Som da zebra no teclado: um ruído curto e grave que se repete enquanto houver roda na zebra, com o som ligado |
| `DOMAIN/DEC-12` | Licença Esri, 2026-11-03: a decisão continua pendente; a Kart Park segue só em staging, sem liberação nem remedição sem Esri por enquanto, e a produção espera a decisão |
| `DOMAIN/DEC-13` | Traçado da revisão 3, 2026-11-06: aprovada a réplica não oficial — retas e arcos de raio constante com transições de 5 m, largura fixa de 7 m, zebras por regra —, que substitui o traçado da versão 1 no seletor como `kart-park` versão 2, com o nome "Kart Park — São José dos Pinhais (réplica não oficial)"; a licença Esri continua valendo para ela |

Rótulos retirados na revisão 3, sem reaproveitamento: `SEED/RE-02` (o código só começava depois de
`dirigibilidade`; a restrição saiu do seed) e `SEED/RE-05` (a revisão 2 mantinha o arquivo byte a byte
igual e a versão 1; substituída por `SEED/RE-07`).

## Decisões de domínio aplicadas

Os quatro riscos do seed foram fechados pelo dono do produto em 2026-10-22, salvo a licença Esri
(`SEED.md`, Riscos e incógnitas). Em 2026-11-03 o dono do produto registrou que a decisão sobre a licença
Esri continua pendente (`DOMAIN/DEC-12`); ela bloqueia só a promoção para produção, como já dizem
`DOMAIN/DEC-08` e o NFR-0012, e vale também para a réplica (`DOMAIN/DEC-13`). A revisão 3 do seed não
abre ponto novo. Não há ponto em aberto que este conjunto carregue.

| Decisão | Fecha | Histórias e NFRs |
|---|---|---|
| `DOMAIN/DEC-01` | — | US-0001 |
| `DOMAIN/DEC-02` | `SEED/RI-01` (uso dos dados agora) | US-0006, NFR-0012 |
| `DOMAIN/DEC-03` | — | US-0004 |
| `DOMAIN/DEC-04` | — (só o recorde continua valendo) | US-0006 |
| `DOMAIN/DEC-05` | — | US-0005 |
| `DOMAIN/DEC-06` | — | US-0001, NFR-0009 |
| `DOMAIN/DEC-07` | — | US-0006, NFR-0005, NFR-0012 |
| `DOMAIN/DEC-08` | `SEED/RI-01` (quando e onde se decide) | NFR-0012 |
| `DOMAIN/DEC-09` | `SEED/RI-02` (substituída pela regra de 0,10 m) | US-0002 (citada como substituída) |
| `DOMAIN/DEC-10` | `SEED/RI-03` | US-0003, US-0004 |
| `DOMAIN/DEC-11` | `SEED/RI-04` | US-0005 |
| `DOMAIN/DEC-12` | — (mantém `SEED/RI-01` pendente só para a produção) | NFR-0012 |
| `DOMAIN/DEC-13` | — | US-0001, US-0002, US-0003, US-0005, US-0006, NFR-0006, NFR-0012 |

A licença Esri (`SEED/RI-01`) bloqueia **só a promoção para produção**: não bloqueia nenhuma etapa de
especificação, e staging pode usar a pista (`DOMAIN/DEC-02`, `DOMAIN/DEC-08`). Esse limite é o NFR-0012.

A regra das zebras (`SEED/RD-14`) e as transições de 5 m entre elementos (`DOMAIN/DEC-13`) descrevem como
o arquivo da réplica foi feito; o que este conjunto verifica é o resultado: as 22 zebras do arquivo, no
lado e no trecho declarados (US-0005), e a linha central do jogo a até 0,10 m da linha da réplica
(US-0002).

## Medições da réplica (do seed, seção Contexto)

Medidas pelo dono do produto sobre `replica/kart-park-replica.json` (`SEED/MED`). Os critérios que usam
cada fato estão indicados.

| Fato | Valor medido | Usado em |
|---|---|---|
| Comprimento da volta fechada | 690,7 m; o oficial é 750 m, a réplica é 7,9 % mais curta | US-0002, US-0006 |
| Pontos | 691, a cada 0,95 a 1,01 m, fechando no ponto 0 | US-0002 |
| Sentido | anti-horário, visto de cima | US-0002 |
| Largada | ponto 0, rumo 234,7° (bússola), numa reta de 48 m (11,7 m antes da linha e 36,3 m depois) | US-0002 e US-0003 (ponto 0); o rumo e a reta são contexto |
| Largura do asfalto | 7,0 m fixos | US-0002 |
| Elementos | 16 retas e 17 arcos; a reta mais longa mede 58,2 m | US-0003 (limites de setor em retas) |
| Curvas mais fechadas | raio 8,8 m (esquerda, 86°, perto de 216 m), 10,9 m e 11,3 m; os dois grampos têm raio 15,5 m (220°) e 14,4 m (176°) | US-0002 (raio 8,8 m) |
| Distância à linha central da versão 1 | 0,89 m em média, no máximo 3,47 m | contexto; não é critério |
| Trechos quase encostados | ≈ 369–406 m contra ≈ 595–624 m de volta, com no mínimo 1,28 m de grama entre as bordas | US-0004 |
| Zebras | 22 trechos, 430,7 m no total; nenhuma cruza a linha de largada | US-0005 |
| Tamanho do arquivo | 34.373 bytes | NFR-0001 |
| Cor de grama de hoje | `#68865b` (citada em `SEED/US-7`) | US-0007, referência dos tons de grama |

## Restrições (citadas do seed, seção Restrições)

- "A pista sintética continua sendo a pista dos ensaios automáticos de `dirigibilidade` e de
  `race-lap-validation`. Motivo: esses ensaios têm números calibrados nela." — NFR-0009, US-0001.
- "A pista é convertida offline para o formato que o jogo lê, com os eixos do jogo: leste = +x,
  norte = −z. Motivo: I10; com outro mapeamento, o circuito fica espelhado." — US-0002.
- "Nenhuma dependência nova de execução." — NFR-0010.
- "A revisão 3 publica a pista como `kart-park` versão 2. O arquivo publicado da versão 1 continua no
  repositório, byte a byte igual. Motivo: I3/I5, uma pista publicada nunca muda em sua versão." —
  NFR-0006, NFR-0014, US-0001.
- "O acabamento de US-7 continua o mesmo e passa a acompanhar o traçado novo. Motivo: ele já foi aprovado
  na revisão 2, e a revisão 3 muda só o traçado." — US-0007, NFR-0013.
- "A aparência da pista sintética não muda. Motivo: o acabamento é desta pista real, e a sintética segue
  como pista de ensaio." — US-0007 (critério 16).

## Famílias de requisitos não funcionais

| Família | Tratamento |
|---|---|
| Tamanho de download (RNF02) | Especificada: NFR-0001 |
| Taxa de quadros (RNF03) | Especificada: NFR-0002, com o acabamento de US-0007 na tela |
| Determinismo (RNF07) | Especificada: NFR-0003, NFR-0008; acabamento sem efeito na volta: NFR-0013 |
| Disponibilidade / solo sem servidor (RNF08) | Especificada: NFR-0004 |
| Comportamento offline | Especificada por NFR-0004 no que toca serviços remotos; o seed não pede jogar sem a entrega dos arquivos do próprio jogo |
| Crédito e licença de dados (RNF09, I6) | Especificada: NFR-0005, NFR-0012 |
| Compatibilidade do dado de pista (I3, I5) | Especificada: NFR-0006 (versão 2 publicada, versões imutáveis); versão 1 inalterada: NFR-0014 |
| Observabilidade / evidência (I9) | Especificada: NFR-0007; telemetria em tempo de execução dispensada — o produto não coleta dados (RNF10) |
| Restrições de entrega | Especificadas: NFR-0009 (pista dos ensaios), NFR-0010 (dependências), NFR-0012 (publicação) |
| Tempo até pilotar (RNF01) | Dispensada: o seed não fixa limite de carregamento para esta feature |
| Latência de entrada (RNF04) | Dispensada: a feature não altera o caminho de entrada e o seed não fixa limite |
| Suporte a navegadores (RNF05) | Dispensada como limite próprio: o único ponto dependente do navegador é a vibração, condicionada a o navegador permitir (US-0005) |
| Privacidade e consentimento (RNF10) | Dispensada: a feature não coleta nem grava dado pessoal; o link para `openstreetmap.org/copyright` só é seguido se o Jogador o acionar |
| Idioma pt/en (RNF11) | Dispensada: o seed fixa os textos do nome e do crédito só em português e não pede a versão em inglês nesta feature |
| Acessibilidade | Dispensada: o seed não fixa requisito de acessibilidade para esta feature; a zebra é desenhada na tela (US-0005), e a vibração e o som são retorno adicional a ela |
| Retenção de dados | Dispensada: a feature não persiste dado novo — a pista escolhida não é lembrada, o jogo sempre abre na Kart Park (US-0001) |
| Exposição por papéis (RBAC) | Dispensada: o produto não tem contas nem papéis (I10, RNF10) |
| Volume de mensagens | Dispensada: a feature não envia mensagens nem usa servidor |

## Fora do escopo (do seed, seção Fora do escopo)

- `SEED/FE-01` — As outras duas pistas reais da etapa 3, um catálogo de pistas e o calendário do desafio
  diário.
- `SEED/FE-02` — Elevação do terreno (I10).
- `SEED/FE-03` — Medalhas e cores de setor (D15, D16).
- `SEED/FE-04` — Recorde da pista real e qualquer comparação com tempos reais.
- `SEED/FE-05` — O cenário além de asfalto, zebra, grama e barreiras, como árvores, tribuna e boxes, que
  é de outra feature.
- `SEED/FE-06` — Zebra com relevo na física (o kart subir ou trepidar na zebra): o relevo de US-7 é só
  desenho.
- `SEED/FE-07` — Chão com foto de satélite ou textura baixada da rede.
- `SEED/FE-08` — Aproximar o traçado dos 750 m oficiais: o caminho OSM de origem fecha em 676 m, e
  corrigir pede uma fonte nova de medição.
- `SEED/FE-09` — Escolher a versão 1 da Kart Park no jogo: ela deixa o seletor.
