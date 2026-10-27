---
stage: code
feature: race-lap-validation
verdict: SUCCESS
generated: 2026-10-27T17:41:33Z
counts: {blocker: 0, error: 0, warning: 6, info: 3, divergence: 0}
seed: {revision: 2, digest: ee91c5706be1}
upstream: {stage: dspec, version: 1.1.2}
files_examined: 54
feedbacks: []
---

# Relatório de validação de código — race-lap-validation

## Summary

Revalidação após deriva (`src/lap.ts`, `src/main.ts` e `src/physics.ts` alterados pela feature `dirigibilidade` depois de `code-validation-20261021-1338.md`); população (§8): ISSUE-01 a ISSUE-06 do relatório anterior, os três arquivos alterados, amostra aleatória de dois intocados (`random.SystemRandom().sample`: `src/lapMessages.ts`, `src/lapTiming.ts`); os 111 pares arquivo:símbolo dos 14 registros resolvem na árvore e os 138 ids de `sources` do projeto são os mesmos 138 do manifesto (210 linhas de `99-traceability.md`, 0 descobertos).
Nenhum `blocker` nem `error`: o código segue DES-0001 e DM-0002 1.1.0 (`setupId` e `setupVersion` copiados sem interpretação em `src/lap.ts:123-124` e `:278-279`, ausentes quando o pedido não os traz, fora de toda verificação e regra), API-0001 e API-0002 1.1.0 campo a campo, o mapa de camadas (D-CD-02) e INV-1 (`src/lap.ts:180`, `src/main.ts:414`); ficam 6 `warning` (3 herdados, 3 de manifesto atrasado em relação à árvore e ao projeto 1.1.x) e 3 `info`; ISSUE-06 fechada pelo estágio de testes.

## Issues

### ISSUE-01
- severity: warning
- check: C7
- file: `src/lap.ts`
- location: `src/lap.ts:35` (`LapSession.environment`)
- finding: `LapSession` carrega o campo `environment` (`Environment` da física), ausente da tabela de DM-0002 1.1.0 (que ganhou `setupId` e `setupVersion` sem ganhar `environment`); herdado do relatório anterior, inalterado.
- expected: Todo campo do modelo em memória consta da tabela de DM-0002; como DES-0001 exige `startLap(..., environment)` e `stepLap(lap, input)` sem parâmetro de ambiente, a tabela de DM-0002 deve ser acrescida do campo na próxima revisão do projeto (já registrado no `97-changelog.md` do código).

### ISSUE-02
- severity: warning
- check: C2
- file: `src/main.ts`
- location: `src/main.ts:164` (`console.warn('track-data', 'INCOMPLETE', reading.trackId, reading.trackVersion)`)
- finding: O aviso de dado `INCOMPLETE` registra `trackId` e `trackVersion`, mas não os identificadores C1 a C7 reprovados que DES-0006 ("Comportamento em falha") manda registrar; herdado do relatório anterior, inalterado.
- expected: `console.warn('track-data', 'INCOMPLETE', trackId, trackVersion, <ids reprovados>)`, obtendo os ids por `checkConsistency(reading)` na aplicação ou expondo-os na leitura, sem conteúdo além de identificadores.

### ISSUE-03
- severity: warning
- check: C2
- file: `src/main.ts`
- location: `src/main.ts:361-390` (`renderResult`: `resultLang !== lang` → `panel.classList.remove('hidden')` em `:389`), `src/main.ts:270` (`#lap-new-lap`), `src/main.ts:489` (chamada a cada quadro em `ENDED`)
- finding: Depois de "nova volta" o painel `#lap-result` fica oculto, mas `lap` segue `ENDED` e `renderResult` roda a cada quadro; se `navigator.language` mudar nesse intervalo, a re-renderização por idioma remove `hidden` e cobre a oferta (`#welcome`); herdado do relatório anterior, inalterado.
- expected: O painel de resultado só reaparece por nova transição a `ENDED` (DES-0010: "aparece quando `lapPhase` chega a `ENDED`"); a re-renderização por idioma não deve alterar a visibilidade depois que o Jogador saiu da tela.

### ISSUE-04
- severity: info
- check: C2
- file: `src/lap.ts`
- location: `src/lap.ts:272` (`buildResult(session, finishMs?)`)
- finding: DES-0005 1.0.0 (linha 45) nomeia `buildResult(session)`; a implementação, interna e não exportada, recebe `finishMs` como segundo argumento porque DM-0002 guarda só `b1..b3` em `sectorBoundsMs` e `b4` só existe no resultado; herdado do relatório anterior, inalterado.
- expected: Assinatura interna coerente com DES-0003 e DM-0002 (como está); a tabela de interface de DES-0005 pode passar a nomear o segundo argumento na próxima revisão do projeto.

### ISSUE-05
- severity: info
- check: C2
- file: `src/main.ts`
- location: `src/main.ts:203-205` (`renderOffer`)
- finding: Leitura `UNREADABLE` exibe `trackDataError`; a tabela de DES-0009 1.1.1 lista `UNREADABLE` tanto no estado Vazio (`noTrackAvailable`) quanto no estado Erro (`trackDataError`); herdado do relatório anterior, inalterado.
- expected: Comportamento compatível com a linha Erro de DES-0009 e API-0003 (como está); a chave `noTrackAvailable` existe em `src/lapMessages.ts:24` e a ambiguidade é do projeto, a resolver lá.

### ISSUE-07
- severity: warning
- check: C10
- file: `400 Code/Output/race-lap-validation/98-divergences.md`
- location: coluna "Resolução" das 11 linhas `resolved` (linhas 15 a 25)
- finding: 25 das 44 âncoras `arquivo:linha` não apontam mais para o símbolo nomeado, porque `src/lap.ts` e `src/main.ts` cresceram pela feature `dirigibilidade`; os símbolos existem e fazem o que a linha exige: `src/lap.ts` 86→90 (`resolveCutLimits`), 95→99 (`startLap`), 110→113-116 (`startPosition`), 134→141 (`pauseLap`), 141→148 (`resumeLap`), 149→156 (`repositionKart`), 153→160 (`OFFICIAL` → `REPOSITION`), 167→174 (`stepLap`), 181→188 (`getLapState`), 211→218 (`offeredLapKinds`), 218→225 (`edgeDistanceM`), 223→230 (`evaluateDisplacement`), 245→252 (`evaluateCut`), 265→272 (`buildResult`), 274→283 (`official`); `src/main.ts` 164→172 (`SENSOR_SILENCE_MS`), 183→191 (`emitReposition`), 189→197 (`renderOffer`), 208→224 e 230 (`beginLap`, `touchFallback`), 255→285 (Esc), 259→289 (`blur`), 300→330 (`renderHud`), 331→361 (`renderResult`), 370→402 (vigilância `SENSOR_LOST`), 449→492-493 (controles desabilitados); as 19 âncoras em `src/lapTiming.ts`, `src/lapMessages.ts`, `src/track.ts`, `src/trackData.ts`, `index.html` e `src/style.css` conferem.
- expected: Cada linha `resolved` nomeia o `arquivo:linha` que resolve na árvore corrente (os números acima), com `version:` do registro movida; nenhuma mudança de código.

### ISSUE-08
- severity: warning
- check: C10
- file: `400 Code/Output/race-lap-validation/98-divergences.md`
- location: tabela inteira (12 linhas herdadas; D-CD-07)
- finding: O registro de projeto `300 Specs/330 D-Specs/Output/race-lap-validation/98-divergences.md` 1.1.0 ganhou uma 13.ª linha (linha 36: REQ-FEAT-0002-11 com API-0001 e API-0002 1.1.0, `setupId` e `setupVersion`; etapa devedora: código da feature `dirigibilidade`) que o registro deste estágio (1.0.0) não carrega; a exigência está realizada na árvore (`src/lap.ts:23`, `:30-31`, `:54-55`, `:123-124`, `:278-279`; `src/main.ts:226`) e registrada no manifesto de `dirigibilidade` (`400 Code/Output/dirigibilidade/01-implementation.md` 2.0.0, linhas 36 e 38), de modo que nada foi descartado, só não anotado aqui.
- expected: A linha herdada entra no registro deste estágio como `resolved`, nomeando os `arquivo:linha` acima e a feature que fez a mudança, para que o registro deste estágio volte a espelhar o do projeto (D-CD-07); nenhuma mudança de código.

### ISSUE-09
- severity: warning
- check: C1
- file: `400 Code/Output/race-lap-validation/core/DES-0001-ciclo-da-volta-e-comandos.md`, `data/DM-0002-estado-da-volta-em-memoria.md`, `web/DES-0009-inicio-de-volta-e-erros.md`, `web/DES-0010-resultado-da-volta.md`
- location: tabelas "Realização por requisito" e seções "Campos"/"Interface" dos quatro registros (todos 1.0.0)
- finding: Nenhum registro do manifesto menciona `setupId`, `setupVersion`, `PUBLISHED_SETUPS` ou `compareLapRecords`, enquanto o projeto 1.1.x os nomeia (DES-0001 1.1.0 "Interface"; DM-0002 1.1.0 tabelas; DES-0009 1.1.1 "Interface"; DES-0010 1.1.1 "Comparação de tempos") e a árvore os realiza: `src/lap.ts:23` (`LapRequest`), `:30-31` e `:54-55` (sessão e resultado), `:123-124` e `:278-279` (cópia sem interpretação); `src/main.ts:226` (`beginLap` com `setupId: setup.setupId, setupVersion: setup.setupVersion`, lidos de `PUBLISHED_SETUPS`, sem `getSetupVersion`), `:217-223` (`renderBest`) e `:426-439` (melhor registro só com `comparability` `COMPARABLE`); o registro de DM-0002 enumera os campos de `LapSession` sem os dois novos.
- expected: Os quatro registros, com `version:` movida, nomeiam arquivo e símbolo dessas realizações sob REQ-FEAT-0002-11 (DES-0001, DM-0002), REQ-FEAT-0006-10 (DES-0009: `beginLap` com os dois campos vindos do `PublishedSetup` corrente) e REQ-FEAT-0002-02/-03 (DES-0010: precondição `COMPARABLE` em `renderBest` e no laço de quadros), e o registro de DM-0002 lista `setupId?` e `setupVersion?` como copiados sem interpretação e ausentes quando o pedido não os traz; nenhuma mudança de código.

### ISSUE-10
- severity: info
- check: C1
- file: `400 Code/Output/race-lap-validation/01-implementation.md`
- location: seção "Arquivos tocados (D-CD-01)", frase "Inalterados, como o projeto exige: `src/physics.ts` (inclusive a linha 3 que reexporta `LapTracker`)"
- finding: A frase descreve a rodada de 2026-10-21 e segue verdadeira para a mudança desta feature, mas `src/physics.ts` hoje carrega `ARCADE_ASSISTIDO_V5` (`:73`), `SOLVER_SUBSTEPS` (`:84`), `SetupId`/`SetupRef`/`PublishedSetup` (`:85-91`), `PUBLISHED_SETUPS` (`:92`), `getHandlingTelemetry` (`:351`) e `classifyHandlingSteps` (`:366`) da feature `dirigibilidade`, e `KartConfig` ganhou campos opcionais (`:44-46`); os símbolos de que esta feature depende estão intactos: linha 3 (`export { nearest, track, WIDTH, LapTracker } from './track'`), `STEP` = 1/120 (`:5`), `Input` com `throttle`, `brake`, `steer`, `drift?` (`:8`), `RENTAL_KART` (`:49`), `ARCADE_KART` (`:61`), `KART_PRESETS` (`:69`), `initialState` (`:107`), `CIRCUIT` e `TEST_PAD` (`:165-166`), `step(state, input, dt = STEP, config = RENTAL_KART, environment = CIRCUIT)` (`:319`).
- expected: A frase datada à rodada ("inalterado por esta feature em 2026-10-21") ou o manifesto revisado nomeando o que a árvore guarda hoje por conta de outra feature; nenhuma mudança de código (NFR-0010, NFR-0011 valem para a mudança desta feature, cuja comparação de benchmarks está em `docs/lap-validation-bench.md`).

## Divergences

- open: REQ-FEAT-0009-10 (`98-divergences.md`, linha 26) — a parte de testes, devida ao estágio de testes, agora existe: `tests/race-lap-validation-track-data.test.ts` (CHK-TEST-0009-01, linhas 8-12: `tests/fixtures/track-v1.json` lido como `INCOMPLETE` sem erro), `tests/race-lap-validation-frozen.test.ts`, `tests/race-lap-validation-layering.test.ts` e os demais `tests/race-lap-validation-<área>.test.ts`; ISSUE-06 do relatório anterior fechada; a passagem da linha a `resolved` é do gerador na próxima rodada de manifesto.
- resolved, código verificado pelo símbolo (âncoras de linha desatualizadas: ISSUE-07): REQ-FEAT-0001-01/-04/-05/-06/-07/-08/-11/-12 (`stepLap` `src/lap.ts:174`, `getLapState` `:188`, `toMs` `src/lapTiming.ts:11`, `COUNTDOWN_STEPS` `:6`); REQ-FEAT-0001-02/-03/-09/-10 e REQ-FEAT-0007-01..-14 (`resolveLanguage` `src/lapMessages.ts:38`, `describeLap` `:62`, `renderHud` `src/main.ts:330`, `#lap-countdown` `index.html:20`, `#lap-state` `:21`, `--lap-*` `src/style.css:6`); REQ-FEAT-0001-13 e REQ-FEAT-0003-07 (`SENSOR_SILENCE_MS` `src/main.ts:172`, vigilância `:402`, `beginLap`/`touchFallback` `:224`/`:230`, `#lap-control-fallback` `index.html:24`); REQ-FEAT-0002-01..-14 e REQ-FEAT-0004-01..-13 (`crossLine` `src/track.ts:27`, `evaluateDisplacement` `src/lap.ts:230`, `buildResult` `:272`, `interpolateMs` `src/lapTiming.ts:17`); REQ-FEAT-0002-06 (`formatLapTime` `src/lapMessages.ts:48`); REQ-FEAT-0009-01/-12 (`startLap` `src/lap.ts:99`, `pauseLap` `:141`, `resumeLap` `:148`, `repositionKart` `:156`, `stepLap` `:174` com `ENDED` devolvendo a sessão `:180`; `src/main.ts:2` e `:9` sem `LapTracker` nem `step`); REQ-FEAT-0003-05/-06/-08..-14 (`pauseLap` `:141` com `ALREADY_PAUSED` `:144`, `resumeLap` `:148`, Esc `src/main.ts:285`, `blur` `:289`, controles desabilitados `:492-493`); REQ-FEAT-0005-01..-06/-09..-11 (`evaluateCut` `src/lap.ts:252`, `edgeDistanceM` `:225`, `resolveCutLimits` `:90`, `isCutExceeded` `src/lapTiming.ts:25`); REQ-FEAT-0006-01..-06/-12..-15 (`repositionKart` `src/lap.ts:156`, `OFFICIAL` → `REPOSITION` `:160`, `emitReposition` `src/main.ts:191`, `#reset` `:268`, tecla `R` `:284`); REQ-FEAT-0006-07..-11 e REQ-FEAT-0008-05..-07 (`official` `src/lap.ts:283`, `offeredLapKinds` `:218`, `renderOffer` `src/main.ts:197`, `renderResult` `:361`, `#lap-offer` `index.html:19`, `#lap-result` `:25`); REQ-FEAT-0008-01..-04/-08..-15 e REQ-FEAT-0004-06 (`SYNTHETIC_TRACK_FILE` `src/track.ts:42`, `readTrackData` `src/trackData.ts:81`, `:89`, `:95`, `checkConsistency` `:138`, `startPosition` `src/lap.ts:113-116`).
- resolved sem verificação possível: nenhuma.
- linha do projeto não carregada pelo registro deste estágio: REQ-FEAT-0002-11 com API-0001/API-0002 1.1.0 (`setupId`, `setupVersion`), realizada na árvore (ISSUE-08).

## Coverage

- Requisitos com código: os 138 ids de `sources` do projeto (`300 Specs/330 D-Specs/Output/race-lap-validation/`) são exatamente os 138 ids de `sources` do manifesto (conjuntos iguais nos dois sentidos; colunas "Upstream" de `99-traceability.md` do projeto e do código iguais); 210 linhas, todas apontando para registro existente.
- Requisitos sem código: nenhum; REQ-FEAT-0009-10 com a parte de testes entregue pelo estágio de testes (linha ainda `open` no registro).
- Arquivos alterados desde o relatório anterior e ausentes deste manifesto: `src/lap.ts`, `src/main.ts`, `src/physics.ts` — alterados e registrados pela feature `dirigibilidade` (`400 Code/Output/dirigibilidade/01-implementation.md` 2.0.0, linhas 36, 38 e 42); nenhuma mudança sem dono.
- Contratos (C3), nos arquivos alterados: `LapRequest` (`src/lap.ts:23`) = pedido `startLap` de API-0002 1.1.0 (`lapKind`, `trackId`, `trackVersion`, `challengeNumber?`, `setupId?`, `setupVersion?`); `LapResult` (`:50-62`) = resposta de `getLapResult` de API-0001 1.1.0 campo a campo, com `setupId?` e `setupVersion?` opcionais e aditivos; `LapStateView` (`:64-78`) = resposta de `getLapState`, sem os dois campos, como o contrato; rejeições `:80-83` = tabela de erros de API-0002; unidades com sufixo (`Ms`, `Count`, `M`); nenhuma rejeição nova, nenhum campo renomeado (I3, I5).
- Projeto (C2), nos arquivos alterados: `startLap` copia `challengeNumber`, `setupId` e `setupVersion` sem interpretação e só quando presentes (`:121-124`); nenhum dos dois entra em verificação (`:102-107`), em regra de volta (`:174-186`, `:230-259`) nem em rejeição; `src/lap.ts` não importa `src/setupRecords.ts` (`:3-6`); `beginLap` lê `setupId`/`setupVersion` de `setup` (`PUBLISHED_SETUPS`, `src/main.ts:122`, `:251`) e não chama `getSetupVersion` (0 ocorrências); comparação de tempos só por `compareLapRecords` com `COMPARABLE` (`:220-222`, `:433-435`), sem comparar campos de acerto na aplicação (0 ocorrências de `setupId ===`/`!==`); laço de quadros avança passos só em `COUNTDOWN`/`RUNNING` e para em `ENDED` (`:403`, `:414`); INV-1 de DM-0002 preservada (`src/lap.ts:143`, `:150`, `:158`, `:180`, `:213`).
- Camadas (C4, D-CD-02): `src/lap.ts` importa só `./physics`, `./track`, `./trackData`, `./lapTiming`; `src/setupRecords.ts` importa `./lap` (sentido permitido, nunca o inverso); `src/main.ts` importa `./setupRecords` e `./handlingMessages` (aplicação → simulação/aplicação pura, permitido pela arquitetura 1.1.1); nenhuma ocorrência de `three`, `./audio`, `./main`, `document`, `window`, `Date`, `performance`, `Math.random` em `src/lap.ts`, `src/lapTiming.ts`, `src/lapMessages.ts`, `src/setupRecords.ts`, `src/trackData.ts`, `src/track.ts`, `src/physics.ts`, `src/maneuvers.ts`.
- Segurança e privacidade (C5, D-CD-05, D-CD-06): 0 ocorrências de `fetch(`, `XMLHttpRequest`, `WebSocket`, `sendBeacon`, `localStorage`, `sessionStorage`, `indexedDB` em `src/`; `navigator.share`/`clipboard` (`src/main.ts:276-277`) é o compartilhamento de `dirigibilidade`, acionado pelo Jogador, sem dado pessoal e sem dependência do caminho solo; 0 segredos, credenciais ou tokens em `src/` e `index.html`; `console.warn` só com identificadores e códigos (`src/main.ts:162-164`, `:221`, `:434`).
- Higiene (C9): 0 `TODO`, `FIXME`, `debugger` ou `console.log` em `src/`; nenhuma mudança desta feature fora dos arquivos que o projeto nomeia.
- Amostra aleatória (C2): `src/lapTiming.ts` = DES-0002 1.0.0 (`COUNTDOWN_MS` 3000, `COUNTDOWN_STEPS` 360, `toMs`, `interpolateMs` limitado a `[lo, hi]`, `isCutExceeded` em aritmética inteira); `src/lapMessages.ts` = DES-0008 1.0.0 (20 chaves e textos pt/en iguais à tabela, `resolveLanguage`, `formatLapTime`, `describeLap`, `greenSignalVisible` com `stepCount < 120`); nenhum achado.
- Arquivos examinados (54): árvore (16): `src/lap.ts`, `src/main.ts`, `src/physics.ts` (linhas 1-106, 319-320 e exportações), `src/lapTiming.ts`, `src/lapMessages.ts`, `src/track.ts`, `src/trackData.ts`, `src/maneuvers.ts`, `src/setupRecords.ts`, `src/handlingMessages.ts`, `src/style.css`, `index.html`, `tests/race-lap-validation-track-data.test.ts`, `tests/fixtures/track-v1.json`, `tests/race-lap-validation-frozen.test.ts`, `tests/race-lap-validation-layering.test.ts`; `400 Code/Output/race-lap-validation/` (19): `00-index.md`, `01-implementation.md`, `97-changelog.md`, `98-divergences.md`, `99-traceability.md`, `core/` 7, `data/` 2, `web/` 4, `security/` 1; `300 Specs/330 D-Specs/Output/race-lap-validation/` (14): `01-architecture.md`, `98-divergences.md`, `97-changelog.md`, `core/DES-0001`, `DES-0002`, `DES-0005`, `DES-0012`, `data/DM-0002`, `web/DES-0007`, `DES-0008`, `DES-0009`, `DES-0010`, `security/DES-0011`, `reports/dspec-validation/dspec-validation-20261027-1718.md`; `300 Specs/320 F-Specs/Output/race-lap-validation/api/` (2): `API-0001`, `API-0002`; outros (3): `400 Code/Input/domain-directives.md`, `400 Code/Output/dirigibilidade/01-implementation.md`, `400 Code/Output/race-lap-validation/reports/code-validation/code-validation-20261021-1338.md`.
- Feedbacks enviados: nenhum.
