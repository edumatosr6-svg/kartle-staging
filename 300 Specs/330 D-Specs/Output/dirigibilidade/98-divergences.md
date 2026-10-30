---
title: Divergências — dirigibilidade do Arcade assistido
feature: dirigibilidade
stage: dspec
status: validated
version: 4.1.0
sources: []
---

# Divergências

Registro durável dos requisitos deste conjunto que o sistema em execução não satisfaz (conventions §6). O
F-Spec (4.1.0) é normativo: nenhuma linha abaixo enfraquece um requisito. Cada linha cita o que existe hoje em
`arquivo:linha` — a árvore corrente, que implementa o projeto 3.1.0 deste conjunto e já carrega o código de
`pista-kart-park` e de `modelo-kart-01` —, a etapa que deve a mudança e o item de projeto que a fecha. Caminhos
relativos à raiz do repositório.

## Linhas abertas

| Requisito | O que exige | O que o sistema faz hoje | Etapa devedora | Item de projeto | Estado |
|---|---|---|---|---|---|
| REQ-FEAT-0004-02, REQ-FEAT-0002-11, -12, -13, REQ-FEAT-0005-05 | acerto C publicado como `arcade-assistido-v6` (velocidade estabilizada de 65 km/h a 72 km/h; raio ≤ 13 m; giro ≥ 180° em 2 s), com `arcade-assistido-v5` intacto e `previousSetupVersion` `arcade-assistido-v4` | `src/physics.ts:79-89` só tem `ARCADE_ASSISTIDO_V5`, e `PUBLISHED_SETUPS` (`:98-106`) publica `arcade-assistido-v5` (`governorSpeed` 31,5 m/s: 110,2 km/h; raio de 17 m a 25 m) | código | DES-0001, DM-0001, ADR-0001 | open |
| REQ-FEAT-0003-13, -16, REQ-FEAT-0006-01 | o comando de drift não muda o estado; nenhuma carga, impulso, combo ou pontuação; velocidade máxima única | `src/physics.ts:395-399` avança a manobra a cada passo; `:223-238`, `:280`, `:291-298`, `:301` aplicam `drifting` e `boosting` (esterço × 1,2, atrito traseiro × 0,86, governador + 3 m/s, força de impulso); `:333`, `:352`, `:414` cancelam a manobra | código | DES-0001, ADR-0006 | open |
| REQ-FEAT-0002-17 e os ensaios na pista de teste (REQ-FEAT-0001-01 a -04, REQ-FEAT-0003-04, -05) | pista de teste aberta: disco de asfalto declarado por ensaio, `TEST_AREA_EXCEEDED` fora dele | `src/physics.ts:189-200` gera a faixa reta e o anel de 18 m; `scripts/handlingBench.ts:109-110` os usa; `FailReason` (`:52-53`) não tem `TEST_AREA_EXCEEDED` | código | DES-0001, DES-0004, ADR-0005 | open |
| REQ-FEAT-0002-06, -14, -15, -16 | registros `CORNER_RADIUS` e `CORNER_TURN`, julgados só pelo raio e pelo giro | `scripts/handlingBench.ts:268-296` (`REFERENCE_CORNER`) e `:337-400` (`UNDERSTEER_ONSET`) emitem os ensaios retirados; nenhum registro de raio ou giro | código | DES-0004, ADR-0004 | open |
| REQ-FEAT-0003-01, -06, -08 (condução normal) | `NORMAL_DRIVING` sobre todos os passos da volta do piloto de teste, um registro em `SYNTHETIC_TRACK` | `scripts/handlingBench.ts:554-571` agrega por ambiente só os passos `NORMAL` de `classifyHandlingSteps` (`src/physics.ts:457-481`), excluindo recuperação e forçar, com `excludedRecoveryStepCount` | código | DES-0004, ADR-0005 | open |
| REQ-FEAT-0003-04, -05, -12, -17 | `REAR_RECOVERY` na pista de teste aberta, cada lado, com `rearReleased` e `forcingMs`, sem reprovar quando a traseira não solta | `scripts/handlingBench.ts:403-430` força no anel de 18 m, de um lado, e julga a traseira que não solta como `THRESHOLD_EXCEEDED` (`judge`, `:712-714`) | código | DES-0004, ADR-0004 | open |
| REQ-FEAT-0003-08, -13, -16 (saída) | registros `DRIFT_INERT` e `SPEED_CAP` | `scripts/handlingBench.ts:433-439` emite `DRIFT_MANEUVER` com `driftScorePoints`; nenhum `DRIFT_INERT` nem `SPEED_CAP` | código | DES-0004 | open |
| REQ-FEAT-0004-02, -07 (veredito) | `TOP_SPEED` entre 65 km/h e 72 km/h; `WALL_CONTACT` vazio como `MEASUREMENT_MISSING`; `ACCELERATION`/`TOP_SPEED` com os campos da área | `scripts/handlingBench.ts:34-38` (`THRESHOLDS.topSpeedMps` `105 / 3.6`), `judge` de `WALL_CONTACT` com `THRESHOLD_EXCEEDED`; reta em `testPadLane` sem campos da área | código | DES-0004 | open |
| API-0001 2.0.0 (REQ-FEAT-0002-11 a -13, REQ-FEAT-0003-13) | telemetria com `positionXM`, `positionZM`, `headingRad` e sem `driftActive` | `src/physics.ts:441-456` tem `driftActive` e não tem posição nem rumo | código | DES-0002 | open |
| REQ-FEAT-0003-14 | HUD sem indicador de carga de drift, turbo, impulso, combo ou pontuação | `index.html:18` (`ESTILO`, `#style-score`, `#combo`), `:30` (`#drift-hud`); `src/main.ts:500-506` (mensagens de prêmio), `:613-624` (medidor, rótulos, `boosting`) | código | DES-0005 | open |
| REQ-FEAT-0003-18, -19, -20; SCR-0003 1.0.0 | tela inicial, dica da barra de ferramentas e guia de manobras sem texto, ícone ou controle que mencione ou ofereça o drift ou o turbo, nos dois canais e nos dois idiomas | `index.html:19` (`#welcome`: "Entre de lado. Saia voando.", "Acelere, encaixe o drift e solte para dar o impulso." e "Espaço + curva para drift"), `:34` (`.control-hint`: "Dirigir · Espaço: drift → turbo"), `:35` (`.maneuver-guide`, `aria-label` "Como fazer drift", três passos só do drift e do turbo); `src/style.css:3` (regras `.maneuver-guide`); observado na árvore de 2026-10-30 | código | DES-0009 | open |
| REQ-FEAT-0003-21; SCR-0001 1.2.0 | controle de toque de `web-mobile` sem o botão "Drift" nem outro controle de drift ou turbo, com o sensor ativo e no recuo para toque | `index.html:32` (`<button data-control="drift" aria-label="Segurar para drift">Drift</button>`); `src/main.ts:549` (`touch.has('drift')` no `Input`), `:655-656` (`driftButton.disabled`); `src/style.css:3` (`.touch-controls button[data-control=drift]`); observado na árvore de 2026-10-30 | código | DES-0007 | open |
| REQ-FEAT-0003-15, REQ-FEAT-0005-13; SCR-0002 1.2.0 | texto compartilhado e resultado sem a `setupVersion` e sem conteúdo de drift | `src/handlingMessages.ts:9` escreve `· <setupVersion>`; `index.html:25` tem `#lap-result-setup`, preenchido em `src/main.ts:466` | código | DES-0006 | open |
| REQ-FEAT-0005-01 a -04, -10 (fim da volta) | a volta do piloto de teste, a volta cronometrada e a reprodução de replay terminam no primeiro resultado, também quando o treino de `race-lap-validation` passar a só chegar a `ENDED` por `endTraining` | `scripts/handlingBench.ts:506`, `scripts/keyboard-lap.ts:32` e `src/setupRecords.ts:120` (`replayLap`) param na fase `ENDED`; hoje coincide com o primeiro resultado, e deixa de coincidir com a mudança projetada no D-Spec de `race-lap-validation` (feedback `reports/feedbacks/race-lap-validation/feedback-20261030-1256.md`) | código | DES-0003, DES-0004 | open |
| REQ-FEAT-0006-08, NFR-0004 | entrada datada de `arcade-assistido-v6` e linhas de base `arcade-assistido-v4` e `realista-aluguel-4t-v4` medidas com os ensaios desta versão, uma entrada por chave | `docs/physics.md:196-280` (prosa de v5) e `:282-429` (bloco com v4, Realista e v5 medidos com os ensaios da revisão 3) | código | DM-0001, ADR-0003 | open |
| as provas em `npm test` (REQ-FEAT-0001-06, REQ-FEAT-0002-06, REQ-FEAT-0003-08, REQ-FEAT-0004-07, REQ-FEAT-0006-04, -05) e o roteiro registrado (AC-US-0003-09, -11 a -15, AC-US-0004-06, AC-US-0005-05, -07) | verificações de [test-strategy](test-strategy.md) 6.1.0; `docs/handling-device-log.md` | `tests/dirigibilidade-*.test.ts` (dez arquivos) e `tests/fixtures/records.ts` provam o projeto 5.1.0; `tests/maneuvers.test.ts:68-80` exige o drift pelo passo; `docs/handling-device-log.md` não existe | testes | test-strategy | open |

## Linhas resolvidas que continuam valendo

| Requisito | O que exige | O que resolveu | Estado |
|---|---|---|---|
| REQ-FEAT-0001-01 a -04, -06, -09 (velocidade mantida e tempos) | resposta do volante com a velocidade mantida em 50 km/h por acelerador regulado, `SPEED_NOT_HELD` | `scripts/handlingBench.ts:234-263` (regulação `:127`, janela de 200 ms); muda só o ambiente (linha aberta acima) | resolved |
| REQ-FEAT-0004-01, -03, -04, -05, -08 | 0–60 km/h ≤ 2,5 s; grama ≥ 30 % em 1 s; parede reduz a velocidade | `src/physics.ts:240`, `:300`, `:324-337`; `scripts/handlingBench.ts:443-490`; com o acerto C, 2 208 ms e 51 %/55 % (medido nesta rodada) | resolved |
| REQ-FEAT-0004-06, -09 | HUD lido pelo contrato API-0001 | `src/main.ts:605-611` | resolved |
| REQ-FEAT-0005-05, -06, -08, -10 (aplicação e leitores) | comparação só `COMPARABLE`; registros antigos lidos; campos de acerto copiados do pedido | `src/setupRecords.ts:39-129`; `src/lap.ts:24`, `:31-32`, `:55-56`; `src/main.ts:289-295`, `:297`, `:524-535` | resolved |
| REQ-FEAT-0005-11, -12 | `OFF_ASPHALT` do piloto de teste; `NON_DETERMINISTIC` | `scripts/handlingBench.ts:495-530`, `:574-585` | resolved |
| REQ-FEAT-0005-07, REQ-FEAT-0006-03 | `STEP_CONTRACT` | `src/physics.ts:90`, `:386`; `scripts/handlingBench.ts:626-635` (muda só a convenção de ambiente, linha aberta da saída) | resolved |
| REQ-FEAT-0006-06, -09 | `STEP_COST` contra a linha de base da mesma máquina e runtime | `scripts/keyboard-lap.ts:16-40`; `scripts/handlingBench.ts:587-596` | resolved |

Satisfeitos desde antes, sem divergência: saturação do `Input` na faixa (REQ-FEAT-0001-07); condição de forçar
na simulação (REQ-FEAT-0003-10: `src/physics.ts:124-127`); tempo simulado sem contar a suspensão
(REQ-FEAT-0001-08, REQ-FEAT-0002-08, REQ-FEAT-0003-11); versão anterior intacta (REQ-FEAT-0005-09:
`ARCADE_KART`, `src/physics.ts:67-74`); simulação sem DOM (REQ-FEAT-0006-02); grama e parede não invalidam a
volta por si (REQ-FEAT-0004-10); Realista intacto (REQ-FEAT-0006-04: `RENTAL_KART`, `:55-64`); conjunto de
`race-lap-validation` aprovado (REQ-FEAT-0006-07), protegido pela janela de compatibilidade de ADR-0006.

As linhas das versões anteriores deste registro sobre `REFERENCE_CORNER`, `UNDERSTEER_ONSET`, a janela de
`maxUndersteerMs`, V0/V1 e `DRIFT_MANEUVER` (REQ-FEAT-0002-01 a -05, -07, -09, -10; REQ-FEAT-0003-02, -03,
-07) saíram com os requisitos que exigiam, retirados pelo F-Spec 4.0.0 (`DOMAIN/DEC-15`).
