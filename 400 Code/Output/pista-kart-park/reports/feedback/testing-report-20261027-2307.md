---
stage: test
feature: pista-kart-park
kind: testing-report
verdict: FAIL CODE
generated: 2026-10-27T23:07:49Z
origin: 500 Tests/Output/pista-kart-park/reports/test-validation/test-validation-20261027-2307.md
run: {collected: 398, passed: 397, failed: 1, skipped: 0, fresh: true}
seed: {revision: 1, digest: b5aa5be4734a}
---

# Testing Report — pista-kart-park, rodada 1 (para o code-loop)

### FAIL-01
- check: tests/pista-kart-park-barrier.test.ts::CHK-TEST-0004-03 (AC-US-0004-04; DES-0003 "Bloco da barreira" passo 1 e "Comportamento em falha"; ADR-0003 decisão 2; test-strategy.md 1.0.1 linha AC-US-0004-04)
- bucket: CODE
- where: `src/physics.ts:367-372`, função `barrierContactPoint`
- defect: `leftOfAB = {x: (b.z − a.z)/L, z: −(b.x − a.x)/L}` fica do lado em que `orientation(a, b, ·)` é negativa (a = (0,0), b = (1,0) dá `leftOfAB` = (0, −1) e `orientation(a, b, (0, −1))` = −1), mas `startSideNormal = sSide >= 0 ? leftOfAB : −leftOfAB` escolhe `leftOfAB` quando `sSide >= 0`; a normal "do lado de S" (DES-0003 passo 1: "m é a normal unitária de AB apontando para o lado de S") aponta para o lado oposto a S.
- effect: no ramo do trajeto (`:379-381`) o kart é posto em `Q + m·BARRIER_HALF_WIDTH_M` do lado oposto ao de origem, `n = −m` aponta para S, `outgoing = v·n < 0`, nenhuma reflexão, `barrierHit` falso; o caso `near.distanceM === 0` (`:385`) usa a mesma normal invertida; o ramo de proximidade (`:383-386`, `m = (E − Q)/|E − Q|`) está correto e é o que segura o kart até hoje.
- measured: rastro por subpasso (`dt = STEP/4`) do lançamento de CHK-TEST-0004-03 a 200 m/s e 90°: subpasso 8 a +0,269 m, subpasso 9 a −0,100 m (lado trocado, velocidade normal −197,45 m/s inalterada), subpasso 10 a −0,510 m; dos dois lados; o mesmo a 150 m/s nos dois ângulos; velocidades alcançáveis (≤ 34,5 m/s = `governorSpeed` 31,5 + 3 de impulso; 0,072 m por subpasso) não disparam o passo 1 de fora da superfície de contato (5 705 lançamentos semeados, 0 cruzamentos).
- expected: `startSideNormal` apontando para o lado de `s` — por exemplo `const startSideNormal = sSide >= 0 ? {x: −leftOfAB.x, z: −leftOfAB.z} : leftOfAB` (ou renomear o vetor para o lado que de fato representa) — de modo que no passo 1 o kart fique a 0,1 m do lado de origem com `outgoing > 0` e a resposta do muro (1,12; 0,65; cancelar manobra; `barrierHit`); nenhuma outra linha do bloco muda; CHK-TEST-0004-03 passa nos 8 lançamentos (60 e 200 m/s, 90° e 30°, dois lados), CHK-TEST-0004-02/-04/-05/-06 e `tests/physics.test.ts` continuam passando (o muro `:276-290` não é tocado).
- owed by: code-loop; verificação: `npx tsx --test "tests/pista-kart-park-barrier.test.ts"` e depois a suíte inteira.
