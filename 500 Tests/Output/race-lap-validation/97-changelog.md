---
title: Changelog do estágio de testes
feature: race-lap-validation
stage: test
status: validated
version: 1.4.0
---

# 97 — Changelog

## 2026-10-21 — rodada 1, Modo A (nenhuma suíte existia para a feature)

### O que foi escrito

- 14 arquivos de teste em `tests/race-lap-validation-*.test.ts` (138 verificações `CHK-TEST-00nn-nn`, uma por função de
  teste), executados por `npm test` (`node:test` + `node:assert/strict` via `tsx`).
- Helpers em `tests/helpers/` (`autopilot.ts`, `geometry.ts`, `seeded.ts`) e fixtures em `tests/fixtures/`
  (`track-v1.json`, `trackFiles.ts`), fora do glob de `npm test`.
- Registros de teste `TEST-0001` a `TEST-0014` neste diretório; `98-divergences.md`; este changelog. `00-index.md` e
  `99-traceability.md` são emitidos por `lint_artifacts.py --emit`.
- Nenhum arquivo de `src/`, `index.html`, `scripts/` ou `package.json` foi editado.

### Mapeamento dos nomes da estratégia para a diretriz de nomes do estágio

A diretriz do estágio exige `tests/<slug>-*.test.ts`; os nomes da estratégia (`tests/lap-*.test.ts`, `tests/track-data.test.ts`)
foram mapeados um para um:

| Estratégia | Arquivo escrito | Registro |
|---|---|---|
| `lap-timing` | `race-lap-validation-timing.test.ts` | TEST-0001 |
| `lap-crossing` | `race-lap-validation-crossing.test.ts` | TEST-0002 |
| `frame-clock` | `race-lap-validation-frame-clock.test.ts` | TEST-0003 |
| `lap-state` | `race-lap-validation-state.test.ts` | TEST-0004 |
| `lap-validity` | `race-lap-validation-validity.test.ts` | TEST-0005 |
| `lap-cut` | `race-lap-validation-cut.test.ts` | TEST-0006 |
| `lap-kinds` | `race-lap-validation-kinds.test.ts` | TEST-0007 |
| `lap-determinism` | `race-lap-validation-determinism.test.ts` | TEST-0008 |
| `track-data` | `race-lap-validation-track-data.test.ts` | TEST-0009 |
| `lap-messages` | `race-lap-validation-messages.test.ts` | TEST-0010 |
| `lap-hud-css` | `race-lap-validation-hud-css.test.ts` | TEST-0011 |
| `lap-contract` | `race-lap-validation-contract.test.ts` | TEST-0012 |
| `lap-layering` | `race-lap-validation-layering.test.ts` | TEST-0013 |
| `lap-frozen` | `race-lap-validation-frozen.test.ts` | TEST-0014 |

### Migração de verificações existentes

Inventário antes da escrita: nenhum id `CHK-*` em `tests/` nem em `99-traceability.md` (o estágio não existia para a
feature). `tests/physics.test.ts` e `tests/maneuvers.test.ts` não foram modificados nem duplicados. Nada a migrar.

### Prova de que as verificações podem falhar

Além da linha "o que a faria falhar" em cada `TEST-*`, a suíte foi executada contra uma cópia temporária do código fora
do repositório com quatro mutações (fração 1 tratada como interior ao passo; `>=` no limite de corte; `pt-BR` não reduzido
a `pt`; marcador contado em qualquer sentido): 9 verificações falharam, as previstas (CHK-TEST-0001-05, -07, -08,
CHK-TEST-0005-16, CHK-TEST-0006-01, -02, -05, -09, CHK-TEST-0010-14), e 129 passaram. A cópia foi descartada.

### Itens declinados, com o motivo

- **Fixture da estratégia para AC-US-0004-06 (excursão lateral dirigida de 10,5 m em torno do marcador 2, menos de 120
  passos além de 3 m):** declinada. Medido com o autopilot em janelas de 1 a 12 índices e amplitudes de 9,5 a 12 m: ou a
  excursão é curta demais e o marcador (alcance ±9 m) é cruzado (VALID), ou o kart passa 121 passos seguidos além de 3 m
  e a volta termina em CUT antes da chegada — na pista sintética publicada o alcance do marcador (9 m) excede a borda mais o
  limite de corte (5,5 m + 3 m), e o retorno pela grama leva mais de 1 s. Substituída por um salto semeado (`seedLap`)
  do kart para depois do marcador 2 com `markersPassedCount` 1, seguido da pilotagem até a chegada (CHK-TEST-0005-11).
  Observação para a próxima rodada da especificação: na pista publicada, pular um marcador sem cortar não é alcançável
  pela pilotagem; a regra continua provada pelo salto semeado e por `withShortMarker(2)`.
- **Fixture "deslocamento constante de 2 m além da borda por 600 passos" (AC-US-0006-03):** ajustada. Com 2 m além da
  borda (7,5 m da linha central) o autopilot ultrapassa 3 m nas curvas (máximo medido 3,92 m à esquerda e 5,28 m à
  direita, com CUT). Usado 1,5 m além da borda (`autopilot(-7)`, máximo medido 2,62 m, 77 % dos passos na grama), com o
  oráculo do teste afirmando o máximo ≤ 3 m, mais um kart parado a exatamente 2 m além da borda por 600 passos
  (CHK-TEST-0006-03 e -04).
- **Criação de `docs/lap-validation-device-log.md` e de árvores de E2E:** declinada. O estágio escreve só em `tests/` e em
  `500 Tests/Output/<feature>/` (conventions §14); não há ferramenta de E2E e nenhuma dependência foi acrescentada. Os
  critérios cuja parte de tela, aparelho ou navegador depende do roteiro `E2E-01` a `E2E-11` estão em `98-divergences.md`
  como `unverified`, à espera do registro humano.
- **Verificações de acesso não autenticado e de papel recusado (política de segurança do skill):** não aplicáveis. Os
  contratos API-0001 a API-0003 não têm endpoint de rede, sessão nem papel além de `player` anônimo (I6, RNF10); não há
  webhook. Registrado em TEST-0012.
- **NFR-0003 e NFR-0008 sem verificação em `npm test`:** não há verificação determinística possível para taxa de quadros em
  aparelho nem para igualdade entre navegadores num único runtime (I9); ambos ficam em `98-divergences.md` com os roteiros
  E2E-10 e E2E-11. A sequência de entradas para E2E-11 é a `reference.inputs` de TEST-0008.
- **NFR-0011 (benchmarks):** não reexecutados neste estágio; o registro antes/depois com 0 linhas diferentes já está em
  `docs/lap-validation-bench.md` pela etapa de código. TEST-0014 prova que os presets e o passo seguem literalmente iguais.

## 2026-10-22 — rodada 2, Modo C (feedback de `pista-kart-park`, FB-01)

### Entrada

- Feedback `300 Specs/330 D-Specs/Output/race-lap-validation/reports/feedbacks/pista-kart-park/feedback-20261022-1614.md`,
  item FB-01 (severidade `scope`): `pista-kart-park` sobe `TRACK_SCHEMA_VERSION` de 2 para 3 com o seu leitor, e
  CHK-TEST-0009-02 e CHK-TEST-0009-03 afirmavam os literais `2` e `3`, de modo que reprovariam quando o leitor da versão 3
  entrasse. Aceito pela etapa de projeto desta feature na sua rodada 3 de 2026-10-22: `core/DES-0006` 1.1.0 e
  `test-strategy.md` 1.1.1 (validados em `dspec-validation-20261022-1754`) declaram a prova do NFR-0012 sem literal de
  versão de esquema — versão declarada maior que a anterior; `TRACK_SCHEMA_VERSION + 1` é `UNSUPPORTED_SCHEMA` com o
  objeto de entrada intacto — e levam o ajuste dos dois checks a esta etapa.
- Nenhum relatório FAIL TEST pendente e nenhum Root Cause Report: a rodada trata só o item do feedback.

### O que mudou

- `tests/race-lap-validation-track-data.test.ts`: CHK-TEST-0009-02 deriva a "versão anterior" da `schemaVersion` da
  fixture da forma anterior (`tests/fixtures/track-v1.json`) e a versão corrente da constante `TRACK_SCHEMA_VERSION`
  exportada por `src/trackData.ts`, afirmando que a corrente é inteira e maior que a anterior e que o arquivo sintético
  a declara; deixa de fixar `TRACK_SCHEMA_VERSION === 2`. CHK-TEST-0009-03 deriva a versão posterior como
  `TRACK_SCHEMA_VERSION + 1` e afirma `UNSUPPORTED_SCHEMA` devolvido com essa `schemaVersion` e objeto de entrada
  idêntico ao instantâneo tirado antes da leitura; deixa de usar o literal `3`. Ids, nomes (comportamento) e mensagens
  de falha com o id do critério (NFR-0012) mantidos.
- `TEST-0009-dado-de-pista.md` 1.1.0: linha de fixtures e as linhas "o que a faria falhar" dos dois checks reescritas
  nos mesmos termos.
- Nenhum outro arquivo de `tests/` (fixtures e helpers inclusive), nenhum outro registro `TEST-*`, `98-divergences.md`
  intacto; nada em `src/`, `index.html`, `scripts/` ou `package.json`. `00-index.md` e `99-traceability.md` reemitidos
  por `lint_artifacts.py --emit`.

### Migração de verificações existentes

Inventário antes da escrita: 138 ids `CHK-TEST-*` em `tests/race-lap-validation-*.test.ts` e os mesmos 138 em
`99-traceability.md` (`tests/physics.test.ts` e `tests/maneuvers.test.ts` não carregam ids desta feature e não foram
tocados). Depois: 136 carregados sem mudança, 2 modificados, nenhum fundido, nenhum removido.

| Check | Resultado | O que mudou | Por que o critério continua coberto |
|---|---|---|---|
| CHK-TEST-0009-02 | modificado | `assert.equal(TRACK_SCHEMA_VERSION, 2, …)` substituído por `TRACK_SCHEMA_VERSION` inteira e maior que a `schemaVersion` lida de `track-v1.json`; a asserção de que `SYNTHETIC_TRACK_FILE.schemaVersion` é igual à constante fica como estava | NFR-0012 pede versão declarada maior que a anterior, não um valor fixo; a prova decide exatamente isso e reprova se a constante não for incrementada acima da forma anterior ou se o arquivo publicado declarar outra versão |
| CHK-TEST-0009-03 | modificado | `schemaVersion: 3` e `{…, schemaVersion: 3}` esperados substituídos por `TRACK_SCHEMA_VERSION + 1`, nos dois lados da asserção e na mensagem | NFR-0012 pede que uma versão acima da conhecida seja `UNSUPPORTED_SCHEMA`, devolvida com essa versão, sem alterar o arquivo; a prova decide o mesmo critério para qualquer valor da constante e reprova se a versão posterior for lida como válida, devolvida com outra versão ou se o objeto mudar |

### Prova de que as verificações modificadas podem falhar

CHK-TEST-0009-02 reprova se `TRACK_SCHEMA_VERSION` descer a 1 (igual à forma anterior) ou se `SYNTHETIC_TRACK_FILE`
declarar outra versão; CHK-TEST-0009-03 reprova se `readTrackData` aceitar `TRACK_SCHEMA_VERSION + 1` como
`COMPLETE`/`INCOMPLETE`, se devolver outra `schemaVersion` ou se alterar o objeto recebido. Quando `pista-kart-park`
subir a constante para 3 junto com o seu leitor, as duas provas decidem os mesmos critérios com 3 e 4, sem edição.

### Itens declinados, com o motivo

- Nenhum. O único item da rodada (FB-01 de `pista-kart-park`) foi aplicado integralmente.

## 2026-10-27 — rodada 3, Modo B (relatório `test-validation-20261022-1827`, ISSUE-08)

### Entrada

- Relatório FAIL TEST `reports/test-validation/test-validation-20261022-1827.md`: um único `error`, ISSUE-08 — a estratégia
  1.1.1 (nível "Contrato de API", linha 29, e fixture da linha 42) atribui a `lap-contract` a prova de que `setupId` e
  `setupVersion` (API-0001 1.1.0 e API-0002 1.1.0, FB-01 de `dirigibilidade`) estão no resultado exatamente quando o pedido
  `startLap` os trouxe, copiados sem interpretação, e ausentes quando não; nenhuma verificação da suíte os mencionava.
- Árvore de código no momento da rodada: `src/lap.ts` já declara `setupId?`/`setupVersion?` em `LapRequest`, `LapSession`
  e `LapResult` e os copia literalmente (`code-loop` de `race-lap-validation` posterior ao relatório); as verificações
  novas são escritas a partir dos contratos e da estratégia, não do código (D-TS-03), e passam na árvore corrente.

### O que mudou

- `tests/race-lap-validation-contract.test.ts`: duas verificações novas, uma por comportamento, sob TEST-0012, ambas
  decidindo NFR-0005 (a estratégia 1.1.1 atribui a `lap-contract` "chaves do resultado são exatamente as de API-0001") e
  nomeando API-0001/API-0002 na mensagem de falha:
  - CHK-TEST-0012-12 — `startLap` com `setupId` `REALISTA_ALUGUEL_4T` (literal do enum, diferente do padrão) e
    `setupVersion` `contract-fixture-7.3.1` (texto que só existe no teste), volta completa pelo `autopilot`; `getLapResult`
    devolve os dois valores exatamente iguais aos do pedido e o conjunto de chaves é exatamente o do contrato mais os dois
    campos.
  - CHK-TEST-0012-13 — o mesmo pedido sem os campos: `'setupId' in result` e `'setupVersion' in result` falsos (ausentes,
    não `null` nem padrão) e volta idêntica em validade, motivo, tempo total e setores à volta iniciada com os campos.
  - Constante de fixture `SETUP_FIELDS` e importação de `MAX_LAP_STEPS` do helper existente. Nenhuma outra linha do arquivo
    mudou; nenhum outro arquivo de `tests/` (fixtures e helpers inclusive) foi tocado.
- `TEST-0012-contrato-da-volta.md` 1.1.0: linha de fixtures e as duas linhas novas na tabela de verificações.
- Nada em `src/`, `index.html`, `scripts/` ou `package.json`; `98-divergences.md` intacto. `00-index.md` e
  `99-traceability.md` reemitidos por `lint_artifacts.py --emit`.

### Superfície da rodada

As duas verificações não acrescentam requisito, campo, parâmetro nem chave (conventions §16): `setupId` e `setupVersion`
já constam de API-0001 1.1.0 e API-0002 1.1.0 (F-Spec validada), de DES-0001 1.1.0 e DM-0002 1.1.0, e da estratégia
1.1.1 validada em `dspec-validation-20261022-1754`; a adição é a cobertura exigida pelo upstream movido, como o próprio
ISSUE-08 pede que seja registrada, e não superfície nova de rodada de correção.

### Migração de verificações existentes

Inventário antes da escrita: 138 ids `CHK-TEST-*` em `tests/race-lap-validation-*.test.ts`, os mesmos 138 em
`99-traceability.md` e no `junit-latest.xml` da rodada 2. Depois: 138 carregados sem mudança, 0 modificados, 0 fundidos,
0 removidos, 2 acrescentados (CHK-TEST-0012-12, CHK-TEST-0012-13) — 140 no total.

### Prova de que as verificações novas podem falhar

CHK-TEST-0012-12 reprova se `startLap` ou `buildResult` deixar de copiar um dos campos, se copiar um valor derivado ou
normalizado (o padrão `ARCADE_ASSISTIDO`, a `setupVersion` publicada `realista-aluguel-4t-v4` ou qualquer outro texto) ou
se o resultado trouxer um campo além dos contratados. CHK-TEST-0012-13 reprova se um pedido sem os campos produzir
resultado com a chave presente (`null`, `undefined` ou valor padrão), ou se a presença dos campos alterar validade,
motivo, tempo ou setores da volta. Nenhuma das duas lê o relógio, compara ponto flutuante (tempos inteiros em ms) nem
depende de ordem.

### Itens declinados, com o motivo

- Nenhum item declinado: ISSUE-08, único `error` do relatório, foi aplicado integralmente.
- Itens de severidade `warning` e `info` mantidos do relatório (ISSUE-01 a ISSUE-07, ISSUE-09 e ISSUE-10), sem ação nesta
  rodada por instrução do loop, que a abriu só para o `error`: ISSUE-01 (asserção `toString()` em CHK-TEST-0012-07) e
  ISSUE-02 (igualdade exata em valores exigidos pela especificação) continuam abertos como `warning` para uma rodada que
  toque esses arquivos; ISSUE-03, -04, -05, -07, -09 e -10 têm "nenhuma ação" como esperado no próprio relatório; ISSUE-06
  (reconciliação de `98-divergences.md` com `docs/lap-validation-device-log.md`) depende do dono do registro humano e fica
  aberto.

## 2026-10-27 — rodada 4, Modo B (verificação reprovada por mudança de projeto de `pista-kart-park`, CHK-TEST-0009-02)

### Entrada

- `400 Code/Output/pista-kart-park/98-divergences.md`, linha de CHK-TEST-0009-02: a segunda asserção exigia
  `SYNTHETIC_TRACK_FILE.schemaVersion === TRACK_SCHEMA_VERSION`; o projeto validado daquela feature (ADR-0001, decisão 2;
  REQ-FEAT-0002-15) sobe `TRACK_SCHEMA_VERSION` a 3 em `src/trackData.ts:11` e mantém a pista sintética em 2
  (`src/track.ts:43`), que o leitor continua a ler (`src/trackData.ts:145`: só `schemaVersion` acima da constante é
  `UNSUPPORTED_SCHEMA`; 1, 2 e 3 são lidos). A previsão estava em `01-architecture.md` daquela feature, "Consequências para
  outras features".
- D-Spec desta feature (DES-0006 1.1.0, estratégia 1.1.1, DM-0001 1.0.1, ADR-0003 1.0.1), alinhado em 2026-10-22 a "sem
  literal de versão": a constante é "a maior versão que o leitor conhece"; `TRACK_SCHEMA_VERSION + 1` é a versão
  posterior. A sua frase "sintético igual a `TRACK_SCHEMA_VERSION`" conflita com o projeto validado da outra feature:
  registrada em `98-divergences.md` como divergência entre especificações, resolvida aqui pela regra de NFR-0012.

### O que mudou

- `tests/race-lap-validation-track-data.test.ts`, CHK-TEST-0009-02 (único bloco tocado): título e asserções passam a
  afirmar (1) `TRACK_SCHEMA_VERSION` inteira e maior que a `schemaVersion` lida de `track-v1.json` (como estava);
  (2) `SYNTHETIC_TRACK_FILE.schemaVersion` inteira, maior que a da forma anterior e não maior que `TRACK_SCHEMA_VERSION`;
  (3) `readTrackData(syntheticFile()).trackDataStatus` é `COMPLETE` ou `INCOMPLETE`: o sintético é lido, nunca
  `UNSUPPORTED_SCHEMA` nem `UNREADABLE`. Nenhum literal de versão. Nenhuma outra linha do arquivo, fixture ou helper mudou;
  CHK-TEST-0009-03 continua com `TRACK_SCHEMA_VERSION + 1`.
- `TEST-0009-dado-de-pista.md` 1.2.0: linha de fixtures e linha de CHK-TEST-0009-02 na tabela de verificações.
- `98-divergences.md` 1.1.0: seção nova com a divergência entre especificações e a sua resolução.
- Nada em `src/`, `index.html`, `scripts/` ou `package.json`. `00-index.md` e `99-traceability.md` reemitidos por
  `lint_artifacts.py --emit`.

### Superfície da rodada

Nenhum requisito, campo, parâmetro ou chave acrescentado (conventions §16): a verificação decide o mesmo NFR-0012 com
a mesma interface (`TRACK_SCHEMA_VERSION`, `readTrackData`, `SYNTHETIC_TRACK_FILE`) já listada no registro.

### Migração de verificações existentes

140 ids `CHK-TEST-*` antes, 140 depois: 139 carregados sem mudança, 1 modificado (CHK-TEST-0009-02), 0 fundidos,
0 removidos, 0 acrescentados.

### Prova de que a verificação modificada pode falhar

CHK-TEST-0009-02 reprova se `TRACK_SCHEMA_VERSION` descer até a versão da forma anterior; se `SYNTHETIC_TRACK_FILE`
declarar versão igual ou inferior à forma anterior (1) ou superior à que o leitor conhece (`TRACK_SCHEMA_VERSION + 1`
ou mais); ou se o leitor rejeitar o sintético (`UNSUPPORTED_SCHEMA`, `UNREADABLE`). Não baixa o critério: NFR-0012
pede versão declarada maior que a anterior e versão desconhecida intacta; a igualdade com a constante era um literal
disfarçado (a constante da outra feature), não uma exigência do critério.

### Itens declinados, com o motivo

- Reescrever a pista sintética (`src/track.ts`) para a versão 3, restaurando a igualdade: recusado; é dado de
  `pista-kart-park` e este estágio não edita `src/` (skill, "Never edit <source>").
- Editar DES-0006 / `test-strategy.md` desta feature para a frase "na faixa aceita": recusado neste estágio (fora do
  write fence, conventions §14); registrado em `98-divergences.md` para a próxima rodada do D-Spec.
- CHK-TEST-0004-13 (`modelo-kart-01`, mesma tabela da divergência de origem): não é desta feature; fica com a etapa de
  testes de `modelo-kart-01`.

## 2026-10-30 — rodada 5, Modo B (mudança de projeto: treino de voltas seguidas, seed rev 3)

### Entrada

- Requisitos validados contra o seed rev 3: US-0010 1.1.2 (27 critérios, `DOMAIN/DEC-12`, `DOMAIN/DEC-13`), US-0007
  2.1.2 (AC-US-0007-06 mede o tempo desde o início da volta, que no treino é o cruzamento que a iniciou), US-0008 2.3.3
  (AC-US-0008-04 oferece "o treino"; AC-US-0008-05 em cada volta do treino concluída na chegada).
- D-Spec 1.2.x: ADR-0006, DES-0001, DES-0003, DES-0004, DES-0008 1.1.0 (24 chaves), DM-0002 1.2.0, API-0001/API-0002
  1.2.0, `test-strategy.md` 1.2.1 (área `lap-training`; linha NFR-0007 com as 24 chaves; requisitos sem critério próprio
  REQ-FEAT-0010-28 a -32 e REQ-FEAT-0009-11).
- `400 Code/Output/race-lap-validation/reports/code-validation/code-validation-20261030-1526.md` (SUCCESS): 13
  reprovações de teste que supõe o treino de volta única; desta feature, CHK-TEST-0012-01, CHK-TEST-0010-17 e
  CHK-TEST-0007-10.

### Atrito de verificações (inventário antes da escrita)

140 ids `CHK-TEST-*` em `tests/race-lap-validation-*.test.ts`, os mesmos 140 da rodada 4 (`99-traceability.md` e
`junit-latest.xml` de 2026-10-27): nenhuma verificação sumiu entre as rodadas.

### O que mudou

- Modificadas (três, as reprovadas pela mudança de projeto):
  - CHK-TEST-0012-01 (`contract`): `STATE_KEYS` ganha `lapSequenceCount` e `lapStartMs` (obrigatórios em API-0001
    1.2.0), `STATE_OPTIONAL` ganha `bestValidLapMs`; nova asserção: fora do treino, em `COUNTDOWN`, `RUNNING` e `ENDED`,
    `lapSequenceCount` 1, `lapStartMs` 0 e `bestValidLapMs` ausente. Continua decidindo AC-US-0009-01.
  - CHK-TEST-0010-17 (`messages`): 20 → 24 chaves (DES-0008 1.1.0), com `pauseAction`, `endTrainingAction`,
    `bestValidLap` e `sectorNoTime` nomeadas; tradução real exigida em 22 das 24 (antes 18 de 20; `sectorNoTime` é "—"
    nos dois idiomas por projeto). Continua decidindo NFR-0007.
  - CHK-TEST-0007-10 (`kinds`): a volta de treino não termina mais no corte (DES-0004, ADR-0006), então o resultado em
    dado `INCOMPLETE` vem das voltas concluídas na chegada, como a estratégia manda: cópia sem `markers` e cópia sem
    `sectorLimits` (as duas declaram chegada e sentido), duas voltas do `autopilot()` em cada, `official` falso em todo
    resultado e `trackVersion` da leitura. `track-v1.json` não declara chegada e não produz resultado no treino (US-0008,
    casos anormais). Continua decidindo AC-US-0008-05.
- Acrescentadas (39):
  - CHK-TEST-0015-01 a -28 (TEST-0015, novo registro), um por critério novo ou mudado de US-0010 e AC-US-0007-06, mais
    REQ-FEAT-0010-28 (contramão, -09), -29 (motivo único, -26), -30 (encerrar em pausa e contagem, -17) e -32 (melhor
    volta não guardada, -27), e o determinismo do treino (NFR-0001, NFR-0009, -28).
  - CHK-TEST-0012-14 a -17 (`contract`): campos de treino no resultado, precedência `NO_ACTIVE_LAP` → `NOT_TRAINING` →
    `LAP_ENDED` → `ALREADY_PAUSED` de `endTraining` e `PAUSE_BUTTON`, aceitação de `endTraining` em contagem, corrida e
    pausa, e `listLapResults` fora do treino.
  - CHK-TEST-0010-19 a -24 (`messages`): `describeTrainingResult` (total, validade, motivo, "não oficial", "—", sem
    linha de setores), ausência de contagem e de sinal verde no treino, textos do treino cortado e da volta seguinte,
    rótulos `pauseAction`, `endTrainingAction` e `bestValidLap`; textos esperados da tabela de DES-0008.
  - CHK-TEST-0013-05 (`layering`): `src/lap.ts`, `src/lapMessages.ts` e `src/main.ts` sem `localStorage`,
    `sessionStorage`, `indexedDB` e `document.cookie` (REQ-FEAT-0009-11, -0010-31, -0010-32; CHK-TEST-0013-03 não
    olhava `document.cookie`).
- Fixture local de linha de base: `messages` ganha `lapSequenceCount: 1` e `lapStartMs: 0` na `LapStateView` literal
  (forma de API-0001 1.2.0); nenhuma asserção existente mudou.
- Registros: TEST-0015 1.0.0 (novo), TEST-0012 1.2.0, TEST-0010 1.1.0, TEST-0007 1.1.0, TEST-0013 1.1.0, TEST-0004
  1.0.1 (nota de hospedagem), `98-divergences.md` 1.2.0. Helpers e fixtures compartilhados intocados; `withoutSectors()`
  é local aos arquivos que a usam. Nada em `src/`, `scripts/`, `index.html`. `00-index.md` e `99-traceability.md`
  reemitidos por `lint_artifacts.py --emit`.

### Medição da simulação (autopilot sobre a pista sintética, treino)

- Três chegadas do `autopilot()`: passos k 3766, 7350, 10953; instantes `interpolateMs` 31 388, 61 251 e 91 277 ms;
  voltas de 31 388, 29 863 e 30 026 ms, todas `VALID`; velocidade logo depois de cada chegada ≈ 12,2 a 12,5 m/s; fase
  `RUNNING` o tempo todo.
- Corte por `DRIVE_OUT` no treino: invalidação no passo 567, fase `RUNNING`, kart a 7,7 m/s no passo seguinte. Kart
  parado 10,5 m à direita do índice 10: `CUT` 121 passos depois, como o oráculo.
- Corte semeado, reposicionamento e `autopilot()` até a chegada: resultado `INVALID` `CUT` de 31 790 ms, volta 2 com
  `lapStartMs` 31 790, `VALID`, 0 marcadores.
- Salto depois do limite 1 (passo 1089) para 5 segmentos além do limite 2 (índice 120): `INVALID` `MISSED_MARKER`,
  `trainingSectorMs` `[9068, null, null, 6475]`.
- `withShortMarker(2)`: `autopilot(-4)` dá `VALID` (30 322 ms); `autopilot(4)` dá `MISSED_MARKER` (desvio de sinal da
  estratégia, `98-divergences.md`).
- Sem `sectorLimits`: leitura `INCOMPLETE` com chegada e sentido; volta `VALID` de 31 388 ms com `lapMs` e
  `trainingLapMs`, sem `sectorMs` nem `trainingSectorMs`.

### Prova de que as verificações novas e modificadas podem falhar

Mutações aplicadas, uma por vez, a uma cópia de `src/` e `tests/` no diretório de rascunho (nunca à árvore); executados
os arquivos indicados; a árvore real nunca foi alterada.

| Mutação | Mudança na cópia | Verificações que reprovaram |
|---|---|---|
| M01 | `closeTrainingLap`: `lapStartMs: finishMs + 1` | CHK-TEST-0015-01, -02, -03, -06, -11, -12, -20 |
| M02 | chegada do treino encerra como a oficial | CHK-TEST-0007-10, CHK-TEST-0015-01 a -06, -08, -09, -11 a -20, -23, -24, -26, -27 |
| M03 | corte do treino encerra a volta | CHK-TEST-0015-10, -11, -13, -15, -19, -24, -26 |
| M04 | melhor volta conta voltas inválidas | CHK-TEST-0015-14, -27 |
| M05 | melhor volta mantida depois de `ENDED` | CHK-TEST-0015-27 |
| M06 | volta seguinte herda validade e motivo | CHK-TEST-0015-13 |
| M07 | `endTraining` conclui a volta em andamento | CHK-TEST-0012-16, CHK-TEST-0015-17, -18 |
| M08 | `LAP_ENDED` antes de `NOT_TRAINING` no botão de pausa | CHK-TEST-0012-15 |
| M09 | `trainingSectorMs` sempre presente | CHK-TEST-0012-14, CHK-TEST-0015-25 |
| M10 | reposicionar revalida a volta cortada | CHK-TEST-0015-11, -13, -19, -24 |
| M11 | resultado de treino oficial | CHK-TEST-0015-07 |
| M12 | `sectorNoTime` "-" | CHK-TEST-0010-20, CHK-TEST-0015-23 |
| M13 | `lapSequenceCount` não avança | CHK-TEST-0015-01, -04, -11, -20 |
| M14 | `getLapState` sem `lapStartMs` | CHK-TEST-0012-01 |
| M15 | chegada na contramão fecha volta | CHK-TEST-0015-09 |
| M16 | `src/main.ts` grava `document.cookie` | CHK-TEST-0013-05 |
| M17 | kart da volta oficial anda depois de `ENDED` | CHK-TEST-0015-22 |
| M18 | `elapsedMs` sem descontar `lapStartMs` | CHK-TEST-0015-20 |
| M19 | resultado em dado `INCOMPLETE` oficial | CHK-TEST-0007-10 |
| M20 | volta cortada fecha como `MISSED_MARKER` | CHK-TEST-0015-26 |
| M21 | `endTraining` recusado na contagem | CHK-TEST-0012-16, CHK-TEST-0015-17 |
| M22 | contagem regressiva depois de cada chegada do treino | CHK-TEST-0015-01, -04, -05, -06, -08, -09, -12, -14, -15, -19, -20 |
| M23 | setor sem tempo vira 0 | CHK-TEST-0015-23 |
| M24 | chave `sectorNoTime` removida | CHK-TEST-0010-17, -20 |
| M25 | `endTrainingAction` sem tradução | CHK-TEST-0010-24 |
| M26 | volta oficial encerrada segue andando e fechando voltas | CHK-TEST-0015-21, -22 |
| M27 | resultado do treino depende de um contador fora da sessão | CHK-TEST-0015-11, -12, -28 |
| M28 | `listLapResults` vazio fora do treino | CHK-TEST-0012-17 |
| M29 | resultado válido do treino lido "válida em andamento" | CHK-TEST-0010-19, -21 |
| M30 | linha de setores montada sem `trainingSectorMs` | CHK-TEST-0010-21, CHK-TEST-0015-25 |
| M31 | sinal verde no início de cada volta do treino | CHK-TEST-0010-22 |
| M32 | motivo omitido no treino | CHK-TEST-0010-23, CHK-TEST-0015-10 |

Toda verificação acrescentada ou modificada reprovou em ao menos uma mutação. Nenhuma lê o relógio de parede, compara
ponto flutuante por igualdade (tempos inteiros em ms; `kart` comparado por `deepEqual` só onde o projeto exige estado
inalterado) nem depende de ordem entre testes: as corridas compartilhadas (três voltas, corte até a chegada, salto) são
memorizadas e imutáveis.

### Migração de verificações existentes

140 ids antes, 179 depois: 137 carregados sem mudança, 3 modificados (CHK-TEST-0012-01, CHK-TEST-0010-17,
CHK-TEST-0007-10, tabela acima), 0 fundidos, 0 removidos (retirados: 0), 39 acrescentados.

### Execução

`npx tsx --test` sobre `tests/*.test.ts`: 432 testes, 422 aprovados, 10 reprovados, todos de outras features e listados
pelo relatório de código como teste que supõe a volta de treino única: `pista-kart-park` CHK-TEST-0005-01, -02, -03,
-04, -06, -08, -10, CHK-TEST-0007-05, CHK-TEST-0006-03, e `dirigibilidade` CHK-TEST-0008-03. Todas as 179 verificações
desta feature aprovadas.

### Itens declinados, com o motivo

- Arquivo próprio `tests/race-lap-validation-training.test.ts` para a área `lap-training`: escrito e medido, depois
  desfeito; o 15.º arquivo reprova CHK-TEST-0010-06 de `dirigibilidade` (contagem exata de 14 suítes), suíte de outra
  feature fora deste write fence. As 28 verificações ficam num bloco próprio de `race-lap-validation-state.test.ts`;
  registrado em `98-divergences.md` com quem deve.
- Corrigir CHK-TEST-0005-*, CHK-TEST-0006-03 e CHK-TEST-0007-05 de `pista-kart-park` e CHK-TEST-0008-03 de
  `dirigibilidade`: recusado; são suítes de outras features (etapa de testes de cada uma).
- `autopilot(-4)` da estratégia para AC-US-0010-10: substituído por `autopilot(4)` pela medição;
  `98-divergences.md`.
- Novo `withoutSectors()` em `tests/fixtures/trackFiles.ts`: não escrito; o arquivo é compartilhado com outras features
  e está fora do write fence desta rodada; a cópia é montada no próprio arquivo de teste (regra "fixture usada por um
  arquivo fica nele").
- Partes de tela e de aparelho de AC-US-0010-02, -04, -07, -11, -12, -15, -16, -19, -23 a -25 e -27: ficam em E2E-12 e
  E2E-13 (roteiro registrado), linhas `unverified` em `98-divergences.md`.
