---
id: DES-0005
title: Efeitos presos ao kart — marcas de pneu em wheelPositions, um trecho por quadro com passo novo na situação de marca de pneu; nenhuma indicação de drift nem fumaça ou chama de turbo
feature: modelo-kart-01
stage: dspec
status: validated
version: 1.4.0
sources: [FEAT-0005, RULE-0003, FLOW-0001, SCR-0001, REQ-FEAT-0005-01, REQ-FEAT-0005-07, REQ-FEAT-0005-08, REQ-FEAT-0005-09, REQ-FEAT-0005-10, REQ-FEAT-0005-11, REQ-FEAT-0005-12, NFR-0007]
---

# DES-0005 — Efeitos presos ao kart

## Realiza

Os `REQ-*` em `sources`: cada trecho novo de marca de pneu na posição traseira de `wheelPositions` do lado
correspondente, levada pela pose do kart, sob o pneu traseiro exibido, também depois do fim de uma volta de
treino (REQ-FEAT-0005-01); um trecho novo sob cada pneu traseiro em cada quadro em que a **situação de marca de
pneu** vale — `simStepCount` maior que no quadro anterior, `lapPhase` `RUNNING`, `speedMps` maior que 6 e
`sideslipRad` maior que 0,055, lidos do estado do último passo concluído (REQ-FEAT-0005-11) — e nenhum em
quadro algum em que uma das condições não vale, inclusive antes da largada, na pausa, com valores exatamente
no limite e com `getHandlingTelemetry` sem estado, com qualquer comando (REQ-FEAT-0005-12); depois de um
reposicionamento, trechos novos na nova posição sem mover os já desenhados (REQ-FEAT-0005-07); na suspensão e
depois do fim da volta oficial, nenhum trecho novo, mesmo com velocidade e derrapagem lateral do último estado
acima dos limites (REQ-FEAT-0005-08); **nenhuma indicação de drift** junto ao Kart 01 e **nenhuma fumaça ou
chama de turbo** saindo do seu escapamento, antes da largada e em corrida, com qualquer comando do Jogador
(REQ-FEAT-0005-09, -10; `DOMAIN/DEC-07`). As marcas continuam vindo de `wheelPositions`, nunca das rodas do
modelo (NFR-0007; `DOMAIN/DEC-02`). Os requisitos 02 e 03 de FEAT-0005 foram retirados no F-Spec 1.3 e o 04
(situações iguais às de antes da feature) na versão 2.1.0 de FEAT-0005, substituído pelos 11 e 12
(`DOMAIN/DEC-09`); nenhum deles é realizado aqui.

## Posicionamento

`src/main.ts`, camada **Aplicação**, alterado; `src/kart01Model.ts`, camada **Aplicação**, alterado só pela
retirada do nó de ancoragem do escapamento ([DES-0001](DES-0001-modelo-kart-01-montagem-agrupamento-e-decalques.md)).
Nenhum módulo novo e nenhuma função nova: as posições das marcas vêm de `simWheelGroundPositions` de
`src/kartPose.ts` ([DES-0002](DES-0002-estado-do-kart-para-exibicao-e-giro-das-rodas.md)); a fase da volta, de
`getLapState` (`src/lap.ts`, `race-lap-validation`); a velocidade e a derrapagem lateral, de
`getHandlingTelemetry` (`src/physics.ts:431`, `dirigibilidade`), já importada por `src/main.ts:2`; todos
nomeados e não redefinidos. A decisão da situação fica no bloco das marcas de `src/main.ts`, na camada de
aplicação que já desenha as marcas: ela só compara valores que a simulação e a volta informam, sem calcular
nada a partir do modelo exibido (`SEED/RD-01`, I2). Esta versão cita a árvore corrente por símbolo e linha; a
etapa de código reencontra cada ponto pelo símbolo se as linhas se moverem.

## Interface

Inventário dos efeitos junto ao kart na árvore corrente (lido como as-built):

| Efeito | Onde está hoje | Quando o jogo o exibe | Nesta versão |
|---|---|---|---|
| Marcas de pneu | `InstancedMesh` `skidMarks` de 320 trechos (`src/main.ts:140`); um trecho entre a posição traseira anterior e a atual a cada `SKID_STEP_INTERVAL` (5) passos (`:147`, bloco `:552-575`), nas posições de `simWheelGroundPositions(pose, lap.config)` | `if` de `:554`: `lap.phase === 'RUNNING'`, `tricks.drifting`, `state.speed > 6` e `Math.abs(state.telemetry.sideslip) > 0.055`; `previousSkids` esvaziado sempre que o `if` não vale (`:575`) | **na situação de marca de pneu**, um trecho por quadro com passo novo (Situação de marca de pneu, abaixo) |
| Jato de escapamento (fumaça ou chama de turbo) | um cone filho de `kart01.anchors.exhaustOutlet` (`exhaust`, `jet`, `src/main.ts:149-156`), visível com `tricks.boost > 0` e pulsação por `state.elapsed` (`:550-551`) | com o turbo ativo | **retirado** (REQ-FEAT-0005-10) |
| Indicação de drift junto às rodas traseiras | nenhum objeto próprio na cena; a versão 1.1.0 deste item designava as marcas de pneu, nascidas durante o drift, como a indicação | durante o drift | **nenhum efeito**: nenhum objeto da cena é indicação de drift; as marcas são só marcas de pneu (REQ-FEAT-0005-09) |

| Trecho da árvore corrente | Mudança desta versão |
|---|---|
| `src/main.ts:149-156` (`exhaust`, `jet` com `ConeGeometry(0.18, 1.2, 8)`, `kart01.anchors.exhaustOutlet.add(exhaust)`) | **retirado por inteiro**: nenhum objeto de fumaça ou chama é criado nem preso ao Kart 01 (REQ-FEAT-0005-10) |
| `src/main.ts:550-551` (`exhaust.visible = tricks.boost > 0`; `exhaust.scale.z = …`) | **retirado**: nenhum quadro lê o estado de turbo para desenhar algo junto ao kart, antes da largada ou em corrida, com qualquer comando (REQ-FEAT-0005-10) |
| `src/kart01Model.ts:45`, `:526-530`, `:539` (`anchors.exhaustOutlet`, nó `escapamentoSaida`) | **retirado**: o nó existia só para prender o jato e fica sem consumidor; `anchors` passa a `{ bumperPlate }` ([DES-0001](DES-0001-modelo-kart-01-montagem-agrupamento-e-decalques.md)); nenhuma geometria muda e o custo de desenho não muda (o nó não tinha geometria) |
| `src/main.ts:147` (`const SKID_STEP_INTERVAL = 5`) e `:555` (`pose.simStepCount - lastSkidStepCount >= SKID_STEP_INTERVAL`) | **retirados**: a cadência passa a um trecho por quadro com passo novo em que a situação vale (REQ-FEAT-0005-11); com 120 passos por segundo e 60 quadros, o intervalo de 5 passos deixaria quadros com a situação válida sem trecho |
| `src/main.ts:553-575` (bloco das marcas: contador que recua, `if` de `:554`, `else { previousSkids = []; }`) | **reescrito** pelas tabelas abaixo: o `if` decide a situação de marca de pneu (sem `tricks`), e `previousSkids` acompanha a posição traseira de todo quadro com passo novo em `RUNNING`, de modo que o primeiro quadro de uma situação já desenha o seu trecho; nas posições traseiras de `simWheelGroundPositions(pose, lap.config)` em `y` 0,055 m, como hoje (REQ-FEAT-0005-01, -07, -08, -11, -12). Nenhum efeito é acrescentado para indicar drift (REQ-FEAT-0005-09) |

### Situação de marca de pneu (RULE-0003, tabela "Trecho novo de marca de pneu")

Lida uma vez por quadro, depois do laço de passos, com o estado do último passo concluído; nenhum passo
intermediário é lido nem estimado:

| Condição | Lida de | Unidade | Vale quando |
|---|---|---|---|
| simulação avançou | `pose.simStepCount` (`getKartPose`, sem `code`) contra `lastSkidStepCount` | passos | `pose.simStepCount > lastSkidStepCount` |
| volta em andamento | `getLapState(lap).lapPhase` | — | `=== 'RUNNING'` (não `COUNTDOWN`, `PAUSED`, `ENDED` nem `NO_ACTIVE_LAP`) |
| telemetria disponível | `getHandlingTelemetry(state, setupRef)` | — | sem `code` (`NO_STATE` não vale; nada é estimado) |
| velocidade do kart | `speedMps` da telemetria | m/s | `> 6` (exatamente 6 não vale) |
| derrapagem lateral | `sideslipRad` da telemetria (já em módulo) | rad | `> 0.055` (exatamente 0,055 não vale; os dois lados comparados ao mesmo limite) |

Quadro a quadro, no bloco das marcas:

| Caso | Efeito no estado de exibição | Trecho novo |
|---|---|---|
| `pose` com `code`, ou `pose.simStepCount < lastSkidStepCount` (nova volta; reposicionamento, em que `initialState()` volta o contador a 0, `src/lap.ts:168`) | `previousSkids = []`; `lastSkidStepCount` passa ao contador lido | nenhum |
| `pose.simStepCount === lastSkidStepCount` (quadro sem passo novo: pausa, `ENDED` da volta oficial, aba sem foco) | nada muda | nenhum, quaisquer que sejam os valores lidos (REQ-FEAT-0005-08, -12) |
| passo novo e `lapPhase` diferente de `RUNNING` | `previousSkids = []`; `lastSkidStepCount` passa ao contador lido | nenhum (REQ-FEAT-0005-12) |
| passo novo, `RUNNING`, e a telemetria sem estado ou com `speedMps <= 6` ou `sideslipRad <= 0.055` | `previousSkids` passa às posições traseiras do quadro; `lastSkidStepCount` passa ao contador lido | nenhum (REQ-FEAT-0005-12) |
| passo novo, `RUNNING`, `speedMps > 6` e `sideslipRad > 0.055` | um trecho sob cada pneu traseiro, de `previousSkids[i]` até a posição traseira do quadro; depois `previousSkids` e `lastSkidStepCount` passam aos do quadro | **um sob cada pneu traseiro** (REQ-FEAT-0005-01, -11) |

- O ponto de partida do trecho é a posição traseira do quadro anterior com passo novo em `RUNNING`, guardada
  mesmo fora da situação; por isso o primeiro quadro de uma situação desenha o seu trecho. `previousSkids` só
  fica vazio depois de um contador que recua ou de uma fase diferente de `RUNNING`; nesses casos o primeiro
  quadro seguinte com passo novo em `RUNNING` sai da largada ou do reposicionamento, com o kart parado
  (`initialState()`, `src/lap.ts:168`), e a situação não vale nele.
- Os filtros de distância de hoje (`distance < 0.03 || distance > 3`) saem: na situação o kart anda mais de
  0,05 m por passo, e o salto de um reposicionamento já é cortado pelo contador que recua. Um trecho liga duas
  posições de passos concluídos; nada é interpolado.
- O anel de 320 trechos (`skidIndex`) e a geometria do trecho (0,19 m × 0,012 m, `#202b28`, opacidade 0,38)
  não mudam; como hoje, o trecho mais antigo é reaproveitado quando o anel enche.
- Depois desta versão o bloco das marcas não lê `tricks` nem nenhum campo de `State.maneuvers`; `const tricks`
  (`src/main.ts:548`) fica só para o HUD da manobra, que é da `dirigibilidade`
  ([DES-0004](DES-0004-integracao-da-cena-em-main-ts.md)).
- **Quando entra**: na próxima rodada de código desta feature, junto com a regravação da linha de base com
  `arcade-assistido-v6` ([ADR-0003](../adr/ADR-0003-ordem-de-entrega-depois-da-dirigibilidade-e-sem-chave.md),
  decisão 6). A árvore corrente já publica `arcade-assistido-v6` (`src/physics.ts:106`) e mantém
  `State.maneuvers` constante na janela de compatibilidade da `dirigibilidade`, de modo que o `if` de `:554`
  hoje nunca vale.

Depois do fim da volta oficial (`ENDED`) a simulação está parada (INV-1 de `race-lap-validation`):
`simStepCount` não avança e nenhum trecho novo é desenhado, as marcas já desenhadas ficam onde estão
(REQ-FEAT-0005-08). Depois do fim de uma volta de treino, o kart não congela (`race-lap-validation` revisão 3,
US-10): `simStepCount` continua avançando e, em cada quadro em que a situação vale, os trechos novos
continuam nascendo sob os pneus traseiros, sem nada aqui que dependa do fim da volta (REQ-FEAT-0005-01, -11).
Se `race-lap-validation` representar a volta seguinte do treino com uma fase diferente de `RUNNING`, a
condição de fase decide, como para qualquer outra fase.

Diferença conhecida: a marca de 0,19 m de largura é desenhada 0,03 m para fora do centro do pneu traseiro
exibido (bitola 1,20 m contra 1,14 m) e, ao longo do rumo, a no máximo 0,01 m do eixo traseiro do modelo;
fica sob o pneu de 0,19 m ([DES-0002](DES-0002-estado-do-kart-para-exibicao-e-giro-das-rodas.md)). Se o
roteiro em tela mostrar a marca fora do pneu, os critérios 01 e 06 de US-0005 falham e a decisão volta ao
dono do produto; nem `wheelPositions` nem o modelo mudam aqui (`DOMAIN/DEC-02`).

O HUD da manobra (`#drift-hud`, a classe `.boosting` de `.game-shell`, as mensagens de `notify`) não é efeito
junto ao Kart 01 exibido e não é desta feature: é da `dirigibilidade`, que retira o drift e o turbo do jogo.
Este item não o toca.

## Colaboradores

Chama `src/kartPose.ts` (`getKartPose`, `simWheelGroundPositions`), `src/lap.ts` (`getLapState`) e
`src/physics.ts` (`getHandlingTelemetry`), todos leituras puras, na direção Aplicação → Domínio/Simulação
(I2). Não lê nenhum campo de `State.maneuvers` e nenhum comando do Jogador: tecla, toque ou inclinação só
mudam o que a simulação informa. Não é chamado por nenhum módulo.

## Estado e concorrência

Estado de exibição: a `InstancedMesh` das marcas (anel de 320 trechos, `skidIndex`), `previousSkids`,
`lastSkidStepCount`. Contador de sequência: `simStepCount`; no máximo um trecho sob cada pneu traseiro por
valor novo do contador; ler de novo o mesmo estado (quadro sem passo novo) não desenha nada; um contador que
recua reinicia `previousSkids` sem apagar trechos; um reposicionamento não move os trechos já desenhados
(REQ-FEAT-0005-07). A indicação de drift e a fumaça ou chama de turbo não têm estado: nenhum objeto as
desenha. Nada é persistido.

## Comportamento em falha

Sem rede, sem tempo-limite, sem escrita. `getKartPose` ou `getHandlingTelemetry` com `NO_STATE`: nenhum
trecho, nada estimado. Nada é registrado em log.

## Observabilidade

`TELEMETRY_WHEEL_POSITIONS` prova que os pontos de ancoragem são os de `wheelPositions` e não os do modelo
([DES-0006](DES-0006-verificacoes-de-npm-test-e-relatorio-do-modelo.md)); o teste de contrato prova a ausência
do jato, do nó de ancoragem do escapamento, de `SKID_STEP_INTERVAL` e de qualquer leitura de `tricks` ou de
`maneuvers` no bloco das marcas, e a situação com as quatro condições e os limites estritos; o roteiro em tela
E2E-05 de [test-strategy.md](../test-strategy.md) confirma marca sob o pneu, trechos ao escorregar de lado e
nenhum na reta nem antes da largada, trechos antigos parados depois de um reposicionamento, nenhum trecho na
pausa nem depois do fim da volta oficial, trechos novos depois do fim de uma volta de treino, e nenhuma
indicação de drift nem fumaça ou chama de turbo com qualquer comando.

## Determinismo (D-DS-07)

Não é código de simulação e não escreve nela (`RENDER_NEUTRAL`). A situação lê só o estado do último passo
concluído e o contador `simStepCount`, nunca `dt`; as pontas de cada trecho são posições de passos
concluídos. Quais passos viram pontas depende de onde os quadros caem, como o F-Spec define (um trecho por
quadro com passo novo); a simulação não muda por isso. Prova: `RENDER_NEUTRAL` e
`tests/modelo-kart-01-pose.test.ts` (`simWheelGroundPositions` igual à transformação de `wheelPositions`).

## Feature flag

Nenhuma: o F-Spec proíbe configuração (FEAT-0005: nenhuma configuração religa um efeito retirado) e a
situação de marca de pneu é a única que o F-Spec admite (`DOMAIN/DEC-09`); a mudança é só de exibição e não
toca a simulação nem dado persistido.

## Pontos em aberto

Nenhum.
