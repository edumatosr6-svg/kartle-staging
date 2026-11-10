---
id: NFR-0010
title: Produção condicionada à licença dos arquivos gerados por IA
feature: apresentacao-e-som
stage: req
status: validated
version: 1.0.0
sources: [SEED/RI-03, SEED/CTX, DOMAIN/DEC-03]
---

# NFR-0010 — Produção condicionada à licença dos arquivos gerados por IA

A capa, o ícone, o som do motor e o som de pneu foram gerados por IA (Higgsfield) em 2026-11-10
(`SEED/CTX`). A dúvida sobre o plano usado permitir uso num jogo publicado bloqueia **só a promoção para
produção**: não bloqueia nenhuma etapa de especificação nem de código, e staging pode usar os arquivos
(`SEED/RI-03`, `DOMAIN/DEC-03`). Quem confirma é o dono do produto, nos termos do plano do Higgsfield. O
seed e `DOMAIN.md` não dizem o que muda se os termos não permitirem o uso; este conjunto não escolhe
essa resposta.

| Requisito | Limite mensurável | Como é observado | Canal | Fonte |
|---|---|---|---|---|
| Enquanto o dono do produto não registrar a confirmação da licença, os arquivos gerados por IA desta feature ficam só em staging | 0 promoções para produção com algum dos 4 arquivos (capa, ícone, som do motor, som de pneu) antes de a confirmação estar registrada em `DOMAIN.md` | Registro de liberação da etapa de deploy comparado com a data da confirmação em `DOMAIN.md` | `web-desktop`, `web-mobile`, link compartilhado | `SEED/RI-03`, `DOMAIN/DEC-03` |
