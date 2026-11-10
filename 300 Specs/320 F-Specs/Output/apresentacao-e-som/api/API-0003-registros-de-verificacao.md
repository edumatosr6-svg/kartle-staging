---
id: API-0003
title: Contrato dos registros de verificação
feature: apresentacao-e-som
stage: fspec
status: validated
version: 1.0.0
sources: [NFR-0001, NFR-0002, NFR-0003, NFR-0004, NFR-0006, NFR-0007, NFR-0009]
---

# API-0003 — Contrato dos registros de verificação

Contrato dos registros que provam os requisitos transversais onde os requisitos nomeiam a saída de
`npm test` ou a medida do build como ponto de observação (I9). Não há endpoint de rede (diretrizes do
estágio): os registros saem de `npm test` e da medida do build que entrega a feature, localmente e sem rede
(D-FS-08). Nomes em `camelCase` plano com a unidade no sufixo (D-FS-06). Os registros são evidência; não
são configuração nem caminho de depuração do jogo.

## Operações

| `checkId` | Onde é emitido | O que compara | Fonte |
|---|---|---|---|
| `SOUND_DETERMINISM` | saída de `npm test` | A mesma sequência de entradas, a partir do mesmo estado inicial, avançada por `STEP`, com o som ligado e com o som desligado: tempo total e setores | NFR-0004 |
| `ASSETS_NEUTRAL` | saída de `npm test` | A mesma sequência de entradas, avançada por `STEP`, com e sem os sons e as imagens desta feature disponíveis: tempo total e setores | NFR-0009 |
| `SIM_STATE_UNCHANGED` | saída de `npm test` | O estado da simulação depois da mesma sequência de entradas, campo a campo, contra a linha de base anterior à feature | NFR-0009 |
| `ASSET_BUDGET` | medida do build que entrega a feature | Peso e entrega dos 4 arquivos, download inicial, arquivos de som da zebra e dependências de execução | NFR-0001, NFR-0002, NFR-0003, NFR-0006, NFR-0007 |

## Auth

Sem sessão e sem conta. Papel permitido: `player` (anônimo), único papel do produto; os registros são
produzidos por quem roda `npm test` ou o build, fora do jogo publicado. Contrato deliberadamente público:
nenhum registro carrega segredo, credencial nem dado pessoal (I6, D-FS-07).

## Parâmetros

Nenhum parâmetro de caminho ou de consulta. Nenhum corpo de pedido: os registros são saída.

## Resposta — campos comuns a todo registro

| Campo | Tipo | Unidade | Obrigatório | Padrão e restrições |
|---|---|---|---|---|
| `checkId` | enum `SOUND_DETERMINISM`, `ASSETS_NEUTRAL`, `SIM_STATE_UNCHANGED`, `ASSET_BUDGET` | — | sim | um registro por verificação e por execução |
| `verdict` | enum `PASS`, `FAIL` | — | sim | sem padrão |
| `checkFailReason` | enum (tabela de Erros) | — | só com `FAIL` | ausente com `PASS`; o primeiro motivo encontrado |

## Resposta — `SOUND_DETERMINISM` e `ASSETS_NEUTRAL`

| Campo | Tipo | Unidade | Obrigatório | Padrão e restrições |
|---|---|---|---|---|
| `checkStepCount` | inteiro | passos | sim | passos de `STEP` avançados em cada uma das duas execuções; maior que 0; cobre ao menos uma volta completa |
| `lapDeltaMs` | inteiro | ms | sim | diferença absoluta entre os tempos totais da volta das duas execuções; `PASS` exige 0 |
| `maxSectorDeltaMs` | inteiro | ms | sim | a maior diferença absoluta entre tempos do mesmo setor nas duas execuções; `PASS` exige 0 |

## Resposta — `SIM_STATE_UNCHANGED`

| Campo | Tipo | Unidade | Obrigatório | Padrão e restrições |
|---|---|---|---|---|
| `checkStepCount` | inteiro | passos | sim | passos de `STEP` avançados antes da comparação; maior que 0 |
| `differingFieldCount` | inteiro | campos | sim | campos do estado da simulação acrescentados, retirados ou com valor diferente em relação à linha de base; `PASS` exige 0 |

## Resposta — `ASSET_BUDGET`

| Campo | Tipo | Unidade | Obrigatório | Padrão e restrições |
|---|---|---|---|---|
| `initialDownloadBytes` | inteiro | bytes comprimidos | sim | soma de tudo o que o navegador baixa para o jogo abrir; `PASS` exige menos de 3 MB (NFR-0001) |
| `featureAssetBytes` | inteiro | bytes | sim | soma dos bytes dos 4 arquivos na forma entregue; `PASS` exige no máximo 300.000 (NFR-0002) |
| `assetCount` | inteiro | arquivos | sim | arquivos desta feature entregues; `PASS` exige 4 |
| `assetsInInitialDownloadCount` | inteiro | arquivos | sim | quantos dos 4 estão no download inicial; `PASS` exige 4 (NFR-0003) |
| `coverWidthPx` | inteiro | px | sim | largura da capa na forma entregue; `PASS` exige 1200 ou mais (AC-US-0002-02, via [RULE-0003](../rules/RULE-0003-arquivos-da-feature-peso-e-licenca.md)) |
| `curbSoundFileCount` | inteiro | arquivos | sim | arquivos de som da zebra entre os entregues; `PASS` exige 0 (NFR-0007) |
| `newRuntimeDependencyCount` | inteiro | dependências | sim | dependências de execução que não estavam na lista do projeto antes da feature; `PASS` exige 0 (NFR-0006) |

Todos os campos são novos; nenhum tem padrão e nenhum muda comportamento do jogo: são saída de verificação.

Resposta na forma vazia: não existe. Uma verificação que não pôde medir emite o registro com `FAIL` e o
motivo; a ausência do registro na saída é falha da verificação, nunca aprovação.

## Erros

Não há status HTTP. Um registro com `FAIL` traz um destes motivos:

| `checkFailReason` | `checkId` | Condição | Corpo |
|---|---|---|---|
| `TIME_DIFFERS` | `SOUND_DETERMINISM`, `ASSETS_NEUTRAL` | `lapDeltaMs` ou `maxSectorDeltaMs` diferente de 0 | os campos do registro |
| `LAP_NOT_COMPLETED` | `SOUND_DETERMINISM`, `ASSETS_NEUTRAL` | a sequência de entradas não completou uma volta em alguma das execuções | campos comuns e `checkStepCount` |
| `STATE_DIFFERS` | `SIM_STATE_UNCHANGED` | `differingFieldCount` maior que 0 | os campos do registro |
| `BASELINE_MISSING` | `SIM_STATE_UNCHANGED`, `ASSET_BUDGET` | a linha de base anterior à feature (estado da simulação; lista de dependências) não está disponível | campos comuns |
| `INITIAL_DOWNLOAD_EXCEEDED` | `ASSET_BUDGET` | `initialDownloadBytes` de 3 MB ou mais | os campos do registro |
| `BUDGET_EXCEEDED` | `ASSET_BUDGET` | `featureAssetBytes` acima de 300.000 | os campos do registro |
| `ASSET_MISSING` | `ASSET_BUDGET` | `assetCount` diferente de 4 | os campos do registro |
| `ASSET_NOT_IN_INITIAL_DOWNLOAD` | `ASSET_BUDGET` | `assetsInInitialDownloadCount` menor que 4 | os campos do registro |
| `COVER_TOO_NARROW` | `ASSET_BUDGET` | `coverWidthPx` menor que 1200 | os campos do registro |
| `CURB_SOUND_FILE_PRESENT` | `ASSET_BUDGET` | `curbSoundFileCount` maior que 0 | os campos do registro |
| `NEW_RUNTIME_DEPENDENCY` | `ASSET_BUDGET` | `newRuntimeDependencyCount` maior que 0 | os campos do registro |

## Idempotência

Os registros não mudam estado. Cada um é função do build e da sequência de entradas: repetir a verificação
sobre o mesmo build dá o mesmo registro. Não há chave nem contador de sequência; uma execução nova
substitui a leitura anterior, sem acumular.

## Paginação e sondagem

Sem paginação e sem sondagem: um registro por verificação e por execução.

## Compatibilidade

| Mudança | Tratamento |
|---|---|
| Os quatro `checkId` e os seus campos | Contrato novo. Nenhum registro publicado por outra feature é renomeado ou removido |
| `checkId`, `verdict`, `checkFailReason`, `checkStepCount`, `differingFieldCount` | Mesmos nomes e mesmo significado dos registros de verificação de `modelo-kart-01`; os registros daquela feature não mudam |
| Ensaios do som da zebra de `pista-kart-park` | Inalterados e não redefinidos aqui: continuam sendo os daquela feature, rodados com esta entregue (NFR-0007) |
| Significado ou unidade de um campo | Nunca muda sob o mesmo nome; uma mudança futura exige nome novo (I3) |
