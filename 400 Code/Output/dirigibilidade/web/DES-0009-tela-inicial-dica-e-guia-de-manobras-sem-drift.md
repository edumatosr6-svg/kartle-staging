---
id: DES-0009
title: Tela inicial, dica da barra de ferramentas e guia de manobras sem drift nem turbo — implementação
feature: dirigibilidade
stage: code
status: validated
version: 1.0.0
sources: [SCR-0003, FEAT-0003, FEAT-0006, REQ-FEAT-0003-10, REQ-FEAT-0003-18, REQ-FEAT-0003-19, REQ-FEAT-0003-20, REQ-FEAT-0006-01, NFR-0005]
---

# DES-0009 — Tela inicial, dica e guia de manobras sem drift — implementação

`index.html` e `src/style.css`, camada aplicação, alterados na rodada de código 6 só por remoção (projeto DES-0009 1.0.0), sem texto
novo no lugar. `src/main.ts` não muda por este item (`:33`, troca de `#welcome` sem WebGL, intacto).

## Realização por requisito

| Requisito | Arquivo e símbolo |
|---|---|
| REQ-FEAT-0003-18 | `index.html:19` `#welcome`: saem o `<h2>Entre de lado. Saia voando.</h2>`, a frase "Acelere, encaixe o drift e solte para dar o impulso." com o `<br />` e o trecho " · Espaço + curva para drift" do `<small>`; ficam a `.eyebrow`, o `<p>` "Seu próximo recorde começa na curva.", `#track-selector`, `#track-credit`, `#track-status`, `#lap-offer` e `<small>WASD / setas</small>`, na mesma ordem |
| REQ-FEAT-0003-19 | `index.html:34` `.control-hint`: o texto passa de "Dirigir · Espaço: drift → turbo" a "Dirigir"; as quatro `.key` e `<div class="actions">` (`#sound`, `#tilt`, `#reset`, `#pause`, `#lap-end-training`) não editados |
| REQ-FEAT-0003-20 | `index.html`: a `<section class="maneuver-guide">` inteira retirada (estado Vazio de SCR-0003); `.toolbar` (`:34`) segue direto para `<details class="physics-panel">` (`:35`); `src/style.css:3` sem `.maneuver-guide{…}`, `>div`, `>div>span`, `p`, `strong` e sem a ocorrência dentro de `@media(max-width:700px)`; `.welcome h2` fica |
| REQ-FEAT-0003-10, REQ-FEAT-0006-01, NFR-0005 | só remoção de marcação e estilo; nenhuma regra na renderização nem no adaptador de controle |

`index.html` não casa `/drift|turbo|impulso|combo|Espaço/i`.
