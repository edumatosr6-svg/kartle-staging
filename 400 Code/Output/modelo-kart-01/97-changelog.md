---
title: Registro de mudanças — modelo Kart 01 e câmera de jogo (estágio de código)
feature: modelo-kart-01
stage: code
status: draft
version: 1.0.0
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
