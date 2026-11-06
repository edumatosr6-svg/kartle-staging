---
id: NFR-0006
title: Versão imutável da pista
feature: pista-kart-park
stage: req
status: validated
version: 2.0.0
sources: [SEED/RD-07, SEED/IM-I3I5, SEED/RE-07, DOMAIN/DEC-13]
---

# NFR-0006 — Versão imutável da pista

| Requisito | Limite mensurável | Como é observado | Canal | Fonte |
|---|---|---|---|---|
| A revisão 3 publica a Kart Park, com o traçado da réplica não oficial, como versão 2 | `trackVersion` 2 no arquivo de pista publicado da réplica, com o mesmo `trackId` da Kart Park | Leitura do `trackId` e do `trackVersion` no arquivo de pista publicado da réplica | nenhum (dado) | `SEED/IM-I3I5`, `SEED/RE-07` (I3, I5), `DOMAIN/DEC-13` |
| Uma versão publicada da Kart Park nunca muda | 0 bytes alterados no arquivo de uma versão depois de publicada | Comparação do resumo criptográfico do arquivo de cada versão publicada com o registrado na publicação | nenhum (dado) | `SEED/RD-07` (I3, I5) |
| Mudar a linha central, uma largura, uma zebra, a barreira, os setores ou os marcadores publica uma versão nova | 100 % dessas mudanças publicadas com `trackVersion` maior que o da versão anterior | Histórico dos arquivos de pista publicados: cada mudança de conteúdo corresponde a um `trackVersion` novo | nenhum (dado) | `SEED/IM-I3I5` (I3, I5) |
