---
title: Registro de implementação — modelo Kart 01 e câmera de jogo
feature: modelo-kart-01
stage: code
status: validated
version: 1.2.0
sources: []
---

# Registro de implementação

Rodada 1, Mode A (2026-10-27): o projeto validado de `300 Specs/330 D-Specs/Output/modelo-kart-01/` (1.2.0,
`dspec-validation-20261027-1624`; DES-0001 1.0.0, DES-0002 1.0.0, DES-0003 1.1.0, DES-0004 1.2.0, DES-0005 1.1.0, DES-0006 1.2.0,
DES-0007 1.0.0, DM-0001 1.2.0, ADR-0001 a ADR-0004) foi implementado por inteiro sobre a árvore do commit `b86b200` (código da
`dirigibilidade` validado em `code-validation-20261027-1824`, precondição de ADR-0003). Ordem de construção: dado (DM-0001: gravador
e fixture da linha de base, antes de qualquer outra mudança), aplicação (DES-0001 a DES-0005: quatro módulos novos e `src/main.ts`),
verificações do estágio (DES-0006: a medição do modelo montado por programa em Node e o portão determinístico). `src/physics.ts`,
`src/lap.ts`, `src/track.ts`, `src/trackData.ts`, `src/maneuvers.ts`, `src/lapTiming.ts`, `src/setupRecords.ts`, os presets, `Input`
e o contrato de passo não foram tocados (REQ-FEAT-0006-06: 0 linhas de diferença); `index.html`, `src/style.css` e `src/audio.ts`
inalterados (SCR-0001); nenhuma dependência de execução acrescentada (`three` `^0.186.1` continua a única; `mergeGeometries` vem de
`three/addons/utils/BufferGeometryUtils.js`, parte do pacote); `tsconfig.json` inalterado; nenhum arquivo de `tests/*.test.ts` nem
`tests/helpers/` escrito (estágio de testes).

Rodada 2, Mode B (2026-10-27): o projeto foi corrigido e revalidado em 1.3.0 (`dspec-validation-20261027-1941`; DES-0001 1.1.0,
DES-0006 1.3.0, `test-strategy.md` 1.3.0; os demais registros nas versões acima) em resposta ao FAIL SPEC desta feature
(`feedback-20261027-1928.md`, SPEC-ISSUE-01): os diâmetros das rodas são a **extensão em Z da caixa envolvente da geometria mesclada
de cada roda, no referencial local do nó público `spin`** (o eixo de rolamento, onde a revolução de 14 segmentos põe um vértice em
±`raio`), arredondada ao centímetro, com a tolerância inalterada; não `wheels[nome].diameterM`; nenhuma geometria muda; nenhum campo
novo. Nenhuma linha de código mudou nesta rodada (o código de `b29278b` já realizava o projeto; a regra antiga vivia só neste
registro, em `web/DES-0001`, `web/DES-0006` e `98-divergences.md` linha 21). Re-medição pela regra nova, por programa descartável
em Node com o `three` do projeto (caixa envolvente da única malha sob cada `spin`, levada ao referencial do `spin` pela inversa de
`spin.matrixWorld` vezes `mesh.matrixWorld`): extensão em Z **0,26 m** nas duas dianteiras e **0,28 m** nas duas traseiras (exatas;
ao centímetro 0,26 e 0,28); extensão em Y 0,2535/0,273 m (não é mais a medida); extensão em X 0,1313/0,1919 m (largura); **27
malhas, 27 chamadas, 5 128 triângulos** inalterados. O programa descartável `scripts/_measure-kart01.ts` da rodada 1 foi apagado
(não referenciado por `package.json`, pelos testes nem por registro). `scripts/kart01-baseline.ts` fica (`baseline:kart01`).

Rodada 3, Mode B (2026-10-30): o projeto revalidado com o seed `revision: 4` (`dspec-validation-20261030-1413`; DES-0001 1.2.0,
DES-0003 1.2.0, DES-0004 1.3.2, DES-0005 1.4.0, ADR-0003 1.3.0 decisão 6, ADR-0004 1.1.0, DM-0001 1.3.0, `test-strategy.md` 1.6.0)
foi implementado sobre a árvore de `c387839` (código da `dirigibilidade` e treino de voltas seguidas de `race-lap-validation` já
entregues). Sem drift nem turbo na cena e na câmera: o efeito de turbo no campo de visão e os nomes retirados de API-0003 2.0.0
saíram de `src/gameCamera.ts` (`baseVerticalFovDeg` → `shapeVerticalFovDeg`); o jato do escapamento e o nó `escapamentoSaida` saíram;
o bloco das marcas de `src/main.ts` decide a situação de marca de pneu por `getKartPose`, `getLapState` e `getHandlingTelemetry`, um
trecho por quadro com passo novo, sem leitura de `State.maneuvers`. A câmera fica atrás do piloto termine a volta ou não, pela fase
e pela pose (`decideCameraMode` inalterado). `src/physics.ts`, `src/lap.ts`, `src/track.ts` e o fixture da linha de base inalterados.

Resultado medido sobre o modelo montado em Node (programa descartável com o `three` do projeto, como `NOTES.md` do seed descreve;
os números entram nos registros `web/DES-0001` e `98-divergences.md`): **27 malhas, 27 chamadas de desenho, 5.128 triângulos**
(≤ 30; forma inalterada); caixa envolvente dos 15 grupos sem piloto de z −0,990 a +0,9365 (1,9265 m) e x ±0,725 (1,45 m); com
piloto, altura 0,9497 m; entre-eixos 1,05 m; bitolas 1,00 m e 1,14 m; as 15 cores distintas do atributo `color` mais `#F4F3EF` do
material da placa contêm as quatro da ficha; saída do escapamento em (0,39, 0,33, 0,77) m. **Achado da rodada 1 (fechado na rodada 2):** a
extensão em Y da geometria mesclada de cada roda é 0,2535 m (dianteiras) e 0,273 m (traseiras) — o pneu é um `LatheGeometry` de 14
segmentos e nenhum vértice cai em ±Y —, o que, pela regra de medida que DES-0001 1.0.0 e DES-0006 1.2.0 escreviam ("extensão em Y …
arredondada ao centímetro igual a 0,26 e 0,28"), reprovaria `WHEELS_AND_TRACKS` sobre a geometria inalterada do Cowork; reportado em
`300 Specs/330 D-Specs/Output/modelo-kart-01/reports/feedback/feedback-20261027-1928.md` (SPEC-ISSUE-01, FAIL SPEC) e resolvido pelo
projeto 1.3.0 com a regra da extensão em Z no referencial do `spin` (rodada 2 acima). Nada no código dependia dessa regra: a geometria
é a da fonte e `wheels[nome].diameterM` carrega 0,26 e 0,28.

Verificação em tela (navegador embutido da sessão, `vite preview`, 908 × 560 px, paisagem): visão geral com a pista inteira antes
da contagem; descida durante a contagem com o primeiro quadro ainda na visão geral; no verde, câmera atrás do piloto com o Kart 01
inteiro no quadro, placa `01` legível no para-choque, motor à direita do piloto, piloto esterçando com a tecla `a`; nenhum erro de
console. Taxa de quadros não medida (o painel roda em segundo plano, como no registro da `race-lap-validation`): fica para o
registro em `docs/kart-01/device-log.md` nos aparelhos de referência.

## Arquivos tocados nesta rodada (D-CD-01)

| Arquivo | Situação | Camada | Itens de projeto |
|---|---|---|---|
| `src/kart01Model.ts` | novo (555 linhas; 550 na rodada 3, sem `escapamentoSaida`) | aplicação | DES-0001, ADR-0001 |
| `src/kart01Decals.ts` | novo (91 linhas) | aplicação (único módulo do modelo com DOM) | DES-0001 |
| `src/kartPose.ts` | novo (77 linhas) | aplicação, puro | DES-0002 |
| `src/gameCamera.ts` | novo (186 linhas; 178 na rodada 3, sem o efeito de turbo) | aplicação, puro | DES-0003, ADR-0002 |
| `src/main.ts` | alterado (540 → 553 linhas; 666 na rodada 3, com a situação de marca de pneu e sem jato, `tricks`, `reducedMotion` e `turboActive`): importações, caixa de sombra e `sun.target`, Kart 01 no lugar do kart de caixas, jato no escapamento, `trackBounds`/`spin`/`cameraView`, `beginLap` sem `skidClock`, `ResizeObserver` só com `setSize`, `applyCameraView`, laço de quadro (pose, giro, luz, marcas por passo, câmera por quadro, `render` só com câmera) | aplicação | DES-0004, DES-0005 |
| `scripts/kart01-baseline.ts` | novo (85 linhas) | aplicação (programa em Node) | DM-0001, ADR-0004, DES-0006 |
| `tests/fixtures/kart01-sim-baseline.json` | novo (gravado por `npm run baseline:kart01 -- --commit b86b200d14f950baa1a902f56b6f6fbfff5082ba` sobre a árvore anterior às mudanças de código) | dado de teste | DM-0001, ADR-0004 |
| `package.json` | alterado: script `baseline:kart01` (`tsx scripts/kart01-baseline.ts`); dependências inalteradas | tooling | DES-0006 |
| `docs/kart-01/device-log.md` | novo: molde do registro em tela com a entrada do build desta rodada e os roteiros marcados como não executados | registro | DM-0001, DES-0004 |

Inalterados: `docs/kart-01/kart.js` (fonte, `DOMAIN/DEC-00`), `src/physics.ts`, `src/lap.ts`, `src/track.ts`, `src/trackData.ts`,
`src/maneuvers.ts`, `src/lapTiming.ts`, `src/frameClock.ts`, `src/lapMessages.ts`, `src/handlingMessages.ts`, `src/setupRecords.ts`,
`src/audio.ts`, `src/style.css`, `index.html`, `tsconfig.json`, `tests/*`, `scripts/handlingBench.ts`, `scripts/keyboard-lap.ts`,
`scripts/physics-bench.ts`.

## Portão determinístico desta rodada

| Passo | Resultado |
|---|---|
| `npx tsc --noEmit -p .` | saída 0 |
| `npx vite build` | saída 0; `dist/assets/index-D0RarhFV.js` 631 352 bytes (gzip 165 033) e `index-dgojskay.css` 11 407 bytes (gzip 3 244): 642 759 bytes sem compressão, abaixo de 3 MB (REQ-FEAT-0006-01, NFR-0002); nenhum recurso novo (textura, modelo ou fonte) |
| `npx tsx --test tests/*.test.ts` | 237 testes, 237 aprovados, 0 reprovados (`race-lap-validation-layering` e `race-lap-validation-hud-css` verdes sem alteração) |
| `npm run baseline:kart01` | fixture gravado; `ARCADE_ASSISTIDO` `arcade-assistido-v5`: 3 531 passos, `VALID`, 29 419 ms, setores 7 851/7 753/7 464/6 351 ms, 143 corridas de `Input`; `REALISTA_ALUGUEL_4T` `realista-aluguel-4t-v4`: 5 272 passos, `VALID`, 43 932 ms, setores 11 574/12 613/12 922/6 823 ms, 112 corridas; `trackId` `synthetic`, `trackVersion` 2; segunda execução sem `--force` recusada |
| Medição do modelo em Node | 27 malhas, 27 chamadas, 5 128 triângulos; medidas acima |
| `lint_artifacts.py --stage code --emit` | saída 0 |

Rodada 2 (sem mudança de código): `npx tsc --noEmit -p .` saída 0; `npx tsx --test tests/*.test.ts` 237 testes, 237 aprovados,
0 reprovados; medição do modelo em Node pela regra do projeto 1.3.0: extensão em Z no referencial do `spin` 0,26/0,26/0,28/0,28 m,
27 malhas, 27 chamadas, 5 128 triângulos; `lint_artifacts.py --stage code --emit` saída 0.

Rodada 3: `npx tsc --noEmit -p .` saída 0; `npx vite build` saída 0 (`dist/assets/index-BwruE9Pq.js` 694 094 bytes,
`index-oR7KyBh_.css` 10 800 bytes: 704 894 bytes sem compressão, abaixo de 3 MB); `npx tsx --test tests/*.test.ts` 423 testes, 410
aprovados, 13 reprovados — `pista-kart-park` CHK-TEST-0005-01..04, -06, -08, -10, CHK-TEST-0006-03, CHK-TEST-0007-05 (anteriores a
esta rodada, de outra feature); desta feature, por desenho, CHK-TEST-0001-19 e CHK-TEST-0004-05 (jato e `exhaustOutlet`, AC-US-0005-02
retirado), CHK-TEST-0004-06 (`tricks.drifting`, AC-US-0005-03 retirado) e o arquivo `tests/modelo-kart-01-camera.test.ts` inteiro
(importa `baseVerticalFovDeg`, nome retirado; contém CHK-TEST-0003-09, AC-US-0003-09 retirado) — linhas 28 a 30 de
`98-divergences.md`; `lint_artifacts.py --stage code --emit` saída 0.

## Rastreabilidade

A matriz `99-traceability.md` é gerada pelo gate a partir dos campos `sources` dos registros `web/`, `data/` e `security/`; cada
registro nomeia, por `REQ-*`, o arquivo e o símbolo que o realiza. O índice `00-index.md` também é gerado. As divergências herdadas
do D-Spec (1.2.0, mantidas em 1.3.0) estão em `98-divergences.md`: das 21 linhas abertas do projeto, 18 `resolved` com
`arquivo:linha` (a linha 21, a medida das rodas, fechada na rodada 2 pela regra do projeto 1.3.0) e 3 `open` com o motivo (a parte de
`npm test` do estágio de testes e o registro em aparelho).
