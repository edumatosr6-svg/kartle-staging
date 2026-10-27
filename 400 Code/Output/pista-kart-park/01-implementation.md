---
title: Registro de implementação — pista Kart Park
feature: pista-kart-park
stage: code
status: validated
version: 1.2.0
sources: []
---

# Registro de implementação

Rodada 1, Mode A (2026-10-27): o projeto validado de `300 Specs/330 D-Specs/Output/pista-kart-park/` (`01-architecture.md` 1.0.1,
`dspec-validation-20261022-1631`; DES-0001 1.0.0, DES-0002 1.0.0, DES-0003 1.0.1, DES-0004 1.0.0, DES-0005 1.1.0, DES-0006 1.0.1,
DES-0007 1.1.0, DES-0008 1.0.0, DES-0009 1.1.0, DES-0010 1.0.1, DES-0011 1.0.1, DES-0012 1.0.1, DM-0001 1.0.0, DM-0002 1.0.1,
ADR-0001 a ADR-0006) foi implementado por inteiro sobre a árvore do commit `6ea3862` (`modelo-kart-01` validado), que descende do
commit `b86b200` em que o código de `dirigibilidade` foi validado com `npm test` passando (`code-validation-20261027-1824`): a
ordem de entrega de REQ-FEAT-0007-12 é satisfeita, e o primeiro commit de código desta feature é o que o autor fizer sobre
`6ea3862` (`git merge-base --is-ancestor b86b200 <esse commit>` sai com 0 por construção; o registro desta etapa não executa git).

Rodada 2, Mode B (2026-10-27, `code-validation-20261027-2125` FAIL SPEC → projeto revisto e validado em `dspec-validation-20261027-2148`:
ADR-0006 1.1.0, DES-0010 1.1.0, DES-0011 1.0.2, DM-0002 1.1.0, DES-0005 1.2.0, DES-0007 1.2.0, DES-0002 1.1.0, `01-architecture.md` 1.0.2):
só os itens do relatório. ISSUE-01 — `smooth` em `scripts/trackPrep.ts` reescrita com a regra nova (janela fixa de 12 m de distância de
volta, pesos de cosseno levantado, uma aplicação sobre a origem, grampo de 0,295 m, comprimento remedido e conferido em 687,5 m ± 1 %);
`SMOOTH_WINDOW_M` e `LAP_LENGTH_TOLERANCE` entram, `SMOOTH_LAMBDA` e `SMOOTH_MAX_ITERATIONS` saem; `prep.smoothingWindowM` substitui
`prep.smoothingIterations` (`PrepRecord` e a saída de `prepare`). Pela regra "Entrada de rodada reprovada" de DM-0002 1.1.0 a entrada
`kart-park` 1 e o `src/tracks/kart-park-v1.json` da rodada 1 (nunca validados, testados nem implantados; `ba221ad` é ponto de controle)
foram retirados e `prepare`/`verify`/`publish kart-park 1` refeitos com a regra nova; `trackVersion` continua 1. ISSUE-02 — a assinatura
`startTrainingLap(session, lap, config, setup?)` da rodada 1 é agora a de DES-0005 1.2.0 (nenhuma mudança de código). ISSUE-03 — os
passos 5 e 9 de DES-0010 1.1.0 descrevem o procedimento que `transversalLine` e `buildBarriers` já executavam (nenhuma mudança de código).
ISSUE-04 — DES-0002 1.1.0 lista `closestOnSegment`, `pointInQuad`, `centerlineCrossings` e `windingSumOf` (nenhuma mudança de código).
Nenhum preset, `Input`, regra de `src/lap.ts` nem linha de `src/physics.ts` tocados nesta rodada; nenhum arquivo de `tests/` escrito.
Arquivos alterados: `scripts/trackPrep.ts`, `scripts/track-pipeline.ts`, `src/tracks/kart-park-v1.json` (regenerado),
`tracks/registry.json` (entrada retirada e regravada) e este manifesto. As medidas abaixo são as da rodada 2.

Rodada 3, Mode B (2026-10-27, Testing Report `testing-report-20261027-2307` — veredito `test-validation-20261027-2307` FAIL CODE):
só o item do relatório. FAIL-01 — `barrierContactPoint` (`src/physics.ts:367-383`) escolhia a normal "do lado de S" invertida:
`leftOfAB = {(b.z − a.z)/L, −(b.x − a.x)/L}` fica do lado em que `orientation(a, b, ·)` é negativa, e `startSideNormal` tomava
`leftOfAB` quando `sSide >= 0`; no ramo do trajeto (passo 1 de DES-0003) o kart era posto a 0,1 m do lado oposto ao de origem,
`outgoing = v·n < 0` e a reflexão não disparava (atravessava a 150–200 m/s; as velocidades alcançáveis eram seguradas só pelo ramo de
proximidade). Correção na linha `:372`: `startSideNormal = sSide >= 0 ? {−leftOfAB.x, −leftOfAB.z} : leftOfAB`, que vale também para
o caso `near.distanceM === 0` (`:382`); o ramo de proximidade (`:380-383`), o bloco da resposta (`:339-357`) e o muro não mudam;
comentário da função (`:365-366`) corrigido. Nenhum preset, `Input`, contrato de passo, `src/lap.ts`, arquivo de `tests/` nem
arquivo de pista tocados; `src/physics.ts` continua com 481 linhas (todas as referências `arquivo:linha` deste manifesto valem).
Arquivos alterados: `src/physics.ts` e este manifesto. As medidas do preparo abaixo continuam as da rodada 2.

Ordem de construção: dado de pista (`src/trackGeometry.ts` novo, `src/trackData.ts` esquema 3 — DES-0002, DES-0001, DM-0001),
simulação (`src/physics.ts`, `src/lap.ts`, `src/trainingSession.ts` novo — DES-0003, DES-0004, DES-0005), aplicação pura
(`src/lapMessages.ts`, `src/curbFeedback.ts` novo, `src/audio.ts`, `src/trackScene.ts` novo — DES-0007, DES-0009, DES-0008), preparo
offline (`scripts/trackPrep.ts`, `scripts/trackChecks.ts`, `scripts/track-pipeline.ts` novos; `tracks/sources/kart-park.json` copiado
byte a byte; `src/tracks/kart-park-v1.json` e `tracks/registry.json` gerados pelo programa — DES-0010, DES-0011, DM-0002), aplicação
(`src/main.ts`, `index.html`, `src/style.css`, `src/rawImports.d.ts` novo — DES-0007, DES-0008, DES-0009). Os presets
(`RENTAL_KART`, `ARCADE_KART`, `ARCADE_ASSISTIDO_V5`), `STEP`, `Input`, a assinatura de `step`, a linha 3 de `src/physics.ts`,
`src/track.ts`, `src/maneuvers.ts`, `src/lapTiming.ts`, `src/setupRecords.ts` e os módulos de `modelo-kart-01` não mudaram; nenhuma
dependência de execução nem de desenvolvimento foi acrescentada (`package.json`: `dependencies` continua só `three`; script `track`
novo); `tsconfig.json` inalterado; nenhum arquivo de `tests/` escrito ou alterado (estágio de testes).

## Medidas do preparo offline (DES-0010, DES-0011; `npm run track -- prepare|verify|publish kart-park 1`)

| Medida | Valor |
|---|---|
| Origem | `tracks/sources/kart-park.json`, 32 189 bytes, SHA-256 `52c5adda4ce89bd23a00e04a10d7e12a28900dd4d56414f444e0a4795f2c5302`; 684 pontos, 33 zebras, `anti-horario`, `largada.indice` 0 |
| Conversão | centro da caixa envolvente da origem `(26,625; 5,49)` m (`prep.originOffsetM`); eixos x = leste, z = −norte; soma de enrolamento no plano (x, z) negativa → `COUNTER_CLOCKWISE` (área com sinal no plano (x, −z) +16 153,5 m²) |
| Suavização | `smoothingWindowM` **12** (ADR-0006 1.1.0, DES-0010 1.1.0 passo 2): uma média ponderada dos pontos da origem a até 6 m de distância de volta na linha original (volta fechada), pesos `½ (1 + cos(π δ / 6))`, seguida do grampo de 0,295 m em torno do ponto correspondente da origem e do arredondamento a 0,001 m; **22 pontos** no grampo; `maxSmoothingOffsetM` **0,295** (0,2955 m medido no ponto 218, V01; distância máxima à poligonal original 0,2940 m, V07); inversões do sinal da variação de rumo 110 na origem → 46 na linha publicada |
| Comprimento | `lapLengthM` **682,116 m**, medido de novo sobre as coordenadas gravadas (soma dos 684 segmentos, inclusive o do último ponto ao ponto 0), dentro de 680,625–694,375 (V03; fora da faixa o preparo falha sem escrever, `scripts/trackPrep.ts:190-194`); só em `prep`, não é chave do arquivo (DM-0001, V18); o rótulo continua `displayLengthM` 687 |
| Larguras | copiadas, 4,41–10,8 m (V06: 4,4 e 10,8 a uma casa) |
| Largada e chegada | `startPosition` (−27,024; 5,796) m, `headingDeg` −55,644, meio do segmento P0→P1; `finishLine` transversal em P0, do lado de antes da largada (`sideOf > 0`); área com sinal +16 125,8 m² |
| Limites de setor | pontos 200, 348 e 527 da linha central (os que minimizam `|d_o(i) − D_k|` na linha original, alvos 201,6 / 350,3 / 529,9 m), a **199,394 / 347,042 / 525,650 m** de distância de volta na linha publicada (os alvos escalados pela razão 682,116/687,52 dão 200,0 / 347,5 / 525,7 m) |
| Marcadores | n = ⌈682,116 / 18⌉ = **38**, passo 17,95 m; pontos 9, 27, 45, …, 675; maior espaçamento consecutivo (inclusive 675 → 9 pela largada) **18,00 m** (≤ 25 m, V10) |
| Linhas transversais | 42 (chegada, 3 limites, 38 marcadores); cada ponta a ≤ 3,001 m além da borda da pista ou parada por outra parte da pista ou pela barreira (V11) |
| Zebras | **34 trechos** (a zebra `direita 676,5–690,5` da origem cruza a largada e vira `RIGHT 671,129–682,116` e `RIGHT 0–2,977`); largura 1,0 m em todos; `reducedCurbs` vazio (nenhuma folga de grama abaixo de 1,4 m até outra parte da volta a mais de 30 m de distância de volta) |
| Barreira | **1 poligonal, 382 vértices, 381 segmentos, 53,29 m** entre os trechos de d_o 371–414 m e 580–615 m; todos os vértices na grama (V15); menor distância de um vértice ou amostra a 0,25 m à borda do asfalto **0,510 m** (superfície de contato de 0,1 m não encosta na pista); maior soma de distâncias asfalto-a-asfalto num vértice ou amostra **5,800 m** (V14); 376 pares de amostras a ≤ 6 m, todos separados pela barreira (V13) |
| Caixa da pista | x −88,36 … 88,96 m, z −59,38 … 60,20 m; grade de busca 23 × 15 células de 8 m |
| Arquivo publicado | `src/tracks/kart-park-v1.json`, **43 013 bytes** (literal no pacote 49 360 caracteres; V17 < 200 000), uma linha, chaves na ordem de DM-0001, SHA-256 `04ce5e510410e297764c047739422b07d46290c70eade1c1fb5bb7d120f057b1`; `readTrackData` → `COMPLETE`, `checkConsistencyV3` → lista vazia |
| Verificação | `verify kart-park 1`: V01 a V18 **PASS**, `VERIFIED`; `verifyTrackFile` duas vezes dá listas iguais |
| Registro | `tracks/registry.json` `registryVersion` 1, uma entrada `kart-park` 1 `STAGING` (`stagedAtUtc` 2026-10-27T21:58:06.132Z, `fileBytes` 43 013, `prep` com `smoothingWindowM` 12, `maxSmoothingOffsetM` 0,295, `lapLengthM` 682,116); a entrada da rodada 1 (`stagedAtUtc` 2026-10-27T21:05:21.754Z, `smoothingIterations` 0) foi retirada antes do `prepare` (DM-0002 1.1.0, "Entrada de rodada reprovada"); segundo `publish` → `já registrado`; segundo `prepare` recusado (par já registrado); `promote` sem `--esri-decision` → `argumento inválido: --esri-decision`; `trackVersion` `01` e `trackId` `synthetic` → `argumento inválido` sem ler nem escrever |
| Reprodutibilidade | `publish` reexecuta `prepareTrack` + `serializeTrackFile` e confere igualdade byte a byte com o arquivo publicado antes de registrar |

## Verificação em tela (navegador embutido da sessão, `vite preview` 4173)

Abertura na Kart Park: seletor com as duas opções (`aria-pressed` na Kart Park), linha de crédito "© colaboradores do OpenStreetMap ·
licença ODbL · openstreetmap.org/copyright" com o link, `#track-status` `kart-park`, oferta só "volta de treino", `#track-name`
"Kart Park — São José dos Pinhais (traçado aproximado) · 687 m", visão geral com o asfalto, as zebras vermelhas e brancas, a linha de
largada e o minimapa da Kart Park; clique em "Pista sintética" troca a cena para a sintética (nome "Pista sintética", sem crédito) e
o clique de volta restaura a Kart Park; "volta de treino" inicia a contagem e a câmera de corrida mostra o Kart 01 sobre o asfalto da
Kart Park com `válida em andamento`; nenhum erro de console. Taxa de quadros, vibração e som não medidos (ficam para
`docs/kart-park-device-log.md`, estágio de testes).

## Arquivos tocados nesta rodada (D-CD-01)

| Arquivo | Situação | Camada | Itens de projeto |
|---|---|---|---|
| `src/trackGeometry.ts` | novo (289 linhas) | dado de pista | DES-0002, DM-0001 |
| `src/trackData.ts` | alterado (`TRACK_SCHEMA_VERSION` 3, `Schema3Fields`, `readSchema3Fields`, ordens 6 a 9, `checkConsistencyV3`; `checkConsistency` e o caminho da versão 2 intactos) | dado de pista | DES-0001, DM-0001, ADR-0001 |
| `src/physics.ts` | alterado (`Surface` com `curb`, `CURB_GRIP_PC`, `surfaceMu`, `Environment.track`, `trackEnvironment`, `trackEdgeDistanceM`, telemetria `barrierTouching`/`barrierContact`, frações de rodas, bloco da barreira, `onRoad`, `getTrackContact`); rodada 3: `barrierContactPoint` `:372` (normal do lado de S corrigida, FAIL-01) e comentário `:365-366`; 481 linhas | simulação | DES-0003, ADR-0003, ADR-0004 |
| `src/lap.ts` | alterado (`kartAtStart`, corte por `trackEdgeDistanceM`, reposicionamento na linha central do ambiente) | simulação | DES-0004 |
| `src/trainingSession.ts` | novo (94 linhas) | simulação | DES-0005, DM-0002 |
| `src/curbFeedback.ts` | novo (37 linhas) | aplicação pura | DES-0009, DM-0002 |
| `src/trackScene.ts` | novo (134 linhas) | aplicação | DES-0008 |
| `src/lapMessages.ts` | alterado (`OSM_CREDIT`, `creditFor`, `optionLabel`; `MESSAGES` inalterado, 20 chaves) | aplicação pura | DES-0007 |
| `src/audio.ts` | alterado (`SoundSignal`, `ENGINE_SOUND`, `REWARD_SOUND`, `CURB_SOUND`, `curb()`, `soundOn()`) | aplicação | DES-0009 |
| `src/main.ts` | alterado (553 → 646 linhas: importações, `syntheticScene`, sessão e catálogo, `renderCredit`, `chooseTrack`, `renderOffer` com seletor e crédito, `beginLap` por `startTrainingLap`, minimapa por sessão, crédito no resultado, retorno da zebra no laço de passos, kart ocioso da sessão, abertura na Kart Park) | aplicação | DES-0007, DES-0008, DES-0009 |
| `index.html` | alterado (`#track-name`, `#track-selector`, `#track-credit`, `#lap-result-credit`; "Circuito Aurora" retirado) | aplicação | DES-0007 |
| `src/style.css` | alterado (linha 8: `.track-selector`, `.track-credit`) | aplicação | DES-0007 |
| `src/rawImports.d.ts` | novo (declaração de `*.json?raw`) | aplicação | DES-0007, ADR-0002 |
| `src/tracks/kart-park-v1.json` | novo, gerado por `prepare`; regenerado na rodada 2 com a suavização de ADR-0006 1.1.0 | dado de pista | DM-0001, DES-0010 |
| `scripts/trackPrep.ts` | novo (386 linhas); rodada 2: 391 linhas (`smooth` `:93-116`, conferência do comprimento `:190-194`, `PrepRecord.smoothingWindowM`) | dado de pista (papel `scripts/`) | DES-0010, ADR-0006 |
| `scripts/trackChecks.ts` | novo (361 linhas) | dado de pista (papel `scripts/`) | DES-0011 |
| `scripts/track-pipeline.ts` | novo (167 linhas); rodada 2: saída de `prepare` com `smoothingWindowM` (`:108`) | aplicação (programa em Node) | DES-0010, DES-0011, DM-0002 |
| `tracks/sources/kart-park.json` | novo, cópia byte a byte de `200 Requirements/220 Input/pista-kart-park/kart-park.json` | dado do preparo | DES-0010 |
| `tracks/registry.json` | novo, gerado por `publish`; rodada 2: entrada da rodada reprovada retirada e `publish` refeito | dado do preparo | DM-0002, DES-0011 |
| `package.json` | alterado: script `track`; dependências inalteradas | tooling | DES-0010 |

## Portão determinístico desta rodada

| Passo | Resultado |
|---|---|
| `npx tsc --noEmit -p .` | saída 0 nas três rodadas (as bibliotecas puras `scripts/trackPrep.ts` e `scripts/trackChecks.ts` também passam em `tsc --strict` isolado; `scripts/track-pipeline.ts` usa `node:*` sem `@types/node`, como os demais programas de `scripts/`) |
| `npx vite build` | saída 0; rodada 3: `dist/assets/index-DYFBop8t.js` 694 056 bytes e `index-Dv0Dz75T.css` 11 890 bytes (705 946 bytes, igual à rodada 2); rodada 2: `dist/assets/index-bBRFdYaS.js` 694 056 bytes e `index-Dv0Dz75T.css` 11 890 bytes: 705 946 bytes sem compressão (rodada 1: 705 575; 642 759 antes da feature; o acréscimo é o arquivo de pista como literal, 49 360 caracteres, mais os módulos novos); o texto da Kart Park está no pacote, nenhuma requisição |
| `npx tsx --test tests/*.test.ts` | rodada 3: 398 verificações, **398 aprovadas, 0 reprovadas** (as 102 de `tests/pista-kart-park-*.test.ts` do estágio de testes incluídas; `CHK-TEST-0004-03` passa nos 8 lançamentos, `CHK-TEST-0004-02/-04/-05/-06` e `tests/physics.test.ts` verdes); rodada 2: 296 verificações, **296 aprovadas, 0 reprovadas** (`CHK-TEST-0009-02` reescrito por `race-lap-validation` em `32d0adf` e `CHK-TEST-0004-13` restrito aos campos da linha de base por `modelo-kart-01` em `c7e71b1`, entre as rodadas; rodada 1: 294/296 por essas duas). Nenhum teste editado por esta feature |
| `npm run bench:handling` | saída 0; **46 registros `PASS`**, 0 `FAIL` (rodadas 2 e 3 reexecutado; a pista sintética não tem barreira) |
| `npm run bench:physics` | saída 0; 10 registros `PASS` (rodada 3 reexecutado) |
| `npm run track -- verify kart-park 1` | `VERIFIED`, V01 a V18 `PASS` (rodada 2, sobre o arquivo regenerado; rodada 3 reexecutado, arquivo intacto) |
| `lint_artifacts.py --stage code --emit` | saída 0 |

## Decisões de implementação (nenhuma muda contrato nem requisito; ver também `97-changelog.md`)

- `startTrainingLap(session, lap, config, setup?)`: quarto parâmetro opcional `SetupRef`, copiado para o pedido como `src/main.ts`
  já fazia antes desta feature (FB-01 de `dirigibilidade`, API-0002 1.1.0 de `race-lap-validation`). Rodada 2: é a assinatura da
  tabela de interface de DES-0005 1.2.0 (ISSUE-02 fechado); `src/main.ts:297` passa `{setupId, setupVersion}` no quarto argumento.
- Linha transversal (DES-0010 1.1.0, passo 9 — rodada 2: o texto do projeto passou a descrever este procedimento, ISSUE-03 fechado): a marcha de 0,05 m ao longo da normal termina quando o ponto fica 3 m **além da borda da
  pista** (`beyondTrackEdgeM`, a medida do corte), com o ponto final refinado por bissecção a 2,99 m, e não a 3 m de deslocamento ao
  longo da normal: numa curva, ou com outra parte da pista à frente, o deslocamento e a distância além da borda divergem (marcador 0:
  2,868 m; marcador 20: outra parte da pista a 6,33 m) e V11 reprovaria. A marcha não tem teto de 3 m na normal (teto de segurança 60 m).
- Borda voltada para o outro trecho (DES-0010 1.1.0, passo 5 — idem, ISSUE-03): a borda cuja amostra, no mesmo parâmetro, está mais perto das bordas do
  outro trecho (a da outra borda cruzaria o próprio asfalto); o teste "p + 0,05 m em direção a q está no próprio asfalto" descartava
  as primeiras amostras numa borda côncava e deixava V13 sem barreira em (19,56; −45,86).
- V13 "cruza (ou toca)": toque dentro de 0,002 m (arredondamento a 0,001 m das coordenadas gravadas, meia unidade por coordenada); a
  superfície de contato física tem 0,1 m.
- `TrackGeometry.curbQuads` é a lista plana dos quadriláteros de zebra com `curbQuadSpan[k]` apontando para o trecho; `pointInQuad`,
  `closestOnSegment`, `centerlineCrossings` e `windingSumOf` são exportados porque `src/trackData.ts` (C1 e C2 v3), `src/physics.ts`
  (barreira) e `scripts/trackChecks.ts` os usam; rodada 2: os quatro constam da tabela de interface de DES-0002 1.1.0 (ISSUE-04 fechado).
- Visão geral da câmera (DES-0008 cita a câmera anterior a `modelo-kart-01`): `trackBounds` passa a seguir a sessão (caixa da
  geometria do arquivo na Kart Park; faixa externa da sintética); a caixa de sombra já acompanha o kart (±60 m) desde
  `modelo-kart-01`, de modo que a linha "extensões da câmera de sombra" de DES-0008 não tem mais objeto.
- `renderBest()` é chamado em `chooseTrack`: o melhor tempo exibido é comparado com a pista da sessão (RULE-0003 de `dirigibilidade`).
- `scripts/track-pipeline.ts` lê a raiz como `process.cwd()` (`npm run track` roda da raiz) e guarda o resumo esperado da origem por
  `trackId` (`ORIGIN_SHA256`); `publish` recalcula `prepareTrack` para preencher `prep` e exige igualdade byte a byte.
- Suavização (rodada 2, ISSUE-01): `smooth` (`scripts/trackPrep.ts:93-116`) aplica a regra de ADR-0006 1.1.0 à letra — a janela é
  medida pela distância de volta na linha original (`cumulativeOf`), `δ = min(|d_o(j) − d_o(i)|, L_o − |d_o(j) − d_o(i)|)`, `j` em ordem
  crescente de índice, o próprio ponto com peso 1; o grampo projeta sobre o círculo de 0,295 m; o arredondamento a 0,001 m vem antes da
  medição do comprimento, que `prepareTrack` confere (`:190-194`) e `publish` reconfere pela reprodução byte a byte. Os valores medidos
  (682,116 m, 0,2955 m, 22 pontos no grampo) coincidem com a evidência de ADR-0006. A rodada 1 (k = 0, 687,52 m) foi retirada do registro.

- Normal do lado de S na barreira (rodada 3, FAIL-01): `orientation(a, b, c)` é positiva do lado oposto ao vetor
  `{(b.z − a.z)/L, −(b.x − a.x)/L}` (a = (0, 0), b = (1, 0): o vetor é (0, −1) e `orientation` dá −1 nele); o nome `leftOfAB` ficou,
  com o comentário dizendo que é o lado negativo, e `startSideNormal` toma o oposto quando `sSide >= 0`. Com isso o passo 1 de
  DES-0003 põe o kart a 0,1 m do lado de origem com `outgoing > 0`, e a resposta do muro (1,12; 0,65; cancelar; `barrierHit`)
  dispara nos lançamentos de 60 a 200 m/s; nas velocidades alcançáveis (≤ 34,5 m/s) o comportamento observado antes vinha do ramo de
  proximidade, que não mudou.

## Rastreabilidade

A matriz `99-traceability.md` e o índice `00-index.md` são gerados pelo gate a partir dos campos `sources` dos registros `core/`,
`data/`, `web/`, `pipeline/` e `security/`; cada registro nomeia, por `REQ-*`, o arquivo e o símbolo que o realiza. As divergências
herdadas do D-Spec (13 linhas) estão em `98-divergences.md`, com o encerramento das duas verificações de outras features que a rodada 1 reprovava.
