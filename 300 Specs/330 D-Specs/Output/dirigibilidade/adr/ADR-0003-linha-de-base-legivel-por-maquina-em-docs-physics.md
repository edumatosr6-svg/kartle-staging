---
id: ADR-0003
title: Linha de base legível por máquina dentro de docs/physics.md, uma entrada por versão e máquina; decide só o custo por passo e a identidade do Realista
feature: dirigibilidade
stage: dspec
status: validated
version: 2.0.0
sources: [API-0003, RULE-0002, FEAT-0006, REQ-FEAT-0006-04, REQ-FEAT-0006-06, REQ-FEAT-0006-08, REQ-FEAT-0006-09, NFR-0002, NFR-0004, NFR-0007]
---

# ADR-0003 — Linha de base legível por máquina dentro de docs/physics.md, uma entrada por versão e máquina; decide só o custo por passo e a identidade do Realista

## Contexto

RULE-0002 4.0.1 restringe a linha de base no veredito a `STEP_COST`: só conta a entrada de `docs/physics.md`
do mesmo ensaio, no mesmo ambiente e na mesma máquina e runtime; sem ela, `BASELINE_MISSING`; nunca inventada
nem extrapolada. Os demais ensaios têm limiares absolutos, e a sua linha de base — o mesmo ensaio, no mesmo
ambiente, com o Arcade anterior — é registrada ao lado do resultado do acerto novo (NFR-0004), sem entrar no
veredito. NFR-0007 exige que o Realista dê saída idêntica à sua linha de base (`REALISTA_UNCHANGED`). As
decisões de V0 e da geometria do arco saem com `UNDERSTEER_ONSET` e `REFERENCE_CORNER` (API-0003 4.0.0). O
bloco `handling-baseline` de `docs/physics.md` (`:282-429`) tem hoje três entradas medidas com os ensaios da
revisão 3 (`arcade-assistido-v4` e `realista-aluguel-4t-v4` de 2026-10-22; `arcade-assistido-v5` refeita em
2026-10-27), e `readBaseline` toma a primeira entrada com o `setupId`, a `setupVersion` e o `runtimeId`
pedidos. O custo por passo só é comparável na mesma máquina e runtime (NFR-0002), e o repositório não pode
carregar nome de máquina nem de usuário (I6).

## Decisão

1. `docs/physics.md` contém um bloco cercado ` ```json handling-baseline ` com a forma de
   [DM-0001](../data/DM-0001-dado-publicado-registros-e-linha-de-base.md), seção 5, ao lado da entrada em
   prosa datada; os ensaios leem o bloco, as pessoas a prosa. Cada entrada traz `parameters` e cada registro
   `benchEnvironment`.
2. **Uma entrada por (`setupId`, `setupVersion`, `runtimeId`).** Medir de novo uma versão com os ensaios de uma
   versão nova deste projeto substitui a sua entrada no bloco; a prosa datada anterior fica como histórico.
   Nesta entrega: `arcade-assistido-v4` (`npm run bench:handling -- --previous`, `previousConfig` =
   `ARCADE_KART`) e `realista-aluguel-4t-v4` (`--realista`) medidas de novo e substituídas;
   `arcade-assistido-v6` acrescentada; `arcade-assistido-v5` mantida como registro da rodada substituída.
3. A linha de base decide só: `STEP_COST` (o `meanStepCostUs` da entrada da `previousSetupVersion` do acerto
   ensaiado com o mesmo `runtimeId`) e `REALISTA_UNCHANGED` (registro a registro contra a entrada do Realista,
   por ambiente). `baselineLapTimeMs` e `baselineAvailable` dos demais registros são informativos.
4. A resolução de um registro exige igualdade de `benchId`, `benchEnvironment`, `inputMode` e variante
   (`steerInputNorm`, `entrySpeedMps` quando presentes). Um registro de `benchId` retirado nunca é igual a um
   desta versão e é ignorado.
5. `runtimeId` = `${process.platform}-${process.arch}-node${process.versions.node}-${os.cpus()[0].model}`, sem
   `os.hostname()` nem `os.userInfo()`, calculado em `scripts/keyboard-lap.ts` e passado à biblioteca como
   argumento: `scripts/handlingBench.ts` não importa `node:os`.
6. As execuções que produzem linha de base (`--previous`, `--realista`) não recebem `baseline` nem
   `realistaBaseline`: uma linha de base nunca é julgada contra outra.

## Alternativas consideradas

- **Arquivo separado `docs/physics-baseline.json`.** O F-Spec nomeia `docs/physics.md`; seria um fato em dois
  lugares. Recusada.
- **Acrescentar a nova medição de `arcade-assistido-v4` ao lado da antiga, com a mais recente vencendo.** Duas
  entradas da mesma chave deixariam a escolha a uma regra de ordem que nenhum leitor documenta, e
  `REALISTA_UNCHANGED` compararia contra registros de `benchId` retirados (contando cada um como diferença).
  Recusada; a prosa datada guarda o histórico.
- **Manter as entradas de 2026-10-22 e julgar `REALISTA_UNCHANGED` só sobre os `benchId` comuns.** Deixaria
  sem linha de base os ensaios novos do Realista (`CORNER_RADIUS`, `CORNER_TURN`, `DRIFT_INERT`,
  `SPEED_CAP`), o que NFR-0007 não admite ("idênticas em 100 % das medidas"). Recusada.
- **Linha de base literal dentro dos testes; recalcular a linha de base em tempo de teste.** Não é "registrada
  em `docs/physics.md`" e esconderia a ausência. Recusadas.
- **`os.hostname()` como identidade de máquina.** Identificador potencialmente pessoal. Recusada.

## Consequências

- A etapa de código registra as três entradas novas (v4, Realista, v6) na mesma máquina de referência e
  atualiza a prosa; o custo por passo da linha de base passa a ser medido com o passo já sem a manobra de
  drift, o mesmo código que o acerto novo usa, como NFR-0002 pede (mesma máquina e runtime).
- `docs/physics.md` continua lido por `scripts/handlingBench.ts` com `node:fs`; o caminho é relativo à raiz e
  nunca é impresso.
- Uma mudança futura de um parâmetro de ensaio exige nova medição das linhas de base, porque a entrada
  registra os `parameters` com que foi medida.

## Estado

Aceita nesta rodada.
