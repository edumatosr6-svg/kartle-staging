---
id: ADR-0002
title: A câmera é função pura do estado da volta, da pose do kart e da forma da área de jogo — suavização, atraso, termo de velocidade e efeito de turbo retirados; visão geral ajustada aos limites da pista; descida com retenção de 100 ms
feature: modelo-kart-01
stage: dspec
status: validated
version: 1.2.0
sources: [API-0003, RULE-0002, FEAT-0003, REQ-FEAT-0003-05, REQ-FEAT-0003-08, REQ-FEAT-0003-11, REQ-FEAT-0003-12, REQ-FEAT-0003-13, REQ-FEAT-0003-14, REQ-FEAT-0003-16, REQ-FEAT-0003-17]
---

# ADR-0002 — A câmera é função pura do quadro

## Contexto

Antes desta feature a câmera de corrida era suavizada pelo relógio de parede: a posição perseguia um alvo
com `lerp(…, 1 − exp(−dt × 5))` (`src/main.ts:480` do commit `0068a57`) e o campo de visão perseguia
`48 + min(5, velocidade × 0,15) + (turbo ? 4 : 0)` com a mesma suavização (`:483-487`). O F-Spec exige a
câmera presa ao rumo sem suavização, atraso nem corte (REQ-FEAT-0003-08), 62° na vertical em paisagem **em
todos os quadros e a qualquer velocidade** (REQ-FEAT-0003-05), nenhum comando do Jogador mudando o campo de
visão (REQ-FEAT-0003-17: desde o F-Spec 1.3 o turbo saiu do jogo e o efeito de turbo na câmera não existe,
`DOMAIN/DEC-08`) e a idempotência "o mesmo passo e a mesma forma dão a mesma câmera" (API-0003). Uma
suavização por `dt`, um termo de velocidade ou uma parcela de turbo violam as três coisas. A câmera fica na
pose de corrida depois do fim de qualquer volta: na volta oficial em relação ao kart parado, no treino em
relação ao kart em movimento (REQ-FEAT-0003-01, -16), sem depender do tipo da volta (RULE-0002, Entradas). A
visão geral e a descida não existiam (a câmera inicial era fixa em (125, 130, 145), `:395-396`); o F-Spec
deixa livres a altura, a mira, o campo de visão e a curva da descida, e exige: pista inteira no quadro nas
duas formas, partida da pose da visão geral no primeiro quadro da contagem, altura que nunca aumenta, pose de
corrida no sinal verde, e pose função só de `countdownRemainingMs` e da pose do kart.

## Decisão

1. `src/gameCamera.ts` calcula a câmera do quadro como função pura das entradas do quadro
   ([DES-0003](../web/DES-0003-camera-de-jogo.md)); `src/main.ts` só aplica o resultado. A suavização de
   posição, o `cameraTarget`, o termo de velocidade e a suavização do campo de visão são **retirados**
   (I3: a aposentadoria é a remoção, e o teste de contrato afirma a ausência dos símbolos).
2. O campo de visão é só o de base da forma, em todos os modos e quadros: nenhuma entrada de comando do
   Jogador, de turbo ou de tipo de volta existe na função. A decisão da rodada 1 de manter o efeito de turbo
   (+4° com o turbo ativo) é **revogada** na rodada 5 pelo F-Spec 1.3 (`DOMAIN/DEC-08`; API-0003 2.0.0): a
   parcela, a entrada e os campos que a descreviam são removidos ([DES-0003](../web/DES-0003-camera-de-jogo.md),
   Retirada).
3. Visão geral: câmera acima do centro dos limites da pista, inclinada 10° da vertical na direção +Z,
   mirando o centro no chão, com `up` +Y, na menor altura inteira em metros a partir de 20 m em que os
   quatro cantos dos limites cabem no quadro com 5 % de margem; o campo de visão é a base da forma corrente.
4. Descida: interpolação `smoothstep` da pose da visão geral para a pose de corrida, parametrizada só por
   `countdownRemainingMs`, com **retenção de 100 ms** no início — igual ao máximo de tempo simulado que um
   quadro avança (`MAX_FRAME_S`, `src/frameClock.ts:5`) —, de modo que o primeiro quadro desenhado da
   contagem está sempre na pose da visão geral, por mais passos que o quadro da aceitação do `startLap`
   tenha avançado.
5. Retrato: base vertical = `max(62°, o vertical que dá 60° na horizontal para a razão corrente)`; paisagem:
   62°. O horizontal é derivado do vertical e da razão, como API-0003 define.
6. Sem estado de simulação (`NO_STATE`) não há volta: modo `TRACK_OVERVIEW`.
7. O modo é decidido só pela fase da volta: sem volta ativa, visão geral; contagem (ou pausa na contagem),
   descida; qualquer outra fase de uma volta ativa, corrida. O tipo da volta não é lido, então a fase com que
   `race-lap-validation` represente o fim de uma volta de treino e a volta seguinte, sem contagem, dá
   `RACE_CHASE` sem mudança aqui.

## Alternativas consideradas

- **Manter a suavização.** Viola a idempotência por passo e o "sem atraso" de REQ-FEAT-0003-08; e 62°
  "a qualquer velocidade" exclui o termo de velocidade. Recusada.
- **Manter o efeito de turbo (+4°) com a condição de hoje** (decisão da rodada 1). O F-Spec 1.3 o retira e
  proíbe que um comando mude o campo de visão (REQ-FEAT-0003-17). Revogada.
- **Decidir o modo pelo tipo da volta (`lapKind`).** Os critérios 13 e 14 de US-0003 pedem a mesma pose de
  corrida nos dois casos, em relação ao kart que a simulação informa; ler o tipo seria uma regra a mais sem
  efeito. Recusada.
- **Visão geral olhando exatamente para baixo.** `lookAt` com direção paralela a `up` é degenerado e o
  primeiro quadro da descida daria um salto de rolagem. Recusada; 10° de inclinação resolvem sem custo.
- **Girar a visão geral em retrato para alinhar o eixo longo da pista ao eixo longo da tela.** Reduziria a
  altura em retrato (≈ 160 m → ≈ 105 m na pista sintética), mas obrigaria a interpolar a rolagem da câmera
  durante a descida. Recusada por simplicidade; a exigência é "pista inteira no quadro".
- **Descida linear.** Também monótona; `smoothstep` dá início e fim suaves com a mesma garantia. Escolhido
  `smoothstep`.
- **Retenção menor que 100 ms ou nenhuma.** O quadro em que o `startLap` é aceito pode avançar até 12 passos
  (100 ms) antes do primeiro desenho; com retenção menor o primeiro quadro já estaria abaixo da visão geral.
  Recusada.
- **Fixar o campo de visão vertical em retrato num valor único (por exemplo 90°).** Em 3:4 daria 69° na
  horizontal e em 9:16 só 58°, abaixo dos 60° exigidos. Recusada; a regra depende da razão.

## Consequências

- A névoa da cena (`THREE.Fog` de 160 m a 350 m, `src/main.ts:18`) não muda: na visão geral da pista
  sintética (altura ≈ 103 m em 16:9, ≈ 160 m em 9:16) as bordas mais distantes ficam parcialmente
  esbatidas e visíveis. Uma pista cuja visão geral exigir altura próxima de 300 m ficará esbatida por
  inteiro: isso é assunto da feature que trouxer essa pista (proposta ao autor em `97-changelog.md`), não
  um requisito desta.
- Depois do fim da volta oficial (`ENDED`) a simulação para e o kart congela, como hoje (`src/lap.ts:190`,
  `stepLap` só avança em `COUNTDOWN` e `RUNNING`): é o invariante INV-1 de `race-lap-validation`, que o F-Spec
  1.3 (FEAT-0003, RULE-0002, FLOW-0001) especifica e esta feature não muda. A câmera fica atrás do kart parado,
  na pose de corrida, com o painel de resultado sobre a cena; como `simStepCount` não avança, a câmera é a
  mesma em cada quadro até um `startLap` aceito ou uma recarga. No treino as voltas são seguidas
  (`race-lap-validation` revisão 3, US-10): a câmera continua função da pose do kart em movimento. A decisão
  depende só da fase e da pose do kart exibido, não do que a sessão faz depois do fim da volta; nenhuma
  hipótese de pilotagem faz parte dela.
- `camera.far` passa a `max(500, 3 × altura)`, para a pista inteira entrar no volume de visão da visão geral.
- A câmera deixa de depender de `dt` e de qualquer comando: `RENDER_NEUTRAL` e o teste de câmera percorrem
  sessões reais quadro a quadro e afirmam cada campo de API-0003, inclusive a ausência dos dois campos
  retirados.

## Estado

Aceita na rodada 1; a consequência sobre `ENDED` foi alinhada ao F-Spec 1.2.0 na rodada 2; na rodada 5
(F-Spec 1.3) a decisão 2 foi revogada (efeito de turbo retirado) e a decisão 7 acrescentada (treino).
