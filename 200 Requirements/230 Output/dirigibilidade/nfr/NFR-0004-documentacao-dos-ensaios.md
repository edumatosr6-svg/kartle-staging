---
id: NFR-0004
title: Documentação dos ensaios
feature: dirigibilidade
stage: req
status: validated
version: 4.2.0
sources: [SEED/NF-04, SEED/RD-06, SEED/IM-I9, DOMAIN/REF-02, DOMAIN/REF-03, DOMAIN/DEC-15, DOMAIN/DEC-16]
---

# NFR-0004 — Documentação dos ensaios

| Requisito | Limite mensurável | Como é observado | Canal | Fonte |
|---|---|---|---|---|
| Cada mudança de parâmetro do acerto Arcade assistido registra os parâmetros e os resultados dos ensaios em `docs/physics.md`, ao lado da linha de base | 100 % dos ensaios citados nos critérios de US-0001 a US-0005 (resposta do volante com o modo de manter a velocidade em 50 km/h, a faixa de velocidade observada e a janela de estabilização do regime; raio da trajetória na pista de teste aberta 3 s depois da partida, nas duas condições com acelerador cheio, com a janela de medição do raio; giro em até 2 s sem acelerador; recuperação da traseira; volta do piloto de teste na pista sintética, com tempo, estados de aderência e derrapagem lateral; comparação com e sem o comando de drift; maior velocidade observada; 0–60 km/h; velocidade estabilizada; grama; parede; custo por passo) com ambiente de ensaio (pista de teste ou pista sintética), parâmetros, resultado medido com unidade e data, para a linha de base e para o novo acerto | Leitura de `docs/physics.md`: uma entrada datada por mudança, com os valores que a saída de `npm test`, do bench de física e de `npm run bench:handling` reportam, com o ambiente de cada ensaio (`SEED/RD-06`, `DOMAIN/REF-03`) e com a versão de acerto a que cada entrada se refere (os limites em vigor na revisão 5 do seed — acerto C, `DOMAIN/DEC-15`, e giro de pelo menos 180° em até 2 s sem acelerador, `DOMAIN/DEC-16` — registrados ao lado dos da linha de base) | nenhum (documentação) | `SEED/NF-04` (I9), `SEED/RD-06`, `SEED/IM-I9`, `DOMAIN/DEC-15`, `DOMAIN/DEC-16` |
