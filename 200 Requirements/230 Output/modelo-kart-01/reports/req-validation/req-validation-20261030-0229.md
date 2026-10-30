---
stage: req
feature: modelo-kart-01
verdict: FAIL
generated: 2026-10-30T02:32:27Z
counts: {blocker: 0, error: 1, warning: 1, info: 1, divergence: 0}
seed: {revision: 3, digest: 20575ff0c316}
upstream: {stage: seed, version: n/a}
feedbacks: []
population: {previous: req-validation-20261022-1909.md, reissued: [], moved: [01-context.md, 02-glossary.md, 97-changelog.md, stories/US-0002-kart-reage-aos-comandos.md, stories/US-0003-camera-atras-e-perto-do-kart.md, stories/US-0005-efeitos-presos-ao-kart.md], sampled: [nfr/NFR-0002-download-inicial.md, nfr/NFR-0003-dependencias-de-execucao.md], upstream-moved: [SEED.md (revision 1 -> 3), DOMAIN.md (entradas de 2026-10-29 "Treino contínuo e fim do drift e do turbo" e "Sem efeito de turbo na câmera")]}
ignored: a justificativa do gerador registrada em `97-changelog.md` (rodadas 1 a 6, inclusive o pedido da rodada 6 de confirmar a autoria da entrada de `DOMAIN.md`) chegou a este validador pelo próprio artefato e não foi usada no veredito; nenhuma outra razão de escrita foi recebida
---

# Validação de requisitos — modelo-kart-01

## Issues

### ISSUE-01
- severity: error
- check: R4
- file: 01-context.md
- location: seção "Decisões de domínio aplicadas", linha `DOMAIN/DEC-06` (linha 111); `stories/US-0002-kart-reage-aos-comandos.md` e `stories/US-0005-efeitos-presos-ao-kart.md`, `sources:` e Fontes
- finding: A tabela diz que `DOMAIN/DEC-06` se aplica a US-0002 e US-0005 (caso anormal "Fim da volta oficial"), mas nenhuma das duas histórias cita `DOMAIN/DEC-06` em `sources:` nem em Fontes, e `99-traceability.md` não tem as linhas `DOMAIN/DEC-06 -> US-0002` nem `DOMAIN/DEC-06 -> US-0005`: o conjunto contradiz a própria matriz.
- expected: O contexto e a matriz dizem o mesmo: ou US-0002 e US-0005 citam `DOMAIN/DEC-06` em `sources:` e em Fontes (a matriz é regenerada com `--emit`), ou a linha `DOMAIN/DEC-06` de `01-context.md` deixa de nomear US-0002 e US-0005.

### ISSUE-02
- severity: warning
- check: R1
- file: 01-context.md
- location: seção "Decisões de domínio aplicadas", linhas 113-114
- finding: Uma linha em branco separa a linha `DOMAIN/DEC-08` do resto da tabela, então ela não é renderizada como linha da tabela e a tabela fica sem `DOMAIN/DEC-08`.
- expected: A linha `DOMAIN/DEC-08` vem logo depois da linha `DOMAIN/DEC-07`, sem linha em branco, dentro da mesma tabela.

### ISSUE-03
- severity: info
- check: R3
- file: stories/US-0005-efeitos-presos-ao-kart.md
- location: AC-US-0005-04, AC-US-0005-05
- finding: Critérios em dúvida quanto à decidibilidade ("em nenhum quadro ... qualquer que seja a combinação de comandos"); decidíveis em tela: numa volta gravada antes da largada e em corrida, aplicando cada comando de `web-desktop` e de `web-mobile`, inclusive os que antes acionavam o drift e o turbo, nenhum quadro mostra a indicação de drift junto às rodas traseiras (04) nem fumaça ou chama saindo do escapamento (05).
- expected: Nenhuma alteração.

## Divergences

None.

## Coverage

- Itens do seed (`revision: 3`): 35, 35 cobertos e 0 descobertos. Cobertos: US-1 a US-5 (US-3 com os dois critérios da revisão 3; US-5 com os dois critérios da revisão 2), RD-01 a RD-05, NF-01 a NF-04, RE-01 a RE-03, IM-I2, IM-I8, IM-I9, IM-I10, FE-01 a FE-04, DEC-00 a DEC-08 de `DOMAIN.md` (a correção de 2026-10-22 dentro de `DOMAIN/DEC-06`).
- Itens do conjunto sem fonte no seed: 0.
- Fora do escopo de `01-context.md`: as quatro entradas do seed, sem acréscimo nem falta.
- `SCOPE-BACKLOG.md` (1 linha): dirigida ao changelog de D-Spec de `race-lap-validation`; nenhum feedback (§14) desta etapa.
- Issue do relatório anterior: ISSUE-01 (info, R3, AC-US-0001-10) reverificada; critério inalterado e decidível como lá descrito; não reemitida.
