---
stage: req
feature: modelo-kart-01
verdict: FAIL
generated: 2026-10-30T13:52:31Z
counts: {blocker: 0, error: 1, warning: 0, info: 0, divergence: 0}
seed: {revision: 4, digest: 4e9bfbba6294}
upstream: {stage: seed, version: n/a}
feedbacks: []
population: {previous: req-validation-20261030-0234.md, reissued: [], moved: [01-context.md (1.4.1 -> 1.5.0), 02-glossary.md (-> 1.5.0), 97-changelog.md (-> 1.6.0), stories/US-0005-efeitos-presos-ao-kart.md (2.0.1 -> 2.1.0)], sampled: [stories/US-0004-jogo-nao-fica-mais-lento.md, nfr/NFR-0007-posicoes-das-rodas-da-simulacao.md], upstream-moved: [SEED.md (revision 3 -> 4), DOMAIN.md (entrada 2026-10-30, DOMAIN/DEC-09)]}
ignored: a justificativa do gerador registrada em `97-changelog.md` (rodada 8, "Leituras registradas" e "Itens recusados, com motivo") chegou a este validador pelo próprio artefato e não foi usada no veredito; nenhuma outra razão de escrita foi recebida
---

# Validação de requisitos — modelo-kart-01

## Issues

### ISSUE-01
- severity: error
- check: R3
- file: stories/US-0005-efeitos-presos-ao-kart.md
- location: AC-US-0005-06 (linhas 57-60) contra o caso anormal "Pausa" (linhas 98-99)
- finding: AC-06 exige um trecho novo de marca sob cada pneu traseiro "em cada quadro" em corrida com a volta em andamento, velocidade informada > 6 m/s e derrapagem lateral informada > 0,055 rad; em pausa a volta continua em andamento (glossário, "Volta em andamento"; "Em corrida" não termina na pausa) e a simulação continua informando a velocidade e a derrapagem do último estado, então um kart pausado escorregando satisfaz as três condições e AC-06 exige marca nova, enquanto o caso "Pausa" da mesma história diz que nenhum trecho novo é desenhado; o mesmo vale para todo quadro exibido em que a simulação não avançou um passo. Observação que decidiria: pausar com o kart a > 6 m/s e derrapagem > 0,055 rad e olhar a tela — a história dá os dois veredictos opostos.
- expected: AC-US-0005-06 restrito aos quadros em que a simulação avançou (fora da pausa), e a pausa (simulação sem avançar) acrescentada às condições de ausência de AC-US-0005-07, de modo que o caso "Pausa" cite um critério; derivável de `SEED/RD-01` (a renderização mostra o estado da simulação e não decide nada) e do próprio caso anormal.

## Divergences

None.

## Coverage

- Itens do seed (`revision: 4`) e de `DOMAIN.md`: 35, 35 cobertos e 0 descobertos (US-1 a US-5, RD-01 a RD-05, NF-01 a NF-04, RE-01 a RE-03, IM-I2, IM-I8, IM-I9, IM-I10, FE-01 a FE-04, DEC-00 a DEC-09). O critério novo de `SEED/US-5` e `DOMAIN/DEC-09` cobertos por AC-US-0005-06 e AC-US-0005-07.
- Itens do conjunto sem fonte no seed: 0.
- Fora do escopo de `01-context.md`: as quatro entradas do seed, sem acréscimo nem falta.
