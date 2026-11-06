---
title: Divergências — pista Kart Park
feature: pista-kart-park
stage: dspec
status: validated
version: 2.0.0
sources: []
---

# Divergências

Registro durável dos requisitos deste conjunto que o sistema em execução não satisfaz (conventions §6). O
F-Spec é normativo: nenhuma linha abaixo enfraquece um requisito. **Base única desde a versão 2.0.0 deste
registro: a árvore do commit `281b617`** (código e testes da revisão 2 validados, `code-validation-20261103-2004`
e `test-validation-20261104-1432`, SUCCESS). Cada linha cita o que existe nessa árvore em `arquivo:linha`, a etapa
que deve a mudança e o item de projeto que a fecha. Caminhos relativos à raiz do repositório.

## Abertas — revisão 3 do seed

| Requisito | O que exige | O que o sistema faz hoje | Etapa devedora | Item de projeto | Estado |
|---|---|---|---|---|---|
| REQ-FEAT-0001-15, -16; API-0002 (`trackVersion`, `TRACK_VERSION_MISMATCH`) | a Kart Park do seletor e da abertura na versão 2, conferida contra a entrada do catálogo; nenhuma sessão com a versão 1; arquivo de outra pista ou versão termina `FAILED` com `TRACK_VERSION_MISMATCH` | `src/trainingSession.ts:10` não tem `trackVersion` na entrada; `:67-69` dá `TRACK_DATA_UNREADABLE` para outro `trackId` e não confere versão; `src/main.ts:13` importa `./tracks/kart-park-v1.json?raw` e `:156` o entrega à sessão, que abre `READY` com `trackVersion` 1 | código | DES-0005, DES-0007, ADR-0008 | open |
| REQ-FEAT-0006-07, -08 | nome "Kart Park — São José dos Pinhais (réplica não oficial)" e "691 m" | `src/trainingSession.ts:13` declara "(traçado aproximado)" e `displayLengthM` 687 | código | DES-0005, DES-0007 | open |
| REQ-FEAT-0002-01, -04 a -11, -14, -19; REQ-FEAT-0003-01 a -07, -16; REQ-FEAT-0004-01 a -03; REQ-FEAT-0005-01 a -03, -20; REQ-FEAT-0006-09 | arquivo de pista da Kart Park `trackVersion` 2 gerado da réplica, sem suavização, 7,0 m, setores perto de 204,9 / 354,9 / 534,7 m em retas, barreira entre ≈ 369–406 m e ≈ 595–624 m, 22 zebras sem cruzar a largada | não existe `src/tracks/kart-park-v2.json` nem `tracks/sources/kart-park-replica.json`; `scripts/trackPrep.ts:12-21` só tem as constantes da versão 1 (suavização de 12 m, 687,5 m, setores 201,6 / 350,3 / 529,9 m, trechos 371–414 e 580–615 m) e lê só a origem `kartle-pista` sem `elementos` | código | DES-0010, DM-0001, ADR-0008 | open |
| REQ-FEAT-0002-01, -04 a -11, -19; REQ-FEAT-0003-01 a -05, -16; REQ-FEAT-0004-01, -02; REQ-FEAT-0005-01, -02, -20 (verificações) | V01 a V20 de RULE-0002 2.0.0 contra a réplica | `scripts/trackChecks.ts:11-13` tem só V01 a V18; `:16-17`, `:21`, `:27`, `:31-34` fixam 0,30 m, 680,625–694,375 m, os setores e os trechos da versão 1, 34 zebras, 684 pontos de origem, larguras de 4,4 a 10,8 m e `trackVersion` 1 | código | DES-0011 | open |
| REQ-FEAT-0002-17, -18 | a versão 2 publicada como arquivo novo, com o resumo registrado | `tracks/registry.json:3-61` tem só a entrada `kart-park` 1; `scripts/track-pipeline.ts:24-26` conhece só a origem da versão 1, e `:44`, `:61` montam a origem por `trackId`, sem a versão | código | DES-0010, DES-0011, DM-0002 | open |
| REQ-FEAT-0002-12, -13; REQ-FEAT-0004-08; REQ-FEAT-0005-04; REQ-FEAT-0003-08, -10, -11, -13, -15; REQ-FEAT-0008-01 a -24 (na versão 2) | simulação, volta e desenho com o acabamento sobre o traçado da versão 2 | o código é independente do traçado (`src/trackGeometry.ts`, `src/physics.ts`, `src/lap.ts`, `src/trackScene.ts` não citam versão), mas a pista carregada é a versão 1 (`src/main.ts:13`); nenhuma mudança própria além da linha de REQ-FEAT-0001-15 | código | DES-0007 (importação) | open |
| REQ-FEAT-0008-25, -26, -27 (NFR-0013 2.0.0) | a mesma sequência na versão 2 dá a mesma volta com e sem o acabamento desenhado | `tests/pista-kart-park-determinism.test.ts:72` compara só com `kartParkRev1Trace.json`, sobre a versão 1; não há execução com e sem o acabamento | testes | DES-0006 e a estratégia de testes | open |
| REQ-FEAT-0001-15, -16; REQ-FEAT-0002-*, REQ-FEAT-0003-*, REQ-FEAT-0005-01, -02, -20; REQ-FEAT-0006-07, -08; REQ-FEAT-0008-01 (verificações em `npm test`) | as provas desta feature sobre a versão 2 | `tests/fixtures/kartParkFiles.ts:29-30` lê `kart-park-v1.json` e a origem da versão 1; `tests/pista-kart-park-session.test.ts:69` espera `trackVersion` 1 e `:210` `TRACK_DATA_UNREADABLE` para outro `trackId`; `:225-230` e `tests/pista-kart-park-screens.test.ts:66-79` esperam "traçado aproximado" e 687; `tests/pista-kart-park-track-file.test.ts:72`, `:248-263`, `:287`, `:326` afirmam 687,5 m, a curva 4, 34 zebras e `trackVersion` 1; `tests/pista-kart-park-scene.test.ts:202` espera 684 segmentos; `tests/pista-kart-park-layering.test.ts:64-66` e `tests/pista-kart-park-screens.test.ts:107` esperam a importação da versão 1; `tests/pista-kart-park-lap.test.ts:173-187` prova o atalho da curva 4, critério retirado | testes | estratégia de testes | open |

## Satisfeitas hoje e mantidas pelo projeto

- REQ-FEAT-0002-20, -21 (NFR-0014 2.0.0): `src/tracks/kart-park-v1.json` existe, com `trackVersion` 1, e o seu
  SHA-256 é o registrado (`tracks/registry.json:8`, `04ce5e51…f057b1`), afirmado literalmente por
  `tests/pista-kart-park-publication.test.ts:167-172`. A revisão 3 o mantém (DES-0010, DES-0011, ADR-0008).
- REQ-FEAT-0002-02, -15, -16 (esquema 3, leitura da versão 2, versão 3 sem linha central `UNREADABLE`):
  `src/trackData.ts`, sem mudança na revisão 3 (DES-0001).
- REQ-FEAT-0004-04 a -07, REQ-FEAT-0005-05 a -19, REQ-FEAT-0007-01 a -11, -13 (com a entrada `PRODUCTION`
  exigindo `esriDecisionRef` para qualquer versão, `scripts/track-pipeline.ts:151-161`): independentes do
  traçado e entregues na revisão 2; a revisão 3 não os altera (DES-0003, DES-0004, DES-0006, DES-0009, DES-0012).
- Regras `-text` de `.gitattributes` para os arquivos de pista com resumo registrado: `.gitattributes:5-7`
  já cobrem `tracks/sources/*.json`, `src/tracks/*.json` e `tracks/registry.json`, inclusive os arquivos novos da
  revisão 3; o projeto só acrescenta a prova em `npm test` (DES-0011).

## Resolvidas

As 16 linhas abertas até a versão 1.2.0 deste registro, presas à árvore do commit `ac84352`, foram fechadas
pelas entregas de código e de testes das revisões 1 e 2 do seed, validadas em `code-validation-20261103-2004` e
`test-validation-20261104-1432` (SUCCESS) e presentes no commit `281b617`: leitor da versão de esquema 3
(DES-0001); arquivo da Kart Park versão 1, preparo, verificações e registro (DES-0010, DES-0011); catálogo,
seletor e sessão de treino (DES-0005, DES-0007); superfície `curb`, aderência, `getTrackContact` e barreira
(DES-0003); corte pela borda da pista e reposicionamento (DES-0004); desenho, taxa de quadros e acabamento
(DES-0008); retorno da zebra (DES-0009); crédito OSM nas duas telas e no painel do resultado da volta do treino
(DES-0007, ADR-0007); provas em `npm test` e leitura do fim de cada volta pelo crescimento de `listLapResults`
(DES-0006, estratégia de testes); bloqueio de produção na promoção (DES-0011, DES-0012, ADR-0005). A linha da
ordem de entrega (REQ-FEAT-0007-12) sai com a retirada do requisito na revisão 3.
