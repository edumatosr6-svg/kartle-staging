---
name: pista-kart-park
description: Primeira pista real do Kartle, a Kart Park (São José dos Pinhais, PR), jogável no treino ao lado da pista sintética por um seletor, com o traçado redesenhado como réplica não oficial (retas e arcos, largura fixa de 7 m, zebras por regra) e publicado como versão 2, barreira entre trechos quase encostados, zebras com efeito, quatro setores, marcadores de percurso, crédito OpenStreetMap/ODbL e acabamento visual (faixa branca de borda, zebra com relevo, barreira de pneus, grama com variação de tom). Ler antes de qualquer trabalho com pistas reais, seleção de pista, zebras, desenho da pista ou atribuição de dados de mapa.
revision: 3
date: 2026-11-06
author: eduardo.matos
channels: [web-desktop, web-mobile]
---

## Visão geral

O Kartle ganha sua primeira pista real, a **Kart Park**, em São José dos Pinhais (PR). Ela fica ao lado
da pista sintética, e o jogador escolhe uma das duas no treino livre. Uma barreira física separa os dois
trechos que quase se encostam, as zebras têm efeito na pilotagem e a volta tem quatro setores. O crédito
ao OpenStreetMap aparece onde o jogador vê a pista. A revisão 2 deu à pista o acabamento de um
kartódromo: faixa branca nas bordas, zebra com relevo, barreira de pneus e grama com variação de tom.
A revisão 3 troca o traçado tirado da foto de satélite, torto e de largura irregular, por uma **réplica
não oficial**. A réplica mantém o desenho da pista real, mas é feita de retas e curvas de raio constante,
com largura fixa e zebras nas curvas, como se desenha um kartódromo. A pista passa a ser publicada como
uma versão nova.

## Contexto

`requirements/08` (etapa 3) prevê três pistas reais com revisão visual e corrida completa. Esta é a
primeira. A versão 1 da pista veio de `kart-park.json` (formato `kartle-pista` v1), gerado pelo dono do
produto a partir do caminho OpenStreetMap `way/128739206` e de bordas detectadas em imagem Esri World
Imagery. Medido, esse traçado tinha largura de 4,4 a 10,8 m, nenhuma reta de verdade e uma linha central
que trocava de lado 28 vezes (`NOTES.md`).

O traçado da revisão 3 é `replica/kart-park-replica.json` (mesmo formato), aprovado pelo dono do produto
em 2026-11-06. A réplica foi ajustada por mínimos quadrados sobre `kart-park.json`. Ela é feita de 33
elementos, entre retas e arcos ligados por transições de 5 m. Os scripts e a imagem de comparação estão
em `replica/`. O arquivo não traz linha de chegada, limites de setor nem marcadores. A pista sintética
continua existindo como pista de teste dos ensaios automáticos (`dirigibilidade`, `race-lap-validation`).

Medições da réplica (`replica/h_medicoes.py`, `NOTES.md`):

| Fato | Valor medido |
|---|---|
| Comprimento da volta fechada | 690,7 m. O oficial é 750 m, então a réplica é 7,9 % mais curta. |
| Pontos | 691, a cada 0,95 a 1,01 m, fechando no ponto 0 |
| Sentido | anti-horário, visto de cima |
| Largada | ponto 0, rumo 234,7° (bússola), numa reta de 48 m (11,7 m antes da linha e 36,3 m depois) |
| Largura do asfalto | 7,0 m fixos |
| Elementos | 16 retas e 17 arcos. A reta mais longa mede 58,2 m. |
| Curvas mais fechadas | raio 8,8 m (esquerda, 86°, perto de 216 m), 10,9 m e 11,3 m. Os dois grampos têm raio 15,5 m (220°) e 14,4 m (176°). |
| Distância à linha central da versão 1 | 0,89 m em média, no máximo 3,47 m |
| Trechos quase encostados | ≈ 369–406 m contra ≈ 595–624 m de volta, com no mínimo 1,28 m de grama entre as bordas |
| Zebras | 22 trechos, 430,7 m no total. Nenhuma cruza a linha de largada. |
| Tamanho do arquivo | 34.373 bytes |

## Atores e canais

| Ator | Canal | O que faz |
|---|---|---|
| Jogador | `web-desktop` | Escolhe a pista no treino e pilota com o teclado |
| Jogador | `web-mobile` | O mesmo no celular, com inclinação e toque, e sente a vibração da zebra |
| Curador do catálogo | dado de pista | Prepara a pista offline: conversão, linhas de volta e versão |

## Histórias de usuário

- **US-1** Como Jogador, quero escolher a pista do treino, para pilotar numa pista real.
  - A tela inicial oferece um seletor com a Kart Park e a pista sintética.
  - A Kart Park vem selecionada quando o jogo abre.
  - A Kart Park do seletor é a versão 2, a réplica. A versão 1 não aparece no seletor.
  - O seletor só oferece treino. Nenhuma pista escolhida no seletor gera resultado de desafio diário.
  - Trocar de pista coloca o kart na largada da pista escolhida, sem volta em andamento.
- **US-2** Como Jogador, quero que a Kart Park tenha a forma da pista real desenhada como um kartódromo,
  para reconhecer o traçado e ver as curvas e retas limpas.
  - A volta mede 690,7 m ± 1 %, no sentido anti-horário, a partir da linha de largada no ponto 0.
  - O asfalto tem 7,0 m de largura em toda a volta.
  - A linha central da pista no jogo fica a até 0,10 m da linha do arquivo da réplica em todo ponto. A
    pista não é suavizada de novo.
  - A curva mais fechada (raio 8,8 m, perto de 216 m) é pilotável: as bordas do asfalto não se cruzam.
- **US-3** Como Jogador, quero que uma volta na Kart Park tenha setores e seja validada como na pista
  sintética, para que meu tempo de treino seja comparável entre voltas.
  - A volta tem 4 setores, com limites em retas, perto de 204,9 m, 354,9 m e 534,7 m de volta. A chegada
    é a linha de largada.
  - Marcadores de percurso existem a no máximo 25 m um do outro ao longo da volta.
  - Uma volta que pula um marcador é inválida, com o motivo "marcador pulado".
  - O corte usa os limites padrão: mais de 3 m além da borda por mais de 1000 ms (OPEN-01 de
    `race-lap-validation`).
- **US-4** Como Jogador, quero que os trechos quase encostados tenham uma barreira, para que ninguém
  corte um terço da volta.
  - Em todo trecho em que a grama entre duas partes não consecutivas da pista mede 6 m ou menos
    (medido: ≈ 369–406 m contra ≈ 595–624 m de volta), existe uma barreira física entre elas.
  - O kart não atravessa a barreira em nenhuma velocidade. Bater nela tem o mesmo efeito que bater no
    muro que já existe.
  - A barreira não invade o asfalto de nenhum dos dois trechos.
- **US-5** Como Jogador, quero sentir a zebra, para usar e respeitar a zebra como num kart de verdade.
  - As 22 zebras do arquivo aparecem no lado declarado e nos trechos declarados.
  - Rodar sobre a zebra conta como estar na pista: não conta como saída nem para o corte.
  - Cada pneu sobre a zebra tem 85 % da aderência que teria no asfalto.
  - No celular, enquanto houver ao menos uma roda na zebra, o aparelho vibra 20 ms a cada 0,25 s, se o
    navegador permitir.
  - No teclado, rodar na zebra produz um som próprio, quando o som está ligado.
- **US-6** Como Jogador, quero saber de onde vem a pista, para que os dados sejam creditados.
  - Com a Kart Park selecionada, o seletor e a tela de resultado mostram "© colaboradores do
    OpenStreetMap", a menção à licença ODbL e um link para `openstreetmap.org/copyright`.
  - O nome exibido é "Kart Park — São José dos Pinhais (réplica não oficial)", com o comprimento de
    691 m.
  - O recorde de 41,45 s da pista real não aparece, porque ele vale para o traçado oficial de 750 m.
- **US-7** Como Jogador, quero que a Kart Park tenha o acabamento de um kartódromo, para reconhecer o lugar
  e ler a pista enquanto piloto.
  - As duas bordas do asfalto têm uma faixa branca contínua de 0,10 m de largura, por dentro do asfalto,
    em toda a volta.
  - Rodar sobre a faixa de borda é rodar no asfalto: a aderência, a saída de pista e o corte não mudam.
  - A zebra aparece com relevo: rente ao asfalto do lado da pista e com no máximo 0,05 m de altura do
    lado de fora.
  - O kart não sobe, não pula e não é desviado pela zebra. A aderência, a vibração e o som da zebra
    continuam como em US-5.
  - A barreira de US-4 aparece como uma fileira de pneus pretos empilhados, com 0,9 m de altura, em toda
    a extensão dela.
  - A face dos pneus desenhados fica a no máximo 0,05 m da face de colisão da barreira, dos dois lados:
    o kart para quando encosta nos pneus que o jogador vê.
  - Nenhum pneu invade o asfalto nem a zebra.
  - Com a Kart Park selecionada, a grama mostra ao menos dois tons de verde. Cada tom difere da cor de
    grama de hoje (`#68865b`) entre 8 % e 20 % em luminância.
  - O desenho da grama é o mesmo toda vez que a Kart Park abre, em qualquer aparelho.
  - Todos os tons de grama são grama para a simulação.
  - Com a pista sintética selecionada, nada muda na aparência dela.

## Regras de domínio

| Regra | Fonte |
|---|---|
| Circuito fechado de 400 a 1500 m | RF02 |
| Pista em metros e no sentido de corrida, preparada offline | RF03, RF06, I10 |
| Largura do OSM quando houver, senão 8 m. Aqui a largura é fixa em 7 m, da réplica, um desvio aceito. | RF04, decisões de 2026-10-22 e 2026-11-06 |
| Asfalto, zebras nas curvas, grama e barreiras | RF07 |
| Largada, 4 setores e chegada | RF09 |
| Volta que pula marcador é inválida | RF10, `race-lap-validation` |
| Uma pista publicada nunca muda em sua versão. Mudar é publicar versão nova. | I3, I5 |
| Crédito OSM e menção à ODbL quando houver dado OSM | RNF09, D-DP-04 ratificado |
| Seletor só de treino. A escolha de pista do desafio diário é de outra feature. | I1, RF14, decisão de 2026-10-22 |
| Traçado da réplica não oficial (retas e arcos), apresentado como réplica não oficial | decisão de 2026-11-06 |
| Barreira física nos trechos quase encostados | decisão de 2026-10-22 |
| Zebra conta como pista, com 85 % de aderência e vibração no celular | decisão de 2026-10-22 |
| Zebras por regra: por dentro das curvas de raio menor que 30 m e por fora na saída das de raio menor que 16 m | decisão de 2026-11-06 |
| Faixa de borda, relevo da zebra, pneus e tons da grama são só desenho | I2, decisão de 2026-11-03 |

## Requisitos não funcionais

| Requisito | Limite |
|---|---|
| Arquivo da pista | menor que 200 KB (RNF02) |
| Taxa de quadros na Kart Park | 60 fps em notebook e 30 fps em celular intermediário (RNF03), com o acabamento de US-7 |
| Determinismo | mesmas entradas, mesmo tempo e mesmos setores na Kart Park (RNF07) |
| Acabamento sem efeito na volta | na versão 2, as mesmas entradas dão o mesmo tempo, os mesmos setores e a mesma trajetória com e sem o acabamento de US-7 desenhado |
| Jogar sem servidor | sim (RNF08) |
| Crédito visível | 100 % das telas listadas em US-6 com a Kart Park selecionada (RNF09) |

## Restrições

- A pista sintética continua sendo a pista dos ensaios automáticos de `dirigibilidade` e de
  `race-lap-validation`. Motivo: esses ensaios têm números calibrados nela.
- A pista é convertida offline para o formato que o jogo lê, com os eixos do jogo: leste = +x,
  norte = −z. Motivo: I10; com outro mapeamento, o circuito fica espelhado.
- Nenhuma dependência nova de execução.
- A revisão 3 publica a pista como `kart-park` versão 2. O arquivo publicado da versão 1 continua no
  repositório, byte a byte igual. Motivo: I3/I5, uma pista publicada nunca muda em sua versão.
- O acabamento de US-7 continua o mesmo e passa a acompanhar o traçado novo. Motivo: ele já foi aprovado
  na revisão 2, e a revisão 3 muda só o traçado.
- A aparência da pista sintética não muda. Motivo: o acabamento é desta pista real, e a sintética segue
  como pista de ensaio.

## Impacto no domínio

- **I1**: o seletor é só de treino. A pista de cada desafio diário continua sendo decidida pela feature
  do desafio.
- **I2**: geometria, largura, zebra e barreira entram na simulação como dado. A tela só desenha. O
  acabamento de US-7 fica todo do lado do desenho.
- **I3 / I5**: a revisão 3 é a versão 2 de `kart-park`. A versão 1 não é alterada.
- **I6**: crédito e licença dos dados derivados. A réplica é derivada do traçado da versão 1.
- **I8**: o contrato de passo não muda. O efeito da zebra é um dado de superfície.
- **I10**: nenhum editor de pista no jogo.

## Riscos e incógnitas

OPEN-02 a OPEN-04 foram fechados pelo dono do produto em 2026-10-22, e as decisões estão em `DOMAIN.md`.

- **OPEN-01** Licença da imagem Esri: o traçado da versão 1 foi medido sobre a Esri World Imagery, e a
  réplica foi ajustada sobre ele. Pode-se publicar dado derivado dela? Quem decide, e com qual evidência?
  **Bloqueia só a promoção para produção.** Staging pode usar a pista.
- **OPEN-02** Tolerância da suavização: 0,30 m. Fechado em 2026-10-22. A revisão 3 não suaviza mais o
  traçado, e a regra que vale agora é a de 0,10 m de US-2.
- **OPEN-03** Atalhos pela grama: os marcadores a cada 25 m bastam. Fechado em 2026-10-22.
- **OPEN-04** Som da zebra no teclado: ruído curto e grave que se repete. Fechado em 2026-10-22.

A revisão 3 não abre ponto novo.

## Fora do escopo

- As outras duas pistas reais da etapa 3, um catálogo de pistas e o calendário do desafio diário.
- Elevação do terreno (I10).
- Medalhas e cores de setor (D15, D16).
- Recorde da pista real e qualquer comparação com tempos reais.
- O cenário além de asfalto, zebra, grama e barreiras, como árvores, tribuna e boxes, que é de outra
  feature.
- Zebra com relevo na física (o kart subir ou trepidar na zebra): o relevo de US-7 é só desenho.
- Chão com foto de satélite ou textura baixada da rede.
- Aproximar o traçado dos 750 m oficiais: o caminho OSM de origem fecha em 676 m, e corrigir pede uma fonte
  nova de medição (`NOTES.md`).
- Escolher a versão 1 da Kart Park no jogo: ela deixa o seletor.
