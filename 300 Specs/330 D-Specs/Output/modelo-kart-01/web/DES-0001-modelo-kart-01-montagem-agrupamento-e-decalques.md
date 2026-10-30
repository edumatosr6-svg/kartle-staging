---
id: DES-0001
title: Modelo Kart 01 — montagem a partir do código do Cowork, agrupamento por material, decalques e pose das peças
feature: modelo-kart-01
stage: dspec
status: validated
version: 1.2.0
sources: [FEAT-0001, FEAT-0002, FEAT-0004, FEAT-0006, RULE-0001, RULE-0003, FLOW-0003, REQ-FEAT-0001-01, REQ-FEAT-0001-02, REQ-FEAT-0001-03, REQ-FEAT-0001-04, REQ-FEAT-0001-05, REQ-FEAT-0001-06, REQ-FEAT-0001-07, REQ-FEAT-0001-08, REQ-FEAT-0001-09, REQ-FEAT-0001-10, REQ-FEAT-0001-11, REQ-FEAT-0001-12, REQ-FEAT-0001-13, REQ-FEAT-0001-14, REQ-FEAT-0001-15, REQ-FEAT-0001-17, REQ-FEAT-0002-01, REQ-FEAT-0002-03, REQ-FEAT-0002-04, REQ-FEAT-0002-10, REQ-FEAT-0004-03, REQ-FEAT-0004-04, REQ-FEAT-0006-02, REQ-FEAT-0006-03, NFR-0003, NFR-0004]
---

# DES-0001 — Modelo Kart 01: montagem, agrupamento por material, decalques e pose das peças

## Realiza

Os `REQ-*` em `sources`: o Kart 01 montado a partir de `docs/kart-01/kart.js` com as medidas, os 15 grupos
de peças mais `piloto`, as quatro cores da ficha e o número 01 na placa (REQ-FEAT-0001-02 a -15); o mesmo
modelo nos dois canais e nas duas formas (REQ-FEAT-0001-17); no máximo 30 chamadas de desenho sem mudar a
forma, 5.128 triângulos (REQ-FEAT-0004-03, -04; `DOMAIN/DEC-01`); rodas dianteiras esterçáveis, volante que
gira com o esterço, mãos no aro e as sete peças animáveis uma a uma depois do agrupamento (REQ-FEAT-0002-01,
-03, -04, -10); montagem em Three.js 0.186 sem dependência nova (REQ-FEAT-0006-02, -03). A pose por quadro
(posição, rumo, esterço, giro) é decidida por [DES-0002](DES-0002-estado-do-kart-para-exibicao-e-giro-das-rodas.md)
e aplicada por [DES-0004](DES-0004-integracao-da-cena-em-main-ts.md); este item só expõe os nós e a função
que os move.

## Posicionamento

- `src/kart01Model.ts`, camada **Aplicação**, **novo**. Importa `three` e
  `three/addons/utils/BufferGeometryUtils.js` (`mergeGeometries`, parte do pacote `three` declarado;
  resolvido pelo campo `exports` `./addons/*` do pacote, presente em 0.186.1 e em `@types/three` 0.183).
  Não usa o DOM: carrega em `npm test`.
- `src/kart01Decals.ts`, camada **Aplicação**, **novo**. Único módulo do modelo que usa o DOM
  (`document.createElement('canvas')`, `THREE.CanvasTexture`). Chamado só por `src/main.ts`.
- `docs/kart-01/kart.js` continua no repositório **sem alteração**, como fonte (`DOMAIN/DEC-00`); não é
  importado pelo jogo (é JavaScript sem tipos, com `texturaCanvas` no DOM e com a vista explodida). A
  adaptação é uma transcrição para TypeScript com as geometrias, as medidas (`MEDIDAS`), as cores (`CORES`)
  e a cinemática dos braços (`atualizarBracos`, `resolverCotovelo`, `maoNoVolante`) **idênticas**; muda só o
  que o agrupamento exige (materiais e mesclagem) e o que o DOM exige (decalques separados).

## Interface

Referencial do modelo (o do código do Cowork): metros; Y para cima; **frente do kart = −Z; direita do piloto
= +X**; origem no chão, no meio do entre-eixos. O referencial da simulação tem a frente em +Z e a esquerda em
+X (`src/physics.ts:121-122`): `model.root` recebe `rotation.y = π` ao entrar na cena
([DES-0004](DES-0004-integracao-da-cena-em-main-ts.md)), o que leva frente a frente e direita a direita; um
ângulo positivo em torno de Y continua sendo "para a esquerda" nos dois referenciais, de modo que
`steerAngleRad` da simulação se aplica sem troca de sinal.

| Símbolo | Assinatura | Descrição |
|---|---|---|
| `KART01_GROUP_NAMES` | `readonly string[]` (15) | `chassi`, `eixoTraseiro`, `rodaDianteiraEsq`, `rodaDianteiraDir`, `rodaTraseiraEsq`, `rodaTraseiraDir`, `nariz`, `painelFrontal`, `sidepodEsq`, `sidepodDir`, `paraChoqueTraseiro`, `banco`, `direcao`, `pedais`, `motor` (RULE-0001) |
| `PILOT_GROUP_NAME` | `'piloto'` | o 16º grupo, filho direto de `root`, nunca de um dos 15 |
| `KART01_PALETTE` | `Readonly<Record<string, string>>` | as cores de `CORES` de `kart.js` em `#RRGGBB` maiúsculo: `carenagem` `#FF6A13`, `chassi` `#2B2E34`, `placa` `#F4F3EF`, `macacao` `#2F55D4`, e as demais (`borracha`, `bandeja`, `pneu`, `aro`, `cubo`, `banco`, `volante`, `motor`, `motorEscuro`, `escapamento`, `luvas`, `capacete`, `viseira`, `disco` `#8A9099`); as quatro primeiras são as da ficha e nunca mudam |
| `KART01_NUMBER` | `'01'` | número da placa; constante, sem opção (I10) |
| `KART01_WHEELBASE_M` | `1.05` (m) | entre-eixos do modelo (`MEDIDAS.entreEixos`) |
| `FRONT_WHEEL_DIAMETER_M`, `REAR_WHEEL_DIAMETER_M` | `0.26`, `0.28` (m) | diâmetros externos das rodas (2 × `raioRodaDianteira`, 2 × `raioRodaTraseira`) |
| `STEERING_WHEEL_RATIO` | `2.2` (adimensional) | `MEDIDAS.relacaoDirecao`: ângulo do volante por ângulo de esterço |
| `steeringWheelAngleRad(steerAngleRad)` | `(rad) => rad` | `STEERING_WHEEL_RATIO × steerAngleRad`: mesmo sinal, 0 em 0, módulo estritamente crescente (RULE-0003) |
| `buildKart01Model()` | `() => Kart01Model` | monta o kart com o piloto, aplica o agrupamento por material e devolve os nós nomeados; puro em relação ao DOM; duas chamadas dão dois modelos independentes e iguais |
| `updateKart01Pose(model, pose)` | `(Kart01Model, { steerAngleRad: number (rad); wheelSpinRevs: Record<WheelName, number> (rotações) }) => void` | esterça as duas rodas dianteiras por `steerAngleRad` em torno do eixo vertical de cada roda; põe o giro de cada roda em `−2π × wheelSpinRevs[nome]` rad em torno do seu eixo (a convenção de `kart.js`, `giro.rotation.x = −distancia / raio`); gira o volante por `steeringWheelAngleRad(steerAngleRad)`; recoloca os braços com a cinemática de `atualizarBracos`. Idempotente: a mesma pose aplicada duas vezes deixa os mesmos nós |
| `Kart01Model` | tipo | `root: THREE.Group` (nome `kart`); `groups: Record<Kart01GroupName, THREE.Group>` (16 entradas); `wheels: Record<WheelName, { steer: THREE.Group; spin: THREE.Group; diameterM: number }>`; `steeringWheel: THREE.Group` (`volanteGiro`); `arms: readonly [ArmNodes, ArmNodes]`; `anchors: { bumperPlate: THREE.Mesh }`; `materials: { body: THREE.MeshStandardMaterial; plate: THREE.MeshStandardMaterial; sidepod: THREE.MeshStandardMaterial }`; `palette: typeof KART01_PALETTE` |
| `WheelName` | tipo | `'rodaDianteiraEsq' \| 'rodaDianteiraDir' \| 'rodaTraseiraEsq' \| 'rodaTraseiraDir'`, na ordem de `wheelPositions` (dianteira esquerda, dianteira direita, traseira esquerda, traseira direita) |
| `paintKart01Decals(model)` (`src/kart01Decals.ts`) | `(Kart01Model) => void` | pinta duas `CanvasTexture` (placa 512 × 352 px com o número; adesivo lateral 1024 × 192 px com o número e `KARTLE`) e as atribui a `materials.plate.map` e `materials.sidepod.map`; o fundo da placa é pintado **branco** e a `color` do material continua `KART01_PALETTE.placa`, de modo que a placa exibida tem exatamente a cor da ficha e o número a cor `borracha`; fonte: `Archivo, "Arial Black", Impact, sans-serif` sem `@font-face` (nenhum download; cai na fonte do sistema); chamada repetida substitui e descarta (`dispose`) as texturas anteriores |

### Plano de agrupamento por material (ADR-0001)

Toda peça sólida usa **um único** `MeshStandardMaterial` (`materials.body`: `vertexColors: true`,
`flatShading: true`, `roughness` 0,6, `metalness` 0,15) com a cor de cada malha original gravada no atributo
`color` dos seus vértices (`THREE.Color.setHex`, que converte sRGB para linear como o `pintarFaces` de
`kart.js` já faz no capacete e no tronco). As malhas de um mesmo grupo e de um mesmo nó animável são
mescladas com `mergeGeometries` depois de `toNonIndexed()`, o que preserva cada triângulo. Os decalques
(planos com textura, `transparent`, `polygonOffset`) ficam em dois materiais próprios: `materials.plate`
(placa dianteira e placa traseira, mesma textura) e `materials.sidepod` (os dois adesivos laterais, mesma
textura). Resultado planejado, **27 malhas = 27 chamadas de desenho** (uma por malha, um material por
malha; a passagem de sombra não conta):

| Grupo | Malhas depois do agrupamento | Chamadas |
|---|---|---|
| `chassi` | 1 (trilhos, travessas, bandeja, mangas, pontas de eixo, barras de direção) | 1 |
| `eixoTraseiro` | 1 (eixo, mancais, disco, pinça, coroa) | 1 |
| `rodaDianteiraEsq`, `rodaDianteiraDir`, `rodaTraseiraEsq`, `rodaTraseiraDir` | 1 por roda, dentro do nó `spin` (pneu, aro, cubo, 4 parafusos) | 4 |
| `nariz` | 1 (carenagem, borracha) | 1 |
| `painelFrontal` | 1 (painel) + 1 decalque `placaNumero` | 2 |
| `sidepodEsq`, `sidepodDir` | 1 (carenagem) + 1 decalque `adesivo`, cada | 4 |
| `paraChoqueTraseiro` | 1 (carenagem) + 1 decalque `placaTraseira` (= `anchors.bumperPlate`) | 2 |
| `banco` | 1 (concha, abas, escoras) | 1 |
| `direcao` | 1 (coluna, estática) + 1 (`volanteGiro`: aro, pegadas, raios, marcador, cubo, centro) | 2 |
| `pedais` | 1 | 1 |
| `motor` | 1 (base, bloco, cabeçote, aletas, tanque, tampa, partida, filtro, escapamento, ponteira, curva, proteção) | 1 |
| `piloto` | 1 (quadril, tronco, pescoço, capacete com viseira e queixeira, pernas, botas, ombros) + 3 por braço × 2 | 7 |
| **Total** | **27** | **27** |

Braços: `kart.js` move cinco malhas por braço com `posicionarTubo`; como o braço superior (ombro → cotovelo)
mede sempre `l1` = 0,285 m, o antebraço com o punho (cotovelo → pulso → mão) mede sempre 0,84 × `l2` +
0,072 × `l2` com `l2` = 0,27 m, e o punho é colinear ao antebraço, cada braço vira **três** malhas rígidas
com a mesma geometria: `upperArm` (cilindro `bracoSup` de comprimento `l1` com a esfera `cotovelo` na ponta),
`forearm` (cilindros `antebraco` e `punho` colineares) e `glove` (`luva`, com a orientação do volante). A cada
quadro, `updateKart01Pose` resolve o cotovelo com `resolverCotovelo` e posiciona os três nós (posição e
quaternion; sem escala por quadro). As mãos ficam no aro em qualquer ângulo (REQ-FEAT-0002-04) exatamente
como no código do Cowork, porque a posição da mão é `maoNoVolante(lado, ânguloDoVolante)`.

Ponto de ancoragem: `anchors.bumperPlate`, a malha `placaTraseira` do grupo `paraChoqueTraseiro`, cuja cor
de material é `bumperPlateColorHex` em API-0002. O nó sem geometria `anchors.exhaustOutlet` (`Object3D`
`escapamentoSaida`, filho do grupo `motor`, hoje em `src/kart01Model.ts:45`, `:526-530` e `:539`), que a
versão 1.1.0 punha na ponteira para [DES-0005](DES-0005-efeitos-presos-ao-kart.md) prender a fumaça de turbo,
é **retirado** nesta versão: a fumaça ou chama de turbo não é exibida em nenhum quadro (REQ-FEAT-0005-10, F-Spec
1.3) e o nó fica sem consumidor. Sem geometria, a retirada não muda malhas, chamadas de desenho, triângulos nem
medidas; o grupo `motor`, com o `escapamento` e a `ponteira`, continua como está (é peça do kart, não efeito). Os nós `steer` de cada roda ficam no centro da roda (posição `(x, raio, z)` de `defRodas`), de modo
que o esterço gira a roda em torno do seu próprio eixo vertical; o nó `spin` é filho do `steer`.

O que o agrupamento **não** muda: nenhuma geometria, segmento, chanfro, posição ou escala de peça; o número
de triângulos continua 5.128 (o seed o mediu no código do Cowork; `DRAW_COST` o conta de novo sobre o modelo
montado); cada um dos 16 grupos continua a conter pelo menos uma malha com triângulos; `piloto` continua
filho direto de `root`. O que muda em aparência, admitido pelo F-Spec (lacunas deliberadas: só as quatro cores
são critério): rugosidade e metalização por peça (viseira, aros, escapamento) passam ao valor único do
material; nenhuma cor muda.

### Como as medidas de RULE-0001 saem do modelo montado

| Medida | Onde está no modelo | Valor esperado |
|---|---|---|
| `bboxLengthM`, `bboxWidthM` | caixa envolvente, no referencial do modelo, da união das geometrias dos 15 grupos (sem `piloto`), na pose de repouso (`steerAngleRad` 0, giro 0): comprimento no eixo Z, largura no eixo X | 1,925 m (do nariz em z = −0,99 ao para-choque em z = 0,935); 1,45 m (para-choque traseiro em x = ±0,725) |
| `wheelbaseM` | distância em Z entre os centros dos nós `steer` dianteiros (z = −0,525) e traseiros (z = 0,525) | 1,05 m |
| `frontWheelDiametersM`, `rearWheelDiametersM` | extensão em **Z** da caixa envolvente da geometria mesclada de cada roda, no referencial local do nó `spin` — o eixo de rolamento da roda, no qual a revolução do `LatheGeometry` de 14 segmentos (`criarRoda`, girada em Z) põe um vértice em φ = 0 e outro em φ = π, a +`raio` e −`raio`; na pose de repouso (esterço 0, giro 0) esse eixo coincide com o Z do modelo. A extensão em Y **não** é a medida: nenhum dos 14 vértices cai em ±Y e ela vale 0,975 × 2 × `raio` (0,2535 m; 0,273 m), de modo que a forma inalterada do Cowork reprovaria ao centímetro. O valor medido é igual a 2 × `raio` = `wheels[nome].diameterM`, mas `diameterM` é o valor declarado que o giro usa (RULE-0003), não a medida: a verificação mede a geometria montada (`SEED/IM-I9`) | 0,26 m; 0,28 m (exatos) |
| `frontTrackM`, `rearTrackM` | distância em X entre os centros dos nós `steer` de um mesmo eixo (±0,5; ±0,57) | 1,00 m; 1,14 m |
| `kartColorHexes`, `chassisColorHexes` | cores distintas do atributo `color` das malhas dos 15 grupos (linear → sRGB, arredondado a 8 bits) mais as `color` dos materiais de decalque; idem só no grupo `chassi` | contêm `#FF6A13`; contêm `#2B2E34` |
| `bumperPlateColorHex` | `materials.plate.color` (a `color` da malha `placaTraseira`) | `#F4F3EF` |
| `suitColorHex` | `KART01_PALETTE.macacao`, confirmado presente entre as cores do atributo `color` do grupo `piloto` | `#2F55D4` |
| `meshCount`, `drawCallCount`, `triangleCount` | malhas sob `root` marcadas para desenhar; soma por malha do número de materiais (1 cada); soma de `index.count / 3` ou `position.count / 3` | 27; 27; 5.128 |

## Colaboradores

Chamado por `src/main.ts` (`buildKart01Model` uma vez; `updateKart01Pose` por quadro; `paintKart01Decals`
uma vez, depois da montagem) e por `tests/helpers/kart01Report.ts` (montagem e medida em Node). Chama só
`three` e o utilitário de mesclagem. Não importa nenhum módulo da simulação: o modelo não sabe de `State`,
`Input` ou `wheelPositions` — a sua posição no mundo, o seu esterço e o seu giro chegam prontos de
[DES-0002](DES-0002-estado-do-kart-para-exibicao-e-giro-das-rodas.md).

## Estado e concorrência

O modelo é construído uma vez por página e nunca reconstruído: recarga ou troca de orientação não o
remontam (REQ-FEAT-0001-17); a pose é reescrita por quadro por `updateKart01Pose`, leitura idempotente da
pose do quadro. Nada é persistido; não há escrita fora da cena. A pintura dos decalques é feita uma vez,
depois da montagem; repetir a pintura é inócuo.

## Comportamento em falha

- `document` ausente (Node, `npm test`): `paintKart01Decals` não é chamado; os decalques ficam com a `color`
  do material e sem `map`; a medida de cores não depende do `map`.
- `canvas.getContext('2d')` devolvendo `null` (navegador sem 2D): os decalques ficam sem `map`, a placa
  continua branca e o número 01 não aparece; nada lança. Registro: `console.warn('kart01-decals',
  'NO_2D_CONTEXT')`, só o código.
- `mergeGeometries` devolvendo `null` (geometrias com atributos incompatíveis): defeito de montagem que o
  teste de contrato reprova (`DRAW_COST` com `SHAPE_CHANGED` ou `PART_GROUPS` com `GROUP_MISSING`); em
  execução, a malha não é criada e o grupo fica sem geometria visível — nunca silencioso em `npm test`.
- WebGL ausente: tratamento existente de `src/main.ts:21-26`, antes de o modelo ser montado.
- Sem rede, sem tempo-limite, sem dependência externa, sem escrita parcial.

## Observabilidade

`DRAW_COST` (`meshCount`, `drawCallCount`, `triangleCount`), `PART_GROUPS`, `PART_COLORS`,
`KART_DIMENSIONS` e `WHEELS_AND_TRACKS` na saída de `npm test`
([DES-0006](DES-0006-verificacoes-de-npm-test-e-relatorio-do-modelo.md)) são a instrumentação: um
agrupamento que apague um grupo, mude a forma ou passe de 30 chamadas falha ali, nunca só em tela.

## Determinismo (D-DS-07)

Não é código de simulação. A montagem é determinística (nenhum sorteio, nenhum relógio); `RENDER_NEUTRAL`
prova que montar e mover o modelo a cada passo não altera o estado da simulação.

## Feature flag

Nenhuma: o F-Spec proíbe chave para voltar ao kart provisório e qualquer escolha de kart, cor ou adesivo
(FEAT-0001, Configuração; I10). O padrão é o Kart 01 assim que a feature é entregue; a reversão é a do
repositório ([ADR-0003](../adr/ADR-0003-ordem-de-entrega-depois-da-dirigibilidade-e-sem-chave.md)).

## Pontos em aberto

Nenhum.
