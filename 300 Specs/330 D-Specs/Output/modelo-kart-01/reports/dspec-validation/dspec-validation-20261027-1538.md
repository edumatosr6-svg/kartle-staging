---
stage: dspec
feature: modelo-kart-01
verdict: FAIL
generated: 2026-10-27T15:38:40Z
counts: {blocker: 0, error: 1, warning: 6, info: 2, divergence: 21}
seed: {revision: 1, digest: ef2fe14c9440}
upstream: {stage: fspec, version: 1.2.0}
feedbacks: []
population: "re-validação (conventions §8): ISSUE-01 a ISSUE-08 de dspec-validation-20261022-1840 re-verificadas primeiro; arquivos deste conjunto com `version:` movida desde aquele relatório: nenhum (os 16 do índice continuam em 1.0.0; 00-index.md e 99-traceability.md regenerados pelo gate em 2026-10-27T15:32:08Z, não re-julgados); dois arquivos intocados sorteados ao acaso: data/DM-0001, web/DES-0001; D1 mecânico sobre os 18 arquivos; upstream movido desde 1840: F-Spec 1.1.0 → 1.2.0 (fspec-validation-20261027-1520, SUCCESS; 01-overview.md, 02-glossary.md, FEAT-0003, FLOW-0001, FLOW-0002, RULE-0002 e SCR-0001 em 1.2.0; os 63 `REQ-*` e os três contratos sem mudança), lido para D3; árvore na raiz do repositório em HEAD aadd01f (src/ igual ao commit 0068a57; só tests/race-lap-validation-track-data.test.ts mudou), lida só para fatos de posicionamento; nenhuma rodada de gerador nesta execução (reports/token-usage/dspec-loop-phases-20261027-1532.csv: setup, 1-dspec-validator)"
context-ignored: "nenhuma justificativa chegou com a invocação; 01-architecture.md e 97-changelog.md deste conjunto registram decisões 'recebidas com a invocação' e a justificativa do gerador, e 97-changelog.md do F-Spec registra ordens do autor às rodadas daquele estágio — chegaram pelos próprios artefatos e não foram usados como fundamento: cada verificação foi julgada só contra o F-Spec validado 1.2.0, as diretrizes de 330 D-Specs/Input/domain-directives.md e 100 Admin/120 Processes/domain-invariants.md, e a árvore"
---

# Relatório de validação do D-Spec — modelo-kart-01

## Summary

- veredito: FAIL
- contagens: 0 blocker, 1 error, 6 warning, 2 info, 21 divergence
- ISSUE-01 a ISSUE-06 de 1840 (warning): abertas, inalteradas — nenhum arquivo do conjunto moveu de versão e nenhuma rodada de gerador ocorreu desde aquele relatório
- ISSUE-07 e ISSUE-08 de 1840 (info): inalteradas; nenhuma mudança esperada
- ISSUE-09 (error, nova, D3/D9): o conjunto declara realizar o F-Spec 1.1.0 e atribui-lhe a frase "o kart continua pilotável" depois de `ENDED`; o F-Spec validado é 1.2.0 e diz o contrário
- feedback enviado: nenhum
- entrada humana: nenhuma; a correção deriva do F-Spec 1.2.0
- `status:` não alterado (veredito FAIL); os 17 arquivos com campo `status` continuam a ler `validated` do ciclo de 1840

## Issues

### ISSUE-01

- severidade: warning
- verificação: D1, toda ligação relativa resolve (re-verificação de ISSUE-01 de 1840)
- arquivo: `01-architecture.md`
- localização: seção "Fluxo alterado", linhas 118 e 125, ligações a FLOW-0002 e FLOW-0003
- achado: as duas ligações usam `../../320%20F-Specs/Output/modelo-kart-01/flows/...`, que a partir de `300 Specs/330 D-Specs/Output/modelo-kart-01/` resolve para `300 Specs/330 D-Specs/320 F-Specs/...`, caminho inexistente (74 ligações verificadas no conjunto, 2 quebradas); inalterada desde 1840.
- esperado: `../../../320%20F-Specs/Output/modelo-kart-01/flows/FLOW-0002-largada-visao-geral-descida-e-pose-de-corrida.md` e `../../../320%20F-Specs/Output/modelo-kart-01/flows/FLOW-0003-verificacao-do-modelo-montado.md`.

### ISSUE-02

- severidade: warning
- verificação: D2, nenhum item de projeto contém corpo de implementação (re-verificação de ISSUE-02 de 1840)
- arquivo: `web/DES-0004-integracao-da-cena-em-main-ts.md`
- localização: tabela Interface, linhas `:113-134`, `:478-482`/`:483-487` e "função local nova `applyCameraView`"
- achado: as linhas trazem instruções TypeScript completas (`const kart01 = buildKart01Model(); paintKart01Decals(kart01); kart01.root.rotation.y = Math.PI; ...`, o corpo inteiro de `applyCameraView` e o bloco por quadro `if (width > 0 && height > 0) { const view = computeCameraView({...}); ... }`), e não só assinaturas e contratos; inalterada desde 1840.
- esperado: cada linha diz o que é lido, de que campo, em que ordem e com que condição (contrato de `applyCameraView(camera, view)`: posição de `cameraXM/cameraHeightM/cameraZM`, mira de `aimXM/aimHeightM/aimZM`, `fov` = `verticalFovDeg`, `aspect` = largura ÷ altura, `far` ≥ 3 × altura), deixando a escrita do código à etapa de código.

### ISSUE-03

- severidade: warning
- verificação: D3, todo contrato de API tem item de projeto que o serve, forma campo a campo (re-verificação de ISSUE-03 de 1840)
- arquivo: `web/DES-0003-camera-de-jogo.md`
- localização: tabela Interface, linha `computeCameraView(inputs)`
- achado: API-0003 nomeia a operação `getCameraView`; o projeto expõe `computeCameraView(CameraFrameInputs)` e nenhum símbolo chamado `getCameraView`, e não diz que um realiza o outro (a resposta `CameraView` coincide campo a campo com o contrato); inalterada desde 1840.
- esperado: a linha declara que `computeCameraView` realiza a operação `getCameraView` de API-0003 e que as entradas do quadro são passadas explicitamente por ser função pura, ou o símbolo exportado passa a chamar-se `getCameraView`.

### ISSUE-04

- severidade: warning
- verificação: D3, todo contrato de API tem item de projeto que o serve, forma campo a campo (re-verificação de ISSUE-04 de 1840)
- arquivo: `web/DES-0006-verificacoes-de-npm-test-e-relatorio-do-modelo.md`
- localização: tabela Interface de `tests/helpers/kart01Report.ts`
- achado: API-0002 nomeia a operação `kartModelReport`; o projeto reparte a produção entre `measureKart01Model`, `judgeModelCheck`, as funções `*Check` e `serializeRecord`, sem símbolo chamado `kartModelReport` nem frase que diga qual função produz o conjunto de registros; inalterada desde 1840.
- esperado: a tabela nomeia a função que produz o conjunto de registros de API-0002 (por exemplo `kartModelReport(model, baseline, reading): CheckRecord[]`), ou declara que cada arquivo de teste emite os seus registros e que `kartModelReport` é o nome do conjunto.

### ISSUE-05

- severidade: warning
- verificação: D3, forma do contrato campo a campo (semântica do campo); NFR-0006 com o mecanismo que atinge o limiar (re-verificação de ISSUE-05 de 1840)
- arquivo: `web/DES-0006-verificacoes-de-npm-test-e-relatorio-do-modelo.md`
- localização: tabela Interface, linha `simContractCheck(baseline)`, campo `inputContractUnchanged`
- achado: API-0002 define `inputContractUnchanged` como "mesmo conjunto de campos e mesmas faixas de `Input`"; o mecanismo compara só a linha `export type Input = ...` de `src/physics.ts` com `baseline.inputTypeLine`, que carrega os campos e não as faixas, de modo que o booleano pode ser verdadeiro com as faixas alteradas; inalterada desde 1840.
- esperado: a linha declara que as faixas são cobertas pela diferença de 0 linhas em `src/physics.ts` registrada pelo manifesto da etapa de código (REQ-FEAT-0006-06) e restringe o significado do booleano ao conjunto de campos, ou a linha de base grava os limites de saturação e `simContractCheck` os compara — uma das duas, dita no item.

### ISSUE-06

- severidade: warning
- verificação: D8, níveis atribuídos por FEAT coerentes com o caminho de cada critério (re-verificação de ISSUE-06 de 1840)
- arquivo: `test-strategy.md`
- localização: tabela "Funcionalidade por nível", linha FEAT-0004
- achado: a linha marca Unitário "—" e Integração "—", enquanto a linha NFR-0004 da tabela "Requisitos não funcionais" e a tabela "Níveis" põem `DRAW_COST` na Integração (`model` (I)) e as medidas sintéticas (31 chamadas, 5.127 triângulos) no Unitário; inalterada desde 1840.
- esperado: a linha FEAT-0004 lê "sim" em Unitário e em Integração, com a razão "`DRAW_COST` em Node", ou a linha NFR-0004 move `DRAW_COST` para o nível Contrato — uma só afirmação nas três tabelas.

### ISSUE-07

- severidade: info
- verificação: D5, I4 (padrão seguro; chave mestra) (re-verificação de ISSUE-07 de 1840)
- arquivo: `adr/ADR-0003-ordem-de-entrega-depois-da-dirigibilidade-e-sem-chave.md`
- localização: Decisão, item 4
- achado: a feature entra sem chave mestra desligada por padrão; I4 exige recuo seguro e padrão neutro, não chave, e FEAT-0001 e FEAT-0003 (Configuração) proíbem chave; o padrão neutro é provado por `RENDER_NEUTRAL`, `SIM_CONTRACT` e `DETERMINISM`; a razão está dita; inalterada.
- esperado: nenhuma mudança; registrado para que a próxima rodada não reabra a cláusula contra o F-Spec.

### ISSUE-08

- severidade: info
- verificação: D8, caminho pelo qual o teste chega a AC-US-0002-02 (re-verificação de ISSUE-08 de 1840)
- arquivo: `web/DES-0006-verificacoes-de-npm-test-e-relatorio-do-modelo.md`; `test-strategy.md`
- localização: tabela Interface, linha `wheelSpinCheck(rollingSpeedMps, checkStepCount)`; `test-strategy.md`, linha AC-US-0002-02
- achado: `WHEEL_SPIN` constrói `checkStepCount + 1` estados sintéticos e aplica `advanceWheelSpin` uma vez com `delta` = `checkStepCount`, em vez de avançar a simulação com `step` passo a passo como FLOW-0003 narra; a razão está dita (igualdade estrita sem tolerância) e o caminho por sessão real está coberto por `pose` (I); inalterada.
- esperado: nenhuma mudança neste conjunto; a etapa de testes lê este caminho como o projetado.

### ISSUE-09

- severidade: error
- verificação: D3, cobertura do F-Spec nos dois sentidos — o conjunto contradiz o seu upstream (conventions §6: erro, não divergência); D9, registro de divergências
- arquivo: `98-divergences.md`; `01-architecture.md`
- localização: `98-divergences.md`, parágrafo introdutório ("O F-Spec (1.1.0) é normativo") e parágrafo final ("Fato lido como as-built que o F-Spec descreve de outro modo ... o glossário e RULE-0002 dizem que, com a volta encerrada, 'o kart continua pilotável' ... Registrado em `97-changelog.md` como proposta ao autor"); `01-architecture.md`, primeiro parágrafo ("F-Spec validado de modelo-kart-01 (1.1.0, validação `fspec-validation-20261022-1757`")
- achado: o conjunto declara realizar o F-Spec 1.1.0 e afirma que o glossário e RULE-0002 do upstream dizem que o kart continua pilotável depois de `ENDED`, mantendo a questão como proposta aberta ao autor; o F-Spec validado é 1.2.0 (`fspec-validation-20261027-1520`), cujos `02-glossary.md`, RULE-0002, FEAT-0003, FLOW-0001, FLOW-0002, SCR-0001 e `01-overview.md` dizem que ao fim da volta a simulação para e o kart congela (invariante INV-1 de `race-lap-validation`) e que "nenhum requisito de pilotagem depois do fim da volta existe nesta feature" — a frase atribuída ao upstream não existe em nenhum artefato normativo dele; os itens de projeto (DES-0003 `decideCameraMode` com `ENDED` → `RACE_CHASE`; DES-0004 linha `:224-235`; ADR-0002, Consequências) já realizam o comportamento de 1.2.0, de modo que a contradição está só no que o conjunto afirma do upstream e na pergunta que mantém aberta.
- esperado: `01-architecture.md` e `98-divergences.md` citam o F-Spec 1.2.0 (`fspec-validation-20261027-1520`) como upstream realizado; o parágrafo final de `98-divergences.md` deixa de atribuir ao F-Spec a frase "o kart continua pilotável" e diz que o congelamento ao fim da volta é o que o F-Spec 1.2.0 especifica (FEAT-0003, RULE-0002, FLOW-0001; INV-1 de `race-lap-validation`), já realizado por DES-0003, DES-0004 e ADR-0002, sem proposta pendente ao autor; `97-changelog.md` ganha a entrada desta rodada (Mode A sobre upstream movido), registrando a proposta da rodada 1 como respondida pelo autor (`DOMAIN/DEC-06` corrigida, absorvida pelo F-Spec 1.2.0); a frase de ADR-0002 "Se `race-lap-validation` vier a manter o kart pilotável depois do fim da volta, nada aqui muda" fica como hipótese explícita ou sai — uma das duas, dita no ADR; `version:` dos arquivos editados movida.

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

- requisitos: 63 `REQ-*` do F-Spec 1.2.0 (FEAT-0001: 17; FEAT-0002: 10; FEAT-0003: 15; FEAT-0004: 5; FEAT-0005: 8; FEAT-0006: 8; nenhum acrescentado, retirado ou renumerado entre 1.1.0 e 1.2.0), 63 realizados por pelo menos um `DES-*` em `99-traceability.md` (208 linhas), 0 descobertos
- NFRs: nenhum adiado pelo F-Spec a este estágio; NFR-0001 a NFR-0007 projetados, cada um com mecanismo e métrica do limiar perdido (`minFps`; bytes comprimidos; lista de dependências; `drawCallCount`/`triangleCount`; `forbiddenImportCount`/`differingFieldCount`; três booleanos e `differingRunCount`; `differingValueCount`)
- contratos: API-0001 → DES-0002 (`KartPose` e `NO_STATE`, campo a campo); API-0002 → DES-0006 (12 `checkId`, campos por registro e `checkFailReason` na ordem de RULE-0001, campo a campo; nome da operação em ISSUE-04, semântica de `inputContractUnchanged` em ISSUE-05); API-0003 1.1.0 → DES-0003 (`CameraView`, campos condicionais ausentes e não zerados, `NO_SCENE`, campo a campo; `ENDED` → `RACE_CHASE` conforme 1.2.0; nome da operação em ISSUE-03)
- itens de projeto sem fonte: nenhum (`99-traceability.md`: "Items with no upstream source: None"); contradição com o upstream: ISSUE-09
- critérios: 40 `AC-*` (AC-US-0001-01 a 16, AC-US-0002-01 a 06, AC-US-0003-01 a 13, AC-US-0004-01 a 02, AC-US-0005-01 a 03) com caminho de teste declarado em `test-strategy.md`; 0 inalcançáveis; 0 alcançados por configuração, ponto de entrada ou gancho só de teste; AC-US-0004-01 e -02 só por teste registrado no aparelho nomeado (I9)
- caminhos de módulo (varredura do conjunto): 26 citados como existentes, todos presentes na árvore; 12 declarados **novos**, todos ausentes (`src/kart01Model.ts`, `src/kart01Decals.ts`, `src/kartPose.ts`, `src/gameCamera.ts`, `tests/helpers/kart01Report.ts`, 4 `tests/modelo-kart-01-*.test.ts`, `scripts/kart01-baseline.ts`, `tests/fixtures/kart01-sim-baseline.json`, `docs/kart-01/device-log.md`); 0 nem existentes nem declarados novos
- fatos de posicionamento dos arquivos sorteados (DES-0001, DM-0001) conferidos na árvore: `MEDIDAS` (`entreEixos` 1.05, `relacaoDirecao` 2.2, `raioRodaDianteira` 0.13, `raioRodaTraseira` 0.14), `CORES` (`0xff6a13`, `0x2b2e34`, `0xf4f3ef`, `0x2f55d4`), `atualizarBracos`, `resolverCotovelo`, `maoNoVolante`, `defRodas`, `pegada`, `placaTraseira`, `volanteGiro`, `pintarFaces`, `posicionarTubo`, `texturaCanvas`, `explodirKart` em `docs/kart-01/kart.js`; `exports` `./addons/*` em `three` 0.186.1 e `@types/three` 0.183.1; convenção de rumo em `src/physics.ts:121-122`; tratamento de WebGL ausente em `src/main.ts:21-26`; `PUBLISHED_SETUPS` e `setupVersion` em `src/physics.ts`; `MAX_FRAME_S` = 0,1; `COUNTDOWN_MS` = 3000; `MAX_LAP_STEPS`, `startSession`, `runCountdown`, `drive`, `completeLap`, `autopilot`, `replay`, `seedLap`, `kartAt` em `tests/helpers/autopilot.ts`; `syntheticReading` em `tests/fixtures/trackFiles.ts`; `src/lap.ts:173` e `src/main.ts:403` citados por `98-divergences.md` e ADR-0002 conferidos (sessão sem passo fora de `RUNNING`; laço só em `COUNTDOWN`/`RUNNING`)
- DES-0001 (sorteado), D2 e D5–D7: nomeia `REQ-*`, caminhos (`src/kart01Model.ts`, `src/kart01Decals.ts`, novos), camada Aplicação, interface com unidade em todo numérico (`M`, `rad`, rotações, px, adimensional), colaboradores, falha (`document` ausente, `getContext` nulo, `mergeGeometries` nulo, WebGL ausente), chave (nenhuma, com razão); sem corpo de implementação; sem escrita de domínio; log só com código; D-DS-07 declarado com a prova (`RENDER_NEUTRAL`)
- DM-0001 (sorteado), D4: colunas com tipo, unidade no nome (`stepS`, `simWheelbaseM`, `simTrackWidthM`, `forwardM`, `leftM`, `driverMassKg`, `checkStepCount`, `lapMs`, `sectorMs`), nulabilidade, padrão (nenhum), chave (`setupId`), índices e chaves estrangeiras (não se aplicam, dito), revisão `schemaVersion` 1, reversão (apagar o arquivo → `BASELINE_MISSING`), preenchimento (nenhum), janela de compatibilidade (`setupVersion`, `trackVersion`), retenção e privacidade (D-DS-04, I6); `finalKart` é o `State` publicado da simulação, nomeado e não redefinido (I3)
- camadas: os quatro módulos novos e os programas de teste na Aplicação; sentido Aplicação → Simulação → Dado de pista só; nenhuma regra de jogo decidida na renderização; D-DS-01 a D-DS-07 atendidas (D-DS-03 e D-DS-07 por declaração de não aplicação, com a prova nomeada)
- segurança: sem sessão nem papel além de `player`; sem segredo (varredura do conjunto, 0 ocorrências); registro em log só com códigos; entradas de fronteira validadas (fixture JSON: `schemaVersion`, campos finitos, teto de 6 000 passos; `viewWidthPx`/`viewHeightPx` > 0); regra de repouso e expiração em `web-mobile` declarada em DES-0007 (nenhum dado em repouso, nenhuma sessão)
- ligações relativas no conjunto: 74 verificadas, 2 quebradas (ISSUE-01); blocos mermaid: 1 (`01-architecture.md`, `sequenceDiagram`), sintaxe válida por inspeção
- `OPEN-<nn>` e `TBD`: nenhum (varredura; de posse do gate); `98-divergences.md`: 21 linhas, todas com requisito, exigência, `arquivo:linha`, item de projeto que fecha e estado `open`; nenhuma `waived-pending`; parágrafo final do registro em contradição com o upstream 1.2.0 (ISSUE-09)
- `status:` não gravado (veredito FAIL)
