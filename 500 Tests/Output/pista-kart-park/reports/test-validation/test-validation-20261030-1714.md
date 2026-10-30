---
stage: test
feature: pista-kart-park
verdict: SUCCESS
generated: 2026-10-30T17:20:55Z
run: {collected: 437, passed: 432, failed: 5, skipped: 0, fresh: true, feature-scope: {collected: 102, passed: 102, failed: 0, skipped: 0}}
counts: {blocker: 0, error: 0, warning: 3, info: 1, divergence: 22}
checks: {before: 102, after: 102, migrated: 0, removed: 0}
seed: {revision: 1, digest: b5aa5be4734a}
round: 3
mode: revalidation
previous-report: reports/test-validation/test-validation-20261027-2333.md
run-artifacts: {junit: reports/junit-latest.xml, log: reports/npm-test-latest.log, measured: 2026-10-30T14:09:29-03:00, last-src-edit: src/main.ts 2026-10-30T13:46:48-03:00, last-feature-tests-edit: tests/pista-kart-park-layering.test.ts e -surface.test.ts 2026-10-30T14:07:20-03:00, newer-than-run: tests/modelo-kart-01-camera/-contract/-model.test.ts (outra feature)}
failures-attributed: 5 de modelo-kart-01 (camera 2, contract 2, model 1); 0 desta feature
population: [ISSUE-01..05 (relatório anterior); version movida: 97-changelog 1.1.0, 98-divergences 1.1.0, TEST-0003 1.0.1, TEST-0004 1.0.1, TEST-0005 1.1.0, TEST-0006 1.1.0, TEST-0007 1.1.0, TEST-0011 1.0.1 e as suítes lap, session, determinism, layering, surface + tests/helpers/kartParkPilot.ts; amostra aleatória: TEST-0012 + tests/pista-kart-park-publication.test.ts, TEST-0002 + tests/pista-kart-park-track-data.test.ts]
mutations-reproduced: [M1 (0005-04, -06, 0007-05), M4 (0005-03, 0007-05), M10 (0003-01, -02, -03), L1 maneuvers importa three (0011-01), L2 physics importa módulo novo com document (0011-01), L3 physics com import './audio' (nenhuma reprova)]
testing-report: none
feedbacks: []
---

# Relatório de validação de testes — pista-kart-park, rodada 3 (revalidação após treino de voltas seguidas, acerto v6 e retirada do drift/turbo)

## Verification status

- execução: junit e log de 14:09:29 −03:00, posteriores à última edição de `src/` (13:46:48), das 12 suítes da feature (14:07:20) e de `tests/helpers/kartParkPilot.ts` (14:02:40); só as suítes de `modelo-kart-01` mudaram depois da execução
- feature: 102 `<testcase>` nas 12 suítes `tests/pista-kart-park-*.test.ts`, 102 passam, 0 reprovam, 0 pulados; as 5 reprovações do junit são de `modelo-kart-01` e não contam
- atrito: 102 ids antes (junit de HEAD d9139a2) = 102 agora = 102 em `99-traceability.md`; nenhum ausente; 9 modificados com linha de Migração em `97-changelog.md`
- critérios verificados em `npm test`: todos os da matriz (83 linhas); unverified: as 22 linhas de aparelho de `98-divergences.md` (DIV-01..22); cobertos só por skip: 0
- voltas: CHK-TEST-0005-01/-02/-03/-06/-08/-10 e CHK-TEST-0007-05 leem cada volta pelo crescimento de `listLapResults` (`drive` para nesse passo); CHK-TEST-0005-04 e CHK-TEST-0007-05 afirmam corte `INVALID`/`CUT` com fase `RUNNING` e nenhum item; `ENDED` só aparece por `endTraining` (CHK-TEST-0007-05) e como parada da fixture
- camadas: `SIMULATION = reachedBy(SIMULATION_ROOTS)` inclui hoje `src/maneuvers.ts` via `src/physics.ts`; reprova num import nomeado de `three` (L1) e num módulo novo alcançado que usa `document` (L2); ver ISSUE-07
- zebra: CHK-TEST-0003-01/-02 medem as razões 0,85 sobre `PUBLISHED_SETUPS` (`arcade-assistido-v6`) e o literal v5; M10 reproduzida
- mutações: as 10 do changelog cobrem as 9 verificações reescritas; M1, M4 e M10 reproduzidas numa cópia de rascunho com o mesmo resultado registrado
- amostra aleatória (T3): TEST-0012 ↔ `publication.test.ts` e TEST-0002 ↔ `track-data.test.ts`: toda afirmação nomeia o critério, sem igualdade de ponto flutuante, sem relógio, rede ou ordem

## Failures

(nenhuma desta feature)

## Issues

### ISSUE-01
- severity: warning
- check: T3
- status: mantida (declinada no changelog com o motivo do relatório anterior)
- where: `tests/pista-kart-park-screens.test.ts` CHK-TEST-0009-01/-04/-05/-08/-10, `tests/pista-kart-park-feedback.test.ts` CHK-TEST-0008-08, `tests/pista-kart-park-layering.test.ts` CHK-TEST-0011-01..07
- defect: as afirmações sobre `src/main.ts`, `index.html` e os módulos são textuais; a presença do texto não prova que o ramo executa (I9).
- expected: manter como guarda de camada e de ligação (nível "texto" da estratégia), sem contar como prova do comportamento de tela.

### ISSUE-02
- severity: info
- check: T2
- status: resolvida (`98-divergences.md:68` nomeia `REQ-FEAT-0007-12, NFR-0011` com o fato do manifesto de código)

### ISSUE-03
- severity: warning
- check: T4
- status: resolvida (`98-divergences.md:22` CHK-TEST-0004-03 `passing` com `src/physics.ts:372`, commit 1a12076; linha 29 sem citar defeito)

### ISSUE-04
- severity: info
- check: T3
- status: resolvida (TEST-0004, coluna "o que a faria falhar" de CHK-TEST-0004-05 registra que não depende da resposta)

### ISSUE-05
- severity: info
- check: T1
- status: mantida
- where: `98-divergences.md` seção de aparelho; `test-strategy.md`
- defect: o registro humano do aparelho (`docs/kart-park-device-log.md`) não existe; as 22 linhas ficam `unverified`.
- expected: a etapa de deploy nomeia o registro e o roteiro E2E-01..E2E-08 é executado por um humano antes da promoção.

### ISSUE-06
- severity: warning
- check: T4
- status: nova
- where: `300 Specs/330 D-Specs/Output/pista-kart-park/test-strategy.md:94` (AC-US-0003-06) ↔ `tests/pista-kart-park-lap.test.ts` CHK-TEST-0005-03
- defect: a estratégia decide AC-US-0003-06 por `describeLap` sobre o estado da volta, impossível no treino contínuo (DES-0004: o marcador pulado só é decidido no fechamento e o estado de uma volta `TRAINING` nunca carrega `MISSED_MARKER`); a verificação decide por `describeTrainingResult` sobre o item de `listLapResults`, que é a função do painel de resultado (`src/main.ts:467`, ADR-0007) — leitura fiel ao critério ("a tela exibe o motivo"), não lacuna de cobertura.
- expected: a próxima rodada do D-Spec de pista-kart-park reescrever a linha 94 da estratégia para `describeTrainingResult` sobre o item de `listLapResults`; nenhuma mudança de teste.

### ISSUE-07
- severity: warning
- check: T3
- status: nova
- where: `tests/pista-kart-park-layering.test.ts:16` (`imports`) usado por `reachedBy` e por CHK-TEST-0011-01/-06
- defect: `imports` só lê `from '...'`; um import de efeito colateral (`import './audio';` em `src/physics.ts`, mutação L3) não entra no grafo nem na proibição de camada externa, e as 7 verificações passam.
- expected: o leitor de importações também capturar `import '...'` (e `import('...')`), de modo que L3 reprove CHK-TEST-0011-01.

## Divergences

- DIV-01..22: as 22 linhas de aparelho de `98-divergences.md` (AC-US-0001-01, -02, -05; AC-US-0002-08; AC-US-0003-06, -11; AC-US-0004-06; AC-US-0005-03, -07..-12; AC-US-0006-01..-08; NFR-0002; NFR-0004; NFR-0005; NFR-0012; REQ-FEAT-0001-13; REQ-FEAT-0007-12/NFR-0011), estado `unverified`/`n/a`, regra provada em `npm test`, metade de aparelho devida ao roteiro humano nomeado pela etapa de deploy; nenhuma contribui para o veredito.
