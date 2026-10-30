---
title: Registro de mudanças — modelo Kart 01 e câmera de jogo (estágio de código)
feature: modelo-kart-01
stage: code
status: validated
version: 1.2.0
sources: []
---

# Registro de mudanças

## 2026-10-27 — rodada 1, Mode A (projeto 1.2.0, `dspec-validation-20261027-1624`; após o código validado da `dirigibilidade`, `code-validation-20261027-1824`)

**O que mudou**

- `tests/fixtures/kart01-sim-baseline.json` (DM-0001, ADR-0004): gravado primeiro, sobre a árvore de `b86b200` sem nenhuma outra
  mudança desta feature, por `scripts/kart01-baseline.ts` (novo; `npm run baseline:kart01 -- --force --commit <sha>`): `schemaVersion`
  1, `recordedAtUtc`, `recordedOnCommit`, `stepS`, `inputTypeLine`, `simWheelbaseM` 1,04, `simTrackWidthM` 1,20, `trackId`/`trackVersion`,
  `wheelPositions` por acerto e duas `referenceRuns` (`OFFICIAL`, `driverMassKg` 75, `inputRuns` por corridas, `checkStepCount`,
  `lapValidity`, `lapMs`, `sectorMs`, `finalKart`). Recusa sobrescrever sem `--force`; nenhum `os.hostname`/`os.userInfo`/caminho absoluto.
- `src/kart01Model.ts` (DES-0001, ADR-0001): transcrição em TypeScript de `docs/kart-01/kart.js` com as mesmas geometrias, `MEDIDAS`,
  `CORES` e cinemática dos braços (`maoNoVolante`, `resolverCotovelo`); um `MeshStandardMaterial` com cores por vértice para toda peça
  sólida, malhas de cada grupo/nó animável mescladas por `mergeGeometries` depois de `toNonIndexed()`; decalques em `materials.plate` e
  `materials.sidepod`; 16 grupos nomeados, nós `steer`/`spin` por roda, `volanteGiro`, três malhas rígidas por braço, âncoras
  `escapamentoSaida` (0,39, 0,33, 0,77) e `placaTraseira`; `buildKart01Model`, `updateKart01Pose`, `steeringWheelAngleRad` e as constantes
  da interface do projeto. Medido: 27 malhas, 27 chamadas, 5 128 triângulos.
- `src/kart01Decals.ts` (DES-0001): `paintKart01Decals` pinta a placa (512 × 352, fundo branco, número na cor `borracha`) e o adesivo
  lateral (1024 × 192, número e `KARTLE`) em `canvas`, com a pilha de fontes de recuo e sem `@font-face`; sem contexto 2D, `console.warn`
  `kart01-decals`/`NO_2D_CONTEXT` e nada lança; chamada repetida descarta as texturas anteriores.
- `src/kartPose.ts` (DES-0002): `getKartPose` (API-0001 campo a campo, `NO_STATE` sem lançar), `rollingSpeedMps` com sinal por
  `bodyVelocity().u`, `WHEEL_DIAMETERS_M`, `initialWheelSpin`, `advanceWheelSpin` (só com `delta > 0`; `delta < 0` reinicia sem girar),
  `modelOffsetForwardM`, `simWheelGroundPositions` (a transformação de `src/physics.ts:229`).
- `src/gameCamera.ts` (DES-0003, ADR-0002): `decideCameraMode`, `viewShapeOf`, `baseVerticalFovDeg` (62°; retrato `max(62°, 60°
  horizontal)`), `horizontalFovDeg`, `raceChasePose` (1,38 m / 3,05 m / mira 3,2 m a 0,30 m), `trackBoundsOf`, `fitOverviewHeightM`
  (projeção dos quatro cantos com a base de `lookAt`, margem 5 %, altura inteira a partir de 20 m, teto 5 000 m), `trackOverviewPose`
  (inclinação 10°), `countdownDescentPose` (retenção 100 ms, `smoothstep`), `computeCameraView` (API-0003; `NO_SCENE` sem limites).
  Medido na pista sintética: 16:9 → 104 m; 4:3 → 121 m; 1:1 → 158 m; 3:4 → 164 m (75,2°); 9:16 → 164 m (91,5°).
- `src/main.ts` (DES-0004, DES-0005): kart de caixas, cilindros de raio 0,31, `helmet`, `wheels`, `cameraTarget`, câmera inicial fixa,
  perseguição com `lerp`, `targetFov` com termo de velocidade e `skidClock` **retirados**; entram `kart01` (montado e pintado uma vez,
  `rotation.y = π`) dentro de `kartRoot`; caixa de sombra ±60 m em torno do kart com `sun.target` na cena e luz por quadro; um jato de
  escapamento filho de `anchors.exhaustOutlet`; `trackBounds`, `spin`, `cameraView`; `applyCameraView`; no laço de quadro a pose de
  `getKartPose`, o deslocamento `modelOffsetForwardM` em Z de `kart01.root`, o giro por `advanceWheelSpin`, as marcas por
  `simWheelGroundPositions(pose, lap.config)` a cada 5 passos (`lastSkidStepCount`, `SKID_STEP_INTERVAL`), a câmera por
  `computeCameraView` com a largura e a altura lidas no quadro, e `renderer.render` só com `cameraView` (senão `clear`).
- `package.json`: script `baseline:kart01`. `docs/kart-01/device-log.md`: molde do registro em tela com a entrada do build.
- Manifesto: `01-implementation.md`, `web/DES-0001` a `web/DES-0006`, `data/DM-0001`, `security/DES-0007`, `98-divergences.md`;
  `00-index.md` e `99-traceability.md` gerados por `lint_artifacts.py --emit`.

**Decisões de implementação, onde o projeto deixava detalhe em aberto** (nenhuma muda contrato nem requisito)

- Braços: os três nós rígidos recebem só posição e quaternion por quadro, como o projeto diz. Medido: para |esterço| ≤ 0,40 rad (o
  maior `maxSteer` dos acertos publicados é 0,40) a distância cotovelo–mão é exatamente `l2` (desvio 2 × 10⁻¹⁶ m), logo o comprimento
  do antebraço é constante; só acima de 0,5 rad de esterço (0,8 mm a 8,6 mm, inalcançável pela simulação) o código do Cowork esticaria
  o antebraço.
- A queixeira do capacete perde `side: DoubleSide` ao entrar no material único (frente só); nenhuma cor ou triângulo muda —
  aparência fora das quatro cores é lacuna deliberada do F-Spec, como ADR-0001 registra para rugosidade e metalização.
- O material do adesivo lateral fica com a `color` branca padrão (a textura carrega as cores); o da placa fica com `KART01_PALETTE.placa`
  e a textura com fundo branco, como DES-0001 pede.
- O gravador da linha de base dirige com `autopilot()` (configuração padrão do helper, como o projeto nomeia) e a sessão corre com o
  acerto publicado: com `autopilot(0, ARCADE_ASSISTIDO_V5)` a volta cortava a pista (INVALID, 1 633 passos) e não servia de referência.
- O nó `suporte` do painel frontal e o nó `motorBloco` do motor continuam grupos (sem geometria, sem chamada de desenho), com a malha
  mesclada e o decalque dentro.
- O jato de escapamento fica num grupo `exhaust` filho da âncora, com o cone a `z = 0,6` (base na ponteira) e `rotation.x = π/2`; a
  pulsação continua em `exhaust.scale.z`.
- O comentário da marca de pneu em `src/main.ts` evita o nome literal `wheelPositions`, retirado da importação.

**Itens fechados**: nenhum `ISSUE-<nn>` ou `FB-<nn>` pendente (primeira geração; nenhum relatório de validação de código e nenhum
feedback de outra feature nesta feature).

**Itens recusados, com motivo**

- `tests/helpers/kart01Report.ts`, `tests/modelo-kart-01-model.test.ts`, `-pose.test.ts`, `-camera.test.ts`, `-contract.test.ts`:
  pertencem ao estágio de testes (`test-strategy.md`); por isso as linhas de `98-divergences.md` que nomeiam registros de `npm test`
  ficam `open` para aquele estágio. A medição que `DRAW_COST`, `KART_DIMENSIONS`, `WHEELS_AND_TRACKS`, `PART_GROUPS` e `PART_COLORS` farão
  foi executada aqui por programa descartável e os números estão em `01-implementation.md` e `web/DES-0001`.
- Execuções em aparelho de `docs/kart-01/device-log.md` (fps, download comprimido, roteiros E2E): evidência humana; o arquivo entra
  com a entrada do build e os roteiros marcados como não executados.
- Mudar a geometria das rodas (mais segmentos, ou um vértice em ±Y) para que a extensão em Y meça 0,26/0,28: mudaria a forma
  (REQ-FEAT-0004-04, 5 128 triângulos) — recusado; a regra de medida vai ao feedback (SPEC-ISSUE-01).
- Escala por quadro no antebraço (o que `posicionarTubo` faz): desnecessária na faixa de esterço da simulação (medição acima) e o
  projeto diz "sem escala por quadro".
- Dividir `src/main.ts`, chave para o kart provisório ou a câmera alta, ajuste de campo de visão: proibidos pelo F-Spec/projeto.
- Nenhum limiar afrouxado, nenhum requisito enfraquecido, nenhuma dependência acrescentada, nenhum arquivo fora dos que o projeto
  nomeia foi tocado.

**Limiar que a geometria da fonte não atende pela regra de medida do projeto (reportado em `feedback-20261027-1928.md`, verdict FAIL SPEC)**

- `WHEELS_AND_TRACKS` (REQ-FEAT-0001-04; DES-0001 "Como as medidas de RULE-0001 saem do modelo montado"; DES-0006 `measureKart01Model`):
  extensão em Y da geometria mesclada de cada roda 0,2535 m e 0,273 m (arredondadas ao centímetro 0,25 e 0,27) contra 0,26 e 0,28
  esperados; o diâmetro nominal (2 × raio do perfil) é exatamente 0,26 e 0,28 e está em `wheels[nome].diameterM`. Tudo o mais medido
  passa (comprimento 1,9265 m, largura 1,45 m, entre-eixos 1,05 m, bitolas 1,00/1,14 m, quatro cores, 16 grupos, 27 chamadas,
  5 128 triângulos).

**Migração de verificações existentes**: nenhuma verificação foi removida ou alterada; `npx tsx --test tests/*.test.ts` 237/237;
`npx tsc --noEmit -p .` 0; `npx vite build` 0.

**Proposta ao autor** (de ADR-0002, Consequências): uma pista cuja visão geral exigir altura próxima de 300 m fica esbatida pela
névoa de `src/main.ts` (160–350 m); assunto da feature que trouxer essa pista.

## 2026-10-30 — rodada 3, Mode B (projeto revalidado com o seed `revision: 4`, `dspec-validation-20261030-1413`)

**O que mudou**

- `src/gameCamera.ts` (DES-0003 1.2.0, Retirada I3): saem `TURBO_FOV_DELTA_DEG`, `CameraFrameInputs.turboActive`,
  `CameraView.baseVerticalFovDeg` e `CameraView.turboFovDeltaDeg`; `baseVerticalFovDeg` passa a `shapeVerticalFovDeg` com o mesmo
  corpo; `computeCameraView` dá `verticalFovDeg = base` em `RACE_CHASE` (REQ-FEAT-0003-05 a -07, -17). `decideCameraMode` inalterado
  (REQ-FEAT-0003-16).
- `src/main.ts` (DES-0004 1.3.2, DES-0005 1.4.0): `computeCameraView` com as cinco entradas, sem `turboActive`; o jato (`exhaust`,
  `jet`, `anchors.exhaustOutlet.add`, `exhaust.visible`/`scale.z`) retirado (REQ-FEAT-0005-10); o bloco das marcas reescrito pela
  situação de marca de pneu (passo novo, `getLapState(lap).lapPhase === 'RUNNING'`, `getHandlingTelemetry` sem `code`,
  `speedMps > 6`, `sideslipRad > 0.055`; `previousSkids` em todo quadro com passo novo em `RUNNING`), sem `SKID_STEP_INTERVAL`, sem
  os filtros de distância e sem `tricks.drifting` (REQ-FEAT-0005-01, -07, -08, -09, -11, -12); `const tricks` e `const reducedMotion`
  retirados porque nenhum leitor sobrou.
- `src/kart01Model.ts` (DES-0001 1.2.0): `anchors` passa a `{ bumperPlate }`; o nó `escapamentoSaida` sai; nenhuma geometria muda.
- Não tocados: `src/physics.ts` (presets, `Input`), `src/lap.ts`, `src/track.ts`, `tests/`, `tests/fixtures/kart01-sim-baseline.json`
  (regravado com `arcade-assistido-v6` no commit `07b5cfa`).
- Registros: `web/DES-0001` 1.2.0, `web/DES-0003` 2.0.0, `web/DES-0004` 1.1.0, `web/DES-0005` 2.0.0, `98-divergences.md` 2.0.0 (linhas 11,
  17 e 18 `retired`, 16 reescrita, 22 a 27 resolvidas, 28 a 30 abertas para o estágio de testes), `01-implementation.md` 1.2.0.
- Portão: `npx tsc --noEmit -p .` 0; `npx vite build` 0; `npx tsx --test tests/*.test.ts` 423 testes, 410 aprovados, 13 reprovados
  (lista em `01-implementation.md`, rodada 3).

**Itens fechados**: linhas do projeto `98-divergences.md` 1.5.0 das rodadas 5, 6 e 7 (código: linhas 22 a 26 deste registro; linha
de base: linha 27, já fechada pelo estágio de testes).

**Itens recusados, com motivo**

- ISSUE-16 de `dspec-validation-20261030-1413` (warning, sugestão ao gerador do projeto: dar à decisão da situação de marca de pneu
  uma função pura testável em Node): não feito aqui. O projeto validado DES-0005 1.4.0 diz "nenhum módulo novo e nenhuma função nova"
  e põe a decisão no bloco das marcas de `src/main.ts`; a rodada 7 do projeto recusou a extração por superfície congelada; esta
  rodada é Mode B (conventions §16). Proposta para o `SCOPE-BACKLOG.md` do autor, como a rodada 7 do projeto já registrou: "função
  pura da situação de marca de pneu em `src/kartPose.ts` (modelo-kart-01)".
- Manter `const tricks` "só para o HUD da manobra" (DES-0004 1.3.2, linha de `:553`): não mantido; na árvore corrente nenhum HUD lê
  `tricks` e uma constante sem leitor não realiza nada (linha 24 de `98-divergences.md`).
- Manter um apelido `baseVerticalFovDeg` exportado para `tests/modelo-kart-01-camera.test.ts` carregar: recusado; API-0003 2.0.0 e
  DES-0003 (Retirada) exigem a ausência do nome em `src/gameCamera.ts`; a migração do teste é do estágio de testes (linha 28).
- Editar testes ou helpers (`tests/modelo-kart-01-*.test.ts`, `tests/helpers/kart01Report.ts`, que ainda passa `turboActive`):
  não feito; estágio de testes.
- Regravar a linha de base: não feito; já regravada com `arcade-assistido-v6` (`07b5cfa`).

## 2026-10-27 — rodada 2, Mode B (projeto corrigido em 1.3.0, `dspec-validation-20261027-1941`, após o FAIL SPEC `feedback-20261027-1928.md`)

**O que mudou**

- Nenhum arquivo de código: o projeto 1.3.0 (DES-0001 1.1.0, DES-0006 1.3.0, `test-strategy.md` 1.3.0) resolveu SPEC-ISSUE-01 mudando
  só a regra de medida — os diâmetros são a extensão em Z da caixa envolvente da geometria mesclada de cada roda no referencial local
  do nó `spin` (eixo de rolamento), ao centímetro, tolerância inalterada, sem mudança de geometria e sem campo novo — e o código de
  `b29278b` já realiza o projeto (`src/kart01Model.ts` `buildWheel`, `wheels[nome].spin`, `wheels[nome].diameterM` inalterados).
- Re-medição pela regra nova, por programa descartável em Node (`01-implementation.md`, rodada 2): extensão em Z no referencial do
  `spin` 0,26 m (dianteiras) e 0,28 m (traseiras), exatas; 27 malhas, 27 chamadas, 5 128 triângulos. Registrada em
  `01-implementation.md` (1.1.0), `web/DES-0001` (1.1.0, linha REQ-FEAT-0001-04) e `web/DES-0006` (1.1.0, linha das medidas).
- `98-divergences.md` (1.1.0): linha 21 (`WHEELS_AND_TRACKS`) passa de `open` a `resolved`, com a medida e o `arquivo:linha`.
- `scripts/_measure-kart01.ts`, programa descartável da rodada 1 que ficou fora do commit: apagado (nenhuma referência em
  `package.json`, `tests/` ou registro). `scripts/kart01-baseline.ts` mantido (`baseline:kart01`).
- Portão: `npx tsc --noEmit -p .` 0; `npx tsx --test tests/*.test.ts` 237/237; `lint_artifacts.py --stage code --emit` 0.

**Itens fechados**: SPEC-ISSUE-01 (`feedback-20261027-1928.md`), pela correção do projeto 1.3.0; `98-divergences.md` linha 21.

**Itens recusados, com motivo**

- Escrever `measureKart01Model` (`tests/helpers/kart01Report.ts`) com a regra nova: é arquivo do estágio de testes
  (`test-strategy.md`; a frase de DES-0006 "a rodada de código seguinte toca só a medida em `tests/helpers/kart01Report.ts`" nomeia
  o arquivo que aquele estágio escreve) e este estágio não escreve teste nem helper.
- Expor a medida no modelo (campo `measuredDiameterM` ou função de medição em `src/kart01Model.ts`): o projeto 1.3.0 diz "nenhum
  campo novo, nenhum símbolo novo"; a medida nasce no helper de testes.
- Mudar a geometria da roda ou `wheels[nome].diameterM`: o projeto diz que nada muda e a medida já dá 0,26/0,28.
- Nenhum limiar afrouxado, nenhum requisito enfraquecido, nenhuma dependência acrescentada, nenhum arquivo de `src/` tocado.
