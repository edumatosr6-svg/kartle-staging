---
id: TEST-0001
title: Modelo montado em Node — medidas, rodas e bitolas, 16 grupos, cores da ficha, custo de desenho, nós animados, âncora única e nenhum efeito preso ao modelo
feature: modelo-kart-01
stage: test
status: validated
version: 1.1.0
sources: [AC-US-0001-01, AC-US-0001-02, AC-US-0001-03, AC-US-0001-04, AC-US-0001-05, AC-US-0001-06, AC-US-0001-07, AC-US-0001-08, AC-US-0001-09, AC-US-0001-10, AC-US-0001-11, AC-US-0001-12, AC-US-0001-13, AC-US-0001-14, AC-US-0001-15, AC-US-0001-16, AC-US-0002-01, AC-US-0002-03, AC-US-0002-04, AC-US-0002-05, AC-US-0002-06, AC-US-0005-04, AC-US-0005-05, NFR-0004]
---

# TEST-0001 — Modelo montado em Node: medidas, rodas e bitolas, 16 grupos, cores, custo, nós animados e âncoras

| | |
|---|---|
| Arquivo | `tests/modelo-kart-01-model.test.ts` (estratégia: `model`) |
| Nível | integração (`buildKart01Model()` medido por `measureKart01Model` em Node, sem decalques e sem DOM) e unitário (`judgeModelCheck` sobre medidas sintéticas construídas à mão; `steeringWheelAngleRad`) |
| Interface exercitada | `buildKart01Model`, `updateKart01Pose`, `steeringWheelAngleRad`, `KART01_GROUP_NAMES`, `PILOT_GROUP_NAME` (`src/kart01Model.ts`); `measureKart01Model`, `judgeModelCheck`, `serializeRecord`, `pilotColorHexes`, `boxOf`, `toCm` (`tests/helpers/kart01Report.ts`) |
| Fixtures | o modelo montado uma vez por arquivo (`model`, `measures`); `nominal()` (medidas sintéticas com os valores da ficha) e as derivadas com um desvio cada (1,96 m; 1,48 m; 1,08 m; roda 0,27 m; bitola 1,01 m e 1,13 m; 0,264/0,256/0,266 m para o arredondamento; sem `motor`; `piloto` sob `banco`; `#FF6B13`; chassi sem `#2B2E34`; placa `#FFFFFF`; macacão `#2F55D5`; 31 chamadas; 5 127 triângulos); modelos montados de novo e alterados antes da medida (`pedais` esvaziado; `piloto` movido para `banco`; `root.rotation.y = π`); registros de API-0002 impressos por `t.diagnostic` |

## Verificações

| Check | Decide | Teste | O que a faria falhar |
|---|---|---|---|
| CHK-TEST-0001-01 | AC-US-0001-01, AC-US-0001-02, AC-US-0001-03 | the assembled kart measures 1.93 m long, 1.45 m wide and 1.05 m between the axles, within 2 cm | caixa envolvente dos 15 grupos fora de 1,93 ± 0,02 ou 1,45 ± 0,02 m (por exemplo o para-choque ou o nariz encurtados), nós `steer` dianteiros e traseiros a outra distância, `KART_DIMENSIONS` sem `PASS` |
| CHK-TEST-0001-02 | AC-US-0001-01, AC-US-0001-02, AC-US-0001-03 | a dimension outside the 2 cm tolerance is judged OUT_OF_TOLERANCE, never rounded in | `judgeModelCheck` aceitando 1,96 m, 1,48 m ou 1,08 m, reprovando 1,95 m (borda), motivo diferente de `OUT_OF_TOLERANCE` |
| CHK-TEST-0001-03 | AC-US-0001-04, AC-US-0001-05, AC-US-0001-06, AC-US-0001-07 | the front wheels measure 0.26 m, the rear 0.28 m, and the tracks 1.00 m and 1.14 m, to the centimetre | extensão em Z da geometria de uma roda no referencial do seu nó `spin` que não arredonde a 26 ou 28 cm (mutação A: raio traseiro 0,135 m reprova esta verificação), centros `steer` a outra distância em X, nó `spin` sem malha |
| CHK-TEST-0001-04 | AC-US-0001-04, AC-US-0001-05, AC-US-0001-06, AC-US-0001-07 | a wheel or a track that differs to the centimetre is judged OUT_OF_TOLERANCE | `judgeModelCheck` aceitando 0,27 m, 1,01 m ou 1,13 m, ou 0,266 m (que arredonda a 0,27), ou reprovando 0,264/0,256 m (que arredondam a 0,26) |
| CHK-TEST-0001-05 | AC-US-0001-08, AC-US-0001-09 | the 15 part groups and the pilot are present with visible geometry, the pilot outside every part group | grupo renomeado, ausente ou sem triângulos visíveis depois do agrupamento, `piloto` filho de um dos 15 grupos (mutação F: `piloto` sob `banco` reprova esta verificação), número de grupos diferente de 16 |
| CHK-TEST-0001-06 | AC-US-0001-08, AC-US-0001-09 | an emptied group is GROUP_MISSING, a nested pilot is GROUP_NESTED, and missing wins over nested | `judgeModelCheck` sem `GROUP_MISSING` para `motor` ausente, sem `GROUP_NESTED` para `piloto` com `parentGroupName`, ordem invertida com as duas condições; `measureKart01Model` que não note `pedais` esvaziado nem `piloto` movido para `banco` |
| CHK-TEST-0001-07 | AC-US-0001-10, AC-US-0001-11, AC-US-0001-12, AC-US-0001-13 | the kart uses Kartle orange, the chassis graphite, the bumper plate white and the pilot suit blue, as the sheet names them | paleta com outra cor nas quatro nomeadas (`#FF6B13`), `chassi` sem `#2B2E34`, material da placa de outra cor, macacão fora das cores pintadas no grupo `piloto`, conversão linear→sRGB errada |
| CHK-TEST-0001-08 | AC-US-0001-10, AC-US-0001-11, AC-US-0001-12, AC-US-0001-13 | a colour that is absent or differs from the sheet is COLOR_MISMATCH | `judgeModelCheck` aceitando `#FF6B13`, chassi sem grafite, placa `#FFFFFF` ou macacão `#2F55D5` |
| CHK-TEST-0001-09 | NFR-0004 | the kart with the pilot costs at most 30 draw calls and keeps the 5128 triangles of the source | malhas não mescladas (124 chamadas), um material a mais numa malha, geometria perdida ou duplicada no `bake` (triângulos ≠ 5 128), contagem diferente de 27 malhas |
| CHK-TEST-0001-10 | NFR-0004 | 31 draw calls is LIMIT_EXCEEDED, 5127 triangles is SHAPE_CHANGED, and the limit is reported first | `judgeModelCheck` aceitando 31 chamadas ou 5 127 triângulos, reprovando 30, ou reportando `SHAPE_CHANGED` quando as duas condições valem |
| CHK-TEST-0001-11 | AC-US-0001-14 | building the model twice gives the same Kart 01, with the same measures, groups and colours | montagem não determinística (medidas, grupos ou cores diferentes entre duas chamadas), raiz com outro nome, menos de 16 grupos expostos |
| CHK-TEST-0001-12 | AC-US-0001-15 | every solid mesh of the kart casts a shadow and the decals do not | `bake` sem `castShadow`/`receiveShadow`, decalque projetando sombra, modelo sem decalque |
| CHK-TEST-0001-13 | AC-US-0001-16 | the rear bumper carries the plate mesh with the plate material, the anchor the number is painted on | malha `placaTraseira` ausente de `paraChoqueTraseiro`, com outro material, `anchors.bumperPlate` apontando para outra malha, material da placa de outra cor |
| CHK-TEST-0001-14 | AC-US-0002-01 | the two front wheels turn about their vertical axis by the steering angle and the rear wheels do not | `updateKart01Pose` esterçando só uma dianteira, esterçando as traseiras, girando em torno de X ou Z, ou com ganho diferente de 1 |
| CHK-TEST-0001-15 | AC-US-0002-03 | the steering wheel is centred at zero, turns to the side of the steer and more for a larger steer | `steeringWheelAngleRad(0) ≠ 0`, sinal trocado, módulo não crescente (saturação), `steeringWheel.rotation.z` não acompanhando a função |
| CHK-TEST-0001-16 | AC-US-0002-04 | both hands stay on the rim of the steering wheel at every wheel angle, with rigid arm segments | luva fora do raio de pegada (0,1386 m) ou fora do plano do aro em algum ângulo, braço superior ou antebraço de comprimento variável (cinemática que estica), malha do antebraço de outro comprimento |
| CHK-TEST-0001-17 | AC-US-0002-05 | the four wheels rest on the ground: the bottom of their bounding box is at 0 m to the centimetre | nó `steer` a altura diferente do raio, roda abaixo do chão ou flutuando acima de 0,5 cm (a tolerância é a de RULE-0001, ao centímetro; `min.y` medido 0,0033 m pela revolução de 14 segmentos, registrado em `98-divergences.md`) |
| CHK-TEST-0001-18 | AC-US-0002-06 | the nose is at the model front (-Z), the rear bumper behind, and the root turned by pi puts the nose at +Z of the simulation | nariz em +Z do modelo, para-choque em −Z, ou nariz que não fique em +Z do pai com `root.rotation.y = π` |
| CHK-TEST-0001-20 | AC-US-0005-04 | the kart root holds only the 15 part groups and the pilot: no drift indicator hangs from the model | um objeto acrescentado à raiz do modelo (mutação M13: cone sob `root` reprova esta verificação), malha extra dentro de um grupo além das 27 de `DRAW_COST`, objeto criado ao posar o kart em esterço máximo com giro das rodas traseiras |
| CHK-TEST-0001-21 | AC-US-0005-05 | the model has no exhaust outlet: bumperPlate is its only anchor and no node is the exhaust tip | `anchors` com outra chave além de `bumperPlate` (mutação M12: `exhaustOutlet` de volta reprova esta verificação), nó `escapamentoSaida` no modelo |
