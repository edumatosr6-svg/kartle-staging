# Registro de testes em tela — modelo-kart-01

Roteiros `E2E-nn` da estratégia de testes (`300 Specs/330 D-Specs/Output/modelo-kart-01/test-strategy.md`) e as metas de
FEAT-0004 (taxa de quadros sustentada: 60 fps no notebook, 30 fps no celular intermediário, paisagem e retrato) e NFR-0002
(download comprimido abaixo de 3 MB). Uma entrada por execução registrada; o que não foi executado fica marcado como tal —
ausência de registro nunca vale como aprovação. A contagem por segundo vem das ferramentas de desempenho do navegador ou de um
trecho colado no console contando `requestAnimationFrame` por segundo de relógio; nenhum instrumento é acrescentado ao jogo.

## Execução 1 — 2026-10-27, web-desktop, navegador embutido da sessão (Chromium), estágio de código

| | |
|---|---|
| Build | árvore de trabalho sobre o commit `b86b200d14f950baa1a902f56b6f6fbfff5082ba` (código desta feature ainda não commitado), `npx vite build`, `dist/` com `index-D0RarhFV.js` (631 352 bytes, gzip 165 033) e `index-dgojskay.css` (11 407 bytes, gzip 3 244) |
| Servidor | `vite preview` em `http://localhost:4173` |
| Aparelho e navegador | painel de navegador do Claude Desktop (Chromium), Windows 11, área de jogo 908 × 560 px, DPR não lido |
| Orientação | paisagem |
| Método da contagem | **não medido** (o painel roda como página em segundo plano: ritmo inválido, como no registro da `race-lap-validation`) |
| `fpsPerSecond` | **não medido** |
| `minFps` | **não medido** |
| Download | **não medido** (sem lista de transferências; tamanho de `dist/assets/` acima: 642 759 bytes sem compressão, 168 277 gzip) |

### Resultados por roteiro

| Roteiro | Resultado | Evidência |
|---|---|---|
| E2E-01 Kart 01 em toda exibição | **parcial — passa no que foi observado** | Antes da volta, a visão geral mostra a pista inteira com o Kart 01 na largada (pequeno); na corrida, o Kart 01 laranja com o piloto de macacão azul e capacete ocupa a região inferior do quadro; nenhum kart de caixas em nenhum quadro. Recarga e troca de orientação **não executadas**. |
| E2E-02 número 01, sombra, câmera de corrida | **parcial** | Placa `01` legível no para-choque traseiro pela câmera de corrida (1,38 m / 3,05 m); motor à direita do piloto; sombra do kart no asfalto visível junto ao kart. Medidas da pose da câmera em tela **não conferidas** com instrumento. |
| E2E-03 visão geral e descida | **passa no que foi observado** | Primeiro quadro da contagem ainda na visão geral; descida contínua durante `3`, `2`, `1`; no `VERDE` a câmera já está atrás do piloto. Duração de 3 s **não medida** (ritmo inválido). |
| E2E-04 fim da volta com câmera atrás do kart parado | **não executado** | Volta completa impraticável a ritmo reduzido. |
| E2E-05 marcas, fumaça e drift | **parcial** | `a` + Espaço segurados: `CARREGANDO DRIFT` no HUD, kart esterçando para a esquerda; marcas sob os pneus traseiros e fumaça na ponteira **não observadas** nesta execução (velocidade de 22 km/h, sem drift sustentado). |
| E2E-06 download comprimido | **não medido** | — |
| E2E-07 retrato (celular) | **não executado** | Exige aparelho em retrato. |

Nenhum erro de console durante a execução.

## Execuções nos aparelhos de referência

**Não executadas.** Notebook (60 fps, paisagem) e celular intermediário (30 fps, paisagem e retrato): uma entrada cada, com
`fpsPerSecond` de uma volta completa em corrida, aba em primeiro plano, sem pausa, e `minFps`.
