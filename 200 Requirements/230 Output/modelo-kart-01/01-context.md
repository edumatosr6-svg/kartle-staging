---
title: Contexto — modelo Kart 01 e câmera de jogo
feature: modelo-kart-01
stage: req
status: validated
version: 1.4.1
sources: [SEED, DOMAIN]
---

# Contexto

## O que é a feature

O kart que o Jogador vê hoje é um volume provisório de caixas, maior que um kart real e visto de uma
câmera alta e distante. Esta feature coloca na pista o **Kart 01**: um kart de aluguel low-poly em escala
real, com chassi, rodas, nariz, sidepods, para-choque com o número 01, banco, direção, pedais, motor e um
piloto de macacão azul e capacete branco; e troca a câmera de corrida por uma câmera atrás e perto do
piloto, para que o Jogador sinta que está pilotando um kart (`SEED.md`, Visão geral).

O dono do produto testou o build publicado e relatou que "não parece que estou dirigindo um kart". A
física está sendo refeita na feature `dirigibilidade`; esta feature cuida só do que o Jogador **vê**: o
modelo, a câmera e os efeitos presos ao kart (`SEED.md`, Contexto). A ficha de design "Kart 01 — Kartle"
define medidas, peças, cores, piloto e câmera de jogo (`SEED/RD-04`); o código que monta o modelo foi
escrito no chat do Cowork, está salvo sem alteração em `docs/kart-01/kart.js` e é a fonte do modelo,
enquanto a ficha é a referência para conferir o resultado (`SEED/RD-05`, `DOMAIN/DEC-00`).

Seed: `200 Requirements/220 Input/modelo-kart-01/SEED.md`, `revision: 3`, `date: 2026-10-29`, autor
`eduardo.matos`. Camada de domínio durável: `DOMAIN.md` da mesma pasta, cujas decisões de 2026-10-22
fecham todos os pontos em aberto do seed (01 a 05) e prevalecem sobre eles; uma sexta decisão da mesma
data, tomada depois da parada do F-Spec, fixa o que a câmera faz depois do fim da volta
(`DOMAIN/DEC-06`). Essa decisão foi corrigida pelo dono do produto na mesma data, depois de um feedback
do D-Spec: a frase "o kart continua pilotável" não vale; quando a volta termina (`ENDED`) e o painel de
resultado aparece, a simulação para e o kart congela, como hoje (invariante INV-1 de
`race-lap-validation`), e a decisão descreve só a câmera. O rótulo `DOMAIN/DEC-06` carrega a decisão já
corrigida. Uma sétima decisão, de 2026-10-29 (`DOMAIN/DEC-07`), limita esse congelamento à volta oficial:
no treino as voltas são seguidas (`race-lap-validation` revisão 3, US-10), o kart não congela ao fim de
uma volta de treino, continua pilotável e a câmera continua atrás do piloto; e registra que o drift e o
turbo saíram do jogo (`dirigibilidade` revisão 4), então a indicação de drift e a fumaça do escapamento
ligada ao turbo deixam de existir e as marcas de pneu continuam. O seed `revision: 2` muda a quinta
história na mesma linha. Uma oitava decisão, da mesma data (`DOMAIN/DEC-08`), tira a consequência para a
câmera: sem turbo, não há efeito de turbo no campo de visão, e a câmera de corrida tem só o campo de visão
base (62° e a regra de retrato); o seed `revision: 3` tira da terceira história o critério desse efeito.
Este conjunto usa só os valores dessas decisões.

## Atores e canais

| Ator | Canal | Papel nesta feature |
|---|---|---|
| Jogador | `web-desktop` | Vê o kart e a pista pela câmera de corrida enquanto pilota com o teclado |
| Jogador | `web-mobile` | O mesmo no celular, em paisagem ou em retrato; pilota com inclinação e toque e, com sensor ausente ou permissão negada, recai para toque com estado visível (I4) |

Canal fora do escopo: `remote-wheel` (o quadro "Celular como volante" da ficha), pós-MVP (I10; `SEED.md`,
Atores e canais e Fora do escopo). Nenhuma história deste conjunto o cobre.

O que difere entre os canais nesta feature é só a forma da área de jogo: em `web-mobile` o Jogador pode
estar em paisagem ou em retrato, e a regra de campo de visão muda com a orientação (`DOMAIN/DEC-03`). A
regra vale pela forma da área de jogo, não pelo canal: uma janela de `web-desktop` mais alta que larga
segue a regra de retrato. Modelo, medidas, peças, cores, animação, efeitos e pose da câmera são os mesmos
nos dois canais. Os controles não mudam nesta feature: o modelo mostra o estado da simulação qualquer que
seja o adaptador que produziu o `Input` (`SEED/RD-01`, I2).

## Itens do seed e decisões de domínio (chave de rastreabilidade)

Os rótulos abaixo nomeiam os itens do seed e as decisões de `DOMAIN.md`, que não têm identificador próprio;
o `sources:` de cada história e de cada NFR os cita. A matriz gerada (`99-traceability.md`) liga cada
rótulo aos itens deste conjunto.

| Rótulo | Item |
|---|---|
| `SEED/US-1` … `SEED/US-5` | As cinco histórias de usuário da seção Histórias de usuário, na ordem do seed |
| `SEED/RD-01` | A renderização mostra o estado da simulação e não decide nada (I2) |
| `SEED/RD-02` | Passo fixo, presets e `Input` não mudam por causa do modelo (I8, feature `dirigibilidade`) |
| `SEED/RD-03` | Um único kart; karts customizáveis estão fora do MVP (I10, `requirements/01`) |
| `SEED/RD-04` | Medidas, peças, cores, piloto e câmera vêm da ficha "Kart 01 — Kartle" (decisão do dono do produto, 2026-10-22) |
| `SEED/RD-05` | A fonte do modelo é o código do Cowork salvo em `docs/kart-01/kart.js` (decisão do dono do produto, 2026-10-22) |
| `SEED/NF-01` | Taxa de quadros com o modelo: 60 fps em notebook e 30 fps em celular intermediário (RNF03) |
| `SEED/NF-02` | Tamanho do download inicial continua abaixo de 3 MB (RNF02) |
| `SEED/NF-03` | Nenhuma nova dependência de execução |
| `SEED/NF-04` | Custo de desenho do kart dentro do limite do ponto aberto 01 |
| `SEED/RE-01` | Nenhuma mudança em `src/physics.ts`, `src/lap.ts`, `src/track.ts` ou nos presets |
| `SEED/RE-02` | O modelo é montado em Three.js 0.186; o código do Cowork é adaptado se usar outra versão, e nenhuma versão nova entra como dependência |
| `SEED/RE-03` | As posições das rodas que a simulação usa para marcas de pneu e telemetria continuam vindo de `wheelPositions` |
| `SEED/IM-I2` | Tudo fica na camada de aplicação; a simulação não importa nada do modelo |
| `SEED/IM-I8` | O contrato de passo não é tocado |
| `SEED/IM-I9` | Forma e medida verificadas sobre o modelo montado (caixa envolvente, nomes das peças); câmera e taxa de quadros verificadas em tela |
| `SEED/IM-I10` | Um único kart, sem personalização |
| `SEED/FE-01` | Fora do escopo: celular como volante (pós-MVP) |
| `SEED/FE-02` | Fora do escopo: mudanças na física, nos presets ou nas medidas usadas pela simulação |
| `SEED/FE-03` | Fora do escopo: outros karts, cores escolhíveis ou adesivos personalizados (I10) |
| `SEED/FE-04` | Fora do escopo: novas pistas e cenário (a pista real Kart Park é outra feature) |
| `DOMAIN/DEC-00` | Fonte do modelo: o código do Cowork, salvo sem alteração em `docs/kart-01/kart.js`; a ficha é a referência para conferir |
| `DOMAIN/DEC-01` | Ponto aberto 01 fechado: as 124 malhas são agrupadas por material, para no máximo 30 chamadas de desenho do kart com o piloto, sem mudar a forma; rodas, volante e braços continuam animáveis |
| `DOMAIN/DEC-02` | Ponto aberto 02 fechado: as medidas da física não são alinhadas ao modelo nesta feature; fica para depois da `dirigibilidade` |
| `DOMAIN/DEC-03` | Ponto aberto 03 fechado: em retrato, o campo de visão horizontal é de pelo menos 60°, então o vertical cresce em retrato; em paisagem, o vertical é de 62° |
| `DOMAIN/DEC-04` | Ponto aberto 04 fechado: antes da largada, a câmera mostra a pista do alto e desce para trás do piloto durante a contagem regressiva; no sinal verde, ela já está na posição de corrida |
| `DOMAIN/DEC-05` | Ponto aberto 05 fechado: o kart projeta sombra no chão |
| `DOMAIN/DEC-06` | Câmera depois do fim da volta (decisão de 2026-10-22, após parada do F-Spec, corrigida na mesma data após feedback do D-Spec): quando a volta termina (`ENDED`), válida ou invalidada, inclusive por reposicionamento, e o painel de resultado aparece, a simulação para e o kart congela, como hoje (invariante INV-1 de `race-lap-validation`); a decisão descreve só a câmera: ela continua atrás do piloto, na pose de corrida, com o kart parado, até a próxima visão geral (antes da contagem da volta seguinte); a visão geral do alto existe só antes da contagem regressiva; "em corrida", para a câmera, vai do sinal verde até a próxima visão geral, sem terminar em `ENDED`; a frase "o kart continua pilotável" da redação original não vale, nenhum requisito de pilotagem depois de `ENDED` existe nesta feature e nada muda em `race-lap-validation`; desde `DOMAIN/DEC-07`, o congelamento vale só para a volta oficial |
| `DOMAIN/DEC-07` | Treino contínuo e fim do drift e do turbo (decisão de 2026-10-29, Eduardo Matos): no treino as voltas são seguidas (`race-lap-validation` revisão 3, US-10), então o kart não congela ao fim de uma volta de treino, continua pilotável e a câmera continua atrás do piloto; o congelamento de `DOMAIN/DEC-06` passa a valer só para a volta oficial; o drift e o turbo saíram do jogo (`dirigibilidade` revisão 4), então a indicação de drift e a fumaça do escapamento ligada ao turbo deixam de existir; as marcas de pneu continuam |
| `DOMAIN/DEC-08` | Sem efeito de turbo na câmera (decisão de 2026-10-29, registrada em `DOMAIN.md` como consequência de `DOMAIN/DEC-07`): com o turbo retirado, o critério da terceira história "o efeito de campo de visão do turbo continua funcionando" sai do seed (`revision: 3`); a câmera de corrida tem só o campo de visão base, 62° e a regra de retrato |

## Decisões de domínio aplicadas

| Decisão | Histórias e NFRs |
|---|---|
| `DOMAIN/DEC-00` | US-0001 (peças e cores conferidas contra a ficha; o modelo vem do código do Cowork) |
| `DOMAIN/DEC-01` | NFR-0004 (no máximo 30 chamadas de desenho; forma inalterada), US-0002 (rodas, volante e braços animáveis) |
| `DOMAIN/DEC-02` | NFR-0006 e NFR-0007 (medidas da simulação e `wheelPositions` inalteradas); US-0005 (diferença conhecida entre as rodas da simulação e as do modelo) |
| `DOMAIN/DEC-03` | US-0003 (campo de visão em paisagem e em retrato) |
| `DOMAIN/DEC-04` | US-0003 (visão geral antes da contagem, descida durante a contagem, pose de corrida no sinal verde) |
| `DOMAIN/DEC-05` | US-0001 (sombra do kart), US-0004 e NFR-0001 (taxa de quadros medida com a sombra) |
| `DOMAIN/DEC-06` | US-0003 (critério 13: pose de corrida mantida depois do fim da volta oficial, em relação ao kart parado, com a simulação parada e o painel de resultado exibido, até a próxima visão geral); US-0002 e US-0005 (caso anormal "Fim da volta oficial"); os termos "Em corrida", "Fim da volta", "Volta oficial" e "Painel de resultado" do glossário — "Em corrida" é o termo que os critérios de US-0002, US-0004, US-0005 e NFR-0001 usam |
| `DOMAIN/DEC-07` | US-0003 (critério 13 limitado à volta oficial; critério 14: pose de corrida mantida no treino, em relação ao kart em movimento); US-0005 (critérios 04 e 05: sem indicação de drift nem fumaça ou chama de turbo; critérios 02 e 03 retirados); US-0002 e US-0005 (caso anormal "Fim de uma volta de treino"); os termos "Em corrida", "Treino", "Volta oficial", "Fim da volta", "Indicação de drift" e "Fumaça ou chama de turbo" do glossário |
| `DOMAIN/DEC-08` | US-0003 (critérios 04 a 06: só o campo de visão base, em todos os quadros; critério 09 retirado; caso anormal "Comando que antes acionava o turbo"); o termo "Efeito de turbo no campo de visão" do glossário |

Não resta ponto em aberto neste conjunto.

## Retiradas e substituições

Esta feature redefine dois comportamentos que o Jogador vê hoje e mantém um terceiro só antes da largada:

| Hoje | Depois desta feature | Onde |
|---|---|---|
| Kart provisório: volume de caixas, maior que um kart real | Retirado. Todo kart exibido é o Kart 01 | US-0001 |
| Câmera de perseguição alta e distante durante a corrida | Retirada em corrida. Substituída pela câmera de jogo da ficha, atrás e perto do piloto | US-0003 |
| Câmera inicial alta, vendo a pista toda | Mantida só antes da contagem regressiva; durante a contagem, desce até a posição de corrida (`DOMAIN/DEC-04`); não volta no fim da volta oficial nem com o painel de resultado exibido (`DOMAIN/DEC-06`), nem no fim de uma volta de treino (`DOMAIN/DEC-07`) | US-0003 |
| Efeito de campo de visão do turbo | Não existe mais: o turbo saiu do jogo, e a câmera de corrida tem só o campo de visão base (`SEED/US-3` na `revision: 3`, `DOMAIN/DEC-07`, `DOMAIN/DEC-08`) | US-0003 |
| Marcas de pneu | Mantidas, nas posições das rodas traseiras do Kart 01 | US-0005 |
| Fumaça ou chama de turbo e indicação de drift | Não aparecem com o Kart 01: o drift e o turbo saíram do jogo pela `dirigibilidade` (revisão 4), não por esta feature (`SEED/US-5`, `DOMAIN/DEC-07`) | US-0005 |

## Padrão seguro

O Kart 01 e a câmera de jogo valem como padrão assim que a feature é entregue, sem chave para voltar ao
kart provisório: o seed não prevê chave, e a mudança é segura ligada porque é só visual — a simulação, o
passo, os presets, a validação de volta e `wheelPositions` não mudam (NFR-0006, NFR-0007), então nenhum
tempo, replay ou resultado muda de valor ou de comparabilidade.

Nenhuma história deste conjunto cria, consome ou altera tentativa, volta, resultado, replay ou dado
persistido do Jogador: I1, I3 e I7 (D-REQ-02, D-REQ-03) não se aplicam, e nenhum evento repetido, recarga ou
abandono muda estado de domínio por causa desta feature.

## Restrições (citadas do seed, seção Restrições)

- "Nenhuma mudança em `src/physics.ts`, `src/lap.ts`, `src/track.ts` ou nos presets. Motivo: a física é da
  feature `dirigibilidade`, e a validação de volta já está validada." — NFR-0006.
- "O modelo é montado em Three.js 0.186, já usado pelo projeto. Se o código do Cowork usar outra versão,
  ele é adaptado, e nenhuma versão nova entra como dependência." — NFR-0003.
- "As posições das rodas que a simulação usa para marcas de pneu e telemetria continuam vindo de
  `wheelPositions`. Motivo: esse é um contrato da simulação, e o modelo é só visual." — NFR-0007 e US-0005.

## Relação com outras features

- **`dirigibilidade`.** A física e os presets são dessa feature (`SEED/RE-01`). As medidas da simulação
  (entre-eixos de 1,04 m e bitola de 1,20 m) diferem das do modelo (entre-eixos de 1,05 m; bitolas de
  1,00 m na frente e 1,14 m atrás), e o dono do produto decidiu não alinhá-las nesta feature
  (`DOMAIN/DEC-02`): o alinhamento, se vier, é decisão da `dirigibilidade`, depois dela. A `dirigibilidade`
  (revisão 4) retirou o drift e o turbo do jogo; esta feature só garante que o Kart 01 não exibe os
  efeitos deles (`SEED/US-5`, `DOMAIN/DEC-07`). Nenhum feedback é enviado: nenhum requisito daquela feature
  precisa mudar.
- **`race-lap-validation`.** Esta feature usa a contagem regressiva e o sinal verde que já existem, só para
  posicionar a câmera (`DOMAIN/DEC-04`), e o fim da volta que já existe, só para manter a câmera na pose de
  corrida: na volta oficial, em relação ao kart parado, com o painel de resultado exibido (`DOMAIN/DEC-06`);
  no treino, cujas voltas são seguidas (revisão 3, US-10), em relação ao kart que continua pilotável
  (`DOMAIN/DEC-07`). Ao fim da volta oficial a simulação para e o kart congela, como hoje (invariante INV-1
  daquela feature), e nada muda nela: nem a validação de volta (`SEED/RE-01`), nem o congelamento, nem o
  treino contínuo. Nenhum feedback é enviado.
- **`pista-kart-park`.** Novas pistas e cenário estão fora do escopo (`SEED/FE-04`); o Kart 01 e a câmera
  valem em qualquer pista em jogo.

## Famílias de requisitos não funcionais

| Família | Tratamento |
|---|---|
| Taxa de quadros (RNF03) | Especificada: NFR-0001 (e critérios de US-0004) |
| Tamanho do download (RNF02) | Especificada: NFR-0002 |
| Dependências de execução | Especificada: NFR-0003 |
| Custo de desenho do kart | Especificada: NFR-0004 |
| Camada de aplicação (I2) | Especificada: NFR-0005 |
| Determinismo e contrato de passo (RNF07, I8) | Especificada: NFR-0006 |
| Contrato de posições das rodas da simulação | Especificada: NFR-0007 |
| Tempo até pilotar (RNF01) | Dispensada: o seed não fixa limite novo; o modelo entra no jogo dentro do download inicial limitado por NFR-0002 |
| Latência de entrada (RNF04) | Dispensada: RNF04 é o limite do volante remoto, fora do escopo (`SEED/FE-01`); o caminho do dispositivo até o `Input` não muda |
| Suporte a navegadores (RNF05) | Dispensada: o seed não muda a lista; o modelo usa a mesma versão de Three.js já usada (NFR-0003) |
| Disponibilidade / solo sem servidor (RNF08) | Dispensada: a feature não introduz dependência de rede nem de servidor |
| Comportamento offline | Dispensada: nenhuma mudança no caminho de rede; vale o que já vale para o jogo solo |
| Retenção de dados | Dispensada: a feature não persiste dado algum |
| Privacidade e consentimento (RNF10) | Dispensada: nenhum dado pessoal é coletado ou introduzido (I6) |
| Exposição por papéis (RBAC) | Dispensada: o produto não tem contas nem papéis (I10, RNF10) |
| Acessibilidade | Dispensada: nenhum texto, controle ou elemento de HUD novo; a mudança é do modelo e do ponto de vista da câmera |
| Idioma pt/en (RNF11) | Dispensada: nenhum texto novo de tela |
| Observabilidade | Dispensada como telemetria em tempo de execução: o produto não coleta dados (RNF10); a evidência é a saída de `npm test` sobre o modelo montado e o teste registrado nos aparelhos de referência (I9, `SEED/IM-I9`) |
| Volume de mensagens | Dispensada: a feature não envia mensagens nem usa servidor |

## Fora do escopo (do seed, seção Fora do escopo)

- Celular como volante (o quadro "Celular como volante" da ficha): pós-MVP (`SEED/FE-01`).
- Mudanças na física, nos presets ou nas medidas usadas pela simulação (`SEED/FE-02`; `DOMAIN/DEC-02`).
- Outros karts, cores escolhíveis ou adesivos personalizados (`SEED/FE-03`; I10).
- Novas pistas e cenário; a pista real Kart Park é outra feature (`SEED/FE-04`).
