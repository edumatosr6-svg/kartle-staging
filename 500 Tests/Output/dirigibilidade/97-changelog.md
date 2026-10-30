---
title: Changelog do estágio de testes
feature: dirigibilidade
stage: test
status: validated
version: 2.1.0
---

# 97 — Changelog

## 2026-10-27 — rodada 1, Modo A (nenhuma suíte existia para a feature)

### Entrada

- Critérios validados de `200 Requirements/230 Output/dirigibilidade/` (US-0001 3.0.0, US-0002 3.4.0, US-0003 3.0.0, US-0004
  2.0.0, US-0005 3.0.0; NFR-0001 a NFR-0009); estratégia `test-strategy.md` 5.1.0 e contrato API-0003 3.4.0; manifesto de
  código `01-implementation.md` 2.1.0 e a linha D de `98-divergences.md` do código (prova em `npm test` devida a este estágio).
- Árvore de código no momento da rodada: `src/physics.ts` (`ARCADE_ASSISTIDO_V5`, pista de teste, classificador),
  `scripts/handlingBench.ts` (biblioteca de ensaios, `judge`, `readBaseline`, `serialize`), `src/setupRecords.ts`,
  `src/handlingMessages.ts`, `src/lap.ts` com `setupId`/`setupVersion` copiados; `docs/physics.md` com o bloco
  `handling-baseline` (entradas `arcade-assistido-v4`, `arcade-assistido-v5`, `realista-aluguel-4t-v4`).

### O que foi escrito

- 10 arquivos de teste em `tests/dirigibilidade-*.test.ts` (65 verificações `CHK-TEST-00nn-nn`, uma por função de teste),
  executados por `npm test` (`node:test` + `node:assert/strict` via `tsx`), com os registros de API-0003 impressos por
  `t.diagnostic` (critérios "a saída de `npm test` contém").
- Helper `tests/helpers/handling.ts` (opções de ensaio com `measuredAtUtc` fixo, linhas de base lidas de `docs/physics.md`,
  `trace()` sobre `step`/`getHandlingTelemetry`, paridade por `measures()`) e fixture `tests/fixtures/records.ts` (replays e
  resultados antigos, novos, não suportados, ilegíveis, acima do teto e incompletos; textos `handling-baseline` com um desvio
  cada), fora do glob de `npm test`.
- Registros de teste `TEST-0001` a `TEST-0010` neste diretório; `98-divergences.md`; este changelog. `00-index.md` e
  `99-traceability.md` são emitidos por `lint_artifacts.py --emit`.
- Nenhum arquivo de `src/`, `scripts/`, `docs/`, `index.html` ou `package.json` foi editado.

### Mapeamento dos nomes da estratégia para a diretriz de nomes do estágio

| Estratégia | Arquivo escrito | Registro |
|---|---|---|
| `steer-response` | `dirigibilidade-steer-response.test.ts` | TEST-0001 |
| `cornering` | `dirigibilidade-cornering.test.ts` | TEST-0002 |
| `rear` | `dirigibilidade-rear.test.ts` | TEST-0003 |
| `classify` | `dirigibilidade-classify.test.ts` | TEST-0004 |
| `speed` | `dirigibilidade-speed.test.ts` | TEST-0005 |
| `telemetry` | `dirigibilidade-telemetry.test.ts` | TEST-0006 |
| `hud-text` | `dirigibilidade-hud-text.test.ts` | TEST-0007 |
| `setup-version` | `dirigibilidade-setup-version.test.ts` | TEST-0008 |
| `test-pilot` | `dirigibilidade-test-pilot.test.ts` | TEST-0009 |
| `contract` | `dirigibilidade-contract.test.ts` | TEST-0010 |

### Migração de verificações existentes

Inventário antes da escrita: nenhum id `CHK-TEST-*` desta feature em `tests/` nem em `99-traceability.md` (o estágio não
existia para a feature); os 140 ids de `race-lap-validation` (`CHK-TEST-0001-01` a `CHK-TEST-0014-05` daquela feature)
continuam nos seus arquivos, não tocados, e passam na mesma execução (NFR-0008, CHK-TEST-0010-06). `tests/physics.test.ts`
e `tests/maneuvers.test.ts` não foram modificados nem duplicados: a verificação do drift de `requirements/11`
(`player-induced drift generates real lateral slip and a useful exit boost`) é referida por CHK-TEST-0003-06, que afirma a
sua presença e o glob de `npm test`. Nada a migrar.

### Execução

`npx tsx --test tests/*.test.ts` com os repórteres `junit` (`reports/junit-latest.xml`) e `spec`
(`reports/npm-test-latest.log`): 237 verificações, 237 aprovadas, 0 reprovadas, 0 puladas, ~19 s. Custo das suítes novas
dentro do orçamento (~60 s): `REALISTA_UNCHANGED` (CHK-TEST-0010-05, ~6 s) é o ensaio mais caro e roda uma vez.

### Prova de que as verificações podem falhar

Além da linha "o que a faria falhar" em cada `TEST-*`, as 10 suítes foram executadas contra uma cópia temporária do código
fora do repositório (diretório de rascunho da sessão) com quatro mutações, uma de cada vez; a cópia foi descartada:

| Mutação | Verificações que reprovaram |
|---|---|
| A — `steerApplyRatePerS` 14 → 2 em `ARCADE_ASSISTIDO_V5` (esterço mais lento) | 11: CHK-TEST-0001-01, -03, -07; CHK-TEST-0002-01, -02, -08; CHK-TEST-0003-02, -03, -04, -05, -07 |
| B — `referenceCornerBench` medindo `maxUndersteerMs` na janela inteira com acelerador 0 (`DOMAIN/DEC-14` desfeito: 633 ms) | 3: CHK-TEST-0002-01, -02, -08 |
| C — `buildResult` de `src/lap.ts` sem copiar `setupVersion` | 3: CHK-TEST-0008-02, -03; CHK-TEST-0010-06 |
| D — condição de forçar a 40 km/h em vez de 50 km/h | 10: CHK-TEST-0002-03, -04, -05, -06, -08; CHK-TEST-0003-01; CHK-TEST-0006-02; CHK-TEST-0009-01, -02; CHK-TEST-0010-05 |

### Itens da estratégia aplicados com ajuste, com o motivo

- **Traços dos ensaios (AC-US-0002-01, -02, -06; AC-US-0003-02, -05; AC-US-0004-01 a -05):** a biblioteca não exporta os
  traços; cada verificação que a estratégia descreve "sobre o traço" refaz o ensaio pelo mesmo caminho público (`arcEntry`,
  `straight`, `grassEntry`, `wallApproach`, `makeInput`, `step`, `getHandlingTelemetry`, `testPadArc`/`testPadLane`/`CIRCUIT`)
  e recomputa a regra do critério sobre o próprio traço (janela até a primeira saída, primeiro passo a 60 km/h, pares de
  contato), comparando com o campo do registro. Para a varredura de `UNDERSTEER_ONSET`, cujo regulador por patamar não é
  reproduzido pelo teste, a velocidade de saída e a velocidade do patamar interrompido são lidas da linha `#` de apresentação
  (`diagnosticsOf`), e a posição da saída é afirmada fora da faixa por `testPadArc`.
- **"Sem início de subesterço até a saída da faixa" sobre registro sintético (AC-US-0002-05):** a frase é apresentação
  anexada pela biblioteca ao registro real, não reproduzível num registro sintético sem superfície só de teste; afirmada
  sobre o registro real (CHK-TEST-0002-03), condicionada à regra de `DOMAIN/DEC-12` (nenhum patamar acima de 200 ms).
- **`STEP_COST` 11 µs contra 10 µs (NFR-0002):** em ponto flutuante `1.10 × 10 = 11.000000000000002`, e 11 não excede esse
  valor; a verificação usa 11,5 µs (`FAIL`) e 10,9 µs (`PASS`) para não depender do arredondamento (CHK-TEST-0010-02).
- **`REALISTA_UNCHANGED` sem `realistaBaseline` (NFR-0007):** a reexecução sem linha de base custaria mais 6 s;
  `BASELINE_MISSING` é afirmado por `judge` sobre o registro real com `baselineAvailable` falso (CHK-TEST-0010-05).
- **Nomes de arquivo:** a diretriz do estágio exige `tests/<slug>-*.test.ts`; os nomes da estratégia foram prefixados com
  `dirigibilidade-` (tabela acima).

### Itens declinados, com o motivo

- **Criação de `docs/handling-device-log.md` e de árvores de E2E:** declinada. O estágio escreve só em `tests/` e em
  `500 Tests/Output/<feature>/` (conventions §14); não há ferramenta de E2E e nenhuma dependência foi acrescentada. Os
  critérios cuja parte de tela, aparelho ou relógio de parede depende do roteiro `E2E-01` a `E2E-03` estão em
  `98-divergences.md` como `unverified`, à espera do registro humano.
- **Verificações de acesso não autenticado e de papel recusado (política de segurança do skill):** não aplicáveis. API-0001
  a API-0003 não têm endpoint de rede, sessão nem papel (I6); não há webhook.
- **Verificação de idempotência por evento duplicado (política do skill):** não há escrita de domínio nem transição de estado
  nesta feature além de `startLap`/`stepLap`, já cobertas por `race-lap-validation`; a idempotência de API-0003 (dois ensaios
  dão registros idênticos) está em CHK-TEST-0009-05 e a pureza de `classifyHandlingSteps` em CHK-TEST-0004-06.
- **Critério 05 de NFR-0003 ("100 % dos critérios aprovados para a sequência proporcional equivalente") como suíte própria:**
  declinado como arquivo separado; cada suíte de US-0001 a US-0004 roda os dois modos e tem a sua verificação de paridade
  (CHK-TEST-0001-07, CHK-TEST-0002-08, CHK-TEST-0003-08, CHK-TEST-0005-07, CHK-TEST-0009-06).

## 2026-10-30 — rodada 2, Modo B (mudança de projeto: acerto `arcade-assistido-v6`, pista de teste aberta, drift e turbo retirados)

### Entrada

- Requisitos revalidados contra o seed revisão 5 (`DOMAIN/DEC-15`, `DOMAIN/DEC-16`; US-0002 com AC-US-0002-07 a -09 e -05,
  US-0003 com AC-US-0003-08 a -11, AC-US-0004-02 em 65–72 km/h); F-Spec 4.0.1 (API-0001 2.0.0, API-0003 4.0.1, RULE-0002
  4.0.1, SCR-0002 1.2); D-Spec com `test-strategy.md` 6.0.0 (tabela "Verificações existentes") e ADR-0006; manifesto de código
  `01-implementation.md` 3.0.0 (rodada 5) e `code-validation-20261030-1413` (SUCCESS, DIV-14 devida a este estágio).
- Reprovadas antes da rodada (lista do gerador de código): carregamento de `tests/dirigibilidade-classify|cornering|rear|speed|telemetry.test.ts`,
  CHK-TEST-0010-03, -0010-07, -0007-02, -0007-03, -0008-04, -0001-06, -0009-05 e o teste de `tests/maneuvers.test.ts`
  "player-induced drift generates real lateral slip and a useful exit boost".

### O que foi escrito

- `tests/helpers/handling.ts`: `ARCADE_CONFIG` passa a ser o `config` publicado (`ARCADE.config`, hoje `ARCADE_ASSISTIDO_V6`) e
  não mais `ARCADE_ASSISTIDO_V5` (causa de CHK-TEST-0008-04); novo `untilFirstResult(lap, controller, maxSteps, onStep)`, o fim
  de volta da estratégia (primeiro resultado de `getLapResult`, nunca a fase `ENDED`).
- `tests/fixtures/records.ts`: gravação até o primeiro resultado; `v5Replay()` (`arcade-assistido-v5` com o comando de drift
  em parte das entradas); textos `handling-baseline` reduzidos a `noBlock`, `corrupt` e `stepCost`, com os parâmetros da pista
  aberta (as variantes do arco e da varredura saíram com as verificações que as usavam).
- `tests/dirigibilidade-cornering.test.ts` reescrito sobre `CORNER_RADIUS` e `CORNER_TURN`; `tests/dirigibilidade-rear.test.ts`
  reescrito sobre a volta do piloto de teste, `REAR_RECOVERY` aberta, `DRIFT_INERT` e `SPEED_CAP`;
  `tests/dirigibilidade-classify.test.ts` removido; `speed`, `telemetry`, `steer-response`, `hud-text`, `setup-version`,
  `test-pilot` e `contract` ajustados nas verificações listadas abaixo; em `tests/maneuvers.test.ts`, só o teste do drift pelo
  passo foi removido. `tests/physics.test.ts` não foi tocado (não usa o comando de drift nem o impulso).
- Cada limiar novo é medido sobre um traço que o próprio teste conduz por `step`/`getHandlingTelemetry` (ou
  `startLap`/`stepLap`) e só depois comparado com o registro da biblioteca: raio da trajetória lido de duas formas (direção da
  velocidade, e posições da janela 349–372 de DES-0004), giro acumulado passo a passo, velocidade estabilizada da reta,
  contagens da volta, recuperação de `forcingThenRelease` com acelerador mantido e zerado, comparação estado a estado com e sem
  o comando de drift. Nenhum limiar é afirmado só pela constante que o define.
- Registros `TEST-0001`, `TEST-0002` (renomeado para `TEST-0002-raio-da-trajetoria-e-giro-na-pista-aberta.md`), `TEST-0003`,
  `TEST-0005` a `TEST-0010` atualizados; `TEST-0004` removido com as suas verificações; `98-divergences.md` reescrito.
  `00-index.md` e `99-traceability.md` emitidos por `lint_artifacts.py --emit`.
- Nenhum arquivo de `src/`, `scripts/`, `docs/`, `index.html` ou `package.json` foi editado; nenhuma suíte de outra feature foi
  tocada.

### Migração das verificações (inventário antes: 65 ids; depois: 61)

Retiradas por aprovação do dono do produto: `DOMAIN/DEC-15` (decisão de 2026-10-29, seed revisão 4, "não há drift nem turbo";
o arco de 18 m substituído pela pista aberta), com a migração aprovada na tabela "Verificações existentes" de
`test-strategy.md` 6.0.0 (D-Spec validado em `dspec-validation-20261030-1333`). Os critérios que elas decidiam foram retirados
dos requisitos (US-0002 e US-0003, "Numeração"), logo nenhuma linha de `98-divergences.md` é devida por elas.

| Id | Critério que decidia | Destino | Motivo |
|---|---|---|---|
| CHK-TEST-0002-01 | AC-US-0002-01 | removida | critério retirado com o arco de 18 m (`DOMAIN/DEC-15`); `REFERENCE_CORNER` não existe mais |
| CHK-TEST-0002-02 | AC-US-0002-02 | removida | critério retirado (faixa do arco com acelerador cheio) |
| CHK-TEST-0002-03 | AC-US-0002-03 | removida | critério retirado (`UNDERSTEER_ONSET`, V1 ≥ 1,15 × V0) |
| CHK-TEST-0002-04 | AC-US-0002-03 | removida | critério retirado (origem de V0 na linha de base da varredura) |
| CHK-TEST-0002-05 | AC-US-0002-04 | removida | critério retirado (subesterço progressivo por patamar) |
| CHK-TEST-0002-07 | AC-US-0002-06 | removida | critério retirado (fim da varredura pela saída da faixa) |
| CHK-TEST-0002-06 | AC-US-0002-05 | modificada | o critério foi reescrito: agora prova os registros `CORNER_RADIUS` e `CORNER_TURN` (campos exatos, área, km/h e graus, valores do traço aos 3 s) |
| CHK-TEST-0002-08 | NFR-0003 | modificada | paridade dos dois modos sobre `CORNER_RADIUS`/`CORNER_TURN` em vez do arco e da varredura |
| CHK-TEST-0002-09, -10, -11 | AC-US-0002-07, -08, -09 | acrescentadas | critérios novos do seed revisão 4/5 |
| CHK-TEST-0003-02 | AC-US-0003-02 | removida | critério retirado (estados soltos só sob forçar, por classes de passo; classificador retirado, ADR-0005) |
| CHK-TEST-0003-06 | AC-US-0003-06 | removida | critério retirado (o drift continua pontuando): o drift deixou de existir |
| CHK-TEST-0003-01, -05 | AC-US-0003-01, -05 | modificadas | `NORMAL_DRIVING` é um registro só, a volta do piloto de teste, recontada sobre o traço da volta até o primeiro resultado |
| CHK-TEST-0003-03, -04 | AC-US-0003-03, -04 | modificadas | recuperação na pista aberta, por lado, com acelerador mantido e zerado (REQ-FEAT-0003-09); traseira que não solta é reportada, não reprovada |
| CHK-TEST-0003-07 | AC-US-0003-07 | modificada | campos de `REAR_RECOVERY`, `NORMAL_DRIVING`, `DRIFT_INERT` e `SPEED_CAP` de API-0003 4.0.1 |
| CHK-TEST-0003-08 | NFR-0003 | modificada | paridade sobre os registros novos |
| CHK-TEST-0003-09, -10 | AC-US-0003-08, -10 | acrescentadas | critérios novos |
| CHK-TEST-0004-01 a -06 | AC-US-0003-02 | removidas (arquivo `tests/dirigibilidade-classify.test.ts` e `TEST-0004` removidos) | critério retirado e `classifyHandlingSteps` retirado do código (DES-0001, ADR-0005) |
| CHK-TEST-0001-06 | AC-US-0001-06 | modificada | campos exatos de API-0003 4.0.1 com os da área; saída da área é `TEST_AREA_EXCEEDED` antes de qualquer outro motivo (antes: a saída da faixa não tinha campo nem efeito) |
| CHK-TEST-0005-02 | AC-US-0004-02 | modificada | limiar do critério mudou de ≥ 105 km/h para 65–72 km/h; medido na reta refeita pelo teste |
| CHK-TEST-0005-05 | AC-US-0004-05 | modificada | ensaio sem contato é `MEASUREMENT_MISSING` (API-0003 4.0.1), não `THRESHOLD_EXCEEDED` |
| CHK-TEST-0005-06 | AC-US-0004-07 | modificada | campos da área da reta (`testAreaRadiusM` 1 500) nos registros da pista aberta |
| CHK-TEST-0005-01, -03 | AC-US-0004-01, -03 | modificadas (só o ambiente) | `testPadLane` retirado: a reta roda em `testPadArea(1500)` |
| CHK-TEST-0006-01 | AC-US-0004-06 | modificada | campos de API-0001 2.0.0 (posição e rumo, sem `driftActive`); volta até o primeiro resultado |
| CHK-TEST-0006-02 | AC-US-0003-02 → AC-US-0003-03 | modificada (critério) | a condição de forçar continua; o critério que a usa agora é o da recuperação |
| CHK-TEST-0006-03 | AC-US-0004-05 | modificada | pista aberta `testPadArea(1)`/`(100)` no lugar do arco |
| CHK-TEST-0006-05 | AC-US-0003-08 | acrescentada | sequências dos ensaios da pista aberta com e sem o comando de drift |
| CHK-TEST-0007-02 | AC-US-0005-05 → AC-US-0005-07 | modificada | o texto compartilhado não carrega mais a versão do acerto (SCR-0002 1.2, `DOMAIN/DEC-16`); o critério do texto compartilhado é o 07 |
| CHK-TEST-0007-03 | AC-US-0005-05 | modificada | a tela de resultado não carrega mais `#lap-result-setup` |
| CHK-TEST-0007-05, -06 | AC-US-0003-11, -09 | acrescentadas | critérios novos |
| CHK-TEST-0008-01 | AC-US-0005-04 | modificada | `arcade-assistido-v6`, três versões distinguíveis (v4, v5, v6) e v6 = v5 com os cinco campos de `DOMAIN/DEC-15` |
| CHK-TEST-0008-02, -04, -05 | AC-US-0005-04, -01, -06 | modificadas (só o fim da volta) | laços até o primeiro resultado; CHK-TEST-0008-04 reprovava pelo fixture gravado com v5 e reproduzido com v6 |
| CHK-TEST-0008-03 | AC-US-0005-05 | modificada | linha v5 contra v6 (`SETUP_VERSION_DIFFERS`) |
| CHK-TEST-0008-08 | AC-US-0003-08 | acrescentada | replay da rodada v5 com o comando de drift |
| CHK-TEST-0009-05 | NFR-0001 | modificada | número de registros por ensaio derivado das variantes de API-0003 4.0.1, em vez de uma soma da suíte anterior |
| CHK-TEST-0010-02 | NFR-0002 | modificada | `BASELINE_MISSING` também para texto sem bloco e bloco corrompido |
| CHK-TEST-0010-03 | NFR-0004 | modificada | entradas v4, v6 e Realista, uma por (`setupId`, `setupVersion`, `runtimeId`), parâmetros da pista aberta, nenhum `benchId` ou campo retirado |
| CHK-TEST-0010-04, -06 | NFR-0005, NFR-0008 | modificadas | `testPadArea` e `ARCADE_ASSISTIDO_V6` nas listas de símbolos proibidos |
| CHK-TEST-0010-05 | NFR-0007 | modificada | `ARCADE_ASSISTIDO_V6` entre os registros congelados |
| CHK-TEST-0010-07 | AC-US-0005-06 | modificada | os dezessete ensaios de API-0003 4.0.1 por nome, em vez de "dezesseis" |
| CHK-TEST-0010-08 | AC-US-0003-08 | acrescentada | o passo não chama `advanceManeuvers`/`cancelManeuver` e a telemetria não tem campo de drift |
| demais ids | os mesmos | carregadas | sem mudança |
| `tests/maneuvers.test.ts`: "player-induced drift generates real lateral slip and a useful exit boost" (sem id, anterior ao pipeline) | `requirements/11` (substituído) | removida | o drift pelo passo deixou de existir (`DOMAIN/DEC-15`); retirada nomeada na tabela de migração de `test-strategy.md` 6.0.0 (`tests/maneuvers.test.ts:68-80`); o comportamento oposto (o comando não muda nada) é provado por CHK-TEST-0003-09, CHK-TEST-0006-05 e CHK-TEST-0008-08. As demais verificações do arquivo ficam na janela de compatibilidade de ADR-0006 |

Contagem: 65 antes, 14 removidas, 10 acrescentadas, 61 depois.

### Execução

`npx tsx --test tests/*.test.ts` com os repórteres `junit` (`reports/junit-latest.xml`) e `spec`
(`reports/npm-test-latest.log`): 393 verificações, 386 aprovadas, 7 reprovadas, 0 puladas. As 7 são CHK-TEST-0004-09, -11 a -16 de
`modelo-kart-01` (linha de base chaveada em v5, `98-divergences.md`); nenhuma desta feature.

### Prova de que as verificações podem falhar

As suítes `tests/dirigibilidade-*.test.ts` e `tests/maneuvers.test.ts` (69 testes) rodaram contra uma cópia temporária de `src/`,
`scripts/`, `tests/`, `docs/` e `index.html` no diretório de rascunho da sessão, uma mutação de cada vez; a cópia foi descartada.

| Mutação | Verificações que reprovaram |
|---|---|
| M1 — `governorSpeed` do v6 19,5 → 21,5 (velocidade estabilizada acima de 72 km/h) | CHK-TEST-0003-08, CHK-TEST-0005-02 |
| M2 — `assistLateralG` 2,4 → 1,48 e `friction` 2,1 → 1,57 (aderência do v5) | CHK-TEST-0002-06, -08, -09, -10, -11; CHK-TEST-0008-01, -04, -08; CHK-TEST-0009-01, -02, -03 |
| M3 — `maxSteer` 0,5 → 0,36 | CHK-TEST-0003-01, -05, -08; CHK-TEST-0008-01 |
| M4 — o comando de drift dá 0,2 % de velocidade por passo dentro de `step` | CHK-TEST-0003-07, -08, -09, -10; CHK-TEST-0006-05; CHK-TEST-0008-08 |
| M5 — texto compartilhado com a versão do acerto e "drift 300" | CHK-TEST-0007-02, -05 |
| M6 — `#lap-result-setup` e `.drift-meter` de volta em `index.html` | CHK-TEST-0007-03, -06 |
| M7 — a traseira solta sob forçar (escala 0,05, sem amortecimento) e volta em 133 ms | CHK-TEST-0003-01, -05, -08; CHK-TEST-0008-01, -04, -08; CHK-TEST-0009-01, -02, -03 (o ramo "soltou" de CHK-TEST-0003-03/-04 executa e aprova, como deve) |
| M8 — a traseira solta e não volta a `grip` (rigidez traseira 3, sem amortecimento) | 23, entre elas CHK-TEST-0003-03, -04 e CHK-TEST-0006-02 |
| M9 — `driftActive` de volta na telemetria | CHK-TEST-0006-01, CHK-TEST-0010-08 |
| M10 — área da curva 100 → 120 m nos parâmetros | CHK-TEST-0001-06, CHK-TEST-0002-06, CHK-TEST-0003-07, CHK-TEST-0010-03, -05 |
| M11 — área da reta 1 500 → 1 400 m | CHK-TEST-0005-06, CHK-TEST-0010-03, -05 |
| M12 — `CORNER_TURN` rodado três vezes | CHK-TEST-0002-06, CHK-TEST-0009-05 |
| M13 — `WALL_CONTACT` sem contato julgado `THRESHOLD_EXCEEDED` | CHK-TEST-0005-05 |
| M14 — `src/main.ts` importa `testPadArea` | CHK-TEST-0010-04 |
| M15 — `src/lap.ts` com um símbolo `testPadArea` | CHK-TEST-0010-06 |
| M16 — `STEP_COST` sem linha de base julgado `PASS` | CHK-TEST-0010-02 |
| M17 — a área da pista aberta vira a faixa \|x\| ≤ r | CHK-TEST-0006-03 |
| M18 — `src/physics.ts` importa `advanceManeuvers` | CHK-TEST-0010-08 |
| M19 — `DRIFT_MANEUVER` de volta em `ALL_BENCHES` | CHK-TEST-0010-03, -07 |

Toda verificação acrescentada ou modificada nesta rodada reprovou em pelo menos uma mutação, exceto as que mudaram só o fim da
volta ou o ambiente (CHK-TEST-0005-01, -03; CHK-TEST-0008-02, -05), cuja capacidade de reprovar não mudou e foi provada na rodada
1 (mutações A e C). Primeira tentativa de M1–M8 descartada: o script gravava `src/physics.ts` com fim de linha CRLF, o que
reprovava CHK-TEST-0010-01 por artefato; corrigido e repetido.

### Itens da estratégia aplicados com ajuste, com o motivo

- **`testAreaRadiusM` comparado com o valor da estratégia (100 e 1 500 m), não com `BENCH_PARAMETERS`:** comparar com a constante
  da biblioteca não reprovava a mutação M10; o valor vem de `test-strategy.md` 6.0.0 (AC-US-0001-01, AC-US-0004-01).
- **Raio da trajetória:** além da recomputação pelas posições que a estratégia pede (igual ao campo em 1e-9), o teste lê o raio
  pela direção da velocidade (definição de RULE-0002) e exige as duas ≤ 13 m e concordantes em 5 %, para que o limiar não
  dependa só da fórmula da biblioteca.
- **`SPEED_CAP`:** `maxObservedSpeedMps` é comparado com o máximo sobre os traços que o teste refaz (reta, volta, recuperação,
  raio e giro a 50 km/h), e a volta e a reta com o comando de drift mantido são medidas à parte contra a velocidade estabilizada.
- **Literais de 2026-10-22 de `ARCADE_KART`/`ARCADE_ASSISTIDO_V5` (AC-US-0005-04):** não repetidos campo a campo (seria restatar
  constantes); CHK-TEST-0008-01 afirma a estrutura (v6 = v5 com exatamente cinco campos diferentes) e CHK-TEST-0010-05 o
  congelamento.

### Itens declinados, com o motivo

- **Texto de instrução de drift na tela de boas-vindas (`index.html:19`, `:33`):** não verificado nem reportado como defeito de
  código; fica fora de AC-US-0003-09 (HUD durante a volta e tela de resultado). Registrado em `98-divergences.md`, "Observação
  fora dos critérios", para o dono do produto.
- **Falhas de `modelo-kart-01` (CHK-TEST-0004-09, -11 a -16):** não tocadas; pertencem àquela feature (cerca de escrita, §14).
- **Criação de `docs/handling-device-log.md`:** declinada, como na rodada 1 (escrita só em `tests/` e neste diretório).

## 2026-10-30 — rodada 3, Modo B (seed revisão 6: drift e turbo fora da tela inicial, da dica, do guia e do botão de toque)

### Entrada

- Requisitos do seed revisão 6 (AC-US-0003-12 a -15, `DOMAIN/DEC-17`); D-Spec com `test-strategy.md` 6.1.0 (linhas de
  AC-US-0003-12 a -15, E2E-04) e DES-0009; manifesto de código `01-implementation.md` 3.1.0 (rodadas 5 e 6) e
  `code-validation-20261030-1613` (SUCCESS; DIV-14 devida a este estágio: verificações de AC-US-0003-12 a -15 inexistentes e
  CHK-TEST-0008-03 reprovada); validação anterior deste estágio `test-validation-20261030-1455`.
- Reprovadas antes da rodada (desta feature): CHK-TEST-0008-03 — `replayLap(v4Replay())` dava `NO_RESULT`: as entradas v4
  reproduzidas com o acerto v6 cortam a pista, e desde ADR-0006 de `race-lap-validation` a volta `TRAINING` invalidada por corte
  segue em `RUNNING` até as entradas acabarem (DES-0003: `NO_RESULT` quando os `Input` acabam antes do fim).

### O que foi escrito

- `tests/dirigibilidade-hud-text.test.ts`: CHK-TEST-0007-07 a -10 (AC-US-0003-12 a -15), sobre o texto que a página serve —
  nós de texto e nomes acessíveis de `index.html` (por elemento: `#welcome`, `.toolbar`/`.control-hint`, `.touch-controls`), texto
  gerado por `content:` de `src/style.css`, a lista `data-control` do controle de toque e a tabela de mensagens pt/en de
  `src/lapMessages.ts` — e não sobre nomes de variáveis de `src/main.ts` (atende a direção de ISSUE-02 da validação anterior
  para as verificações novas). Em `src/main.ts` só se leem literais de texto (nenhum literal `'drift'`/`'turbo'` que nomeie um
  controle de toque, nenhum guia).
- `tests/fixtures/records.ts`: `v4Replay()` passa a ser uma volta `OFFICIAL` de `arcade-assistido-v4` (as mesmas entradas do
  `autopilot` gravadas com `ARCADE_KART`, volta válida de 31 388 ms com aquela configuração). A estratégia prescreve, para
  AC-US-0005-05, `replayLap(v4Replay())` dá `SETUP_VERSION_DIFFERS` e, para AC-US-0005-06, `v4Replay()` reproduzido passo a passo
  até o primeiro resultado com o acerto corrente; numa volta oficial o corte encerra a volta com resultado `INVALID` (`CUT`),
  que é o primeiro resultado. Afirmar `NO_RESULT` contrariaria as duas linhas da estratégia e foi descartado.
- `tests/dirigibilidade-setup-version.test.ts`, `tests/dirigibilidade-contract.test.ts`: CHK-TEST-0008-03, -0008-05 e -0010-06
  modificadas (tabela abaixo).
- `TEST-0007` 1.2.0, `TEST-0008` 1.2.0, `TEST-0010` 1.2.0 e `98-divergences.md` 2.1.0 (linhas AC-US-0003-12 a -15 com E2E-04;
  reprovações de outra feature agora de `pista-kart-park`; a "Observação fora dos critérios" sai, coberta pelos critérios novos).
  `00-index.md` e `99-traceability.md` emitidos por `lint_artifacts.py --emit`.
- Nenhum arquivo de `src/`, `scripts/`, `index.html`, `package.json` ou suíte de outra feature foi editado.

### Migração das verificações (inventário antes: 61 ids; depois: 65)

| Id | Critério que decide | Destino | Motivo |
|---|---|---|---|
| CHK-TEST-0007-07, -08, -09, -10 | AC-US-0003-12, -13, -14, -15 | acrescentadas | critérios novos do seed revisão 6 (`DOMAIN/DEC-17`); linha `hud-text` de `test-strategy.md` 6.1.0 |
| CHK-TEST-0008-03 | AC-US-0005-05 | modificada | o replay v4 é uma volta oficial (fixture); a verificação passa a exigir também que, com a configuração v4, o replay reproduza a própria volta válida e `COMPARABLE` (a fixture é de fato uma volta da versão anterior que chega ao fim), que o registro obtido com o acerto corrente leve a versão corrente e que o resultado obtido não seja o gravado (caso anormal de US-0005). A afirmação `SETUP_VERSION_DIFFERS` da estratégia continua; nada foi afrouxado |
| CHK-TEST-0008-05 | AC-US-0005-06 | modificada | exige o primeiro resultado (estratégia: "reproduzido passo a passo até o primeiro resultado"), em vez de "todas as entradas aplicadas ou resultado"; fecha a sugestão de ISSUE-09 da validação anterior |
| CHK-TEST-0010-06 | NFR-0008 | modificada | "exatamente 14 suítes `race-lap-validation-*`" passa a "cada uma das 14 suítes nomeadas presente" e o script `test` de `package.json` roda `tests/*.test.ts` (o que o critério pede: a mesma execução de `npm test` roda as suítes daquela feature); uma 15.ª suíte daquela feature não reprova, uma das 14 removida ou um `npm test` que não as rode reprova |
| demais ids | os mesmos | carregadas | sem mudança |

Contagem: 61 antes, 0 removidas, 4 acrescentadas, 65 depois.

### Execução

`npx tsx --test tests/*.test.ts` com os repórteres `junit` (`reports/junit-latest.xml`) e `spec` (`reports/npm-test-latest.log`):
436 verificações, 427 aprovadas, 9 reprovadas, 0 puladas. As 9 são de `pista-kart-park`: CHK-TEST-0005-01 a -04, -06, -08, -10,
CHK-TEST-0006-03 e CHK-TEST-0007-05; nenhuma desta feature (65 de 65 aprovadas).

### Prova de que as verificações podem falhar

`tests/dirigibilidade-hud-text|setup-version|contract.test.ts` (26 testes) rodaram contra uma cópia de `src/`, `scripts/`,
`tests/`, `docs/`, `index.html` e `package.json` no diretório de rascunho da sessão, uma mutação de cada vez, restaurada em
seguida; base e final 26/26 aprovadas.

| Mutação | Verificações que reprovaram |
|---|---|
| H1 — tela inicial com " · Espaço + curva para drift" | CHK-TEST-0007-07 |
| H2 — dica "Dirigir · Espaço: drift → turbo" | CHK-TEST-0007-07, -08 |
| H3 — só a regra `.maneuver-guide` de volta em `src/style.css` | CHK-TEST-0007-09 |
| H4 — botão `data-control="drift"` "Drift" em `.touch-controls` | CHK-TEST-0007-07, -10 |
| H5 — `src/main.ts` lê o controle de toque `'drift'` | CHK-TEST-0007-10 |
| H6 — `#lap-offer` retirado da tela inicial (tela vazia não passa) | CHK-TEST-0007-07 |
| H7 — mensagem de `src/lapMessages.ts` com "mini-turbo" | CHK-TEST-0007-07 |
| H8 — `replayLap` compara ignorando a versão do acerto | CHK-TEST-0008-03, -08 |
| H9 — corte em volta oficial não encerra a volta (`NO_RESULT`) | CHK-TEST-0008-03, -05 |
| H10 — `replayLap` grava no registro obtido a versão do replay | CHK-TEST-0008-03, -08 |
| H11 — `tests/race-lap-validation-cut.test.ts` removida | CHK-TEST-0010-06 |
| H12 — script `test` restrito a `tests/dirigibilidade-*.test.ts` | CHK-TEST-0010-06 |
| H13 — controle: 15.ª suíte `race-lap-validation-*` acrescentada | nenhuma (o afrouxamento pedido) |

Toda verificação acrescentada ou modificada nesta rodada reprovou em pelo menos uma mutação.

### Itens declinados, com o motivo

- **`#lap-end-training` continua dentro de `.actions` (linha AC-US-0003-13 de `test-strategy.md` 6.1.0):** não afirmado nesta
  rodada, por direção do test-loop (o botão é de `race-lap-validation` e a sua presença não decide nenhum critério desta
  feature: AC-US-0003-13 pede ausência de drift e turbo na dica); a ausência na barra é decidida por CHK-TEST-0007-08 e o botão
  durante o treino é registrado por E2E-04.
- **Padrões da estratégia sobre nomes de `src/main.ts` (`touch.has('drift')`, `drift: keys.has(' ')`, linha AC-US-0003-15):**
  substituídos por afirmações sobre o que a página serve e a lista de controles de toque (nenhum literal `'drift'`/`'turbo'` em
  `src/main.ts`), para não fixar nomes de variáveis (ISSUE-02 da validação anterior); a mutação H5 prova que a forma usada
  reprova a leitura de um controle de drift.
- **ISSUE-01, -03, -04 a -06 e -08 da validação anterior (warning/info):** fora do escopo desta rodada (frozen surface, §16);
  continuam abertas como estavam. ISSUE-07 fica sem objeto (AC-US-0003-12 a -15 agora decidem a tela inicial, a dica, o guia e o
  botão de toque); ISSUE-09 fechada em CHK-TEST-0008-05; ISSUE-10 sem objeto (as reprovações de `modelo-kart-01` não ocorrem
  mais nesta execução).
