---
stage: test
feature: apresentacao-e-som
verdict: SUCCESS
generated: 2026-11-10T19:02:15Z
run: {collected: 562, passed: 562, failed: 0, skipped: 0, fresh: true, feature-scope: {collected: 85, passed: 85, failed: 0, skipped: 0}}
counts: {blocker: 0, error: 0, warning: 8, info: 5, divergence: 15}
checks: {before: 477, after: 562, migrated: 1, removed: 0}
seed: {revision: 2, digest: e7a828ada2d2}
upstream: {stage: dspec, test-strategy: 1.1.0}
build: {commit: 5a0dfb3, tree: não commitada (código, suítes e registros da feature), dist: index-7Ar5m25g.js}
round: 1
mode: first-validation
previous-report: none
feedback-sent: []
human-lines: {scripted: 13, execution-lines: 19, executed: 0}
---

# Relatório de validação de testes — apresentacao-e-som, seed revisão 2 (árvore não commitada sobre `5a0dfb3`)

## Verification status

- seed: `pipeline_progress.py --seed-line apresentacao-e-som` → `{revision: 2, digest: e7a828ada2d2}`
- execução registrada `runs/test-run-20261110-1853.*` (gravada 15:54:38 −03:00): posterior à última edição de `src/` (15:07), `scripts/` (15:10), `index.html` (15:05) e `tests/` (15:45:37); JUnit 562 `<testcase>`, 0 `<failure>`, 0 `<skipped>`; `ℹ` tests 562, pass 562, fail 0, cancelled 0, skipped 0, todo 0
- execução do validador: nova, 15:58–15:59 −03:00, `npx tsx --test` com repórteres JUnit e spec sobre `tests/*.test.ts` → `runs/test-run-validator-20261110.junit.xml` e `.spec.log`; `ℹ` tests 562, pass 562, fail 0, cancelled 0, skipped 0, todo 0; JUnit 562 `<testcase>`, 0 `<failure>`, 0 `<skipped>`; mesmo conjunto de 562 nomes e o mesmo estado de cada um da execução registrada (sem flake)
- registros na saída do validador: `SOUND_DETERMINISM` PASS (6.364 passos, 0 ms, 0 ms); `ASSETS_NEUTRAL` PASS (6.364 passos, 0 ms, 0 ms); `SIM_STATE_UNCHANGED` PASS (8.797 passos, 0 campos)
- nível "Build": `dist/` de 15:49 (posterior à última edição de código); `npm run check:assets` reexecutado pelo validador → `ASSET_BUDGET` PASS, `initialDownloadBytes` 411.976, `featureAssetBytes` 224.762, `assetCount` 4, `assetsInInitialDownloadCount` 4, `coverWidthPx` 1200, `curbSoundFileCount` 0, `newRuntimeDependencyCount` 0 — igual a `runs/asset-budget-20261110-1849.json`; `npm run build` não foi reexecutado
- níveis "Web E2E" e "Mobile E2E": 13 roteiros escritos em `docs/apresentacao-e-som-device-log.md`, 0 executados, declarado no próprio arquivo e em `98-divergences.md` (não é ausência silenciosa)
- feature: 85 `<testcase>` nas 5 suítes (19 + 20 + 13 + 15 + 18), 85 `CHK-TEST-*` únicos, os mesmos dos registros `TEST-0001..0005`; 0 `skip`/`todo` nas suítes
- atrito: 477 antes (`500 Tests/Output/pista-kart-park/runs/test-run-20261106-1640.junit.xml`), 562 agora; 85 adicionados; 476 nomes idênticos; 1 nome mudado, CHK-TEST-0008-07, com linha "Migração" no changelog e aprovação registrada; 0 removidos
- critérios (33 `AC-*`/`NFR-*`): 29 com ao menos uma verificação executada e aprovada que os nomeia; 4 sem verificação em `npm test` (AC-US-0001-05, AC-US-0002-06, NFR-0005, NFR-0010); NFR-0008 só tem verificação de escrituração (ISSUE-07); cobertos só por skip: 0
- unverified (nenhuma evidência até um humano executar): AC-US-0001-05, AC-US-0002-06, NFR-0008 (E2E-12); NFR-0003 linha "sem rede" (E2E-09); NFR-0005 (E2E-10, E2E-11); NFR-0010 (registro de liberação do deploy)
- unverified pela metade (decidido em `npm test` só o que o documento declara, o que o código pede a um contexto de áudio de substituição, ou o texto do código): AC-US-0001-01..04, AC-US-0002-01, -03, -04, -05, -07, AC-US-0003-01..10, AC-US-0004-01..06, NFR-0003 linha "pedidos", NFR-0007 (parte ouvida)
- o que cada critério afirma — comportamento ou forma do código:
  - comportamento executado (função pública ou artefato entregue): AC-US-0002-02 (largura lida do JPEG; conferida à parte pelo validador: 1200 × 670); AC-US-0002-03, -04, AC-US-0001-01..03, AC-US-0002-01 (declarações do `index.html` entregue); AC-US-0003-02, -03 (decisão pura, desigualdades); AC-US-0003-04..07, AC-US-0004-02, -03, -05 (decisão + rampas pedidas, sobre voltas reais); AC-US-0003-10, AC-US-0004-06 (cópia byte a byte; bytes entregues ao decodificador; nenhum oscilador); NFR-0001, -0002, -0006 (medida sobre `dist` montado e sobre o `dist` real); NFR-0009 estado (`SIM_STATE_UNCHANGED`, linha de base de antes da feature, intocada no git)
  - comportamento sobre substituto (o que foi pedido, não o que soa): tudo o que os critérios chamam "saída de áudio" — AC-US-0003-01 (ganho > 0, `loop`, sem `stop`; o intervalo de silêncio dentro da gravação real nunca é medido: o MP3 real não é decodificado em `npm test`), prazos de 50/200 ms (fim da rampa pedida contra `currentTime` posto pelo teste)
  - só forma do código (texto de `src/main.ts`, `src/audio.ts`, digests): AC-US-0002-07; AC-US-0003-08 (metade "o controle acompanha o estado"), AC-US-0003-09 (única chamada no manipulador de `#sound`); AC-US-0004-01 e -04 (composição `laidSegment && rearOnAsphalt` e ordem em relação ao bloco de marca); NFR-0003 "pedidos"; NFR-0004/-0009 (camadas); NFR-0007 (texto da zebra igual ao de `5a0dfb3`)
  - só escrituração: AC-US-0001-04, AC-US-0002-05 (ISSUE-05), NFR-0008 (ISSUE-07)
- números afirmados × origem (conferidos): 50 ms, 200 ms, 5 e 20 m/s, 1200 px, "Kartle", 300.000 bytes, 3 MB → requisitos; 0,8 / 2,0 / 32 m/s / 0,35 / 0,70 / 0,50 / 10 ms / 80 ms → DES-0002 (0,9875 e 1,55 são a interpolação desses a 5 e 20 m/s); 0,002 → DES-0003; 192 × 192, 1200 × 670, 2752 × 1536, tetos 45.000 / 100.000 / 70.998 / 44.389 → DM-0001 e `NOTES.md`; descrição da prévia → ADR-0003; os 6 digests SHA-256 de TEST-0004 (bloco de marca, `whiteNoise`, `CURB_SOUND`, `CURB_ATTACK_S`, `curb()`, `curbFeedback.ts`) recalculados pelo validador sobre `git show 5a0dfb3:` — os 6 iguais; `runtimeDependenciesBaseline` `['three']` = `dependencies` de `5a0dfb3` (`git diff package.json` só acrescenta o script `check:assets`). Nenhum número esperado sai do código sob teste. Limiares de suficiência de fixture (`> 5000` passos, `>= 20` quadros, `>= 500` quadros, `1.4`/`1.0`) não decidem critério
- tautologia (T3), amostra: CHK-TEST-0001-06 reprova se a janela do reposicionamento sumir ou durar outro tempo; CHK-TEST-0002-05 reprova com qualquer oscilador ou filtro criado ao ligar o som; CHK-TEST-0002-11 reprova com rampa no lugar do corte; CHK-TEST-0003-08 reprova se o pneu divergir do bloco de marca real quadro a quadro; CHK-TEST-0005-06 reprova com a capa de 1199 px; CHK-TEST-0003-11 reprova com um campo do estado alterado; CHK-TEST-0003-09/-10: ISSUE-02. As 22 mutações de `reports/mutation-trials-20261110.txt` não foram reexecutadas pelo validador
- T5: idempotência — CHK-TEST-0002-12 repete o mesmo comando e afirma nenhum nó, contexto, reinício ou agendamento novo; RBAC, webhook e migração: não se aplicam (sem endpoint, sem banco); `web-mobile` offline — E2E-09, não executado; renovação de token: não se aplica
- nenhum relógio de parede, rede ou dependência de ordem nas 5 suítes; nenhuma igualdade de ponto flutuante fora de zeros exatos e inteiros; nenhuma superfície só de teste em `src/`; nenhum identificador, credencial ou token real

## Failures

Nenhuma.

## Issues

### ISSUE-01
- severity: warning
- check: T3
- where: `tests/apresentacao-e-som-page.test.ts` CHK-TEST-0004-06, -07 (linhas 133-134), -08, -09, -10, -11, -12, -14, -15
- defect: as afirmações são sobre o texto de `src/main.ts`, `src/audio.ts` e `src/soundOutput.ts` (expressões regulares de instruções inteiras e digests); a presença do texto não prova que o ramo executa, e uma reescrita equivalente de `src/main.ts` reprova sem defeito. A composição da leitura do quadro (AC-US-0004-01, AC-US-0004-04), a única chamada de `setSoundOn` (AC-US-0003-09) e "0 pedidos depois de abrir" (NFR-0003) nunca são executadas em `npm test`.
- expected: continuam como guarda de ligação (nível "contrato de texto" da estratégia); a metade de comportamento desses critérios fica `unverified` até E2E-05, E2E-06, E2E-07 e E2E-08.

### ISSUE-02
- severity: warning
- check: T3 (tautologia)
- where: `tests/apresentacao-e-som-lap.test.ts` CHK-TEST-0003-09, CHK-TEST-0003-10; `tests/helpers/soundReport.ts:93-124`; changelog, "Sem mutação que as reprove"
- defect: a volta é avançada pelo ajudante com `stepLap` e `RaceAudio` só recebe uma leitura; as duas execuções comparadas são a mesma simulação pura, e nenhuma das 22 mutações as reprova. Só reprovam se o som alterar estado global da simulação. A linha "imagens indisponíveis" de NFR-0009 não é exercitada (as imagens não têm caminho de código).
- expected: os dois registros ficam como a medida que NFR-0004 e NFR-0009 pedem na saída de `npm test`; a garantia que pode falhar é CHK-TEST-0004-14 (M17) e CHK-TEST-0003-11 (M22). Uma mutação que as reprove (som escrevendo em estado compartilhado de `src/physics.ts`) entra em `mutation-trials`, ou o registro deixa de contá-las sozinhas como cobertura de NFR-0004.

### ISSUE-03
- severity: warning
- check: T3
- where: `tests/helpers/soundContext.ts`; `tests/apresentacao-e-som-sound.test.ts` CHK-TEST-0002-01, -04, -07..-11; `tests/apresentacao-e-som-lap.test.ts` CHK-TEST-0003-01..-05, -08
- defect: o decodificador de substituição devolve sempre o mesmo buffer sintético (1 kHz, onda quadrada a meia escala) para quaisquer bytes; os limites de repetição, o intervalo de silêncio de AC-US-0003-01 e os prazos são medidos sobre esse buffer e sobre rampas pedidas, nunca sobre a gravação real. A opção `contextState` do substituto não é usada por nenhuma verificação: o contexto suspenso até o gesto (caso anormal de US-0003) não tem verificação.
- expected: o registro mantém esses critérios como decididos "no que foi pedido à saída de áudio"; o que soa — motor contínuo sem buraco na repetição, tom, volume, silêncio em 200 ms, áudio liberado pelo gesto — fica `unverified` até E2E-06 e E2E-07 nos dois canais.

### ISSUE-04
- severity: warning
- check: T3
- where: `tests/apresentacao-e-som-lap.test.ts:45`, `:58`, `:85` (`sourcesOf(fake)[0]` = motor, `[1]` = pneu)
- defect: a suíte da volta escolhe a voz pela ordem de criação dos nós, que é detalhe interno de `loadRecordings`; trocar a ordem reprova 8 verificações sem mudança de comportamento, ou faz a verificação do motor ler o ganho do pneu.
- expected: escolher a fonte pelos bytes decodificados, como `voiceOf` em `tests/apresentacao-e-som-sound.test.ts:25-30`.

### ISSUE-05
- severity: warning
- check: T3
- where: `tests/apresentacao-e-som-assets.test.ts` CHK-TEST-0005-01, CHK-TEST-0005-02 (`provenance`, linhas 31-41)
- defect: para as duas imagens (`RESIZE_REENCODE`) a verificação prova que os digests de `feature-assets.json` são os dos arquivos, o tamanho e a proporção; outra figura de 192 × 192 ou 1200 × 670 com o registro atualizado passa. "É a imagem de `docs/art/…`" (AC-US-0001-04, AC-US-0002-05) não é decidido em `npm test`.
- expected: os dois critérios contam como verificados só depois de E2E-12 (comparação visual com a origem, citando os digests `c41595…a28c` e `28ed9c…9e40`).

### ISSUE-06
- severity: warning
- check: Check attrition (migração) / T3
- where: `tests/pista-kart-park-feedback.test.ts` CHK-TEST-0008-07 (linhas 165-169, 182-183); `97-changelog.md`, tabela "Migração"; `200 Requirements/220 Input/apresentacao-e-som/DOMAIN.md` (2026-11-10)
- defect: registro suficiente — `DOMAIN.md` nomeia o id, o arquivo, o que muda e o que fica; o changelog tem a linha "Migração"; FB-01 foi enviado a `pista-kart-park`; o `git diff` do arquivo são 8 linhas por 8, só nessa verificação, e todas as afirmações sobre a zebra (única fonte `'noise'`, fonte de buffer → passa-baixa de 160 Hz → ganho, nenhum nó antes do contexto nem com o som desligado) e sobre a recompensa (só osciladores do tipo do descritor) estão intactas. O que enfraqueceu: a metade do motor virou negativa — nesse contexto nenhuma gravação é carregada, nenhum nó de motor existe, e o que resta é "nenhum oscilador, nenhum filtro" mais a constante `ENGINE_SOUND.source === 'recording'`; e o som de pneu, quarto som do jogo para AC-US-0005-12 ("diferente de todos os outros sons"), não é comparado com a zebra ali. O grafo positivo de motor e pneu (fonte de buffer → ganho, sem filtro) só é afirmado em CHK-TEST-0002-05 desta feature.
- expected: a linha "Migração" e FB-01 passam a nomear CHK-TEST-0002-05 como portadora, para AC-US-0005-12 de `pista-kart-park`, de "motor e pneu não são ruído filtrado"; ou a verificação migrada carrega as gravações pelo decodificador de substituição e afirma isso. Nenhuma afirmação sobre a zebra ou a recompensa muda.

### ISSUE-07
- severity: warning
- check: T2
- where: `TEST-0005-arquivos-e-medida-do-build.md` (`sources`), `99-traceability.md` linha NFR-0008; `tests/apresentacao-e-som-assets.test.ts` CHK-TEST-0005-05
- defect: NFR-0008 aparece como verificável por 18 verificações de TEST-0005; a única que o nomeia (CHK-TEST-0005-05) confere os digests do registro e não decide "0 marcas, 0 logotipos, 0 textos de terceiros". `98-divergences.md` diz corretamente "não verificado".
- expected: NFR-0008 conta como `unverified` até E2E-12; o registro TEST-0005 descreve CHK-TEST-0005-05 como apoio do roteiro (os digests a citar), não como cobertura.

### ISSUE-08
- severity: warning
- check: T1 / T2
- where: `docs/apresentacao-e-som-device-log.md`, tabela "Execuções"; `98-divergences.md`
- defect: 0 de 19 linhas de execução preenchidas. AC-US-0001-05, AC-US-0002-06, NFR-0008, NFR-0003 "sem rede" e NFR-0005 não têm evidência alguma. A tabela tem uma linha só para E2E-01 (o roteiro pede Chrome, Edge, Firefox e Safari), uma para E2E-02 (pede Chrome no Android e Safari no iOS) e uma para E2E-04 (pede ao menos dois serviços de prévia nomeados).
- expected: as linhas não executadas não reprovam esta etapa (nível declarado pela estratégia validada, não executado às claras; mesmo tratamento de `pista-kart-park`, `test-validation-20261107-0052` ISSUE-05) e seguem como pendência humana que bloqueia a promoção: um humano executa, sobre o pacote de staging desta árvore, E2E-01 (web-desktop: Chrome, Edge, Firefox, Safari), E2E-02 (web-mobile: Chrome/Android, Safari/iOS), E2E-03 (web-mobile), E2E-04 (dois serviços de prévia), E2E-05 a E2E-09 e E2E-13 (web-desktop e web-mobile, uma linha por canal), E2E-10 (notebook de referência de RNF03), E2E-11 (celular de referência de RNF03) e E2E-12 (inspeção visual com data, nome e digests), uma linha por aparelho e navegador. NFR-0010 é do registro de liberação do deploy.

### ISSUE-09
- severity: info
- check: T2
- where: `tests/apresentacao-e-som-decision.test.ts` CHK-TEST-0001-17, CHK-TEST-0001-18
- defect: as mensagens nomeiam AC-US-0003-02 e AC-US-0003-03, mas as verificações decidem regras de DES-0002 (passo lido uma vez; leitura fora de faixa limitada), não esses critérios.
- expected: o registro TEST-0001 as descreve como verificações de projeto; AC-US-0003-02 e -03 são decididos por CHK-TEST-0001-02, -03 e CHK-TEST-0002-08.

### ISSUE-10
- severity: info
- check: T3
- where: `tests/apresentacao-e-som-page.test.ts:100-104` CHK-TEST-0004-05
- defect: depois da igualdade com o texto de ADR-0003, as quatro afirmações seguintes (um ponto final, fim de frase, "em português") operam sobre um literal já fixado e não podem falhar sozinhas.
- expected: nenhuma mudança exigida; AC-US-0002-04 é decidido pela igualdade com o texto registrado.

### ISSUE-11
- severity: info
- check: Check attrition
- where: `500 Tests/Output/pista-kart-park/TEST-0008-retorno-da-zebra.md`; `500 Tests/Output/pista-kart-park/reports/feedbacks/apresentacao-e-som/feedback-20261110-1853.md` (FB-01)
- defect: o registro validado de `pista-kart-park` ainda descreve CHK-TEST-0008-07 com o motor triangular; FB-01 está pendente na feature alvo.
- expected: `pista-kart-park` aceita ou recusa FB-01 na sua próxima rodada desta etapa.

### ISSUE-12
- severity: info
- check: Check attrition (aprovação)
- where: `200 Requirements/220 Input/apresentacao-e-som/DOMAIN.md`
- defect: a aprovação da migração está num arquivo ainda não commitado; o validador lê o registro, não confere a autoria.
- expected: o arquivo entra no commit da etapa junto com o teste migrado.

### ISSUE-13
- severity: info
- check: T1
- where: `500 Tests/Output/apresentacao-e-som/runs/`
- defect: nenhum; a execução do validador ficou em `test-run-validator-20261110.junit.xml` e `.spec.log`, ao lado da registrada.
- expected: nenhum.

## Divergences

Aprovação: `test-strategy.md` 1.1.0, validada em `dspec-validation-20261110-1755`, que atribui estes critérios a roteiro registrado (I9). Nenhum roteiro executado.

| Critério | Estado | Roteiro |
|---|---|---|
| AC-US-0001-05 | sem verificação | E2E-12 |
| AC-US-0002-06 | sem verificação | E2E-12 |
| NFR-0003 "sem rede" | sem verificação | E2E-09 |
| NFR-0005 | sem verificação | E2E-10, E2E-11 |
| NFR-0008 | sem verificação | E2E-12 |
| NFR-0010 | fora desta etapa | registro de liberação do deploy |
| AC-US-0001-01, -02 | metade de aparelho | E2E-01, E2E-02 |
| AC-US-0001-03 | metade de aparelho | E2E-03 |
| AC-US-0001-04, AC-US-0002-05 | metade de aparelho | E2E-12 |
| AC-US-0002-01, -03, -04 | metade de aparelho | E2E-04 |
| AC-US-0002-07 | metade de aparelho | E2E-05 |
| AC-US-0003-01 a -10 | metade de aparelho | E2E-06 |
| AC-US-0004-01 a -06 | metade de aparelho | E2E-07 |
| NFR-0003 "pedidos" | metade de aparelho | E2E-08 |
| NFR-0007 | metade de aparelho | E2E-13 |
