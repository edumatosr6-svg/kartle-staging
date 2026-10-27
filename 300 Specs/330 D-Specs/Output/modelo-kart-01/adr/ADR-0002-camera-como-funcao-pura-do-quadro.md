---
id: ADR-0002
title: A câmera é função pura do estado da volta, da pose do kart, da forma da área de jogo e do turbo — suavização, atraso e termo de velocidade retirados; visão geral ajustada aos limites da pista; descida com retenção de 100 ms
feature: modelo-kart-01
stage: dspec
status: validated
version: 1.1.0
sources: [API-0003, RULE-0002, FEAT-0003, REQ-FEAT-0003-05, REQ-FEAT-0003-08, REQ-FEAT-0003-10, REQ-FEAT-0003-11, REQ-FEAT-0003-12, REQ-FEAT-0003-13, REQ-FEAT-0003-14]
---

# ADR-0002 — A câmera é função pura do quadro

## Contexto

Hoje a câmera de corrida é suavizada pelo relógio de parede: a posição persegue um alvo com
`lerp(…, 1 − exp(−dt × 5))` (`src/main.ts:480`) e o campo de visão persegue `48 + min(5, velocidade × 0,15)
+ (turbo ? 4 : 0)` com a mesma suavização (`:483-487`). O F-Spec exige a câmera presa ao rumo sem
suavização, atraso nem corte (REQ-FEAT-0003-08), 62° na vertical em paisagem **a qualquer velocidade** sem
turbo (REQ-FEAT-0003-05), o campo de visão com turbo igual à base mais a diferença que o efeito existente
produz para o mesmo estado de turbo (REQ-FEAT-0003-10), `turboFovDeltaDeg` 0 sem turbo (API-0003) e a
idempotência "o mesmo passo e a mesma forma dão a mesma câmera" (API-0003). Uma suavização por `dt` viola
as quatro coisas: produz quadros sem turbo com campo acima de 62°, quadros com turbo abaixo de base + 4,
e câmeras diferentes para o mesmo passo. A visão geral e a descida não existem hoje (a câmera inicial é
fixa em (125, 130, 145), `:395-396`); o F-Spec deixa livres a altura, a mira, o campo de visão e a curva da
descida, e exige: pista inteira no quadro nas duas formas, partida da pose da visão geral no primeiro
quadro da contagem, altura que nunca aumenta, pose de corrida no sinal verde, e pose função só de
`countdownRemainingMs` e da pose do kart.

## Decisão

1. `src/gameCamera.ts` calcula a câmera do quadro como função pura das entradas do quadro
   ([DES-0003](../web/DES-0003-camera-de-jogo.md)); `src/main.ts` só aplica o resultado. A suavização de
   posição, o `cameraTarget`, o termo de velocidade e a suavização do campo de visão são **retirados**
   (I3: a aposentadoria é a remoção, e o teste de contrato afirma a ausência dos símbolos).
2. A magnitude do efeito de turbo é a existente: +4° enquanto a condição de hoje vale (`drivingAssists`,
   sem `prefers-reduced-motion`, `boost > 0`); o valor é aplicado por inteiro no quadro, sem rampa.
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

## Alternativas consideradas

- **Manter a suavização e reportar `turboFovDeltaDeg` como a diferença instantânea.** Viola "0 sem turbo
  ativo" durante o decaimento e a idempotência por passo; e 62° "a qualquer velocidade" exclui o termo de
  velocidade. Recusada.
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
- Depois de `ENDED` a simulação para e o kart congela, como hoje (`src/lap.ts:173`; `src/main.ts:403`): é o
  invariante INV-1 de `race-lap-validation`, que o F-Spec 1.2.0 (FEAT-0003, RULE-0002, FLOW-0001) especifica e
  esta feature não muda. A câmera fica atrás do kart parado, na pose de corrida, com o painel de resultado
  sobre a cena; como `simStepCount` não avança e a pose lida em cada quadro é a mesma, a câmera é a mesma em
  cada quadro até um `startLap` aceito ou uma recarga. A decisão depende só da pose do kart exibido, não do
  que a sessão faz depois de `ENDED`; nenhuma hipótese de pilotagem depois do fim da volta faz parte dela.
- `camera.far` passa a `max(500, 3 × altura)`, para a pista inteira entrar no volume de visão da visão geral.
- A câmera deixa de depender de `dt`: `RENDER_NEUTRAL` e o teste de câmera percorrem sessões reais
  quadro a quadro e afirmam cada campo de API-0003.

## Estado

Aceita na rodada 1; a consequência sobre `ENDED` foi alinhada ao F-Spec 1.2.0 na rodada 2.
