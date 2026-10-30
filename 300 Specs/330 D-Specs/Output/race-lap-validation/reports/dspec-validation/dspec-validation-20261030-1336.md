---
stage: dspec
feature: race-lap-validation
verdict: SUCCESS
generated: 2026-10-30T13:36:59Z
counts: {blocker: 0, error: 0, warning: 0, info: 3, divergence: 7}
seed: {revision: 3, digest: beee272fdb3b}
upstream: {stage: fspec, version: 1.2.1}
feedbacks: []
population: "issues de dspec-validation-20261030-1308.md (ISSUE-01 a ISSUE-03, DIV-01 a DIV-07); arquivos com version movida: 97-changelog 1.2.2, core/DES-0012 1.1.1; amostra aleatória (random.SystemRandom) de intocados: web/DES-0008 1.1.0, data/DM-0001 1.0.1"
ignored-input: "97-changelog.md, rodada 8 (motivos do gerador) — lida só como lista de arquivos movidos e itens fechados; nenhum racional recebido do chamador"
---

# Relatório de validação do D-Spec — race-lap-validation

## Summary

- F-Spec `status: validated` (`fspec-validation-20261030-1227.md`, seed `revision: 3`); itens do gate não rejulgados (§13).
- FB-01 de `dirigibilidade` (`feedback-20261030-1326.md`) fechado em `core/DES-0012` 1.1.1; posicionamento conferido na árvore (`src/physics.ts:1-4` importa `./track`, `./maneuvers`, `./trackGeometry`; `src/trackGeometry.ts` só importa `./track`).
- ISSUE-01 a ISSUE-03 do relatório anterior seguem abertas: arquivos intocados nesta rodada, citações da árvore inalteradas.
- Nenhum feedback enviado nesta rodada.

## Issues

### ISSUE-01

- severidade: info
- verificação: D2 (colaboradores conferidos na árvore)
- arquivo: `core/DES-0006-leitura-do-dado-de-pista.md` 1.1.1
- localização: seção "Colaboradores", linha 58: "É chamado por `src/main.ts` (uma vez, na inicialização, sobre `SYNTHETIC_TRACK_FILE`)"
- achado: na árvore, `readTrackData` é chamado por `selectTrainingTrack` (`src/trainingSession.ts:62`, de `pista-kart-park`), a cada escolha de pista por `chooseTrack` (`src/main.ts:227-228`), sobre `TRACK_SOURCES` (`src/main.ts:168`); `src/main.ts` não o chama.
- esperado: a frase nomeia `selectTrainingTrack` como chamador, a cada escolha de pista, sobre as fontes das duas pistas de treino.
- estado: aberta desde `dspec-validation-20261030-1308.md`

### ISSUE-02

- severidade: info
- verificação: D2 (colaboradores conferidos na árvore)
- arquivo: `web/DES-0009-inicio-de-volta-e-erros.md` 1.2.1
- localização: seção "Colaboradores", linha 74: "Chama `offeredLapKinds`, `startLap` (`src/lap.ts`) e `message`"
- achado: a seção "Interface" nomeia `beginLap` (`src/main.ts:296-297`) → `startTrainingLap` (`src/trainingSession.ts:81`) → `startLap`; "Colaboradores" segue nomeando `startLap` como chamada direta e não lista `startTrainingLap`.
- esperado: "Colaboradores" lista `startTrainingLap` (`src/trainingSession.ts`, de `pista-kart-park`) como a chamada do início, com `startLap` alcançado por ela.
- estado: aberta desde `dspec-validation-20261030-1308.md`

### ISSUE-03

- severidade: info
- verificação: D2 (posicionamento conferido na árvore); D8 (caminho de teste)
- arquivo: `web/DES-0010-resultado-da-volta.md` 1.2.1
- localização: seção "Determinismo (D-DS-07)", linhas 104-106: "troca de acerto pelo seletor existente `#handling-preset` ... (`SETUP_DIFFERS`)"
- achado: na árvore, a troca de acerto descarta o melhor registro (`bestRecord = undefined`, `src/main.ts:326`) antes de qualquer comparação; `compareLapRecords` não devolve `SETUP_DIFFERS` nesse caminho. O observável do critério continua alcançado.
- esperado: a frase atribui a ausência de comparação depois da troca de acerto ao descarte do melhor registro, e o ramo `SETUP_DIFFERS` fica provado onde é decidido (testes de `compareLapRecords` de `dirigibilidade`), como `SETUP_VERSION_DIFFERS`.
- estado: aberta desde `dspec-validation-20261030-1308.md`

## Divergences

### DIV-01

- requisito: REQ-FEAT-0002-11 com API-0001 e API-0002 (`setupId`, `setupVersion`) e SCR-0003
- exige: `startLap` aceita os dois campos, a sessão os guarda e `getLapResult` os devolve copiados sem interpretação
- hoje: satisfeito na árvore — `src/lap.ts:24`, `:31-32`, `:55-56`; o registro (`98-divergences.md`, linha da rodada de 2026-10-22) segue `open`
- etapa devedora: código, da feature `dirigibilidade`
- item de projeto: DM-0002, DES-0001, DES-0009, DES-0010
- estado: open no registro

### DIV-02

- requisito: REQ-FEAT-0010-01, -04 a -06, -09 a -11, -14, -20, -26, -28, -29; REQ-FEAT-0002-12, REQ-FEAT-0004-13 no treino
- exige: treino como sequência de voltas de um único `startLap`, sem `ENDED` na chegada nem no corte, 1 resultado por volta
- hoje: `src/lap.ts:252-256` e `:269` (`ENDED` na chegada e no corte); sem `lapSequenceCount`/`lapStartMs` em `src/lap.ts`
- etapa devedora: código
- item de projeto: DM-0002, DES-0001, DES-0002, DES-0003, DES-0004, ADR-0006
- estado: open

### DIV-03

- requisito: REQ-FEAT-0010-15 a -18, -30
- exige: `PAUSE_BUTTON` e `NOT_TRAINING`; `endTraining`; botão de pausa e "encerrar treino" nos dois canais
- hoje: `src/lap.ts:12` (`PauseCause` sem `PAUSE_BUTTON`); sem `endTraining` em `src/lap.ts`
- etapa devedora: código
- item de projeto: DES-0001, DES-0007, DES-0008, ADR-0005
- estado: open

### DIV-04

- requisito: REQ-FEAT-0010-02, -07, -12, -13, -19, -23 a -25, -27
- exige: painel do resultado de cada volta do treino, melhor volta válida, "—" em setor sem tempo
- hoje: sem `bestValidLapMs` e sem `trainingLapMs`/`trainingSectorMs` em `src/lap.ts`; resultado só na tela de volta encerrada (`src/main.ts:524-538`)
- etapa devedora: código
- item de projeto: DES-0005, DES-0008, DES-0010
- estado: open

### DIV-05

- requisito: REQ-FEAT-0002-14
- exige: limite de setor registrado no primeiro cruzamento no sentido da pista depois da última fronteira registrada
- hoje: `src/lap.ts:247-251` testa só o próximo limite na ordem
- etapa devedora: código
- item de projeto: DES-0003, DM-0002
- estado: open

### DIV-06

- requisito: REQ-FEAT-0010-27; REQ-FEAT-0010-02 e -24 numa pista `INCOMPLETE`
- exige: linhas declaradas de uma leitura `INCOMPLETE` com chegada e sentido avaliadas; resultado sem setores numa pista sem setores
- hoje: `src/lap.ts:111-113` e `:296-300`
- etapa devedora: código
- item de projeto: DES-0003, DES-0005, ADR-0004
- estado: open

### DIV-07

- requisito: API-0001 1.2.0 (`listLapResults`) e o gancho de resultado da aplicação
- exige: leitura de todos os resultados desde o último `startLap`; cada resultado novo tratado uma vez
- hoje: sem `listLapResults` em `src/lap.ts`; o registro roda só quando a fase chega a `ENDED` (`src/main.ts:524-538`)
- etapa devedora: código
- item de projeto: DES-0001, DES-0007
- estado: open

## Coverage

- requisitos cobertos: 161 de 161 REQ-* do F-Spec; descobertos: 0.
- itens de projeto sem origem: 0.
- critérios sem caminho de teste alcançável: 0 de 99 AC-US-*; nenhum por configuração, ponto de entrada ou gancho só de teste.
- linhas de `98-divergences.md` sem item de projeto que as feche: 0 (arquivo intocado nesta rodada).
