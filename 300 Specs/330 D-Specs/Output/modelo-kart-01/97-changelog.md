---
title: Registro de mudanças — modelo Kart 01 e câmera de jogo
feature: modelo-kart-01
stage: dspec
status: validated
version: 1.4.0
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

## 2026-10-27 — rodada 4, Mode C (feedback da etapa de código `reports/feedback/feedback-20261027-1928.md`, SPEC-ISSUE-01)

**O que mudou**

- SPEC-ISSUE-01 (FAIL SPEC da etapa de código): a regra de medida de `frontWheelDiametersM` e
  `rearWheelDiametersM` em DES-0001 ("Como as medidas de RULE-0001 saem do modelo montado") e em DES-0006
  (`measureKart01Model`) dizia "extensão em Y da geometria mesclada de cada roda". Sobre a forma inalterada
  do Cowork (`docs/kart-01/kart.js`, `criarRoda`: `LatheGeometry` de 14 segmentos girada em Z) nenhum dos 14
  vértices da revolução cai em ±Y, e a extensão em Y mede 0,975 × 2 × `raio` — 0,2535 m e 0,273 m, que ao
  centímetro dão 0,25 e 0,27 e reprovariam `WHEELS_AND_TRACKS`. A regra passa a ser a **extensão em Z da
  caixa envolvente da geometria mesclada de cada roda, no referencial local do nó `spin`** — o eixo de
  rolamento, onde a revolução põe um vértice em φ = 0 e outro em φ = π, a ±`raio`; na pose de repouso coincide
  com o Z do modelo —, que mede exatamente 0,26 m e 0,28 m. Escolha e motivo: entre as duas saídas que a
  invocação admitia (extensão em Z, ou o `diameterM` declarado), a extensão em Z é a única que continua sendo
  uma **medida sobre o modelo montado** (`SEED/IM-I9`; AC-US-0001-04 e -05: "reporta, para o modelo montado,
  diâmetro de ..."), enquanto `wheels[nome].diameterM` é 2 × `raio` declarado — o valor que o giro usa
  (RULE-0003) — e reportá-lo seria medir a constante, não a geometria. Os dois itens dizem que o valor medido
  é igual a `diameterM`, sem que `diameterM` seja a medida. Dito em DES-0001 (tabela das medidas), DES-0006
  (linha `measureKart01Model`) e `test-strategy.md` (linha AC-US-0001-04, que as linhas -05 a -07 seguem por
  "idem"). Fechada por edição.
- A tolerância não muda: "ao centímetro" (RULE-0001; API-0002, `OUT_OF_TOLERANCE` "diferente ao centímetro";
  requisitos: "medida ao centímetro", sem outra tolerância — `01-overview.md`, lacunas deliberadas). A linha
  `judgeModelCheck` de DES-0006 continua igual (cada valor arredondado ao centímetro igual a 0,26; 0,28; 1,00;
  1,14). O valor esperado passa de "0,26 m; 0,28 m" a "0,26 m; 0,28 m (exatos)".
- Nenhuma geometria muda (decisão do dono do produto, `DOMAIN/DEC-01` e seed: a forma do Cowork não é alterada;
  REQ-FEAT-0004-04): nem segmentos, nem rotação da revolução, nem posição de vértice; os 5.128 triângulos e as
  27 chamadas ficam. Nenhum campo novo no modelo (`Kart01Model` inalterado), nenhum símbolo novo, nenhum
  registro ou campo novo em API-0002: a rodada de código seguinte toca só a medida em
  `tests/helpers/kart01Report.ts` (o eixo lido da caixa envolvente), não `src/kart01Model.ts`.
- Versões: `web/DES-0001` em 1.1.0, `web/DES-0006` em 1.3.0, `test-strategy.md` em 1.3.0 e este changelog em
  1.3.0, todos com `status: draft`; o gate e o validador decidem. Os demais arquivos sem mudança.
  `00-index.md` e `99-traceability.md` não foram tocados: o gate os regenera.

**Itens fechados**: SPEC-ISSUE-01, por edição. Divergências registradas: nenhuma nova. Feedback: nenhum
novo escrito; nenhuma outra feature precisa mudar.

**Itens recusados, com motivo**

- Reportar `wheels[nome].diameterM` (2 × `raio`) como `frontWheelDiametersM`/`rearWheelDiametersM` (segunda
  saída oferecida pelo feedback): recusado; é o valor declarado, não uma medida da geometria montada, e
  AC-US-0001-04/-05 e `SEED/IM-I9` pedem a medida sobre o modelo montado. O item diz que a medida é igual a
  ele, o que a etapa de código pode afirmar num teste sem que a constante substitua a medida.
- "Maior extensão da geometria mesclada entre os eixos Y e Z" (primeira saída oferecida pelo feedback):
  recusada em favor da extensão em Z só; dá o mesmo valor (o máximo é o Z), mas é uma regra com dois eixos para
  explicar um, e a extensão em Z é o diâmetro no eixo de rolamento, o "diâmetro externo da roda com o pneu"
  de RULE-0001 na direção em que a roda toca o chão.
- Admitir 0,25/0,27 ao centímetro em RULE-0001/REQ-FEAT-0001-04 (terceira saída): recusada; seria afrouxar o
  requisito ("o modelo é corrigido, nunca a tolerância", US-0001, caso anormal), e a forma inalterada
  satisfaz 0,26/0,28 com a medida correta.
- Mudar a geometria da roda (mais segmentos, ou girar a revolução para pôr um vértice em ±Y): recusado; o
  dono do produto decidiu que a forma não muda (`DOMAIN/DEC-01`; REQ-FEAT-0004-04: "sem mudar a forma").
- Campo novo no modelo (por exemplo `measuredDiameterM`) ou registro novo em API-0002: recusado; nenhum é
  necessário e a invocação pediu nenhum campo novo salvo se inevitável.
- Nenhum requisito foi enfraquecido, removido ou dividido; nenhuma superfície acrescentada.

## 2026-10-30 — rodada 5, Mode C (F-Spec revalidado: `fspec-validation-20261030-1202.md`, SUCCESS)

**Origem**: o F-Spec de `modelo-kart-01` foi revalidado (rodadas 4 e 5 do changelog dele; seed `revision: 3`,
`DOMAIN/DEC-07` e `DOMAIN/DEC-08`): a câmera de corrida fica atrás do piloto termine a volta ou não, sem
depender do tipo da volta; o kart é mostrado onde a simulação o põe — congelado só quando a simulação para,
depois do `ENDED` de uma volta oficial (regra de `race-lap-validation`); no treino as voltas são seguidas; não há
indicação de drift, nem fumaça ou chama de turbo no escapamento, nem efeito de turbo no campo de visão (só a
base de 62° e a regra de retrato); as marcas de pneu continuam. No F-Spec: o requisito 10 de FEAT-0003 e os 02
e 03 de FEAT-0005 retirados; REQ-FEAT-0003-16, REQ-FEAT-0003-17, REQ-FEAT-0005-09 e REQ-FEAT-0005-10 novos
(64 requisitos); API-0003 em 2.0.0 sem `baseVerticalFovDeg` e `turboFovDeltaDeg`. Nenhum `ISSUE-<nn>`,
`FB-<nn>` ou `FEEDBACK-<nn>`: a rodada é a mudança do upstream.

**O que mudou**

- `web/DES-0003` (1.2.0): realiza os 16 requisitos de FEAT-0003 e API-0003 2.0.0. `CameraView` sem os dois
  campos retirados; `CameraFrameInputs` sem `turboActive`; `TURBO_FOV_DELTA_DEG` retirado; `computeCameraView`
  em `RACE_CHASE` com `verticalFovDeg` = base da forma; a função `baseVerticalFovDeg` passa a
  `shapeVerticalFovDeg` (o nome antigo é o de um campo retirado que API-0003 não deixa voltar); `decideCameraMode`
  dá `RACE_CHASE` para qualquer fase de volta ativa fora da contagem e não lê `lapKind` (comportamento que o
  código corrente já tem, `src/gameCamera.ts:72-76`); seção nova "Retirada (I3)" com o ponto de rejeição pela
  ausência e a prova no teste de contrato. `sources:` sem o requisito 10, com 16 e 17.
- `adr/ADR-0002` (1.2.0): contexto, decisão 2 revogada (efeito de turbo), decisão 7 nova (modo só pela fase,
  sem tipo de volta), alternativas e consequências com o treino; título sem o turbo.
- `web/DES-0004` (1.3.0): a chamada de `computeCameraView` passa exatamente cinco entradas, sem condição de
  turbo (REQ-FEAT-0003-17); o fim de uma volta de treino segue o kart que a sessão tiver (REQ-FEAT-0003-16);
  linha dos jatos de escapamento marcada como retirada; seção nova "Revisão 1.3.0 sobre a árvore corrente"
  (`src/main.ts:581-587`, `:150-157`, `:553`, `:555-556`).
- `web/DES-0005` (1.2.0, mudança maior): só marcas de pneu; o jato de escapamento (`src/main.ts:150-157`,
  `:555-556`) e o nó `escapamentoSaida` retirados (REQ-FEAT-0005-10); nenhum objeto da cena é indicação de
  drift, e a designação da versão 1.1.0 (as marcas como indicação de drift) foi retirada (REQ-FEAT-0005-09); a
  condição de situação das marcas (`src/main.ts:559`) declarada como do jogo e não desta feature; marcas
  depois do fim da volta oficial (nenhum trecho novo) e depois do fim de uma volta de treino (trechos novos).
  `sources:` sem os requisitos 02 e 03, com 09 e 10.
- `web/DES-0001` (1.2.0) e `adr/ADR-0001` (1.1.0): `anchors.exhaustOutlet` retirado do modelo
  (`Kart01Model.anchors` = `{ bumperPlate }`), porque o seu único consumidor era o jato; nenhuma geometria,
  chamada de desenho, triângulo ou medida muda; o exemplo da decisão 4 de ADR-0001 atualizado.
- `adr/ADR-0003` (1.1.0): decisão 4 nova — a ordem de entrega com a `dirigibilidade`, que o F-Spec deixou à
  etapa de design: as mudanças desta rodada só removem leitores do turbo que esta feature acrescentou e não
  dependem de ordem; a condição de situação das marcas é trocada pela `dirigibilidade` ao retirar o drift; a
  parte "kart em movimento" de AC-US-0003-14 depende do código de `race-lap-validation` (US-10 da revisão 3).
- `test-strategy.md` (1.4.0): fixtures novos (volta de treino concluída seguida de 120 passos; `LapStateView`
  variando só `lapKind` ou `lapPhase`; `Input` com drift e aceleração); E2E-02, E2E-04 e E2E-05 reescritos
  (treino; todos os comandos sem mudar o campo de visão; nenhuma indicação de drift nem fumaça ou chama de
  turbo); AC-US-0003-04 a -06 sem "sem turbo", com a ausência dos nomes retirados; AC-US-0003-10 e -13 com
  volta oficial e treino; AC-US-0003-14, AC-US-0005-04 e AC-US-0005-05 novos; AC-US-0005-01 com o fim da volta
  oficial e de treino; linhas do critério 09 de US-0003 e dos critérios 02 e 03 de US-0005 retiradas; "Verificações
  existentes" diz quais verificações desta feature saem com os critérios retirados.
- `01-architecture.md` (1.3.0): F-Spec 1.3 e 64 requisitos; decisões de 2026-10-29; as-built da árvore corrente
  (o que a rodada 5 retira); camadas, diagrama de sequência, fluxo do fim de volta oficial e de treino,
  compatibilidade (efeito de turbo e campos de API-0003 retirados; fumaça e drift retirados) e rastros de
  decisão.
- `98-divergences.md` (1.3.0): cabeçalho no F-Spec 1.3; linhas dos três requisitos retirados removidas; textos
  de REQ-FEAT-0003-04 a -07, -15 e -11 nas redações novas; quatro linhas novas com a árvore corrente:
  REQ-FEAT-0003-05 a -07 e -17 (parcela de turbo), REQ-FEAT-0005-10 (jato), REQ-FEAT-0005-09 (drift ainda no
  jogo, devido pela `dirigibilidade`), REQ-FEAT-0003-16 e REQ-FEAT-0005-01 no treino (kart congela no fim de
  toda volta, devido por `race-lap-validation`).
- Os arquivos editados voltaram a `status: draft`; o gate e o validador decidem. `web/DES-0002`, `web/DES-0006`,
  `security/DES-0007`, `data/DM-0001` e `adr/ADR-0004` sem mudança: nenhum requisito que realizam mudou.
  `00-index.md` e `99-traceability.md` regenerados pelo gate com `--emit`.

**Itens fechados**: nenhum `ISSUE-<nn>`, `FB-<nn>` ou `FEEDBACK-<nn>` (rodada gerada pela mudança do
upstream). Divergências registradas: as quatro linhas novas acima. Feedback: nenhum escrito (numa etapa de
especificação o feedback a outra feature é do validador, conventions §14).

**Itens recusados, com motivo**

- Decidir o modo da câmera pelo tipo da volta (`lapKind`): não feito; RULE-0002 o exclui das entradas e os
  critérios 13 e 14 de US-0003 pedem a mesma pose nos dois casos. Por isso a volta `RECON` não tem regra
  própria aqui.
- Mudar a condição de situação das marcas de pneu (`src/main.ts:559`, que lê `maneuvers.drifting`) para outra
  que não dependa do drift: não feito. REQ-FEAT-0005-04 diz que esta feature muda onde a marca aparece, não
  quando; a condição é anterior a esta feature e a retirada do drift é da `dirigibilidade`, que a troca no seu
  código. Se, retirado o drift, o jogo deixar de desenhar marcas em toda situação, o requisito 01 de FEAT-0005
  fica sem situação em que valer — decisão do dono do produto pela `dirigibilidade`, não desta etapa.
- Retirar o HUD da manobra (`#drift-hud`, a classe `.boosting`, as mensagens de `notify`): não feito; não é
  efeito junto ao Kart 01 exibido e é da `dirigibilidade`.
- Mudar o formato `inputRuns` da linha de base (`[contagem, throttle, brake, steer, drift]`, DM-0001): não
  feito; o F-Spec desta rodada não mudou API-0002 nem o contrato `Input` da simulação, que é da `dirigibilidade`.
  Se aquela feature retirar `drift` do `Input`, a linha de base volta a `BASELINE_MISSING` e a mudança chega a
  este conjunto por feedback da etapa de código.
- Atualizar o estado das linhas da rodada 1 de `98-divergences.md` para `resolved`: não feito; a resolução é
  registrada pela etapa de código, que trabalhou sobre elas, e esta rodada só carrega o F-Spec 1.3.
- Manter `anchors.exhaustOutlet` no modelo sem consumidor: recusado; seria um nó sem requisito que o realize.
- Manter o nome `baseVerticalFovDeg` para a função interna: recusado; API-0003 2.0.0 não deixa o nome
  retirado voltar com outro significado, e o teste de contrato afirma a ausência do nome no código.
- Exigir, por ordem de entrega, que o código desta rodada espere o da `dirigibilidade` (como a decisão 1 de
  ADR-0003 fez na primeira rodada): recusado; as mudanças só removem leitores do turbo desta feature e não
  dependem de ordem (ADR-0003, decisão 4).
