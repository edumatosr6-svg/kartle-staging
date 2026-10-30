---
stage: req
feature: dirigibilidade
verdict: FAIL
generated: 2026-10-30T12:01:15Z
counts: {blocker: 0, error: 1, warning: 0, info: 0, divergence: 0}
seed: {revision: 5, digest: 48feb6d51bf8}
feedbacks: []
population: "revalidação (§8) após a rodada 14, Mode B, sobre req-validation-20261030-0241.md: as 5 issues anteriores; os arquivos cuja versão mudou (US-0001 3.2.0, US-0002 4.1.1, US-0003 4.2.0, NFR-0004 4.2.0, NFR-0005 1.3.0, 01-context.md 4.2.0, 02-glossary.md 4.2.0, 97-changelog.md 4.2.0, só a rodada 14); dois arquivos intocados sorteados: nfr/NFR-0001-determinismo-preservado.md e stories/US-0005-jogo-continua-justo.md. Referências: SEED.md rev 5, DOMAIN.md, domain-directives.md."
---

# Relatório de validação — dirigibilidade

## Issues

### ISSUE-01
- severity: error
- check: R3
- file: stories/US-0005-jogo-continua-justo.md
- location: AC-US-0005-05
- finding: o critério junta dois pontos de observação distintos da lista do projeto — o estado da tela e o texto compartilhado ("apresentado na tela ou no texto compartilhado como comparável") —; é o mesmo defeito de atomicidade que a rodada anterior corrigiu em AC-US-0003-09.
- expected: dois critérios, um para a tela e outro para o texto compartilhado, cada um com o seu ponto de observação; o número 05 fica com a parte da tela e a parte do texto compartilhado recebe número novo (07), com os sites que citam o critério 05 (casos anormais) atualizados.


## Divergences

None.

## Coverage

Seed items: 27 mapeados (5 histórias, 6 regras de domínio, 4 NFRs, 4 restrições, 4 impactos no domínio, 4 itens fora do escopo), 0 sem mapeamento; `SEED/RE-01` coberto na tela (AC-US-0003-09) e no texto compartilhado (AC-US-0003-11). Lista "Fora do escopo" de `01-context.md` igual à do seed. Set items with no seed source: 0.

## Contexto recebido fora do procedimento

A rodada 14 de `97-changelog.md` (lida para saber que arquivos mudaram de versão) carrega a justificativa do gerador, inclusive uma "orientação do coordenador da rodada" sobre o ambiente do ensaio de US-0001; o status do git e as mensagens de commit do ambiente nomeiam o motivo das revisões. Nada disso entrou no julgamento. A raiz de código não foi lida.
