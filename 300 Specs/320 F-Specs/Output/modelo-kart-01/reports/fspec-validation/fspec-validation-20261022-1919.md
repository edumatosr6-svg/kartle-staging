---
stage: fspec
feature: modelo-kart-01
verdict: FAIL
generated: 2026-10-22T19:19:43Z
counts: {blocker: 0, error: 7, warning: 0, info: 1, divergence: 0}
seed: {revision: 1, digest: ef2fe14c9440}
upstream: {stage: req, version: 1.2.1}
feedbacks: []
population: "re-validação (conventions §8): ISSUE-01 de fspec-validation-20261022-1757 re-verificada primeiro; arquivos deste conjunto com `version:` movida desde aquele relatório: nenhum (todos nas versões julgadas em 1757); upstream movido depois de 1757 (req-validation-20261022-1909, SUCCESS: US-0003 1.2.0 para 1.2.1, 01-context.md 1.1.0 para 1.2.0, 02-glossary.md 1.1.0 para 1.2.0, 97-changelog.md para 1.3.0), logo os arquivos que realizam US-0003 ou citam `DOMAIN/DEC-06` e os termos \"Em corrida\", \"Fim da volta\" e \"Painel de resultado\" (8): 01-overview.md, 02-glossary.md, features/FEAT-0003, rules/RULE-0002, flows/FLOW-0001, flows/FLOW-0002, screens/SCR-0001, api/API-0003; dois arquivos intocados sorteados ao acaso: api/API-0001, 98-divergences.md; F1 mecânico sobre todos os arquivos"
context-ignored: "97-changelog.md deste conjunto (rodada 2) e 97-changelog.md dos requisitos (rodadas 3 e 4) registram a justificativa do gerador e ordens do dono do produto passadas às execuções (\"não redescobri-la\", \"como o dono do produto ordenou\"); chegaram a este validador pelos próprios artefatos e não foram usadas como fundamento: os achados são julgados só contra US-0003 1.2.1 (pré-condições, caso anormal \"Fim da volta, válida ou invalidada, com o painel de resultado exibido\", Fontes), 02-glossary.md 1.2.0 dos requisitos (\"Em corrida\", \"Fim da volta (`ENDED`)\", \"Painel de resultado\") e 01-context.md 1.2.0 (`DOMAIN/DEC-06` corrigida)"
---

# Relatório de validação do F-Spec — modelo-kart-01

## Summary

- veredito: FAIL
- contagens: 0 blocker, 7 error, 0 warning, 1 info, 0 divergence
- ISSUE-01 de 1757 (info, F3): continua aberta, sem edição desde então; reemitida como ISSUE-08
- origem dos 7 erros: os requisitos validados moveram depois de 1757 (`DOMAIN/DEC-06` corrigida: ao fim da volta a simulação para e o kart congela, INV-1 de `race-lap-validation`; a decisão descreve só a câmera; a frase "o kart continua pilotável" não vale; nenhum requisito de pilotagem depois de `ENDED` existe nesta feature) e este conjunto, nas versões de 1757, ainda afirma o ramo invalidado em sete arquivos
- entrada humana: nenhuma; a correção deriva inteira de US-0003 1.2.1, `02-glossary.md` 1.2.0 e `01-context.md` 1.2.0 dos requisitos, sem superfície nova (§16)

## Issues

### ISSUE-01

- severidade: error
- verificação: F4, o artefato contradiz a sua etapa upstream (conventions §6, "não é divergência")
- arquivo: `02-glossary.md`
- localização: seção "Termos de domínio", linhas "Em corrida" e "Volta encerrada (fim da volta, `ENDED`)"
- achado: "Em corrida" diz "enquanto o Jogador pilota" e "o kart continua pilotável", e "Volta encerrada" diz "o kart continua pilotável"; o glossário validado dos requisitos (1.2.0) define "Em corrida" com a simulação parada e o kart congelado depois do fim da volta, "Fim da volta (`ENDED`)" como o momento a partir do qual a simulação para e o kart congela (INV-1 de `race-lap-validation`) e "Painel de resultado" exibido sobre a cena com a simulação parada, e diz que nenhum requisito de pilotagem depois do fim da volta existe nesta feature.
- esperado: "Em corrida" diz que, depois do fim da volta, com o painel exibido, a simulação está parada e o kart congelado, como hoje, e só a câmera continua na pose de corrida em relação ao kart parado até a próxima visão geral, citando `DOMAIN/DEC-06` corrigida; "Volta encerrada" diz que a simulação para e o kart congela (INV-1) e que a câmera continua em `RACE_CHASE`; "Painel de resultado" diz "sobre a cena com a simulação parada e o kart congelado"; "enquanto o Jogador pilota" e "o kart continua pilotável" saem.

### ISSUE-02

- severidade: error
- verificação: F4, o artefato contradiz a sua etapa upstream
- arquivo: `01-overview.md`
- localização: seção "O que é especificado", primeiro parágrafo ("a câmera continua na pose de corrida e o kart continua pilotável"); seção "Decisões de forma desta especificação", item "Modo da câmera derivado do estado da volta" ("com o painel de resultado sobre a cena e o kart pilotável"); seção "Relação com outras features", item `race-lap-validation`
- achado: a visão geral afirma duas vezes que o kart continua pilotável depois de `ENDED`; `01-context.md` 1.2.0 (`DOMAIN/DEC-06`) diz que a simulação para e o kart congela, que a decisão descreve só a câmera e que nada muda em `race-lap-validation`, inclusive o congelamento.
- esperado: os dois pontos dizem que, ao fim da volta, a simulação para e o kart congela (INV-1 de `race-lap-validation`) e que só a câmera continua na pose de corrida em relação ao kart parado até a próxima visão geral; o item `race-lap-validation` diz que o congelamento ao fim da volta é daquela feature e não muda.

### ISSUE-03

- severidade: error
- verificação: F4, o artefato contradiz a sua etapa upstream
- arquivo: `features/FEAT-0003-camera-de-jogo.md`
- localização: seção "Resumo", última frase ("a câmera continua na pose de corrida e o kart continua pilotável"); seção "Comportamento", linha "Volta encerrada (`lapPhase` `ENDED`), válida ou invalidada, inclusive por reposicionamento, com o painel de resultado exibido" ("o kart continua pilotável")
- achado: o resumo e a linha de comportamento afirmam que o kart continua pilotável com a volta encerrada; US-0003 1.2.1 (pré-condições; caso anormal "Fim da volta, válida ou invalidada, com o painel de resultado exibido") diz que no quadro em que a volta termina e em todos os seguintes a simulação está parada e o kart congelado, que a câmera fica na pose de corrida em relação ao kart parado e que a visada não muda porque o rumo do kart parado não muda (critério 07 com mudança de rumo nula).
- esperado: o resumo diz que a simulação para e o kart congela ao fim da volta e que só a câmera continua na pose de corrida; a linha de comportamento diz que a câmera fica na pose de corrida em relação ao kart parado, com a simulação parada (INV-1), que a visada não muda entre quadros porque o rumo não muda (requisito 08 com variação nula) e que vale a regra de campo de visão da forma; "o kart continua pilotável" sai. Os requisitos 01 a 03 e 11 e os critérios de aceite não mudam: os `AC-*` não mudaram em 1.2.1.

### ISSUE-04

- severidade: error
- verificação: F4, o artefato contradiz a sua etapa upstream (e D-FS-02: o ramo citado não está na fonte)
- arquivo: `rules/RULE-0002-camera-de-jogo.md`
- localização: seção "Modos", parágrafo após a tabela ("em relação ao kart exibido, que continua pilotável"); tabela de transições, linha "`RACE_CHASE` permanece `RACE_CHASE`", coluna "Idempotência e contador de sequência" ("Contador: `simStepCount` da pose do kart, que continua a avançar enquanto o kart é pilotado")
- achado: o parágrafo cita AC-US-0003-13, o caso anormal "Fim da volta" de US-0003 e `DOMAIN/DEC-06` como fonte de "continua pilotável", e essas fontes, na versão validada (1.2.1 / 1.2.0), dizem o contrário: a simulação para e o kart congela; a linha da tabela afirma que `simStepCount` continua a avançar depois de `ENDED`, o que exige simulação em andamento, enquanto US-0003 1.2.1 diz "a simulação está parada" em todos os quadros a partir do fim da volta.
- esperado: o parágrafo diz que a câmera continua na pose de corrida em relação ao kart parado, com a simulação parada e o kart congelado (INV-1 de `race-lap-validation`, que esta feature não muda), citando `DOMAIN/DEC-06` corrigida; a coluna de contador da linha diz que `simStepCount` não avança depois de `ENDED` e que a pose lida em cada quadro é a mesma, em relação ao kart parado, até `startLap` aceito ou recarga; nenhuma transição, modo, campo ou estado novo.

### ISSUE-05

- severidade: error
- verificação: F4, o artefato contradiz a sua etapa upstream; passo citando um `AC-*` que não diz o que o passo afirma
- arquivo: `flows/FLOW-0001-quadro-de-exibicao-em-corrida.md`
- localização: introdução, primeira frase ("inclusive com a volta encerrada (`ENDED`) e o painel de resultado exibido — é desenhado [...]: a simulação avança com o `Input` do Jogador"); tabela "Passos", passo 1 ("o kart continua pilotável depois do fim da volta", estado "`lapPhase` `RUNNING` ou `ENDED`", fonte "AC-US-0003-13"); tabela "Alternativas", linha "Volta encerrada (`lapPhase` `ENDED`), válida ou invalidada, inclusive por reposicionamento" ("o kart continua pilotável e os passos 1 a 11 continuam iguais em todos os quadros")
- achado: o fluxo afirma que, com a volta em `ENDED`, o `Input` do Jogador continua a avançar a simulação e os passos 1 a 11 continuam iguais; AC-US-0003-13 fixa só a pose da câmera e US-0003 1.2.1 (caso anormal "Fim da volta") diz que a simulação está parada e o kart congelado em todos os quadros a partir do fim da volta, sem requisito de pilotagem depois dele.
- esperado: a introdução e a linha "Volta encerrada" dizem que, com a volta em `ENDED`, a simulação está parada e o kart congelado (INV-1 de `race-lap-validation`; NFR-0006): os passos 1 a 3 não produzem passo novo (`simStepCount` não avança) e os passos 4 a 11 leem o estado congelado e desenham a câmera na pose de corrida em relação ao kart parado, sem corte e sem visão geral, até o quadro anterior à próxima visão geral; o passo 1 deixa de afirmar pilotagem depois do fim da volta e deixa de citar AC-US-0003-13 para isso.

### ISSUE-06

- severidade: error
- verificação: F4, o artefato contradiz a sua etapa upstream
- arquivo: `flows/FLOW-0002-largada-visao-geral-descida-e-pose-de-corrida.md`
- localização: tabela "Passos", passo 9 ("em relação ao kart exibido, que continua pilotável")
- achado: o passo 9 afirma que o kart continua pilotável depois do fim da volta; US-0003 1.2.1 e `DOMAIN/DEC-06` corrigida dizem que a simulação para e o kart congela, e que a câmera fica na pose de corrida em relação ao kart parado.
- esperado: o passo 9 diz "em relação ao kart parado, com a simulação parada e o kart congelado (INV-1 de `race-lap-validation`)", mantendo o resto do passo (painel que não move a câmera, nenhum quadro com a visão geral, novo `startLap` recomeça do passo 3).

### ISSUE-07

- severidade: error
- verificação: F4, o artefato contradiz a sua etapa upstream
- arquivo: `screens/SCR-0001-cena-de-jogo-com-o-kart-01.md`
- localização: tabela "Estados", linha "Em corrida (populado)", coluna "O que a cena mostra" ("Com a volta encerrada, o mesmo: [...] o kart continua pilotável")
- achado: o estado afirma que o kart continua pilotável com a volta encerrada; US-0003 1.2.1 (Canais, pré-condições, caso anormal "Fim da volta") diz que a simulação está parada e o kart congelado, e que só a câmera continua na pose de corrida.
- esperado: a linha diz que, com a volta encerrada, o Kart 01 é exibido congelado no estado que a simulação informa (simulação parada, INV-1), o painel aparece sobre a cena sem mover a câmera, a câmera fica na pose de corrida em relação ao kart parado e nenhum quadro mostra a visão geral; nenhum estado de tela novo (§16).

### ISSUE-08

- severidade: info
- verificação: F3, terminologia confrontada com `02-glossary.md` (re-verificação da ISSUE-01 de fspec-validation-20261022-1757)
- arquivo: `02-glossary.md`
- localização: seção "Enums e campos dos contratos", linha `lapPhase`, `countdownRemainingMs`
- achado: `resumePhase` é lido de `getLapState` em `FEAT-0003` (seção Estado), `RULE-0002` (Entradas, tabela Modos) e `FLOW-0002` (alternativa "Pausa ou suspensão durante a contagem"), e a linha do glossário que lista os campos desse contrato externo continua nomeando só `lapPhase` e `countdownRemainingMs`; sem edição desde 1757.
- esperado: a linha nomeia também `resumePhase` (`COUNTDOWN` ou `RUNNING`, a fase a que a volta em `PAUSED` retorna), como campo de `getLapState` de `race-lap-validation`, nomeado e não redefinido.

## Divergences

Nenhuma.

## Coverage

- critérios: 40 `AC-*` dos requisitos (AC-US-0001-01 a 16, AC-US-0002-01 a 06, AC-US-0003-01 a 13, AC-US-0004-01 a 02, AC-US-0005-01 a 03) cobertos por `REQ-*`, 0 descobertos; US-0003 1.2.1 não mudou nenhum critério (req-validation-20261022-1909), e a matriz gerada continua completa nos dois sentidos
- NFRs: NFR-0001 a NFR-0007 realizados (7), 0 adiados, 0 descartados
- requisitos sem fonte: nenhum `REQ-*`; `99-traceability.md`: "Items with no upstream source: None"; os pontos em que o conjunto afirma o que a fonte nega estão nas ISSUE-01 a ISSUE-07 (prosa, tabelas de comportamento, passos de fluxo, estado de tela e coluna de contador), não em um `REQ-*`
- fora do escopo: os quatro itens de `01-overview.md` iguais aos de `01-context.md` 1.2.0 dos requisitos
- contratos sem consumidor: nenhum (API-0001 em FLOW-0001, FLOW-0002, SCR-0001 e RULE-0002; API-0002 em FLOW-0003, RULE-0001 e FEAT-0006; API-0003 em FLOW-0001, FLOW-0002 e SCR-0001); API-0003 sem achado: `RACE_CHASE` em `ENDED` e a idempotência por `simStepCount`, forma e turbo continuam válidas com o kart parado
- arquivos sorteados: `api/API-0001` (F5: unidade no sufixo do nome por D-FS-06, obrigatoriedade e padrão por campo, Auth `player`, superfície de erro `NO_STATE`, leitura pura, compatibilidade com `rollingSpeedMps` nomeado para não redefinir `speedMps`; F8 sem achado), `98-divergences.md` (F9: nenhuma linha; cabeçalho bem formado)
- telas: SCR-0001 com os estados carregando, vazio, populado, erro, permissão negada e offline, cada um com as chamadas resolvidas em `api/`
- ligações relativas no conjunto: 111 verificadas, 0 quebradas; blocos mermaid: 4 (FLOW-0001, FLOW-0002, FLOW-0003 `sequenceDiagram`; RULE-0002 `stateDiagram-v2`), sintaxe válida; `TBD` e `OPEN-<nn>`: nenhum
- `status:` não alterado em nenhum arquivo (veredito FAIL); nenhum feedback enviado: nenhum requisito de outra feature precisa mudar
