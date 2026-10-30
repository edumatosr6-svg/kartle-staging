---
stage: code
feature: pista-kart-park
verdict: SUCCESS
generated: 2026-10-30T18:38:00Z
counts: {blocker: 0, error: 0, warning: 1, info: 2, divergence: 2}
seed: {revision: 1, digest: b5aa5be4734a}
upstream: {stage: dspec, version: 1.3.0}
files_examined: 19
feedbacks: []
previous: "code-validation-20261030-1826.md (FAIL, 0/2/1/2/2); ISSUE-01 e ISSUE-02 fechados; ISSUE-03 fechado salvo um ponteiro (ISSUE-03 abaixo); ISSUE-04 a ISSUE-08 mantidos"
population: "revalidação (§8): as oito entradas do relatório anterior; arquivos com version movida (01-implementation 1.4.0, 97-changelog 1.4.0, 98-divergences 1.4.0, core/DES-0003 1.2.0, web/DES-0007 1.3.0, web/DES-0008 1.1.0; 00-index e 99-traceability do gate); fonte sem mudança desde a iteração 1 (mesmo diff em index.html, src/main.ts, src/style.css); dois intocados sorteados (semente 20261030-1836): pipeline/DES-0010, security/DES-0012"
---

# Relatório de validação de código — pista-kart-park (rodada 4, iteração 2)

## Summary

- A iteração 2 mexeu só no manifesto. As linhas 4, 5, 6 e 11 de `98-divergences.md`, `core/DES-0003` 1.2.0, `01-implementation.md` 1.4.0 e `web/DES-0007`/`web/DES-0008` agora descrevem o `src/physics.ts` de 440 linhas, sem `onRoad` e sem cancelamento da manobra, e os `arquivo:linha` conferem com a árvore.
- Portão: `tsc` 0; `track verify kart-park 1` `VERIFIED` com o arquivo intacto (SHA-256 `04ce5e51…`); suíte 442/443, com só `CHK-TEST-0009-04` reprovada (estágio de testes). Resta um aviso de ponteiros deslocados. SUCCESS.

## Issues

### ISSUE-01
- severity: fechado (era ISSUE-01, error)
- check: C10
- file: `400 Code/Output/pista-kart-park/98-divergences.md`
- location: linhas 4 e 5
- finding: a linha 4 cita `:158-161`, `:254-258`, `:272-276`, `:295` e `:401-422`, e diz que a linha "manobra" é sem mudança desta feature porque a manobra já saiu em `cfad3dc`. A linha 5 cita `:182`, `:186-188`, o bloco da barreira `:332-348` (resposta 1,12/0,65, sem cancelamento), `barrierContactPoint` `:359-375` (`startSideNormal` `:364`) e o toque `:392-396`. Tudo confere com a árvore.
- expected: atendido.

### ISSUE-02
- severity: fechado (era ISSUE-02, error)
- check: C1
- file: `core/DES-0003` 1.2.0, `01-implementation.md` 1.4.0, `97-changelog.md` 1.4.0
- location: `core/DES-0003:13-19`, `:46-50`; `01-implementation.md:43-44`, `:58-64`, `:118`; `97-changelog.md:216`
- finding: os três registros dizem que `src/physics.ts` tem 440 linhas depois de `cfad3dc` de `dirigibilidade` e que os trechos de drift já foram retirados. Os 481 linhas aparecem só como dado da rodada 3 e `onRoad` não é mais listado. Os ponteiros conferidos estão certos: muro `:318-331`, `step` `:376`, `getHandlingTelemetry` `:431`, rolamento `:251`, telemetria `:26`/`:118`, `src/trainingSession.ts:72-74`.
- expected: atendido.

### ISSUE-03
- severity: warning
- check: C10
- file: `400 Code/Output/pista-kart-park/98-divergences.md`, `security/DES-0012`
- location: linha 6 (`src/lap.ts:264`); `security/DES-0012`, linhas REQ-FEAT-0006-12 (`src/lapMessages.ts:80-84`) e REQ-FEAT-0007-05 (`src/main.ts:14`)
- finding: os símbolos existem e fazem o que a linha exige, mas três ponteiros seguem deslocados: `evaluateCut` com `trackEdgeDistanceM` está em `src/lap.ts:330-331`, `OSM_CREDIT` em `src/lapMessages.ts:105-109` e o `import ... kart-park-v1.json?raw` em `src/main.ts:13`.
- expected: atualizar esses `arquivo:linha` para a árvore corrente.

### ISSUE-04
- severity: info
- check: C2
- file: `src/main.ts`, `index.html`, `src/style.css`
- location: `index.html:26`; `src/main.ts:478-484`, `:488-516`, `:213-223`; `src/style.css:8`
- finding: ADR-0007 continua realizado, com a fonte igual à da iteração 1: `#lap-training-result-credit` é o último filho do painel e é desenhado no mesmo ramo do redesenho; não há crédito na sintética; `#lap-result-credit` foi retirado; o link usa `setAttribute` e `pointer-events:auto`; nada é gravado e não há rede.
- expected: atendido.

### ISSUE-05
- severity: info
- check: C9
- file: `src/physics.ts`
- location: `:332-348`, `:376-397`
- finding: nota entre features: os trechos de drift que o changelog do projeto atribui a `dirigibilidade` já não estão na árvore e nenhuma sobra é desta feature. Nenhum feedback.
- expected: atendido.

### ISSUE-06
- severity: divergence
- check: C10
- file: `400 Code/Output/pista-kart-park/98-divergences.md`
- location: linha 15; seção "Verificações desta feature reprovadas pela rodada 4"
- finding: `CHK-TEST-0009-04` reprova porque ainda afirma `#lap-result-credit`; é a migração planejada para o estágio de testes. A suíte dá 443 / 442 / 1.
- expected: o estágio de testes migra a verificação para `#lap-training-result-credit`.

### ISSUE-07
- severity: divergence
- check: C10
- file: `400 Code/Output/pista-kart-park/98-divergences.md`
- location: linhas 12 e 13
- finding: continuam abertas, a 12 no estágio de testes e a 13 no de deploy.
- expected: fechadas nas etapas respectivas.

### ISSUE-08
- severity: fechado
- check: C2, C10
- file: `src/physics.ts`, `scripts/trackPrep.ts`, `src/trainingSession.ts`, `src/trackGeometry.ts`
- location: `:364`; `scripts/trackPrep.ts:12-15`; `src/trainingSession.ts:81`; `src/trackGeometry.ts:57`, `:85`, `:269`, `:282`
- finding: sem mudança desde a iteração 1.
- expected: atendido.

## Divergences

- `98-divergences.md` #12: open (estágio de testes).
- `98-divergences.md` #13: resolved no código, open no deploy.
- `98-divergences.md` #15: open (estágio de testes).
- `98-divergences.md` #4, #5, #6, #11, #14: resolved; código conferido (para o ponteiro de `src/lap.ts` da linha 6, ver ISSUE-03).

## Coverage

- requisitos com código: todos os `REQ-FEAT-*`, como no relatório anterior; ADR-0007 em `src/main.ts:478-484` e `index.html:26`.
- requisitos sem código: nenhum.
- arquivos tocados sem registro: nenhum. Desde a iteração 1 só mudaram registros do manifesto; `src/tracks/`, `tracks/`, `tests/` e `scripts/` estão sem mudança.
- portão: `npx tsc --noEmit -p .` 0; `npm run track -- verify kart-park 1` `VERIFIED`, SHA-256 `04ce5e51…` igual; `npx tsx --test tests/*.test.ts` 443 / 442 / 1 (`CHK-TEST-0009-04`).
- amostras intocadas: `pipeline/DES-0010` (`smooth` `:95`, `prepareTrack` `:181`, `COUNTER_CLOCKWISE` `:188`/`:267`, `serializeTrackFile` `:380`) e `security/DES-0012` (`src/main.ts:669`, `scripts/track-pipeline.ts:48-56`, `src/trainingSession.ts:12-16`). Os símbolos existem; os ponteiros deslocados estão em ISSUE-03.
- status: `status: validated` carimbado nos registros do manifesto que estavam `draft`.
