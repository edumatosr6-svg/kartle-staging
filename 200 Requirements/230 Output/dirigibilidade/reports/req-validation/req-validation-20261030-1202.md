---
stage: req
feature: dirigibilidade
verdict: SUCCESS
generated: 2026-10-30T12:03:23Z
counts: {blocker: 0, error: 0, warning: 0, info: 0, divergence: 0}
seed: {revision: 5, digest: 48feb6d51bf8}
feedbacks: []
population: "revalidação (§8) após a rodada 15, Mode B, sobre req-validation-20261030-1159.md: a issue anterior (ISSUE-01, AC-US-0005-05); os arquivos cuja versão mudou (stories/US-0005-jogo-continua-justo.md 3.2.0, nfr/NFR-0009-acerto-versionado.md 1.0.1, 97-changelog.md 4.3.0); dois arquivos intocados sorteados: nfr/NFR-0008-validacao-de-volta-inalterada.md e nfr/NFR-0004-documentacao-dos-ensaios.md. Referências: SEED.md rev 5, DOMAIN.md."
---

# Relatório de validação — dirigibilidade

## Issues

Nenhuma. ISSUE-01 de req-validation-20261030-1159.md fechada: AC-US-0005-05 observa só a tela e AC-US-0005-07 só o texto compartilhado; os casos anormais e NFR-0009 citam os dois.

## Divergences

None.

## Coverage

Seed items: 27 mapeados (5 histórias, 6 regras de domínio, 4 NFRs, 4 restrições, 4 impactos no domínio, 4 itens fora do escopo), 0 sem mapeamento; o terceiro critério de `SEED/US-5` coberto na tela (AC-US-0005-05) e no texto compartilhado (AC-US-0005-07). Set items with no seed source: 0.

## Contexto recebido fora do procedimento

A rodada 15 de `97-changelog.md` (lida para saber que arquivos mudaram de versão) carrega a justificativa do gerador; o status do git, as mensagens de commit e a memória do ambiente nomeiam o motivo das revisões. Nada disso entrou no julgamento. A raiz de código não foi lida.

Depois do veredito e da marcação de status, um `git diff --stat` só de leitura foi executado por engano sobre US-0001, contra a instrução de não usar git; não alterou nada nem entrou no julgamento.
