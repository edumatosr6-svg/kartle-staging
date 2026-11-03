---
id: NFR-0014
title: Arquivo da pista inalterado pelo acabamento
feature: pista-kart-park
stage: req
status: validated
version: 1.0.0
sources: [SEED/RE-05, SEED/IM-I3I5]
---

# NFR-0014 — Arquivo da pista inalterado pelo acabamento

| Requisito | Limite mensurável | Como é observado | Canal | Fonte |
|---|---|---|---|---|
| O arquivo publicado da Kart Park continua byte a byte igual ao de antes da revisão 2 | 0 bytes diferentes; o mesmo resumo criptográfico registrado na publicação da versão 1 | Comparação do resumo criptográfico do arquivo de pista publicado depois da revisão 2 com o registrado na publicação da versão 1 | nenhum (dado) | `SEED/RE-05` |
| A versão da Kart Park continua a mesma | `trackVersion` 1 no arquivo de pista publicado depois da revisão 2 | Leitura do `trackVersion` no arquivo de pista publicado da Kart Park | nenhum (dado) | `SEED/RE-05`, `SEED/IM-I3I5` (I3, I5) |
