---
title: Registro de mudanças — dirigibilidade do Arcade assistido (estágio de código)
feature: dirigibilidade
stage: code
status: draft
version: 1.0.0
sources: []
---

# Registro de mudanças

## 2026-10-22 — rodada 2, Mode A (após o FAIL SPEC da rodada 1 e a revalidação do projeto)

**O que mudou**

- `src/physics.ts`: campo opcional `forcingRampMps` em `KartConfig`; `forcingRampFraction` e a escala traseira com rampa em
  `integrate`/`step`; geradores `testPadLane` e `testPadArc`; `StepClass`, `RECOVERY_MAX_STEPS` e `classifyHandlingSteps`;
  valores finais de `ARCADE_ASSISTIDO_V5` escolhidos pelos ensaios (tabela em `core/DES-0001-…md`). `RENTAL_KART`, `ARCADE_KART`,
  `KART_PRESETS`, `STEP`, `SOLVER_SUBSTEPS`, `Input`, a assinatura de `step`, `TEST_PAD` e a linha 3 inalterados.
- `scripts/handlingBench.ts`: reescrito contra DES-0004 4.0.0 — registros com `benchEnvironment` e os campos da revisão 3 e de
  API-0003 3.1.0/3.2.0; `FailReason` com `SPEED_NOT_HELD` e `MEASUREMENT_MISSING`; `STEER_RESPONSE` com acelerador regulado em
  `testPadLane`; `REFERENCE_CORNER`, `UNDERSTEER_ONSET` (varredura em patamares, fim na primeira saída da faixa, lança nos dois casos
  sem decisão) e `REAR_RECOVERY` em `testPadArc`; `NORMAL_DRIVING`, `DETERMINISM` e `REALISTA_UNCHANGED` um registro por ambiente;
  `judge(record, observed?)`; linha de base resolvida por ensaio, ambiente, geometria e método (`sameSetting`,
  `understeerBaselineRecord`), `baselineEntry` com `parameters`; `grassEntry` na pista sintética; `driftScorePoints`;
  `TEST_PILOT_LAP` sem `lapValidity` e com 4 setores sempre; `referenceCorner`, `cornerEntry` e `grassEnvironment` removidos.
- `scripts/keyboard-lap.ts`: programa novo de `bench:handling` (`runtimeId`, `measureStepCost`, `--previous`, `--realista`,
  `BINARY` e `PROPORTIONAL`, `serialize`); `keyboardLap` e `LapTracker` saem do programa (a classe continua exportada e testada).
- `scripts/physics-bench.ts`: mantém as linhas que imprimia e acrescenta `ACCELERATION`, `TOP_SPEED`, `GRASS_LOSS`, `WALL_CONTACT`.
- `src/handlingMessages.ts` (novo): `formatSharedText`, `shareLabel`. `src/main.ts`: acerto do dado publicado (`PUBLISHED_SETUPS`,
  `SETUP_BY_PRESET`), `setupRef` fixado em `beginLap`, HUD por `getHandlingTelemetry`, `lastRecord`/`bestRecord`, `renderBest`
  (só `COMPARABLE`), `#lap-result-setup`, `#lap-share` (Web Share ou área de transferência). `index.html`: os dois elementos em
  `#lap-result` com a classe `lap-chip`. `src/setupRecords.ts` mantido como está.
- `docs/physics.md`: seção datada "Dirigibilidade — Arcade assistido v5" e bloco ` ```json handling-baseline ` com as entradas
  `arcade-assistido-v4`, `realista-aluguel-4t-v4` e `arcade-assistido-v5` (DM-0001, M3).
- Manifesto: `01-implementation.md`, registros por item em `core/`, `data/`, `web/`, `security/`, `98-divergences.md` (17 linhas,
  15 `resolved`, 2 `open`); `00-index.md` e `99-traceability.md` gerados por `lint_artifacts.py --emit`.

**Decisões de implementação, onde o projeto deixava detalhe em aberto** (nenhuma muda contrato nem requisito)

- A contagem de `oversteer`/`sliding` da curva de referência com acelerador cheio não é campo de API-0003 e chega a `judge` pelo
  segundo argumento `observed` (`THRESHOLD_EXCEEDED`), como as outras observações sem campo; sai na linha `#`.
- Os diagnósticos da linha `#` ficam ao lado do registro (`diagnosticsOf`), nunca dentro dele.
- `STEP_COST` sai uma vez por `inputMode` em `bench:handling`; o programa termina com código 0 e deixa o veredito nos registros.
- `setupRef` também é atualizado ao trocar o acerto com a volta ausente (os controles ficam desabilitados durante a volta), para que
  o HUD do estado inicial leia o acerto escolhido; o `setupRef` da volta continua fixado em `beginLap`.
- O texto de falha do compartilhamento é um literal pt/en em `src/main.ts`, como as demais notificações; nenhuma chave nova além de
  `shareLabel`.
- `let setup` é declarado antes da construção das rodas, porque `wheelPositions(setup.config)` as precisa.

**Itens fechados**: nenhum `ISSUE-<nn>` ou `FB-<nn>` (primeira geração sobre o projeto revalidado); os seis `SPEC-ISSUE` do feedback
da rodada 1 (`feedback-20261021-1827.md`) foram resolvidos pelo projeto 2.2.0 e estão implementados.

**Itens recusados, com motivo**

- Arquivos de teste nomeados por test-strategy (`tests/dirigibilidade-*.test.ts`, `tests/fixtures/records.ts`): pertencem ao
  estágio de testes; por isso as linhas 11 e 14 de `98-divergences.md` nomeiam a parte de `npm test` como do estágio de testes.
- `docs/handling-device-log.md` (teste registrado nos aparelhos, E2E-01 a E2E-03): evidência humana que esta rodada não produz.
- Alterar `brakeForce`, `engineBrake`, `steerRate`, `axleScrub`, os parâmetros de ensaio de `BENCH_PARAMETERS`, o piloto de teste ou
  o classificador `handling`: fora das alavancas que DES-0001 e ADR-0004 fixam; o que elas não alcançam foi reportado, não contornado.
- Nenhum limiar foi afrouxado, nenhum requisito enfraquecido, nenhuma dependência acrescentada, nenhum arquivo fora dos que o projeto
  nomeia foi tocado.

**Limiares que as alavancas do projeto não alcançam (reportados em `feedback-20261022-1803.md`, verdict FAIL SPEC)**

- `UNDERSTEER_ONSET` (REQ-FEAT-0002-04, -05, -10): V1 não medida — 7 patamares completos acima de 50 km/h sem `understeer`,
  saída da faixa a 56,1 km/h, `FAIL` `MEASUREMENT_MISSING`; em 3 103 acertos avaliados nenhum mede V1 mantendo a curva de referência
  e a volta do piloto (o rótulo `understeer` exige deriva dianteira > 1,2 × a traseira e o kart assistido deriva por igual nos dois eixos).
- `REFERENCE_CORNER` com acelerador 0 (REQ-FEAT-0002-03): `understeer` ≤ 125 ms (limiar atendido), mas saída da faixa pelo lado
  interno no passo 240 de 300 porque o limite de esterço cresce com a desaceleração; os acertos que a mantêm reprovam a volta do piloto.
- Tudo o mais passa nos dois modos de `Input`: guinada 117/58 ms e 108/50 ms, curva com acelerador cheio, recuperação 8 ms,
  condução normal sem `oversteer`, drift 200 pontos, 0–60 km/h 2 383 ms, 110,2 km/h, grama 48 %/55 %, parede, determinismo,
  piloto de teste 21 340 ms sem sair do asfalto (linha de base 26 703 ms), custo por passo, versão do acerto, contrato de passo,
  Realista idêntico.

**Migração de verificações existentes**: nenhuma verificação foi removida ou alterada; `tests/physics.test.ts` e
`tests/maneuvers.test.ts` continuam usando `ARCADE_KART`, `RENTAL_KART` e `TEST_PAD`; `npm test` 170/170.
