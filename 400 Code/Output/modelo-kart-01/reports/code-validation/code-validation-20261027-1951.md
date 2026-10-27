---
stage: code
feature: modelo-kart-01
verdict: SUCCESS
generated: 2026-10-27T19:58:19Z
counts: {blocker: 0, error: 0, warning: 1, info: 3, divergence: 3}
seed: {revision: 1, digest: ef2fe14c9440}
upstream: {stage: dspec, version: 1.3.0}
feedbacks: []
files_examined: 15
population: "primeira validação da feature (a rodada 1 terminou em FAIL SPEC antes de qualquer validação; conventions §8): os registros do manifesto cuja versão moveu (01-implementation 1.1.0, 97-changelog 1.1.0, 98-divergences 1.1.0, web/DES-0001 1.1.0, web/DES-0006 1.1.0), os registros 1.0.0 (web/DES-0002 a DES-0005, data/DM-0001, security/DES-0007) e 00-index/99-traceability gerados; todos os arquivos de código que o manifesto lista: src/kart01Model.ts, src/kart01Decals.ts, src/kartPose.ts, src/gameCamera.ts, src/main.ts, scripts/kart01-baseline.ts, tests/fixtures/kart01-sim-baseline.json (reduzido por script: chaves e escalares), docs/kart-01/device-log.md, package.json; fonte docs/kart-01/kart.js (leitura dirigida: CORES, MEDIDAS, VOLANTE, criarRoda, braços); dois arquivos intocados sorteados (shuf): src/physics.ts, src/setupRecords.ts; src/lap.ts, src/lapTiming.ts, src/frameClock.ts por grep; projeto 1.3.0 (DES-0001 a DES-0007, DM-0001, test-strategy, 01-architecture) e 400 Code/Input/domain-directives.md; portão executado nesta rodada: npx tsc --noEmit -p . (saída 0), npx tsx --test tests/*.test.ts (237 testes, 237 aprovados, 0 reprovados, reduzido por grep das linhas de resumo), npx vite build --outDir <scratchpad> (631 352 + 11 407 = 642 759 bytes sem compressão), medição do modelo montado em Node por programa descartável no scratchpad (27 malhas, 27 chamadas, 5 128 triângulos, 1,9265 x 1,45 m, entre-eixos 1,05 m, bitolas 1,00/1,14 m, extensão em Z no referencial do spin 0,26/0,26/0,28/0,28 m, 16 grupos com triângulos, piloto filho direto de root, #FF6A13/#2B2E34/#F4F3EF/#2F55D4 presentes, placaTraseira com materials.plate, escapamentoSaida em (0,39, 0,33, 0,77) filho de motor, 23 malhas sólidas com castShadow e 4 decalques sem)"
context-ignored: "a invocação trouxe o resumo do manifesto (27 chamadas, 642 759 bytes, medidas); cada número foi re-medido ou re-executado nesta rodada e o manifesto foi tratado como afirmação a conferir"
---

# Relatório de validação de código — modelo-kart-01 — 20261027-1951

## Summary

Verdict SUCCESS: nenhum blocker ou error; 1 warning (intervalos de linha além do fim de `src/gameCamera.ts` em `98-divergences.md`) e 3 info.
Portão: tsc 0; 237/237 testes; build 642 759 bytes < 3 MB; modelo medido em Node com 27 chamadas (≤ 30) e 5 128 triângulos; simulação (`src/physics.ts`, `src/lap.ts`, `src/track.ts`, `src/maneuvers.ts`, presets, `Input`, `STEP`) sem importação dos módulos novos e com mtime anterior à feature; `package.json` com `dependencies` inalteradas.

## Issues

### ISSUE-01
- severity: warning
- check: C10
- file: `400 Code/Output/modelo-kart-01/98-divergences.md`; `400 Code/Output/modelo-kart-01/01-implementation.md`
- location: 98-divergences.md linhas 8 (`src/gameCamera.ts:161-189`) e 11 (`src/gameCamera.ts:184-189`); 01-implementation.md tabela "Arquivos tocados" (`src/kartPose.ts` "77 linhas", `src/gameCamera.ts` "186 linhas")
- finding: `src/gameCamera.ts` tem 187 linhas (`computeCameraView` em :161-187, ramo `RACE_CHASE` em :181-186) e `src/kartPose.ts` tem 76; os intervalos citados ultrapassam o fim do arquivo e as contagens não batem, embora o código referido exista e faça o que a linha exige.
- expected: intervalos `src/gameCamera.ts:161-187` e `:181-186` em 98-divergences.md; "76 linhas" e "187 linhas" em 01-implementation.md.

### ISSUE-02
- severity: info
- check: C1
- file: `400 Code/Output/modelo-kart-01/web/DES-0001-modelo-kart-01-montagem-agrupamento-e-decalques.md`
- location: seção "Interface entregue" ("`spin` — `<roda>Giro`")
- finding: os nós `spin` chamam-se `<roda>MalhaGiro` (`src/kart01Model.ts:247` recebe `nome + 'Malha'` de :423) e a malha mesclada `<roda>MalhaMalha` (:257), a mesma convenção de `docs/kart-01/kart.js:295,533`; nenhum registro de API-0002 depende desses nomes (os 16 grupos e `volanteGiro` estão corretos).
- expected: o registro nomeia `<roda>MalhaGiro`, ou o projeto fixa o nome; sem efeito na verificação.

### ISSUE-03
- severity: info
- check: C2
- file: `src/kart01Model.ts`
- location: :244-268 (`buildWheel`), :424 (`steer.position.set(x, raio, z)`)
- finding: a caixa envolvente das quatro rodas montadas tem `min.y` 0,0033 m (não 0): o `LatheGeometry` de 14 segmentos não põe vértice em −Y (extensão em Y 0,2535/0,273 m), com a geometria inalterada do Cowork, como DES-0001 1.1.0 descreve; `test-strategy.md` AC-US-0002-05 afirma "`min.y` 0 (rodas no chão)" em igualdade.
- expected: o código realiza DES-0001 e não muda; o estágio de testes afirma "rodas no chão" com a tolerância de RULE-0001 (±0,02 m) ou devolve a frase ao D-Spec como feedback — não é defeito de código.

### ISSUE-04
- severity: info
- check: C2
- file: `src/kartPose.ts`
- location: :36 (`export const WHEEL_NAMES`)
- finding: `WHEEL_NAMES` é exportado e listado em web/DES-0002 (Interface entregue), mas não consta da tabela de interface de DES-0002 do projeto; é uma constante de ordem (a de `wheelPositions`), sem comportamento próprio.
- expected: constante mantida como detalhe de implementação; sem ação.

## Divergences

- `98-divergences.md` linha 15 (REQ-FEAT-0004-01, -02, -05) — open: taxa de quadros nos aparelhos de referência; `docs/kart-01/device-log.md` existe com a entrada do build e os campos marcados como não medidos (verificado).
- `98-divergences.md` linha 19 (REQ-FEAT-0005-05, -06) — open: registros `WHEEL_POSITIONS` e `TELEMETRY_WHEEL_POSITIONS` do estágio de testes; fixture presente (`schemaVersion` 1, `recordedOnCommit` b86b200…, `wheelPositions` por `ARCADE_ASSISTIDO` e `REALISTA_ALUGUEL_4T`) e `simWheelGroundPositions` em `src/kartPose.ts:70-76` (verificado).
- `98-divergences.md` linha 20 (REQ-FEAT-0006-04, -05, -07, -08) — open: registros `LAYERING`, `RENDER_NEUTRAL`, `SIM_CONTRACT`, `DETERMINISM` do estágio de testes; camadas conferidas por grep (nenhum módulo da simulação importa `./kart01Model`, `./kart01Decals`, `./kartPose` ou `./gameCamera`; `src/kartPose.ts` importa só `./physics` e o tipo `WheelName`; `src/gameCamera.ts` só `./lapTiming` e tipos).
- Linhas 1 a 14, 16 a 18 e 21 — resolved: cada `arquivo:linha` conferido na árvore e o código faz o que a linha exige (linha 21: extensão em Z no referencial do `spin` medida 0,26/0,26/0,28/0,28 m; ressalva de localização em ISSUE-01 para as linhas 8 e 11).

## Coverage

- Requisitos com código (verificados contra o projeto 1.3.0): REQ-FEAT-0001-01 a -17 (`src/kart01Model.ts`, `src/kart01Decals.ts`, `src/main.ts:40-45,124-129,450-460`); REQ-FEAT-0002-01 a -10 (`src/kartPose.ts`, `src/kart01Model.ts:548-555`, `src/main.ts:431,450-458`); REQ-FEAT-0003-01 a -15 (`src/gameCamera.ts`, `src/main.ts:392-404,490-499`: 1,38 m / 3,05 m / mira 3,2 m a 0,30 m; 62° em paisagem; retrato max(62°, 60° horizontal); turbo +4° sem termo de velocidade; `ENDED` em `RACE_CHASE`; forma lida por quadro); REQ-FEAT-0004-03, -04 (27 chamadas, 5 128 triângulos medidos); REQ-FEAT-0005-01 a -04, -07, -08 (`src/main.ts:136-147,464-489`: marcas por `simStepCount` a cada 5 passos em `simWheelGroundPositions(pose, lap.config).slice(2)`, contador que recua esvazia `previousSkids` sem tocar a `InstancedMesh`, `beginLap` sem `skidClock`, jato filho de `anchors.exhaustOutlet` com `boost > 0`); REQ-FEAT-0006-01 (642 759 bytes), -02, -03 (`dependencies` só `three` `^0.186.1`; importações só `three`, `three/addons` e `./…`), -06 (`src/physics.ts`, `src/lap.ts`, `src/track.ts`, `src/trackData.ts`, `src/maneuvers.ts`, `src/lapTiming.ts` com mtime anterior à feature e sem importação dos módulos novos; `Input` e presets iguais ao fixture: `wheelbase` 1,04, `trackWidth` 1,2, `frontWeight` 0,42, `STEP` 1/120); DM-0001 (fixture e device-log presentes, sem caminho absoluto, nome de máquina ou usuário); DES-0007 (nenhum `fetch`/`XMLHttpRequest`/`WebSocket`/`localStorage`/`sessionStorage`/`indexedDB`/`sendBeacon` nos cinco módulos; nenhum `document`/`window`/`Date`/`performance`/`Math.random`/`requestAnimationFrame`/`setTimeout`/`setInterval` em kart01Model, kartPose e gameCamera; sem `toDataURL`/`getImageData` nos decalques; sem `os.hostname`/`os.userInfo` no gravador; nenhum segredo).
- Requisitos sem código nesta etapa (por projeto, pertencem ao estágio de testes ou a medição humana; linhas open acima): REQ-FEAT-0004-01, -02, -05 (fps em aparelho); os registros de `npm test` de REQ-FEAT-0002-02, REQ-FEAT-0004-03/-04, REQ-FEAT-0005-05/-06, REQ-FEAT-0006-04/-05/-07/-08 (`tests/helpers/kart01Report.ts` e `tests/modelo-kart-01-*.test.ts` ausentes, como o projeto manda).
- Arquivos alterados mas não registrados: nenhum (árvore fora das pastas do pipeline com mtime após o início da feature: exatamente os nove arquivos da tabela D-CD-01; `scripts/_measure-kart01.ts` ausente; `docs/kart-01/kart.js`, `index.html`, `src/style.css`, `src/audio.ts`, `tsconfig.json`, `tests/*.test.ts` e `tests/helpers/` intocados).
