---
id: API-0001
title: Contrato do resultado e do estado da volta
feature: race-lap-validation
stage: fspec
status: validated
version: 1.2.0
sources: [US-0002, US-0004, US-0008, US-0009, US-0010, AC-US-0002-04, AC-US-0002-05, AC-US-0002-11, AC-US-0002-12, AC-US-0004-03, AC-US-0008-02, AC-US-0008-05, AC-US-0009-01, AC-US-0010-01, AC-US-0010-02, AC-US-0010-05, AC-US-0010-12, AC-US-0010-13, AC-US-0010-20, AC-US-0010-23, AC-US-0010-26, AC-US-0010-27, NFR-0004, NFR-0005]
---

# API-0001 — Contrato do resultado e do estado da volta

Contrato único entre a simulação e a apresentação (`web-desktop` e `web-mobile`). É um contrato em processo,
dentro do navegador: não há endpoint de rede, caminho HTTP nem prefixo no MVP (diretrizes do estágio; o
prefixo `/challenges/{challengeNumber}` é proposta pós-MVP e não se aplica). Os nomes seguem a diretriz D-FS-06
do projeto: `camelCase` plano, com a unidade como sufixo (`Ms`, `M`, `Count`, `Mps`), no lugar de `snake_case`.

## Operações

| Operação | Propósito | Quem chama |
|---|---|---|
| `getLapState` | Lê o estado corrente da volta para exibição | Apresentação, em todos os quadros do início de cada volta ao seu encerramento (AC-US-0009-01) |
| `getLapResult` | Lê o resultado da volta encerrada mais recente | Apresentação, ao encerrar a volta e, no treino, ao fim de cada volta; testes de `npm test` |
| `listLapResults` | Lê, em ordem, todos os resultados produzidos desde o último `startLap` aceito | Testes de `npm test` (um resultado por volta, AC-US-0010-20, AC-US-0010-26); apresentação, se precisar da sequência do treino |

## Auth

Sem sessão e sem conta (RNF10). Papel permitido: `player` (anônimo), único papel do produto. Contrato
deliberadamente público dentro do cliente: não existe segredo a proteger e a leitura não altera estado.

## Parâmetros

Nenhum parâmetro de caminho ou de consulta.

## Resposta de `getLapState`

| Campo | Tipo | Unidade | Obrigatório | Padrão e restrições |
|---|---|---|---|---|
| `lapPhase` | enum `COUNTDOWN`, `RUNNING`, `PAUSED`, `ENDED` | — | sim | sem padrão; ver [RULE-0002](../rules/RULE-0002-estados-da-volta.md). No treino, `ENDED` só depois de `endTraining` |
| `resumePhase` | enum `COUNTDOWN`, `RUNNING` | — | só com `lapPhase` `PAUSED` | ausente nos demais casos |
| `pauseCause` | enum `ESC_KEY`, `FOCUS_LOST`, `SENSOR_LOST`, `PAUSE_BUTTON` | — | só com `lapPhase` `PAUSED` | ausente nos demais casos; `PAUSE_BUTTON` só no treino |
| `lapKind` | enum `OFFICIAL`, `RECON`, `TRAINING` | — | sim | fixado em `startLap` |
| `lapValidity` | enum `VALID`, `INVALID` | — | sim | da volta em andamento; `VALID` até a primeira invalidação dela |
| `invalidReason` | enum `MISSED_MARKER`, `CUT`, `REPOSITION` | — | só com `lapValidity` `INVALID` | ausente com `VALID` |
| `countdownRemainingMs` | inteiro | ms | sim | de 3000 a 0; 0 depois do sinal verde |
| `elapsedMs` | inteiro | ms | sim | tempo da volta em andamento: 0 na contagem; tempo de simulação decorrido do sinal verde menos `lapStartMs` ([RULE-0003](../rules/RULE-0003-cronometragem-e-interpolacao.md)); congela na pausa e no fim |
| `stepCount` | inteiro | passos | sim | 0 na contagem; passos contados do sinal verde; contador de sequência; não recomeça a cada volta do treino |
| `lapSequenceCount` | inteiro | voltas | sim | posição da volta em andamento no treino, a partir de 1; 1 fora do treino. Neutro: fora do treino vale sempre 1, como toda volta tinha antes desta mudança |
| `lapStartMs` | inteiro | ms | sim | instante de início da volta em andamento, contado do sinal verde: 0 fora do treino e na primeira volta; nas voltas seguintes do treino, o instante de cruzamento que encerrou a anterior (AC-US-0010-01). Neutro: fora do treino vale sempre 0, o início que toda volta tinha antes desta mudança |
| `bestValidLapMs` | inteiro | ms | não | padrão: ausente. Só no treino, a partir do fim da primeira volta válida até o encerramento: o menor `trainingLapMs` entre os resultados `VALID` do treino; um resultado `INVALID` não o altera (AC-US-0010-12, AC-US-0010-13). Neutro: ausente fora do treino e antes da primeira volta válida |
| `completedSectorMs` | lista de 0 a 4 inteiros | ms | sim | tempos dos setores da volta em andamento, em ordem a partir do setor 1, até o primeiro setor sem tempo; lista vazia antes do primeiro limite e numa pista sem setores |
| `markersPassedCount` | inteiro | marcadores | sim | de 0 ao total de marcadores da pista; da volta em andamento |
| `trackId` | texto | — | sim | copiado do dado da pista lido ([API-0003](API-0003-dado-de-pista.md)) |
| `trackVersion` | valor do dado da pista | — | sim | copiado do dado da pista lido, sem interpretação |

O estado exibido na tela é derivado destes campos: `lapValidity` e `invalidReason` dão o estado e o motivo
([RULE-0006](../rules/RULE-0006-mensagens-de-estado-e-motivo.md)).

Resposta quando não há volta (nenhum `startLap` aceito): a operação retorna `NO_ACTIVE_LAP` e nenhum campo
de estado (ver Erros).

## Resposta de `getLapResult`

Existe um resultado quando uma volta foi encerrada desde o último `startLap` aceito: em volta oficial e de
reconhecimento, quando ela chegou a `ENDED` (conclusão ou invalidação); no treino, quando ao menos uma volta
foi concluída no cruzamento da chegada no sentido da pista. A operação devolve o resultado da volta encerrada
mais recente. Uma volta cruzada na contramão, recarregada, abandonada ou, no treino, em andamento no
`endTraining` não tem resultado.

| Campo | Tipo | Unidade | Obrigatório | Padrão e restrições |
|---|---|---|---|---|
| `trackId` | texto | — | sim | identifica a pista (AC-US-0002-11) |
| `trackVersion` | valor do dado da pista | — | sim | identifica a versão da pista (AC-US-0002-11) |
| `challengeNumber` | inteiro | — | não | padrão: ausente. Copiado do pedido `startLap` quando o desafio diário o informa; esta feature não o deriva. Neutro: ausente não muda nenhum comportamento da volta (I1; `SEED/IM-I1`) |
| `lapKind` | enum `OFFICIAL`, `RECON`, `TRAINING` | — | sim | |
| `lapValidity` | enum `VALID`, `INVALID` | — | sim | |
| `invalidReason` | enum `MISSED_MARKER`, `CUT`, `REPOSITION` | — | só com `INVALID` | o primeiro motivo da volta; nenhum segundo motivo é registrado |
| `official` | booleano | — | sim | `true` somente em volta `OFFICIAL`, `VALID`, concluída e em pista de dado `COMPLETE` ([RULE-0005](../rules/RULE-0005-tipos-de-volta-e-reposicionamento.md)); `false` nos demais casos (AC-US-0008-02, AC-US-0008-05) |
| `lapMs` | inteiro | ms | só com `VALID` | tempo total; ausente com `INVALID` (AC-US-0004-03). Significado e presença inalterados por esta mudança |
| `sectorMs` | lista de exatamente 4 inteiros | ms | só com `VALID` numa pista que declara setores | soma igual a `lapMs`, diferença de 0 ms (AC-US-0002-05); ausente com `INVALID` e numa pista sem setores declarados (AC-US-0010-27) |
| `lapSequenceCount` | inteiro | voltas | não | padrão quando ausente: 1. Presente em todo resultado `TRAINING`: posição da volta no treino, a partir de 1. Ausente em `OFFICIAL` e `RECON`. Neutro: um resultado sem o campo é o de uma volta única, como todo resultado anterior a esta mudança |
| `lapStartMs` | inteiro | ms | não | padrão quando ausente: 0. Presente em todo resultado `TRAINING`: instante de início da volta contado do sinal verde. Ausente em `OFFICIAL` e `RECON`. Neutro pelo mesmo motivo |
| `trainingLapMs` | inteiro | ms | só com `lapKind` `TRAINING` | tempo total da volta de treino, `b4` menos `b0` ([RULE-0003](../rules/RULE-0003-cronometragem-e-interpolacao.md)), presente também quando a volta é `INVALID` (AC-US-0010-02, AC-US-0010-05); igual a `lapMs` quando `VALID`. Ausente em `OFFICIAL` e `RECON`. Neutro: nenhum resultado anterior era de volta seguinte do treino, e um leitor que não conhece o campo segue lendo `lapMs` com o mesmo significado |
| `trainingSectorMs` | lista de exatamente 4 posições, cada uma inteiro ou `null` | ms | só com `lapKind` `TRAINING` numa pista que declara setores | posição i é o tempo do setor i, ou `null` quando o setor não tem tempo, exibido como "—" (AC-US-0010-23; `DOMAIN/DEC-13`); igual a `sectorMs` quando `VALID`. Ausente em `OFFICIAL`, `RECON` e numa pista sem setores declarados (AC-US-0010-27). Neutro pelo mesmo motivo de `trainingLapMs` |
| `setupId` | enum `ARCADE_ASSISTIDO`, `REALISTA_ALUGUEL_4T` | — | não | padrão quando ausente: `ARCADE_ASSISTIDO`, o acerto padrão anterior à declaração de versão do acerto. Copiado do pedido `startLap` ([API-0002](API-0002-comandos-da-volta.md)) sem interpretação; esta feature não o deriva. Neutro: um resultado sem o campo é lido como o acerto que o produziu e nenhum comportamento da volta (validade, tempo, motivo) muda (I5; FB-01 de `dirigibilidade`) |
| `setupVersion` | texto | — | não | padrão quando ausente: a `previousSetupVersion` declarada para o `setupId` no dado publicado (`getSetupVersion`, contrato `API-0002` de `dirigibilidade`). Copiado do pedido `startLap` sem interpretação; esta feature não o deriva. Neutro: um resultado anterior continua legível e só passa a ser distinguível de um novo pela leitura deste campo (I3, I5; FB-01 de `dirigibilidade`) |

Todos os valores de tempo são milissegundos inteiros (AC-US-0002-04). A forma na resposta vazia: sem
resultado, a operação retorna `NO_RESULT` e nenhum campo.

No treino, todas as voltas de um mesmo `startLap` têm o mesmo `trackId`, `trackVersion`, `setupId` e
`setupVersion`; por isso `bestValidLapMs` compara só tempos comparáveis por construção.

`setupId` e `setupVersion` identificam o acerto do resultado como `trackId` e `trackVersion` identificam a
pista; nenhum dos dois altera validade, tempo ou motivo. O resultado é o registro do qual o replay e o texto
compartilhado — contratos que não pertencem a este conjunto — copiam os dois campos. A comparabilidade entre
dois resultados é decidida fora desta feature (`compareLapRecords`, contrato `API-0002` de `dirigibilidade`)
e consumida pela tela de resultado ([SCR-0003](../screens/SCR-0003-resultado-da-volta.md)).

Nenhum campo do resultado carrega dado pessoal (NFR-0005).

## Resposta de `listLapResults`

| Campo | Tipo | Obrigatório | Restrições |
|---|---|---|---|
| `lapResults` | lista de resultados com a forma de `getLapResult` | sim | em ordem de encerramento; em volta oficial e de reconhecimento, 0 ou 1 item; no treino, 1 item por volta concluída na chegada, com `lapSequenceCount` de 1 em diante, sem repetição e sem lacuna (AC-US-0010-20, AC-US-0010-26) |

Forma na resposta vazia: `lapResults` igual a lista vazia, quando nenhuma volta foi encerrada desde o último
`startLap` aceito ou quando nenhum `startLap` foi aceito. Um `startLap` aceito depois de `ENDED` começa uma
lista nova; guardar resultados entre voltas ou entre treinos é do desafio diário (etapa 5, fora do escopo).

## Erros

Não há status HTTP. Cada operação retorna um destes resultados de rejeição, sem lançar nem alterar estado:

| Código | Operação | Condição | Corpo |
|---|---|---|---|
| `NO_ACTIVE_LAP` | `getLapState` | nenhuma volta foi aceita ainda | apenas o código |
| `NO_RESULT` | `getLapResult` | nenhuma volta foi encerrada desde o último `startLap` aceito, ou não há volta | apenas o código |

`listLapResults` não rejeita: sem resultado, devolve a lista vazia.

## Idempotência

As três operações são leituras: repetir a chamada devolve o mesmo valor enquanto o estado da simulação não
avança, e não altera estado. Não há chave. Exatamente 1 resultado por volta: em volta oficial e de
reconhecimento, depois de `ENDED` o resultado não muda, mesmo que a chegada seja cruzada de novo
(AC-US-0002-12; I7); no treino, o resultado de uma volta não muda depois de produzido, e um novo cruzamento
da chegada produz o resultado da volta seguinte, nunca um segundo resultado da mesma (AC-US-0010-20,
AC-US-0010-26).

## Paginação e sondagem

Sem paginação: `listLapResults` devolve a lista inteira de um treino, que só cresce de 1 item por volta
concluída. A apresentação lê `getLapState` em todos os quadros renderizados durante `COUNTDOWN`, `RUNNING`,
`PAUSED` e `ENDED` (AC-US-0009-01); não há intervalo de sondagem de rede.

## Compatibilidade

Contrato novo: nenhum campo, caminho ou parâmetro publicado é renomeado ou removido por ele. A validação
preliminar por gates sequenciais do protótipo é aposentada e substituída por este contrato e por
[API-0002](API-0002-comandos-da-volta.md); os requisitos não nomeiam campo publicado dessa validação, então
não há campo a rejeitar. Os campos de unidade carregam o sufixo no nome (`Ms`), e o significado de nenhum
deles muda em versões futuras sem mudança de nome (I3).

Rodada de 2026-10-22 (FB-01 de `dirigibilidade`, aceito): `setupId` e `setupVersion` são acrescentados à
resposta de `getLapResult` como campos opcionais e aditivos. Nenhum campo é renomeado ou removido e nenhum
muda de significado ou de unidade. Um resultado gravado antes desta mudança é lido sem erro, com os padrões
da tabela (I5); um resultado produzido a partir dela carrega os dois campos informados em `startLap`. Não há
campo a rejeitar.

Rodada de 2026-10-30 (seed `revision: 3`, US-0010, voltas seguidas no treino):

| Mudança | Tratamento |
|---|---|
| Operação `listLapResults` | Acrescentada; leitura sem efeito |
| `getLapState`: `lapSequenceCount`, `lapStartMs` (obrigatórios), `bestValidLapMs` (opcional) | Acrescentados; fora do treino valem 1, 0 e ausente, o que toda volta tinha antes |
| `getLapResult`: `lapSequenceCount`, `lapStartMs`, `trainingLapMs`, `trainingSectorMs` | Acrescentados, opcionais, presentes só em resultado `TRAINING`; padrões neutros na tabela |
| `pauseCause`: valor `PAUSE_BUTTON` | Acrescentado ao enum; aparece só no treino. Um leitor que não conhece o valor só o encontra num treino pausado pelo botão |
| `elapsedMs`, `completedSectorMs`, `markersPassedCount`, `lapValidity` | Mesmo nome, unidade e significado: medem a volta em andamento, cujo início fora do treino segue sendo o sinal verde |
| `lapMs`, `sectorMs` | Mesmo nome, unidade, significado e condição de presença (só `VALID`); `sectorMs` não existe numa pista sem setores, caso que só é jogável no treino e que os requisitos decidiram agora (`DOMAIN/DEC-13`) |
| Comportamento de `TRAINING` | Muda por decisão do seed (`SEED/US-10`, `DOMAIN/DEC-12`): o treino não vai a `ENDED` na chegada nem na invalidação; `getLapResult` devolve a volta mais recente do treino. `OFFICIAL` e `RECON` não mudam |

Nenhum campo é renomeado, removido ou tem significado, unidade ou domínio de valores alterado; não há campo a
rejeitar.
