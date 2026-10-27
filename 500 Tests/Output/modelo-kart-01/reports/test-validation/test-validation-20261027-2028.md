---
stage: test
feature: modelo-kart-01
verdict: SUCCESS
generated: 2026-10-27T20:33:51Z
run: {collected: 296, passed: 296, failed: 0, skipped: 0, fresh: true}
counts: {blocker: 0, error: 0, warning: 1, info: 6, divergence: 22}
checks: {before: 0, after: 59, migrated: 0, removed: 0}
seed: {revision: 1, digest: ef2fe14c9440}
round: 1
run-artifacts: {junit: reports/junit-latest.xml, log: reports/npm-test-latest.log, measured: 2026-10-27T17:20:40-03:00, last-input-edit: tests/modelo-kart-01-contract.test.ts 2026-10-27T17:20:12-03:00, last-src-edit: src/main.ts 2026-10-27T16:26:45-03:00}
population: [TEST-0001, TEST-0002, TEST-0003, TEST-0004, 97-changelog.md, 98-divergences.md, tests/modelo-kart-01-*.test.ts, tests/helpers/kart01Report.ts, tests/fixtures/kart01-sim-baseline.json]
feedbacks: []
---

# Relatório de validação de testes — modelo-kart-01, rodada 1

## Verification status

- critérios: 47 (AC-US-0001-01..16, AC-US-0002-01..06, AC-US-0003-01..13, AC-US-0004-01..02, AC-US-0005-01..03, NFR-0001..0007)
- verificados em `npm test`: 25 — AC-US-0001-01..13, AC-US-0002-02, AC-US-0003-01..07, NFR-0003, NFR-0004, NFR-0005, NFR-0007
- verificados na metade automatizável e `unverified` na metade de tela, aparelho ou repositório: 18 — AC-US-0001-14, -15, -16; AC-US-0002-01, -03, -04, -05, -06; AC-US-0003-08, -09, -10, -11, -12, -13; AC-US-0005-01, -02, -03; NFR-0006 (linha 1, 0 linhas alteradas: manifesto de código) — DIV-01 a DIV-18
- sem verificação em `npm test`, decididos só no aparelho nomeado (I9, E2E-06): 4 — AC-US-0004-01, AC-US-0004-02, NFR-0001, NFR-0002 — DIV-19 a DIV-22
- cobertos só por um skip: 0
- verificações desta feature: 59 declaradas em TEST-0001..0004 (19 + 10 + 14 + 16), 59 presentes e executadas em `junit-latest.xml` nos quatro arquivos `tests/modelo-kart-01-*.test.ts` (0 ausentes, 0 duplicadas por arquivo); 237 de `physics`, `maneuvers`, `race-lap-validation-*` e `dirigibilidade-*` na mesma execução, todas aprovadas (NFR-0006); `ℹ tests 296 · pass 296 · fail 0 · skipped 0`
- frescor: artefatos de 17:20:40 posteriores à última edição de `tests/` (17:20:12) e de `src/` (16:26:45); nenhuma reexecução necessária; histórico de uma execução, sem flake
- níveis: unitário, integração e contrato executados em `npm test` para FEAT-0001..0006 como a estratégia 1.3.0 distribui; web E2E e mobile E2E são roteiro registrado (E2E-01..06) sem ferramenta no projeto, não executados nos aparelhos de referência (`docs/kart-01/device-log.md`, execução 1 parcial e sem taxa de quadros) — registrados como divergências, não como nível omitido em silêncio
- medidas lidas do modelo montado, não de constantes do teste: `measureKart01Model` mede a caixa dos 15 grupos, os centros `steer`, a extensão em Z da geometria mesclada no referencial do nó `spin`, os triângulos e os materiais por malha; `judgeModelCheck` aplica a tabela de RULE-0001 sobre essas medidas; as medidas sintéticas (`nominal()`) só alimentam as verificações de veredito (-02, -04, -06, -08, -10)
- tolerâncias conferidas contra as histórias e RULE-0001: 1,93/1,45/1,05 m ± 0,02 (`withinTolerance`, borda 1,95 m PASS, 1,96 m FAIL); rodas 0,26/0,28 m e bitolas 1,00/1,14 m ao centímetro (`toCm`, 0,264/0,256 PASS, 0,266 FAIL); 30 chamadas e 5 128 triângulos; `#FF6A13`, `#2B2E34`, `#F4F3EF`, `#2F55D4`; câmera 1,38/3,05/3,2/0,30 m, 62°, ≥ 60° horizontal em retrato, +4° de turbo (constantes de `src/gameCamera.ts:44-56` lidas pela saída de `computeCameraView`, não pelo teste); 1,04/1,20 m e `STEP` 1/120 contra a linha de base
- contrato de simulação (REQ-FEAT-0006-06..08, NFR-0005..0007): `LAYERING` lê os seis arquivos da simulação por `node:fs` e conta importações dos quatro módulos novos; `RENDER_NEUTRAL` reproduz os 3 531 `Input` gravados duas vezes, uma só com `stepLap` e outra chamando por passo `getKartPose`, `advanceWheelSpin`, `simWheelGroundPositions`, `computeCameraView` e `updateKart01Pose` sobre o `kart` da sessão, e compara a `LapSession` chave a chave; `DETERMINISM` reproduz as duas execuções de referência (8 803 passos) e compara validade, `lapMs`, `sectorMs` e `finalKart` com o gravado; `SIM_CONTRACT` compara `STEP`, a linha do tipo `Input` e as medidas com a linha de base e sonda as faixas por saturação (pares iguais/diferentes, limite a 0,01); `WHEEL_POSITIONS` compara os 16 valores; `TELEMETRY_WHEEL_POSITIONS` compara `simWheelGroundPositions` com a fórmula direta de `wheelPositions` em 3 767 passos — cada um exercita a simulação real, não um dublê
- tautologias: as 59 verificações lidas contra a coluna "o que a faria falhar"; em cada uma há mudança no código que a reprova (sub-afirmações tautológicas isoladas em ISSUE-03 e ISSUE-05); as 7 mutações do changelog (A..G) cobrem 13 ids distintos e os ids que cada uma cita são os que as afirmações reprovariam (B: só -01 e -12 afirmam 1,38 m; -13 compara com `raceChasePose` e não cai)
- relógio, rede, ordem: nenhum `Date`, `performance`, `Math.random`, `setTimeout` nos quatro arquivos nem no helper (`recordedAtUtc` do fixture é dado, não lido); todo tempo é `toMs(passos)`; cada arquivo monta as próprias sessões; o `model` partilhado por arquivo é lido e as verificações que o alteram (-06, -14, -15, -16, -18) montam um novo; nenhum dado real de jogador (D-TS-06); nenhuma superfície só de teste em `src/` (os auxiliares vivem em `tests/helpers/`)
- idempotência, RBAC, migração, mobile offline (T5): não aplicáveis — API-0001..0003 sem endpoint, sessão, papel, webhook, banco ou árvore mobile; declinados com motivo em `97-changelog.md`; a idempotência de API-0002 está em CHK-TEST-0004-16
- atrito de verificações: nenhum relatório anterior; `before: 0, after: 59`; nada migrado, nada removido; os 65 ids da `dirigibilidade` e os 140 da `race-lap-validation` continuam na mesma execução

## Failures

Nenhuma.

## Issues

### ISSUE-01
- severity: warning
- check: T3
- where: `tests/modelo-kart-01-contract.test.ts` CHK-TEST-0004-01..06 (AC-US-0001-14, -15, -16, AC-US-0005-01, -02, -03)
- defect: as expressões regulares fixam o texto de `src/main.ts` e `src/kart01Decals.ts` (`simWheelGroundPositions(pose, lap.config).slice(2)`, `exhaust.visible = tricks.boost > 0`, a condição de marca com `0.055`, `paintKart01Decals(kart01)`, `shadow.camera … left: -60`, `castShadow = true` em qualquer malha): um refactor que preserva o comportamento reprova a verificação e a presença do texto não prova que o ramo executa (I9).
- expected: manter as afirmações estáveis (ausência de `skidClock`, de `CylinderGeometry(0.31`, `SphereGeometry(0.36`, `helmet` e `box(kart`; presença das importações e de `buildKart01Model()`) e afrouxar as que fixam nomes e forma; a metade de comportamento continua decidida por E2E-02 e E2E-05 como a estratégia 1.3.0 (nível C, DES-0004, DES-0005) e `98-divergences.md` registram; não bloqueia.

### ISSUE-02
- severity: info
- check: T3
- where: `tests/modelo-kart-01-model.test.ts` CHK-TEST-0001-09 (NFR-0004)
- defect: além de `drawCallCount ≤ 30` e `triangleCount === 5128`, afirma `meshCount === 27` e `drawCallCount === 27`; um reagrupamento futuro para 28 chamadas, dentro do orçamento, reprova a verificação.
- expected: 27 é o valor que a estratégia 1.3.0 nomeia ("`meshCount` 27, `drawCallCount ≤ 30` (27)"), logo é valor especificado e não computado pela implementação (D-TS-03); manter; se o orçamento for a única regra, a estratégia retira o 27 primeiro.

### ISSUE-03
- severity: info
- check: T3
- where: `tests/modelo-kart-01-model.test.ts` CHK-TEST-0001-17, terceira afirmação (AC-US-0002-05)
- defect: `steer.position.y === diameterM / 2` compara duas leituras da mesma constante `raio` de `src/kart01Model.ts:417-426`; sozinha não reprovaria uma roda deslocada.
- expected: as duas afirmações medidas da mesma verificação (`toCm(min.y) === 0`, `min.y ≥ 0`) decidem o critério: um nó `steer` 1 cm mais alto dá `min.y` 0,0133 m e reprova; nada a mudar.

### ISSUE-04
- severity: info
- check: T4
- where: `tests/modelo-kart-01-model.test.ts` CHK-TEST-0001-17 (AC-US-0002-05); `98-divergences.md`, "Interpretação registrada da estratégia"
- defect: a frase da estratégia 1.3.0 "a caixa envolvente das quatro rodas tem `min.y` 0 (rodas no chão)" é lida ao centímetro (RULE-0001): `min.y` medido 0,0033 m, porque o pneu é um `LatheGeometry` de 14 segmentos sem vértice em −Y (DES-0001 1.1.0, geometria do Cowork mantida por decisão de projeto; ISSUE-03 info de `code-validation-20261027-1951`).
- expected: interpretação confirmada — AC-US-0002-05 decide posição, não contato; RULE-0001 dá toda medida de roda ao centímetro; a verificação afirma `min.y ≥ 0`, `toCm(min.y) === 0` e o centro a um raio do chão, e imprime o valor bruto; não é defeito de código nem tolerância nova; se o D-Spec quiser `min.y === 0` exato, deve dizê-lo junto com um perfil de pneu com vértice em −Y (DES-0001), pelo dspec-loop; nenhum feedback devido por este estágio.

### ISSUE-05
- severity: info
- check: T3
- where: `tests/modelo-kart-01-camera.test.ts` CHK-TEST-0003-08 (AC-US-0003-08)
- defect: a câmera de corrida é rígida em relação ao kart (`raceChasePose` e `modelToWorld` são funções só de `xM`, `zM`, `headingRad`), logo a projeção do kart é a mesma em todos os 245 quadros da curva e em qualquer velocidade; o laço por quadro repete uma única configuração relativa, e "a 50 km/h" é satisfeito por construção (a velocidade varia entre 44 e 58 km/h durante a curva, `97-changelog.md`).
- expected: a verificação pode falhar (câmera mais perto, mais baixa ou campo menor: pior canto em |NDC| 0,68) e decide o critério nas duas formas; a ausência de suavização que a curva provaria já é decidida por CHK-TEST-0003-07 (1e-12); nada a mudar.

### ISSUE-06
- severity: info
- check: T3
- where: `tests/modelo-kart-01-pose.test.ts` CHK-TEST-0002-02, CHK-TEST-0002-03 (AC-US-0002-02); `tests/helpers/kart01Report.ts:245`
- defect: igualdade estrita de ponto flutuante (`spinRevs === expectedSpinRevs`; dois quadros de 60 passos iguais a um de 120) em vez de tolerância.
- expected: mantida — API-0002 e a estratégia 1.3.0 exigem igualdade; a igualdade vale por construção (giro aplicado num quadro de 120 passos, `60 × STEP` = 0,5 exato, soma de dois quocientes iguais = quociente do dobro) e é determinística (I8), não flake; uma verificação futura com quadros desiguais (por exemplo 50 + 70) deve comparar a 1e-12.

### ISSUE-07
- severity: info
- check: T1
- where: `reports/junit-latest.xml`; `97-changelog.md`, "Migração de verificações existentes"
- defect: os ids `CHK-TEST-00nn-nn` repetem-se entre features na mesma execução (`CHK-TEST-0001-01` aparece em `dirigibilidade-steer-response`, `race-lap-validation-timing` e `modelo-kart-01-model`); a contagem por id sem o atributo `file` do junit mistura features.
- expected: a comparação de atrito desta feature é feita por arquivo (`tests/modelo-kart-01-*.test.ts`: 19 + 10 + 14 + 16 = 59); a próxima rodada compara os ids por arquivo, não pelo total do junit.

## Divergences

Critérios cuja metade de tela, aparelho ou repositório é decidida fora de `npm test`, por decisão da estratégia 1.3.0 (níveis web E2E e mobile E2E como roteiro registrado E2E-01..06, sem ferramenta de E2E e sem dependência nova; DM-0001) e do manifesto de código (NFR-0006 linha 1). A metade automatizável está provada pelas verificações citadas; nenhuma linha contribui para o veredito (conventions §6); todas em `98-divergences.md` como `unverified`, devidas ao registro humano em `docs/kart-01/device-log.md`.

### DIV-01
- criterion: AC-US-0001-14
- proved: CHK-TEST-0004-01, CHK-TEST-0001-11
- unverified: Kart 01 em todo quadro na tela, após recarga e troca de orientação — E2E-01
- owed by: registro humano

### DIV-02
- criterion: AC-US-0001-15
- proved: CHK-TEST-0001-12, CHK-TEST-0004-02
- unverified: sombra vista no chão pela câmera de corrida — E2E-02
- owed by: registro humano

### DIV-03
- criterion: AC-US-0001-16
- proved: CHK-TEST-0001-13, CHK-TEST-0004-03
- unverified: número 01 legível na tela — E2E-02
- owed by: registro humano

### DIV-04
- criterion: AC-US-0002-01
- proved: CHK-TEST-0001-14, CHK-TEST-0002-01
- unverified: rodas dianteiras giradas vistas na tela — E2E-03
- owed by: registro humano

### DIV-05
- criterion: AC-US-0002-03
- proved: CHK-TEST-0001-15
- unverified: volante na tela — E2E-03
- owed by: registro humano

### DIV-06
- criterion: AC-US-0002-04
- proved: CHK-TEST-0001-16
- unverified: mãos no aro na tela — E2E-03
- owed by: registro humano

### DIV-07
- criterion: AC-US-0002-05
- proved: CHK-TEST-0001-17, CHK-TEST-0002-04, -05, -06, -07
- unverified: posição na tela, pausa (Esc, aba, sensor) e reposicionamento sem deslizamento — E2E-03
- owed by: registro humano

### DIV-08
- criterion: AC-US-0002-06
- proved: CHK-TEST-0001-18, CHK-TEST-0002-07, -08
- unverified: rumo na tela — E2E-03
- owed by: registro humano

### DIV-09
- criterion: AC-US-0003-08
- proved: CHK-TEST-0003-08
- unverified: curva vista na tela em paisagem e retrato — E2E-04
- owed by: registro humano

### DIV-10
- criterion: AC-US-0003-09
- proved: CHK-TEST-0003-09
- unverified: campo de visão abrindo e voltando na tela; troca de orientação com turbo — E2E-04
- owed by: registro humano

### DIV-11
- criterion: AC-US-0003-10
- proved: CHK-TEST-0003-10, CHK-TEST-0003-14
- unverified: pista inteira vista na tela; giro do celular na visão geral — E2E-01
- owed by: registro humano

### DIV-12
- criterion: AC-US-0003-11
- proved: CHK-TEST-0003-11
- unverified: descida observada na tela; pausa e suspensão na contagem — E2E-01
- owed by: registro humano

### DIV-13
- criterion: AC-US-0003-12
- proved: CHK-TEST-0003-12
- unverified: pose de corrida no quadro do verde, na tela — E2E-01
- owed by: registro humano

### DIV-14
- criterion: AC-US-0003-13
- proved: CHK-TEST-0003-01, -02, -03, -13, -14
- unverified: painel de resultado sobre a cena sem movê-la; "nova volta" — E2E-02
- owed by: registro humano

### DIV-15
- criterion: AC-US-0005-01
- proved: CHK-TEST-0002-09, -10, CHK-TEST-0004-04
- unverified: marca vista sob o pneu exibido (diferença de 3 cm de DOMAIN/DEC-02 decidida na tela); trechos antigos parados; nenhum trecho na pausa — E2E-05
- owed by: registro humano

### DIV-16
- criterion: AC-US-0005-02
- proved: CHK-TEST-0001-19, CHK-TEST-0004-05
- unverified: fumaça vista na ponteira — E2E-05
- owed by: registro humano

### DIV-17
- criterion: AC-US-0005-03
- proved: CHK-TEST-0004-06
- unverified: indicação de drift junto às rodas traseiras na tela — E2E-05
- owed by: registro humano

### DIV-18
- criterion: NFR-0006 (linha 1)
- proved: CHK-TEST-0004-11, CHK-TEST-0004-13 (contrato de passo e determinismo contra a linha de base de `b86b200`)
- unverified: 0 linhas alteradas em `src/physics.ts`, `src/lap.ts`, `src/track.ts` e nos presets — diferença do repositório registrada pelo manifesto de código (D-CD-01) e conferida pelo validador de código; `npm test` não executa `git`
- owed by: revisão de código

### DIV-19
- criterion: AC-US-0004-01
- proved: nenhuma verificação de `npm test` decide taxa de quadros (I9); custo limitado por CHK-TEST-0001-09
- unverified: ≥ 60 fps sustentados numa volta no notebook de referência — E2E-06
- owed by: registro humano (`docs/kart-01/device-log.md`, execução 1 marca "não medido")

### DIV-20
- criterion: AC-US-0004-02
- proved: idem
- unverified: ≥ 30 fps no celular intermediário, paisagem e retrato; nenhuma execução em desktop vale — E2E-06
- owed by: registro humano

### DIV-21
- criterion: NFR-0001
- proved: nenhuma (I9)
- unverified: `fpsPerSecond` e `minFps` por aparelho e orientação — E2E-06
- owed by: registro humano

### DIV-22
- criterion: NFR-0002
- proved: nenhuma em `npm test`; build desta rodada 642 759 bytes sem compressão, 168 277 gzip (`01-implementation.md` do código)
- unverified: < 3 MB comprimidos pela lista de transferências de rede numa primeira visita com cache vazio — E2E-06
- owed by: registro humano
