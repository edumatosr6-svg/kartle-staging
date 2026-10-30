---
id: DES-0006
title: Resultado, melhor tempo só comparável e texto compartilhado, sem a versão do acerto nem o drift
feature: dirigibilidade
stage: dspec
status: validated
version: 2.0.0
sources: [SCR-0002, FLOW-0003, API-0002, FEAT-0003, FEAT-0005, REQ-FEAT-0003-14, REQ-FEAT-0003-15, REQ-FEAT-0005-05, REQ-FEAT-0005-06, REQ-FEAT-0005-08, REQ-FEAT-0005-10, REQ-FEAT-0005-13]
---

# DES-0006 — Resultado, melhor tempo só comparável e texto compartilhado, sem a versão do acerto nem o drift

## Realiza

Os `REQ-*` em `sources`: na tela de resultado e no texto compartilhado, nenhuma comparação entre tempos com
`comparability` diferente de `COMPARABLE` — nenhuma diferença, melhor tempo ou ordenação entre eles
(AC-US-0005-05, AC-US-0005-07; REQ-FEAT-0005-06, -13); a `setupVersion` é dado do registro, usada para
decidir a comparabilidade, e **não é exibida nem compartilhada** (SCR-0002 1.2.0, RNF11: nenhum texto novo de
tela); o registro de uma volta leva `setupId` e `setupVersion` (REQ-FEAT-0005-05); registros em erro não são
comparados nem descartados (REQ-FEAT-0005-08); um replay reproduzido nunca é apresentado como equivalente
(REQ-FEAT-0005-10); nenhum indicador de carga de drift, de turbo ou de impulso, combo ou pontuação de drift
na tela de resultado nem no texto compartilhado (AC-US-0003-09, -11; REQ-FEAT-0003-14, -15). Tela: SCR-0002.

## Posicionamento

- `src/handlingMessages.ts`, camada **Aplicação**, **existente** (`:1-14`) e **alterado** em
  `formatSharedText`; puro (sem DOM), para ter prova em `npm test`.
- `src/main.ts`, camada **Aplicação**, **existente** e **alterado** só por remoção em `renderResult`.
- `index.html`, camada **Aplicação**, **existente** e **alterado** só por remoção no painel `#lap-result`
  (`index.html:25`).

## Interface

`src/handlingMessages.ts`:

| Símbolo | Assinatura | Descrição |
|---|---|---|
| `formatSharedText(record, lang)` **(muda)** | `(LapRecord, 'pt' \| 'en') => texto` | `Kartle · <trackId> v<trackVersion> · <formatLapTime(lapMs)>` para volta válida; para inválida, `message('lapStateInvalid', lang)` no lugar do tempo. Sai `· <setupVersion>` (`:9`). Nunca contém um segundo tempo, diferença, melhor tempo, ordenação, versão do acerto nem conteúdo de drift ou turbo: o texto compartilhado não compara tempos, logo toda comparação que ele contém — nenhuma — é `COMPARABLE` (AC-US-0005-07) |
| `shareLabel(lang)` | inalterado | `compartilhar` / `share` |

`index.html`, painel `#lap-result`: sai `<p id="lap-result-setup" class="lap-chip"></p>` **(muda)**; ficam
`#lap-result-title`, `#lap-result-total`, `#lap-result-sectors`, `#lap-share`, `#lap-result-credit`,
`#lap-new-lap`.

`src/main.ts`, por trecho atual:

| Trecho atual | O que faz, e o que muda |
|---|---|
| `:184` `lastRecord`, `bestRecord: LapRecord \| undefined` | os dois registros da página, na memória (inalterado) |
| `:524-535` o tratamento de um resultado novo | `lastRecord = buildLapRecord(result, setupRef)` (`:527`); com `lapValidity` `VALID`, `bestRecord` passa a `lastRecord` quando não há `bestRecord` ou quando `compareLapRecords(bestRecord, lastRecord)` é `COMPARABLE` e o tempo é menor (`:529-533`); qualquer outro valor de `comparability` (ou `INCOMPLETE_RECORD`) deixa `bestRecord` como está e não exibe comparação. O tratamento é desta feature e não muda; o **gatilho** é de `race-lap-validation`: hoje a chegada da fase a `ENDED`, e, pelo D-Spec daquela feature (DES-0007 dela, rodada de 2026-10-30; treino como sequência de voltas), cada item novo de `listLapResults`, em ordem, uma vez por item (`handledResults`). Este projeto aceita esse gatilho: o tratamento recebe um `LapResult` por vez e não lê a fase, de modo que vale para a volta oficial, a de reconhecimento e cada volta do treino; tratar o mesmo resultado duas vezes daria o mesmo registro |
| `renderBest` (`:289-295`) | mostra `formatLapTime(bestRecord.lapMs)` só quando `compareLapRecords(bestRecord, {trackId, trackVersion, setupId, setupVersion do acerto corrente})` é `COMPARABLE`; senão `—` (inalterado). Com o acerto C publicado, um melhor tempo da sessão feito com outra versão nunca aparece como melhor |
| `:315`, `:326` (peso e acerto) | zeram o melhor tempo (inalterado) |
| `renderResult` (`:439-469`) **(muda)** | sai `:466` (`$('lap-result-setup').textContent = lastRecord?.setupVersion ?? ''`); o resultado mostra o que `race-lap-validation` já mostrava (título, total, setores, crédito) e o rótulo de `#lap-share` (`:467`); nenhum texto novo |
| `#lap-share` (`:344-351`) | `formatSharedText(lastRecord, lang)` por `navigator.share` ou, sem ele, pela área de transferência, em `try`/`catch` com `notify` de falha (inalterado) |

A tela de resultado não tinha conteúdo de drift: o que mostrava pontos de estilo durante a volta sai com o
HUD ([DES-0005](DES-0005-hud-velocidade-e-aderencia.md)), e nenhum campo de drift existe em `LapResult` ou
`LapRecord`. A decisão de comparabilidade é de `compareLapRecords`
([DES-0003](../core/DES-0003-versao-do-acerto-registros-e-comparabilidade.md)); a tela só recebe o resultado
(I2). Não existe tela de abertura de registro gravado nem reprodução de replay nesta feature, porque nenhuma
feature persiste registros hoje (`race-lap-validation` proíbe armazenamento local): os estados
"Carregando", "Vazio" e "Erro" de SCR-0002 se reduzem, nesta entrega, a "nenhum registro além dos da
sessão" ([ADR-0002](../adr/ADR-0002-formato-do-replay-e-registro-de-volta-em-memoria.md)).

## Colaboradores

Chama `buildLapRecord`, `compareLapRecords` (`src/setupRecords.ts`), `formatSharedText`, `shareLabel`
(`src/handlingMessages.ts`), `formatLapTime`, `message` (`src/lapMessages.ts`), `getLapResult` (`src/lap.ts`) e
as APIs do navegador `navigator.share`/`navigator.clipboard`. Chamado pelo laço de quadros e pelos
manipuladores de `src/main.ts`.

## Estado e concorrência

Estado local: `lastRecord`, `bestRecord`, derivados uma vez por resultado novo (o gatilho de
`race-lap-validation`), o que absorve quadros repetidos: um resultado já tratado não é tratado de novo. Clicar duas vezes em compartilhar compartilha duas vezes o mesmo texto,
sem efeito sobre registro algum. Nada é persistido.

## Comportamento em falha

`navigator.share` rejeitado ou área de transferência indisponível: `notify` com texto de falha; o registro não
muda. `INCOMPLETE_RECORD`: nenhuma comparação; `console.warn` com o código apenas. Rede: não usada.

## Observabilidade

`tests/dirigibilidade-hud-text.test.ts` afirma o texto compartilhado (exatamente `Kartle`, `trackId`,
`trackVersion` e o tempo ou o estado inválido; sem `setupVersion`, sem segundo tempo, sem "estilo", "turbo",
"drift" ou "combo") e que `index.html` e `src/main.ts` não têm `lap-result-setup`; o comportamento de tela é o
roteiro E2E-02 ([test-strategy](../test-strategy.md)).

## Determinismo (D-DS-07)

Não é código de simulação; a decisão de comparabilidade é provada na simulação
(`tests/dirigibilidade-setup-version.test.ts`). `formatSharedText` é pura.

## Feature flag

Nenhuma: SCR-0002 não tem chave; a mudança só retira texto (a versão e o drift) e a comparação só muda onde
antes era indevida.

## Pontos em aberto

Nenhum.
