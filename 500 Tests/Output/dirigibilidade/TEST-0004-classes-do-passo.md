---
id: TEST-0004
title: Classes do passo de RULE-0001 sobre sequências sintéticas
feature: dirigibilidade
stage: test
status: validated
version: 1.0.0
sources: [AC-US-0003-02]
---

# TEST-0004 — Classes do passo de RULE-0001 sobre sequências sintéticas

| | |
|---|---|
| Arquivo | `tests/dirigibilidade-classify.test.ts` (estratégia: `classify`) |
| Nível | unitário: `classifyHandlingSteps` sem física, sobre listas de `{input, telemetry}` escritas no teste |
| Interface exercitada | `classifyHandlingSteps`, `RECOVERY_MAX_STEPS` (`src/physics.ts`) |
| Fixtures | `releaseSequence(forcingSteps, gripAt, length)`: passos de forçar com `oversteer`, soltura (esterço 1 → 0), `grip` no passo dado ou nunca; variantes com esterço reaplicado, esterço parcial, soltura em `grip` e soltura de −1 com `sliding` |

## Verificações

| Check | Decide | Teste | O que a faria falhar |
|---|---|---|---|
| CHK-TEST-0004-01 | AC-US-0003-02 | a step under the forcing condition is FORCING, a drift step is DRIFT and a plain step is NORMAL | `forcing` ignorado, `driftActive` sem precedência sobre `forcing`, lista vazia com classe |
| CHK-TEST-0004-02 | AC-US-0003-02 | the release of a full steer under forcing with the rear loose opens a recovery that ends at the first grip, inclusive | soltura não detectada, primeiro `grip` fora da recuperação, recuperação que continua depois do `grip` |
| CHK-TEST-0004-03 | AC-US-0003-02 | a recovery that never reaches grip lasts 48 steps (400 ms); the 49th step without grip is NORMAL and fails as loose normal driving | teto diferente de 400 ms em passos, 49.º passo ainda `RECOVERY`, `grip` tardio reabrindo a recuperação |
| CHK-TEST-0004-04 | AC-US-0003-02 | a forcing step inside a recovery ends it; the steps that follow are classified afresh | passo `FORCING` que não encerra a recuperação, esterço parcial depois dele tratado como soltura |
| CHK-TEST-0004-05 | AC-US-0003-02 | only a full steer taken to 0 from a forcing step with the rear loose opens a recovery | soltura de esterço parcial, soltura em `grip` ou redução a 0,5 abrindo recuperação; soltura de −1 com `sliding` não abrindo |
| CHK-TEST-0004-06 | AC-US-0003-02 | the class of a step depends only on the sequence before it, in simStepCount order: the same sequence classified twice gives the same classes | estado retido entre chamadas, classe de um passo dependente dos passos seguintes, número de classes diferente do número de passos |
