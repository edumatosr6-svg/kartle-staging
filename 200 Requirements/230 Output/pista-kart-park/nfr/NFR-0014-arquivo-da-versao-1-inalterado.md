---
id: NFR-0014
title: Arquivo da versão 1 inalterado
feature: pista-kart-park
stage: req
status: validated
version: 2.0.0
sources: [SEED/RE-07, SEED/RD-07, SEED/IM-I3I5]
---

# NFR-0014 — Arquivo da versão 1 inalterado

A revisão 3 publica a réplica como `kart-park` versão 2 (NFR-0006). A versão 1 sai do seletor
(US-0001), mas o seu arquivo publicado continua no repositório, byte a byte igual (`SEED/RE-07`).

| Requisito | Limite mensurável | Como é observado | Canal | Fonte |
|---|---|---|---|---|
| O arquivo publicado da Kart Park versão 1 continua no repositório depois da revisão 3 | 1 arquivo de pista publicado com o `trackId` da Kart Park e `trackVersion` 1 | Listagem dos arquivos de pista publicados no repositório depois da revisão 3 | nenhum (dado) | `SEED/RE-07` |
| O arquivo publicado da Kart Park versão 1 continua byte a byte igual | 0 bytes diferentes; o mesmo resumo criptográfico registrado na publicação da versão 1 | Comparação do resumo criptográfico do arquivo da versão 1 depois da revisão 3 com o registrado na publicação da versão 1 | nenhum (dado) | `SEED/RE-07`, `SEED/RD-07`, `SEED/IM-I3I5` (I3, I5) |
