---
id: DES-0004
title: Verificações — registros de npm test, medida do build e registro de aparelho
feature: apresentacao-e-som
stage: dspec
status: validated
version: 1.1.0
sources: [FEAT-0005, API-0003, FLOW-0003, REQ-FEAT-0005-01, REQ-FEAT-0005-02, REQ-FEAT-0005-04, REQ-FEAT-0005-06, REQ-FEAT-0005-07, REQ-FEAT-0005-08, REQ-FEAT-0005-09, REQ-FEAT-0005-10, REQ-FEAT-0005-12, REQ-FEAT-0005-14, REQ-FEAT-0005-15]
---

# DES-0004 — Verificações: registros de `npm test`, medida do build e registro de aparelho

## Realiza

Os quatro registros de API-0003 e os pontos de observação de FLOW-0003: `SOUND_DETERMINISM`
(REQ-FEAT-0005-06, -07), `ASSETS_NEUTRAL` (REQ-FEAT-0005-14), `SIM_STATE_UNCHANGED` (REQ-FEAT-0005-15),
`ASSET_BUDGET` (REQ-FEAT-0005-01, -02, -04, -10, -12) e os testes registrados em aparelho da taxa de quadros
(REQ-FEAT-0005-08, -09).

## Posicionamento

Camada **aplicação** (mapa das diretrizes), para o item e para cada módulo novo abaixo. O lugar na árvore é
dito à parte, módulo a módulo: `scripts/`, `tests/helpers/` e `docs/`, fora de `src/` — nada aqui entra no
build do jogo, e nenhum módulo de `src/` importa estes arquivos.

- `scripts/assetBudget.ts`, **novo**, camada aplicação, árvore `scripts/`: funções puras da medida. Motivo de ser novo: a medida lê `dist/`, que
  nenhum módulo existente lê, e tem de ser exercitada por `npm test` sobre pastas montadas pelo teste.
- `scripts/asset-budget.ts`, **novo**, camada aplicação, árvore `scripts/`: ponto de entrada de linha de comando, como `scripts/track-pipeline.ts`
  é para `scripts/trackPrep.ts`.
- `package.json`: script `"check:assets": "tsx scripts/asset-budget.ts"`. Nenhuma dependência nova.
- `tests/helpers/soundReport.ts`, **novo** (etapa de testes), camada aplicação, árvore `tests/helpers/`:
  monta e serializa os três registros de `npm test`. Motivo de ser novo: `tests/helpers/kart01Report.ts`, que
  já monta e serializa registros desta forma, é o ajudante de `modelo-kart-01` — os seus tipos `CheckId` e
  `CheckRecord` são o conjunto fechado do contrato daquela feature, e ele importa `three` e o modelo do kart;
  os três registros daqui têm os campos de API-0003 e exercitam `src/audio.ts` e `src/soundOutput.ts`.
  Pô-los lá mudaria o ajudante de outra feature.
- `docs/apresentacao-e-som-device-log.md`, **novo**, árvore `docs/`: os testes registrados em aparelho, no formato dos
  registros de aparelho que o projeto já tem em `docs/`.

Por que aplicação: o que estes módulos medem é o que a aplicação entrega — `index.html`, os arquivos de
`src/assets/`, a saída de som — e eles ficam na ponta da direção de dependência (I2, D-DS-01): leem a
simulação só pelas operações públicas (`step`, `stepLap`), não mudam estado de simulação de outro modo, e
nenhuma camada os importa. Os scripts de bancada que o projeto já tem em `scripts/` ocupam o mesmo lugar.

## Interface

### Registros de `npm test`

Um registro por verificação e por execução, um objeto JSON numa linha, emitido como diagnóstico do teste —
a mesma forma dos registros de `modelo-kart-01`. Campos: os de API-0003, com os mesmos nomes.

| `checkId` | Como é produzido |
|---|---|
| `SOUND_DETERMINISM` | Duas execuções da mesma sequência de entradas, do mesmo estado inicial, por `stepLap`: uma volta completa de treino na Kart Park com o piloto de teste que o projeto já tem (`tests/helpers/kartParkPilot.ts`). Na primeira, a cada passo, a leitura do quadro é entregue a um `RaceAudio` com `setSoundOn(true)` sobre um contexto de áudio de substituição; na segunda, a um `RaceAudio` com o som desligado. `lapDeltaMs` e `maxSectorDeltaMs` comparam os resultados das duas. |
| `ASSETS_NEUTRAL` | As mesmas duas execuções, uma com `RaceAudio` de gravações carregadas e som ligado, a outra com `RaceAudio` sem nenhuma gravação (carregamento falho) e sem contexto de áudio. As imagens não são lidas pelo jogo em nenhuma das duas: isso é verificado à parte, pela ausência de referência à capa e ao ícone em `src/`. |
| `SIM_STATE_UNCHANGED` | As execuções de referência da linha de base `tests/fixtures/kart01-sim-baseline.json` (gravada em 2026-10-30 sobre o commit `a361c9c`, anterior a esta feature) são reproduzidas por `step`; o estado final do kart de cada uma é comparado campo a campo com o que a linha de base guarda. `differingFieldCount` soma campos acrescentados, retirados e diferentes; `checkStepCount` soma os passos. Arquivo ausente ou ilegível: `FAIL` com `BASELINE_MISSING`. |

Sequência que não completa a volta em alguma execução: `FAIL` com `LAP_NOT_COMPLETED`. Diferença:
`TIME_DIFFERS` ou `STATE_DIFFERS`. Todo tempo é `toMs(passos)`; nenhum relógio de parede é lido (I9).

### Medida do build — `scripts/assetBudget.ts`

```ts
export type AssetBudgetRecord = {
  checkId: 'ASSET_BUDGET'; verdict: 'PASS' | 'FAIL'; checkFailReason?: AssetBudgetFailReason;
  initialDownloadBytes: number; featureAssetBytes: number; assetCount: number;
  assetsInInitialDownloadCount: number; coverWidthPx: number; curbSoundFileCount: number;
  newRuntimeDependencyCount: number;
};
export function readImageSize(bytes: Uint8Array): { widthPx: number; heightPx: number } | undefined;
export function initialDownloadFiles(indexHtml: string): string[];
export function embeddedPayloads(jsText: string): { mimeType: string; bytes: Uint8Array }[];
export function measureAssetBudget(paths: { distDir: string; recordPath: string; packageJsonPath: string }): AssetBudgetRecord;
```

| Campo | Como é medido |
|---|---|
| conjunto do download inicial | `index.html` de `dist/` e todo arquivo da mesma origem que ele manda buscar ao abrir: `script[src]` e `link[href]` com `rel` `stylesheet`, `modulepreload`, `icon` ou `preload`. `apple-touch-icon` e `og:image` não contam: o navegador não os busca ao abrir |
| `initialDownloadBytes` | soma do tamanho em gzip de cada arquivo do conjunto, cada um contado uma vez — medida compatível com a linha de base de NFR-0001 (HTML, JS e CSS de `dist/` somam hoje cerca de 187 kB nela; [ADR-0003](../adr/ADR-0003-lacunas-do-f-spec-resolvidas-no-projeto.md)). `PASS` exige menos de 3.000.000 |
| os 4 arquivos em `dist/` | para cada `assetRole` de `feature-assets.json`, a forma entregue é achada pelo SHA-256 `deliveredSha256` (o Vite não altera os bytes), de um de dois modos: **como arquivo** — um arquivo de `dist/` com esse resumo (o ícone e a capa); ou **embutida** — uma carga de `embeddedPayloads` de um arquivo `.js` de `dist/` cujos bytes têm esse resumo (as duas gravações, [ADR-0001](../adr/ADR-0001-arquivos-versionados-e-pedidos-pelo-documento.md)) |
| `embeddedPayloads` | pura: todo literal `data:<tipo>;base64,<carga>` do texto de um JS, com o tipo e os bytes da carga decodificada; lista vazia quando não há nenhum |
| `assetCount` | quantos dos 4 foram achados, de um modo ou do outro; `PASS` exige 4 |
| `assetsInInitialDownloadCount` | quantos dos achados estão no download inicial: o arquivo pertence ao conjunto, ou o JS que traz a carga embutida pertence ao conjunto; `PASS` exige 4 |
| `featureAssetBytes` | soma dos bytes da forma entregue de cada achado: o tamanho do arquivo, ou o número de bytes da carga decodificada; `PASS` exige no máximo 300.000. O texto em base 64 que transporta as gravações não é contado aqui: pesa em `initialDownloadBytes`, dentro do gzip do JS |
| `coverWidthPx` | largura lida do cabeçalho do arquivo da capa por `readImageSize` (PNG: `IHDR`; JPEG: marcador de início de quadro); 0 se a capa não foi achada |
| `curbSoundFileCount` | arquivos de `dist/` com extensão de áudio (`.mp3`, `.ogg`, `.oga`, `.wav`, `.m4a`, `.aac`, `.flac`, `.opus`, `.weba`), mais as cargas de `embeddedPayloads` com tipo `audio/…` nos JS de `dist/`, cujo resumo não é o do motor nem o do pneu. Todo som além dos dois conta, entregue como arquivo ou embutido: a feature só admite os dois. Com as gravações embutidas, `dist/` não tem arquivo de áudio algum |
| `newRuntimeDependencyCount` | nomes em `dependencies` de `package.json` que não estão em `runtimeDependenciesBaseline` |

Primeiro motivo de `FAIL`, nesta ordem: `BASELINE_MISSING` (registro ausente, ilegível ou sem
`runtimeDependenciesBaseline`), `ASSET_MISSING`, `ASSET_NOT_IN_INITIAL_DOWNLOAD`, `BUDGET_EXCEEDED`,
`INITIAL_DOWNLOAD_EXCEEDED`, `COVER_TOO_NARROW`, `CURB_SOUND_FILE_PRESENT`, `NEW_RUNTIME_DEPENDENCY`.

`scripts/asset-budget.ts`: chama `measureAssetBudget` com `dist`, `src/assets/feature-assets.json` e
`package.json`, escreve o registro numa linha em `stdout` e termina com código 0 em `PASS` e 1 em `FAIL`.
Roda depois de `npm run build`: `npm run build && npm run check:assets`. Sem `dist/`, o registro sai com
`FAIL` e `ASSET_MISSING`; a ausência do registro nunca vale como aprovação.

### Registro de aparelho — `docs/apresentacao-e-som-device-log.md`

Uma linha por execução: identificador do roteiro (`E2E-nn`, lista em [test-strategy.md](../test-strategy.md)),
data, aparelho e navegador nomeados com versão, build (o nome do JS em `dist/assets/`), o que foi medido e o
resultado. Os roteiros de taxa de quadros registram o notebook e o celular de referência de RNF03 pelo nome;
uma execução em desktop não preenche a linha de celular (I9).

## Colaboradores

- `measureAssetBudget` lê arquivos com `node:fs`, calcula gzip com `node:zlib` e SHA-256 com `node:crypto`,
  e decodifica as cargas embutidas com `Buffer`; não lê rede nem relógio.
- Os registros de `npm test` usam `src/lap.ts`, `src/physics.ts`, `src/audio.ts` e `src/soundOutput.ts` pelas
  operações públicas, e os ajudantes de teste que já existem.
- A etapa de deploy roda `check:assets` sobre o build candidato e anexa o registro.

## Estado e concorrência

Nenhum estado. Cada registro é função do build e da sequência de entradas: repetir a verificação sobre o
mesmo build dá o mesmo registro; uma execução nova substitui a leitura anterior, sem acumular. O script não
escreve arquivo.

## Comportamento em falha

| Falha | Comportamento |
|---|---|
| `dist/` ausente, registro de origem ausente, `package.json` ilegível | registro com `FAIL` e o motivo; código de saída 1 |
| cabeçalho de imagem que `readImageSize` não reconhece | `coverWidthPx` 0 e `COVER_TOO_NARROW` |
| exceção inesperada no script | mensagem em `stderr` com o caminho relativo do arquivo que falhou, código de saída 1; nenhum registro `PASS` é emitido |
| linha de base de simulação ausente | `SIM_STATE_UNCHANGED` com `FAIL` e `BASELINE_MISSING` |

O que é escrito em log: caminhos relativos, contagens e resumos; nunca conteúdo de arquivo, nome de máquina,
nome de usuário ou caminho absoluto (I6).

## Feature flag

Nenhuma: são verificações, fora do jogo publicado; não mudam comportamento algum.

## Pontos em aberto

Nenhum.
