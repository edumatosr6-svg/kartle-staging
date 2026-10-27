---
stage: code
feature: dirigibilidade
verdict: SUCCESS
generated: 2026-10-27T18:29:17Z
counts: {blocker: 0, error: 0, warning: 0, info: 0, divergence: 1}
seed: {revision: 3, digest: 7dd24c8b6cab}
upstream: {stage: dspec, version: 3.1.0, status: validated, report: dspec-validation-20261027-1803}
feedbacks: []
files_examined: 14
population: "rodada 4 (Mode B), primeira validação de código da feature (sem relatório anterior; a rodada 3 terminou FAIL SPEC em feedback-20261027-1619, SPEC-ISSUE-03 resolvido pelo projeto 5.1.0 com DOMAIN/DEC-14); arquivos do manifesto com version movida: 01-implementation.md 2.1.0, 97-changelog.md 2.1.0, 98-divergences.md 2.1.0, core/DES-0004 2.1.0 (00-index.md e 99-traceability.md gerados pelo gate); fonte alterada nesta rodada: scripts/handlingBench.ts (referenceCornerBench :265-291) e docs/physics.md (seção v5 :196-281 e entrada arcade-assistido-v5 do bloco handling-baseline, reduzida por script: 46 registros, 46 PASS, measuredAtUtc 2026-10-27T18:18:17Z); invariantes: src/physics.ts :49-83 (RENTAL_KART, ARCADE_KART, ARCADE_ASSISTIDO_V5 contra a tabela de docs/physics.md :234-248), src/lap.ts (citações :3, :23, :30-31, :54-55, :123-124, :278-279; mtime 2026-10-27 12:55, anterior à rodada), src/setupRecords.ts e scripts/keyboard-lap.ts (citações das divergências C e 15); dois intocados sorteados: src/main.ts (:122, :158-160, :167, :217, :226, :247, :272, :387, :429, :502) e index.html (:25); npm run bench:handling executado e reduzido por grep/contagem (46 registros, 46 PASS, 0 FAIL; REFERENCE_CORNER THROTTLE_ZERO maxUndersteerMs 125, offAsphaltStepCount 61, offAsphaltFirstStep 240 nos dois modos); REQ-FEAT-* do projeto (62) contra 99-traceability.md e o manifesto por script; 50 citações símbolo/linha de handlingBench.ts, physics.ts, setupRecords.ts e keyboard-lap.ts conferidas por script; grep de importações proibidas (D-CD-02), relógio e sorteio, TODO/console/debugger e segredos"
context-ignored: "nenhuma justificativa do gerador chegou pela invocação; 97-changelog.md e a seção Decisões de implementação de 01-implementation.md foram lidos como conteúdo do manifesto, não como justificativa; a suíte de testes não foi reexecutada (a afirmação verificável do manifesto, 46/46 PASS no bench, foi verificada diretamente)"
---

# Relatório de validação de código — dirigibilidade (rodada 4)

## Summary

Verificações C1–C10 e D-CD-01 a D-CD-07 sobre a população acima: nenhum `blocker` ou `error`; a mudança da rodada 4 (`scripts/handlingBench.ts:280-281`, acumulação de `understeer` só com `exit` indefinido) realiza DES-0004 5.1.0 / API-0003 3.4.0 / `DOMAIN/DEC-14` sem outro efeito, e os presets, `src/lap.ts`, `tests/`, `package.json` e `tsconfig.json` ficaram intactos.
O bench executado nesta validação reproduz 46/46 `PASS` com os mesmos valores da entrada `arcade-assistido-v5` de `docs/physics.md`; uma divergência herdada do projeto (linha D) continua `open`, devida ao estágio de testes.

## Issues

Nenhum `ISSUE-<nn>`.

## Divergences

- id: DIV-D
- severity: divergence
- check: C10 / D-CD-07
- file: `400 Code/Output/dirigibilidade/98-divergences.md`
- location: linha D (REQ-FEAT-0005-07, REQ-FEAT-0006-03 e a prova em `npm test` de todo ensaio; AC-US-0004-06, AC-US-0005-05)
- finding: linha `open` com motivo (os registros `STEP_CONTRACT`, `REALISTA_UNCHANGED`, `DETERMINISM` e os demais na saída de `npm test`, e `docs/handling-device-log.md`, são do estágio de testes e da evidência humana); a biblioteca produz todos os registros (`scripts/handlingBench.ts:762-798`) e os benches os imprimem (`scripts/keyboard-lap.ts:54-62`, `scripts/physics-bench.ts:45`).
- expected: fechada pelo estágio de testes (test-strategy), não por este estágio; permanece `open` sem bloquear o veredito.

Linhas `resolved` verificadas no código: A (`scripts/handlingBench.ts:337-399`, `:313-330`, `:698-707`), B (`:268-291`, `:280-281`, `:693-697`; medido 125 ms / 61 / 240), C (`src/lap.ts:3,23,30-31,54-55,123-124,278-279`; `src/setupRecords.ts:92-93,109-112`; `src/main.ts:226`; `scripts/handlingBench.ts:499`; `scripts/keyboard-lap.ts:25-26`) e 1–16 da rodada 2 (símbolos e linhas conferidos por script).

## Coverage

- requisitos com código: 62/62 `REQ-FEAT-*` do projeto presentes em `99-traceability.md` e nos registros do manifesto (0 ausentes, 0 extras).
- requisitos sem código: nenhum.
- arquivos alterados não registrados: nenhum (a árvore alterada nesta rodada é `scripts/handlingBench.ts` e `docs/physics.md`, ambos na tabela D-CD-01 de `01-implementation.md`; `src/lap.ts`, `src/setupRecords.ts`, `src/main.ts`, `scripts/keyboard-lap.ts` com mtime da rodada 3 e `tests/`, `package.json`, `tsconfig.json`, `src/physics.ts` anteriores).
- invariantes: `ARCADE_ASSISTIDO_V5` (`src/physics.ts:73-83`), `ARCADE_KART` (`:61-69`) e `RENTAL_KART` (`:49-58`) iguais aos valores da tabela de `docs/physics.md:234-248` e do manifesto; `src/lap.ts` intacto (NFR-0008); D-CD-02: `src/track.ts`, `src/physics.ts`, `src/maneuvers.ts` e `scripts/handlingBench.ts` sem `three`, DOM, `audio`, `main`, `Date`, `performance.now` ou `Math.random` (`handlingBench.ts` importa só `node:fs` e `../src/*`); C3: `ReferenceCornerRecord` com exatamente os campos de API-0003 3.4.0 (`throttleCondition`, `arcRadiusM`, `laneWidthM`, `maxUndersteerMs`, `offAsphaltStepCount`, `offAsphaltFirstStep?`, `offAsphaltFirstXM?`, `offAsphaltFirstZM?`, `entrySpeedMps`); C2: a janela de `maxUndersteerMs` com `THROTTLE_ZERO` fecha no passo anterior a `offAsphaltFirstStep` (`exit` definido no passo da saída antes da acumulação, `:276-281`), a execução percorre os 300 passos, `offAsphaltStepCount` conta a janela inteira, `judge` inalterado (`OFF_ASPHALT` só com `THROTTLE_FULL`, `:695`); `understeerOnset` encerra no passo da saída antes da acumulação (`:350`), coerente com `DEC-14` na linha `#`; C9: nenhum TODO, `console.log`, `debugger` ou código comentado em `scripts/handlingBench.ts`; nenhum segredo (D-CD-06).
