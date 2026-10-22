---
stage: req
feature: modelo-kart-01
verdict: FAIL
generated: 2026-10-22T16:57:00Z
counts: {blocker: 0, error: 2, warning: 0, info: 0, divergence: 0}
seed: {revision: 1, digest: ef2fe14c9440}
upstream: {stage: seed, version: n/a}
feedbacks: []
population: {previous: req-validation-20261022-1431.md, reissued: [], moved: [], sampled: [nfr/NFR-0006-simulacao-e-validacao-inalteradas.md, 98-divergences.md]}
---

# Validação de requisitos — modelo-kart-01

## Issues

### ISSUE-01
- severity: error
- check: R4
- file: 01-context.md
- location: ## Itens do seed e decisões de domínio (chave de rastreabilidade), tabela de rótulos; linhas 28-30 ("fecham todos os pontos em aberto do seed (01 a 05)")
- finding: A decisão de `DOMAIN.md` de 2026-10-22 "Câmera depois do fim da volta" (registrada após parada do F-Spec) não tem rótulo na chave e não é coberta por nenhuma história, critério ou NFR do conjunto: nada no conjunto diz o que a câmera faz quando a volta termina, válida ou invalidada (inclusive por reposicionamento), e o painel de resultado aparece.
- expected: A chave ganha o rótulo `DOMAIN/DEC-06` com o texto da decisão; US-0003 o cita em `sources:` e ganha um critério observável na tela: do fim da volta, válida ou invalidada (inclusive por reposicionamento), com o painel de resultado exibido, a câmera continua na pose de corrida (critérios 01 a 03) em todos os quadros até a próxima visão geral da pista, e a visão geral existe só antes da contagem regressiva; a tabela "Decisões de domínio aplicadas" lista o rótulo.

### ISSUE-02
- severity: error
- check: R4
- file: 02-glossary.md
- location: termo "Em corrida"
- finding: O termo é definido como "Do sinal verde em diante, enquanto o Jogador pilota" e não diz onde termina; `DOMAIN.md` (2026-10-22, "Câmera depois do fim da volta") fixa que, para a câmera, "em corrida" vai do sinal verde até a próxima visão geral, sem terminar em `ENDED`, e todos os critérios de US-0003 prefixados "Em corrida" dependem desse limite nos quadros depois do fim da volta, com o painel de resultado exibido.
- expected: O termo diz que, para a câmera, "em corrida" vai do sinal verde até a próxima visão geral da pista, sem terminar quando a volta acaba nem quando o painel de resultado aparece, citando `DOMAIN/DEC-06`.

## Divergences

None.

## Coverage

- Itens do seed: 32, 31 cobertos e 1 descoberto: decisão de `DOMAIN.md` de 2026-10-22 "Câmera depois do fim da volta" (ISSUE-01, ISSUE-02). Cobertos: US-1 a US-5, RD-01 a RD-05, NF-01 a NF-04, RE-01 a RE-03, IM-I2, IM-I8, IM-I9, IM-I10, FE-01 a FE-04, DEC-00 a DEC-05.
- Itens do conjunto sem fonte no seed: 0.
