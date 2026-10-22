---
stage: test
feature: race-lap-validation
verdict: FAIL TEST
generated: 2026-10-22T18:27:12Z
run: {collected: 170, passed: 170, failed: 0, skipped: 0, fresh: true}
counts: {blocker: 0, error: 1, warning: 2, info: 7, divergence: 27}
seed: {revision: 2, digest: ee91c5706be1}
upstream: {stage: code, version: n/a}
checks: {before: 138, after: 138, migrated: 2, removed: 0}
---

# Relatório de validação de testes — race-lap-validation (revalidação, rodada 2)

## Verification status

- criteria verified: 57 de 84 (50 `AC-US-*` de 72 e 7 `NFR-*` de 12) — decididos integralmente por `npm test`, 138 verificações `CHK-TEST-*` todas executadas e aprovadas; mesma contagem da rodada 1.
- unverified: 27 — os mesmos da rodada 1, cada um com a metade de simulação provada em `npm test` e a metade de tela, aparelho ou navegador pendente do roteiro `E2E-nn` (NFR-0003 e NFR-0008 sem verificação automática possível, I9): AC-US-0001-02, AC-US-0001-03, AC-US-0001-09, AC-US-0001-10, AC-US-0002-01, AC-US-0002-02, AC-US-0002-03, AC-US-0002-09, AC-US-0003-05, AC-US-0003-06, AC-US-0003-07, AC-US-0004-04, AC-US-0006-05, AC-US-0007-02, AC-US-0008-01, AC-US-0008-03, AC-US-0008-04, AC-US-0009-01, AC-US-0009-04, AC-US-0009-07, AC-US-0009-08, AC-US-0009-09, NFR-0003, NFR-0004, NFR-0006, NFR-0007, NFR-0008. Ver Divergências.
- covered only by a skip: 0.
- cobertura do contrato de API exigida pela estratégia 1.1.1 e ausente da suíte: campos `setupId` e `setupVersion` de API-0001/API-0002 1.1.0 (ISSUE-08) — a suíte decide os 84 critérios da etapa de requisitos como antes, mas não o nível "Contrato de API" como a estratégia validada em 2026-10-22 o define.
- população desta revalidação (conventions §8): as sete issues do relatório `test-validation-20261021-1411` re-verificadas primeiro (ISSUE-01 a ISSUE-07, mesmos ids e locais); arquivos com `version:` movida: `TEST-0009-dado-de-pista.md` 1.1.0, `97-changelog.md` 1.1.0 e `tests/race-lap-validation-track-data.test.ts` (diff de trabalho contra `HEAD`: somente CHK-TEST-0009-02 e CHK-TEST-0009-03); upstream movido desde a rodada 1: `test-strategy.md` 1.1.1, `core/DES-0006` 1.1.0, `core/DES-0001` 1.1.0, `data/DM-0002` 1.1.0, `api/API-0001` 1.1.0, `api/API-0002` 1.1.0; dois arquivos intocados sorteados (`shuf`): `TEST-0007-tipos-de-volta.md` com `tests/race-lap-validation-kinds.test.ts` e `TEST-0014-fisica-congelada.md` com `tests/race-lap-validation-frozen.test.ts` — nenhuma finding nova nos dois.
- T1: `junit-latest.xml` gravado em 2026-10-22T18:16:39Z e `npm-test-latest.log` em 18:17:11Z; última edição de `src/` (`physics.ts`, por `dirigibilidade`) em 17:59:34Z e de `tests/` (`race-lap-validation-track-data.test.ts`) em 18:15:29Z; `find -newer` sobre a árvore de código devolve nenhum arquivo — execução fresca. Totais do runner (`ℹ`): tests 170, pass 170, fail 0, cancelled 0, skipped 0, todo 0; `<testcase>` 170 = 138 com id `CHK-TEST-*` (138 ids únicos) + 32 pré-existentes de `physics.test.ts` e `maneuvers.test.ts`; `<failure>` 0, `<skipped>` 0. Histórico: uma única execução anterior registrada (170/170 em 2026-10-21), nenhuma verificação com resultado alternado — sem flake.
- atrição: ids `CHK-TEST-*` em `HEAD:99-traceability.md` (registro da rodada 1) = 138; no junit desta execução = 138; em `tests/` = 138; em `99-traceability.md` atual = 138; `comm` nas quatro direções vazio — nenhum id removido, nenhum novo. `97-changelog.md` 1.1.0 traz a tabela de migração com CHK-TEST-0009-02 e CHK-TEST-0009-03 modificados sob os próprios ids (migrated: 2), nenhum fundido, nenhum removido.
- T2: 84 ids de critério na etapa de requisitos = 84 na rastreabilidade do F-Spec; 82 com linha em `99-traceability.md` (127 linhas, 0 linhas sem `CHK`); NFR-0003 e NFR-0008 só em `98-divergences.md`, como na rodada 1; todo `CHK` referido existe em `tests/`, aparece no junit e no registro `TEST-*`; 0 verificações sem critério. Nível "Contrato de API" da estratégia 1.1.1 (linha 29) incompleto: ISSUE-08.
- T3 sobre as duas verificações modificadas: CHK-TEST-0009-02 reprova se `TRACK_SCHEMA_VERSION` (`src/trackData.ts:5`, hoje `2`) deixar de ser inteiro maior que a `schemaVersion` lida de `tests/fixtures/track-v1.json` (`1`) ou se `SYNTHETIC_TRACK_FILE.schemaVersion` (`src/track.ts:43`, literal `2`, não derivado da constante) divergir dela; CHK-TEST-0009-03 reprova se o ramo `schemaVersion > TRACK_SCHEMA_VERSION` de `src/trackData.ts:89` for removido ou virar `>=` (a versão `3` seria lida como válida ou o sintético como não suportada), se a resposta trouxer outra `schemaVersion` ou se o objeto de entrada for alterado. Mensagens de falha nomeiam NFR-0012; artefatos observáveis (resultado de `readTrackData`, constante exportada); sem igualdade de ponto flutuante, sem relógio, sem ordem.
- T3 sobre o preset novo de `dirigibilidade` (`ARCADE_ASSISTIDO_V5`): nenhuma verificação ficou tautológica nem perdeu sentido — ISSUE-10.
- T4: nenhuma verificação falhou; nada a classificar.
- T5: inalterado desde a rodada 1 — idempotência provada com o mesmo pedido repetido (CHK-TEST-0012-06, -07, -08, CHK-TEST-0007-11); RBAC, migração, offline e token não se aplicam (sem endpoint, papel, banco ou árvore nativa; API-0001/0002/0003).

## Failures

Nenhuma.

## Issues

### ISSUE-01
- severity: warning
- check: T3
- file: `tests/race-lap-validation-contract.test.ts`
- location: linha 104, CHK-TEST-0012-07
- finding: mantida da rodada 1 (arquivo sem alteração desde 2026-10-21): a asserção `assert.equal(getLapState(paused.lap).toString(), getLapState(paused.lap).toString(), ...)` compara `[object Object]` consigo mesma e nunca falha; a verificação continua decidindo AC-US-0003-08 pelas demais asserções (instantâneo JSON e `pauseCause`).
- expected: a asserção compara duas leituras por `deepEqual` ou é removida.

### ISSUE-02
- severity: warning
- check: T3
- file: `tests/race-lap-validation-crossing.test.ts`, `tests/race-lap-validation-state.test.ts`
- location: linha 30 (CHK-TEST-0002-03, `c.fraction === 1`); linha 64 (CHK-TEST-0004-04, `kart.speed === 0`)
- finding: mantida da rodada 1 (arquivos sem alteração): igualdade exata sobre valores de ponto flutuante; ambos são valores exatos exigidos pela especificação (fração 1 no cruzamento coincidente, velocidade 0 na largada) e representáveis sem erro, por isso não bloqueiam.
- expected: tolerância explícita ou comentário fixando que o valor exato é o contrato.

### ISSUE-03
- severity: info
- check: T3
- file: `tests/race-lap-validation-frozen.test.ts`
- location: linha 59, CHK-TEST-0014-05
- finding: mantida da rodada 1: fixa literalmente a linha 3 de `src/physics.ts`; `src/physics.ts` foi reescrito por `dirigibilidade` em 2026-10-22 (preset `ARCADE_ASSISTIDO_V5`, `PUBLISHED_SETUPS`, campos opcionais de `KartConfig`) e a linha 3 continuou idêntica, a verificação passou — mas uma reformatação sem mudança de comportamento ainda a faria falhar; a fixação é nomeada por DES-0012 e o comportamento é decidido pelas demais asserções do mesmo check.
- expected: nenhuma ação nesta rodada; registrado para a próxima revisão de DES-0012.

### ISSUE-04
- severity: info
- check: T2
- file: `tests/race-lap-validation-validity.test.ts`; `300 Specs/330 D-Specs/Output/race-lap-validation/test-strategy.md`
- location: CHK-TEST-0005-11 (AC-US-0004-06); estratégia 1.1.1, linha 134
- finding: mantida da rodada 1: a fixture da estratégia (excursão lateral dirigida de 10,5 m em torno do marcador 2) foi substituída por salto semeado (`seedLap`) do kart para depois do marcador 2 com `markersPassedCount` 1 (inalcançável na pista sintética publicada, changelog rodada 1); a estratégia 1.1.1, validada em 2026-10-22, ainda descreve a excursão de 10,5 m na linha 134 — a descrição não foi atualizada na rodada de D-Spec; o critério segue decidido com estado semeado, recurso previsto na estratégia (linha 47).
- expected: a estratégia (dspec) atualiza a descrição da fixture de AC-US-0004-06 na próxima rodada que a tocar; nada a corrigir nos testes.

### ISSUE-05
- severity: info
- check: T2
- file: `tests/race-lap-validation-cut.test.ts`; `300 Specs/330 D-Specs/Output/race-lap-validation/test-strategy.md`
- location: CHK-TEST-0006-03, CHK-TEST-0006-04 (AC-US-0006-03); estratégia 1.1.1, linha 142
- finding: mantida da rodada 1: o deslocamento constante de 2 m da estratégia foi ajustado para 1,5 m no autopilot (máximo medido 2,62 m, afirmado ≤ 3 m pelo oráculo) mais um kart parado a 2 m por 600 passos; a estratégia 1.1.1 ainda descreve "2 m além da borda por 600 passos" na linha 142; o critério segue decidido.
- expected: nenhuma ação nos testes; registrado para a estratégia.

### ISSUE-06
- severity: info
- check: T1
- file: `500 Tests/Output/race-lap-validation/98-divergences.md`; `docs/lap-validation-device-log.md`
- location: níveis Web E2E e Mobile E2E; registro humano, Execuções 1 e 2 de 2026-10-21
- finding: atualizada da rodada 1: o registro `docs/lap-validation-device-log.md` que a rodada 1 pedia existe desde 2026-10-21T16:47Z (Execução 1: build local, Chromium 152 como página em segundo plano, ritmo inválido; Execução 2: staging HTTPS; ensaio de reversão R4) e dá E2E-03 (Esc real) como passa, E2E-04, E2E-07 e E2E-09 como passa por evento ou filtro emulado, E2E-08 como passa na forma observável, E2E-01 e E2E-02 como parciais, E2E-05, E2E-06, E2E-10 e E2E-11 como não executados; `98-divergences.md` 1.0.0 não foi tocado e mantém as 27 linhas como não verificadas, sem citar o registro; os níveis Web E2E e Mobile E2E continuaram sem execução nesta rodada de `npm test`, por ausência de ferramenta (declarada, não silenciosa).
- expected: a próxima rodada do gerador (ou o dono do registro) reconcilia `98-divergences.md` com o registro: fecha, citando a execução, só as linhas cujo roteiro passou com entrada ou tela reais (E2E-03; medidas de tamanho e contraste da Execução 1 valem para `web-desktop`, não para o celular), e mantém abertas as decididas por evento emulado, página em segundo plano ou aparelho não nomeado; nenhuma linha é fechada por este relatório.

### ISSUE-07
- severity: info
- check: T5
- file: `500 Tests/Output/race-lap-validation/TEST-0012-contrato-da-volta.md`
- location: nota final
- finding: mantida da rodada 1: verificações de acesso não autenticado, papel recusado, migração up/down, offline e falha de token não se aplicam: os contratos não definem endpoint, sessão, papel além de `player` anônimo, banco nem árvore móvel.
- expected: nenhuma ação.

### ISSUE-08
- severity: error
- check: T2
- file: `tests/race-lap-validation-contract.test.ts`; `500 Tests/Output/race-lap-validation/TEST-0012-contrato-da-volta.md`; `500 Tests/Output/race-lap-validation/99-traceability.md`
- location: nível "Contrato de API" da estratégia (`test-strategy.md` 1.1.1, linha 29, e fixture da linha 42) → `lap-contract` (TEST-0012, CHK-TEST-0012-01 a -11)
- finding: a estratégia validada em 2026-10-22 (`dspec-validation-20261022-1754`) atribui a `tests/lap-contract.test.ts` a prova "os campos opcionais `setupId` e `setupVersion` de API-0001 presentes no resultado exatamente quando o pedido `startLap` os trouxe, copiados sem interpretação, e ausentes quando não (API-0002)", com a fixture "pedido de `startLap` com `setupId` e `setupVersion`: literais do enum de API-0002 e um texto de versão; resultado com os dois campos; o mesmo pedido sem eles dá resultado sem os campos"; nenhuma verificação da suíte menciona `setupId` ou `setupVersion` (`grep` em `tests/` vazio), TEST-0012 1.0.0 e `99-traceability.md` não a carregam, e a rodada 2 (Modo C) tratou só o FB-01 de `pista-kart-park`; o nível "Contrato de API" definido pela estratégia está, portanto, parcialmente sem verificação para API-0001 1.1.0 e API-0002 1.1.0 (DES-0001 1.1.0, DM-0002 1.1.0). Evidência de que a verificação, quando escrita, reprovará na árvore atual: `src/lap.ts:23` declara `LapRequest = { lapKind, trackId, trackVersion, challengeNumber? }` sem os dois campos, `:117` e `:270` copiam só `challengeNumber` para a sessão e para o resultado; `pipeline_progress.py` dá a etapa de código desta feature como `drifted` (validada contra D-Spec 1.0.0 em `code-validation-20261021-1338`) e aponta `code-loop race-lap-validation` como próximo passo.
- expected: TEST-0012 ganha uma verificação (id novo, `CHK-TEST-0012-12`) que chama `startLap` com `setupId` do enum (`ARCADE_ASSISTIDO` ou `REALISTA_ALUGUEL_4T`) e um `setupVersion` literal do teste, completa a volta e afirma que `getLapResult` devolve exatamente esses dois valores sem interpretação, e que o mesmo pedido sem os campos dá resultado sem eles (`'setupId' in result === false`, `'setupVersion' in result === false`) e volta idêntica em validade, tempo e motivo; a mensagem de falha nomeia o contrato (API-0001/API-0002, NFR-0005 ou o critério que a estratégia atribuir); `97-changelog.md` registra a adição como item autorizado pelo upstream movido (estratégia 1.1.1), não como superfície de rodada de correção; a verificação só passa depois que `code-loop` implementar DES-0001 1.1.0 e DM-0002 1.1.0 em `src/lap.ts` (campos opcionais em `LapRequest`, `LapSession` e `LapResult`, copiados sem interpretação) — até lá, a sua reprovação é um defeito de código a classificar como FAIL CODE, não motivo para enfraquecê-la (D-TS-07).

### ISSUE-09
- severity: info
- check: T3
- file: `tests/race-lap-validation-track-data.test.ts`; `tests/fixtures/track-v1.json`
- location: CHK-TEST-0009-01 e CHK-TEST-0009-02 (NFR-0012)
- finding: as provas de NFR-0012 derivam a "versão anterior" da `schemaVersion` da fixture `track-v1.json` (`1`) e a corrente de `TRACK_SCHEMA_VERSION` (`2`); quando `pista-kart-park` subir a constante para `3` com o seu leitor, as duas verificações continuarão passando sem edição (3 > 1; v1 lida como `INCOMPLETE`), mas a parcela "100% dos arquivos de pista na versão anterior lidos sem erro" de NFR-0012 passará a exigir uma fixture na forma 2 — que esta suíte não tem e que, por I5, é a feature que sobe a versão que deve escrever com o seu leitor; hoje, com a constante em `2`, as verificações decidem NFR-0012 por inteiro.
- expected: nenhuma ação nesta feature; observação para a etapa de testes de `pista-kart-park` (uma fixture na forma 2 ao lado de `track-v1.json` quando `TRACK_SCHEMA_VERSION` subir), registrada aqui e não enviada como feedback por não exigir mudança no alvo agora.

### ISSUE-10
- severity: info
- check: T3
- file: `tests/helpers/autopilot.ts`; `tests/race-lap-validation-determinism.test.ts`; `src/main.ts`
- location: `autopilot.ts:17` e `:55` (`config: KartConfig = ARCADE_KART`); `determinism.test.ts:14` (volta de referência); `main.ts:122`, `:158`, `:226` (`PUBLISHED_SETUPS.ARCADE_ASSISTIDO` → `startLap`)
- finding: `dirigibilidade` passou a iniciar as voltas da aplicação com `ARCADE_ASSISTIDO_V5` (padrão Arcade), enquanto toda volta da suíte roda com `ARCADE_KART` (padrão dos helpers, preset nomeado como fixture pela diretriz do estágio) — e isso não tornou nenhuma verificação tautológica nem a esvaziou: a volta de referência de TEST-0008 é calculada na execução (`completeLap(reading, 'OFFICIAL', autopilot())`), não um tempo gravado, e nenhum `CHK` fixa tempo de volta ou de setor em literal (os únicos literais de ms são constantes de especificação: 3000 da contagem, 0, `toMs(N)` ancorado em `toMs(360) === 3000` em CHK-TEST-0001-01); as regras de validade, corte, marcadores e tempo são provadas independentes do preset por construção (`src/lap.ts:120` congela a `config` recebida; nenhuma regra lê o preset); TEST-0014 continua provando que `ARCADE_KART`, `RENTAL_KART`, `KART_PRESETS`, `PHYSICS_VERSION`, `STEP`, `Input` e a assinatura de `step` ficaram literalmente iguais (NFR-0010, NFR-0011) após a reescrita de `src/physics.ts`; as medidas tomadas sob `ARCADE_KART` para as fixtures de corte (ISSUE-05) e de marcador pulado (ISSUE-04) permanecem válidas para o preset em que a suíte roda.
- expected: nenhuma ação nesta rodada; se o dono da diretriz do estágio quiser que as regras de volta sejam também exercitadas no acerto publicado como padrão (`PUBLISHED_SETUPS.ARCADE_ASSISTIDO.config`), isso é uma fixture nova a entrar pela estratégia ou por `SCOPE-BACKLOG.md`, não por rodada de correção.

## Divergences

Cada linha abaixo vem de `98-divergences.md` 1.0.0 (inalterado desde a rodada 1), foi julgada legítima (a parte não verificada exige tela, sensor, taxa de quadros ou navegador nomeado; nenhuma é decidível por `npm test`) e não contribui para o veredito. Estado: `open`; quem deve: reconciliação do registro com `docs/lap-validation-device-log.md` (ISSUE-06) e execução humana das pendências ali listadas.

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
