---
stage: req
feature: modelo-kart-01
verdict: SUCCESS
generated: 2026-10-22T17:03:05Z
counts: {blocker: 0, error: 0, warning: 0, info: 1, divergence: 0}
seed: {revision: 1, digest: ef2fe14c9440}
upstream: {stage: seed, version: n/a}
feedbacks: []
population: {previous: req-validation-20261022-1657.md, reissued: [], moved: [01-context.md, 02-glossary.md, 97-changelog.md, stories/US-0003-camera-atras-e-perto-do-kart.md], sampled: [nfr/NFR-0002-download-inicial.md, stories/US-0002-kart-reage-aos-comandos.md]}
ignored: a justificativa do gerador registrada em `97-changelog.md` (rodadas 1 a 3: ordem do dono do produto, argumento de §16) chegou a este validador pelo próprio artefato e não foi usada no veredito
---

# Validação de requisitos — modelo-kart-01

## Issues

### ISSUE-01
- severity: info
- check: R3
- file: stories/US-0003-camera-atras-e-perto-do-kart.md
- location: AC-US-0003-13
- finding: Critério em dúvida quanto à atomicidade ("na pose de corrida" e "sem voltar à visão geral"); decidível na tela: do quadro de `ENDED` até o quadro anterior à próxima visão geral, a câmera lida em cada quadro está a 1,38 m do chão, 3,05 m atrás da posição do kart e mira 3,2 m à frente a 0,30 m; "sem voltar à visão geral" é consequência dessa pose, não um segundo comportamento.
- expected: Nenhuma alteração.

## Divergences

None.

## Coverage

- Itens do seed: 32, 32 cobertos e 0 descobertos. Cobertos: US-1 a US-5, RD-01 a RD-05, NF-01 a NF-04, RE-01 a RE-03, IM-I2, IM-I8, IM-I9, IM-I10, FE-01 a FE-04, DEC-00 a DEC-06.
- Itens do conjunto sem fonte no seed: 0.
- Issues do relatório anterior: ISSUE-01 (R4, `01-context.md`, rótulo `DOMAIN/DEC-06`) fechada — rótulo na chave, tabela "Decisões de domínio aplicadas" e AC-US-0003-13 presentes; ISSUE-02 (R4, `02-glossary.md`, "Em corrida") fechada — termo vai do sinal verde até a próxima visão geral, sem terminar em `ENDED` nem com o painel de resultado, citando `DOMAIN/DEC-06`.
