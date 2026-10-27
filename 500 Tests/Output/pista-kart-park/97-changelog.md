---
title: Changelog do estágio de testes
feature: pista-kart-park
stage: test
status: draft
version: 1.0.0
---

# 97 — Changelog

## 2026-10-27 — rodada 1, Modo A (nenhuma suíte existia para a feature)

### Entrada

- Critérios validados de `200 Requirements/230 Output/pista-kart-park/` (US-0001 a US-0006 1.0.0, 51 `AC-*`; NFR-0001 a NFR-0012
  1.0.0); estratégia `test-strategy.md` 1.0.1, DES-0001 a DES-0012, DM-0001, DM-0002, ADR-0001 a ADR-0006 (projeto 1.0.2,
  `dspec-validation-20261027-2148`); contratos API-0001 a API-0003 do F-Spec; manifesto de código `01-implementation.md` 1.1.0 e
  `98-divergences.md` 1.1.0 do código (linha 12 `open`, devida a este estágio; linha 13 `open` na etapa de deploy); relatório
  `code-validation-20261027-2213.md` (SUCCESS) com os fatos medidos (682,116 m; 0,2955 m no ponto 218; 22 pontos no grampo;
  684 pontos; anti-horário; limites 199,394 / 347,042 / 525,650 m; 38 marcadores ≤ 18,00 m; 34 zebras com a da largada dividida;
  barreira de 382 vértices a ≥ 0,51 m da borda; 43 013 bytes; registro `STAGING`).
- Árvore de código no momento da rodada: `src/trackGeometry.ts`, `src/trackData.ts` (esquema 3), `src/physics.ts` (zebra 85 %,
  barreira), `src/lap.ts`, `src/trainingSession.ts`, `src/curbFeedback.ts`, `src/trackScene.ts`, `src/audio.ts`, `src/lapMessages.ts`,
  `src/main.ts` (646 linhas), `scripts/trackPrep.ts`, `scripts/trackChecks.ts`, `scripts/track-pipeline.ts`,
  `src/tracks/kart-park-v1.json`, `tracks/sources/kart-park.json`, `tracks/registry.json`. Nenhum `docs/kart-park-device-log.md`
  nem `docs/kart-park/device-log.md` existe.

### O que foi escrito

- 12 arquivos de teste `tests/pista-kart-park-<área>.test.ts` (102 verificações `CHK-TEST-00nn-nn`, uma por função de teste),
  executados por `npm test` (`node:test` + `node:assert/strict` via `tsx`).
- Fixture `tests/fixtures/kartParkFiles.ts`: o arquivo publicado, a origem e o registro lidos no lugar (nunca copiados), a
  geometria e o ambiente construídos uma vez por processo, e 20 cópias derivadas com um desvio cada (`withoutCenterline`,
  `withTwoPointCenterline`, `withZeroWidth`, `withInvalidCurbSide`, `withOnePointBarrier`, `withoutBarriers`, `withoutCurbs`,
  `withTextOsmDerived`, `withSchema4`, `corruptedText`, `withPointOffset`, `withShiftedCenterline`, `withScaledCoordinates`,
  `withReversedCenterline`, `withoutMarker`, `withCurbOnOtherSide`, `withBarrierVertexOnAsphalt`, `withRecordField`,
  `withTrackVersion2`, `withOtherTrackId`).
- Helper `tests/helpers/kartParkPilot.ts`: `kartParkPilot(geometria, {offsetM, shortcut, maxSpeedMps, lateralBudgetMps2, steerGain})`
  (persegue um ponto à frente na linha central por distância de volta, esterço proporcional saturado em [−1, 1], acelerador e
  freio binários por uma velocidade alvo da curvatura de Menger em 6 m, decisão a cada 6 passos), `completeKartParkLap`, `drive`,
  `runCountdown`, `replay`, `constant`, `seedLap`, `kartAtLapM`, `seededKart`, `advance`, `lapDistanceOf`, `curvatureAt`,
  `KART_PARK_CONFIG` (Arcade assistido v5 com piloto de 75 kg). Nenhum destes é superfície da aplicação: vivem em `tests/` e
  nenhum módulo de `src/` ou `scripts/` os importa.
- Registros de teste `TEST-0001` a `TEST-0012` neste diretório; `98-divergences.md`; este changelog. `00-index.md` e
  `99-traceability.md` são emitidos por `lint_artifacts.py --emit`.
- Nenhum arquivo de `src/`, `scripts/`, `tracks/`, `docs/`, `index.html`, `package.json` ou das fixtures existentes foi editado;
  nenhuma dependência foi acrescentada; `tests/fixtures/records.ts`, `tests/fixtures/trackFiles.ts` e os helpers existentes
  continuam como estavam.

### Mapeamento dos nomes da estratégia para os arquivos

| Estratégia (`test-strategy.md`) | Arquivo escrito | Registro | Verificações |
|---|---|---|---|
| `track-file` | `tests/pista-kart-park-track-file.test.ts` | TEST-0001 | 20 |
| `track-data`, `geometry` | `tests/pista-kart-park-track-data.test.ts` | TEST-0002 | 8 |
| `surface` | `tests/pista-kart-park-surface.test.ts` | TEST-0003 | 5 |
| `barrier` | `tests/pista-kart-park-barrier.test.ts` | TEST-0004 | 6 |
| `lap` | `tests/pista-kart-park-lap.test.ts` | TEST-0005 | 12 |
| `determinism` | `tests/pista-kart-park-determinism.test.ts` | TEST-0006 | 4 |
| `session` | `tests/pista-kart-park-session.test.ts` | TEST-0007 | 11 |
| `feedback` | `tests/pista-kart-park-feedback.test.ts` | TEST-0008 | 8 |
| `screens` | `tests/pista-kart-park-screens.test.ts` | TEST-0009 | 10 |
| `scene` | `tests/pista-kart-park-scene.test.ts` | TEST-0010 | 5 |
| `layering` | `tests/pista-kart-park-layering.test.ts` | TEST-0011 | 7 |
| `publication` | `tests/pista-kart-park-publication.test.ts` | TEST-0012 | 6 |

### Migração de verificações existentes

Inventário antes da escrita: nenhum id `CHK-TEST-*` desta feature em `tests/` nem em `99-traceability.md` (o estágio não
existia para a feature). Os 65 ids da `dirigibilidade`, os 140 da `race-lap-validation`, os 59 da `modelo-kart-01` e os testes
`physics.test.ts`/`maneuvers.test.ts` continuam nos seus arquivos, não tocados, e passam na mesma execução (CHK-TEST-0009-02 de
`race-lap-validation` e CHK-TEST-0004-13 de `modelo-kart-01` já reescritos por aquelas features em `32d0adf` e `c7e71b1`).
`tests/race-lap-validation-layering.test.ts` continua a valer para os módulos que lista; CHK-TEST-0011-01/-02 estendem as mesmas
proibições aos módulos novos sem o duplicar. Nada a migrar.

### Execução

`npx tsx --test tests/*.test.ts` com os repórteres `junit` (`reports/junit-latest.xml`) e `spec` (`reports/npm-test-latest.log`):
**398 verificações, 397 aprovadas, 1 reprovada** (CHK-TEST-0004-03, `98-divergences.md`), 0 puladas, ~26 s (296 existentes +
102 novas). As 12 suítes novas sozinhas: ~9 s; os ensaios mais caros rodam uma vez por arquivo e são partilhados (volta de
referência do piloto 6 675 passos ≈ 1,2 s em `lap`, duas voltas + duas reproduções em `determinism`, volta completa pela sessão em
`session`, o trecho de zebra a 7 m/s em `lap` e em `feedback`, varredura O(n²) das bordas 0,35 s, amostragem da barreira 0,43 s, 19
cópias por `verifyTrackFile` 0,7 s, 5 execuções do programa em cópia temporária ≈ 2 s).

### Prova de que as verificações podem falhar

Além da coluna "o que a faria falhar" de cada `TEST-*`, as 12 suítes foram executadas contra uma cópia temporária de `src/`,
`scripts/`, `tests/`, `tracks/`, `docs/`, `index.html`, `package.json` e `tsconfig.json` fora do repositório (diretório de
rascunho da sessão, `node_modules` por junção), com onze mutações, uma de cada vez (programa `mutate.py` de rascunho); a cópia foi
descartada. Linha de base na cópia: 102 verificações, 101 aprovadas, 1 reprovada (CHK-TEST-0004-03, a mesma do repositório);
a coluna conta só as reprovações novas.

| Mutação | Verificações que reprovaram a mais (102 executadas) |
|---|---|
| A — `src/physics.ts`: `CURB_GRIP_PC` 0,85 → 0,9 | 3: CHK-TEST-0003-01, -02, -03 |
| B — `src/physics.ts`: bloco da barreira desligado (`barrierSegments.length < 0`) | 2: CHK-TEST-0004-02, -04 |
| C — `src/lap.ts`: corte medido por `edgeDistanceM` (borda sintética) em vez de `trackEdgeDistanceM` | 12: CHK-TEST-0005-01, -02, -03, -04, -05, -06, -07, -10, CHK-TEST-0006-01, -03, CHK-TEST-0007-05, CHK-TEST-0008-06 |
| D — `src/curbFeedback.ts`: `CURB_PULSE_INTERVAL_STEPS` 30 → 24 | 3: CHK-TEST-0008-01, -05, -06 |
| E — `src/trainingSession.ts`: `OPENING_TRACK_ID` `synthetic` | 1: CHK-TEST-0007-02 |
| F — `src/lapMessages.ts`: `OSM_CREDIT.url` trocado | 1: CHK-TEST-0009-03 |
| G — `src/tracks/kart-park-v1.json`: marcador 21 retirado | 6: CHK-TEST-0001-10, -18, -19, CHK-TEST-0012-01, -03, -05 |
| H — `src/trackScene.ts`: `mesh.count = count - 1` | 1: CHK-TEST-0010-03 |
| I — `src/trackGeometry.ts`: `classifySurface` devolvendo `asphalt` para a zebra | 6: CHK-TEST-0001-20, CHK-TEST-0002-07, CHK-TEST-0003-03, CHK-TEST-0005-07, CHK-TEST-0008-06, CHK-TEST-0010-02 |
| J — `src/curbFeedback.ts`: som só com vibração disponível | 1: CHK-TEST-0008-05 |
| K — `src/trainingSession.ts`: a troca de pista devolve a volta em vez de descartá-la | 2: CHK-TEST-0007-05, -07 |

Durante a escrita, cinco verificações reprovaram por defeito do próprio check ou da fixture e foram corrigidas no check, não no
código: CHK-TEST-0001-11 (pareamento por vértices e sem a tolerância de toque de 0,002 m que V13 declara), CHK-TEST-0001-19 (a
cópia com a linha deslocada lê `INCOMPLETE` por C6 e reprova tudo; substituída pelo ponto 400 movido pela normal, que fica
legível e reprova só V01/V07 e as distâncias de volta), CHK-TEST-0003-02 (razão bruta das capacidades no passo integrado, 0,849993
pela transferência de carga; passou a comparar o atrito recuperado por roda), CHK-TEST-0005-03 (projeção da excursão na linha
central atrasada numa curva; passou a decidir por `sideOf` da linha do marcador), CHK-TEST-0006-02 (`kartParkEnvironment()` criava
um `surfaceAt` novo por volta e `deepEqual` comparava funções; o ambiente passou a ser um só por processo). Os ajustes de
tolerância são os de float32 (matrizes das instâncias, 1e-4 m) e de `index.html` (`recorde` como texto do jogo, não o recorde da
pista), registrados em `98-divergences.md`.

### Itens da estratégia aplicados com ajuste, com o motivo

- **AC-US-0004-05, "igualdade a 1e-9 a cada passo com a barreira da Kart Park":** a barreira publicada é um zigue-zague de
  0,04–0,18 m por segmento com desvios de direção até 87° (medido); a comparação exata passo a passo é feita com uma barreira reta
  de 2 pontos numa geometria derivada do arquivo (mesmo bloco de `src/physics.ts`), e a barreira publicada prova contato, perda de
  velocidade e `barrierContact` (`98-divergences.md`).
- **AC-US-0004-04 a 200 m/s:** a verificação é escrita como DES-0003 descreve e **reprova** (CHK-TEST-0004-03); não foi
  estreitada às velocidades que passam (D-TS-07). As velocidades que o kart alcança (5 a 34,5 m/s, mais 60 m/s) passam em
  CHK-TEST-0004-02/-03.
- **`kartParkPilot(offset?, shortcut?)`:** recebe também `maxSpeedMps` (a zebra é percorrida a 7 m/s para manter as rodas
  sobre a faixa por 322 passos seguidos) e `steerGain`/`lateralBudgetMps2` com os padrões calibrados (26 m/s, 9,5 m/s², 2,5). O
  atalho da curva 4 é `shortcut: {fromLapM: 147, toLapM: 200}`: o piloto aponta para o ponto da linha central em 200 m e cruza a
  grama (231 passos com roda na grama); a volta termina `INVALID` por `CUT` (o critério pede só "inválida").
- **AC-US-0003-05 "excursão a 3,5 m por menos de 120 passos":** o piloto com deslocamento lateral demorava 121 passos além de 3 m
  (corte); a excursão é semeada (kart a 3,5 m da borda e 12 m/s antes do marcador 11, 100 passos ociosos, retorno à linha central
  depois do marcador) e a volta termina `INVALID` por `MISSED_MARKER` na chegada, com a razão de tela "marcador pulado".
- **`seededKart(pose, velocity)`:** `seededKart(posição, rumo, velocidade)` mais `kartAtLapM(lapM, lateral, reverse)` e
  `launch(alvo, normal, lado, ângulo, distância, velocidade)` (local ao teste da barreira), porque os lançamentos precisam de um
  ângulo de impacto definido contra um ponto do obstáculo.
- **"`AudioContext` de substituição":** instalada em `globalThis` só dentro de CHK-TEST-0008-07 e restaurada no `finally`;
  regista o tipo de cada nó e o `type`/`frequency` dos osciladores e filtros; não produz som.
- **Programa `track-pipeline.ts`:** executado por `spawnSync(node, [tsx/cli.mjs, programa, ...])` com o diretório de trabalho
  numa cópia temporária dos três arquivos em `os.tmpdir()` (o programa lê `process.cwd()`), apagada no fim; a promoção com
  `--esri-decision` é provada na cópia, e o registro do repositório é reafirmado em `STAGING`.
- **NFR-0009 "nenhum teste nem bench cita `kart-park`":** os comentários de `tests/race-lap-validation-track-data.test.ts` citam a
  feature por nome ("ADR-0001 of pista-kart-park"); CHK-TEST-0011-05 procura o uso no código sem comentários (`'kart-park'`,
  `kartPark`, `trainingSession`, `trackEnvironment`, `kart-park-v1`, `tracks/kart-park`).

### Itens declinados, com o motivo

- **Criação de árvores de E2E e escrita em `docs/kart-park-device-log.md` (ou `docs/kart-park/device-log.md`):** declinada. O estágio
  escreve só em `tests/` e em `500 Tests/Output/<feature>/` (conventions §14); nenhum dos dois arquivos existe e não é criado. Os
  critérios cuja parte de tela, aparelho, som, vibração, navegador ou rede depende dos roteiros `E2E-01` a `E2E-08` estão em
  `98-divergences.md` como `unverified`, à espera do registro humano que a etapa de deploy nomeia.
- **Verificações de acesso não autenticado e de papel recusado (política do skill):** não aplicáveis. API-0001 a API-0003 não têm
  endpoint de rede, sessão nem papel (I6); não há webhook. A segurança da feature (DES-0012) está em CHK-TEST-0011-02 (nenhuma
  rede nem armazenamento), CHK-TEST-0009-07/CHK-TEST-0001-16 (nenhum recorde da pista real), CHK-TEST-0012-04 (promoção só com
  a decisão Esri) e CHK-TEST-0011-06 (nenhuma dependência).
- **Verificação de idempotência por evento duplicado (política do skill):** as transições de estado da feature são a seleção de
  pista e a volta: a mesma pista selecionada de novo é um no-op (CHK-TEST-0007-08), a promoção repetida e o `publish` repetido não
  alteram o registro (CHK-TEST-0012-04/-05), um passo já tratado não repete pulso nem som (CHK-TEST-0008-02), a chegada cruzada de
  novo não produz segundo resultado (CHK-TEST-0005-08).
- **Fixar 38 marcadores, 22 pontos no grampo, 376 pares de V13 ou 43 013 bytes como valores esperados:** declinado; são medidas da
  versão publicada, não critérios (`98-divergences.md`). As verificações afirmam os limites dos critérios (≤ 25 m, ≤ 0,30 m, ≤ 6 m,
  < 200 000 bytes) e a igualdade com o que o registro gravou (`lapLengthM`, `maxSmoothingOffsetM`, `sha256`, `fileBytes`).
- **REQ-FEAT-0007-12 (`git merge-base`):** nenhuma verificação chama `git` (o estágio não o executa); o manifesto de código registra
  a ordem.
