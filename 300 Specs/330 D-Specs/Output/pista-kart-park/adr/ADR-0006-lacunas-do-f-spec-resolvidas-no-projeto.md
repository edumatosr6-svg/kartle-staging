---
id: ADR-0006
title: Lacunas deliberadas do F-Spec resolvidas no projeto
feature: pista-kart-park
stage: dspec
status: validated
version: 1.2.0
sources: [RULE-0002, RULE-0004, FEAT-0002, FEAT-0004, FEAT-0005, FEAT-0006, REQ-FEAT-0002-05, REQ-FEAT-0002-10, REQ-FEAT-0004-08, REQ-FEAT-0005-03, REQ-FEAT-0005-04, REQ-FEAT-0005-12, REQ-FEAT-0005-15, REQ-FEAT-0006-03]
---

# ADR-0006 — Lacunas deliberadas do F-Spec resolvidas no projeto

## Contexto

O F-Spec (`01-overview.md`, "Lacunas deliberadas") deixa ao D-Spec, sem valor inventado nos requisitos: a
largura lateral de cada zebra ("decidido no D-Spec com a evidência registrada"), o método e a janela da
suavização (orientação de cerca de 12 m; o que se verifica é 0,30 m e 687,5 m ± 1 %), o intervalo e o timbre do
som da zebra, a aba de abertura do link do crédito, a origem das coordenadas do arquivo gerado e a aparência da
zebra e da barreira. O arquivo de origem não declara largura de zebra (só `lado`, `de_m`, `ate_m`).

## Decisão

| Lacuna | Valor | Motivo e evidência |
|---|---|---|
| Largura da zebra | 1,0 m por trecho, reduzida pelo preparo até deixar 0,4 m de grama até outra parte da volta; abaixo de 0,3 m o preparo falha | menor que a bitola do kart (1,2 m, `src/physics.ts:49`): o kart tem no máximo as duas rodas de um lado na zebra, que é o caso de RULE-0001; pequena diante do asfalto de 4,4 m a 10,8 m. A evidência de cada trecho (largura gravada e, quando reduzida, a folga que a limitou) fica em `prep.curbWidthsM` e `prep.reducedCurbs` do registro de publicação ([DM-0002](../data/DM-0002-registro-de-publicacao-e-estado-em-memoria.md)) |
| Suavização | **janela fixa de 12 m de distância de volta** (± 6 m em torno de cada ponto, medida na linha original), com pesos de cosseno levantado `w(d) = ½ (1 + cos(π d / 6))`, **aplicada uma só vez** sobre os pontos da origem, seguida do grampo de 0,295 m em torno do ponto correspondente da origem; o comprimento é **medido de novo** sobre a linha suavizada e arredondada e tem de ficar em 687,5 m ± 1 % (680,625 m a 694,375 m), senão o preparo falha | é a decisão do dono do produto (`DOMAIN` 2026-10-22, "Fidelidade": janela de cerca de 12 m; tolerância da suavização fechada no seed: nenhum ponto a mais de 0,30 m; SEED US-2: comprimento medido de novo depois da suavização, 687,5 m ± 1 %), sem intensidade escolhida pelo dado. Mantém quantidade e ordem dos pontos (correspondência por índice); o grampo garante 0,30 m por construção (0,295 m mais o arredondamento a 0,001 m ficam abaixo de 0,30 m: V01 e V07 verificam, não presumem); os pesos de cosseno levantado deixam a janela de 12 m remover o ruído de 8 m a 13 m de comprimento de onda sem puxar as curvas fechadas para dentro — a média uniforme sobre os mesmos 12 m bate no grampo em metade dos pontos e encurta a volta para fora da faixa (evidência abaixo). O `lapLengthM` publicado no arquivo e em `prep` é o medido depois da suavização; o rótulo continua "687 m" (`displayLengthM` 687 do catálogo, fixado pelo F-Spec em REQ-FEAT-0006-08, independente do comprimento suavizado). A janela fica em `prep.smoothingWindowM`, o maior desvio em `prep.maxSmoothingOffsetM` e o comprimento medido em `prep.lapLengthM` |
| Origem das coordenadas | centro da caixa envolvente dos pontos da origem, arredondado a 0,001 m | a pista fica centrada na origem como a sintética, e a câmera de visão geral e a sombra servem sem caso especial; o deslocamento fica em `prep.originOffsetM` |
| Intervalo do som da zebra | 12 passos de `STEP` (100 ms de tempo simulado), constante | uma repetição por faixa vermelha e branca a cerca de 10 m/s em faixas de 1 m; mais curto que o pulso de vibração (250 ms) e inteiro em passos |
| Timbre do som da zebra | ruído branco de 60 ms, passa-baixa em 160 Hz, ataque de 5 ms e queda exponencial, ganho de pico 0,05 | "ruído curto e grave" (`DOMAIN/DEC-11`); fonte de ruído, enquanto o motor é onda triangular contínua e a recompensa são tons senoidais a partir de 659 Hz: sinal diferente de todo outro som do jogo. Com a retirada do drift (`dirigibilidade`, seed `revision: 5`) a recompensa, que era o som do prêmio do drift, deixa de tocar; o timbre não muda ([DES-0009](../web/DES-0009-retorno-da-zebra-vibracao-e-som.md)) |
| Aba do link do crédito | outra aba, com `rel="noopener noreferrer"` | o jogo não perde a sessão de treino. O link aparece na tela inicial, sem treino em andamento, e no painel do resultado de cada volta do treino, com o treino em andamento ([ADR-0007](ADR-0007-credito-no-painel-do-resultado-da-volta-do-treino.md)); acioná-lo durante o treino tira o foco da aba e o treino pausa pela regra de `race-lap-validation` (`FOCUS_LOST`), sem perder a volta, o tempo nem resultado algum |
| Aparência | asfalto `#434d48`; zebra em faixas de 1 m alternadas `#c8423b` e `#f0e9d5`; barreira de 0,2 m × 0,9 m `#e6dfc9` | as cores da pista sintética para o asfalto e a linha de largada; a faixa da zebra no lado declarado e a barreira em todo o comprimento, como o F-Spec exige |

## Alternativas consideradas

| Alternativa | Por que não |
|---|---|
| Largura da zebra fixa sem redução | nos trechos quase encostados (0,9 m de grama) uma zebra do lado voltado para o outro trecho poderia encostar nele ou na barreira |
| Intensidade escolhida pelo comprimento mais próximo de 687,5 m (iteração de Jacobi `λ` 0,5, `k` de 0 a 400; decisão da revisão 1.0.0) | a origem convertida já mede 687,520 m e uma iteração dá 686,725 m, então a regra escolhe `k` 0 e publica a linha original sem suavização alguma, contra US-2, AC-US-0002-06, FLOW-0003 passo 3 e a decisão "Fidelidade" (SPEC-ISSUE-01 de `code-validation-20261027-2125`) |
| Média móvel de 12 m sem grampo | numa curva de raio cerca de 6 m, a média sobre 12 m desloca o ponto até 0,84 m (V07 reprova) |
| Média móvel uniforme de ± 6 m com o grampo | o grampo bate em 326 dos 684 pontos (toda curva de raio abaixo de cerca de 20 m) e a volta medida fica em 680,372 m, fora da faixa (V03 reprova); o resultado nas curvas é a linha original puxada 0,295 m para dentro, não uma linha suavizada |
| Média móvel uniforme de ± 5 m com o grampo | 681,145 m, dentro da faixa por 0,52 m, mas a janela já não é "cerca de 12 m" e o grampo ainda bate em 206 pontos |
| Iteração de Jacobi com `k` fixo derivado da janela (`k` 10 a 12) | 681,9 m a 681,3 m, dentro da faixa, ruído removido; não adotada porque a equivalência entre `k` e a janela de 12 m passa por uma derivação (variância `λ h² k`) que o dono do produto não pediu, enquanto a janela de 12 m é a decisão literal |
| Som com oscilador | ficaria parecido com o motor (oscilador contínuo) |

## Consequências

- Os valores vivem como constantes em `scripts/trackPrep.ts`, `src/curbFeedback.ts`, `src/audio.ts` e
  `src/trackScene.ts`; mudar um valor do preparo depois de uma entrega produz um arquivo novo com
  `trackVersion` maior.
- A largura de cada zebra e os parâmetros da suavização ficam registrados por versão publicada.
- **`trackVersion` continua 1 nesta revisão.** O F-Spec fixa que a primeira versão publicada da Kart Park é
  `trackVersion` 1 (REQ-FEAT-0002-01, RULE-0005, V16) e o seed (I3/I5) que "suavizar de novo" é versão nova
  **depois** de a versão 1 entrar. A entrada `kart-park` 1 que a rodada de código 1 gravou em
  `tracks/registry.json` (`STAGING`, `smoothingIterations` 0) veio de uma rodada reprovada no gate
  (`code-validation-20261027-2125`, FAIL SPEC): não foi validada, testada nem implantada — o commit
  `ba221ad` é ponto de controle, não entrega — e por isso não é uma publicação no sentido de
  [DM-0002](../data/DM-0002-registro-de-publicacao-e-estado-em-memoria.md) e de
  [ADR-0005](ADR-0005-kart-park-sem-chave-e-producao-bloqueada.md) (`STAGING` e `PRODUCTION` são estados de
  uma entrada entregue por uma rodada de código validada). A rodada de código seguinte retira essa entrada e
  o arquivo que ela aponta e refaz `prepare`/`verify`/`publish kart-park 1` com a regra desta revisão.

## Evidência medida (revisão 1.1.0)

Medido sobre `tracks/sources/kart-park.json` (684 pontos, origem convertida 687,520 m; ruído 0,09 m RMS com
comprimento de onda de 8 m a 13 m, `NOTES.md`) com o grampo de 0,295 m e o arredondamento a 0,001 m em todos
os casos; "trocas de sinal" é o número de inversões do sinal da variação de rumo entre segmentos
consecutivos, 105 na origem (o zigue-zague do ruído):

| Regra | Comprimento medido | Maior desvio | Pontos no grampo | Trocas de sinal |
|---|---|---|---|---|
| janela de 12 m, cosseno levantado, uma aplicação (**adotada**) | 682,116 m | 0,2955 m | 22 | 46 |
| janela de 12 m, pesos uniformes, uma aplicação | 680,372 m (fora da faixa) | 0,2957 m | 326 | 230 |
| janela de 10 m, pesos uniformes, uma aplicação | 681,145 m | 0,2957 m | 206 | 182 |
| Jacobi `λ` 0,5, `k` 1 (regra 1.0.0 teria `k` 0) | 686,725 m | 0,060 m | 0 | — |
| Jacobi `λ` 0,5, `k` 12 | 681,267 m | 0,2955 m | 24 | 43 |

Os valores que valem são os que o preparo grava em `prep` e que V01, V03 e V07 verificam; a tabela é a
evidência da escolha, não a verificação.

## Status

Proposta deste conjunto, a validar. Revisão 1.1.0 (2026-10-27): decisão da suavização substituída por
SPEC-ISSUE-01 de `reports/feedback/feedback-20261027-2125.md`; as demais linhas inalteradas.
