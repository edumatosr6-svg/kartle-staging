---
title: Changelog do estágio de testes
feature: race-lap-validation
stage: test
status: draft
version: 1.1.0
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
