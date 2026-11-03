---
stage: req
feature: pista-kart-park
verdict: SUCCESS
generated: 2026-11-03T19:00:00Z
counts: {blocker: 0, error: 0, warning: 0, info: 1, divergence: 0}
seed: {revision: 2, digest: 49d733298158}
upstream: {stage: seed, version: n/a}
feedbacks: []
population: os 12 issues de req-validation-20261103-1854.md; os arquivos com versão movida depois dele (01-context.md, 02-glossary.md, 97-changelog.md, 00-index.md, 99-traceability.md, US-0002, US-0004, US-0005, US-0007, NFR-0011); amostra de 2 arquivos intocados, sorteada (US-0003, NFR-0014).
isolation: 97-changelog.md traz o raciocínio do gerador ("Decisões do autor para esta execução", "Itens recusados"); foi lido como artefato e não pesou em nenhum julgamento.
closed: ISSUE-01 a ISSUE-10 e ISSUE-12 de req-validation-20261103-1854.md (NFR-0011 e 01-context.md citam só SEED/RE-02; "Borda da pista" no glossário 1.1.1; AC-US-0004-05 diz referencial e instante; AC-US-0005-02 mede na linha central original; AC-US-0002-05 usa o ponto de mesmo índice; AC-US-0007-04/17, 08/18/19, 13/20 e 15/21 separados; AC-US-0007-14 observado na cena desenhada).
---

# Validação de requisitos — pista-kart-park

## Issues

### ISSUE-01
- severity: info
- check: R3
- file: stories/US-0007-acabamento-visual.md
- location: AC-US-0007-20
- finding: Continua do relatório 20261103-1854 (ISSUE-11), sem mudança. O seed diz "difere ... entre 8 % e 20 % em luminância" e não diz qual luminância nem se a porcentagem é relativa ou em pontos; o critério escolhe a luminância relativa da WCAG 2 e a diferença como fração do valor de `#68865b`. `DOMAIN.md` não fixa essa leitura. O critério é decidível como está escrito: medir a luminância relativa WCAG 2 de cada tom e comparar com 0,166–0,191 ou 0,224–0,249.
- expected: O autor fixa em `DOMAIN.md` qual medida de luminância vale e como se lê a porcentagem; o critério cita essa decisão.

## Divergences

Nenhuma.

## Coverage

- Itens do seed: 63 cobertos, 0 descobertos (SEED/US-1 a US-7, MED, RD-01 a RD-13, NF-01 a NF-06, RE-01 a RE-06, IM-I1, IM-I2, IM-I3I5, IM-I6, IM-I8, IM-I10, RI-01 a RI-04, FE-01 a FE-08, DOMAIN/DEC-01 a DEC-12). A lista Fora do escopo de `01-context.md` bate com a do seed.
- Itens do conjunto sem fonte no seed: 0.
