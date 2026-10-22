---
title: Registro de mudanças — modelo Kart 01 e câmera de jogo
feature: modelo-kart-01
stage: dspec
status: validated
version: 1.0.0
sources: []
---

# Registro de mudanças

## 2026-10-22 — rodada 1, Mode A

**O que mudou**

- Conjunto gerado do zero a partir do F-Spec validado de `300 Specs/320 F-Specs/Output/modelo-kart-01/`
  (1.1.0, `fspec-validation-20261022-1757`, SUCCESS; FEAT-0001 a FEAT-0006 com 63 requisitos `REQ-*`,
  API-0001 a API-0003, RULE-0001 a RULE-0003, FLOW-0001 a FLOW-0003, SCR-0001) e do código em execução na
  raiz do repositório (somente leitura, para posicionamento; `src/main.ts` do commit `0068a57`, que já
  carrega as mudanças de aplicação da `dirigibilidade`), com as decisões que o autor passou a esta rodada e
  que o F-Spec já traz (`DOMAIN/DEC-00` a `DOMAIN/DEC-06`): fonte do modelo em `docs/kart-01/kart.js`; no
  máximo 30 chamadas de desenho agrupando por material, com rodas, volante e braços animáveis; física não
  alinhada; retrato com horizontal ≥ 60°; descida da câmera na contagem; sombra; `ENDED` em `RACE_CHASE` e
  visão geral só antes da contagem; feature só de aplicação; código na raiz; **o código desta feature entra
  depois do da `dirigibilidade`**, registrado em `ADR-0003` e em `01-architecture.md`.
- Sete itens de projeto (`web/DES-0001` a `DES-0006`, `security/DES-0007`), um modelo de dados (`DM-0001`:
  linha de base da simulação e registro em tela), quatro ADR, `01-architecture.md`, `test-strategy.md` (cobre
  os 40 critérios `AC-*` e os 7 NFR) e `98-divergences.md` com 21 linhas abertas.
- `00-index.md` e `99-traceability.md` não foram escritos: o gate os gera com `lint_artifacts.py --emit`.
- As pastas `backend/`, `mobile/` e `core/` do esqueleto do estágio não existem: o produto não tem servidor
  nem aplicativo nativo, e esta feature não toca a simulação; tudo está em `web/`, `security/` e `data/`.

**Decisões de projeto onde o F-Spec deixou lacuna ou decisão de projeto** (todas em ADR ou no DES que as
usa; nenhuma muda requisito)

- Agrupamento por material: um material opaco com cores por vértice e as malhas de cada grupo mescladas;
  braços em três malhas rígidas com a mesma cinemática; decalques em dois materiais próprios; 27 chamadas
  planejadas — `ADR-0001`, `DES-0001`.
- Módulos novos na camada de aplicação: `src/kart01Model.ts` (sem DOM) e `src/kart01Decals.ts` (DOM),
  `src/kartPose.ts`, `src/gameCamera.ts`; relatório e verificações em `tests/helpers/kart01Report.ts`;
  gravador da linha de base em `scripts/kart01-baseline.ts` — `01-architecture.md`.
- `steerAngleRad` é `state.steering` (um ângulo para as duas rodas dianteiras), não o ângulo por roda da
  telemetria — `DES-0002`.
- `rollingSpeedMps` = módulo da velocidade com o sinal da componente ao longo do rumo (`bodyVelocity`) —
  `DES-0002`.
- Ponto de referência: `modelOffsetForwardM = 1,05 × (0,5 − frontWeight)` = 0,084 m — `DES-0002`.
- Giro acumulado por quadro com o `rollingSpeedMps` do último passo e `delta × STEP`; contador reiniciado
  sem girar; `WHEEL_SPIN` com velocidades inteiras e 120 passos num quadro para igualdade estrita sem
  tolerância — `DES-0002`, `DES-0006`.
- Câmera como função pura; suavização, atraso e termo de velocidade retirados; turbo +4° por inteiro; visão
  geral com inclinação de 10° ajustada aos limites da pista com margem de 5 %; descida `smoothstep` com
  retenção de 100 ms (= `MAX_FRAME_S`); retrato com vertical = max(62°, o que dá 60° na horizontal); campo
  de visão da visão geral e da descida = base da forma; `NO_STATE` ⇒ `TRACK_OVERVIEW` — `ADR-0002`,
  `DES-0003`.
- Sombra: a luz direcional e a sua caixa de sombra (±60 m) acompanham o kart exibido — `DES-0004`.
- Marcas de pneu com cadência por `simStepCount` (5 passos) no lugar do acumulador de relógio de parede, e
  `lap.config` no lugar do `config` da aplicação; um jato de escapamento preso ao nó `escapamentoSaida`;
  a indicação de drift realizada pela ancoragem das marcas, sem efeito novo — `DES-0005`.
- Linha de base como fixture JSON versionado em `tests/fixtures/`, gravado antes da primeira mudança de
  código, amarrado a `setupVersion` e `trackVersion`; serialização dos registros em linhas JSON — `ADR-0004`,
  `DM-0001`, `DES-0006`.
- Sem chave mestra, porque o F-Spec proíbe configuração; padrão neutro de I4 provado por `RENDER_NEUTRAL`,
  `SIM_CONTRACT` e `DETERMINISM` — `ADR-0003`.

**Itens fechados**: nenhum `ISSUE-<nn>` ou `FB-<nn>` (primeira geração). Divergências registradas: 21
linhas em `98-divergences.md`.

**Itens recusados, com motivo**

- Tornar o kart pilotável depois de `ENDED`, como o glossário e RULE-0002 do F-Spec descrevem ("o kart
  continua pilotável"): não projetado. Nenhum `REQ-*` desta feature o exige; hoje a sessão em `ENDED` não
  avança (`src/lap.ts:173`; `src/main.ts:403`), realizá-lo exigiria mudar `src/lap.ts` (proibido por
  REQ-FEAT-0006-06; INV-1 de `DM-0002` da `race-lap-validation`) ou avançar um kart fora da volta na
  aplicação; o ciclo da volta pertence à `race-lap-validation`. A câmera deste projeto vale nos dois casos.
  **Proposta ao autor para `SCOPE-BACKLOG.md` de `race-lap-validation` ou para `DOMAIN.md`:** "2026-10-22
  dspec-loop modelo-kart-01 rodada 1 — `DOMAIN/DEC-06` diz que o kart continua pilotável depois de `ENDED`;
  hoje a sessão encerrada não aceita passos. Decidir se é requisito de `race-lap-validation` (e como o
  Jogador chega à próxima visão geral) ou se a frase descreve só a câmera."
- Ângulo de esterço por roda (Ackermann) na exibição: API-0001 carrega um único `steerAngleRad`; recusado.
- Vista explodida (`explodirKart`) e opções de número, cores e piloto do código do Cowork: nenhum critério
  as pede (I10); não portadas.
- Suavização da câmera e do campo de visão, e termo de velocidade no campo de visão: retirados, porque
  violam REQ-FEAT-0003-05, -08, -10 e a idempotência de API-0003; a magnitude do turbo (+4°) é mantida.
- Visão geral girada em retrato (eixo longo da pista no eixo longo da tela): recusada por exigir
  interpolação de rolagem na descida; "pista inteira no quadro" é satisfeito com a altura maior.
- Efeito próprio de indicação de drift junto às rodas: não existe hoje e REQ-FEAT-0005-04 proíbe acrescentar
  situação ou efeito; as marcas realizam a ancoragem.
- Sombra de objetos a mais de 60 m do kart: deixa de ser desenhada com a caixa de sombra que acompanha o
  kart; a sombra de outros objetos é lacuna deliberada do F-Spec e a caixa fixa deixaria o kart sem sombra
  numa pista maior.
- Mudar a névoa (`Fog` 160–350 m): nenhum requisito; a visão geral da pista sintética fica visível. **Proposta
  ao autor:** a feature que trouxer uma pista cuja visão geral exija altura próxima de 300 m decide a névoa.
- Tolerância numérica em `WHEEL_SPIN` ou arredondamento no relatório: proibida pelos requisitos; a igualdade
  estrita é obtida pela escolha das velocidades e do número de passos da verificação.
- Verificar em `npm test` a diferença do repositório nos três arquivos da simulação (REQ-FEAT-0006-06): não
  é verificação de `npm test`; é a diferença do repositório, registrada pelo manifesto da etapa de código;
  `SIM_CONTRACT` cobre `STEP`, `Input` e as medidas.
- Campo extra em `SIM_CONTRACT` com um resumo do texto dos arquivos: API-0002 não o tem; o relatório segue o
  contrato campo a campo.
- Chave mestra desligada por padrão: proibida pelo F-Spec (`ADR-0003`).
- Impor ordem de entrega em relação à `pista-kart-park`: nenhuma decisão o pede; o projeto é independente
  da pista (`ADR-0003`).
- Instrumento de taxa de quadros dentro do jogo: superfície só de teste; a contagem é feita pelo navegador
  (`DES-0004`, `DM-0001`).
- Divergências com o sistema em execução: não foram recusadas; estão em `98-divergences.md`.
- Feedback a outra feature: nenhum escrito — nenhum requisito de outra feature precisa mudar para este
  conjunto ser realizável; a proposta sobre o kart pilotável em `ENDED` é uma pergunta ao autor, não uma
  mudança que este conjunto precise.
- A pasta do seed, `200 Requirements/230 Output/` e `210 Docs/` não foram lidos (conventions §12); as
  decisões do autor vieram com a invocação e o F-Spec as carrega. Os conjuntos de D-Spec das outras
  features foram lidos só para nomes de contratos (`getLapState`, `getHandlingTelemetry`, `DM-0002`) e para
  a forma da casa.
- Nenhum requisito foi enfraquecido, removido ou dividido.
