---
stage: req
feature: modelo-kart-01
verdict: FAIL
generated: 2026-10-22T19:05:00Z
counts: {blocker: 0, error: 3, warning: 0, info: 0, divergence: 0}
seed: {revision: 1, digest: ef2fe14c9440}
upstream: {stage: seed, version: n/a}
feedbacks: []
population: {previous: req-validation-20261022-1703.md, reissued: [], moved: [], sampled: [stories/US-0004-jogo-nao-fica-mais-lento.md, stories/US-0005-efeitos-presos-ao-kart.md], upstream-moved: [DOMAIN.md (entrada "Correção da decisão da câmera", 2026-10-22, posterior ao relatório anterior), SCOPE-BACKLOG.md (novo)]}
ignored: a justificativa do gerador registrada em `97-changelog.md` (rodadas 1 a 3) chegou a este validador pelo próprio artefato e não foi usada no veredito; nenhum gerador correu nesta rodada (phase log: `setup`, `1-req-validator`)
---

# Validação de requisitos — modelo-kart-01

## Issues

### ISSUE-01
- severity: error
- check: R4
- file: 01-context.md
- location: ## Itens do seed e decisões de domínio (chave de rastreabilidade), linha `DOMAIN/DEC-06`; linhas 28-31 ("uma sexta decisão da mesma data"); ## Decisões de domínio aplicadas
- finding: O rótulo `DOMAIN/DEC-06` reproduz "e o kart continua pilotável", frase que a entrada de `DOMAIN.md` de 2026-10-22 "Correção da decisão da câmera" declara inválida (ao fim da volta, `ENDED`, a simulação para e o kart congela, como hoje; a decisão descreve só a câmera); a correção não tem rótulo na chave, não aparece em "Decisões de domínio aplicadas" e nenhum arquivo do conjunto a cita.
- expected: A chave carrega a correção — no texto de `DOMAIN/DEC-06` ou como rótulo próprio `DOMAIN/DEC-07` — dizendo que ao fim da volta (`ENDED`) a simulação para e o kart congela como hoje (invariante INV-1 de `race-lap-validation`), que a decisão descreve só a câmera (atrás do piloto, na pose de corrida, com o kart parado, até a próxima visão geral) e que nada muda em `race-lap-validation`; as linhas 28-31 contam a correção; "Decisões de domínio aplicadas" lista o rótulo com US-0003 e o termo "Em corrida".

### ISSUE-02
- severity: error
- check: R4
- file: 02-glossary.md
- location: termo "Em corrida"; termo "Fim da volta (`ENDED`)"
- finding: "Em corrida" diz "enquanto o Jogador pilota" e "o kart continua pilotável" depois do fim da volta, contradizendo a correção de `DOMAIN.md` (2026-10-22): depois de `ENDED` a simulação para e o kart congela, como hoje; "Fim da volta (`ENDED`)" não diz que a simulação para.
- expected: "Em corrida" vai do sinal verde até a próxima visão geral da pista; depois do fim da volta (`ENDED`), com o painel de resultado exibido, a simulação está parada e o kart congelado como hoje, e só a câmera continua na pose de corrida em relação ao kart parado, citando o rótulo da correção; "Fim da volta (`ENDED`)" diz que a simulação para e o kart congela (INV-1 de `race-lap-validation`), sem mudança nesta feature.

### ISSUE-03
- severity: error
- check: R4
- file: stories/US-0003-camera-atras-e-perto-do-kart.md
- location: ## Casos anormais, caso "Fim da volta, válida ou invalidada, com o painel de resultado exibido"; ## Fontes, item `DOMAIN/DEC-06`
- finding: O caso anormal afirma "o kart continua pilotável, e a câmera continua acompanhando o rumo sem corte (critério 07)", frase que a correção de `DOMAIN.md` (2026-10-22) retira: ao fim da volta a simulação para e o kart congela; a seção Fontes cita `DOMAIN/DEC-06` sem a correção.
- expected: O caso anormal diz que, no quadro em que a volta termina e nos seguintes, a simulação está parada e o kart congelado como hoje, o painel de resultado aparece sobre a cena sem mover a câmera, e a câmera fica na pose de corrida em relação ao kart parado (critério 13) até a próxima visão geral; a seção Fontes cita o rótulo da correção definido em `01-context.md`, e `sources:` o inclui se o rótulo for próprio.

## Divergences

None.

## Coverage

- Itens do seed: 33, 32 cobertos e 1 descoberto: entrada de `DOMAIN.md` de 2026-10-22 "Correção da decisão da câmera" (ISSUE-01 a ISSUE-03). Cobertos: US-1 a US-5, RD-01 a RD-05, NF-01 a NF-04, RE-01 a RE-03, IM-I2, IM-I8, IM-I9, IM-I10, FE-01 a FE-04, DEC-00 a DEC-06.
- `SCOPE-BACKLOG.md` (novo, 1 linha): item dirigido ao changelog de D-Spec de `race-lap-validation`, "nenhuma mudança nele"; não é item de requisito desta feature e não exige feedback (§14) desta etapa.
- Itens do conjunto sem fonte no seed: 0.
- Issue do relatório anterior: ISSUE-01 (info, R3, US-0003, AC-US-0003-13) reverificada — critério inalterado (US-0003 em 1.2.0), decidível na tela como registrado; com o kart congelado depois de `ENDED` (correção de `DOMAIN.md`), a pose lida em cada quadro é fixa em relação ao kart parado; nenhuma alteração, não reemitida.
- Arquivos sorteados (US-0004, US-0005): R2, R3, R6 e R7 sem achado.
