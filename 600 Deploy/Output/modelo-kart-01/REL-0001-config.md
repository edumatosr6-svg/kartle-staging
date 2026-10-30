---
id: REL-0001
title: Configuração de ambiente — nomes e significados, nunca valores
feature: modelo-kart-01
stage: deploy
status: validated
version: 1.1.0
sources: [DES-0007, ADR-0003, NFR-0003, NFR-0005, TEST-0004]
---

# REL-0001 — Configuração de ambiente

## O cliente continua sem ler configuração

A página não lê variável de ambiente, chave, credencial nem arquivo de configuração em tempo de execução nem de build; esta
feature não muda isso — e o projeto validado proíbe qualquer chave (ADR-0003: "sem chave mestra, porque o F-Spec proíbe
configuração"; nenhuma escolha de kart, cor, adesivo ou câmera):

| Evidência | Resultado |
|---|---|
| `import.meta.env` ou `process.env` em `src/`, `scripts/` e `index.html` | 0 ocorrências na aplicação (a feature tem `src/kart01Model.ts`, `src/kart01Decals.ts`, `src/kartPose.ts`, `src/gameCamera.ts` e `scripts/kart01-baseline.ts`; nenhum lê ambiente; a revisão do seed rev 4 só **retira** código — o +4° de turbo, o jato e a âncora do escapamento — e muda o bloco das marcas em `src/main.ts`, que lê a telemetria e não o ambiente) |
| `fetch`, `XMLHttpRequest`, `WebSocket`, `sendBeacon`, `localStorage`, `sessionStorage`, `indexedDB` nos quatro módulos novos e em `src/main.ts` | 0 ocorrências, garantido por `CHK-TEST-0004-*` (lista `NETWORK_OR_STORAGE` de DES-0007); `Date`, `performance` e `Math.random` ausentes dos módulos puros (`kartPose`, `gameCamera`) |
| Projeto validado | DES-0007: "nada desta feature usa rede, persistência ou dado pessoal"; o único registro é `console.warn` com códigos (`kart01-decals`/`NO_2D_CONTEXT`) |
| Diretivas do estágio | "Configuração e secrets: none in the MVP client" |

Não há, portanto, arquivo `.env`, template de configuração nem segredo a gerenciar. Nenhum valor — real, de exemplo ou de
preenchimento — aparece neste estágio (D-DP-05).

## O que a hospedagem usa — nenhuma variável de ambiente

O mesmo das releases anteriores (`600 Deploy/Output/dirigibilidade/REL-0001-config.md`), inalterado: o workflow
`.github/workflows/pages.yml` não declara `env:`, não lê `secrets.*` e não recebe `inputs`. Os únicos dados de configuração são
dois, nenhum deles segredo e nenhum deles escrito neste repositório:

| Entrada | Para que serve | Quem define | Obrigatória | Onde vive |
|---|---|---|---|---|
| Nome do repositório (`github.event.repository.name`) | base dos caminhos do bundle (`--base=/kartle/` ou `/kartle-staging/`) e a URL: `https://edumatosr6-svg.github.io/kartle/` é produção, `https://edumatosr6-svg.github.io/kartle-staging/` é staging | o GitHub, a partir do repositório em que o workflow corre | sim (fornecida pelo evento) | contexto da execução |
| Ambiente `github-pages` | onde o trabalho `deploy` publica; em produção leva o **revisor obrigatório** `edumatosr6-svg`, em staging nenhum; em staging a política de ramos tem de admitir o ramo `staging` (`REL-0003`) | dono do produto, em Settings → Environments — **feito** em 2026-10-21 nos dois repositórios | sim | configuração do repositório no GitHub; não é segredo |

A autenticação da publicação é o token OIDC da própria execução (`permissions: id-token: write`, `pages: write`): nenhuma
credencial é criada, guardada ou copiada (I6, D-DP-05). Remotos locais: `origin` (`https://github.com/edumatosr6-svg/kartle`) e
`staging` (`https://github.com/edumatosr6-svg/kartle-staging`), ambos públicos (RNF12). A versão do Node vem de `.nvmrc` (`24`),
lida por `node-version-file`.

## O que a feature traz em código e parece configuração — dado, não variável

| Dado | Onde | O que é |
|---|---|---|
| Medidas, paleta e número do Kart 01 (`KART01_WHEELBASE_M` 1,05, rodas 0,26/0,28 m, `KART01_PALETTE`, `KART01_NUMBER` `'01'`) | `src/kart01Model.ts:21-28` | constantes da ficha do kart (`docs/kart-01/kart.js`, `DOMAIN/DEC-00`), iguais em dev, staging e produção; não há chave que as troque |
| Pose de corrida e campo de visão (`RACE_CHASE_HEIGHT_M` 1,38, `RACE_CHASE_BACK_M` 3,05, mira 3,2 m a 0,30 m, 62° vertical em paisagem, 60° horizontais mínimos em retrato, `DESCENT_HOLD_MS` 100; **sem** termo de turbo desde o seed rev 3) | `src/gameCamera.ts:41-50` | constantes do projeto (DES-0003; `DOMAIN/DEC-03`); sobrevivem à minificação como literais `=1.38,`, `=3.05,`, `=62,` e são o que `check_bundle.py` e `check_served.py` procuram |
| Limites das marcas de pneu (velocidade acima de 6 m/s, deriva em módulo acima de 0,055 rad, volta em `RUNNING`) | bloco das marcas de `src/main.ts` | constantes do projeto (DES-0005 1.4.0; seed rev 4), iguais em todo ambiente; sobrevivem à minificação como `speedMps>6&&….sideslipRad>.055`, o que `check_bundle.py` e `check_served.py` procuram |
| Linha de base da simulação (`schemaVersion` 1, `recordedOnCommit` `a361c9c…`, acertos `arcade-assistido-v6` e `realista-aluguel-4t-v4`; regravada em `07b5cfa`) | `tests/fixtures/kart01-sim-baseline.json` | fixture lido só por `npm test` e pelo gravador; **não entra no bundle** e não é configuração (DM-0001, ADR-0004) |
| Registro em tela | `docs/kart-01/device-log.md` | prosa com tabelas, lida por pessoas; não é lida pela página |
