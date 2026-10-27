---
id: DES-0005
title: Efeitos presos ao kart — marcas de pneu em wheelPositions por passo, fumaça no escapamento do Kart 01 e indicação de drift — implementação
feature: modelo-kart-01
stage: code
status: validated
version: 1.0.0
sources: [FEAT-0005, RULE-0003, FLOW-0001, REQ-FEAT-0005-01, REQ-FEAT-0005-02, REQ-FEAT-0005-03, REQ-FEAT-0005-04, REQ-FEAT-0005-07, REQ-FEAT-0005-08, NFR-0007]
---

# DES-0005 — Efeitos presos ao kart — implementação

`src/main.ts`, camada aplicação, alterado nos trechos das marcas, do jato de escapamento e de `beginLap`. Nenhum módulo novo: as
posições vêm de `simWheelGroundPositions` (`src/kartPose.ts`) e o ponto do escapamento de `kart01.anchors.exhaustOutlet`
(`src/kart01Model.ts`). Nenhum efeito é acrescentado ou retirado.

## Realização por requisito

| Requisito | Arquivo e símbolo |
|---|---|
| REQ-FEAT-0005-01; NFR-0007 | `src/main.ts` `frame` (`simWheelGroundPositions(pose, lap.config).slice(2)` em y 0,055 m, `:472`: as posições traseiras de `wheelPositions` da configuração congelada da volta, levadas pela pose; nunca os centros das rodas do modelo) |
| REQ-FEAT-0005-02 | `src/main.ts` `exhaust`/`jet` (`:140-147`: um `ConeGeometry(0.18, 1.2, 8)` com o material de hoje, filho de `kart01.anchors.exhaustOutlet`, `rotation.x = π/2` apontando para trás do kart, base na saída da ponteira em `z = 0,6`); `frame` (`exhaust.visible = tricks.boost > 0`, `exhaust.scale.z = 1 + sin(state.elapsed × 35) × 0,12`, `:464-465`) |
| REQ-FEAT-0005-03 | `src/main.ts` `frame` (as marcas nascem sob os pneus traseiros do Kart 01 exibido durante o drift; nenhum efeito novo) |
| REQ-FEAT-0005-04 | `src/main.ts` `frame` (condição das marcas `lap.phase === 'RUNNING'`, `tricks.drifting`, `state.speed > 6`, `abs(sideslip) > 0.055`, `:468`; trecho só entre 0,03 m e 3 m; fumaça com `boost > 0`: as situações de hoje) |
| REQ-FEAT-0005-07 | `src/main.ts` `frame` (`pose.simStepCount < lastSkidStepCount` → `previousSkids = []` e `lastSkidStepCount = pose.simStepCount`, `:467`: o primeiro trecho depois de um reposicionamento sai da nova posição e a `InstancedMesh` não é tocada); `beginLap` (`skidMarks.count = 0; skidIndex = 0; previousSkids = [];`, `:232`, sem `skidClock`; `lastSkidStepCount` não é escrito ali) |
| REQ-FEAT-0005-08 | `src/main.ts` `SKID_STEP_INTERVAL` 5 (`:138`) e `frame` (`pose.simStepCount − lastSkidStepCount >= SKID_STEP_INTERVAL`, `:469-470`: um trecho a cada 5 passos, 41,7 ms; num quadro sem passo novo ou na pausa nada é desenhado; a fumaça é filha do modelo e `state.elapsed` congela na pausa) |
| RULE-0003, FLOW-0001 | `src/main.ts` `lastSkidStepCount` (`:136`): o contador de sequência é `simStepCount`; o mesmo passo nunca desenha um segundo trecho |

## Interface entregue

Estado de exibição: `skidMarks` (anel de 320 trechos, `skidIndex`), `previousSkids`, `lastSkidStepCount`, `exhaust`. O símbolo
`skidClock` saiu de `src/main.ts` por inteiro (os quatro usos de `0068a57`). Diferença conhecida (DES-0002): a marca fica 0,03 m para
fora do centro do pneu traseiro exibido, sob o pneu de 0,19 m.
