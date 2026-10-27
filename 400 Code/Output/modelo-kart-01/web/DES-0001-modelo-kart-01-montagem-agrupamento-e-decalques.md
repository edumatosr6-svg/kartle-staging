---
id: DES-0001
title: Modelo Kart 01 — montagem a partir do código do Cowork, agrupamento por material, decalques e pose das peças — implementação
feature: modelo-kart-01
stage: code
status: draft
version: 1.0.0
sources: [FEAT-0001, FEAT-0002, FEAT-0004, FEAT-0006, RULE-0001, RULE-0003, FLOW-0003, REQ-FEAT-0001-01, REQ-FEAT-0001-02, REQ-FEAT-0001-03, REQ-FEAT-0001-04, REQ-FEAT-0001-05, REQ-FEAT-0001-06, REQ-FEAT-0001-07, REQ-FEAT-0001-08, REQ-FEAT-0001-09, REQ-FEAT-0001-10, REQ-FEAT-0001-11, REQ-FEAT-0001-12, REQ-FEAT-0001-13, REQ-FEAT-0001-14, REQ-FEAT-0001-15, REQ-FEAT-0001-17, REQ-FEAT-0002-01, REQ-FEAT-0002-03, REQ-FEAT-0002-04, REQ-FEAT-0002-10, REQ-FEAT-0004-03, REQ-FEAT-0004-04, REQ-FEAT-0006-02, REQ-FEAT-0006-03, NFR-0003, NFR-0004]
---

# DES-0001 — Modelo Kart 01: montagem, agrupamento por material, decalques e pose das peças — implementação

`src/kart01Model.ts` (novo, camada aplicação, sem DOM; importa `three` e `three/addons/utils/BufferGeometryUtils.js`) e
`src/kart01Decals.ts` (novo; o único módulo do modelo com `document`). `docs/kart-01/kart.js` continua sem alteração e não é importado.
A transcrição mantém as funções geométricas de `kart.js` (`perfilLateral`, `perfilPlanta`, `perfilFrontal`, `inclinarTopo`, `caixa`,
`cilindro`, `pintarFaces`), as medidas, as cores e a cinemática dos braços (`maoNoVolante`, `resolverCotovelo`); muda só o que o
agrupamento exige (`Bucket`/`bake`: cada peça sólida vira um `Part` com geometria, cor e matriz no nó que recebe a malha mesclada) e o
que o DOM exige (decalques em módulo separado).

## Realização por requisito

| Requisito | Arquivo e símbolo |
|---|---|
| REQ-FEAT-0001-01, -17 | `src/kart01Model.ts` `buildKart01Model` (um modelo por chamada; duas chamadas dão dois modelos iguais); `src/main.ts` `kart01` (montado uma vez por página, `:124`) |
| REQ-FEAT-0001-02, -03, -05, -06, -07, -08 | `src/kart01Model.ts` `KART01_WHEELBASE_M` 1,05, `FRONT_WHEEL_DIAMETER_M` 0,26, `REAR_WHEEL_DIAMETER_M` 0,28, `defRodas` (±0,5/±0,57 em x; ∓0,525 em z), `buildWheel` (perfil até `raio`); medido no modelo montado: comprimento 1,9265 m, largura 1,45 m, entre-eixos 1,05 m, bitolas 1,00 m e 1,14 m, altura com piloto 0,9497 m |
| REQ-FEAT-0001-04 | `src/kart01Model.ts` `buildWheel` (`LatheGeometry` de 14 segmentos, raio 0,13/0,14, largura 0,13/0,19), `wheels[nome].diameterM` (0,26/0,28). Medida da extensão em Y 0,2535/0,273 m: ver `98-divergences.md` linha 21 e o feedback SPEC-ISSUE-01 |
| REQ-FEAT-0001-09, -10 | `src/kart01Model.ts` `KART01_GROUP_NAMES` (15), `PILOT_GROUP_NAME`, `peca` (grupo nomeado filho de `root`), `groups` (16 entradas; `piloto` filho direto de `root`); medido: os 16 grupos com triângulos (`chassi` 516, `eixoTraseiro` 332, rodas 324 cada, `nariz` 104, `painelFrontal` 46, sidepods 54 cada, `paraChoqueTraseiro` 78, `banco` 220, `direcao` 544, `pedais` 160, `motor` 708, `piloto` 1 016) |
| REQ-FEAT-0001-11, -12, -13, -14 | `src/kart01Model.ts` `KART01_PALETTE` (`carenagem` `#FF6A13`, `chassi` `#2B2E34`, `placa` `#F4F3EF`, `macacao` `#2F55D4` e as demais de `CORES`), `bake` (cor gravada no atributo `color`, `THREE.Color.set` sRGB → linear), `decalMaterial(C.placa)` (`materials.plate.color`); medido: 15 cores distintas no atributo `color` mais `#F4F3EF` do material da placa; `chassi` contém `#2B2E34`; `piloto` contém `#2F55D4` |
| REQ-FEAT-0001-15 | `src/kart01Model.ts` `decal` (`placaNumero` no `suporte` do painel; `placaTraseira` = `anchors.bumperPlate`); `src/kart01Decals.ts` `plateTexture` (512 × 352 px, fundo branco, `fillText(KART01_NUMBER)` na cor `borracha`), `sidepodTexture` (1024 × 192 px, número e `KARTLE`), `paintKart01Decals` |
| REQ-FEAT-0002-01 | `src/kart01Model.ts` `updateKart01Pose` (`steer.rotation.y = steerAngleRad` nos dois nós dianteiros; mesmo sinal da simulação, porque o giro de π em Y de `root` não troca o sentido de uma rotação em Y) |
| REQ-FEAT-0002-03, -04 | `src/kart01Model.ts` `steeringWheelAngleRad` (2,2 × esterço), `steeringWheel` (`volanteGiro`), `updateArms` (`maoNoVolante(lado, ânguloDoVolante)` põe a luva no aro em qualquer ângulo; `resolverCotovelo`) |
| REQ-FEAT-0002-10 | `src/kart01Model.ts` `wheels[nome].steer`/`spin` (4), `steeringWheel`, `arms` (2 × `upperArm`, `forearm`, `glove`): as sete peças animáveis são nós próprios depois do agrupamento |
| REQ-FEAT-0004-03, -04 | `src/kart01Model.ts` `bake` (`toNonIndexed` + `mergeGeometries`; `materials.body` único, `vertexColors`, `flatShading`, rugosidade 0,6, metalização 0,15), `decalMaterial` (dois materiais de decalque); medido: 27 malhas, 27 chamadas (uma por malha, um material por malha), 5 128 triângulos |
| REQ-FEAT-0006-02, -03 | `package.json` (`dependencies` só `three` `^0.186.1`); `src/kart01Model.ts` importa `three` e `three/addons/utils/BufferGeometryUtils.js` (campo `exports` `./addons/*` do pacote, tipado por `@types/three`) |
| NFR-0003, NFR-0004 | nenhum recurso baixado: geometria por código, decalques em `canvas` com a pilha de fontes de recuo (`src/kart01Decals.ts` `FONT`) sem `@font-face` |

## Interface entregue

`KART01_GROUP_NAMES`, `PILOT_GROUP_NAME`, `Kart01GroupName`, `WheelName`, `KART01_PALETTE`, `KART01_NUMBER`, `KART01_WHEELBASE_M`,
`FRONT_WHEEL_DIAMETER_M`, `REAR_WHEEL_DIAMETER_M`, `STEERING_WHEEL_RATIO`, `steeringWheelAngleRad`, `ArmNodes`, `Kart01Model`
(`root` `kart`; `groups`; `wheels` com `steer` — nome `<roda>Malha`, no centro da roda — e `spin` — `<roda>Giro`; `steeringWheel`;
`arms`; `anchors.exhaustOutlet` `escapamentoSaida` filho de `motor` em (0,39, 0,33, 0,77); `anchors.bumperPlate`; `materials.body`,
`plate`, `sidepod`; `palette`), `buildKart01Model`, `updateKart01Pose(model, { steerAngleRad, wheelSpinRevs })` (giro
`−2π × revs` em X do nó `spin`, a convenção de `kart.js`); `paintKart01Decals(model)` em `src/kart01Decals.ts` (sem contexto 2D:
`console.warn('kart01-decals', 'NO_2D_CONTEXT')`, decalques só com a `color` do material; chamada repetida descarta as texturas).

## Plano de agrupamento realizado (ADR-0001)

27 malhas: `chassi` 1; `eixoTraseiro` 1; rodas 4 (uma por `spin`); `nariz` 1; `painelFrontal` 1 + decalque; sidepods (1 + decalque) × 2;
`paraChoqueTraseiro` 1 + decalque; `banco` 1; `direcao` 2 (coluna; `volanteGiro`); `pedais` 1; `motor` 1 (em `motorBloco`); `piloto`
1 + 6 (braços). Os nós `suporte`, `motorBloco`, `volante`, `volanteGiro`, `steer`, `spin` e a âncora não têm geometria. Decisões de
detalhe (queixeira sem `DoubleSide`; cor branca do material do adesivo; comprimento constante do antebraço) em `97-changelog.md`.
