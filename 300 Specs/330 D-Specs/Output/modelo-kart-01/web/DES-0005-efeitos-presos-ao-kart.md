---
id: DES-0005
title: Efeitos presos ao kart — marcas de pneu em wheelPositions por passo, fumaça no escapamento do Kart 01 e indicação de drift
feature: modelo-kart-01
stage: dspec
status: validated
version: 1.0.0
sources: [FEAT-0005, RULE-0003, FLOW-0001, REQ-FEAT-0005-01, REQ-FEAT-0005-02, REQ-FEAT-0005-03, REQ-FEAT-0005-04, REQ-FEAT-0005-07, REQ-FEAT-0005-08, NFR-0007]
---

# DES-0005 — Efeitos presos ao kart

## Realiza

Os `REQ-*` em `sources`: cada trecho novo de marca de pneu na posição traseira de `wheelPositions` do lado
correspondente, levada pela pose do kart, sob o pneu traseiro exibido (REQ-FEAT-0005-01); a fumaça saindo do
escapamento do Kart 01 (REQ-FEAT-0005-02); a indicação de drift junto às rodas traseiras exibidas
(REQ-FEAT-0005-03); as situações de cada efeito iguais às de hoje (REQ-FEAT-0005-04); depois de um
reposicionamento, efeitos na nova posição sem mover as marcas já desenhadas (REQ-FEAT-0005-07); na suspensão,
nenhum trecho novo e efeitos presos ao kart parado (REQ-FEAT-0005-08). As marcas continuam vindo de
`wheelPositions`, nunca das rodas do modelo (NFR-0007; `DOMAIN/DEC-02`).

## Posicionamento

`src/main.ts`, camada **Aplicação**, alterado (trechos `:136-151` e `:443-472` do commit `0068a57`). Nenhum
módulo novo: as posições vêm de `simWheelGroundPositions` de `src/kartPose.ts`
([DES-0002](DES-0002-estado-do-kart-para-exibicao-e-giro-das-rodas.md)) e o ponto do escapamento de
`kart01.anchors.exhaustOutlet` ([DES-0001](DES-0001-modelo-kart-01-montagem-agrupamento-e-decalques.md)).

## Interface

Inventário dos efeitos que o jogo exibe hoje (lido como as-built; nenhum é acrescentado ou retirado):

| Efeito | Onde está hoje | Quando o jogo o exibe (inalterado) |
|---|---|---|
| Marcas de pneu | `InstancedMesh` de 320 trechos (`:136-142`); trecho entre a posição traseira anterior e a atual (`:447-472`) | `lap.phase === 'RUNNING'`, `maneuvers.drifting`, `speed > 6` m/s e `abs(telemetry.sideslip) > 0.055` (`:447`); trecho só com comprimento entre 0,03 m e 3 m (`:460`) |
| Fumaça do escapamento | dois cones presos ao kart de caixas em (±0,37, 0,4, −1,35) (`:143-151`), com pulsação por `state.elapsed` (`:446`) | `maneuvers.boost > 0` (`:445`) |
| Indicação de drift | não existe efeito próprio na cena junto às rodas: durante o drift, o efeito visual junto às rodas traseiras são as próprias marcas de pneu; fora da cena, o HUD (`#drift-hud`, `.boosting`) | as situações das marcas, acima |

| Trecho atual | Mudança |
|---|---|
| `:141` `let skidIndex = 0, skidClock = 0;` | `skidClock` (acumulador de relógio de parede) sai; entra `let lastSkidStepCount = 0;` |
| `:447-449` cadência `skidClock += dt; if (skidClock >= 0.04)` | a cadência passa a ser por passo da simulação: um trecho novo quando `pose.simStepCount − lastSkidStepCount >= SKID_STEP_INTERVAL` (constante local `5` passos = 41,7 ms, a cadência de 40 ms de hoje arredondada ao passo) e as condições de situação de hoje valem; então `lastSkidStepCount = pose.simStepCount`. Num quadro sem passo novo ou na pausa `simStepCount` não avança e nenhum trecho é desenhado (REQ-FEAT-0005-08; RULE-0003, Estado e repetição); o mesmo passo nunca desenha um segundo trecho |
| `:451-455` `wheelPositions(config).slice(2)` transformadas pela pose | `simWheelGroundPositions(pose, lap.config).slice(2)` em `y` 0,055 m, como hoje — as posições traseiras de `wheelPositions` levadas pela posição e pelo rumo, com a configuração **congelada da volta** (`lap.config`, `src/lap.ts:120`) em vez do `config` corrente da aplicação (mesmos valores hoje; a volta é a fonte) (REQ-FEAT-0005-01) |
| `:472` `else { previousSkids = []; skidClock = 0; }` | `previousSkids` é também esvaziado quando `pose.simStepCount < lastSkidStepCount` (contador reiniciado por nova volta ou reposicionamento) e `lastSkidStepCount` recebe o valor novo: o primeiro trecho depois de um reposicionamento sai da nova posição e os trechos já gravados na `InstancedMesh` não são tocados (REQ-FEAT-0005-07) |
| `:143-151` jatos de escapamento | um único cone (`ConeGeometry(0.18, 1.2, 8)` com o material de hoje), filho de `kart01.anchors.exhaustOutlet`, apontando para trás do kart (`+Z` do referencial do modelo: `rotation.x = π / 2` no referencial do nó), com a base na saída da ponteira; visível com `maneuvers.boost > 0` e pulsação `scale.z = 1 + sin(state.elapsed × 35) × 0,12` como hoje (`state.elapsed` é tempo simulado: congela na pausa) (REQ-FEAT-0005-02, -04, -08) |
| Indicação de drift | realizada pela ancoragem das marcas: durante o drift elas nascem sob os pneus traseiros do Kart 01 exibido (REQ-FEAT-0005-03); nenhum efeito novo é criado (REQ-FEAT-0005-04) |

Diferença conhecida: a marca de 0,19 m de largura é desenhada 0,03 m para fora do centro do pneu traseiro
exibido (bitola 1,20 m contra 1,14 m) e, ao longo do rumo, a no máximo 0,01 m do eixo traseiro do modelo;
fica sob o pneu de 0,19 m ([DES-0002](DES-0002-estado-do-kart-para-exibicao-e-giro-das-rodas.md)). Se o
roteiro em tela mostrar a marca fora do pneu, o critério 01 de US-0005 falha e a decisão volta ao dono do
produto; nem `wheelPositions` nem o modelo mudam aqui (`DOMAIN/DEC-02`).

## Colaboradores

Chama `src/kartPose.ts` (`simWheelGroundPositions`) e lê `kart01.anchors.exhaustOutlet` de
[DES-0001](DES-0001-modelo-kart-01-montagem-agrupamento-e-decalques.md); lê `lap.kart.maneuvers` e
`lap.kart.telemetry.sideslip` como hoje. Não é chamado por nenhum módulo.

## Estado e concorrência

Estado de exibição: a `InstancedMesh` das marcas (anel de 320 trechos, `skidIndex`), `previousSkids`,
`lastSkidStepCount`. Contador de sequência: `simStepCount`; um trecho por intervalo de passos em que a
situação vale; um contador que recua reinicia `previousSkids` sem apagar trechos. A fumaça é leitura
idempotente da pose do quadro (filha do modelo: segue o kart sem código por quadro). Nada é persistido.

## Comportamento em falha

Sem rede, sem tempo-limite, sem escrita. `previousSkids` vazio (primeiro quadro de uma situação de marca)
não desenha trecho, como hoje (`:458`). Nada é registrado em log.

## Observabilidade

`TELEMETRY_WHEEL_POSITIONS` prova que os pontos de ancoragem são os de `wheelPositions` e não os do modelo
([DES-0006](DES-0006-verificacoes-de-npm-test-e-relatorio-do-modelo.md)); o roteiro em tela E2E-05 de
`test-strategy.md` confirma marca sob o pneu, fumaça na ponteira e trechos antigos parados depois de um
reposicionamento.

## Determinismo (D-DS-07)

Não é código de simulação; a cadência das marcas deixa de ler `dt` e passa a ler `simStepCount`, de modo
que a mesma sequência de passos desenha os mesmos trechos. Prova: `RENDER_NEUTRAL` (os efeitos não escrevem
na simulação) e `tests/modelo-kart-01-pose.test.ts` (`simWheelGroundPositions` igual à transformação de
`wheelPositions`).

## Feature flag

Nenhuma: nenhum efeito é acrescentado ou retirado; muda só onde cada um aparece (FEAT-0005, Configuração).

## Pontos em aberto

Nenhum.
