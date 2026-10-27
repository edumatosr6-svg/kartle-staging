---
title: Changelog do estágio de testes
feature: dirigibilidade
stage: test
status: validated
version: 1.0.0
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
