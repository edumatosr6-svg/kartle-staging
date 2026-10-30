---
id: ADR-0004
title: Lacunas deliberadas do F-Spec que o projeto precisa fechar
feature: race-lap-validation
stage: dspec
status: validated
version: 1.1.0
sources: [FEAT-0005, FEAT-0006, FEAT-0008, FEAT-0010, REQ-FEAT-0005-11, REQ-FEAT-0006-15, REQ-FEAT-0008-13, REQ-FEAT-0010-02, REQ-FEAT-0010-11, REQ-FEAT-0010-16, REQ-FEAT-0010-22, REQ-FEAT-0010-27]
---

# ADR-0004 — Lacunas deliberadas do F-Spec que o projeto precisa fechar

## Contexto

O F-Spec (`01-overview.md`, "Lacunas deliberadas") recusou decidir pontos que uma implementação determinística não
pode deixar indefinidos. A simulação não pode ter comportamento aleatório em nenhum deles (I8, D-DS-07). Cada
escolha abaixo é a mais estreita que fecha a lacuna sem acrescentar interface além da que o F-Spec pede, e é anotada
no changelog como decisão de projeto, não de requisito. A realimentação ao F-Spec só é necessária se o dono do produto
discordar.

Rodada de 2026-10-30: o F-Spec revalidado contra o seed `revision: 3` (`DOMAIN/DEC-12`, `DOMAIN/DEC-13`) decidiu o
treino de voltas seguidas e o resultado de uma volta de treino numa pista de dado incompleto que declara chegada e
sentido. O item 3 deixa de ser lacuna e passa a seguir o F-Spec; os itens 5 a 9 são lacunas novas do treino.

## Decisão

1. **Precedência no mesmo passo.** Num passo `RUNNING`, avaliam-se primeiro os cruzamentos de linha (marcador, setor,
   chegada) e depois o corte. Uma chegada que encerra uma volta oficial ou de reconhecimento prevalece sobre um corte
   que o mesmo passo configuraria, pois o cruzamento acontece dentro do passo e o corte é decidido no fim dele. No
   treino, a chegada encerra a volta em andamento e inicia a seguinte dentro do passo, e o corte decidido no fim do
   passo vale para a volta que está em andamento no fim dele, a que acabou de começar (RULE-0004: o corte é atribuído
   à volta em andamento no passo em que a duração é ultrapassada). Um reposicionamento é aplicado entre dois passos,
   antes do seguinte.
2. **Destino do reposicionamento.** O ponto da linha central mais próximo do kart, com o rumo da linha central no
   sentido de percurso, velocidade 0 e estado de física como `initialState()`. O deslocamento é avaliado para
   cruzamentos de linha como qualquer deslocamento do kart.
3. **Volta num dado `INCOMPLETE`.** A volta é pilotável como treino: contagem, cronômetro, pausa, reposicionamento
   livre e corte se aplicam. As linhas que a leitura declara — chegada, limites de setor, marcadores — são avaliadas
   quando ela declara `direction` e `finishLine`; sem um dos dois, nenhuma linha é avaliada e nenhuma volta termina na
   chegada, e o que se cronometra é o tempo de passos desde o início da volta. Sem marcadores declarados, a condição
   "todos os marcadores em ordem" vale com zero marcadores (RULE-0001); sem limites de setor declarados, o resultado
   não tem tempo de setor (`DOMAIN/DEC-13`, REQ-FEAT-0010-27). Todo resultado é não oficial. O posicionamento inicial
   usa `startPosition` se for válido, senão o ponto de índice 0 da linha central, com o rumo existente.
4. **Pausa manual em `web-mobile` fora do treino.** Não é projetada: os requisitos não a exigem e o botão de pausa
   (`PAUSE_BUTTON`) existe só no treino (API-0002). Ver ADR-0005.
5. **Por quanto tempo o resultado de cada volta do treino fica na tela.** Do primeiro quadro depois do cruzamento que
   encerrou a volta até ser substituído pelo resultado da volta seguinte ou até o encerramento do treino. O painel
   fica numa área própria, sem cobrir o estado da volta em andamento, e não pede ação (SCR-0001;
   [DES-0008](../web/DES-0008-hud-da-volta-mensagens-e-idioma.md)).
6. **Volta `VALID` numa leitura `INCOMPLETE` a que falta uma fronteira de setor.** Numa pista `COMPLETE` uma volta
   válida tem sempre as três fronteiras registradas (DM-0001, C4 a C7); numa leitura `INCOMPLETE` que declara os
   limites mas não garante a sua travessia, uma volta sem marcadores declarados pode chegar válida sem ter cruzado um
   limite. Nesse caso o resultado traz `lapMs` e `trainingLapMs`, `trainingSectorMs` com `null` nos setores sem
   tempo, e nenhum `sectorMs`: quatro inteiros cuja soma é o total (AC-US-0002-05) não existem. A regra de presença de
   `sectorMs` de API-0001 (só com `VALID`, numa pista que declara setores) é cumprida em toda pista `COMPLETE`.
7. **Kart depois do encerramento de uma volta de reconhecimento.** Fica parado na posição do passo do encerramento,
   como na volta oficial (REQ-FEAT-0010-22): `stepLap` devolve a mesma sessão em `ENDED`. É o comportamento já em
   execução; o F-Spec não o fixa para o reconhecimento.
8. **Atalho de teclado para o botão de pausa e para "encerrar treino".** Nenhum: as duas ações são controles com
   rótulo em texto, por ponteiro e por toque (SCR-0001). Esc continua a pausar em `web-desktop`, com a causa `ESC_KEY`.
9. **Saída de pista que atravessa a chegada no treino.** `offTrackSteps` não recomeça no início de uma volta
   (RULE-0004), e cada passo com a duração ultrapassada é um passo de corte (tabela de decisão de RULE-0004): a volta
   que começa durante uma saída já além dos limites fica `INVALID` com `CUT` no fim do passo em que começou. A
   exibição de "válida em andamento" no início de cada volta seguinte (REQ-FEAT-0010-11) vale para toda volta que não
   começa dentro de um corte em curso.

## Alternativas consideradas

| Alternativa | Por que não |
|---|---|
| Cortar antes da chegada no mesmo passo | faria um kart que cruzou a chegada válida dentro do passo perder a volta por um efeito posterior ao cruzamento |
| No treino, atribuir o corte do passo da chegada à volta que acabou de terminar | o resultado dela já foi produzido no instante do cruzamento e não muda depois (I7, INV-11) |
| Reposicionar na última posição segura gravada | exige guardar histórico de posições, estado extra sem requisito que o peça |
| Num dado `INCOMPLETE`, não avaliar nenhuma linha (decisão da versão 1.0.0) | contraria `DOMAIN/DEC-13` e REQ-FEAT-0010-27: a pista que declara chegada e sentido tem resultado com tempo total e validade |
| Num dado `INCOMPLETE`, avaliar a chegada sem exigir `direction` | o sentido da travessia é o do dado; sem o sentido declarado, o dado não diz qual travessia é a da pista |
| Num dado `INCOMPLETE`, inventar `sectorMs` com zeros ou com o tempo restante | publicaria tempos de setor que não foram medidos |
| Resultado do treino exibido por um tempo fixo e depois oculto | os requisitos recusaram fixar a duração; ocultar sem novo evento acrescentaria uma regra de relógio na apresentação |
| Atalho de teclado para pausar e encerrar o treino | superfície que nenhum critério pede |
| Pausa manual por toque fora do treino com nova causa | muda o enum de API-0001 e API-0002 fora do que o F-Spec decidiu (proposta ao autor, não deste conjunto) |

## Consequências

- Um corte exatamente no passo da chegada nunca invalida uma volta oficial ou de reconhecimento já concluída, nem o
  resultado já produzido de uma volta do treino.
- Reposicionar em treino perto de um limite de setor pode contar o limite, de forma consistente com a regra
  do deslocamento; isso só afeta voltas não oficiais.
- Pistas de dado incompleto que declaram chegada e sentido produzem resultado de treino com tempo total e validade,
  sempre não oficial; as que não declaram não encerram volta.
- Se o dono do produto decidir de outra forma qualquer destes pontos, a mudança é local a `src/lap.ts`, a
  `src/main.ts` e a este ADR, sem alterar contratos publicados.

## Status

Aceita neste conjunto. Itens 1 a 3, 5 a 7 e 9 são decisões de projeto (o item 3 segue o F-Spec a partir da rodada de
2026-10-30); os itens 4 e 8 são registros de uma não decisão.
