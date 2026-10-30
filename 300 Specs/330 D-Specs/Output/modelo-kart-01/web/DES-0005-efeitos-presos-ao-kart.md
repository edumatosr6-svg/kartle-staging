---
id: DES-0005
title: Efeitos presos ao kart — marcas de pneu em wheelPositions por passo; nenhuma indicação de drift nem fumaça ou chama de turbo
feature: modelo-kart-01
stage: dspec
status: validated
version: 1.2.0
sources: [FEAT-0005, RULE-0003, FLOW-0001, SCR-0001, REQ-FEAT-0005-01, REQ-FEAT-0005-04, REQ-FEAT-0005-07, REQ-FEAT-0005-08, REQ-FEAT-0005-09, REQ-FEAT-0005-10, NFR-0007]
---

# DES-0005 — Efeitos presos ao kart

## Realiza

Os `REQ-*` em `sources`: cada trecho novo de marca de pneu na posição traseira de `wheelPositions` do lado
correspondente, levada pela pose do kart, sob o pneu traseiro exibido, também depois do fim de uma volta de
treino (REQ-FEAT-0005-01); as situações em que as marcas são desenhadas iguais às do jogo, sem acrescentar nem
retirar nenhuma (REQ-FEAT-0005-04); depois de um reposicionamento, trechos novos na nova posição sem mover os
já desenhados (REQ-FEAT-0005-07); na suspensão e depois do fim da volta oficial, nenhum trecho novo
(REQ-FEAT-0005-08); **nenhuma indicação de drift** junto ao Kart 01 e **nenhuma fumaça ou chama de turbo**
saindo do seu escapamento, antes da largada e em corrida, com qualquer comando do Jogador (REQ-FEAT-0005-09,
-10; `DOMAIN/DEC-07`). As marcas continuam vindo de `wheelPositions`, nunca das rodas do modelo (NFR-0007;
`DOMAIN/DEC-02`). Os requisitos 02 e 03 de FEAT-0005 (fumaça e indicação de drift nas posições do Kart 01),
que a versão 1.1.0 deste item realizava, foram retirados no F-Spec 1.3 e não são realizados aqui.

## Posicionamento

`src/main.ts`, camada **Aplicação**, alterado; `src/kart01Model.ts`, camada **Aplicação**, alterado só pela
retirada do nó de ancoragem do escapamento ([DES-0001](DES-0001-modelo-kart-01-montagem-agrupamento-e-decalques.md)).
Nenhum módulo novo: as posições das marcas vêm de `simWheelGroundPositions` de `src/kartPose.ts`
([DES-0002](DES-0002-estado-do-kart-para-exibicao-e-giro-das-rodas.md)). A primeira rodada de código desta
feature escreveu a versão 1.1.0 sobre `src/main.ts` do commit `0068a57`; esta versão é escrita sobre a árvore
corrente, que já carrega aquela rodada, e cita cada ponto por linha e símbolo.

## Interface

Inventário dos efeitos junto ao kart na árvore corrente (lido como as-built):

| Efeito | Onde está hoje | Quando o jogo o exibe | Nesta versão |
|---|---|---|---|
| Marcas de pneu | `InstancedMesh` de 320 trechos (`src/main.ts:141-146`); um trecho entre a posição traseira anterior e a atual a cada `SKID_STEP_INTERVAL` passos (`:147-149`, `:557-580`), nas posições de `simWheelGroundPositions(pose, lap.config)` | a condição de situação do jogo (`:559`: `lap.phase === 'RUNNING'`, `maneuvers.drifting`, `speed > 6` m/s e `abs(telemetry.sideslip) > 0.055`) | **mantidas**: só a ancoragem é desta feature |
| Jato de escapamento (fumaça ou chama de turbo) | um cone filho de `kart01.anchors.exhaustOutlet` (`src/main.ts:150-157`), visível com `maneuvers.boost > 0` e pulsação por `state.elapsed` (`:555-556`) | com o turbo ativo | **retirado** (REQ-FEAT-0005-10) |
| Indicação de drift junto às rodas traseiras | nenhum objeto próprio na cena; a versão 1.1.0 deste item designava as marcas de pneu, nascidas durante o drift, como a indicação | durante o drift | **nenhum efeito**: nenhum objeto da cena é indicação de drift; as marcas são só marcas de pneu (REQ-FEAT-0005-09) |

| Trecho da árvore corrente | Mudança desta versão |
|---|---|
| `src/main.ts:150-157` (`exhaust`, `jet` com `ConeGeometry(0.18, 1.2, 8)`, `kart01.anchors.exhaustOutlet.add(exhaust)`) | **retirado por inteiro**: nenhum objeto de fumaça ou chama é criado nem preso ao Kart 01 (REQ-FEAT-0005-10) |
| `src/main.ts:555-556` (`exhaust.visible = tricks.boost > 0`; `exhaust.scale.z = …`) | **retirado**: nenhum quadro lê o estado de turbo para desenhar algo junto ao kart, antes da largada ou em corrida, com qualquer comando (REQ-FEAT-0005-10) |
| `src/kart01Model.ts:45`, `:526-530`, `:539` (`anchors.exhaustOutlet`, nó `escapamentoSaida`) | **retirado**: o nó existia só para prender o jato e fica sem consumidor; `anchors` passa a `{ bumperPlate }` ([DES-0001](DES-0001-modelo-kart-01-montagem-agrupamento-e-decalques.md)); nenhuma geometria muda e o custo de desenho não muda (o nó não tinha geometria) |
| `src/main.ts:557-580` (marcas de pneu) | **inalterado**: um trecho novo por `SKID_STEP_INTERVAL` (5) passos de `simStepCount` em que a condição de situação vale; nas posições traseiras de `simWheelGroundPositions(pose, lap.config)` em `y` 0,055 m; contador que recua (nova volta, reposicionamento) esvazia `previousSkids` sem tocar os trechos gravados (REQ-FEAT-0005-01, -07, -08). Nenhum efeito é acrescentado para indicar drift (REQ-FEAT-0005-09) |
| condição de situação (`:559`) | **não é desta feature** e não muda aqui (REQ-FEAT-0005-04: esta feature muda onde a marca aparece, não quando). Ela já existia antes desta feature (`src/main.ts:447` de `0068a57`) e hoje lê `maneuvers.drifting`; a retirada do drift do jogo é da `dirigibilidade` (revisão 4, `DOMAIN/DEC-07`), cuja etapa de código troca essa condição pela que o jogo mantiver ao retirar o drift ([ADR-0003](../adr/ADR-0003-ordem-de-entrega-depois-da-dirigibilidade-e-sem-chave.md)). Qualquer que seja ela, as marcas continuam ancoradas por este item |

Depois do fim da volta oficial (`ENDED`) a simulação está parada (INV-1 de `race-lap-validation`):
`simStepCount` não avança e nenhum trecho novo é desenhado, as marcas já desenhadas ficam onde estão
(REQ-FEAT-0005-08). Depois do fim de uma volta de treino, o kart não congela (`race-lap-validation` revisão 3,
US-10): `simStepCount` continua avançando e, sempre que a condição de situação vale, os trechos novos
continuam nascendo sob os pneus traseiros, sem nada aqui que dependa do fim da volta (REQ-FEAT-0005-01). Se
`race-lap-validation` representar a volta seguinte do treino com uma fase diferente de `RUNNING`, a condição de
situação de `:559` é a que decide, e ela não é desta feature.

Diferença conhecida: a marca de 0,19 m de largura é desenhada 0,03 m para fora do centro do pneu traseiro
exibido (bitola 1,20 m contra 1,14 m) e, ao longo do rumo, a no máximo 0,01 m do eixo traseiro do modelo;
fica sob o pneu de 0,19 m ([DES-0002](DES-0002-estado-do-kart-para-exibicao-e-giro-das-rodas.md)). Se o
roteiro em tela mostrar a marca fora do pneu, o critério 01 de US-0005 falha e a decisão volta ao dono do
produto; nem `wheelPositions` nem o modelo mudam aqui (`DOMAIN/DEC-02`).

O HUD da manobra (`#drift-hud`, a classe `.boosting` de `.game-shell`, as mensagens de `notify` em
`src/main.ts:500-504` e `:616-626`) não é efeito junto ao Kart 01 exibido e não é desta feature: é da
`dirigibilidade`, que retira o drift e o turbo do jogo. Este item não o toca.

## Colaboradores

Chama `src/kartPose.ts` (`simWheelGroundPositions`); lê `lap.kart.maneuvers` e `lap.kart.telemetry.sideslip`
só pela condição de situação das marcas, como o jogo já lia. Depois desta versão nenhum objeto desta feature
lê `maneuvers.boost`. Não é chamado por nenhum módulo.

## Estado e concorrência

Estado de exibição: a `InstancedMesh` das marcas (anel de 320 trechos, `skidIndex`), `previousSkids`,
`lastSkidStepCount`. Contador de sequência: `simStepCount`; um trecho por intervalo de passos em que a
situação vale; o mesmo passo nunca desenha um segundo trecho; um contador que recua reinicia `previousSkids`
sem apagar trechos. A indicação de drift e a fumaça ou chama de turbo não têm estado: nenhum objeto as
desenha. Nada é persistido.

## Comportamento em falha

Sem rede, sem tempo-limite, sem escrita. `previousSkids` vazio (primeiro quadro de uma situação de marca)
não desenha trecho. Nada é registrado em log.

## Observabilidade

`TELEMETRY_WHEEL_POSITIONS` prova que os pontos de ancoragem são os de `wheelPositions` e não os do modelo
([DES-0006](DES-0006-verificacoes-de-npm-test-e-relatorio-do-modelo.md)); o teste de contrato prova a ausência
do jato, do nó de ancoragem do escapamento e de qualquer leitura de `maneuvers.boost` na cena; o roteiro em
tela E2E-05 de [test-strategy.md](../test-strategy.md) confirma marca sob o pneu, trechos antigos parados
depois de um reposicionamento, nenhum trecho novo depois do fim da volta oficial, trechos novos depois do fim
de uma volta de treino, e nenhuma indicação de drift nem fumaça ou chama de turbo com qualquer comando.

## Determinismo (D-DS-07)

Não é código de simulação; a cadência das marcas lê `simStepCount`, nunca `dt`, de modo que a mesma
sequência de passos desenha os mesmos trechos. Prova: `RENDER_NEUTRAL` (os efeitos não escrevem na simulação)
e `tests/modelo-kart-01-pose.test.ts` (`simWheelGroundPositions` igual à transformação de `wheelPositions`).

## Feature flag

Nenhuma: as marcas mudam só de onde aparecem, e os efeitos retirados não voltam por nenhuma configuração
(FEAT-0005, Configuração: nenhuma configuração religa um efeito retirado).

## Pontos em aberto

Nenhum.
