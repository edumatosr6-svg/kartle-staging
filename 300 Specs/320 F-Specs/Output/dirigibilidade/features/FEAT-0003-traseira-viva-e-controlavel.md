---
id: FEAT-0003
title: Traseira viva mas controlável
feature: dirigibilidade
stage: fspec
status: validated
version: 4.0.1
sources: [US-0003, NFR-0005, AC-US-0003-01, AC-US-0003-03, AC-US-0003-04, AC-US-0003-05, AC-US-0003-07, AC-US-0003-08, AC-US-0003-09, AC-US-0003-10, AC-US-0003-11]
---

# FEAT-0003 — Traseira viva mas controlável

## Resumo

Com o acerto Arcade assistido na sua nova versão (acerto C, `DOMAIN/DEC-15`), a traseira é viva mas se
segura. Na condução normal — todos os passos da volta do piloto de teste na pista sintética, inclusive os
passos em que ele força o kart — a telemetria nunca reporta `oversteer` nem `sliding` e a derrapagem
lateral não passa de 0,65 rad. Na pista de teste aberta, forçando a traseira (acelerador cheio e esterço
cheio acima de 50 km/h) até ela soltar, zerar o esterço devolve `grip` em no máximo 400 ms
(`DOMAIN/DEC-04`) sem rodar. O drift e o turbo de `requirements/11` não existem mais (`SEED/RD-01`,
`DOMAIN/DEC-15`): segurar o comando de drift não muda nada, não há carga, mini-turbo nem impulso, a
velocidade máxima é a mesma em qualquer situação, e nenhum indicador de drift ou turbo aparece na tela
nem no texto compartilhado — a retirada da exibição é só remoção, sem regra nova na renderização
(`SEED/RE-01`, `DOMAIN/DEC-16`).

## Canais

`web-desktop` e `web-mobile`: mesma condição de forçar, mesmo limite de recuperação, mesmo teto de
derrapagem e mesma ausência de drift e de turbo. No teclado, a condição de forçar são as duas teclas
mantidas acima de 50 km/h, e o comando de drift é a tecla de drift. Na inclinação, a condição de forçar
exige o ângulo mapeado para esterço 1 (ou −1) e o toque de acelerador cheio; com esterço parcial ela não se
mantém; o comando de drift é o controle de drift que o adaptador de toque entregue, e vale o mesmo que no
teclado. Sem sensor ou sem permissão: toque, entradas binárias, mesmos requisitos (I4). Os requisitos 01 e
06 são observados na volta do piloto de teste na pista sintética; os requisitos 04 e 05, na pista de teste
aberta (`SEED/RD-06`); os requisitos 13 e 16 valem em qualquer ambiente; o requisito 14 é observado na
tela, nos dois canais, e o requisito 15, no texto compartilhado.

## Requisitos

- REQ-FEAT-0003-01: O sistema SHALL, no estado da simulação, em todos os passos da volta do piloto de teste
  na pista sintética (condução normal), reportar `handling` igual a `grip` ou `understeer`, nunca
  `oversteer` nem `sliding` (AC-US-0003-01).
- REQ-FEAT-0003-06: O sistema SHALL, no estado da simulação, em todos os passos da volta do piloto de
  teste na pista sintética (condução normal), manter `sideslipRad` em no máximo 0,65 rad (AC-US-0003-05).
- REQ-FEAT-0003-04: O sistema SHALL, no estado da simulação, na pista de teste aberta, depois de forçar a
  traseira (acelerador cheio e esterço cheio acima de 50 km/h) até `handling` em `oversteer` ou `sliding`,
  com o esterço levado de 1 a 0 (ou de −1 a 0) num passo e o acelerador mantido cheio, reportar `handling`
  igual a `grip` em no máximo 400 ms de tempo simulado contados desse passo (AC-US-0003-03).
- REQ-FEAT-0003-05: O sistema SHALL, em nenhum passo da recuperação do requisito 04, deixar `sideslipRad`
  passar de 0,65 rad: o kart não roda ao recuperar (AC-US-0003-04).
- REQ-FEAT-0003-13: O sistema SHALL, no estado da simulação, para a mesma sequência de `Input` por passo
  aplicada ao mesmo estado inicial com o comando de drift mantido do primeiro ao último passo e sem ele,
  produzir o mesmo estado em todos os passos — posição, velocidade, rumo, estado de aderência e derrapagem
  lateral —, sem carga, mini-turbo nem impulso (AC-US-0003-08).
- REQ-FEAT-0003-14: O sistema SHALL NOT exibir, em `web-desktop` nem em `web-mobile`, durante a volta (HUD)
  nem na tela de resultado, indicador de carga de drift, de turbo ou de impulso, combo ou pontuação de
  drift (AC-US-0003-09).
- REQ-FEAT-0003-15: O sistema SHALL NOT incluir no texto compartilhado do resultado, gerado em
  `web-desktop` ou em `web-mobile`, indicador de carga de drift, de turbo ou de impulso, combo ou pontuação
  de drift (AC-US-0003-11).
- REQ-FEAT-0003-16: O sistema SHALL, no estado da simulação, em todo ensaio desta feature que parte de
  velocidade igual ou menor que a velocidade estabilizada e na volta do piloto de teste, inclusive com o
  comando de drift mantido, manter a velocidade do kart em no máximo a velocidade estabilizada medida por
  `TOP_SPEED` para o mesmo acerto e a mesma versão (AC-US-0003-10).
- REQ-FEAT-0003-08: O sistema SHALL conter, na saída de `npm test` ou de `npm run bench:handling`, para o
  acerto Arcade assistido, os registros `REAR_RECOVERY` (com `benchEnvironment` `TEST_PAD`, `recoveryMs` e
  `maxSideslipRad` na recuperação), `NORMAL_DRIVING` (com `benchEnvironment` `SYNTHETIC_TRACK`,
  `oversteerOrSlidingStepCount` e `maxSideslipRad` na volta do piloto de teste), `DRIFT_INERT` (com
  `differingStepCount`) e `SPEED_CAP` (com `maxObservedSpeedMps` ao lado de `topSpeedMps`, apresentados
  também em km/h) (AC-US-0003-07).
- REQ-FEAT-0003-09: O sistema SHALL, quando esterço e acelerador são levados a 0 no mesmo passo com a
  traseira solta, reportar `grip` em tempo não maior que 400 ms de tempo simulado [DOMAIN] (US-0003, caso
  anormal "Acelerador mantido cheio durante a recuperação").
- REQ-FEAT-0003-10: O sistema SHALL avaliar a condição de forçar, a recuperação, o estado de aderência e a
  ausência de efeito do comando de drift na simulação, a partir do `Input` e do estado do passo, nunca no
  adaptador de controle nem na renderização; a retirada da exibição do drift e do turbo não acrescenta
  regra à renderização [DOMAIN] (I2; D-FS-05; NFR-0005).
- REQ-FEAT-0003-11: O sistema SHALL contar os 400 ms do requisito 04 em tempo simulado, sem incluir o tempo
  em que a simulação esteve suspensa por pausa, perda de foco ou perda do sensor [DOMAIN] (I8; US-0003,
  caso anormal "Pausa, perda de foco ou perda do sensor durante a recuperação").
- REQ-FEAT-0003-12: O sistema SHALL, quando a recuperação não volta a `grip` em 400 ms, reportar
  `REAR_RECOVERY` como `FAIL` com `failReason` `THRESHOLD_EXCEEDED` e o tempo até o primeiro `grip`
  (`recoveryMs`, ou `gripReached` falso se não houve `grip` no ensaio) [DOMAIN] (I9; US-0003, caso anormal
  "Recuperação que não volta a `grip` em 400 ms").
- REQ-FEAT-0003-17: O sistema SHALL, quando a traseira não solta sob a condição de forçar no ensaio do
  requisito 04, reportar `REAR_RECOVERY` com `rearReleased` falso e o tempo forçado (`forcingMs`), sem
  reprovar o ensaio por isso, porque nenhum critério exige que a traseira solte [DOMAIN] (US-0003, caso
  anormal "Traseira não solta sob a condição de forçar").

Numeração: os requisitos 02 (curva do arco de raio 18 m só em `grip` ou `understeer`), 03 (`oversteer` e
`sliding` só sob forçar, drift ou recuperação) e 07 (a manobra de drift continua pontuando) foram retirados
com o que realizavam — os critérios 02 e 06 de US-0003, retirados dos requisitos, e a cláusula do arco de
18 m do critério 01 —, na revisão 4 do seed (`DOMAIN/DEC-15`), e os seus números não são reutilizados. A tabela de migração está
em `97-changelog.md`.

## Comportamento

Condição de forçar, condução normal, recuperação e ausência de drift e turbo:
[RULE-0001](../rules/RULE-0001-estado-de-aderencia-e-condicao-de-forcar.md). Ensaios `NORMAL_DRIVING`,
`REAR_RECOVERY`, `DRIFT_INERT` e `SPEED_CAP`, ambiente e área declarada:
[RULE-0002](../rules/RULE-0002-ensaios-e-limiares.md),
[FLOW-0002](../flows/FLOW-0002-ensaio-deterministico-e-piloto-de-teste.md),
[API-0003](../api/API-0003-saida-dos-ensaios.md). Telemetria:
[API-0001](../api/API-0001-telemetria-de-dirigibilidade.md) (`handling`, `sideslipRad`, `forcing`). Tela e
texto compartilhado: [SCR-0001](../screens/SCR-0001-hud-de-velocidade-e-aderencia.md),
[SCR-0002](../screens/SCR-0002-resultado-e-texto-compartilhado.md).

| Situação | Comportamento |
|---|---|
| Volta do piloto de teste na pista sintética (condução normal) | `grip` ou `understeer` em todos os passos; `sideslipRad` ≤ 0,65 rad (requisitos 01 e 06) |
| Piloto de teste força o kart na volta sintética (acelerador e esterço cheios acima de 50 km/h numa curva) | Continua sendo condução normal: os requisitos 01 e 06 valem em todos os passos da volta, sem exceção |
| Condição de forçar mantida na pista de teste aberta | `oversteer`/`sliding` permitidos; a traseira permanece solta; `sideslipRad` pode exceder 0,65 rad; o Jogador segue controlando com o esterço; nenhum estado de "rodada" sem comando é exigido nem proibido |
| Esterço zerado com a traseira solta, acelerador cheio (recuperação), cada lado | `grip` em ≤ 400 ms; `sideslipRad` ≤ 0,65 rad até lá (requisitos 04 e 05) |
| Esterço e acelerador zerados juntos | `grip` em tempo não maior que 400 ms (requisito 09) |
| Traseira não solta sob a condição de forçar | `REAR_RECOVERY` com `rearReleased` falso e `forcingMs`; sem reprovação (requisito 17) |
| Recuperação que não volta a `grip` em 400 ms | `REAR_RECOVERY` `FAIL` com `THRESHOLD_EXCEEDED` e o tempo até o primeiro `grip` (requisito 12) |
| Esterço reduzido parcialmente (`web-mobile`) | Nenhum limite fixado (lacuna deliberada de `01-overview.md`) |
| Comando de drift mantido, inclusive durante a condição de forçar ou a recuperação | Nenhum efeito no estado da simulação; os requisitos 04 e 05 valem igual; a velocidade não passa da estabilizada (requisitos 13 e 16) |
| Replay gravado com drift na versão anterior do acerto | É de outra versão e não é comparável ([FEAT-0005](FEAT-0005-determinismo-piloto-de-teste-e-versao.md)); reproduzido com o novo acerto, o comando de drift gravado não tem efeito (requisito 13) |
| HUD, tela de resultado e texto compartilhado | Sem indicador de carga de drift, turbo ou impulso, combo ou pontuação de drift (requisitos 14 e 15) |
| Kart fora da área de asfalto declarada na pista de teste aberta | `FAIL` com `TEST_AREA_EXCEEDED`, passo e posição: medição inválida ([RULE-0002](../rules/RULE-0002-ensaios-e-limiares.md)) |
| Grama ou parede com a traseira solta (pista sintética) | Redução de velocidade de [FEAT-0004](FEAT-0004-aceleracao-velocidade-grama-parede-e-hud.md); o requisito 04 é medido na pista de teste aberta, que não tem grama nem parede |
| Pausa, perda de foco, perda do sensor | Simulação suspensa; os 400 ms não contam a suspensão (requisito 11) |
| Sensor ausente ou permissão negada antes da volta (`web-mobile`) | Toque com estado visível; requisitos inalterados |
| Rede indisponível | Sem efeito (D-FS-08) |

## Estado

Lê `handling` (`grip`, `understeer`, `oversteer`, `sliding`), `forcing` e `sideslipRad`
([API-0001](../api/API-0001-telemetria-de-dirigibilidade.md)); a recuperação é derivada por
[RULE-0001](../rules/RULE-0001-estado-de-aderencia-e-condicao-de-forcar.md). Não há estado de drift: a
manobra não existe.

| Transição | O que a dispara | Idempotência e contador |
|---|---|---|
| `grip`/`understeer` para `oversteer`/`sliding` | passo em que a traseira perde aderência, pelo estado e pelo `Input` do passo: nunca na volta do piloto de teste (requisito 01); no ensaio de recuperação, provocada pela condição de forçar (requisito 04); nas voltas do Jogador, sem restrição de contexto ([RULE-0001](../rules/RULE-0001-estado-de-aderencia-e-condicao-de-forcar.md), Contextos de observação) | Função do estado e do `Input` do passo; ordenada por `simStepCount`; o comando de drift não a altera |
| `oversteer`/`sliding` para `grip` (fim da recuperação) | esterço levado a 0; em no máximo 400 ms | Idem; o tempo suspenso não conta |

## Configuração

Nenhuma. Nenhuma configuração existe para forçar um evento, injetar um estado ou habilitar um caminho de
depuração; o ensaio chega à traseira solta pela condição de forçar, pelas mesmas operações públicas.
Nenhuma configuração religa o drift ou o turbo. A velocidade de partida, a duração máxima do forçar e o
raio da área declarada são parâmetros de ensaio reportados e registrados em `docs/physics.md`.

## Critérios de aceite

- `NORMAL_DRIVING` na volta do piloto de teste: `oversteerOrSlidingStepCount` = 0 e `maxSideslipRad`
  ≤ 0,65, contando todos os passos (satisfaz AC-US-0003-01, AC-US-0003-05; cobre os requisitos 01, 06 e
  10).
- `REAR_RECOVERY` na pista de teste aberta, cada lado, com a traseira solta: `recoveryMs` ≤ 400 e
  `maxSideslipRad` ≤ 0,65; com esterço e acelerador zerados juntos, tempo não maior que 400 ms (satisfaz
  AC-US-0003-03, AC-US-0003-04; cobre os requisitos 04, 05, 09 e 11).
- Recuperação acima de 400 ms: `FAIL` com `THRESHOLD_EXCEEDED` e `recoveryMs` ou `gripReached` falso;
  traseira que não solta: `rearReleased` falso e `forcingMs`, sem `FAIL` (satisfaz AC-US-0003-03, casos
  anormais; cobre os requisitos 12 e 17).
- `DRIFT_INERT` na volta do piloto de teste e na sequência de recuperação: `differingStepCount` = 0
  (satisfaz AC-US-0003-08; cobre os requisitos 10 e 13).
- Na tela, nos dois canais, nenhum indicador de carga de drift, turbo ou impulso, combo ou pontuação de
  drift no HUD durante a volta nem na tela de resultado (satisfaz AC-US-0003-09; cobre o requisito 14).
- No texto compartilhado, gerado nos dois canais, nenhum desses indicadores (satisfaz AC-US-0003-11; cobre
  o requisito 15).
- `SPEED_CAP`: `maxObservedSpeedMps` ≤ `topSpeedMps` (satisfaz AC-US-0003-10; cobre o requisito 16).
- A saída de `npm test` ou de `npm run bench:handling` contém `REAR_RECOVERY`, `NORMAL_DRIVING`,
  `DRIFT_INERT` e `SPEED_CAP` com os campos nomeados (satisfaz AC-US-0003-07; cobre o requisito 08).

## Pontos em aberto

Nenhum.
