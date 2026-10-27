---
stage: test
feature: pista-kart-park
verdict: SUCCESS
generated: 2026-10-27T23:37:28Z
run: {collected: 398, passed: 398, failed: 0, skipped: 0, fresh: true}
counts: {blocker: 0, error: 0, warning: 2, info: 3, divergence: 22}
checks: {before: 102, after: 102, migrated: 0, removed: 0}
seed: {revision: 1, digest: b5aa5be4734a}
round: 2
mode: revalidation
previous-report: reports/test-validation/test-validation-20261027-2307.md
run-artifacts: {junit: reports/junit-latest.xml, log: reports/npm-test-latest.log, measured: 2026-10-27T20:32:51-03:00, last-src-edit: src/physics.ts 2026-10-27T20:24:10-03:00 (commit 1a12076), last-tests-edit: tests/pista-kart-park-screens.test.ts 2026-10-27T19:56:54-03:00}
code-validation: 400 Code/Output/pista-kart-park/reports/code-validation/code-validation-20261027-2327.md (SUCCESS)
population: [FAIL-01, ISSUE-01..05 (relatório anterior); arquivos com version movida: nenhum; amostra aleatória: TEST-0005-volta-na-kart-park.md + tests/pista-kart-park-lap.test.ts, TEST-0009-credito-nome-e-seletor-nas-telas.md + tests/pista-kart-park-screens.test.ts; lidos para FAIL-01: src/physics.ts:339-355,364-386, tests/pista-kart-park-barrier.test.ts:79-85]
testing-report: none
feedbacks: []
---

# Relatório de validação de testes — pista-kart-park, rodada 2 (revalidação após FAIL CODE)

## Verification status

- execução: `junit-latest.xml` e `npm-test-latest.log` de 20:32:51 −03:00, posteriores à última edição de `src/` (`src/physics.ts` 20:24:10, correção de FAIL-01) e de `tests/` (19:56:54); 398 coletados, 398 passam, 0 reprovam, 0 pulados, 0 `<failure`, 0 `<skipped`
- verificações da feature: 102 ids `CHK-TEST-*` nos 12 registros `TEST-*`, 102 `test(` nas 12 suítes `tests/pista-kart-park-*.test.ts`, 102 `<testcase>` com `file=` nessas 12 suítes no junit, cada id uma vez, conjuntos idênticos nos três lugares (os demais 296 casos do junit pertencem a `dirigibilidade`, `modelo-kart-01` e `race-lap-validation`, que partilham a numeração `CHK-TEST-*`)
- atrito: 102 antes, 102 agora, nenhum id ausente, nenhuma migração nem remoção (suítes sem edição desde a rodada 1)
- critérios verificados em `npm test`: todos os da matriz `99-traceability.md` (83 linhas), incluindo AC-US-0004-04 agora inteiro (CHK-TEST-0004-02 nas velocidades alcançáveis e CHK-TEST-0004-03 a 60 e 200 m/s); unverified: as 22 linhas de aparelho de `98-divergences.md` (20 `unverified` + 2 `n/a`, DIV-01..22), devidas ao roteiro humano E2E-01..E2E-08 nomeado pela etapa de deploy; cobertos só por um skip: 0
- FAIL-01 (rodada 1) resolvido pelo motivo certo: `src/physics.ts:372` `startSideNormal = sSide >= 0 ? −leftOfAB : leftOfAB` aponta agora para o lado de `s` (`leftOfAB` é o lado de orientação negativa); no ramo do trajeto (`:375-378`) `m = startSideNormal`, o bloco (`:345-347`) recoloca o kart em `q + m·0,1` do lado de origem e usa `n = −m`, logo `outgoing = v·n > 0` para qualquer velocidade dirigida à barreira e a resposta do muro dispara (`barrierHit`); CHK-TEST-0004-03 (8 lançamentos, 60 e 200 m/s, 90° e 30°, dos dois lados, 0,486 s) passa com 0 cruzamentos; o ramo de proximidade (`:380-383`) não mudou e CHK-TEST-0004-02/-04/-05 continuam passando
- amostra aleatória (T3): TEST-0005 ↔ `lap.test.ts` (12 checks: toda afirmação nomeia o critério; sem igualdade de ponto flutuante fora de sentinelas 0; volta de referência calculada uma vez e só lida; sem relógio, rede ou ordem) e TEST-0009 ↔ `screens.test.ts` (10 checks: regras puras com mensagem de critério; afirmações textuais sobre `main.ts`/`index.html` já cobertas por ISSUE-01); nenhuma tautologia encontrada

## Failures

(nenhuma)

## Issues

### ISSUE-01
- severity: warning
- check: T3
- status: mantida (arquivos sem alteração desde a rodada 1)
- where: `tests/pista-kart-park-screens.test.ts` CHK-TEST-0009-01/-04/-05/-08/-10, `tests/pista-kart-park-feedback.test.ts` CHK-TEST-0008-08, `tests/pista-kart-park-layering.test.ts` CHK-TEST-0011-01..07
- defect: as afirmações sobre `src/main.ts`, `index.html` e os módulos são textuais (presença/ausência de trechos como `renderCredit($('track-credit'), ...)`, `chooseTrack(OPENING_TRACK_ID)`, `audio.curb(`); um refactor que preserva o comportamento reprova e a presença do texto não prova que o ramo executa (I9).
- expected: manter como guarda de camada e de ligação (a estratégia 1.0.1 nomeia o nível "texto"), com a regra de tela provada pelas funções puras e a tela pelo roteiro E2E; não contar como prova do comportamento de tela.

### ISSUE-02
- severity: info
- check: T2
- status: mantida (o gerador não correu nesta rodada; `99-traceability.md` e `98-divergences.md` sem alteração)
- where: `99-traceability.md` (83 linhas), `98-divergences.md` linha REQ-FEAT-0007-12
- defect: NFR-0002 e NFR-0011 não constam da matriz; NFR-0011 aparece só como `REQ-FEAT-0007-12` n/a, sem nomear o próprio `NFR-0011`.
- expected: na próxima rodada de gerador da feature (Modo B/C), a linha de NFR-0011 em `98-divergences.md` nomear `NFR-0011` e o fato que o decide (manifesto de código: `6ea3862` descendente de `b86b200`); NFR-0002 permanece só no aparelho (DIV-17).

### ISSUE-03
- severity: warning
- check: T4
- status: reclassificada de info para warning (o registro agora contradiz a execução)
- where: `98-divergences.md` linha 22 (CHK-TEST-0004-03, colunas "Estado" e "Causa no código") e linha 29 (observação para o projeto)
- defect: a linha mantém o estado **failing** e a causa "ramo de proximidade recoloca o kart do lado oposto ... zigue-zague da poligonal", mas a verificação passa nesta execução (398/398) e a causa real foi o ramo do trajeto com `startSideNormal` invertida, corrigida em `src/physics.ts:372` (commit 1a12076, FAIL-01 da rodada 1); a linha 29 ainda apresenta a poligonal como "condição do defeito de CHK-TEST-0004-03".
- expected: estado da linha 22 passar a `passing` com a causa e a correção registradas (`src/physics.ts:372`, commit 1a12076), e a linha 29 ficar só como observação de qualidade para o D-Spec sem citar CHK-TEST-0004-03 como defeito; não bloqueia (nenhum critério fica unverified por isso), devida à próxima rodada de test-generator da feature ou ao feedback da etapa de deploy.

### ISSUE-04
- severity: info
- check: T3
- status: mantida
- where: `tests/pista-kart-park-barrier.test.ts` CHK-TEST-0004-05; `97-changelog.md` mutação B
- defect: com o bloco da barreira desligado só -02 e -04 reprovam; -05 continua passando porque `barrierTouching`/`barrierContact` também nascem da proximidade de 0,11 m no fim do passo (`src/physics.ts:409-411`).
- expected: manter; a resposta é decidida por -02 e -04; registrar na coluna "o que a faria falhar" de TEST-0004 que -05 não depende da resposta.

### ISSUE-05
- severity: info
- check: T1
- status: mantida
- where: `98-divergences.md` seção de aparelho; `test-strategy.md` 1.0.1
- defect: o arquivo que a estratégia nomeia para o registro humano (`docs/kart-park-device-log.md`) não existe e este estágio não o cria (conventions §14); as 22 linhas ficam `unverified` até a etapa de deploy.
- expected: a etapa de deploy nomeia o registro e o roteiro E2E-01..E2E-08 é executado por um humano antes da promoção; nenhuma ação deste estágio.

## Divergences

- DIV-01..22: as 22 linhas da seção "Critérios cuja metade de tela, aparelho, som, vibração, navegador ou rede só é verificável pelo roteiro registrado" de `98-divergences.md` (AC-US-0001-01, -02, -05; AC-US-0002-08; AC-US-0003-06, -11; AC-US-0004-06; AC-US-0005-03, -07, -08, -09, -10, -11, -12; AC-US-0006-01 a -06; AC-US-0006-07/-08; NFR-0002; NFR-0004; NFR-0005; NFR-0012 segunda linha; REQ-FEAT-0001-13; REQ-FEAT-0007-12), estado `unverified`/`n/a`, regra provada em `npm test` pelos ids citados, metade de aparelho devida ao registro humano nomeado pela etapa de deploy; nenhuma contribui para o veredito.
