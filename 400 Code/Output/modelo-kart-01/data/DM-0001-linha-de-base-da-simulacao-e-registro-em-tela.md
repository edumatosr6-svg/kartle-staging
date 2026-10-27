---
id: DM-0001
title: Linha de base da simulação anterior à feature (fixture versionado) e registro dos testes em tela — implementação
feature: modelo-kart-01
stage: code
status: validated
version: 1.0.0
sources: [API-0002, FLOW-0003, FEAT-0004, FEAT-0005, FEAT-0006, REQ-FEAT-0004-05, REQ-FEAT-0005-05, REQ-FEAT-0006-07, REQ-FEAT-0006-08, NFR-0001, NFR-0006, NFR-0007]
---

# DM-0001 — Linha de base da simulação e registro dos testes em tela — implementação

Sem banco, sem armazenamento no navegador, sem dado persistido do Jogador. Dois arquivos do repositório:

| Forma | Onde | Situação |
|---|---|---|
| Linha de base da simulação (seção 1) | `tests/fixtures/kart01-sim-baseline.json`, gravado por `scripts/kart01-baseline.ts` | **novo nesta rodada**: `schemaVersion` 1; `recordedAtUtc` `2026-10-27T19:18Z`; `recordedOnCommit` `b86b200d14f950baa1a902f56b6f6fbfff5082ba` (a árvore anterior à primeira mudança de código desta feature, com o código validado da `dirigibilidade`); `stepS` 1/120; `inputTypeLine` literal de `src/physics.ts`; `simWheelbaseM` 1,04; `simTrackWidthM` 1,20; `trackId` `synthetic`; `trackVersion` 2; `wheelPositions` por `setupId` (4 × `{ forwardM, leftM }`, ordem de `wheelPositions`); `referenceRuns` com `setupId`, `setupVersion` (`arcade-assistido-v5`, `realista-aluguel-4t-v4`), `lapKind` `OFFICIAL`, `driverMassKg` 75, `inputRuns` por corridas, `checkStepCount` (3 531; 5 272), `lapValidity` `VALID`, `lapMs` (29 419; 43 932), `sectorMs` (4 inteiros), `finalKart` (`State` completo com `telemetry` e `maneuvers`) |
| Registro em tela (seção 2) | `docs/kart-01/device-log.md` | **novo nesta rodada**, no molde de `docs/lap-validation-device-log.md`: entrada 1 com o build desta rodada (commit base `b86b200` mais a árvore de trabalho, `dist/assets/index-D0RarhFV.js` 631 352 bytes, `index-dgojskay.css` 11 407 bytes, gzip 165 033 + 3 244), a verificação visual no navegador embutido (ritmo inválido, página em segundo plano) e `fpsPerSecond`, `minFps`, download comprimido e roteiros E2E marcados como não executados; as execuções nos aparelhos de referência são humanas |

## Realização por requisito

| Requisito | Arquivo e símbolo |
|---|---|
| REQ-FEAT-0005-05, REQ-FEAT-0006-07, -08; NFR-0006, NFR-0007 | `scripts/kart01-baseline.ts` `main` (gravação com recusa de sobrescrita sem `--force`; `--commit`), `encodeRuns`, `inputTypeLine`; `tests/fixtures/kart01-sim-baseline.json`; o leitor `readSimBaseline` (`BASELINE_MISSING` para versão, acerto ou pista diferentes) é do estágio de testes |
| REQ-FEAT-0004-05; NFR-0001 | `docs/kart-01/device-log.md` (campos Build, Aparelho e navegador, Orientação, Método da contagem, `fpsPerSecond`, `minFps`, Roteiros `E2E-nn`, Download) |
| API-0002, FLOW-0003 | `tests/fixtures/kart01-sim-baseline.json` é o dado que `SIM_CONTRACT`, `DETERMINISM` e `WHEEL_POSITIONS` comparam; sem ele, `BASELINE_MISSING` |

## Plano de migração

| Passo | Estado | Reversão |
|---|---|---|
| M1 `tests/fixtures/kart01-sim-baseline.json` `schemaVersion` 1 | **feito nesta rodada** (gravado antes de qualquer outra mudança de código) | apagar o arquivo: `SIM_CONTRACT`, `DETERMINISM` e `WHEEL_POSITIONS` passam a `BASELINE_MISSING`; nada mais depende dele; nenhum dado de jogador |
| M2 `docs/kart-01/device-log.md` | **feito nesta rodada** (molde com a entrada do build; execuções humanas pendentes) | apagar o arquivo; prosa com tabelas, sem migração |

Preenchimento retroativo: nenhum. Janela de compatibilidade: o arquivo vale para `arcade-assistido-v5`, `realista-aluguel-4t-v4` e
`trackVersion` 2; outro acerto ou outra pista regrava com `npm run baseline:kart01 -- --force --commit <sha>` ou aceita
`BASELINE_MISSING`. Retenção e privacidade: números da simulação, identificadores de acerto e de pista e um sha; nenhum nome de
máquina, de usuário ou caminho absoluto (o gravador não lê `os.hostname`/`os.userInfo` e imprime só o caminho relativo do fixture).
