---
title: Divergências — pista Kart Park (estágio de código)
feature: pista-kart-park
stage: code
status: validated
version: 2.0.0
sources: []
---

# Divergências

Registro contra `300 Specs/330 D-Specs/Output/pista-kart-park/98-divergences.md` 2.0.0 (revisão 3 do seed; projeto validado em
`dspec-validation-20261106-1853`, commit `8b00b74`). A base do projeto é a árvore de `281b617`; as 16 linhas das revisões 1 e 2,
registradas até a versão 1.5.0 deste arquivo (commit `4e32270`), foram resolvidas pelas entregas validadas daquelas revisões e
saíram do registro do projeto na versão 2.0.0 dele. Abaixo, as 8 linhas que o projeto abriu para a revisão 3, na ordem dele, cada
uma `resolved` com o `arquivo:linha` desta rodada ou `open` com a etapa devedora. Caminhos relativos à raiz do repositório; as
medidas estão em `01-implementation.md` e nos registros por item.

| # | Requisito | O que exige | Etapa devedora | Item de projeto | Estado | Resolução |
|---|---|---|---|---|---|---|
| 1 | REQ-FEAT-0001-15, -16; API-0002 (`trackVersion`, `TRACK_VERSION_MISMATCH`) | Kart Park do seletor e da abertura na versão 2, conferida contra a entrada do catálogo; arquivo de outra pista ou versão termina `FAILED` com `TRACK_VERSION_MISMATCH` | código | DES-0005, DES-0007, ADR-0008 | resolved | `src/trainingSession.ts:10` (`trackVersion?` em `TrainingTrackOption`), `:14` (entrada `kart-park` com `trackVersion: 2`), `:37` (código na união do resultado), `:72-77` (outro `trackId` ou outra versão → `FAILED`, `TRACK_VERSION_MISMATCH`, `lap` `undefined`); `src/main.ts:13` (importa `./tracks/kart-park-v2.json?raw`), `:156` (`TRACK_SOURCES`), `:230` (aviso só com identificadores) |
| 2 | REQ-FEAT-0006-07, -08 | nome "Kart Park — São José dos Pinhais (réplica não oficial)" e "691 m" | código | DES-0005, DES-0007 | resolved | `src/trainingSession.ts:14` (`displayName` e `displayLengthM` 691); o rótulo das telas segue por `optionLabel`, sem texto novo |
| 3 | REQ-FEAT-0002-01, -04 a -11, -14, -19; REQ-FEAT-0003-01 a -07, -16; REQ-FEAT-0004-01 a -03; REQ-FEAT-0005-01 a -03, -20; REQ-FEAT-0006-09 | arquivo `trackVersion` 2 gerado da réplica, sem suavização, 7,0 m, setores em retas perto de 204,9 / 354,9 / 534,7 m, barreira entre ≈ 369–406 m e ≈ 595–624 m, 22 zebras sem cruzar a largada | código | DES-0010 2.1.0, DM-0001, ADR-0008 | resolved | `scripts/trackPrep.ts:421-436` (constantes `REPLICA_*`, `BARRIER_TRACK_CLEARANCE_M`, tipos), `:440-452` (`readReplicaTrack`), `:456-478` (`curbsWithWidths`), `:482-506` (`markerIndicesOf`), `:510-525` (guarda de 0,2 m), `:527-591` (`prepareReplicaTrack`, passos 1 a 10), `:285-392` (`buildBarriers`; amostragem por borda do passo 5 em `:317-346`, chamada `'EDGE'` em `:561`; a por pares da versão 1 intacta); `tracks/sources/kart-park-replica.json` (cópia byte a byte, SHA-256 `eba665b6…a24e`); `src/tracks/kart-park-v2.json` (36 585 bytes, SHA-256 `c79f14cb…c4d20a`: 690,674 m, 691 pontos de 7,0 m, limites nos pontos 205 / 355 / 535, 39 marcadores, 22 zebras, barreira de 292 vértices e 47,649 m) |
| 4 | REQ-FEAT-0002-01, -04 a -11, -19; REQ-FEAT-0003-01 a -05, -16; REQ-FEAT-0004-01, -02; REQ-FEAT-0005-01, -02, -20 (verificações) | V01 a V20 de RULE-0002 2.0.0 contra a réplica | código | DES-0011 2.0.1 | resolved | `scripts/trackChecks.ts:12-34` (V01 a V20, constantes da revisão 3), `:125-339` (`verifyTrackFile`), `:272-277` (`edgeSamples`, a amostragem única de DES-0010 passo 5, usada por V13 em `:280-294`), `:327-337` (V19, V20); `npm run track -- verify kart-park 2`: V01 a V20 `PASS`, `VERIFIED` |
| 5 | REQ-FEAT-0002-17, -18 | a versão 2 publicada como arquivo novo, com o resumo registrado | código | DES-0010, DES-0011, DM-0002 | resolved | `scripts/track-pipeline.ts:24-31` (`TRACK_ORIGINS` por `trackId` e `trackVersion`; `kart-park` 1 `frozen`), `:45-67` (`parseArgs`, recusa da versão 1 em `:53`), `:137-162` (`publish`); `tracks/registry.json`: entrada `kart-park` 2 `STAGING` com `sha256` igual ao do arquivo em disco (`c79f14cb…c4d20a`, 36 585 bytes), entrada 1 igual campo a campo, nenhuma promovida; `.gitattributes:5-7` (`-text`) cobre os três arquivos, `git hash-object` com e sem filtros iguais |
| 6 | REQ-FEAT-0002-12, -13; REQ-FEAT-0004-08; REQ-FEAT-0005-04; REQ-FEAT-0003-08, -10, -11, -13, -15; REQ-FEAT-0008-01 a -24 (na versão 2) | simulação, volta e desenho com o acabamento sobre o traçado da versão 2 | código | DES-0007 (importação) | resolved | `src/main.ts:13`, `:156`: a versão 2 é a pista carregada; `src/trackGeometry.ts`, `src/physics.ts`, `src/lap.ts` e `src/trackScene.ts` sem mudança. Barreira desenhada da versão 2 medida (DES-0008): 539 pilhas, 2 695 pneus, 71 148 triângulos; face a 0,0191 m (contato → face) e 0,0230 m (face → contato), limite 0,05 m; nenhum ponto de pneu fora da grama. A taxa de quadros nos aparelhos de referência é medição humana (estágio de testes) |
| 7 | REQ-FEAT-0008-25, -26, -27 (NFR-0013 2.0.0) | a mesma sequência na versão 2 dá a mesma volta com e sem o acabamento desenhado | testes | DES-0006 e a estratégia de testes | open | nenhuma mudança de código: o desenho não é lido pela simulação (`src/trackScene.ts` não é importado por módulo de simulação); a execução com e sem o acabamento sobre a versão 2 é do estágio de testes |
| 8 | REQ-FEAT-0001-15, -16; REQ-FEAT-0002-*, REQ-FEAT-0003-*, REQ-FEAT-0005-01, -02, -20; REQ-FEAT-0006-07, -08; REQ-FEAT-0008-01 (verificações em `npm test`) | as provas desta feature sobre a versão 2 | testes | estratégia de testes | open | nenhuma mudança de código. `npx tsx --test tests/*.test.ts`: 445/467; as 22 reprovações são provas presas à versão 1 que a migração planejada do projeto (changelog do D-Spec, rodada Mode A de 2026-11-06) leva à versão 2, listadas abaixo |

## Verificações desta feature reprovadas pela rodada (não editadas; estágio de testes)

Todas em `tests/pista-kart-park-*.test.ts`; a causa comum é a fixture `tests/fixtures/kartParkFiles.ts:29-30`, que lê
`kart-park-v1.json` e a origem da versão 1, ou uma afirmação literal da versão 1.

| Verificação | Causa |
|---|---|
| `CHK-TEST-0001-18` (`track-file.test.ts:341`), `CHK-TEST-0001-19` (`:351`) | `verifyTrackFile` passou a julgar V01 a V20 contra a réplica (RULE-0002 2.0.0); a verificação o aplica ao arquivo da versão 1 contra a origem antiga |
| `CHK-TEST-0006-03` (`determinism.test.ts:39`) | a sessão abre a versão 2; o traço comparado é o da versão 1 |
| `CHK-TEST-0007-01` a `-03`, `-05` a `-11` (`session.test.ts:30` a `:225`) | esperam `trackVersion` 1, a fonte da versão 1, `TRACK_DATA_UNREADABLE` para outro `trackId` (`TRACK_VERSION_MISMATCH` agora) e "traçado aproximado" / 687 m |
| `CHK-TEST-0009-05`, `-06`, `-08`, `-11`, `-12` (`screens.test.ts:66` a `:144`) | rótulo "traçado aproximado" e 687 m; fonte da versão 1 nas telas |
| `CHK-TEST-0011-02` (`layering.test.ts:58`) | espera `src/main.ts` importando `./tracks/kart-park-v1.json?raw` |
| `CHK-TEST-0012-02` (`publication.test.ts:60`) | a fixture lê o arquivo da versão 1, e a maior versão registrada é agora a 2 |
| `CHK-TEST-0012-05` (`publication.test.ts:126`) | executa `verify kart-park 1`, que DES-0010 2.1.0 recusa (versão congelada) |
| `CHK-TEST-0012-07` (`publication.test.ts:163`) | "a única entrada `kart-park` é a 1"; a migração planejada passa a "a entrada 1 intacta e a 2 acrescentada" (o resumo literal da versão 1 continua igual) |

Satisfeitas e mantidas, sem divergência: `src/tracks/kart-park-v1.json` com SHA-256 `04ce5e51…f057b1` e `trackVersion` 1, igual
à entrada 1 do registro (REQ-FEAT-0002-20, -21), e a reprodução dele pelo preparo congelado (`CHK-TEST-0012-03` verde);
`src/trackData.ts` sem mudança (REQ-FEAT-0002-02, -15, -16); simulação, retorno da zebra e promoção sem mudança (REQ-FEAT-0004-04 a
-07, REQ-FEAT-0005-05 a -19, REQ-FEAT-0007-01 a -11, -13).
