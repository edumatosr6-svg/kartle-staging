---
id: REL-0001
title: Configuração de ambiente — nomes e significados, nunca valores; nenhuma chave para a Kart Park
feature: pista-kart-park
stage: deploy
status: draft
version: 1.1.0
sources: [DES-0010, DES-0011, DES-0012, DM-0002, ADR-0005, NFR-0004, NFR-0010, NFR-0012, TEST-0011, TEST-0012]
---

# REL-0001 — Configuração de ambiente

## O cliente e o preparo offline continuam sem ler configuração

A página não lê variável de ambiente, chave, credencial nem arquivo de configuração em tempo de execução nem de build; o
programa de preparo (`npm run track`) também não; e o projeto validado **proíbe qualquer chave** para esta feature (ADR-0005:
nenhuma chave de configuração, de compilação ou de execução escolhe a pista de abertura, desliga a zebra ou a barreira, ou
libera a promoção — o catálogo é fixo e a Kart Park é a pista de abertura em todo artefato que contenha a feature):

| Evidência | Resultado |
|---|---|
| `import.meta.env` ou `process.env` em `src/`, `scripts/` e `index.html` | 0 ocorrências na aplicação; `scripts/track-pipeline.ts` lê só `process.cwd()`, os argumentos e o relógio (`stagedAtUtc`, `promotedAtUtc`) |
| `fetch`, `XMLHttpRequest`, `WebSocket`, `sendBeacon`, `localStorage`, `sessionStorage`, `indexedDB` nos módulos da feature (`src/trainingSession.ts`, `src/trackGeometry.ts`, `src/trackScene.ts`, `src/curbFeedback.ts`, `src/main.ts`, `src/lapMessages.ts`) | 0 ocorrências, garantido por CHK-TEST-0011-02 (lista de DES-0012); o arquivo de pista entra no JS por `import … '?raw'` (ADR-0002), por isso **não há URL de pista a configurar** |
| Projeto validado | DES-0012: "nenhuma variável de ambiente, chave ou credencial é lida, nem no cliente nem no preparo offline"; o único registro é `console.warn('track-data', …)` com códigos |
| Diretivas do estágio | "Configuração e secrets: none in the MVP client" |

Não há, portanto, arquivo `.env`, template de configuração nem segredo a gerenciar. Nenhum valor — real, de exemplo ou de
preenchimento — aparece neste estágio (D-DP-05).

## O que a hospedagem usa — nenhuma variável de ambiente

O mesmo das releases anteriores (`600 Deploy/Output/modelo-kart-01/REL-0001-config.md`), inalterado: o workflow
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

## O que a feature traz em código ou em dado e parece configuração — dado, não variável

| Dado | Onde | O que é |
|---|---|---|
| Catálogo do treino (`TRAINING_CATALOG`: `kart-park` "Kart Park — São José dos Pinhais (traçado aproximado)", `displayLengthM` 687, `osmCredit` true; `synthetic` "Pista sintética") e `OPENING_TRACK_ID` = `kart-park` | `src/trainingSession.ts:11-16` | literais congelados (REQ-FEAT-0001-01; ADR-0005); iguais em dev, staging e produção; sobrevivem à minificação como `trackId:` seguido de `kart-park`, `displayLengthM:687` e os nomes — é o que `check_bundle.py` e `check_served.py` procuram |
| Crédito (`OSM_CREDIT`: texto, "licença ODbL", `https://openstreetmap.org/copyright`) | `src/lapMessages.ts:105-109` | literal (DES-0007, DES-0012); o crédito da Esri **não existe** no código até a decisão (NFR-0012) |
| Retorno da zebra (`CURB_PULSE_MS` 20, `CURB_PULSE_INTERVAL_STEPS` 30, `CURB_SOUND_REPEAT_STEPS` 12; `CURB_SOUND` ruído com passa-baixas a 160 Hz, 60 ms) | `src/curbFeedback.ts:5-9`, `src/audio.ts:8` | constantes do projeto (DES-0009); no bundle, `vibrate(20)` e `lowpassHz:160` |
| Aderência da zebra (`CURB_GRIP_PC` 0,85) e resposta da barreira | `src/physics.ts` | constantes da simulação (DES-0003, ADR-0003, ADR-0004); provadas por CHK-TEST-0003-* e CHK-TEST-0004-* |
| Arquivo de pista (`src/tracks/kart-park-v1.json`, esquema 3, 43 013 bytes, SHA-256 `04ce5e51…`) | no JS, como literal | dado publicado e imutável (DM-0001; NFR-0006); nunca servido à parte, nunca buscado |
| Registro de publicação (`tracks/registry.json`: `kart-park` 1 `STAGING`, `stagedAtUtc` 2026-10-27T21:58:06.132Z, `prep`) | repositório | dado do preparo (DM-0002), lido por `npm test` (CHK-TEST-0012-*) e por `check_bundle.py`; **não entra no bundle**; a passagem a `PRODUCTION` é um ato humano com `--esri-decision "<referência>"` (DES-0011), não uma configuração |
| Argumento `--esri-decision <referência>` de `npm run track -- promote` | linha de comando, só no ato de promover | a referência (identificador e data) da decisão registrada em `DOMAIN.md`; 1 a 200 caracteres sem caractere de controle (DES-0010); gravada em `esriDecisionRef`; **não é segredo e não é variável de ambiente** — é a prova, no repositório, de que a promoção foi decidida (ADR-0005). Hoje não existe: a entrada está em `STAGING` |
| Regra byte-exata dos arquivos de pista | `.gitattributes` (`5ed7a5b`): `tracks/sources/*.json -text`, `src/tracks/*.json -text`, `tracks/registry.json -text` | atributo de git, não variável nem segredo: impede a normalização do fim de linha, para que o resumo registrado seja o dos bytes do blob; conferido por `git ls-files --eol` (`runbook.md`, *Promote* 1) |
| Registro em tela | `docs/kart-park-device-log.md` (a criar pelo dono do produto) | prosa com tabelas, lida por pessoas; não é lida pela página |
