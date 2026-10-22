---
id: DES-0007
title: Privacidade — sem rede, sem persistência, sem dado pessoal no modelo, nos registros de teste e na linha de base
feature: modelo-kart-01
stage: dspec
status: validated
version: 1.0.0
sources: [API-0001, API-0002, API-0003, FEAT-0006, REQ-FEAT-0006-01, REQ-FEAT-0006-02, REQ-FEAT-0006-03, REQ-FEAT-0006-04, REQ-FEAT-0006-06, NFR-0002, NFR-0003, NFR-0005, NFR-0006]
---

# DES-0007 — Privacidade: sem rede, sem persistência, sem dado pessoal

## Realiza

A parte de I6 e de D-DS-04/D-DS-06 dos `REQ-*` em `sources`: os contratos são públicos dentro do cliente, sem
sessão e sem papel além de `player` anônimo (API-0001 a API-0003, Auth; RNF10); nada desta feature usa rede
ou armazenamento do navegador (REQ-FEAT-0006-01; RNF08); nenhuma dependência nova (REQ-FEAT-0006-02, -03);
os módulos novos ficam fora da simulação e esta não os importa (REQ-FEAT-0006-04, -06); a saída de `npm test`,
a linha de base e o registro em tela não carregam segredo, identificador real de jogador nem nome de máquina
ou de usuário.

## Posicionamento

Camada **Aplicação** (`src/main.ts`, `src/kart01Model.ts`, `src/kart01Decals.ts`, `src/kartPose.ts`,
`src/gameCamera.ts`) com a verificação de símbolos em `tests/modelo-kart-01-contract.test.ts`, no molde de
`tests/race-lap-validation-layering.test.ts`. Nenhum módulo novo neste item.

## Interface

Pontos de verificação. Não há sessão nem papel: o único papel é `player`, anônimo; não há ponto de verificação
de sessão nem de RBAC porque não há autenticação no produto (RNF10). Em `web-mobile` o cliente é o mesmo:
nenhum dado em repouso e nenhuma sessão, logo nada expira (diretriz do estágio, `<mobile>` não usado).

| Fronteira | O que atravessa | Validação | Onde |
|---|---|---|---|
| Tela (WebGL) | a cena: modelo, câmera, efeitos | nada sai do processo; nenhuma leitura de tela é feita pelo jogo | `src/main.ts` |
| `canvas` 2D dos decalques | o texto `01` e `KARTLE`, constantes | nenhuma entrada do Jogador ou do ambiente; sem `toDataURL`, sem leitura de píxeis | `src/kart01Decals.ts` |
| `tests/fixtures/kart01-sim-baseline.json` → `readSimBaseline` | JSON do repositório | `JSON.parse` em `try`; só os campos de [DM-0001](../data/DM-0001-linha-de-base-da-simulacao-e-registro-em-tela.md); versão desconhecida é `BASELINE_MISSING`, nunca lida parcialmente; `inputRuns` só com `throttle`, `brake`, `steer` finitos e `drift` booleano, teto de `MAX_LAP_STEPS` (6 000) passos por execução, excesso é `BASELINE_MISSING` | `tests/helpers/kart01Report.ts` |
| Texto de `src/physics.ts` e dos módulos da simulação | texto dos módulos | lido com `node:fs` só para contar importações e comparar a linha de `Input`; nunca executado nem impresso | `tests/helpers/kart01Report.ts` |
| stdout de `npm test` | registros de API-0002 | só os campos do contrato; nenhum caminho de arquivo absoluto, nome de máquina ou de usuário | `tests/helpers/kart01Report.ts` (`serializeRecord`) |
| `docs/kart-01/device-log.md` | aparelho (modelo comercial), navegador e versão, orientação, contagens de quadros, commit do build | sem identificador de jogador, sem conta, sem dado de localização; mesma prática de `docs/lap-validation-device-log.md` | etapa de código e de testes |
| `scripts/kart01-baseline.ts` → fixture | `inputRuns`, estados, `recordedAtUtc`, `recordedOnCommit` | sem `os.hostname()`, `os.userInfo()`, caminho absoluto ou nome de usuário | `scripts/kart01-baseline.ts` |

Registro em log: `console.warn` com códigos apenas (`kart01-decals`/`NO_2D_CONTEXT`, mais os existentes de
`race-lap-validation` e `dirigibilidade`); nunca conteúdo de registro, pose ou texto.

Segredos: nenhum existe nesta feature; nenhum valor é lido do ambiente.

## Colaboradores

É a restrição que [DES-0001](../web/DES-0001-modelo-kart-01-montagem-agrupamento-e-decalques.md) a
[DES-0006](../web/DES-0006-verificacoes-de-npm-test-e-relatorio-do-modelo.md) obedecem; verificada por
`tests/modelo-kart-01-contract.test.ts`.

## Estado e concorrência

Sem estado. Nada é persistido no navegador (`localStorage`, `sessionStorage`, IndexedDB) nem enviado pela
rede por esta feature; o único arquivo gravado é o fixture, por um programa fora de `npm test`.

## Comportamento em falha

Um fixture fora de forma é `BASELINE_MISSING`, sem lançar. Um `canvas` sem contexto 2D deixa a placa sem
número, sem lançar e sem expor nada além do código no `console.warn`.

## Observabilidade

`tests/modelo-kart-01-contract.test.ts` afirma que `src/kart01Model.ts`, `src/kart01Decals.ts`,
`src/kartPose.ts`, `src/gameCamera.ts` e `src/main.ts` não contêm `fetch`, `XMLHttpRequest`, `WebSocket`,
`localStorage`, `sessionStorage`, `indexedDB`, `navigator.sendBeacon` (a lista `NETWORK_OR_STORAGE` de
`tests/race-lap-validation-layering.test.ts`); que `src/kart01Model.ts`, `src/kartPose.ts` e
`src/gameCamera.ts` não contêm `document`, `window`, `Date`, `performance`, `Math.random`,
`requestAnimationFrame`, `setTimeout`, `setInterval` (lista `DOM_CLOCK_RANDOM`); que `src/kart01Decals.ts`
não contém `toDataURL` nem `getImageData`; que `tests/helpers/kart01Report.ts` e `scripts/kart01-baseline.ts`
não contêm `os.hostname` nem `os.userInfo`; e que `package.json` declara exatamente `three` como dependência
de execução, na versão `^0.186`.

## Determinismo (D-DS-07)

Não é código de simulação; a restrição de símbolos protege o determinismo dos módulos puros
(`src/kartPose.ts`, `src/gameCamera.ts`, `src/kart01Model.ts` sem relógio nem sorteio), afirmado pelo mesmo
teste.

## Feature flag

Nenhuma: proteção do que não muda.

## Pontos em aberto

Nenhum.
