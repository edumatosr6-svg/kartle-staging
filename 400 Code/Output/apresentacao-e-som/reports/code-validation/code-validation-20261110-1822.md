---
stage: code
feature: apresentacao-e-som
verdict: SUCCESS
generated: 2026-11-10T18:22:12Z
counts: {blocker: 0, error: 0, warning: 0, info: 6, divergence: 4}
seed: {revision: 2, digest: e7a828ada2d2}
upstream: {stage: dspec, validation: dspec-validation-20261110-1755, commit: 5a0dfb3, status: validated}
files_examined: 24
feedbacks: []
previous: "nenhum: primeira validação de código da feature (rodada 1, Mode A)"
population: "mudança inteira sobre 5a0dfb3 (git status e git diff HEAD, nada commitado): index.html, package.json, src/audio.ts, src/main.ts, src/rawImports.d.ts, src/soundOutput.ts (novo), scripts/assetBudget.ts (novo), scripts/asset-budget.ts (novo), src/assets/ (5 arquivos novos); manifesto: 00-index, 01-implementation, 97-changelog, 98-divergences, 99-traceability e os 6 registros por item; referência lida: 01-architecture, DES-0001 a DES-0005, DM-0001, ADR-0002, ADR-0003, a Decisão de ADR-0001, 98-divergences do projeto, API-0001 (Resposta), API-0002, API-0003; não lidos: test-strategy.md, RULE-0001 a -0003, SCR-0001, SCR-0002"
gate: "lint_artifacts.py --stage code: 0 erros, 0 avisos, 9 arquivos; npx tsc --noEmit: saída 0; npm test e npm run build não executados por este validador"
recomputed: "SHA-256 e bytes dos 4 arquivos de src/assets/ e das 4 origens de docs/ iguais a feature-assets.json; engine-loop.mp3 e tire-screech.mp3 idênticos byte a byte às origens (cmp); icon.png PNG 192 x 192 RGB de 8 bits sem alfa; cover.jpg JPEG 1200 x 670; whiteNoise, CURB_SOUND, CURB_ATTACK_S, REWARD_SOUND, soundOn(), reward() e curb() de src/audio.ts com texto idêntico ao de HEAD (57 linhas comparadas); nenhuma linha de curb, soundOn(), decideCurbFeedback ou vibrate no diff de src/main.ts; git status vazio para tests/, src/curbFeedback.ts, src/style.css, src/physics.ts, src/lap.ts, package-lock.json; nenhuma ocorrência de fetch, XMLHttpRequest, WebSocket, localStorage, sessionStorage, indexedDB, sendBeacon, EventSource, globalThis, import( dinâmico, elemento ou construtor de áudio com endereço em src/audio.ts, src/main.ts e src/soundOutput.ts, em código, texto entre aspas ou comentário; dist/ em disco (artefato de build anterior, não refeito aqui): 2 literais data:audio/mpeg;base64 em index-7Ar5m25g.js, nenhum arquivo de áudio, os 6 elementos de head com nomes com resumo"
---

# Relatório de validação de código — apresentacao-e-som (rodada 1)

## Summary

- A mudança realiza DES-0001 a DES-0005 e DM-0001 nos caminhos e com as assinaturas do projeto; nenhuma API de rede ou de armazenamento em `src/audio.ts` e `src/main.ts`, as duas gravações entram por importação estática `?inline`, o som da zebra está idêntico a HEAD, nenhum teste e nenhuma dependência foram tocados.
- As 6 escolhas que o projeto não nomeia ficam dentro dele (info, sem mudança de código devida). SUCCESS.

## Issues

### ISSUE-01
- severity: info
- check: C3
- file: `scripts/assetBudget.ts`
- location: `:176-177` (`!record || !dependencies ? 'BASELINE_MISSING'`), `:116-121` (`readRuntimeDependencies`)
- finding: `package.json` ausente ou ilegível sai como `BASELINE_MISSING`; DES-0004 (Comportamento em falha) pede "registro com `FAIL` e o motivo" sem nomear o motivo, e dos 8 motivos fechados de API-0003 é o único que diz que a comparação de dependências não pôde ser feita.
- expected: nenhuma mudança de código; DES-0004 nomeia o motivo na próxima revisão do projeto.

### ISSUE-02
- severity: info
- check: C3
- file: `scripts/assetBudget.ts`
- location: `:186-190` (retorno de `measureAssetBudget`)
- finding: o registro `BASELINE_MISSING` traz os 7 campos numéricos (0 no que não foi medido), enquanto a tabela de Erros de API-0003 dá "campos comuns" como corpo desse motivo; o tipo `AssetBudgetRecord` de DES-0004 declara os 7 como obrigatórios e a tabela de Resposta de API-0003 também, e o código segue o tipo do projeto.
- expected: nenhuma mudança de código; a etapa de testes afirma os 7 campos presentes em todo registro `ASSET_BUDGET`, como o tipo do projeto.

### ISSUE-03
- severity: info
- check: C2
- file: `scripts/assetBudget.ts`
- location: `:137-143` (laço sobre os segmentos finais do endereço)
- finding: um endereço de `dist/index.html` que carrega a base de publicação (`--base=/nome/`) é casado com o arquivo de `dist/` que os seus segmentos finais soletram; DES-0004 não descreve a base, mas manda a etapa de deploy rodar a medida sobre o build candidato, que é publicado com base, e sem isto esse build daria `ASSET_NOT_IN_INITIAL_DOWNLOAD`.
- expected: nenhuma mudança de código; a etapa de testes cobre um `dist` com base e um sem.

### ISSUE-04
- severity: info
- check: C2
- file: `src/audio.ts`
- location: `:161-165` (`applyGain`, ramo `target === 0 && !this.enabled`)
- finding: com o som desligado durante uma descida de 80 ms ainda em curso o ganho é cortado na hora, embora o alvo já fosse 0 e DES-0003 diga "só há agendamento quando o alvo muda"; é a linha "ganho para 0 com `soundOn` falso — silêncio a partir da ação" da mesma tabela e o que REQ-FEAT-0003-07 exige, e com o ganho assentado em 0 nada é agendado (`:162`).
- expected: nenhuma mudança de código; a etapa de testes prova o corte com uma descida em curso e a ausência de agendamento no pedido repetido.

### ISSUE-05
- severity: info
- check: C2
- file: `src/main.ts`
- location: `:214-215` (`emitReposition`: `laidSegment = false` antes de `refreshSound`)
- finding: `laidSegment` é posto em falso na aceitação do reposicionamento, fora do quadro, ponto que DES-0003 não lista; sem isso a leitura nova (`simStepCount` 0) levaria o valor do último quadro como marca, e DES-0002 diz que depois de um `repositionKart` aceito a leitura já não está na situação de marca.
- expected: nenhuma mudança de código.

### ISSUE-06
- severity: info
- check: C2
- file: `src/audio.ts`
- location: `:86-87` (`loadRecording`: `buildVoice(key)` e `apply()`)
- finding: ao terminar de decodificar uma gravação a decisão é reavaliada com a última leitura, um terceiro chamador de `decideSoundOutput` além de `refresh` e `setSoundOn` (DES-0002, Colaboradores); o efeito é `engineSoundAvailable` e `tireSoundAvailable` de `getSoundOutput()` passarem a verdadeiro sem esperar um quadro, como API-0002 define a disponibilidade.
- expected: nenhuma mudança de código.

## Divergences

- linha 13 — REQ-FEAT-0005-06, -07, -14, -15 (`SOUND_DETERMINISM`, `ASSETS_NEUTRAL`, `SIM_STATE_UNCHANGED`): open, etapa de testes.
- linha 14 — REQ-FEAT-0005-11 (ensaios da zebra; migração de CHK-TEST-0008-07, `tests/pista-kart-park-feedback.test.ts:165`, `:169`, `:182`): open, etapa de testes.
- linha 15 — REQ-FEAT-0005-03, -05, -08, -09, -13 (registros em aparelho e inspeção visual): open, etapa de testes.
- linha 16 — REQ-FEAT-0005-16 (licença antes da produção, `LICENSE_PENDING`): open, etapa de deploy.
- linhas 1 a 12 `resolved`: todo `arquivo:linha` citado existe e faz o que a linha exige; nenhuma sem verificação.

## Coverage

- com código: REQ-FEAT-0001-01 a -04, REQ-FEAT-0002-01 a -07, REQ-FEAT-0003-01 a -12, REQ-FEAT-0004-01 a -07, REQ-FEAT-0005-01, -02, -04, -10, -12.
- sem código desta etapa, por atribuição do projeto: REQ-FEAT-0005-03, -05, -06, -07, -08, -09, -11, -13, -14, -15 (testes), REQ-FEAT-0005-16 (deploy).
- arquivos mudados e não registrados: nenhum. Fora da mudança de código e presentes na árvore: `200 Requirements/220 Input/README.md` (linha do registro de seeds, estágio de requisitos) e 6 imagens sem versão em `docs/art/` que o projeto declara não serem desta feature.
