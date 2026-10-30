---
title: Registro de mudanças — validação de volta de corrida
feature: race-lap-validation
stage: dspec
status: validated
version: 1.2.1
sources: []
---

# Registro de mudanças

## 2026-10-20 — rodada 1, Mode A

**O que mudou**

- Conjunto gerado do zero a partir do F-Spec validado de `300 Specs/320 F-Specs/Output/race-lap-validation/`
  (FEAT-0001 a FEAT-0009, 129 requisitos `REQ-*`, API-0001 a API-0003, RULE-0001 a RULE-0006, FLOW-0001 a
  FLOW-0004, SCR-0001 a SCR-0003) e do código em execução na raiz do repositório (somente leitura, para
  posicionamento).
- Doze itens de projeto (`core/DES-0001` a `DES-0006` e `DES-0012`, `web/DES-0007` a `DES-0010`,
  `security/DES-0011`), dois modelos de dados (`DM-0001` arquivo de pista versão 2, `DM-0002` estado da volta em
  memória), cinco ADR, `01-architecture.md`, `test-strategy.md` (cobre os 72 critérios `AC-*` e os 12 NFR) e
  `98-divergences.md` com 12 linhas abertas.
- `00-index.md` e `99-traceability.md` não foram escritos: o gate os gera com `lint_artifacts.py --emit`.
- As pastas `backend/` e `mobile/` do esqueleto do estágio não existem porque o produto não tem servidor nem
  aplicativo nativo: a simulação e o dado de pista estão em `core/`, a apresentação em `web/`, privacidade e uso
  offline em `security/`.

**Decisões de projeto onde o F-Spec deixou lacuna deliberada** (todas em ADR, nenhuma muda requisito)

- Precedência de duas invalidações no mesmo passo: cruzamentos de linha antes do corte (ADR-0004, item 1).
- Destino do reposicionamento: ponto mais próximo da linha central, no sentido de percurso, velocidade 0
  (ADR-0004, item 2).
- O que se cronometra numa volta de treino em dado incompleto: cronômetro e corte valem; marcadores, setores e chegada
  não são avaliados e nenhuma volta chega a `VALID` (ADR-0004, item 3).
- Meio de continuar a volta: botão `#pause` rotulado "Continuar" e tecla Esc, ambos já existentes (ADR-0005).
- Método de arredondamento do instante interpolado: ADR-0001.

**Itens fechados**: nenhum `ISSUE-<nn>` ou `FB-<nn>` (primeira geração).

**Itens recusados, com motivo**

- Pausa manual por toque em `web-mobile`: acrescentaria um valor a `pauseCause` (API-0001, API-0002), superfície
  que o F-Spec não autoriza. Como consequência o botão `#pause` existente fica visível só durante a pausa. Proposta
  ao autor do F-Spec, se quiser a pausa manual: novo valor de `pauseCause`.
- Mover a linha central e a largura da pista para o arquivo de pista: ampliaria a mudança além do F-Spec e mexeria na
  física (ADR-0003, alternativas).
- Oferecer volta de reconhecimento ou oficial: pertence ao desafio diário (outra feature); `offeredLapKinds` recebe os
  tipos do desafio como parâmetro e hoje recebe lista vazia (DES-0005).
- Instrumento de desempenho dentro do jogo: seria superfície só de teste; o desempenho é medido com as ferramentas
  do navegador em teste registrado (DES-0007).
- Divergências com o sistema em execução: não foram recusadas; estão em `98-divergences.md`.
- Nenhum requisito foi enfraquecido, removido ou dividido.

**Migração de verificações existentes**: o teste `crossing the start alone cannot complete a lap`
(`tests/physics.test.ts:35`) e o uso de `LapTracker` por `scripts/keyboard-lap.ts` permanecem como estão
(`LapTracker` fica exportado só para o benchmark de manuseio); nenhuma verificação existente é removida (§17).

## 2026-10-20 — Rodada Mode B (relatório dspec-validation-20261020-1918)

Fechados:
- ISSUE-01: `TrackReading` em DES-0006 passa à forma plana de API-0003 com `trackDataStatus`; DES-0009 ajustado (`reading.trackDataStatus`, `trackId`/`trackVersion` lidos de `reading`). DM-0001 e DES-0001 já usavam `trackDataStatus`/nomes de estado e não mudaram.
- ISSUE-02: linha de 98-divergences.md ganha `src/main.ts:185` e `src/main.ts:276-281`.
- ISSUE-03: DES-0012 posicionado na camada Simulação; `tests/` tratado como lugar das verificações.
- ISSUE-04: DES-0011 fixado na camada Aplicação; a verificação de camada remete a DES-0012.

Recusados: nenhum.

## 2026-10-22 — rodada 3, Mode C (feedback de `pista-kart-park` e F-Spec revalidado)

**Entrada**

- Feedback `reports/feedbacks/pista-kart-park/feedback-20261022-1614.md`, item FB-01 (severidade `scope`), pendente
  por ser posterior ao relatório de validação `dspec-validation-20261020-1923.md` (2026-10-20T19:23:00Z). É o único
  feedback pendente, de qualquer origem, para esta feature nesta etapa.
- F-Spec desta feature revalidado em `fspec-validation-20261022-1624.md` (SUCCESS): `API-0001` 1.1.0, `API-0002` 1.1.0
  e `SCR-0003` 1.1.0 passaram a carregar os campos opcionais e aditivos `setupId` e `setupVersion` e a precondição
  de comparação de tempos (FB-01 de `dirigibilidade`, aceito lá). Este conjunto é alinhado a essa revisão na mesma
  rodada.
- Decisões do autor para esta rodada, carregadas como estão: FB-01 de `pista-kart-park` aceito, com a prova do
  NFR-0012 declarada sem literais de versão e o ajuste dos checks levado à etapa de testes; os dois campos de acerto
  entram no modelo de dados do resultado e nos itens que o consomem, a tela de resultado só compara tempos com
  `comparability` `COMPARABLE`, e a implementação dos campos é de `dirigibilidade` (divergência devida a ela);
  superfície congelada fora desses dois itens; código na raiz do repositório.

**Itens fechados**

- FB-01 de `pista-kart-park` (aceito): a prova do NFR-0012 deixa de afirmar literais de versão de esquema.
  - `core/DES-0006`: `TRACK_SCHEMA_VERSION` descrita como a maior versão que o leitor conhece (2 nesta feature,
    DM-0001), exportada para que toda prova se refira à constante; a linha de falha passa a "`schemaVersion` maior que
    `TRACK_SCHEMA_VERSION`"; as provas passam a: arquivo sintético com `schemaVersion` igual a `TRACK_SCHEMA_VERSION`
    e maior que a da forma anterior; `TRACK_SCHEMA_VERSION + 1` é `UNSUPPORTED_SCHEMA`, devolvido com essa versão, e
    o objeto de entrada fica intacto; nenhuma verificação afirma literal de versão.
  - `test-strategy.md`: fixture de versão posterior derivada da constante exportada por `src/trackData.ts`; linha do
    NFR-0012 reescrita nos mesmos termos.
  - Mesmo fato carregado aos seus outros sítios, sem mudar a regra: `data/DM-0001` (ordem 3 da classificação) e
    `adr/ADR-0003` (decisão, item 3) passam a dizer "maior que a versão que o leitor conhece (`TRACK_SCHEMA_VERSION`,
    2 neste esquema)".
- Alinhamento ao F-Spec 1.1.0 (FB-01 de `dirigibilidade`, já aceito no F-Spec):
  - `data/DM-0002`: `setupId` e `setupVersion` opcionais na `LapSession` e no `LapResult`, copiados do pedido sem
    interpretação; padrões de leitura aplicados pelo leitor de registros de `dirigibilidade`, nunca pela simulação;
    INV-4 os inclui; janela de compatibilidade e privacidade atualizadas; o replay e o texto compartilhado copiam do
    resultado e não são descritos aqui.
  - `core/DES-0001`: pedido de `startLap` com `setupId?` e `setupVersion?`; `getLapResult` os devolve quando presentes;
    nenhuma verificação, regra ou rejeição com eles; `src/lap.ts` não importa `src/setupRecords.ts`.
  - `web/DES-0009`: a oferta informa os dois campos a partir do acerto corrente (`getSetupVersion`,
    `src/setupRecords.ts`; hoje `setupRef`, `src/main.ts:160`); toda volta iniciada a partir desta mudança os informa.
  - `web/DES-0010`: seção "Comparação de tempos": comparação exibida só com `compareLapRecords` em `COMPARABLE`;
    nada com os demais valores; `INCOMPLETE_RECORD` só registra o código; a decisão nunca é da renderização;
    posicionamento no código atual (`src/main.ts:217-223`, `:421-435`).
  - `security/DES-0011`: os dois campos na tabela de dados tratados (identificadores, sem dado pessoal).
  - `01-architecture.md`: contexto primário (os campos identificam o acerto e nunca são chave de regra) e sentido de
    dependência de `src/setupRecords.ts` (importa `src/lap.ts`; chamado por `src/main.ts`; nenhum módulo desta
    feature o importa).
  - `98-divergences.md`: nova linha, devida ao código da feature `dirigibilidade`, com o que `src/lap.ts`,
    `src/setupRecords.ts` e `src/main.ts` fazem hoje em `arquivo:linha`.

**Item devido à etapa de testes desta feature** (registrado, não alterado por este estágio)

- CHK-TEST-0009-02 e CHK-TEST-0009-03 (`tests/race-lap-validation-track-data.test.ts:20-21` e `:24-30`) afirmam os
  literais 2 e 3; pela prova agora declarada em DES-0006 e na estratégia, passam a: `SYNTHETIC_TRACK_FILE.schemaVersion`
  igual a `TRACK_SCHEMA_VERSION` e maior que a `schemaVersion` da fixture da forma anterior; arquivo derivado com
  `TRACK_SCHEMA_VERSION + 1` lido como `UNSUPPORTED_SCHEMA` com essa versão e intacto. Sem literal de versão.

**Divergência devida a `dirigibilidade`**

- A linha nova de `98-divergences.md` é devida ao código daquela feature (decisão do autor). O D-Spec validado de
  `dirigibilidade` (DES-0003) afirma hoje que o `LapResult` desta feature "fica intacto" e anexa o acerto por
  `buildLapRecord`; para realizar API-0001/API-0002 1.1.0 ele precisa acompanhar. O feedback entre features de uma
  etapa de especificação é escrito pelo validador no relatório (conventions §14); este gerador o aponta aqui e na
  linha do registro, e não escreve na pasta daquela feature.

**Versões** (todas em `status: draft` até a validação)

- `core/DES-0006` 1.0.0 → 1.1.0; `test-strategy.md` 1.0.0 → 1.1.0; `data/DM-0001` 1.0.0 → 1.0.1; `adr/ADR-0003`
  1.0.0 → 1.0.1; `data/DM-0002` 1.0.0 → 1.1.0; `core/DES-0001` 1.0.0 → 1.1.0; `web/DES-0009` 1.0.0 → 1.1.0;
  `web/DES-0010` 1.0.0 → 1.1.0; `security/DES-0011` 1.0.0 → 1.1.0; `01-architecture.md` 1.0.0 → 1.1.0;
  `98-divergences.md` 1.0.0 → 1.1.0; este registro 1.0.0 → 1.1.0.
- `00-index.md` e `99-traceability.md` não foram escritos: o gate os regenera com `lint_artifacts.py --emit`.

**Itens recusados ou limitados, com motivo**

- FB-01 de `pista-kart-park`, alternativa de subir `TRACK_SCHEMA_VERSION` para 3 neste conjunto: recusada. O esquema 3
  é da feature `pista-kart-park` e do seu F-Spec; este conjunto descreve a versão 2 (DM-0001, ADR-0003) e só torna a
  sua prova independente do literal, que era o que o feedback pedia.
- Alterar os checks CHK-TEST-0009-02/03 ou `tests/race-lap-validation-track-data.test.ts` neste estágio: recusado; a
  etapa de testes é a dona (decisão do autor; o D-Spec não escreve em `tests/`).
- Contratos de replay e de texto compartilhado neste conjunto: não criados. O F-Spec desta feature não os tem (os
  registros são de `dirigibilidade`, `src/setupRecords.ts` e `src/handlingMessages.ts`); o resultado é a fonte da
  qual copiam, e isso está dito em DM-0002 e DES-0010.
- Rejeição nova em `startLap` para `setupId` fora do enum ou `setupVersion` vazia: não acrescentada; API-0002 1.1.0 não
  tem rejeição nova e manda copiar sem interpretação; a resolução é do leitor do dado publicado (`UNKNOWN_SETUP`,
  `resolveSetupRef`, `dirigibilidade`).
- Padrões de leitura (`ARCADE_ASSISTIDO`, `previousSetupVersion`) aplicados por `getLapResult`: não; API-0001 diz
  "copiado sem interpretação" e aplicar o padrão exigiria que `src/lap.ts` lesse o dado publicado de
  `dirigibilidade`, invertendo o sentido de dependência já existente (`src/setupRecords.ts` importa `src/lap.ts`).
- `getLapState` com os dois campos: não; API-0001 1.1.0 os põe só em `getLapResult`, e o HUD (SCR-0001) não exibe nem
  compara acerto.
- Elemento de tela para exibir `setupVersion` no resultado: não projetado; SCR-0003 não o pede. O `#lap-result-setup`
  e o `#lap-share` existentes no painel são superfície de `dirigibilidade`, e DES-0010 só o registra como
  posicionamento.
- Re-julgar as doze linhas da rodada 1 de `98-divergences.md` (marcá-las resolvidas pelo commit `c41c6c3`): não
  feito nesta rodada; está fora do feedback e do alinhamento ao F-Spec, e a resolução é registrada pela etapa
  devedora. O preâmbulo do registro data a árvore que cada grupo de linhas cita.
- Renomear na estratégia os arquivos de teste para os nomes em uso (`tests/race-lap-validation-<área>.test.ts`): não
  feito; a correspondência entre os nomes curtos da estratégia e os arquivos é da etapa de testes, e nenhum item do
  feedback a pede.
- Escrever feedback para `dirigibilidade` (DES-0003 dela): não escrito por este gerador; é do validador desta etapa
  (conventions §14), com o achado apontado acima.
- `sources:` dos arquivos alterados inalterado: FB-01 (de qualquer origem) não é id do upstream desta feature (gate
  G6); a fonte é citada no corpo de cada trecho acrescentado.
- Nenhum requisito foi enfraquecido, removido ou dividido; nenhuma verificação existente é removida (§17).

## 2026-10-22 — rodada 4, Mode B (relatório dspec-validation-20261022-1703)

**Entrada**

- Relatório FAIL com 1 `error` (ISSUE-01), 1 `warning` (ISSUE-02), 1 `info` (ISSUE-03), 1 `scope` (SCOPE-01) e
  DIV-01. Nenhum feedback novo pendente para esta feature nesta etapa.
- Decisões do autor, as mesmas da rodada 3, carregadas como estão: FB-01 de `pista-kart-park` aceito e a prova do
  NFR-0012 sem literais de versão (ajuste dos checks devido à etapa de testes); `setupId` e `setupVersion` no modelo
  do resultado e nos itens que o consomem; comparação só com `COMPARABLE`; implementação dos campos devida a
  `dirigibilidade`; superfície congelada fora desses dois itens; código na raiz do repositório.
- A primeira execução desta rodada (CSV de fases, 17:11Z) reescreveu `web/DES-0009` para 1.1.1 e foi interrompida
  antes de registrar; esta execução conferiu esse texto contra a árvore e completou os demais itens.

**Itens fechados**

- ISSUE-01 (`error`, D7): `web/DES-0009` 1.1.0 → 1.1.1 — a fonte de `setupId` e `setupVersion` da oferta é o
  `PublishedSetup` corrente que a aplicação já guarda (`setup`, `src/main.ts:122`, um dos objetos de
  `PUBLISHED_SETUPS`, `src/physics.ts`, trocado só por `#handling-preset` entre voltas, `src/main.ts:248-253`; o
  par `setupRef`, `src/main.ts:160` e `:228`), e não uma chamada a `getSetupVersion`. "Comportamento em falha"
  declara que `UNKNOWN_SETUP` não ocorre neste caminho e que nenhuma rejeição, aviso ou bloqueio é acrescentado
  pelos campos (`startLap` copia sem interpretação, API-0002; o caminho solo não depende deles, I4).
  "Colaboradores" registra que `src/setupRecords.ts` não é chamado para iniciar a volta. Mesmo fato carregado ao seu
  outro sítio, `01-architecture.md` 1.1.0 → 1.1.1 (sentido das dependências: `src/main.ts` chama
  `src/setupRecords.ts` para `compareLapRecords`; a oferta lê o `PublishedSetup` sem `getSetupVersion`). A linha da
  rodada 3 deste registro que citava `getSetupVersion` fica como história; vale o texto desta rodada.
- ISSUE-02 (`warning`, D8): `test-strategy.md` 1.1.0 → 1.1.1 — E2E-02 ganha o passo "comparação de tempos": volta
  válida concluída no acerto corrente; troca de acerto no seletor existente `#handling-preset`; outra volta válida
  sem comparação alguma com o tempo do outro acerto; segunda volta válida no mesmo acerto com a comparação exibida;
  decisão em `compareLapRecords`. `web/DES-0010` 1.1.0 → 1.1.1 cita esse passo em "Determinismo" e declara que
  `SETUP_VERSION_DIFFERS` e `TRACK_DIFFERS` não são alcançáveis pela tela desta feature e ficam provados nos testes
  de `compareLapRecords` de `dirigibilidade`.
- ISSUE-03 (`info`, D2): correspondência de nomes declarada nos dois sítios que a definem, sem renomear citações:
  `test-strategy.md` (preâmbulo da tabela de critérios) e `core/DES-0012` 1.0.0 → 1.0.1 (abaixo da tabela de
  verificações) dizem que `tests/lap-<área>.test.ts`, `tests/track-data.test.ts` e os nomes curtos designam
  `tests/race-lap-validation-<área>.test.ts`, convenção `tests/<feature>-<área>.test.ts` da etapa de testes.

**SCOPE-01 e DIV-01** (não entram no veredito)

- SCOPE-01: o feedback a `dirigibilidade` foi escrito pelo validador desta etapa
  (`300 Specs/330 D-Specs/Output/dirigibilidade/reports/feedbacks/race-lap-validation/feedback-20261022-1703.md`);
  nada muda neste conjunto, e a linha de 2026-10-22 de `98-divergences.md` continua devida ao código daquela
  feature (decisão do autor). A decisão é dela, na sua próxima rodada desta etapa.
- DIV-01: continua `open`; etapa devedora: código de `dirigibilidade`. As doze linhas da rodada 1 não foram
  rejulgadas (ver rodada 3).

**Item devido à etapa de testes desta feature** (inalterado): CHK-TEST-0009-02 e CHK-TEST-0009-03 sem literal de
versão de esquema, como registrado na rodada 3.

**Versões** (todas em `status: draft` até a validação)

- `web/DES-0009` 1.1.1 (desta rodada); `web/DES-0010` 1.1.0 → 1.1.1; `test-strategy.md` 1.1.0 → 1.1.1;
  `01-architecture.md` 1.1.0 → 1.1.1; `core/DES-0012` 1.0.0 → 1.0.1 (de `validated` para `draft`); este registro
  1.1.0 → 1.1.1. Nenhum outro arquivo tocado.
- `00-index.md` e `99-traceability.md` não foram escritos: o gate os regenera com `lint_artifacts.py --emit`.

**Itens recusados ou limitados, com motivo**

- Chamar `getSetupVersion` na oferta e tratar `UNKNOWN_SETUP` (iniciar sem os campos com `console.warn`): não
  adotado. Das duas saídas que o relatório admite, a escolhida lê o objeto publicado que a aplicação já guarda
  (`src/main.ts:122`, `:160`), sem ramo de falha novo e sem dependência da aplicação em `src/setupRecords.ts` nesse
  caminho; a outra criaria um ramo que, por construção, nunca executa.
- Renomear as citações `tests/lap-*.test.ts` e `tests/track-data.test.ts` em DES-0001, DES-0006, DES-0009,
  DES-0010 e DES-0011 para os nomes em uso: não feito; a correspondência está declarada na estratégia e em
  DES-0012 (alternativa aceita pelo relatório) e cada item segue citando o nome do projeto. A propriedade dos nomes
  dos arquivos continua da etapa de testes (rodada 3).
- Passo de E2E para `SETUP_VERSION_DIFFERS` e `TRACK_DIFFERS`: não acrescentado; não há caminho pela tela desta
  feature (uma única pista empacotada; `#handling-preset` só oferece versões publicadas, `src/main.ts:246-247`) e
  criar um seria superfície só de teste (política 10). A prova fica no ponto de decisão, em `dirigibilidade`.
- Escrever ou alterar o feedback a `dirigibilidade` (SCOPE-01): não é deste gerador (conventions §14); o validador
  já o escreveu.
- Rejulgar DIV-01 ou as linhas da rodada 1 de `98-divergences.md`: não; fora dos itens do relatório, e a resolução é
  registrada pela etapa devedora.
- Nenhum módulo, tabela, campo, endpoint, elemento de tela ou componente acrescentado (§16); nenhum requisito
  enfraquecido, removido ou dividido; nenhuma verificação existente é removida (§17).

## 2026-10-27 — rodada 5, Mode C (feedback de `modelo-kart-01` e relatório de testes `test-validation-20261027-1704`)

**Entrada**

- Feedback `reports/feedbacks/modelo-kart-01/feedback-20261022-1840.md`, item FB-01 (severidade `scope`, D3 da origem),
  pendente por ser posterior ao relatório de validação mais novo desta etapa, `dspec-validation-20261022-1754.md`
  (2026-10-22T17:54:09Z). É o único feedback pendente, de qualquer origem, para esta feature nesta etapa (o de
  `pista-kart-park`, 2026-10-22T16:14Z, é história: aplicado na rodada 3).
- Relatório da etapa de testes desta feature,
  `500 Tests/Output/race-lap-validation/reports/test-validation/test-validation-20261027-1704.md` (SUCCESS, 172/172,
  140 checks), itens ISSUE-04 e ISSUE-05 (`info`, T2): duas linhas de `test-strategy.md` 1.1.1 desatualizadas em relação
  à suíte validada.
- Decisões do autor para esta rodada, carregadas como estão: FB-01 recusado (o kart congela depois de `ENDED`, como hoje;
  INV-1 de `data/DM-0002` fica como está); as duas linhas da estratégia passam a descrever o que a suíte validada faz,
  sem mudar critério nem limiar; nada mais muda (API-0001 e API-0002 1.1.0 inalteradas, `setupId`/`setupVersion` já
  presentes; esquema de pista inalterado); nenhum feedback a outra feature nesta rodada salvo contradição real.

**Itens fechados**

- ISSUE-04 do relatório de testes (AC-US-0004-06): `test-strategy.md` 1.1.1 → 1.1.2 — a linha do critério deixa de
  descrever a excursão lateral de 10,5 m em torno do marcador 2 e passa a descrever CHK-TEST-0005-11
  (`tests/race-lap-validation-validity.test.ts`): `seedLap` salta o kart para 3 índices de arco depois do ponto de
  cruzamento do marcador 2 com `markersPassedCount` 1 e `autopilot()` pilota até a chegada; `ENDED`, `INVALID`,
  `MISSED_MARKER`. A linha registra por que a excursão dirigida não é alcançável na pista publicada (alcance do marcador
  9 m maior que borda 5,5 m + limite 3 m; retorno pela grama acima de 1000 ms — medição da etapa de testes, rodada 1 do
  registro dela). Critério e limiar inalterados.
- ISSUE-05 do relatório de testes (AC-US-0006-03): mesma versão — a linha deixa de descrever "2 m além da borda por
  600 passos" e passa a descrever CHK-TEST-0006-03 e CHK-TEST-0006-04 (`tests/race-lap-validation-cut.test.ts`):
  `autopilot(-7)` (1,5 m além da borda) por 600 passos com o laço do teste medindo a distância além da borda a partir do
  passo 240 (máximo menor ou igual a 3 m, mais de 200 passos na grama; `VALID`, `RUNNING`), e kart parado por `seedLap`
  a exatamente 2 m além da borda por 600 passos com `IDLE` (`VALID`, `elapsedMs === toMs(600)`). O limiar de 3 m e
  1000 ms não muda.
- Mesmo fato carregado aos seus outros sítios em `test-strategy.md`, sem mudar regra: na tabela de fixtures, a coluna de
  uso de `autopilot` (escapada a 1,5 m além da borda; resto da volta depois do salto semeado), a de `seedLap` (marcador
  pulado na pista publicada; kart parado 2 m além da borda) e a do oráculo de corte (distância máxima além da borda e
  contagem de passos na grama). A linha de AC-US-0006-08 continua a remeter à escapada de AC-US-0006-03, que é a de
  CHK-TEST-0006-08 (mesmo `autopilot(-7)` por 600 passos).

**Versões** (todas em `status: draft` até a validação)

- `test-strategy.md` 1.1.1 → 1.1.2; este registro 1.1.1 → 1.1.2. Nenhum outro arquivo tocado.
- `00-index.md` e `99-traceability.md` não foram escritos: o gate os regenera com `lint_artifacts.py --emit`.

**Itens recusados ou limitados, com motivo**

- FB-01 de `modelo-kart-01` ("kart pilotável depois de `ENDED`"): recusado. O dono do produto decidiu em 2026-10-22 que
  o kart congela depois de `ENDED`, como o sistema faz hoje (`stepLap` devolve a sessão sem avançar fora de `RUNNING`,
  `src/lap.ts:180`; o laço de quadros só avança a volta em `COUNTDOWN` e `RUNNING`, `src/main.ts:403`): INV-1 e INV-3
  de `data/DM-0002` ficam como estão, e nenhum `REQ-*` desta feature nem de `modelo-kart-01` exige passos aceitos em
  `ENDED`. A frase "o kart continua pilotável" do F-Spec de `modelo-kart-01` foi erro de redação, já corrigido no
  seed/`DOMAIN.md` daquela feature e no seu F-Spec e D-Spec revalidados (commit `6f75122`: "kart congela após a volta;
  decisão só da câmera"); a contradição que o feedback aponta não existe mais, e a decisão da câmera é função só da
  pose, válida com o kart parado. Nenhum arquivo deste conjunto muda por causa dele; nenhuma entrada em
  `SCOPE-BACKLOG.md` desta feature, porque a correção já foi feita na origem.
- Feedback a `modelo-kart-01`, `dirigibilidade` ou `pista-kart-park` nesta rodada: não escrito. Decisão do autor
  ("salvo contradição real") e nenhuma contradição real encontrada: o F-Spec e o D-Spec revalidados de `modelo-kart-01`
  já dizem o que INV-1 diz.
- Alterar API-0001/API-0002 (`setupId`/`setupVersion` já em 1.1.0) ou o esquema de pista (DM-0001, ADR-0003; a versão 3
  é de `pista-kart-park`): não; decisão do autor, e nenhum item desta rodada os toca.
- Alterar `data/DM-0002`, `core/DES-0001` ou `web/DES-0007` por causa de FB-01: não; a regra que o feedback questiona
  é a que fica.
- Mudar critério ou limiar de AC-US-0004-06 (marcador pulado → `MISSED_MARKER`) ou de AC-US-0006-03 (3 m e 1000 ms):
  não; só a descrição do caminho de prova muda, para o que a suíte validada faz.
- Propor fixture nova que pule um marcador por pilotagem na pista publicada (excursão lateral de outra amplitude ou
  janela): não; a etapa de testes mediu janelas de 1 a 12 índices e amplitudes de 9,5 a 12 m sem alcançar o caso sem
  corte, e o estado semeado é recurso já previsto na estratégia (tabela de fixtures, `seedLap`; preâmbulo), não
  superfície só de teste (política 10).
- ISSUE-10 do relatório de testes (voltas da suíte com `ARCADE_KART` e sem os campos de acerto; fixture nova no acerto
  publicado como padrão "a entrar pela estratégia ou por `SCOPE-BACKLOG.md`"): não acrescentada nesta rodada; fora das
  decisões do autor, e o relatório mesmo diz "nenhuma ação nesta rodada". Fica para o autor, numa rodada que a autorize.
- Os demais itens do relatório de testes (ISSUE-01 a ISSUE-03, ISSUE-06 a ISSUE-09, ISSUE-11, ISSUE-12 e as 27
  divergências): não dirigidos a este estágio; permanecem com a etapa de testes e com as etapas devedoras.
- Rejulgar DIV-01 ou as linhas de `98-divergences.md`: não; fora dos itens desta rodada, e a resolução é registrada
  pela etapa devedora.
- Nenhum requisito enfraquecido, removido ou dividido; nenhuma verificação existente é removida (§17); nenhum módulo,
  tabela, campo, endpoint, elemento de tela ou componente acrescentado.

## 2026-10-30 — rodada 6, Mode C (F-Spec revalidado: voltas seguidas no treino)

**Entrada**

- F-Spec de `300 Specs/320 F-Specs/Output/race-lap-validation/` revalidado contra o seed `revision: 3`, relatório
  `reports/fspec-validation/fspec-validation-20261030-1227.md` (SUCCESS, 2 avisos), rodadas 4 e 5 do changelog do
  F-Spec: novos FEAT-0010 (REQ-FEAT-0010-01 a -32) e FLOW-0005; RULE-0002 1.1.1, RULE-0003 1.1.0, RULE-0005 1.1.1;
  API-0001 1.2.0 (`listLapResults`, `lapSequenceCount`, `lapStartMs`, `bestValidLapMs`, `trainingLapMs`,
  `trainingSectorMs`, `PAUSE_BUTTON`), API-0002 1.2.1 (`endTraining`, `NOT_TRAINING`, ordem de precedência das
  rejeições), API-0003 1.0.2 (o setor 1 começa no início da volta, `lapStartMs` nas voltas seguintes do treino); "—"
  para setor sem tempo; melhor volta válida do treino. Mudaram também, no texto, REQ-FEAT-0001-01, REQ-FEAT-0002-07,
  -08, -10, -12, -14, REQ-FEAT-0004-13, REQ-FEAT-0005-06, -11, REQ-FEAT-0006-04 a -06, -12, REQ-FEAT-0007-01, -14 e
  REQ-FEAT-0009-10.
- Os dois avisos do relatório do F-Spec (ISSUE-01: observável de REQ-FEAT-0010-32; ISSUE-02: observável de
  REQ-FEAT-0009-11), endereçados na estratégia de testes deste conjunto a pedido do chamador.
- Código em execução lido só para posicionamento: `src/lap.ts`, `src/main.ts`, `src/lapMessages.ts`,
  `src/trainingSession.ts` (de `pista-kart-park`), `src/trackData.ts`, `index.html`, `src/style.css`.

**O que mudou**

- `data/DM-0002` 1.1.0 → 1.2.0: a sessão do treino é uma sequência de voltas; campos `lapSequenceCount`, `lapStartMs`
  e `results` (lista, no lugar do `result` único); `pauseCause` com `PAUSE_BUTTON`; `sectorBoundsMs` com posições
  `null` para limite saltado; `lines` de uma leitura `INCOMPLETE` que declara chegada e sentido; valores derivados
  (`elapsedMs` desde `lapStartMs`, `completedSectorMs`, `bestValidLapMs` derivado de `results`); campos de treino no
  resultado; invariantes INV-1, INV-3, INV-7 e INV-9 ajustados e INV-10 (soma dos tempos do treino) e INV-11
  (`lapSequenceCount` sem lacuna) novos; janela de compatibilidade da rodada; retenção sem guardar a melhor volta
  válida.
- `core/DES-0001` 1.1.0 → 1.2.0: `pauseLap` com `PAUSE_BUTTON` e `NOT_TRAINING`; novas `endTraining` e
  `listLapResults`; ordem de precedência das rejeições de API-0002; `getLapResult` devolve o último resultado também
  com o treino em `RUNNING`; contagem só numa sessão nova; deduplicação do cruzamento por passo; recarga sem
  resultado.
- `core/DES-0002` 1.0.0 → 1.1.0: fronteira `b0 = lapStartMs`; tempo de setor só com as duas fronteiras; tempo total
  `b4 - b0`; um único inteiro como fim de uma volta e início da seguinte; soma dos tempos do treino; `elapsedMs`
  desde `lapStartMs`.
- `core/DES-0003` 1.0.0 → 1.1.0: limite de setor registrado depois do limite registrado mais alto
  (REQ-FEAT-0002-14); chegada no treino por `closeTrainingLap` (resultado e volta seguinte no mesmo instante, motivo
  `CUT` mantido, kart sem parar); contramão no treino; linhas avaliadas numa leitura `INCOMPLETE`; precedência do corte
  no treino.
- `core/DES-0004` 1.0.0 → 1.1.0: efeito do corte por tipo de volta (no treino, `INVALID` sem encerrar, novo corte sem
  efeito); `offTrackSteps` não recomeça no início de uma volta do treino.
- `core/DES-0005` 1.0.0 → 1.1.0: reposicionamento no treino sem invalidar nem revalidar; campos de treino em
  `buildResult`; `sectorMs` só com as três fronteiras; kart parado e nenhuma volta seguinte depois do encerramento de
  uma volta oficial e de reconhecimento.
- `core/DES-0012` 1.0.1 → 1.1.0: `tests/lap-training.test.ts` (nome em uso: `tests/race-lap-validation-training.test.ts`)
  na tabela de verificações; o teste de camada procura também `document.cookie` e verifica `src/lapMessages.ts`.
- `web/DES-0007` 1.0.0 → 1.1.0: tabela da rodada com os trechos do código em execução: `emitEndTraining`, botão de
  pausa no treino, botão `#lap-end-training`, gancho de resultado por crescimento de `listLapResults` (registro de
  `dirigibilidade` uma vez por resultado), tela de resultado só para volta oficial e de reconhecimento.
- `web/DES-0008` 1.0.0 → 1.1.0: chaves `pauseAction`, `endTrainingAction`, `bestValidLap`, `sectorNoTime` (24 chaves);
  `formatSectorTime` e `describeTrainingResult`; elementos `#lap-best-valid` e `#lap-training-result`; rótulo de
  `startTraining` passa a "treino"/"training".
- `web/DES-0009` 1.1.1 → 1.2.0: volta à oferta no encerramento do treino, sem passar pela tela de resultado.
- `web/DES-0010` 1.1.1 → 1.2.0: tela de resultado só para volta oficial e de reconhecimento; melhor registro de
  `dirigibilidade` atualizado a cada resultado novo; trechos de código atualizados (`src/main.ts:289-295`, `:524-538`,
  `:320-332`).
- `security/DES-0011` 1.1.0 → 1.2.0: dados do treino na tabela de dados; a melhor volta válida derivada, nunca
  guardada (REQ-FEAT-0010-31, -32).
- `adr/ADR-0004` 1.0.0 → 1.1.0: item 3 passa a seguir o F-Spec (linhas declaradas de uma leitura `INCOMPLETE`); item 1
  com a precedência no treino; novos itens 5 a 9 (duração do painel do resultado do treino, volta `VALID` em leitura
  `INCOMPLETE` sem uma fronteira, kart depois do reconhecimento, nenhum atalho de teclado, saída de pista que atravessa
  a chegada no treino).
- `adr/ADR-0005` 1.0.0 → 1.1.0: botão de pausa no treino pelo mesmo `#pause`; botão de encerrar o treino.
- Novo `adr/ADR-0006` 1.0.0: o treino como sequência de voltas numa única sessão.
- `01-architecture.md` 1.1.1 → 1.2.0: `src/lap.ts` com o treino; sequência alterada com o ramo do treino; eventos
  `PAUSE_BUTTON` e `endTraining`; ADR-0006.
- `test-strategy.md` 1.1.2 → 1.2.0: FEAT-0010 por nível; fixtures `withoutSectors()` e oráculo de chegada; usos novos de
  `autopilot` e `seedLap`; E2E-12 (treino, nos dois canais) e E2E-13 (pista sem setores); E2E-02 e E2E-08 ajustados;
  linhas AC-US-0010-01 a -27; seção "Requisitos sem critério próprio" com o observável de REQ-FEAT-0010-28 a -32 e de
  REQ-FEAT-0009-11; cobertura de REQ-FEAT-0009-10 com as voltas seguidas.
- `98-divergences.md` 1.1.0 → 1.2.0: seis linhas novas, `open`, devidas pelo código (treino de voltas seguidas;
  botão de pausa e encerrar treino; tela do treino; registro de limite depois de limite saltado; linhas de leitura
  `INCOMPLETE`; `listLapResults` e gancho de resultado); REQ-FEAT-0010-21, -22, -31 e -32 registrados como satisfeitos
  hoje.
- Todos os arquivos alterados em `status: draft`. `00-index.md` e `99-traceability.md` não foram escritos: o gate os
  regenera com `lint_artifacts.py --emit`. Inalterados: `data/DM-0001`, `core/DES-0006`, `adr/ADR-0001` a `ADR-0003`
  (a mudança de API-0003 é só a redação do início do setor 1, realizada por DES-0002 e DES-0003).

**Migração de itens existentes** (nenhum id removido; todos os itens seguem com o seu id)

| Item | Mudança | Motivo |
|---|---|---|
| DM-0002, campo `result` | substituído por `results` (lista); `getLapResult` lê o último item | FEAT-0010: 1 resultado por volta concluída no treino; API-0001 `listLapResults` |
| DM-0002, `sectorBoundsMs` | posições podem ser `null` | REQ-FEAT-0002-14 e REQ-FEAT-0010-23 |
| DM-0002, INV-1 | dividido por tipo de volta; no treino, `results.length = lapSequenceCount - 1` | RULE-0002 1.1.1 |
| ADR-0004, item 3 | de "nenhuma linha avaliada em `INCOMPLETE`" para "linhas declaradas avaliadas quando há chegada e sentido" | `DOMAIN/DEC-13`, REQ-FEAT-0010-27 |
| test-strategy, AC-US-0001-01, -0002-10, -0002-12, -0004-07, -0006-06, -0007-06, -0008-05, -0009-01 | caminho estendido ao treino ou restrito à volta oficial e de reconhecimento | requisitos reescritos no F-Spec (rodada 4 dele) |
| test-strategy, E2E-02, E2E-08 | comparação de tempos em treinos; verificação do armazenamento do navegador | treino de voltas seguidas; aviso ISSUE-02 do F-Spec |

**Itens fechados**: nenhum `ISSUE-<nn>` ou `FB-<nn>` deste conjunto (não há relatório de validação nem feedback
novo; a entrada é o upstream revalidado). Os avisos ISSUE-01 e ISSUE-02 do relatório do F-Spec têm o seu observável
em `test-strategy.md`, seção "Requisitos sem critério próprio".

**Itens recusados ou não decididos, com motivo**

- Feedback a `pista-kart-park`: não escrito por este gerador. O treino de voltas seguidas muda o que acontece numa
  volta `TRAINING` na Kart Park: REQ-FEAT-0003-14 de `pista-kart-park` pede a "tela de resultado" ao fim de uma volta
  válida, e a linha de RULE-0003 dela diz que "uma volta já `ENDED` já teve o seu resultado exibido pela tela de
  resultado"; no treino o resultado passa ao painel de SCR-0001 e a volta não vai a `ENDED`. A verificação
  CHK-TEST-0005-08 (`tests/pista-kart-park-lap.test.ts`) e o piloto `tests/helpers/kartParkPilot.ts` esperam que a
  volta `TRAINING` termine na chegada. Pelas conventions §14, o feedback entre features de uma etapa de especificação é
  escrito pelo validador, no relatório; fica registrado aqui para ele e para o autor.
- Feedback a `dirigibilidade`: não escrito, pelo mesmo motivo. O D-Spec dela descreve o registro do resultado ao
  chegar a `ENDED`; este conjunto o move para "a cada resultado novo" (DES-0007, DES-0010), preservando o
  comportamento em volta oficial e de reconhecimento e estendendo-o a cada volta do treino.
- Unificar o "Melhor" existente (`#best`, melhor registro comparável de `dirigibilidade`, na memória da página) com a
  melhor volta válida do treino: não feito. Mudaria um elemento e uma regra de outra feature; os dois coexistem, e
  DES-0011 registra que `#best` não é a melhor volta válida do treino. Proposta ao autor para `SCOPE-BACKLOG.md`:
  "decidir se o 'Melhor' do HUD passa a ser a melhor volta válida do treino em andamento (FEAT-0010) ou se os dois
  ficam, e com que rótulos".
- Duração da exibição do resultado de cada volta do treino, atalho de teclado para pausar e encerrar o treino,
  movimento do kart depois de uma volta de reconhecimento, `sectorMs` de uma volta válida em leitura `INCOMPLETE` sem
  uma fronteira e saída de pista que atravessa a chegada: lacunas do F-Spec decididas no projeto (ADR-0004, itens 5
  a 9), sem superfície além da que o F-Spec pede.
- Botão de pausa e pausa manual por toque fora do treino: não projetados (ADR-0004, item 4; o F-Spec os limita ao
  treino).
- O que se cronometra numa pista sem linha de chegada: não decidido pelo F-Spec; o projeto mantém o tempo de passos
  desde o início da volta, sem resultado (ADR-0004, item 3).
- Persistência da melhor volta válida e dos resultados do treino entre sessões: fora do escopo (etapa 5).
- Rótulo `startTraining` mudado de "volta de treino" para "treino": é chave de apoio deste projeto (asterisco em
  DES-0008), não de RULE-0006; o F-Spec chama a opção de "treino" em SCR-0002.
- ISSUE-10 do relatório de testes de 2026-10-27 (fixture no acerto publicado como padrão): continua fora desta
  rodada; nenhuma decisão do autor a autoriza.
- `98-divergences.md`: as linhas existentes não são rejulgadas; só as novas desta rodada.
- Nenhum requisito enfraquecido, removido ou dividido; nenhuma verificação existente é removida (§17): os caminhos de
  teste alterados estão na tabela de migração.

## 2026-10-30 — rodada 7, Mode B (relatório `dspec-validation-20261030-1256.md`)

**O que mudou**

- ISSUE-02: `test-strategy.md` 1.2.0 → 1.2.1, linha NFR-0007: a prova bilíngue cobre as 24 chaves de DES-0008 1.1.0,
  inclusive `pauseAction`, `endTrainingAction`, `bestValidLap` e `sectorNoTime`. Era o único sítio com a contagem 20.
- ISSUE-01: `core/DES-0006` 1.1.0 → 1.1.1: os usuários de `LapTracker` na árvore são `tests/physics.test.ts`,
  `tests/race-lap-validation-frozen.test.ts` e `tests/race-lap-validation-layering.test.ts`; a citação de
  `scripts/keyboard-lap.ts` sai. A regra (exportado, inalterado, fora do jogo) não muda.
- ISSUE-03: `core/DES-0004` 1.1.0 → 1.1.1: a distância além da borda é a do ambiente da sessão
  (`trackEdgeDistanceM(session.environment, ponto)`, `src/physics.ts:185-187`, chamada em `src/lap.ts:263-270`), com
  `edgeDistanceM` como o caso da pista sintética; colaboradores e determinismo carregados.
- ISSUE-04: `core/DES-0005` 1.1.0 → 1.1.1: o destino do reposicionamento é a linha central do ambiente da sessão
  (`nearestOnTrack`, `src/lap.ts:174-182`; `nearestOnCenterline` de `src/trackGeometry.ts` com a geometria do
  arquivo), com a linha central sintética como caso sem geometria; colaboradores carregados.
- ISSUE-05: `web/DES-0009` 1.2.0 → 1.2.1: o início nomeia `beginLap` (`src/main.ts:296-297`) → `startTrainingLap`
  (`src/trainingSession.ts:81-87`) → `startLap` com `TRAINING`; citações atualizadas (`setup` em `src/main.ts:131`,
  `setupRef` em `:165` e `:299`, seletor em `:320-331`).
- ISSUE-06: `web/DES-0010` 1.2.0 → 1.2.1 e `test-strategy.md` (E2E-02): a frase "uma única pista empacotada" sai; o
  ramo `TRACK_DIFFERS` é alcançado em E2E-02 pela troca de pista entre as duas pistas de treino (`TRAINING_TRACKS`,
  `chooseTrack`, `renderBest`); `SETUP_VERSION_DIFFERS` continua provado nos testes de `compareLapRecords` de
  `dirigibilidade`, pelo motivo verdadeiro (o seletor de acerto só oferece as versões publicadas correntes).
- Este registro 1.2.0 → 1.2.1. `00-index.md` e `99-traceability.md` regenerados pelo gate.

**Itens fechados**: ISSUE-01, ISSUE-02, ISSUE-03, ISSUE-04, ISSUE-05, ISSUE-06.

**Itens recusados ou não tratados, com motivo**

- DIV-01 a DIV-07: divergências devidas pelo código; nenhuma ação deste estágio. DIV-01 (linha da rodada de 2026-10-22
  de `98-divergences.md`, satisfeita na árvore segundo o relatório): a passagem a `resolved` é da etapa devedora
  (código, `dirigibilidade`), e não é rejulgada aqui.
- Os feedbacks enviados pelo validador a `pista-kart-park` e a `dirigibilidade` são dessas features; nada neste
  conjunto muda por eles.
- Nenhum módulo, campo, contrato, elemento de tela ou componente acrescentado (§16); o passo novo de E2E-02 usa o
  seletor de pistas existente.
