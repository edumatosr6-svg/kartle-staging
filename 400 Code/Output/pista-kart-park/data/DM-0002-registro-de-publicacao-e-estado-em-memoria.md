---
id: DM-0002
title: Registro de publicação das pistas e estado em memória da sessão de treino e do retorno da zebra — implementação
feature: pista-kart-park
stage: code
status: validated
version: 1.1.0
sources: [RULE-0005, RULE-0003, RULE-0004, API-0002, FLOW-0003, REQ-FEAT-0002-17, REQ-FEAT-0002-18, REQ-FEAT-0007-13, REQ-FEAT-0001-03, REQ-FEAT-0001-12, REQ-FEAT-0005-18, REQ-FEAT-0006-14]
---

# DM-0002 — Registro de publicação e estado em memória — implementação

Sem banco. `tracks/registry.json` (novo, gerado por `npm run track -- publish kart-park 1`): `registryVersion` 1, uma entrada
`kart-park` 1 `STAGING` com `file` `src/tracks/kart-park-v1.json`, `sha256` `04ce5e51…`, `fileBytes` 43 013, `stagedAtUtc`
`2026-10-27T21:58:06.132Z` e `prep` (`originFile`, `originSha256` `52c5adda…`, `smoothingWindowM` 12, `maxSmoothingOffsetM` 0,295,
`lapLengthM` 682,116, `originOffsetM` {26,625; 5,49}, `curbWidthsM` 34 × 1, `reducedCurbs` []). O cliente não o importa. Rodada 2
(DM-0002 1.1.0, "Entrada de rodada reprovada"): a entrada gravada pela rodada 1 (`stagedAtUtc` 2026-10-27T21:05:21.754Z, `sha256`
`24093e90…`, `smoothingIterations` 0, `lapLengthM` 687,52), nunca validada, testada nem implantada, foi retirada junto com o arquivo que
apontava, antes de `prepare`/`verify`/`publish kart-park 1` com a suavização de ADR-0006 1.1.0; a partir desta entrada o registro é só
acrescido.

## Realização por requisito

| Requisito | Arquivo e símbolo |
|---|---|
| RULE-0005; FLOW-0003; REQ-FEAT-0002-17, -18 | `scripts/track-pipeline.ts` `readRegistry` (`:73-84`: recusa versão desconhecida sem reescrever), `writeAtomic` (`:65-71`: temporário e renomeação), `publish` (`:124-149`: exige `VERIFIED` na mesma execução, calcula o resumo, par ausente → `STAGING` com `stagedAtUtc` e `prep`; mesmo resumo → `já registrado`; outro resumo → `recusado: trackVersion já publicado com outro conteúdo`), `prepare` recusa par registrado (`:98`) |
| REQ-FEAT-0007-13; REQ-FEAT-0006-14 | `promote` (`:151-160`): `STAGING` → `PRODUCTION` com `promotedAtUtc` e `esriDecisionRef`; `PRODUCTION` repetido → `já promovido`; `--esri-decision` validado em `parseArgs` (`:48-56`: só com `promote`, obrigatório, uma vez, 1–200 caracteres sem controle, valor nunca reproduzido na recusa) |
| API-0002; RULE-0003; REQ-FEAT-0001-03, -12 | estado em memória `TrainingSession` (`src/trainingSession.ts:19-25`: `sessionState`, `selectedTrackId`, `reading`, `environment`, `startKart`), guardado em `src/main.ts:169` e substituído só por `selectTrainingTrack` (`:229`); a volta ao lado (`:162`); nada gravado |
| RULE-0004; REQ-FEAT-0005-18 | `CurbFeedbackState` (`src/curbFeedback.ts:11`: `lastHandledStep`, `lastPulseStep`, `lastSoundStep`), zerado a cada sessão e a cada volta (`src/main.ts:235`, `:300`); com a volta suspensa `stepLap` não avança e nada começa (`:507-517` só roda por passo avançado) |

## Plano de migração

| Passo | Estado | Reversão |
|---|---|---|
| criação de `tracks/registry.json` `registryVersion` 1 com a entrada `kart-park` 1 `STAGING` | **feito** (rodada 1; rodada 2 retira a entrada da rodada reprovada e regrava a versão 1 no mesmo commit do arquivo regenerado) | `git revert` do commit; `npm test` na árvore revertida; o cliente não lê o registro |

Preenchimento retroativo: nenhum (a pista sintética não é registrada). Retenção e privacidade: identificadores de pista, resumos,
tamanhos, instantes UTC, parâmetros do preparo e, com `PRODUCTION`, a referência textual da decisão; quem publica não é registrado.
