---
id: DES-0005
title: Efeitos presos ao kart — marcas de pneu em wheelPositions, um trecho por quadro com passo novo na situação de marca de pneu; nenhuma indicação de drift nem fumaça ou chama de turbo — implementação
feature: modelo-kart-01
stage: code
status: validated
version: 2.0.0
sources: [FEAT-0005, RULE-0003, FLOW-0001, SCR-0001, REQ-FEAT-0005-01, REQ-FEAT-0005-07, REQ-FEAT-0005-08, REQ-FEAT-0005-09, REQ-FEAT-0005-10, REQ-FEAT-0005-11, REQ-FEAT-0005-12, NFR-0007]
---

# DES-0005 — Efeitos presos ao kart — implementação

`src/main.ts`, camada aplicação, alterado no bloco das marcas e na retirada do jato; `src/kart01Model.ts` alterado só pela retirada
do nó `escapamentoSaida` (DES-0001). Nenhum módulo, função, constante ou chave nova (projeto DES-0005 1.4.0, Posicionamento): a
decisão da situação de marca de pneu fica no bloco das marcas de `src/main.ts`, lida de `getKartPose`, `getLapState` e
`getHandlingTelemetry`. Linhas de `src/main.ts` da rodada 3 (666 linhas).

## Realização por requisito

| Requisito | Arquivo e símbolo |
|---|---|
| REQ-FEAT-0005-01; NFR-0007 | `src/main.ts` `frame` (`simWheelGroundPositions(pose, lap.config).slice(2)` em y 0,055 m, `:591`: as posições traseiras de `wheelPositions` da configuração congelada da volta, levadas pela pose; nunca os centros das rodas do modelo); nada no bloco depende do tipo nem do fim da volta: no treino os trechos continuam nascendo enquanto `simStepCount` avança em `RUNNING` |
| REQ-FEAT-0005-07 | `src/main.ts` `frame` (`pose.simStepCount < lastSkidStepCount` → `previousSkids = []` e `lastSkidStepCount` ao contador lido, `:582-584`: a `InstancedMesh` não é tocada e o primeiro trecho depois de um reposicionamento sai da nova posição); `beginLap` (`skidMarks.count = 0; skidIndex = 0; previousSkids = [];`, `:234`) |
| REQ-FEAT-0005-08 | `src/main.ts` `frame` (só `pose.simStepCount > lastSkidStepCount` entra no ramo que desenha, `:585`: quadro sem passo novo — pausa, `ENDED` da volta oficial, aba sem foco — não desenha nada, quaisquer que sejam os valores lidos) |
| REQ-FEAT-0005-11 | `src/main.ts` `frame` (`:585-608`: passo novo; `getLapState(lap).lapPhase === 'RUNNING'`, `:587-588`; `getHandlingTelemetry(lap.kart, setupRef)` sem `code`, `speedMps > 6` e `sideslipRad > 0.055`, `:592-593`; um trecho sob cada pneu traseiro de `previousSkids[i]` até a posição do quadro; `previousSkids` acompanha a posição traseira de todo quadro com passo novo em `RUNNING`, `:607`, de modo que o primeiro quadro da situação já desenha) |
| REQ-FEAT-0005-12 | `src/main.ts` `frame` (fase diferente de `RUNNING` ou sem volta → `previousSkids = []` sem trecho, `:588`; telemetria `NO_STATE` ou valores iguais ou abaixo dos limites → nenhum trecho, `:593`, limites estritos; nenhum comando do Jogador nem campo de `State.maneuvers` é lido; `SKID_STEP_INTERVAL` e os filtros de distância 0,03/3 m retirados) |
| REQ-FEAT-0005-09 | `src/main.ts`: nenhum objeto da cena é indicação de drift; `const tricks = state.maneuvers` retirado (nenhum leitor sobrou) e o bloco das marcas não lê `tricks` nem `maneuvers` |
| REQ-FEAT-0005-10 | `src/main.ts`: `exhaust`, `jet` (`ConeGeometry(0.18, 1.2, 8)`), `kart01.anchors.exhaustOutlet.add(exhaust)`, `exhaust.visible = tricks.boost > 0` e a pulsação por `state.elapsed` retirados; `const reducedMotion` retirado com os seus dois únicos leitores (o jato e a condição de turbo da câmera); `src/kart01Model.ts`: nó `escapamentoSaida` e `anchors.exhaustOutlet` retirados (`anchors` = `{ bumperPlate }`, `:45`, `:534`) |
| RULE-0003, FLOW-0001 | `src/main.ts` `lastSkidStepCount` (`:145`): o contador de sequência é `simStepCount`; no máximo um trecho sob cada pneu traseiro por valor novo |
| SCR-0001 | nenhum texto, controle ou elemento de HUD acrescentado ou retirado |

## Interface entregue

Estado de exibição: `skidMarks` (anel de 320 trechos, `skidIndex`), `previousSkids`, `lastSkidStepCount`. Saíram de `src/main.ts`:
`SKID_STEP_INTERVAL`, `exhaust`, `jet`, `tricks`, `reducedMotion`. Diferença conhecida (DES-0002): a marca fica 0,03 m para fora do
centro do pneu traseiro exibido, sob o pneu de 0,19 m.
