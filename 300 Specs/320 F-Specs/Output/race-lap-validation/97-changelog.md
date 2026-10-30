---
title: Registro de mudanças — validação de volta de corrida
feature: race-lap-validation
stage: fspec
status: validated
version: 1.2.1
sources: []
---

# Registro de mudanças

## 2026-10-20 — rodada 1, Mode A

**O que mudou**

- Conjunto gerado do zero a partir dos requisitos validados de `200 Requirements/230 Output/race-lap-validation/`
  (US-0001 a US-0009, NFR-0001 a NFR-0012; seed `revision: 2`, `DOMAIN.md` DEC-01 a DEC-11).
- Nove funcionalidades (`FEAT-0001` a `FEAT-0009`), quatro fluxos (`FLOW-0001` a `FLOW-0004`), três contratos
  (`API-0001` a `API-0003`), três telas (`SCR-0001` a `SCR-0003`) e seis regras (`RULE-0001` a `RULE-0006`).
- Todo critério `AC-*` e todo NFR dos requisitos é realizado por ao menos um requisito; os NFR de
  verificação, desempenho, privacidade, passo fixo e física estão em `FEAT-0009`, o de determinismo entre
  navegadores em `FEAT-0003` e o de versionamento do dado de pista em `FEAT-0008`.
- `00-index.md` e `99-traceability.md` não foram escritos: o gate os gera com `lint_artifacts.py --emit`.

**Decisões de forma registradas**

- Não existe API de rede no MVP (diretrizes do estágio). Os contratos de `api/` são contratos em processo
  dentro do navegador, com o único papel `player` (anônimo), erros como códigos de rejeição e idempotência
  pelo estado da volta.
- Nomes de campo em `camelCase` com unidade no sufixo, como manda a diretriz D-FS-06 do projeto, no lugar do
  `snake_case` padrão da habilidade do gerador (a diretriz do projeto prevalece).
- Textos em inglês de estado e de motivo, e os textos auxiliares das telas (carregando, erro, sem pista,
  controle por toque, pausada), foram redigidos em `RULE-0006` porque o NFR-0007 exige as mensagens nos dois
  idiomas; os requisitos fixam apenas os textos em português de estado e de motivo.
- O campo opcional `challengeNumber` do pedido `startLap` e do resultado vem de `SEED/IM-I1` e de D-FS-01
  (o resultado precisa poder ser ligado ao desafio); a feature não o deriva.
- As adições ao dado de pista (`direction`, `startPosition`, `finishLine`, `sectorLimits`, `markers`,
  `cutDistanceM`, `cutDurationMs`) são o mínimo que os critérios de US-0002, US-0004, US-0006 e US-0008
  exigem do dado. O dado de pista na forma anterior é `INCOMPLETE` (só treino), consequência de
  `DOMAIN/DEC-10` e do NFR-0012.

**Itens fechados**: nenhum `ISSUE-<nn>` ou `FB-<nn>` (primeira geração).

**Itens recusados, com motivo**

- Meio de continuar a volta depois da pausa, pausa manual por toque em `web-mobile`, tamanho mínimo de
  texto em `web-desktop`, o que a volta de treino cronometra em pista sem linha de chegada: os requisitos
  recusaram decidi-los (rodadas 2 e 3 do estágio anterior, sem decisão posterior no seed `revision: 2`).
  Nenhum critério os pede, então esta especificação não os decide; estão em "Lacunas deliberadas" de
  `01-overview.md`.
- Ponto de recolocação do kart no reposicionamento e precedência de duas invalidações no mesmo passo:
  nenhum requisito os decide; seguem em "Lacunas deliberadas".
- Método de arredondamento do instante interpolado para ms inteiros: é decisão de projeto (D-Spec); o
  F-Spec fixa apenas as restrições de `RULE-0003`.
- Divergências com o sistema em execução: nenhuma registrada. Esta etapa não lê a raiz de código
  (conventions §12); apenas os nomes do dado de pista existente foram consultados para não colidir com ele.
- `NOTES.md` da pasta do seed não foi lido (fora da lista de entrada da etapa); `SEED.md` foi consultado só para escopo e restrições.

## 2026-10-20 — rodada 2, Mode B

**Itens fechados**

- ISSUE-01: `FLOW-0003` declara que a deduplicação do `pauseLap` repetido ocorre na simulação, pelo `lapPhase`.
- ISSUE-02: `SCR-0001` passa a usar `trackDataError` (RULE-0006) apenas para `UNSUPPORTED_SCHEMA` e `UNREADABLE`; as
  rejeições de `startLap` não são exibidas. `SCR-0003` estado Erro: tela não exibida, sem mensagem. Nenhuma chave nova.
- ISSUE-03: `API-0003` corrige a afirmação de aninhamento, listando os valores estruturados (ponto, linha, listas de linhas).

**Itens recusados, com motivo**

- ISSUE-03, alternativa de achatar `startPosition` e `finishLine` em campos planos: renomearia campos do contrato sem
  critério que peça; a afirmação foi corrigida em vez disso.
- ISSUE-02, alternativa de definir novas chaves de mensagem em `RULE-0006`: acrescentaria superfície numa rodada Mode B (§16).

## 2026-10-22 — rodada 3, Mode C (feedback de `dirigibilidade`)

**Entrada**

- Feedback `reports/feedbacks/dirigibilidade/feedback-20261021-1647.md`, item FB-01 (severidade `scope`),
  pendente por ser posterior ao relatório de validação de 2026-10-20T18:57:00Z. É o único feedback pendente
  de qualquer origem para esta feature nesta etapa.
- Decisão do autor para esta rodada: FB-01 aceito. Motivo registrado: o seed de `dirigibilidade` (US-5, I3)
  decide que mudar o acerto é uma nova versão declarada no dado publicado, e registros antigos continuam
  legíveis pelos padrões (I5). Superfície congelada ao que o feedback nomeia: os dois campos e a regra de
  comparabilidade; nada mais muda neste conjunto.

**Itens fechados**

- FB-01 (aceito):
  - `API-0001`: `setupId` (enum `ARCADE_ASSISTIDO`, `REALISTA_ALUGUEL_4T`; padrão `ARCADE_ASSISTIDO` quando
    ausente) e `setupVersion` (texto; padrão `previousSetupVersion` do `setupId` quando ausente) acrescentados
    à resposta de `getLapResult` como campos opcionais e aditivos, com a neutralidade de cada padrão (I5) e a
    nota de compatibilidade (nenhum campo renomeado, removido ou com significado alterado; registros
    anteriores lidos sem erro).
  - `API-0002`: os mesmos campos acrescentados ao pedido `startLap`, opcionais, copiados sem interpretação
    para o resultado (mesmo tratamento de `challengeNumber`); informados pela camada de aplicação a partir do
    dado publicado de `dirigibilidade`; toda volta iniciada a partir desta mudança os informa. Nenhuma
    rejeição nova.
  - `SCR-0003`: seção "Comparação de tempos" — a tela só compara dois tempos quando a `comparability`
    decidida por `compareLapRecords` (contrato `API-0002` de `dirigibilidade`) é `COMPARABLE`; com qualquer
    outro valor nenhuma comparação é exibida; a decisão nunca é da renderização (D-FS-05). Texto compartilhado
    derivado do resultado leva a `setupVersion` e obedece à mesma precondição.
  - `02-glossary.md`: linhas de `setupId`, `setupVersion` e `comparability`; o termo "Acerto" passa a nomear
    os dois campos que o identificam.
- Versões: `API-0001` 1.0.0 → 1.1.0, `API-0002` 1.0.0 → 1.1.0, `SCR-0003` 1.0.1 → 1.1.0, `02-glossary.md`
  1.0.0 → 1.1.0, este registro 1.0.0 → 1.1.0; todos em `status: draft` até a validação.
- `00-index.md` e `99-traceability.md` não foram escritos: o gate os regenera com `lint_artifacts.py --emit`.

**Itens recusados ou limitados, com motivo**

- FB-01, parte "no replay e no texto compartilhado": este conjunto não possui contrato de replay nem de texto
  compartilhado (`SCR-0003`: o que se faz com o resultado é do desafio diário; o replay é lido por `readReplay`,
  contrato `API-0002` de `dirigibilidade`). Criar um contrato de replay ou de texto compartilhado aqui seria
  superfície que nenhum critério desta feature pede. Os dois campos foram registrados na fonte da qual esses
  registros copiam (o resultado, `API-0001`), e a precondição de comparabilidade do texto compartilhado foi
  registrada em `SCR-0003`.
- Rejeição nova em `startLap` para `setupId` fora do enum: não acrescentada (superfície congelada pela decisão
  do autor). O comando copia o valor sem interpretação; a resolução do acerto é do leitor do dado publicado
  (`UNKNOWN_SETUP` em `getSetupVersion`, `dirigibilidade`), como fica dito na linha do campo.
- Requisito novo em `FEAT-0002` para os campos de acerto: não acrescentado. Os campos seguem o precedente de
  `challengeNumber` (campo de contrato sem requisito próprio, com a fonte nomeada na linha do campo); a fonte é
  FB-01, que não é critério desta feature, e nenhum `AC-*` deste conjunto os pede.
- `getLapState` (estado durante a volta) não recebe os campos: o feedback nomeia o resultado, o replay e o
  texto compartilhado; o HUD (`SCR-0001`) não exibe nem compara acerto.
- `98-divergences.md` inalterado: esta etapa não lê a raiz de código (conventions §12).
- `sources:` dos arquivos alterados inalterado: FB-01 e os `AC-*` de `dirigibilidade` não são ids do upstream
  desta feature (gate G6); a fonte é citada no corpo de cada linha acrescentada.

## 2026-10-30 — rodada 4, Mode C (requisitos revalidados contra o seed revision 3)

**Entrada**

- Requisitos de `200 Requirements/230 Output/race-lap-validation/` revalidados contra o seed `revision: 3`
  (relatório `reports/req-validation/req-validation-20261030-1158.md`, SUCCESS; rodadas 6 a 9 do changelog
  dos requisitos). Nova história US-0010 (voltas seguidas no treino, AC-US-0010-01 a AC-US-0010-27) e
  decisões `DOMAIN/DEC-12` (voltas seguidas no treino; a volta oficial mantém `DOMAIN/DEC-06` e o INV-1) e
  `DOMAIN/DEC-13` (setor não cruzado como "—", tempo total sempre que a volta terminou na chegada, pista sem
  setores só com tempo total e validade, confirmada pelo dono do produto). Mudaram também AC-US-0001-01,
  AC-US-0006-06, AC-US-0007-04 a AC-US-0007-06, AC-US-0009-01, a pré-condição de AC-US-0002-07 e
  AC-US-0002-08, casos anormais de US-0002, US-0004 a US-0009 e o NFR-0009.
- Este conjunto tinha sido gerado contra o seed `revision: 2`; nenhum `AC-US-0010-*` era realizado.

**O que mudou**

- Novo `features/FEAT-0010-voltas-seguidas-no-treino.md` (`1.0.0`): REQ-FEAT-0010-01 a REQ-FEAT-0010-27
  realizam um a um AC-US-0010-01 a AC-US-0010-27; REQ-FEAT-0010-28 a REQ-FEAT-0010-31 são `[DOMAIN]` dos
  casos anormais de US-0010 (contramão, segundo motivo, encerrar na pausa, recarga).
- Novo `flows/FLOW-0005-treino-com-voltas-seguidas.md` (`1.0.0`), com sequência, passos e alternativas,
  incluindo onde ocorre a deduplicação do cruzamento (D-FS-03) e o funcionamento sem rede (D-FS-08).
- `rules/RULE-0002` (`1.1.0`): o treino é uma sequência de voltas de um único `startLap`; transição
  `RUNNING` para `RUNNING` na chegada; `ENDED` do treino só por `endTraining`; contadores `lapSequenceCount` e
  `lapStartMs`; `stepCount` não recomeça; `pauseCause` `PAUSE_BUTTON`; contagem só antes da primeira volta;
  avanço sem parar no treino; kart parado no encerramento da volta oficial.
- `rules/RULE-0001` (`1.1.0`): tabelas por tipo de volta com a coluna do treino (marcador pulado inicia a volta
  seguinte; corte não encerra; reposicionar não invalida nem revalida); volta seguinte sem motivo; pista sem
  marcadores declarados lida pela definição de volta válida (zero marcadores).
- `rules/RULE-0003` (`1.1.0`): fronteiras `b0` a `b4` contadas do sinal verde, com `b0` igual a `lapStartMs`;
  registro de cada limite no primeiro cruzamento depois da última fronteira registrada; setor sem tempo quando
  falta uma das suas fronteiras; tempo total `b4` menos `b0`; soma dos tempos do treino; "—" no formato.
- `rules/RULE-0004` (`1.1.0`): no treino o corte invalida sem encerrar; `offTrackMs` não recomeça no início de
  uma volta do treino; novo corte numa volta já inválida sem efeito.
- `rules/RULE-0005` (`1.1.0`): linha do treino; reposicionamento no treino; tabela de `endTraining`; pista sem
  setores declarados.
- `rules/RULE-0006` (`1.1.0`): chaves `pauseAction`, `endTrainingAction`, `bestValidLap`, `sectorNoTime`;
  `lapStateInvalid`, `lapResultValid` e `lapUnofficial` também no resultado de cada volta do treino.
- `api/API-0001` (`1.2.0`): operação `listLapResults`; em `getLapState`, `lapSequenceCount`, `lapStartMs` e
  `bestValidLapMs`; em `getLapResult`, `lapSequenceCount`, `lapStartMs`, `trainingLapMs` e `trainingSectorMs`,
  só em resultado `TRAINING`; `pauseCause` `PAUSE_BUTTON`; tabela de compatibilidade da rodada, com o padrão
  neutro de cada campo.
- `api/API-0002` (`1.2.0`): comando `endTraining`; `pauseCause` `PAUSE_BUTTON`; rejeição `NOT_TRAINING`;
  efeito de `startLap` com `TRAINING`; idempotência de `endTraining`.
- `screens/SCR-0001` (`1.1.0`): estados "Inválida em andamento (treino)", "Resultado da volta do treino",
  "Melhor volta válida (treino)" e "Treino encerrado"; botão de pausa e ação "encerrar treino" nos dois canais;
  navegação do treino para `SCR-0002`. `screens/SCR-0002` (`1.1.0`): opção "treino". `screens/SCR-0003`
  (`1.2.0`): só volta oficial e de reconhecimento.
- `features/FEAT-0001` a `FEAT-0009` (`1.1.0`), `flows/FLOW-0001` a `FLOW-0004` (`1.1.0`): cada sítio do fato
  do treino carregado (ver a tabela de migração). `01-overview.md` (`1.1.0`): resumo, canais, mapa e lacunas.
  `02-glossary.md` (`1.2.0`): Volta, Contagem regressiva, Tempo total, Volta inválida, Pausa e Resultado
  ajustados; novos Treino, Encerrar o treino, Melhor volta válida, Setor sem tempo e os campos e operações
  novos.
- `api/API-0003`, `98-divergences.md` sem mudança. Todos os arquivos alterados em `status: draft`.
  `00-index.md` e `99-traceability.md` não foram escritos: o gate os gera com `lint_artifacts.py --emit`.

**Migração de requisitos existentes** (nenhum requisito removido; os ids são os mesmos)

| Requisito | Mudança | Motivo |
|---|---|---|
| REQ-FEAT-0001-01 | Contagem ao iniciar volta oficial, de reconhecimento ou treino | AC-US-0001-01 reescrito |
| REQ-FEAT-0002-07, REQ-FEAT-0002-08 | Restritos à volta iniciada no sinal verde | pré-condição de US-0002 |
| REQ-FEAT-0002-10 | O primeiro setor começa no início da volta | US-0010, voltas seguintes |
| REQ-FEAT-0002-12 | No treino, o novo cruzamento encerra a volta seguinte | US-0002, caso anormal |
| REQ-FEAT-0002-14 | Limite registrado no primeiro cruzamento depois da última fronteira registrada; em volta válida, o mesmo que antes | AC-US-0010-23 exige o tempo dos setores com os dois limites cruzados quando um limite anterior faltou |
| REQ-FEAT-0004-13 | No treino, o novo cruzamento encerra a volta seguinte | US-0004, caso anormal |
| REQ-FEAT-0005-06 | Restrito à volta oficial e à de reconhecimento | AC-US-0006-06 reescrito |
| REQ-FEAT-0005-11 | Acrescenta o caso do treino | US-0006, caso anormal |
| REQ-FEAT-0006-04, REQ-FEAT-0006-05, REQ-FEAT-0006-06 | Volta sem motivo; motivo "reposicionamento" não exibido; tempo desde o início da volta | AC-US-0007-04 a AC-US-0007-06 reescritos |
| REQ-FEAT-0006-12 | Acrescenta o efeito do treino | US-0008, caso anormal |
| REQ-FEAT-0007-01 | Início da volta inclui o das voltas seguintes do treino | AC-US-0009-01 reescrito |
| REQ-FEAT-0007-14 | Acrescenta a exibição no treino | US-0009, caso anormal |
| REQ-FEAT-0009-10 | Acrescenta as voltas seguidas do treino à lista de verificações | NFR-0009 `2.1.0` |

**Itens fechados**: nenhum `ISSUE-<nn>` ou `FB-<nn>` (nenhum relatório de validação ou feedback novo; a entrada
é o upstream revalidado).

**Itens recusados ou não decididos, com motivo**

- Duração da exibição do resultado de cada volta do treino: os requisitos recusaram fixá-la (rodada 6) e nenhum
  critério a pede; ficou em "Lacunas deliberadas" de `01-overview.md`, com a condição observável de que o
  resultado aparece ao terminar a volta, sem parar o jogo e sem ocultar o estado da volta em andamento.
- Forma de acionar "encerrar treino" e o botão de pausa: a tela os oferece como controles com rótulo em texto
  nos dois canais (AC-US-0010-15, AC-US-0010-16); nenhum atalho de teclado é decidido, porque nenhum critério
  o pede (lacuna registrada).
- Botão de pausa na volta oficial e na de reconhecimento: não estendido; o seed o nomeia só no treino e a
  proposta para `SCOPE-BACKLOG.md` registrada pelos requisitos (rodada 6) continua com o autor. Um
  `pauseLap` com `PAUSE_BUTTON` fora do treino é rejeitado com `NOT_TRAINING`.
- Segundo motivo no resultado de uma volta de treino já inválida: não acrescentado; o resultado mantém o único
  campo `invalidReason` com o primeiro motivo, como a regra "vale a primeira" já fazia; os requisitos não
  pedem um segundo motivo.
- Movimento do kart depois do encerramento de uma volta de reconhecimento: não decidido; AC-US-0010-22 fixa a
  parada só para a volta oficial (lacuna registrada).
- Persistência da melhor volta válida e dos resultados do treino entre sessões: fora do escopo (etapa 5);
  `listLapResults` só cobre o treino em andamento.
- O que se cronometra numa pista sem linha de chegada: continua não decidido pelo seed e por `DOMAIN.md`.
- `lapMs` e `sectorMs` não tiveram a condição de presença ampliada para o treino inválido: mudar o significado
  de um campo existente sem mudar o nome é vedado (política de contrato estrito, regra 5); o tempo total e os
  setores do treino estão em `trainingLapMs` e `trainingSectorMs`.
- `NOTES.md` da pasta do seed e `DOMAIN.md` não foram lidos (fora da lista de entrada da etapa); as decisões
  foram aplicadas como os requisitos validados as citam.

## 2026-10-30 — rodada 5, Mode B (relatório `fspec-validation-20261030-1226.md`)

**O que mudou**

- ISSUE-01: `screens/SCR-0003` (`1.2.1`), seção "Comparação de tempos": o critério de fora desta feature é citado
  qualificado, `dirigibilidade/AC-US-0005-05`, junto de FB-01. Nenhum outro sítio citava o id.
- ISSUE-02: `api/API-0003` (`1.0.2`), linha `sectorLimits`: o setor 1 começa no início da volta, o sinal verde ou,
  nas voltas seguintes do treino, `lapStartMs`, como em `RULE-0003` e REQ-FEAT-0002-10.
- ISSUE-03: `features/FEAT-0010` (`1.0.1`): REQ-FEAT-0010-31 ficou só com a recarga ou o abandono sem resultado;
  a melhor volta válida não guardada além do treino passou a REQ-FEAT-0010-32. É a divisão de um requisito
  existente, sem comportamento novo; o critério de aceite que cobria o 31 passou a cobrir o 31 e o 32.
- ISSUE-04: uma só ordem de precedência das rejeições, declarada em `api/API-0002` (`1.2.1`, seção "Erros") e
  repetida em `rules/RULE-0005` (`1.1.1`, "Encerrar o treino"): `NO_ACTIVE_LAP`, `NOT_TRAINING`, `LAP_ENDED`,
  depois `ALREADY_PAUSED`, `NOT_PAUSED` ou `NOT_RUNNING`; em `startLap`, `LAP_ALREADY_ACTIVE`,
  `TRACK_DATA_UNREADABLE`, `TRACK_SCHEMA_UNSUPPORTED`, `OFFICIAL_NOT_AVAILABLE`. Os dois casos do relatório
  retornam `NOT_TRAINING`, o que concorda com a linha "qualquer fase" de `RULE-0005`. Nenhum código novo.
- ISSUE-05: `rules/RULE-0002` (`1.1.1`): o contador `sectorsCompletedCount`, que nenhum fluxo, contrato ou tela
  usa, deixou de ser definido; o contrato segue expondo `completedSectorMs`.
- `00-index.md` e `99-traceability.md` não foram escritos: o gate os gera com `lint_artifacts.py --emit`.

**Itens fechados**: ISSUE-01, ISSUE-02, ISSUE-03, ISSUE-04, ISSUE-05.

**Itens recusados, com motivo**: nenhum. Nenhum requisito, campo, código, operação ou elemento de tela novo foi
acrescentado (conventions §16); o id REQ-FEAT-0010-32 resulta só da divisão pedida em ISSUE-03.
