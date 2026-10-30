---
stage: dspec
feature: dirigibilidade
verdict: FAIL
generated: 2026-10-30T13:26:31Z
counts: {blocker: 0, error: 2, warning: 2, info: 4, divergence: 14}
seed: {revision: 5, digest: 48feb6d51bf8}
upstream: {stage: fspec, version: 4.0.1, status: validated, index-generated: 2026-10-30T12:39:45Z}
feedbacks:
  - "300 Specs/330 D-Specs/Output/race-lap-validation/reports/feedbacks/dirigibilidade/feedback-20261030-1326.md"
  - "300 Specs/330 D-Specs/Output/pista-kart-park/reports/feedbacks/dirigibilidade/feedback-20261030-1326.md"
  - "300 Specs/330 D-Specs/Output/modelo-kart-01/reports/feedbacks/dirigibilidade/feedback-20261030-1326.md"
population: "revalidação após dspec-validation-20261027-1803 (SUCCESS); rodada 10, Mode C (F-Spec 4.0.1, seed revision 5; FB-01 de reports/feedbacks/race-lap-validation/feedback-20261030-1256.md): ISSUE-01 a ISSUE-05 daquele relatório reverificadas primeiro; arquivos com version movida (versões comparadas com as do relatório anterior e com a rodada 10 de 97-changelog.md): todos os 19 arquivos com version do conjunto — 01-architecture 4.0.0, 97-changelog 4.0.0, 98-divergences 4.0.0, test-strategy 6.0.0, ADR-0001 1.1.0, ADR-0002 2.0.1, ADR-0003 2.0.0, ADR-0004 5.0.0, ADR-0005 2.0.0, ADR-0006 1.0.0 (novo), DES-0001 4.0.0 (arquivo renomeado de v5 para v6), DES-0002 2.0.0, DES-0003 2.1.0, DES-0004 6.0.0, DES-0005 2.0.0, DES-0006 2.0.0, DES-0007 1.2.0, DES-0008 1.1.0, DM-0001 3.0.0 (00-index.md e 99-traceability.md gerados pelo gate); nenhum arquivo intocado restou para o sorteio de dois; lista de REQ-* (64), AC-* (33) e NFR-* (9) extraída do F-Spec por script e cruzada com sources e com test-strategy.md; API-0001 2.0.0, API-0002 1.2.0 e API-0003 4.0.1 comparadas campo a campo com DES-0002, DES-0003/DM-0001 e DES-0004; citações arquivo:linha conferidas contra a árvore de trabalho corrente (src/physics.ts 481 linhas, src/main.ts 646, scripts/handlingBench.ts 853, scripts/keyboard-lap.ts, scripts/physics-bench.ts, src/setupRecords.ts, src/lap.ts, src/handlingMessages.ts, index.html, src/style.css, docs/physics.md 429, tests/maneuvers.test.ts, tests/race-lap-validation-layering/-frozen/-contract, tests/pista-kart-park-layering, tests/dirigibilidade-telemetry/-setup-version, tests/helpers/handling.ts, tests/fixtures/kart01-sim-baseline.json); bloco handling-baseline resumido por script (chaves e benchId por entrada); semântica de getLapResult no treino conferida em API-0001 do F-Spec de race-lap-validation (só as linhas da operação) para verificar a afirmação de contrato de DES-0003/DES-0004; ADR-0003 de modelo-kart-01, decisão 4, lida para endereçar o feedback; 101 links relativos e 2 blocos mermaid por script; grep de segredos, TBD e OPEN-nn"
context-ignored: "a invocação trouxe um resumo do conteúdo da rodada (acerto v6, ensaios de giro na pista aberta, ADR-0006, FB-01 resolvido); foi tratado só como indicação do que mudou e não como evidência nem justificativa; 97-changelog.md e as seções Contexto/Alternativas dos ADR foram lidos como conteúdo do artefato; a nota de 01-architecture.md de que a validação encaminha feedbacks não foi seguida por si: os feedbacks enviados saem de D5/I3"
---

# Relatório de validação — dirigibilidade (D-Spec)

## Summary

- ISSUE-01 de 1803 (warning, citações `arquivo:linha`): os sítios citados foram reescritos e conferem na árvore corrente; resta uma citação nova errada em `DES-0004` (ISSUE-03 abaixo).
- ISSUE-02 de 1803 (info, I4): sem mudança de substância; `DES-0001` Feature flag e `ADR-0001` decisão 5; reportada como ISSUE-05.
- ISSUE-03 de 1803 (info, SCR-0002): `DES-0006` linhas 161-164 e `ADR-0002` Consequências mantêm a redução; reportada como ISSUE-06.
- ISSUE-04 de 1803 (info, coluna "Item de projeto"): a tabela "Linhas resolvidas que continuam valendo" segue com quatro colunas; reportada como ISSUE-07.
- ISSUE-05 de 1803 (info, `throttleCondition`): resolvida — o campo saiu de API-0003 4.0.0 e `DES-0004` o lista entre os retirados (linha 68).
- FB-01 de `race-lap-validation` (20261030-1256): realizado — fim da volta no primeiro resultado em `DES-0003` (`replayLap`), `DES-0004` (`TEST_PILOT_LAP`, `measureStepCost`), `DES-0006` (gatilho por resultado novo), `test-strategy.md` (`untilFirstResult`, linhas 25-32, 149-150) e `98-divergences.md` (linha 33); conferido contra `getLapResult` de API-0001 1.2.0 daquela feature ("no treino, devolve a volta mais recente").

## Issues

### ISSUE-01

- severidade: error
- verificação: D3 — forma da resposta de API-0003 campo a campo
- arquivo: `core/DES-0004-ensaios-de-dirigibilidade-e-saida.md`
- localização: linhas 150-153 (a execução para no primeiro passo fora da área), 157-159 (linhas `STEER_RESPONSE`, `CORNER_RADIUS`, `CORNER_TURN` da tabela de ensaios), 232 (tabela Comportamento em falha)
- achado: quando a execução para na saída da área antes do instante de medida, o item não diz o valor dos campos que API-0003 4.0.1 torna obrigatórios nesse caso — `pathRadiusAt3sM` (obrigatório "só sem `stoppedAtStep`"), `speedAt3sMps` e `handlingAt3s` (passo 360) em `CORNER_RADIUS`, `turnAt2sRad` e `speedAt2sMps` (passo 240) em `CORNER_TURN`, e `steadyYawRateRadPerS`/`fallToTenPctMs` quando a fase A de `STEER_RESPONSE` não se completa; as medições só definem o caso da parada (`stoppedAtStep`) e o caso sem saída.
- esperado: para cada ensaio em `TEST_PAD`, definir o valor de cada campo obrigatório quando a execução para em `TEST_AREA_EXCEEDED` antes do seu instante de medida (por exemplo, medido até o passo da saída, como no caso da parada), sem acrescentar campo nem valor de enum.

### ISSUE-02

- severidade: error
- verificação: D4 — colunas, tipos e nulidade de cada forma de dado (o artefato contradiz a si mesmo)
- arquivo: `data/DM-0001-dado-publicado-registros-e-linha-de-base.md`
- localização: seção 2 (`LapRecord`), linhas 54-65
- achado: a seção fixa o `LapResult` de `race-lap-validation` em "API-0001 1.1.0 daquela feature" e enumera os seus campos sem `lapSequenceCount`, `lapStartMs`, `trainingLapMs` e `trainingSectorMs`, opcionais em todo resultado `TRAINING` de API-0001 1.2.0 daquela feature; `DES-0004` linha 169 e `DES-0003` linha 53 projetam sobre a 1.2.0 (FB-01 aceito), e um `LapRecord` de volta de treino, que é `LapResult & SetupRef` (`src/setupRecords.ts:17`), passa a carregar esses campos.
- esperado: citar API-0001 1.2.0 de `race-lap-validation` em DM-0001 e listar os quatro campos opcionais de treino na tabela de `LapRecord` (tipo, unidade, nulidade "como em `LapResult`"), ou declarar que a linha cobre todos os campos de `LapResult` 1.2.0.

### ISSUE-03

- severidade: warning
- verificação: D2 — caminho e ponto de posicionamento conferidos contra a árvore
- arquivo: `core/DES-0004-ensaios-de-dirigibilidade-e-saida.md`
- localização: tabela da biblioteca, linha `readBaseline` (linha 82)
- achado: `readBaseline` é citado como "mantido (`:775-787`)"; em `scripts/handlingBench.ts` as linhas 775-787 são casos de `runBench` e o início de `handlingBenchReport`, e `readBaseline` está em `:808-821`.
- esperado: citar `scripts/handlingBench.ts:808-821`, sem outra mudança.

### ISSUE-04

- severidade: warning
- verificação: D2 — sem corpo de implementação; só assinaturas e contratos
- arquivo: `core/DES-0001-acerto-arcade-assistido-v6-e-assistencias.md`
- localização: seção "Passo sem drift nem turbo", tabela de trechos (linhas 102-117)
- achado: a coluna "Mudança" reescreve expressões de código linha a linha (`limit = Math.min(config.maxSteer, steeringLimit(state.speed, config))`, `rearFrictionScale = forcingScale`, `governor = clamp((config.governorSpeed − |u|) / 1.5, 0, 1)`, `|u| × 0.035`, `config.yawCorrectGainPerS ?? 9`, `let next = { ...state }`), corpo de implementação e não contrato.
- esperado: declarar por trecho o que sai (os termos `drifting`/`boosting`, a chamada de `advanceManeuvers`, os `cancelManeuver`, `onRoad`) e o invariante que a etapa de código prova (estado igual bit a bit para todo `Input` sem o comando de drift; igual com e sem o comando), mantendo a linha 2 como restrição de contrato, sem as expressões de substituição.

### ISSUE-05

- severidade: info
- verificação: D5 — I4 (chave mestra desligada por padrão)
- arquivo: `core/DES-0001-acerto-arcade-assistido-v6-e-assistencias.md`; `adr/ADR-0001-versao-do-acerto-como-registro-novo-no-codigo.md`
- localização: `DES-0001` seção Feature flag (linhas 201-209); `ADR-0001` decisão 5
- achado: sem chave mestra porque FEAT-0003 e FEAT-0005 (Configuração) proíbem configuração para escolher acerto ou religar o drift; o padrão sem mudança está nos campos opcionais ausentes em `RENTAL_KART`/`ARCADE_KART` e na neutralidade da retirada para `Input` sem o comando de drift.
- esperado: nada a mudar.

### ISSUE-06

- severidade: info
- verificação: D3 — cobertura do F-Spec nos dois sentidos
- arquivo: `web/DES-0006-resultado-melhor-tempo-e-texto-compartilhado.md`; `adr/ADR-0002-formato-do-replay-e-registro-de-volta-em-memoria.md`
- localização: `DES-0006` linhas 161-164; `ADR-0002` Consequências, primeiro item
- achado: os pontos de entrada "abrir um tempo ou replay gravado" e "reproduzir um replay" de SCR-0002 continuam sem tela porque nenhuma feature persiste registros; a redução é declarada e `readReplay`/`replayLap` ficam disponíveis; nenhum `REQ-*` afetado.
- esperado: nada a mudar nesta rodada.

### ISSUE-07

- severidade: info
- verificação: D9 — campos de cada linha de `98-divergences.md`
- arquivo: `98-divergences.md`
- localização: tabela "Linhas resolvidas que continuam valendo" (linhas 39-47)
- achado: as sete linhas `resolved` trazem requisito, exigência, o que resolveu em `arquivo:linha` e estado, sem a coluna "Item de projeto"; todos os 64 `REQ-*` estão em `sources` de ao menos um DES/DM/ADR.
- esperado: opcionalmente acrescentar a coluna "Item de projeto" à tabela resolvida.

### ISSUE-08

- severidade: info
- verificação: D8 — caminho de teste de cada `AC-*`
- arquivo: `core/DES-0004-ensaios-de-dirigibilidade-e-saida.md`; `adr/ADR-0004-ensaios-como-biblioteca-e-parametros-de-ensaio.md`; `test-strategy.md`
- localização: `DES-0004` linhas 161 e 191; `ADR-0004` Consequências, segundo item; `test-strategy.md` linhas 99-100
- achado: com o acerto C a traseira não solta sob a condição de forçar (medido pelo gerador), de modo que AC-US-0003-03, AC-US-0003-04 e REQ-FEAT-0003-09 são alcançados pelo registro `REAR_RECOVERY` com `rearReleased` falso (`PASS` por REQ-FEAT-0003-17) e pela lógica de `judge` sobre registros sintéticos; nenhum teste exercita na física a recuperação de 400 ms com o acerto entregue. O F-Spec decide esse caso; o gerador o propôs ao autor no changelog.
- esperado: nada a mudar no veredito; decisão do autor, se a recuperação deve ter passo de partida com o acerto entregue.

### ISSUE-09

- severidade: scope
- verificação: D5 — I3 (retirada exigida pelo F-Spec com ponto de rejeição; consumidores fora desta feature)
- arquivo: `adr/ADR-0006-retirada-do-drift-e-do-turbo-com-janela-de-compatibilidade.md`
- localização: decisão 4; alvo `tests/race-lap-validation-layering.test.ts:9`
- achado: a retirada final de `src/maneuvers.ts` e de `State.maneuvers` depende de `race-lap-validation` deixar de nomear `maneuvers.ts` na lista `SIMULATION` do seu teste de camada; enviado como FB-01 a `race-lap-validation`.
- esperado: decisão da feature alvo; não entra neste veredito.

### ISSUE-10

- severidade: scope
- verificação: D5 — I3 (retirada exigida pelo F-Spec com ponto de rejeição; consumidores fora desta feature)
- arquivo: `adr/ADR-0006-retirada-do-drift-e-do-turbo-com-janela-de-compatibilidade.md`
- localização: decisão 4; alvo `tests/pista-kart-park-layering.test.ts:18`
- achado: a mesma condição de retirada final depende de `pista-kart-park` deixar de nomear `src/maneuvers.ts` no seu teste de camada; enviado como FB-01 a `pista-kart-park`.
- esperado: decisão da feature alvo; não entra neste veredito.

### ISSUE-11

- severidade: scope
- verificação: D5 — I3 (versão publicada substituída; leitores fora desta feature)
- arquivo: `01-architecture.md`; `core/DES-0001-acerto-arcade-assistido-v6-e-assistencias.md`
- localização: `01-architecture.md` "Efeito sobre outras features", linha `pista-kart-park`; `DES-0001` linha 48; alvo `tests/pista-kart-park-surface.test.ts:19-20`
- achado: com `PUBLISHED_SETUPS.ARCADE_ASSISTIDO` em `arcade-assistido-v6`, as verificações de `pista-kart-park` que leem `PUBLISHED_SETUPS.ARCADE_ASSISTIDO.config` passam a pilotar o acerto C; as que usam `ARCADE_ASSISTIDO_V5` (`tests/helpers/kartParkPilot.ts:18`) não mudam; enviado como FB-02 a `pista-kart-park`.
- esperado: decisão da feature alvo; não entra neste veredito.

### ISSUE-12

- severidade: scope
- verificação: D5 — I3 (retirada exigida pelo F-Spec; leitores fora desta feature)
- arquivo: `adr/ADR-0006-retirada-do-drift-e-do-turbo-com-janela-de-compatibilidade.md`; `01-architecture.md`
- localização: `ADR-0006` decisões 2 e 4 e Consequências; alvo `src/main.ts:559` e ADR-0003 de `modelo-kart-01`, decisão 4
- achado: o D-Spec de `modelo-kart-01` atribui a esta feature a troca da condição das marcas de pneu (`tricks.drifting`); este projeto não cria condição substituta (remoção de exibição, `SEED/RE-01`): com a entrega as marcas nunca são desenhadas e saem na retirada final; enviado como FB-01 a `modelo-kart-01`.
- esperado: decisão da feature alvo; não entra neste veredito.

### ISSUE-13

- severidade: scope
- verificação: D5 — I3 (versão publicada substituída; leitores fora desta feature)
- arquivo: `adr/ADR-0001-versao-do-acerto-como-registro-novo-no-codigo.md`; `01-architecture.md`
- localização: `ADR-0001` Consequências, terceiro item; alvo `tests/fixtures/kart01-sim-baseline.json` e `tests/helpers/kart01Report.ts:339-340`
- achado: a linha de base da simulação de `modelo-kart-01` compara `run.setupVersion` com `PUBLISHED_SETUPS[run.setupId].setupVersion` e passa a `BASELINE_MISSING` quando o Arcade publicado for `arcade-assistido-v6`; enviado como FB-02 a `modelo-kart-01`.
- esperado: decisão da feature alvo; não entra neste veredito.

## Divergences

- registro: `98-divergences.md` 4.0.0 — 14 linhas abertas, cada uma com `REQ-*`, exigência, estado atual em `arquivo:linha`, etapa devedora, item de projeto e estado `open`: acerto C não publicado (DES-0001, DM-0001, ADR-0001); manobra de drift no passo (DES-0001, ADR-0006); faixa e anel no lugar da pista aberta (DES-0001, DES-0004, ADR-0005); `CORNER_RADIUS`/`CORNER_TURN` ausentes (DES-0004, ADR-0004); `NORMAL_DRIVING` por classes de passo (DES-0004, ADR-0005); `REAR_RECOVERY` no anel e reprovando a traseira que não solta (DES-0004, ADR-0004); `DRIFT_INERT`/`SPEED_CAP` ausentes (DES-0004); `TOP_SPEED` contra 105 km/h e `WALL_CONTACT` vazio (DES-0004); telemetria com `driftActive` e sem posição e rumo (DES-0002); HUD do drift (DES-0005); `setupVersion` no texto compartilhado e no resultado (DES-0006); fim da volta na fase `ENDED` (DES-0003, DES-0004); linhas de base com os ensaios da revisão 3 (DM-0001, ADR-0003); provas em `npm test` e roteiro registrado (test-strategy).
- citações conferidas na árvore corrente: `src/physics.ts:79-89`, `:98-106`, `:189-200`, `:223-238`, `:280`, `:291-298`, `:301`, `:333`, `:352`, `:395-399`, `:414`, `:441-456`, `:457-481`; `scripts/handlingBench.ts:34-38`, `:52-53`, `:109-110`, `:268-296`, `:337-400`, `:403-430`, `:433-439`, `:506`, `:554-571`, `:712-714`; `scripts/keyboard-lap.ts:32`; `src/setupRecords.ts:120`; `index.html:18`, `:25`, `:30`; `src/main.ts:466`, `:500-506`, `:613-624`; `src/handlingMessages.ts:9`; `docs/physics.md:196-280`, `:282-429`; `tests/maneuvers.test.ts:68-80`; `tests/` com dez `dirigibilidade-*.test.ts`; `docs/handling-device-log.md` ausente.
- linhas resolvidas: 7, cada uma com o `arquivo:linha` que a resolve, conferido; as linhas retiradas com REQ-FEAT-0002-01 a -05, -07, -09, -10 e REQ-FEAT-0003-02, -03, -07 saíram com os requisitos (F-Spec 4.0.0).
- `waived-pending`: nenhuma.

## Coverage

- Requisitos: 64 de 64 em `sources` de ao menos um DES/DM/ADR; nenhum `REQ-*` em `sources` fora do F-Spec 4.0.1; nenhum descoberto.
- NFR: 9 de 9 com mecanismo e métrica (`test-strategy.md` linhas 126-134; `DES-0004` Observabilidade).
- API-0001 2.0.0 ↔ `DES-0002`: 13 campos e `NO_STATE`, campo a campo, sem `driftActive`. API-0002 1.2.0 ↔ `DES-0003`/`DM-0001`: `getSetupVersion`, `readReplay`, `compareLapRecords`, quatro códigos. API-0003 4.0.1 ↔ `DES-0004`: comuns, campos `TEST_PAD`, 17 `benchId`, oito `failReason`; lacuna no caso de saída da área em ISSUE-01.
- Itens de projeto sem fonte: nenhum (8 DES, 1 DM, 6 ADR, todos com `REQ-*` em `sources`).
- Critérios sem caminho de teste alcançável: nenhum (33 de 33 `AC-*`; 6 de 6 `FEAT-*` com nível); nenhum gancho, configuração ou ponto de entrada só de teste; recuperação física não exercitada com o acerto entregue em ISSUE-08.
- Caminhos novos declarados e ausentes da árvore: `docs/handling-device-log.md`; existentes conferidos: `src/physics.ts`, `src/maneuvers.ts`, `src/lap.ts`, `src/lapTiming.ts`, `src/setupRecords.ts`, `src/handlingMessages.ts`, `src/main.ts`, `src/trainingSession.ts`, `src/trackGeometry.ts`, `src/track.ts`, `src/trackData.ts`, `src/audio.ts`, `src/style.css`, `index.html`, `scripts/handlingBench.ts`, `scripts/keyboard-lap.ts`, `scripts/physics-bench.ts`, `docs/physics.md`, `tests/helpers/handling.ts`, `tests/fixtures/records.ts`, `tests/fixtures/trackFiles.ts`, `tests/maneuvers.test.ts`, `tests/physics.test.ts`, `tests/dirigibilidade-*.test.ts`.
- Camadas (D-DS-01, I2, I10): nenhum módulo, camada ou dependência nova; `testPadArea` em `src/physics.ts` (Simulação); a retirada do drift fica no passo; `src/main.ts` só perde exibição.
- Determinismo (D-DS-07): declarado em DES-0001 a DES-0004 com a prova nomeada.
- Segredos, dado pessoal, `TBD`, `OPEN-<nn>`: nenhum; 101 links relativos resolvem; 2 blocos `sequenceDiagram` bem formados.
- Feedbacks enviados: 3 arquivos (ISSUE-09 a ISSUE-13).
