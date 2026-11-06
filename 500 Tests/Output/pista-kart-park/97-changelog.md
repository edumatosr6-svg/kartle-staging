---
title: Changelog do estágio de testes
feature: pista-kart-park
stage: test
status: draft
version: 1.4.0
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

## 2026-10-30 — rodada 3, Modo B (treino de voltas seguidas de `race-lap-validation`; acerto v6 e retirada do drift e do turbo de `dirigibilidade`)

### Entrada

- D-Spec revalidado em 2026-10-30 (`300 Specs/330 D-Specs/Output/pista-kart-park/reports/dspec-validation/dspec-validation-20261030-1327.md`):
  DES-0004, DES-0005 e ADR-0007 alinhados ao treino contínuo (o fim de cada volta é o crescimento de `listLapResults`; o treino só
  chega a `ENDED` por `endTraining`); `test-strategy.md`: fixture `drive` que para nesse crescimento, linhas AC-US-0001-05,
  AC-US-0003-05/-07/-09/-10/-11 e "Testes de outras features" (migração sem verificação removida; layering sem `src/maneuvers.ts`).
- Feedback `300 Specs/330 D-Specs/Output/pista-kart-park/reports/feedbacks/dirigibilidade/feedback-20261030-1326.md`: FB-01, FB-02.
- Validação de testes anterior `reports/test-validation/test-validation-20261027-2333.md` (SUCCESS; ISSUE-01 a ISSUE-05).
- Execução antes da escrita (mesmo comando, 2026-10-30): 423 coletadas, 410 aprovadas, 13 reprovadas; desta feature 9 —
  CHK-TEST-0005-01, -02, -03, -04, -06, -08, -10, CHK-TEST-0006-03, CHK-TEST-0007-05; as outras 4 de `modelo-kart-01`.

### Atrito de verificações

Inventário antes da escrita: 102 ids `CHK-TEST-*` nas 12 suítes `tests/pista-kart-park-*.test.ts`, os mesmos 102 de
`99-traceability.md` e do junit de 2026-10-27. Depois: 102. Retiradas 0, adicionadas 0, renomeadas 0; 9 modificadas (tabela
abaixo); CHK-TEST-0011-01 a -07 e CHK-TEST-0003-01/-02 carregadas com a fixture alterada pelos feedbacks, sem mudar o que afirmam.

### Migração

| Id | O que mudou | Por que o critério continua coberto |
|---|---|---|
| CHK-TEST-0005-01 | deixa de esperar `ENDED` na chegada: lê o item novo de `listLapResults` (exatamente um, `VALID`, sem razão, `lapSequenceCount` 1); os marcadores são lidos da sessão de antes do passo de fechamento; afirma a volta seguinte em `RUNNING`, 2.ª, `VALID`, sem marcadores, com `lapStartMs` igual ao fim da primeira | AC-US-0003-10 inteiro como a estratégia o escreve: volta pela pista sem corte com todos os marcadores dá item `VALID` e a seguinte começa no mesmo instante |
| CHK-TEST-0005-02 | resultado lido do item de `listLapResults`; a vista do estado (agora da volta seguinte) dá `bestValidLapMs` igual a `lapMs` em vez de setores e total; `trainingLapMs`/`trainingSectorMs` iguais a `lapMs`/`sectorMs`; limites de setor lidos da sessão de antes do fechamento; a sintética compara o primeiro item | AC-US-0003-11: `lapMs` e 4 `sectorMs` que somam, formato, mesma forma de resultado que a sintética |
| CHK-TEST-0005-03 | a chegada dá um item `INVALID` com `MISSED_MARKER` e a fase continua `RUNNING`; a razão de tela vem de `describeTrainingResult` do item (ver "Ajustes") | AC-US-0003-05 e AC-US-0003-06 |
| CHK-TEST-0005-04 | o 121.º passo dá `INVALID`/`CUT` com a fase `RUNNING` e nenhum item; 60 passos depois a volta continua (`stepCount` 181) e segue `CUT` sem item | AC-US-0003-07 como a estratégia o escreve ("a fase continua `RUNNING` e `listLapResults` não ganha item nesse passo") |
| CHK-TEST-0005-06 | a volta do atalho dá, no cruzamento seguinte da chegada, um item `INVALID` (`CUT` ou `MISSED_MARKER`) com a fase `RUNNING`; marcadores lidos antes do fechamento | AC-US-0003-09 |
| CHK-TEST-0005-08 | era "a chegada de novo depois do fim não produz segundo resultado"; agora, a partir da volta de referência, o segundo cruzamento fecha a 2.ª volta com o seu próprio item (`lapSequenceCount` 2, início no fim da 1.ª) e deixa o primeiro item igual; a 3.ª volta começa no segundo fim | AC-US-0003-11 na forma que a estratégia dá ao treino de voltas seguidas ("a chegada cruzada de novo depois de uma volta concluída encerra a volta seguinte com o seu próprio resultado (`lapSequenceCount` 2) e deixa o primeiro igual") |
| CHK-TEST-0005-10 | depois da retomada, o item `VALID` sai no cruzamento seguinte; a retomada conserva os marcadores; marcadores lidos antes do fechamento; fase `RUNNING` depois | AC-US-0003-11 (pausa e retomada) |
| CHK-TEST-0006-03 | a reprodução com 10 passos ociosos de folga para no fechamento (fixture `drive`); afirma o mesmo passo de fechamento e a mesma lista de resultados, além de `lapMs`, `sectorMs` e kart | NFR-0003: a reprodução pela sessão de treino dá a mesma volta e uma entrada trocada não |
| CHK-TEST-0007-05 | resultados lidos de `listLapResults`: nas duas pistas, volta cortada (segue `RUNNING` sem item, item `CUT` na chegada seguinte) e volta sem marcadores (item `MISSED_MARKER`); na Kart Park, volta completa (item `VALID`); treino descartado pela troca e encerrado por `endTraining` sem item novo; 5 itens julgados, todos `TRAINING`, sem `challengeNumber`, nunca oficiais | AC-US-0001-05 como a estratégia o escreve (cada item de `listLapResults` — concluída, cortada, com marcador pulado — e o descarte e `endTraining` sem item) |

### Fixtures

- `tests/helpers/kartParkPilot.ts`: `drive` para no passo em que `listLapResults(lap).lapResults` cresce ou na fase `ENDED`
  (estratégia, "Fixtures"); `lapResults(lap)` lê a lista pelo contrato; `completeKartParkLap` vai até o primeiro fechamento. As
  verificações que usam `drive` por passos sem chegada (barreira, zebra, retorno, corte) não mudam de comportamento.
- `KART_PARK_CONFIG` continua o literal `ARCADE_ASSISTIDO_V5` + 75 kg, comentário corrigido: é o acerto em que o piloto foi
  calibrado, não o publicado.

### Feedbacks

- FB-01 (`dirigibilidade`, layering nomeia `src/maneuvers.ts`): **aceito**. `SIMULATION` passa a ser `reachedBy(SIMULATION_ROOTS)`:
  os 7 módulos da feature mais todo módulo de `src/` que eles alcançam pelas importações. Hoje inclui `src/maneuvers.ts` porque
  `src/physics.ts` o importa; quando o passo deixar de importá-lo, sai da lista sem edição aqui. Nenhuma suíte desta feature nomeia
  `src/maneuvers.ts` (a menção `maneuvers.test.ts` de CHK-TEST-0011-05 é o nome de um teste de outra feature, filtrado por
  presença, e não reprova se o arquivo sumir). Prova: mutação M8.
- FB-02 (`dirigibilidade`, `PUBLISHED_SETUPS.ARCADE_ASSISTIDO` passa a v6): **aceito, confirmando**. CHK-TEST-0003-01/-02 medem
  a regra da zebra (razões 0,85 ao asfalto do mesmo acerto e o atrito recuperado por roda), não números da v5; passam com
  `arcade-assistido-v6`. Os rótulos levam a versão publicada (`ARCADE_ASSISTIDO arcade-assistido-v6`) e o literal
  `ARCADE_ASSISTIDO_V5` do piloto entra como quinto acerto de CHK-TEST-0003-01. As verificações de volta continuam no literal v5
  (o piloto foi calibrado nele; a rodada substituída não muda). Prova: mutação M10.

### Itens da validação anterior

- ISSUE-02: fechado. A linha de `98-divergences.md` passa a `REQ-FEAT-0007-12, NFR-0011` com o fato que a decide (manifesto de
  código: `6ea3862` descendente de `b86b200`); NFR-0002 continua só no aparelho.
- ISSUE-03: fechado. CHK-TEST-0004-03 em `98-divergences.md` passa a `passing`, com a causa e a correção (`src/physics.ts:372`,
  commit 1a12076); a observação da poligonal deixa de citar CHK-TEST-0004-03 como defeito.
- ISSUE-04: fechado. A coluna "o que a faria falhar" de CHK-TEST-0004-05 em TEST-0004 registra que -05 não depende da resposta.
- ISSUE-01: declinado, com o motivo do próprio relatório: as afirmações textuais ficam como guarda de camada e de ligação (nível
  "texto" da estratégia), a regra de tela provada pelas funções puras e a tela pelo roteiro E2E.
- ISSUE-05: declinado neste estágio: o registro humano do aparelho é nomeado pela etapa de deploy (conventions §14).

### Ajustes à estratégia, com o motivo

- AC-US-0003-06 ("`describeLap` sobre o estado dessa volta dá 'marcador pulado'"): no treino de voltas seguidas o marcador pulado
  só é decidido no cruzamento da chegada, e no mesmo passo a volta seguinte abre `VALID`; o estado nunca carrega `MISSED_MARKER`
  numa volta `TRAINING`, e `describeLap` sobre ele não pode dar a razão. CHK-TEST-0005-03 decide pela função de tela do
  resultado da volta do treino, `describeTrainingResult` sobre o item de `listLapResults` (painel de ADR-0007), com o mesmo texto
  "marcador pulado"/"missed marker" e a mesma origem `message('reasonMissedMarker')`. A linha da estratégia fica para a próxima
  rodada do D-Spec da feature.
- AC-US-0001-05 na sintética: a volta completa `VALID` é provada só na Kart Park (como na rodada 1); na sintética, os itens `CUT`
  e `MISSED_MARKER` vêm de um kart semeado antes da chegada, em (75, −14) a 8 m/s, porque o `autopilot()` de `race-lap-validation`
  usa outro acerto que o da sessão.

### Execução

`npx tsx --test tests/*.test.ts` com `junit` (`reports/junit-latest.xml`) e `spec` (`reports/npm-test-latest.log`): **437
coletadas, 432 aprovadas, 5 reprovadas**, 0 puladas. As 102 verificações desta feature passam; as 5 reprovações são de
`tests/modelo-kart-01-camera.test.ts` (2), `-contract.test.ts` (2) e `-model.test.ts` (1), outra feature em revisão em paralelo.

### Prova de que as verificações modificadas podem falhar

As 12 suítes desta feature foram executadas numa cópia de `src/`, `scripts/`, `tests/`, `tracks/`, `docs/`, `index.html`,
`package.json` e `tsconfig.json` no diretório de rascunho da sessão (`node_modules` por junção), com uma mutação de cada vez; a
cópia foi descartada. Linha de base na cópia: 102 verificações, 0 reprovadas. A coluna conta as reprovações.

| Mutação | Verificações que reprovaram (102 executadas) |
|---|---|
| M1 — `src/lap.ts`: o corte de uma volta de treino a encerra (contrato antigo `ENDED`) | 3: CHK-TEST-0005-04, -06, CHK-TEST-0007-05 |
| M2 — `src/lap.ts`: a volta de treino termina na chegada (`phase: 'ENDED'` no fechamento) | 7: CHK-TEST-0005-01, -02, -03, -06, -08, -10, CHK-TEST-0007-05 |
| M3 — `src/lap.ts`: a volta seguinte guarda o `lapStartMs` da anterior | 2: CHK-TEST-0005-01, -08 |
| M4 — `src/lap.ts`: volta de treino sem todos os marcadores fecha `VALID` | 2: CHK-TEST-0005-03, CHK-TEST-0007-05 |
| M5 — `src/lap.ts`: volta cortada fecha com `MISSED_MARKER` em vez da primeira razão | 1: CHK-TEST-0007-05 |
| M6 — `src/lap.ts`: `endTraining` lista um resultado para a volta em andamento | 1: CHK-TEST-0007-05 |
| M7 — `src/trainingSession.ts`: `startTrainingLap` pilota 1 kg a mais que o acerto pedido | 1: CHK-TEST-0006-03 |
| M8 — `src/maneuvers.ts` (alcançado por `src/physics.ts`): lê `Date.now()` | 1: CHK-TEST-0011-01 (a lista pelo grafo de importações ainda vê o módulo, FB-01) |
| M9 — `src/lap.ts`: corte medido pela borda sintética (`edgeDistanceM`) em vez da borda do arquivo | 9: CHK-TEST-0005-01, -02, -03, -04, -05, -07, -10, CHK-TEST-0006-01, CHK-TEST-0007-05 |
| M10 — `src/physics.ts`: `CURB_GRIP_PC` 0,85 → 0,9 | 3: CHK-TEST-0003-01, -02, -03 (sobre a v6 publicada e o literal v5, FB-02) |

Cada verificação modificada reprova em pelo menos uma mutação: CHK-TEST-0005-01 (M2, M3, M9), -02 (M2, M9), -03 (M2, M4, M9),
-04 (M1, M9), -06 (M1, M2), -08 (M2, M3), -10 (M2, M9), CHK-TEST-0006-03 (M7), CHK-TEST-0007-05 (M1, M2, M4, M5, M6, M9).

## 2026-10-30 — rodada 4, Modo B (crédito no painel do resultado da volta do treino, ADR-0007, código rodada 4)

### Entrada

- `400 Code/Output/pista-kart-park/reports/code-validation/code-validation-20261030-1836.md` (commit `38354bb`): ADR-0007
  implementado — o crédito OSM/ODbL é `#lap-training-result-credit`, último filho de `#lap-training-result`, desenhado no mesmo
  redesenho para a pista do resultado (ausente na sintética); `#lap-result-credit` retirado. Reprovava CHK-TEST-0009-04, que
  ainda afirmava `#lap-result-credit`.
- `test-strategy.md`, linha AC-US-0006-04 (o crédito dentro de `#lap-training-result`, `renderCredit` com `creditFor` da entrada
  do `trackId` do resultado exibido, nenhum `lap-result-credit`, sintética sem crédito) e AC-US-0006-05/-06 ("o mesmo").

### Atrito de verificações

Antes: 102 ids nas 12 suítes (os mesmos da rodada 3). Depois: 103. Retiradas 0; adicionada 1 (CHK-TEST-0009-11); modificada 1
(CHK-TEST-0009-04).

### Migração

| Id | O que mudou | Por que o critério continua coberto |
|---|---|---|
| CHK-TEST-0009-04 | `#lap-result-credit` → `#lap-training-result-credit`: a chamada `renderCredit($('lap-training-result-credit'), creditFor(selectedOption(result.trackId)))` dentro de `renderTrainingResult`; o redesenho conserva o contêiner do crédito e põe os elementos do resultado antes dele; em `index.html` o crédito é o último filho de `#lap-training-result`; nenhum `lap-result-credit` em `src/main.ts` nem em `index.html`. Ficam o renderizador único, o ramo que esconde sem crédito e `creditFor` da sintética ausente | AC-US-0006-04/-05/-06 no contrato de ADR-0007: o mesmo crédito, menção e link no painel do resultado de uma volta da Kart Park, escolhido pelo `trackId` do resultado |

### Adicionada

- CHK-TEST-0009-11 (AC-US-0006-04, "sintética sem crédito"): nenhuma verificação ligava o resultado de uma volta real ao crédito;
  CHK-TEST-0009-04 só afirma `creditFor(synthetic)`. A nova abre o treino pela sessão nas duas pistas, cruza a chegada sem
  marcadores, lê o item de `listLapResults` e passa a entrada do catálogo do seu `trackId` a `creditFor`, como o painel faz: a
  sintética dá nenhum crédito, a Kart Park (volta inválida) dá `OSM_CREDIT`. É verificação, não superfície: nenhum elemento,
  chave ou função nova.

### Ajuste à estratégia, mantido

- AC-US-0003-06 (linha da estratégia que nomeia `describeLap` sobre o estado da volta): continua decidido por
  `describeTrainingResult` sobre o item de `listLapResults` em CHK-TEST-0005-03, como na rodada 3 — no treino de voltas seguidas
  o estado nunca carrega `MISSED_MARKER`; é também a função que `renderTrainingResult` usa para o painel em que o crédito agora
  vive. A linha da estratégia fica para a próxima rodada do D-Spec da feature.

### Execução

`npx tsx --test tests/*.test.ts` com `junit` (`reports/junit-latest.xml`) e `spec` (`reports/npm-test-latest.log`): **444
coletadas, 444 aprovadas**, 0 reprovadas, 0 puladas (443 de antes desta rodada + CHK-TEST-0009-11).

### Prova de que as verificações mudadas podem falhar

Cópia do repositório no diretório de rascunho da sessão (`node_modules` por junção), as 12 suítes desta feature, uma mutação de
cada vez; a cópia foi descartada. Linha de base: 103 verificações, 0 reprovadas.

| Mutação | Verificações que reprovaram (103 executadas) |
|---|---|
| S1 — `src/main.ts`: o painel credita a Kart Park qualquer que seja a pista do resultado | 1: CHK-TEST-0009-04 |
| S2 — `index.html`: o crédito sai de `#lap-training-result` | 1: CHK-TEST-0009-04 |
| S3 — `src/main.ts`: o redesenho apaga todos os filhos do painel, o crédito incluído | 1: CHK-TEST-0009-04 |
| S4 — `index.html`: `#lap-result-credit` volta | 1: CHK-TEST-0009-04 |
| S5 — `src/trainingSession.ts`: a entrada `synthetic` passa a ter crédito OSM | 3: CHK-TEST-0007-11, CHK-TEST-0009-04, -11 |
| S6 — `src/lap.ts`: todo resultado nomeia a Kart Park como pista | 1: CHK-TEST-0009-11 |

## 2026-11-03 — rodada 5, Modo A sobre a revisão 2 do seed (acabamento visual, US-0007, NFR-0013, NFR-0014)

### Entrada

- Critérios validados: US-0007 (AC-US-0007-01 a -21), NFR-0013 e NFR-0014 (`req-validation-20261103-1900`); estratégia
  `test-strategy.md` 1.3.0 e DES-0008 2.1.0 (`dspec-validation-20261103-1946`); código da revisão 2 em `fbfb073`
  (`code-validation-20261103-2004` SUCCESS), que muda só `src/trackScene.ts` e uma linha de `src/main.ts`
  (`git diff f926815 fbfb073 --stat -- src`: 2 arquivos; nenhum módulo da simulação).
- Antes da rodada, a suíte da feature tinha 103 verificações, 101 aprovadas: CHK-TEST-0010-03 e -05 reprovavam contra o desenho
  da revisão 2 (afirmavam uma caixa por segmento e quatro filhos na cena).

### Atrito de verificações

Antes: 103 ids nas 12 suítes. Depois: 126. Retiradas 0; modificadas 2 (CHK-TEST-0010-03, -05); adicionadas 23.

### Migração

| Id | O que mudou | Por que o critério continua coberto |
|---|---|---|
| CHK-TEST-0010-03 | de "uma instância por segmento, no ponto médio, escala z = comprimento, 0,2 m de espessura" para "uma `InstancedMesh` de pilhas de pneus, com uma pilha centrada (1e-4 m) em cada vértice de cada poligonal de `barriers`, vãos de no máximo `TYRE_SPACING_M` entre centros seguidos em cada segmento, nenhuma pilha fora da poligonal", como a linha AC-US-0004-06 da estratégia 1.3.0 ("verificação migrada na rodada de 2026-11-03"). Ficam a barreira total > 50 m e a sombra projetada; passa a decidir também AC-US-0007-09 (pneus em toda a extensão) | AC-US-0004-06 continua "a barreira desenhada em todo o seu comprimento": cobrir cada vértice e não deixar vão maior que 0,12 m em nenhum segmento é cobrir a poligonal do primeiro ao último ponto; o desenho de antes (caixas nos pontos médios) reprova (R1b) |
| CHK-TEST-0010-05 | a lista dos filhos da cena passa de 4 (`asphalt`, `curbs`, `barriers`, `start-line`) aos 6 de DES-0008 2.1.0 (`grass`, `asphalt`, `edge-lines`, `curbs`, `barriers`, `start-line`) e afirma `buildTrackScene.length` 1 (REQ-FEAT-0008-24) | AC-US-0002-08: a escala e os cantos do minimapa não mudam; a lista de partes do desenho segue o projeto vigente |

### Adicionadas

| Arquivo | Ids | Critérios |
|---|---|---|
| `scene` (TEST-0010) | CHK-TEST-0010-06 a -16 | AC-US-0007-01, -02, -05, -06, -09, -10, -11, -12, -13, -14, -20 |
| `surface` (TEST-0003) | CHK-TEST-0003-06 a -09 | AC-US-0007-03, -04, -15, -21 |
| `lap` (TEST-0005) | CHK-TEST-0005-13 | AC-US-0007-17 |
| `determinism` (TEST-0006) | CHK-TEST-0006-05 a -07 | AC-US-0007-07, NFR-0013 |
| `screens` (TEST-0009) | CHK-TEST-0009-12 | AC-US-0007-16 |
| `layering` (TEST-0011) | CHK-TEST-0011-08, -09 | AC-US-0007-14, NFR-0004 (REQ-FEAT-0008-22 a -24) |
| `publication` (TEST-0012) | CHK-TEST-0012-07 | NFR-0014 (REQ-FEAT-0008-28, -29) |

AC-US-0007-08, -18 e -19 ("a verificação de ... sem mudança") e a metade de simulação de AC-US-0007-11 são decididos pelas
verificações existentes, sem alteração: CHK-TEST-0003-01 a -03, CHK-TEST-0008-01 a -08 e CHK-TEST-0004-02 a -05; os registros
TEST-0003, -0004 e -0008 passam a citá-los nas fontes.

### Fixture `tests/fixtures/kartParkRev1Trace.json`

Dados apenas (JSON, 1,3 MB; nenhum código). Gravado uma vez com a simulação de `f926815c2177ebf5b315a5e17cfb9e2f044acf5a`, o
commit anterior ao código da revisão 2: `git worktree add --detach <rascunho>/wt-f926815 f926815`, `node_modules` por junção, e um
programa de gravação no diretório de rascunho que importa `src/` e `tests/helpers/` **da árvore desse commit**; a árvore foi
retirada depois (`git worktree remove`). O mesmo programa rodado sobre `fbfb073` deu um arquivo byte a byte igual (`cmp`), o que
confirma o `git diff --stat` acima: nenhum arquivo da simulação difere. O campo `recordedFromCommit` guarda o hash e
CHK-TEST-0006-05 o afirma. Sequências (DES-0006): `pilot-valid-lap` (6.675 passos, volta `VALID`, 55.622 ms, setores 19.443 /
11.716 / 11.460 / 13.003 ms), `pilot-edge-curb-barrier` (4.626 passos: rodas da esquerda sobre a faixa de borda entre 15 e 55 m,
o centro do kart sobre a primeira zebra de mais de 15 m depois de 60 m, atalho pela grama de 385 m para 600 m até a barreira, 360
passos depois do primeiro `barrierContact`) e `seeded-2000` (as entradas de `Seeded(20261027)` de CHK-TEST-0006-04). Cada
sequência guarda as entradas e, por passo, `x`, `z`, rumo e velocidade; as verificações reproduzem as entradas gravadas (não o
piloto), de modo que uma mudança do piloto não altera a comparação.

### Execução

`npx tsx --test` com os repórteres `junit` (`reports/junit-latest.xml`) e `spec` (`reports/npm-test-latest.log`) sobre
`tests/*.test.ts`, em `fbfb073` com as suítes desta rodada: **467 coletadas, 467 aprovadas**, 0 reprovadas, 0 puladas, ~46 s
(444 de antes + 23 novas). As 12 suítes desta feature: 126 verificações; `scene` ~0,9 s (a face dos pneus 0,22 s), `determinism`
~8 s (três reproduções do traço e as duas voltas de antes), `lap` com a volta a 2 m/s na faixa de borda.

### Prova de que as verificações novas e mudadas podem falhar

Cópia de `src/`, `scripts/`, `tests/`, `tracks/`, `docs/`, `index.html`, `package.json` e `tsconfig.json` no diretório de rascunho
da sessão (`node_modules` por junção), as 12 suítes da feature, uma mutação de cada vez; a cópia foi descartada. Linha de base na
cópia: 126 verificações, 0 reprovadas.

| Mutação | Verificações que reprovaram (126 executadas) |
|---|---|
| R1b — `src/trackScene.ts` e `src/main.ts` de `f926815` (o desenho da revisão 1), com as constantes e `grassToneAt` da revisão 2 acrescentados para o módulo carregar | 13: CHK-TEST-0009-12, CHK-TEST-0010-03, -05, -06, -07, -09, -10, -11, -12, -14, -15, -16, CHK-TEST-0011-08 |
| R1 — o mesmo sem as exportações acrescentadas | as suítes `scene`, `surface`, `lap` e `determinism` não carregam (exportação ausente); CHK-TEST-0009-12, CHK-TEST-0011-08 |
| D1 — `EDGE_LINE_WIDTH_M` 0,10 → 0,11 | 1: CHK-TEST-0010-07 |
| D2 — vértice interno na bissetriz sem o fator 1/cos(θ/2) | 1: CHK-TEST-0010-07 |
| D3 — a faixa de borda sem o segmento de fechamento | 1: CHK-TEST-0010-06 |
| D4 — o lado do asfalto da zebra também erguido | 1: CHK-TEST-0010-08 |
| D5 — `CURB_RELIEF_M` 0,04 → 0,06 | 1: CHK-TEST-0010-09 |
| D6 — pneus `#1b1b1b`/`#3a3a3a` | 1: CHK-TEST-0010-10 |
| D7 — `TYRES_PER_STACK` 5 → 4 | 1: CHK-TEST-0010-11 |
| D8 — `TYRE_RADIUS_M` 0,16 | 1: CHK-TEST-0010-12 |
| D9 — sem pilha nos vértices, espaçamento 0,18 m | 2: CHK-TEST-0010-03, -12 |
| D10 — `TYRE_RADIUS_M` 0,06 | 1: CHK-TEST-0010-12 |
| D11 — pilhas deslocadas 0,5 m em x | 2: CHK-TEST-0010-03, -12 |
| D19 — pilhas deslocadas 1,5 m em x | 3: CHK-TEST-0010-03, -12, -13 |
| D12 — `GRASS_TONES` com `#68865b` | 1: CHK-TEST-0010-16 |
| D13 — `GRASS_TONES` com `#7f7f7f` | 2: CHK-TEST-0010-14, -16 |
| D14 — cada faixa de grama no tom da faixa seguinte | 1: CHK-TEST-0010-15 |
| D15 — tom da faixa com `Date.now()` | 1: CHK-TEST-0011-08 |
| D16 — `new THREE.TextureLoader()` em `src/trackScene.ts` | 1: CHK-TEST-0011-09 |
| D17 — `src/main.ts`: `ground.visible = !ready` | 1: CHK-TEST-0009-12 |
| D18 — `src/main.ts`: `ground` em `#6e8f60` | 1: CHK-TEST-0009-12 |
| S1 — `src/physics.ts`: `CURB_GRIP_PC` 0,85 → 0,86 | 6: CHK-TEST-0003-01, -02, -03, CHK-TEST-0006-05, -06, -07 |
| S2 — `src/trackGeometry.ts`: `BARRIER_HALF_WIDTH_M` 0,1 → 0,12 | 2: CHK-TEST-0004-04, CHK-TEST-0006-05 |
| S3 — `trackEnvironment`: o asfalto a até 0,1 m da borda (a faixa) lido como grama | 4: CHK-TEST-0003-06, CHK-TEST-0006-05, -06, -07 |
| S4 — `trackEnvironment`: uma faixa de 5 m de grama em duas lida como zebra | 6: CHK-TEST-0003-08, -09, CHK-TEST-0004-02, CHK-TEST-0006-05, -06, -07 |
| S5 — `surfaceMu`: atrito do asfalto × 1,0001 | 4: CHK-TEST-0003-01, -02, CHK-TEST-0006-05, -06 |
| S6 — o passo ignora a barreira | 4: CHK-TEST-0004-02, -03, -04, CHK-TEST-0006-05 |
| S7 — `trackEdgeDistanceM`: centro a até `trackWidth/2` + 0,1 m da borda contado 3,5 m além dela | 4: CHK-TEST-0003-03, -07, CHK-TEST-0005-07, -13 |
| F1 — `src/tracks/kart-park-v1.json` com um byte a mais | 5: CHK-TEST-0001-16, CHK-TEST-0012-01, -03, -05, -07 |

Cada verificação nova ou mudada reprova em pelo menos uma mutação. CHK-TEST-0010-08 (lado do asfalto a 0 m) e -13 (pneus na
grama) passam no desenho da revisão 1, onde o critério também valia (zebra plana; caixas na grama), e reprovam em D4 e D19.
Durante a escrita, três verificações foram corrigidas na própria fixture, não no código: CHK-TEST-0003-06/-07 (karts escolhidos
onde as duas rodas do lado cabem na faixa de 0,10 m sob a distância entre eixos, ao menos 20), CHK-TEST-0005-13 (piloto a 2 m/s,
`98-divergences.md`) e CHK-TEST-0011-09 (os carregadores de `three` são `THREE.<nome>`: a busca por palavra com o prefixo excluído
não via D16; passou a procurar `Loader` em qualquer posição).

### Itens declinados

Nenhum relatório de validação de testes pendente para esta rodada; nada declinado.

## 2026-11-06 — rodada 6, Modo A sobre a revisão 3 do seed (réplica não oficial publicada como `kart-park` `trackVersion` 2)

### Entrada

- Critérios validados da revisão 3 (`req-validation-20261106-1741`): AC-US-0001-08 e -09 novos; AC-US-0002-01 a -07 com os
  números da réplica (691 pontos, 690,7 m ± 1 %, 7,0 m, 0,10 m, raio 8,8 m perto de 216 m); AC-US-0003-02 (204,9 / 354,9 /
  534,7 m), AC-US-0003-12 e AC-US-0005-13 novos; AC-US-0005-01/-02 (22 trechos); AC-US-0006-07/-08 ("réplica não oficial",
  691 m); NFR-0013 2.0.0 e NFR-0014 2.0.0; **AC-US-0003-09 retirado** (com REQ-FEAT-0003-12 no F-Spec). F-Spec
  `fspec-validation-20261106-1805` (RULE-0002 2.0.0, V01 a V20; API-0002 2.0.0, `TRACK_VERSION_MISMATCH`). Estratégia
  `test-strategy.md` 2.0.0 e o changelog do D-Spec (rodadas Mode A, B e C de 2026-11-06; `dspec-validation-20261106-1853`,
  `8b00b74`). Código `06582f8` (`code-validation-20261106-1912` SUCCESS): linhas 7 e 8 de
  `400 Code/Output/pista-kart-park/98-divergences.md` devidas a esta etapa, e a ISSUE-02 (info) do relatório, registrada para
  esta etapa provar o `FAILED` por `TRACK_VERSION_MISMATCH` com `#best` em "—".
- Antes da rodada: 126 verificações nas 12 suítes, 104 aprovadas e as 22 presas à versão 1 que o manifesto do código lista
  reprovadas. Com a fixture trocada para a versão 2, mais 8 reprovaram por fatos da versão 1 escritos nelas (CHK-TEST-0002-01,
  -0005-13, -0006-05 a -07, -0010-03, -06, -0012-01, -03) e a suíte `track-file` deixou de carregar (`withTrackVersion2`).

### Atrito de verificações

Antes: 126 ids nas 12 suítes. Depois: 136. Retirada 1 (CHK-TEST-0005-06); modificadas 41; adicionadas 11; as demais 84
carregadas sem mudança de texto, agora sobre a versão 2 pela fixture. As de `barrier` (TEST-0004) lançam o kart contra o segmento 217 da
barreira publicada, que passa a ser o da versão 2 (291 segmentos); as de `surface`, `feedback` e `scene` escolhem os seus pontos pela
geometria lida, sem número da versão 1.

### Fixture `tests/fixtures/kartParkFiles.ts`

`PUBLISHED_PATH` e `kartParkText()` passam a `src/tracks/kart-park-v2.json` (a estratégia 2.0.0, "Fixtures"); entram
`PUBLISHED_V1_PATH` e `kartParkV1Text()` (a versão 1 lida no lugar, sem cópia), `REPLICA_PATH` e `replicaJson()` (objeto novo a
cada chamada, para que uma cópia da réplica não contamine a seguinte); `originJson()` continua, só para a reprodução da versão 1.
Cópias derivadas: `withTrackVersion2` → `withTrackVersion1`; `withPointOffset` passa a 0,2 m (o limite é 0,10 m); novas
`withWidth` (um `widthM` 6,9), `withSectorLimitAt` (um limite trocado por outra linha) e `withCurbPastLap` (um trecho além da
volta). Todas continuam objetos novos; nenhum arquivo publicado é alterado (I3).

### Migração

| Id | O que mudou | Por que o critério continua coberto |
|---|---|---|
| CHK-TEST-0001-01 a -07, -09, -11 a -16, -18, -19 | cada fato rederivado contra a réplica de RULE-0002 2.0.0 (eixos (*x*, −*y*) com a origem da réplica, sem caixa envolvente nem correspondência por índice) em vez da origem da versão 1: 691 pontos e fechamento < 2 m; 683,793–697,607 m; ponto 0 a ≤ 0,10 m de *R*₀ (V01, REQ-FEAT-0002-19) junto da linha de chegada; área igual à da réplica a 1 %; largura 7,0 em todo ponto; ≤ 0,10 m da poligonal da réplica e `maxReplicaOffsetM` do registro; raio 8,8 m no arco de 216–229,1 m; limites pelo *d* mais próximo de 204,9 / 354,9 / 534,7 m; *T*₁ 368,5–406,5 m e *T*₂ 594,5–624,5 m por *d*, cada borda amostrada sozinha (DES-0010 2.1.0 passo 5); soma ≤ 6 m nas amostras de 0,25 m; folga ≥ 0,2 m da pista (a guarda do preparo); 22 trechos um a um com a réplica; `trackVersion` 2; V01 a V20; as cópias da lista acima | os critérios são os mesmos ids, com os números que a revisão 3 lhes deu; as provas específicas da versão 1 (suavização, correspondência por índice, 34 trechos, zebra da largada dividida) deixam de julgar o arquivo da versão 1, que passa a ser julgado pelo resumo (CHK-TEST-0012-07, -09), como o changelog do D-Spec planejou |
| CHK-TEST-0001-09 | a parte "o limite fica num trecho de raio > 15 m" sai desta verificação | passa a AC-US-0003-12, decidido por CHK-TEST-0001-21 (dentro de um elemento `reta` da réplica e raio > 50 m) |
| CHK-TEST-0001-12 | a afirmação "nenhuma barreira junto ao atalho de 12–26 m da curva 4" sai | segue REQ-FEAT-0003-12 e AC-US-0003-09, retirados; AC-US-0004-02 continua decidido pela soma ≤ 6 m em toda a barreira |
| CHK-TEST-0002-01 | `trackVersion` 2 | AC-US-0002-08: a leitura carrega o arquivo empacotado, agora a versão 2 |
| CHK-TEST-0005-13 | a janela da faixa de borda passa de 15–55 m (curva na versão 2: maior sequência 87 passos) a 425–470 m, a reta de 419,8–478 m da réplica sem zebra à esquerda, e o ganho de esterço de 1 a 2 (com 1, o kart ficava fora da faixa; medido no rascunho: 57 passos com 1, 1.318 com 2) | AC-US-0007-17 é sobre andar na faixa de borda mais de 120 passos sem corte; a recalibração do piloto na versão 2 é o que a estratégia 2.0.0 pede ("parâmetros recalibrados pela etapa de testes") |
| CHK-TEST-0006-05 a -07 | o traço `kartParkRev1Trace.json` (sem mudança) passa a ser reproduzido sobre a leitura, a geometria e o ambiente de `kartParkV1Text()` | DES-0006 2.0.0: o traço continua sobre a versão 1, como prova de que a simulação não mudou desde a revisão 1; NFR-0013 2.0.0 passa a CHK-TEST-0006-08 a -10 |
| CHK-TEST-0007-01, -02, -03, -08 | entrada `kart-park` com os cinco campos de API-0002 2.0.0 (`trackVersion` 2); respostas e volta com `trackVersion` 2 | AC-US-0001-01 a -03, -07 sobre o catálogo e a sessão da revisão 3 |
| CHK-TEST-0007-09 | o arquivo legível de outro `trackId` dá `TRACK_VERSION_MISMATCH` com `{FAILED, kart-park, COMPLETE}` (antes `TRACK_DATA_UNREADABLE`) | API-0002 2.0.0 põe "outro `trackId`" e "outra versão" no mesmo código (changelog do D-Spec, itens recusados); as asserções do texto corrompido e do esquema 4 ficam |
| CHK-TEST-0007-11 | "réplica não oficial", 691 m; "não derivado do comprimento medido" passa de "o comprimento suavizado não arredonda a 687" a "691 é inteiro, diferente dos 690,674 m medidos e não muda quando a sessão lê outro arquivo" | 690,674 m arredonda para 691: a contraprova antiga deixou de poder falhar; a nova falha se o catálogo derivar o comprimento do arquivo |
| CHK-TEST-0009-05, -06, -08 | rótulo "… (réplica não oficial) · 691 m"; nenhum "traçado aproximado" nem "687 m" nos quatro arquivos da estratégia; `kartParkV2Text` e `./tracks/kart-park-v2.json?raw` | AC-US-0006-07, -08, AC-US-0001-08 pelas linhas da estratégia 2.0.0 |
| CHK-TEST-0010-03, -06 | barreira declarada > 40 m (a da versão 2 tem 47,649 m); 691 segmentos por borda | AC-US-0004-06 e AC-US-0007-01 com as medidas da versão 2 (DES-0008 3.0.1) |
| CHK-TEST-0011-02 | `./tracks/kart-park-v2.json?raw` e o arquivo da versão 2 em `src/tracks/` | NFR-0004 sobre o arquivo empacotado |
| CHK-TEST-0011-05 | a lista de nomes proibidos nos ensaios das outras features ganha `kart-park-v2` e `kart-park-replica` | NFR-0009 cobre também os arquivos novos |
| CHK-TEST-0012-01 a -07 | a entrada `kart-park` 2 (`REPLICA`, réplica, `maxReplicaOffsetM`) em vez da 1; versões [1, 2] e a do catálogo; reprodução da versão 2 por `prepareReplicaTrack` e da versão 1 pelo preparo congelado; promoção na versão 2 sem tocar a entrada 1; `verify`, `prepare` e `publish` da versão 2 (20 `PASS`), `synthetic 2` recusado como `trackVersion` (DES-0010 2.1.0: `trackId` é qualquer entrada do catálogo e o par tem de estar em `TRACK_ORIGINS`), `moon` e `Kart-Park` como `trackId`, e o preparo de novo só sem a entrada 2; a entrada 1 comparada campo a campo com o literal da publicação e "a única entrada" passa a "a entrada 1 intacta e a 2 acrescentada" | NFR-0006, NFR-0012, NFR-0014 pelas linhas da estratégia 2.0.0 (REQ-FEAT-0002-14, -17, -18, -20, -21) e pela tabela de migração do changelog do D-Spec (CHK-TEST-0012-03, -07) |

### Retirada (critério retirado a montante)

| Id | Critério | Base | Aprovação |
|---|---|---|---|
| CHK-TEST-0005-06 (a volta pelo atalho da curva 4) | AC-US-0003-09 | retirado nos requisitos da revisão 3 (com REQ-FEAT-0003-12 no F-Spec); a estratégia 2.0.0 marca a linha como retirada e diz que a prova sai; o atalho pela grama sem barreira segue decidido pela excursão de AC-US-0003-05 (CHK-TEST-0005-04, `MISSED_MARKER`) e pelas linhas de V10 e V11 (CHK-TEST-0001-10, -18) | revisão 3 do seed escrita pelo dono do produto (Eduardo Matos, 2026-11-06); retirada instruída pelo chamador desta rodada (test-loop, "retire checks only for retired requirements"); a confirmação explícita do dono do produto continua pedida, como no changelog do D-Spec. Nenhum critério vigente fica sem verificação: não há linha de divergência |

### Adicionadas

| Arquivo | Ids | Critérios |
|---|---|---|
| `track-file` (TEST-0001) | CHK-TEST-0001-21, -22 | AC-US-0003-12 (V19), AC-US-0005-13 (V20) |
| `track-data` (TEST-0002) | CHK-TEST-0002-09 | AC-US-0002-06 no estado da simulação (a linha central da sessão a ≤ 0,10 m da réplica) |
| `determinism` (TEST-0006) | CHK-TEST-0006-08 a -10 | NFR-0013 2.0.0 (REQ-FEAT-0008-25, -26, -27), AC-US-0007-07: as três sequências na versão 2 com e sem o acabamento; fecha a linha 7 de `400 Code/Output/pista-kart-park/98-divergences.md` |
| `session` (TEST-0007) | CHK-TEST-0007-12, -13 | AC-US-0001-08, AC-US-0001-09 (`TRACK_VERSION_MISMATCH` pela abertura e pelo seletor) |
| `screens` (TEST-0009) | CHK-TEST-0009-13 | AC-US-0001-09 na aplicação: nenhum `kart-park-v1` em `src/main.ts`, `FAILED` com o erro de dados e sem oferta, e `#best` em "—" (ISSUE-02 de `code-validation-20261106-1912`) |
| `publication` (TEST-0012) | CHK-TEST-0012-08, -09 | NFR-0014 (REQ-FEAT-0002-20, -21: `prepare`, `verify`, `publish kart-park 1` recusados; regras `-text`); NFR-0006, NFR-0014: a verificação de imutabilidade do "Teste da reversão" de DM-0001 e DM-0002 2.0.1 |

As verificações de AC-US-0007-08, -11 (metade da simulação), -18 e -19 ("sem mudança") continuam as de antes, agora sobre a
versão 2. A linha 8 do manifesto do código fica atendida pelas migrações e adições acima.

### Execução

Execução fresca, sem cache e sem a contagem de `reduce_run.py`, na árvore de `06582f8` com as suítes desta rodada:

```
npx tsx --test --test-reporter=junit --test-reporter-destination="500 Tests/Output/pista-kart-park/runs/test-run-20261106-1640.junit.xml" --test-reporter=spec --test-reporter-destination=stdout tests/*.test.ts
```

Totais do próprio runner (linhas `ℹ` de `runs/test-run-20261106-1640.spec.log`): **477 testes, 477 aprovados, 0 reprovados**, 0
cancelados, 0 pulados, 0 todo, ~48 s (467 de antes − 126 + 136 desta feature). `runs/test-run-20261106-1640.junit.xml` traz os
mesmos 477 `testcase`, nenhum com `failure` ou `skipped`; 136 deles de `tests/pista-kart-park-*.test.ts`. `npx tsc --noEmit`:
saída 0. Antes desta execução, as 12 suítes da feature rodaram sozinhas: 136/136.

### Prova de que as verificações novas e mudadas podem falhar

Cópia de `src/`, `scripts/`, `tests/`, `tracks/`, `docs/`, `index.html`, `package.json`, `tsconfig.json` e `.gitattributes` no
diretório de rascunho da sessão (`node_modules` por junção), as 12 suítes da feature, uma mutação de cada vez, cada arquivo
restaurado byte a byte depois; a cópia foi descartada. Linha de base na cópia: 136 verificações, 0 reprovadas.

| Mutação | Verificações que reprovaram (136 executadas) |
|---|---|
| M1 — `src/trainingSession.ts`: a entrada `kart-park` do catálogo declara `trackVersion` 1 (o catálogo da reversão) | 16: CHK-TEST-0002-09, CHK-TEST-0006-03, CHK-TEST-0007-01, CHK-TEST-0007-02, CHK-TEST-0007-03, CHK-TEST-0007-05, CHK-TEST-0007-06, CHK-TEST-0007-07, CHK-TEST-0007-08, CHK-TEST-0007-10, CHK-TEST-0007-12, CHK-TEST-0007-13, CHK-TEST-0009-11, CHK-TEST-0009-12, CHK-TEST-0009-13, CHK-TEST-0012-02 |
| M2 — `selectTrainingTrack` sem a conferência de versão (o arquivo da versão 1 abre sessão) | 2: CHK-TEST-0007-13, CHK-TEST-0009-13 |
| M3 — `displayName` "(traçado aproximado)" (o nome da revisão 1) | 3: CHK-TEST-0007-11, CHK-TEST-0009-05, CHK-TEST-0009-06 |
| M4 — `displayLengthM` 687 | 3: CHK-TEST-0007-11, CHK-TEST-0009-05, CHK-TEST-0009-06 |
| M5 — `src/main.ts` importa `./tracks/kart-park-v1.json?raw` (a importação da reversão) | 4: CHK-TEST-0009-08, CHK-TEST-0009-13, CHK-TEST-0011-02, CHK-TEST-0012-02 |
| M6 — `renderBest` escreve o melhor tempo sem conferir `COMPARABLE` | 1: CHK-TEST-0009-13 |
| M7 — `TRACK_VERSION_MISMATCH` devolvido como `TRACK_DATA_UNREADABLE` | 3: CHK-TEST-0007-09, CHK-TEST-0007-13, CHK-TEST-0009-13 |
| M8 — `buildTrackScene` desloca 0,3 m a ponta de cada segmento de barreira que desenha (o acabamento com efeito na simulação) | 4: CHK-TEST-0006-08, CHK-TEST-0006-10, CHK-TEST-0010-03, CHK-TEST-0010-12 |
| M9 — `scripts/track-pipeline.ts` sem a recusa da versão congelada | 1: CHK-TEST-0012-08 |
| M10 — `scripts/trackChecks.ts`: V19 sempre aprovada | 1: CHK-TEST-0001-19 |
| M11 — `scripts/trackChecks.ts`: V20 sempre aprovada | 1: CHK-TEST-0001-19 |
| M12 — `src/tracks/kart-park-v1.json` com um byte a mais | 4: CHK-TEST-0012-03, CHK-TEST-0012-05, CHK-TEST-0012-07, CHK-TEST-0012-09 |
| M13 — `tracks/registry.json`: `stagedAtUtc` da entrada 1 trocado em 1 ms | 2: CHK-TEST-0012-07, CHK-TEST-0012-09 |
| M14 — `tracks/registry.json`: `maxReplicaOffsetM` da entrada 2 0,05 | 3: CHK-TEST-0001-06, CHK-TEST-0012-03, CHK-TEST-0012-09 |
| M15 — `tracks/sources/kart-park-replica.json`: ponto 0 da réplica movido 0,2 m em *x* | 8: CHK-TEST-0001-03, CHK-TEST-0001-06, CHK-TEST-0001-18, CHK-TEST-0001-19, CHK-TEST-0012-01, CHK-TEST-0012-03, CHK-TEST-0012-05, CHK-TEST-0012-09 |
| M16 — `src/tracks/kart-park-v2.json`: uma largura 6,9 m | 7: CHK-TEST-0001-05, CHK-TEST-0001-18, CHK-TEST-0001-19, CHK-TEST-0012-01, CHK-TEST-0012-03, CHK-TEST-0012-05, CHK-TEST-0012-09 |
| M17 — ponto 0 da réplica movido 0,6 m em *x* (só as suítes `track-data` e `track-file`) | 5: CHK-TEST-0001-03, CHK-TEST-0001-06, CHK-TEST-0001-18, CHK-TEST-0001-19, CHK-TEST-0002-09 |
| M18 — `buildTrackScene` desloca 0,4 m os vértices das zebras que desenha (só a suíte `determinism`) | 3: CHK-TEST-0006-08, CHK-TEST-0006-09, CHK-TEST-0006-10 |

Cada verificação nova ou mudada reprova em pelo menos uma mutação ou numa cópia derivada da própria verificação. Com M15 a verificação CHK-TEST-0002-09 passa: o ponto 0 publicado fica a menos de 0,10 m da poligonal da réplica movida (o segmento de fechamento passa perto dele); M17 a reprova. CHK-TEST-0006-09 passa em M8 (a volta válida não toca a barreira) e reprova em M18.

Além delas, cada cópia derivada de CHK-TEST-0001-19 é uma mutação do arquivo publicado julgada por `verifyTrackFile`, e
CHK-TEST-0007-11, -0009-13 e -0012-05 trazem a sua contraprova no próprio teste (o mesmo registro `COMPARABLE` na versão 2; outra
versão serializando outro texto). Durante a escrita, duas cópias foram corrigidas na própria fixture, não no código: a zebra além
da volta ficou a 0,0008 m (a leitura recusa mais de 0,001 m, e então todo V reprova) e o limite no arco usa um marcador retirado
da lista (a mesma linha declarada duas vezes lê `INCOMPLETE`).

### Itens declinados e observações

- A `npx tsc --noEmit` do projeto cobre só `src/` (`tsconfig.json`, `include`); as suítes da feature foram conferidas também
  com `tsc --strict` isolado: nenhum erro além da falta dos tipos de `node` no projeto (`@types/node` não é dependência, e esta
  etapa não acrescenta dependência, REQ-FEAT-0007-11). Dois estreitamentos de tipo já existentes em CHK-TEST-0007-09 foram
  corrigidos no mesmo passo.
- "Teste da reversão" de DM-0001/DM-0002 2.0.1 ("a árvore revertida passa no `npm test`"): CHK-TEST-0012-09 é a verificação de
  imutabilidade e não lê o catálogo nem `src/main.ts`, então passa nas duas árvores. As verificações desta rodada que decidem
  AC-US-0001-08/-09, AC-US-0006-07/-08 e NFR-0006 sobre a versão 2 (CHK-TEST-0007-01 a -03, -12, -13, CHK-TEST-0009-05, -06,
  -08, -13, CHK-TEST-0011-02, CHK-TEST-0012-02, CHK-TEST-0002-09) reprovam por construção numa árvore cujo catálogo e cuja
  importação voltaram à versão 1 (M1, M5). Fica registrado em `98-divergences.md` para a etapa de deploy e o D-Spec: a árvore
  revertida precisa da suíte da revisão 2 nessas verificações, ou o critério de reversão precisa dizer qual suíte roda.
- Nenhum relatório de validação de testes pendente para esta rodada; nada mais declinado.
