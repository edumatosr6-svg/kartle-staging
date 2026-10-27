---
stage: test
feature: race-lap-validation
verdict: SUCCESS
generated: 2026-10-27T17:04:33Z
run: {collected: 172, passed: 172, failed: 0, skipped: 0, fresh: true}
counts: {blocker: 0, error: 0, warning: 2, info: 9, divergence: 27}
seed: {revision: 2, digest: ee91c5706be1}
upstream: {stage: code, version: n/a}
checks: {before: 138, after: 140, migrated: 0, removed: 0}
---

# Relatório de validação de testes — race-lap-validation (revalidação, rodada 3)

## Verification status

- criteria verified: 57 de 84 (50 `AC-US-*` de 72 e 7 `NFR-*` de 12) — decididos integralmente por `npm test`, 140 verificações `CHK-TEST-*` todas executadas e aprovadas (138 da rodada 2 mais CHK-TEST-0012-12 e CHK-TEST-0012-13).
- unverified: 27 — os mesmos das rodadas 1 e 2, cada um com a metade de simulação provada em `npm test` e a metade de tela, aparelho ou navegador pendente do roteiro `E2E-nn` (NFR-0003 e NFR-0008 sem verificação automática possível, I9): AC-US-0001-02, AC-US-0001-03, AC-US-0001-09, AC-US-0001-10, AC-US-0002-01, AC-US-0002-02, AC-US-0002-03, AC-US-0002-09, AC-US-0003-05, AC-US-0003-06, AC-US-0003-07, AC-US-0004-04, AC-US-0006-05, AC-US-0007-02, AC-US-0008-01, AC-US-0008-03, AC-US-0008-04, AC-US-0009-01, AC-US-0009-04, AC-US-0009-07, AC-US-0009-08, AC-US-0009-09, NFR-0003, NFR-0004, NFR-0006, NFR-0007, NFR-0008. Ver Divergências.
- covered only by a skip: 0.
- nível "Contrato de API" da estratégia 1.1.1 (linha 29, fixture da linha 42): agora completo — ISSUE-08 resolvida por CHK-TEST-0012-12 e CHK-TEST-0012-13 (ver entrada).
- população desta revalidação (conventions §8): as dez issues do relatório `test-validation-20261022-1827` re-verificadas primeiro (ISSUE-01 a ISSUE-10); arquivos com `version:` movida desde aquele relatório: `TEST-0012-contrato-da-volta.md` 1.1.0, `97-changelog.md` 1.2.0 e `tests/race-lap-validation-contract.test.ts` (diff de trabalho contra `HEAD`: constante `SETUP_FIELDS`, importação de `MAX_LAP_STEPS`, CHK-TEST-0012-12 e CHK-TEST-0012-13; nenhuma linha existente alterada além do deslocamento de três linhas); `00-index.md` e `99-traceability.md` reemitidos pelo lint (camada mecânica, não re-julgada); upstream sem movimento desde a rodada 2 (`test-strategy.md` 1.1.1 de 2026-10-22T18:00Z, API-0001 1.1.0, API-0002 1.1.0, DES-0001 1.1.0); dois arquivos intocados sorteados (`shuf`): `TEST-0004-estado-da-volta.md` com `tests/race-lap-validation-state.test.ts` e `TEST-0013-camadas-e-privacidade.md` com `tests/race-lap-validation-layering.test.ts` — nenhuma finding nova de severidade acima de `info` nos dois (ISSUE-02 ganha locais do mesmo tipo; ISSUE-12).
- T1: `junit-latest.xml` e `npm-test-latest.log` gravados em 2026-10-27T16:57:07Z; última edição de `src/` (`main.ts`, `lap.ts`, `setupRecords.ts`, por `dirigibilidade`, commit 767508e) em 15:55:39Z e de `tests/` (`race-lap-validation-contract.test.ts`) em 16:56:44Z; `find src tests -newer junit-latest.xml` devolve nenhum arquivo — execução fresca, sem reexecução. Totais do runner (`ℹ`): tests 172, pass 172, fail 0, cancelled 0, skipped 0, todo 0; `<testcase>` 172 = 140 com id `CHK-TEST-*` (140 ids únicos, iguais aos 140 em `tests/` e aos 140 em `99-traceability.md`) + 32 pré-existentes de `physics.test.ts` e `maneuvers.test.ts`; `<failure>` 0, `<skipped>` 0, `<error>` 0. `reduce_run.py --kind test` sobre o log e o junit acusa 9 "failure lines", todas linhas de aprovação cujo nome contém "cannot"/"drop"/"fail" ou a linha de total `fail 0` — heurística do redutor, não falha. Histórico: 170/170 (2026-10-21), 170/170 (2026-10-22), 172/172 agora; nenhuma verificação com resultado alternado — sem flake. Níveis Web E2E e Mobile E2E não executados nesta rodada de `npm test`, por ausência de ferramenta (declarada em `98-divergences.md`, não silenciosa; ISSUE-06). A etapa de código desta feature lê `draft`/drifted em `pipeline_progress.py` (`src/lap.ts` alterado por `dirigibilidade` após `code-validation-20261021-1338`); este relatório julga a evidência da execução, não o gate estático, que é do `code-validator`.
- atrição: ids `CHK-TEST-*` em `HEAD:99-traceability.md` (registro da rodada 2) = 138; no junit desta execução = 140; em `tests/` = 140; em `99-traceability.md` atual = 140; `comm` HEAD→junit: nenhum id removido; junit→HEAD: CHK-TEST-0012-12 e CHK-TEST-0012-13 novos, ambos registrados em `97-changelog.md` 1.2.0 ("Migração de verificações existentes": 138 sem mudança, 0 modificados, 0 fundidos, 0 removidos, 2 acrescentados) — migrated: 0, removed: 0.
- T2: 84 ids de critério na etapa de requisitos; 82 com linha em `99-traceability.md` (127 linhas, 0 linhas sem `CHK`); NFR-0003 e NFR-0008 só em `98-divergences.md`, como nas rodadas anteriores; todo `CHK` referido existe em `tests/`, aparece no junit e no registro `TEST-*`; 0 verificações sem critério; CHK-TEST-0012-12 e -13 decidem NFR-0005 (estratégia 1.1.1, linha 177: `lap-contract`, "chaves do resultado são exatamente as de API-0001") e citam API-0001/API-0002 na mensagem, como ISSUE-08 admitia. Nível "Contrato de API" (linha 29) agora com as duas cláusulas provadas: presentes exatamente quando o pedido os trouxe, copiados sem interpretação; ausentes quando não.
- T3 sobre as duas verificações novas: CHK-TEST-0012-12 reprova se `startLap` (`src/lap.ts:123-124`) ou `buildResult` (`:278-279`) deixar de copiar um dos campos, copiar valor derivado ou normalizado (o padrão `ARCADE_ASSISTIDO`, a `setupVersion` publicada `realista-aluguel-4t-v4` de `src/physics.ts:98`, ou qualquer outro texto) ou acrescentar campo ao resultado — a fixture `SETUP_FIELDS` usa `REALISTA_ALUGUEL_4T` (literal do enum `SetupId`, `src/physics.ts:85`, diferente do padrão) e `contract-fixture-7.3.1` (texto que só existe no teste), o que distingue cópia de padrão ou derivação; CHK-TEST-0012-13 reprova se um pedido sem os campos produzir chave presente (`null`, `undefined` ou padrão) ou se a presença dos campos alterar `lapValidity`, `invalidReason`, `lapMs` ou `sectorMs` — as duas voltas comparadas usam o mesmo `autopilot()` e o mesmo limite `MAX_LAP_STEPS` (6000, via `completeLap`), comparáveis por I8. Fiéis a API-0001 1.1.0 (linhas 74-75: copiado sem interpretação; "padrão quando ausente" é regra do leitor, não valor escrito) e a API-0002 1.1.0 (linhas 44-45: "padrão: ausente"). Artefato observável (`getLapResult`); mensagens nomeiam NFR-0005 e o contrato; tempos inteiros em ms (sem igualdade de ponto flutuante); sem relógio, sem rede, sem ordem. Interação com CHK-TEST-0012-02 (chaves exatas de um resultado sem os campos) e CHK-TEST-0012-09 (`challengeNumber`): consistentes com os campos opcionais ausentes; ISSUE-11.
- T3 sobre os sorteados: `state.test.ts` (19 verificações) — CHK-TEST-0004-01 reprova se o limiar `COUNTDOWN_STEPS` de `src/lap.ts:177` ou a transição para `RUNNING` mudar; -04 e -18 se o ramo `COUNTDOWN` (`:175-178`) integrar o kart ou a contagem avançar em pausa; -12, -13, -14, -15 e -17 se `stepLap` deixar de devolver a própria sessão fora de `RUNNING` (`:180`) ou `elapsedMs` avançar em `PAUSED`; -09 e -10 se os setores forem arredondados separadamente do total ou alterados depois de completados; todas nomeiam o `AC-*` na mensagem; leituras de `lap.kart`, `lap.stepCount` e `lap.phase` são do registro `LapSession` que DES-0001 1.1.0 declara como fonte única imutável (linhas 29, 64, 80, 90), não símbolo privado; igualdades exatas em `x`, `z`, `heading` (linhas 65-67) e `deepEqual(after.kart, running.kart)` (-15) são identidade exigida por DES-0001 linha 64 ("o `kart` não é integrado") — mesma natureza de ISSUE-02. `layering.test.ts` (4 verificações estáticas) — reprovam se um módulo listado importar `three`, `./audio` ou `./main`, usar `Date`/`performance`/`Math.random`/temporizador, usar `fetch`/`localStorage`/etc., ou se `main.ts` voltar a `LapTracker` ou decidir motivo; `main.ts` passou a importar `./setupRecords` e `./handlingMessages` (`dirigibilidade`), fora das listas — ISSUE-12.
- T4: nenhuma verificação falhou; nada a classificar.
- T5: inalterado desde a rodada 1 — idempotência provada com o mesmo pedido repetido (CHK-TEST-0012-06, -07, -08, CHK-TEST-0007-11); RBAC, migração, offline e token não se aplicam (sem endpoint, papel, banco ou árvore nativa; API-0001/0002/0003; ISSUE-07).

## Failures

Nenhuma.

## Issues

### ISSUE-01
- severity: warning
- check: T3
- file: `tests/race-lap-validation-contract.test.ts`
- location: linha 107 (era 104; deslocada por `SETUP_FIELDS`), CHK-TEST-0012-07
- finding: mantida das rodadas 1 e 2 (linha inalterada; a rodada 3 declinou-a de forma registrada em `97-changelog.md` 1.2.0, "Itens declinados"): a asserção `assert.equal(getLapState(paused.lap).toString(), getLapState(paused.lap).toString(), ...)` compara `[object Object]` consigo mesma e nunca falha; a verificação continua decidindo AC-US-0003-08 pelas demais asserções (instantâneo JSON e `pauseCause`).
- expected: a asserção compara duas leituras por `deepEqual` ou é removida.

### ISSUE-02
- severity: warning
- check: T3
- file: `tests/race-lap-validation-crossing.test.ts`, `tests/race-lap-validation-state.test.ts`
- location: linha 30 (CHK-TEST-0002-03, `c.fraction === 1`); linhas 64-67 (CHK-TEST-0004-04, `kart.speed === 0`, `x`, `z`, `heading` iguais aos da largada) e linha 182 (CHK-TEST-0004-15, `deepEqual(after.kart, running.kart)`)
- finding: mantida das rodadas 1 e 2 (arquivos sem alteração desde 2026-10-21); o sorteio de `TEST-0004` nesta rodada acrescenta os locais 65-67 e 182, do mesmo tipo: igualdade exata sobre valores de ponto flutuante; todos são valores exatos exigidos pela especificação (fração 1 no cruzamento coincidente; velocidade 0 e posição de largada intacta ao sinal verde e estado intacto em pausa, DES-0001 1.1.0 linha 64 e `src/lap.ts:180`) e representáveis sem erro, por isso não bloqueiam.
- expected: tolerância explícita ou comentário fixando que o valor exato é o contrato.

### ISSUE-03
- severity: info
- check: T3
- file: `tests/race-lap-validation-frozen.test.ts`
- location: linha 59, CHK-TEST-0014-05
- finding: mantida das rodadas 1 e 2: fixa literalmente a linha 3 de `src/physics.ts`; `src/physics.ts` não mudou desde 2026-10-22T17:59Z e a linha 3 continua idêntica — a verificação passou; uma reformatação sem mudança de comportamento ainda a faria falhar; a fixação é nomeada por DES-0012 e o comportamento é decidido pelas demais asserções do mesmo check.
- expected: nenhuma ação nesta rodada; registrado para a próxima revisão de DES-0012.

### ISSUE-04
- severity: info
- check: T2
- file: `tests/race-lap-validation-validity.test.ts`; `300 Specs/330 D-Specs/Output/race-lap-validation/test-strategy.md`
- location: CHK-TEST-0005-11 (AC-US-0004-06); estratégia 1.1.1, linha 134
- finding: mantida das rodadas 1 e 2: a estratégia 1.1.1 (inalterada desde 2026-10-22T18:00Z) ainda descreve a excursão lateral de 10,5 m na linha 134, enquanto a verificação usa salto semeado (`seedLap`) para depois do marcador 2 com `markersPassedCount` 1 (changelog rodada 1); o critério segue decidido com estado semeado, recurso previsto na estratégia (linha 47).
- expected: a estratégia (dspec) atualiza a descrição da fixture de AC-US-0004-06 na próxima rodada que a tocar; nada a corrigir nos testes.

### ISSUE-05
- severity: info
- check: T2
- file: `tests/race-lap-validation-cut.test.ts`; `300 Specs/330 D-Specs/Output/race-lap-validation/test-strategy.md`
- location: CHK-TEST-0006-03, CHK-TEST-0006-04 (AC-US-0006-03); estratégia 1.1.1, linha 142
- finding: mantida das rodadas 1 e 2: a estratégia 1.1.1 ainda descreve "2 m além da borda por 600 passos" na linha 142; a verificação usa 1,5 m no autopilot (máximo medido 2,62 m, afirmado ≤ 3 m pelo oráculo) mais um kart parado a 2 m por 600 passos; o critério segue decidido.
- expected: nenhuma ação nos testes; registrado para a estratégia.

### ISSUE-06
- severity: info
- check: T1
- file: `500 Tests/Output/race-lap-validation/98-divergences.md`; `docs/lap-validation-device-log.md`
- location: níveis Web E2E e Mobile E2E; registro humano, Execuções 1 e 2 de 2026-10-21
- finding: mantida da rodada 2: `98-divergences.md` 1.0.0 (último toque 2026-10-21T14:15Z) e `docs/lap-validation-device-log.md` (2026-10-21T16:47Z) não mudaram; o registro dá E2E-03 como passa com entrada real, E2E-04, E2E-07, E2E-08 e E2E-09 como passa por evento ou filtro emulado ou na forma observável, E2E-01 e E2E-02 como parciais, E2E-05, E2E-06, E2E-10 e E2E-11 como não executados; `98-divergences.md` mantém as 27 linhas como não verificadas sem citar o registro; os níveis Web E2E e Mobile E2E continuaram sem execução nesta rodada de `npm test`, por ausência de ferramenta (declarada, não silenciosa).
- expected: a próxima rodada do gerador (ou o dono do registro) reconcilia `98-divergences.md` com o registro: fecha, citando a execução, só as linhas cujo roteiro passou com entrada ou tela reais (E2E-03; medidas da Execução 1 valem para `web-desktop`, não para o celular), e mantém abertas as decididas por evento emulado, página em segundo plano ou aparelho não nomeado; nenhuma linha é fechada por este relatório.

### ISSUE-07
- severity: info
- check: T5
- file: `500 Tests/Output/race-lap-validation/TEST-0012-contrato-da-volta.md`
- location: nota final (mantida em 1.1.0)
- finding: mantida das rodadas 1 e 2: verificações de acesso não autenticado, papel recusado, migração up/down, offline e falha de token não se aplicam: os contratos não definem endpoint, sessão, papel além de `player` anônimo, banco nem árvore móvel.
- expected: nenhuma ação.

### ISSUE-08
- severity: resolvida (era error; não conta)
- check: T2
- file: `tests/race-lap-validation-contract.test.ts`; `500 Tests/Output/race-lap-validation/TEST-0012-contrato-da-volta.md` 1.1.0; `97-changelog.md` 1.2.0
- location: CHK-TEST-0012-12 (linhas 157-166) e CHK-TEST-0012-13 (linhas 168-180); TEST-0012 tabela de verificações e linha de fixtures
- finding: resolvida como o relatório anterior pedia: id novo (dois, um por comportamento), `startLap` com `setupId` do enum e `setupVersion` literal do teste, volta completa, `getLapResult` devolve exatamente os dois valores sem interpretação, o mesmo pedido sem os campos dá resultado sem eles (`'setupId' in result === false`, `'setupVersion' in result === false`) e volta idêntica em validade, motivo, tempo e setores; mensagens nomeiam NFR-0005 e API-0001/API-0002; `97-changelog.md` 1.2.0 registra a adição como cobertura exigida pelo upstream movido (estratégia 1.1.1), não como superfície de rodada de correção (§16); a árvore atual (`src/lap.ts:23`, `:30-31`, `:54-55`, `:123-124`, `:278-279`, por `dirigibilidade` rodada 3) copia os campos literalmente e as duas verificações passam na execução fresca.
- expected: nenhuma ação.

### ISSUE-09
- severity: info
- check: T3
- file: `tests/race-lap-validation-track-data.test.ts`; `tests/fixtures/track-v1.json`
- location: CHK-TEST-0009-01 e CHK-TEST-0009-02 (NFR-0012)
- finding: mantida da rodada 2: `TRACK_SCHEMA_VERSION` continua `2` (`src/trackData.ts:5`), `src/track.ts:43` continua com o literal `2` e a fixture `track-v1.json` com `schemaVersion` 1; as verificações decidem NFR-0012 por inteiro hoje; quando `pista-kart-park` subir a constante para `3`, a parcela "100% dos arquivos de pista na versão anterior lidos sem erro" passará a exigir uma fixture na forma 2, que por I5 é da feature que sobe a versão.
- expected: nenhuma ação nesta feature; observação para a etapa de testes de `pista-kart-park`, não enviada como feedback por não exigir mudança no alvo agora.

### ISSUE-10
- severity: info
- check: T3
- file: `tests/helpers/autopilot.ts`; `tests/race-lap-validation-determinism.test.ts`; `src/main.ts`
- location: `autopilot.ts:17` e `:55` (`config: KartConfig = ARCADE_KART`); `main.ts:122` (`PUBLISHED_SETUPS.ARCADE_ASSISTIDO` como padrão) e `:226` (`startLap` com `setupId`/`setupVersion` do acerto corrente)
- finding: mantida da rodada 2: a aplicação inicia as voltas com `ARCADE_ASSISTIDO_V5` e, desde a rodada 3 de `dirigibilidade`, informa `setupId` e `setupVersion` em `startLap` (`main.ts:226`), enquanto toda volta da suíte roda com `ARCADE_KART` sem os campos (salvo CHK-TEST-0012-12/-13, que os informam de propósito); nenhuma verificação ficou tautológica nem vazia: a volta de referência de TEST-0008 é calculada na execução, nenhum `CHK` fixa tempo de volta ou setor em literal, e `src/lap.ts:126` congela a `config` recebida sem que regra alguma leia o preset.
- expected: nenhuma ação nesta rodada; exercitar as regras de volta também no acerto publicado como padrão é fixture nova a entrar pela estratégia ou por `SCOPE-BACKLOG.md`, não por rodada de correção.

### ISSUE-11
- severity: info
- check: T3
- file: `tests/race-lap-validation-contract.test.ts`
- location: linha 19, constante `RESULT_OPTIONAL` (`['challengeNumber', 'invalidReason', 'lapMs', 'sectorMs']`); CHK-TEST-0012-02, linha 44
- finding: a lista de campos opcionais do resultado usada pela fixture não nomeia `setupId` nem `setupVersion`, opcionais de API-0001 1.1.0 (linhas 74-75); não há reprovação falsa porque a linha 44 só percorre chaves de resultados de voltas iniciadas sem os campos, e CHK-TEST-0012-12 afirma o conjunto exato de chaves com eles em separado — a fixture apenas deixou de espelhar o contrato por inteiro.
- expected: a próxima rodada que tocar o arquivo acrescenta `setupId` e `setupVersion` a `RESULT_OPTIONAL`, sem alterar as asserções existentes.

### ISSUE-12
- severity: info
- check: T2
- file: `tests/race-lap-validation-layering.test.ts`; `src/main.ts`
- location: listas `SIMULATION` e `APPLICATION_PURE` (linhas 9-10) e CHK-TEST-0013-03 (NFR-0005, linha 44); `main.ts:3-4` (`./setupRecords`, `./handlingMessages`)
- finding: `main.ts` passou a importar dois módulos de `dirigibilidade` (`src/setupRecords.ts`, `src/handlingMessages.ts`) que não estão nas listas de CHK-TEST-0013-03, de modo que a parcela "0 requisições de rede" de NFR-0005 só é decidida para os módulos listados; `grep` dos símbolos `fetch`, `XMLHttpRequest`, `WebSocket`, `localStorage`, `sessionStorage`, `indexedDB`, `sendBeacon`, `Date`, `performance` e `Math.random` nos dois módulos é vazio hoje, e NFR-0005 continua decidida na árvore atual; por §14 as listas são desta feature e os módulos são de outra.
- expected: nenhuma ação nesta feature nesta rodada; a etapa de testes de `dirigibilidade` é quem prova a ausência de rede e armazenamento nos seus módulos; observação registrada aqui e não enviada como feedback por não exigir mudança no alvo agora.

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
