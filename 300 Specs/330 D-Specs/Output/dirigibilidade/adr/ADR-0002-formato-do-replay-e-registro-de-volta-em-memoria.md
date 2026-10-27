---
id: ADR-0002
title: Formato do replay versão 1 e registro de volta que envolve o LapResult, sem persistência
feature: dirigibilidade
stage: dspec
status: validated
version: 2.0.0
sources: [API-0002, RULE-0003, FLOW-0003, FEAT-0005, REQ-FEAT-0005-05, REQ-FEAT-0005-06, REQ-FEAT-0005-08, REQ-FEAT-0005-10, NFR-0006, NFR-0009]
---

# ADR-0002 — Formato do replay versão 1 e registro de volta que envolve o LapResult, sem persistência

## Contexto

API-0002 acrescenta `setupId` e `setupVersion` ao replay, ao resultado da volta e ao texto compartilhado, e
exige leitura sem erro de registros anteriores à feature. No código em execução não existe replay nem
resultado gravado: `race-lap-validation` proíbe armazenamento no navegador
(`tests/race-lap-validation-layering.test.ts:43-49`) e exige que `getLapResult` devolva exatamente os
campos de API-0001 daquela feature (`tests/race-lap-validation-contract.test.ts:36-41`, `CHK-TEST-0012-02`).
O F-Spec diz que a gravação é da feature que a possui e que este contrato não acrescenta gravação, e que os
contratos de `race-lap-validation` são nomeados e não redefinidos: API-0002 só lhes acrescenta campos
opcionais e aditivos. Na rodada de 2026-10-22 a feature `race-lap-validation` aceitou o FB-01 desta feature
e passou os seus API-0001 e API-0002 a 1.1.0: o pedido `startLap` aceita `setupId` e `setupVersion`
opcionais, a sessão os guarda e `getLapResult` os devolve copiados sem interpretação, ausentes quando o
pedido não os traz; o seu D-Spec (DM-0002, DES-0001) os pôs em `LapRequest`, `LapSession` e `LapResult` e
registrou a implementação em `src/lap.ts` como devida ao código desta feature (feedback
`reports/feedbacks/race-lap-validation/feedback-20261022-1703.md`, FB-01, aceito aqui).

## Decisão

1. O **registro de volta** é `LapRecord = LapResult + {setupId, setupVersion}` (os dois obrigatórios),
   construído por `buildLapRecord` em `src/setupRecords.ts`. O `LapResult` de `race-lap-validation`
   (API-0001 1.1.0) carrega `setupId?` e `setupVersion?` copiados do pedido `startLap`, sem interpretação;
   `buildLapRecord` preenche só o que o resultado não traz (`result.setupId ?? setup.setupId`,
   `result.setupVersion ?? setup.setupVersion`) e, sobre um resultado que já os traz, é uma cópia
   idempotente. Toda volta iniciada por esta feature — `beginLap` em `src/main.ts`, `replayLap` em
   `src/setupRecords.ts`, a volta do piloto de teste e a volta cronometrada dos benches — informa os dois
   campos no pedido, de modo que nenhum resultado novo é lido pelos padrões como um registro anterior
   (API-0002 1.1.0 de `race-lap-validation`). A mudança em `src/lap.ts` (campos opcionais em
   `LapRequest`, `LapSession` e `LapResult`, copiados como `challengeNumber`) é projetada no D-Spec de
   `race-lap-validation` (DM-0002, DES-0001) e implementada pelo código desta feature
   ([DES-0003](../core/DES-0003-versao-do-acerto-registros-e-comparabilidade.md)); como os campos são
   opcionais e ausentes quando o pedido não os traz, `CHK-TEST-0012-02` continua verde.
2. O **replay** nasce com formato versão 1 (`replayFormatVersion: 1`): `trackId`, `trackVersion`,
   `challengeNumber?`, `lapKind`, `setupId`, `setupVersion`, `inputs` por passo `RUNNING`. "Forma anterior à
   feature" é a mesma forma sem `replayFormatVersion` e sem os campos de acerto; `readReplay` a lê com
   `RESOLVED_FROM_ABSENCE`. Versão maior que 1 é `UNSUPPORTED_FORMAT`, intacta.
3. Nenhuma persistência é acrescentada: os registros vivem na memória da página e em fixtures. Os leitores
   (`readReplay`, `compareLapRecords`, `replayLap`) são a interface que a feature que vier a persistir ou
   compartilhar registros usará.
4. A reprodução (`replayLap`) usa o acerto corrente e devolve um `LapRecord` com a `setupVersion` corrente,
   cuja comparabilidade com o gravado é decidida por `compareLapRecords`.

## Alternativas consideradas

- **`LapResult` intacto, com a identidade do acerto anexada só por `buildLapRecord` fora de `src/lap.ts`**
  (a decisão das rodadas 1 a 7 deste projeto). Recusada nesta rodada: `race-lap-validation` passou API-0001
  e API-0002 a 1.1.0 com os campos opcionais, e duas descrições do mesmo contrato não podem valer ao mesmo
  tempo (FB-01). Os campos opcionais, ausentes quando o pedido não os traz, não quebram
  `CHK-TEST-0012-02` nem redefinem o contrato: o acréscimo é aditivo, como API-0002 desta feature exige.
- **Recusar o FB-01 e manter o `LapResult` intacto**, devolvendo a linha de divergência à etapa de código de
  `race-lap-validation`. Deixaria a identidade do acerto dependente de um envelope que só esta feature
  constrói, enquanto o contrato daquela feature já a carrega; e a implementação seria a mesma em
  `src/lap.ts`, só que de outra feature. Recusada; a linha é assumida aqui (decisão do autor, rodada 8).
- **Persistir registros em `localStorage` nesta feature.** Proibido pelo teste de camada de
  `race-lap-validation` e fora do escopo (o F-Spec não pede gravação). Recusada.
- **Guardar a identidade do acerto dentro de `KartConfig`.** `RENTAL_KART` e `ARCADE_KART` não podem
  ganhar campos (teste de congelamento) e a `LapSession` guarda só uma cópia do `config`; a identidade é
  passada explicitamente por quem inicia a volta ou o ensaio ([DES-0002](../core/DES-0002-telemetria-de-dirigibilidade.md)). Recusada.

## Consequências

- Os estados "Carregando", "Vazio" e "Erro" de SCR-0002 que dependem de registros gravados não têm tela
  nesta entrega além do resultado da sessão; estão declarados em
  [DES-0006](../web/DES-0006-resultado-melhor-tempo-e-texto-compartilhado.md).
- Qualquer feature futura que grave registros deve usar `buildLapRecord`/`buildReplayRecord` para que todo
  registro novo carregue os campos (API-0002: obrigatórios na gravação).
- O formato do replay é contrato publicado (I3): uma mudança futura bumpa `replayFormatVersion` e traz
  leitor da versão 1.
- `src/lap.ts` (módulo de `race-lap-validation`) é alterado pelo código desta feature, só nos campos
  opcionais copiados; a linha correspondente de `98-divergences.md` de `race-lap-validation` passa a ser
  devida por esta feature e está assumida em [98-divergences.md](../98-divergences.md). Um `LapResult` de
  volta iniciada sem os campos (os testes de `race-lap-validation`, registros antigos) continua a ser
  resolvido na leitura por `resolveSetupRef`, nunca por `src/lap.ts`.

## Estado

Aceita nesta rodada.
