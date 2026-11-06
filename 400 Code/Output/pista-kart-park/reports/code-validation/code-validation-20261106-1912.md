---
stage: code
feature: pista-kart-park
verdict: SUCCESS
generated: 2026-11-06T19:12:07Z
counts: {blocker: 0, error: 0, warning: 1, info: 1, divergence: 2}
seed: {revision: 3, digest: 1fe5243f7e36}
upstream: {stage: dspec, validation: dspec-validation-20261106-1853, commit: 8b00b74, status: validated}
files_examined: 26
feedbacks: []
previous: "code-validation-20261103-2004.md (SUCCESS, rodada 5, seed revisão 2); esta é a primeira validação da revisão 3 (Mode A), não uma revalidação"
population: "mudança inteira sobre 8b00b74 (git diff HEAD e git status): scripts/trackPrep.ts, scripts/trackChecks.ts, scripts/track-pipeline.ts, src/trainingSession.ts, src/main.ts, tracks/registry.json, src/tracks/kart-park-v2.json (novo), tracks/sources/kart-park-replica.json (novo); referências: src/tracks/kart-park-v1.json, tracks/sources/kart-park.json, .gitattributes; manifesto: 00-index, 01-implementation, 97-changelog, 98-divergences, 99-traceability e os 10 registros por item"
gate: "lint_artifacts.py --stage code: 0 erros, 0 avisos, 17 arquivos; npx tsc --noEmit: saída 0; tsc --strict isolado de scripts/trackPrep.ts e scripts/trackChecks.ts: saída 0"
recomputed: "npm run track -- verify kart-park 2: V01 a V20 PASS, VERIFIED (V13 292 pares, V14 291 segmentos e 5,694 m, V17 36.585 bytes); SHA-256: kart-park-v1.json 04ce5e51…f057b1, kart-park-v2.json c79f14cb…c4d20a, kart-park-replica.json eba665b6…a24e, kart-park.json 52c5adda…5302, iguais ao registro e a TRACK_ORIGINS; script próprio (sem a suíte): prepareTrack sobre a origem da versão 1 reproduz kart-park-v1.json byte a byte; prepareReplicaTrack sobre a réplica reproduz kart-park-v2.json byte a byte; prep da entrada 2 do registro igual ao prep recalculado; barreira de 1 poligonal com 292 vértices; git diff vazio para src/tracks/kart-park-v1.json, tracks/sources/kart-park.json e .gitattributes; nenhum import de kart-park-v1 em src/"
---

# Relatório de validação de código — pista-kart-park (revisão 3, iteração 1)

## Summary

- A revisão 3 realiza DES-0005 2.0.0, DES-0007 2.0.1, DES-0010 2.1.0, DES-0011 2.0.1, DM-0001 2.0.1, DM-0002 2.0.1 e ADR-0008 símbolo a símbolo; V01 a V20 passam e os dois arquivos publicados são reproduzidos byte a byte pelo preparo.
- Um aviso: `buildBarriers`, que também gera a versão 1, foi editado apesar de "sem mudança" no projeto, com o comportamento da versão 1 provado igual. SUCCESS.

## Issues

### ISSUE-01
- severity: warning
- check: C2
- file: `scripts/trackPrep.ts`
- location: `:286-346` (`buildBarriers`: parâmetros `sections` e `sampling`, `edgeSamples`, `gapsOf`; o laço de `sweep` reescrito sobre `gapsOf`)
- finding: ADR-0008 decisão 5 e DES-0010 2.1.0 (Posicionamento) dizem que o código que gerou a versão 1 fica em `scripts/trackPrep.ts` "sem mudança", e `buildBarriers`, chamado por `prepareTrack`, foi reestruturado; o modo `'PAIRS'` padrão reproduz `src/tracks/kart-park-v1.json` byte a byte (recalculado), então só o texto do código congelado mudou, não o comportamento.
- expected: o código congelado da versão 1 sem edição (a amostragem `'EDGE'` em função própria da versão 2), ou o projeto declarando que `buildBarriers` é partilhado e parametrizado, com a reprodução da versão 1 como a garantia de congelamento.

### ISSUE-02
- severity: info
- check: C2
- file: `src/main.ts`
- location: `:229-233` (`chooseTrack`)
- finding: com `TRACK_VERSION_MISMATCH` a variável `reading` da aplicação passa a ser a leitura `COMPLETE` do arquivo recebido (antes, um `trackId` diferente virava `UNREADABLE`); cena, oferta e kart seguem `sessionState` (`:237-248`, `:274`) e ficam no caminho de `FAILED`, e `renderBest` (`:305-306`) só compara com essa identidade, o que não exibe tempo porque nenhuma volta pode rodar numa sessão `FAILED`.
- expected: nenhuma mudança; registrado para o estágio de testes provar o `FAILED` por `TRACK_VERSION_MISMATCH` com `#best` em `—`.

## Divergences

- Linha 7 de `98-divergences.md` (REQ-FEAT-0008-25, -26, -27): `open`, estágio de testes; a mesma volta com e sem o acabamento sobre a versão 2.
- Linha 8 de `98-divergences.md` (provas da versão 2 em `npm test`): `open`, estágio de testes; as 22 verificações presas à versão 1 (fixture `tests/fixtures/kartParkFiles.ts:29-30`) reprovam até a migração, fora deste gate.
- Linhas 1 a 6 `resolved`: os `arquivo:linha` citados existem e fazem o que a linha exige (conferidos em `src/trainingSession.ts:10,14,37,72-77`, `src/main.ts:13,156,230`, `scripts/trackPrep.ts:288,317-346,421-591`, `scripts/trackChecks.ts:12-34,125-338`, `scripts/track-pipeline.ts:26-31,45-67,137-162`, `tracks/registry.json` entrada 2).

## Coverage

- Requisitos com código: REQ-FEAT-0001-15, -16 (`src/trainingSession.ts`, `src/main.ts`); REQ-FEAT-0002-01, -02, -04 a -11, -14, -17 a -21 (`scripts/trackPrep.ts`, `scripts/trackChecks.ts`, `scripts/track-pipeline.ts`, `src/tracks/kart-park-v2.json`, `tracks/registry.json`); REQ-FEAT-0003-01 a -07, -16; REQ-FEAT-0004-01 a -03; REQ-FEAT-0005-01 a -03, -20; REQ-FEAT-0006-07, -08, -09, -14; REQ-FEAT-0007-07, -13; os demais `REQ-*` do projeto sem mudança de código nesta revisão, servidos pela árvore de `8b00b74`.
- Requisitos sem código nesta rodada: REQ-FEAT-0008-25, -26, -27 (estágio de testes, divergência 7).
- Arquivos alterados e não registrados: nenhum.
