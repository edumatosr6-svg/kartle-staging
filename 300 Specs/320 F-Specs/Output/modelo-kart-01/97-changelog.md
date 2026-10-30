---
title: Registro de mudanças — modelo Kart 01 e câmera de jogo
feature: modelo-kart-01
stage: fspec
status: validated
version: 1.3.1
sources: []
---

# Registro de mudanças

## 2026-10-22 — rodada 1, Mode A

**O que mudou**

- Conjunto gerado do zero a partir dos requisitos validados de `200 Requirements/230 Output/modelo-kart-01/`
  (US-0001 a US-0005, NFR-0001 a NFR-0007; seed `revision: 1`; validação `req-validation-20261022-1431`,
  SUCCESS), com as decisões do dono do produto que os requisitos já carregam e que o autor repassou a esta
  rodada (`DOMAIN/DEC-00` a `DOMAIN/DEC-05`): fonte do modelo no código do Cowork; no máximo 30 chamadas de
  desenho agrupando por material; física não alinhada nesta feature; retrato com campo de visão horizontal
  de pelo menos 60°; câmera que desce do alto para trás do piloto durante a contagem; kart com sombra.
- Seis funcionalidades (`FEAT-0001` a `FEAT-0006`), três fluxos (`FLOW-0001` a `FLOW-0003`), três contratos
  (`API-0001` a `API-0003`), uma tela (`SCR-0001`) e três regras (`RULE-0001` a `RULE-0003`), mais
  `01-overview.md`, `02-glossary.md` e `98-divergences.md` (sem linhas).
- Todo critério `AC-*` dos requisitos (39) e todo NFR (7) é realizado por ao menos um requisito: US-0001 em
  `FEAT-0001`; US-0002 em `FEAT-0002`; US-0003 em `FEAT-0003`; US-0004, NFR-0001 e NFR-0004 em `FEAT-0004`;
  US-0005 e NFR-0007 em `FEAT-0005`; NFR-0002, NFR-0003, NFR-0005 e NFR-0006 em `FEAT-0006`. Nenhum NFR foi
  adiado para a etapa de design.
- `00-index.md` e `99-traceability.md` não foram escritos: o gate os gera com `lint_artifacts.py --emit`.

**Decisões de forma registradas**

- Não existe API de rede no MVP (diretrizes do estágio). Os contratos de `api/` são contratos em processo
  (estado do kart lido pela apresentação; câmera da cena exibida; saída de `npm test`), com o único papel
  `player` (anônimo), erros como códigos de rejeição e idempotência por leitura pura. Nomes de campo em
  `camelCase` com unidade no sufixo (D-FS-06), no lugar do `snake_case` padrão da habilidade do gerador: a
  diretriz do projeto prevalece.
- Ponto de referência do kart exibido: o critério 05 de US-0002 não diz que ponto do modelo fica na posição
  da simulação; fixado como o ponto que fica, em relação às rodas do modelo, onde a posição da simulação fica
  em relação às rodas de `wheelPositions` (`RULE-0003`). É a leitura que dá exatamente as diferenças que
  US-0005 já calcula (0,03 m na bitola traseira, no máximo 0,01 m ao longo do rumo).
- Modo da câmera com a volta encerrada: `ENDED` é visão geral (`TRACK_OVERVIEW`), não câmera de corrida. O
  critério 10 de US-0003 exige a visão geral antes do início de toda contagem, e `race-lap-validation` leva
  a volta encerrada direto à contagem da volta seguinte; "em corrida" é "enquanto o Jogador pilota", e a
  volta encerrada não aceita mais eventos. O autor pode preferir outra leitura (por exemplo, câmera de
  corrida até uma nova contagem); nesse caso, uma decisão em `DOMAIN.md` muda só `RULE-0002`, `FEAT-0003`,
  `FLOW-0002` e `SCR-0001`. *(Superada na rodada 2, ISSUE-01: o dono do produto decidiu em `DOMAIN.md`,
  `DOMAIN/DEC-06`, e os requisitos absorveram a decisão em AC-US-0003-13: `ENDED` é `RACE_CHASE`.)*
- Velocidade de rolamento com nome próprio (`rollingSpeedMps`), porque tem sinal; `speedMps` da telemetria
  de dirigibilidade (0 ou maior) não ganha outro significado (I3). Campo de visão em graus (`Deg`), a unidade
  em que os requisitos o dão. Relatório de `npm test` com `checkId` e `checkFailReason`, nomes próprios, para
  não dar outro domínio de valores ao `benchId` e ao `failReason` da saída dos ensaios de dirigibilidade.
- Contagem das chamadas de desenho sem a passagem de sombra, como os requisitos registraram (o custo da
  sombra entra na taxa de quadros).
- Cores do kart e do `chassi` julgadas por presença entre as cores dos materiais (`kartColorHexes`,
  `chassisColorHexes`), porque o critério diz que o kart "usa" o laranja e que o `chassi` "tem" o grafite, sem
  dizer que é a única cor; placa do para-choque e macacão, peças de cor única, julgados por igualdade.

**Itens fechados**: nenhum `ISSUE-<nn>` ou `FB-<nn>` (primeira geração).

**Itens recusados, com motivo**

- Pontos que esta especificação não decide, listados em "Lacunas deliberadas" de `01-overview.md` (texto
  corrigido na rodada 2, ISSUE-02: a redação original dizia que os requisitos tinham recusado todos eles).
  Recusa registrada no changelog dos requisitos: duração e curva da descida, campo de visão vertical em
  retrato acima dos pisos, magnitude do efeito de turbo, tolerância de diâmetros e bitolas, cores do capacete
  e das demais peças (rodada 1); tolerância do giro das rodas e condição de câmera para ver o número 01
  (rodada 2). Pontos que nenhum critério fixa, sem recusa registrada: trajetória horizontal da câmera na
  contagem; altura, ponto de mira e campo de visão da visão geral; campo de visão durante a descida; razão
  entre volante e esterço; direção da luz e aparência da sombra, sombra do fantasma e de outros objetos;
  aparência do fantasma. Em nenhum dos dois casos esta especificação os decide ou inventa.
- Ordem de entrega depois da `dirigibilidade` (que também altera a camada de aplicação) e o lugar do código
  no repositório, decisões do autor repassadas a esta rodada: são decisões de design e de entrega, não
  comportamento; ficam para `300 Specs/330 D-Specs`, que registra a dependência. A
  restrição de não mudar os três arquivos da simulação e os presets está em `FEAT-0006`, citada do seed via
  NFR-0006.
- Interpolação do kart entre passos para suavizar a exibição: não especificada e excluída pelo requisito 07
  de `FEAT-0002`, porque US-0002 diz que a renderização não estima estado.
- Configuração para voltar ao kart provisório ou à câmera alta, ou para escolher câmera, campo de visão ou
  qualidade: nenhuma; os requisitos declaram a mudança segura ligada e sem chave, e uma configuração assim
  seria superfície que nenhum critério pede.
- Texto novo de tela: nenhum; os requisitos dispensaram acessibilidade e idioma como requisito novo, e esta
  feature não acrescenta texto, controle nem elemento de HUD.
- Divergências com o sistema em execução: nenhuma registrada. Esta etapa não lê a raiz de código para
  derivar comportamento (conventions §12); apenas nomes existentes foram consultados para não colidir com
  eles (lista em `98-divergences.md`).
- `SEED.md`, `DOMAIN.md` e `NOTES.md` da pasta do seed, o código do Cowork e a ficha não foram lidos: estão
  fora da lista de entrada desta etapa (conventions §12); as medidas, cores, nomes e decisões usados são os
  que os requisitos trazem.

## 2026-10-22 — rodada 2, Mode B (relatório `fspec-validation-20261022-1506.md`, 1 erro, 1 aviso)

**O que mudou**

- Origem da ISSUE-01: o ramo "modo da câmera com a volta em `ENDED`" não tinha fonte nos requisitos 1.1.0. O
  dono do produto decidiu em `DOMAIN.md` (2026-10-22, rótulo `DOMAIN/DEC-06` em `01-context.md` dos
  requisitos) e os requisitos absorveram a decisão: US-0003 1.2.0 (AC-US-0003-13; pré-condições; casos
  anormais "Reposicionamento do kart em corrida" e "Fim da volta, válida ou invalidada, com o painel de
  resultado exibido"), `02-glossary.md` 1.1.0 ("Em corrida", "Visão geral da pista", "Fim da volta",
  "Painel de resultado") e `01-context.md` 1.1.0, validados em `req-validation-20261022-1703` (SUCCESS). O
  dono do produto passou a decisão a esta execução com a ordem de resolver a ISSUE-01 com `ENDED` igual a
  `RACE_CHASE`, nunca `TRACK_OVERVIEW`, e de não redescobri-la.
- ISSUE-01 (error, F7, D-FS-02): o modo da câmera com a volta encerrada passou de `TRACK_OVERVIEW` a
  `RACE_CHASE` — do quadro em que a volta termina, válida ou invalidada, inclusive por reposicionamento,
  com o painel de resultado sobre a cena, até o quadro anterior à próxima visão geral, que existe só antes da
  contagem regressiva; o kart continua pilotável *(frase superada na rodada 3: o dono do produto corrigiu
  `DOMAIN/DEC-06` — a simulação para e o kart congela ao fim da volta, e só a câmera continua na pose de
  corrida)*; a próxima visão geral é a do primeiro quadro da contagem
  de uma nova volta (`startLap` aceito com a volta em `ENDED`) ou a de uma recarga sem volta ativa. O fato
  foi levado a todos os pontos que o relatório nomeia e aos demais onde aparecia: `RULE-0002` (fontes;
  tabela Modos; parágrafo sobre `ENDED`; diagrama e tabela de transições, com a permanência em `RACE_CHASE`
  e a transição `RACE_CHASE` para `COUNTDOWN_DESCENT` na nova volta; pose por modo; reposicionamento que
  invalida a volta; tabela de campo de visão), `FEAT-0003` (resumo, canais, requisitos 01 a 03 e 11, tabela
  Comportamento, tabela Estado, critérios de aceite), `02-glossary.md` ("Em corrida" com a definição dos
  requisitos, "Visão geral da pista", "Volta encerrada", `cameraMode`, `lapPhase`; o termo "Painel de
  resultado" trazido do glossário dos requisitos, como definição de algo que já existe no jogo),
  `FLOW-0002` (introdução, diagrama, passos 8 e 9, alternativas), `FLOW-0001` (introdução, diagrama, passos
  1 e 4, alternativas "Reposicionamento" e "Volta encerrada"), `SCR-0001` (propósito, pontos de entrada,
  estados "Visão geral" e "Em corrida", ações, navegação), `API-0003` (`cameraMode`, `cameraHeightM`,
  compatibilidade) e `01-overview.md` (decisões do dono do produto, `DOMAIN/DEC-06`; decisão de forma
  "Modo da câmera derivado do estado da volta"; relação com `race-lap-validation`). Fechada por edição.
- Cobertura de AC-US-0003-13, critério novo dos requisitos 1.2.0: realizado pelos requisitos 01, 02, 03 e
  11 de `FEAT-0003`, que passaram a dizer a janela de "em corrida" (do sinal verde até o quadro anterior à
  próxima visão geral, inclusive do fim da volta em diante, com o painel de resultado exibido) e que a visão
  geral nunca ocorre com a volta encerrada; os critérios de aceite de pose de corrida e de visão geral de
  `FEAT-0003` carregam o critério 13. Nenhum requisito, campo, enum, estado de tela, passo de fluxo ou
  contrato foi acrescentado (§16): a cobertura usou a superfície que o conjunto já tinha, na leitura que o
  validador dos requisitos registrou (AC-US-0003-13 é a pose dos critérios 01 a 03 sobre a janela de
  `ENDED`; "sem voltar à visão geral" é consequência dessa pose).
- ISSUE-02 (warning, F4, `01-overview.md`, Lacunas deliberadas): a abertura e a tabela dizem, linha a
  linha, a origem de cada ponto, numa coluna própria: recusa registrada no changelog dos requisitos, com a
  rodada, ou ponto que nenhum critério fixa, sem recusa registrada. A linha "duração e curva da descida,
  trajetória horizontal" foi separada em duas, porque só a primeira metade é recusa registrada (rodada 1).
  Pontos não fixados por nenhum critério: trajetória horizontal da câmera na contagem; altura, ponto de mira
  e campo de visão da visão geral e campo de visão durante a descida; razão entre volante e esterço; direção
  da luz, aparência da sombra, sombra do fantasma e de outros objetos; aparência do fantasma. Recusas
  registradas: campo de visão vertical em retrato acima dos pisos, magnitude do turbo, tolerância de
  diâmetros e bitolas, cores do capacete e das demais peças (rodada 1); tolerância do giro das rodas e
  condição de câmera para o número 01 (rodada 2); valor e duração do painel de resultado e o que o Jogador
  faz para chegar à próxima visão geral (rodada 3, linha nova decorrente de `DOMAIN/DEC-06`). O primeiro
  item recusado da rodada 1 deste changelog foi corrigido no mesmo sentido e marcado como corrigido nesta
  rodada. Fechada por edição.
- Versões: `FEAT-0003`, `RULE-0002`, `FLOW-0001`, `FLOW-0002`, `SCR-0001`, `API-0003`, `01-overview.md` e
  `02-glossary.md` em 1.1.0. `98-divergences.md` sem mudança. `00-index.md` e `99-traceability.md` não foram
  tocados: o gate os regenera. Os arquivos editados continuam `status: draft`; o gate e o validador decidem.

**Itens fechados**: ISSUE-01 e ISSUE-02, ambos por edição. Divergências registradas: nenhuma.

**Itens recusados, com motivo**

- Requisito novo em `FEAT-0003` só para AC-US-0003-13, estado de tela próprio "Volta encerrada" em
  `SCR-0001` e passo novo em `FLOW-0002` para a nova volta: não criados; seriam superfície nova numa rodada
  de correção (§16), e o critério é realizado pelos requisitos 01 a 03 e 11 existentes, pelo estado "Em
  corrida" e pelo passo 9.
- O que o Jogador faz para chegar à próxima visão geral depois do fim da volta (nova tentativa, reinício) e
  o valor e a duração do painel de resultado: não fixados; os requisitos recusaram (changelog deles, rodada
  3), e este conjunto exige só a pose de corrida até a próxima visão geral.
- Decisões do dono do produto repassadas a esta rodada que não mudam o conjunto: "só camada de aplicação,
  sem mudar os três arquivos da simulação nem os presets" já está em `FEAT-0006` (NFR-0005, NFR-0006);
  "fonte do modelo: código do Cowork" já está em `FEAT-0001` via `DOMAIN/DEC-00`; "código na raiz do
  repositório" e "entrega depois da `dirigibilidade`" continuam fora, pelo motivo da rodada 1: decisões de
  design e de entrega, para `300 Specs/330 D-Specs`.
- Divergência com o sistema em execução para o modo da câmera com a volta encerrada: nenhuma registrada;
  esta etapa não lê a raiz de código (§12), e a etapa de código registra em `98-divergences.md`, com
  `arquivo:linha`, o que o sistema ainda não atende.

## 2026-10-22 — rodada 3, Mode B (relatório `fspec-validation-20261022-1919.md`, 7 erros, 1 info)

**O que mudou**

- Origem das ISSUE-01 a ISSUE-07: os requisitos validados moveram depois de `fspec-validation-20261022-1757`
  (`req-validation-20261022-1909`, SUCCESS). O dono do produto corrigiu `DOMAIN/DEC-06` em `DOMAIN.md`
  (2026-10-22, depois de um feedback do D-Spec) e os requisitos absorveram a correção em US-0003 1.2.1
  (Canais; pré-condições; casos anormais "Reposicionamento do kart em corrida" e "Fim da volta, válida ou
  invalidada, com o painel de resultado exibido"; Fontes), `02-glossary.md` 1.2.0 ("Em corrida", "Fim da
  volta (`ENDED`)", "Painel de resultado") e `01-context.md` 1.2.0 (`DOMAIN/DEC-06`; relação com
  `race-lap-validation`): a frase "o kart continua pilotável" não vale; quando a volta termina (`ENDED`) e
  o painel de resultado aparece, a simulação para e o kart congela, como hoje (invariante INV-1 de
  `race-lap-validation`), e a decisão descreve só a câmera, que continua atrás do piloto, na pose de
  corrida em relação ao kart parado, até a próxima visão geral. O autor passou a decisão a esta execução
  com a ordem de retirar toda frase de pilotagem depois de `ENDED` e de não redescobri-la. Nenhum `AC-*`
  mudou em 1.2.1.
- ISSUE-01 (error, F4, `02-glossary.md`): "Em corrida" deixa de dizer "enquanto o Jogador pilota" e "o
  kart continua pilotável" e passa a dizer que, depois do fim da volta, com o painel exibido, a simulação
  está parada e o kart congelado, como hoje, e só a câmera continua na pose de corrida em relação ao kart
  parado até a próxima visão geral (`DOMAIN/DEC-06` corrigida); "Volta encerrada" diz que a simulação para
  e o kart congela (INV-1) e que a câmera continua em `RACE_CHASE` em relação ao kart parado; "Painel de
  resultado" diz "sobre a cena com a simulação parada e o kart congelado". O mesmo fato levado às linhas
  `simStepCount` (não avança com a simulação parada) e `cameraMode` (`ENDED` com a simulação parada).
  Fechada por edição.
- ISSUE-02 (error, F4, `01-overview.md`): o primeiro parágrafo de "O que é especificado", a decisão de
  forma "Modo da câmera derivado do estado da volta" e o item `race-lap-validation` de "Relação com outras
  features" dizem que, ao fim da volta, a simulação para e o kart congela (INV-1 de `race-lap-validation`,
  que é daquela feature e não muda) e que só a câmera continua na pose de corrida em relação ao kart
  parado; o parágrafo de camadas lista o congelamento ao fim da volta entre o que não muda. Fechada por
  edição.
- ISSUE-03 (error, F4, `FEAT-0003`): o resumo diz que a simulação para e o kart congela ao fim da volta e
  que só a câmera continua na pose de corrida; a linha "Volta encerrada" da tabela Comportamento diz que a
  câmera fica na pose de corrida em relação ao kart parado, com a simulação parada (INV-1), que a visada
  não muda entre quadros porque o rumo não muda (requisito 08 com variação nula) e que vale a regra de
  campo de visão da forma; "o kart continua pilotável" sai. O mesmo fato levado à seção Canais (como em
  US-0003 1.2.1, Canais), à linha "Reposicionamento do kart em corrida" (a simulação para, o kart congela)
  e à linha `RACE_CHASE` da tabela Estado (`simStepCount` não avança depois de `ENDED`). Os requisitos 01
  a 03 e 11 e os critérios de aceite não mudaram: nenhum `AC-*` mudou. Fechada por edição.
- ISSUE-04 (error, F4 e D-FS-02, `RULE-0002`): o parágrafo depois da tabela Modos diz que a câmera
  continua na pose de corrida em relação ao kart parado, com a simulação parada e o kart congelado (INV-1
  de `race-lap-validation`, que esta feature não muda), citando `DOMAIN/DEC-06` corrigida; a coluna de
  contador da linha "`RACE_CHASE` permanece `RACE_CHASE`" diz que `simStepCount` não avança depois de
  `ENDED` e que a pose lida em cada quadro é a mesma, em relação ao kart parado, até `startLap` aceito ou
  recarga. O mesmo fato levado às Fontes, à linha `RACE_CHASE` de "Pose por modo", ao parágrafo da pose
  (visada com variação nula com o kart parado; reposicionamento que invalida a volta) e ao parágrafo da
  tabela de campo de visão. Nenhuma transição, modo, campo ou estado novo. Fechada por edição.
- ISSUE-05 (error, F4, `FLOW-0001`): a introdução e a linha "Volta encerrada" dizem que, com a volta em
  `ENDED`, a simulação está parada e o kart congelado (INV-1; NFR-0006): os passos 1 a 3 não produzem
  passo novo (`simStepCount` não avança) e os passos 4 a 11 leem o estado congelado e desenham a câmera na
  pose de corrida em relação ao kart parado, sem corte e sem visão geral, até o quadro anterior à próxima
  visão geral; o passo 1 deixa de afirmar pilotagem depois do fim da volta e deixa de citar AC-US-0003-13
  para isso (cita US-0003, caso anormal "Fim da volta"); o passo 3 diz que nenhum passo ocorre em `ENDED`;
  o laço do diagrama diz o mesmo; a linha "Reposicionamento do kart" carrega o congelamento. Fechada por
  edição.
- ISSUE-06 (error, F4, `FLOW-0002`): o passo 9 diz "em relação ao kart parado, com a simulação parada e o
  kart congelado (INV-1 de `race-lap-validation`)", mantendo o resto do passo. O mesmo fato levado à
  introdução, ao diagrama, ao passo 8 (a simulação para e o kart congela; `simStepCount` não avança) e às
  alternativas "Reposicionamento que invalida a volta" e "Troca de orientação, redimensionamento, pausa ou
  turbo com a volta encerrada". Fechada por edição.
- ISSUE-07 (error, F4, `SCR-0001`): a linha "Em corrida (populado)" diz que, com a volta encerrada, o
  Kart 01 é exibido congelado no estado que a simulação informa (simulação parada, INV-1), rodas sem giro
  e sem trecho novo de marca, que o painel aparece sobre a cena sem mover a câmera, que a câmera fica na
  pose de corrida em relação ao kart parado e que nenhum quadro mostra a visão geral. O mesmo fato levado
  ao propósito, às ações "Esterçar, acelerar, frear" (com a volta encerrada a cena não muda) e
  "Reposicionar o kart", e à navegação. Nenhum estado de tela novo (§16). Fechada por edição.
- ISSUE-08 (info, F3, `02-glossary.md`; reemissão da ISSUE-01 de `fspec-validation-20261022-1757`): a
  linha de campos de `getLapState` nomeia também `resumePhase` (`COUNTDOWN` ou `RUNNING`, a fase a que a
  volta em `PAUSED` retorna), como campo de `race-lap-validation` nomeado e não redefinido, que `FEAT-0003`,
  `RULE-0002` e `FLOW-0002` já liam; a coluna Onde passa a citar os três. Não é superfície nova (§16): o
  conjunto já carregava o nome em três arquivos; só a linha do glossário estava atrás. Fechada por edição.
- O item da rodada 2 deste changelog que repetia "o kart continua pilotável" recebeu a marca de superado,
  como o item da rodada 1 recebeu na rodada 2; o registro histórico não foi reescrito.
- Versões: `01-overview.md`, `02-glossary.md`, `FEAT-0003`, `RULE-0002`, `FLOW-0001`, `FLOW-0002` e
  `SCR-0001` em 1.2.0, com `status: draft`; o gate e o validador decidem. `API-0001`, `API-0002`,
  `API-0003`, `98-divergences.md` e os demais arquivos sem mudança. `00-index.md` e `99-traceability.md`
  não foram tocados: o gate os regenera.

**Itens fechados**: ISSUE-01 a ISSUE-08, todos por edição. Divergências registradas: nenhuma.

**Itens recusados, com motivo**

- Requisito novo (`REQ-*`) dizendo que a simulação para e o kart congela ao fim da volta: não criado. O
  congelamento é o invariante INV-1 de `race-lap-validation`, que esta feature não muda (US-0003 1.2.1,
  pré-condições; `DOMAIN/DEC-06`), e "simulação, passo e validação de volta inalterados" já está em
  `FEAT-0006` (NFR-0005, NFR-0006); um requisito desta feature sobre isso seria superfície nova numa
  rodada de correção (§16) e restataria o invariante de outra feature. O fato entra como pré-condição e
  comportamento, não como requisito.
- `API-0003`: não editado. Nenhuma frase de pilotagem depois de `ENDED` existe nele; `RACE_CHASE` em
  `ENDED` e a idempotência por `simStepCount` continuam válidas com o kart parado (o passo não avança, e a
  mesma pose dá a mesma câmera), como o relatório registrou em Coverage.
- Requisitos 01 a 03 e 11 de `FEAT-0003` e os critérios de aceite: não alterados; os `AC-*` não mudaram
  em US-0003 1.2.1 e o relatório diz que não mudam.
- "O que o D-Spec herdou" (`300 Specs/330 D-Specs/Output/modelo-kart-01/`): não editado. Esta execução
  escreve só sob `300 Specs/320 F-Specs/Output/modelo-kart-01/` (fspec-generator, "Artifact locations";
  conventions §14 e §20); o D-Spec lê este conjunto como upstream movido e corrige a herança no seu
  próprio loop.
- Decisões do autor repassadas a esta rodada que não mudam o conjunto: "feature só de camada de
  aplicação" já está em `FEAT-0006` (NFR-0005, NFR-0006) e em `01-overview.md` (Camadas); "fonte do modelo
  `docs/kart-01/kart.js`" já está em `FEAT-0001` via `DOMAIN/DEC-00`; "código na raiz do repositório" e
  "código entra depois da dirigibilidade" continuam fora, pelo motivo das rodadas 1 e 2: decisões de
  design e de entrega, para `300 Specs/330 D-Specs`.
- Divergência com o sistema em execução: nenhuma registrada; o congelamento ao fim da volta é "como
  hoje", e esta etapa não lê a raiz de código (§12).
- Pausa com a volta encerrada (alternativa de `FLOW-0002`): a linha foi mantida com a situação original e
  o tratamento ajustado ao kart parado; se `race-lap-validation` não admite `PAUSED` a partir de `ENDED`,
  a linha é vazia e inofensiva; esta especificação não redefine o estado da volta daquela feature.

## 2026-10-30 — rodada 4, Mode C (requisitos revalidados contra o seed `revision: 3`)

**Origem**: os requisitos de `200 Requirements/230 Output/modelo-kart-01/` foram revalidados contra o seed
`revision: 3` (relatório `reports/req-validation/req-validation-20261030-0234.md`, SUCCESS; rodadas 5 a 7
do changelog deles), com `DOMAIN/DEC-07` e `DOMAIN/DEC-08`: no treino as voltas são seguidas, o kart não
congela ao fim de uma volta e a câmera continua atrás do piloto (o congelamento vale só para a volta
oficial); o drift e o turbo saíram do jogo, então não há indicação de drift nem fumaça ou chama de turbo, e
as marcas de pneu continuam; a câmera de corrida tem só o campo de visão de base. Mudanças de critério
carregadas: AC-US-0003-14 novo; o critério 09 de US-0003 retirado; AC-US-0003-04 a AC-US-0003-06 sem a
condição "sem turbo ativo", valendo em todos os quadros; AC-US-0003-13 limitado à volta oficial; os
critérios 02 e 03 de US-0005 retirados; AC-US-0005-04 e AC-US-0005-05 novos; casos anormais novos em
US-0002 ("Fim da volta oficial", "Fim de uma volta de treino"), em US-0003 ("Fim de uma volta de treino",
"Comando que antes acionava o turbo") e em US-0005 ("Fim da volta oficial", "Fim de uma volta de treino",
"Comando que antes acionava o drift ou o turbo"). Nenhum `FEEDBACK-<nn>` ou `ISSUE-<nn>`: a rodada é a
mudança do upstream.

**O que mudou**

- `FEAT-0003` (1.3.0): resumo, canais, requisitos 01 a 03 e 11 com a janela "em corrida" que inclui o fim
  da volta oficial (kart parado) e o fim de uma volta de treino (kart em movimento); requisitos 05 a 07 sem
  "sem turbo ativo", valendo em todos os quadros; requisito 15 sem a parcela de turbo; o requisito 10
  (efeito de turbo no campo de visão) retirado, marcado no arquivo, sem reaproveitar o número; requisitos
  novos 16 (câmera no treino, AC-US-0003-14) e 17 (nenhum comando muda o campo de visão; AC-US-0003-04 a
  AC-US-0003-06 e caso anormal "Comando que antes acionava o turbo"). Comportamento: saíram as linhas do
  turbo; entraram "Comando que antes acionava o turbo" e "Fim de uma volta de treino"; a linha da volta
  encerrada virou "Fim da volta oficial". Estado e critérios de aceite atualizados; `sources:` sem o
  critério 09 e com AC-US-0003-14.
- `RULE-0002` (1.3.0): o estado de turbo saiu das entradas; o tipo da volta (`lapKind`) é nomeado e
  declarado fora da decisão do modo; o modo `RACE_CHASE` cobre também o fim de uma volta de treino; a
  transição "permanece `RACE_CHASE`" foi separada em volta oficial (`simStepCount` parado) e treino
  (`simStepCount` avançando); a tabela de campo de visão perdeu a coluna e a linha do turbo; pose, forma e
  demais transições mantidas.
- `API-0003` (2.0.0, mudança maior): `baseVerticalFovDeg` e `turboFovDeltaDeg` retirados da resposta de
  `getCameraView`, com o substituto `verticalFovDeg` declarado em Compatibilidade (tabela de retirada);
  `verticalFovDeg` mantém nome, unidade e significado e passa a ser sempre o de base em `RACE_CHASE`;
  `cameraMode`, `cameraHeightM` e Idempotência cobrem o fim de uma volta de treino.
- `FEAT-0005` (2.0.0, mudança maior): os requisitos 02 e 03 (fumaça e indicação de drift nas posições do
  Kart 01) retirados, marcados no arquivo, sem reaproveitar os números; requisitos novos 09 (nenhuma
  indicação de drift, AC-US-0005-04) e 10 (nenhuma fumaça ou chama de turbo, AC-US-0005-05); requisitos
  04, 07 e 08 reduzidos às marcas de pneu, e o 08 cobre também o kart congelado depois do fim da volta
  oficial; comportamento com "Fim da volta oficial", "Fim de uma volta de treino", "Comando que antes
  acionava o drift ou o turbo" e "Antes da largada"; critérios de aceite e `sources:` atualizados.
- `RULE-0003` (1.1.0): a ancoragem cobre só as marcas de pneu; entrou a tabela de decisão "Efeitos
  retirados" (indicação de drift e fumaça ou chama de turbo nunca exibidas); a tabela do giro das rodas
  ganhou as linhas do fim da volta oficial e do fim de uma volta de treino; estado e repetição sem fumaça e
  drift.
- `FEAT-0002` (1.1.0): duas linhas de comportamento, "Fim da volta oficial" e "Fim de uma volta de
  treino", dos casos anormais novos de US-0002; nenhum requisito mudou, porque nenhum critério de US-0002
  mudou.
- `FLOW-0001` (1.3.0), `FLOW-0002` (1.3.0) e `SCR-0001` (1.3.0): o fim da volta oficial e o fim de uma volta
  de treino tratados em separado (passo 10 novo em `FLOW-0002`, com ramo `alt` no diagrama); campo de visão
  só de base; marcas de pneu sem fumaça nem drift; ação "teclas, toques ou inclinações que antes acionavam
  o drift ou o turbo" em `SCR-0001`; `sources:` sem os critérios retirados e com AC-US-0003-14,
  AC-US-0005-04 e AC-US-0005-05.
- `01-overview.md` (1.3.0): decisões `DOMAIN/DEC-07` e `DOMAIN/DEC-08` e seed `revision: 3`; mapa do
  conjunto; decisão de forma "Modo da câmera derivado do estado da volta" com o treino; a lacuna
  "Magnitude do efeito de turbo no campo de visão" saiu (o efeito não existe mais); entrou a lacuna
  "Painel de resultado no fim de uma volta de treino" (recusa registrada no changelog dos requisitos,
  rodada 5); relação com `dirigibilidade` (revisão 4) e com `race-lap-validation` (treino, revisão 3,
  US-10).
- `02-glossary.md` (1.3.0): "Em corrida", "Fim da volta" (no lugar de "Volta encerrada"), "Volta oficial" e
  "Treino" (novos), "Painel de resultado", "Visão geral da pista", "Efeito de turbo no campo de visão",
  "Fumaça ou chama de turbo" (no lugar de "Fumaça do escapamento"), "Indicação de drift", "Escapamento",
  `simStepCount`, `cameraMode`, `lapKind` e a linha dos dois campos retirados de `API-0003`.
- Os arquivos editados voltaram a `status: draft`; o gate e o validador decidem. `FEAT-0001`, `FEAT-0004`,
  `FEAT-0006`, `API-0001`, `API-0002`, `FLOW-0003`, `RULE-0001` e `98-divergences.md` sem mudança: nenhum
  critério que realizam mudou. `00-index.md` e `99-traceability.md` regenerados pelo gate com `--emit`.

**Itens fechados**: nenhum `ISSUE-<nn>`, `FB-<nn>` ou `FEEDBACK-<nn>` (rodada gerada pela mudança do
upstream). Divergências registradas: nenhuma.

**Itens recusados, com motivo**

- Decidir o modo da câmera pelo tipo da volta (`lapKind`): não feito. Os critérios 13 e 14 de US-0003 pedem
  a mesma pose de corrida nos dois casos, em relação ao kart que a simulação informa; o tipo da volta só
  muda o estado do kart, e a câmera o segue. Por isso a volta de reconhecimento (`RECON`), que os requisitos
  desta feature não nomeiam, também não precisa de regra própria: vale a mesma pose em relação ao kart
  informado.
- Especificar como `race-lap-validation` encadeia as voltas seguidas do treino (fase entre duas voltas,
  painel no treino): não feito. É daquela feature (revisão 3, US-10), cujo F-Spec ainda não traz US-0010; os
  requisitos desta dizem que esta feature só fixa a câmera. A regra da câmera vale qualquer que seja a fase
  com que aquela feature represente o fim de uma volta de treino, desde que não haja nova contagem.
  Nenhum feedback enviado: nenhum requisito daquela feature precisa mudar por causa desta.
- Manter `baseVerticalFovDeg` como sinônimo de `verticalFovDeg`: não feito; sem turbo os dois teriam sempre o
  mesmo valor, um fato em dois campos. Os dois campos do turbo saem juntos, com o substituto declarado.
- Divergência para o código que ainda publique os campos retirados ou exiba os efeitos retirados: não
  registrada; esta etapa não lê a raiz de código para derivar comportamento (conventions §12), e a etapa de
  código registra em `98-divergences.md`, com `arquivo:linha`, o que o sistema ainda não atende.
- Requisito de pilotagem no treino ("o kart continua pilotável depois do fim de uma volta"): não criado,
  pelo mesmo motivo dos requisitos (changelog deles, rodada 5): a continuidade das voltas é de
  `race-lap-validation`; aqui o fato entra como comportamento e como estado do kart que a câmera segue.
- Requisito sobre fumaça do escapamento não ligada ao turbo: não criado; os requisitos falam só de fumaça
  ou chama de turbo (changelog deles, rodada 5).

## 2026-10-30 — rodada 5, Mode B (relatório `fspec-validation-20261030-1157.md`, 1 erro)

**O que mudou**

- ISSUE-01 (F5, `02-glossary.md`, linha `lapPhase`, `resumePhase`, `countdownRemainingMs`, `lapKind`): a
  linha passa a dar o domínio de `lapKind` exatamente como `getLapState` o nomeia: `OFFICIAL`, `RECON`,
  `TRAINING`. Diz que `OFFICIAL` é a volta oficial e `TRAINING` o treino desta especificação, que `RECON` não
  é nomeado pelos requisitos desta feature e que o que acontece com o kart no fim dela é de
  `race-lap-validation`, e que nenhum dos três valores decide o modo da câmera. As linhas "Volta oficial" e
  "Treino" nomeiam cada uma o seu valor e não dizem que o enum tem só dois valores; ficaram como estavam.
  Os demais lugares que citam `lapKind` (`01-overview.md`, `FEAT-0003`, `RULE-0002`) não dão o domínio do
  enum e não mudaram. Fechada por edição. `02-glossary.md` em 1.3.1.
- Superfície e §16: nenhum requisito, campo, enum, endpoint ou elemento de tela acrescentado. O domínio
  completo de um campo que outra feature define está agora escrito como ela o define.

**Itens fechados**: ISSUE-01, por edição. Divergências registradas: nenhuma.

**Itens recusados, com motivo**

- Pedido do coordenador desta rodada para dizer de que lado da regra de congelamento fica a volta `RECON`,
  conferindo US-0008 e US-0010 dos requisitos de `race-lap-validation`: não feito. O relatório não pede
  isso: o "esperado" da ISSUE-01 é só o domínio completo. Os requisitos desta feature não nomeiam a volta de
  reconhecimento, e ler os requisitos de outra feature para decidir comportamento passa do limite de
  entradas desta etapa (conventions §12). Por isso a decisão também não é necessária para a câmera, que
  segue a pose do kart informada pela simulação em qualquer tipo de volta. Escrever aqui se o kart congela
  no fim de uma volta `RECON` seria redefinir um invariante de `race-lap-validation` (INV-1) e acrescentar
  comportamento que nenhum critério pede numa rodada de correção (§16). Se o dono do produto quiser a
  regra de `RECON` dita nesta feature, ela tem de entrar pelos requisitos dela.
