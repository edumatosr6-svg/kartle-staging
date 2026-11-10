---
title: Changelog do estágio de testes
feature: apresentacao-e-som
stage: test
status: draft
version: 1.0.0
---

# 97 — Changelog

## 2026-11-10 — rodada 1, Modo A (nenhuma suíte existia para a feature)

### Entrada

- Critérios validados (`req-validation-20261110-1652`): AC-US-0001-01 a -05, AC-US-0002-01 a -07, AC-US-0003-01 a -10,
  AC-US-0004-01 a -06 e NFR-0001 a NFR-0010. F-Spec `fspec-validation-20261110-1714` (API-0001, API-0002, API-0003,
  RULE-0001 a RULE-0003). Estratégia `test-strategy.md` 1.1.0 (`dspec-validation-20261110-1755`).
- Código não commitado sobre `5a0dfb3`, validado em `code-validation-20261110-1822` (SUCCESS).
- Antes da rodada: 477 verificações em `tests/`, 476 aprovadas. A reprovada era CHK-TEST-0008-07 de `pista-kart-park`,
  que chamava `audio.toggle()` (retirado por DES-0003) e afirmava um motor de oscilador triangular.

### Atrito de verificações

Inventário antes de escrever: nenhum `CHK-TEST-*` desta feature existia, e `500 Tests/Output/apresentacao-e-som/` não
existia. Nas outras features, 477 ids em `tests/`. Depois: 562 — os 477 de antes, 476 carregados sem mudança de texto e
1 modificado (tabela "Migração"), mais 85 adicionados por esta feature. Nenhuma verificação retirada, fundida ou
renomeada.

### Migração

| Id | O que mudou | Por que o critério continua coberto |
|---|---|---|
| CHK-TEST-0008-07 (`pista-kart-park`, `tests/pista-kart-park-feedback.test.ts`) | `await audio.toggle()` (duas vezes) → `audio.setSoundOn(true)` e `audio.setSoundOn(false)`; as três afirmações "o motor é um oscilador do tipo `ENGINE_SOUND.source`" → depois de ligar o som nenhum nó `oscillator` e nenhum `filter` foi criado para o motor, e `ENGINE_SOUND.source` é `'recording'`; no nome do teste, "the engine (triangle)" → "the engine (a recording)"; as mensagens "after the first/second toggle" → "after setSoundOn(true)/(false)". 8 linhas trocadas por 8; nada mais no arquivo | AC-US-0005-12 e AC-US-0005-11 de `pista-kart-park`: ficam, sem mudança, as três fontes diferentes entre si, a zebra como única fonte `'noise'`, a repetição da zebra como fonte de buffer por filtro passa-baixa de 160 Hz e ganho, a recompensa só de osciladores do tipo do seu descritor, nenhum nó antes do contexto e nenhum nó da zebra com o som desligado. O motor continua distinto da zebra — agora por não ser sintetizado. A mutação M08 (um oscilador criado ao ligar o som) reprova a verificação migrada |

Aprovação da mudança numa verificação validada de outra feature: **dono do produto, Eduardo Matos, 2026-11-10**,
registrada em `200 Requirements/220 Input/apresentacao-e-som/DOMAIN.md` ("Migração de CHK-TEST-0008-07 aprovada"). A
migração é a única da tabela "Migração de verificação existente" da estratégia. O registro `TEST-0008` de
`pista-kart-park` ainda descreve o motor como triangular: esta etapa não escreve na saída de outra feature (§14), e o
ajuste foi proposto em
`500 Tests/Output/pista-kart-park/reports/feedbacks/apresentacao-e-som/feedback-20261110-1853.md` (FB-01).

CHK-TEST-0011-02 de `pista-kart-park` e CHK-TEST-0013-03 de `race-lap-validation` não foram tocadas e passam com o
código entregue, como a estratégia exige.

### Adicionadas

85 verificações em 5 suítes, listadas uma a uma nos registros `TEST-0001` a `TEST-0005`:

| Registro | Suíte | Verificações |
|---|---|---|
| TEST-0001 | `tests/apresentacao-e-som-decision.test.ts` | CHK-TEST-0001-01 a -19 |
| TEST-0002 | `tests/apresentacao-e-som-sound.test.ts` | CHK-TEST-0002-01 a -20 |
| TEST-0003 | `tests/apresentacao-e-som-lap.test.ts` | CHK-TEST-0003-01 a -13 |
| TEST-0004 | `tests/apresentacao-e-som-page.test.ts` | CHK-TEST-0004-01 a -15 |
| TEST-0005 | `tests/apresentacao-e-som-assets.test.ts` | CHK-TEST-0005-01 a -18 |

Ajudantes novos: `tests/helpers/soundContext.ts` (contextos de áudio de substituição) e `tests/helpers/soundReport.ts`
(a leitura do quadro e os três registros de `npm test`, como DES-0004 pede). Roteiros em aparelho:
`docs/apresentacao-e-som-device-log.md`, com os 13 roteiros E2E-01 a E2E-13 e os campos de resultado vazios — nenhum
executado.

### Ajustes à estratégia, com o motivo

- **Bloco de marca "igual ao texto de antes"** (AC-US-0004-01) e **zebra "igual ao texto anterior"** (NFR-0007): `npm test`
  não lê o git. O texto de antes foi gravado como resumo SHA-256, sobre o commit `5a0dfb3`, do bloco extraído por
  `tyreMarkBlockOf` e de `whiteNoise`, `CURB_SOUND`, do ataque da zebra, de `RaceAudio.curb()` e de
  `src/curbFeedback.ts` (D-TS-03: referência gravada, não valor calculado pelo código sob teste).
- **Limiar de silêncio** (CHK-TEST-0002-01): a verificação usa amostras a metade e ao dobro do limiar. Uma amostra de 32
  bits não representa 0,002 exatamente, e afirmar o comportamento "no limiar" seria afirmar o arredondamento.
- **Além do mínimo da estratégia**: CHK-TEST-0003-08 executa o bloco de marca real de `src/main.ts` (pelo ajudante de
  `modelo-kart-01`) num treino pilotado e confere o pneu quadro a quadro; CHK-TEST-0002-14 cobre o som ligado antes de a
  decodificação terminar (DES-0003, passo 4 de `loadRecordings`); CHK-TEST-0005-18 confere a ordem dos motivos de
  DES-0004. Nenhuma acrescenta superfície: não há configuração, ponto de entrada nem gancho novo.
- **Casos anormais de som indisponível**: registrados sob AC-US-0003-10 e AC-US-0004-06 (a origem da gravação), por serem
  o que a indisponibilidade nega; os requisitos não dão id próprio a casos anormais.

### Execução

- Suíte inteira, fresca, depois da última edição: `npx tsx --test --test-reporter=junit
  --test-reporter-destination=<xml> --test-reporter=spec --test-reporter-destination=stdout tests/*.test.ts`.
  Totais do próprio runner: **562 testes, 562 aprovados, 0 reprovados, 0 pulados**
  (`runs/test-run-20261110-1853.spec.log`, linhas `ℹ`; `runs/test-run-20261110-1853.junit.xml`, 562 `testcase`, 0
  `failure`).
- Registros na saída: `SOUND_DETERMINISM` `PASS` (6.364 passos, 0 ms, 0 ms), `ASSETS_NEUTRAL` `PASS` (6.364 passos, 0 ms,
  0 ms), `SIM_STATE_UNCHANGED` `PASS` (8.797 passos, 0 campos).
- Nível "Build": `npm run build && npm run check:assets` sobre o `dist/` desta árvore (`index-7Ar5m25g.js`):
  `ASSET_BUDGET` `PASS`, `initialDownloadBytes` 411.976, `featureAssetBytes` 224.762, `assetCount` 4,
  `assetsInInitialDownloadCount` 4, `coverWidthPx` 1200, `curbSoundFileCount` 0, `newRuntimeDependencyCount` 0
  (`runs/asset-budget-20261110-1849.json`).
- Roteiros E2E-01 a E2E-13: **não executados** (precisam de navegador real, aparelho e ouvido).

### Prova de que as verificações novas e a migrada podem falhar

22 mutações, cada uma aplicada a uma cópia da árvore fora do repositório (o código do repositório não foi editado), com
as suítes da feature rodadas sobre a cópia: todas reprovaram ao menos uma verificação, com a mensagem do critério
(`reports/mutation-trials-20261110.txt`). As mutações M01 a M22 são citadas na coluna "O que a faria falhar" dos
registros.

Sem mutação que as reprove, por construção: CHK-TEST-0003-09 e -10 (`SOUND_DETERMINISM`, `ASSETS_NEUTRAL`) só reprovam
se o som alterar a simulação por estado global, porque `RaceAudio` recebe a leitura e não a sessão; a forma dos
registros e os motivos `TIME_DIFFERS` e `LAP_NOT_COMPLETED` são exercitados em CHK-TEST-0003-13, e a separação de
camadas em CHK-TEST-0004-14 (M17).

### Itens declinados e observações

- Nenhum item de relatório ou de feedback estava pendente para esta etapa.
- Nenhum defeito de código suspeito: nenhuma verificação reprova contra a implementação validada.
- `reduce_run.py` não foi usado como evidência (o analisador conta errado a saída de `node:test`); a evidência é o JUnit
  XML e as linhas `ℹ` do log.
