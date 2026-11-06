---
stage: req
feature: pista-kart-park
verdict: SUCCESS
generated: 2026-11-06T17:41:50Z
counts: {blocker: 0, error: 0, warning: 0, info: 1, divergence: 0}
seed: {revision: 3, digest: 1fe5243f7e36}
upstream: {stage: seed, version: n/a}
feedbacks: []
population: a ISSUE-01 de req-validation-20261103-1900.md; os arquivos com versão movida depois dele (01-context.md, 02-glossary.md, 97-changelog.md, US-0001 a US-0007, NFR-0001, NFR-0006, NFR-0012, NFR-0013, NFR-0014 novo, NFR-0011 retirado); amostra de 2 arquivos intocados, sorteada (NFR-0002, NFR-0004). R4 percorreu o seed da revisão 3 inteiro, porque a revisão do seed mudou.
isolation: 97-changelog.md traz o raciocínio do gerador ("Itens recusados ou lidos, com motivo"); foi lido como artefato e não pesou em nenhum julgamento.
closed: nenhum (ISSUE-01 de req-validation-20261103-1900.md continua, sem mudança).
---

# Validação de requisitos — pista-kart-park

## Issues

### ISSUE-01
- severity: info
- check: R3
- file: stories/US-0007-acabamento-visual.md
- location: AC-US-0007-20
- finding: Continua de req-validation-20261103-1900.md (ISSUE-01), sem mudança. O seed diz "difere ... entre 8 % e 20 % em luminância" e não diz qual luminância nem se a porcentagem é relativa ou em pontos; o critério escolhe a luminância relativa da WCAG 2 e a diferença como fração do valor de `#68865b`, e `DOMAIN.md` não fixa essa leitura. Decidível como escrito: medir a luminância relativa WCAG 2 de cada tom desenhado e comparar com a faixa de 8 % a 20 % em torno da de `#68865b`.
- expected: O autor fixa em `DOMAIN.md` qual medida de luminância vale e como se lê a porcentagem; o critério cita essa decisão.

## Divergences

Nenhuma.

## Coverage

- Itens do seed: 66 cobertos, 0 descobertos (SEED/US-1 a US-7, MED, RD-01 a RD-14, NF-01 a NF-06, RE-01, RE-03, RE-04, RE-06, RE-07, RE-08, IM-I1, IM-I2, IM-I3I5, IM-I6, IM-I8, IM-I10, RI-01 a RI-04, FE-01 a FE-09, DOMAIN/DEC-01 a DEC-13). A lista Fora do escopo de `01-context.md` bate com a do seed.
- Itens do conjunto sem fonte no seed: 0.
