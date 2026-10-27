---
stage: fspec
feature: modelo-kart-01
verdict: SUCCESS
generated: 2026-10-27T15:20:40Z
counts: {blocker: 0, error: 0, warning: 0, info: 0, divergence: 0}
seed: {revision: 1, digest: ef2fe14c9440}
upstream: {stage: req, version: 1.2.1}
feedbacks: []
population: "re-validação (conventions §8): ISSUE-01 a ISSUE-08 de fspec-validation-20261022-1919 re-verificadas primeiro; arquivos deste conjunto com `version:` movida desde aquele relatório (8, todos de 1.1.0 para 1.2.0): 01-overview.md, 02-glossary.md, 97-changelog.md, features/FEAT-0003, flows/FLOW-0001, flows/FLOW-0002, rules/RULE-0002, screens/SCR-0001; 00-index.md e 99-traceability.md regenerados pelo gate (lint, não re-julgados); dois arquivos intocados sorteados ao acaso: features/FEAT-0006, rules/RULE-0001; F1 mecânico sobre todos os arquivos; upstream sem movimento desde 1919 (US-0003 1.2.1, 02-glossary.md 1.2.0, 01-context.md 1.2.0 dos requisitos, req-validation-20261022-1909)"
context-ignored: "97-changelog.md deste conjunto (rodada 3) registra a justificativa do gerador e uma ordem do autor passada à execução (\"retirar toda frase de pilotagem depois de `ENDED` e de não redescobri-la\"), além de citar ordens das rodadas 1 e 2; chegaram a este validador pelo próprio artefato e não foram usadas como fundamento: cada ISSUE foi re-verificada só contra US-0003 1.2.1 (Canais, pré-condições, caso anormal \"Fim da volta, válida ou invalidada, com o painel de resultado exibido\", Fontes), 02-glossary.md 1.2.0 (\"Em corrida\", \"Fim da volta (`ENDED`)\", \"Painel de resultado\") e 01-context.md 1.2.0 (`DOMAIN/DEC-06` corrigida) dos requisitos"
---

# Relatório de validação do F-Spec — modelo-kart-01

## Summary

- veredito: SUCCESS
- contagens: 0 blocker, 0 error, 0 warning, 0 info, 0 divergence
- ISSUE-01 de 1919 (error, F4, `02-glossary.md` 1.2.0): fechada; "Em corrida" diz simulação parada e kart congelado depois do fim da volta (INV-1) e só a câmera na pose de corrida em relação ao kart parado; "Volta encerrada" e "Painel de resultado" dizem o mesmo; "enquanto o Jogador pilota" e "continua pilotável" não existem mais no arquivo
- ISSUE-02 de 1919 (error, F4, `01-overview.md` 1.2.0): fechada; "O que é especificado", a decisão de forma "Modo da câmera derivado do estado da volta" e o item `race-lap-validation` dizem que a simulação para e o kart congela (INV-1, daquela feature, inalterado) e que só a câmera continua na pose de corrida
- ISSUE-03 de 1919 (error, F4, `features/FEAT-0003` 1.2.0): fechada; Resumo, Canais, linha "Volta encerrada" da tabela Comportamento e linha `RACE_CHASE` da tabela Estado conformes a US-0003 1.2.1; requisitos 01 a 03 e 11 e critérios de aceite inalterados, como os `AC-*`
- ISSUE-04 de 1919 (error, F4 e D-FS-02, `rules/RULE-0002` 1.2.0): fechada; o parágrafo depois da tabela Modos cita `DOMAIN/DEC-06` corrigida com o kart parado e a simulação parada; a coluna de contador de "`RACE_CHASE` permanece `RACE_CHASE`" diz que `simStepCount` não avança depois de `ENDED`; nenhuma transição, modo, campo ou estado novo
- ISSUE-05 de 1919 (error, F4, `flows/FLOW-0001` 1.2.0): fechada; introdução, laço do diagrama, passos 1 e 3 e linha "Volta encerrada" dizem simulação parada e kart congelado em `ENDED`, sem passo novo; o passo 1 não cita mais AC-US-0003-13 para pilotagem
- ISSUE-06 de 1919 (error, F4, `flows/FLOW-0002` 1.2.0): fechada; passo 9 diz "em relação ao kart parado, com a simulação parada e o kart congelado (INV-1)"; passo 8, diagrama e alternativas no mesmo sentido
- ISSUE-07 de 1919 (error, F4, `screens/SCR-0001` 1.2.0): fechada; a linha "Em corrida (populado)" diz Kart 01 congelado no estado informado, rodas sem giro, nenhum trecho novo de marca, painel sem mover a câmera, câmera na pose de corrida em relação ao kart parado, nenhum quadro com a visão geral; nenhum estado de tela novo
- ISSUE-08 de 1919 (info, F3, `02-glossary.md` 1.2.0): fechada; a linha de campos de `getLapState` nomeia `lapPhase`, `resumePhase` e `countdownRemainingMs`, com Onde citando RULE-0002, FEAT-0003 e FLOW-0002
- frase "o kart continua pilotável" no conjunto: ocorre só em `97-changelog.md`, nas entradas históricas das rodadas 1 e 2, marcadas como superadas, e na transcrição da correção da rodada 3; em nenhum artefato normativo
- entrada humana: nenhuma; nenhuma divergência `waived-pending`, nenhuma mudança de contrato, nenhum ramo de domínio ou de canal que os requisitos não fixem

## Issues

Nenhuma.

## Divergences

Nenhuma.

## Coverage

- critérios: 40 `AC-*` dos requisitos (AC-US-0001-01 a 16, AC-US-0002-01 a 06, AC-US-0003-01 a 13, AC-US-0004-01 a 02, AC-US-0005-01 a 03) citados por ao menos um artefato do conjunto, 0 descobertos; 0 `AC-*` citados que não existam nos requisitos; AC-US-0003-13 realizado por REQ-FEAT-0003-01, 02, 03 e 11 com a janela de "em corrida" de US-0003 1.2.1
- NFRs: NFR-0001 e NFR-0004 em FEAT-0004, NFR-0007 em FEAT-0005, NFR-0002, NFR-0003, NFR-0005 e NFR-0006 em FEAT-0006 (7 realizados), 0 adiados, 0 descartados
- requisitos sem fonte: nenhum; REQ-FEAT-0003-01 a 15 citam `AC-*` ou `[DOMAIN]` com o caso anormal de US-0003; REQ-FEAT-0006-01 a 08 citam o NFR; `99-traceability.md` regenerado pelo gate em 2026-10-22T19:31:33Z, 223 linhas
- limiares e ramos (F7, arquivos da população): 1,38 m, 3,05 m, 3,2 m, 0,30 m, 62°, 60°, curva de 90° a 50 km/h citados a AC-US-0003-01 a 09; 3000 ms de contagem nomeado como fato existente de `race-lap-validation` (nome consultado, não redefinido); RULE-0001: 1,93 m, 1,45 m e 1,05 m com ±0,02 m, 0,26 m, 0,28 m, 1,00 m e 1,14 m ao centímetro, 15 grupos mais `piloto`, quatro cores com código, no máximo 30 chamadas e 5.128 triângulos, todos em AC-US-0001-01 a 13 e NFR-0004
- fora do escopo: os quatro itens de `01-overview.md` iguais aos de `01-context.md` 1.2.0 dos requisitos
- contratos sem consumidor: nenhum (API-0001 em FLOW-0001, FLOW-0002, SCR-0001 e RULE-0002; API-0002 em FLOW-0003, RULE-0001 e FEAT-0006; API-0003 em FLOW-0001, FLOW-0002 e SCR-0001); `getKartPose`, `getCameraView`, `NO_STATE` e `NO_SCENE` usados em SCR-0001 e nos fluxos resolvem em API-0001 e API-0003; `forbiddenImportCount`, `differingFieldCount`, `differingRunCount` e os três booleanos de `SIM_CONTRACT` usados em FEAT-0006 resolvem em API-0002
- nomes tomados de `race-lap-validation` (`getLapState`, `lapPhase` com `COUNTDOWN`, `RUNNING`, `PAUSED`, `ENDED`, `resumePhase`, `NO_ACTIVE_LAP`, `startLap`, `resumeLap`, `LAP_ALREADY_ACTIVE`, `countdownRemainingMs`): existem no F-Spec daquela feature com o mesmo domínio de valores de `lapPhase`; nenhum redefinido (I3)
- telas: SCR-0001 com os estados carregando, vazio, visão geral, contagem, em corrida (populado, inclusive `ENDED`), pausada, erro, offline, permissão negada e troca de forma, cada um com as chamadas resolvidas em `api/`; os dois canais especificados
- leakage (F8, arquivos da população): "Three.js 0.186" e `src/physics.ts`, `src/lap.ts`, `src/track.ts` em FEAT-0006 citados da seção Restrições do seed via NFR-0003 e NFR-0006, com o texto conferido igual ao do seed; nenhuma tabela, coluna, módulo, classe, biblioteca ou framework além desses
- ligações relativas no conjunto: 111 verificadas, 0 quebradas; blocos mermaid: 4 (FLOW-0001, FLOW-0002, FLOW-0003 `sequenceDiagram`; RULE-0002 `stateDiagram-v2`), sintaxe válida; `TBD` e `OPEN-<nn>`: nenhum; `98-divergences.md`: nenhuma linha, cabeçalho bem formado
- `status: validated` gravado no front matter de 01-overview.md, 02-glossary.md, 97-changelog.md, FEAT-0003, FLOW-0001, FLOW-0002, RULE-0002, SCR-0001 e 00-index.md (os nove arquivos que liam `draft`); as linhas da tabela de 00-index.md são re-renderizadas pelo gate (`lint_artifacts.py --emit`) no passo seguinte do fluxo; nenhum feedback enviado: nenhum requisito de outra feature precisa mudar
