---
id: DES-0005
title: Privacidade, rede, marcas de terceiros e licença — implementação
feature: apresentacao-e-som
stage: code
status: draft
version: 1.0.0
sources: [FEAT-0005, RULE-0003, REQ-FEAT-0005-03, REQ-FEAT-0005-13, REQ-FEAT-0005-16]
---

# DES-0005 — Privacidade, rede, marcas de terceiros e licença — implementação

Item transversal, sem módulo próprio.

## Realização por requisito

| Requisito | Arquivo e símbolo |
|---|---|
| REQ-FEAT-0005-03 | `index.html:9-14` referencia só `/src/assets/icon.png` e `/src/assets/cover.jpg`, da mesma origem; as gravações não têm endereço (`src/main.ts:9-10`, `?inline`); `src/audio.ts` e `src/main.ts` não contêm `fetch`, `XMLHttpRequest`, `WebSocket`, `localStorage`, `sessionStorage`, `indexedDB`, `navigator.sendBeacon` nem `EventSource`, em código, texto entre aspas ou nome montado, e não criam elemento `<audio>`; `src/main.ts` sem `import(`; CHK-TEST-0011-02 e CHK-TEST-0013-03 aprovadas como estão; `RaceAudio.loadRecording` (`src/audio.ts:78-89`) decodifica o que já está em memória, uma vez |
| REQ-FEAT-0005-13 | nenhum código: inspeção E2E-12 sobre `src/assets/icon.png` (SHA-256 `c4159544…ca28c`) e `src/assets/cover.jpg` (`28ed9c01…e9e40`), registrada pela etapa de testes em `docs/apresentacao-e-som-device-log.md`; os resumos estão em `src/assets/feature-assets.json` |
| REQ-FEAT-0005-16 | nenhum código: condição de liberação da etapa de deploy; o build é o mesmo para staging e produção, sem chave nem variável de ambiente |

Os avisos de `console.warn` desta feature levam só identificadores: `sound-recording` com `ENGINE_LOOP` ou `TIRE_SCREECH` e
`decode` ou `unsupported`; `sound-output` com `audio-unavailable`. Nunca o texto embutido nem conteúdo.
