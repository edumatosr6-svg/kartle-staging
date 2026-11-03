---
stage: code
feature: pista-kart-park
verdict: SUCCESS
generated: 2026-11-03T20:04:00Z
counts: {blocker: 0, error: 0, warning: 1, info: 1, divergence: 3}
seed: {revision: 2, digest: 49d733298158}
upstream: {stage: dspec, validation: dspec-validation-20261103-1946, commit: f926815, status: validated, changed: "web/DES-0008 2.1.0"}
files_examined: 15
feedbacks: []
previous: "code-validation-20261030-1836.md (SUCCESS, rodada 4); esta é a primeira validação da rodada 5 (Mode A), não uma revalidação"
population: "mudança da rodada 5 inteira: git diff de src/trackScene.ts e src/main.ts sobre f926815; registros com version movida (01-implementation 1.5.0, 98-divergences 1.5.0, core/DES-0006 1.2.0, pipeline/DES-0011 1.2.0, web/DES-0008 2.0.0) e 97-changelog (editado); 00-index e 99-traceability do gate; referências lidas: src/trackGeometry.ts, src/physics.ts:6,13, src/track.ts:1, src/tracks/kart-park-v1.json (SHA-256), tracks/registry.json"
recomputed: "script próprio sobre a árvore de trabalho (buildTrackScene(kartParkGeometry())), sem a suíte: filhos grass, asphalt, edge-lines, curbs, barriers, start-line na ordem; n 684, edge-lines 2.740 vértices e 2.736 triângulos, largura perpendicular entre 0,099994 e 0,100006 m (float32), 0 vértices internos fora de asphalt (classifySurface), tiras fechadas (folga 0), maior virada das bordas 21,11°, menor segmento 0,1668 m; largura no ponto 0 5,03 m, 4 colunas de 1,1 m, folga 0,315 m por borda; zebras: só y 0,035 (cantos e0, e1) e 0,075 (o0, o1), 0 vértices fora; grama 1.600 vértices, 800 triângulos, 0 faixas com cor diferente de grassToneAt; luminância WCAG 2 0,2380 / 0,1794 contra 0,2075, distâncias 0,147 e 0,136; barreira 53,287 m, 382 vértices, 381 segmentos, 646 pilhas de 132 triângulos, topo 0,9 m, 0 vértices sem pilha, maior distância entre pilhas seguidas 0,1199 m; face desenhada (amostras a 0,002 m) a D entre 0,0780 e 0,1000 m, |D − 0,1| máx. 0,0220 m; fronteira de contato (82.484 amostras a 0,001 m) até a face máx. 0,0193 m, 2 amostras dentro de um polígono só no arredondamento float32 dos centros das instâncias (impossível no exato: todo centro está na poligonal e todo ponto de contato está a 0,1 m dela); todo vértice de pneu em grass, a no mínimo 0,410 m da borda da pista; SHA-256 de src/tracks/kart-park-v1.json 04ce5e51… igual ao registro"
---

# Relatório de validação de código — pista-kart-park (rodada 5, iteração 1)

## Summary

- `src/trackScene.ts` realiza DES-0008 2.1.0 símbolo a símbolo (constantes, `grassToneAt`, seis filhos, faixa de borda pela bissetriz, rampa da zebra, pilhas em cada vértice e a ≤ 0,12 m, só translação) e `src/main.ts:239` é a linha única do projeto; todas as medidas do projeto conferem no recálculo.
- Nenhum módulo de simulação, arquivo de pista ou registro tocado; `CHK-TEST-0010-03` e `-05` afirmam o desenho da revisão 1 e são do estágio de testes. Um aviso de manifesto. SUCCESS.

## Issues

### ISSUE-01
- severity: warning
- check: C1
- file: `400 Code/Output/pista-kart-park/97-changelog.md`
- location: front matter `:4-5`; seção nova `:238-260`
- finding: o registro ganhou a seção da rodada 5 e continua `status: validated`, `version: 1.4.0`, e `00-index.md` o lista como `validated` 1.4.0, enquanto os outros registros editados nesta rodada foram para `draft` com a versão movida; numa revalidação o arquivo ficaria fora da população por "version movida".
- expected: versão movida (1.5.0) e `status: draft` como os demais registros da rodada, com o índice regerado pelo gate.

### ISSUE-02
- severity: info
- check: C2
- file: `tests/pista-kart-park-scene.test.ts`
- location: `CHK-TEST-0010-03`, `CHK-TEST-0010-05`
- finding: as duas verificações afirmam uma caixa por segmento de barreira e quatro filhos (revisão 1); o código segue DES-0008 2.1.0 (pilhas de pneus, seis filhos), de modo que a reprovação não é defeito de código.
- expected: atualização pelo estágio de testes (test-strategy 1.3.0).

## Divergences

- Linha 12 (`open`): sem mudança nesta rodada.
- Linha 13 (`resolved (código); open (deploy)`): parte de deploy aberta; sem mudança nesta rodada.
- Linha 15 (`open`, estágio de testes): sem mudança nesta rodada.
- Linha 16 (`resolved`): conferida. `src/trackScene.ts:10-19`, `:33-60`, `:83-122`, `:146-147`, `:164-224`, `:249-254` e `src/main.ts:239` existem e fazem o que a linha exige (medidas em `recomputed`).

## Coverage

- Requisitos com código: REQ-FEAT-0008-01 a -29 (DES-0008, DES-0006, DES-0011), 29 de 29, cada um com linha em `99-traceability.md` e símbolo existente; REQ-FEAT-0002-13, REQ-FEAT-0004-08, REQ-FEAT-0005-04, REQ-FEAT-0007-01, -02 mantidos com os símbolos novos.
- Requisitos sem código: nenhum (a taxa de quadros de REQ-FEAT-0007-01, -02 é medição humana do estágio de testes, E2E-03 e E2E-05).
- Arquivos alterados e não registrados: nenhum (`git status`: só `src/trackScene.ts`, `src/main.ts` e o manifesto).
