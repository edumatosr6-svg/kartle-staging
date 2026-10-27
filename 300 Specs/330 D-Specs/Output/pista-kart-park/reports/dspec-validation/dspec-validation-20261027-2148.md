---
stage: dspec
feature: pista-kart-park
verdict: SUCCESS
generated: 2026-10-27T21:48:53Z
counts: {blocker: 0, error: 0, warning: 0, info: 2, divergence: 13}
seed: {revision: 1, digest: b5aa5be4734a}
upstream: {stage: fspec, version: 1.0.1}
feedbacks: []
feedbacks-pending: []
previous: "dspec-validation-20261022-1631.md (SUCCESS, 0/0/0/0, 1 scope); ISSUE-01 (scope, TRACK_SCHEMA_VERSION 2 em race-lap-validation) reverificado e fechado pela própria race-lap-validation (core/DES-0006 1.1.0 daquele conjunto exporta a constante; tests/race-lap-validation-track-data.test.ts CHK-TEST-0009-02/-03 reescritos sem literal; src/trackData.ts:11 TRACK_SCHEMA_VERSION 3)"
population: "revalidação (§8) depois da rodada 3 (Mode C, reports/feedback/feedback-20261027-2125.md, SPEC-ISSUE-01 a -03): a issue do relatório anterior; os arquivos com version movida (01-architecture.md 1.0.2, 97-changelog.md 1.2.0, adr/ADR-0006 1.1.0, core/DES-0002 1.1.0, core/DES-0005 1.2.0, data/DM-0002 1.1.0, pipeline/DES-0010 1.1.0, pipeline/DES-0011 1.0.2, web/DES-0007 1.2.0); dois arquivos intocados sorteados (semente 20261027-2148): web/DES-0009, test-strategy.md"
isolation: "a invocação trouxe, além da lista de mudanças, um enquadramento sobre o que a regra nova satisfaz; foi ignorado e cada afirmação foi conferida contra DOMAIN.md (linhas 12-14, 25-26), SEED.md US-2, US-0002 (AC-US-0002-02, -06), FEAT-0002 (REQ-FEAT-0002-01, -03, -05, -10), FEAT-0006 (REQ-FEAT-0006-08), RULE-0002 (V01, V03, V07, V16), RULE-0005 e API-0002 (displayLengthM); 97-changelog.md foi lido por inteiro por ter version movida e contém raciocínio do gerador, que não pesou em nenhum julgamento"
status-stamp: "nenhum arquivo do conjunto lia draft (todos já em status: validated antes desta validação); nenhum front matter foi alterado; confirmado por busca depois do veredito"
---

# Relatório de validação D-Spec — pista-kart-park

## Summary

- verdict: SUCCESS
- blocker: 0
- error: 0
- warning: 0
- info: 2
- divergence: 13, todas `open`, em `98-divergences.md` (versão 1.0.1, não tocada nesta rodada)

## Issues

### ISSUE-01

- severity: info
- check: D3 — contrato API-0001 campo a campo (o arquivo de pista em esquema 3)
- file: pipeline/DES-0010-preparo-offline-do-arquivo-da-kart-park.md; adr/ADR-0006-lacunas-do-f-spec-resolvidas-no-projeto.md
- location: DES-0010 passo 2, "Esse comprimento é o `lapLengthM` do arquivo e de `prep`"; ADR-0006 linha "Suavização", "O `lapLengthM` publicado no arquivo e em `prep`"
- finding: `lapLengthM` não é campo de API-0001 nem de DM-0001 (tabela de campos, linhas 38-50): DM-0001 linha 52 o define como quantidade derivada, soma dos segmentos de `centerline`; o arquivo publicado hoje não tem a chave (`src/tracks/kart-park-v1.json`, chaves: barriers, centerline, curbs, direction, finishLine, markers, osmDerived, schemaVersion, sectorLimits, startPosition, trackId, trackVersion) e V18 (DES-0011) reprova qualquer chave fora de DM-0001. A leitura consistente com o conjunto é "o comprimento derivado da `centerline` gravada", igual ao de `prep.lapLengthM`; não há campo novo e nenhum contrato muda.
- expected: nada a corrigir para o veredito; na rodada de código, `lapLengthM` fica só em `prep` (DM-0002) e nenhuma chave é acrescentada ao arquivo (V18, API-0001).

### ISSUE-02

- severity: info
- check: §8 — reverificação de ISSUE-01 (scope) de dspec-validation-20261022-1631.md; D5 — I3
- file: 01-architecture.md; test-strategy.md
- location: 01-architecture.md, "Consequências para outras features", primeiro item; test-strategy.md, "Testes de outras features"
- finding: o item de escopo fechou fora deste conjunto: `300 Specs/330 D-Specs/Output/race-lap-validation/core/DES-0006-leitura-do-dado-de-pista.md` (1.1.0, validated) exporta `TRACK_SCHEMA_VERSION` citando FB-01 de `pista-kart-park`; `tests/race-lap-validation-track-data.test.ts` (CHK-TEST-0009-02, -03) lê a versão anterior da fixture e a corrente da constante, sem literal 2; `src/trackData.ts:11` declara `TRACK_SCHEMA_VERSION = 3`. Os dois trechos citados ainda descrevem o estado anterior (":20 afirma o literal 2", ":24-30 usa a versão 3 como posterior", "o commit ... só é integrado ... junto com a mudança desses dois testes"). Nenhum requisito, caminho ou contrato depende do trecho; nenhuma verificação numerada o torna `error`.
- expected: numa próxima revisão de 01-architecture.md e de test-strategy.md, o trecho passa a registrar que a mudança já foi aplicada por `race-lap-validation`; não condiciona o veredito.

## Divergences

### REQ-FEAT-0002-02, -16; API-0001
- estado: open
- hoje: `src/trackData.ts:5`, `:89`
- fecha: DES-0001, DM-0001, ADR-0001

### REQ-FEAT-0002-01, -03 a -11, -14, -17, -18; REQ-FEAT-0003-01 a -07; REQ-FEAT-0004-01 a -03; REQ-FEAT-0005-01 a -03; REQ-FEAT-0006-09
- estado: open
- hoje: `package.json:6-13`; sem `src/tracks/`, `tracks/` nem preparo em `scripts/`
- fecha: DES-0010, DES-0011, DM-0001, DM-0002, ADR-0002, ADR-0006

### REQ-FEAT-0001-01 a -12, -14; API-0002
- estado: open
- hoje: `index.html:19`; `src/main.ts:152`, `:155`, `:208-218`
- fecha: DES-0005, DES-0007

### REQ-FEAT-0002-12, REQ-FEAT-0005-05, -08, -09; API-0003
- estado: open
- hoje: `src/physics.ts:9`, `:143`, `:162`, `:215`, `:229-230`, `:252`, `:300-302`, `:318`, `:321-336`
- fecha: DES-0002, DES-0003, ADR-0004

### REQ-FEAT-0004-04 a -07
- estado: open
- hoje: `src/physics.ts:276-290`
- fecha: DES-0003, ADR-0003

### REQ-FEAT-0003-10, -11, REQ-FEAT-0005-06, -07
- estado: open
- hoje: `src/lap.ts:218-220`, `:245-252`
- fecha: DES-0004, DES-0002

### REQ-FEAT-0002-12 (reposicionamento), REQ-FEAT-0001-08
- estado: open
- hoje: `src/lap.ts:154-161`, `:109-112`
- fecha: DES-0004

### REQ-FEAT-0003-08, -12, -13, -14, -15
- estado: open
- hoje: `src/lap.ts:223-252`
- fecha: DES-0004, DES-0005, DES-0010

### REQ-FEAT-0002-13, REQ-FEAT-0004-08, REQ-FEAT-0005-04; REQ-FEAT-0007-01, -02
- estado: open
- hoje: `src/main.ts:44-110`, `:289-297`
- fecha: DES-0008

### REQ-FEAT-0005-10 a -19
- estado: open
- hoje: `src/audio.ts:1-43`
- fecha: DES-0009

### REQ-FEAT-0006-01 a -08, -10 a -13
- estado: open
- hoje: `index.html:17`, `:19`, `:25`
- fecha: DES-0005, DES-0007, DES-0012

### REQ-FEAT-0007-03, -04, -06, -07
- estado: open
- hoje: `tests/race-lap-validation-layering.test.ts:9-10`
- fecha: DES-0006, test-strategy.md

### REQ-FEAT-0007-13, REQ-FEAT-0006-14
- estado: open
- hoje: `package.json:6-13`; `index.html:19`, `:25`
- fecha: DES-0011, DES-0012, ADR-0005

## Coverage

- requisitos cobertos: 101 de 101 (REQ-FEAT-0001-01 a REQ-FEAT-0007-13; `99-traceability.md` regenerado pelo gate, lint 0)
- requisitos sem cobertura: nenhum
- itens de projeto sem fonte: nenhum
- critérios sem caminho de teste alcançável: nenhum (53 de 53; AC-US-0002-02 por V03 sobre a `centerline` gravada, AC-US-0002-06 por V07, inalterados)
- verificações desta rodada registradas por item, para a comparação "No progress" (§8):
  - SPEC-ISSUE-01 (ADR-0006 1.1.0, DES-0010 1.1.0, DM-0002 1.1.0, DES-0011 1.0.2): regra conferida contra DOMAIN.md 12-14 e 25-26 (janela de cerca de 12 m; nenhum ponto a mais de 0,30 m), SEED US-2 e AC-US-0002-02 (comprimento medido de novo, 680,625 m a 694,375 m), REQ-FEAT-0002-03/-10, V01/V03/V07 e REQ-FEAT-0006-08/API-0002 (`displayLengthM` 687 independente do medido). Aritmética: 687,5 × 0,99 = 680,625 e 687,5 × 1,01 = 694,375; 682,116 m está na faixa, 5,384 m abaixo do alvo (0,783 %). Grampo: 0,295 m em torno de `O_i` mais o arredondamento a 0,001 m (no máximo 0,000707 m) dá no máximo 0,2957 m até o ponto correspondente; a distância até a poligonal original (V07) é menor ou igual a essa; o maior desvio medido de 0,2955 m é coerente com o grampo e fica abaixo de 0,30 m. Nenhuma barreira de verificação foi reduzida: V01, V03, V07 e V16 têm os mesmos limites de RULE-0002; a falha por comprimento fora da faixa é nomeada em DES-0010 (D7). Pontos e ordem mantidos (uma aplicação sobre a origem, correspondência por índice). Constantes com unidade (D2); `LAP_LENGTH_TOLERANCE` é fração, com a faixa em metros declarada.
  - `trackVersion` 1: V16 e REQ-FEAT-0002-01 fixam `trackVersion` 1 no arquivo publicado, e RULE-0005 fixa a primeira versão publicada em 1; a regra "suavizar de novo é versão nova" (RULE-0005, SEED I3/I5) vale a partir de uma versão publicada. DM-0002 ("Entrada de rodada reprovada") define publicada como entrada entregue por rodada que passou no gate; a entrada `kart-park` 1 de `tracks/registry.json` (`smoothingIterations` 0, `lapLengthM` 687,52) veio de `code-validation-20261027-2125` (FAIL SPEC) e nunca foi validada, testada nem implantada (o staging corrente, 6ea3862, antecede ba221ad). ADR-0005 põe `STAGING`/`PRODUCTION` em artefatos construídos e na lista de verificação da etapa de deploy, coerente com essa definição. `trackVersion` 2 reprovaria V16 sem mudança do F-Spec. Nenhum campo existente é redefinido com o mesmo nome (I3): `prep.smoothingIterations` sai, `prep.smoothingWindowM` entra; `registryVersion` continua 1 porque o formato nunca foi entregue; reversão (git revert) e janela de compatibilidade declaradas (D4).
  - SPEC-ISSUE-02 (DES-0005 1.2.0, DES-0007 1.2.0, 01-architecture 1.0.2): `startTrainingLap(session, lap, config, setup?)` com `SetupRef` de `src/physics.ts:92` (existe); `src/trainingSession.ts:81` já tem a assinatura; o pedido `{lapKind, trackId, trackVersion, setupId?, setupVersion?}` coincide campo a campo com API-0002 1.1.0 de `race-lap-validation` (linhas 44-45: opcionais, guardados sem interpretação) e a citação de API-0001 1.1.0 para `LapResult.setupId`/`setupVersion` está correta; DES-0007 `beginLap` passa o quarto argumento; o diagrama de sequência o carrega; prova com e sem `setup` em DES-0005 (D8); `trainingSession.ts` importa `physics.ts` no sentido permitido (D5).
  - SPEC-ISSUE-03 (DES-0010 1.1.0, DES-0002 1.1.0): passos 5 e 9 reescritos com constantes que existem em `scripts/trackPrep.ts:29-32` (`BARRIER_SEQUENCE_GAP_M`, `GAP_MARCH_STEP_M`, `LINE_END_TARGET_M`, `LINE_MARCH_MAX_M`), unidades declaradas, V13 a V15 continuam verificadas (não presumidas), a ponta da linha fica entre 2,95 m e 3,001 m (V11); DES-0002 lista `closestOnSegment`, `pointInQuad`, `centerlineCrossings`, `windingSumOf`, exportados por `src/trackGeometry.ts:57, :85, :269, :282`, com assinatura, unidade e chamadores; `scripts/trackPrep.ts` e `scripts/trackChecks.ts` importam só `src/track.ts`, `src/trackData.ts` e `src/trackGeometry.ts` (D5).
  - 97-changelog.md 1.2.0: os três itens do feedback estão em "Itens fechados" com os locais carregados; sem `OPEN-<nn>` nem `TBD` no conjunto (D9); nenhum segredo, credencial ou token em arquivo algum (D6).
  - Amostra intocada: web/DES-0009 1.1.0 (módulos `src/curbFeedback.ts` e `src/audio.ts` existem; `CURB_SOUND` no nível do módulo, `decideCurbFeedback` exportado; unidades em passos e ms; chave de deduplicação `simStepCount`; falha sem vibração declarada; sem chave; AC-US-0005-07 a -12 com caminho em `npm test` sem gancho só de teste) e test-strategy.md 1.0.1 (todo FEAT com nível; 53 critérios com fixture, estado semeado ou substituto nomeado; nenhum alcançado por configuração ou ponto de entrada só de teste; regras de domínio com unitário ou integração além do E2E): sem achado.
