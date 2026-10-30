---
id: DES-0009
title: Tela inicial, dica da barra de ferramentas e guia de manobras sem drift nem turbo
feature: dirigibilidade
stage: dspec
status: validated
version: 1.0.0
sources: [SCR-0003, FEAT-0003, FEAT-0006, REQ-FEAT-0003-10, REQ-FEAT-0003-18, REQ-FEAT-0003-19, REQ-FEAT-0003-20, REQ-FEAT-0006-01, NFR-0005]
---

# DES-0009 — Tela inicial, dica da barra de ferramentas e guia de manobras sem drift nem turbo

## Realiza

Os `REQ-*` em `sources`: na tela inicial (REQ-FEAT-0003-18, AC-US-0003-12), na dica da barra de ferramentas
(REQ-FEAT-0003-19, AC-US-0003-13) e no guia de manobras (REQ-FEAT-0003-20, AC-US-0003-14), nos dois canais e em
cada idioma da interface, nenhum texto, ícone ou controle que mencione ou ofereça o drift ou o turbo — nem a
tecla de drift ou um controle de drift, nem carga de drift, turbo, mini-turbo ou impulso, nem combo ou
pontuação de drift. É só remoção de exibição, sem regra nova na renderização nem no adaptador de controle
(REQ-FEAT-0003-10, REQ-FEAT-0006-01; NFR-0005; `SEED/RE-01`, `DOMAIN/DEC-17`), e sem texto novo no lugar (RNF11).
Tela: SCR-0003 1.0.0.

## Posicionamento

`index.html` e `src/style.css`, camada **Aplicação**, **existentes** e **alterados** só por remoção. As três
telas são marcação estática da casca da aplicação: nenhuma é escrita por `src/main.ts`, salvo a troca do
conteúdo de `#welcome` quando falta WebGL (`src/main.ts:33`), que não fala de drift e não muda. `src/main.ts`
não muda por este item. Nenhum módulo novo: as três telas já existem e o arquivo que as contém é o único lugar
onde o texto delas vive.

Correspondência com SCR-0003, pela árvore corrente de 2026-10-30:

| Tela de SCR-0003 | Elemento |
|---|---|
| Tela inicial | o painel `#welcome` (`index.html:19`), exibido ao abrir o jogo e entre voltas |
| Dica da barra de ferramentas | o `<span class="control-hint">` dentro do primeiro `<div>` de `.toolbar` (`index.html:34`) |
| Guia de manobras | a `<section class="maneuver-guide" aria-label="Como fazer drift">` (`index.html:35`) |

O controle de toque exibido durante a volta é de [DES-0007](DES-0007-integracao-da-aplicacao-e-adaptadores.md)
(REQ-FEAT-0003-21); o HUD, de [DES-0005](DES-0005-hud-velocidade-e-aderencia.md).

## Interface

Retirada, sítio a sítio **(muda)**:

| Onde | O que sai | O que fica |
|---|---|---|
| `index.html:19`, `#welcome` | o `<h2>Entre de lado. Saia voando.</h2>` — entrar de lado é a manobra de drift e sair voando é o impulso | o `<span class="eyebrow">CURVA BOA PEDE BIS</span>` |
| `index.html:19`, `#welcome` | no `<p>`, a frase `Acelere, encaixe o drift e solte para dar o impulso.` e o `<br />` que a segue | o `<p>` com `Seu próximo recorde começa na curva.` |
| `index.html:19`, `#welcome` | no `<small>` final, ` · Espaço + curva para drift` (a tecla de drift) | o `<small>` com `WASD / setas` |
| `index.html:34`, `.toolbar` | no `<span class="control-hint">`, ` · Espaço: drift → turbo` | o `<span class="control-hint">Dirigir</span>` e as quatro `.key` W, A, S, D |
| `index.html:35` | a `<section class="maneuver-guide">` inteira: os três passos ("Entre na curva", "Segure o drift", "Solte e dispare") só ensinam o drift e o turbo, então é o estado Vazio de SCR-0003 — o conteúdo sai sem texto novo no lugar, e não sobra guia a exibir | nada no lugar; a `.toolbar` segue direto para `<details class="physics-panel">` |
| `src/style.css:3` | as regras só do guia: `.maneuver-guide{…}`, `.maneuver-guide>div{…}`, `.maneuver-guide>div>span{…}`, `.maneuver-guide p{…}`, `.maneuver-guide strong{…}` e, dentro de `@media(max-width:700px)`, `.maneuver-guide{…}` | as demais regras da linha, inclusive `.welcome h2`, que estiliza o `<h2>` da falta de WebGL |

**O que a remoção não toca.** Em `#welcome`, os contêineres de outras features ficam no mesmo lugar e na mesma
ordem: `#track-selector`, `#track-credit` (`pista-kart-park`), `#track-status` e `#lap-offer`
(`race-lap-validation`). Em `index.html:34`, só o texto dentro de `<span class="control-hint">` muda: o
`<div class="actions">` e os seus botões — `#sound`, `#tilt`, `#reset`, `#pause` e `#lap-end-training`
(acrescentado pela rodada de código de `race-lap-validation`, com a classe `hidden` e o texto escrito por
`src/main.ts:640-641`) — não são editados, nem a ordem, nem os atributos, nem o texto. A edição de código
substitui só a cadeia `Dirigir · Espaço: drift → turbo` por `Dirigir`, sem reescrever a linha.

Depois da retirada, `index.html` não contém `drift`, `turbo`, `impulso`, `combo` nem `Espaço` (a tecla de drift
é a única ligada ao Espaço), em nenhuma das três telas. Os textos estáticos das três telas existem em uma só
língua; as mensagens que `src/lapMessages.ts` traduz para `pt` e `en` não falam de drift nem de turbo, logo a
retirada vale igual em cada idioma que a interface oferece (RNF11; SCR-0003, Estados).

## Colaboradores

Nenhum: marcação estática e estilo. Os elementos de outras features dentro de `#welcome` e de `.toolbar` são
escritos por `src/main.ts` como antes.

## Estado e concorrência

Sem estado: a retirada é do documento servido. Abrir o jogo duas vezes mostra o mesmo conteúdo. Nada é
gravado.

## Comportamento em falha

As três telas não têm estado de erro próprio desta feature (SCR-0003, Erro): sem WebGL, `src/main.ts:33` troca o
conteúdo de `#welcome` por uma mensagem que não fala de drift, como antes. Sem rede, sem tempo-limite, sem
escrita, nada registrado em log.

## Observabilidade

`tests/dirigibilidade-hud-text.test.ts` lê `index.html` e `src/style.css` como texto e afirma: `index.html` não
casa `/drift|turbo|impulso|combo|Espaço/i`; não contém `maneuver-guide`, `Entre de lado` nem `Saia voando`;
`#welcome`, `.control-hint` e `.toolbar` continuam presentes, e `#lap-end-training` continua em `.actions`;
`src/style.css` não contém `.maneuver-guide`; as mensagens de `src/lapMessages.ts` nos dois idiomas não casam
`/drift|turbo|impulso|mini-?turbo|combo/i`. A tela, nos dois canais e nos dois idiomas, é o roteiro E2E-04
([test-strategy](../test-strategy.md)).

## Determinismo (D-DS-07)

Não é código de simulação; não lê nem escreve estado. `tests/dirigibilidade-contract.test.ts` continua afirmando
que nenhuma regra de pilotagem vive na apresentação.

## Feature flag

Nenhuma: remoção de exibição que acompanha a manobra retirada; nenhuma configuração devolve à tela o ensino do
drift (FEAT-0003, Configuração).

## Pontos em aberto

Nenhum.
