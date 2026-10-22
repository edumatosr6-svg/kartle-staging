---
stage: dspec
feature: modelo-kart-01
verdict: SUCCESS
generated: 2026-10-22T18:40:08Z
counts: {blocker: 0, error: 0, warning: 6, info: 2, divergence: 21}
seed: {revision: 1, digest: ef2fe14c9440}
upstream: {stage: fspec, version: 1.1.0}
feedbacks: ["300 Specs/330 D-Specs/Output/race-lap-validation/reports/feedbacks/modelo-kart-01/feedback-20261022-1840.md"]
population: "primeira validação (nenhum relatório anterior em reports/dspec-validation/): o conjunto inteiro, 18 arquivos (os 16 do índice, 00-index.md e 99-traceability.md); F-Spec validado 1.1.0 (fspec-validation-20261022-1757, SUCCESS); diretrizes 330 D-Specs/Input/domain-directives.md e 100 Admin/120 Processes/domain-invariants.md; árvore na raiz do repositório em HEAD 8c5a46e (src/main.ts, src/physics.ts, src/lap.ts, src/frameClock.ts e src/lapTiming.ts iguais ao commit 0068a57), lida só para fatos de posicionamento"
context-ignored: "nenhuma justificativa chegou com a invocação; 01-architecture.md e 97-changelog.md registram decisões 'recebidas com a invocação' e a justificativa de cada decisão do gerador — não usadas como fundamento: o conjunto foi julgado só contra o F-Spec validado (que já carrega DOMAIN/DEC-00 a DEC-06), as diretrizes do estágio e a árvore"
---

# Relatório de validação do D-Spec — modelo-kart-01

## Summary

- veredito: SUCCESS
- contagens: 0 blocker, 0 error, 6 warning, 2 info, 21 divergence
- feedback enviado: FB-01 a `race-lap-validation` (item de escopo, fora deste veredito)
- entrada humana: nenhuma
- `status: validated` gravado nos 17 arquivos do conjunto que liam `draft` (os 16 do índice e o próprio `00-index.md`, inclusive a coluna Status da sua tabela); `99-traceability.md` não tem campo `status`; nenhum arquivo lê `draft`

## Issues

### ISSUE-01

- severidade: warning
- verificação: D1, toda ligação relativa resolve
- arquivo: `01-architecture.md`
- localização: seção "Fluxo alterado", ligações a FLOW-0002 e FLOW-0003
- achado: as duas ligações usam `../../320%20F-Specs/Output/modelo-kart-01/flows/...`, que a partir de `300 Specs/330 D-Specs/Output/modelo-kart-01/` resolve para `300 Specs/330 D-Specs/320 F-Specs/...`, caminho inexistente (74 ligações verificadas no conjunto, 2 quebradas).
- esperado: `../../../320%20F-Specs/Output/modelo-kart-01/flows/FLOW-0002-largada-visao-geral-descida-e-pose-de-corrida.md` e `../../../320%20F-Specs/Output/modelo-kart-01/flows/FLOW-0003-verificacao-do-modelo-montado.md`.

### ISSUE-02

- severidade: warning
- verificação: D2, nenhum item de projeto contém corpo de implementação
- arquivo: `web/DES-0004-integracao-da-cena-em-main-ts.md`
- localização: tabela Interface, linhas `:113-134`, `:478-482`/`:483-487` e "função local nova `applyCameraView`"
- achado: as linhas trazem instruções TypeScript completas (`const kart01 = buildKart01Model(); paintKart01Decals(kart01); kart01.root.rotation.y = Math.PI; ...`, o corpo inteiro de `applyCameraView` com `camera.position.set`, `camera.up.set`, `camera.lookAt`, `camera.fov`, `camera.aspect`, `camera.far`, `camera.updateProjectionMatrix()`, e o bloco por quadro `if (width > 0 && height > 0) { const view = computeCameraView({...}); ... }`), e não só assinaturas e contratos.
- esperado: cada linha diz o que é lido, de que campo, em que ordem e com que condição (contrato de `applyCameraView(camera, view)`: posição de `cameraXM/cameraHeightM/cameraZM`, mira de `aimXM/aimHeightM/aimZM`, `fov` = `verticalFovDeg`, `aspect` = largura ÷ altura, `far` ≥ 3 × altura), deixando a escrita do código à etapa de código.

### ISSUE-03

- severidade: warning
- verificação: D3, todo contrato de API tem item de projeto que o serve, forma campo a campo
- arquivo: `web/DES-0003-camera-de-jogo.md`
- localização: tabela Interface, linha `computeCameraView(inputs)`
- achado: API-0003 nomeia a operação `getCameraView` ("lê a câmera do quadro corrente", sem parâmetro); o projeto expõe `computeCameraView(CameraFrameInputs)` e nenhum símbolo chamado `getCameraView`, e não diz que um realiza o outro (a resposta `CameraView` coincide campo a campo com o contrato; só o nome da operação e a forma da entrada ficam sem mapeamento; o mesmo padrão de entrada explícita vale para `getKartPose(state)` de DES-0002, que mantém o nome do contrato).
- esperado: a linha declara que `computeCameraView` realiza a operação `getCameraView` de API-0003 e que as entradas do quadro são passadas explicitamente por ser função pura (decisão de forma), ou o símbolo exportado passa a chamar-se `getCameraView`; a etapa de testes procura o nome do contrato.

### ISSUE-04

- severidade: warning
- verificação: D3, todo contrato de API tem item de projeto que o serve, forma campo a campo
- arquivo: `web/DES-0006-verificacoes-de-npm-test-e-relatorio-do-modelo.md`
- localização: tabela Interface de `tests/helpers/kart01Report.ts`
- achado: API-0002 nomeia a operação `kartModelReport` ("produz um registro por verificação executada"); o projeto reparte a produção entre `measureKart01Model`, `judgeModelCheck`, as funções `*Check` e `serializeRecord`, sem símbolo chamado `kartModelReport` nem frase que diga qual função produz o conjunto de registros (os campos de cada `checkId` coincidem com o contrato).
- esperado: a tabela nomeia a função que produz o conjunto de registros de API-0002 (por exemplo `kartModelReport(model, baseline, reading): CheckRecord[]`, ou declara que cada arquivo de teste emite os seus registros e que `kartModelReport` é o nome do conjunto), de modo que a etapa de testes reencontre a operação pelo nome do contrato.

### ISSUE-05

- severidade: warning
- verificação: D3, forma do contrato campo a campo (semântica do campo); NFR-0006 com o mecanismo que atinge o limiar
- arquivo: `web/DES-0006-verificacoes-de-npm-test-e-relatorio-do-modelo.md`
- localização: tabela Interface, linha `simContractCheck(baseline)`, campo `inputContractUnchanged`
- achado: API-0002 define `inputContractUnchanged` como "mesmo conjunto de campos e mesmas faixas de `Input`" (REQ-FEAT-0006-07); o mecanismo projetado compara só a linha `export type Input = ...` de `src/physics.ts` com `baseline.inputTypeLine`, que carrega os campos e não as faixas (a saturação vive em `step`), de modo que o booleano pode ser verdadeiro com as faixas alteradas.
- esperado: a linha declara que as faixas são cobertas pela diferença de 0 linhas em `src/physics.ts` registrada pelo manifesto da etapa de código (REQ-FEAT-0006-06) e restringe o significado do booleano ao conjunto de campos, ou a linha de base grava os limites de saturação (resultado de `step` com `Input` fora da faixa) e `simContractCheck` os compara — uma das duas, dita no item.

### ISSUE-06

- severidade: warning
- verificação: D8, níveis atribuídos por FEAT coerentes com o caminho de cada critério
- arquivo: `test-strategy.md`
- localização: tabela "Funcionalidade por nível", linha FEAT-0004
- achado: a linha marca Unitário "—" e Integração "—", enquanto a linha NFR-0004 da tabela "Requisitos não funcionais" e a tabela "Níveis" colocam `DRAW_COST` na Integração (`model` (I)) e as medidas sintéticas (31 chamadas, 5.127 triângulos) no Unitário.
- esperado: a linha FEAT-0004 lê "sim" em Unitário e em Integração, com a razão "`DRAW_COST` em Node", ou a linha NFR-0004 move `DRAW_COST` para o nível Contrato — uma só afirmação nas três tabelas.

### ISSUE-07

- severidade: info
- verificação: D5, I4 (padrão seguro; chave mestra)
- arquivo: `adr/ADR-0003-ordem-de-entrega-depois-da-dirigibilidade-e-sem-chave.md`
- localização: Decisão, item 4
- achado: a feature entra sem chave mestra desligada por padrão; o I4 do projeto (`domain-invariants.md`, "Safe defaults") exige recuo seguro e padrão neutro, não chave, e FEAT-0001 e FEAT-0003 ("Configuração") proíbem chave para voltar ao kart provisório ou à câmera alta; o padrão neutro é provado por `RENDER_NEUTRAL`, `SIM_CONTRACT` e `DETERMINISM`; a razão está dita.
- esperado: nenhuma mudança; registrado para que a próxima rodada não reabra a cláusula "nova feature sem chave mestra" contra o F-Spec.

### ISSUE-08

- severidade: info
- verificação: D8, caminho pelo qual o teste chega a AC-US-0002-02
- arquivo: `web/DES-0006-verificacoes-de-npm-test-e-relatorio-do-modelo.md`
- localização: tabela Interface, linha `wheelSpinCheck(rollingSpeedMps, checkStepCount)`; `test-strategy.md`, linha AC-US-0002-02
- achado: `WHEEL_SPIN` constrói `checkStepCount + 1` estados sintéticos com `initialState()` espalhado e aplica `advanceWheelSpin` uma vez com `delta` = `checkStepCount`, em vez de avançar a simulação com `step` e aplicar o giro a cada passo como FLOW-0003 (passo 7 e diagrama) narra; a razão está dita (igualdade estrita sem tolerância exige velocidades inteiras e um só quadro de 120 passos) e o caminho por sessão real de API-0001 está coberto por `pose` (I).
- esperado: nenhuma mudança neste conjunto; a etapa de testes lê este caminho como o projetado, não como defeito; se a igualdade estrita por passo for exigida um dia, é decisão do seed, não deste estágio.

## Divergences

- REQ-FEAT-0001-01, -02 a -14, -17 — kart provisório de caixas em `src/main.ts:113-134` — fecha: DES-0001, DES-0004, DES-0006, ADR-0001 — open
- REQ-FEAT-0001-15 — sem placa nem número (`src/main.ts:113-120`) — fecha: DES-0001, DES-0004 — open
- REQ-FEAT-0001-16 — sombra em caixa fixa ±120/±100 m na origem (`src/main.ts:36`) — fecha: DES-0004 — open
- REQ-FEAT-0002-01 — esterço por roda da telemetria (`src/main.ts:474`); `getKartPose` não existe — fecha: DES-0002, DES-0004 — open
- REQ-FEAT-0002-02 — giro por relógio de parede e raio 0,31 (`src/main.ts:476`); sem `WHEEL_SPIN` — fecha: DES-0002, DES-0004, DES-0006 — open
- REQ-FEAT-0002-03, -04, -10 — sem volante, braços nem piloto articulado (`src/main.ts:117-119`) — fecha: DES-0001, DES-0004, ADR-0001 — open
- REQ-FEAT-0002-05 — sem ponto de referência (`src/main.ts:442`) — fecha: DES-0002, DES-0004 — open
- REQ-FEAT-0003-01, -02, -03, -08, -13 — perseguição alta suavizada (`src/main.ts:478-482`) — fecha: DES-0003, DES-0004, ADR-0002 — open
- REQ-FEAT-0003-04, -05, -06, -07, -15 — campo de visão 48° + termo de velocidade (`src/main.ts:19`, `:483`, `:485`, `:391-394`) — fecha: DES-0003, DES-0004, ADR-0002 — open
- REQ-FEAT-0003-09 — sem prova do kart inteiro no quadro — fecha: DES-0003 — open
- REQ-FEAT-0003-10 — turbo somado a 48° com termo de velocidade e suavização (`src/main.ts:483`, `:485`) — fecha: DES-0003, DES-0004, ADR-0002 — open
- REQ-FEAT-0003-11 — câmera inicial fixa (`src/main.ts:395-396`, `:478`) — fecha: DES-0003, DES-0004 — open
- REQ-FEAT-0003-12, -14 — sem descida (`src/main.ts:229`) — fecha: DES-0003, DES-0004, ADR-0002 — open
- REQ-FEAT-0004-03, -04 — Kart 01 não montado; sem `DRAW_COST` — fecha: DES-0001, DES-0006, ADR-0001 — open
- REQ-FEAT-0004-01, -02, -05 — `docs/kart-01/device-log.md` não existe — fecha: DES-0004, DM-0001 — open
- REQ-FEAT-0005-01, -07, -08 — cadência de marcas por relógio de parede (`src/main.ts:448-449`, `:451-455`, `:472`) — fecha: DES-0005 — open
- REQ-FEAT-0005-02 — dois jatos presos ao kart de caixas (`src/main.ts:143-151`) — fecha: DES-0005 — open
- REQ-FEAT-0005-03 — marcas sob as rodas de caixas (`src/main.ts:447`) — fecha: DES-0005 — open
- REQ-FEAT-0005-05, -06 — sem `WHEEL_POSITIONS`, `TELEMETRY_WHEEL_POSITIONS` nem linha de base — fecha: DES-0006, DM-0001, ADR-0004 — open
- REQ-FEAT-0006-04, -05 — `tests/race-lap-validation-layering.test.ts` não conhece os módulos novos; sem `RENDER_NEUTRAL` — fecha: DES-0006 — open
- REQ-FEAT-0006-07, -08 — sem `SIM_CONTRACT`, `DETERMINISM` nem linha de base anterior à feature — fecha: DES-0006, DM-0001, ADR-0004 — open

## Coverage

- requisitos: 63 `REQ-*` do F-Spec (FEAT-0001: 17; FEAT-0002: 10; FEAT-0003: 15; FEAT-0004: 5; FEAT-0005: 8; FEAT-0006: 8), 63 realizados por pelo menos um `DES-*`, 0 descobertos
- NFRs: NFR-0001 a NFR-0007 projetados, cada um com mecanismo e métrica do limiar perdido (`minFps`; bytes comprimidos; lista de dependências; `drawCallCount`/`triangleCount`; `forbiddenImportCount`/`differingFieldCount`; três booleanos e `differingRunCount`; `differingValueCount`)
- contratos: API-0001 → DES-0002 (`KartPose` e `NO_STATE`, campo a campo); API-0002 → DES-0006 (12 `checkId`, campos por registro e `checkFailReason` na ordem de RULE-0001, campo a campo; nomes de operação em ISSUE-04 e semântica de `inputContractUnchanged` em ISSUE-05); API-0003 → DES-0003 (`CameraView`, campos condicionais ausentes e não zerados, `NO_SCENE`, campo a campo; nome da operação em ISSUE-03)
- itens de projeto sem fonte: nenhum (`99-traceability.md`: "Items with no upstream source: None"; cada DES, DM e ADR cita `REQ-*`, `API-*`, `RULE-*`, `FLOW-*` ou NFR)
- critérios: 40 `AC-*` (AC-US-0001-01 a 16, AC-US-0002-01 a 06, AC-US-0003-01 a 13, AC-US-0004-01 a 02, AC-US-0005-01 a 03) com caminho de teste declarado em `test-strategy.md`; 0 inalcançáveis; 0 alcançados por configuração, ponto de entrada ou gancho só de teste; AC-US-0004-01 e -02 só por teste registrado no aparelho nomeado (natureza do critério, I9)
- caminhos de módulo: 25 citados como existentes, todos presentes na árvore; 12 declarados **novos**, todos ausentes (`src/kart01Model.ts`, `src/kart01Decals.ts`, `src/kartPose.ts`, `src/gameCamera.ts`, `tests/helpers/kart01Report.ts`, 4 `tests/modelo-kart-01-*.test.ts`, `scripts/kart01-baseline.ts`, `tests/fixtures/kart01-sim-baseline.json`, `docs/kart-01/device-log.md`); 0 nem existentes nem declarados novos; símbolos citados como existentes conferidos por nome (`startSession`, `runCountdown`, `drive`, `completeLap`, `autopilot`, `replay`, `seedLap`, `kartAt`, `MAX_LAP_STEPS` em `tests/helpers/autopilot.ts`; `syntheticReading` em `tests/fixtures/trackFiles.ts`; `SIMULATION`, `NETWORK_OR_STORAGE`, `DOM_CLOCK_RANDOM` em `tests/race-lap-validation-layering.test.ts`; `MAX_FRAME_S` = 0,1; `COUNTDOWN_MS` = 3000; `track: Point[]`, `WIDTH`; `exports` `./addons/*` em `three` 0.186.1 e `@types/three` 0.183.1; `MEDIDAS`, `CORES`, `atualizarBracos`, `resolverCotovelo`, `maoNoVolante`, `defRodas`, `pegada`, `placaTraseira`, `volanteGiro` e as cores `0xff6a13`, `0x2b2e34`, `0xf4f3ef`, `0x2f55d4` em `docs/kart-01/kart.js`); linhas de `src/main.ts`, `src/physics.ts`, `src/lap.ts` citadas conferidas na árvore de HEAD, igual ao commit `0068a57`
- camadas: os quatro módulos novos e os programas de teste na Aplicação; sentido Aplicação → Simulação → Dado de pista só; nenhuma regra de jogo decidida na renderização; D-DS-01 a D-DS-07 atendidas (D-DS-03 e D-DS-07 por declaração de não aplicação, com a prova nomeada)
- dados: DM-0001 com colunas, tipos, unidades no nome, nulabilidade, padrão (nenhum), chave (`setupId`), revisão `schemaVersion` 1, reversão (apagar o arquivo → `BASELINE_MISSING`), janela de compatibilidade (`setupVersion`, `trackVersion`), retenção e privacidade; nenhum dado de jogador tocado
- segurança: sem sessão nem papel além de `player`; sem segredo (varredura do conjunto); registro em log só com códigos; entradas de fronteira validadas (fixture JSON: `schemaVersion`, campos finitos, teto de 6 000 passos; `viewWidthPx`/`viewHeightPx` > 0); regra de repouso e expiração em `web-mobile` declarada (nenhum dado em repouso, nenhuma sessão)
- ligações relativas no conjunto: 74 verificadas, 2 quebradas (ISSUE-01); blocos mermaid: 1 (`01-architecture.md`, `sequenceDiagram`), sintaxe válida por inspeção (nenhum parser de mermaid na árvore)
- `OPEN-<nn>` e `TBD`: nenhum (de posse do gate; não rejulgado); divergências em `98-divergences.md`: 21 linhas, todas com requisito, exigência, `arquivo:linha`, item de projeto que fecha e estado `open`; nenhuma `waived-pending`
