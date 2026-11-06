---
title: Glossário — pista Kart Park
feature: pista-kart-park
stage: req
status: validated
version: 2.0.0
sources: [SEED, DOMAIN]
---

# Glossário

Os termos valem igualmente em `web-desktop` e `web-mobile`, salvo indicação.

| Termo | Definição | Canal |
|---|---|---|
| Jogador | Quem escolhe a pista no treino e pilota o kart | ambos |
| Curador do catálogo | Quem prepara a pista offline: conversão, linhas de volta e versão (`SEED.md`, Atores e canais) | nenhum (dado) |
| Kart Park | Pista real de kart em São José dos Pinhais (PR); primeira pista real do Kartle, identificada como `kart-park`; no jogo, a versão 2, a réplica não oficial | ambos |
| Pista sintética | A pista que o jogo já tem; continua selecionável e continua sendo a pista dos ensaios automáticos de `dirigibilidade` e `race-lap-validation` | ambos |
| Seletor de pista | Controle da tela inicial que oferece a Kart Park e a pista sintética para o treino (`SEED/US-1`) | ambos |
| Treino | Sessão de pilotagem livre numa pista escolhida no seletor; não gera tentativa nem resultado de desafio diário (I1, `DOMAIN/DEC-06`) | ambos |
| Desafio diário | Desafio do dia, ligado a um `challengeNumber` que resolve para uma pista e uma versão (I1); ainda não existe e é de outra feature | ambos |
| Réplica não oficial | O traçado da Kart Park versão 2: o desenho da pista real refeito com retas e arcos de raio constante, ligados por transições de 5 m, com largura fixa de 7 m e zebras por regra; 690,7 m, 7,9 % mais curto que o traçado oficial de 750 m (`DOMAIN/DEC-13`, `SEED/MED`) | ambos |
| Traçado da versão 1 | O traçado de `kart-park.json`, formato `kartle-pista` v1, gerado do caminho OpenStreetMap `way/128739206` e de bordas detectadas na Esri World Imagery; foi a Kart Park versão 1 e é a base sobre a qual a réplica foi ajustada (`SEED.md`, Contexto) | nenhum (dado) |
| Arquivo da réplica | `replica/kart-park-replica.json`, formato `kartle-pista`, aprovado pelo dono do produto em 2026-11-06: pontos da linha central, largura, 33 elementos e 22 zebras; não traz chegada, limites de setor nem marcadores (`SEED.md`, Contexto) | nenhum (dado) |
| Elemento | Cada uma das 33 partes do arquivo da réplica: uma reta ou um arco de raio constante, com distância de volta de início e comprimento (16 retas e 17 arcos, `SEED/MED`) | nenhum (dado) |
| Arquivo de pista gerado | O arquivo da Kart Park versão 2 produzido offline a partir do arquivo da réplica, no formato que o jogo lê, com linha central, larguras, setores, chegada, marcadores, zebras e barreira | nenhum (dado) |
| Linha central da réplica | A poligonal dos pontos do arquivo da réplica, no sentido de corrida, começando na largada | nenhum (dado) |
| Ponto 0 | O primeiro ponto da linha central, onde ficam a linha de largada e a linha de chegada | ambos |
| Distância de volta | Distância medida ao longo da linha central, a partir do ponto 0, no sentido de corrida, em metros | ambos |
| Sentido de corrida | Anti-horário, visto de cima (`SEED/MED`) | ambos |
| Eixos do jogo | Mapeamento das direções geográficas no jogo: leste = +x, norte = −z (`SEED/RE-03`) | ambos |
| Largura do asfalto | Largura da pista em cada ponto da linha central; na Kart Park versão 2, 7,0 m fixos, da réplica; desvio aceito da regra geral "largura do OSM quando houver, senão 8 m" (`SEED/RD-03`) | ambos |
| Borda do asfalto | Cada uma das duas linhas a meia largura do asfalto da linha central, perpendicular a ela, uma de cada lado | ambos |
| Borda da pista | O limite de fora da pista para a saída de pista e o corte: a borda do asfalto ou, onde há zebra, a borda de fora da zebra, porque rodar sobre a zebra conta como estar na pista (`SEED/US-5`) | ambos |
| Grampo | Curva em que a pista volta quase no sentido contrário; os dois grampos da réplica que o seed cita têm raio 15,5 m (220°) e 14,4 m (176°) (`SEED/MED`) | ambos |
| Curva mais fechada | Na réplica, o arco de raio 8,8 m, à esquerda, de 86°, perto de 216 m de volta (`SEED/MED`) | ambos |
| Grama | Superfície fora do asfalto e da zebra; tem ≈ 40 % da aderência do asfalto (`DOMAIN/DEC-05`, referência) | ambos |
| Trechos quase encostados | Duas partes da pista que não se seguem ao longo da volta e têm 6 m de grama ou menos entre as bordas do asfalto; a medição da réplica encontrou um par: ≈ 369–406 m e ≈ 595–624 m de volta, com no mínimo 1,28 m de grama (`SEED/US-4`, `SEED/MED`) | ambos |
| Atalho pela grama | Passagem do kart pela grama entre duas partes da pista que encurta a volta; com mais de 6 m de grama entre as bordas, é invalidado pelos marcadores, sem barreira (`DOMAIN/DEC-10`) | ambos |
| Barreira | Obstáculo físico acrescentado por esta feature entre os trechos quase encostados; o kart bate e não passa (`DOMAIN/DEC-03`) | ambos |
| Muro existente | O obstáculo que o jogo já tem; a barreira tem o mesmo efeito de colisão que ele (`SEED/US-4`) | ambos |
| Zebra | Faixa declarada por lado (esquerda ou direita, no sentido de corrida) e por trecho de volta; conta como pista e dá a cada pneu 85 % da aderência do asfalto (`DOMAIN/DEC-05`) | ambos |
| Trecho de zebra | Uma zebra contínua entre duas distâncias de volta, num lado declarado; o arquivo da réplica tem 22, 430,7 m no total, e nenhum cruza a linha de largada (`SEED/US-5`, `SEED/MED`) | ambos |
| Zebras por regra | A regra com que as zebras da réplica foram postas: por dentro das curvas de raio menor que 30 m e por fora na saída das de raio menor que 16 m (`SEED/RD-14`, `DOMAIN/DEC-13`) | nenhum (dado) |
| Aderência | Capacidade do pneu de transmitir força ao chão; nesta feature é expressa em relação à do mesmo pneu no asfalto, nas mesmas condições | ambos |
| Vibração da zebra | Pulso de vibração do aparelho de 20 ms a cada 0,25 s enquanto houver ao menos uma roda na zebra, se o navegador permitir (`DOMAIN/DEC-05`) | `web-mobile` |
| Som da zebra | Som próprio de rodar na zebra: um ruído curto e grave que se repete enquanto houver ao menos uma roda na zebra, com o som ligado (`DOMAIN/DEC-11`) | `web-desktop` |
| Setor | Cada um dos quatro trechos da volta, com limites em retas (RF09, `SEED/US-3`) | ambos |
| Limite de setor | Linha transversal à pista que separa dois setores; os três internos ficam em retas, perto de 204,9 m, 354,9 m e 534,7 m de volta (`SEED/US-3`) | ambos |
| Linha de largada | Linha transversal no ponto 0 de onde o kart parte | ambos |
| Linha de chegada | Na Kart Park, a própria linha de largada (`SEED/US-3`) | ambos |
| Marcador de percurso | Ponto de controle ao longo da volta pelo qual a volta precisa passar para ser válida; na Kart Park, a no máximo 25 m um do outro (RF10, `SEED/US-3`) | ambos |
| Marcador pulado | Motivo de invalidação de uma volta que não passou por um marcador de percurso (RF10) | ambos |
| Corte | Invalidação da volta quando o kart fica mais de 3 m além da borda da pista por mais de 1000 ms; limites padrão de `race-lap-validation`, citados pelo seed | ambos |
| Saída de pista | Estado do kart fora da pista; rodar sobre a zebra não é saída (`SEED/US-5`) | ambos |
| Tela de resultado | Tela exibida ao fim de uma volta, com o tempo da volta | ambos |
| Crédito OSM | Linha com "© colaboradores do OpenStreetMap", a menção à licença ODbL e um link para `openstreetmap.org/copyright` (`DOMAIN/DEC-07`) | ambos |
| ODbL | Open Database License, a licença dos dados do OpenStreetMap | ambos |
| Esri World Imagery | Imagem de satélite sobre a qual foram medidas as bordas do traçado da versão 1, base da réplica; a licença para publicar dado derivado dela é decidida antes da promoção para produção e vale para as duas versões (`DOMAIN/DEC-08`, `DOMAIN/DEC-13`) | nenhum (dado) |
| Versão da pista | O `trackVersion` publicado de uma pista; uma versão publicada nunca muda, e mudar a pista é publicar versão nova (I3, I5). A Kart Park tem a versão 1 (traçado da versão 1, fora do seletor) e a versão 2 (réplica não oficial, no seletor) | nenhum (dado) |
| Staging / produção | Os dois ambientes de publicação; a Kart Park fica só em staging até a decisão sobre a licença Esri (`DOMAIN/DEC-08`) | ambos |
| Acabamento | O desenho de kartódromo da Kart Park aprovado na revisão 2: faixa de borda, relevo da zebra, barreira de pneus e tons de grama; é só desenho, não entra na simulação e acompanha o traçado da versão 2 (`SEED/US-7`, `SEED/RD-13`, `SEED/RE-08`) | ambos |
| Cena desenhada | O que a tela desenha, com as medidas em metros do mundo do jogo, de onde se leem larguras, alturas e distâncias do acabamento | ambos |
| Faixa de borda | Faixa branca contínua de 0,10 m de largura, por dentro do asfalto, junto a cada borda do asfalto, em toda a volta da Kart Park; para a simulação é asfalto (`SEED/US-7`) | ambos |
| Relevo da zebra | Altura desenhada da zebra: 0 m na borda do lado do asfalto e no máximo 0,05 m na borda de fora; não entra na simulação (`SEED/US-7`, `SEED/FE-06`) | ambos |
| Barreira de pneus | Desenho da barreira de US-0004 como fileira de pneus pretos empilhados com 0,9 m de altura, com a face a no máximo 0,05 m da face de colisão (`SEED/US-7`) | ambos |
| Face de colisão | Superfície da barreira, dada no arquivo de pista, em que o kart bate e para | ambos |
| Tom de grama | Cada verde em que a grama da Kart Park é desenhada; são ao menos 2, e todos são grama para a simulação (`SEED/US-7`) | ambos |
| Cor de grama de hoje | `#68865b`, a cor de grama de antes da revisão 2, referência dos tons de grama (`SEED/US-7`) | ambos |
| Luminância relativa | Luminância de uma cor na definição da WCAG 2; a de cada tom de grama difere da de `#68865b` entre 8 % e 20 % desse valor | ambos |
