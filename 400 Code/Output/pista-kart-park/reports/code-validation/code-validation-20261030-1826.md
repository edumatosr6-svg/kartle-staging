---
stage: code
feature: pista-kart-park
verdict: FAIL
generated: 2026-10-30T18:31:56Z
counts: {blocker: 0, error: 2, warning: 1, info: 2, divergence: 2}
seed: {revision: 1, digest: b5aa5be4734a}
upstream: {stage: dspec, version: 1.3.0}
files_examined: 23
feedbacks: []
previous: "code-validation-20261027-2327.md (SUCCESS, 0/0/0/0/2); os seis itens reverificados e fechados (ISSUE-08)"
population: "revalidação (§8): os seis itens do relatório anterior; arquivos com version movida (01-implementation 1.3.0, 97-changelog 1.3.0, 98-divergences 1.3.0, core/DES-0003 1.1.0, core/DES-0004 1.1.0, core/DES-0005 1.2.0, core/DES-0006 1.1.0, data/DM-0002 1.2.0, security/DES-0012 1.1.0, web/DES-0007 1.2.0, web/DES-0009 1.1.0; 00-index e 99-traceability do gate); diff da rodada 4 em index.html, src/main.ts, src/style.css; dois intocados sorteados (semente 20261030-1826): core/DES-0002, web/DES-0008"
---

# Relatório de validação de código — pista-kart-park (rodada 4)

## Summary

- ADR-0007 está realizado no código: `#lap-training-result-credit` é o último filho de `#lap-training-result`, o crédito é desenhado no mesmo ramo do redesenho, fica ausente na pista sintética e `#lap-result-credit` foi retirado; nada é gravado e não há rede além do link. `tsc` 0; `track verify kart-park 1` `VERIFIED` com o arquivo intacto (SHA-256 `04ce5e51…`); suíte 442/443, com só `CHK-TEST-0009-04` reprovada.
- FAIL: o manifesto descreve um `src/physics.ts` que já não existe. `dirigibilidade` (rodada 5, `cfad3dc`) tirou `onRoad`, os cancelamentos da manobra e o comentário de RULE-0001 antes desta rodada, mas as linhas resolvidas 4 e 5 de `98-divergences.md`, `core/DES-0003` 1.1.0 e `01-implementation.md` ainda citam esse código.

## Issues

### ISSUE-01
- severity: error
- check: C10
- file: `400 Code/Output/pista-kart-park/98-divergences.md`
- location: linha 4 (`src/physics.ts:389-392` `onRoad` sem roda na grama, `:414` cancelamento por grama); linha 5 (`:339-357` "resposta 1,12/0,65/cancelar")
- finding: duas linhas `resolved` citam como prova um código que não está na árvore: `src/physics.ts` tem 440 linhas, sem `onRoad`, sem `cancelManeuver` na barreira (`:335-349`) e sem cancelamento por grama.
- expected: as linhas 4 e 5 citam o código que as resolve hoje (o bloco da barreira `:335-349` sem cancelamento, conforme o passo 3 de DES-0003 1.1.0, e a linha "manobra" como sem mudança desta feature) ou registram o que deixou de valer.

### ISSUE-02
- severity: error
- check: C1
- file: `400 Code/Output/pista-kart-park/core/DES-0003-superficie-por-roda-zebra-e-barreira.md`, `01-implementation.md`, `97-changelog.md`
- location: `core/DES-0003`, parágrafo da rodada 4; `01-implementation.md:43`, `:59-61`, `:113`; `97-changelog.md`, rodada 4, primeiro item recusado
- finding: o manifesto afirma que `src/physics.ts` continua com 481 linhas e que o cancelamento em `:352`, `onRoad` e o comentário de RULE-0001 em `:388-391` "continuam as da rodada 3" à espera de `dirigibilidade`, e lista o símbolo `onRoad` na linha do arquivo. Na árvore, `cfad3dc` (2026-10-30 11:14) já retirou esses trechos e o símbolo não existe.
- expected: o manifesto registra que `src/physics.ts` (440 linhas) já não tem esses trechos, sem citar `onRoad` nem as linhas da rodada 3 como presentes; a recusa do changelog continua (a remoção é de `dirigibilidade`) e passa a dizer que ela já foi feita.

### ISSUE-03
- severity: warning
- check: C10
- file: `400 Code/Output/pista-kart-park/98-divergences.md`, `web/DES-0007`, `web/DES-0008`
- location: linha 5 (`:176-183`, `:367-383`, `:372`, `:405-412`); linha 6 (`:185-187`); linha 4 (`:152-157`, `:418-436`); linha 11 e `web/DES-0007` (`src/lapMessages.ts:80-95`); bloco "Satisfeitos hoje" (`src/physics.ts:384`); `web/DES-0008` (`src/main.ts:237-248`, `:393-405`)
- finding: os símbolos existem e fazem o que a linha exige, mas os ponteiros apontam para linhas deslocadas. Linhas atuais: `trackEnvironment` `:186-188`, `trackEdgeDistanceM` `:191-193`, `surfaceMu`/`tireForce` `:158-161`, `barrierContactPoint` `:360-377` (`startSideNormal` `:366`), `step` `:376`, telemetria do toque `:392-397`, `TrackContact`/`getTrackContact` `:401-420`; `OSM_CREDIT`/`creditFor`/`optionLabel` em `src/lapMessages.ts:105-120`; `chooseTrack` em `src/main.ts:225-250`, minimapa `:407-422`.
- expected: os `arquivo:linha` são atualizados para a árvore corrente.

### ISSUE-04
- severity: info
- check: C2
- file: `src/main.ts`, `index.html`, `src/style.css`
- location: `index.html:26`; `src/main.ts:478-484` (`renderTrainingResult`), `:488-516` (`renderResult`), `:213-223` (`renderCredit`); `src/style.css:8`
- finding: ADR-0007 e DES-0007 1.3.0 estão realizados, item a item:
  - `#lap-training-result-credit` (`p.lap-chip.track-credit`, oculto) é o último filho do painel.
  - O redesenho remove só os elementos do resultado, insere os novos antes do crédito e chama `renderCredit(..., creditFor(selectedOption(result.trackId)))` no mesmo ramo.
  - `creditFor` devolve `undefined` para `synthetic` (`osmCredit: false`) e `renderCredit` oculta o contêiner; com o painel oculto, o crédito fica oculto.
  - `#lap-result-credit` e a chamada em `renderResult` saíram; não há `lap-result-credit` em `src/` nem em `index.html`.
  - O link recebe `href`, `target="_blank"` e `rel="noopener noreferrer"` por `setAttribute`, sem `innerHTML`; há `#lap-training-result-credit a{pointer-events:auto}` e nenhum ancestral com `pointer-events:none`.
  - Não há `localStorage`, `sessionStorage`, `indexedDB`, cookie, `fetch` nem `sendBeacon` em `src/main.ts`, `src/trainingSession.ts` e `src/lapMessages.ts`.
  - DES-0004, DES-0005, DES-0006, DES-0012 e DM-0002 não pedem código novo, e o código existente é coerente com eles: `startTrainingLap` `:81`, `selectTrainingTrack`, `listLapResults` e o comentário de `src/main.ts:164-165`.
  - A reescrita com elementos de identificador próprio foi recusada, com motivo, no changelog.
  - O toque no crédito em tela fica para E2E-02 (estágio de testes).
- expected: atendido.

### ISSUE-05
- severity: info
- check: C9
- file: `src/physics.ts`
- location: `:335-349`, `:376-397`; `:12`, `:128`, `:379`, `:382`
- finding: nota entre features. Os trechos que o changelog do projeto (rodada 4, "Mudança de código desta feature pelo drift: nenhuma") atribui a `dirigibilidade` já não estão na árvore: o cancelamento na barreira, `onRoad`, o comentário de RULE-0001 desta feature e o cancelamento por grama. Restam só a RULE-0001 desta feature na aderência da zebra (`:12`) e os comentários de `dirigibilidade` (`:128`, `:379`, `:382`). Nenhuma linha de `src/physics.ts` mudou nesta rodada, nenhuma sobra de drift é desta feature e não é preciso feedback.
- expected: atendido.

### ISSUE-06
- severity: divergence
- check: C10
- file: `400 Code/Output/pista-kart-park/98-divergences.md`
- location: linha 15; seção "Verificações desta feature reprovadas pela rodada 4"
- finding: `CHK-TEST-0009-04` (`tests/pista-kart-park-screens.test.ts:47-56`) reprova porque afirma `#lap-result-credit`; é a migração planejada no changelog do projeto, rodada 4. Na suíte de 443 verificações, 442 passam e só esta reprova.
- expected: o estágio de testes migra a verificação para `#lap-training-result-credit`.

### ISSUE-07
- severity: divergence
- check: C10
- file: `400 Code/Output/pista-kart-park/98-divergences.md`
- location: linhas 12 e 13
- finding: continuam abertas, a 12 no estágio de testes e a 13 no de deploy, como no relatório anterior.
- expected: fechadas nas etapas respectivas.

### ISSUE-08
- severity: fechado (ISSUE-01 a ISSUE-06 do relatório anterior)
- check: C2, C10
- file: `src/physics.ts`, `scripts/trackPrep.ts`, `src/trainingSession.ts`, `src/trackGeometry.ts`
- location: `startSideNormal` `src/physics.ts:366`; `scripts/trackPrep.ts:12-15`; `startTrainingLap` `src/trainingSession.ts:81`; `closestOnSegment` `:57`, `pointInQuad` `:85`, `centerlineCrossings` `:269`, `windingSumOf` `:282`
- finding: a correção da normal do lado de S está igual (agora em `:366`); as constantes de suavização estão iguais e `track verify` dá V01–V18 `PASS`; a assinatura de `startTrainingLap` e as exportações estão iguais; `CHK-TEST-0009-02` e `CHK-TEST-0004-13` passam.
- expected: atendido.

## Divergences

- `98-divergences.md` #12: open (estágio de testes).
- `98-divergences.md` #13: resolved no código, open no deploy.
- `98-divergences.md` #15: open (estágio de testes; verificações e `drive` que esperam `ENDED`).
- `98-divergences.md` #14: resolved — `index.html:26`, `src/main.ts:478-484`, `renderResult` sem crédito e `src/style.css:8` conferidos.
- `98-divergences.md` #4 e #5: resolved com prova que não existe mais (ISSUE-01).

## Coverage

- requisitos com código: `REQ-FEAT-0006-04`, `-05`, `-06` e `REQ-FEAT-0003-14` (ADR-0007) em `src/main.ts:478-484` e `index.html:26`; os demais `REQ-FEAT-*` como no relatório anterior.
- requisitos sem código: nenhum.
- arquivos tocados sem registro: nenhum. A árvore altera `index.html`, `src/main.ts` (670 linhas), `src/style.css` e os registros do manifesto que `01-implementation.md` 1.3.0 nomeia; `src/tracks/`, `tracks/` e `tests/` estão sem mudança.
- portão: `npx tsc --noEmit -p .` 0; `npm run track -- verify kart-park 1` `VERIFIED` (V01–V18 `PASS`, 43 013 bytes), SHA-256 de `src/tracks/kart-park-v1.json` igual (`04ce5e51…`); `npx tsx --test tests/*.test.ts` 443 / 442 / 1 (`CHK-TEST-0009-04`).
- amostras intocadas: `core/DES-0002` (`normalsOf` `:72`, `buildTrackGeometry` `:138`, `classifySurface` `:219`, `beyondTrackEdgeM` `:228`, `nearestOnCenterline` `:236`, `lapMAtIndex` `:247`, `positionAtLapM` `:254`, `nearestBarrier` `:258`) e `web/DES-0008` (`src/trackScene.ts`: `asphaltMesh` `:18`, `curbsMesh` `:39`, `barriersMesh` `:77`, `startLine` `:98`, `buildTrackScene` `:121`, `minimapTransform` `:129`). Os símbolos existem; as linhas de `src/main.ts` estão deslocadas (ISSUE-03).
- status: nenhum carimbo (FAIL); 11 registros do manifesto continuam `draft`.
