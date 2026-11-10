---
title: Registro de mudanças — apresentação e som
feature: apresentacao-e-som
stage: dspec
status: validated
version: 1.1.0
sources: []
---

# Registro de mudanças

## 2026-11-10 — rodada 1, Mode A

**O que mudou**

- Conjunto gerado do zero a partir do F-Spec validado de `300 Specs/320 F-Specs/Output/apresentacao-e-som/`
  (FEAT-0001 a FEAT-0005 com 46 `REQ-*`, API-0001 a API-0003, FLOW-0001 a FLOW-0003, SCR-0001 e SCR-0002,
  RULE-0001 a RULE-0003; validação `fspec-validation-20261110-1714`), das diretrizes de
  `300 Specs/330 D-Specs/Input/domain-directives.md` e da árvore de código na raiz do repositório (commit
  `5a0dfb3`), lida só para posicionamento.
- `01-architecture.md`, `test-strategy.md`, `98-divergences.md` (16 linhas abertas); cinco itens de projeto:
  `web/DES-0001` (arquivos entregues e declarações do documento), `web/DES-0002` (decisão do som, pura),
  `web/DES-0003` (saída de áudio e controle de som), `web/DES-0004` (registros de verificação e medida do
  build), `security/DES-0005` (rede, inspeção e licença); um modelo de dado (`data/DM-0001`: registro de
  origem e estado em memória); três ADRs (`adr/ADR-0001` a `ADR-0003`).
- Todo `REQ-*` do F-Spec é realizado por ao menos um item, declarado em `sources:`.
- `00-index.md` e `99-traceability.md` não foram escritos: o gate os gera com `lint_artifacts.py --emit`.

**Fatos medidos nesta rodada, antes de entrarem no projeto**

- `docs/art/icon.png`: 2048 × 2048, opaco, 5.233.536 bytes. `docs/art/cover.png`: 2752 × 1536, opaco,
  6.161.514 bytes. `docs/sfx/engine-loop.mp3`: 70.998 bytes. `docs/sfx/tire-screech.mp3`: 44.389 bytes.
- Ensaio de conversão: ícone PNG 192 × 192 RGB, 36.674 bytes; capa JPEG 1200 × 670 qualidade 80, 72.701
  bytes. Soma dos 4 arquivos: 224.762 bytes.
- `dist/` de hoje (HTML, JS, CSS): 186.783 bytes em gzip de nível máximo.
- O Vite 8 instalado trata `og:image` de `index.html` como referência de arquivo (lista em
  `node_modules/vite/dist/node/chunks/node.js`).

**Itens fechados**

Nenhum: primeira rodada, sem relatório de validação nem feedback pendente.

**Itens recusados**

Nenhum.

**Propostas para o autor (`SCOPE-BACKLOG.md`; este conjunto não as acrescenta)**

- Endereço absoluto em `og:image`: serviços de prévia que não resolvem endereço relativo mostram a prévia sem
  a capa. Fechar pede o endereço público do jogo como entrada do build, que o F-Spec não nomeia
  (`ADR-0001`).
- Declaração `twitter:card` e manifesto de aplicativo: não são pedidos por nenhum requisito e ficaram fora
  (`ADR-0001`).

**Devido por outra feature (feedback, conventions §14; este conjunto não escreve nela)**

- `pista-kart-park`, D-Spec, DES-0009: o texto sobre `ENGINE_SOUND` (`triangle`, pico 0,045), `toggle()`,
  `update()` e "o motor soa como hoje" fica superado por `DES-0003` deste conjunto.
- `pista-kart-park`, testes: CHK-TEST-0008-07 migra sob o mesmo identificador, pela tabela de
  `test-strategy.md`.

## 2026-11-10 — rodada 2, Mode B

Relatório: `reports/dspec-validation/dspec-validation-20261110-1735.md` (FAIL: 1 error, 2 warning).

**O que mudou**

- `web/DES-0004` 1.0.1: o item e cada módulo novo (`scripts/assetBudget.ts`, `scripts/asset-budget.ts`,
  `tests/helpers/soundReport.ts`) passam a nomear a camada **aplicação** do mapa, com o lugar na árvore dito
  à parte; sai "Camada do mapa: nenhuma". Entra o motivo de `tests/helpers/soundReport.ts` ser novo em vez de
  estender `tests/helpers/kart01Report.ts`.
- `01-architecture.md` 1.0.1: as duas linhas "Fora do cliente" da tabela de posicionamento passam a
  "Aplicação", com a árvore dita na coluna do módulo; `tests/helpers/soundReport.ts`, já declarado em
  DES-0004, ganha a sua linha; a direção das dependências diz que nenhum módulo de `src/` importa os módulos
  de verificação.
- `security/DES-0005` 1.0.1: o mesmo fato, no terceiro lugar em que estava ("os outros dois ficam fora do
  cliente"): o item fica inteiro na camada aplicação.
- `test-strategy.md` 1.0.1: AC-US-0004-04 e AC-US-0004-01 dizem que a composição
  `laidSegment && rearOnAsphalt` fica em `src/main.ts`, que `npm test` não carrega; o nível declarado para
  ela passa de unidade ("as quatro combinações") para contrato de texto mais o roteiro E2E-07. O teste
  unitário fica só com o que `decideSoundOutput` executa.

**Itens fechados**

- ISSUE-01 (error, D-DS-01): por edição, nos três lugares.
- ISSUE-02 (warning, D8): por troca do nível declarado. Não foi criada função para a composição: seria
  superfície nova numa rodada de correção (convenções §16).
- ISSUE-03 (warning, I10): por edição.

**Itens recusados**

Nenhum. FB-01 e FB-02 do relatório são de escopo, enviados a `pista-kart-park`, fora do veredito; este
conjunto não escreve naquela feature.

**Superfície**

Nenhum módulo, tabela, campo, ponto de entrada ou componente acrescentado.

## 2026-11-10 — rodada 3, Mode C

Feedback: `reports/feedback/feedback-20261110-1745.md` (etapa de código, FAIL SPEC, SPEC-ISSUE-01).

**Decisão do dono do produto que esta rodada carrega (2026-11-10)**

As duas gravações (motor e pneu) vão embutidas no pacote JavaScript do download inicial, sem `fetch` nem
qualquer requisição de rede feita pelo código para buscá-las. A rota com `fetch` e `preload as="fetch"` é
abandonada. Nenhum teste validado de outra feature é migrado por causa da rota de entrega: CHK-TEST-0011-02
(`pista-kart-park`) e CHK-TEST-0013-03 (`race-lap-validation`) continuam valendo como estão, e o projeto
passa nelas sem contorná-las. A migração já prevista de CHK-TEST-0008-07 continua.

**O que mudou**

- `adr/ADR-0001` 1.1.0: reescrita. Imagens pedidas pelo documento; gravações importadas com `?inline` e
  embutidas no JS de entrada; nenhuma API de rede em `src/audio.ts` nem em `src/main.ts`; a forma entregue de
  cada gravação continua sendo o MP3 de `src/assets/` (a base 64 é transporte). A rota com `fetch` passa a
  alternativa recusada, junto com `globalThis.fetch` e a importação dinâmica.
- `web/DES-0001` 1.1.0: saem os dois `preload as="fetch"`; `index.html` ganha 6 elementos, não 8, e não
  referencia nenhum `.mp3`; tabela de como cada arquivo entra no download inicial.
- `web/DES-0003` 1.1.0: `loadRecordings` recebe os dois textos embutidos e não faz pedido de rede; entra
  `decodeRecordingDataUrl` (pura); saem `SOUND_LOAD_TIMEOUT_MS`, o `AbortController`, o temporizador e os
  motivos de log `http` e `timeout`; `src/main.ts` importa `./assets/*.mp3?inline`; `src/rawImports.d.ts`
  declara `*.mp3?inline`; seção nova "Nenhuma API de rede no texto do código", com o que as duas verificações
  de camadas leem; `sources:` ganha REQ-FEAT-0005-04.
- `web/DES-0004` 1.1.0: a medida do build acha cada forma entregue pelo resumo, como arquivo de `dist/` ou
  como carga embutida num JS do download inicial; entra `embeddedPayloads` (pura); `featureAssetBytes` conta
  os bytes da forma entregue; `curbSoundFileCount` conta também som embutido que não seja um dos dois.
- `data/DM-0001` 1.1.0: o registro de origem não muda de forma (`schemaVersion` 1, nenhum campo novo); o
  texto sobre o limite de 4.096 bytes do Vite, a janela de compatibilidade e `deliveredSha256` passam a dizer
  a rota embutida.
- `security/DES-0005` 1.1.0: a tabela de rede diz a rota embutida e nomeia as duas verificações validadas
  como garantia de que o código não usa a rede.
- `adr/ADR-0003` 1.1.0: a escolha 14 (prazo de 8.000 ms) é retirada.
- `01-architecture.md` 1.1.0: posicionamento, diagrama de abertura, dependências (sai `fetch`, entram `atob`
  e a importação `?inline`), duas linhas novas em "Efeitos sobre outras features" (CHK-TEST-0011-02 e
  CHK-TEST-0013-03: nada muda, nenhum feedback devido) e "Ordem de entrega" com a única exceção declarada de
  `npm test` (CHK-TEST-0008-07, do passo 3 ao passo 5).
- `test-strategy.md` 1.1.0: sai o `fetch` de substituição; os testes entregam a `loadRecordings` textos
  `data:` montados dos bytes de `src/assets/`; E2E-08 reescrito; E2E-14 retirado; NFR-0003 provado também
  pelo texto de `src/audio.ts` e `src/main.ts`; a seção de migração declara que só CHK-TEST-0008-07 migra.
- Não mudaram: `web/DES-0002`, `adr/ADR-0002`, `98-divergences.md` (as 16 linhas seguem `open`; nenhuma
  cita a rota de entrega).
- `00-index.md` e `99-traceability.md` não foram escritos: o gate os gera com `lint_artifacts.py --emit`.

**Fatos medidos nesta rodada, antes de entrarem no projeto**

- Base 64 das gravações: 94.664 caracteres (motor) e 59.188 (pneu), 153.852 no total; esse texto em gzip de
  nível máximo pesa 114.191 bytes (as gravações somam 115.387 bytes).
- Soma dos 4 arquivos contando o texto em base 64 no lugar dos bytes do MP3: 263.227, abaixo de 300.000.
- O Vite 8 instalado reconhece o sufixo `?inline` (`inlineRE` em
  `node_modules/vite/dist/node/chunks/node.js`).
- As listas das duas verificações, lidas em `tests/pista-kart-park-layering.test.ts:37-38`, `:58-66` e
  `tests/race-lap-validation-layering.test.ts:15`, `:43-47`: nenhuma inclui `atob`, `setTimeout` nem
  `OfflineAudioContext` para `src/audio.ts` ou `src/main.ts`; as duas leem o texto sem comentários, de modo
  que a palavra `fetch` solta dentro de um texto entre aspas também reprova.

**Itens fechados**

- SPEC-ISSUE-01: por edição, em todos os lugares em que a rota de entrega estava dita (ADR-0001, DES-0001,
  DES-0003, DES-0004, DES-0005, DM-0001, ADR-0003, arquitetura e estratégia de testes).
- Observação não bloqueante sobre CHK-TEST-0013-03: tratada — `src/main.ts` só ganha duas importações
  estáticas `?inline`, e a verificação é nomeada em "Efeitos sobre outras features".
- Observação não bloqueante sobre `setTimeout` e `AbortController` em `src/audio.ts`: sem objeto — os dois
  saíram do projeto com o prazo de carregamento.

**Itens recusados**

- A saída "declarar a migração de CHK-TEST-0011-02", oferecida pelo feedback como alternativa: recusada por
  decisão do dono do produto; a verificação fica como está.
- A saída de escrever a chamada de rede fora do alcance da expressão da verificação (`globalThis.fetch` ou
  equivalente): recusada pelo dono do produto e registrada como alternativa recusada em ADR-0001.

**Retirado nesta rodada, com motivo**

- Roteiro E2E-14 (bloquear os endereços de som): não há endereço de som a bloquear; o caso de som
  indisponível fica alcançado em `npm test`. O identificador não é reaproveitado.
- `SOUND_LOAD_TIMEOUT_MS` e a escolha 14 de ADR-0003: não há carregamento separado do JS.

**Superfície (Mode C, autorizada por SPEC-ISSUE-01 e pela decisão do dono do produto)**

- Acrescentado: `decodeRecordingDataUrl` (`src/audio.ts`), `embeddedPayloads` (`scripts/assetBudget.ts`), a
  declaração `*.mp3?inline` em `src/rawImports.d.ts`.
- Retirado: `SOUND_LOAD_TIMEOUT_MS`, os dois `preload as="fetch"`, a declaração `*.mp3?url`.
- Nenhum módulo, tabela, campo de registro, ponto de entrada nem dependência acrescentado.

**Devido por outra feature**

Nada de novo: a rota embutida não muda nenhuma verificação nem texto de `pista-kart-park` ou de
`race-lap-validation`. Continuam devidos os dois itens da rodada 1 (DES-0009 e CHK-TEST-0008-07).
