---
title: Glossário — modelo Kart 01 e câmera de jogo
feature: modelo-kart-01
stage: req
status: validated
version: 1.4.0
sources: [SEED, DOMAIN]
---

# Glossário

Os termos valem igualmente em `web-desktop` e `web-mobile`, salvo indicação.

| Termo | Definição | Canal |
|---|---|---|
| Jogador | Quem pilota o kart e o vê pela câmera de corrida: com teclado (`web-desktop`) ou com inclinação e toque (`web-mobile`) | ambos |
| Kart 01 | O kart de aluguel low-poly em escala real, com piloto, definido pela ficha "Kart 01 — Kartle" e montado a partir do código do Cowork (`SEED/RD-04`, `SEED/RD-05`) | ambos |
| Kart provisório | O volume de caixas exibido hoje como kart, maior que um kart real; retirado por esta feature (US-0001) | ambos |
| Ficha "Kart 01 — Kartle" | Ficha de design que define medidas, peças, cores, piloto e câmera de jogo do Kart 01; referência para conferir o resultado (`SEED/RD-04`, `DOMAIN/DEC-00`) | nenhum (referência) |
| Código do Cowork | O código que monta o modelo, escrito no chat do Cowork e salvo sem alteração em `docs/kart-01/kart.js`; fonte do modelo (`SEED/RD-05`, `DOMAIN/DEC-00`) | nenhum (fonte) |
| Modelo montado | O Kart 01 com o piloto, tal como montado para a cena do jogo; é sobre ele que forma, medidas, nomes de peças e custo de desenho são verificados, na saída de `npm test` (`SEED/IM-I9`) | ambos |
| Grupo de peça | Parte nomeada do modelo montado que exibe uma peça do quadro "Peças separadas" da ficha; são 15 grupos de peças do kart (US-0001) | ambos |
| Grupo do piloto | O 16º grupo nomeado, `piloto`, à parte dos 15 grupos de peças; contém o piloto de macacão azul e capacete branco, com os braços que acompanham o volante | ambos |
| Caixa envolvente do kart | Menor caixa alinhada aos eixos do kart que contém os 15 grupos de peças do modelo montado; seu comprimento é medido no eixo longitudinal do kart e sua largura no eixo transversal | ambos |
| Entre-eixos | Distância, no eixo longitudinal do kart, entre o centro das rodas dianteiras e o centro das rodas traseiras | ambos |
| Bitola | Distância, no eixo transversal do kart, entre os centros das duas rodas de um mesmo eixo (dianteiro ou traseiro) | ambos |
| Diâmetro da roda (Ø) | Diâmetro externo da roda com o pneu | ambos |
| Medida ao centímetro | Valor medido arredondado ao centímetro e comparado ao valor que o seed dá com duas casas decimais em metros; usado onde o seed não dá tolerância | ambos |
| Chamada de desenho do kart | Unidade de custo de desenho, contada como o seed contou as 124 do código do Cowork: uma por malha e por material de cada malha do modelo montado, kart com o piloto (`SEED.md`, ponto aberto 01; `DOMAIN/DEC-01`) | ambos |
| Agrupamento por material | Junção das malhas do modelo que usam o mesmo material, sem mudar a forma, para reduzir as chamadas de desenho; rodas, volante e braços continuam animáveis (`DOMAIN/DEC-01`) | ambos |
| Posição do kart | O ponto que a simulação informa como posição do kart; é a referência de "atrás" e "à frente" da câmera | ambos |
| Rumo | Direção para onde aponta a frente do kart, tal como a simulação informa; o sentido de marcha para a frente | ambos |
| Ângulo de esterço | Ângulo das rodas dianteiras em relação ao chassi que a simulação informa para cada quadro | ambos |
| Quadro | Uma imagem exibida na tela | ambos |
| Em corrida | Do sinal verde até a próxima visão geral da pista. Não termina quando uma volta acaba, válida ou invalidada, inclusive por reposicionamento, nem quando o painel de resultado aparece. Na volta oficial, depois do fim da volta (`ENDED`), com o painel de resultado exibido, a simulação está parada e o kart congelado, como hoje, e a câmera continua na pose de corrida em relação ao kart parado, até a próxima visão geral (`DOMAIN/DEC-06`). No treino, as voltas são seguidas: no fim de uma volta o kart não congela, continua pilotável, e a câmera continua na pose de corrida em relação a ele (`DOMAIN/DEC-07`). O congelamento e a continuidade das voltas são de `race-lap-validation`; esta feature não cria requisito de pilotagem | ambos |
| Volta oficial | Volta que, ao terminar (`ENDED`), válida ou invalidada, para a simulação e congela o kart, como hoje (invariante INV-1 de `race-lap-validation`); é a única volta em que o congelamento vale (`DOMAIN/DEC-07`) | ambos |
| Treino | Modo de jogo em que as voltas são seguidas (`race-lap-validation` revisão 3, US-10): no fim de uma volta, válida ou invalidada, o kart não congela, continua pilotável, e a câmera continua atrás do piloto (`DOMAIN/DEC-07`) | ambos |
| Câmera de corrida | Câmera de jogo da ficha, usada em corrida: 1,38 m acima do chão, 3,05 m atrás do kart, mirando um ponto 3,2 m à frente do kart e 0,30 m acima do chão (`SEED/US-3`) | ambos |
| Pose de corrida | Posição e ponto de mira da câmera de corrida em relação ao kart exibido | ambos |
| Chão | O plano da pista, sem elevação (I10) | ambos |
| Campo de visão vertical / horizontal | Ângulo de abertura da câmera na vertical / na horizontal da área de jogo exibida | ambos |
| Paisagem | Área de jogo mais larga que alta ou tão larga quanto alta | ambos |
| Retrato | Área de jogo mais alta que larga; em `web-desktop`, uma janela mais alta que larga também é retrato | ambos |
| Corte | Quadro em que a câmera deixa a pose de corrida em relação ao kart exibido, passando a outro ponto de vista | ambos |
| Visão geral da pista | Vista do alto em que a pista aparece inteira no quadro; é a vista antes da contagem regressiva, e existe só antes dela: não volta no fim de uma volta, oficial ou de treino, nem com o painel de resultado exibido (`SEED.md`, ponto aberto 04; `DOMAIN/DEC-04`; `DOMAIN/DEC-06`; `DOMAIN/DEC-07`) | ambos |
| Contagem regressiva | Contagem exibida antes da largada, que termina no sinal verde; já existe no jogo | ambos |
| Sinal verde | Fim da contagem regressiva e início da corrida | ambos |
| Fim da volta | Momento em que uma volta termina, válida ou invalidada, inclusive por reposicionamento. Na volta oficial é o estado `ENDED`: a partir dele a simulação para e o kart congela, como hoje (invariante INV-1 de `race-lap-validation`; `DOMAIN/DEC-06`). No treino, o kart não congela e as voltas são seguidas (`DOMAIN/DEC-07`). Já existe no jogo, e esta feature não o muda (`SEED/RE-01`) | ambos |
| Painel de resultado | Painel exibido na tela quando a volta oficial termina, sobre a cena com a simulação parada e o kart congelado; já existe no jogo, e esta feature não o muda nem move a câmera por causa dele (`DOMAIN/DEC-06`) | ambos |
| Efeito de turbo no campo de visão | Variação do campo de visão vertical que o jogo aplicava enquanto o turbo estava ativo; deixou de existir com a retirada do turbo: a câmera de corrida tem só o campo de visão base, 62° em paisagem e a regra de retrato (`SEED/US-3` na `revision: 3`; `DOMAIN/DEC-07`; `DOMAIN/DEC-08`; US-0003, critérios 04 a 06) | ambos |
| Marcas de pneu | Rastros deixados no chão pelas rodas traseiras | ambos |
| Fumaça ou chama de turbo | Fumaça ou chama que o jogo exibia saindo do escapamento do kart, ligada ao turbo; deixou de existir com a retirada do turbo (`dirigibilidade` revisão 4; `SEED/US-5`, segundo critério; `DOMAIN/DEC-07`) e não aparece em nenhum quadro com o Kart 01 (US-0005) | ambos |
| Indicação de drift | Efeito visual que o jogo exibia junto às rodas traseiras durante o drift; deixou de existir com a retirada do drift (`dirigibilidade` revisão 4; `SEED/US-5`, segundo critério; `DOMAIN/DEC-07`) e não aparece em nenhum quadro com o Kart 01 (US-0005) | ambos |
| `wheelPositions` | Posições das rodas que a simulação informa e usa para marcas de pneu e telemetria; contrato da simulação, citado da seção Restrições do seed (`SEED/RE-03`) | ambos |
| Sombra do kart | Sombra que o kart exibido projeta no chão (`DOMAIN/DEC-05`) | ambos |
| Taxa de quadros | Quadros exibidos por segundo (fps), contados a cada segundo | ambos |
| Taxa de quadros sustentada | Taxa de quadros que não fica abaixo do limite em nenhum segundo do intervalo medido | ambos |
| Aparelhos de referência de RNF03 | O notebook e o celular intermediário escolhidos para medir RNF03; uma execução em desktop não vale como evidência para celular (I9) | ambos, por aparelho |
| Download inicial | Bytes transferidos, com compressão, para carregar o jogo numa primeira visita com cache vazio (RNF02) | ambos |
| Dependência de execução | Biblioteca que o jogo carrega para rodar no navegador | ambos |
| Sensor de inclinação | Sensor do celular que alimenta a direção em `web-mobile`; ausente ou com permissão negada, o controle recai para toque com estado visível (I4); esta feature não muda esse comportamento | `web-mobile` |
