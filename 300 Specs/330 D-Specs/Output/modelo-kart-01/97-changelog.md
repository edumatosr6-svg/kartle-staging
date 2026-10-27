---
title: Registro de mudanças — modelo Kart 01 e câmera de jogo
feature: modelo-kart-01
stage: dspec
status: validated
version: 1.2.0
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
  Jogador chega à próxima visão geral) ou se a frase descreve só a câmera." *(Superada na rodada 2: o dono
  do produto corrigiu `DOMAIN/DEC-06` em 2026-10-22 — a simulação para e o kart congela ao fim da volta, e a
  decisão descreve só a câmera —, os requisitos e o F-Spec 1.2.0 absorveram a correção, e este conjunto a
  carrega; nenhuma proposta pendente.)*
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
  mudança que este conjunto precise. *(O validador da rodada 1 enviou a mesma pergunta como FB-01 a
  `race-lap-validation` — `300 Specs/330 D-Specs/Output/race-lap-validation/reports/feedbacks/modelo-kart-01/feedback-20261022-1840.md`;
  superado na rodada 2, ver abaixo.)*
- A pasta do seed, `200 Requirements/230 Output/` e `210 Docs/` não foram lidos (conventions §12); as
  decisões do autor vieram com a invocação e o F-Spec as carrega. Os conjuntos de D-Spec das outras
  features foram lidos só para nomes de contratos (`getLapState`, `getHandlingTelemetry`, `DM-0002`) e para
  a forma da casa.
- Nenhum requisito foi enfraquecido, removido ou dividido.

## 2026-10-27 — rodada 2, Mode B (relatório `dspec-validation-20261027-1538.md`, 1 erro, 6 avisos, 2 info)

**O que mudou**

- Origem da ISSUE-09: o upstream moveu depois de `dspec-validation-20261022-1840` — F-Spec 1.1.0 → 1.2.0
  (`fspec-validation-20261027-1520`, SUCCESS; `01-overview.md`, `02-glossary.md`, `FEAT-0003`, `FLOW-0001`,
  `FLOW-0002`, `RULE-0002` e `SCR-0001` em 1.2.0; os 63 `REQ-*` e os três contratos sem mudança). O dono do
  produto corrigiu `DOMAIN/DEC-06` em `DOMAIN.md` (2026-10-22): a frase "o kart continua pilotável" depois
  de `ENDED` não vale — a simulação para e o kart congela, como hoje (invariante INV-1 de
  `race-lap-validation`), e a decisão descreve só a câmera, que continua atrás do piloto na pose de corrida,
  com o kart parado, até a próxima visão geral; os requisitos (`req-validation-20261022-1909`) e o F-Spec
  1.2.0 absorveram a correção. O autor passou a decisão a esta execução com a ordem de retirar toda frase de
  pilotagem depois de `ENDED` do que o D-Spec herdou e de não redescobri-la. O loop invocou Mode B sobre o
  relatório 1538, que registra o upstream movido como ISSUE-09: nenhum `REQ-*`, contrato, módulo, campo ou
  interface mudou entre 1.1.0 e 1.2.0, logo a herança a corrigir é só o que o conjunto afirmava do upstream.
- ISSUE-09 (error, D3/D9): `01-architecture.md` e `98-divergences.md` citam o F-Spec 1.2.0
  (`fspec-validation-20261027-1520`) como upstream realizado; o parágrafo das decisões do dono do produto e o
  parágrafo "Fluxo alterado" de `01-architecture.md` carregam a `DOMAIN/DEC-06` corrigida (simulação parada
  e kart congelado em `ENDED`, só a câmera na pose de corrida em relação ao kart parado); o parágrafo final
  de `98-divergences.md` deixa de atribuir ao F-Spec a frase "o kart continua pilotável" e diz que o
  congelamento ao fim da volta é o que o F-Spec 1.2.0 especifica (FEAT-0003, RULE-0002, FLOW-0001, glossário;
  INV-1 de `race-lap-validation`), já realizado por DES-0003, DES-0004 e ADR-0002, sem proposta pendente ao
  autor; a frase de ADR-0002 "Se `race-lap-validation` vier a manter o kart pilotável depois do fim da volta,
  nada aqui muda" saiu — a consequência diz que a decisão depende só da pose do kart e que nenhuma hipótese de
  pilotagem depois do fim da volta faz parte dela. O mesmo fato levado a DES-0003 (Realiza, `decideCameraMode`,
  idempotência: `simStepCount` não avança em `ENDED`), DES-0004 (linha `beginLap`/`emitReposition`/
  `#lap-new-lap`) e `test-strategy.md` (E2E-02 e AC-US-0003-13: kart parado, rodas sem giro). Fechada por
  edição.
- ISSUE-01 (warning, D1): as duas ligações de `01-architecture.md` a FLOW-0002 e FLOW-0003 passam a
  `../../../320%20F-Specs/Output/modelo-kart-01/flows/...`. Fechada por edição.
- ISSUE-02 (warning, D2): a tabela Interface de DES-0004 deixa de trazer instruções TypeScript: cada linha
  diz o que é lido, de que campo, em que ordem e com que condição — montagem do Kart 01 sob `kartRoot`, caixa
  de sombra e `sun.target`, `trackBounds`, estado local, pose de `kartRoot`, giro das rodas, chamada de
  `computeCameraView` por quadro, o contrato de `applyCameraView(camera, view)` (posição de
  `cameraXM`/`cameraHeightM`/`cameraZM`, mira de `aimXM`/`aimHeightM`/`aimZM`, `fov` = `verticalFovDeg`,
  `aspect` = largura ÷ altura, `far` = max(500 m, 3 × altura)), luz por quadro e desenho só com `cameraView`
  definida; os símbolos que o teste de contrato afirma (`kartRoot`, `sun.target.position`, `shadow.camera`
  com `left` −60, `paintKart01Decals`) continuam nomeados. Fechada por edição.
- ISSUE-03 (warning, D3): a linha `computeCameraView(inputs)` de DES-0003 declara que a função realiza a
  operação `getCameraView` de API-0003 (resposta `CameraView` campo a campo, erro `NO_SCENE`) e que as
  entradas do quadro são passadas explicitamente por `src/main.ts` porque a função é pura, num módulo sem DOM
  e sem relógio, sem "quadro corrente" para ler; nenhum símbolo `getCameraView` existe. O mesmo dito em
  Realiza e na tabela de camadas de `01-architecture.md`. Fechada por edição.
- ISSUE-04 (warning, D3): DES-0006 declara que `kartModelReport` (API-0002) é o nome do conjunto de registros
  que `npm test` produz, não um símbolo: cada arquivo de teste emite os seus registros por
  `t.diagnostic(serializeRecord(record))`, e a seção Interface diz qual dos três arquivos emite cada um dos
  12 `checkId`. O mesmo dito em Realiza e na tabela de camadas de `01-architecture.md`. Fechada por edição.
- ISSUE-05 (warning, D3/NFR-0006): a linha `simContractCheck(baseline)` de DES-0006 dá a
  `inputContractUnchanged` a semântica de API-0002 inteira — conjunto de campos igual **e** faixas iguais: os
  campos pela linha `export type Input = ...` contra `baseline.inputTypeLine` (a linha carrega só os campos);
  as faixas pela saturação de `step`, o contrato público da simulação (120 passos a partir de `initialState()`
  com cada acerto publicado: `Input` além do limite dá o mesmo `State` que no limite — `throttle` 2 ≡ 1 e
  −1 ≡ 0, `brake` 2 ≡ 1 e −1 ≡ 0, `steer` 3 ≡ 1 e −3 ≡ −1 —, e o limite dá `State` diferente de um valor
  dentro da faixa); as faixas anteriores à feature (`throttle` e `brake` em [0, 1], `steer` em [−1, 1], de
  `src/physics.ts:119`, `:204`, `:212-213`) são constantes da verificação. O mesmo levado a DM-0001 (linha
  `inputTypeLine`) e à linha NFR-0006 de `test-strategy.md`. Fechada por edição.
- ISSUE-06 (warning, D8): a linha FEAT-0004 de "Funcionalidade por nível" lê "sim" em Unitário e em
  Integração, com a razão alinhada às tabelas "Níveis" e "Requisitos não funcionais" (`DRAW_COST` sobre o
  modelo em Node na Integração; medidas sintéticas de 31 chamadas e 5.127 triângulos no Unitário). Fechada
  por edição.
- Versões: `01-architecture.md`, `98-divergences.md`, `test-strategy.md`, `adr/ADR-0002`, `data/DM-0001`,
  `web/DES-0003`, `web/DES-0004`, `web/DES-0006` e este changelog em 1.1.0, com `status: draft`; o gate e o
  validador decidem. Os demais arquivos sem mudança. `00-index.md` e `99-traceability.md` não foram tocados:
  o gate os regenera.
- Nenhum módulo, tabela, campo, endpoint, componente, requisito ou elemento de interface foi acrescentado
  (§16); as 21 divergências de `98-divergences.md` continuam `open`, sem linha nova.

**Itens fechados**: ISSUE-01 a ISSUE-06 e ISSUE-09, todos por edição. Divergências registradas: nenhuma
nova. FB-01 enviado a `race-lap-validation`
(`300 Specs/330 D-Specs/Output/race-lap-validation/reports/feedbacks/modelo-kart-01/feedback-20261022-1840.md`,
pelo validador da rodada 1): **superado pela correção** do dono do produto — a pergunta que ele fazia (se
"kart pilotável depois de `ENDED`" é requisito de `race-lap-validation` ou se a frase descreve só a câmera)
foi respondida em `DOMAIN/DEC-06` corrigida: descreve só a câmera; INV-1 de `race-lap-validation` fica como
está, aquela feature não deve mudança alguma por este conjunto, e a proposta da rodada 1 deste changelog está
respondida. Nenhum feedback novo foi escrito.

**Itens recusados, com motivo**

- ISSUE-07 (info): nenhuma mudança — a feature entra sem chave mestra porque o F-Spec proíbe configuração
  (FEAT-0001 e FEAT-0003) e o padrão neutro de I4 é provado por `RENDER_NEUTRAL`, `SIM_CONTRACT` e
  `DETERMINISM` (`ADR-0003`), como o relatório registrou.
- ISSUE-08 (info): nenhuma mudança — `WHEEL_SPIN` continua aplicando `advanceWheelSpin` num único quadro com
  `delta` = `checkStepCount`, para igualdade estrita sem tolerância; o caminho por sessão real está em `pose`
  (I), como o relatório registrou.
- Renomear `computeCameraView` para `getCameraView` (segunda opção da ISSUE-03): recusado; o nome
  `computeCameraView` diz que a função calcula a câmera das entradas que recebe, sem ler o quadro corrente, e
  os testes e DES-0004 já o nomeiam; a realização está declarada.
- Função `kartModelReport(model, baseline, reading): CheckRecord[]` (primeira opção da ISSUE-04): recusada;
  seria elemento de interface novo numa rodada de correção (§16), e o conjunto de registros já nasce nos três
  arquivos de teste.
- Gravar os limites de saturação na linha de base (segunda opção da ISSUE-05): recusado; seria campo novo em
  `DM-0001` numa rodada de correção (§16), e a saturação de `step` prova as faixas sem campo novo. Restringir
  o booleano ao conjunto de campos (primeira opção): recusado; API-0002 define `inputContractUnchanged` como
  campos **e** faixas, e um booleano só de campos contradiria o contrato (§6).
- Divergência nova para o congelamento ao fim da volta: nenhuma; o as-built (`src/lap.ts:173`,
  `src/main.ts:403`) faz o que o F-Spec 1.2.0 especifica.
- Nenhum requisito foi enfraquecido, removido ou dividido; nenhuma superfície acrescentada.

## 2026-10-27 — rodada 3, Mode B (relatório `dspec-validation-20261027-1558.md`, 1 erro, 2 avisos)

**O que mudou**

- ISSUE-10 (error, D2 / §6): `skidClock` tem quatro usos em `src/main.ts` de `0068a57` (`:141`, `:231`,
  `:448-450`, `:472`) e o conjunto só retirava três. DES-0005 ganha a linha `:231` (dentro de `beginLap`)
  na tabela de mudanças — `skidClock = 0` sai; `skidMarks.count = 0; skidIndex = 0; previousSkids = []`
  ficam; `lastSkidStepCount` não é escrito ali, porque a nova volta cria um `kart` com `stepCount` 0 e a
  regra do contador que recua (linha `:472`) o reinicia no primeiro quadro da volta nova, na contagem, antes
  de qualquer trecho — e cita `:231` em Posicionamento; a linha da cadência passa a `:447-450`, com o
  `skidClock = 0` de dentro do `if`. DES-0004 diz na linha `beginLap`/`emitReposition`/`#lap-new-lap` que
  `:231` perde `skidClock = 0` e que o resto de `:224-235`, `:191-194` e `:270` fica inalterado.
  `test-strategy.md` (AC-US-0005-01) nomeia os quatro usos que o teste de contrato afirma ausentes. Os três
  lugares dizem a mesma coisa. Fechada por edição.
- ISSUE-11 (warning, D2 / I10): a linha do kart provisório de DES-0004 passa a `:113-120` e `:123-134`,
  retirados por inteiro, e diz que `:121-122` (comentário e `let setup: PublishedSetup =
  PUBLISHED_SETUPS.ARCADE_ASSISTIDO;`, da `dirigibilidade`) ficam, com os cinco usos de `setup` (`:158`,
  `:160`, `:220`, `:228`, `:251-253`) e REQ-FEAT-0006-06 (presets intocados). O mesmo intervalo levado aos
  dois outros lugares do conjunto que o citavam: `01-architecture.md` ("O que o sistema exibe hoje") e a
  linha REQ-FEAT-0001-01 de `98-divergences.md`. Fechada por edição.
- ISSUE-12 (warning, D3 / NFR-0006): a linha `simContractCheck(baseline)` de DES-0006 acrescenta o par
  interno junto ao limite (`throttle` 0,99 ≢ 1 e 0,01 ≢ 0; `brake` 0,99 ≢ 1 e 0,01 ≢ 0; `steer` 0,99 ≢ 1 e
  −0,99 ≢ −1), que prende cada limite ao seu valor com resolução de 0,01, e reescreve a afirmação: um campo
  acrescentado ou retirado, um limite movido para fora (de qualquer valor) ou para dentro de 0,01 ou mais dá
  `false`; um limite movido para dentro de menos de 0,01 não é distinguido pelo booleano e é coberto só pela
  diferença de 0 linhas em `src/physics.ts` do manifesto da etapa de código (REQ-FEAT-0006-06) — dito no
  item. A linha NFR-0006 de `test-strategy.md` e a linha `inputTypeLine` de DM-0001 acompanham. Fechada por
  edição.
- Versões: `web/DES-0004`, `web/DES-0006`, `data/DM-0001`, `test-strategy.md`, `01-architecture.md`,
  `98-divergences.md` e este changelog em 1.2.0; `web/DES-0005` em 1.1.0 (de `validated` a `draft`, por ter
  mudado); todos com `status: draft`; o gate e o validador decidem. Os demais arquivos sem mudança.
  `00-index.md` e `99-traceability.md` não foram tocados: o gate os regenera.
- Nenhum módulo, tabela, campo, endpoint, componente, requisito ou elemento de interface foi acrescentado
  (§16): o par interno de ISSUE-12 é seis `Input` a mais ensaiados por acerto publicado pela mesma
  verificação, sem campo novo no registro `SIM_CONTRACT` nem na linha de base; as 21 divergências continuam
  `open`, sem linha nova.
- As decisões do autor carregadas pela rodada 2 (simulação parada e kart congelado em `ENDED`, só a câmera
  na pose de corrida até a próxima visão geral; ≤ 30 chamadas de desenho agrupando por material; física não
  alinhada; retrato com horizontal ≥ 60°; descida na contagem; sombra; ordem depois da `dirigibilidade`;
  feature só de aplicação; fonte `docs/kart-01/kart.js`; código na raiz) continuam no conjunto sem mudança;
  nenhuma frase de pilotagem depois de `ENDED` existe nos artefatos fora do histórico deste changelog.

**Itens fechados**: ISSUE-10, ISSUE-11 e ISSUE-12, por edição. Divergências registradas: nenhuma nova.
Feedback: nenhum novo; o FB-01 enviado a `race-lap-validation` continua superado pela correção do dono do
produto (rodada 2).

**Itens recusados, com motivo**

- Zerar `lastSkidStepCount` em `:231` no lugar de `skidClock = 0` (alternativa aberta pela ISSUE-10):
  recusado; a regra do contador que recua em DES-0005 já reinicia `previousSkids` e `lastSkidStepCount` para
  a nova volta e para o reposicionamento (o `kart` novo nasce com `stepCount` 0 e o primeiro quadro da volta,
  na contagem com o kart parado, cai no ramo sem marca), e um segundo mecanismo para o mesmo fato seria uma
  escrita a mais em `beginLap` sem efeito.
- Declarar só que o booleano prende os limites a (0,5; 1] / [0; 0,5) e deixar o valor exato à diferença de
  0 linhas (segunda opção da ISSUE-12, sozinha): recusada como única resposta; o par interno custa seis
  `Input` de 120 passos por acerto e dá ao booleano a resolução de 0,01 que a semântica de API-0002 ("mesmas
  faixas") pede; o resíduo abaixo de 0,01 fica declarado no item, coberto pela diferença de 0 linhas.
- Mover a cadência das marcas, `wheelPositions`, `setup` ou qualquer preset: nada; REQ-FEAT-0006-06 e a
  `dirigibilidade` (dona de `setup`) não autorizam, e a ISSUE-11 pedia só a precisão do intervalo.
- Nenhum requisito foi enfraquecido, removido ou dividido; nenhuma superfície acrescentada.
