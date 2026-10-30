---
stage: code
feature: dirigibilidade
verdict: SUCCESS
generated: 2026-10-30T16:13:31Z
counts: {blocker: 0, error: 0, warning: 3, info: 0, divergence: 2}
seed: {revision: 6, digest: dbf86f325606}
upstream: {stage: dspec, version: 4.1.0, status: validated, report: dspec-validation-20261030-1530}
feedbacks: []
files_examined: 22
population: "rodada 6 (Mode B), re-validação contra code-validation-20261030-1413 (0 issues; DIV-14 e DIV-R reverificadas primeiro); arquivos do manifesto com version movida ou novos: 01-implementation.md 3.1.0, 97-changelog.md 3.1.0 (seção da rodada 6), 98-divergences.md 3.1.0, web/DES-0005 2.0.1, web/DES-0007 1.3.0, web/DES-0009 1.0.0 (novo); 00-index.md e 99-traceability.md gerados pelo gate; fonte alterada nesta rodada (git diff HEAD -- index.html src): index.html, src/main.ts, src/style.css; dois intocados sorteados (random.sample sobre os oito inalterados do manifesto): scripts/keyboard-lap.ts e src/lapMessages.ts; projeto: DES-0009, DES-0007, ADR-0006 (contexto e decisão), 400 Code/Input/domain-directives.md (D-CD-01 a D-CD-07)"
evidence: "diff de index.html, src/main.ts e src/style.css só remove: #welcome sem o <h2>, a frase do drift com o <br /> e ' · Espaço + curva para drift'; .control-hint 'Dirigir'; .maneuver-guide retirada; <button data-control=drift> retirado de .touch-controls; '|| touch.has(drift)' e as duas linhas driftButton retiradas; regras .maneuver-guide (cinco e a de @media(max-width:700px)) e .touch-controls button[data-control=drift] retiradas; .welcome h2 e .touch-controls button:disabled mantidas como o projeto manda; .actions e #lap-end-training idênticos ao HEAD; grep -inE 'drift|turbo|impulso|combo|Espa[cç]o' em index.html e src/style.css: 0 ocorrências; em src/main.ts só :549 (drift: keys.has(' ')), :595 (tricks.drifting das marcas de pneu), :617 e :622 (turboActive da câmera), estas três de modelo-kart-01 sob a janela de ADR-0006 e sempre falsas porque State.maneuvers fica em initialManeuvers(); src/physics.ts não lê Input.drift (só o tipo em :9 e o comentário de :382), src/lap.ts e src/trainingSession.ts não o leem, src/setupRecords.ts só valida e copia o campo do replay; nenhum consumidor de .maneuver-guide, .control-hint ou data-control=drift em src/ ou tests/; npx tsc --noEmit -p . saída 0 sem saída; npx tsx --test tests/*.test.ts reduzido por script: 432 testes, 422 pass, 10 fail, os 10 identificados pelo nome: pista-kart-park CHK-TEST-0005-01/-02/-03/-04/-06/-08/-10 (tests/pista-kart-park-lap.test.ts), CHK-TEST-0006-03 (pista-kart-park-determinism), CHK-TEST-0007-05 (pista-kart-park-session) e dirigibilidade CHK-TEST-0008-03 (tests/dirigibilidade-setup-version.test.ts), nenhum de race-lap-validation; 68/68 REQ-FEAT-* do projeto em 99-traceability.md (comm vazio); citações arquivo:linha de 98-divergences.md, 01-implementation.md e dos registros web/ conferidas na árvore"
context-ignored: "a descrição da tarefa sobre o que a rodada mudou foi usada só para delimitar a população; as afirmações do manifesto e do 97-changelog (inclusive 'os mirrors tocados citam as linhas da árvore de 2026-10-30') foram verificadas na árvore, não aceitas"
---

# Relatório de validação de código — dirigibilidade (rodada 6)

## Summary

C1–C10 e D-CD-01 a D-CD-07 sobre a população acima: nenhum `blocker` nem `error`; três `warning` de citação vencida no manifesto.
Duas linhas `open` (14 e R); a linha R tem a dependência já satisfeita na árvore (ISSUE-03).

## Issues

- id: ISSUE-01
- severity: warning
- check: C10 / D-CD-07
- file: `400 Code/Output/dirigibilidade/98-divergences.md`
- location: linha 10 da tabela (`src/main.ts:512 (laço sem prêmio)`)
- finding: `src/main.ts:512` é o ramo `else` de `renderResult`; o laço de passos sem prêmio existe e foi conferido em `src/main.ts:553-566` (`lap = stepLap(lap, input)` em `:554`), deslocado pela rodada de `race-lap-validation`.
- expected: a linha 10 cita `src/main.ts:553-566` (ou `:554`), a linha corrente do laço de passos.

- id: ISSUE-02
- severity: warning
- check: C1
- file: `400 Code/Output/dirigibilidade/web/DES-0005-hud-velocidade-e-aderencia.md`
- location: tabela "Realização por requisito", linha REQ-FEAT-0003-14 (`:512 passa a só lap = stepLap(lap, input)`)
- finding: o registro (version movida para 2.0.1) cita `src/main.ts:512`, que não contém o símbolo; o símbolo está em `src/main.ts:554`, e o laço agora também carrega o retorno do zebra de `pista-kart-park` (`:555-565`); o 97-changelog da rodada 6 afirma que os registros tocados citam a árvore corrente.
- expected: o registro cita `src/main.ts:554` e descreve o laço sem prêmio de drift, sem afirmar que ele contém "só" `stepLap`.

- id: ISSUE-03
- severity: warning
- check: C10 / D-CD-07
- file: `400 Code/Output/dirigibilidade/98-divergences.md`
- location: linha R de "Dependências e notas desta rodada"
- finding: a linha fica `open` com um motivo falso na árvore corrente: `src/lap.ts:281` exporta `listLapResults`, `LapResult` (`src/lap.ts:55-71`) tem `lapSequenceCount`, `lapStartMs`, `trainingLapMs` e `trainingSectorMs`, e o gatilho já é "cada item novo de `listLapResults`" (`src/main.ts:574-575`, chamando `recordLapResult` em `:298`); `src/main.ts:530-533` é hoje `applyCameraView`.
- expected: a linha R é reavaliada contra a árvore e fechada como `resolved` citando `src/main.ts:574-575`, `src/lap.ts:281` e `src/setupRecords.ts:92-93` (`buildLapRecord` copia o resultado inteiro).

## Divergences

- id: DIV-14
- severity: divergence
- check: C10 / D-CD-07
- file: `400 Code/Output/dirigibilidade/98-divergences.md`
- location: linha 14 (verificações de test-strategy 6.1.0, inclusive AC-US-0003-12 a -15 em `tests/dirigibilidade-hud-text.test.ts`; `docs/handling-device-log.md`)
- finding: `open`; as 10 verificações reprovadas são exatamente as da tabela "Verificações reprovadas" (9 de `pista-kart-park`, FB-02; CHK-TEST-0008-03 desta feature), e as verificações de texto de AC-US-0003-12 a -15 ainda não existem.
- expected: fechada pelo estágio de testes desta feature e pelo de `pista-kart-park`, não por este estágio.

- id: DIV-R
- severity: divergence
- check: C10 / D-CD-07
- file: `400 Code/Output/dirigibilidade/98-divergences.md`
- location: linha R (gatilho "cada item novo de `listLapResults`"; campos de treino de `LapResult` 1.2.0)
- finding: `open` no manifesto; o código que a fecharia está na árvore (ISSUE-03).
- expected: fechada na próxima rodada de código com as citações de ISSUE-03.

## Coverage

- requisitos com código: 68/68 `REQ-FEAT-*` do projeto em `99-traceability.md` (0 ausentes, 0 extras), inclusive REQ-FEAT-0003-18 a -21 (DES-0009, DES-0007).
- requisitos sem código: nenhum.
- arquivos alterados não registrados: nenhum (`index.html`, `src/main.ts`, `src/style.css` registrados em `01-implementation.md`).
