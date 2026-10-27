---
id: TEST-0004
title: Barreira na simulação — único obstáculo do ambiente do arquivo, intransponível, com a resposta do muro, contato só no passo de entrada
feature: pista-kart-park
stage: test
status: validated
version: 1.0.0
sources: [AC-US-0004-02, AC-US-0004-04, AC-US-0004-05]
---

# TEST-0004 — Barreira na simulação

| | |
|---|---|
| Arquivo | `tests/pista-kart-park-barrier.test.ts` (estratégia: `barrier`) |
| Nível | integração (`step` com `kartParkEnvironment()`; lançamentos do kart semeado contra o segmento 217 da barreira publicada; comparação passo a passo com o muro sintético num ambiente todo de grama; sequência semeada de 2 000 passos numa cópia sem barreiras) |
| Interface exercitada | `step`, `getTrackContact`, `WIDTH`, `Environment` (`src/physics.ts`); `buildTrackGeometry`, `nearestBarrier`, `Segment` (`src/trackGeometry.ts`); `nearest`, `track` (`src/track.ts`); `readTrackData` |
| Fixtures | `seededKart(posição, rumo, velocidade)`; `launch(alvo, normal, lado, ângulo, distância, velocidade)`: kart a 4 m do alvo pela normal, com a tangente deslocada para que o caminho reto bata no alvo com o ângulo pedido; oráculo próprio de cruzamento (deslocamento do passo contra cada segmento); barreira reta de 2 pontos na grama fora da caixa da pista, construída com a linha central e as zebras do arquivo, contra o muro no trecho 95 da sintética (lado externo), nos referenciais locais de cada obstáculo (normal para o kart, tangente ao longo do obstáculo); cópia `withoutBarriers`; `Seeded(20261027)` |

## Verificações

| Check | Decide | Teste | O que a faria falhar |
|---|---|---|---|
| CHK-TEST-0004-01 | AC-US-0004-02 | the Kart Park environment has no wall derived from the centerline: the barriers of the file are its only obstacles | `walls` verdadeiro, `track` ausente, número de segmentos ≠ arestas das barreiras do arquivo, kart lançado a 15 m/s pela grama a partir de 105 m de volta parado por `wallContact` antes de passar os 13,5 m do muro sintético, `barrierTouching` longe da barreira |
| CHK-TEST-0004-02 | AC-US-0004-04 | a kart driven against the barrier from either side, at every speed the kart reaches and at 90 or 30 degrees, never ends a step on the other side | deslocamento de um passo cruzando um segmento de barreira em qualquer dos 40 lançamentos (2 miras × 2 lados × 5, 10, 20, 30, 34,5 m/s × 90°, 30°; mutação B), lançamento sem `barrierContact`, contato sem perda de velocidade |
| CHK-TEST-0004-03 | AC-US-0004-04 | the barrier also holds at 60 and 200 m/s, the speeds DES-0003 names beyond the reach of the kart | cruzamento num dos 8 lançamentos a 60 e 200 m/s. **Reprova hoje** a 200 m/s e 90° dos dois lados (`98-divergences.md`): com 0,42 m por subpasso o ramo de proximidade do bloco da barreira recoloca o kart do lado oposto sem resposta |
| CHK-TEST-0004-04 | AC-US-0004-05 | after a collision with a barrier line the kart has the position and velocity it has after the same collision with the existing wall, step by step | posição e velocidade normais e tangenciais, `yawRate`, rumo ou `speed` no referencial local diferindo em mais de 1e-9 do muro do passo do contato aos 10 seguintes (60 a 90°) em 24 lançamentos (2 lados × 90°, 60°, 45°, 30° × 10, 20, 30 m/s; mutação B), contatos em passos diferentes de mais de 1, menos de 240 passos comparados |
| CHK-TEST-0004-05 | AC-US-0004-05 | barrierContact is true only in the step the touching begins, barrierTouching while it lasts, and the contact reading mirrors it | `barrierContact` num passo cujo anterior já tocava, contatos ≠ episódios de toque, contato sem toque, `getTrackContact().barrierContact` ≠ telemetria, estado inicial com contato |
| CHK-TEST-0004-06 | AC-US-0004-02 | a copy of the file without barriers gives an environment where a seeded 2000-step run never touches a barrier and never throws | segmento de obstáculo sem declaração, `nearestBarrier` definido, `barrierTouching`/`barrierContact` verdadeiros em algum dos 2 000 passos, exceção ou estado não finito |
