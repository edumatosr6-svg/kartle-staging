---
stage: req
feature: modelo-kart-01
verdict: SUCCESS
generated: 2026-10-22T19:09:28Z
counts: {blocker: 0, error: 0, warning: 0, info: 1, divergence: 0}
seed: {revision: 1, digest: ef2fe14c9440}
upstream: {stage: seed, version: n/a}
feedbacks: []
population: {previous: req-validation-20261022-1905.md, reissued: [], moved: [01-context.md, 02-glossary.md, 97-changelog.md, stories/US-0003-camera-atras-e-perto-do-kart.md], sampled: [stories/US-0001-kart-de-verdade-na-pista.md, nfr/NFR-0005-renderizacao-na-camada-de-aplicacao.md], upstream-moved: []}
ignored: a justificativa do gerador registrada em `97-changelog.md` (rodada 4: "como o dono do produto ordenou", argumento de §16, decisões "passadas a esta execução") chegou a este validador pelo próprio artefato e não foi usada no veredito; nenhuma outra razão de escrita foi recebida
---

# Validação de requisitos — modelo-kart-01

## Issues

### ISSUE-01
- severity: info
- check: R3
- file: stories/US-0001-kart-de-verdade-na-pista.md
- location: AC-US-0001-10
- finding: Critério em dúvida quanto à decidibilidade ("o kart do modelo montado usa a cor laranja Kartle `#FF6A13`" não nomeia a peça, porque o quarto critério de `SEED/US-1` também não a nomeia); decidível na saída de `npm test`: entre os materiais dos 15 grupos de peças do modelo montado, pelo menos um tem a cor `#FF6A13`.
- expected: Nenhuma alteração.

## Divergences

None.

## Coverage

- Itens do seed: 33, 33 cobertos e 0 descobertos. Cobertos: US-1 a US-5, RD-01 a RD-05, NF-01 a NF-04, RE-01 a RE-03, IM-I2, IM-I8, IM-I9, IM-I10, FE-01 a FE-04, DEC-00 a DEC-06 e a entrada de `DOMAIN.md` de 2026-10-22 "Correção da decisão da câmera" (incorporada ao rótulo `DOMAIN/DEC-06` de `01-context.md`, aos termos "Em corrida", "Fim da volta (`ENDED`)" e "Painel de resultado" de `02-glossary.md` e a US-0003).
- Itens do conjunto sem fonte no seed: 0.
- `SCOPE-BACKLOG.md` (1 linha): item dirigido ao changelog de D-Spec de `race-lap-validation`, "nenhuma mudança nele"; nenhum requisito de `race-lap-validation` muda, nenhum feedback (§14) desta etapa.
- Issues do relatório anterior: ISSUE-01 (R4, `01-context.md`, `DOMAIN/DEC-06`) fechada — rótulo diz que ao fim da volta a simulação para e o kart congela como hoje (INV-1 de `race-lap-validation`), que a decisão descreve só a câmera, que "o kart continua pilotável" não vale e que nada muda em `race-lap-validation`; linhas 27-35 contam a correção; "Decisões de domínio aplicadas" lista o rótulo com US-0003 e os três termos. ISSUE-02 (R4, `02-glossary.md`) fechada — "Em corrida" vai do sinal verde até a próxima visão geral e, depois de `ENDED`, com o painel exibido, diz simulação parada e kart congelado com só a câmera na pose de corrida; "Fim da volta (`ENDED`)" diz que a simulação para e o kart congela (INV-1), sem mudança nesta feature; "enquanto o Jogador pilota" e "continua pilotável" saíram. ISSUE-03 (R4, US-0003) fechada — caso anormal "Fim da volta" diz simulação parada e kart congelado como hoje, painel sobre a cena sem mover a câmera, câmera na pose de corrida em relação ao kart parado (critério 13) até a próxima visão geral; Fontes cita `DOMAIN/DEC-06` na redação corrigida; Canais, Pré-condições e "Reposicionamento" levam o mesmo fato.
- Arquivos movidos: `01-context.md` 1.2.0 (R4 fora do escopo = seed, R5 famílias, R6, R7 sem achado), `02-glossary.md` 1.2.0 (R2, R4, R7 sem achado), US-0003 1.2.1 (R2, R3 critérios 01 a 13 inalterados e decidíveis em tela, R4, R6, R7 sem achado; "pilotável" só em citação do texto invalidado), `97-changelog.md` 1.3.0 (R6, R7, R8 sem achado).
- Arquivos sorteados: US-0001 (R2, R3 — ISSUE-01 info —, R4, R6, R7 sem outro achado), NFR-0005 (R5 limiar 0 importações / 0 diferenças após N passos de `STEP`, observado na saída de `npm test`; R7 sem achado).
- R1: nenhum bloco mermaid no conjunto; feature igual à pasta do seed. R8: nenhuma linha em `98-divergences.md`.
