---
stage: test
feature: pista-kart-park
verdict: FAIL CODE
generated: 2026-10-27T23:07:49Z
run: {collected: 398, passed: 397, failed: 1, skipped: 0, fresh: true}
counts: {blocker: 0, error: 1, warning: 1, info: 5, divergence: 22}
checks: {before: 0, after: 102, migrated: 0, removed: 0}
seed: {revision: 1, digest: b5aa5be4734a}
round: 1
mode: A
previous-report: none
run-artifacts: {junit: reports/junit-latest.xml, log: reports/npm-test-latest.log, measured: 2026-10-27T19:57:28-03:00, last-tests-edit: tests/pista-kart-park-screens.test.ts 2026-10-27T19:56:54-03:00, last-scripts-edit: scripts/trackPrep.ts 2026-10-27T18:57:50-03:00, last-src-edit: src/tracks/ 2026-10-27T18:58:02-03:00}
population: [TEST-0001..TEST-0012, 97-changelog.md, 98-divergences.md, 99-traceability.md, tests/pista-kart-park-*.test.ts (12), tests/helpers/kartParkPilot.ts, tests/fixtures/kartParkFiles.ts]
testing-report: 400 Code/Output/pista-kart-park/reports/feedback/testing-report-20261027-2307.md
feedbacks: []
---

# Relatório de validação de testes — pista-kart-park, rodada 1 (Modo A)

## Verification status

- critérios a montante: 51 `AC-US` + 12 `NFR`; na matriz `99-traceability.md`: todos menos NFR-0002 (só aparelho, DIV) e NFR-0011 (ordem de commits, decidida pelo manifesto de código; ISSUE-02); verificações: 102 declaradas nos 12 registros, 102 `test(` nas 12 suítes, 102 executadas em `junit-latest.xml`, ids iguais nos três lugares; 0 puladas
- verificados em `npm test`: todos os critérios da matriz menos AC-US-0004-04 (FAIL-01: a verificação que o decide no limite do projeto reprova; a metade alcançável passa em CHK-TEST-0004-02); metade de tela/aparelho/som/vibração/rede `unverified` até o registro humano: 22 linhas (DIV-01..22); cobertos só por um skip: 0
- frescor: `junit-latest.xml`/`npm-test-latest.log` de 19:57:28, posteriores à última edição de `tests/` (19:56:54), `scripts/` (18:57:50) e `src/` (18:58:02); `find -newer` vazio; 398 coletadas = 296 das outras features + 102 desta; nenhum nível configurado sem execução (web E2E e mobile E2E são roteiro registrado por estratégia 1.0.1, sem ferramenta)
- flake: nenhuma — CHK-TEST-0004-03 reprova na execução registrada e na linha de base das 11 mutações (`97-changelog.md`); nenhum check passou e reprovou sem mudança de entrada
- atrito: 0 → 102; nenhum id anterior desta feature; os 65 de `dirigibilidade`, 140 de `race-lap-validation` e 59 de `modelo-kart-01` continuam nos seus arquivos e passam na mesma execução
- amostra T3 (tautologia, "o que a faria falhar"): CHK-TEST-0001-02/-06/-07/-09/-10/-11/-13 (geometria e suavização: limites 680,625–694,375 m, 0,30 m contra ponto e poligonal, janela 12, varredura O(n²) das bordas, limite de setor a 0,01 m do ponto de `d_o` mais próximo, ≤ 25 m, pares a ≤ 6 m separados, amostra da barreira a 0,05 m fora do asfalto — todos os limites vêm de DES-0010/DES-0011, não do arquivo), CHK-TEST-0002-07, CHK-TEST-0003-01/-02, CHK-TEST-0004-01..06 (todos lidos), CHK-TEST-0005-01/-03/-04/-06/-07 (volta: `VALID`, `MISSED_MARKER`, `CUT` no 121.º passo com `elapsedMs = toMs(121)`, atalho, zebra sem corte), CHK-TEST-0006-01..04 (com prova de que a comparação pode falhar: passo 600 alterado), CHK-TEST-0007-02/-07, CHK-TEST-0008-01/-06, CHK-TEST-0009-03/-07, CHK-TEST-0010-03, CHK-TEST-0011-04, CHK-TEST-0012-03/-04; 11 mutações registradas com as reprovações novas por mutação; nenhuma tautologia encontrada
- D-TS-03/-04/-06: nenhum `Date`, `performance`, `Math.random`, `setTimeout`, `fetch`, `process.env` nas 12 suítes, no helper e na fixture; nenhum `as any`, `@ts-ignore`, acesso a símbolo privado; nenhuma igualdade de ponto flutuante com literal (tolerâncias 1e-12, 1e-9, 1e-6, 1e-4 float32, 0,01 m, 0,001 m declaradas); nenhum `skip`/`todo`/`only`; dados só do arquivo publicado, da origem e de cópias derivadas
- T5: idempotência (mesma pista de novo, `publish`/`promote` repetidos, passo já tratado, chegada de novo) provada em CHK-TEST-0007-08, 0012-04/-05, 0008-02, 0005-08; RBAC, webhook, migração e árvore mobile não aplicáveis (API-0001..0003 sem endpoint, papel, banco; sem árvore mobile), declinados com motivo em `97-changelog.md`
- interpretações de `98-divergences.md` (6 + 1 observação): AC-US-0004-05 (barreira reta de 2 pontos no mesmo bloco de `src/physics.ts` contra o muro) aceita — o critério exige "o mesmo ângulo de impacto", indefinido numa poligonal de 0,04–0,18 m, e a barreira publicada é exercitada em -02/-05; AC-US-0004-01 (toque a 0,002 m = grade de 0,001 m de DM-0001, V13 "cruza ou toca") aceita; AC-US-0003-04 (não fixar 38) aceita, D-TS-03; AC-US-0003-02 (alvo medido em `d_o`, cruzamento a 0,01 m) aceita, igual a V09; AC-US-0006-09 (`recorde` como texto do jogo em `index.html`, proibidos os valores) aceita; AC-US-0005-06 (atrito recuperado por roda a 1e-9, razão bruta 0,85 ± 0,01) aceita; observação do zigue-zague: ver ISSUE-03
- 22 linhas de aparelho: cada uma nomeia a regra provada em `npm test` por ids que existem nas suítes, a parte não verificada e o roteiro `E2E-nn` da estratégia; `docs/kart-park-device-log.md` não existe; genuínas, contadas como `divergence`

## Failures

### FAIL-01
- check: tests/pista-kart-park-barrier.test.ts::CHK-TEST-0004-03 the barrier also holds at 60 and 200 m/s, the speeds DES-0003 names beyond the reach of the kart
- decides: AC-US-0004-04 (DES-0003 "Determinismo" e "Comportamento em falha"; ADR-0003 decisão 2; test-strategy.md linha AC-US-0004-04)
- bucket: CODE
- evidence: `src/physics.ts:367-372` (`barrierContactPoint`): `leftOfAB = {(b.z−a.z)/L, −(b.x−a.x)/L}` fica do lado em que `orientation(a, b, ·)` é **negativa** (a = (0,0), b = (1,0): `leftOfAB` = (0, −1) e `orientation` = −1), mas `startSideNormal` escolhe `leftOfAB` quando `sSide >= 0`; a normal "do lado de S" aponta para o lado oposto a S
- evidence: consequência no passo 1 do bloco (trajeto, `:379-381`): o kart é posto em `Q + m·0,1` do lado **oposto** ao de origem e, com `n = −m` apontando para S, `outgoing = v·n < 0` — nenhuma reflexão, `barrierHit` falso; rastro por subpasso (`dt = STEP/4`, lançamento de CHK-TEST-0004-03, 200 m/s, 90°): subpasso 8 a +0,269 m da barreira, subpasso 9 a **−0,100 m** (lado trocado, `vN` −197,45 m/s inalterada), subpasso 10 a −0,510 m; o mesmo dos dois lados
- evidence: o ramo de proximidade (passo 2, `:383-386`) calcula `m` por `(E − Q)/|E − Q|` e está correto — é ele que segura o kart em toda velocidade em que o deslocamento por subpasso não salta a superfície de 0,1 m; o passo 1, único que o projeto invoca para "velocidade acima de qualquer alcançável" (DES-0003, Comportamento em falha; ADR-0003, alternativa recusada "só a posição final"), inverte o lado sempre que dispara; a reprovação a 200 m/s e 90° (e a 150 m/s nos dois ângulos, medido) é a sua assinatura, independente do zigue-zague — numa barreira reta o passo 1 produz a mesma troca de lado
- evidence: alcance: `ARCADE_ASSISTIDO_V5.governorSpeed` 31,5 m/s + 3 m/s de impulso = 34,5 m/s (`src/physics.ts:81,238`; `docs/physics.md:238`), 0,072 m por subpasso < 0,1 m; 5 705 lançamentos semeados a 5–34,5 m/s, 10–90°, dos dois lados, de fora da superfície de contato, com esterço e acelerador aleatórios: 0 cruzamentos; o critério como os requisitos o enunciam ("qualquer velocidade que o kart alcance") é satisfeito hoje só pelo ramo de proximidade; o passo 1 do projeto, contratado em DES-0003/ADR-0003 e nomeado na estratégia validada a 60 e 200 m/s, está implementado com o sinal trocado — defeito do código, não do check (fiel à estratégia 1.0.1 e a DES-0003) nem do projeto (o algoritmo escrito em DES-0003 passo 1 é correto: "m é a normal unitária de AB apontando para o lado de S")
- expected: `startSideNormal` apontando para o lado de `s` (por exemplo `sSide >= 0 ? {−leftOfAB} : leftOfAB`, ou `m = leftOfAB` com o sinal de `sSide`), de modo que no passo 1 o kart fique a 0,1 m do lado de origem e `outgoing > 0` aplique a resposta do muro; CHK-TEST-0004-03 passa nos 8 lançamentos e CHK-TEST-0004-02/-04/-05 continuam passando (o ramo de proximidade não muda); o caso `near.distanceM === 0` (`:385`) usa a mesma normal corrigida
- owed by: code-loop (`400 Code/Output/pista-kart-park/reports/feedback/testing-report-20261027-2307.md`)

## Issues

### ISSUE-01
- severity: warning
- check: T3
- where: `tests/pista-kart-park-screens.test.ts` CHK-TEST-0009-01/-04/-05/-08/-10, `tests/pista-kart-park-feedback.test.ts` CHK-TEST-0008-08, `tests/pista-kart-park-layering.test.ts` CHK-TEST-0011-01..07
- defect: as afirmações sobre `src/main.ts`, `index.html` e os módulos são textuais (presença/ausência de trechos como `renderCredit($('track-credit'), ...)`, `chooseTrack(OPENING_TRACK_ID)`, `audio.curb(`); um refactor que preserva o comportamento reprova e a presença do texto não prova que o ramo executa (I9).
- expected: manter como guarda de camada e de ligação (a estratégia 1.0.1 nomeia o nível "texto" como em `race-lap-validation`), com a regra de tela provada pelas funções puras (`creditFor`, `optionLabel`, `decideCurbFeedback`) e a tela pelo roteiro E2E; não contar como prova do comportamento de tela.

### ISSUE-02
- severity: info
- check: T2
- where: `99-traceability.md` (83 linhas), `98-divergences.md`
- defect: NFR-0002 (taxa de quadros) e NFR-0011 (código só depois de `dirigibilidade`) não constam da matriz: nenhum registro `TEST-*` os cita em `sources`; NFR-0002 está em `98-divergences.md` como `unverified` (aparelho) e NFR-0011 só como `REQ-FEAT-0007-12` n/a.
- expected: na próxima rodada, a linha de NFR-0011 em `98-divergences.md` nomear o próprio `NFR-0011` e o fato que o decide (manifesto de código: `6ea3862` descendente de `b86b200`); NFR-0002 permanece só no aparelho (I9), contado em DIV-17.

### ISSUE-03
- severity: info
- check: T4
- where: `98-divergences.md` linha CHK-TEST-0004-03 (coluna "Causa no código") e linha "observação para o projeto"
- defect: a causa registrada ("o ramo de proximidade ... recoloca o kart do lado oposto") e a atribuição ao zigue-zague da poligonal não correspondem ao defeito: é o ramo do trajeto (passo 1) com a normal do lado de origem invertida (FAIL-01), que produz a mesma troca de lado numa barreira reta.
- expected: a observação sobre a poligonal (382 vértices, direção alternando a cada 0,1 m, ricochetes em ângulos inesperados) é de qualidade de projeto e não decide nenhum critério; se for mantida como feedback ao D-Spec, só depois da correção de FAIL-01 e com a medida que a justifica (desvio de rumo observado em lançamentos a velocidades alcançáveis), não como causa da reprovação.

### ISSUE-04
- severity: info
- check: T3
- where: `tests/pista-kart-park-barrier.test.ts` CHK-TEST-0004-05; `97-changelog.md` mutação B
- defect: com o bloco da barreira desligado (mutação B) só -02 e -04 reprovam; -05 continua passando porque `barrierTouching`/`barrierContact` também nascem da proximidade de 0,11 m no fim do passo (`src/physics.ts:409-411`), que a mutação não toca — o check prova a semântica dos campos, não a resposta.
- expected: manter; a resposta é decidida por -02 (perda de velocidade) e -04; registrar na coluna "o que a faria falhar" de TEST-0004 que -05 não depende da resposta.

### ISSUE-05
- severity: info
- check: T1
- where: `98-divergences.md` seção de aparelho; `test-strategy.md` 1.0.1
- defect: o arquivo que a estratégia nomeia para o registro humano (`docs/kart-park-device-log.md`) não existe e este estágio não o cria (conventions §14); as 22 linhas ficam `unverified` até a etapa de deploy.
- expected: a etapa de deploy nomeia o registro e o roteiro E2E-01..E2E-08 é executado por um humano antes da promoção; nenhuma ação deste estágio.

## Divergences

- DIV-01..22: as 22 linhas de "Critérios cuja metade de tela, aparelho, som, vibração, navegador ou rede só é verificável pelo roteiro registrado" de `98-divergences.md` (AC-US-0001-01, -02, -05; AC-US-0002-08; AC-US-0003-06, -11; AC-US-0004-06; AC-US-0005-03, -07, -08, -09, -10, -11, -12; AC-US-0006-01 a -06; AC-US-0006-07/-08; NFR-0002; NFR-0004; NFR-0005; NFR-0012 segunda linha; REQ-FEAT-0001-13; REQ-FEAT-0007-12), estado `open`/`unverified`, regra provada em `npm test` pelos ids citados, metade de aparelho devida ao registro humano nomeado pela etapa de deploy; nenhuma contribui para o veredito.
