---
title: Registro de mudanças — pista Kart Park (estágio de código)
feature: pista-kart-park
stage: code
status: draft
version: 1.0.0
sources: []
---

# Registro de mudanças

## 2026-10-27 — rodada 1, Mode A (projeto 1.0.1/1.1.0, `dspec-validation-20261022-1631`; sobre `6ea3862`, após `b86b200` de `dirigibilidade`)

**O que mudou**

- `src/trackGeometry.ts` (DES-0002): tipos `TrackPoint`, `CurbSpan`, `BarrierLine`, `TrackSurface`, `TrackGeometry` congelada;
  `buildTrackGeometry` (normais pela diferença dos vizinhos com a regra determinística para a diferença nula, bordas, quadriláteros
  de asfalto, quadriláteros de zebra com quebras em `fromLapM`, em cada ponto interno e em `toLapM`, segmentos de barreira, caixa,
  grade de 8 m), `classifySurface` (asfalto, zebra, grama; grade só poda), `beyondTrackEdgeM` (0 na pista; fora, varredura completa),
  `nearestOnCenterline`, `lapMAtIndex`, `positionAtLapM`, `nearestBarrier`, `centerlineCrossings`, `windingSumOf`, `pointInQuad`,
  `closestOnSegment`; `GRID_CELL_M` 8, `BARRIER_HALF_WIDTH_M` 0,1, `BARRIER_TOUCH_TOLERANCE_M` 0,01.
- `src/trackData.ts` (DES-0001, DM-0001, ADR-0001): `TRACK_SCHEMA_VERSION` 3; `Schema3Fields`; `TrackReading` com os quatro campos
  opcionais; ordens 6 e 7 (`readSchema3Fields`: `centerline` ≥ 3 pontos finitos com largura > 0, `curbs` com `side`, `0 <= from < to
  <= lapLengthM + 0,001`, `widthM > 0`, `barriers` com ≥ 2 pontos finitos, `osmDerived` booleano, padrões neutros), ordem 8 com
  `checkConsistencyV3` na versão 3 e `checkConsistency` na 2; `checkConsistencyV3` C1 a C7 v3 sobre a geometria do arquivo (C6: pontas
  na grama; C7: largada do lado de depois da chegada, 2 m dos marcadores e limites). Caminho da versão 2 sem mudança.
- `src/physics.ts` (DES-0003, ADR-0003, ADR-0004): `Surface` com `curb`; `CURB_GRIP_PC` 0,85; `surfaceMu` em `tireForce` e no freio
  assistido; `curbFraction`/`grassFraction` na média da assistência e na perda da grama; `onRoad` e o cancelamento do drift por roda
  na grama; `Environment.track`; `trackEnvironment` (`walls: false`); `trackEdgeDistanceM`; bloco da barreira por subpasso depois do
  muro (trajeto, superfície, resposta 1,12/0,65/cancelar, `barrierContactPoint`); telemetria `barrierTouching`/`barrierContact`
  (contato só no passo da entrada, nada consultado sem `track` ou sem barreira); `getTrackContact` (API-0003 campo a campo).
- `src/lap.ts` (DES-0004): `kartAtStart`; `evaluateCut` por `trackEdgeDistanceM(session.environment, kart)`; `repositionKart` na
  linha central do arquivo com `track`, ou na sintética; `edgeDistanceM` mantido e exportado.
- `src/trainingSession.ts` (DES-0005, DM-0002): `TRAINING_TRACKS` (duas entradas, sem recorde), `OPENING_TRACK_ID`,
  `initialTrainingSession`, `getTrainingTrackOptions`, `selectTrainingTrack` (tabela de API-0002: `UNKNOWN_TRACK`, mesma pista
  `READY` sem efeito, nova `READY` com ambiente e kart na largada e volta descartada, `FAILED` por `UNREADABLE`/`trackId` diferente ou
  `UNSUPPORTED_SCHEMA`), `startTrainingLap` (sempre `TRAINING`, nunca `challengeNumber`), `trainingIdleKart`.
- `src/curbFeedback.ts` (DES-0009): `CURB_PULSE_MS` 20, `CURB_PULSE_INTERVAL_STEPS` 30, `CURB_SOUND_REPEAT_STEPS` 12,
  `initialCurbFeedback`, `decideCurbFeedback` (tabela de RULE-0004, deduplicação por `simStepCount`).
- `src/audio.ts` (DES-0009, ADR-0006): `SoundSignal`, `ENGINE_SOUND` (`triangle`, 0,045), `REWARD_SOUND` (`sine`, 180 ms, 0,035),
  `CURB_SOUND` (`noise`, 160 Hz, 60 ms, 0,05); `toggle`/`update`/`reward` constroem o sinal dos descritores com os mesmos valores de
  hoje; `curb()` (ruído branco de semente fixa, `lowpass` 160 Hz, ataque 5 ms, queda exponencial; nenhum nó sem contexto ou com o som
  desligado); `soundOn()`.
- `src/lapMessages.ts` (DES-0007): `OSM_CREDIT`, `creditFor`, `optionLabel`; `MESSAGES` intacto (20 chaves); importa só tipos de `./lap`.
- `src/trackScene.ts` (DES-0008, ADR-0006): `buildTrackScene` (filhos `asphalt` `#434d48` a y 0,03, `curbs` com cores por vértice
  `#c8423b`/`#f0e9d5` em faixas de `CURB_STRIPE_M` 1 m a y 0,035, `barriers` `InstancedMesh` 0,2 × 0,9 m `#e6dfc9` com sombra,
  `start-line` quadrados 1,1 × 0,7 m); `minimapTransform` (caixa em 200 × 130 px centrada em 220 × 150 px).
- `src/main.ts` (DES-0007, DES-0008, DES-0009): importação `?raw` da Kart Park; `syntheticScene` agrupando a cena sintética;
  `TRACK_SOURCES`, `training`, `reading` (da sessão), `trackBounds`/`trackGeometry`/`trackScenes`/`curbState`; `renderCredit`
  (`textContent` e `setAttribute`, nunca `innerHTML`); `chooseTrack` (seleção, avisos `track-data`, cena, minimapa, caixa da câmera,
  `#track-name`, `renderBest`); `renderOffer` com chave `lang:sessionState:selectedTrackId:trackDataStatus`, seletor com `aria-pressed`,
  crédito, `loadingTrack`/`trackDataError`/`trackId`, oferta só de treino; `beginLap()` por `startTrainingLap`; minimapa da sessão;
  crédito em `#lap-result-credit`; retorno da zebra no laço de passos (`getTrackContact` → `decideCurbFeedback` →
  `navigator.vibrate(20)` / `audio.curb()`); kart ocioso da sessão; `chooseTrack(OPENING_TRACK_ID)` na carga.
- `index.html`, `src/style.css`, `src/rawImports.d.ts`: contêineres `#track-selector`, `#track-credit`, `#lap-result-credit`,
  `#track-name` (texto fixo "Circuito Aurora" retirado); regras `.track-selector` e `.track-credit a`; tipo de `*.json?raw`.
- `scripts/trackPrep.ts`, `scripts/trackChecks.ts`, `scripts/track-pipeline.ts`, `tracks/sources/kart-park.json`,
  `src/tracks/kart-park-v1.json`, `tracks/registry.json`, `package.json` (DES-0010, DES-0011, DM-0001, DM-0002, ADR-0002, ADR-0006):
  preparo (conversão, suavização pela regra do comprimento, larguras, zebras por índice fracionário com a divisão na largada e a
  redução pela folga de grama, barreira entre os trechos de 371–414 m e 580–615 m, largada, chegada, limites, marcadores, linhas
  transversais, serialização determinística), verificações V01 a V18, programa com `prepare`/`verify`/`publish`/`promote` e a
  validação de argumentos antes de qualquer leitura; o arquivo publicado e o registro gerados uma vez. Medidas em
  `01-implementation.md`.
- Manifesto: `01-implementation.md`, `core/DES-0001` a `DES-0006`, `data/DM-0001`, `DM-0002`, `web/DES-0007` a `DES-0009`,
  `pipeline/DES-0010`, `DES-0011`, `security/DES-0012`, `98-divergences.md`; `00-index.md` e `99-traceability.md` por `lint_artifacts.py --emit`.

**Decisões de implementação, onde o projeto deixava detalhe em aberto ou o dado contrariou a hipótese** (nenhuma muda contrato nem
requisito; detalhadas em `01-implementation.md`)

- `startTrainingLap` recebe `setup?: SetupRef` opcional e o copia ao pedido, preservando `LapResult.setupId`/`setupVersion` que
  `src/main.ts` já passava (FB-01 de `dirigibilidade`); sem o parâmetro, `main.ts` chama exatamente como DES-0005 descreve.
- Marcha da linha transversal medida pela distância além da borda da pista (com refino a 2,99 m), sem teto na normal; borda voltada
  para o outro trecho pela amostra mais próxima; V13 com toque dentro de 0,002 m.
- `trackBounds` por sessão para a câmera de visão geral de `modelo-kart-01`; a linha da caixa de sombra de DES-0008 não se aplica mais.
- `renderBest()` em `chooseTrack`; `curbQuads` plana com `curbQuadSpan`; funções auxiliares de geometria exportadas.

**Itens fechados**: nenhum `ISSUE-<nn>` ou `FB-<nn>` pendente (primeira geração; nenhum relatório de validação de código e nenhum
feedback de outra feature dirigido a esta).

**Itens recusados, com motivo**

- `tests/pista-kart-park-*.test.ts`, `tests/helpers/kartParkPilot.ts`, `tests/fixtures/kartParkFiles.ts`,
  `docs/kart-park-device-log.md`: pertencem ao estágio de testes (`test-strategy.md`); as linhas de `98-divergences.md` que nomeiam
  provas de `npm test` ficam `open` para aquele estágio.
- Editar `tests/race-lap-validation-track-data.test.ts` (CHK-TEST-0009-02) ou `tests/modelo-kart-01-contract.test.ts` /
  `tests/fixtures/kart01-sim-baseline.json` (CHK-TEST-0004-13), ou regravar a linha de base com `baseline:kart01 -- --force`:
  arquivos de outras features e do estágio de testes (conventions §14); as duas reprovações são registradas em `98-divergences.md`
  com a causa (mudanças que o projeto manda: esquema 3 com a sintética em 2; dois campos novos na telemetria) e a prova de que os
  números não mudaram. O ajuste é feedback para `race-lap-validation` (já previsto em `01-architecture.md`, "Consequências para outras
  features") e para `modelo-kart-01` (linha de base regravada com a telemetria nova ou comparação restrita aos campos de então).
- Suavizar a linha central além da regra de ADR-0006 (que escolhe k = 0 sobre este dado) ou fixar uma janela de 12 m: a regra do
  projeto é determinística e registrada; mudar o valor seria mudança de projeto (ver proposta abaixo).
- Crédito da Esri, chave de configuração para a pista de abertura, zebra ou barreira, promoção a produção: proibidos por ADR-0005,
  FEAT-0001/0005/0007; `promote` fica disponível para a etapa de deploy com a referência da decisão.
- Dividir `src/main.ts`, trocar a cena da pista sintética, mudar a câmera ou a caixa de sombra: fora do escopo (o projeto diz "os
  mesmos objetos, com os mesmos valores").
- Nenhum limiar afrouxado, nenhum requisito enfraquecido, nenhuma dependência acrescentada, nenhum valor de preset tocado.

**Migração de verificações existentes**: nenhuma verificação foi removida ou alterada; `npx tsx --test tests/*.test.ts` 294/296 (as
duas reprovadas acima, por mudança mandada pelo projeto); `npx tsc --noEmit -p .` 0; `npx vite build` 0; `bench:handling` 46/46;
`bench:physics` 10/10.

**Proposta ao autor** (para `SCOPE-BACKLOG.md` ou revisão do projeto): a regra de suavização de ADR-0006 (iterações escolhidas pelo
comprimento mais próximo de 687,5 m) escolhe 0 iterações sobre `kart-park.json` (687,5196 m na origem; 686,72 m com 1 iteração), de
modo que a linha publicada é a origem sem suavização; se a intenção for suavizar de fato (orientação de "cerca de 12 m" do seed), a
regra precisa de outro critério (por exemplo, o maior k cujo comprimento fique na faixa de ± 1 %) — mudança de projeto, com
`trackVersion` 2. A pista também concentra um `InstancedMesh` de 394 segmentos de barreira (vértices a cada 0,25 m de amostragem dos
dois sentidos); uma simplificação da poligonal seria outra versão do preparo.
