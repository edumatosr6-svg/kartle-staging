---
id: ADR-0001
title: Um material opaco com cores por vértice e as malhas de cada grupo mescladas — 27 chamadas de desenho sem mudar a forma
feature: modelo-kart-01
stage: dspec
status: validated
version: 1.1.0
sources: [RULE-0001, FEAT-0001, FEAT-0002, FEAT-0004, REQ-FEAT-0001-09, REQ-FEAT-0001-10, REQ-FEAT-0002-10, REQ-FEAT-0004-03, REQ-FEAT-0004-04, NFR-0004]
---

# ADR-0001 — Um material opaco com cores por vértice e as malhas de cada grupo mescladas

## Contexto

O código do Cowork (`docs/kart-01/kart.js`) monta o Kart 01 com 124 malhas e cerca de 24 materiais distintos
(13 do kart, 3 de decalque, 5 do piloto, 3 do capacete), 5.128 triângulos. O F-Spec exige no máximo 30
chamadas de desenho do kart com o piloto, contadas uma por malha e por material de cada malha
(REQ-FEAT-0004-03), sem mudar a forma — 5.128 triângulos (REQ-FEAT-0004-04) —, com os 15 grupos de peças e
`piloto` presentes com geometria visível (REQ-FEAT-0001-09, -10) e as quatro rodas, o volante e os dois
braços animáveis um a um (REQ-FEAT-0002-10). O agrupamento por material é a decisão do dono do produto
(`DOMAIN/DEC-01`).

Contagem das alternativas sobre a árvore de nós de `kart.js`: mesclar por material **dentro de cada grupo**,
mantendo os materiais originais, dá 57 chamadas (cada roda tem três materiais, o volante cinco, o piloto
treze); mesclar por material **através dos grupos** esvazia grupos (`GROUP_MISSING`) ou, mantendo uma malha
por grupo, continua acima de 30 por causa das rodas, do volante e dos braços. O número de malhas, e não o
de materiais, é o que precisa cair.

## Decisão

1. Todas as peças sólidas usam **um único** `MeshStandardMaterial` com `vertexColors: true` e `flatShading:
   true`; a cor original de cada malha é gravada no atributo `color` dos seus vértices (como `pintarFaces`
   já faz no capacete e no tronco). Os quatro decalques (duas placas, dois adesivos) ficam em dois materiais
   próprios com textura: um para as placas, um para os adesivos.
2. As malhas de um mesmo grupo e de um mesmo nó animável são mescladas numa só com `mergeGeometries`
   depois de `toNonIndexed()`; nenhuma geometria, posição, escala ou segmento muda.
3. Cada braço vira três malhas rígidas (braço superior com o cotovelo; antebraço com o punho; luva), porque
   os seus comprimentos são constantes na cinemática de `atualizarBracos`; a posição e a orientação de cada
   uma continuam calculadas por quadro pela mesma cinemática.
4. Nós de ancoragem sem geometria substituem as sub-malhas nomeadas que a mesclagem absorve, quando um
   efeito precisa de um ponto do modelo. O único da rodada 1, `escapamentoSaida`, saiu na rodada 5 com a
   fumaça de turbo que nele se prendia (F-Spec 1.3; [DES-0001](../web/DES-0001-modelo-kart-01-montagem-agrupamento-e-decalques.md));
   hoje nenhum efeito precisa de um, e a regra fica para o próximo.
5. Resultado planejado: 27 malhas, 27 chamadas, 3 materiais, 5.128 triângulos
   ([DES-0001](../web/DES-0001-modelo-kart-01-montagem-agrupamento-e-decalques.md), tabela do plano); margem
   de 3 chamadas abaixo do limite.

## Alternativas consideradas

- **Mesclar por material dentro de cada grupo, materiais originais mantidos.** 57 chamadas. Recusada.
- **Mesclar por material através dos grupos.** Esvazia grupos ou não baixa de 30 (rodas, volante, braços).
  Recusada.
- **Instâncias (`InstancedMesh`) para as rodas.** As dianteiras e as traseiras têm geometria diferente, e a
  instância não elimina as outras 23 malhas. Recusada como insuficiente.
- **Atlas de textura com UVs remapeadas em vez de cores por vértice.** Mesmo número de malhas, mais trabalho
  e uma textura a mais; cores por vértice chegam ao mesmo resultado sem textura. Recusada.
- **Braços com cinco malhas, como no código do Cowork.** 31 chamadas, acima do limite por uma. Recusada; a
  versão de três malhas tem a mesma forma e a mesma cinemática.
- **Reduzir segmentos das geometrias.** Mudaria a forma (triângulos diferentes de 5.128). Recusada.

## Consequências

- Rugosidade e metalização por peça (viseira, aros, escapamento) passam ao valor único do material; nenhuma
  cor muda. O F-Spec deixa a aparência fora das quatro cores como lacuna deliberada.
- A medida de cores de API-0002 lê o atributo `color` das geometrias (linear → sRGB, 8 bits), e não a
  `color` do material, salvo nos decalques.
- Qualquer sub-malha que outra feature queira animar no futuro precisa ser separada da mesclagem no
  construtor, ao custo de uma chamada de desenho; a margem é de 3.
- A verificação `DRAW_COST` fecha a decisão: `drawCallCount` ≤ 30 e `triangleCount` 5.128 na saída de
  `npm test`.

## Estado

Aceita na rodada 1; na rodada 5 o exemplo da decisão 4 foi atualizado (nó do escapamento retirado), sem mudar a decisão.
