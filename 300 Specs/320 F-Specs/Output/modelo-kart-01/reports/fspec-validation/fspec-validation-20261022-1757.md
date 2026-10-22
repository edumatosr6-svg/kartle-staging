---
stage: fspec
feature: modelo-kart-01
verdict: SUCCESS
generated: 2026-10-22T17:57:57Z
counts: {blocker: 0, error: 0, warning: 0, info: 1, divergence: 0}
seed: {revision: 1, digest: ef2fe14c9440}
upstream: {stage: req, version: 1.2.0}
feedbacks: []
population: "re-validação (conventions §8): ISSUE-01 e ISSUE-02 de fspec-validation-20261022-1506, re-verificadas primeiro; arquivos com `version:` movida para 1.1.0 (9): 01-overview.md, 02-glossary.md, 97-changelog.md, api/API-0003, features/FEAT-0003, flows/FLOW-0001, flows/FLOW-0002, rules/RULE-0002, screens/SCR-0001; dois arquivos intocados sorteados ao acaso: rules/RULE-0001, features/FEAT-0006; requisitos validados em req-validation-20261022-1703 (US-0003 1.2.0)"
context-ignored: "97-changelog.md, rodada 2, registra uma ordem do dono do produto passada ao gerador sobre como resolver a ISSUE-01 (`ENDED` igual a `RACE_CHASE`, 'não redescobri-la'); ignorada como fundamento: o ramo foi julgado só contra US-0003 1.2.0 (AC-US-0003-13, pré-condições, casos anormais) e `DOMAIN/DEC-06` via `01-context.md` dos requisitos"
---

# Relatório de validação do F-Spec — modelo-kart-01

## Summary

- veredito: SUCCESS
- contagens: 0 blocker, 0 error, 0 warning, 1 info, 0 divergence
- ISSUE-01 de 1506 (error, F7): fechada; o modo da câmera com a volta em `ENDED` é `RACE_CHASE` e cita AC-US-0003-13 em `RULE-0002` (tabela Modos, parágrafo sobre `ENDED`, diagrama, tabela de transições, pose por modo, tabela de campo de visão), `FEAT-0003` (requisitos 01 a 03 e 11, tabelas Comportamento e Estado, critérios de aceite), `02-glossary.md` ("Em corrida", "Visão geral da pista", "Volta encerrada", `cameraMode`), `FLOW-0002` (passos 8 e 9), `FLOW-0001` (passo 4, linha "Volta encerrada"), `SCR-0001` (estados "Visão geral" e "Em corrida", Navegação) e `API-0003` (`cameraMode`, `cameraHeightM`); o ramo "próxima visão geral = primeiro quadro da contagem de uma nova volta" compõe AC-US-0003-10 e AC-US-0003-13 com fatos nomeados do contrato de `race-lap-validation` (nenhuma transição de `ENDED` para outra fase; `startLap` aceito depois de `ENDED` cria outra volta em `COUNTDOWN`), conferidos por nome
- ISSUE-02 de 1506 (warning, F4): fechada; a seção "Lacunas deliberadas" de `01-overview.md` traz a coluna Origem linha a linha, e cada "recusa registrada" existe no changelog dos requisitos na rodada indicada (rodada 1: descida, campo de visão vertical em retrato, turbo, diâmetros e bitolas, capacete e demais cores; rodada 2: giro das rodas, número 01; rodada 3: painel de resultado e caminho até a próxima visão geral); os pontos "não fixado por nenhum critério" não constam de nenhuma recusa; o item da rodada 1 de `97-changelog.md` foi corrigido no mesmo sentido
- entrada humana: nenhuma

## Issues

### ISSUE-01

- severidade: info
- verificação: F3, terminologia confrontada com `02-glossary.md`
- arquivo: `02-glossary.md`
- localização: seção "Enums e campos dos contratos", linha `lapPhase`, `countdownRemainingMs`
- achado: `resumePhase` é lido de `getLapState` em `FEAT-0003` (seção Estado), `RULE-0002` (Entradas, tabela Modos, tabela de transições) e `FLOW-0002` (alternativa "Pausa ou suspensão durante a contagem"), mas a linha do glossário que lista os campos desse mesmo contrato externo nomeia só `lapPhase` e `countdownRemainingMs`.
- esperado: a linha nomeia também `resumePhase` (`COUNTDOWN` ou `RUNNING`, a fase a que a volta em `PAUSED` retorna), como campo de `getLapState` de `race-lap-validation`, nomeado e não redefinido.

## Divergences

Nenhuma.

## Coverage

- critérios: 40 `AC-*` dos requisitos (AC-US-0001-01 a 16, AC-US-0002-01 a 06, AC-US-0003-01 a 13, AC-US-0004-01 a 02, AC-US-0005-01 a 03) cobertos por `REQ-*`, 0 descobertos; AC-US-0003-13, novo em US-0003 1.2.0, realizado por REQ-FEAT-0003-01, 02, 03 e 11
- NFRs: NFR-0001 a NFR-0007 realizados (7), 0 adiados, 0 descartados
- requisitos sem fonte: nenhum `REQ-*` (FEAT-0003: 13 citam `AC-*`, 2 citam `[DOMAIN]` com o caso anormal de US-0003; FEAT-0006: 8 citam NFR); `99-traceability.md`: "Items with no upstream source: None"
- fora do escopo: os quatro itens de `01-overview.md` iguais aos de `01-context.md` dos requisitos
- contratos sem consumidor: nenhum (API-0001 em FLOW-0001, FLOW-0002 e SCR-0001; API-0002 em FLOW-0003, RULE-0001 e FEAT-0006; API-0003 em FLOW-0001, FLOW-0002 e SCR-0001)
- telas: SCR-0001 com os estados carregando, vazio, populado, erro, permissão negada e offline, cada um com as chamadas resolvidas em `api/`
- ligações relativas na população: 63 verificadas, 0 quebradas; blocos mermaid: 3 (FLOW-0001, FLOW-0002 `sequenceDiagram`; RULE-0002 `stateDiagram-v2`), sintaxe válida
