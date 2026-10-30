---
id: DES-0012
title: Privacidade, rede, crédito OSM/ODbL e licença Esri — implementação
feature: pista-kart-park
stage: code
status: validated
version: 1.1.0
sources: [FEAT-0001, FEAT-0006, FEAT-0007, RULE-0005, REQ-FEAT-0001-03, REQ-FEAT-0001-12, REQ-FEAT-0006-12, REQ-FEAT-0006-14, REQ-FEAT-0007-05, REQ-FEAT-0007-13]
---

# DES-0012 — Privacidade, rede, crédito OSM/ODbL e licença Esri — implementação

Restrição obedecida por DES-0001 a DES-0011 e DM-0001/DM-0002; nenhum módulo novo. Não há sessão de usuário nem papel além de
`player` anônimo; nenhum segredo, variável de ambiente, chave ou credencial é lido no cliente nem no preparo offline. Conferência
desta rodada por leitura dos arquivos escritos e pelo teste de camada existente (`tests/race-lap-validation-layering.test.ts` verde
com o `src/main.ts` novo); a extensão da lista aos módulos novos (`tests/pista-kart-park-layering.test.ts`) é do estágio de testes.

## Realização por requisito

| Requisito | Arquivo e símbolo |
|---|---|
| REQ-FEAT-0001-03, -12 | `src/trainingSession.ts` e `src/main.ts`: nenhum `localStorage`, `sessionStorage`, `indexedDB`, cookie, nem registro de desafio; a abertura seleciona `OPENING_TRACK_ID` na carga (`src/main.ts:669`), não lembra nada |
| REQ-FEAT-0007-05 | arquivo empacotado por `import ... from './tracks/kart-park-v1.json?raw'` (`src/main.ts:14`; presente no `dist/assets/index-hfMcla9y.js`); `src/trainingSession.ts`, `src/trackGeometry.ts`, `src/trackScene.ts`, `src/curbFeedback.ts`, `src/lapMessages.ts`, `src/main.ts` sem `fetch`, `XMLHttpRequest`, `WebSocket`, `navigator.sendBeacon`; o link do crédito é um `a` com `target="_blank"` e `rel="noopener noreferrer"` (`src/main.ts:219-221`), navegação do Jogador em outra aba |
| REQ-FEAT-0006-12 | crédito de literais locais (`src/lapMessages.ts:80-84`), exibido sem rede no seletor (`#track-credit`) e, desde a rodada 4 (DES-0012 1.0.2, ADR-0007), no painel do resultado de cada volta do treino (`#lap-training-result-credit`, `index.html:26`, `src/main.ts:484`), não mais em `#lap-result`; o link do painel abre outra aba e a perda de foco pausa o treino pela regra de `race-lap-validation`, sem gravar nada |
| REQ-FEAT-0007-13; REQ-FEAT-0006-14; RULE-0005 | `scripts/track-pipeline.ts` `promote` só com `--esri-decision` (`:48-56`, `:151-160`); `tracks/registry.json` em `STAGING`; a promoção humana e a lista de verificação da release são da etapa de deploy; crédito da Esri na entrega que promover (sem chave) |
| FEAT-0001; FEAT-0006; FEAT-0007 | nenhuma chave de configuração, de compilação ou de tempo de execução (ADR-0005); catálogo fixo (`src/trainingSession.ts:12-16`) |

## Dados tratados (D-DS-04)

| Dado | Onde vive | Persistido ou transmitido |
|---|---|---|
| arquivo da Kart Park | `src/tracks/kart-park-v1.json`, no pacote | publicado com o jogo; nunca enviado pelo cliente |
| sessão de treino, leitura, ambiente | memória da página (`src/main.ts:169-178`) | não |
| `simStepCount`, `curbWheelCount`, estado do retorno | memória da página (`:177`) | não |
| registro de publicação | `tracks/registry.json` | repositório; sem dado pessoal (quem publica não é registrado) |
| canal (`pointer: coarse`) e `navigator.vibrate` | lidos na hora (`:512`, `:178`) | não |

Registro em log: só `console.warn('track-data', <status>[, trackId, trackVersion | schemaVersion])` (`src/main.ts:232-234`); o
programa offline imprime identificadores, contagens e medidas, nunca o conteúdo do arquivo nem o valor de um argumento recusado.
