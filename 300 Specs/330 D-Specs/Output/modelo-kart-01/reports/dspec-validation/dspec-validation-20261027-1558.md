---
stage: dspec
feature: modelo-kart-01
verdict: FAIL
generated: 2026-10-27T15:58:48Z
counts: {blocker: 0, error: 1, warning: 2, info: 0, divergence: 21}
seed: {revision: 1, digest: ef2fe14c9440}
upstream: {stage: fspec, version: 1.2.0}
feedbacks: []
population: "re-validação (conventions §8): ISSUE-01 a ISSUE-09 de dspec-validation-20261027-1538 re-verificadas primeiro; arquivos com `version:` movida desde aquele relatório (1.0.0 → 1.1.0): 01-architecture.md, 97-changelog.md, 98-divergences.md, test-strategy.md, adr/ADR-0002, data/DM-0001, web/DES-0003, web/DES-0004, web/DES-0006; dois arquivos intocados sorteados ao acaso (random.sample sobre os 7 em 1.0.0): web/DES-0001, security/DES-0007; D1 mecânico sobre os 16 arquivos do índice; F-Spec 1.2.0 (`status: validated` em todos os arquivos; fspec-validation-20261027-1520) lido para D3; árvore na raiz do repositório lida só para fatos de posicionamento: HEAD 842943a com src/lap.ts, src/main.ts e src/setupRecords.ts modificados na árvore de trabalho (16 linhas), por isso as linhas citadas foram conferidas contra `git show 0068a57`, a revisão que o conjunto declara como âncora; nenhuma rodada de gerador nesta execução depois do gate (reports/token-usage/dspec-loop-phases-20261027-1532.csv)"
context-ignored: "nenhuma justificativa chegou com a invocação; 01-architecture.md (\"recebidas com a invocação\") e 97-changelog.md rodada 2 (\"o autor passou a decisão a esta execução com a ordem de retirar toda frase de pilotagem\") registram ordens e justificativas do gerador e do autor — chegaram pelos próprios artefatos e não foram usadas como fundamento: cada verificação foi julgada só contra o F-Spec validado 1.2.0, 330 D-Specs/Input/domain-directives.md, 100 Admin/120 Processes/domain-invariants.md e a árvore"
---

# Relatório de validação do D-Spec — modelo-kart-01

## Summary

- veredito: FAIL
- contagens: 0 blocker, 1 error, 2 warning, 0 info, 21 divergence
- ISSUE-01 (D1, ligações) de 1538: fechada — 79 ligações relativas no conjunto, 0 quebradas; as duas de `01-architecture.md` a FLOW-0002 e FLOW-0003 resolvem
- ISSUE-02 (D2, corpos de implementação em DES-0004) de 1538: fechada — a tabela Interface traz só o que é lido, de que campo, em que ordem e com que condição; nenhuma instrução TypeScript
- ISSUE-03 (D3, `getCameraView`) de 1538: fechada — a linha `computeCameraView(inputs)` de DES-0003 declara realizar a operação `getCameraView` de API-0003, com a razão do nome; o mesmo em `01-architecture.md`
- ISSUE-04 (D3, `kartModelReport`) de 1538: fechada — DES-0006 declara `kartModelReport` como o nome do conjunto de registros e diz qual dos três arquivos de teste emite cada um dos 12 `checkId`
- ISSUE-05 (D3, `inputContractUnchanged`) de 1538: fechada quanto ao que nomeava (a linha do tipo carrega só os campos) — o mecanismo agora cobre faixas pela saturação de `step`; o resíduo do mecanismo está em ISSUE-12
- ISSUE-06 (D8, FEAT-0004 por nível) de 1538: fechada — a linha FEAT-0004 lê "sim" em Unitário e em Integração, coerente com as tabelas "Níveis" e NFR-0004
- ISSUE-07 e ISSUE-08 (info) de 1538: re-verificadas, inalteradas, respondidas em `97-changelog.md` rodada 2 ("nenhuma mudança", com a razão); encerradas sem mudança, não reabertas
- ISSUE-09 (D3/D9, contradição com o upstream 1.2.0) de 1538: fechada — `01-architecture.md` e `98-divergences.md` citam o F-Spec 1.2.0 (`fspec-validation-20261027-1520`); a frase "o kart continua pilotável" só sobrevive em `97-changelog.md` como histórico da rodada 1, marcada superada; o parágrafo final de `98-divergences.md`, ADR-0002 (Consequências), DES-0003, DES-0004 e `test-strategy.md` dizem o que FEAT-0003, RULE-0002, FLOW-0001, `02-glossary.md` e `01-overview.md` de 1.2.0 dizem: simulação parada e kart congelado em `ENDED` (INV-1), só a câmera na pose de corrida
- ISSUE-10 (error, nova, D2 / conventions §6): DES-0004 declara `:224-235` inalterados; DES-0005 retira `skidClock`, que `:231` (dentro de `beginLap`) zera; `test-strategy.md` afirma `src/main.ts` sem `skidClock`
- ISSUE-11 (warning, nova, D2 posicionamento / I10): o trecho `:113-134` "retirado por inteiro" de DES-0004 engloba `:121-122`, `let setup` da `dirigibilidade`, usado em `:158`, `:160`, `:220`, `:228`, `:251-253`
- ISSUE-12 (warning, nova, D3): a sonda de saturação de `simContractCheck` prende cada limite de `Input` só ao intervalo (0,5; 1] ou [0; 0,5); a afirmação "um limite movido dá `false`" não vale para um limite movido dentro desse intervalo
- feedback enviado: nenhum
- entrada humana: nenhuma; as três correções derivam dos próprios itens e da árvore em `0068a57`
- `status:` não alterado (veredito FAIL)

## Issues

### ISSUE-10

- severidade: error
- verificação: D2, qualidade do item de projeto — a tabela Interface declara um trecho inalterado que outro item do conjunto exige alterado (conventions §6: o artefato contradiz a si mesmo é `error`, nunca divergência)
- arquivo: `web/DES-0004-integracao-da-cena-em-main-ts.md`; `web/DES-0005-efeitos-presos-ao-kart.md`; `test-strategy.md`
- localização: DES-0004, tabela Interface, linha "`:224-235` `beginLap`, `:191-194` `emitReposition`, `:270` `#lap-new-lap` | inalterados"; DES-0005, tabela de mudanças, linha "`:141` ... `skidClock` sai"; `test-strategy.md`, linha AC-US-0005-01, "`contract` (C): `src/main.ts` não contém `skidClock`"
- achado: em `src/main.ts` do commit `0068a57`, `skidClock` é usado em `:141`, `:231`, `:448-450` e `:472`; DES-0005 retira o símbolo e cobre `:141`, `:447-449` e `:472`, mas não `:231` (`skidMarks.count = 0; skidIndex = 0; previousSkids = []; skidClock = 0;`, dentro de `beginLap`); DES-0004 declara `:224-235` inalterados; `test-strategy.md` afirma que `src/main.ts` não contém mais `skidClock`. Seguido à letra, o conjunto deixa uma atribuição a um símbolo retirado (não compila) ou deixa `skidClock` em `beginLap` (reprova o teste de contrato) — os três lugares não dizem a mesma coisa.
- esperado: DES-0004 diz que `:231` perde `skidClock = 0` (e, se o projeto o quiser, que `lastSkidStepCount` é zerado ali ou que o reinício pelo contador de DES-0005 basta) e que `:224-235` ficam inalterados no resto; DES-0005 ganha a linha `:231` na sua tabela de mudanças, para que a retirada do símbolo esteja completa num só item; `version:` dos arquivos editados movida.

### ISSUE-11

- severidade: warning
- verificação: D2, posicionamento conferido na árvore (uma afirmação de posicionamento é verificada, nunca presumida); D5, I10 — uma remoção que o F-Spec não pede
- arquivo: `web/DES-0004-integracao-da-cena-em-main-ts.md`
- localização: tabela Interface, linha "`:113-134` kart provisório (`kart`, `box(...)`, `helmet`, `wheels`, cilindros de raio 0,31) | **retirado por inteiro**"
- achado: em `0068a57`, o kart provisório ocupa `:113-120` e `:123-134`; `:121-122` são o comentário e `let setup: PublishedSetup = PUBLISHED_SETUPS.ARCADE_ASSISTIDO;` da `dirigibilidade`, usado em `:158` (`config`), `:160` (`setupRef`), `:220` (`compareLapRecords`), `:228` (`beginLap`) e `:251-253` (troca de preset). A lista de símbolos da linha exclui `setup`, mas o intervalo e o "por inteiro" o incluem; o F-Spec não pede essa remoção (REQ-FEAT-0006-06 proíbe tocar os presets e a `dirigibilidade` é dona do símbolo).
- esperado: a linha cita `:113-120` e `:123-134` (ou diz que `:121-122`, `let setup`, ficam), de modo que a retirada seja só dos símbolos listados; `version:` movida.

### ISSUE-12

- severidade: warning
- verificação: D3, forma do contrato campo a campo (semântica do campo `inputContractUnchanged` de API-0002: "mesmo conjunto de campos e mesmas faixas de `Input`"); NFR-0006 com o mecanismo que atinge o limiar (resíduo de ISSUE-05 de 1538, que está fechada quanto ao que nomeava)
- arquivo: `web/DES-0006-verificacoes-de-npm-test-e-relatorio-do-modelo.md`
- localização: tabela Interface de `tests/helpers/kart01Report.ts`, linha `simContractCheck(baseline)`, trecho "as faixas pela saturação de `step` ... (`throttle` 2 ≡ 1 e −1 ≡ 0; `brake` 2 ≡ 1 e −1 ≡ 0; `steer` 3 ≡ 1 e −3 ≡ −1 ...), e o limite dá um `State` diferente de um valor dentro da faixa (`throttle` 1 ≢ 0,5; `brake` 1 ≢ 0,5; `steer` 1 ≢ 0,5) ... um limite movido, ou um campo acrescentado ou retirado, dá `false`"
- achado: os pares além/no limite e limite/dentro prendem cada limite superior ao intervalo (0,5; 1] e cada inferior a [0; 0,5): com `clamp(input.throttle, 0, 0.8)` em `src/physics.ts:212`, `2 ≡ 1` continua verdadeiro (os dois saturam em 0,8) e `1 ≢ 0,5` continua verdadeiro (0,8 ≠ 0,5), logo `inputContractUnchanged` lê `true` com a faixa alterada; a frase "um limite movido ... dá `false`" não vale para um limite movido dentro desses intervalos. A diferença de 0 linhas em `src/physics.ts` (REQ-FEAT-0006-06, manifesto da etapa de código) cobre o caso na prática, mas a linha não a invoca para este booleano.
- esperado: a linha acrescenta um par interno junto ao limite (`throttle` 0,99 ≢ 1, `brake` 0,99 ≢ 1, `steer` 0,99 ≢ 1 e −0,99 ≢ −1, `throttle`/`brake` 0,01 ≢ 0), que prende cada limite ao seu valor dentro de 0,01, e reescreve a afirmação como "um limite movido de mais de 0,01 dá `false`"; ou a linha declara que o booleano prende os limites a (0,5; 1] / [0; 0,5) e que o valor exato é coberto pela diferença de 0 linhas em `src/physics.ts` registrada pela etapa de código — uma das duas, dita no item; a linha NFR-0006 de `test-strategy.md` e a linha `inputTypeLine` de DM-0001 acompanham; `version:` movida.

## Divergences

- REQ-FEAT-0001-01, -02 a -14, -17 — kart provisório de caixas em `src/main.ts:113-134` — fecha: DES-0001, DES-0004, DES-0006, ADR-0001 — open
- REQ-FEAT-0001-15 — sem placa nem número (`src/main.ts:113-120`) — fecha: DES-0001, DES-0004 — open
- REQ-FEAT-0001-16 — sombra em caixa fixa ±120/±100 m na origem (`src/main.ts:36`; `box()` em `:74`, rodas em `:130`) — fecha: DES-0004 — open
- REQ-FEAT-0002-01 — esterço por roda da telemetria (`src/main.ts:474`); `getKartPose` não existe — fecha: DES-0002, DES-0004 — open
- REQ-FEAT-0002-02 — giro por relógio de parede e raio 0,31 (`src/main.ts:476`); sem `WHEEL_SPIN` — fecha: DES-0002, DES-0004, DES-0006 — open
- REQ-FEAT-0002-03, -04, -10 — sem volante, braços nem piloto articulado (`src/main.ts:117-119`) — fecha: DES-0001, DES-0004, ADR-0001 — open
- REQ-FEAT-0002-05 — sem ponto de referência (`src/main.ts:442`) — fecha: DES-0002, DES-0004 — open
- REQ-FEAT-0003-01, -02, -03, -08, -13 — perseguição alta suavizada (`src/main.ts:478-482`) — fecha: DES-0003, DES-0004, ADR-0002 — open
- REQ-FEAT-0003-04, -05, -06, -07, -15 — campo de visão 48° + termo de velocidade (`src/main.ts:19`, `:483`, `:485`, `:391-394`) — fecha: DES-0003, DES-0004, ADR-0002 — open
- REQ-FEAT-0003-09 — sem prova do kart inteiro no quadro — fecha: DES-0003 — open
- REQ-FEAT-0003-10 — turbo somado a 48° com termo de velocidade e suavização (`src/main.ts:483`, `:485`) — fecha: DES-0003, DES-0004, ADR-0002 — open
- REQ-FEAT-0003-11 — câmera inicial fixa (`src/main.ts:395-396`, `:478`) — fecha: DES-0003, DES-0004 — open
- REQ-FEAT-0003-12, -14 — sem descida (`src/main.ts:229`) — fecha: DES-0003, DES-0004, ADR-0002 — open
- REQ-FEAT-0004-03, -04 — Kart 01 não montado; sem `DRAW_COST` — fecha: DES-0001, DES-0006, ADR-0001 — open
- REQ-FEAT-0004-01, -02, -05 — `docs/kart-01/device-log.md` não existe — fecha: DES-0004, DM-0001 — open
- REQ-FEAT-0005-01, -07, -08 — cadência de marcas por relógio de parede (`src/main.ts:448-449`, `:451-455`, `:472`) — fecha: DES-0005 — open
- REQ-FEAT-0005-02 — dois jatos presos ao kart de caixas (`src/main.ts:143-151`) — fecha: DES-0005 — open
- REQ-FEAT-0005-03 — marcas sob as rodas de caixas (`src/main.ts:447`) — fecha: DES-0005 — open
- REQ-FEAT-0005-05, -06 — sem `WHEEL_POSITIONS`, `TELEMETRY_WHEEL_POSITIONS` nem linha de base — fecha: DES-0006, DM-0001, ADR-0004 — open
- REQ-FEAT-0006-04, -05 — `tests/race-lap-validation-layering.test.ts` não conhece os módulos novos; sem `RENDER_NEUTRAL` — fecha: DES-0006 — open
- REQ-FEAT-0006-07, -08 — sem `SIM_CONTRACT`, `DETERMINISM` nem linha de base anterior à feature — fecha: DES-0006, DM-0001, ADR-0004 — open

## Coverage

- requisitos: 63 `REQ-*` do F-Spec 1.2.0 (FEAT-0001: 17; FEAT-0002: 10; FEAT-0003: 15; FEAT-0004: 5; FEAT-0005: 8; FEAT-0006: 8; contados nos arquivos `features/`), 63 referenciados em `99-traceability.md` (208 linhas, geradas pelo gate em 2026-10-27T15:58:38Z), 0 descobertos
- NFRs: nenhum adiado pelo F-Spec a este estágio; NFR-0001 a NFR-0007 projetados com mecanismo e métrica do limiar perdido (`minFps`; bytes comprimidos; lista de dependências; `drawCallCount`/`triangleCount`; `forbiddenImportCount`/`differingFieldCount`; três booleanos e `differingRunCount`, com a ressalva de ISSUE-12; `differingValueCount`)
- contratos: API-0001 → DES-0002 (`KartPose` e `NO_STATE`, campo a campo); API-0002 → DES-0006 (12 `checkId`, cada um em exatamente um arquivo de teste nomeado; campos por registro e `checkFailReason` na ordem de RULE-0001; `kartModelReport` declarado como o conjunto de registros; semântica de `inputContractUnchanged` em ISSUE-12); API-0003 → DES-0003 (`CameraView` campo a campo, campos condicionais ausentes e não zerados, `NO_SCENE`; `computeCameraView` declarada como realização de `getCameraView`; `ENDED` → `RACE_CHASE`, simulação parada, conforme 1.2.0)
- itens de projeto sem fonte: nenhum (`99-traceability.md`: "Items with no upstream source: None"); contradição com o upstream: nenhuma (ISSUE-09 fechada); contradição interna: ISSUE-10
- critérios: 40 `AC-*` (AC-US-0001-01 a 16, AC-US-0002-01 a 06, AC-US-0003-01 a 13, AC-US-0004-01 a 02, AC-US-0005-01 a 03) com caminho de teste declarado em `test-strategy.md`; 0 inalcançáveis; 0 alcançados por configuração, ponto de entrada ou gancho só de teste; AC-US-0004-01 e -02 só por teste registrado no aparelho nomeado (I9); 360 passos da contagem = `COUNTDOWN_STEPS` (`src/lapTiming.ts:5-6`); `src/lap.ts:98` (`LAP_ALREADY_ACTIVE` só fora de `ENDED`) e `:153` (`ENDED` por `REPOSITION`) conferidos
- caminhos de módulo (varredura do conjunto): 26 citados como existentes, todos presentes na árvore (inclusive `100 Admin/120 Processes/domain-invariants.md` e o feedback histórico em `race-lap-validation/reports/feedbacks/modelo-kart-01/`); 12 declarados **novos**, todos ausentes (`src/kart01Model.ts`, `src/kart01Decals.ts`, `src/kartPose.ts`, `src/gameCamera.ts`, `tests/helpers/kart01Report.ts`, 4 `tests/modelo-kart-01-*.test.ts`, `scripts/kart01-baseline.ts`, `tests/fixtures/kart01-sim-baseline.json`, `docs/kart-01/device-log.md`); script `baseline:kart01` ausente de `package.json` (declarado novo); 0 nem existentes nem declarados novos
- fatos de posicionamento dos arquivos movidos conferidos contra `git show 0068a57` (540 linhas em `src/main.ts`): `:18` `Fog` 160–350; `:19` `PerspectiveCamera(48, 1, 0.1, 500)`; `:21-26` WebGL; `:27` `setPixelRatio`; `:32-38` `sun` e caixa ±120/±100; `:66` `WIDTH / 2 + 1`; `:113-134` kart de caixas com `:121-122` `let setup` (ISSUE-11); `:136-142` marcas; `:143-151` jatos; `:156` `idleKart`; `:161-164` leitura da pista; `:165`, `:229`, `:478`, `:518` `started`; `:191-194` `emitReposition`; `:203-206`; `:221`, `:434` `console.warn('lap-record')`; `:224-235` `beginLap` com `:231` `skidClock = 0` (ISSUE-10); `:270` `#lap-new-lap`; `:391-397` `ResizeObserver`, câmera fixa e `cameraTarget`; `:402-403`; `:412-416` `advanceClock`/`stepLap`; `:424`; `:442-449`; `:451-455`; `:458-460`; `:472-487` laço das rodas, perseguição e `targetFov`; `:538` `render`; `wheelPositions` usado só em `:2` (importação), `:124` e `:451`; `src/lap.ts:110-112`, `:120`, `:146`, `:158-161`, `:173`; `src/physics.ts:119`, `:121-133`, `:203-213`, `:223-224`, `:229`, `:356`, `PUBLISHED_SETUPS` com `setupVersion` `arcade-assistido-v5` e `realista-aluguel-4t-v4`, `wheelbase` 1,04, `trackWidth` 1,2, `frontWeight` 0,42, `driverMass` 75; `src/frameClock.ts:5` `MAX_FRAME_S` = 0,1; `tests/physics.test.ts:5` `moving`; listas `SIMULATION` (6 arquivos), `NETWORK_OR_STORAGE` e `DOM_CLOCK_RANDOM` em `tests/race-lap-validation-layering.test.ts:9,15,16`; `startSession`, `runCountdown`, `drive`, `completeLap`, `autopilot`, `replay`, `seedLap`, `kartAt`, `MAX_LAP_STEPS` em `tests/helpers/autopilot.ts`; `syntheticReading` em `tests/fixtures/trackFiles.ts:22`; `three` 0.186.1 com `exports` `./addons/*`, `@types/three` 0.183.1, `dependencies` exatamente `{three: ^0.186.1}`; `docs/kart-01/kart.js`: `MEDIDAS.entreEixos` 1,05, `relacaoDirecao` 2,2, `raioRodaDianteira` 0,13, `raioRodaTraseira` 0,14, `CORES` `0xff6a13`/`0x2b2e34`/`0xf4f3ef`/`0x2f55d4`, `atualizarBracos`, `resolverCotovelo`, `maoNoVolante`, `pintarFaces`, `posicionarTubo`, `texturaCanvas`, `defRodas`, `placaTraseira`, `volanteGiro`
- D2 nos arquivos movidos e sorteados (DES-0003, DES-0004, DES-0006, DM-0001, ADR-0002; DES-0001, DES-0007): cada item nomeia `REQ-*`, caminho exato (existente ou **novo**), camada Aplicação, interface, colaboradores, comportamento em falha e chave (nenhuma, com a razão do F-Spec: FEAT-0001/FEAT-0003, Configuração); unidade em todo numérico de interface (`M`, `Rad`, `Mps`, `Deg`, `Px`, `Ms`, passos, rotações, fração do quadro, adimensional); sem corpo de implementação; além de ISSUE-10 e ISSUE-11, nenhum achado
- D4 (DM-0001): campos com tipo, unidade no nome ou na coluna, nulabilidade, padrão (nenhum: ausência é `BASELINE_MISSING`), chave (`setupId`), índices e chaves estrangeiras (não se aplicam, dito), revisão `schemaVersion` 1, reversão (apagar o arquivo → `BASELINE_MISSING`), preenchimento (nenhum), janela de compatibilidade (`setupVersion`, `trackVersion`), retenção e privacidade (D-DS-04, I6); `finalKart` é o `State` publicado, nomeado e não redefinido (I3)
- D5: módulos novos na Aplicação com a razão de I10 (`src/main.ts` não carrega em `npm test`; `src/physics.ts`/`src/lap.ts` intocáveis por REQ-FEAT-0006-06); sentido Aplicação → Simulação → Dado de pista só; `gameCamera.ts` importa só `src/lapTiming.ts` e tipos; nenhuma regra de jogo decidida na renderização; D-DS-01 a D-DS-07 atendidas (D-DS-03 por declaração de não aplicação; D-DS-07 com a prova nomeada em cada item); I3: kart de caixas e câmera suavizada retirados com teste de contrato que afirma a ausência dos símbolos, nenhum campo publicado redefinido; I4: nenhuma configuração nova, sem chave mestra pela proibição do F-Spec (ADR-0003); I10: a caixa de sombra que acompanha o kart e `camera.far` = max(500, 3 × altura) servem a REQ-FEAT-0001-16 e REQ-FEAT-0003-11, com a razão dita; remoção não pedida: ISSUE-11
- D6: sem sessão nem papel além de `player` anônimo (API-0001 a API-0003, Auth); sem segredo (varredura de padrões no conjunto, 0 ocorrências; D-DS-06); registro em log só com códigos (`kart01-decals`/`NO_2D_CONTEXT`, `lap-record`, `track-data`); entradas de fronteira validadas (fixture JSON: `schemaVersion`, campos finitos, `drift` booleano, teto de `MAX_LAP_STEPS`; `viewWidthPx`/`viewHeightPx` > 0); regra de repouso e expiração em `web-mobile` declarada em DES-0007 (nenhum dado em repouso, nenhuma sessão)
- D7: nenhuma escrita de domínio nem transição de estado própria (as da câmera são reavaliações por quadro, contadores `countdownRemainingMs` e `simStepCount` da simulação); falha em tempo-limite, dependência e escrita parcial declarada em cada item (sem rede, sem escrita; `NO_SCENE`, `NO_STATE`, `BASELINE_MISSING`, `getContext` nulo, `mergeGeometries` nulo, WebGL ausente)
- D8: `test-strategy.md` atribui níveis às seis `FEAT-*`, coerentes entre as três tabelas; cada `AC-*` com fixture, estado semeado ou helper existente; nenhum gancho só de teste
- D9: `OPEN-<nn>` e `TBD`: nenhum (varredura; de posse do gate); `98-divergences.md`: 21 linhas, todas com requisito, exigência, `arquivo:linha` (conferidos em `0068a57`), etapa devedora, item de projeto que fecha e estado `open`; nenhuma `waived-pending`; parágrafo final alinhado ao F-Spec 1.2.0
- ligações relativas no conjunto: 79 verificadas, 0 quebradas; blocos mermaid: 1 (`01-architecture.md`, `sequenceDiagram`, 21 linhas), sintaxe válida por inspeção
- `97-changelog.md`: entrada da rodada 2 com o que mudou, ISSUE-01 a ISSUE-06 e ISSUE-09 fechadas por edição, recusas com motivo (ISSUE-07, ISSUE-08, segunda opção de ISSUE-03, primeira de ISSUE-04, as duas de ISSUE-05, divergência nova), FB-01 da rodada 1 registrado como superado (§17)
- `status:` não gravado (veredito FAIL): 9 arquivos leem `draft`, 7 leem `validated` do ciclo de 1840
