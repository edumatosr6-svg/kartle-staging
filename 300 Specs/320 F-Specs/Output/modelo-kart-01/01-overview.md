---
title: Visão geral — modelo Kart 01 e câmera de jogo
feature: modelo-kart-01
stage: fspec
status: validated
version: 1.2.0
sources: []
---

# Visão geral

## O que é especificado

Esta especificação funcional diz o que o jogo **exibe** com o **Kart 01** — o kart de aluguel low-poly em
escala real, com piloto — e com a câmera de jogo da ficha "Kart 01 — Kartle": o modelo, as suas medidas,
peças e cores, a sombra, a animação que mostra o estado da simulação, a câmera atrás e perto do piloto, a
visão geral antes da largada e a descida durante a contagem, os efeitos presos ao kart e o custo de desenho
e de taxa de quadros. A base é o conjunto de requisitos validado em
`200 Requirements/230 Output/modelo-kart-01/` (US-0001 a US-0005, NFR-0001 a NFR-0007), que já carrega as
decisões do dono do produto de 2026-10-22 (`DOMAIN/DEC-00` a `DOMAIN/DEC-06`, rótulos definidos em
`01-context.md` daquele conjunto): o código do Cowork é a fonte do modelo e a ficha é a referência para
conferir; no máximo 30 chamadas de desenho do kart com o piloto, agrupando por material sem mudar a forma;
as medidas da física não são alinhadas ao modelo nesta feature; em retrato, campo de visão horizontal de
pelo menos 60°; antes da largada a câmera mostra a pista do alto e desce para trás do piloto durante a
contagem regressiva; o kart projeta sombra; quando a volta termina (`ENDED`), válida ou invalidada,
inclusive por reposicionamento, e o painel de resultado aparece, a simulação para e o kart congela, como
hoje (invariante INV-1 de `race-lap-validation`), e só a câmera continua na pose de corrida, em relação ao
kart parado, até a próxima visão geral, que existe só antes da contagem regressiva (`DOMAIN/DEC-06`, na
redação corrigida pelo dono do produto em 2026-10-22, via AC-US-0003-13; nenhum requisito de pilotagem
depois do fim da volta existe nesta feature).

A feature é só de apresentação (I2): a simulação, o passo, os presets, a validação de volta, o congelamento
ao fim da volta e `wheelPositions` não mudam (NFR-0005, NFR-0006, NFR-0007). Nenhuma tentativa, volta, resultado, replay ou
dado persistido do Jogador é criado, consumido ou alterado: D-FS-01 e D-FS-04 não se aplicam; nenhum fluxo
recebe evento externo, então não há deduplicação a declarar (D-FS-03); tudo roda sem rede (D-FS-08, RNF08).
Nenhuma mudança de dado persistido ou de esquema é implicada.

O produto não tem servidor, conta nem sessão no MVP (RNF08, RNF10). Os contratos de `api/` são contratos em
processo, dentro do navegador e na saída de `npm test`, únicos para os dois canais, e não endpoints de
rede; o único papel é `player` (anônimo). Nomes de campo em `camelCase` plano com a unidade no sufixo
(D-FS-06), no lugar do `snake_case` padrão: a diretriz do projeto prevalece.

## Por canal

| Canal | O que esta especificação fixa |
|---|---|
| `web-desktop` | O mesmo Kart 01, a mesma animação, a mesma sombra, a mesma câmera e os mesmos efeitos; regra de campo de visão de paisagem, e a de retrato só quando a janela é mais alta que larga; pelo menos 60 fps no notebook de referência de RNF03 |
| `web-mobile` | O mesmo; paisagem ou retrato conforme o Jogador segura o celular, com a regra de campo de visão de cada forma; pelo menos 30 fps no celular intermediário de referência de RNF03, nas duas orientações; sem sensor ou sem permissão, o controle recai para toque com estado visível (I4) e nada na cena muda |
| Verificação em `npm test` | Sem canal de jogo: medidas, grupos de peça, cores, custo de desenho e giro das rodas do modelo montado; camadas; simulação, contrato de passo e `wheelPositions` inalterados ([API-0002](api/API-0002-relatorio-do-modelo-montado.md)) |

A regra de campo de visão vale pela forma da área de jogo, não pelo canal. Modelo, medidas, peças, cores,
animação, efeitos, sombra e pose da câmera são os mesmos nos dois canais. Os controles não mudam: o modelo
mostra o estado que a simulação informa, qualquer que seja o adaptador que produziu o `Input`.

## Mapa do conjunto

| Parte | Onde |
|---|---|
| Funcionalidades | `features/FEAT-0001` (Kart 01 na pista: modelo, medidas, peças, cores, número 01, sombra), `FEAT-0002` (kart reage aos comandos: rodas, volante, braços, posição e rumo), `FEAT-0003` (câmera de jogo: visão geral, descida, pose de corrida, campo de visão, turbo), `FEAT-0004` (desempenho: taxa de quadros e custo de desenho), `FEAT-0005` (efeitos presos ao kart e posições das rodas da simulação), `FEAT-0006` (requisitos transversais: download, dependências, camadas, simulação inalterada) |
| Fluxos | `flows/FLOW-0001` (quadro de exibição em corrida), `FLOW-0002` (largada: visão geral, descida e pose de corrida), `FLOW-0003` (verificação do modelo montado e da simulação em `npm test`) |
| Contratos | `api/API-0001` (estado do kart para exibição), `API-0002` (relatório do modelo montado e das verificações de `npm test`), `API-0003` (câmera da cena exibida) |
| Telas | `screens/SCR-0001` (cena de jogo com o Kart 01 e a câmera) |
| Regras | `rules/RULE-0001` (medidas, grupos de peça, cores e custo de desenho do Kart 01), `RULE-0002` (câmera de jogo: modos, pose de corrida e campo de visão), `RULE-0003` (posição, animação e ancoragem dos efeitos do Kart 01) |

O índice (`00-index.md`) e a matriz de rastreabilidade (`99-traceability.md`) são gerados pelo gate e não são
escritos à mão.

## Camadas (I2)

O modelo do Kart 01, a sua animação, a sombra, a câmera e os efeitos ficam na camada de aplicação, que lê o
estado da simulação e não decide nada: a simulação não importa nada do modelo, da câmera nem dos efeitos, e
uma execução com a apresentação desta feature dá o mesmo estado da simulação que uma execução sem
renderização (NFR-0005). O contrato de leitura do estado do kart
([API-0001](api/API-0001-estado-do-kart-para-exibicao.md)) lê o que a simulação já expõe e não acrescenta
campo ao estado da simulação nem muda o passo (NFR-0006). A fase da volta e a contagem regressiva vêm do
contrato de estado da volta da feature `race-lap-validation` (`getLapState`, campos `lapPhase` e
`countdownRemainingMs`), nomeado e não redefinido aqui.

## Decisões de forma desta especificação

- **Ponto de referência do kart exibido.** O critério 05 de US-0002 diz que o kart exibido está na posição
  que a simulação informa, sem dizer que ponto do modelo fica nessa posição. Esta especificação o fixa como
  o ponto do modelo que fica, em relação às rodas do modelo, onde a posição da simulação fica em relação às
  rodas de `wheelPositions` ([RULE-0003](rules/RULE-0003-posicao-animacao-e-efeitos-do-kart-01.md)). Com
  ele, a diferença entre as rodas exibidas e as de `wheelPositions` é só a que decorre das medidas — 0,03 m
  para fora em cada roda traseira e no máximo 0,01 m ao longo do rumo —, que é a diferença que US-0005
  (caso anormal "Diferença conhecida entre as rodas da simulação e as do modelo") já calcula com os números
  do seed.
- **Modo da câmera derivado do estado da volta.** A câmera tem três modos (`TRACK_OVERVIEW`,
  `COUNTDOWN_DESCENT`, `RACE_CHASE`), decididos pela fase da volta
  ([RULE-0002](rules/RULE-0002-camera-de-jogo.md)). "Antes do início da contagem regressiva" (critério 10 de
  US-0003) é todo quadro com a pista carregada e sem volta ativa (`NO_ACTIVE_LAP`). A volta encerrada
  (`ENDED`) não é visão geral: a câmera continua em `RACE_CHASE`, na pose de corrida em relação ao kart
  parado, com o painel de resultado sobre a cena, a simulação parada e o kart congelado, como hoje
  (invariante INV-1 de `race-lap-validation`; critério 13 de US-0003, `DOMAIN/DEC-06` corrigida); a próxima visão
  geral é a do primeiro quadro da contagem de uma nova volta — que `race-lap-validation` inicia direto de
  `ENDED` (`startLap` de `ENDED` para `COUNTDOWN`) — ou a de uma recarga da página sem volta ativa. "Em
  corrida" é a definição dos requisitos: do sinal verde até a próxima visão geral, sem terminar em `ENDED`.
  A pausa não muda o modo: congela a câmera.
- **Velocidade de rolamento com sinal.** O giro das rodas usa `rollingSpeedMps`, a velocidade do kart em
  módulo com sinal negativo quando o movimento é para trás em relação ao rumo; o nome é novo para não dar a
  `speedMps` da telemetria de dirigibilidade (sempre 0 ou maior) outro significado (I3).
- **Campo de visão em graus.** Os campos de campo de visão carregam o sufixo `Deg`, porque os requisitos dão
  esses valores em graus (62°, 60°); posições em metros (`M`), rumo e esterço em radianos (`Rad`).
- **Saída de `npm test` como contrato.** Os critérios de US-0001, o critério 02 de US-0002 e os NFRs 0004 a
  0007 nomeiam a saída de `npm test` como ponto de observação; [API-0002](api/API-0002-relatorio-do-modelo-montado.md)
  fixa os registros, os campos e o veredito. A forma de serialização é decisão de projeto.
- **Contagem das chamadas de desenho.** Feita como o seed contou as 124 do código do Cowork: uma por malha e
  por material de cada malha do modelo montado, kart com o piloto. A passagem de sombra não entra na
  contagem: o custo da sombra não tem limite próprio e entra na taxa de quadros (US-0004, NFR-0001).

## Lacunas deliberadas

Esta especificação não decide nem inventa os pontos abaixo. Eles são de dois tipos, ditos linha a linha na
coluna Origem: **recusa registrada** — os requisitos recusaram fixar o ponto, com o motivo no seu changelog
(`97-changelog.md` daquele conjunto, rodada indicada) — ou **ponto não fixado** — nenhum critério dos
requisitos o fixa e o changelog deles não registra recusa; esta especificação só o nomeia como lacuna, para
que a etapa de design não o leia como decidido. Nos dois casos, a coluna Situação diz o que os critérios
exigem apesar da lacuna.

| Ponto | Origem | Situação |
|---|---|---|
| Duração e curva da descida da câmera durante a contagem | Recusa registrada (changelog dos requisitos, rodada 1) | Não fixadas; exige-se partir da visão geral, altura que nunca aumenta de um quadro para o seguinte e pose de corrida no sinal verde |
| Trajetória horizontal da câmera durante a contagem | Ponto não fixado por nenhum critério | Não fixada; valem as mesmas exigências da linha anterior |
| Altura, ponto de mira e campo de visão da visão geral; campo de visão durante a descida | Ponto não fixado por nenhum critério | Não fixados; exige-se a pista vista do alto e inteira no quadro, em paisagem e em retrato |
| Campo de visão vertical em retrato acima dos pisos | Recusa registrada (changelog dos requisitos, rodada 1) | Não fixado; exige-se horizontal de pelo menos 60° e vertical de pelo menos 62°, e o kart inteiro no quadro na curva de 90° a 50 km/h |
| Magnitude do efeito de turbo no campo de visão | Recusa registrada (changelog dos requisitos, rodada 1) | A do efeito que já existe, aplicada a partir da nova base de campo de visão vertical |
| Razão entre o ângulo do volante e o ângulo de esterço | Ponto não fixado por nenhum critério | Não fixada; exige-se sinal igual, zero com esterço 0 e módulo crescente com o módulo do esterço |
| Direção da luz e aparência da sombra; sombra do fantasma e de outros objetos | Ponto não fixado por nenhum critério | Não fixadas; exige-se a sombra do kart no chão, visível junto ao kart pela câmera de corrida |
| Tolerância do giro das rodas | Recusa registrada (changelog dos requisitos, rodada 2) | Nenhuma: o critério diz "igual" |
| Tolerância de diâmetros e bitolas | Recusa registrada (changelog dos requisitos, rodada 1) | Nenhuma além da medida ao centímetro, a precisão em que os requisitos dão os valores |
| Cores do capacete e das demais peças | Recusa registrada (changelog dos requisitos, rodada 1) | Só as quatro cores com código nos requisitos são critério |
| Condição de câmera para ver o número 01 | Recusa registrada (changelog dos requisitos, rodada 2) | Não fixada; exige-se o número 01 na placa do para-choque do kart exibido |
| Aparência do fantasma além de ser o Kart 01 | Ponto não fixado por nenhum critério | Não fixada |
| Valor e duração do painel de resultado, e o que o Jogador faz para chegar à próxima visão geral depois do fim da volta (nova tentativa, reinício) | Recusa registrada (changelog dos requisitos, rodada 3) | Não fixados; exige-se a pose de corrida em todos os quadros do fim da volta até o quadro anterior à próxima visão geral, e a visão geral só antes da contagem regressiva |

## Fora do escopo

Idêntico ao dos requisitos:

- Celular como volante (`remote-wheel`): pós-MVP.
- Mudanças na física, nos presets ou nas medidas usadas pela simulação (`DOMAIN/DEC-02`).
- Outros karts, cores escolhíveis ou adesivos personalizados (I10).
- Novas pistas e cenário; a pista real Kart Park é outra feature (`pista-kart-park`).

## Como a especificação é verificada

- Forma, medidas, nomes de peças, cores, custo de desenho e giro das rodas: sobre o modelo montado, na saída
  de `npm test` ([API-0002](api/API-0002-relatorio-do-modelo-montado.md),
  [FLOW-0003](flows/FLOW-0003-verificacao-do-modelo-montado.md)), avançando a simulação com `STEP` quando o
  critério fala em passos (I9).
- Câmera, animação, número 01, sombra e efeitos: em tela, na cena exibida
  ([SCR-0001](screens/SCR-0001-cena-de-jogo-com-o-kart-01.md)), com a pose da câmera lida em
  [API-0003](api/API-0003-camera-da-cena-exibida.md) e a do kart em
  [API-0001](api/API-0001-estado-do-kart-para-exibicao.md).
- Taxa de quadros: teste registrado nos aparelhos de referência de RNF03 nomeados; uma execução em desktop
  não vale como evidência para celular (I9).
- Download, dependências de execução e arquivos da simulação: medida do build entregue, comparação da lista
  de dependências declarada e diferença do repositório
  ([FEAT-0006](features/FEAT-0006-requisitos-transversais.md)).

## Relação com outras features

- **`dirigibilidade`.** A física e os presets são dela; esta feature só lê o estado da simulação e não muda
  nenhum requisito daquela feature. As medidas da simulação (entre-eixos de 1,04 m, bitola de 1,20 m)
  continuam diferentes das do modelo (`DOMAIN/DEC-02`). A ordem de entrega entre as duas é assunto da etapa
  de design.
- **`race-lap-validation`.** Esta feature usa a contagem regressiva (3000 ms de tempo de simulação) e o sinal
  verde que já existem, pelo contrato `getLapState`, só para decidir o modo da câmera, e o fim da volta
  (`ENDED`) e o painel de resultado que já existem, só para manter a câmera na pose de corrida em relação
  ao kart parado (`DOMAIN/DEC-06`). Ao fim da volta a simulação para e o kart congela, como hoje: o
  congelamento é o invariante INV-1 daquela feature e não muda; esta feature não muda a validação de volta,
  o congelamento nem as telas daquela feature.
- **`pista-kart-park`.** O Kart 01 e a câmera valem em qualquer pista em jogo.

Nenhum feedback foi enviado a outra feature: nenhum requisito delas precisa mudar.
