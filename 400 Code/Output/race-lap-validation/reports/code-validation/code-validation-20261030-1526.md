---
stage: code
feature: race-lap-validation
verdict: SUCCESS
generated: 2026-10-30T15:26:00Z
counts: {blocker: 0, error: 0, warning: 4, info: 1, divergence: 0}
seed: {revision: 3, digest: beee272fdb3b}
upstream: {stage: dspec, version: 1.2.2}
files_examined: 45
feedbacks: []
---

# Relatório de validação de código — race-lap-validation

## Summary

Revalidação da rodada 2 (treino de voltas seguidas, ADR-0006); população (§8): ISSUE-01 a ISSUE-10 do relatório anterior, os 15 registros do manifesto com `version:` movida (1.0.0 → 1.1.0), as 5 fontes alteradas (`src/lap.ts`, `src/lapMessages.ts`, `src/main.ts`, `index.html`, `src/style.css`, comparadas com `git show HEAD:`), amostra aleatória de dois intocados (`random.SystemRandom().sample`: `src/lapTiming.ts`, `core/DES-0006-leitura-do-dado-de-pista.md`); `npx tsc --noEmit -p .` saída 0; suíte: 380 aprovados, 13 reprovados, exatamente os 13 declarados pelo gerador, todos de teste que supõe a volta de treino única com `ENDED` (nenhum defeito de código).
Nenhum `blocker` nem `error`: volta oficial e de reconhecimento inalteradas (OPEN-06, INV-1), treino conforme ADR-0006, DES-0001, DES-0003, DES-0004, DM-0002 e API-0001/API-0002 1.2.0; ISSUE-04, ISSUE-07, ISSUE-08 e ISSUE-10 fechadas; ficam 4 `warning` e 1 `info` herdados.

## Issues

### ISSUE-01
- severity: warning
- check: C7
- file: `src/lap.ts`
- location: `src/lap.ts:36` (`LapSession.environment`)
- finding: `LapSession` carrega `environment`, ausente da tabela de DM-0002 1.2.0 (linhas 29-51); herdado, inalterado.
- expected: A tabela de DM-0002 ganha o campo na próxima revisão do projeto; nenhuma mudança de código.

### ISSUE-02
- severity: warning
- check: C2
- file: `src/main.ts`
- location: `src/main.ts:242` (`console.warn('track-data', 'INCOMPLETE', reading.trackId, reading.trackVersion)`)
- finding: O aviso `INCOMPLETE` não registra os identificadores C1 a C7 reprovados que DES-0006 1.1.1 (linha 74) manda registrar; herdado, inalterado.
- expected: `console.warn('track-data', 'INCOMPLETE', trackId, trackVersion, <ids reprovados>)`, só com identificadores.

### ISSUE-03
- severity: warning
- check: C2
- file: `src/main.ts`
- location: `src/main.ts:498-522` (`renderResult`: `resultLang !== lang` → `panel.classList.remove('hidden')` em `:522`), `src/main.ts:364` (`#lap-new-lap`), `src/main.ts:629`
- finding: Depois de "nova volta" numa volta oficial ou de reconhecimento encerrada, uma mudança de idioma refaz o painel `#lap-result` e o torna visível sobre a oferta; herdado, inalterado (o treino não é afetado: `:629` só chama `renderResult` fora de `TRAINING`).
- expected: O painel só reaparece por nova transição a `ENDED` (DES-0010 1.2.1, "Interface"); a re-renderização por idioma não altera a visibilidade.

### ISSUE-05
- severity: info
- check: C2
- file: `src/main.ts`
- location: `renderOffer` (leitura `UNREADABLE` → `trackDataError`)
- finding: DES-0009 1.2.1 lista `UNREADABLE` no estado Vazio (linha 33, `noTrackAvailable`) e no estado Erro (linha 36, `trackDataError`); o código segue a linha Erro; herdado, inalterado.
- expected: A ambiguidade é resolvida no projeto; nenhuma mudança de código.

### ISSUE-09
- severity: warning
- check: C1
- file: `400 Code/Output/race-lap-validation/core/DES-0001-ciclo-da-volta-e-comandos.md`, `data/DM-0002-estado-da-volta-em-memoria.md`, `web/DES-0009-inicio-de-volta-e-erros.md`, `web/DES-0010-resultado-da-volta.md`
- location: seções de realização dos quatro registros (1.1.0)
- finding: Os quatro registros, revisados nesta rodada, seguem sem mencionar `setupId`, `setupVersion`, `PUBLISHED_SETUPS` ou `compareLapRecords` (0 ocorrências em cada um), que o projeto nomeia e a árvore realiza (`src/lap.ts:24`, `:137-138`, `:369-381`; `src/main.ts` `beginLap`, `renderBest`); herdado.
- expected: Os registros nomeiam arquivo e símbolo dessas realizações sob REQ-FEAT-0002-11, REQ-FEAT-0006-10 e REQ-FEAT-0002-02/-03; nenhuma mudança de código.

## Divergences

- open: REQ-FEAT-0009-10 (`98-divergences.md`) — parte de código entregue; passagem a `resolved` pendente no registro.
- open: REQ-FEAT-0002-11 (`setupId`, `setupVersion`; etapa devedora `dirigibilidade`) — agora carregada no registro deste estágio, espelhando a linha 38 do projeto, com `arquivo:linha` da árvore; ISSUE-08 fechada.
- open, estágio de testes (tabela "Verificações reprovadas pela mudança de projeto (rodada 2)"), as 13 reprovações da suíte, todas confirmadas como teste que supõe o treino de volta única:
- CHK-TEST-0012-01 (`tests/race-lap-validation-contract.test.ts`): a visão de `COUNTDOWN` traz `lapSequenceCount` e `lapStartMs`, obrigatórios em API-0001 1.2.0 (linhas 48-49) — test-stage.
- CHK-TEST-0010-17 (`tests/race-lap-validation-messages.test.ts`): espera 20 chaves; DES-0008 1.1.0 (linha 81) fixa 24 (`pauseAction`, `endTrainingAction`, `bestValidLap`, `sectorNoTime` em `src/lapMessages.ts:24-27`) — test-stage.
- CHK-TEST-0007-10 (`tests/race-lap-validation-kinds.test.ts:137`): espera resultado do corte de uma volta `TRAINING` em pista `INCOMPLETE`; DES-0004 (linha 53) manda invalidar sem encerrar nem produzir resultado — test-stage.
- CHK-TEST-0005-01, -02, -03, -04, -06, -08, -10 (`tests/pista-kart-park-lap.test.ts:47`, `:63`, `:100`, `:120`, `:152`, `:188`, `:227`): esperam `ENDED` na chegada ou no corte; `drive` (`tests/helpers/kartParkPilot.ts:114`) roda até `ENDED`, que no treino só vem por `endTraining` (ADR-0006) — test-stage.
- CHK-TEST-0007-05 (`tests/pista-kart-park-session.test.ts:103`): espera que o corte encerre a volta da sessão de treino — test-stage.
- CHK-TEST-0006-03 (`tests/pista-kart-park-determinism.test.ts:35-38`): a reprodução roda `inputs.length + 10` passos e `replay` completa com `IDLE`; antes os 10 passos extras caíam em `ENDED`, agora o treino segue e o kart final difere; CHK-TEST-0006-01/-02 (sessões `deepEqual`) passam, então não há não determinismo — test-stage.
- CHK-TEST-0008-03 (`tests/dirigibilidade-setup-version.test.ts:92-93`): medido com `src/lap.ts` de `HEAD` e da árvore sobre o mesmo replay v4 (3767 entradas, acerto `arcade-assistido-v6`): trajetória idêntica nas duas, só 1 de 4 marcadores, nenhum limite de setor, kart fora da pista desde ~passo 2760; em `HEAD` o corte no passo 2880 (`stepCount` 2879 → 2880, 121.º passo fora) levava a volta `TRAINING` a `ENDED` com resultado `INVALID` `CUT` e `replayLap` devolvia `ok`; na árvore o mesmo corte invalida sem encerrar (DES-0004 linha 53, ADR-0006), o kart nunca cruza a chegada, as entradas acabam no passo 3767 com `RUNNING` e `replayLap` (`src/setupRecords.ts:108-128`, inalterado) devolve `NO_RESULT`. Detecção da chegada (`src/lap.ts:314-323`), regra do corte fora do treino, `MAX_REPLAY_INPUT_STEPS` (36 000) e o laço de `replayLap` não mudaram; a única mudança é a regra de corte do treino que o projeto pede — test-stage (o replay v4 da fixture deixa de servir para AC-US-0005-05 com o treino contínuo; a correção é da fixture ou da asserção de `dirigibilidade`).
- resolved, código verificado: as 18 linhas `resolved` de `98-divergences.md` 1.1.0, 76 âncoras `arquivo:linha` conferidas contra a árvore (todas apontam para o símbolo ou trecho descrito; ISSUE-07 fechada): `closeTrainingLap` `src/lap.ts:354`, `evaluateCut` treino `:336-339`, `endTraining` `:180`, `NOT_TRAINING` `:165`, `bestValidLap` `:268`, `listLapResults` `:281`, candidatos de setor `:306`, `declaresLines` `:125`, setores só com 3 limites `:386`, `#pause` `src/main.ts:364`, `emitEndTraining` `:213`, `handledResults` `:433`/`:575`, `renderResult` só fora do treino `:629`.

## Coverage

- Requisitos com código: os 161 `REQ-*` de `sources` do projeto são exatamente os 161 do manifesto (conjuntos iguais nos dois sentidos); `lint_artifacts.py --stage code`: 0 erros em 17 arquivos.
- Requisitos sem código: nenhum.
- Arquivos alterados e ausentes do manifesto: nenhum (`git diff HEAD --stat` em `src/` e `index.html`: os 5 arquivos da tabela "Rodada 2" de `01-implementation.md` 1.1.0; `src/setupRecords.ts`, `src/physics.ts`, `src/trainingSession.ts`, `tests/` intocados).
- Volta oficial (OPEN-06, INV-1): `complete`/`invalidate` (`src/lap.ts:342-350` (`complete` `:342`, `invalidate` `:347`)) só fora de `TRAINING`, fase `ENDED` com 1 resultado; `stepLap` devolve a sessão em `PAUSED`/`ENDED` (`:219`); `pauseLap`, `resumeLap`, `repositionKart`, `endTraining` rejeitam `LAP_ENDED`; laço de quadros para em `ENDED` (`src/main.ts:553`).
- Treino (ADR-0006, DES-0003): chegada no sentido da pista → `closeTrainingLap` (`src/lap.ts:354-366`) acrescenta o resultado e abre a volta seguinte com `lapStartMs = finishMs` (mesmo inteiro), `lapSequenceCount` + 1, marcadores e fronteiras zerados, fase `RUNNING`, `stepCount`/`offTrackSteps`/`kart` mantidos; nenhuma contagem nova (`COUNTDOWN` só da sessão criada); volta `INVALID` mantém o primeiro motivo; corte decidido depois do cruzamento vale para a volta nova (`:224`, ADR-0004 item 9).
- Comandos (API-0002): `pauseLap` na ordem `NO_ACTIVE_LAP`, `NOT_TRAINING` (só `PAUSE_BUTTON` fora do treino), `LAP_ENDED`, `ALREADY_PAUSED` (`src/lap.ts:163-169`); `endTraining` na ordem `NO_ACTIVE_LAP`, `NOT_TRAINING`, `LAP_ENDED`, sem `resumePhase`/`pauseCause`, `results` intacta (`:180-186`).
- Consultas (API-0001 1.2.0): `getLapResult` = último item de `results`; `listLapResults` = cópia; `bestValidLapMs` derivado, só treino não `ENDED`, menor `trainingLapMs` `VALID` (`:268-276`); `completedSectorMs` com `b0 = lapStartMs` até o primeiro setor sem tempo (`:255-265`); `trainingSectorMs` com `null`, `sectorMs` só com as 4 presentes (`:383-397`); "—" por `formatSectorTime`/`sectorNoTime` (`src/lapMessages.ts:27`, `:62-63`).
- Aplicação (DES-0007, DES-0008): cada resultado novo tratado uma vez por `handledResults` (`src/main.ts:575`); `#lap-training-result` só em treino não `ENDED` com resultado, refeito por `lapSequenceCount`/idioma (`:471-492`); `#pause` e `#lap-end-training` com a visibilidade da tabela de DES-0007 (`:634-641`, `:365`); `index.html:25-26`, `:34`; `src/style.css:9`.
- Determinismo e camadas (C4, D-DS-07): 0 ocorrências de `Date`, `performance`, `Math.random`, `document`, `window`, `three`, `./main`, `./audio`, `setupRecords` em `src/lap.ts`, `src/lapMessages.ts`, `src/lapTiming.ts`; a reprodução do probe em duas execuções deu as mesmas saídas.
- Persistência e higiene (C5, C9): 0 `localStorage`, `sessionStorage`, `indexedDB`, `fetch(`, `XMLHttpRequest`, `sendBeacon`, `WebSocket`, `console.log`, `TODO`, `FIXME`, `debugger` nos 5 arquivos alterados.
- Amostra aleatória: `src/lapTiming.ts` = DES-0002 (`toMs`, `interpolateMs`, `isCutExceeded` inteiros); `core/DES-0006-leitura-do-dado-de-pista.md` 1.0.0 nomeia símbolos que existem; nenhum achado.
- Arquivos examinados (45): árvore (11): `src/lap.ts`, `src/main.ts`, `src/lapMessages.ts`, `index.html`, `src/style.css`, `src/lapTiming.ts`, `src/setupRecords.ts`, `tests/dirigibilidade-setup-version.test.ts`, `tests/fixtures/records.ts`, `tests/pista-kart-park-determinism.test.ts`, `tests/helpers/kartParkPilot.ts`; manifesto (19): `00-index.md`, `01-implementation.md`, `97-changelog.md`, `98-divergences.md`, `99-traceability.md`, `core/` 7, `data/` 2, `web/` 4, `security/` 1; projeto (13): `adr/ADR-0004`, `adr/ADR-0006`, `core/DES-0001`, `DES-0003`, `DES-0004`, `DES-0005`, `DES-0006`, `data/DM-0002`, `web/DES-0007`, `DES-0008`, `DES-0009`, `DES-0010`, `98-divergences.md`; F-Spec (1): `api/API-0001`; relatório anterior (1).
- Feedbacks enviados: nenhum.
