---
stage: dspec
feature: race-lap-validation
verdict: FAIL
generated: 2026-10-30T13:04:23Z
counts: {blocker: 0, error: 1, warning: 0, info: 5, divergence: 7}
seed: {revision: 3, digest: beee272fdb3b}
upstream: {stage: fspec, version: 1.2.1}
feedbacks:
  - "300 Specs/330 D-Specs/Output/pista-kart-park/reports/feedbacks/race-lap-validation/feedback-20261030-1256.md"
  - "300 Specs/330 D-Specs/Output/dirigibilidade/reports/feedbacks/race-lap-validation/feedback-20261030-1256.md"
population: "issues de dspec-validation-20261027-1718.md (ISSUE-01, DIV-01); arquivos com version movida: 01-architecture 1.2.0, 97-changelog 1.2.0, 98-divergences 1.2.0, ADR-0004 1.1.0, ADR-0005 1.1.0, ADR-0006 1.0.0 (novo), DES-0001 1.2.0, DES-0002 1.1.0, DES-0003 1.1.0, DES-0004 1.1.0, DES-0005 1.1.0, DES-0012 1.1.0, DM-0002 1.2.0, DES-0011 1.2.0, test-strategy 1.2.0, DES-0007 1.1.0, DES-0008 1.1.0, DES-0009 1.2.0, DES-0010 1.2.0; amostra aleatória (random.SystemRandom) de intocados: data/DM-0001 1.0.1, adr/ADR-0002 1.0.0"
ignored-input: "97-changelog.md, rodada 6 (decisões e recomendações do gerador, inclusive as dirigidas ao validador) — lida só como lista de itens fechados e recusados; nenhum racional recebido do chamador"
---

# Relatório de validação do D-Spec — race-lap-validation

## Summary

- F-Spec `status: validated` (`fspec-validation-20261030-1227.md`, seed `revision: 3`); itens do gate não rejulgados (§13).
- REQ-* do F-Spec: 161, todos realizados por ao menos um item de projeto; AC-US-*: 99 de 99 com linha na estratégia; FEAT-0001 a FEAT-0010 com nível.
- Links relativos do conjunto: 76, 0 quebrados; um bloco mermaid (`01-architecture.md`).
- Feedbacks `scope` enviados: FB-01 a `pista-kart-park`, FB-01 a `dirigibilidade` (fora do veredito).

## Issues

### ISSUE-01

- severidade: info
- verificação: D2 (colaboradores conferidos na árvore)
- arquivo: `core/DES-0006-leitura-do-dado-de-pista.md` 1.1.0
- localização: seção "Posicionamento", item `src/track.ts`: "`LapTracker` ... só para `scripts/keyboard-lap.ts` (`bench:handling`) e para o teste existente de `tests/physics.test.ts`"
- achado: aberta desde `dspec-validation-20261027-1718.md`; arquivo intocado; `scripts/keyboard-lap.ts` não referencia `LapTracker`; os usuários na árvore são `tests/physics.test.ts`, `tests/race-lap-validation-frozen.test.ts` e `tests/race-lap-validation-layering.test.ts`.
- esperado: a frase nomeia esses três usuários e deixa de citar `scripts/keyboard-lap.ts`; a regra não muda.

### ISSUE-02

- severidade: error
- verificação: D3 (NFR deferido projetado com o mecanismo que atende ao limiar: NFR-0007); conjunto contradiz a si mesmo (conventions §6)
- arquivo: `test-strategy.md` 1.2.0
- localização: tabela "NFR | Como é provado", linha NFR-0007 (linha 211): "`lap-messages` (20 chaves nos dois idiomas)"
- achado: `web/DES-0008-hud-da-volta-mensagens-e-idioma.md` 1.1.0 declara 24 chaves (linha 81, "São 24 chaves") e a prova "as 24 chaves existem nos dois idiomas" (linha 152); a estratégia mantém 20, deixando `pauseAction`, `endTrainingAction`, `bestValidLap` e `sectorNoTime` fora da prova bilíngue de NFR-0007 que ela nomeia.
- esperado: a linha NFR-0007 de `test-strategy.md` diz 24 chaves, a mesma contagem e a mesma prova de DES-0008.

### ISSUE-03

- severidade: info
- verificação: D2 (colaboradores conferidos na árvore)
- arquivo: `core/DES-0004-corte-e-grama.md` 1.1.0
- localização: seção "Interface", `edgeDistanceM(point)`; seção "Colaboradores": "Chama `nearest` e `WIDTH` (`src/track.ts`)"
- achado: na árvore, `evaluateCut` (`src/lap.ts:263-270`) mede a borda por `trackEdgeDistanceM(session.environment, kart)` de `src/physics.ts:185-187`, que usa a geometria do arquivo de pista quando o ambiente a traz e só sem ela a expressão de `edgeDistanceM`; o item descreve só a borda da pista sintética.
- esperado: a interface e os colaboradores nomeiam a medida por ambiente (`trackEdgeDistanceM`, `session.environment`) como o caminho da sessão, mantendo `edgeDistanceM` como o caso da pista sintética.

### ISSUE-04

- severidade: info
- verificação: D2 (colaboradores conferidos na árvore)
- arquivo: `core/DES-0005-tipos-de-volta-e-reposicionamento.md` 1.1.0
- localização: seção "Interface", "Destino do reposicionamento" (`nearest(kart).position`, rumo de `track[i]` a `track[i + 1]`); seção "Colaboradores": "Chama `nearest` e `track` (`src/track.ts`)"
- achado: na árvore, `repositionKart` (`src/lap.ts:159-172`) usa `nearestOnTrack(lap.environment, from)` (`src/lap.ts:174-182`), que recorre a `nearestOnCenterline` de `src/trackGeometry.ts` quando o ambiente traz a geometria do arquivo; o item descreve só a linha central sintética.
- esperado: o destino e os colaboradores nomeiam a linha central do ambiente da sessão (`nearestOnTrack`, `nearestOnCenterline`), com a sintética como caso sem geometria.

### ISSUE-05

- severidade: info
- verificação: D2 (posicionamento conferido na árvore)
- arquivo: `web/DES-0009-inicio-de-volta-e-erros.md` 1.2.0
- localização: seção "Interface", parágrafo "Cada botão ... dispara `startLap(lap, {...}, reading, config)`" e as citações `src/main.ts:122`, `:160`, `:228`, `:248-253`
- achado: na árvore, `setup` está em `src/main.ts:131`, `setupRef` em `:165` e `:299`, o seletor `#handling-preset` em `:320-331`; `:122`, `:160`, `:228` e `:248-253` contêm outro código; o botão da oferta chama `beginLap` (`src/main.ts:296-297`), que inicia a volta por `startTrainingLap` (`src/trainingSession.ts:81-87`), e não `startLap` diretamente.
- esperado: as citações apontam as linhas atuais e o caminho de início nomeia `beginLap` → `startTrainingLap` → `startLap` com `TRAINING`, como DES-0007 já faz.

### ISSUE-06

- severidade: info
- verificação: D2 (posicionamento conferido na árvore)
- arquivo: `web/DES-0010-resultado-da-volta.md` 1.2.0; `test-strategy.md` 1.2.0
- localização: DES-0010, seção "Determinismo (D-DS-07)": "não são alcançáveis pela tela desta feature (uma única pista empacotada ...)"; test-strategy, roteiro E2E-02, mesma frase
- achado: a árvore empacota duas pistas de treino (`TRAINING_TRACKS`, `src/trainingSession.ts:12-15`), trocadas por `chooseTrack` (`src/main.ts:227`), e `renderBest` compara o melhor registro com a pista corrente (`src/main.ts:289-295`); `TRACK_DIFFERS` é alcançável pela tela.
- esperado: a frase deixa de afirmar uma única pista empacotada; o ramo `TRACK_DIFFERS` é alcançado em E2E-02 pela troca de pista, ou a sua ausência de roteiro tem outro motivo verdadeiro.

## Divergences

### DIV-01

- requisito: REQ-FEAT-0002-11 com API-0001 e API-0002 (`setupId`, `setupVersion`) e SCR-0003
- exige: `startLap` aceita os dois campos, a sessão os guarda e `getLapResult` os devolve copiados sem interpretação
- hoje: satisfeito na árvore — `src/lap.ts:24` (`LapRequest`), `:31-32` (sessão), `:55-56` (resultado); o registro (`98-divergences.md`, linha da rodada de 2026-10-22) segue `open` citando a árvore anterior
- etapa devedora: código, da feature `dirigibilidade` (a passagem a `resolved` é dela)
- item de projeto: DM-0002, DES-0001, DES-0009, DES-0010
- estado: open no registro

### DIV-02

- requisito: REQ-FEAT-0010-01, -04 a -06, -09 a -11, -14, -20, -26, -28, -29; REQ-FEAT-0002-12, REQ-FEAT-0004-13 no treino
- exige: treino como sequência de voltas de um único `startLap`, sem `ENDED` na chegada nem no corte, 1 resultado por volta
- hoje: `src/lap.ts:252-256`, `:269`, `:272-280` (`ENDED` na chegada e no corte), `:48` (`result` único), `:26-49` (sem `lapSequenceCount`/`lapStartMs`), `src/main.ts:499` (laço para em `ENDED`)
- etapa devedora: código
- item de projeto: DM-0002, DES-0001, DES-0002, DES-0003, DES-0004, ADR-0006
- estado: open

### DIV-03

- requisito: REQ-FEAT-0010-15 a -18, -30
- exige: `PAUSE_BUTTON` e `NOT_TRAINING`; `endTraining`; botão de pausa e "encerrar treino" nos dois canais
- hoje: `src/lap.ts:12` (`PauseCause` sem `PAUSE_BUTTON`), `:144-149`; sem `endTraining`; `src/main.ts:341`, `:597-599` (`#pause` só continua); `index.html:33` sem ação de encerrar
- etapa devedora: código
- item de projeto: DES-0001, DES-0007, DES-0008, ADR-0005
- estado: open

### DIV-04

- requisito: REQ-FEAT-0010-02, -07, -12, -13, -19, -23 a -25, -27
- exige: painel do resultado de cada volta do treino, melhor volta válida, "—" em setor sem tempo
- hoje: `src/main.ts:439-469` e `:592` (só tela de resultado de volta encerrada); `src/lap.ts:198-220` sem `bestValidLapMs`; `src/lap.ts:51-63` sem `trainingLapMs`/`trainingSectorMs`; `src/lapMessages.ts:6-11` sem as quatro chaves novas
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
- hoje: `src/lap.ts:111-113` descarta as linhas de uma leitura `INCOMPLETE`; `src/lap.ts:296-300` monta `sectorMs` com qualquer número de fronteiras
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
- itens de projeto sem origem: 0 (nenhum REQ-* em `sources` fora do F-Spec).
- critérios sem caminho de teste alcançável: 0 de 99 AC-US-*; nenhum por configuração, ponto de entrada ou gancho só de teste.
- linhas de `98-divergences.md` sem item de projeto que as feche: 0 de 19; as 12 linhas da rodada 1 não rejulgadas quanto ao estado (devedora: código).
- scope (fora do veredito): FB-01 a `pista-kart-park` e FB-01 a `dirigibilidade` — D5/I3, a aposentadoria da volta `TRAINING` única (ADR-0006) alcança verificações dessas features que esperam `ENDED` em voltas `TRAINING`.
