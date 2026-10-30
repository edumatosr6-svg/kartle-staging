---
id: SCR-0002
title: Resultado da volta e texto compartilhado sem comparação entre versões do acerto
feature: dirigibilidade
stage: fspec
status: validated
version: 1.2.0
sources: [US-0003, US-0005, NFR-0009, AC-US-0003-09, AC-US-0003-11, AC-US-0005-04, AC-US-0005-05, AC-US-0005-07]
---

# SCR-0002 — Resultado da volta e texto compartilhado sem comparação entre versões do acerto

## Propósito

O que esta feature muda na tela de resultado e no texto compartilhado: a regra de que um tempo só é
comparado com outro de versão de acerto igual, na tela (AC-US-0005-05) e no texto compartilhado
(AC-US-0005-07), sem elemento nem texto novo de tela — a versão do acerto é dado do registro
([API-0002](../api/API-0002-versao-do-acerto.md)), usado para decidir a comparabilidade, e não é exibida
(RNF11: nenhum texto novo de tela); e retira, nos dois, o que mostrava o drift e o
turbo — indicador de carga de drift, de turbo ou de impulso, combo e pontuação de drift (AC-US-0003-09,
AC-US-0003-11) —, só como remoção de exibição, sem regra nova na renderização (`SEED/RE-01`,
`DOMAIN/DEC-16`). A tela
de resultado da volta (tempo total, setores, validade) é da feature `race-lap-validation`, nomeada e não
redefinida; este arquivo especifica apenas a regra e a retirada. A decisão de comparabilidade é da simulação e do
leitor de registros ([RULE-0003](../rules/RULE-0003-versao-do-acerto-e-comparabilidade.md)); a tela só
exibe o resultado dela (I2).

## Canal

Ambos, sem diferença: mesma regra de comparabilidade, nenhum texto novo. A tela usa
[API-0002](../api/API-0002-versao-do-acerto.md) (`compareLapRecords`, `readReplay`, `getSetupVersion`).

## Pontos de entrada

Ao fim da volta, a partir de [SCR-0001](SCR-0001-hud-de-velocidade-e-aderencia.md); ao abrir um tempo ou
replay gravado; ao compartilhar um resultado.

## Estados

| Estado | Condição | Chamadas | O que a tela mostra | Fonte |
|---|---|---|---|---|
| Carregando | O resultado ou o registro gravado ainda está sendo lido | `readReplay`, `getSetupVersion` | Nenhum tempo comparado ainda | API-0002 |
| Vazio | Não há resultado (volta sem resultado) ou nenhum registro gravado para comparar | `readReplay` retorna `UNREADABLE` por ausência | O tempo corrente, se houver, como a tela de resultado já o mostra; nenhuma comparação | AC-US-0005-05 |
| Populado | Resultado lido; registros para comparar lidos | `compareLapRecords` para cada par exibido | O tempo corrente, como a tela de resultado já o mostra; `COMPARABLE`: comparação (diferença, melhor tempo, ordenação) exibida; `SETUP_VERSION_DIFFERS`, `SETUP_DIFFERS`, `TRACK_DIFFERS`: nenhuma comparação — o outro tempo não entra em diferença, melhor tempo nem ordenação com o corrente; nenhum indicador de carga de drift, de turbo ou de impulso, combo ou pontuação de drift | AC-US-0005-05, AC-US-0003-09 |
| Erro | `UNSUPPORTED_FORMAT` ou `INCOMPLETE_RECORD` | `readReplay`, `compareLapRecords` | O registro não é comparado nem descartado; o tempo corrente é exibido; nenhuma comparação com o registro em erro | API-0002 (I4) |
| Offline | Sem rede | nenhuma chamada de rede | Nenhuma diferença: registros e dado publicado são locais; nenhum aviso de rede | RNF08, D-FS-08 |
| Permissão negada | `web-mobile` com sensor ausente ou permissão negada | nenhuma | Não se aplica à tela: ela não usa o sensor; o resultado e a comparação não mudam | US-0005, Canais |
| Permissão negada em `web-desktop` | Não se aplica | — | O canal não pede sensor | US-0005, Canais |

O texto compartilhado, gerado em `web-desktop` ou em `web-mobile`, nunca contém comparação entre tempos de
versões diferentes (AC-US-0005-07) e nunca contém indicador de carga de drift, de turbo ou de impulso, combo ou pontuação de drift
(AC-US-0003-11), em nenhum estado da tela. Esta feature não acrescenta texto à tela de resultado nem ao
texto compartilhado: a `setupVersion` não é exibida nem compartilhada (RNF11; `01-context.md` dos
requisitos, nenhum elemento de tela novo).

## Ações do Jogador

| Ação | Canal | Resultado |
|---|---|---|
| Abrir um tempo ou replay gravado | ambos | `readReplay`; estado Populado, Vazio ou Erro |
| Compartilhar o resultado | ambos | Texto compartilhado com o tempo; sem comparação entre versões diferentes; sem conteúdo de drift ou turbo |
| Reproduzir um replay | ambos | [FLOW-0003](../flows/FLOW-0003-leitura-de-replay-e-comparacao.md); o tempo obtido de um replay de outra versão nunca é apresentado como equivalente ao gravado |

## Navegação

Entrada a partir do fim da volta ([SCR-0001](SCR-0001-hud-de-velocidade-e-aderencia.md)) ou da abertura de
um registro gravado; a saída é a da tela de resultado de `race-lap-validation`, inalterada.
