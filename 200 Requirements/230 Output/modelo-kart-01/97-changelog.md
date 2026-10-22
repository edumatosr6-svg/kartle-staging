---
title: Changelog — modelo Kart 01 e câmera de jogo
feature: modelo-kart-01
stage: req
status: validated
version: 1.3.0
sources: [SEED, DOMAIN]
---

# Changelog

## 2026-10-22 — rodada 1, Mode A (geração a partir do seed revision 1 e de `DOMAIN.md`)

**O que mudou**

- Conjunto gerado do zero a partir de `SEED.md` (`revision: 1`, `date: 2026-10-22`) e das decisões de
  2026-10-22 em `DOMAIN.md`: `01-context.md`, `02-glossary.md`, cinco histórias (US-0001 a US-0005, uma por
  história do seed), sete NFRs (NFR-0001 a NFR-0007) e o registro `98-divergences.md`, sem linhas.
- `00-index.md` e `99-traceability.md` não foram escritos: o gate os gera com `lint_artifacts.py --emit`.
- Decisões de `DOMAIN.md` aplicadas no lugar dos pontos abertos do seed, com o rótulo `DOMAIN/DEC-nn`
  (nn = número do ponto que fecha) definido em `01-context.md`: DEC-01 (no máximo 30 chamadas de desenho,
  agrupando por material, sem mudar a forma; rodas, volante e braços animáveis) em NFR-0004 e US-0002;
  DEC-02 (física não alinhada ao modelo) em NFR-0006, NFR-0007 e US-0005; DEC-03 (retrato com campo de
  visão horizontal de pelo menos 60°; paisagem com vertical de 62°) em US-0003; DEC-04 (visão geral antes
  da contagem, descida durante a contagem, pose de corrida no sinal verde) em US-0003; DEC-05 (sombra) em
  US-0001, US-0004 e NFR-0001. A decisão sobre a fonte do modelo recebeu o rótulo `DOMAIN/DEC-00`.
- Restrições do seed tornadas mensuráveis como NFR: arquivos da simulação e presets inalterados
  (NFR-0006), Three.js 0.186 sem versão nova (NFR-0003), `wheelPositions` preservado (NFR-0007). Os quatro
  NFRs do seed viraram NFR-0001 a NFR-0004; as regras de domínio de camada (I2) viraram NFR-0005.
- Retiradas declaradas em `01-context.md` (seção Retiradas e substituições): o kart provisório e a câmera
  alta de perseguição em corrida; a câmera alta inicial fica só antes da contagem.
- Decisão do dono do produto passada a esta execução sobre a ordem de entrega (depois da `dirigibilidade`)
  registrada em `01-context.md`, seção Relação com outras features, sem nomear módulo; a etapa de design
  registra a dependência.

**Itens fechados**: nenhum `ISSUE-<nn>` ou `FB-<nn>` (primeira rodada); pontos abertos 01 a 05 do seed
fechados por `DOMAIN.md`.

**Itens recusados, com motivo**

- Onde o código fica no repositório e o registro da dependência de entrega com a `dirigibilidade` (decisões
  do dono do produto passadas a esta execução): são decisões de design, não requisitos; não entram nas
  histórias nem nos NFRs, para não vazar design nesta etapa. A ordem de entrega fica só como nota de
  contexto.
- `NOTES.md` da pasta do seed não foi lido (fora da lista de entrada da etapa); as medidas usadas são as que
  o seed traz. O código do Cowork e a ficha também não foram lidos: as medidas, cores e nomes de peças vêm
  do seed.
- Tolerância das rodas e das bitolas: o seed dá ±2 cm só para comprimento, largura e entre-eixos; para os
  diâmetros e as bitolas, este conjunto compara ao centímetro (a precisão em que o seed dá os valores) e
  não inventa tolerância.
- Cor do capacete: o seed diz "capacete branco" só na Visão geral, sem código de cor; não virou critério
  de cor próprio, para não inventar valor. As quatro cores com código no seed têm critério.
- Cores das demais peças: o seed nomeia quatro cores; nenhum critério exige que as outras cores coincidam
  com o código do Cowork, porque a ficha é a referência e o seed não as lista.
- Magnitude do efeito de turbo no campo de visão: não fixada; o critério 09 de US-0003 a compara com o
  efeito que já existe, como diz o seed.
- Duração e curva da descida da câmera durante a contagem: não fixadas; `DOMAIN/DEC-04` diz só que a
  câmera desce durante a contagem e está na pose de corrida no sinal verde.
- Contagem das chamadas de desenho: feita como o seed contou as 124 do código do Cowork (uma por malha e
  material do modelo montado); o custo da sombra não ganhou limite próprio, porque o seed não o fixa, e
  entra na taxa de quadros (US-0004, NFR-0001).
- Campo de visão vertical em retrato: o critério 06 de US-0003 exige que não fique abaixo de 62°, leitura de
  "o vertical cresce em retrato" (`DOMAIN/DEC-03`); nenhum outro valor foi fixado.
- Taxa de quadros sustentada: definida no glossário como contagem de quadros a cada segundo, sem segundo
  abaixo do limite, porque RNF03 não fixa o método de medida e o número é em quadros por segundo.
- Famílias de NFR dispensadas em `01-context.md` (tempo até pilotar, latência de entrada, navegadores,
  disponibilidade, offline, retenção, privacidade, RBAC, acessibilidade, idioma, observabilidade em
  execução, volume de mensagens): o seed não as altera.

## 2026-10-22 — rodada 2, Mode B (relatório `req-validation-20261022-1419.md`, 3 erros, 4 avisos, 1 info)

**O que mudou**

- ISSUE-01 (R3, US-0001, AC-US-0001-12): o critério que juntava a cor da placa e o número 01, observado na
  tela, foi separado nas duas metades que já carregava. AC-US-0001-12 ficou com a cor: a saída de
  `npm test` reporta a placa do para-choque do modelo montado na cor `#F4F3EF`, como os critérios 10, 11 e
  13. A outra metade virou AC-US-0001-16: a tela mostra o número 01 na placa do para-choque do kart
  exibido. O id novo foi acrescentado no fim da lista para não renumerar os critérios 13 a 15 (ids nunca
  reaproveitados, conventions §4). A placa, a cor e o número 01 já estavam em AC-US-0001-12 e no quarto
  critério de `SEED/US-1`: nenhuma superfície nova (§16). Nenhum outro arquivo citava o critério 12 de
  US-0001. Fechada por edição.
- ISSUE-02 (R3, US-0002, AC-US-0002-02): o critério passou a nomear a observação: a saída de `npm test`
  reporta o giro de cada uma das quatro rodas do modelo montado depois de um número conhecido de passos
  `STEP` com velocidade conhecida e constante, comparado com a taxa de rolamento (velocidade ÷ (π ×
  diâmetro)) vezes o tempo simulado. A prova por `npm test` com passos `STEP` é a de I9. A taxa, os
  diâmetros, o sentido do movimento e o giro nulo a 0 m/s continuam os mesmos. Os casos anormais de pausa,
  derrapagem e ré, que falam do giro em termos da taxa de rolamento, continuam coerentes e não mudaram.
  Fechada por edição.
- ISSUE-03 (R3, US-0003, AC-US-0003-09): o critério diz que a diferença do turbo é medida no campo de
  visão vertical, em paisagem e em retrato, porque a base dada pelo seed é o "campo de visão vertical de
  62°" (`SEED/US-3`, primeiro critério). Mesmo fato levado aos outros pontos onde aparece: o caso anormal
  "Turbo ativo durante a troca de orientação" e a seção Fontes de US-0003, a linha "Efeito de campo de
  visão do turbo" da tabela Retiradas e substituições de `01-context.md` e o termo "Efeito de turbo no
  campo de visão" de `02-glossary.md`. Fechada por edição.
- ISSUE-04 (R2, US-0004): a história ganhou o valor "para continuar pilotando na taxa de quadros que RNF03
  fixa, agora com o Kart 01 em cena", tirado do próprio critério do seed; a seção Fontes registra que o
  seed não diz o valor. Nenhum requisito acrescentado. Fechada por edição.
- ISSUE-05 (R2, US-0005): a história ganhou o valor "para ver as marcas de pneu, a fumaça do escapamento e
  a indicação de drift saírem do Kart 01 que estou pilotando", tirado do próprio critério do seed; a seção
  Fontes registra que o seed não diz o valor. Nenhum requisito acrescentado. Fechada por edição.
- ISSUE-06 (R4, `01-context.md`, Relação com outras features): a frase sobre a ordem de entrega depois da
  `dirigibilidade`, sem fonte em `SEED.md` nem em `DOMAIN.md`, saiu do conjunto. A decisão do dono do
  produto passada a esta execução continua registrada só neste changelog (aqui e na rodada 1), como
  contexto para `300 Specs/330 D-Specs`, que registra a dependência; não é requisito. Fechada por edição.
- ISSUE-07 (R4, US-0002, seção Canais): saiu a frase sobre os valores de esterço por adaptador (teclado e
  inclinação); o item diz só que o modelo mostra o esterço informado pela simulação, qualquer que seja o
  adaptador. Nenhum outro ponto do conjunto afirmava valores de esterço por canal (a menção a "inclinação e
  toque" em `01-context.md` e em `02-glossary.md` nomeia os controles, não valores). Fechada por edição.
- ISSUE-08 (info, R4, US-0001, AC-US-0001-14): o critério passou a dizer que todo kart exibido na tela é o
  Kart 01 e que o kart provisório de caixas não aparece em nenhum quadro, sem afirmar um único kart na cena,
  porque o fantasma (I1, I3, I8) também é um kart exibido. Mesmo fato levado à linha "Kart provisório" da
  tabela Retiradas e substituições de `01-context.md`. O caso anormal "Pedido de outro kart, outra cor ou
  adesivo" e os rótulos `SEED/RD-03` e `SEED/IM-I10` continuam com o texto do seed ("um único kart",
  isto é, um único modelo, sem personalização). Fechada por edição.
- Versões: US-0001, US-0002 e US-0003 em 1.1.0 (critérios reescritos); US-0004, US-0005, `01-context.md` e
  `02-glossary.md` em 1.0.1. Nenhum requisito, história, NFR, campo ou limite acrescentado ou removido; a
  única id nova, AC-US-0001-16, é a metade do antigo AC-US-0001-12 (§16). `00-index.md` e
  `99-traceability.md` não foram tocados: o gate os regenera.

**Itens fechados**: ISSUE-01 a ISSUE-08, todos por edição. Divergências registradas: nenhuma.

**Itens recusados, com motivo**

- ISSUE-06, segunda forma oferecida pelo relatório (o autor registrar a decisão em `DOMAIN.md` e o conjunto
  citá-la como `DOMAIN/DEC-nn`): não usada, porque nenhum passo do pipeline escreve em `220 Input/`
  (conventions §15) e a ordem de entrega é decisão de design. Proposta ao autor, se quiser a decisão
  durável: "2026-10-22 — a entrega de `modelo-kart-01` vem depois da entrega da `dirigibilidade`, que
  também altera a camada de aplicação; a etapa de design registra a dependência."
- ISSUE-02, tolerância no giro das rodas: nenhuma foi fixada; o critério mantém "igual", como antes, e uma
  tolerância seria um limite que o seed não dá.
- ISSUE-01, condição de câmera para ver o número 01 (por exemplo, "pela câmera de corrida"): não fixada,
  porque o seed não diz de que lado do kart a placa fica visível em corrida.

## 2026-10-22 — rodada 3, Mode B (relatório `req-validation-20261022-1657.md`, 2 erros)

**O que mudou**

- Origem dos dois erros: a decisão "Câmera depois do fim da volta" entrou em `DOMAIN.md` em 2026-10-22,
  depois da parada do F-Spec e depois da validação da rodada 2, e o conjunto não a cobria. A decisão
  recebeu o rótulo `DOMAIN/DEC-06` na chave de rastreabilidade de `01-context.md`; o dono do produto
  passou a esta execução a ordem de incorporá-la em US-0003, com critério e caso anormal sobre o fim da
  volta, e de não mudar mais nada nos requisitos.
- ISSUE-01 (R4, `01-context.md`): a chave ganhou o rótulo `DOMAIN/DEC-06` com o texto da decisão; a frase
  sobre `DOMAIN.md` diz que há uma sexta decisão, tomada depois da parada do F-Spec; a tabela "Decisões de
  domínio aplicadas" lista o rótulo (US-0003 e o termo "Em corrida" do glossário). US-0003 cita
  `DOMAIN/DEC-06` em `sources:` e ganhou AC-US-0003-13: do quadro em que a volta termina (`ENDED`),
  válida ou invalidada, inclusive por reposicionamento, com o painel de resultado exibido na tela, até o
  quadro anterior à próxima visão geral, a câmera está em todos os quadros na pose de corrida (critérios 01
  a 03), sem voltar à visão geral, que existe só antes da contagem regressiva. Mesmo fato levado aos outros
  pontos onde aparece: seção Canais e pré-condições de US-0003 (a janela de corrida vai do sinal verde até a
  próxima visão geral); caso anormal "Reposicionamento do kart em corrida" (vale igual quando o
  reposicionamento invalida a volta) e caso anormal novo "Fim da volta, válida ou invalidada, com o painel
  de resultado exibido" (painel sobre a cena sem mover a câmera; kart pilotável; rumo e campo de visão
  continuam valendo; a próxima visão geral é a de antes de uma nova contagem); seções Fontes e Pontos em
  aberto de US-0003; linha "Câmera inicial alta" da tabela Retiradas e substituições e item
  `race-lap-validation` de Relação com outras features, em `01-context.md`. Fechada por edição.
- ISSUE-02 (R4, `02-glossary.md`, "Em corrida"): o termo diz que "em corrida" vai do sinal verde até a
  próxima visão geral da pista e não termina quando a volta acaba (`ENDED`), válida ou invalidada, inclusive
  por reposicionamento, nem quando o painel de resultado aparece, citando `DOMAIN/DEC-06`. Mesmo fato
  levado ao termo "Visão geral da pista" (existe só antes da contagem; não volta no fim da volta). Os
  termos "Fim da volta (`ENDED`)" e "Painel de resultado" entraram no glossário como definições de coisas
  que já existem no jogo e que `DOMAIN/DEC-06` nomeia, para que o critério 13 seja decidível; não são
  requisitos. Como os critérios de US-0002, US-0004, US-0005 e NFR-0001 usam o termo "Em corrida", a nova
  definição vale para eles sem edição: o kart continua pilotável depois do fim da volta
  (`DOMAIN/DEC-06`), e o modelo, os efeitos e a taxa de quadros continuam valendo até a próxima visão
  geral. Fechada por edição.
- Superfície e §16: AC-US-0003-13 e o caso anormal novo são a única superfície acrescentada nesta rodada, e
  são autorizados por um item do upstream (`DOMAIN/DEC-06`, escrito pelo dono do produto na camada de
  domínio durável) e pela ordem explícita dele passada a esta execução; não vêm da rubrica do validador.
  Um item do upstream sem cobertura é uma lacuna de fechamento (política estrita, regra 7), e cobri-la não
  alarga o conjunto além do que o autor pediu. Nenhum requisito, história, NFR, campo ou limite foi
  acrescentado além disso; nenhum foi removido ou enfraquecido.
- Versões: US-0003 em 1.2.0 (critério acrescentado); `01-context.md` e `02-glossary.md` em 1.1.0 (rótulo e
  termos acrescentados). Os arquivos editados voltaram a `status: draft`; o gate e o validador decidem a
  validação. `00-index.md` e `99-traceability.md` não foram tocados: o gate os regenera.

**Itens fechados**: ISSUE-01 e ISSUE-02, ambos por edição. Divergências registradas: nenhuma.

**Itens recusados, com motivo**

- Decisões passadas a esta execução que não mudaram o conjunto: "só camada de aplicação, sem mudar
  `src/physics.ts`, `src/lap.ts`, `src/track.ts` nem presets" já está em NFR-0005 e NFR-0006
  (`SEED/RE-01`, `SEED/IM-I2`); "fonte do modelo: `docs/kart-01/kart.js`" já está em `DOMAIN/DEC-00` e
  US-0001; "código fica na raiz do repositório" e "o código desta feature entra depois da `dirigibilidade`"
  continuam fora dos requisitos, pelo motivo das rodadas 1 e 2: são decisões de design, registradas aqui
  como contexto para `300 Specs/330 D-Specs`.
- Valor e duração do painel de resultado, e o que o Jogador faz para chegar à próxima visão geral (nova
  tentativa, reinício): não fixados; `DOMAIN/DEC-06` diz só que a câmera continua na pose de corrida até a
  próxima visão geral, e o painel já existe no jogo, fora do escopo desta feature.
- Critério separado para "o kart continua pilotável depois do fim da volta": não criado; o fato entrou na
  definição de "Em corrida", e os critérios de US-0002 (reação aos comandos) já valem em corrida; um
  critério próprio seria superfície além da ordem do dono do produto ("incorpore a decisão em US-0003").

## 2026-10-22 — rodada 4, Mode B (relatório `req-validation-20261022-1905.md`, 3 erros)

**O que mudou**

- Origem dos três erros: a entrada "Correção da decisão da câmera" entrou em `DOMAIN.md` em 2026-10-22,
  depois de um feedback do D-Spec desta feature, e o conjunto ainda reproduzia a redação original de
  `DOMAIN/DEC-06` ("o kart continua pilotável"). O dono do produto fixou que essa frase não vale: quando a
  volta termina (`ENDED`) e o painel de resultado aparece, a simulação para e o kart congela, como hoje
  (invariante INV-1 de `race-lap-validation`); a decisão descreve só a câmera (atrás do piloto, na pose de
  corrida, com o kart parado, até a próxima visão geral); nenhum requisito de pilotagem depois de `ENDED`
  existe nesta feature, e nada muda em `race-lap-validation`. O rótulo `DOMAIN/DEC-06` foi mantido e passou
  a carregar a decisão corrigida, como o dono do produto ordenou ("ajuste o rótulo da decisão, DEC-06");
  nenhum rótulo novo (`DEC-07`) foi criado, e o `sources:` de US-0003 não muda.
- ISSUE-01 (R4, `01-context.md`): o texto de `DOMAIN/DEC-06` na chave de rastreabilidade diz que ao fim da
  volta a simulação para e o kart congela como hoje (INV-1 de `race-lap-validation`), que a decisão
  descreve só a câmera, que a frase "o kart continua pilotável" não vale e que nada muda em
  `race-lap-validation`; o parágrafo sobre `DOMAIN.md` conta a correção; a tabela "Decisões de domínio
  aplicadas" lista `DOMAIN/DEC-06` com US-0003 (pose em relação ao kart parado) e os termos "Em corrida",
  "Fim da volta (`ENDED`)" e "Painel de resultado" do glossário. Mesmo fato levado ao item
  `race-lap-validation` de Relação com outras features (simulação parada e kart congelado como hoje; nada
  muda lá). Fechada por edição.
- ISSUE-02 (R4, `02-glossary.md`): "Em corrida" vai do sinal verde até a próxima visão geral da pista e não
  termina em `ENDED` nem com o painel; depois do fim da volta a simulação está parada e o kart congelado como
  hoje, e só a câmera continua na pose de corrida em relação ao kart parado, citando `DOMAIN/DEC-06`
  corrigida; saiu "enquanto o Jogador pilota" e "o kart continua pilotável". "Fim da volta (`ENDED`)" diz
  que a simulação para e o kart congela (INV-1 de `race-lap-validation`), sem mudança nesta feature. Mesmo
  fato levado a "Painel de resultado" (exibido sobre a cena com a simulação parada e o kart congelado).
  Fechada por edição.
- ISSUE-03 (R4, US-0003): o caso anormal "Fim da volta, válida ou invalidada, com o painel de resultado
  exibido" diz que, no quadro em que a volta termina e nos seguintes, a simulação está parada e o kart
  congelado como hoje, o painel aparece sobre a cena sem mover a câmera, e a câmera fica na pose de corrida
  em relação ao kart parado (critério 13), com a regra de campo de visão da forma da área de jogo
  (critérios 04 a 06) e visada que não muda porque o rumo do kart parado não muda (critério 07, com mudança
  de rumo nula), até a próxima visão geral; saiu "o kart continua pilotável". A seção Fontes cita
  `DOMAIN/DEC-06` na redação corrigida. Mesmo fato levado aos outros pontos onde aparece: seção Canais
  (permanência na pose em relação ao kart parado, com a simulação parada), pré-condições (critérios de
  corrida e critério 13), caso anormal "Reposicionamento do kart em corrida" (quando invalida a volta, a
  simulação para e o kart congela) e Pontos em aberto. Fechada por edição.
- Versões: `01-context.md` e `02-glossary.md` em 1.2.0 (texto de um rótulo e de três termos corrigido);
  US-0003 em 1.2.1 (nenhum critério mudou; caso anormal, canais, pré-condições e fontes corrigidos). Os
  arquivos editados voltaram a `status: draft`; o gate e o validador decidem a validação. `00-index.md` e
  `99-traceability.md` não foram tocados: o gate os regenera.
- Superfície e §16: nenhum requisito, história, critério, NFR, campo ou limite foi acrescentado, removido ou
  enfraquecido. AC-US-0003-13 não mudou: o validador o reverificou e, com o kart congelado, a pose lida em
  cada quadro é fixa em relação ao kart parado. Os critérios de US-0002, US-0004, US-0005 e NFR-0001, que
  usam o termo "Em corrida", continuam valendo sem edição: depois de `ENDED` o modelo exibe o estado
  congelado que a simulação informa, e a taxa de quadros é medida ao longo de uma volta completa.

**Itens fechados**: ISSUE-01 a ISSUE-03, todos por edição. Divergências registradas: nenhuma.

**Itens recusados, com motivo**

- Rótulo próprio `DOMAIN/DEC-07` para a correção (segunda forma oferecida pelo relatório): não criado; o
  dono do produto ordenou ajustar o rótulo `DEC-06`, a correção substitui uma frase da mesma decisão e um
  rótulo novo faria o `sources:` de US-0003 e a matriz gerada citar duas vezes a mesma decisão.
- Artefatos das etapas seguintes que herdaram a frase "pilotável" (01-overview, RULE-0002, FLOW-0001 passo
  1, FLOW-0002 passo 9, SCR-0001 do F-Spec e o que o D-Spec herdou): fora da cerca de escrita desta etapa
  (§14); são corrigidos pelas rodadas de F-Spec e D-Spec, que leem este conjunto corrigido.
- Linha de `SCOPE-BACKLOG.md` (registro da recusa do FB-01 no changelog de D-Spec de `race-lap-validation`):
  não é item de requisito desta feature e não gera feedback (§14) desta etapa; nenhum requisito de
  `race-lap-validation` muda.
- Decisões passadas a esta execução que não mudaram o conjunto: "só camada de aplicação" já está em
  NFR-0005 e NFR-0006 (`SEED/RE-01`, `SEED/IM-I2`); "fonte do modelo: `docs/kart-01/kart.js`" já está em
  `DOMAIN/DEC-00` e US-0001; "código na raiz do repositório" e "o código entra depois da `dirigibilidade`"
  continuam fora dos requisitos, pelo motivo das rodadas 1 a 3: são decisões de design, registradas aqui
  como contexto para `300 Specs/330 D-Specs`.
- Critério novo sobre o congelamento do kart depois de `ENDED` (por exemplo, "o kart exibido não se move
  depois do fim da volta"): não criado; o congelamento é da `race-lap-validation` (INV-1) e já está coberto
  por NFR-0006 (simulação e validação inalteradas); um critério próprio seria superfície nova numa rodada
  Mode B (§16) e um requisito que a correção do dono do produto diz não existir nesta feature.
- Entradas das rodadas 1 a 3 deste changelog que citam "o kart continua pilotável": não reescritas; são
  o registro histórico do que cada rodada fez com a redação de `DOMAIN.md` então vigente.
