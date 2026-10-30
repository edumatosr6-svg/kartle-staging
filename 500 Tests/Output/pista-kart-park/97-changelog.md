---
title: Changelog do estágio de testes
feature: pista-kart-park
stage: test
status: validated
version: 1.2.0
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
