---
id: DES-0007
title: Privacidade — sem rede, sem persistência, sem dado pessoal no modelo, nos registros de teste e na linha de base — implementação
feature: modelo-kart-01
stage: code
status: validated
version: 1.0.0
sources: [API-0001, API-0002, API-0003, FEAT-0006, REQ-FEAT-0006-01, REQ-FEAT-0006-02, REQ-FEAT-0006-03, REQ-FEAT-0006-04, REQ-FEAT-0006-06, NFR-0002, NFR-0003, NFR-0005, NFR-0006]
---

# DES-0007 — Privacidade: sem rede, sem persistência, sem dado pessoal — implementação

Restrição obedecida por DES-0001 a DES-0006 e DM-0001; nenhum módulo novo. Não há sessão nem papel (o único é `player`, anônimo);
nenhum segredo existe e nenhum valor é lido do ambiente. A afirmação por símbolos (`tests/modelo-kart-01-contract.test.ts`) é do
estágio de testes; a conferência desta rodada foi por leitura dos arquivos escritos.

## Realização por requisito

| Requisito | Arquivo e símbolo |
|---|---|
| REQ-FEAT-0006-01; NFR-0005 | `src/kart01Model.ts`, `src/kart01Decals.ts`, `src/kartPose.ts`, `src/gameCamera.ts`, `src/main.ts`: sem `fetch`, `XMLHttpRequest`, `WebSocket`, `localStorage`, `sessionStorage`, `indexedDB`, `navigator.sendBeacon` (os existentes de `src/main.ts` — `navigator.share`, `navigator.clipboard` — são da `dirigibilidade` e não mudam) |
| REQ-FEAT-0006-02, -03; NFR-0003 | `package.json` (`dependencies` só `three` `^0.186.1`); os módulos novos importam só `three`, `three/addons/utils/BufferGeometryUtils.js` e `./…` |
| REQ-FEAT-0006-04, -06; NFR-0006 | `src/kart01Model.ts`, `src/kartPose.ts`, `src/gameCamera.ts` sem `document`, `window`, `Date`, `performance`, `Math.random`, `requestAnimationFrame`, `setTimeout`, `setInterval`; nenhum módulo da simulação importa os módulos novos; `src/physics.ts`, `src/lap.ts`, `src/track.ts` intactos |
| API-0001, API-0003 | `src/kartPose.ts` `getKartPose` e `src/gameCamera.ts` `computeCameraView`: leituras puras do estado e do quadro; nada sai do processo |
| API-0002; NFR-0002 | `scripts/kart01-baseline.ts` (sem `os.hostname`, `os.userInfo`, caminho absoluto; `recordedAtUtc` por `new Date()` é a única leitura de relógio, num programa; o fixture carrega números da simulação, identificadores e um sha); `tests/fixtures/kart01-sim-baseline.json`; `docs/kart-01/device-log.md` (aparelho pelo modelo comercial, sem identificador de jogador) |

## Pontos de verificação

| Fronteira | Onde | O que atravessa |
|---|---|---|
| Tela (WebGL) | `src/main.ts` `frame` (`renderer.render`) | a cena; nenhuma leitura de tela |
| `canvas` 2D dos decalques | `src/kart01Decals.ts` `plateTexture`, `sidepodTexture` | os textos constantes `01` e `KARTLE`; sem `toDataURL`, sem `getImageData` |
| `scripts/kart01-baseline.ts` → fixture | `main`, `writeFileSync` | `inputRuns`, estados, `recordedAtUtc`, `recordedOnCommit` (passado por `--commit`) |
| Texto de `src/physics.ts` | `scripts/kart01-baseline.ts` `inputTypeLine` | só a linha `export type Input =`, lida com `node:fs`, nunca executada |
| stdout do gravador | `scripts/kart01-baseline.ts` `main` | `setupId`, `setupVersion`, contagem de passos, validade, `lapMs` e o caminho relativo do fixture |
| Registro em log do jogo | `src/kart01Decals.ts` `paintKart01Decals` | `console.warn('kart01-decals', 'NO_2D_CONTEXT')`: só o código |
