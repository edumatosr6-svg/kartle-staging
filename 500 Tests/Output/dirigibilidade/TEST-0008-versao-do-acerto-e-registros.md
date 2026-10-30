---
id: TEST-0008
title: Versão do acerto, registros antigos e novos, comparabilidade
feature: dirigibilidade
stage: test
status: validated
version: 1.1.0
sources: [AC-US-0005-01, AC-US-0005-04, AC-US-0005-05, AC-US-0005-06, AC-US-0003-08, NFR-0009]
---

# TEST-0008 — Versão do acerto, registros antigos e novos, comparabilidade

| | |
|---|---|
| Arquivo | `tests/dirigibilidade-setup-version.test.ts` (estratégia: `setup-version`) |
| Nível | unitário (`getSetupVersion`, `resolveSetupRef`, `readReplay`, `compareLapRecords`, `buildLapRecord`) e integração (`startLap`/`stepLap`/`getLapResult` com e sem os campos de acerto; `replayLap` sobre `syntheticReading()`; `runBench('SETUP_VERSION')` com os fixtures como `oldRecords`) |
| Interface exercitada | `src/setupRecords.ts` inteiro; `startLap`, `stepLap`, `getLapResult` (`src/lap.ts`); `runBench` (`scripts/handlingBench.ts`) |
| Fixtures | `tests/fixtures/records.ts`: `oldReplay()`, `oldResult()` (sem `setupId`/`setupVersion`/`replayFormatVersion`, gravados com `ARCADE_KART` pelo `autopilot`), `newReplay()`/`newResult()` (volta do `testPilot` com o acerto publicado `arcade-assistido-v6`, campos no pedido, gravada até o primeiro resultado), `v4Replay()`, `v5Replay()` (`arcade-assistido-v5`, comando de drift em blocos de 60 de cada 120 passos), `futureReplay()`, `corruptReplay()`, `oversizedReplay()` (elementos `Proxy` que lançam ao ser lidos), `oversizedReplayText()`, `incompleteResult()`; `autopilot` de `tests/helpers/autopilot.ts`; `untilFirstResult()` de `tests/helpers/handling.ts` |

## Verificações

| Check | Decide | Teste | O que a faria falhar |
|---|---|---|---|
| CHK-TEST-0008-01 | AC-US-0005-04 | the published Arcade setup declares a version different from the previous one, and replays of the two versions are told apart by that field | versão publicada diferente de `arcade-assistido-v6` ou anterior diferente de `arcade-assistido-v4`, `readReplay` de `v4Replay()`, `v5Replay()` e `newReplay()` sem três versões distintas `DECLARED`, configuração publicada que não é o registro v6, v6 diferindo de v5 em outro número de campos que os cinco de `DOMAIN/DEC-15` (mutações M1, M2, M3, M7 reprovam), `SETUP_VERSION` reprovado, acerto desconhecido aceito |
| CHK-TEST-0008-02 | AC-US-0005-04 | a lap started with the setup fields returns them copied in its result, one started without them has no such fields, and the record builder fills only what the result lacks | campo não copiado ou alterado (mutação C: `buildResult` sem `setupVersion`, 3 verificações reprovam), campo presente num pedido sem ele, campos que mudam a volta, `buildLapRecord` sobrescrevendo um resultado que já os traz |
| CHK-TEST-0008-03 | AC-US-0005-05 | two records are comparable only on the same track, setup and version; a previous-version replay reproduced today is SETUP_VERSION_DIFFERS | linha da tabela de RULE-0003 fora de ordem ou errada, registro antigo ou da rodada v5 comparável com o novo, `INCOMPLETE_RECORD` não emitido, replay da versão anterior reproduzido como comparável |
| CHK-TEST-0008-04 | AC-US-0005-01 | the same replay reproduced twice gives the same lap record and the same final state | qualquer fonte de variação entre duas reproduções (relógio, sorteio, estado compartilhado), reprodução que passa do primeiro resultado, volta do piloto inválida com o acerto publicado (mutações M2, M7 reprovam), setores diferentes de 4 |
| CHK-TEST-0008-05 | AC-US-0005-06 | a replay of the previous version is still read and reproduced step by step with the current setup | replay antigo recusado, `stepLap` que não avança um passo por entrada, reprodução que passa do primeiro resultado, entradas antigas fora dos campos e faixas de `Input` |
| CHK-TEST-0008-06 | NFR-0009 | records of the previous version are read as resolved from absence, an unsupported format and unreadable texts are refused without touching the input | versão de um registro antigo resolvida para a corrente, `UNSUPPORTED_FORMAT` não emitido ou objeto alterado, texto inválido/acima do teto/lista acima do teto aceitos ou lidos elemento a elemento, `SETUP_VERSION` contando como lido um registro ilegível |
| CHK-TEST-0008-07 | NFR-0009 | the setup reference resolves an absent setup to the Arcade and an absent version to the previous one, and keeps a declared one | padrão diferente do Arcade, versão ausente resolvida para a corrente, versão declarada normalizada, Realista resolvido para outra versão, configuração anterior editada no lugar |
| CHK-TEST-0008-08 | AC-US-0003-08 | a replay of the superseded round recorded with the drift command held reproduces exactly as the same replay without the command | `LapRecord` diferente entre o replay `v5Replay()` com o comando e o mesmo sem ele (mutação M4 reprova), volta inválida, reprodução de v5 com v6 dada como comparável |
