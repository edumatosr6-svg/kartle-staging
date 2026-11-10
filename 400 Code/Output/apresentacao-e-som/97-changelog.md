---
title: Registro de mudanças — apresentação e som (estágio de código)
feature: apresentacao-e-som
stage: code
status: draft
version: 1.0.0
sources: []
---

# Registro de mudanças

## 2026-11-10 — rodada 1, Mode A (projeto `dspec-validation-20261110-1755`; sobre `5a0dfb3`)

- Rodada anterior do mesmo dia: Mode A parado em FAIL SPEC (`feedback-20261110-1745`, SPEC-ISSUE-01: `fetch` em `src/audio.ts`
  contra CHK-TEST-0011-02), sem código escrito. O projeto foi revisto (gravações embutidas no JS) e revalidado às 17:55.
- Formas entregues em `src/assets/` (ícone 36.674, capa 72.701, motor 70.998, pneu 44.389 bytes) e `feature-assets.json`;
  6 elementos em `index.html`.
- `src/soundOutput.ts` novo: `decideSoundOutput`, `initialSoundDecision`, as 8 constantes.
- `src/audio.ts`: `decodeRecordingDataUrl`, `findLoopBounds`, `LOOP_SILENCE_THRESHOLD`, `RaceAudio.loadRecordings`, `setSoundOn`,
  `getSoundOutput`, `refresh`; `ENGINE_SOUND` passa a `'recording'`; saem o oscilador do motor, `ENGINE_GAIN_FLOOR`, `toggle()`,
  `update()` e o campo público `enabled` (agora privado).
- `src/main.ts`: importações `?inline`, `loadRecordings`, `refreshSound`, controle `#sound` com `setSoundOn`; `src/rawImports.d.ts`.
- `scripts/assetBudget.ts`, `scripts/asset-budget.ts`, script `check:assets`.
- Portão: `tsc --noEmit` 0; `npm run build` 0; `check:assets` `PASS`; `npm test` 476/477 (só CHK-TEST-0008-07, a exceção declarada).

**Itens fechados**: SPEC-ISSUE-01 de `feedback-20261110-1745` (no projeto); linhas 1 a 12 de `98-divergences.md` do projeto
`resolved`; linhas 13 a 16 `open`, dos estágios de testes e de deploy.

**Pontos decididos nesta etapa onde o projeto não nomeia o valor, para o validador confirmar**

- `package.json` ausente ou ilegível na medida do build: `BASELINE_MISSING` (DES-0004 diz "registro com `FAIL` e o motivo" sem
  dizer qual).
- `ASSET_BUDGET` sempre com os 7 campos numéricos, 0 no que não pôde ser medido, inclusive em `BASELINE_MISSING` (o tipo
  `AssetBudgetRecord` do projeto não os dá por opcionais; API-0003 lista "campos comuns" como corpo desse motivo).
- Endereços com base de publicação (`--base=/nome/`) casados com o arquivo de `dist/` pelos segmentos finais.
- Corte imediato do ganho quando o som é desligado durante uma descida de 80 ms ainda em curso.
- `laidSegment` posto em falso por `emitReposition` antes da avaliação.

**Itens recusados ou não aplicados, com motivo**

- Migrar CHK-TEST-0008-07, escrever `tests/apresentacao-e-som-*.test.ts` e `tests/helpers/soundReport.ts`: estágio de testes.
- Criar `docs/apresentacao-e-som-device-log.md`: é escrito pela etapa de testes, com execuções em aparelho e a inspeção visual.
- Feedback ao manifesto de código de `pista-kart-park` (`web/DES-0009` descreve `toggle`, `update` e o motor `triangle`, agora
  retirados): não escrito; esta rodada recebeu a instrução de não tocar a saída de outras features. Fica devido, além do feedback
  que o projeto já enviou ao D-Spec daquela feature.
- Versionar as 4 origens de `docs/` e as formas entregues: esta rodada não faz commit.
- Abrir o jogo num navegador: não feito; os roteiros E2E são da etapa de testes.
