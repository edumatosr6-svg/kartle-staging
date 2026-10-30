---
title: Registro de mudanças — pista Kart Park (estágio de código)
feature: pista-kart-park
stage: code
status: validated
version: 1.4.0
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

## 2026-10-27 — rodada 2, Mode B (`code-validation-20261027-2125` FAIL SPEC; projeto revisto em `dspec-validation-20261027-2148`: ADR-0006 1.1.0, DES-0010 1.1.0, DES-0011 1.0.2, DM-0002 1.1.0, DES-0005 1.2.0, DES-0007 1.2.0, DES-0002 1.1.0)

- ISSUE-01 (error): `scripts/trackPrep.ts` `smooth` (`:93-116`) reescrita — janela fixa de 12 m de distância de volta (± 6 m na linha
  original, volta fechada), pesos de cosseno levantado `½ (1 + cos(π δ / 6))`, uma aplicação sobre os pontos da origem, grampo de 0,295 m
  em torno do ponto correspondente, arredondamento a 0,001 m; `prepareTrack` mede o comprimento de novo sobre a linha arredondada e falha
  fora de 687,5 m ± 1 % (`:190-194`). Constantes: `SMOOTH_WINDOW_M` 12 e `LAP_LENGTH_TOLERANCE` 0,01 entram; `SMOOTH_LAMBDA` e
  `SMOOTH_MAX_ITERATIONS` saem. `PrepRecord.smoothingWindowM` substitui `smoothingIterations` (`:47-50`, `:272-275`;
  `scripts/track-pipeline.ts:108`). Entrada `kart-park` 1 e `src/tracks/kart-park-v1.json` da rodada reprovada retirados
  (DM-0002 1.1.0, "Entrada de rodada reprovada"); `prepare`/`verify`/`publish kart-park 1` refeitos: 682,116 m, desvio máximo 0,2955 m,
  22 pontos no grampo, V01–V18 `PASS`, 43 013 bytes, SHA-256 `04ce5e51…`, `STAGING` 2026-10-27T21:58:06.132Z; `trackVersion` 1.
  Recomputados na linha suavizada: limites nos pontos 200/348/527 (199,394 / 347,042 / 525,650 m), 38 marcadores (≤ 18,00 m), 34 zebras
  (a da largada `RIGHT 671,129–682,116` e `0–2,977`), 1 barreira de 382 vértices e 53,29 m a ≥ 0,510 m do asfalto. `lapLengthM` fica só em
  `prep`; nenhuma chave acrescentada ao arquivo (ISSUE-01 de `dspec-validation-20261027-2148`, V18).
- ISSUE-02 (warning): nenhuma mudança de código; `startTrainingLap(session, lap, config, setup?)` (`src/trainingSession.ts:83`) é a
  assinatura de DES-0005 1.2.0 e `src/main.ts:297` passa o `SetupRef` no quarto argumento (DES-0007 1.2.0).
- ISSUE-03 (warning): nenhuma mudança de código; os passos 5 e 9 de DES-0010 1.1.0 descrevem o que `transversalLine` (`:133-161`,
  `refineEnd` `:163-171`) e `buildBarriers` (`:287-367`) executam.
- ISSUE-04 (info): nenhuma mudança de código; DES-0002 1.1.0 lista os quatro símbolos exportados.
- ISSUE-05 e ISSUE-06 (divergence, verificações de outras features): fechados fora desta feature entre as rodadas —
  `CHK-TEST-0009-02` reescrito por `race-lap-validation` (`32d0adf`) e `CHK-TEST-0004-13` restrito aos campos gravados por
  `modelo-kart-01` (`c7e71b1`); `npx tsx --test tests/*.test.ts` 296/296 nesta rodada, nenhum teste editado por esta feature.
- Manifesto: `01-implementation.md` 1.1.0, `98-divergences.md` 1.1.0, `pipeline/DES-0010` 1.1.0, `pipeline/DES-0011` 1.1.0,
  `data/DM-0001` 1.1.0, `data/DM-0002` 1.1.0, `core/DES-0002` 1.1.0, `core/DES-0005` 1.1.0, `web/DES-0007` 1.1.0; `00-index.md` e
  `99-traceability.md` por `lint_artifacts.py --emit`.

**Itens fechados**: ISSUE-01, ISSUE-02, ISSUE-03, ISSUE-04 (código ou projeto); ISSUE-05, ISSUE-06 (fechados pelas features donas).

**Itens recusados ou não aplicados, com motivo**

- `trackVersion` 2 para o arquivo suavizado: não aplicado; ADR-0006 1.1.0 e DM-0002 1.1.0 mandam retirar a entrada da rodada reprovada e
  refazer a versão 1 (o F-Spec fixa a primeira versão publicada como 1).
- Acrescentar `lapLengthM` ao arquivo de pista: não aplicado; DM-0001 define o comprimento como quantidade derivada da `centerline`, V18
  reprova chave fora de DM-0001 e `dspec-validation-20261027-2148` ISSUE-01 pede que fique só em `prep`.
- Campo `clampedPoints` (ou equivalente) em `prep`: não acrescentado; DM-0002 1.1.0 não o nomeia e a superfície está congelada numa rodada de
  correção (§16); a contagem (22) fica registrada em `01-implementation.md`.
- Editar `scripts/trackChecks.ts` (V01, V03, V07 já medem o que DES-0011 1.0.2 descreve) ou qualquer arquivo de `tests/`: não tocados.
- A "Proposta ao autor" da rodada 1 (simplificação da poligonal da barreira): continua para `SCOPE-BACKLOG.md`; a barreira recomputada
  tem 381 segmentos e não é item deste relatório.

**Migração de verificações existentes**: nenhuma verificação removida ou alterada por esta feature; `npx tsc --noEmit -p .` 0;
`npx vite build` 0 (705 946 bytes); `npx tsx --test tests/*.test.ts` 296/296; `bench:handling` 46/46;
`npm run track -- verify kart-park 1` V01–V18 `PASS`.

## 2026-10-27 — rodada 3, Mode B (Testing Report `testing-report-20261027-2307`, veredito `test-validation-20261027-2307` FAIL CODE)

- FAIL-01 (CODE; `CHK-TEST-0004-03`, AC-US-0004-04; DES-0003 "Bloco da barreira" passo 1, ADR-0003 decisão 2): `src/physics.ts:372`
  `barrierContactPoint` — `startSideNormal` passa de `sSide >= 0 ? leftOfAB : −leftOfAB` a `sSide >= 0 ? −leftOfAB : leftOfAB`, porque
  `leftOfAB = {(b.z − a.z)/L, −(b.x − a.x)/L}` fica do lado em que `orientation(a, b, ·)` é negativa; a normal "do lado de S" apontava
  para o lado oposto, o ramo do trajeto (`:376-378`) punha o kart do lado errado da barreira com `outgoing < 0` e a reflexão não
  disparava (atravessava a 150–200 m/s; o caso `near.distanceM === 0` `:382` usava a mesma normal). Comentário da função (`:365-366`)
  corrigido. Ramo de proximidade (`:380-383`), resposta (`:339-357`), muro, presets, `Input`, contrato de passo e `src/lap.ts` intactos;
  481 linhas, nenhum `arquivo:linha` do manifesto desloca.
- Manifesto: `01-implementation.md` 1.2.0 (rodada 3, tabela de arquivos, portão, decisão da normal), `core/DES-0003` 1.0.1,
  `98-divergences.md` 1.2.0 (linha 5); `00-index.md` e `99-traceability.md` por `lint_artifacts.py --emit`.

**Itens fechados**: FAIL-01.

**Itens recusados ou não aplicados, com motivo**

- Renomear `leftOfAB` (alternativa que o relatório oferece): não aplicado; o nome fica com o comentário que diz o lado que representa,
  para que o arquivo mantenha as 481 linhas e as referências do manifesto e do relatório (`:367-383`) continuem válidas.
- Qualquer linha de `tests/`, do ramo de proximidade ou do bloco da resposta: não tocada (o relatório manda mudar só a normal).

**Migração de verificações existentes**: nenhuma verificação removida ou alterada por esta feature; `npx tsc --noEmit -p .` 0;
`npx vite build` 0 (705 946 bytes); `npx tsx --test tests/*.test.ts` 398/398 (`CHK-TEST-0004-03` passa; `-02/-04/-05/-06` e
`tests/physics.test.ts` verdes); `bench:handling` 46/46; `bench:physics` 10/10; `npm run track -- verify kart-park 1` V01–V18 `PASS`.

## 2026-10-30 — rodada 4, Mode B (projeto revalidado em `dspec-validation-20261030-1327`: rodada 4 do projeto, Mode C, FB-01 de `race-lap-validation`; DIV-DP-16 do registro de deploy)

- ADR-0007, DES-0007 1.3.0 (linha 14 de `98-divergences.md`; DIV-DP-16): `index.html:26` — `#lap-training-result-credit`
  (`p.lap-chip.track-credit`, oculto) como último filho de `#lap-training-result`; `#lap-result-credit` retirado de `#lap-result` (I3, na
  mesma entrega). `src/main.ts:479-484` — `renderTrainingResult` deixa de substituir todos os filhos do painel: remove só os elementos do
  resultado, insere os novos antes do contêiner do crédito (que nunca é removido) e, no mesmo ramo do redesenho, chama
  `renderCredit($('lap-training-result-credit'), creditFor(selectedOption(result.trackId)))`; o crédito some com o painel oculto.
  `renderResult` deixa de chamar `renderCredit` (`#lap-result` só exibe volta oficial e de reconhecimento). `src/style.css:8` —
  `#lap-training-result-credit a{pointer-events:auto}`.
- DES-0009 1.2.0, DM-0002 1.2.0: o estado do retorno da zebra já era zerado só em `chooseTrack` (`:233`) e em `beginLap` (`:312`), nunca
  no fim de uma volta do treino; só o comentário de `src/main.ts:164-165` passa a dizê-lo.
- DES-0004 1.1.0, DES-0005 1.3.0, DES-0006 1.1.0, DES-0012 1.0.2: nenhuma mudança de código (o treino de voltas seguidas, a troca de
  pista que descarta o treino e a leitura de `listLapResults` já estão no código); registros espelho atualizados.
- Manifesto: `01-implementation.md` 1.3.0, `98-divergences.md` 1.3.0 (linhas 14 e 15 do projeto 1.1.0; linhas 3, 9, 10 e 11 com as
  linhas de `src/main.ts` de 670 linhas; seção da verificação reprovada), `web/DES-0007` 1.2.0, `web/DES-0009` 1.1.0, `data/DM-0002`
  1.2.0, `core/DES-0003` 1.1.0, `core/DES-0004` 1.1.0, `core/DES-0005` 1.2.0, `core/DES-0006` 1.1.0, `security/DES-0012` 1.1.0;
  `00-index.md` e `99-traceability.md` por `lint_artifacts.py --emit`.

**Itens fechados**: linha 14 do registro de divergências do projeto 1.1.0 (crédito em `#lap-result`); a parte de código de DIV-DP-16.

**Itens recusados ou não aplicados, com motivo**

- Retirar o cancelamento da manobra na barreira, o cálculo da condição de pista da manobra, o comentário de RULE-0001 que o acompanhava
  e a escala de drift de `tireForce`: não aplicado por esta feature; o changelog do projeto (rodada 4, "Mudança de código desta feature
  pelo drift: nenhuma") os atribui à rodada de código de `dirigibilidade` (DES-0001 4.0.0 daquela feature), que **já os retirou**
  (`cfad3dc`; `src/physics.ts` com 440 linhas). Nada fica à espera dela.
- Reescrever o painel `#lap-training-result` com elementos fixos de identificador próprio (título, total, setores): não aplicado;
  acrescentaria elementos que nenhum item de projeto nomeia (§16); o redesenho continua o de `race-lap-validation`, com a única mudança
  de não remover o contêiner do crédito (ADR-0007, consequências).
- `REWARD_SOUND` e `reward()` em `src/audio.ts`: mantidos (DES-0009 1.2.0: a retirada, se vier, é de `dirigibilidade`).
- Linha 15 do registro do projeto (verificações e `drive` que esperam `ENDED`) e a migração de `CHK-TEST-0009-04`, `CHK-TEST-0011-01`
  e demais da tabela do projeto: do estágio de testes; nenhum arquivo de `tests/` editado.
- Ver em tela o crédito no painel (E2E-02): não feito nesta rodada; fica para o roteiro de aparelho (DIV-DP-01).

**Migração de verificações existentes**: nenhuma verificação editada; `CHK-TEST-0009-04` (`tests/pista-kart-park-screens.test.ts:47-56`)
reprova como previsto pela migração planejada no changelog do projeto. `npx tsc --noEmit -p .` 0; `npx vite build` 0 (694 178 + 10 850
bytes); `npx tsx --test tests/*.test.ts` 442/443 (só `CHK-TEST-0009-04`; nenhuma verificação de outra feature reprova); `npm run track --
verify kart-park 1` V01–V18 `PASS`, `VERIFIED`; arquivo de pista e registro intactos (SHA-256 `04ce5e51…`).

## 2026-10-30 — rodada 4, iteração 2, Mode B (`code-validation-20261030-1826` FAIL, só manifesto)

- ISSUE-01 (`98-divergences.md` linhas 4 e 5): as provas citam a árvore corrente — `src/physics.ts` (440 linhas) sem a condição de pista
  da manobra nem cancelamentos; o bloco da barreira `:332-348` responde como o muro (1,12; 0,65; `barrierHit`), sem cancelar manobra,
  como o passo 3 de DES-0003 1.1.0; a linha "manobra" de DES-0003 1.1.0 é "sem mudança desta feature".
- ISSUE-02 (`core/DES-0003` 1.2.0, `01-implementation.md` 1.4.0, este changelog): o manifesto registra que `cfad3dc` de `dirigibilidade`
  já retirou esses trechos; o símbolo da condição de pista da manobra sai da linha de `src/physics.ts` da tabela de arquivos; a recusa
  da rodada 4 continua (a retirada é de `dirigibilidade`) e diz que já foi feita.
- ISSUE-03: `arquivo:linha` atualizados para a árvore corrente — `src/physics.ts` nas linhas 4, 5 e 6 e no bloco "Satisfeitos hoje"
  (`step` `:376`), `src/lapMessages.ts:105-120` na linha 11 e em `web/DES-0007` (1.3.0), `src/main.ts` em `web/DES-0008` (1.1.0).
  `98-divergences.md` 1.4.0.
- Nenhum arquivo de código, de `tests/`, de pista ou do registro tocado; `00-index.md` e `99-traceability.md` por `lint_artifacts.py --emit`.

**Itens fechados**: ISSUE-01, ISSUE-02, ISSUE-03 de `code-validation-20261030-1826`.

**Itens recusados ou não aplicados, com motivo**

- `startSideNormal` em `:366`, como o relatório cita: registrado em `:364`, que é a linha em que a atribuição está na árvore (a função
  começa em `:359`).
- Reescrever os parágrafos das rodadas 1 a 3 deste changelog e de `01-implementation.md`: não aplicado; são histórico daquelas árvores
  (481 linhas) e passam a dizer de que árvore são.
