---
id: DM-0001
title: Registro de origem dos arquivos entregues e estado do som em memória
feature: apresentacao-e-som
stage: dspec
status: validated
version: 1.1.0
sources: [RULE-0003, API-0002, API-0003, REQ-FEAT-0001-03, REQ-FEAT-0002-05, REQ-FEAT-0003-10, REQ-FEAT-0004-06, REQ-FEAT-0005-02, REQ-FEAT-0005-10, REQ-FEAT-0005-13]
---

# DM-0001 — Registro de origem dos arquivos entregues e estado do som em memória

A feature não tem banco, não grava nada no armazenamento do navegador e não muda arquivo de pista, replay nem
dado de jogador (D-DS-02 não se aplica: nenhum contrato publicado muda de versão). Há dois dados novos: um
arquivo de registro versionado no repositório, lido só por verificações, e o estado do som em memória, que
morre com a página.

## 1. `src/assets/feature-assets.json` — registro de origem

Arquivo JSON versionado junto das formas entregues. Diz de onde veio cada um dos 4 arquivos, como foi
derivado e qual era a lista de dependências de execução antes da feature. Nenhum módulo do jogo o importa:
não entra no build. A forma do registro não muda com a rota de entrega das gravações: `schemaVersion`
continua 1 e nenhum campo entra. Leem-no `npm test` e a medida do build
([DES-0004](../web/DES-0004-verificacoes-registros-e-medida-do-build.md)).

| Campo | Tipo | Unidade | Obrigatório | Restrição e motivo (D-DS-04) |
|---|---|---|---|---|
| `schemaVersion` | inteiro | — | sim | `1`; uma mudança de forma sobe o número (I3) |
| `assets` | lista | — | sim | exatamente 4 entradas, uma por `assetRole` |
| `assets[].assetRole` | enum `ICON_IMAGE`, `COVER_IMAGE`, `ENGINE_LOOP`, `TIRE_SCREECH` | — | sim | único na lista; é o enum do F-Spec |
| `assets[].sourcePath` | texto | — | sim | o arquivo de origem nomeado por RULE-0003, relativo à raiz |
| `assets[].sourceSha256` | texto hexadecimal, 64 caracteres | — | sim | resumo do arquivo de origem; prova que a origem é a nomeada |
| `assets[].deliveredPath` | texto | — | sim | a forma entregue, em `src/assets/` |
| `assets[].deliveredSha256` | texto hexadecimal, 64 caracteres | — | sim | resumo da forma entregue; a medida do build acha a forma entregue em `dist/` por ele — como arquivo (as imagens) ou como bytes embutidos no JS (as gravações) |
| `assets[].deliveredBytes` | inteiro | bytes | sim | tamanho da forma entregue |
| `assets[].transform` | enum `COPY`, `RESIZE_REENCODE` | — | sim | `COPY`: bytes idênticos aos da origem; `RESIZE_REENCODE`: só redimensionamento, conversão de formato e compressão (RULE-0003) |
| `assets[].widthPx`, `assets[].heightPx` | inteiro | px | só nas imagens | dimensões da forma entregue |
| `runtimeDependenciesBaseline` | lista de texto | — | sim | os nomes em `dependencies` de `package.json` antes da feature: `["three"]` (`package.json:16` no commit `5a0dfb3`); linha de base de `newRuntimeDependencyCount` |

Valores das 4 entradas (origem medida nesta rodada; a forma entregue é produzida pela etapa de código, que
preenche os resumos e os bytes reais):

| `assetRole` | `sourcePath` | Origem | `deliveredPath` | `transform` | Forma entregue | Teto de bytes |
|---|---|---|---|---|---|---|
| `ICON_IMAGE` | `docs/art/icon.png` | PNG 2048 × 2048, opaco, 5.233.536 bytes | `src/assets/icon.png` | `RESIZE_REENCODE` | PNG 192 × 192, RGB de 8 bits, sem canal alfa | 45.000 |
| `COVER_IMAGE` | `docs/art/cover.png` | PNG 2752 × 1536, opaco, 6.161.514 bytes | `src/assets/cover.jpg` | `RESIZE_REENCODE` | JPEG 1200 × 670, qualidade 80, sem recorte | 100.000 |
| `ENGINE_LOOP` | `docs/sfx/engine-loop.mp3` | 70.998 bytes | `src/assets/engine-loop.mp3` | `COPY` | os mesmos bytes | 70.998 |
| `TIRE_SCREECH` | `docs/sfx/tire-screech.mp3` | 44.389 bytes | `src/assets/tire-screech.mp3` | `COPY` | os mesmos bytes | 44.389 |

A soma dos tetos é 260.387 bytes, abaixo dos 300.000 de REQ-FEAT-0005-02. Ensaio desta rodada com as mesmas
transformações: ícone 36.674 bytes e capa 72.701 bytes, isto é, 224.762 bytes nos 4 arquivos. 1200 × 670
preserva a proporção de 2752 × 1536 (670 = 1536 × 1200 / 2752, arredondado), portanto nada é recortado. As
duas imagens passam de 4.096 bytes, o limite abaixo do qual o Vite embutiria o arquivo em vez de emiti-lo:
saem como arquivos em `dist/assets/`. As duas gravações são embutidas no JS de propósito, pela importação
`?inline`, qualquer que seja o tamanho
([ADR-0001](../adr/ADR-0001-arquivos-versionados-e-pedidos-pelo-documento.md)): a forma entregue continua
sendo o arquivo MP3 de `src/assets/`, e é ele que `deliveredSha256`, `deliveredBytes` e o teto descrevem. O
texto em base 64 que o transporta mede 94.664 e 59.188 caracteres (153.852 no total, medidos nesta rodada);
mesmo contando esse texto no lugar dos bytes, a soma com o ensaio das imagens é 263.227, abaixo dos
300.000.

Chave e unicidade: `assetRole` é a chave; não há índice. O arquivo é escrito à mão pela etapa de código, uma
vez, e reescrito só se uma forma entregue mudar.

O registro da inspeção visual (data e nome de quem inspecionou) **não** fica neste arquivo: fica no registro
de aparelho, que é escrito por pessoas ([DES-0005](../security/DES-0005-privacidade-rede-e-licenca.md)).

## 2. Estado do som em memória

Vive em `RaceAudio` ([DES-0003](../web/DES-0003-saida-de-audio-gravacoes-e-controle-de-som.md)) e em
`SoundDecisionState` ([DES-0002](../web/DES-0002-decisao-do-estado-do-som-motor-e-pneu.md)). Nada disto é
gravado: recarregar a página volta tudo ao valor inicial (REQ-FEAT-0003-08).

| Dado | Tipo | Unidade | Valor inicial | Quem muda |
|---|---|---|---|---|
| `soundOn` | booleano | — | `false` | só `RaceAudio.setSoundOn` |
| buffer decodificado do motor, buffer do pneu | `AudioBuffer` ou ausente | — | ausente | `RaceAudio.loadRecordings`, uma vez, a partir do texto embutido no JS |
| limites de repetição de cada gravação | `{loopStartS, loopEndS}` | s | ausente | `RaceAudio.loadRecordings`, uma vez |
| `SoundDecisionState.output` | `SoundOutput` (os 8 campos de API-0002) | — | `soundOn` falso, `ENGINE_SILENT`, `TIRE_SILENT`, razão 1, ganhos 0 | `decideSoundOutput` |
| `SoundDecisionState.stepReading` | `{simStepCount, speedMps, throttleNorm, tireMarkingAsphalt}` ou ausente | passos, m/s, fração, — | ausente | `decideSoundOutput`, quando o `simStepCount` lido é outro |
| instante do último reposicionamento aceito | número ou ausente | ms do relógio do quadro | ausente | `src/main.ts`, ao aceitar `repositionKart` |

## Plano de migração

Nenhuma revisão de esquema: o projeto não tem banco nem ferramenta de migração (diretrizes do estágio), e a
feature não muda dado persistido. `feature-assets.json` nasce em `schemaVersion` 1.

Reversão, em passos executáveis: (1) reverter o commit que entrega a feature; (2) `npm run build`; (3)
publicar. O documento volta a não declarar ícone nem capa, `src/assets/` deixa de existir e o motor volta a
ser o tom sintetizado. Nenhum dado de jogador é tocado na ida nem na volta (I5).

## Carga inicial

Nenhuma. Não há dado antigo a converter.

## Janela de compatibilidade

A publicação é estática e os nomes em `dist/assets/` carregam o resumo do conteúdo. Um documento antigo ainda
em cache pede o JS antigo e não conhece os arquivos novos; um documento novo pede o JS novo, que traz as
duas gravações dentro dele, e as 2 imagens.
As duas gerações convivem sem coordenação, e a troca não exige parada.

## Retenção e privacidade

| Pergunta | Resposta |
|---|---|
| O que é guardado no navegador | nada: nem `soundOn`, nem os buffers, nem preferência alguma |
| Por quanto tempo | os dados em memória duram enquanto a página está aberta |
| O que é guardado no repositório | os 4 arquivos de origem, as 4 formas entregues e `feature-assets.json`; nenhum carrega dado pessoal (I6, D-DS-04) |
| O que nunca é guardado nem transmitido | identificador de jogador, áudio do microfone, histórico de uso do som; a feature não transmite nada |

## Pontos em aberto

Nenhum.
