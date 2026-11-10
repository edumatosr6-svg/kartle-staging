---
stage: req
feature: apresentacao-e-som
verdict: SUCCESS
generated: 2026-11-10T16:53:58Z
counts: {blocker: 0, error: 0, warning: 1, info: 1, divergence: 0}
seed: {revision: 2, digest: e7a828ada2d2}
upstream: {stage: seed, version: n/a}
feedbacks: []
population: primeira validação do conjunto (nenhum relatório anterior em reports/req-validation/); os 18 arquivos foram lidos e R4 percorreu o seed da revisão 2 e `DOMAIN.md` inteiros.
isolation: 97-changelog.md traz o raciocínio do gerador ("O que mudou", "Itens recusados ou não resolvidos"); foi lido como artefato e não pesou em nenhum julgamento. O chamador não passou justificativa.
closed: nenhum (sem relatório anterior).
---

# Validação de requisitos — apresentacao-e-som

## Issues

### ISSUE-01
- severity: warning
- check: R4
- file: 01-context.md
- location: seção "Fora do escopo (do seed)", último item (linha 167)
- finding: A lista traz "Canal `remote-wheel` (pós-MVP, I10)", que não está na seção Fora do escopo do seed (7 itens); a lista do contexto tem 8 e o título a declara "do seed". Os outros 7 itens conferem com o seed, um a um.
- expected: A lista sob "Fora do escopo (do seed)" traz só os 7 itens do seed; o canal `remote-wheel` fica onde já está, em "Atores e canais" (linha 53), citado a I10, ou vem separado da lista e marcado como vindo das diretivas (D-REQ-06), não do seed.

### ISSUE-02
- severity: info
- check: R3
- file: stories/US-0003-som-do-motor.md
- location: AC-US-0003-10
- finding: Critério posto em dúvida quanto à decidibilidade, porque o tom do motor varia com a velocidade (AC-US-0003-02) e a saída de áudio não é idêntica ao arquivo. Decidível como escrito: gravar a saída de áudio do jogo com o som ligado e uma volta em andamento e comparar com `docs/sfx/engine-loop.mp3` — a saída é a gravação (mesmo timbre, deslocada em tom) e não contém o tom sintetizado anterior. O mesmo vale para AC-US-0004-06 com `docs/sfx/tire-screech.mp3`.
- expected: Nenhuma mudança exigida. O FSpec pode fixar a velocidade de referência em que a comparação é feita.

## Divergences

Nenhuma.

## Coverage

Itens do seed e de `DOMAIN.md`: 32 cobertos, 0 descobertos — 4 histórias (US-1 a US-4, com os 16 critérios), 3 regras de domínio, 5 requisitos não funcionais, 4 restrições, 1 impacto no domínio (I2), 3 pontos de Riscos e incógnitas, 7 itens de Fora do escopo, visão geral e contexto, 3 decisões de `DOMAIN.md`.

Itens do conjunto sem fonte no seed: 1 — o item "Canal `remote-wheel`" da lista de Fora do escopo de `01-context.md` (ISSUE-01; fonte nas diretivas, I10).
