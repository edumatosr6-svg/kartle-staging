---
title: Registro de implementação — pista Kart Park
feature: pista-kart-park
stage: code
status: draft
version: 1.0.0
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
| Suavização | `smoothingIterations` **0**: pela regra de ADR-0006 (iteração de 0 a 400 cujo comprimento arredondado fica mais perto de 687,5 m), k = 0 dá 687,5196 m (desvio 0,0196 m) e k = 1 já dá 686,72 m (desvio 0,78 m); a linha central publicada é a origem convertida e arredondada a 0,001 m; `maxSmoothingOffsetM` 0,000; V01 e V07 passam com desvio máximo 0,0000 m |
| Comprimento | `lapLengthM` **687,520 m** (687,5196 calculado das coordenadas gravadas), dentro de 680,625–694,375 (V03) |
| Larguras | copiadas, 4,41–10,8 m (V06: 4,4 e 10,8 a uma casa) |
| Largada e chegada | `startPosition` (−27,035; 5,78) m, `headingDeg` −54,728, meio do segmento P0→P1; `finishLine` transversal em P0, do lado de antes da largada (`sideOf > 0`) |
| Limites de setor | pontos 200, 348 e 527 da linha central, a **201,63 / 350,34 / 529,86 m** de distância de volta (alvos 201,6 / 350,3 / 529,9 m) |
| Marcadores | n = ⌈687,52 / 18⌉ = **39**, passo 17,63 m; pontos 9, 26, 44, …, 675; maior espaçamento consecutivo (inclusive 675 → 9 pela largada) **18,29 m** (≤ 25 m, V10) |
| Linhas transversais | 43 (chegada, 3 limites, 39 marcadores); cada ponta a ≤ 3,001 m além da borda da pista ou parada por outra parte da pista ou pela barreira (V11) |
| Zebras | **34 trechos** (a zebra `direita 676,5–690,5` da origem cruza a largada e vira `RIGHT 676,5–687,52` e `RIGHT 0–2,98`); largura 1,0 m em todos; `reducedCurbs` vazio (nenhuma folga de grama abaixo de 1,4 m até outra parte da volta a mais de 30 m de distância de volta) |
| Barreira | **1 poligonal, 395 vértices, 394 segmentos, 63,51 m** entre os trechos de d_o 371–414 m e 580–615 m; 788/788 pontas de segmento na grama; menor distância de um vértice à borda da pista **0,433 m** (superfície de contato de 0,1 m não encosta na pista); maior soma de distâncias asfalto-a-asfalto num vértice ou amostra **5,743 m** (V14); 385 pares de amostras a ≤ 6 m, todos separados pela barreira (V13) |
| Caixa da pista | x −88,51 … 89,13 m, z −59,50 … 60,50 m; grade de busca 23 × 16 células de 8 m |
| Arquivo publicado | `src/tracks/kart-park-v1.json`, **42 642 bytes** (literal no pacote 49 049 caracteres; V17 < 200 000), uma linha, chaves na ordem de DM-0001, SHA-256 `24093e904466dd12bf864509496facf78da4362249588ad494e92cdd78dd9f7e`; `readTrackData` → `COMPLETE`, `checkConsistencyV3` → lista vazia |
| Verificação | `verify kart-park 1`: V01 a V18 **PASS**, `VERIFIED` (74–121 ms); `verifyTrackFile` duas vezes dá listas iguais |
| Registro | `tracks/registry.json` `registryVersion` 1, uma entrada `kart-park` 1 `STAGING` (`stagedAtUtc` 2026-10-27T21:05:21.754Z, `fileBytes` 42 642, `prep` completo); segundo `publish` → `já registrado`; segundo `prepare` recusado (par já registrado); `promote` sem `--esri-decision` → `argumento inválido: --esri-decision`; `trackVersion` `01` e `trackId` `synthetic` → `argumento inválido` sem ler nem escrever |
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
| `src/physics.ts` | alterado (`Surface` com `curb`, `CURB_GRIP_PC`, `surfaceMu`, `Environment.track`, `trackEnvironment`, `trackEdgeDistanceM`, telemetria `barrierTouching`/`barrierContact`, frações de rodas, bloco da barreira, `onRoad`, `getTrackContact`) | simulação | DES-0003, ADR-0003, ADR-0004 |
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
| `src/tracks/kart-park-v1.json` | novo, gerado por `prepare` | dado de pista | DM-0001, DES-0010 |
| `scripts/trackPrep.ts` | novo (386 linhas) | dado de pista (papel `scripts/`) | DES-0010, ADR-0006 |
| `scripts/trackChecks.ts` | novo (361 linhas) | dado de pista (papel `scripts/`) | DES-0011 |
| `scripts/track-pipeline.ts` | novo (167 linhas) | aplicação (programa em Node) | DES-0010, DES-0011, DM-0002 |
| `tracks/sources/kart-park.json` | novo, cópia byte a byte de `200 Requirements/220 Input/pista-kart-park/kart-park.json` | dado do preparo | DES-0010 |
| `tracks/registry.json` | novo, gerado por `publish` | dado do preparo | DM-0002, DES-0011 |
| `package.json` | alterado: script `track`; dependências inalteradas | tooling | DES-0010 |

## Portão determinístico desta rodada

| Passo | Resultado |
|---|---|
| `npx tsc --noEmit -p .` | saída 0 (as bibliotecas puras `scripts/trackPrep.ts` e `scripts/trackChecks.ts` também passam em `tsc --strict` isolado; `scripts/track-pipeline.ts` usa `node:*` sem `@types/node`, como os demais programas de `scripts/`) |
| `npx vite build` | saída 0; `dist/assets/index-hfMcla9y.js` 693 685 bytes e `index-Dv0Dz75T.css` 11 890 bytes: 705 575 bytes sem compressão (642 759 antes; o acréscimo é o arquivo de pista como literal, 49 049 caracteres, mais os módulos novos); o texto da Kart Park está no pacote (`trackId "kart-park"`, `COUNTER_CLOCKWISE`), nenhuma requisição |
| `npx tsx --test tests/*.test.ts` | 296 verificações, **294 aprovadas, 2 reprovadas**: `CHK-TEST-0009-02` (`race-lap-validation`: afirma `SYNTHETIC_TRACK_FILE.schemaVersion === TRACK_SCHEMA_VERSION`, que o projeto manda separar — pista sintética em 2, leitor em 3, ADR-0001) e `CHK-TEST-0004-13` (`modelo-kart-01`: `DETERMINISM` compara o `State` final por `deepEqual` com a linha de base gravada antes dos campos `barrierTouching`/`barrierContact` da telemetria, que DES-0003 acrescenta; provado por programa descartável que, retirados os dois campos, o estado final é `deepEqual` e `lapMs` 29 419 / 43 932 são os da linha de base). Nenhum teste editado; ver `98-divergences.md` |
| `npm run bench:handling` | saída 0; **46 registros `PASS`** (`STEP_COST` 194,4 µs contra 203,3 µs da linha de base) |
| `npm run bench:physics` | saída 0; 10 registros `PASS` |
| `npm run track -- verify kart-park 1` | `VERIFIED`, V01 a V18 `PASS` |
| `lint_artifacts.py --stage code --emit` | saída 0 |

## Decisões de implementação (nenhuma muda contrato nem requisito; ver também `97-changelog.md`)

- `startTrainingLap(session, lap, config, setup?)`: quarto parâmetro opcional `SetupRef`, copiado para o pedido como `src/main.ts`
  já fazia antes desta feature (FB-01 de `dirigibilidade`, API-0002 1.1.0 de `race-lap-validation`); o projeto 1.1.0 de DES-0005
  antecede essa mudança e não a nomeia. Sem ele, `LapResult.setupId`/`setupVersion` de uma volta de treino sumiriam.
- Linha transversal (DES-0010, passo 9): a marcha de 0,05 m ao longo da normal termina quando o ponto fica 3 m **além da borda da
  pista** (`beyondTrackEdgeM`, a medida do corte), com o ponto final refinado por bissecção a 2,99 m, e não a 3 m de deslocamento ao
  longo da normal: numa curva, ou com outra parte da pista à frente, o deslocamento e a distância além da borda divergem (marcador 0:
  2,868 m; marcador 20: outra parte da pista a 6,33 m) e V11 reprovaria. A marcha não tem teto de 3 m na normal (teto de segurança 60 m).
- Borda voltada para o outro trecho (DES-0010, passo 5): a borda cuja amostra, no mesmo parâmetro, está mais perto das bordas do
  outro trecho (a da outra borda cruzaria o próprio asfalto); o teste "p + 0,05 m em direção a q está no próprio asfalto" descartava
  as primeiras amostras numa borda côncava e deixava V13 sem barreira em (19,56; −45,86).
- V13 "cruza (ou toca)": toque dentro de 0,002 m (arredondamento a 0,001 m das coordenadas gravadas, meia unidade por coordenada); a
  superfície de contato física tem 0,1 m.
- `TrackGeometry.curbQuads` é a lista plana dos quadriláteros de zebra com `curbQuadSpan[k]` apontando para o trecho; `pointInQuad`,
  `closestOnSegment`, `centerlineCrossings` e `windingSumOf` são exportados além da tabela de interface de DES-0002 porque
  `src/trackData.ts` (C1 e C2 v3), `src/physics.ts` (barreira) e `scripts/trackChecks.ts` os usam.
- Visão geral da câmera (DES-0008 cita a câmera anterior a `modelo-kart-01`): `trackBounds` passa a seguir a sessão (caixa da
  geometria do arquivo na Kart Park; faixa externa da sintética); a caixa de sombra já acompanha o kart (±60 m) desde
  `modelo-kart-01`, de modo que a linha "extensões da câmera de sombra" de DES-0008 não tem mais objeto.
- `renderBest()` é chamado em `chooseTrack`: o melhor tempo exibido é comparado com a pista da sessão (RULE-0003 de `dirigibilidade`).
- `scripts/track-pipeline.ts` lê a raiz como `process.cwd()` (`npm run track` roda da raiz) e guarda o resumo esperado da origem por
  `trackId` (`ORIGIN_SHA256`); `publish` recalcula `prepareTrack` para preencher `prep` e exige igualdade byte a byte.
- O resultado k = 0 da suavização é o que a regra de ADR-0006 produz sobre este dado; nenhuma suavização adicional foi aplicada
  (ver "Proposta ao autor" em `97-changelog.md`).

## Rastreabilidade

A matriz `99-traceability.md` e o índice `00-index.md` são gerados pelo gate a partir dos campos `sources` dos registros `core/`,
`data/`, `web/`, `pipeline/` e `security/`; cada registro nomeia, por `REQ-*`, o arquivo e o símbolo que o realiza. As divergências
herdadas do D-Spec (13 linhas) estão em `98-divergences.md`, com as duas verificações de outras features reprovadas por esta rodada.
