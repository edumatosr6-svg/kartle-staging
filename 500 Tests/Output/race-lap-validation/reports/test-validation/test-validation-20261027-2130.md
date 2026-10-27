---
stage: test
feature: race-lap-validation
verdict: SUCCESS
generated: 2026-10-27T21:41:00Z
run: {collected: 296, passed: 296, failed: 0, skipped: 0, fresh: true}
counts: {blocker: 0, error: 0, warning: 2, info: 9, divergence: 27}
seed: {revision: 2, digest: ee91c5706be1}
upstream: {stage: code, version: n/a}
checks: {before: 140, after: 140, migrated: 0, removed: 0}
---

# Relatório de validação de testes — race-lap-validation (revalidação, rodada 4, Modo B: CHK-TEST-0009-02)

## Verification status

- criteria verified: 57 de 84 (50 `AC-US-*` de 72 e 7 `NFR-*` de 12) — decididos integralmente por `npm test`, 140 verificações `CHK-TEST-*` desta feature todas executadas e aprovadas (139 sem mudança, 1 modificada: CHK-TEST-0009-02).
- unverified: 27 — os mesmos das rodadas 1 a 3, cada um com a metade de simulação provada em `npm test` e a metade de tela, aparelho ou navegador pendente do roteiro `E2E-nn` (NFR-0003 e NFR-0008 sem verificação automática possível, I9): AC-US-0001-02, AC-US-0001-03, AC-US-0001-09, AC-US-0001-10, AC-US-0002-01, AC-US-0002-02, AC-US-0002-03, AC-US-0002-09, AC-US-0003-05, AC-US-0003-06, AC-US-0003-07, AC-US-0004-04, AC-US-0006-05, AC-US-0007-02, AC-US-0008-01, AC-US-0008-03, AC-US-0008-04, AC-US-0009-01, AC-US-0009-04, AC-US-0009-07, AC-US-0009-08, AC-US-0009-09, NFR-0003, NFR-0004, NFR-0006, NFR-0007, NFR-0008. Ver Divergências.
- covered only by a skip: 0.
- população desta revalidação (conventions §8): as doze issues do relatório `test-validation-20261027-1704` re-verificadas primeiro (ISSUE-01 a ISSUE-12); arquivos com `version:` movida desde aquele relatório: `TEST-0009-dado-de-pista.md` 1.2.0, `97-changelog.md` 1.3.0, `98-divergences.md` 1.1.0 e `tests/race-lap-validation-track-data.test.ts` (diff de trabalho contra `HEAD`: só o bloco de CHK-TEST-0009-02, linhas 18-30; `tests/fixtures/*` e `src/track.ts` sem diff; `src/trackData.ts` movido por `pista-kart-park`, constante `TRACK_SCHEMA_VERSION = 3` na linha 11); `00-index.md` e `99-traceability.md` reemitidos pelo lint (camada mecânica, não re-julgada); upstream: `test-strategy.md` 1.1.2 (rodada 5 do D-Spec, 2026-10-27T14:25, fecha ISSUE-04 e ISSUE-05), DES-0006 1.1.0, DM-0001 1.0.1, ADR-0003 1.0.1, todos `validated`; dois arquivos intocados sorteados (`shuf`): `TEST-0008-determinismo.md` com `tests/race-lap-validation-determinism.test.ts` e `TEST-0006-corte-e-grama.md` com `tests/race-lap-validation-cut.test.ts` (ambos sem diff contra `HEAD`, mtime 2026-10-21) — nenhuma finding nova nos dois.
- T1: `junit-latest.xml` e `npm-test-latest.log` gravados em 2026-10-27T21:29:24Z; última edição de `tests/` (`modelo-kart-01-contract.test.ts`, `helpers/kart01Report.ts`, 21:28:10Z; `race-lap-validation-track-data.test.ts`, 21:27:02Z) e de `src/` (`audio.ts`, `main.ts`, 21:09Z) anteriores; `find src tests -newer junit-latest.xml` devolve nenhum arquivo — execução fresca, sem reexecução. Totais do runner (`ℹ`): tests 296, pass 296, fail 0, cancelled 0, skipped 0, todo 0; `<testcase>` 296 = 32 pré-existentes (`physics.test.ts`, `maneuvers.test.ts`) + 264 com id `CHK-TEST-*` (167 ids únicos no junit: 140 desta feature + ids de `modelo-kart-01`/`dirigibilidade`, ver ISSUE-14); cada um dos 140 títulos `test('CHK-TEST-…')` de `tests/race-lap-validation-*.test.ts` aparece exatamente uma vez no junit; `<failure>` 0, `<skipped>` 0, `<error>` 0. `reduce_run.py --kind test` sobre o junit e sobre o log acusa 13 "failure lines" (8 e 13 clusters), todas linhas de aprovação cujo nome contém "cannot"/"fail"/"refused" ou linhas `ℹ` de diagnóstico de `modelo-kart-01` com `"verdict":"FAIL"` de bancada — heurística do redutor, não falha. Histórico: 170/170 (10-21), 170/170 (10-22), 172/172 (10-27 17:04), 296/296 agora; CHK-TEST-0009-02 reprovou na execução registrada por `400 Code/Output/pista-kart-park/01-implementation.md` (294/296) por mudança de projeto validada (ADR-0001 de `pista-kart-park`), não por alternância sem mudança de fonte — sem flake. Níveis Web E2E e Mobile E2E não executados nesta rodada, por ausência de ferramenta (declarada em `98-divergences.md`, não silenciosa; ISSUE-06).
- atrição: ids `CHK-TEST-*` em `HEAD:99-traceability.md` (registro da rodada 3) = 140; em `tests/race-lap-validation-*.test.ts` = 140; em `99-traceability.md` atual = 140; interseção junit∩tests = 140; `comm` HEAD→tests e tests→HEAD vazios — before 140, after 140, migrated 0, removed 0; `97-changelog.md` 1.3.0 ("Migração de verificações existentes": 139 sem mudança, 1 modificado, 0 fundidos, 0 removidos, 0 acrescentados) confere.
- T2: 84 ids de critério; 82 com linha em `99-traceability.md`; NFR-0003 e NFR-0008 só em `98-divergences.md`, como antes; NFR-0012 continua com CHK-TEST-0009-01, -02, -03, -04 e -16 (linha 141); CHK-TEST-0009-02 existe, executou e passou (7,97 ms). NFR-0012 exige "versão de esquema do dado de pista maior que a anterior" observada no "arquivo de pista gerado (versão de esquema declarada)" e "100% dos arquivos na versão anterior lidos sem erro": a verificação modificada afirma a versão declarada do arquivo gerado (`SYNTHETIC_TRACK_FILE.schemaVersion`, 2) maior que a da forma anterior (`track-v1.json`, 1) e a maior versão que o leitor conhece (`TRACK_SCHEMA_VERSION`, 3) maior que a anterior; CHK-TEST-0009-01 lê a forma anterior sem erro; a terceira asserção (sintético lido como `COMPLETE`/`INCOMPLETE`) passa a provar também que um arquivo na versão imediatamente anterior ao leitor (2 < 3) é lido sem erro — a parcela que ISSUE-09 previa como devida quando a constante subisse. Cobertura de NFR-0012 mantida, sem literal de versão (as versões vêm de `trackV1Text()`, de `SYNTHETIC_TRACK_FILE` e da constante exportada; DES-0006 1.1.0 linha 37, estratégia 1.1.2 linha 184, FB-01 de `pista-kart-park`).
- T3 sobre CHK-TEST-0009-02 (o que a faria falhar): `TRACK_SCHEMA_VERSION` descida a 1 ou não inteira (`src/trackData.ts:11`); `src/track.ts:43` em 1 ou em 4 (igual ou abaixo da forma anterior, acima do leitor); o leitor passar a rejeitar a versão 2 (`src/trackData.ts:145` trocado por `!==`/`<` contra a constante, ou o ramo da versão 2 devolvendo `UNREADABLE`) — artefatos observáveis (duas exportações públicas e `readTrackData`); mensagens nomeiam NFR-0012; inteiros, sem relógio, rede ou ordem. Não é tautologia nem baixa o critério: a igualdade `SYNTHETIC_TRACK_FILE.schemaVersion === TRACK_SCHEMA_VERSION` nunca foi exigência de NFR-0012 (que fala da versão *declarada* do arquivo gerado) e só decidia um caso — sintético deixado para trás ao subir o esquema — que o projeto validado de `pista-kart-park` (ADR-0001 decisão 2, REQ-FEAT-0002-15: a pista sintética continua 2) manda ocorrer de propósito; a forma nova decide o mesmo requisito e acrescenta a prova de que o leitor aceita o sintético. Julgamento spec-vs-test: ISSUE-13 (info), não `error`. CHK-TEST-0009-03 inalterado (`TRACK_SCHEMA_VERSION + 1` = 4 → `UNSUPPORTED_SCHEMA`), coerente com o leitor em 3.
- T3 sobre os sorteados: `determinism.test.ts` (6 verificações) — CHK-TEST-0008-01/-02/-06 reprovam se `step`/`stepLap` lerem `Date`, `performance`, `Math.random` ou estado de módulo (a volta de referência é calculada na execução, inputs gravados e reproduzidos por `replay`; `deepEqual` da `LapSession` inteira em -06); -03/-04 reprovam se `advanceClock` ou o laço por quadro integrar passos fora da sequência (quadros de 2 e 4 passos contra o passo a passo); -05 reprova se `pauseLap`/`resumeLap` ou os passos em pausa alterarem `elapsedMs`/`sectorMs` (pausas de 1, 777 e 5000 passos); todas nomeiam `AC-*`/NFR-0001; igualdades sobre inteiros em ms (D-TS-05, I8). `cut.test.ts` (10 verificações) — oráculo próprio (`cutOracle`, `beyondEdgeM`) independente de `src/lap.ts`: -01/-05 reprovam se o corte disparar em passo diferente do primeiro em que 1000 ms (300 ms com limites próprios) além de 3 m (1 m) são excedidos; -02/-09 se o 120.º passo invalidar, se o retorno não zerar a contagem ou se a pausa contar; -03/-04 se grama a ≤ 3 m invalidar; -06 se tempo ou setor avançarem depois do corte; -07 se a grama não reduzir a velocidade (margem 0,5 m/s, sem igualdade de ponto flutuante); -08/-10 se o texto de tela mudar; D-TS-03 respeitada (expectativas do oráculo e da estratégia, não da implementação).
- T4: nenhuma verificação falhou; nada a classificar. Divergência entre DES-0006 1.1.0 §Determinismo / estratégia 1.1.2 linha 184 ("sintético declara `schemaVersion` igual a `TRACK_SCHEMA_VERSION`") e a leitura nova: registrada como ISSUE-13 (info), devida ao D-Spec desta feature; código e verificação fiéis a NFR-0012 e a ADR-0001 (validado) — não é FAIL SPEC.
- T5: inalterado — idempotência provada com o mesmo pedido repetido (CHK-TEST-0012-06, -07, -08, CHK-TEST-0007-11; leitura repetida igual em CHK-TEST-0009-16); RBAC, migração, offline e token não se aplicam (ISSUE-07).

## Failures

Nenhuma.

## Issues

### ISSUE-01
- severity: warning
- check: T3
- file: `tests/race-lap-validation-contract.test.ts`
- location: linha 107, CHK-TEST-0012-07
- finding: mantida das rodadas 1 a 3 (linha inalterada; declinada de forma registrada em `97-changelog.md` 1.2.0): `assert.equal(getLapState(paused.lap).toString(), getLapState(paused.lap).toString(), ...)` compara `[object Object]` consigo mesma e nunca falha; a verificação continua decidindo AC-US-0003-08 pelas demais asserções.
- expected: a asserção compara duas leituras por `deepEqual` ou é removida.

### ISSUE-02
- severity: warning
- check: T3
- file: `tests/race-lap-validation-crossing.test.ts`, `tests/race-lap-validation-state.test.ts`
- location: linha 30 (CHK-TEST-0002-03); linhas 64-67 (CHK-TEST-0004-04) e 182 (CHK-TEST-0004-15)
- finding: mantida das rodadas 1 a 3 (arquivos sem alteração desde 2026-10-21): igualdade exata sobre valores de ponto flutuante que a especificação exige exatos (fração 1; velocidade 0 e posição de largada intacta; estado intacto em pausa, DES-0001 1.1.0 linha 64) e representáveis sem erro, por isso não bloqueiam.
- expected: tolerância explícita ou comentário fixando que o valor exato é o contrato.

### ISSUE-03
- severity: info
- check: T3
- file: `tests/race-lap-validation-frozen.test.ts`
- location: linha 59, CHK-TEST-0014-05
- finding: mantida: fixa literalmente a linha 3 de `src/physics.ts`; o arquivo foi tocado em 2026-10-27T20:47Z (`modelo-kart-01`/`dirigibilidade`) e a linha 3 continua idêntica — a verificação passou; uma reformatação sem mudança de comportamento ainda a faria falhar.
- expected: nenhuma ação nesta rodada; registrado para a próxima revisão de DES-0012.

### ISSUE-04
- severity: resolvida (era info; não conta)
- check: T2
- file: `300 Specs/330 D-Specs/Output/race-lap-validation/test-strategy.md` 1.1.2
- location: linha 134 (AC-US-0004-06)
- finding: resolvida no D-Spec (rodada 5, Modo C): a linha passa a descrever CHK-TEST-0005-11 (`seedLap` para 3 índices de arco depois do marcador 2 com `markersPassedCount` 1, `autopilot()` até a chegada), sem mudança de critério ou limiar.
- expected: nenhuma ação.

### ISSUE-05
- severity: resolvida (era info; não conta)
- check: T2
- file: `300 Specs/330 D-Specs/Output/race-lap-validation/test-strategy.md` 1.1.2
- location: linha 142 (AC-US-0006-03)
- finding: resolvida no D-Spec (rodada 5): a linha passa a descrever CHK-TEST-0006-03 (`autopilot(-7)`, 1,5 m além da borda, 600 passos, máximo ≤ 3 m, > 200 passos na grama) e CHK-TEST-0006-04 (kart parado a 2 m por 600 passos, `elapsedMs === toMs(600)`), exatamente o que `tests/race-lap-validation-cut.test.ts:55-75` faz (sorteado nesta rodada).
- expected: nenhuma ação.

### ISSUE-06
- severity: info
- check: T1
- file: `500 Tests/Output/race-lap-validation/98-divergences.md`; `docs/lap-validation-device-log.md`
- location: níveis Web E2E e Mobile E2E; registro humano, Execuções 1 e 2 de 2026-10-21
- finding: mantida: `98-divergences.md` 1.1.0 só acrescentou a seção da divergência entre especificações e mantém as 27 linhas de critérios como não verificadas sem citar o registro; `docs/lap-validation-device-log.md` inalterado (2026-10-21T16:47Z); níveis E2E sem execução nesta rodada (declarado, não silencioso).
- expected: a próxima rodada do gerador (ou o dono do registro) reconcilia `98-divergences.md` com o registro, fechando só as linhas cujo roteiro passou com entrada ou tela reais (E2E-03); nenhuma linha é fechada por este relatório.

### ISSUE-07
- severity: info
- check: T5
- file: `500 Tests/Output/race-lap-validation/TEST-0012-contrato-da-volta.md`
- location: nota final (1.1.0)
- finding: mantida: verificações de acesso não autenticado, papel recusado, migração up/down, offline e falha de token não se aplicam: os contratos não definem endpoint, sessão, papel além de `player` anônimo, banco nem árvore móvel.
- expected: nenhuma ação.

### ISSUE-09
- severity: resolvida (era info; não conta)
- check: T3
- file: `tests/race-lap-validation-track-data.test.ts`; `src/trackData.ts`; `src/track.ts`
- location: CHK-TEST-0009-02 (linhas 18-30) e CHK-TEST-0009-13; `src/trackData.ts:11` (`TRACK_SCHEMA_VERSION = 3`), `:145`; `src/track.ts:43` (`schemaVersion: 2`)
- finding: o evento previsto ocorreu (`pista-kart-park` subiu a constante a 3 e manteve o sintético em 2); a parcela "100% dos arquivos de pista na versão anterior lidos sem erro" para a versão 2 é decidida pelo próprio arquivo sintético publicado, lido como `COMPLETE` (CHK-TEST-0009-13; terceira asserção de CHK-TEST-0009-02), e `track-v1.json` continua provando a versão 1 (CHK-TEST-0009-01); nenhuma fixture nova foi necessária, e por I5 a prova do caminho da versão 3 é de `pista-kart-park`.
- expected: nenhuma ação.

### ISSUE-10
- severity: info
- check: T3
- file: `tests/helpers/autopilot.ts`; `src/main.ts`
- location: `autopilot.ts:17` e `:55` (`config: KartConfig = ARCADE_KART`); `main.ts:165` (`setupRef` do acerto corrente) e `:297` (`startTrainingLap` com `setupId`/`setupVersion`)
- finding: mantida: a aplicação inicia voltas com o acerto publicado e informa `setupId`/`setupVersion`, enquanto a suíte roda com `ARCADE_KART` sem os campos (salvo CHK-TEST-0012-12/-13); nenhuma verificação tautológica nem vazia por isso (volta de referência calculada na execução; nenhum tempo em literal).
- expected: nenhuma ação nesta rodada; fixture no acerto publicado entra pela estratégia ou por `SCOPE-BACKLOG.md`.

### ISSUE-11
- severity: info
- check: T3
- file: `tests/race-lap-validation-contract.test.ts`
- location: linha 18, constante `RESULT_OPTIONAL`; CHK-TEST-0012-02, linha 44
- finding: mantida (arquivo não tocado nesta rodada): a lista de campos opcionais do resultado não nomeia `setupId` nem `setupVersion` (API-0001 1.1.0, linhas 74-75); sem reprovação falsa porque a linha 44 só percorre chaves de resultados sem os campos e CHK-TEST-0012-12 afirma o conjunto com eles.
- expected: a próxima rodada que tocar o arquivo acrescenta `setupId` e `setupVersion` a `RESULT_OPTIONAL`, sem alterar as asserções existentes.

### ISSUE-12
- severity: info
- check: T2
- file: `tests/race-lap-validation-layering.test.ts`; `src/main.ts`
- location: listas `SIMULATION` e `APPLICATION_PURE` (linhas 9-10) e CHK-TEST-0013-03 (NFR-0005, linha 44); `main.ts:3-4` e `:14-21`
- finding: mantida e ampliada: além de `./setupRecords` e `./handlingMessages`, `main.ts` passou a importar `./tracks/kart-park-v1.json?raw`, `./trainingSession`, `./trackScene`, `./curbFeedback`, `./kart01Model`, `./kart01Decals`, `./kartPose` e `./gameCamera` (features `pista-kart-park` e `modelo-kart-01`), fora das listas de CHK-TEST-0013-03; `grep` de `fetch(`, `XMLHttpRequest`, `WebSocket`, `localStorage`, `sessionStorage`, `indexedDB`, `sendBeacon`, `Date.`, `performance.` e `Math.random` nesses módulos é vazio hoje, e NFR-0005 continua decidida na árvore atual; por §14 as listas são desta feature e os módulos são de outras.
- expected: nenhuma ação nesta feature nesta rodada; as etapas de testes de `pista-kart-park` e `modelo-kart-01` provam a ausência de rede e armazenamento nos seus módulos.

### ISSUE-13
- severity: info
- check: T4
- file: `300 Specs/330 D-Specs/Output/race-lap-validation/core/DES-0006-leitura-do-dado-de-pista.md` 1.1.0; `300 Specs/330 D-Specs/Output/race-lap-validation/test-strategy.md` 1.1.2; `500 Tests/Output/race-lap-validation/98-divergences.md` 1.1.0
- location: DES-0006 §Determinismo (linhas 83-84); estratégia linha 184 (NFR-0012); `98-divergences.md` seção "Divergência entre especificações validadas"
- finding: divergência spec-vs-test, não baixa de critério: a frase "o arquivo sintético declara `schemaVersion` igual a `TRACK_SCHEMA_VERSION`" descreve a prova com a constante em 2 (DM-0001 1.0.1) e conflita com ADR-0001 de `pista-kart-park` (validado: constante 3, sintético em 2, REQ-FEAT-0002-15); a igualdade não é exigência de NFR-0012 (versão *declarada* do arquivo gerado maior que a anterior; forma anterior lida sem erro) e a verificação nova decide o requisito por inteiro, acrescentando a prova de aceitação do sintético pelo leitor; DES-0006 linha 37 já define a constante como "maior versão que o leitor conhece", o que a leitura nova respeita; a mesma frase vive também no changelog do D-Spec (linhas 91 e 122) como registro histórico.
- expected: a próxima rodada do D-Spec desta feature (Modo C) troca, em DES-0006 §Determinismo e na linha NFR-0012 da estratégia, "igual a `TRACK_SCHEMA_VERSION`" por "maior que a da forma anterior e não maior que `TRACK_SCHEMA_VERSION`, lido pelo leitor"; nada a fazer nos testes; não enviado como feedback (mesma feature, outro estágio; já registrado em `98-divergences.md` com o dono).

### ISSUE-14
- severity: info
- check: T1
- file: `500 Tests/Output/race-lap-validation/reports/junit-latest.xml`; `tests/dirigibilidade-test-pilot.test.ts`; `tests/modelo-kart-01-*.test.ts`
- location: `<testcase name="CHK-TEST-0009-02 the test-pilot lap takes at most 25 s…">` (dirigibilidade) ao lado de `<testcase name="CHK-TEST-0009-02 the schema version the reader knows…">` (esta feature); idem CHK-TEST-0010-06, CHK-TEST-0010-07 e outros (167 ids únicos no junit para 140 desta feature)
- finding: o junit da suíte inteira mistura ids `CHK-TEST-*` de três features com a mesma numeração; a comparação de atrição por id contra o registro anterior deixa de ser unívoca e foi feita por título completo (cada um dos 140 títulos desta feature aparece exatamente uma vez); nenhuma verificação desta feature mascarada (toda reprovação de qualquer homônimo seria `<failure>`, e há 0).
- expected: nenhuma ação nesta feature; o validador desta etapa compara por título (ou por `file`) enquanto a convenção numerar `CHK-TEST-*` por feature; observação para `pipeline-conventions`, não enviada como feedback por não exigir mudança em alvo algum agora.

### ISSUE-15
- severity: info
- check: T3
- file: `tests/race-lap-validation-track-data.test.ts`
- location: linha 44, CHK-TEST-0009-04 (`'{"schemaVersion": 2, "trackId": '` e `{ schemaVersion: 2, trackId: '', … }`)
- finding: dois literais `2` de versão de esquema em entradas de casos `UNREADABLE` (texto truncado; `trackId` vazio); não afirmam versão (a classificação vem do texto inválido e do id vazio, antes de qualquer regra de versão em `src/trackData.ts:144-147`) e continuam `UNREADABLE` com o leitor em 3; pré-existentes desde a rodada 1 e fora do bloco tocado nesta rodada.
- expected: nenhuma ação obrigatória; a próxima rodada que tocar o arquivo pode derivar os dois valores de `TRACK_SCHEMA_VERSION` para que o arquivo não carregue literal de versão algum, como DES-0006 pede para as provas de NFR-0012.

## Divergences

Cada linha abaixo vem de `98-divergences.md` 1.1.0 (seção de critérios inalterada desde a rodada 1), foi julgada legítima (a parte não verificada exige tela, sensor, taxa de quadros ou navegador nomeado; nenhuma é decidível por `npm test`) e não contribui para o veredito. Estado: `open`; quem deve: reconciliação do registro com `docs/lap-validation-device-log.md` (ISSUE-06) e execução humana das pendências ali listadas. A divergência entre especificações (CHK-TEST-0009-02, estado `resolved` no mesmo arquivo) é ISSUE-13.

| Id | Provado em `npm test` | Pendente (roteiro) |
|---|---|---|
| AC-US-0001-02 | CHK-TEST-0010-01 | texto renderizado no HUD (E2E-01) |
| AC-US-0001-03 | CHK-TEST-0010-02 | texto renderizado (E2E-01) |
| AC-US-0001-09 | CHK-TEST-0011-01 | tamanho medido no aparelho (E2E-01) |
| AC-US-0001-10 | CHK-TEST-0011-02 | contraste medido na cena (E2E-01) |
| AC-US-0002-01 | CHK-TEST-0005-01 | exibição (E2E-02) |
| AC-US-0002-02 | CHK-TEST-0004-07 | exibição `m:ss.mmm` (E2E-02) |
| AC-US-0002-03 | CHK-TEST-0004-08 | exibição (E2E-02) |
| AC-US-0002-09 | CHK-TEST-0004-10 | exibição por quadro (E2E-02) |
| AC-US-0003-05 | CHK-TEST-0004-12 | tecla Esc gera `pauseLap('ESC_KEY')` (E2E-03) |
| AC-US-0003-06 | CHK-TEST-0004-13 | evento do navegador gera `pauseLap('FOCUS_LOST')` (E2E-04) |
| AC-US-0003-07 | CHK-TEST-0004-14 | vigilância do sensor no celular (E2E-05) |
| AC-US-0004-04 | CHK-TEST-0010-06 | exibição (E2E-02) |
| AC-US-0006-05 | CHK-TEST-0010-07, CHK-TEST-0006-10 | exibição (E2E-02) |
| AC-US-0007-02 | CHK-TEST-0010-08 | exibição após tecla ou toque (E2E-02) |
| AC-US-0008-01 | CHK-TEST-0007-06, CHK-TEST-0010-10 | exibição (E2E-02) |
| AC-US-0008-03 | CHK-TEST-0007-08 | ausência da opção na tela (E2E-06) |
| AC-US-0008-04 | CHK-TEST-0007-09 | oferta e pilotagem na tela (E2E-06) |
| AC-US-0009-01 | CHK-TEST-0004-19, CHK-TEST-0012-01 | observação por quadro (E2E-02) |
| AC-US-0009-04 | CHK-TEST-0010-13 | escala de cinza (E2E-09) |
| AC-US-0009-07 | CHK-TEST-0010-16 | `navigator.language` trocado (E2E-07) |
| AC-US-0009-08 | CHK-TEST-0011-03 | contraste medido (E2E-07) |
| AC-US-0009-09 | CHK-TEST-0011-04 | tamanho medido no celular (E2E-07) |
| NFR-0003 | — | fps nos aparelhos nomeados (E2E-10) |
| NFR-0004 | CHK-TEST-0013-03 | 0 requisições com rede bloqueada (E2E-08) |
| NFR-0006 | CHK-TEST-0010-13, CHK-TEST-0011-03 | legibilidade em escala de cinza (E2E-09) |
| NFR-0007 | CHK-TEST-0010-17 | idioma do navegador (E2E-07) |
| NFR-0008 | — | mesmo tempo ao ms nos quatro navegadores (E2E-11; sequência: `reference.inputs` de TEST-0008) |
