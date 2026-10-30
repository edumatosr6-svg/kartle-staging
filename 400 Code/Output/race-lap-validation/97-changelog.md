---
title: Registro de mudanças — validação de volta de corrida (estágio de código)
feature: race-lap-validation
stage: code
status: validated
version: 1.1.0
sources: []
---

# Registro de mudanças

## 2026-10-21 — rodada 1, Mode A

**O que mudou**

- Implementação integral do projeto validado (DES-0001 a DES-0012, DM-0001, DM-0002) na raiz do repositório, na ordem
  dado de pista, simulação, aplicação. Novos: `src/trackData.ts`, `src/lapTiming.ts`, `src/lap.ts`, `src/frameClock.ts`,
  `src/lapMessages.ts`, `docs/lap-validation-bench.md`. Alterados: `src/track.ts` (`Line`, `sideOf`, `crossLine`,
  `SYNTHETIC_TRACK_FILE`), `src/main.ts`, `index.html`, `src/style.css`. Inalterados: `src/physics.ts`,
  `src/maneuvers.ts`, `src/audio.ts`, `scripts/`, `tests/`, `package.json`, `tsconfig.json`.
- Registros de implementação em `core/`, `data/`, `web/` e `security/`, um por item de projeto, com o arquivo e o
  símbolo que realizam cada `REQ-*`; `98-divergences.md` com 11 linhas `resolved` e 1 `open`; `01-implementation.md`.
- `00-index.md` e `99-traceability.md` gerados pelo gate (`lint_artifacts.py --emit`), não escritos à mão.
- Portão: `npx tsc --noEmit` 0; `npm test` 0 (32 testes, 32 aprovados); `npm run build` 0; `bench:physics` e
  `bench:handling` com 0 linhas diferentes da árvore anterior.

**Decisões de implementação, onde o projeto deixava detalhe em aberto** (nenhuma muda contrato ou requisito)

- `LapSession` carrega um campo `environment` além da tabela de DM-0002: é o parâmetro `environment` de `startLap`
  (DES-0001) que `stepLap(lap, input)` precisa passar a `step`; vale `CIRCUIT` por padrão e não muda na sessão.
- `buildResult` ficou interna, com um segundo argumento `finishMs`: `b4` não está em `sectorBoundsMs` (0 a 3 inteiros, DM-0002)
  e só existe no resultado. `getLapResult` é a leitura pública.
- O botão `#start` de `index.html` deu lugar aos botões da oferta em `#lap-offer`, dentro de `#welcome`, conforme DES-0009
  ("o painel de boas-vindas passa a ser a oferta"); `#track-status` mostra `trackId` ou o texto de erro.
- O estado Vazio de SCR-0002 (`noTrackAvailable`) não ocorre com o arquivo empacotado: `UNREADABLE` e
  `UNSUPPORTED_SCHEMA` exibem `trackDataError`, como API-0003 e DES-0009 determinam para dado carregado e ilegível.
  A chave `noTrackAvailable` existe em `src/lapMessages.ts`.
- `lastOrientationAtMs` também é inicializado ao ativar a inclinação, além de ao continuar (ADR-0005), porque a variável
  precisa de um instante inicial; o efeito é a mesma tolerância de 500 ms.
- Trocar peso ou estilo continua zerando `best` (comportamento pré-existente, fora dos requisitos); as notificações
  passaram a dizer "Vale na próxima volta".
- `#lap-state` fica visível desde o início da volta (também na contagem), porque `describeLap` sempre devolve `stateText`
  e DES-0008 só manda escondê-lo sem volta ativa; o requisito "do sinal verde ao fim" fica satisfeito.

**Itens fechados**: nenhum `ISSUE-<nn>` ou `FB-<nn>` (primeira geração).

**Itens recusados, com motivo**

- Arquivos de teste nomeados por DES-0012 e test-strategy (`tests/lap-*.test.ts`, `tests/track-data.test.ts`,
  `tests/frame-clock.test.ts`, `tests/helpers/`, `tests/fixtures/track-v1.json`): pertencem ao estágio de testes;
  por isso a linha REQ-FEAT-0009-10 de `98-divergences.md` fica `open`.
- `docs/lap-validation-device-log.md`: é o teste registrado nos aparelhos e navegadores nomeados (test-strategy, E2E),
  evidência humana que esta rodada não pode produzir.
- Pausa manual por toque em `web-mobile`: não projetada (ADR-0004, item 4); o botão `#pause` só aparece em `PAUSED`.
- Nenhuma dependência, refatoração, renomeação ou reformatação fora dos arquivos que o projeto nomeia.
- Nenhum requisito foi enfraquecido, removido ou dividido.

**Migração de verificações existentes**: nenhuma verificação foi removida ou alterada; `tests/physics.test.ts` e
`scripts/keyboard-lap.ts` continuam usando `LapTracker` por `src/physics.ts`.

## 2026-10-30 — rodada 2, Mode B (projeto revalidado: treino de voltas seguidas)

**O que mudou**

- `src/lap.ts`: o treino é uma `LapSession` com `lapSequenceCount`, `lapStartMs` e `results` (no lugar de `result`);
  `closeTrainingLap` fecha a volta na chegada e abre a seguinte no mesmo inteiro de ms, sem parar; o corte no treino
  invalida sem encerrar e não muda uma volta já inválida; reposicionar no treino não toca a validade; `pauseLap` com
  `PAUSE_BUTTON` e `NOT_TRAINING`; novas `endTraining` e `listLapResults`; `getLapResult` lê o último item; `getLapState`
  com `lapSequenceCount`, `lapStartMs`, `bestValidLapMs` (derivada) e `elapsedMs` desde `lapStartMs`; limite de setor
  registrado depois de um limite saltado, com `null`; linhas declaradas de uma leitura `INCOMPLETE` com sentido e
  chegada; `buildResult` com `b0 = lapStartMs`, setores só com os 3 limites e campos de treino.
- `src/lapMessages.ts`: chaves `pauseAction`, `endTrainingAction`, `bestValidLap`, `sectorNoTime`; `startTraining`
  "treino"/"training"; `formatSectorTime`, `describeTrainingResult`.
- `src/main.ts`: `emitEndTraining`; `#pause` como botão de pausa no treino; gancho de resultado por crescimento de
  `listLapResults` (`handledResults`), que fecha o gatilho pedido pela linha R de `400 Code/Output/dirigibilidade/98-divergences.md`
  (`recordLapResult` passa a receber cada resultado do treino, com os campos de treino copiados por `buildLapRecord`);
  `#lap-best-valid` e `#lap-training-result` em `renderHud`; tela de resultado só fora do treino.
- `index.html`: `#lap-end-training` na barra de ações, `#lap-best-valid` e `#lap-training-result`. `src/style.css`: uma linha
  nova com o posicionamento dos dois elementos, usando as fichas existentes.
- Manifesto: registros DES-0001 a DES-0005, DES-0007 a DES-0012 e DM-0002 em 1.1.0 com os `REQ-FEAT-0010-*` do projeto;
  `98-divergences.md` 1.1.0 com as seis linhas da rodada de 2026-10-30 resolvidas, a linha de 2026-10-22 carregada, as
  citações de linha atualizadas e as verificações reprovadas pela mudança de projeto; `01-implementation.md` 1.1.0.
  `00-index.md` e `99-traceability.md` regenerados pelo gate.

**Itens fechados**: as seis linhas `open` da rodada de 2026-10-30 de `300 Specs/330 D-Specs/Output/race-lap-validation/98-divergences.md`.

**Decisões de implementação, onde o projeto deixava detalhe em aberto** (nenhuma muda contrato)

- O rótulo de `#pause` no treino leva o prefixo "❚❚", como o de continuar leva "▶"; o texto é `pauseAction`.
- `#lap-best-valid` e `#lap-training-result` ficam posicionados no canto direito, abaixo de `.timing` (112 px e 156 px do
  topo; 84 px e 124 px na largura de até 700 px). O painel do resultado do treino pinta todas as fichas com
  `--lap-chip-invalid-bg` num resultado `INVALID`, como `#lap-result`.
- A linha `index.html:34` também traz a dica de teclas de drift de outra feature: o botão novo foi acrescentado logo depois
  de `#pause`, sem mudar nenhum outro caractere da linha.

**Itens recusados ou não tratados, com motivo**

- As 13 verificações reprovadas (`98-divergences.md`, seção da rodada 2) supõem a volta de treino única que termina em
  `ENDED`, a vista de estado sem os campos novos ou 20 chaves; pertencem às etapas de testes de `race-lap-validation`,
  `pista-kart-park` e `dirigibilidade`. Nenhum teste foi editado. Os feedbacks a `pista-kart-park` e a `dirigibilidade`
  sobre o treino contínuo já foram enviados pelo validador do D-Spec; esta etapa não escreve outro.
- Linha da rodada de 2026-10-22 (`setupId` e `setupVersion`): carregada como `open`; a etapa devedora é o código de
  `dirigibilidade`, e a passagem a `resolved` é registrada por ela.
- Unificar o "Melhor" (`#best`, de `dirigibilidade`) com a melhor volta válida do treino: não feito, como no projeto.
- Atalho de teclado para pausar ou encerrar o treino e pausa por toque fora do treino: não projetados (ADR-0004).
- `docs/lap-validation-bench.md`: não refeito; `src/physics.ts` e `src/maneuvers.ts` não foram tocados.
- Nenhum requisito enfraquecido, removido ou dividido; nenhuma verificação removida ou alterada.
