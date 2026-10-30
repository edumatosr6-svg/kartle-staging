---
stage: dspec
feature: pista-kart-park
verdict: SUCCESS
generated: 2026-10-30T13:27:55Z
counts: {blocker: 0, error: 0, warning: 1, info: 2, divergence: 15}
seed: {revision: 1, digest: b5aa5be4734a}
upstream: {stage: fspec, version: 1.0.1}
feedbacks: []
feedbacks-pending: []
previous: "dspec-validation-20261027-2148.md (SUCCESS, 0/0/0/2 info); ISSUE-01 e ISSUE-02 (info) reverificados: os dois trechos continuam como estavam, mantidos como ISSUE-01 e ISSUE-02 abaixo"
population: "revalidação (§8) depois da rodada 4 (Mode C, FB-01 de race-lap-validation, feedback-20261030-1256.md): as duas issues do relatório anterior; os arquivos com version movida (00-index.md, 01-architecture.md 1.1.0, 97-changelog.md 1.3.0, 98-divergences.md 1.1.0, adr/ADR-0003 1.1.0, adr/ADR-0004 1.1.0, adr/ADR-0006 1.2.0, adr/ADR-0007 1.0.0 novo, core/DES-0003 1.1.0, core/DES-0004 1.1.0, core/DES-0005 1.3.0, core/DES-0006 1.1.0, data/DM-0002 1.2.0, security/DES-0012 1.0.2, test-strategy.md 1.1.0, web/DES-0007 1.3.0, web/DES-0009 1.2.0); dois arquivos intocados sorteados (semente 20261030-1327): data/DM-0001, web/DES-0008"
isolation: "a invocação trouxe, além da feature e dos caminhos, um resumo do que a rodada resolveu (voltas seguidas no treino; ADR-0007 para o crédito no painel do resultado da volta do treino); foi ignorado como justificativa e cada afirmação foi conferida contra o F-Spec (FEAT-0001, FEAT-0003, FEAT-0006, SCR-0002, RULE-0003, API-0002), contra o F-Spec e o D-Spec validados de race-lap-validation (FEAT-0010 REQ-FEAT-0010-19 e -29, API-0001 lapSequenceCount/lapStartMs, DES-0007 1.1.0 handledResults, DES-0008 1.1.0 #lap-training-result) e contra a árvore; 97-changelog.md foi lido por ter version movida e contém raciocínio do gerador, usado só para localizar mudanças; FEEDBACK-01 do F-Spec foi lido como a divergência registrada indicada pelo chamador"
status-stamp: "status: validated aplicado ao front matter de todo arquivo do conjunto que lia draft"
---

# Relatório de validação D-Spec — pista-kart-park

## Summary

- verdict: SUCCESS
- blocker: 0
- error: 0
- warning: 1 (ISSUE-03)
- info: 2 (ISSUE-01, ISSUE-02)
- divergence: 15, todas `open`, em `98-divergences.md` 1.1.0

## Issues

### ISSUE-01

- severity: info
- check: D3 — contrato API-0001 campo a campo (reverificação de ISSUE-01 de dspec-validation-20261027-2148.md)
- file: adr/ADR-0006-lacunas-do-f-spec-resolvidas-no-projeto.md; data/DM-0002-registro-de-publicacao-e-estado-em-memoria.md; pipeline/DES-0010-preparo-offline-do-arquivo-da-kart-park.md
- location: ADR-0006 1.2.0, linha "Suavização", "O `lapLengthM` publicado no arquivo e em `prep`"; DM-0002 1.2.0, tabela `prep`, `lapLengthM` "o mesmo valor do arquivo"; DES-0010 passo 2
- finding: `lapLengthM` não é campo de API-0001 nem da tabela de campos de DM-0001; DM-0001 o define como quantidade derivada da `centerline` gravada e V18 reprova chave fora de DM-0001. O texto continua a sugerir uma chave no arquivo; nenhum contrato muda.
- expected: numa próxima revisão, "o comprimento derivado da `centerline` gravada"; na rodada de código, nenhuma chave `lapLengthM` no arquivo publicado. Não condiciona o veredito.

### ISSUE-02

- severity: info
- check: D5 — I3 (reverificação de ISSUE-02 de dspec-validation-20261027-2148.md)
- file: 01-architecture.md; test-strategy.md
- location: 01-architecture.md 1.1.0, "Consequências para outras features", primeiro item; test-strategy.md 1.1.0, "Testes de outras features", primeiro parágrafo
- finding: os dois trechos ainda descrevem `tests/race-lap-validation-track-data.test.ts:20` afirmando o literal 2 e condicionam a integração a essa mudança, já aplicada por `race-lap-validation` (`src/trackData.ts:11` declara `TRACK_SCHEMA_VERSION = 3`). Nenhum requisito, caminho ou contrato depende do trecho.
- expected: numa próxima revisão, registrar que a mudança já foi aplicada por `race-lap-validation`. Não condiciona o veredito.

### ISSUE-03

- severity: warning
- check: D9 — linha de divergência com o que existe hoje em `arquivo:linha`
- file: 98-divergences.md
- location: linhas "REQ-FEAT-0002-02, -16; API-0001", "REQ-FEAT-0002-01, -03 a -11 ...", "REQ-FEAT-0006-01 a -08, -10 a -13", "REQ-FEAT-0007-03, -04, -06, -07", "REQ-FEAT-0007-13, REQ-FEAT-0006-14" e o parágrafo final ("nenhum código desta feature existe")
- finding: as duas linhas novas da rodada citam a árvore corrente (`index.html:25` com `#lap-result-credit`, `src/main.ts:465`, `:592`, `tests/pista-kart-park-lap.test.ts:47`, `tests/helpers/kartParkPilot.ts:114`, conferidos), enquanto as linhas anteriores, que o cabeçalho prende ao commit `ac84352`, afirmam como "hoje" o que a árvore já não tem: `index.html:19` e `:25` "não têm crédito" (hoje `#track-credit` em `:19` e `#lap-result-credit` em `:25`, contradizendo a linha nova do mesmo arquivo); `src/trackData.ts:5` declara a versão 2 (hoje `:11`, versão 3); sem `src/tracks/`, sem preparo em `scripts/`, sem script em `package.json:6-13` (hoje `src/tracks/kart-park-v1.json`, `scripts/trackPrep.ts`, `scripts/trackChecks.ts`, `scripts/track-pipeline.ts`, script `track`); "não existe `tests/pista-kart-park-*.test.ts`" (hoje 11 arquivos); `index.html:17` "Circuito Aurora" (hoje `#track-name`). O mesmo arquivo descreve `index.html:25` de dois modos incompatíveis. Toda linha tem item de projeto que a fecha; o estado `open` não é contestado.
- expected: decidir uma base única para a coluna "O que o sistema faz hoje" (o sistema em execução, ou a árvore corrente com o código da rodada reprovada) e alinhar a ela as linhas anteriores, o cabeçalho e o parágrafo final.

## Divergences

### REQ-FEAT-0002-02, -16; API-0001
- estado: open
- hoje: `src/trackData.ts:5`, `:89` (base `ac84352`; ver ISSUE-03)
- fecha: DES-0001, DM-0001, ADR-0001

### REQ-FEAT-0002-01, -03 a -11, -14, -17, -18; REQ-FEAT-0003-01 a -07; REQ-FEAT-0004-01 a -03; REQ-FEAT-0005-01 a -03; REQ-FEAT-0006-09
- estado: open
- hoje: `package.json:6-13`; sem `src/tracks/`, `tracks/` nem preparo em `scripts/` (base `ac84352`; ver ISSUE-03)
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
- hoje: `index.html:17`, `:19`, `:25` (base `ac84352`; ver ISSUE-03)
- fecha: DES-0005, DES-0007, DES-0012

### REQ-FEAT-0007-03, -04, -06, -07
- estado: open
- hoje: `tests/race-lap-validation-layering.test.ts:9-10` (base `ac84352`; ver ISSUE-03)
- fecha: DES-0006, test-strategy.md

### REQ-FEAT-0007-13, REQ-FEAT-0006-14
- estado: open
- hoje: `package.json:6-13`; `index.html:19`, `:25` (base `ac84352`; ver ISSUE-03)
- fecha: DES-0011, DES-0012, ADR-0005

### REQ-FEAT-0006-04, -05, -06; REQ-FEAT-0003-14 (rodada de 2026-10-30)
- estado: open
- hoje: `index.html:25`; `src/main.ts:465`, `:592` (conferidos na árvore)
- fecha: DES-0007, ADR-0007

### REQ-FEAT-0003-08, -10, -12, -13, -15; REQ-FEAT-0001-05 (rodada de 2026-10-30)
- estado: open
- hoje: `tests/pista-kart-park-lap.test.ts:47`, `:100`, `:120`, `:152`, `:227`; `tests/pista-kart-park-session.test.ts:103`; `tests/helpers/kartParkPilot.ts:114` (conferidos na árvore)
- fecha: DES-0004, DES-0005, test-strategy.md

### Divergência de texto registrada no F-Spec (FEEDBACK-01, scope)
- estado: registrada pelo gerador em `300 Specs/320 F-Specs/Output/pista-kart-park/reports/feedback/FEEDBACK-01.md`, sem mudança de `REQ-*`
- leitura julgada: a "tela de resultado" de SCR-0002/REQ-FEAT-0006-04 a -06 e REQ-FEAT-0003-14, para volta `TRAINING`, é o painel `#lap-training-result` de `race-lap-validation` (DES-0008 1.1.0 daquela feature); REQ-FEAT-0003-10 (invalidar com `CUT` no estado da simulação), REQ-FEAT-0001-10 (volta em andamento sem resultado) e REQ-FEAT-0003-15 (regras de `race-lap-validation` sem mudança) continuam realizados no texto que exigem
- fecha: ADR-0007, DES-0007, DES-0004, DES-0005

## Coverage

- requisitos cobertos: 101 de 101 (REQ-FEAT-0001-01 a REQ-FEAT-0007-13, pelos `sources` de `core/`, `web/`, `pipeline/`, `security/` e `data/`)
- requisitos sem cobertura: nenhum
- itens de projeto sem fonte: nenhum
- critérios sem caminho de teste alcançável: nenhum (53 de 53; AC-US-0001-05, -07, AC-US-0003-05, -07, -09, -10, -11, AC-US-0005-05 e AC-US-0006-04 a -06 pelo crescimento de `listLapResults` e por `#lap-training-result-credit`, pela interface pública de `src/lap.ts`, `src/trainingSession.ts`, `src/lapMessages.ts` e pelo texto de `index.html`/`src/main.ts`, sem gancho só de teste)
- verificações desta rodada registradas por item, para a comparação "No progress" (§8):
  - FB-01, volta (DES-0004 1.1.0): tabela "Volta de treino na Kart Park" conferida contra FEAT-0010 de `race-lap-validation` (REQ-FEAT-0010-19 reposicionamento, REQ-FEAT-0010-29 `CUT` mantido) e API-0001 (`lapSequenceCount`, `lapStartMs`); `NOT_TRAINING` na lista de códigos; nenhuma prova espera `ENDED` na chegada ou no corte; `src/lap.ts` sem mudança de modelo (D5).
  - FB-01, sessão (DES-0005 1.3.0): `startTrainingLap` inicia o treino inteiro; `LAP_ALREADY_ACTIVE` em `COUNTDOWN`/`RUNNING`/`PAUSED`; troca descarta a volta em andamento sem resultado (REQ-FEAT-0001-10); itens de `listLapResults` `TRAINING`, sem `challengeNumber`, `official` falso (REQ-FEAT-0001-11, -12).
  - FB-01, crédito (DES-0007 1.3.0, ADR-0007 1.0.0): `#lap-training-result` existe no D-Spec validado de `race-lap-validation` (DES-0008 1.1.0, coluna direita, visível em treino fora de `ENDED` com resultado); `handledResults` em DES-0007 1.1.0 daquela feature; retirada de `#lap-result-credit` com ponto de rejeição (`screens`: "nenhum `lap-result-credit`") e substituto projetado na mesma entrega (I3); `renderCredit` com `textContent`/`setAttribute`, link `noopener noreferrer` (D6); ordem de entrega com a rodada de código de `race-lap-validation` declarada (01-architecture).
  - FB-01, retorno da zebra (DES-0009 1.2.0, DM-0002 1.2.0): estado zerado em `beginLap`/`startTrainingLap` e `chooseTrack`, nunca no fim de volta; deduplicação por `simStepCount` mantida (D7).
  - Drift e turbo (DES-0003 1.1.0, ADR-0003 1.1.0, ADR-0004 1.1.0, ADR-0006 1.2.0, DES-0006 1.1.0, 01-architecture 1.1.0): nenhum requisito desta feature trata de drift; caminho bit a bit da pista sintética mantido; `src/maneuvers.ts` fora da lista de camada desta feature com o motivo; nenhuma verificação removida (tabela de migração do changelog).
  - D9: nenhum `OPEN-<nn>` nem `TBD` no conjunto; D6: nenhum segredo, credencial ou token em arquivo algum.
  - Amostra intocada: data/DM-0001 1.0.0 (campos com unidade no nome, nulabilidade, padrão, revisão com reversão executável, janela de compatibilidade, retenção) e web/DES-0008 1.0.0 (`src/trackScene.ts` existe; unidades em m e px; métrica de quadros nomeada; sem chave com motivo): sem achado.
