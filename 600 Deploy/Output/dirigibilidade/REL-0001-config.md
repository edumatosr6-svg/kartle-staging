---
id: REL-0001
title: Configuração de ambiente — nomes e significados, nunca valores
feature: dirigibilidade
stage: deploy
status: validated
version: 1.0.0
sources: [DES-0008, NFR-0005, TEST-0010]
---

# REL-0001 — Configuração de ambiente

## O cliente continua sem ler configuração

A página não lê variável de ambiente, chave, credencial nem arquivo de configuração em tempo de execução nem de build;
esta feature não muda isso:

| Evidência | Resultado |
|---|---|
| `import.meta.env` ou `process.env` em `src/`, `scripts/` e `index.html` | 0 ocorrências na aplicação (a feature acrescenta `src/setupRecords.ts`, `src/handlingMessages.ts` e `scripts/handlingBench.ts`, todos puros) |
| `fetch`, `WebSocket`, `sendBeacon`, `localStorage`, `sessionStorage`, `indexedDB`, `Date`, `performance`, `Math.random` nos módulos de simulação (`src/physics.ts`, `src/setupRecords.ts`, `scripts/handlingBench.ts`) | 0 ocorrências, garantido por `CHK-TEST-0010-*` (NFR-0005); o relógio de parede e `runtimeId()` ficam só em `scripts/keyboard-lap.ts`, que não entra no bundle |
| Projeto validado | DES-0008: "os módulos de simulação continuam sem rede e sem armazenamento"; `runtimeId()` sem `os.hostname()` nem `os.userInfo()` |
| Diretivas do estágio | "Configuração e secrets: none in the MVP client" |

Não há, portanto, arquivo `.env`, template de configuração nem segredo a gerenciar. Nenhum valor — real, de exemplo ou de
preenchimento — aparece neste estágio (D-DP-05).

## O que a hospedagem usa — nenhuma variável de ambiente

O mesmo da release anterior (`600 Deploy/Output/race-lap-validation/REL-0001-config.md`), inalterado: o workflow
`.github/workflows/pages.yml` não declara `env:`, não lê `secrets.*` e não recebe `inputs`. Os únicos dados de
configuração são dois, nenhum deles segredo e nenhum deles escrito neste repositório:

| Entrada | Para que serve | Quem define | Obrigatória | Onde vive |
|---|---|---|---|---|
| Nome do repositório (`github.event.repository.name`) | base dos caminhos do bundle (`--base=/kartle/` ou `/kartle-staging/`) e a URL: `https://edumatosr6-svg.github.io/kartle/` é produção, `https://edumatosr6-svg.github.io/kartle-staging/` é staging | o GitHub, a partir do repositório em que o workflow corre | sim (fornecida pelo evento) | contexto da execução |
| Ambiente `github-pages` | onde o trabalho `deploy` publica; em produção leva o **revisor obrigatório** `edumatosr6-svg`, em staging nenhum; em staging a política de ramos tem de admitir o ramo `staging` (`REL-0003`) | dono do produto, em Settings → Environments — **feito** em 2026-10-21 nos dois repositórios | sim | configuração do repositório no GitHub; não é segredo |

A autenticação da publicação é o token OIDC da própria execução (`permissions: id-token: write`, `pages: write`):
nenhuma credencial é criada, guardada ou copiada (I6, D-DP-05). Remotos locais: `origin`
(`https://github.com/edumatosr6-svg/kartle`) e `staging` (`https://github.com/edumatosr6-svg/kartle-staging`), ambos
públicos (RNF12). A versão do Node vem de `.nvmrc` (`24`), lida por `node-version-file`.

## O que a feature publica como "configuração" — dado, não variável

O acerto passa a ser **dado publicado** dentro do bundle (DM-0001, seção 1): `PUBLISHED_SETUPS` em `src/physics.ts`, com
`setupId`, `setupVersion`, `previousSetupVersion` e os parâmetros do `KartConfig`. Não é configuração de ambiente: é o
mesmo valor em dev, staging e produção, versionado em código (ADR-0001), sem chave que o troque por ambiente e sem
chave para a versão anterior (DES-0007, *Feature flag*). A linha de base dos ensaios vive em `docs/physics.md` (bloco
`handling-baseline`) e é lida só pelos benches e por `npm test`, nunca pela página.
