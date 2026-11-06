---
id: FEAT-0007
title: Requisitos transversais da Kart Park
feature: pista-kart-park
stage: fspec
status: validated
version: 2.0.0
sources: [NFR-0002, NFR-0003, NFR-0004, NFR-0007, NFR-0008, NFR-0009, NFR-0010, NFR-0012]
---

# FEAT-0007 — Requisitos transversais da Kart Park

## Resumo

O que vale para a feature inteira e não pertence a uma história: a taxa de quadros na Kart Park, o
determinismo da volta e dos setores, o jogo sem servidor, as regras decididas na simulação e verificadas
sem a tela, o contrato de passo inalterado, a pista sintética como pista dos ensaios automáticos, nenhuma
dependência nova e a publicação condicionada à licença Esri, em qualquer versão da Kart Park.
NFR-0001, NFR-0005, NFR-0006 e NFR-0014 são realizados em [FEAT-0002](FEAT-0002-forma-largura-e-versao-do-arquivo-de-pista.md)
e [FEAT-0006](FEAT-0006-credito-nome-e-comprimento.md), e NFR-0013 em
[FEAT-0008](FEAT-0008-acabamento-visual.md), junto do que medem.

## Canais

`web-desktop` e `web-mobile`, salvo a taxa de quadros, que tem um limite por canal: 60 fps em notebook
(`web-desktop`) e 30 fps em celular intermediário (`web-mobile`). A publicação é de processo, sem canal.

## Requisitos

- REQ-FEAT-0007-01: O sistema SHALL sustentar 60 fps durante uma volta completa na Kart Park, com zebras,
  barreira e o acabamento de US-0007 (faixa de borda, relevo da zebra, barreira de pneus e tons de grama)
  na tela, em notebook entre os aparelhos de referência de RNF03, provado por teste registrado no
  aparelho nomeado (NFR-0002).
- REQ-FEAT-0007-02: O sistema SHALL sustentar 30 fps durante uma volta completa na Kart Park, com zebras,
  barreira e o acabamento de US-0007 na tela, em celular intermediário entre os aparelhos de referência de RNF03, provado por teste
  registrado no aparelho nomeado; uma execução em desktop não vale para celular (NFR-0002).
- REQ-FEAT-0007-03: O sistema SHALL dar, para a mesma sequência de `Input` a partir do mesmo estado inicial
  na Kart Park, o mesmo `lapMs`, idêntico ao milissegundo em todas as execuções repetidas (NFR-0003).
- REQ-FEAT-0007-04: O sistema SHALL dar, para a mesma sequência de `Input` a partir do mesmo estado inicial
  na Kart Park, os mesmos 4 valores de `sectorMs`, idênticos ao milissegundo e um a um, em todas as
  execuções repetidas (NFR-0003).
- REQ-FEAT-0007-05: O sistema SHALL fazer 0 requisições a outros serviços além da entrega dos arquivos do
  próprio jogo entre a escolha da Kart Park no seletor e o fim da volta, sem contar a navegação que o
  Jogador inicia ao acionar o link do crédito (NFR-0004).
- REQ-FEAT-0007-06: O sistema SHALL decidir na simulação, a partir do dado da pista, a superfície sob cada
  roda, a aderência na zebra, a zebra como pista, a colisão com a barreira, os setores, os marcadores e o
  corte, com a apresentação apenas desenhando e reagindo ao estado (NFR-0007; D-FS-05).
- REQ-FEAT-0007-07: O sistema SHALL ter, para cada critério de US-0002 a US-0005 observado no estado da
  simulação ou no arquivo de pista gerado, uma verificação determinística na saída de `npm test` que avança
  a simulação com `STEP` ou lê o arquivo, sem carregar a renderização, e indica o critério que verifica
  (NFR-0007).
- REQ-FEAT-0007-08: O sistema SHALL manter inalterados o valor de `STEP`, a forma de avançar a simulação
  (`step(state, input, dt)`) e o significado de cada campo de `Input`, com as verificações existentes desse
  contrato passando sem alteração (NFR-0008).
- REQ-FEAT-0007-09: O sistema SHALL NOT acrescentar campo de `Input` para a zebra: o efeito da zebra entra
  como dado de superfície da pista (NFR-0008).
- REQ-FEAT-0007-10: O sistema SHALL manter a pista sintética como a pista de 100 % dos ensaios automáticos
  de `dirigibilidade` e de `race-lap-validation`, sem que nenhum deles passe a usar a Kart Park (NFR-0009).
- REQ-FEAT-0007-11: O sistema SHALL NOT acrescentar dependência de execução ao jogo (NFR-0010).
- REQ-FEAT-0007-12: Retirado na rodada 5, com o NFR que realizava (NFR-0011, ordem de entrega depois de
  `dirigibilidade`, retirado dos requisitos porque a restrição saiu do seed na revisão 3). O id não é
  reaproveitado.
- REQ-FEAT-0007-13: O sistema SHALL NOT ser promovido para produção com a Kart Park, em qualquer versão,
  inclusive a versão 2, a réplica, antes de a decisão do dono do produto sobre a licença Esri estar
  registrada em `DOMAIN.md`; staging pode usar a pista (NFR-0012).

## Comportamento

Passo e retorno: [FLOW-0002](../flows/FLOW-0002-passo-de-simulacao-na-kart-park.md). Preparo e publicação:
[FLOW-0003](../flows/FLOW-0003-preparo-e-publicacao-do-arquivo-de-pista.md),
[RULE-0005](../rules/RULE-0005-versao-e-publicacao-da-pista.md). Contratos lidos pelos ensaios:
[API-0001](../api/API-0001-dado-de-pista-com-geometria-zebras-e-barreiras.md),
[API-0003](../api/API-0003-contato-do-kart-com-a-pista.md).

| Situação | Comportamento |
|---|---|
| Volta na Kart Park repetida com a mesma sequência de `Input` | Mesmo `lapMs` e mesmos `sectorMs`; a simulação não lê relógio de parede nem aleatório sem semente (I2) |
| Rede indisponível depois do carregamento | Escolha da pista, volta, zebra, barreira e crédito funcionam; só o destino do link pode não abrir (D-FS-08) |
| Ensaios de `dirigibilidade` e de `race-lap-validation` | Continuam na pista sintética, com os números calibrados nela; os ensaios desta feature usam a Kart Park |
| Licença Esri sem decisão | Staging com a Kart Park; nenhuma promoção para produção com ela, nem com a versão 1 nem com a 2; nenhuma etapa de especificação é bloqueada (NFR-0012) |
| Taxa de quadros abaixo do limite no aparelho de referência | O requisito falha; não há configuração que reduza o desenho da pista nem o acabamento para cumprir o limite ([FEAT-0008](FEAT-0008-acabamento-visual.md), requisito 24) |

## Estado

Não define estados próprios. O estado de publicação de uma versão da pista é o de
[RULE-0005](../rules/RULE-0005-versao-e-publicacao-da-pista.md).

## Configuração

Nenhuma. Nenhuma configuração existe para trocar a pista dos ensaios, desligar a zebra ou a barreira,
forçar uma superfície ou liberar a promoção.

## Critérios de aceite

- O teste registrado no notebook de referência mostra pelo menos 60 fps sustentados numa volta completa na
  Kart Park com o acabamento de US-0007 na tela, e o do celular intermediário, pelo menos 30 fps (cobre os requisitos 01 e 02).
- A saída de `npm test` avança a simulação na Kart Park pela mesma sequência de `Input` ao menos 2 vezes e
  compara `lapMs` e os 4 `sectorMs`, iguais em todas (cobre os requisitos 03 e 04).
- O registro de rede do navegador, da escolha da Kart Park ao fim de uma volta, em cada canal, não tem
  requisição a outro serviço (cobre o requisito 05).
- Cada critério de US-0002 a US-0005 observado na simulação ou no arquivo tem uma verificação de
  `npm test` que o nomeia e não carrega a renderização; nenhuma regra da lista do requisito 06 está na
  apresentação ou num adaptador (cobre os requisitos 06 e 07).
- A comparação do contrato de passo antes e depois da feature não mostra mudança em `STEP`, em
  `step(state, input, dt)` nem nos campos de `Input`, e as verificações existentes passam sem alteração
  (cobre os requisitos 08 e 09).
- A saída de `npm test` e dos benches de `dirigibilidade` e de `race-lap-validation` mostra a pista
  sintética em todos os seus ensaios (cobre o requisito 10).
- A lista de dependências de execução do projeto é a mesma antes e depois da feature (cobre o requisito
  11).
- O registro de liberação da etapa de deploy não tem promoção para produção com a Kart Park, em nenhuma
  versão, anterior à data da decisão em `DOMAIN.md` (cobre o requisito 13).

## Pontos em aberto

Nenhum.
