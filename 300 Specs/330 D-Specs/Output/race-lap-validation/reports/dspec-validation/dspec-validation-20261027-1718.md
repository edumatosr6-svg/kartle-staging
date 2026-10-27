---
stage: dspec
feature: race-lap-validation
verdict: SUCCESS
generated: 2026-10-27T17:26:23Z
counts: {blocker: 0, error: 0, warning: 0, info: 1, divergence: 1}
seed: {revision: 2, digest: ee91c5706be1}
upstream: {stage: fspec, version: 1.1.0}
feedbacks: []
---

# Relatório de validação do D-Spec — race-lap-validation

## Summary

- Rodada: revalidação; relatório anterior `dspec-validation-20261022-1754.md` (SUCCESS: 0 issues, DIV-01).
- População (conventions §8): issues anteriores: nenhuma; DIV-01 reverificada; arquivos com `version:` movida desde aquele relatório: `test-strategy.md` 1.1.2, `97-changelog.md` 1.1.2; amostra aleatória de dois intocados (`random.SystemRandom().sample` sobre os 21 restantes): `core/DES-0006` 1.1.0, `core/DES-0001` 1.1.0.
- Entradas da rodada: F-Spec com `status: validated` em todos os 29 arquivos (`fspec-validation-20261022-1624.md`; `97-changelog.md` 1.1.0; API-0001 1.1.0, API-0002 1.1.0, API-0003 1.0.1, FEAT-0004 1.0.0, FEAT-0005 1.0.0, RULE-0002); diretrizes `330 D-Specs/Input/domain-directives.md` e `100 Admin/120 Processes/domain-invariants.md`; feedback pendente `reports/feedbacks/modelo-kart-01/feedback-20261022-1840.md` (FB-01, `scope`), respondido no `97-changelog.md` 1.1.2 (§17).
- Racional do gerador: nenhum recebido do chamador. A seção "Decisões do autor para esta rodada" do `97-changelog.md` 1.1.2 chegou com o conjunto e foi ignorada como evidência (§8); o registro foi lido só como lista de itens fechados e recusados (§17).
- Itens do gate (front matter, ids, índice, traceabilidade, arquivos obrigatórios, `OPEN`/`TBD`) não rejulgados (§13).
- D1 além do gate, na população: links relativos conferidos por script (12 links, 0 quebrados); nenhum bloco mermaid nos quatro arquivos.
- Posicionamento verificado na árvore (somente fatos de posição): `src/lap.ts:3-6` (importa só `physics`, `track`, `trackData`, `lapTiming`), `:23` (`LapRequest` com `challengeNumber?`, `setupId?`, `setupVersion?`), `:123-124` e `:278-279` (os dois campos copiados para a sessão e para o resultado), `:180` (`if (lap.phase !== 'RUNNING') return lap`); `src/main.ts:161` (`readTrackData(SYNTHETIC_TRACK_FILE)`, uma vez), `:226` (`startLap` com `setupId`/`setupVersion`), `:403` (laço avança só em `COUNTDOWN`/`RUNNING`); `src/track.ts:2,3,7,20,22,27,42,62` (`WIDTH`, `track`, `nearest`, `Line`, `sideOf`, `crossLine`, `SYNTHETIC_TRACK_FILE`, `LapTracker`); `src/trackData.ts:3` (importa só `./track`), `:5-8` (`TRACK_SCHEMA_VERSION`, `DEFAULT_CUT_DISTANCE_M`, `DEFAULT_CUT_DURATION_MS`, `BARRIER_REACH_M`), `:81` (`readTrackData`), `:138` (`checkConsistency`); `src/lapTiming.ts:6,11,17` (`COUNTDOWN_STEPS`, `toMs`, `interpolateMs`); `src/physics.ts:5,107,165,319` (`STEP`, `initialState`, `CIRCUIT`, `step`); `src/setupRecords.ts:4` (importa `./lap`; sentido inverso confirmado); `scripts/keyboard-lap.ts:7-9` (importa `physics`, `lap`, `lapTiming`; não importa `LapTracker`); usuários de `LapTracker`: `src/track.ts`, `src/physics.ts`, `tests/physics.test.ts`, `tests/race-lap-validation-frozen.test.ts`, `tests/race-lap-validation-layering.test.ts`; `tests/helpers/autopilot.ts:17` (`autopilot`), `:92` (`seedLap`, cópia de `LapSession`), `:98` (`kartAt`); nenhum símbolo `seedLap` ou gancho de teste em `src/`; `tests/race-lap-validation-validity.test.ts:149-154` (CHK-TEST-0005-11: `seedLap(started, { kart: kartAt(m2.index + 3), markersPassedCount: 1 })`); `tests/race-lap-validation-cut.test.ts:55-58` (CHK-TEST-0006-03, `autopilot(-7)`, 600 passos), `:67-74` (CHK-TEST-0006-04, `kartAt(40, 0, WIDTH / 2 + 2)`, `toMs(600)`), `:116-119` (CHK-TEST-0006-08); os 14 arquivos `tests/race-lap-validation-<área>.test.ts`, `tests/fixtures/track-v1.json`, `tests/helpers/seeded.ts`, `src/lapMessages.ts`, `src/frameClock.ts`, `docs/lap-validation-bench.md`, `docs/lap-validation-device-log.md`, `package.json:11` (`bench:handling`).
- D8 em `test-strategy.md` 1.1.2: 9 de 9 `FEAT-*` com nível; 72 de 72 `AC-*` do F-Spec com caminho (0 sem linha, 0 linhas fora do F-Spec); 12 de 12 NFR com prova; AC-US-0004-06 alcançado por estado semeado (`seedLap`, dado simples, sem gancho em `src/`) coerente com REQ-FEAT-0004-06 ("cruza a chegada sem passar por um dos seus marcadores"); AC-US-0006-03 alcançado por pilotagem a 1,5 m com oráculo (máximo menor ou igual a 3 m) e por kart parado a 2 m, coerente com REQ-FEAT-0005-03 ("no máximo 3 m, por qualquer duração"); critério e limiar inalterados; nenhum `AC-*` por configuração, ponto de entrada ou gancho só de teste.
- D3 em `97-changelog.md` 1.1.2: a recusa de FB-01 (`modelo-kart-01`) não contradiz o F-Spec desta feature — RULE-0002:31 (`stepCount` nunca avança em `ENDED`), :63 ("a volta encerrada ignora novos eventos"), :65 (nenhuma transição a partir de `ENDED`) dizem o que INV-1 de DM-0002 diz; nenhum `REQ-*` desta feature exige passos aceitos em `ENDED`; nenhuma refatoração ou remoção não pedida (I10); nenhum feedback enviado.
- D6 (D-DS-06): varredura por segredo, credencial ou token sobre todo o conjunto: nenhuma ocorrência.
- `status: validated` aplicado aos 2 arquivos que liam `draft` (`test-strategy.md`, `97-changelog.md`); `00-index.md` e `99-traceability.md` regenerados com `lint_artifacts.py --stage dspec --feature race-lap-validation --emit` (gate: 0 erros, 23 arquivos); nenhum arquivo do conjunto lê `draft`.

## Issues

### ISSUE-01

- severidade: info
- verificação: D2 (colaboradores conferidos na árvore)
- arquivo: `core/DES-0006-leitura-do-dado-de-pista.md` 1.1.0
- localização: seção "Posicionamento", item `src/track.ts` (alterado): "`LapTracker` ... continua exportado, sem alteração de código, só para `scripts/keyboard-lap.ts` (`bench:handling`) e para o teste existente de `tests/physics.test.ts`"
- achado: `scripts/keyboard-lap.ts:7-9` importa `PUBLISHED_SETUPS` de `src/physics.ts`, `startLap`/`stepLap` de `src/lap.ts` e `COUNTDOWN_STEPS` de `src/lapTiming.ts` e não referencia `LapTracker`; os usuários de `LapTracker` na árvore são `tests/physics.test.ts`, `tests/race-lap-validation-frozen.test.ts` e `tests/race-lap-validation-layering.test.ts`.
- esperado: a frase nomeia os usuários que existem (`tests/physics.test.ts`, `tests/race-lap-validation-frozen.test.ts`, `tests/race-lap-validation-layering.test.ts`) e deixa de citar `scripts/keyboard-lap.ts`; a regra (exportação mantida, código inalterado, NFR-0011) não muda. Correção do gerador, não aplicada.

## Divergences

### DIV-01

- requisito: REQ-FEAT-0002-11 com API-0001 1.1.0, API-0002 1.1.0 e SCR-0003 1.1.0
- exige: `startLap` aceita `setupId` e `setupVersion`; a sessão os guarda; `getLapResult` os devolve copiados sem interpretação e ausentes quando o pedido não os traz; a tela só compara tempos com `comparability` `COMPARABLE`
- hoje: satisfeito na árvore — `src/lap.ts:23` (`LapRequest` com `setupId?`, `setupVersion?`), `:30-31` e `:54-55` (sessão e resultado com os dois campos), `:123-124` (copiados para a sessão só quando presentes), `:278-279` (copiados para o resultado só quando presentes); `src/main.ts:226` (`startLap` com `setupId: setup.setupId, setupVersion: setup.setupVersion`); commit `767508e` ("dirigibilidade: código da rodada 3 — setupId/setupVersion no resultado da volta")
- etapa devedora: código, da feature `dirigibilidade`
- item de projeto: DM-0002, DES-0001, DES-0009, DES-0010
- estado: open no registro (`98-divergences.md` 1.1.0, linha 36, cuja coluna "hoje" cita a árvore anterior ao commit); a passagem a `resolved`, com o nome da mudança, é da etapa devedora (§6) — fora da escrita deste validador. As 12 linhas da rodada 1 não foram rejulgadas (população §8).

## Coverage

- `REQ-*` do F-Spec: 129 cobertos, 0 descobertos (traceabilidade gerada, 241 linhas; `REQ-*` na traceabilidade sem origem no F-Spec: 0).
- Contratos, nos itens da população: DES-0001 `startLap` com `{lapKind, trackId, trackVersion, challengeNumber?, setupId?, setupVersion?}` e as quatro rejeições de API-0002 (`LAP_ALREADY_ACTIVE`, `TRACK_DATA_UNREADABLE`, `TRACK_SCHEMA_UNSUPPORTED`, `OFFICIAL_NOT_AVAILABLE`); `pauseLap` com `ESC_KEY`/`FOCUS_LOST`/`SENSOR_LOST` e `NO_ACTIVE_LAP`/`LAP_ENDED`/`ALREADY_PAUSED`; `resumeLap` com `NO_ACTIVE_LAP`/`LAP_ENDED`/`NOT_PAUSED`; `repositionKart` com `NO_ACTIVE_LAP`/`LAP_ENDED`/`NOT_RUNNING`; `getLapState`/`getLapResult` com `NO_ACTIVE_LAP`/`NO_RESULT` e os campos opcionais de API-0001 1.1.0; DES-0006 `readTrackData` com os quatro `trackDataStatus` de API-0003, `UNSUPPORTED_SCHEMA` devolvido com `schemaVersion`, `UNREADABLE` sem outro campo, forma plana, leitura sem efeito.
- Unidades nos itens da população: `countdownRemainingMs`, `elapsedMs` (ms), `stepCount`/`countdownSteps` (passos), 360 passos = 3000 ms, `DEFAULT_CUT_DISTANCE_M` 3 m, `DEFAULT_CUT_DURATION_MS` 1000 ms, `BARRIER_REACH_M`, `headingDeg`; nenhum numérico sem unidade.
- D7 nos itens da população: chave de deduplicação (volta ativa e fase), unicidade do resultado (criado uma vez em `ENDED`), contador de sequência (`stepCount` só em `RUNNING`), comportamento em timeout/dependência/escrita parcial declarado (DES-0001); leitura pura sem estado, sem rede, D-DS-03 não aplicável declarado (DES-0006).
- D-DS-07 nos itens da população: passo fixo, sem relógio nem sorteio nem DOM, prova nomeada (`tests/race-lap-validation-determinism.test.ts`, `-layering`, `-track-data`; existem).
- Camadas (D-DS-01, I2) nos itens da população: `src/main.ts` → `src/lap.ts` → `src/physics.ts`/`src/track.ts`/`src/trackData.ts`/`src/lapTiming.ts`; `src/trackData.ts` → `src/track.ts`; `src/setupRecords.ts` → `src/lap.ts` (nunca o inverso); nenhuma importação de `three`, DOM, `src/audio.ts` ou `src/main.ts` em `src/lap.ts`.
- Chaves de feature: nenhuma, com o motivo citado do F-Spec (FEAT-0001, FEAT-0003, FEAT-0008, FEAT-0009: "Configuração: Nenhuma"); I4 do projeto ("Safe defaults") não exige chave mestra; nenhuma superfície nova.
- Critérios `AC-*` desta feature sem caminho de teste: 0 de 72; `FEAT-*` sem nível: 0 de 9; NFR sem prova: 0 de 12.
- Itens de projeto sem origem: 0 (traceabilidade gerada).
- `OPEN-<nn>` e `TBD`: do gate, não rejulgados.
- Feedbacks enviados: nenhum.
