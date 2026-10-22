---
id: ADR-0004
title: A linha de base anterior à feature é um fixture JSON versionado em tests/fixtures, gravado antes da primeira mudança de código e amarrado ao acerto e à pista
feature: modelo-kart-01
stage: dspec
status: validated
version: 1.0.0
sources: [API-0002, FLOW-0003, FEAT-0005, FEAT-0006, REQ-FEAT-0005-05, REQ-FEAT-0006-07, REQ-FEAT-0006-08, NFR-0006, NFR-0007]
---

# ADR-0004 — A linha de base da simulação como fixture versionado

## Contexto

`SIM_CONTRACT`, `DETERMINISM` e `WHEEL_POSITIONS` comparam com "a linha de base anterior à feature" e dão
`FAIL` `BASELINE_MISSING` quando ela falta; nada é comparado nem estimado (API-0002, FLOW-0003). O F-Spec
não diz onde a linha de base vive. A `dirigibilidade` guarda as suas em `docs/physics.md` num bloco por
ensaio (registros de API-0003 daquela feature), que não tem lugar para uma sequência de `Input` nem para um
`State` final. `tests/race-lap-validation-determinism.test.ts` prova determinismo entre duas execuções da
mesma sessão, mas não contra uma medida feita **antes** desta feature.

## Decisão

1. A linha de base é `tests/fixtures/kart01-sim-baseline.json`, `schemaVersion` 1, com a forma de
   [DM-0001](../data/DM-0001-linha-de-base-da-simulacao-e-registro-em-tela.md): `STEP`, a linha de
   `Input`, as medidas da simulação, `wheelPositions` por acerto e uma volta de referência por acerto
   publicado com os `Input` por passo gravados (codificação por corridas), o `kart` final, `lapMs` e
   `sectorMs`.
2. É gravada por `scripts/kart01-baseline.ts` (`npm run baseline:kart01`) sobre a árvore imediatamente
   anterior à primeira mudança de código desta feature — depois do código validado da `dirigibilidade`
   ([ADR-0003](ADR-0003-ordem-de-entrega-depois-da-dirigibilidade-e-sem-chave.md)) — e entra no primeiro
   commit da etapa de código, com `recordedOnCommit`.
3. Os `Input` gravados são **reproduzidos literalmente** pelas verificações; o `autopilot` só é usado para
   gravar. Assim a comparação não depende de o controlador decidir igual.
4. O leitor recusa (`BASELINE_MISSING`) uma versão de esquema desconhecida, um `setupVersion` diferente do
   publicado em `PUBLISHED_SETUPS` ou uma `trackVersion` diferente da lida: uma linha de base de outro
   acerto ou de outra pista nunca é comparada.

## Alternativas consideradas

- **Usar a execução de referência de `tests/race-lap-validation-determinism.test.ts`.** É medida na mesma
  execução, não "antes da feature"; não detecta uma mudança da simulação introduzida por esta feature.
  Recusada.
- **Bloco em `docs/physics.md`.** O bloco é por ensaio de dirigibilidade; uma volta inteira com `Input` e
  estado final não cabe no seu esquema e misturaria duas features num arquivo. Recusada.
- **Só um resumo (`digest`) do estado final.** Reprovaria sem dizer que campo mudou; o `State` completo tem
  poucas dezenas de números e `deepEqual` nomeia a diferença. Recusada.
- **Nenhuma linha de base, só a diferença do repositório.** A diferença do repositório é evidência da etapa
  de código (REQ-FEAT-0006-06), mas o F-Spec exige os registros com `BASELINE_MISSING`. Recusada.
- **Gravar a linha de base dentro do teste, na primeira execução.** Esconderia a ausência e dependeria da
  ordem de execução. Recusada.

## Consequências

- A etapa de código começa pela gravação do fixture; sem ele, `npm test` reporta `BASELINE_MISSING` em três
  registros e a verificação é honesta.
- Uma feature que publique outro acerto ou outra pista regrava o fixture no seu ciclo (`--force --commit`)
  ou aceita `BASELINE_MISSING` até fazê-lo. Esta feature não altera a simulação, logo uma regravação feita
  com o código desta feature presente dá o mesmo resultado que uma feita antes dele.
- `tests/helpers/kart01Report.ts` lê o arquivo com `node:fs` por caminho relativo à raiz do repositório;
  nada é impresso além dos registros.

## Estado

Aceita nesta rodada.
